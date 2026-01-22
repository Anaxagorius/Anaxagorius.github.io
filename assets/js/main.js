/* =====================================
   main.js — navigation, theme, filters
   ===================================== */

(() => {
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const yearEl = document.querySelector('[data-year]');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Active nav (works for desktop + mobile)
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  // Theme (persist)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  function updateThemeIcon(){
    if (!themeBtn) return;
    const isLight = root.getAttribute('data-theme') === 'light';
    const icon = themeBtn.querySelector('[data-theme-icon]');
    const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    themeBtn.setAttribute('aria-label', label);
    if (icon) icon.textContent = isLight ? '☀️' : '🌙';
  }
  updateThemeIcon();

  themeBtn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
  });

  // Mobile menu
  menuBtn?.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    if (mobileMenu) mobileMenu.style.display = expanded ? 'none' : 'block';
  });

  // Copy email
  const copyEmailBtn = document.querySelector('[data-copy-email]');
  const emailEl = document.querySelector('[data-email]');
  copyEmailBtn?.addEventListener('click', async () => {
    if (!emailEl) return;
    const txt = emailEl.textContent.trim();
    try{
      await navigator.clipboard.writeText(txt);
    }catch{
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(emailEl);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
    }
    copyEmailBtn.textContent = 'Copied ✓';
    setTimeout(() => copyEmailBtn.textContent = 'Copy', 1400);
  });

  // Project filters
  const filters = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-project]');
  function setPressed(btn){
    filters.forEach(b => b.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
  }
  function applyFilter(tag){
    projects.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(',').map(s => s.trim());
      const show = tag === 'all' || tags.includes(tag);
      card.hidden = !show;
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

  // Contact mailto builder (no server required)
  const mailtoForm = document.querySelector('[data-mailto-form]');
  mailtoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const company = (document.getElementById('company')?.value || '').trim();
    const msg = (document.getElementById('msg')?.value || '').trim();
    const subject = encodeURIComponent('Portfolio Inquiry');
    const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\n\nMessage:\n${msg}\n`);
    location.href = `mailto:tbburchell@gmail.com?subject=${subject}&body=${body}`;
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
})();
