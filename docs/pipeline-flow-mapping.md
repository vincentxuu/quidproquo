# Pipeline → Flow Mapping

Each legacy pipeline in `src/lib/pipelines/registry.ts` maps to a flow YAML under `flows/pipelines/<id>.yaml`.

Stage kind translation: `module` → `tool_group`, `llm` → `agent`, `api` → `tool_group`, `human_review` → `human_approval`.

---

## content-ops

**Flow**: `flows/pipelines/content-ops.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| run-content-ops | run-content-ops | module → tool_group | run_content_ops |
| write-report-artifact | write-report-artifact | module → artifact | write_artifact |

**Tools**: `run_content_ops`, `write_artifact`

---

## post-quality

**Flow**: `flows/pipelines/post-quality.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| quality-check | quality-check | module → tool_group | run_post_quality_check |
| reference-check | reference-check | module → tool_group | run_reference_check |
| quality-evaluation | quality-evaluation | llm → agent | — |
| quality-report | quality-report | module → artifact | write_artifact |

**Tools**: `read_post_content`, `run_post_quality_check`, `run_reference_check`, `write_artifact`

---

## embed-sync

**Flow**: `flows/pipelines/embed-sync.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| embed-sync | embed-sync | api → tool_group | run_embed_sync |
| embed-report | embed-report | api → artifact | write_artifact |

**Tools**: `run_embed_sync`, `write_artifact`

---

## crawl-sync

**Flow**: `flows/pipelines/crawl-sync.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| crawl-sync | crawl-sync | api → tool_group | run_crawl_sync |
| crawl-report | crawl-report | api → artifact | write_artifact |

**Tools**: `run_crawl_sync`, `write_artifact`

---

## translation

**Flow**: `flows/pipelines/translation.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| read-source | read-source | module → tool_group | read_post_content |
| translate | translate | llm → agent | write_draft_artifact |
| cultural-review | cultural-review | llm → agent | — |
| native-check | native-check | llm → agent | — |
| quality-check | quality-check | module → tool_group | run_post_quality_check |
| reference-check | reference-check | module → tool_group | run_reference_check |
| review-gate | review-gate | human_review → human_approval | — |
| write-draft | write-draft | module → tool_group | write_draft_artifact |
| translation-report | translation-report | module → artifact | write_artifact |

**Tools**: `read_post_content`, `write_draft_artifact`, `run_post_quality_check`, `run_reference_check`, `write_artifact`

---

## research-brief

**Flow**: `flows/pipelines/research-brief.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| research-brief | research-brief | llm → agent | — |
| research-quality | research-quality | module → tool_group | run_post_quality_check |
| research-reference | research-reference | module → tool_group | run_reference_check |
| research-review | research-review | human_review → human_approval | — |
| research-write-draft | research-write-draft | module → tool_group | write_draft_artifact |
| research-report | research-report | module → artifact | write_artifact |

**Tools**: `write_draft_artifact`, `run_post_quality_check`, `run_reference_check`, `write_artifact`

---

## youtube-brief

**Flow**: `flows/pipelines/youtube-brief.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| youtube-brief | youtube-brief | module → tool_group | — |
| youtube-quality | youtube-quality | module → tool_group | run_post_quality_check |
| youtube-reference | youtube-reference | module → tool_group | run_reference_check |
| youtube-review | youtube-review | human_review → human_approval | — |
| youtube-write-draft | youtube-write-draft | module → tool_group | write_draft_artifact |
| youtube-report | youtube-report | module → artifact | write_artifact |

**Tools**: `write_draft_artifact`, `run_post_quality_check`, `run_reference_check`, `write_artifact`

---

## glossary-gap

**Flow**: `flows/pipelines/glossary-gap.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| glossary-gap-scan | glossary-gap-scan | module → tool_group | read_glossary_stats |
| glossary-gap-report | glossary-gap-report | module → artifact | write_artifact |

**Tools**: `read_glossary_stats`, `read_post_content`, `write_artifact`

---

## freshness-review

**Flow**: `flows/pipelines/freshness-review.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| freshness-scan | freshness-scan | module → tool_group | read_post_content |
| freshness-report | freshness-report | module → artifact | write_artifact |

**Tools**: `read_post_content`, `write_artifact`

---

## series-suggestions

**Flow**: `flows/pipelines/series-suggestions.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| series-scan | series-scan | module → tool_group | read_post_content |
| series-report | series-report | module → artifact | write_artifact |

**Tools**: `read_post_content`, `write_artifact`

---

## knowledge-graph-prototype

**Flow**: `flows/pipelines/knowledge-graph-prototype.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| knowledge-graph-scan | knowledge-graph-scan | module → tool_group | read_post_content |
| knowledge-graph-report | knowledge-graph-report | module → artifact | write_artifact |

**Tools**: `read_post_content`, `write_artifact`

---

## metadata-suggestions

**Flow**: `flows/pipelines/metadata-suggestions.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| read-post | read-post | module → tool_group | read_post_content |
| metadata-suggestion | metadata-suggestion | module → tool_group | write_artifact |
| metadata-suggestion-evaluation | metadata-suggestion-evaluation | llm → agent | — |

**Tools**: `read_post_content`, `write_artifact`

---

## internal-links

**Flow**: `flows/pipelines/internal-links.yaml`

| Stage id | Step id | Kind (legacy → flow) | Tool |
|---|---|---|---|
| read-post | read-post | module → tool_group | read_post_content |
| run-content-ops | run-content-ops | module → tool_group | run_content_ops |
| link-report | link-report | module → tool_group | write_artifact |
| internal-link-evaluation | internal-link-evaluation | llm → agent | — |

**Tools**: `read_post_content`, `run_content_ops`, `write_artifact`

---

## Epilogue: Retained files after Phase 7 cleanup

Two files in `src/lib/pipelines/` are intentionally kept after the Phase 7 deletion pass:

### `tool-registry.ts`

Provides `listTools()`, which is consumed by `src/pages/api/admin/pipelines.ts` to expose the tool catalogue to the admin UI. This is a read-only utility with no dependency on the deprecated runner/registry/job-store trio. It will remain until the admin pipelines endpoint is retired or migrated to the flow-based tool registry.

### `types.ts`

Defines shared types (`PipelineDefinition`, `PipelineStatus`, `ArtifactType`, `GuardResult`, `PipelineRunRequest`, etc.) that are still referenced by:
- `src/pages/api/admin/jobs/index.ts` — `PipelineJobRow`, `PipelineStatus`
- `src/pages/api/admin/jobs/[id].ts` — `PipelineRunRequest`, `PipelineStatus`
- `src/lib/pipelines/job-store.ts` — `ArtifactType`, `GuardResult`, `PipelineDefinition`, `PipelineStatus`
- `src/lib/pipelines/registry.ts` — `PipelineDefinition`

These types will be migrated to `src/lib/agent-flow/` types as callers are updated. Until then, deleting `types.ts` would cause widespread type errors.
