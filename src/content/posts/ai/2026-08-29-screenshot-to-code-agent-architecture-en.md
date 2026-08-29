---
title: "How screenshot-to-code Converts Screenshots to Code: Agent Loop, Asset Extraction, Visual Verification"
date: 2026-08-29
category: ai
type: deep-dive
tags: [agent, tool-use, screenshot-to-code, open-source, architecture, agentic-coding]
lang: en
tldr: "screenshot-to-code is not a one-shot screenshot-to-HTML tool. Its core is a 30-step Agent Loop with 7 tools — extracting real assets from screenshots, self-verifying with Playwright, and running 4 models in parallel so users pick the best output. 74,500+ GitHub stars, MIT License."
description: "A deep dive into abi/screenshot-to-code's agent architecture: the 30-step engine loop, Gemini-based asset extraction, Playwright self-verification, and multi-model parallel generation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-29-screenshot-to-code-agent-architecture)

[screenshot-to-code](https://github.com/abi/screenshot-to-code) is an open-source project with 74,500+ GitHub stars that converts screenshots, mockups, and screen recordings into frontend code. But it doesn't just toss an image into an LLM and return HTML — at its core is an AI Agent with tool-calling capabilities that autonomously decides when to extract assets, generate images, take verification screenshots, and fix its own code, running up to 30 iterations.

This article breaks down its architecture to show how an agentic system turns "screenshot to code" from a single API call into a reliable generation pipeline.

## What It Is

screenshot-to-code was created by [Abi Raja](https://github.com/abi) in November 2023. The frontend is [React](https://react.dev/) 18 + [Vite](https://vite.dev/) + [Tailwind CSS](https://tailwindcss.com/); the backend is Python + [FastAPI](https://fastapi.tiangolo.com/) + WebSocket. Users drag in a screenshot, and the backend generates corresponding HTML/CSS/React/Vue/Bootstrap code, supporting six frontend framework outputs.

What sets it apart from other screenshot-to-code tools: it doesn't just output code that "looks similar" — it crops real logos and images from the original screenshot to embed in the code, then renders its own output in a headless browser to verify the design was faithfully reproduced.

The project offers both a self-hosted version (MIT License, bring your own API keys) and a hosted version (screenshottocode.com). The core cost of self-hosting is AI API calls, with a built-in $3 USD cap per generation.

## The Agent Loop: Core Engine

The heart of the system lives in [`engine.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/agent/engine.py)'s `AgentEngine` class. It's not a one-shot prompt → response — it's a loop that runs up to 30 steps:

```python
for step in range(30):
    turn = session.stream_turn(on_event)   # Call the LLM

    if no tool_calls:
        return finalize_response()          # No tool calls → done

    if over_budget:
        raise BudgetExceededError           # Cost cap exceeded

    for tool_call in turn.tool_calls:
        result = tool_runtime.execute(tool_call)  # Execute tools

    session.append_tool_results(turn, results)    # Feed results back
```

The LLM autonomously decides which tools to call at each step. A typical image-to-code flow runs 4-6 steps: extract assets, create the HTML file, take a verification screenshot, fix a few issues, verify again.

The difference from single-shot generation is fundamental — single-shot quality depends entirely on the first output. The Agent Loop lets the model iterate and self-correct. The tradeoff is higher token consumption: each round sends the full conversation history (including images) back to the LLM.

## Seven Tools

[`definitions.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/agent/tools/definitions.py) defines the tools the Agent can call, with some dynamically enabled based on available API keys:

| Tool | Function | Availability |
|---|---|---|
| `create_file` | Write a complete HTML file | Always |
| `edit_file` | Exact string replacement (supports batch) | Always |
| `extract_assets` | Crop real assets from screenshots | Requires Gemini API key |
| `generate_images` | Generate images via Replicate Flux | Requires Replicate API key |
| `edit_images` | Edit or remove image backgrounds | Requires Replicate API key |
| `screenshot_preview` | Playwright screenshot for self-verification | Requires Playwright |
| `retrieve_option` | Read another variant's HTML | Always |

The design philosophy is **clear separation of concerns**: `create_file` only creates files, `edit_file` only does precise old_text → new_text replacements (never rewrites the entire file), and asset extraction and image generation each have dedicated tools. This keeps each Agent step as a small, controllable operation rather than producing everything at once.

`edit_file` supports batch edits — a single call can include multiple `{old_text, new_text}` replacements, reducing unnecessary LLM round-trips.

## Asset Extraction: Cropping Real Assets from Screenshots

This is screenshot-to-code's most distinctive feature. [`asset_extraction.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/asset_extraction.py) uses [Gemini](https://ai.google.dev/) 3.6 Flash's structured output for 2D object detection:

1. The Agent provides asset descriptions (e.g., "top-left company logo", "hero banner image")
2. The code sends descriptions and the original screenshot to Gemini with `response_schema=AssetDetectionBatch` constraining the output format
3. Gemini returns bounding boxes for each asset: `[ymin, xmin, ymax, xmax]`, coordinates normalized to 0-1000
4. PIL crops precisely, converts to PNG, and stores as a permanently accessible public URL
5. Cropped results are returned to the Agent as images for visual verification

Each request handles up to 25 assets, automatically chunking larger batches for parallel processing. Failed extractions are marked as `unresolved`, and the Agent automatically falls back to `generate_images` for substitutes.

The clever part: instead of relying on general-purpose object detection models (like YOLO), it leverages the LLM's language understanding — you describe "the logo in the top-left corner" in natural language, and Gemini understands the semantics before returning coordinates.

## Screenshot Preview: The Visual Verification Loop

[`screenshot_preview.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/agent/tools/screenshot_preview.py) uses [Playwright](https://playwright.dev/) headless Chromium to let the Agent "see" its own generated page:

1. Extract HTML from the current file state
2. Take full-page screenshots at both desktop and mobile viewports
3. Return screenshots as PNG bytes in a multimodal tool result

In the next iteration, the LLM sees both the **original screenshot** and its **own generated screenshot** side by side, enabling visual comparison. When it spots layout misalignment, color drift, or overlapping elements, it calls `edit_file` to fix them, then potentially takes another verification screenshot.

The system prompt explicitly instructs the Agent: "After every `create_file` or major `edit_file`, call `screenshot_preview` to verify." This creates a **visual feedback loop** — the AI doesn't generate blindly; it generates, "looks with its eyes," and then corrects.

This design has limitations: Playwright screenshots aren't perfect. Font rendering, scroll behavior, and dynamic content (hover states, animations) differ from real browsers. But for checking static layout reproduction, it's effective enough.

## Multi-Variant Competitive Generation

[`generate_code.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/routes/generate_code.py)'s `AgenticGenerationStage` uses `asyncio.create_task` to launch multiple variants in parallel, each using a different AI model:

```
Variant 1: Claude Opus 5 (medium effort)
Variant 2: Gemini 3 Flash (high thinking)
Variant 3: Gemini 3.1 Pro (high thinking)
Variant 4: GPT-5.6 Sol (max effort)
```

Create mode defaults to 4 variants; update mode uses 2. Each variant has its own independent Agent instance, Provider Session, and file state, with no shared mutable state. `asyncio.gather(*tasks, return_exceptions=True)` ensures one variant's failure doesn't affect the others.

The value of this strategy: different models excel at different UI types. Claude might handle text layout better, Gemini might be more accurate with image positioning, and GPT might be more fluent with Tailwind utilities. Letting users compare results and choose is more reliable than betting on a single model.

The cost is straightforward — 4 variants means 4x the API spending.

## Overall Architecture

```
Frontend (React + Vite)
  │ WebSocket
  ▼
Middleware Pipeline (6 layers)
  │ 1. WebSocket Setup
  │ 2. Parameter Extraction
  │ 3. Status Broadcast
  │ 4. Prompt Creation ──→ strategy selection
  │ 5. Code Generation ──→ asyncio parallel
  │ 6. Post Processing        │
  │                    ┌──────┼──────┐──────┐
  │                    ▼      ▼      ▼      ▼
  │                 Variant Variant Variant Variant
  │                 (Claude) (Gemini) (Gemini) (GPT)
  │                    │
  │               AgentEngine
  │               max 30 steps
  │                    │
  │              ┌─────┼──────┐
  │              ▼     ▼      ▼
  │         create  extract  screenshot
  │         _file   _assets  _preview
  │              │     │      │
  │              ▼     ▼      ▼
  └──── streaming setCode / toolResult / thinking
```

The backend streams every token, tool call status, and generated code to the frontend in real time through [`WebSocketCommunicator`](https://github.com/abi/screenshot-to-code/blob/main/backend/routes/generate_code.py). The `create_file` tool's content begins sending `setCode` messages while the tool call is still streaming, so users see the code taking shape almost instantly.

The Provider abstraction layer (`ProviderSession` interface) unifies [OpenAI](https://platform.openai.com/docs), [Anthropic](https://docs.anthropic.com/), and [Google Gemini](https://ai.google.dev/)'s tool definition formats and multimodal result embedding, so the Agent engine doesn't need to know which provider it's using underneath.

## The Bottom Line

screenshot-to-code's core design tradeoff is: **spend more tokens for more reliable output quality**. The 30-step Agent Loop, visual self-verification, and multi-model competitive generation all increase API costs, but they address the fundamental problem with single-shot generation — having to be perfect on the first try.

The architecture fits one scenario well: **rapid prototyping**. Drop in a design mockup or competitor screenshot, get a runnable frontend prototype in minutes, then manually refine the details. It's not meant for generating production-ready code — the output is single-page HTML with no component splitting, routing, or state management.

For AI engineers, the lessons extend beyond screenshot-to-code itself: an Agent Loop paired with specialized tool chains, schema-constrained output for structured data extraction, and headless browsers for self-verification. These patterns apply well beyond converting screenshots.

## References

- [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) — GitHub repo (MIT License); this analysis is based on the source code as of July 2026
