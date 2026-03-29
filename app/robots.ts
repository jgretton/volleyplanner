import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
          '/plan/',
          '/new/',
          '/test-plan/',
        ],
      },
    ],
    sitemap: 'https://volleyplanner.co.uk/sitemap.xml',
  }
}
