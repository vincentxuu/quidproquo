---
title: "Midscene.js：押注純視覺的跨平台 UI 自動化框架"
date: 2026-05-23
updated: 2026-08-19
category: ai
type: deep-dive
tags: [midscene, ui-automation, vision-language-model, mcp, agent, bytedance]
lang: zh-TW
tldr: "字節跳動開源(MIT)的 UI 自動化框架。UI 動作只靠截圖餵給視覺語言模型,不解析 DOM;一套 JS API 跨 Web / Android / iOS / 桌面。代價是每步較慢、token 較貴,而且高度綁在模型的 grounding 能力上。注意它已在 1.9.8 之後停掉 MCP,改走 Skills + CLI。"
description: "深入介紹 Midscene.js:純視覺 UI 自動化的設計取捨、三類 API 與兩種自動化風格、多模型策略、快取機制、從 MCP 轉向 Skills 的生態變動,以及與 Stagehand、browser-use 的差異。"
draft: false
series:
  name: "瀏覽器自動化與 MCP"
  order: 5
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

[Midscene.js](https://midscenejs.com/) 是字節跳動 Web Infra 團隊開源(MIT)的 UI 自動化框架。它的賭注很單純:**UI 動作只看螢幕截圖,不解析 DOM**——你用自然語言描述目標,視覺語言模型(VLM)看著畫面決定點哪裡。這篇拆解它的核心取捨、API 設計、模型策略與生態工具,以及它跟 Stagehand、browser-use 這些 DOM 取向方案的差異,幫你判斷什麼情境該用它。

## 核心概念:把「怎麼點」換成「要達成什麼」

傳統 UI 自動化(Selenium、Playwright)綁在 DOM selector 或 XPath 上,前端一改 class name 或結構,腳本就壞。Midscene 把這層完全拿掉。官方 README 的說法很直接:

> Midscene is all-in on pure vision for UI actions: element localization is based on screenshots only.

也就是元素定位與互動「只靠截圖」。你寫的不再是「找到 `#login-btn` 然後 click」,而是「點登入按鈕」,剩下交給模型的 grounding 能力。這個設計換來三件事:

- **跨平台通用**:同一套 JS API 跑在 Web、Android、iOS、HarmonyOS、桌面,連 `<canvas>`、WebGL 這種 DOM 抓不到內容的介面也能操作——因為對它來說一切都是像素。
- **抗結構變動**:畫面長相沒變,前端怎麼重構都不影響。
- **token 成本不隨頁面複雜度膨脹**:官方 model-strategy 文件的說法是,token 消耗只取決於頁面解析度與任務複雜度,不會隨著 DOM 節點數量增加而膨脹。要做資料抽取(`aiQuery` / `aiAsk`)時,才選擇性地把 DOM 帶回來。

## 關鍵設計決定:動作階段只剩純視覺

Midscene 不是「支援純視覺」,而是在動作與定位這一段「只剩純視覺」——官方文件明講 UI 動作與元素定位不依賴 DOM 資料或額外標註。早期版本還有 DOM 抽取的相容模式幫忙定位,後來被拿掉了(僅限「動作/定位」;資料抽取與頁面理解仍可 opt-in 帶 DOM)。

這是一個有立場的取捨:**犧牲 DOM 帶來的精準定位,換跨平台一致性與抗變動性**。官方自己也把限制寫出來了:純視覺定位「需要具備視覺理解能力的模型——只有經過認定、在 GUI 操作上穩定的模型能用,不是隨便一個 LLM 都行」。它接受了更高的模型門檻,換跨平台一致性與較低的 UI 維護成本。

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

純視覺每步都要呼叫模型,所以 Midscene 提供快取——**但預設是關閉的**,要在建立 agent 時給 `cache` 選項才會啟用(還分 read-write / read-only / write-only 三種策略)。依官方 caching 文件,它快取**兩種東西**:AI 的 planning 步驟,以及元素定位的 XPath(僅 Web)。`aiQuery` / `aiBoolean` / `aiAssert` 的查詢結果**不快取**。命中時官方範例顯示一段腳本從 51 秒降到 28 秒。

但快取很脆:XPath 處的文字或 DOM 結構一變就 miss、回退 AI;Canvas、跨域 iframe、closed Shadow DOM 也用不了。文件自己講得很白——這「不是用來保證腳本長期穩定的工具」。換句話說,快取是加速器,不是 flaky 問題的解藥。

## 模型策略:多模型分工,型號本身別記死

Midscene 的成敗高度取決於 VLM 的 grounding 能力,而且它明確要求「在 GUI 操作上穩定」的多模態模型,不是任何 LLM 都能塞進來。**具體支援哪幾個型號變動很快,請直接看官方的 [Model Strategy 文件](https://midscenejs.com/model-strategy)與支援模型清單**——README 上的名單這一年已經換過好幾輪,包含可自架的開放權重選項。

比型號更穩定、也更值得記的是它的**多模型分工**架構:

| 角色 | 負責什麼 |
|---|---|
| Default model | 基礎:元素定位(Locate),以及沒有指派出去的工作 |
| Planning model | 強化複雜目標、多步驟、有分支的任務規劃 |
| Insight model | 強化資料抽取、斷言與頁面理解 |

背後承認的事實是:沒有單一模型在所有子任務都最好。但官方也提醒,多掛模型會增加延遲與 token 用量,建議**先只用 Default model,遇到明確的能力瓶頸再加**。

另一個實務上的坑:`MIDSCENE_MODEL_FAMILY` 這個環境變數要設對——它告訴 Midscene 該用哪一套 prompt 與座標處理慣例,設錯會讓元素定位明顯漂移。

## 生態:從 MCP 轉向 Skills,與三種瀏覽器模式

Midscene 不只是 SDK,還把自己接進 agent 生態:

- **MCP 已經退場**。這是這一年最大的變動:官方文件現在的標題就是「MCP integration has been retired」——Midscene 不再提供 MCP server,`@midscene/mcp`、`@midscene/web-bridge-mcp`、`@midscene/android-mcp`、`@midscene/ios-mcp`、`@midscene/harmony-mcp`、`@midscene/computer-mcp` 這些套件全部作廢,agent 設定裡要把它們拿掉。真的還需要 MCP 的話,只能把 Midscene 釘在 `1.9.8`——那是最後一個含 MCP 支援的版本。原本設 `MIDSCENE_MCP_CHROME_PATH` 的人要改成 `MIDSCENE_CHROME_PATH`(舊名暫時還吃)。
- **Midscene Skills 是現在的官方路線**:讓 AI coding 工具(Claude Code、Cline、OpenClaw)直接跑平台 CLI 來驅動自動化,agent 負責看截圖、決定下一步。安裝一行:`npx skills add web-infra-dev/midscene-skills`(Claude Code 加 `-a claude-code`、OpenClaw 加 `-a openclaw`)。涵蓋的平台是 Browser、Chrome Bridge、Desktop、Android、iOS、HarmonyOS,外加一個 Vitest + Midscene 的 E2E 測試 skill。

這個轉向本身值得注意:Midscene 給的理由跟微軟在 Playwright MCP README 裡講的是同一件事——**對 coding agent 來說,跑 CLI 比掛 MCP server 省 context**。同一個系列裡兩個獨立團隊做出同樣的判斷,不太可能是巧合。

Web 端有三種瀏覽器模式,官方 Skills 文件描述如下:

> Browser automation with three modes: default Puppeteer headless, `--bridge` to use your own Chrome, `--cdp <ws-endpoint>` to connect via CDP

其中 **Bridge Mode** 特別實用:透過 Chrome 擴充,讓本機 Node 腳本控制你**現有的桌面 Chrome**——沿用已登入的 cookie、外掛、登入態,適合「需要人在迴路裡」或要操作登入後頁面的場景。除錯則靠視覺化的 replay 報告、內建 Playground 與 Chrome 擴充功能,不用裸看 log。

## 跟 Stagehand、browser-use 怎麼選

同樣是「AI 操作介面」,路線差很多:

```
                定位方式        平台        語言      取向
Midscene    純視覺(截圖)   跨平台      JS/TS    SDK + 工具鏈
Stagehand   accessibility tree 瀏覽器only  TS/Py/Go  建於 Playwright
browser-use DOM/截圖/混合    瀏覽器only  Python   autonomous agent
```

- **vs Stagehand**(Browserbase 出品,也就是 [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills) 背後團隊):Stagehand 走的是 [hybrid accessibility tree trimming](https://github.com/browserbase/stagehand) 而不是純截圖、建在 Playwright 上,對動作目標精準度通常比純視覺穩,但**只限瀏覽器**;語言上它現在同時提供 TypeScript、Python 與 Go SDK,不再只有 TS。Midscene 的差異化是純視覺 + 真跨平台(行動/桌面)。
- **vs browser-use**:Python、autonomous agent loop、每步重推理、瀏覽器限定,偏「給 agent 自己上網」;Midscene 偏「可寫成腳本/測試」的 SDK 取向。

一句話:Midscene 的賣點是 **vision-first + 真跨平台 + 完整 JS 工具鏈(報告/快取/Skills)**,代價是每步較慢、token 較貴。想看更廣的瀏覽器 agent 戰局,可參考站內的 [三家 AI Agent 在 Chrome 的路線比較](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini) 與 [OpenClaw 的瀏覽器控制](/posts/ai/2026-03-28-openclaw-tools-browser-search)。

## 適合與不適合,以及限制

**適合**:跨 Web / 行動 / 桌面的端到端流程、Canvas/WebGL 等非標準 DOM 介面、想用自然語言寫 RPA 或測試、想自架開源 VLM。

**不適合**:對單步延遲與 token 成本極敏感、頁面 DOM 穩定且定位精度要求極高(這時 DOM-first 的 Stagehand/Playwright 更省更穩)、需要完全離線零模型呼叫。

**已知限制**:純視覺對模型本身要求高、執行期資源消耗大於 a11y-tree 方案;定位漂移是文件記載的常見問題(緩解靠換定位能力更強的模型、設對 `MIDSCENE_MODEL_FAMILY`、對難定位的元素用 `deepLocate`);快取對 DOM 變動脆弱。還有一條安全提醒值得記住——它的 Skills README 警告 AI 自動化「可能產生不可預期的結果,因為它能控制螢幕上的一切」。

## 整體來說

Midscene 用「純視覺 + 跨平台 + 完整開發者工具鏈」換取通用性與抗結構變動,代價是每步的延遲、token 成本,以及對 VLM 定位能力的依賴。它把「自動化能不能跑」這件事,從「DOM 結構穩不穩」轉移到「模型看不看得準」——這是它最大的賭注,也是最大的風險。如果你的需求是跨平台、或要操作非標準 DOM 的介面,它幾乎沒有同類對手;但若只是穩定瀏覽器頁面的測試,DOM-first 方案目前仍更省更穩。在 VLM 定位能力快速進步的當下,這個賭注的賠率正在變好。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「瀏覽器自動化與 MCP」系列

## 參考資料

- [Midscene.js 官網](https://midscenejs.com/)
- [web-infra-dev/midscene (GitHub)](https://github.com/web-infra-dev/midscene)
- [Midscene Introduction 文件](https://midscenejs.com/introduction)
- [Model Strategy 文件](https://midscenejs.com/model-strategy)
- [Caching 文件](https://midscenejs.com/caching)
- [MCP 退場公告](https://midscenejs.com/mcp)
- [Skills 文件](https://midscenejs.com/skills)
- [Bridge Mode 文件](https://midscenejs.com/bridge-mode)
- [web-infra-dev/midscene-skills (GitHub)](https://github.com/web-infra-dev/midscene-skills)
- [UI-TARS (GitHub)](https://github.com/bytedance/ui-tars)
- [Stagehand (GitHub)](https://github.com/browserbase/stagehand)
- [browser-use (GitHub)](https://github.com/browser-use/browser-use)
