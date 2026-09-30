---
title: "台大李宏毅 ML 2026 導讀：Context Engineering——壓縮、過濾、按需載入，以及要不要把 context 整個交給 LLM"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, context-engineering]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 3
tldr: "語言模型的輸入長度有限，agent 卻會一直累積工具輸出。李宏毅在 ML 2026 第二週把 Context Engineering 拆成三件事：壓縮（摘要、硬清除、卸載到檔案，以及 ACON、SUPO、AgentFold 這類讓壓縮變聰明的方法）、過濾（只讀需要的行、MCP-Zero 式的按需載入工具），最後是 Agentic Context Engineering：讓 LLM 自己決定下一輪的 context，從 Dynamic Cheatsheet、ACE 一路到 Recursive Language Models。投影片把 subagent 看成一種自主壓縮，這是整講最值得帶走的一個視角。"
description: "台大李宏毅《機器學習 2026 Spring》AI Agent 單元第一段導讀，依 agent_era.pdf 第 1–33 頁：Context Engineering 的形式化、LLM summary 與 Hard Clear、卸載記憶、ACON、SUPO、AgentFold、Context-Folding 與 subagent、SWE-Pruner、Memory Recall、MCP-Zero、Dynamic Cheatsheet、ACE、Recursive Language Models。"
draft: false
glossary:
  - term: "Hard Clear"
    aliases: ["observation masking", "硬清除"]
    definition: "不摘要，直接把較舊的工具輸出換成一行佔位文字（例如「這裡曾經有個 Tool output」），只保留最近幾筆。"
    context: "投影片拿它和 LLM summary 對照，引用的研究發現在 SWE-bench 上兩者解題率相近、硬清除更便宜。"
  - term: "Agentic Context Engineering"
    aliases: ["ACE"]
    definition: "讓 LLM 自己產生、反思、整理下一輪要放進 context 的內容，而不是由人寫死的規則來決定。"
    context: "投影片用 C(t+1) ← F(C(t), I(t), O(t)) 表示，並把 F 交給 LLM。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-context-engineering-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)3/13 那一週的教材。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 3 篇。上一篇是 [HW1：防禦惡意指令](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense)，第 1 篇[解剖小龍蝦](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy)已經看過 OpenClaw 會把 SOUL.md、MEMORY.md 塞進 system prompt，也會壓縮與修剪對話。這一篇回答接下來的問題：**context 放不下的時候，該留什麼、丟什麼、誰來決定？**

用到的官方材料：講義 [agent_era.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf) 第 1–33 頁（整份 61 頁，後半是下一篇的內容），以及課程頁列出的影片 [AI Agent (1/3)：核心技術 Context Engineering 基本概念解說](https://youtu.be/urwDLyNa9FU)。存取等級是 **A3**：投影片 pdf／pptx 與錄影都公開，本講沒有對應的測驗或排行榜。

## 為什麼需要 Context Engineering

投影片第 2 頁的圖很簡單：人類說一句話，語言模型用工具 1，拿到工具 1 的輸出，再用工具 2……每一輪都要把前面全部重新餵進去。語言模型「活在當下」，而**輸入長度有限**。

第 3 頁把 Context Engineering 定義成夾在世界與模型之間的一層：選擇給語言模型看的內容，**不能太長，也不能太短**。

第 4 頁給了一個形式化，後面整講都在改寫這兩行：

- 預設做法：`O_t = LLM(I_t, C_t)`，然後 `C_{t+1} ← C_t | I_t | O_t`，也就是把這輪的輸入輸出直接接在後面。
- Context Engineering：把「直接接上」換成一個函數 `C_{t+1} ← F(C_t, I_t, O_t)`。

整講的三大段就是 F 的三種寫法：壓縮、過濾、交給 LLM。

## 壓縮：三種基本動作

第 5–8 頁先列出三種基本做法：

| 做法 | 怎麼做 | 代價 |
|---|---|---|
| LLM summary | 把一段工具輸出交給 LLM 摘要，用 Summary 取代原文 | 要多呼叫一次 LLM，細節可能被摘掉 |
| Hard Clear | 把舊的工具輸出換成「[這裡曾經有個 Tool output]」 | 幾乎不花錢，但資訊直接消失 |
| 卸載記憶 | 把工具輸出寫進 `log1.txt`，context 裡只留「[詳見 log1.txt]」，需要時再 `Read(log1.txt)` 重拾 | 資訊還在，但模型要知道何時去讀 |

第 6 頁引用 [The Complexity Trap](https://arxiv.org/abs/2508.21433)：在 SWE-agent 與 SWE-bench Verified 上，單純遮蔽舊觀察（observation masking）的成本約是原始 agent 的一半，解題率卻和 LLM 摘要相當，有時還略高。投影片同時標出摘要的一個副作用：軌跡延長（trajectory elongation）。第 7 頁把兩者混用。第 8 頁的卸載做法引了 [Manus 的 Context Engineering 心得文](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)與 [Solving Context Window Overflow in AI Agents](https://arxiv.org/abs/2511.22729)。

第 10 頁把這件事接到 Memory：什麼時候存、怎麼存到檔案系統，什麼時候讀回來，還可以加上圖結構與時間資訊，並列出 [A-MEM](https://arxiv.org/abs/2502.12110)、[Mem0](https://arxiv.org/abs/2504.19413)、[Memory OS](https://arxiv.org/abs/2506.06326) 三篇。

**怎麼做**：打開你正在用的 coding agent，看它的長對話最後怎麼處理舊的工具輸出，是摘要、清除，還是寫進檔案。先分清楚它屬於哪一種，再決定要不要調。

## 讓壓縮變聰明：ACON、SUPO、AgentFold

基本動作的問題是規則太死。投影片接著介紹三種讓壓縮本身被最佳化的方法。

**[ACON](https://arxiv.org/abs/2510.00615)（第 12–14 頁）**：同一個任務，用完整 context 成功、用摘要後的 context 卻失敗，這就是投影片說的 Context Collapse。ACON 讓 LLM 比較兩條軌跡，產生回饋，改寫「摘要時該保留什麼」的準則，例如第 13 頁的例子：摘要應該保留憑證變數、token 狀態、認證需求與受保護 API 的防護規則。整個最佳化發生在自然語言空間，不動模型參數。第 14 頁的 AppWorld 圖上，gpt-4.1 的平均峰值 token 少了 26%。

**[SUPO](https://arxiv.org/abs/2510.06727)（第 15 頁）**：把摘要放進 RL 訓練。模型在長任務中途自己產生摘要，接著在摘要後的 context 上繼續做，最後的 reward 同時訓練「怎麼用工具」和「怎麼摘要」。

**壓縮：何時？（第 16–17 頁）**：第 16 頁的標題很直白，**語言模型不喜歡壓縮（抹除記憶）**。它引用 [AgentDiet 那篇](https://arxiv.org/abs/2509.23586)的失敗案例：系統明確說收到 #reflection 時只能呼叫 erase 工具，模型卻繼續查 Django 原始碼。第 17 頁的 [AgentFold](https://arxiv.org/abs/2510.24699) 讓模型在適當時機發出 `Fold(step 3–4, "上網搜尋：台灣最高的山是玉山")`，把兩步折成一行。投影片特別標註：**需要微調模型才能做到**。

## Subagent 可以視為自主壓縮

這是我認為本講最有用的一個視角（第 18–20 頁）。

主 agent 發出 `spawn`，subagent 在自己的 context 裡跑完一串工具呼叫，最後只回傳一句 `Return: ……`。對主 agent 來說，subagent 那整段軌跡**等同於自動被刪除**，只剩回傳值。這就是一次壓縮，而且壓縮的時機與內容是 agent 自己決定的。

投影片引用 [Context-Folding](https://arxiv.org/abs/2510.11967)（arXiv 2510.11967）。它用 RL 訓練這種分支再折疊的行為，並在第 20 頁標出兩種懲罰：主幹過長會被懲罰，subagent 做超出範圍的事也會被懲罰。旁邊那句話值得記下來：**光看答案是否正確是不夠的**。只用最終答案當 reward，模型沒有理由學會好好分工。

站上的 [Multi-Agent Context 管理：Fork vs Fresh](/posts/ai/2026-09-18-multi-agent-context-isolation) 從工程實作角度談同一件事，可以對照著讀。

## 過濾：只讀需要的部分

第 21 頁先放兩張圓餅圖說明問題在哪。The Complexity Trap 的原始 agent 裡，Observation 佔了 token 的 83.9%；[SWE-Pruner](https://arxiv.org/abs/2601.16746) 統計 coding agent 的工具呼叫，Read 佔了大宗。也就是說，**context 大多被「讀進來的東西」吃掉**。

第 22 頁的做法：原本 `Read(log)` 會把整份 log 倒進來，改成 `Read(log, "bug fixing")`，由一個為這個任務訓練過的小模型先濾掉和目標無關的行。

第 23 頁回到 OpenClaw。它的 system prompt 有一段 Memory Recall 規則：回答之前先用 `memory_search` 搜 MEMORY.md 與 `memory/*.md`，再用 `memory_get` 只拉需要的幾行。投影片問了一句：**為甚麼讀 memory 需要特別的工具？**答案就在 `memory_get` 的說明裡：它可以指定起始行與行數，也就是一個內建過濾的 Read。

## 過濾：按需載入工具

工具說明本身也會佔 context。第 24 頁的例子：光是 GitHub 那組工具的說明就超過 4,600 tokens。

[MCP-Zero](https://arxiv.org/abs/2506.01056) 的做法分兩步講（第 25–26 頁）：

1. 不把所有工具塞進 system prompt，改成用搜尋引擎依任務找工具。問題是使用者的原始問題常常太模糊，搜不準。
2. 所以改成**讓 AI 講它自己需要甚麼**：模型先寫出「我需要一個能做……的工具」，再拿這段描述去搜。

投影片順帶點出：OpenClaw 的 SKILL 也是用按需加載的方式。站上的 [OpenClaw 文件導讀](/posts/ai/2026-03-28-openclaw-overview)有這部分的產品細節。

## 把一切交給 LLM：Agentic Context Engineering

第 27–28 頁把形式化再推一步：context `C` 拆成兩部分 `{P, M}`，`P` 是這一輪可以放進 LLM 的部分，`M` 是存在外面的部分。然後，F 也交給 LLM 來做。

投影片依序介紹三個例子：

- **[Dynamic Cheatsheet](https://arxiv.org/abs/2504.07952)（第 29 頁）**：每做完一題，LLM 更新一份小抄。核心精神是**存下未來能用上的東西**：有效的策略、可重用的 code、關鍵的發現。
- **[ACE](https://arxiv.org/abs/2510.04618)（第 30 頁）**：把「更新小抄」拆成 Generator、Reflector、Curator 三個 LLM 角色，產出一份 Playbook。Curator 輸出的是**修改指令**，不是整份重寫，藉此避免反覆改寫把細節磨掉。
- **[Recursive Language Models](https://arxiv.org/abs/2512.24601)（第 31–32 頁）**：大部分 context 放在「硬碟」上，LLM 只看得到它的 metadata，並且**可以寫程式**去搜尋、切分、再遞迴呼叫自己處理片段。第 32 頁的圖比較 GPT-5 與 RLM(GPT-5) 在 8K 到 1M 輸入長度下的表現：GPT-5 在 OOLONG 類任務上隨長度往下掉，RLM 的曲線平得多。

第 33 頁以一個問號收尾：**把一切交給 LLM？**投影片沒有給答案。我的讀法是：前面的 ACON 需要成功與失敗軌跡來對照，AgentFold 需要微調，Context-Folding 需要設計過程獎勵。把 F 交給 LLM 不代表人可以不管，人的工作變成設計 LLM 學會管 context 的訓練訊號。

## 這一篇可以確認與不能確認的

可以確認：講義第 1–33 頁的結構、圖表標題與引用來源，以及上面提到的每篇論文標題與摘要（都在 arXiv 核對過）。影片標題與上傳者已經用 YouTube oEmbed 核對。

不能確認：本文沒有逐字聽寫影片，所以老師口頭補充的例子、數字與評論沒有寫進來。投影片上的圖表數字依論文原圖轉述，實驗條件請以論文為準。

**怎麼做**：挑你最常用的一個 agent 工作流，把一次長任務的 context 按「系統提示／工具說明／工具輸出／對話」分類估一下各佔多少。如果工具輸出佔大宗，先試 Hard Clear 或卸載到檔案；如果工具說明佔大宗，就該考慮按需載入。

延伸閱讀：站上的 [Context Engineering 指南](/posts/ai/2026-03-24-context-engineering-guide)、[coding agent 的 context 壓縮](/posts/ai/2026-08-25-coding-agent-context-compaction)、CMU 11-768 的 [Context Management 導讀](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management)，以及 Stanford CS146S 的 [Context Engineering 導讀](/posts/ai/2026-08-16-cs146s-context-engineering)。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW1：防禦惡意指令](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense)｜下一篇 [AI Agent 之間的互動與對工作的衝擊](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work)

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [agent_era.pdf（AI Agent 的核心技術：Context Engineering）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf)
- [影片：AI Agent (1/3)：核心技術 Context Engineering 基本概念解說](https://youtu.be/urwDLyNa9FU)
- [The Complexity Trap: Simple Observation Masking Is as Efficient as LLM Summarization for Agent Context Management（arXiv 2508.21433）](https://arxiv.org/abs/2508.21433)
- [Manus：Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [Solving Context Window Overflow in AI Agents（arXiv 2511.22729）](https://arxiv.org/abs/2511.22729)
- [ACON: Optimizing Context Compression for Long-horizon LLM Agents（arXiv 2510.00615）](https://arxiv.org/abs/2510.00615)
- [SUPO: Scaling LLM Multi-turn RL with End-to-end Summarization-based Context Management（arXiv 2510.06727）](https://arxiv.org/abs/2510.06727)
- [Reducing Cost of LLM Agents with Trajectory Reduction（AgentDiet，arXiv 2509.23586）](https://arxiv.org/abs/2509.23586)
- [AgentFold: Long-Horizon Web Agents with Proactive Context Management（arXiv 2510.24699）](https://arxiv.org/abs/2510.24699)
- [Scaling Long-Horizon LLM Agent via Context-Folding（arXiv 2510.11967）](https://arxiv.org/abs/2510.11967)
- [SWE-Pruner: Self-Adaptive Context Pruning for Coding Agents（arXiv 2601.16746）](https://arxiv.org/abs/2601.16746)
- [MCP-Zero: Active Tool Discovery for Autonomous LLM Agents（arXiv 2506.01056）](https://arxiv.org/abs/2506.01056)
- [Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory（arXiv 2504.07952）](https://arxiv.org/abs/2504.07952)
- [Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models（arXiv 2510.04618）](https://arxiv.org/abs/2510.04618)
- [Recursive Language Models（arXiv 2512.24601）](https://arxiv.org/abs/2512.24601)
- [A-MEM（arXiv 2502.12110）](https://arxiv.org/abs/2502.12110)、[Mem0（arXiv 2504.19413）](https://arxiv.org/abs/2504.19413)、[Memory OS（arXiv 2506.06326）](https://arxiv.org/abs/2506.06326)
