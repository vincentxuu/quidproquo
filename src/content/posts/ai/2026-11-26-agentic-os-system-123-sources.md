---
title: "Agentic OS 加 System 1/2/3：這套 AI 應用架構的原始出處與缺口"
date: 2026-11-26
category: ai
type: deep-dive
tags: [ai-agent, agentic-os, cognitive-architecture, n8n, multi-agent]
lang: zh-TW
tldr: "「Agentic OS 當靜態架構、System 1/2/3 當動態架構、n8n 模板當執行層」這套說法，三塊各有原始出處：AIOS 與 MemGPT 定義了 agent 的作業系統，SOFAI 定義了快慢思考加後設認知仲裁，Sophia 把 System 3 定義成長期自我監督層。三者還沒有人正式接在一起；要讓它閉環，得自己補上「執行結果回頭修正策略」這條回饋路徑。"
description: "整理 Agentic OS、System 1/System 2/System 3 與 n8n 工作流模板各自的論文與官方出處，說明 System 3 有兩種互不相容的定義、n8n 官方分類實際長怎樣，以及把三者拼成閉環時缺的那一塊。"
draft: false
---

> :globe: [English version](/posts/ai/2026-11-26-agentic-os-system-123-sources-en)

最近常聽到一套說法：用 **Agentic OS** 當 AI 應用的靜態架構，用 **System 1、System 2、System 3** 當動態架構，再用 [n8n](https://n8n.io/) 的模板當執行層，三者合起來就是目前最能自洽、能閉環的 AI 應用架構。

這篇回答兩個問題：每一塊的原始出處是什麼？三塊拼起來，真的能閉環嗎？讀完你可以拿原始論文去驗證這套說法，也知道自己設計 agent 系統時哪一塊要自己補。

## TL;DR

- **靜態層**來自 [AIOS](https://arxiv.org/abs/2403.16971)：把排程、context、記憶、權限從 agent 應用中抽出來，放進一個共用的 kernel。更早的 [MemGPT](https://arxiv.org/abs/2310.08560) 先把 LLM 的 context 當作業系統的記憶體來管。
- **動態層**的 System 1／2 來自 [SOFAI](https://www.nature.com/articles/s44387-025-00027-5)：先讓快速的求解器出答案，再由後設認知模組決定要不要叫慢速的求解器。
- **System 3** 有兩種意思。[Sophia](https://arxiv.org/abs/2512.18202) 指 agent 內部的長期自我監督層；Wharton 的 [Tri-System Theory](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/) 指人以外的 AI 認知。架構討論要用前者。
- **n8n** 的官方模板庫按用途分成少數幾大類，不是 20 類。它的價值在把「何時升級到貴的模型」「何時交給人」寫成看得見的分支。
- 三塊沒有人正式整合過。閉環靠的是執行結果回頭修正策略的路徑，這一塊目前只有 Sophia 有正式描述。

## 這套框架在說什麼

把三塊疊起來，大致是下面這張圖。底層是所有 agent 共用的資源管理，中間是每次任務怎麼想，上面是誰在長期盯著整個系統變好，n8n 則是把這些規則寫成可執行流程的地方。

```diagram
title: 三層拼起來的樣子
desc: 由下而上是 Agentic OS kernel、n8n 工作流、System 1 與 System 2 的快慢路徑，最上層是 System 3 的長期監督；右側藍線是執行結果回饋到 System 3 的閉環路徑。
caption: 右側藍線是閉環需要的回饋路徑，也是三塊原始出處裡最少被描述的部分。
---
<svg viewBox="0 0 420 568">
  <line class="dg-line" x1="200" y1="96" x2="200" y2="184" marker-end="url(#arrow)"/>
  <line class="dg-line" x1="200" y1="248" x2="200" y2="300" marker-end="url(#arrow)"/>
  <line class="dg-line" x1="200" y1="372" x2="200" y2="424" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M376 336 H400 V60 H376" fill="none" marker-end="url(#arrow-link)"/>
  <rect class="dg-box dg-box--accent" x="24" y="24" width="352" height="72" rx="6"/>
  <text class="dg-label" x="200" y="50" text-anchor="middle" dominant-baseline="central">System 3：長期監督</text>
  <text class="dg-sub" x="200" y="74" text-anchor="middle" dominant-baseline="central">自我模型、長期目標、修正策略（Sophia）</text>
  <rect class="dg-box" x="24" y="148" width="160" height="72" rx="6"/>
  <text class="dg-label" x="104" y="174" text-anchor="middle" dominant-baseline="central">System 1</text>
  <text class="dg-sub" x="104" y="198" text-anchor="middle" dominant-baseline="central">快、便宜、憑經驗</text>
  <rect class="dg-box" x="216" y="148" width="160" height="72" rx="6"/>
  <text class="dg-label" x="296" y="174" text-anchor="middle" dominant-baseline="central">System 2</text>
  <text class="dg-sub" x="296" y="198" text-anchor="middle" dominant-baseline="central">慢、貴、逐步推理</text>
  <line class="dg-line" x1="184" y1="184" x2="216" y2="184" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="200" y="236" text-anchor="middle" dominant-baseline="central">後設認知決定要不要升級（SOFAI）</text>
  <rect class="dg-box dg-box--link" x="24" y="300" width="352" height="72" rx="6"/>
  <text class="dg-label" x="200" y="326" text-anchor="middle" dominant-baseline="central">n8n 工作流</text>
  <text class="dg-sub" x="200" y="350" text-anchor="middle" dominant-baseline="central">分支、驗證、人工核准、模型升級</text>
  <rect class="dg-box dg-box--store" x="24" y="424" width="352" height="72" rx="6"/>
  <text class="dg-label" x="200" y="450" text-anchor="middle" dominant-baseline="central">Agentic OS kernel</text>
  <text class="dg-sub" x="200" y="474" text-anchor="middle" dominant-baseline="central">排程、context、記憶、權限（AIOS）</text>
  <text class="dg-edge" x="200" y="528" text-anchor="middle" dominant-baseline="central">靜態：所有 agent 共用</text>
</svg>
```

這篇適合已經用過 LLM API 或 n8n、開始要把多個 agent 放進同一個產品的人。不需要讀過認知心理學，Kahneman 的快慢思考知道大概就夠。

## 靜態層：Agentic OS 從哪裡來

「Agentic OS」在業界文章裡用法很鬆，學術上最常被引用的是兩篇。

[MemGPT](https://arxiv.org/abs/2310.08560)（2023）先借用作業系統的記憶體階層：context window 是快但小的記憶體，外部儲存是慢但大的記憶體，由 LLM 自己決定資料要換進換出。它解的是「一個 agent 記不住長對話」。

[AIOS](https://arxiv.org/abs/2403.16971)（COLM 2025）把問題放大到多個 agent。它把 LLM 與工具資源從 agent 應用裡隔離出來，放進一個 kernel，由 kernel 提供排程、context 管理、記憶與儲存管理、存取控制；agent 透過 SDK 呼叫這些服務。論文的實驗中，同樣的 agent 交給 AIOS 排程，執行速度最高快到 2.1 倍。

業界版本大多沿用這個分層，只是換了名字。[Fluid AI](https://fluid.ai/blogs/the-architecture-of-an-agentic-os) 把它講成「管理 agent、context、工具、權限與決策的企業層」；[MindStudio](https://www.mindstudio.ai/blog/agentic-os-architecture-four-patterns-claude-code) 拆成 context、共享記憶、技能協作、自我學習四層。[騰訊雲的技術詳解](https://cloud.tencent.com/developer/article/2671167)講得最直白：目前的 Agentic OS 是蓋在 Linux 這類傳統作業系統上的中介層，不是新的核心。

所以「靜態架構」這個詞是準的：這一層回答的是資源放哪、誰能用，不回答每次任務怎麼想。

## 動態層：System 1、System 2 與後設認知

System 1／System 2 出自 Kahneman 的《Thinking, Fast and Slow》：System 1 快而直覺，System 2 慢而費力。把它變成 AI 架構，最完整的是 [SOFAI](https://www.nature.com/articles/s44387-025-00027-5)（Slow and Fast AI，前身是 [Ganapini 等人 2021 年的論文](https://arxiv.org/abs/2110.01834)）。

SOFAI 有三個角色：

- **System 1 求解器**：只靠過去經驗，例如 LLM 或其他機器學習模型
- **System 2 求解器**：做多步驟推理，例如符號規劃器或搜尋演算法
- **後設認知模組**：先看 System 1 的答案夠不夠好，再決定要不要叫 System 2

關鍵在第三個角色。它的選項不是「用 S1 或用 S2」，而是「只用 S1」或「S1 之後再用 S2」，依據是資源、過去紀錄與預期品質。離線時它還會做兩件事：用新紀錄更新 System 1，以及拿 System 2 重算過去的題目，比對後調整自己的仲裁門檻。

這就是動態層的實際形狀：一個會隨經驗調整的升級規則，而不是兩個模型並排。

## System 3 有兩種意思

「System 3」這個詞現在有兩個來源，意思互不相容。

| | Sophia（Sun 等人，2025） | Tri-System Theory（Shaw & Nave，Wharton） |
|---|---|---|
| System 3 是什麼 | agent 內部的長期監督層 | 人以外的 AI 認知 |
| 管什麼 | 自我模型、長期記憶、內在動機、修正自己的推理 | 人把判斷交給 AI 時的行為 |
| 研究對象 | agent 架構 | 人的決策 |
| 適合放進架構圖嗎 | 適合 | 不適合，它描述的是使用者 |

[Sophia](https://arxiv.org/abs/2512.18202) 認為現有 agent 擅長感知（System 1）與推理（System 2），但缺一個持續存在的上層，負責維持身分、檢查推理、把短期行動對齊長期目標。它的做法是包在任何 System 1/2 架構外面的一層，靠四個機制運作：過程監督的思考搜尋、敘事記憶、使用者與自我建模、混合獎勵。論文自承以概念為主，只附了一個小型原型；在原型裡，重複出現的任務推理步數少了八成。

[Tri-System Theory](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/) 研究的是人。受試者能隨時問 AI 時，AI 答對，人的正確率跟著升；AI 答錯，正確率掉到比不能用 AI 的人還低，而且信心反而上升。作者把這叫 cognitive surrender。

如果你在架構圖上寫 System 3，指的應該是 Sophia 那一種。Wharton 的研究比較適合放在「人工核准關卡怎麼設計」的討論裡：它說明了為什麼人工核准不能只是讓人按一下同意。

## 執行層：n8n 模板放在哪裡

n8n 的[官方模板庫](https://n8n.io/workflows/)按用途分成 AI、Sales、IT Ops、Marketing、Document Ops 等少數幾大類，每類底下有上千個社群模板。外面流傳的「20 類」是第三方自己的分法，例如 [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) 就依整合的服務分組。

模板本身是確定性的流程，比較像 System 1 的「學過的套路」。n8n 能接上動態層，靠的是官方部落格〈[Agentic AI design patterns](https://blog.n8n.io/agentic-ai-design-patterns)〉列的幾種模式：

- **成本控制（model cascading）**：先用小模型處理例行任務，必要時升級到強模型。這就是 SOFAI 的 S1→S2 升級，只是門檻由你寫死在分支裡
- **驗證**：輸出不符合 schema 就重試、讓模型自我修正，或送人工
- **治理**：高影響動作前設人工核准、保留執行紀錄、用角色權限限制 agent
- **錯誤復原**：重試、備援模型、備援供應商，最後才升級給人

另一篇〈[AI Agent Architecture Patterns](https://blog.n8n.io/ai-agent-architecture-patterns)〉則把 orchestrator、pipeline、平行分派等拓撲對應到 n8n 的子工作流與分支節點。

## 一個具體範例：退款請求走一遍

假設客服收到一則退款請求：

1. **Agentic OS 層**：請求進來，kernel 決定這個客服 agent 能讀哪些訂單資料、能不能呼叫退款 API。這些權限事先設好，跟這次請求無關。
2. **System 1**：小模型把請求分類成「一般退款」，信心分數高。
3. **後設認知仲裁**：n8n 的分支檢查金額與信心分數。金額低、信心高，就直接走 System 1 的結果。
4. **System 2**：金額超過門檻，或客戶有爭議紀錄，就改叫推理模型讀完整對話與訂單歷史，再提出建議。
5. **人工核准**：退款前在 Slack 送出核准請求。這一步要讓人看到判斷依據，而不是只看到結論。
6. **System 3**：每週把核准結果、被人推翻的案例拿回來，調整第 3 步的門檻與第 2 步的分類規則。

前五步用現成的 n8n 節點都做得到。第 6 步沒有現成元件，是你要自己設計的部分。

## 限制

- **「NCM」找不到出處。** 這套說法裡和 System 1/2/3 並列的 NCM，目前公開的論文與文章裡沒有對應定義。同名的 [Next-Concept Modeling](https://arxiv.org/html/2610.14162v1) 是一種文字生成方法，跟 agent 架構無關。引用這套框架前，先問清楚原作者 NCM 指什麼。
- **三塊沒有被正式整合過。** AIOS 不談快慢思考，SOFAI 不談多 agent 的資源排程，Sophia 不談工作流工具。「邏輯自洽」是組合後的主張，不是任何一篇論文的結論。
- **閉環要自己補。** SOFAI 的離線反思與 Sophia 的 System 3 都有回饋路徑，但都在研究原型裡；n8n 與 AIOS 都沒有內建「拿結果回頭改策略」的元件。

## 怎麼用

- 畫你自己系統的架構圖時，把三層分開畫：資源與權限一層、每次任務的升級規則一層、長期調整一層。哪一層是空的，一眼就看得出來。
- 在 n8n 裡把「什麼時候升級到貴的模型」寫成明確的分支條件，而不是交給 agent 自己決定。這是 System 1→2 最便宜的落地方式。
- 每週固定撈一次被人工推翻的案例，拿來調門檻。這是 System 3 最小的可行版本，不需要等研究原型成熟。
- 寫文章或簡報引用 System 3 時，註明是 Sophia 還是 Wharton 的定義。

## 參考資料

- [AIOS: LLM Agent Operating System](https://arxiv.org/abs/2403.16971)（Mei 等人，COLM 2025）
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)（Packer 等人，2023）
- [Fast, slow, and metacognitive thinking in AI](https://www.nature.com/articles/s44387-025-00027-5)（SOFAI，npj Artificial Intelligence）
- [Thinking Fast and Slow in AI: the Role of Metacognition](https://arxiv.org/abs/2110.01834)（Ganapini 等人，2021）
- [Sophia: A Persistent Agent Framework of Artificial Life](https://arxiv.org/abs/2512.18202)（Sun 等人，2025）
- [Thinking, Fast, Slow, Artificially: AI and Your Brain](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/)（Wharton，介紹 Shaw & Nave 的 Tri-System Theory）
- [Thinking — Fast, Slow, and Artificial（SSRN 論文）](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6097646)
- [n8n workflow templates](https://n8n.io/workflows/)
- [Agentic AI design patterns](https://blog.n8n.io/agentic-ai-design-patterns)（n8n Blog）
- [AI Agent Architecture Patterns](https://blog.n8n.io/ai-agent-architecture-patterns)（n8n Blog）
- [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates)
- [The Architecture of an Agentic OS](https://fluid.ai/blogs/the-architecture-of-an-agentic-os)（Fluid AI）
- [What Is the Agentic OS Architecture?](https://www.mindstudio.ai/blog/agentic-os-architecture-four-patterns-claude-code)（MindStudio）
- [Agentic OS 技術詳解](https://cloud.tencent.com/developer/article/2671167)（騰訊雲開發者社區）
