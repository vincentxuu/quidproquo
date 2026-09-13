---
title: "AI 論文從寫到投：結構、實驗設計、arXiv 投稿與會議抉擇的實戰指南"
date: 2026-09-13
category: ai
tags: [arxiv, paper-writing, submission, reproducibility, neurips, reforms, conference-submission, experimental-design, rebuttal, latex]
lang: zh-TW
tldr: "綜合 arXiv 官方指引、NeurIPS Reproducibility Checklist、REFORMS 框架（8 模組 32 項）與五大頂會投稿政策，從論文結構、實驗設計紅線、arXiv 投稿流程到會議 vs. 直投的抉擇框架，一份可以直接拿來檢查自己論文的完整指南。"
description: "寫一篇 AI 論文並投上 arXiv 需要跨越多少關卡？從論文結構與實驗設計、RE-FORMS 與 NeurIPS 雙檢查清單、arXiv 的 2026 年 endorsement 新制與分類選擇、五大頂會（NeurIPS/ICML/ICLR/CVPR/ACL）的 arXiv 預印本政策差異，到 rebuttal 策略與 camera-ready 準備。本文以最新官方來源為基礎，整理一套從寫到投的完整決策框架。"
draft: false
---
> 🌏 [English version](/en/posts/ai/2026-09-13-writing-ai-paper-arxiv-submission)

## TL;DR

寫 AI 論文並投稿 arXiv 有四個層面的作業，本文一次拉齊：

1. **論文結構**：Abstract 到 Limitations 每節該放什麼、不該放什麼
2. **實驗設計**：NeurIPS Reproducibility Checklist（16 題） + REFORMS（8 模組 32 項）雙重檢核
3. **arXiv 投稿**：2026 年 endorsement 新規、分類選擇、授權、版本管理
4. **會議 vs. 直投**：五大頂會最新預印本政策差異、建議策略

所有主張均有官方來源可追。每一節末尾附有可直接使用的 checklist。

## 情境

你可能跟這個網站的大多數讀者一樣：有 RAG 系統或 agent 的實作經驗，讀了上百篇論文後，開始覺得「這個改進值得寫成論文」。但從實作到論文之間有一條模糊的鴻溝——實驗要做多完整？baseline 要列幾個？code 要不要附？arXiv 要選哪個分類？

這篇不是學術寫作教科書（那類資源已經很多），而是**從 AI/ML 工程師的視角，把投稿所需的檢查項目一次攤開**。

## 論文結構：每節的任務與陷阱

AI/ML 論文的標準結構已經相當固定（NeurIPS/ICML/ICLR 的 author kit 都有規範），但常見的問題往往不是「少了哪節」，而是「節裡的內容不對」。

### Abstract（摘要）

**任務**：讓讀者在 30 秒內決定是否要讀完整篇。  
**內容**：問題陳述 → 方法的核心 idea → 主要結果（含數字）→ 貢獻 1-2 句。  
**陷阱**：
- 寫了方法但沒寫結果——不告訴我效果多好，我為什麼要讀下去
- 只寫了動機沒寫解法——沒告訴我你到底做了什麼
- 誇大措辭（"first-ever", "significant breakthrough"）——reviewer 會直接對應到論文的實際結果，差距太大就是紅旗

### Introduction（引言）

**任務**：讓讀者知道這是一個真實的問題、現有方法不夠好、你的方法合理且有效。  
**內容**：問題背景 → 現有方法的不足（引文）→ 你的方法 2-3 句 → 貢獻清單 → 論文組織。  
**陷阱**：
- Related work 寫進 Introduction——這會讓 Introduction 又長又難讀，related work 有自己的位置
- 貢獻清單變成功能清單——「我們提出了 X 框架」不是貢獻，「X 框架在 Y 基準上超越了 Z 方法 by 5.2%」才是

### Related Work（相關工作）

**任務**：定位你的工作在文獻中的位置，並展示你知道這個領域的現狀。  
**內容**：按主題分組（而非按時間順序列舉），每組討論代表性方法及其不足。  
**陷阱**：
- 只列舉不評論——變成參考文獻列表，reviewer 會覺得你沒讀懂
- 把有論文做的事寫成「沒有人做過」——這幾乎一定被 reviewer 抓到，因為 reviewer 可能就是做那個方向的人

### Method（方法）

**任務**：讓一個該領域的研究生能完全複現你的方法。  
**內容**：正式問題定義、模型架構（圖）、訓練目標、推理流程、關鍵實作細節。  
**陷阱**：
- 缺少實作細節——learning rate、batch size、optimizer、warmup、dropout 這些被認為「大家都知道」的參數，複現時缺一個就可能差 3-5 個百分點
- 圖畫得太簡單或太複雜——好的圖應該在沒有人讀文字的情況下，也能讓讀者知道這個方法的大致架構

### Experiments（實驗）

**這是論文最關鍵的 section，也是最多問題的地方。**

**任務**：證明你的方法比 baseline 好，而且你知道為什麼。  
**內容**：設定（dataset、metric、實作細節）→ 主要結果（表/圖）→ 分析（ablation study、可視化、case study）。  

**關於 key results table 的格式**：NeurIPS 2026 的 author kit 規定 key results table **必須出現在 main paper 內，不能放到 appendix**。這個要求常見於頂會——reviewer 進 rebuttal 時幾乎不再讀 appendix，如果你的主要結果躲在 appendix 裡等於沒寫。

**陷阱**（以下每個都是一個紅旗）：
- Baseline 超過 2 年以上——領域進展很快，用舊 baseline 是 cherry-pick
- 只用自製 dataset 測試——無法公平比較
- 只有最有利的 metric——選擇性報告
- 沒有 error bar——結果可能是隨機波動
- Baseline 是用預設參數跑的，自己的方法調了半天——這是最常見的不公平比較
- Key results table 放在 appendix——reviewer 看不到等於沒放

### Limitations（限制）

**任務**：誠實討論方法的適用邊界。  
**內容**：哪些場景效果不好、理論上的限制、未來可以改進的方向。  
**陷阱**：
- 寫成「未來工作」——「未來可以應用到 X 領域」不是 limitation
- 不寫——這已經變成 red flag，頂會 reviewer 會質疑你的自知之明

### Broader Impact（社會影響）

NeurIPS 2020 起要求。**任務**：討論你的工作可能帶來的正負面社會影響。  
**內容**：潛在的濫用風險、偏見問題、環境成本。  
**陷阱**：
- 只寫正面、避談風險——reviewer 會認為你沒認真思考
- 寫得太空泛——「可能對社會有影響」跟沒寫一樣

## 實驗設計標準：你必須檢查的兩份清單

### NeurIPS ML Reproducibility Checklist

這是 NeurIPS 自 2022 年開始要求作者隨 submission 附上的檢查清單。2026 年版已演進為 16 道**條件式問題**（每個題目會根據你的答案，顯示後續相關問題）：

| 面向 | 關鍵問題 |
|------|----------|
| **資料準備** | Dataset 是否有明確的 persistent identifier？使用了標準 benchmark 還是自製？train/val/test 切分方式有無完整描述？ |
| **程式碼** | Code 是否公開？commit hash 或 DOI 可精確指向版本？README 有無完整複現步驟？ |
| **硬體與環境** | 是否揭露了 GPU 型號、RAM、OS、套件版本？有無提供 reproduction script？ |
| **計算成本** | 是否報告了訓練時長與總計算量？ |
| **實驗設定** | Hyperparameter search range 與最終值有無報告？random seed 有幾個？有無 error bar 或 confidence interval？ |
| **Baseline 比較** | Baseline 是否近期（12-18 個月內）？是作者自己跑的還是從論文抄的數字？計算預算是否相當？ |
| **Ablation** | 是否針對每個關鍵組件做了 ablation？ |
| **資料洩漏** | 與訓練資料分離是否在預處理之前？訓練與測試間有無相依樣本（同一患者多筆資料）？每個 feature 是否合理、不是 outcome 的 proxy？ |
| **Limitations** | 有無展示失敗案例？有無誠實討論限制？ |

完整的清單原文在 [NeurIPS Paper Checklist Guidelines](https://neurips.cc/publication/PaperChecklistGuidelines)，投稿前一定要逐題回答，不要勾完就忘。

### REFORMS Framework（arXiv:2308.07832）

REFORMS（Reporting Standards for ML Based Science）由 Princeton 的 19 位研究者共同提出，2024 年發表於 *Science Advances*（DOI: 10.1126/sciadv.adk3452），針對的是**用 ML 做科學發現**的論文（不完全適用於純方法論論文）。共 8 個模組、32 項檢查項目：

**Module 1：研究目標（3 項）**
- 1a：科學主張所針對的母群體或分布
- 1b：選擇此母群體的理由
- 1c：在此研究中使用 ML 方法的理由

**Module 2：計算可複現性（5 項）**
- 2a：Dataset 的永久連結或 DOI
- 2b：Code 的 commit tag 或 DOI
- 2c：運算基礎設施（硬體、OS、套件版本）
- 2d：README 包含完整複現步驟
- 2e：Reproduction script 能產出所有結果

**Module 3：資料品質（7 項）**
- 3a：資料來源細節（時間、地點、收集/標註過程）
- 3b：抽樣框架與方法
- 3c：為什麼這個 dataset 適合建模任務
- 3d：outcome variable 的定義與描述統計
- 3e：樣本數（總數 + 各類別）
- 3f：缺失值比例（依類別分層）
- 3g：評估用 dataset 是否能代表母群體

**Module 4：資料預處理（3 項）**
- 4a：排除哪些資料與理由
- 4b：如何處理不可能或損壞的樣本
- 4c：所有資料轉換的完整順序（含缺失值填補、標準化、擴增），**data-dependent 轉換必須在切分之後進行**

**Module 5：建模（6 項）**
- 5a：模型描述（輸入、輸出、類型、loss function）
- 5b：選擇此模型類型的理由
- 5c：評估方法（cross-validation、held-out、external）
- 5d：模型選擇方法
- 5e：Hyperparameter 選擇方法（搜尋範圍 + 最終值）
- 5f：Baseline 是否適當且公平調參

**Module 6：資料洩漏（3 項）**
- 6a：Train-test 分離是否維持（預處理和建模只用訓練資料的資訊）
- 6b：訓練與測試集之間有無相依或重複樣本
- 6c：每個 feature 是否對任務合理、非 outcome 的 proxy

**Module 7：指標與不確定性量化（3 項）**
- 7a：使用的所有 performance metrics，含中間決策用指標
- 7b：每個 metric 的不確定性估計（標準差、CI、bootstrap）
- 7c：統計檢定的選擇理由（若有使用）

**Module 8：泛化能力與限制（2 項）**
- 8a：外部驗證結果（或承認缺乏）
- 8b：作者預期研究結果不適用的情境

REFORMS 的完整清單在 [reforms.cs.princeton.edu](https://reforms.cs.princeton.edu)。

### 兩份清單的使用方式

NeurIPS Checklist 是你的**最低門檻**——投稿前必須逐題回答。REFORMS 是較詳細的學術報告標準，如果你的論文涉及「ML 應用於科學發現」（而非純方法論），建議兩份都跑一遍。

**實戰建議**：先用 NeurIPS 16 題確保沒漏掉基本項目，再用 REFORMS 的 8 模組檢查深度。兩份清單過完後，如果超過 3 項未勾選（依 CodeSOTA 的建議），將結果視為「初步且未驗證」。

## arXiv 投稿流程：從 endorsement 到版本管理

### Endorsement：2026 年新規

arXiv 自 2004 年起要求首次投稿者須經 endorsement。2026 年 1 月 21 日，arXiv 更新了政策（[官方公告](https://blog.arxiv.org/2026/01/21/attention-authors-updated-endorsement-policy/)）：**僅有機構 email 已不足以取得 endorsement**。

現在新的首次投稿者必須滿足以下之一：
1. **機構 email + 同領域先前作者身份**：須同時擁有學術機構 email，且在 arXiv 上已有同領域的共同作者記錄（需透過 arXiv authority system 認領）
2. **個人背書**：由同領域的活躍 arXiv 作者直接背書。每位背書者必須在該領域有 3 個月到 5 年內的論文記錄

對研究生來說，最簡單的路徑是找 advisor 背書——只要 advisor 在 arXiv 上有同領域論文即可。

Endorsement 是領域限定的——cs 的背書不能用在 math。

### 分類選擇

arXiv 的分類是階層式的：主分類（cs、math、stat）→ 子分類。AI/ML 相關的主要子分類：

| 分類 | 適合 |
|------|------|
| cs.AI | 專家系統、知識表示、規劃、不確定性推理 |
| cs.LG | 監督/非監督/強化學習、bandit、可解釋性、公平性、方法論 |
| cs.CL | 自然語言處理、語言模型、文字處理 |
| cs.CV | 電腦視覺 |
| cs.IR | 資訊檢索（含 RAG） |
| cs.MA | 多 agent 系統 |
| cs.RO | 機器人 |
| stat.ML | 機器學習的統計觀點 |

**建議**：選一個主要分類，cross-list 2-3 個相關分類。Moderator 若認為分類不當，有權重新分類（被移到 `cs.general` 在社群中被視為降級）。

### 授權選擇

arXiv 提供多種授權選項，選擇後**不可撤銷**：

| 授權 | 適用場景 |
|------|----------|
| arXiv non-exclusive license 1.0 | 最安全的預設選項 |
| CC BY 4.0 | 許多出版社接受預印本採 CC BY |
| CC BY-NC-SA 4.0 | 非商業使用，改作須相同授權 |
| CC BY-NC-ND 4.0 | 接受 manuscript 的出版社常見要求 |
| CC0（公眾領域） | 與多數出版社的著作權轉移衝突 |

**實務建議**：多數人選 arXiv non-exclusive license。如果同時要投會議，先確認會議對 preprint license 的要求。

### 版本管理

| 操作 | 規則 |
|------|------|
| 更換版本 | 每週最多一次 |
| v5 之後 | 仍可每週換一次，但不再出現在 daily email |
| 同日修改 | 美東時間 14:00 前修改不產生新版本；14:00 後會延遲公告 |
| 撤稿 | 產生 withdrawn 版本，前版仍公開，無 PDF 下載 |
| Journal-ref | 接受發表後可加入 journal DOI（不產生新版本） |

### Moderation 常見被拒原因

arXiv 的 moderator 是志願領域專家（具終端學位），約 6% 投稿被 hold、約 2% 被拒（[Scientific American 報導](https://www.scientificamerican.com/article/arxiv-org-reaches-a-milestone-and-a-reckoning)）。常見原因：

- 格式不合（行號、水印、廣告、margin notes、referee remarks）
- 非學術內容（課程作業、研究提案、新聞評論）
- 抄襲或偽造資料
- 不當圖片（暴力、色情、具爭議性的 "Lena" 圖）
- 未報告重要的生成式 AI 使用
- AI 列為作者
- 投稿頻率過高（每日上限 3 篇）
- 版權衝突（附帶禁止 arXiv 散布的著作權聲明）

### HTML 生成

arXiv 自 2023 年 12 月起，對所有 TeX/LaTeX 投稿自動生成 HTML 版本（基於 NIST 的 LaTeXML）。HTML 版本在可讀性與無障礙支援上遠優於 PDF。

**對作者的建議**：使用 LaTeXML 支援的套件（[GitHub 清單](https://github.com/dginev/LaTeXML-packages)），避免 tikz 等不完全支援的套件，為圖片加 `alt` 文字。設定 Overleaf 的 compiler 為 "stop on errors"。

## 會議投稿 vs. arXiv 直投：五大頂會的政策差異

這是很多第一次投稿的人最困惑的問題。arXiv 不可取代會議，會議也不該取代 arXiv。所有頂會現在都允許 arXiv 預印本與投稿並行，但限制各有不同。

### 五大頂會 2024-2026 預印本政策比較

| 面向 | NeurIPS | ICML | ICLR | CVPR | ACL |
|------|---------|------|------|------|-----|
| 審查期間可 arXiv？ | ✅ 可 | ✅ 可 | ✅ 可 | ✅ 可 | ✅ 可，**2024 起取消匿名期** |
| 宣傳限制 | 不可標註 "Under review at NeurIPS" | 最嚴格，「under no circumstances」可廣告 | 最寬鬆，OpenReview 公開討論 | 媒體 embargo | 無額外限制 |
| 雙盲影響 | Reviewer 被要求不要搜尋 | 投稿版不可引用非匿名版本 | 第三人稱自引即可 | arXiv 不視為 prior art | Reviewers 須揭露外部知識 |
| Camera-ready | 允許 +1 頁 | 允許 +1 頁 | 同頁數限制 | 2026: 2 週 embargo | Footnote 先前預印本 |

**關鍵更新**：ACL 在 2024 年 1 月做出了重大改變——**完全取消匿名期**，作者可以在任何時間發布非匿名預印本。Reviewers 須揭露外部知識，爭議時偏向匿名投稿的論文。這是目前最開放的制度。

### arXiv 與會議時程對比

| 面向 | 會議 | arXiv |
|------|------|-------|
| 速度 | 4-6 個月 | 1-3 工作天（中位數 1 天） |
| 速度比 | — | 約 100-150 倍 |
| 引用效應 | Proceedings 中位引用較高 | 早發 arXiv 可多 +65% 引用（Feldman et al., 2018） |
| 同儕審查 | 約 25% 的重大錯誤能被抓到（Godlee et al., 1998） | 無 |

### 建議策略：同步投稿

對多數論文來說，最優策略是**同時**投稿會議與 arXiv：

```
Day 0:        投稿會議 + 發布 arXiv v1（同版本，刪除作者名 for double-blind）
Review 期間:  納入社群回饋 → arXiv v2
Rebuttal:     回應 reviewer → arXiv v3（若時間允許）
接受後:       Camera-ready 作為最終 arXiv 版本（遵守 embargo）
後續:         在 arXiv 的 Comments 欄位加入 conference DOI
```

**arXiv 的時戳優先權對抗 scooping 非常有效**。論文 SiLU（2016 arXiv）vs. Swish（2017 Google）是同一個函數的經典案例——arXiv 時戳建立了優先權（Paul Ginsparg）。

### 什麼時候只投 arXiv 就夠

- 需要快速傳播的研究（安全漏洞、新 benchmark、負面結果）
- 會議 deadline 趕不上
- 工作屬於 survey/replication/preliminary
- 不需要倚賴正式出版來晉升

## Rebuttal：回應 reviewer 的實戰原則

會議 rebuttal 通常是審查後一週內、有字數限制（NeurIPS 常見每則 reviewer 回覆字數限制，ICML 總共 5000 字）。以下原則來自各會議官方指引與資深研究者的實務經驗：

### 結構

```
Reviewer X 的所有意見
└─ Q1: "不清楚 Y 的設計選擇"
   └─ 感謝 reviewer 的提問 → 澄清原始設計，引用論文章節
   └─（若有必要）補充實驗結果
└─ Q2: "為何不跟 Z 比較"
   └─ 承認這是好建議 → 說明 Z 的適用情境差異
   └─（若時間夠）補上實驗
```

**核心原則**（Niklas Elmqvist、Matt Might 等經驗總結）：
- **每則 comment 都要回**——跳過不回的會被 reviewer 標記
- **不要對抗 reviewer**——「你說錯了，我們的論文寫得很清楚」這種語氣在 rebuttal 裡是災難
- **區分 clarify 與 experiments**——被誤解時優先解釋清楚；需要補實驗時誠實說能否在 rebuttal 期限內完成，並在 camera-ready 中補上
- **不要誇大**——「我們完全解決了這個問題」對上 actual reviewer 會覺得你沒讀懂他的批評

## Camera-Ready 準備

接受後到 camera-ready 截止通常有 3-5 週。主要事項：

- **Page limit**：NeurIPS/ICML 允許 +1 頁，ICLR 同頁數
- **改作者名**：從雙盲版本恢復（少數會議可能限制作者數量的變更，如 CVPR 2026 規定最多增加 1 位作者）
- **附 NeurIPS Checklist**：與主論文一起上傳
- **影片**：ICLR 等會議要求 5 分鐘 presentation video
- **Code submission**：部分會議鼓勵或要求附 code
- **Syncing with arXiv**：將 camera-ready 版本同步到 arXiv，注意是否有 embargo 期間

## 整體來說

寫一篇 AI 論文並成功投稿是一個多階段的工程，從結構、實驗、審查到版本管理每一步都有對應的規格。最有效率的策略是一次拉齊所有檢查清單再開始寫，而不是寫完才回頭補實驗。

核心主張：**NeurIPS Reproducibility Checklist 是你的最低門檻，REFORMS 你的深度檢查，arXiv 官方文件是投稿操作手冊，而會議政策是你的策略框架**——四者缺一不可。

## 參考資料

### arXiv 官方文件
- [arXiv endorsement 制度](https://info.arxiv.org/help/endorsement.html)
- [Attention Authors: updated endorsement policy (Jan 2026)](https://blog.arxiv.org/2026/01/21/attention-authors-updated-endorsement-policy/)
- [arXiv Category Taxonomy](https://arxiv.org/category_taxonomy)
- [arXiv License Information](https://info.arxiv.org/help/license/index.html)
- [Submission Version Availability](https://info.arxiv.org/help/versions.html)
- [To replace an article](https://info.arxiv.org/help/replace.html)
- [Withdrawing an article](https://info.arxiv.org/help/withdraw.html)
- [arXiv moderation](https://info.arxiv.org/help/moderation/index.html)
- [LaTeX Markup Best Practices for Successful HTML Papers](https://info.arxiv.org/help/submit_latex_best_practices.html)
- [HTML papers on arXiv: why it's important, and how we made it happen (Feb 2024)](https://arxiv.org/html/2402.08954v1)

### Reproducibility 與報告標準
- [NeurIPS Paper Checklist Guidelines](https://neurips.cc/publication/PaperChecklistGuidelines)
- [REFORMS: Reporting Standards for ML Based Science (arXiv:2308.07832, Science Advances 2024)](https://arxiv.org/abs/2308.07832)
- [REFORMS 官方網站](https://reforms.cs.princeton.edu)
- [ML Reproducibility Checklist 2026 (NeurIPS)](https://arxiv.org/html/2605.17273v1)
- [Questionable Practices in Machine Learning (arXiv 2407.12220)](https://arxiv.org/pdf/2407.12220v1)
- [Princeton Reproducibility Crisis in ML-based Science](https://reproducible.cs.princeton.edu)
- [CodeSOTA — How to Read an ML Paper](https://www.codesota.com/guides/reading-ml-papers)

### 會議投稿政策
- [NeurIPS Call for Papers 2026](https://neurips.cc/Conferences/2026/MainTrackHandbook)
- [ICML 2026 Author Instructions](https://icml.cc/Conferences/2026/AuthorInstructions)
- [ICLR 2026 Author Guide](https://iclr.cc/Conferences/2026/CallForPapers)
- [CVPR 2026 Author Guidelines](https://cvpr.thecvf.com/Conferences/2026/AuthorGuidelines)
- [ACL Anonymity Policy (2024 修訂)](https://www.aclweb.org/adminwiki/index.php/ACL_Anonymity_Policy)

### 引用影響與會議 vs. arXiv 研究
- [Feldman, Lo, Ammar (2018) — 65% citation advantage for arXiv-first (arXiv:1805.05238)](https://arxiv.org/abs/1805.05238)
- [Elazar et al. (2024) — Causal effect of arXiving on acceptance <4% (arXiv:2306.13891)](https://arxiv.org/abs/2306.13891)
- [Mishkin, Tabb, Matas (2020) — arXiving helps everyone (arXiv:2010.05365)](https://arxiv.org/abs/2010.05365)
- [Gloire & Mitra (2026) — LLM de-anonymization 42% accuracy (arXiv:2608.05157)](https://arxiv.org/abs/2608.05157)

### Rebuttal 與寫作指引
- [How to Read a Paper — S. Keshav (ACM SIGCOMM CCR, 2007)](http://ccr.sigcomm.org/online/files/p83-keshavA.pdf)
- [Ten Simple Rules for Writing a Response to Reviewers — William Stafford Noble (PLOS CB, 2017)](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005730)
- [Writing Rebuttals — Niklas Elmqvist (Medium, 2016)](https://medium.com/@elmqvist/writing-rebuttals-bb73e5f44a6e)
- [How to Write a Rebuttal Letter — Matt Might](http://matt.might.net/articles/how-to-rebut/)
- [站內：大家怎麼讀 arXiv 論文？方法論與工具全景](/posts/ai/2026-05-23-how-to-read-arxiv-papers)
- [站內：arXiv 論文品質判讀指南](/posts/ai/2026-05-28-arxiv-paper-quality-guide)
- [站內：別人怎麼用 LLM 寫文章](/posts/ai/2026-05-10-llm-writing-pipeline-learnings)