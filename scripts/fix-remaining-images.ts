import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'

const BASE_URL = 'http://www.theshoppesatnorthbrunswick.com/wp-content/uploads'

// Use the 120x120 thumbnails which we know exist
const remainingImages: Record<string, string> = {
  'Remax': 'client-remax-1-120x120.png',
  'NBMA (North Brunswick Medical Associates)': 'client-nbma-1-120x120.jpg',
  'Justice': 'client-justice-1-120x120.jpg',
  'Road Runner Sports': 'client-roadrunner-1-120x120.png',
  'Five Below': 'five-below-1-120x120.jpg',
  'White House Black Market': 'client-white-house-black-market-1-120x120.jpg',
  'Talbots': 'client-talbots-1-120x120.png',
  'New York & Company': 'client-ny-c-1-120x120.jpg',
  'Banana Republic': 'client-banana-republic-1-120x120.png',
  'Ann Taylor Loft': 'client-loft-120x120.png',
}

async function downloadFile(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath)
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          file.close()
          try { fs.unlinkSync(filepath) } catch {}
          downloadFile(redirectUrl, filepath).then(resolve)
          return
        }
      }

      if (response.statusCode !== 200) {
        file.close()
        try { fs.unlinkSync(filepath) } catch {}
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
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

async function main() {
  console.log('Fixing remaining tenant images...\n')

  const payload = await getPayload({ config })

  const tempDir = path.join(process.cwd(), 'temp-downloads')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  let successCount = 0
  let failCount = 0

  for (const [tenantName, imageFilename] of Object.entries(remainingImages)) {
    // Find the tenant
    const tenants = await payload.find({
      collection: 'tenants',
      where: {
        name: { equals: tenantName },
      },
      limit: 1,
    })

    if (tenants.docs.length === 0) {
      console.log(`⏭️  Tenant not found: ${tenantName}`)
      continue
    }

    const tenant = tenants.docs[0]

    // Skip if already has logo
    if (tenant.logo) {
      console.log(`⏭️  ${tenantName} already has a logo`)
      continue
    }

    const imageUrl = `${BASE_URL}/${imageFilename}`
    const localPath = path.join(tempDir, imageFilename)

    console.log(`📥 Downloading: ${tenantName}...`)

    const downloaded = await downloadFile(imageUrl, localPath)

    if (!downloaded || !fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
      console.log(`   ❌ Failed to download ${imageFilename}`)
      failCount++
      continue
    }

    try {
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

      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: {
          logo: media.id,
        },
      })

      console.log(`   ✅ Uploaded and linked to ${tenantName}`)
      successCount++
      fs.unlinkSync(localPath)
    } catch (error: any) {
      console.log(`   ❌ Upload failed: ${error.message}`)
      failCount++
      try { fs.unlinkSync(localPath) } catch {}
    }
  }

  try { fs.rmdirSync(tempDir) } catch {}

  console.log('\n========================================')
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('========================================\n')

  process.exit(0)
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
