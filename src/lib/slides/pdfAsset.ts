import { SLIDE_ASSETS } from './catalog'
const MAX_BYTES = 32 * 1024 * 1024

async function populate(bucket: R2Bucket, fetcher: typeof fetch, source: string, key: string) {
  const response = await fetcher(source, { redirect: 'error', signal: AbortSignal.timeout(30_000) })
  if (!response.ok || response.headers.get('content-type')?.split(';')[0].trim() !== 'application/pdf') {
    throw new Error('Invalid PDF response')
  }
  if (Number(response.headers.get('content-length')) > MAX_BYTES || !response.body) throw new Error('PDF exceeds limit')
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BYTES) throw new Error('PDF exceeds limit')
      chunks.push(value)
    }
  } finally {
    await reader.cancel().catch(() => {})
  }
  const data = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.length }
  if (new TextDecoder().decode(data.subarray(0, 5)) !== '%PDF-') throw new Error('Invalid PDF signature')
  await bucket.put(key, data, { httpMetadata: { contentType: 'application/pdf' }, onlyIf: { etagDoesNotMatch: '*' } })
}

function parseRange(value: string, size: number): { offset: number; length: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value)
  if (!match || (!match[1] && !match[2])) return null
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]))
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return null
  return { offset: start, length: end - start + 1 }
}

/** Asset IDs select a fixed allowlist; callers cannot supply an origin URL or R2 key. */
export async function serveLecturePdf(request: Request, bucket: R2Bucket, fetcher: typeof fetch = fetch, assetId = 'cs329z-lecture01'): Promise<Response> {
  const asset = Object.hasOwn(SLIDE_ASSETS, assetId) ? SLIDE_ASSETS[assetId] : undefined
  if (!asset) return new Response('Unknown slide asset', { status: 404 })
  const key = asset.key
  try {
    let metadata = await bucket.head(key)
    if (!metadata) {
      await populate(bucket, fetcher, asset.source, key)
      metadata = await bucket.head(key)
    }
    if (!metadata) throw new Error('PDF unavailable')
    const headers = new Headers({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${assetId}.pdf"`,
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'Accept-Ranges': 'bytes',
      'ETag': metadata.httpEtag,
      'Last-Modified': metadata.uploaded.toUTCString(),
      'X-Content-Type-Options': 'nosniff',
    })
    const etags = request.headers.get('If-None-Match')
    const modifiedSince = request.headers.get('If-Modified-Since')
    if (etags ? etags.split(',').some(tag => tag.trim() === '*' || tag.trim().replace(/^W\//, '') === metadata.httpEtag)
      : modifiedSince && Math.floor(metadata.uploaded.getTime() / 1000) <= Math.floor(Date.parse(modifiedSince) / 1000)) {
      return new Response(null, { status: 304, headers })
    }
    const rangeValue = request.method === 'HEAD' ? null : request.headers.get('Range')
    const ifRange = request.headers.get('If-Range')
    const allowRange = !ifRange || ifRange === metadata.httpEtag || Date.parse(ifRange) >= Math.floor(metadata.uploaded.getTime() / 1000) * 1000
    const range = rangeValue && allowRange ? parseRange(rangeValue, metadata.size) : undefined
    if (range === null) {
      headers.set('Content-Range', `bytes */${metadata.size}`)
      return new Response(null, { status: 416, headers })
    }
    headers.set('Content-Length', String(range ? range.length : metadata.size))
    if (range) headers.set('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${metadata.size}`)
    if (request.method === 'HEAD') return new Response(null, { headers })
    const object = await bucket.get(key, range ? { range } : undefined)
    if (!object) throw new Error('PDF unavailable')
    return new Response(object.body, { status: range ? 206 : 200, headers })
  } catch {
    return new Response('Slides are temporarily unavailable. Please use the official PDF link.', {
      status: 502, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
