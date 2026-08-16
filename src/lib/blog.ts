/** Shared blog helpers. Dates are formatted in UTC so the server-rendered
 *  HTML and the hydrated client always agree, whatever the visitor's zone. */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
