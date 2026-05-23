---
title: "Midscene.js：押注純視覺的跨平台 UI 自動化框架"
date: 2026-05-23
category: ai
type: deep-dive
tags: [midscene, ui-automation, vision-language-model, mcp, agent, bytedance]
lang: zh-TW
tldr: "字節跳動開源(MIT、約 13k stars)的 UI 自動化框架。UI 動作只靠截圖餵給視覺語言模型(Qwen3-VL / Doubao / Gemini-3 / UI-TARS),不解析 DOM;一套 JS API 跨 Web / Android / iOS / 桌面,v1.0 起更直接移除 DOM 動作模式。代價是每步較慢、token 較貴。"
description: "深入介紹 Midscene.js:純視覺 UI 自動化的設計取捨、三類 API 與兩種自動化風格、多模型策略、快取機制、MCP 與 Skills 生態,以及與 Stagehand、browser-use 的差異。"
draft: false
glossary:
  - term: "VLM"
    aliases: ["視覺語言模型", "Vision-Language Model"]
    definition: "能同時理解影像與文字的多模態模型,可從截圖判斷畫面內容與元素位置。"
    context: "Midscene 用 VLM 直接從螢幕截圖定位要操作的 UI 元素。"
  - term: "grounding"
    aliases: ["視覺定位"]
    definition: "模型把文字指令對應到影像中具體座標/區域的能力,是純視覺自動化能不能點對位置的關鍵。"
    context: "本文用它指 VLM 把「點登入按鈕」對應到截圖座標的能力。"
---

[Midscene.js](https://midscenejs.com/) 是字節跳動 Web Infra 團隊開源(MIT、GitHub 約 13k stars)的 UI 自動化框架。它的賭注很單純:**UI 動作只看螢幕截圖,不解析 DOM**——你用自然語言描述目標,視覺語言模型(VLM)看著畫面決定點哪裡。這篇拆解它的核心取捨、API 設計、模型策略與生態工具,以及它跟 Stagehand、browser-use 這些 DOM 取向方案的差異,幫你判斷什麼情境該用它。

## 核心概念:把「怎麼點」換成「要達成什麼」

傳統 UI 自動化(Selenium、Playwright)綁在 DOM selector 或 XPath 上,前端一改 class name 或結構,腳本就壞。Midscene 把這層完全拿掉。官方 README 的說法很直接:

> Midscene.js is all-in on the pure-vision route for UI actions: element localization and interactions are based on screenshots only.

也就是元素定位與互動「只靠截圖」。你寫的不再是「找到 `#login-btn` 然後 click」,而是「點登入按鈕」,剩下交給模型的 grounding 能力。這個設計換來三件事:

- **跨平台通用**:同一套 JS API 跑在 Web、Android、iOS、HarmonyOS、桌面,連 `<canvas>`、WebGL 這種 DOM 抓不到內容的介面也能操作——因為對它來說一切都是像素。
- **抗結構變動**:畫面長相沒變,前端怎麼重構都不影響。
- **動作階段省 token**:跳過動輒上萬 node 的 DOM 樹,只送截圖。要做資料抽取(`aiQuery` / `aiAsk`)時,才選擇性地用 `domIncluded` 把 DOM 帶回來。

值得提醒:官方宣稱純視覺「省約 80% token」是**相對 Midscene 自己舊版的 DOM 模式**,不是對比 Stagehand 那類 DOM-first 競品,別誤引。

## 關鍵設計決定:v1.0 直接砍掉 DOM 動作模式

Midscene 不是「支援純視覺」,而是「只剩純視覺」。依官方 model-strategy 文件,v1.0 起:

> Midscene 1.0 and later only support the pure-vision approach — the DOM-extraction compatibility mode has been removed.

v0.x 時還有 DOM 抽取的相容模式幫忙定位,v1.0 把它移除(僅限「動作/定位」;資料抽取仍可 opt-in 帶 DOM)。這是一個有立場的取捨:**犧牲 DOM 帶來的精準定位,換跨平台一致性與抗變動性**。對應的版本軌跡也看得出方向——UI-TARS 支援在 v0.10.0 進來、快取在 v0.11.0、DeepThink 在 v0.13,一路往「靠模型看畫面」收斂。

另一個務實決定是 **model-native thinking 預設關閉**。官方說開啟推理鏈會「顯著增加任務延遲,改善卻有限」,所以預設不開,需要時才針對難定位的元素用 `deepThink` / `deepLocate`。

## 三類 API 與兩種自動化風格

對開發者,Midscene 把能力分成三類 API:

- **互動**:`aiAct()`(自動規劃並執行)、`aiTap()`、`aiInput()` 等原子操作
- **資料抽取**:`aiQuery()`(取結構化資料)、`aiBoolean()`、`aiAsk()`
- **工具**:`aiAssert()`(斷言)、`aiLocate()`(定位)、`aiWaitFor()`(等待)

在這之上,有兩種寫法。**Auto-planning** 把一句話丟給模型自己拆解:

```js
await aiAct('click all the records one by one. If one record contains the text "completed", skip it');
```

**Workflow style** 則自己用 JS 拆步驟,把不確定性鎖在小範圍,穩定性更高:

```js
const recordList = await agent.aiQuery('string[], the record list');
for (const record of recordList) {
  const hasCompleted = await agent.aiBoolean(`check if the record "${record}" contains the text "completed"`);
  if (!hasCompleted) {
    await agent.aiTap(record);
  }
}
```

兩者的取捨很典型:auto-planning 寫得快但每步都要模型推理、較慢較貴;workflow 把 query 結果落到程式邏輯,只在真正要「看畫面」時呼叫模型。除了 JS SDK,也能用 YAML 寫流程。

## 快取:加速重播,但不是穩定性保證

純視覺每步都要呼叫模型,所以 Midscene 內建快取。依官方 caching 文件,它快取**兩種東西**:AI 的 planning 步驟,以及元素定位的 XPath(僅 Web)。`aiQuery` / `aiBoolean` / `aiAssert` 的查詢結果**不快取**。命中時官方範例顯示一段腳本從 51 秒降到 28 秒。

但快取很脆:XPath 處的文字或 DOM 結構一變就 miss、回退 AI;Canvas、跨域 iframe、closed Shadow DOM 也用不了。文件自己講得很白——這「不是用來保證腳本長期穩定的工具」。換句話說,快取是加速器,不是 flaky 問題的解藥。

## 模型策略:多模型分工,GPT 不適合當主力

Midscene 的成敗高度取決於 VLM 的 grounding 能力。README 列出的支援模型包括 `Qwen3-VL`、`Doubao-1.6-vision`、`gemini-3-pro`、`UI-TARS`。有意思的是官方對 GPT 系列的態度——model-strategy 文件直接寫:

> Models like gpt-5 perform poorly here [visual grounding], so they cannot serve as the default.

GPT 視覺定位不夠好,只能拿去當「規劃」用,不能當定位主力。對應的解法是**多模型組合**:Default model 負責定位(Locate),另可配 Planning model(負責 `aiAct` 的任務拆解,官方建議用強推理模型)與 Insight model(負責 `aiQuery` / `aiAssert`)。背後承認的事實是:沒有單一模型在所有子任務都最好。

模型選擇也直接影響準度:文件指出 Qwen3-VL 優於 Qwen2.5-VL、72B 優於 30B,而且 `MIDSCENE_MODEL_FAMILY` 設錯會讓「元素定位明顯漂移」。想自架的話,UI-TARS、Qwen3-VL、開放權重的 GLM-4.6V 都是選項。

## 生態:MCP、Skills,與三種瀏覽器模式

Midscene 不只是 SDK,還把自己接進 agent 生態:

- **MCP Server**:把每個原子動作(連線、截圖、Tap、Scroll、assert...)暴露成 MCP tools,讓上層 agent 用自然語言檢視與操作 UI。套件如 `@midscene/web-bridge-mcp`、`@midscene/android-mcp`、`@midscene/computer-mcp`。
- **Midscene Skills**:免 MCP 設定,讓 AI coding 工具(Claude Code、Cline、OpenClaw)直接跑 CLI 命令來驅動自動化。安裝就一行:`npx skills add web-infra-dev/midscene-skills`(Claude Code 加 `-a claude-code`、OpenClaw 加 `-a openclaw`)。

Web 端有三種瀏覽器模式,官方描述如下:

> default Puppeteer headless, `--bridge` to use your own Chrome, `--cdp` to connect via CDP

其中 **Bridge Mode** 特別實用:透過 Chrome 擴充,讓本機 Node 腳本控制你**現有的桌面 Chrome**——沿用已登入的 cookie、外掛、登入態,適合「需要人在迴路裡」或要操作登入後頁面的場景。除錯則靠視覺化的 replay 報告、內建 Playground 與 Chrome 擴充功能,不用裸看 log。

## 跟 Stagehand、browser-use 怎麼選

同樣是「AI 操作介面」,路線差很多:

```
                定位方式        平台        語言      取向
Midscene    純視覺(截圖)   跨平台      JS/TS    SDK + 工具鏈
Stagehand   DOM(chunk+rank) 瀏覽器only  TS       建於 Playwright
browser-use DOM/截圖/混合    瀏覽器only  Python   autonomous agent
```

- **vs Stagehand**(Browserbase 出品,也就是 [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills) 背後團隊):Stagehand 解析 DOM 做定位、建在 Playwright 上,對動作目標精準度通常比純視覺穩,但**只限瀏覽器**。Midscene 的差異化是純視覺 + 真跨平台(行動/桌面)+ JS。(此為二手來源整理)
- **vs browser-use**:Python、autonomous agent loop、每步重推理、瀏覽器限定,偏「給 agent 自己上網」;Midscene 偏「可寫成腳本/測試」的 SDK 取向。

一句話:Midscene 的賣點是 **vision-first + 真跨平台 + 完整 JS 工具鏈(報告/快取/MCP/Skills)**,代價是每步較慢、token 較貴。想看更廣的瀏覽器 agent 戰局,可參考站內的 [三家 AI Agent 在 Chrome 的路線比較](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini) 與 [OpenClaw 的瀏覽器控制](/posts/ai/2026-03-28-openclaw-tools-browser-search)。

## 適合與不適合,以及限制

**適合**:跨 Web / 行動 / 桌面的端到端流程、Canvas/WebGL 等非標準 DOM 介面、想用自然語言寫 RPA 或測試、想自架開源 VLM。

**不適合**:對單步延遲與 token 成本極敏感、頁面 DOM 穩定且定位精度要求極高(這時 DOM-first 的 Stagehand/Playwright 更省更穩)、需要完全離線零模型呼叫。

**已知限制**:純視覺對模型本身要求高、執行期資源消耗大於 a11y-tree 方案;定位漂移是文件記載的常見問題(緩解靠換更大模型、設對 `MIDSCENE_MODEL_FAMILY`、`deepLocate`、把 Web DPR 調到 2);快取對 DOM 變動脆弱。還有一條安全提醒值得記住——它的 Skills README 警告 AI 自動化「可能產生不可預期的結果,因為它能控制螢幕上的一切」。

## 整體來說

Midscene 用「純視覺 + 跨平台 + 完整開發者工具鏈」換取通用性與抗結構變動,代價是每步的延遲、token 成本,以及對 VLM 定位能力的依賴。它把「自動化能不能跑」這件事,從「DOM 結構穩不穩」轉移到「模型看不看得準」——這是它最大的賭注,也是最大的風險。如果你的需求是跨平台、或要操作非標準 DOM 的介面,它幾乎沒有同類對手;但若只是穩定瀏覽器頁面的測試,DOM-first 方案目前仍更省更穩。在 VLM 定位能力快速進步的當下,這個賭注的賠率正在變好。

## 參考資料

- [Midscene.js 官網](https://midscenejs.com/)
- [web-infra-dev/midscene (GitHub)](https://github.com/web-infra-dev/midscene)
- [Midscene Introduction 文件](https://midscenejs.com/introduction)
- [Model Strategy 文件](https://midscenejs.com/model-strategy)
- [Caching 文件](https://midscenejs.com/caching)
- [MCP 文件](https://midscenejs.com/mcp)
- [Skills 文件](https://midscenejs.com/skills)
- [Bridge Mode 文件](https://midscenejs.com/bridge-mode)
- [web-infra-dev/midscene-skills (GitHub)](https://github.com/web-infra-dev/midscene-skills)
- [UI-TARS (GitHub)](https://github.com/bytedance/ui-tars)
- [Stagehand (GitHub)](https://github.com/browserbase/stagehand)
- [browser-use (GitHub)](https://github.com/browser-use/browser-use)
