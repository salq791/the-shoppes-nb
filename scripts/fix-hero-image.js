/**
 * Script to re-process a hero image with aggressive bottom crop
 * to show more of the plaza and less sky
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
const HERO_HEIGHT = 1080;
const QUALITY = 85;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function fixImage() {
  const inputPath = 'C:\\Users\\user\\Desktop\\ShoppesAtBrunswick\\Shoppes at North Brunswick Photos\\GenAIImage_c26c0a3d-0203-417b-b0d9-e826b213bae4.jpeg';
  const outputName = 'hero-jamba-juice.jpg';

  console.log('Re-processing image with aggressive bottom crop...');
  console.log(`Input: ${inputPath}`);

  try {
    // First get the image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original size: ${metadata.width}x${metadata.height}`);

    // Calculate aggressive crop - take bottom 40% of the image (skip top 60% which is sky)
    const cropTop = Math.floor(metadata.height * 0.50); // Start from 50% down (removes most sky)
    const cropHeight = metadata.height - cropTop;

    console.log(`Cropping: starting at y=${cropTop}, height=${cropHeight}`);

    // Extract bottom portion, then resize
    const imageBuffer = await sharp(inputPath)
      .extract({
        left: 0,
        top: cropTop,
        width: metadata.width,
        height: cropHeight,
      })
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
    console.log(`✓ Uploaded successfully!`);
    console.log(`URL: ${publicUrl}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixImage();
