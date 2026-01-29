/**
 * Script to sync exact store descriptions from the legacy website
 */

import pg from 'pg';
import { config } from 'dotenv';

config();

const DATABASE_URI = process.env.DATABASE_URI;

async function fetchDescription(slug) {
  const url = `https://www.theshoppesatnorthbrunswick.com/directory/listing/${slug}/`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Find the description paragraph - it's after hours and before ADDITIONAL DETAILS
    // Pattern: </p>\n<p>DESCRIPTION</p>\n<p><strong>ADDITIONAL DETAILS
    const match = html.match(/<\/p>\s*<p>([^<]+(?:<[^>]+>[^<]*)*)<\/p>\s*<p><strong>ADDITIONAL DETAILS/i);

    if (match) {
      let desc = match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&#8217;/g, "'")
        .replace(/&#8216;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8211;/g, '-')
        .replace(/&#8212;/g, '-')
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&rdquo;/g, '"')
        .replace(/&ldquo;/g, '"')
        .replace(/&ndash;/g, '-')
        .replace(/&mdash;/g, '-')
        .replace(/\s+/g, ' ')
        .trim();

      // Skip if it looks like hours or short text
      if (desc.length > 50 && !desc.match(/^(Monday|Tuesday|Sunday|Hours)/i)) {
        return desc;
      }
    }

    // Alternative: find any substantial paragraph that looks like a description
    const paragraphs = html.match(/<p>([^<]{100,})<\/p>/g);
    if (paragraphs) {
      for (const p of paragraphs) {
        const text = p.replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/&#8217;/g, "'")
          .replace(/&#8220;/g, '"')
          .replace(/&#8221;/g, '"')
          .replace(/\s+/g, ' ')
          .trim();

        // Skip hours, contact info, etc
        if (text.length > 80 &&
            !text.match(/^(Monday|Tuesday|Sunday|Hours|ADDITIONAL|Phone|Website|\d{3})/i) &&
            !text.includes('Driving Directions')) {
          return text;
        }
      }
    }

    return null;
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return null;
  }
}

async function updateDescription(client, slug, description) {
  const richText = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              mode: 'normal',
              text: description,
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          textFormat: 0,
        },
      ],
      direction: 'ltr',
    },
  };

  await client.query(
    'UPDATE tenants SET description = $1 WHERE slug = $2',
    [JSON.stringify(richText), slug]
  );
}

async function main() {
  console.log('='.repeat(60));
  console.log('Syncing Store Descriptions from Legacy Site');
  console.log('='.repeat(60));

  const client = new pg.Client({ connectionString: DATABASE_URI });
  await client.connect();

  // Get all tenant slugs from database
  const result = await client.query('SELECT slug, name FROM tenants ORDER BY name');
  const tenants = result.rows;

  console.log(`\nFound ${tenants.length} tenants in database\n`);

  let updated = 0;
  let skipped = 0;

  for (const tenant of tenants) {
    process.stdout.write(`${tenant.name}... `);

    const description = await fetchDescription(tenant.slug);

    if (description) {
      await updateDescription(client, tenant.slug, description);
      console.log(`OK (${description.substring(0, 50)}...)`);
      updated++;
    } else {
      console.log('No description found');
      skipped++;
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Done! Updated: ${updated}, Skipped: ${skipped}`);
  console.log('='.repeat(60));

  await client.end();
}

main().catch(console.error);
