export const CATALOG_KEY = 'provider_model_catalog'
export const PROVIDER_KEY_PREFIX = 'provider_key:'
export const AGENT_SKILLS_LIBRARY_KEY = 'agent_skills'
export const LEGACY_AGENT_SKILLS_LIBRARY_KEY = 'deep_research_agent_skills'

export const RETENTION_KEYS = [
  'rag_trace_retention_enabled',
  'rag_trace_retention_prod_days',
  'rag_trace_retention_admin_days',
  'rag_trace_retention_prod_native_days',
  'rag_trace_retention_admin_native_days',
  'rag_trace_retention_native_sample_bps',
  'rag_trace_retention_error_grace_days',
] as const

export const MANAGED_RAG_KEYS = [
  'rag_pipeline_engine',
  'rag_default_provider',
  'rag_default_model',
  'rag_stage_overrides',
  'rag_fallback_provider',
  'rag_fallback_model',
  'rag_flag_hyde',
  'rag_flag_multi_query',
  'rag_flag_reranker',
  'rag_flag_critic',
  'rag_flag_pageindex',
  'rag_pageindex_max_steps',
  'rag_flag_bm25_short_circuit',
  'rag_shadow_mode',
  'semantic_cache_threshold',
  'rag_reranker_min_keep',
  'rag_mmr_lambda',
  'rag_checkpoint_threshold_ratio',
  'rag_search_tools_enabled',
  'rag_search_tool_providers',
  'rag_search_tool_max_results',
  'rag_search_tool_timeout_ms',
  'rag_trace_retention_prod_days',
  'rag_trace_retention_admin_days',
  'rag_trace_retention_prod_native_days',
  'rag_trace_retention_admin_native_days',
  'rag_trace_retention_native_sample_bps',
  'rag_trace_retention_error_grace_days',
  'rag_trace_retention_enabled',
] as const

export const SETTINGS_DEFAULTS = {
  rate_limit_per_minute: '60',
  rate_limit_per_hour: '1000',
  rag_cache_ttl_seconds: '3600',
  rag_max_context_chunks: '10',
  pipeline_max_retries: '2',
  pipeline_max_runtime_ms: '600000',
  deep_research_storage_mode: 'auto',
} as const
