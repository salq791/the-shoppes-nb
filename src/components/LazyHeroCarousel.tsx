'use client'

import dynamic from 'next/dynamic'

const HeroCarousel = dynamic(() => import('./HeroCarousel').then((mod) => mod.HeroCarousel), {
  ssr: false,
})

export function LazyHeroCarousel() {
  return <HeroCarousel />
}
