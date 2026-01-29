import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

async function getNewsPost(slug: string) {
  const payload = await getPayloadClient()
  const posts = await payload.find({
    collection: 'news-posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })
  return posts.docs[0] || null
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getNewsPost(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} | Festival Plaza News`,
    description: post.excerpt || `Read about ${post.title} at Festival Plaza.`,
  }
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getNewsPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="container-custom">
        <nav className="mb-8">
          <Link href="/news" className="text-sm text-primary-600 hover:text-primary-700">
            &larr; Back to News
          </Link>
        </nav>

        <article className="mx-auto max-w-3xl">
          {post.featuredImage && typeof post.featuredImage === 'object' && (
            <div className="aspect-video overflow-hidden rounded-2xl">
              <Image
                src={post.featuredImage.url || ''}
                alt={post.featuredImage.alt || post.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mt-8">
            {post.publishedAt && (
              <time className="text-sm text-slate-500">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {post.title}
            </h1>

            {post.content && (
              <div className="mt-8">
                <RichText content={post.content} />
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
