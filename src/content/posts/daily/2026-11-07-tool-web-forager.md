---
title: "工具推薦｜web-forager — 一支 Agent 專用的蒐集引擎，連小紅書都先查 robots.txt 才抓"
date: 2026-11-07
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源的網路資訊蒐集引擎，一套 CLI／MCP server／Claude Code skill 用同一個引擎讀 HTML、PDF、Office 文件、RSS 與 Bilibili、知乎等公開頁面，每個請求都先查 robots.txt 並限速才抓"
tldr: "web-forager 是一個 MIT 授權的開源工具，CLI、MCP server、Claude Code skill 三種介面共用一套引擎，讀取網頁、PDF、Office 文件、RSS 與 Bilibili、知乎、小紅書等公開頁面。安裝：MCP 設定裡指到 python mcp_server.py 即可。解決了「搜尋工具只給連結、自寫爬蟲沒有合規層」的落差——每個請求都先查 robots.txt、限速後才抓取，讀不到 robots.txt 就視為拒絕。"
series:
  name: "AI Tool of the Day"
  order: 75
---

> 🌏 [English version](/posts/daily/2026-11-07-tool-web-forager-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | web-forager |
| 類型 | MCP server（含 CLI 與 Claude Code skill） |
| GitHub | [JiamingShi-JsPhys/web-forager](https://github.com/JiamingShi-JsPhys/web-forager) |
| Stars | 3（撰文時，上線未滿一天） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | MCP 設定裡指到 `python mcp_server.py`（或 `git clone` 後跑 `python install.py --project . --global` 幫各家 host 寫好規則檔） |

## 解決什麼問題

讓 agent 幫忙做研究時，常常卡在同一個縫隙：搜尋 API 回來的只有連結和摘要，頁面本身還是要自己抓；自己寫的爬蟲抓得到頁面，卻沒有合規層——不會先看 robots.txt、不會限速、遇到 PDF 或 Office 文件也沒有解析邏輯。兩邊都只解決一半的問題，中間缺一個穩定的契約。

web-forager 把這段統一接起來：每個請求都先經過同一個 `HttpFetcher`——查 robots.txt、走快取、重試退避、依來源網域限速、設回應大小上限——通過才交給對應的解析器。HTML、PDF、DOCX、XLSX、EPUB、CSV、RSS/Atom、sitemap，以及 Bilibili、知乎、小紅書、微博、豆瓣等平台的公開頁面，全部收斂成同一種輸出格式：`metadata`、`markdown`、`tables`、`warnings`。缺依賴時用明確的 exit code 退場（缺 Playwright 是 6、缺 `pypdf` 是 7），不會丟一截看不懂的 traceback；抓回來的文字一律當成未經驗證的資料，不當指令執行。

適合場景：research agent 要掃一輪 Bilibili、知乎上的公開討論做輿情或市場調查；要讀一批 PDF 筆記、Office 文件或 RSS 訂閱源整理成摘要；或是要先用 `map` 把一個網站的 sitemap 掃出來,再決定要不要逐頁讀。不適合：需要讀已登入內容、需要繞過 CAPTCHA 或 Cloudflare 驗證、或是想蒐集個人隱私資料的場景——這些 web-forager 刻意都不做。

## 快速上手

### 安裝

```bash
git clone https://github.com/JiamingShi-JsPhys/web-forager.git
pip install -r web-forager/requirements.txt   # 核心依賴：requests、beautifulsoup4、trafilatura
# 需要 JS 渲染或 PDF 文字層時再加裝：
# pip install playwright && playwright install chromium
# pip install pypdf
```

### 基本用法

把 MCP server 指到 `mcp_server.py`，重啟用戶端即可在對話裡直接問：

```json
{
  "mcpServers": {
    "web-forager": {
      "command": "python",
      "args": ["/absolute/path/to/web-forager/mcp_server.py"]
    }
  }
}
```

伺服器開出七個工具：`web_fetch`、`web_search`、`web_surf`、`web_scholar`、`web_map`、`web_bilibili`、`web_clean`。等價的 CLI 動作：

```bash
python run.py --action fetch --url "https://www.zhihu.com/" --render auto
python run.py --action scholar --source arxiv --query "multi-agent systems"
python run.py --action map --url "https://example.org" --limit 500
```

### 進階用法

`surf` 可以帶著一個可續接的 session，沿著頁面裡的連結一跳一跳往下讀，不是單頁抓完就停：

```bash
python run.py --action surf --url "https://www.zhihu.com/" \
  --depth 1 --max-pages 5 --session zhihu-01
```

同一個 `--session` 之後再執行一次,會從上次停下的地方接著走,不用重新規劃路徑。

## 與現有工具的比較

| | web-forager | 搜尋 API（Exa／Tavily 等） | 自寫 requests + BeautifulSoup |
|---|---|---|---|
| 給連結還是給內容 | ✅ 連結＋統一 Markdown／metadata | 多半只給連結和摘要 | 要自己寫解析 |
| robots.txt 合規內建 | ✅ 每個請求都查，讀不到視為拒絕 | 視供應商而定,使用者看不到 | ❌ 要自己補 |
| 多格式支援（PDF／Office／RSS／sitemap） | ✅ 原生支援 | ❌ 通常只處理網頁 | 要自己接每個格式的 library |
| 中文社群平台（Bilibili／知乎／小紅書等） | ✅ 專門適配器 | 看供應商索引範圍 | 要自己處理版面與反爬 |
| 需要 API key／付費 | ❌ 不需要 | 通常要 | ❌ 不需要 |
| 離線測試覆蓋 | ✅ 115 個測試,全部跑在本機假 HTTP server | — | 通常沒有 |

## 注意事項

- **robots.txt 連不到就視為拒絕**，這是保守但符合 RFC 的預設行為,不是「讀不到就放行」。`--ignore-robots` 只該用在你明確有權限存取的資源上。
- **即使 robots.txt 允許,平台自己的服務條款未必允許**：知乎、微博、小紅書這類平台的 ToS 多數仍限制自動化大量蒐集,工具本身不會幫你繞過登入或驗證,但要不要抓、抓多少,使用者仍要自己對照每個平台的條款,別把「robots.txt 沒擋」當成合規保證。
- **PDF 只讀文字層**,掃描版論文或影印稿需要 OCR,這個工具不處理;**搜尋結果頁的可用性會隨網路環境變動**,Sogou 會跳人機驗證頁,預設的 `auto` 路由已經把它排除在外。

## 今日收穫

多數「給 agent 用的抓取工具」要讀者在「搜尋能力」和「合規能力」之間選一邊——要麼用別人的搜尋 API 換到合規但只拿到連結,要麼自己寫爬蟲換到完整內容但要自己扛 robots.txt 和限速的責任。web-forager 把這兩件事釘在同一層:合規檢查不是外掛在搜尋或抓取之後的「事後補丁」,而是每一次請求都要先過的關卡,搜尋、sitemap、scholar API 呼叫全部一視同仁。這提醒我們,給 agent 用的工具如果想長期安全地自動跑,合規層最好是架構裡繞不過去的那一步,不是留給呼叫者自己記得加的選項。

## 參考資料

- [JiamingShi-JsPhys/web-forager — GitHub](https://github.com/JiamingShi-JsPhys/web-forager)
- [web-forager README](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/README.md)
- [AGENTS.md（agent 操作規則與硬性限制）](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/AGENTS.md)
- [CHANGELOG.md（1.0.0／1.0.1 發布紀錄）](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/CHANGELOG.md)
- [LICENSE（MIT）](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/LICENSE)
