export interface Topic {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  relatedTopics: string[];
}

export const TOPIC_TAXONOMY: Topic[] = [
  {
    slug: 'agent-memory',
    label: 'Agent 記憶',
    labelEn: 'Agent Memory',
    description: '記憶管理、context window、遺忘機制、episodic memory、長程任務記憶',
    relatedTopics: ['agent-rag', 'agent-reasoning'],
  },
  {
    slug: 'agent-security',
    label: 'Agent 安全',
    labelEn: 'Agent Security',
    description: 'prompt injection、對抗攻擊、guardrails、沙箱隔離、紅隊測試',
    relatedTopics: ['agent-evaluation', 'agent-deployment'],
  },
  {
    slug: 'agent-evaluation',
    label: 'Agent 評測',
    labelEn: 'Agent Evaluation',
    description: '評測方法論、benchmark 設計、能力邊界測試、shadow evaluation',
    relatedTopics: ['agent-security', 'agent-coding'],
  },
  {
    slug: 'agent-reasoning',
    label: '推理與規劃',
    labelEn: 'Reasoning & Planning',
    description: 'chain-of-thought、planning、決策、搜尋策略、self-reflection',
    relatedTopics: ['agent-memory', 'agent-tool-use'],
  },
  {
    slug: 'agent-tool-use',
    label: '工具呼叫',
    labelEn: 'Tool Use',
    description: 'function calling、API 呼叫最佳化、工具選擇、工具組合',
    relatedTopics: ['agent-reasoning', 'agent-framework'],
  },
  {
    slug: 'multi-agent',
    label: '多 Agent 協作',
    labelEn: 'Multi-Agent',
    description: '多 Agent 協定、角色分工、MCP、A2A、通訊架構',
    relatedTopics: ['agent-framework', 'agent-security'],
  },
  {
    slug: 'agent-rag',
    label: 'RAG 與檢索',
    labelEn: 'RAG & Retrieval',
    description: 'retrieval-augmented generation、向量檢索、知識庫、document parsing',
    relatedTopics: ['agent-memory', 'agent-tool-use'],
  },
  {
    slug: 'agent-framework',
    label: '框架與架構',
    labelEn: 'Framework & Architecture',
    description: '框架設計、編排架構、scaffold、workflow engine、持久執行',
    relatedTopics: ['agent-tool-use', 'multi-agent'],
  },
  {
    slug: 'agent-deployment',
    label: '部署與生產化',
    labelEn: 'Deployment & Production',
    description: '推理成本、延遲最佳化、可觀測性、企業落地、規模化',
    relatedTopics: ['agent-security', 'agent-evaluation'],
  },
  {
    slug: 'agent-coding',
    label: 'Coding Agent',
    labelEn: 'Coding Agent',
    description: 'AI 程式碼生成、SWE-bench、自主修 bug、code review、IDE 整合',
    relatedTopics: ['agent-evaluation', 'agent-tool-use'],
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPIC_TAXONOMY.find(t => t.slug === slug);
}

export function getAllTopicSlugs(): string[] {
  return TOPIC_TAXONOMY.map(t => t.slug);
}
