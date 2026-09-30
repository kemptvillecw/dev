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
      "id": "gb10",
      "type": "single",
      "prompt": "Across many chapters, Malik keeps collecting evidence so he can clear his father's name. What gives those repeated actions a shared direction?",
      "options": [
        "The aim of clearing his father's name",
        "The fact that the story has chapters",
        "Malik's narrative-importance term",
        "The number of clues"
      ],
      "answer": 0,
      "explanation": "The continuing goal makes the separate actions part of one recognizable pursuit."
    },
    {
      "id": "gb11",
      "type": "single",
      "prompt": "Iris first tries to win the scholarship. After learning her friend was falsely accused of cheating, she stops preparing her application and works to prove the accusation false. What happened to her goal?",
      "options": [
        "It changed",
        "It became an action",
        "It disappeared from the story entirely",
        "It became a narrative-importance term"
      ],
      "answer": 0,
      "explanation": "New information caused Iris to replace one intended achievement with another."
    },
    {
      "id": "gb12",
      "type": "single",
      "prompt": "Which sentence most clearly names an intended achievement rather than a method?",
      "options": [
        "Reach the island before sunset",
        "Row harder",
        "Check the compass",
        "Untie the spare sail"
      ],
      "answer": 0,
      "explanation": "Reaching the island is what the character is trying to accomplish. The other choices are possible methods or actions."
    },
    {
      "id": "gb13",
      "type": "single",
      "prompt": "A character keeps calling hospitals, checking emergency-room lists, and contacting police stations. Which goal is most strongly suggested?",
      "options": [
        "Find where someone injured has been taken",
        "Make several phone calls",
        "Learn how hospitals work",
        "Spend the evening indoors"
      ],
      "answer": 0,
      "explanation": "The repeated actions support an inferred goal of locating the person."
    },
    {
      "id": "gb14",
      "type": "single",
      "prompt": "What question most directly identifies a character's goal?",
      "options": [
        "What is the character trying to achieve?",
        "How morally good is the character?",
        "How important is the character to the narrative?",
        "Which Character Dimensions term best describes the character?"
      ],
      "answer": 0,
      "explanation": "A goal answers what the character is trying to achieve."
    },
    {
      "id": "gb15",
      "type": "truefalse",
      "prompt": "True or false: A goal can guide several different actions across a story.",
      "options": [
        "True",
        "False"
      ],
      "answer": 0,
      "explanation": "True. Different actions can all be selected because they serve the same intended achievement."
    }
  ],
  "hard": [
    {
      "id": "gh1",
      "type": "single",
      "prompt": "Leena is the protagonist. She studies old maps, borrows climbing equipment, and persuades a ranger to show her a closed trail. Which statement identifies her goal rather than her narrative importance or her actions?",
      "options": [
        "Reach the abandoned observatory",
        "She is the protagonist",
        "Study old maps",
        "Borrow climbing equipment"
      ],
      "answer": 0,
      "explanation": "Reaching the observatory is the intended achievement. Protagonist is a narrative-importance term, while studying and borrowing are actions."
    },
    {
      "id": "gh2",
      "type": "multi",
      "prompt": "A character never states a goal directly. Which details could reasonably help a reader infer the goal?",
      "options": [
        "Repeated choices that point toward the same result",
        "Actions the character keeps taking despite difficulty",
        "What the character repeatedly tries to make happen",
        "The font used for the chapter heading"
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "A goal can be inferred when choices and actions consistently point toward an intended result. Formatting does not establish the character's goal."
    },
    {
      "id": "gh3",
      "type": "single",
      "prompt": "Mara wants to stop a package from leaving the depot. She checks the departure board, runs to loading bay four, and asks a driver to delay the truck. Which choice best states the goal at the right level?",
      "options": [
        "Prevent the package from leaving the depot",
        "Check the departure board",
        "Run to loading bay four",
        "Ask a driver a question"
      ],
      "answer": 0,
      "explanation": "The goal is the intended result shared by the smaller actions."
    },
    {
      "id": "gh4",
      "type": "single",
      "prompt": "Which version most clearly establishes what the character is trying to achieve?",
      "options": [
        "Rafi needs the missing key before the vault closes at noon, so he begins searching the hotel rooms.",
        "Rafi walks quickly through a hallway and opens several doors.",
        "The hotel has many rooms, and noon is approaching.",
        "Rafi is an important character who appears in most scenes."
      ],
      "answer": 0,
      "explanation": "The first version identifies the intended achievement and connects the ensuing action to it."
    },
    {
      "id": "gh5",
      "type": "multi",
      "prompt": "Select every statement that is consistent with the Goal concept as taught so far.",
      "options": [
        "A goal may be stated directly or inferred from behaviour.",
        "A goal may guide several different actions.",
        "A character's goal can change when circumstances change.",
        "An action and a goal always mean exactly the same thing."
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "Goals can be explicit or inferred, can guide multiple actions, and can change. Actions are steps taken in pursuit of an intended achievement."
    },
    {
      "id": "gh6",
      "type": "single",
      "prompt": "Nico enters the archive because he wants to prove the photograph was altered. Halfway through, he discovers the original photograph and realizes the alteration hid a second person. He stops examining the edit and starts trying to identify that person. Which description is most accurate?",
      "options": [
        "His current goal has shifted.",
        "His narrative importance has changed.",
        "He no longer has any goal.",
        "Entering the archive was the goal all along."
      ],
      "answer": 0,
      "explanation": "New information changed what Nico is trying to achieve. Entering the archive was an action serving the earlier goal."
    },
    {
      "id": "gh7",
      "type": "single",
      "prompt": "Two characters both climb the radio tower. One is trying to repair the transmitter; the other is trying to remove evidence hidden at the top. What does this show about goals?",
      "options": [
        "The same action can serve different intended achievements.",
        "The action itself determines the goal.",
        "Characters performing the same action must share a goal.",
        "Goal is another Character classification system."
      ],
      "answer": 0,
      "explanation": "An action does not tell us the goal by itself. Context shows what each character is trying to achieve."
    },
    {
      "id": "gh8",
      "type": "single",
      "prompt": "A passage shows a character checking every train, comparing passenger lists, and refusing to leave the platform. What additional information would most directly clarify the character's goal?",
      "options": [
        "Who or what the character is trying to find or prevent",
        "The colour of the station walls",
        "Whether the character is a hero",
        "How many pages the chapter contains"
      ],
      "answer": 0,
      "explanation": "The missing piece is the intended achievement toward which the actions are directed."
    },
    {
      "id": "gh9",
      "type": "multi",
      "prompt": "Tara is trying to get a stranded climber off a mountain before nightfall. Which items are actions that could serve that goal rather than restatements of the goal itself?",
      "options": [
        "Call the rescue team",
        "Secure a rope line",
        "Carry the climber toward the descent route",
        "Get the climber safely off the mountain"
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "Calling, securing, and carrying are actions. Getting the climber safely off the mountain states the intended achievement."
    },
    {
      "id": "gh10",
      "type": "single",
      "prompt": "Why does a clear goal often make a sequence of character choices easier for a reader to follow?",
      "options": [
        "The reader can understand what result the choices are meant to move toward.",
        "It guarantees the character will succeed.",
        "It tells the reader whether the character is morally good.",
        "It replaces the need for character choices."
      ],
      "answer": 0,
      "explanation": "A goal gives choices direction by showing what the character is trying to make happen."
    }
  ],
  "gate": [
    {
      "id": "gg1",
      "type": "single",
      "prompt": "Gate: Sela is the protagonist. She enters three abandoned houses, questions a retired postmaster, and searches old delivery records. The story never states her aim directly, but all of these choices are meant to locate a letter her mother sent years ago. Which statement identifies Sela's goal?",
      "options": [
        "Locate the old letter",
        "Enter abandoned houses",
        "Question the postmaster",
        "Be the protagonist"
      ],
      "answer": 0,
      "explanation": "Locating the letter is the intended achievement. The other choices are actions or a narrative-importance term."
    },
    {
      "id": "gg2",
      "type": "single",
      "prompt": "Gate: Tomas is stranded after the ferry leaves. He borrows a bicycle and rides toward the next harbour because another ferry departs there at midnight. Which choice is the goal rather than the situation or the method?",
      "options": [
        "Catch the midnight ferry",
        "Be stranded",
        "Borrow a bicycle",
        "Ride along the coast road"
      ],
      "answer": 0,
      "explanation": "Catching the ferry is what Tomas is trying to achieve. Being stranded is the situation; borrowing and riding are actions."
    },
    {
      "id": "gg3",
      "type": "single",
      "prompt": "Gate: Priya spends months trying to win a research grant. When her lab partner disappears during a field trip, she abandons the application and starts organizing a search. What has changed?",
      "options": [
        "What Priya is trying to achieve",
        "Priya's narrative importance",
        "The meaning of the word character",
        "Whether actions can serve goals"
      ],
      "answer": 0,
      "explanation": "Her goal shifts from winning the grant to finding her missing partner."
    },
    {
      "id": "gg4",
      "type": "multi",
      "prompt": "Gate: Which statements correctly describe how a goal can appear in a story?",
      "options": [
        "It can be stated directly.",
        "It can be inferred from repeated behaviour.",
        "It can guide actions across more than one scene.",
        "It must always be spoken aloud by the character."
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "A goal can be explicit or inferred and may persist across multiple actions or scenes. It does not have to be spoken aloud."
    },
    {
      "id": "gg5",
      "type": "single",
      "prompt": "Gate: A character keeps deleting messages, changing hotel rooms, and checking whether anyone is following. Which answer identifies an intended achievement rather than merely repeating an action?",
      "options": [
        "Avoid being found",
        "Delete messages",
        "Change hotel rooms",
        "Check the street"
      ],
      "answer": 0,
      "explanation": "Avoiding discovery is the result the repeated actions appear designed to achieve."
    },
    {
      "id": "gg6",
      "type": "single",
      "prompt": "Gate: Two characters both break into the same warehouse. One wants to rescue a captive witness; the other wants to destroy the witness's evidence. What is the best conclusion?",
      "options": [
        "The same action can be driven toward different goals.",
        "Breaking into the warehouse is automatically the goal for both.",
        "Characters who share an action must share a goal.",
        "Their goals can be known from their narrative-importance terms alone."
      ],
      "answer": 0,
      "explanation": "The action is the same, but each character is trying to achieve a different result."
    }
  ]
};

const quizPools = {
  "identify": [
    {
      "id": "gqi1",
      "type": "single",
      "prompt": "A character keeps following a trail of receipts, checking security footage, and comparing licence plates. Which answer most plausibly states the goal?",
      "options": [
        "Identify where the missing car went",
        "Compare licence plates",
        "Watch security footage",
        "Carry receipts"
      ],
      "answer": 0,
      "explanation": "The repeated actions point toward locating or identifying where the car went."
    },
    {
      "id": "gqi2",
      "type": "single",
      "prompt": "Mina repeatedly visits pawn shops and shows owners a photograph of a stolen violin. What is she most clearly trying to achieve?",
      "options": [
        "Find the stolen violin",
        "Visit pawn shops",
        "Show people a photograph",
        "Become a shop owner"
      ],
      "answer": 0,
      "explanation": "Finding the violin is the intended achievement shared by the actions."
    },
    {
      "id": "gqi3",
      "type": "single",
      "prompt": "A character stays after closing, searches old ledgers, and copies one account number. Which statement best describes a likely goal?",
      "options": [
        "Find information hidden in the records",
        "Stay after closing",
        "Copy numbers in general",
        "Become an accountant"
      ],
      "answer": 0,
      "explanation": "The behaviour supports an inferred goal of finding specific information in the records."
    },
    {
      "id": "gqi4",
      "type": "single",
      "prompt": "Which question most directly asks for a character's goal?",
      "options": [
        "What is the character trying to make happen?",
        "What role does the character play in the cast?",
        "Is the character heroic?",
        "Does the character change over time?"
      ],
      "answer": 0,
      "explanation": "Goal concerns the result the character is trying to achieve."
    }
  ],
  "boundary": [
    {
      "id": "gqb1",
      "type": "single",
      "prompt": "Kira wants to reach the hospital before visiting hours end. Which choice is an action rather than the goal?",
      "options": [
        "Take a taxi across town",
        "Reach the hospital before visiting hours end",
        "Arrive in time to visit",
        "Get to the hospital in time"
      ],
      "answer": 0,
      "explanation": "Taking a taxi is a method or action serving the intended achievement."
    },
    {
      "id": "gqb2",
      "type": "single",
      "prompt": "A storm knocks out every road into town. Which statement is a situation rather than a goal?",
      "options": [
        "Every road is blocked",
        "Restore a route for the ambulance",
        "Reach the neighbouring town",
        "Get medicine through"
      ],
      "answer": 0,
      "explanation": "Blocked roads describe the circumstance. The other choices describe possible intended achievements."
    },
    {
      "id": "gqb3",
      "type": "multi",
      "prompt": "Which choices are actions rather than goals?",
      "options": [
        "Question the witness",
        "Search the attic",
        "Follow the courier",
        "Discover who forged the signature"
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "Questioning, searching, and following are actions. Discovering the forger states an intended achievement."
    },
    {
      "id": "gqb4",
      "type": "single",
      "prompt": "Which statement best separates goal from action?",
      "options": [
        "A goal is the intended achievement; an action is something done in pursuit of it.",
        "A goal and an action are always identical.",
        "A goal describes narrative importance.",
        "An action must always be spoken aloud."
      ],
      "answer": 0,
      "explanation": "The goal names what the character is trying to achieve; actions are steps used to pursue it."
    }
  ],
  "appearance": [
    {
      "id": "gqa1",
      "type": "single",
      "prompt": "A narrator says that Ellis intends to get the farm back before winter. How is the goal presented?",
      "options": [
        "Stated directly",
        "Only inferred",
        "Absent",
        "Presented as a Character term"
      ],
      "answer": 0,
      "explanation": "The intended achievement is explicitly given to the reader."
    },
    {
      "id": "gqa2",
      "type": "single",
      "prompt": "The story never says what Ren wants, but Ren repeatedly studies the museum's closing routine, tests a service door, and hides inside before the lights go out. How is the goal primarily communicated?",
      "options": [
        "Through behaviour the reader can infer from",
        "Through a direct statement of the intended achievement",
        "Through narrative-importance terms",
        "Through moral framing"
      ],
      "answer": 0,
      "explanation": "The reader must infer the intended achievement from a pattern of behaviour."
    },
    {
      "id": "gqa3",
      "type": "truefalse",
      "prompt": "True or false: A goal may remain understandable across several scenes even when it is not restated in every scene.",
      "options": [
        "True",
        "False"
      ],
      "answer": 0,
      "explanation": "True. A continuing intended achievement can give direction to actions across a larger stretch of writing."
    },
    {
      "id": "gqa4",
      "type": "single",
      "prompt": "A character says, 'Before the doors close, I need to get this medicine onto the train.' Which description best fits the goal's scale in that moment?",
      "options": [
        "A near-term intended achievement",
        "A Character Dimensions term",
        "A situation only",
        "A moral judgment"
      ],
      "answer": 0,
      "explanation": "The goal concerns something the character is trying to accomplish in the immediate situation."
    }
  ],
  "mechanism": [
    {
      "id": "gqm1",
      "type": "single",
      "prompt": "What does a clear goal add to a character's sequence of choices?",
      "options": [
        "A recognizable direction toward an intended result",
        "A guarantee of success",
        "A moral/heroic framing term",
        "A replacement for conflict"
      ],
      "answer": 0,
      "explanation": "The goal helps the reader see what result the choices are meant to pursue."
    },
    {
      "id": "gqm2",
      "type": "single",
      "prompt": "Why can a goal help a reader understand progress?",
      "options": [
        "The reader can judge whether events move the character closer to or farther from the intended result.",
        "The goal tells the reader exactly how the story ends.",
        "The goal makes every action successful.",
        "The goal determines the character's narrative importance."
      ],
      "answer": 0,
      "explanation": "The goal provides a reference point for understanding movement, setbacks, change, or achievement."
    },
    {
      "id": "gqm3",
      "type": "single",
      "prompt": "A character chooses a dangerous shortcut instead of the safe road because the medicine must arrive before dawn. What does the goal help explain?",
      "options": [
        "Why that choice is worth making to the character",
        "Whether the character is a protagonist",
        "Whether the character is morally good",
        "How many scenes the story needs"
      ],
      "answer": 0,
      "explanation": "Knowing the intended achievement helps the reader understand why one option is chosen over another."
    },
    {
      "id": "gqm4",
      "type": "truefalse",
      "prompt": "True or false: Several different actions can feel connected when the reader understands the single result they are all meant to achieve.",
      "options": [
        "True",
        "False"
      ],
      "answer": 0,
      "explanation": "True. A goal can give a sequence of different actions a shared direction."
    }
  ],
  "change": [
    {
      "id": "gqc1",
      "type": "single",
      "prompt": "Kai begins the story trying to sell the family shop. After discovering why his sister secretly kept it open, he abandons the sale and tries to save the business. What has changed?",
      "options": [
        "Kai's goal",
        "The definition of protagonist",
        "Whether Kai is a character",
        "The meaning of action"
      ],
      "answer": 0,
      "explanation": "The intended achievement changes from selling the shop to saving it."
    },
    {
      "id": "gqc2",
      "type": "single",
      "prompt": "Which example shows a goal being achieved rather than merely an action being completed?",
      "options": [
        "After weeks of searching, Imani finds her missing brother.",
        "Imani opens a drawer.",
        "Imani drives across town.",
        "Imani asks a neighbour a question."
      ],
      "answer": 0,
      "explanation": "Finding her brother completes the intended achievement; the other choices are individual actions."
    },
    {
      "id": "gqc3",
      "type": "single",
      "prompt": "A character stops pursuing one intended result after new information makes it irrelevant and begins pursuing another. What does this demonstrate?",
      "options": [
        "Goals can change as the story develops.",
        "Actions and goals are identical.",
        "Goals must remain fixed.",
        "Goal is a moral/heroic framing term."
      ],
      "answer": 0,
      "explanation": "A goal can be replaced when events or discoveries change what the character is trying to achieve."
    },
    {
      "id": "gqc4",
      "type": "multi",
      "prompt": "Which statements can describe a goal over a larger stretch of writing?",
      "options": [
        "It can persist across several actions.",
        "It can be achieved.",
        "It can be abandoned or replaced.",
        "It must be restated word-for-word in every scene."
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "A goal can continue, be achieved, or change. It does not need constant word-for-word restatement."
    }
  ]
};

const realWorldProof = [
  {
    "title": "Dorothy — getting home",
    "work": "The Wonderful Wizard of Oz · L. Frank Baum",
    "body": "Dorothy's repeated decisions are organized around returning home to Kansas. The goal gives direction to the journey even as the specific actions required to pursue it change.",
    "url": "https://www.gutenberg.org/ebooks/55",
    "source": "Project Gutenberg #55"
  },
  {
    "title": "Phileas Fogg — around the world in eighty days",
    "work": "Around the World in Eighty Days · Jules Verne",
    "body": "Fogg's wager gives him a concrete intended achievement: complete a journey around the world within eighty days. The deadline makes progress toward the goal especially visible.",
    "url": "https://www.gutenberg.org/ebooks/103",
    "source": "Project Gutenberg #103"
  }
];

const defaultState = () => ({
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
  quizAnswered: false,
  quizSet: [],
  previousQuizIds: [],
  quizPassed: false,
  completed: false,
  startedAt: null
});

let state = loadState();
let variationHistory = loadVariationHistory();
let feedbackLock = false;
let currentTermKey = null;
let currentTermExampleIndex = 0;

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


function loadVariationHistory() {
  const fallback = { practice: { basic: [], hard: [], gate: [] }, quiz: [], examples: {} };
  try {
    const parsed = JSON.parse(localStorage.getItem(VARIATION_HISTORY_KEY));
    return parsed ? { ...fallback, ...parsed, practice: { ...fallback.practice, ...(parsed.practice || {}) }, examples: parsed.examples || {} } : fallback;
  } catch {
    return fallback;
  }
}

function saveVariationHistory() {
  localStorage.setItem(VARIATION_HISTORY_KEY, JSON.stringify(variationHistory));
}

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestion(source) {
  const q = JSON.parse(JSON.stringify(source));
  q.sourceId = source.id;

  if (q.type === 'single' || q.type === 'multi') {
    const correctIndexes = Array.isArray(q.answer) ? q.answer : [q.answer];
    const shuffledOptions = shuffle(q.options.map((text, originalIndex) => ({
      text,
      correct: correctIndexes.includes(originalIndex)
    })));
    q.options = shuffledOptions.map(item => item.text);
    const remapped = shuffledOptions.map((item, index) => item.correct ? index : -1).filter(index => index >= 0);
    q.answer = Array.isArray(source.answer) ? remapped : remapped[0];
  } else if (q.type === 'order') {
    let items = shuffle(q.items);
    if (items.every((item, index) => item === q.answer[index]) && items.length > 1) {
      [items[0], items[1]] = [items[1], items[0]];
    }
    q.items = items;
  }
  return q;
}

function chooseWithHistory(pool, recentIds = [], usedIds = []) {
  const unused = pool.filter(q => !usedIds.includes(q.id));
  const fresh = unused.filter(q => !recentIds.includes(q.id));
  const candidates = fresh.length ? fresh : unused.length ? unused : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function rememberQuestion(kind, id, limit) {
  if (kind === 'quiz') {
    variationHistory.quiz = [...variationHistory.quiz.filter(value => value !== id), id].slice(-limit);
  } else {
    const current = variationHistory.practice[kind] || [];
    variationHistory.practice[kind] = [...current.filter(value => value !== id), id].slice(-limit);
  }
  saveVariationHistory();
}

function buildQuizSet() {
  const previous = new Set(state.previousQuizIds || []);
  const selected = [];
  for (const pool of Object.values(quizPools)) {
    const recent = variationHistory.quiz || [];
    const strongest = pool.filter(q => !previous.has(q.id) && !recent.includes(q.id));
    const alternate = pool.filter(q => !previous.has(q.id));
    const candidates = strongest.length ? strongest : alternate.length ? alternate : pool;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    selected.push(prepareQuestion(chosen));
    rememberQuestion('quiz', chosen.id, 12);
  }
  state.quizSet = shuffle(selected);
  state.previousQuizIds = state.quizSet.map(q => q.sourceId);
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed ? { ...defaultState(), ...parsed } : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VARIATION_HISTORY_KEY);
  state = defaultState();
  variationHistory = loadVariationHistory();
  render();
}

function setView(view) {
  state.view = view;
  saveState();
  render();
}


function updateStatus() {
  heartDisplay.innerHTML = Array.from({ length: MAX_HEARTS }, (_, i) =>
    `<span class="heart ${i < state.hearts ? '' : 'empty'}" aria-hidden="true">♥</span>`
  ).join('');
  heartDisplay.setAttribute('aria-label', `${state.hearts} ${state.hearts === 1 ? 'heart' : 'hearts'} remaining`);
  streakDisplay.textContent = `${state.streak} / ${STREAK_TARGET}`;

  const map = {
    welcome: ['Level 2 · Goal', 'Welcome', 0],
    lesson: ['Learn · Goal', `Lesson ${state.lessonIndex + 1} of ${lessonScreens.length}`, 8 + (state.lessonIndex / lessonScreens.length) * 32],
    practiceIntro: ['Practice · Goal', 'Difficulty ladder', 42],
    practice: ['Practice · Goal', state.practicePhase === 'basic' ? 'Basic challenges' : state.practicePhase === 'hard' ? 'Harder challenges' : 'Challenge gate', state.practicePhase === 'basic' ? 48 + state.practiceIndex * 4 : state.practicePhase === 'hard' ? 62 + state.practiceIndex * 5 : 74],
    gateSuccess: ['Checkpoint · Goal', 'Gate cleared', 78],
    quizIntro: ['Quiz · Goal', 'Completion checkpoint', 80],
    quiz: ['Quiz · Goal', `Question ${state.quizIndex + 1} of ${QUIZ_LENGTH}`, 82 + (state.quizIndex / QUIZ_LENGTH) * 10],
    quizResult: ['Quiz · Goal', state.quizPassed ? 'Concept completed' : 'Review needed', state.quizPassed ? 94 : 86],
    proof: ['Real-world proof', 'Goal in published work', 97],
    complete: ['Level 2 · Goal', 'Completed', 100],
    gameOver: ['Level 2 · Goal', 'Game over', 74]
  };
  const [eye, label, pct] = map[state.view] || map.welcome;
  eyebrow.textContent = eye;
  progressLabel.textContent = label;
  progressBar.style.width = `${pct}%`;
}

function render() {
  feedbackLock = false;
  updateStatus();
  renderConceptMap();

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


function characterIsComplete() {
  try {
    const prior = JSON.parse(localStorage.getItem(CHARACTER_STORAGE_KEY));
    return Boolean(prior && prior.completed);
  } catch {
    return false;
  }
}

function renderWelcome() {
  if (!characterIsComplete()) {
    shell({
      kicker: 'Story Construction · Level 2',
      title: 'Goal unlocks after Character.',
      body: `<p class="lede">The agreed teaching sequence completes one concept before introducing the next. Finish Level 1 · Character to unlock Goal.</p><div class="callout"><strong>Prerequisite</strong><p>Character must be completed before Goal begins.</p></div>`,
      actions: `<button class="primary-button" id="characterBtn" type="button">Go to Level 1 · Character</button>`
    });
    document.getElementById('characterBtn').addEventListener('click', () => window.writecraftNavigate('character'));
    return;
  }

  shell({
    kicker: 'Story Construction · Level 2',
    title: 'Learn to recognize what a character is trying to achieve.',
    body: `
      <p class="lede">This level builds directly on Character. You’ll learn to identify a goal when it is stated or implied, separate the goal from the actions used to pursue it, and follow how a goal gives choices direction.</p>
      <div class="gate-banner"><strong>Game rules</strong><p>Practice mistakes teach; they do not cost hearts. Only a failed challenge gate costs one. Five correct challenges in a row restore one heart, up to three.</p></div>
      <div class="connection-grid">
        <div><strong>Learn</strong><span>8 guided screens</span></div>
        <div><strong>Practice</strong><span>3 basic + 2 harder</span></div>
        <div><strong>Gate</strong><span>Required checkpoint</span></div>
        <div><strong>Quiz</strong><span>Goal only</span></div>
      </div>`,
    actions: `<button class="secondary-button" id="characterBtn" type="button">Review Character</button><button class="secondary-button" id="resetBtn" type="button">Reset Goal progress</button><button class="primary-button" id="startBtn" type="button">Start level 2</button>`
  });
  document.getElementById('characterBtn').addEventListener('click', () => window.writecraftNavigate('character'));
  document.getElementById('startBtn').addEventListener('click', () => {
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    state.view = 'lesson';
    state.lessonIndex = 0;
    saveState(); render();
  });
  document.getElementById('resetBtn').addEventListener('click', resetState);
}

function renderLesson() {
  const item = lessonScreens[state.lessonIndex];
  const last = state.lessonIndex === lessonScreens.length - 1;
  shell({
    kicker: item.stage,
    title: item.title,
    body: item.html,
    actions: `${state.lessonIndex > 0 ? '<button class="secondary-button" id="backBtn" type="button">Back</button>' : ''}<button class="primary-button" id="nextBtn" type="button">${last ? 'Start practice' : 'Continue'}</button>`
  });
  if (state.lessonIndex > 0) document.getElementById('backBtn').addEventListener('click', () => { state.lessonIndex--; saveState(); render(); });
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (last) {
      state.view = 'practiceIntro';
    } else {
      state.lessonIndex++;
    }
    saveState(); render();
  });
}


function renderPracticeIntro() {
  shell({
    kicker: 'Stage 7 · Progressive practice',
    title: 'Identify it. Separate it. Infer it.',
    body: `
      <p class="lede">The first rung asks you to recognize goals and separate them from actions or situations. Harder questions make you infer goals from behaviour, track changes, and apply the distinction in context. Replays draw different variants where possible.</p>
      <div class="category-list">
        <div class="category-card"><strong>3 basic challenges</strong><span>Recognize the intended achievement.</span></div>
        <div class="category-card"><strong>2 harder challenges</strong><span>Infer and analyze the goal in context.</span></div>
        <div class="category-card"><strong>1 challenge gate</strong><span>Required checkpoint. This is the only practice mistake that costs a heart.</span></div>
      </div>`,
    actions: `<button class="secondary-button" id="lessonBtn" type="button">Review lesson</button><button class="primary-button" id="practiceBtn" type="button">Begin challenges</button>`
  });
  document.getElementById('lessonBtn').addEventListener('click', () => { state.view = 'lesson'; state.lessonIndex = 0; saveState(); render(); });
  document.getElementById('practiceBtn').addEventListener('click', () => {
    state.practicePhase = 'basic';
    state.practiceIndex = 0;
    state.mistakesInPhase = 0;
    state.currentQuestion = null;
    state.selectedQuestionIds = { basic: [], hard: [], gate: [] };
    state.view = 'practice';
    saveState(); render();
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
  rememberQuestion(phase, chosen.id, phase === 'basic' ? 9 : phase === 'hard' ? 7 : 4);
  saveState();
  return state.currentQuestion;
}

function renderPractice() {
  if (state.hearts <= 0) { state.view = 'gameOver'; saveState(); render(); return; }
  const q = getQuestionForPhase();
  const count = getPhaseCount();
  const label = state.practicePhase === 'basic' ? `Basic ${state.practiceIndex + 1} of ${count}` : state.practicePhase === 'hard' ? `Harder ${state.practiceIndex + 1} of ${count}` : 'Challenge gate';
  const intro = state.practicePhase === 'gate' ? '<div class="gate-banner"><strong>Challenge gate</strong><p>Pass this checkpoint to reach the Character quiz. A wrong answer costs one heart.</p></div>' : '';
  renderQuestionScreen(q, label, intro, handlePracticeAnswer);
}

function renderQuestionScreen(q, kicker, preface, onAnswer) {
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
    actions: needsSubmit ? `<button class="primary-button" id="submitAnswer" type="button">Check answer</button>` : ''
  });

  if (q.type === 'single' || q.type === 'truefalse') {
    screen.querySelectorAll('.answer-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (feedbackLock) return;
        onAnswer(q, Number(btn.dataset.index));
      });
    });
  } else if (q.type === 'multi') {
    document.getElementById('submitAnswer').addEventListener('click', () => {
      if (feedbackLock) return;
      const selected = [...screen.querySelectorAll('input[type="checkbox"]:checked')].map(el => Number(el.value));
      onAnswer(q, selected);
    });
  } else if (q.type === 'order') {
    setupDragAndDrop();
    document.getElementById('submitAnswer').addEventListener('click', () => {
      if (feedbackLock) return;
      const order = [...screen.querySelectorAll('.drag-item')].map(el => el.dataset.value);
      onAnswer(q, order);
    });
  }
}

function renderQuestionInput(q) {
  if (q.type === 'single' || q.type === 'truefalse') {
    return `<div class="answers">${q.options.map((opt, i) => `<button class="answer-option" type="button" data-index="${i}">${opt}</button>`).join('')}</div>`;
  }
  if (q.type === 'multi') {
    return `<div class="check-list">${q.options.map((opt, i) => `<label class="check-row"><input type="checkbox" value="${i}"><span>${opt}</span></label>`).join('')}</div>`;
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
    item.addEventListener('dragstart', () => { dragged = item; item.classList.add('dragging'); });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); dragged = null; });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      if (!dragged || dragged === item) return;
      const box = item.getBoundingClientRect();
      const after = e.clientY > box.top + box.height / 2;
      list.insertBefore(dragged, after ? item.nextSibling : item);
    });
  });
  list.addEventListener('click', e => {
    const btn = e.target.closest('button[data-move]');
    if (!btn || feedbackLock) return;
    const item = btn.closest('.drag-item');
    if (btn.dataset.move === 'up' && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
    if (btn.dataset.move === 'down' && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
  });
}

function isCorrect(q, answer) {
  if (Array.isArray(q.answer)) {
    if (!Array.isArray(answer) || answer.length !== q.answer.length) return false;
    if (q.type === 'order') return q.answer.every((v, i) => answer[i] === v);
    const a = [...answer].sort((x,y) => x-y);
    const b = [...q.answer].sort((x,y) => x-y);
    return a.every((v, i) => v === b[i]);
  }
  return answer === q.answer;
}

function markAnswerVisuals(q, answer) {
  if (q.type === 'single' || q.type === 'truefalse') {
    screen.querySelectorAll('.answer-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add('correct');
      else if (i === answer) btn.classList.add('incorrect');
    });
  } else if (q.type === 'multi') {
    screen.querySelectorAll('.check-row').forEach((row, i) => {
      const input = row.querySelector('input');
      input.disabled = true;
      const should = q.answer.includes(i);
      const chosen = answer.includes(i);
      if (should) row.classList.add('is-correct');
      if (chosen && !should) row.classList.add('is-incorrect');
    });
  } else if (q.type === 'order') {
    screen.querySelectorAll('.drag-item').forEach(item => { item.draggable = false; });
    screen.querySelectorAll('.drag-actions button').forEach(btn => btn.disabled = true);
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
  if (!correct) { state.streak = 0; return; }
  state.streak++;
  if (state.streak >= STREAK_TARGET) {
    if (state.hearts < MAX_HEARTS) state.hearts++;
    state.streak = 0;
  }
}

function handlePracticeAnswer(q, answer) {
  const correct = isCorrect(q, answer);
  markAnswerVisuals(q, answer);
  adjustStreak(correct);

  let heartLost = false;
  if (!correct) {
    state.mistakesInPhase++;
    if (state.practicePhase === 'gate') {
      state.hearts = Math.max(0, state.hearts - 1);
      heartLost = true;
    }
  }
  saveState();
  updateStatus();

  showFeedback(correct, q.explanation, 'Continue', () => advancePractice(correct), heartLost);
}

function advancePractice(correct) {
  const phase = state.practicePhase;
  const count = getPhaseCount();
  state.currentQuestion = null;

  if (state.hearts <= 0) {
    state.view = 'gameOver';
    saveState(); render(); return;
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
    saveState(); render(); return;
  }

  state.practiceIndex++;
  if (state.practiceIndex >= count) {
    state.practiceIndex = 0;
    state.mistakesInPhase = 0;
    if (phase === 'basic') state.practicePhase = 'hard';
    else if (phase === 'hard') state.practicePhase = 'gate';
  }
  saveState(); render();
}

function renderPhaseReset(phase) {
  const name = phase === 'basic' ? 'basic' : 'harder';
  shell({
    kicker: 'Learning loop',
    title: `Two misses — replay the ${name} rung.`,
    body: `<p class="lede">You stay at the same difficulty, but the rung restarts with different examples. Practice mistakes do not cost hearts.</p><div class="callout"><strong>Why restart?</strong><p>The aim is to stabilize the idea before moving to the gate, not punish a single mistake.</p></div>`,
    actions: `<button class="primary-button" id="retryRung" type="button">Try new examples</button>`
  });
  document.getElementById('retryRung').addEventListener('click', () => { state.view = 'practice'; saveState(); render(); });
}


function renderGateSuccess() {
  shell({
    kicker: 'Challenge gate cleared',
    title: 'You identified the intended achievement, not just the visible action.',
    body: `<div class="gate-success"><div class="gate-burst" aria-hidden="true">✦</div><p class="lede">The Goal quiz is now unlocked. It tests only Goal material you have already learned, using a different mix from the larger question bank where possible.</p></div>`,
    actions: `<button class="primary-button" id="quizReady" type="button">Go to Goal quiz</button>`
  });
  document.getElementById('quizReady').addEventListener('click', () => {
    state.view = 'quizIntro'; state.quizIndex = 0; state.quizCorrect = 0; state.quizAnswered = false; saveState(); render();
  });
}


function renderQuizIntro() {
  shell({
    kicker: 'Stage 8 · Concept quiz',
    title: 'Completion check: Goal',
    body: `
      <p class="lede">Each attempt draws five questions from five Goal assessment areas and requires four correct answers to pass. The exact length and pass standard remain prototype choices because the curriculum leaves them open.</p>
      <div class="gate-banner"><strong>Retry rule</strong><p>If the first attempt does not pass, you may retry once immediately. The retry uses a different question mix where possible. A second unsuccessful attempt returns you to the lesson.</p></div>`,
    actions: `<button class="secondary-button" id="reviewBeforeQuiz" type="button">Review lesson</button><button class="primary-button" id="beginQuiz" type="button">Begin attempt ${state.quizAttempt}</button>`
  });
  document.getElementById('reviewBeforeQuiz').addEventListener('click', () => { state.view = 'lesson'; state.lessonIndex = 0; saveState(); render(); });
  document.getElementById('beginQuiz').addEventListener('click', () => { state.view = 'quiz'; state.quizIndex = 0; state.quizCorrect = 0; buildQuizSet(); saveState(); render(); });
}


function renderQuiz() {
  if (!state.quizSet || state.quizSet.length !== QUIZ_LENGTH) {
    buildQuizSet();
    saveState();
  }
  const q = state.quizSet[state.quizIndex];
  const dots = `<div class="quiz-status"><span>Attempt ${state.quizAttempt}</span><span class="dot-row">${state.quizSet.map((_, i) => `<span class="dot ${i < state.quizIndex ? 'done' : ''}"></span>`).join('')}</span></div>`;
  renderQuestionScreen(q, `Goal quiz · ${state.quizIndex + 1}/${QUIZ_LENGTH}`, dots, handleQuizAnswer);
}

function handleQuizAnswer(q, answer) {
  const correct = isCorrect(q, answer);
  markAnswerVisuals(q, answer);
  if (correct) state.quizCorrect++;
  saveState();
  showFeedback(correct, q.explanation, state.quizIndex === QUIZ_LENGTH - 1 ? 'Finish quiz' : 'Next question', advanceQuiz);
}

function advanceQuiz() {
  state.quizIndex++;
  if (state.quizIndex >= QUIZ_LENGTH) {
    state.quizPassed = state.quizCorrect >= QUIZ_PASS;
    state.view = 'quizResult';
  }
  saveState(); render();
}


function renderQuizResult() {
  if (state.quizPassed) {
    shell({
      kicker: 'Concept completion',
      title: 'Goal completed.',
      body: `<p class="lede">Completion means you successfully finished the initial Goal sequence. It does <strong>not</strong> mean every depth of Goal is permanently mastered.</p><div class="callout"><strong>Next:</strong><p>Real-world proof reinforces the concept with identifiable published works. It is not another scored challenge.</p></div>`,
      actions: `<button class="primary-button" id="proofBtn" type="button">See real-world proof</button>`
    });
    document.getElementById('proofBtn').addEventListener('click', () => setView('proof'));
    return;
  }

  const secondFailure = state.quizAttempt >= 2;
  shell({
    kicker: 'Completion checkpoint',
    title: secondFailure ? 'Return to the lesson before another attempt.' : 'One immediate retry is available.',
    body: `<p class="lede">The quiz is a completion checkpoint, not a punishment. ${secondFailure ? 'The second attempt did not pass, so the learning sequence resets to the Goal lesson.' : 'Review the explanations you just saw, then make one immediate retry.'}</p>`,
    actions: secondFailure
      ? `<button class="primary-button" id="returnLesson" type="button">Return to Goal lesson</button>`
      : `<button class="secondary-button" id="reviewQuizLesson" type="button">Review first</button><button class="primary-button" id="retryQuiz" type="button">Retry quiz</button>`
  });

  if (secondFailure) {
    document.getElementById('returnLesson').addEventListener('click', () => {
      state.quizAttempt = 1; state.quizIndex = 0; state.quizCorrect = 0; state.quizPassed = false; state.quizSet = []; state.previousQuizIds = [];
      state.lessonIndex = 0; state.view = 'lesson'; saveState(); render();
    });
  } else {
    document.getElementById('reviewQuizLesson').addEventListener('click', () => { state.view = 'lesson'; state.lessonIndex = 0; saveState(); render(); });
    document.getElementById('retryQuiz').addEventListener('click', () => {
      state.quizAttempt = 2; state.quizIndex = 0; state.quizCorrect = 0; state.quizPassed = false; buildQuizSet(); state.view = 'quiz'; saveState(); render();
    });
  }
}


function renderProof() {
  shell({
    kicker: 'Stage 9 · Real-world proof',
    title: 'Goal is visible in published stories.',
    body: `<p class="lede">These examples reinforce Goal using public-domain works. They are evidence screens, not scored questions.</p><div class="proof-grid">${realWorldProof.map(p => `<article class="proof-card"><span class="mini-label">${p.work}</span><h3>${p.title}</h3><p>${p.body}</p><div class="proof-source"><span>${p.source}</span><a href="${p.url}" target="_blank" rel="noopener noreferrer">Open source ↗</a></div></article>`).join('')}</div>`,
    actions: `<button class="primary-button" id="finishLevel" type="button">Complete level 2</button>`
  });
  document.getElementById('finishLevel').addEventListener('click', () => { state.completed = true; state.view = 'complete'; saveState(); render(); });
}


function renderComplete() {
  shell({
    body: `<div class="level-complete"><div class="seal" aria-hidden="true">✦</div><span class="mini-label">Story Construction · Goal</span><h1>Level complete.</h1><p>You can identify what a character is trying to achieve, distinguish a goal from actions and circumstances, infer an unstated goal from behaviour, and recognize when a goal changes.</p><div class="callout"><strong>Next concept: Motivation</strong><p>Motivation is next in the agreed sequence, but Level 3 has not been built yet.</p></div></div>`,
    actions: `<button class="secondary-button" id="replayLevel" type="button">Replay Goal</button><button class="secondary-button" id="reviewCharacter" type="button">Review Character</button><button class="primary-button" id="viewMapDone" type="button">View concept path</button>`
  });
  document.getElementById('replayLevel').addEventListener('click', () => {
    const hearts = state.hearts;
    state = defaultState();
    state.hearts = hearts;
    state.view = 'lesson';
    state.startedAt = new Date().toISOString();
    saveState(); render();
  });
  document.getElementById('reviewCharacter').addEventListener('click', () => window.writecraftNavigate('character'));
  document.getElementById('viewMapDone').addEventListener('click', () => mapDialog.showModal());
}


function renderGameOver() {
  shell({
    kicker: '0 hearts',
    title: 'This run has ended.',
    body: `<p class="lede">Only challenge-gate misses can remove hearts. The curriculum has not yet fixed exactly where a learner should restart after game over, so this prototype returns you to the Goal lesson with three hearts.</p>`,
    actions: `<button class="primary-button" id="restartAfterGameOver" type="button">Restart from lesson</button>`
  });
  document.getElementById('restartAfterGameOver').addEventListener('click', () => {
    state.hearts = MAX_HEARTS;
    state.streak = 0;
    state.practicePhase = 'basic';
    state.practiceIndex = 0;
    state.mistakesInPhase = 0;
    state.currentQuestion = null;
    state.selectedQuestionIds = { basic: [], hard: [], gate: [] };
    state.lessonIndex = 0;
    state.view = 'lesson';
    saveState(); render();
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


function renderConceptMap() {
  let characterCompleted = false;
  try {
    const characterState = JSON.parse(localStorage.getItem(CHARACTER_STORAGE_KEY));
    characterCompleted = Boolean(characterState && characterState.completed);
  } catch {}
  conceptMap.innerHTML = concepts.map((name, i) => {
    if (i === 0) {
      return `<li class="${characterCompleted ? 'current' : 'locked'}"><span class="map-number">1</span><span class="map-name">Character</span><span class="map-state">${characterCompleted ? 'Completed' : 'Prerequisite'}</span></li>`;
    }
    if (i === 1) {
      return `<li class="current"><span class="map-number">2</span><span class="map-name">Goal</span><span class="map-state">${state.completed ? 'Completed' : 'Current'}</span></li>`;
    }
    const prereq = i === 2 ? 'Complete Goal' : 'Locked';
    return `<li class="locked"><span class="map-number">${i + 1}</span><span class="map-name">${name}</span><span class="map-state">${prereq}</span></li>`;
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
mapDialog.addEventListener('click', e => {
  const rect = mapDialog.getBoundingClientRect();
  const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
  if (outside) mapDialog.close();
});

render();
