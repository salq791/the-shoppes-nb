import Image from 'next/image'
import { HeroCarousel } from './HeroCarousel'

// Server component wrapper - ensures first image is in initial HTML with priority
export function HeroSection() {
  const firstSlideImage = 'https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-shoppes-overview.jpg'

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* SSR: Priority image rendered server-side for LCP */}
      <Image
        src={firstSlideImage}
        alt="The Shoppes at North Brunswick"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        style={{ position: 'absolute', zIndex: -1 }}
      />
      {/* Client: Interactive carousel */}
      <HeroCarousel />
    </div>
  )
}
