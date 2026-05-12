import type { CloudPost } from './content-posts'

interface KnowledgeGraphPrototypeInput {
  minEntityFrequency?: number
  topNodes?: number
  minCoOccurrence?: number
  topEdges?: number
}

interface EntityRecord {
  id: string
  label: string
  type: 'tag' | 'topic'
  postCount: number
  posts: string[]
}

interface EdgeRecord {
  source: string
  target: string
  weight: number
  sample_posts: string[]
}

interface EntityBucket {
  id: string
  label: string
  type: 'tag' | 'topic'
  posts: Set<string>
}

interface EdgeBucket {
  source: string
  target: string
  weight: number
  posts: string[]
}

interface GraphComponent {
  nodes: string[]
  size: number
  top_edges: number
  sample_nodes: string[]
}

export interface KnowledgeGraphPrototypeReport {
  generated_at: string
  inputs: {
    min_entity_frequency: number
    top_nodes: number
    min_co_occurrence: number
    top_edges: number
  }
  summary: {
    posts_analyzed: number
    entities: number
    edges: number
    components: number
    connected_entities: number
    top_nodes: number
  }
  entities: EntityRecord[]
  edges: EdgeRecord[]
  components: GraphComponent[]
  notes: string[]
}

const DEFAULT_MIN_ENTITY_FREQUENCY = 2
const DEFAULT_TOP_NODES = 80
const DEFAULT_MIN_CO_OCCURRENCE = 2
const DEFAULT_TOP_EDGES = 180
const MAX_ENTITIES_PER_POST = 20
const MAX_EDGE_SAMPLES = 5

export function runKnowledgeGraphPrototype(posts: CloudPost[], input: KnowledgeGraphPrototypeInput = {}): KnowledgeGraphPrototypeReport {
  const minEntityFrequency = normalizePositiveInt(input.minEntityFrequency, DEFAULT_MIN_ENTITY_FREQUENCY, 2, 50)
  const topNodes = normalizePositiveInt(input.topNodes, DEFAULT_TOP_NODES, 10, 500)
  const minCoOccurrence = normalizePositiveInt(input.minCoOccurrence, DEFAULT_MIN_CO_OCCURRENCE, 2, 20)
  const topEdges = normalizePositiveInt(input.topEdges, DEFAULT_TOP_EDGES, 20, 1000)

  const notes: string[] = []
  if (posts.length === 0) {
    return {
      generated_at: new Date().toISOString(),
      inputs: {
        min_entity_frequency: minEntityFrequency,
        top_nodes: topNodes,
        min_co_occurrence: minCoOccurrence,
        top_edges: topEdges,
      },
      summary: {
        posts_analyzed: 0,
        entities: 0,
        edges: 0,
        components: 0,
        connected_entities: 0,
        top_nodes: topNodes,
      },
      entities: [],
      edges: [],
      components: [],
      notes: ['No cloud posts available for graph prototype scan.'],
    }
  }

  const entityBuckets = new Map<string, EntityBucket>()
  const edgeBuckets = new Map<string, EdgeBucket>()

  for (const post of posts) {
    const entities = collectPostEntities(post)
      .filter((entity) => entity.id && entity.id.length > 1)
    const uniqueEntities = dedupeById(entities).slice(0, MAX_ENTITIES_PER_POST)

    for (const entity of uniqueEntities) {
      const bucket = entityBuckets.get(entity.id) ?? {
        id: entity.id,
        label: entity.label,
        type: entity.type,
        posts: new Set(),
      }
      bucket.posts.add(post.slug)
      entityBuckets.set(entity.id, bucket)
    }

    for (let i = 0; i < uniqueEntities.length; i += 1) {
      for (let j = i + 1; j < uniqueEntities.length; j += 1) {
        const left = uniqueEntities[i]
        const right = uniqueEntities[j]
        const source = left.id < right.id ? left.id : right.id
        const target = left.id < right.id ? right.id : left.id
        const key = `${source}||${target}`
        const edgeBucket = edgeBuckets.get(key) ?? {
          source,
          target,
          weight: 0,
          posts: [],
        }
        edgeBucket.weight += 1
        if (!edgeBucket.posts.includes(post.slug) && edgeBucket.posts.length < MAX_EDGE_SAMPLES) {
          edgeBucket.posts.push(post.slug)
        }
        edgeBuckets.set(key, edgeBucket)
      }
    }
  }

  const filteredEntities = Array.from(entityBuckets.values())
    .filter((entity) => entity.posts.size >= minEntityFrequency)
    .sort((a, b) => b.posts.size - a.posts.size || a.label.localeCompare(b.label))
    .slice(0, topNodes)
  const entityIds = new Set(filteredEntities.map((entity) => entity.id))

  const edges = Array.from(edgeBuckets.values())
    .filter((edge) => edge.weight >= minCoOccurrence && entityIds.has(edge.source) && entityIds.has(edge.target))
    .sort((a, b) => b.weight - a.weight || a.source.localeCompare(b.source) || a.target.localeCompare(b.target))
    .slice(0, topEdges)

  const components = buildComponents(entityIds, edges)
  const componentCount = components.length
  const topComponentCount = components.filter((item) => item.nodes.length > 1).length
  if (componentCount === 0) {
    notes.push('No valid co-occurrence component above threshold; consider lowering minEntityFrequency or minCoOccurrence.')
  } else if (topComponentCount > 0) {
    notes.push(`Built ${topComponentCount} connected component(s) above threshold.`)
  }

  return {
    generated_at: new Date().toISOString(),
    inputs: {
      min_entity_frequency: minEntityFrequency,
      top_nodes: topNodes,
      min_co_occurrence: minCoOccurrence,
      top_edges: topEdges,
    },
    summary: {
      posts_analyzed: posts.length,
      entities: filteredEntities.length,
      edges: edges.length,
      components: componentCount,
      connected_entities: components.reduce((sum, item) => sum + item.nodes.length, 0),
      top_nodes: topNodes,
    },
    entities: filteredEntities.map((entity) => ({
      id: entity.id,
      label: entity.label,
      type: entity.type,
      postCount: entity.posts.size,
      posts: [...entity.posts].sort(),
    })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight,
      sample_posts: edge.posts,
    })),
    components: components
      .sort((a, b) => b.size - a.size)
      .slice(0, 20)
      .map((item) => ({
        nodes: item.nodes,
        size: item.nodes.length,
        top_edges: item.topEdges,
        sample_nodes: item.nodes.slice(0, 4),
      })),
    notes,
  }
}

function collectPostEntities(post: CloudPost): Array<{ id: string; label: string; type: 'tag' | 'topic' }> {
  const tags = post.tags
    .map((tag) => normalizeEntity(tag))
    .filter((value) => value)
    .map((value) => ({ id: value, label: value, type: 'tag' as const }))

  const topicTokens = extractEntityTokens(`${post.title}\n${extractHeadings(post.content)}`)
    .map((value) => normalizeEntity(value))
    .filter((value) => value)
    .filter((value) => value.length >= 2)
    .map((value) => ({ id: value, label: value, type: 'topic' as const }))

  return [...tags, ...topicTokens]
}

function extractEntityTokens(text: string): string[] {
  const latin = text.match(/\b[a-z][a-z0-9\-_.]+\b/gi) ?? []
  const chinese = text.match(/[\u4e00-\u9fff]{2,}/g) ?? []
  const raw = [...latin, ...chinese]
  return raw
    .map((value) => value.toLowerCase())
    .filter((value, index, arr) => value && arr.indexOf(value) === index)
}

function extractHeadings(content: string): string {
  return content
    .split('\n')
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, ''))
    .join(' ')
}

function dedupeById(entities: Array<{ id: string; label: string; type: 'tag' | 'topic' }>): Array<{
  id: string
  label: string
  type: 'tag' | 'topic'
}> {
  const seen = new Set<string>()
  const deduped: Array<{ id: string; label: string; type: 'tag' | 'topic' }> = []
  for (const item of entities) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    deduped.push(item)
  }
  return deduped
}

function buildComponents(
  nodeIds: Set<string>,
  edges: Array<{ source: string; target: string; weight: number }>,
): Array<{ nodes: string[]; topEdges: number; size: number }> {
  const adjacency = new Map<string, Set<string>>()
  for (const nodeId of nodeIds) {
    adjacency.set(nodeId, new Set())
  }

  for (const edge of edges) {
    const sourceNeighbors = adjacency.get(edge.source)
    const targetNeighbors = adjacency.get(edge.target)
    if (!sourceNeighbors || !targetNeighbors) continue
    sourceNeighbors.add(edge.target)
    targetNeighbors.add(edge.source)
  }

  const seen = new Set<string>()
  const components: Array<{ nodes: string[]; topEdges: number; size: number }> = []

  for (const nodeId of nodeIds) {
    if (seen.has(nodeId)) continue
    const nodes: string[] = []
    const queue = [nodeId]
    seen.add(nodeId)

    while (queue.length > 0) {
      const current = queue.shift()
      if (!current) continue
      nodes.push(current)
      const neighbors = adjacency.get(current)
      if (!neighbors) continue
      for (const next of neighbors) {
        if (seen.has(next)) continue
        seen.add(next)
        queue.push(next)
      }
    }

    components.push({
      nodes: nodes.sort(),
      size: nodes.length,
      topEdges: Math.max(nodes.length - 1, 0),
    })
  }

  return components.sort((a, b) => b.size - a.size)
}

function normalizeEntity(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^#+/, '')
    .replace(/[^\p{L}\p{N}]+/gu, '')
}

function normalizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric >= min && numeric <= max ? numeric : fallback
}
