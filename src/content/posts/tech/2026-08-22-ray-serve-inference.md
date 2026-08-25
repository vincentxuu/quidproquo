---
title: "Ray Serve 自架推論服務：Python 服務圖、GPU 排程與自動擴縮"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ray-serve, ray, inference, distributed-systems, gpu, self-hosted]
lang: zh-TW
tldr: "Ray Serve 是建立在 Ray 上的分散式 serving layer：用 deployment 與 handle 組合 Python 服務圖，配置 CPU／GPU replica、自動擴縮與模型多工；它負責編排，不取代 vLLM 或 SGLang 的 LLM 執行引擎。"
description: "介紹 Ray Serve 的 deployment、replica、handle、動態批次、自動擴縮與 LLM serving，並說明它和 SGLang、vLLM、Triton 及 Kubernetes 的分工。"
series:
  name: "自架推論服務"
  order: 5
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-ray-serve-inference-en)

[Ray Serve](https://docs.ray.io/en/latest/serve/) 是 Ray 分散式運算框架上的模型服務層。你用普通 Python 定義 HTTP ingress、前處理、模型 worker 與後處理，Serve 再把每個 deployment 轉成 replicas，交給 Ray 叢集配置 CPU、GPU 與節點。

它處理的核心問題是「一個推論產品如何由多個服務組成並在叢集上執行」，不是「單一 transformer kernel 怎麼跑最快」。因此 Ray Serve 可以包住 vLLM 或 SGLang，也能編排傳統 PyTorch 模型和一般 Python 邏輯。

## Deployment 是可獨立擴縮的服務單位

Ray Serve 用 `@serve.deployment` 宣告服務。deployment 可有多個 replica，每個 replica 是長時間存活的 Ray actor；deployment handle 讓服務彼此呼叫，不必繞出叢集再走 HTTP。

```python
from ray import serve

@serve.deployment(
    ray_actor_options={"num_gpus": 1},
    autoscaling_config={"min_replicas": 1, "max_replicas": 4},
)
class Embedder:
    def __init__(self):
        self.model = load_model()

    async def __call__(self, texts: list[str]):
        return self.model.encode(texts).tolist()

@serve.deployment
class SearchAPI:
    def __init__(self, embedder):
        self.embedder = embedder

    async def __call__(self, request):
        body = await request.json()
        vectors = await self.embedder.remote(body["texts"])
        return {"vectors": vectors}

app = SearchAPI.bind(Embedder.bind())
```

這個邊界讓前端 API 可以按 request 數量擴縮，GPU embedder 則按自己的佇列與資源擴縮。模型只在 replica 啟動時載入，不必每個請求重載；代價是部署者要管理啟動時間、健康狀態與容量。

## 自動擴縮看的是排隊，不是魔法預測

[Autoscaling guide](https://docs.ray.io/en/latest/serve/autoscaling-guide.html) 說明 Serve 會依每個 replica 的進行中與排隊請求調整 replica 數量。`target_ongoing_requests`、上下限、metrics interval 與 smoothing 會共同決定反應速度。

GPU 模型冷啟動可能要下載權重、配置顯存與編譯 kernel。若把最小 replicas 設為零，省下閒置成本的同時，也把冷啟動延遲交給第一批使用者。合理做法是先量模型從容器啟動到 ready 的時間，再依可接受延遲決定下限，而不是看到 autoscaling 就假設能瞬間補容量。

Ray 負責把 replica 放到有足夠資源的節點。跨節點 tensor parallel 或 placement group 還會受到 GPU 拓撲、網路與資源碎片影響；叢集總共有四張 GPU，不代表任意時刻都能排進需要連續四張卡的模型。

## 動態批次適合可合併的 Python 請求

[Dynamic request batching](https://docs.ray.io/en/latest/serve/advanced-guides/dyn-req-batch.html) 透過 `@serve.batch` 把多個 request 合成一個 method call。embedding、影像分類或 reranking 常能因此提高 GPU 使用率。

批次函式必須接收參數清單並回傳等長結果；最大 batch size 與等待時間同樣是在吞吐和延遲間取捨。對 token-by-token 的生成式模型，應優先使用 vLLM／SGLang 自己的 continuous batching，再讓 Ray Serve 負責 replica、routing 與服務圖，不要在兩層重複排程。

## Ray Serve LLM 是編排層加上專用 engine

Ray 的 [LLM serving](https://docs.ray.io/en/latest/serve/llm/) 提供 OpenAI 相容入口、模型設定、routing 與多節點部署，底層 engine 可依官方整合使用。這條路適合已經需要 Ray 叢集，並想把 LLM、guardrail、retrieval 或其他 Python deployment 組成一個應用程式的團隊。

若只是單機一張 GPU 跑一個模型，直接啟動 SGLang 或 vLLM 少一層系統。若需要同時管理多種 backend、版本目錄與 ensemble，Triton 的模型平台抽象可能更貼近需求。Ray Serve 的優勢是 Python 原生的服務組合與叢集資源協調。

## 生產環境還需要 Ray 以外的邊界

[Production guide](https://docs.ray.io/en/latest/serve/production-guide/) 涵蓋配置、容錯、Kubernetes 與相依套件。常見部署是 KubeRay 管 RayCluster／RayService，Ray Serve 管應用程式 replicas；Kubernetes 與 Ray 各有一層 autoscaler，若容量上下限和指標沒有對齊，可能出現 Serve 想加 replica、底層卻沒有節點的等待。

Serve endpoint 不應直接成為公網安全邊界。TLS、WAF、身分驗證、租戶限流和 request size 應由 ingress 或 gateway 處理。Ray dashboard 與叢集控制介面更不應公開；replica 內執行的是 Python 程式碼，依賴套件和模型權重都要納入供應鏈管控。

可觀測性至少拆成四層：入口延遲、deployment queue、replica 處理時間、節點／GPU 資源。只有總 API latency 時，很難判斷是 gateway、Serve 排隊、模型 engine 還是底層擴容慢。

## 什麼時候值得用

Ray Serve 適合已有 Ray 工作負載、需要多模型服務圖、跨節點 GPU 配置、不同元件獨立擴縮，或希望訓練／批次／線上推論共享 Ray 生態的團隊。它不適合用一張 GPU 就能解決的低流量 endpoint，也不會替你消除分散式系統的部署、網路與故障成本。

評估時先做兩個 deployment：一個 CPU 前處理、一個 GPU 模型。用真實請求量出單 replica 容量與冷啟動時間，再設定 autoscaling，最後終止一個 replica 和一個 worker node，確認請求、監控與回復是否符合 SLO。這比一開始就搭完整多模型平台更容易看清 Ray Serve 帶來的價值。

## 參考資料

- [Ray Serve Documentation](https://docs.ray.io/en/latest/serve/)
- [Ray Serve Model Composition](https://docs.ray.io/en/latest/serve/model_composition.html)
- [Ray Serve Autoscaling Guide](https://docs.ray.io/en/latest/serve/autoscaling-guide.html)
- [Ray Serve Dynamic Request Batching](https://docs.ray.io/en/latest/serve/advanced-guides/dyn-req-batch.html)
- [Ray Serve LLM](https://docs.ray.io/en/latest/serve/llm/)
- [Ray Serve Production Guide](https://docs.ray.io/en/latest/serve/production-guide/)
- [Ray on Kubernetes with KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/)
