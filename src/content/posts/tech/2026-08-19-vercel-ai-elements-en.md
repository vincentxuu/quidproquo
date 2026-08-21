---
title: "AI Elements: Vercel's ChatGPT-Style Interface as Copy-In shadcn Blocks"
date: 2026-08-19
category: tech
type: deep-dive
tags: [ai-elements, ai-sdk, shadcn-ui, react, ui, vercel]
lang: en
tldr: "AI Elements is Vercel's React component library for the AI SDK ecosystem — the registry currently holds 48 components covering Conversation, Reasoning, Sources, Tool, and the rest of the AI-interface vocabulary. It follows the shadcn model: npx ai-elements@latest copies the source into your project, fully editable, mapped one-to-one onto useChat's message parts."
description: "An introduction to Vercel AI Elements: its role as the AI SDK's official UI layer, the shadcn copy-in source model, the component catalog, how it maps onto useChat message parts, and the community Vue / Svelte ports."
series:
  name: "Technology Choices in the AI Era"
  order: 2
draft: false
---

🌏 [中文版](/posts/tech/2026-08-19-vercel-ai-elements)

Anyone who has built an AI chat interface knows the hard part isn't the input box — it's everything around it: Markdown that renders while streaming, collapsible reasoning traces, expandable source citations, tool calls with parameters and results, version switching after a regeneration. AI Elements is Vercel's React component library for exactly this: the standard equipment of a ChatGPT-style interface, shipped as ready-made components — and delivered shadcn-style, with the source copied into your project instead of installed as a black-box dependency.

## Positioning: the AI SDK's official UI layer

AI Elements launched in August 2025 (the `vercel/ai-elements` repo was created on 2025-08-15 and sits at roughly 2,300 stars as of August 2026). The official description: "a component library and custom registry built on top of shadcn/ui to help you build AI-native applications faster." It is not another general-purpose UI kit — it plugs directly into the AI SDK's `useChat` hook. AI SDK v5 splits a message into parts (`text`, `reasoning`, `source-url`, `tool-*`, and so on), and AI Elements components are shaped to that structure. Rendering is a switch over `part.type`, each part handed to its component:

```tsx
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";

const Example = () => {
  const { messages } = useChat();

  return messages.map(({ role, parts }, index) => (
    <Message from={role} key={index}>
      <MessageContent>
        {parts.map((part, i) =>
          part.type === "text" ? (
            <MessageResponse key={i}>{part.text}</MessageResponse>
          ) : null
        )}
      </MessageContent>
    </Message>
  ));
};
```

That is the real difference from hand-rolling or assembling a generic component kit: the data-structure correspondence is designed in, so there is no adapter layer to write.

## The shadcn model: you own this code

Like [shadcn/ui](/posts/tech/2026-03-27-shadcn-ui-component-library-en), AI Elements publishes no npm package to import. The CLI copies component `.tsx` source into your project's `@/components/ai-elements/` directory:

```bash
# Install everything
npx ai-elements@latest

# Install a specific component
npx ai-elements@latest add message

# Or via the shadcn CLI registry
npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/all.json
```

Once copied, the code is yours: restyle it, rewrite it, delete half of it — no upstream release will ever clobber your changes. The cost is the usual shadcn trade: upstream updates are your job to pull and merge. The official README lists the prerequisites as Next.js + AI SDK + shadcn/ui + Tailwind (CSS Variables mode); in practice the community also uses it in non-Next.js React projects, but if your stack isn't on the React + Tailwind line at all, this library is simply out.

## The component catalog: a vocabulary for AI interfaces

The official registry currently holds 48 components, which the docs organize into five groups — Chatbot / Code / Voice / Workflow / Utilities (voice pipelines, workflow visualization, and terminal output all have components). Grouping the most commonly used ones by purpose:

- **Conversation skeleton**: `Conversation` (auto-scroll with a scroll-to-bottom button), `Message` and its child `MessageResponse` (streaming-friendly Markdown rendering; the early standalone `Response` component has been folded into message)
- **Input**: `PromptInput` (file attachments and a model selector ship as dedicated sub-components; screenshot buttons and web-search toggles are assembled from the generic `PromptInputButton`, which is exactly what the official examples do), `Suggestion` (prompt suggestions)
- **AI behavior made visible**: `Reasoning` (collapsible thinking trace with duration), `Tool` (tool-call parameters and results), `Task` (task progress), `Sources` and `InlineCitation` (citations)
- **Content**: `CodeBlock` (syntax highlighting), `Image` (AI-generated images), `WebPreview` (embedded page preview), the `MessageBranch` family (switching between versions of one message — the ‹ 2/3 › selector you know from ChatGPT regenerations; the early standalone `Branch` component was reorganized into message sub-components)

The demo on the [elements.ai-sdk.dev](https://elements.ai-sdk.dev/) homepage is built from these components, with its source displayed right on the page. One more telling detail: the repo ships a `SKILL.md` written for AI coding agents, so an agent can install and use the components correctly — Vercel clearly expects much of this assembly to be done by agents, not people.

## Not on React?

Officially React-only, but the community maintains two unofficial ports: **AI Elements Vue** (`vuepont/ai-elements-vue`, built on shadcn-vue) and **Svelte AI Elements** (`sikandarjodd/ai-elements`, built on shadcn-svelte). Both follow the same copy-in model with mostly matching component names. They are community-maintained: sync speed and coverage against upstream are yours to verify — never assume everything in the official version exists in a port.

## Overall

The trade AI Elements offers is clear: it turns "build a decent AI chat interface" from hand-crafting streaming renderers, reasoning folds, and citation lists into assembling ready-made, fully customizable blocks — provided you accept the React + Tailwind + shadcn stack and the shadcn maintenance model of owning the code and owning its updates. If you're building on the AI SDK, this is close to a default choice; if all you need is an embedded support widget, it's overkill; and if your frontend is Vue, check whether the community port covers your needs before spinning up a separate React line for it.

## References

- [AI Elements](https://elements.ai-sdk.dev/)
- [AI Elements docs (AI SDK)](https://ai-sdk.dev/elements/overview)
- [vercel/ai-elements (GitHub)](https://github.com/vercel/ai-elements)
- [AI SDK: useChat and message parts](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [shadcn/ui](https://ui.shadcn.com/)
- [AI Elements Vue (community port)](https://github.com/vuepont/ai-elements-vue)
- [Svelte AI Elements (community port)](https://github.com/sikandarjodd/ai-elements)
- On this site: [shadcn/ui: Not a Package — It's Copy-Pasted Component Source Code](/posts/tech/2026-03-27-shadcn-ui-component-library-en)
