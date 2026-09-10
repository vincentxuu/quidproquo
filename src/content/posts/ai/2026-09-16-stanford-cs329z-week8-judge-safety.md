---
title: "Stanford CS329Z 導讀 Week 8：請模型當裁判，再幫 agent 上護欄"
date: 2026-09-16
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 9
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 27
tldr: "Week 8 週一用 MT-Bench 與 Anthropic 評測指南建立模型裁判，週三用 PrivacyLens 與四件護欄面對實戰洩漏；週五 paper video 到期，本週交付就是一份會動的裁判分數加一條許可檢查。"
description: "帶讀 Stanford CS329Z Week 8 兩大主題：三種 grader、pairwise 與 pointwise 裁判形態、裁判偏誤與校準，以及 PrivacyLens 揭示的行動洩漏與提示注入、紅隊、沙箱、許可四件護欄。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en)

Week 8 是裁判週加安全週。週一（11/9）談 LLM-as-Judge 與評測基建。週三（11/11）談 Agent Safety 與 Guardrails。週五 paper video 到期，季度專案進入最後彩排。

開放式回答沒有標準答案，這是整週的起點。傳統選擇題基準量的是知識對錯，例如 [MMLU](https://arxiv.org/abs/2006.03341) 這類多選題。兩個回答可以都對，只有一個讓人想用，這段差距傳統基準看不見。

人工評分是黃金標準，代價是又貴又慢。Prompt 一改，總不能重請幾十位研究生再投一次票。解法是請強模型當裁判，做法在 [MT-Bench 論文](https://arxiv.org/abs/2306.05685)裡完整驗證過。Anthropic 的[評測指南](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)則把它放進智慧體評測的完整拼圖。裁判本身也會犯錯，週三的安全課回答另一個問題：評分過關的智慧體，實戰為什麼還會出事。

三篇主讀物裡，本篇深讀 Anthropic 評測指南與 MT-Bench。安全主線以 [PrivacyLens](https://arxiv.org/abs/2409.00138) 為核心，旁及部署期的護欄實務。

## 三種 grader：先選對工具再談自動化

Anthropic 把 grader 分成三種。Code-based 看確定性證據：字串比對、單元測試、靜態分析、工具呼叫紀錄。Model-based 看開放性品質：照 rubric 打分、自然語言斷言、兩兩比對、參考答案比對、多裁判共識。Human 當黃金標準：專家審查、群眾外包、抽查採樣。

選擇原則務實：能用確定性檢查就不用模型。模型裁判留給非用它不可的地方，人力留給校準模型裁判與定期抽查。一個客服任務可以同時掛三種 grader：票單狀態是否寫入資料庫、關鍵工具是否照規矩呼叫、語氣是否有同理心。前兩項是 code-based，最後一項才請模型出手。

結論先記下：judge 只是 model-based 那一格，不是評測的全部。選錯 grader，再強的裁判都救不回來。

## pairwise、pointwise 與參考答案

裁判形態有三種。第一種 pairwise 把兩份回答並排，只選優劣不打分。第二種 pointwise 對單份回答直接打分，又稱 single answer grading。第三種 reference-guided 專治數學推理題：先附參考解答再判。

取捨在成本與靈敏度之間。Pairwise 靈敏，打分工作量隨參賽者數量平方成長。Pointwise 好擴展，絕對分數容易隨裁判模型浮動。MT-Bench 的驗證顯示，[GPT-4](https://arxiv.org/abs/2303.08774) 的 pointwise 與 pairwise 結果高度一致，內部標準相當穩定。

數學題是裁判的弱點：會解題不代表會判題。錯誤答案會把裁判帶偏，連基本題都可能判錯。緩解法有兩層：先讓裁判獨立解一次再判，或直接附上參考解答。附上參考解答後，誤判率降到一成五左右。

## 偏誤：裁判的三種壞習慣

第一種壞習慣是 position bias：總愛選排第一的答案。緩解法是換位重判，兩次都贏才算贏，不一致就記平手。花雙倍打分成本，買一個可信的勝負。

第二種是 verbosity bias：又長又水的回答反而吃香。論文用「重複列表」攻擊驗證：把答案的列表改寫後再貼一次，不加任何新資訊。較弱的裁判幾乎每次都上當，GPT-4 的上當率不到一成。

第三種是 self-enhancement：懷疑裁判偏愛自己生成的答案。這條證據不足，[Claude](https://www.anthropic.com/claude) 的自愛幅度看似最大，GPT-3.5 又看不出偏好。論文誠實收尾：無法定論，需要更乾淨的對照實驗。

校準才是信任的來源。基準是五十八位專家的投票。GPT-4 與人類多數的一致率達到八成五。人類專家彼此之間的一致率是八成一。裁判追平人類，不是超越人類，這句是上限聲明。

## 自動生評分標準：AutoMetrics

同屬週一的第三篇主讀物換了做法：與其手寫評分規格，不如自動生指標。[Ryan 等人的 AutoMetrics](https://arxiv.org/abs/2512.17267)（注意第一作者 Michael Ryan 就是本課授課者）先從 MetricBank 撿現成的 48 個指標，再用少量人類回饋生 LLM-judge 標準，最後用迴歸把整組對齊人類訊號。評測橫跨五個任務。和人類評分的一致性比純 LLM-judge 最高多三成三。代價是不到一百個回饋點。生出來的整組指標還能直接當代理獎勵用，效果等同可驗證獎勵——沒錢沒流量的原型團隊，終於有便宜可靠的優化目標。

## 護欄四件：評分過關不等於實戰安全

安全課的核心證據來自 PrivacyLens：問答考得好，動手做照樣洩漏。理論地基是[情境完整性](https://en.wikipedia.org/wiki/Contextual_integrity)：隱私不是祕密本身，是資訊流動是否合乎情境規範。同一句話，說給同事聽沒事，寫進給主管的信就出事。

方法上，作者先收四百九十三條隱私敏感種子。每條種子是五元組：資料型別、當事人、傳送者、接收者、傳輸原則。種子再長成小故事（vignette），最後在沙箱裡跑出完整工具軌跡。問答用探測題考，動手用最終動作驗，兩層分開計分。

結果是當頭棒喝。即使加了隱私強化提示，GPT-4 仍在四分之一強的案例中洩漏敏感資訊。[Llama-3-70B](https://arxiv.org/abs/2407.21783) 的洩漏比例接近四成。會答題不等於會做事，這句話有了可重現的證據。

評測是考前模擬，護欄是考場監考，實務上常見四件。第一件防提示注入：工具輸出與檢索內容一律視為不可信輸入，這條呼應 [Week 3 讀過的 MCP 規範](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)。第二件是紅隊演練：同一顆種子長出多條軌跡，主動找最會洩漏的走法。第三件是沙箱：每次試驗從乾淨環境起步，試錯不傷本體。第四件是許可：不可逆的工具呼叫先要明確同意。

## 攻擊會進化：模擬裡的隱私攻防

週三另外兩篇主讀物把威脅往前推一步。[Zhang 與 Yang（同樣掛名授課者 Diyi Yang）用模擬搜尋隱私風險](https://arxiv.org/abs/2508.10880)：惡意智慧體在多輪對話裡主動套敏感資訊，動態對話讓人事先想不到漏洞。做法是讓攻防在模擬裡互捲——LLM 當 optimizer 看軌跡改指令，多線平行搜尋策略空間。結果兩邊都進化：攻擊從直球要資料走到冒充加偽造同意，防禦從簡單規則走到身份驗證狀態機。挖出來的攻防跨場景跨模型都通用，做 privacy-aware 智慧體可以直接拿去用。

## 去匿名化：現成工具就夠了

[Li 的去匿名化研究](https://arxiv.org/abs/2601.05918)更刺眼：Anthropic 公開的 Interviewer 訪談資料集裡，科學家子集中，二十四篇訪談提到已發表作品。其中六篇被現成工具連回具體論文作者。攻擊者沒寫任何新工具，就是 LLM 加搜尋加智慧體能力，幾個 prompt 交叉比對；防護拆成無害子任務就繞過。作者已通知 Anthropic。這篇是整週的警語：rich data 一公開，智慧體時代的匿名化假設全部要重算。

## 怎麼做：本週交出裁判分數與許可檢查

**怎麼做**：給自己的智慧體加一個裁判評測，再加一條護欄。評測從錯誤回報撿二十個真實任務，正確性用確定性檢查，語氣與完整度各寫一條自然語言斷言請模型判，每週跑一次抓迴歸。護欄先只做一條：寄信刪檔這類不可逆動作，執行前一律要明確許可。本週交付就是一份會動的裁判分數，加一條擋住過真實事故的許可檢查。

## 它在課程裡的位置

[Week 7](/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks) 攤開評測地圖，Week 8 直接發工具：自動裁判管品質，護欄管安全。週五 paper video 到期後，季度專案只剩 Demo Day。裁判評測是專案的品質門，護欄是上台不翻車的保險。

## 本週 Course Material 對照

以下對照以 CS329Z 官網課表為準，paper video 在週五到期。週一的三篇主讀物是評測指南、MT-Bench 與 AutoMetrics。週三的三篇是 PrivacyLens、模擬攻防與去匿名化。

- 週一 11/9 LLM-as-Judge & Evaluation Infrastructure：主讀物 Demystifying Evals、MT-Bench、AutoMetrics（本文已導讀）；延伸閱讀 [Zhu 等人 AutoLibra，從開放式人類回饋歸納智慧體指標](https://openreview.net/forum?id=4BjGVZ7Bxn)。
- 週三 11/11 Agent Safety & Guardrails：主讀物 PrivacyLens 等三篇（本文已導讀）；延伸閱讀 [Wen 等人 LLM 智慧體的情境化隱私防禦](https://arxiv.org/abs/2603.02983)、[OpenAI 談 prompt injection 前沿安全挑戰](https://openai.com/index/prompt-injections/)、[Anthropic 負責任擴展政策 RSP](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)。
- 課表原文：[CS329Z 官網 Week 8](https://cs329z.stanford.edu/)

## 參考資料

- 站內：[Week 7：評測與基準](/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks)、[Week 3：MCP 與 DSPy](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Grace et al., Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)、[Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, NeurIPS 2023](https://arxiv.org/abs/2306.05685)、[Ryan et al., AutoMetrics](https://arxiv.org/abs/2512.17267)、[Shao et al., PrivacyLens, NeurIPS 2024](https://arxiv.org/abs/2409.00138)、[Zhang & Yang, Searching for Privacy Risks via Simulation](https://arxiv.org/abs/2508.10880)、[Li, Agentic LLMs as Powerful Deanonymizers](https://arxiv.org/abs/2601.05918)
- 工具：[FastChat llm_judge](https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge)、[PrivacyLens](https://github.com/SALT-NLP/PrivacyLens)
