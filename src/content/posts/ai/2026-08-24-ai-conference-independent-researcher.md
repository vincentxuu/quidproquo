---
title: "獨立研究者投頂會：現實評估"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, independent-research, solo-author, academic-career, peer-review]
lang: zh-TW
tldr: "獨立研究者投頂會不是不可能，但數據很殘酷：頂會的單一作者論文比例已降到個位數百分比，平均作者數從 3 人漲到 5 人，前 20 大機構佔了 35-50% 的作者署名。Andreas Madsen 花 8 個月無薪工作拿到 ICLR Spotlight，結果還是得回去讀博。這篇整理實際案例、審稿偏見的研究證據、以及沒有大 lab 資源時的可行路徑。"
description: "從數據到案例到審稿偏見研究，誠實評估獨立研究者投 AI 頂會（NeurIPS、ICML、ICLR、ACL）的實際可行性：單一作者論文比例趨勢、Andreas Madsen 等成功案例的代價與後續、雙盲審是否真的消除了 affiliation bias、以及沒有大 lab 資源時哪些 track 和方向比較走得通。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 5
glossary:
  - term: "Spotlight"
    definition: "頂會論文的分級之一，高於一般 Poster 但低於 Oral，通常代表前 3-5% 的論文。各會議用法略有不同。"
    context: "Andreas Madsen 以獨立研究者身份拿到 ICLR 2020 Spotlight，這在無機構背景的研究者中極為罕見。"
  - term: "Prestige bias"
    definition: "審稿過程中，審稿人因為看到（或猜到）作者來自知名機構或是知名學者，而無意識地給予較高評價的傾向。"
    context: "WSDM 2017 的隨機對照實驗和 ICLR 的單盲→雙盲切換研究都發現了 prestige bias 的統計證據。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-independent-researcher-en)

> 🌏 本文為 [AI 頂會導讀](/tags/ai-conference) 系列篇 5

「沒有機構、沒有指導教授、沒有計算資源，可以投頂會嗎？」這個問題在 Reddit r/MachineLearning 和各種 ML 社群裡反覆被問。答案是：不被禁止。所有主流 AI 會議——NeurIPS、ICML、ICLR、ACL——都不要求機構隸屬，OpenReview 帳號人人可以註冊，提交系統不會因為你填了「Independent Researcher」就退件。

但「不被禁止」和「可行」是兩回事。這篇試圖用數據、案例、和審稿偏見的研究證據來拼出一張比較接近現實的圖。

## 數字先看：單一作者論文還存在嗎

NeurIPS 歷史數據的趨勢圖上，單一作者論文的比例是一條明顯向下的線。2014 年每篇論文平均約 3 位作者，到 2023 年已經是 4.98 位，2024 年繼續上升。十年間，每篇論文的平均作者數增長超過 50%，而且這不是少數超大合作拉高的平均值——整個分布都在往右移。

ICML 2026 接受了 6,341 篇論文，來自 1,979 個不同機構。其中有一個統計分類叫「NON」——沒有明確機構歸屬的作者——共出現在 129 篇論文上，佔約 2%。這大致可以視為「獨立研究者」在頂會中可見的上限。

另一個面向是集中度。一篇 2024 年的研究（Azad et al.）分析了 11 個 AI 頂會十年間的 87,137 篇論文，發現 CVPR 2023 裡 **1% 的作者貢獻了超過 50% 的論文**，NeurIPS 2023 則有單一作者在一年內跨 11 個會議發表超過 80 篇。頂 20 大機構在 NeurIPS/ICML/ICLR 三會中佔了 35-50% 的作者署名。學術界約 65-70%，產業界 20-30%，學術與產業合作佔約 31%。

這些數字不代表獨立研究者不可能被接受，但它們說明一件事：現代 AI 頂會的運作規模和集中度，本身就不是為獨立個體設計的。

## 最被引用的案例：Andreas Madsen，ICLR 2020 Spotlight

2019 年 4 月，丹麥研究者 Andreas Madsen 做了一個決定：放棄找工作，花最多 8 個月全職投入研究。如果到 2020 年 1 月還沒拿到頂會發表，就回去寫 JavaScript。

他為什麼走到這一步？因為所有他想進的 PhD program、研究職位、和 ML Engineer 職位都要求「1-2 篇頂會發表」。他有技術大學碩士、有 Distill 發表、有業界經驗——但沒有一個地方給他面試。

> 「To start a PhD in ML, without insider referral, you need to do work equivariant to half of a PhD.」

他的策略很具體：

1. **找一個 peer 定期討論**——不必是專家，重點是有人能質疑你的工作。他和同事 Alexander 每週碰面。
2. **先發 workshop paper 建立實驗框架**——他先在 NeurIPS 2019 的 SEDL workshop 發表了對 DeepMind NALU 模型的復現結果，讓正式投稿時不需要同時論證實驗設計和新模型。
3. **做 side projects 降低單點風險**——如果主要研究失敗，至少不是完全白費。
4. **NeurIPS 2019 被拒後改投 ICLR**——第一次投稿就被接受不是常態。

最終他的論文「Neural Arithmetic Units」改進了 DeepMind 的 NALU 3-20 倍，拿到 ICLR 2020 Spotlight（前 3-5%）。消息在 Twitter 上傳開後，他收到了將近 2,000 封信。

但故事的後續比較少人提：

- Spotlight 之後，他依然沒有拿到任何他原本想要的職位（研究工程師、產業研究）。
- 9 個月後他寫了一篇後續文章，標題是「9 months after my ICLR spotlight award」——描述承諾被打破、夢想被壓碎的經歷。
- 最終他進入 Mila（蒙特婁）讀博士，做 NLP 可解釋性研究，2024 年完成。

Madsen 的案例是獨立研究者頂會發表中最常被引用的成功故事。但即使是這個「成功」案例，結論也是：回去讀博。

## 其他案例：成功的光譜

### 成功但代價高昂

**IJCAI 2022 唯一作者（匿名部落格）**：一位研究者以唯一作者身份投進 IJCAI 2022 主軌，接受率 15%，還被選為 Long Oral（前 3.75%）。他在部落格中描述這件事「felt unreal for a while (imposter syndrome)」，並寫了詳細的投稿建議。但這是一個 CORE A* 會議裡的極端個案。

**Eric Martin（ICLR 2018）**：獨立研究者，論文「Parallelizing Linear Recurrent Neural Nets Over Sequence Length」。先投 NeurIPS 2017 被拒（「實驗太弱」），改進後投 ICLR 2018 被接受。他因為有全職工作，經常熬夜做研究。他的評語：「While I'm glad for the experience, I wouldn't do it again unless it was a full-time job.」

**Victor May（2025 年，三篇）**：沒有 PhD 的業界工程師，靠開源社群（LAION、Ontocord）找到合作者，一年內三篇被接受，包括 ICSE 主軌。策略核心：不是自己一個人幹，而是透過開源社群搭上有經驗的研究者。

### 走 Workshop / TinyPapers 路線

**Jade Abbott & Laura Jane Martinus（NeurIPS 2018 Workshop）**：南非，在 Deep Learning Indaba 認識，10 天內寫完投稿。用的是 workshop 管道，不是主軌。她們的建議是：先從 workshop 開始練習投稿、寫作、和接受審稿意見的流程。

**Jordan Rubin（ICLR 2026 Workshop）**：沒有正式研究訓練，系統金融背景，「over the course of ~4 Lyft rides」寫完第一篇 workshop paper。AI 工具讓他有辦法在極有限時間內產出。

**Smart Media Cutter 作者（2024）**：獨立研究一年，只拿到 TinyPapers 接受。會議門票對非隸屬人員要 $1,000 美元，經濟補助被拒。他的結論：「there is no payoff for any of this work unless you are already inside the academic system」。他後來徹底放棄研究。

這些案例拼在一起的畫面是：獨立研究者確實能發表，但通常走的路線是 workshop → 小型 track → 累積到主軌，不是一步到位。而成本（時間、金錢、心理壓力）經常超過收益。

## 雙盲審：Affiliation 真的看不到嗎

主流 AI 會議都用雙盲審（double-blind review），作者和審稿人互不知道身份。這是保護獨立研究者的重要機制——如果審稿人真的不知道你沒有 affiliation，理論上你的論文只會被論文品質本身評判。

但研究證據顯示現實比這複雜：

### 切換實驗：ICLR 和 WSDM

ICLR 在 2018 年從單盲切換到雙盲。Sun et al.（2022）分析了切換前後 5,027 篇投稿，發現：

- 切換到雙盲後，最知名作者（以引用次數衡量）的分數**顯著下降**。
- 但因為這些論文本來就在接受門檻之上，對最終接受率沒有顯著影響。

WSDM 2017 做了更嚴格的隨機對照實驗（Tomkins et al.）：同一篇論文同時給單盲和雙盲審稿人評分。結果：

- 知名作者的論文在單盲組分數更高 ✓
- 來自頂尖大學的論文在單盲組分數更高 ✓
- 來自頂尖公司（Google/Microsoft/Meta）的論文在單盲組分數更高 ✓
- 女性作者的差異不顯著
- 該會議從下一年起全面改為雙盲

### 但雙盲有多「盲」？

- **ICML 2021 和 EC 2021 調查**：36% 和 42% 的審稿人（匿名自承）在審稿過程中**主動上網搜索**自己負責審查的論文。
- **預印本洩露身份**：NeurIPS 2019 超過一半的投稿論文同時張貼在 arXiv 上，其中 21% 被至少一位審稿人看到。ACL 2024 移除了匿名期規定（允許審稿期間自由張貼預印本）後，研究發現更知名的機構張貼預印本的比例更高（52% vs 36%），而且「審稿人知道作者身份」這件事在頂尖機構有顯著的分數膨脹效果（Cohen's d = 0.43, p < 0.001），在非頂尖機構則沒有。
- **從論文內容猜作者**：在三個匿名化會議中，70-86% 的審稿人表示無法猜到作者，但在那些有猜測的評審中，72-85% 至少猜對了一位作者。

### 對獨立研究者的意涵

雙盲審確實降低了 prestige bias——這是有實驗證據的。但它沒有完全消除：審稿人會搜索、預印本會洩露身份、論文風格本身也帶有訊號。**獨立研究者在這個機制下不會被直接歧視，但也不會得到頂尖機構論文享受的隱性加成。** 在邊界線上的論文，這個差異可能就是接受和拒絕的分界。

一個值得注意的反直覺發現：Chen et al.（2022）分析 ICLR 2017-2022 的 5,313 篇邊界投稿，發現 Area Chair 在做最終決定時，來自排名前 30% 機構的邊界論文反而**稍微不被偏好**（odds ratio = 0.82）。這可能暗示 AC 層級存在某種對 prestige bias 的矯正——但證據強度不足以做為定論。

## 沒有大 lab 的可行路徑

如果你認清了上面的現實，仍然想試，以下是數據和案例支持的可行策略。

### 選對 Track

不是所有 track 的門檻都一樣：

- **Workshop papers**：接受率通常 30-50%，門檻比主軌低很多。大多數成功的獨立研究者都從這裡開始。NeurIPS 2025 有 58 個 workshop，ICLR、ICML 也各有數十個。
- **Datasets & Benchmarks Track**（NeurIPS）：明確歡迎「純 benchmark / 純評估方法論」的工作，不要求新模型、不要求 beating baselines。NeurIPS 2026 官方審稿指南寫明這一點。對獨立研究者來說，這個 track 的計算需求通常遠低於需要訓練大模型的主軌論文。
- **Findings**（ACL/EMNLP/NAACL）：一個介於主軌和拒稿之間的次要 track，同樣經過完整同行審查，品質門檻比 workshop 高但比主軌寬鬆。
- **TinyPapers / Tiny Paper Track**：限制 2 頁的超短論文，特別設計給第一次投稿或弱勢作者。但在學術圈通常不被視為「正式」發表。
- **主軌（Main Track）**：獨立研究者當然可以投，但要認清這是和 Google、DeepMind、Tsinghua 的團隊直接競爭，而且你沒有他們的計算資源、資料集管道、和內部 peer review。

### 選對方向

不是所有研究方向都需要 8 張 A100：

- **Evaluation / Benchmark 論文**：不需要訓練模型，只需要在公開基準上跑已有的模型、設計評估方法論。計算成本低，但需要好的問題設計。
- **Analysis / Position 論文**：分析已有現象或論證觀點。ICML 2025 和 NeurIPS 2026 都有 Position Paper Track。
- **Prompt engineering / In-context learning 研究**：只需要 API 呼叫，不需要自己訓練。
- **小模型研究（7B-8B 參數）**：在單張消費級 GPU 上可以做 fine-tuning 和 DPO。
- **理論研究**：需要的是數學能力，不是計算資源。但審稿人經常看不懂理論論文，這是另一個問題。

相對地，以下方向對獨立研究者幾乎不可行：大規模預訓練、大模型 RLHF、需要專屬資料集的研究、需要大規模人工標註的研究。

### 可用的計算資源

| 資源 | 免費額度 | GPU 類型 | 限制 |
|---|---|---|---|
| Google Colab 免費版 | 有限（不透明配額） | T4 | 使用量不穩定、會被中斷 |
| Kaggle Notebooks | ~30 GPU 小時/週 | P100 | 需公開 notebook |
| AWS SageMaker Studio Lab | 免費 | T4 | 12 小時 session 上限 |
| Lightning AI | 免費額度 | 多種 | 需要帳號 |
| Lambda Labs | 學術研究者可申請 | 多種 | 需說明研究計畫 |
| Thunder Compute A6000 | 付費 $0.35/hr | A6000 48GB | — |
| Thunder Compute A100 | 付費 $1.09/hr | A100 80GB | — |

策略是疊加多個免費資源：Google Colab + Kaggle 每週約 60 小時免費 GPU 時間，加上雲端新使用者信用額度（Google Cloud $300、Azure $200），學生還有 GitHub Student Developer Pack。

### 策略建議

1. **找 collaborator，不要單幹。** 這是幾乎所有成功案例的共同點。不需要找名人，重點是有人能給你回饋、質疑你的工作、分擔實驗。開源社群（LAION、EleutherAI）、Shared Task 參賽社群、Deep Learning Indaba 這類區域社群都是找合作者的管道。
2. **先發 Workshop / Preprint 建立存在感。** arXiv 預印本不花錢（但可能被管理員暫緩），workshop 投稿練習投稿流程的成本遠低於主軌。Andreas Madsen 的 workshop paper 策略是經過驗證的路徑。
3. **選擇你有 domain advantage 的問題。** 獨立研究者最不該做的事是跟 DeepMind 比拼模型訓練。你的優勢是在特定 domain 上有其他人沒有的洞察——可能是產業經驗、特定語言的語料、或某個冷門問題的深入理解。
4. **寫作品質是可控變數。** 多位獨立研究者提到：「被拒不是因為 idea 差，而是因為寫作不符合會議期待的格式和風格。」讀 Vered Schwartz 的 NLP 論文寫作建議、仿照同一 venue 接受論文的結構和語氣、找人幫你讀完稿——這些是你能完全控制的事。
5. **預期失敗。** 整體接受率 20-25% 已經很低，獨立研究者沒有內部 peer review 的品質把關，實際機率可能更低。Andreas Madsen 第一次投 NeurIPS 就被拒。這是常態，不是例外。
6. **算清楚成本。** 會議註冊費對無隸屬人員通常 $500-$1,000 美元，差旅費另計。有些 workshop 要求現場出席，有些不要。經濟補助不保證核准。在投稿之前就把這些數字算進去。

## 誠實結論

從數據到案例，畫面很一致：獨立研究者投 AI 頂會是可能的，但成本高、機率低、而且即使成功了也不保證帶來你想要的結果。

- 主軌主要是機構之間的競爭。前 20 大機構佔了三到五成的發表量，平均每篇論文 5 位作者，獨立研究者是統計上的離群值。
- 雙盲審是真實的保護，但不完美。審稿人會搜索、預印本會洩露身份、論文風格帶有機構訊號。
- 成功案例確實存在，但後續追蹤往往顯示同一個結論：想繼續做研究，最後還是得進入某種機構體系。
- Workshop 和 D&B Track 是更現實的起步點，TinyPapers 更低，但都是實際的管道。

最值得思考的可能是 Delip Rao 的那句話：「Don't confuse good writing/science with getting a paper accepted.」投稿被接受是一個特定遊戲，有特定規則，需要特定的寫作風格、實驗設計慣例、和社群訊號。獨立研究者要決定的不是「我能不能做好的研究」——而是「我願不願意學這套遊戲規則，在沒有教練的情況下。」

如果答案是願意，上面的策略和案例至少告訴你別人怎麼走過來的。如果答案是不願意——開源專案、技術部落格、產品開發，都是在 AI 領域建立影響力的管道，而且不需要任何人的 accept/reject 決定。

---

## 參考資料

- [Andreas Madsen — Becoming an Independent Researcher and getting published in ICLR with spotlight（Medium, 2019）](https://andreas-madsen.medium.com/becoming-an-independent-researcher-and-getting-published-in-iclr-with-spotlight-c93ef0b39b8b)
- [Andreas Madsen — 9 months after my ICLR spotlight award, as an Independent Researcher（Medium, 2020）](https://andreas-madsen.medium.com/9-months-after-my-iclr-spotlight-award-as-an-independent-researcher-9cfb0c808817)
- [Smart Media Cutter — My year as an independent AI researcher（2024）](https://smartmediacutter.com/blog/year-as-an-independent-ai-researcher/)
- [Victor May — How I Published Three Papers This Year — Without a PhD or Research Job（Medium, 2025）](https://medium.com/@mayvic/intro-889c3e6e40b7)
- [Jade Abbott — The Journey to NeurIPS（Medium, 2018）](https://medium.com/data-science/the-journey-to-neurips-ee1a197da538)
- [Jordan Rubin — Notes from ICLR 2026（Substack, 2026）](https://jordanmrubin.substack.com/p/notes-from-iclr-2026)
- [Delip Rao — Publishing Tips for Free Radicals and Other Creatives（2023）](https://deliprao.com/2023/08/publishing-tips-for-free-radicals-and-other-creatives/)
- [Azad et al. — Publication Trends in Artificial Intelligence Conferences: The Rise of Super Prolific Authors（arXiv 2412.07793, 2024）](https://doi.org/10.48550/arxiv.2412.07793)
- [Sun, Danfa & Teplitskiy — Does double-blind peer review reduce bias? Evidence from a top computer science conference（arXiv 2101.02701, 2021）](https://arxiv.org/abs/2101.02701)
- [Tomkins, Zhang & Heavlin — Reviewer bias in single- versus double-blind peer review（PNAS, 2017）](https://doi.org/10.1073/pnas.1707323114)
- [Stelmakh, Shah & Singh — On Testing for Biases in Peer Review（NeurIPS 2019）](https://proceedings.neurips.cc/paper/2019/file/d3d80b656929a5bc0fa34381bf42fbdd-Paper.pdf)
- [Chen et al. — Association between author metadata and acceptance: A feature-rich, matched observational study of ICLR 2017-2022（arXiv 2211.15849, 2022）](https://doi.org/10.48550/arxiv.2211.15849)
- [Shah — What to do about NeurIPS Reviewer #2? Unearthing Peer Review's Mysteries（NeurIPS 2023 Tutorial slides）](https://www.cs.cmu.edu/~nihars/tutorials/NeurIPS2023/TutorialSlides2023.pdf)
- [Frachtenberg & Kaner — Metrics and methods in the evaluation of prestige bias in peer review（PLOS ONE, 2022）](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0264131)
- [ACL 2026 Findings — The Double Bind: Revisiting Preprinting and Peer Review Two Years After the Removal of the ACL Anonymity Period](https://aclanthology.org/2026.findings-acl.222/)
- [Jie et al. — Beyond Content: How Author Network Centrality Drives Citation Disparities in Top AI Conferences（arXiv 2512.21832）](https://arxiv.org/html/2512.21832)
- [arXiv 2607.26280 — Bias at the Borderline: Who Gets the Benefit of the Doubt in Peer Review? Evidence from ICLR](https://arxiv.org/html/2607.26280v1)
- [NeurIPS 2026 Main Track Handbook（reviewer guidelines）](https://neurips.cc/Conferences/2026/MainTrackHandbook)
- [Nemanja Rakicevic — NeurIPS Conference: Historical Data Analysis（Medium）](https://medium.com/data-science/neurips-conference-historical-data-analysis-e45f7641d232)
- [Voxel51 — NeurIPS 2023 and the State of AI Research](https://voxel51.com/blog/neurips-2023-and-the-state-of-ai-research)
- [MTRI — Who really wrote ICML 2026?](https://www.mtri.co.jp/en/publications/icml-2026-report-blog)
- [Marten Lienen — ICML/NeurIPS/ICLR dataset（GitHub, papers + authors + affiliations 2006-2024）](https://github.com/martenlienen/icml-nips-iclr-dataset)
- [Shardul Junagade — ML Publication Trends（blog）](https://sharduljunagade.github.io/blog/posts/ml-publication-trends/ml_publication_trends.html)
