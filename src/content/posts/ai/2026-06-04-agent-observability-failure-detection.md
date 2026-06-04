---
title: "Agent 可觀測性：從 OTel Trace 到抓出幻覺、工具誤用與無限迴圈"
date: 2026-06-04
category: ai
type: deep-dive
tags: [observability, ai-agent, tool-use, llm, opentelemetry]
lang: zh-TW
tldr: "業界已收斂到用 OpenTelemetry GenAI 語義約定把每個 LLM call / tool call 變成 span；偵測三大故障再分三條線：faithfulness + semantic entropy 抓幻覺、framework 層 symbolic guardrail 擋 tool misuse、max steps + action hash 去重防無限迴圈，最後全部掛上 Final / Trajectory / Single-step 三層評估。"
description: "整理 agent 可觀測性的完整堆疊：OTel GenAI semantic conventions 的 span 結構、hallucination 偵測（RAGAS faithfulness、Nature 2024 semantic entropy）、tool misuse 三層防護（AgentDoG、TraceSafe-Bench），以及無限迴圈的多層防線與 LangGraph recursion_limit 的正確用法。"
draft: false
glossary:
  - term: "span"
    definition: "分散式追蹤（tracing）的最小單位：一段有開始與結束時間、帶屬性的操作記錄；多個 span 串成一條 trace。"
    context: "本文把每個 LLM call、tool call、reasoning step 都變成一個 OTel span。"
---

Agent 在生產環境出包時，你看到的往往只有「答案錯了」或「帳單爆了」，看不到它中間想了什麼、叫了哪些工具、為什麼鬼打牆。這篇整理目前業界對「看見 agent 推理過程」的收斂答案——**用 OpenTelemetry GenAI 語義約定把每個 LLM call / tool call / reasoning step 變成 span**——以及在 trace 之上，分別偵測三大故障模式的方法光譜：hallucination、tool misuse、無限迴圈。

傳統服務和 LLM agent 的 telemetry 有個本質差異：失敗模式從 exception / timeout 變成 **hallucination / context overflow / tool error**，debug artifact 從 stack trace 變成 **prompt + completion + reasoning chain**。這代表既有 APM 思維可以沿用，但內容物要全部換掉。

## 底層：OpenTelemetry GenAI Semantic Conventions

追蹤推理過程的共識做法，是用 OTel 的 **GenAI semantic conventions（`gen_ai.*` 屬性）** 把一次 agent 執行拆成 span tree：

- 一次 agent run = root span（`invoke_agent`）
- 每次 LLM call = child span（`gen_ai.client.chat`），記錄 `gen_ai.request.model`、`gen_ai.usage.input_tokens` / `output_tokens`、`gen_ai.response.finish_reasons`
- 每次工具呼叫 = child span（`execute_tool {gen_ai.tool.name}`），可選擇性記下 `gen_ai.tool.call.arguments` / `gen_ai.tool.call.result`（受隱私政策控制）

產出的 trace 結構長這樣：

```
[invoke_agent: research-agent]      ← root agent span
 ├─ [chat: anthropic]               ← LLM 規劃
 ├─ [execute_tool: web_search]      ← tool call #1
 ├─ [chat: anthropic]               ← 處理結果
 ├─ [execute_tool: write_file]      ← tool call #2
 └─ [chat: anthropic]               ← 最終合成
```

GenAI SIG 於 2024 年 4 月成立，原本只涵蓋 LLM client tracing，現已擴張到 agent orchestration、MCP tool calling、content capture、quality evaluation 等六層；截至 v1.41.x **仍在 beta，部分屬性是 experimental**。Datadog、Honeycomb、New Relic 已原生支援；LangChain、CrewAI、AutoGen/AG2 可原生或經 instrumentation 套件輸出 OTel-compliant span。落地工具（LangSmith、Langfuse、Arize Phoenix、Braintrust、MLflow Tracing、Opik）全都建立在這層之上。Claude Agent SDK 可透過 OpenInference 的 instrumentation 自動輸出 OTel span 到 Langfuse 等後端；Claude Code 本身也支援 OTLP exporter，並能用 `TRACEPARENT` 把 agent span 串進母應用的 trace。

但 OTel 在 AI 場景有先天限制：prompt / completion 是大段文字 blob、tool 參數每次結構不同、多步推理塞不進固定 schema。更關鍵的是——**OTel 只解決「看得見」，不回答「答案好不好」**。後者需要疊 evaluation 層，也就是接下來的三條偵測線。

## 偵測線一：Hallucination

兩大路線，分別對應「有 context」和「沒 context」的場景：

**(A) Faithfulness / Groundedness（RAG 場景主流）**。定義是「答案是否忠於檢索到的 context」，典型計算流程：claim extraction（把答案拆成原子主張）→ verification（逐條對 context 查核）→ scoring（計算被支持的比例）。工具上 RAGAS 提供 faithfulness / answer relevancy / context precision-recall，DeepEval 有 `FaithfulnessMetric`，G-Eval 用 LLM-as-judge 在 QAGS benchmark 上勝過 GPTScore / BERTScore / UniEval。限制也明確：RAGAS faithfulness 對簡單 search-like query 有效，**複雜推理會失準**，且效果高度依賴 judge LLM 能力與 claim extraction 品質。

**(B) 不確定性估計（無 context 也能用）**。代表是 Oxford OATML 發表在 Nature 2024 的 **semantic entropy**：對「意義空間」算 entropy 而非 token 序列機率——同一問題採樣多次，把語義等價的回答分群後計算分布熵，高 entropy 即高不確定、可能是 confabulation。代價是要多次採樣，比單次 QA 貴。其他黑箱基線還有 SelfCheckGPT、TLM（precision/recall 最高但採樣成本高）；白箱路線的 neural probes 最快但需要 model access。

**(C) 即時防護（guardrail，非事後 eval）**。post-LLM hallucination guardrail 在每個回應產出時檢查「未被 context 支持的主張」，隔離該句、回送 LLM 修正、再查一次，使用者只看到全部 grounded 的版本。它和 continuous eval 的分工是：guardrail 在**單次執行內**攔截修正；eval 是事後在 production 流量上找 pattern。

要注意一個容易誤解的點：**faithfulness ≠ 真實正確**。它假設 context 是 ground truth，context 本身對不對是另一個問題。

## 偵測線二：Tool Misuse

先定義 misuse 的型態。AgentDoG（arXiv:2601.18491）給出系統性的 taxonomy，常見的四類是：參數錯誤（工具對但參數不安全或脫離 context）、選錯工具（選了 deprecated / 惡意工具）、情境不當（benign 工具用在政策違規的情境）、不驗證工具輸出（過度信任 tool output）。

偵測與防護分三層，由硬到軟：

1. **執行前 symbolic guardrail（最硬）**：用框架層 hook 在 tool 執行前評估 business rule，違反就取消呼叫（例如「付款未驗證不可 confirm booking」）。重點認知：**docstring 和 system prompt 裡的「限制」對 LLM 只是 context，不是 enforcement**——LLM 會無視它。規則要在 framework level 強制，LLM 才無法靠改參數繞過。AWS Strands Agents 的案例中，3/3 的 invalid operation 全被擋下，不需要改 tool 或 prompt。
2. **Tool selection quality 評分（LLM-as-judge）**：判斷「該不該用工具、選對沒、參數對不對」。Galileo 的 Tool Selection Quality、DeepEval 的 `ToolCorrectnessMetric`（比對 actual vs expected tools）、RAGAS 的 tool call accuracy 都屬這層。
3. **Trajectory-level 安全監測（mid-execution）**：TraceSafe-Bench（arXiv:2604.07223）指出現有 guardrail 多只看單一 tool call，**忽略分散在多步軌跡裡的風險**。它用超過 1,000 條 multi-step trace、12 種 risk type（prompt injection、privacy leakage、hallucinated arguments 等）測「執行中攔截」，結論是當前 guardrail 對 multi-step tool-call 偵測仍不足。

對抗面也值得知道：Imprompter（arXiv:2410.14923）示範用混淆字串誘使 production agent 以特定參數誤用工具（常見是 URL access tool）洩漏資料。防護配套是 least privilege、role isolation、sandboxing。

## 偵測線三：無限迴圈

根因很單純：ReAct 類 agent loop 對「當前執行鏈的歷史狀態」沒有記憶，step 5 失敗就用同樣參數無限重試。社群有真實案例：agent 跑一整晚重試同一個 input 200 多次，燒掉 $63。

業界共識是多層防護的組合拳：

1. **硬上限（第一道防線）**：LangGraph 的 `recursion_limit` **預設 25 個 supersteps**，設計目的是抓 infinite loop，不是合理工作量上限；複雜 graph 應顯式設 50 或 100。超過會丟 `GraphRecursionError`——但這是硬 exception，會 crash、丟 state。各框架對應的旋鈕：AutoGen 的 `max_consecutive_auto_reply`、LangChain / CrewAI 的 `max_iterations`，**要套用到所有 agent**。
2. **TTL / step counter（軟著陸）**：在共享 graph state 注入 TTL 計數，到頂時 graceful degradation 而非硬 crash。
3. **狀態去重（抓真正的迴圈）**：hash「tool_name + args」與最近 N 步比對，命中就強制換策略或退出；或偵測「相同參數的重複 tool call」後注入 negative feedback 逼出新推理路徑。社群已有 `LoopGuard(max_repeats, window)` + `BudgetGuard(max_cost_usd)` 的現成模式。
4. **Critic / Supervisor 仲裁**：用較小較便宜的 LLM 當 critic 做 trajectory 評估，可強制終止 stalled loop。

診斷時從 trace 看：若 span tree 呈現 `[Planner→Tool→Critic→Planner→Tool→Critic...]` 無限重複，關鍵是**看重複步驟的 input state payload 有沒有在變**——沒變就是真卡死。另一個常踩的雷：把 recursion limit 從 25 調到 50 **不會修好問題**，根因通常是 router 沒有通往 `END` 的路徑；調上限和修 router 是兩種不同的 fix。

## 把三條線掛上三層評估框架

上面三類偵測最終都掛在同一個評估框架上。Langfuse、LangChain、MLflow 的文件對此高度一致：

| 層級 | 別名 | 看什麼 | 回答 | 對應指標 |
|---|---|---|---|---|
| Final response | Black-box | 只看 input + 最終答案 | **what** 錯了 | answer correctness、task completion |
| Trajectory | Glass-box | 整條 tool call / 推理序列 | **where** 錯了 | tool selection、plan quality、軌跡比對 |
| Single-step | White-box | 每個決策點獨立測 | **why** 錯了 | step-level oracle、逐步 faithfulness |

取捨上，outcome metric 便宜，用於初步驗證和持續監控；trajectory 貴但可解釋，選擇性用於 debug failure 和高風險決策。Evaluation-Driven Development（arXiv:2411.13768）提醒過度偏任一邊都不好。Offline 和 online 評估則應該用**同一套 scorer**：offline 用 curated dataset 在開發期跑回歸，online 對抽樣的 production 流量跑 evaluator、低於 threshold 就告警。最有價值的 test case 來自 production 的失敗 trace——用 annotation queue 系統性標註後加進 eval set。

## 整體來說

| 你要解的問題 | 最小可行做法 | 加強版 |
|---|---|---|
| 看見推理過程 | 接 OTel GenAI semconv，輸出到 Langfuse / LangSmith / Phoenix 任一 | `TRACEPARENT` 串進母應用 trace；content capture 加隱私 redaction |
| Hallucination | RAG 場景先上 faithfulness + post-LLM guardrail | 無 context 場景加 semantic entropy 類不確定性估計 |
| Tool misuse | framework 層 symbolic guardrail 執行前攔截 | 疊 LLM-judge selection quality + trajectory 安全監測 |
| 無限迴圈 | 硬 max steps + action/args hash 去重 + budget 上限 | TTL 軟著陸 + critic 仲裁 + trace 上看 state payload 變化 |
| 整體把關 | 三層 eval（先 final，再補 trajectory） | offline 回歸 + online 抽樣同套 scorer |

四個反直覺重點，值得貼在牆上：tool docstring 的限制**不是 enforcement**，要硬規則就得在框架層攔；調高 recursion limit 不修迴圈，先檢查 router 有沒有到 `END` 的路徑；OTel 只給你「看得見」，evaluation 層必須另外疊；faithfulness 不等於真實正確，context 本身的品質是獨立問題。

## 參考資料

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Detecting hallucinations in large language models using semantic entropy（Nature 2024）](https://www.nature.com/articles/s41586-024-07421-0)
- [RAGAS 官方文件](https://docs.ragas.io/)
- [DeepEval 官方文件](https://deepeval.com/)
- [G-Eval: NLG Evaluation using GPT-4（arXiv:2303.16634）](https://arxiv.org/abs/2303.16634)
- [AgentDoG: A Diagnostic Guardrail Framework for AI Agent Safety and Security（arXiv:2601.18491）](https://arxiv.org/abs/2601.18491)
- [TraceSafe-Bench（arXiv:2604.07223）](https://arxiv.org/abs/2604.07223)
- [Imprompter: Tricking LLM Agents into Improper Tool Use（arXiv:2410.14923）](https://arxiv.org/abs/2410.14923)
- [Evaluation-Driven Development of LLM Agents（arXiv:2411.13768）](https://arxiv.org/abs/2411.13768)
- [LangGraph：Graph recursion limit](https://langchain-ai.github.io/langgraph/concepts/low_level/)
- [Langfuse](https://langfuse.com/)
- [LangSmith](https://docs.smith.langchain.com/)
- [Arize Phoenix](https://phoenix.arize.com/)
- [Claude Code：Monitoring usage（OpenTelemetry）](https://code.claude.com/docs/en/monitoring-usage)
