---
title: "Stanford CS329A 導讀：這門課教自我改進，也親口說了它改進不了什麼"
date: 2026-08-20
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, reasoning, llm]
lang: zh-TW
tldr: "CS329A 的軸心是 generation–verification gap：模型答得出來，卻認不出哪個對。但課程自己下的結論更值得記——目前這些方法讓模型變得更穩定，不是更聰明。錄影公開 9 支，只涵蓋 20 堂中的 9 堂。"
description: "Stanford CS329A: Self-Improving AI Agents 完整導讀，逐堂讀完公開的九支錄影：課程主軸、34 篇閱讀清單的分組邏輯、自我改進只在哪條窄帶裡發生、兩次開課的課綱 diff，以及自學者實際拿得到什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)

[CS329A: Self Improving AI Agents](https://cs329a.stanford.edu/) 是 Stanford 電腦科學系的三學分研究所 seminar，講的是「模型上線之後怎麼繼續變強」。它不教 LangGraph，不教 CrewAI，整學期沒有一堂在講框架怎麼拼。

它教一個缺口，然後在最後一堂親口說這個缺口目前補到哪、補不到哪。

這篇是把公開的九支錄影逐堂聽完之後寫的，涵蓋課程主張什麼、34 篇指定閱讀怎麼分組、兩次開課之間改了什麼，以及沒修課的人實際能拿到多少。**不包含**逐篇論文精讀——那是另一個量級的工作。

## 這門課的硬事實

授課者兩位。[Aakanksha Chowdhery](https://www.achowdhery.com/) 在 Google 主導過 540B 的 PaLM，後來推動 Gemini 的 MoE 預訓練，現在在 Reflection AI。[Azalia Mirhoseini](http://azaliamirhoseini.com/) 是 Stanford 助理教授、[Scaling Intelligence Lab](https://scalingintelligence.stanford.edu/) 主持人，MoE 與 AlphaChip 的共同作者，待過 Google Brain、Anthropic、Google DeepMind。

課開過兩次：Winter 2025 首開，Autumn 2025 第二次，選課 99 人。**下一次是 2026–2027 Winter**，已經掛在 Stanford 的 ExploreCourses 上。Stanford Online 那頁的資訊已經過期（還停在 2025 年秋季、且寫著冬季不開），別拿它當準。

先備條件寫得很硬：CS224N 或 CS229S 其中之一、Python 流利、要有實際呼叫 LLM API 的經驗。**不接受旁聽。**

## 全課只在追一個缺口

第二堂就把整門課的問題意識立起來了。[Large Language Monkeys](https://arxiv.org/abs/2407.21787)（arXiv:2407.21787）這條線發現，同一個模型對一題重複取樣，答對至少一次的比例會隨取樣數照冪次律上升。Mirhoseini 在課堂上的說法是：

> 「這些模型，連比較小的模型，其實都已經知道這些難題的答案了。重複取樣只是把答案引出來、讓它浮上來——它們只是不會在第一次嘗試就告訴你。」

問題在於你怎麼從一百個候選裡挑出對的那個。同一堂課接著給出這個缺口的正式名字：把「多數決」「reward model 排序」的實際成效，跟「假設有完美 verifier」的理論上限畫在同一張圖上，中間那段距離就是 **generation–verification gap**。

為什麼多數決補不上？因為最難的那些題目，在一千次甚至一萬次取樣裡可能只被答對過兩三次。**它們正確，但它們是少數。** 少數決不會贏。

於是後面的每一堂都在補這個缺口的後半段：verifier 是「怎麼認出對的」，reward model 是「怎麼把認出來的變成訓練訊號」，RL 是「把訊號餵回權重」。這個框架的實用價值在於它給了一把尺——**下次評估一個 agent 技術，先問它補的是生成端還是驗證端。** 補生成端的（更大的模型、更多取樣、更長的思考）會撞上驗證端的天花板；只有補驗證端的才會把天花板抬高。

## 但課程自己說了：模型變穩定，不是變聰明

第六堂講完 STaR、DeepSeekMath、DAPO 三篇 RL 論文之後，Chowdhery 做了一個結論。這是整門課最誠實、也最少被二手介紹提到的一段：

> 「這三種技術都會提升 majority@K，答案的格式會變好，模型在多步驟之間會更連貫。但這些都還不會提升它的**基礎能力**，不會教會它解新問題，也不會讓它大幅跨領域泛化。」

具體到 DeepSeekMath 那篇：取樣 32 次，majority@K 上升了，**pass@K 沒有**。她的原話是「模型變得更一致了，不是變得更根本地聰明」。

課程把「為什麼只有 majority@K 上升、pass@K 不動」列為這個領域的第一個開放問題。連課堂上示範的那些「模型會回溯、會自我修正」的行為，她也留了一個問號：這些是真的湧現出來的，還是本來就存在、只是統計上變得更常出現？

**如果你正在評估「自我改進」的產品宣稱，這是最該拿來對的一把尺。** 一致性提升是真的、可量測的、有商業價值的；但它跟「模型學會了它原本不會的事」是兩件事，而目前只有前者被證實。

## 自我改進只在一條窄帶裡發生

跨越三堂課，同一個限制以三種面貌出現，這是整門課最有實用價值的模式。

**在 STaR（第六堂）**：讓模型從自己答對的題目裡學。但如果整批題目都遠超模型能力，它什麼都答不對，就沒有東西可以學。反過來，如果題目太簡單，Chowdhery 指出在 GSM8K 上加 rationalization 幾乎沒有幫助——「把一個對模型來說太簡單的問題硬要它推理，本來就不會有用」。

**在 GRPO 與 DAPO（第六堂）**：GRPO 用一組答案的獎勵平均與標準差算優勢函數。所以如果一批答案全對或全錯，標準差是零，正規化直接失效。Chowdhery 講得很白：**「如果沒有獎勵的分布，模型就沒有東西可以學。」** DAPO 的解法就是超額取樣，然後把全對與全錯的整組丟掉，只留下有訊號的那些。

**在 Absolute Zero（第九堂）**：讓模型自己出題。出題者的獎勵設計是——如果解題成功率是零，獎勵是零；否則獎勵是「1 減去平均成功率」。換句話說，**系統被明確地獎勵去產生那些「有時候解得出、有時候解不出」的題目。**

三個層次、同一條原理：自我改進只在模型能力的邊緣發生。太簡單學不到東西，太難沒有訊號。這也解釋了為什麼這套方法在數學和程式碼上跑得動，在別的地方跑不動。

## 真正的門檻不是「可不可驗證」，是「驗證要多久」

第九堂的問答裡，Mirhoseini 給了一個比「可驗證領域 vs 不可驗證領域」精確得多的判準：

> 「在 RL 微調或 test-time scaling 裡，我們需要 verifier 幾乎是即時的。也許可以等幾分鐘，也許可以容忍一小時。但 RL 訓練需要幾百、幾千步的迭代，我們沒辦法等好幾天，也沒辦法等一個人類進來給我們獎勵訊號。」

依這把尺，被排除在外的不只是「主觀」的領域。科學發現、要跑好幾天模擬的晶片設計、需要真的進實驗室做的化學實驗——這些**在原理上完全可驗證**，只是驗證太慢，所以自我改進迴圈跑不動。

課堂給的繞道方式是訓練一個 reward model 去預測模擬結果，用它取代真的跑模擬。代價寫在臉上：這個 reward model 的泛化能力，取決於你有多少離線資料，而它不準的時候整個迴圈就被帶歪。

## 34 篇怎麼分組

十堂有指定閱讀的課，共 34 篇論文，順序本身就是論證：

| 堂次 | 主題 | 代表論文 |
|---|---|---|
| 2 | Test-Time Compute Scaling | Large Language Monkeys、[Archon](https://arxiv.org/abs/2409.15254) |
| 3 | Robust Verification | [Weaver](https://arxiv.org/abs/2506.18203)、[Let's Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| 4 | 從工具與程式碼的回饋學習 | [ReAct](https://arxiv.org/abs/2210.03629)、[RLEF](https://arxiv.org/abs/2410.02089)、[Constitutional AI](https://arxiv.org/abs/2212.08073) |
| 5 | 多步推理與規劃 | [SWiRL](https://arxiv.org/abs/2504.04736)、[LATS](https://arxiv.org/abs/2310.04406)、[SPRINT](https://arxiv.org/abs/2506.05745) |
| 6 | Train-Time Scaling / Scaling RL | [STaR](https://arxiv.org/abs/2203.14465)、[DeepSeekMath](https://arxiv.org/abs/2402.03300)、[DAPO](https://arxiv.org/abs/2503.14476) |
| 7 | 自我改進 agent 的開放式演化 | [ADAS](https://arxiv.org/pdf/2505.22954)、[The AI Scientist](https://arxiv.org/abs/2408.06292)、AlphaEvolve |
| 8 | 搜尋與深度研究 agent | [AlphaCode](https://arxiv.org/pdf/2203.07814)、[Search-o1](https://arxiv.org/pdf/2501.05366) |
| 13 | 軟體工程的 agent 框架 | [CodeMonkeys](https://arxiv.org/abs/2501.14723)、[KernelBench](https://arxiv.org/pdf/2502.10517) |
| 14 | 給 agent 記憶 | [Cartridges](https://arxiv.org/abs/2506.06266)、[MemGPT](https://arxiv.org/abs/2310.08560)、[CacheBlend](https://arxiv.org/abs/2405.16444) |
| 17 | Agentic 評估與長時程任務 | [METR](https://arxiv.org/abs/2503.14499)、[GDPval](https://arxiv.org/abs/2510.04374)、[DeepScholar-Bench](https://arxiv.org/abs/2508.20033) |

錄影裡有幾個結果比論文摘要更值得帶走。

**Archon 的 fusion 打敗了 oracle selection。** 把 K 個候選答案全部餵給模型、要它綜合出一個新答案，效果比「假設有完美 verifier 幫你從 K 個裡挑最好的那一個」還好。挑選的上限是候選裡最好的那個，綜合則不受這個上限限制。**如果你的 best-of-N 還停在挑一個，先試試改成讓模型讀完全部再重寫一次。**

**SWiRL 發現 process-filtered 資料勝過 outcome-filtered。** 只保留「推理步驟被判定為好」的軌跡——即使最終答案是錯的——比嚴格只留最終答案正確的軌跡更能提升模型。Mirhoseini 的解釋是：如果你只餵模型它本來就會做對的東西，你沒有在教它解新問題。有趣的是這條規則對監督式微調是反過來的，微調偏好 outcome-filtered，因為那是模仿學習。

**DeepScholar-Bench 目前沒有任何系統在全部指標上超過 19%。** 這個數字放在 2026 年很刺眼——「深度研究」產品滿地都是，但按知識綜合、檢索品質、引用可驗證性三軸打分，全部離及格線很遠。**如果你在做 research agent，這是今晚就能做的一件事**：挑「可驗證性」這一軸，抽十份你的系統最近產出的報告，逐句標記哪些主張真的被它引的來源支持。標不出來的比例就是你的起點。

## 第二次開課砍掉了什麼

兩版大綱擺在一起比，改動幅度是這門課最有訊息量的部分。

**課程形態變了。** 第一次開課是真的 seminar：小教室，學生輪流上台講論文，每週交討論題，兩項加起來占四分之一的成績。

第二次搬進可容納上百人的講堂，這兩項**全部取消**，作業從兩份加重到三份、占掉整整一半的成績。第一堂提到班級規模時，講法很含蓄：「因為這學期班很大，我們真的沒辦法給任何例外。」

**內容也換了一輪。** 被砍掉的包括 AutoGen 的 agent 編排專堂、整堂的 GUI 與 computer-use、SWE-bench 到 τ-bench 到 GAIA 的 benchmark 巡覽、Toolformer。換上來的是 DeepSeekMath 與 DAPO 撐起的 RL 專堂、Weaver、SPRINT、AlphaEvolve、Cartridges 與 CacheBlend 的記憶系統、以及整堂的長時程評估。

方向很清楚：**從「有哪些框架與 benchmark」移到「怎麼把訊號餵回權重，以及怎麼量測長任務」。** 框架那一側幾乎被清空了。如果你正在猶豫要投時間學哪一套 orchestration 框架，這門課用八個月的間隔給了一個答案。

## 作業與專案在做什麼

課程網站沒有公開作業內容，但三堂課的錄影裡都提到了，拼得起來：

- **作業一**：在 AIME 2024/2025 上評估多數決，再比較其他「合併模型輸出並評估錯誤」的方法。
- **作業二**：HumanEval，重複取樣與 pass@k。
- **作業三**：深度研究 agent，對應第八堂的 Search-o1 那條線。Chowdhery 在課堂上直接鼓勵學生去試 agentic RAG 的變體。

專案占分數的另一半。可接受的形狀在第一堂講得很具體：新的評估資料集或 benchmark、既有 agentic 系統的可靠度研究、對既有 benchmark 做 hill-climbing、或質疑某篇課堂論文的設計決定並改掉它。不接受的也很白：survey paper，以及「只是拼一個 app 給我們看」。

這條不是場面話。官網導覽列上有一個很容易錯過的 [Past Projects 頁](https://cs329a.stanford.edu/pastprojects.html)，公開了五篇 Winter 2025 的學生專案 PDF，剛好一種形狀一篇——而最有意思的那篇是負面結果：

> 「我們發現，只有在少數幾個案例——具體來說是兩個資料集——當部署量超過 15,000 個樣本時，設計與部署 agent 的總成本才會低於人類設計的 agent。其他資料集的效能提升不足以支撐設計成本，無論規模怎麼放大。」

同一篇還發現，把過去所有設計都塞進 context 讓 meta-agent 學習，**表現比完全忽略前作還差**。另一組學生則直接拿授課者自己實驗室的 Archon 開刀補元件。允許學生打自家論文，這件事本身就是課程立場的一部分。

## 課綱裡有 10 篇是授課者自己的

把 34 篇指定閱讀逐篇對照 Scaling Intelligence Lab 的論文列表，Mirhoseini 掛名的有 10 篇：Large Language Monkeys、Archon、Monkeys 的冪次律續作、Weaver、Constitutional AI、SWiRL、SPRINT、CodeMonkeys、KernelBench、Cartridges。

這件事怎麼看，取決於你要什麼。研究型 seminar 教自己的東西是常態，而且她的實驗室本來就是這個題目的主要產出者之一。錄影裡她講自家論文時反而更具體——會講清楚哪個假設是關鍵、哪一步是後來才發現很重要的。但你要清楚**你拿到的是一個特定研究議程的最佳版本，不是領域全景**：整份清單裡幾乎沒有 GUI agent、沒有 multi-agent 通訊協定、沒有生產環境的可觀測性。

這條線在課外還在延伸。2025 年底，Mirhoseini 與 Anna Goldie 共同創辦了 [Ricursive Intelligence](https://www.ricursive.com/)，主題正是「AI 設計晶片、晶片再訓練出更好的 AI」的遞迴自我改進；隔月的 A 輪估值 40 億美元。**這門課的世界觀不是學院內的思想實驗，是有人拿真金白銀在下注的路線圖。**

## 自學能拿到什麼、拿不到什麼

Stanford Online 在 2026 年 8 月上架了錄影，免費、不用註冊。但**只有 9 支**，而課表有 20 堂。每支約 70 到 75 分鐘，全部看完大約 11 小時。

錄影值得看，而且理由不是投影片——是問答。學生會當場追問，而講者會承認不知道。有人指出某張圖表的訓練曲線比推論曲線低得可疑，Chowdhery 的回答是：「有可疑的地方，好。這張圖是我複製過來的。所以圖表不見得都是對的，你們從他們最近那次發表應該也知道。」另一位學生質疑用小模型自我改進不如直接從大模型蒸餾，她也直接認了這是合理的實務選擇。**這種東西不會出現在論文摘要裡，也不會出現在 AI 生成的課程摘要站。**

拿不到：記憶那一堂、開放式演化那一堂、軟體工程 agent 那一堂，以及**全部五場客座**——Denny Zhou 講 LLM reasoning、Thang Luong 講 AlphaProof 與 Gemini 的 IMO 金牌、Misha Laskin 講自主 agent 系統、Danny Driess 講機器人。客座是這門課最難自己複製的部分，偏偏一場都沒公開。講義也沒有，全在 Canvas。

第一次開課的錄影另外散在別的頻道，內容完全不重複：Jeff Clune 講開放式 agent 學習、Michele Catasta（Replit 總裁）講 coding agent、Chi Wang 講 AutoGen。這些在第二次開課沒有對應堂次，等於獨家。

順帶一提，現有的二手介紹已經在傳錯了：有課程整理站寫「這門課沒有公開錄影」，有 AI 生成的摘要站把授課學期寫成 2026 年秋季——那是影片上架的時間，不是上課的時間。**要引用數字就回論文或回錄影，不要引用摘要站。**

## 整體來說

這門課換到的是一個有內在邏輯的座標系，加上一份被授課者篩過的閱讀清單；付出的是不中立、不完整、而且大半不公開。

但它最值得帶走的東西其實是一句限定詞。整個學期在教怎麼讓模型自我改進，最後一堂親口說：目前這些方法讓模型更一致、更連貫、格式更好，**但還沒有讓它變得更聰明**。這句話出自兩位親手訓練過前沿模型的人，比任何外部批評都有份量。

對自學者，最務實的用法是**把課綱當 reading map、把九支錄影當導讀**。真正稀缺的不是那 34 篇論文——它們都在 arXiv 上——而是「哪 34 篇、怎麼分組、以及講者在問答裡承認了什麼」。

如果只有一個下午，看第二堂（Test-Time Compute Scaling）和第六堂（Train-Time Scaling / Scaling RL）。一個立起缺口，一個說清楚補到哪為止。

## 附註：文中數字的對照條件

- **Weaver 的 87.7%**：生成端是 Llama 3.3 70B Instruct，verifier 是 70B 以下的 judge 與 reward model 組合，數值為多個推理與數學任務的平均。論文用來對照的是 GPT-4o 的 69.0% 與 o3-mini 的 86.7%。蒸餾成 400M cross-encoder 後保留 98.7% 準確度（課堂口述說「約 97%」，此處採論文數字）。
- **DeepScholar-Bench 的 19%**：指「沒有任何系統在全部指標上超過 19 分」，三軸為知識綜合、檢索品質、可驗證性。
- **DeepSeekMath 的 majority@K / pass@K**：課堂講的是取樣 32 次的設定，majority@K 上升而 pass@K 沒有。
- **DAPO 的消融**：在 Qwen-32B 上跑 AIME，GRPO 基準線約 30 分，逐項加上過長過濾、非對稱 clipping、過長軟懲罰、token 層級損失、動態取樣後到約 50 分。這是課堂口述的階梯，不是論文表格逐格轉錄。
- **METR 的時間軸**：論文 v4 的標題已改為 *Measuring AI Ability to Complete Long **Software** Tasks*，量的是「人類完成該任務所需時間」對應到「模型有 50% 成功率」的長度，任務集為 RE-Bench、HCAST 與 66 個新的短任務；論文摘要給的前沿模型數字是 o3 約 110 分鐘。課堂另外講了 80% 可靠度下的對照，該堂逐字稿我沒能取得，僅有官方影片說明。
- **GDPval**：涵蓋美國 GDP 前九大部門的 44 種職業，任務出自平均 14 年年資的產業專家，開源的 gold subset 為 220 題。官方影片說明給的勝率區間是 GPT-4o 的 12.4% 到 Claude Opus 4.1 的 47.6%。
- **Intelligence per Watt 的 5.3×**：指 2023 到 2025 年間每瓦智能的改善，課堂拆解為模型端 3.1 倍、硬體端 1.7 倍。另一個常被混用的 88.7% 是「查詢覆蓋率」，條件是「至少有一個 20B active 參數以下的本地模型能答對」，與 5.3× 是兩個獨立量測。

## 參考資料

- [Stanford CS329A: Self-Improving AI Agents 課程官網](https://cs329a.stanford.edu/)
- [CS329A Past Projects（Winter 2025 學生專案）](https://cs329a.stanford.edu/pastprojects.html)
- [CS329A Winter 2025 版課綱（Wayback Machine 存檔）](https://web.archive.org/web/20250221002318/https://cs329a.stanford.edu/)
- [CS329A 錄影播放清單（Stanford Online，9 支）](https://www.youtube.com/playlist?list=PLangBM27OtEA)
- [第二堂：Test-Time Compute Scaling](https://www.youtube.com/watch?v=-Ggc37xLj_Y)
- [第六堂：Train-Time Scaling / Scaling RL](https://www.youtube.com/watch?v=yVnmHSAy3ck)
- [第九堂：Future Research Areas](https://www.youtube.com/watch?v=AyO6wyu4DEg)
- [CS329A Winter 2025 錄影播放清單（含 Jeff Clune、Michele Catasta 客座）](https://www.youtube.com/playlist?list=PL3058ht9NqT1NG6Y663elpHSDh-AW1TIr)
- [Stanford Online：CS329A 課程頁（SCPD 非學位生入口）](https://online.stanford.edu/courses/cs329a-self-improving-ai-agents)
- [Weaver: Shrinking the Generation-Verification Gap with Weak Verifiers](https://arxiv.org/abs/2506.18203)
- [Large Language Monkeys: Scaling Inference Compute with Repeated Sampling](https://arxiv.org/abs/2407.21787)
- [DeepScholar-Bench: A Live Benchmark for Generative Research Synthesis](https://arxiv.org/abs/2508.20033)
- [Measuring AI Ability to Complete Long Software Tasks (METR)](https://arxiv.org/abs/2503.14499)
- [GDPval: Evaluating AI Model Performance on Real-World Economically Valuable Tasks](https://arxiv.org/abs/2510.04374)
- [Scaling Intelligence Lab 論文列表](https://scalingintelligence.stanford.edu/pubs/)
- [Ricursive Intelligence](https://www.ricursive.com/)
- 站內：[Stanford CS146S 兩版大綱對照](/posts/ai/2026-08-16-cs146s-course-map)
- 站內：[2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)
