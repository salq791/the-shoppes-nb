import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  const payload = await getPayloadClient()
  const categories = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })
  return categories.docs[0] || null
}

async function getTenantsByCategory(categoryId: string) {
  const payload = await getPayloadClient()
  const tenants = await payload.find({
    collection: 'tenants',
    where: {
      category: { equals: categoryId },
      status: { not_equals: 'closed' },
    },
    sort: 'name',
    limit: 100,
  })
  return tenants.docs
}

async function getCategories() {
  const payload = await getPayloadClient()
  const categories = await payload.find({
    collection: 'categories',
    sort: 'order',
    limit: 50,
  })
  return categories.docs
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: 'Not Found' }
  return {
    title: `${category.name} | The Shoppes at North Brunswick`,
    description: `Browse ${category.name} shops and services at The Shoppes at North Brunswick.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const [tenants, categories] = await Promise.all([
    getTenantsByCategory(String(category.id)),
    getCategories(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display mb-4">{category.name}</h1>
            <p className="text-sm tracking-[0.5em] uppercase font-light">Browse Collection</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-[#a1413b]">Home</Link>
          {' / '}
          <Link href="/directory" className="hover:text-[#a1413b]">Directory</Link>
          {' / '}
          <span className="text-gray-900 dark:text-white">{category.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/directory"
              className="px-4 py-2 text-[11px] font-semibold tracking-widest uppercase text-gray-500 border border-gray-200 dark:border-zinc-700 hover:bg-[#a1413b] hover:border-[#a1413b] hover:text-white transition-all"
            >
              All
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-4 py-2 text-[11px] font-semibold tracking-widest uppercase transition-all ${
                  cat.id === category.id
                    ? 'bg-primary text-white'
                    : 'text-gray-500 border border-gray-200 dark:border-zinc-700 hover:bg-[#a1413b] hover:border-[#a1413b] hover:text-white'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Tenant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tenants.length > 0 ? (
              tenants.map((tenant: any) => (
                <Link
                  key={tenant.id}
                  href={`/directory/${tenant.slug}`}
                  className="group"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center p-8 transition-all group-hover:border-[#a1413b] relative">
                    {tenant.logo && typeof tenant.logo === 'object' ? (
                      <Image
                        src={tenant.logo.url || ''}
                        alt={tenant.logo.alt || tenant.name}
                        width={200}
                        height={200}
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <span className="text-5xl font-display text-gray-200 group-hover:text-[#a1413b] transition-colors">
                        {tenant.name.charAt(0)}
                      </span>
                    )}
                    {tenant.status === 'coming-soon' && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-[#a1413b] text-white text-[10px] font-semibold uppercase tracking-wider">
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div className="py-4 text-center">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold group-hover:text-[#a1413b] transition-colors">
                      {tenant.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">{category.name}</p>
                    {tenant.suiteNumber && (
                      <p className="text-[10px] text-gray-400 mt-1">Suite {tenant.suiteNumber}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-16">
                <span className="material-icons text-4xl text-gray-300 mb-4">storefront</span>
                <p className="text-gray-500">No {category.name.toLowerCase()} stores listed yet</p>
                <p className="text-xs text-gray-400 mt-1">Check back soon</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
