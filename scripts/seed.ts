import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const categories = [
  { name: 'Apparel', icon: 'shirt', order: 1 },
  { name: 'Eat & Drink', icon: 'utensils', order: 2 },
  { name: 'Specialty', icon: 'shopping-bag', order: 3 },
  { name: 'For Kids', icon: 'baby', order: 4 },
  { name: 'Services & Offices', icon: 'briefcase', order: 5 },
]

const tenants = [
  // Apparel (7)
  { name: 'Ann Taylor Loft', category: 'Apparel', status: 'active' },
  { name: 'Anthropologie', category: 'Apparel', status: 'active' },
  { name: 'Banana Republic', category: 'Apparel', status: 'active' },
  { name: 'Men\'s Wearhouse (Jos A Bank)', category: 'Apparel', status: 'active' },
  { name: 'New York & Company', category: 'Apparel', status: 'active' },
  { name: 'Talbots', category: 'Apparel', status: 'active' },
  { name: 'White House Black Market', category: 'Apparel', status: 'active' },

  // Eat & Drink (12)
  { name: 'Chipotle', category: 'Eat & Drink', status: 'active' },
  { name: 'Five Guys Burgers & Fries', category: 'Eat & Drink', status: 'active' },
  { name: 'Frutta Bowls', category: 'Eat & Drink', status: 'active' },
  { name: 'Häagen-Dazs', category: 'Eat & Drink', status: 'active' },
  { name: 'Jamba Juice', category: 'Eat & Drink', status: 'active' },
  { name: 'Saladworks', category: 'Eat & Drink', status: 'active' },
  { name: 'Sarku Japan', category: 'Eat & Drink', status: 'active' },
  { name: 'Starbucks Coffee', category: 'Eat & Drink', status: 'active' },
  { name: 'Subway', category: 'Eat & Drink', status: 'active' },
  { name: 'Wingstop', category: 'Eat & Drink', status: 'active' },
  { name: 'Red Brick Pizza', category: 'Eat & Drink', status: 'active' },
  { name: 'Mollaga Indian Grill', category: 'Eat & Drink', status: 'coming-soon' },

  // Specialty (12)
  { name: 'AT&T', category: 'Specialty', status: 'active' },
  { name: 'Bath & Body Works', category: 'Specialty', status: 'active' },
  { name: 'Prestige Nails', category: 'Specialty', status: 'active' },
  { name: 'Five Below', category: 'Specialty', status: 'active' },
  { name: 'GameStop', category: 'Specialty', status: 'active' },
  { name: 'Hand & Stone', category: 'Specialty', status: 'active' },
  { name: 'Hudson City Savings Bank', category: 'Specialty', status: 'active' },
  { name: 'Road Runner Sports', category: 'Specialty', status: 'active' },
  { name: 'Supercuts', category: 'Specialty', status: 'active' },
  { name: 'Honor Yoga', category: 'Specialty', status: 'active' },
  { name: 'European Wax Center', category: 'Specialty', status: 'active' },
  { name: 'Orange Theory Fitness', category: 'Specialty', status: 'coming-soon' },

  // For Kids (2)
  { name: 'Gymboree', category: 'For Kids', status: 'active' },
  { name: 'Justice', category: 'For Kids', status: 'active' },

  // Services & Offices (6)
  { name: 'Airlift Group', category: 'Services & Offices', status: 'active' },
  { name: 'Brighter Dental', category: 'Services & Offices', status: 'active' },
  { name: 'PSI Testing', category: 'Services & Offices', status: 'active' },
  { name: 'NBMA (North Brunswick Medical Associates)', category: 'Services & Offices', status: 'active' },
  { name: 'Remax', category: 'Services & Offices', status: 'active' },
  { name: 'Visiting Nurses Association', category: 'Services & Offices', status: 'active' },
]

async function seed() {
  console.log('Starting seed...')

  const payload = await getPayload({ config })

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing categories and tenants...')

  try {
    const existingTenants = await payload.find({
      collection: 'tenants',
      limit: 1000,
    })

    for (const tenant of existingTenants.docs) {
      await payload.delete({
        collection: 'tenants',
        id: tenant.id,
      })
    }

    const existingCategories = await payload.find({
      collection: 'categories',
      limit: 100,
    })

    for (const category of existingCategories.docs) {
      await payload.delete({
        collection: 'categories',
        id: category.id,
      })
    }
  } catch {
    console.log('No existing data to clear')
  }

  // Create categories
  console.log('Creating categories...')
  const categoryMap: Record<string, string> = {}

  for (const cat of categories) {
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: cat.name,
        icon: cat.icon,
        order: cat.order,
      },
    })
    categoryMap[cat.name] = created.id as string
    console.log(`  Created category: ${cat.name}`)
  }

  // Create tenants
  console.log('Creating tenants...')

  for (const tenant of tenants) {
    const categoryId = categoryMap[tenant.category]
    if (!categoryId) {
      console.warn(`  Category not found for tenant: ${tenant.name}`)
      continue
    }

    await payload.create({
      collection: 'tenants',
      data: {
        name: tenant.name,
        category: categoryId,
        status: tenant.status,
      },
    })
    console.log(`  Created tenant: ${tenant.name}`)
  }

  // Update site settings
  console.log('Updating site settings...')

  try {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'The Shoppes at North Brunswick',
        tagline: 'Your neighborhood shopping destination',
        address: '650 Shoppes Blvd, North Brunswick Township, NJ 08902',
        phone: '(732) 555-1234',
        email: 'info@theshoppesnb.com',
        hours: 'Mon-Sat: 10am-9pm, Sun: 11am-6pm',
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/theshoppesnb' },
          { platform: 'instagram', url: 'https://instagram.com/theshoppesnb' },
          { platform: 'twitter', url: 'https://twitter.com/theshoppesnb' },
        ],
      },
    })
    console.log('  Site settings updated')
  } catch (error) {
    console.log('  Could not update site settings - may need to create them first in the admin')
  }

  console.log('\nSeed completed!')
  console.log(`Created ${categories.length} categories`)
  console.log(`Created ${tenants.length} tenants`)

  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
