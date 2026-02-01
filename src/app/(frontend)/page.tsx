import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { HeroSection } from '@/components/HeroSection'
import { NewsletterForm } from '@/components/NewsletterForm'

export const revalidate = 60

async function getCategories() {
  const payload = await getPayloadClient()
  const categories = await payload.find({
    collection: 'categories',
    sort: 'order',
    limit: 10,
  })

  const categoriesWithCounts = await Promise.all(
    categories.docs.map(async (cat: any) => {
      const tenants = await payload.find({
        collection: 'tenants',
        where: {
          category: { equals: cat.id },
          status: { not_equals: 'closed' },
        },
        limit: 0,
      })
      return {
        ...cat,
        tenantCount: tenants.totalDocs,
      }
    })
  )

  return categoriesWithCounts
}

async function getFeaturedTenants() {
  const payload = await getPayloadClient()
  const tenants = await payload.find({
    collection: 'tenants',
    where: {
      featured: { equals: true },
      status: { equals: 'active' },
    },
    limit: 6,
    depth: 1,
  })
  return tenants.docs
}

async function getUpcomingEvents() {
  const payload = await getPayloadClient()
  const events = await payload.find({
    collection: 'events',
    where: {
      status: { equals: 'upcoming' },
    },
    sort: 'date',
    limit: 3,
    depth: 1,
  })
  return events.docs
}

async function getLatestNews() {
  const payload = await getPayloadClient()
  const news = await payload.find({
    collection: 'news-posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 1,
  })
  return news.docs
}

export default async function HomePage() {
  const [categories, featuredTenants, upcomingEvents, latestNews] = await Promise.all([
    getCategories(),
    getFeaturedTenants(),
    getUpcomingEvents(),
    getLatestNews(),
  ])

  return (
    <div>
      {/* Hero Carousel */}
      <HeroSection />

      {/* Category Blocks */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-background-dark">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-[0.4em] font-semibold text-[#a1413b]">Explore Our Boutiques</span>
            <h2 className="section-heading mt-2">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-zinc-700 group-hover:border-[#a1413b] group-hover:-translate-y-1">
                  <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900">
                    {category.image && typeof category.image === 'object' ? (
                      <Image
                        src={category.image.url || ''}
                        alt={category.name}
                        width={120}
                        height={120}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <span className="material-icons text-6xl text-[#a1413b]/70 group-hover:text-[#a1413b] group-hover:scale-110 transition-all duration-300">
                        {category.slug === 'apparel' ? 'checkroom' :
                         category.slug === 'eat-drink' ? 'restaurant' :
                         category.slug === 'specialty' ? 'diamond' :
                         category.slug === 'for-kids' ? 'child_care' :
                         'store'}
                      </span>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-white group-hover:text-[#a1413b] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 font-medium">{category.tenantCount} Stores</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tenants */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="section-subheading">Curated for You</span>
              <h2 className="section-heading mt-2">Featured Boutiques</h2>
            </div>
            <Link href="/directory" className="btn-outline hidden sm:flex">
              View All
              <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTenants.length > 0 ? (
              featuredTenants.map((tenant: any) => (
                <Link
                  key={tenant.id}
                  href={`/directory/${tenant.slug}`}
                  className="group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 relative">
                    {tenant.logo && typeof tenant.logo === 'object' ? (
                      <Image
                        src={tenant.logo.url || ''}
                        alt={tenant.logo.alt || tenant.name}
                        fill
                        className="object-contain p-8"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-display text-gray-500">
                          {tenant.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    {tenant.status === 'coming-soon' && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-[#a1413b] text-white text-[10px] font-semibold uppercase tracking-wider">
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div className="py-4">
                    <h3 className="font-display text-lg group-hover:text-[#a1413b] transition-colors">
                      {tenant.name}
                    </h3>
                    {tenant.category && typeof tenant.category === 'object' && (
                      <p className="text-xs text-gray-600 uppercase tracking-wider mt-1">
                        {tenant.category.name}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <span className="material-icons text-4xl text-gray-500 mb-4">storefront</span>
                <p className="text-gray-600">Featured boutiques coming soon</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/directory" className="btn-outline">
              View All Boutiques
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events - Only show if there are events */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="section-subheading">Mark Your Calendar</span>
                <h2 className="section-heading mt-2">Upcoming Events</h2>
              </div>
              <Link href="/events" className="btn-outline hidden sm:flex">
                View All
                <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event: any) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
                    {event.image && typeof event.image === 'object' ? (
                      <Image
                        src={event.image.url || ''}
                        alt={event.image.alt || event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons text-4xl text-gray-500">event</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white px-3 py-2 text-center">
                        <span className="block text-2xl font-bold text-[#a1413b]">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-4">
                    <h3 className="font-display text-lg group-hover:text-[#a1413b] transition-colors">
                      {event.title}
                    </h3>
                    {event.startTime && (
                      <p className="text-xs text-gray-600 mt-1">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News - Only show if there are news posts */}
      {latestNews.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="section-subheading">Stay Informed</span>
                <h2 className="section-heading mt-2">Latest News</h2>
              </div>
              <Link href="/news" className="btn-outline hidden sm:flex">
                View All
                <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
                    {post.featuredImage && typeof post.featuredImage === 'object' ? (
                      <Image
                        src={post.featuredImage.url || ''}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons text-4xl text-gray-500">article</span>
                      </div>
                    )}
                  </div>
                  <div className="py-4">
                    {post.publishedAt && (
                      <time className="text-[10px] text-gray-600 uppercase tracking-widest">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                    <h3 className="font-display text-lg mt-2 group-hover:text-[#a1413b] transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[#a1413b] uppercase tracking-wider">
                      Read More
                      <span className="material-icons text-sm transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-[#c9625c]">Stay Connected</span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4">
            Join the Shoppes Insider
          </h2>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Subscribe to our newsletter for exclusive deals, event announcements, and the latest updates from The Shoppes at North Brunswick.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <NewsletterForm variant="dark" />
          </div>
          <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  )
}
