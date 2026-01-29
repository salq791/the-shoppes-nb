'use client'

import { useEffect, useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string
            includedLanguages?: string
            layout?: number
            autoDisplay?: boolean
          },
          element: string
        ) => void
      }
    }
    googleTranslateElementInit: () => void
  }
}

export function GoogleTranslate() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Define the callback before loading the script
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'es,zh-CN,hi,pt,ko,vi,tl,ar,ru,ja',
          layout: 0,
          autoDisplay: false,
        },
        'google_translate_element'
      )
      setIsLoaded(true)
    }

    // Check if script already exists
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    } else if (window.google?.translate) {
      window.googleTranslateElementInit()
    }
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">Translate</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 bg-cream-50 rounded-lg shadow-xl border border-secondary-100 p-2 z-50 min-w-[200px]">
          <div
            id="google_translate_element"
            className={`notranslate ${isLoaded ? '' : 'opacity-50'}`}
          />
          {!isLoaded && (
            <p className="text-xs text-secondary-400 p-2">Loading translator...</p>
          )}
        </div>
      )}

      {/* Hide Google Translate branding with CSS */}
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        div#goog-gt- {
          display: none !important;
        }
        .goog-te-gadget {
          font-family: inherit !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          font-size: 14px !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value {
          color: inherit !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: none;
        }
        .goog-te-gadget-simple .goog-te-menu-value:before {
          content: 'Select Language';
        }
        .goog-te-menu-frame {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
