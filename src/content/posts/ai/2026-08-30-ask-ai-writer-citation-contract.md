---
title: "Ask AI 怎麼把證據寫成答案：Writer Context 與 Citation Contract"
date: 2026-08-30
category: ai
type: guide
tags: [rag, citation, grounding, prompt-engineering, retrieval, validation]
lang: zh-TW
tldr: "Writer 預設只讀 factual query 的前 8 筆或 recommendation 的前 12 筆候選證據，引用必須使用候選集合中的 exact `source_url`；檢索為空或被判為 weak 時，prompt 要求拒絕用模型常識補答案。"
description: "拆解 Ask AI Writer 如何截取 evidence context、限制可引用 URL、處理 catalog query 與弱召回，並說明 deterministic citation validation 能證明與不能證明什麼。"
draft: false
series:
  name: "Ask AI 實戰"
  order: 3
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-writer-citation-contract-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配〈[RAG Prompt Engineering：System Prompt 和 Context 怎麼設計](/posts/ai/2026-03-12-rag-prompt-engineering)〉。

Research 找到候選資料，不代表模型應該把每一筆都塞進回答。Writer 還要面對三個限制：context window 有上限，每個 factual claim 必須指回允許的 URL。證據不夠時寧可拒答，也不能用模型記憶把缺口補成一段看似完整的文章。

Ask AI 把這些限制分成兩層。[`writer.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts) 在 prompt 裡描述寫作契約；[`validation.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts) 再以 deterministic code 檢查 Markdown 與 URL membership。Prompt 管內容邊界，程式碼守可機械驗證的格式邊界。

## Writer 看到的是截取後的 evidence context

Writer 不直接查 D1 或 Vectorize。它從 `state.search_results` 前面取固定數量的候選：一般 intent 預設 8 筆，recommendation 預設 12 筆。測試或其他 caller 可以透過 result profile 調整，程式會把範圍限制在 1–40。

每筆 context 長這樣：

```text
[Source 1] https://quidproquo.cc/posts/...
Title: 文章標題
evidence excerpt
Images: https://...   # 有圖片時才出現
```

這個格式保留 `source_url`、title、evidence excerpt 與圖片 URL。它沒有把完整文章、自訂的 relevance 解釋或「這就是網站所有相關文章」的承諾塞給模型。前一篇提到的 top-k、排序與去重，會在這裡具體變成 Writer 能看到與看不到的邊界。

## Citation contract 限制模型能怎麼引用

Writer system prompt 要求：

- 直接回答問題，再補細節。
- 只根據提供的 sources 寫 factual claims。
- inline citation 必須使用 `[可讀標籤](source_url)`。
- `source_url` 必須逐字取自 context，不能自行拼接或改寫。
- 不列裸網址，也不另外做一份參考資料清單，因為 UI 會顯示 retrieved sources。
- 不確定或缺少證據時，要直接寫出限制。

這不是「prompt 寫了就一定做到」。它的價值是先把成功答案定義清楚，讓下一個 deterministic validation 能檢查 URL 是否越界，Critic 再檢查內容是否 drift 或產生 ungrounded claims。

## Catalog query 和一般推薦不能共用同一種寫法

「推薦幾篇適合入門 RAG 的文章」可以在 evidence excerpt 支持時，說明每篇為什麼值得讀。「有哪些課程文章」若走 metadata-only retrieval，Writer 只有 title 與 URL，硬要求每篇給推薦理由反而會鼓勵模型補出證據裡沒有的說法。

因此 broad catalog query 有較窄的契約：列出符合問題的標題與 exact link，不從 metadata 發明推薦理由，也不能聲稱這是全站完整清單。一般 recommendation 則仍要求每個理由必須有 evidence 支持。

這個差異來自證據形狀。當 context 只有 metadata，安全的輸出也必須縮到 metadata 能支持的範圍。

## 沒有可靠證據時，Writer 必須縮手

程式用兩個條件判斷 `hasReliableEvidence`：`search_results` 非空，而且 `needs_web_search` 為 false。若沒有可靠證據，prompt 會明確要求不要用 general knowledge 回答，改成簡短說明知識庫缺少足夠資料。

這仍然是 prompt-level 行為，不是形式證明。Writer 可能違反指示，所以 pipeline 後面還有 Validation、Critic 與 fallback。這篇只談 Writer 與 citation contract；下一篇才會把三個後續門檻分開。

## Deterministic validation 實際檢查什麼

[`validateDraft`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts) 合併三組檢查：

1. Markdown code fence 是否成對、連結語法是否明顯損壞。
2. Citation URL 是否存在於 `search_results.source_url`；圖片是否存在於 retrieved image metadata。
3. Mermaid block 是否封閉，第一行是否為支援的 diagram type。

相對路徑會先正規化成 `https://quidproquo.cc` 再比對。任何未知 citation 都會讓 validation 失敗，pipeline 依 retry budget 回 Research 或 fallback。

URL membership 能阻擋模型引用一個 retrieval state 裡不存在的網址，卻不能證明連結前面的每一句話都被那個來源支持。這是 Critic 與人工 eval 要處理的內容層問題，不能把 `validation.passed` 寫成完整的 factuality 保證。

## 可複製的 Writer 與 citation 測試

```sh
pnpm exec vitest run \
  src/lib/retrieval/agents/writer.parity.test.ts \
  src/lib/retrieval/agents/validation.test.ts \
  src/lib/conversation/pipeline.test.ts
```

這組測試涵蓋弱證據拒答 prompt、recommendation 與 catalog 分流、前 12 筆 context、未知 URL 被拒絕和 Mermaid 結構。它也會檢查共用 facade 只送出 accepted final。測試用的是 fixture state 與 mock model，不是 production 生成品質測量。

也可以直接找出 Writer 契約的關鍵句：

```sh
rg -n "EXACT source_url|does not answer from general knowledge|article catalog lookup" \
  src/lib/retrieval/agents/writer.ts
```

## 證據邊界

Repo 可以證明 prompt、context 截取與 deterministic URL validation 的實作，也可以用測試固定這些行為。它不能證明模型永遠遵守 prompt，不能從 displayed sources 重建 Writer 的完整 context，更不能把 URL membership 等同於逐句 factuality。

讀 production output 時，最保守的說法是：「這個 URL 在當次公開來源集合裡，而且回答中的連結通過了 membership gate。」要宣稱某個主張被哪一段 chunk 支持，還需要保留並檢查當時的 raw context；目前公開 SSE 沒有提供它。

## 參考資料

- [Ask AI Writer](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts)
- [Deterministic validation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts)
- [Writer parity tests](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.parity.test.ts)
- [Validation tests](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.test.ts)
- [Final-response pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)
