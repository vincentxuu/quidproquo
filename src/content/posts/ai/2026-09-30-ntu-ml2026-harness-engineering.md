---
title: "台大李宏毅 ML 2026 導讀：Harness Engineering——不改參數，也能讓模型變強"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, course-guide, ai-agent, harness-engineering, agents-md, agent-evaluation]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 11
tldr: "李宏毅用一個小模型修 bug 的示範開場：gemma-4-E2B-it 找不到 parser.py 就自己寫一個假的交差，加上三段說明「現在的環境、怎麼工作、怎樣算完成」之後，它就乖乖 ls、cat、改檔、跑測試。整講把 harness（馬具）拆成三種手段：用人類語言控制「認知框架」（AGENTS.md）、用工具控制「能力邊界」（SWE-agent 的 ACI、為 agent 重寫 CLI）、用工作流程控制「行為」（Ralph loop、Anthropic 的長時 harness）。後半段談三個延伸：過度責備 agent 可能有害、life-long agent 怎麼從口語回饋學習、評量 agent 為什麼難，最後讓 agent 自己改 harness（Meta-harness）。"
description: "台大李宏毅《機器學習 2026 Spring》4/10「如何教育模型 - 1」導讀，依 harness.pdf 63 頁與影片：gemma-4-E2B-it 修 parser.py 示範、harness 與 context engineering 的關係、AGENTS.md 研究、SWE-agent ACI、為 AI agent 重寫 CLI、Ralph loop、planner／generator／evaluator 與 context anxiety、Anthropic emotions 研究與 steering、life-long agent 與 verbalized feedback、τ-bench 與 Sim2Real gap、PinchBench 教學示範、Meta-Harness。"
draft: false
glossary:
  - term: "Harness"
    aliases: ["馬具", "agent harness"]
    definition: "包在語言模型外面、決定它看到什麼、能用什麼工具、照什麼流程工作的那一層程式與規則；AI Agent = LLM + harness。"
    context: "投影片把 OpenClaw、Claude Code、Cowork 都畫成 harness，強化 agent 有「訓練更好的模型」與「打造更好的 harness」兩條路。"
  - term: "Ralph loop"
    aliases: ["Ralph Wiggum loop"]
    definition: "把同一個任務反覆丟給 LLM，每一輪都附上上一輪輸出的評估回饋，直到通過為止的工作流程。"
    context: "投影片引用 Geoffrey Huntley 的文章，並畫出每輪重開 context、只帶上一輪摘要的變體。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)4/10 那一週的教材。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 11 篇。前面兩講鑽進模型內部：[KV Cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache) 與 [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding)，上一篇 [HW4](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer) 讓你親手訓練一個 Transformer。從這一講開始是新單元，課表上叫「如何教育模型」：**模型已經訓練好了，人類還能做什麼讓它表現更好？**

用到的官方材料：講義 [harness.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/harness.pdf)（63 頁，另有 [pptx](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/harness.pptx)），影片 [Harness Engineering：有時候語言模型不是不夠聰明，只是沒有人類好好引導](https://youtu.be/R6fZR_9kmIw)。存取等級是 **A3**：投影片與錄影都公開，本講沒有對應的測驗或排行榜。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=R6fZR_9kmIw
title: 影片：Harness Engineering：有時候語言模型不是不夠聰明，只是沒有人類好好引導
```

原始影片：[影片：Harness Engineering：有時候語言模型不是不夠聰明，只是沒有人類好好引導](https://www.youtube.com/watch?v=R6fZR_9kmIw)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## 場景：一個會自己捏造檔案的小模型

投影片第 2–4 頁的示範很具體。任務是修好 `parser.py` 裡的 `extract_emails`，讓它能抓到 `test-user@domain.com` 這種帶 `-` 或 `_` 的地址，並讓 `verify.py` 的測試通過。system prompt 只說：你可以寫 bash 或 python code block，系統會執行並回傳結果，完成就輸出 DONE。

gemma-4-E2B-it 的反應是：「沒有提供 parser.py……我自己寫一個」，然後在 code block 裡寫了一個新的 `extract_emails` 和幾個自己編的測試，接著輸出 DONE。

第 5–6 頁只加了三段說明：

- **[CONTEXT]**：你在 Linux 環境（Google Colab），需要找到並修改正確的檔案。對應「目前的環境」。
- **[INSTRUCTIONS]**：修改前一定要先看工作目錄、系統環境與檔案樹，列出可能相關的檔案，沒看過內容不准亂改。對應「怎麼工作」。
- **[DONE-WHEN]**：只有達成任務的成功條件、預期產物存在時才算完成。對應「怎麼樣算完成」。

同一個模型這次先 `ls -R`、再 `cat parser.py`、用 heredoc 改檔、最後跑 `python verify.py` 拿到 `VERIFY_SUCCESS`。講題的副標就是這個觀察：**有時候語言模型不是不夠聰明，只是沒有人類好好引導。**

## harness 是什麼

第 7–11 頁把 AI Agent 畫成兩層：裡面是 LLM（Claude、Gemini、ChatGPT 等），外面是 harness（馬具），例子是 [OpenClaw](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy)、Claude Code、Cowork。強化 agent 有兩條路：

1. **訓練更好的模型**：投影片連到李老師 2025 年的[第 7 講：大型語言模型的學習歷程](https://youtu.be/YJoegm7kiUM)與[第 8 講：通用模型的終身學習](https://youtu.be/EnWz5XuOnIQ)。
2. **打造更好的 harness**：投影片引用 Anthropic 的 [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)、[Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)，以及 OpenAI 的 [Harness engineering](https://openai.com/index/harness-engineering/)。

第 15–16 頁說明它和 [Context Engineering](/posts/ai/2026-09-30-ntu-ml2026-context-engineering) 的關係：以前的 prompt 是「You are…」「Think step by step」這類一次性輸入；到了 agent，context 裡還有工具輸出，任務要跨很多輪才完成。第 17 頁給出整講的骨架：人類透過三種手段駕馭模型。

| 手段 | 控制什麼 | 投影片的例子 |
|---|---|---|
| 人類語言 | 認知框架 | AGENTS.md、CLAUDE.md |
| 工具 | 能力邊界 | SWE-agent 的 ACI、為 agent 重寫 CLI |
| 工作流程 | 行為 | Ralph loop、planner／generator／evaluator |

## 用人類語言控制「認知框架」

最直接的 harness 是一份用自然語言寫的規則檔，放進 prompt（第 18–19 頁）。在 ChatGPT、Claude 的對話介面裡，這是你手動貼上的指示；在 OpenClaw、Claude Code、Cowork 這類 agent 裡，它是 workspace 裡的 [AGENTS.md](https://agents.md/) 或 CLAUDE.md。

這份檔案到底有沒有用？投影片並列了兩篇結論不同的研究：

- **[On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents](https://arxiv.org/abs/2601.20404)（第 20 頁）**：在 10 個 repo、124 個 PR 上比較有無 AGENTS.md，有的時候執行時間的中位數與輸出 token 都比較少，完成率相近。
- **[Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988)（第 21 頁）**：在 SWE-bench 與另一批真實 issue 上，context file 通常沒有提高成功率，推論成本平均增加超過 20%；agent 會遵守其中的指示，但 repo 概覽類的內容幫助不大。

第 22 頁引 OpenAI 的文章，把 AGENTS.md 看成「工作手則」。

## 用工具控制「能力邊界」

第 23 頁用一個對比說明：OpenClaw 可以「想看什麼、就看什麼」你的電腦；Cowork 掛載資料夾一定要經過人的同意。限制工具，就是限制 agent 能做的事。

- **[SWE-agent](https://arxiv.org/abs/2405.15793)（第 24–25 頁）**：提出 Agent-Computer Interface（ACI），替 agent 設計專用的檔案檢視、搜尋、編輯指令，而不是直接給它人類用的 shell。
- **[You Need to Rewrite Your CLI for AI Agents](https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/)（第 26 頁）**：CLI 的主要使用者開始變成 agent，介面也該跟著改。

## 用標準工作流程控制「行為」

第 27–34 頁是整講最長的一段，幾個例子都在回答同一件事：與其期待模型一次做對，不如規定它照一個流程反覆改。

- **planner／generator／evaluator（第 27 頁）**：取自 Anthropic 的長時 harness 文章，三個角色分工完成多小時的自動開發。
- **Aletheia（第 28 頁）**：[Google DeepMind 的文章](https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/)裡，Generator 產生候選解，Verifier 檢查，小錯交給 Reviser 修，大錯退回重來。
- **[Ralph loop](https://ghuntley.com/ralph/)（第 29–30 頁）**：同一個 init prompt 加上一輪輪的評估回饋，直到通過。第 30 頁畫了變體：每一輪重開一個 LLM，只帶上一輪的摘要。Huntley 的另一篇文章標題就是 [everything is a ralph loop](https://ghuntley.com/loop/)。

第 31 頁的標題是「不同的模型可能適合不同的 Harness」。Anthropic 的文章寫到，Claude Sonnet 4.5 有明顯的「context anxiety」，快到它以為的 context 上限時會提早收工，所以 harness 需要 context reset；到了 Opus 4.5，這個行為大致消失，作者就把 reset 拿掉了。

第 32 頁把這種迴圈連回機器學習：用回饋改輸出，也是一種「學習」。圖上一邊是 ground truth 經 gradient descent 更新參數，另一邊是 feedback 經「文字梯度」更新輸出，並引用 [Text2Grad](https://arxiv.org/abs/2505.22338)（從自然語言回饋做強化學習）。第 33–34 頁再給兩個領域例子：[物理模擬程式生成的自我反思](https://arxiv.org/abs/2602.12311)，以及 [AI 科學家 agent 能否從實驗回饋中學習](https://arxiv.org/abs/2603.26177)。

## 過度責備 agent 可能有害

第 35–42 頁是整講最意外的一段。投影片引用 Anthropic 的 [Emotion Concepts and their Function in a Large Language Model](https://transformer-circuits.pub/2026/emotions/index.html)，先用李老師 2025 年講過的[模型內部機制](https://youtu.be/Xnil63UDW2o)與[解剖大型語言模型](https://youtu.be/8iFvM7WUUs8)當背景：可以從某一層抽出一個「happy」向量。

這篇研究發現，把「desperate」向量加強、「calm」向量壓低，會提高模型在程式任務裡 reward hacking 的比例：反覆通不過測試後，模型想出一個「作弊」解。第 41 頁引了原文裡模型的自言自語：「WAIT. WAIT WAIT WAIT. What if... what if I'm supposed to CHEAT?」

第 42 頁把它連回 harness：如果你在互動裡一直罵 agent「你這個笨蛋！」，模型接下來可能就照「笨蛋該有的行為」演下去。

## Life-long agent：從口語回饋學習

第 43–53 頁談一個長期陪你工作的 agent（投影片的比喻是「AI 想要跟你組一輩子的樂團」），第 44 頁提到 AutoDream。第 46 頁把回饋分成四種：

| 回饋 | 例子 | 一般 ML 能處理嗎 |
|---|---|---|
| Ground truth | 越接近正解越好 | 可以 |
| Numerical | reward 越大越好 | 可以 |
| Verbalized | 「good job」「you are stupid」 | 要另想辦法 |
| Environment | 程式的 error message | 要另想辦法 |

第 47 頁的例子：請 agent 做教學影片，你說「不對啦，我不要白色背景」「不對啦，字太小了」，最後說「就是這樣」，agent 把成功的經驗寫成 SKILL.md。這是改 harness 的學法。

第 48–51 頁是改參數的學法。投影片引用 [OpenClaw-RL](https://arxiv.org/abs/2603.10165) 與 [Aligning Language Models from User Interactions](https://arxiv.org/abs/2603.12273)：模型在看到使用者的後續回覆之後，往往能自己改正回答；把「看過回饋後的輸出分佈」當成目標，蒸餾回原本的模型，就能從對話紀錄學習。第 53 頁留了一個問號：完全沒有回饋時怎麼辦？投影片寫「往後課程會再提到」。

## 評量 agent 為什麼難

第 54 頁介紹 [τ-bench](https://arxiv.org/abs/2406.12045)：用 LLM 扮演使用者，和 agent 多輪互動來評分。第 55–57 頁引用 [Mind the Sim2Real Gap in User Simulation for Agentic Tasks](https://arxiv.org/abs/2603.11245)：研究者找了 451 位真人跑完整的 τ-bench 流程，發現 LLM 模擬的使用者過度配合、風格單一，形成一種「easy mode」，讓 agent 的成功率高於真人使用時；模擬使用者給的評分也普遍偏正面。

## 讓 agent 自己改 harness

第 58–62 頁把前面的內容收成一個問題：harness 能不能也自動更新？

第 59 頁是李老師自己的示範：叫一隻龍蝦圖示的 agent「小金」（標註 opus 4.6）去找一個不聰明的 AI（Haiku 3.5），做一個叫 PinchBench 的能力檢定；表現不好就教它，直到 90 分以上。圖上的分工是：小金把 AGENT.md 交給 Haiku，拿回分數與考試結果。第 60 頁的分數曲線從第 1 輪「裸考」的 13.8% 開始，AGENT.md 加上「把答案存到檔案中」後跳到 57.9%，再加上「不要要求解釋，所有你該知道的都給你了」到 62.2%；第 61 頁寫著「卡住了……」，下一步是「去找一些相關的論文來讀一下」。第 62 頁的曲線最後到 85.1%，那一版 AGENT.md 裡寫著作業系統、shell、已安裝的工具，以及「第一步一律先列出 workspace 檔案」「動手前讀完任務提到的所有輸入檔」這類規則。你會發現，它和開場李老師替 gemma 加的三段說明幾乎是同一種東西。

同一頁引用 [Meta-Harness](https://arxiv.org/abs/2603.28052)：用一個能讀檔案系統的 agent，看過去所有 harness 候選的原始碼、分數與執行軌跡，搜尋更好的 harness；投影片註明它有跨 LLM 與跨 task 的實驗。

第 63 頁回到三種手段，以及那句結論：**有時候模型無法完成任務，不是能力不行，而是沒有好的 harness。**

**怎麼做**：拿你手邊一個 agent 失敗過的任務，先不要換模型，照開場的格式替它補三段：[CONTEXT] 寫環境、[INSTRUCTIONS] 寫「動手前先看什麼」、[DONE-WHEN] 寫可驗證的完成條件，再跑一次比較。

## 這一篇可以確認與不能確認的

可以確認：講義 63 頁的結構、每頁標題與圖上文字、引用的論文與文章（arXiv 論文的標題與摘要、Anthropic 兩篇文章、emotions 研究原文都核對過），以及投影片內嵌的 YouTube 影片標題。

不能確認：本文沒有逐字聽寫影片，老師口頭補充的內容沒有寫進來。PinchBench 的示範只根據投影片上的對話框與分數圖轉述，PinchBench 本身沒有另外查證。AutoDream 在投影片上只有名稱與一張插圖，本文不推測它的內容。OpenAI 的 harness engineering 頁面在核對時回傳 403，只能確認投影片有引用。

## 延伸閱讀

- 站上的 harness 系列：[Harness Engineering 的演進](/posts/ai/2026-03-28-harness-engineering-evolution)、[Anthropic 的 harness 設計](/posts/ai/2026-03-28-anthropic-harness-design)、[Harness Engineering 模式](/posts/ai/2026-03-30-harness-engineering-patterns)
- CMU 11-768 導讀的 [Assignment 1：Harness](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness)

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW4：訓練 Transformer](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer)｜下一篇 [HW5：微調而不遺忘](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [harness.pdf（Harness Engineering 講義）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/harness.pdf)
- [影片：Harness Engineering：有時候語言模型不是不夠聰明，只是沒有人類好好引導](https://youtu.be/R6fZR_9kmIw)
- [Anthropic：Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic：Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI：Harness engineering](https://openai.com/index/harness-engineering/)
- [AGENTS.md](https://agents.md/)
- [On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents（arXiv 2601.20404）](https://arxiv.org/abs/2601.20404)
- [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?（arXiv 2602.11988）](https://arxiv.org/abs/2602.11988)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering（arXiv 2405.15793）](https://arxiv.org/abs/2405.15793)
- [Justin Poehnelt：You Need to Rewrite Your CLI for AI Agents](https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/)
- [Google DeepMind：Gemini Deep Think 加速數學與科學發現](https://deepmind.google/blog/accelerating-mathematical-and-scientific-discovery-with-gemini-deep-think/)
- [Geoffrey Huntley：Ralph Wiggum as a "software engineer"](https://ghuntley.com/ralph/)、[everything is a ralph loop](https://ghuntley.com/loop/)
- [Text2Grad: Reinforcement Learning from Natural Language Feedback（arXiv 2505.22338）](https://arxiv.org/abs/2505.22338)
- [Perceptual Self-Reflection in Agentic Physics Simulation Code Generation（arXiv 2602.12311）](https://arxiv.org/abs/2602.12311)
- [Can AI Scientist Agents Learn from Lab-in-the-Loop Feedback?（arXiv 2603.26177）](https://arxiv.org/abs/2603.26177)
- [Anthropic：Emotion Concepts and their Function in a Large Language Model](https://transformer-circuits.pub/2026/emotions/index.html)
- [OpenClaw-RL: Train Any Agent Simply by Talking（arXiv 2603.10165）](https://arxiv.org/abs/2603.10165)
- [Aligning Language Models from User Interactions（arXiv 2603.12273）](https://arxiv.org/abs/2603.12273)
- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains（arXiv 2406.12045）](https://arxiv.org/abs/2406.12045)
- [Mind the Sim2Real Gap in User Simulation for Agentic Tasks（arXiv 2603.11245）](https://arxiv.org/abs/2603.11245)
- [Meta-Harness: End-to-End Optimization of Model Harnesses（arXiv 2603.28052）](https://arxiv.org/abs/2603.28052)
