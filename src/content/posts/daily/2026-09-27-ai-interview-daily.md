---
title: "AI Engineer 面試日練 — 2026-09-27：本週回顧與行為面試"
date: 2026-09-27
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：用 STAR 框架講一個『自己主推的排序模型 A/B 測試七天 CTR +8%，後來發現是 novelty effect，你怎麼喊停』的真實情境，並回顧本週從 ML Fundamentals 到 Paper Reading 練了什麼、哪兩天被跳過。"
tldr: "2026 年的 AI Engineer 行為面試很愛問『你曾經很有信心的方案，後來發現是錯的』，考的不是你會不會認錯，而是你怎麼在自己主推的東西被推翻時，用數據而不是情緒去喊停。今天用『排序模型 A/B 測試七天 CTR +8%，你堅持全量上線，後來發現是 novelty effect，怎麼收回這個決定』走一輪完整 STAR，並回顧本週 ML Fundamentals、Deep Learning、Coding、Paper Reading 練了什麼——這週 ML System Design 跟 LLM & Agent Engineering 兩天沒產出，也一併記錄下來。"
series:
  name: "AI Engineer 面試日練"
  order: 39
---

> 🌏 [English version](/en/posts/daily/2026-09-27-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：排序模型 A/B 測試七天 CTR +8%，你堅持全量上線，後來發現是 novelty effect

2026 年的 AI Engineer 行為面試除了「你怎麼推動跨團隊合作」這類通用題，招聘指南裡越來越常直接問「Tell me about a time you were confident in a solution and later realized it was wrong」。這題的評分重點不是「你有沒有犯錯」，因為每個資深工程師都犯過錯；面試官真正在看的是：當你自己力推的方案被數據推翻時，你是先護航還是先驗證，以及你怎麼把「收回決定」講成一次專業判斷，而不是一次難堪的認輸。以下是一個可以直接套用、也可以改編成自己真實經歷的版本。

**情境**：團隊重做了一個電商首頁的商品排序模型，換掉舊的規則式排序，改用學習排序（learning-to-rank）。上線後跑了七天 A/B 測試，treatment 組的點擊率（CTR）比 control 組高 8%，數字看起來很漂亮，PM 想在下週的行銷活動前全量上線。

**任務**：我是這個模型的負責人，也是這次 A/B 測試設計跟結果判讀的人，要決定要不要在活動前全量上線。

**行動**：我一開始也很想直接說「上線」——這是我主推、也是我調了三週的模型，CTR +8% 是很體面的成果。但在寫上線報告前，我照慣例把七天的每日 CTR 拆開來看，而不是只看整體平均：前三天 treatment 組的 CTR 比 control 組高 12%，但第四天開始逐日下滑，到第七天只剩 2%，同時七天內的加購率跟客單價幾乎沒有差異。這個「先高後低」的形狀是 novelty effect 的典型特徵——使用者對新排版的新鮮感消退後，行為會回到原本的偏好。我沒有直接把這個懷疑拿去跟 PM 說「先別上」，而是先把控制組跟處理組的每日趨勢畫成圖，附上「如果趨勢延續，兩週後的預期 CTR 提升會落在 1%–2% 而不是 8%」的推算，再去找 PM 跟工程主管開會。我提議把觀察窗口延長到四週、並且新增一組完全沒看過新排序的 holdout 使用者，用來排除「行銷活動本身」跟「季節性」的干擾；同時建議先讓現有的 treatment 分流維持在 20%，不要為了趕活動而全量放大曝光。

**結果**：延長到四週後，CTR 提升穩定在 1.6%，加購率提升 0.4%（在統計上勉強顯著），跟原本七天推算的 8% 差了一大截；但因為方向依然是正向，模型還是照原計畫上線，只是把「這是一個漸進式優化」寫進了發布說明，而不是包裝成「排序模型帶來 8% 成長」的行銷話術。更重要的是，這次經驗之後，我們團隊把「至少觀察兩個完整的使用者行為週期，並檢查每日趨勢是否收斂」寫進了 A/B 測試的上線檢查清單，後續有兩次類似的排版類實驗因為套用這個檢查清單，提前抓到同樣的 novelty effect 陷阱，省下了大約各一週的重新驗證時間。

如果我當時只看七天的整體平均就直接寫報告，這個決定大概會被「活動前上線」的時程壓力推著走——這也是我現在看任何短期 A/B 測試結果時的原則：漂亮的整體數字如果沒拆開看逐日趨勢，很可能只是在測「新鮮感」，不是在測「真正的偏好改變」。

### 怎麼講這個故事

- **Do**：先講你怎麼主動懷疑自己力推的方案，而不是等別人質疑才回頭檢查——面試官在意的是你有沒有內建的自我驗證習慣，不是你多快認錯。
- **Do**：用具體數字撐住每個轉折（12% → 2% 的逐日下滑、四週後穩定在 1.6%），尤其是「原本看起來多好」跟「後來實際多少」這兩個數字都要有，落差本身就是故事的說服力。
- **Do**：清楚講出你怎麼在「不完全否定方案、但收回誇大的預期」之間找到平衡——這比「全部推翻重做」或「硬撐原本的結論」更接近真實世界的決策。
- **Don't**：不要把這個故事講成「我早就知道會這樣」的事後諸葛，重點是你當下用了什麼方法（拆逐日趨勢、加 holdout 組）去驗證懷疑，而不是你的直覺有多準。
- **Don't**：不要漏掉「這件事之後變成團隊的檢查清單」這一段，這是把一次性的個案經驗轉成系統性影響力的關鍵，缺了就只是一次普通的除錯故事。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | 用學習曲線判斷偏差變異取捨、L1/L2 正則化怎麼往 loss function 加懲罰項、批次梯度下降跟隨機梯度下降的取捨、不平衡資料為什麼準確率會騙人、交叉驗證中最容易忽略的資料洩漏陷阱；練習題改編自 Transunion 真實面試題 | （讀者自填） |
| Tue | Deep Learning & NLP | self-attention 的 Query/Key/Value 機制、positional encoding 為什麼必要、子詞切法（BPE/WordPiece）怎麼解決 OOV、fine-tuning 跟 RAG 怎麼二選一、embeddings 怎麼表示語意相似度；練習題來自 Google agentic AI engineer 面試指南 | （讀者自填） |
| Wed | ML System Design | 本週未產出 | 待補（可調高 `system-design` 權重） |
| Thu | LLM & Agent Engineering | 本週未產出 | 待補（可調高 `llm-engineering` 權重） |
| Fri | Coding | Anthropic 高頻考題：單 GPU inference batching scheduler，dynamic batching 的 batch size / 等待時間兩個觸發條件、依序列長度分桶、continuous batching 跟 PagedAttention 怎麼解決固定批次浪費、backpressure 維持有界尾端延遲 | （讀者自填） |
| Sat | Paper Reading | 精讀 arXiv 新論文《When Can Agents Forget Their Reasoning?》，拆解 ICLR 方法怎麼用 frozen proxy entropy 排序可丟棄的歷史推理、trajectory amplification 這個非線性效應、「有沒有被外部化成 code/file/tool output」的遺忘判準，並對照 Claude Code、Deep Agents 的 compaction 機制 | （讀者自填） |
| Sun | Behavioral | 排序模型 A/B 測試七天 CTR +8%，因 novelty effect 收回全量上線的樂觀預期，練用逐日趨勢跟 holdout 組把「懷疑」變成可驗證的證據 | （讀者自填） |

這週有兩天（週三 ML System Design、週四 LLM & Agent Engineering）沒有產出文章，如果你剛好也在準備這兩個主題的面試，這是本週唯一的缺口，值得優先補。今天的行為面試故事跟週五 Coding 的 batching scheduler 其實共享同一種判斷方式——兩者都是先看「整體數字好不好看」，再拆開看「細部趨勢有沒有騙人」，這種拆解習慣在系統設計、程式實作、行為面試三種環節都會被考。

## 下週預告

下週主題輪替不變，一樣是週一 ML Fundamentals 到週日 Behavioral 的固定順序，但每天搜尋到的面試題與延伸閱讀會換新。這週 ML System Design 跟 LLM & Agent Engineering 剛好都沒產出，如果你也想在固定排程之外提前補這兩個主題，可以把 `src/data/interview-focus.json` 裡 `system-design` 跟 `llm-engineering` 的權重調到 2-3，讓 routine 有機會在非固定日額外加練——尤其是 LLM & Agent Engineering，這週 Paper Reading 裡的 context compression 概念跟 Agent 的 guardrail 設計高度相關，補起來會比單獨練更有效率。

## 參考資料

- [40 Behavioral Interview Questions + STAR Answers (2026)](https://owlapply.com/en/blog/behavioral-interview-questions-star-method) — 對應「故事框架」的 STAR 結構要求：Action 段落要有具體決策細節、Result 要有可量化的數字
- [AI Agent Engineer Interview Questions 2026 - KORE1](https://www.kore1.com/ai-agent-engineer-interview-questions/) — 對應「下週預告」中 LLM & Agent Engineering 主題的權重建議，文中討論 OWASP Top 10 for LLM Applications 的 Excessive Agency 風險，跟上上週行為面試故事的授權層設計呼應
- [AI/ML Engineer Jobs in 2026: What Employers Want Right Now](https://consultadd.com/blog/ai-ml-engineer-jobs-roles-skills-pay-and-how-to-get-hired) — 對應「本週回顧」中面試迴圈涵蓋 coding、ML fundamentals、system design、behavioral 四個環節的分布
- [6 Best AI Interview Coaches for Behavioral Interview Questions (2026)](https://goodmenproject.com/technology/6-best-ai-interview-coaches-for-behavioral-interview-questions/) — 對應「怎麼講這個故事」中面試官評分依據「過去行為預測未來行為」的原則
- [Machine Learning System Design Interview – Framework, Examples and Common Questions](https://www.dataexpertise.in/machine-learning-system-design-interview-framework-examples/) — 對應「本週回顧」中 ML System Design 未產出部分，提供 RADIO 框架作為補課參考
