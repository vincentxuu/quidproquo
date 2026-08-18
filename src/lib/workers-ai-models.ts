export interface WorkersAiModel {
  id: string
  costInput: number
  costOutput: number
  notes: string
}

export interface WorkersAiModelGroup {
  scenario: string
  primary: WorkersAiModel
  alternatives?: WorkersAiModel[]
}

export const WORKERS_AI_MODELS = {
  chat: {
    scenario: '一般問答 / 摘要 / RAG 生成',
    primary: {
      id: '@cf/zai-org/glm-4.7-flash',
      costInput: 0,
      costOutput: 0,
      notes: '繁中夠用、有 function calling、價格接近小模型',
    },
  },

  vision: {
    scenario: 'Vision（圖片理解）',
    primary: {
      id: '@cf/google/gemma-4-26b-a4b-it',
      costInput: 0,
      costOutput: 0,
      notes: '便宜',
    },
    alternatives: [{
      id: '@cf/meta/llama-4-scout-17b-16e-instruct',
      costInput: 0.27,
      costOutput: 0.85,
      notes: '支援 Batch',
    }],
  },

  reasoning: {
    scenario: '推理密集',
    primary: {
      id: '@cf/openai/gpt-oss-120b',
      costInput: 0.35,
      costOutput: 0.75,
      notes: '',
    },
    alternatives: [{
      id: '@cf/nvidia/nemotron-3-120b-a12b',
      costInput: 0.50,
      costOutput: 1.50,
      notes: '',
    }],
  },

  budget: {
    scenario: '極省成本 / 分類與路由',
    primary: {
      id: '@cf/ibm-granite/granite-4.0-h-micro',
      costInput: 0.017,
      costOutput: 0.112,
      notes: '有 function calling',
    },
    alternatives: [{
      id: '@cf/qwen/qwen3-30b-a3b-fp8',
      costInput: 0.051,
      costOutput: 0.335,
      notes: '',
    }],
  },

  coding: {
    scenario: 'Coding Agent',
    primary: {
      id: '@cf/deepseek-ai/deepseek-v4-flash-0731',
      costInput: 0.44,
      costOutput: 1.32,
      notes: 'cached input $0.014，多輪划算；需付費 billing',
    },
    alternatives: [
      {
        id: '@cf/moonshotai/kimi-k2.7-code',
        costInput: 0,
        costOutput: 0,
        notes: '需付費 billing',
      },
      {
        id: '@cf/zai-org/glm-5.2',
        costInput: 0,
        costOutput: 0,
        notes: '需付費 billing',
      },
    ],
  },

  embedding: {
    scenario: 'Embedding',
    primary: {
      id: '@cf/qwen/qwen3-embedding-0.6b',
      costInput: 0.012,
      costOutput: 0,
      notes: '多語言/繁中，$0.012/M tokens',
    },
    alternatives: [
      {
        id: '@cf/baai/bge-m3',
        costInput: 0.012,
        costOutput: 0,
        notes: '同價，多語言',
      },
      {
        id: '@cf/google/embeddinggemma-300m',
        costInput: 0,
        costOutput: 0,
        notes: '第三選項',
      },
    ],
  },

  rerank: {
    scenario: 'Rerank',
    primary: {
      id: '@cf/baai/bge-reranker-base',
      costInput: 0.003,
      costOutput: 0,
      notes: '目前唯一選項，$0.003/M',
    },
  },

  image: {
    scenario: '圖片生成',
    primary: {
      id: '@cf/black-forest-labs/flux-2-klein-4b',
      costInput: 0,
      costOutput: 0,
      notes: '超便宜',
    },
    alternatives: [{
      id: '@cf/black-forest-labs/flux-2-klein-9b',
      costInput: 0,
      costOutput: 0,
      notes: '品質更好',
    }],
  },

  asr: {
    scenario: '語音辨識 (ASR)',
    primary: {
      id: '@cf/deepgram/nova-3',
      costInput: 0,
      costOutput: 0,
      notes: '即時',
    },
    alternatives: [{
      id: '@cf/openai/whisper-large-v3-turbo',
      costInput: 0,
      costOutput: 0,
      notes: '批次，$0.0005/分鐘',
    }],
  },

  tts: {
    scenario: '語音合成 (TTS)',
    primary: {
      id: '@cf/deepgram/aura-2-en',
      costInput: 0,
      costOutput: 0,
      notes: '英文/西文',
    },
  },
} as const satisfies Record<string, WorkersAiModelGroup>

export type WorkersAiScenario = keyof typeof WORKERS_AI_MODELS

export function getModel(scenario: WorkersAiScenario): string {
  return WORKERS_AI_MODELS[scenario].primary.id
}
