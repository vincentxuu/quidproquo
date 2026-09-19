---
title: "讓不可見變得可見：Agent 對話 UI 的元件設計哲學"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-ux, chat-ui, vue, streaming, component-design, frontend]
lang: zh-TW
tldr: "傳統聊天只需要顯示文字泡泡，但 AI Agent 對話要讓使用者看見思考、工具呼叫、引用來源和執行進度——我們用 12 個 Vue 元件、三種 DisplayMode 和一條 chatBlocks 渲染管線解決了這個問題。"
description: "從實作角度拆解 AI Agent 對話介面的元件設計：streaming-first 架構、DisplayMode 三態切換、工具分組、引用標記，以及統一的 chatBlocks 渲染管線。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-agent-chat-ui-component-design-en)

## 為什麼 Agent 對話 UI 跟普通聊天不同

傳統聊天介面的設計假設很簡單：一方發送文字，另一方回覆文字，頂多加個圖片或檔案附件。但當對話的另一端是 AI Agent，事情就完全不同了——Agent 會思考（reasoning）、會呼叫工具（tool use）、會搜尋網頁、會查知識庫、會引用來源，而且這些行為全部發生在「回覆一則訊息」的過程中。

如果只用傳統的文字泡泡來呈現，使用者會看到一個轉圈圈的 loading indicator 轉了 30 秒，然後突然蹦出一大段文字。使用者不知道 Agent 在做什麼、為什麼要等這麼久、答案的根據是什麼。

依 Anthropic 在 2025 年發佈的 [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) 指南中提出的觀點：agent 的可觀察性（observability）是信任的基礎。使用者需要看見 Agent 的決策過程，才能判斷結果是否可靠。Nielsen Norman Group 在 [AI Agent UX](https://www.nngroup.com/articles/ai-agent-ux/) 研究中也指出，讓使用者看見 agent 的「工作中」狀態，是降低焦慮和建立信任的關鍵設計模式。

我們在 AI 助理平台上花了三個月，從零打造了一套 Agent 對話 UI。在談我們怎麼做之前，先看看各家產品的現況。

## 各家怎麼做：2026 年的 Agent UI 現況

2026 年是 Agent 產品從研究 demo 進入主流的一年。依 [AYDesign 的 Agent UI 調查](https://www.aydesign.ai/blog/best-ai-agent-interfaces-2026)，領先的產品已經發展出一套可辨識的視覺語言：頂部的規劃面板、中間的工具呼叫串流、側邊的記憶面板、貫穿全文的信任訊號。以下是各家的做法。

### Thinking / Reasoning 怎麼展示

| 產品 | 做法 | 特色 |
|---|---|---|
| **ChatGPT** | o-series 模型有獨立的 reasoning phase，串流時 composer 區域會閃爍（shimmer），完成後在回覆上方顯示截斷的思考片段 | 使用者可以選擇 Auto / Fast / Thinking 三種模式 |
| **Claude.ai** | Adaptive Reasoning（4.6 世代起），模型自行判斷是否需要思考，支援 interleaved thinking——思考、呼叫工具、讀結果、再思考 | 開發者設定 effort level（standard / high / xhigh / max），不設 token 預算 |
| **Gemini** | Web UI 新增 [thinking level 滑桿控制](https://nokiapoweruser.com/gemini-web-ui-update-finally-solves-one-of-the-biggest-user-complaints-with-new-thinking-level-controls/)，讓使用者決定推理深度 | 移除了 standard 選項，只保留 Extended Thinking |
| **Cursor** | Agent Mode 是主力功能——讀 codebase、改檔案、跑終端、看輸出、迭代到完成 | 3.5 版加入 Cloud Agents，在隔離 VM 裡跑完整環境 |

**我們的觀察**：各家對 thinking 的呈現分為兩派。ChatGPT 和 Gemini 走「事後摘要」路線，思考結束才顯示；Claude.ai 走「即時串流」路線，使用者可以即時看見推理過程。我們選了即時串流，因為在企業場景中，使用者等 30 秒看到結果，比等 30 秒不知道在幹嘛的信任感高得多。

### Tool Use 怎麼呈現

| 產品 | 做法 | 特色 |
|---|---|---|
| **ChatGPT** | Plugin / tool 呼叫用 [Display Mode 系統](https://developers.openai.com/plugins/concepts/ui-guidelines)：composer view、fullscreen surface、chat sheet | 開發者可以自定工具的視覺呈現 |
| **Claude.ai** | Tool use 結果直接出現在對話中，Artifact 會在側邊面板即時渲染 HTML / React / SVG | Artifact 是持久的——可以跨 session 存取、發佈成連結 |
| **Cursor** | Inline Edit（Cmd+K）高亮程式碼後描述修改，回傳色碼 diff 可接受/拒絕/部分套用 | 依 [DEV Community 報導](https://dev.to/sahilkhurana/cursor-ai-2026-the-complete-guide-to-the-ai-native-ide-3n4h)，Composer diff view 和 Agent panel 是一級功能 |
| **Coze Studio** | ByteDance 開源的視覺 agent 平台，工具呼叫在 canvas 上以節點形式視覺化 | 支援在 workflow 畫布上看到每個工具的輸入輸出 |
| **Dify** | 開源 LLM 應用平台，依 [Jimmy Song 的比較](https://jimmysong.io/blog/open-source-ai-agent-workflow-comparison/)，工具呼叫以 workflow 節點 + 日誌面板呈現 | RAG pipeline 和 plugin 市集整合在同一介面 |

**我們的觀察**：工具呈現分為三種模式——inline（ChatGPT、Claude.ai）、panel（Cursor）、timeline（Coze、Dify）。Inline 最適合對話情境，panel 適合需要大面積展示結果的場景（如程式碼 diff），timeline 適合需要看到完整工作流程的場景。我們選了 inline + tool grouping 的混合方式。

### Citation 怎麼標記

| 產品 | 做法 | 特色 |
|---|---|---|
| **Perplexity** | 依 [AI UX Playground 的分析](https://www.aiuxplayground.com/gallery/perplexity-citations/)，回覆上方放水平 source strip（favicon + 標題 + 編號），行內用 `[1]` 數字標記 | 平均每則回覆 5-10 個 inline citation，hover 可預覽 |
| **ChatGPT** | 搜尋結果以卡片列表呈現，行內引用用上標數字連結 | 點擊引用會跳到來源網頁 |
| **Claude.ai** | 沒有原生的 citation UI，引用以 Markdown 連結形式出現在文字中 | Artifact 裡的程式碼和文件是另一種形式的「可驗證來源」 |
| **Gemini** | 搜尋結果整合在回覆中，依 [Google 官方部落格](https://blog.google/products/search/gemini-3-search-ai-mode/)，2026 年加入 Generative UI，搜尋結果可以是互動式表格、圖表 | Antigravity 引擎即時組裝客製化版面 |

**我們的觀察**：Perplexity 在引用 UX 上獨佔鰲頭。依 [AYDesign 的引用 UI 模式研究](https://www.aydesign.ai/blog/ai-citation-source-ui-patterns-2026)，2026 年的最佳實踐是多層引用系統——行內數字上標 + hover 預覽 popover + 側欄來源列表 + 原文段落高亮。我們實作了前三層（行內標記 + popover + 來源列表），第四層（原文高亮）留待知識庫閱讀器完成後補上。

### Streaming 體驗

| 產品 | 做法 |
|---|---|
| **ChatGPT** | 逐 token 串流文字，thinking phase 用 shimmer 動畫，工具執行時顯示「Searching...」「Running code...」等狀態文字 |
| **Claude.ai** | 逐 token 串流，thinking 即時可見，工具呼叫完成後一次性顯示結果 |
| **Perplexity** | 回覆前先顯示 source strip 和搜尋進度，然後逐句串流答案 |
| **Cursor** | 程式碼 diff 逐行串流，依 [Cursor 2026 指南](https://www.deployhq.com/guides/cursor)，3.3 版加入 Build in Parallel 子 agent，Mission Control 格狀介面同時監控多個 agent |

**我們的觀察**：所有領先產品都走串流路線，沒有人在等完整回覆才顯示。差異在於串流的「最小顯示單位」——token 級（ChatGPT、Claude.ai）、句級（Perplexity）、還是行級（Cursor 的 diff）。我們在文字回覆用 token 級，工具呼叫用事件級（tool_use 事件到了就渲染）。

### 總結：各家的強項

依 [DEV Community 的 Agent UX 分析](https://dev.to/victor_desg/agent-ux-is-not-chatbot-ux-and-most-teams-in-2026-ship-them-as-if-they-were-23bi)：

> Claude Code 在透明規劃上立下標竿，Cursor 在工具呼叫可讀性上贏過同行，ChatGPT 在記憶功能領先，Perplexity 掌握了引用與信心度的 UX，Devin 是長時間自主 agent 最乾淨的參考。

了解了各家的做法之後，以下是我們為 AI 助理平台做的設計選擇。

## 三個設計原則

在動手寫元件之前，我們先釘了三個原則：

### 原則一：Streaming-first

Agent 的回覆不是一次到位的，而是一個持續數秒甚至數十秒的串流（stream）。每個元件從設計之初就必須處理「資料還在來」的狀態——Markdown 一個 token 一個 token 地渲染、思考區塊在 Agent 還在想的時候就要顯示、工具呼叫的輸入在送出前就要可見。

這代表所有元件都不能假設資料完整。每個 prop 都要能接受 partial state，UI 不能在缺資料時崩潰。

### 原則二：每種行為一個元件

Agent 的行為種類很多：思考、工具呼叫、搜尋、知識庫檢索、技能啟用、引用、任務規劃、進度回報……如果全部塞在一個 `MessageBubble` 裡用 `v-if` 切來切去，很快就會變成義大利麵。

我們的做法是**一種行為對應一個元件**，每個元件只負責自己的渲染邏輯：

```
ThinkingBlock     — Agent 的推理過程
ToolCall          — 工具呼叫（輸入 / 輸出）
CitationMark      — 行內引用標記
CitationPopover   — 引用來源彈出框
WebSearchResults  — 搜尋結果卡片
RagNodeList       — 知識庫檢索結果
SkillUsageChip    — 技能啟用提示
TodoList          — Agent 的任務規劃
InlineProgressCard — 即時進度指示
StreamingMarkdown  — 串流 Markdown 渲染
```

### 原則三：DisplayMode 統一三態

同一個元件在不同場景需要不同的視覺密度。我們定義了三種 `DisplayMode`：

| Mode | 用途 | 行為 |
|---|---|---|
| `expanded` | 預設展開，顯示完整內容 | 思考區塊全展開、工具呼叫顯示輸入輸出 |
| `compact` | 節省空間，只顯示摘要 | 思考區塊縮成一行、工具呼叫只顯示名稱 |
| `collapsed` | 最小化，點擊才展開 | 完全收合，只留標題列 |

每個行為元件都接受 `displayMode` prop，由上層的 `MessageItem` 根據訊息在對話中的位置決定：最新的訊息用 `expanded`，歷史訊息用 `compact`，被使用者手動收合的用 `collapsed`。

## 核心元件拆解

### ThinkingBlock — 讓使用者看見思考

```
┌─ 💭 Agent 正在思考... ─────────────────┐
│ 使用者問的是害蟲識別，我需要先查      │
│ 知識庫裡有沒有相關的圖片資料...        │
│ 找到了三個可能的品種，讓我比對一下     │
│ 形態特徵...                            │
└────────────────────────────────────────┘
```

`ThinkingBlock` 在 Agent 串流 thinking tokens 時即時渲染內容。串流結束後自動收合成一行摘要，使用者可以點擊展開看完整推理。

關鍵設計：串流中的文字用 `opacity` 漸入動畫，讓使用者感受到「Agent 正在思考」而不是「系統在跑」。收合後的摘要取前 50 個字元，不是靠 LLM 另外生成。

### ToolCall — 工具呼叫的輸入與輸出

```
┌─ 🔧 retrieve_text_nodes ──────────────┐
│ 輸入: query="黃吹綿介殼蟲防治方法"    │
│       top_k=15                         │
├────────────────────────────────────────┤
│ 輸出: 找到 12 筆結果                   │
│ ├─ [農藥使用手冊] 相似度 0.92         │
│ ├─ [害蟲防治指南] 相似度 0.87         │
│ └─ ...                                │
└────────────────────────────────────────┘
```

`ToolCall` 是最複雜的元件之一。一次 Agent 回覆可能包含多個工具呼叫，而且呼叫之間可能有因果關係（先搜尋、再讀取、再生成）。

我們引入了 **tool grouping**：相關的工具呼叫會被歸為一組，視覺上用縮排和連接線表示從屬關係。分組邏輯是根據工具呼叫之間的時序和輸入輸出的引用關係來判斷。

同時定義了 `ChatToolKind` 列舉來區分工具類型，不同類型有不同的圖示和色彩：

- `retrieve` → 知識庫圖示
- `web_search` → 搜尋圖示
- `code_interpreter` → 程式碼圖示
- `skill` → 技能圖示
- `file_operation` → 檔案圖示

### CitationMark + CitationPopover — 行內引用

```
根據農藥使用手冊[1]，防治黃吹綿介殼蟲
建議使用 95% 礦物油乳劑[2]...

[1] ──hover──> ┌─────────────────────┐
               │ 📄 農藥使用手冊.pdf  │
               │ p.42                │
               │ "95% 礦物油乳劑    │
               │  1000 倍液..."      │
               └─────────────────────┘
```

引用是 RAG 系統建立信任的關鍵。`CitationMark` 是行內的數字標記，hover 時彈出 `CitationPopover` 顯示來源文件名稱、頁碼和原文片段。

設計上刻意不用 tooltip，而是用 popover——因為引用原文可能很長，tooltip 放不下。Popover 內可以點擊檔案名稱跳轉到知識庫檔案頁面。

### RagNodeList — 檢索結果展示

```
┌─ 📚 檢索到 5 筆相關文件 ──────────────┐
│ ■■■■■■■■■■ 0.92  農藥使用手冊.pdf     │
│ ■■■■■■■■░░ 0.87  害蟲防治指南.docx    │
│ ■■■■■■░░░░ 0.65  病蟲害圖鑑.pdf       │
│ ■■■■░░░░░░ 0.43  栽培技術手冊.pdf     │
│ ■■■░░░░░░░ 0.31  農業概論.pdf         │
└────────────────────────────────────────┘
```

`RagNodeList` 把 Agent 從知識庫檢索到的 chunks 視覺化，包含相似度分數和來源文件。分數用色階呈現，讓使用者一眼看出哪些來源最相關。

這個元件在 `compact` 模式下只顯示「檢索到 N 筆結果」一行文字，`expanded` 模式才展開完整列表。

### InlineProgressCard — 即時進度

```
┌─ ⏳ 正在處理... ───────────────────────┐
│ ✅ 讀取使用者問題                      │
│ ✅ 搜尋知識庫                          │
│ 🔄 分析檢索結果                        │
│ ○  生成回覆                            │
└────────────────────────────────────────┘
```

Agent 在執行多步驟任務時，`InlineProgressCard` 會即時更新每個步驟的狀態。這是降低使用者焦慮最有效的元件——從「不知道在幹嘛」變成「看得到每一步」。

進度事件來自後端的 SSE（Server-Sent Events），前端監聽並更新對應步驟的狀態圖示（未開始 → 進行中 → 完成 → 失敗）。

## chatBlocks 渲染管線

有了十幾個元件之後，問題變成：誰來決定用哪個元件？

答案是 **chatBlocks 渲染管線**——一個統一的解析層，把 Agent 的串流回應轉換成一組有序的「區塊」，每個區塊對應一個元件：

```
Agent 串流回應
    │
    ▼
┌─ chatBlocks parser ──────────────────┐
│ 解析 SSE 事件流，識別區塊類型：      │
│ - text_delta → StreamingMarkdown     │
│ - thinking → ThinkingBlock           │
│ - tool_use → ToolCall                │
│ - tool_result → ToolCall (更新)      │
│ - citation → CitationMark            │
│ - skill_use → SkillUsageChip         │
│ - progress → InlineProgressCard      │
│ - todo → TodoList                    │
└──────────────────────────────────────┘
    │
    ▼
MessageItem 依序渲染 blocks[]
```

`MessageItem` 元件拿到的不再是一整塊 HTML 或 Markdown，而是一個 `Block[]` 陣列。每個 Block 有 `type` 和 `payload`，`MessageItem` 用 `v-for` 迴圈配 `component :is` 動態渲染。

這個設計帶來三個好處：

1. **新增行為類型只需新增一個元件 + 一個 parser case**，不用改 `MessageItem`
2. **顯示順序由 parser 控制**，不受 DOM 渲染順序影響
3. **每個區塊可以獨立更新**，不會觸發整個訊息重渲染

## i18n：第一天就做

所有元件的標籤（「正在思考」「搜尋結果」「檢索到 N 筆」「工具呼叫」）從第一天就走 i18n。不是因為預見到會有多語系需求，而是因為——

> 「先寫死中文、之後再改 i18n」的技術債，在元件數量超過 10 個之後，就永遠不會還了。

我們用 Vue I18n 的 `useI18n` composable，翻譯檔按功能模組拆分（`chat.thinking.title`、`chat.tool.searching` 等），避免一個巨大的翻譯檔。

## 教訓與反思

### 做對的事

1. **一行為一元件**讓每個元件保持在 200 行以內，好讀好改好測。新人只需要看一個檔案就能理解一種行為的渲染邏輯。

2. **DisplayMode 統一界面**避免了為每個元件各寫一套展開/收合邏輯。加了三個 prop 值，省了幾十個 `v-if`。

3. **chatBlocks 管線**把「解析」和「渲染」分離。當後端新增一種事件類型時，前端只需要寫一個新元件和一個 parser case，完全不用動現有元件。

### 付出的代價

1. **TypeScript 型別爆炸**：每種 Block 都有自己的 payload type，discriminated union 的型別定義檔越寫越長。但這是值得的——型別在編譯期就能抓到「忘記處理新的 block type」。

2. **串流狀態管理複雜度**：每個元件都要處理「正在串流」和「串流結束」兩種狀態，加上 DisplayMode 三態，排列組合是 2 × 3 = 6 種情境。元件雖小，測試矩陣不小。

3. **Tool grouping 的邏輯難以完美**：工具呼叫之間的因果關係不是總能從時序推斷，有時候兩個平行的工具呼叫會被錯誤地歸為一組。目前的做法「夠用但不完美」。

### 如果重做一次

會從第一天就建一個 **Storybook**，用各種 mock 資料把 6 種狀態組合全部視覺化。實際開發時我們靠手動在 dev 環境觸發不同場景來測，效率低且容易漏掉 edge case。

## 整體來說

Agent 對話 UI 的核心挑戰不是「怎麼顯示文字」，而是「怎麼讓使用者看見 Agent 的心智活動」。思考、搜尋、檢索、引用、規劃——這些行為在 API 層面只是 JSON 事件流，但在使用者眼中，它們是 Agent 可不可信的證據。

一行為一元件、DisplayMode 三態切換、chatBlocks 渲染管線——這三個設計決策讓我們能在三個月內從零交付 12 個元件，而且至今還能安心加新功能。

依 Jakob Nielsen 的 [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) 第一條「系統狀態的可見性」（Visibility of system status）：使用者在任何時候都應該知道系統在做什麼。Agent 對話 UI 把這條啟發式從「顯示 loading」升級到「顯示 Agent 此刻正在思考什麼、正在用什麼工具、找到了什麼資料」。

這不只是 UI 工程，這是信任工程。

## 參考資料

- [Building effective agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
- [AI Agent UX — Nielsen Norman Group](https://www.nngroup.com/articles/ai-agent-ux/)
- [10 Usability Heuristics for User Interface Design — Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Agent UX is not chatbot UX — DEV Community](https://dev.to/victor_desg/agent-ux-is-not-chatbot-ux-and-most-teams-in-2026-ship-them-as-if-they-were-23bi)
- [Best AI agent UI examples in 2026 — AYDesign](https://www.aydesign.ai/blog/best-ai-agent-ui-examples-2026)
- [AI citation and source UI design patterns for 2026 — AYDesign](https://www.aydesign.ai/blog/ai-citation-source-ui-patterns-2026)
- [Citations · Perplexity AI UX Case Study — AI UX Playground](https://www.aiuxplayground.com/gallery/perplexity-citations/)
- [Cursor AI 2026: The Complete Guide — DEV Community](https://dev.to/sahilkhurana/cursor-ai-2026-the-complete-guide-to-the-ai-native-ide-3n4h)
- [Cursor 2026: Composer, Agent Mode, MCP & Background Agent — DeployHQ](https://www.deployhq.com/guides/cursor)
- [Open Source AI Agent Platform Comparison 2026 — Jimmy Song](https://jimmysong.io/blog/open-source-ai-agent-workflow-comparison/)
- [OpenAI Plugin UI Guidelines](https://developers.openai.com/plugins/concepts/ui-guidelines)
- [Google Gemini Web UI Thinking Level Controls — NPowerUser](https://nokiapoweruser.com/gemini-web-ui-update-finally-solves-one-of-the-biggest-user-complaints-with-new-thinking-level-controls/)
- [Gemini 3 AI model in Search — Google Blog](https://blog.google/products/search/gemini-3-search-ai-mode/)
- [Vue.js Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue I18n](https://vue-i18n.intlify.dev/)
- [Server-Sent Events (SSE) — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
