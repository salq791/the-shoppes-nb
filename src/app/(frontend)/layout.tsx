import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import '../globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MaterialIcons } from '@/components/MaterialIcons'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'The Shoppes at North Brunswick | Your Neighborhood Shopping Destination',
    template: '%s | The Shoppes at North Brunswick',
  },
  description: 'Discover dining, retail, and services at The Shoppes at North Brunswick - your neighborhood shopping destination in North Brunswick Township, NJ.',
  keywords: ['shopping center', 'North Brunswick', 'NJ shopping', 'retail', 'dining', 'restaurants'],
  openGraph: {
    title: 'The Shoppes at North Brunswick',
    description: 'Your neighborhood shopping destination featuring dining, retail, and services.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        <MaterialIcons />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
