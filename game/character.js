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
  'dimensions.dynamic': [
    `At first, Arun refuses to trust anyone. After depending on others and seeing the cost of isolation, he begins asking for help and sharing responsibility. That meaningful change makes him dynamic.`,
    `Keira begins by avoiding conflict but ends willing to confront her family openly. The change in how she acts and understands herself makes her dynamic.`
  ],
  'dimensions.static': [
    `Pressure repeatedly tempts Sal to betray his principles, but he begins and ends the story committed to the same core code. In that respect, he is static.`,
    `A grandmother remains patient, practical, and deeply skeptical of the town's rumours from beginning to end. Events reveal those traits but do not fundamentally change them.`
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
    'narrative.protagonist', 'narrative.deuteragonist', 'narrative.tritagonist',
    'narrative.supporting', 'narrative.minor', 'narrative.ensemble', 'narrative.antagonist'
  ],
  function: [
    'function.ally', 'function.sidekick', 'function.confidant', 'function.mentor',
    'function.foil', 'function.rival', 'function.love-interest', 'function.comic-relief',
    'function.herald', 'function.gatekeeper', 'function.catalyst', 'function.sacrificial',
    'function.false-antagonist', 'function.henchman', 'function.minion',
    'function.authority', 'function.innocent'
  ],
  dimensions: [
    'dimensions.round', 'dimensions.flat', 'dimensions.dynamic',
    'dimensions.static', 'dimensions.stock', 'dimensions.archetypal'
  ],
  complexity: ['dimensions.round', 'dimensions.flat'],
  change: ['dimensions.dynamic', 'dimensions.static'],
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
  {
    stage: 'Stage 1 · What is it?',
    title: 'A story moves through people who matter.',
    html: `
      <div class="hero-word" aria-hidden="true">character</div>
      <p class="lede">A <strong>character</strong> is who the story is about or who participates meaningfully in the narrative.</p>
      <div class="callout"><strong>Key idea:</strong><p>Character is more than a category name. A character becomes meaningful through choices, struggle, relationships, consequences, and story movement.</p></div>`
  },
  {
    stage: 'Stage 2 · Forms',
    title: 'One character can be described in several ways.',
    html: `
      <p class="lede">Characters can be described through several systems and dimensions. The same person can fit several terms at once. <strong>Select any term</strong> for its description and an illustrative example.</p>
      <div class="category-list">
        <div class="category-card"><strong>Narrative importance</strong><span>How central the character is to the narrative.</span><div class="inline-terms">${glossaryList('narrative')}</div></div>
        <div class="category-card"><strong>Story function</strong><span>What the character does in the story.</span><div class="inline-terms">${glossaryList('function')}</div></div>
        <div class="category-card"><strong>Character Dimensions</strong><span>Different ways a character is shaped.</span><div class="inline-terms"><b>Complexity:</b> ${glossaryList('complexity')}<br><b>Change:</b> ${glossaryList('change')}<br><b>Pattern:</b> ${glossaryList('pattern')}</div></div>
        <div class="category-card"><strong>Moral / heroic framing</strong><span>How the character is morally or heroically framed.</span><div class="inline-terms">${glossaryList('moral')}</div></div>
      </div>`
  },
  {
    stage: 'Stage 2 · Narrative importance',
    title: 'Who carries the narrative weight?',
    html: `
      <p class="lede">Narrative importance describes <strong>how much narrative weight a character carries</strong>. Select a term to open its description and example.</p>
      ${glossaryGrid('narrative')}
      <p class="lede">Co-protagonists or co-deuteragonists can share a level of narrative importance. An ensemble distributes importance across a group.</p>`
  },
  {
    stage: 'Stage 2 · Story function',
    title: 'What job does the character perform in the story?',
    html: `
      <p class="lede">A story-function term describes <strong>what a character does in the story</strong>. It does not describe the character's <strong>narrative importance</strong> or whether they are morally good or bad. Select any term for an example.</p>
      ${glossaryGrid('function')}`
  },
  {
    stage: 'Stage 2 · Character Dimensions',
    title: 'Character Dimensions look at complexity, change, and pattern.',
    html: `
      <p class="lede"><strong>Character Dimensions</strong> is harder to categorize neatly than narrative importance, story function, or moral/heroic framing. It is a looser umbrella that brings together three different descriptive dimensions, and those dimensions can overlap.</p>
      <div class="category-list">
        <div class="category-card"><strong>Complexity</strong><span>How multidimensional or simply drawn the character is.</span><div class="inline-terms">${glossaryList('complexity')}</div></div>
        <div class="category-card"><strong>Change</strong><span>Whether the character changes meaningfully.</span><div class="inline-terms">${glossaryList('change')}</div></div>
        <div class="category-card"><strong>Pattern</strong><span>Whether the character draws on a recognizable type or broader recurring pattern.</span><div class="inline-terms">${glossaryList('pattern')}</div></div>
      </div>
      <p class="lede">These are not one set of mutually exclusive choices. A character can be round, static, and archetypal at the same time.</p>`
  },
  {
    stage: 'Stage 2 · Moral / heroic framing',
    title: 'How does the story frame the character morally or heroically?',
    html: `
      <p class="lede">Moral and heroic framing is separate from narrative importance. A protagonist is not automatically a hero, and an antagonist is not automatically a villain.</p>
      ${glossaryGrid('moral')}`
  },
  {
    stage: 'Stage 3 · What is it not?',
    title: 'Do not collapse the categories.',
    html: `
      <div class="callout"><strong>Protagonist ≠ hero</strong><p>The protagonist is defined by narrative importance, not moral goodness.</p></div>
      <div class="callout"><strong>Antagonist ≠ villain</strong><p>The antagonist is defined by opposition to the protagonist or central goal, not automatic moral evil.</p></div>
      <div class="callout"><strong>Function ≠ Character Dimensions</strong><p>A mentor describes story function. Dynamic describes the <strong>Change</strong> dimension. Antihero describes moral or heroic framing. These terms can overlap because they describe different aspects of the same character.</p></div>`
  },
  {
    stage: 'Stages 4–6 · How it works',
    title: 'Character is an active story force.',
    html: `
      <p class="lede">A character matters through what they want, do, choose, resist, and change. Relationships can alter choices, create struggle, and move the story.</p>
      <div class="connection-grid">
        <button class="connection-term" type="button" data-term="force.choice" aria-haspopup="dialog"><strong>Choice</strong><span>What the character decides.</span><em>Definition + example</em></button>
        <button class="connection-term" type="button" data-term="force.struggle" aria-haspopup="dialog"><strong>Struggle</strong><span>What pushes against them.</span><em>Definition + example</em></button>
        <button class="connection-term" type="button" data-term="force.relationship" aria-haspopup="dialog"><strong>Relationship</strong><span>Who changes the pressure around them.</span><em>Definition + example</em></button>
        <button class="connection-term" type="button" data-term="force.consequence" aria-haspopup="dialog"><strong>Consequence</strong><span>What follows from action.</span><em>Definition + example</em></button>
      </div>
      <p class="lede">Character connects next to <strong>Goal → Motivation → Stakes → Conflict</strong>. Character change over time is introduced here, but the later Character Arc concept will treat it in depth.</p>`
  }
];

const practicePools = {
  basic: [
    {
      id: 'b1', type: 'single',
      prompt: 'Which narrative-importance term means the primary character whose goals, choices, and struggles carry the story?',
      options: ['Protagonist', 'Mentor', 'Dynamic character', 'Villain'], answer: 0,
      explanation: 'Protagonist is the narrative-importance term for the primary character carrying the story.'
    },
    {
      id: 'b2', type: 'single',
      prompt: 'A veteran sailor teaches the inexperienced lead how to navigate dangerous waters and prepares her for the final crossing. Which story-function term describes that role?',
      options: ['Mentor', 'Tritagonist', 'Antihero', 'Static character'], answer: 0,
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
      prompt: 'A character begins afraid to speak up but gradually learns to confront people openly. Which Change term fits?',
      options: ['Dynamic', 'Static', 'Minor', 'Hero'], answer: 0,
      explanation: 'Dynamic is a Change term for a character who changes in a meaningful way over the story.'
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
      prompt: 'A character faces pressure throughout the story but keeps the same core beliefs and behaviour. Which Change term fits?',
      options: ['Static', 'Dynamic', 'Round', 'Antagonist'], answer: 0,
      explanation: 'Static is a Change term for a character who remains fundamentally unchanged in the relevant part of the story.'
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
      options: ['Flat', 'Round', 'Dynamic', 'Rival'], answer: 0,
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
      prompt: 'Rina is the second-most important character. She trains the protagonist, changes from distrusting everyone to relying on a team, and the story frames her as heroic despite the morally questionable methods she sometimes uses. Which narrative-importance term describes her?',
      options: ['Deuteragonist', 'Mentor', 'Dynamic', 'Antihero'], answer: 0,
      explanation: 'Deuteragonist describes Rina’s narrative importance. Mentor describes her story function, dynamic describes the Change dimension, and antihero describes her moral/heroic framing.'
    },
    {
      id: 'h2', type: 'multi',
      prompt: 'Select every statement that can be true at the same time for one character.',
      options: [
        'A character can be a deuteragonist and a mentor.',
        'A character can be a protagonist and an antihero.',
        'A character can be dynamic and also function as a foil.',
        'A character can only fit one descriptive system or dimension.'
      ], answer: [0,1,2],
      explanation: 'These descriptive systems and dimensions can overlap. One character can simultaneously have narrative importance, a story function, one or more Character Dimensions terms, and a moral/heroic framing.'
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
        'Antagonist is a Change term like dynamic or static.'
      ], answer: 0,
      explanation: 'Antagonist describes opposition. Whether the character is villainous belongs to moral/heroic framing.'
    },
    {
      id: 'h5', type: 'single',
      prompt: 'Mara is the protagonist’s older sister. Mara tells her private fears to June, who listens, keeps those fears secret, and gives Mara a place to admit doubts she hides from everyone else. June later betrays Mara. Which story-function term best describes June during those private conversations?',
      options: ['Confidant', 'Antagonist', 'Deuteragonist', 'Dynamic'], answer: 0,
      explanation: 'Confidant describes the role June performs in those conversations: receiving private thoughts and feelings. A character can perform that function even if the relationship later changes.'
    },
    {
      id: 'h6', type: 'single',
      prompt: 'A respected judge is the third-most important character in the story. She opposes several of the protagonist’s choices, but from beginning to end her beliefs, outlook, and usual way of responding remain fundamentally unchanged. Which Change term best describes the judge?',
      options: ['Static', 'Tritagonist', 'Antagonist', 'Hero'], answer: 0,
      explanation: 'Static describes the judge’s Change dimension because the description establishes that she undergoes no significant internal change. Tritagonist describes narrative importance, antagonist describes opposition in the story, and hero describes moral/heroic framing.'
    },
    {
      id: 'h7', type: 'multi',
      prompt: 'A story follows Leena most closely. Her adviser has an important supporting role without sharing primary narrative weight, teaches Leena difficult skills, changes from cynical to hopeful, and is framed as heroic despite sometimes using ruthless methods. Which terms could all apply to the adviser without contradiction?',
      options: ['Supporting character', 'Mentor', 'Dynamic', 'Antihero'], answer: [0,1,2,3],
      explanation: 'Each term is supported by a separate clue: supporting character describes narrative importance, mentor describes story function, dynamic describes the Change dimension, and antihero describes moral/heroic framing.'
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
      options: ['Stock', 'Dynamic', 'Deuteragonist', 'Anti-villain'], answer: 0,
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
      prompt: 'Gate: Kai is the second-most important character in the story. The protagonist trusts him with fears and secrets she shares with no one else. Over the course of the story, Kai changes from fearful to decisive and is ultimately portrayed as heroic. Which story-function term describes Kai?',
      options: ['Deuteragonist', 'Confidant', 'Dynamic', 'Hero'], answer: 1,
      explanation: 'Confidant describes Kai’s story function because the protagonist trusts him with private fears and secrets. Deuteragonist describes his narrative importance, dynamic describes how he changes, and hero describes his moral/heroic framing.'
    },
    {
      id: 'g2', type: 'single',
      prompt: 'Gate: Nessa carries most of the story. She frequently lies and intimidates people, yet the narrative still centers on her goals and choices. Which narrative-importance term describes her?',
      options: ['Protagonist', 'Antihero', 'Villain', 'Dynamic'], answer: 0,
      explanation: 'Protagonist describes Nessa’s narrative importance. Her questionable behaviour may affect moral framing, but it does not change which term answers the narrative-importance question.'
    },
    {
      id: 'g3', type: 'single',
      prompt: 'Gate: Tomas begins convinced that asking for help is weakness. Repeated failures force him to depend on others, and by the end he openly asks his team for support. Which Change term describes him?',
      options: ['Dynamic', 'Mentor', 'Supporting character', 'Hero'], answer: 0,
      explanation: 'Dynamic is a Change term for meaningful character change over time. The other choices describe different aspects of the character.'
    },
    {
      id: 'g4', type: 'single',
      prompt: 'Gate: The expedition leader is the third-most important character. She repeatedly controls who is allowed into dangerous areas, remains unchanged, and is portrayed as admirable. Which story-function term describes her role?',
      options: ['Gatekeeper', 'Tritagonist', 'Static', 'Hero'], answer: 0,
      explanation: 'Gatekeeper describes what she does in the story: controlling access. Tritagonist is narrative importance, static describes the Change dimension, and hero is framing.'
    },
    {
      id: 'g5', type: 'multi',
      prompt: 'Gate: Which statements correctly keep these character descriptions distinct?',
      options: [
        'Narrative importance asks how much story weight a character carries.',
        'Story function asks what a character does in the story.',
        'Dynamic and static describe moral goodness.',
        'Hero and villain tell you whether a character is primary or minor.'
      ], answer: [0,1],
      explanation: 'Narrative importance and story function answer different questions. Dynamic/static belong to the Change dimension; hero/villain belong to moral/heroic framing.'
    },
    {
      id: 'g6', type: 'multi',
      prompt: 'Gate: A character is the second-most important person in the story, teaches and advises the protagonist, changes significantly in outlook, and is framed as heroic despite using morally questionable methods. Which terms could describe that one character?',
      options: ['Deuteragonist', 'Mentor', 'Dynamic', 'Antihero'], answer: [0,1,2,3],
      explanation: 'All four are directly supported: deuteragonist describes narrative importance, mentor describes story function, dynamic describes the Change dimension, and antihero describes moral/heroic framing.'
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
      options: ['Mentor', 'Deuteragonist', 'Static', 'Antihero'], answer: 0,
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
      prompt: 'A character remains fundamentally unchanged despite being tested repeatedly. Which Change term fits?',
      options: ['Static', 'Dynamic', 'Round', 'Protagonist'], answer: 0,
      explanation: 'Static is a Change term for a character who remains fundamentally unchanged.'
    },
    {
      id: 'qc2', type: 'single',
      prompt: 'A character changes from avoiding responsibility to accepting it openly by the end of the story. Which Change term fits?',
      options: ['Dynamic', 'Static', 'Stock', 'Antagonist'], answer: 0,
      explanation: 'Dynamic is a Change term for meaningful character change over time.'
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
      options: ['Stock', 'Dynamic', 'Deuteragonist', 'Foil'], answer: 0,
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
      prompt: 'Which statement is correct?',
      options: [
        'Mentor describes story function, while dynamic describes the Change dimension.',
        'Mentor and dynamic are both narrative-importance terms.',
        'Dynamic describes moral goodness.',
        'Story function tells you whether a character is primary or minor.'
      ], answer: 0,
      explanation: 'Mentor tells us what a character does; dynamic tells us whether the character changes.'
    },
    {
      id: 'qs3', type: 'single',
      prompt: 'A character blocks the protagonist’s goal for understandable reasons. What can you conclude with confidence?',
      options: [
        'The character may be an antagonist without being a villain.',
        'The character must be evil.',
        'The character must be the deuteragonist.',
        'The character must be static.'
      ], answer: 0,
      explanation: 'Opposition and moral framing are separate. Antagonist does not automatically mean villain.'
    },
    {
      id: 'qs4', type: 'single',
      prompt: 'Which question is a narrative-importance question?',
      options: [
        'How much story weight does this character carry?',
        'What does this character do for another character?',
        'Does this character change?',
        'Is this character framed as heroic or villainous?'
      ], answer: 0,
      explanation: 'Narrative importance asks how central a character is to the narrative.'
    }
  ],
  overlap: [
    {
      id: 'qo1', type: 'multi',
      prompt: 'A character is second-most important, teaches the protagonist, changes significantly in outlook, and is framed as heroic despite using morally questionable methods. Which terms could all apply?',
      options: ['Deuteragonist', 'Mentor', 'Dynamic', 'Antihero'], answer: [0,1,2,3],
      explanation: 'All four are supported by separate evidence and can overlap because they describe different aspects of the same character.'
    },
    {
      id: 'qo2', type: 'multi',
      prompt: 'Select every statement that can be true without contradiction.',
      options: [
        'A protagonist can also be a villain.',
        'A minor character can function as a herald.',
        'A mentor can be static.',
        'An antagonist must be a villain.'
      ], answer: [0,1,2],
      explanation: 'Narrative importance, story function, Character Dimensions, and moral/heroic framing can overlap. Antagonist does not require villain framing.'
    },
    {
      id: 'qo3', type: 'single',
      prompt: 'Mina is the primary character, mentors her younger brother, remains fundamentally unchanged in outlook and behaviour, and is framed as morally admirable. Which term answers only the question of narrative importance?',
      options: ['Protagonist', 'Mentor', 'Static', 'Hero'], answer: 0,
      explanation: 'Protagonist describes narrative importance. Mentor describes story function, static describes the Change dimension, and hero describes moral/heroic framing.'
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
    body: 'Alice carries the primary narrative focus: the story follows her experiences, choices, questions, and movement through Wonderland.',
    url: 'https://www.gutenberg.org/ebooks/11',
    source: 'Project Gutenberg #11'
  },
  {
    title: 'Jim Hawkins — protagonist',
    work: 'Treasure Island · Robert Louis Stevenson',
    body: 'Jim is the central character through whose actions and experiences the adventure unfolds, making him a clear example of narrative importance.',
    url: 'https://www.gutenberg.org/ebooks/120',
    source: 'Project Gutenberg #120'
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
    welcome: ['Level 1 · Character', 'Welcome', 0],
    lesson: ['Learn · Character', `Lesson ${state.lessonIndex + 1} of ${lessonScreens.length}`, 8 + (state.lessonIndex / lessonScreens.length) * 32],
    practiceIntro: ['Practice · Character', 'Difficulty ladder', 42],
    practice: ['Practice · Character', state.practicePhase === 'basic' ? 'Basic challenges' : state.practicePhase === 'hard' ? 'Harder challenges' : 'Challenge gate', state.practicePhase === 'basic' ? 48 + state.practiceIndex * 4 : state.practicePhase === 'hard' ? 62 + state.practiceIndex * 5 : 74],
    gateSuccess: ['Checkpoint · Character', 'Gate cleared', 78],
    quizIntro: ['Quiz · Character', 'Completion checkpoint', 80],
    quiz: ['Quiz · Character', `Question ${state.quizIndex + 1} of ${QUIZ_LENGTH}`, 82 + (state.quizIndex / QUIZ_LENGTH) * 10],
    quizResult: ['Quiz · Character', state.quizPassed ? 'Concept completed' : 'Review needed', state.quizPassed ? 94 : 86],
    proof: ['Real-world proof', 'Character in published work', 97],
    complete: ['Level 1 · Character', 'Completed', 100],
    gameOver: ['Level 1 · Character', 'Game over', 74]
  };
  const [eye, label, pct] = map[state.view] || map.welcome;
