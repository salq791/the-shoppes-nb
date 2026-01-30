import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

async function getSiteSettings() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })
  return settings
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-about-fountain.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white bg-black/50 backdrop-blur-sm px-12 py-8 rounded-full">
            <h1 className="text-5xl md:text-6xl font-display mb-2">About Us</h1>
            <p className="text-sm tracking-[0.5em] uppercase font-light">Our Story</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-[#a1413b]">Home</Link>
          {' / '}
          <span className="text-gray-900 dark:text-white">About</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.4em] font-bold text-[#a1413b]">Welcome</span>
            <h2 className="section-heading mt-2">The Shoppes at North Brunswick</h2>
          </div>

          <div className="space-y-8 text-gray-900 dark:text-gray-200 leading-relaxed">
            <p className="text-lg italic font-display text-center border-l-4 border-[#a1413b] pl-6">
              &ldquo;Experience the pinnacle of shopping elegance. The Shoppes at North Brunswick brings together
              the finest retailers, dining destinations, and services to create a premier neighborhood destination.&rdquo;
            </p>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
              <div>
                <h3 className="text-2xl font-display mb-4 text-[#c4413b] font-semibold">Our Vision</h3>
                <p>
                  The Shoppes at North Brunswick was established with a vision to create more than just a shopping center.
                  We wanted to build a place where families come together, where local businesses thrive,
                  and where the community can celebrate life&apos;s moments both big and small.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-display mb-4 text-[#c4413b] font-semibold">Our Promise</h3>
                <p>
                  We are committed to providing an exceptional shopping experience with a carefully curated selection
                  of retailers, restaurants, and services that cater to the diverse needs of our community.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-xl font-display mb-6 text-[#a1413b] italic">What We Offer</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="gold-bullet mt-2" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Diverse Shopping</p>
                    <p className="text-sm">From boutique retailers to everyday essentials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="gold-bullet mt-2" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Delicious Dining</p>
                    <p className="text-sm">A variety of restaurants and cafes for every taste</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="gold-bullet mt-2" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Essential Services</p>
                    <p className="text-sm">Everything you need to simplify your life</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="gold-bullet mt-2" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Community Events</p>
                    <p className="text-sm">Regular activities that bring people together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-8">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-zinc-700 pb-4">
                Visit Us
              </h3>
              {settings.address && typeof settings.address === 'string' && (
                <p className="text-sm text-gray-900 dark:text-gray-200">{settings.address.replace(/\n/g, ', ')}</p>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-8">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-zinc-700 pb-4">
                Contact Us
              </h3>
              <p className="text-lg font-display mb-4 text-gray-900 dark:text-white">
                <a href="tel:1-908-274-0530" className="hover:text-[#a1413b] transition-colors">
                  1-908-274-0530
                </a>
              </p>
              {settings.email && (
                <p className="text-sm">
                  <a href={`mailto:${settings.email}`} className="text-[#a1413b] hover:underline">
                    {settings.email}
                  </a>
                </p>
              )}
              <Link href="/contact" className="btn-primary mt-6 w-full justify-center">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
