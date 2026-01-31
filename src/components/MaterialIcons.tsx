'use client'

import { useEffect } from 'react'

export function MaterialIcons() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap'
    document.head.appendChild(link)
  }, [])

  return null
}
