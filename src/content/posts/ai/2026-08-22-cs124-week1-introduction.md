---
title: "CS124 Week 1 Introduction and Setup：先把語言問題拆成可計算的元件"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, llm, ai-course]
lang: zh-TW
series:
  name: "Stanford CS124 導讀"
  order: 2
tldr: "CS124 Winter 2026 第一週不是先教 Transformer，而是先畫出從斷詞、分類、檢索到語音與網路的十週路線，並用 PA0 建好後續九週共同使用的 Jupyter 環境。"
description: "逐週拆解 Stanford CS124 Winter 2026 Week 1：課程範圍、flipped classroom 設計、NLP 元件地圖與 PA0 setup。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week1-introduction-en)

[CS124: From Languages to Information](https://web.stanford.edu/class/cs124/lec/) Winter 2026 的第一週是課程地圖，不是模型速成班。Dan Jurafsky 在 1 月 6 日的現場 Introduction lecture 把十週問題排成一條工程鏈：先決定文字如何切成 token，再做分類、檢索與表示學習，接著進神經網路、Transformer、語音、推薦與網路分析。這個順序的重點是：LLM 不是憑空出現的黑盒子，而是前面每個元件逐層疊起來的系統。

**課程版本：** CS124 / LINGUIST 180, Winter 2026。**官方單元：** Week 1，2026-01-06、01-08。**講師：** Dan Jurafsky；1 月 8 日另有 Jupyter 與 PA0 tutorial。**公開材料：** [Week 1 課表與 syllabus](https://web.stanford.edu/class/cs124/lec/)、[Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf)、[PA0 repo](https://github.com/cs124/pa0-jupyter-tutorial)。**材料缺口：** Introduction 是未錄影的現場課；Canvas 上 Windows／Mac setup videos 需要 Stanford 權限。因此本文只整理公開投影片、課表與 repo，不能重建現場問答或講者未寫在投影片上的說明。

## 這門課到底把什麼放在一起

[Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) 先列 LLM 的元件：BPE tokenization、logistic regression、word embeddings、neural networks、attention、sampling、language-model loss 與 RAG；下一頁又把 information retrieval、recommendation、speech recognition、social networks 與 ethical issues 放進同一門課。表面上很散，真正的共同問題是：**如何把人使用的語言與關係，轉成機器能排序、預測或產生的表示。**

這也解釋了課名為什麼是「From Languages to Information」，而不是「Introduction to LLMs」。文字可以變成 token 序列，文件可以變成特徵向量，查詢可以變成排序問題，語音可以變成轉寫結果，社群連結可以變成圖。LLM 是這條路線的重要終點，但不是唯一終點。

[Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) 把 CS124 稱為至少十二門研究所課的廣泛大學部入口，點名 CS224N、CS224U、CS224V、CS224S、CS224W、CS246、CS276、CS336 等。這不是說一季能取代它們，而是告訴學生每個單元往後接到哪個專門領域：Week 4 的檢索可接 CS276，Week 5 的社會 NLP 可接 CS224C／CS329R，Week 6–7 的模型元件可接 CS224N／CS336，最後的圖與 PageRank 可接 CS224W。

## Flipped classroom 改變了「一週」的單位

Winter 2026 [schedule／syllabus](https://web.stanford.edu/class/cs124/lec/) 把 CS124 定義成 flipped class：多數週先在 Canvas 看約兩到兩個半小時預錄內容，再於週二上現場 lecture 或 lab，配一份 reading、一個 quiz 與一個 programming assignment。這就是本系列採「逐週」而非硬拆「逐堂」的理由。一週才是官方課表把 agenda、練習與評量綁在一起的最小完整單位。

第一週的現場課提供整體地圖，週四 tutorial 則處理 Jupyter 與 PA0。兩者一個回答「要去哪裡」，一個回答「電腦是否已經能跑」。如果只讀概念而跳過 setup，第二週 PA1 才第一次碰環境問題，會把斷詞與 BPE 的學習時間花在 shell、conda 或 notebook 上。

## PA0 的角色不是暖身分數

[PA0 repo](https://github.com/cs124/pa0-jupyter-tutorial) 是後續作業的共同介面。它要求建立 Python／conda 環境、啟動 Jupyter notebook，並熟悉在 cell 中讀取資料、執行程式與保存結果。[課表](https://web.stanford.edu/class/cs124/lec/)也把它安排在 1 月 9 日截止，早於任何 NLP 演算法作業。

這個安排有一個很務實的判斷：課程的先修包含 Python 與相當於 CS107 的 UNIX 使用能力，但「修過」不等於每個人的本機環境一致。PA0 把環境問題提早變成顯性的交付。後續 PA1–PA4 都沿用 clone repo、啟動環境、開 notebook 的節奏，Week 1 做完的不是一次性練習，而是整季的執行底座。

完成 PA0 後應做一次「從零重開」：關閉 notebook server 與 terminal，重新啟動 shell、activate environment、進入 repo，再開 notebook 並執行全部 cells。保存 Python 版本、主要 packages 與命令，後續遇到衝突才能回到基準。Jupyter 允許 cells 亂序執行，畫面暫時正確卻可能依賴隱藏狀態；restart kernel 並 run all 仍成功，才算可重現。

另存目前工作目錄、Python executable 路徑與 notebook kernel 使用的 environment。terminal activate 成功，不代表 Jupyter 選到同一個 kernel；兩者不同時，已安裝套件仍會顯示找不到。這份最小診斷能區分 kernel mismatch 與真正缺 package。

## 課程從元件而不是產品品牌開始

[Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) 說 LLM 改變了 NLP、AI、IR、推薦與語音，但[課表](https://web.stanford.edu/class/cs124/lec/)沒有依產品或模型品牌排課。它依可重用元件排：tokenization 決定模型看到什麼單位；classification 建立預測與 loss 的基本語言；retrieval 處理外部資訊；embeddings 把相似性變成幾何；neural networks 與 Transformer 再把這些接成可學習的表示系統。

這種安排對自學者有一個好處：即使 Canvas 錄影拿不到，仍能用公開投影片、教科書與作業維持同一條主線。壞處也很明確：現場 lecture 的社會脈絡、例子與討論不會完整留在檔案裡。公開材料足以學演算法，卻不等於旁聽了一次完整課堂。

## 本週做完應該帶走什麼

第一，能說出十週的因果順序，而不只是列熱門名詞。第二，能在自己的電腦 clone PA0、啟動 notebook 並保存一次執行結果。第三，知道這門課的公開邊界：schedule、slides、readings、starter code 多半公開，Canvas、Gradescope、autograder 與現場內容不是。

最小可執行版本很簡單：打開 Introduction slides，把每個元件各寫一句「輸入是什麼、輸出是什麼」；接著完成 PA0。若連 notebook 都還無法穩定啟動，就先不要急著讀 Transformer。這門課第一週給的訊息正是：把地基問題提早處理，後面才能把注意力留給模型。

## 從十週課表看出作業如何累積

[Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) 不只列主題，也把演算法與 programming assignments 對在一起。PA1 處理 BPE tokenization；PA2 進入 logistic regression；PA3 做 information retrieval；PA4 學 embeddings；PA5 寫 neural networks；PA6 將 Transformer 與 speech 串起來；PA7 再把 collaborative filtering、tool use 與 memory 收進 agent。這個 mapping 說明作業不是七個獨立 notebook，而是逐步降低抽象層級。

前幾份作業讓學生直接看見資料結構與公式。token merge、feature vector、inverted index、cosine similarity 都能在小例子上手算。進到 PA6 才改用多檔案專案、PyTorch 與外部 API；PA7 又加入多人協作與會消耗額度的服務。若前半季只追求 autograder 過關、沒有保存中間表示，後半季遇到 agent 輸出錯誤時就很難判斷問題出在資料、模型、tool wrapper 還是遠端服務。

因此 Week 1 可以先建立一份整季共用的實驗紀錄格式。每次作業至少保存四件事：輸入範例、核心中間表示、預期輸出、已知失敗案例。PA1 可保存 merge table，PA2 保存 feature weights，PA3 保存 query-document scores，PA4 保存 nearest neighbors。這些 artifact 到 PA7 仍有用，因為 agent tool 的輸出也需要同樣的可追蹤介面。

## 評量設計透露課程重視什麼

[syllabus](https://web.stanford.edu/class/cs124/lec/) 說沒有 midterm 或 final exam，最後一項要求是 PA7。成績主要由 programming assignments 與 weekly review quizzes 組成，最低的一次 quiz 會被捨棄。這種設計把學習節奏切成每週的 reading／video、quiz、lab 與 implementation，而不是期末一次回想整季名詞。

[syllabus](https://web.stanford.edu/class/cs124/lec/) 規定 review quizzes 是 open-notes、open-book，允許重複作答，但正確答案要等截止後才顯示。它們的角色比較接近強迫 retrieval practice，而不是限時競賽。對自學者而言，Gradescope 題庫拿不到，不能假裝完成同一份評量；可以替每週建立自己的五題檢核，但必須清楚標成自製練習，不能叫「CS124 Quiz」。

[syllabus](https://web.stanford.edu/class/cs124/lec/) 說 lab material 會出現在 quizzes，並將 Lab 1、Lab 4 設為 required in-person；其他 labs 即使可在家完成，現場參與仍有 extra credit。公開 solutions 的存在讓自學者可練習，但正確流程是先做完問題，再看下一頁或 solution file。直接讀解答會把 lab 從 problem solving 變成閱讀。

## 先修條件如何進入 Week 1

官方 [prerequisites](https://web.stanford.edu/class/cs124/lec/) 要求 CS106B、相當於 CS106A 的 Python、CS109 機率背景，以及相當於 CS107 的 UNIX maturity。這些先修並沒有在 Week 1 重新完整教授。PA0 與 tutorial 只確認執行環境；它們不會替代資料結構、機率或系統工具的整門課。

[Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf) 把課程定位成「starts from scratch」，語境是從基本 NLP components 建起，不是從零程式設計。這兩句必須同時讀：演算法主線會從入門開始，但學生應已能使用 Python、terminal、Git/Jupyter，並理解後續 loss 與 probability notation。

一個可操作的先修檢查是：在不查指令的情況下建立虛擬環境、clone repo、從 terminal 啟動 notebook；再用 Python 讀文字檔、建立 dictionary counts，最後算一個簡單條件機率。卡住的步驟就是 Week 2 前需要補的洞。這比用「我修過某門課」判斷準備度更直接。

## 公開自學版與正式修課版不是同一件事

課程 FAQ 鼓勵未選課者看公開材料與做 programming homeworks，但也說不要要求 TAs 回答或替作業評分。這個界線讓自學成立，同時承認支援、quiz feedback、autograder 與現場活動屬於正式課程資源。

自學版最容易高估的是「starter code 公開」等於「作業完整可驗證」。repo 可以執行，不代表隱藏測試與 rubric 全部公開；API-based assignments 還可能因服務更新而改變結果。自學紀錄應把「程式跑完」「公開 tests 通過」「與正式評分等價」分成三種不同狀態，不能用第一種替代第三種。

反過來，公開版也有正式學生未必會保存的優勢：可以依自己的速度重跑、替每週建立 failure notebook，並把十週 artifact 接成一個 portfolio。Week 1 最值得做的不是排出觀看清單，而是先建立這個證據結構。

## 延伸

想先知道完整十週材料的可取得程度，可讀[既有 CS124 總覽](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)。那篇處理課程定位、先修與版本漂移；本篇只對應 Winter 2026 Week 1，不拿其他年份影片補進本週。

## 參考資料

- [CS124 Winter 2026 schedule and syllabus](https://web.stanford.edu/class/cs124/lec/)
- [CS124 Week 1 Introduction slides](https://web.stanford.edu/class/cs124/lec/intro26.pdf)
- [CS124 PA0 Jupyter Tutorial](https://github.com/cs124/pa0-jupyter-tutorial)
- [Speech and Language Processing, 3rd edition](https://web.stanford.edu/~jurafsky/slp3/)
- [Stanford CS124 完整課程總覽](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)
