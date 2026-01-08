// Theme color definitions
export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
}

export const THEMES: Record<string, ThemeColors> = {
  default: {
    primary: '174 62% 57%',      // Teal
    accent: '28 87% 62%',        // Orange
    background: '45 33% 97%',    // Cream
  },
  theme_ocean: {
    primary: '200 80% 50%',      // Ocean Blue
    accent: '185 70% 45%',       // Cyan
    background: '200 30% 97%',   // Light blue tint
  },
  theme_forest: {
    primary: '142 70% 45%',      // Forest Green
    accent: '85 60% 50%',        // Lime
    background: '100 20% 97%',   // Light green tint
  },
  theme_sunset: {
    primary: '25 90% 55%',       // Sunset Orange
    accent: '350 80% 60%',       // Pink-red
    background: '30 40% 97%',    // Warm cream
  },
  theme_galaxy: {
    primary: '270 70% 60%',      // Galaxy Purple
    accent: '300 60% 65%',       // Magenta
    background: '260 20% 97%',   // Light purple tint
  },
  theme_rainbow: {
    primary: '280 70% 60%',      // Purple
    accent: '45 90% 55%',        // Yellow
    background: '0 0% 98%',      // Pure white
  },
};

export function applyTheme(themeId: string) {
  const theme = THEMES[themeId] || THEMES.default;
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--ring', theme.primary);
}

export function getActiveTheme(ownedItems: string[]): string {
  // Return last purchased theme or default
  const themes = ownedItems.filter(id => id.startsWith('theme_'));
  return themes.length > 0 ? themes[themes.length - 1] : 'default';
}
