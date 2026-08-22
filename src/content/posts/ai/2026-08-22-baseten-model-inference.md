---
title: "Baseten：從 Truss 打包到 Autoscaling 的模型推論生命週期"
date: 2026-08-22
category: ai
type: deep-dive
tags: [baseten, model-inference, truss, autoscaling, gpu, llm]
lang: zh-TW
tldr: "Baseten 把自訂模型的打包、GPU 部署、推論引擎、autoscaling 與發布流程收進同一平台；價值不在多一個 OpenAI API，而是讓 ML 團隊保留 runtime 控制權，同時少維護一層 GPU orchestration。"
description: "沿著模型推論生命週期拆解 Baseten：Truss 如何封裝模型、Model APIs 與專屬 deployment 的差別、serving engine 和 scale-to-zero 怎麼選，以及與 Sail、Fireworks、Together、Cerebras 的取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-baseten-model-inference-en)

[Baseten](https://docs.baseten.co/concepts/whybaseten) 是託管模型推論平台。你把權重、Python 程式、系統套件、GPU 規格與 serving engine 交給它，平台負責建置映像、配置算力、掛上 API、autoscaling、版本發布與觀測。

截至 2026-08，Baseten 有兩條正式路徑。**Model APIs** 是不用部署的共享模型目錄，以 OpenAI-compatible endpoint 和 token 計價。**deployed model endpoints** 則讓你用 Truss 部署自訂權重與程式，自己選 GPU、scale policy 和 engine。Chains 仍是 Truss 可部署的多步推論 endpoint，但不是使用 Baseten 的必要起點。

所以 Baseten 的核心競爭對手不是只有「模型 API」。它真正替代的是一整段內部平台：Docker image、GPU node pool、weights cache、load balancer、autoscaler、rollout、logs 和 metrics。若只想呼叫熱門開放模型，Model APIs 就夠；若模型或 runtime 是產品差異，才需要走完整部署生命週期。

## 一、Package：Truss 是可重現的模型伺服器規格

[Truss](https://docs.baseten.co/development/model/overview) 是 Baseten 開放原始碼的打包工具。最小專案有 `model/model.py` 與 `config.yaml`：`load()` 在 replica 啟動時載入權重，`predict()` 處理每次請求；config 則固定 Python／apt 依賴、GPU、記憶體、環境變數與 secrets。

```python
class Model:
    def load(self):
        from transformers import pipeline
        self.pipe = pipeline("sentiment-analysis")

    def predict(self, model_input):
        return self.pipe(model_input["text"])
```

```yaml
model_name: sentiment-demo
python_version: py311
requirements:
  - transformers==4.55.0
  - torch==2.7.1
resources:
  use_gpu: true
  accelerator: L4
```

用 `truss push --watch` 建 development deployment 並同步修改；確認後用 `truss push --promote` 建 published deployment 並推進 production。官方文件說 development 固定最多一個 replica，也不支援 gRPC 與 TensorRT-LLM build；它是迭代環境，不是壓測替身。

## 二、Deploy：部署版本和流量入口分開

每次 `truss push` 產生 immutable deployment，environment（例如 production、staging）才是應用程式長期呼叫的入口。這個切法讓你先對新 deployment 驗證，再改 environment routing；[canary deployment](https://www.baseten.co/blog/canary-deployments-on-baseten/)則能逐步移流量並回滾。

最小呼叫用 server-side API key：

```bash
curl -X POST \
  "https://model-${MODEL_ID}.api.baseten.co/environments/production/predict" \
  -H "Authorization: Api-Key ${BASETEN_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"text":"Baseten packaged this model."}'
```

[官方呼叫文件](https://docs.baseten.co/inference/calling-your-model)明確建議從 server 端呼叫，因為 client-side 會洩漏 API key，專屬 endpoint 也未提供一般瀏覽器需要的 CORS headers。團隊、environment 與 API key 必須分權；不要把 workspace 級 key 塞進前端或 notebook。

## 三、Engine：先看模型形狀，再追 benchmark

Truss 可以包任意 Python server，也支援 vLLM、SGLang、Triton 與 TensorRT-LLM。對支援的文字模型，Baseten 推薦自家的 [TensorRT-LLM Engine-Builder](https://docs.baseten.co/examples/tensorrt-llm)。它在部署時建 engine，支援 tensor parallel、KV cache 和量化，並暴露 OpenAI-compatible endpoint。視覺語言模型不在 Engine-Builder 支援範圍時，官方建議改用 vLLM。

這裡不能只問「哪個 engine 最快」。先用實際 prompt 長度和 output 長度測 TTFT、inter-token latency、throughput、GPU memory 與答案品質。量化和最大 context 會改 build 產物；換 GPU、GPU 數量或 system package 也必須 full redeploy，不能靠 hot reload。

Model APIs 則完全跳過這一層。[Inference API 文件](https://docs.baseten.co/reference/inference-api/overview)說明它使用共享 GPU cluster，提供單一 OpenAI-compatible URL，並按百萬 token 計價。它適合原型與可替換模型；專屬 deployment 適合 fine-tune、自訂 preprocessing、固定容量或合規隔離。

## 四、Scale：scale-to-zero 是成本選項，也是延遲選項

[Autoscaling 文件](https://docs.baseten.co/deployment/autoscaling/overview)的預設是 min replicas 0、max replicas 1、concurrency target 1。replica 為零時不收費；新請求會排隊，經過排程、容器啟動、權重載入 GPU 才能服務，而且 wake-up 期間開始計費。

因此低頻非同步任務可以 scale to zero，聊天、語音或互動式 coding 則應保留 warm replica。調整順序也很重要。先用單 replica load test 找出安全 concurrency，再設定 target。短 autoscaling window 負責快速擴張，較長 scale-down delay 避免流量短暫下降就回收 GPU。`max_replicas` 同時是容量上限與帳單保險絲。

[Cold start 文件](https://docs.baseten.co/deployment/autoscaling/cold-starts)把等待拆成 Waking up 與 Loading model。若後者最慢，就縮小 image、用 weights config 鏡像權重，並減少 `load()` 工作。若產品不能接受任何冷啟動，唯一誠實做法是 `min_replicas >= 1`。不要期待 autoscaler 消除物理成本。

## 五、Operate：觀測的是 request lifecycle，不只 GPU utilization

生產 dashboard 至少要同時看請求率、queue time、TTFT、服務時間、錯誤率、replica 數、GPU utilization 與記憶體。只看 GPU 很容易誤判：queue 可能已爆，但某個長 context request 仍讓平均 utilization 看起來合理。

發布時把 model revision、Truss config、engine build、GPU SKU 與 autoscaling 設定一併版本化。Canary 不只看 5xx；還要比較 output schema、延遲分位數、tokens/s 和業務品質。Chains 適合需要把多個 model／Python component 放進可觀測 DAG 的流程；若只是兩個 HTTP call，一般 application orchestrator 更容易搬遷。

安全上，Baseten 提供 team-scoped keys、secrets 與 restricted environments。但模型 endpoint 仍要在你自己的 gateway 前面做使用者驗證、rate limit、payload 上限與預算控制。Model APIs 的 budget 不會自動限制 dedicated deployment，兩種成本面要分開管。

## 採用與融資數字要怎麼看

Baseten 在 2026 年二月的[官方 Series E 公告](https://www.baseten.co/blog/announcing-baseten-s-300m-series-e/)宣布募得 3 億美元，估值 50 億美元。

公司另稱前一年 inference volume 成長 100 倍。公告列出的客戶包含 Abridge、Clay、Cursor、OpenEvidence、Mercor 與 Notion。

這些是公司自報，volume 也沒有公開計算口徑。它能證明資本與需求，不能證明你的模型會達標。

Series D 公告所稱「95% bakeoff 勝出」是 vendor benchmark。

公告另稱效能高 40–50%，但沒有逐案例方法學；本文不拿它做跨供應商結論。真正可採用的數字必須來自你自己的模型、流量形狀與 SLO。

## 與 Sail、Fireworks、Together、Cerebras 怎麼選

| 優先需求 | 先看 | 克制判斷 |
|---|---|---|
| 自訂 Python runtime、任意模型類型、完整 deployment lifecycle | Baseten | Truss 和專屬 endpoint 給最大軟體彈性，也要求團隊理解 engine、GPU 與 scaling |
| 長時間 agent 可接受排隊，追求每 token 成本 | Sail | [官方定位](https://sail.computer/)允許用 flex priority 交換約一分鐘延遲；偏共享開放模型與 LoRA，不是通用自訂 server |
| 共享 API 起步，再升 on-demand GPU | Fireworks | [官方文件](https://fireworksai-docs.mintlify.app/guides/inference-introduction)把 serverless 與 dedicated 分得清楚，LLM API 路徑直接 |
| endpoint／deployment／config 分離與 A/B routing | Together | [Dedicated Model Inference](https://www.together.ai/blog/configuring-dedicated-model-inference)把 engine、GPU、replica 與 capacity-aware routing 做成正式物件 |
| 支援模型剛好在目錄，極低生成延遲優先 | Cerebras | [官方 model catalog](https://inference-docs.cerebras.ai/models/overview)的 wafer-scale API 很快，但共享 production model 範圍比 GPU 平台窄 |

不要用單一 tokens/s 排名。Baseten 的選型價值是「把你的模型變成可營運服務」。Sail 強調容忍延遲的 agent 經濟，Fireworks／Together 強調 LLM inference product，Cerebras 則用專用硬體換速度。先判斷你需要自訂 runtime 還是只需要模型輸出，供應商清單會立刻少一半。

## 適合、不適合與最後判斷

Baseten 適合已有模型或 fine-tune、需要自訂 preprocessing／postprocessing、流量會跨過單 GPU，且不想自己維護 Kubernetes inference platform 的團隊。Truss 也讓部署規格留在 repository，比只在 console 點設定容易 review。

不適合的情況也很清楚。只呼叫一個熱門模型且流量小，用 Model APIs 或其他 serverless API 更簡單。GPU 長期滿載且團隊已有成熟平台，自架可能更便宜。需要特定主權雲或完全 on-prem 時，則先確認 enterprise deployment 範圍，不要從一般 SaaS 文件推定。

最後的判斷式是：**模型 runtime 的控制權，值不值得你承擔 GPU 與 engine 的選型責任？**

值得，就用 Truss、專屬 deployment 和 canary 把生命週期做完整。不值得，就停在 Model APIs。不要為了「可控制」先買一套暫時用不到的控制面。

## 參考資料

- [Developing a model on Baseten](https://docs.baseten.co/development/model/overview)（Truss、Model class、development／published deployment）
- [Deploy and iterate](https://docs.baseten.co/development/model/deploy-and-iterate)（watch、hot reload、production promotion 與限制）
- [Inference API overview](https://docs.baseten.co/reference/inference-api/overview)（Model APIs、自訂 model 與 Chains endpoint）
- [Autoscaling](https://docs.baseten.co/deployment/autoscaling/overview) 與 [Cold starts](https://docs.baseten.co/deployment/autoscaling/cold-starts)（replica、scale-to-zero、計費與啟動階段）
- [Deploy LLMs with TensorRT-LLM](https://docs.baseten.co/examples/tensorrt-llm)（Engine-Builder 能力與模型範圍）
- [Call your model](https://docs.baseten.co/inference/calling-your-model)（API authentication、endpoint 與 server-side 建議）
- [Introducing canary deployments](https://www.baseten.co/blog/canary-deployments-on-baseten/)（流量轉移與 rollback）
- [Baseten $300M Series E](https://www.baseten.co/blog/announcing-baseten-s-300m-series-e/)（公司自報融資、volume 與客戶）
- [Sail Research](https://sail.computer/)、[Fireworks inference introduction](https://fireworksai-docs.mintlify.app/guides/inference-introduction)、[Together dedicated inference](https://www.together.ai/blog/configuring-dedicated-model-inference)、[Cerebras supported models](https://inference-docs.cerebras.ai/models/overview)（同層產品公開定位）
