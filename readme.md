# HiT3CH - AI Voice & Chat Agents Website

A modern, bilingual (English/Swedish) marketing website for HiT3CH AI services, built with Astro, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Bilingual Support**: English (`/en`) and Swedish (`/sv`) routes with language toggle
- **Performance Optimized**: Static generation, Core Web Vitals friendly
- **SEO Ready**: Meta tags, Open Graph, JSON-LD structured data, sitemap
- **Search**: Integrated Pagefind for blog and use cases search
- **Analytics**: GDPR-compliant consent management for GA4, LinkedIn, Meta Pixel
- **Forms**: Contact form with Formspree integration
- **Booking**: Calendly integration for demos
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessible**: Semantic HTML, focus states, ARIA labels

## 📁 Project Structure

```
/
├── public/
│   ├── robots.txt
│   └── favicon.*
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ConsentManager.astro
│   │   ├── ContactForm.astro
│   │   ├── LanguageToggle.astro
│   │   └── Search.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── en/
│   │   │   ├── index.astro
│   │   │   ├── services.astro
│   │   │   ├── use-cases.astro
│   │   │   ├── about.astro
│   │   │   ├── blog/
│   │   │   ├── contact.astro
│   │   │   ├── privacy.astro
│   │   │   └── 404.astro
│   │   └── sv/ (Swedish mirrors)
│   ├── utils/
│   │   ├── constants.ts
│   │   └── translations.ts
│   └── content/
│       └── blog/
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## 🛠️ Installation & Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone or initialize in your directory
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321`

### Build for Production
```bash
npm run build
```

This will:
1. Build the static site to `dist/`
2. Generate the search index with Pagefind
3. Create sitemap and optimize assets

## ⚙️ Configuration

### Update Placeholders

Edit `src/utils/constants.ts` and replace the placeholder values:

```typescript
export const SITE_CONFIG = {
  SITE_URL: 'https://yourdomain.com',           // Your actual domain
  GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',           // Google Analytics 4 ID
  LINKEDIN_PARTNER_ID: 'XXXXXXX',              // LinkedIn Insight Tag Partner ID
  META_PIXEL_ID: 'XXXXXXXXXXXXXXXXX',          // Meta (Facebook) Pixel ID
  CRISP_WEBSITE_ID: 'xxxxxxxx-xxxx-...',       // Crisp Chat Website ID
  FORM_ENDPOINT: 'https://formspree.io/f/...',  // Formspree form endpoint
  CALENDLY_URL: 'https://calendly.com/...',    // Calendly booking URL
};
```

### Required External Services

1. **Formspree**: Create account at formspree.io, get form endpoint
2. **Calendly**: Set up booking page, get public URL
3. **Google Analytics**: Create GA4 property, get Measurement ID
4. **LinkedIn Insight Tag**: Get Partner ID from LinkedIn Campaign Manager
5. **Meta Pixel**: Create pixel in Meta Events Manager
6. **Crisp Chat**: Create account, get Website ID

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings > Pages
3. Set source to "GitHub Actions"
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Netlify

1. Connect your Git repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add environment variables in Netlify dashboard if needed
4. Deploy!

### Custom Domain

1. **GitHub Pages**: 
   - Add `CNAME` file to `public/` with your domain
   - Configure DNS with CNAME pointing to `username.github.io`

2. **Netlify**: 
   - Go to Domain settings in Netlify dashboard
   - Add custom domain and follow DNS instructions

## 🔧 Content Management

### Adding Blog Posts

Create MDX files in `src/content/blog/en/` and `src/content/blog/sv/`:

```markdown
---
title: "Your Post Title"
description: "Post description"
date: 2024-01-15
author: "Author Name"
---

Your content here...
```

### Updating Translations

Edit `src/utils/translations.ts` to add new text or modify existing translations.

### Adding Pages

1. Create `.astro` files in both `src/pages/en/` and `src/pages/sv/`
2. Update navigation in `src/utils/translations.ts`
3. Add links in `src/components/Header.astro`

## 🔍 SEO & Analytics

- **Sitemap**: Auto-generated at `/sitemap-index.xml`
- **Robots.txt**: Located at `/robots.txt`
- **Meta tags**: Configured in `BaseLayout.astro`
- **JSON-LD**: Structured data for Organization and Articles
- **Analytics**: GDPR-compliant loading after consent

## 🛡️ Privacy & GDPR

- Consent banner blocks all tracking until user accepts
- Consent preference stored in localStorage
- Privacy policy template included
- All analytics load only after explicit consent

## 📱 Performance

- Static site generation
- Minimal JavaScript
- Optimized images and fonts
- Core Web Vitals friendly
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the build: `npm run build`
5. Submit a pull request

## 📄 License

This project is proprietary software for HiT3CH. All rights reserved.

---

**Next Steps After Setup:**
1. Update all placeholder values in `constants.ts`
2. Replace demo content with real business information  
3. Set up external services (Formspree, Calendly, etc.)
4. Configure domain and SSL certificate
5. Test all forms and integrations
6. Monitor Core Web Vitals and performance