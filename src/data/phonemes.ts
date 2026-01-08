// Phoneme data for Wilson Reading System
export interface Phoneme {
  grapheme: string;      // Written form (letter/letters)
  sound: string;         // How to say it for TTS
  type: 'consonant' | 'vowel' | 'digraph' | 'blend' | 'suffix';
  wilsonStep: number;
  examples: string[];
}

export const PHONEMES: Record<string, Phoneme> = {
  // Consonants (Wilson Step 1)
  b: { grapheme: 'b', sound: 'buh', type: 'consonant', wilsonStep: 1, examples: ['bat', 'bed', 'bib'] },
  c: { grapheme: 'c', sound: 'kuh', type: 'consonant', wilsonStep: 1, examples: ['cat', 'cup', 'cap'] },
  d: { grapheme: 'd', sound: 'duh', type: 'consonant', wilsonStep: 1, examples: ['dog', 'dad', 'did'] },
  f: { grapheme: 'f', sound: 'fff', type: 'consonant', wilsonStep: 1, examples: ['fan', 'fun', 'fish'] },
  g: { grapheme: 'g', sound: 'guh', type: 'consonant', wilsonStep: 1, examples: ['go', 'get', 'gum'] },
  h: { grapheme: 'h', sound: 'huh', type: 'consonant', wilsonStep: 1, examples: ['hat', 'hop', 'hit'] },
  j: { grapheme: 'j', sound: 'juh', type: 'consonant', wilsonStep: 1, examples: ['jam', 'jet', 'jog'] },
  k: { grapheme: 'k', sound: 'kuh', type: 'consonant', wilsonStep: 1, examples: ['kid', 'kit', 'keg'] },
  l: { grapheme: 'l', sound: 'lll', type: 'consonant', wilsonStep: 1, examples: ['leg', 'log', 'lip'] },
  m: { grapheme: 'm', sound: 'mmm', type: 'consonant', wilsonStep: 1, examples: ['man', 'mom', 'mud'] },
  n: { grapheme: 'n', sound: 'nnn', type: 'consonant', wilsonStep: 1, examples: ['net', 'nap', 'nut'] },
  p: { grapheme: 'p', sound: 'puh', type: 'consonant', wilsonStep: 1, examples: ['pig', 'pot', 'pen'] },
  r: { grapheme: 'r', sound: 'rrr', type: 'consonant', wilsonStep: 1, examples: ['run', 'red', 'rat'] },
  s: { grapheme: 's', sound: 'sss', type: 'consonant', wilsonStep: 1, examples: ['sun', 'sit', 'sad'] },
  t: { grapheme: 't', sound: 'tuh', type: 'consonant', wilsonStep: 1, examples: ['top', 'ten', 'tub'] },
  v: { grapheme: 'v', sound: 'vvv', type: 'consonant', wilsonStep: 1, examples: ['van', 'vet', 'vat'] },
  w: { grapheme: 'w', sound: 'wuh', type: 'consonant', wilsonStep: 1, examples: ['wet', 'win', 'web'] },
  x: { grapheme: 'x', sound: 'ks', type: 'consonant', wilsonStep: 1, examples: ['fox', 'box', 'mix'] },
  y: { grapheme: 'y', sound: 'yuh', type: 'consonant', wilsonStep: 1, examples: ['yes', 'yam', 'yet'] },
  z: { grapheme: 'z', sound: 'zzz', type: 'consonant', wilsonStep: 1, examples: ['zip', 'zoo', 'zap'] },

  // Short Vowels (Wilson Step 1)
  a_short: { grapheme: 'a', sound: 'ah', type: 'vowel', wilsonStep: 1, examples: ['cat', 'bat', 'map'] },
  e_short: { grapheme: 'e', sound: 'eh', type: 'vowel', wilsonStep: 1, examples: ['bed', 'red', 'pet'] },
  i_short: { grapheme: 'i', sound: 'ih', type: 'vowel', wilsonStep: 1, examples: ['sit', 'pig', 'hit'] },
  o_short: { grapheme: 'o', sound: 'ah', type: 'vowel', wilsonStep: 1, examples: ['hot', 'pot', 'dog'] },
  u_short: { grapheme: 'u', sound: 'uh', type: 'vowel', wilsonStep: 1, examples: ['cup', 'run', 'sun'] },

  // Digraphs (Wilson Step 2)
  sh: { grapheme: 'sh', sound: 'shh', type: 'digraph', wilsonStep: 2, examples: ['ship', 'fish', 'wish'] },
  ch: { grapheme: 'ch', sound: 'chh', type: 'digraph', wilsonStep: 2, examples: ['chip', 'chin', 'rich'] },
  th: { grapheme: 'th', sound: 'thh', type: 'digraph', wilsonStep: 2, examples: ['this', 'that', 'with'] },
  wh: { grapheme: 'wh', sound: 'wh', type: 'digraph', wilsonStep: 2, examples: ['when', 'what', 'whip'] },
  ck: { grapheme: 'ck', sound: 'ck', type: 'digraph', wilsonStep: 2, examples: ['back', 'duck', 'sick'] },

  // Blends (Wilson Step 3)
  bl: { grapheme: 'bl', sound: 'bl', type: 'blend', wilsonStep: 3, examples: ['blue', 'blob', 'blend'] },
  br: { grapheme: 'br', sound: 'br', type: 'blend', wilsonStep: 3, examples: ['brown', 'bring', 'brim'] },
  cl: { grapheme: 'cl', sound: 'cl', type: 'blend', wilsonStep: 3, examples: ['clap', 'clip', 'club'] },
  cr: { grapheme: 'cr', sound: 'cr', type: 'blend', wilsonStep: 3, examples: ['crab', 'crop', 'crisp'] },
  dr: { grapheme: 'dr', sound: 'dr', type: 'blend', wilsonStep: 3, examples: ['drop', 'drip', 'drum'] },
  fl: { grapheme: 'fl', sound: 'fl', type: 'blend', wilsonStep: 3, examples: ['flag', 'flip', 'flat'] },
  fr: { grapheme: 'fr', sound: 'fr', type: 'blend', wilsonStep: 3, examples: ['frog', 'from', 'fry'] },
  gl: { grapheme: 'gl', sound: 'gl', type: 'blend', wilsonStep: 3, examples: ['glad', 'glow', 'glum'] },
  gr: { grapheme: 'gr', sound: 'gr', type: 'blend', wilsonStep: 3, examples: ['grab', 'grin', 'grow'] },
  pl: { grapheme: 'pl', sound: 'pl', type: 'blend', wilsonStep: 3, examples: ['plan', 'plop', 'plug'] },
  pr: { grapheme: 'pr', sound: 'pr', type: 'blend', wilsonStep: 3, examples: ['prep', 'prop', 'prim'] },
  sk: { grapheme: 'sk', sound: 'sk', type: 'blend', wilsonStep: 3, examples: ['skip', 'skin', 'sky'] },
  sl: { grapheme: 'sl', sound: 'sl', type: 'blend', wilsonStep: 3, examples: ['sled', 'slip', 'slim'] },
  sm: { grapheme: 'sm', sound: 'sm', type: 'blend', wilsonStep: 3, examples: ['small', 'smell', 'smog'] },
  sn: { grapheme: 'sn', sound: 'sn', type: 'blend', wilsonStep: 3, examples: ['snap', 'snip', 'snow'] },
  sp: { grapheme: 'sp', sound: 'sp', type: 'blend', wilsonStep: 3, examples: ['spin', 'spot', 'spud'] },
  st: { grapheme: 'st', sound: 'st', type: 'blend', wilsonStep: 3, examples: ['stop', 'step', 'stem'] },
  sw: { grapheme: 'sw', sound: 'sw', type: 'blend', wilsonStep: 3, examples: ['swim', 'swan', 'swam'] },
  tr: { grapheme: 'tr', sound: 'tr', type: 'blend', wilsonStep: 3, examples: ['trip', 'trap', 'trim'] },
  tw: { grapheme: 'tw', sound: 'tw', type: 'blend', wilsonStep: 3, examples: ['twin', 'twig', 'twist'] },
};

// Get phonemes for a specific Wilson step
export function getPhonemesForStep(step: number): Phoneme[] {
  return Object.values(PHONEMES).filter(p => p.wilsonStep === step);
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
  'raft', 'raft',                              // -aft family
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
  };
}
