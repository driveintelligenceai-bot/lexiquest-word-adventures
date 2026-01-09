/**
 * Wilson 1.1 Compliant Nonsense Word Generator
 * 
 * Pseudo-words (nonsense words) are used in Wilson Reading System to:
 * 1. Ensure students are applying decoding skills
 * 2. Prevent reliance on visual memory/guessing
 * 3. Solidify knowledge of sound-symbol relationships
 * 
 * Rules for Wilson 1.1 nonsense words:
 * - CVC pattern only (Consonant-Vowel-Consonant)
 * - Short 'a' vowel only
 * - Consonants limited to: f, l, m, n, r, s, t, p
 * - Must NOT form real English words
 * - Must be pronounceable
 * - Avoid welded sounds (am, an at end)
 */

// Wilson 1.1 consonants
const CONSONANTS_1_1 = ['f', 'l', 'm', 'n', 'r', 's', 't', 'p'] as const;

// Real Wilson 1.1 words to exclude (we don't want these as nonsense words)
const REAL_WORDS = new Set([
  'mat', 'sat', 'rat', 'fat', 'pat', 'lat', 'nat', 'tat',
  'fan', 'ran', 'tan', 'man', 'pan', 'can', 'van', 'ban',
  'lap', 'nap', 'sap', 'rap', 'tap', 'map', 'cap', 'gap',
  'raft', 'last', 'fast', 'mast', 'past', 'vast', 'cast',
  'lass', 'mass', 'pass', 'lass', 'sass', 'bass',
  'ram', 'sam', 'tam', 'dam', 'ham', 'jam',
  'ran', 'tan', 'fan', 'man', 'pan', 'can',
  'pal', 'gal', 'sal',
  'tar', 'far', 'par', 'mar', 'bar', 'car', 'jar',
  'sad', 'mad', 'bad', 'dad', 'lad', 'pad', 'rad', 'fad',
]);

// Combinations that are hard to pronounce or sound weird
const AWKWARD_COMBINATIONS = new Set([
  'faf', 'lal', 'mam', 'nan', 'rar', 'sas', 'tat', 'pap', // Same letter start/end
  'tst', 'psp', 'fsf', // Hard consonant clusters
]);

/**
 * Generate a single Wilson 1.1 compliant nonsense word
 */
function generateSingleNonsenseWord(): string {
  const onset = CONSONANTS_1_1[Math.floor(Math.random() * CONSONANTS_1_1.length)];
  const vowel = 'a'; // Wilson 1.1 uses only short 'a'
  const coda = CONSONANTS_1_1[Math.floor(Math.random() * CONSONANTS_1_1.length)];
  
  return `${onset}${vowel}${coda}`;
}

/**
 * Check if a word is a valid nonsense word for Wilson 1.1
 */
function isValidNonsenseWord(word: string): boolean {
  // Must not be a real word
  if (REAL_WORDS.has(word)) {
    return false;
  }
  
  // Must not be awkward to pronounce
  if (AWKWARD_COMBINATIONS.has(word)) {
    return false;
  }
  
  // Avoid ending in 'm' or 'n' (welded sound territory)
  // This is overly cautious but maintains Wilson 1.1 purity
  const lastChar = word[word.length - 1];
  if (lastChar === 'm' || lastChar === 'n') {
    // Allow some -an/-am endings that don't form welded sounds
    // But be strict for nonsense words to avoid confusion
    return false;
  }
  
  return true;
}

/**
 * Generate an array of unique nonsense words
 */
export function generateNonsenseWords(count: number): string[] {
  const words = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 20; // Prevent infinite loop
  
  while (words.size < count && attempts < maxAttempts) {
    const word = generateSingleNonsenseWord();
    if (isValidNonsenseWord(word)) {
      words.add(word);
    }
    attempts++;
  }
  
  return Array.from(words);
}

/**
 * Get a curated list of high-quality nonsense words
 * These are pre-verified to be pronounceable and not real words
 */
export const CURATED_NONSENSE_WORDS_1_1 = [
  // -at pattern
  'faf', 'laf', 'maf', 'naf', 'raf', 'saf', 'taf', 'paf',
  // -ap pattern  
  'fap', 'laf', 'maf', 'raf', 'saf', 'taf',
  // -as pattern
  'fas', 'las', 'mas', 'ras', 'tas', 'pas',
  // -al pattern
  'fal', 'mal', 'nal', 'ral', 'sal', 'tal', 'pal',
  // -ar pattern
  'lar', 'sar', 'nar', 'rar', 'tar',
  // -at pattern (different onsets)
  'lat', 'nat', 'raf', 'saf', 'taf', 'paf',
  // -af pattern
  'laf', 'maf', 'naf', 'raf', 'saf', 'taf', 'paf',
].filter(word => isValidNonsenseWord(word));

/**
 * Shuffled nonsense words for variety
 */
export function getShuffledNonsenseWords(count: number): string[] {
  const shuffled = [...CURATED_NONSENSE_WORDS_1_1].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Mix real and nonsense words for a decoding challenge
 * @param realWordCount Number of real words to include
 * @param nonsenseWordCount Number of nonsense words to include
 * @returns Shuffled array of { word: string, isNonsense: boolean }
 */
export function createMixedWordList(
  realWords: string[], 
  nonsenseWordCount: number
): Array<{ word: string; isNonsense: boolean }> {
  const nonsenseWords = getShuffledNonsenseWords(nonsenseWordCount);
  
  const realWordItems = realWords.map(word => ({ word, isNonsense: false }));
  const nonsenseWordItems = nonsenseWords.map(word => ({ word, isNonsense: true }));
  
  return [...realWordItems, ...nonsenseWordItems].sort(() => Math.random() - 0.5);
}

export default {
  generateNonsenseWords,
  getShuffledNonsenseWords,
  createMixedWordList,
  CURATED_NONSENSE_WORDS_1_1,
};
