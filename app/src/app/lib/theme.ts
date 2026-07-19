export interface Accent {
  name: string;
  hex: string;
  rgb: string;
  hover: string;
}

export const ACCENTS: Accent[] = [
  { name: 'Cyan', hex: '#4FD1C5', rgb: '79,209,197', hover: '#3dbdb2' },
  { name: 'Purple', hex: '#A78BFA', rgb: '167,139,250', hover: '#8b6ef5' },
  { name: 'Emerald', hex: '#22C55E', rgb: '34,197,94', hover: '#1ca34e' },
  { name: 'Gold', hex: '#FFB547', rgb: '255,181,71', hover: '#f0a336' },
  { name: 'Blue', hex: '#60A5FA', rgb: '96,165,250', hover: '#4a8ff0' },
  { name: 'Pink', hex: '#F472B6', rgb: '244,114,182', hover: '#e85aa4' },
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
