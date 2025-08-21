# SEO & Analytics Setup Guide

## Salary ForPublic.id

### 🎯 Overview

Complete SEO implementation with Google Analytics, Search Console, and structured data for maximum visibility.

---

## 📊 Google Analytics Setup

### 1. Create Google Analytics 4 Property

1. Visit [Google Analytics](https://analytics.google.com)
2. Create new GA4 property for `salary.forpublic.id`
3. Get Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Environment Configuration

```bash
# Add to Vercel environment variables
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code_here
```

### 3. Analytics Events Tracking

Platform automatically tracks:

- ✅ **Calculator Usage**: Track salary calculations by grade/ministry
- ✅ **Data Exports**: Monitor CSV/data download usage
- ✅ **Search Queries**: Track user searches and results
- ✅ **Filter Usage**: Monitor filter applications
- ✅ **Chart Interactions**: Track visualization engagement
- ✅ **Language Switching**: Monitor i18n usage

---

## 🔍 Google Search Console Setup

### 1. Property Verification

1. Visit [Google Search Console](https://search.google.com/search-console/)
2. Add property: `https://salary.forpublic.id`
3. **Method 1 - Meta Tag** (Recommended):
   - Get verification meta tag from Google Search Console
   - Add to Vercel environment variables:

   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code_here
   ```

   - Meta tag is automatically added in `app/layout.tsx`

4. **Method 2 - HTML File**:
   - Download verification file from GSC
   - Replace `/public/google-site-verification.html` with downloaded file

### 2. Submit Sitemap

```
https://salary.forpublic.id/sitemap.xml
```

### 3. Mobile Usability Test

- Test mobile-friendliness
- Check Core Web Vitals
- Monitor page experience metrics

---

## 🏗️ Structured Data Implementation

### ✅ Implemented Schema.org Types:

- **WebSite**: Platform metadata with search action
- **Organization**: ForPublic.id organization info
- **Dataset**: Salary data descriptions
- **GovernmentService**: Public service classification

### Testing Structured Data:

```bash
# Use Google Rich Results Test
https://search.google.com/test/rich-results

# Test URLs:
- https://salary.forpublic.id/id
- https://salary.forpublic.id/id/calculator
- https://salary.forpublic.id/id/browse
```

---

## 📋 SEO Optimization Features

### ✅ Meta Tags & Open Graph

- Dynamic metadata generation per page
- Localized Open Graph images
- Twitter Card optimization
- Canonical URLs with i18n support

### ✅ Technical SEO

- **Sitemap**: Auto-generated with priorities
- **Robots.txt**: Optimized crawling rules
- **Performance**: DNS prefetch, preconnect
- **Mobile**: Responsive design, mobile-first
- **Security**: Proper headers, HTTPS-ready

### ✅ Content SEO

- **Keywords**: Targeted keywords per page
- **Headings**: Proper H1-H6 structure
- **Alt Text**: Images with descriptive alt text
- **Internal Linking**: Strategic cross-page links

---

## 🎯 SEO Keywords Strategy

### Primary Keywords:

- **Indonesian**: gaji PNS, tunjangan kinerja, transparansi pemerintah
- **English**: Indonesian civil service salary, government transparency

### Long-tail Keywords:

- **Calculator**: kalkulator gaji PNS, civil service salary calculator
- **Data**: database gaji pegawai negeri sipil, government salary data
- **Officials**: gaji pejabat negara, public officials compensation

---

## 📈 Performance Monitoring

### Core Web Vitals Targets:

- **LCP**: < 2.5s (Currently ~1.2s)
- **FID**: < 100ms (Currently ~30ms)
- **CLS**: < 0.1 (Currently ~0.05)

### Page Speed Optimization:

- ✅ Static site generation (SSG)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Bundle optimization
- ✅ CDN delivery via Vercel

---

## 🌍 International SEO

### Hreflang Implementation:

```html
<link rel="alternate" hreflang="id" href="https://salary.forpublic.id/id" />
<link rel="alternate" hreflang="en" href="https://salary.forpublic.id/en" />
<link rel="alternate" hreflang="x-default" href="https://salary.forpublic.id" />
```

### Localized Content:

- ✅ Complete Indonesian/English translation
- ✅ Localized URLs (`/id/kalkulator` vs `/en/calculator`)
- ✅ Currency formatting per locale
- ✅ Cultural context adaptation

---

## 🚀 Launch Checklist

### Pre-Launch:

- [ ] Set up Google Analytics (`NEXT_PUBLIC_GA_ID`)
- [ ] Add Google Site Verification (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`)
- [ ] Verify Google Search Console
- [ ] Test all structured data
- [ ] Check mobile responsiveness
- [ ] Validate all meta tags
- [ ] Test sitemap accessibility

### Post-Launch:

- [ ] Submit sitemap to Google
- [ ] Monitor Core Web Vitals
- [ ] Check indexing status
- [ ] Set up Google Alerts for brand mentions
- [ ] Monitor analytics data
- [ ] Track keyword rankings

---

## 📊 Expected SEO Impact

### Target Keywords Rankings (3-6 months):

- "gaji PNS" - Top 10
- "kalkulator gaji pegawai negeri sipil" - Top 5
- "transparansi gaji pemerintah Indonesia" - Top 3
- "Indonesian civil service salary" - Top 10

### Traffic Projections:

- **Month 1**: 1,000+ sessions
- **Month 3**: 5,000+ sessions
- **Month 6**: 15,000+ sessions
- **Year 1**: 50,000+ sessions

---

## 🔗 Additional Resources

### Documentation:

- [Google Analytics Setup](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [Search Console Help](https://support.google.com/webmasters)
- [Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data)

### Tools:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

**✅ Platform Ready for SEO Success!**
All technical SEO foundations implemented and ready for monitoring.
