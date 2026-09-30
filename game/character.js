'use strict';

const APP_VERSION = '2.0.0-character';
const STORAGE_KEY = 'writecraft-level1-state-v1';
const VARIATION_HISTORY_KEY = 'writecraft-level1-variation-history-v1';
const QUIZ_LENGTH = 5;
const QUIZ_PASS = 4;
const MAX_HEARTS = 3;
const STREAK_TARGET = 5;

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
  'narrative.deuteragonist': {
    category: 'Narrative importance', label: 'Deuteragonist',
    definition: 'The second-most important character in the narrative.',
    example: 'Ivo travels with Mara, has important choices and conflicts of his own, and affects the main story repeatedly, but the narrative still gives Mara greater weight. Ivo is the deuteragonist.'
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
    category: 'Character Dimensions · Complexity', label: 'Round',
    definition: 'A Complexity term for a character presented with multiple traits, tensions, motives, or sides that create a sense of depth.',
    example: 'Nora is generous with strangers, resentful toward her sister, brave during emergencies, and deeply afraid of being abandoned. Those different sides make her feel more complex than a single defining trait.'
  },
  'dimensions.flat': {
    category: 'Character Dimensions · Complexity', label: 'Flat',
    definition: 'A Complexity term for a character presented around a limited set of clear traits or functions rather than extensive depth.',
    example: 'The cheerful ferry operator appears several times, always practical and upbeat, and exists mainly to get the team across the river and deliver local information. The character can work effectively without being deeply layered.'
  },
  'dimensions.dynamic': {
    category: 'Character Dimensions · Change', label: 'Dynamic',
    definition: 'A Change term for a character who changes in a meaningful way over the course of the story.',
    example: 'At first Lena avoids every difficult decision. After repeated consequences, she begins choosing openly and accepting responsibility. That meaningful change makes her dynamic.'
  },
  'dimensions.static': {
    category: 'Character Dimensions · Change', label: 'Static',
    definition: 'A Change term for a character who remains fundamentally unchanged in the relevant part of the story.',
    example: 'Mr. Chen begins the story patient, principled, and unwilling to lie for convenience. Pressure tests those qualities, but he still holds the same core position at the end, making him static in that respect.'
  },
  'dimensions.stock': {
    category: 'Character Dimensions · Pattern', label: 'Stock',
    definition: 'A Pattern term for a character built from a familiar, quickly recognizable type that lets the audience understand the role with little explanation.',
    example: 'A suspicious old innkeeper warns travellers not to enter the forest and distrusts every stranger. The story uses a familiar type so the audience can understand him almost immediately.'
  },
  'dimensions.archetypal': {
    category: 'Character Dimensions · Pattern', label: 'Archetypal',
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
    `A pilot gives up the last escape seat so an injured passenger can leave th