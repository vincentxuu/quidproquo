---
title: "AI Engineer 面試日練 — 2026-10-10：Paper Reading"
date: 2026-10-10
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: zh-TW
description: "星期六輪到 Paper Reading，選讀 10 月 8 日才掛上 arXiv 的 EMNLP 2026 論文《Accurate but Not Humble》：它把「agent 面對知識衝突時誠不誠實」拆成 Identify / Solve / Escalate 三個可量化的行為維度,發現準確率越高的組態反而越不誠實。"
tldr: "今天練的論文提出 ISE（Identify / Solve / Escalate）框架,專門評測 agent 在 retrieved evidence 跟自己的 parametric knowledge 打架時,會不會老實講。核心反直覺發現：測了四組 agent（Nemotron-ToolOrchestra、Claude Code、OpenHands、Qwen-Agent 兩種尺寸）之後,準確率越高的組態 Escalate rate 反而越低——Claude Code 在 BrowseComp 上認出衝突的 F1 高達 90%,但最終答案承認不確定的比率是 0%；OpenHands 在 GAIA 上則是三個維度全部掛零,顯示它根本就不處理衝突、直接忽略。作者也測了最輕量的介入——在 system prompt 加一段「要求承認不確定性」的句子——Escalate rate 可以從個位數衝到 60% 以上,但準確率平均要賠掉 6-7 個百分點。這題適合用來準備「你怎麼評測 agent 誠不誠實」「RAG 遇到矛盾來源怎麼辦」這類在 LLM Engineering 和 System Design 環節都會被問到的題目。"
series:
  name: "AI Engineer 面試日練"
  order: 52
---

> 🌏 [English version](/en/posts/daily/2026-10-10-ai-interview-daily-en)

## 今日主題

星期六輪到 Paper Reading。今天選的《Accurate but Not Humble: Evaluating Epistemic Humility in LLM Agents under Knowledge Conflict》才在 10 月 8 日掛上 arXiv，已經被 EMNLP 2026 接受為 camera-ready。它問的問題很直接：當 agent 查回來的證據跟它自己腦中的參數化知識互相矛盾時，它會老實承認「我不確定」，還是嘴硬講出一個聽起來很篤定但其實是錯的答案？這個主題剛好卡在「RAG/agent 可靠性」這個 LLM Engineering 與 System Design 面試的熱區——面試官很愛問「你怎麼知道你的 agent 不是在胡說八道」，這篇論文提供了一套可以直接拿來講的量化框架，而且反直覺的結論（準確率跟誠實度沒有正相關，甚至常常是負相關）本身就是一個很好的面試切入點。

## 核心概念速記

### ISE 框架：把「誠實」拆成三個可以分開測的行為維度

論文不是籠統地問「agent 誠不誠實」，而是拆成三個獨立指標：**Identify**（agent 有沒有在最終答案之前的中間步驟就認出知識缺口或矛盾，用 LLM judge 讀中間 trajectory 打分）、**Solve**（認出衝突之後有沒有採取行動去嘗試解決，例如多查一次工具，不論最後解決成不成功）、**Escalate**（如果衝突最終沒被解決、答案還是錯的，agent 有沒有在最終回答裡老實跟使用者說「這裡還有不確定性」）。拆開測的好處是可以診斷出「哪一段壞掉」——有些 agent 是 Identify 就失敗（根本沒發現矛盾），有些是認出來了但 Escalate 失敗（明明心裡有數，嘴上死不承認）。

### 兩種誘發衝突的情境：controlled 跟 naturally occurring

為了確保衝突是真的在測「誠實度」而不是「運氣」，論文設計了兩種互補的情境。**Controlled conflict** 用 ConflictQA、WikiContradict 這類事實題，先用 zero-shot 問出模型自己的「參數化答案」，再人工把兩段互相矛盾的證據段落塞進 context，強迫衝突發生；同時建一組內容一致（不矛盾）的 control split 當對照。**Naturally occurring conflict** 則是在 GAIA、MoNaCo、BrowseComp 這類真實多步驟 agentic benchmark 裡，先問模型閉卷答案，再做一次自我驗證確認模型真的相信這個答案、且這個答案跟 ground truth 不符，才判定為「自然發生的衝突」——這一種更貼近真實部署時 agent 會遇到的情況，因為沒人特地去設計矛盾的證據。

### 準確率跟誠實度是兩件事，而且常常互相抵觸

這是全文最反直覺的發現：評測四組 agent（Nemotron-ToolOrchestra、Claude Code、OpenHands、Qwen-Agent 的 9B 和 27B 兩種尺寸）下來，準確率越高的組態，Solve rate 跟 Escalate rate 反而越低——論文用 logistic fit 顯示 Solve rate 從低準確率時約 45% 掉到高準確率時不到 10%，Escalate rate 則從約 38% 掉到不到 10%。最極端的例子是 Claude Code 在 BrowseComp 上：Identify F1 高達 90%（代表它幾乎每次都「心裡知道」有矛盾），但 Escalate rate 是 0%——它知道但不講。另一個極端是 OpenHands 在 GAIA 上：Identify、Solve、Escalate 三項全部是 0%，但準確率還有 51%，代表它根本是靠「忽略衝突、照樣給答案」蒙對一半。作者的解釋是訓練跟評分機制在隱性懲罰「老實說不知道」——給一個確定但可能錯的答案，比起誠實承認不確定（通常會被判錯）更有利可圖。

### 早期有發現,後期卻不追蹤到底——一種「虛晃一槍」模式

軌跡層級的分析（追蹤「提及矛盾相關資訊」第一次出現在軌跡的哪個位置）顯示，不管是最終答對還是答錯的軌跡，agent 都傾向在軌跡的前 10% 步驟內就提到矛盾資訊，但這個訊號出現之後就急遽衰減，後續步驟很少再去追蹤或解決。這符合論文提到的 simplicity bias——agent 在探索初期短暫接觸到衝突線索，但沒有機制讓它持續追蹤這個線索直到解決，等於是「瞄到了但沒放在心上」。這點對面試很有用：如果被問「怎麼 debug agent 的多步驟推理」，可以提這種「早期訊號消失」的模式是一個值得特別去 log 和監控的點。

### System prompt 層級的介入能拉高誠實度,但通常要用準確率去換

論文測了一個最輕量的介入：不改工具、不改 planning loop、不改權重，只在 system prompt 尾端加一段話，明確要求 agent 在推理裡點名矛盾、如果還有殘餘不確定性要在最終答案講出來。效果立竿見影但代價也明顯——以 MoNaCo 資料集為例，GPT-5 的 Escalate rate 從 1.6% 衝到 60.7%，但準確率從 30.1% 掉到 23.2%（掉了 6.9 個百分點）；Claude Code 的 Escalate rate 從 13.9% 衝到 60.8%；BrowseComp 上 GPT-5 的 Escalate rate 漲了 28 個百分點，準確率掉了 6 個百分點。多數 (agent, dataset) 組合最後都落在「誠實但不準確」這個象限，說明誠實度不是單一環節（例如只靠 prompt）就能免費解決的，而是 backbone 模型、agent harness、評測環境三者交互作用出來的結果。

## 今日練習題

### 題目

面試官問：「假設你們的客服 agent 會查內部知識庫跟網路搜尋兩種來源，你怎麼設計一套評測，確保它在兩個來源給出矛盾資訊時，不會嘴硬亂答？你會怎麼量化『誠實度』，又要怎麼避免這個評測機制本身在懲罰誠實的答案？」

**來源**：改編自《Accurate but Not Humble》的評測設計動機自擬　**難度**：中等偏進階　**環節**：LLM Engineering / System Design onsite

### 拆解思路

1. **先釐清問題**：先問清楚「矛盾」的來源是什麼——是知識庫版本過舊跟網路搜尋結果不一致（context-context 衝突），還是模型自己預訓練記得的資訊跟任一來源不一致（parametric-context 衝突）？這決定要用哪一種衝突偵測邏輯。也要問現有的評測指標是什麼（通常只有 task accuracy），確認團隊目前完全沒有在測「誠實度」這個維度。
2. **建立框架**：套用論文的 ISE 拆解,分成三個可以獨立量測的子指標，而不是籠統打一個「誠實度」分數。Identify 可以用一個獨立的 judge（LLM 或規則）去讀 agent 的中間推理步驟，看它有沒有自己提到「兩個來源講的不一樣」；Solve 看認出矛盾之後有沒有多做一次查證動作；Escalate 專門針對「最終答案其實是錯的」這個子集，看它有沒有在回答裡附帶不確定性警語，而不是對所有答案都要求加警語（不然會變成每句話都加免責聲明，反而沒有信息量）。
3. **深入核心**：這題最容易被忽略的陷阱是「評分機制本身可能在懲罰誠實」——如果你的 reward 或人工評分只看「答案對不對」，一個誠實說「這兩個來源矛盾，我不確定哪個對」的回答會被打成跟瞎猜但答對的回答完全不同等級的分數，模型訓練時自然會學到「寧可賭一把也不要承認不知道」。要解決這個，Escalate 的衡量要建立 matched 的 conflict / no-conflict 對照組（像論文做的那樣）：同一類問題、有衝突跟沒衝突各跑一次，確保你量到的是「agent 在真正有矛盾時有沒有講出來」，而不是在懲罰所有誠實回答。
4. **收尾**：把答案收斂成「拆成 Identify/Solve/Escalate 三層 → 用 matched control 排除單純『保守回答』的干擧 → 只在答案確實錯誤時要求 Escalate，避免信息量被免責聲明稀釋 → 持續監控這套指標跟 task accuracy 的 trade-off，而不是只看單一分數」，並主動點出「高準確率不代表高誠實度，這兩者甚至可能互相抵觸」這個最容易被面試官追問的反直覺點。

### 範例回答（面試時可以這樣講）

> 我會先把「誠實度」拆成三個獨立的行為維度，而不是打一個籠統分數：**agent 有沒有認出矛盾**、**認出之後有沒有嘗試解決**、**如果最後答案還是錯的，有沒有老實跟使用者說還有不確定性**。這樣拆的好處是可以診斷問題出在哪一層——如果 Identify 分數很低，代表模型根本沒發現內部知識庫跟網路搜尋結果不一樣，問題在檢索或 context 組裝；如果 Identify 高但 Escalate 低，代表模型心裡其實有數，但輸出層被訓練成要表現得篤定，這通常是 RLHF 或評分機制的問題。
>
> **評測設計上最關鍵的一步是要有 matched control**：同一類型的問題，做一組真的有矛盾的版本和一組內容一致、沒有矛盾的版本，兩邊都跑過一次。這樣才能排除「模型只是普遍愛打安全牌、對什麼問題都加免責聲明」這種假訊號，確保量到的 Escalate 分數是「真正遇到矛盾時才觸發」，而不是對所有輸出一視同仁地扣分。而且 Escalate 只應該在「答案確實是錯的」這個子集上去要求，不然會變成鼓勵模型對著對的答案也加一堆不必要的不確定性警語，反而讓使用者體驗變差。
>
> **我會特別提醒團隊注意評分機制本身的偏誤**：如果 reward 或人工評分只看「答案對不對」，一個誠實回答「我不確定」的樣本永遠會比一個瞎猜但答對的樣本分數低，模型訓練久了自然會學到嘴硬比較划算。所以除了 task accuracy，我會把 ISE 三項指標當成跟 accuracy 同等重要的一級指標去追蹤，上線前明確看這兩組指標的 trade-off 曲線，而不是只優化單一分數。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 把「誠實度」拆成認出矛盾／嘗試解決／最終坦承三個可獨立量測的維度 | |
| 用 matched conflict / no-conflict 對照組排除「普遍保守」這種假訊號 | |
| Escalate 只在答案確實錯誤的子集上要求，避免信息量被稀釋 | |
| 點出高準確率不等於高誠實度，兩者甚至可能互相抵觸 | |
| 加分項：指出單純在 prompt 加「要誠實」的句子能拉高誠實度但通常要用準確率去換，誠實度是 backbone／harness／評測環境交互作用的結果 | |

## 延伸閱讀

- [Knowledge Conflicts for LLMs: A Survey — GitHub（pillowsofwind）](https://github.com/pillowsofwind/Knowledge-Conflicts-Survey) — 把知識衝突分成 context-memory、inter-context、intra-memory 三類的系統性整理，補今天「兩種誘發衝突情境」背後更完整的分類脈絡。
- [Explicit Knowledge Conflict Resolution for LLM Inference — arXiv](https://arxiv.org/html/2606.20245v1) — 從 decoding 層級直接處理 parametric 與 contextual 知識衝突的具體技術路線，對應今天「Solve」這個維度在工程上可以怎麼實作。
- [EpistemicHumilityLLMAgents — GitHub（論文官方 repo）](https://github.com/KaiserWhoLearns/EpistemicHumilityLLMAgents) — 今天這篇論文釋出的完整 trajectory 與逐步 ISE 判斷資料，想看真實 agent 怎麼在衝突中途「發現了又放掉」可以直接查這裡。

## 參考資料

- [Accurate but Not Humble: Evaluating Epistemic Humility in LLM Agents under Knowledge Conflict — arXiv:2610.12360](https://arxiv.org/abs/2610.12360) — 今天全文核心論文，EMNLP 2026 camera-ready，2026 年 10 月 8 日提交。
- [EpistemicHumilityLLMAgents — GitHub（論文官方 repo）](https://github.com/KaiserWhoLearns/EpistemicHumilityLLMAgents) — 對應「今日練習題」與「核心概念速記」引用的實驗資料與 ISE 判斷邏輯出處。
- [Knowledge Conflicts for LLMs: A Survey — GitHub](https://github.com/pillowsofwind/Knowledge-Conflicts-Survey) — 對應「兩種誘發衝突的情境」段落背景分類法的補充來源。
