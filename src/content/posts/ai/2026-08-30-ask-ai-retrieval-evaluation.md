---
title: "Ask AI Retrieval Eval 怎麼做：Golden Contract、Fixture、Live Run 與證據邊界"
date: 2026-08-30
category: ai
type: guide
tags: [rag, evaluation, promptfoo, retrieval, regression-testing]
lang: zh-TW
tldr: "Ask AI 把 golden contract、offline fixture、live SSE output 與 production observation 分開保存。fixture 全綠只證明 harness 可重現；public sources 可以量 expected-source recall，不能拿來宣稱看過 hidden ranked chunks 或 model-graded faithfulness。"
description: "用 Ask AI q01–q21 的資料集與 Promptfoo 契約，示範如何建立可重跑的 retrieval regression checks，並避免把 fixture、live 與 production 證據混為一談。"
draft: true
series:
  name: "Ask AI 實戰"
  order: 9
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-retrieval-evaluation-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配 [RAG 評估框架與工具選型](/posts/ai/2026-03-12-rag-evaluation-frameworks) 與 [RAG A/B 測試](/posts/ai/2026-03-12-rag-ab-testing)。

RAG 評估最容易先做出一張漂亮分數表，卻說不清楚分數來自 fixture、開發環境還是 production。Ask AI 會先標記 evidence kind，再計分。Golden contract 寫期待，offline fixture 測 harness，live runner 收公開 SSE，production observation 另外留下部署與操作證據。

這篇以 [Ask AI evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md) 為主線。讀完可以複製同一套目錄、命令與 artifact boundary，但不會得到不存在的 raw ranked chunks。

## 四種資料不要放進同一個桶子

| 層級 | repository 裡的形式 | 能證明的事 |
|---|---|---|
| Golden contract | `docs/rag-golden-dataset.json` | 問題、期待答案點、來源與禁止主張的穩定契約 |
| Offline fixture | `docs/rag-golden-fixture.json` | scorer、adapter、Promptfoo assertion 在固定輸入下可重現 |
| Live output | `.work/rag-evals/live/` | 指定 Ask AI endpoint 當次公開 SSE 行為 |
| Production observation | runbook＋deploy evidence | 某次已部署版本的操作觀測 |

[`rag-golden-dataset.json`](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json) 目前使用 schema `1.0`，案例 ID 是 q01–q21。ID 與既有 expectation 是 regression identifier，不因改文案就重排。

Fixture 是獨立 candidate output，只涵蓋 q01–q04 與 q21。它不假裝呼叫過 Ask AI，也不會被描述成 production sample。[dataset adapter](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/golden-dataset.mjs) 會驗 schema、唯一 ID／query 與 retrieval contract 欄位。

## 先跑 offline，確認量尺沒有壞

Baseline fixture 會輸出四種 artifact：candidate output、逐 case score、公開 trace placeholder 與 summary report。

```bash
pnpm eval:rag:fixture
```

輸出預設放在：

```text
.work/rag-evals/fixture/
├── baseline-outputs.jsonl
├── baseline-scores.jsonl
├── baseline-traces.jsonl
├── baseline-report.json
└── promptfoo-report.json
```

Promptfoo 先測 dataset adapter、provider 與 assertion，再跑 fixture：

```bash
pnpm test:promptfoo
pnpm eval:promptfoo:fixture
```

Fixture 通過代表固定 candidate 可以通過目前契約，適合抓 schema drift、重複 expectations、scorer 改壞或 Promptfoo wiring 失效。它沒有證明 retriever 在 D1／Vectorize 找到相同資料，也沒有測模型當下生成。

## Live runner 必須真的讀 SSE

正常啟動 Astro application 與 Ask AI bindings 後，使用已驗證的 admin cookie：

```bash
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:promptfoo
```

預設 target 是 `http://127.0.0.1:4321`，需要時用 `RAG_EVAL_BASE_URL` 覆寫。Live runner 送出 `traceScope: eval` 與 `cacheMode: bypass`；API 只允許 admin 使用這兩個能力，並跳過 semantic cache read 和 write。

[`eval-rag-baseline.mjs`](https://github.com/vincentxuu/quidproquo/blob/main/scripts/eval-rag-baseline.mjs) 用 stream reader 逐塊解析 `token`、`sources`、`related`、`agent_step`、`done` 與 `error`。不要用 `response.text()` 把 SSE 當普通 JSON；它會失去事件邊界，也不適合長時間 stream。

Live artifact 進 `.work/rag-evals/live/`，跟 fixture 分開。需要比較 engine 時：

```bash
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag:matrix
```

加上 `RAG_EVAL_ENFORCE=1` 才會在 aggregate threshold 未達標時以非零狀態結束。這些是開發環境 entry points，不會自動證明 scheduled CI 或 production deployment 成功。

## 三個 baseline 名稱要照實解讀

Baseline 輸出 `contextRecall`、`answerRelevance` 與 `faithfulness`，但名稱不能蓋過計算方式。

`contextRecall` 是 expected source locator 有多少出現在公開 `sources` 裡。API 沒有輸出 hidden retrieved context，因此它不是逐 chunk 的 context recall。

`answerRelevance` 用 expected answer points 的 token coverage，再套 forbidden-claim gate。它適合 deterministic regression，不能取代人工語意評分。

`faithfulness` 合併兩件可觀測的事：顯示來源是否對齊 expected sources，以及回答內 citation URL 是否存在於顯示來源。出現 forbidden claim 時直接失敗。這是 citation/source alignment heuristic，不是模型判讀每一句是否被證據 entail。

`baseline-traces.jsonl` 只記公開 `agent_step`。它不能被稱為完整 retrieval 或 model trace。

## q21 示範何時加 retrieval contract

一般 golden case 可以只有 answer points、expected sources 與 forbidden claims。只有 public response 提供足夠訊號時，才新增 `retrieval_contract`。

q21「有哪些課程文章」的 contract 檢查：

- Stanford、MIT、CMU、Berkeley 四篇課程地圖都出現。
- Cloudflare Cache Rules 與 AI Gateway 兩篇無關來源不得出現在來源或回答。
- 至少四個不同來源。
- latency 不超過 30 秒。
- `done.cached` 必須是 `false`。

Promptfoo config 沒有複製這些值。[`promptfoo-tests.mjs`](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/promptfoo-tests.mjs) 從 golden dataset 動態產生 test，再交給 deterministic retrieval assertion。改 q21 時只改 dataset，避免 baseline 與 Promptfoo 各有一份會漂移的規則。

## 從新事故增加 case

假設又遇到「問中文短詞時來源為空」，先保存可公開重現的 query，再決定契約：

1. 給 case 一個不會重複使用的 ID。
2. 寫讀者真正需要的 answer points，不把模型逐字輸出當 golden answer。
3. 只放能由 public `sources` 驗證的 expected sources。
4. 加入曾經誤入答案的 forbidden claims。
5. public response 足以驗 latency、cache 與唯一來源時，才加 `retrieval_contract`。
6. 另外製作獨立 fixture candidate；不要把 live output 原封不動抄成 fixture 後宣稱獨立驗證。

修改 dataset 後先跑：

```bash
pnpm exec node --test \
  evals/rag/adapters/golden-dataset.test.mjs \
  evals/rag/provider.test.mjs \
  evals/rag/assertions.test.mjs

pnpm exec node --test scripts/eval-rag-baseline.test.mjs
```

最後跑 fixture 與 live。需要保存不同位置時，可以設 `RAG_EVAL_ARTIFACT_ROOT`，或個別覆寫 report、outputs、scores、traces 路徑。

## q21 production evidence 到哪裡為止

`retrieval-v3` 上線後，一筆未命中快取的 q21 observation 通過四篇 required sources、零 forbidden sources、來源唯一性與 latency 契約，公開 step 序列只有一輪。這筆紀錄能證明該部署版本的那次公開 contract。

這個 repo 沒有提交去識別化的原始 live output、分數或 trace artifact，因此讀者不能只靠 git 重算 26.821 秒與 8/8 項檢查。它也沒有 raw ranked chunks、完整 Writer context 或所有 Critic 欄位。這組 production 觀察不能升格成長期延遲 benchmark，更不能稱為 model-graded faithfulness。

下一次要做可獨立稽核的 production report，至少保存去識別化的 `baseline-outputs.jsonl`、`baseline-scores.jsonl`、`baseline-traces.jsonl` 與 dataset identity。涉及使用者內容或 session cookie 時，先做資料最小化與 secret scrub。

## Promotion gate 應該讀 artifact，不讀感覺

一個 retrieval change 準備進 production 時，promotion gate 至少確認：

- dataset schema 與 case IDs 沒漂移。
- fixture harness 通過。
- live run 確認 `cached: false`，且 artifacts 位於 live 目錄。
- aggregate threshold 在指定 engine 上達標。
- incident-specific retrieval contracts 通過。
- 沒把 public sources、agent steps 誤寫成 hidden context 或 full trace。

這套流程的價值不在多一個分數，而是每個分數旁邊都保留 evidence kind、dataset ID 與 artifact path。測不到的資料就明講沒有；下一輪需要時，再擴 API 或 trace contract。

## 與通用 Table QA 基準的定位差異

Ask AI 的 q01–q21 是針對自身場景設計的 task-specific evaluation：固定的問題、預期來源、禁止主張，測的是「這個系統在這些問題上有沒有退步」。學術界另有一系列通用表格問答基準，測的是「模型／pipeline 在跨資料集上的泛化能力」：

- **WikiTableQuestions**（Pasupat & Liang, 2015）：22,033 個 query-table 配對，表格 QA 的開山之作，至今仍是 leaderboard 標配。
- **HybridQA**（Chen et al., 2020）：跨表格與自由文字的 multi-hop QA，迫使 pipeline 同時做結構化查詢與語意檢索。
- **TableRAG**（arXiv:2506.10380, 2025）：最新的異質文件推理框架，用 HeteQA + HybridQA + WikiTQ 三組 benchmark 評測 RAG 對表格的處理能力。

兩者互補而非替代：task-specific contract 測系統的真實行為退步（regression），standard benchmark 測跨場景的泛化能力（generalization）。如果未來 Ask AI 要處理更多結構化內容（表格、清單、比較矩陣），把 WikiTableQuestions 子集納入 golden dataset 是一個可行的擴展方向。

## 更新紀錄

- 2026-09-03：補充通用 Table QA 基準（WikiTableQuestions、HybridQA、TableRAG）的定位比較

## 參考資料

- [Ask AI RAG evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
- [Golden dataset q01–q21 and q21 retrieval contract](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json)
- [Independent offline fixture](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-fixture.json)
- [Golden dataset adapter](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/golden-dataset.mjs)
- [Promptfoo test generation](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/promptfoo-tests.mjs)
- [Baseline live／fixture runner and deterministic scoring](https://github.com/vincentxuu/quidproquo/blob/main/scripts/eval-rag-baseline.mjs)
- [WikiTableQuestions](https://ppasupat.github.io/WikiTableQuestions/) — Pasupat & Liang (2015)，表格 QA 開山 benchmark
- [HybridQA](https://hybridqa.github.io/) — Chen et al. (2020)，跨表格 + 文字的 multi-hop QA
- [arXiv:2506.10380 — TableRAG: A RAG Framework for Heterogeneous Document Reasoning](https://arxiv.org/abs/2506.10380) (2025)
