const KNOWN_SUFFIXES = new Set([
  '.co.uk',
  '.co.jp',
  '.co.nz',
  '.co.za',
  '.co.in',
  '.com',
  '.org',
  '.net',
  '.io',
  '.ai',
  '.edu',
  '.gov',
  '.app',
  '.dev',
  '.tech',
  '.info',
  '.biz',
  '.uk',
  '.us',
  '.de',
  '.fr',
  '.jp',
  '.cn',
  '.au',
  '.ca',
  '.br',
])

export function domainOf(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    // Check two-segment known suffixes first (e.g. .co.uk)
    for (const suffix of KNOWN_SUFFIXES) {
      if (suffix.includes('.', 1) && hostname.endsWith(suffix)) {
        // e.g. www.example.co.uk → example.co.uk
        const withoutSuffix = hostname.slice(0, hostname.length - suffix.length)
        const parts = withoutSuffix.split('.')
        return parts[parts.length - 1] + suffix
      }
    }
    // Default: last two segments
    const parts = hostname.split('.')
    return parts.slice(-2).join('.')
  } catch {
    return url
  }
}
