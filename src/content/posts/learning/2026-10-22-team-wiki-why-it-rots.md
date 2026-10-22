---
title: "團隊知識庫為什麼會爛掉，以及要寫哪幾種文件"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, documentation, diataxis]
lang: zh-TW
tldr: "團隊 wiki 會爛掉，研究看到的主要是三件事：缺漏和過時比寫錯更常被抱怨、寫的人沒時間或離職了、主管和實際寫的人要的東西不一樣。不是所有 wiki 都會爛：寫的人自己也是讀的人，或文件解決的是一個明確的問題時，比較撐得住。文件可以照 Diátaxis 分成四種：教學、操作指南、參考資料、說明，用兩個問題判斷一份文件該是哪一種，就能看出團隊缺哪一類。"
description: "知識庫怎麼建 order 6：團隊 wiki 爛掉的三種方式與研究證據、哪些 wiki 撐得住、個人筆記搬到團隊為什麼不夠、Diátaxis 四種文件與分辨方法，以及一個團隊 wiki 首頁的逐項診斷。"
series:
  name: "知識庫怎麼建"
  order: 6
---

> 🌏 [English version](/posts/learning/2026-10-22-team-wiki-why-it-rots-en)

新同事第三次在群組問「年假怎麼請」。wiki 上其實有一頁，只是寫的是兩年前的流程，而寫那頁的人已經離職了。很多團隊對這種事都不陌生。Stack Overflow 2024 年的開發者調查裡，七成的人說自己知道去哪裡找答案，但只有不到一半的人同意自己找得到最新的資訊（[Stack Overflow 2024](https://survey.stackoverflow.co/2024/professional-developers)）。

這篇是「知識庫怎麼建」團隊段的第一篇，讀者從自己換成同事。[order 0](/posts/learning/2026-10-22-knowledge-base-three-readers) 說過，每段的第一篇只假設你讀過總覽；讀過個人段（order 1 到 5）會更好，但不是必要。這篇談團隊 wiki 為什麼會爛掉，以及團隊該寫哪幾種文件。頁面怎麼分層留給 order 7，內文怎麼寫留給 order 8，維護制度留給 order 9。讀完你能把團隊現有的文件分成四種，看出缺了哪一種。

## 三種爛法

**1. 缺漏和過時，比寫錯更常被提出來。** Aghajani 等人 2019 年從開源專案的郵件清單、問題回報、Stack Overflow 等地方，整理了 824 筆討論文件問題的資料（[Aghajani et al. 2019](https://emadpres.github.io/pdfs/icse2019.pdf)）。談到內容問題的那些裡，最多的是不完整，其次是過時，真正寫錯的只佔一小部分。作者定義的「過時」，是指原本寫得對，後來系統改了、文件沒跟著改。他們也發現，有一半的可用性問題其實是「有寫但找不到」，原文的說法是，找不到的文件「概念上等於不存在」（conceptually does not exist）。

改問實務工作者，排序又不太一樣。同一團隊 2020 年調查了 146 位實務工作者，多數來自同一家公司，最多人勾選為重要問題的是文件寫得不清楚，其次是新功能沒有文件（[Aghajani et al. 2020](https://doi.org/10.1145/3377811.3380405)）。兩篇加起來看，被提出最多的不是內容寫錯，而是沒寫、沒更新、看不懂、找不到。

**2. 寫的人沒時間，或走了。** 在 Aghajani 2020 的調查裡，寫文件流程上唯一過半的問題是「沒時間寫」。[order 0](/posts/learning/2026-10-22-knowledge-base-three-readers) 提過 Stocker 和 Tochtermann 研究的那家公司：行政文章大多由一位核心成員代寫，他離職後，那一區就慢慢失效（[Stocker & Tochtermann 2011](https://doi.org/10.1007/978-3-642-19032-2_22)）。Galan 2023 年回顧了 91 篇關於員工離職造成知識流失的實證研究，被研究的組織常常沒有事前的預防策略，人走了才臨時應付（[Galan 2023, Part II](https://doi.org/10.1108/TLO-09-2022-0108)）。寫成文件適合能明確說出來的知識，而且要附上怎麼用的指引；比較複雜的知識，研究看到的是靠工作坊、帶人這類人對人的方式。

Google 主持的 DORA 2023 年報告也看到一個相關的現象：團隊有正式流程公平分配工作（包括文件工作）時，受訪者自評的文件品質顯著較高（[DORA 2023](https://dora.dev/research/2023/dora-report/2023-dora-accelerate-state-of-devops-report.pdf)）。換句話說，文件要有人負責寫；我的建議是不要只靠熱心。

**3. 主管和寫的人要的不一樣。** 微軟研究院的 Grudin 和喬治亞理工學院的 Poole 取得了數千個企業 wiki 的使用資料，大多數很快就沒人用了（[Grudin & Poole 2010](https://doi.org/10.1145/1832772.1832780)）。他們看到的一個原因是期待錯位：主管想要專案進度的儀表板，實際寫的人卻是在有空、覺得划算的時候才寫，截止日前反而更少更新。主管也比開發和測試人員更少寫內容。作者的建議是，導入 wiki 前，先把主管的期待調整到合理的範圍。

## 不是所有 wiki 都會爛

這三種爛法不是必然。同一家公司裡，Stocker 和 Tochtermann 看到技術區塊一直保持更新：那裡的文章是工程師自己寫、自己用的。Grudin 和 Poole 也看到成功的案例，多半是剛成立、時程很緊、還沒有固定溝通管道的團隊，例如一個要在四個月內從零寫出大量文件的新團隊。Ahmeti 等人 2024 年在兩個軟體團隊導入架構決策紀錄三個月，導入後大多數人表示滿意，關鍵是存放的位置和清楚的「該記什麼」指引（[Ahmeti et al. 2024](https://doi.org/10.1007/978-3-031-70797-1_22)）；不過研究期間很短，看不出能不能長期維持。

這些案例的共同點是：寫的人自己也是讀的人，或文件解決的是一個大家都感受得到的問題。

## 個人筆記搬到團隊，為什麼不夠

個人段教的做法，很多到了團隊就不夠用：

| 個人筆記 | 團隊 wiki |
|---|---|
| 一句「年假：問 HR，表單在 Slack 置頂」就夠 | 要寫清楚找誰、哪個頻道、適用到什麼時候 |
| 靠自己記得放在哪 | 讀的人沒參與分類，只能搜尋或從目錄找 |
| 自己決定什麼時候整理 | 要有人負責，否則沒人會去改 |
| 寫給自己，可以只有關鍵字 | 寫給不同目的的人：有人要學、有人要查、有人要照做 |

最後一列，就是下面要談的四種文件。

## 要寫哪幾種文件：Diátaxis

[Diátaxis](https://diataxis.fr/) 是 Daniele Procida 提出的文件分類架構，把文件分成四種，回答四種不同的需求：

| 類型 | 讀者在做什麼 | 回答的問題 | 例子 |
|---|---|---|---|
| Tutorial 教學 | 學習 | 「可以教我怎麼……嗎？」 | 新人第一週：從零做出第一個功能 |
| How-to 操作指南 | 工作，要完成一件事 | 「我要怎麼……？」 | 怎麼把服務部署到正式環境 |
| Reference 參考資料 | 工作，要查一個事實 | 「……是什麼？」 | API 規格、設定參數一覽表 |
| Explanation 說明 | 想理解 | 「為什麼……？」 | 為什麼我們選擇這個資料庫 |

分辨方法只要兩個問題：這份內容是教人**怎麼做**，還是讓人**知道**？讀者是在**學**，還是在**工作**？作者稱之為羅盤（[The compass](https://diataxis.fr/compass/)）。他也指出，最常見的混淆是把教學和操作指南混在一起，而兩者的差別不在簡單或進階，在於讀者是在學習，還是在完成工作。

使用 Diátaxis 時要知道兩件事。第一，作者明確反對一開始就建四個空分類，主張從現有的文件一次改一小塊。第二，它只告訴你一份文件該是哪一種，不處理內容對不對、新不新；過時的問題要靠 order 9 談的維護制度。另外，它原本是為軟體產品的對外文件設計的，用在團隊內部文件是延伸。

團隊內部還有一種常見的文件，Diátaxis 沒有特別處理：**決策紀錄**，記下當時為什麼這樣決定。它比較接近說明，order 8 會談怎麼寫。

## 例子：一個團隊 wiki 首頁，逐項診斷

假設你的團隊 wiki 首頁有這些頁面：

| 頁面 | 是哪一種 | 診斷 |
|---|---|---|
| 新人環境設定 | 教學和操作指南混在一起 | 拆開：新人第一天照著學的版本，和老手換電腦時照著做的版本 |
| API 文件 | 參考資料 | 確認誰負責更新，最後一次更新是什麼時候 |
| 部署 SOP | 操作指南 | 不錯；檢查步驟是不是還和現在的系統一致 |
| 系統架構 | 說明 | 補上「為什麼這樣設計」，不只畫圖 |
| 2024 Q3 會議紀錄 | 都不是 | 搬到封存；裡面重要的決定，改寫成決策紀錄 |
| 常見問題 | 混合 | 每一題判斷是哪一種，搬到對應的頁面 |

這樣看下來，這個團隊缺兩種：沒有一份獨立的教學，新人只能啃混在一起的設定頁；說明類只有一張架構圖，沒寫為什麼。

## 研究的限制

上面引用的文件研究多數來自軟體開發：Aghajani 那兩篇看的是開源與軟體公司的文件。Stack Overflow 和 DORA 的數字都是自評問卷；Stack Overflow 本身也在賣企業內部知識庫產品。企業 wiki 的研究以訪談和個案為主。Diátaxis 是作者自己的架構，網站上提出的證據是採用者的推薦，不是對照研究。

## 今晚可以做的事

1. **列出團隊 wiki 最常被點開的十頁。** 如果工具有瀏覽次數，就照次數排；沒有，就問三個同事最常看哪幾頁。
2. **每頁用兩個問題判斷是哪一種。** 怎麼做還是讓人知道？學習還是工作？
3. **找出缺的那一種。** 四種裡哪一種最少，我會先從那裡補。
4. **每頁寫上負責人。** 先不用改內容，只要在頁首寫一個名字；order 9 會談怎麼讓這個名字真的有用。

## 自我檢查

**問：**「新人環境設定」這一頁，該寫成教學還是操作指南？

**判準：** 看讀者是在學習，還是在完成工作。第一週的新人是在學：他需要被一步步帶著做出一個能動的環境，順便理解每一步在幹嘛，這是教學。已經熟悉的同事換了一台新電腦，是在工作：他只想照著步驟把環境裝好，不需要解釋，這是操作指南。同一個主題，可能需要兩份文件；硬塞成一份，兩種人都會覺得不好用。

## 參考資料

- [Stack Overflow Developer Survey 2024: Professional Developers](https://survey.stackoverflow.co/2024/professional-developers)
- [Aghajani et al. 2019, Software Documentation Issues Unveiled (ICSE 2019)](https://emadpres.github.io/pdfs/icse2019.pdf)
- [Aghajani et al. 2020, Software Documentation: The Practitioners' Perspective (ICSE 2020)](https://doi.org/10.1145/3377811.3380405)
- [Stocker & Tochtermann 2011, Enterprise Wikis: Types of Use, Benefits and Obstacles: A Multiple-Case Study (IC3K 2009, CCIS 128)](https://doi.org/10.1007/978-3-642-19032-2_22)
- [Galan 2023, Knowledge loss induced by organizational member turnover: a review of empirical literature (Part I) (The Learning Organization)](https://doi.org/10.1108/TLO-09-2022-0107)
- [Galan 2023, Knowledge loss induced by organizational member turnover (Part II) (The Learning Organization)](https://doi.org/10.1108/TLO-09-2022-0108)
- [DORA 2023, Accelerate State of DevOps Report](https://dora.dev/research/2023/dora-report/2023-dora-accelerate-state-of-devops-report.pdf)
- [Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010)](https://doi.org/10.1145/1832772.1832780)
- [Ahmeti et al. 2024, Architecture decision records in practice: an action research study (ECSA 2024)](https://doi.org/10.1007/978-3-031-70797-1_22)
- [Diátaxis](https://diataxis.fr/)
- [Diátaxis: The compass](https://diataxis.fr/compass/)
