import type { Env } from './env'

// Map from pipeline id (kebab-case) to the env var key suffix (SCREAMING_SNAKE_CASE)
const pipelineIdToEnvKey: Record<string, keyof import('./env').Env> = {
  'content-ops': 'PIPELINE_CONTENT_OPS_USE_FLOW',
  'post-quality': 'PIPELINE_POST_QUALITY_USE_FLOW',
  'embed-sync': 'PIPELINE_EMBED_SYNC_USE_FLOW',
  'crawl-sync': 'PIPELINE_CRAWL_SYNC_USE_FLOW',
  'translation': 'PIPELINE_TRANSLATION_USE_FLOW',
  'research-brief': 'PIPELINE_RESEARCH_BRIEF_USE_FLOW',
  'arxiv-reading': 'PIPELINE_ARXIV_READING_USE_FLOW',
  'youtube-brief': 'PIPELINE_YOUTUBE_BRIEF_USE_FLOW',
  'glossary-gap': 'PIPELINE_GLOSSARY_GAP_USE_FLOW',
  'freshness-review': 'PIPELINE_FRESHNESS_REVIEW_USE_FLOW',
  'series-suggestions': 'PIPELINE_SERIES_SUGGESTIONS_USE_FLOW',
  'knowledge-graph-prototype': 'PIPELINE_KNOWLEDGE_GRAPH_PROTOTYPE_USE_FLOW',
  'metadata-suggestions': 'PIPELINE_METADATA_SUGGESTIONS_USE_FLOW',
  'internal-links': 'PIPELINE_INTERNAL_LINKS_USE_FLOW',
}

export interface Flags {
  providers: {
    enabled: boolean
    llm: {
      openai: boolean
      anthropic: boolean
      gemini: boolean
      groq: boolean
      openrouter: boolean
    }
    search: { tavily: boolean; exa: boolean; jina: boolean }
    reader: { jinaReader: boolean; firecrawl: boolean; browser: boolean; directFetch: boolean }
    knowledge: { notion: boolean; github: boolean; drive: boolean; sql: boolean }
    action: { githubIssue: boolean; githubComment: boolean; slack: boolean; notion: boolean; email: boolean }
    routing: { fallback: boolean; healthChecks: boolean; loadBalance: boolean; rateLimits: boolean }
  }
  agentOs: {
    enabled: boolean
    planner: boolean
    research: boolean
    writer: boolean
    critic: boolean
    memory: {
      r2: boolean
    }
    tools: {
      mcpExternal: boolean
    }
    scheduler: {
      queues: boolean
    }
  }
  agentEvidence: {
    enabled: boolean
  }
  pipelinesUnify: {
    portedToFlow: boolean
    adminRedirect: boolean
    adminJobsWritesEnabled: boolean
    useFlow: (pipelineId: string) => boolean
  }
  agentConsole: {
    enabled: boolean
    rbac?: boolean
    costDashboard?: boolean
    flowEditor?: boolean
  }
  agentArtifact: {
    enabled: boolean
    r2Offload: boolean
    csv: boolean
    pdf: boolean
    pptx: boolean
    notion: boolean
    slack: boolean
    githubIssue: boolean
    githubPr: boolean
    email: boolean
  }
  agentPolicy: {
    enabled: boolean
    budgetEnforce: boolean
    providerEnforce: boolean
    qualityEnforce: boolean
    securityEnforce: boolean
    humanGates: boolean
  }
  agentFlow: {
    enabled: boolean
    durableExecution: boolean
    deepResearch: boolean
  }
}

function readBoolean(raw: unknown): boolean {
  return typeof raw === 'string' && raw.trim().toLowerCase() === 'true'
}

export function readFlags(env: Env): Flags {
  return {
    providers: {
      enabled: readBoolean(env.AGENT_PROVIDERS_ENABLED),
      llm: {
        openai: readBoolean(env.AGENT_PROVIDERS_LLM_OPENAI),
        anthropic: readBoolean(env.AGENT_PROVIDERS_LLM_ANTHROPIC),
        gemini: readBoolean(env.AGENT_PROVIDERS_LLM_GEMINI),
        groq: readBoolean(env.AGENT_PROVIDERS_LLM_GROQ),
        openrouter: readBoolean(env.AGENT_PROVIDERS_LLM_OPENROUTER),
      },
      search: {
        tavily: readBoolean(env.AGENT_PROVIDERS_SEARCH_TAVILY),
        exa: readBoolean(env.AGENT_PROVIDERS_SEARCH_EXA),
        jina: readBoolean(env.AGENT_PROVIDERS_SEARCH_JINA),
      },
      reader: {
        jinaReader: readBoolean(env.AGENT_PROVIDERS_READER_JINA),
        firecrawl: readBoolean(env.AGENT_PROVIDERS_READER_FIRECRAWL),
        browser: readBoolean(env.AGENT_PROVIDERS_READER_BROWSER),
        directFetch: readBoolean(env.AGENT_PROVIDERS_READER_DIRECT_FETCH),
      },
      knowledge: {
        notion: readBoolean(env.AGENT_PROVIDERS_KNOWLEDGE_NOTION),
        github: readBoolean(env.AGENT_PROVIDERS_KNOWLEDGE_GITHUB),
        drive: readBoolean(env.AGENT_PROVIDERS_KNOWLEDGE_DRIVE),
        sql: readBoolean(env.AGENT_PROVIDERS_KNOWLEDGE_SQL),
      },
      action: {
        githubIssue: readBoolean(env.AGENT_PROVIDERS_ACTION_GITHUB_ISSUE),
        githubComment: readBoolean(env.AGENT_PROVIDERS_ACTION_GITHUB_COMMENT),
        slack: readBoolean(env.AGENT_PROVIDERS_ACTION_SLACK),
        notion: readBoolean(env.AGENT_PROVIDERS_ACTION_NOTION),
        email: readBoolean(env.AGENT_PROVIDERS_ACTION_EMAIL),
      },
      routing: {
        fallback: readBoolean(env.AGENT_PROVIDERS_ROUTING_FALLBACK),
        healthChecks: readBoolean(env.AGENT_PROVIDERS_ROUTING_HEALTH_CHECKS),
        loadBalance: readBoolean(env.AGENT_PROVIDERS_ROUTING_LOAD_BALANCE),
        rateLimits: readBoolean(env.AGENT_PROVIDERS_ROUTING_RATE_LIMITS),
      },
    },
    agentOs: {
      enabled: readBoolean(env.AGENT_OS_ENABLED),
      planner: readBoolean(env.AGENT_OS_PLANNER),
      research: readBoolean(env.AGENT_OS_RESEARCH),
      writer: readBoolean(env.AGENT_OS_WRITER),
      critic: readBoolean(env.AGENT_OS_CRITIC),
      memory: { r2: readBoolean(env.AGENT_OS_MEMORY_R2) },
      tools: { mcpExternal: readBoolean(env.AGENT_OS_TOOLS_MCP_EXTERNAL) },
      scheduler: { queues: readBoolean(env.AGENT_OS_SCHEDULER_QUEUES) },
    },
    agentEvidence: {
      enabled: readBoolean(env.AGENT_EVIDENCE_ENABLED),
    },
    pipelinesUnify: {
      portedToFlow: readBoolean(env.PIPELINES_PORTED_TO_FLOW),
      adminRedirect: readBoolean(env.ADMIN_PIPELINES_REDIRECT_TO_FLOW),
      adminJobsWritesEnabled: readBoolean(env.ADMIN_JOBS_WRITES_ENABLED ?? 'true'),
      useFlow: (pipelineId: string): boolean => {
        const key = pipelineIdToEnvKey[pipelineId]
        if (!key) return false
        return readBoolean(env[key])
      },
    },
    agentConsole: {
      enabled: readBoolean(env.AGENT_CONSOLE_ENABLED),
      rbac: env.AGENT_CONSOLE_RBAC === undefined ? undefined : readBoolean(env.AGENT_CONSOLE_RBAC),
      costDashboard: env.AGENT_CONSOLE_COST_DASHBOARD === undefined ? undefined : readBoolean(env.AGENT_CONSOLE_COST_DASHBOARD),
      flowEditor: env.AGENT_CONSOLE_FLOW_EDITOR === undefined ? undefined : readBoolean(env.AGENT_CONSOLE_FLOW_EDITOR),
    },
    agentArtifact: {
      enabled: readBoolean(env.AGENT_ARTIFACT_ENABLED),
      r2Offload: readBoolean(env.AGENT_ARTIFACT_R2_OFFLOAD),
      csv: readBoolean(env.AGENT_ARTIFACT_CSV),
      pdf: readBoolean(env.AGENT_ARTIFACT_PDF),
      pptx: readBoolean(env.AGENT_ARTIFACT_PPTX),
      notion: readBoolean(env.AGENT_ARTIFACT_NOTION),
      slack: readBoolean(env.AGENT_ARTIFACT_SLACK),
      githubIssue: readBoolean(env.AGENT_ARTIFACT_GITHUB_ISSUE),
      githubPr: readBoolean(env.AGENT_ARTIFACT_GITHUB_PR),
      email: readBoolean(env.AGENT_ARTIFACT_EMAIL),
    },
    agentPolicy: {
      enabled: readBoolean(env.AGENT_POLICY_ENABLED),
      budgetEnforce: readBoolean(env.AGENT_POLICY_BUDGET_ENFORCE),
      providerEnforce: readBoolean(env.AGENT_POLICY_PROVIDER_ENFORCE),
      qualityEnforce: readBoolean(env.AGENT_POLICY_QUALITY_ENFORCE),
      securityEnforce: readBoolean(env.AGENT_POLICY_SECURITY_ENFORCE),
      humanGates: readBoolean(env.AGENT_POLICY_HUMAN_GATES),
    },
    agentFlow: {
      enabled: readBoolean(env.AGENT_FLOW_ENABLED),
      durableExecution: readBoolean(env.AGENT_FLOW_DURABLE_EXECUTION),
      deepResearch: readBoolean(env.AGENT_FLOW_DEEP_RESEARCH),
    },
  }
}

export const flagReaders = {
  readBoolean,
}
