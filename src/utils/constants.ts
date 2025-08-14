// Configuration placeholders - Update these with actual values
export const SITE_CONFIG = {
  SITE_URL: 'https://hit3ch.se', // Update with actual domain
  SITE_NAME: 'HiT3CH',
  GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
  LINKEDIN_PARTNER_ID: 'XXXXXXX', // Replace with actual LinkedIn Partner ID
  META_PIXEL_ID: 'XXXXXXXXXXXXXXXXX', // Replace with actual Meta Pixel ID
  CRISP_WEBSITE_ID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Replace with actual Crisp ID
  FORM_ENDPOINT: 'https://formspree.io/f/XXXXXXXX', // Replace with actual Formspree endpoint
  CALENDLY_URL: 'https://calendly.com/your-username/demo', // Replace with actual Calendly URL
} as const;

export const LANGUAGES = {
  en: 'English',
  sv: 'Svenska',
} as const;

export type Language = keyof typeof LANGUAGES;