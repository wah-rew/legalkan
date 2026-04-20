'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
    if (!key) return
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      session_recording: { maskAllInputs: false },
    })
  }, [])
  return <PHProvider client={posthog}>{children}</PHProvider>
}

/**
 * Safe PostHog event capture wrapper.
 * Only fires when PostHog is loaded and we're in the browser.
 */
export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture(event, properties)
  }
}
