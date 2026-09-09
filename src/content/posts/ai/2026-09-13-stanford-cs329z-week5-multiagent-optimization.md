---
title: "Stanford CS329Z 導讀 Week 5：該單幹還是開會——多智慧體與優化三軸"
date: 2026-09-13
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 6
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 21
tldr: "Week 5 週一用 AutoGen 把多智慧體協作寫成可程式的對話，週三用 GEPA 與 test-time compute 論文攤開優化三軸：改 prompt、改權重、加推理算力。HW1 在 10/30 截止，這是交卷前最後一個完整週，這篇幫你決定力氣花在哪一軸。"
description: "帶讀 Stanford CS329Z Week 5 兩堂課：AutoGen 的 conversable agent 與 conversation programming，GEPA 的反思式 prompt 演化與 test-time compute 的按難度分配，以及它們如何收斂成 HW1 收尾的三選一。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization-en)

一個模型解不開的題目，直覺解法是多找幾個模型來分工。一個寫程式、一個跑程式、一個負責挑錯，就像開一場會。這就是 multi-agent 在吵的事：什麼時候一個人做完就好，什麼時候值得開會。

但開過會的人都知道，會議本身有成本。誰先發言、結論誰寫、錯了算誰的，一樣都少不了。模型開會也一樣，而且錯得更安靜：上游 agent 的幻覺，會變成下游 agent 深信不疑的事實。週一（10/19，Multi-Agent Systems）的主讀物是 Wu 等人的 [AutoGen](https://arxiv.org/abs/2308.08155)（COLM 2024）：把開會規則寫成程式的框架。

週三（10/21，Optimization）換了一個問題：不管單幹還是開會，系統要變強只有三個地方能調。改 prompt（換說明書）、改權重（換腦袋）、加推理算力（想久一點）。主讀物是 Snell 等人的 [test-time compute 論文](https://arxiv.org/abs/2408.03314)（ICLR 2025）與 Agrawal 等人的 [GEPA](https://arxiv.org/abs/2507.19457)。時間點很現實：[HW1 在 10/30 截止](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，這是交卷前最後一個完整週。這篇幫你決定力氣花在哪一軸。

## 單體 vs 多體：AutoGen 把分工寫成對話

AutoGen 的核心抽象有兩個，[開源實作](https://github.com/microsoft/autogen)可以直接玩。第一是 conversable agent：每個 agent 都能收訊息、做事、回訊息，後端可以是 LLM、人、工具或混搭。內建最常用的兩個是 AssistantAgent（LLM 主力，負責想和寫）與 UserProxyAgent（人或工具的代理，負責跑 code、回傳結果、必要時找人）。

第二是 conversation programming：複雜流程不寫成管線，寫成 agent 之間的對話。計算（收到訊息後做什麼）與流程控制（訊息傳給誰、何時停）都繞著對話轉。機制是統一的 send/receive 加上 generate_reply，再配 auto-reply：收到訊息就自動回，除非觸發終止條件。

控制手段有兩種，程式和自然語言混用。自然語言控制寫在 system message 裡，例如叫 agent 修好錯誤再交、做完回 TERMINATE。程式控制寫在 Python 裡，例如最大回覆輪數與工具執行邏輯。兩種可以互轉：在 code 裡呼叫一次 LLM 就是切到自然語言，LLM 吐一個 function call 就是切回程式。

三個應用裡最好記的是 [ALFWorld](https://arxiv.org/abs/2010.03768) 那個：雙 agent 卡在重複錯誤迴圈時，多掛一個專門補常識的 grounding agent，成功率平均漲 15%。分工的價值不在人多，在有人專門負責大家都忽略的那件事。

**怎麼做**：先別拆。拿 HW1 的 agent 跑 20 題，把失敗分成兩堆：單一步驟錯、後面跟著全錯。只有當同一條分工邊界反覆出現（例如寫 code 和驗 code 老是互相污染），才把那條邊切成第二個 agent。切分要有失敗證據，不要為組織圖好看而切。

## 協調成本：開會真正的帳單

課程週一的標題直接點名：coordination and error propagation。多體架構的帳單有三張。第一張是狀態交接：agent 之間傳的不只是答案，還有做到哪、為什麼這樣做。傳丟了，下游就重蹈覆轍。

第二張是錯誤放大：沒人檢查的管線，每多一站就多一次把幻覺當事實的機會。AutoGen 把原本解供應鏈問答的 [OptiGuide](https://arxiv.org/abs/2307.03875)重寫成多智慧體：Commander 協調 Writer 與 Safeguard，寫 code 和驗 code 分家，正是為了讓檢查獨立於生產。自己驗自己寫的東西，人跟模型都做不好。

第三張是流程本身：誰決定下一個發言者。AutoGen 內建 GroupChatManager，用角色扮演式 prompt 動態選下一個講者，再廣播給全員，適合沒有固定順序的協作。代價是除錯時得先還原當時為什麼輪到他。人類介入也是成本設計：UserProxyAgent 的 human_input_mode 可以調成每輪都問，也可以讓人跳過。自動化與人類控制的平衡，論文討論章節明說是開放問題。

**怎麼做**：給你的 agent 會議立三條規矩：TERMINATE 終止條件、最大輪數、一個只檢查不做事的角色（抄 Safeguard）。拿 10 題難題跑一次，記下檢查者攔下幾次、誤攔幾次。這張攔截紀錄就是 Part B 反思題裡協調成本的現成素材。

## 優化三軸：prompt、權重、推理算力

週三課表的定位句是 when to optimize prompts vs. weights vs. inference compute。這週兩篇讀物各守一軸，同場其他 prompt 優化器課表另有列點，這裡只談主讀物。

GEPA 守 prompt 軸。它看著系統跑出來的軌跡（推理、工具呼叫、工具輸出）用自然語言反思，診斷哪裡壞、該改哪句 prompt。多次嘗試裡互補的經驗，再從 Pareto 前沿合起來。結論只記一句：對照組是強化學習調法 [GRPO](https://arxiv.org/abs/2402.03300)，GEPA 用的 rollout 少到 35 分之一。連當時最強的 prompt 優化器 [MIPROv2](https://arxiv.org/abs/2406.11695)也被它超車超過一成。[開源實作](https://github.com/gepa-ai/gepa)已經公開。補一條課程八卦：共同作者 Michael Ryan 是這門課的授課者，也是 MIPRO 的共同第一作者（與 Krista Opsahl-Ong 並列）。prompt 優化這條線，教的人就是寫的人。

Snell 那篇守推理算力軸。它把 test-time compute 拆成兩招：對 process verifier 做搜尋，以及讓模型迭代改自己的答案。關鍵發現是哪招有效完全看題目難度：簡單題適合慢慢修，難題適合廣撒網。而且難度分級看的是模型自己的答對率，不是題本標籤。順著這個發現做 compute-optimal 分配，也就是每題按難度選招式，同樣分數下算力只花 best-of-N 的四分之一。實驗跑在 [MATH](https://arxiv.org/abs/2103.03874) 上。

更進一步，它把省下的算力跟直接把模型放大對打：小模型加推理算力，打得贏 14 倍大的模型。但有一個前提，就是小模型本來就偶爾解得出來。最難的題目加推理算力幾乎沒用，這時不如把算力拿去 pre-train。這句話對 HW1 很重要：不對的題目要先分級，不是全都值得加算力。

權重軸這週沒有主讀物，LoRA、蒸餾、RLHF 方向只在課表列點。這本身就是訊號：HW1 的時間尺度下，權重軸通常不在選項裡。

**怎麼做**：把驗證集 20 題先分級：一次答對、試幾次會對、怎麼調都不對。第一級拿去改 prompt（GEPA 式：看軌跡、改一句、再跑）。第二級加推理算力（多採樣加 verifier 重排）。第三級停手，那是檢索或權重的問題，別再燒 prompt。三級各寫一行，就是 Part B 的優化紀錄。

## HW1 收尾：交卷前只做三件事

第一，鎖 Part A。[Week 4](/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory) 把 [ReAct](https://arxiv.org/abs/2210.03629) 迴圈形狀定下來之後就別再改，凍結一個能跑的版本當對照組。第二，Part B 縮小版跑完：只重寫其中一段，做法見 [Week 3](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)。第三，反思三行寫好：框架替你做了什麼決定、哪個決定你不同意、什麼情況下你會換回去。

**怎麼做**：排最後十天：兩天鎖 Part A，五天跑 Part B 對照，三天寫反思與收尾。每天只動一軸：今天改 prompt，明天加算力，後天才考慮拆 agent。混著調的失敗是沒法寫進反思題的。

## 它在課程裡的位置

Week 5 之後只剩一週：Week 6 是嘉賓演講加 Data for Agentic Systems，[HW2 在 10/26 釋出](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，HW1 在 10/30 交卷。多智慧體的錯誤傳遞會在 Week 8 的安全與護欄回來，注入攻擊與 sandbox 算的是同一筆帳。優化三軸則直接連著季度專案：demo 前每一輪迭代都是同一個三選一。Week 4 定迴圈形狀，Week 5 決定這個迴圈複製幾份、力氣花在哪。順序讀下來，HW1 就是這五週的總驗收。

## 本週 Course Material 對照

- 週一 10/19 Multi-Agent Systems：主讀物 AutoGen（本文已導讀）。[Cemri 等人收了 1600 多條多智慧體軌跡](https://arxiv.org/abs/2503.13657)，做成 MAST-Data。失敗模式按設計問題、智慧體對不齊、缺驗證分堆，給開會出事點名。呼應週一主題：協調失敗有結構，不是運氣。[Neubig](https://openhands.dev/blog/dont-sleep-on-single-agent-systems)拿 [OpenHands](https://github.com/OpenHands/OpenHands) 經驗幫單體說話：多體的痛在結構僵硬、交接漏上下文、維護貴。一個強模型配通用工具箱加長 prompt，多數分工都吃得下。[Liu 等人的 DyLAN](https://arxiv.org/abs/2310.02170)先選隊再動態組網：在特定 [MMLU](https://arxiv.org/abs/2009.03300) 子集上，選對隊伍最多拉高 25% 準確率。誰上場本身就是可優化的變數。
- 週三 10/21 Optimization：主讀物 Snell 等人 test-time compute、GEPA（本文已導讀）。[Soylu 等人把微調權重和優化 prompt 交替做](https://aclanthology.org/2024.emnlp-main.597/)，讓同一個模型自己教自己。在多跳問答和數學推理上，一起做贏過只做一邊。[Opsahl-Ong 等人的 MIPRO](https://arxiv.org/abs/2406.11695)把多階段程式每段的指令和示範一起優化，用小批量代理評估解跨模組歸因。最強的一組拉高 13 個百分點，優化器已收進 [DSPy](https://dspy.ai)。它的後續版本 MIPROv2，正是 GEPA 論文鎖定的最強基線。
- 課表原文：[CS329Z 官網 Week 5](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[Week 4：ReAct 與記憶](/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory)、[Week 3：工具與 DSPy](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Wu et al., AutoGen, COLM 2024](https://arxiv.org/abs/2308.08155)、[Snell et al., Scaling LLM Test-Time Compute Optimally, ICLR 2025](https://arxiv.org/abs/2408.03314)、[Agrawal et al., GEPA, arXiv 2025 (ICLR 2026 Oral)](https://arxiv.org/abs/2507.19457)
- 工具：[AutoGen](https://github.com/microsoft/autogen)、[GEPA](https://github.com/gepa-ai/gepa)
