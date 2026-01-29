import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    // Check if email already exists
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        email: { equals: email },
      },
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0]
      if (subscriber.status === 'unsubscribed') {
        // Resubscribe
        await payload.update({
          collection: 'newsletter-subscribers',
          id: subscriber.id,
          data: {
            status: 'active',
          },
        })
        return NextResponse.json({ success: true, message: 'Welcome back!' })
      }
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      )
    }

    // Create new subscriber
    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email,
        status: 'active',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
