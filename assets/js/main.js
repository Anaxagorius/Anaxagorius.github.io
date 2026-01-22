
/* =========================
   Thomas Burchell Portfolio
   main.js
   ========================= */

(function(){
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const yearEl = document.querySelector('[data-year]');
  const copyEmailBtn = document.querySelector('[data-copy-email]');
  const emailEl = document.querySelector('[data-email]');
  const filters = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-project]');
  const revealEls = document.querySelectorAll('.reveal');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  function updateThemeIcon(){
    if (!themeBtn) return;
    const isLight = root.getAttribute('data-theme') === 'light';
    themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeBtn.querySelector('span').textContent = isLight ? '☀️' : '🌙';
  }
  updateThemeIcon();

  if (themeBtn){
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon();
    });
  }

  // Mobile menu
  if (menuBtn && mobileMenu){
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.style.display = expanded ? 'none' : 'block';
    });
  }

  // Copy email
  if (copyEmailBtn && emailEl){
    copyEmailBtn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(emailEl.textContent.trim());
        copyEmailBtn.textContent = 'Copied ✓';
        setTimeout(() => copyEmailBtn.textContent = 'Copy', 1400);
      }catch{
        // fallback
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(emailEl);
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
        copyEmailBtn.textContent = 'Copied ✓';
        setTimeout(() => copyEmailBtn.textContent = 'Copy', 1400);
      }
    });
  }

  // Project filters
  function setPressed(btn){
    filters.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
  }
  function applyFilter(tag){
    projects.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(',').map(s => s.trim());
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  }
  if (filters.length && projects.length){
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-filter');
        setPressed(btn);
        applyFilter(tag);
      });
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => io.observe(el));
})();
``
