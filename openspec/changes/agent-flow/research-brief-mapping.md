# Research Brief → Deep Research Flow Mapping

This document maps each `research-brief` pipeline step to its equivalent `deep-research` flow step.

| Pipeline Step (research-brief) | Flow Step (deep-research) | Notes |
|---|---|---|
| topic_extraction | clarify | planner agent scopes the topic |
| brief_generation | build_brief | transform step assembles brief from clarify outputs |
| search_planning | plan | planner generates search queries |
| external_search | search | tool_group dispatches to tavily/exa |
| source_ranking | rank_sources | research agent ranks by relevance + freshness |
| source_reading | read_sources | tool_group fetches full content via read.url |
| evidence_extraction | extract_evidence | research agent extracts structured evidence |
| synthesis | synthesize | writer agent produces markdown report |
| quality_check | verify | verifier:coverage asserts plan coverage |
| artifact_export | export | artifact:markdown_report materializes the output |

## Key Differences

- The pipeline runs steps sequentially via a for-loop; the flow uses an explicit edge graph.
- The flow adds `rank_sources` as an explicit step (the pipeline combines search + ranking in one step).
- The `verify → search` conditional loop is flow-only (added in Phase 4.6); the pipeline is linear.
- The flow uses typed step kinds; the pipeline uses named functions in a registry.
