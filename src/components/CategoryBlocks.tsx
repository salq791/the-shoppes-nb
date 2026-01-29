'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shirt,
  UtensilsCrossed,
  ShoppingBag,
  Baby,
  Briefcase,
  ArrowRight,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  tenantCount?: number
}

interface CategoryBlocksProps {
  categories: Category[]
  title?: string
  subtitle?: string
}

const iconMap: Record<string, React.ReactNode> = {
  shirt: <Shirt className="w-8 h-8" />,
  utensils: <UtensilsCrossed className="w-8 h-8" />,
  'shopping-bag': <ShoppingBag className="w-8 h-8" />,
  baby: <Baby className="w-8 h-8" />,
  briefcase: <Briefcase className="w-8 h-8" />,
}

const colorClasses = [
  'from-primary-500 to-primary-600',
  'from-accent-500 to-accent-600',
  'from-secondary-400 to-secondary-500',
  'from-primary-400 to-accent-500',
  'from-secondary-500 to-primary-500',
]

export function CategoryBlocks({ categories, title, subtitle }: CategoryBlocksProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-cream-100 to-white">
      <div className="container-custom">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {title && <h2 className="section-heading mb-4">{title}</h2>}
            {subtitle && <p className="section-subheading mx-auto">{subtitle}</p>}
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6"
        >
          {categories.map((category, index) => (
            <motion.div key={category.id} variants={item}>
              <Link
                href={`/category/${category.slug}`}
                className="group block"
              >
                <div className="card-warm p-6 h-full flex flex-col items-center text-center group-hover:ring-primary-300">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                      colorClasses[index % colorClasses.length]
                    } flex items-center justify-center text-white shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.icon && iconMap[category.icon]
                      ? iconMap[category.icon]
                      : <ShoppingBag className="w-8 h-8" />}
                  </div>

                  {/* Name */}
                  <h3 className="font-display font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>

                  {/* Count */}
                  {category.tenantCount !== undefined && (
                    <p className="text-sm text-secondary-500">
                      {category.tenantCount} {category.tenantCount === 1 ? 'store' : 'stores'}
                    </p>
                  )}

                  {/* Arrow */}
                  <div className="mt-3 flex items-center text-primary-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
