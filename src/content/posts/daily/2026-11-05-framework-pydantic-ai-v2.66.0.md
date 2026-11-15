---
title: "框架更新｜Pydantic AI v2.66.0"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai, security]
lang: zh-TW
description: "Pydantic AI v2.66.0 一次修補 9 個安全性公告，其中多個高風險漏洞的根因都是同一種模式：資料解析順序寫反，先展開內容才檢查大小或黑名單"
tldr: "Pydantic AI v2.66.0 的重點是一次公開 9 個 GHSA 安全性公告（多個高風險），根因集中在同一種模式：先把資料展開或解析完才檢查大小限制或網域黑名單，而不是先檢查再展開；另外新增 OpenSandbox、RenderSandbox 等自架 agent 工作區能力，以及 Azure Durable Task 給 harness 用的持久化支援。"
series:
  name: "AI Framework Changelog"
  order: 62
---

> 🌏 [English version](/posts/daily/2026-11-05-framework-pydantic-ai-v2.66.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.66.0 |
| 前一版 | v2.65.0 |
| 發布日 | 2026-11-04 |
| Release Notes | [v2.66.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.66.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## 這個版本為什麼重要

這一版的主角不是新功能，是一次公開 9 個安全性公告（[GHSA](https://github.com/pydantic/pydantic-ai/security/advisories)，多個標記 high）。把九個公告拆開看，會發現大半根因其實是同一件事：程式碼在「檢查大小限制」或「比對網域黑名單」之前，先把資料展開、解析或查詢完了。深度巢狀的 JSON 先被重新縮排排版才比對下載大小上限（[GHSA-m5vj-8mcw-82qx](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m5vj-8mcw-82qx)），小型但互相循環參照的工具 schema 先被展開 `$defs`／`$ref` 才送進模型（[GHSA-7494-925c-rrxv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-7494-925c-rrxv)、[GHSA-484x-x9m4-62cj](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-484x-x9m4-62cj)），`allowed_domains` 的網域黑名單先查 DNS 才判斷要不要擋（[GHSA-5ppx-9jq6-6pmw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5ppx-9jq6-6pmw)）。只要攻擊者能影響送進這些路徑的內容（一個 AG-UI 端點、一段工具回傳值、一個 agent 要抓的 URL），就能用幾百個字元的輸入換到數分鐘甚至更久的事件迴圈阻塞,屬於資源耗盡（ReDoS／記憶體膨脹）類型的漏洞，而不是傳統「prompt injection 騙模型做壞事」那條線。另一組公告則是資料邊界問題：序列化訊息歷史裡偽裝成檔案物件的 JSON，重新載入後會被當真的檔案解析，可能讓應用程式去抓一個內部網址或讀一個 `s3://` 物件（[GHSA-4cj4-hgwf-4hc4](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4cj4-hgwf-4hc4)）；Tencent Cloud 的 metadata 位址沒被排進雲端 metadata 黑名單（[GHSA-5fj9-5pjw-vpwc](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5fj9-5pjw-vpwc)）；OpenTelemetry 的 embedding span 記錄了 `extra_headers`／`extra_body` 裡的機敏設定（[GHSA-jp94-mmr3-2pvv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-jp94-mmr3-2pvv)）。同一批修復也補上了這些安全修補所在的功能面：新增 `OpenSandbox`、`RenderSandbox` 讓 agent 工作區可以自架或跑在 Render 的 sandbox 裡,以及 Azure Durable Task 給 harness 用的持久化執行支援。

## 重要變更

- **9 個安全性公告同批修復**：[GHSA-m5vj-8mcw-82qx](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m5vj-8mcw-82qx)（high，深層巢狀 JSON 先展開才比對大小上限）、[GHSA-mfx5-pc32-32m8](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-mfx5-pc32-32m8)（high，Harness 機密遮罩的 `private_key` 正規表達式對特定字串指數級回溯）、[GHSA-5fj9-5pjw-vpwc](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5fj9-5pjw-vpwc)（medium，雲端 metadata 黑名單漏了 Tencent Cloud 位址）、[GHSA-jp94-mmr3-2pvv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-jp94-mmr3-2pvv)（medium，embedding tracing 記錄了機密設定）、[GHSA-7494-925c-rrxv](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-7494-925c-rrxv)／[GHSA-484x-x9m4-62cj](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-484x-x9m4-62cj)（medium，工具 schema 的 `$ref` 重複展開造成指數級運算）、[GHSA-r879-rxgj-3g75](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-r879-rxgj-3g75)（medium，Vercel AI／AG-UI adapter 載入訊息的時間隨 part 數平方成長）、[GHSA-4cj4-hgwf-4hc4](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4cj4-hgwf-4hc4)（medium，偽裝成檔案物件的工具結果被重新載入後會被當真檔案解析）、[GHSA-5ppx-9jq6-6pmw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5ppx-9jq6-6pmw)（low，網域黑名單先查 DNS 才判斷要不要擋）、[GHSA-mgmv-r532-pg36](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-mgmv-r532-pg36)（medium，MCP 伺服器 URL 推導出的識別碼可能把 URL 路徑裡的機密傳到前端）→ 多數成因是「先展開/解析、後檢查」的順序寫反，影響範圍集中在 AG-UI／Vercel AI 端點、message history 回放、`allowed_domains` 限制這幾類會接觸外部可控內容的路徑
- **OpenSandbox / RenderSandbox**：新增 `OpenSandbox` 讓 agent 工作區可以自架，`RenderSandbox` 讓工作區直接跑在 Render 的 sandbox 服務上 → agent 需要隔離執行環境時，多了不綁死單一雲端供應商的選擇
- **Azure Durable Task 持久化**：`pydantic_ai_harness` 新增 Azure Durable Task 作為持久化執行後端 → 跑在 Azure 上的長程 agent 現在也能用框架原生的持久化機制，不用自己接別的 workflow engine
- **Pixeltable 工具與記憶儲存**：Harness 新增 Pixeltable 整合，可當工具呼叫也可當記憶儲存 → 想用本地向量資料庫做記憶層的場景多一個不用額外接 API key 的選項
- **MCP capability 的 include_instructions**：新增 `include_instructions` 設定，可以把 MCP 伺服器的 instructions 排除在 agent 的 instructions 之外 → 連接多個 MCP 伺服器時，不會被每個伺服器附帶的 instructions 把 system prompt 塞爆

## Breaking Changes

本版本沒有 API 簽名層的 breaking changes，但有兩項安全修復會直接改變既有部署的行為，升級前要注意：

- 使用 `MCP` capability 連線伺服器時只給了 URL、沒給明確 `id`：這個 ID 過去會從 URL 的主機名稱與路徑最後一段推導，若路徑帶有機密（例如存取 token），AG-UI／Vercel AI adapter 會把這個 ID 連同 MCP Apps 工具結果一起送到前端
  - 影響範圍：v2.57.0 到 v2.60.0 之間用這種方式連線 MCP 伺服器、且 URL 路徑帶機密的部署，官方建議立即輪換這些伺服器的憑證
- OpenTelemetry instrumentation 若對 embedding 模型開啟，過去會把 `extra_headers`／`extra_body` 裡的機敏設定記進 trace
  - 影響範圍：對 embedding 模型開了 instrumentation、且透過這兩個設定傳遞機密的部署，需要限制既有歷史 trace 的存取權限並輪換曾經曝露的憑證

## 遷移指南

### 從 2.65.0 升級到 2.66.0

```bash
pip install --upgrade pydantic-ai==2.66.0
```

升級本身不需要改程式碼；上述兩項安全性變更是「資料已經曝露過」的善後動作，不是程式碼相容性問題：

```python
# 若曾用「URL 路徑帶機密」的方式連線 MCP 伺服器，先輪換該伺服器的憑證，
# 再升級到 v2.66.0（ID 推導方式本身在 v2.60.0 已修正，這裡只是提醒善後）

# 若對 embedding 模型開了 OpenTelemetry instrumentation 且用過 extra_headers/extra_body 傳機密，
# 限制既有 trace 存取權限並輪換這些機密
```

其餘功能（`OpenSandbox`、`RenderSandbox`、Azure Durable Task、Pixeltable、`include_instructions`）都是新增能力，沒用到的話不影響既有程式碼。

## 與其他框架的對比觀察

昨天（2026-11-04）這系列報導的還是 Pydantic AI v2.65.0 的 `ConversationStore` 持久化層，今天緊接著是同一個框架的安全性公告批次——這個頻率本身就值得注意：多數 agent 框架極少一次公開這麼多個獨立編號的 GHSA，大部分的安全性修復都悶在一般 bug fix 的措辭裡過去（例如同一天發布的 Haystack v2.31.1，就只在 release notes 寫兩行依賴升級,沒有對應公開的 GHSA 編號）。Pydantic AI 選擇把每個漏洞都走正式的安全性公告流程，對使用者來說多了一份「這個版本到底修了什麼、我是否受影響」的可核對紀錄，但也意味著只看版本號（2.65.0 → 2.66.0，看起來像普通 minor）會低估這次升級的優先度。

## 今日收穫

之前以為 agent 框架的安全問題主要卡在「要不要信任模型輸出」這個決策點上；看這批公告才意識到，光是「程式碼先做哪一步」這種實作順序的細節，就能獨立構成高風險漏洞——深層 JSON 先展開再比對大小上限、網域黑名單先查 DNS 再判斷要不要擋，這些都跟模型本身的判斷無關，純粹是「檢查」被放在「展開」後面而已。資源耗盡類的漏洞不需要模型被騙，只需要一段攻擊者能影響的輸入先走到錯的程式碼順序。

## 參考資料

- [Pydantic AI v2.66.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.66.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.65.0...v2.66.0](https://github.com/pydantic/pydantic-ai/compare/v2.65.0...v2.66.0)
- [GHSA-m5vj-8mcw-82qx：WebFetch／web_fetch_tool JSON 展開後才比對大小上限](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-m5vj-8mcw-82qx)
- [GHSA-4cj4-hgwf-4hc4：訊息歷史回放時偽裝檔案物件被信任解析](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4cj4-hgwf-4hc4)
- [GHSA-mgmv-r532-pg36：MCP 伺服器 URL 推導 ID 可能外洩路徑機密](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-mgmv-r532-pg36)
- [昨日報導：Pydantic AI v2.65.0（ConversationStore）](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0)
