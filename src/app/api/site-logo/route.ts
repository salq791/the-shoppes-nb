import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Find the site logo in media collection
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

    if (media.docs.length > 0 && media.docs[0].url) {
      return NextResponse.json({ url: media.docs[0].url })
    }

    return NextResponse.json({ url: null })
  } catch (error) {
    console.error('Error fetching site logo:', error)
    return NextResponse.json({ url: null })
  }
}
