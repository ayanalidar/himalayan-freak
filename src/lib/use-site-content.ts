'use client'

import { useState, useEffect, useCallback } from 'react'

// Type for the nested content structure: { [page]: { [section]: { ...fields } } }
type SiteContent = Record<string, Record<string, any>>

// Cache across components (single fetch per page load)
let contentCache: SiteContent | null = null
let fetchPromise: Promise<SiteContent> | null = null

async function fetchContent(): Promise<SiteContent> {
  if (contentCache) return contentCache
  if (fetchPromise) return fetchPromise

  fetchPromise = fetch('/api/site-content')
    .then((r) => r.json())
    .then((data) => {
      contentCache = data
      return data
    })
    .catch(() => {
      return {}
    })
    .finally(() => {
      fetchPromise = null
    })

  return fetchPromise
}

// Clear cache (called when admin saves content)
export function clearContentCache() {
  contentCache = null
}

// Hook for a specific page
export function usePageContent(page: string) {
  const [content, setContent] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchContent().then((all) => {
      setContent(all[page] || {})
    })
  }, [page])

  return content
}

// Hook for a specific section on a page
export function useSectionContent(page: string, section: string, fallback: Record<string, any>) {
  const [data, setData] = useState<Record<string, any>>(fallback)

  useEffect(() => {
    fetchContent().then((all) => {
      const sectionData = all?.[page]?.[section]
      if (sectionData && Object.keys(sectionData).length > 0) {
        setData({ ...fallback, ...sectionData })
      }
    })
  }, [page, section])

  return data
}
