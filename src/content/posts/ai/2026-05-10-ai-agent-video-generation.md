---
title: "用 AI Agent 操作影片生成工具：HyperFrames、HeyGen、Runway 整合指南"
date: 2026-05-10
category: ai
tags: [ai-agent, video-generation, hyperframes, heygen, mcp, claude-code, cursor]
lang: zh-TW
tldr: "AI agent 可透過 Skills、MCP Connector、直接 API 三種方式操作影片生成工具，選對整合方式比選對工具更重要。"
description: "介紹如何用 Claude Code、Cursor、Codex 等 AI coding agent，透過 Skills 和 MCP 整合 HyperFrames、HeyGen、Runway 等影片生成工具，打造可程式化的影片製作流水線。"
draft: false
---

AI 影片工具在 2025 年底到 2026 年初迎來一個重要轉折：從「你去用工具」變成「工具被 agent 呼叫」。

你不再需要開啟 HeyGen 網頁、手動選 avatar、貼腳本、等渲染、下載、分享。整個流程可以濃縮成一句對 Claude 說的話。這篇文章介紹目前最主流的三種整合方式，以及各工具適合搭配哪個 agent。

## 整體架構

```
你的指令
   ↓
AI Agent（Claude Code / Cursor / Codex / Gemini CLI）
   ↓              ↓
Skills / MCP   直接 API
   ↓              ↓
HyperFrames   HeyGen   Runway   Synthesia
   ↓
輸出影片
```

整合方式分三種，從上到下設定成本遞增、彈性也遞增：

1. **Skills** — 讓 agent 學會工具的使用方式，一行指令安裝
2. **MCP Connector** — 讓 agent 直接呼叫服務 API，適合非技術用戶
3. **API 直接整合** — 最靈活，適合開發者自建流水線

## Skills：最快的起點（HyperFrames）

Skills 是一種「知識包」，告訴 agent 如何正確使用某個工具的 API pattern。安裝後，agent 就不需要從零摸索文件。

**支援工具：** Claude Code、Cursor、Codex、Gemini CLI

HyperFrames 是 HeyGen 開源的影片生成框架（Apache 2.0），核心概念是「影片即程式碼」：用 HTML/CSS/GSAP 描述場景結構，agent 生成組合檔，最後 CLI 渲染成 MP4。

```bash
# 安裝 HyperFrames skill
npx skills add heygen-com/hyperframes

# 初始化專案
npx hyperframes init my-promo
```

在 Claude Code 裡：

```
/hyperframes Create a 10-second product intro video.
Visual style: high-tech, ivory background.
Content: based on @product.pdf
Include: fade-in title, feature highlights, ambient music
```

```bash
# 即時預覽
npx hyperframes preview

# 渲染輸出
npx hyperframes render --output final.mp4
```

之後可以像跟剪輯師說話一樣迭代：

```
Make the title 30% bigger
Add a lower-third at 0:03 saying "Launch Special"
Switch background to dark mode
Add a zoom-in transition between scene 2 and 3
```

HyperFrames 的核心優勢是 **deterministic**：相同輸入永遠產生相同輸出，適合批次生產和版本控制。HTML 也是 LLM 最熟悉的語言，比 React 組件的 lifecycle 問題少很多。

## MCP Connector：無程式碼整合（HeyGen）

MCP（Model Context Protocol）讓 agent 可以直接呼叫外部服務，不需要手動切換工具或複製貼上。

**支援工具：** Claude.ai、Claude Desktop、Claude Code、Cursor

### Claude.ai（最簡單）

1. Claude.ai → `+` → Connectors → Add HeyGen
2. OAuth 授權，不需要 API key
3. 在對話框輸入需求：

```
製作一部 45 秒的英文說明影片，介紹產品新功能。
使用商務風格男性 avatar，加上字幕。
腳本重點：痛點 → 解決方案 → call to action
```

Claude 會：寫腳本 → 呼叫 HeyGen API → 監控渲染進度 → 回傳分享連結，全在同一個對話完成。

### Claude Code（批次自動化）

```bash
export HEYGEN_API_KEY=your_key
npx skills add heygen-com/skills
```

```
Generate 5 personalized sales videos for leads in leads.csv.
Each video: 30 seconds, avatar "Sarah_v2"
Dynamic variables: {{name}}, {{company}}
Output: share links in results.csv
```

這個模式適合業務自動化：讀 CRM 匯出的名單，逐筆生成個人化影片，輸出分享連結，不需要任何手動操作。

## API 直接整合：最大彈性（Runway / Synthesia）

對於 Runway 和 Synthesia 這類沒有官方 MCP 的工具，可以讓 agent 直接操作 REST API。

### Runway

MCP Market 上有社群維護的 Runway skill：

```bash
npx skills add runway-video-generation
```

或者讓 Claude Code 寫一個 API wrapper：

```
Write a Runway Gen-3 API client that:
- Takes a text prompt and optional reference image
- Generates a 10-second video clip
- Polls for completion and returns the download URL
Store API key in RUNWAY_API_KEY env var
```

Runway 的強項是風格控制和創意感，適合廣告創意或帶有電影感的短片，跟 HyperFrames 的工整排版風格是兩個不同的定位。

### Synthesia

Synthesia 適合企業培訓影片，API 直接整合：

```
Use Synthesia API to create a training video:
- Script: @training-script.md
- Avatar: anna_costume1_cameraA
- Language: zh-TW
- Background: office_2
Return the video URL when done
```

## 各工具整合對照表

| | Claude Code | Claude.ai | Cursor | Codex |
|---|---|---|---|---|
| **HyperFrames** | ✅ Skill | ❌ | ✅ Skill | ✅ Skill |
| **HeyGen** | ✅ Skill + MCP | ✅ Connector | ✅ MCP | ✅ Skill |
| **Runway** | ✅ Skill / API | 🔶 API | ✅ API | ✅ API |
| **Synthesia** | 🔶 API | 🔶 API | 🔶 API | 🔶 API |

## 怎麼選

**快速出片、不想寫程式**
→ Claude.ai + HeyGen Connector。描述需求，直接拿連結。

**可程式化的影片流水線**
→ Claude Code + HyperFrames Skill。影片像程式碼一樣版控、批次生成、CI 可跑。

**創意感強的廣告影片**
→ Claude Code + Runway API。提示詞控制風格，agent 處理 API 呼叫。

**批次個人化影片（業務 / 行銷自動化）**
→ Claude Code + HeyGen Skill。讀名單 → 批次生成 → 輸出連結，全自動。

## 整體來說

這波整合最重要的轉變不是工具變強了，而是**工具從目的地變成工具箱**。你不需要學 HeyGen 的介面，不需要學 HyperFrames 的 HTML 結構，只需要知道「我要什麼」，agent 負責翻譯成正確的 API 呼叫。

對開發者來說，HyperFrames + Claude Code 的組合最值得投入，因為影片的結構是可測試、可版控、可批次的。對行銷人來說，HeyGen MCP 是最低阻力的起點，設定一次之後就消失在背景裡。

---

## 參考資料

- [HyperFrames 官方文件](https://hyperframes.mintlify.app)
- [HeyGen MCP 官方介紹](https://www.heygen.com/model-context-protocol)
- [HeyGen × Claude 整合頁面](https://www.heygen.com/integrations/claude)
- [How to Build an AI Video Editing Workflow with Claude Code and Hyperframes — MindStudio](https://www.mindstudio.ai/blog/ai-video-editing-claude-code-hyperframes/)
- [HyperFrames: open-source framework that turns HTML into video — Reddit r/heygen](https://www.reddit.com/r/heygen/comments/1snl38i/hyperframes_opensource_framework_that_turns_html/)
