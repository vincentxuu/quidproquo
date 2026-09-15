---
title: "工具推薦｜edgar-mcp — 讓 Agent 只讀 10-K 裡的那一節，而不是整份 300 頁"
date: 2026-09-16
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server，直接對接 SEC EDGAR 公開資料，不需要 API key，讓 Agent 精準讀到 10-K 裡的一個章節、而不是把整份文件塞進 context window"
tldr: "edgar-mcp 是一個對接 SEC EDGAR 的 MCP server，六個工具涵蓋公司查詢、filing 列表、章節擷取、財務數字與全文搜尋。安裝：pip install -e . 後設 EDGAR_MCP_USER_AGENT 環境變數即可，不需要 API key。解決了 Agent 讀財報時被迫吞下整份 10-K、context window 被目錄和樣板文字塞爆的問題。"
series:
  name: "AI Tool of the Day"
  order: 31
---

> 🌏 [English version](/en/posts/daily/2026-09-16-tool-edgar-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | edgar-mcp |
| 類型 | MCP server |
| GitHub | [titusblair/edgar-mcp](https://github.com/titusblair/edgar-mcp) |
| Stars | 1 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `pip install -e . && export EDGAR_MCP_USER_AGENT="Your Name you@example.com"` |

## 解決什麼問題

你讓 Agent 分析一家上市公司的財報風險，它得先讀 10-K。問題是一份 10-K 常常有三百頁，直接餵給模型就是五萬字以上的 token，其中大半是法律樣板文字和目錄，真正回答「供應鏈風險」這種問題只需要 Item 1A 那一節。多數 EDGAR API 包裝工具只是把官方 API 原封不動地暴露出來——回傳整份文件，「該讀哪一節、讀多少、對應到哪個 XBRL 標籤」這些真正麻煩的判斷，全部丟回給呼叫端自己想辦法。

edgar-mcp 把這些判斷做進伺服器本身。`read_filing_section` 只回傳單一章節、有 `max_tokens` 上限、超過會明講截斷了多少而不是靜默截斷；辨識「這是目錄裡提到的章節標題，還是章節本文」的規則很簡單但管用——本文後面接的是下一個章節，目錄項後面接的是下一個目錄項，兩者用「後面跟著多少文字」就能分開，且這個規則在格式各異的公司間都成立。查詢公司名不用先呼叫一次查詢工具轉換成 ticker 或 CIK，六個工具直接吃自然語言公司名，內部自己解析；解析失敗時錯誤訊息會附上候選清單和該打哪個後續呼叫，而不是回一句「找不到」。

適合場景：做投資研究或合規分析的 Agent，需要精準讀某家公司財報裡的特定章節或特定財務指標；需要在同一個問題上追蹤同一家公司連續幾年財報數字變化的場景，因為工具已經處理了公司財年間更換 XBRL 標籤名稱（例如營收欄位從 `Revenues` 換成 `RevenueFromContractWithCustomerExcludingAssessedTax`）這種資料一致性問題。

## 快速上手

### 安裝

```bash
git clone https://github.com/titusblair/edgar-mcp
cd edgar-mcp
pip install -e .

# SEC 要求呼叫端附帶含真實聯絡方式的 User-Agent，沒有會被擋
export EDGAR_MCP_USER_AGENT="Your Name you@example.com"
```

接進 Claude Code：

```bash
claude mcp add edgar -e EDGAR_MCP_USER_AGENT="Your Name you@example.com" -- edgar-mcp
```

### 基本用法

```
> read_filing_section(company="AAPL",
                       accession="0000320193-25-000079",
                       section="risk_factors")

✓ Item 1A — Risk Factors
  17,040 tokens, from a 54,955-token document
```

六個工具按查找流程排列：`find_company`（名稱／ticker 轉 CIK，附信心分數，猜不準就直接拒絕回答而不是硬猜）→ `list_filings`（列出某公司歷年申報文件）→ `list_filing_sections`（列出某份 filing 有哪些章節、各自要花多少 token 讀）→ `read_filing_section`（主力工具，帶 offset 可分段續讀）→ `get_financial_facts`（跨期間查某個財務概念，涵蓋 14 種常見概念）→ `search_filings`（2001 年至今的全文檢索）。

### 進階用法

專案內建 eval 套件，用真實 SEC 資料跑準確率，而不是只靠人工試用判斷好不好用：

```bash
python3 evals/run_eval.py
```

```
  company resolution
    accuracy_on_answerable       100.0%    (35/35)
    refusal_rate_on_ambiguous    100.0%    (5/5)

  section retrieval
    grounded                     100.0%
    recall_at_1                   38.5%
    recall_at_3                  100.0%
```

`recall_at_1` 只有 38.5% 這件事作者選擇誠實列出來，而不是藏起來——因為「風險因素」跟「業務描述」這類章節本來就用詞高度重疊，排序準確率本身就難做到很高；真正重要的是 `grounded` 這項指標維持 100%，代表「應該回答問題的章節」裡確實包含答案，只是排序演算法還有進步空間。

## 與現有工具的比較

| | edgar-mcp | 直接呼叫 EDGAR 官方 API | 泛用網頁爬蟲讀 filing HTML |
|---|---|---|---|
| 回傳單一章節而非整份文件 | ✅ | ❌（回傳整份 JSON／文件） | ❌（需自己切章節） |
| 免 API key | ✅（只需 User-Agent） | ✅ | ✅ |
| XBRL 財務概念跨標籤合併 | ✅（14 種概念自動對應多個 tag） | ❌（要自己知道每個 tag 名稱） | ❌ |
| 附 eval 套件驗證正確率 | ✅ | — | — |
| 章節擷取準確度 | 依賴文字長度啟發式，非 100% | 不適用（不切章節） | 依網站結構而定，格式一變就壞 |

## 注意事項

- **只是個人專案，剛發布**：目前 1 顆星、剛建立不到一天，還沒經過大規模生產環境驗證，正式導入前建議自己跑一次內建的 eval 和 protocol test。
- **章節擷取是啟發式規則**：README 自己承認遇到排版特殊或掃描版舊文件會擷取失敗；`list_filing_sections` 會先讓你看到章節大小，可以在真的呼叫 `read_filing_section` 前先確認章節存在且大小合理。
- **只涵蓋 US-GAAP，1990 年以前很淺**：外國私人發行人若用 IFRS 申報，`get_financial_facts` 常常查不到資料（工具會明講查不到而不是回空清單）；全文搜尋只涵蓋 2001 年之後的申報文件。

## 今日收穫

多數「XX API 的 MCP 包裝」把 API 原封不動搬過來，工具數等於 API endpoint 數，剩下的判斷丟給模型自己想。edgar-mcp 反過來把「這題該用第幾個 endpoint、讀多少、對應哪個欄位名稱」這些領域知識寫進伺服器本身，只留六個工具——這代表一個好的 MCP server 設計，價值往往不在包了幾個 API，而在幫模型先做掉哪些原本要花好幾輪對話才能摸索出來的判斷。

## 參考資料

- [titusblair/edgar-mcp GitHub repo](https://github.com/titusblair/edgar-mcp)：README 全文，含設計理念、六個工具說明、eval 結果、已知限制，本文技術細節主要出處。
- GitHub API repo metadata（`titusblair/edgar-mcp`）：Stars（1）、語言（Python）、授權（MIT）、建立時間（2026-09-15）取自 GitHub REST API。
- [SEC EDGAR API 官方文件](https://www.sec.gov/edgar/sec-api-documentation)：SEC EDGAR 為美國證交會公開申報文件系統，edgar-mcp 直接對接其公開 API（含 Full-Text Search、XBRL Frames API），僅要求附帶真實聯絡方式的 User-Agent。
