'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X, ZoomIn, ZoomOut, Maximize, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Tenant {
  id: number
  name: string
  slug: string
  suiteNumber?: string
  category?: any
  logo?: any
  status: string
  description?: any
}

interface MapProps {
  tenants: Tenant[]
}

export function InteractiveMap({ tenants }: MapProps) {
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scale, setScale] = useState(1)
  const [hoveredSuite, setHoveredSuite] = useState<string | null>(null)

  // Filter tenants based on search
  const filteredTenants = useMemo(() => {
    if (!searchQuery) return tenants
    const query = searchQuery.toLowerCase()
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.suiteNumber?.toLowerCase().includes(query) ||
        (t.category?.name && t.category.name.toLowerCase().includes(query))
    )
  }, [tenants, searchQuery])

  // Get selected tenant details
  const selectedTenant = useMemo(() => {
    if (!selectedSuite) return null
    return tenants.find((t) => t.suiteNumber === selectedSuite)
  }, [selectedSuite, tenants])

  // Handle suite click
  const handleSuiteClick = (suiteId: string) => {
    setSelectedSuite(suiteId === selectedSuite ? null : suiteId)
  }

  // Handle zoom
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))
  const handleResetZoom = () => setScale(1)

  // Tenant Locations (Coordinates in % relative to the map image)
  // You can easily get these by clicking on the map in "Dev Mode"
  const tenantLocations: Record<string, { x: number; y: number }> = {
    // Example positions - Replace with actual coordinates from your map image
    '101': { x: 15, y: 65 },
    '102': { x: 22, y: 65 },
    '103': { x: 29, y: 65 },
    '104': { x: 36, y: 65 },
    '105': { x: 43, y: 65 },
    '200': { x: 58, y: 55 }, // Anchor
    '301': { x: 75, y: 65 },
    '302': { x: 82, y: 65 },
    '303': { x: 89, y: 65 },
    '401': { x: 15, y: 25 }, // Pad site
    '402': { x: 85, y: 25 }, // Pad site
  }

  // Helper to find tenant for a suite
  const getTenantForSuite = (suiteId: string) => {
    return tenants.find((t) => t.suiteNumber === suiteId)
  }

  // Developer mode to find coordinates
  // Set this to true temporarily to log clicked coordinates to the console
  const DEV_MODE = false

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!DEV_MODE) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    console.log(`Coordinates: { x: ${Math.round(x)}, y: ${Math.round(y)} },`)
    alert(`Coordinates copied to console: { x: ${Math.round(x)}, y: ${Math.round(y)} }`)
  }

  return (
    <div className="flex flex-col lg:flex-row h-[800px] bg-cream-100 rounded-3xl overflow-hidden shadow-2xl border border-secondary-200">
      {/* Sidebar / List View */}
      <div className="w-full lg:w-1/3 bg-white flex flex-col border-r border-secondary-200">
        <div className="p-6 border-b border-secondary-100 bg-cream-50">
          <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">Directory Map</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-secondary-200 bg-white text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredTenants.length > 0 ? (
            filteredTenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => {
                  if (tenant.suiteNumber && tenantLocations[tenant.suiteNumber]) {
                    setSelectedSuite(tenant.suiteNumber)
                    // Reset zoom if needed or pan to location (advanced)
                  } else if (tenant.suiteNumber) {
                     // Fallback if tenant has suite but no map coordinates defined
                     setSelectedSuite(tenant.suiteNumber)
                  }
                }}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedSuite === tenant.suiteNumber
                    ? 'bg-primary-50 border-primary-200 shadow-sm'
                    : 'bg-white border-secondary-100 hover:bg-cream-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedSuite === tenant.suiteNumber ? 'bg-primary-100' : 'bg-secondary-100'
                  }`}>
                    {tenant.logo && typeof tenant.logo === 'object' ? (
                      <Image
                         src={tenant.logo.url}
                         alt={tenant.name}
                         width={24}
                         height={24}
                         className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <MapPin className={`w-5 h-5 ${
                        selectedSuite === tenant.suiteNumber ? 'text-primary-600' : 'text-secondary-400'
                      }`} />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      selectedSuite === tenant.suiteNumber ? 'text-primary-900' : 'text-secondary-900'
                    }`}>{tenant.name}</h3>
                    <p className="text-xs text-secondary-500">
                      {tenant.category?.name} • Suite {tenant.suiteNumber || 'N/A'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-secondary-500">
              No stores found matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 bg-cream-200 overflow-hidden group">
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button onClick={handleZoomIn} className="p-2 bg-white rounded-lg shadow-md hover:bg-cream-50 text-secondary-600">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={handleZoomOut} className="p-2 bg-white rounded-lg shadow-md hover:bg-cream-50 text-secondary-600">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={handleResetZoom} className="p-2 bg-white rounded-lg shadow-md hover:bg-cream-50 text-secondary-600">
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        {/* The Map */}
        <motion.div 
          className="w-full h-full flex items-center justify-center cursor-move"
          drag
          dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
        >
          <motion.div
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="relative w-[1200px] h-[800px] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={handleMapClick}
          >
            {/* Map Image Layer */}
            {/* INSTRUCTIONS: Replace this Image component with your actual map image */}
            {/* 1. Take a screenshot of your PDF map */}
            {/* 2. Save it as public/map-layout.jpg */}
            {/* 3. Update the src below */}
            <div className="absolute inset-0 bg-[#f5f5f4]">
               {/* Placeholder grid for visualization if no image */}
               <div className="w-full h-full opacity-10" 
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
               />
               
               {/* Placeholder road/building shapes (Remove when you have a real image) */}
               <div className="absolute top-[60%] left-[5%] right-[5%] h-[15%] bg-gray-300 rounded-lg"></div>
               <div className="absolute top-[50%] left-[50%] -translate-x-1/2 w-[30%] h-[25%] bg-gray-300 rounded-lg"></div>
               <div className="absolute top-[20%] left-[10%] w-[15%] h-[15%] bg-gray-300 rounded-lg"></div>
               <div className="absolute top-[20%] right-[10%] w-[15%] h-[15%] bg-gray-300 rounded-lg"></div>
               
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <span className="text-4xl font-bold uppercase tracking-widest">Map Image Goes Here</span>
               </div>
            </div>

            {/* Interactive Pins Layer */}
            {Object.entries(tenantLocations).map(([suiteId, coords]) => {
              const tenant = getTenantForSuite(suiteId)
              const isSelected = selectedSuite === suiteId
              const isHovered = hoveredSuite === suiteId
              
              if (!tenant) return null // Only show pins for active tenants

              return (
                <div
                  key={suiteId}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSuiteClick(suiteId)
                  }}
                  onMouseEnter={() => setHoveredSuite(suiteId)}
                  onMouseLeave={() => setHoveredSuite(null)}
                >
                  {/* Pin Marker */}
                  <div className={`
                    relative flex items-center justify-center transition-all duration-300
                    ${isSelected ? 'scale-125 z-20' : 'scale-100 hover:scale-110 z-10'}
                  `}>
                    <div className={`
                      w-8 h-8 rounded-full shadow-lg flex items-center justify-center border-2
                      ${isSelected 
                        ? 'bg-primary-500 border-white text-white' 
                        : isHovered 
                          ? 'bg-white border-primary-500 text-primary-500' 
                          : 'bg-white border-secondary-200 text-secondary-600'
                      }
                    `}>
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    
                    {/* Tooltip on Hover */}
                    <AnimatePresence>
                      {(isHovered || isSelected) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: -45 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-secondary-900 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none"
                        >
                          {tenant.name}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-secondary-900 w-0 h-0" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Selected Store Overlay */}
        <AnimatePresence>
          {selectedTenant && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-6 left-6 right-6 bg-white p-6 rounded-2xl shadow-xl border border-secondary-100 z-20 flex items-start gap-6 max-w-2xl mx-auto"
            >
              <button
                onClick={() => setSelectedSuite(null)}
                className="absolute top-4 right-4 p-1 hover:bg-secondary-100 rounded-full text-secondary-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-24 h-24 rounded-xl bg-cream-50 flex items-center justify-center flex-shrink-0 border border-secondary-100">
                {selectedTenant.logo && typeof selectedTenant.logo === 'object' ? (
                   <Image
                      src={selectedTenant.logo.url}
                      alt={selectedTenant.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                   />
                ) : (
                  <span className="text-2xl font-bold text-secondary-300">
                    {selectedTenant.name.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                   {selectedTenant.status === 'coming-soon' && (
                     <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wide">
                       Coming Soon
                     </span>
                   )}
                   <span className="text-sm font-medium text-secondary-500 uppercase tracking-wide">
                     Suite {selectedTenant.suiteNumber}
                   </span>
                </div>
                
                <h3 className="text-2xl font-display font-bold text-secondary-900 mb-2">
                  {selectedTenant.name}
                </h3>
                
                {selectedTenant.category && (
                  <p className="text-secondary-600 mb-4">{selectedTenant.category.name}</p>
                )}
                
                <div className="flex items-center gap-3">
                  <Link
                    href={`/directory/${selectedTenant.slug}`}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    href="/directory"
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    All Stores
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
