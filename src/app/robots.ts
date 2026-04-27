import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/cms-login', '/investor-login'],
    },
    sitemap: 'https://www.equivestworldwide.com/sitemap.xml',
  }
}
