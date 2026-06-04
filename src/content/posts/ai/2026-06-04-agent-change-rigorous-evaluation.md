---
title: "調整 agent 之後，怎麼嚴謹比較前後差異：從 golden set 到統計檢定"
date: 2026-06-04
category: ai
type: deep-dive
tags: [evaluation, rag, llm-judge, ab-testing, ai-agent, llm]
lang: zh-TW
tldr: "即使 temperature=0，LLM 輸出實測仍可能抖動 15%。要嚴謹比較 agent 調整前後，得靠凍結 golden set、每題跑 ≥3 次取平均、LLM-as-judge 盲評（pairwise 偏好翻轉率高達 35%）與配對統計檢定，而不是前後各問一遍看感覺。"
description: "一套可落地的 LLM agent 評估方法論：golden set 規模、rubric 設計、控制變因、LLM-as-a-judge 偏誤與校準、配對統計檢定、RAG 雙層指標，以及離線 eval 到線上 A/B 的上線階梯。"
draft: false
glossary:
  - term: "golden set"
    aliases: ["golden dataset"]
    definition: "一份凍結不變、有標準答案或人工評分的測試集；前後版本都跑同一份，比較才有可比性。"
    context: "本文把 golden set 當成整套評估方法論的北極星。"
  - term: "rubric"
    aliases: ["評分準則"]
    definition: "把「好答案」拆成可逐項打分的具體標準（正確性、完整性、語氣等），讓人工或 LLM-as-judge 的評分可重複、可比較。"
    context: "本文用 rubric 設計來降低主觀評分的抖動。"
---

調了 prompt、換了模型、改了知識庫參數之後，最常見的驗收方式是「前後各問幾題看看哪個比較好」。問題是這個方法幾乎一定會騙到你自己。這篇整理一套可落地的方法論：怎麼建測試集、怎麼用 LLM 當評審又不被它的偏誤帶歪、怎麼用統計判斷差異是不是真的，以及 RAG 系統要特別量什麼。核心只有一句話——嚴謹 = 固定變因 + 凍結基準 + 足夠樣本 + 多次取樣壓抖動 + 統計檢定。

## 為什麼「前後各問一遍」不算數

有三個天生的陷阱會讓直覺式比較失效。

第一是**非決定性**。多數人以為把 temperature 設成 0 輸出就固定了，但 2024 年那篇〈Non-Determinism of "Deterministic" LLM Settings〉（arXiv 2408.04667）實測五個主流託管 LLM、八種任務，發現「即使在假定為 deterministic 的設定下，跨次執行的準確率變異最高達 15%」。也就是說，你看到的前後差異，很可能只是同一個版本在不同次呼叫之間的隨機抖動。

第二是**確認偏誤**。沒有固定的標準答案與評分準則，「新版好像比較好」往往是因為你已經知道哪個是新版、潛意識想證明改動有效。

第三是**小樣本錯覺**。試 5 題覺得變好，但 5 題不足以代表真實流量分布，更不足以做任何統計判斷。

對抗這三點的，就是下面五個設計決定。

## 第一步：凍結一份 golden set

golden set 是整套評估的北極星——一份固定、有標準答案或人工評分的測試集，前後版本都跑同一份才有可比性。

規模要多大？Galtea 的 2026 評估指南給了很實用的經驗值：「50 題能偵測大的退步；200 題能對 3–5% 的品質變化給出統計信心；超過 500 題就是邊際遞減，除非你的應用有很多異質的子任務需要分開覆蓋。」起手不用一次到位，Datadog 建議「先用 20–50 題涵蓋核心使用情境，及早驗證流程」，再從 production trace 慢慢長大。

題目來源最好是真實對話 log（最有代表性），刻意納入高頻問題、爭議問題、過去答錯的題，以及邊界與紅隊案例——golden set 蓋的是「你已經看過的失敗」，上線前的對抗性測試才能找到你沒看過的。每題至少標註：問題、期望答案/要點、類別、難度。

最關鍵的紀律是**凍結並版控**。rubric、dataset、grader 都要進版控、留 changelog。Statsig 特別提醒：要「保護歷史基線，免得改了評分標準卻被當成模型變好（a rubric change does not masquerade as a model win）」。

## 第二步：先把 rubric 寫死

別只給「好/不好」。rubric 有兩種：**analytic（逐準則打分）** 和 **holistic（單一總分）**。analytic 較易 debug、能看出「為什麼壞」，適合長期監控與回歸根因分析；holistic 便宜但藏掉 trade-off。

評分前先寫死準則並附上好/壞範例，不要邊看邊定標準。但要有心理準備：rubric 第一版一定是錯的。Galtea 講得直接——「評分標準不是設計出來的，是評分評出來的。任何 rubric 的第一版都會在你無法預期的地方出錯，直到你看著它在真實案例上失敗。」所以正確流程是：先拿真實 output 試評 → 看它在哪裡兩個人會打不同分、或根本沒覆蓋到 → 再迭代 rubric。

## 第三步：控制變因，每題跑多次

兩個原則。

**一次只改一個變數。** 這次只動 prompt 就別同時換模型，否則分數變了也無法歸因到底是誰的功勞。對 RAG 系統來說，改 prompt 與改知識庫/檢索參數要拆成兩次獨立實驗。

**每題各跑 ≥3 次取平均。** 既然非決定性無法消除，就用重複取樣把它平均掉。實務做法是設「可接受的變異帶」而非硬性門檻——SitePoint 的測試指南建議「至少跑三次（算穩定平均值的最小需求）後取平均，並設變異區間而非硬切點」。對關鍵案例可以更進一步用 pass^k 的概念，重跑 k 次都要過才算數。

## LLM-as-a-judge：盲評，並選對協定

樣本一多就得讓 LLM 當評審。這裡有兩個常被忽略的決策。

**pointwise（絕對打分）還是 pairwise（A/B 二選一）？** pairwise 較貼近人類偏好、適合「候選版 B 是否優於 baseline A」的選型決策。但它有個嚴重弱點：Tripathi 等人在 COLM 2025 的〈Pairwise or Pointwise?〉量化出「pairwise 偏好在約 35% 的情況下會被干擾特徵翻轉，而絕對打分只有約 9%」。也就是生成端只要塞一些討喜但無關的特徵，就能讓 pairwise 評審改判。結論：選型用 pairwise，長期監控與 debug 用 analytic pointwise。

**處理已知偏誤。** Evidently 的指南整理了三個經典偏誤：position bias（偏好排在前面的）、verbosity bias（偏好較長的答案）、self-enhancement bias（偏好同型號模型生成的）。其中 position bias 的標準解法是 **swap-and-average**：每一對答案交換 A/B 順序各跑一次，兩次都判同一邊贏才算高信心。

最後一定要**盲評**：評分時隱藏哪個是新/舊版、隨機打亂順序。並抽 10–20% 做人工複評，確認 judge 和人類一致。樣本夠重要時，可以用 jury / panel（多個異質模型投票）取代單一 judge 提升可靠度。

## 用統計判斷，不是看感覺

把前後跑出來的分數變成可下結論的證據，需要幾個動作：

- **配對差異分析**。同一題前後都有測，屬於配對設計，用 paired t-test 比「各自算平均再相減」更有檢定力（背景變異被同一題吸收掉）。
- **選對檢定**。平均位移用 Welch's t-test；比中位數或排名用無母數檢定。
- **先算 MDE 與 power**。Cameron Wolfe 的〈Applying Statistics to LLM Evaluations〉點出樣本量需求會隨「變異越大、想偵測的效應越小、要求的信心越高」而上升——這也回頭解釋了為什麼想驗證 3–5% 的小改善需要 ~200 題。
- **跑一次 A/A test**。把同一個版本分成兩組互比，量出「自然變異」的基線。如果 A/A 都能跑出看起來顯著的差，代表你的 pipeline 雜訊太大，任何 A/B 結論都不可信。
- **務必看退步的題**。平均分上升、但某一類問題整片崩掉，常常比平均數字更重要。

## RAG 系統要分兩層量

如果你的 agent 是 RAG（先檢索再生成），整體分數好壞無法告訴你問題出在檢索還是生成。RAGAS 與 DeepEval 的共識是**把 retriever 和 generator 分開評**：

| 層 | 指標 | 問的問題 |
|---|---|---|
| Generator | **Faithfulness（忠實度/幻覺率）** | 答案是否只來自檢索到的內容、有沒有亂編？ |
| Generator | **Answer Relevancy** | 答案有沒有真的回答到問題？ |
| Generator | Answer Correctness | 跟標準答案比是否正確且完整？ |
| Retriever | **Context Precision / Recall** | 檢索到的內容相不相關、該找的有沒有找齊？ |

Faithfulness 是直接量幻覺的指標。RAGAS 的算法很直觀：把生成的答案拆成 N 個陳述句，逐句檢查能不能由檢索到的 context 推得，能推得的比例就是分數。想要更可靠的幻覺偵測，也可以用專門的分類模型（如 Vectara HHEM）取代 LLM-as-judge——分類模型比讓另一個 LLM 來判更穩定。

## 離線分數高 ≠ 線上會贏

離線 eval 和線上 A/B 是互補的，不是二選一。離線適合上線前的回歸與選型（可重複、可控、安全）；線上才能量到真實使用者行為（任務完成率、追問率、滿意度）和分布漂移。Growthbook 與 Llama 的部署文件都推薦一條漸進放量的階梯：

```
離線 eval (CI)  ──►  shadow mode  ──►  feature flag 小流量  ──►  線上 A/B
   擋回歸          複製流量給新版       小範圍真實曝光          量商業指標
                   但不給使用者看
```

shadow mode 的價值在於用真實 traffic 跑新版、但不影響使用者——Growthbook 引用 DoorDash 的例子，他們測試與生產之間曾出現 4% 的準確率落差，正是 shadow mode 設計來提早抓出的那種差距。最後把 A/B 中的困難案例餵回 golden set，整套就形成一個會自我強化的飛輪。

## 工具怎麼選

從零開始的話，不需要一上來就上平台，先用輕量工具把流程跑起來：

| 工具 | 定位 | 適合 |
|---|---|---|
| **promptfoo** | YAML + CLI，CI 回歸、矩陣比較、能在 PR 上產生 before/after | prompt/模型迭代時的回歸測試 |
| **DeepEval** | Python library，metric 覆蓋最廣（含 faithfulness） | 程式碼導向、塞進 CI |
| **RAGAS** | RAG 專屬學術指標最完整 | 有檢索層的系統 |
| **Braintrust / LangSmith** | 平台，並排比較、人工標註、release gating | 需要 PM 和工程一起看結果 |

成熟團隊常同時跑兩套：一套開發期評估（promptfoo 或 DeepEval）+ 一套 production observability（Arize Phoenix / Langfuse / Braintrust）。全 $0 的組合是 promptfoo + Arize Phoenix。

## 整體來說

最低可行的嚴謹版本其實不難：30–50 題凍結 golden set → 一次只改一個變數 → 每題各跑 3 次 → LLM-as-judge 盲評（pairwise + swap-and-average）+ 抽樣人工複評 → 算配對勝率並盯著退步清單。如果要對 3–5% 的小改善有信心，就把 golden set 拉到 ~200 題、先跑 A/A 量基線、做配對 t-test。重大改動別只信離線分數，走 shadow → 小流量 → A/B 的階梯。

真正的成本不在工具，而在那份 golden set 與 rubric 的維護——但它也是你唯一能把「感覺變好了」換成「有證據變好了」的東西。

## 參考資料

- [Non-Determinism of "Deterministic" LLM Settings (arXiv 2408.04667)](https://arxiv.org/html/2408.04667v5)
- [Galtea — The complete guide for LLM evaluations 2026](https://galtea.ai/blog/llm-evaluation-complete-guide)
- [Datadog — Offline evaluation for AI agents: Best practices](https://www.datadoghq.com/blog/offline-llm-evaluations)
- [Statsig — Golden datasets: Creating evaluation standards](https://www.statsig.com/perspectives/golden-datasets-evaluation-standards)
- [Tripathi et al., COLM 2025 — Pairwise or Pointwise? Evaluating Feedback Protocols for Bias in LLM-Based Evaluation](https://openreview.net/forum?id=uyX5Vnow3U)
- [A Systematic Study of Position Bias in LLM-as-a-Judge (IJCNLP 2025)](https://aclanthology.org/2025.ijcnlp-long.18.pdf)
- [Evidently AI — LLM-as-a-judge: a complete guide](https://www.evidentlyai.com/llm-guide/llm-as-a-judge)
- [Cameron R. Wolfe — Applying Statistics to LLM Evaluations](https://cameronrwolfe.substack.com/p/stats-llm-evals)
- [Statsig — A/B testing for LLMs: When statistical significance misleads](https://www.statsig.com/perspectives/abtesting-llms-misleading)
- [SitePoint — Testing AI Agents: Deterministic Evaluation in a Non-Deterministic World](https://www.sitepoint.com/testing-ai-agents-deterministic-evaluation-in-a-non-deterministic-world)
- [RAGAS docs — Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness)
- [DeepEval — Faithfulness metric](https://deepeval.com/docs/metrics-faithfulness)
- [Vectara — Evaluating RAG with RAGAs (HHEM)](https://www.vectara.com/blog/evaluating-rag)
- [Growthbook — AI Evals vs. A/B Testing: Why You Need Both to Ship GenAI](https://www.growthbook.io/blog/ai-evals-vs-a-b-testing-why-you-need-both-to-ship-genai)
- [Llama docs — A/B testing in production](https://www.llama.com/docs/deployment/a-b-testing)
- [promptfoo](https://www.promptfoo.dev/) ・ [DeepEval](https://deepeval.com/) ・ [RAGAS](https://docs.ragas.io/) ・ [Braintrust](https://www.braintrust.dev/) ・ [LangSmith](https://www.langchain.com/langsmith)
