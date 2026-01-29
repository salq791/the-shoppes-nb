/**
 * Script to upload the fountain image for the About page hero
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { config } from 'dotenv';

config();

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const HERO_WIDTH = 1920;
const HERO_HEIGHT = 800; // Shorter for about page hero (40vh)
const QUALITY = 85;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadImage() {
  const inputPath = 'C:\\Users\\user\\Desktop\\ShoppesAtBrunswick\\Shoppes at North Brunswick Photos\\2 - NB - Fountain.jpg';
  const outputName = 'hero-about-fountain.jpg';

  console.log('Processing fountain image for About page...');
  console.log(`Input: ${inputPath}`);

  try {
    // First get the image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original size: ${metadata.width}x${metadata.height}`);

    // Crop to focus on the fountain - use center position
    const imageBuffer = await sharp(inputPath)
      .resize(HERO_WIDTH, HERO_HEIGHT, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toBuffer();

    console.log(`Final size: ${HERO_WIDTH}x${HERO_HEIGHT}`);

    // Upload to R2
    const key = `media/hero/${outputName}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    }));

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;
    console.log(`Uploaded successfully!`);
    console.log(`URL: ${publicUrl}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

uploadImage();
