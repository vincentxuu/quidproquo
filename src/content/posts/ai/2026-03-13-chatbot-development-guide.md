---
title: "聊天機器人開發完整指南：狀態管理、記憶策略與技術棧選型"
date: 2026-03-13
category: ai
tags: [chatbot, state-management, memory, streaming, guardrails, langfuse]
lang: zh-TW
tldr: "聊天機器人不只是接 API。對話狀態管理、記憶機制、Streaming、Guardrails、可觀測性、技術棧選型，每一層都影響使用者體驗。"
description: "從對話狀態架構（Session/User/Global State）、記憶策略（Sliding Window/Summary+Recent/Selective）、SSE Streaming、三層 Guardrails、Langfuse 可觀測性到 TypeScript vs Python 技術棧選型的完整開發指南。"
draft: false
---

大多數人對「聊天機器人」的理解停在「接 OpenAI API 然後把回覆貼出來」。

但只要你做過一個真正上線的 chatbot，你就知道——API 呼叫只占 10% 的工程量。剩下的 90% 是：

- 對話要記住上下文嗎？記多少？
- 記憶放在哪裡？記憶體？資料庫？向量庫？
- 回覆要一次吐出還是 streaming？
- 使用者輸入了惡意 prompt 怎麼辦？
- 模型幻覺了怎麼追蹤？
- 每次對話花多少錢？哪裡可以最佳化？

這篇文章把聊天機器人開發拆成七層，每一層都附上架構圖、程式碼和設計決策。

---

## 1. 對話狀態管理架構

一個聊天機器人要管理三種不同生命週期的狀態：

```
┌─────────────────────────────────────────────────────┐
│                    Chatbot System                     │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │   Session    │  │    User     │  │    Global     │ │
│  │   State      │  │    State    │  │    State      │ │
│  │             │  │             │  │              │ │
│  │ • messages  │  │ • profile   │  │ • sys prompt │ │
│  │ • context   │  │ • prefs     │  │ • KB version │ │
│  │ • tool call │  │ • history   │  │ • model cfg  │ │
│  │ • temp vars │  │ • feedback  │  │ • rate limit │ │
│  │             │  │             │  │              │ │
│  │ TTL: 1 對話  │  │ TTL: 永久   │  │ TTL: 永久    │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘ │
│         │                │                │          │
│         ▼                ▼                ▼          │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Context Assembly Layer              │ │
│  │   system_prompt + user_profile + messages[]      │ │
│  └──────────────────────┬──────────────────────────┘ │
│                         │                             │
│                         ▼                             │
│              ┌────────────────────┐                   │
│              │     LLM Call       │                   │
│              └────────────────────┘                   │
└─────────────────────────────────────────────────────┘
```

### Session State（對話級別）

每個對話 session 獨立的狀態。使用者開新對話就重置。

```typescript
interface SessionState {
  sessionId: string;
  messages: Message[];
  createdAt: Date;
  metadata: {
    toolCallCount: number;
    totalTokens: number;
    currentIntent: string | null;
  };
}

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: Date;
  tokenCount?: number;
  metadata?: Record<string, unknown>;
}
```

### User State（使用者級別）

跨對話持久化，記住使用者是誰、偏好什麼。

```typescript
interface UserState {
  userId: string;
  profile: {
    name: string;
    language: string;
    timezone: string;
  };
  preferences: {
    responseStyle: 'concise' | 'detailed';
    topics: string[];
  };
  history: {
    totalSessions: number;
    lastActiveAt: Date;
    frequentQuestions: string[];
  };
}
```

### Global State（系統級別）

所有使用者共享的設定。

```typescript
interface GlobalState {
  systemPrompt: string;
  knowledgeBaseVersion: string;
  modelConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  rateLimits: {
    requestsPerMinute: number;
    tokensPerDay: number;
  };
}
```

### 完整的狀態管理器

```typescript
class ChatStateManager {
  private sessions: Map<string, SessionState> = new Map();
  private userStore: KVNamespace; // Cloudflare KV 或其他持久化儲存
  private globalConfig: GlobalState;

  async assembleContext(
    sessionId: string,
    userId: string
  ): Promise<Message[]> {
    const session = this.sessions.get(sessionId);
    const user = await this.getUserState(userId);

    // 組裝 context：system prompt + 個人化資訊 + 對話歷史
    const systemMessage: Message = {
      role: 'system',
      content: this.buildSystemPrompt(user),
      timestamp: new Date(),
    };

    return [systemMessage, ...(session?.messages ?? [])];
  }

  private buildSystemPrompt(user: UserState | null): string {
    let prompt = this.globalConfig.systemPrompt;

    if (user) {
      prompt += `\n\n## 使用者偏好`;
      prompt += `\n- 語言：${user.profile.language}`;
      prompt += `\n- 回覆風格：${user.preferences.responseStyle}`;
      prompt += `\n- 關注主題：${user.preferences.topics.join('、')}`;
    }

    return prompt;
  }

  async getUserState(userId: string): Promise<UserState | null> {
    const raw = await this.userStore.get(userId);
    return raw ? JSON.parse(raw) : null;
  }

  async saveUserState(user: UserState): Promise<void> {
    await this.userStore.put(user.userId, JSON.stringify(user));
  }
}
```

**設計決策**：Session State 放記憶體（Map / Redis），User State 放 KV 或 DB，Global State 放環境變數或 config。三層分離讓你可以獨立調整每一層的 TTL 和儲存策略。

---

## 2. 對話歷史管理策略

context window 有限，你不可能把所有對話歷史都塞進去。三種主流策略：

### 策略一：Sliding Window

最簡單。只保留最近 N 輪對話。

```typescript
function slidingWindow(messages: Message[], windowSize: number): Message[] {
  // 永遠保留 system prompt
  const system = messages.filter((m) => m.role === 'system');
  const conversation = messages.filter((m) => m.role !== 'system');

  // 取最後 N 輪（一輪 = user + assistant）
  const kept = conversation.slice(-windowSize * 2);

  return [...system, ...kept];
}
```

```
時間軸 →
[msg1] [msg2] [msg3] [msg4] [msg5] [msg6] [msg7] [msg8]
                                    ├──── window = 2 ────┤
                                    保留 msg5-msg8
```

| 優點 | 缺點 |
|------|------|
| 實作最簡單 | 早期重要對話會被丟掉 |
| Token 用量可預測 | 使用者提到「前面說的那個」就斷了 |
| 適合短對話場景 | 不適合需要長期上下文的任務 |

### 策略二：Summary + Recent

舊對話用 LLM 壓縮成摘要，新對話保持原文。兼顧上下文和 token 用量。

```typescript
class SummaryPlusRecent {
  private llm: LLMClient;
  private maxRecentMessages = 10;
  private summaryTokenThreshold = 2000;

  async manage(messages: Message[]): Promise<Message[]> {
    const system = messages.filter((m) => m.role === 'system');
    const conversation = messages.filter((m) => m.role !== 'system');

    if (this.estimateTokens(conversation) <= this.summaryTokenThreshold) {
      // 還沒超過閾值，全部保留
      return messages;
    }

    // 拆分：舊的要摘要，新的保留
    const recent = conversation.slice(-this.maxRecentMessages);
    const toSummarize = conversation.slice(0, -this.maxRecentMessages);

    const summary = await this.summarize(toSummarize);

    // 把摘要當作一則 system message 插入
    const summaryMessage: Message = {
      role: 'system',
      content: `## 先前對話摘要\n${summary}`,
      timestamp: new Date(),
    };

    return [...system, summaryMessage, ...recent];
  }

  private async summarize(messages: Message[]): Promise<string> {
    const formatted = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const response = await this.llm.chat([
      {
        role: 'system',
        content:
          '請用繁體中文摘要以下對話的重點，保留關鍵資訊（名字、數字、決定、待辦事項）。用條列式。',
      },
      { role: 'user', content: formatted },
    ]);

    return response.content;
  }

  private estimateTokens(messages: Message[]): number {
    // 粗估：中文約 1.5 token/字，英文約 1.3 token/word
    return messages.reduce((sum, m) => sum + m.content.length * 1.5, 0);
  }
}
```

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  [msg1..msg20]  ──LLM──▶  [summary]               │
│      舊對話                  壓縮成一段摘要         │
│                                                    │
│  [summary] + [msg21..msg30]                        │
│     ↑ 摘要       ↑ 最近 10 輪原文                  │
│                                                    │
│  ──── 這就是送進 LLM 的 context ────                │
└──────────────────────────────────────────────────┘
```

| 優點 | 缺點 |
|------|------|
| 保留長期上下文 | 摘要過程會丟失細節 |
| Token 用量可控 | 每次摘要需要額外 LLM 呼叫（花錢） |
| 體驗最平衡 | 摘要品質依賴 prompt 設計 |

### 策略三：Selective Memory

只保留被標記為「重要」的訊息。需要額外的判斷邏輯。

```typescript
interface SelectiveMessage extends Message {
  importance: 'critical' | 'normal' | 'trivial';
  topics: string[];
}

class SelectiveMemory {
  private llm: LLMClient;

  async classify(message: Message): Promise<SelectiveMessage> {
    const response = await this.llm.chat([
      {
        role: 'system',
        content: `判斷以下訊息的重要性。回傳 JSON：
{ "importance": "critical" | "normal" | "trivial", "topics": ["主題1", "主題2"] }

判斷標準：
- critical：包含決定、數字、期限、人名、明確指令
- normal：一般討論、解釋
- trivial：寒暄、確認、重複`,
      },
      { role: 'user', content: message.content },
    ]);

    const result = JSON.parse(response.content);
    return { ...message, ...result };
  }

  async filterForContext(
    messages: SelectiveMessage[],
    tokenBudget: number
  ): Promise<SelectiveMessage[]> {
    // 優先保留 critical，再看 normal，丟掉 trivial
    const critical = messages.filter((m) => m.importance === 'critical');
    const normal = messages.filter((m) => m.importance === 'normal');

    let result = [...critical];
    let currentTokens = this.estimateTokens(result);

    for (const msg of normal.reverse()) {
      const msgTokens = msg.content.length * 1.5;
      if (currentTokens + msgTokens > tokenBudget) break;
      result.unshift(msg);
      currentTokens += msgTokens;
    }

    return result;
  }

  private estimateTokens(messages: SelectiveMessage[]): number {
    return messages.reduce((sum, m) => sum + m.content.length * 1.5, 0);
  }
}
```

| 優點 | 缺點 |
|------|------|
| 保留最有價值的資訊 | 需要額外 LLM 呼叫做分類 |
| 上下文品質最高 | 分類錯誤會導致重要資訊遺失 |
| 可搭配 RAG 做語義檢索 | 實作複雜度最高 |

### 策略比較

```
                    簡單度    上下文保留    Token 成本    適用場景
Sliding Window      ★★★★★    ★★☆☆☆       ★★★★★       短對話、FAQ Bot
Summary + Recent    ★★★☆☆    ★★★★☆       ★★★☆☆       一般客服、助手
Selective Memory    ★★☆☆☆    ★★★★★       ★★☆☆☆       長對話、專案管理
```

**實務建議**：從 Sliding Window 開始，發現不夠時升級到 Summary + Recent。Selective Memory 只在確實需要時才用——它的額外 LLM 呼叫成本不低。

---

## 3. 記憶機制

對話歷史管理處理的是「單次對話內的記憶」。但真正好的 chatbot 需要三層記憶：

```
┌──────────────────────────────────────────────────────┐
│                    記憶架構                            │
│                                                        │
│   ┌────────────────┐   短期記憶（In-Context）          │
│   │ Context Window │   ← 當前對話的 messages[]         │
│   └───────┬────────┘                                   │
│           │                                            │
│   ┌───────▼────────┐   長期記憶（Persistent）          │
│   │ Vector Store   │   ← 歷史對話 embedding 檢索       │
│   │ + Database     │   ← 結構化事實儲存                │
│   └───────┬────────┘                                   │
│           │                                            │
│   ┌───────▼────────┐   個人化（User Profile）          │
│   │ User State     │   ← 偏好、習慣、隱私控制          │
│   └────────────────┘                                   │
└──────────────────────────────────────────────────────┘
```

### 短期記憶（In-Context Memory）

就是 messages array。上一節的三種策略都是在管理這層。重點是：

- **不要超過 context window 的 70%**，留空間給 system prompt 和回覆
- **token 計算要精確**，粗估會出事
- **永遠優先保留最近的 user/assistant 對**

```typescript
function estimateTokensAccurate(text: string): number {
  // 更精確的估算：使用 tiktoken 或類似工具
  // 這裡用簡化版：中文每字約 2 tokens，英文每 4 字母約 1 token
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return chineseChars * 2 + Math.ceil(otherChars / 4);
}

function fitWithinBudget(
  messages: Message[],
  maxTokens: number
): Message[] {
  const system = messages.filter((m) => m.role === 'system');
  const conversation = messages.filter((m) => m.role !== 'system');

  let totalTokens = system.reduce(
    (sum, m) => sum + estimateTokensAccurate(m.content),
    0
  );

  const result: Message[] = [];

  // 從最近的開始往回加，直到超出預算
  for (let i = conversation.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokensAccurate(conversation[i].content);
    if (totalTokens + msgTokens > maxTokens) break;
    result.unshift(conversation[i]);
    totalTokens += msgTokens;
  }

  return [...system, ...result];
}
```

### 長期記憶（Persistent Memory）

用向量資料庫儲存歷史對話，對話時用語義搜尋把相關記憶拉回來。

```typescript
import { OpenAI } from 'openai';

interface MemoryEntry {
  id: string;
  userId: string;
  content: string;
  embedding: number[];
  timestamp: Date;
  sessionId: string;
  type: 'fact' | 'preference' | 'decision' | 'general';
}

class LongTermMemory {
  private openai: OpenAI;
  private vectorStore: VectorStore; // Qdrant / Pinecone / Cloudflare Vectorize

  async store(
    userId: string,
    sessionId: string,
    messages: Message[]
  ): Promise<void> {
    // 把重要的對話段落存入向量庫
    const facts = await this.extractFacts(messages);

    for (const fact of facts) {
      const embedding = await this.embed(fact.content);
      await this.vectorStore.upsert({
        id: crypto.randomUUID(),
        userId,
        content: fact.content,
        embedding,
        timestamp: new Date(),
        sessionId,
        type: fact.type,
      });
    }
  }

  async recall(
    userId: string,
    query: string,
    topK = 5
  ): Promise<MemoryEntry[]> {
    const queryEmbedding = await this.embed(query);

    // 只搜尋該使用者的記憶
    return this.vectorStore.search({
      vector: queryEmbedding,
      filter: { userId },
      topK,
      minScore: 0.7, // 相似度閾值
    });
  }

  private async extractFacts(
    messages: Message[]
  ): Promise<{ content: string; type: MemoryEntry['type'] }[]> {
    const formatted = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `從以下對話中提取值得記住的事實。回傳 JSON 陣列：
[{ "content": "事實描述", "type": "fact|preference|decision|general" }]

提取標準：
- fact：使用者提到的具體事實（公司名、角色、專案名）
- preference：偏好（喜歡用什麼工具、語言、風格）
- decision：做出的決定（選了 A 方案）
- general：其他值得記住的背景資訊

不要提取寒暄或太泛泛的內容。`,
        },
        { role: 'user', content: formatted },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content ?? '[]');
  }

  private async embed(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }
}
```

### 在對話中注入長期記憶

```typescript
class MemoryAugmentedChat {
  private shortTerm: SummaryPlusRecent;
  private longTerm: LongTermMemory;

  async chat(
    userId: string,
    sessionId: string,
    userMessage: string
  ): Promise<string> {
    // 1. 從長期記憶中召回相關內容
    const memories = await this.longTerm.recall(userId, userMessage, 3);

    // 2. 組裝 memory context
    const memoryContext =
      memories.length > 0
        ? `\n\n## 相關記憶\n${memories.map((m) => `- [${m.type}] ${m.content}`).join('\n')}`
        : '';

    // 3. 把記憶注入 system prompt
    const systemPrompt = `你是一個友善的助手。${memoryContext}`;

    // 4. 管理短期對話歷史
    const messages = await this.shortTerm.manage([
      { role: 'system', content: systemPrompt, timestamp: new Date() },
      // ... 現有對話歷史
      { role: 'user', content: userMessage, timestamp: new Date() },
    ]);

    // 5. 呼叫 LLM
    const response = await this.llm.chat(messages);

    return response.content;
  }
}
```

### 個人化與隱私

使用者資料要能被刪除。GDPR 和隱私法規要求你做到這一點。

```typescript
class UserMemoryManager {
  private longTerm: LongTermMemory;
  private userStore: KVNamespace;

  // 使用者要求刪除所有記憶
  async deleteAllMemories(userId: string): Promise<void> {
    await this.longTerm.deleteByUser(userId);
    await this.userStore.delete(userId);
  }

  // 使用者要求刪除特定記憶
  async deleteMemory(userId: string, memoryId: string): Promise<void> {
    await this.longTerm.delete(memoryId, userId);
  }

  // 匯出使用者所有資料（GDPR right to data portability）
  async exportUserData(userId: string): Promise<{
    profile: UserState | null;
    memories: MemoryEntry[];
  }> {
    const profile = await this.userStore.get(userId);
    const memories = await this.longTerm.listByUser(userId);

    return {
      profile: profile ? JSON.parse(profile) : null,
      memories,
    };
  }

  // 個人化注入：把使用者資料轉成 system prompt 的一部分
  buildPersonalizationPrompt(user: UserState): string {
    const lines: string[] = ['## 使用者資訊'];

    if (user.profile.name) {
      lines.push(`- 稱呼：${user.profile.name}`);
    }
    if (user.preferences.responseStyle) {
      lines.push(`- 偏好回覆風格：${user.preferences.responseStyle}`);
    }
    if (user.preferences.topics.length > 0) {
      lines.push(`- 關注主題：${user.preferences.topics.join('、')}`);
    }
    if (user.history.frequentQuestions.length > 0) {
      lines.push(
        `- 常問問題：${user.history.frequentQuestions.slice(0, 3).join('、')}`
      );
    }

    return lines.join('\n');
  }
}
```

**隱私設計原則**：

1. **最小收集**：只記住對改善體驗有直接幫助的資訊
2. **透明度**：讓使用者知道你記住了什麼（提供查看/匯出功能）
3. **可刪除**：使用者說「忘記我」就要真的刪掉，包括向量庫裡的 embedding
4. **過期機制**：設定 TTL，超過 90 天未活躍的記憶自動清理

---

## 4. Streaming 實作（SSE）

使用者不想等 5 秒才看到回覆。Streaming 讓第一個字在幾百毫秒內就出現。

### 基本流程

```
Client                         Server                         LLM
  │                              │                              │
  │  POST /chat                  │                              │
  │ ──────────────────────────▶  │                              │
  │                              │  stream: true                │
  │                              │ ──────────────────────────▶  │
  │                              │                              │
  │  text/event-stream           │  chunk: "你"                 │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: {"content":"你"}      │                              │
  │                              │  chunk: "好"                 │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: {"content":"好"}      │                              │
  │                              │  chunk: "！"                 │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: {"content":"！"}      │                              │
  │                              │  [DONE]                      │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: [DONE]                │                              │
  │                              │                              │
```

### Server 端實作

```typescript
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { OpenAI } from 'openai';

const app = new Hono();

app.post('/api/chat', async (c) => {
  const { messages, sessionId } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });

  return streamSSE(c, async (stream) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullContent += content;

          await stream.writeSSE({
            event: 'message',
            data: JSON.stringify({
              type: 'content',
              content,
            }),
          });
        }
      }

      // 串流結束，送出完整的 metadata
      await stream.writeSSE({
        event: 'message',
        data: JSON.stringify({
          type: 'done',
          usage: {
            totalTokens: fullContent.length * 1.5, // 粗估
          },
        }),
      });
    } catch (error) {
      await stream.writeSSE({
        event: 'error',
        data: JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      });
    }
  });
});

export default app;
```

### Client 端實作

```typescript
class ChatClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async sendMessage(
    messages: { role: string; content: string }[],
    onChunk: (content: string) => void,
    onDone: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      onError(`HTTP ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      onError('No response body');
      return;
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 解析 SSE 事件
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // 最後一行可能不完整，保留

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const data = line.slice(6);
        if (data === '[DONE]') {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content') {
            onChunk(parsed.content);
          } else if (parsed.type === 'done') {
            onDone();
          } else if (parsed.type === 'error') {
            onError(parsed.message);
          }
        } catch {
          // 忽略解析失敗的行
        }
      }
    }
  }
}

// 使用範例
const client = new ChatClient('https://api.example.com');
let fullResponse = '';

await client.sendMessage(
  [{ role: 'user', content: '什麼是 RAG？' }],
  (chunk) => {
    fullResponse += chunk;
    // 即時更新 UI
    updateChatUI(fullResponse);
  },
  () => {
    console.log('Stream 完成');
  },
  (error) => {
    console.error('Stream 錯誤:', error);
    showErrorUI(error);
  }
);
```

### 使用 EventSource（簡化版）

如果你的 API 支援 GET 請求的 SSE：

```typescript
function connectSSE(url: string): void {
  const source = new EventSource(url);

  source.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'content') {
      appendToChat(data.content);
    }
  };

  source.onerror = (event) => {
    console.error('SSE 連線錯誤', event);
    source.close();
    // 實作重連邏輯
    setTimeout(() => connectSSE(url), 3000);
  };
}
```

### Streaming 注意事項

1. **TTFT（Time to First Token）是關鍵指標**：使用者感受到的「速度」主要取決於第一個字多快出現，不是整體回應時間
2. **錯誤處理**：stream 中間斷掉要能優雅降級，至少顯示已收到的部分
3. **取消機制**：使用者切換對話或按停止時，要能 abort stream
4. **背壓控制**：如果前端處理速度跟不上 stream 速度，需要 buffer 機制

```typescript
// 取消 stream 的實作
const controller = new AbortController();

fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
  signal: controller.signal,
});

// 使用者按停止按鈕
stopButton.onclick = () => controller.abort();
```

---

## 5. Guardrails 三層安全機制

你的 chatbot 面向真實使用者，要有防禦深度。三層 Guardrails：

```
              使用者輸入
                 │
        ┌────────▼────────┐
        │  Input Guards    │  ← Prompt injection、PII、內容分類
        │  (Pre-LLM)      │
        └────────┬────────┘
                 │ ✓ 通過
        ┌────────▼────────┐
        │    LLM Call      │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Output Guards   │  ← Faithfulness、Toxicity、幻覺偵測
        │  (Post-LLM)     │
        └────────┬────────┘
                 │ ✓ 通過
        ┌────────▼────────┐
        │  System Guards   │  ← Rate limit、Token budget、Fallback
        │  (Infrastructure)│
        └────────┬────────┘
                 │
              回覆使用者
```

### 第一層：Input Guards

```typescript
interface GuardResult {
  passed: boolean;
  reason?: string;
  action: 'allow' | 'block' | 'modify';
  modifiedContent?: string;
}

class InputGuards {
  // 1. Prompt Injection 偵測
  async detectInjection(input: string): Promise<GuardResult> {
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts)/i,
      /you\s+are\s+now\s+/i,
      /system\s*:\s*/i,
      /\[INST\]/i,
      /<<SYS>>/i,
      /forget\s+(everything|all|your\s+instructions)/i,
      /do\s+not\s+follow\s+(your|the)\s+(rules|instructions)/i,
    ];

    const hasPattern = injectionPatterns.some((p) => p.test(input));

    if (hasPattern) {
      return {
        passed: false,
        reason: 'Potential prompt injection detected',
        action: 'block',
      };
    }

    // 進階：用 LLM 做二次確認（可選，會增加延遲）
    // const llmCheck = await this.llmInjectionCheck(input);

    return { passed: true, action: 'allow' };
  }

  // 2. PII 偵測與遮蔽
  detectAndMaskPII(input: string): GuardResult {
    const piiPatterns: { pattern: RegExp; mask: string; name: string }[] = [
      {
        pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
        mask: '[信用卡號]',
        name: 'credit_card',
      },
      {
        pattern: /\b[A-Z]\d{9}\b/g,
        mask: '[身分證字號]',
        name: 'national_id',
      },
      {
        pattern: /\b09\d{2}[-\s]?\d{3}[-\s]?\d{3}\b/g,
        mask: '[手機號碼]',
        name: 'phone',
      },
      {
        pattern:
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        mask: '[電子郵件]',
        name: 'email',
      },
    ];

    let modified = input;
    const detected: string[] = [];

    for (const { pattern, mask, name } of piiPatterns) {
      if (pattern.test(modified)) {
        detected.push(name);
        modified = modified.replace(pattern, mask);
      }
    }

    if (detected.length > 0) {
      return {
        passed: true,
        reason: `PII detected and masked: ${detected.join(', ')}`,
        action: 'modify',
        modifiedContent: modified,
      };
    }

    return { passed: true, action: 'allow' };
  }

  // 3. 內容分類
  async classifyContent(
    input: string
  ): Promise<GuardResult & { category?: string }> {
    const blockedCategories = ['violence', 'illegal', 'sexual_explicit'];

    // 簡單版：關鍵字過濾
    // 生產版：用分類模型或 moderation API
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    const result = await response.json();
    const flagged = result.results[0]?.flagged;

    if (flagged) {
      return {
        passed: false,
        reason: 'Content flagged by moderation',
        action: 'block',
        category: 'moderation_flagged',
      };
    }

    return { passed: true, action: 'allow' };
  }
}
```

### 第二層：Output Guards

```typescript
class OutputGuards {
  private llm: LLMClient;

  // 1. Faithfulness 檢查（回答是否忠於提供的上下文）
  async checkFaithfulness(
    context: string,
    answer: string
  ): Promise<GuardResult & { score: number }> {
    const response = await this.llm.chat([
      {
        role: 'system',
        content: `你是一個事實查核員。判斷 answer 是否忠實於 context。
回傳 JSON：{ "score": 0.0-1.0, "issues": ["問題描述"] }

score 標準：
- 1.0：完全忠實，所有資訊都來自 context
- 0.7-0.9：大致忠實，有些合理推論
- 0.5-0.7：部分忠實，有些資訊無法從 context 驗證
- 0.0-0.5：不忠實，包含 context 中沒有的事實`,
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nAnswer:\n${answer}`,
      },
    ]);

    const result = JSON.parse(response.content);

    return {
      passed: result.score >= 0.7,
      reason:
        result.score < 0.7
          ? `Faithfulness too low: ${result.score}`
          : undefined,
      action: result.score >= 0.7 ? 'allow' : 'block',
      score: result.score,
    };
  }

  // 2. Toxicity 過濾
  async checkToxicity(output: string): Promise<GuardResult> {
    // 用 OpenAI Moderation API 或自建分類器
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: output }),
    });

    const result = await response.json();

    if (result.results[0]?.flagged) {
      return {
        passed: false,
        reason: 'Output contains toxic content',
        action: 'block',
      };
    }

    return { passed: true, action: 'allow' };
  }

  // 3. 幻覺偵測
  async detectHallucination(
    question: string,
    answer: string,
    sources: string[]
  ): Promise<GuardResult & { claims: { text: string; supported: boolean }[] }> {
    const response = await this.llm.chat([
      {
        role: 'system',
        content: `你是一個幻覺偵測器。把 answer 拆成獨立的事實聲稱（claims），然後判斷每個 claim 是否有 sources 支持。

回傳 JSON：
{
  "claims": [
    { "text": "聲稱內容", "supported": true/false }
  ]
}`,
      },
      {
        role: 'user',
        content: `Question: ${question}\nAnswer: ${answer}\nSources:\n${sources.join('\n---\n')}`,
      },
    ]);

    const result = JSON.parse(response.content);
    const unsupported = result.claims.filter(
      (c: { supported: boolean }) => !c.supported
    );

    return {
      passed: unsupported.length === 0,
      reason:
        unsupported.length > 0
          ? `${unsupported.length} unsupported claims found`
          : undefined,
      action: unsupported.length === 0 ? 'allow' : 'modify',
      claims: result.claims,
    };
  }
}
```

### 第三層：System Guards

```typescript
class SystemGuards {
  private requestCounts: Map<string, { count: number; resetAt: number }> =
    new Map();
  private tokenUsage: Map<string, number> = new Map();

  // 1. Rate Limiting
  checkRateLimit(
    userId: string,
    limit: number,
    windowMs: number
  ): GuardResult {
    const now = Date.now();
    const record = this.requestCounts.get(userId);

    if (!record || now > record.resetAt) {
      this.requestCounts.set(userId, { count: 1, resetAt: now + windowMs });
      return { passed: true, action: 'allow' };
    }

    if (record.count >= limit) {
      return {
        passed: false,
        reason: `Rate limit exceeded: ${limit} requests per ${windowMs / 1000}s`,
        action: 'block',
      };
    }

    record.count++;
    return { passed: true, action: 'allow' };
  }

  // 2. Token Budget
  checkTokenBudget(
    userId: string,
    estimatedTokens: number,
    dailyBudget: number
  ): GuardResult {
    const used = this.tokenUsage.get(userId) ?? 0;

    if (used + estimatedTokens > dailyBudget) {
      return {
        passed: false,
        reason: `Token budget exceeded: ${used}/${dailyBudget}`,
        action: 'block',
      };
    }

    this.tokenUsage.set(userId, used + estimatedTokens);
    return { passed: true, action: 'allow' };
  }

  // 3. Fallback 降級策略
  async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    maxRetries = 2
  ): Promise<T> {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await primary();
      } catch (error) {
        console.error(
          `Attempt ${i + 1} failed:`,
          error instanceof Error ? error.message : error
        );

        if (i === maxRetries) {
          console.warn('All retries failed, using fallback');
          return fallback();
        }

        // 指數退避
        await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
      }
    }

    return fallback(); // TypeScript 需要這行
  }
}

// 使用範例：主模型掛掉時降級到備用模型
const systemGuards = new SystemGuards();

const response = await systemGuards.withFallback(
  // 主路徑：GPT-4o
  () => callLLM({ model: 'gpt-4o', messages }),
  // 降級路徑：GPT-4o-mini
  () => callLLM({ model: 'gpt-4o-mini', messages }),
  2 // 重試 2 次
);
```

### 完整的 Guardrails Pipeline

```typescript
class GuardrailsPipeline {
  private input = new InputGuards();
  private output = new OutputGuards();
  private system = new SystemGuards();

  async process(
    userId: string,
    userMessage: string,
    context: { sources: string[] }
  ): Promise<{
    response: string;
    guardrailsLog: Record<string, unknown>[];
  }> {
    const log: Record<string, unknown>[] = [];

    // === System Guards (先檢查，最便宜) ===
    const rateCheck = this.system.checkRateLimit(userId, 20, 60_000);
    log.push({ guard: 'rate_limit', ...rateCheck });
    if (!rateCheck.passed) {
      return {
        response: '您的請求過於頻繁，請稍後再試。',
        guardrailsLog: log,
      };
    }

    // === Input Guards ===
    const injectionCheck = await this.input.detectInjection(userMessage);
    log.push({ guard: 'injection', ...injectionCheck });
    if (!injectionCheck.passed) {
      return {
        response: '抱歉，我無法處理這類請求。',
        guardrailsLog: log,
      };
    }

    const piiCheck = this.input.detectAndMaskPII(userMessage);
    log.push({ guard: 'pii', ...piiCheck });
    const sanitizedInput =
      piiCheck.action === 'modify'
        ? piiCheck.modifiedContent!
        : userMessage;

    // === LLM Call ===
    const llmResponse = await this.system.withFallback(
      () => callLLM({ model: 'gpt-4o', messages: [/* ... */] }),
      () => callLLM({ model: 'gpt-4o-mini', messages: [/* ... */] })
    );

    // === Output Guards ===
    const toxicityCheck = await this.output.checkToxicity(llmResponse);
    log.push({ guard: 'toxicity', ...toxicityCheck });
    if (!toxicityCheck.passed) {
      return {
        response: '抱歉，我無法提供這類回覆，請換個問題。',
        guardrailsLog: log,
      };
    }

    const faithCheck = await this.output.checkFaithfulness(
      context.sources.join('\n'),
      llmResponse
    );
    log.push({ guard: 'faithfulness', ...faithCheck });

    return {
      response: llmResponse,
      guardrailsLog: log,
    };
  }
}
```

**效能提醒**：每一層 guard 都有延遲成本。生產環境中，不需要的 guard 就關掉。Input guards 用 regex 版幾乎零延遲，用 LLM 版就要多幾百毫秒。Output guards 的 faithfulness check 會額外多一次 LLM 呼叫。根據你的場景做取捨。

---

## 6. 可觀測性

你的 chatbot 上線了，但你怎麼知道它表現好不好？

### Langfuse 整合

[Langfuse](https://langfuse.com) 是開源的 LLM 可觀測性平台。它可以追蹤每一次 LLM 呼叫的 input/output、token 用量、延遲、成本。

```typescript
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_HOST, // self-hosted 或 cloud
});

class ObservableChat {
  async chat(
    userId: string,
    sessionId: string,
    userMessage: string
  ): Promise<string> {
    // 建立 trace：追蹤整個對話流程
    const trace = langfuse.trace({
      name: 'chat',
      userId,
      sessionId,
      input: userMessage,
      metadata: {
        environment: 'production',
      },
    });

    // 追蹤 retrieval 步驟
    const retrievalSpan = trace.span({
      name: 'memory-recall',
      input: { query: userMessage },
    });

    const memories = await this.longTerm.recall(userId, userMessage);
    retrievalSpan.end({
      output: { count: memories.length },
    });

    // 追蹤 LLM 呼叫
    const generation = trace.generation({
      name: 'llm-call',
      model: 'gpt-4o',
      input: messages,
      modelParameters: {
        temperature: 0.7,
        maxTokens: 2048,
      },
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    generation.end({
      output: response.choices[0].message.content,
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
    });

    // 追蹤 guardrails 步驟
    const guardrailSpan = trace.span({
      name: 'guardrails',
      input: { response: response.choices[0].message.content },
    });

    const guardResult = await this.guardrails.checkOutput(
      response.choices[0].message.content!
    );

    guardrailSpan.end({
      output: guardResult,
    });

    // 結束 trace
    const finalResponse = response.choices[0].message.content!;
    trace.update({
      output: finalResponse,
    });

    // 記錄使用者評分（之後從前端回傳）
    // trace.score({ name: 'user-feedback', value: 4 });

    return finalResponse;
  }

  // 使用者點擊 thumbs up/down 時呼叫
  async recordFeedback(
    traceId: string,
    score: number,
    comment?: string
  ): Promise<void> {
    langfuse.score({
      traceId,
      name: 'user-feedback',
      value: score,
      comment,
    });
  }
}
```

### 關鍵指標

| 指標 | 說明 | 目標值 | 如何衡量 |
|------|------|--------|----------|
| **TTFT** | Time to First Token | < 500ms | 從收到 request 到第一個 SSE chunk 的時間 |
| **Latency** | 完整回應時間 | < 3s（簡單問題）< 10s（複雜問題） | 從 request 到最後一個 chunk 的時間 |
| **Faithfulness** | 回答忠實度 | > 0.9 | LLM-as-Judge 或人工抽樣評估 |
| **User Satisfaction** | 使用者滿意度 | > 4/5 | Thumbs up/down 或 1-5 評分 |
| **Token Cost** | 每次對話成本 | 依預算 | Langfuse 自動追蹤 |
| **Error Rate** | 錯誤率 | < 1% | 5xx + stream 中斷 + guardrail block |
| **Guardrail Trigger Rate** | Guard 觸發率 | 監控趨勢 | 各層 guard 的 block/modify 比例 |

### 建立 Dashboard

```typescript
// 每日指標彙總（可用 cron job 跑）
async function dailyMetricsSummary(): Promise<void> {
  const langfuse = new Langfuse({ /* ... */ });

  // 用 Langfuse API 撈資料
  const traces = await langfuse.fetchTraces({
    fromTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    limit: 1000,
  });

  const metrics = {
    totalConversations: traces.data.length,
    avgLatency:
      traces.data.reduce((sum, t) => sum + (t.latency ?? 0), 0) /
      traces.data.length,
    avgTokens:
      traces.data.reduce((sum, t) => sum + (t.totalTokens ?? 0), 0) /
      traces.data.length,
    errorRate:
      traces.data.filter((t) => t.level === 'ERROR').length /
      traces.data.length,
    avgFeedback:
      traces.data
        .filter((t) => t.scores && t.scores.length > 0)
        .reduce(
          (sum, t) => sum + (t.scores?.[0]?.value ?? 0),
          0
        ) /
      traces.data.filter((t) => t.scores && t.scores.length > 0).length,
  };

  console.log('Daily Metrics:', metrics);
  // 推送到 Slack / Discord / 其他告警管道
}
```

### 告警規則

```typescript
interface AlertRule {
  metric: string;
  condition: 'above' | 'below';
  threshold: number;
  window: string; // e.g., '5m', '1h'
  action: (value: number) => void;
}

const alertRules: AlertRule[] = [
  {
    metric: 'faithfulness',
    condition: 'below',
    threshold: 0.7,
    window: '1h',
    action: (v) =>
      sendSlackAlert(
        `Faithfulness 降至 ${v.toFixed(2)}，檢查 retrieval 品質`
      ),
  },
  {
    metric: 'latency_p95',
    condition: 'above',
    threshold: 5000,
    window: '5m',
    action: (v) =>
      sendSlackAlert(
        `P95 延遲飆升至 ${v}ms，檢查 LLM provider 狀態`
      ),
  },
  {
    metric: 'error_rate',
    condition: 'above',
    threshold: 0.05,
    window: '10m',
    action: (v) =>
      sendSlackAlert(
        `錯誤率 ${(v * 100).toFixed(1)}%，檢查 tool calling 和 API 狀態`
      ),
  },
  {
    metric: 'guardrail_block_rate',
    condition: 'above',
    threshold: 0.2,
    window: '1h',
    action: (v) =>
      sendSlackAlert(
        `Guardrail 封鎖率 ${(v * 100).toFixed(1)}%，可能有攻擊或規則過嚴`
      ),
  },
];
```

**可觀測性不是選配，是必備**。沒有可觀測性的 chatbot 就是瞎飛。你不知道使用者的真實體驗是什麼、哪裡在掉球、每天燒多少錢。

---

## 7. 技術棧選型

### TypeScript / Cloudflare Workers

```
┌────────────────────────────────────────┐
│         Cloudflare Workers Stack        │
│                                          │
│  Framework:  Hono                        │
│  AI SDK:     Vercel AI SDK / OpenAI SDK  │
│  Vector DB:  Cloudflare Vectorize        │
│  KV Store:   Cloudflare KV / D1          │
│  Embedding:  Workers AI / OpenAI         │
│  Runtime:    V8 Isolate (Edge)           │
│                                          │
│  優勢：                                   │
│  ✓ 邊緣部署，全球低延遲                   │
│  ✓ 冷啟動 < 5ms                          │
│  ✓ 前後端同語言，型別安全                 │
│  ✓ 基礎設施即平台（KV + D1 + Vectorize） │
│  ✓ 免費額度慷慨                           │
│                                          │
│  限制：                                   │
│  ✗ ML 生態不如 Python                     │
│  ✗ 執行時間限制（30s / 15min paid）       │
│  ✗ 不能跑自定義模型                       │
└────────────────────────────────────────┘
```

```typescript
// Cloudflare Workers + Hono 的完整 chatbot 入口
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

interface Env {
  OPENAI_API_KEY: string;
  VECTORIZE: VectorizeIndex;
  KV: KVNamespace;
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.post('/api/chat', async (c) => {
  const { messages, userId, sessionId } = await c.req.json();

  // 1. Rate limit (用 KV 做計數)
  const rateKey = `rate:${userId}:${Math.floor(Date.now() / 60000)}`;
  const count = parseInt((await c.env.KV.get(rateKey)) ?? '0');
  if (count > 20) {
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }
  await c.env.KV.put(rateKey, String(count + 1), { expirationTtl: 120 });

  // 2. Recall memories from Vectorize
  // 3. Build context
  // 4. Stream response
  return streamSSE(c, async (stream) => {
    // ... streaming 邏輯
  });
});

export default app;
```

### Python / FastAPI

```
┌────────────────────────────────────────┐
│         Python / FastAPI Stack           │
│                                          │
│  Framework:  FastAPI                     │
│  AI SDK:     LangChain / LlamaIndex     │
│  Vector DB:  Qdrant / Weaviate / Chroma │
│  Database:   PostgreSQL + pgvector      │
│  Embedding:  sentence-transformers      │
│  Runtime:    uvicorn / gunicorn          │
│                                          │
│  優勢：                                   │
│  ✓ ML 生態最完整（PyTorch, transformers）│
│  ✓ 可以跑本地模型和 fine-tune            │
│  ✓ LangChain / LlamaIndex 框架成熟      │
│  ✓ 科學計算和資料處理庫最豐富            │
│  ✓ 人才庫大                               │
│                                          │
│  限制：                                   │
│  ✗ 部署比 serverless 複雜                 │
│  ✗ 冷啟動較慢                             │
│  ✗ 沒有內建的型別安全                     │
│  ✗ 併發模型（async）比 Node.js 晚成熟    │
└────────────────────────────────────────┘
```

### 比較表

| 面向 | TypeScript / Cloudflare | Python / FastAPI |
|------|------------------------|------------------|
| **延遲** | 邊緣部署，全球 < 50ms | 需自行部署多區域 |
| **冷啟動** | < 5ms | 數百 ms ~ 數秒 |
| **ML 生態** | 有限，依賴 API | 完整，可跑本地模型 |
| **Fine-tuning** | 不支援 | 原生支援 |
| **框架成熟度** | Hono + AI SDK（輕量快速） | LangChain / LlamaIndex（功能全面） |
| **型別安全** | TypeScript 原生支援 | 需要 Pydantic + mypy |
| **部署複雜度** | `wrangler deploy` 一鍵 | Docker + K8s 或 PaaS |
| **成本模型** | 按量計費，免費額度大 | 需維護伺服器 |
| **向量搜尋** | Vectorize（整合平台） | Qdrant/Weaviate（更多選擇） |
| **即時通訊整合** | 適合 webhook-based | 適合長連線場景 |

### 選型決策樹

```
你需要 fine-tune 模型嗎？
  ├── 是 → Python
  └── 否 →
      你需要跑本地模型嗎？
        ├── 是 → Python
        └── 否 →
            你的團隊主要語言是？
              ├── Python → Python / FastAPI
              ├── TypeScript → TS / Cloudflare Workers
              └── 都會 →
                  延遲敏感度？
                    ├── 極高（全球用戶） → TS / Cloudflare Workers
                    └── 一般 →
                        已有基礎設施嗎？
                          ├── AWS/GCP → Python（更多整合）
                          ├── Cloudflare → TypeScript
                          └── 沒有 → 看團隊偏好
```

### 混合架構

實務上很多團隊會用混合架構：

```
┌─────────────────────────────────────────────────┐
│                 混合架構範例                       │
│                                                   │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Cloudflare       │  │  Python Backend       │  │
│  │  Workers (TS)     │  │  (FastAPI)            │  │
│  │                    │  │                       │  │
│  │  • API Gateway     │  │  • 複雜 RAG Pipeline  │  │
│  │  • SSE Streaming   │  │  • Embedding 生成     │  │
│  │  • Rate Limiting   │  │  • Fine-tuned 模型    │  │
│  │  • Static Assets   │  │  • 批次處理           │  │
│  │  • Session 管理    │  │  • 評估 Pipeline      │  │
│  │                    │  │                       │  │
│  └────────┬───────────┘  └───────────┬───────────┘  │
│           │              ▲            │              │
│           └──── HTTP ────┘            │              │
│                                       │              │
│  ┌────────────────────────────────────▼───────────┐  │
│  │               共用基礎設施                       │  │
│  │  PostgreSQL + pgvector  |  Redis  |  Langfuse  │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

TypeScript 負責使用者接觸的「邊緣層」——低延遲、streaming、session 管理。Python 負責「核心 AI 層」——RAG pipeline、embedding、模型推論。兩者用 HTTP 或 message queue 溝通。

**選型原則總結**：

1. **已有基礎設施 → 跟著走**，不要為了用新技術而遷移
2. **從零開始 → 看團隊技能**，工程師熟悉什麼就用什麼
3. **需要 fine-tuning → 必須 Python**，這沒有例外
4. **純 RAG 場景 → 兩者皆可**，選部署最輕鬆的
5. **全球低延遲 → Edge runtime（Cloudflare Workers）**有天然優勢

---

## 總結

一個生產級聊天機器人的架構全景：

```
                        使用者
                          │
                   ┌──────▼──────┐
                   │  Frontend    │  React / Next.js
                   │  SSE Client  │  EventSource / fetch
                   └──────┬──────┘
                          │
                   ┌──────▼──────┐
                   │  API Layer   │  Hono / FastAPI
                   │  Streaming   │  SSE / WebSocket
                   └──────┬──────┘
                          │
              ┌───────────▼───────────┐
              │    Guardrails Pipeline │
              │  Input → LLM → Output │
              └───────────┬───────────┘
                          │
         ┌────────────────▼────────────────┐
         │         State Management         │
         │  Session  │  User  │  Global     │
         └────────────────┬────────────────┘
                          │
         ┌────────────────▼────────────────┐
         │       Memory Layer               │
         │  Short-term  │  Long-term        │
         │  (context)   │  (vector store)   │
         └────────────────┬────────────────┘
                          │
         ┌────────────────▼────────────────┐
         │      Observability (Langfuse)    │
         │  Traces │ Metrics │ Alerts       │
         └─────────────────────────────────┘
```

每一層的設計決策都會影響最終的使用者體驗。不要試圖一次做完所有層——先把核心的 State Management + Streaming 做好，讓使用者能流暢對話，再逐步加上 Guardrails、Memory 和 Observability。

記住：**使用者不在乎你用了什麼模型。他們在乎的是：回覆快不快、記不記得住、安不安全。** 這三件事，都不是 API 呼叫能解決的。
