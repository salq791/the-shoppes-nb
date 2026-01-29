import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { ContactForm } from '@/components/ContactForm'

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
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-contact-aerial.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display mb-4">Contact Us</h1>
            <p className="text-sm tracking-[0.5em] uppercase font-light">Get in Touch</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-gold">Home</Link>
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
                    <span className="material-icons text-gold">location_on</span>
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Address</h3>
                      <p className="whitespace-pre-line">{settings.address}</p>
                    </div>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex gap-4">
                    <span className="material-icons text-gold">phone</span>
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Phone</h3>
                      <a href={`tel:${settings.phone}`} className="text-lg font-display hover:text-gold transition-colors">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}
                {settings.email && (
                  <div className="flex gap-4">
                    <span className="material-icons text-gold">email</span>
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Email</h3>
                      <a href={`mailto:${settings.email}`} className="text-gold hover:underline">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
                {settings.hours && (
                  <div className="flex gap-4">
                    <span className="material-icons text-gold">schedule</span>
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
