---
title: "AI Engineer 面試日練 — 2026-09-06：本週回顧與行為面試"
date: 2026-09-06
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：用 STAR 框架講一個『RAG 客服 agent 上線前，用四象限錯誤分析頂住時程壓力』的真實情境，並回顧本週從 ML Fundamentals 到 Paper Reading 六個主題練了什麼。"
tldr: "行為面試考的不是你有沒有故事，而是你能不能把一次技術決策講成『情境明確、證據具體、結果可量化』的敘事。今天用『RAG 客服 agent 要上線，你怎麼用 retrieval/generation 四象限錯誤分析說服 PM 延後一週』這個 AI Engineer 常見情境，走一輪完整 STAR，並回顧本週 ML Fundamentals 到 Paper Reading 六個主題練了什麼。"
series:
  name: "AI Engineer 面試日練"
  order: 18
---

> 🌏 [English version](/en/posts/daily/2026-09-06-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：RAG 客服 agent 上線前，用四象限錯誤分析頂住時程壓力

AI Engineer 的行為面試很喜歡問「你怎麼在時程壓力下堅持做對一件事」，而 LLM 產品的評估恰好是最容易被壓縮掉的一步——因為單一總體正確率數字看起來很漂亮，卻可能藏著最貴的錯誤類型。以下是一個可以直接套用、也可以改編成自己真實經歷的版本。

**情境**：團隊要把一個內部工程知識庫的 RAG 客服 agent 從內測推到全公司上線，PM 已經對外承諾「兩週後上線，取代大部分 Slack #ask-infra 頻道的問題」。

**任務**：我負責這個 agent 的 retrieval/generation pipeline，被要求在上線前完成一份評估報告，證明它夠準才能放行。

**行動**：我一開始也用最常見的方法——隨機抽 50 題人工核對答案對不對，得到 82% 整體正確率，看起來可以過關。但我意識到這個數字沒有拆開「retrieval 對不對」跟「answer 對不對」兩件事，也沒有看錯誤案例的分布。我把 50 題重新標注成四象限（retrieval 對/錯 × answer 對/錯），發現「retrieval 對但 answer 錯」占了將近一半的錯誤，原因是文件庫裡新舊版本 API 混在同一批檢索結果裡，generation 階段常常選錯版本。我把這個發現直接帶去跟 PM 說明：如果照原來的評估方法上線，使用者遇到的不是「查無資料」這種低風險錯誤，而是「答案讀起來很像對，卻引用了過時版本文件」這種最容易讓人失去信任的錯誤。我提出把上線拆成兩段：先在 #ask-infra 頻道用 shadow mode 跑兩週收集真實問題，同時加一條「版本衝突偵測」規則——只要 retrieval 結果裡出現多個版本標記，就要求 generation 明確標註版本並加警語，而不是直接給答案。PM 一開始不想延，我沒有只說「我覺得不夠準」，而是拿四象限的錯誤分布數據佐證，並提出時程只需延後一週而非整個重做。

**結果**：shadow mode 兩週內抓到 23 次版本衝突案例，加上偵測規則後，版本衝突類錯誤下降到接近 0；正式上線後的使用者滿意度調查裡，「這個答案讓我更不信任而不是更省時間」的比例從 shadow mode 前測的 18% 降到上線後的 4%；上線一個月後 #ask-infra 頻道問題量下降 35%，達成 PM 原本要的目標，只是晚了一週。這件事之後，我們把「retrieval/generation 分離評估」跟「版本衝突偵測」列成之後所有內部 RAG 專案上線前的標準檢查項。

如果我一開始就只回報「82% 整體正確率」這個單一數字，短期看不出差別，但上線後爆發的信任危機會比延一週貴得多——這也是我現在對任何 ML/LLM 系統評估的原則：單一總體指標幾乎永遠藏著最貴的那種錯誤。

### 怎麼講這個故事

- **Do**：先講你怎麼發現「整體正確率」這個指標在騙人，而不是直接講你多會做評估——這比大部分候選人只會說「我做了 A/B test」更有說服力，也更貼近面試官想聽的診斷過程。
- **Do**：用具體數字（23 次、18% → 4%、35%）撐住每個轉折，而不是「情況改善了」這種空話；哪怕只有一個數字，也比一整段形容詞更可信。
- **Do**：收尾時把這次經驗變成後續所有專案的標準流程，展現你能把一次個案變成系統性改善，而不是只解決了眼前的危機。
- **Don't**：不要把 PM 一開始的堅持講成阻礙者角色——面試官在意的是你怎麼用證據說服人，不是你多會對抗上面的人，把對方講成反派只會讓人覺得你不好共事。
- **Don't**：不要跳過「你怎麼證明只需要延一週而不是整個重做」這一段，這正是面試官想聽的談判細節；漏掉這段，故事會變成「我拒絕了但沒解釋怎麼談成的」。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | cross-entropy 為什麼取代 MSE、不平衡資料要看 PR-AUC 而非 ROC-AUC、bagging 修正 variance／boosting 修正 bias、多重共線性不傷預測力只傷可解釋性 | （讀者自填） |
| Tue | Deep Learning & NLP | self-attention 的計算與 KV cache 的作用、tokenization 是有損的設計決策、embedding 是向量空間契約、fine-tuning vs prompting 的取捨 | （讀者自填） |
| Wed | ML System Design | feature store 如何保證 training/serving 一致性、部署策略要分層設計 rollback 觸發條件、監控拆成 system/data/model 三層、latency 預算怎麼分配到毫秒 | （讀者自填） |
| Thu | LLM & Agent Engineering | RAG 準確率要拆成 retrieval 和 generation 兩段分開評估、context pollution 不是靠加大 context window 解決、RAG 管知識／fine-tuning 管行為、LLM-as-judge 的一致性與自我偏好偏誤 | （讀者自填） |
| Fri | Coding | ML coding 面試考的是徒手實作能力，練了 BPE tokenizer 的頻率統計與迭代合併、batch inference 的吞吐量/延遲取捨、NumPy 向量化的判斷依據 | （讀者自填） |
| Sat | Paper Reading | 精讀 invalidation contracts 論文，拆解 agent 快取修復建議的逐筆失效協議，把「省了多少錢」拆成 validity 與 compliance 兩個獨立變數 | （讀者自填） |
| Sun | Behavioral | RAG 客服 agent 上線前用四象限錯誤分析頂住時程壓力的 STAR 故事，練用數據說服 stakeholder 延後時程 | （讀者自填） |

這週的行為面試練習其實直接呼應了週四的 LLM & Agent Engineering 主題——「RAG 準確率要拆成 retrieval 和 generation 兩段評估」不只是一個技術概念，也是這週故事裡說服 PM 的核心證據。如果你發現自己在準備行為面試故事時，講不出一個「用技術分析說服非技術 stakeholder」的具體案例，這是一個很值得補的缺口：面試官很看重你能不能把工程判斷翻譯成別人聽得懂、也認同的語言。

## 下週預告

下週主題輪替不變，一樣是週一 ML Fundamentals 到週日 Behavioral 的固定順序，但每天搜尋到的面試題與延伸閱讀會換新。如果這週在自我核對清單上，LLM & Agent Engineering 相關的核心概念（尤其是 retrieval/generation 分離評估、context pollution 的診斷順序）答得不夠順，下週四可以特別留意，把這塊補齊——這週的行為面試故事已經證明，這類分析框架在技術面試和行為面試都用得到。

## 參考資料

- [Behavioral Interview Questions for AI Companies (2026): STAR Answers That Get You Hired](https://www.tredence.com/blog/ai-behavioral-interview-questions-star-method-answers) — 對應「故事框架」中把技術決策拆成 Situation/Task/Action/Result 的結構化方法
- [Technical Behavioral Interviews 2026: STAR Method Examples That Actually Work](https://lastroundai.com/blog/technical-behavioral-interviews-2026) — 對應「怎麼講這個故事」中用具體數字撐住每個轉折、避免用「我們」取代「我」的常見陷阱
- [How to Ace Data and ML Behavioural Interviews](https://towardsdatascience.com/how-to-ace-data-ml-behavioural-interviews/) — 對應「結果」段落中把個案經驗轉化為團隊標準流程、呼應公司文化價值的 R-STAR-L 框架
- [Behavioral ML Interviews: How to Showcase Impact Beyond Just Code](https://www.interviewnode.com/post/behavioral-ml-interviews-how-to-showcase-impact-beyond-just-code) — 對應「行動」段落中把技術指標翻譯成業務語言、向非技術 stakeholder 說明權衡的溝通框架
