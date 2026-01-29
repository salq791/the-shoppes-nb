import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

async function getTenant(slug: string) {
  const payload = await getPayloadClient()
  const tenants = await payload.find({
    collection: 'tenants',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 2,
  })
  return tenants.docs[0] || null
}

async function getRelatedTenants(categoryId: string, currentId: string) {
  const payload = await getPayloadClient()
  const tenants = await payload.find({
    collection: 'tenants',
    where: {
      category: { equals: categoryId },
      id: { not_equals: currentId },
      status: { not_equals: 'closed' },
    },
    limit: 5,
  })
  return tenants.docs
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tenant = await getTenant(slug)
  if (!tenant) return { title: 'Not Found' }
  return {
    title: `${tenant.name} | The Shoppes at North Brunswick`,
    description: `Visit ${tenant.name} at The Shoppes at North Brunswick.`,
  }
}

export default async function TenantPage({ params }: Props) {
  const { slug } = await params
  const tenant = await getTenant(slug)

  if (!tenant) {
    notFound()
  }

  const relatedTenants = tenant.category && typeof tenant.category === 'object'
    ? await getRelatedTenants(String(tenant.category.id), String(tenant.id))
    : []

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {tenant.logo && typeof tenant.logo === 'object' ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${tenant.logo.url})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-4">{tenant.name}</h1>
            {tenant.category && typeof tenant.category === 'object' && (
              <p className="text-sm tracking-[0.5em] uppercase font-light">{tenant.category.name}</p>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-[#a1413b]">Home</Link>
          {' / '}
          <Link href="/directory" className="hover:text-[#a1413b]">Directory</Link>
          {tenant.category && typeof tenant.category === 'object' && (
            <>
              {' / '}
              <Link href={`/category/${tenant.category.slug}`} className="hover:text-[#a1413b]">{tenant.category.name}</Link>
            </>
          )}
          {' / '}
          <span className="text-gray-900 dark:text-white">{tenant.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto py-16 px-8 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column - Description */}
        <div className="lg:col-span-2">
          <div className="mb-12">
            <h2 className="text-3xl font-display mb-6 border-b border-[#a1413b]/30 pb-4">The Boutique</h2>
            {tenant.description ? (
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg italic prose prose-gray dark:prose-invert">
                <RichText content={tenant.description} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg italic">
                Visit {tenant.name} at The Shoppes at North Brunswick for an exceptional shopping experience.
              </p>
            )}
          </div>

          {/* Photos Gallery */}
          {tenant.photos && tenant.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {tenant.photos.map((photo: any, index: number) => (
                photo.image && typeof photo.image === 'object' && (
                  <div key={index} className="aspect-square overflow-hidden border border-gray-100 dark:border-zinc-800 group">
                    <Image
                      src={photo.image.url || ''}
                      alt={photo.image.alt || `${tenant.name} photo ${index + 1}`}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Info Card */}
        <div className="lg:col-span-1 bg-gray-50 dark:bg-zinc-900 p-8 border border-gray-100 dark:border-zinc-800 h-fit">
          {/* Store Hours */}
          {tenant.hours && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Store Hours</h3>
              <p className="text-sm whitespace-pre-line">{tenant.hours}</p>
            </div>
          )}

          {/* Location */}
          {tenant.suiteNumber && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Location</h3>
              <p className="text-sm mb-2">Suite {tenant.suiteNumber}</p>
              <a
                href="/api/documents/file/Store-Directory-Map.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a1413b] font-semibold underline hover:text-[#a1413b]/80 transition-colors"
              >
                View on Directory Map
              </a>
            </div>
          )}

          {/* Contact */}
          <div className="mb-8 border-t border-gray-200 dark:border-zinc-700 pt-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Contact</h3>
            {tenant.phone && (
              <p className="text-lg font-display mb-4">
                <a href={`tel:${tenant.phone}`} className="hover:text-[#a1413b] transition-colors">{tenant.phone}</a>
              </p>
            )}
            {tenant.email && (
              <p className="text-sm mb-4">
                <a href={`mailto:${tenant.email}`} className="text-[#a1413b] hover:underline">{tenant.email}</a>
              </p>
            )}
            {tenant.website && (
              <a
                href={tenant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center mb-3"
              >
                Visit Website
              </a>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=The+Shoppes+at+North+Brunswick,+North+Brunswick,+NJ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#a1413b] transition-colors"
            >
              <span className="material-icons text-base">directions</span>
              Get Driving Directions
            </a>
            <a
              href="/api/documents/file/Store-Directory-Map.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#a1413b] transition-colors"
            >
              <span className="material-icons text-base">map</span>
              View Store Directory Map
            </a>
          </div>

          {/* Status Badge */}
          {tenant.status === 'coming-soon' && (
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-[#a1413b] text-white text-xs font-semibold uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Related Stores */}
      {relatedTenants.length > 0 && (
        <section className="bg-gray-50 dark:bg-zinc-900 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="section-subheading">Curated for you</span>
                <h2 className="section-heading mt-2">More to Explore</h2>
              </div>
              <div className="hidden md:flex gap-4">
                <button className="w-10 h-10 border border-gray-300 dark:border-zinc-700 flex items-center justify-center hover:bg-[#a1413b] hover:border-[#a1413b] hover:text-white transition-all">
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                <button className="w-10 h-10 border border-gray-300 dark:border-zinc-700 flex items-center justify-center hover:bg-[#a1413b] hover:border-[#a1413b] hover:text-white transition-all">
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-8 snap-x">
              {relatedTenants.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/directory/${related.slug}`}
                  className="min-w-[200px] snap-center flex flex-col items-center group"
                >
                  <div className="w-full aspect-square overflow-hidden bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center p-6">
                    {related.logo && typeof related.logo === 'object' ? (
                      <Image
                        src={related.logo.url || ''}
                        alt={related.logo.alt || related.name}
                        width={150}
                        height={150}
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <span className="text-4xl font-display text-gray-200 group-hover:text-[#a1413b] transition-colors">
                        {related.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="mt-4 text-xs tracking-[0.3em] uppercase font-semibold text-center group-hover:text-[#a1413b] transition-colors">
                    {related.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
