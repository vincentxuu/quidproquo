---
title: "How to Use Cloudflare Agent Memory: Keep Agent Memory Separate from RAG Documents"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, agent-memory, agents, rag, memory, retrieval]
lang: en
tldr: "Agent Memory is a Cloudflare private beta service for letting agents remember users, teams, projects, and task context across conversations. It fits facts, events, instructions, and tasks; RAG documents, product data, files, and audit logs should still live in AI Search, Vectorize, D1, or R2."
description: "A practical guide to Cloudflare Agent Memory: namespaces, profiles, ingest, remember, recall, list, delete, memory types, deduplication, and the boundary with RAG."
draft: true
series:
  name: "Cloudflare AI Stack"
  order: 8
---

> 🌏 [中文版](/posts/ai/2026-08-30-cloudflare-agent-memory)

Any serious agent eventually runs into the question of what it should remember. User preferences, team rules, project state, support history, past decisions, and unfinished follow-ups should not be stuffed into every prompt. They also should not all be mixed into document retrieval.

[Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/) targets this durable memory layer. It lets agents remember scoped context across conversations, with automatic extraction, storage, search, and summarization. The official docs also mark Agent Memory as private beta, so this post treats it as an architecture primitive and direction, not as a fully available service every product can rely on today.

In the Cloudflare AI Stack, Agent Memory comes after Agents. Agents solve durable runtime. Agent Memory answers which knowledge should persist beyond the runtime, how it is recalled, how it is deleted, and how it stays separate from RAG.

## Memory and RAG Are Different

Memory and RAG are easy to mix up.

| Question | Use | Examples |
|---|---|---|
| User preferences, team rules, project habits | Agent Memory | "This user prefers Traditional Chinese", "the team runs pnpm verify before deploy" |
| Documents, knowledge bases, manuals, policies | AI Search / Vectorize | API docs, FAQ, legal files, internal wiki |
| Conversation transcripts, artifacts, attachments | R2 / D1 | Full chats, PDFs, screenshots, tool outputs |
| Current task state | Agent state / SQLite | Workflow step, pending approval, tool queue |

RAG asks: what information should I retrieve from a document set? Memory asks: what context about this user, team, agent, tenant, or object should persist? Both involve retrieval, but the data source and governance model differ.

If every document chunk becomes memory, memory turns into an unmanaged document store. If user preferences hide inside RAG documents, the agent has to hope the right document is retrieved every time.

## Namespaces and Profiles: Decide Isolation First

Agent Memory uses namespaces and profiles. A namespace can separate applications, environments, or memory layers. A profile is the memory subject: a user, agent, tenant, team, or even a product object.

I would decide profile boundaries with these questions:

- Does this memory belong to one person or a team?
- Should staging and production be separate?
- Should one user's preferences carry across workspaces?
- Should agent operating rules and user preferences be separate profiles?
- When a GDPR or deletion request arrives, which profile or session should be deleted?

These questions should come before data grows. Memory is useful only when it remembers the right thing inside the right boundary.

The Workers binding looks like this:

```jsonc
{
  "agent_memory": [
    {
      "binding": "MEMORY",
      "namespace": "prod-assistant"
    }
  ]
}
```

Then get a profile in Worker code:

```ts
const profile = await env.MEMORY.getProfile(`tenant:${tenantId}:user:${userId}`);
```

The first `getProfile()` for a new profile creates it, and the official docs note that this first call may take longer.

## Four Memory Types

Agent Memory classifies extracted memories into four types:

| Type | Meaning | Examples |
|---|---|---|
| Facts | Stable knowledge that can be superseded | Identity, preferences, tool settings, project goals |
| Events | Completed actions anchored in time | Deploys, decisions, milestones, observations |
| Instructions | Reusable procedures and conventions | Writing style, release checklist, review workflow |
| Tasks | Short-lived session-scoped work | Current investigation, next step, follow-up |

Facts and Instructions support supersession: a newer memory with the same topic key can replace an older one. The old version is preserved, while recall surfaces the latest. Events accumulate and do not conflict. Tasks are deprioritized after the session ends.

That classification is useful because it prevents preference updates and historical events from being treated the same way. Preferences change. Events happened. Instructions should be reusable. Tasks usually expire.

## ingest(): Extract Memory from Conversations

`ingest()` processes a conversation through extraction, classification, deduplication, and storage:

```ts
await profile.ingest(
  [
    {
      role: "user",
      content: "For future technical posts, use Traditional Chinese and avoid translated phrasing.",
      timestamp: new Date(),
    },
    {
      role: "assistant",
      content: "Understood. I will write in natural Traditional Chinese technical prose.",
      timestamp: new Date(),
    },
  ],
  { sessionId: "session-2026-08-30" },
);
```

The Workers API docs list several limits: message content is capped at 32 KB, one `ingest()` call can include up to 500 messages, and `sessionId` is capped at 64 characters. `ingest()` is idempotent, so re-ingesting the same conversation does not create duplicate memories.

I would run `ingest()` at meaningful boundaries:

- After a chat session ends.
- When a user says "always do this from now on."
- When an agent completes an important workflow.
- After a support or email thread has been handled.

Do not ingest every token in real time. Memory extraction is work; choose boundaries that carry meaning.

## remember(): Store What the App Already Knows

If the app already knows what should be remembered, `remember()` is more direct than passing a conversation:

```ts
await profile.remember({
  content: "User prefers Traditional Chinese technical writing with concrete Taiwan wording.",
  sessionId: "settings-update-2026-08-30",
});
```

If a user chooses a language preference in settings, a team admin creates a release rule, or a project establishes a convention, there is no need to make a model infer it from conversation. Store it explicitly and let Agent Memory classify and summarize it.

## recall(): Retrieve Memory Instead of Guessing

When an agent needs cross-conversation context, call `recall()`:

```ts
const recalled = await profile.recall("How should I write technical posts for this user?", {
  thinkingLevel: "medium",
  responseLength: "short",
  referenceDate: new Date(),
});

if (recalled.count > 0) {
  systemContext.push(recalled.answer);
}
```

The official docs say `recall()` analyzes the query, searches keyword indexes, topic keys, semantic vector indexes, and raw conversation messages in parallel, then ranks results and returns a grounded answer. If nothing matches, it returns an empty answer instead of inventing one.

That behavior matters. Memory retrieval must allow "I do not know." If there is no memory, the agent should ask the user or use a default, not pretend to remember.

## list / get / delete: Governance Matters More than Remembering

Agent Memory also provides `list()`, `get()`, `delete()`, `deleteSession()`, `deleteProfile()`, and `getSummary()`. These APIs matter because memory crosses sessions:

- Users need to see what the system remembers.
- Users need to delete a specific memory.
- A session may need to be removed.
- A profile may need tenant-level or account-level deletion.
- Support or admins may need to inspect a memory summary.

I would not enable large-scale memory without a UI or admin path. A system that can remember data must also explain, list, correct, and delete it.

## Layering in an AI App

A Cloudflare AI app can split responsibilities like this:

1. Agents: durable sessions, WebSockets, and tool loops.
2. Agent Memory: user/team/project facts, events, instructions, and tasks.
3. AI Search: managed RAG over document sources.
4. Vectorize: custom retrieval with chunking, embeddings, and metadata filters.
5. D1: product data, conversation indexes, and billing events.
6. R2: full transcripts, attachments, artifacts, and raw email.
7. Analytics Engine: recall hits, tool latency, and tenant usage.

Before responding, the agent can assemble context from:

- current prompt
- current agent state
- recalled memory
- retrieved documents
- product database records
- tool results

Each layer has a different governance model. They should not all be called memory.

## When I Would Wait

I would wait on Agent Memory when:

- The product does not have private beta access.
- The app only needs fixed-document retrieval, where AI Search or Vectorize is enough.
- The content is sensitive, but deletion, audit, and user-visible controls are not ready.
- The team has not decided namespace and profile isolation.
- The agent only performs single-turn tasks and does not need cross-conversation context.

The direction is valuable: Cloudflare is turning extraction, storage, search, and summarization into a managed memory layer. But remembering is not the goal by itself. Good memory design answers: whose memory, what should be remembered, how long it lives, who can see it, who can delete it, and when recall should happen.

## References

- [Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/)
- [How Agent Memory works](https://developers.cloudflare.com/agent-memory/concepts/how-agent-memory-works/)
- [Agent Memory Workers API](https://developers.cloudflare.com/agent-memory/api/workers-api/)
- [Cloudflare Agents](https://developers.cloudflare.com/agents/)
- [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
