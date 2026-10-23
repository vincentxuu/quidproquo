import { describe, expect, it, vi } from 'vitest'
import { serveLecturePdf } from '../pdfAsset'
import { cachedSlideUrl } from '../catalog'

const bytes = new TextEncoder().encode('%PDF-1.7\nfixture')
function fixture(cached = true) {
  let present = cached
  const meta = { size: bytes.length, httpEtag: '"pdf-v1"', uploaded: new Date('2026-10-01T00:00:00Z') }
  const bucket = {
    head: vi.fn(async () => present ? meta : null),
    put: vi.fn(async (_key: string) => { present = true; return meta }),
    get: vi.fn(async (_key: string, options?: { range?: { offset: number; length: number } }) => {
      const r = options?.range
      return { ...meta, body: new Response(r ? bytes.slice(r.offset, r.offset + r.length) : bytes).body }
    }),
  }
  const fetcher = vi.fn<typeof fetch>(async () => new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } }))
  return { bucket, fetcher }
}
const request = (headers?: HeadersInit) => new Request('https://example.test/api/slides/cs329z-lecture01.pdf', { headers })
describe('lecture PDF asset', () => {
  it('maps only known Stanford lecture URLs', () => {
    expect(cachedSlideUrl('https://web.stanford.edu/class/cs329z/slides/lecture09.pdf')).toBe('/api/slides/cs329z-lecture09.pdf')
    expect(cachedSlideUrl('https://example.test/lecture01.pdf')).toBeNull()
  })
  it('rejects arbitrary asset IDs before accessing storage or fetching', async () => {
    const { bucket, fetcher } = fixture()
    expect((await serveLecturePdf(request(), bucket as unknown as R2Bucket, fetcher, '__proto__')).status).toBe(404)
    expect(bucket.head).not.toHaveBeenCalled()
    expect(fetcher).not.toHaveBeenCalled()
  })
  it('fetches the corresponding allowlisted lecture', async () => {
    const { bucket, fetcher } = fixture(false)
    await serveLecturePdf(request(), bucket as unknown as R2Bucket, fetcher, 'cs329z-lecture09')
    expect(fetcher.mock.calls[0]?.[0]).toBe('https://web.stanford.edu/class/cs329z/slides/lecture09.pdf')
    expect(bucket.put.mock.calls[0]?.[0]).toBe('slides/cs329z/lecture09.pdf')
  })
  it('serves an R2 hit without downloading the upstream PDF', async () => {
    const { bucket, fetcher } = fixture()
    const response = await serveLecturePdf(request(), bucket as unknown as R2Bucket, fetcher)
    expect(await response.text()).toBe(new TextDecoder().decode(bytes))
    expect(fetcher).not.toHaveBeenCalled()
    expect(response.headers.get('Accept-Ranges')).toBe('bytes')
  })
  it('downloads and persists an allowlisted PDF on a miss', async () => {
    const { bucket, fetcher } = fixture(false)
    expect((await serveLecturePdf(request(), bucket as unknown as R2Bucket, fetcher)).status).toBe(200)
    expect(fetcher.mock.calls[0]?.[0]).toBe('https://web.stanford.edu/class/cs329z/slides/lecture01.pdf')
    expect(bucket.put).toHaveBeenCalledOnce()
  })
  it('rejects an HTML error page instead of poisoning R2', async () => {
    const { bucket } = fixture(false)
    const response = await serveLecturePdf(request(), bucket as unknown as R2Bucket, async () => new Response('<html>error</html>', { headers: { 'Content-Type': 'application/pdf' } }))
    expect(response.status).toBe(502)
    expect(bucket.put).not.toHaveBeenCalled()
  })
  it('honors conditional requests and byte ranges', async () => {
    const { bucket, fetcher } = fixture()
    expect((await serveLecturePdf(request({ 'If-None-Match': '"pdf-v1"' }), bucket as unknown as R2Bucket, fetcher)).status).toBe(304)
    const response = await serveLecturePdf(request({ Range: 'bytes=0-4' }), bucket as unknown as R2Bucket, fetcher)
    expect(response.status).toBe(206)
    expect(await response.text()).toBe('%PDF-')
    expect(response.headers.get('Content-Range')).toBe(`bytes 0-4/${bytes.length}`)
  })
  it('rejects non-PDF types and oversized upstream responses', async () => {
    for (const headers of [
      { 'Content-Type': 'text/html' },
      { 'Content-Type': 'application/pdf', 'Content-Length': String(33 * 1024 * 1024) },
    ] as Record<string, string>[]) {
      const { bucket } = fixture(false)
      expect((await serveLecturePdf(request(), bucket as unknown as R2Bucket, async () => new Response(bytes, { headers }))).status).toBe(502)
      expect(bucket.put).not.toHaveBeenCalled()
    }
  })
  it('serves suffix ranges and ignores ranges with a stale If-Range', async () => {
    const { bucket, fetcher } = fixture()
    const suffix = await serveLecturePdf(request({ Range: 'bytes=-7' }), bucket as unknown as R2Bucket, fetcher)
    expect(suffix.status).toBe(206)
    expect(await suffix.text()).toBe('fixture')
    expect((await serveLecturePdf(request({ Range: 'bytes=0-4', 'If-Range': '"old"' }), bucket as unknown as R2Bucket, fetcher)).status).toBe(200)
  })
  it('supports HEAD without reading the object body', async () => {
    const { bucket, fetcher } = fixture()
    const response = await serveLecturePdf(new Request(request(), { method: 'HEAD' }), bucket as unknown as R2Bucket, fetcher)
    expect(response.headers.get('Content-Length')).toBe(String(bytes.length))
    expect(await response.text()).toBe('')
    expect(bucket.get).not.toHaveBeenCalled()
  })
  it('returns 416 for an unsatisfiable range', async () => {
    const { bucket, fetcher } = fixture()
    expect((await serveLecturePdf(request({ Range: 'bytes=999-' }), bucket as unknown as R2Bucket, fetcher)).status).toBe(416)
  })
})
