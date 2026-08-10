/**
 * Analytics events (GA4).
 *
 * The tag itself lives in index.html and only loads on the production host,
 * but `gtag` is always defined there — so calling track() off production
 * queues harmlessly into dataLayer instead of throwing. That means no
 * environment checks at call sites and no risk of an analytics call breaking
 * a conversion path.
 *
 * Page views come free (navigation is full page loads of prerendered pages).
 * These are the moments page views can't tell us about: intent and capture.
 */
type GtagEvent = 'book_call_opened' | 'lead_captured'

export function track(event: GtagEvent, params?: Record<string, string | number>): void {
  try {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
    g?.('event', event, params)
  } catch {
    /* analytics must never break the thing it measures */
  }
}
