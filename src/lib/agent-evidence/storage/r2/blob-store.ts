export class EvidenceBlobTooLarge extends Error {
  constructor(size: number) {
    super(`Evidence body too large for inline storage: ${size} bytes. Enable r2Blobs to offload.`)
    this.name = 'EvidenceBlobTooLarge'
  }
}

export class EvidenceBlobBackend {
  private readonly prefix = 'evidence/'

  constructor(private readonly bucket: R2Bucket) {}

  private key(flowRunId: string, sourceId: number): string {
    return `${this.prefix}${flowRunId}/${sourceId}`
  }

  async put(flowRunId: string, sourceId: number, body: string): Promise<string> {
    const r2Key = this.key(flowRunId, sourceId)
    await this.bucket.put(r2Key, body, {
      httpMetadata: { contentType: 'text/plain; charset=utf-8' },
    })
    return r2Key
  }

  async get(r2Key: string): Promise<string | null> {
    const obj = await this.bucket.get(r2Key)
    if (!obj) return null
    return obj.text()
  }
}
