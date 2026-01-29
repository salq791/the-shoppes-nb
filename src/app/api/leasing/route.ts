import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { businessName, contactName, email, phone, businessType, spaceRequirements, message } = data

    // Validate required fields
    if (!businessName || !contactName || !email || !phone || !businessType) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Send an email using Resend
    // 2. Store the inquiry in the database
    // 3. Send a notification to the leasing team

    console.log('Leasing inquiry:', {
      businessName,
      contactName,
      email,
      phone,
      businessType,
      spaceRequirements,
      message,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Leasing form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
