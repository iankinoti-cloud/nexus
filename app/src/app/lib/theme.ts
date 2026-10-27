export interface Accent {
  name: string;
  hex: string;
  rgb: string;
  hover: string;
}

export const ACCENTS: Accent[] = [
  { name: 'Electric', hex: '#6366F1', rgb: '99, 102, 241',  hover: '#4F52D9' },
  { name: 'Hot Pink', hex: '#EC4899', rgb: '236, 72, 153',  hover: '#DB2777' },
  { name: 'Cyber',    hex: '#06B6D4', rgb: '6, 182, 212',   hover: '#0891B2' },
  { name: 'Volt',     hex: '#84CC16', rgb: '132, 204, 22',  hover: '#65A30D' },
  { name: 'Blaze',    hex: '#F97316', rgb: '249, 115, 22',  hover: '#EA6900' },
  { name: 'Plasma',   hex: '#A855F7', rgb: '168, 85, 247',  hover: '#9333EA' },
  { name: 'Scarlet',  hex: '#EF4444', rgb: '239, 68, 68',   hover: '#DC2626' },
  { name: 'Emerald',  hex: '#10B981', rgb: '16, 185, 129',  hover: '#059669' },
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

// Every visit starts in light mode; a choice made in Settings lasts for the
// current browser session only (sessionStorage), so the next visit is light again.
export function applyColorMode(mode: ColorMode) {
  const resolved = resolveMode(mode);
  if (resolved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try { sessionStorage.setItem(MODE_KEY, mode); } catch { /* storage blocked — mode still applied */ }
}

export function currentMode(): ColorMode {
  try {
    return (sessionStorage.getItem(MODE_KEY) as ColorMode) ?? 'light';
  } catch {
    return 'light';
  }
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
  try { localStorage.removeItem(MODE_KEY); } catch { /* ignore */ } // drop the old persistent choice
  applyAccent(currentAccent());     // always apply so brand accent wins the cascade
  applyColorMode(currentMode());
  applyFontScale(currentScale());

  // Follow OS changes when in system mode
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (currentMode() === 'system') applyColorMode('system');
  });
}
