'use client'

import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

interface SocialLink {
  platform: string
  url: string
}

interface SocialLinksProps {
  links: SocialLink[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outline'
  className?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function SocialLinks({
  links,
  size = 'md',
  variant = 'default',
  className = '',
}: SocialLinksProps) {
  const getVariantClasses = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: 'hover:bg-[#1877F2] hover:text-white',
      instagram: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white',
      twitter: 'hover:bg-[#1DA1F2] hover:text-white',
      youtube: 'hover:bg-[#FF0000] hover:text-white',
      linkedin: 'hover:bg-[#0A66C2] hover:text-white',
    }

    switch (variant) {
      case 'filled':
        return `bg-secondary-100 text-secondary-600 ${colors[platform] || 'hover:bg-primary-500 hover:text-white'}`
      case 'outline':
        return `border-2 border-secondary-200 text-secondary-600 hover:border-primary-500 hover:text-primary-500`
      default:
        return `text-secondary-500 hover:text-primary-500`
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = iconMap[link.platform.toLowerCase()]
        if (!Icon) return null

        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 ${getVariantClasses(link.platform.toLowerCase())}`}
            aria-label={`Follow us on ${link.platform}`}
          >
            <Icon className={iconSizeClasses[size]} />
          </a>
        )
      })}
    </div>
  )
}
