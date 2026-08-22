---
title: "Amazon Bedrock 深入介紹：把模型 API 放進 AWS 治理邊界"
date: 2026-08-22
category: ai
tags: [amazon-bedrock, aws, llm-api, rag, ai-governance, guardrails]
lang: zh-TW
type: deep-dive
tldr: "Amazon Bedrock 不只是代售多家模型 API；它把模型呼叫、IAM、Region、Knowledge Bases、Guardrails 與 CloudWatch 串成同一套 AWS 控制面。它最適合已在 AWS 上、治理成本比最低 token 單價更重要的團隊。"
description: "從 Converse API、IAM 與跨區推論，到 Knowledge Bases、Guardrails 和可觀測性，拆解 Amazon Bedrock 的設計哲學、實際用法與適用邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-amazon-bedrock-llm-platform-en)

[Amazon Bedrock](https://aws.amazon.com/bedrock/) 是 AWS 的託管式生成式 AI 平台。應用程式可以透過同一個 AWS 帳號呼叫 Amazon Nova、Anthropic Claude、Meta Llama、Mistral 等模型，不必自行部署 GPU；AWS 的最新選型指南把它定位成「以 API 建構與營運 AI 應用及 agent 的無伺服器平台」，和提供更深訓練、容器與運算控制的 SageMaker AI 分工。

真正值得理解的不是 Bedrock 有多少模型，而是它把模型放進既有 AWS 治理邊界：身分用 IAM、稽核用 CloudTrail、指標與紀錄進 CloudWatch 或 S3、私有連線可走 VPC endpoint，資料接地與安全過濾也有同一套服務。對已在 AWS 上的團隊，這些通常比多一個 API key 更重要。

本文按請求流向拆解 Bedrock：先呼叫模型，再決定請求能去哪個 Region，接著掛上企業資料與安全政策，最後看它在哪些情況不值得用。

## 第一層：模型 API，而不是模型主機

Bedrock 的基本路徑是 serverless inference：選一個 AWS Region 與模型 ID，送出請求，按使用量付費。你不需要管理推論執行個體，也無法像自架 vLLM 那樣直接調 GPU、batch scheduler 或量化格式。這個抽象層換來的是較少的基礎設施工作，代價是較少的底層控制。

新應用優先看 [Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)。它用一致的 `messages`、`system`、tool use 與推論參數格式包住支援的模型，切換模型時通常只需換 `modelId`；模型特有功能仍可透過額外欄位傳入。底層的 `InvokeModel` 則保留各家原生請求格式，適合 Converse 尚未涵蓋的能力。

```python
import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")

response = client.converse(
    modelId="YOUR_MODEL_OR_INFERENCE_PROFILE_ID",
    system=[{"text": "Answer briefly and cite uncertainty."}],
    messages=[
        {"role": "user", "content": [{"text": "What should we test before changing models?"}]}
    ],
    inferenceConfig={"maxTokens": 300, "temperature": 0.2},
)

print(response["output"]["message"]["content"][0]["text"])
```

這段程式碼沿用 AWS SDK 的憑證鏈，不需要把長效 API key 寫進環境變數。正式環境應把 `bedrock:InvokeModel` 權限給工作負載角色，並把 Resource 限縮到允許的模型或 inference profile。AWS 的 [IAM 範例](https://docs.aws.amazon.com/bedrock/latest/userguide/security_iam_id-based-policy-examples.html)也明確建議從受管政策起步，再收斂成最小權限。

但「統一 API」不等於模型完全可互換。context window、tool use、結構化輸出、延遲、內容政策與 Region 供應仍然不同。實務上應把模型 ID 放進設定，並用固定的 golden set 做回歸測試；不要在產品程式碼裡假設每個模型都接受同一組功能。

## 第二層：IAM 與 Region 是產品行為的一部分

Bedrock 的模型供應是 Region-specific。某個模型能在維吉尼亞北部使用，不代表東京也有；Knowledge Bases、reranker 或模型客製化的支援範圍也可能不同。架構設計應先選資料與法規允許的 Region，再從該區可用的模型反推選項，而不是先在 playground 挑模型，最後才處理部署位置。

流量需要更大彈性時，可以用 [cross-Region inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html)。Geographic profile 只在指定地理範圍內路由，Global profile 則可能把請求送往全球支援的商用 Region。AWS 文件也提醒：SCP 若封鎖 profile 內任何目的 Region，請求可能失敗。換句話說，跨區推論不是單純的效能開關，而是資料駐留、IAM 與 Organizations 政策共同決定的架構選擇。

Bedrock 的資料保護文件指出，服務不會拿 prompts 與 completions 訓練 AWS 模型，也不會把它們提供給模型供應商訓練；傳輸中與靜態資料均加密。這不代表「完全沒有資料治理工作」：跨區路由的處理位置、各模型的 retention mode，以及你自己開啟的 invocation logging 都要逐項確認。[模型呼叫紀錄](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)預設關閉；開啟後可把完整輸入、輸出與 metadata 寫入同帳號、同 Region 的 CloudWatch Logs 或 S3，因此 log bucket 的存取、保留與敏感資料遮罩本身就是安全設計。

## 第三層：Knowledge Bases 把 RAG 管線產品化

[Knowledge Bases for Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-build.html) 把 RAG 常見步驟包成託管流程：連接資料來源、解析與切塊、用 embedding model 轉成向量、寫入 vector store、同步更新，再用 `Retrieve` 或 `RetrieveAndGenerate` 查詢。它也支援 metadata filter、reranking 與部分多模態資料路徑。

這個設計的好處不是 RAG 變得「免設計」，而是權限與維運責任有清楚落點。Knowledge Base 的 service role 必須能讀資料來源、呼叫 embedding model 並存取 vector store；S3、OpenSearch Serverless、Aurora 或其他後端仍各有成本、索引與權限設定。AWS 文件也要求資料變更後重新同步，所以資料新鮮度仍要有排程或事件流程負責。

適合的情境是資料已在 S3 或 AWS 資料服務、團隊想快速建立有來源歸屬的企業問答，且可以接受 Bedrock 支援的 ingestion 與 retrieval 抽象。不適合的情境是你需要自行控制每一步 chunking、query rewrite、混合檢索評分或非 AWS vector database。那時直接組裝 RAG 管線通常更透明；可延伸閱讀站內的 [RAG 完整模式指南](/posts/ai/2026-03-14-rag-patterns-complete-guide)。

## 第四層：Guardrails 是獨立政策層

[Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-how.html) 可同時檢查使用者輸入與模型輸出，政策包含內容過濾、拒答主題、敏感資訊與字詞過濾，也能掛在一般模型呼叫、Agents 與 Knowledge Bases 上。輸入若被攔截，模型不會執行；輸出違規時，服務會依設定封鎖或遮罩。

它最有價值的地方是把政策從 prompt 抽離。安全團隊可以為不同情境維護不同 guardrail，應用程式只引用版本化的識別碼，不必把禁用規則散落在每個 system prompt。它也不是完整的應用安全方案：授權檢查、工具呼叫參數驗證、租戶資料隔離、輸出事實查核與人工升級仍要在應用層完成。關於縱深防禦，可接著看 [RAG Guardrails：在輸入與輸出之間加上防護層](/posts/ai/2026-03-12-rag-guardrails)。

## Bedrock 跟其他選項差在哪裡

| 選項 | 你買到的核心價值 | 主要代價 |
|---|---|---|
| **Amazon Bedrock** | 多模型 API 加上 IAM、Region、CloudTrail、Knowledge Bases 與 Guardrails | AWS 綁定較深，模型與功能受 Region 支援限制 |
| **模型原廠 API** | 最新功能通常最早上線，文件與模型語意最直接 | 每家憑證、帳務、政策與可觀測性要自己整合 |
| **聚合路由 API** | 用一組介面快速切換大量模型與供應商 | 企業治理要看平台本身提供到哪一層 |
| **SageMaker AI／自架推論** | 訓練、容器、硬體與服務參數控制更深 | 需要承擔更多 ML 與基礎設施營運 |

如果團隊已用 AWS Organizations、IAM Identity Center、CloudTrail、KMS 與 PrivateLink，Bedrock 的優勢會放大：模型流量可以進既有權限與稽核流程。如果只是個人原型、需要最快拿到模型新功能，或主要工作負載根本不在 AWS，原廠 API 或聚合服務往往更直接。價格也不要只看 token 單價；Knowledge Bases、Guardrails、向量庫、跨區策略與 logging 都可能各自產生成本。想先看市場價格輪廓，可參考 [40+ 家 LLM 推論服務免費額度與價格比較](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)。

## 實際選型：先做一條最小請求流

評估 Bedrock 時，不要先把所有功能打開。今晚就能做的版本是：在目標 Region 選一個模型，用工作負載 IAM role 呼叫 Converse API；限制可用模型 ARN；開 CloudTrail，先不要記錄 prompt 內容；再用一組含敏感資料、tool use 與長上下文的測試題比較模型。只有確定需要企業資料接地時才加 Knowledge Bases，需要一致政策時才加 Guardrails。

最後用四個問題收斂決策：資料允許在哪些 Region 處理？哪些 IAM principal 能呼叫哪些模型？是否需要保存完整輸入輸出？團隊願意把多少 RAG 與安全邏輯交給 AWS 託管？如果這四題都指向既有 AWS 治理，Bedrock 很合理；如果答案主要是「跨雲、最新模型、底層可控」，它可能只是多繞一層。

## 參考資料

- [AWS：Amazon Bedrock 或 Amazon SageMaker AI 選型指南](https://docs.aws.amazon.com/pdfs/decision-guides/latest/bedrock-or-sagemaker/bedrock-or-sagemaker.pdf)
- [AWS：使用 Converse API 進行推論](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)
- [AWS：Amazon Bedrock 的資料保護](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html)
- [AWS：Amazon Bedrock IAM 身分政策範例](https://docs.aws.amazon.com/bedrock/latest/userguide/security_iam_id-based-policy-examples.html)
- [AWS：跨 Region 推論](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html)
- [AWS：建立 Knowledge Base 與向量儲存](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-build.html)
- [AWS：Bedrock Guardrails 運作方式](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-how.html)
- [AWS：使用 CloudWatch Logs 與 S3 監控模型呼叫](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)
