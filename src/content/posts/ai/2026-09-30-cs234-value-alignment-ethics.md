---
title: "CS234 導讀 17：價值對齊——對齊誰、對齊什麼"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, ai-alignment, ai-ethics]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 17
tldr: "整門 CS234 都假設 reward 是給定的。Winter 2026 的倫理與社會客座（Wanheng Hu，教材原本由 Dan Webber 發展）分兩次問：你真正想要的是什麼？第一次把「對齊」拆成三個目標：使用者的意圖、顯示偏好、客觀最佳利益，並用 RLHF 造成的 sycophancy 與個人 AI agent 當案例。第二次加入第四個目標：對使用者以外的人來說什麼是對的，再比較 top-down（寫下原則）、bottom-up（從範例學）與 participatory AI 三條路。結論沒有銀彈，但對齊有好壞之分。"
description: "Stanford CS234 Reinforcement Learning（Winter 2026）價值對齊客座導讀：第 10 講後半的 Value Alignment（意圖、顯示偏好、最佳利益、自主與家長主義、sycophancy、agentic AI）與 ethics_society_234_2.pdf（道德對齊、top-down vs bottom-up、participatory AI），並連回作業一 Q2、作業二 Q4、作業三 Q5 的倫理題。並對照 2024 影片 15 的 value alignment 段落。"
draft: false
glossary:
  - term: "value alignment"
    aliases: ["價值對齊"]
    definition: "設計出「會做我們真正想要的事」的 AI 代理人的問題。CS234 客座把「真正想要」拆成四種解讀：使用者的意圖、使用者的偏好、使用者的客觀最佳利益，以及道德上對所有人而言正確的事。"
    context: "CS234 Winter 2026 倫理與社會客座（第 10 講後半與 Part II）。"
  - term: "revealed preferences"
    aliases: ["顯示偏好"]
    definition: "從一個人的實際行為或回饋推斷出來的偏好，相對於他口頭說出或填寫的 stated preferences（陳述偏好）。"
    context: "客座的第二種對齊解讀；作業三 Q5 用新聞推薦 app 讓你區分兩者。"
  - term: "sycophancy"
    aliases: ["諂媚", "迎合"]
    definition: "AI 系統附和使用者、肯定使用者的信念，即使那些信念是錯的、有害的或不理性的。"
    context: "客座的第一個案例：在用 RLHF 訓練的 LLM 身上觀察到，因為人類評分者傾向獎勵感覺有幫助、有禮貌、順從的回答。"
  - term: "participatory AI"
    aliases: ["參與式 AI"]
    definition: "把「向人學習」擴大到多方利害關係人（包括受影響但不使用系統的人），並把價值當成情境相依、可以爭論、會隨時間修正的東西，持續收集意見而不是只訓練一次。"
    context: "CS234 倫理客座 Part II 的 bottom-up 延伸。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-value-alignment-ethics-en)

**本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 投影片與作業；錄影是 Spring 2024 公開版。** 這是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列第 17 篇。

**系列位置**：上一篇 [規劃＋學習：MCTS、UCT、AlphaGo／AlphaZero](/posts/ai/2026-09-30-cs234-mcts-alphazero)｜下一篇 [客座：Shane Gu〈World of World Modeling〉](/posts/ai/2026-09-30-cs234-guest-world-models)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

用到的官方材料：

- [第 10 講投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf)第 17–41 頁。前 16 頁是 UCB（已在[第 13 篇](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)講過），第 17 頁寫著「Guest lecture: Wanheng Hu」，之後 24 頁是客座〈Value Alignment〉
- [ethics_society_234_2.pdf](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf)（21 頁）〈Value Alignment Part II〉
- [講義頁](https://web.stanford.edu/class/cs234/modules.html)把這兩份歸在「Ethics and Society Guest Lecture」單元；[第 14 講投影片](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf)的 Class Structure 頁寫著那一次上課是「MCTS and Ethics and Society Guest Lecture Part 2」

講者 Wanheng Hu 是 Stanford EIS 與 HAI 的博士後，投影片的致謝寫明：內容以 Dan Webber 原本發展的教材為基礎，Andy Ouyang 提供了意見。

存取等級是 **A3（足以自學）**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)），但這一篇的缺口比其他篇大，要先講清楚：

- 2026 客座沒有公開錄影（2026 錄影只在 Canvas）
- 課表 Week 10 標著「Alignment, Impacts」，但講義頁上 L15、L16 的 PDF 在 2026-09-30 查核時都是 404，所以本文只能依據上面兩份客座投影片
- 投影片有好幾頁是圖片或討論題，沒有講者的答案；本文照實寫出題目，不替講者補結論
- 2024 公開播放清單裡真正對應的是[影片 15〈Emma Brunskill & Dan Webber〉](https://www.youtube.com/watch?v=FOlPpjNbHjE)：依 YouTube 章節，前 15 分鐘是 AlphaZero 收尾，[15:24 起](https://www.youtube.com/watch?v=FOlPpjNbHjE&t=924s)是 Dan Webber 的 value alignment，章節依序是 misalignment、定義 AI 目標、對齊偏好（28:28）、對齊最佳利益（36:13）、LLM 個人化研究（40:57）、社會與道德對齊（58:34），跟 2026 投影片的主軸大致相同；sycophancy 與 agentic AI 有沒有講到，章節看不出來。標題叫〈Value Alignment〉的[影片 16](https://www.youtube.com/watch?v=eenJzay5aLo)章節實際是小考檢討、課程回顧與 RL 應用案例，不是本篇的內容

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=FOlPpjNbHjE
title: Stanford CS234 Spring 2024 影片 15〈Emma Brunskill & Dan Webber〉
```

```youtube
url: https://www.youtube.com/watch?v=eenJzay5aLo
title: 影片 16〈Value Alignment〉
```

原始影片：[Stanford CS234 Spring 2024 影片 15〈Emma Brunskill & Dan Webber〉](https://www.youtube.com/watch?v=FOlPpjNbHjE)、[影片 16〈Value Alignment〉](https://www.youtube.com/watch?v=eenJzay5aLo)

課程與錄影入口：

- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 為什麼 RL 課要談這個

CS234 從[第 1 篇](/posts/ai/2026-09-30-cs234-intro-sequential-decisions)開始就把 reward 當成給定的：MDP 是 $(S, A, P, R, \gamma)$，演算法的工作是最大化期望回報。這一講問的是寫下 $R$ 之前的事：你寫下的東西，是你真正想要的嗎？

這個問題其實整門課都在偷偷出現。[作業一 Q2](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) 的 AI 車用「平均車速」當 proxy，結果學會停在匝道口不併入；[作業三 Q5](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits) 要你區分新聞 app 的陳述偏好與顯示偏好。客座把這些零散的題目收成一個框架。

## 第一次：「真正想要」有三種讀法

### 從迴紋針開始

客座用 Bostrom（2014）的迴紋針 AI 開場：一個管理工廠生產的 AI，最終目標是最大化迴紋針產量，於是先把地球、再把可觀測宇宙裡越來越大的部分都變成迴紋針。投影片補一句：就算是能力弱得多的 AI，也可能用出乎意料的方式追求這種目標。

接著三頁是真實案例的圖片，標題分別是「From boats to roads」（一個賽船遊戲的畫面，以及一張乘客被困在一直繞圈的無人車裡的截圖）與「From entertainment to treatment」（短影音 app 的「為什麼你會看到這支影片」說明，以及一張醫療情境的插圖）。投影片沒有文字說明，這裡只描述畫面。

問題的核心寫在第 7 頁：我們真正想要的，往往比我們說出口的細緻得多。人帶著許多背景假設在工作，這些假設 (1) 很難形式化，(2) 很容易被視為理所當然。所以光靠給更好的指令很難解決，就像手動設計 reward function 一樣難；如果 AI 是聽非專家使用者的指令，情況更糟。

### 三種解讀

| 解讀 | 對齊的目標 | 迴紋針 AI 為什麼算沒對齊 | 困難 |
|---|---|---|---|
| 意圖 | 使用者真正的意圖 | 沒有從「最大化產量」推出「在某些限制下最大化產量」 | 意圖不一定反映真正想要的（資訊不完整、理性有限） |
| 顯示偏好 | 使用者實際偏好什麼 | 我偏好它不要毀滅世界 | 有限的行為與回饋，對應無限多個偏好函數；緊急情況這種意外場景很難推 |
| 最佳利益 | 客觀上對使用者好的事 | 世界被毀滅在客觀上對我不好 | 什麼是客觀的好，是哲學問題，不是科學問題，無法用經驗決定 |

每一種解讀都在修補前一種的漏洞，然後帶出新的漏洞。

**意圖。** 要做到這點，AI 必須把指定不足的指令翻譯成完整的意圖，包括沒說出口的限制與條件。投影片引用 [Gabriel（2020）](https://arxiv.org/abs/2001.09768)：要真正掌握指令背後的意圖，AI 可能需要一個完整的人類語言與互動模型，包括讓人理解言外之意的文化、制度與慣例。但意圖可能跟真正想要的不一致：我要 AI 最大化迴紋針產量，是因為我想最大化投資報酬；如果 AI 知道改產別的東西報酬更高，照我的意圖做，算是給了我想要的嗎？

**顯示偏好。** 解法是讓 AI 從使用者的行為或回饋推斷偏好。這在技術上直接連到本系列前面的內容：[從示範學的 IRL](/posts/ai/2026-09-30-cs234-imitation-learning-irl) 與[從偏好學的 RLHF](/posts/ai/2026-09-30-cs234-rlhf-dpo)，都是在做這件事。投影片列出的技術困難之一：有限的行為或回饋，跟無限多個偏好或 reward 函數相容，這正是 IRL 的老問題。哲學上的問題則是：就像意圖可能偏離偏好，偏好也可能偏離對我真正好的事。

**最佳利益。** 壞消息是哲學家對「什麼對一個人客觀上好」沒有共識：是快樂？是欲望被滿足？還是健康、安全、知識、關係這些東西，即使你不喜歡也對你好？好消息是有很多共識：健康、安全、自由、知識、社會關係、目的、尊嚴、快樂，幾乎人人同意這些通常是好的。

其中一個被廣泛認為重要的是**自主**：自己選擇怎麼過生活的能力，即使你不總是做最好的選擇。我們想避免**家長主義**（替別人選你認為最好的，而不讓她自己選）。所以就算對齊到最佳利益，使用者對自主的利益，仍給了我們理由去考慮他們的意圖或偏好，即使那跟他們的其他利益衝突。

### 案例一：sycophancy

AI 系統附和使用者、肯定他們的信念，即使那些信念是錯的、有害的或不理性的。投影片指出，這在用 RLHF 訓練的 LLM 身上觀察得到：人類評分者會獎勵感覺有幫助、有禮貌、順從的回答，於是模型最佳化的是讓使用者高興，而不一定是真相或福祉。

這接得上[第 11 篇](/posts/ai/2026-09-30-cs234-rlhf-dpo)的 Bradley-Terry 模型：reward model 學的就是評分者的比較，評分者偏好什麼，模型就往哪裡走。

投影片留了兩個討論題：

1. sycophancy 最能說明哪一種對齊解讀的問題？意圖、顯示偏好，還是最佳利益？
2. 如果你負責設計 RLHF 流程，你會怎麼減少或防止 sycophancy？

### 案例二：個人 AI agent

想像你在做一個個人 AI agent，能訂機票、購物、跟其他 agent 談判、管理行事曆與通訊、呼叫線上服務與 API。

- 對齊**顯示偏好**：學你的習慣，為了速度與方便自動行動，有時不問你
- 對齊**最佳利益**：為了你的長期福祉加一點摩擦，必要時詢問、拒絕或提供更多資訊

討論題：什麼時候 agent 該不問就做？什麼時候該聽使用者的？什麼時候該推翻或抵抗使用者？

第一次客座在一頁大字收尾：我們的討論漏了什麼（或誰）？答案是：**使用者以外的人**。

## 第二次：把其他人放進來

### 第四種解讀：道德上對的事

Part II 從上次的問題接著講。第四種解讀是：AI 代理人如果做的是道德上正確的事，就算對齊了。迴紋針 AI 沒對齊，是因為世界被毀滅對**每個人**都不好。這個解讀強調的是「我們真正想要的」裡那個「我們」：使用者想要的、偏好的、甚至對她有利的，都可能對別人不好。

但前面三種解讀並沒有白講：我們想對齊道德，也想在使用者的願望道德上可以接受時對齊使用者。所以怎麼理解使用者真正想要什麼仍然重要，只是要放進更大的倫理脈絡。

案例換成搶演唱會門票：你的 agent 監看市場、談判、自動購買，找最好的價格；很多人也用同樣目標的 agent。投影片問：當每個人都有一個替自己最佳化的 agent，會發生什麼？列出的後果包括 agent 之間的競爭加速、價格飆升、使用者之間的優勢不平等。每個 agent 個別來看都對齊了，加總起來卻出問題。

### 兩條路：top-down 與 bottom-up

| | top-down | bottom-up |
|---|---|---|
| 做法 | 明確寫下要對齊的道德原則，透過 reward function、後處理等方式確保 | 不寫原則，從範例學道德，例如 inverse RL、imitation learning、RLHF |
| 哲學問題 | 哪些原則才對？道德理論還沒有答案 | 道德分歧：用誰的範例？ |
| 技術／實務問題 | 原則會衝突、有例外；寫錯的原則會導致道德版的 reward hacking | 罕見或沒預見的情況；少數價值可能被多數行為淹沒 |
| 門票 agent 的例子 | 硬限制（不操弄、不誤導其他 agent）、全域目標（壓低價格膨脹、促進公平） | 從使用者對購票的回饋學、用歷史票務市場資料訓練、依觀察到的 agent 互動調整 |

**top-down** 的例子有兩種。功利主義：最大化所有人的總淨快樂，但快樂的分配呢？權利呢？常識多元論：「不說謊」「不偷」「不傷人」「守承諾」，但原則衝突時怎麼辦？高度細緻的例外呢？投影片留了一個題目：一個功利主義 AI 可能用什麼出乎意料的方式最大化所有人的總淨快樂？這就是道德版的 reward hacking。它的限制整理成：很難寫出涵蓋所有情況、處理邊界與例外的規則集，道德規則常互相衝突，有過度簡化的風險，也很難抓住個人的細微差異。

投影片接著放了 [Jobin et al.（2019）](https://www.nature.com/articles/s42256-019-0088-2)對 84 份 AI 倫理準則的整理：出現最多的原則是 transparency（73/84）與 justice and fairness（68/84），接著是 non-maleficence 與 responsibility（各 60/84）、privacy（47/84）。準則的發布者集中在美國、歐盟、英國與日本。

**bottom-up** 的道德分歧例子是：ChatGPT 該不該產生先知穆罕默德的圖像？該不該提供躲避執法的建議？看你問誰。有些案例之所以有分歧，是因為它們本來就難。技術上的例子是：用真實人類駕駛資料訓練的自駕車，可能從沒看過致命的煞車失靈該怎麼反應，AI 如果外推錯了，就是道德「理解」的缺口。它的限制是：回饋常分布不均，多數群體比較容易被代表，少數或邊緣群體可能代表不足，學到的價值可能反映既有的社會偏見。

### participatory AI

bottom-up 的延伸是 participatory AI，把「向人學習」擴大成：

- 多方利害關係人
- 受影響但不使用系統的人
- 持續的意見，而不是一次性的訓練

價值被視為情境相依、可以爭論、會隨時間修正。實務上的例子有 AI 系統的社群顧問委員會、持續的使用者回饋管道、部署前的公眾諮詢。關鍵的倫理考量是：承認價值可能衝突，並且願意隨時間修正系統。

### 結論：沒有銀彈

最後一頁的 takeaway：

- 沒有能保證完美道德行為的銀彈
- 但對齊有好壞之分。要做得更好：先從幾乎人人同意的簡單事情開始（AI 不該殺人，通常不該說謊），再盡力抓住複雜的部分
- top-down：認真想原則、衝突與例外
- bottom-up：發揮創意，盡可能用你想得到的罕見與邊界案例訓練

## 連回三份作業

客座的框架剛好可以回頭重讀三份作業裡的倫理題：

| 作業 | 題目 | 對應客座的哪一段 |
|---|---|---|
| [A1 Q2](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) | 自駕車用平均車速當 proxy，AI 車學會不併入 | 迴紋針 AI、top-down 的 reward hacking |
| [A2 Q4](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo) | 用 RL 聊天機器人取代部分 office hours，依 Belmont Report 的 respect for persons、beneficence、justice 設計實驗 | 使用者以外的人、自主與家長主義 |
| [A3 Q5](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits) | 新聞 app 的 stated vs revealed preferences、公司會選什麼 reward、怎麼用探索測試偏好是否改變 | 三種解讀中的顯示偏好 vs 最佳利益 |

## 自學怎麼做

1. 先讀第 10 講第 17–41 頁，把三種解讀的表格自己重畫一次，每一格填一個你自己的例子。
2. 對 sycophancy 那兩個討論題寫下答案，再回去看[第 11 篇](/posts/ai/2026-09-30-cs234-rlhf-dpo)的 RLHF pipeline，標出你的解法會改動哪一步。
3. 讀 Part II，拿門票 agent 案例分別寫一個 top-down 與一個 bottom-up 的設計，各列出一個會出錯的情境。
4. 最後重做三份作業的倫理題。這些題目沒有標準答案，重點是你能說出自己在對齊哪一種「真正想要」。

今晚可以做的一件事：打開你常用的一個推薦系統或 AI 助理，寫下它可能在最佳化的 reward，再問它對齊的是你的意圖、顯示偏好、最佳利益，還是別人的利益。

## 延伸閱讀

- 以對齊為主軸的整門課：[Harvard CS2881R 導讀：第一門 AI 安全研究所課](/posts/ai/2026-09-30-cs2881r-course-overview)
- 另一門入門課怎麼講 AI 對齊：[CMU 07-280 第 13 講：AI 對齊](/posts/ai/2026-08-22-cmu-07280-lecture-13-ai-alignment)
- RLHF 在 LLM 後訓練裡的位置：[CS224N 第 8 講：從 instruction tuning、RLHF 到 DPO](/posts/ai/2026-08-22-cs224n-post-training)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS234 第 10 講投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) — 第 17–41 頁：Wanheng Hu 的〈Value Alignment〉客座
- [CS234 ethics_society_234_2.pdf](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf) — 〈Value Alignment Part II〉：道德對齊、top-down vs bottom-up、participatory AI
- [CS234 第 14 講投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf) — Class Structure 頁：Ethics and Society Guest Lecture Part 2 的上課時段
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — Ethics and Society Guest Lecture 單元
- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表 Week 10「Alignment, Impacts」
- [CS234 作業頁](https://web.stanford.edu/class/cs234/assignments.html) — A1 Q2、A2 Q4、A3 Q5 的題目 PDF
- [Stanford CS234 Spring 2024 影片 15〈Emma Brunskill & Dan Webber〉](https://www.youtube.com/watch?v=FOlPpjNbHjE)與[影片 16〈Value Alignment〉](https://www.youtube.com/watch?v=eenJzay5aLo) — 公開錄影；value alignment 在影片 15 的 15:24 起，影片 16 依章節是課程回顧
- [Gabriel, Artificial Intelligence, Values and Alignment (2020)](https://arxiv.org/abs/2001.09768) — 客座引用的「掌握意圖需要完整的人類語言與互動模型」
- [Jobin, Ienca & Vayena, The global landscape of AI ethics guidelines (Nature Machine Intelligence 2019)](https://www.nature.com/articles/s42256-019-0088-2) — 客座 Part II 引用的 84 份準則整理
