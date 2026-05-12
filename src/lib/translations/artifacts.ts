import type { TranslationStage } from './types'

export function getArtifactKey(jobId: string, stage: TranslationStage | 'source' | 'final'): string {
  return `translations/${jobId}/${stage}.md`
}

export async function writeArtifact(bucket: R2Bucket, key: string, content: string): Promise<void> {
  await bucket.put(key, content, {
    httpMetadata: { contentType: 'text/markdown; charset=utf-8' },
  })
}

export async function readArtifact(bucket: R2Bucket, key: string): Promise<string> {
  const object = await bucket.get(key)
  if (!object) throw new Error(`Artifact not found: ${key}`)
  return await object.text()
}
