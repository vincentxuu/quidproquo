export type TranslationStage = 'translator' | 'cultural_reviewer' | 'native_checker' | 'validate' | 'github_pr'

export type TranslationStatus =
  | 'pending'
  | 'queued'
  | 'running'
  | 'translated'
  | 'culturally_reviewed'
  | 'native_checked'
  | 'ready_for_pr'
  | 'pr_created'
  | 'failed'
  | 'cancelled'

export interface TranslationJobRow {
  id: string
  admin_job_id: string | null
  source_path: string
  target_path: string
  source_lang: string
  target_lang: string
  category: string
  title: string | null
  status: TranslationStatus
  priority: number
  current_stage: TranslationStage | null
  attempts: number
  error_summary: string | null
  source_sha256: string | null
  translator_artifact_key: string | null
  cultural_review_artifact_key: string | null
  native_check_artifact_key: string | null
  final_markdown_artifact_key: string | null
  github_branch: string | null
  github_pr_url: string | null
  created_at: string
  updated_at: string
  started_at: string | null
  finished_at: string | null
}

export interface TranslationQueueMessage {
  jobId: string
}

export interface TranslationStageResult {
  text: string
  summary: string
  provider: string
  model: string
  inputTokens?: number
  outputTokens?: number
}

export interface GitHubPullRequestResult {
  branch: string
  url: string
}
