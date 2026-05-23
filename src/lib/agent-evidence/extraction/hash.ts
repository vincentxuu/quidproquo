// Deterministic claim hash: lowercase, trim, collapse whitespace, drop trailing punctuation, then SHA-256.
// In Cloudflare Workers, crypto.subtle.digest is available globally via the Web Crypto API.
export async function claimHash(text: string): Promise<string> {
  const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.!?,;]+$/, '')
  const encoded = new TextEncoder().encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
