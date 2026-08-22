---
title: "Stanford CS224V 第 2 講：STORM 與 Co-STORM 怎麼把搜尋變成知識策展"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, deep-research, rag, storm]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 3
tldr: "STORM 用觀點引導的提問、模擬訪談與大綱建立改善研究廣度；Co-STORM 再把人放進迴圈，讓探索未知問題與共同編修成為系統的一部分。"
description: "拆解 CS224V Knowledge Curation 講義的完整路線：RAG、STORM 前期研究、評估、Co-STORM 協作協定與 DataSTORM 作業。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-knowledge-curation-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第二講問的不是「怎麼摘要搜尋結果」，而是研究寫作前如何找出自己尚未想到的面向。官方 schedule 把它叫 Knowledge Curation；主角是 [STORM](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf)、Co-STORM，最後接到 Homework 1 的 DataSTORM。

## Agenda：從 RAG 到人機共同研究

講義先快速複習資訊檢索與 RAG，再指出一般搜尋式寫作的兩個缺口：使用者的問題通常太窄，單輪檢索也不會主動追問。接著完整走過 STORM 的前期研究、文章生成與評估；後半把人加入 Co-STORM 的多代理討論，最後介紹結合網路與資料庫探索的 DataSTORM。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

## STORM 的中間狀態是觀點與大綱

STORM 先從既有文章找可能的作者／讀者觀點，把 perspective 當成控制研究廣度的潛在變數。系統模擬一位提問者訪談專家：每輪依前文提出追問，專家則搜尋並以來源回答。累積的問答不直接變文章，而是先整理成多層大綱，再按章節檢索與撰寫。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

這跟「丟主題給聊天機器人，請它寫長文」差在可檢查性。研究面向是否夠廣，可以看觀點與大綱；引用是否支持段落，可以回到問答與來源。講義也分開評估大綱涵蓋、文章組織與事實依據，而不是只問成品讀起來順不順。

## Co-STORM：探索本身是一段對話

STORM 偏向替人完成前期研究，Co-STORM 則讓使用者留在討論裡。多個具不同觀點的 agent 參與 discourse，主持機制需要決定誰回應、何時引入新面向，以及如何把使用者的追問併入共同知識。目標之一是 unknown unknowns discovery：不是只回答已知問題，而是讓人發現原本不知道該問什麼。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

因此 Co-STORM 的評估也分兩層：討論是否有深度與多樣性，最後報告是否保留並組織探索所得。這提醒我們，協作研究工具的「好」不能只用最終答案測量。

## DataSTORM 與 Homework 1

最後一段把研究來源從網頁擴到資料庫。DataSTORM 一邊做類似 STORM 的文獻搜尋，一邊讓資料探索 agent 自動提出問題、查詢資料庫並回傳結果。作業要求學生完成 DRLite 的關鍵元件；公開 PDF 才是實作邊界，不能只靠講義中的系統示意圖推測介面。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

## 從一般 RAG 到知識策展，差的是 pre-writing

講義開場先把 retrieval 畫成 query、retriever、ranked documents，再把 RAG 拆成 retrieve 與 generate。這個基線適合回答已經問清楚的局部問題，卻不會替作者建立一份完整研究計畫。當題目是「寫一篇某主題的百科式文章」，最大的風險往往不是某句沒找到，而是整個重要面向根本沒進 query。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

STORM 因此把 pre-writing 當成一等工作。它不是先生成草稿再補 citation，而是先找相關文章、推導可能觀點、模擬多輪訪談、累積帶來源的筆記，再建立 outline。生成發生在研究結構之後。這也讓「廣度」成為可以在寫作前檢查的 artifact，而不是等成品出來才憑感覺說不完整。

講義同時指出一般長文難以驗證。段落寫得流暢時，讀者很難分辨哪些句子來自來源、哪些是模型補出的連接語。STORM 的訪談筆記與引用鏈至少讓每節能回到資料；它沒有保證零幻覺，但把查證從全文搜尋縮小到 section、question 與 source 的關係。

## Perspective-guided QA 如何控制研究廣度

Perspective 不是把同一題換語氣問三遍。系統先從相近文章中找出典型編輯者或讀者角色，例如歷史、技術、政策或實務應用視角。每個角色會提出不同問題，因而改變後續搜尋路徑。講義稱它為 latent variable，是因為 perspective 不直接成為文章答案，卻控制哪些證據被蒐集。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

模擬訪談允許 follow-up。提問者讀到前一輪回答後，可以追問定義、反例、時間線或比較；專家角色則重新查詢來源後回答。這比一次產生十個獨立問題更接近研究，因為後面的問題能針對剛發現的缺口。不過 follow-up 也可能沿錯誤前提越走越遠，所以 evidence 與引用仍需在每輪保存。

研究完成後，outline generation 把筆記重新組織成階層。這一步不只是摘要：同一證據可能支援不同 section，重複主題要合併，孤立問題要判斷是否值得成節。若 outline 沒有留下來源對應，後面的 article generation 仍可能重新變成不可追蹤的自由生成。

## STORM 的評估為什麼分成自動與真人

講義先用 outline coverage 類指標近似 pre-writing 品質，檢查產生的大綱是否涵蓋參考文章的重要主題。這類自動評估能大量比較 ablation，例如拿掉 perspective 或多輪訪談後是否變窄；但它也可能偏好跟既有文章相似，而錯過新穎但合理的組織。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

因此課程另外呈現 Wikipedia editor evaluation。編輯者可以判斷文章是否有適合百科的組織、內容廣度與引用品質，這些不是 lexical overlap 能完全代表。In-the-wild deployment 則再問一層：真實使用者拿它研究什麼、是否願意修改與分享、哪些題目會失敗。三種 evaluation 分別對準 pipeline、成品與使用情境。

講義列出的使用量與偏好結果只能歸屬 STORM／Co-STORM 當時的研究。它們不能證明所有 deep-research agent 都有效，也不能直接證明使用者學得更好。真正可移植的是評估拆法：outline、grounding、human editorial quality 與真實使用行為要分開。

## Co-STORM 的 discourse protocol 在解什麼問題

把多個 agent 丟進群聊不會自動形成共同研究。它們可能重複同一觀點、搶著回答，或產生很多旁支卻沒有共同記憶。Co-STORM 因此需要 collaborative discourse protocol：根據目前討論選擇下一個 speaker、決定延續既有 thread 或提出新方向，並更新共同 knowledge base。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

使用者不是只在最後按接受。人可以插入自己的假設、追問某個觀點、要求換方向；agent 的責任是把這些介入接回 shared discourse，而不是重置對話。講義把這件事與教育中的 collaborative discourse 類比：價值在共同建構與發現問題，不只在取得一篇完成報告。

Unknown unknowns discovery 因此需要特殊評估。系統若只快速回答使用者原題，可能看似精準卻沒有拓展理解；若只丟大量新名詞，又可能造成負擔。講義分別檢查 discourse quality、final report quality、ablation 與 human evaluation，想知道 protocol 是否真的帶出相關而新穎的觀點。

## STORM、Co-STORM 與 DataSTORM 的邊界

三個名字容易被當成版本演進，其實面對不同工作。STORM 偏向從公開文獻建立百科式文章；Co-STORM 把人放在探索對話中心；DataSTORM 增加結構化資料探索。選擇不該只看哪個比較新，而要看問題主要缺的是文獻廣度、人機共同 sensemaking，還是資料庫中的模式。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

DataSTORM 也揭露新的 evidence 類型。網頁來源可以用 URL 與段落引用，資料庫發現則需要保存 query、schema、filter 與 result snapshot。若只把數據結果轉成一句自然語言，就失去重跑與查核能力。Homework 1 把學生帶到這個交界：research agent 不只呼叫 search，也要能提出資料問題並處理回傳。

這三種系統都不是「按一次就有可信報告」。來源品質、搜尋範圍、parser 與生成仍會錯；使用者還要檢查重要主張。計算思維的貢獻是把錯誤放進可觀察階段，讓人知道要改 query、perspective、outline、citation 還是 data analysis。

## 自己重做一個最小 STORM 的順序

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先限制題目與來源集合，不要一開始接全網。第一步產生三個互不重疊的 perspectives，並要求每個角色說明它會補足哪個資訊缺口。第二步每個 perspective 做兩輪帶來源問答，第二輪必須引用第一輪尚未回答的缺口。第三步只用筆記建立兩層 outline，為每個標題標上 supporting notes。

第四步才逐節生成，而且生成器只能取得該節筆記。完成後做兩份檢查：coverage table 列出重要筆記是否進文章，citation table 列出每個可驗證 claim 的來源。最後讓另一個人只看 outline，指出他預期卻缺少的面向。這個流程規模小，但保留 lecture 想教的所有中間狀態。

若要改成 Co-STORM，不是加三個同時說話的 agent；先設 speaker selection、共享筆記與使用者打斷規則。若要改成 DataSTORM，先定義資料庫 query log 與 result provenance。每次擴充都應增加新的 evaluation artifact，而不是只增加 agent 數量。

## 成本與停止條件也是研究設計

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

多 perspective、多輪訪談與逐節檢索會快速增加 calls。若沒有停止條件，系統總能再提出一個問題、再查一份來源，看起來「更深入」卻不一定更有用。可以把停止拆成三類：coverage 已達到大綱要求、連續新問題只找到重複證據、或研究 budget 已用完。每次停止都要記錄原因，否則不同實驗無法公平比較。

**本文延伸：** 來源去重也很重要。多個搜尋結果可能轉載同一篇報導，若把它們當成獨立 evidence，agent 會誤以為某說法有廣泛支持。筆記層應保存 canonical URL、publication 與時間，合併重複來源；觀點的多樣性不能只靠網頁數量衡量。

Research depth 與 breadth 之間也要明確選擇。每個 perspective 都追問五輪可能很深，卻讓面向變少；十個 perspective 各問一題則可能只是目錄。Lecture 用 outline 與 discourse evaluation 分開觀察，實作時也應同時報「涵蓋多少獨立主題」與「重要 thread 是否有 follow-up evidence」。

## Citation chain 如何避免在最後斷掉

最常見的實作錯誤是研究階段保存 URL，寫作階段卻只把筆記文字交給 generator，最後再讓另一個模型猜 citation。正確做法是讓每個 note 有穩定 ID、source span 與 URL；outline section 引用 note IDs；生成句子再引用 note IDs。Citation 是沿 dataflow 傳遞的欄位，不是排版階段裝飾。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf))

一個 section 同時使用多份來源時，還要區分各自支持的範圍。來源 A 支持時間，來源 B 支持影響，不能在段尾放兩個連結就讓讀者自己配對。Verification table 應以 claim 為列，列出直接 supporting spans。這正好接到下一堂以後反覆出現的 claim-level grounding。

若來源只提供某研究作者的結論，就要寫成 attribution，而不是系統自己的普遍事實；若是二手文章轉引原研究，也要保留轉引關係。STORM 的自動 citation 能提供路徑，但最終發佈前仍要人工打開重要來源，確認筆記沒有把語氣放大。

## 什麼情況不適合用這套方法

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

題目已有明確單一官方答案時，多 perspective 研究可能只增加雜訊；需要即時狀態時，百科式網頁搜尋也可能太慢、太舊；涉及私有資料或機密文件時，公開 STORM deployment 的假設不成立。此時應改用受控 corpus、資料庫 query 或明確 workflow。

另一個不適合情境是使用者只想快速定位一份文件中的事實。完整 knowledge curation 會付出大綱、訪談與生成成本，普通 retrieval 足夠。選擇 STORM 應因為問題需要探索與組織，不是因為「deep research」名稱聽起來較完整。

最後，若團隊沒有能力稽核來源，產生更長報告反而擴大風險。可以先只交付 research brief：觀點、大綱、來源與未解問題，不自動生成文章。這仍保留 pre-writing 的主要價值，也讓人類決定哪些部分值得繼續。

## 交稿前的知識策展稽核

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先從 outline 反向檢查：每個一級標題是否有獨立研究問題，每個二級標題是否至少連到一份真正讀過的來源。再從來源正向檢查：重要 evidence 是否被使用、是否被放進錯誤 section、是否因摘要而失去限制。兩個方向都要做，因為只有前者會漏掉已蒐集卻被生成器忽略的反證。

接著標出三種文字：來源明確支持的事實、系統依多份來源做的綜合、仍待確認的問題。綜合不是錯，但要讓讀者看得出這是作者／系統的組織，而不是某一來源的原話。未解問題也不是失敗；在研究報告中誠實留下 knowledge gap，往往比用流暢段落填滿更有價值。

## 動手讀法

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

挑一個不熟的主題，先自己列三個觀點，再讓系統產生大綱。逐項標記每個二級標題來自哪個觀點與哪段來源；標不出來的段落，就是「生成很完整、研究鏈卻斷掉」的地方。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

投影片沒有錄影，部分表格的口頭解釋不可得；其中的使用量與人類評估數字屬講義對研究結果的摘要，本文不把它們泛化成所有 deep-research 系統的結論。

## 參考資料

- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 2: Knowledge Curation](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf)
- [Homework 1](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [Lecture 1: computational-thinking course map](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
