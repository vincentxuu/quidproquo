# Berkeley AI／ML 課程地圖研究筆記

查證日：2026-08-21

## 研究問題

1. Berkeley 大學部是否有正式的 AI 學位或 concentration？
2. CS／EECS 的 AI／ML 路線有哪些共同先修，CS188 與 CS189 是什麼關係？
3. 2025–2026 實際開了哪些課？新舊課號與大學部／研究所配對如何解讀？
4. 匿名讀者現在能否取得課綱、講義、錄影、作業、程式碼與解答？
5. CSDIY 能補充哪些歷史版本，又有哪些事不能只靠它確認？

## 結論摘要

- Berkeley 大學部官方列出的相關學位是 CS BA 與 EECS BS，沒有獨立的 AI 學士。AI／ML 是在共同 CS 基礎上，由 upper-division 課程組成的學習路線，不是成績單上的正式 AI concentration。
- CS61A、CS61B、CS70 與數學形成地基，但 CS188 和 CS189 不是嚴格前後關係：CS188 從搜尋、推理、規劃與不確定性建立廣義 AI；CS189 以微積分、線性代數與機率進入數學較重的機器學習。
- 2025–2026 的專題課常採大學部／研究所配對：CS180/280A、EECS183/283A、CS185/285、CS C182/282A。CS C280 是另一門研究所 Computer Vision，不能和 CS280A 混為一談。
- 目前最完整且穩定的自學入口包括 CS61A Fall 2025、CS61B Fall 2025、CS70 Fall 2025、CS188 Spring 2026、CS189 Spring 2025、CS180/280A Fall 2025、CS185/285 Spring 2026、CS288 Spring 2026 與 CS C280 Spring 2026。
- 「最新學期」與「最新可完整自學版本」不一定相同。CS189 的 Fall 2025／Spring 2026 輪替站目前不可用，因此文章採仍穩定公開的 Spring 2025 作為主自學版本。

## 來源與閱讀完整度

| 來源 | 類型 | 用途 | 閱讀狀態 |
|---|---|---|---|
| [EECS undergraduate program comparison](https://eecs.berkeley.edu/academics/undergraduate/compare-majors/) | 官方 | 學位名稱與差異 | 完整 |
| [CS lower-division requirements](https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-lowerdiv/) | 官方 | 共同基礎 | 完整 |
| [CS upper-division requirements](https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-upperdiv/) | 官方 | 高年級選課結構 | 完整 |
| [EECS upper-division requirements](https://eecs.berkeley.edu/resources/undergrads/eecs-2/degree-reqs-upperdiv-2/) | 官方 | EECS 高年級選課結構 | 完整 |
| EECS course catalog: CS61A, CS61B, CS70, CS188, CS189, C182, CS185, CS285, CS288, CS280A, C280, EECS183 | 官方 | prerequisites、課號、歷年開課 | 完整 |
| 2025–2026 各課公開站 | 官方課站 | 匿名存取實測 | 完整 |
| [CSDIY CS188](https://csdiy.wiki/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/CS188/)、[CS189](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/CS189/)、[CS285](https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/CS285/) | 社群 | 歷史版本與自學建議 | 完整 |

## 事實交叉表

| 主張 | 官方課程／學位頁 | 當期課站或班次 | 判定 |
|---|---:|---:|---|
| 無獨立大學部 AI 學位 | 有 | 不適用 | 確認 |
| CS188 與 CS189 是不同入口 | prerequisites 有別 | 兩門於 Fall 2025、Spring 2026 皆有班 | 確認 |
| CS180/280A 為大學部／研究所對應 | 有 | Fall 2025 同站 | 確認 |
| CS185/285 為大學部／研究所對應 | 有 | Spring 2026 同師同時段 | 確認 |
| EECS183/283A 為 NLP 對應課 | 有 | Fall 2025 同站 | 確認 |
| CS288 是 advanced NLP | 有 | Spring 2026 | 確認 |
| CS280A 與 CS C280 不同 | 各有獨立 catalog entry | Fall 2025／Spring 2026 分別有站 | 確認 |
| CS189 最新完整穩定版為 Spring 2025 | catalog 有後續班次 | Fall 2025／Spring 2026 舊網址目前 404 | 版本選擇 |

## 匿名公開程度

A0：只有 catalog；A1：另有 syllabus；A2：有部分實質教材；A3：足以組成連貫自學課。這是本站編輯標籤，不代表學分、助教、評分或算力。

| 課程版本 | 等級 | 公開內容 | 主要缺口 |
|---|---:|---|---|
| CS61A Fall 2025 | A3 | 章節、投影片、影片、labs、homework、projects、starter files | Ed、提交、評分 |
| CS61B Fall 2025 | A3 | 課表、投影片、影片、討論、考題、作業與專案規格 | 當期完整 autograder |
| CS70 Fall 2025 | A3 | notes、slides、討論與解答、作業與解答、歷屆考題 | Ed、Gradescope |
| CS188 Spring 2026 | A3 | slides、notes、影片、討論、P0–P5、local autograder | homework 提交、Ed、人工回饋 |
| CS189 Spring 2025 | A3 | lecture notes、影片、HW1–7、code/data、歷屆考題 | 非最新班次、無評分回饋 |
| CS C182/282A Fall 2025 | A2 | syllabus、schedule、多份 assignment PDF／code | 當期影片限 Berkeley、部分 lecture resources 不完整 |
| CS180/280A Fall 2025 | A3 | slides、readings、討論與解答、五個 programming projects | 無錄影、專案解答與評分 |
| EECS183/283A Fall 2025 | A2 | 完整主題表、多數 slides | 作業、starter code、解答與影片 |
| CS185/285 Spring 2026 | A3 | 25 份 lecture decks、9 份 discussion decks、5 份 HW、starter code、final projects | 當期錄影與學生算力 |
| CS288 Spring 2026 | A3 | 17+ lecture slides、三份作業、A1/A2 starter repos、final project docs | 當期錄影、隱藏測試、解答 |
| CS C280 Spring 2026 | A3 | 24 份 slides、HW0–3、project | 無影片、Ed／Gradescope／CMT |

## 推論與限制

| 推論 | 依據 | 信心 |
|---|---|---:|
| 校外自學應把 CS188 與 CS189 視為可依目標選擇的平行入口 | 正式 prerequisites 與內容不同 | 高 |
| CS61C 是 CS 學位基礎，但不是本文 AI 主線每門課的直接 prerequisite | 學位要求與各課 prerequisites | 高 |
| 沒有公開錄影不必然降到 A2；若講義、作業、程式碼與練習鏈完整，仍可判 A3 | CS180、CS285、CS288、C280 實測 | 高 |
| CS189 Fall 2025 的內容較新，不代表它目前比 Spring 2025 更適合匿名自學 | 當期內容索引與目前 404 對照 | 高 |

## 衝突與保守寫法

1. CS C182 的 cross-list catalog metadata 尚未完全同步：只寫「現行標為 C182、舊稱 CS182，並與 282A 配對」，不延伸宣稱 2025–2026 已完成所有跨系掛牌。
2. EECS requirement 頁偶爾顯示 CS280，但連結指向 CS280A：正文以正式 course entry 和當期站區分 CS180/280A 與 CS C280。
3. CS189 Fall 2025／Spring 2026 網站曾公開但目前不可用：不把搜尋快取當成現在可修的證據。
4. CS C280 沒有錄影，但當期 slides、四份 homework 與 project 已形成完整練習鏈，因此判 A3，並明列缺口。

## 文章大綱

1. 先釐清 Berkeley 沒有獨立 AI 學士。
2. 以 prerequisites 畫出共同地基與 CS188／CS189 兩個入口。
3. 解釋配對課號與 CS280A／C280 陷阱。
4. 列 2025–2026 匿名公開程度矩陣。
5. 提供廣義 AI、ML／NLP、vision／RL 三條可執行路線。
6. 說明 CSDIY 能驗證歷史自學版，不能取代當期匿名測試。
7. 以 90 分鐘起步任務收尾。
