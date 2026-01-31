import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { NewsletterForm } from './NewsletterForm'

async function getSiteLogo() {
  try {
    const payload = await getPayloadClient()
    const media = await payload.find({
      collection: 'media',
      where: {
        and: [
          { alt: { contains: 'Shoppes' } },
          { alt: { contains: 'Logo' } },
        ],
      },
      limit: 1,
    })
    return media.docs[0]?.url || null
  } catch {
    return null
  }
}

async function getLatestEvent() {
  try {
    const payload = await getPayloadClient()
    const events = await payload.find({
      collection: 'events',
      where: {
        status: { equals: 'upcoming' },
      },
      sort: 'date',
      limit: 1,
      depth: 1,
    })
    return events.docs[0] || null
  } catch {
    return null
  }
}

const footerNavigation = {
  directory: [
    { name: 'Apparel', href: '/category/apparel', icon: 'shopping_bag' },
    { name: 'Eat & Drink', href: '/category/eat-drink', icon: 'restaurant' },
    { name: 'For Kids', href: '/category/for-kids', icon: 'child_care' },
    { name: 'Services', href: '/category/services-offices', icon: 'business' },
  ],
  quickLinks: [
    { name: 'Center Map', href: '/map', icon: 'map' },
    { name: 'Store Directory', href: '/directory', icon: 'list' },
    { name: 'Center Info', href: '/about', icon: 'info' },
    { name: 'Contact Us', href: '/contact', icon: 'email' },
  ],
}

export async function Footer() {
  const [logoUrl, latestEvent] = await Promise.all([
    getSiteLogo(),
    getLatestEvent(),
  ])

  return (
    <footer className="bg-black text-white py-16 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* News & Events */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold border-b border-gray-800 pb-4 mb-6">
            News & Events
          </h3>
          {latestEvent ? (
            <Link href={`/events/${latestEvent.slug}`} className="flex gap-4 group">
              <div className="w-16 h-16 bg-zinc-800 flex-shrink-0 overflow-hidden">
                {latestEvent.image && typeof latestEvent.image === 'object' ? (
                  <Image
                    src={latestEvent.image.url || ''}
                    alt={latestEvent.image.alt || latestEvent.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-icons text-gray-600">event</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {new Date(latestEvent.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs font-semibold mt-1 group-hover:text-[#a1413b] transition-colors">
                  {latestEvent.title}
                </p>
              </div>
            </Link>
          ) : (
            <p className="text-xs text-gray-400">Check back for upcoming events</p>
          )}
        </div>

        {/* Directory */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold border-b border-gray-800 pb-4 mb-6">
            Directory
          </h3>
          <ul className="text-[11px] uppercase tracking-widest space-y-3 text-gray-400">
            {footerNavigation.directory.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 hover:text-[#a1413b] transition-colors cursor-pointer"
                >
                  <span className="material-icons text-xs">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold border-b border-gray-800 pb-4 mb-6">
            Quick Links
          </h3>
          <ul className="text-[11px] uppercase tracking-widest space-y-3 text-gray-400">
            {footerNavigation.quickLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 hover:text-[#a1413b] transition-colors cursor-pointer"
                >
                  <span className="material-icons text-xs">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold border-b border-gray-800 pb-4 mb-6">
            Shoppes Insider
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Join our exclusive circle for early access to seasonal sales, boutique launches, and VIP events.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} The Shoppes at North Brunswick. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
