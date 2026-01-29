import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

interface TenantDetail {
  slug: string
  phone?: string
  website?: string
  hours?: string
  description?: string
}

// Convert plain text to Payload CMS Lexical richText format
function toRichText(text: string) {
  return {
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
              text: text,
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
  }
}

const tenantDetails: TenantDetail[] = [
  // Apparel
  {
    slug: 'ann-taylor-loft',
    phone: '(732) 227-1750',
    website: 'https://www.loft.com/',
    hours: 'Mon-Sat: 10am-8pm | Sun: 11am-6pm',
    description: 'Ann Taylor Loft is your go-to destination for everyday glamour. The store serves as your personal stylist, helping you coordinate pieces in ways that reflect your individual style and preferences.',
  },
  {
    slug: 'anthropologie',
    phone: '(732) 565-9870',
    website: 'https://www.anthropologie.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 11am-7pm',
    description: 'Anthropologie offers a curated selection of contemporary fashion and home décor. The store features a sophisticated selection of spot-on trends, vintage-inspired classics and exceptional home furnishings with an ambiance reminiscent of a London boutique.',
  },
  {
    slug: 'banana-republic',
    phone: '(732) 435-0356',
    website: 'https://www.bananarepublic.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 11am-6pm',
    description: 'Banana Republic specializes in elevated design and luxurious fabrications at approachable prices. The retailer offers refined essentials and contemporary seasonal collections including accessories, shoes, personal care, and intimate apparel.',
  },
  {
    slug: 'jos-a-bank',
    phone: '(732) 545-6600',
    website: 'https://www.josbank.com/',
    hours: 'Mon-Fri: 10am-9pm | Sat: 9:30am-9pm | Sun: 10am-6pm',
    description: 'Jos. A. Bank offers a heritage of quality and workmanship spanning 100 years. The store provides an extensive selection of beautifully made, classically styled tailored and casual clothing at prices typically 20 to 30 percent below competitors.',
  },
  {
    slug: 'new-york-company',
    phone: '(732) 545-0620',
    website: 'https://www.nyandcompany.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 12pm-6pm',
    description: 'Fashionable, moderately priced casual and career separates for women, sizes 4-16 and petites; intimate apparel, jewelry and accessories.',
  },
  {
    slug: 'talbots',
    phone: '(732) 214-1258',
    website: 'https://www.talbots.com/',
    hours: 'Mon-Sat: 10am-8pm | Sun: 11am-6pm',
    description: "Talbots is a specialty retailer offering women's classic clothing, shoes and accessories. Founded in 1947, the brand is recognized for signature items including blazers, trenches, white shirts, ballet flats, and pearls.",
  },
  {
    slug: 'white-house-black-market',
    phone: '(732) 227-1980',
    website: 'https://www.whitehouseblackmarket.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 11am-6pm',
    description: 'White House Black Market is a boutique offering real fashion, crafted like couture. Iconic black and white, worn colorfully. The store specializes in curated apparel including perfected black pants, transformative denim, and versatile dresses.',
  },

  // Eat & Drink
  {
    slug: 'chipotle',
    phone: '(732) 342-7272',
    website: 'https://www.chipotle.com/',
    hours: 'Mon-Sat: 11am-10pm | Sun: 11am-9pm',
    description: 'It takes more than great tasting food to make a terrific meal. It takes an awesome location and eating with fun, interesting people. Chipotle focuses on carefully designed spaces that provide a unique dining atmosphere.',
  },
  {
    slug: 'five-guys-burgers-fries',
    phone: '(732) 246-1060',
    website: 'https://www.fiveguys.com/',
    hours: 'Mon-Sun: 11am-10pm',
    description: 'Fast-food chain with made-to-order burgers, fries & hot dogs, plus free peanuts while you wait.',
  },
  {
    slug: 'frutta-bowls',
    phone: '',
    website: '',
    hours: '',
    description: 'Frutta Bowls offers fresh, healthy açaí bowls, smoothies and more.',
  },
  {
    slug: 'haagen-dazs',
    phone: '(732) 565-9090',
    website: 'https://www.haagendazs.us/',
    hours: 'Mon-Sun: 12pm-10pm',
    description: 'Häagen-Dazs is a super premium ice cream brand committed to innovation and distinctive flavors. Their signature offerings include Vanilla Swiss Almond, Butter Pecan and Dulce de Leche.',
  },
  {
    slug: 'jamba-juice',
    phone: '(732) 227-0490',
    website: 'https://www.jambajuice.com/',
    hours: 'Mon-Fri: 7:30am-10pm | Sat: 8:30am-10pm | Sun: 8:30am-9pm',
    description: 'Jamba Juice serves up delicious, nutritious, energizing smoothies and juices with fruit-based drinks designed to contribute toward daily nutritional goals, providing 3-6 servings of fruit per drink.',
  },
  {
    slug: 'saladworks',
    phone: '(732) 543-1997',
    website: 'https://www.saladworks.com/',
    hours: 'Mon-Sat: 11am-9pm | Sun: 12pm-6pm',
    description: "Saladworks emphasizes customization and freedom in salad creation. There are no rules governing salad. Build exactly what you want—whether hearty, spicy, healthy, or comforting. America's Favorite Salad.",
  },
  {
    slug: 'sarku-japan',
    phone: '(732) 640-2700',
    website: 'https://www.sarkujapan.com/',
    hours: 'Mon-Sat: 11am-9pm | Sun: 12pm-6pm',
    description: 'Featuring made-to-order teriyaki and sushi, prepared with high quality ingredients to provide a healthy, nutritious alternative to traditional fast food meals.',
  },
  {
    slug: 'starbucks-coffee',
    phone: '(732) 843-4980',
    website: 'https://www.starbucks.com/',
    hours: 'Mon-Fri: 5:30am-10:30pm | Sat: 6:30am-11pm | Sun: 6:30am-10pm',
    description: 'Starbucks is the premier roaster and retailer of specialty coffee in the world. With every cup, they strive to bring both their Seattle heritage and an exceptional experience to life.',
  },
  {
    slug: 'subway',
    phone: '(732) 658-3152',
    website: 'https://www.subway.com/',
    hours: 'Mon-Sat: 9am-10pm | Sun: 9am-9pm',
    description: "The SUBWAY® brand is the world's largest submarine sandwich chain with more than 37,000 locations around the world. A leading option for quick, nutritious meals that the whole family can enjoy.",
  },
  {
    slug: 'wingstop',
    phone: '(732) 640-2000',
    website: 'https://www.wingstop.com/',
    hours: 'Mon-Sun: 11am-12am',
    description: 'Wingstop is a casual dining restaurant specializing in fresh wings and sides. Fresh never faked wings, hand-cut seasoned fries and any of our famous sides.',
  },
  {
    slug: 'red-brick-pizza',
    phone: '',
    website: '',
    hours: '',
    description: 'Red Brick Pizza offers artisan pizzas made with fresh ingredients.',
  },
  {
    slug: 'mollaga-indian-grill',
    phone: '',
    website: '',
    hours: '',
    description: 'Mollaga Indian Grill is a new, fast-casual concept Indian restaurant.',
  },

  // Specialty
  {
    slug: 'att',
    phone: '(732) 247-2233',
    website: 'https://www.att.com/',
    hours: 'Mon-Sat: 9am-9pm | Sun: 10am-6pm',
    description: 'AT&T offers communication solutions including phones, digital TV packages, and broadband internet service for businesses and consumers.',
  },
  {
    slug: 'bath-body-works',
    phone: '(732) 249-0349',
    website: 'https://www.bathandbodyworks.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 12pm-6pm',
    description: 'Bath & Body Works is the apothecary of the 21st century focused on personal care products. Each product is created to help nourish the spirit, bring a sense of balance, and leave the customer feeling beautiful inside and out.',
  },
  {
    slug: 'prestige-nails',
    phone: '(732) 246-7777',
    website: 'https://www.emnailspa.net/',
    hours: 'Mon-Fri: 9:30am-7pm | Sat: 9am-5:30pm | Sun: 11am-4pm',
    description: 'Prestige Nails provides natural nail care and waxing service all within a relaxed and comfortable environment. Upscale experiences at affordable prices with sanitary and relaxing facilities.',
  },
  {
    slug: 'five-below',
    phone: '(732) 828-1764',
    website: 'https://www.fivebelow.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 10am-6pm',
    description: "Five Below focuses on teens, pre-teens and their parents, offering merchandise including cell phone accessories, remote control vehicles, apparel, nail polish, sports equipment, and seasonal items. Everything, every day, is just $5 and below.",
  },
  {
    slug: 'gamestop',
    phone: '(732) 342-8423',
    website: 'https://www.gamestop.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 11am-6pm',
    description: "GameStop specializes in the most popular new software, hardware and game accessories for PC and next generation game console systems from Sony, Nintendo, Microsoft and Sega. The industry's largest reseller of pre-played games.",
  },
  {
    slug: 'hand-stone',
    phone: '(732) 317-3400',
    website: 'https://www.handandstone.com/',
    hours: 'Mon-Fri: 9am-10pm | Sat: 9am-8pm | Sun: 10am-6pm',
    description: 'Hand & Stone is passionately dedicated to surpassing the expectations of each and every client. Consistently delivering a massage experience of the very highest quality at a truly affordable price.',
  },
  {
    slug: 'hudson-city-savings-bank',
    phone: '(732) 214-0387',
    website: 'https://www.mtb.com/',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'On November 1, 2015, Hudson City Savings Bank merged with and became a part of M&T Bank. The location now offers expanded banking services and financial solutions as part of the M&T Bank family.',
  },
  {
    slug: 'road-runner-sports',
    phone: '(732) 214-8808',
    website: 'https://www.roadrunnersports.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 10am-7pm',
    description: 'Specializing in running shoes, this chain also sells active-wear, fitness gear & nutrition products.',
  },
  {
    slug: 'supercuts',
    phone: '(732) 305-6580',
    website: 'https://www.supercuts.com/',
    hours: 'Mon-Fri: 9am-9pm | Sat: 9am-7pm | Sun: 10am-5pm',
    description: 'At Supercuts, our stylists are some of the best trained in the business. They will listen to you and can recommend the haircut and professional hair care products to help keep your style looking fresh.',
  },
  {
    slug: 'honor-yoga',
    phone: '',
    website: '',
    hours: '',
    description: 'Honor Yoga offers yoga classes for all levels in a welcoming environment.',
  },
  {
    slug: 'european-wax-center',
    phone: '',
    website: 'https://www.waxcenter.com/',
    hours: '',
    description: 'European Wax Center is a leading beauty lifestyle brand offering premium waxing services.',
  },
  {
    slug: 'orange-theory-fitness',
    phone: '',
    website: 'https://www.orangetheory.com/',
    hours: '',
    description: 'Orangetheory Studios are designed to inspire strength. Well-maintained, clean and contemporary spaces make you feel energized and focused.',
  },

  // For Kids
  {
    slug: 'gymboree',
    phone: '(732) 937-9950',
    website: 'https://www.gymboree.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 11am-6pm',
    description: 'Girls and boys clothing and accessories for newborns, toddlers and children up to size 12.',
  },
  {
    slug: 'justice',
    phone: '(732) 246-0073',
    website: 'https://www.shopjustice.com/',
    hours: 'Mon-Sat: 10am-9pm | Sun: 11am-6pm',
    description: 'Justice offers a full line of fashions and accessories including tops, shorts, skirts, pants, jeans, sweaters, dresses, outerwear, and swimwear designed to fit the size and taste of 7 to 14 year old girls.',
  },

  // Services & Offices
  {
    slug: 'airlift-group',
    phone: '(732) 650-0335',
    website: 'https://www.airliftusa.com/',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'Airlift (USA), Inc. is a global logistics Company offering transportation and supply chain management solutions. The company specializes in freight forwarding services for worldwide customers.',
  },
  {
    slug: 'brighter-dental',
    phone: '(732) 258-8700',
    website: 'https://brighterdentalcare.com/',
    hours: 'Mon-Wed: 9am-5pm | Thu: 9am-8pm | Fri: 9am-5pm',
    description: 'The practice offers comprehensive dental services including general dental care, dental implants, orthodontics, periodontics for gum disease, fillings, root canals, and oral surgery.',
  },
  {
    slug: 'psi-testing',
    phone: '(732) 543-2269',
    website: 'https://candidate.psiexams.com/',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'PSI Exams offers a variety of services for Real Estate, Insurance, Construction, Barber, Cosmetology and other professional licenses and certifications.',
  },
  {
    slug: 'north-brunswick-medical-associates',
    phone: '(732) 497-5000',
    website: 'https://www.northbrunswickmedicalassociates.com/',
    hours: 'Mon-Thu: 9am-5pm | Fri: 9am-12pm',
    description: 'The practice is focused on delivering the highest quality medical care for patients.',
  },
  {
    slug: 'remax',
    phone: '(732) 821-6400',
    website: 'https://www.remax.com/',
    hours: 'Mon-Fri: 9am-6pm',
    description: 'From a single office that opened in 1973 in Denver, Colo., RE/MAX has grown into a global real estate network of franchisee-owned and -operated offices with more than 100,000 Sales Associates.',
  },
  {
    slug: 'visiting-nurses-association',
    phone: '(732) 743-4643',
    website: 'https://www.vnahg.org/',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'A nonprofit partnership between VNA Health Group and Robert Wood Johnson University Hospital. The facility provides certified home health services, palliative care, and hospice services across four counties in New Jersey.',
  },
]

async function updateTenantDetails() {
  console.log('Starting tenant details update...\n')

  const payload = await getPayload({ config })

  let updated = 0
  let notFound = 0
  let errors = 0

  for (const detail of tenantDetails) {
    try {
      // Find the tenant by slug
      const tenants = await payload.find({
        collection: 'tenants',
        where: {
          slug: { equals: detail.slug },
        },
        limit: 1,
      })

      if (tenants.docs.length === 0) {
        console.log(`❌ Not found: ${detail.slug}`)
        notFound++
        continue
      }

      const tenant = tenants.docs[0]

      // Prepare update data - only include non-empty fields
      const updateData: Record<string, any> = {}

      if (detail.phone) updateData.phone = detail.phone
      if (detail.website) updateData.website = detail.website
      if (detail.hours) updateData.hours = detail.hours
      if (detail.description) updateData.description = toRichText(detail.description)

      // Update the tenant
      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: updateData,
      })

      console.log(`✅ Updated: ${tenant.name}`)
      updated++
    } catch (error) {
      console.error(`❌ Error updating ${detail.slug}:`, error)
      errors++
    }
  }

  console.log('\n--- Summary ---')
  console.log(`Updated: ${updated}`)
  console.log(`Not found: ${notFound}`)
  console.log(`Errors: ${errors}`)
  console.log(`Total: ${tenantDetails.length}`)

  process.exit(0)
}

updateTenantDetails().catch(console.error)
