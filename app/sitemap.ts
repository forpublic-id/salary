import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://salary.forpublic.id'
  const locales = ['id', 'en']
  const pages = ['', '/calculator', '/browse', '/analysis', '/officials', '/about']
  
  const urls: MetadataRoute.Sitemap = []
  
  // Add all page combinations for each locale
  locales.forEach(locale => {
    pages.forEach(page => {
      urls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    })
  })
  
  // Add root redirect
  urls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })
  
  return urls
}