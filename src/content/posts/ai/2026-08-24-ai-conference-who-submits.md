---
title: "誰在投頂會：AI 學術圈的實驗室、企業與地理版圖"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, research-lab, industry-research, academia, neurips, china-ai]
lang: zh-TW
tldr: "AI 頂會的論文版圖正在劇烈重組：企業研究院主導前沿模型開發（2024 年近 90% 的 notable model 來自業界），但學術界仍是高引用研究的最大產出方；中國高校五年內從追趕者變成 NeurIPS 論文量佔比近半的主力；OpenAI、Anthropic 等公司則幾乎從頂會論文名單上消失——發表量與研究能力的脫鉤，是這個時代最值得注意的訊號。"
description: "拆解 AI 頂會論文的機構與地理版圖：AIRankings / CSRankings / Stanford AI Index 三套資料交叉比對，企業 vs 學術的角色分化，中國高校五年崛起的具體數字，Best Paper 得獎者的 affiliation 分布，以及 OpenAI 等公司從頂會消失背後的策略邏輯。"
draft: false
series:
  name: "AI 頂會導讀"
  order: 4
glossary:
  - term: "CSRankings"
    definition: "UMass Amherst 教授 Emery Berger 建立的大學排名系統，完全基於 DBLP 資料庫中頂會論文的第一作者與通訊作者數量，不考慮引用數或聲譽調查。"
    context: "與 AIRankings 互補，但因不納入 ICLR 而產生排名差異。"
  - term: "AIRankings"
    definition: "涵蓋 NeurIPS、ICML、ICLR、ACL、EMNLP、CVPR、ICCV、ECCV 等主要 AI 會議的機構排名網站，按論文的作者貢獻比例加權計算。"
    context: "2024 年數據顯示北京大學排名第一，清華大學第二。"
  - term: "notable model"
    definition: "Stanford HAI AI Index Report 使用的分類，指在技術能力、影響力或創新性上被 Epoch AI 判定為值得追蹤的 AI 模型。"
    context: "2024 年近 90% 的 notable model 來自業界，但學術界仍主導高引用論文。"
---

> 🌏 [English version](/posts/ai/2026-08-24-ai-conference-who-submits-en)

[上一篇](/posts/ai/2026-08-23-what-is-ai-top-conference)整理了「頂會」的判定標準和代表會議清單。這篇接著問一個更具體的問題：這些會議的論文，到底是誰寫的？

答案在過去五年（2021–2025）經歷了一次結構性的重組。

## 兩套資料怎麼看

目前追蹤 AI 頂會論文機構歸屬最常被引用的是兩套排名：

- **AIRankings**（airankings.org）：涵蓋 NeurIPS、ICML、ICLR、ACL、EMNLP、CVPR、ICCV、ECCV 等會議，按論文的作者貢獻比例加權計算。
- **CSRankings**（csrankings.org）：UMass Amherst 的 Emery Berger 教授建立，基於 DBLP 資料庫中頂會論文數量，只計第一作者與通訊作者。

兩套系統最大的方法論差異：CSRankings 的「Machine Learning」分類只看 NeurIPS、ICML、KDD，不含 ICLR——跟上一篇講的 CCF 一樣把 ICLR 排除在外。AIRankings 則把 ICLR 算進去。這個差異直接影響排名結果，因為 ICLR 是目前 h5-index 僅次於 NeurIPS 的第二大 ML 會議。

另外一份關鍵參考是 **Stanford HAI 的 AI Index Report**（年度發布），它不做機構排名，但追蹤 industry vs academia 的論文佔比、notable model 的來源分布、地理區域統計，是看整體生態變化最權威的資料。

## 機構排名：中國高校的五年位移

根據 AIRankings 截至 2025 年的累計數據，AI 頂會論文產出量排名前 20 的機構如下：

| 排名 | 機構 | 國家/地區 | 性質 |
|---|---|---|---|
| 1 | Carnegie Mellon University | 美國 | 學術 |
| 2 | 北京大學 | 中國 | 學術 |
| 3 | 清華大學 | 中國 | 學術 |
| 4 | MIT | 美國 | 學術 |
| 5 | Stanford University | 美國 | 學術 |
| 6 | UC Berkeley | 美國 | 學術 |
| 7 | 浙江大學 | 中國 | 學術 |
| 8 | KAIST | 韓國 | 學術 |
| 9 | University of Oxford | 英國 | 學術 |
| 10 | 中國科學院 | 中國 | 學術/研究機構 |
| 11 | Nanyang Technological University | 新加坡 | 學術 |
| 12 | University of Maryland | 美國 | 學術 |
| 13 | UC San Diego | 美國 | 學術 |
| 14 | ETH Zurich | 瑞士 | 學術 |
| 15 | University of Toronto | 加拿大 | 學術 |
| 16 | 上海交通大學 | 中國 | 學術 |
| 17 | University of Tokyo | 日本 | 學術 |
| 18 | University of Washington | 美國 | 學術 |

這份榜單有幾個值得注意的結構：

**中國高校在前 20 佔 5 席**（北大、清華、浙大、中科院、上海交大），這個佔比在 2020 年以前是不可想像的。South China Morning Post 引用 AIRankings 數據報導，北京大學自 2022 年起就登上年度 AI 論文產出量全球第一，2024 年排名依序是北大、清華、浙大、CMU、中科院。Stanford Review 的分析更直白：「在 ICLR，中國論文曾被美國論文 5:1 壓制（2021），到 2025 年雙方幾乎打平。NeurIPS 和 ICML 也出現同樣趨勢。」

**企業研究院不在這張表上**——因為 AIRankings 和 CSRankings 都只算學術機構。Google DeepMind、Meta FAIR、Microsoft Research 的論文量其實非常可觀，但它們的統計需要看 NeurIPS 自己的數據或第三方分析。

## NeurIPS 2025 的機構版圖：企業浮出水面

Yann LeCun（Meta Chief AI Scientist）在 2025 年底發了一篇引起廣泛討論的貼文，分享了 NeurIPS 2025 被接受論文的前 50 大機構圖表。幾個關鍵訊號：

**美國端**：前幾名是 Google DeepMind、AI at Meta（FAIR）、Stanford、Microsoft、CMU、MIT——企業研究院和頂尖大學交錯排列，顯示前沿 AI 研究已經從「以大學為主」轉向「企業 lab 主導」。

**中國端**：前幾名是清華大學、中國科學院、北京大學、上海交通大學、HKUST（廣州）——幾乎清一色是學術機構和政府支持的研究所。

**中國整體佔比接近 50%**。36kr 報導，在 NeurIPS 2025 的 5,526 篇被接受論文中，Google 以 4.84% 佔比勉強維持全球第一，清華以 4.73% 緊追其後（差距僅 0.11%），北大以 3.63% 並列第三。

LeCun 自己的評論指出兩個值得注意的現象：
- 新加坡（NUS、NTU）和韓國（KAIST）以國家體量來說表現突出
- 歐洲的存在感意外薄弱——前 50 名中只有瑞士（ETH Zurich）和英國有機構上榜，EU-27 幾乎缺席

## 發表 ≠ 研究能力：OpenAI 和 Anthropic 的戰略缺席

LeCun 那篇貼文裡還有一句話引起更大討論：前 50 名中「notable absence of others (OpenAI, Anthropic)」——OpenAI 和 Anthropic 在 NeurIPS 2025 的發表量低到沒進前 50。

這不是新鮮事。OpenAI 從 2023 年左右開始大幅縮減頂會論文發表，Anthropic 也從未以發表量見長。但這個趨勢值得明確量化：Stanford HAI 的 AI Index Report 2025 和 2026 都確認，在「notable model」的來源統計中，OpenAI 仍然是 2025 年全球最大的 notable model 產出方（20 個），Google 排第二（14 個），阿里巴巴第三（11 個）。

也就是說：**OpenAI 幾乎不在頂會發論文，但仍然是全球產出最多 notable AI model 的機構。** 論文發表量與研究能力的脫鉤，在這兩家公司身上達到了極端值。

為什麼？NeurIPS 2025 的一些討論者給了直白的答案：「silence in this industry is currently a strategic choice to protect trade secrets, whereas high publication counts from Big Tech often simply reflect a corporate strategy to flood conferences with research that serves as a recruiting tool rather than a product roadmap.」發表是招募工具；不發表是商業秘密保護。Google 和 Meta 還在大量發表，是因為它們的研究院（DeepMind、FAIR）本身就有獨立於產品線的學術使命；OpenAI 和 Anthropic 沒有這層歷史包袱。

**Foundation Model Transparency Index 的佐證**：Stanford 追蹤的 FMTI 指數顯示，OpenAI 的透明度分數從 2024 年的 49 分降到 2025 年的 35 分，Meta 從 60 降到 31，Mistral 從 55 降到 18。論文發表的縮減是更廣泛的透明度下降趨勢的一部分。

## 業界 vs 學術：一場結構性分裂

Stanford HAI AI Index Report 連續三年（2024–2026）都把同一個訊息列為首要發現：

> Industry continues to make significant investments in AI and leads in notable AI model development, while academia leads in highly cited research.

具體數字：
- **Notable model 來源**：2024 年近 90% 來自業界（2023 年是 60%）。2025 年 Epoch AI 追蹤到 93 個來自業界的 notable model，來自學術界的只有 2 個。
- **高引用論文**：學術界仍然是過去三年高引用（top 100）論文的最大單一產出方。
- **AI 論文總量（跨領域）**：2023 年全球 AI 論文中，按地區分——美國 academia 佔 75.61%，industry 佔 16.49%；中國 academia 佔 84.45%，industry 佔 8.02%。中國的 AI 研究幾乎完全由學術界驅動，企業佔比遠低於美國。

這個分裂的含義：如果你看「誰在推動前沿模型」，答案是 Google、OpenAI、Anthropic、Meta 這些企業；如果你看「誰在產出高品質研究論文」，答案是 CMU、北大、清華、Stanford 這些大學。兩個問題的答案幾乎完全不重疊。

## Best Paper：大 Lab 壟斷還是有小組突圍？

Best Paper Award 是頂會最高榮譽，每年只有極少數論文獲選（NeurIPS 通常 2-4 篇 best paper + 2-3 篇 runner-up），得獎者的 affiliation 分布能反映「頂尖品質研究」的來源。

以下整理 2021–2025 五年間三大 ML 會議（NeurIPS、ICML、ICLR）的 Best Paper / Outstanding Paper 得獎者 affiliation：

**NeurIPS**：
- 2024：**清華大學 + ByteDance**（Visual Autoregressive Modeling，Best Paper）——這是中國機構首次拿下 NeurIPS Best Paper 的 headline 項目，引發廣泛關注。另一篇 Best Paper 來自 Google DeepMind + 多校合作。
- 2025：Best Paper 來自 Qwen/阿里巴巴（Gated Attention）、Princeton + CMU（1000 Layer Networks for Self-Supervised RL）。DB track Best Paper 來自 UW + AI2。
- 2023：DecodingTrust（UT Austin + UChicago + UIUC 等多校）、ClimSim（多校 + 國家實驗室大型合作）。
- 2022：ProcTHOR（UW + AI2）、LAION-5B（多國多機構開源合作）、SGD 高維極限定理（NYU + Northwestern + Waterloo）。
- 2021：Isoperimetry（Microsoft Research）、RL at the Statistical Precipice（Google Brain）、MAUVE（UW + AI2）。

**ICLR**：
- 2025：Safety Alignment（Princeton + Google + 多機構）、Learning Dynamics of LLM Finetuning（UBC，2 人團隊）、AlphaEdit（中國科大 + NUS）。Honorable Mention 包含 SAM 2（Meta FAIR）。
- 2023：DreamFusion（Google Research，4 人團隊）、GNN Biconnectivity（北大 + 微軟）。

**ICML**：
- 2025：CollabLLM（Stanford + Microsoft Research）、Token Ordering in Masked Diffusions（Harvard + UT Austin）、Conformal Prediction as Bayesian Quadrature（Princeton + Google）等 6 篇。
- 2024：Probabilistic Inference in LMs via Twisted SMC（University of Toronto）、Discrete Diffusion Modeling（Stanford）等。
- 2023：D-Adaptation（FAIR）、Watermark for LLMs（University of Maryland）、Logic Reasoning（EPFL + Apple）。

**CVPR**：
- 2025：VGGT（Oxford VGG + Meta AI）。
- 2024：10 篇獲獎（歷年最多），包含 BioCLIP（Ohio State，Best Student Paper）。

整體模式：
1. **大 Lab 不壟斷**——Google/Meta/Microsoft 有出現，但並非每年都是它們。大量 Best Paper 來自大學 lab（UBC 兩人團隊、Maryland、Princeton、EPFL）。
2. **中國機構突破**——2024 年清華 + ByteDance 拿下 NeurIPS Best Paper 是標誌性事件；2025 年 ACL Best Paper 由 DeepSeek + 北大聯合拿下（NSA，Native Sparse Attention）。
3. **多校多機構合作是常態**——很少有 Best Paper 是單一機構獨立完成的；即使是企業 lab 的論文，也通常有大學的共同作者。
4. **OpenAI 和 Anthropic 在五年的 Best Paper 名單中完全缺席**——不投稿就不會得獎，跟研究能力無關。

## 地理分布：兩種科研體制的正面碰撞

AI World 對 NeurIPS 2025 的地理分析給了一幅清晰的地圖：

**中美並駕齊驅**：中國和美國的論文作者歸屬佔比已經接近 1:1。ACL 2025 更誇張——官方統計顯示，所有第一作者中超過 51.3% 來自中國，美國只有 14.0%（2024 年中國佔比還不到 30.6%）。

**第二梯隊**：新加坡（NUS、NTU）、韓國（KAIST）、加拿大（Mila、University of Toronto）、阿聯酋（MBZUAI）。這些國家/地區都有明確的國家級 AI 策略，以相對小的體量在前 50 名中佔據位置。

**歐洲的結構性弱勢**：AI World 的分析指出歐洲在 Explainable AI 方面有相對優勢，但在整體論文量上遠落後於中美。前 50 名中只有 Oxford、ETH Zurich、EPFL、TU Munich——全在英國和瑞士，EU-27 核心國家（德國、法國、荷蘭）的獨立學術機構幾乎不見蹤影。很多歐洲研究者的論文掛在 Google、Meta、Amazon 的歐洲辦公室名下，被算進企業而非歐洲學術。

**日本**：University of Tokyo 排名第 17（AIRankings），在 NeurIPS 前 50 也有出現，但以日本的經濟體量和科研資源來說，這個存在感並不算強。

## 兩種模式，兩種邏輯

NeurIPS 2025 的數據最清楚地展示了中美之間科研體制的差異：

美國的 AI 研究版圖是**企業主導**——Google DeepMind 和 Meta FAIR 的發表量超過大多數大學，企業 lab 扮演的角色類似私營國家實驗室（private national research labs），靠的是碾壓級的算力和工程規模。學術界（Stanford、CMU、MIT）仍然重要，但越來越多扮演「人才來源」和「基礎理論供應者」的角色。

中國的 AI 研究版圖是**學術主導**——清華、北大、浙大、中科院是主力，企業（華為 228 篇、騰訊 197 篇，Recorded Future 統計 2021–2024 NeurIPS）有貢獻但佔比遠低於學術界。Recorded Future 的分析指出，中國的政府—企業—學術三方協作模式與美國完全不同。

兩種模式各有優勢和脆弱性：美國模式的前沿模型開發能力無人能及，但前沿研究成果高度集中在少數幾家公司手中，一旦這些公司的策略從「開放發表」轉向「保護商業秘密」，整個領域的知識流通就會受影響。中國模式的論文產出量已經追上甚至超過美國，但在 notable model 這個維度上仍然有明顯差距（2024 年美國 40 個、中國 15 個、歐洲 3 個），顯示論文量到工程產品化之間的轉化效率還在追趕。

## 給不同讀者的實際含義

- **要申請博士班的人**：看 AIRankings / CSRankings 找發表量高的 lab，但同時看 Best Paper 得獎者——UBC 兩人團隊、Maryland、EPFL 這些不在 Top 5 的學校也能拿 Best Paper，lab 的研究方向和導師風格比學校排名更重要。
- **在企業做研究的人**：你的公司可能不鼓勵投頂會（OpenAI、Anthropic 模式），但頂會 Best Paper 名單上企業和學術的混合出現說明頂會仍然是技術影響力的重要管道——Google 和 Meta 還在大量投稿不是沒原因的。
- **看產業趨勢的人**：發表量 ≠ 研究能力 ≠ 產品化能力。中國頂會論文量已追上美國，但 notable model 數量差距仍在；美國 notable model 產出量遙遙領先，但其中大部分集中在三四家公司手中。

## 整體來說

AI 頂會的論文版圖在五年內經歷了三重結構變化：中國高校從追趕者變成論文量佔比近半的主力；企業研究院（特別是 Google 和 Meta）在美國端取代大學成為最大發表方；而 OpenAI、Anthropic 等最具商業影響力的公司反而幾乎從頂會名單上消失。「誰在投頂會」這個問題的答案，越來越不等於「誰在做最重要的 AI 研究」——而這個脫鉤本身，就是這個領域最值得注意的結構性訊號。

---

## 參考資料

- [AIRankings — 全球機構 AI 頂會論文排名](https://airankings.org)
- [CSRankings — Computer Science Rankings（基於 DBLP 論文數量）](https://csrankings.org)
- [Stanford HAI AI Index Report 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report)
- [Stanford HAI AI Index Report 2026](https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf)
- [Stanford HAI AI Index Report 2024](https://hai.stanford.edu/ai-index/2024-ai-index-report)
- [Yann LeCun — NeurIPS 2025 Top 50 Contributors（LinkedIn 貼文）](https://www.linkedin.com/posts/yann-lecun_top-50-contributors-to-neurips-in-terms-of-activity-7403357935990616064-VV4J)
- [Pierre-Alexandre Balland — Who pushed the AI frontier at NeurIPS 2025?（LinkedIn 分析）](https://www.linkedin.com/posts/pierre-alexandre-balland-20b75b13_who-pushed-the-ai-frontier-at-neurips-2025-activity-7403119036496162817-vRPE)
- [AI World — The New Map of Frontier AI Research at NeurIPS 2025](https://aiworld.eu/story/the-new-map-of-frontier-ai-research-at-neurips-2025)
- [36kr — 清華大學逼近 Google，NeurIPS 論文數排名第二，中國佔半壁江山](https://eu.36kr.com/en/p/3588990662394113)
- [Stanford Review — We Trained China's AI Researchers. Now We Risk Being Surpassed in AI Innovation](https://stanfordreview.org/we-trained-chinas-ai-researchers-now-we-risk-being-surpassed-in-ai-innovation)
- [Recorded Future — Measuring the US-China AI Gap（含 NeurIPS 2021–2024 中國機構統計）](https://www.recordedfuture.com/research/measuring-the-us-china-ai-gap)
- [South China Morning Post — Chinese universities surpass US rivals in AI ranking（via PKU News）](https://newsen.pku.edu.cn/PKUmedia/14836.html)
- [NeurIPS 2025 Best Paper Awards 官方公告](https://blog.neurips.cc/2025/11/26/announcing-the-neurips-2025-best-paper-awards)
- [NeurIPS 2024 Best Paper Awards 官方公告](https://blog.neurips.cc/2024/12/10/announcing-the-neurips-2024-best-paper-awards)
- [NeurIPS 2023 Paper Awards 官方公告](https://blog.neurips.cc/2023/12/11/announcing-the-neurips-2023-paper-awards)
- [ICLR 2025 Outstanding Paper Awards 官方公告](https://blog.iclr.cc/2025/04/22/announcing-the-outstanding-paper-awards-at-iclr-2025)
- [ICML 2025 Outstanding Papers & Test of Time Award](https://joltml.com/icml-2025/awards)
- [CVPR 2025 Best Paper Award（IEEE CS 新聞稿）](https://www.newswise.com/articles/best-papers-at-cvpr-reveal-new-results-with-neural-networks-for-real-time-applications-and-novel-ways-to-manipulate-light-for-scene-recovery)
- [CVPR 2024 Best Paper Awards](https://cvpr.thecvf.com/Conferences/2024/News/Awards)
- [36kr — DeepSeek 梁文鋒 & 北大楊耀東團隊以 NSA 拿下 ACL 2025 Best Paper](https://eu.36kr.com/en/p/3401632759482502)
- [GitHub — Top-Conference-Best-Papers（社群維護的 2022–2026 得獎名單）](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
- [Foundation Model Transparency Index 2025](https://arxiv.org/html/2512.10169v1)
- [NeurIPS 2025 Conference Summary & Trends（Intuition Labs）](https://intuitionlabs.ai/articles/neurips-2025-conference-summary-trends)
