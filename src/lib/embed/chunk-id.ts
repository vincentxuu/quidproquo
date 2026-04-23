type SourceType = 'post' | 'doc' | 'custom'

export async function generateChunkId(
  type: SourceType,
  sourceKey: string,
  chunkIndex: number
): Promise<string> {
  const input = `${sourceKey}::${chunkIndex}`
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  const hex = Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hex.slice(0, 16)
}
