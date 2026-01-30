import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

async function getEvents() {
  const payload = await getPayloadClient()
  const events = await payload.find({
    collection: 'events',
    sort: 'date',
    limit: 50,
    depth: 1,
  })
  return events.docs
}

export default async function EventsPage() {
  const events = await getEvents()

  const upcomingEvents = events.filter((e: any) => e.status === 'upcoming')
  const pastEvents = events.filter((e: any) => e.status === 'past')

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white bg-black/50 backdrop-blur-sm px-12 py-8 rounded-full">
            <h1 className="text-5xl md:text-6xl font-display mb-2">Events</h1>
            <p className="text-sm tracking-[0.5em] uppercase font-light">Join the Experience</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-[#a1413b]">Home</Link>
          {' / '}
          <span className="text-gray-900 dark:text-white">Events</span>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <span className="section-subheading">Mark Your Calendar</span>
            <h2 className="section-heading mt-2">Upcoming Events</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: any) => (
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
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons text-4xl text-gray-300">event</span>
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
                    {event.featured && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-[#a1413b] text-white text-[10px] font-semibold uppercase tracking-wider">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="py-4">
                    <h3 className="font-display text-lg group-hover:text-[#a1413b] transition-colors">
                      {event.title}
                    </h3>
                    {event.startTime && (
                      <p className="text-xs text-gray-500 mt-1">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <span className="material-icons text-xs">location_on</span>
                        {event.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <span className="material-icons text-4xl text-gray-300 mb-4">event</span>
                <p className="text-gray-500">No upcoming events at this time</p>
                <p className="text-xs text-gray-400 mt-1">Check back soon for exciting happenings</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-12">
              <span className="section-subheading">Looking Back</span>
              <h2 className="section-heading mt-2">Past Events</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {pastEvents.map((event: any) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
                    {event.image && typeof event.image === 'object' ? (
                      <Image
                        src={event.image.url || ''}
                        alt={event.image.alt || event.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons text-4xl text-gray-300">event</span>
                      </div>
                    )}
                  </div>
                  <div className="py-4">
                    <time className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <h3 className="text-sm font-semibold mt-1 group-hover:text-[#a1413b] transition-colors">
                      {event.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
