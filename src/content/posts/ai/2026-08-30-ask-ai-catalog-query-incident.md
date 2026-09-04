---
title: "Ask AI 明明有課程地圖，為什麼列不完整：Catalog Query 的召回與收斂事故"
date: 2026-08-30
category: ai
type: debug
tags: [rag, retrieval, evaluation, semantic-cache, langgraph, cloudflare]
lang: zh-TW
tldr: "「有哪些課程文章」第一次觀測被舊快取干擾；真正未命中的 request 已找回四所大學課程地圖，卻因三輪 Writer／Critic 重試花了 51.169 秒。修正 catalog 專用檢索與 review 契約後，一次未命中快取的 production observation 在 26.821 秒內通過 q21。"
description: "重建 Ask AI q21 課程目錄事故：從舊 semantic cache、metadata-only retrieval、未封頂 retry source set，到 catalog Writer／Critic 契約與單輪收斂。"
draft: false
series:
  name: "Ask AI 實戰"
  order: 8
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-catalog-query-incident-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配 [Query Classification](/posts/ai/2026-03-12-query-classification-adaptive-routing) 與 [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop)。

Ask AI 收到「有哪些課程文章」時，站內已經有 Stanford、MIT、CMU、Berkeley 的課程地圖，production 索引也不是空的。第一個看起來像召回失敗的回答來自舊語意快取。真正未命中快取的請求找到四篇必要來源，整體仍超過延遲契約。

這場事故的轉折點是把「有沒有找到文章」和「答案能不能在一輪內收斂」拆開。完整契約與 operator evidence 記在 [Ask AI evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)。

## 情境：目錄查詢跟推薦問題長得很像

「有哪些課程文章」會被 Planner 歸在 recommendation intent，但使用者其實要一份目錄。一般推薦需要從證據說明「為什麼推薦這篇」；目錄查詢只需要文章標題與精確連結。

這個差異會一路影響 retrieval、Writer 與 Critic：

- retrieval 應優先拿文章 metadata，而不是要求每篇都有可生成推薦理由的 chunk。
- Writer 應列出本次找到的文章，不能把 top matches 宣稱成全站完整清單。
- Critic 應檢查標題與 URL membership，不該要求 metadata 沒提供的內容理由。

舊流程把兩者放進同一套 rubric，於是來源已經正確，生成端仍一直認為內容不夠。

## 第一個觀測被舊快取污染

最早的 production q21 回答缺少必要課程連結，但 `done.cached` 顯示它來自舊快取。這筆結果不能證明新 retriever 失敗，因為當次請求根本沒跑 Research。

後來 semantic cache generation 更新為 `retrieval-v2`，真正的 first-hit query 找到四篇必要課程地圖：

- [Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- [MIT AI／ML 課程地圖](/posts/learning/2026-08-21-mit-ai-ml-course-map)
- [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)
- [Berkeley AI／ML 課程地圖](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)

這次仍失敗，原因已經改了：公開請求花了 51.169 秒，超過 q21 的 30 秒上限。`agent_step` 顯示 Research → Writer → Validation → Critic 跑了三輪。

## 三輪重試為什麼沒有改善答案

當時 Writer 對 recommendation intent 一律要求每篇給具體推薦理由。課程目錄 retrieval 用的是 title、URL 等 metadata，沒有足夠段落去支持每篇理由。Critic 又用一般推薦 rubric 檢查草稿，容易要求 metadata 回答不了的內容。

每輪 Critic gaps 會加進下一個 search query。[Research node](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts) 原本會去重多輪結果，卻沒有在合併後套用全域 `postLimit`，因此來源集合從二十篇長到二十六篇。更多來源沒有補上 Writer 真正缺的證據，反而增加 prompt 與 review 成本。

另一個問題在輸出邊界。過去每輪 Writer draft 都立刻送出 `token` event；前端用附加方式處理 token，三份草稿可能黏成一個答案。現在 [shared pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts) 會靜音 engine 內部草稿，只送接受後的 `final_response`。

Production trace 沒有保存 raw drafts 或 Critic 的每個欄位，所以不能倒推「某一個 confidence 分數就是唯一根因」。可以確認的是公開 step 序列、latency 與 sources；rubric mismatch 是最符合程式路徑和重試行為的機制解釋。

部署時的預設是 LangGraph routing。公開 trace 顯示 Validation 每輪都先於 Critic 完成，這個順序與程式路徑一致；它仍無法獨立證明沒有公開的 validation result。

## 修正分成三個 commit

第一步，[`ff973444`](https://github.com/vincentxuu/quidproquo/commit/ff973444) 清掉 catalog query 的泛用填充詞，讓 broad catalog query 走 metadata-only post retrieval，以文章為單位去重，並擴大 Writer 可用 context。UI 的 Research 計數也改成不同文章數，不再拿 chunk 數冒充文章數。

第二步，[`765f7000`](https://github.com/vincentxuu/quidproquo/commit/765f7000) 加入管理員專用的 `cacheMode: bypass`。Live evaluation 必須帶已驗證的管理員 cookie；公開請求不能假冒評估流程繞過快取或配額。這個 commit 也替語意快取加上版本與時效邊界，並同時在來源 metadata 與回答文字檢查 forbidden sources。

第三步，[`b30ac957`](https://github.com/vincentxuu/quidproquo/commit/b30ac957) 補上 catalog 專用 Writer／Critic rubric、合併後的 `postLimit`，以及窄版單輪接受條件。這條捷徑仍要求：

- deterministic Validation 通過。
- 草稿引用的 URL 都在本次 retrieval set。
- 至少四個不同文章來源。
- answer relevance 與 intent alignment 達標。
- 沒有 drift 或 ungrounded claim。

Malformed Critic output、未知 citation 或少於四個來源仍會重試。只有低 confidence 本身可以在其他強檢查都通過時不再擋住 catalog 草稿。

## 把事故變成 q21 契約

[`docs/rag-golden-dataset.json`](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json) 的 q21 是唯一真相來源。契約要求四篇課程地圖、排除兩篇無關 Cloudflare 文章、至少四個不同來源、30 秒內完成，而且 `done.cached` 必須是 `false`。

先跑 deterministic fixture，確認 adapter、scorer 與 assertion wiring：

```bash
pnpm eval:rag:fixture
pnpm test:promptfoo
pnpm eval:promptfoo:fixture
```

再用 admin cookie 對正常啟動的 Ask AI 做 live check：

```bash
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:promptfoo
```

例行評估不用再調高 cache generation。`cacheMode: bypass` 讓已授權的評估請求同時跳過快取讀取與寫入。

## Production observation 通過了什麼

`retrieval-v3` 部署後，第一筆未命中快取的 q21 操作觀測在 26.821 秒完成。它找到四篇必要課程地圖，顯示二十個不同來源，也沒有兩篇 forbidden Cloudflare 文章。公開 step 序列是一輪 Planner → Research → Writer → Validation → Critic。

GitHub Actions run `33298638227` 證明 commit `b30ac957` 通過 repository gates 並完成部署；上述回答量測則是記在 [`a65b801e`](https://github.com/vincentxuu/quidproquo/commit/a65b801e) 的 operator observation。

這個 repo 沒有提交去識別化的原始 live output、分數或 trace artifact，第三方無法只靠 git 重新計算這組數字。這只是一筆 production 回歸觀察，不能當成長期延遲 benchmark，也不能說成 model-graded faithfulness。它沒有揭露 raw ranked chunks、完整 Writer context 或 Critic 全部欄位。

## 學到的事

Catalog query 的核心契約是「列出本次找到的標題與精確連結」。把它硬塞進一般推薦 rubric，會讓正確 retrieval 在生成與 review 端反覆繞圈。

事故紀錄要保留診斷變化。快取回答不能測新 retriever；找到四篇來源後，問題從 recall 轉成 convergence；單次 production 通過也只能證明那筆公開契約。這些界線寫清楚，下一次才知道該修哪一層。

## 參考資料

- [Ask AI RAG evaluation runbook and q21 incident](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
- [q21 golden retrieval contract](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json)
- [Catalog query strategy](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/query-strategy.ts)
- [Research retry, metadata-only retrieval and result cap](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts)
- [Catalog Writer instructions](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts)
- [Catalog Critic acceptance rules](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic-routing.ts)
