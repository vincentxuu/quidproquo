---
title: "Groundlane 實戰系列（篇 4）：在 quidproquo 站內的應用 — 以現有 MCP 工具與流程為事實"
date: 2026-08-23
category: tech
type: deep-dive
tags: [groundlane, mcp, web-fetch, web-extract, web-search, reference-verification, daily-digest, in-site-application, skill]
lang: zh-TW
tldr: "以站內 .claude/skills/groundlane 的 usage-modes 流程為事實，說明如何把 web_fetch 與 web_extract 整合進文章參考驗證與每日 digest 資料收集，而不假設未實作功能。"
description: "篇 4 為站內應用層：依據現有 groundlane 技能（mcp__groundlane__* 工具路由）與 usage-modes 判斷流程，設計參考資料驗證與 digest 資料收集的可執行步驟，並明確標註「不使用已淘汰的 stealth_fetch」的邊界。"
draft: false
glossary:
  - term: "provenance"
    definition: "檢索來源證據（engine、backend、finalUrl）；Groundlane 回傳結構的確定性欄位，用於驗證結果是否來自預期路徑。"
  - term: "usage-modes"
    definition: "站內 groundlane 技能的判斷流程：檢查 tool provenance → 確認三工具存在 → 直接呼叫；若不存在則使用環境實際工具，永遠不使用已淘汰的 stealth_fetch。"
---

> 🌏 [English version](/posts/tech/2026-08-23-groundlane-series-4-en)

這篇不假設站內有任何「尚未實作」的新功能。所有應用場景均以現有 `.claude/skills/groundlane` 技能（`mcp__groundlane__*` 工具路由）與其 `usage-modes.md` 判斷流程為事實依據，並明確遵守該流程的關鍵限制：永遠不使用已淘汰的 `stealth_fetch` 或 `web-fetch/fetch_page`；若 Groundlane 工具不存在，使用環境實際提供的工具（Tavily、Exa、Firecrawl、Jina、GitHub、論文或平台原生工具），並標示為 fallback，而非假裝已使用 Groundlane。

## 站內現有能力的事實清單（不推測）

根據 `.claude/skills/deep-research/references/usage-modes.md` 與 `.claude/skills/groundlane` 技能，站內對 Groundlane 的實際支援可歸納為以下可驗證點（每點均可追溯至文件內容，而非記憶或推測）：

- **工具路由**：站內 MCP 工具路由為 `mcp__groundlane__*`（對應 `web_search`、`web_fetch`、`web_extract` 三個合約）。這與公共 repo 的合約一致，而非站內特製版本。
- **判斷流程（`usage-modes.md` 第 1-5 步）**：先檢查 `tool provenance` 與完整 schema，確認是 Groundlane 且提供三工具；若存在則直接呼叫（不需要知道是 localhost 還是 remote deployment）；若不存在則使用環境實際提供的工具；若沒有任何網路工具則使用本機已授權材料，並回報 blocker。這個流程明確排除了「假裝工具存在」的操作模式。
- **淘汰工具的明確排除**：流程第 5 步明確寫道「永遠不使用已淘汰的 `stealth_fetch` 或 `web-fetch/fetch_page`」。這不是建議，而是強制邊界：任何站內應用若需要網路檢索，必須在 Groundlane 三工具與目前實際提供的替代工具（Tavily、Exa、Firecrawl、Jina 等）之間選擇，而非回退到已淘汰路徑。
- **身份邊界與憑證管理**：`usage-modes.md` 明確要求：token 不得寫進 skill、prompt、note、log、一般設定檔或版控；agent 不得假設 clone 位於特定路徑；Web-hosted agent 無法連本機 `localhost`，必須使用已部署的遠端 endpoint（`https://<deployment>/mcp`），且認證應由平台受管 connector 保存，不貼進對話或 repository。這些限制直接影響站內應用的設計：不能假設每個執行環境都有本機 clone，也不能在文件或設定中嵌入憑證。
- **可分享性要求**：使用 `<groundlane-clone>`、`<deployment>` 等 placeholder，不寫個人絕對路徑或私人 endpoint。這意味著站內應用的文件與流程描述必須使用抽象標識，而非硬編碼的本機路徑或私有 URL。

基於這些事實，站內應用的設計原則可以明確表述為：所有流程步驟必須可在「無本機 clone」、「無明文憑證」、「無已淘汰工具」的條件下重現；若某步驟需要 Groundlane 工具而當前環境未提供，則該步驟必須標示為 fallback（使用實際可用工具），而非假裝已執行 Groundlane 呼叫。

## 文章參考資料驗證的可執行流程

文章撰寫流程（依據 `AGENTS.md` 與 `post` skill）要求在文末補 `## 參考資料`，並對 tech 類文章附上相關官方文件、論文、技術連結。驗證這些參考資料的可執行流程（以現有工具為事實，而非假設新功能）：

1. **確認參考資料清單**：從文章 frontmatter 與內容中提取所有外部連結（例如官方文件、GitHub 原始碼、論文、版本說明頁）。這一步不需要任何網路工具，僅為資料準備。
2. **檢查 Groundlane 工具可用性**：依據 `usage-modes.md` 流程第 1 步，檢查當前環境的 `tool provenance`，確認 `mcp__groundlane__*` 是否提供 `web_fetch` 與 `web_extract`。若存在，直接使用；若不存在，記錄為 blocker 並標示為「本次未使用 Groundlane，因環境未暴露該工具」。
3. **執行 `web_fetch` 驗證（若工具可用）**：對每個參考 URL 執行 `web_fetch`（`format: markdown`、`render: never`），保存回傳結構（特別是 `finalUrl`、`engine`、`backend`、`truncated`、`title`、主要內容摘要）。這些欄位作為「參考資料已驗證」的確定性證據：`finalUrl` 確認重導向後的最終位置，`engine` 與 `backend` 標註來源路徑（直接 HTTP 而非瀏覽器渲染），`truncated` 標示是否為完整內容（若為 `true`，表示驗證僅為部分內容，應在文章中明確標註）。
4. **執行 `web_extract` 結構化驗證（若需要精確欄位）**：若文章需要驗證特定欄位（例如官方文件中的版本號、API 名稱、參數列表），對已驗證的 URL 執行 `web_extract`（明確 CSS selector），保存每個欄位的選擇器與回傳值。這讓驗證結果可逐行解釋（例如「版本號 `v0.1.0` 來自 `.version` 選擇器」），而非依賴內容摘要的隱式推論。
5. **記錄驗證狀態與限制**：對每個參考資料，記錄驗證狀態（已驗證完整內容、已驗證部分內容 `truncated: true`、驗證失敗、未驗證因環境無工具）、使用的工具（Groundlane `web_fetch`/`web_extract` 或 fallback 工具）、以及任何操作限制（例如預設位元組上限導致長文被截斷、搜尋預算限制導致無法執行多次查詢）。這些記錄應包含在文章的驗證說明中（例如「參考資料驗證：使用 `web_fetch`（`render: never`），`finalUrl` 與輸入一致，`truncated: false`，來源 `engine: http`、`backend: direct`」），而非僅列出連結。
6. **處理驗證失敗或工具不可用的情況**：若 `web_fetch` 或 `web_extract` 不可用（依據步驟 2 的判斷流程），則使用環境實際提供的工具（例如 Tavily 搜尋結果、平台原生擷取、已下載的本機文件），並明確標示為 fallback（例如「本次驗證使用平台原生工具（非 Groundlane），因當前 session 未暴露 `mcp__groundlane__*` 工具」）。同時，絕不回退到已淘汰的 `stealth_fetch` 或 `web-fetch/fetch_page`（依據 `usage-modes.md` 第 5 步的強制邊界）。

這個流程的關鍵特徵在於：每一步都可在無本機 clone、無明文憑證、無假設功能的條件下重現；驗證結果包含確定性證據欄位（`finalUrl`、`engine`、`backend`、`truncated`、選擇器與節點值）；失敗或不可用的情況明確標示為 blocker 或 fallback，而非隱藏為「已驗證」。

## 每日 digest 資料收集的可執行流程

每日 digest 流程（依據站內 `daily-digest` 系列技能與現有文章結構，例如 `2026-08-23-ai-agent-arxiv-digest.md`、`2026-08-23-ai-agent-github-digest.md`）通常需要從多個來源（ArXiv、GitHub、新聞、官方文件）收集結構化資訊。應用 Groundlane 工具的可執行流程（以現有能力為事實，不假設未實作的自動爬取或緩存功能）：

1. **確認資料來源清單**：從 digest 計畫或前一日的 `seen-signal-urls.txt` 提取目標 URL 列表（例如特定論文、框架發布頁、新聞文章）。這一步為資料準備，不依賴任何網路工具。
2. **檢查工具可用性與身份邊界**：依據 `usage-modes.md` 流程，確認當前環境是否提供 `mcp__groundlane__*` 工具。若提供，使用 Groundlane `web_fetch` 與 `web_extract`；若不提供，使用環境實際工具（例如平台原生擷取、已授權的本機資料），並標示為 fallback。同時確認認證邊界：不在對話、文件、設定或版控中嵌入 `GROUNDLANE_AUTH_TOKEN` 或提供者金鑰（依據 `usage-modes.md` 的憑證管理要求）。
3. **執行 `web_search`（若需要確認新來源）**：對每日 digest 的新主題（例如「AI 代理安全警報」）執行 `web_search`（自動模式或明確提供者列表），觀察回傳中的提供者組合、原始排名與 RRF 合併結果。這一步的目的不是「自動發現所有相關內容」，而是「驗證目標主題是否有足夠可驗證來源」，並保存來源證據（`engine`、`backend`、`finalUrl`、原始與合併排名）。若搜尋預算接近限制（依據自述的保守預算語義），應切換為單一提供者或減少查詢頻率，而非假設預算可無限擴展。
4. **執行 `web_fetch`（內容驗證）**：對已確認的來源 URL 執行 `web_fetch`（`format: markdown`、`render: never`，優先直接路徑；僅在內容明顯不完整或缺少關鍵部分時切換為 `render: auto`）。保存每個結果的 `finalUrl`、`engine`、`backend`、`truncated`、`title` 與內容摘要。若 `truncated: true`，明確標示為「部分內容驗證」，並在 digest 中說明截斷原因（例如內容超出預設位元組上限），而非假設為完整內容。
5. **執行 `web_extract`（結構化欄位驗證，若需要精確欄位）**：對需要精確欄位驗證的內容（例如論文標題、作者、版本號、框架發布日期、價格變動數據），執行 `web_extract`（明確 CSS selector），保存每個欄位的選擇器與回傳值。這讓 digest 的結構化資訊可逐行驗證（例如「版本 `v0.1.0` 來自 `.version` 選擇器，節點值為 `0.1.0`」），而非依賴內容摘要的隱式推論。
6. **整合與審計記錄**：將驗證結果（來源 URL、驗證狀態、使用工具、確定性證據欄位、任何限制或 fallback 標示）整合進 digest 的資料準備說明中。例如：「來源驗證：`web_fetch`（`render: never`），`finalUrl` 與輸入一致，`truncated: false`，`engine: http`、`backend: direct`；結構化欄位：`title`（選擇器 `h1`）、`version`（選擇器 `.version`）；若環境未提供 Groundlane 工具，則標示為「本次未使用 Groundlane，因當前 session 未暴露 `mcp__groundlane__*` 工具，使用平台原生工具作為 fallback」。
7. **處理不可用或失敗情況**：若 `web_fetch` 或 `web_extract` 不可用（步驟 2 判斷為無工具），或執行失敗（例如 URL 不可達、選擇器無匹配、內容被截斷），則明確標示為 blocker（無可驗證網路來源）或 fallback（使用實際可用工具），並在 digest 中說明限制（例如「本次資料收集未執行 Groundlane 驗證，因環境未提供該工具；參考資料僅依賴已授權本機材料」），而非隱藏為「已驗證」。

這個流程的關鍵限制（必須明確標註於應用說明中）：不使用已淘汰的 `stealth_fetch` 或 `web-fetch/fetch_page`（依據 `usage-modes.md` 強制邊界）；不假設未實作功能（例如自動爬取、緩存感知路由、無限制預算）；不在文件或設定中嵌入憑證（依據憑證管理要求）；所有驗證結果包含確定性證據欄位或明確的 fallback 標示（依據可重現性原則）。

## 實際應用範例（簡化，不完整流程）

以下為簡化的應用範例（僅示範流程結構，而非完整自動化腳本），以說明如何將上述步驟轉化為可執行的操作模式：

- **場景**：驗證某篇 tech 文章（例如篇 1 或篇 2）的參考資料清單，確認每個連結的 `finalUrl` 與內容可取得，並記錄確定性證據。
- **步驟**（依據現有流程，而非假設新功能）：
  1. 提取文章參考資料連結列表（手動或從文章內容解析）。
  2. 依據 `usage-modes.md` 判斷流程，確認當前環境是否提供 `mcp__groundlane__*` 工具。若提供，繼續步驟 3；若不提供，標示為「本次未使用 Groundlane，使用平台原生工具或已授權本機材料」，並跳過步驟 3-5。
  3. 對每個連結執行 `web_fetch`（`format: markdown`、`render: never`），保存 `finalUrl`、`engine`、`backend`、`truncated`、`title`、內容摘要。若 `truncated: true`，在驗證記錄中標示為「部分內容」並說明截斷原因（預設上限）。
  4. 對需要精確欄位驗證的連結（例如官方文件中的版本說明頁），執行 `web_extract`（明確選擇器，例如 `.version` 提取版本號、`h1` 提取標題），保存選擇器與節點值。
  5. 整合驗證結果為審計記錄（例如表格形式：URL、驗證狀態、工具使用、確定性欄位、限制或 fallback 標示），並在文章驗證說明中引用該記錄（而非僅列出連結）。
- **限制說明**（必須包含）：本範例不包含完整自動化腳本（例如自動解析文章內容、自動執行所有連結的批次驗證），因為這需要額外的流程設計（文章解析邏輯、批次執行管理、錯誤重試策略），而這些設計應在明確需求與可驗證邊界下進行，而非假設為 Groundlane 的內建功能。同樣地，本範例不包含瀏覽器互動操作（例如點擊驗證連結後的動態內容），因為 `web_fetch` 的渲染僅支援讀取，而非互動控制（依據 `v0.1.0` 可驗證範圍）。

這個範例的價值在於：它展示了如何將 `usage-modes.md` 的判斷流程、工具合約、身份邊界、確定性證據欄位與強制限制（不使用已淘汰工具、不假設未實作功能、不嵌入憑證）轉化為可執行的操作步驟，而非提供一個「一鍵完成」的自動化解決方案（後者需要更多設計與驗證，且應明確標註其依賴的邊界條件）。

## 站內應用的核心原則（重申與總結）

基於篇 1 至篇 4 的內容，站內應用的核心原則可歸納為以下可驗證的操作規則（每條均可追溯至具體文件或合約，而非抽象建議）：

- **以現有工具為事實**：所有應用步驟基於 `.claude/skills/groundlane` 技能與 `usage-modes.md` 流程（工具存在判斷、直接呼叫、fallback 標示、淘汰工具排除），而非假設未實作的新功能。
- **不假設未實作功能**：不引入自動爬取、緩存感知路由、無限制預算、互動式瀏覽器控制等未在 `v0.1.0` 自述中出現的能力（這些被列為「Next」或未提及）。
- **不使用已淘汰工具**：依據 `usage-modes.md` 強制邊界，永遠不回退到 `stealth_fetch` 或 `web-fetch/fetch_page`；若 Groundlane 工具不可用，使用環境實際提供的替代工具並標示為 fallback。
- **身份邊界清晰**：不在文件、設定、對話或版控中嵌入 `GROUNDLANE_AUTH_TOKEN`、提供者金鑰或私人 endpoint（依據憑證管理與可分享性要求）；使用抽象標識（`<groundlane-clone>`、`<deployment>`）。
- **確定性證據完整**：所有驗證結果包含可驗證的來源欄位（`finalUrl`、`engine`、`backend`、`truncated`、選擇器與節點值），而非僅內容摘要或隱式推論結果。
- **限制與失敗明確標示**：所有操作限制（預設位元組與輸出上限導致的截斷、搜尋預算限制、工具不可用導致的 fallback）在驗證記錄與應用說明中明確標示，而非隱藏為「已完成」或「已驗證」。
- **可重現性優先**：每個應用步驟保存參數組合與回傳結構（特別是確定性欄位），讓後續驗證與重現成為可執行步驟，而非記憶或推測。

這些原則不僅適用於參考資料驗證與每日 digest 資料收集，也適用於任何未來站內應用擴展：無論應用場景如何變化（例如新增內容分類驗證、擴展到多語言參考資料、整合更多外部來源），這些原則提供了可驗證的操作邊界，確保應用設計不偏離可觀察事實，也不引入無法驗證的假設。

## 參考資料

- [.claude/skills/groundlane 技能與 `usage-modes.md`](.claude/skills/) — 工具判斷流程、身份邊界、憑證管理、可分享性要求、淘汰工具排除、遠端與本機 endpoint 差異
- [站內 `post` 技能（`tech-deep-dive` 模板、frontmatter 規格、glossary 檢查、參考資料原則）](skill://post) — 文章結構與驗證要求
- [Groundlane GitHub 原始碼（v0.1.0）與產品文件](https://github.com/vincentxuu/groundlane) — 三工具合約、預設限制、預算語義、安全說明
- 站內現有文章（例如 `2026-08-23-ai-agent-arxiv-digest.md`、`2026-08-23-ai-agent-github-digest.md`）的參考資料結構與驗證模式（依據實際文章內容，而非推測）
