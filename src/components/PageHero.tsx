import Image from 'next/image'

interface PageHeroProps {
  image: string
  title: string
  subtitle?: string
  priority?: boolean
}

export function PageHero({ image, title, subtitle, priority = true }: PageHeroProps) {
  return (
    <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        priority={priority}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white bg-black/50 backdrop-blur-sm px-12 py-8 rounded-full">
          <h1 className="text-5xl md:text-6xl font-display mb-2">{title}</h1>
          {subtitle && (
            <p className="text-sm tracking-[0.5em] uppercase font-light">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  )
}
