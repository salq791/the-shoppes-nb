import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const payload = await getPayload({ config })

    // Search tenants by name
    const tenants = await payload.find({
      collection: 'tenants',
      where: {
        or: [
          {
            name: {
              contains: query,
            },
          },
          {
            suiteNumber: {
              contains: query,
            },
          },
        ],
      },
      limit: 10,
      depth: 1,
    })

    const results = tenants.docs.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      suiteNumber: tenant.suiteNumber,
      category: typeof tenant.category === 'object' ? tenant.category?.name : null,
      status: tenant.status,
      logo: typeof tenant.logo === 'object' ? tenant.logo?.url : null,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}
