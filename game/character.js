'use strict';

const APP_VERSION = '3.0.0-shared-engine';
const STORAGE_KEY = 'writecraft-level1-state-v1';
const VARIATION_HISTORY_KEY = 'writecraft-level1-variation-history-v1';
const QUIZ_LENGTH = 5;
const QUIZ_PASS = 4;
const MAX_HEARTS = 3;
const STREAK_TARGET = 5;
const RECENT_ANSWER_WINDOW = 3; // Prototype value; final window remains a testing decision.

const concepts = [
  'Character', 'Goal', 'Motivation', 'Stakes', 'Conflict', 'Obstacles',
  'Cause and Effect', 'Plot', 'Setting', 'Point of View', 'Scenes', 'Escalation',
  'Turning Points', 'Setup and Payoff', 'Character Arc', 'Story Arc', 'Climax',
  'Resolution', 'Theme'
];

const conceptGlossary = {
  'narrative.protagonist': {
    category: 'Narrative importance', label: 'Protagonist',
    definition: 'The primary character who drives the story through goals, choices, and struggle.',
    example: 'Mara is trying to find her missing brother. Her decisions determine where the investigation goes, which risks are taken, and what consequences follow, so Mara is the protagonist.'
  },
  'narrative.co-protagonist': {
    category: 'Narrative importance', label: 'Co-protagonist',
    definition: 'A character who shares primary narrative importance with another protagonist.',
    example: 'Two sisters receive comparable narrative focus, both drive major decisions, and neither clearly carries more story weight than the other. They function as co-protagonists.'
  },
  'narrative.deuteragonist': {
    category: 'Narrative importance', label: 'Deuteragonist',
    definition: 'The second-most important character in the narrative.',
    example: 'Ivo travels with Mara, has important choices and conflicts of his own, and affects the main story repeatedly, but the narrative still gives Mara greater weight. Ivo is the deuteragonist.'
  },
  'narrative.co-deuteragonist': {
    category: 'Narrative importance', label: 'Co-deuteragonist',
    definition: 'One of two or more characters who share the second level of narrative importance.',
    example: 'One protagonist remains clearly primary, while two partners receive comparable secondary focus and consequence. The partners can function as co-deuteragonists.'
  },
  'narrative.tritagonist': {
    category: 'Narrative importance', label: 'Tritagonist',
    definition: 'The third-most important character in the narrative.',
    example: 'Sera is a major recurring character whose choices alter several important events, but the story gives more narrative weight to Mara and Ivo. Sera functions as the tritagonist.'
  },
  'narrative.supporting': {
    category: 'Narrative importance', label: 'Supporting character',
    definition: 'A character important to the story without carrying primary narrative importance.',
    example: 'The town librarian helps Mara uncover old records, challenges one of her assumptions, and appears throughout the investigation. The librarian matters to the story but does not carry its primary narrative weight.'
  },
  'narrative.minor': {
    category: 'Narrative importance', label: 'Minor character',
    definition: 'A character with a smaller narrative role.',
    example: 'A station clerk appears in one scene to identify the train Mara’s brother boarded. The clerk serves a real story purpose but occupies only a small part of the narrative.'
  },
  'narrative.ensemble': {
    category: 'Narrative importance', label: 'Ensemble',
    definition: 'Narrative importance is distributed across a group rather than centered entirely on one primary character.',
    example: 'A story follows five firefighters, regularly shifting among their goals, relationships, and choices without allowing one person to dominate the whole narrative. The group forms an ensemble.'
  },
  'narrative.antagonist': {
    category: 'Narrative importance', label: 'Antagonist',
    definition: 'The primary opposing force to the protagonist or central story goal.',
    example: 'Mara needs access to sealed records, while Inspector Vale repeatedly blocks that access because he believes releasing them would endanger witnesses. Vale is acting as an antagonist even if his motive is not villainous.'
  },

  'function.ally': {
    category: 'Story function', label: 'Ally',
    definition: 'A character who supports another character’s efforts or goals.',
    example: 'Nia risks her job to help Mara enter the archive after hours. Her main function in that part of the story is as an ally.'
  },
  'function.sidekick': {
    category: 'Story function', label: 'Sidekick',
    definition: 'A close companion who regularly assists a more central character.',
    example: 'Toma accompanies the detective through most of the case, handles practical tasks, and helps solve problems while the detective remains the central figure.'
  },
  'function.confidant': {
    category: 'Story function', label: 'Confidant',
    definition: 'A character trusted with another character’s private thoughts, fears, plans, or feelings.',
    example: 'Lena tells her brother the fear she hides from everyone else. Because he gives her a safe place to reveal what she will not say publicly, he functions as her confidant.'
  },
  'function.mentor': {
    category: 'Story function', label: 'Mentor',
    definition: 'A character who guides, teaches, advises, or prepares another character.',
    example: 'A retired pilot teaches Jo how to read dangerous wind patterns and forces her to practice difficult landings before the rescue mission. The pilot is functioning as a mentor.'
  },
  'function.foil': {
    category: 'Story function', label: 'Foil',
    definition: 'A character whose contrast with another character makes particular traits or choices more noticeable.',
    example: 'Amir plans every move cautiously while Jana acts immediately on instinct. Their contrast makes Jana’s impulsiveness and Amir’s caution easier to see, so each can function as a foil to the other.'
  },
  'function.rival': {
    category: 'Story function', label: 'Rival',
    definition: 'A character who competes with another character for the same or a closely related objective.',
    example: 'Two apprentice chefs both want the single position in a famous restaurant. Neither needs to be evil; their competing goal makes them rivals.'
  },
  'function.love-interest': {
    category: 'Story function', label: 'Love interest',
    definition: 'A character whose romantic relationship or romantic possibility has a meaningful story function.',
    example: 'As the expedition becomes more dangerous, Dev must decide whether to remain with the team or return with the person he has grown to love. That relationship gives the love interest a meaningful role in his choices.'
  },
  'function.comic-relief': {
    category: 'Story function', label: 'Comic relief',
    definition: 'A character who helps release or contrast tension through humour.',
    example: 'After a frightening escape, Pella dryly complains that the monster has ruined her only good coat. The joke briefly releases tension without changing the danger around the group.'
  },
  'function.herald': {
    category: 'Story function', label: 'Herald / messenger',
    definition: 'A character who brings information, a warning, an invitation, or a demand that changes what other characters must deal with.',
    example: 'A royal courier arrives with an order recalling Soren to the capital. The messenger’s arrival brings information that forces the story in a new direction.'
  },
  'function.gatekeeper': {
    category: 'Story function', label: 'Threshold guardian / gatekeeper',
    definition: 'A character who controls access to a place, resource, group, stage, or opportunity and must be dealt with before progress can continue.',
    example: 'The archive director refuses Mara entry until she can prove why the sealed files are relevant. The director functions as a gatekeeper to the information Mara needs.'
  },
  'function.catalyst': {
    category: 'Story function', label: 'Catalyst',
    definition: 'A character whose action, arrival, decision, or influence helps trigger change or action in others.',
    example: 'Eli secretly sends Mara a photograph that proves her brother was being followed. His action pushes her to reopen a lead she had abandoned, making him a catalyst for renewed action.'
  },
  'function.sacrificial': {
    category: 'Story function', label: 'Sacrificial character',
    definition: 'A character who gives up something major so that another character, group, or goal can continue.',
    example: 'Commander Reyes stays behind to hold a failing door long enough for the rest of the crew to escape. The sacrifice changes what becomes possible for everyone else.'
  },
  'function.false-antagonist': {
    category: 'Story function', label: 'False antagonist',
    definition: 'A character presented for a time as though they are the main opposition, before the story reveals that the apparent role was incomplete or misleading.',
    example: 'A strict teacher seems to be sabotaging Mina’s investigation, but later Mina learns the teacher was hiding evidence to protect a threatened student. The teacher served as a false antagonist.'
  },
  'function.henchman': {
    category: 'Story function', label: 'Henchman / enforcer',
    definition: 'A character who carries out threats, force, punishment, or difficult orders on behalf of a more powerful opposing figure.',
    example: 'The crime boss rarely confronts witnesses personally; instead, her lieutenant visits them and makes the threats. The lieutenant functions as her enforcer.'
  },
  'function.minion': {
    category: 'Story function', label: 'Minion / follower',
    definition: 'A character who follows or serves a more powerful figure, usually with less independence or authority.',
    example: 'Several cult members guard doors and carry out the leader’s routine commands without shaping the larger plan themselves. They function as followers or minions.'
  },
  'function.authority': {
    category: 'Story function', label: 'Authority figure',
    definition: 'A character whose formal or social position gives them power to set rules, grant permission, impose consequences, or shape other characters’ options.',
    example: 'The principal can suspend the school paper, approve access to records, and discipline students. That institutional power makes her an authority figure.'
  },
  'function.innocent': {
    category: 'Story function', label: 'Innocent / dependent',
    definition: 'A vulnerable or dependent character whose safety, needs, or trust creates responsibility for other characters.',
    example: 'A stranded child cannot cross the flooded valley alone, forcing the rescue team to change its route and accept greater risk. The child functions as a dependent character.'
  },

  'dimensions.round': {
    category: 'Character complexity', label: 'Round',
    definition: 'A Complexity term for a character presented with multiple traits, tensions, motives, or sides that create a sense of depth.',
    example: 'Nora is generous with strangers, resentful toward her sister, brave during emergencies, and deeply afraid of being abandoned. Those different sides make her feel more complex than a single defining trait.'
  },
  'dimensions.flat': {
    category: 'Character complexity', label: 'Flat',
    definition: 'A Complexity term for a character presented around a limited set of clear traits or functions rather than extensive depth.',
    example: 'The cheerful ferry operator appears several times, always practical and upbeat, and exists mainly to get the team across the river and deliver local information. The character can work effectively without being deeply layered.'
  },
  'dimensions.stock': {
    category: 'Character pattern', label: 'Stock',
    definition: 'A Pattern term for a character built from a familiar, quickly recognizable type that lets the audience understand the role with little explanation.',
    example: 'A suspicious old innkeeper warns travellers not to enter the forest and distrusts every stranger. The story uses a familiar type so the audience can understand him almost immediately.'
  },
  'dimensions.archetypal': {
    category: 'Character pattern', label: 'Archetypal',
    definition: 'A Pattern term for a character shaped around a broad, recurring human or storytelling pattern that appears across many different stories.',
    example: 'An inexperienced heir is forced out of safety, tested by loss, and eventually must decide what kind of leader to become. The character draws on a recurring heir-and-leader archetypal pattern.'
  },

  'moral.hero': {
    category: 'Moral / heroic framing', label: 'Hero',
    definition: 'A character framed around admirable or courageous action, especially action taken to protect, help, or serve beyond narrow self-interest.',
    example: 'An exhausted medic refuses evacuation until the trapped passengers have been treated and moved to safety. The story frames that choice as heroic.'
  },
  'moral.antihero': {
    category: 'Moral / heroic framing', label: 'Antihero',
    definition: 'A central or heroic-position character who lacks some conventional heroic qualities or relies on morally questionable methods.',
    example: 'Rook exposes a corrupt company, but he lies, steals evidence, and blackmails an executive to do it. The story can frame him as an antihero rather than a conventional hero.'
  },
  'moral.villain': {
    category: 'Moral / heroic framing', label: 'Villain',
    definition: 'A character framed as seriously harmful, cruel, exploitative, or morally destructive.',
    example: 'Director Voss knowingly poisons a town’s water supply to protect company profits and threatens anyone who discovers it. The story frames those choices as villainous.'
  },
  'moral.anti-villain': {
    category: 'Moral / heroic framing', label: 'Anti-villain',
    definition: 'A character in a villainous or opposing position who also has sympathetic motives, admirable qualities, or a goal that is understandable even when the chosen methods are harmful.',
    example: 'A rebel leader wants medicine for an abandoned district, but takes hostages to force the government to supply it. The motive may be sympathetic while the methods keep the character in an anti-villain framing.'
  },
  'moral.tragic-hero': {
    category: 'Moral / heroic framing', label: 'Tragic hero',
    definition: 'A substantially admirable central character whose choices, limitations, or flaws contribute to a serious downfall.',
    example: 'A respected commander cannot admit that his strategy is failing. His pride keeps him from retreating until the army is destroyed, turning an admirable leader into a tragic hero.'
  },
  'moral.tragic-villain': {
    category: 'Moral / heroic framing', label: 'Sympathetic / tragic villain',
    definition: 'A villainous character whose suffering, history, motives, or downfall invites understanding or sympathy without erasing the harm they cause.',
    example: 'After losing her family in a preventable disaster, Selene becomes obsessed with punishing everyone connected to it, including people who were not responsible. Her grief makes her understandable, while her choices remain destructive.'
  },

  'force.choice': {
    category: 'Character as story force', label: 'Choice',
    definition: 'A decision the character makes that reveals priorities and can change what happens next.',
    example: 'Mara finds evidence that could clear her brother, but revealing it would expose a frightened witness. She chooses to protect the witness for now, and that decision forces her investigation onto a harder path.'
  },
  'force.struggle': {
    category: 'Character as story force', label: 'Struggle',
    definition: 'The pressure, resistance, or difficulty that pushes against a character and makes easy success impossible.',
    example: 'Jo needs to land the rescue plane before the storm closes the valley, but violent crosswinds keep forcing her away from the runway. The weather creates the struggle she must overcome.'
  },
  'force.relationship': {
    category: 'Character as story force', label: 'Relationship',
    definition: 'A connection between characters that changes their pressure, options, feelings, or decisions.',
    example: 'Nia wants to leave town, but her younger brother depends on her. Their relationship changes what Nia is willing to risk and makes leaving a much harder choice.'
  },
  'force.consequence': {
    category: 'Character as story force', label: 'Consequence',
    definition: "What follows from a character's choice or action and changes the situation that comes next.",
    example: "Mara lies to the inspector to protect a witness. When the lie is discovered, the inspector stops sharing information with her. Losing that trust is a consequence of Mara's earlier choice."
  }
};


const glossaryExampleVariants = {
  'narrative.protagonist': [
    `Tess is the one trying to keep her family farm from being sold. The major decisions, setbacks, and consequences follow her efforts, so she carries the story as protagonist.`,
    `A mystery follows Omar as he searches for the person who framed him. Other characters matter, but Omar's choices keep redirecting the investigation, making him the protagonist.`
  ],
  'narrative.deuteragonist': [
    `The novel centers on Priya, but her brother Nalin receives the next greatest narrative weight, makes consequential choices, and carries an important strand of the story. Nalin is the deuteragonist.`,
    `June remains the primary character, while Mateo repeatedly shares major scenes, decisions, and consequences without quite carrying equal weight. Mateo functions as the deuteragonist.`
  ],
  'narrative.tritagonist': [
    `The story gives its greatest weight to Ana, then Malik, while Dr. Sato has the third-largest recurring role and meaningfully affects the outcome. Dr. Sato is the tritagonist.`,
    `Three investigators dominate the book, but one clearly leads and another receives the second-most focus. The third still matters greatly, making that character the tritagonist.`
  ],
  'narrative.supporting': [
    `A neighbour appears throughout the story, provides key information, and influences the protagonist's decisions, but the narrative never centers on her. She is a supporting character.`,
    `The protagonist's coach matters in several turning moments and shapes important choices, yet the story's main weight belongs elsewhere. The coach is supporting rather than primary.`
  ],
  'narrative.minor': [
    `A nurse appears briefly to deliver test results that change the protagonist's next decision. The role matters, but its narrative space is small, making the nurse a minor character.`,
    `A taxi driver appears in one scene, gives the protagonist a useful observation, and never returns. The driver has a minor narrative role.`
  ],
  'narrative.ensemble': [
    `A workplace drama follows six employees, regularly shifting focus so that no single person owns most of the narrative. The cast functions as an ensemble.`,
    `Four siblings each carry major goals, conflicts, and viewpoint time, with the story depending on all of them rather than one clear lead. That distribution creates an ensemble.`
  ],
  'narrative.antagonist': [
    `A park ranger keeps blocking the protagonist from entering a closed wilderness zone because lives are at risk. The ranger opposes the central goal and can therefore function as an antagonist without being villainous.`,
    `The protagonist wants to publish a dangerous secret, while an editor repeatedly stops her because innocent people could be harmed. The editor is an antagonistic force even though the motive is protective.`
  ],

  'function.ally': [
    `When Dara decides to expose the fraud, her coworker gathers records and agrees to testify. The coworker functions as an ally because she actively supports Dara's goal.`,
    `A scout guides the rescue team through an unsafe pass and shares supplies when they run short. His story function is that of an ally.`
  ],
  'function.sidekick': [
    `A young mechanic accompanies the bounty hunter on nearly every job, handles equipment, and helps solve practical problems while the hunter remains central. The mechanic functions as a sidekick.`,
    `The reporter's longtime partner joins most investigations, supports the legwork, and provides another set of eyes without becoming the main character. That recurring companion role is sidekick-like.`
  ],
  'function.confidant': [
    `Mina tells only her aunt that she is terrified of failing the rescue. Because the aunt receives thoughts Mina hides from everyone else, she functions as a confidant.`,
    `After each public victory, Devon admits his private doubts to one old friend. That trusted listener serves as his confidant.`
  ],
  'function.mentor': [
    `An experienced climber teaches Ren how to read ice, corrects dangerous habits, and prepares him for a solo ascent. She functions as a mentor.`,
    `The retired detective does not solve the case for Imani; instead, he teaches her how to question assumptions and notice inconsistencies. His story function is mentor.`
  ],
  'function.foil': [
    `Luca forgives easily while his sister remembers every insult. Their contrast makes each character's attitude toward resentment more visible, so they function as foils.`,
    `One doctor follows procedure no matter the delay; another improvises whenever a life is at risk. Their opposing habits highlight each other's values, creating a foil relationship.`
  ],
  'function.rival': [
    `Two students are competing for the same scholarship and repeatedly measure themselves against one another. Their shared objective makes them rivals.`,
    `Both explorers want to be first to reach the lost observatory. Neither must be evil; the competition itself creates the rival function.`
  ],
  'function.love-interest': [
    `A developing romance with the ship's navigator complicates Arin's plan to abandon the voyage. The navigator functions as a love interest because the romantic bond meaningfully affects Arin's choices.`,
    `Sofia's feelings for a political opponent repeatedly complicate what she is willing to reveal. The romantic possibility gives that character a love-interest function.`
  ],
  'function.comic-relief': [
    `After the group barely escapes a collapsing tunnel, Ezra looks at his ruined lunch and says, "I was saving that." The humour briefly releases tension, giving him a comic-relief function.`,
    `A nervous guard keeps making dry observations during a frightening siege. Those moments create temporary relief from pressure without removing the danger.`
  ],
  'function.herald': [
    `A messenger arrives with news that the border has closed, forcing the travellers to abandon their planned route. The messenger functions as a herald because the information changes what comes next.`,
    `A doctor calls to say the transplant window has opened. That news forces an immediate decision and gives the doctor a herald or messenger function in the scene.`
  ],
  'function.gatekeeper': [
    `The museum curator will not let the researcher inspect the private collection until she proves her credentials. The curator functions as a gatekeeper to the needed resource.`,
    `A union representative controls who may enter the closed worksite. The protagonist must persuade her before gaining access, so she serves as a gatekeeper.`
  ],
  'function.catalyst': [
    `A stranger returns the protagonist's lost diary with one page missing. That small act triggers suspicion and sends the protagonist searching for answers, giving the stranger a catalyst function.`,
    `Milo publicly resigns rather than support the cover-up. His decision inspires three others to act, making him a catalyst for change.`
  ],
  'function.sacrificial': [
    `A pilot gives up the last escape seat so an injured passenger can leave the station. The sacrifice allows another character to survive and continue.`,
    `To protect the group, a witness destroys evidence that would have cleared her own name. Giving up her future for others gives her a sacrificial function.`
  ],
  'function.false-antagonist': [
    `For half the story, a suspicious neighbour appears to be sabotaging the protagonist, but later the sabotage is revealed to come from someone else and the neighbour was actually hiding a separate secret. The neighbour functions as a false antagonist.`,
    `A prosecutor seems to be the central enemy until the protagonist learns she has been quietly resisting a more powerful conspirator. The early appearance of opposition makes her a false antagonist.`
  ],
  'function.henchman': [
    `A wealthy smuggler rarely uses violence personally; his security chief intimidates witnesses and carries out threats for him. The chief functions as an enforcer.`,
    `The governor gives the orders, while a captain raids homes and punishes dissenters on the governor's behalf. The captain fills the henchman or enforcer role.`
  ],
  'function.minion': [
    `Several guards obey the sorcerer's routine orders and protect his tower without shaping the larger plan. They function as followers or minions.`,
    `The gang leader's lowest-ranking members deliver packages and watch doors but have little independent authority. Their function is that of followers or minions.`
  ],
  'function.authority': [
    `A judge can decide whether the protagonist receives bail and can impose legal consequences. That formal power gives the judge an authority-figure function.`,
    `The expedition leader decides who may leave camp and when the team must turn back. Her position gives her authority over the others' options.`
  ],
  'function.innocent': [
    `An elderly passenger cannot escape the wreck alone, forcing the protagonist to choose between speed and responsibility. The passenger functions as a dependent character.`,
    `A frightened child knows nothing about the conflict but becomes someone the group must protect. That vulnerability gives the child an innocent/dependent function.`
  ],

  'dimensions.round': [
    `A detective is compassionate with victims, jealous of a successful sibling, patient at work, and reckless when family is threatened. The combination of tensions and traits makes the character round.`,
    `A queen can be politically ruthless, privately funny, deeply loyal to one friend, and terrified of appearing weak. Those multiple sides create roundness.`
  ],
  'dimensions.flat': [
    `A cheerful mail carrier appears in several scenes to deliver news and always behaves in the same straightforward way. The character is useful without extensive layering, making the character relatively flat in complexity.`,
    `A stern receptionist exists mainly to enforce office rules and is characterized almost entirely by that function. The limited complexity makes the character flat.`
  ],
  'dimensions.stock': [
    `A boastful travelling salesman appears briefly, talks fast, exaggerates every product, and immediately fits a familiar type. The story is using a stock character.`,
    `A gruff tavern keeper who distrusts outsiders and knows every local rumour can be understood almost instantly because the role draws on a familiar stock type.`
  ],
  'dimensions.archetypal': [
    `A reluctant young leader must leave safety, face trials, and decide whether to accept responsibility for a community. The pattern draws on a recurring reluctant-leader archetype.`,
    `An old wanderer appears at moments of crisis to offer difficult wisdom and then sends younger characters forward on their own. The character draws on a broad mentor archetype.`
  ],

  'moral.hero': [
    `A firefighter re-enters a dangerous building to guide trapped residents out even after being ordered to evacuate. The story frames the self-risking action as heroic.`,
    `A lawyer gives up a lucrative case to protect a vulnerable client from exploitation. The narrative treats the sacrifice and courage as heroic.`
  ],
  'moral.antihero': [
    `A smuggler becomes the central figure fighting a dictatorship, but cheats allies and uses intimidation whenever it helps. The character can be framed as an antihero.`,
    `The lead investigator wants justice but routinely lies, trespasses, and manipulates people to get it. That mix of centrality and compromised methods supports antihero framing.`
  ],
  'moral.villain': [
    `A landlord deliberately traps tenants in unsafe contracts and threatens anyone who reports the conditions. The story frames the exploitation as villainous.`,
    `A commander orders civilians harmed simply to frighten a rival city into surrender. The deliberate cruelty supports villain framing.`
  ],
  'moral.anti-villain': [
    `A scientist wants to stop a deadly outbreak but imprisons healthy people without consent to test a cure. The understandable goal combined with harmful methods can support anti-villain framing.`,
    `A rebel protects an oppressed village yet terrorizes unrelated civilians to force political change. Sympathetic motives and destructive methods create anti-villain complexity.`
  ],
  'moral.tragic-hero': [
    `A beloved mayor refuses to admit that her own policy caused the crisis. Her pride drives increasingly damaging choices until she loses the city she tried to protect, creating a tragic-hero pattern.`,
    `A gifted surgeon's need to prove himself keeps him operating when he should stop. His admirable dedication and destructive flaw combine in a tragic downfall.`
  ],
  'moral.tragic-villain': [
    `After years of abuse, Corin becomes determined to make everyone from his old institution suffer, including people who never harmed him. His history invites sympathy, but his choices remain villainous.`,
    `A grieving ruler begins by trying to prevent another war, then becomes increasingly cruel and controlling. The loss behind her actions makes the villainy tragic without excusing it.`
  ],

  'force.choice': [
    `Eli can expose his friend's lie or stay silent to protect the friendship. He chooses to speak, and that decision changes both the relationship and the investigation.`,
    `A captain must choose between pursuing the enemy and turning back for stranded civilians. The decision reveals priorities and redirects the story.`
  ],
  'force.struggle': [
    `Nora needs to confess before the hearing, but fear of losing her family keeps stopping her. The pressure between what she needs to do and what she fears creates struggle.`,
    `A climber can see the summit, but injury, weather, and dwindling daylight make success difficult. Those pressures create the struggle.`
  ],
  'force.relationship': [
    `Jon would normally report the theft immediately, but the thief is his younger sister. Their relationship changes the pressure around the decision.`,
    `A commander trusts one lieutenant and distrusts another, so identical advice from each produces very different choices. The relationships alter how pressure is felt.`
  ],
  'force.consequence': [
    `Tara skips an important meeting to follow a suspicious stranger. She learns something useful, but her absence costs her a promotion. That lost opportunity is a consequence of the choice.`,
    `A student publicly accuses the wrong person. Even after apologizing, classmates stop trusting his judgment. The damaged trust is a consequence that shapes later scenes.`
  ]
};

const glossaryGroups = {
  narrative: [
    'narrative.protagonist', 'narrative.co-protagonist',
    'narrative.deuteragonist', 'narrative.co-deuteragonist', 'narrative.tritagonist',
    'narrative.supporting', 'narrative.minor', 'narrative.ensemble', 'narrative.antagonist'
  ],
  function: [
    'function.ally', 'function.sidekick', 'function.confidant', 'function.mentor',
    'function.foil', 'function.rival', 'function.love-interest', 'function.comic-relief',
    'function.herald', 'function.gatekeeper', 'function.catalyst', 'function.sacrificial',
    'function.false-antagonist', 'function.henchman', 'function.minion',
    'function.authority', 'function.innocent'
  ],
  complexity: ['dimensions.round', 'dimensions.flat'],
  pattern: ['dimensions.stock', 'dimensions.archetypal'],
  moral: [
    'moral.hero', 'moral.antihero', 'moral.villain', 'moral.anti-villain',
    'moral.tragic-hero', 'moral.tragic-villain'
  ]
};

function glossaryLink(key) {
  const entry = conceptGlossary[key];
  return `<button class="term-link" type="button" data-term="${key}" aria-haspopup="dialog">${entry.label}</button>`;
}

function glossaryList(groupName) {
  return `<span class="term-list">${glossaryGroups[groupName].map(glossaryLink).join('<span class="term-separator" aria-hidden="true">,</span> ')}</span>`;
}

function glossaryGrid(groupName) {
  return `<div class="term-grid">${glossaryGroups[groupName].map(key => {
    const entry = conceptGlossary[key];
    return `<button class="term-tile" type="button" data-term="${key}" aria-haspopup="dialog"><strong>${entry.label}</strong><span>Definition + example</span></button>`;
  }).join('')}</div>`;
}

const lessonScreens = [
  { stage:'Stage 1 · What is it?', title:'A story moves through people who matter.', html:`
    <div class="hero-word" aria-hidden="true">character</div>
    <p class="lede">A <strong>character</strong> is who the story is about or who participates meaningfully in the narrative.</p>
    <div class="callout"><strong>Key idea:</strong><p>Character becomes meaningful through choices, struggle, relationships, consequences, and story movement — not merely through a label.</p></div>` },
  { stage:'Stage 2 · Forms', title:'One character can be described in several independent ways.', html:`
    <p class="lede">The same character can fit several terms at once because the terms answer different questions. Select any term for a definition and example.</p>
    <div class="category-list">
      <div class="category-card"><strong>Narrative importance</strong><span>How much narrative weight does the character carry?</span><div class="inline-terms">${glossaryList('narrative')}</div></div>
      <div class="category-card"><strong>Story function</strong><span>What job does the character perform?</span><div class="inline-terms">${glossaryList('function')}</div></div>
      <div class="category-card"><strong>Character complexity</strong><span>How much meaningful depth does this role need?</span><div class="inline-terms">${glossaryList('complexity')}</div></div>
      <div class="category-card"><strong>Character patterns</strong><span>Does the character draw on a recognizable type or broad recurring pattern?</span><div class="inline-terms">${glossaryList('pattern')}</div></div>
      <div class="category-card"><strong>Moral / heroic framing</strong><span>How is the character framed morally or heroically?</span><div class="inline-terms">${glossaryList('moral')}</div></div>
    </div>` },
  { stage:'Stage 2 · Narrative importance', title:'Who carries the narrative weight?', html:`
    <p class="lede">Narrative importance describes <strong>how central a character is to the narrative</strong>. It does not tell you whether the character is good, evil, helpful, or harmful.</p>
    ${glossaryGrid('narrative')}
    <p class="lede">Primary or secondary narrative weight can be shared, which is why co-protagonists and co-deuteragonists are possible.</p>` },
  { stage:'Stage 2 · Story function', title:'What job does the character perform in the story?', html:`
    <p class="lede">A story-function term describes <strong>what a character does</strong>. It is separate from narrative importance, complexity, pattern, and moral framing.</p>
    ${glossaryGrid('function')}` },
  { stage:'Stage 2 · Complexity and pattern', title:'Depth and recognizable pattern are different questions.', html:`
    <p class="lede"><strong>Character complexity</strong> asks how much meaningful depth the role needs. Round and flat are not good-versus-bad writing labels.</p>
    <div class="category-list">
      <div class="category-card"><strong>Complexity</strong><span>A round character may show multiple facets, tensions, values, fears, contradictions, or different behaviour in different relationships. A flat character can be deliberately simpler when extra depth would not serve the story.</span><div class="inline-terms">${glossaryList('complexity')}</div></div>
      <div class="category-card"><strong>Pattern</strong><span>Stock and archetypal describe recognizable patterns. A pattern can be developed with either more or less complexity.</span><div class="inline-terms">${glossaryList('pattern')}</div></div>
    </div>
    <div class="callout"><strong>Useful question:</strong><p>How much complexity does this character need for the job they perform in this story?</p></div>` },
  { stage:'Stage 2 · Moral / heroic framing', title:'Moral framing is separate from story position.', html:`
    <p class="lede">A protagonist is not automatically a hero, and an antagonist is not automatically a villain.</p>
    ${glossaryGrid('moral')}` },
  { stage:'Stage 3 · What is it not?', title:'Keep the classification systems separate.', html:`
    <div class="callout"><strong>Protagonist ≠ hero</strong><p>Narrative importance does not determine moral goodness.</p></div>
    <div class="callout"><strong>Antagonist ≠ villain</strong><p>Opposition does not automatically make a character morally villainous.</p></div>
    <div class="callout"><strong>Function ≠ complexity ≠ pattern</strong><p>Mentor describes function. Round describes complexity. Archetypal describes a recurring pattern. Those labels can overlap without competing.</p></div>
    <div class="callout"><strong>Complexity ≠ change</strong><p>Round and flat describe depth. Character change and stability are taught later in the dedicated <strong>Character Arc</strong> concept, not classified here.</p></div>` },
  { stage:'Stages 4–6 · How it works', title:'Character is an active story force.', html:`
    <p class="lede">A character matters through what they want, do, choose, resist, and cause. Relationships alter pressure and options, while consequences make choices matter.</p>
    <div class="connection-grid">
      <button class="connection-term" type="button" data-term="force.choice" aria-haspopup="dialog"><strong>Choice</strong><span>What the character decides.</span><em>Definition + example</em></button>
      <button class="connection-term" type="button" data-term="force.struggle" aria-haspopup="dialog"><strong>Struggle</strong><span>What pushes against them.</span><em>Definition + example</em></button>
      <button class="connection-term" type="button" data-term="force.relationship" aria-haspopup="dialog"><strong>Relationship</strong><span>Who changes the pressure around them.</span><em>Definition + example</em></button>
      <button class="connection-term" type="button" data-term="force.consequence" aria-haspopup="dialog"><strong>Consequence</strong><span>What follows from action.</span><em>Definition + example</em></button>
    </div>
    <p class="lede">Character connects next to <strong>Goal → Motivation → Stakes → Conflict</strong>. Later, Character Arc will examine change and stability in depth.</p>` }
];

const practicePools = {
  basic: [
    {
      id: 'b1', type: 'single',
      prompt: 'Which narrative-importance term means the primary character whose goals, choices, and struggles carry the story?',
      options: ['Protagonist', 'Mentor', 'Round character', 'Villain'], answer: 0,
      explanation: 'Protagonist is the narrative-importance term for the primary character carrying the story.'
    },
    {
      id: 'b2', type: 'single',
      prompt: 'A veteran sailor teaches the inexperienced lead how to navigate dangerous waters and prepares her for the final crossing. Which story-function term describes that role?',
      options: ['Mentor', 'Tritagonist', 'Antihero', 'Flat character'], answer: 0,
      explanation: 'Mentor describes what the sailor does in the story: teaching, guiding, and preparing another character.'
    },
    {
      id: 'b3', type: 'truefalse',
      prompt: 'True or false: A character who opposes the protagonist is automatically a villain.',
      options: ['True', 'False'], answer: 1,
      explanation: 'False. Antagonist describes opposition to the protagonist or central goal. Moral framing is a separate classification system.'
    },
    {
      id: 'b4', type: 'single',
      prompt: 'Which narrative-importance term describes the second-most important character in the narrative?',
      options: ['Deuteragonist', 'Foil', 'Supporting character', 'Co-protagonist'], answer: 0,
      explanation: 'Deuteragonist is the second-most important character in the narrative.'
    },
    {
      id: 'b5', type: 'single',
      prompt: 'A character is written with conflicting motives, several distinct traits, and different behaviour in different relationships. Which complexity term best fits?',
      options: ['Round', 'Flat', 'Minor', 'Hero'], answer: 0,
      explanation: 'Round describes meaningful depth and multiple facets. It is a complexity term, not a measure of narrative importance or moral goodness.'
    },
    {
      id: 'b6', type: 'truefalse',
      prompt: 'True or false: The primary character in a story can also be morally compromised enough to be an antihero.',
      options: ['True', 'False'], answer: 0,
      explanation: 'True. Protagonist describes narrative importance; antihero describes moral or heroic framing.'
    },
    {
      id: 'b7', type: 'single',
      prompt: 'One character is patient and methodical while another rushes into every decision. Their contrast makes both personalities clearer. Which story-function term best fits?',
      options: ['Foil', 'Mentor', 'Catalyst', 'Minor character'], answer: 0,
      explanation: 'A foil highlights another character through contrast.'
    },
    {
      id: 'b8', type: 'single',
      prompt: 'The protagonist shares fears and secrets with one trusted friend that she tells no one else. Which story-function term best fits the friend?',
      options: ['Confidant', 'Rival', 'Gatekeeper', 'Tritagonist'], answer: 0,
      explanation: 'A confidant is trusted with private thoughts, fears, plans, or feelings.'
    },
    {
      id: 'b9', type: 'single',
      prompt: 'A suspicious innkeeper appears briefly, distrusts every stranger, and is immediately recognizable as a familiar story type. Which Character pattern term best fits?',
      options: ['Stock', 'Archetypal', 'Round', 'Antagonist'], answer: 0,
      explanation: 'Stock describes a familiar, quickly recognizable character type. Pattern and complexity are separate questions.'
    },
    {
      id: 'b10', type: 'single',
      prompt: 'A novel distributes major goals, choices, and viewpoint time across five characters without one clear primary lead. Which narrative-importance term fits?',
      options: ['Ensemble', 'Protagonist', 'Minor', 'Sidekick'], answer: 0,
      explanation: 'An ensemble distributes narrative importance across a group.'
    },
    {
      id: 'b11', type: 'single',
      prompt: 'A museum director controls whether the protagonist may enter a restricted archive. The protagonist must persuade her before moving forward. Which story function fits?',
      options: ['Gatekeeper', 'Comic relief', 'Foil', 'Love interest'], answer: 0,
      explanation: 'A gatekeeper controls access to a place, resource, stage, or opportunity.'
    },
    {
      id: 'b12', type: 'single',
      prompt: 'A character appears in several important scenes and affects the protagonist’s decisions, but the story never gives that character primary narrative weight. Which narrative-importance term best fits?',
      options: ['Supporting character', 'Protagonist', 'Ensemble', 'Hero'], answer: 0,
      explanation: 'A supporting character matters to the story without carrying primary narrative importance.'
    },
    {
      id: 'b13', type: 'single',
      prompt: 'A character risks their own safety to protect strangers, and the story presents the act as admirable and courageous. Which moral/heroic framing term best fits?',
      options: ['Hero', 'Protagonist', 'Deuteragonist', 'Mentor'], answer: 0,
      explanation: 'Hero is a moral/heroic framing term. It does not tell us the character’s narrative importance.'
    },
    {
      id: 'b14', type: 'single',
      prompt: 'A character is built around one or two clear traits and a limited role rather than extensive complexity. Which Complexity term best fits?',
      options: ['Flat', 'Round', 'Stock', 'Rival'], answer: 0,
      explanation: 'Flat is a Complexity term for a character presented with a limited set of clear traits or functions.'
    },
    {
      id: 'b15', type: 'single',
      prompt: 'A courier arrives with news that forces the protagonist to abandon the original plan immediately. Which story-function term best fits the courier?',
      options: ['Herald / messenger', 'Confidant', 'Foil', 'Minor character'], answer: 0,
      explanation: 'A herald or messenger brings information, a warning, an invitation, or a demand that changes what others must deal with.'
    }
  ],
  hard: [
    {
      id: 'h1', type: 'single',
      prompt: 'Rina is the second-most important character. She trains the protagonist, is developed with several conflicting loyalties, fears, and strengths, and the story frames her as heroic despite the morally questionable methods she sometimes uses. Which narrative-importance term describes her?',
      options: ['Deuteragonist', 'Mentor', 'Round', 'Antihero'], answer: 0,
      explanation: 'Deuteragonist describes Rina’s narrative importance. Mentor describes her story function, round describes her character complexity, and antihero describes her moral/heroic framing.'
    },
    {
      id: 'h2', type: 'multi',
      prompt: 'Select every statement that can be true at the same time for one character.',
      options: [
        'A character can be a deuteragonist and a mentor.',
        'A character can be a protagonist and an antihero.',
        'A character can be round and also function as a foil.',
        'A character can only fit one descriptive system or dimension.'
      ], answer: [0,1,2],
      explanation: 'These descriptive systems and dimensions can overlap. One character can simultaneously have narrative importance, a story function, one or more Character classifications terms, and a moral/heroic framing.'
    },
    {
      id: 'h3', type: 'order',
      prompt: 'Put these narrative-importance terms in order from primary to third-most important.',
      items: ['Tritagonist', 'Protagonist', 'Deuteragonist'], answer: ['Protagonist', 'Deuteragonist', 'Tritagonist'],
      explanation: 'Protagonist is primary, deuteragonist is second-most important, and tritagonist is third-most important.'
    },
    {
      id: 'h4', type: 'single',
      prompt: 'A character blocks the protagonist from carrying out a dangerous plan because doing so would protect a community. Which statement is best supported?',
      options: [
        'The character can be an antagonist without automatically being a villain.',
        'The character must be a villain because they oppose the protagonist.',
        'The character cannot be an antagonist unless they are the main character.',
        'Antagonist is a complexity term like round or flat.'
      ], answer: 0,
      explanation: 'Antagonist describes opposition. Whether the character is villainous belongs to moral/heroic framing.'
    },
    {
      id: 'h5', type: 'single',
      prompt: 'Mara is the protagonist’s older sister. Mara tells her private fears to June, who listens, keeps those fears secret, and gives Mara a place to admit doubts she hides from everyone else. June later betrays Mara. Which story-function term best describes June during those private conversations?',
      options: ['Confidant', 'Antagonist', 'Deuteragonist', 'Round'], answer: 0,
      explanation: 'Confidant describes the role June performs in those conversations: receiving private thoughts and feelings. A character can perform that function even if the relationship later changes.'
    },
    {
      id: 'h6', type: 'single',
      prompt: 'A judge is the third-most important character. The story gives her competing loyalties, private fears, public confidence, and different behaviour with family than in court. Which complexity term is supported?',
      options: ['Round', 'Tritagonist', 'Antagonist', 'Hero'], answer: 0,
      explanation: 'Round describes the judge’s complexity. Tritagonist describes narrative importance, antagonist describes opposition, and hero describes moral framing.'
    },
    {
      id: 'h7', type: 'multi',
      prompt: 'A story follows Leena most closely. Her adviser has an important supporting role without sharing primary narrative weight, teaches Leena difficult skills, is developed with competing loyalties and vulnerabilities, and is framed as heroic despite sometimes using ruthless methods. Which terms could all apply to the adviser without contradiction?',
      options: ['Supporting character', 'Mentor', 'Round', 'Antihero'], answer: [0,1,2,3],
      explanation: 'Each term is supported by a separate clue: supporting character describes narrative importance, mentor describes story function, round describes character complexity, and antihero describes moral/heroic framing.'
    },
    {
      id: 'h8', type: 'single',
      prompt: 'A character appears briefly in one chapter, delivers information that changes the protagonist’s plan, holds authority over the protagonist as the local police chief, and is portrayed as heroic. Which narrative-importance term answers the question “How much narrative weight does this character carry?”',
      options: ['Minor character', 'Authority figure', 'Herald / messenger', 'Hero'], answer: 0,
      explanation: 'Minor character describes the character’s narrative importance. Authority figure and herald/messenger describe story functions, while hero describes moral/heroic framing.'
    },
    {
      id: 'h9', type: 'single',
      prompt: 'A familiar “gruff innkeeper who distrusts strangers” appears briefly and is understood almost immediately. Which Pattern term best fits that use?',
      options: ['Stock', 'Round', 'Deuteragonist', 'Anti-villain'], answer: 0,
      explanation: 'Stock characters rely on familiar, quickly recognizable types.'
    },
    {
      id: 'h10', type: 'single',
      prompt: 'A central character exposes corruption but blackmails witnesses and steals evidence to do it. Which moral/heroic framing term is supported by the description?',
      options: ['Antihero', 'Protagonist', 'Deuteragonist', 'Supporting character'], answer: 0,
      explanation: 'Antihero describes moral/heroic framing. Protagonist, deuteragonist, and supporting character describe narrative importance.'
    }
  ],
  gate: [
    {
      id: 'g1', type: 'single',
      prompt: 'Gate: Kai is the second-most important character in the story. The protagonist trusts him with fears and secrets she shares with no one else. Kai is also written with several conflicting loyalties and is ultimately portrayed as heroic. Which story-function term describes Kai?',
      options: ['Deuteragonist', 'Confidant', 'Round', 'Hero'], answer: 1,
      explanation: 'Confidant describes Kai’s story function because the protagonist trusts him with private fears and secrets. Deuteragonist describes his narrative importance, round describes his complexity, and hero describes his moral/heroic framing.'
    },
    {
      id: 'g2', type: 'single',
      prompt: 'Gate: Nessa carries most of the story. She frequently lies and intimidates people, yet the narrative still centers on her goals and choices. Which narrative-importance term describes her?',
      options: ['Protagonist', 'Antihero', 'Villain', 'Round'], answer: 0,
      explanation: 'Protagonist describes Nessa’s narrative importance. Her questionable behaviour may affect moral framing, but it does not change which term answers the narrative-importance question.'
    },
    {
      id: 'g3', type: 'single',
      prompt: 'Gate: A briefly used character is immediately recognizable as the boastful travelling salesman: fast-talking, exaggerated, and built from a familiar type. Which Character pattern term best fits?',
      options: ['Stock', 'Round', 'Mentor', 'Hero'], answer: 0,
      explanation: 'Stock describes a familiar, quickly recognizable pattern. It does not tell us whether the character is morally good or how much narrative weight the character carries.'
    },
    {
      id: 'g4', type: 'single',
      prompt: 'Gate: The expedition leader is the third-most important character. She repeatedly controls who is allowed into dangerous areas, is developed with several competing values, and is portrayed as admirable. Which story-function term describes her role?',
      options: ['Gatekeeper', 'Tritagonist', 'Round', 'Hero'], answer: 0,
      explanation: 'Gatekeeper describes what she does in the story: controlling access. Tritagonist is narrative importance, round describes complexity, and hero is framing.'
    },
    {
      id: 'g5', type: 'multi',
      prompt: 'Gate: Which statements correctly keep these character descriptions distinct?',
      options: [
        'Narrative importance asks how much story weight a character carries.',
        'Story function asks what a character does in the story.',
        'Round and flat describe moral goodness.',
        'Hero and villain tell you whether a character is primary or minor.'
      ], answer: [0,1],
      explanation: 'Narrative importance and story function answer different questions. Round/flat describe complexity; hero/villain belong to moral/heroic framing.'
    },
    {
      id: 'g6', type: 'multi',
      prompt: 'Gate: A character is the second-most important person in the story, teaches and advises the protagonist, is developed with multiple conflicting motives, and is framed as heroic despite using morally questionable methods. Which terms could describe that one character?',
      options: ['Deuteragonist', 'Mentor', 'Round', 'Antihero'], answer: [0,1,2,3],
      explanation: 'All four are directly supported: deuteragonist describes narrative importance, mentor describes story function, round describes character complexity, and antihero describes moral/heroic framing.'
    }
  ]
};

const quizPools = {
  narrative: [
    {
      id: 'qn1', type: 'single',
      prompt: 'Which narrative-importance term identifies the primary character whose goals, choices, and struggles carry the narrative?',
      options: ['Protagonist', 'Supporting character', 'Mentor', 'Villain'], answer: 0,
      explanation: 'Protagonist is the primary narrative-importance term.'
    },
    {
      id: 'qn2', type: 'single',
      prompt: 'A character receives the second-greatest narrative weight after the protagonist. Which narrative-importance term best fits?',
      options: ['Deuteragonist', 'Tritagonist', 'Foil', 'Mentor'], answer: 0,
      explanation: 'Deuteragonist describes the second-most important character in the narrative.'
    },
    {
      id: 'qn3', type: 'single',
      prompt: 'A story divides its major goals, conflicts, and viewpoint time across four equally important characters. Which narrative-importance term best fits the group?',
      options: ['Ensemble', 'Supporting characters', 'Tritagonist', 'Minor characters'], answer: 0,
      explanation: 'An ensemble distributes narrative importance across a group rather than centering it entirely on one primary character.'
    },
    {
      id: 'qn4', type: 'single',
      prompt: 'A character appears in only two scenes and performs a small but useful role. Which narrative-importance term is most likely?',
      options: ['Minor character', 'Protagonist', 'Deuteragonist', 'Hero'], answer: 0,
      explanation: 'Minor character describes a smaller narrative role.'
    }
  ],
  function: [
    {
      id: 'qf1', type: 'single',
      prompt: 'A character’s contrast with the protagonist makes the protagonist’s impatience much easier to notice. Which story function is being used?',
      options: ['Foil', 'Mentor', 'Confidant', 'Catalyst'], answer: 0,
      explanation: 'A foil highlights another character through contrast.'
    },
    {
      id: 'qf2', type: 'single',
      prompt: 'The protagonist reveals fears to one person that she hides from everyone else. Which function best describes that trusted listener?',
      options: ['Confidant', 'Rival', 'Gatekeeper', 'Henchman'], answer: 0,
      explanation: 'A confidant is trusted with private thoughts, fears, plans, or feelings.'
    },
    {
      id: 'qf3', type: 'single',
      prompt: 'A character teaches the protagonist skills and prepares them for a difficult task. Which story-function term fits?',
      options: ['Mentor', 'Deuteragonist', 'Flat', 'Antihero'], answer: 0,
      explanation: 'Mentor describes a guiding or teaching function.'
    },
    {
      id: 'qf4', type: 'single',
      prompt: 'A character controls access to the records the protagonist needs and must be persuaded before progress can continue. Which function fits?',
      options: ['Gatekeeper', 'Comic relief', 'Love interest', 'Minor character'], answer: 0,
      explanation: 'A gatekeeper controls access to a place, resource, group, stage, or opportunity.'
    }
  ],
  dimensions: [
    {
      id: 'qc1', type: 'single',
      prompt: 'A character is developed around a narrow role and only the few traits needed to perform it. Which complexity term best fits?',
      options: ['Flat', 'Round', 'Protagonist', 'Hero'], answer: 0,
      explanation: 'Flat describes deliberately limited complexity. It is not automatically bad writing.'
    },
    {
      id: 'qc2', type: 'single',
      prompt: 'A reluctant heir is forced from safety, tested by loss, and pushed toward leadership in a pattern that recurs across many stories. Which Character pattern term best fits?',
      options: ['Archetypal', 'Stock', 'Round', 'Antagonist'], answer: 0,
      explanation: 'Archetypal describes a broad recurring storytelling pattern. It does not by itself determine complexity or moral framing.'
    },
    {
      id: 'qc3', type: 'single',
      prompt: 'A character has conflicting motives, several distinct traits, and different sides that appear in different relationships. Which Complexity term best fits?',
      options: ['Round', 'Flat', 'Minor', 'Hero'], answer: 0,
      explanation: 'Round is a Complexity term for a character presented with multiple traits, tensions, motives, or sides.'
    },
    {
      id: 'qc4', type: 'single',
      prompt: 'A briefly used character is built from a familiar, instantly recognizable type with little extra complexity. Which Pattern term best fits?',
      options: ['Stock', 'Round', 'Deuteragonist', 'Foil'], answer: 0,
      explanation: 'Stock is a Pattern term for a familiar, quickly recognizable character type.'
    }
  ],
  separation: [
    {
      id: 'qs1', type: 'single',
      prompt: 'Which statement correctly separates narrative importance from moral framing?',
      options: [
        'A protagonist can be heroic, villainous, or morally mixed.',
        'Every protagonist is a hero.',
        'Every antagonist is a villain.',
        'Hero is another word for protagonist.'
      ], answer: 0,
      explanation: 'Narrative importance and moral/heroic framing are separate classification systems.'
    },
    {
      id: 'qs2', type: 'single',
      prompt: 'Which statement correctly separates story function from character complexity?',
      options: [
        'Mentor describes story function, while round describes complexity.',
        'Mentor and round are both narrative-importance terms.',
        'Round describes moral goodness.',
        'Story function tells you whether a character is primary or minor.'
      ], answer: 0,
      explanation: 'Mentor tells us what a character does; round tells us about meaningful depth and dimensionality.'
    },
    {
      id: 'qs3', type: 'single',
      prompt: 'A character blocks the protagonist’s goal for understandable reasons. What can you conclude with confidence?',
      options: [
        'The character may be an antagonist without being a villain.',
        'The character must be evil.',
        'The character must be the deuteragonist.',
        'The character must be round.'
      ], answer: 0,
      explanation: 'Opposition and moral framing are separate. Antagonist does not automatically mean villain.'
    },
    {
      id: 'qs4', type: 'single',
      prompt: 'Which question is a narrative-importance question?',
      options: [
        'How much story weight does this character carry?',
        'What does this character do for another character?',
        'How much character complexity is developed?',
        'Is this character framed as heroic or villainous?'
      ], answer: 0,
      explanation: 'Narrative importance asks how central a character is to the narrative.'
    }
  ],
  overlap: [
    {
      id: 'qo1', type: 'multi',
      prompt: 'A character is second-most important, teaches the protagonist, is developed with multiple conflicting motives, and is framed as heroic despite using morally questionable methods. Which terms could all apply?',
      options: ['Deuteragonist', 'Mentor', 'Round', 'Antihero'], answer: [0,1,2,3],
      explanation: 'All four are supported by separate evidence and can overlap because they describe different aspects of the same character.'
    },
    {
      id: 'qo2', type: 'multi',
      prompt: 'Select every statement that can be true without contradiction.',
      options: [
        'A protagonist can also be a villain.',
        'A minor character can function as a herald.',
        'A mentor can be round.',
        'An antagonist must be a villain.'
      ], answer: [0,1,2],
      explanation: 'Narrative importance, story function, Character classifications, and moral/heroic framing can overlap. Antagonist does not require villain framing.'
    },
    {
      id: 'qo3', type: 'single',
      prompt: 'Mina is the primary character, mentors her younger brother, is developed with several conflicting motives, values, and fears, and is framed as morally admirable. Which term answers only the question of narrative importance?',
      options: ['Protagonist', 'Mentor', 'Round', 'Hero'], answer: 0,
      explanation: 'Protagonist describes narrative importance. Mentor describes story function, round describes complexity, and hero describes moral/heroic framing.'
    },
    {
      id: 'qo4', type: 'multi',
      prompt: 'A character appears briefly, delivers information that changes the protagonist’s plan, and is portrayed as heroic. Which terms could apply at the same time?',
      options: ['Minor character', 'Herald / messenger', 'Hero', 'Deuteragonist'], answer: [0,1,2],
      explanation: 'Minor describes narrative importance, herald/messenger describes function, and hero describes framing. Deuteragonist would require second-most narrative importance.'
    }
  ]
};

const realWorldProof = [
  {
    title: 'Alice — protagonist',
    work: 'Alice’s Adventures in Wonderland · Lewis Carroll',
    body: 'Evidence: the narrative follows Alice’s experiences, questions, decisions, and movement through Wonderland. How and why it fits: she carries the primary narrative weight, so protagonist is the relevant narrative-importance term. Writer takeaway: justify narrative importance by what the story actually follows.',
    url: 'https://www.gutenberg.org/ebooks/11',
    source: 'Project Gutenberg #11'
  },
  {
    title: 'Long John Silver — round character',
    work: 'Treasure Island · Robert Louis Stevenson',
    body: 'Evidence: Silver is charismatic and helpful in some interactions, calculating and dangerous in others, and his loyalties and behaviour cannot be reduced to one simple trait. How and why it fits: those multiple meaningful facets support round character complexity. Writer takeaway: complexity comes from consequential dimensions and tensions, not from a checklist of traits.',
    url: 'https://www.gutenberg.org/ebooks/120',
    source: 'Project Gutenberg #120'
  },
  {
    title: 'Passepartout — sidekick function',
    work: 'Around the World in Eighty Days · Jules Verne',
    body: 'Evidence: Passepartout travels with Phileas Fogg, assists him repeatedly, solves practical problems, and participates in the journey while Fogg remains the principal figure. How and why it fits: that recurring close-companion assistance supports the sidekick story function. Writer takeaway: a function label is justified by what the character does.',
    url: 'https://www.gutenberg.org/ebooks/103',
    source: 'Project Gutenberg #103'
  },
  {
    title: 'The Wicked Witch of the West — villain framing',
    work: 'The Wonderful Wizard of Oz · L. Frank Baum',
    body: 'Evidence: the Witch threatens Dorothy and her companions and repeatedly attempts to control or harm them. How and why it fits: the story frames those actions as harmful and threatening, supporting villain framing. Writer takeaway: moral framing is separate from narrative importance or story function.',
    url: 'https://www.gutenberg.org/ebooks/55',
    source: 'Project Gutenberg #55'
  }
];

window.StoryConstructionGame.start({
  appVersion: APP_VERSION,
  storageKey: STORAGE_KEY,
  variationHistoryKey: VARIATION_HISTORY_KEY,
  levelNumber: 1,
  levelName: 'Character',
  conceptIndex: 0,
  concepts,
  conceptGlossary,
  glossaryExampleVariants,
  lessonScreens,
  practicePools,
  quizPools,
  realWorldProof,
  quizLength: QUIZ_LENGTH,
  quizPass: QUIZ_PASS,
  maxHearts: MAX_HEARTS,
  streakTarget: STREAK_TARGET,
  recentAnswerWindow: RECENT_ANSWER_WINDOW,
  nextLevel: {
    name: 'Goal',
    navigate: 'goal',
    buttonText: 'Start Level 2 · Goal'
  },
  copy: {
    welcomeTitle: 'Learn what a character is — and what the different character terms actually describe.',
    welcomeBody: `
      <p class="lede">This level teaches <strong>Character</strong> before it tests you. You’ll learn four overlapping ways of describing characters, then work through a short difficulty ladder.</p>
      <div class="gate-banner"><strong>Game rules</strong><p>Practice mistakes teach; they do not cost hearts. Only a failed challenge gate costs one. Five correct challenges in a row restore one heart, up to three.</p></div>
      <div class="connection-grid">
        <div><strong>Learn</strong><span>Short guided screens</span></div>
        <div><strong>Practice</strong><span>3 basic + 2 harder</span></div>
        <div><strong>Gate</strong><span>Required checkpoint</span></div>
        <div><strong>Quiz</strong><span>Character only</span></div>
      </div>`,
    resetButtonText: 'Reset progress',
    startButtonText: 'Start level',
    practiceIntroTitle: 'Recognize it. Separate it. Apply it.',
    practiceIntroBody: `
      <p class="lede">The ladder starts with direct recognition, then moves into overlapping classifications. Questions are drawn from larger banks so replays vary, and you will get an explanation after every answer.</p>
      <div class="category-list">
        <div class="category-card"><strong>3 basic challenges</strong><span>Direct recognition with strong support.</span></div>
        <div class="category-card"><strong>2 harder challenges</strong><span>Distinguish overlapping terms by the aspect of character each one describes.</span></div>
        <div class="category-card"><strong>1 challenge gate</strong><span>Required checkpoint. This is the only practice mistake that costs a heart.</span></div>
      </div>`,
    gateSuccessTitle: 'You separated the different character descriptions instead of memorizing terms.',
    gateSuccessBody: '<div class="gate-success"><div class="gate-burst" aria-hidden="true">✦</div><p class="lede">The Character quiz is now unlocked. It tests only Character material you have already learned.</p></div>',
    quizIntroBody: `
      <p class="lede">Each attempt draws five questions from a larger Character quiz bank and requires four correct answers to pass. The exact length and pass standard remain prototype choices because the curriculum leaves them open.</p>
      <div class="gate-banner"><strong>Retry rule</strong><p>If the first attempt does not pass, you may retry once immediately. A second unsuccessful attempt returns you to the lesson.</p></div>`,
    proofTitle: 'Character is visible in published stories.',
    proofLead: 'These examples reinforce narrative importance using public-domain works. They are evidence screens, not scored questions.',
    completeBody: '<div class="level-complete"><div class="seal" aria-hidden="true">✦</div><span class="mini-label">Story Construction · Character</span><h1>Level complete.</h1><p>You can recognize Character terms, keep the descriptive systems and dimensions distinct, and see how several terms can describe one character at the same time.</p><div class="callout"><strong>Next concept: Goal</strong><p>Level 2 is now available. It builds on Character by asking what result a character is trying to achieve.</p></div></div>',
    gameOverBody: '<p class="lede">Only challenge-gate misses can remove hearts. The curriculum has not yet fixed exactly where a learner should restart after game over, so this prototype returns you to the Character lesson with three hearts.</p>'
  }
});
