---
title: "Gemini, Claude, ChatGPT, Grok: Which to Pick for Long Video, Code, Live X Search, and App Platforms"
date: 2026-10-25
type: deep-dive
category: ai
tags: [llm, gemini, claude, openai, grok, multimodal, coding-agent]
lang: en
tldr: "A two-hour lecture is about 720,000 tokens, which Gemini's API accepts and Claude's and ChatGPT's API docs don't list video input for. On code, Claude and GPT are 0.8 points apart on the Vals board, so compare time and cost instead. Grok for X sentiment and auto-fill checkout, ChatGPT for ready-made apps and voice."
description: "A task-by-task comparison of Gemini, Claude, ChatGPT, and Grok: long-video understanding, code, live X search and delegated checkout, app platform and voice, each with the official source and one test you can run tonight."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-25-gemini-claude-chatgpt-grok-by-task)

Gemini, Claude, ChatGPT, and Grok are the four assistants most often compared side by side. The usual story gives each one territory the others can't touch: Gemini for long video, Claude for code, Grok for X, ChatGPT for everything. Most of those claims have official documentation behind them, but "can't touch" is too strong in a few places.

This post is organized by task: whether you're holding a course video, a repo, a stream of X posts, or a shopping cart, which assistant to open first. Writing quality and general Q&A have no public benchmark to check against, so they're out of scope. The table below is the conclusion; each section after it has the source and one test you can run tonight.

| Your task | Open first | Basis | Don't assume |
|---|---|---|---|
| A 1–3 hour video or lecture, notes with timestamps | Gemini | API docs: audio and frames processed together, `MM:SS` timestamps | Claude's and ChatGPT's API docs don't list video input |
| Fix a bug, refactor a repo | Run Claude and ChatGPT (Codex) both | Vals AI board: 97.00% vs 96.20% | Scores are close; time and cost are not |
| X sentiment, what an account said lately | Grok | `x_search` tool: keyword, semantic, user search | Covers X only |
| Let an AI fill in logins and a card at checkout | Grok Bot | Vault, added October 23 | Just launched; use a card with a spending cap |
| Hook into existing apps, build voice support | ChatGPT | Apps SDK and Realtime API | In-chat checkout has been scaled back to merchants' own flows or apps |

## Long video: Gemini reads audio and frames together

The [Gemini API video docs](https://ai.google.dev/gemini-api/docs/video-understanding) are specific. The model processes audio and frames together, at roughly 100 tokens per second of video at default resolution. A two-hour lecture comes to around 720,000 tokens. The docs say a model with a 1M-token context window handles up to 3 hours at default resolution, and fewer at high resolution.

Public YouTube URLs can be passed directly with no download. To ask about a moment, write it as `MM:SS` in the prompt. The docs recommend putting the text prompt after the video:

```python
from google import genai

client = genai.Client()
interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input=[
        {"type": "video", "uri": "https://www.youtube.com/watch?v=<video ID>"},
        {
            "type": "text",
            "text": "Turn this into lecture notes. For each topic add an MM:SS timestamp and explain what the chart on the slide shows.",
        },
    ],
)
print(interaction.output_text)
```

For videos longer than 5 to 10 minutes, the docs recommend adding `"processing": "agentic"` to the video part. In this [mode](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/) the model reads the transcript first and loads only the frames it needs, using up to 88% fewer tokens with slightly better accuracy. Short clips can get slower and cost more tokens. Only some newer models support it; the list is in the docs. The mode takes longer to run, so the docs suggest also setting `background=True`. The default of one frame per second misses fast motion; use a custom `fps` when you need frame-level inspection.

On the Claude and ChatGPT side, [Claude's Vision docs](https://platform.claude.com/docs/en/build-with-claude/vision) list JPEG, PNG, GIF, and WebP, and for GIF animations only the first frame is used. The Files API in its [features overview](https://platform.claude.com/docs/en/build-with-claude/overview) is likewise listed as supporting PDFs, images, and text files. [OpenAI's models page](https://developers.openai.com/api/docs/models) says the latest models take text and image input and produce text output. Someone [asked openai-node to add video input](https://github.com/openai/openai-node/issues/1778), and an OpenAI contributor replied in August 2026 that the current approach is to extract frames and send them as images, handling audio separately.

So the same lecture needs preprocessing on both: pull a slide screenshot every few seconds and send it alongside the transcript. This is about the API; file upload and voice features inside each app are outside the comparison.

Still, "long video is Gemini-only" is only half right. The long-video benchmark [Video-MME](https://github.com/MME-Benchmarks/Video-MME) works by sampling frames and feeding them to the model, and OpenAI's own launch posts report video results: [GPT-4.1](https://openai.com/index/gpt-4-1/) publishes a Video-MME long-video score, while the appendix of [GPT-5](https://openai.com/index/introducing-gpt-5-for-developers/) lists VideoMME and VideoMMMU, the latter also evaluated by sampling frames. Gemini's difference is the workflow, and the two paths compare as follows.

```diagram
title: Processing the same lecture video, side by side
desc: Gemini takes the video file with its audio in one API call; Claude and ChatGPT need you to extract frames and a transcript first, then send images plus text to the model.
caption: Simplified. Green boxes are steps you do yourself first.
---
<svg viewBox="0 0 440 432">
  <rect class="dg-band" x="8" y="8" width="204" height="416" rx="6"/>
  <rect class="dg-band" x="228" y="8" width="204" height="416" rx="6"/>
  <text class="dg-heading" x="20" y="32" dominant-baseline="central">Gemini</text>
  <text class="dg-heading" x="240" y="32" dominant-baseline="central">Claude / ChatGPT</text>

  <path class="dg-line" d="M110 104V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M110 248V356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M256 104V152Q256 160 264 160" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M256 104V216Q256 224 264 224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 160H400Q408 160 408 168V276" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M332 248V276" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M330 328V356" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="122" y="304" dominant-baseline="central">no prep steps</text>

  <rect class="dg-box" x="20" y="56" width="180" height="48" rx="6"/>
  <text class="dg-label" x="110" y="74" text-anchor="middle" dominant-baseline="central">Video</text>
  <text class="dg-sub" x="110" y="92" text-anchor="middle" dominant-baseline="central">with audio</text>
  <rect class="dg-box" x="20" y="136" width="180" height="112" rx="6"/>
  <text class="dg-label" x="110" y="172" text-anchor="middle" dominant-baseline="central">Gemini API</text>
  <text class="dg-sub" x="110" y="196" text-anchor="middle" dominant-baseline="central">whole file</text>
  <text class="dg-sub" x="110" y="214" text-anchor="middle" dominant-baseline="central">in one call</text>
  <rect class="dg-box" x="20" y="360" width="180" height="48" rx="6"/>
  <text class="dg-label" x="110" y="378" text-anchor="middle" dominant-baseline="central">Notes</text>
  <text class="dg-sub" x="110" y="396" text-anchor="middle" dominant-baseline="central">with timestamps</text>

  <rect class="dg-box" x="240" y="56" width="180" height="48" rx="6"/>
  <text class="dg-label" x="330" y="74" text-anchor="middle" dominant-baseline="central">Video</text>
  <text class="dg-sub" x="330" y="92" text-anchor="middle" dominant-baseline="central">with audio</text>
  <rect class="dg-box dg-box--accent" x="268" y="136" width="128" height="48" rx="6"/>
  <text class="dg-label" x="332" y="154" text-anchor="middle" dominant-baseline="central">Frames</text>
  <text class="dg-sub" x="332" y="172" text-anchor="middle" dominant-baseline="central">screenshots</text>
  <rect class="dg-box dg-box--accent" x="268" y="200" width="128" height="48" rx="6"/>
  <text class="dg-label" x="332" y="218" text-anchor="middle" dominant-baseline="central">Transcript</text>
  <text class="dg-sub" x="332" y="236" text-anchor="middle" dominant-baseline="central">audio to text</text>
  <rect class="dg-box" x="240" y="280" width="180" height="48" rx="6"/>
  <text class="dg-label" x="330" y="298" text-anchor="middle" dominant-baseline="central">Model</text>
  <text class="dg-sub" x="330" y="316" text-anchor="middle" dominant-baseline="central">reads images + text</text>
  <rect class="dg-box" x="240" y="360" width="180" height="48" rx="6"/>
  <text class="dg-label" x="330" y="378" text-anchor="middle" dominant-baseline="central">Notes</text>
  <text class="dg-sub" x="330" y="396" text-anchor="middle" dominant-baseline="central">with timestamps</text>
</svg>
```

For how the leaderboards contradict each other, see the [multimodal landscape post](/posts/ai/2026-08-18-multimodal-models-2026-landscape-en).

**A test for tonight:** pick a 2-hour course you actually need, run the code above, then check three timestamps against the original video to see whether the notes line up with the slides.

## Code: Claude and ChatGPT differ in time and cost

[Vals AI's SWE-bench Verified board](https://www.vals.ai/benchmarks/swebench) runs most models through the same minimal harness (mini-swe-agent, with bash as its only tool), with a few rows using each vendor's own CLI. Vals has archived the board because scores saturated and it no longer runs new models. The table takes the highest-scoring model of each of the four.

| Model | SWE-bench Verified | Avg. time per task | Cost per task |
|---|---|---|---|
| Claude Opus 5 | 97.00% | about 9 min 37 s | $1.29 |
| GPT-5.6 Sol | 96.20% | about 3 min 2 s | $1.15 |
| Grok 4.6 | 95.60% | about 10 min 4 s | $0.78 |
| Gemini 3.7 Flash | 80.80% | about 5 min 50 s | $1.44 |

Claude and GPT are 0.8 points apart, while the time differs by about three times, so I'd weigh those two columns above the score. Grok comes fourth, so on code it is not a weak player; Gemini appears only as the Flash line and an earlier Pro preview, topping out around eighty percent.

The board stops in early September, so newer models from Claude, GPT, Gemini, and Grok are not on it, for example Gemini 4 Argon and Grok 4.7, and it can't judge them.

Scores are also tied to the harness. Claude Opus 4.8 drops by nearly 3 points under Claude Code compared with mini-swe-agent. A leaderboard tells you roughly what tier a model is in; it can't predict how it will do inside [Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code-en) or [Codex](/posts/ai/2026-04-02-agent-cli-openai-codex-en).

**A test for tonight:** take the last three issues you fixed in your own repo, check out the commit before each fix, paste the issue text unchanged into Claude Code and Codex, and record three things: do the tests pass, how many files changed, how long it took. After three issues you'll know which one fits your codebase.

## Live X search and delegation: Grok

xAI's API makes X search a standalone tool, [`x_search`](https://docs.x.ai/developers/tools/x-search): keyword search, semantic search, user search, and fetching a whole thread. `allowed_x_handles` restricts results to specific accounts, `from_date` and `to_date` set the date range, and you can turn on understanding of images and videos inside posts. Billing is $5 per thousand posts fetched plus token costs, so pulling 200 posts costs about $1 in post fees.

**A test for tonight:** write the topic you want to track as one sentence, add a date range covering the last week, and run it once to see whether the cited posts come from the people you meant to follow.

The delegation side is a different product. [Grok Bot](https://x.ai/changelog/bot) works inside Slack and email, has its own computer, and can run scheduled tasks (routines).

Three items in the [changelog](https://x.ai/changelog/bot) matter for delegated checkout:

- Vault (October 23): save logins, cards, and contact info in Settings and have them filled in to sign in or check out.
- Shop Pay (October 22): Shop checkout where a store supports it, a one-time Shop card elsewhere.
- Approval cards: you pick the payment method on a card, irreversible or sensitive actions are flagged, and after you deny one the Bot stops until you send another message.

Vault needs Grok Bot 0.75.2 or later.

**A test for tonight:** save one card with a spending cap, have the Bot buy something cheap, and watch the approval cards the whole way before deciding how much to hand over. Whether Vault and Shop Pay are open to Taiwan accounts is something to confirm in your own account.

This Vault is not [Grok Enterprise's Vault](https://x.ai/news/grok-business). That one is an enterprise add-on with a dedicated data plane and customer-managed encryption keys (CMEK), and has nothing to do with filling in checkout details.

On iPhone, a [Grok shortcut on RoutineHub](https://routinehub.co/shortcut/21828/) describes two routes. The free Grok app's "Ask Grok" action is text-only, and the author notes it is less reliable; an xAI API key unlocks chat storage and image and video generation. If you want to automate with Shortcuts, I'd take the API key route.

## Platform and voice: ChatGPT

OpenAI announced in February 2026 that ChatGPT had reached [900 million weekly active users](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/).

That scale is the Apps SDK's pitch: the [launch post](https://openai.com/index/introducing-apps-in-chatgpt/) from October 2025 recruited developers with "reach over 800 million ChatGPT users."

The Apps SDK is built on MCP and adds one layer on top: developers define the interactive interface an app shows in the conversation. Connecting tools doesn't require ChatGPT. [MCP](/posts/ai/2026-03-22-mcp-model-context-protocol-en) is an open standard, and the same MCP server works with other clients. ChatGPT adds two things: the in-chat interface, and its users.

For voice, the [Realtime API](https://openai.com/index/introducing-gpt-realtime/) became generally available in August 2025. It handles audio directly in a single model instead of chaining speech-to-text and text-to-speech, and supports remote MCP servers, image input, and SIP phone calls. Image input works by placing a picture into the conversation, not by streaming live video, and your app decides what the model sees and when.

The shopping route has changed once. [Instant Checkout](https://openai.com/index/buy-it-in-chatgpt/) launched in September 2025, letting US users buy single items from Etsy sellers inside the chat, built on the Agentic Commerce Protocol co-developed with Stripe.

[CNBC reported in March 2026](https://www.cnbc.com/2026/03/24/openai-revamps-shopping-experience-in-chatgpt-after-instant-checkout.html) that OpenAI has shifted its focus to product discovery and left checkout to merchants' own flows: merchants supply product feeds, build ChatGPT apps for deeper integration, and Shopify merchants complete purchases in an in-app browser. OpenAI said the initial version of Instant Checkout did not offer the flexibility it wanted.

Compare that with Grok Bot: ChatGPT now leaves checkout to the merchant, while Grok Bot fills in login and payment details, using Shop checkout where a store supports it.

**A test for tonight:** to decide whether a ChatGPT app is worth building, check whether your service already has an MCP server. If it does, the Apps SDK is just an interface layer on top; if not, build the MCP server first, since other clients can use it too.

## Putting it together

Each of the four has one line that holds up clearly: Gemini's whole-video workflow, the Claude-versus-GPT tug-of-war on the code board, Grok's X search and auto-fill checkout, ChatGPT's app platform and voice. None wins everything, so the practical approach is routing by task, which is also where the multimodal post lands.

The code scores here come from a board archived in early September, and the other features and versions are a snapshot from 2026-10-25; features like Vault and shopping can change within a month. Before handing a task to any one of them, run the small test above. It beats trusting any leaderboard.

## References

- [Video understanding - Gemini API](https://ai.google.dev/gemini-api/docs/video-understanding)
- [Introducing agentic video understanding with Gemini - Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/)
- [Video-MME - GitHub](https://github.com/MME-Benchmarks/Video-MME)
- [Vision - Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Features overview - Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/overview)
- [Feature Request: Native video file input support in Responses API - openai-node](https://github.com/openai/openai-node/issues/1778)
- [Introducing GPT-4.1 in the API - OpenAI](https://openai.com/index/gpt-4-1/)
- [Introducing GPT-5 for developers - OpenAI](https://openai.com/index/introducing-gpt-5-for-developers/)
- [Models - OpenAI API](https://developers.openai.com/api/docs/models)
- [SWE-bench Verified Leaderboard and Methodology - Vals AI](https://www.vals.ai/benchmarks/swebench)
- [X Search - xAI Docs](https://docs.x.ai/developers/tools/x-search)
- [Grok Bot Changelog - xAI](https://x.ai/changelog/bot)
- [Introducing Grok Business and Grok Enterprise - xAI](https://x.ai/news/grok-business)
- [Grok AI Chat Shortcut - RoutineHub](https://routinehub.co/shortcut/21828/)
- [ChatGPT reaches 900M weekly active users - TechCrunch](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/)
- [Introducing apps in ChatGPT and the new Apps SDK - OpenAI](https://openai.com/index/introducing-apps-in-chatgpt/)
- [Introducing gpt-realtime and Realtime API updates - OpenAI](https://openai.com/index/introducing-gpt-realtime/)
- [Buy it in ChatGPT: Instant Checkout and the Agentic Commerce Protocol - OpenAI](https://openai.com/index/buy-it-in-chatgpt/)
- [OpenAI revamps shopping experience in ChatGPT after struggling with Instant Checkout offering - CNBC](https://www.cnbc.com/2026/03/24/openai-revamps-shopping-experience-in-chatgpt-after-instant-checkout.html)
