export interface Accent {
  name: string;
  hex: string;
  rgb: string;
  hover: string;
}

export const ACCENTS: Accent[] = [
  { name: 'Terracotta', hex: '#E07A52', rgb: '224, 122, 82', hover: '#cc6a42' },
  { name: 'Clay', hex: '#C4602E', rgb: '196, 96, 46', hover: '#b05228' },
  { name: 'Sage', hex: '#6BA888', rgb: '107, 168, 136', hover: '#5a9275' },
  { name: 'Sand', hex: '#C9A87C', rgb: '201, 168, 124', hover: '#b8946a' },
  { name: 'Slate', hex: '#6E8FA8', rgb: '110, 143, 168', hover: '#5c7d96' },
  { name: 'Mauve', hex: '#A07C6E', rgb: '160, 124, 110', hover: '#8e6a5c' },
  { name: 'Ember', hex: '#B85C5C', rgb: '184, 92, 92', hover: '#a44a4a' },
  { name: 'Moss', hex: '#7A9B6E', rgb: '122, 155, 110', hover: '#688960' },
];

export type ColorMode = 'dark' | 'light' | 'system';
export type FontScale = 'small' | 'default' | 'large';

const ACCENT_KEY = 'nexus-accent';
const MODE_KEY = 'nexus-color-mode';
const SCALE_KEY = 'nexus-font-scale';

// Scales TEXT only (via the --fs multiplier on every font-size), not the layout.
const SCALE_VALUE: Record<FontScale, string> = { small: '0.9', default: '1', large: '1.12' };

// --- Accent ---------------------------------------------------------------
export function applyAccent(accent: Accent) {
  const root = document.documentElement.style;
  root.setProperty('--accent', accent.hex);
  root.setProperty('--accent-rgb', accent.rgb);
  root.setProperty('--accent-hover', accent.hover);
  localStorage.setItem(ACCENT_KEY, accent.name);
}

export function currentAccent(): Accent {
  return ACCENTS.find(a => a.name === localStorage.getItem(ACCENT_KEY)) ?? ACCENTS[0];
}

// --- Color mode -----------------------------------------------------------
function resolveMode(mode: ColorMode): 'dark' | 'light' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return mode;
}

export function applyColorMode(mode: ColorMode) {
  const resolved = resolveMode(mode);
  if (resolved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem(MODE_KEY, mode);
}

export function currentMode(): ColorMode {
  return (localStorage.getItem(MODE_KEY) as ColorMode) ?? 'dark';
}

// --- Font scale -----------------------------------------------------------
export function applyFontScale(scale: FontScale) {
  document.documentElement.style.removeProperty('zoom'); // undo the old whole-page zoom approach
  document.documentElement.style.setProperty('--fs', SCALE_VALUE[scale]);
  localStorage.setItem(SCALE_KEY, scale);
}

export function currentScale(): FontScale {
  return (localStorage.getItem(SCALE_KEY) as FontScale) ?? 'default';
}

// --- Boot -----------------------------------------------------------------
export function initTheme() {
  applyAccent(currentAccent());     // always apply so brand accent wins the cascade
  applyColorMode(currentMode());
  applyFontScale(currentScale());

  // Follow OS changes when in system mode
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (currentMode() === 'system') applyColorMode('system');
  });
}
