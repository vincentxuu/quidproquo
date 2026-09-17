export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  steps?: {
    agent: string
    status: 'started' | 'completed'
    chunks_found?: number
    sources_found?: number
    evidence_chunks?: number
  }[]
  sources?: (
    | string
    | {
        title?: unknown
        label?: unknown
        url?: unknown
        source_url?: unknown
        slug?: unknown
        description?: unknown
      }
  )[]
  related?: (
    | string
    | {
        title?: unknown
        label?: unknown
        url?: unknown
        source_url?: unknown
        slug?: unknown
        description?: unknown
      }
  )[]
  confidence?: number
  streaming?: boolean
}
