// Wilson Reading System Curriculum Database
// Steps 1-12 Architecture with Step 1 fully implemented

export interface Tile {
  c: string; // character
  t: 'c' | 'v' | 'd' | 'w' | 'b' | 's'; // consonant, vowel, digraph, welded, bonus, suffix
}

export interface SubStep {
  id: string;
  title: string;
  tiles: Tile[];
  words: string[];
  sentences: string[];
}

export interface Step {
  id: string;
  title: string;
  color: string;
  substeps: Record<string, SubStep>;
}

export type CurriculumType = Record<string, Step>;

export const CURRICULUM: CurriculumType = {
  "1": {
    id: "1",
    title: "Closed Syllables",
    color: "bg-blue-500",
    substeps: {
      "1.1": {
        id: "1.1",
        title: "CVC Words (f, l, m, n, r, s)",
        tiles: [
          { c: 'm', t: 'c' }, { c: 'a', t: 'v' }, { c: 'p', t: 'c' },
          { c: 't', t: 'c' }, { c: 's', t: 'c' }, { c: 'f', t: 'c' },
          { c: 'l', t: 'c' }, { c: 'n', t: 'c' }, { c: 'r', t: 'c' }
        ],
        // Wilson 1.1: CVC with short 'a' and consonants f, l, m, n, r, s (+ t, p for endings)
        words: ["mat", "sat", "rat", "fat", "fan", "ran", "tan", "lap", "nap", "sap", "raft", "last"],
        sentences: ["The rat sat.", "Tap the mat.", "A fat rat ran fast."]
      },
      "1.2": {
        id: "1.2",
        title: "CVC (b, g, h, j, p, t, v, w)",
        tiles: [
          { c: 'b', t: 'c' }, { c: 'i', t: 'v' }, { c: 'g', t: 'c' },
          { c: 'p', t: 'c' }, { c: 'h', t: 'c' }, { c: 'j', t: 'c' },
          { c: 'v', t: 'c' }, { c: 'w', t: 'c' }, { c: 'o', t: 'v' }
        ],
        words: ["big", "pig", "dig", "bat", "hot", "jog", "wig", "van", "web"],
        sentences: ["The pig is big.", "Dig a pit.", "A hot dog jog."]
      },
      "1.3": {
        id: "1.3",
        title: "Digraphs (sh, ch, th, wh, ck)",
        tiles: [
          { c: 'sh', t: 'd' }, { c: 'i', t: 'v' }, { c: 'p', t: 'c' },
          { c: 'ch', t: 'd' }, { c: 'th', t: 'd' }, { c: 'wh', t: 'd' },
          { c: 'ck', t: 'd' }, { c: 'o', t: 'v' }
        ],
        words: ["ship", "shop", "chip", "math", "rich", "duck", "when", "thick"],
        sentences: ["The ship is in the shop.", "Chop the thick log.", "A duck can quack."]
      },
      "1.4": {
        id: "1.4",
        title: "Bonus Letters (ff, ll, ss, zz)",
        tiles: [
          { c: 'h', t: 'c' }, { c: 'i', t: 'v' }, { c: 'll', t: 'b' },
          { c: 'ff', t: 'b' }, { c: 'ss', t: 'b' }, { c: 'zz', t: 'b' },
          { c: 'm', t: 'c' }, { c: 'u', t: 'v' }
        ],
        words: ["hill", "miss", "puff", "buzz", "well", "fill", "hiss", "jazz"],
        sentences: ["Bill will miss the bus.", "The hill is tall.", "I can hear the buzz."]
      },
      "1.5": {
        id: "1.5",
        title: "Welded Sounds (am, an, all)",
        tiles: [
          { c: 'b', t: 'c' }, { c: 'all', t: 'w' }, { c: 'h', t: 'c' },
          { c: 'am', t: 'w' }, { c: 'an', t: 'w' }, { c: 't', t: 'c' },
          { c: 'f', t: 'c' }, { c: 'j', t: 'c' }
        ],
        words: ["ball", "ham", "fan", "tall", "jam", "can", "man", "call", "fall"],
        sentences: ["Kick the ball.", "I like ham and jam.", "The tall man can fall."]
      },
      "1.6": {
        id: "1.6",
        title: "Suffix -s",
        tiles: [
          { c: 'b', t: 'c' }, { c: 'u', t: 'v' }, { c: 'g', t: 'c' },
          { c: 's', t: 's' }, { c: 'm', t: 'c' }, { c: 'a', t: 'v' },
          { c: 'p', t: 'c' }, { c: 'c', t: 'c' }, { c: 't', t: 'c' }
        ],
        words: ["bugs", "maps", "cats", "runs", "hops", "bats", "cups", "tops"],
        sentences: ["The bugs are fast.", "He runs up the hill.", "Cats and bats nap."]
      }
    }
  },
  "2": { id: "2", title: "Bonus Letters", color: "bg-green-500", substeps: {} },
  "3": { id: "3", title: "Exceptions", color: "bg-teal-500", substeps: {} },
  "4": { id: "4", title: "V-C-e Syllables", color: "bg-yellow-500", substeps: {} },
  "5": { id: "5", title: "Open Syllables", color: "bg-orange-500", substeps: {} },
  "6": { id: "6", title: "Suffixes", color: "bg-red-500", substeps: {} },
  "7": { id: "7", title: "Sound Options", color: "bg-pink-500", substeps: {} },
  "8": { id: "8", title: "R-Controlled", color: "bg-purple-500", substeps: {} },
  "9": { id: "9", title: "Vowel Digraphs", color: "bg-indigo-500", substeps: {} },
  "10": { id: "10", title: "Advanced Suffixes", color: "bg-blue-600", substeps: {} },
  "11": { id: "11", title: "Contractions", color: "bg-cyan-600", substeps: {} },
  "12": { id: "12", title: "Advanced Concepts", color: "bg-slate-600", substeps: {} }
};

// Get tile style class based on type
export const getTileStyle = (type: Tile['t']): string => {
  const styles: Record<Tile['t'], string> = {
    c: 'tile-consonant',
    v: 'tile-vowel',
    d: 'tile-digraph',
    w: 'tile-welded',
    b: 'tile-consonant', // Bonus uses consonant style with star
    s: 'tile-suffix'
  };
  return styles[type] || styles.c;
};

// Check if character is a vowel
export const isVowel = (char: string): boolean => {
  return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
};
