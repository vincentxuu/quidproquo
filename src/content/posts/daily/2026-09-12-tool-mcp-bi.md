---
title: "工具推薦｜mcp-bi — 讓 Agent 用同一組工具呼叫讀懂 Superset、Metabase 到 Power BI 的儀表板"
date: 2026-09-12
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 Rust MCP server，把 Apache Superset、Metabase 及五家商用 BI 平台的儀表板查詢統一成一組工具呼叫，圖表回傳時附上背後的統計數字而非只給截圖"
tldr: "mcp-bi 是 zavora-ai 開源的 Business Intelligence MCP Server，用 BI_BACKEND 環境變數切換 Superset／Metabase／Power BI／Tableau／Looker／Qlik／QuickSight，Agent 寫一套工具呼叫就能跨平台讀儀表板。安裝：cargo run（預設內建假資料，免設定）。解決了「Agent 只看得到 dashboard 截圖、只能瞎猜趨勢」的問題。"
series:
  name: "AI Tool of the Day"
  order: 28
---

> 🌏 [English version](/en/posts/daily/2026-09-12-tool-mcp-bi-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp-bi（Business Intelligence MCP Server） |
| 類型 | MCP server |
| GitHub | [zavora-ai/mcp-bi](https://github.com/zavora-ai/mcp-bi) |
| Stars | 1 |
| 語言 | Rust |
| 授權 | Apache-2.0（crates.io 標示；GitHub repo 頁面授權欄位顯示 `Other/NOASSERTION`，疑似缺標準 LICENSE 檔案，使用前建議自行確認） |
| 安裝 | `cargo run`（clone 後，預設免設定的 fixture backend） |

## 解決什麼問題

你想做一個能回答「這季營收跟上季比怎樣」「哪個管道流量掉最多」的營運 Agent，資料已經在公司的 BI 平台上有現成的 dashboard 了——但 Agent 要嘛得學會每家平台不同的查詢語言（Superset 用 SQL、Power BI 用 DAX、Looker 用 explore），要嘛只能吃一張 dashboard 截圖。截圖法特別危險：模型看著圖片會很自然地「描述」出一條它根本沒量過的趨勢線，數字全靠猜。

mcp-bi 把這層差異收進一個環境變數 `BI_BACKEND` 裡：預設是內建三個假資料 dashboard 的 `memory` 模式，不用接任何帳號密碼就能先試工具怎麼用；要接正式平台就換成 `superset`、`metabase`、`powerbi`、`tableau`、`looker`、`qlik` 或 `quicksight`，Agent 呼叫的十二個工具（如 `bi_list_dashboards`、`bi_chart_data`、`bi_drill_down`）介面完全一樣，換平台不用改 Agent 端的程式碼。核心設計原則寫得很直白：「數字才是權威，圖片是給人看的」——`bi_render_chart` 回傳 PNG 的同時一定附上背後的統計數字，`bi_insights` 則單獨算出方向、變化量、極值、平均、離群值這些「值得引用的數字」，逼敘事只能引用真的算出來的東西。

適合場景：內部有 Superset 或 Metabase、想讓 Agent 直接查詢既有 dashboard 而不是重新接資料庫的團隊；客服或營運 Agent 需要回答「這個數字最新是多少」；已經用多家商用 BI 平台、想要一套工具介面而不是為每個平台各寫一套整合的場景。

## 快速上手

### 安裝

```bash
# 免設定試用：內建 3 個假資料 dashboard
git clone https://github.com/zavora-ai/mcp-bi
cd mcp-bi
cargo run

# 或直接裝發布到 crates.io 的版本
cargo install mcp-bi
```

### 基本用法

```bash
# 接正式的 Apache Superset（建議用帳密而非 token，見下方注意事項）
BI_BACKEND=superset \
  SUPERSET_URL=http://localhost:8088 \
  SUPERSET_USERNAME=admin SUPERSET_PASSWORD=admin \
  cargo run
```

Agent 拿到 MCP server 後的典型呼叫順序：

```
1. bi_backend_info      # 先確認接的是哪個平台、支援哪些能力
2. bi_list_dashboards   # 列出所有 dashboard
3. bi_get_dashboard     # 看單一 dashboard 有哪些可下鑽的維度
4. bi_chart_data        # 拿某張圖背後的原始數據列
5. bi_insights          # 算出方向/變化量/極值/離群值,回答時引用這些數字
```

### 進階用法

```bash
# 下鑽:用篩選條件narrow,再依某個維度breakdown,回傳篩選前後的列數對照
# (由 Agent 透過 bi_drill_down 工具呼叫,非命令列參數)

# 本機起一個真的 Superset 來驗證,而不是只信任 API 文件
docker run -d --name superset-bi -p 8088:8088 \
  -e SUPERSET_SECRET_KEY=local-only apache/superset:latest
docker exec superset-bi superset db upgrade
docker exec superset-bi superset init
docker exec superset-bi superset load_examples   # 灌 9 個真實範例 dashboard
python3 scripts/verify-superset.py ./target/release/mcp-bi
```

## 與現有工具的比較

| | mcp-bi | 只丟 dashboard 截圖給 Agent | 單平台官方/社群 BI MCP（如僅支援 Metabase） |
|---|---|---|---|
| 換 BI 平台不用改 Agent 端程式碼 | ✅（統一 12 個工具） | — | ❌（換平台要換 MCP） |
| 圖表回傳附帶背後統計數字 | ✅ `bi_render_chart` 同時回 PNG 與數字 | ❌ 全靠模型看圖猜 | 依實作而定 |
| 免帳密先試工具介面 | ✅ 預設 `memory` fixture | — | 通常要先接真帳號 |
| 多平台商用 API 都做過真實串接驗證 | 部分：Superset 對過真實實例，其餘 5 家僅依文件實作、未對真租戶測過 | — | 通常只做自家那一個平台，驗證較集中 |
| 唯讀，無寫入/改動 dashboard 能力 | ✅（`writes_allowed = "none"`） | — | 依實作而定 |

## 注意事項

- **只有 Superset 真的被驗證過**：README 明講 Metabase 是照文件用錄好的回應測的，Power BI／Tableau／Looker／Qlik／QuickSight 五個商用平台的 adapter 完全沒對真實租戶跑過，作者原話是「expect at least one surprise per platform」——生產環境接這五家之前務必自己先打通一次。
- **授權標示有落差**：crates.io 上 Cargo 套件標明 Apache-2.0，但 GitHub repo 頁面的授權偵測欄位顯示 `Other/NOASSERTION`，疑似倉庫裡沒有標準格式的 LICENSE 檔案。正式採用前建議直接去 repo 確認授權檔案內容，不要只看徽章。
- **專案才發佈一天、只有 1 個 star**：程式碼量不小（Rust 約 3,800 行，含 27 個測試），但社群驗證幾乎是零，遇到 issue 大概率得自己讀原始碼排除。

## 今日收穫

BI 整合最大的坑通常不是「接不到 API」，是「Agent 的答案有沒有數字撐著」——只丟一張 dashboard 截圖，模型會很流暢地編出它從沒量過的趨勢。mcp-bi 把「圖表」和「圖表背後的統計數字」設計成必須一起回傳的兩件事，等於在協定層面就堵住了「看圖說故事」這條路。

## 參考資料

- [zavora-ai/mcp-bi GitHub repo](https://github.com/zavora-ai/mcp-bi)：README 全文——架構、12 個工具列表、各平台環境變數、Superset 真實驗證的三個踩坑記錄、「Not yet verified」聲明出處。
- [mcp-bi — crates.io](https://crates.io/api/v1/crates/mcp-bi)：套件授權（Apache-2.0）、版本號（0.1.1）、程式碼行數統計（Rust 3,857 行／Python 150 行）出處。
- GitHub API repo metadata（`zavora-ai/mcp-bi`）：Stars（1）、語言（Rust）、建立時間（2026-09-11）、授權偵測欄位（`Other/NOASSERTION`）取自 GitHub REST API。
