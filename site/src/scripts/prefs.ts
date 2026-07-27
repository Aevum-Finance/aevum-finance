/*
 * Theme + accessibility controller — the vanilla-JS analogue of aevum-web's theme /
 * a11y stores. Every preference is a class on <html> (see global.css), persisted to
 * localStorage, and applied pre-paint by the no-FOUC inline script in Base.astro;
 * this module drives the settings menu and keeps the UI in sync. No framework — the
 * whole thing is one small module bundled under `script-src 'self'`.
 */
type Mode = 'light' | 'dark' | 'system';

const A11Y: Record<string, string> = {
  reduceMotion: 'reduce-motion',
  highContrast: 'high-contrast',
  underlineLinks: 'underline-links',
  focusAlways: 'focus-always',
};

const root = document.documentElement;
const mql = window.matchMedia('(prefers-color-scheme: dark)');

function getMode(): Mode {
  return (localStorage.getItem('theme') as Mode) || 'system';
}
function getA11y(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem('a11y') || '{}') || {};
  } catch {
    return {};
  }
}
function applyTheme(mode: Mode) {
  root.classList.toggle('dark', mode === 'dark' || (mode === 'system' && mql.matches));
}
function reflect() {
  const mode = getMode();
  document.querySelectorAll<HTMLElement>('[data-theme]').forEach((el) => {
    el.setAttribute('aria-pressed', String(el.dataset.theme === mode));
  });
  const a = getA11y();
  document.querySelectorAll<HTMLInputElement>('[data-a11y]').forEach((el) => {
    el.checked = !!a[el.dataset.a11y as string];
  });
}

function setMode(mode: Mode) {
  localStorage.setItem('theme', mode);
  applyTheme(mode);
  reflect();
}
function setA11y(key: string, on: boolean) {
  const a = getA11y();
  a[key] = on;
  localStorage.setItem('a11y', JSON.stringify(a));
  root.classList.toggle(A11Y[key], on);
  reflect();
}

// System-theme changes re-resolve only when the user is on "system".
mql.addEventListener('change', () => {
  if (getMode() === 'system') applyTheme('system');
});

// Settings menu open/close.
function initMenu() {
  const btn = document.getElementById('prefs-btn');
  const panel = document.getElementById('prefs-panel');
  if (!btn || !panel) return;
  const close = () => {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.hidden ? open() : close();
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target as Node)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  // NB: no stopPropagation on the panel — it would swallow the delegated [data-theme]
  // click handler below. Outside-click-close already guards with panel.contains().
}

document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-theme]');
  if (t) setMode(t.dataset.theme as Mode);
});
document.addEventListener('change', (e) => {
  const el = e.target as HTMLInputElement;
  if (el.dataset.a11y) setA11y(el.dataset.a11y, el.checked);
});

initMenu();
reflect();
