---
title: "Helicone 深入介紹：把 LLM Gateway、請求追蹤與成本分析放在一起"
date: 2026-08-22
category: ai
type: deep-dive
tags: [helicone, llm-observability, ai-gateway, tracing, llmops, open-source]
lang: zh-TW
tldr: "Helicone 是開放原始碼的 LLM Gateway 與觀測平台：請求經過相容端點後，自動留下模型、延遲、token、成本與自訂欄位；它也能用 managed credits 或 BYOK 路由與 fallback。"
description: "拆解 Helicone 的 Gateway、非同步紀錄、request／session／trace 資料模型、成本分析、自架架構，以及它和 LiteLLM、Portkey、LangSmith 的責任邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-helicone-llm-observability-en)

[Helicone](https://github.com/Helicone/helicone) 是開放原始碼的 LLM Gateway 與觀測平台。它位在應用程式與模型供應商之間，轉送請求的同時記錄模型、延遲、token、成本、錯誤與應用自訂欄位，讓工程團隊可以從一次失敗回答一路追到實際 API 呼叫。

它和純 tracing SDK 的差別在資料路徑。最直接的整合是把 OpenAI client 的 `baseURL` 指向 Helicone；Gateway 因此看得到完整 request／response，也能做路由、fallback 與 rate limit。若資料不能經過 proxy，官方另提供非同步紀錄，但此時部分 Gateway 能力就不在主要請求路徑上。

本文沿著一個 LLM request 的生命週期說明：先選接入方式，再建立可查詢的 request、session 與 trace，接著把成本和回饋接起來，最後處理資料邊界與自架維運。若你要的是集中控制多家模型，而不是以追蹤為主，先讀 [LiteLLM](/posts/ai/2026-08-22-litellm-gateway) 與 [Portkey](/posts/ai/2026-08-22-portkey-ai-gateway) 專文。

## 兩條接入路徑：Gateway 或非同步紀錄

[官方 quickstart](https://docs.helicone.ai/getting-started/quick-start)目前主推 OpenAI 相容的 AI Gateway。應用只要更換 endpoint 與 API key，就能透過同一介面呼叫多家模型；可以使用 Helicone credits，也可以帶入自己的供應商金鑰（BYOK）。

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://ai-gateway.helicone.ai',
  apiKey: process.env.HELICONE_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: '整理這份客服紀錄。' }],
});
```

另一種 [Gateway integration](https://docs.helicone.ai/getting-started/integration-method/gateway) 保留原供應商憑證，透過 `Helicone-Target-Url` 指定目的地。這適合已經有企業合約或區域端點的團隊。兩種方式都要先釐清：誰持有上游 key、誰計費、請求會經過哪個區域，以及 fallback 後實際使用哪家供應商。

若政策不允許 prompt 經過 Helicone proxy，可採 [async logging](https://docs.helicone.ai/getting-started/integration-method/openai)：模型請求仍由應用直送供應商，遙測再另外送出。這降低 Gateway 對主要流量的影響，但也失去「在送出前」做快取、路由或限流的能力。接入前不要只問哪個快，先畫出敏感資料實際會走的路。

## Request、session 與 trace：先把關聯 ID 設計好

單筆 request 能回答「這次呼叫花多久、用了多少 token、為何失敗」，卻無法解釋一個 agent 任務的全貌。聊天可能包含多輪 completion；agent 還會有 retrieval、tool call 與重試。Helicone 因此用 session、trace 與自訂 property 把多筆 request 組起來。

最小做法是在後端產生穩定的 session ID，並附上不含個資的功能與環境標籤。不要把 email、完整文件名稱或 access token 當 property；標籤會進分析與搜尋系統，應視為遙測資料而非秘密儲存區。

```ts
const client = new OpenAI({
  baseURL: 'https://gateway.helicone.ai/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
    'Helicone-Session-Id': sessionId,
    'Helicone-Property-Environment': 'staging',
    'Helicone-Property-Feature': 'support-summary',
  },
});
```

實際動作是先挑一條非關鍵流程，把「一次使用者操作」固定成一個 session，再檢查重試與 fallback 是否仍落在同一條 trace。若每次重試都產生新 session，dashboard 的成功率和成本就會被切碎，看到很多 request 卻看不到一次任務到底有沒有完成。

## 成本、延遲與回饋要一起看

Helicone 的 dashboard 能按模型、使用者、property 或時間查看 token、成本與延遲。這比供應商帳單更接近產品語境：帳單只知道某把 key 花了多少，property 可以回答哪個功能、環境或客群造成花費。

成本數字仍是觀測估算，不是會計帳本。模型價格映射缺漏、供應商折扣、快取 token 與新模型上線，都可能讓 dashboard 和最終發票不同。成本分析適合找趨勢與異常；月底對帳仍應回到供應商帳單，並抽樣比對一批 request 的 token 與費率。

觀測也不能停在「API 沒報錯」。回答可能成功回傳，品質卻不合格。把 thumbs up/down、人工標記或程式規則寫成 feedback，才能比較 prompt 或模型版本。今晚能做的最小閉環是：將一批負面回饋 request 匯成 dataset，修 prompt 後重跑，而不是只在 dashboard 看紅色曲線。

## Gateway 路由不是模型品質保證

[Provider Routing](https://docs.helicone.ai/gateway/provider-routing)會依 model registry 找出可供應同一模型的 provider，優先使用 BYOK，再使用 managed credits，並在 rate limit、逾時或伺服器錯誤時嘗試下一個來源。這能提高 transport 層可用性，但不保證不同 host 上的模型版本、系統 prompt 或輸出行為完全一致。

Fallback 前要保存實際 provider、模型識別、嘗試次數與錯誤原因。對結構化輸出或 tool calling，還要用相同 golden prompts 驗證每個路徑；若備援模型無法通過 schema，就讓請求明確失敗，不要用「可用性」換成靜默的錯誤資料。

Helicone 的快取與 rate limit 也在 Gateway 層。快取適合確定性高、資料不敏感的請求；含使用者權限或即時資料時，cache key 必須包含真正影響答案的範圍。限流則應以可信任的 server-side user ID 或 API key 套用，不能相信瀏覽器自行填的 header。

## 自架不是一個 container 就結束

Helicone repo 採 Apache-2.0，並提供 Docker Compose 起步。依[官方架構說明](https://github.com/Helicone/helicone#self-hosting-open-source-llm-observability)，完整系統包含 Web、proxy worker、收集服務、Supabase、ClickHouse 與 MinIO；正式 Helm 部署則需企業支援。這表示「可以自架」不等於「只有一個 binary」。

ClickHouse 承擔分析查詢，物件儲存保存 log payload，應用資料與驗證還有各自的服務。正式環境要自己處理保留期限、備份還原、升級、資料刪除、TLS、SSO、監控與容量。若只是想避免 SaaS，卻沒有能力照顧這些元件，可能只是把供應商風險換成自己的 on-call。

最重要的資料決策是「要不要保存 prompt 與 response」。除錯時全文最有用，也最可能包含個資與商業秘密。先從 metadata-only 或遮罩後紀錄開始；用一筆假的敏感資料跑完整流程，確認 dashboard、export、備份與刪除 API 裡都找不到原文，再決定是否放寬。

## 適合與不適合

Helicone 適合想用很小接入成本取得 request-level 觀測、成本歸屬與 Gateway routing 的團隊；尤其適合已用 OpenAI 相容 client，且希望從「看 API log」逐步走向 session、feedback 與 dataset 的產品。

它不適合只需要 OpenTelemetry 基礎 trace、完全不想讓第三方處理內容，或不願承擔完整自架分析堆疊的團隊。若核心問題是複雜 agent trajectory 與離線／線上 evaluation，LangSmith 的資料模型更靠近實驗流程；若核心問題是多租戶 key、預算與供應商治理，LiteLLM 或 Portkey 更像控制平面。

Helicone 的核心取捨很直接：讓 LLM request 經過同一入口，換得最低摩擦的可觀測性。選它之前應先回答的不是「dashboard 好不好看」，而是 proxy 能否進資料路徑、哪些內容允許被記錄，以及誰負責把 traces 真的變成品質迴圈。

## 參考資料

- [Helicone GitHub repository](https://github.com/Helicone/helicone)
- [Helicone Quickstart](https://docs.helicone.ai/getting-started/quick-start)
- [Helicone Gateway Integration](https://docs.helicone.ai/getting-started/integration-method/gateway)
- [Helicone OpenAI Async Logging](https://docs.helicone.ai/getting-started/integration-method/openai)
- [Helicone Provider Routing](https://docs.helicone.ai/gateway/provider-routing)
- [LiteLLM 專文](/posts/ai/2026-08-22-litellm-gateway)
- [Portkey 專文](/posts/ai/2026-08-22-portkey-ai-gateway)
