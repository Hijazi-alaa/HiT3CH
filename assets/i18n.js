export const translations = {
  sv: {
    meta_title: "HiT3CH – AI-automation för riktiga företag",
    meta_desc: "Vi hjälper svenska bolag att effektivisera kundsupport, marknadsföring och arbetsflöden med AI.",
    nav_solutions: "Lösningar",
    nav_about: "Om oss",
    nav_contact: "Kontakt",
    hero_title: "AI-automation för riktiga företag",
    hero_sub: "Vi automatiserar kundservice, marknadsföring och interna processer så att du kan fokusera på affären.",
    hero_primary: "Boka möte",
    hero_secondary: "Våra lösningar",
    problem_title: "Från problem till lösning",
    problem_card1_title: "Manuella processer",
    problem_card1_text: "Tid och pengar slösas på repetitiva uppgifter.",
    problem_card2_title: "Långsamma svar",
    problem_card2_text: "Kunder väntar för länge på hjälp.",
    problem_card3_title: "Fragmenterad data",
    problem_card3_text: "Information sprids i olika system.",
    solutions_title: "Lösningar",
    solution1_title: "AI Kundsupport",
    solution1_text: "Chatbots och e-post som svarar automatiskt.",
    solution2_title: "AI Marknadsföring",
    solution2_text: "Generera innehåll och kampanjer snabbare.",
    solution3_title: "AI Arbetsflöden",
    solution3_text: "Automatisera interna processer.",
    how_title: "Så funkar det",
    how_step1: "Boka demo",
    how_step2: "Analys",
    how_step3: "Implementering",
    how_step4: "Optimering",
    benefits_title: "Varför HiT3CH",
    benefit1_title: "Snabb start",
    benefit1_text: "Kom igång på veckor.",
    benefit2_title: "Trygg data",
    benefit2_text: "Allt hostas inom EU.",
    benefit3_title: "Skalbar",
    benefit3_text: "Lösningar växer med dig.",
    benefit4_title: "Personlig support",
    benefit4_text: "Vi finns här för dig.",
    trust_gdpr: "GDPR-efterlevnad",
    trust_eu: "EU-hosting",
    trust_support: "Personlig support",
    about_title: "Om HiT3CH",
    about_text: "HiT3CH bygger praktiska AI-lösningar för nordiska företag.",
    final_title: "Redo att börja?",
    final_cta: "Boka möte",
    form_name: "Namn",
    form_company: "Företag",
    form_email: "E-post",
    form_message: "Meddelande",
    form_submit: "Skicka",
    form_success: "Tack! Vi hör av oss snart.",
    footer_rights: "Alla rättigheter förbehållna."
  },
  en: {
    meta_title: "HiT3CH – AI automation for real businesses",
    meta_desc: "We help Nordic companies streamline support, marketing and workflows with AI.",
    nav_solutions: "Solutions",
    nav_about: "About",
    nav_contact: "Contact",
    hero_title: "AI automation for real businesses",
    hero_sub: "We automate support, marketing and internal processes so you can focus on growth.",
    hero_primary: "Book meeting",
    hero_secondary: "Our solutions",
    problem_title: "From problem to solution",
    problem_card1_title: "Manual processes",
    problem_card1_text: "Time and money wasted on repetitive tasks.",
    problem_card2_title: "Slow responses",
    problem_card2_text: "Customers wait too long for help.",
    problem_card3_title: "Fragmented data",
    problem_card3_text: "Information spread across systems.",
    solutions_title: "Solutions",
    solution1_title: "AI Support",
    solution1_text: "Chatbots and email that answer automatically.",
    solution2_title: "AI Marketing",
    solution2_text: "Generate content and campaigns faster.",
    solution3_title: "AI Workflows",
    solution3_text: "Automate internal processes.",
    how_title: "How it works",
    how_step1: "Book demo",
    how_step2: "Analysis",
    how_step3: "Implementation",
    how_step4: "Optimization",
    benefits_title: "Why HiT3CH",
    benefit1_title: "Fast start",
    benefit1_text: "Go live in weeks.",
    benefit2_title: "Secure data",
    benefit2_text: "Everything hosted within the EU.",
    benefit3_title: "Scalable",
    benefit3_text: "Solutions grow with you.",
    benefit4_title: "Personal support",
    benefit4_text: "We are here for you.",
    trust_gdpr: "GDPR compliant",
    trust_eu: "EU hosting",
    trust_support: "Personal support",
    about_title: "About HiT3CH",
    about_text: "HiT3CH builds practical AI solutions for Nordic companies.",
    final_title: "Ready to start?",
    final_cta: "Book meeting",
    form_name: "Name",
    form_company: "Company",
    form_email: "Email",
    form_message: "Message",
    form_submit: "Send",
    form_success: "Thanks! We'll be in touch soon.",
    footer_rights: "All rights reserved."
  }
};

export function setLanguage(lang) {
  const selected = translations[lang] ? lang : 'sv';
  localStorage.setItem('lang', selected);
  document.documentElement.lang = selected;
  const t = translations[selected];
  document.title = t.meta_title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t.meta_desc);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.getElementById('lang-toggle')?.textContent = selected === 'sv' ? 'EN' : 'SV';
  document.getElementById('lang-toggle-footer')?.textContent = selected === 'sv' ? 'EN' : 'SV';
}

export function initLanguage() {
  const stored = localStorage.getItem('lang') || 'sv';
  setLanguage(stored);
}
