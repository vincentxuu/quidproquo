---
title: "Stanford CS329A 導讀：一門課只在追一個缺口——模型答得出來，卻認不出哪個是對的"
date: 2026-08-20
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, reasoning, llm]
lang: zh-TW
tldr: "CS329A 教的不是 agent 框架，是 generation–verification gap：模型「能生成出正確答案」的機率遠高於「能認出哪個正確」。34 篇指定閱讀全掛在這條線上，其中 10 篇是授課者自己的論文。錄影公開了 9 支，但只涵蓋 20 堂中的 9 堂，5 場客座一場都沒有。"
description: "Stanford CS329A: Self-Improving AI Agents 完整導讀——課程主軸、34 篇閱讀清單的分組邏輯、兩次開課之間砍掉與換上的內容、五篇公開學生專案，以及自學者實際拿得到與拿不到的東西。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)

[CS329A: Self Improving AI Agents](https://cs329a.stanford.edu/) 是 Stanford 電腦科學系的三學分研究所 seminar，講的是「模型上線之後怎麼繼續變強」。它不教 LangGraph，不教 CrewAI，整學期沒有一堂在講框架怎麼拼。

它教的是一個缺口。

這篇把課程本身講清楚：它主張什麼、34 篇指定閱讀怎麼分組、兩次開課之間改掉了什麼、以及一個沒修課的人實際能拿到多少。**不包含**逐堂的論文精讀——那是另一個系列的量。

## 這門課的硬事實

授課者兩位。[Aakanksha Chowdhery](https://www.achowdhery.com/) 在 Google 主導過 540B 的 PaLM，後來推動 Gemini 的 MoE 預訓練，現在在 Reflection AI。[Azalia Mirhoseini](http://azaliamirhoseini.com/) 是 Stanford 助理教授、[Scaling Intelligence Lab](https://scalingintelligence.stanford.edu/) 主持人，MoE 與 AlphaChip 的共同作者，待過 Google Brain、Anthropic、Google DeepMind。

課已經開過兩次：Winter 2025 首開，Autumn 2025 第二次，選課人數 99 人。**下一次是 2026–2027 Winter**，已經掛在 Stanford 的 ExploreCourses 上。要注意 Stanford Online 那頁的資訊已經過期（還停在 2025 年秋季、且寫著冬季不開），別拿它當準。

先備條件寫得很硬：CS224N 或 CS229S 其中之一、Python 流利、而且要有實際呼叫 LLM API 的經驗。**不接受旁聽。**

## 全課只在追一個缺口

第二堂建立起整門課的問題意識。[Large Language Monkeys](https://arxiv.org/abs/2407.21787)（arXiv:2407.21787）這條線發現：同一個模型，你讓它對一題重複取樣，答對至少一次的比例會隨取樣數照冪次律上升。模型其實「知道」答案，只是一次抽不到。

問題在於，你怎麼從一百個候選裡挑出對的那個。

Mirhoseini 在第三堂開場就把這件事講白了：

> 「語言模型看起來知道很多難題的答案，特別是配上重複取樣或其他 test-time 技巧，它生成得出來。但問題是——我們怎麼自動選出哪一個是正確的，或是在生成過程中引導它？」

這就是 generation–verification gap。整門課接下來所有東西，都是在補這個缺口的後半段：verifier 是「怎麼認出對的」，reward model 是「怎麼把認出來的變成訓練訊號」，RL 是「把訊號餵回權重」，而長時程評估那一堂則在講——我們連「怎麼判斷任務有沒有完成」都還沒做好。

這個框架的好處是把一堆看似各自為政的技術收進同一個座標系。**下次評估一個 agent 技術時，先問它補的是生成端還是驗證端。** 補生成端的（更大的模型、更多取樣、更長的思考）會撞上驗證端的天花板；只有補驗證端的才會把天花板抬高。

第三堂的收尾是 [Weaver](https://arxiv.org/abs/2506.18203)（arXiv:2506.18203），出自 Mirhoseini 自己的實驗室：與其訓練一個強 verifier，不如把一堆弱 verifier（LLM judge、reward model）加權組合起來。用一個中量級的開源模型當生成端、配上一組同量級的 verifier，平均準確度可以拉到 o3-mini 的水準——而後者是靠大量後訓練換來的（各數值的對照條件見文末附註）。

課堂上還講了一個工程上更有用的後續：把整組 verifier 蒸餾成一個 400M 的 cross-encoder，準確度幾乎沒掉。講者當場補了一句：

> 「這些蒸餾版和原始版都開源了，checkpoint 也放出來了，如果你們有人想在自己的 agentic 或 test-time scaling 專案裡用。」

**這就是今晚可以動手的東西**：如果你手上有一條 best-of-N 的挑選邏輯還停在 majority voting，把 Weaver 的蒸餾 checkpoint 接上去當 reranker，跑一次 A/B——課堂上比較的基準線正是 majority voting，而它輸得很明顯。

## 34 篇怎麼分組

十堂有指定閱讀的課，共 34 篇論文，順序本身就是論證：

| 堂次 | 主題 | 代表論文 |
|---|---|---|
| 2 | Test-Time Compute Scaling | Large Language Monkeys、[Archon](https://arxiv.org/abs/2409.15254) |
| 3 | Robust Verification | Weaver、[Let's Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| 4 | 從工具與程式碼的回饋學習 | [ReAct](https://arxiv.org/abs/2210.03629)、[RLEF](https://arxiv.org/abs/2410.02089)、[Constitutional AI](https://arxiv.org/abs/2212.08073) |
| 5 | 多步推理與規劃 | [SWiRL](https://arxiv.org/abs/2504.04736)、[LATS](https://arxiv.org/abs/2310.04406)、[SPRINT](https://arxiv.org/abs/2506.05745) |
| 6 | Train-Time Scaling / Scaling RL | [STaR](https://arxiv.org/abs/2203.14465)、[DeepSeekMath](https://arxiv.org/abs/2402.03300)、[DAPO](https://arxiv.org/abs/2503.14476) |
| 7 | 自我改進 agent 的開放式演化 | [ADAS](https://arxiv.org/pdf/2505.22954)、[The AI Scientist](https://arxiv.org/abs/2408.06292)、AlphaEvolve |
| 8 | 搜尋與深度研究 agent | [AlphaCode](https://arxiv.org/pdf/2203.07814)、[Search-o1](https://arxiv.org/pdf/2501.05366) |
| 13 | 軟體工程的 agent 框架 | [CodeMonkeys](https://arxiv.org/abs/2501.14723)、[KernelBench](https://arxiv.org/pdf/2502.10517) |
| 14 | 給 agent 記憶 | [Cartridges](https://arxiv.org/abs/2506.06266)、[MemGPT](https://arxiv.org/abs/2310.08560)、[CacheBlend](https://arxiv.org/abs/2405.16444) |
| 17 | Agentic 評估與長時程任務 | [METR](https://arxiv.org/abs/2503.14499)、[GDPval](https://arxiv.org/abs/2510.04374)、[DeepScholar-Bench](https://arxiv.org/abs/2508.20033) |

最後一堂閱讀最值得單獨提。[DeepScholar-Bench](https://arxiv.org/abs/2508.20033)（arXiv:2508.20033）讓系統去寫一篇論文的 related work 段落，題目取自近期 arXiv 論文以避開資料污染。作者的結論是：目前**沒有任何系統在全部指標上超過 19%**。

這個數字放在 2026 年很刺眼——市面上「深度研究」產品滿地都是，但真要按知識綜合、檢索品質、引用可驗證性三軸打分，全部都在及格線下面很遠。

**如果你在做 research agent，這是今晚就能做的一件事**：從 DeepScholar-Bench 的三軸裡挑「可驗證性」，抽十份你的系統最近產出的報告，逐句標記哪些主張真的被它引的來源支持。標不出來的比例就是你的起點——而且多半會比你預期的難看。

## 第二次開課砍掉了什麼

兩版大綱擺在一起比，改動幅度是這門課最有訊息量的部分。

**課程形態變了。** 第一次開課是真的 seminar：小教室，學生要輪流上台講論文，每週還要交討論題，兩項加起來占四分之一的成績。

第二次搬進了可容納上百人的講堂，這兩項**全部取消**，作業則從兩份加重到三份、占掉整整一半的成績。第一堂課上提到班級規模時，講法很含蓄：「因為這學期班很大，我們真的沒辦法給任何例外。」

**內容也換了一輪。** 被砍掉的包括：AutoGen 的 agent 編排專堂、整堂的 GUI 與 computer-use、SWE-bench 到 τ-bench 到 GAIA 的 benchmark 巡覽、Toolformer。換上來的是：DeepSeekMath 與 DAPO 撐起的 RL 專堂、Weaver、SPRINT、AlphaEvolve、Cartridges 與 CacheBlend 的記憶系統、以及整堂的長時程評估。

方向很清楚：**從「有哪些框架與 benchmark」移到「怎麼把訊號餵回權重，以及怎麼量測長任務」。** 框架那一側幾乎被清空了。如果你正在猶豫要投時間學哪一套 orchestration 框架，這門課用八個月的間隔給了一個答案。

## 專案只收研究，不收作品

課程分數有一半在專案上。Mirhoseini 在第一堂把可接受的形狀講得很具體：新的評估資料集或 benchmark、既有 agentic 系統的可靠度研究、對既有 benchmark 做 hill-climbing、或是質疑某篇課堂論文的設計決定並改掉它。

不接受的也講得很白：survey paper，以及「只是拼一個 app 給我們看」。

這條不是場面話。官網導覽列上有一個很容易錯過的 [Past Projects 頁](https://cs329a.stanford.edu/pastprojects.html)，公開了五篇 Winter 2025 的學生專案 PDF，剛好一種形狀一篇——而最有意思的那篇是負面結果：

> 「我們發現，只有在少數幾個案例——具體來說是兩個資料集——當部署量超過 15,000 個樣本時，設計與部署 agent 的總成本才會低於人類設計的 agent。其他資料集的效能提升不足以支撐設計成本，無論規模怎麼放大。」

同一篇還發現，把過去所有設計都塞進 context 讓 meta-agent 學習，**表現比完全忽略前作還差**。另一組學生則直接拿授課者自己實驗室的 Archon 開刀補元件。允許學生打自家論文，這件事本身就是課程立場的一部分。

## 課綱裡有 10 篇是授課者自己的

把 34 篇指定閱讀逐篇對照 Scaling Intelligence Lab 的論文列表，Mirhoseini 掛名的有 10 篇：Large Language Monkeys、Archon、Monkeys 的冪次律續作、Weaver、Constitutional AI、SWiRL、SPRINT、CodeMonkeys、KernelBench、Cartridges。

這件事怎麼看，取決於你要什麼。研究型 seminar 教自己的東西是常態，而且她的實驗室本來就是這個題目的主要產出者之一。但你要清楚**你拿到的是一個特定研究議程的最佳版本，不是領域全景**——比方說整份清單裡幾乎沒有 GUI agent、沒有 multi-agent 通訊協定、沒有生產環境的可觀測性。

這條線在課外還在延伸。2025 年底，Mirhoseini 與 Anna Goldie 共同創辦了 [Ricursive Intelligence](https://www.ricursive.com/)，主題正是「AI 設計晶片、晶片再訓練出更好的 AI」的遞迴自我改進；隔月的 A 輪估值 40 億美元。**這門課的世界觀不是學院內的思想實驗，是有人拿真金白銀在下注的路線圖。**

## 自學能拿到什麼、拿不到什麼

Stanford Online 在 2026 年 8 月上架了錄影，免費、不用註冊。但**只有 9 支**，而課表有 20 堂。

拿得到：課程總覽、test-time scaling、robust verification、工具回饋、多步推理、RL、深度研究 agent、長時程評估、未來方向。每支約 70 到 75 分鐘，全部看完大約 11 小時。

拿不到：記憶那一堂、開放式演化那一堂、軟體工程 agent 那一堂，以及**全部五場客座**——Denny Zhou 講 LLM reasoning、Thang Luong 講 AlphaProof 與 Gemini 的 IMO 金牌、Misha Laskin 講自主 agent 系統、Danny Driess 講機器人。客座是這門課最難自己複製的部分，偏偏一場都沒公開。講義也沒有，全在 Canvas。

第一次開課的錄影另外散在別的頻道，內容完全不重複：Jeff Clune 講開放式 agent 學習、Michele Catasta（Replit 總裁）講 coding agent、Chi Wang 講 AutoGen。這些在第二次開課沒有對應堂次，等於獨家。

順帶一提，現有的二手介紹已經在傳錯了：有課程整理站寫「這門課沒有公開錄影」，有 AI 生成的摘要站把授課學期寫成 2026 年秋季——那是影片上架的時間，不是上課的時間。**要引用數字就回論文，不要引用摘要站。**

## 整體來說

這門課換到的是一個有內在邏輯的座標系，加上一份被授課者篩過的閱讀清單；付出的是不中立、不完整、而且大半不公開。

對自學者，最務實的用法是**把課綱當 reading map、把 9 支錄影當導讀**，不要期待它是一門完整的線上課。真正稀缺的東西不是那 34 篇論文——它們都在 arXiv 上——而是「哪 34 篇、怎麼分組、以及第一次開課放進去、第二次就被拿掉的那些」。

如果只有一個下午，看第三堂（Robust Verification）和第八堂（Agentic Evaluations）。一個講怎麼認出對的答案，一個講我們連「對」都還量不準。這門課的頭和尾。

## 附註：文中數字的對照條件

- **Weaver 的 87.7%**：生成端是 Llama 3.3 70B Instruct，verifier 是 70B 以下的 judge 與 reward model 組合，數值為多個推理與數學任務的平均。論文用來對照的是 GPT-4o 的 69.0% 與 o3-mini 的 86.7%。
- **蒸餾模型的 98.7%**：指保留 Weaver 完整組合的準確度比例，模型從 70B 級降到 400M。課堂口述時說的是「約 97%」，此處採論文數字。
- **DeepScholar-Bench 的 19%**：指「沒有任何系統在全部指標上超過 19 分」，三軸為知識綜合、檢索品質、可驗證性。
- **METR 的時間軸**：論文 v4 的標題已改為 *Measuring AI Ability to Complete Long **Software** Tasks*，量的是「人類完成該任務所需時間」對應到「模型有 50% 成功率」的長度，任務集為 RE-Bench、HCAST 與 66 個新的短任務。作者自己在摘要裡加了外部效度的但書。課網仍沿用舊標題。
- **GDPval**：涵蓋美國 GDP 前九大部門的 44 種職業，任務出自平均 14 年年資的產業專家，開源的 gold subset 為 220 題。

## 參考資料

- [Stanford CS329A: Self-Improving AI Agents 課程官網](https://cs329a.stanford.edu/)
- [CS329A Past Projects（Winter 2025 學生專案）](https://cs329a.stanford.edu/pastprojects.html)
- [CS329A Winter 2025 版課綱（Wayback Machine 存檔）](https://web.archive.org/web/20250221002318/https://cs329a.stanford.edu/)
- [CS329A 錄影播放清單（Stanford Online，9 支）](https://www.youtube.com/playlist?list=PLangBM27OtEA)
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
