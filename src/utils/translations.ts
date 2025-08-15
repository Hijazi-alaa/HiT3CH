import type { Language } from './constants';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      services: 'Services',
      useCases: 'Use Cases & Demo',
      about: 'About',
      contact: 'Contact / Book Demo',
      bookDemo: 'Book a Free Consultation',
    },
    // Home page
    home: {
      headline: 'Put AI to work in your business',
      subheadline: 'We design and integrate AI automations, including voice and chat agents for customer service.',
      cta1: 'Book a Free Consultation',
      cta2: 'See a Live Prototype',
      valueProps: {
        title: 'Why Choose HiT3CH AI?',
        saveTime: {
          title: 'Save Time',
          desc: 'Automate 80% of customer inquiries with intelligent AI agents that work 24/7.',
        },
        boostExperience: {
          title: 'Boost Experience', 
          desc: 'Deliver consistent, professional responses that improve customer satisfaction.',
        },
        seamlessIntegration: {
          title: 'Seamless Integration',
          desc: 'Deploy quickly with minimal setup. Works with your existing systems.',
        },
      },
      industries: {
        title: 'Industries We Serve',
        healthcare: 'Healthcare',
        retail: 'Retail',
        energy: 'Energy',
        publicServices: 'Public Services',
        ecommerce: 'eCommerce',
      },
    },
    // Services
    services: {
      title: 'Our AI Solutions',
      subtitle: 'Choose the perfect AI agent solution for your business needs',
      track1: {
        title: 'AI Receptionist for Small Businesses',
        desc: 'Perfect for small to medium businesses looking to automate basic customer interactions.',
      },
      track2: {
        title: 'Custom AI for Enterprises',
        desc: 'Tailored AI solutions for large organizations with complex workflow requirements.',
      },
      sharedFeatures: {
        title: 'All Solutions Include:',
        voiceChat: 'Voice & Chat Capabilities',
        automation: 'Workflow Automation',
        bilingual: 'Swedish & English Support',
        gdpr: 'GDPR Compliant',
      },
      faq: {
        title: 'Frequently Asked Questions',
        q1: 'How quickly can we implement the AI agent?',
        a1: 'Implementation typically takes 2-4 weeks depending on complexity and integration requirements.',
        q2: 'Is the AI GDPR compliant?',
        a2: 'Yes, all our AI solutions are fully GDPR compliant with data processed within EU boundaries.',
        q3: 'Can the AI handle both Swedish and English?',
        a3: 'Absolutely. Our AI agents are natively bilingual and can seamlessly switch between languages.',
      },
    },
    // Footer
    footer: {
      tagline: 'HiT3CH – AI Solutions for Smarter Customer Service',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      social: 'Follow Us',
    },
    // Common
    common: {
      readMore: 'Read More',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      contactUs: 'Contact Us',
      backToTop: 'Back to Top',
    },
  },
  sv: {
    // Navigation  
    nav: {
      home: 'Hem',
      services: 'Tjänster',
      useCases: 'Användningsfall & Demo',
      about: 'Om Oss',
      contact: 'Kontakt / Boka Demo',
      bookDemo: 'Boka en gratis konsultation',
    },
    // Home page
    home: {
      headline: 'Sätt AI i arbete i ditt företag',
      subheadline: 'Vi designar och integrerar AI-automationer, inklusive röst- och chattagenter för kundservice.',
      cta1: 'Boka en gratis konsultation',
      cta2: 'Se en liveprototyp',
      valueProps: {
        title: 'Varför Välja HiT3CH AI?',
        saveTime: {
          title: 'Spara Tid',
          desc: 'Automatisera 80% av kundförfrågningar med intelligenta AI-agenter som arbetar 24/7.',
        },
        boostExperience: {
          title: 'Förbättra Upplevelsen',
          desc: 'Leverera konsekventa, professionella svar som förbättrar kundnöjdheten.',
        },
        seamlessIntegration: {
          title: 'Smidig Integration',
          desc: 'Implementera snabbt med minimal konfiguration. Fungerar med dina befintliga system.',
        },
      },
      industries: {
        title: 'Branscher Vi Betjänar',
        healthcare: 'Hälsovård',
        retail: 'Detaljhandel',
        energy: 'Energi',
        publicServices: 'Offentlig Sektor',
        ecommerce: 'E-handel',
      },
    },
    // Services
    services: {
      title: 'Våra AI-lösningar',
      subtitle: 'Välj den perfekta AI-agentlösningen för dina affärsbehov',
      track1: {
        title: 'AI-receptionist för Småföretag',
        desc: 'Perfekt för små till medelstora företag som vill automatisera grundläggande kundinteraktioner.',
      },
      track2: {
        title: 'Anpassad AI för Företag',
        desc: 'Skräddarsydda AI-lösningar för stora organisationer med komplexa arbetsflödeskrav.',
      },
      sharedFeatures: {
        title: 'Alla Lösningar Inkluderar:',
        voiceChat: 'Röst- & Chattfunktioner',
        automation: 'Arbetsflödesautomatisering',
        bilingual: 'Svenska & Engelska',
        gdpr: 'GDPR-kompatibel',
      },
      faq: {
        title: 'Vanliga Frågor',
        q1: 'Hur snabbt kan vi implementera AI-agenten?',
        a1: 'Implementation tar vanligtvis 2-4 veckor beroende på komplexitet och integrationskrav.',
        q2: 'Är AI:n GDPR-kompatibel?',
        a2: 'Ja, alla våra AI-lösningar är fullt GDPR-kompatibla med data som behandlas inom EU:s gränser.',
        q3: 'Kan AI:n hantera både svenska och engelska?',
        a3: 'Absolut. Våra AI-agenter är nativt tvåspråkiga och kan sömlöst växla mellan språk.',
      },
    },
    // Footer
    footer: {
      tagline: 'HiT3CH – AI-lösningar för Smartare Kundservice',
      quickLinks: 'Snabblänkar',
      legal: 'Juridisk Information',
      privacy: 'Integritetspolicy',
      social: 'Följ Oss',
    },
    // Common
    common: {
      readMore: 'Läs Mer',
      learnMore: 'Lär Dig Mer', 
      getStarted: 'Kom Igång',
      contactUs: 'Kontakta Oss',
      backToTop: 'Tillbaka Till Toppen',
    },
  },
} as const;

export function getTranslation(lang: Language) {
  return translations[lang];
}