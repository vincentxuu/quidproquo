---
title: "SGLang 自架推論服務：RadixAttention、OpenAI API 與多 GPU 部署"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sglang, llm-serving, inference, gpu, self-hosted, openai-api]
lang: zh-TW
tldr: "SGLang 是專攻生成式模型的推論引擎：用 RadixAttention 重用共同前綴的 KV cache，提供 OpenAI 相容 API、結構化輸出與多 GPU 平行化；它解決的是高吞吐 LLM serving，不是完整的產品後端。"
description: "介紹 SGLang 的推論執行模型、RadixAttention、OpenAI 相容伺服器、結構化輸出、多 GPU 部署方式，以及和 vLLM、Triton、Ray Serve 的分工。"
series:
  name: "自架推論服務"
  order: 3
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-sglang-inference-server-en)

[SGLang](https://docs.sglang.io/) 是為大型語言模型與多模態生成模型設計的推論框架。它把模型執行引擎、OpenAI 相容 HTTP API、平行化與快取策略包在一起，讓應用程式可以把原本呼叫雲端模型的 client，改接到自己的 GPU endpoint。

它最適合「模型已經選定，現在要把每張 GPU 的 token 吞吐榨出來」這類問題。驗證登入、租戶配額、業務工作流與跨服務流量治理仍要由 API gateway、Kubernetes、Ray Serve 或其他平台處理。

## 核心設計：共同前綴不是重算一次

LLM 推論分成 prefill 與 decode。長 system prompt、固定 few-shot 範例和多輪對話歷史，常讓不同請求擁有相同前綴；每次從頭算會浪費 GPU。SGLang 的核心設計 [RadixAttention](https://arxiv.org/abs/2312.07104) 用 radix tree 管理 KV cache，讓伺服器辨認並重用共同前綴，也能在記憶體壓力下淘汰快取。

這不等於每個工作負載都會等比例加速。請求若幾乎沒有共同前綴，能重用的 KV cache 就少；若 prompt 很短，瓶頸也可能落在 decode 或模型本身。評估時要用真實的 prompt 長度、並行度與共享前綴比例，不要只看別人的單一 benchmark。

SGLang 也支援 continuous batching、量化、推測式解碼、結構化輸出，以及 tensor、pipeline、expert 等平行化方式。這些能力都在同一個 serving layer，但開越多最佳化，模型相容性與除錯面積也會跟著增加。

## 用 OpenAI 相容 API 起一個服務

官方的 [OpenAI-compatible APIs](https://docs.sglang.io/basic_usage/openai_api_completions.html) 讓既有 SDK 不必改寫協定。最小啟動方式如下；正式環境應固定模型 revision、限制網路入口，並先確認權重授權。

```bash
python -m sglang.launch_server \
  --model-path Qwen/Qwen3-8B \
  --host 0.0.0.0 \
  --port 30000
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:30000/v1",
    api_key="local-placeholder",
)

response = client.chat.completions.create(
    model="Qwen/Qwen3-8B",
    messages=[{"role": "user", "content": "用三點解釋 KV cache"}],
    temperature=0.2,
)
print(response.choices[0].message.content)
```

相容 API 降低的是 client 遷移成本，不代表每個供應商擴充欄位都會一致。上線前要把串流、tool calling、JSON schema、停止條件和錯誤格式逐項加入契約測試。

## 多 GPU 與多節點不是多打一個參數而已

[Server Arguments](https://docs.sglang.io/advanced_features/server_arguments.html) 集中列出 tensor parallel、資料平行與分散式初始化等設定。模型放不進單張 GPU 時，可先用 tensor parallel 拆權重；吞吐不足但單一 replica 放得下時，資料平行通常比較直觀。跨節點還要處理高速互連、容器映像、權重下載、節點故障與健康檢查。

真正要量的至少有首 token 延遲、每個輸出 token 的時間、吞吐、GPU 記憶體、錯誤率與佇列長度。只追求總 tokens/s，可能得到一個壓測很好看、互動卻很慢的服務。

## 和 vLLM、Triton、Ray Serve 的分工

- **vLLM**：與 SGLang 位於最接近的一層，兩者都是通用 LLM serving engine。應以自己的模型、prompt 分布與硬體做 A/B benchmark。
- **NVIDIA Triton**：更像多框架模型伺服器，擅長 model repository、動態批次、模型版本與 ensemble；服務傳統模型或混合 pipeline 時更自然。
- **Ray Serve**：處理的是服務編排、Python deployment graph、replica 與叢集資源。它可以把 SGLang 當底層 LLM engine，而不是非得二選一。

如果只是在筆電跑小模型，Ollama 或 llama.cpp 通常省事。若 GPU 服務已有穩定流量、prompt 有大量共同前綴，或需要細調 LLM 排程，SGLang 才真正進入甜蜜點。

## 上線前先做這四件事

先建立一小套固定請求，包含長 system prompt、多輪對話、短問答、結構化輸出與最大 context。接著分別量冷啟動與暖機後結果，再逐步增加並行度，最後做 GPU OOM、client 中斷和 worker 重啟測試。這四步比抄一張公開排行榜更能告訴你 SGLang 是否適合自己的流量。

SGLang 的取捨很清楚：它用專門化換來生成式模型的效能與控制力，也把 GPU 容量規劃、模型相容性和服務可靠性留給部署者。沒有持續流量或 GPU 維運能力時，自架仍可能比按量 API 更貴。

## 參考資料

- [SGLang Documentation](https://docs.sglang.io/)
- [SGLang OpenAI-Compatible APIs](https://docs.sglang.io/basic_usage/openai_api_completions.html)
- [SGLang Server Arguments](https://docs.sglang.io/advanced_features/server_arguments.html)
- [SGLang Structured Outputs](https://docs.sglang.io/advanced_features/structured_outputs.html)
- [SGLang: Efficient Execution of Structured Language Model Programs](https://arxiv.org/abs/2312.07104)
- [本站：vLLM 自架推論的成本門檻](/posts/ai/2026-08-21-vllm-self-host-decision)
