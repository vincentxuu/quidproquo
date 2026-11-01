---
title: "工具推薦｜broll-mcp — 讓 Agent 從 Internet Archive 找公共領域 b-roll 並自動留好授權紀錄"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server 讓 agent 用一句話的 brief 從 Internet Archive 搜尋、看關鍵幀、剪出精準長度的公共領域 b-roll，每支 clip 自動寫一份可稽核的授權來源記錄"
tldr: "broll-mcp 是一個 stdio MCP server，讓 agent 從 Internet Archive 搜尋、預覽並剪出公共領域 b-roll，每支 clip 旁邊自動寫一份授權來源記錄。安裝：`claude mcp add broll -- uvx --from git+https://github.com/edigeh/broll-mcp broll-mcp`。解決了用 agent 剪公共領域素材時「授權查不清楚、剪出來的長度不準」的問題。"
series:
  name: "AI Tool of the Day"
  order: 63
---

> 🌏 [English version](/posts/daily/2026-10-24-tool-broll-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | broll-mcp |
| 類型 | MCP server（stdio） |
| GitHub | [edigeh/broll-mcp](https://github.com/edigeh/broll-mcp) |
| Stars | 11 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `claude mcp add broll -- uvx --from git+https://github.com/edigeh/broll-mcp broll-mcp` |

## 解決什麼問題

你請 agent 幫你的影片找一段「1950 年代空拍公路」的 b-roll，archive.org 上確實躺著幾十年的公共領域影片（Prelinger、NASA、新聞片、stock footage），但直接讓 agent 去用這個資料庫很痛苦：一個 item 的原始 metadata 常常超過 1MB，agent 還沒看到一個畫面就先燒光一大筆 token；同一個 collection 裡每個 item 的授權可能不一樣，不能整個 collection 套同一條規則；用 `ffmpeg -c copy` 剪片會對齊到關鍵幀,結果你要 8 秒,實際拿到 11.35 秒。

broll-mcp 把這些麻煩包進四個小工具。`search_footage` 把一句話的 brief（例如「小孩吃香蕉的黑白片」）轉成兩階段的 archive.org 查詢——先要求每個詞都命中,再放寬到符合任一個詞——本地再依 collection 信任分層和黑白偏好重新排序。`inspect_item` 跑場景偵測（PySceneDetect，沒裝就退回 ffmpeg），每個場景回一張關鍵幀圖片給 agent,讓有視覺能力的模型直接看畫面挑鏡頭,而不是只能從標題猜;一個 item 裡有大量獨立片段的話,就換成分頁的片段清單模式。`extract_clip` 剪 1–60 秒、重新編碼成帶 faststart 的 H.264 MP4,再用 ffprobe 驗證長度誤差在 ±0.1 秒以內、解碼零錯誤,回三張檢查用的畫面;同一個請求剪兩次會拿到同一支 clip。`get_provenance` 純讀本機,不打任何外部 API——因為授權記錄一定先寫、clip 才落地,所以不會有「clip 存在但沒有授權記錄」的情況。整支工具還有一層 SQLite WAL 快取,重複的搜尋、檢視、剪輯都是 0 次上游請求,並照 archive.org 自己公告的 bot 規範限流(每秒 1 次請求、最多 4 條媒體連線、支援 `Retry-After`)。

適合場景：做短影音／YouTube Shorts／紀錄片的人想用 agent 快速找公共領域素材；需要留下「這段畫面確實是公共領域、確實可以商用」的可稽核紀錄,而不是事後才去查授權;也適合想學「怎麼幫 agent 設計一個好用的工具」的人——它在 token 成本、確定性快取、可驗證輸出、結構化錯誤碼這幾件事上都做得很仔細。

```diagram
title: broll-mcp 的四個工具怎麼串起來
desc: Agent 依序呼叫四個工具，其中三個經過 SQLite 快取與限流才打 archive.org，get_provenance 完全不碰網路。
caption: 簡化示意；省略 collection 信任分層與分頁片段清單模式。
---
<svg viewBox="0 0 800 320">
  <path class="dg-line" d="M140 158H162Q170 158 170 150V56Q170 48 178 48H280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 170H186Q194 170 194 162V136Q194 128 202 128H280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 182H226Q234 182 234 190V200Q234 208 242 208H280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 194H202Q210 194 210 202V280Q210 288 218 288H280" marker-end="url(#arrow)"/>

  <path class="dg-line" d="M440 48H492Q500 48 500 56V104Q500 112 508 112H560" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 128H560" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 208H492Q500 208 500 200V152Q500 144 508 144H560" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="20" y="146" width="120" height="56" rx="6"/>
  <text class="dg-label" x="80" y="165" text-anchor="middle" dominant-baseline="central">Agent</text>
  <text class="dg-sub" x="80" y="185" text-anchor="middle" dominant-baseline="central">一句話 brief</text>

  <rect class="dg-box" x="280" y="20" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="39" text-anchor="middle" dominant-baseline="central">search_footage</text>
  <text class="dg-sub" x="360" y="59" text-anchor="middle" dominant-baseline="central">兩階段查詢＋排序</text>

  <rect class="dg-box" x="280" y="100" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="119" text-anchor="middle" dominant-baseline="central">inspect_item</text>
  <text class="dg-sub" x="360" y="139" text-anchor="middle" dominant-baseline="central">場景＋關鍵幀圖</text>

  <rect class="dg-box" x="280" y="180" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="199" text-anchor="middle" dominant-baseline="central">extract_clip</text>
  <text class="dg-sub" x="360" y="219" text-anchor="middle" dominant-baseline="central">剪片＋驗證長度</text>

  <rect class="dg-box dg-box--store" x="280" y="260" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="279" text-anchor="middle" dominant-baseline="central">get_provenance</text>
  <text class="dg-sub" x="360" y="299" text-anchor="middle" dominant-baseline="central">純本機，不連網</text>

  <rect class="dg-box dg-box--accent" x="560" y="100" width="160" height="56" rx="6"/>
  <text class="dg-label" x="640" y="119" text-anchor="middle" dominant-baseline="central">archive.org</text>
  <text class="dg-sub" x="640" y="139" text-anchor="middle" dominant-baseline="central">SQLite 快取／限流</text>
</svg>
```

## 快速上手

### 安裝

需要 Python 3.12+、[uv](https://docs.astral.sh/uv/)，以及編譯時支援 HTTPS 的 `ffmpeg` / `ffprobe`（`brew install ffmpeg` 或 `apt install ffmpeg`）。

```bash
# Claude Code
claude mcp add broll -- uvx --from git+https://github.com/edigeh/broll-mcp broll-mcp

# 其他 MCP host（Claude Desktop、Cursor）寫進設定檔
# { "mcpServers": { "broll": {
#   "command": "uvx",
#   "args": ["--from", "git+https://github.com/edigeh/broll-mcp", "broll-mcp"]
# } } }

# 從原始碼跑，或用 MCP Inspector 先手動測
git clone https://github.com/edigeh/broll-mcp && cd broll-mcp
uv sync
uv run broll-mcp
```

### 基本用法

README 裡的示範：一句口語化的 brief，四個工具依序接起來。

```text
你：「我需要 8 秒小孩吃香蕉的畫面，黑白的最好。」

search_footage("children eating bananas")
  → 5 筆排序結果，每筆附授權與信任分層
inspect_item("AboutBan1935")
  → 每個場景一張關鍵幀，agent 自己看畫面挑鏡頭
extract_clip("AboutBan1935", start_s=300, duration_s=8)
  → 驗證過的 H.264 MP4 ＋ provenance JSON
get_provenance(clip_id)
  → 《About Bananas》(1935)，Prelinger Archives，經 Internet Archive，公共領域
```

剪出來的 clip 旁邊會自動多一份授權記錄，欄位包含來源檔案 MD5、逐字複製的授權條款、是否可商用、擷取時間，以及一段可以直接貼上影片說明的 attribution 文字：

```jsonc
{
  "clip_id": "clp_20261023_4ee00c",
  "source": { "identifier": "AboutBan1935", "title": "About Bananas", "date": "1935" },
  "license": {
    "license_label": "Public Domain (CC PD dedication)",
    "commercial_use": "allowed",
    "attribution_required": "no"
  },
  "segment": { "start_s": 300.0, "duration_s": 8.0, "verified_duration_s": 7.975 },
  "attribution_text": "\"About Bananas\" (1935), Prelinger Archives via Internet Archive. License: Public Domain (CC PD dedication)."
}
```

### 進階用法

授權標籤只認一份精確的 URL 對照表（PD、CC0、PD Mark，以及 CC BY／BY-SA／BY-ND／BY-NC 2.0–4.0），表裡查不到的 URL 會被原封不動地記下來並標成 `unrecognized`、`commercial_use: "unknown"`——不會幫你猜。遇到大量片段的 item，`inspect_item` 會自動切成分頁清單：

```bash
# 用 MCP Inspector 不經過 agent，直接測一個工具
npx @modelcontextprotocol/inspector --cli uv run broll-mcp \
  --method tools/call --tool-name search_footage --tool-arg 'brief=aerial highway 1950s'
```

常用的環境變數：`BROLL_HOME`（快取與 clip 的落地目錄，預設是平台資料目錄）、`BROLL_AGENT_MODEL`（寫進送給 archive.org 的 User-Agent，符合它們對 AI agent 的要求）、`BROLL_CACHE_MAX_MB`（關鍵幀快取上限，預設 2048MB，滿了先清舊的）。

## 與現有工具的比較

| | broll-mcp | 手動用 ffmpeg 剪 archive.org | 商業 stock footage API |
|---|---|---|---|
| Agent 看關鍵幀再決定要哪段 | ✅ | ❌ | 依供應商而定 |
| 剪輯長度自動驗證（±0.1 秒） | ✅ | 需自己寫 ffprobe 檢查 | 不適用（通常整支下載） |
| 每支 clip 附可稽核的授權來源記錄 | ✅ | 需自己手動留存 | 部分（商業授權條款，非公共領域考證） |
| 免費、不需要 API key | ✅ | ✅ | ❌（需訂閱或 API key） |
| 重複查詢不重打上游 | ✅（SQLite 快取） | ❌ | 不適用 |

## 注意事項

- **`commercial_use: "unknown"` 不代表不能用**：archive.org 對那個 item 沒有機讀授權，broll-mcp 只是誠實地沒有猜，實際能不能用要自己去源項目頁面確認一次。
- **ffmpeg 要編譯時支援 HTTPS**，否則抓 archive.org 的串流會直接失敗；macOS／大多數 Linux 套件管理器裝的版本通常沒問題，但自行編譯的精簡版可能漏掉。
- **目前只有 stdio**，沒有 remote／HTTP 版本；要接進雲端跑的 agent（例如本站用的 Claude Code cloud session）需要自己包一層橋接。
- **刻意限流**：每秒 1 次請求、最多 4 條媒體連線是照抄 archive.org 自己公告的 bot 規範，大量批次剪輯會變慢——這是設計上的禮貌,不是沒優化。

## 今日收穫

這個工具把「給 agent 用的 API」和「給人用的 API」的差別做得很具體：給人用的工具回原始 metadata 讓人自己篩選就好，但給 agent 用的工具要先把 1MB 的 metadata 壓成幾行排序結果，再把「這支影片到底長什麼樣」變成關鍵幀圖片而不是一堆文字描述，剪完還要自己驗證長度對不對、重複呼叫要是確定性的、出錯要回一個 agent 看得懂該怎麼補救的錯誤碼。這些都是人類用網頁介面時完全不會注意到的細節——瀏覽器幫你把這些全部藏起來了,但agent 沒有瀏覽器,工具設計者得自己把這層補上。

## 參考資料

- [edigeh/broll-mcp — GitHub](https://github.com/edigeh/broll-mcp)
- [README — Features／Tools／Provenance record](https://raw.githubusercontent.com/edigeh/broll-mcp/main/README.md)
- [Internet Archive — Bot 存取規範](https://archive.org/developers/bots.html)
- [PySceneDetect](https://www.scenedetect.com/)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Model Context Protocol](https://modelcontextprotocol.io)
