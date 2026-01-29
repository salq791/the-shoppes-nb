import { getPayloadClient } from '@/lib/payload'
import { InteractiveMap } from '@/components/InteractiveMap'

export const revalidate = 60

async function getTenants() {
  const payload = await getPayloadClient()
  const tenants = await payload.find({
    collection: 'tenants',
    where: {
      status: { not_equals: 'closed' },
    },
    sort: 'name',
    limit: 100,
    depth: 1,
  })
  return tenants.docs
}

export default async function MapPage() {
  const tenants = await getTenants()

  return (
    <div className="py-16 sm:py-24 bg-cream-50 min-h-screen">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="section-heading">Interactive Map</h1>
          <p className="mt-4 text-lg leading-8 text-secondary-600">
            Find your way around The Shoppes at North Brunswick.
            Click on any store to see more details.
          </p>
        </div>

        {/* Map Component */}
        <InteractiveMap tenants={tenants as any[]} />
        
        <div className="mt-8 text-center text-sm text-secondary-500">
          <p>Map layout is for illustrative purposes only. Actual store locations may vary.</p>
        </div>
      </div>
    </div>
  )
}
