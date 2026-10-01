(function () {
  'use strict';

  const api = {
    start
  };

  window.StoryConstructionGame = api;

  function start(config) {
    if (!config || !config.storageKey || !config.levelName) {
      throw new Error('StoryConstructionGame requires a complete level configuration.');
    }

    const QUIZ_LENGTH = config.quizLength || 5;
    const QUIZ_PASS = config.quizPass || 4;
    const MAX_HEARTS = config.maxHearts || 3;
    const STREAK_TARGET = config.streakTarget || 5;
    const RECENT_ANSWER_WINDOW = config.recentAnswerWindow || 3;

    const concepts = config.concepts || [];
    const conceptGlossary = config.conceptGlossary || {};
    const glossaryExampleVariants = config.glossaryExampleVariants || {};
    const lessonScreens = config.lessonScreens || [];
    const practicePools = config.practicePools || {};
    const quizPools = config.quizPools || {};
    const realWorldProof = config.realWorldProof || [];
    const copy = config.copy || {};

    const screen = document.getElementById('screen');
    const progressBar = document.getElementById('progressBar');
    const progressLabel = document.getElementById('progressLabel');
    const eyebrow = document.getElementById('eyebrow');
    const heartDisplay = document.getElementById('heartDisplay');
    const streakDisplay = document.getElementById('streakDisplay');
    const mapDialog = document.getElementById('mapDialog');
    const mapButton = document.getElementById('mapButton');
    const closeMap = document.getElementById('closeMap');
    const conceptMap = document.getElementById('conceptMap');
    const termDialog = document.getElementById('termDialog');
    const closeTerm = document.getElementById('closeTerm');
    const termDialogCategory = document.getElementById('termDialogCategory');
    const termDialogTitle = document.getElementById('termDialogTitle');
    const termDialogDefinition = document.getElementById('termDialogDefinition');
    const termDialogExample = document.getElementById('termDialogExample');
    const termExampleLabel = document.getElementById('termExampleLabel');
    const anotherTermExample = document.getElementById('anotherTermExample');

    let state = loadState();
    let variationHistory = loadVariationHistory();
    let feedbackLock = false;
    let currentTermKey = null;
    let currentTermExampleIndex = 0;

    function defaultState() {
      return {
        view: 'welcome',
        lessonIndex: 0,
        practicePhase: 'basic',
        practiceIndex: 0,
        selectedQuestionIds: { basic: [], hard: [], gate: [] },
        currentQuestion: null,
        mistakesInPhase: 0,
        hearts: MAX_HEARTS,
        streak: 0,
        gatePassed: false,
        quizAttempt: 1,
        quizIndex: 0,
        quizCorrect: 0,
        quizSet: [],
        previousQuizIds: [],
        quizPassed: false,
        completed: false,
        startedAt: null,
        answerState: null
      };
    }

    function loadState() {
      try {
        const parsed = JSON.parse(localStorage.getItem(config.storageKey));
        if (!parsed) return defaultState();
        const merged = {
          ...defaultState(),
          ...parsed,
          selectedQuestionIds: {
            basic: [],
            hard: [],
            gate: [],
            ...(parsed.selectedQuestionIds || {})
          }
        };
        if (!merged.answerState || typeof merged.answerState !== 'object') {
          merged.answerState = null;
        }
        return merged;
      } catch {
        return defaultState();
      }
    }

    function saveState() {
      localStorage.setItem(config.storageKey, JSON.stringify(state));
    }

    function resetState() {
      localStorage.removeItem(config.storageKey);
      localStorage.removeItem(config.variationHistoryKey);
      state = defaultState();
      variationHistory = loadVariationHistory();
      render();
    }

    function normalizeTag(value) {
      return String(value || '')
        .toLowerCase()
        .replace(/[’']/g, "'")
        .replace(/[^a-z0-9'-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const knownSemanticTerms = Array.from(new Set([
      ...Object.values(conceptGlossary).map(entry => normalizeTag(entry && entry.label)),
      ...(config.semanticTerms || []).map(normalizeTag)
    ].filter(Boolean)));

    function textContainsTerm(text, term) {
      if (!text || !term) return false;
      const haystack = ` ${normalizeTag(text)} `;
      const needle = ` ${term} `;
      return haystack.includes(needle);
    }

    function correctAnswerTexts(question) {
      if (!question) return [];
      if (Array.isArray(question.answerTags) && question.answerTags.length) {
        return question.answerTags;
      }
      if ((question.type === 'single' || question.type === 'truefalse') && Number.isInteger(question.answer)) {
        return [question.options[question.answer]];
      }
      if (question.type === 'multi' && Array.isArray(question.answer)) {
        return question.answer.map(index => question.options[index]);
      }
      if (question.type === 'order' && Array.isArray(question.answer)) {
        return question.answer;
      }
      return [];
    }

    function questionSemanticTags(question) {
      if (Array.isArray(question.answerTags) && question.answerTags.length) {
        return Array.from(new Set(question.answerTags.map(normalizeTag).filter(Boolean)));
      }

      const correctTexts = correctAnswerTexts(question);
      const matchedTerms = [];
      for (const answerText of correctTexts) {
        for (const term of knownSemanticTerms) {
          if (textContainsTerm(answerText, term)) matchedTerms.push(term);
        }
      }

      if (matchedTerms.length) {
        return Array.from(new Set(matchedTerms));
      }

      const fallback = correctTexts.map(normalizeTag).filter(Boolean);
      return Array.from(new Set(fallback.length ? fallback : [normalizeTag(question.id)]));
    }

    function migrateAnswerTagSets(parsed) {
      if (Array.isArray(parsed.answerTagSets)) {
        return parsed.answerTagSets
          .filter(Array.isArray)
          .map(group => Array.from(new Set(group.map(normalizeTag).filter(Boolean))))
          .filter(group => group.length)
          .slice(-RECENT_ANSWER_WINDOW);
      }

      if (Array.isArray(parsed.answerTags)) {
        return parsed.answerTags
          .map(tag => [normalizeTag(tag)])
          .filter(group => group[0])
          .slice(-RECENT_ANSWER_WINDOW);
      }

      if (Array.isArray(parsed.answerKeys)) {
        return parsed.answerKeys
          .map(key => String(key).split('|').map(normalizeTag).filter(Boolean))
          .filter(group => group.length)
          .slice(-RECENT_ANSWER_WINDOW);
      }

      return [];
    }

    function loadVariationHistory() {
      const fallback = {
        practice: { basic: [], hard: [], gate: [] },
        quiz: [],
        answerTagSets: [],
        examples: {}
      };

      try {
        const parsed = JSON.parse(localStorage.getItem(config.variationHistoryKey));
        if (!parsed) return fallback;
        return {
          ...fallback,
          ...parsed,
          practice: { ...fallback.practice, ...(parsed.practice || {}) },
          answerTagSets: migrateAnswerTagSets(parsed),
          examples: parsed.examples || {}
        };
      } catch {
        return fallback;
      }
    }

    function saveVariationHistory() {
      localStorage.setItem(config.variationHistoryKey, JSON.stringify(variationHistory));
    }

    function shuffle(values) {
      const copyValues = [...values];
      for (let i = copyValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copyValues[i], copyValues[j]] = [copyValues[j], copyValues[i]];
      }
      return copyValues;
    }

    function prepareQuestion(source) {
      const q = JSON.parse(JSON.stringify(source));
      q.sourceId = source.id;

      if (q.type === 'single' || q.type === 'multi') {
        const correctIndexes = Array.isArray(q.answer) ? q.answer : [q.answer];
        const shuffledOptions = shuffle(q.options.map((textValue, originalIndex) => ({
          text: textValue,
          correct: correctIndexes.includes(originalIndex)
        })));
        q.options = shuffledOptions.map(item => item.text);
        const remapped = shuffledOptions
          .map((item, index) => item.correct ? index : -1)
          .filter(index => index >= 0);
        q.answer = Array.isArray(source.answer) ? remapped : remapped[0];
      } else if (q.type === 'order') {
        const items = shuffle(q.items);
        if (items.every((item, index) => item === q.answer[index]) && items.length > 1) {
          [items[0], items[1]] = [items[1], items[0]];
        }
        q.items = items;
      }

      return q;
    }

    function recentSemanticTags(additionalTagSets) {
      const tagSets = [
        ...(variationHistory.answerTagSets || []),
        ...(additionalTagSets || [])
      ];
      return new Set(tagSets.flat().map(normalizeTag).filter(Boolean));
    }

    function hasRecentTag(question, recentTags) {
      return questionSemanticTags(question).some(tag => recentTags.has(tag));
    }

    function chooseWithHistory(pool, recentIds = [], usedIds = [], additionalTagSets = []) {
      const unused = pool.filter(question => !usedIds.includes(question.id));
      const recentTags = recentSemanticTags(additionalTagSets);
      const tiers = [
        unused.filter(question => !recentIds.includes(question.id) && !hasRecentTag(question, recentTags)),
        unused.filter(question => !hasRecentTag(question, recentTags)),
        unused.filter(question => !recentIds.includes(question.id)),
        unused,
        pool.filter(question => !hasRecentTag(question, recentTags)),
        pool
      ];
      const candidates = tiers.find(list => list.length) || pool;
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    function rememberQuestion(kind, question, limit) {
      const id = typeof question === 'string' ? question : question.id;
      if (kind === 'quiz') {
        variationHistory.quiz = [...variationHistory.quiz.filter(value => value !== id), id].slice(-limit);
      } else {
        const current = variationHistory.practice[kind] || [];
        variationHistory.practice[kind] = [...current.filter(value => value !== id), id].slice(-limit);
      }

      if (typeof question !== 'string') {
        const tags = questionSemanticTags(question);
        if (tags.length) {
          variationHistory.answerTagSets = [
            ...(variationHistory.answerTagSets || []),
            tags
          ].slice(-RECENT_ANSWER_WINDOW);
        }
      }
      saveVariationHistory();
    }

    function buildQuizSet() {
      const previous = new Set(state.previousQuizIds || []);
      const selected = [];
      const selectedTagSets = [];

      for (const pool of Object.values(quizPools)) {
        const recent = variationHistory.quiz || [];
        const noPrevious = pool.filter(question => !previous.has(question.id));
        const sourcePool = noPrevious.length ? noPrevious : pool;
        const chosen = chooseWithHistory(sourcePool, recent, [], selectedTagSets);
        selected.push(prepareQuestion(chosen));
        selectedTagSets.push(questionSemanticTags(chosen));
        rememberQuestion('quiz', chosen, 12);
      }

      state.quizSet = shuffle(selected);
      state.previousQuizIds = state.quizSet.map(question => question.sourceId);
    }

    function prerequisiteMet() {
      if (!config.prerequisite) return true;
      try {
        const prior = JSON.parse(localStorage.getItem(config.prerequisite.storageKey));
        return Boolean(prior && prior.completed);
      } catch {
        return false;
      }
    }

    function setView(view) {
      state.view = view;
      saveState();
      render();
    }

    function updateStatus() {
      heartDisplay.innerHTML = Array.from({ length: MAX_HEARTS }, (_, index) =>
        `<span class="heart ${index < state.hearts ? '' : 'empty'}" aria-hidden="true">♥</span>`
      ).join('');
      heartDisplay.setAttribute(
        'aria-label',
        `${state.hearts} ${state.hearts === 1 ? 'heart' : 'hearts'} remaining`
      );
      streakDisplay.textContent = `${state.streak} / ${STREAK_TARGET}`;

      if (!prerequisiteMet()) {
        eyebrow.textContent = `Level ${config.levelNumber} · ${config.levelName}`;
        progressLabel.textContent = 'Locked';
        progressBar.style.width = '0%';
        return;
      }

      const levelLabel = `Level ${config.levelNumber} · ${config.levelName}`;
      const map = {
        welcome: [levelLabel, 'Welcome', 0],
        lesson: [`Learn · ${config.levelName}`, `Lesson ${state.lessonIndex + 1} of ${lessonScreens.length}`, 8 + (state.lessonIndex / Math.max(lessonScreens.length, 1)) * 32],
        practiceIntro: [`Practice · ${config.levelName}`, 'Difficulty ladder', 42],
        practice: [
          `Practice · ${config.levelName}`,
          state.practicePhase === 'basic' ? 'Basic challenges' : state.practicePhase === 'hard' ? 'Harder challenges' : 'Challenge gate',
          state.practicePhase === 'basic' ? 48 + state.practiceIndex * 4 : state.practicePhase === 'hard' ? 62 + state.practiceIndex * 5 : 74
        ],
        gateSuccess: [`Checkpoint · ${config.levelName}`, 'Gate cleared', 78],
        quizIntro: [`Quiz · ${config.levelName}`, 'Completion checkpoint', 80],
        quiz: [`Quiz · ${config.levelName}`, `Question ${state.quizIndex + 1} of ${QUIZ_LENGTH}`, 82 + (state.quizIndex / QUIZ_LENGTH) * 10],
        quizResult: [`Quiz · ${config.levelName}`, state.quizPassed ? 'Concept completed' : 'Review needed', state.quizPassed ? 94 : 86],
        proof: ['Real-world proof', `${config.levelName} in published work`, 97],
        complete: [levelLabel, 'Completed', 100],
        gameOver: [levelLabel, 'Game over', 74]
      };
      const [eye, label, pct] = map[state.view] || map.welcome;
      eyebrow.textContent = eye;
      progressLabel.textContent = label;
      progressBar.style.width = `${pct}%`;
    }

    function shell({ kicker = '', title = '', body = '', actions = '' }) {
      screen.innerHTML = `
        <div class="screen-stack">
          <div class="content-grow">
            ${kicker ? `<span class="stage-kicker">${kicker}</span>` : ''}
            ${title ? `<h2>${title}</h2>` : ''}
            ${body}
          </div>
          <div class="screen-actions">${actions}</div>
        </div>`;
    }

    function render() {
      feedbackLock = false;
      updateStatus();
      renderConceptMap();

      if (!prerequisiteMet()) {
        renderPrerequisiteLocked();
        return;
      }

      if (state.view === 'welcome') renderWelcome();
      else if (state.view === 'lesson') renderLesson();
      else if (state.view === 'practiceIntro') renderPracticeIntro();
      else if (state.view === 'practice') renderPractice();
      else if (state.view === 'gateSuccess') renderGateSuccess();
      else if (state.view === 'quizIntro') renderQuizIntro();
      else if (state.view === 'quiz') renderQuiz();
      else if (state.view === 'quizResult') renderQuizResult();
      else if (state.view === 'proof') renderProof();
      else if (state.view === 'complete') renderComplete();
      else if (state.view === 'gameOver') renderGameOver();
      else {
        state.view = 'welcome';
        saveState();
        renderWelcome();
      }
    }

    function renderPrerequisiteLocked() {
      const prerequisite = config.prerequisite;
      shell({
        kicker: `Story Construction · Level ${config.levelNumber}`,
        title: copy.lockedTitle || `${config.levelName} unlocks after ${prerequisite.levelName}.`,
        body: copy.lockedBody || `<p class="lede">Complete ${prerequisite.levelName} before starting ${config.levelName}.</p>`,
        actions: `<button class="primary-button" id="prerequisiteBtn" type="button">${prerequisite.buttonText || `Go to ${prerequisite.levelName}`}</button>`
      });
      document.getElementById('prerequisiteBtn').addEventListener('click', () => {
        window.storyConstructionNavigate(prerequisite.navigate);
      });
    }

    function renderWelcome() {
      const actions = [];
      if (config.previousLevel) {
        actions.push(`<button class="secondary-button" id="previousLevelBtn" type="button">${config.previousLevel.buttonText}</button>`);
      }
      actions.push(`<button class="secondary-button" id="resetBtn" type="button">${copy.resetButtonText || 'Reset progress'}</button>`);
      actions.push(`<button class="primary-button" id="startBtn" type="button">${copy.startButtonText || 'Start level'}</button>`);

      shell({
        kicker: `Story Construction · Level ${config.levelNumber}`,
        title: copy.welcomeTitle || `Learn ${config.levelName}.`,
        body: copy.welcomeBody || '',
        actions: actions.join('')
      });

      if (config.previousLevel) {
        document.getElementById('previousLevelBtn').addEventListener('click', () => {
          window.storyConstructionNavigate(config.previousLevel.navigate);
        });
      }
      document.getElementById('startBtn').addEventListener('click', () => {
        if (!state.startedAt) state.startedAt = new Date().toISOString();
        state.view = 'lesson';
        state.lessonIndex = 0;
        state.answerState = null;
        saveState();
        render();
      });
      document.getElementById('resetBtn').addEventListener('click', resetState);
    }

    function renderLesson() {
      const item = lessonScreens[state.lessonIndex];
      if (!item) {
        state.lessonIndex = 0;
        saveState();
        return renderLesson();
      }
      const last = state.lessonIndex === lessonScreens.length - 1;
      shell({
        kicker: item.stage,
        title: item.title,
        body: item.html,
        actions: `${state.lessonIndex > 0 ? '<button class="secondary-button" id="backBtn" type="button">Back</button>' : ''}<button class="primary-button" id="nextBtn" type="button">${last ? 'Start practice' : 'Continue'}</button>`
      });
      if (state.lessonIndex > 0) {
        document.getElementById('backBtn').addEventListener('click', () => {
          state.lessonIndex--;
          saveState();
          render();
        });
      }
      document.getElementById('nextBtn').addEventListener('click', () => {
        if (last) state.view = 'practiceIntro';
        else state.lessonIndex++;
        saveState();
        render();
      });
    }

    function renderPracticeIntro() {
      shell({
        kicker: 'Stage 7 · Progressive practice',
        title: copy.practiceIntroTitle || 'Practice the concept.',
        body: copy.practiceIntroBody || '',
        actions: '<button class="secondary-button" id="lessonBtn" type="button">Review lesson</button><button class="primary-button" id="practiceBtn" type="button">Begin challenges</button>'
      });
      document.getElementById('lessonBtn').addEventListener('click', () => {
        state.view = 'lesson';
        state.lessonIndex = 0;
        state.answerState = null;
        saveState();
        render();
      });
      document.getElementById('practiceBtn').addEventListener('click', () => {
        state.practicePhase = 'basic';
        state.practiceIndex = 0;
        state.mistakesInPhase = 0;
        state.currentQuestion = null;
        state.answerState = null;
        state.selectedQuestionIds = { basic: [], hard: [], gate: [] };
        setView('practice');
      });
    }

    function getPhaseCount() {
      return state.practicePhase === 'basic' ? 3 : state.practicePhase === 'hard' ? 2 : 1;
    }

    function getQuestionForPhase() {
      if (state.currentQuestion) return state.currentQuestion;
      const phase = state.practicePhase;
      const pool = practicePools[phase];
      const used = state.selectedQuestionIds[phase] || [];
      const recent = variationHistory.practice[phase] || [];
      const chosen = chooseWithHistory(pool, recent, used);
      state.currentQuestion = prepareQuestion(chosen);
      state.selectedQuestionIds[phase] = [...used, chosen.id];
      rememberQuestion(phase, chosen, phase === 'basic' ? 9 : phase === 'hard' ? 7 : 4);
      saveState();
      return state.currentQuestion;
    }

    function renderPractice() {
      if (state.hearts <= 0) {
        state.view = 'gameOver';
        state.answerState = null;
        saveState();
        render();
        return;
      }

      const q = getQuestionForPhase();
      const count = getPhaseCount();
      const label = state.practicePhase === 'basic'
        ? `Basic ${state.practiceIndex + 1} of ${count}`
        : state.practicePhase === 'hard'
          ? `Harder ${state.practiceIndex + 1} of ${count}`
          : 'Challenge gate';

      const intro = state.practicePhase === 'gate'
        ? `<div class="gate-banner"><strong>Challenge gate</strong><p>Pass this checkpoint to reach the ${config.levelName} quiz. A wrong answer costs one heart.</p></div>`
        : '';

      renderQuestionScreen(
        q,
        label,
        intro,
        handlePracticeAnswer,
        'practice',
        () => advancePractice(Boolean(state.answerState && state.answerState.correct))
      );
    }

    function questionIdentity(q) {
      return q && (q.sourceId || q.id);
    }

    function answerStateMatches(mode, q) {
      return Boolean(
        state.answerState &&
        state.answerState.mode === mode &&
        state.answerState.questionId === questionIdentity(q)
      );
    }

    function renderQuestionScreen(q, kicker, preface, onAnswer, mode, onContinue) {
      const body = `
        ${preface || ''}
        <p class="question-prompt">${q.prompt}</p>
        ${renderQuestionInput(q)}
        <div id="feedbackSlot"></div>`;
      const needsSubmit = q.type === 'multi' || q.type === 'order';

      shell({
        kicker,
        title: '',
        body,
        actions: needsSubmit ? '<button class="primary-button" id="submitAnswer" type="button">Check answer</button>' : ''
      });

      if (q.type === 'single' || q.type === 'truefalse') {
        screen.querySelectorAll('.answer-option').forEach(btn => {
          btn.addEventListener('click', () => {
            if (feedbackLock || answerStateMatches(mode, q)) return;
            onAnswer(q, Number(btn.dataset.index));
          });
        });
      } else if (q.type === 'multi') {
        document.getElementById('submitAnswer').addEventListener('click', () => {
          if (feedbackLock || answerStateMatches(mode, q)) return;
          const selected = [...screen.querySelectorAll('input[type="checkbox"]:checked')]
            .map(element => Number(element.value));
          onAnswer(q, selected);
        });
      } else if (q.type === 'order') {
        setupDragAndDrop();
        document.getElementById('submitAnswer').addEventListener('click', () => {
          if (feedbackLock || answerStateMatches(mode, q)) return;
          const order = [...screen.querySelectorAll('.drag-item')].map(element => element.dataset.value);
          onAnswer(q, order);
        });
      }

      if (answerStateMatches(mode, q)) {
        const restored = state.answerState;
        markAnswerVisuals(q, restored.answer);
        showFeedback(
          restored.correct,
          q.explanation,
          mode === 'quiz'
            ? (state.quizIndex === QUIZ_LENGTH - 1 ? 'Finish quiz' : 'Next question')
            : 'Continue',
          onContinue,
          Boolean(restored.heartLost)
        );
      }
    }

    function renderQuestionInput(q) {
      if (q.type === 'single' || q.type === 'truefalse') {
        return `<div class="answers">${q.options.map((option, index) => `<button class="answer-option" type="button" data-index="${index}">${option}</button>`).join('')}</div>`;
      }
      if (q.type === 'multi') {
        return `<div class="check-list">${q.options.map((option, index) => `<label class="check-row"><input type="checkbox" value="${index}"><span>${option}</span></label>`).join('')}</div>`;
      }
      if (q.type === 'order') {
        return `<div class="drag-list" id="dragList">${q.items.map(item => dragItem(item)).join('')}</div><p class="question-context">Drag the rows, or use the arrow buttons.</p>`;
      }
      return '';
    }

    function dragItem(item) {
      return `<div class="drag-item" draggable="true" tabindex="0" data-value="${item}"><span class="drag-handle" aria-hidden="true">⋮⋮</span><strong>${item}</strong><span class="drag-actions"><button type="button" data-move="up" aria-label="Move ${item} up">↑</button><button type="button" data-move="down" aria-label="Move ${item} down">↓</button></span></div>`;
    }

    function setupDragAndDrop() {
      const list = document.getElementById('dragList');
      let dragged = null;
      list.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', () => {
          dragged = item;
          item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          dragged = null;
        });
        item.addEventListener('dragover', event => {
          event.preventDefault();
          if (!dragged || dragged === item) return;
          const box = item.getBoundingClientRect();
          const after = event.clientY > box.top + box.height / 2;
          list.insertBefore(dragged, after ? item.nextSibling : item);
        });
      });

      list.addEventListener('click', event => {
        const btn = event.target.closest('button[data-move]');
        if (!btn || feedbackLock) return;
        const item = btn.closest('.drag-item');
        if (btn.dataset.move === 'up' && item.previousElementSibling) {
          list.insertBefore(item, item.previousElementSibling);
        }
        if (btn.dataset.move === 'down' && item.nextElementSibling) {
          list.insertBefore(item.nextElementSibling, item);
        }
      });
    }

    function isCorrect(q, answer) {
      if (Array.isArray(q.answer)) {
        if (!Array.isArray(answer) || answer.length !== q.answer.length) return false;
        if (q.type === 'order') return q.answer.every((value, index) => answer[index] === value);
        const actual = [...answer].sort((a, b) => a - b);
        const expected = [...q.answer].sort((a, b) => a - b);
        return actual.every((value, index) => value === expected[index]);
      }
      return answer === q.answer;
    }

    function markAnswerVisuals(q, answer) {
      if (q.type === 'single' || q.type === 'truefalse') {
        screen.querySelectorAll('.answer-option').forEach((btn, index) => {
          btn.disabled = true;
          if (index === q.answer) btn.classList.add('correct');
          else if (index === answer) btn.classList.add('incorrect');
        });
      } else if (q.type === 'multi') {
        screen.querySelectorAll('.check-row').forEach((row, index) => {
          const input = row.querySelector('input');
          input.disabled = true;
          const should = q.answer.includes(index);
          const chosen = answer.includes(index);
          if (should) row.classList.add('is-correct');
          if (chosen && !should) row.classList.add('is-incorrect');
        });
      } else if (q.type === 'order') {
        screen.querySelectorAll('.drag-item').forEach(item => {
          item.draggable = false;
        });
        screen.querySelectorAll('.drag-actions button').forEach(btn => {
          btn.disabled = true;
        });
      }
      const submit = document.getElementById('submitAnswer');
      if (submit) submit.disabled = true;
    }

    function showFeedback(correct, explanation, buttonText, callback, heartLost = false) {
      feedbackLock = true;
      const slot = document.getElementById('feedbackSlot');
      slot.innerHTML = `<div class="feedback ${correct ? 'good' : 'bad'}"><div class="feedback-title"><span aria-hidden="true">${correct ? '✓' : '×'}</span>${correct ? 'Correct' : 'Not quite'}</div><p>${explanation}</p>${heartLost ? '<span class="heart-note">A challenge-gate miss costs 1 heart.</span>' : ''}</div>`;
      let actions = screen.querySelector('.screen-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'screen-actions';
        screen.querySelector('.screen-stack').appendChild(actions);
      }
      actions.innerHTML = `<button class="primary-button" id="continueAfterFeedback" type="button">${buttonText}</button>`;
      document.getElementById('continueAfterFeedback').addEventListener('click', callback, { once: true });
    }

    function adjustStreak(correct) {
      if (!correct) {
        state.streak = 0;
        return;
      }
      state.streak++;
      if (state.streak >= STREAK_TARGET) {
        if (state.hearts < MAX_HEARTS) state.hearts++;
        state.streak = 0;
      }
    }

    function handlePracticeAnswer(q, answer) {
      if (answerStateMatches('practice', q)) return;

      const correct = isCorrect(q, answer);
      let heartLost = false;

      adjustStreak(correct);
      if (!correct) {
        state.mistakesInPhase++;
        if (state.practicePhase === 'gate') {
          state.hearts = Math.max(0, state.hearts - 1);
          heartLost = true;
        }
      }

      state.answerState = {
        mode: 'practice',
        questionId: questionIdentity(q),
        answer,
        correct,
        heartLost
      };

      saveState();
      updateStatus();
      markAnswerVisuals(q, answer);
      showFeedback(correct, q.explanation, 'Continue', () => advancePractice(correct), heartLost);
    }

    function advancePractice(correct) {
      const phase = state.practicePhase;
      const count = getPhaseCount();
      state.currentQuestion = null;
      state.answerState = null;

      if (state.hearts <= 0) {
        state.view = 'gameOver';
        saveState();
        render();
        return;
      }

      if (!correct && phase !== 'gate' && state.mistakesInPhase >= 2) {
        state.practiceIndex = 0;
        state.mistakesInPhase = 0;
        state.selectedQuestionIds[phase] = [];
        saveState();
        renderPhaseReset(phase);
        return;
      }

      if (phase === 'gate') {
        if (correct) {
          state.gatePassed = true;
          state.view = 'gateSuccess';
        } else {
          state.practiceIndex = 0;
        }
        saveState();
        render();
        return;
      }

      state.practiceIndex++;
      if (state.practiceIndex >= count) {
        state.practiceIndex = 0;
        state.mistakesInPhase = 0;
        if (phase === 'basic') state.practicePhase = 'hard';
        else if (phase === 'hard') state.practicePhase = 'gate';
      }

      saveState();
      render();
    }

    function renderPhaseReset(phase) {
      const name = phase === 'basic' ? 'basic' : 'harder';
      shell({
        kicker: 'Learning loop',
        title: `Two misses — replay the ${name} rung.`,
        body: '<p class="lede">You stay at the same difficulty, but the rung restarts with different examples. Practice mistakes do not cost hearts.</p><div class="callout"><strong>Why restart?</strong><p>The aim is to stabilize the idea before moving to the gate, not punish a single mistake.</p></div>',
        actions: '<button class="primary-button" id="retryRung" type="button">Try new examples</button>'
      });
      document.getElementById('retryRung').addEventListener('click', () => {
        state.view = 'practice';
        saveState();
        render();
      });
    }

    function renderGateSuccess() {
      shell({
        kicker: 'Challenge gate cleared',
        title: copy.gateSuccessTitle || `The ${config.levelName} gate is cleared.`,
        body: copy.gateSuccessBody || `<div class="gate-success"><div class="gate-burst" aria-hidden="true">✦</div><p class="lede">The ${config.levelName} quiz is now unlocked.</p></div>`,
        actions: `<button class="primary-button" id="quizReady" type="button">Go to ${config.levelName} quiz</button>`
      });
      document.getElementById('quizReady').addEventListener('click', () => {
        state.view = 'quizIntro';
        state.quizIndex = 0;
        state.quizCorrect = 0;
        state.answerState = null;
        saveState();
        render();
      });
    }

    function renderQuizIntro() {
      shell({
        kicker: 'Stage 8 · Concept quiz',
        title: `Completion check: ${config.levelName}`,
        body: copy.quizIntroBody || '',
        actions: `<button class="secondary-button" id="reviewBeforeQuiz" type="button">Review lesson</button><button class="primary-button" id="beginQuiz" type="button">Begin attempt ${state.quizAttempt}</button>`
      });
      document.getElementById('reviewBeforeQuiz').addEventListener('click', () => {
        state.view = 'lesson';
        state.lessonIndex = 0;
        state.answerState = null;
        saveState();
        render();
      });
      document.getElementById('beginQuiz').addEventListener('click', () => {
        state.view = 'quiz';
        state.quizIndex = 0;
        state.quizCorrect = 0;
        state.answerState = null;
        buildQuizSet();
        saveState();
        render();
      });
    }

    function renderQuiz() {
      if (!state.quizSet || state.quizSet.length !== QUIZ_LENGTH) {
        buildQuizSet();
        state.answerState = null;
        saveState();
      }

      const q = state.quizSet[state.quizIndex];
      const dots = `<div class="quiz-status"><span>Attempt ${state.quizAttempt}</span><span class="dot-row">${state.quizSet.map((_, index) => `<span class="dot ${index < state.quizIndex ? 'done' : ''}"></span>`).join('')}</span></div>`;

      renderQuestionScreen(
        q,
        `${config.levelName} quiz · ${state.quizIndex + 1}/${QUIZ_LENGTH}`,
        dots,
        handleQuizAnswer,
        'quiz',
        advanceQuiz
      );
    }

    function handleQuizAnswer(q, answer) {
      if (answerStateMatches('quiz', q)) return;

      const correct = isCorrect(q, answer);
      if (correct) state.quizCorrect++;

      state.answerState = {
        mode: 'quiz',
        questionId: questionIdentity(q),
        answer,
        correct,
        heartLost: false
      };

      saveState();
      markAnswerVisuals(q, answer);
      showFeedback(
        correct,
        q.explanation,
        state.quizIndex === QUIZ_LENGTH - 1 ? 'Finish quiz' : 'Next question',
        advanceQuiz
      );
    }

    function advanceQuiz() {
      state.answerState = null;
      state.quizIndex++;
      if (state.quizIndex >= QUIZ_LENGTH) {
        state.quizPassed = state.quizCorrect >= QUIZ_PASS;
        if (state.quizPassed) state.completed = true;
        state.view = 'quizResult';
      }
      saveState();
      render();
    }

    function resetQuizForLesson() {
      state.quizAttempt = 1;
      state.quizIndex = 0;
      state.quizCorrect = 0;
      state.quizPassed = false;
      state.quizSet = [];
      state.previousQuizIds = [];
      state.answerState = null;
      state.lessonIndex = 0;
      state.view = 'lesson';
      saveState();
      render();
    }

    function renderQuizResult() {
      if (state.quizPassed) {
        shell({
          kicker: 'Concept completion',
          title: `${config.levelName} completed.`,
          body: copy.quizPassedBody || `<p class="lede">Completion means you successfully finished the initial ${config.levelName} sequence. It does <strong>not</strong> mean every depth of ${config.levelName} is permanently mastered.</p><div class="callout"><strong>Next:</strong><p>Real-world proof reinforces the concept with identifiable published works. It is not another scored challenge.</p></div>`,
          actions: '<button class="primary-button" id="proofBtn" type="button">See real-world proof</button>'
        });
        document.getElementById('proofBtn').addEventListener('click', () => setView('proof'));
        return;
      }

      const secondFailure = state.quizAttempt >= 2;
      shell({
        kicker: 'Completion checkpoint',
        title: secondFailure ? 'Return to the lesson before another attempt.' : 'One immediate retry is available.',
        body: `<p class="lede">The quiz is a completion checkpoint, not a punishment. ${secondFailure ? `The second attempt did not pass, so the learning sequence resets to the ${config.levelName} lesson.` : 'Review the explanations you just saw, then make one immediate retry.'}</p>`,
        actions: secondFailure
          ? `<button class="primary-button" id="returnLesson" type="button">Return to ${config.levelName} lesson</button>`
          : '<button class="secondary-button" id="reviewQuizLesson" type="button">Review first</button><button class="primary-button" id="retryQuiz" type="button">Retry quiz</button>'
      });

      if (secondFailure) {
        document.getElementById('returnLesson').addEventListener('click', resetQuizForLesson);
      } else {
        document.getElementById('reviewQuizLesson').addEventListener('click', () => {
          state.view = 'lesson';
          state.lessonIndex = 0;
          state.answerState = null;
          saveState();
          render();
        });
        document.getElementById('retryQuiz').addEventListener('click', () => {
          state.quizAttempt = 2;
          state.quizIndex = 0;
          state.quizCorrect = 0;
          state.quizPassed = false;
          state.answerState = null;
          buildQuizSet();
          state.view = 'quiz';
          saveState();
          render();
        });
      }
    }

    function renderProof() {
      shell({
        kicker: 'Stage 9 · Real-world proof',
        title: copy.proofTitle || `${config.levelName} is visible in published stories.`,
        body: `<p class="lede">${copy.proofLead || 'These examples reinforce the concept using published works. They are evidence screens, not scored questions.'}</p><div class="proof-grid">${realWorldProof.map(proof => `<article class="proof-card"><span class="mini-label">${proof.work}</span><h3>${proof.title}</h3><p>${proof.body}</p><div class="proof-source"><span>${proof.source}</span><a href="${proof.url}" target="_blank" rel="noopener noreferrer">Open source ↗</a></div></article>`).join('')}</div>`,
        actions: `<button class="primary-button" id="finishLevel" type="button">Complete level ${config.levelNumber}</button>`
      });
      document.getElementById('finishLevel').addEventListener('click', () => {
        state.completed = true;
        state.view = 'complete';
        state.answerState = null;
        saveState();
        render();
      });
    }

    function renderComplete() {
      const actions = [
        `<button class="secondary-button" id="replayLevel" type="button">Replay ${config.levelName}</button>`
      ];

      if (config.previousLevel) {
        actions.push(`<button class="secondary-button" id="reviewPrevious" type="button">${config.previousLevel.buttonText}</button>`);
      }

      actions.push('<button class="secondary-button" id="viewMapDone" type="button">View concept path</button>');

      if (config.nextLevel) {
        actions.push(`<button class="primary-button" id="startNextLevel" type="button">${config.nextLevel.buttonText}</button>`);
      }

      shell({
        body: copy.completeBody || `<div class="level-complete"><div class="seal" aria-hidden="true">✦</div><span class="mini-label">Story Construction · ${config.levelName}</span><h1>Level complete.</h1></div>`,
        actions: actions.join('')
      });

      document.getElementById('replayLevel').addEventListener('click', () => {
        const hearts = state.hearts;
        state = defaultState();
        state.hearts = hearts;
        state.view = 'lesson';
        state.startedAt = new Date().toISOString();
        saveState();
        render();
      });

      if (config.previousLevel) {
        document.getElementById('reviewPrevious').addEventListener('click', () => {
          window.storyConstructionNavigate(config.previousLevel.navigate);
        });
      }

      document.getElementById('viewMapDone').addEventListener('click', () => mapDialog.showModal());

      if (config.nextLevel) {
        document.getElementById('startNextLevel').addEventListener('click', () => {
          window.storyConstructionNavigate(config.nextLevel.navigate);
        });
      }
    }

    function renderGameOver() {
      shell({
        kicker: '0 hearts',
        title: 'This run has ended.',
        body: copy.gameOverBody || `<p class="lede">Only challenge-gate misses can remove hearts. This prototype returns you to the ${config.levelName} lesson with three hearts.</p>`,
        actions: '<button class="primary-button" id="restartAfterGameOver" type="button">Restart from lesson</button>'
      });
      document.getElementById('restartAfterGameOver').addEventListener('click', () => {
        state.hearts = MAX_HEARTS;
        state.streak = 0;
        state.practicePhase = 'basic';
        state.practiceIndex = 0;
        state.mistakesInPhase = 0;
        state.currentQuestion = null;
        state.answerState = null;
        state.selectedQuestionIds = { basic: [], hard: [], gate: [] };
        state.lessonIndex = 0;
        state.view = 'lesson';
        saveState();
        render();
      });
    }

    function getTermExamples(key) {
      const entry = conceptGlossary[key];
      return entry ? [entry.example, ...(glossaryExampleVariants[key] || [])] : [];
    }

    function showTermExample(key, requestedIndex = null) {
      const examples = getTermExamples(key);
      if (!examples.length) return;
      const previous = variationHistory.examples[key];
      let index = requestedIndex;
      if (index === null) {
        const candidates = examples.map((_, i) => i).filter(i => i !== previous);
        const pool = candidates.length ? candidates : examples.map((_, i) => i);
        index = pool[Math.floor(Math.random() * pool.length)];
      }
      currentTermExampleIndex = ((index % examples.length) + examples.length) % examples.length;
      termDialogExample.textContent = examples[currentTermExampleIndex];
      termExampleLabel.textContent = `Illustrative example ${currentTermExampleIndex + 1} of ${examples.length}`;
      anotherTermExample.hidden = examples.length < 2;
      variationHistory.examples[key] = currentTermExampleIndex;
      saveVariationHistory();
    }

    function openTermDialog(key) {
      const entry = conceptGlossary[key];
      if (!entry) return;
      currentTermKey = key;
      termDialogCategory.textContent = entry.category;
      termDialogTitle.textContent = entry.label;
      termDialogDefinition.textContent = entry.definition;
      showTermExample(key);
      termDialog.showModal();
    }

    function closeTermDialog() {
      currentTermKey = null;
      if (termDialog.open) termDialog.close();
    }

    function priorConceptCompleted(index) {
      const prior = (config.priorConcepts || []).find(item => item.index === index);
      if (!prior) return false;
      try {
        const saved = JSON.parse(localStorage.getItem(prior.storageKey));
        return Boolean(saved && saved.completed);
      } catch {
        return false;
      }
    }

    function renderConceptMap() {
      conceptMap.innerHTML = concepts.map((name, index) => {
        if (index < config.conceptIndex) {
          const completed = priorConceptCompleted(index);
          return `<li class="${completed ? 'current' : 'locked'}"><span class="map-number">${index + 1}</span><span class="map-name">${name}</span><span class="map-state">${completed ? 'Completed' : 'Prerequisite'}</span></li>`;
        }

        if (index === config.conceptIndex) {
          return `<li class="current"><span class="map-number">${index + 1}</span><span class="map-name">${name}</span><span class="map-state">${state.completed ? 'Completed' : 'Current'}</span></li>`;
        }

        if (index === config.conceptIndex + 1) {
          const nextBuilt = Boolean(config.nextLevel);
          const status = state.completed && nextBuilt ? 'Unlocked' : state.completed ? 'Locked' : `Complete ${config.levelName}`;
          return `<li class="${state.completed && nextBuilt ? 'current' : 'locked'}"><span class="map-number">${index + 1}</span><span class="map-name">${name}</span><span class="map-state">${status}</span></li>`;
        }

        return `<li class="locked"><span class="map-number">${index + 1}</span><span class="map-name">${name}</span><span class="map-state">Locked</span></li>`;
      }).join('');
    }

    screen.addEventListener('click', event => {
      const trigger = event.target.closest('[data-term]');
      if (trigger) openTermDialog(trigger.dataset.term);
    });

    anotherTermExample.addEventListener('click', () => {
      if (!currentTermKey) return;
      const examples = getTermExamples(currentTermKey);
      showTermExample(currentTermKey, (currentTermExampleIndex + 1) % examples.length);
    });

    closeTerm.addEventListener('click', closeTermDialog);
    termDialog.addEventListener('click', event => {
      const rect = termDialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) closeTermDialog();
    });

    mapButton.addEventListener('click', () => mapDialog.showModal());
    closeMap.addEventListener('click', () => mapDialog.close());
    mapDialog.addEventListener('click', event => {
      const rect = mapDialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) mapDialog.close();
    });

    render();
  }
})();
