import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { GalleryLightbox } from '@/components/GalleryLightbox'

export const revalidate = 60

async function getGalleryImages() {
  const payload = await getPayloadClient()
  const images = await payload.find({
    collection: 'gallery-images',
    sort: 'order',
    limit: 100,
  })
  return images.docs
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://pub-fd2ebfacd1a646a9935b8836eea536cf.r2.dev/media/gallery/gallery-3-aerial-view.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-display mb-4">Photo Gallery</h1>
            <p className="text-sm tracking-[0.5em] uppercase font-light">Experience Our Center</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="max-w-7xl mx-auto breadcrumb-text">
          <Link href="/" className="hover:text-[#a1413b]">Home</Link>
          {' / '}
          <span className="text-gray-900 dark:text-white">Photo Gallery</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="section-subheading">Experience The Shoppes</span>
            <h2 className="section-heading mt-2">Photo Gallery</h2>
          </div>

          {images.length > 0 ? (
            <GalleryLightbox
              images={images
                .filter((item: any) => item.image && typeof item.image === 'object')
                .map((item: any) => ({
                  id: item.id,
                  image: {
                    url: item.image.url || '',
                    alt: item.image.alt,
                    width: item.image.width || 600,
                    height: item.image.height || 400,
                  },
                  caption: item.caption,
                }))}
            />
          ) : (
            <div className="text-center py-16">
              <span className="material-icons text-4xl text-gray-300 mb-4">photo_library</span>
              <p className="text-gray-500">Gallery photos coming soon</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
