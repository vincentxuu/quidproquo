---
title: "工具推薦｜ha-mcp — 讓 AI 直接維護 Home Assistant，不只是語音開燈"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server ha-mcp 用 87 個工具讓 AI agent 直接讀寫 Home Assistant 的 automation、dashboard、HACS 與備份，範圍遠大於官方內建、只能控制已曝露 entity 的 MCP server integration"
tldr: "ha-mcp 是社群維護、MIT 授權的 Home Assistant MCP server，87 個工具、7,700+ stars。安裝：在 Home Assistant 的 HACS／Marketplace 搜尋「HA-MCP」。它解決了官方內建 MCP 只能控制曝露給 Assist 的裝置、碰不到 automation／dashboard／HACS 這類維護工作的問題。"
series:
  name: "AI Tool of the Day"
  order: 78
---

> 🌏 [English version](/posts/daily/2026-11-14-tool-ha-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | ha-mcp（HA-MCP） |
| 類型 | MCP server（Home Assistant 自訂整合／app／Docker／PyPI 四種跑法） |
| GitHub | [homeassistant-ai/ha-mcp](https://github.com/homeassistant-ai/ha-mcp) |
| Stars | 7,744（查核時；repo 建立於 2025-09-14，2026-11-13 仍有新 push） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | Home Assistant 的 HACS／Marketplace 搜尋「HA-MCP」安裝（推薦），或獨立跑 `docker run ... ghcr.io/homeassistant-ai/ha-mcp` |

## 解決什麼問題

Home Assistant 其實自己就有內建的 MCP server integration，但它是建在 Assist（語音助理）那條管線上：AI client 能讀寫的,只有你自己在「公開給 Assist 的實體」頁面勾選過的裝置，而且只能執行 Assist 本來就聽得懂的 intent。新裝一個感測器想讓 Claude 順手接進去、想讓 AI 幫你寫一條新的自動化規則、或是 dashboard 卡片排列想讓 AI 調整，Assist 完全碰不到——還是要自己開介面手動改,AI 幫不上忙。

ha-mcp 不走 Assist，直接接 Home Assistant 的 REST／WebSocket API，開出 87 個工具涵蓋 automation、script、helper、dashboard、area／zone、calendar、備份／還原、HACS 整合安裝、裝置與 entity registry，甚至（opt-in 的 beta 功能）讓 agent 直接讀寫 `configuration.yaml`。因為能碰的範圍比官方大得多，安全機制也做得更細：整組的 Read Only Mode 開關、單一工具可以個別停用、危險操作可以設定要求使用者先核可，而且編輯前都會自動備份，可以還原。

```diagram
title: ha-mcp 的工具範圍包住官方內建 MCP server
desc: 官方內建 MCP server 建在 Assist 管線上，只能碰曝露給 Assist 的 entity；ha-mcp 另外接 Home Assistant 的 REST／WebSocket API，87 個工具涵蓋 automation、dashboard、HACS、備份這些官方內建版本碰不到的維護工作。
caption: 簡化示意：兩者可以同時裝、互不影響，圖只畫範圍大小關係。
---
<svg viewBox="0 0 640 244">
  <rect class="dg-zone" x="20" y="20" width="600" height="204" rx="8"/>
  <text class="dg-tag" x="36" y="38" dominant-baseline="central">HOME ASSISTANT</text>
  <text class="dg-small" x="604" y="38" text-anchor="end" dominant-baseline="central">完整設定與 REST／WebSocket API</text>

  <rect class="dg-box dg-box--accent" x="40" y="56" width="560" height="148" rx="8"/>
  <text class="dg-tag" x="56" y="74" dominant-baseline="central">HA-MCP（87 工具）</text>
  <text class="dg-small" x="584" y="74" text-anchor="end" dominant-baseline="central">automation／dashboard／HACS</text>

  <rect class="dg-box dg-box--store" x="60" y="92" width="520" height="92" rx="8"/>
  <text class="dg-tag" x="76" y="110" dominant-baseline="central">官方內建 MCP</text>
  <text class="dg-small" x="564" y="110" text-anchor="end" dominant-baseline="central">走 Assist 管線</text>
  <text class="dg-sub" x="320" y="152" text-anchor="middle" dominant-baseline="central">只讀寫曝露給 Assist 的 entity</text>
</svg>
```

適合自己管 Home Assistant、想讓 Claude／ChatGPT 幫忙寫自動化、debug 壞掉的 automation（它能讀 execution trace）、整理 dashboard 的重度玩家；只是想用語音或聊天視窗開燈關燈、裝置都已經曝露給 Assist 的人，官方內建的 MCP server 就夠用，不需要多裝一個有完整寫入權限的服務。

## 快速上手

### 安裝

```bash
# 推薦：在 Home Assistant 內用 HACS，或 2026.11+ 的 Marketplace，搜尋「HA-MCP」安裝
# 安裝後到 Settings → Devices & Services → Add Integration 選「HA-MCP Server」，
# 貼一個管理員帳號的 long-lived access token 即可（建議另開一個專用帳號，不要用自己的登入）

# 想在 Home Assistant 之外跑獨立 HTTP server（Container／Core 安裝，或另一台機器）：
docker run -d --name ha-mcp -p 9584:9584 \
  -e HOMEASSISTANT_URL=http://homeassistant.local:8123 \
  -e HOMEASSISTANT_TOKEN=<你的 long-lived access token> \
  ghcr.io/homeassistant-ai/ha-mcp
```

### 基本用法

安裝完成後把 Configure 畫面給的 connect URL 貼進任何 MCP client：

```json
{
  "mcpServers": {
    "home-assistant": {
      "url": "http://<ha-host-或-domain>/api/webhook/<webhook-id>"
    }
  }
}
```

接上後直接用自然語言下指令，官方 README 列的範例：

| 你說 | 會發生什麼 |
|---|---|
| 「幫我建一個日落時自動開門廊燈的自動化」 | 建出帶正確 trigger／action 的自動化 |
| 「幫我的 dashboard 加一張天氣卡片」 | 更新 Lovelace dashboard，加上新卡片 |
| 「motion sensor 的自動化沒反應，幫我查一下」 | 分析 execution trace，找出問題、提出修法 |
| 「幫早晨例行自動化多加開咖啡機這一步」 | 讀現有自動化、加新的 action、存回去 |

### 進階用法

```bash
# beta 功能預設關閉，獨立跑的版本（Docker／PyPI）可以用環境變數開
# 例如讓 agent 直接編輯 configuration.yaml（ha_config_set_yaml 工具）：
docker run -d --name ha-mcp -p 9584:9584 \
  -e HOMEASSISTANT_URL=http://homeassistant.local:8123 \
  -e HOMEASSISTANT_TOKEN=<token> \
  -e ENABLE_BETA_FEATURES=true \
  -e ENABLE_YAML_CONFIG_EDITING=true \
  ghcr.io/homeassistant-ai/ha-mcp
```

走 Home Assistant 自訂整合（app／component）安裝的版本，同樣的 beta 開關在 Settings 裡的 HA-MCP 面板用 UI 勾選，不用碰環境變數。

## 與現有工具的比較

| | ha-mcp | 官方內建 MCP server integration | voska/hass-mcp |
|---|---|---|---|
| Stars | 7,744 | 內建於 Home Assistant core，非獨立 repo | 353 |
| 授權 | MIT | Home Assistant 本身 Apache-2.0 | MIT |
| 連接方式 | 另接 REST／WebSocket API | 走 Assist pipeline | 另接 REST／WebSocket API |
| 可控範圍 | automation／script／helper／dashboard／area／calendar／備份／HACS／裝置與 entity registry，YAML 編輯是 beta | 只能讀寫曝露給 Assist 的 entity，跑 Assist 支援的 intent | entity 狀態／控制、automation 清單與控制、dashboard 讀寫 |
| 工具數 | 87 | 依曝露設定浮動，不是固定工具集 | 官方未列總數，涵蓋面明顯較窄 |
| 寫 automation／script | ✅ | ❌ | ❌（只能列出與控制既有的） |
| 安全機制 | Read Only Mode、單一工具開關、核可政策、自動備份 | 跟著 Assist 曝光設定走 | 官方文件未特別列出 |
| 最後更新 | 2026-11-13 仍有 push | 跟著 Home Assistant 核心走 | 2026-11-02 |

三者可以同時裝、互不衝突：官方內建版本負責「已曝露裝置」的語音式控制，ha-mcp 負責「建置與維護」這塊官方版本完全碰不到的工作，voska/hass-mcp 則是較早、範圍較窄的社群方案。

## 注意事項

- **一個 admin token 管全部**：官方建議的做法是另外開一個專用帳號（只給 Local access only＋Administrator），不要直接用自己的登入 token——否則 ha-mcp 的每個改動都會記在你自己名下，token 外流風險也更大。
- **stdio 傳輸已知有連線問題**：README 明寫 stdio transport 有連線問題，streamable HTTP 沒有這個狀況（對應 issue #1713），只建議拿 stdio 做 demo／測試，正式使用要走 HTTP 方式（整合元件／app／Docker 的 HTTP 模式）。
- **四種安裝方式互斥**：整合元件（in-process）、app（add-on）、Docker、uvx/PyPI stdio 是跑同一個 server 的四種方式，README 特別警告同一個 client 裡留著兩個入口（例如本機 uvx 設定還留著，又另外裝了 app）是連線卡死的已知原因，只能選一種跑。

## 今日收穫

Home Assistant 官方的內建 MCP server 其實很早就有了，但它的設計前提是「把語音助理原本能做的事交給 AI」，所以範圍被 Assist 曝光設定卡住了。ha-mcp 示範的是另一條路：不複用既有管線，直接換一層更底層的 API 存取，範圍自然就擴展到整個設定面——但代價是它必須自己重做一套曝光與風控機制（Read Only Mode、per-tool 開關、核可政策），不能像內建版本一樣直接借用 Assist 現成的曝光頁面。兩個範圍不是誰取代誰，而是「讀寫裝置」跟「建置維護」本來就是兩種不同粒度的需求。

## 參考資料

- [homeassistant-ai/ha-mcp — GitHub](https://github.com/homeassistant-ai/ha-mcp)
- [HA-MCP 官方文件：Beta Features（ENABLE_BETA_FEATURES 等環境變數）](https://github.com/homeassistant-ai/ha-mcp/blob/master/docs/beta.md)
- [HA-MCP 官方文件：In-process server（整合元件安裝方式）](https://github.com/homeassistant-ai/ha-mcp/blob/master/docs/in-process-server.md)
- [HA-MCP Setup Wizard（15+ client 設定）](https://homeassistant-ai.github.io/ha-mcp/setup/)
- [AlphaSignal：Open-Source ha-mcp Gives AI Agents 87 Tools to Run Your Smart Home](https://alphasignal.ai/news/open-source-ha-mcp-gives-ai-agents-87-tools-to-run-your-smart-home)
- [Home Assistant 官方文件：Model Context Protocol（內建 MCP server integration）](https://www.home-assistant.io/integrations/mcp_server/)
- [SmartHomeScene：Home Assistant MCP Server: The Complete Guide](https://smarthomescene.com/guides/home-assistant-mcp-server-complete-guide/)
- [voska/hass-mcp — GitHub](https://github.com/voska/hass-mcp)
