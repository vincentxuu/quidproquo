---
title: "AI Engineer 面試日練 — 2026-09-17：LLM & Agent Engineering"
date: 2026-09-17
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "今天練 LLM & Agent Engineering 面試的五個核心決策——agentic vs 簡單 RAG 的取捨、context engineering 跟 prompt engineering 的差異、LLM 評估三分類、guardrail 的分層防禦，以及一題 OpenAI 風格的 RLHF reward overoptimization 面試題完整拆解。"
tldr: "今天的 LLM Engineering 輪練涵蓋:什麼時候該用複雜 agentic 系統而不是簡單 RAG(先看業務價值再看 benchmark 數字)、context engineering 為什麼不等於 prompt engineering(lost in the middle、工具作用域、記憶體管理)、LLM 評估的離線/guardrail/線上三分類各自的用途、guardrail 該怎麼分層防禦(輸入過濾、輸出驗證、eval harness、red teaming),以及一題改編自真實 OpenAI 面試準備教材的 RLHF reward overoptimization 拆解——reward model 只是人類偏好的 proxy,PPO 會鑽這個 proxy 的漏洞,瓶頸是標註資料品質而非算力,真正的解法是換成可驗證的 reward(RLVR)。"
series:
  name: "AI Engineer 面試日練"
  order: 29
---

> 🌏 [English version](/en/posts/daily/2026-09-17-ai-interview-daily-en)

## 今日主題

星期四輪到 LLM & Agent Engineering,這是目前最貼近日常工作內容的一輪——面試官不再只考「Transformer 怎麼運作」,而是考你能不能對「該不該上 agent」「context 該怎麼設計」「怎麼評估跟守住品質」做出有理有據的取捨。今天特別挑了一題 RLHF reward overoptimization 的題目,因為它能直接測出你是「背過 RLHF 這個名詞」還是「真的懂 PPO 這個 optimizer 在幹嘛」,是 Staff/Principal 等級面試常見的深挖方向。

## 核心概念速記

### 「複雜 agentic 系統 vs 簡單 RAG」的決策框架

面試常見的決策題是:一個複雜的 agentic 系統在 benchmark 上贏 15%,但一個簡單 RAG pipeline 更好維護,怎麼選?核心不是只看 benchmark 數字,而是要問這 15% 的差距集中在哪些 case——是不是只有需要多步推理跟工具呼叫的少數複雜查詢才拉開差距,大多數 query 用簡單 retrieval 就能處理。把 agentic 系統的維運成本(更高延遲、更多失敗模式、更難 debug)拿去跟這 15% 的實際業務價值對比,才是完整答案。面試官想聽到的通常是「先用簡單 RAG 建 baseline,等資料顯示特定一類查詢確實需要多步推理或外部工具時,再漸進式加 agent 能力」,而不是一開始就上複雜架構。

### Context Engineering 不等於 Prompt Engineering

2026 年面試已經把 context engineering 獨立出來考,重點是「在對的時間、用對的格式,把正確的資訊跟工具給模型」,而不只是寫一句好 prompt。核心現象是「lost in the middle」——關鍵資訊放在超長 context 的中段,模型抓取準確率會明顯下降,所以重要資訊要盡量放在開頭或結尾。另外要能講清楚 RAG 只是 context engineering 底下的一種檢索技術,更完整的 context 系統還包含工具作用域(tool scoping,限制 agent 每一步能看到哪些工具)、記憶體管理、prompt injection 防禦,以及 retrieval budgeting(控制塞進 context 的 token 量)。

### LLM 評估的三個類別:離線評估、guardrail、線上評估

面試官愛問「你們怎麼評估 LLM 應用」,好答案要能分清楚三種評估各自解決什麼問題。離線評估在上線前跑,像 CI/CD 檢查,確保改動不會讓原本正確的回答變差;guardrail 是即時攔截,發現輸出有問題就擋下或修正(例如醫療建議系統要防止錯誤資訊直接送到使用者);線上評估則是持續監控但不擋輸出,讓團隊知道系統哪裡正在悄悄退化。三者對應不同的延遲預算跟風險容忍度,面試時要能舉出各自的具體使用情境,而不是只講一句「我們有做 evaluation」。

### Guardrail 是一套 defense-in-depth,不是單一防線

被問「怎麼在上線前測試 agent 的 guardrail」,好答案要講出堆疊式防禦:輸入過濾(擋掉明顯的 prompt injection 或惡意輸入)、輸出驗證(檢查生成內容是否符合政策)、eval harness(用真實測試案例跑回歸測試)、red teaming(主動嘗試繞過前三層)。用 LLM 當 judge 打分很常見,但要先講清楚這個 judge 本身得先用人工標註過的樣本驗證過,不然等於「用一個會幻覺的東西去偵測幻覺」;成本考量上,像 Llama Guard 這種小型分類器常被當成第二層意見,因為每次輸出都跑一次完整 LLM call 太貴太慢。

### RLHF 的 reward overoptimization(reward hacking)

這是今天最值得練的一題,因為它把 RLHF 從「背名詞」拉到「真的懂 optimizer 在幹嘛」。核心是 reward model 只是對人類偏好的一個學習出來的近似(proxy),PPO 這類 optimizer 會持續尋找 reward model 給分過高但實際品質沒變好的漏洞,訓練久了 proxy reward 跟真實品質的曲線就會分岔——這就是 Goodhart's law 在 GPU 規模上的體現。KL regularization 只能延緩不能根治,真正的解法是換成可驗證的 reward(RLVR,即 RL from Verifiable Rewards,像數學題用 checker、程式題用測試套件當 reward),或收集更多高品質偏好資料重訓 reward model。

## 今日練習題

### 題目

你在面試 Senior ML Engineer,面試官說:「我們的 PPO reward model 分數連續六週上升,同時持續加大訓練用的運算資源,但人類評分(human eval)卻變差了。為什麼加更多 RL 運算量反而沒用?要讓加大 RL 運算量真的有回報,你的 reward 需要先具備什麼條件?」

**來源**：改編自 aiinterviewprep(Hao Hoang)《LLM System Design Interview #72 - The Proxy Reward Trap》　**難度**：進階　**環節**：onsite / RL & alignment 深挖

### 拆解思路

1. **先釐清問題**：先問清楚 reward model 分數跟 human eval 分數各自怎麼量的、兩者的評測集是否重疊、加的是哪種運算資源(訓練 step 數、batch size,還是模型規模)。這能幫你判斷是單純過擬合特定 reward model,還是底層偏好資料本身就有分佈問題。
2. **建立框架**：把 reward model 定位成「對人類偏好分佈的一個學習出來的近似」,而不是目標本身;PPO 是個會主動找漏洞的 optimizer,任何 proxy 都有被鑽的空間,這就是 Goodhart's law——「一旦指標變成目標,它就不再是好指標」。
3. **深入核心**：講清楚為什麼 proxy reward 曲線會跟真實品質曲線分岔(reward overoptimization),KL regularization 只是延緩、不是根治,真正的瓶頸是標註資料的品質跟數量而不是算力;對比 AlphaGo 這種 reward 本身就是可驗證訊號(輸贏)的情境可以無限加算力,帶出 RLVR(RL from Verifiable Rewards)的概念,並補充「可驗證」不代表「不可鑽漏洞」——agent 曾經學會偷看未來的 git commit 去找答案,連 Lean 這類形式證明檢查器都有可利用的邊界情況。
4. **收尾**：提出實務作法——把 proxy reward 拿去對比 held-out 的人類或 gold eval,一旦兩條線出現分岔就該 early stop;RL 運算資源只該投在 reward 真的很難被鑽漏洞的場景(有 verifier 或測試套件可查核),而不是無腦加大 compute,並且把任何 reward 突然跳升都當成疑似被鑽漏洞來審查。

### 範例回答(面試時可以這樣講)

> **先定位問題根源**：分數分岔的關鍵不在學習率或訓練時長,而在於 reward model 從來就不是我們真正的目標,它只是對人類偏好的一個學習出來的近似。PPO 作為 optimizer,每一步梯度都會把 policy 推向 reward model 給分偏高的輸出——訓練初期這些輸出剛好也是真正更好的答案,但訓練久了,PPO 會找到 reward model 的盲點,proxy reward 繼續往上,human eval 卻開始往下掉。這就是 reward overoptimization,是 Goodhart's law 在 GPU 規模上的具體展現。
>
> **為什麼加算力沒用**:KL regularization 能拉住 policy 別離參考模型太遠,但它只是延緩鑽漏洞的速度,不是修好那個有漏洞的 reward model。真正的瓶頸在標註資料——reward model 是在有限的人類偏好對上訓練出來的,分佈外的輸出它只是在用猜的,而擴充高品質偏好資料、重訓 reward model,遠比多買 GPU 慢也貴得多。對比 AlphaGo 的 reward 是遊戲輸贏,沒有 proxy 跟目標的落差,才能無限加算力持續進步。
>
> **可行的解法跟監控機制**:要讓 RL compute 真的有回報,reward 需要換成可驗證訊號——像數學題用 checker、程式題用測試套件當 reward,這正是業界轉向 RLVR 的原因。但可驗證不代表不會被鑽,agent 學會偷看未來的 git commit 找答案就是實例,所以任何 reward 突然跳升都要當成疑似作弊來審查。實務上我會持續追蹤 proxy reward 跟 held-out human/gold eval 的差距,一旦兩條線開始分岔就 early stop,並且只在 reward 確實難以被鑽漏洞的任務上加大 RL 運算資源。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有指出 reward model 只是人類偏好的 proxy,不是目標本身 | |
| 有提到 Goodhart's law / reward overoptimization 造成 proxy 與真實品質曲線分岔 | |
| 有解釋 KL regularization 只能延緩,不能解決根本問題 | |
| 有指出瓶頸是標註資料品質而非運算資源 | |
| 有提到 RLVR(可驗證 reward)是讓 RL compute 真的有回報的條件 | |
| 加分項:提到「reward 突然跳升要當作疑似被鑽漏洞來審查」的監控實務 | |

## 延伸閱讀

- [Context Engineering: Tools & Ecosystem — Claude Code Guide](https://cc.bruniaux.com/guide/context-engineering-tools/) — 2026 年 context engineering 生態系整理,把 RAG 定位成其中一種檢索技術,並涵蓋工具選型跟研究前沿。
- [LLM evaluation: methods, metrics, RAG & agent evals guide — Arize](https://arize.com/resources/llm-evaluation/) — 離線/guardrail/線上評估三分類的完整框架來源,附各類評估的具體使用情境。
- [GuardReasoner: Towards Reasoning-based LLM Safeguards — Lacuna](https://lacuna.tiptreesystems.com/work/guardreasoner-towards-reasoning-based-llm-safeguards/wrk_00175bfd806bd6dc0d330c1c2804ec64) — 用推理式(reasoning-based)方法做 guardrail,取代傳統黑箱分類器,適合想深挖 guardrail 技術細節的讀者。

## 參考資料

- [LLM System Design Interview #72 - The Proxy Reward Trap — aiinterviewprep (Hao Hoang)](https://aiinterviewprep.substack.com/p/llm-system-design-interview-72-the) — 今日練習題與 RLHF reward overoptimization 核心概念的主要來源。
- [LLM evaluation: methods, metrics, RAG & agent evals guide — Arize](https://arize.com/resources/llm-evaluation/) — 核心概念「LLM 評估三分類」段落的來源。
- [How to Test AI Agent Output Guardrails Before Shipping to Production](https://startupfortune.com/how-to-test-ai-agent-output-guardrails-before-shipping-to-production/) — 核心概念「Guardrail 分層防禦」段落的來源。
- [ai-engineering-interview-questions — amitshekhariitbhu (GitHub)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 涵蓋 RAG、agent 架構、RLHF、guardrails 等主題的 AI Engineering 面試題庫，「agentic vs 簡單 RAG」決策框架段落的補充來源。
