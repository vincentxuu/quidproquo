---
title: "Complete Chatbot Development Guide: State Management, Memory Strategies, and Tech Stack Selection"
date: 2026-03-13
type: guide
category: ai
tags: [chatbot, state-management, memory, streaming, guardrails, langfuse]
lang: en
tldr: "Building a chatbot is more than just calling an API. Conversation state management, memory mechanisms, streaming, guardrails, observability, and tech stack selection — every layer affects the user experience."
description: "A complete development guide covering conversation state architecture (Session/User/Global State), memory strategies (Sliding Window/Summary+Recent/Selective), SSE Streaming, three-layer Guardrails, Langfuse observability, and TypeScript vs Python tech stack selection."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-13-chatbot-development-guide)

Most people think "chatbot" means "call the OpenAI API and display the response."

But if you've ever shipped a real chatbot to production, you know — the API call is only 10% of the engineering effort. The remaining 90% is:

- Should the conversation remember context? How much?
- Where does memory live? In-memory? Database? Vector store?
- Should responses come all at once or via streaming?
- What if a user sends a malicious prompt?
- How do you track model hallucinations?
- How much does each conversation cost? Where can you optimize?

This article breaks chatbot development into seven layers, each with architecture diagrams, code, and design decisions.

---

## 1. Conversation State Management Architecture

A chatbot needs to manage three types of state with different lifecycles:

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
│  │ TTL: 1 conv │  │ TTL: perm   │  │ TTL: perm    │ │
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

### Session State (Conversation Level)

State isolated to each conversation session. Resets when the user starts a new conversation.

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

### User State (User Level)

Persists across conversations — remembers who the user is and their preferences.

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

### Global State (System Level)

Shared configuration across all users.

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

### Complete State Manager

```typescript
class ChatStateManager {
  private sessions: Map<string, SessionState> = new Map();
  private userStore: KVNamespace; // Cloudflare KV or other persistent storage
  private globalConfig: GlobalState;

  async assembleContext(
    sessionId: string,
    userId: string
  ): Promise<Message[]> {
    const session = this.sessions.get(sessionId);
    const user = await this.getUserState(userId);

    // Assemble context: system prompt + personalized info + conversation history
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
      prompt += `\n\n## User Preferences`;
      prompt += `\n- Language: ${user.profile.language}`;
      prompt += `\n- Response style: ${user.preferences.responseStyle}`;
      prompt += `\n- Topics of interest: ${user.preferences.topics.join(', ')}`;
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

**Design Decision**: Session State goes in memory (Map / Redis), User State goes in KV or a database, Global State goes in environment variables or config. The three-layer separation lets you independently tune the TTL and storage strategy for each layer.

---

## 2. Conversation History Management Strategies

The context window is finite — you can't stuff all conversation history into it. Three mainstream strategies:

### Strategy 1: Sliding Window

The simplest approach. Keep only the most recent N turns.

```typescript
function slidingWindow(messages: Message[], windowSize: number): Message[] {
  // Always keep the system prompt
  const system = messages.filter((m) => m.role === 'system');
  const conversation = messages.filter((m) => m.role !== 'system');

  // Take the last N turns (one turn = user + assistant)
  const kept = conversation.slice(-windowSize * 2);

  return [...system, ...kept];
}
```

```
Timeline →
[msg1] [msg2] [msg3] [msg4] [msg5] [msg6] [msg7] [msg8]
                                    ├──── window = 2 ────┤
                                    Keep msg5-msg8
```

| Pros | Cons |
|------|------|
| Simplest to implement | Early important conversations get dropped |
| Predictable token usage | Breaks when user says "that thing from earlier" |
| Good for short conversation scenarios | Not suitable for tasks requiring long-term context |

### Strategy 2: Summary + Recent

Older conversations are compressed into summaries by the LLM, while recent messages are kept verbatim. Balances context retention and token usage.

```typescript
class SummaryPlusRecent {
  private llm: LLMClient;
  private maxRecentMessages = 10;
  private summaryTokenThreshold = 2000;

  async manage(messages: Message[]): Promise<Message[]> {
    const system = messages.filter((m) => m.role === 'system');
    const conversation = messages.filter((m) => m.role !== 'system');

    if (this.estimateTokens(conversation) <= this.summaryTokenThreshold) {
      // Haven't exceeded the threshold — keep everything
      return messages;
    }

    // Split: old messages get summarized, recent ones are kept
    const recent = conversation.slice(-this.maxRecentMessages);
    const toSummarize = conversation.slice(0, -this.maxRecentMessages);

    const summary = await this.summarize(toSummarize);

    // Insert the summary as a system message
    const summaryMessage: Message = {
      role: 'system',
      content: `## Previous Conversation Summary\n${summary}`,
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
          'Summarize the key points of the following conversation, preserving critical information (names, numbers, decisions, action items). Use bullet points.',
      },
      { role: 'user', content: formatted },
    ]);

    return response.content;
  }

  private estimateTokens(messages: Message[]): number {
    // Rough estimate: Chinese ~1.5 tokens/char, English ~1.3 tokens/word
    return messages.reduce((sum, m) => sum + m.content.length * 1.5, 0);
  }
}
```

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  [msg1..msg20]  ──LLM──▶  [summary]               │
│    Old messages             Compressed to summary  │
│                                                    │
│  [summary] + [msg21..msg30]                        │
│     ↑ Summary    ↑ Last 10 turns verbatim          │
│                                                    │
│  ──── This is the context sent to the LLM ────     │
└──────────────────────────────────────────────────┘
```

| Pros | Cons |
|------|------|
| Retains long-term context | Summary process loses details |
| Controllable token usage | Each summary requires an extra LLM call (costs money) |
| Best balanced experience | Summary quality depends on prompt design |

### Strategy 3: Selective Memory

Only keeps messages marked as "important." Requires additional classification logic.

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
        content: `Evaluate the importance of the following message. Return JSON:
{ "importance": "critical" | "normal" | "trivial", "topics": ["topic1", "topic2"] }

Criteria:
- critical: Contains decisions, numbers, deadlines, names, explicit instructions
- normal: General discussion, explanations
- trivial: Greetings, confirmations, repetitions`,
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
    // Prioritize critical messages, then normal, drop trivial
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

| Pros | Cons |
|------|------|
| Retains the most valuable information | Requires extra LLM calls for classification |
| Highest quality context | Misclassification can lose important information |
| Can be combined with RAG for semantic retrieval | Highest implementation complexity |

### Strategy Comparison

```
                    Simplicity  Context Retention  Token Cost   Use Case
Sliding Window      ★★★★★       ★★☆☆☆              ★★★★★       Short chats, FAQ Bots
Summary + Recent    ★★★☆☆       ★★★★☆              ★★★☆☆       General CS, Assistants
Selective Memory    ★★☆☆☆       ★★★★★              ★★☆☆☆       Long chats, Project Mgmt
```

**Practical Advice**: Start with Sliding Window. When it's not enough, upgrade to Summary + Recent. Use Selective Memory only when truly needed — the extra LLM call cost is non-trivial.

---

## 3. Memory Mechanisms

Conversation history management handles "memory within a single conversation." But a truly good chatbot needs three layers of memory:

```
┌──────────────────────────────────────────────────────┐
│                  Memory Architecture                   │
│                                                        │
│   ┌────────────────┐   Short-term Memory (In-Context)  │
│   │ Context Window │   ← Current conversation messages[]│
│   └───────┬────────┘                                   │
│           │                                            │
│   ┌───────▼────────┐   Long-term Memory (Persistent)   │
│   │ Vector Store   │   ← Historical conversation        │
│   │ + Database     │     embedding retrieval            │
│   └───────┬────────┘   ← Structured fact storage        │
│           │                                            │
│   ┌───────▼────────┐   Personalization (User Profile)  │
│   │ User State     │   ← Preferences, habits, privacy  │
│   └────────────────┘                                   │
└──────────────────────────────────────────────────────┘
```

### Short-term Memory (In-Context Memory)

This is the messages array. The three strategies from the previous section all manage this layer. Key points:

- **Don't exceed 70% of the context window** — leave room for the system prompt and response
- **Token counting must be accurate** — rough estimates will cause problems
- **Always prioritize keeping the most recent user/assistant pairs**

```typescript
function estimateTokensAccurate(text: string): number {
  // More accurate estimation: use tiktoken or similar tools
  // Simplified version: Chinese ~2 tokens per character, English ~1 token per 4 letters
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
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

  // Add from most recent backwards until budget is exceeded
  for (let i = conversation.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokensAccurate(conversation[i].content);
    if (totalTokens + msgTokens > maxTokens) break;
    result.unshift(conversation[i]);
    totalTokens += msgTokens;
  }

  return [...system, ...result];
}
```

### Long-term Memory (Persistent Memory)

Store historical conversations in a vector database and use semantic search to recall relevant memories during conversations.

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
    // Store important conversation segments in the vector database
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

    // Only search within this user's memories
    return this.vectorStore.search({
      vector: queryEmbedding,
      filter: { userId },
      topK,
      minScore: 0.7, // Similarity threshold
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
          content: `Extract noteworthy facts from the following conversation. Return a JSON array:
[{ "content": "fact description", "type": "fact|preference|decision|general" }]

Extraction criteria:
- fact: Specific facts mentioned by the user (company name, role, project name)
- preference: Preferences (preferred tools, languages, style)
- decision: Decisions made (chose option A)
- general: Other background information worth remembering

Do not extract greetings or overly generic content.`,
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

### Injecting Long-term Memory into Conversations

```typescript
class MemoryAugmentedChat {
  private shortTerm: SummaryPlusRecent;
  private longTerm: LongTermMemory;

  async chat(
    userId: string,
    sessionId: string,
    userMessage: string
  ): Promise<string> {
    // 1. Recall relevant content from long-term memory
    const memories = await this.longTerm.recall(userId, userMessage, 3);

    // 2. Assemble memory context
    const memoryContext =
      memories.length > 0
        ? `\n\n## Relevant Memories\n${memories.map((m) => `- [${m.type}] ${m.content}`).join('\n')}`
        : '';

    // 3. Inject memories into the system prompt
    const systemPrompt = `You are a friendly assistant.${memoryContext}`;

    // 4. Manage short-term conversation history
    const messages = await this.shortTerm.manage([
      { role: 'system', content: systemPrompt, timestamp: new Date() },
      // ... existing conversation history
      { role: 'user', content: userMessage, timestamp: new Date() },
    ]);

    // 5. Call the LLM
    const response = await this.llm.chat(messages);

    return response.content;
  }
}
```

### Personalization and Privacy

User data must be deletable. GDPR and privacy regulations require this.

```typescript
class UserMemoryManager {
  private longTerm: LongTermMemory;
  private userStore: KVNamespace;

  // User requests deletion of all memories
  async deleteAllMemories(userId: string): Promise<void> {
    await this.longTerm.deleteByUser(userId);
    await this.userStore.delete(userId);
  }

  // User requests deletion of a specific memory
  async deleteMemory(userId: string, memoryId: string): Promise<void> {
    await this.longTerm.delete(memoryId, userId);
  }

  // Export all user data (GDPR right to data portability)
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

  // Personalization injection: convert user data into part of the system prompt
  buildPersonalizationPrompt(user: UserState): string {
    const lines: string[] = ['## User Information'];

    if (user.profile.name) {
      lines.push(`- Name: ${user.profile.name}`);
    }
    if (user.preferences.responseStyle) {
      lines.push(`- Preferred response style: ${user.preferences.responseStyle}`);
    }
    if (user.preferences.topics.length > 0) {
      lines.push(`- Topics of interest: ${user.preferences.topics.join(', ')}`);
    }
    if (user.history.frequentQuestions.length > 0) {
      lines.push(
        `- Frequently asked questions: ${user.history.frequentQuestions.slice(0, 3).join(', ')}`
      );
    }

    return lines.join('\n');
  }
}
```

**Privacy Design Principles**:

1. **Minimum Collection**: Only remember information that directly improves the experience
2. **Transparency**: Let users know what you've remembered (provide view/export functionality)
3. **Deletable**: When a user says "forget me," actually delete everything — including embeddings in the vector store
4. **Expiration**: Set TTLs, and automatically clean up memories for users inactive for more than 90 days

---

## 4. Streaming Implementation (SSE)

Users don't want to wait 5 seconds to see a response. Streaming makes the first character appear within a few hundred milliseconds.

### Basic Flow

```
Client                         Server                         LLM
  │                              │                              │
  │  POST /chat                  │                              │
  │ ──────────────────────────▶  │                              │
  │                              │  stream: true                │
  │                              │ ──────────────────────────▶  │
  │                              │                              │
  │  text/event-stream           │  chunk: "Hello"              │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: {"content":"Hello"}   │                              │
  │                              │  chunk: " there"             │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: {"content":" there"}  │                              │
  │                              │  chunk: "!"                  │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: {"content":"!"}       │                              │
  │                              │  [DONE]                      │
  │ ◀──────────────────────────  │ ◀──────────────────────────  │
  │  data: [DONE]                │                              │
  │                              │                              │
```

### Server-side Implementation

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

      // Stream finished — send complete metadata
      await stream.writeSSE({
        event: 'message',
        data: JSON.stringify({
          type: 'done',
          usage: {
            totalTokens: fullContent.length * 1.5, // Rough estimate
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

### Client-side Implementation

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

      // Parse SSE events
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // Last line might be incomplete — keep it

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
          // Ignore lines that fail to parse
        }
      }
    }
  }
}

// Usage example
const client = new ChatClient('https://api.example.com');
let fullResponse = '';

await client.sendMessage(
  [{ role: 'user', content: 'What is RAG?' }],
  (chunk) => {
    fullResponse += chunk;
    // Update UI in real-time
    updateChatUI(fullResponse);
  },
  () => {
    console.log('Stream complete');
  },
  (error) => {
    console.error('Stream error:', error);
    showErrorUI(error);
  }
);
```

### Using EventSource (Simplified Version)

If your API supports SSE via GET requests:

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
    console.error('SSE connection error', event);
    source.close();
    // Implement reconnection logic
    setTimeout(() => connectSSE(url), 3000);
  };
}
```

### Streaming Considerations

1. **TTFT (Time to First Token) is the key metric**: The "speed" users perceive mainly depends on how fast the first character appears, not the total response time
2. **Error handling**: If the stream breaks mid-way, degrade gracefully — at minimum show the content already received
3. **Cancellation mechanism**: When a user switches conversations or hits stop, you must be able to abort the stream
4. **Backpressure control**: If the frontend can't keep up with the stream speed, you need a buffer mechanism

```typescript
// Stream cancellation implementation
const controller = new AbortController();

fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
  signal: controller.signal,
});

// User clicks the stop button
stopButton.onclick = () => controller.abort();
```

---

## 5. Three-Layer Guardrails Security Mechanism

Your chatbot faces real users — you need defense in depth. Three layers of Guardrails:

```
              User Input
                 │
        ┌────────▼────────┐
        │  Input Guards    │  ← Prompt injection, PII, content classification
        │  (Pre-LLM)      │
        └────────┬────────┘
                 │ ✓ Passed
        ┌────────▼────────┐
        │    LLM Call      │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Output Guards   │  ← Faithfulness, Toxicity, hallucination detection
        │  (Post-LLM)     │
        └────────┬────────┘
                 │ ✓ Passed
        ┌────────▼────────┐
        │  System Guards   │  ← Rate limit, Token budget, Fallback
        │  (Infrastructure)│
        └────────┬────────┘
                 │
              Reply to User
```

### Layer 1: Input Guards

```typescript
interface GuardResult {
  passed: boolean;
  reason?: string;
  action: 'allow' | 'block' | 'modify';
  modifiedContent?: string;
}

class InputGuards {
  // 1. Prompt Injection Detection
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

    // Advanced: Use LLM for secondary confirmation (optional, adds latency)
    // const llmCheck = await this.llmInjectionCheck(input);

    return { passed: true, action: 'allow' };
  }

  // 2. PII Detection and Masking
  detectAndMaskPII(input: string): GuardResult {
    const piiPatterns: { pattern: RegExp; mask: string; name: string }[] = [
      {
        pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
        mask: '[CREDIT_CARD]',
        name: 'credit_card',
      },
      {
        pattern: /\b[A-Z]\d{9}\b/g,
        mask: '[NATIONAL_ID]',
        name: 'national_id',
      },
      {
        pattern: /\b09\d{2}[-\s]?\d{3}[-\s]?\d{3}\b/g,
        mask: '[PHONE_NUMBER]',
        name: 'phone',
      },
      {
        pattern:
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        mask: '[EMAIL]',
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

  // 3. Content Classification
  async classifyContent(
    input: string
  ): Promise<GuardResult & { category?: string }> {
    const blockedCategories = ['violence', 'illegal', 'sexual_explicit'];

    // Simple version: keyword filtering
    // Production version: use a classification model or moderation API
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

### Layer 2: Output Guards

```typescript
class OutputGuards {
  private llm: LLMClient;

  // 1. Faithfulness Check (whether the answer is faithful to the provided context)
  async checkFaithfulness(
    context: string,
    answer: string
  ): Promise<GuardResult & { score: number }> {
    const response = await this.llm.chat([
      {
        role: 'system',
        content: `You are a fact checker. Determine whether the answer is faithful to the context.
Return JSON: { "score": 0.0-1.0, "issues": ["issue description"] }

Score criteria:
- 1.0: Completely faithful, all information comes from the context
- 0.7-0.9: Mostly faithful, some reasonable inferences
- 0.5-0.7: Partially faithful, some information cannot be verified from the context
- 0.0-0.5: Unfaithful, contains facts not present in the context`,
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

  // 2. Toxicity Filtering
  async checkToxicity(output: string): Promise<GuardResult> {
    // Use OpenAI Moderation API or a custom classifier
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

  // 3. Hallucination Detection
  async detectHallucination(
    question: string,
    answer: string,
    sources: string[]
  ): Promise<GuardResult & { claims: { text: string; supported: boolean }[] }> {
    const response = await this.llm.chat([
      {
        role: 'system',
        content: `You are a hallucination detector. Break the answer into independent factual claims, then determine whether each claim is supported by the sources.

Return JSON:
{
  "claims": [
    { "text": "claim content", "supported": true/false }
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

### Layer 3: System Guards

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

  // 3. Fallback Degradation Strategy
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

        // Exponential backoff
        await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
      }
    }

    return fallback(); // TypeScript requires this line
  }
}

// Usage example: degrade to a backup model when the primary model is down
const systemGuards = new SystemGuards();

const response = await systemGuards.withFallback(
  // Primary path: GPT-4o
  () => callLLM({ model: 'gpt-4o', messages }),
  // Fallback path: GPT-4o-mini
  () => callLLM({ model: 'gpt-4o-mini', messages }),
  2 // Retry 2 times
);
```

### Complete Guardrails Pipeline

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

    // === System Guards (check first — cheapest) ===
    const rateCheck = this.system.checkRateLimit(userId, 20, 60_000);
    log.push({ guard: 'rate_limit', ...rateCheck });
    if (!rateCheck.passed) {
      return {
        response: 'Your requests are too frequent. Please try again later.',
        guardrailsLog: log,
      };
    }

    // === Input Guards ===
    const injectionCheck = await this.input.detectInjection(userMessage);
    log.push({ guard: 'injection', ...injectionCheck });
    if (!injectionCheck.passed) {
      return {
        response: 'Sorry, I cannot process this type of request.',
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
        response: 'Sorry, I cannot provide this type of response. Please try a different question.',
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

**Performance Note**: Every guard layer has a latency cost. In production, disable guards you don't need. Input guards using regex have near-zero latency; using the LLM version adds a few hundred milliseconds. Output guards' faithfulness check requires an additional LLM call. Make tradeoffs based on your scenario.

---

## 6. Observability

Your chatbot is live — but how do you know if it's performing well?

### Langfuse Integration

[Langfuse](https://langfuse.com) is an open-source LLM observability platform. It can track every LLM call's input/output, token usage, latency, and cost.

```typescript
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_HOST, // self-hosted or cloud
});

class ObservableChat {
  async chat(
    userId: string,
    sessionId: string,
    userMessage: string
  ): Promise<string> {
    // Create a trace: track the entire conversation flow
    const trace = langfuse.trace({
      name: 'chat',
      userId,
      sessionId,
      input: userMessage,
      metadata: {
        environment: 'production',
      },
    });

    // Track the retrieval step
    const retrievalSpan = trace.span({
      name: 'memory-recall',
      input: { query: userMessage },
    });

    const memories = await this.longTerm.recall(userId, userMessage);
    retrievalSpan.end({
      output: { count: memories.length },
    });

    // Track the LLM call
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

    // Track the guardrails step
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

    // End the trace
    const finalResponse = response.choices[0].message.content!;
    trace.update({
      output: finalResponse,
    });

    // Record user rating (returned from the frontend later)
    // trace.score({ name: 'user-feedback', value: 4 });

    return finalResponse;
  }

  // Called when the user clicks thumbs up/down
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

### Key Metrics

| Metric | Description | Target | How to Measure |
|--------|-------------|--------|----------------|
| **TTFT** | Time to First Token | < 500ms | Time from request received to first SSE chunk |
| **Latency** | Total response time | < 3s (simple) < 10s (complex) | Time from request to last chunk |
| **Faithfulness** | Answer fidelity | > 0.9 | LLM-as-Judge or manual sampling |
| **User Satisfaction** | User satisfaction | > 4/5 | Thumbs up/down or 1-5 rating |
| **Token Cost** | Cost per conversation | Budget-dependent | Automatically tracked by Langfuse |
| **Error Rate** | Error rate | < 1% | 5xx + stream breaks + guardrail blocks |
| **Guardrail Trigger Rate** | Guard trigger rate | Monitor trends | Block/modify ratio for each guard layer |

### Building a Dashboard

```typescript
// Daily metrics summary (can be run as a cron job)
async function dailyMetricsSummary(): Promise<void> {
  const langfuse = new Langfuse({ /* ... */ });

  // Fetch data via the Langfuse API
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
  // Push to Slack / Discord / other alerting channels
}
```

### Alert Rules

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
        `Faithfulness dropped to ${v.toFixed(2)} — check retrieval quality`
      ),
  },
  {
    metric: 'latency_p95',
    condition: 'above',
    threshold: 5000,
    window: '5m',
    action: (v) =>
      sendSlackAlert(
        `P95 latency spiked to ${v}ms — check LLM provider status`
      ),
  },
  {
    metric: 'error_rate',
    condition: 'above',
    threshold: 0.05,
    window: '10m',
    action: (v) =>
      sendSlackAlert(
        `Error rate ${(v * 100).toFixed(1)}% — check tool calling and API status`
      ),
  },
  {
    metric: 'guardrail_block_rate',
    condition: 'above',
    threshold: 0.2,
    window: '1h',
    action: (v) =>
      sendSlackAlert(
        `Guardrail block rate ${(v * 100).toFixed(1)}% — possible attack or overly strict rules`
      ),
  },
];
```

**Observability is not optional — it's essential.** A chatbot without observability is flying blind. You won't know what the real user experience is, where things are breaking, or how much money you're burning each day.

---

## 7. Tech Stack Selection

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
│  Strengths:                              │
│  ✓ Edge deployment, low latency globally │
│  ✓ Cold start < 5ms                     │
│  ✓ Same language front & back, type-safe │
│  ✓ Infrastructure as platform            │
│    (KV + D1 + Vectorize)                │
│  ✓ Generous free tier                    │
│                                          │
│  Limitations:                            │
│  ✗ ML ecosystem weaker than Python       │
│  ✗ Execution time limits                 │
│    (30s / 15min paid)                   │
│  ✗ Cannot run custom models              │
└────────────────────────────────────────┘
```

```typescript
// Complete chatbot entry point with Cloudflare Workers + Hono
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

interface WorkerEnv {
  OPENAI_API_KEY: string;
  VECTORIZE: VectorizeIndex;
  KV: KVNamespace;
  DB: D1Database;
}

const app = new Hono<{ Bindings: WorkerEnv }>();

app.post('/api/chat', async (c) => {
  const { messages, userId, sessionId } = await c.req.json();

  // 1. Rate limit (using KV for counting)
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
    // ... streaming logic
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
│  Strengths:                              │
│  ✓ Most complete ML ecosystem            │
│    (PyTorch, transformers)              │
│  ✓ Can run local models and fine-tune    │
│  ✓ Mature LangChain / LlamaIndex        │
│    frameworks                           │
│  ✓ Richest scientific computing and      │
│    data processing libraries            │
│  ✓ Large talent pool                     │
│                                          │
│  Limitations:                            │
│  ✗ Deployment more complex than          │
│    serverless                           │
│  ✗ Slower cold starts                    │
│  ✗ No built-in type safety               │
│  ✗ Async concurrency model matured       │
│    later than Node.js                   │
└────────────────────────────────────────┘
```

### Comparison Table

| Aspect | TypeScript / Cloudflare | Python / FastAPI |
|--------|------------------------|------------------|
| **Latency** | Edge deployment, < 50ms globally | Requires self-managed multi-region deployment |
| **Cold Start** | < 5ms | Hundreds of ms to seconds |
| **ML Ecosystem** | Limited, depends on APIs | Complete, can run local models |
| **Fine-tuning** | Not supported | Natively supported |
| **Framework Maturity** | Hono + AI SDK (lightweight, fast) | LangChain / LlamaIndex (feature-rich) |
| **Type Safety** | Native TypeScript support | Requires Pydantic + mypy |
| **Deployment Complexity** | `wrangler deploy` one-click | Docker + K8s or PaaS |
| **Cost Model** | Pay-per-use, generous free tier | Server maintenance required |
| **Vector Search** | Vectorize (integrated platform) | Qdrant/Weaviate (more options) |
| **Messaging Integration** | Great for webhook-based | Great for long-connection scenarios |

### Selection Decision Tree

```
Do you need to fine-tune models?
  ├── Yes → Python
  └── No →
      Do you need to run local models?
        ├── Yes → Python
        └── No →
            What is your team's primary language?
              ├── Python → Python / FastAPI
              ├── TypeScript → TS / Cloudflare Workers
              └── Both →
                  Latency sensitivity?
                    ├── Very high (global users) → TS / Cloudflare Workers
                    └── Normal →
                        Existing infrastructure?
                          ├── AWS/GCP → Python (more integrations)
                          ├── Cloudflare → TypeScript
                          └── None → Go with team preference
```

### Hybrid Architecture

In practice, many teams use a hybrid architecture:

```
┌─────────────────────────────────────────────────┐
│             Hybrid Architecture Example           │
│                                                   │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Cloudflare       │  │  Python Backend       │  │
│  │  Workers (TS)     │  │  (FastAPI)            │  │
│  │                    │  │                       │  │
│  │  • API Gateway     │  │  • Complex RAG        │  │
│  │  • SSE Streaming   │  │    Pipeline           │  │
│  │  • Rate Limiting   │  │  • Embedding          │  │
│  │  • Static Assets   │  │    generation         │  │
│  │  • Session Mgmt    │  │  • Fine-tuned models  │  │
│  │                    │  │  • Batch processing   │  │
│  │                    │  │  • Eval pipeline      │  │
│  └────────┬───────────┘  └───────────┬───────────┘  │
│           │              ▲            │              │
│           └──── HTTP ────┘            │              │
│                                       │              │
│  ┌────────────────────────────────────▼───────────┐  │
│  │            Shared Infrastructure                │  │
│  │  PostgreSQL + pgvector  |  Redis  |  Langfuse  │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

TypeScript handles the user-facing "edge layer" — low latency, streaming, session management. Python handles the "core AI layer" — RAG pipeline, embeddings, model inference. The two communicate via HTTP or message queues.

**Tech Stack Selection Principles Summary**:

1. **Existing infrastructure → follow it** — don't migrate just to use new technology
2. **Starting from scratch → match team skills** — use whatever your engineers are comfortable with
3. **Need fine-tuning → Python is required** — no exceptions
4. **Pure RAG scenario → either works** — pick whichever is easiest to deploy
5. **Global low latency → Edge runtime (Cloudflare Workers)** has a natural advantage

---

## Summary

A full architecture overview of a production-grade chatbot:

```
                        User
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

Every layer's design decisions affect the final user experience. Don't try to build all layers at once — first nail the core State Management + Streaming so users can have a smooth conversation, then gradually add Guardrails, Memory, and Observability.

Remember: **Users don't care what model you use. They care about: Is it fast? Does it remember me? Is it safe?** None of these three things can be solved by API calls alone.

## References

- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al. (2024), comprehensive survey of RAG system design covering memory and knowledge integration patterns
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al. (2023), the reasoning-and-acting interleaved agent framework, theoretical foundation for chatbot tool calling
- [Langfuse Documentation — Tracing](https://langfuse.com/docs/tracing) — Langfuse official documentation, LLM observability and trace tracking implementation guide
- [OpenAI Platform — Streaming](https://platform.openai.com/docs/api-reference/streaming) — OpenAI official SSE Streaming API reference
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic engineering blog, practical advice on conversation state and context management
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain tech blog, the four strategies of Write/Select/Compress/Isolate
- [Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/abs/2305.10601) — Yao et al. (2023, NeurIPS), multi-step reasoning framework applicable to complex conversation flow design
