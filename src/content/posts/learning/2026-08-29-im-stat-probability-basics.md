---
title: "條件機率、獨立、貝氏：考題到底在換哪個視角？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 4
tldr: "機率題的難點常在視角，不在公式。這篇用事件、條件機率、獨立與 Bayes rule，說明考題如何從原因到結果、再從結果反推原因。"
description: "統計學機率基礎導讀：如何分辨事件、條件機率、獨立、互斥與 Bayes rule，並理解它們在分類模型 precision、recall 和 base rate 中的用途。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-probability-basics-en)

機率題最常見的錯，是題目視角看反。你以為題目在問「模型抓到垃圾信的機率」，它其實在問「被模型判成垃圾信之後，這封信真的垃圾的機率」。前者是從真實狀態看模型輸出，後者是從模型輸出反推真實狀態。

這個差別在考試裡很致命。因為兩個方向的條件機率看起來只差一個位置：P(A|B) 和 P(B|A)。但它們通常不是同一個數字，也不能互換。

ML/AI 裡也一樣。很多人把 recall 和 precision 混在一起，就是條件機率方向沒分清楚。模型抓到多少真正的正類，和模型判成正類時有多少是真的，這是兩個問題。只要正類很稀少，一點誤報就可能讓警報清單充滿假警報。

## 先定義事件，再碰公式

機率題的第一步永遠是定義事件。不要先想 Bayes，不要先想排列組合。先把題目裡的狀態寫成事件。

例如垃圾信題可以定義：

- S：這封信真的垃圾。
- N：這封信正常。
- F：模型把這封信判成垃圾。

定義完事件，下一步才問題目要的是哪個方向。P(F|S) 是「真的垃圾時，被判成垃圾的機率」。P(S|F) 是「被判成垃圾時，真的垃圾的機率」。前者像 recall，後者像 precision。

如果你沒有先寫事件，很容易把兩個方向混在一起。考試中，寫事件本身就是保護自己的動作。

## 條件機率是在縮小世界

P(A|B) 的意思，是在 B 已經發生的世界裡，看 A 佔多少。分母會縮小到 B 發生的那一群。

例如 P(真的垃圾 | 被判成垃圾)，分母是所有被判成垃圾的信。你只在這些信裡面問：有多少真的垃圾？這和 P(被判成垃圾 | 真的垃圾) 完全不同，後者的分母是真正垃圾信。

這也是為什麼條件機率題一定要看分母。你只要能用中文說出「分母是哪一群」，通常就不容易代錯公式。

條件機率公式是：

P(A|B) = P(A ∩ B) / P(B)

這行符號提醒你：條件發生後，樣本空間已經縮小到 B。

## 獨立和互斥不要混在一起

另一個常見錯誤，是把獨立和互斥混在一起。

互斥是兩件事不能同時發生。例如一次擲骰子，點數是 1 和點數是 6 互斥。它們不可能同時出現。

獨立是知道一件事發生，不會改變另一件事的機率。例如連續擲兩次公平硬幣，第一次是正面，不會改變第二次是正面的機率。

這兩個概念方向完全不同。互斥在講能不能同時發生；獨立在講知道一件事後，另一件事的機率有沒有變。除了機率為 0 的特殊情況，兩個有正機率的互斥事件通常不會獨立。因為你一旦知道 A 發生，就知道 B 不會發生，B 的機率已經被改變。

考題問「是否獨立」時，不要用直覺猜。檢查 P(A|B) 是否等於 P(A)，或 P(A ∩ B) 是否等於 P(A)P(B)。

## Bayes rule 是從結果反推原因

Bayes rule 最適合處理一種題型：題目給你原因造成結果的機率，但問題要你從結果反推原因。

垃圾信題就是這樣。題目常給你：

- 垃圾信比例：P(S)
- 真垃圾被判成垃圾的機率：P(F|S)
- 正常信被誤判成垃圾的機率：P(F|N)

但題目問的是 P(S|F)。你看到的是結果 F，想反推原因 S。

Bayes rule 寫成：

P(S|F) = P(F|S)P(S) / P(F)

分母 P(F) 要包含所有會被判成垃圾的路徑：真的垃圾且被判成垃圾，加上正常信但被誤判成垃圾。

## 一題完整算例

假設垃圾信比例是 1%。模型對真正垃圾信有 90% 機率判成垃圾；對正常信有 5% 機率誤判成垃圾。現在一封信被判成垃圾，問它真的垃圾的機率。

先定義事件。S 表示真垃圾信，N 表示正常信，F 表示被判成垃圾。

題目要的是 P(S|F)，不是 P(F|S)。這一步最重要。

分子是「真垃圾信，而且被判成垃圾」：

P(F|S)P(S) = 0.90 * 0.01 = 0.009

分母是所有被判成垃圾的情況。它有兩條路：

P(F) = P(F|S)P(S) + P(F|N)P(N)

代入數字：

P(F) = 0.90 * 0.01 + 0.05 * 0.99 = 0.0585

所以：

P(S|F) = 0.009 / 0.0585 ≈ 0.154

答案大約是 15.4%。很多人會直覺答 90%，因為題目說模型能抓到 90% 的垃圾信。但 90% 是 P(F|S)，不是 P(S|F)。垃圾信本來很少，正常信很多；即使正常信只有 5% 被誤判，也會貢獻大量假警報。

這題的作答重點在方向。小數點後幾位沒有條件方向重要。

## 這在 ML / AI 哪裡會用到

分類模型評估就是條件機率的日常應用。

Recall 問的是：在真正正類裡，模型抓到多少？這是 P(預測正類 | 真實正類) 的方向。Precision 問的是：在模型預測正類裡，有多少真的正類？這是 P(真實正類 | 預測正類) 的方向。

當正類很少時，base rate 會強烈影響 precision。詐騙偵測、醫療篩檢、內容審核都會遇到這個問題。模型的 recall 很高，不代表每一個警報都可信；false positive rate 看起來很低，也可能因為正常樣本太多，產生大量誤報。

所以讀分類報告時，不要只看 accuracy。你要問：正類比例是多少？precision 和 recall 分別是多少？錯誤成本偏向 false positive 還是 false negative？這些問題都回到條件機率。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目出現「已知 B，求 A」時，先寫 P(A|B)，不要憑直覺換方向。
- 題目要從結果反推原因時，通常會用 Bayes rule。
- 題目問「是否獨立」時，檢查 P(A|B)=P(A) 或 P(A∩B)=P(A)P(B)。
- 題目問「至少一個」時，常用補事件會比較快。

## 常見錯誤

- 把 P(A|B) 和 P(B|A) 當成同一件事。
- 把互斥當成獨立。
- 忘記 Bayes rule 的分母要包含所有產生觀察結果的路徑。
- 在分類模型裡混淆 precision 和 recall。

## 練習題

1. 自己定義兩個事件 A、B，寫出 P(A|B) 和 P(B|A) 的中文意思。
2. 用一個擲骰例子，說明互斥和獨立的差別。
3. 把垃圾信比例從 1% 改成 10%，重算被判成垃圾後真的垃圾的機率，並解釋 base rate 的影響。
4. 找一個分類模型報告，標出 precision、recall 分別對應哪個條件機率方向。

## 下一篇怎麼接

機率題處理的是事件。下一篇會把事件變成隨機變數，開始處理 PMF、PDF、CDF。那一步會讓你從「某件事會不會發生」走到「一個數值會落在哪裡」。

## 章節級參考對照

- OpenIntro / OpenStax：支撐事件、條件機率、獨立、互斥與 Bayes rule。
- Stanford CS109：支撐 Bayes、base rate 與機率模型直覺。
- scikit-learn：支撐 classifier probability、precision、recall 與 Naive Bayes 應用。

## 參考資料

- [OpenIntro Statistics：probability、conditional probability、independence、Bayes rule](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e：probability topics](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109：probability and Bayes](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation：precision、recall and classifier metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
