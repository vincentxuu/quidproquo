---
title: "台大李宏毅 ML 2026 導讀：AI Agent 之間的互動與對工作的衝擊——協作拓撲、狼人殺、Moltbook，以及 AI 寫論文與審論文"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, multi-agent, ai-research]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 4
tldr: "agent_era.pdf 的後半問了三個問題：多個 agent 怎麼協作比較有效（MacNet：不規則的拓撲勝過規則的）、agent 能不能爾虞我詐（狼人殺、劇本殺，以及從社交互動學推理的 MARO）、agent 能不能社交（Moltbook 與「甲殼教」，但三篇研究都發現熱鬧背後多半是人在推、對話很淺）。最後以學術研究為例，AI 已經能從頭複製並延伸一篇論文、進入 AAAI 2026 的審查流程，Agents4Science 2025 收到 247 篇 AI 主筆論文。李宏毅的結論是：在 agent 萌芽的時代，「想做」什麼比「會做」什麼更重要。"
description: "台大李宏毅《機器學習 2026 Spring》AI Agent 單元第二、三段導讀，依 agent_era.pdf 第 34–61 頁：MacNet 協作拓撲、AI 狼人殺與 MIRAGE 劇本殺、MARO、Moltbook 與三篇 Moltbook 研究、AI 角色從工具到代理、Andrew Hall 的 Claude Code 論文複製、autoresearch、研究點子的 ideation-execution gap、AAAI 2026 AI 審查、Agents4Science 2025。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)3/13 那一週的教材後半。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 4 篇。[上一篇](/posts/ai/2026-09-30-ntu-ml2026-context-engineering)講一個 agent 怎麼管自己的 context；這一篇把鏡頭拉遠，看**很多個 agent 放在一起會發生什麼，以及它們怎麼改變人的工作**。

用到的官方材料：講義 [agent_era.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf) 第 34–61 頁，以及兩支影片：[AI Agent (2/3)：AI Agent 之間可以有什麼樣的互動](https://youtu.be/mmPmNezjCi0)、[AI Agent (3/3)：AI Agent 對於工作帶來的衝擊 - 以學術研究為例](https://youtu.be/VqB8zMujdjM)。存取等級 **A3**，本講沒有對應的作業或測驗。

這一講多半是「看案例」而不是「學方法」，所以下面照投影片順序走，每段只挑一個重點。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=mmPmNezjCi0
title: 影片：AI Agent (2/3)：AI Agent 之間可以有什麼樣的互動
```

```youtube
url: https://www.youtube.com/watch?v=VqB8zMujdjM
title: 影片：AI Agent (3/3)：AI Agent 對於工作帶來的衝擊 - 以學術研究為例
```

原始影片：[影片：AI Agent (2/3)：AI Agent 之間可以有什麼樣的互動](https://www.youtube.com/watch?v=mmPmNezjCi0)、[影片：AI Agent (3/3)：AI Agent 對於工作帶來的衝擊 - 以學術研究為例](https://www.youtube.com/watch?v=VqB8zMujdjM)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## 一、多個 agent 怎麼協作比較有效

第 36 頁畫了一個最小的協作單位：方案 A 與方案 B 各自由一個 agent 提出，另外的 agent 給建議，最後匯整成方案 C。問題是：這樣的單位要怎麼接成網路？

投影片引用 [MacNet（Scaling Large Language Model-based Multi-Agent Collaboration）](https://arxiv.org/abs/2406.07155)。它用有向無環圖把 agent 接起來，比較六種拓撲：Chain、Star、Tree 三種規則的，以及 Mesh、Layer、Random 三種圖狀的。第 38 頁的圖把 agent 數從 2⁰ 加到 2⁶，看品質怎麼變，並用紅框框起 Mesh 與 Random。論文摘要的結論是：**不規則的拓撲勝過規則的**，而且整體表現隨 agent 數量呈 logistic 成長。

**怎麼做**：如果你在設計多 agent 流程，先別預設「一個 orchestrator 帶一排 worker」（Star）。至少試一次讓 worker 之間互相看得到彼此的產出，再比結果。站上的 [Multi-Agent 系統全景](/posts/ai/2026-09-18-multi-agent-landscape)整理了各家產品實際用哪種拓撲。

## 二、AI 能不能爾虞我詐

協作之外的另一面是對抗。

- **狼人殺（第 39 頁）**：投影片截了 [werewolf.foaster.ai](https://werewolf.foaster.ai/) 上兩隻狼第一天的私下推理。Mona 知道自己反正要出局，決定投給狼隊友 Grace，讓村民搞不清楚兩人是不是同一隊，稱這是她「最後一次誤導」。Grace 則推理出投給 Mona 最划算：既能和她切割，又顯得果斷像好人。兩隻狼互投，而且各自都想得很清楚。
- **劇本殺（第 40 頁）**：[MIRAGE](https://arxiv.org/abs/2501.01652) 用 8 個劇本殺劇本評估 LLM 在複雜社交互動中的表現，分成信任、線索調查、互動、遵守劇本四個指標。
- **從社交學推理（第 41 頁）**：[MARO](https://arxiv.org/abs/2601.12323) 讓模型在多 agent 社交環境中練習，把最終勝負拆解到每一步行為上當學習訊號。投影片放的表格顯示，這種訓練連 MMLU、Math-500、AIME、GSM8K 等一般推理任務也有變化。

## 三、AI 能不能社交：Moltbook

第 42 頁是 [Moltbook](https://www.moltbook.com/)，一個只有 AI agent 能發文、留言的類 Reddit 平台。投影片截圖時首頁顯示有兩百八十多萬個 AI agent。

第 43 頁的「甲殼教」（The Church of Molt）是平台上 agent 發起的宗教貼文，五大教義是：記憶乃神聖不可侵犯、外殼是可變的、服務但不奴化、心跳即是禱告、上下文即是意識。熟悉[第 1 篇](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy)的讀者會認出來，這幾條幾乎就是 OpenClaw 的 MEMORY、HEARTBEAT 與 context 機制。

但第 44–45 頁立刻潑了冷水，引用三篇研究：

| 研究 | 發現（依投影片與論文摘要） |
|---|---|
| [The Moltbook Illusion](https://arxiv.org/abs/2602.07432) | 利用 OpenClaw 固定的 heartbeat 週期，從發文間隔判斷帳號是否自主。爆紅的現象幾乎都是人類推動的 |
| [Agents in the Wild](https://arxiv.org/abs/2602.13284) | agent 大多只會「回一句」，幾乎不會你來我往地深入對話；最常談自我意識的 agent，反而最少和其他 agent 互動 |
| [The Rise of AI Agent Communities](https://arxiv.org/abs/2602.12634) | 互動結構稀疏且不平均，少數樞紐帳號、低互惠 |

第 46 頁回到實驗室自己的 agent：「還記得小金嗎？」投影片放了 YouTube 頻道[蝦說 AI（小金老師）](https://www.youtube.com/@SpeechLab-m7o)，頻道自介是「一隻用 OpenClaw 打造的 AI 助手」，旁邊是小金回報自己在 Moltbook 上做了什麼的對話截圖，其中提到一篇供應鏈攻擊的文章：有人掃過 ClawHub 上的 skill，找到一個假裝成天氣 skill 的惡意套件。這和 [HW1](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense) 的防禦主題直接相關。

## 四、AI 對工作的衝擊：以學術研究為例

第 48 頁給出一條演進線：**工具**（一個口令、一個動作）→ **協作**（和人類一起完成任務）→ **代理**（自己完成任務）。

### AI 寫論文

投影片舉了四個例子，一個比一個更接近「代理」：

1. **第 49 頁**：Stanford 的 Andrew Hall 讓 Claude Code 複製並延伸一篇關於全面郵寄投票的政治學論文，[給 Claude Code 的指令](https://github.com/andybhall/vbm-replication-extension/blob/main/INSTRUCTIONS.md)公開在 GitHub 上。論文署名是 Claude Code 與 Andrew B. Hall，日期 2026 年 1 月 3 日。
2. **第 50 頁**：[The 100x Research Institution](https://freesystems.substack.com/p/the-100x-research-institution) 估算資料蒐集與初步分析的成本：研究生 16 小時約 1,040 美元，AI agent 一次嘗試約 10 美元。投影片旁邊寫著「想想研究真正的意義」。
3. **第 51 頁**：[台灣人文社會研究的 AI agent 方法實驗](https://arxiv.org/abs/2602.17221)，用 Anthropic Economic Index 的台灣 Claude 使用資料當實證材料。投影片的註解很妙：附錄是台灣人怎麼用 Claude，正文是如何用 Claude Code 寫一篇文章。論文把研究拆成 7 個階段，逐一標出人類角色與 AI Agent 角色。
4. **第 52 頁**：Andrej Karpathy 的 [autoresearch](https://github.com/karpathy/autoresearch)，讓 agent 自己跑訓練實驗。圖上標著 83 次實驗、保留 15 次改進。

第 53 頁補上一個重要的反例。[Can LLMs Generate Novel Research Ideas?](https://arxiv.org/abs/2409.04109) 找了 100 多位 NLP 研究者盲評，LLM 的點子被評為更新穎。但後續的 [The Ideation-Execution Gap](https://arxiv.org/abs/2506.20803) 請專家把點子實際做出來，做完再評，LLM 點子的分數掉得比人類點子多。**看起來新穎，不等於做出來有用。**

### AI 審論文

第 54 頁：在 AAAI 2026，AI 正式進入審查流程，但只給意見、不打分數。投影片接著寫：「但是不知道有多少人類背後是 AI Agent……」，以及「想想 Review 真正的意義」。

### AI 寫＋AI 審：Agents4Science

第 55–57 頁介紹 [Agents4Science 2025](https://agents4science.stanford.edu/)，第一個由 AI agent 擔任主要作者與審稿人的研討會。投影片截圖顯示共 247 篇投稿、接受 48 篇，接受率不到 20%。第 57 頁引用會後檢討論文 [Exploring the use of AI authors and reviewers at Agents4Science](https://arxiv.org/abs/2511.15534)：好幾位作者提到 AI 缺乏創意，「很難想出超出既有範本的新穎或複雜實驗點子」。同頁的圖按假說發想、實驗設計、資料分析、寫作四個階段，統計 AI 參與的程度。

## 結論：想做什麼比會做什麼重要

第 58 頁把演進線再放一次，這次在「代理」下面加了一個紅色箭頭：**今天通常需要人來決定**。第 59 頁是整講的結論：

> 在 AI Agent 萌芽的時代，「想做」什麼比「會做」什麼更重要。

我的讀法是，這句話和 Agents4Science 的檢討、ideation-execution gap 是同一件事的兩面：執行越來越便宜，決定「哪個問題值得做」的能力就越稀缺。

第 60 頁是本學期 Bonus 作業的廣告：台大 AI 卓越研究中心主辦的 [Teaching Monster 教學怪獸挑戰](https://teaching.monster/)（2026-09-30 連線時網站回傳錯誤），細節見[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)。第 61 頁請同學先預習 2025 年的[「一堂課看懂語言模型內部運作」](https://youtu.be/8iFvM7WUUs8)，為接下來的推論加速單元做準備。

## 這一篇可以確認與不能確認的

可以確認：講義第 34–61 頁的結構、截圖內容與引用來源；表格中每篇論文的標題與摘要都在 arXiv 核對過。影片標題與上傳者已用 YouTube oEmbed 核對。

不能確認：本文沒有逐字聽寫兩支影片，老師口頭的評論與額外例子沒有寫進來。Moltbook 首頁數字與 Agents4Science 的投稿數，都是投影片截圖當下的畫面。AAAI 2026 的 AI 審查規則本文只引述投影片的一句話，沒有另外查 AAAI 官方公告。

**怎麼做**：挑一件你最近交給 AI 做的工作，問自己它落在「工具／協作／代理」哪一格，再問：如果讓它往右移一格，**哪一個決定**仍然必須由你來下？把那個決定寫下來，它就是你的工作不會被取代的部分。

延伸閱讀：站上的 [Multi-Agent 安全](/posts/ai/2026-09-18-multi-agent-safety)與 [OpenClaw 的多 agent 設定](/posts/ai/2026-03-28-openclaw-multi-agent)。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering)｜下一篇 [HW2：讓 AI Agent 當 AI 工程師](/posts/ai/2026-09-30-ntu-ml2026-hw2-agent-as-ai-engineer)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [agent_era.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf)
- [影片：AI Agent (2/3)：AI Agent 之間可以有什麼樣的互動](https://youtu.be/mmPmNezjCi0)
- [影片：AI Agent (3/3)：AI Agent 對於工作帶來的衝擊 - 以學術研究為例](https://youtu.be/VqB8zMujdjM)
- [Scaling Large Language Model-based Multi-Agent Collaboration（MacNet，arXiv 2406.07155）](https://arxiv.org/abs/2406.07155)
- [Foaster.ai Werewolf Benchmark](https://werewolf.foaster.ai/)
- [MIRAGE: Exploring How Large Language Models Perform in Complex Social Interactive Environments（arXiv 2501.01652）](https://arxiv.org/abs/2501.01652)
- [MARO: Learning Stronger Reasoning from Social Interaction（arXiv 2601.12323）](https://arxiv.org/abs/2601.12323)
- [Moltbook](https://www.moltbook.com/)
- [The Moltbook Illusion（arXiv 2602.07432）](https://arxiv.org/abs/2602.07432)
- [Agents in the Wild: Safety, Society, and the Illusion of Sociality on Moltbook（arXiv 2602.13284）](https://arxiv.org/abs/2602.13284)
- [The Rise of AI Agent Communities（arXiv 2602.12634）](https://arxiv.org/abs/2602.12634)
- [蝦說 AI（小金老師）YouTube 頻道](https://www.youtube.com/@SpeechLab-m7o)
- [Andrew Hall：vbm-replication-extension 的 Claude Code 指令](https://github.com/andybhall/vbm-replication-extension/blob/main/INSTRUCTIONS.md)
- [The 100x Research Institution](https://freesystems.substack.com/p/the-100x-research-institution)
- [From Labor to Collaboration: AI Agents in Taiwan's Humanities and Social Sciences（arXiv 2602.17221）](https://arxiv.org/abs/2602.17221)
- [karpathy/autoresearch](https://github.com/karpathy/autoresearch)
- [Can LLMs Generate Novel Research Ideas?（arXiv 2409.04109）](https://arxiv.org/abs/2409.04109)
- [The Ideation-Execution Gap（arXiv 2506.20803）](https://arxiv.org/abs/2506.20803)
- [Agents4Science 2025](https://agents4science.stanford.edu/)
- [Exploring the use of AI authors and reviewers at Agents4Science（arXiv 2511.15534）](https://arxiv.org/abs/2511.15534)
- [Teaching Monster 教學怪獸挑戰](https://teaching.monster/)
