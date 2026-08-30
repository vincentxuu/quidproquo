---
title: "screenshot-to-code 怎麼把截圖變程式碼：Agent Loop、素材裁切、視覺驗證"
date: 2026-08-29
category: ai
type: deep-dive
tags: [agent, tool-use, screenshot-to-code, open-source, architecture, agentic-coding]
lang: zh-TW
tldr: "screenshot-to-code 不是一步到位的截圖轉碼工具。核心是一個最多 30 步的 Agent Loop，搭配 7 個工具——從截圖裁切真實素材、用 Playwright 自我驗證、到同時跑 4 個模型讓使用者選最好的版本。GitHub 74,500+ stars，MIT License。"
description: "深入拆解 abi/screenshot-to-code 的 Agent 架構：engine.py 的 30 步迴圈、Gemini 素材裁切、Playwright 自我驗證迴路、多模型並行生成。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-08-29-screenshot-to-code-agent-architecture-en)

[screenshot-to-code](https://github.com/abi/screenshot-to-code) 是一個 GitHub 上有 74,500+ stars 的開源專案，能把截圖、Mockup、甚至螢幕錄影轉成前端程式碼。但它不是丟一張圖進 LLM 就拿到 HTML——核心是一個有 tool-calling 能力的 AI Agent，自己決定要裁切素材、產圖、截圖驗證還是修正程式碼，最多跑 30 輪。

這篇拆解它的架構設計，看一個 agentic 系統怎麼把「截圖轉碼」從單次 API 呼叫變成可靠的生成流程。

## 它是什麼

screenshot-to-code 由 [Abi Raja](https://github.com/abi) 在 2023 年 11 月建立，前端是 [React](https://react.dev/) 18 + [Vite](https://vite.dev/) + [Tailwind CSS](https://tailwindcss.com/)，後端是 Python + [FastAPI](https://fastapi.tiangolo.com/) + WebSocket。使用者拖入一張截圖，後端用 AI 生成對應的 HTML/CSS/React/Vue/Bootstrap 程式碼，支援六種前端框架輸出。

跟其他截圖轉碼工具的差異在於：它不只輸出「看起來像」的程式碼——它會從原始截圖裁切真實的 logo 和圖片嵌入程式碼，然後用 headless 瀏覽器渲染自己的輸出來驗證是否還原了原始設計。

專案同時提供自架版（MIT License，需自備 API key）和託管版（screenshottocode.com）。自架版的核心成本在 AI API 呼叫，每次生成內建 3 美元花費上限。

## Agent Loop：核心引擎

整個系統的核心在 [`engine.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/agent/engine.py) 的 `AgentEngine` class。它不是一次性的 prompt → response，而是一個最多 30 步的迴圈：

```python
for step in range(30):
    turn = session.stream_turn(on_event)   # 呼叫 LLM

    if no tool_calls:
        return finalize_response()          # 沒有工具呼叫 → 結束

    if over_budget:
        raise BudgetExceededError           # 超過花費上限

    for tool_call in turn.tool_calls:
        result = tool_runtime.execute(tool_call)  # 執行工具

    session.append_tool_results(turn, results)    # 結果回饋給 LLM
```

LLM 在每一步自主決定要呼叫哪些工具。一個典型的 image-to-code 流程大約會跑 4-6 步：先裁切素材，再建立 HTML，截圖驗證一次，修正幾個問題，再驗證一次。

這跟 single-shot 生成的差異是根本性的——single-shot 的品質完全取決於第一次輸出，Agent Loop 讓模型可以迭代修正。代價是 token 消耗更高：每輪都要把完整的 conversation history（含圖片）送進 LLM。

## 七個工具

[`definitions.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/agent/tools/definitions.py) 定義了 Agent 可呼叫的工具，部分工具依 API key 動態啟用：

| 工具 | 做什麼 | 啟用條件 |
|---|---|---|
| `create_file` | 寫入完整 HTML 檔案 | 永遠 |
| `edit_file` | 精確字串替換（支援 batch） | 永遠 |
| `extract_assets` | 從截圖裁切真實素材 | 需 Gemini API key |
| `generate_images` | 用 Replicate Flux 產圖 | 需 Replicate API key |
| `edit_images` | 編輯或去背圖片 | 需 Replicate API key |
| `screenshot_preview` | Playwright 截圖自我驗證 | 需 Playwright |
| `retrieve_option` | 讀取其他 variant 的 HTML | 永遠 |

工具的設計思路是**分工明確**：`create_file` 只管建檔，`edit_file` 只做精確的 old_text → new_text 替換（不重寫整個檔案），素材裁切和圖片生成各有專門的工具。這讓 Agent 的每一步都是可控的小操作，而不是一次產出所有東西。

`edit_file` 支援 batch edits——一次呼叫可以傳入多個 `{old_text, new_text}` 替換，減少不必要的 LLM 來回。

## Asset Extraction：從截圖裁切真實素材

這是 screenshot-to-code 最有特色的功能。[`asset_extraction.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/asset_extraction.py) 用 [Gemini](https://ai.google.dev/) 3.6 Flash 的 structured output 做 2D 物件偵測：

1. Agent 傳入素材描述（例如 "top-left company logo"、"hero banner image"）
2. 程式碼把描述和原始截圖一起送進 Gemini，用 `response_schema=AssetDetectionBatch` 約束輸出格式
3. Gemini 回傳每個素材的 bounding box：`[ymin, xmin, ymax, xmax]`，座標正規化到 0-1000
4. 用 PIL 精確裁切，轉成 PNG，存為永久可存取的 public URL
5. 裁切結果以圖片回傳給 Agent，讓它視覺驗證裁切是否正確

每次最多處理 25 個素材，超過自動分批平行處理。裁切失敗的素材標為 `unresolved`，Agent 會自動 fallback 到 `generate_images` 產替代圖片。

這個做法的巧妙之處在於：不依賴通用的物件偵測模型（YOLO 之類），而是利用 LLM 的語言理解能力——你可以用自然語言描述「左上角的 logo」，Gemini 理解語義後回傳座標。

## Screenshot Preview：視覺驗證迴路

[`screenshot_preview.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/agent/tools/screenshot_preview.py) 用 [Playwright](https://playwright.dev/) headless Chromium 截圖，讓 Agent「看到」自己生成的頁面：

1. 從當前的 file state 取出 HTML
2. 分別在 desktop 和 mobile viewport 做 full-page 截圖
3. 截圖以 PNG bytes 作為 multimodal tool result 回傳

LLM 在下一輪同時看到**原始截圖**和**自己生成的截圖**，可以做視覺比對。發現佈局錯位、顏色偏差、元素重疊，就呼叫 `edit_file` 修正，然後可能再截一次驗證。

System prompt 明確指示 Agent：「每次 `create_file` 或大幅 `edit_file` 後，呼叫 `screenshot_preview` 驗證。」這形成了一個**視覺 feedback loop**——AI 不是盲生成，而是生成後「用眼睛看」再修正。

這個設計的限制是：Playwright 截圖不完美。字體渲染、scroll 行為、動態內容（hover 狀態、動畫）都跟真實瀏覽器有差異。但對靜態佈局的還原度檢查來說，已經足夠有效。

## Multi-variant 競爭生成

[`generate_code.py`](https://github.com/abi/screenshot-to-code/blob/main/backend/routes/generate_code.py) 的 `AgenticGenerationStage` 用 `asyncio.create_task` 平行啟動多個 variant，每個 variant 用不同的 AI 模型：

```
Variant 1: Claude Opus 5 (medium effort)
Variant 2: Gemini 3 Flash (high thinking)
Variant 3: Gemini 3.1 Pro (high thinking)
Variant 4: GPT-5.6 Sol (max effort)
```

新建模式預設 4 個 variant，修改模式 2 個。每個 variant 有獨立的 Agent 實例、Provider Session、檔案狀態，互不干擾。`asyncio.gather(*tasks, return_exceptions=True)` 確保一個 variant 失敗不影響其他。

這個策略的價值在於：不同模型擅長不同類型的 UI。Claude 可能對文字排版更好，Gemini 對圖片佈局更準，GPT 對 Tailwind 用法更熟。讓使用者看完結果自己挑，比賭在單一模型上更可靠。

代價是成本——4 個 variant 就是 4 倍的 API 花費。

## 整體架構

```
前端 (React + Vite)
  │ WebSocket
  ▼
Middleware Pipeline（6 層）
  │ 1. WebSocket Setup
  │ 2. Parameter Extraction
  │ 3. Status Broadcast
  │ 4. Prompt Creation ──→ 策略選擇
  │ 5. Code Generation ──→ asyncio 平行
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

後端透過 [`WebSocketCommunicator`](https://github.com/abi/screenshot-to-code/blob/main/backend/routes/generate_code.py) 把每個 token、工具呼叫狀態、生成的程式碼即時推送到前端。`create_file` 的 content 在 tool call 還在 streaming 時就開始送 `setCode` 訊息，使用者幾乎即時看到程式碼成形。

Provider 抽象層（`ProviderSession` 介面）統一了 [OpenAI](https://platform.openai.com/docs)、[Anthropic](https://docs.anthropic.com/)、[Google Gemini](https://ai.google.dev/) 三家 API 的 tool 定義格式和 multimodal 結果嵌入方式，讓 Agent 引擎不需要知道底層用的是哪家模型。

## 整體來說

screenshot-to-code 的核心設計取捨是：**用更高的 token 成本換取更可靠的輸出品質**。30 步 Agent Loop、視覺自我驗證、多模型競爭生成，每一個都在增加 API 花費，但也在解決 single-shot 生成的根本問題——第一次就要完美。

這個架構適合的場景是：**快速原型製作**。把設計稿或競品截圖丟進去，幾分鐘拿到一個可運行的前端原型，再手動修改細節。它不適合直接生成 production-ready 的程式碼——生成的是單頁 HTML，沒有元件拆分、沒有路由、沒有狀態管理。

對 AI 工程師來說，值得學的不只是它做了什麼，而是**怎麼做**：Agent Loop 搭配專用工具鏈、schema-constrained output 做結構化資料擷取、headless 瀏覽器做自我驗證。這些模式在截圖轉碼之外同樣適用。

## 參考資料

- [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) — GitHub repo（MIT License），本文分析基於 2026 年 7 月的原始碼
