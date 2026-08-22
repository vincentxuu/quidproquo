---
title: "NVIDIA Triton Inference Server：多框架模型、自動批次與推論管線"
date: 2026-08-22
category: tech
type: deep-dive
tags: [triton-inference-server, nvidia, inference, model-serving, gpu, self-hosted]
lang: zh-TW
tldr: "Triton Inference Server 用統一的 HTTP／gRPC 介面服務 TensorRT、ONNX、PyTorch 等模型，核心能力是 model repository、動態批次、instance group 與 ensemble；它適合異質模型平台，不是專為 LLM KV cache 打造的引擎。"
description: "深入介紹 NVIDIA Triton Inference Server 的 model repository、config.pbtxt、動態批次、模型實例、ensemble 與監控，以及它和 SGLang、vLLM、Ray Serve 的邊界。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-triton-inference-server-en)

[NVIDIA Triton Inference Server](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/) 是一套開放原始碼模型伺服器。它用一致的 HTTP／REST 與 gRPC 介面承接 TensorRT、ONNX Runtime、PyTorch、Python 等 backend，並把模型載入、版本、批次、實例配置、pipeline 與監控集中在服務層。

Triton 的重點不是某一種模型跑出最高 tokens/s，而是讓一個平台同時管理影像分類、embedding、排序、語音或客製 Python 前後處理。若服務只有單一 LLM，SGLang 或 vLLM 往往更直接；若產品是一串異質模型，Triton 的抽象才開始值回成本。

## Model repository 是部署契約

Triton 從 [model repository](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_repository.html) 讀取模型。每個模型有自己的目錄，數字子目錄代表版本，`config.pbtxt` 描述輸入輸出、batch 大小、backend 與執行策略。

```text
models/
└── sentiment/
    ├── config.pbtxt
    └── 1/
        └── model.onnx
```

```protobuf
name: "sentiment"
platform: "onnxruntime_onnx"
max_batch_size: 32
input [{ name: "input_ids" data_type: TYPE_INT64 dims: [128] }]
output [{ name: "logits" data_type: TYPE_FP32 dims: [2] }]
dynamic_batching {
  preferred_batch_size: [8, 16]
  max_queue_delay_microseconds: 2000
}
```

這份設定會直接影響相容性與延遲。`dims` 不含 batch 維度，client 傳入的名稱與 dtype 必須吻合；把模型丟進目錄而未驗證 schema，常會在第一個請求才暴露錯誤。部署流程應先用 metadata 與 readiness endpoint 檢查，再送固定 golden requests。

## 動態批次用等待換吞吐

[Dynamic batcher](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html) 會把同一模型的相容請求組成 batch。GPU 一次處理多筆通常比逐筆有效率，但 batcher 必須等請求湊齊，所以 `preferred_batch_size` 與 queue delay 是吞吐和尾端延遲的交換。

不要直接把 batch 設到 GPU 能塞下的最大值。先固定輸入形狀與真實到達率，分別量 batch off、低等待、高等待三組，再看 p95 latency、throughput 與 queue time。離線批次、互動 API 與即時語音的合理設定通常不同。

模型本身不支援 batching 時可用 scheduler 的其他模式；序列模型需要 correlation ID 與 sequence batcher。這也是 Triton 比簡單 Flask wrapper 多出的價值：排程語意由伺服器明確管理。

## Instance group 決定模型如何吃資源

同一模型可以在一張 GPU 上有多個 instance，也能分散到多張 GPU 或 CPU。增加 instance 可能提高並行度，也可能讓權重複製吃掉記憶體、讓 kernel 彼此競爭。正確數量要由 [Model Analyzer](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/model_analyzer/docs/README.html) 或自己的壓測找，不是「每張 GPU 越多越好」。

Triton 的 [architecture](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/architecture.html) 也提供模型控制模式、health endpoint 與 Prometheus metrics。生產環境至少要觀察請求成功率、queue、compute input、compute infer、compute output 與 GPU 使用率，才能區分是排隊、前處理還是模型運算慢。

## Ensemble 把多模型串成伺服器內的 DAG

[Ensemble models](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/ensemble_models.html) 可以把前處理、主模型與後處理串起來，中間 tensor 不必回到 client。影像 resize → 分類 → label lookup，或 tokenizer → encoder → reranker，都適合這種模式。

但 ensemble 不是通用工作流引擎。需要資料庫交易、人工審核、長時間任務、複雜重試或跨服務補償時，應把編排留在應用程式、任務佇列或 Ray Serve。把所有業務邏輯塞進 Python backend，會讓模型服務變成難以測試的單體。

## 啟動與安全邊界

官方容器可以把 repository 掛載後直接啟動：

```bash
docker run --gpus all --rm \
  -p 8000:8000 -p 8001:8001 -p 8002:8002 \
  -v "$PWD/models:/models" \
  nvcr.io/nvidia/tritonserver:<release>-py3 \
  tritonserver --model-repository=/models
```

`<release>` 必須換成團隊驗證並固定的映像 tag。Triton 的推論 port 不應未經保護直接暴露到公網；TLS、身分驗證、租戶配額與 request body 限制通常放在反向代理或 service mesh。模型 repository 也應視為可執行供應鏈資產，尤其使用 Python backend 時更不能接受未審查內容。

## 適合什麼團隊

Triton 適合已有 GPU 平台能力、需要同時服務多種模型格式、希望統一監控與批次策略的團隊。不適合只有一個低流量模型、沒有 GPU 維運人力，或核心需求是 LLM 專用 prefix cache 與 token scheduler 的專案。

選擇它之前，拿最重要的兩個模型建一個 model repository，加入真實輸入與 SLO 壓測，再故意重啟 server、放入錯誤模型版本並觀察回復流程。能跑一次 demo 很容易；能安全換版、定位延遲與回復失敗，才代表平台真的可用。

## 參考資料

- [NVIDIA Triton Inference Server User Guide](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/)
- [Triton Model Repository](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_repository.html)
- [Triton Schedulers and Batchers](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html)
- [Triton Architecture](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/architecture.html)
- [Triton Ensemble Models](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/ensemble_models.html)
- [Triton Model Analyzer](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/model_analyzer/docs/README.html)
