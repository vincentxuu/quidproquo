---
title: "Ask AI 何時才顯示來源：Validation、Critic、降級與 Source Gate"
date: 2026-08-30
category: ai
type: guide
tags: [rag, validation, citations, retrieval]
lang: zh-TW
tldr: "Ask AI 找到文章，不代表畫面就該顯示來源。回答要先通過 Markdown／URL 的確定性驗證，再通過 Critic 的相關性、意圖與 groundedness 檢查；任一門檻失敗，來源卡片就不送到前端。"
description: "沿著 quidproquo Ask AI 的 Writer、Validation、Critic、retry／degrade 與 presentation 程式碼，拆解回答和來源卡片何時可以公開。"
draft: true
series:
  name: "Ask AI 實戰"
  order: 4
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-source-gating-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配〈[Self-Reflection + LLM-as-Judge：讓 AI 評估自己的回答](/posts/ai/2026-03-12-self-reflection-llm-as-judge)〉與〈[RAG Guardrails：在輸入和輸出加一道防線](/posts/ai/2026-03-12-rag-guardrails)〉。

Ask AI 的 Research 找到二十篇文章時，前端不會立刻拿到二十張來源卡。檢索結果只是候選證據；Writer 寫出的回答、回答裡的連結，以及最後送給使用者的來源清單，各有自己的門檻。

這篇沿著 [Ask AI 的來源顯示程式碼](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts) 走一次完整判斷。讀完後，你可以回答三個常被混在一起的問題：格式對不對、內容有沒有根據、來源能不能顯示。

## 三道門分別守什麼

一次回答會依序經過 Writer、Validation、Critic，最後才到 Source Gate。

```text
search_results
    │
    ▼
Writer ── 產生 draft 與 inline citations
    │
    ▼
Validation ── Markdown、Mermaid、citation URL membership
    │
    ▼
Critic ── relevance、intent alignment、drift、ungrounded claims
    │
    ├─ failed 且未達上限 → Research 重搜、Writer 重寫
    ├─ failed 且達上限   → Fallback／degrade
    └─ passed            → accepted final response
                              │
                              ▼
                         Source Gate
```

[Writer](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts) 只能引用 `search_results` 提供的 `source_url`，而且要使用完全相同的 URL。這仍是模型指令，不是安全保證，所以後面還有兩個獨立檢查。

## Validation 檢查可確定判斷的錯誤

[Validation node](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts) 不呼叫模型。它檢查：

- Markdown code fence 是否成對。
- Markdown 連結與圖片語法是否可解析。
- Mermaid block 是否完整，且以支援的 diagram type 開頭。
- 回答裡每個 citation URL 是否存在於 `search_results`；圖片也只能取自檢索結果列出的圖片 URL。

其中最重要的是 URL membership。模型就算寫出一個看起來合理、而且真的存在的站內網址，只要那個網址不在本次檢索結果裡，Validation 仍會回報 `Unknown citation URL`。

這一層能證明的是「引用來自這次允許的集合」，不能證明引用內容真的支持句子。URL 合法與論述有根據是兩件事。

## Critic 檢查回答是否答對問題

[Critic](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic.ts) 會看到問題、草稿和一部分檢索證據，再輸出五組訊號：`confidence`、`answer_relevance`、`intent_alignment`、`drift_detected` 與 `ungrounded_claims`。

[routing 規則](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic-routing.ts) 把下列任一情況視為失敗：信心低於門檻、回答相關性或意圖一致性不足、內容偏離問題，或出現沒有證據支持的主張。Critic 回傳格式壞掉時，程式也不會猜測缺少欄位，而是把它當成 review failure。

Critic 是模型判斷，會有不穩定性。它的用途是把語意品質加入 routing，不是替 Validation 的確定性檢查背書，也不等於外部 fact-check。

## Retry 與 degrade 不會偷渡來源

一般查詢最多嘗試三次。Validation 或 Critic 失敗、而且尚未達上限時，pipeline 會帶著 Critic 的 gaps 回到 Research，改寫查詢後重新找證據。達到上限仍未通過，流程改走 fallback／degrade。

Catalog query 有一條較窄的提前收斂規則。像「有哪些課程文章」這類目錄查詢，草稿要先通過 Validation，並引用至少四個本次檢索到的不同文章 URL。Critic 的相關性、意圖、偏離與無根據主張檢查也都要通過，pipeline 才會接受這份已審查的草稿。這條規則只容許「低 confidence 本身」不再觸發重試；未知網址、少於四個來源或內容偏離仍會失敗。

提前接受與來源顯示仍是兩個判斷。Catalog 草稿可以因其他強檢查都通過而停止重試；最後的 Source Gate 仍把低 confidence 視為 Critic failure，因此可能接受文字回答、但不送來源卡。

前端來源卡的最後一道條件在 `shouldExposeRetrievedLinks()`：

```ts
return state.search_results.length > 0
  && !hasValidationFailure(state.validation)
  && !hasCriticFailure(state.critique)
```

因此，`search_results.length > 0` 只回答「有沒有候選」。Validation 或 Critic 任一失敗時，[`/api/chat`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts) 不會送出 `sources` SSE event。

## 在本機驗證四種情況

先跑來源門檻與 Critic routing 的 targeted tests：

```bash
pnpm exec vitest run \
  src/lib/retrieval/presentation.test.ts \
  src/lib/retrieval/agents/critic.test.ts \
  src/lib/retrieval/agents/validation.test.ts
```

測試至少要覆蓋：零結果、Validation 失敗、Critic 失敗、兩者都通過。Catalog query 另外要測未知 citation、少於四個不同來源、內容 drift 與 malformed Critic output。

手動讀 SSE 時，不要只看畫面有沒有卡片。把事件分開記錄：

```bash
curl -N -X POST http://127.0.0.1:4321/api/chat \
  -H 'Content-Type: application/json' \
  --data '{"message":"有哪些課程文章"}'
```

看到 `Research` 完成只能證明流程走過檢索節點；看到 `sources` 才能證明最後來源門檻通過。公開 stream 沒有 raw retrieved chunks、完整 Writer context 或 Critic 的所有內部欄位。

## 這套門檻留下的邊界

Source Gate 防止「回答已經失敗，UI 還把檢索候選包裝成背書」。它沒有把來源變成已查證事實：

- Validation 驗 URL membership，不驗文章內容與句子的 entailment。
- Critic 是模型 review，不是人工審稿或外部事實查核。
- `sources` 是經過門檻後的顯示清單，不是完整 ranked retrieval trace。
- 快取命中可能只回 `token` 與 `done`，不會重播原本的 sources 或 agent steps。

除錯時先問是哪一道門沒過，再決定要修檢索、Writer prompt、Validation 邏輯或 Critic rubric。只看「有沒有找到文章」會漏掉後半條 pipeline。

## 參考資料

- [Ask AI presentation source gate](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts)
- [Deterministic draft validation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts)
- [Critic routing and catalog acceptance](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic-routing.ts)
- [Ask AI chat API and SSE events](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts)
- [Ask AI evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
