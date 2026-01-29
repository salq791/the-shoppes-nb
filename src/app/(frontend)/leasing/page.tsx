import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { LeasingForm } from '@/components/LeasingForm'

export const revalidate = 60

async function getSiteSettings() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })
  return settings
}

export default async function LeasingPage() {
  const settings = await getSiteSettings()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-image-6.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display">Leasing Opportunities</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-[#a1413b]">Home</Link>
          {' / '}
          <span className="text-gray-900 dark:text-white">Leasing</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Leasing Info */}
            <div>
              <span className="section-subheading">Grow Your Business</span>
              <h2 className="section-heading mt-2 mb-8">Why The Shoppes?</h2>

              <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-6">
                {settings.leasingInfo ? (
                  <RichText content={settings.leasingInfo} />
                ) : (
                  <>
                    <p>
                      The Shoppes at North Brunswick offers prime retail and restaurant space in a high-traffic location.
                      Our diverse tenant mix creates a destination shopping experience that draws customers
                      from across the region.
                    </p>

                    <div className="mt-8">
                      <h3 className="text-xl font-display mb-4 text-[#a1413b] italic">Benefits of Leasing</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <span className="gold-bullet mt-2" />
                          <span>High visibility and foot traffic</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="gold-bullet mt-2" />
                          <span>Ample parking for customers</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="gold-bullet mt-2" />
                          <span>Marketing support and events</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="gold-bullet mt-2" />
                          <span>Flexible lease terms</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="gold-bullet mt-2" />
                          <span>Professional management</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="gold-bullet mt-2" />
                          <span>Diverse tenant mix</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-display mb-4 text-[#a1413b] italic">Available Spaces</h3>
                      <p>
                        We have spaces available ranging from small inline retail to anchor positions.
                        Contact our leasing team to discuss your specific needs and available opportunities.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-12 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-6 border-b border-gray-200 dark:border-zinc-700 pb-4">
                  Leasing Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[#a1413b]">person</span>
                    <span className="text-lg font-display">Joanna</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[#a1413b]">phone</span>
                    <a
                      href="tel:1-908-274-0530"
                      className="text-lg font-display hover:text-[#a1413b] transition-colors"
                    >
                      1-908-274-0530
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[#a1413b]">email</span>
                    <a
                      href="mailto:joanna@theshoppesnb.com"
                      className="text-[#a1413b] hover:underline"
                    >
                      joanna@theshoppesnb.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Leasing Inquiry Form */}
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 border-b border-gray-200 dark:border-zinc-700 pb-4">
                Leasing Inquiry
              </h2>
              <p className="mt-4 text-sm text-gray-500 mb-6">
                Interested in joining The Shoppes? Fill out the form below and our leasing team will contact you.
              </p>
              <LeasingForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
