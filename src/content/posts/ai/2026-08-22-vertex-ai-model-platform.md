---
title: "Vertex AI：從模型 API 到 Gemini Enterprise Agent Platform"
date: 2026-08-22
category: ai
tags: [vertex-ai, google-cloud, gemini, llm, mlops, model-platform]
lang: zh-TW
type: deep-dive
tldr: "Vertex AI 不是只有 Gemini API，而是把 200+ 個模型的取用、訓練、評估、部署與治理放進同一個 Google Cloud 控制面；2026 年 4 月後，它的產品與後續藍圖已併入 Gemini Enterprise Agent Platform，但 Vertex AI API、文件路徑與既有資源名稱仍大量存在。"
description: "深入介紹 Google Cloud Vertex AI 的產品邊界、Model Garden、Gemini API、自訂模型、MLOps、agent 能力、權限與資料落地限制，並說明 2026 年 Gemini Enterprise Agent Platform 改名後該怎麼理解。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-vertex-ai-model-platform-en)

[Vertex AI](https://cloud.google.com/vertex-ai) 是 Google Cloud 的託管式 AI／ML 平台。它不只是一個呼叫 Gemini 的 API：同一個控制面裡還有模型目錄、訓練、微調、評估、線上推論、pipeline、registry、特徵管理與 agent 工具。真正的賣點不是「多一個聊天模型入口」，而是讓模型從實驗走到正式環境時，沿用 Google Cloud 的 IAM、專案、帳務、網路與稽核機制。

不過，2026 年再談 Vertex AI，第一件事是把名字講清楚。Google 在 2026 年 4 月推出 **Gemini Enterprise Agent Platform**，稱它是 Vertex AI 的演進；官方並明說，往後 Vertex AI 的服務與產品藍圖都會透過 Agent Platform 交付，而非繼續作為獨立服務發展。[官方發布文](https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform)同時也保留了 Vertex AI 原有的模型選擇、模型建置與 agent 建置能力。

所以本文介紹的是大家熟悉的「Vertex AI 能力集合」，但以 2026-08-22 的產品邊界為準。你在 Console、API 名稱與文件網址裡仍會看到 Vertex AI；做新架構規劃時，則應把它視為 Gemini Enterprise Agent Platform 的模型與 ML 底座，而不是另一套平行產品。

## 一張圖看懂它管哪些事

```text
應用程式 / agent
        │
        ├── Gemini、Claude 等託管 API（MaaS）
        ├── 自行部署的開放／商用模型
        └── 自己訓練或微調的模型
                         │
             Model Garden / Registry
                         │
       評估、Pipeline、監控、權限、稽核
                         │
        Google Cloud 專案、資料與運算資源
```

這個分層很重要。Google AI Studio 的 Gemini API 比較像快速取得 Google 模型的開發者入口；Vertex AI／Agent Platform 則處理「模型要跟企業雲端環境一起運作」的問題。若需求只有拿 API key 做原型，前者通常比較省事；若要用 IAM、服務帳戶、區域、集中帳單、私有網路或完整 MLOps，後者才是正確比較對象。

## Model Garden：不是每個模型都用同一種方式交付

[Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models) 是平台的模型入口。官方目前以 **200+ 個模型**描述其目錄，涵蓋 Google 的 Gemini、Imagen、Veo、Gemma，以及合作夥伴與開放模型；它能把模型接到微調、評估與 serving 等既有能力。[Model Garden 官方頁](https://cloud.google.com/model-garden)也強調「發現、客製化與部署」而不只是 API 清單。

但「在 Model Garden 看得到」不代表部署方式相同：

- **Google 第一方模型**通常以託管 API 取用，不需要自己維護 GPU。
- **第三方模型即服務（MaaS）**由平台提供 API，但第一次使用可能要接受供應商條款，價格、區域與功能也各自不同。
- **可自行部署模型**會建立在你的 Google Cloud 專案與運算資源上，控制力較高，也代表容量、GPU 成本與維運責任回到你身上。

因此，Model Garden 解決的是「集中發現與接軌」，不是把所有模型抹平成完全可互換的介面。選模型前仍要逐一確認授權、可用區域、quota、微調方式與資料處理條款。

## Gemini API：同一套 SDK，企業認證方式不同

Google 現在推薦使用 [Google Gen AI SDK](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview)。同一套 SDK 可連 Google AI Studio 的 Gemini Developer API，也可切到 Google Cloud 上的 Vertex AI；後者常用 Application Default Credentials（ADC）與 `roles/aiplatform.user`，不必把長效 API key 塞進正式服務。

```python
from google import genai

client = genai.Client(
    vertexai=True,
    project="YOUR_GOOGLE_CLOUD_PROJECT",
    location="global",
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="用三句話解釋什麼是模型路由。",
)

print(response.text)
```

依[官方 quickstart](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/quickstart)，開始前要啟用計費與 Vertex AI API，並可用 `gcloud auth application-default login` 建立本機 ADC。正式環境應改由執行服務的 service account 取得最小必要權限；不要把個人 ADC 當成部署方案。

這層除了文字生成，也包含多模態輸入、embedding、圖片與影片生成、grounding、內容安全、快取、批次推論與評估等能力。每個模型支援的功能不一樣，程式介面相近不等於功能完全一致。

## 它真正比單一 LLM API 多出的部分

### 自訂模型與完整 ML 工作流

Vertex AI 原本就服務傳統 ML。團隊可以跑 custom training、AutoML、超參數調整，把模型登錄到 Model Registry，再部署到 endpoint。這跟只賣生成式模型 token 的供應商不同：影像分類、預測模型、開放權重 LLM 與 Gemini API 可以由同一套平台治理。

Pipeline、Experiments、Metadata 與 Model Registry 把資料處理、訓練產物、版本和部署串起來。它們的價值在可重現與交接，不在 demo 當下是否少寫幾行程式。若團隊沒有模型訓練需求，這些功能也可能只是額外複雜度。

### 評估、監控與治理

生成式 AI 評估可用自訂準則比較模型或應用；傳統 endpoint 則有模型監控與線上 serving 的工具。再往外一層，IAM、Cloud Logging、Cloud Audit Logs、Cloud KMS 與 VPC Service Controls 能接上組織既有的雲端治理方式。

資料邊界不能只看「Google Cloud 支援 data residency」一句話。[Google Cloud 的現行資料落地清單](https://cloud.google.com/terms/data-residency)明列例外：Grounding with Google Search、Grounding with Google Maps、RAG Engine，以及部分 Agent Runtime、Memory Bank、Sessions、Code Execution Sandbox 與 Agent Evaluations 不在相同承諾內。合規評估要按實際開啟的功能逐項核對。

另一方面，[zero data retention 文件](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention)寫明 Google 不會在未經允許或指示下，使用客戶資料訓練或微調 AI／ML 模型；同一頁也列出 abuse monitoring、快取等會保留資料的情境與停用方式。「不用於訓練」與「完全不留存」是兩件不同的事。

### Agent Platform 是往上加的一層

Gemini Enterprise Agent Platform 把重心從單一模型生命週期往 agent fleet 擴張：Agent Studio、ADK、Agent Runtime、Agent Registry、Identity、Gateway、Observability 與 agent-to-agent orchestration 都在這一層。Google 在 [Next '26 發布內容](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)把它定位成建置、擴展、治理與優化 agent 的統一平台。

不要因此反過來把 Vertex AI 理解成「agent builder」。模型訓練、Model Garden、endpoint 與 MLOps 仍是底座；agent 能力是上層的組合與治理。只要一個文字生成 API 的團隊，不必為了新名稱一次採用整套 agent 工具。

## 跟替代方案怎麼比

| 選項 | 核心價值 | 主要代價 |
|---|---|---|
| Google AI Studio / Gemini Developer API | 最快開始用 Gemini，適合原型 | 企業雲端治理與 ML 工作流較少 |
| Vertex AI／Gemini Enterprise Agent Platform | 模型、訓練、部署、agent 與 Google Cloud 治理整合 | IAM、專案、quota、區域與產品命名較複雜 |
| OpenRouter、Together、Fireworks | 多模型 API 或專用推論服務，切換快 | 不等同完整的雲端 ML 平台 |
| AWS Bedrock | 與 AWS IAM、資料與雲端服務深度整合 | 適合度高度取決於既有雲端落點 |
| LiteLLM、Portkey | 放在應用與供應商之間做路由、觀測與政策 | 本身不取代模型訓練與底層雲端治理 |

最實際的判斷方式是先問：「模型旁邊的資料與運算現在在哪個雲？」若 BigQuery、Cloud Storage、GKE、Cloud Run 和 IAM 已經是主力，Vertex AI 的整合價值很直接。若主要目標是跨供應商找最低價、最快速度或最廣模型清單，路由平台可能更合適，甚至可以把它放在 Vertex AI 前面，而不是二選一。

## 適合與不適合

**適合：** 已在 Google Cloud、有正式 IAM 與稽核需求；同時管理生成式模型與自訂 ML；需要區域、私有連線、評估、registry 或 pipeline；要把 agent 納入集中治理。

**不適合：** 只做週末原型；唯一需求是用 API key 呼叫一個 Gemini 模型；團隊沒有 Google Cloud 經驗，又不需要它的資料與治理整合；最重要的選型條件是跨數十家推論商即時比價與路由。

動手前，先建立一個獨立測試專案，設定 budget alert 與 quota，再用同一份代表性資料測三件事：模型品質、端到端延遲、每次業務任務的實際成本。不要只比較 token 單價；grounding、儲存、endpoint、GPU 與網路費用可能在不同帳單項目裡。

## 整體取捨

Vertex AI 的優勢是「平台完整」，而完整也正是它的負擔。它讓 Gemini、第三方模型、自訂訓練、部署與 Google Cloud 治理共用一套組織邊界；代價是產品面廣、名詞多，而且 2026 年正處於 Vertex AI 轉進 Gemini Enterprise Agent Platform 的過渡期。

如果只記一件事：**不要拿 Vertex AI 跟單一模型 API 做一對一比較。** 它真正競爭的是 Bedrock 這類雲端模型平台；OpenRouter、LiteLLM 或 Portkey 則常是上層路由與控制面。先決定自己需要的是模型、推論入口、ML 平台，還是 agent 治理，再看 Vertex AI 的完整性究竟是槓桿還是負擔。

站內延伸閱讀：

- [2026 年 LLM Inference 服務商免費額度與定價：40+ 家分梯整理](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)
- [OpenRouter、LiteLLM 等開源多模型路由工具比較](/posts/ai/2026-04-02-multi-model-routing-opensource-tools)
- [AI 時代的技術選擇：從模型到基礎設施的閱讀地圖](/posts/tech/2026-08-21-ai-era-tech-choices-guide)

## 參考資料

- [Google Cloud：Introducing Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform)
- [Google Cloud：Welcome to Google Cloud Next '26](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [Google Cloud：Model Garden](https://cloud.google.com/model-garden)
- [Google Cloud 文件：Gemini API in Vertex AI quickstart](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/quickstart)
- [Google Cloud 文件：Google Gen AI SDK](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview)
- [Google Cloud：Services with Data Residency](https://cloud.google.com/terms/data-residency)
- [Google Cloud 文件：Vertex AI and zero data retention](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention)
