'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SearchResult {
  id: string
  name: string
  slug: string
  suiteNumber?: string
  category?: string
  status: string
  logo?: string
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Directory', href: '/directory' },
  { name: 'News & Events', href: '/news' },
  { name: 'Photo Gallery', href: '/gallery' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Leasing Opportunity', href: '/leasing' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Fetch site logo
  useEffect(() => {
    fetch('/api/site-logo')
      .then(res => res.json())
      .then(data => {
        setLogoUrl(data.url || null)
        setLogoLoaded(true)
      })
      .catch(() => {
        setLogoLoaded(true)
      })
  }, [])

  // Search function
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, performSearch])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const selected = searchResults[selectedIndex]
      if (selected) {
        window.location.href = `/directory/${selected.slug}`
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Top utility bar */}
      <div className="utility-bar hidden lg:flex">
        <div className="flex gap-4">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=The+Shoppes+at+North+Brunswick,+North+Brunswick,+NJ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white font-medium hover:text-[#a1413b] transition-colors"
          >
            <span className="material-icons text-xs">location_on</span>
            Directions
          </a>
        </div>
        <div className="flex gap-4 items-center">
          <a
            href="/api/documents/file/Store-Directory-Map.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
          >
            <span className="material-icons text-xs">print</span>
            Print Directory
          </a>
          <div className="flex gap-3 ml-4">
            <a href="https://www.facebook.com/theshoppesatnorthbrunswick/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <span className="material-icons text-xs">facebook</span>
            </a>
            <a href="https://twitter.com/Shoppes_NB" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <span className="material-icons text-xs">tag</span>
            </a>
            <a href="/contact" className="hover:text-white transition-colors">
              <span className="material-icons text-xs">email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-black py-4 sticky top-0 z-50 overflow-hidden">
        <div className="w-full px-4 lg:px-6 xl:px-12 flex items-center justify-between">
          {/* Logo - centered area */}
          <div className="flex-shrink-0 xl:pl-[8%] 2xl:pl-[12%]">
            <Link href="/" className="group py-2 block">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="The Shoppes at North Brunswick"
                  width={380}
                  height={112}
                  className="h-24 xl:h-28 w-auto object-contain mix-blend-lighten"
                  priority
                />
              ) : logoLoaded ? (
                <div className="flex flex-col">
                  <span className="text-white text-lg xl:text-xl font-display tracking-[0.2em] leading-tight">
                    THE SHOPPES <span className="text-[#a1413b] italic">at</span>
                  </span>
                  <span className="text-white text-xs xl:text-sm tracking-[0.4em] font-light border-t border-gray-700 mt-1 pt-1">
                    NORTH BRUNSWICK
                  </span>
                </div>
              ) : null}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            {/* Decorative line */}
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-700 to-transparent mr-4 xl:mr-8" />

            <nav className="flex items-center gap-3 lg:gap-4 xl:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link whitespace-nowrap ${isActive(item.href) ? 'nav-link-active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white hover:text-[#a1413b] transition-colors ml-2"
              >
                <span className="material-icons text-xl">search</span>
              </button>
            </nav>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery('')
                setSearchResults([])
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] w-full max-w-2xl px-4"
            >
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-zinc-800">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search stores, restaurants, services..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setSelectedIndex(-1)
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-lg outline-none bg-transparent placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Search results */}
                {(searchResults.length > 0 || isSearching) && (
                  <div className="max-h-[400px] overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        Searching...
                      </div>
                    ) : (
                      <ul>
                        {searchResults.map((result, index) => (
                          <li key={result.id}>
                            <Link
                              href={`/directory/${result.slug}`}
                              onClick={() => {
                                setSearchOpen(false)
                                setSearchQuery('')
                                setSearchResults([])
                              }}
                              className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${
                                index === selectedIndex ? 'bg-gray-100 dark:bg-zinc-800' : ''
                              }`}
                            >
                              <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-[#a1413b]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {result.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {result.category}
                                  {result.suiteNumber && ` • Suite ${result.suiteNumber}`}
                                </p>
                              </div>
                              {result.status === 'coming-soon' && (
                                <span className="px-2 py-1 text-xs font-semibold bg-[#a1413b]/10 text-[#a1413b] uppercase tracking-wider">
                                  Coming Soon
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No stores found for &ldquo;{searchQuery}&rdquo;</p>
                    <Link
                      href="/directory"
                      className="inline-block mt-4 text-[#a1413b] hover:underline font-medium"
                      onClick={() => setSearchOpen(false)}
                    >
                      Browse all stores
                    </Link>
                  </div>
                )}

                {/* Keyboard hints */}
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-center gap-6 text-xs text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">Enter</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">Esc</kbd>
                    close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black sm:max-w-sm lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <Link href="/" className="flex flex-col" onClick={() => setMobileMenuOpen(false)}>
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt="The Shoppes at North Brunswick"
                      width={280}
                      height={80}
                      className="h-20 w-auto object-contain mix-blend-lighten"
                    />
                  ) : (
                    <>
                      <span className="text-white text-xl font-display tracking-[0.2em] leading-tight">
                        THE SHOPPES <span className="text-[#a1413b] italic">at</span>
                      </span>
                      <span className="text-white text-sm tracking-[0.4em] font-light border-t border-gray-700 mt-1 pt-1">
                        NORTH BRUNSWICK
                      </span>
                    </>
                  )}
                </Link>
                <button
                  type="button"
                  className="text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile search */}
              <div className="p-4 border-b border-gray-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSearchOpen(true)
                  }}
                  className="flex items-center gap-3 w-full p-3 bg-zinc-900 text-gray-400 text-sm"
                >
                  <Search className="w-5 h-5" />
                  <span>Search stores...</span>
                </button>
              </div>

              {/* Mobile nav links */}
              <div className="p-4">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-3 text-base font-display font-normal tracking-wide ${
                        isActive(item.href)
                          ? 'text-white border-l-2 border-[#a1413b]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile contact info */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-[#a1413b] text-sm">schedule</span>
                      <span>Mon-Sat: 10am-9pm, Sun: 11am-6pm</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-[#a1413b] text-sm">location_on</span>
                      <span>650 Shoppes Blvd, North Brunswick, NJ</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-[#a1413b] text-sm">phone</span>
                      <span>1-908-274-0530</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
