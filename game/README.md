# Story Construction Writing Game — Levels 1–2

Static HTML/CSS/JavaScript implementation of the **Learning Gamification of Writing** plan.

Playable concepts:

1. **Character**
2. **Goal**

Goal unlocks after Character. The remaining Story Construction concepts stay visible and locked in the concept path.

## Plan rules implemented

- Teach before testing.
- One text challenge at a time.
- Explain both correct and incorrect answers.
- Practice uses **3 basic → 2 harder → 1 challenge gate**.
- Ordinary practice misses do not cost hearts.
- Two ordinary misses restart the current difficulty rung with different selections where possible.
- A failed challenge gate costs one heart.
- Five correct practice challenges in a row restore one heart, capped at three.
- Each concept ends with its own quiz.
- One immediate quiz retry is allowed; a second failure returns the learner to the lesson.
- Passing the concept quiz marks the concept completed; completion is not full mastery.
- Real-World Proof follows the quiz and is evidence/reinforcement, not another scored challenge.
- Future concepts may be named as signposts but are not tested before they are taught.

The current five-question quiz with four required correct answers remains a reversible prototype choice because the plan has not fixed final quiz length or pass threshold.

## Short-term answer and variant memory

Recent-history balancing runs continuously during normal play — not only during replay.

For basic practice, harder practice, gates, quizzes, restarted rungs, review, and replay, the selector prefers alternatives that avoid:

- recently used question variants;
- recently used **correct answers/classifications/results**;
- duplicate correct results inside the same quiz attempt where the bank permits.

Answer order is also shuffled, and ordering questions begin in shuffled positions.

The current correct-answer memory window is **3 selections**. That value is intentionally provisional because the plan leaves the exact window to testing. If a bank is too small, constraints relax rather than blocking progress.

## Character

Character now follows the latest plan:

- **Narrative importance:** protagonist, co-protagonist, deuteragonist, co-deuteragonist, tritagonist, antagonist, supporting character, minor character, ensemble.
- **Story function:** ally, sidekick, confidant, mentor, foil, rival, love interest, comic relief, herald/messenger, gatekeeper, catalyst, sacrificial character, false antagonist, henchman/enforcer, minion/follower, authority figure, innocent/dependent.
- **Character complexity:** round and flat.
- **Character patterns:** stock and archetypal.
- **Moral / heroic framing:** hero, antihero, villain, anti-villain, tragic hero, sympathetic/tragic villain.

Round/flat are taught as purposeful complexity choices rather than good/bad writing. Character patterns are separate from complexity. Change/stability classifications are reserved for the later **Character Arc** concept and are not taught or tested as Character classifications here.

Real-World Proof varies the evidence being demonstrated instead of repeating the same label: narrative importance, complexity, story function, and moral framing are represented.

## Goal

Goal teaches:

- the result a character is trying to achieve;
- stated and inferred goals;
- near-term and longer-running goals as descriptive patterns;
- goal versus action/step;
- goal versus situation/circumstance;
- how goals give choices direction and make progress legible;
- how an active goal can continue, be achieved, be abandoned, or change.

Motivation, Stakes, and Conflict are signposted as later concepts but are not tested in Goal.

## Presentation

The game uses the KCW palette, responsive/touch-friendly controls, keyboard focus states, and reduced-motion support. It remains text-focused and uses flat surfaces with **no gradients** and no learner-facing WriteCraft branding.

Progress is stored in browser localStorage. Existing progress keys are retained for compatibility.

Version: **3.0.0-shared-engine**


## Shared game engine

Character and Goal now use `game-engine.js` for the common runtime. Level files retain their lesson content, glossary, question banks, proof examples, and level-specific copy.

The shared engine now:

- persists an answered-question state before showing feedback so refresh/reload cannot score the same answer twice;
- restores the disabled answer and feedback screen after refresh until the learner presses Continue/Next;
- tracks recent correct results as semantic tag sets, so multi-answer questions contribute each recognized concept term to the anti-repetition history;
- migrates older `answerKeys` variation history into the semantic-tag history;
- enforces prerequisites on every render, so saved Goal state cannot bypass Character completion;
- centralizes question preparation, selection, practice progression, hearts, streaks, quizzes, drag ordering, dialogs, concept-map rendering, and persistence for future levels.
