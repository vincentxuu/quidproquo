---
title: "CS224N 第 1 講：NLP 的四次典範轉移"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, nlp, stanford, deep-learning]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 2
tldr: "Winter 2026 第 1 講用四個時代整理 NLP：早期探索、符號系統、統計機器學習、深度與自監督學習；重點不是背年表，而是看每個時代如何重新定義語言問題。"
description: "逐段讀 Stanford CS224N Winter 2026 Lecture 1，整理課程目標、NLP 四個歷史時代，以及公開材料的限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-history-nlp-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 1 講 **History of NLP** 排在 2026 年 1 月 6 日，但未列講者；本文因此只歸因於 course staff，並依[課程介紹投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-intro.pdf)與[歷史投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-history.pdf)重建公開 agenda。這堂課先說清楚整季要學什麼，再用一條時間軸回答：今天的大型語言模型是從哪些不同的研究假設長出來的？

## 課程要把你帶到哪裡

[Human Language Understanding & Reasoning](https://www.amacad.org/publication/daedalus/human-language-understanding-reasoning)補充了課程對理解與推理的界線。介紹投影片列出三個目標：現代 NLP 的方法基礎、理解人類語言本身的困難，以及建立問答、RAG、工具使用與 LLM 評估等語言系統。

這個次序很重要：CS224N 並不是「LLM 工具課」。它把今天常見的系統放在表示、學習與評估的長鏈條末端。後面每講看似換題，其實都在補這條鏈上的一個環節。

## 四個時代，不是四組互斥的方法

歷史投影片把 NLP 分成四段：1940–1969 的早期探索、1970–1992 的手工符號系統、1993–2012 的統計與監督式機器學習，以及 2013 至今的深度學習、自監督學習與強化學習。

早期故事從機器翻譯開始。Warren Weaver 把翻譯類比為解碼，代表一種工程式樂觀；Norbert Wiener 則質疑不同語言的語意邊界是否容許機械化處理。這個張力沒有消失：我們一直在問語言究竟是可被形式化的規則、可由資料估計的分布，還是必須結合世界知識的推理活動。

符號時代把知識寫成詞典、文法與規則。它的優點是結構明確、錯誤可以追查，代價是涵蓋率仰賴人工。統計時代改從語料估計機率，讓系統能從例子泛化，但也把資料選擇與標註偏差帶進模型。深度學習再把人工特徵換成學得的表示；自監督學習則把大量未標註文字變成訓練訊號。

四個時代不是「新方法把舊方法證明為錯」。今天的模型仍使用 tokenization、搜尋、外部工具與結構化約束；真正改變的是研究者願意把多少知識寫進系統，以及多少交給資料與最佳化學出來。

## 這堂課留下的閱讀方法

讀後續講次時，可以固定問三個問題：系統如何表示語言？訓練訊號從哪裡來？模型不知道或做不到時，誰補上缺口？Lecture 2 的詞向量會先回答第一題；Lecture 3 的反向傳播回答參數如何學；到 Transformer、預訓練與 RAG，三題會反覆出現。

## 早期探索：翻譯、資訊理論與神經網路還沒有分家

歷史投影片把機器翻譯放在 NLP 起點，不是因為翻譯最容易，而是它很早就把「符號如何跨系統保存意義」變成工程問題。Weaver 的解碼類比借用戰時密碼分析的成功：如果俄文只是被另一套符號編碼的英文，統計規律也許足以找回原文。Wiener 的反駁則指出，詞義邊界不像密碼字母一樣固定。兩人其實預告了往後七十年的主線：可從形式或分布恢復多少資訊，又有哪些內容必須依靠語境與世界知識？

同一時期，McCulloch 與 Pitts 用簡化神經元描述邏輯計算，Dartmouth workshop 把 artificial intelligence 變成研究計畫。投影片刻意把 machine translation、AI 與 neural networks 並排，因為當時它們不是今天課程分類裡互不相干的欄位。語言既是人工智慧的測試場，也是資訊與計算理論可以落地的對象。

這段歷史最值得保留的不是誰先發明哪個名詞，而是早期假設的尺度。研究者常把完整翻譯、理解或對話當成單一系統問題；後來方法則逐步拆成 tokenization、parsing、representation、generation 與 evaluation。當今天的 foundation model 又把許多任務收回同一模型時，那個早期問題重新出現：共同介面帶來泛化，還是把不同失敗藏在一個流暢輸出後面？

## 符號 NLP：把語言知識寫成可以檢查的結構

1970–1992 的手工系統建立 lexicon、grammar、semantic representation 與 rule。若句法分析失敗，開發者能檢查是哪條 production rule 沒涵蓋；若詞義不對，可以追到詞典 entry。這種可追蹤性仍是今天知識圖譜、parser、compiler-like constraint 與 tool schema 的優點。

困難在 coverage。自然語言的同義、歧義、省略與語用變化太多，規則彼此作用後也會形成龐大例外。新增一條規則可能修好一類句子，又破壞另一類。領域轉換更要求重新編寫知識：新聞用得好的系統，不會自然理解醫療紀錄或網路對話。

不要把這段簡化成「符號法失敗」。它成功建立了任務定義、表示層次與評估問題，很多 annotation scheme 也來自語言學分析。統計模型後來需要 labeled data，而 label 的類別往往正是符號時代整理出的結構。新方法減少的是手寫決策規則，不是讓結構化知識失去用途。

## 統計 NLP：從寫規則轉向估計不確定性

1993–2012 的轉折是把語料當證據，以機率模型比較可能分析。Hidden Markov model、n-gram language model、probabilistic parser 與後來的 discriminative classifier，都允許系統在多個候選之間排序，而非只回傳規則有沒有匹配。

這帶來三個工程改變。第一，錯誤可以用 held-out data 量，而不是只靠幾個手工例句。第二，特徵與權重分開：研究者仍設計特徵，但讓訓練資料決定影響大小。第三，不確定性進入介面；系統能保留候選與機率，讓後續元件組合。

代價也同時出現。Benchmark 會決定研究者最佳化什麼；標註規範把某一種語言分析固定成 ground truth；常見語料中的偏差得到較高統計權重。模型「從資料學」不表示它沒有人的選擇，只是選擇從規則檔移到資料收集、label 與 metric。

## 深度、自監督與強化學習：表示也交給模型學

2013 之後的深度 NLP 把人工特徵換成連續表示與多層函數。詞向量讓相似詞共享統計強度；sequence model 學如何組合 token；attention 與 Transformer 縮短長距離互動路徑。這些部件仍以反向傳播與資料定義的 loss 串起來。

Self-supervision 的關鍵不是「沒有 supervision」，而是 label 從資料本身產生：預測下一 token、恢復 mask 或重建被破壞的 span。它讓訓練擴張到未人工標註的文字，卻同時把語料來源、重複、污染與版權變成核心問題。模型讀到更多，不等於讀到均衡或可靠的世界。

Reinforcement learning 與 preference optimization 再把訊號從「這個 token 是否出現」換成「整個回答是否比較符合偏好或可驗證 reward」。這能改變助理行為，也可能犧牲 calibration、多樣性或少數偏好。Lecture 8 與 12 會看到：目標函數每前進一步，都重新定義模型認為什麼叫做成功。

## 四個時代可以用同一張表比較

| 時代 | 主要知識載體 | 學習／建構方式 | 容易檢查的地方 | 主要缺口 |
|---|---|---|---|---|
| 早期探索 | 任務類比與少量原型 | 手工設計 | 假設直接寫在論述中 | 能否擴張尚未證明 |
| 符號系統 | 詞典、文法、規則 | 專家編寫 | 規則與中間結構 | coverage 與例外成本 |
| 統計 NLP | 特徵、機率與標註語料 | 估計參數 | held-out error、候選機率 | label、domain shift、稀疏性 |
| 深度／自監督 | learned representation 與大模型參數 | 大規模最佳化 | end-task metric、probe | data provenance、可解釋性、成本 |

這張表不是勝負表。每一列都把難題搬到不同位置：符號法把成本放在知識編寫，統計法放在 feature 與 label，深度法放在資料、compute 與評估。判斷新方法時，最有用的問題不是「它取代了誰」，而是「它把人工判斷移去哪裡」。

## 一個可以跟完整系列一起做的練習

建立一份四欄筆記：representation、training signal、inference procedure、failure evidence。每讀一講就填一列。例如 Lecture 2 的 representation 是 word vector，signal 是 center-context prediction，inference 可以是 nearest neighbors，failure evidence 包含 rare word、polysemy 與 bias。Lecture 5 換成 contextual token representation、language-model objective、attention-based generation，以及 quadratic cost 與 position limitation。

到 Lecture 19 再回看，你會看到課程不是十九個熱門主題，而是同四個欄位不斷改寫。這也提供一個防止被模型名稱淹沒的方法：遇到新 paper，先把它放進四欄；若作者只換 architecture 卻沒有說 training signal 或 evaluation，缺口會立刻浮現。

## 用歷史避免三種常見誤讀

第一種誤讀是用今天的成果嘲笑早期問題。早期研究者沒有現在的資料、GPU、tokenizer 與 benchmark；合理比較應問，在當時資源與知識下，他們建立了哪些後來仍使用的抽象。Machine translation 把語言理解變成可輸入、可輸出、可評估的任務，這個介面一直延續。

第二種是把方法演進寫成單線勝利史。符號、統計與神經方法並沒有按年份整齊退場。現代 RAG 同時含 neural retriever、symbolic query/filter、外部文件與規則式 permission；agent tool call 也需要 JSON schema 與 deterministic validator。實際系統通常混合多個時代的技術。

第三種是把 benchmark 進步等同語言理解已解決。每個時代都傾向選擇當時可量的問題：規則 coverage、held-out accuracy、leaderboard score。Metric 讓研究累積，也會縮窄注意力。Lecture 11 會再問 benchmark 過期與污染；在第一講先記住，評估制度本身就是歷史的一部分。

讀任何「新典範」主張時，可以做一個逆向檢查：它聲稱移除了哪個舊限制？證據是在相同資料與 metric 下比較嗎？它又新增了什麼資源或不可見假設？如果新方法以百倍資料與 compute 贏過舊 baseline，結論應包含整個資源改變，而不只是 architecture 名稱。

## 從第一講建立自己的課程地圖

把十九講分成五個連續問題會更好記。Lecture 1–5 建立 representation 與 optimization；7–10 講模型如何從預訓練走到 adaptation、RAG 與 agent；11 講處理 evaluation；12–13 講 reasoning 與 inference compute；14–18 講 tokenization、多語言、interpretability、社會影響與 multimodality；19 講回到 open research。

第 6 講 project 夾在中間，提醒學習不是只消費概念，而要把問題變成 baseline、data 與 metric。每完成一個區塊，回到四時代表，標出它主要改了 knowledge carrier、training signal 還是 evaluation。這張地圖比按模型年份背誦更能支撐後續研究。

## 材料缺口

Winter 2026 的錄影只對修課者開放。本文依官方 intro 與 history 兩份投影片重建 agenda，不包含講者口頭補充、課堂問答或投影片之外的立場。Older offering 的公開影片沒有拿來補洞，因為那不是同一學期。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 1：Introduction 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-intro.pdf)
- [Lecture 1：History of NLP 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-history.pdf)
- [Human Language Understanding & Reasoning](https://www.amacad.org/publication/daedalus/human-language-understanding-reasoning)
