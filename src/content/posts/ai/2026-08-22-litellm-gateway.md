---
title: "LiteLLM：從 Python SDK 到自架 AI Gateway 的多模型控制層"
date: 2026-08-22
category: ai
type: deep-dive
tags: [litellm, ai-gateway, llm-routing, openai-compatible, llm, self-hosted]
lang: zh-TW
tldr: "LiteLLM 不是模型供應商，而是一套可當 Python SDK 或自架 Proxy 使用的統一介面：把 100+ 家 LLM API 轉成一致格式，並在 Gateway 層集中處理路由、fallback、虛擬金鑰、預算與觀測。"
description: "深入介紹 LiteLLM 的 Python SDK 與 Proxy Gateway、路由與 fallback、預算控管、觀測整合，以及它和 OpenRouter 等雲端聚合 API 的差別。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-litellm-gateway-en)

[LiteLLM](https://github.com/BerriAI/litellm) 不是另一家賣 token 的模型供應商。它是一層放在應用程式與模型 API 中間的開放原始碼介面：小專案可以把它當 Python 套件，團隊則能把同一套能力架成集中式 AI Gateway。官方目前宣稱支援 [100+ 家 LLM provider](https://docs.litellm.ai/)，並把輸入、輸出與例外盡量整理成 OpenAI 相容格式。

這個定位很重要。OpenRouter、Together 或 Fireworks 主要提供雲端推論與帳務；LiteLLM 的核心價值是讓你保留自己的 OpenAI、Anthropic、Bedrock、Vertex AI 等帳號，再自行決定流量怎麼走、誰能用、花多少錢，以及紀錄送去哪裡。

## 先分清楚兩種 LiteLLM

LiteLLM 有兩種使用方式，解決的問題不同。

**Python SDK** 直接裝進應用程式。程式呼叫 `completion()`，模型名稱用 `provider/model` 表示；LiteLLM 負責把參數送到各家 API，再把回應與錯誤轉成較一致的型別。這適合單一 Python 服務、原型或 agent：少裝幾套 SDK，又不必維運另一個網路服務。

```python
from litellm import completion

response = completion(
    model="anthropic/claude-sonnet-4-5-20250929",
    messages=[{"role": "user", "content": "Summarize this incident."}],
)
print(response.choices[0].message.content)
```

**Proxy Server（AI Gateway）** 是獨立服務。各語言的應用程式用 OpenAI SDK 指向它，真正的供應商金鑰只放在 Gateway。官方把 Proxy 定位為平台團隊使用的中央入口，功能包含驗證、虛擬金鑰、多人費用追蹤與管理介面；這些不是單純換一個 `base_url` 就會自動得到的能力。[官方入門頁也把 SDK 與 Proxy 分成「應用程式內整合」和「集中式 Gateway」兩條路](https://docs.litellm.ai/)。

```text
App / Agent / IDE
        │ OpenAI-compatible request
        ▼
  LiteLLM Proxy
   ├─ auth / budget / logs
   ├─ route / retry / fallback
   └─ provider credentials
        │
        ├─ OpenAI / Anthropic
        ├─ Bedrock / Vertex AI
        └─ Together / Fireworks / self-hosted model
```

## 統一介面有用，但不是抹平所有差異

LiteLLM 的設計哲學是把共同部分收斂，而不是假裝每個模型都一樣。聊天、串流、embedding、圖片、音訊與 Responses API 等端點可以走相近的呼叫方式；官方文件也說明，跨供應商錯誤會映射到 OpenAI 的例外型別。這讓上層的重試與錯誤處理比較穩定。

代價是 provider 特有功能仍可能需要額外參數，而且同名能力不保證語意完全相同。Bedrock 的 AWS 身分驗證、Vertex AI 的專案與區域、Anthropic 的快取機制，不會因為外面套了 OpenAI 格式就消失。比較務實的做法是：共通路徑使用統一介面，真正依賴特定供應商的功能則保留整合測試，不把「格式相容」誤認成「行為相同」。

## 路由、重試與 fallback 是三件事

LiteLLM Router 可以把同一個邏輯模型名稱綁到多個 deployment。請求進來後，路由策略選擇其中一個；失敗時先依規則重試，部署持續出錯可以進入 cooldown；仍無法完成才切到 fallback 模型。

[官方路由文件](https://docs.litellm.ai/docs/routing)列出加權選擇、rate-limit aware、latency-based、least-busy 與 lowest-cost 等策略，並建議 production 預設採 `simple-shuffle`。這和「用分類器判斷題目難度，再選便宜或昂貴模型」不同：前者主要在多個 deployment 之間分流，後者是應用層的任務路由。兩者都能做，但不要混成一個概念。

Fallback 也不只是「任何錯誤都換模型」。LiteLLM 可分開設定一般 fallback、context window fallback 與 content policy fallback；[官方 reliability 文件](https://docs.litellm.ai/docs/proxy/reliability)也允許逐次請求或逐把金鑰停用 fallback。這很實用，因為付款或資料抽取工作可能寧可失敗，也不能悄悄換到行為不同的模型。

## 虛擬金鑰與預算，讓 Gateway 成為控制平面

Proxy 可以對外發 LiteLLM 虛擬金鑰，避免把上游供應商憑證散到每個服務。金鑰可限制模型、RPM／TPM 與預算，也能歸屬到使用者或團隊。依[虛擬金鑰文件](https://docs.litellm.ai/docs/proxy/virtual_keys)，啟用持久化的金鑰與費用追蹤需要 PostgreSQL，並以 master key 建立其他金鑰。

預算不是只有 dashboard 報表。[官方預算文件](https://docs.litellm.ai/docs/proxy/users)說明，虛擬金鑰超過 `max_budget` 後會拒絕請求；也可設定週期，讓額度定期重設。換句話說，團隊能為 staging、內部工具與正式產品分開發 key，今晚就能做的最小動作是：先替非 production 工作負載設一把有模型白名單與月上限的 key，不要讓所有服務共用 master key。

費用控管仍有邊界。LiteLLM 是依模型定價資料與回傳用量估算成本，不等於供應商最後帳單；特殊折扣、快取、批次計價或供應商改價都可能造成差異。它適合做即時護欄與歸屬分析，月底對帳仍應以雲端帳單為準。

## 觀測是出口，不是完整分析產品

SDK 和 Proxy 都能透過 callback 把成功、失敗、延遲、token 與成本資料送到外部系統。[官方首頁列出的整合](https://docs.litellm.ai/)包括 Langfuse、MLflow、Helicone 與自訂 callback。LiteLLM 在這裡扮演採集與轉送層；要做 trace 搜尋、評估資料集、prompt 版本比較，仍需要 Langfuse 之類的觀測平台。

這個分工也帶來隱私風險：如果 callback 紀錄完整 prompt 和 response，敏感資料會再流向一個系統。上線前至少要確認哪些欄位會送出、保留多久、失敗時是否阻塞主要請求，並用一筆含假敏感資料的測試 trace 實際查看下游內容。

## 它和 OpenRouter、9Router 的差別

| 工具 | 主要角色 | 上游帳務與金鑰 | 適合情境 |
|---|---|---|---|
| [LiteLLM](https://github.com/BerriAI/litellm) | SDK 或自架 Gateway | 通常由你直接持有 | 團隊要統一 API、權限、預算與觀測 |
| OpenRouter | 託管式模型聚合 API | 在 OpenRouter 集中儲值或使用其支援的 BYOK | 想用一組雲端 API 快速接多模型 |
| [9Router](/posts/ai/2026-05-09-9router-ai-coding-router-introduction) | 偏個人與 coding CLI 的本地路由器 | 本機保存訂閱 OAuth 與 API key | 想把 Claude Code、Cursor 等工具接到多個來源 |

LiteLLM 也可以把 OpenRouter 當成其中一個上游，所以它們不是互斥選項。真正的選擇是誰負責控制平面：不想維運 Gateway、只求最快接入，就選託管聚合 API；已經有多雲帳號、資料邊界或團隊配額需求，LiteLLM 才開始顯出價值。

## 整體來說

LiteLLM 最值得用的地方，不是「支援很多模型」，而是把呼叫格式、可靠性、身分、成本與遙測收進同一個可自架入口。Python SDK 適合先驗證介面；當第二個服務也需要相同的 fallback、預算和紀錄政策時，再把設定搬到 Proxy，會比第一天就架完整控制平面務實。

它不適合只有一個 provider、單一服務、流量很小的專案，也不會替你消除各模型的能力差異。Gateway 本身還會成為新的關鍵服務：資料庫、升級、擴充、Redis 與憑證管理都需要維運。把這筆成本算進來，才是 LiteLLM 與雲端聚合 API 之間真正的取捨。

延伸閱讀：[Multi-Model Routing 開源工具與實作](/posts/ai/2026-04-02-multi-model-routing-opensource-tools)與[2026 年 LLM Inference 服務商免費額度與定價](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)。

## 參考資料

- [LiteLLM 官方文件：Getting Started](https://docs.litellm.ai/)
- [LiteLLM GitHub repository](https://github.com/BerriAI/litellm)
- [LiteLLM Router：Load Balancing](https://docs.litellm.ai/docs/routing)
- [LiteLLM Proxy：Fallbacks](https://docs.litellm.ai/docs/proxy/reliability)
- [LiteLLM Proxy：Virtual Keys](https://docs.litellm.ai/docs/proxy/virtual_keys)
- [LiteLLM Proxy：Budgets and Rate Limits](https://docs.litellm.ai/docs/proxy/users)
- [站內：9Router 介紹](/posts/ai/2026-05-09-9router-ai-coding-router-introduction)
- [站內：Multi-Model Routing 開源工具與實作](/posts/ai/2026-04-02-multi-model-routing-opensource-tools)
- [站內：LLM Inference 服務商免費額度與定價](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)
