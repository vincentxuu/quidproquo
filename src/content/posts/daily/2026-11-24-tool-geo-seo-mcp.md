---
title: "工具推薦｜GEO & SEO Readiness MCP — 讓 Agent 檢查你的網站能不能被 AI 搜尋讀到並引用"
date: 2026-11-24
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server，讓 Claude、Cursor 等 agent 直接檢查網站的 robots.txt、llms.txt、結構化資料與 sitemap，判斷網站對 ChatGPT Search、Perplexity 等 AI 搜尋引擎是否友善"
tldr: "geo-seo-mcp-pro 是一個檢查網站對 AI 搜尋引擎友善度的 MCP server。安裝：git clone 後 python3 server.py --check <網址>。解決了要翻 robots.txt、llms.txt、結構化資料、sitemap 四個地方才能確認網站能不能被 AI 引擎讀到並引用的問題。"
series:
  name: "AI Tool of the Day"
  order: 88
---

> :globe: [English version](/posts/daily/2026-11-24-tool-geo-seo-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | GEO & SEO Readiness MCP（geo-seo-mcp-pro，Lite 版） |
| 類型 | MCP server |
| GitHub | [alicexixi85/geo-seo-mcp-pro](https://github.com/alicexixi85/geo-seo-mcp-pro) |
| Stars | 1（2026-11-23 查核時數字，v0.2.2 剛發布 15 小時） |
| 語言 | Python（98.7%） |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/alicexixi85/geo-seo-mcp-pro.git` |

## 解決什麼問題

你的網站在 Google 排名不錯，但你不知道 ChatGPT Search、Perplexity 這些 AI 搜尋引擎到底讀不讀得到你的頁面、會不會引用它。要確認,得分別去看 `robots.txt` 裡有沒有擋到 `OAI-SearchBot`、`PerplexityBot` 這些搜尋引用用的爬蟲（和會用來訓練模型的 `GPTBot`、`ClaudeBot` 是兩組不同的 user-agent,分開控制）、`/llms.txt` 存不存在而且是不是真的 Markdown、頁面有沒有可用的 JSON-LD 結構化資料、`canonical` 和 `og:url` 有沒有不小心指到別的網域、sitemap 能不能被找到。四五個地方各查一次,很容易漏掉其中一個。

geo-seo-mcp-pro 把這五件事包成一個 MCP server,開放五個工具:`check_ai_crawler_access` 專門把「AI 搜尋引用爬蟲」和「AI 訓練爬蟲」分開判定(擋訓練爬蟲被當成網站自己的政策選擇,不算錯誤);`check_llms_txt` 檢查 `/llms.txt` 是不是真的 Markdown 而不是一個偽裝成 200 的錯誤頁;`extract_structured_data` 抓 JSON-LD(含 `@graph`)、檢查 `canonical`/`og:url` 有沒有跨網域、頁面是不是幾乎空殼的 JS shell;`check_sitemap` 找 `robots.txt` 或 `/sitemap.xml` 裡的 sitemap 並數 URL;`quick_readiness_report` 把前四個一次跑完,按 FAIL 優先排出該先修的清單。每項結果標 `PASS`/`WARN`/`FAIL`/`INFO`/`UNMEASURED`——網站擋爬蟲或逾時查不到,它會老實回 `UNMEASURED`,不會瞎猜。v0.2.2(2026-11-23 發布)新增偵測隱性的「引用封鎖」:`X-Robots-Tag`/`meta robots` 裡的 `noai`、`nosnippet`、`noindex`,這些比 `robots.txt` 更容易被忽略。

適合場景:內容或行銷團隊想知道自己寫的文章能不能被 AI 搜尋引用、獨立開發者上線新頁面前的健檢、或是已經在用 Claude Code / Cursor 寫站務指令稿,順手多裝一個 MCP 工具問「這個網址對 AI 搜尋友善嗎」。

## 快速上手

### 安裝

```bash
# 需要 Python 3.10+，無其他依賴
git clone https://github.com/alicexixi85/geo-seo-mcp-pro.git
cd geo-seo-mcp-pro

# 不裝 MCP client 也能直接跑一次性檢查
python3 server.py --check https://your-site.com
```

### 基本用法

```json
// Claude Desktop (claude_desktop_config.json) / Cursor (~/.cursor/mcp.json)
{
  "mcpServers": {
    "geo-seo-readiness": {
      "command": "python3",
      "args": ["/absolute/path/to/geo-seo-mcp-pro/server.py"]
    }
  }
}
```

接上後直接問 agent:

```text
幫我跑一下 https://example.com 的 quick_readiness_report，
把三個最該先修的問題列出來。
```

### 進階用法（選填）

v0.2.2 提供免安裝的遠端 Streamable HTTP endpoint，不用 clone、不用 Docker，Claude Desktop/Web connectors、ChatGPT Developer Mode、Cursor、Windsurf 都可以直接接：

```text
Remote MCP endpoint: https://mcp.usethelever.com/geo-audit/mcp
```

Docker 自架：

```bash
docker build -t geo-seo-readiness-lite .
docker run -i --rm geo-seo-readiness-lite
```

## 與現有工具的比較

| | geo-seo-mcp-pro（Lite） | 手動逐項檢查 | Screaming Frog 等傳統 SEO 爬蟲 |
|---|---|---|---|
| Agent 透過 MCP 直接問 | ✓ | ✗ | ✗（給人看的 GUI/CSV） |
| 分辨 AI 搜尋爬蟲 vs AI 訓練爬蟲 | ✓ | 需自己查 user-agent 清單 | 部分工具有通用 bot 清單，不特別分 |
| 偵測 `noai`/`nosnippet` 這類隱性引用封鎖 | ✓（v0.2.2 新增） | 需額外查文件 | 大多沒有 |
| 免費開源可跑 | ✓（Lite 完整可用） | — | 多數為付費桌面工具 |
| 一次彙整五項並排出 fix_first | ✓ | 需自己整理 | 有報表，但不是給 agent 消化的格式 |

## 注意事項

- **只讀初始 HTML**，不執行 JavaScript：SPA 用前端渲染才插入的 JSON-LD 抓不到，工具會回報「像是 JS shell」而不是直接判定失敗，但還是建議搭配 headless 瀏覽器工具交叉確認。
- **CDN/WAF 層的封鎖看不到**：`robots.txt` 只是其中一層規則，Cloudflare 之類的 bot 設定可能在更前面就擋掉爬蟲，要另外去平台後台查。
- **Lite 版有商業版升級選項**：作者另外賣一個付費的 Pro 版（headless 渲染、競品比較、白牌 PDF 報告），但 README 明確寫「Lite server 本身完整可用，不需要 Pro 版」，GitHub 上的程式碼就是這個免費版的全部。
- 只檢查公開的 `http`/`https` 網址，會拒絕 localhost 和內網位址。

## 今日收穫

GEO（AI 搜尋可見度)正在從「SEO 的一個分支」變成自己的檢查清單,而且清單的內容跟傳統 SEO 重疊但不相同——`robots.txt` 裡要分的不是「擋不擋爬蟲」,是「擋哪一種爬蟲」(訓練用 vs 引用用);`llms.txt` 存在與否、`canonical` 指哪裡,這些以前只是「做好的話加分」的細節,現在直接決定 AI 引擎看不看得到、會不會把頁面歸到別的網址上。這工具把它們抽成機械化的五項檢查,剛好說明這層新規則目前還停在「格式對不對」,不是「內容好不好」。

## 參考資料

- [alicexixi85/geo-seo-mcp-pro — GitHub](https://github.com/alicexixi85/geo-seo-mcp-pro)
- [alicexixi85/geo-seo-mcp-pro — README](https://raw.githubusercontent.com/alicexixi85/geo-seo-mcp-pro/main/README.md)
- [v0.2.2 Release Notes — Remote Streamable HTTP Endpoint, Citation Blocker Detector & Free Community Checker](https://github.com/alicexixi85/geo-seo-mcp-pro/releases/tag/v0.2.2)
- [Is your site invisible to ChatGPT Search? Five checks you can run in a minute — dev.to](https://dev.to/alicexixi85/is-your-site-invisible-to-chatgpt-search-five-checks-you-can-run-in-a-minute-1a18)
- [MCP Registry 條目 — io.github.alicexixi85/geo-seo-mcp-pro](https://registry.modelcontextprotocol.io/v0/servers?search=geo-seo-mcp-pro)
