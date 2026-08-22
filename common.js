// Language switcher
let currentLang = localStorage.getItem('lang') || 'en';
const translations = {
  en: { siteName:'TextTools', nav_home:'Home', nav_about:'About', nav_contact:'Contact', nav_privacy:'Privacy', nav_terms:'Terms', ad_label:'Advertisement', footer_rights:'All rights reserved' },
  zh: { siteName:'TextTools', nav_home:'首页', nav_about:'关于', nav_contact:'联系', nav_privacy:'隐私', nav_terms:'条款', ad_label:'广告', footer_rights:'版权所有' }
};
function updateLang() {
  const t = translations[currentLang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.getAttribute('data-i18n-href');
    if (t[key]) el.href = t[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}
function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  updateLang();
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied!')).catch(() => {});
}
function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:12px 24px;border-radius:8px;font-size:0.9em;z-index:9999;opacity:0;transition:opacity 0.3s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2000);
}
document.addEventListener('DOMContentLoaded', () => {
  updateLang();
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLang(btn.dataset.lang));
  });
});
