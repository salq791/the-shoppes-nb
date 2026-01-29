import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

async function getNewsPosts() {
  const payload = await getPayloadClient()
  const posts = await payload.find({
    collection: 'news-posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  })
  return posts.docs
}

export default async function NewsPage() {
  const posts = await getNewsPosts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-news-signage.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display mb-4">News</h1>
            <p className="text-sm tracking-[0.5em] uppercase font-light">Latest Updates</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-gold">Home</Link>
          {' / '}
          <span className="text-gray-900 dark:text-white">News</span>
        </div>
      </div>

      {/* News Grid */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <span className="section-subheading">Stay Informed</span>
            <h2 className="section-heading mt-2">Latest News & Updates</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post: any) => (
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
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons text-4xl text-gray-300">article</span>
                      </div>
                    )}
                  </div>
                  <div className="py-4">
                    {post.publishedAt && (
                      <time className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                    <h3 className="font-display text-lg mt-2 group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-gold uppercase tracking-wider">
                      Read More
                      <span className="material-icons text-sm transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <span className="material-icons text-4xl text-gray-300 mb-4">article</span>
                <p className="text-gray-500">No news posts yet</p>
                <p className="text-xs text-gray-400 mt-1">Check back soon for updates</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
