---
title: "MIT 6.S184 導讀：用 ODE／SDE 讀懂 flow matching 與 diffusion"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 0
tldr: "MIT 6.S184 是 IAP（1 月獨立活動期）的短課：5 講（第 3 講拆成 3-A、3-B 兩支錄影）、3 個 lab，加上一份 84 頁、官方稱為「課程骨幹」的講義。講義、slides、6 支錄影、lab notebook 與官方解答全部公開，是 A3 足以自學。缺的只有兩塊：lab 繳交走 Canvas 裡的 Gradescope，只有 MIT 修課生能用；第 5 講離散擴散沒有對應 lab。"
description: "MIT 6.S184 Generative AI with Stochastic Differential Equations（IAP 2026）系列總覽：課程定位、公開程度與缺口、先修、講義七節地圖、每講對應的講義章節／slides／錄影／lab、自學路線、t=0 是雜訊 t=1 是資料的時間慣例，以及 CC BY-NC-SA 授權。"
draft: false
glossary:
  - term: "IAP"
    aliases: ["Independent Activities Period"]
    definition: "MIT 每年 1 月的獨立活動期，開設為期數週的短課。"
    context: "6.S184 是 IAP 課程，所以整門課只有 5 講。"
  - term: "flow matching"
    definition: "用回歸訓練一個神經網路向量場，讓 ODE 從雜訊分佈流到資料分佈的訓練方法。"
    context: "講義第 3 節的主題，也是本系列的主線。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

> **版本說明**：本系列以 [MIT 6.S184](https://diffusion.csail.mit.edu/) 的 **IAP 2026** 版為基準。課程網站另有 [2025 版頁面](https://diffusion.csail.mit.edu/2025/index.html)，影片不同，本系列不混用。所有事實都在 2026-09-30 打開官方材料核對：[課程網站](https://diffusion.csail.mit.edu/2026/index.html)、[講義 PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf)（84 頁）、5 份 slides、6 支錄影，以及 [labs repo 的 2026 branch](https://github.com/eje24/iap-diffusion-labs/tree/2026)。存取等級 **A3 足以自學**。

**系列位置**：系列起點｜下一篇 [L1：生成就是取樣，ODE 與 SDE 是機器](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)

Stable Diffusion 3、Meta Movie Gen 這類圖片與影片生成器，底層多半是 diffusion model 或 flow matching。網路上的教學通常二選一：要嘛只給程式碼，要嘛直接丟一堆隨機微分方程。[MIT 6.S184](https://diffusion.csail.mit.edu/) 走中間路線：只教「剛好夠用」的 ODE／SDE 數學，再一步步把這些數學變成一個能跑的 latent diffusion model。

這篇是系列入口，不做任何推導。讀完你會知道這門課教什麼、材料在哪、缺什麼，以及該按什麼順序讀。

## 課程影片來源

本篇涵蓋多個講次，請由官方錄影索引依主題與講次選擇影片。

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## 這門課是什麼

課程網站上的正式課名是 **6.S184: Generative AI with Stochastic Differential Equations**，網站標題則是 Flow Matching and Diffusion Models。[labs repo 的 README](https://github.com/eje24/iap-diffusion-labs/tree/2026) 寫的是跨列課號 6.S184/6.S975，註明「as taught at MIT over IAP 2026」。

網站簡介把目標講得很清楚：講課教理解 diffusion model 需要的核心數學，包括隨機微分方程和 Fokker–Planck 方程，並逐一拆解模型的每個元件；lab 陪著每一講動手做。課程結束時，學生會從零建出一個 latent diffusion model。

人員分工（課程網站 Instructors 與 Acknowledgements 區）：

- 授課：[Peter Holderrieth](https://www.peterholderrieth.com/)
- Labs：Ron Shprints、Ezra Erives
- 指導與贊助：[Tommi Jaakkola](https://people.csail.mit.edu/tommi/)

講義作者是 Peter Holderrieth 與 Ezra Erives，網站給的引用格式附了 [arXiv 2506.02070](https://arxiv.org/abs/2506.02070)。

**先修**：網站列的是線性代數、多變數微積分、基礎機率，外加熟悉 Python、有一些 PyTorch 經驗。講義 §1.2 另外說，主題偏技術，建議有一定數學成熟度，特別是機率；所以講義附錄 A 放了一份機率複習。機率生疏的話，可以先翻本站的 [Stanford CS109 導讀](/posts/learning/2026-08-21-stanford-cs109-probability)。

## 公開程度：A3，但有兩個缺口

用 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) 的分級，6.S184 是 **A3 足以自學**：

| 材料 | 狀態 |
|---|---|
| 講義 | 完整公開，84 頁（§1–7 正文＋附錄 A–E）。網站說它是課程骨幹，自成一體 |
| Slides | 5 份全部公開（第 3 講的 3-A、3-B 共用一份） |
| 錄影 | 6 支全部在 YouTube |
| Lab | 3 個 notebook 公開 |
| 官方解答 | 公開，在 labs repo 的 `solutions/` |

兩個缺口要先講清楚：

1. **沒有評分回饋。** 網站寫的繳交方式是「把 notebook 匯出 PDF，透過 Canvas 交到 Gradescope」，這只有 MIT 修課生能用。校外讀者只能拿官方解答自己對。
2. **第 5 講沒有 lab。** 3 個 lab 分別對應 L1、L2–L3、L3–L4。講義 §1.2 也把 §7（離散擴散）標成 Optional。

另外，網站沒有正式行事曆，也沒有考試。slides 檔名帶日期（20260120、20260122、20260123、20260128、20260130），但那是檔名，不是官方公布的課表。L1 slides 的 Logistics 頁說，要通過這門課得來上課並完成 labs（「necessary to pass」）。

## 講義的七節地圖

講義 §1.2 用一句話概括每一節，這也是整個系列的骨架：

| 講義章節 | 回答的問題 |
|---|---|
| §1 Generative Modeling as Sampling | 「生成一張狗的圖」精確來說是什麼意思？答：從機率分佈取樣 |
| §2 Flow and Diffusion Models | 生成的機器是什麼？答：模擬 ODE 與 SDE |
| §3 Flow Matching | 怎麼訓練這台機器？一個簡單、可規模化的演算法 |
| §4 Score Matching | score function 是什麼、怎麼學；它同時打開 SDE 取樣與 guidance |
| §5 Guidance | 怎麼讓生成聽 prompt 的話：classifier-free guidance |
| §6 Latent Spaces, Neural Network Architectures | 大型圖片／影片生成器怎麼搭：網路架構、latent space、現役模型案例 |
| §7（Optional）Discrete Diffusion Models | 怎麼把同一套原理搬到語言這種離散資料 |

附錄是 A 機率複習、B Fokker–Planck 方程證明、C 連續時間馬可夫鏈的存在唯一性、D VAE 的其他觀點、E diffusion 文獻導覽。

## 材料對照表

一講一列。講義頁碼取自講義目錄。

| 講 | 主題 | 講義 | Slides | 錄影 | Lab | 本系列 |
|---|---|---|---|---|---|---|
| 1 | Flow and Diffusion Models | §1.3、§2（pp.4–13） | [Slides 1](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf) | [L1](https://www.youtube.com/watch?v=9eJQQVrUUoI) | Lab 1 | [L1](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)、[Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes) |
| 2 | Flow Matching | §3（pp.14–24） | [Slides 2](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf) | [L2](https://www.youtube.com/watch?v=PNkMKWW8Khw) | Lab 2 | [L2](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching) |
| 3-A | Score Functions and Score Matching | §4（pp.25–33） | [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) | [L3A](https://www.youtube.com/watch?v=ngC3QnYSVNM) | Lab 2 | [L3A](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)、[Lab 2](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching) |
| 3-B | Classifier-free Guidance | §5（pp.34–40） | [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) | [L3B](https://www.youtube.com/watch?v=8oWZ1bHwyRI) | Lab 3 Part 2 | [L3B](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance) |
| 4 | Latent Spaces and Neural Network Architectures | §6（pp.41–53） | [Slides 4](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf) | [L4](https://www.youtube.com/watch?v=g0MB1CCBmsI) | Lab 3 | [L4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)、[Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion) |
| 5 | Discrete Diffusion Models | §7（pp.54–65，Optional） | [Slides 5](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf) | [L5](https://www.youtube.com/watch?v=d0kmyEJN2hI) | 無 | [L5](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion) |

三個 lab 在網站上的名稱：Lab 1 Working with ODEs and SDEs、Lab 2 Flow Matching and Score Matching、Lab 3 Diffusion Transformer and VAEs。網站給的入口是 Colab／Google Drive 連結；本系列以 [GitHub 上的 notebook](https://github.com/eje24/iap-diffusion-labs/tree/2026) 為準，因為解答也在同一個 repo。

## 怎麼排自學

網站和講義 Remark 1 給的建議是：講義自成一體，錄影帶你走過每一節，lab 讓你親手寫。照這個分工，一講的節奏可以是：

1. **先讀講義對應章節。** 看不懂的公式先跳過，把 Key Idea、Theorem 的敘述、Algorithm 框讀懂。
2. **再看錄影。** 錄影是講義的口語版，適合補直覺。
3. **做 lab。** 網站流程是從 GitHub 下載 `.ipynb`，用 Jupyter 或 Colab 打開，做完所有題目。
4. **對官方解答。** 打開 `solutions/lab_*_complete.ipynb`，逐題比對。這是校外讀者唯一的回饋來源。

本系列的順序依講義的依賴關係排：L1 → Lab 1 → L2 → L3A → Lab 2 → L3B → L4 → Lab 3 → L5。Lab 2 放在 L3A 後面，因為它要算 conditional score；Lab 3 放在 L4 後面，因為它同時用到 CFG 和 DiT／VAE。

**今晚就能做的事**：打開 [講義 PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf)，讀完 §1（pp.3–6，四個 Key Idea），然後到 [Lab 1 notebook](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_one.ipynb) 確認你的環境能跑 PyTorch。

## 一個一定要記住的慣例：t=0 是雜訊，t=1 是資料

講義從頭到尾用同一個時間方向：**t=0 是初始分佈 `p_init`（通常是標準高斯 `N(0, I_d)`），t=1 是資料分佈 `p_data`**。生成就是從 t=0 模擬到 t=1。

很多 diffusion 文獻的方向剛好相反。講義附錄 E 特別提醒：流行的寫法是 t=0 對應 `p_data`，跟講義相反。讀 DDPM 系論文，或本站的 [CMU 11-785 L23 diffusion 導讀](/posts/ai/2026-08-22-cmu-11785-23-diffusion) 時，先確認時間方向再比對公式，否則會一路對不上。

## 授權

課程網站頁尾標明 **CC BY-NC-SA**。本系列只做導讀與摘要，公式與演算法編號都指回講義原文。

## 系列目錄

1. [L1：生成就是取樣，ODE 與 SDE 是機器](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)
2. [Lab 1：模擬 ODE 與 SDE](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes)
3. [L2：Flow matching，從條件路徑學邊際向量場](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)
4. [L3A：分數函數、SDE 取樣與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)
5. [Lab 2：親手寫 flow matching 與 score matching](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching)
6. [L3B：Guidance 與 classifier-free guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)
7. [L4：U-Net、DiT 與 latent space](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)
8. [Lab 3：DiT、VAE 到 latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)
9. [L5：離散擴散，用 CTMC 生成語言](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion)

## 延伸閱讀

- 課程在地圖上的位置：[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)、[MIT AI／ML 課程地圖](/posts/learning/2026-08-21-mit-ai-ml-course-map)
- 生成模型入門：[MIT 6.S191 L4：生成模型](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling)
- DDPM 視角（時間方向相反）：[CMU 11-785 L23：Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion)
- 離散擴散語言模型：[CME295：Diffusion LLM](/posts/ai/2026-09-29-cme295-diffusion-llms)
- 深度學習整體：[MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — 課程簡介、5 講主題、slides 與錄影、3 個 lab、繳交方式、人員、先修、CC BY-NC-SA
- [MIT 6.S184 課程網站（2025 版）](https://diffusion.csail.mit.edu/2025/index.html) — 本系列不採用，僅說明存在
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF, 2026）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §1.1 Remark 1、§1.2 課程結構、目錄頁碼、附錄 E 時間慣例
- [arXiv 2506.02070](https://arxiv.org/abs/2506.02070) — 講義的 arXiv 版本
- [Slides 1](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf)、[Slides 2](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf)、[Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf)、[Slides 4](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf)、[Slides 5](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf)
- 錄影：[L1](https://www.youtube.com/watch?v=9eJQQVrUUoI)、[L2](https://www.youtube.com/watch?v=PNkMKWW8Khw)、[L3A](https://www.youtube.com/watch?v=ngC3QnYSVNM)、[L3B](https://www.youtube.com/watch?v=8oWZ1bHwyRI)、[L4](https://www.youtube.com/watch?v=g0MB1CCBmsI)、[L5](https://www.youtube.com/watch?v=d0kmyEJN2hI)
- [eje24/iap-diffusion-labs（branch 2026）](https://github.com/eje24/iap-diffusion-labs/tree/2026) — lab notebook、官方解答、README changelog
