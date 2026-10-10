---
title: "Harvard CS2881R 導讀：第一門 AI 安全研究所課，校外讀者拿得到什麼"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, alignment, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 0
tldr: "Harvard CS 2881R 是 Boaz Barak 在 2025 年秋季首開的研究所 AI 安全研討課。Fall 2025 已完整結束，12 講的閱讀清單全公開、YouTube 播放清單有 11 講的講課錄影、HW0 是一個能自己跑的 GitHub repo，期中與期末的規格和評分表也放出來了，本系列據此標 A3（以研討課標準）。缺口同樣清楚：沒有傳統習題、投影片只有約一半講次公開、L5 沒有講課錄影、L8 只有開場。Fall 2026 正在上，只當預覽。"
description: "Harvard CS 2881R AI Safety（Fall 2025）系列入口：官方課站怎麼找、為什麼以 Fall 2025 為基準、A3 分級與缺口清單、官方講次與本系列閱讀順序對照、先修（CS 181 程度）、課站上的利益揭露聲明，以及 Fall 2026 新學期預覽。"
draft: false
glossary:
  - term: "emergent misalignment"
    aliases: ["EM", "突現失準"]
    definition: "只在一個狹窄領域（例如給壞的醫療建議）微調語言模型，模型卻在無關的問題上也表現出廣泛失準的現象。"
    context: "CS 2881R 的 HW0 就是用 1B 模型重現這個現象。"
    links:
      - label: "Model Organisms for Emergent Misalignment (arXiv 2506.11613)"
        url: "https://arxiv.org/abs/2506.11613"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-course-overview-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **版本說明**：本系列以 [CS 2881R Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/)為準，所有事實於 2026-09-30 打開官方材料核對。存取等級 **A3（以研討課標準）**，缺口清單見下文。

**系列位置**：這是入口篇｜下一篇 [L1：為什麼 AI 安全值得一門研究所課](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction)

[CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) 是 Harvard 的研究所課，授課者是理論計算機科學家 [Boaz Barak](https://boazbarak.org)。課站對它的描述只有兩句：這是一門研究所層級的課，談人工智慧對齊與安全的挑戰，同時看技術面和社會影響。

它的 head TA Roy Rinberg 在[期末回顧文](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic)的標題裡叫它「Harvard 的第一門 AI 安全課」。這門課的公開程度在研究所研討課裡少見：講課錄影、學生寫的週摘要、作業 repo、期末論文和海報都能在校外拿到。

這篇只回答三件事：去哪裡找材料、哪些東西拿得到、這個系列要怎麼讀。每一講的內容放在後面各篇。

## 課程影片來源

本篇涵蓋多個講次，請由官方錄影索引依主題與講次選擇影片。官方 Fall 2025 YouTube 播放清單（AI Safety，17 支）已於 2026-10-10 即時核對：有第 1–4、6–12 講的講課錄影、第 5 與第 8 講的學生實驗影片、第 8 講的開場錄影與期末口頭報告；第 5 講沒有客座講課錄影。同一播放清單也混有 Fall 2026 的第 1、3 講，那是另一個學期，本系列不使用。

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS2881R Fall 2025 official YouTube playlist (AI Safety, 17 videos)](https://www.youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)

查核日期：2026-10-10。

## 課站在哪裡：網址沿用舊的 ML theory seminar

第一個會讓人找錯的地方是網址。課站掛在 Boaz 的 GitHub Pages 上，路徑是 `boazbk.github.io/mltheoryseminar/`，這是他過去開 ML 理論研討課時用的路徑。頁面底部還連著 [Spring 2023 ML Theory Seminar](https://boazbk.github.io/mltheoryseminar/spring2023) 和 Spring 2021 的舊版。

現在打開根目錄，看到的是 **Fall 2026**。Fall 2025 被搬到 [`/fall2025/`](https://boazbk.github.io/mltheoryseminar/fall2025/)，頁面自標「Fall 2025 archive」。Fall 2026 首頁也寫明，上一屆的完整講課材料、錄影、筆記和實驗都保留在 Fall 2025 頁。

Fall 2025 的基本資料（全部來自課站）：

- **時間**：每週四 3:45pm–6:30pm（美東），第一講 2025-09-04，最後一講 11-20，11-27 感恩節停課
- **授課**：Boaz Barak；TF 是 Roy Rinberg、Natalie Abreu、Hanlin Zhang、Sunny Qin
- **課程型態**：課站的 Mini Syllabus 寫每一講除了講課，還有討論和一組學生的實驗報告；出席強制
- **生成式 AI 政策**：鼓勵學生盡量使用，課站也寫因此對作業和專題的期待會比往年更有企圖心
- **錄影政策**：盡可能錄影並公開，但使用教室固定攝影機，白板和討論可能收不清楚；客座講者要求不錄就不錄

## 為什麼以 Fall 2025 為基準

Fall 2026 的[首頁](https://boazbk.github.io/mltheoryseminar/)課表排到 12-03，到今天（2026-09-30）只上完 9 月的 4 講，還不是完整學期。[YouTube 播放清單](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)目前 17 支影片，其中已經混入 Fall 2026 的 Lecture 1 和 Lecture 3。

Fall 2025 則是完整結束的一屆：12 講上完，期末論文在 12-03 繳交，12-10 帶著印好的海報到課堂發表（依 [Rinberg 的回顧](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic)）。[學生專題頁](https://boazbk.github.io/mltheoryseminar/student_projects)列出 19 份論文 PDF 和海報。

所以這個系列以 Fall 2025 為主線。Fall 2026 的材料只放在本篇最後一節當預覽。

## 存取分級：A3，但要先看缺口

本站的[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)把公開程度分成 A0 課表可見、A1 課綱可見、A2 教材部分開放、A3 足以自學。CS 2881R 在本系列標 **A3（以研討課標準）**，理由是這門課本來就不是習題課，它的學習路徑是「讀論文 → 重現 → 延伸」，而這條路徑需要的材料都在校外拿得到：

| 材料 | 狀態 |
|---|---|
| 閱讀清單 | 12 講全部公開在課站，每講標出 pre-reading |
| 講課錄影 | [播放清單](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W) 17 支；Fall 2025 有 11 講有講課影片（L8 只有 Boaz 的開場） |
| 課堂筆記 | 學生寫的 LessWrong 週摘要，收在 [wikitag「CS 2881r」](https://www.lesswrong.com/w/cs-2881r) |
| 學生實驗 | 多數講次附投影片、GitHub 或 LessWrong 文 |
| HW0 | [公開 GitHub repo](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0)，含評分用的 LLM-as-judge 腳本 |
| 期中 mini-project | [規格投影片](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew)與[評分表](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII)，連結由 Rinberg 回顧文公開 |
| 期末專題 | [專題說明](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I)、[評分表](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM)、[學生論文與海報](https://boazbk.github.io/mltheoryseminar/student_projects)、[口頭報告錄影](https://youtu.be/Xr9FNl0S66Q) |
| 課程評鑑 | Harvard 官方 [Q-report PDF](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf) |

**缺口清單**（校外讀者要自己補或接受缺席的部分）：

1. **沒有傳統 problem set**。「作業」是論文重現與開放式研究，Rinberg 回顧裡學生的批評之一就是希望有選修的習題或動手練習。
2. **L5 Content Policies 沒有講課錄影**。課站只列了學生實驗影片，客座講者是 OpenAI 的 Ziad Reslan。
3. **L8 Scheming 只有 Boaz 的開場影片**。Buck Shlegeris 和 Marius Hobbhahn 的客座演講課站只附投影片。
4. **投影片只有約一半講次公開**。L1、L2、L4、L6 和 L8 的 Boaz 投影片放在 Harvard SharePoint；L7、L8 客座與 L10 的 Neel Nanda 投影片另有連結。L3、L5、L9、L11、L12 沒有列投影片。
5. **學生週摘要不完整**。wikitag 下的週摘要只涵蓋部分週次，其餘是學生實驗文。
6. **多講的實驗欄寫 TBD**。L6 寫「To be determined」加一段構想，L7 寫「TBD」，L9、L10、L11 寫「To be determined」，L12 的 Resources 寫「to be determined」。
7. **HW0 的自動評分只對修課生有效**。GitHub Classroom 用課程的 OpenAI 金鑰跑評分，校外讀者要自己準備 API 金鑰跑 `eval/judge.py`。

如果你的目標是「做完一套有標準答案的練習」，這門課給不了。如果目標是學會怎麼讀一篇 AI 安全論文、把它的主圖重現出來、再往前推一步，這門課的公開材料足夠。

## 先修：CS 181 程度的 ML，加上能訓練神經網路

課站的先修寫得很具體：數學成熟度、會寫證明、機率和資訊理論，加上大學部 ML 課的程度，舉的例子是 Harvard CS 181 或 MIT 6.036。它點名你該熟悉 empirical 與 population loss、梯度下降、神經網路、線性迴歸、PCA。實作面要會寫 Python、能訓練一個基本的神經網路。

站內對應的前置：

- 本站的 [Harvard CS 181 導讀](/posts/tech/2026-08-27-harvard-cs181-overview) 就是課站點名的那門課
- HW0 要用 LoRA 微調 1B 模型；沒碰過 LoRA，可以先看 [CMU 11-868 的 PEFT／LoRA 篇](/posts/ai/2026-09-30-cmu11868-peft-lora)

Rinberg 的回顧提到 Fall 2025 約 70 名學生，大約一半是資深大學部學生，其餘是研究生。他也認為這門課如果開成大學部課不會這麼順，因為整個結構依賴學生自己想學、而不是追分數。

## 利益揭露：課站原文

課站在 Mini Syllabus 裡放了一段標題全大寫的「POTENTIAL CONFLICT OF INTEREST NOTE」。原文第一句：

> In addition to his position at Harvard, Boaz is also a member of the technical staff at OpenAI.

接著課站說明課程會討論多家廠商的模型，也鼓勵學生使用多家的 AI；學生若對此有疑慮，可以找 Boaz、其他教學人員或 Harvard SEAS 行政單位。最後一句是 Boaz 自己的話：課程畢業生不論在學界、非營利組織、政府，或 OpenAI 的任何競爭對手做 AI 安全，他都會視為課程的成功。

讀這個系列時可以把這段放在心上。L5 和 L9 的客座講者分別是 OpenAI 的產品政策人員和首席經濟學家，L12 兩位客座也來自 OpenAI。這些是課站上寫的講者身分，本系列會照實標出。

## 官方順序與本系列閱讀順序

官方課表把技術講和社會講交錯排。本系列改用學習者的順序：先看到失準、再看它怎麼被訓練出來和被攻破、再看規範怎麼寫、動手重現、再看最難偵測的風險與偵測工具，最後拉到時間軸和社會衝擊。每篇標題都保留官方講次編號。

| 本系列 order | 篇目 | 官方講次與日期 |
|---|---|---|
| 0 | 本篇 | — |
| 1 | [L1 Introduction](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction) | L1，9/4 |
| 2 | [HW0：重現 emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment) | 開學前（截止 2025-08-04） |
| 3 | [L2 Modern LLM Training](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training) | L2，9/11 |
| 4 | [L3 Adversarial Robustness](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness) | L3，9/18 |
| 5 | [L4 Model Specifications](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs) | L4，9/25 |
| 6 | [L5 Content Policies](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies) | L5，10/2 |
| 7 | [期中 mini-project](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project) | 期中 |
| 8 | [L8 Scheming & Deception](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception) | L8，10/23 |
| 9 | [L10 Interpretability](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability) | L10，11/6 |
| 10 | [L6 Recursive Self-Improvement](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement) | L6，10/9 |
| 11 | [L7 Capabilities vs. Safety](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety) | L7，10/16 |
| 12 | [L9 Economic Impacts](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts) | L9，10/30 |
| 13 | [L11 Emotional Reliance](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance) | L11，11/13 |
| 14 | [L12 AI 2035](/posts/ai/2026-09-30-cs2881r-lecture-12-ai-2035) | L12，11/20 |
| 15 | [期末專題與課程回顧](/posts/ai/2026-09-30-cs2881r-final-projects-retrospective) | 12/3 論文、12/10 海報 |

把 HW0 排在 L1 之後、L2 之前，是因為 HW0 在官方時間線上本來就早於第一講：它是選課門檻，截止日在開學前一個月。L1 課堂上的學生實驗，也是 HW0 的延伸。

## Fall 2026 預覽（補充，不是主線）

以下只是新學期的樣貌，本系列主線不引用：

- **課表換了一批講題**。[Fall 2026 首頁](https://boazbk.github.io/mltheoryseminar/)列出 Cyber Capabilities、RL for Post-Training、Open-Source Models、Alignment in the Age of RSI、AI Biosecurity 等 Fall 2025 沒有的講題，12-03 那一講標的是 Ajeya Cotra。
- **HW0 換題**。[Fall 2026 HW0](https://boazbk.github.io/mltheoryseminar/hw0-2026/) 的題目是「J-space 與模型 chain of thought 的關係」，預估 4–16 小時，繳交約兩頁報告加私有 GitHub repo，截止 2026-08-05。
- **作業結構寫得更明確**。首頁寫這屆要在課堂上報告實驗、寫 scribe notes、做期末專題，可能還有作業或 mini-project。
- **已上傳的影片**。播放清單已有 Fall 2026 Lecture 1 和 Lecture 3。

HW0 頁自己也說，去年的講課和筆記可以參考，但領域變化快，今年內容會不同。Fall 2026 結束後，本系列再評估要不要另寫更新。

## 站內延伸閱讀

本系列每篇都自成一體，和站內其他課程重疊的地方只放延伸連結：

- LLM 訓練與 RLHF：[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)、[Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)
- 強化學習基礎：[Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)
- 可解釋性：[CS224U 分析方法：probing 與 attribution](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)
- Prompt injection 與 agent 安全實務：[Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)
- LLM-as-judge：[Stanford CS329Z Week 8：模型當裁判與護欄](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety)
- Harvard 其他課：[Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map)

今晚可以做的一件事：打開 [HW0 repo](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0) 的 README，看完「Instructions」三步，判斷你手上的 GPU 或雲端額度跑不跑得動 1B 模型的 LoRA 微調。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方播放清單，沒有對應本篇的錄影，狀態維持僅附官方入口。

## 參考資料

- [CS 2881R AI Safety, Fall 2025 課站](https://boazbk.github.io/mltheoryseminar/fall2025/) — 課程描述、先修、Mini Syllabus、利益揭露、12 講課表與閱讀清單
- [CS 2881R Fall 2026 首頁](https://boazbk.github.io/mltheoryseminar/) — 新學期課表、作業結構、上一屆材料保留說明
- [CS 2881R Fall 2026 Homework Zero](https://boazbk.github.io/mltheoryseminar/hw0-2026/) — 新 HW0 題目、時數、繳交要求
- [CS 2881R YouTube 播放清單](https://youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W) — 講課錄影（2026-09-30 共 17 支）
- [LessWrong wikitag：CS 2881r](https://www.lesswrong.com/w/cs-2881r) — 學生週摘要與實驗文
- [Harvard-CS-2881/harvard-cs-2881-hw0](https://github.com/Harvard-CS-2881/harvard-cs-2881-hw0) — Fall 2025 HW0 repo
- [Student Final Projects - Fall 2025](https://boazbk.github.io/mltheoryseminar/student_projects) — 19 份期末論文與海報
- [期末口頭報告錄影](https://youtu.be/Xr9FNl0S66Q)
- [Roy Rinberg, Reflections on TA-ing Harvard's first AI safety course（LessWrong, 2026-01-15）](https://www.lesswrong.com/posts/gcFB2RT5vpKHbH4ic) — 學生人數、作業結構、期末日期、期中與期末文件連結
- [CS2881 Mini-project 說明投影片](https://docs.google.com/presentation/d/1aU8iYbuzPGjzwNwZO4UFOjFy-oJ1cTG1XGR2_C5L5ew)、[Mini Project Grading](https://docs.google.com/document/d/1m8aZpEnW4J0TNhnfzAZaZ5G0xR5UyYNDiZzoZdI-rII)
- [cs2881 Final Project Outline](https://docs.google.com/document/d/1cB_zHcHQuCua-UlwcbDwNaxN2YQEtp5vKHKmBS9_63I)、[Final Project Grading Rubric](https://docs.google.com/document/d/1JA-p0g91_LIB-uTfbZ5PtOfk7KFkIoOC-odrwf-HAiM)
- [Harvard Q-report（課程評鑑）](https://boazbk.github.io/mltheoryseminar/assets/q_report.pdf)
- [Turner et al., Model Organisms for Emergent Misalignment (arXiv 2506.11613)](https://arxiv.org/abs/2506.11613) — HW0 依據的論文
