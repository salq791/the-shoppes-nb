/**
 * Script to upload gallery images to R2 via Payload CMS
 * This creates proper media entries and gallery-images records
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import pg from 'pg';

config();

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
const DATABASE_URI = process.env.DATABASE_URI;

// Image settings
const GALLERY_WIDTH = 1200;
const GALLERY_HEIGHT = 800;
const THUMB_WIDTH = 300;
const THUMB_HEIGHT = 300;
const CARD_WIDTH = 600;
const CARD_HEIGHT = 400;
const QUALITY = 85;

// S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Gallery images to process
const galleryImages = [
  {
    file: '1 - NB - Starbucks-Chipotle End.jpg',
    caption: 'Starbucks & Chipotle',
    alt: 'Starbucks and Chipotle storefronts at The Shoppes at North Brunswick',
    order: 1,
  },
  {
    file: '2 - NB - Fountain.jpg',
    caption: 'Plaza Fountain',
    alt: 'Decorative fountain at The Shoppes at North Brunswick plaza',
    order: 2,
  },
  {
    file: 'Shoppes at North Brunswick - Google Earth - 1.jpg',
    caption: 'Aerial View',
    alt: 'Aerial view of The Shoppes at North Brunswick shopping center',
    order: 3,
  },
  {
    file: 'Shoppes at North Brunswick (2).JPG',
    caption: 'Shopping Center',
    alt: 'The Shoppes at North Brunswick shopping center exterior',
    order: 4,
  },
  {
    file: 'Shoppes at North Brunswick (7).jpg',
    caption: 'Retail Stores',
    alt: 'Retail stores at The Shoppes at North Brunswick',
    order: 5,
  },
];

const folderPath = 'C:\\Users\\user\\Desktop\\ShoppesAtBrunswick\\Shoppes at North Brunswick Photos';

async function uploadToR2(buffer, key, contentType = 'image/jpeg') {
  await s3Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return `${R2_PUBLIC_URL}/${key}`;
}

async function processAndUploadImage(inputPath, baseName) {
  console.log(`  Processing: ${path.basename(inputPath)}`);

  const metadata = await sharp(inputPath).metadata();
  console.log(`    Original: ${metadata.width}x${metadata.height}`);

  // Create main image
  const mainBuffer = await sharp(inputPath)
    .resize(GALLERY_WIDTH, GALLERY_HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer();

  // Create thumbnail
  const thumbBuffer = await sharp(inputPath)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: QUALITY })
    .toBuffer();

  // Create card size
  const cardBuffer = await sharp(inputPath)
    .resize(CARD_WIDTH, CARD_HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: QUALITY })
    .toBuffer();

  // Upload all versions
  const mainKey = `media/gallery/${baseName}.jpg`;
  const thumbKey = `media/gallery/${baseName}-thumb.jpg`;
  const cardKey = `media/gallery/${baseName}-card.jpg`;

  const mainUrl = await uploadToR2(mainBuffer, mainKey);
  const thumbUrl = await uploadToR2(thumbBuffer, thumbKey);
  const cardUrl = await uploadToR2(cardBuffer, cardKey);

  console.log(`    Uploaded: ${mainUrl}`);

  return {
    url: mainUrl,
    thumbnailUrl: thumbUrl,
    cardUrl: cardUrl,
    width: GALLERY_WIDTH,
    height: GALLERY_HEIGHT,
    filename: `${baseName}.jpg`,
    thumbFilename: `${baseName}-thumb.jpg`,
    cardFilename: `${baseName}-card.jpg`,
  };
}

async function insertIntoDatabase(client, galleryItem, uploadedImage) {
  // Insert into media table with correct snake_case column names
  const mediaResult = await client.query(`
    INSERT INTO media (
      alt,
      url,
      filename,
      mime_type,
      width,
      height,
      filesize,
      thumbnail_u_r_l,
      prefix,
      sizes_thumbnail_url,
      sizes_thumbnail_width,
      sizes_thumbnail_height,
      sizes_thumbnail_mime_type,
      sizes_thumbnail_filename,
      sizes_card_url,
      sizes_card_width,
      sizes_card_height,
      sizes_card_mime_type,
      sizes_card_filename,
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())
    RETURNING id
  `, [
    galleryItem.alt,
    uploadedImage.url,
    uploadedImage.filename,
    'image/jpeg',
    uploadedImage.width,
    uploadedImage.height,
    0,
    uploadedImage.thumbnailUrl,
    'media/gallery',
    uploadedImage.thumbnailUrl,
    THUMB_WIDTH,
    THUMB_HEIGHT,
    'image/jpeg',
    uploadedImage.thumbFilename,
    uploadedImage.cardUrl,
    CARD_WIDTH,
    CARD_HEIGHT,
    'image/jpeg',
    uploadedImage.cardFilename,
  ]);

  const mediaId = mediaResult.rows[0].id;
  console.log(`    Media ID: ${mediaId}`);

  // Insert into gallery_images table
  const galleryResult = await client.query(`
    INSERT INTO gallery_images (
      image_id,
      caption,
      "order",
      created_at,
      updated_at
    ) VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING id
  `, [
    mediaId,
    galleryItem.caption,
    galleryItem.order,
  ]);

  const galleryId = galleryResult.rows[0].id;
  console.log(`    Gallery ID: ${galleryId}`);

  return { mediaId, galleryId };
}

async function main() {
  console.log('='.repeat(60));
  console.log('Gallery Image Upload Script');
  console.log('='.repeat(60));

  // Connect to database
  const client = new pg.Client({ connectionString: DATABASE_URI });
  await client.connect();
  console.log('\nConnected to database');

  try {
    for (const item of galleryImages) {
      const inputPath = path.join(folderPath, item.file);

      if (!fs.existsSync(inputPath)) {
        console.log(`\nSkipping (not found): ${item.file}`);
        continue;
      }

      console.log(`\nProcessing: ${item.file}`);

      // Create a safe filename
      const baseName = `gallery-${item.order}-${item.caption.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      // Process and upload image
      const uploadedImage = await processAndUploadImage(inputPath, baseName);

      // Insert into database
      await insertIntoDatabase(client, item, uploadedImage);

      console.log(`    Done!`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('Upload Complete!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
