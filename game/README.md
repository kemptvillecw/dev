# WriteCraft — Story Construction Levels 1–2

A zero-build, static HTML/CSS/JavaScript prototype based on the **Learning Gamification of Writing** plan.

Implemented concepts:

1. **Character**
2. **Goal**

Goal unlocks after Character is completed. Later Story Construction concepts remain visible and locked.

## Why vanilla HTML/CSS/JavaScript

The game remains a static, mobile-first, text-focused learning application. Vanilla web technology is still a strong fit because it deploys directly to a static host, needs no package/build chain, keeps the teaching logic inspectable, and already supports local state, dialogs, accessibility, responsive layout, randomized question banks, and drag-and-drop.

A framework such as React, Vue, or Svelte becomes more attractive once the project gains a larger authoring pipeline, many reusable concept components, accounts/cloud saves, adaptive learning, analytics, or substantial shared application state.

## Run it

Open `index.html` in a modern browser. No install step is required.

For development, serving the directory is more predictable for browser storage and navigation:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Level 1 — Character

Character preserves the first playable level and its refinements:

- guided teaching before testing;
- point-of-use popup definitions and multiple examples;
- narrative importance, story function, Character Dimensions, and moral/heroic framing kept distinct;
- 15 basic-practice variants;
- 10 harder-practice variants;
- 6 challenge-gate variants;
- 20 quiz questions across five balanced assessment areas;
- 3 examples for each of 40 popup terms;
- shuffled answer/order positions and recent-variant avoidance;
- explanations after every answer;
- 3 hearts, with heart loss only at the challenge gate;
- five-correct streak restores one heart, capped at three;
- Character-only quiz with one immediate retry;
- real-world proof after completion.

## Level 2 — Goal

The source plan defines Goal as **what a character is trying to achieve**. Because the plan does not yet provide a detailed Goal sub-curriculum, this implementation stays deliberately conservative and avoids teaching later concepts early.

Goal uses **8 guided teaching screens**, matching the current Character lesson length. It teaches the learner to:

- identify the intended achievement;
- distinguish a goal from an action/step;
- distinguish a goal from a situation/circumstance;
- recognize goals that are stated directly;
- infer goals from repeated behaviour;
- recognize near-term and longer-running goals as descriptive patterns rather than formal classifications;
- understand how a goal gives choices direction and makes progress legible;
- recognize when a goal changes as the story develops;
- connect Goal back to the already-completed Character concept;
- see Motivation, Stakes, and Conflict as upcoming concepts without being tested on them.

Replay/variation:

- **15** basic-practice variants, 3 selected per run;
- **10** harder-practice variants, 2 selected per run;
- **6** challenge-gate variants;
- **20** quiz questions across five balanced assessment areas, 5 selected per attempt;
- **11** interactive teaching terms, each with 3 examples where applicable;
- shuffled answer order;
- recent practice/quiz/example history stored locally to reduce immediate repetition.

### Goal quiz areas

Each Goal quiz draws one question from each area:

1. identifying the goal;
2. separating goal from action/circumstance;
3. how a goal is presented;
4. how a goal gives direction/progress;
5. how a goal can continue, be achieved, or change.

## Cross-level rules now implemented

- A practice slot is a learning objective, not one fixed question.
- Later questions test the idea rather than matching answer words copied from the prompt.
- Important teaching terms are available at the point of use.
- Important terms use multiple examples so one example does not become the definition.
- Conceptual boundaries are stated explicitly and revisited in practice.
- Replay changes surface wording while preserving the learning objective and approximate difficulty.
- Every answered question produces an explanation and a clear Continue/Next action.
- Harder questions increase inference, differentiation, or application rather than simply adding text.
- Learner-facing wording uses **classification system** for the broad organizing framework and **term** for an individual concept such as protagonist, mentor, static, or antihero.
- Difficulty must come from meaningful conceptual discrimination, not vague evidence, overloaded clues, or guessing what the question writer intended.
- When a harder question intentionally combines several classification systems, each clue should clearly support the corresponding term so the learner is separating concepts rather than resolving ambiguity.
- Future concepts can be named as signposts but are not tested before their own lessons.

## Prototype choices still unresolved by the curriculum

Both levels currently use reversible prototype choices:

- quiz length: **5** questions;
- passing standard: **4 correct**;
- a second failed quiz attempt returns the learner to the lesson;
- after game over, hearts reset to 3 and the learner returns to that concept's lesson;
- streaks are local to the concept playthrough.

These are implementation choices, not permanent curriculum decisions.

## File structure

- `index.html` — shared semantic game shell and dialogs.
- `styles.css` — shared responsive/mobile-first presentation.
- `app.js` — tiny level router using the URL hash (`#character` / `#goal`).
- `character.js` — Level 1 curriculum data, variation banks, progress, quiz, and replay logic.
- `goal.js` — Level 2 curriculum data, variation banks, progress, quiz, and replay logic.

Progress is stored in browser `localStorage`; the game does not set cookies.

## Real-world proof

Character and Goal use brief analytical proof cards linking to public-domain Project Gutenberg editions rather than reproducing long excerpts. Goal currently uses:

- *The Wonderful Wizard of Oz* — Project Gutenberg #55
- *Around the World in Eighty Days* — Project Gutenberg #103

Version: **2.0.0**


### Character Dimensions terminology

Character Dimensions is intentionally treated as a looser grouping with three overlapping dimensions: **Complexity** (Round / Flat), **Change** (Dynamic / Static), and **Pattern** (Stock / Archetypal). Questions identify the specific dimension being tested whenever possible.

## KCW colour theme

This build uses the Kemptville Creative Writers website palette from `kemptvillecw/mainsite/styles/styles.css`: forest `#0b5a46`, forest-dark `#063d31`, cream `#f4eee2`, paper `#fffdf8`, mint `#e4eee3`, line `#cbd4c8`, ink `#17352e`, muted `#50655e`, strip background `#dce8d8`, plus the site's success and error surface colours.
