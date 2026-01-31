import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { ContactForm } from '@/components/ContactForm'
import { PageHero } from '@/components/PageHero'

export const revalidate = 60

async function getSiteSettings() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })
  return settings
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      <PageHero
        image="https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-contact-aerial.jpg"
        title="Contact Us"
        subtitle="Get in Touch"
      />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-[#a1413b]">Home</Link>
          {' / '}
          <span className="text-gray-900 dark:text-white">Contact</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <span className="section-subheading">We&apos;re Here to Help</span>
              <h2 className="section-heading mt-2 mb-8">Visit Our Center</h2>

              <div className="space-y-8">
                {settings.address && (
                  <div className="flex gap-4">
                    <span className="material-icons text-[#a1413b]">location_on</span>
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Address</h3>
                      <p className="whitespace-pre-line">{settings.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <span className="material-icons text-[#a1413b]">phone</span>
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Phone</h3>
                    <a href="tel:1-908-274-0530" className="text-lg font-display hover:text-[#a1413b] transition-colors">
                      1-908-274-0530
                    </a>
                  </div>
                </div>
                {settings.email && (
                  <div className="flex gap-4">
                    <span className="material-icons text-[#a1413b]">email</span>
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Email</h3>
                      <a href={`mailto:${settings.email}`} className="text-[#a1413b] hover:underline">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
                {settings.hours && (
                  <div className="flex gap-4">
                    <span className="material-icons text-[#a1413b]">schedule</span>
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Hours</h3>
                      <p className="whitespace-pre-line">{settings.hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map */}
              {settings.googleMapsEmbed && (
                <div className="mt-12">
                  <div
                    className="aspect-video overflow-hidden border border-gray-200 dark:border-zinc-800"
                    dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
                  />
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-6 border-b border-gray-200 dark:border-zinc-700 pb-4">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
