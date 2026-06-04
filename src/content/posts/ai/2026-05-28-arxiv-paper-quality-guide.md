---
title: "arXiv 論文品質判讀指南：從 endorsement 機制到實戰 checklist"
date: 2026-05-28
category: ai
type: guide
tags: [arxiv, paper-reading, research-tools, reproducibility, llm]
lang: zh-TW
tldr: "arXiv 不做 peer review，約 2% 投稿被拒。判斷品質靠外部信號：頂會收錄 > 機構 + 開源復現 > 引用品質。附 20 項實戰 checklist 和 2026 年工具箱（PWC 已關閉）。"
description: "拆解 arXiv 的 endorsement 與 moderation 機制，整理外部品質信號金字塔、紅旗清單、ML 可復現性危機，以及 2026 年適用的論文評估工具和 checklist。"
draft: false
---

每天有超過 1,000 篇論文上傳到 arXiv。「arXiv 不是 peer review」這句話大家都聽過，但它的 endorsement 和 moderation 到底擋掉了什麼、放進了什麼？這篇整理 arXiv 自身的品質機制、外部信號的判讀方式、2026 年還能用的工具，以及一份讀完論文該打勾的 checklist。

## arXiv 的兩道守門員

### Endorsement：信任網路，不是品質認證

arXiv 自 2004 年起要求首次投稿者須經 endorsement。依 [arXiv 官方說明](https://info.arxiv.org/help/endorsement.html)，endorser 的責任是：

> "You should not endorse the author if the author is unfamiliar with the basic facts of the field, or if the work is entirely disconnected with current work in the area."

換句話說，endorser 確認的是「這個人屬於科學社群」，不是「這篇論文是對的」。來自公認學術機構的新作者通常自動獲得 endorsement，實務上根本不會碰到這道關卡。

### Moderation：格式審查，不是內容審查

依 [arXiv moderation 政策](https://info.arxiv.org/help/moderation/index.html)，moderator 是志工領域專家，擁有終端學位。他們可以：

- **重新分類**：移至更適合的類別（移至 `general` 類別在社群中被視為降級）
- **拒絕投稿**：格式不合、非研究論文（課程作業、研究提案）、抄襲、投稿頻率過高（上限每天 3 篇）

據 [Scientific American 報導](https://www.scientificamerican.com/article/arxiv-org-reaches-a-milestone-and-a-reckoning)，約 6% 投稿被 hold，約 2% 被拒。對比 Nature/Science 低於 10% 的接受率，arXiv 的門檻明顯不在同一個量級。

一旦論文公告，即成為永久學術紀錄。arXiv 僅在授權問題時移除，違反政策時會 withdraw 但 metadata 保留。

**結論**：能上 arXiv 只代表格式合格、作者屬於學術社群。品質判斷必須靠外部信號。

## 外部品質信號金字塔

```
        ┌──────────────────┐
        │  頂會收錄 (最強)   │  NeurIPS / ICML / ICLR / ACL / CVPR
        ├──────────────────┤
        │ 知名機構 + 開源復現 │  DeepMind / FAIR / 有可跑的 code
        ├──────────────────┤
        │    引用品質        │  Highly Influential Citations > 絕對數字
        ├──────────────────┤
        │  純 arXiv，無佐證  │  需自行驗證
        └──────────────────┘
```

### 會議收錄：最直接的背書

論文首頁標註 "Accepted at NeurIPS 2025" 代表通過了 3-4 位 reviewer 的同行審查。AI/ML 領域主要會議：

| 等級 | 會議 | 接受率 |
|---|---|---|
| Tier 1 | NeurIPS, ICML, ICLR | ~20-25% |
| Tier 1 | ACL, EMNLP（NLP）; CVPR, ICCV（CV） | ~20-25% |
| Tier 2 | AAAI, IJCAI, AISTATS, UAI | ~25-30% |

沒有會議標註不代表論文差——很多工業界技術報告和基礎模型論文（如 GPT-4、Llama）選擇不投會議。但如果一篇宣稱突破性結果的論文既沒有會議收錄、也沒有知名機構背書，就需要格外謹慎。

### 引用指標：看品質，不看數量

[DORA 宣言](https://sfdora.org/read) 明確反對以 Impact Factor 作為個別論文品質的代理指標。更有意義的做法：

- **Semantic Scholar 的 "Highly Influential Citations"**：區分「related work 順便提一句」和「方法真正建立在此基礎上」
- **引用圖譜**：被 30 個獨立團隊延伸方法，比被 200 篇論文在 related work 提到更有價值
- **新論文看引用數沒有意義**：發表 6 個月內，引用數還沒累積起來

### 開源復現：沒 code 是負面信號

2025 年之後，不附程式碼已經從「中性」變成「負面信號」。但要注意：有 GitHub 連結但 README 之後零 commit，是已知的表面功夫模式。真正有價值的是能跑起來、有明確 seed 和環境設定的 repo。

## 2026 年的論文評估工具箱

Papers With Code 於 2025 年 7 月被 Meta 關閉，曾追蹤 79,817 篇論文、9,327 個 benchmark、5,628 個 dataset 的整合體驗不復存在（[CodeSOTA 記錄](https://www.codesota.com/papers-with-code)、[TIB-Blog 報導](https://blog.tib.eu/2025/10/02/papers-with-code-went-offline-the-knowledge-doesnt-have-to)）。以下是目前可用的替代組合：

| 工具 | 用途 | 免費 |
|---|---|---|
| [Semantic Scholar](https://www.semanticscholar.org) | 引用品質分析（Highly Influential Citations）、TLDR 摘要、200M+ 論文索引 | ✅ |
| [Connected Papers](https://www.connectedpapers.com) | 從種子論文視覺化探索相關領域（基於相似度，非引用圖） | 每月 5 張圖 |
| [OpenReview](https://openreview.net) | 直接看 ICLR 等會議的 reviewer 意見和評分 | ✅ |
| [HF Daily Papers](https://huggingface.co/papers) | AI 領域每日熱門論文、社群投票 | ✅ |
| [CodeSOTA](https://www.codesota.com) | PWC 精神繼承者，SOTA leaderboard（有復現驗證） | ✅ |
| [ar5iv](https://ar5iv.labs.arxiv.org) / arXiv HTML | 論文 HTML 版，比 PDF 好讀好搜尋 | ✅ |
| [DBLP](https://dblp.org) | 確認作者發表紀錄、查會議論文列表 | ✅ |

### 推薦工作流

```
發現 ─→ HF Daily Papers / Semantic Scholar / X
  ↓
篩選 ─→ 作者、機構、會議收錄標記
  ↓
評估 ─→ OpenReview 審稿意見 / S2 引用品質
  ↓
延伸 ─→ Connected Papers 相關工作 / DBLP 作者紀錄
  ↓
驗證 ─→ CodeSOTA / GitHub / HF Models 找實作
```

## 紅旗清單

### 論文本體

| 紅旗 | 為什麼是問題 |
|---|---|
| Related work 引用了不存在的論文 | AI 生成痕跡，全文可信度歸零 |
| 只在自製 dataset 上測試 | 無法與其他方法公平比較 |
| 沒有 ablation study | 不知道哪個組件真正有貢獻 |
| 只報告最有利的 metric | 選擇性報告 |
| 沒有 error bar / confidence interval | 結果可能是隨機波動 |
| Baseline 超過 2 年前 | 比較不公平 |
| 宣稱大幅超越 SOTA 但無程式碼 | 無法驗證 |
| Abstract 與 Results 表格數字差距大 | 過度包裝 |

### arXiv 特有陷阱

- **Version bombing**：短期內頻繁更新版本，可能在偷偷修正被發現的問題
- **被移至 general 分類**：通常是 moderator 的降級處理
- **自引灌水**：大量引用自己先前的未審查 arXiv 論文
- **引用卡特爾**：一群作者互相引用灌水——依 [arXiv 2509.07257](https://arxiv.org/html/2509.07257v2) 的調查，citation cartel 已是學術出版的系統性問題

## ML 可復現性：63.5% 的成功率

依 Raff (2019) 的研究，嘗試獨立復現 255 篇論文的成功率僅 63.5%（[Princeton 復現性危機專頁](https://reproducible.cs.princeton.edu)）。主要原因：缺少程式碼、未報告 hyperparameter、random seed 影響、framework 版本差異。

[arXiv 2407.12220](https://arxiv.org/pdf/2407.12220v1) 列出了 43 種 Questionable Research Practices (QRPs)，其中最常見的包括：

- **Train/test leakage**：訓練資料汙染了測試集
- **Benchmark contamination**：LLM 預訓練時可能已見過 benchmark 資料
- **不公平 baseline 比較**：對自己的模型精心調參，對 baseline 用預設值
- **選擇性 metric 報告**：只報告表現最好的指標

NeurIPS 已採用 [ML Reproducibility Checklist](https://arxiv.org/html/2605.17273v1)，REFORMS framework 則提供了涵蓋 8 個模組、32 項的完整 checklist（[arXiv 2308.07832](https://arxiv.org/pdf/2308.07832v2.pdf)）。

## 實戰 checklist：讀完一篇 arXiv ML 論文該打的勾

綜合 REFORMS checklist、ML Reproducibility Checklist 和 [CodeSOTA 指南](https://www.codesota.com/guides/reading-ml-papers)：

**Datasets**
- [ ] 使用了該任務的標準 benchmark
- [ ] 資料前處理有足夠細節可復現
- [ ] train/val/test 切分是標準的還是自定義的

**Baselines**
- [ ] baseline 是近期的（12-18 個月內）
- [ ] baseline 是作者自己跑的，不是從其他論文抄數字
- [ ] baseline 使用了相同的計算預算

**Metrics & 統計**
- [ ] 報告了該任務的所有標準 metrics
- [ ] 有 error bar 或 confidence interval
- [ ] 有報告計算成本和推理速度

**Reproducibility**
- [ ] 程式碼公開可用
- [ ] hyperparameter 完整列出
- [ ] 訓練硬體和時長已揭露

**Integrity**
- [ ] 有 data leakage / contamination 分析
- [ ] 有展示失敗案例（不是只放成功的）
- [ ] limitations 誠實討論了局限性
- [ ] ablation study 測試了所有關鍵組件

依 CodeSOTA 的建議：如果超過 3 項未勾選，將結果視為「初步且未驗證」。

## 整體來說

判斷 arXiv 論文品質是一種需要練習的技能。核心原則：**arXiv 的門檻只擋格式，品質判斷靠你自己**。

最有效率的做法是從外部信號開始篩（會議收錄、機構、開源），通過初篩的再用 checklist 細看實驗設計。工具會換（PWC 的關閉就是最好的例子），但「看 baseline 是否公平、看 ablation 是否完整、看結果是否可復現」這套判斷邏輯不會變。

## 參考資料

- [arXiv endorsement 制度](https://info.arxiv.org/help/endorsement.html)
- [arXiv moderation 政策](https://info.arxiv.org/help/moderation/index.html)
- [Scientific American — ArXiv.org Reaches a Milestone and a Reckoning](https://www.scientificamerican.com/article/arxiv-org-reaches-a-milestone-and-a-reckoning)
- [DORA 宣言 — San Francisco Declaration on Research Assessment](https://sfdora.org/read)
- [Semantic Scholar Open Data Platform (arXiv 2301.10140)](https://ar5iv.labs.arxiv.org/html/2301.10140)
- [Connected Papers](https://www.connectedpapers.com)
- [OpenReview](https://openreview.net)
- [Hugging Face Daily Papers](https://huggingface.co/papers)
- [CodeSOTA — Papers with Code 關閉紀錄與替代方案](https://www.codesota.com/papers-with-code)
- [CodeSOTA — How to Read an ML Paper](https://www.codesota.com/guides/reading-ml-papers)
- [TIB-Blog — Papers with Code went offline](https://blog.tib.eu/2025/10/02/papers-with-code-went-offline-the-knowledge-doesnt-have-to)
- [Questionable Practices in Machine Learning (arXiv 2407.12220)](https://arxiv.org/pdf/2407.12220v1)
- [REFORMS Checklist (arXiv 2308.07832)](https://arxiv.org/pdf/2308.07832v2.pdf)
- [State-of-the-Art Claims Require State-of-the-Art Evidence (arXiv 2605.17273)](https://arxiv.org/html/2605.17273v1)
- [Princeton — Leakage and the Reproducibility Crisis in ML-based Science](https://reproducible.cs.princeton.edu)
- [How Not to Do Machine Learning (arXiv 2108.02497)](https://arxiv.org/pdf/2108.02497)
- [arXiv HTML accessibility 公告](https://blog.arxiv.org/2023/12/21/accessibility-update-arxiv-now-offers-papers-in-html-format)
- [Fraudulent Publishing in the Mathematical Sciences (arXiv 2509.07257)](https://arxiv.org/html/2509.07257v2)
