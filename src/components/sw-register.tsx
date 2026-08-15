'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            // Check for updates every 60 minutes
            setInterval(() => {
              registration.update().catch(() => {})
            }, 60 * 60 * 1000)
          })
          .catch((err) => {
            console.warn('SW registration failed:', err)
          })
      })
    }
  }, [])

  return null
}
