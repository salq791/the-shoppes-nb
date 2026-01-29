/**
 * Script to process and upload the site logo to R2
 * - Converts black text to white for dark header backgrounds
 * - Preserves the red accent color
 * - Optimizes for web
 * - Uploads to R2
 *
 * Usage: node scripts/upload-logo.js <path-to-png>
 * Example: node scripts/upload-logo.js "C:\Users\user\Desktop\logo.png"
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config();

// R2 Configuration from .env
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Logo settings
const LOGO_MAX_WIDTH = 500;  // Max width for header logo
const LOGO_MAX_HEIGHT = 150; // Max height for header logo

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Convert black pixels to white, make white background transparent, preserve red accent
 */
async function processLogoColors(inputBuffer) {
  const image = sharp(inputBuffer);

  // Get raw pixel data
  const { data, info } = await image
    .ensureAlpha() // Ensure we have an alpha channel
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  const newData = Buffer.alloc(data.length);

  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4; // RGBA
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];

    // Check pixel characteristics
    const isReddish = r > 120 && r > g * 1.3 && r > b * 1.3;
    const isDark = r < 100 && g < 100 && b < 100;
    const isWhiteOrLight = r > 240 && g > 240 && b > 240;

    if (isWhiteOrLight) {
      // Make white/light background transparent
      newData[offset] = 255;
      newData[offset + 1] = 255;
      newData[offset + 2] = 255;
      newData[offset + 3] = 0; // Fully transparent
    } else if (isDark && !isReddish) {
      // Convert black text to white
      newData[offset] = 255;     // R
      newData[offset + 1] = 255; // G
      newData[offset + 2] = 255; // B
      newData[offset + 3] = 255; // Fully opaque
    } else {
      // Keep original color (red accent and other colors)
      newData[offset] = r;
      newData[offset + 1] = g;
      newData[offset + 2] = b;
      newData[offset + 3] = 255; // Fully opaque
    }
  }

  // Create new image from modified pixel data
  return sharp(newData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  }).png().toBuffer();
}

async function processAndUploadLogo(inputPath) {
  console.log('\n' + '='.repeat(60));
  console.log('Logo Upload Script');
  console.log('='.repeat(60));
  console.log(`\nProcessing: ${inputPath}`);

  try {
    // Read the original image
    const inputBuffer = fs.readFileSync(inputPath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    console.log(`\nOriginal size: ${metadata.width}x${metadata.height}`);
    console.log(`Format: ${metadata.format}`);
    console.log(`Has alpha: ${metadata.hasAlpha}`);

    console.log('\nProcessing: black→white, white background→transparent, preserving red...');

    // Process logo colors
    const whiteTextBuffer = await processLogoColors(inputBuffer);

    // Then resize and optimize
    const processedBuffer = await sharp(whiteTextBuffer)
      .resize(LOGO_MAX_WIDTH, LOGO_MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png({
        quality: 100,
        compressionLevel: 9,
      })
      .toBuffer();

    const processedMetadata = await sharp(processedBuffer).metadata();
    console.log(`\nProcessed size: ${processedMetadata.width}x${processedMetadata.height}`);
    console.log(`File size: ${(processedBuffer.length / 1024).toFixed(2)} KB`);

    // Upload to R2
    const key = 'media/logo/shoppes-logo-white.png';

    console.log(`\nUploading to R2...`);

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: processedBuffer,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=31536000', // Cache for 1 year
    }));

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    console.log('\n' + '='.repeat(60));
    console.log('Upload Complete!');
    console.log('='.repeat(60));
    console.log(`\nLogo URL: ${publicUrl}`);
    console.log('\nTo use this logo, update the site-logo API route or');
    console.log('add it to the Payload media collection with alt text');
    console.log('containing "Shoppes" and "Logo".');

    // Also save a local copy for preview
    const localPreviewPath = path.join(path.dirname(inputPath), 'shoppes-logo-white-preview.png');
    fs.writeFileSync(localPreviewPath, processedBuffer);
    console.log(`\nLocal preview saved to: ${localPreviewPath}`);

    return publicUrl;
  } catch (error) {
    console.error('\nError processing logo:', error.message);
    process.exit(1);
  }
}

async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.log('Usage: node scripts/upload-logo.js <path-to-png>');
    console.log('');
    console.log('This script will:');
    console.log('  1. Invert colors (black → white) for dark backgrounds');
    console.log('  2. Optimize the image for web');
    console.log('  3. Upload to R2 storage');
    console.log('');
    console.log('Example:');
    console.log('  node scripts/upload-logo.js "C:\\Users\\user\\Desktop\\logo.png"');
    process.exit(1);
  }

  // Check if file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  // Check file extension
  const ext = path.extname(inputPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    console.error('Error: Please provide a PNG, JPG, or WebP image file.');
    console.error('Tip: Export your PDF as PNG first (high resolution recommended).');
    process.exit(1);
  }

  await processAndUploadLogo(inputPath);
}

main().catch(console.error);
