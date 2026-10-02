---
title: "台大陳縕儂 ADL 2025 Fall 導讀：Reasoning——只有影片的一講，五步從 CoT 走到 RL"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, reasoning, chain-of-thought, test-time-scaling]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 15
tldr: "ADL Fall 2025 的 Reasoning 一講沒有公開投影片，只有播放清單上的五支影片：12.1 什麼是推理、12.2 Short CoT、12.3 Test-Time Scaling、12.4 Learning to Reason（模仿別人推理）、12.5 RL for Reasoning（探索自行演化出推理行為）。這篇只依影片標題排出這條路線，再搭配前一講 Language Agents 講義裡 CoT、ReAct 與「reasoning 擴大 action space」那幾頁；技術細節交給站內 CS224N、CME295 的 reasoning 篇。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 15 篇導讀：L12 Reasoning 只有影片 12.1–12.5、沒有投影片。依影片標題整理五個子題的順序，搭配 251110_LangAgent.pdf 第 8–20 頁的 CoT、ReAct 與 reasoning 擴大 action space，並寫明能確認與不能確認的範圍。"
draft: false
glossary:
  - term: "Chain-of-Thought"
    aliases: ["CoT", "思維鏈"]
    definition: "讓語言模型在給答案前先產生一段中間推理步驟的做法，最早以 prompt 範例示範的方式提出。"
    context: "ADL Language Agents 講義第 10 頁引 Wei et al., 2022，寫成「中間生成是在模仿人的思考過程」。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-reasoning-en)

**本文依據[台大陳縕儂《深度學習之應用》（ADL）Fall 2025（114-1，2025/09/01–12/15）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)播放清單上的 L12 影片。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列第 15 篇。上一篇 [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents) 把 reasoning 當成 agent 的三個關鍵概念之一；這一篇把它單獨拉出來問：**模型怎麼學會「先想再答」？**

先講清楚這篇的限制：**L12 沒有公開投影片。** 課程頁 12/01 那一列只寫「Reasoning」，沒有講義也沒有影片連結；五支影片只出現在 [2025 Fall 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)。本文沒有逐字聽寫影片，所以下面能寫的只有影片標題、長度與說明欄，加上前一講講義裡跟 reasoning 有關的頁面。

## 五支影片

| # | 影片 | 中文副標 | 長度 |
|---|---|---|---|
| 12.1 | [What is Reasoning?](https://youtu.be/paTmY2nZ8XI) | 機器也能推理嗎? | 10:21 |
| 12.2 | [Short CoT](https://youtu.be/VHNdIld9sAg) | 簡短推理再回答 | 12:06 |
| 12.3 | [Test-Time Scaling](https://youtu.be/wc0SKCyXbaA) | 考試時多思考更好 | 29:17 |
| 12.4 | [Learning to Reason](https://youtu.be/VBhFnYMPeO4) | 模仿別人推理 | 18:25 |
| 12.5 | [RL for Reasoning](https://youtu.be/WT2f7nBLGJA) | 探索自行演化出推理行為 | 12:14 |

五支影片的說明欄都寫「2025/11/17 Applied Deep Learning」，並註明「Slides credited from Hung-Yi Lee」，也就是投影片借自李宏毅老師。這裡有個對不上的地方：課程頁把 11/17 標成「Knowledge, Multimodality」、12/01 才是「Reasoning」，但影片說明欄寫的上課日是 11/17。公開資訊判斷不了哪一邊對，本文兩邊照錄。

## 依標題排出的路線

五個標題本身就是一條由淺入深的線。這一節只轉述標題與副標給的訊息，不補影片裡沒確認過的細節。

**1. 什麼是推理（12.1）。** 副標是一個提問：「機器也能推理嗎？」這支影片負責定義問題，後面四支才講方法。

**2. Short CoT（12.2）。** 副標「簡短推理再回答」點出兩個重點：先推理、再回答；而且推理是「簡短」的。這和 12.3 之後「多想一點」的方向形成對照。

**3. Test-Time Scaling（12.3）。** 副標「考試時多思考更好」。訓練完的模型不變，在推論時花更多計算。這支 29 分鐘，是五支裡最長的，比重最大。

**4. Learning to Reason（12.4）。** 副標「模仿別人推理」：讓模型去學既有的推理過程。這是從「推論時怎麼用」轉到「訓練時怎麼教」的轉折點。

**5. RL for Reasoning（12.5）。** 副標「探索自行演化出推理行為」：不再只模仿，改用強化學習讓模型自己探索出推理的方式。

所以整條線是：**定義 → 推論時讓它想（短的、再來長的）→ 訓練時教它想（先模仿、再自己探索）。**

**怎麼做**：看影片前先把這五個標題抄下來，每看完一支就在旁邊寫一句「這支回答了什麼問題」。五句連起來就是這一講的摘要，也能檢查自己有沒有漏掉 12.3 與 12.4 之間那個「推論→訓練」的轉折。

## 前一講講義裡的 reasoning

L12 沒有投影片，但 [Language Agents 講義（251110_LangAgent.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf)第 8–20 頁整段在講 reasoning，是這一講最接近的當期官方材料。這份講義第 1 頁註明參考 EMNLP 2024 的 Language Agents tutorial。

**Reasoning 是一種內部動作（第 5、9 頁）。** 講義把 language agent 畫成「感知環境 → 內心獨白（inner monologue）裡推理 → 對環境動作」。第 5 頁寫：產生 token 來推理可以看成一種內部動作；self-reflection 是對推理過程再推理的「meta」動作；推理是為了更好地行動。第 9 頁把動作空間分成三種：reasoning 更新短期記憶（context window）、retrieval／learning 讀寫長期記憶、planning 在推論時選出外部動作。

**CoT（第 10 頁）。** 引 [Wei et al., 2022](https://arxiv.org/abs/2201.11903)，一句話講法：中間生成是在模仿人的思考過程。

**推理幫行動、行動也幫推理（第 11–12 頁）。** 第 12 頁用一個中文例子示範：問「你知道台大的陳縕儂嗎？」，模型先搜尋，再根據搜尋結果回答。也就是說，查資料這個動作讓推理有東西可以依據。

**ReAct（第 13–17 頁）。** 引 [Yao et al., 2022](https://arxiv.org/abs/2210.03629)，講義的結論句是「Reasoning + Act are both essential」，以及「reasoning 為控制動作提供解釋」。

**Reasoning 擴大了動作空間（第 18–19 頁）。** 動作空間變大，能力上限變高，但決策也更難，因為語言與推理的空間是無限的。第 19 頁的最後一點和 12.4 的副標直接呼應：LLM 靠模仿各式各樣的人類推理軌跡，學到推理的先驗。

第 20 頁標題是「Action Planning for Improving Reasoning（Yao et al, 2023）」，頁面沒有更多文字，本文不替它指名是哪篇論文。

## 本文能確認與不能確認的

能確認：五支影片的標題、中文副標、長度、上傳日（2025-11-20）與說明欄文字（YouTube oEmbed 與 yt-dlp 核對）；Language Agents 講義第 5–20 頁的標題與列點；CoT、ReAct 兩篇論文的 arXiv 標題。

不能確認：影片內容本身。沒有投影片，本文也沒有逐字聽寫，所以 12.3 講了哪些 test-time scaling 方法、12.4 用什麼資料模仿、12.5 用哪種 RL 演算法或以哪個模型為例，這裡一律不寫。說明欄註明投影片借自李宏毅老師，但借了哪份、哪幾頁也無法從公開資訊確認。

## 延伸閱讀

想補上影片標題以外的技術細節，站內有兩個系列用有投影片的課講過同一段：

- [CS224N 第 12 講：解碼、DeepSeek-R1 與推理訓練](/posts/ai/2026-08-22-cs224n-reasoning-one)：R1-Zero／R1、PPO、GRPO、DAPO，對應 12.5 的 RL 路線。
- [CS224N 第 13 講：Speculative Decoding 與 Test-Time Scaling](/posts/ai/2026-08-22-cs224n-reasoning-two)：對應 12.3 的 test-time scaling。
- [CME295：LLM Reasoning](/posts/ai/2026-09-29-cme295-llm-reasoning)，以及講 RL 訓練的 [CME295：RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms)。
- 同校的 [李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：L12 五支影片的說明欄都註明投影片借自李宏毅老師，可以對照他自己的課。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents)｜下一篇 [對話系統與工具使用](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use)

## 參考資料

- [台大陳縕儂《深度學習之應用》Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 12/01 列只有「Reasoning」標題
- [2025 Fall 台大資訊 深度學習之應用 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- 影片：[12.1 What is Reasoning?](https://youtu.be/paTmY2nZ8XI)、[12.2 Short CoT](https://youtu.be/VHNdIld9sAg)、[12.3 Test-Time Scaling](https://youtu.be/wc0SKCyXbaA)、[12.4 Learning to Reason](https://youtu.be/VBhFnYMPeO4)、[12.5 RL for Reasoning](https://youtu.be/WT2f7nBLGJA)
- [251110_LangAgent.pdf（Language Agents，Fall 2025）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) — 第 5–20 頁
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models（arXiv 2201.11903）](https://arxiv.org/abs/2201.11903)
- [ReAct: Synergizing Reasoning and Acting in Language Models（arXiv 2210.03629）](https://arxiv.org/abs/2210.03629)
