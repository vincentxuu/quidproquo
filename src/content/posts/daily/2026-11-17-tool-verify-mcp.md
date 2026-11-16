---
title: "工具推薦｜verify-mcp — 給 agent 9 個不用 API key 的查證工具"
date: 2026-11-17
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "verify-mcp 是一個 MCP server，給 agent 9 個不需要 API key 的唯讀查證工具：Wayback 歷史、網域註冊年齡、DNS、憑證透明度、太陽方位與陰影計算，刻意不做人物查詢"
tldr: "verify-mcp 是一個沒有外部依賴、不需要 API key 的 MCP server，給 agent 9 個唯讀查證工具（Wayback 歷史、網域年齡、DNS、憑證透明度、太陽方位陰影計算）。安裝：pip install git+https://github.com/Ghongha007/verify-mcp.git。刻意拒絕做人物查詢，把查證和 doxxing 的邊界劃在工具層。"
series:
  name: "AI Tool of the Day"
  order: 81
---

> 🌏 [English version](/posts/daily/2026-11-17-tool-verify-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | verify-mcp |
| 類型 | MCP server |
| GitHub | [Ghongha007/verify-mcp](https://github.com/Ghongha007/verify-mcp) |
| Stars | 1（查核時；repo 建立於 2026-11-16） |
| 語言 | Python（僅標準函式庫，無外部依賴） |
| 授權 | MIT |
| 安裝 | `pip install git+https://github.com/Ghongha007/verify-mcp.git` |

## 解決什麼問題

你請 agent 幫忙查證一個可疑說法時，有沒有發現真正的查證動作永遠要跳出對話、自己開好幾個分頁？網站自稱經營多久，要去 Wayback Machine 翻最早的存檔；網域看起來像不像是最近才搶註的，要去查 WHOIS／RDAP；一個短連結敢不敢點，要先展開看真正目的地；一張照片宣稱的拍攝時間和地點合不合理，甚至要自己算太陽方位和陰影角度。每一步都是獨立工具、獨立網站，agent 幫不上忙，因為這些查證動作本來就不在它能呼叫的工具清單裡。

verify-mcp 把這些動作包成一個 MCP server 的 9 個唯讀工具：`wayback_history`／`wayback_closest` 查頁面歷史、`domain_registration` 查 RDAP 註冊紀錄、`dns_records` 查 Cloudflare 公開 DNS、`certificate_names` 查憑證透明度日誌（crt.sh）找出這個網域跑過哪些子網站、`expand_link` 展開短連結、`sun_position`／`shadow_times` 用 NOAA 公式在本地算太陽方位與陰影方向。前五個各打一個免費公開服務，後兩個完全本地計算，整支工具沒有任何外部依賴，純 Python 標準函式庫。更刻意的設計是：它明確拒絕做「人物查詢」——沒有找人帳號、電話、地址、長相的工具，而且每個查詢結果結尾都附一行「這個方法查不出什麼」的限制說明，逼著 agent 不要把單一資料源的結果當成定論。

適合場景：新聞查證、OSINT 調查、對可疑連結或截圖做第一輪排查，或是本站 `post-verify`、`source-eval` 這類 skill 在做的事——交叉比對多個獨立來源，而不是信一個資料源就下結論。

## 快速上手

### 安裝

```bash
git clone https://github.com/Ghongha007/verify-mcp.git
cd verify-mcp
pip install .

# 或不想留一份原始碼在本機，直接從 git 裝
pip install git+https://github.com/Ghongha007/verify-mcp.git
```

Claude Code：

```bash
claude mcp add verify -- python3 -m verify_mcp
```

Claude Desktop 和其他吃 JSON 設定的 client：

```json
{
  "mcpServers": {
    "verify": { "command": "python3", "args": ["-m", "verify_mcp"] }
  }
}
```

### 基本用法

```
你：這個網站說自己從 2015 年就開始報導這個地區，網域是什麼時候註冊的？Wayback 最早的存檔又是什麼時候？

Agent 依序呼叫：
1. domain_registration { domain: "example-news.com" }
   → RDAP 查出註冊日期、註冊商
2. wayback_history { url: "https://example-news.com" }
   → 列出 Wayback 第一次收錄的時間與版本連結
3. 把兩個時間點對照：網站自稱的起始年份，有沒有早於網域真正的註冊日期

每個工具回傳結果的最後一行，都會附上這個方法本身查不出什麼（例如「註冊日期是現任持有人開始使用的時間，網域可能被棄用後重新註冊」）。
```

### 進階用法

```
問：這張照片宣稱是 2026 年 11 月 16 日下午 5 點，在 28.6139, 77.2090（新德里）拍的，路燈的影子指向西北，合理嗎？

Agent 呼叫 sun_position / shadow_times，用座標加時間反推當時的太陽方位角，再對照照片裡的陰影方向——全程本地計算，不打任何外部 API，也不需要你另外開瀏覽器找太陽方位計算器。
```

## 與現有工具的比較

| | verify-mcp | 手動開分頁查 | 通用 web-search MCP | OSINT 人物搜尋工具 |
|---|---|---|---|---|
| 免 API key | ✅ | — | 視方案 | 視方案 |
| 太陽方位／陰影角度本地計算 | ✅ | 需另找計算工具 | ❌ | ❌ |
| 內建「拒絕人物查詢」設計 | ✅ | — | — | ❌（核心功能就是找人） |
| 每個結果附「這查不出什麼」的限制說明 | ✅ | 要自己知道限制 | ❌ | 視工具 |
| agent 一次查多個維度再自己彙整 | ✅ | 手動彙整 | 部分 | 部分 |

## 注意事項

- **還很新**：repo 建立於 2026-11-16，查核時只有 1 顆星，單人作者，README 自己寫明「還沒在 Claude Desktop 或其他聊天應用內實測過」，只用 scripted JSON-RPC 訊息和官方 MCP Python client（2.3.0）測過 handshake、工具列表、工具呼叫。正式用在查證工作流前，自己先跑一輪。
- **`expand_link` 會暴露你的 IP**：展開短連結時，HEAD 請求會直接打到目標伺服器，對方看得到你的來源 IP。README 明寫：查的是惡意方送來的連結，要透過 VPN，或乾脆不要展開。
- **公開服務本身會塞車**：crt.sh 常常慢或直接回錯誤；RDAP 不是每個 TLD 都提供，很多國別網域（ccTLD）回傳的資訊很少；太陽角度計算忽略大氣折射，太陽貼近地平線（±3 度內）時會有誤差。
- 任何一個工具的結果都只是一塊拼圖，不是結論——這點作者自己在 README 裡也反覆強調，用的時候別把單一查詢（尤其是陰影角度這種本來就有誤差的數學推算）當成鐵證。

## 今日收穫

以前覺得「查證工具要做得準」，前提是整合愈多資料源愈好——人物資料庫、衛星圖資、付費 API。verify-mcp 示範了另一條路：把幾個本來就公開、免費、不需要 key 的服務（Wayback、RDAP、crt.sh、Cloudflare DNS）加上幾個可以純本地算的數學（太陽方位），包成 agent 能直接呼叫的 9 個小工具，而且刻意不做「找人」這塊。查證和 doxxing 的邊界，常常就差在「能不能查到一個人」，這個作者選擇把這條線直接劃在工具層——沒有對應的工具可呼叫，而不是留給使用者自己拿捏要不要用。

## 參考資料

- [Ghongha007/verify-mcp — GitHub](https://github.com/Ghongha007/verify-mcp)
- [verify-mcp README（原始檔）](https://raw.githubusercontent.com/Ghongha007/verify-mcp/main/README.md)
- [verify-mcp — pyproject.toml](https://raw.githubusercontent.com/Ghongha007/verify-mcp/main/pyproject.toml)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)
