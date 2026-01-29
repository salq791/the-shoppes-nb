'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface ParallaxHeroProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  height?: 'small' | 'medium' | 'large'
  overlay?: 'light' | 'dark' | 'gradient'
  children?: React.ReactNode
}

export function ParallaxHero({
  title,
  subtitle,
  backgroundImage,
  height = 'medium',
  overlay = 'gradient',
  children,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const heightClasses = {
    small: 'min-h-[300px]',
    medium: 'min-h-[400px]',
    large: 'min-h-[500px]',
  }

  const overlayClasses = {
    light: 'bg-white/60',
    dark: 'bg-secondary-900/60',
    gradient: 'bg-gradient-to-b from-primary-900/20 via-secondary-900/10 to-cream-100',
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${heightClasses[height]}`}>
      {/* Background */}
      {backgroundImage ? (
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      ) : (
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-primary-100 via-cream-100 to-accent-100"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-200/30 rounded-full blur-3xl" />
        </motion.div>
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container-custom h-full flex flex-col items-center justify-center text-center py-16"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`section-heading mb-4 ${overlay === 'dark' ? 'text-white' : ''}`}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg sm:text-xl max-w-2xl ${
              overlay === 'dark' ? 'text-white/80' : 'text-secondary-600'
            }`}
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
