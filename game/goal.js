'use strict';

const APP_VERSION = '2.0.0-goal';
const STORAGE_KEY = 'writecraft-level2-goal-state-v1';
const VARIATION_HISTORY_KEY = 'writecraft-level2-goal-variation-history-v1';
const CHARACTER_STORAGE_KEY = 'writecraft-level1-state-v1';
const QUIZ_LENGTH = 5;
const QUIZ_PASS = 4;
const MAX_HEARTS = 3;
const STREAK_TARGET = 5;

const concepts = [
  "Character",
  "Goal",
  "Motivation",
  "Stakes",
  "Conflict",
  "Obstacles",
  "Cause and Effect",
  "Plot",
  "Setting",
  "Point of View",
  "Scenes",
  "Escalation",
  "Turning Points",
  "Setup and Payoff",
  "Character Arc",
  "Story Arc",
  "Climax",
  "Resolution",
  "Theme"
];

const conceptGlossary = {
  "goal.goal": {
    "category": "Goal",
    "label": "Goal",
    "definition": "What a character is trying to achieve.",
    "example": "Nora keeps searching the flooded house because she is trying to recover her grandmother's letters before the water destroys them."
  },
  "appearance.stated": {
    "category": "How a goal appears",
    "label": "Stated directly",
    "definition": "The story tells the reader plainly what the character is trying to achieve.",
    "example": "Darin says he will reach the mountain station before nightfall, making the intended achievement explicit."
  },
  "appearance.inferred": {
    "category": "How a goal appears",
    "label": "Inferred from behaviour",
    "definition": "The story does not state the goal outright, but repeated choices and actions let the reader work out what the character is trying to achieve.",
    "example": "Mei checks every exit, hides her passport inside her coat, and waits for the guard to turn away. The reader can infer that she is trying to get out."
  },
  "scope.immediate": {
    "category": "How a goal appears",
    "label": "Immediate",
    "definition": "A goal focused on something the character is trying to accomplish in the near term.",
    "example": "During a power failure, Ishan's immediate aim is to reach the basement breaker panel."
  },
  "scope.ongoing": {
    "category": "How a goal appears",
    "label": "Longer-running",
    "definition": "A goal that continues to guide the character across a larger stretch of the story.",
    "example": "Across the journey, Rosa keeps working toward bringing her missing sister home."
  },
  "boundary.action": {
    "category": "Goal boundaries",
    "label": "Action / step",
    "definition": "Something a character does while pursuing a goal. An action can serve a goal without being the goal itself.",
    "example": "Calling three hospitals is an action. Finding where an injured friend was taken is the goal those calls are meant to achieve."
  },
  "boundary.situation": {
    "category": "Goal boundaries",
    "label": "Situation / circumstance",
    "definition": "A condition the character is in. A situation can create the need for a goal, but it is not itself what the character is trying to achieve.",
    "example": "Being stranded after the last bus is a situation. Getting home before morning is a goal."
  },
  "mechanism.direction": {
    "category": "How goals work",
    "label": "Direction",
    "definition": "A clear goal gives the character's choices a recognizable destination.",
    "example": "Once Talia decides to recover the stolen ledger, searching the office, questioning the clerk, and following the courier all point toward the same intended result."
  },
  "mechanism.choice": {
    "category": "How goals work",
    "label": "Choice filter",
    "definition": "A goal helps the reader understand why a character chooses one action over another.",
    "example": "Because Ben is trying to keep the bridge open until the evacuation ends, he stays to repair the controls instead of leaving with the first rescue boat."
  },
  "mechanism.progress": {
    "category": "How goals work",
    "label": "Progress",
    "definition": "A goal gives the reader something against which movement can be understood: closer, farther away, changed, achieved, or abandoned.",
    "example": "Each new clue brings Niko closer to identifying who sent the anonymous warning, so the reader can feel the investigation advancing."
  },
  "change.shift": {
    "category": "Goal over time",
    "label": "Goal can change",
    "definition": "New information or events can cause a character to replace one intended achievement with another.",
    "example": "Ari begins by trying to win the race, but after seeing a teammate crash, Ari abandons that aim and turns back to help."
  }
};

const glossaryExampleVariants = {
  "goal.goal": [
    "Eli waits outside the courthouse all morning because he is trying to speak to the witness before she leaves town.",
    "Sam keeps repairing the old transmitter because she is trying to contact the rescue ship."
  ],
  "appearance.stated": [
    "Priya tells her brother, 'I'm getting Dad's watch back tonight.' The intended achievement is stated directly.",
    "The narrator explains that Leon intends to prove the garden was poisoned rather than diseased."
  ],
  "appearance.inferred": [
    "Mara never says what she wants, but she studies the guard schedule, copies a key, and packs food for the night. Her behaviour lets the reader infer that she plans to enter the building after hours.",
    "Jon keeps moving every framed photograph out of sight whenever visitors arrive. Without saying it aloud, his behaviour suggests he is trying to conceal someone's identity."
  ],
  "scope.immediate": [
    "With smoke entering the hallway, Keira's near-term aim is to get the child through the window.",
    "Before the train leaves, Omar is trying to reach platform six with the medicine."
  ],
  "scope.ongoing": [
    "Throughout the novel, Dev keeps pursuing the larger aim of clearing his mother's name.",
    "Across many chapters, Lina continues working toward reopening the closed community theatre."
  ],
  "boundary.action": [
    "Climbing the fence is an action; reaching the locked greenhouse before dawn is the intended achievement.",
    "Interviewing witnesses is an action; discovering who took the missing painting is the goal."
  ],
  "boundary.situation": [
    "The school is about to close permanently. That is the situation; persuading the board to keep it open is what the students are trying to achieve.",
    "A blizzard has cut off the village. That is the circumstance; restoring radio contact is the goal."
  ],
  "mechanism.direction": [
    "Once Hana decides to find the missing map, several otherwise separate choices become part of the same pursuit.",
    "Tomas wants to reach the summit before the weather turns. That aim gives direction to decisions about route, equipment, and timing."
  ],
  "mechanism.choice": [
    "Because Asha is trying to prevent the letter from being mailed, her decision to leave the meeting early makes sense to the reader.",
    "Luca wants to keep his sister from being arrested, so he destroys the note instead of handing it to the detective."
  ],
  "mechanism.progress": [
    "The reader can tell that Mira is getting closer to opening the vault as she obtains the key, learns the code, and reaches the sealed room.",
    "Every failed attempt to cross the river leaves Caleb farther from his aim of reaching the clinic before dark."
  ],
  "change.shift": [
    "Nadia begins by trying to expose the mayor, but after learning the evidence was forged, she shifts to finding who created it.",
    "Theo enters the cave hoping to retrieve a camera. When he hears someone calling for help, rescuing the trapped climber becomes his new goal."
  ]
};

const glossaryGroups = {
  "appearance": [
    "appearance.stated",
    "appearance.inferred",
    "scope.immediate",
    "scope.ongoing"
  ],
  "boundaries": [
    "boundary.action",
    "boundary.situation"
  ],
  "mechanism": [
    "mechanism.direction",
    "mechanism.choice",
    "mechanism.progress"
  ],
  "change": [
    "change.shift"
  ]
};

function glossaryLink(key) {
  const entry = conceptGlossary[key];
  return `<button class="term-link" type="button" data-term="${key}" aria-haspopup="dialog">${entry.label}</button>`;
}

function glossaryGrid(groupName) {
  return `<div class="term-grid">${glossaryGroups[groupName].map(key => {
    const entry = conceptGlossary[key];
    return `<button class="term-tile" type="button" data-term="${key}" aria-haspopup="dialog"><strong>${entry.label}</strong><span>Definition + example</span></button>`;
  }).join('')}</div>`;
}

const lessonScreens = [
  {
    stage: 'Stage 1 · What is it?',
    title: 'A goal is what the character is trying to achieve.',
    html: `
      <div class="hero-word" aria-hidden="true">goal</div>
      <p class="lede">A <strong>goal</strong> is the result a character is trying to make happen. It gives the reader something concrete to understand about the character's direction.</p>
      <div class="callout"><strong>Key idea:</strong><p>Ask: <em>What is this character trying to achieve?</em></p></div>`
  },
  {
    stage: 'Stage 2 · What forms can it take?',
    title: 'A goal may be stated — or inferred.',
    html: `
      <p class="lede">Sometimes the story tells the reader plainly what the character wants to achieve. Other times, repeated behaviour lets the reader work it out.</p>
      <div class="callout"><strong>These are descriptive patterns, not terms to memorize.</strong><p>The important skill is recognizing the intended achievement regardless of how it is presented.</p></div>
      <div class="term-grid">
        ${['appearance.stated','appearance.inferred'].map(key => { const entry=conceptGlossary[key]; return `<button class="term-tile" type="button" data-term="${key}" aria-haspopup="dialog"><strong>${entry.label}</strong><span>Definition + example</span></button>`; }).join('')}
      </div>`
  },
  {
    stage: 'Stage 2 · What forms can it take?',
    title: 'A goal can matter now — or keep guiding the story.',
    html: `
      <p class="lede">Some goals concern an immediate situation. Others continue across many actions or scenes. These are ways a goal can operate, not a new classification system.</p>
      <div class="term-grid">
        ${['scope.immediate','scope.ongoing'].map(key => { const entry=conceptGlossary[key]; return `<button class="term-tile" type="button" data-term="${key}" aria-haspopup="dialog"><strong>${entry.label}</strong><span>Definition + example</span></button>`; }).join('')}
      </div>`
  },
  {
    stage: 'Stage 3 · What is it not?',
    title: 'The goal is not the same as the action.',
    html: `
      <p class="lede">A character may take many actions while pursuing one intended achievement.</p>
      <div class="callout"><strong>Example</strong><p>If Lena wants to find a missing letter, searching a drawer is an action. <em>Finding the letter</em> is the goal.</p></div>
      <div class="term-grid">
        <button class="term-tile" type="button" data-term="boundary.action" aria-haspopup="dialog"><strong>Action / step</strong><span>Definition + example</span></button>
      </div>`
  },
  {
    stage: 'Stage 3 · What is it not?',
    title: 'The situation can create a need — but it is not the goal.',
    html: `
      <p class="lede">A circumstance describes what is happening around the character. The goal describes what the character is trying to make happen.</p>
      <div class="callout"><strong>Example</strong><p>If Lena is trapped in a locked building, that is the situation. <em>Getting out</em> may be the goal.</p></div>
      <div class="term-grid">
        <button class="term-tile" type="button" data-term="boundary.situation" aria-haspopup="dialog"><strong>Situation / circumstance</strong><span>Definition + example</span></button>
      </div>
      <p class="lede">Later concepts will examine <strong>why</strong> a character pursues a goal and what other pressures surround it. Those ideas are not tested here.</p>`
  },
  {
    stage: 'Stage 4 · How does it work?',
    title: 'A goal gives choices direction.',
    html: `
      <p class="lede">Once the reader understands what a character is trying to achieve, separate actions can be understood as parts of the same pursuit.</p>
      ${glossaryGrid('mechanism')}`
  },
  {
    stage: 'Stage 5 · How does it connect?',
    title: 'Character chooses. Goal gives the choice a destination.',
    html: `
      <p class="lede">Level 1 established that characters become meaningful through what they do and choose. Goal adds the next question: <strong>what result are those choices trying to produce?</strong></p>
      <div class="connection-grid">
        <div><strong>Character</strong><span>Who is acting?</span></div>
        <div><strong>Goal</strong><span>What are they trying to achieve?</span></div>
      </div>
      <p class="lede">The sequence continues with <strong>Motivation → Stakes → Conflict</strong>. Those concepts are named only to show where the learning path goes next; they are not tested in this level.</p>`
  },
  {
    stage: 'Stage 6 · Larger writing',
    title: 'A goal can continue, be achieved, or change.',
    html: `
      <p class="lede">Across a larger passage or story, the same goal can guide many different actions. Events can also cause the character to abandon one intended achievement and pursue another.</p>
      ${glossaryGrid('change')}
      <div class="callout"><strong>Keep asking the same question.</strong><p>At this point in the story, what result is the character trying to make happen?</p></div>`
  }
];

const practicePools = {
  "basic": [
    {
      "id": "gb1",
      "type": "single",
      "prompt": "Nora searches every room of the flooded house because she wants to recover her grandmother's letters before they are ruined. What is Nora trying to achieve?",
      "options": [
        "Recover the letters",
        "Search every room",
        "Be inside a flooded house",
        "Open each cupboard"
      ],
      "answer": 0,
      "explanation": "Recovering the letters is the intended achievement. Searching rooms and opening cupboards are actions taken in pursuit of it."
    },
    {
      "id": "gb2",
      "type": "single",
      "prompt": "After missing the last bus, Tomas walks to a service station, checks a map, and asks whether anyone is driving toward town. Which choice best describes his goal?",
      "options": [
        "Get home",
        "Walk to the service station",
        "Check a map",
        "Miss the bus"
      ],
      "answer": 0,
      "explanation": "His actions point toward getting home. The other choices are actions or circumstances."
    },
    {
      "id": "gb3",
      "type": "truefalse",
      "prompt": "True or false: Every action a character takes is the same thing as the character's goal.",
      "options": [
        "True",
        "False"
      ],
      "answer": 1,
      "explanation": "False. An action is something the character does; the goal is what the character is trying to achieve through those actions."
    },
    {
      "id": "gb4",
      "type": "single",
      "prompt": "Lena says, 'I am going to convince the council to reopen the library.' How is the goal presented?",
      "options": [
        "It is stated directly",
        "It can only be inferred",
        "No goal is present",
        "It is merely a circumstance"
      ],
      "answer": 0,
      "explanation": "The intended achievement is stated plainly in Lena's own words."
    },
    {
      "id": "gb5",
      "type": "single",
      "prompt": "Evan never says what he wants. He copies the guard schedule, waits until the hall is empty, and slips toward the locked records room. What can the reader reasonably infer he is trying to do?",
      "options": [
        "Enter the records room",
        "Copy a schedule",
        "Wait in a hallway",
        "Become a guard"
      ],
      "answer": 0,
      "explanation": "The pattern of behaviour points toward entering the records room. The other choices are individual actions or unsupported conclusions."
    },
    {
      "id": "gb6",
      "type": "single",
      "prompt": "A storm has cut the village off from the highway. Mara spends the afternoon repairing the radio so she can contact the rescue station. Which is the situation rather than the goal?",
      "options": [
        "The village is cut off",
        "Contact the rescue station",
        "Restore communication",
        "Reach outside help"
      ],
      "answer": 0,
      "explanation": "Being cut off is the circumstance. Contacting outside help is what Mara is trying to achieve."
    },
    {
      "id": "gb7",
      "type": "single",
      "prompt": "Jin is trying to find his missing dog. Which choice is an action taken toward the goal rather than the goal itself?",
      "options": [
        "Ask neighbours whether they saw the dog",
        "Find the missing dog",
        "Bring the dog home safely",
        "Locate where the dog went"
      ],
      "answer": 0,
      "explanation": "Asking neighbours is one step. Finding or locating the dog describes the intended achievement."
    },
    {
      "id": "gb8",
      "type": "truefalse",
      "prompt": "True or false: A story can make a character's goal understandable even if the character never states it aloud.",
      "options": [
        "True",
        "False"
      ],
      "answer": 0,
      "explanation": "True. Repeated behaviour and choices can let the reader infer what the character is trying to achieve."
    },
    {
      "id": "gb9",
      "type": "single",
      "prompt": "During a fire, Ana is trying to get a child through an open window before the hallway fills with smoke. Which description best fits this goal?",
      "options": [
        "A near-term intended achievement",
        "A Character term",
        "A situation with no direction",
        "A description of Ana's morality"
      ],
      "answer": 0,
      "explanation": "The goal concerns something Ana is trying to accomplish in the immediate situation."
    },
    {
  