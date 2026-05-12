# Knowledge Map Design

## Goal

Build a knowledge map that visualizes relationships between posts so readers can explore concepts across the blog, and so the site owner can see how content clusters, gaps, and recurring themes evolve over time.

The first version should be low-risk and deterministic: use existing frontmatter and content metadata before introducing AI extraction or embeddings. The map should make the site easier to browse without turning the public experience into another RAG product surface.

## Non-goals

- Do not build a general-purpose graph database in the first version.
- Do not require new paid services or external graph APIs.
- Do not infer every entity with an LLM before the deterministic baseline exists.
- Do not expose admin-only RAG traces or private pipeline data on the public site.
- Do not replace existing search, tag pages, related posts, or RAG chat.

## Current context

The repo already has the primitives needed for a baseline graph:

- Post metadata includes `title`, `date`, `category`, `tags`, `lang`, optional `type`, `series`, and `glossary` in `src/content.config.ts`.
- Related posts are currently scored with tag overlap, category match, recency, and series match in `src/utils/relatedPosts.ts`.
- Pagefind and `/search` already handle keyword discovery.
- RAG search/chat already exist and are feature-flagged; the map should reuse retrieval concepts only after a simpler static graph proves useful.
- Project guidance requires advanced or experimental techniques to be individually toggleable.

## Primary user journeys

### 1. Reader exploration

A reader opens `/knowledge-map`, sees a readable graph of major concepts, clicks a concept, and gets a filtered list of related posts plus the strongest neighboring concepts.

Success means the page helps a reader answer: "What topics does this site connect together, and where should I read next?"

### 2. Post-level exploration

A reader on a post can open a compact "related concepts" section that shows the post's tags, glossary terms, series, and nearby posts. This should be a lightweight complement to existing related posts, not a full graph embedded into every article.

Success means the reader can move from one article to an adjacent concept without returning to search.

### 3. Content operations

The owner can use the map to spot overloaded tags, isolated posts, under-connected themes, duplicate concept names, and candidate series.

Success means the map exposes maintenance work that is hard to see from a flat post list.

## Recommended approach

Use a static, build-time graph generated from existing post metadata, rendered as an interactive client-side visualization.

This is the recommended first version because it is cheap, cacheable, reversible, and aligned with the existing Astro content pipeline. It avoids adding RAG complexity before there is evidence that deterministic metadata is insufficient.

## Alternatives considered

### Option A: Static metadata graph — recommended

Generate graph JSON during build from posts, tags, categories, series, and glossary terms.

Pros:
- No runtime database dependency.
- No new external service.
- Easy to inspect and test.
- Works with static rendering and CDN caching.
- Good fit for current metadata quality work.

Cons:
- Entity quality depends on existing frontmatter/glossary coverage.
- Co-occurrence is coarse until glossary/frontmatter improves.

### Option B: D1-backed graph API

Store nodes and edges in D1 and query graph slices through an API.

Pros:
- Better for large graphs and admin workflows.
- Can support incremental updates and richer filters.

Cons:
- More moving parts.
- Needs migrations, sync jobs, auth boundaries, and observability.
- Premature unless static graph becomes too large or slow.

### Option C: AI-extracted entity graph

Use LLM or embedding pipelines to extract entities and semantic relationships from article bodies.

Pros:
- Richer concept map.
- Can discover relationships not present in tags.

Cons:
- Requires evaluation, feature flags, cost controls, and review UI.
- Higher risk of noisy or misleading relationships.
- Should only follow a deterministic baseline and observed failure cases.

## Scope for version 1

### Included

- Public `/knowledge-map` page.
- Build-time graph JSON generation.
- Nodes for tags, categories, series, glossary terms, and posts.
- Edges for:
  - post → tag
  - post → category
  - post → series
  - post → glossary term
  - tag ↔ tag co-occurrence in the same post
  - glossary term ↔ tag co-occurrence in the same post
- Filters for language, category, type, time range, and node type.
- Click-to-drill-down panel showing related posts and neighboring concepts.
- Guardrails to prevent unreadable hairballs: minimum edge weight, top-N neighbors, and default focus on strongest clusters.
- Basic tests for graph generation correctness.

### Deferred

- LLM entity extraction.
- Embedding similarity edges.
- D1 graph persistence.
- Admin editing UI for entities.
- Graph layout stored across sessions.
- Personalized recommendations.

## Data model

### Node

```ts
type KnowledgeMapNode = {
  id: string
  label: string
  kind: 'post' | 'tag' | 'category' | 'series' | 'glossary'
  lang?: 'zh-TW' | 'en'
  postCount?: number
  url?: string
  metadata?: {
    category?: string
    type?: 'debug' | 'deep-dive' | 'guide' | 'project'
    date?: string
  }
}
```

### Edge

```ts
type KnowledgeMapEdge = {
  source: string
  target: string
  kind: 'has-tag' | 'in-category' | 'in-series' | 'mentions-glossary' | 'co-occurs'
  weight: number
  postIds: string[]
}
```

### Graph payload

```ts
type KnowledgeMapGraph = {
  generatedAt: string
  nodes: KnowledgeMapNode[]
  edges: KnowledgeMapEdge[]
  stats: {
    postCount: number
    nodeCount: number
    edgeCount: number
  }
}
```

Node IDs should be stable and namespaced, for example `tag:ai-agent`, `category:ai`, `post:ai/2026-04-01-example`, and `glossary:rag`.

## Graph generation

Add a script such as `scripts/generate-knowledge-map.mjs` or a utility under `src/lib/knowledge-map/` that can be tested directly.

Generation steps:

1. Load published posts from the existing content source.
2. Normalize labels consistently with existing tag conventions.
3. Create post, tag, category, series, and glossary nodes.
4. Create direct metadata edges.
5. Create co-occurrence edges from tags and glossary terms within the same post.
6. Aggregate duplicate edges by increasing `weight` and merging `postIds`.
7. Drop weak co-occurrence edges below the display threshold.
8. Emit JSON to a public build artifact, for example `public/knowledge-map.json`, or expose it through an Astro endpoint if build integration is cleaner.

The first version should avoid reading generated `dist` output as a source of truth. Source posts and content utilities should remain authoritative.

## UI design

### Page layout

`/knowledge-map` should use the existing site layout and include:

- Title and short explanation.
- Filter bar.
- Graph canvas or SVG area.
- Side panel for selected node details.
- Fallback list view for small screens or users who prefer reduced motion.

### Default view

The default view should not show every post node. It should start with concept nodes only, weighted by connected post count. Post nodes appear after selecting a concept, category, series, or filter.

This avoids the common failure mode where a graph looks impressive but is unreadable.

### Interaction

Clicking a node should:

- Highlight direct neighbors.
- Show connected posts.
- Show edge evidence: which posts created the relationship.
- Provide links to tag/category/search/post pages where applicable.

Filtering should update the graph without a full page reload.

### Accessibility

The graph must not be the only way to access the information. Provide a synchronized list/table representation with:

- Keyboard-accessible node selection.
- Clear focus states.
- Text summaries for selected nodes.
- Reduced-motion behavior.
- Sufficient contrast for node colors and edge states.

## Rendering technology

Prefer a small, dependency-light rendering path unless an existing dependency already fits.

Possible rendering options:

1. SVG with a lightweight force layout library.
2. Canvas for larger graphs, plus accessible HTML list fallback.
3. Static clustered list first, graph enhancement second.

For version 1, SVG is likely sufficient if the default graph is aggressively filtered. If node count becomes too large, switch the visual layer to canvas without changing the graph JSON contract.

## Feature flags and rollout

Because this is a new discovery surface, add a simple feature flag before public navigation exposure.

Suggested flags:

- `knowledge_map_enabled`: controls page availability or nav exposure.
- `knowledge_map_show_post_nodes`: controls whether post nodes are visible by default.
- Future-only: `knowledge_map_ai_entities_enabled` for LLM/entity extraction.

The page can exist unlinked while the flag is off, but public nav entry should depend on the flag.

## Data quality rules

The map is only as useful as metadata consistency. Add deterministic checks for:

- Empty or one-off tags that create noise.
- Tags that differ only by pluralization or casing.
- Glossary aliases that collide with tags.
- Posts with no meaningful connections beyond category.

These checks can start as warnings in the generation script and later become CI gates if they prove valuable.

## Testing strategy

### Unit tests

Test graph generation with small fixtures:

- Creates stable nodes for posts, tags, categories, series, glossary terms.
- Aggregates co-occurrence edge weights correctly.
- Keeps language filters separate.
- Excludes drafts.
- Produces stable IDs.

### Integration checks

- Build succeeds with graph generation enabled.
- `/knowledge-map` loads the JSON and renders a non-empty graph.
- Filters update visible nodes and post lists.

### Accessibility checks

- Keyboard can reach filters, graph/list nodes, and post links.
- Screen-reader fallback list exposes the same selected-node information.
- Reduced-motion mode disables animated force simulation or uses a static layout.

### Performance checks

- Graph JSON size stays within an agreed budget.
- Initial render remains fast on mobile.
- Default node/edge count is capped.

## Error handling

- If graph JSON fails to load, show a clear fallback message and links to search, tags, and categories.
- If filters produce no results, show an empty state with reset action.
- If a selected node has no connected posts after filtering, keep the node selected and explain which filter removed the results.
- Generation warnings should not fail the build initially unless the JSON cannot be generated.

## Rollout plan

1. Generate baseline graph JSON from existing metadata.
2. Inspect graph statistics and tune thresholds.
3. Build the page behind a feature flag or keep it unlinked.
4. Add accessibility fallback list.
5. Add tests for graph generation.
6. Manually review top clusters and noisy edges.
7. Link from navigation only after the graph is readable and useful.

## Version 1 decisions

1. V1 is public-reader-first, with content-ops value treated as a secondary benefit.
2. The first page URL is `/knowledge-map`.
3. Glossary terms are first-class nodes in v1 because the content schema already supports post-level glossary metadata.
4. Initial graph payload budget is 250 KB uncompressed, with the default view capped at 80 visible nodes and 160 visible edges.
5. Graph generation runs during `pnpm build` and writes a deterministic JSON artifact consumed by the page.

## Recommendation

Start with a public-reader-oriented `/knowledge-map` that is initially unlinked or feature-flagged. Generate a deterministic static graph from tags, categories, series, and glossary terms during build. Keep AI-extracted entities and D1 persistence out of v1 until the static graph reveals specific shortcomings.
