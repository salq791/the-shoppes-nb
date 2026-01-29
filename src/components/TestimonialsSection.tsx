'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  location: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'North Brunswick, NJ',
    text: 'The Shoppes has become my go-to destination for weekend shopping. Great variety of stores and the dining options are perfect for a family lunch!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael R.',
    location: 'Edison, NJ',
    text: 'Love the convenience of having so many quality stores in one place. The staff at most shops are friendly and helpful. Highly recommend!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Jennifer L.',
    location: 'East Brunswick, NJ',
    text: 'Beautiful outdoor shopping center with a great mix of retail and restaurants. The kids love Jamba Juice while I browse the clothing stores!',
    rating: 5,
  },
  {
    id: 4,
    name: 'David K.',
    location: 'New Brunswick, NJ',
    text: 'As a fitness enthusiast, having Orange Theory and Road Runner Sports nearby is perfect. Plus all the healthy food options!',
    rating: 4,
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 8000)
    return () => clearInterval(timer)
  }, [next])

  const testimonial = testimonials[current]

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-cream-100">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-heading mb-4">What Our Visitors Say</h2>
          <p className="section-subheading mx-auto">
            Hear from the community about their shopping experience
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Quote icon */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-xl">
              <Quote className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Testimonial card */}
          <div className="bg-cream-50 rounded-3xl shadow-xl p-8 pt-12 lg:p-12 lg:pt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-primary-500 fill-primary-500'
                          : 'text-secondary-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-lg lg:text-xl text-secondary-700 leading-relaxed mb-8">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div>
                  <p className="font-display font-semibold text-secondary-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-secondary-500">{testimonial.location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-cream-50 shadow-md flex items-center justify-center text-secondary-600 hover:text-primary-600 hover:shadow-lg transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current
                      ? 'w-6 bg-primary-500'
                      : 'bg-secondary-300 hover:bg-secondary-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-cream-50 shadow-md flex items-center justify-center text-secondary-600 hover:text-primary-600 hover:shadow-lg transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
