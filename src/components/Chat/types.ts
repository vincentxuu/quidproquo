export interface Step {
  id?: string
  label: string
  description?: string
  status: 'pending' | 'active' | 'complete'
  tool?: string
  results?: {
    title: string
    url: string
    slug?: string
    type?: string
  }[]
  content?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  steps?: Step[]
  reasoning?: {
    stage: string
    text: string
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
