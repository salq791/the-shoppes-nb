import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const BASE_URL = 'http://www.theshoppesatnorthbrunswick.com/wp-content/uploads'

// Map tenant names to their image filenames on the old site
const tenantImageMap: Record<string, string> = {
  // Apparel
  'Ann Taylor Loft': 'client-loft.png',
  'Anthropologie': 'logo_150.png',
  'Banana Republic': 'client-banana-republic.png',
  "Men's Wearhouse (Jos A Bank)": 'client-jos-a-bank.jpg',
  'New York & Company': 'client-ny-c.jpg',
  'Talbots': 'client-talbots.png',
  'White House Black Market': 'client-white-house-black-market.jpg',

  // Eat & Drink
  'Chipotle': 'client-chipotle.png',
  'Five Guys Burgers & Fries': 'client-five-guys.png',
  'Frutta Bowls': '', // May not have image
  'Häagen-Dazs': 'client-haagen-daaz.png',
  'Jamba Juice': 'client-jamba-juice.gif',
  'Saladworks': 'client-saladworks.jpg',
  'Sarku Japan': 'client-sarku-japan.jpg',
  'Starbucks Coffee': 'client-starbucks.png',
  'Subway': 'client-subway.png',
  'Wingstop': 'wingstop.png',
  'Red Brick Pizza': 'Red-Brick-Pizza-Logo-1.jpg',
  'Mollaga Indian Grill': 'mollaga.jpg',

  // Specialty
  'AT&T': 'client-att.jpg',
  'Bath & Body Works': 'client-bath-body-works1.png',
  'Prestige Nails': 'client-prestiuge-nails.jpg',
  'Five Below': 'five-below.jpg',
  'GameStop': 'client-gamestop.png',
  'Hand & Stone': 'client-hand-stone.jpg',
  'Hudson City Savings Bank': 'client-hudson-city.png',
  'Road Runner Sports': 'client-roadrunner.png',
  'Supercuts': 'supercuts.jpg',
  'Honor Yoga': 'Honor-Yoga-1.jpg',
  'European Wax Center': '', // May not have image
  'Orange Theory Fitness': '', // May not have image

  // For Kids
  'Gymboree': 'client-gymboree.png',
  'Justice': 'client-justice.jpg',

  // Services & Offices
  'Airlift Group': 'airlift-group.jpg',
  'Brighter Dental': 'brighter-dental.jpg',
  'PSI Testing': 'client-psi-exams.jpg',
  'NBMA (North Brunswick Medical Associates)': 'client-nbma.jpg',
  'Remax': 'client-remax.png',
  'Visiting Nurses Association': 'client-vna-nj.jpg',
}

// Site logo and other images
const siteImages = [
  { name: 'site-logo', filename: 'logo-360-90.jpg', alt: 'The Shoppes at North Brunswick Logo' },
  { name: 'store-directory-map', filename: 'Store-Directory-Map.pdf', alt: 'Store Directory Map' },
]

async function downloadFile(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          file.close()
          fs.unlinkSync(filepath)
          downloadFile(redirectUrl, filepath).then(resolve)
          return
        }
      }

      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(filepath)
        resolve(false)
        return
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(true)
      })
    })

    request.on('error', () => {
      file.close()
      try { fs.unlinkSync(filepath) } catch {}
      resolve(false)
    })

    request.setTimeout(30000, () => {
      request.destroy()
      file.close()
      try { fs.unlinkSync(filepath) } catch {}
      resolve(false)
    })
  })
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

async function main() {
  console.log('Starting image download and upload process...\n')

  const payload = await getPayload({ config })

  // Create temp directory
  const tempDir = path.join(process.cwd(), 'temp-downloads')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Get all tenants
  const tenants = await payload.find({
    collection: 'tenants',
    limit: 1000,
  })

  console.log(`Found ${tenants.docs.length} tenants in database\n`)

  let successCount = 0
  let skipCount = 0
  let failCount = 0

  for (const tenant of tenants.docs) {
    const tenantName = tenant.name as string
    const imageFilename = tenantImageMap[tenantName]

    if (!imageFilename) {
      console.log(`⏭️  Skipping ${tenantName} - no image mapping`)
      skipCount++
      continue
    }

    // Skip if tenant already has a logo
    if (tenant.logo) {
      console.log(`⏭️  Skipping ${tenantName} - already has logo`)
      skipCount++
      continue
    }

    const imageUrl = `${BASE_URL}/${imageFilename}`
    const localPath = path.join(tempDir, imageFilename)

    console.log(`📥 Downloading: ${tenantName}...`)

    const downloaded = await downloadFile(imageUrl, localPath)

    if (!downloaded) {
      console.log(`   ❌ Failed to download ${imageFilename}`)
      failCount++
      continue
    }

    // Check file exists and has content
    if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
      console.log(`   ❌ Downloaded file is empty or missing`)
      failCount++
      continue
    }

    try {
      // Upload to Payload/R2
      const fileBuffer = fs.readFileSync(localPath)
      const mimeType = getMimeType(imageFilename)

      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `${tenantName} logo`,
        },
        file: {
          data: fileBuffer,
          mimetype: mimeType,
          name: imageFilename,
          size: fileBuffer.length,
        },
      })

      // Update tenant with logo
      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: {
          logo: media.id,
        },
      })

      console.log(`   ✅ Uploaded and linked to ${tenantName}`)
      successCount++

      // Clean up temp file
      fs.unlinkSync(localPath)
    } catch (error: any) {
      console.log(`   ❌ Upload failed: ${error.message}`)
      failCount++
      try { fs.unlinkSync(localPath) } catch {}
    }
  }

  // Download site images
  console.log('\n--- Downloading site images ---\n')

  for (const siteImage of siteImages) {
    const imageUrl = `${BASE_URL}/${siteImage.filename}`
    const localPath = path.join(tempDir, siteImage.filename)

    console.log(`📥 Downloading: ${siteImage.name}...`)

    const downloaded = await downloadFile(imageUrl, localPath)

    if (!downloaded) {
      console.log(`   ❌ Failed to download ${siteImage.filename}`)
      continue
    }

    if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
      console.log(`   ❌ Downloaded file is empty or missing`)
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(localPath)
      const mimeType = getMimeType(siteImage.filename)
      const isPdf = siteImage.filename.endsWith('.pdf')

      await payload.create({
        collection: isPdf ? 'documents' : 'media',
        data: isPdf ? {
          title: siteImage.name,
          category: 'marketing',
          description: siteImage.alt,
        } : {
          alt: siteImage.alt,
        },
        file: {
          data: fileBuffer,
          mimetype: mimeType,
          name: siteImage.filename,
          size: fileBuffer.length,
        },
      })

      console.log(`   ✅ Uploaded ${siteImage.name}`)
      fs.unlinkSync(localPath)
    } catch (error: any) {
      console.log(`   ❌ Upload failed: ${error.message}`)
      try { fs.unlinkSync(localPath) } catch {}
    }
  }

  // Clean up temp directory
  try {
    fs.rmdirSync(tempDir)
  } catch {}

  console.log('\n========================================')
  console.log(`✅ Success: ${successCount}`)
  console.log(`⏭️  Skipped: ${skipCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('========================================\n')

  process.exit(0)
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
