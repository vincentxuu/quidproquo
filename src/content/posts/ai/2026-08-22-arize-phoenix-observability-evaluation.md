---
title: "Arize Phoenix：從 Trace 長出 Dataset、Experiment 與 Evaluator"
date: 2026-08-22
category: ai
tags: [arize-phoenix, llm-observability, evaluation, opentelemetry, openinference, ai-agent]
lang: zh-TW
type: deep-dive
tldr: "Phoenix 是 MIT 授權的開源 LLM observability/eval 平台：先用 OpenTelemetry + OpenInference 收 trace，再把 production failure 收進 versioned dataset，以 experiment 比 prompt、model 或 RAG 改動，最後用 code、human 與 LLM evaluator 回寫分數。它不是 Arize AX；自架預設無認證且永久保留資料，正式環境必須先補安全政策。"
description: "從 tracing 到 datasets、experiments、evaluators，拆解 Arize Phoenix 的開源 LLM observability/evaluation 工作流，以及 RAG、agent eval、自架安全與 Arize AX 的分界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-arize-phoenix-observability-evaluation-en)

[Arize Phoenix](https://github.com/Arize-ai/phoenix) 最有價值的地方不是 trace viewer，而是它把四個本來容易斷掉的動作接成迴圈：看到 production trace 的失敗、把案例收進 dataset、對新版跑 experiment、再用 evaluator 判斷是否真的改善。

這個開源專案採 MIT 授權，2026-08-22 實查約 10,100 GitHub stars。Arize 在 2025 年宣布 [7,000 萬美元 C 輪](https://arize.com/blog/arize-ai-raises-70m-series-c-to-build-the-gold-standard-for-ai-evaluation-observability/)時，也自報 Phoenix 每月下載超過 200 萬次。下載量是公司口徑，不等於活躍部署數；但它連同 OpenTelemetry 相容性，說明 Phoenix 已不是只有 notebook demo 的小工具。

## 先分清楚 Phoenix、Phoenix Cloud 與 Arize AX

Phoenix 是開源 LLM observability/evaluation server，可以跑在 laptop、Docker、Kubernetes 或自己的雲端。Phoenix Cloud 是 Arize 代管同一條產品線。**Arize AX** 則是商業 enterprise 平台，不是「Phoenix 換一個 logo」。依[官方比較](https://arize.com/docs/phoenix/learn/resources/faqs/what-is-the-difference-between-phoenix-and-arize)，AX 另外涵蓋傳統 ML、computer vision、HIPAA、security review、Copilot 與 customer success；SaaS、VPC、Private Connect 也屬 AX 的部署選項。

Phoenix 適合單一團隊自己掌握 trace、dataset 與離線 experiment。需要跨團隊資料治理、online eval alert、企業支援與合規證明時，應比較 AX，而不是假設把 Phoenix Helm chart 裝上去就全部具備。[Phoenix evaluation 文件](https://arize.com/docs/phoenix/evaluation/evals)也直接把 production traffic 的 continuous monitoring、alert 與 threshold trigger 指向 Arize AX Online Evals。

## 主迴圈：trace → dataset → experiment → evaluator

```text
production / staging app
        │ OpenTelemetry spans + OpenInference semantics
        ▼
      Traces ── 找 latency、error、retrieval、tool failure
        │ 選出成功、失敗與邊界案例
        ▼
 Versioned Dataset ── input / expected / metadata
        │ prompt、model、retriever 或 agent 版本
        ▼
    Experiment ── 每個 example 執行 task
        │
        ▼
 Evaluators ── code checks + LLM judge + human labels
        └─────────────── 分數與 annotation 回到 trace
```

**Tracing** 回答「發生了什麼」。一個 trace 包住完整 request，span 表示模型呼叫、retrieval、tool invocation 或自訂步驟。成本、token、latency、input/output 都能附在 span 上，但 trace 本身不會告訴你答案好不好。

**Dataset** 把觀察轉成可重跑的測試資產。Phoenix dataset 的 example 有 input、可選的 reference output 與 metadata，而且變更會版本化。不要只匯入漂亮的 golden set；production 裡真正失敗、使用者負評、工具選錯與長尾語言都要持續收進來。

**Experiment** 對 dataset 每一筆呼叫新的 task function，把 output、trace 與 evaluator score 綁在同一個 run。依[官方流程](https://arize.com/docs/phoenix/datasets-and-experiments/how-to-experiments/run-experiments)，應先在低分案例看完整 trace、辨識 failure mode，再把那個問題編成 evaluator；不是先選一堆通用指標，希望平均分數告訴你答案。

**Evaluator** 回答「是否符合我們定義的好」。exact match、regex、JSON 結構與工具參數等客觀規則先用 code evaluator；語氣、relevance、faithfulness 才考慮 LLM judge；高風險與模糊案例仍需 human label。

## OpenTelemetry 與 OpenInference 各做什麼

Phoenix 接受標準 OTLP trace。OpenTelemetry 定義 span、trace、exporter 與傳輸；[OpenInference](https://github.com/Arize-ai/openinference)則在上面補 LLM 應用的 semantic conventions，讓系統知道某個 span 是 LLM、retriever、embedding、tool，並把 prompt、model、token 與文件放到一致欄位。

這層分工降低鎖定：現有 OTel collector 可以 fan-out 到其他 backend；instrumentation 也不必綁死 Phoenix。實際上仍要管 schema 版本、敏感 attribute 與採樣，不是用了 OTel 就自動可攜。

最小 collector 與手動 span 可以這樣開始：

```bash
docker run --rm -p 6006:6006 -p 4317:4317 \
  arizephoenix/phoenix:latest

pip install "arize-phoenix-otel>=0.16.0"
```

```python
from phoenix.otel import register, using_attributes

tracer_provider = register(
    project_name="support-agent",
    endpoint="http://localhost:6006/v1/traces",
)
tracer = tracer_provider.get_tracer(__name__)

with using_attributes(session_id="conversation-42"):
    with tracer.start_as_current_span("agent.run") as span:
        span.set_attribute("input.value", "How do I reset billing access?")
        # call the agent here
```

[Phoenix OTel SDK](https://arize.com/docs/phoenix/sdk-api-reference/python/arize-phoenix-otel)預設也能用本機 `4317` gRPC；HTTP endpoint 必須包含 `/v1/traces`。正式專案通常再加對 OpenAI、Anthropic、LangChain、LlamaIndex 或 agent framework 的 OpenInference auto-instrumentor，避免每個 model/tool call 手工造 span。

## RAG 與 agent eval 要拆開量

RAG 至少有兩個獨立問題：retriever 有沒有找到能回答問題的文件，以及 generator 有沒有忠實使用文件。Phoenix 提供 document relevance、faithfulness 與 correctness evaluator；但[官方 retrieval 指南](https://arize.com/docs/phoenix/learn/retrieval-and-infrences/benchmarking-retrieval)也提醒，retrieval eval 只告訴你 context 是否相關，不能證明最後答案正確。若有標註相關文件，MRR、Precision@K、NDCG 這類確定性 retrieval metric 應優先於 LLM judge。

Agent 更不能只打「整體成功」一分。先拆成 route/tool selection、argument correctness、tool execution、response handling 與最終 task outcome。[Phoenix Evals](https://arize.com/docs/phoenix/api/evaluation-models)有 Tool Selection、Tool Invocation 與 Tool Response Handling evaluator；有 expected tool 或 expected args 時，直接用 code 比對。對不可逆動作，eval 是事後量測，不是 runtime guard，仍要 approval 與權限隔離。

## LLM-as-a-judge 的限制

LLM judge 的優點是能把「答案是否切題」這類模糊 rubric 大量套用；缺點是它同樣會受 prompt、順序、模型版本、語言、答案長度與自身知識影響。Phoenix 會 trace evaluator 的 input、judge prompt、score、explanation 與 timing，這讓 judge 可被除錯，但 explanation 不是 ground truth。

實務上要做四件事：先拿一批人類雙標案例測 judge 的一致性；固定 judge model 與 prompt 版本；在可確定的地方用 code evaluator；定期抽樣分歧與高風險案例重標。更換 judge 後不要直接跟舊趨勢線比較，應在同一份 frozen dataset 上重跑兩個版本。

## Self-host 的資料安全不是預設完成

Trace 常含完整 prompt、檢索文件、使用者資料、tool arguments 與 model output，敏感度可能高於應用 log。Phoenix 自架讓資料留在自己的網路，但[官方認證文件](https://arize.com/docs/phoenix/deployment/authentication)明確寫著：**預設不啟用 authentication**。正式部署至少要開 `PHOENIX_ENABLE_AUTH`、把 JWT secret 放進 secret store、建立 system API key，並讓 collector 與 UI 只走 TLS/private network。

資料保留也預設無限。[Retention 文件](https://arize.com/docs/phoenix/settings/data-retention)顯示 default policy 的 0 天代表永久保留；可用 `PHOENIX_DEFAULT_RETENTION_POLICY_DAYS` 或 project policy 自動清除 traces。還要在送出 span 前 redact PII/secret，因為「之後從 UI 刪掉」不能撤回已進備份、judge provider 或下游 exporter 的資料。

## 跟其他 eval/observability 工具怎麼選

- [Langfuse](https://langfuse.com/)同樣開源、可自架，產品重心包含 trace、prompt management、cost 與 evaluation。已經採用它的團隊不應只為內建 evaluator 換平台；先比 OTel/OpenInference 相容、dataset experiment UX 與資料模型。
- [Braintrust](https://www.braintrust.dev/)把 experiment、dataset、score 與 production log 串得很緊，適合 eval-first 團隊；Phoenix 的優勢是 MIT server 與 OTel/OpenInference 生態。
- [Promptfoo](https://www.promptfoo.dev/)更像可放進 CI 的 declarative test runner，適合 prompt/model matrix 與紅隊測試。它可跟 Phoenix 共存：Promptfoo 擋 PR，Phoenix 收 runtime trace。
- [Patronus AI](https://www.patronus.ai/)主打 enterprise evaluation、judge model 與安全／合規評測；[Galileo](https://galileo.ai/)則提供託管 evaluation/observability 與自家指標。需要 vendor 提供現成 governance 與支援時，應拿它們跟 Arize AX 比，而不是只跟 Phoenix OSS 比。

選型時拿同一個 agent/RAG pipeline 實作一次：能否保留 trace hierarchy、把 production failure 一鍵進 dataset、在 CI 重跑 experiment、版本化 evaluator，並匯出原始資料。功能清單相近，真正差異在這條回饋迴圈要手工接多少段。

## 結論

Phoenix 適合想把 observability 變成改進流程，而不只是漂亮 dashboard 的團隊。正確起點不是先寫十個 LLM judge，而是先把 trace schema、敏感資料與一批真實失敗案例收好；接著用 dataset 固定問題，用 experiment 比較改動，再逐步加入能對應 failure mode 的 evaluator。

如果只需要 request log 與 token cost，完整 Phoenix 可能太重；如果要跨部門治理、即時告警與合規承諾，Phoenix OSS 又可能不夠，應直接看 Arize AX。它最強的定位就在兩者之間：一套可自架、標準化，而且能讓 production evidence 回到開發迴圈的 LLM 工程工作台。

## 參考資料

- [Arize Phoenix GitHub repository](https://github.com/Arize-ai/phoenix)
- [What is Arize Phoenix?](https://arize.com/docs/phoenix)
- [Phoenix 與 Arize AX 的差異](https://arize.com/docs/phoenix/learn/resources/faqs/what-is-the-difference-between-phoenix-and-arize)
- [Arize AI Raises $70M Series C](https://arize.com/blog/arize-ai-raises-70m-series-c-to-build-the-gold-standard-for-ai-evaluation-observability/)
- [Phoenix OpenTelemetry SDK](https://arize.com/docs/phoenix/sdk-api-reference/python/arize-phoenix-otel)
- [Run Experiments](https://arize.com/docs/phoenix/datasets-and-experiments/how-to-experiments/run-experiments)
- [Phoenix Evaluation](https://arize.com/docs/phoenix/evaluation/evals)
- [Phoenix Evals API](https://arize.com/docs/phoenix/api/evaluation-models)
- [Benchmarking Retrieval](https://arize.com/docs/phoenix/learn/retrieval-and-infrences/benchmarking-retrieval)
- [Phoenix Authentication](https://arize.com/docs/phoenix/deployment/authentication)
- [Phoenix Data Retention](https://arize.com/docs/phoenix/settings/data-retention)
