---
title: "一篇頂會論文從投稿到見刊經過什麼"
date: 2026-08-24
category: ai
type: guide
tags: [ai-conference, peer-review, openreview, submission, rebuttal]
lang: zh-TW
tldr: "一篇 AI 頂會論文從投稿到見刊，要走過匿名化投稿、格式審查、reviewer bidding 與分配、3-4 位審稿人獨立評分、author rebuttal、AC/SAC/PC 三層決策、camera-ready 修訂——全程約 4-5 個月。ACL 系列還多了一層 ARR 滾動審稿的「先審後 commit」機制。"
description: "拆解 AI 頂會論文的完整審稿流程：匿名化規則、格式審查與 desk rejection、reviewer 分配機制（bidding、TPMS、COI）、各會議的評分量表差異（NeurIPS 6 分制 vs ICML 5 分制 vs ICLR 10 分制）、rebuttal 的實際翻盤機率（約 20% 的 borderline 論文因此獲益）、AC/SAC/PC 三層決策架構、camera-ready 階段，以及 ACL 系列的 ARR 滾動審稿制獨特機制。附主流會議的完整時間軸對照。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 3
glossary:
  - term: "Area Chair (AC)"
    definition: "負責一組論文的資深研究者，綜合所有 reviewer 意見與 author rebuttal 撰寫 meta-review 並做出初步 accept/reject 決策。"
    context: "AC 是審稿流程裡最關鍵的中間層——reviewer 給意見，AC 做判斷。"
  - term: "desk rejection"
    definition: "論文在正式分配審稿人之前就被退回，通常因為格式不符、超過頁數限制、違反雙盲規則或不在會議收稿範圍內。"
    context: "NeurIPS 2020 的實驗發現約 6% 被 desk reject 的論文若走完正式審稿會被接受，之後取消了主觀性 desk rejection。"
  - term: "TPMS"
    definition: "Toronto Paper Matching System，基於審稿人過去發表的論文與投稿論文做語意相似度匹配的自動分配系統。"
    context: "reviewer bidding 結合 TPMS 匹配分數是目前主流會議分配審稿人的標準方法。"
---

> 本文是「[AI 頂會導讀](/posts/ai/2026-08-23-what-is-ai-top-conference)」系列的第三篇。前篇介紹了頂會怎麼被認定、代表會議有哪些；這篇拆解一篇論文從按下 submit 到最終見刊的完整流程。

在上一篇裡我們把審稿流程濃縮成四步：submission → review → rebuttal → decision。實際跑起來遠比這複雜——每一步都有具體的規則、時程壓力和可能出錯的地方。這篇逐步拆開，用 NeurIPS、ICML、ICLR、CVPR 四場主要會議的 2025-2026 年實際流程做對照。

## 第一步：投稿（Submission）

### 匿名化規則

AI 頂會幾乎清一色採用**雙盲審（double-blind review）**：作者看不到審稿人是誰，審稿人也看不到作者是誰。投稿時必須移除所有可辨識作者身份的資訊——姓名、機構、致謝段落、demo 影片裡的機構名稱、supplementary material 裡的非匿名路徑。

CVPR 2026 的作者指南明確要求：「Do not provide information that may identify the authors in the acknowledgments (e.g., co-workers and grant IDs) nor in the supplementary material (e.g., author/institution names in demo videos, or non-anonymized code).」NeurIPS、ICML、ICLR 的規則類似，但在一個重要細節上比較寬鬆：**在 arXiv 上放 preprint 是允許的**。雙盲的意思是審稿人不能在 OpenReview 系統裡看到作者名字，但如果審稿人自己在 arXiv 上搜到了同一篇論文，這不算違規——這是各大會議的 dual submission policy 明文規定的。

### 格式與頁數

各會議的頁數限制不太一樣：

| 會議 | 主文頁數限制 | 附錄 | 備註 |
|---|---|---|---|
| NeurIPS 2025 | 投稿時未明定嚴格頁數（但有格式模板） | 無限，但審稿人無義務閱讀 | camera-ready 可加 1 頁 |
| ICML 2025 | 8 頁（不含參考文獻） | 無限 | — |
| ICLR 2026 | 9 頁（投稿時）、10 頁（rebuttal/camera-ready） | 無限 | 超過 9 頁直接 desk reject |
| CVPR 2026 | 8 頁（不含參考文獻） | supplementary 另外上傳 | rebuttal 限 1 頁 |

參考文獻在所有主流會議都**不計入頁數限制**。Supplementary material（附加實驗、程式碼、影片等）通常可以無限上傳，但審稿人沒有義務看——所以核心論點必須在主文裡自成立。

### Code 與 Data

越來越多會議鼓勵或要求提交程式碼。NeurIPS 的 paper checklist 會問「Is the code and data made available?」，ICLR 要求作者填寫 reproducibility checklist，ICML 近年也開始推動 code submission。但這些目前多是「強烈鼓勵」而非硬性要求，不附程式碼不會直接被 desk reject——不過 reviewer 有時會因此在 reproducibility 項目上扣分。

## 第二步：格式審查與 Desk Rejection

論文按下 submit 之後，會先經過一輪格式審查，不通過就直接退回，不進入正式審稿流程。常見的 desk rejection 原因：

- **超過頁數限制**：ICLR 2026 明文規定主文超過 9 頁「will be desk-rejected」
- **違反匿名化規則**：論文裡出現作者姓名、機構標誌
- **不在會議收稿範圍內**：例如把純硬體論文投到 NLP 會議
- **違反 dual submission 政策**：同一篇論文同時在另一個 archival venue 審稿中

Desk rejection 的歷史其實有個有趣的轉折。NeurIPS 在 2020 年做過一個實驗，發現**約 6% 被 desk reject 的論文如果走完正式審稿流程，其實會被接受**。這個數字讓 NeurIPS 2021 的 Program Chair 決定大幅縮減主觀性 desk rejection——從那以後，NeurIPS 只對「明確違反頁數限制或投稿規定」的論文做 desk reject，不再讓 AC 基於品質判斷直接退回。

## 第三步：審稿人分配

這一步是整個流程裡最講究技術的環節，因為要同時滿足三個互相拉扯的目標：專業匹配、利益迴避、負載均衡。

### Bidding 機制

投稿截止後，所有已註冊的審稿人會收到一份論文清單（通常只看得到 title 和 abstract），然後在系統裡表達偏好：「想審」「願意審」「不想審」「有利益衝突」。這個過程叫 **bidding**。

NeurIPS 2025 的 bidding 窗口是 2025 年 5 月 17-21 日——只有 4 天。審稿人必須在這段時間內掃過分配到的論文子集並標記偏好。NeurIPS 官方在 reviewer guidelines 裡特別警告：「If we have a reason to suspect that a reviewer is engaged in deceitful bidding to influence reviewing outcomes, we will request an ethics investigation.」——因為過去確實出現過惡意 bidding 的案例。

### 自動匹配：TPMS

Bidding 只是分配的輸入之一。系統還會用 **TPMS（Toronto Paper Matching System）** 或類似的演算法，根據審稿人過去發表的論文跟投稿論文做語意相似度匹配，產生一個匹配分數。最終的分配結果是 bidding 偏好 + TPMS 匹配分數 + 負載均衡約束的加權最佳化。

### 利益衝突（COI）處理

NeurIPS 2025 對利益衝突的定義很具體，包括：

- 目前或過去的指導關係（advisor/advisee）
- 過去 3 年內有共同論文
- 目前在同一個機構任職
- 親屬或親密的個人關係

COI 在 OpenReview 裡是雙向的——如果你跟某篇論文的任何一位作者有 COI，你就看不到那篇論文。系統會自動偵測部分 COI（基於 OpenReview 個人檔案裡的歷史），但也依賴審稿人和作者主動申報。

### 每篇論文分配幾位審稿人？

各會議略有差異，但通常是 **3-4 位**：

- NeurIPS：通常 4 位 reviewer + 1 位 AC
- ICML：通常 3-4 位 reviewer + 1 位 AC
- ICLR：通常 3-4 位 reviewer + 1 位 AC
- CVPR：通常 3 位 reviewer + 1 位 AC

NeurIPS 2025 共動用了 20,518 位審稿人、1,663 位 AC、199 位 SAC 來處理 21,575 篇投稿——平均每位審稿人負責約 4.2 篇論文。

## 第四步：審稿（Review）

### 審稿時間

審稿人拿到論文後，通常有 4-6 週寫 review：

- NeurIPS 2025：5 月 29 日分配 → 7 月 2 日 review 到期（約 5 週）
- CVPR 2026：12 月 15 日分配 → 1 月 12 日 review 到期（約 4 週）
- ICLR 2026：review 在 11 月 11 日釋出給作者（投稿截止 9 月 24 日後約 7 週）

### 評分量表：三大會議的差異

這是各會議之間差異最大的地方。三大 ML 會議用的評分量表完全不同：

**NeurIPS 2025**：Overall 分數 1-6 分制
- 6 Strong Accept：技術無瑕、突破性影響
- 5 Accept：技術紮實、高影響
- 4 Borderline Accept：理由偏向接受
- 3 Borderline Reject：理由偏向拒絕
- 2 Reject：技術缺陷、評估薄弱
- 1 Strong Reject：已知結果或嚴重倫理問題

另外有 Quality、Clarity、Significance、Originality 四個維度各 1-4 分，以及 Confidence 1-5 分。

**ICML 2025**：Overall 分數 1-5 分制
- 5 Strong Accept
- 4 Accept
- 3 Weak Accept（偏向接受，但也可能被拒）
- 2 Weak Reject（偏向拒絕，但也可能被接受）
- 1 Reject

同樣有 Soundness、Significance、Novelty、Clarity 等維度各 1-4 分。

**ICLR 2026**：Overall 分數 1-10 分制
- 10 Top 5% of all papers：開創性
- 8 Top 15%：清楚接受
- 6 Marginally above threshold
- 5 Marginally below threshold
- 3 Clear reject
- 1 Trivial or wrong

加上 Soundness（1-4）、Presentation（1-4）、Contribution（1-4）、Confidence（1-5）。

量表不同，直覺上 ICLR 的 10 分制看起來比 NeurIPS 的 6 分制「精細」，但實際上 ICLR 大量論文集中在 5-7 分區間，有效解析度跟 NeurIPS 差不多。Paper Copilot 的統計顯示，ICLR 2024 全部投稿的 reviewer 平均分是 5.11（標準差 1.26），接受論文平均分是 6.44——一分之差就是接受與拒絕的分水嶺。

### 審稿人到底要看什麼

不管量表怎麼設計，各會議的 review form 都要求審稿人評估大致相同的核心維度：

1. **Technical Soundness / Quality**：方法是否正確？證明有沒有錯？實驗設計是否合理？
2. **Significance / Impact**：這個貢獻對社群有多重要？別人會不會拿去用或基於此繼續做？
3. **Originality / Novelty**：跟現有工作比，新在哪裡？NeurIPS 2025 特別強調：「originality does not necessarily require introducing an entirely new method」——用已有方法做出新 insight 也算。
4. **Clarity / Presentation**：寫得清不清楚？結構好不好？一位專家讀者能不能根據論文復現結果？
5. **Reproducibility**：有沒有提供足夠的實驗細節、程式碼、數據？

每位審稿人還需要寫一段 **Strengths and Weaknesses** 的文字評述，以及具體的 **Questions** 給作者——這些文字在 rebuttal 階段會直接影響作者的回覆策略。

## 第五步：Rebuttal / Author Response

Review 釋出後，作者有一段時間針對審稿意見撰寫回覆。各會議的 rebuttal 規則差異不小：

| 會議 | Rebuttal 時長 | 格式限制 | 互動方式 |
|---|---|---|---|
| NeurIPS 2025 | 1 週（7/24-7/30） | 無嚴格頁數限制 | 後續有 reviewer-author discussion 期（7/31-8/6） |
| ICML 2025 | 約 1 週 | 無嚴格頁數限制 | 通過 OpenReview 留言 |
| ICLR 2026 | 約 3 週（11/11-12/3 整個 discussion 期） | 無嚴格頁數限制，但可多 1 頁正文 | OpenReview 上公開討論，reviewer/AC/author 多方互動 |
| CVPR 2026 | 1 週（1/22-1/29） | **限 1 頁 PDF** | 用 CVPR 提供的 rebuttal 模板 |

CVPR 的 1 頁限制是最嚴格的——意味著作者必須極其精準地選擇回應哪些點，不可能逐條回覆。相比之下，ICLR 的 3 週 open discussion 是最寬鬆的，允許作者和審稿人來回多輪對話。

### Rebuttal 真的能翻盤嗎？

這是每個第一次投稿的人都會問的問題。2025 年一篇對 ICLR 2024 和 2025 兩屆審稿數據的分析（arXiv:2511.15462）給出了迄今最具體的數字：

- **Rebuttal 主要影響 borderline 論文**（reviewer 平均分在 5-6 之間的）
- **約 20% 的最終被接受論文，是因為 rebuttal 階段的分數上調而跨過門檻的**
- 初始分數和 co-reviewer 的評分是預測 rebuttal 後分數變化的最強因子——也就是說，如果一位審稿人看到其他審稿人打了高分，他更有可能在 rebuttal 後調高自己的分數（peer influence 效應）
- Reviewer 之間的分歧在 rebuttal 後確實會縮小，但不會完全消失

翻譯成白話：如果你的論文初始分數已經很低（所有 reviewer 都打 reject），rebuttal 基本上不會翻盤；如果初始分數已經很高，rebuttal 只是走個過場。Rebuttal 真正發揮作用的空間，是那些「有人覺得好、有人覺得不好」的 borderline 論文——而這恰好是數量最多的一群。

## 第六步：決策（Meta-review / AC Decision）

### AC → SAC → PC 三層架構

Rebuttal 和 discussion 結束後，整個決策權從審稿人轉移到**三層委員會架構**：

1. **Area Chair（AC）**：閱讀所有 review 和 rebuttal，寫 meta-review，給出初步 accept/reject 建議。AC 是整個流程裡最關鍵的角色——他們需要在 reviewer 意見分歧時做出判斷，必要時可以推翻 reviewer 的多數意見。NeurIPS 2025 的 PC 在反思文章裡明確說：「Many ACs fought for papers they thought were good even if reviewers disagreed, and often we followed their lead.」
2. **Senior Area Chair（SAC）**：每位 SAC 管一組 AC，負責確保 AC 的決策品質一致、處理 AC 之間的 calibration 問題。SAC 不直接讀每篇論文，但會檢查 meta-review 的論證是否充分。
3. **Program Chair（PC）**：最終把關。PC 通常會人工檢查所有「outlier」決策——比如 reviewer 分數很高但 AC 建議 reject，或者分數很低但 AC 建議 accept 的論文。

CVPR 的流程有一個獨特的環節：**AC triplet meeting**。三位負責相近主題的 AC 組成一個小組，在線上會議裡互相討論各自的 borderline 論文，確保同一個子領域的接受標準一致。CVPR 2026 的時程表顯示這個 triplet meeting 週安排在 2026 年 2 月 6-16 日，AC 的最終 meta-review 要在 2 月 17 日前提交。

### 一致性有多高？

NeurIPS 2014 做過一個著名的一致性實驗：從約 1,678 篇投稿中隨機抽出 10%（約 170 篇），讓兩組完全獨立的審稿委員會各自審一次。結果：

- **23% 的論文得到不一致的決策**（一組接受、另一組拒絕）
- **超過一半的 spotlight 推薦被另一組拒絕**
- 如果你手上有一篇被接受的論文，它在獨立重審後被拒絕的機率接近 **50%**

這個結果（後來被稱為「NeurIPS lottery」）至今仍是學術界討論審稿系統可靠性時最常引用的數據。它並不意味著審稿是隨機的——而是說 borderline 區間的論文，接受與拒絕之間的差距比多數人想像的要小得多。

## 第七步：Camera-Ready

收到 accept 通知後，作者有一段時間（通常 4-6 週）準備最終版本。Camera-ready 階段可以做的事：

- 取消匿名化——加回作者姓名、機構、致謝
- 根據 reviewer 意見修改內容（通常允許多 1 頁正文）
- 加入 funding disclosure（NeurIPS 強制要求）
- 上傳最終版程式碼和 supplementary material

不能做的事：大幅改變論文的核心貢獻或實驗結果。Camera-ready 是「根據審稿意見修訂」，不是「重寫論文」。

NeurIPS 2025 的 camera-ready 截止日是 2025 年 10 月 23 日，距離 9 月 18 日的 accept 通知約 5 週。

## ACL 系列的特殊機制：ARR 滾動審稿

ACL、EMNLP、NAACL 等 NLP 會議從 2021 年底開始採用 **ACL Rolling Review（ARR）**，跟上面描述的「單一 deadline」制度有根本性的不同。

### 兩步制：先審、後 commit

ARR 把投稿和發表拆成兩個獨立的步驟：

1. **Submit to ARR**：作者把論文提交到 ARR 這個共用平台，每個月有一個投稿 deadline。論文會分配到 reviewer 和 Action Editor（相當於 AC），跑完一輪標準審稿流程（review + author response + meta-review）。
2. **Commit to a venue**：拿到審稿結果後，作者決定要不要「commit」到某一場具體會議（例如 ACL 2025）。Commit 就是帶著已有的 review 去投會議，由會議的 SAC 和 PC 做最終 accept/reject 決策。

作者投稿 ARR 時可以選一個「preferred venue」，但這只用來計算接受率——選了 ACL 不代表必須 commit 到 ACL，反過來沒選 ACL 也可以 commit 到 ACL。

### 可以重投

ARR 的另一個關鍵特色是允許修改後重投：如果第一輪審稿結果不理想，作者可以修改論文後在下一個月的 deadline 重新提交。從 2024 年 12 月起，ARR 要求重投必須附上 revision summary（回應前一輪 review 做了什麼修改），否則可能被 desk reject。如果 ARR 分配到的 reviewer 跟上一輪相同，他們會看到作者的修改紀錄。

### 審稿人義務

2025 年 5 月起，ARR 強化了審稿人義務：所有作者都被預期要參與審稿，除非有例外（新人、資歷不足、已擔任其他職務）。被認定為「highly irresponsible」的審稿人（逾期未交 review、用 LLM 生成 review、語氣極不專業等），其名下的論文可能在當期和下一期被 desk reject——這是比其他會議都嚴格的連坐制度。

### 對接受率統計的影響

ARR 的兩步制讓「接受率」的計算變得模糊。以 ACL 2022 為例，官方自己就承認有兩種算法：

- 用「選定 ACL 為 preferred venue 的投稿數」當分母：701/3,378 = **20.75%**
- 用「實際 commit 到 ACL 的投稿數」當分母：701/1,918 = **36.54%**

這意味著拿 ACL 的接受率跟 NeurIPS 或 CVPR 的接受率直接比較時要非常小心——統計基礎完全不同。

## 完整時間軸對照

把整個流程串起來看，從投稿到最終見刊（conference presentation），各會議的時間軸大致如下：

**NeurIPS 2025**
| 日期 | 事件 |
|---|---|
| 5 月 11 日 | Abstract submission deadline |
| 5 月 15 日 | Full paper submission deadline |
| 5 月 22 日 | Supplementary material deadline |
| 5 月 17-21 日 | Reviewer bidding |
| 5 月 29 日 | 論文分配到審稿人，開始審稿 |
| 7 月 2 日 | Review 到期 |
| 7 月 24-30 日 | Author rebuttal |
| 7 月 31 日 – 8 月 6 日 | Reviewer-author discussion |
| 8 月 7-13 日 | Reviewer-AC discussion |
| 9 月 18 日 | Author notification |
| 10 月 23 日 | Camera-ready deadline |
| 12 月 | 會議舉辦 |

**從投稿到通知：約 4 個月。從投稿到 camera-ready：約 5 個月。**

**ICLR 2026**
| 日期 | 事件 |
|---|---|
| 9 月 19 日 | Abstract submission deadline |
| 9 月 24 日 | Full paper submission deadline |
| 11 月 11 日 | Reviews 釋出 |
| 11 月 11 日 – 12 月 3 日 | Author-reviewer-AC discussion |
| 1 月 25 日 | Paper decision notification |
| 4 月 23-25 日 | 主會議 |

**從投稿到通知：約 4 個月。**

**CVPR 2026**
| 日期 | 事件 |
|---|---|
| 11 月 6 日 | Abstract deadline |
| 11 月 13 日 | Paper submission deadline |
| 12 月 15 日 | 論文分配到審稿人 |
| 1 月 12 日 | Review 到期 |
| 1 月 12-22 日 | Emergency review period |
| 1 月 22 日 | Reviews 釋出 |
| 1 月 29 日 | Author rebuttal 到期 |
| 1 月 30 日 – 2 月 5 日 | AC-reviewer discussion |
| 2 月 6-16 日 | AC triplet meeting |
| 2 月 17 日 | Final AC meta-review 到期 |
| 2 月 20 日 | Final decisions to authors |
| 6 月 | 會議舉辦 |

**從投稿到通知：約 3 個月——是主流頂會裡最快的。**

## OpenReview：所有人都在的平台

上面提到的 NeurIPS、ICML、ICLR、CVPR 全部使用 **OpenReview** 作為投稿與審稿平台。OpenReview 的核心設計理念是公開透明，但各會議對「公開」的定義不太一樣：

- **ICLR**：最開放。投稿的論文、審稿意見、author response、meta-review 在 decision 之前就對公眾可見。任何人（不只是被分配的審稿人）都可以在 OpenReview 上留公開評論。
- **NeurIPS**：半公開。審稿過程中只有被分配的 reviewer/AC/SAC 能看到。Decision 公布後，accepted papers 的 review 和 meta-review 會公開（但 reviewer 匿名）；rejected papers 的作者可以選擇是否公開自己的審稿紀錄。
- **CVPR**：最封閉。「Reviews and author responses will never be made public, and we will not be soliciting comments from the general public during the reviewing process.」

ICLR 的公開審稿制是它區別於其他頂會最大的特色之一——任何人都可以去 OpenReview 上看一篇 ICLR 投稿的完整審稿過程，包括 reviewer 的原始意見、作者的逐條回覆、AC 的 meta-review，乃至 reviewer 之間的討論。這讓 ICLR 的審稿紀錄成為學術界研究同行評審機制本身的重要數據來源。

## 整體來說

一篇 AI 頂會論文從投稿到見刊，典型路徑是：匿名化投稿 → 格式審查 → reviewer bidding + 自動匹配 → 3-4 位審稿人獨立評分（4-6 週）→ author rebuttal（1-3 週）→ reviewer-AC discussion → AC meta-review → SAC calibration → PC 最終決策 → camera-ready 修訂。全程約 4-5 個月，CVPR 壓縮到約 3 個月。

這個流程有幾個值得記住的特徵：

- **評分量表因會議而異**：NeurIPS 的 6 分跟 ICLR 的 10 分不能直接換算，每個量表的 borderline 區間在不同位置
- **Rebuttal 不是萬能藥**：主要影響 borderline 論文，約 20% 的接受論文因此獲益；初始共識很差的論文幾乎翻不了盤
- **審稿一致性有天花板**：NeurIPS 2014 的實驗顯示 23% 的決策在獨立重審後會翻轉
- **ACL 系列走不同的路**：ARR 滾動審稿的「先審後 commit」機制讓整個流程更靈活，但也讓接受率統計變得難以跨會議比較

理解這些機制不只是為了投稿——當你在讀一篇頂會論文時，知道它經過了什麼樣的篩選過程，能幫助你更準確地校準對它品質的預期：它通過了嚴格的同行評議，但同行評議本身也有結構性的局限。

---

## 參考資料

- [NeurIPS 2025 Call for Papers](https://neurips.cc/Conferences/2025/CallForPapers)
- [NeurIPS 2025 Reviewer Guidelines（含完整 review form）](https://neurips.cc/Conferences/2025/ReviewerGuidelines)
- [NeurIPS Blog — Reflections on the 2025 Review Process from the Program Committee Chairs](https://blog.neurips.cc/2025/09/30/reflections-on-the-2025-review-process-from-the-program-committee-chairs/)
- [NeurIPS Blog — NeurIPS 2021: Changes to the Review Process（desk rejection 實驗結果）](https://blog.neurips.cc/2021/04/09/neurips-2021-changes-to-the-review-process)
- [ICML 2025 Reviewer Instructions](https://icml.cc/Conferences/2025/ReviewerInstructions)
- [ICML 2025 Peer Review FAQ](https://icml.cc/Conferences/2025/PeerReviewFAQ)
- [ICML 2026 Reviewer Instructions](https://icml.cc/Conferences/2026/ReviewerInstructions)
- [ICLR 2026 Author Guide](https://iclr.cc/Conferences/2026/AuthorGuide)
- [ICLR 2026 Call for Papers](https://iclr.cc/Conferences/2026/CallForPapers)
- [ICLR 2026 Dates and Deadlines](https://iclr.cc/Conferences/2026/Dates)
- [CVPR 2026 Author Guidelines](https://cvpr.thecvf.com/Conferences/2026/AuthorGuidelines)
- [CVPR 2026 Reviewer Guidelines](https://cvpr.thecvf.com/Conferences/2026/ReviewerGuidelines)
- [CVPR 2026 Reviewer Training Material（含完整 timeline）](https://cvpr.thecvf.com/Conferences/2026/ReviewerTrainingMaterial)
- [CVPR 2026 SAC Guide（含 AC triplet meeting 流程）](https://cvpr.thecvf.com/Conferences/2026/SACGuides)
- [ACL Rolling Review — Call for Papers](https://aclrollingreview.org/cfp)
- [ACL Rolling Review — Authors Guidelines](https://aclrollingreview.org/authors)
- [ACL Rolling Review — Changes to reviewer volunteering requirement and incentives in May 2025 cycle](https://aclrollingreview.org/incentives2025)
- [ACL 2025 Call for Papers（ARR + commit 兩步制說明）](https://groups.google.com/g/ml-news/c/9pXrq63VQ6c)
- [ACL 2022 Chair Blog Post — Rolling Review（接受率兩種算法官方說明）](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
- [Insights from the ICLR Peer Review and Rebuttal Process (arXiv:2511.15462)](https://arxiv.org/abs/2511.15462)
- [Paper Copilot — ICLR 2025 Statistics](https://papercopilot.com/statistics/iclr-statistics/iclr-2025-statistics)
- [The NeurIPS Experiment（NeurIPS 2014 一致性實驗）](https://inverseprobability.com/talks/notes/the-neurips-experiment-snsf.html)
