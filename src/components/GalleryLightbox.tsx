'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: string
  image: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  caption?: string
}

interface GalleryLightboxProps {
  images: GalleryImage[]
}

export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
  }, [selectedIndex, images.length])

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % images.length)
  }, [selectedIndex, images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return

      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, goToPrevious, goToNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null

  return (
    <>
      {/* Gallery Grid */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {images.map((item, index) => (
          item.image && (
            <div key={item.id} className="mb-6 break-inside-avoid group">
              <button
                onClick={() => openLightbox(index)}
                className="w-full text-left overflow-hidden border border-gray-100 dark:border-zinc-800 transition-all group-hover:border-[#a1413b] cursor-pointer"
              >
                <Image
                  src={item.image.url || ''}
                  alt={item.image.alt || item.caption || 'Gallery image'}
                  width={item.image.width || 600}
                  height={item.image.height || 400}
                  className="w-full object-cover"
                />
              </button>
              {item.caption && (
                <p className="mt-2 text-xs text-gray-500 uppercase tracking-wider">{item.caption}</p>
              )}
            </div>
          )
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.image.url}
                alt={selectedImage.image.alt || selectedImage.caption || 'Gallery image'}
                width={selectedImage.image.width || 1200}
                height={selectedImage.image.height || 800}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                priority
              />

              {/* Caption */}
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                  <p className="text-white text-center text-sm uppercase tracking-wider">
                    {selectedImage.caption}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm tracking-wider">
              {(selectedIndex ?? 0) + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
