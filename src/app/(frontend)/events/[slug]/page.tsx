import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string) {
  const payload = await getPayloadClient()
  const events = await payload.find({
    collection: 'events',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })
  return events.docs[0] || null
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Not Found' }
  return {
    title: `${event.title} | Festival Plaza Events`,
    description: `Join us for ${event.title} at Festival Plaza.`,
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="container-custom">
        <nav className="mb-8">
          <Link href="/events" className="text-sm text-primary-600 hover:text-primary-700">
            &larr; Back to Events
          </Link>
        </nav>

        <article className="mx-auto max-w-3xl">
          {event.image && typeof event.image === 'object' && (
            <div className="aspect-video overflow-hidden rounded-2xl">
              <Image
                src={event.image.url || ''}
                alt={event.image.alt || event.title}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-4">
              <time className="text-sm font-medium text-primary-600">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              {event.status === 'cancelled' && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                  Cancelled
                </span>
              )}
              {event.status === 'past' && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                  Past Event
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {event.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
              {event.startTime && (
                <div>
                  <span className="font-medium">Time:</span>{' '}
                  {event.startTime}
                  {event.endTime && ` - ${event.endTime}`}
                </div>
              )}
              {event.location && (
                <div>
                  <span className="font-medium">Location:</span> {event.location}
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-8">
                <RichText content={event.description} />
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
