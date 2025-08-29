// /assets/app.js
import { translations } from './i18n.js';

const $ = (s, r = document) => r.querySelector(s);

/* ---------------- i18n ---------------- */
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
    if (btn && dict.toggle_lang) {
      const span = btn.querySelector('span');
      if (span) span.textContent = dict.toggle_lang; else btn.textContent = dict.toggle_lang;
    }
  });

  localStorage.setItem('lang', lang);
}

export function initLanguage() {
  const saved = localStorage.getItem('lang');
  const initial = saved ? saved : (navigator.language?.startsWith('sv') ? 'sv' : 'en');
  applyLanguage(initial);

  // Toggle handlers
  ['lang-toggle', 'lang-toggle-footer'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e?.preventDefault?.();
      const next = document.documentElement.lang === 'sv' ? 'en' : 'sv';
      applyLanguage(next);
      document.dispatchEvent(new Event('lang-changed'));
      refreshConsultDefaultsIfOpen();
    });
  });
}

function getLang() {
  return document.documentElement.lang || 'sv';
}

/* -------------- Modal copy control -------------- */
const demoCopy = {
  sv: {
    title: 'Boka demo',
    sub: 'Fyll i dina uppgifter så bokar vi in en demo.',
    messageLabel: 'Vilken typ av AI-lösning vill du se demonstrerad?'
  },
  en: {
    title: 'Book a demo',
    sub: 'Enter your details and we’ll schedule a demo.',
    messageLabel: 'What type of AI solution would you like to see demonstrated?'
  }
};

function setConsultCopyExplicit() {
  const dict = translations[getLang()] || translations.sv;
  const titleEl = document.getElementById('consult-modal-title');
  const subEl = document.querySelector('[data-i18n="consult_modal_sub"]');
  const msgLbl = document.querySelector('label[for="message"]');

  if (titleEl) {
    titleEl.setAttribute('data-i18n', 'consult_modal_title');
    titleEl.textContent = dict.consult_modal_title;
  }
  if (subEl) {
    subEl.setAttribute('data-i18n', 'consult_modal_sub');
    subEl.textContent = dict.consult_modal_sub;
  }
  if (msgLbl) {
    msgLbl.setAttribute('data-i18n', 'form_message');
    msgLbl.textContent = dict.form_message;
  }
}

function setDemoCopyExplicit() {
  const lang = getLang();
  const dc = demoCopy[lang] || demoCopy.sv;
  const titleEl = document.getElementById('consult-modal-title');
  const subEl = document.querySelector('[data-i18n="consult_modal_sub"], .consult-sub-frozen');
  const msgLbl = document.querySelector('label[for="message"]');

  if (titleEl) {
    titleEl.removeAttribute('data-i18n');
    titleEl.textContent = dc.title;
  }
  if (subEl) {
    subEl.removeAttribute('data-i18n');
    subEl.classList.add('consult-sub-frozen');
    subEl.textContent = dc.sub;
  }
  if (msgLbl) {
    msgLbl.removeAttribute('data-i18n');
    msgLbl.textContent = dc.messageLabel;
  }
}

// If user changes language while modal with consult defaults is open, refresh to current lang
function refreshConsultDefaultsIfOpen() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;
  const isOpen = modal.getAttribute('aria-hidden') === 'false';
  if (!isOpen) return;

  const titleEl = document.getElementById('consult-modal-title');
  const subEl = document.querySelector('[data-i18n="consult_modal_sub"]');
  const msgLbl = document.querySelector('label[for="message"][data-i18n="form_message"]');
  if (titleEl || subEl || msgLbl) setConsultCopyExplicit();
}

/* -------------- Mobile menu -------------- */
function setupMobileMenu() {
  const btn = document.getElementById('menu-toggle');
  const panel = document.getElementById('mobile-menu');
  if (!btn || !panel) return;

  const open = () => {
    panel.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', getLang() === 'sv' ? 'Stäng meny' : 'Close menu');
    document.documentElement.style.overflow = 'hidden';
  };
  const close = () => {
    panel.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', getLang() === 'sv' ? 'Öppna meny' : 'Open menu');
    document.documentElement.style.overflow = '';
  };
  const toggle = () => (panel.classList.contains('hidden') ? open() : close());

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });

  panel.querySelectorAll('[data-scroll]').forEach(a => {
    a.addEventListener('click', () => close());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) close();
  });
}

/* -------------- Contact modal -------------- */
function setupModal() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  const openers = document.querySelectorAll('[data-modal-open]');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const modalCard = document.getElementById('modal-card');

  let mode = 'consult'; // 'consult' | 'demo'

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

  function open(e) {
    e?.preventDefault?.();

    // inside #contact => consult, otherwise demo
    const opener = e?.currentTarget || e?.target;
    mode = opener && opener.closest('#contact') ? 'consult' : 'demo';

    // Reset UI
    clearErrors();
    form.classList.remove('hidden');
    success?.classList.add('hidden');

    if (mode === 'demo') setDemoCopyExplicit(); else setConsultCopyExplicit();

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modalCard?.classList.remove('translate-y-2', 'opacity-0');
    const first = focusables()[0]; first?.focus();
    document.addEventListener('keydown', trap);
  }

  function close() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trap);
    setConsultCopyExplicit();
    clearErrors();
  }

  openers.forEach(b => b.addEventListener('click', open));
  document.getElementById('modal-bg')?.addEventListener('click', e => {
    if (e.target.id === 'modal-bg') close();
  });
  closeBtn?.addEventListener('click', close);

  // Validation helpers
  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
  };
  function clearErrors() {
    ['err-name', 'err-company', 'err-email', 'err-message', 'form-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.add('hidden'); }
    });
    ['name', 'company', 'email', 'message'].forEach(id => {
      const inp = document.getElementById(id);
      inp?.setAttribute('aria-invalid', 'false');
    });
  }

  // Submit (Formspree)
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const company = document.getElementById('company');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('form-submit');

    clearErrors();

    let ok = true;
    if (!name.value.trim()) {
      ok = false; showError('err-name', getLang() === 'sv' ? 'Namn krävs.' : 'Name is required.'); name.setAttribute('aria-invalid', 'true');
    }
    if (!company.value.trim()) {
      ok = false; showError('err-company', getLang() === 'sv' ? 'Företag krävs.' : 'Company is required.'); company.setAttribute('aria-invalid', 'true');
    }
    const emailVal = email.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailVal) {
      ok = false; showError('err-email', getLang() === 'sv' ? 'E-post krävs.' : 'Email is required.'); email.setAttribute('aria-invalid', 'true');
    } else if (!emailRe.test(emailVal)) {
      ok = false; showError('err-email', getLang() === 'sv' ? 'Ange en giltig e-postadress.' : 'Enter a valid email address.'); email.setAttribute('aria-invalid', 'true');
    }
    if (!ok) { (document.querySelector('[aria-invalid="true"]'))?.focus(); return; }

    const fd = new FormData(form);
    fd.append('request_type', mode);
    if (!message.value.trim() && mode === 'demo') {
      fd.set('message', getLang() === 'sv' ? 'Intresserad av en demo.' : 'Interested in a demo.');
    }

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
        const lang = getLang();
        const dict = translations[lang] || translations.sv;

        const titleEl = document.getElementById('consult-modal-title');
        const subEl = document.querySelector('.consult-sub-frozen') || document.querySelector('[data-i18n="consult_modal_sub"]');

        if (titleEl) { titleEl.removeAttribute('data-i18n'); titleEl.textContent = dict.consult_success_title || (lang === 'sv' ? 'Tack — din förfrågan är skickad' : 'Thanks — your request was sent'); }
        if (subEl) { subEl.removeAttribute('data-i18n'); subEl.textContent = dict.consult_success_sub || (lang === 'sv' ? 'Vi återkommer inom 1 arbetsdag.' : 'We’ll get back within 1 business day.'); }

        form.classList.add('hidden');
        success?.classList.remove('hidden');
        form.reset();
        document.getElementById('modal-close')?.focus();
      } else {
        const fe = document.getElementById('form-error');
        fe.textContent = getLang() === 'sv' ? 'Kunde inte skicka. Försök igen.' : 'Submit failed. Please try again.';
        fe.classList.remove('hidden');
      }
    } catch {
      const fe = document.getElementById('form-error');
      fe.textContent = getLang() === 'sv' ? 'Nätverksfel. Försök igen.' : 'Network error. Please try again.';
      fe.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', trap);
      setConsultCopyExplicit();
      clearErrors();
    }
  });
}

// Smooth scroll (desktop + mobile nav)
function setupSmoothScroll() {
  const navLinks = Array.from(document.querySelectorAll('header [data-scroll], #mobile-menu [data-scroll]'));
  if (!navLinks.length) return;

  const header = document.querySelector('header');
  const headerH = () => (header?.offsetHeight || 0);

  function setActiveLinkBySelector(sel) {
    navLinks.forEach(a => a.classList.remove('text-cyan-400', 'border-cyan-400'));
    document.querySelectorAll(`header [data-scroll="${sel}"], #mobile-menu [data-scroll="${sel}"]`)
      .forEach(a => a.classList.add('text-cyan-400', 'border-cyan-400'));
  }

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const sel = a.getAttribute('data-scroll');
      const el = document.querySelector(sel);
      if (!el) return;

      setActiveLinkBySelector(sel);

      const targetY = Math.max(0, Math.round(el.getBoundingClientRect().top + window.pageYOffset - (headerH() + 8)));

      window.__manualNav = true;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      if (history.replaceState) history.replaceState(null, '', sel);

      const done = () => {
        window.__manualNav = false;
        window.removeEventListener('scroll', onScrollCheck, { passive: true });
        window.dispatchEvent(new Event('scroll'));
      };
      const onScrollCheck = () => { if (Math.abs(window.pageYOffset - targetY) < 2) done(); };
      window.addEventListener('scroll', onScrollCheck, { passive: true });
      setTimeout(() => { if (window.__manualNav) done(); }, 2000);
    });
  });
}

// Scroll spy (updates BOTH desktop + mobile links)
function setupScrollSpy() {
  const allLinks = () => Array.from(document.querySelectorAll('header [data-scroll], #mobile-menu [data-scroll]'));
  if (!allLinks().length) return;

  // Map "#id" -> [<a>, <a>...] (desktop + mobile)
  const groups = new Map();
  const rebuildGroups = () => {
    groups.clear();
    allLinks().forEach(a => {
      const key = a.getAttribute('data-scroll');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(a);
    });
  };
  rebuildGroups();

  const sections = [
    '#problems-solutions',
    '#why-hit3ch',
    '#process',
    '#faq',
    '#contact'
  ].map(sel => document.querySelector(sel)).filter(Boolean);

  const header = document.querySelector('header');
  const headerH = () => (header?.offsetHeight || 0);

  const clearActive = () => allLinks().forEach(a => a.classList.remove('text-cyan-400', 'border-cyan-400'));
  const setActiveSel = (sel) => {
    clearActive();
    (groups.get(`#${sel}`) || []).forEach(a => a.classList.add('text-cyan-400', 'border-cyan-400'));
  };

  function updateActive() {
    if (window.__manualNav) return;

    if (window.scrollY < Math.max(40, headerH() + 8)) { clearActive(); return; }

    const y = headerH() + 8;
    const docBottom = window.scrollY + window.innerHeight;
    const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const nearBottom = maxScroll - docBottom < 40;

    if (nearBottom) { setActiveSel(sections[sections.length - 1].id); return; }

    let winner = sections[0];
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { winner = s; break; }
      if (Math.abs(r.top - y) < Math.abs(winner.getBoundingClientRect().top - y)) winner = s;
    }
    setActiveSel(winner.id);
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => { updateActive(); ticking = false; });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { rebuildGroups(); onScroll(); });
  document.addEventListener('lang-changed', onScroll);

  // In case mobile menu is injected later
  const obs = new MutationObserver(() => { rebuildGroups(); });
  obs.observe(document.body, { childList: true, subtree: true });

  updateActive();
}


/* -------------- FAQ Accordion (Option 1) -------------- */
/* HTML expectation per item:
  <div class="faq-item">
    <button class="faq-q" data-accordion="faq" aria-expanded="false" aria-controls="faq-a-1" id="faq-q-1">
      <span data-i18n="faq_q1"></span>
      <i class="fa-solid fa-chevron-down ml-2" aria-hidden="true"></i>
    </button>
    <div class="faq-a max-h-0 overflow-hidden transition-[max-height] duration-300"
         id="faq-a-1" role="region" aria-labelledby="faq-q-1">
      <p class="mt-3 text-slate-300" data-i18n="faq_a1"></p>
    </div>
  </div>
*/
function setupFAQAccordion() {
  const buttons = Array.from(document.querySelectorAll('[data-accordion="faq"]'));
  if (!buttons.length) return;

  const panels = new Map(); // btn -> panel
  buttons.forEach(btn => {
    const panel = btn.nextElementSibling;
    if (!(panel instanceof HTMLElement)) return;
    panels.set(btn, panel);

    // collapse initially
    btn.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close all others
      buttons.forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          const p = panels.get(b);
          if (p) p.style.maxHeight = '0px';
        }
      });
      // toggle this one
      btn.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        requestAnimationFrame(() => {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        });
      } else {
        panel.style.maxHeight = '0px';
      }
    });
  });

  // Recompute heights if language changes (text length changes)
  document.addEventListener('lang-changed', () => {
    buttons.forEach(btn => {
      const panel = panels.get(btn);
      if (!panel) return;
      if (btn.getAttribute('aria-expanded') === 'true') {
        panel.style.maxHeight = 'none';
        const h = panel.scrollHeight;
        panel.style.maxHeight = h + 'px';
      } else {
        panel.style.maxHeight = '0px';
      }
    });
  });
}

/* -------------- Cookie banner -------------- */
const cookieCopy = {
  sv: {
    text: 'HiT3CH behandlar endast de personuppgifter som du själv lämnar via vårt kontaktformulär eller e-post. Uppgifterna används enbart för att besvara din förfrågan och sparas i högst 12 månader.',
    ok: 'Okej'
  },
  en: {
    text: 'HiT3CH only processes the personal data you provide via our contact form or email. The data is used solely to respond to your inquiry and is stored for a maximum of 12 months.',
    ok: 'Got it'
  }
};

function setupCookieBanner() {
  const KEY = 'cookie_ack_v1';
  if (localStorage.getItem(KEY) === '1') return;

  let banner;

  function render() {
    const lang = getLang();
    const cc = cookieCopy[lang] || cookieCopy.sv;

    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.className = 'fixed inset-x-0 bottom-4 z-[60] flex justify-center pointer-events-none';
      document.body.appendChild(banner);
    }

    banner.innerHTML = `
      <div class="pointer-events-auto mx-4 md:mx-0 w-full max-w-screen-md
                  rounded-xl border border-slate-700/70 bg-slate-900/95 backdrop-blur
                  shadow-lg p-4 md:p-5 text-slate-200">
        <div class="flex items-start gap-3">
          <i class="fa-solid fa-circle-info mt-0.5" aria-hidden="true"></i>
          <p class="text-sm leading-relaxed flex-1">${cc.text}</p>
          <button id="cookie-ok"
                  class="ml-3 shrink-0 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium
                         border border-slate-600 bg-slate-800/80 text-slate-200
                         hover:border-cyan-400 hover:text-white hover:shadow-[0_0_12px_rgba(34,211,238,0.8)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300
                         transition">
            ${cc.ok}
          </button>
        </div>
      </div>
    `;

    banner.querySelector('#cookie-ok')?.addEventListener('click', () => {
      localStorage.setItem(KEY, '1');
      banner.remove();
    });
  }

  render();

  // Re-render text if language changes (until dismissed)
  document.addEventListener('lang-changed', () => {
    if (!document.getElementById('cookie-banner')) return;
    render();
  });
}

/* -------------- Privacy modal (footer trigger) -------------- */
function setupPrivacyModal() {
  const modal = document.getElementById('privacy-modal');
  const openBtn = document.getElementById('privacy-open');
  const closeBtn = document.getElementById('privacy-close');

  if (!modal || !openBtn || !closeBtn) return;

  function open() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }
  function close() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', (e) => { e.preventDefault(); open(); });
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
}

/* -------------- Init -------------- */
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  setupModal();
  setupSmoothScroll();
  setupScrollSpy();
  setupFAQAccordion();
  setupCookieBanner();
  setupPrivacyModal();
  setupMobileMenu();
});
