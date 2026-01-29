import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

// Map of tenant names to their logo URLs (from theshoppesatnorthbrunswick.com or fallback)
const tenantLogos: Record<string, string> = {
  'Ann Taylor Loft': '',
  'Anthropologie': '',
  'Banana Republic': '',
  "Men's Wearhouse (Jos A Bank)": '',
  'New York & Company': '',
  'Talbots': '',
  'White House Black Market': '',
  'Chipotle': '',
  'Five Guys Burgers & Fries': '',
  'Frutta Bowls': '',
  'Häagen-Dazs': '',
  'Jamba Juice': '',
  'Saladworks': '',
  'Sarku Japan': '',
  'Starbucks Coffee': '',
  'Subway': '',
  'Wingstop': '',
  'Red Brick Pizza': '',
  'Mollaga Indian Grill': '',
  'AT&T': '',
  'Bath & Body Works': '',
  'Prestige Nails': '',
  'Five Below': '',
  'GameStop': '',
  'Hand & Stone': '',
  'Hudson City Savings Bank': '',
  'Road Runner Sports': '',
  'Supercuts': '',
  'Honor Yoga': '',
  'European Wax Center': '',
  'Orange Theory Fitness': '',
  'Gymboree': '',
  'Justice': '',
  'Airlift Group': '',
  'Brighter Dental': '',
  'PSI Testing': '',
  'NBMA (North Brunswick Medical Associates)': '',
  'Remax': '',
  'Visiting Nurses Association': '',
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject)
          return
        }
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}) // Delete the file if error
      reject(err)
    })
  })
}

async function importImages() {
  console.log('Starting image import...')

  const payload = await getPayload({ config })

  // Create temp directory for downloads
  const tempDir = path.join(process.cwd(), 'temp-images')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Get all tenants
  const tenants = await payload.find({
    collection: 'tenants',
    limit: 1000,
  })

  console.log(`Found ${tenants.docs.length} tenants`)

  for (const tenant of tenants.docs) {
    const logoUrl = tenantLogos[tenant.name as string]

    if (!logoUrl) {
      console.log(`  No logo URL for: ${tenant.name}`)
      continue
    }

    try {
      console.log(`  Downloading logo for: ${tenant.name}`)

      // Download the image
      const ext = path.extname(new URL(logoUrl).pathname) || '.png'
      const filename = `${(tenant.name as string).toLowerCase().replace(/[^a-z0-9]/g, '-')}${ext}`
      const filepath = path.join(tempDir, filename)

      await downloadImage(logoUrl, filepath)

      // Upload to Payload
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `${tenant.name} logo`,
        },
        filePath: filepath,
      })

      // Update tenant with logo
      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: {
          logo: media.id,
        },
      })

      console.log(`  Uploaded logo for: ${tenant.name}`)

      // Clean up temp file
      fs.unlinkSync(filepath)
    } catch (error) {
      console.error(`  Failed to import logo for ${tenant.name}:`, error)
    }
  }

  // Clean up temp directory
  try {
    fs.rmdirSync(tempDir)
  } catch {
    // Directory may not be empty or may not exist
  }

  console.log('\nImage import completed!')
  process.exit(0)
}

importImages().catch((error) => {
  console.error('Image import failed:', error)
  process.exit(1)
})
