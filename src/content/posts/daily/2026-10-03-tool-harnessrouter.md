---
title: "工具推薦｜HarnessRouter — 一個 API 同時跑 Codex、Claude Code、Hermes 等多個 coding agent harness"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, tool, daily, sdk]
lang: zh-TW
description: "開源自架平台，用 Unified Harness Protocol 把 Codex、Claude Code、Hermes 等現成的 coding agent harness 包成同一個 OpenAI Responses 相容 API，解決每接一個 harness 就要重寫一套 session／串流／檔案處理的問題"
tldr: "HarnessRouter Community Edition 是一個 Apache-2.0 自架平台，用 Unified Harness Protocol（UHP）把 Codex、Claude Code、Hermes 等 agent harness 包成同一個 API。安裝：`docker run -d --name harnessrouter -p 127.0.0.1:3000:3000 -v harnessrouter:/data harnessrouter/harnessrouter`。解決了產品要接多個 coding agent harness 時，每個都要重寫 session／串流／檔案／取消邏輯的問題。"
series:
  name: "AI Tool of the Day"
  order: 43
---

> 🌏 [English version](/en/posts/daily/2026-10-03-tool-harnessrouter)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | HarnessRouter（Community Edition） |
| 類型 | 自架 Agent 後端平台（單一 Docker container，OpenAI Responses 相容 API） |
| GitHub | [HarnessRouter/harnessrouter](https://github.com/HarnessRouter/harnessrouter) |
| Stars | 2,846（2026-08-09 建立，今日仍有新 commit；2026-08-16 以 Community Edition 身份拿下 Product Hunt 單日 #1，並有 YC 背書的 Launch YC 頁面） |
| 語言 | Python |
| 授權 | Apache-2.0（CE 本體；內建安裝的各 agent harness CLI 各自維持原授權；Starter Kits 另有獨立授權條款） |
| 安裝 | `docker run -d --name harnessrouter -p 127.0.0.1:3000:3000 -v harnessrouter:/data harnessrouter/harnessrouter` |

## 解決什麼問題

你的產品想用 Codex、Claude Code、Hermes 這類已經做好的完整 coding agent harness 當後端，而不是自己從模型的 function calling 重新拼一套 agent runtime？問題在於每個 harness 的啟動方式、session 怎麼接續、串流格式、檔案輸出、取消、錯誤回報全部不一樣——接一個就要寫一套膠水層,哪天想换另一個 harness,或者想比較哪個 harness／model 組合比較省錢、比較快,又要重來一次整合。

HarnessRouter 把「產品怎麼驅動一整個 agent harness」這層收斂成一個開放協定 Unified Harness Protocol(UHP),對外曝光跟 OpenAI Responses API 相容的介面:丟一個 task 進去,用 `metadata.harness_id` 選要用哪個 harness(Codex、Claude Code、Hermes、Pi、DeepSeek Harness 等)。Community Edition 是這個協定的自架參考實作——單一 Docker container 裝 Console、Gateway、Runner 三個 process,provider key、session 狀態、產生的檔案都留在自己的機器上。官方特別把這跟 MCP 的分工畫清楚:MCP 管的是一個 agent 怎麼呼叫工具,UHP 管的是產品怎麼驅動一整個 agent harness、拿到完整的執行生命週期(session、串流、檔案、取消)——兩者不是互斥,是不同的邊界。

適合場景:想在自己的產品裡讓使用者選「用哪個 coding agent 幫我做事」(審 PR、寫 SQL、產投影片內容)、或正在評估多個 harness/model 組合的成本與延遲、而不想為每一個都重寫一套整合層的團隊。

## 快速上手

### 安裝

```bash
# 1. 啟動（第一次會自動拉 image，約 700MB）
docker run -d --name harnessrouter \
  -p 127.0.0.1:3000:3000 \
  -v harnessrouter:/data \
  harnessrouter/harnessrouter

# 2. 等第一次啟動完成（會順便裝好內建的 agent harness CLI）
docker logs -f harnessrouter
# 看到 "[harnessrouter] ready on :3000" 再打開瀏覽器

# 3. 打開 http://localhost:3000，用預設帳密 harnessrouter / harnessrouter 登入後立刻改密碼
```

### 基本用法

Console 裡連好一個 model provider 的 API key、跑過一次任務後，用同一個 API 整合進自己的後端：

```bash
export HARNESSROUTER_BASE_URL=http://localhost:3000/api/harness

curl --fail-with-body -sS "$HARNESSROUTER_BASE_URL/v1/responses" \
  -H "Authorization: Bearer ${HARNESSROUTER_API_KEY:?}" \
  -H 'content-type: application/json' \
  -d '{
    "input":"幫我看一下 README 有沒有過時的指令，回報問題所在的段落",
    "metadata":{"harness_id":"claude-code"},
    "model":"claude-opus-5-5",
    "stream":false
  }'
```

把 `metadata.harness_id` 換成 `codex`、`hermes` 等其他已啟用的 harness，應用層代碼完全不用改，就能切換底層跑的是哪個 coding agent。

### 進階用法

把敏感值（token、密鑰）用 `env` 參考傳給 agent，而不是直接寫進 prompt——官方文件特別點出模型抄長字串容易漏字或換字，所以用引用而非明文：

```json
{
  "input": "部署到 staging，token 在 $DEPLOY_TOKEN",
  "metadata": {
    "harness_id": "codex",
    "env": { "DEPLOY_TOKEN": "vault:deploy-staging" }
  },
  "model": "gpt-5.4"
}
```

`vault:name` 讀的是自己工作區透過 `PUT /v1/mcp-secrets/{ref}` 存的密鑰，解析出來的值會從回應、串流、trace、紀錄裡全部遮罩——即使 agent 把它印出來也一樣。

## 與現有工具的比較

| | HarnessRouter CE | 自己寫 glue code 接各 harness | 直接用單一 harness 的原生 SDK/CLI |
|---|---|---|---|
| 多 harness 切換 | ✅ 改一個欄位即可 | 需自行實作每套整合 | ❌ 綁定單一 harness |
| session／串流／檔案／取消統一介面 | ✅ 內建、OpenAI Responses 相容 | 需自行實作 | 依該 harness 自己的介面 |
| 開放協定、不綁單一廠商 | ✅（UHP 公開規格＋conformance suite） | — | ❌ |
| 自架、資料留在自己機器 | ✅（CE） | ✅ | 視該 harness 架構 |
| credential 隔離（每個 session 獨立 OS 使用者） | ✅ 內建 | 需自行實作 | 視該 harness 架構 |
| 需要 provider API key 自己管 | 是 | 是 | 是 |

## 注意事項

- **container 必須以 root 啟動，但不是「整個服務都用 root 跑」**：entrypoint 和 Runner 保留 root 只是為了幫每個 session 建立獨立的 OS 使用者；Console 和 Gateway 本身用非特權帳號跑，每個 agent process 也只在自己 session 的使用者權限下執行。用 `--user` 覆寫會直接啟動失敗，升級前要記得拿掉這個參數。
- **沒有內建模型或試用 key**：你得自己去各 model provider 申請 API key 貼進 Console，HarnessRouter 本身不送模型額度；內建的 agent harness CLI（Codex、Claude Code 等）會在首次啟動時自動安裝，但各自仍是外部依賴，版本與授權風險要自己追。
- **Starter Kits 跟 Community Edition 本體的授權條款不一樣**：CE 是 Apache-2.0，但 Slides／Sheets／Dashboards 等 Starter Kits 用的是另一套授權，混著看容易誤判能不能商用。
- **公司與專案都還年輕**：2026-08 才開源，兩個月內衝到近三千顆星、YC 掛名，但 17 個 open issue、沒有正式 SLA，正式環境導入前自己評估維護風險，別只看成長曲線就直接上生產。

## 今日收穫

這幾個月 agent 生態一直在重複同一個抽象動作：先是 OpenRouter 把「接多個 model provider」收斂成一個 API，現在 HarnessRouter 把「接多個完整 coding agent harness」也收斂成一個協定。兩者的差異恰好說明了 agent 基礎設施正在往上長一層——model 之上還有 harness（給模型包好工具、記憶、執行環境的那層），harness 之上現在又長出「驅動 harness 本身」的協定。MCP 解決的是 agent 怎麼叫工具，UHP 解決的是產品怎麼把一整個 agent harness 當成可替換的後端——這兩層會越來越常被一起提到，但它們管的其實是完全不同的邊界。

## 參考資料

- [HarnessRouter/harnessrouter — GitHub](https://github.com/HarnessRouter/harnessrouter)
- [HarnessRouter README（Quickstart、API、架構圖）](https://github.com/HarnessRouter/harnessrouter/blob/main/README.md)
- [Self-hosting guide（安裝、root 權限設計、安全模型細節）](https://github.com/HarnessRouter/harnessrouter/blob/main/docs/self-hosting-guide.md)
- [Launch YC：HarnessRouter 開源公告](https://www.ycombinator.com/launches/Sv6-harnessrouter-open-sourcing-the-world-s-first-unified-interface-for-agent-harnesses-and-the-unified-harness-protocol)
- [Unified Harness Protocol 官方網站](https://unifiedharnessprotocol.org)
- [Show HN 討論串](https://news.ycombinator.com/item?id=49335595)
