'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
  cta: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  image: string
}

// Export slides so they can be used server-side
export const slides: Slide[] = [
  {
    id: 1,
    title: 'The Shoppes',
    subtitle: 'at North Brunswick',
    description: 'Your neighborhood shopping destination featuring dining, retail, and services for the whole family.',
    cta: { text: 'Explore Directory', href: '/directory' },
    secondaryCta: { text: 'Get Directions', href: '/contact' },
    image: 'https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-shoppes-overview.jpg',
  },
  {
    id: 2,
    title: 'Discover',
    subtitle: '39+ Retailers & Restaurants',
    description: 'From fashion to food, find everything you need at The Shoppes at North Brunswick.',
    cta: { text: 'View All Stores', href: '/directory' },
    secondaryCta: { text: 'Shop by Category', href: '/directory' },
    image: 'https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-jamba-juice.jpg',
  },
  {
    id: 3,
    title: 'Dine & Relax',
    subtitle: 'Coffee, Food & More',
    description: 'Enjoy Starbucks, Chipotle, and many more dining options at our shopping center.',
    cta: { text: 'View Restaurants', href: '/category/eat-drink' },
    secondaryCta: { text: 'Latest News', href: '/news' },
    image: 'https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-shopping-center.jpg',
  },
  {
    id: 4,
    title: 'Events',
    subtitle: 'Join the Community',
    description: 'Stay updated with the latest events, promotions, and special offers.',
    cta: { text: 'View Events', href: '/events' },
    secondaryCta: { text: 'Contact Us', href: '/contact' },
    image: 'https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-retail-stores.jpg',
  },
  {
    id: 5,
    title: 'Leasing',
    subtitle: 'Grow Your Business',
    description: 'Join our thriving retail community with prime locations and flexible leasing options.',
    cta: { text: 'Leasing Info', href: '/leasing' },
    secondaryCta: { text: 'Contact Us', href: '/contact' },
    image: 'https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/hero/hero-image-6.jpg',
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)
  const [autoPlayKey, setAutoPlayKey] = useState(0)

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const resetAutoPlay = useCallback(() => {
    setAutoPlayKey((prev) => prev + 1)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    resetAutoPlay()
  }

  const handleNext = useCallback(() => {
    nextSlide()
    resetAutoPlay()
  }, [nextSlide, resetAutoPlay])

  const handlePrev = useCallback(() => {
    prevSlide()
    resetAutoPlay()
  }, [prevSlide, resetAutoPlay])

  useEffect(() => {
    if (!isHydrated) return
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide, autoPlayKey, isHydrated])

  const slide = slides[currentSlide]
  const firstSlide = slides[0]

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* SSR: First slide image always rendered for LCP */}
      <div className={`absolute inset-0 ${isHydrated && currentSlide !== 0 ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}>
        <Image
          src={firstSlide.image}
          alt={firstSlide.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Client: Animated slides after hydration */}
      {isHydrated && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={currentSlide === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Content - SSR first slide, then animate */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* SSR: First slide content for initial render */}
        {!isHydrated && (
          <div className="text-center text-white px-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display mb-2">
              {firstSlide.title}
            </h1>
            <p className="text-lg sm:text-xl tracking-[0.5em] uppercase font-light mb-6">
              {firstSlide.subtitle}
            </p>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-10">
              {firstSlide.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={firstSlide.cta.href} className="btn-primary">
                {firstSlide.cta.text}
              </Link>
              {firstSlide.secondaryCta && (
                <Link href={firstSlide.secondaryCta.href} className="btn-secondary text-white border-white/30 hover:bg-[#a1413b] hover:border-[#a1413b]">
                  {firstSlide.secondaryCta.text}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Client: Animated content after hydration */}
        {isHydrated && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white px-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display mb-2">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl tracking-[0.5em] uppercase font-light mb-6">
                {slide.subtitle}
              </p>
              <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-10">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={slide.cta.href} className="btn-primary">
                  {slide.cta.text}
                </Link>
                {slide.secondaryCta && (
                  <Link href={slide.secondaryCta.href} className="btn-secondary text-white border-white/30 hover:bg-[#a1413b] hover:border-[#a1413b]">
                    {slide.secondaryCta.text}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-white/30 flex items-center justify-center text-white/70 hover:bg-[#a1413b] hover:border-[#a1413b] hover:text-white transition-all"
        aria-label="Previous slide"
      >
        <span className="material-icons text-sm">chevron_left</span>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-white/30 flex items-center justify-center text-white/70 hover:bg-[#a1413b] hover:border-[#a1413b] hover:text-white transition-all"
        aria-label="Next slide"
      >
        <span className="material-icons text-sm">chevron_right</span>
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 transition-all duration-300 ${
              index === currentSlide
                ? 'w-10 bg-[#a1413b]'
                : 'w-3 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
