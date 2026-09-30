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
    example: 'A suspicious old innkeeper 