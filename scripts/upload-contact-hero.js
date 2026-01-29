/**
 * Script to upload the contact page hero image
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
const HERO_HEIGHT = 800;
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
  const inputPath = 'C:\\Users\\user\\Desktop\\AerialNB.jpg';
  const outputName = 'hero-contact-aerial.jpg';

  console.log('Processing aerial image for Contact page...');
  console.log(`Input: ${inputPath}`);

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original size: ${metadata.width}x${metadata.height}`);

    // Crop to focus on the building - use bottom portion to show more of the plaza
    const imageBuffer = await sharp(inputPath)
      .resize(HERO_WIDTH, HERO_HEIGHT, {
        fit: 'cover',
        position: 'bottom',
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toBuffer();

    console.log(`Final size: ${HERO_WIDTH}x${HERO_HEIGHT}`);

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
