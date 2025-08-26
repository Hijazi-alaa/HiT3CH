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
    if (btn && dict.toggle_lang) btn.querySelector('span') ? (btn.querySelector('span').textContent = dict.toggle_lang) : (btn.textContent = dict.toggle_lang);
  });

  localStorage.setItem('lang', lang);
}

export function initLanguage() {
  const saved = localStorage.getItem('lang');
  const initial = saved ? saved : (navigator.language.startsWith('sv') ? 'sv' : 'en');
  applyLanguage(initial);

  // Toggle handlers
  ['lang-toggle', 'lang-toggle-footer'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      if (e && e.preventDefault) e.preventDefault();
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

// --- Modal copy control ---
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

  // restore data-i18n bindings
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

  // freeze text so language toggle does not override while open
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

  // Only refresh if elements still have consult data-i18n attributes
  const titleEl = document.getElementById('consult-modal-title');
  const subEl = document.querySelector('[data-i18n="consult_modal_sub"]');
  const msgLbl = document.querySelector('label[for="message"][data-i18n="form_message"]');
  if (titleEl || subEl || msgLbl) setConsultCopyExplicit();
}

// --- Modal + Focus trap + Submit ---
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
    if (e && e.preventDefault) e.preventDefault();

    // Determine mode by opener location: inside #contact => consult, otherwise demo
    const opener = e?.currentTarget || e?.target;
    mode = opener && opener.closest('#contact') ? 'consult' : 'demo';

    // Reset UI
    clearErrors();
    form.classList.remove('hidden');
    success?.classList.add('hidden');

    // Set copy by mode
    if (mode === 'demo') setDemoCopyExplicit();
    else setConsultCopyExplicit();

    // Open modal
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modalCard?.classList.remove('translate-y-2', 'opacity-0');
    const first = focusables()[0];
    if (first) first.focus();
    document.addEventListener('keydown', trap);
  }

  function close() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trap);

    // Restore consult defaults for next open
    setConsultCopyExplicit();
    clearErrors();
  }

  openers.forEach(b => b.addEventListener('click', open));
  document.getElementById('modal-bg')?.addEventListener('click', e => {
    if (e.target.id === 'modal-bg') close();
  });
  closeBtn?.addEventListener('click', close);

  // --- Validation helpers ---
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

  // --- Form submit (Formspree) ---
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const company = document.getElementById('company');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('form-submit');

    clearErrors();

    // validation
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

    // optional: include mode in payload
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

        // Success copy (generic)
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

  // Optional: close on Escape and simple enter animation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
}

// Smooth scroll + header-aware + precise manual mode
function setupSmoothScroll() {
  const navLinks = Array.from(document.querySelectorAll('header [data-scroll]'));
  if (!navLinks.length) return;

  const header = document.querySelector('header');
  const headerH = () => (header?.offsetHeight || 0);

  function setActiveLinkBySelector(sel) {
    navLinks.forEach(a => a.classList.remove('text-cyan-400', 'border-cyan-400'));
    const hit = navLinks.find(a => a.getAttribute('data-scroll') === sel);
    if (hit) hit.classList.add('text-cyan-400', 'border-cyan-400');
  }

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const sel = a.getAttribute('data-scroll');
      const el = document.querySelector(sel);
      if (!el) return;

      // underline immediately
      setActiveLinkBySelector(sel);

      // compute target so the section ends just under the header
      const targetY = Math.max(
        0,
        Math.round(el.getBoundingClientRect().top + window.pageYOffset - (headerH() + 8))
      );

      // enter manual mode until we actually arrive
      window.__manualNav = true;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      if (history.replaceState) history.replaceState(null, '', sel);

      // watch scroll until we're “close enough”, then release manual mode
      const done = () => {
        window.__manualNav = false;
        window.removeEventListener('scroll', onScrollCheck, { passive: true });
        // nudge scroll-spy to recompute immediately
        window.dispatchEvent(new Event('scroll'));
      };
      const onScrollCheck = () => {
        if (Math.abs(window.pageYOffset - targetY) < 2) done();
      };
      window.addEventListener('scroll', onScrollCheck, { passive: true });

      // safety: if the browser stops early, release after 2s
      setTimeout(() => { if (window.__manualNav) done(); }, 2000);
    });
  });
}



// ---- Active nav on scroll (robust) (replace your current setupScrollSpy)
function setupScrollSpy() {
  const links = Array.from(document.querySelectorAll('header [data-scroll]'));
  if (!links.length) return;

  const map = new Map(); // "#id" -> <a>
  links.forEach(a => map.set(a.getAttribute('data-scroll'), a));

  const sections = [
    '#problems-solutions',
    '#why-hit3ch',
    '#process',
    '#contact'
  ].map(sel => document.querySelector(sel)).filter(Boolean);

  const header = document.querySelector('header');
  const headerH = () => (header?.offsetHeight || 0);

  function updateActive() {
    if (window.__manualNav) return;

    if (window.scrollY < Math.max(40, headerH() + 8)) {
      clearActive();
      return;
    }

    const y = headerH() + 12;
  }
  const clearActive = () => links.forEach(a => a.classList.remove('text-cyan-400', 'border-cyan-400'));
  const setActiveId = (id) => {
    clearActive();
    const link = map.get(`#${id}`);
    if (link) link.classList.add('text-cyan-400', 'border-cyan-400');
  };

  function updateActive() {
    // don’t fight user click while smooth-scrolling
    if (window.__manualNav) return;

    // show nothing while we're still on the hero/top
    if (window.scrollY < Math.max(40, headerH() + 8)) { clearActive(); return; }

    const y = headerH() + 8; // probe line below fixed header
    const docBottom = window.scrollY + window.innerHeight;
    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const nearBottom = maxScroll - docBottom < 40;

    if (nearBottom) { setActiveId(sections[sections.length - 1].id); return; }

    let winner = sections[0];
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { winner = s; break; }
      if (Math.abs(r.top - y) < Math.abs(winner.getBoundingClientRect().top - y)) winner = s;
    }
    setActiveId(winner.id);
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => { updateActive(); ticking = false; });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  document.addEventListener('lang-changed', onScroll);

  // initial (will clear since we’re at the top)
  updateActive();
}


// Single init point
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  setupModal();
  setupSmoothScroll();
  setupScrollSpy();
});
