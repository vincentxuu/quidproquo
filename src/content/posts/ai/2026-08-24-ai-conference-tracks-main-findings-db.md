---
title: "Main Track、Findings、D&B Track 差在哪：AI 頂會的三條發表路徑"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, peer-review, neurips, acl, findings-track, datasets-benchmarks]
lang: zh-TW
tldr: "同一篇論文投到同一場會議，可能走三條完全不同的路：Main Track 是最高門檻的正式發表、Findings 是 ACL 系列獨有的「品質夠但沒上主軌」附刊、D&B Track 是 NeurIPS 為純資料集和評測方法論開的專門賽道。三條路在審稿標準、prestige、職涯訊號上差異明顯，投之前搞清楚差別比寫論文本身更重要。"
description: "拆解 AI 頂會除了 Main Track 之外的兩條替代發表路徑：ACL/EMNLP 的 Findings track 與 NeurIPS 的 Datasets & Benchmarks track。從創設背景、審稿標準、接受率趨勢、prestige 差異到 workshop papers 的定位，整理投稿者需要知道的判斷框架。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 2
glossary:
  - term: "Findings"
    definition: "ACL/EMNLP/NAACL 自 2020 年起設立的附刊（companion publication），收錄「品質足夠但未達主軌門檻」的論文。同樣經過完整同行評審，但 prestige 低於 Main Track。"
    context: "本文第二節說明 Findings track 的創設背景與接受率趨勢。"
  - term: "D&B Track"
    definition: "NeurIPS 自 2021 年起設立的 Datasets and Benchmarks track，專門收錄資料集、評測基準與評測方法論的論文，允許單盲投稿。"
    context: "本文第三節說明 D&B track 的審稿標準與 prestige 演變。"
  - term: "Area Chair (AC)"
    definition: "負責綜合審稿意見、撰寫 meta-review 並做出 accept/reject 決定的中層把關角色。上方還有 Senior Area Chair (SAC) 與 Program Chair (PC)。"
    context: "審稿流程的層級結構，Main Track 與 D&B Track 共用同一套 AC 體系。"
---

> 🌏 系列文章：[AI 頂會是什麼](/posts/ai/2026-08-23-what-is-ai-top-conference)（篇 0）→ 本篇（篇 1）

[上一篇](/posts/ai/2026-08-23-what-is-ai-top-conference)整理了「AI 頂會」這個標籤是怎麼被三套獨立排名系統撐起來的。但光知道哪些會議是頂會不夠——同一場會議內部，論文走的路徑就有明顯的 prestige 分層。一篇投到 NeurIPS 的論文，進了 Main Track 跟進了 D&B Track，在學術圈讀起來是不同的訊號；一篇投到 ACL 的論文，上了主軌跟進了 Findings，在 CV 上的份量也不一樣。

這篇拆解三條主要的發表路徑——Main Track、Findings、D&B Track——加上 Workshop 的定位，目的是讓讀者在投稿之前就搞清楚自己的論文最適合走哪條路。

## Main Track：唯一的「預設正軌」

Main Track 是所有 AI 頂會共有的核心賽道，也是 prestige 最高的發表路徑。不管是 NeurIPS、ICML、ICLR、ACL、EMNLP 還是 CVPR，講到「頂會論文」預設指的就是這條路。

**審稿特徵**：雙盲審（作者匿名）、每篇論文 3-4 位審稿人獨立打分、作者回覆期（rebuttal）、Area Chair 撰寫 meta-review 做最終決定。NeurIPS 2025 這一屆，Main Track 動用了 20,518 位審稿人、1,663 位 AC、199 位 SAC。

**接受率**：近五年主要會議的 Main Track 接受率大致落在 20-27% 之間，但不同會議群有系統性差異。ML 三大（NeurIPS/ICML/ICLR）穩定在 25-27%，NLP 兩大（ACL/EMNLP）更低，在 19-22% 之間。這個差距不小：Nikos Aletras（Sheffield 大學 NLP 教授）在 2026 年公開指出，NLP 場次的接受率比 ML 場次系統性偏低 5-8 個百分點，認為這導致「分數夠高的論文仍被主軌拒絕、被迫進 Findings」的問題比 ML 場次嚴重。

**prestige**：Main Track 是所有路徑中最高的。在 Main Track 內部，NeurIPS/ICML/ICLR 還有進一步分層：Oral（約前 1-3%）> Spotlight（約前 3-5%）> Poster（其餘被接受者）。Oral 是職涯里程碑等級的成就——整個研究生涯拿到幾次 Oral 就算非常成功。ACL/EMNLP 沒有 Oral/Spotlight 區分，主軌接受就是主軌接受。

## Findings：ACL 系列獨有的「品質夠但沒上主軌」附刊

Findings 是 ACL 系列會議（ACL、EMNLP、NAACL）在 2020 年首次引入的發表路徑，正式名稱是 "Findings of the Association for Computational Linguistics"。第一屆 Findings 出現在 EMNLP 2020。

### 為什麼要創設 Findings

創設動機很直接：頂會投稿量爆炸性成長（ACL 從 2018 年的 1,045 篇到 2026 年的 12,148 篇，八年成長 1,063%），導致大量「品質沒問題、但在 20% 接受率下硬切掉」的論文無處安放。EMNLP 2020 的 Program Chairs 在公告中定義 Findings 收錄的是「not accepted for publication in the main conference, but nonetheless have been assessed by the programme committee as solid work with sufficient substance, quality and novelty to warrant publication」。

白話講：審稿人覺得這篇沒差到該 reject，但在主軌的名額限制下排不進去，於是給一個正式出版的出口。

### Findings 的接受率趨勢

Findings 的接受率這幾年變化很大，反映了 ACL 社群還在摸索這條路的定位：

**ACL Findings**：

| 年 | 投稿 | Findings 接受 | 接受率 |
|---|---|---|---|
| 2021 | 3,350 | 361 | 10.8% |
| 2022 | 3,378 | 331 | 9.8% |
| 2023 | 4,864 | 901 | 18.5% |
| 2024 | 4,407 | 976 | 22.2% |
| 2025 | 8,360 | 1,392 | 16.7% |
| 2026 | 12,148 | 2,164 | 17.8% |

**EMNLP Findings**：

| 年 | 投稿 | Findings 接受 | 接受率 |
|---|---|---|---|
| 2020 | 3,359 | 447 | 13.3% |
| 2021 | 3,600 | 419 | 11.6% |
| 2022 | 4,190 | 549 | 13.1% |
| 2023 | 4,909 | 1,060 | 21.6% |
| 2024 | 6,105 | 1,029 | 16.9% |
| 2025 | 8,174 | 1,418 | 17.4% |

（投稿數指的是 ARR 原始投稿數，不是 commit 到特定會議的數量。來源：OpenAccept.org、CS Conf Stats。）

兩個值得注意的趨勢：第一，Findings 的接受率在 2023 年前後有一個明顯的跳升（ACL 從 9.8% 跳到 18.5%、EMNLP 從 13.1% 跳到 21.6%），代表 Findings 的名額在擴大。第二，主軌 + Findings 合計的「總接受率」近年已逼近 35-40%——這意味著投到 ACL/EMNLP 的論文，差不多每三篇就有一篇以某種形式被接受。

### Findings 跟 Main Track 的 prestige 差距

這是最敏感也最實際的問題。社群裡的主流看法：

- **正式發表？是。** Findings 論文有完整的同行評審、有 DOI、收錄在 ACL Anthology、被 Google Scholar 和 Semantic Scholar 索引、可以正常引用。
- **跟 Main Track 一樣 prestigious？不是。** 這是多數學術界人士的直覺反應。Findings 的設計本身就隱含了「沒上主軌」這層訊號——它不是一個獨立的發表管道，而是主軌審稿流程的副產品。
- **引用品質是否真的比較差？不一定。** 有審稿人在公開討論中指出，Findings 裡最好的論文（以引用數衡量）經常優於主軌裡中後段的論文，因為 Findings 收到的一部分論文是審稿人之間意見分歧很大、恰好被「break new ground」的創新性反噬的。
- **高校採計怎麼看？因校而異。** 部分中國高校的畢業規章把 Findings 等同於 CCF-B 甚至更低，不等同於主軌的 CCF-A 採計。具體折算比例無統一標準。

**實際建議**：如果你的目標是博士畢業門檻或教職評審，先確認目標機構是否把 Findings 和 Main Track 等同採計。如果是求職 CV，明確標示 "Findings of ACL" 或 "Findings of EMNLP"，不要含糊寫成 "ACL 2024"——有經驗的招募方看得出來，含糊標示反而減分。

## D&B Track：NeurIPS 為資料集和評測方法論開的專門賽道

NeurIPS 的 Datasets and Benchmarks（D&B）Track 在 2021 年首次設立，動機跟 Findings 完全不同。Findings 是解決「主軌名額不夠」的問題，D&B 是解決「主軌審稿標準不適合純資料集／純評測論文」的問題。

### 為什麼 Main Track 審不好資料集論文

傳統 Main Track 的審稿標準圍繞「新方法、新模型、state-of-the-art 數字」設計。一篇論文如果只是貢獻了一個高品質的資料集或一套新的評測方法，沒有提出新的演算法，在 Main Track 的審稿框架下很容易被 reviewer 以「no algorithmic contribution」為由拒絕——即便這個資料集後來被整個領域引用了幾千次。ImageNet 本身是一篇 CVPR 2009 論文，但如果放到今天的 NeurIPS Main Track 審稿標準下，以「只是一個資料集」的角度去評，結果未必樂觀。

D&B Track 的 NeurIPS 2026 官方 reviewer guidelines 明確聲明：「pure-benchmark/pure-evaluation-methodology papers are in scope」，並且「Beating a baseline is not required」。這兩句話在 Main Track 的審稿文化裡是不可能出現的。

### D&B Track 的成長與 prestige 演變

D&B Track 投稿量的成長速度比 Main Track 更快，反映了社群對「資料集和評測值得被認真對待」的共識正在形成：

| 年 | D&B 投稿 | D&B 接受 | 接受率 | Main Track 接受率 |
|---|---|---|---|---|
| 2021 | 484 | 174 | 36.0% | 25.6% |
| 2022 | 447 | — | — | 25.7% |
| 2023 | 987 | — | — | 26.1% |
| 2024 | 1,820 | ~460 | 25.3% | 25.8% |
| 2025 | 1,995 | — | — | 24.5% |

（2021 接受數來自 NeurIPS 官方接受論文頁面；2024 接受率來自 NeurIPS D&B Chairs 官方 Blog；2022、2023、2025 的接受數官方未單獨公布。）

幾個值得注意的演變：

1. **投稿量從 484 到 1,995，四年成長 312%**，比同期 Main Track 的 136% 快得多。
2. **接受率正在向 Main Track 對齊**。D&B Track 2024 年的接受率是 25.3%，幾乎等於 Main Track 的 25.8%。D&B Chairs 在 2025 年官方 Blog 裡明確寫道，這是「有意為之的策略對齊」——目標是讓 D&B 論文被以跟主軌相同的嚴格標準審查。
3. **從 2022 年起，D&B 論文直接收錄在 NeurIPS 主論文集（Proceedings）裡**，不再是獨立的附屬論文集。這在出版形式上消除了跟 Main Track 的區隔。
4. **D&B Track 有自己的 Best Paper Award**，從 2021 年第一屆就開始頒發。

**prestige 判斷**：D&B Track 的 prestige 仍然普遍被認為低於 Main Track——這是社群直覺，短期內不會改變。但差距在縮小。D&B Chairs 的策略很明確：用審稿標準對齊、出版形式合併、接受率拉平來逐步消除「次等公民」的印象。一個有參考價值的觀察：在 NeurIPS 2024 的 CFP 裡，FAQ 明確寫著「My work is in scope for this track but possibly also for the main conference. Where should I submit it?」——這代表 NeurIPS 自己也承認兩條路之間存在投稿者需要主動選擇的灰色地帶。

## Workshop Papers：不要跟上面三條路搞混

Workshop papers 是完全不同的東西，跟 Main Track / Findings / D&B Track 不在同一個量級上。但因為它們發生在同一場會議裡、印在同一個會議名下，外行人（包括 VC、招募方、非學術圈讀者）經常搞混。

**差異整理**：

| | Main Track | Findings | D&B Track | Workshop |
|---|---|---|---|---|
| 審稿嚴格度 | 最高（雙盲、3-4 reviewer、AC/SAC/PC 三層） | 同 Main Track 流程（是主軌流程的副產品） | 高（2024 起對齊 Main Track） | 低（通常 1-2 reviewer，部分只審 abstract） |
| 接受率 | 20-27% | 10-22% | 25-36% | 40-60%+ |
| 工作量 | 5-6 個月 | 同 Main Track（投稿時不分流） | 5-6 個月 | 3-4 週 |
| 出版形式 | 正式論文集（Proceedings） | 正式論文集（ACL Anthology） | 正式論文集（NeurIPS Proceedings） | 多數非正式（部分在 PMLR 出版） |
| 論文長度 | 8-10 頁 | 同 Main Track | 8-10 頁 | 4-6 頁（extended abstract） |
| 是否匿名 | 雙盲 | 雙盲 | 可單盲 | 多數不要求匿名 |

**prestige 排序**（學術圈共識）：Main Track >> D&B Track ≥ Findings >> Workshop。

一個業界人士在 LinkedIn 上的總結很準確：「VCs and recruiters seem unaware that a NeurIPS workshop paper is not the same as a NeurIPS main conference paper. Workshop = 3-4 weeks of work, 20-40% rejection rate. Main conf = 5-6 months of work, 70-80% rejection rate.」——如果你在 CV 上把 workshop paper 跟 main track paper 並列而不加區分，有經驗的招募方會當你在灌水。

**Workshop 的真正價值**：Workshop 不是「次等論文」，它的設計目的就不是跟 Main Track 競爭。它是探索性工作的展示場——早期想法、work in progress、跨領域交叉——門檻刻意壓低是為了建社群，不是為了 gatekeep。對博士生來說，workshop paper 是「證明你有在做研究」的起步訊號，不是「證明你做出了重大貢獻」的里程碑。兩者不衝突，但不要搞混。

## 同一篇論文該投哪條路

不是所有論文都有選擇——Findings 不是你自己決定投的，是主軌審完之後 AC 決定要不要「降級」給你。但 Main Track vs D&B Track、Main Track vs Workshop，是投稿者需要主動判斷的。

**判斷框架**：

1. **你的核心貢獻是什麼？** 如果是新演算法、新模型、新理論 → Main Track。如果是新資料集、新評測方法、或對現有 benchmark 的系統性分析 → 考慮 D&B Track（僅限 NeurIPS）。如果是早期想法、初步結果、或跨領域探索 → Workshop。
2. **你的論文完整度如何？** Main Track 和 D&B Track 都要求完整的 8-10 頁論文、完整的實驗、完整的 related work。如果你手上只有初步結果或概念驗證 → Workshop 更適合。
3. **你的目標是什麼？** 如果是博士畢業門檻 → 查清楚目標機構是否採計 D&B / Findings。如果是求職 → Main Track 的訊號最強，D&B 次之，Findings 再次之，Workshop 最弱。如果是建社群、找合作者、展示早期想法 → Workshop 就是為這個設計的。
4. **你的論文在 NeurIPS 的 D&B 和 Main Track 都 in scope？** NeurIPS 官方建議：「考慮你的論文在哪條 track 更可能得到公平的審稿」。如果你的主要貢獻是資料集，Main Track 的 reviewer 可能會因為「no new method」而給低分，D&B 的 reviewer 不會。

**一個特別要注意的坑**：ACL/EMNLP 的投稿者無法主動選擇投 Findings——你只能投 Main Track，然後被 AC 判斷是否「降級」到 Findings。這代表 Findings 的接受率計算方式跟其他 track 不同：分母是所有投到主軌的論文（包括最後上了主軌的那些），不是「專門投給 Findings 的論文」。所以 Findings 17% 的接受率跟 Main Track 20% 的接受率不能直接相加——它們共用同一批投稿，加起來代表的是「總共有 37% 的投稿以某種形式被接受」。

## 整體來說

同一場頂會內部的 prestige 分層，比多數外行人以為的更細緻。Main Track 是唯一的「預設正軌」；Findings 是 ACL 系列為解決主軌名額不足而創設的正式附刊，品質有保障但 prestige 低一截；D&B Track 是 NeurIPS 為讓資料集和評測方法論得到公平審稿而開的專門賽道，正在快速向主軌對齊但尚未完全等同；Workshop 跟上面三者完全不同層級，不應混為一談。

對投稿者來說，搞清楚這些路徑的差異——特別是自己的目標機構怎麼採計——應該在寫論文之前就完成，而不是投完稿才發現走錯路。

---

## 參考資料

- [EMNLP 2020 官方 Findings 創設公告（Paper Digest 轉述）](https://www.paperdigest.org/2020/11/emnlp-2020-findings-track-highlights)
- [EMNLP 2024 官方接受率計算方法說明（含 Findings 定義）](https://2024.emnlp.org/program/)
- [NeurIPS Blog — Reflecting on the 2025 Review Process from the Datasets and Benchmarks Chairs（D&B Track 接受率對齊策略）](https://blog.neurips.cc/2025/09/30/reflecting-on-the-2025-review-process-from-the-datasets-and-benchmarks-chairs)
- [NeurIPS Blog — Datasets & Benchmarks Track: From Art to Science in AI Evaluations（D&B 投稿成長趨勢）](https://blog.neurips.cc/2025/12/05/neurips-datasets-benchmarks-track-from-art-to-science-in-ai-evaluations)
- [NeurIPS Blog — Reflections on the NeurIPS 2023 Ethics Review Process（2022/2023 D&B 投稿數：447/976）](https://blog.neurips.cc/2023/12/09/reflections-on-the-neurips-2023-ethics-review-process/)
- [NeurIPS 2021 Datasets and Benchmarks Accepted Papers（首屆 484 投稿 / 174 接受）](https://nips.cc/Conferences/2021/DatasetsBenchmarks/AcceptedPapers)
- [NeurIPS 2025 Datasets & Benchmarks Track Call for Papers](https://neurips.cc/Conferences/2025/CallForDatasetsBenchmarks)
- [NeurIPS 2024 Call For Datasets & Benchmarks（含 FAQ：D&B vs Main Track 投稿選擇建議）](https://neurips.cc/Conferences/2024/CallForDatasetsBenchmarks)
- [OpenAccept.org — ACL 歷年投稿／接受統計（Main + Findings）](https://openaccept.org/c/ai/acl)
- [OpenAccept.org — EMNLP 歷年投稿／接受統計（Main + Findings）](https://openaccept.org/c/ai/emnlp)
- [CS Conf Stats — ACL 歷年統計](https://csconfstats.xoveexu.com/conferences/acl)
- [CS Conf Stats — EMNLP 歷年統計](https://csconfstats.xoveexu.com/conferences/emnlp)
- [ACL Wiki — Conference acceptance rates（含 Findings 分流數字）](https://www.aclweb.org/aclwiki/Conference_acceptance_rates)
- [GitHub lixin4ever/Conference-Acceptance-Rate（含 ACL/EMNLP Findings 分年統計）](https://github.com/lixin4ever/conference-acceptance-rate)
- [Nikos Aletras (2026) — NLP 場次接受率系統性低於 ML 場次的公開評論](https://www.linkedin.com/posts/nikos-aletras-6b797422_i-find-really-bizarre-that-main-conference-activity-7450524387339907072-b1a6)
- [Abhishek Divekar — Workshop vs Main Conference prestige 差異的公開評論](https://www.linkedin.com/posts/ardivekar_vcs-and-recruiters-seem-unaware-that-a-neurips-activity-7452849973957832704--xky)
- [NeurIPS Proceedings 首頁（D&B Track 自 2022 起併入主論文集的說明）](https://papers.nips.cc)
- [NeurIPS Blog — Announcing the NeurIPS 2022 Datasets & Benchmarks Track](https://blog.neurips.cc/tag/datasets)
