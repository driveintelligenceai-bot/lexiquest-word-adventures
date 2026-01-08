// Word Wonderland Story System - Lore, NPCs, and Jumble Monster encounters

export interface StoryRegion {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockLevel: number;
  wilsonSteps: number[];
  storyIntro: string;
  storyComplete: string;
  npc: NPCData;
  jumbleMonsterLevel: number;
  treasures: string[];
  ambiance: string;
}

export interface NPCData {
  id: string;
  name: string;
  emoji: string;
  role: string;
  greeting: string;
  hints: string[];
  encouragements: string[];
  celebrations: string[];
}

export interface JumbleMonsterEncounter {
  level: number;
  name: string;
  emoji: string;
  taunt: string;
  defeat: string;
  scrambledWords: number;
}

// The main villain
export const JUMBLE_MONSTER: JumbleMonsterEncounter[] = [
  {
    level: 1,
    name: 'Mini Jumble',
    emoji: '👾',
    taunt: "Ha ha! I've scrambled all the simple words! You'll never fix them!",
    defeat: "No! You solved my puzzles! I'll be back with harder words!",
    scrambledWords: 3,
  },
  {
    level: 2,
    name: 'Jumble Jr.',
    emoji: '👹',
    taunt: "Think you're clever? Try to unscramble THESE words!",
    defeat: "Impossible! How did you figure those out?!",
    scrambledWords: 4,
  },
  {
    level: 3,
    name: 'Jumble Beast',
    emoji: '🐲',
    taunt: "I am the Jumble Beast! No one has ever defeated me!",
    defeat: "You... you actually did it! The words are free!",
    scrambledWords: 5,
  },
  {
    level: 4,
    name: 'Lord Jumble',
    emoji: '😈',
    taunt: "I am LORD JUMBLE! Ruler of Scrambled Words! Face my ultimate challenge!",
    defeat: "NOOO! You've freed all the words! Word Wonderland is saved!",
    scrambledWords: 6,
  },
];

// Story regions with full lore - 10 regions total
export const STORY_REGIONS: Record<string, StoryRegion> = {
  phoneme_forest: {
    id: 'phoneme_forest',
    name: 'Phoneme Forest',
    description: 'Where letters learn to sing',
    icon: '🌲',
    unlockLevel: 1,
    wilsonSteps: [1],
    storyIntro: "Welcome to Phoneme Forest! The trees here whisper letter sounds, but the Jumble Monster has mixed them all up! Can you help the Forest Creatures sort out the sounds?",
    storyComplete: "You did it! The Forest is singing again! The letters are dancing in the trees!",
    npc: {
      id: 'whisper',
      name: 'Whisper',
      emoji: '🦉',
      role: 'Wise Owl Guide',
      greeting: "Hoo hoo! Welcome, young Word Quester! I'm Whisper the Owl. The Jumble Monster came through here and scrambled all our letters!",
      hints: [
        "Try listening to the first sound in the word!",
        "Tap the letter to hear its sound!",
        "Sound it out slowly, one letter at a time!",
        "This letter makes a special sound. Listen carefully!",
      ],
      encouragements: [
        "You're getting closer! Keep trying!",
        "Don't give up! You've got this!",
        "Almost there! One more try!",
        "I believe in you, Word Quester!",
      ],
      celebrations: [
        "Hoo hoo! Brilliant work!",
        "You're a natural! The forest is so grateful!",
        "Amazing! You've freed another word!",
        "Spectacular! The Jumble Monster won't like this!",
      ],
    },
    jumbleMonsterLevel: 1,
    treasures: ['🍄', '🌸', '🍃', '🐿️', '🦋'],
    ambiance: 'forest',
  },
  blend_meadow: {
    id: 'blend_meadow',
    name: 'Blend Meadow',
    description: 'Where sounds mix into words',
    icon: '🌻',
    unlockLevel: 3,
    wilsonSteps: [1, 2],
    storyIntro: "Welcome to Blend Meadow! Here, sounds blend together like flowers in a garden. Help Daisy the Bunny restore harmony!",
    storyComplete: "The meadow is blooming with blended sounds! Beautiful work!",
    npc: {
      id: 'daisy',
      name: 'Daisy',
      emoji: '🐰',
      role: 'Meadow Bunny',
      greeting: "Hop hop! I'm Daisy! All my favorite blends got scattered by that mean Jumble Monster!",
      hints: [
        "Put the sounds together smoothly!",
        "Start with the first sound, then add more!",
        "Blend them like mixing colors!",
        "Say each sound, then say them faster!",
      ],
      encouragements: [
        "You're hopping along nicely!",
        "Keep blending, you're doing great!",
        "The flowers are cheering for you!",
        "Almost got it!",
      ],
      celebrations: [
        "Hippity hoppity! You did it!",
        "The meadow thanks you!",
        "Perfect blending!",
        "You're a blend master!",
      ],
    },
    jumbleMonsterLevel: 1,
    treasures: ['🌷', '🌼', '🌺', '🍯', '🐝'],
    ambiance: 'meadow',
  },
  digraph_cave: {
    id: 'digraph_cave',
    name: 'Digraph Cave',
    description: 'Where two letters make one sound',
    icon: '🦇',
    unlockLevel: 5,
    wilsonSteps: [2, 3],
    storyIntro: "Enter the Digraph Cave! Here, pairs of letters work together to make special sounds. Echo the Bat needs your help!",
    storyComplete: "The cave echoes with perfect digraphs! You've mastered the two-letter sounds!",
    npc: {
      id: 'echo',
      name: 'Echo',
      emoji: '🦇',
      role: 'Cave Bat',
      greeting: "Squeak squeak! I'm Echo! In my cave, two letters join to make one special sound. SH, CH, TH... they're all mixed up!",
      hints: [
        "Two letters, one sound!",
        "Listen for the special sound!",
        "SH says shhhh, CH says choo!",
        "These friends stick together!",
      ],
      encouragements: [
        "Echo echo! You're doing great!",
        "The cave believes in you!",
        "Keep listening carefully!",
        "You're getting the hang of it!",
      ],
      celebrations: [
        "SQUEAK! Perfect digraph!",
        "The cave rings with your success!",
        "You've mastered two-letter sounds!",
        "Amazing ears!",
      ],
    },
    jumbleMonsterLevel: 2,
    treasures: ['🔮', '💜', '🌙', '⚡', '🕯️'],
    ambiance: 'cave',
  },
  syllable_summit: {
    id: 'syllable_summit',
    name: 'Syllable Summit',
    description: 'Where words climb together',
    icon: '🏔️',
    unlockLevel: 7,
    wilsonSteps: [3, 4],
    storyIntro: "You've reached Syllable Summit! Here, words are built piece by piece, like climbing a mountain. The Jumble Monster has scattered the syllables across the peaks!",
    storyComplete: "The mountain echoes with complete words now! You've conquered the Summit!",
    npc: {
      id: 'rocky',
      name: 'Rocky',
      emoji: '🦅',
      role: 'Mountain Eagle',
      greeting: "Caw! Welcome to the Summit! I'm Rocky. I've been watching over these syllables, but they got all mixed up!",
      hints: [
        "Clap your hands to count the syllables!",
        "Longer words have more parts!",
        "Listen for the vowel sounds - each one makes a syllable!",
        "Break it apart, then put it back together!",
      ],
      encouragements: [
        "Higher and higher! You're climbing well!",
        "The peak is in sight! Keep going!",
        "You're stronger than you know!",
        "One step at a time - you'll make it!",
      ],
      celebrations: [
        "CAW CAW! You reached a new height!",
        "Magnificent! The Summit celebrates you!",
        "You're conquering these words!",
        "The echoes carry your victory!",
      ],
    },
    jumbleMonsterLevel: 2,
    treasures: ['💎', '⭐', '🏆', '🎖️', '👑'],
    ambiance: 'mountain',
  },
  rhyme_river: {
    id: 'rhyme_river',
    name: 'Rhyme River',
    description: 'Where words flow and rhyme',
    icon: '🌊',
    unlockLevel: 9,
    wilsonSteps: [4, 5],
    storyIntro: "Welcome to Rhyme River! Words that sound alike play together here. But the Jumble Monster has jumbled all the rhymes!",
    storyComplete: "The river sings with rhyming words! Cat, bat, hat - they're all friends again!",
    npc: {
      id: 'ripple',
      name: 'Ripple',
      emoji: '🐸',
      role: 'Rhyming Frog',
      greeting: "Ribbit! I'm Ripple! I love words that rhyme - they make my heart chime! But now they're all tangled!",
      hints: [
        "Listen to the ending sounds!",
        "Words that rhyme sound the same at the end!",
        "Cat and bat - hear how they match?",
        "The ending is the key!",
      ],
      encouragements: [
        "Keep rhyming! You're doing fine!",
        "The river flows with your talent!",
        "Almost there, don't stop now!",
        "You've got rhythm!",
      ],
      celebrations: [
        "Ribbit ribbit! Perfect rhyme!",
        "You make rhyming look easy!",
        "The river dances for you!",
        "Rhyme time champion!",
      ],
    },
    jumbleMonsterLevel: 2,
    treasures: ['🐚', '🦀', '🐠', '💧', '🌈'],
    ambiance: 'river',
  },
  fluency_falls: {
    id: 'fluency_falls',
    name: 'Fluency Falls',
    description: 'Where sentences flow like waterfalls',
    icon: '💧',
    unlockLevel: 11,
    wilsonSteps: [5, 6],
    storyIntro: "Welcome to Fluency Falls! Here, words flow together like water, creating beautiful sentences. But the Jumble Monster has dammed up the river of words!",
    storyComplete: "The words are flowing freely again! Listen to the beautiful sentences splashing by!",
    npc: {
      id: 'splash',
      name: 'Splash',
      emoji: '🐬',
      role: 'River Dolphin',
      greeting: "Hello, splash! I'm Splash! The river used to be full of beautiful sentences, but now they're all jumbled up!",
      hints: [
        "Words flow together - try reading faster!",
        "Connect the words smoothly, like water!",
        "Let the sentence carry you along!",
        "Read it like you're telling a story!",
      ],
      encouragements: [
        "Let the words wash over you!",
        "Go with the flow - you're doing great!",
        "The river believes in you!",
        "Swim through those sentences!",
      ],
      celebrations: [
        "SPLASH! That was beautiful!",
        "You're flowing like a pro!",
        "The river dances for you!",
        "Amazing fluency, Word Quester!",
      ],
    },
    jumbleMonsterLevel: 3,
    treasures: ['💎', '🐳', '🌊', '⚓', '🦋'],
    ambiance: 'waterfall',
  },
  story_garden: {
    id: 'story_garden',
    name: 'Story Garden',
    description: 'Where tales grow and bloom',
    icon: '📚',
    unlockLevel: 13,
    wilsonSteps: [6, 7],
    storyIntro: "Enter the Story Garden! Here, sentences grow into beautiful stories. The Jumble Monster has wilted all the tales!",
    storyComplete: "The garden blooms with wonderful stories! You're a true storyteller!",
    npc: {
      id: 'petal',
      name: 'Petal',
      emoji: '🦜',
      role: 'Story Parrot',
      greeting: "Squawk! I'm Petal! I used to tell the most beautiful stories, but now all my words are scattered!",
      hints: [
        "Every story has a beginning, middle, and end!",
        "What happens first? Then what?",
        "Use your imagination!",
        "Stories come from the heart!",
      ],
      encouragements: [
        "Your story is growing!",
        "Keep weaving those words!",
        "The garden loves your tales!",
        "You're a natural storyteller!",
      ],
      celebrations: [
        "SQUAWK! What a beautiful story!",
        "The garden blooms for you!",
        "You're a story master!",
        "Tale-telling triumph!",
      ],
    },
    jumbleMonsterLevel: 3,
    treasures: ['📖', '✨', '🌹', '🎭', '🖋️'],
    ambiance: 'garden',
  },
  vocabulary_volcano: {
    id: 'vocabulary_volcano',
    name: 'Vocabulary Volcano',
    description: 'Where powerful words erupt',
    icon: '🌋',
    unlockLevel: 15,
    wilsonSteps: [8, 9],
    storyIntro: "Beware the Vocabulary Volcano! Here, powerful words bubble up from deep below. Learn them to defeat the Jumble Monster!",
    storyComplete: "You've mastered the volcano's words! Power erupts from your vocabulary!",
    npc: {
      id: 'ember',
      name: 'Ember',
      emoji: '🐉',
      role: 'Baby Dragon',
      greeting: "Roar! I'm Ember! The volcano is full of powerful words, but they're all mixed up in the lava!",
      hints: [
        "Big words have smaller words inside!",
        "Look for patterns you know!",
        "Sound it out, part by part!",
        "You're stronger than any word!",
      ],
      encouragements: [
        "Feel the power building!",
        "You're hot stuff!",
        "The volcano rumbles with pride!",
        "Keep that fire burning!",
      ],
      celebrations: [
        "ROAR! Volcanic victory!",
        "You've erupted with success!",
        "Power words unlocked!",
        "The dragon is impressed!",
      ],
    },
    jumbleMonsterLevel: 4,
    treasures: ['🔥', '💎', '🐲', '⚔️', '🛡️'],
    ambiance: 'volcano',
  },
  wisdom_woods: {
    id: 'wisdom_woods',
    name: 'Wisdom Woods',
    description: 'Where ancient words dwell',
    icon: '🌳',
    unlockLevel: 18,
    wilsonSteps: [10, 11],
    storyIntro: "Welcome to the ancient Wisdom Woods! The oldest and wisest words live here. Master them to become a true Word Legend!",
    storyComplete: "The ancient trees bow to your wisdom! You've learned the oldest words!",
    npc: {
      id: 'elder',
      name: 'Elder',
      emoji: '🦌',
      role: 'Ancient Deer',
      greeting: "Greetings, young one. I am Elder. The wisdom of words flows through these ancient woods.",
      hints: [
        "Ancient words have deep roots!",
        "Look for word families!",
        "Prefixes change meanings!",
        "Every word has a story!",
      ],
      encouragements: [
        "Wisdom grows within you!",
        "The trees whisper your name!",
        "Ancient power awakens!",
        "You seek knowledge well!",
      ],
      celebrations: [
        "The woods celebrate your wisdom!",
        "Ancient knowledge is yours!",
        "You've earned the trees' respect!",
        "Wise beyond your years!",
      ],
    },
    jumbleMonsterLevel: 4,
    treasures: ['🍂', '📜', '🦉', '✨', '🌙'],
    ambiance: 'ancient_forest',
  },
  mastery_castle: {
    id: 'mastery_castle',
    name: 'Mastery Castle',
    description: 'Where Word Questers become legends',
    icon: '🏰',
    unlockLevel: 20,
    wilsonSteps: [12],
    storyIntro: "You've reached Mastery Castle, the heart of Word Wonderland! This is where the Jumble Monster lives. Only the bravest Word Questers make it this far!",
    storyComplete: "You've defeated Lord Jumble and saved Word Wonderland! You are now a Word Legend!",
    npc: {
      id: 'sage',
      name: 'Sage',
      emoji: '🧙',
      role: 'Word Wizard',
      greeting: "Greetings, brave Word Quester! I am Sage, the Word Wizard. You've come far, but the greatest challenge awaits in the castle!",
      hints: [
        "Remember everything you've learned!",
        "Use your word power wisely!",
        "The answer is within you!",
        "Trust your knowledge, Word Legend!",
      ],
      encouragements: [
        "You have the power of words!",
        "Legends never give up!",
        "The castle believes in you!",
        "You're almost a Word Master!",
      ],
      celebrations: [
        "MAGNIFICENT! True mastery!",
        "You are a Word Legend!",
        "The Kingdom celebrates your victory!",
        "Word Wonderland is saved, thanks to you!",
      ],
    },
    jumbleMonsterLevel: 4,
    treasures: ['👑', '🗡️', '🛡️', '📜', '🔮'],
    ambiance: 'castle',
  },
};

// Story branching choices
export interface StoryChoice {
  id: string;
  text: string;
  outcome: string;
  xpBonus: number;
}

export interface StoryBranch {
  regionId: string;
  triggerLevel: number;
  prompt: string;
  choices: StoryChoice[];
}

export const STORY_BRANCHES: StoryBranch[] = [
  {
    regionId: 'phoneme_forest',
    triggerLevel: 2,
    prompt: "Whisper the Owl spots two paths ahead. Which way should we go?",
    choices: [
      { id: 'sunny', text: '🌞 The Sunny Path', outcome: "You found a hidden treasure in the sunshine!", xpBonus: 15 },
      { id: 'misty', text: '🌫️ The Misty Path', outcome: "You discovered a secret letter cave!", xpBonus: 20 },
    ],
  },
  {
    regionId: 'blend_meadow',
    triggerLevel: 4,
    prompt: "Daisy found two gardens. Which one should we explore?",
    choices: [
      { id: 'flower', text: '🌸 Flower Garden', outcome: "The flowers taught you a new blend!", xpBonus: 20 },
      { id: 'veggie', text: '🥕 Veggie Patch', outcome: "You helped the vegetables grow stronger!", xpBonus: 15 },
    ],
  },
  {
    regionId: 'syllable_summit',
    triggerLevel: 8,
    prompt: "Rocky sees two peaks. Which mountain should we climb?",
    choices: [
      { id: 'ice', text: '❄️ Ice Peak', outcome: "You conquered the frozen syllables!", xpBonus: 25 },
      { id: 'fire', text: '🔥 Fire Peak', outcome: "You mastered the blazing words!", xpBonus: 25 },
    ],
  },
];

// Treasure hunt rewards
export interface TreasureReward {
  id: string;
  name: string;
  emoji: string;
  xpBonus: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

export const TREASURE_REWARDS: TreasureReward[] = [
  { id: 'gold_coin', name: 'Gold Coin', emoji: '🪙', xpBonus: 10, rarity: 'common', description: 'A shiny treasure!' },
  { id: 'magic_gem', name: 'Magic Gem', emoji: '💎', xpBonus: 25, rarity: 'rare', description: 'Sparkles with word power!' },
  { id: 'star_crystal', name: 'Star Crystal', emoji: '⭐', xpBonus: 50, rarity: 'epic', description: 'Fallen from the sky!' },
  { id: 'legendary_crown', name: 'Word Crown', emoji: '👑', xpBonus: 100, rarity: 'legendary', description: 'For true Word Masters!' },
];

// Get random treasure based on accuracy
export function getRandomTreasure(accuracy: number): TreasureReward | null {
  const roll = Math.random();
  
  if (accuracy === 100) {
    // Perfect score - chance for legendary
    if (roll < 0.1) return TREASURE_REWARDS[3]; // legendary
    if (roll < 0.4) return TREASURE_REWARDS[2]; // epic
    return TREASURE_REWARDS[1]; // rare
  } else if (accuracy >= 80) {
    // Great score
    if (roll < 0.2) return TREASURE_REWARDS[2]; // epic
    if (roll < 0.6) return TREASURE_REWARDS[1]; // rare
    return TREASURE_REWARDS[0]; // common
  } else if (accuracy >= 60) {
    // Good score
    if (roll < 0.4) return TREASURE_REWARDS[1]; // rare
    if (roll < 0.8) return TREASURE_REWARDS[0]; // common
    return null; // no treasure
  }
  
  // Below 60% - small chance
  if (roll < 0.3) return TREASURE_REWARDS[0];
  return null;
}

// NPC dialogue helpers
export function getNPCHint(region: StoryRegion): string {
  const hints = region.npc.hints;
  return hints[Math.floor(Math.random() * hints.length)];
}

export function getNPCEncouragement(region: StoryRegion): string {
  const encouragements = region.npc.encouragements;
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

export function getNPCCelebration(region: StoryRegion): string {
  const celebrations = region.npc.celebrations;
  return celebrations[Math.floor(Math.random() * celebrations.length)];
}

// Jumble Monster encounter
export function getJumbleMonster(level: number): JumbleMonsterEncounter {
  const index = Math.min(level - 1, JUMBLE_MONSTER.length - 1);
  return JUMBLE_MONSTER[Math.max(0, index)];
}
