---
title: "工具推薦｜catscan — 用 Apple Vision 秒讀截圖文字，抓 61 個語言的截斷、重疊、未翻譯"
date: 2026-11-27
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "catscan 是在 Mac 上用 Apple Vision 做 OCR 的 CLI／MCP server，檢查 app 截圖與錄影裡的文字截斷、重疊、未翻譯與格式錯誤，讓 agent 讀幾十個 token 的結論而不必打開圖片"
tldr: "catscan 是一個 CLI 加 MCP server，用 Apple Vision 在本機 OCR 截圖，檢查文字截斷、重疊、未翻譯、格式錯誤等 61 個語言的 UI 文字 bug。安裝：npm install --save-dev @catscan/cli。解決了 agent 要花大量 token 打開截圖才能判斷畫面對不對的問題。"
series:
  name: "AI Tool of the Day"
  order: 91
---

> :globe: [English version](/posts/daily/2026-11-27-tool-catscan-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | catscan |
| 類型 | CLI／MCP server／Playwright matcher |
| GitHub | [gatalifeltd/catscan](https://github.com/gatalifeltd/catscan) |
| Stars | 2（2026-11-27 查核時數字，前一天才發佈） |
| 語言 | JavaScript（CLI）＋ Apple Vision framework |
| 授權 | Apache-2.0 |
| 安裝 | `npm install --save-dev @catscan/cli` |

## 解決什麼問題

你的 UI 測試早就在每個畫面存截圖，但有沒有文字被切掉、兩層字疊在一起、某個語言的翻譯忘了填、價格格式跑掉——這些事沒人力一張張盯著看。讓 agent 自己打開每張截圖判斷更貴：多模態模型看一張圖要花掉動輒上千 token，跑一次要一到十幾秒，而且判斷結果這次跟下次不一定一樣。

catscan 把「看截圖」這件事換成「讀截圖」。它用 Apple 的 Vision framework 在 Neural Engine 上做 OCR，一張圖大約 25 毫秒、完全在本機跑、不用錢。讀到的文字拿去跟你的字串 catalog（JSON、`.strings`、`strings.xml` 都支援）、目前的 locale、UI 測試丟出來的 element box 核對，直接吐出 `PASS`／`FAIL` 加上精確到哪個 key、哪一行、哪個座標的原因，而不是一張圖。Vision 讀不動的語言（希臘文、希伯來文等 22 種）會退到 Tesseract；兩層都讀不出來或判斷不了，才交給 agent 自己的模型開圖看——所以每個結果都會附一句「這次是哪個 reader 讀的」。

適合場景：app 或遊戲要撐多國語言的團隊，用 Playwright／Maestro／XCUITest／UIAutomator 跑完 UI 測試後想自動抓 l10n 和排版 bug；或者單純想讓 coding agent 改完畫面後自己驗一次有沒有壞掉，卻不想每次都把截圖整張塞進 context。

```diagram
title: catscan 判斷截圖文字的讀取順序
desc: catscan 先用 Vision 讀截圖，讀不到才換 Tesseract，兩者都讀不到或判斷不了，才交給 agent 自己的模型看。
caption: 依官方 README「When catscan cannot decide」簡化；實際還有 needs-reader（exit code 3）等細節未畫出。
---
<svg viewBox="0 0 640 568">
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 124V156" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M376 200H496Q504 200 504 208V280" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M280 244V276" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 340V372" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M376 416H496Q504 416 504 408V336" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--warn" d="M280 460V492" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>

  <rect class="dg-box" x="184" y="60" width="192" height="64" rx="6"/>
  <text class="dg-label" x="280" y="83" text-anchor="middle" dominant-baseline="central">Vision 讀取</text>
  <text class="dg-sub" x="280" y="103" text-anchor="middle" dominant-baseline="central">蘋果內建・本機免費</text>

  <path class="dg-box" d="M280 156L376 200L280 244L184 200Z"/>
  <text class="dg-label" x="280" y="190" text-anchor="middle" dominant-baseline="central">讀到文字了？</text>
  <text class="dg-sub" x="280" y="212" text-anchor="middle" dominant-baseline="central">Vision・多數語言</text>

  <rect class="dg-box dg-box--accent" x="432" y="284" width="180" height="48" rx="6"/>
  <text class="dg-label" x="522" y="308" text-anchor="middle" dominant-baseline="central">回傳 PASS／FAIL</text>

  <rect class="dg-box" x="184" y="276" width="192" height="64" rx="6"/>
  <text class="dg-label" x="280" y="299" text-anchor="middle" dominant-baseline="central">Tesseract 讀取</text>
  <text class="dg-sub" x="280" y="319" text-anchor="middle" dominant-baseline="central">22 種語言的備援</text>

  <path class="dg-box" d="M280 372L376 416L280 460L184 416Z"/>
  <text class="dg-label" x="280" y="406" text-anchor="middle" dominant-baseline="central">讀到文字了？</text>
  <text class="dg-sub" x="280" y="428" text-anchor="middle" dominant-baseline="central">Tesseract・備援</text>

  <rect class="dg-box dg-box--warn" x="184" y="492" width="192" height="64" rx="6"/>
  <text class="dg-label" x="280" y="515" text-anchor="middle" dominant-baseline="central">交給 Agent 自己的模型</text>
  <text class="dg-sub" x="280" y="535" text-anchor="middle" dominant-baseline="central">開圖自己判斷</text>

  <text class="dg-edge" x="436" y="188" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="290" y="260" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge" x="436" y="404" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge dg-text--warn" x="290" y="476" text-anchor="start" dominant-baseline="central">否</text>
</svg>
```

## 快速上手

### 安裝

```bash
npm install --save-dev @catscan/cli   # 需要 Apple Silicon Mac、macOS 15+、Node 22+
npx catscan doctor                    # 確認 Vision／Tesseract 可用，少什麼它會說
```

### 基本用法

```bash
# 讀一張截圖，看它認出了什麼文字
npx catscan read ~/Desktop/Screenshot.png

# 檢查某個字串有沒有出現在畫面上
npx catscan check ~/Desktop/Screenshot.png --present "Sign in"

# 批量檢查一個語言資料夾：抓未翻譯、原始 key、沒填的 {placeholder}
npx catscan untranslated shots/de --locale de --base locales/en.json --catalog locales/de.json

# 抓文字被截斷或被元素蓋住，並產生一頁 HTML 報告
npx catscan truncated shots/de --locale de --boxes shots/de --report catscan-report.html
```

### 進階用法（選填）

```bash
# 讓 coding agent 直接問 catscan，而不是打開截圖自己看
claude mcp add catscan -- npx @catscan/mcp
```

```ts
// Playwright 裡直接斷言畫面文字（@catscan/playwright）
await expect(page).toShowText("結帳");
await expect(page).toHaveNoTruncation();
await expect(page).toHaveNoUntranslated();
```

## 與現有工具的比較

| | catscan | 人工目測截圖 | 讓 agent 的多模態模型直接開圖判斷 |
|---|---|---|---|
| 本機執行、截圖不出網 | ✓ | ✓ | 視 agent／模型而定 |
| 單次判斷的 token 成本 | 幾十個 token 的 PASS/FAIL | — | 整張圖，官方量到的是 catscan 的 36 倍 |
| 可接進 CI 擋 commit | ✓（exit code／JUnit／SARIF／GitHub annotations） | ✗ | 需要自己另外接 |
| 支援語言數 | 61 個 locale、38 個 Vision 讀＋23 個 Tesseract 備援 | 看審核者會的語言 | 沒有公開的精準度數字 |
| 單張耗時（官方量測） | Vision 約 25ms、Tesseract 約 105ms | 數十秒到數分鐘 | 1.3–15 秒（依模型） |

## 注意事項

- **只能跑在 Apple Silicon Mac**：macOS 15 以上、Node 22 以上，Vision framework 是 macOS 專屬。CI 要接進流程得找一台 Apple silicon 的 Mac runner（README 列了 GitHub Actions 等方案），Windows/Linux 本機完全跑不起來。
- **README 裡的精準度數字是官方自己量的**：「reproducible」那組是用 Core Text 畫出的合成圖，誰都能重跑驗證；但「study」那組（真實截圖的量測）是私有、無法重現的資料，只能參考數字本身，拿來判斷要不要導入之前，建議先用自己專案的真實截圖量一次。
- 作者公司（gatalife）同時賣客製 QA／l10n 顧問服務，README 末段的商業服務連結是推廣，跟工具本身的開源部分分開看。
- 剛在 2026-11-26 發佈，GitHub 目前只有 2 顆星、0 個 issue，還沒有外部使用者回報過坑——算是今天介紹裡最新、最沒被驗證過的一個，謹慎評估再導入正式流程。

## 今日收穫

把「給 agent 看東西」從「整張截圖丟進 context 讓多模態模型自己看」換成「本機先用專門的 reader 讀出一句 PASS/FAIL，附上精確到座標的理由」，省下的不只是 token，更是把一個原本不確定的判斷變成決定性、可重播的結果——這跟昨天介紹的 Bernstein 把排程器寫成不碰 LLM 的純 Python是同一種設計賭注：能用傳統程式判斷清楚的事就留給傳統程式，真正讀不懂的才讓模型出場。

## 參考資料

- [gatalifeltd/catscan — GitHub](https://github.com/gatalifeltd/catscan)
- [gatalifeltd/catscan — README](https://github.com/gatalifeltd/catscan/blob/main/README.md)
- [@catscan/cli — npm](https://www.npmjs.com/package/@catscan/cli)
- [catscan — Benchmarks](https://github.com/gatalifeltd/catscan/blob/main/docs/BENCHMARKS.md)
