---
title: "Stanford CS329Z 導讀 Week 11（最終回）：從等指令到先出手——proactive agent 與 Demo Day"
date: 2026-09-18
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 11
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 26
tldr: "最終回讀 Week 11：週一用 GUM 論文把等指令的 reactive 助理升級成會觀察、推測、先出手的 proactive agent，週三把 multimodal、long-running 與 production observability 收成三個 open problems；文末附 Demo Day 前檢查清單與全系列 11 篇地圖。"
description: "帶讀 Stanford CS329Z Week 11 主讀物 Shaikh 等人的 General User Models：命題架構、Gumbo 助理、隱私信任兩難，以及 12 月 2 日 open problems 框架與 Demo Day 行前準備。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-18-stanford-cs329z-week11-proactive-demos-en)

想像兩種助理。第一種永遠等你開口，你沒說，它就不動。第二種會看：你收到朋友的婚禮邀請，它先查好租西裝的地點與預算，把結果放在你面前。第一種叫 reactive，第二種叫 [proactive agent](https://arxiv.org/abs/2505.10831)，Week 11 的週一談的正是第二種。

差別不在模型大小，在誰先出手。reactive agent 的迴圈起點是你的指令，proactive agent 的迴圈起點是它對你的觀察。觀察需要一雙眼睛，推測需要一個使用者模型，出手需要一套何時該打斷的規矩。這三件東西，剛好就是本週主讀物的三個主角。

Week 11 的安排很像收官。週一（Proactive Agents）的主讀物是 Shaikh 等人的 [General User Models](https://arxiv.org/abs/2505.10831)，另有 Next Action Prediction 延伸論文與隱私信任的討論。週三（Open Problems & Final Demos）沒有單一讀物。課程把 multimodal、web 與 computer-use、science agent、long-running 架構、production observability 攤開，收斂成三個開放方向。以下對週三的整理標示為課程視角，而非某篇論文的主張。paper video 的 peer review 也在週一截止，Demo Day 排在 finals week，主題是 Making Life at Stanford Better with Agents。

## GUM：把螢幕痕跡變成使用者模型

[GUM](https://arxiv.org/abs/2505.10831) 的輸入是任何非結構化觀察，例如螢幕截圖。輸出是一組自然語言命題，每個命題帶一個信心分數。看到婚禮邀請，寫下使用者受邀參加朋友的婚禮；看到你反覆改草稿又切去讀相關文獻，寫下使用者被合作者的意見卡住了。前者信心高，後者信心低，系統都誠實標出來。

架構是四個模組。Propose 把觀察翻成命題，Retrieve 撈出相關的舊命題當脈絡，Revise 隨新證據修正，Audit 在寫入前擋掉使用者不會想被記下的東西。螢幕理解用 [Qwen 2.5 VL](https://github.com/QwenLM/Qwen2.5-VL)，命題推理用 [Llama 3.3 70B](https://www.llama.com/)，兩條都是開放路線。論文刻意選開放模型，目標是讓資料不必送往第三方平台。實作中 Llama 跑在私有伺服器上，命題的存取權只屬於使用者。

例子很有說服力。第一作者的 GUM 替他找到婚禮租西裝的地點，還自動受限於他的預算。GUM 也能幫 prompt 補上脈絡：你正在寫哪一段、讀過哪篇論文，於是 help me with this section 這種沒頭沒尾的請求也能直接可用。這正是 [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag) RAG 想補的 grounding，只是來源從檢索庫換成你的電腦使用痕跡。

評估的數字值得記一組。在一組以電子郵件為材料的評估裡，命題平均準確度約 76%，信心最高的命題全部正確。另一組連續多日的螢幕部署複現了同樣的校準結果，部分參與者主動要求把系統留下繼續用。

## Gumbo：先做再說的助理

[Gumbo](https://generalusermodels.github.io/) 是建在 GUM 上的示範應用。它持續看螢幕、養一份 GUM、從中挖掘建議。挖到之後不急著打斷你，先算一筆期望效用：建議有用的機率乘上好處，對上打擾錯誤的成本。這套算法來自 [Horvitz 的 mixed-initiative 框架](https://dl.acm.org/doi/10.1145/302979.303030)，GUM 剛好補上它當年最缺的現成成本效益估計。

怕建議一次湧入，另有節流機制，每分鐘最多出現一則。通過門檻的建議，能做的自己先做：查資料、跑程式、整理檔案，做到不能再做為止才呈現。做完接受按讚或倒讚，回饋直接餵回 GUM，變成新的觀察。論文也老實寫下邊界：評估時 computer use 功能保持關閉，因為太慢且多 bug。

課表上的 Next Action Prediction 有具體所指。Shaikh 等人的後續工作把「從多模態電腦使用痕跡預測下一步行動」形式化成任務，正是 Gumbo 這條 pipeline 指向的能力。完整小評見文末 Course Material 對照。

## 隱私與信任：能力越強，犯錯越貴

Audit 模組用[脈絡完整性](https://arxiv.org/abs/2505.10831)原則過濾觀察。白話問一句：這份資訊被記下來，符合它原本出現的場合嗎。評估結論很誠實：大致守規矩，但破例的時候都很嚴重。這正是 Week 11 把隱私與信任和 proactive 放在同一週的原因。reactive agent 犯錯，你至少在場；proactive agent 犯錯，經常是你不在場的時候。

論文另闢一節談 privacy paradox。同一批參與者既想要記得夠多的助理，又對白紙黑字的命題感到不自在。看到自己的習慣被寫成命題，有人直說感覺怪怪的。這題沒有技術解，只有取捨：記得多，幫得多，也錯得多。

這裡也回扣 [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems) 的系統觀。GUM 的四個模組沒有一個是模型本身，全是模型之外的工程：觀察、稽核、檢索、修正。好成績依然是系統堆出來的，只是這次堆的是關於你的系統。

## 週三：三個開放方向與 production 現實

重申一次，這節是課程視角整理，週三沒有指定主讀物。課程把前沿收斂成 reliability、scalability、interpretability 三題。把前面的主題對回去看，大致是：long-running 智慧體如何不漂移不卡死，web 與 computer-use 規模化之後怎麼辦，行為能不能被追蹤與解釋。規模化有具體量尺：[OSWorld](https://arxiv.org/abs/2404.07972) 把真實電腦任務搬進可重複執行的作業系統環境，用執行結果而非文字比對評分。當時最佳模型成功率僅約一成二，瓶頸在 GUI 定位與操作知識。web 側則有 [WebShop](https://arxiv.org/abs/2207.01206)：在模擬電商站上用群眾外包的購物指令考語言 grounding，最佳模型成功率不到三成，連「買對東西」都還站不穩。

production observability 是同一週的另一半。tracing、monitoring、cost management 三件套，HW2 做評估時練過一半，剩下的一半要在 Demo Day 前補齊。課程在這裡把研究問題和工程現實並置：open problems 決定題目能走多遠，observability 決定 demo 當天會不會翻車。想把 Gumbo 式原型推向可維運系統，可對照開源的 [OpenClaw](https://github.com/openclaw/openclaw)：個人助理跑在本機 Gateway 上，模型與聊天通道都做成可替換外掛。

## 怎麼做：Demo Day 前檢查清單

**怎麼做**：先把 tracing 全開，每次彩排都留一條可重播的 trace。monitoring 盯三件事：錯誤率、延遲、token 花費。cost 設硬上限，超標自動停。高風險工具預設關閉，現場 demo 才手動放行。最後準備一個失敗案例，midway report 寫過的 failure mode 拿出來講，比只秀成功更有說服力。

## 全系列回顧：11 篇一句話地圖

1. [總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)：先手刻再用框架，兩份作業與 GitHub 課綱變動全覽。
2. [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)：別只調模型，好成績是複合系統堆出來的。
3. [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)：先分清 workflow 和 agent，再手刻第一個 RAG。
4. [Week 3](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)：MCP 統一工具插頭，DSPy 把 prompt 變成可編譯程式。
5. [Week 4](/posts/ai/2026-09-12-stanford-cs329z-week4-react-memory)：ReAct 把迴圈定型為想—做—看，[MemGPT](https://arxiv.org/abs/2310.08560) 把記憶做成作業系統式的分層結構。
6. [Week 5](/posts/ai/2026-09-13-stanford-cs329z-week5-multiagent-optimization)：多智慧體協作與優化三軸，決定改 prompt、改權重還是加推理算力。
7. [Week 6](/posts/ai/2026-09-14-stanford-cs329z-week6-data-flywheel)：資料飛輪轉起來，HW2 發布、HW1 截止。
8. [Week 7](/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks)：資料選擇與基準設計，評估收斂成四元組。
9. [Week 8](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)：LLM-as-judge 與安全護欄，評分者本身也要被評。
10. [Week 9](/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents)：ACI 介面即效能，SWE-agent 證明編輯器設計決定分數，OpenHands 把沙箱與評測做成通用底座。
11. Week 11（本篇）：從等指令到先出手，proactive agent 與 open problems 收官。

## 本週 Course Material 對照

- 週一 11/30 Proactive Agents：主讀物 GUM（本文已導讀）；延伸閱讀 [Shaikh 等人 Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923)。它把「從多模態電腦使用痕跡預測下一步行動」形式化成任務，並提出結合參數與上下文學習的 LongNAP 模型。資料來自 20 位使用者的連續手機使用紀錄。團隊用 vision-language 模型標出超過 36 萬個行動。評估以 LLM-as-judge 對預測與真實下一步的相似度打分，LongNAP 明顯優於監督微調與提示基線。
- 週三 12/2 Open Problems & Final Demos：無單一主讀物。延伸閱讀 [OSWorld](https://arxiv.org/abs/2404.07972)（真實作業系統中的開放式電腦任務基準）與 [WebShop](https://arxiv.org/abs/2207.01206)（模擬電商站上的語言 grounding 基準）。兩者的具體數字見上文週三一節。
- 課表原文：[CS329Z 官網 Week 11](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)、[Week 1：別再只調模型了](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)、[Week 2：先分清 workflow 和 agent](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag)、[Week 3：工具接進來，框架換上去](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Shaikh et al., Creating General User Models from Computer Use, UIST 2025](https://arxiv.org/abs/2505.10831)、[Shaikh et al., Learning Next Action Predictors from Human-Computer Interaction](https://arxiv.org/abs/2603.05923)、[GUM 專案頁與開源套件](https://generalusermodels.github.io/)、[Horvitz, Principles of Mixed-Initiative User Interfaces, CHI 1999](https://dl.acm.org/doi/10.1145/302979.303030)
- 場合：[UIST 2025](https://uist.acm.org/2025/)
