/**
 * Phoneme Data for Wilson Reading System
 * 
 * Enhanced with keyword-sound anchors following Wilson methodology:
 * - Letter → Keyword → Sound sequence
 * - Visual anchors (emoji) for multisensory learning
 * - Mouth formation hints for kinesthetic awareness
 */

export interface Phoneme {
  grapheme: string;      // Written form (letter/letters)
  sound: string;         // How to say it for TTS
  type: 'consonant' | 'vowel' | 'digraph' | 'blend' | 'suffix';
  wilsonStep: number;
  examples: string[];
  // NEW: Keyword-Sound Anchor fields
  keyword: string;       // Anchor word (e.g., "apple" for 'a')
  keywordEmoji: string;  // Visual anchor emoji
  mouthHint: string;     // How to form the sound with mouth
}

export const PHONEMES: Record<string, Phoneme> = {
  // Wilson 1.1 Consonants (f, l, m, n, r, s) + (t, p for word endings)
  f: { 
    grapheme: 'f', 
    sound: 'fff', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['fan', 'fat', 'fast'],
    keyword: 'fish',
    keywordEmoji: '🐟',
    mouthHint: 'Bite your bottom lip and blow air out gently'
  },
  l: { 
    grapheme: 'l', 
    sound: 'lll', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['lap', 'last', 'lat'],
    keyword: 'lion',
    keywordEmoji: '🦁',
    mouthHint: 'Put your tongue on the roof of your mouth and hum'
  },
  m: { 
    grapheme: 'm', 
    sound: 'mmm', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['mat', 'mast', 'map'],
    keyword: 'mouse',
    keywordEmoji: '🐭',
    mouthHint: 'Close your lips together and hum like something yummy'
  },
  n: { 
    grapheme: 'n', 
    sound: 'nnn', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['nap', 'nat'],
    keyword: 'nest',
    keywordEmoji: '🪺',
    mouthHint: 'Touch your tongue behind your top teeth and hum'
  },
  r: { 
    grapheme: 'r', 
    sound: 'rrr', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['rat', 'raft', 'rap'],
    keyword: 'rabbit',
    keywordEmoji: '🐰',
    mouthHint: 'Pull your tongue back and growl like a tiger'
  },
  s: { 
    grapheme: 's', 
    sound: 'sss', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['sat', 'sap', 'lass'],
    keyword: 'snake',
    keywordEmoji: '🐍',
    mouthHint: 'Put your teeth together and hiss like a snake'
  },
  t: { 
    grapheme: 't', 
    sound: 'tuh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['tap', 'tan', 'tat'],
    keyword: 'turtle',
    keywordEmoji: '🐢',
    mouthHint: 'Touch your tongue behind your top teeth, then pop'
  },
  p: { 
    grapheme: 'p', 
    sound: 'puh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['pat', 'pass', 'past'],
    keyword: 'pig',
    keywordEmoji: '🐷',
    mouthHint: 'Press your lips together then pop them open'
  },

  // Wilson 1.2 Consonants (b, g, h, j, v, w)
  b: { 
    grapheme: 'b', 
    sound: 'buh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['bat', 'bag', 'bad'],
    keyword: 'bear',
    keywordEmoji: '🐻',
    mouthHint: 'Press lips together, then open with a voiced pop'
  },
  c: { 
    grapheme: 'c', 
    sound: 'kuh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['cat', 'cup', 'cap'],
    keyword: 'cat',
    keywordEmoji: '🐱',
    mouthHint: 'Back of tongue touches roof of mouth, then release'
  },
  d: { 
    grapheme: 'd', 
    sound: 'duh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['dog', 'dad', 'did'],
    keyword: 'dog',
    keywordEmoji: '🐕',
    mouthHint: 'Tongue tip behind top teeth, then release with voice'
  },
  g: { 
    grapheme: 'g', 
    sound: 'guh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['gas', 'gap', 'gal'],
    keyword: 'goat',
    keywordEmoji: '🐐',
    mouthHint: 'Back of tongue touches roof, then release with voice'
  },
  h: { 
    grapheme: 'h', 
    sound: 'huh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['hat', 'hop', 'hit'],
    keyword: 'hat',
    keywordEmoji: '🎩',
    mouthHint: 'Open mouth and breathe out like you are panting'
  },
  j: { 
    grapheme: 'j', 
    sound: 'juh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['jam', 'jet', 'jog'],
    keyword: 'jam',
    keywordEmoji: '🍯',
    mouthHint: 'Touch tongue to roof, then release with a soft sound'
  },
  k: { 
    grapheme: 'k', 
    sound: 'kuh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['kid', 'kit', 'keg'],
    keyword: 'kite',
    keywordEmoji: '🪁',
    mouthHint: 'Back of tongue touches roof of mouth, then release'
  },
  v: { 
    grapheme: 'v', 
    sound: 'vvv', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['van', 'vet', 'vat'],
    keyword: 'van',
    keywordEmoji: '🚐',
    mouthHint: 'Bite your bottom lip and hum while blowing air'
  },
  w: { 
    grapheme: 'w', 
    sound: 'wuh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['wet', 'win', 'web'],
    keyword: 'worm',
    keywordEmoji: '🪱',
    mouthHint: 'Round your lips like saying "oo" then open quickly'
  },
  x: { 
    grapheme: 'x', 
    sound: 'ks', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['fox', 'box', 'mix'],
    keyword: 'fox',
    keywordEmoji: '🦊',
    mouthHint: 'Say "k" then "s" quickly together'
  },
  y: { 
    grapheme: 'y', 
    sound: 'yuh', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['yes', 'yam', 'yet'],
    keyword: 'yak',
    keywordEmoji: '🐂',
    mouthHint: 'Tongue near roof of mouth, slide to the vowel sound'
  },
  z: { 
    grapheme: 'z', 
    sound: 'zzz', 
    type: 'consonant', 
    wilsonStep: 1, 
    examples: ['zip', 'zoo', 'zap'],
    keyword: 'zebra',
    keywordEmoji: '🦓',
    mouthHint: 'Teeth together and buzz like a bee'
  },

  // Short Vowels (Wilson Step 1) - Only 'a' for 1.1
  a_short: { 
    grapheme: 'a', 
    sound: 'ah', 
    type: 'vowel', 
    wilsonStep: 1, 
    examples: ['mat', 'sat', 'fat'],
    keyword: 'apple',
    keywordEmoji: '🍎',
    mouthHint: 'Open your mouth wide and say "ahh" like at the doctor'
  },
  e_short: { 
    grapheme: 'e', 
    sound: 'eh', 
    type: 'vowel', 
    wilsonStep: 1, 
    examples: ['bed', 'red', 'pet'],
    keyword: 'egg',
    keywordEmoji: '🥚',
    mouthHint: 'Open mouth slightly and say "eh" like asking "eh?"'
  },
  i_short: { 
    grapheme: 'i', 
    sound: 'ih', 
    type: 'vowel', 
    wilsonStep: 1, 
    examples: ['sit', 'pig', 'hit'],
    keyword: 'igloo',
    keywordEmoji: '🏠',
    mouthHint: 'Small smile and short sound, like "it"'
  },
  o_short: { 
    grapheme: 'o', 
    sound: 'oh', 
    type: 'vowel', 
    wilsonStep: 1, 
    examples: ['hot', 'pot', 'dog'],
    keyword: 'octopus',
    keywordEmoji: '🐙',
    mouthHint: 'Open mouth round and say a short "o" like "hot"'
  },
  u_short: { 
    grapheme: 'u', 
    sound: 'uh', 
    type: 'vowel', 
    wilsonStep: 1, 
    examples: ['cup', 'run', 'sun'],
    keyword: 'umbrella',
    keywordEmoji: '☂️',
    mouthHint: 'Relax your mouth and make a short "uh" sound'
  },

  // Digraphs (Wilson Step 1.3)
  sh: { 
    grapheme: 'sh', 
    sound: 'shh', 
    type: 'digraph', 
    wilsonStep: 2, 
    examples: ['ship', 'fish', 'wish'],
    keyword: 'ship',
    keywordEmoji: '🚢',
    mouthHint: 'Round lips and blow air through like saying "quiet"'
  },
  ch: { 
    grapheme: 'ch', 
    sound: 'chh', 
    type: 'digraph', 
    wilsonStep: 2, 
    examples: ['chip', 'chin', 'rich'],
    keyword: 'cheese',
    keywordEmoji: '🧀',
    mouthHint: 'Start with tongue up, then push air out like a sneeze'
  },
  th: { 
    grapheme: 'th', 
    sound: 'thh', 
    type: 'digraph', 
    wilsonStep: 2, 
    examples: ['this', 'that', 'with'],
    keyword: 'thumb',
    keywordEmoji: '👍',
    mouthHint: 'Stick tongue between teeth and blow air'
  },
  wh: { 
    grapheme: 'wh', 
    sound: 'wh', 
    type: 'digraph', 
    wilsonStep: 2, 
    examples: ['when', 'what', 'whip'],
    keyword: 'whale',
    keywordEmoji: '🐋',
    mouthHint: 'Round lips, blow a small puff, then say "w"'
  },
  ck: { 
    grapheme: 'ck', 
    sound: 'ck', 
    type: 'digraph', 
    wilsonStep: 2, 
    examples: ['back', 'duck', 'sick'],
    keyword: 'duck',
    keywordEmoji: '🦆',
    mouthHint: 'Back of tongue pops from roof of mouth'
  },

  // Blends (Wilson Step 3) - Sample subset with keywords
  bl: { 
    grapheme: 'bl', 
    sound: 'bl', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['blue', 'blob', 'blend'],
    keyword: 'blue',
    keywordEmoji: '🔵',
    mouthHint: 'Say "b" then quickly slide to "l"'
  },
  br: { 
    grapheme: 'br', 
    sound: 'br', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['brown', 'bring', 'brim'],
    keyword: 'bread',
    keywordEmoji: '🍞',
    mouthHint: 'Say "b" then quickly slide to "r"'
  },
  cl: { 
    grapheme: 'cl', 
    sound: 'cl', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['clap', 'clip', 'club'],
    keyword: 'clap',
    keywordEmoji: '👏',
    mouthHint: 'Say "k" then quickly slide to "l"'
  },
  cr: { 
    grapheme: 'cr', 
    sound: 'cr', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['crab', 'crop', 'crisp'],
    keyword: 'crab',
    keywordEmoji: '🦀',
    mouthHint: 'Say "k" then quickly slide to "r"'
  },
  dr: { 
    grapheme: 'dr', 
    sound: 'dr', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['drop', 'drip', 'drum'],
    keyword: 'drum',
    keywordEmoji: '🥁',
    mouthHint: 'Say "d" then quickly slide to "r"'
  },
  fl: { 
    grapheme: 'fl', 
    sound: 'fl', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['flag', 'flip', 'flat'],
    keyword: 'flag',
    keywordEmoji: '🚩',
    mouthHint: 'Say "f" then quickly slide to "l"'
  },
  fr: { 
    grapheme: 'fr', 
    sound: 'fr', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['frog', 'from', 'fry'],
    keyword: 'frog',
    keywordEmoji: '🐸',
    mouthHint: 'Say "f" then quickly slide to "r"'
  },
  gl: { 
    grapheme: 'gl', 
    sound: 'gl', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['glad', 'glow', 'glum'],
    keyword: 'globe',
    keywordEmoji: '🌍',
    mouthHint: 'Say "g" then quickly slide to "l"'
  },
  gr: { 
    grapheme: 'gr', 
    sound: 'gr', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['grab', 'grin', 'grow'],
    keyword: 'grape',
    keywordEmoji: '🍇',
    mouthHint: 'Say "g" then quickly slide to "r"'
  },
  pl: { 
    grapheme: 'pl', 
    sound: 'pl', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['plan', 'plop', 'plug'],
    keyword: 'plant',
    keywordEmoji: '🌱',
    mouthHint: 'Say "p" then quickly slide to "l"'
  },
  pr: { 
    grapheme: 'pr', 
    sound: 'pr', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['prep', 'prop', 'prim'],
    keyword: 'present',
    keywordEmoji: '🎁',
    mouthHint: 'Say "p" then quickly slide to "r"'
  },
  sk: { 
    grapheme: 'sk', 
    sound: 'sk', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['skip', 'skin', 'sky'],
    keyword: 'sky',
    keywordEmoji: '🌤️',
    mouthHint: 'Say "s" then quickly add "k"'
  },
  sl: { 
    grapheme: 'sl', 
    sound: 'sl', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['sled', 'slip', 'slim'],
    keyword: 'sled',
    keywordEmoji: '🛷',
    mouthHint: 'Say "s" then quickly slide to "l"'
  },
  sm: { 
    grapheme: 'sm', 
    sound: 'sm', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['small', 'smell', 'smog'],
    keyword: 'smile',
    keywordEmoji: '😊',
    mouthHint: 'Say "s" then quickly add "m"'
  },
  sn: { 
    grapheme: 'sn', 
    sound: 'sn', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['snap', 'snip', 'snow'],
    keyword: 'snow',
    keywordEmoji: '❄️',
    mouthHint: 'Say "s" then quickly add "n"'
  },
  sp: { 
    grapheme: 'sp', 
    sound: 'sp', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['spin', 'spot', 'spud'],
    keyword: 'spider',
    keywordEmoji: '🕷️',
    mouthHint: 'Say "s" then quickly add "p"'
  },
  st: { 
    grapheme: 'st', 
    sound: 'st', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['stop', 'step', 'stem'],
    keyword: 'star',
    keywordEmoji: '⭐',
    mouthHint: 'Say "s" then quickly add "t"'
  },
  sw: { 
    grapheme: 'sw', 
    sound: 'sw', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['swim', 'swan', 'swam'],
    keyword: 'swan',
    keywordEmoji: '🦢',
    mouthHint: 'Say "s" then quickly add "w"'
  },
  tr: { 
    grapheme: 'tr', 
    sound: 'tr', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['trip', 'trap', 'trim'],
    keyword: 'tree',
    keywordEmoji: '🌲',
    mouthHint: 'Say "t" then quickly slide to "r"'
  },
  tw: { 
    grapheme: 'tw', 
    sound: 'tw', 
    type: 'blend', 
    wilsonStep: 3, 
    examples: ['twin', 'twig', 'twist'],
    keyword: 'twins',
    keywordEmoji: '👯',
    mouthHint: 'Say "t" then quickly add "w"'
  },
};

// Wilson 1.1 specific phonemes only (for focused drilling)
export const WILSON_1_1_PHONEMES = ['f', 'l', 'm', 'n', 'r', 's', 't', 'p', 'a_short'] as const;

// Get phonemes for a specific Wilson step
export function getPhonemesForStep(step: number): Phoneme[] {
  return Object.values(PHONEMES).filter(p => p.wilsonStep === step);
}

// Get Wilson 1.1 phonemes with keyword data
export function getWilson11Phonemes(): Phoneme[] {
  return WILSON_1_1_PHONEMES.map(key => PHONEMES[key]).filter(Boolean);
}

// Get phonemes by type
export function getPhonemesByType(type: Phoneme['type']): Phoneme[] {
  return Object.values(PHONEMES).filter(p => p.type === type);
}

// Check if a letter is a vowel
export function isVowel(letter: string): boolean {
  return ['a', 'e', 'i', 'o', 'u'].includes(letter.toLowerCase());
}

// Wilson 1.1 CVC words ONLY - short 'a' with consonants f, l, m, n, r, s (+ t, p for word endings)
// Avoiding problematic phonetic combinations like "am" which is a welded sound (1.5)
export const CVC_WORDS_1_1 = [
  'mat', 'sat', 'rat', 'fat', 'lat', 'nat',  // -at family
  'fan', 'ran', 'tan', 'lan',                 // -an family (avoiding 'man' - "am" sound)
  'lap', 'nap', 'sap', 'rap', 'tap',          // -ap family
  'lass', 'mass', 'pass',                     // -ass family
  'raft',                                      // -aft family
  'last', 'fast', 'mast', 'past',             // -ast family
];

// Full CVC words for all Wilson Step 1 substeps (1.1-1.6)
export const CVC_WORDS = [
  // 1.1 words (short 'a' with f, l, m, n, r, s)
  'mat', 'sat', 'rat', 'fat', 'fan', 'ran', 'tan', 'lap', 'nap', 'sap', 'tap',
  // 1.2 words (b, g, h, j, p, t, v, w)
  'bat', 'hat', 'pat', 'vat', 'bag', 'tag', 'wag', 'jab', 'tab', 'gap',
  // Additional common CVC for variety
  'cat', 'cap', 'map', 'gas', 'pal',
];

// Generate a Sound Match challenge
export interface SoundMatchChallenge {
  targetPhoneme: string;
  targetSound: string;
  options: string[];
  correctAnswer: string;
  keyword?: string;
  keywordEmoji?: string;
}

export function generateSoundMatchChallenge(wilsonStep: number): SoundMatchChallenge {
  const phonemes = getPhonemesForStep(wilsonStep);
  const shuffled = [...phonemes].sort(() => Math.random() - 0.5);
  
  const target = shuffled[0];
  const distractors = shuffled.slice(1, 4).map(p => p.grapheme);
  
  const options = [target.grapheme, ...distractors].sort(() => Math.random() - 0.5);
  
  return {
    targetPhoneme: target.grapheme,
    targetSound: target.sound,
    options,
    correctAnswer: target.grapheme,
    keyword: target.keyword,
    keywordEmoji: target.keywordEmoji,
  };
}
