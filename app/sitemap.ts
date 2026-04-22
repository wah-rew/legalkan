import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.legal-kan.com'
  const now = new Date()

  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/kur`, priority: 0.9 },
    { url: `${baseUrl}/nib-guide`, priority: 0.9 },
    { url: `${baseUrl}/blog`, priority: 0.9 },
    { url: `${baseUrl}/buat`, priority: 0.8 },
    { url: `${baseUrl}/buat/hutang-piutang`, priority: 0.8 },
    { url: `${baseUrl}/buat/freelancer`, priority: 0.8 },
    { url: `${baseUrl}/buat/konsinyasi`, priority: 0.8 },
    { url: `${baseUrl}/buat/bagi-hasil`, priority: 0.8 },
    { url: `${baseUrl}/buat/sewa-kendaraan`, priority: 0.8 },
    { url: `${baseUrl}/buat/jual-beli`, priority: 0.8 },
    { url: `${baseUrl}/buat/event-organizer`, priority: 0.8 },
    { url: `${baseUrl}/buat/nda`, priority: 0.8 },
    { url: `${baseUrl}/kur/wizard`, priority: 0.7 },
    { url: `${baseUrl}/hubungi`, priority: 0.6 },
    { url: `${baseUrl}/syarat-ketentuan`, priority: 0.4 },
    { url: `${baseUrl}/kebijakan-privasi`, priority: 0.4 },
  ]

  const blogPages = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    priority: 0.8,
    lastModified: new Date(post.date),
  }))

  return [
    ...staticPages.map(page => ({
      url: page.url,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: page.priority,
    })),
    ...blogPages.map(page => ({
      url: page.url,
      lastModified: page.lastModified,
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    })),
  ]
}
