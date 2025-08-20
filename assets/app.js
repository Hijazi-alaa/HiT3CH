import { initLanguage, setLanguage } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();

  // Smooth scroll to solutions
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute('data-scroll'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Language toggles
  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.lang === 'sv' ? 'en' : 'sv';
    setLanguage(next);
  });
  document.getElementById('lang-toggle-footer')?.addEventListener('click', () => {
    const next = document.documentElement.lang === 'sv' ? 'en' : 'sv';
    setLanguage(next);
  });

  // Modal logic
  const modal = document.getElementById('contact-modal');
  const openButtons = document.querySelectorAll('[data-modal-open]');
  const closeButton = document.getElementById('modal-close');
  const modalBg = document.getElementById('modal-bg');
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  function openModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    const focusable = modal.querySelector('input, textarea, button');
    focusable?.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  closeButton?.addEventListener('click', closeModal);
  modalBg?.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Focus trap
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('input, textarea, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Form submit
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get('name') || !data.get('email')) {
      alert('Name and email required');
      return;
    }
    try {
      const res = await fetch('https://formspree.io/f/your-id', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        form.classList.add('hidden');
        success.classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
    }
  });
});
