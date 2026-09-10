---
title: "Stanford CS329Z 導讀 Week 4：先學會邊想邊做，再學會記住——ReAct 與 MemGPT"
date: 2026-09-12
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 5
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 23
tldr: "Week 4 週一用 ReAct 論文把 agent 迴圈定型為想—做—看的交錯序列，週三用 MemGPT 論文把記憶做成作業系統式的分層記憶體；同一週 HW1 Part A 進入收尾，迴圈形狀與記憶設計就是評分前要定案的兩件事。"
description: "帶讀 Stanford CS329Z Week 4 兩篇主讀物：Yao 等人的 ReAct 如何交錯推理與行動，Packer 等人的 MemGPT 如何用虛擬記憶體管理突破 context 上限，以及它們如何對應 HW1 Part A 的收尾。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory-en)

想像你請一個助理查資料：他要嘛坐在位子上憑記憶硬答，要嘛悶頭一直點連結卻從不說明在找什麼。前者答錯時你無從除錯，後者失控時你不知他要去哪。這個兩難，就是 Week 4 兩篇主讀物要解決的事。

週一（10/12，Agent Patterns）的主讀物是 Yao 等人的 [ReAct](https://arxiv.org/abs/2210.03629)（ICLR 2023）。它讓模型把「想」（Thought）和「做」（Action）交錯寫出來，每做一步都回頭看環境回了什麼（Observation）。週三（10/14，Memory & Multi-Agent）的主讀物是 Packer 等人的 [MemGPT](https://arxiv.org/abs/2310.08560)（ICLR 2024）。它把作業系統的分層記憶體搬進 LLM，用 function call 在有限視窗和外部儲存之間分頁。這一週也是 [HW1](https://cs329z.stanford.edu/) Part A 的收尾週：迴圈長什麼樣、記憶放哪裡，就是交卷前要定案的兩件事。

先把位置說清楚：[Week 3](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy) 發了 HW1，Part A 要你手刻一隻 agent；Week 4 給你兩篇論文當施工藍圖。[總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)把整門課定位成「工程學」，而這週就是工程圖攤開的那一週。

## ReAct：想、做、看的交錯迴圈

ReAct 的定義只有一句話：把語言空間併進動作空間。模型原本只能輸出動作，現在還可以輸出「想法」——想法不碰外部環境，只負責整理目前為止的脈絡，幫下一步的行動做決策。任務軌跡於是長成 Thought → Action → Observation 的重複序列，推理用來決定查什麼，行動用來把外部資訊餵回推理。

為什麼需要這個？此前的兩條路各有絕症。純推理（[Chain-of-Thought](https://arxiv.org/abs/2202.03629)）是靜態黑箱：模型只用內部表徵生成想法，不接地氣，錯了就一路錯下去。純行動（直接生成動作）則沒有工作記憶：論文裡的 Act 基線會忘記水槽裡沒有胡椒罐，原地重複幻覺動作。ReAct 的論點是，人類做菜時本來就這樣：切完菜想一下該燒水了，缺鹽就換醬油，食譜忘了就翻書——想與做本來就是互相服務的。

做法上，問答任務用的是陽春 [Wikipedia](https://www.wikipedia.org/) API，只有三種動作：search 查條目、lookup 在頁內找字串、finish 交答案。刻意做得這麼弱，是為了逼模型用顯式語言推理來檢索，而不是靠強檢索器作弊。決策任務（[ALFWorld](https://alfworld.github.io/) 文字遊戲、[WebShop](https://webshop-pnlp.github.io/) 網購導航）則反過來：想法只稀疏出現，什麼時候想、什麼時候做，讓模型自己決定。

**怎麼做**：今晚就把你的 HW1 Part A 迴圈凍結成這個形狀。每次迭代只做三件事：寫一行 Thought（為什麼選這個行動）、發一個 Action（調工具）、記一筆 Observation（工具回了什麼）。再加兩條護欄：步數上限（HotpotQA 取 7 步、FEVER 取 5 步，超限退回 CoT-SC），以及 finish 動作必須附答案。交卷前檢查每一條失敗軌跡屬於哪一種：推理錯、檢索空、還是鬼打牆重複——這個分類表論文附錄有現成的。

## 對照實驗：幻覺去哪了

ReAct 最值得細讀的不是分數，是 Table 2 的人工錯誤分析。作者抽了 200 條軌跡逐條標註，發現 [CoT](https://arxiv.org/abs/2202.03629) 答錯的案例裡，幻覺佔了 56%。同一套抽查下，ReAct 的幻覺失敗是 0%。代價是結構限制換來的僵硬：ReAct 的推理錯誤率比 CoT 高，常見死法是同一組想法和動作無限重播，跳不出迴圈。

分數上兩邊互有勝負：在 [FEVER](https://fever.ai/) 事實查核任務，ReAct 以 60.9 對 56.3 贏過 CoT；在 [HotpotQA](https://hotpotqa.github.io/) 多跳問答，ReAct 以 27.4 對 29.4 小輸。最強的是混血版。HotpotQA 由 ReAct 先答、失敗再退回 CoT-SC，衝到 35.1。FEVER 則反過來，由 CoT-SC 先答、共識不足再退回 ReAct，拿到 64.6。內部知識負責結構，外部檢索負責事實——分工寫在這裡，後面 multi-agent 還會回來。

決策任務的分數更乾脆：只用一兩個 in-context 範例，ReAct 在 ALFWorld贏過模仿學習基線 34 個百分點。在 WebShop 贏過當時最佳方法 10 個百分點。微調實驗則給小模型一條活路：只用 3000 條正確軌跡微調，8B 模型的 ReAct 反超所有 62B 的 prompting 成果。教模型「如何查」，比教它「背答案」更通用——這句話值得寫進 Part B 反思。

**怎麼做**：給你的 agent 加一個 CoT 退路。ReAct 走到步數上限還沒答案，就退回純 CoT 答一次；反之 CoT 多次採樣共識太低，就切去 ReAct 查外部資料。記錄兩種路徑各救回幾題，這就是 Part A 報告裡「錯誤分析」一節的現成素材。

## MemGPT：記憶體不夠，就跟作業系統借

如果 ReAct 解決的是「怎麼動」，MemGPT 解決的是「記得住」。動機很實際：Transformer 的注意力成本隨長度平方成長，硬拉長 context 又貴又難用（模型還會搞丟中間的資訊）。MemGPT 換了一條路：把 context 視窗當成主記憶體，把外部儲存當成硬碟，讓模型自己當記憶體管理員，用 function call 把資訊分頁換入換出。

架構分兩層。主記憶體（main context）是 prompt 裡的三段。唯讀的系統指令、可讀寫的工作區（working context，放使用者偏好和人設等關鍵事實）、先進先出的訊息佇列。外部記憶是兩座資料庫：recall storage 存完整對話歷史，archival storage 存任意長的外部文件。快爆掉時，系統先發「記憶體壓力」警告。論文以水位七成為例，讓模型自己決定什麼值得寫進工作區；真的滿了才沖掉一半佇列，並留下一句遞迴摘要。控制流靠事件和中斷：使用者訊息、系統警告、定時器都會觸發推理，function chaining 讓模型一次做完多步檢索再回話。

兩個實驗各打一個痛點。多輪對話任務裡，基線 GPT-4 只能看到前五輪的壓縮摘要，深層記憶檢索準確率只有 32.1%。接上 MemGPT、用分頁檢索讀完整歷史後，同一個底層模型拉到 92.5%。文件問答任務裡，固定視窗基線塞越多文件越要截斷、準確率跟著掉，MemGPT 則靠分頁檢索幾乎不受影響。最漂亮的是巢狀鍵值檢索：值本身可能是下一層的鍵，要連跳多層才找得到答案；GPT-4 基線到第三層就歸零，只有 MemGPT 穩定走完。

**怎麼做**：把你的 agent 記憶拆成兩本帳。工作區只放「沒了它下一動就做錯」的東西（使用者目標、已確認的約束），其他一律寫外部儲存、用檢索拿回。再寫一條逐出規則：佇列超過幾則訊息就摘要，摘要只留事實不留寒暄。HW1 評分看的是設計取捨，這條規則和它的理由可以直接寫進報告。

## 它在課程裡的位置

Week 4 是承先啟後的一週。往前，它給 [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) 的 workflow/agent 之辨補上可運轉的形狀：agent 就是 ReAct 迴圈加上記憶分層。往後，週三下半場的多智慧體協作（分工、通訊、 emergent 行為）是 Week 5 的主菜。ReAct 論文結尾那句「人類可以直接改 Thought 來即時糾正 agent」，正是 multi-agent 裡人類介入協作的起點。

時間線上，HW1（10/30 截止）的 Part A 應在這週收尾：迴圈形狀定了、記憶設計定了，剩下就是跑分和寫錯誤分析。Part B 的框架重寫（[Week 3](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy) 的 DSPy）可以下週再動。記住 Week 1 的論點：系統贏過模型——這週的兩篇論文就是那句話的施工圖。

## 本週 Course Material 對照

- 週一 10/12 Agent Design Patterns & Scaffolds：主讀物 ReAct 論文（本文已導讀）；本節無 additional readings。
- 週三 10/14 Agent Memory Architectures：主讀物 MemGPT（本文已導讀）。延伸閱讀三份各補一塊拼圖。
  - [Letta 官方部落格](https://www.letta.com/blog/agent-memory)把分層記憶翻成施工零件：常駐視窗的 core memory 區塊、存完整歷史的 recall、存外部知識的 archival。它還補上 sleep-time agents，在閒時非同步整理記憶。結論只有一句：記憶即 context 工程，記得什麼等於什麼 token 在視窗裡。
  - [Mem0](https://arxiv.org/abs/2504.19413)走上線路線：動態抽取、合併、檢索對話中的關鍵資訊，另有圖結構變體捕捉實體關係。它在長對話基準的 LLM 評分指標上，相對 OpenAI 提升 26%。
  - [Park 等人的 Generative Agents](https://arxiv.org/abs/2304.03442)示範記憶的另一端：25 個智慧體住進小鎮，用自然語言存下完整經歷。智慧體定期把經歷寫成高層反思，檢索回來做計畫。只靠一句「想辦情人節派對」的初始設定，就湧現發邀請、邀約、準時赴約的社會行為。消融證實觀察、計畫、反思缺一不可。
- 課表原文：[CS329Z 官網 Week 4](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[Week 3：工具接進來，框架換上去](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)、[Week 2：先分清 workflow 和 agent](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Yao et al., ReAct, ICLR 2023](https://arxiv.org/abs/2210.03629)、[Packer et al., MemGPT, ICLR 2024](https://arxiv.org/abs/2310.08560)、[Wei et al., Chain-of-Thought](https://arxiv.org/abs/2202.03629)
- 專案與資料：[ReAct 專案頁](https://react-lm.github.io/)、[MemGPT 研究站](https://research.memgpt.ai/)、[ALFWorld](https://alfworld.github.io/)、[WebShop](https://webshop-pnlp.github.io/)、[FEVER](https://fever.ai/)、[HotpotQA](https://hotpotqa.github.io/)
