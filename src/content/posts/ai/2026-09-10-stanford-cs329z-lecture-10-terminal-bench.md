---
title: "agent 說完成之後，怎麼驗證它真的完成：Terminal-Bench 客座｜Stanford CS329Z 第 10 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 11
tldr: "Lecture 10 由 Terminal-Bench 共同作者 Ryan Marten、Alex Shaw 客座，談如何在終端機環境評估 agent：任務怎麼寫、驗證器怎麼檢查終態、任務版本與 Harbor 執行框架怎麼管。指定讀物 Terminal-Bench 論文補上基準的設計與結果。"
description: "依實體頁碼帶讀 CS329Z Lecture 10 Terminal-Bench 與 Harbor 客座投影片，再深讀 Terminal-Bench 論文，說明終端機任務、驗證器與版本管理；HW2 同日發布。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 10 堂（10/26）是客座課，由 Terminal-Bench 共同作者 Ryan Marten 與 Alex Shaw（Laude Institute）主講：怎麼評估 agent 在終端機環境裡完成真實任務的能力。同一天 [HW2](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents) 發布，主題正是評估一個 agent；週五（10/30）HW1 截止。

指定讀物是 Terminal-Bench 專案網站與 Merrill 等人的 [Terminal-Bench 論文](https://arxiv.org/abs/2601.11868)。本文深讀論文，重點在 agent 說完成之後，環境的終態是不是真的符合要求。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 10 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="64" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture10.pdf">
<p>共 64 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture10.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

這堂是 Terminal-Bench 共同作者 Alex Shaw 與 Ryan Marten 的客座，投影片標題是 Evaluating Agents: Terminal-Bench and Harbor。前半講為什麼評估變成 agent 開發的核心，後半是他們寫任務、維護 benchmark 的實務經驗。

### 第 1–28 頁：規則不再是唯一的真相來源

<a href="https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=1" data-slide-page="1">投影片第 1–28 頁</a>

講者先走一遍軟體史：從直接寫機器碼、組合語言到高階語言，人寫規則、程式把規則套到新輸入，這是演繹式的開發。機器學習把方向倒過來：人給輸入與輸出的範例，訓練推出規則。投影片接著主張所有數位技術都在變成歸納式：模型從資料學、agent 靠評估來開發、軟體則由 agent 產生。

這帶出全場的問題：過去寫規格的人是軟體工程師，那現在負責「評估」的是誰？當行為是學出來而不是寫出來的，你能檢查的只剩輸出。這也是 HW2 要你親手設計評估的原因。

**理解檢查**：為什麼講者說 agent 是「靠評估開發」？**答案判準**：agent 的行為沒有一份能逐行審查的規則，只能用一組任務與評分去觀察它做出什麼，再依結果改動；評估因此取代規格，成為判斷對錯的依據。

### 第 29–39 頁：一個 Terminal-Bench 任務長什麼樣

<a href="https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=29" data-slide-page="29">投影片第 29–39 頁</a>

Terminal-Bench 的出發點是「bash 一個工具就能做大部分事」，所以任務都在終端機裡完成。[第 38 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=38)的範例把一個任務拆成三份檔案：指令要 agent 依 `/app/schematic.png` 的 2D 圖輸出一個 STEP 立體檔；Dockerfile 只準備好 Python 與那張圖；測試則逐項檢查檔案合法、封閉、體積、表面積、慣性矩與拓撲。測試讀的是產物，不管 agent 用了哪些指令。

講者也列出專案規模（[第 36 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=36)寫累計超過 700 萬次 benchmark 執行），並在第 39 頁把重點從「我們做一個評估」轉成「讓你做自己的評估」：Harbor 是他們為此做的工具。

**理解檢查**：STEP 範例為什麼要檢查體積與慣性矩，而不只檢查檔案能否開啟？**答案判準**：能開啟只代表格式合法；體積、表面積、慣性矩與拓撲才對應「做出圖上那個物體」這項需求。

### 第 40–55 頁：寫任務的三件事：指令、環境、驗證器

<a href="https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=40" data-slide-page="40">投影片第 40–55 頁</a>

[第 42 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=42)沿用 Anthropic 的評估名詞：task 是一題、trial 是一次嘗試、verifier 打分數、trajectory 是完整紀錄；評估 harness 負責跑整套評估，agent harness 則讓模型能當 agent 行動，兩者別混為一談。[第 43 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=43)是 Harbor 的任務目錄：`instruction.md`、`task.toml`、`environment/Dockerfile`、`solution/solve.sh`、`tests/test.sh`，與 agent 無關、可攜帶。

寫任務的核心問題是「你在量什麼、量得對不對」。指令要完整、精簡、自然；[第 46 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=46)把一份冗長指令修成短版做對照。環境要盡量用真的軟體與服務而不是 mock，必要的網路依賴先裝進映像以減少不穩定。驗證器是讀環境終態的分類器，要用混淆矩陣想 false positive 與 false negative，並與指令裡的需求一一對應；可以是程式檢查，也可以是 agent 或模型評審。防 reward hacking 的做法是把 agent 環境與驗證環境隔離，只把產物交給測試；[第 52 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=52)展示模型上網找 Lean 核心的已知漏洞來通過評分的例子。參考解法則要模仿 agent 會做的動作，不能把答案寫死，否則測不出環境與驗證器的錯。

**理解檢查**：指令寫「輸出 summary.csv」，驗證器卻另外檢查欄位順序，會出什麼問題？**答案判準**：驗證器要求了指令沒寫的條件，正確完成的 agent 會被判失敗，屬於 false negative；修法是讓指令與驗證器一一對應，補寫需求或放寬檢查。

### 第 56–64 頁：評估基礎設施與任務版本

<a href="https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=56" data-slide-page="56">投影片第 56–64 頁</a>

評估基礎設施要可靠、可重現、能平行跑獨立的 trial，並能在本機與雲端沙盒間搬移；同一套 rollout 設施可同時服務測試、訓練與上線。任務本身也要 QA：[第 59 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=59)列出靜態檢查、agent 評審、跑參考解法的 oracle agent、前沿模型 agent，以及專門找漏洞的作弊 agent，再讓評審讀這些軌跡。

講者的態度是「任務就是軟體」：會有 bug、會被使用者回報、新模型會帶出新行為。[第 61 頁](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf#page=61)用三段式版本號決定舊結果怎麼辦：改到 agent 看得到的指令、環境或工具，升主版號並重跑；只改驗證器（修過嚴的檢查、堵 reward hack、調評審），升次版號並對舊軌跡重新評分；只改文件、釘依賴、修錯字，升修訂號並沿用結果。最後每一列結果都要附完整收據：軌跡、日誌、產物與分數。

**理解檢查**：你發現驗證器漏抓「改壞輸入檔」，補上檢查後，上週的 50 次執行要全部重跑嗎？**答案判準**：只改了驗證器，屬於次版號變動；保留的軌跡與產物足以重新評分，不必重跑。前提是每次 trial 都留下了產物。

## 讀物 1｜Terminal-Bench

原文：[Terminal-Bench](https://arxiv.org/html/2601.11868)

### TL;DR

任務把指令、Docker 環境、時間限制、測試與參考解法放在一起，依環境終態評分。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 終端機 agent 說完成後，如何驗證它真的完成？ |
| 證據與邊界 | 本文讀的是論文中的版本與任務定義；沒有把專案最新排行榜當成課程表現。 |

### 領域背景

終端機能操作大量環境狀態；命令成功退出仍可能留下錯誤檔案或未完成設定。

### 中階導讀

**方法。** Harness啟動隔離環境，交給agent指令與終端機；結束後由測試讀容器狀態判定。

客座本身講了什麼，見上方 Lecture 10 投影片導讀；本節讀指定的 [Terminal-Bench 論文](https://arxiv.org/html/2601.11868)，看任務定義在論文裡怎麼寫。先備是能看懂工具呼叫與終端機輸出；讀完要能替自己的 agent 寫出一個「它無法靠嘴巴通過」的驗收條件。

論文的任務定義把指令、隔離的 Docker 環境、測試、參考解法與時間限制放在一起。Agent 可以自行決定要下哪些命令；評分測的是**最後容器狀態是否符合指令要求**，不要求它照參考解法走，也不靠最後一段回覆判分。這個分界很適合帶回 HW1：會用 terminal 是動作能力，知道動作有沒有達成需求才是評估能力。

以下是本文自擬的教學例子，並非官方 benchmark 題目或作業答案。假設你替團隊整理活動報名 CSV，輸入是：

```csv
city,status
台北,confirmed
台北,cancelled
台中,confirmed
台北,confirmed
```

任務要求只計入 `confirmed`，依城市產生 `summary.csv`，且不能改動輸入檔。先逐列看條件：取消的台北那列排除，剩下台北兩列、台中一列。因此預期輸出是台北 2、台中 1；行序不影響結果。

| 跑完後的狀態 | 驗收結果 | 為什麼 |
|---|---|---|
| 回覆「完成了」，沒有輸出檔 | 不通過 | 文字不能替代檔案 |
| 有檔案，台北計為 3 | 不通過 | 把取消者算進去了 |
| 台北 2、台中 1，但改掉輸入檔 | 不通過 | 產出正確仍違反保留輸入的要求 |
| 輸出欄位、城市與數量正確，輸入不變 | 通過本例條件 | 檔案狀態與限制都符合要求 |

你可以把驗收器拆成讀回 CSV、比較城市到數量的對應表，以及比較輸入檔執行前後的雜湊。這裡是在說明驗收設計，沒有宣稱已跑過官方 harness；也不代表這些檢查能保證任意任務安全。

**理解檢查**：兩個 agent 分別用 Python 和 shell 完成相同結果，該只讓哪一個通過？本例兩個都可通過，因為需求沒有指定語言。再問：如果測試只檢查輸出檔存在，能抓到哪個錯誤？只能抓到第一列的缺檔，抓不到數錯或改壞輸入，必須補結果與限制檢查。

**證據與結果。** 論文將複雜命令列工作整理成有執行環境與測試的題目，使成果判分不必依賴agent自述。

### 深入要點

- 參考解法證明題目可解，不要求agent採取相同命令順序。
- 環境重設與時間限制是題目定義的一部分；沿用上次產物會改變考題。

### Reviewer 一句話評

結果驗收比完成自述更接近真實能力。

### 給你的 take-away

替自己的任務寫一個讀實際產物的測試，不接受最後一句自述作證。

## 它在課程裡的位置

第 10 堂把評估落到可驗證的終態，[第 11 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents)接著問這些軌跡與分數怎麼變成資料。HW2 要設計的程式判分器，可以直接參考本堂的驗證器寫法。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[Guest Lecture: Terminal-Bench — Lecture 10](https://web.stanford.edu/class/cs329z/slides/lecture10.pdf)
- 指定閱讀：Terminal-Bench 專案網站、Merrill 等人〈Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces〉（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方錄影規則](https://cs329z.stanford.edu/logistics.html)說明講課錄影由課程 Canvas 提供，需登入取得。本文依公開投影片、論文與指定閱讀撰寫，未取得錄影或逐字稿。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-29。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 10（10/26 週一）的內容，原屬「第 6 週：資料飛輪轉起來」導讀；以下保留拆分前的紀錄。
- 2026-10-29：Lecture 10、11 投影片公開後，依實體頁碼補上兩堂的逐段導讀與各節理解檢查（寫任務與驗證器、任務版本、agent 資料的兩種形式與五種來源、資料意外教會的捷徑），並改寫開頭、課程材料對照與 Terminal-Bench 讀物中「尚未開講」的說法；修正 Shankar 的代名詞。
- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。
- 2026-10-23：補入已公布的 Terminal-Bench 客座閱讀、自擬成果驗收例子、雙語流程圖與開發／測試分流。客座尚未開講，本文是閱讀導讀，不是講授逐字稿。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分手刻／框架兩部分、語料換成企業 email）、期中 demo 改為錄影繳交（11/4 晚上 11:59 截止），同步改寫時程、軌跡紀錄與課程位置段落
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 9 堂：Optimization](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization)、[第 11 堂：Data for Agentic Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
