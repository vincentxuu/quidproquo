# Research note: Meilisearch complete guide

- Date: 2026-08-21
- Scope: self-hosted application search, indexing contract, zh-TW behavior, security, recovery, and Agent integration
- Output:
  - `src/content/posts/ai/2026-08-21-meilisearch-complete-guide.md`
  - `src/content/posts/ai/2026-08-21-meilisearch-complete-guide-en.md`

## Questions

1. What operational model must a production integration understand?
2. Which settings affect indexing and query behavior?
3. What does official documentation actually say about Chinese tokenization?
4. How should multi-tenant authorization and Agent access be bounded?
5. When should snapshots and dumps be used?

## Findings

- Index and settings mutations are asynchronous tasks. A 202 response or `enqueued` state is not completion; callers must observe `succeeded` or `failed`.
- Every index has one primary key. The key should be explicit and stable because it anchors upserts, deletion propagation, and reconciliation.
- Searchable attributes affect ranking order and trigger reindexing when changed. Filterable and sortable attributes require additional index structures, so they should be minimal.
- Typo tolerance is enabled by default but should be restricted for identifiers, codes, and other exact-match fields.
- Meilisearch does support specialized Chinese tokenization. The documented limitation is automatic language selection for short queries and fields mixing Chinese with Japanese. Separate language indexes are the preferred design; localized attributes and explicit query locales are the fallback.
- Search-only keys suit public search, while tenant tokens enforce index and filter rules for private multi-tenant search. Administrative keys must remain server-side.
- Snapshots are fast, same-version database copies. Dumps are portable and suitable for migration but require reindexing. Both require off-host retention and tested restoration.
- A general Agent should receive a narrow search adapter, never administrative indexing APIs. Tenant identity, filter grammar, sort fields, limits, timeouts, and returned fields must be enforced outside the model.

## Primary sources

- https://www.meilisearch.com/docs/learn/getting_started/what_is_meilisearch
- https://www.meilisearch.com/docs/resources/self_hosting/getting_started/install_locally
- https://www.meilisearch.com/docs/resources/internals/primary_key
- https://www.meilisearch.com/docs/capabilities/indexing/tasks_and_batches/monitor_tasks
- https://www.meilisearch.com/docs/reference/api/documents/add-or-update-documents
- https://www.meilisearch.com/docs/capabilities/full_text_search/how_to/configure_searchable_attributes
- https://www.meilisearch.com/docs/capabilities/filtering_sorting_faceting/overview
- https://www.meilisearch.com/docs/capabilities/full_text_search/relevancy/typo_tolerance_settings
- https://www.meilisearch.com/docs/resources/help/language
- https://www.meilisearch.com/docs/capabilities/indexing/how_to/handle_multilingual_data
- https://www.meilisearch.com/docs/capabilities/security/overview
- https://www.meilisearch.com/docs/capabilities/security/how_to/manage_api_keys
- https://www.meilisearch.com/docs/capabilities/security/advanced/tenant_token_payload
- https://www.meilisearch.com/docs/resources/self_hosting/data_backup/overview
- https://www.meilisearch.com/docs/resources/self_hosting/data_backup/snapshots
- https://www.meilisearch.com/docs/resources/self_hosting/data_backup/dumps

## Editorial decisions

- Correct the common overstatement that Meilisearch lacks Chinese tokenization; describe the documented detection and mixed-language limitations instead.
- Keep exact performance limits and hosting prices out because they depend on version, workload, and plan.
- Use curl rather than an SDK so examples do not imply a new project dependency.
- Link the existing free search/scraping inventory as the selection-stage companion, while keeping this guide standalone and outside a series.
