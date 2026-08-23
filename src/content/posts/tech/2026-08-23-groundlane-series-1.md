---
title: "Groundlane 實戰系列（篇 1）：為什麼 AI 代理需要一個受控的網路存取層"
date: 2026-08-23
category: tech
type: deep-dive
tags: [groundlane, mcp, web-search, web-fetch, web-extract, ai-agent, cloudflare-workers, web-scraping, safe-retrieval]
lang: zh-TW
tldr: "Groundlane 是一個開源 TypeScript 遠端 MCP 伺服器（v0.1.0），以單一穩定合約為 AI 代理提供 web_search、web_fetch、web_extract 三種能力，並把身份驗證、提供者替換與資源限制留在操作者邊界內。"
description: "從 Groundlane 的產品定位（為什麼需要受控的網路存取層）、三工具合約、十個搜尋適配器、雙認證機制與 Cloudflare 部署，建立實戰系列的共同基線。"
draft: false
glossary:
  - term: "groundlane"
    definition: "開源 TypeScript 遠端 MCP 伺服器（v0.1.0 早期預覽），提供 web_search、web_fetch、web_extract 三種受控網路存取能力，身份與提供者替換邊界明確。"
  - term: "ssrf"
    definition: "Server-Side Request Forgery；Groundlane 將 URL、重導向、DNS 與瀏覽器子資源視為不可信輸入，以降低此風險。"
---
> 🌏 [English version](/posts/tech/2026-08-23-groundlane-series-1-en)

## 什麼是 Groundlane（依據 repo 自述，而非推論）

Repo 自述把 Groundlane 定義為「open-source remote MCP server」，提供「safe, provider-agnostic web search, retrieval, and deterministic extraction」。目前已實作的範圍（同樣來自自述與文件目錄，而非推測）：

- 三個遠端 MCP 工具：`web_search`、`web_fetch`、`web_extract`。
- 十個搜尋適配器：Tavily、Exa、Parallel、Browserbase、Brave、Firecrawl、SerpApi、Linkup、Serper、You.com。
- 自託管的 Reader（以 Mozilla Readability 為基礎，加上本機備援），可在不啟用瀏覽器時輸出 Markdown / text / HTML。
- 可選的託管後備：Jina Reader（讀取）、Browserless（瀏覽器渲染），僅在操作者明確啟用時才被呼叫。
- 部署目標為 Cloudflare Worker + Container，並提供 Docker 單機模式與本機 Node 模式。
- 認證採雙秘密機制：`GROUNDLANE_AUTH_TOKEN`（無頭 / CLI 客戶端的 Bearer token）與 `OAUTH_OWNER_PASSPHRASE`（互動式雲端連接器的同意畫面閘門），兩者必須不同，且各自至少 32 個隨機字元。

值得強調：`0.1.0` 自述明確標註為「early preview；no stable tool-contract guarantee yet」。這篇與整個系列的技術描述，應理解為「對目前可觀察原始碼與文件的記錄」，而非對未來穩定版的承諾。

## 三工具的責任分工（不互相取代）

這三個工具的邊界可以從合約層直接讀出，不需要推論：

| 工具 | 主要輸入 | 主要輸出 | 決定性來源 |
| --- | --- | --- | --- |
| `web_search` | 查詢字串、可選提供者、可選時間範圍 | 正規化結果列表，含各提供者的原始排名與合併後的 RRF 排名、來源 URL、重複去除證據 | 提供者適配器 + 本機合併邏輯 |
| `web_fetch` | URL、格式（markdown / text / html）、渲染策略（auto / never / always） | 正規化內容、`finalUrl`、`engine`、`backend`、`truncated` | 本機 HTTP + Readability；僅在啟用時才呼叫 Jina / Browserless |
| `web_extract` | URL + CSS selector 結構（非 LLM 隱式推論） | 結構化 JSON，對應 selector 的節點值或屬性 | 確定性 DOM 擷取，無隱式模型步驟 |

三者的關鍵差異在於「不需要搜尋提供者金鑰」的能力：`web_fetch` 與 `web_extract` 可以在沒有任何搜尋提供者金鑰的情況下運作，因為它們依賴的是可直接存取的 URL 與本機正規化，而非搜尋引擎結果。這對站內應用（例如文章參考資料驗證、每日 digest 資料收集）特別重要：只要有目標 URL，就能執行取頁與擷取，不必為每個任務開啟搜尋提供者帳戶。

## 為什麼要「遠端 MCP」而非本機腳本

傳統做法通常把網路存取直接寫進代理流程：一個腳本呼叫 `requests.get` 或 `WebFetch`，再把內容交給模型。這種做法在小規模實驗可行，但在可重現、可審計、可替換提供者的場景下會暴露幾個風險：

- **提供者鎖定**：每更換一個搜尋或取頁來源，就要重寫解析與錯誤處理邏輯。
- **身份與資源邊界模糊**：URL、重導向、DNS 回答、瀏覽器子資源全被視為可信輸入，容易讓 SSRF 風險從代理端擴散到提供者端。
- **確定性不足**：若抽取依賴隱式模型推論（例如「請從這頁找出標題」），結果無法逐行解釋，也無法在不同提供者間重現。

Groundlane 的設計回應這些風險的方式，不是「替你解決所有安全問題」，而是把邊界明確化：認證在邊界、提供者可替換、抽取以 CSS selector 為確定性來源、預設限制（URL 政策、DNS / 重導向檢查、單一期限、位元組與輸出上限、併發限制）保留在伺服器端。這讓代理端只需要知道「呼叫哪個 MCP 工具、帶什麼參數」，而不需要管理每個提供者的認證與解析差異。

## 部署與認證的實際步驟（依據文件，而非假設）

本機啟動的最小步驟（來自 Quick start 與文件結構）：

```bash
git clone https://github.com/vincentxuu/groundlane.git
cd groundlane
pnpm install
pnpm exec playwright install chromium
cp .env.example .env
# 設定長隨機 GROUNDLANE_AUTH_TOKEN
pnpm dev
```

啟動後，伺服器在 `http://localhost:8080/mcp` 提供 Streamable HTTP MCP 端點。搜尋提供者金鑰為選用：若不啟用任何提供者，`web_search` 不可用，但 `web_fetch` 與 `web_extract` 仍可運作（只要有可直接存取的 URL）。

Cloudflare 部署則需要兩個不同的秘密（文件明確要求不可重複）：

- `GROUNDLANE_AUTH_TOKEN`：無頭 / CLI 客戶端的 Bearer token。
- `OAUTH_OWNER_PASSPHRASE`：互動式雲端連接器（如 claude.ai、ChatGPT）的同意畫面閘門。

這兩者的分離不是形式要求，而是安全設計：若同意畫面被釣魚，攻擊者取得的 `OAUTH_OWNER_PASSPHRASE` 與無頭客戶端使用的 `GROUNDLANE_AUTH_TOKEN` 仍為不同憑證，無法直接重複使用於所有客戶端。

## 本篇的可驗證輸出與限制

這篇文章的所有技術描述，均可追溯至以下可驗證來源（而非作者記憶或推測）：

- `github.com/vincentxuu/groundlane` 的 README 與 `docs/` 目錄（透過 `curl` 與原始碼檢查取得內容，而非依賴訓練知識）。
- `.claude/skills/` 內的 `groundlane` 技能，已提到 `mcp__groundlane__*` 工具路由，與本篇描述的三工具一致。
- 本篇未引入任何未在 repo 中出現的功能（例如「自動爬取」或「緩存感知路由」），這些在自述中被列為「Next」，而非已實作功能。

同時，本篇明確標註版本為 `0.1.0` 早期預覽，並在適當位置重申：任何對未來穩定版的預期，應以官方文件更新為準，而非以本系列為承諾。

## 系列接下來的四篇方向

為了讓讀者在閱讀系列時有清晰的預期，以下簡要列出後續四篇的範圍（不包含實際內容，只作為路線圖）：

1. **篇 2：MCP 工具實戰** — 以實際 `web_search` / `web_fetch` / `web_extract` 呼叫為主，涵蓋參數選擇（提供者、格式、渲染策略）、回傳結構解讀、與錯誤處理模式。
2. **篇 3：與傳統方案對比** — 對比本機 `WebFetch`、`stealth_fetch`、`puppeteer` 與傳統 `requests` 流程，從確定性、可替換性、身份邊界與維運成本四個維度比較。
3. **篇 4：在 quidproquo 站內應用** — 以站內現有 MCP 工具（`mcp__groundlane__*`）為事實依據，說明如何把 `web_fetch` 與 `web_extract` 整合進文章參考資料驗證、每日 digest 資料收集流程，而不引入假設的新功能。
4. **篇 5：踩坑與最佳實踐** — 針對 `timeout`、`selector`、`render` 模式、錯誤處理、版本變動風險與安全邊界，整理可重現的操作建議與限制說明。

系列的共同原則：所有技術描述以可驗證的原始碼與文件為依據；所有站內應用以現有技能與流程為事實；所有對未來功能的提及，明確標註為「尚未實作」或「預覽階段可能變動」。

## 參考資料

- [Groundlane GitHub 原始碼（v0.1.0）](https://github.com/vincentxuu/groundlane)
- [Groundlane 產品說明與文件](https://github.com/vincentxuu/groundlane)（自述內容，含三工具、十適配器、部署步驟、雙認證機制）
- [.claude/skills/groundlane 技能（站內 MCP 工具路由）](.claude/skills/)
- [Groundlane 安全說明（SECURITY.md）](https://github.com/vincentxuu/groundlane/blob/main/SECURITY.md)（SSRF 風險、私有漏洞回報流程）
