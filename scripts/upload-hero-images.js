/**
 * Script to transform, rename, and upload hero images to R2
 *
 * Usage: node scripts/upload-hero-images.js <folder-path>
 * Example: node scripts/upload-hero-images.js "C:\Users\user\Desktop\ShoppesAtBrunswick\Shoppes at North Brunswick Photos"
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

// Image settings for hero carousel
const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;
const QUALITY = 85;

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Hero image naming scheme
const heroImageNames = [
  'hero-shoppes-overview.jpg',
  'hero-starbucks-chipotle.jpg',
  'hero-jamba-juice.jpg',
  'hero-shopping-center.jpg',
  'hero-retail-stores.jpg',
];

async function transformAndUpload(inputPath, outputName) {
  console.log(`\nProcessing: ${path.basename(inputPath)}`);
  console.log(`  → Will be uploaded as: ${outputName}`);

  try {
    // Read and transform the image
    const imageBuffer = await sharp(inputPath)
      .resize(HERO_WIDTH, HERO_HEIGHT, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toBuffer();

    console.log(`  → Resized to ${HERO_WIDTH}x${HERO_HEIGHT}`);

    // Upload to R2
    const key = `media/hero/${outputName}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    }));

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    console.log(`  ✓ Uploaded successfully!`);
    console.log(`  → URL: ${publicUrl}`);

    return publicUrl;
  } catch (error) {
    console.error(`  ✗ Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  const folderPath = process.argv[2];

  if (!folderPath) {
    console.log('Usage: node scripts/upload-hero-images.js <folder-path>');
    console.log('');
    console.log('Example:');
    console.log('  node scripts/upload-hero-images.js "C:\\Users\\user\\Desktop\\ShoppesAtBrunswick\\Shoppes at North Brunswick Photos"');
    process.exit(1);
  }

  // Check if folder exists
  if (!fs.existsSync(folderPath)) {
    console.error(`Error: Folder not found: ${folderPath}`);
    process.exit(1);
  }

  // Get all image files from the folder
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'];
  const files = fs.readdirSync(folderPath)
    .filter(file => supportedExtensions.includes(path.extname(file)))
    .map(file => path.join(folderPath, file));

  if (files.length === 0) {
    console.error('No image files found in the specified folder.');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('Hero Image Upload Script');
  console.log('='.repeat(60));
  console.log(`\nFound ${files.length} image(s) in: ${folderPath}`);
  console.log('\nImages to process:');
  files.forEach((file, i) => {
    console.log(`  ${i + 1}. ${path.basename(file)}`);
  });

  console.log('\n' + '-'.repeat(60));
  console.log('Starting upload process...');
  console.log('-'.repeat(60));

  const uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const outputName = heroImageNames[i] || `hero-image-${i + 1}.jpg`;
    const url = await transformAndUpload(files[i], outputName);
    if (url) {
      uploadedUrls.push(url);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Upload Complete!');
  console.log('='.repeat(60));
  console.log(`\nSuccessfully uploaded ${uploadedUrls.length}/${files.length} images.`);

  if (uploadedUrls.length > 0) {
    console.log('\nUse these URLs in your HeroCarousel component:');
    console.log('\nconst slides = [');
    uploadedUrls.forEach((url, i) => {
      console.log(`  { image: '${url}' },`);
    });
    console.log('];');
  }
}

main().catch(console.error);
