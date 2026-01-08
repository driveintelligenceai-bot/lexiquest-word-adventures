// Lexia World Theme System
export interface LexiaTheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  card: string;
}

export const LEXIA_THEMES: Record<string, LexiaTheme> = {
  default: {
    id: 'default',
    name: 'Lexia Cream',
    primary: '152 60% 40%',      // Forest green
    accent: '35 90% 55%',        // Warm gold
    background: '45 40% 96%',    // Cream
    card: '0 0% 100%',           // White
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    primary: '200 70% 45%',
    accent: '175 60% 50%',
    background: '200 25% 96%',
    card: '200 20% 99%',
  },
  forest: {
    id: 'forest',
    name: 'Enchanted Forest',
    primary: '142 55% 40%',
    accent: '85 50% 50%',
    background: '120 20% 96%',
    card: '120 15% 99%',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Valley',
    primary: '25 85% 50%',
    accent: '350 70% 60%',
    background: '30 35% 96%',
    card: '30 30% 99%',
  },
  galaxy: {
    id: 'galaxy',
    name: 'Galaxy Quest',
    primary: '270 60% 55%',
    accent: '300 55% 60%',
    background: '260 20% 96%',
    card: '260 15% 99%',
  },
};

// Wilson Reading color coding
export const WILSON_COLORS = {
  consonant: {
    bg: '201 94% 94%',
    border: '197 88% 60%',
    text: '201 90% 32%',
  },
  vowel: {
    bg: '347 77% 95%',
    border: '347 77% 73%',
    text: '347 77% 35%',
  },
  digraph: {
    bg: '48 96% 89%',
    border: '43 96% 56%',
    text: '32 81% 29%',
  },
  blend: {
    bg: '152 76% 91%',
    border: '160 64% 51%',
    text: '160 84% 29%',
  },
  suffix: {
    bg: '27 96% 91%',
    border: '27 96% 61%',
    text: '21 90% 38%',
  },
};

// Lexia regions
export const LEXIA_REGIONS = {
  phoneme_forest: {
    id: 'phoneme_forest',
    name: 'Phoneme Forest',
    description: 'Where letters learn to sing',
    wilsonSteps: [1, 2],
    icon: '🌲',
    unlockLevel: 1,
  },
  syllable_summit: {
    id: 'syllable_summit',
    name: 'Syllable Summit',
    description: 'Where words climb together',
    wilsonSteps: [3, 4],
    icon: '🏔️',
    unlockLevel: 5,
  },
  fluency_falls: {
    id: 'fluency_falls',
    name: 'Fluency Falls',
    description: 'Where sentences flow like rivers',
    wilsonSteps: [5, 6],
    icon: '🌊',
    unlockLevel: 10,
  },
  mastery_castle: {
    id: 'mastery_castle',
    name: 'Mastery Castle',
    description: 'Where Word Questers become legends',
    wilsonSteps: [7, 8, 9, 10, 11, 12],
    icon: '🏰',
    unlockLevel: 15,
  },
};

export function applyLexiaTheme(themeId: string) {
  const theme = LEXIA_THEMES[themeId] || LEXIA_THEMES.default;
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--card', theme.card);
  root.style.setProperty('--ring', theme.primary);
}
