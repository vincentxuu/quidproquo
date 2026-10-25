---
title: "Gemini, Claude, ChatGPT, Grok: Which to Pick for Long Video, Code, Live X Search, and App Platforms"
date: 2026-10-25
type: deep-dive
category: ai
tags: [llm, gemini, claude, chatgpt, grok, multimodal, coding-agent]
lang: en
tldr: "A two-hour lecture is about 720,000 tokens, which Gemini's API accepts and Claude's and ChatGPT's docs don't list video input for. On code, Claude and GPT are 0.8 points apart, so compare time and cost instead. Grok for X sentiment and auto-fill checkout, ChatGPT for ready-made apps and voice."
description: "A task-by-task comparison of Gemini, Claude, ChatGPT, and Grok: long-video understanding, code, live X search and delegated checkout, app platform and voice, each with the official source and one test you can run tonight."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-25-gemini-claude-chatgpt-grok-by-task)

Gemini, Claude, ChatGPT, and Grok are the four assistants most often compared side by side. The usual story gives each one territory the others can't touch: Gemini for long video, Claude for code, Grok for X, ChatGPT for everything. Most of those claims have official documentation behind them, but "can't touch" is too strong in a few places.

This post is organized by task: whether you're holding a course video, a repo, a stream of X posts, or a shopping cart, which assistant to open first. Writing quality and general Q&A have no public benchmark to check against, so they're out of scope. The table below is the conclusion; each section after it has the source and one test you can run tonight.

| Your task | Open first | Basis | Don't assume |
|---|---|---|---|
| A 1–3 hour video or lecture, notes with timestamps | Gemini | API docs: audio and frames processed together, `MM:SS` timestamps | Claude's and ChatGPT's docs don't list video input |
| Fix a bug, refactor a repo | Run Claude and ChatGPT (Codex) both | Vals AI board: 97.00% vs 96.20% | Scores are close; time and cost are not |
| X sentiment, what an account said lately | Grok | `x_search` tool: keyword, semantic, user search | Covers X only |
| Let an AI fill in logins and a card at checkout | Grok Bot | Vault, added 2026-10-23 | Two days old; use a card with a spending cap |
| Hook into existing apps, build voice support | ChatGPT | Apps SDK and Realtime API | In-chat shopping has moved to retailer apps |

## Long video: Gemini reads audio and frames together

The [Gemini API video docs](https://ai.google.dev/gemini-api/docs/video-understanding) are specific. The model processes audio and frames together, at roughly 100 tokens per second of video at default resolution. A two-hour lecture comes to around 720,000 tokens. The docs say a model with a 1M-token context window handles up to 3 hours at default resolution, and fewer at high resolution.

Public YouTube URLs can be passed directly with no download. To ask about a moment, write it as `MM:SS` in the prompt. The docs place the text prompt after the video:

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

On the Claude and ChatGPT side, [Claude's Vision docs](https://platform.claude.com/docs/en/build-with-claude/vision) list JPEG, PNG, GIF, and WebP, and for GIF animations only the first frame is used. [OpenAI's models page](https://developers.openai.com/api/docs/models) says the latest models take text and image input and produce text output. Neither lists video input, so the same lecture needs preprocessing: pull a slide screenshot every few seconds and send it alongside the transcript.

So "long video is Gemini-only" is half right. The long-video benchmark [Video-MME](https://github.com/MME-Benchmarks/Video-MME) works by sampling frames and feeding them to the model, and OpenAI used it as a scorecard in the GPT-4.1 and GPT-5 launch posts. Gemini's difference is the workflow: the whole video file, audio included, goes into one API call, while the other two need you to extract frames and a transcript first.

For how the leaderboards contradict each other, see the [multimodal landscape post](/posts/ai/2026-08-18-multimodal-models-2026-landscape-en).

**A test for tonight:** pick a 2-hour course you actually need, run the code above, then check three timestamps against the original video to see whether the notes line up with the slides.

## Code: Claude and ChatGPT differ in time and cost

[Vals AI's SWE-bench Verified board](https://www.vals.ai/benchmarks/swebench) runs every model through the same minimal harness (mini-swe-agent, with bash as its only tool). The Claude and GPT flagships score very close together, and Vals has archived the board because scores saturated and it no longer runs new models.

| Model | SWE-bench Verified | Avg. time per task | Cost per task |
|---|---|---|---|
| Claude Opus 5 | 97.00% | about 9 min 37 s | $1.29 |
| GPT-5.6 Sol | 96.20% | about 3 min 2 s | $1.15 |

The gap is 0.8 points, while the time differs by about three times. Those two columns matter more to a decision than the score.

Fourth on the board is Grok 4.6, while Gemini 3.7 Flash lands at 80.80%. On code Grok is not a weak player, and Gemini's Flash line trails.

Scores are also tied to the harness. Claude Opus 4.8 drops by nearly 3 points under Claude Code compared with mini-swe-agent. A leaderboard tells you roughly what tier a model is in; it can't predict how it will do inside [Claude Code](/posts/ai/2026-04-02-agent-cli-claude-code-en) or [Codex](/posts/ai/2026-04-02-agent-cli-openai-codex-en).

**A test for tonight:** take the last three issues you fixed in your own repo, check out the commit before each fix, paste the issue text unchanged into Claude Code and Codex, and record three things: do the tests pass, how many files changed, how long it took. After three issues you'll know which one fits your codebase.

## Live X search and delegation: Grok

xAI's API makes X search a standalone tool, [`x_search`](https://docs.x.ai/developers/tools/x-search): keyword search, semantic search, user search, and fetching a whole thread. `allowed_x_handles` restricts results to specific accounts, `from_date` and `to_date` set the date range, and you can turn on understanding of images and videos inside posts. Billing is $5 per thousand posts fetched plus token costs, so pulling 200 posts costs about $1 in post fees.

**A test for tonight:** write the topic you want to track as one sentence, add a date range covering the last week, and run it once to see whether the cited posts come from the people you meant to follow.

The delegation side is a different product. [Grok Bot](https://x.ai/changelog/bot) works inside Slack and email, has its own computer, and can run scheduled routines.

The update dated 2026-10-23 adds Vault: the Bot can save logins, cards, and contact info in Settings and fill them in to sign in or check out.

Vault needs Grok Bot 0.75.2 or later. The version the day before added Shop Pay, using Shop checkout where a store supports it and a one-time Shop card elsewhere. At payment time the Bot asks how to pay on a card, and approval cards flag irreversible or sensitive actions. After you deny one, the Bot stops until you send another message. I'd save one card with a spending cap, have the Bot buy something cheap, and watch the approval cards the whole way before deciding how much to hand over.

This Vault is not [Grok Enterprise's Vault](https://x.ai/news/grok-business). That one is an enterprise add-on with a dedicated data plane and customer-managed encryption keys (CMEK), and has nothing to do with filling in checkout details.

On iPhone, a popular [Grok shortcut on RoutineHub](https://routinehub.co/shortcut/21828/) describes two routes. The free Grok app's "Ask Grok" action is text-only, and the author notes it is less reliable; an xAI API key unlocks chat storage and image and video generation. If you want to automate with Shortcuts, take the API key route.

## Platform and voice: ChatGPT

OpenAI announced in February of 2026 that ChatGPT had reached [900 million weekly active users](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users/). That scale is the main pitch to developers: the [Apps SDK launch post](https://openai.com/index/introducing-apps-in-chatgpt/) says developers can "reach over 800 million ChatGPT users."

The Apps SDK is built on MCP and adds one layer on top: developers define the interactive interface an app shows in the conversation. Connecting tools doesn't require ChatGPT. [MCP](/posts/ai/2026-03-22-mcp-model-context-protocol-en) is an open standard, and the same MCP server works with other clients. ChatGPT adds two things: the in-chat interface, and its users.

For voice, the [Realtime API](https://openai.com/index/introducing-gpt-realtime/) became generally available on 2025-08-28. It handles audio directly in a single model instead of chaining speech-to-text and text-to-speech, and supports remote MCP servers, image input, and SIP phone calls. Image input works by placing a picture into the conversation, not by streaming live video, and your app decides what the model sees and when.

The shopping route has changed once. [Instant Checkout](https://openai.com/index/buy-it-in-chatgpt/) launched on 2025-09-29, letting US users buy single items from Etsy sellers inside the chat, built on the Agentic Commerce Protocol co-developed with Stripe.

According to [checkout-infrastructure company Rye's March 2026 write-up](https://rye.com/blog/openai-chatgpt-checkout-agentic-commerce), OpenAI has moved from direct checkout in search results toward checkout inside retailer apps such as Instacart and Target. Compare that with Grok Bot: ChatGPT's checkout needs the merchant to adopt the protocol first, while Grok Bot fills in forms on the site using its own computer.

**A test for tonight:** to decide whether a ChatGPT app is worth building, check whether your service already has an MCP server. If it does, the Apps SDK is just an interface layer on top; if not, build the MCP server first, since other clients can use it too.

## Putting it together

Each of the four has one line you can support with official documentation: Gemini's whole-video workflow, the Claude-versus-GPT tug-of-war on code, Grok's X search and auto-fill checkout, ChatGPT's app platform and voice. None wins everything, so the practical approach is routing by task, which is also where the multimodal post lands.

Model names, scores, and versions here are a snapshot from 2026-10-25, and features like Vault and Instant Checkout can change within a month. Before handing a task to any one of them, run the small test above. It beats trusting any leaderboard.

## References

- [Video understanding - Gemini API](https://ai.google.dev/gemini-api/docs/video-understanding)
- [Introducing agentic video understanding with Gemini - Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/)
- [Video-MME - GitHub](https://github.com/MME-Benchmarks/Video-MME)
- [Vision - Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/vision)
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
- [OpenAI Scales Back ChatGPT Checkout - Rye](https://rye.com/blog/openai-chatgpt-checkout-agentic-commerce)
