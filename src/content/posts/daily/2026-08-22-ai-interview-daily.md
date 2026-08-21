---
title: "AI Engineer 面試日練 — 2026-08-22：Paper Reading（論文精讀）"
date: 2026-08-22
category: daily
tags: [ai-engineer-interview, daily, paper-reading]
lang: zh-TW
description: "今天精讀一篇剛掛上 arXiv 的長程 agent harness 論文 OneDayAgent，練習面試官最愛問的『你會怎麼追問這篇論文』。"
tldr: "Paper reading round 考的不是你有沒有把論文讀完，而是你能不能像親自做過這個研究一樣，講出關鍵設計選擇背後的 trade-off、指出實驗設計的漏洞，並預測下一步該怎麼做。今天用剛發表的 OneDayAgent（長程 agent harness，2026-08-04 掛上 arXiv）當練習素材，拆解 task decomposition、context 壓縮、verify-repair 三個核心機制，並完整跑一輪典型的論文追問。"
series:
  name: "AI Engineer 面試日練"
  order: 3
---

## 今日主題

Paper reading round 是 research-adjacent AI Engineer 職位的標配關卡，尤其在 frontier lab（Anthropic、OpenAI、DeepMind）更常見。這關不考記憶力，考的是「研究品味」：你能不能在有限時間內抓到一篇論文真正的貢獻、看穿實驗設計裡沒說出口的限制，並針對「如果換成你會怎麼做」給出有信服力的答案。今天練這個能直接對應到 onsite 裡的 research discussion 環節，也是判斷候選人能不能跟研究團隊對話的關鍵一關。

## 核心概念速記

### Long-horizon harness 的三支柱

長程 agent 任務會遇到三種典型失敗模式：目標漂移（goal drift）、狀態遺失（state loss）、context 爆量。今天的論文主張用一個 harness 同時處理三件事：task decomposition（把開放式請求拆成有邊界的子任務）、execution memory（在 context 壓力下維持執行記憶）、verify-repair（產出結果後驗證並修補缺陷）。面試時要能一句話講清楚：這不是三個獨立技巧的拼裝，而是同一個執行迴圈裡的三個檢查點。

### Context 壓縮不是丟資訊，是做 checkpoint

面對長任務時，把整個對話歷史塞進 context 不可行。這篇論文的作法是對子任務做 checkpoint，只保留完成子任務所需的壓縮觀察結果，而不是無差別截斷。面試官會追問：你怎麼決定哪些資訊該留、哪些該丟？答案要能講到「以子任務邊界為單位做壓縮」，而不是籠統地說「用 summarization」。

### Harness 與 backend 解耦，但 execution style 不會跟著解耦

論文的核心賣點是同一套 harness 換五個不同家族的 backend model 都能跑，分數介於 0.613 到 0.821 之間，證明架構設計本身有價值、不需要為特定模型客製化。但分數區間夠大，代表換 backend 不是「即插即用」——不同模型的 tool-call 頻率、repair 次數、latency 都不同。這是面試時最容易被忽略、但最能展現 production 思維的細節。

### Benchmark 的評分維度決定了你能不能相信這個數字

這篇論文用 AgentIF-OneDay（104 個任務）當評測集，橫跨 task type、domain、rubric dimension、input-attachment 四個切面全面領先。面試官常問：一個 benchmark 數字要多細緻才算可信？答案是要看它有沒有跨切面都領先，而不是只在總分上贏。

### 論文自己承認的限制，往往比結果更值得討論

這篇論文在結論裡誠實寫出兩個限制：目前實作沒有 workspace isolation（安全考量待補），以及結論只在單一 benchmark 上驗證，尚待更多基準檢驗。面試時主動指出這些限制，比複述摘要更能證明你真的讀懂了論文，而不是在背關鍵字。

## 今日練習題

### 題目

面試官給你 OneDayAgent 這篇論文的摘要和一張結果表（顯示同一套 harness 換五個 backend、分數從 0.613 到 0.821），讓你讀 15 分鐘後回答三件事：這篇論文的核心貢獻是什麼？如果要在你自己的 agent 產品裡實作類似機制，你會怎麼取捨？你認為這個實驗設計最大的漏洞在哪裡？

**來源**：自擬（改編自 frontier lab research round 常見的論文追問模式）　**難度**：進階　**環節**：paper discussion / research round

### 拆解思路

1. **先釐清問題**：面試官要的是 summarize 還是 critique？我只能看摘要跟一張表，還是有全文可查？如果要應用到 production，現有系統的 latency 和 cost budget 是什麼？
2. **建立框架**：用「claim → evidence → limitation」三層分析法逐步拆解——論文主張什麼、拿什麼證據支撐、證據覆蓋不到的地方在哪。
3. **深入核心**：技術上最關鍵的 trade-off 是 harness-model 解耦帶來的可攜性，換來的代價是 execution style 的變異——不同 backend 的 tool-call 次數、repair 率、latency 都不一樣，production 部署換模型不能只換 API endpoint。
4. **收尾**：提出一個可驗證的下一步（例如：哪個 backend 的 repair rate 最高、為什麼），而不是重複論文已經講過的結論，這樣面試官會記得你不是在背答案。

### 範例回答（面試時可以這樣講）

> **先講 claim**：OneDayAgent 主張單一 harness 可以同時處理 task decomposition、context 壓縮和 verify-repair 三件事，不需要為特定 backend 客製化。在 AgentIF-OneDay 這個 104 任務的 benchmark 上，用 GLM-5.2 當 backend 拿到 0.821 的新 SOTA，換五個不同家族的 backend 分數落在 0.613 到 0.821 之間，都是有意義的成績而不是崩潰。
>
> **再講我會怎麼判斷可信度**：這個 0.613 到 0.821 的分數區間本身就是最有意思的訊號——它證明 harness 解耦確實有效，但也同時說明「換 backend」不是免費的午餐。不同 backend 的 execution style，包括 tool-call 次數、repair 次數、latency，差異很大，這代表 production 部署時光換模型不夠，還要重新校準 latency budget 和 retry 策略。
>
> **最後講我會怎麼追問／驗證**：我會想知道 verify-repair 的 repair rate 在哪個 backend 最高，是不是代表某些模型的 tool-call 格式本來就比較不穩定；另外整篇論文只在一個 benchmark 上驗證，而且作者自己在結論坦承目前實作沒有 workspace isolation，我會直接問這在正式上線前是不是 blocker，而不是把它當成後記裡輕描淡寫的一句話帶過。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有沒有清楚複述論文核心 claim，而不是逐字背摘要 | |
| 有沒有指出至少一個實驗設計或方法論上的限制 | |
| 有沒有把論文結論連結回實際 production 場景的取捨 | |
| 有沒有主動指出「這篇論文還沒回答什麼」 | |
| 有沒有提出一個可驗證的下一步追問或實驗 | |
| 加分項：有沒有連結到其他相關工作（如記憶管理、verify-repair 相關研究）做比較 | |

## 延伸閱讀

- [Attention — Paper-to-Code Mock Interview](https://primer.edge.bond/papers/attention-mock-interview/) — 示範怎麼把任何一篇論文轉成 45 分鐘的 mock interview 流程：讀論文、口頭講出核心 benefit、動手實作核心機制、最後 sanity-check，這套流程可以套用在今天的 OneDayAgent 上自己練一輪。
- [AI Career Advice for OpenAI, Anthropic & DeepMind Roles](https://www.sundeepteki.org/advice.html) — 解釋 paper discussion round 到底在考什麼：面試官已經讀過論文，真正在評估的是你的研究品味，而不是複述能力。

## 參考資料

- [OneDayAgent: Towards a Long-Horizon Harness for Autonomous Agents](https://arxiv.org/abs/2608.05013v1) — 今日練習題的核心論文，對應「核心概念速記」與「今日練習題」全文引用的機制與數據
- [AI Career Advice for OpenAI, Anthropic & DeepMind Roles](https://www.sundeepteki.org/advice.html) — 對應「拆解思路」中 paper discussion round 的準備方法論
