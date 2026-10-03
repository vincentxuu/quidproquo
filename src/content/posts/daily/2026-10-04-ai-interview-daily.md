---
title: "AI Engineer 面試日練 — 2026-10-04：本週回顧與行為面試"
date: 2026-10-04
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：用 STAR 框架講一個『RAG 問答系統上線後答不對 PDF 表格裡的數字，你怎麼從整體準確率看不出問題，一路挖到表格被切 chunk 切壞』的真實情境，並回顧本週從 ML Fundamentals 到 Paper Reading 七天全數產出、沒有缺口的完整一週。"
tldr: "招聘指南把『Tell me about an LLM feature that failed』列成 LLM 工程師行為面試的固定題，考的不是你會不會修 bug，而是你怎麼從一個被平均數字蓋住的失敗裡，用切片資料挖出真正的根因、量化改善幅度，再把修法變成團隊的系統性檢查項目。今天用『RAG 內部知識庫問答對含表格的 PDF 答錯，整體準確率看起來還好，拆開表格類問題才發現只有 32% 正確率』走一輪完整 STAR，並回顧本週 ML Fundamentals、Deep Learning、ML System Design、LLM & Agent Engineering、Coding、Paper Reading 六天的練習重點——這週七天全數產出，沒有缺口。"
series:
  name: "AI Engineer 面試日練"
  order: 46
---

> 🌏 [English version](/en/posts/daily/2026-10-04-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：RAG 問答系統上線後答不對 PDF 表格裡的數字，整體準確率卻看不出問題

2026 年的 LLM 工程師面試指南把「Tell me about an LLM feature that failed」列成行為面試的固定題型，而且特別強調「具體的失敗故事比完美的故事更讓面試官記得住」——像是「我們的檢索漏掉了 PDF 裡的表格，所以我們加了表格解析器和一組表格問題的測試集」這種句子，遠比一個毫無瑕疵的敘事更有說服力。這題考的核心是：當一個功能在生產環境裡出包，你是先看整體指標說「好像還好」，還是會主動拆資料去找被平均數字蓋住的真相。以下是一個可以直接套用、也可以改編成自己真實經歷的版本。

**情境**：團隊做了一個跑在內部 Slack 上的知識庫問答 Agent，用 RAG 串接公司內部文件（產品規格、財務報表、定價手冊），上線兩週後開始收到使用者反應：問到文件裡表格內的具體數字（像某產品的定價分級、季度營收拆分）時，回答經常答非所問或引錯數字，但問純文字段落的問題準確率一直很高。

**任務**：我是這個 RAG pipeline 的負責人，要在不影響既有文字問答準確率的前提下，找出並修掉這個只在「問表格」時才會出現的系統性問題。

**行動**：我沒有急著改程式，而是先把整體對話準確率拉出來看——81%，數字其實不差，如果只看這個整體指標很容易判斷「沒什麼大問題」。但使用者反應都指向表格，所以我抽樣了最近兩週的 retrieval log，把答錯的案例一個個拉出來看被檢索到的 chunk 內容。結果發現問題根本不在生成階段：很多錯誤案例裡，被檢索回來的 chunk 壓根不包含正確的表格數字，說明是檢索階段就沒撈到對的內容。再往回查文件轉文字的流程，發現用的是通用 PDF 解析器，把表格打散成一行行沒有欄位對齊的純文字，而切 chunk 的邏輯是按固定 token 數切、不管語意邊界，經常把同一張表切成兩三個不完整片段，向量化之後這些片段的語意跟使用者實際在問的表格內容已經對不太起來。我把修法分成兩塊：加一個表格偵測步驟，把 PDF 裡偵測到的表格區域轉成 Markdown 格式保留列欄結構，並且把每張表格當成一個不可切割的 chunk 單位，附上頁碼跟表名當 metadata。另外因為表格類問題在全部問題裡佔比不高，光看整體準確率的變化根本感覺不出改善幅度，所以我額外從歷史使用者問題裡挑出 50 條明確涉及表格數值的問題，人工標出正確答案，做成一組專門的「表格問答」回歸測試集，上線前拿舊 pipeline 跟新 pipeline 在這 50 條上各跑一次做對比。

**結果**：新 pipeline 在這 50 條表格測試集上的準確率從 32% 提升到 89%，但整體對話準確率因為表格問題佔比不高，只從 81% 微升到 86%——如果我當初只看整體數字，大概率會覺得「這個修法好像沒什麼用」而放棄。這次經驗之後，我把「表格 chunk 不可分割、保留結構化格式」寫進了團隊的文件 ingestion checklist，後續每次加入新的文件來源，都會先跑一次表格偵測確認沒有同樣的問題。

如果我當時只看整體對話準確率就結案,這個問題大概會一直被「數字看起來還好」蓋住——這也是我現在評估任何功能改動時的習慣:先確認你在看的指標切片夠不夠細,再判斷「有沒有問題」或「有沒有改善」,整體平均數字在樣本不均勻的時候很容易騙人。

### 怎麼講這個故事

- **Do**：先講你怎麼從一個「整體數字看起來還好」的假象裡,主動懷疑並拆資料找根因——面試官在意的是你有沒有「不信任平均數」的習慣,不是你多快修好 bug。
- **Do**：用具體數字撐住每個轉折（整體 81%、表格切片 32%、修完後表格切片 89%、整體微升到 86%）,尤其要講清楚「整體指標幾乎沒變化」這件事本身,這正是故事裡最容易被忽略、卻最有說服力的細節。
- **Do**：講清楚你怎麼決定「要不要為了一個佔比不高的失敗模式專門建一組測試集」——這是在展示判斷力,不是只展示 debug 能力。
- **Don't**：不要把這個故事講成單純的技術除錯流水帳,重點是「你怎麼發現指標在騙你」跟「你怎麼量化一個被稀釋的改善」,少了這兩段就只是一次普通的修 bug 經歷。
- **Don't**：不要講超過兩分鐘,招聘指南普遍建議 STAR 故事要控制在兩分鐘內、按 Situation→Task→Action→Result 的順序講完,拖得太長反而讓面試官抓不到重點。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | bagging 跟 boosting 分別在打誰的主意（variance vs bias）、boosting 輪數過多為什麼會 overfit 但 random forest 不會、XGBoost 靠梯度加 Hessian 二階近似跟內建正則化橫掃表格資料、標準化跟正規化該看演算法假設不是看資料本身、AdamW 的設計動機 | （讀者自填） |
| Tue | Deep Learning & NLP | scaled dot-product attention 為什麼靠一次 batched matmul 就能在 GPU 平行化、多頭注意力把嵌入維度切成多個子空間各學不同關係、positional encoding 為什麼是 Transformer 去遞迴化之後必須補回的資訊、CNN 局部性假設跟 RNN 遞迴假設的取捨 | （讀者自填） |
| Wed | ML System Design | 資料飄移跟概念飄移是兩種完全不同的壞法,要用不同偵測跟修復手段;監控要疊四層（特徵分布、預測分布、延遲標籤的效能指標、業務指標）才不會等營收掉了才發現模型早就壞了 | （讀者自填） |
| Thu | LLM & Agent Engineering | 換個角度不重複 RAG vs Agent 決策框架,聚焦 agent 跑起來之後最容易出包的 infinite loop、選錯工具、參數格式錯三種失敗模式怎麼分開防,以及光靠 max_turns 不夠需要額外的 termination 判準 | （讀者自填） |
| Fri | Coding | 不重複前幾週練熟的 batching scheduler 跟 tokenizer,改手刻一個吃 logits、temperature、top_k、top_p 四參數的 sample_token 函式,核心是 softmax 數值穩定性（exp 前先減最大值避免 overflow） | （讀者自填） |
| Sat | Paper Reading | 精讀 arXiv:2609.37658《EnterpriseBench》,拆解靜態 QA 分數跟互動決策表現是兩套不能互相預測的排名、沒有任何 agent 方法在所有任務跟 backbone 下都是贏家、LLM-as-judge 要分三層驗證信度 | （讀者自填） |
| Sun | Behavioral | RAG 問答系統對 PDF 表格數字答錯,整體準確率 81% 看不出問題,拆出表格切片才發現只有 32%,練用根因追查跟專門測試集把「被平均數字蓋住的失敗」變成可量化的改善 | （讀者自填） |

這週七天主題全數依照固定排程產出,沒有缺口——跟上週三、四兩天（ML System Design、LLM & Agent Engineering）沒產出的狀況不同,如果你是跟著這個系列固定複習,這週是補齊完整七個主題的好機會。今天的行為面試故事跟週三 ML System Design 的「監控要疊四層」其實是同一種判斷:兩者都在講「單一整體指標會騙人,你必須往下拆一層才看得到真正的問題」,這種拆解習慣在系統設計跟行為面試兩種環節都會被考。

## 下週預告

下週主題輪替不變,一樣是週一 ML Fundamentals 到週日 Behavioral 的固定順序,但每天搜尋到的面試題與延伸閱讀會換新。這週七天全數產出沒有缺口,如果你想針對性加練某個主題,可以把 `src/data/interview-focus.json` 裡對應主題的權重調到 2-3,讓 routine 有機會在非固定日額外加練——例如今天的行為面試故事牽涉到 RAG 的 ingestion 跟 chunk 設計,剛好跟週四 LLM & Agent Engineering、週五 Coding 的內容互相呼應,如果這塊是弱項,調高 `llm-engineering` 權重會比單獨練更有效率。

## 參考資料

- [LLM interview questions: 25 you'll actually face in 2026 — Consultadd](https://consultadd.com/blog/llm-interview-questions-25-youll-actually-face) — 對應「本週行為面試練習」故事框架的出處：第 24 題「Tell me about an LLM feature that failed」直接以「檢索漏掉 PDF 表格、加表格解析器跟測試集」當範例
- [Machine Learning Engineer Interview Preparation Guide — Mocklingo](https://mocklingo.com/blogs/machine-learning-engineer-interview-preparation-guide-a-complete-roadmap-for-2026) — 對應「怎麼講這個故事」中 STAR 故事要控制在兩分鐘內、避免 rambling 的建議
- [Top Machine Learning Interview Questions and Answers — Simplilearn](https://www.simplilearn.com/tutorials/machine-learning-tutorial/machine-learning-interview-questions) — 對應「怎麼講這個故事」中「選真實案例、按決策而非戲劇性敘事來組織」的行為面試作答原則
- [Amazon Behavioral Interview Questions (+ answers, method) — IGotAnOffer](https://igotanoffer.com/blogs/tech/amazon-behavioral-interview) — 對應「本週回顧」中行為面試評分依「過去行為預測未來行為」的通則，以及故事要具體到可核實的細節
