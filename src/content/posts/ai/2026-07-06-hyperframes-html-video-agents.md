---
title: "HyperFrames 深度解析：HTML 即影片，Agent 時代的影片製作範式轉移"
date: 2026-07-06
category: ai
type: deep-dive
tags: [hyperframes, heygen, video-generation, html, agent-skills, open-source, remotion]
lang: zh-TW
tldr: "HeyGen 開源的 HyperFrames 用 HTML data 屬性定義影片時間軸，headless Chrome 逐幀 seek 截圖再由 FFmpeg 編碼成 MP4。3 個月 33k stars，Apache 2.0，21 個 agent skills——AI agent 寫 HTML 就能產影片，不需要 React。"
description: "深入分析 HeyGen 開源的 HyperFrames 框架：從 HTML 到 MP4 的渲染管線、seekable 動畫設計、與 Remotion 的比較、agent skills 生態、以及 HeyGen 的開源策略。"
draft: false
glossary:
  - term: "seekable rendering"
    aliases: ["可跳幀渲染"]
    definition: "渲染引擎可以直接跳到任意幀截圖，不需要從頭播放到該時間點。"
    definition_en: "The rendering engine can jump directly to any frame for capture without playing through from the beginning."
    context: "HyperFrames 要求所有動畫都是 seekable 的，這是 deterministic 渲染的基礎。"
    context_en: "HyperFrames requires all animations to be seekable, which is the foundation of deterministic rendering."
  - term: "deterministic rendering"
    aliases: ["確定性渲染"]
    definition: "相同輸入永遠產生完全相同的輸出，不受執行環境或時間差異影響。"
    definition_en: "Identical inputs always produce identical outputs, unaffected by execution environment or timing differences."
    context: "讓影片渲染可以做 CI/CD regression testing 和可重現的 bug report。"
    context_en: "Enables CI/CD regression testing and reproducible bug reports for video rendering."
---

> 🌏 [English version](/posts/ai/2026-07-06-hyperframes-html-video-agents-en)

[HyperFrames](https://github.com/heygen-com/hyperframes) 是 HeyGen 在 2026 年 4 月開源的影片渲染框架，核心命題只有一句話：**影片就是 HTML 頁面**。用 `data-*` 屬性定義時間軸，用瀏覽器動畫做特效，交給 headless Chrome 逐幀截圖再由 FFmpeg 編碼成 MP4。不需要 React，不需要 build step，AI agent 直接寫 HTML 就能產出影片。

開源 3 個月累積 33.2k GitHub stars、272 個 release，已有 HeyGen、tldraw、TanStack 在 production 使用。這篇文章拆解它的技術設計和生態佈局。

## 為什麼是 HTML？

程式化影片製作的先行者 [Remotion](https://www.remotion.dev/) 選擇 React 作為影片的描述格式——開發者用 React 元件建構場景、用 `useCurrentFrame()` 控制時間軸。這對人類開發者來說直覺，但對 AI agent 來說有個根本問題：**LLM 最擅長的不是 React，是 HTML**。

HTML/CSS/JS 是 LLM 訓練語料中最豐富的部分。25 年來的 CodePen、Stack Overflow、MDN 文件、W3Schools 範例，累積了巨量的 web 動畫程式碼。當你讓 AI agent 寫 GSAP 動畫或 CSS transition，它的品質遠高於讓它寫 Remotion 的 `interpolate()` 和 `spring()`。

HyperFrames 的洞察是：**把影片格式降維到 AI 最原生的語言，影片製作就變成 prompt 工程**。

## 渲染管線：從 HTML 到 MP4

HyperFrames 的渲染管線分四個階段：

```
HTML + CSS + JS  →  Puppeteer 載入  →  逐幀 seek + 截圖  →  FFmpeg 編碼  →  MP4
```

每個 HTML composition 是一個獨立的 `index.html`，可以直接在瀏覽器打開預覽。渲染時，引擎用 Puppeteer 啟動 headless Chrome 載入頁面，然後精確跳到每一幀的時間點截圖，最後用 FFmpeg 把幀序列編碼成影片。

這裡的關鍵設計是 **seekable rendering**：引擎不是「播放頁面並錄螢幕」，而是把動畫的 timeline 暫停、跳到精確時間點、截一張圖、再跳到下一幀。這保證了 deterministic output——相同的 HTML 在任何機器上渲染，都會產出完全相同的影片，讓 CI/CD regression testing 變得可能。

## Composition 格式

影片的時間軸用 HTML `data-*` 屬性宣告，不需要學習任何新語法：

```html
<div id="stage" data-composition-id="launch"
     data-start="0" data-width="1920" data-height="1080">

  <video class="clip" data-start="0" data-duration="6"
         data-track-index="0" src="intro.mp4" muted></video>

  <h1 id="title" class="clip" data-start="1"
      data-duration="4" data-track-index="1">Launch day</h1>

  <audio data-start="0" data-duration="6"
         data-track-index="2" data-volume="0.5"
         src="music.wav"></audio>

  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, y: 40, duration: 0.8 }, 1);
    window.__timelines = window.__timelines || {};
    window.__timelines.launch = tl;
  </script>
</div>
```

幾個設計選擇值得注意：

- **`data-start` / `data-duration`**：控制元素在影片中的出現時間，單位是秒
- **`data-track-index`**：控制圖層堆疊順序，數字越大越前面
- **`window.__timelines`**：動畫 timeline 註冊到全域物件，引擎在渲染時 seek 到對應時間
- **沒有自定義標籤**：所有東西都是標準 HTML，瀏覽器直接打開就能跑

## 套件架構

HyperFrames 採模組化設計，87.7% TypeScript，核心套件各司其職：

| 套件 | 職責 |
|------|------|
| [`hyperframes`](https://github.com/heygen-com/hyperframes) | CLI 入口——scaffold、preview、lint、render |
| `@hyperframes/core` | 解析器、生成器、linter、frame adapter |
| `@hyperframes/engine` | Puppeteer + FFmpeg 的 seekable capture 引擎 |
| `@hyperframes/producer` | 完整渲染管線：截圖 → 編碼 → 音訊混合 |
| `@hyperframes/studio` | 瀏覽器端 composition 編輯器 |
| `@hyperframes/player` | 可嵌入的 Web Component 播放器 |
| `@hyperframes/shader-transitions` | WebGL shader 轉場特效 |
| `@hyperframes/aws-lambda` | AWS Lambda 分散式渲染，可水平擴展 |

這個架構讓使用者可以只用 CLI 做本地渲染，也可以部署到 Lambda 做大規模並行產出。

## 動畫 Adapter 系統

HyperFrames 支援多種動畫引擎，透過 adapter 統一成 seekable 介面：

- **GSAP**：最常用，timeline 原生支援 seek
- **CSS animations**：透過 `animation-play-state: paused` + `animation-delay` 模擬 seek
- **Lottie**：JSON 動畫格式，goToAndStop 原生支援
- **Three.js**：3D 場景，mixer.setTime 控制
- **Anime.js**：seek 方法原生支援
- **WAAPI**（Web Animations API）：currentTime 屬性直接 seek
- **自定義 runtime**：實作 seek 介面即可接入

這個 adapter 模式是讓 HyperFrames 能吃下各種動畫需求的關鍵——不綁定單一動畫庫，但要求所有動畫都必須是「可跳到任意幀」的。

## Agent Skills：21 個技能的生態設計

HyperFrames 內建 21 個 AI agent skills，設計給 Claude Code、Cursor、Gemini CLI、Codex 等 coding agent 使用。安裝方式：

```bash
npx skills add heygen-com/hyperframes
```

Skills 分兩層：

**創作型**——對應具體影片類型，agent 只需要描述意圖：
- `product-launch-video`：行銷影片，30-90 秒
- `website-to-video`：網站導覽和作品集展示
- `faceless-explainer`：無人臉的概念解說影片
- `pr-to-video`：把 GitHub PR 變成 changelog 影片
- `embedded-captions`：在既有影片上加字幕
- `motion-graphics`：動態文字、數據特效、logo 動畫
- `music-to-video`：跟節拍同步的影片
- `remotion-to-hyperframes`：從 Remotion 遷移

**基礎型**——領域知識，創作型 skill 會按需載入：
- `hyperframes-core`：composition 格式和時間軸規範
- `hyperframes-animation`：動畫規則和 runtime adapter
- `hyperframes-keyframes`：逐幀動畫除錯
- `hyperframes-creative`：設計方向和節奏規劃
- `hyperframes-media`：TTS、音效、轉錄
- `hyperframes-cli`：開發迴圈和 Lambda 部署

這個分層設計讓 agent 不需要一次載入所有知識。使用者說「幫我做一個產品發布影片」，agent 透過 `/hyperframes` 路由 skill 判斷意圖，再按需載入 `product-launch-video` + `hyperframes-core` + `hyperframes-animation`。

## HyperFrames vs Remotion

兩者底層引擎相同——headless Chrome + FFmpeg，渲染品質天花板一致。核心差異在 authoring model：

| 面向 | [HyperFrames](https://github.com/heygen-com/hyperframes) | [Remotion](https://www.remotion.dev/) |
|------|-------------|---------|
| 描述格式 | HTML + CSS + data 屬性 | React 元件 |
| Build step | 不需要，.html 直接執行 | 需要 bundler |
| Agent 友善度 | 極高——LLM 天生擅長 HTML | 中等——需要理解 JSX |
| 生態成熟度 | 快速成長中（3 個月 33k stars） | 成熟穩定，大量 production 用例 |
| License | Apache 2.0（完全開源） | Remotion License（source-available） |
| 強項 | 字幕、overlay、行銷影片、agent 生成 | 數據驅動、程式化社群內容 |

選擇建議：

- **已在用 Remotion 且穩定出貨**？留在 Remotion，不需要遷移
- **團隊以 React 為主**？Remotion 的學習曲線回報更快
- **要讓 AI agent 自動產影片**？HyperFrames 目前沒有直接競爭者
- **從零開始、要最小依賴**？HyperFrames 只需要 HTML + 一個 renderer

## HeyGen 的開源策略

HyperFrames 是 Apache 2.0，沒有 per-render 費用、沒有商業使用限制。這不是慈善——這是精確的生態佈局：

- **HyperFrames**（開源）負責「渲染」：HTML → MP4
- **HeyGen 平台**（付費）負責「內容生成」：AI avatar、TTS、數位人

兩者互補而非競爭。開發者用免費的 HyperFrames 建立影片製作 pipeline，需要數位人或語音合成時自然接入 HeyGen 付費服務。開源框架擴大生態，付費平台收割需求——和 Cloudflare 開源 Workers Runtime 的策略如出一轍。

同時，HeyGen 也開源了 [hyperframes-launches](https://github.com/heygen-com/hyperframes-launches)，把自家產品發布影片的 composition 源碼公開，既是範例也是社群信任建設。

## 限制和注意事項

- **渲染速度**：逐幀截圖的方式不可能快——每一幀都是一次完整的頁面渲染和截圖。AWS Lambda 分散式渲染可以緩解，但基礎延遲擺在那裡
- **環境要求**：Node.js 22+、FFmpeg、headless Chrome，部署門檻不算低
- **動畫限制**：所有動畫必須 seekable。依賴真實時間（`Date.now()`）或隨機數的動畫需要改造
- **生態年輕**：2026 年 4 月才開源，第三方整合、社群插件還在建立中，v0.7.x 版本號也暗示 API 仍在快速迭代

## 整體來說

HyperFrames 的核心價值不在技術新穎性——headless Chrome + FFmpeg 渲染影片早就有人做了。它的價值在**生態位選擇**：在 AI agent 成為主要開發者的時代，把影片格式對齊到 LLM 最擅長的語言，是一個正確的抽象層級決策。

33k stars 在 3 個月內不是偶然——它出現在正確的時間（agent-first 工具鏈成形）、選了正確的格式（HTML）、用了正確的 license（Apache 2.0）、配了正確的分發渠道（agent skills）。如果你在做任何跟 AI 影片生成相關的事，HyperFrames 是目前最值得關注的基礎設施。

## 參考資料

- [HyperFrames GitHub](https://github.com/heygen-com/hyperframes) — 主倉庫，Apache 2.0
- [HyperFrames 官方文件](https://hyperframes.heygen.com/) — 完整文件和教學
- [hyperframes-launches](https://github.com/heygen-com/hyperframes-launches) — HeyGen 產品發布影片的開源 composition
- [Remotion](https://www.remotion.dev/) — React-based 影片框架，主要競品
- [HyperFrames x HeyGen](https://help.heygen.com/en/articles/15001510-hyperframes-x-heygen) — 官方整合說明
- [HTML to Video: How HyperFrames Solved AI Video Rendering](https://www.heygen.com/research/html-to-video) — HeyGen 技術部落格
- [站內相關：用 AI Agent 操作影片生成工具](/posts/ai/2026-05-10-ai-agent-video-generation) — 整合指南
