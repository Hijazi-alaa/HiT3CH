// /assets/app.js
import { translations } from './i18n.js';

const $ = (s, r = document) => r.querySelector(s);

// --- i18n ---
function applyLanguage(lang) {
  const dict = translations[lang] || translations.sv;
  document.documentElement.lang = lang;

  // Fill all [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  // Title + meta
  const t = $('title');
  const m = $('meta[name="description"]');
  if (t && dict.meta_title) t.textContent = dict.meta_title;
  if (m && dict.meta_description) m.setAttribute('content', dict.meta_description);

  // Lang toggle labels (header + footer)
  ['lang-toggle', 'lang-toggle-footer'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn && dict.toggle_lang) btn.textContent = dict.toggle_lang;
  });

  localStorage.setItem('lang', lang);
}

export function initLanguage() {
  const saved = localStorage.getItem('lang');
  let initial;

  if (saved) {
    initial = saved;
  } else {
    // Detect browser language once
    const browserLang = navigator.language.startsWith('sv') ? 'sv' : 'en';
    initial = browserLang;
  }

  applyLanguage(initial);

  // Toggle handlers
  ['lang-toggle', 'lang-toggle-footer'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      if (e && e.preventDefault) e.preventDefault();
      const next = document.documentElement.lang === 'sv' ? 'en' : 'sv';
      applyLanguage(next);
    });
  });
}


// --- Modal + Focus trap ---
function setupModal() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-modal-open]');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  const focusables = () =>
    modal.querySelectorAll('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])');

  function trap(e) {
    if (e.key !== 'Tab') return;
    const list = Array.from(focusables());
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  function open() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    const first = focusables()[0];
    if (first) first.focus();
    document.addEventListener('keydown', trap);
  }
  function close() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trap);
  }

  openers.forEach(b => b.addEventListener('click', open));
  document.getElementById('modal-bg')?.addEventListener('click', e => {
    if (e.target.id === 'modal-bg') close();
  });
  closeBtn?.addEventListener('click', close);

  // --- Form submit (Formspree) ---
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // helpers
    const showError = (id, msg) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = msg;
      el.classList.remove('hidden');
    };
    const clearErrors = () => {
      ['err-name', 'err-company', 'err-email', 'err-message', 'form-error'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = ''; el.classList.add('hidden'); }
      });
      [name, company, email].forEach(inp => inp?.setAttribute('aria-invalid', 'false'));
    };

    const name = document.getElementById('name');
    const company = document.getElementById('company');
    const email = document.getElementById('email');
    const submitBtn = document.getElementById('form-submit');

    clearErrors();

    // validation
    let ok = true;
    if (!name.value.trim()) {
      ok = false; showError('err-name', 'Name is required.'); name.setAttribute('aria-invalid', 'true');
    }
    if (!company.value.trim()) {
      ok = false; showError('err-company', 'Company is required.'); company.setAttribute('aria-invalid', 'true');
    }
    // RFC 5322–ish simple check
    const emailVal = email.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailVal) {
      ok = false; showError('err-email', 'Email is required.'); email.setAttribute('aria-invalid', 'true');
    } else if (!emailRe.test(emailVal)) {
      ok = false; showError('err-email', 'Enter a valid email address.'); email.setAttribute('aria-invalid', 'true');
    }

    if (!ok) {
      // focus first invalid
      const firstErr = document.querySelector('[aria-invalid="true"]');
      firstErr?.focus();
      return; // stop send
    }

    // send
    const fd = new FormData(form);
    const FORMSPREE_ID = 'mwpnezzr'; 
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-60', 'cursor-not-allowed');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd
      });
      if (res.ok) {
        form.classList.add('hidden');
        success?.classList.remove('hidden');
        form.reset();
      } else {
        const msg = 'Submit failed. Please try again.';
        const fe = document.getElementById('form-error');
        fe.textContent = msg; fe.classList.remove('hidden');
      }
    } catch {
      const fe = document.getElementById('form-error');
      fe.textContent = 'Network error. Please try again.'; fe.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  });

  // Optional: close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
}

// Smooth scroll for links with data-scroll
function setupSmoothScroll() {
  document.querySelectorAll('[data-scroll]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('data-scroll');
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Single init point
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  setupModal();
  setupSmoothScroll();
});
