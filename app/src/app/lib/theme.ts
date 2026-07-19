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

const STORAGE_KEY = 'nexus-accent';

export function applyAccent(accent: Accent) {
  const root = document.documentElement.style;
  root.setProperty('--accent', accent.hex);
  root.setProperty('--accent-rgb', accent.rgb);
  root.setProperty('--accent-hover', accent.hover);
  localStorage.setItem(STORAGE_KEY, accent.name);
}

export function currentAccent(): Accent {
  const saved = localStorage.getItem(STORAGE_KEY);
  return ACCENTS.find(a => a.name === saved) ?? ACCENTS[0];
}

export function initAccent() {
  const accent = currentAccent();
  if (accent !== ACCENTS[0]) applyAccent(accent);
}
