import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/leasing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  try {
    const payload = await getPayloadClient()

    // Get all tenants
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 1000,
      depth: 0,
    })

    const tenantPages: MetadataRoute.Sitemap = tenants.docs.map((tenant: any) => ({
      url: `${baseUrl}/directory/${tenant.slug}`,
      lastModified: new Date(tenant.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Get all categories
    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
      depth: 0,
    })

    const categoryPages: MetadataRoute.Sitemap = categories.docs.map((category: any) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(category.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Get all events
    const events = await payload.find({
      collection: 'events',
      limit: 1000,
      depth: 0,
    })

    const eventPages: MetadataRoute.Sitemap = events.docs.map((event: any) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Get all news posts
    const newsPosts = await payload.find({
      collection: 'news-posts',
      where: {
        status: { equals: 'published' },
      },
      limit: 1000,
      depth: 0,
    })

    const newsPages: MetadataRoute.Sitemap = newsPosts.docs.map((post: any) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...categoryPages, ...tenantPages, ...eventPages, ...newsPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
