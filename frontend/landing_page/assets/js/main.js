// Theme handling
(function() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const icon = btn?.querySelector('.theme-icon');
  const text = btn?.querySelector('.theme-text');

  const getSystemPref = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const getStored = () => localStorage.getItem('theme') || 'auto';

  function applyTheme(mode) {
    const current = mode === 'auto' ? getSystemPref() : mode;
    root.setAttribute('data-theme', current === 'dark' ? 'dark' : 'light');
    if (btn) {
      btn.setAttribute('aria-pressed', current === 'dark');
      if (icon) icon.textContent = current === 'dark' ? '🌙' : '🌞';
      if (text) text.textContent = current === 'dark' ? 'Dark' : 'Light';
    }
  }

  function setTheme(mode) {
    localStorage.setItem('theme', mode);
    root.classList.add('theme-transition');
    applyTheme(mode);
    window.setTimeout(() => root.classList.remove('theme-transition'), 250);
  }

  // Initialize
  const stored = getStored();
  applyTheme(stored);

  // Toggle between dark and light (ignore auto once user toggles)
  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  // Update on system change if user has 'auto'
  if (stored === 'auto' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme('auto'));
  }

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();