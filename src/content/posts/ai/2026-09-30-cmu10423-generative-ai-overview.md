---
title: "CMU 10-423 生成式 AI 導讀：系列總覽——26 講投影片與四份作業全公開，錄影鎖在 Panopto"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 0
tldr: "CMU 10-423/623/723 是 Matt Gormley 與 Aran Nayebi 合授的生成式 AI 課，Spring 2026 用 26 講走完文字模型、影像生成、模型調適、多模態、規模化與進階主題。投影片、HW1–HW4 的題目與起始碼、附解答的練習考卷和專案說明都公開，可評為 A3；拿不到的是 Panopto 錄影、HW0 題目檔、HW3/HW4 的 recitation 投影片、小考與 Gradescope 評分。它的作業政策也值得一看：每份作業分兩次交，第一次只准人工作答，第二次才准用 AI。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）系列總覽：課程定位、先修、三種課號的差異、配分、Slot A／Slot B 的 AI 使用規則、6 個單元與 26 講的地圖、A3 存取等級與缺口表、四份作業的算力需求，以及自學路線與站內延伸閱讀。"
draft: false
glossary:
  - term: "Slot A / Slot B"
    definition: "CMU 10-423 的作業繳交制度。每份作業有兩個截止日：Slot A 只收純人工作答、不准用 AI；助教批改並告知錯題後三天是 Slot B，可以用 AI、也可以完全合作，但只重新批改 Slot A 答錯的題目。每題取兩次的最高分。"
    context: "寫在 Spring 2026 課綱的 Homework 一節，第一講投影片也用一頁說明。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

> **版本說明**：本系列依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) 的 Spring 2026 版。這是 2025–2026 年最近一個完整學期：講次表最後一筆是 4 月 30 日的期末報告截止，頁尾寫著「Last updated April 20, 2026」；`10423-f26/` 目前回 404，沒有 Fall 2026 課站。所有事實都在 2026-09-30 打開課程首頁、[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)、[Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)、[Previous](https://www.cs.cmu.edu/~mgormley/courses/10423/previous.html) 頁與投影片、作業檔核對。存取等級 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。

**系列位置**：本篇是總覽｜下一篇 [L1：RNN 語言模型與 autodiff（含 HW0）](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)

CMU 10-423 是卡內基美隆大學機器學習系的生成式 AI 課，Spring 2026 由 [Aran Nayebi](https://anayebi.github.io/) 與 [Matt Gormley](http://www.cs.cmu.edu/~mgormley/) 合授。同一堂課掛三個課號：10-423、10-623、10-723，內容相同，差在要交的東西。

課程描述把範圍寫得很廣：怎麼建構生成模型與其他大型基礎模型（視覺與語言的 Transformer、diffusion model）、怎麼訓練（預訓練、微調）與高效調適（adapter、in-context learning）、怎麼擴展到大規模資料（多 GPU／分散式最佳化）、怎麼在日常使用現成模型（生成程式碼、讓生成模型參與寫程式的流程），以及會出什麼錯（bias、hallucination、adversarial attack、data contamination）與怎麼處理。

這篇回答三件事：這門課教什麼、校外讀者拿得到哪些東西、該怎麼自學。各講細節留給後面的篇章。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 這門課的硬事實

| 項目 | Spring 2026 |
|---|---|
| 授課 | Aran Nayebi、Matt Gormley |
| 時間 | 週一、三、五 14:00–15:20（DH 2210）；週一、三上課，週五偶爾有 recitation |
| 先修 | 10301、10315、10601、10701、10715、11485、11685、11785 擇一 |
| 教科書 | 沒有，readings 都是免費的線上論文與書章 |
| 作業語言 | Python |
| 往年課站 | Fall 2025、Spring 2025、Fall 2024、Spring 2024（Previous 頁） |

先修清單有兩條線：機器學習導論（10-301/315/601/701/715）或深度學習導論（11-485/685/785）。第一講投影片補了一句：深度學習和 PyTorch 都**不是**先修，看你修的是哪門先修課、哪個學期，可能學過也可能沒學過，兩種情況都可以。

站內對應的先修導讀有兩篇：[CMU 10-301 導讀](/posts/learning/2026-08-22-cmu-10301-overview)與 [CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)。

## 三種課號差在哪

課綱寫得很直接：三個課號內容完全相同，10-623 多做 HW623，10-723 再多一個 Quiz723。

| 課號 | 作業 | 小考 | 程式測驗 | 考試 | 專案 | 參與 |
|---|---|---|---|---|---|---|
| 10-423 | 30%（5 份） | 10%（6 次，最低分半權重） | 10%（2 次） | 20%（1 次） | 25% | 5% |
| 10-623 | 30%（6 份，含 HW623） | 10%（同上） | 10% | 20% | 25% | 5% |
| 10-723 | 30%（6 份） | 10%（6 次，等權重） | 10% | 20% | 25% | 5% |

「5 份作業」指 HW0 到 HW4。HW623 依第一講投影片的作業表，是讀一篇近期生成式 AI 論文、分析後錄成影片報告。

有兩處官方材料彼此對不上，讀的時候以首頁課綱為準：

- 第一講投影片的「Syllabus Highlights」頁寫「40% homework」、沒有程式測驗，「Reminders」頁的 HW0 日期是 8 月 27 日發布，看起來是沿用前一學期的投影片。第二講投影片的 HW0 日期已經改成 1 月 14 日發布、1 月 26 日截止，和講次表一致。
- Coursework 頁寫「There will be 5 quizzes」，下面卻列了 Quiz 1 到 Quiz 6，課綱也寫 6 次。

## 作業政策：先靠自己，再用 AI

這門課最有特色的設計是作業的兩段式繳交。課綱的理由是：這門課最重要的學習，發生在你硬啃作業難題的過程。

- **Slot A（只准人工作答）**：個人完成，只允許有限度的合作，不准任何形式的 AI 協助。助教批改後告訴你哪些題目錯了。Office hours 和 Piazza 只在 Slot A 期間開放。
- **Slot B（可以用 AI、可以完全合作）**：收到回饋後三天截止，只重新批改 Slot A 答錯的題目。
- **分數**：每題取兩次的最高分，Slot A 拿到超過一半的分數另有加分。

<details>
<summary>課綱上的完整計分公式</summary>

$$
s = 0.95 \times \sum_{q \in HW} \max(s_{A,q}, s_{B,q}) + 0.05 \times \mathbb{1}(s_A > 0.50)
$$

$s_{A,q}$、$s_{B,q}$ 是第 $q$ 題在兩次繳交的分數，$s_A$ 是 Slot A 的總分。

</details>

把 AI 協助的作答當成人工作答交到 Slot A，會被認定違反學術誠信，罰則可能是整門課不及格。遲交規則也只適用 Slot B：Slot A 不收遲交，也不能用 grace day；Slot B 遲一天 75%、兩天 50%、三天 25%，全學期有 6 天 grace day。

第一講投影片花了好幾頁為這套設計辯護，包括一個很坦白的讓步：這些題目對 LLM 或 coding agent 來說確實不難，但你要在沒人解過的問題上用好 code assistant，得先看得懂大量生成的程式碼、在看似正確的程式碼裡抓 bug、說清楚問題是什麼。

**對自學者的意義**：沒有人幫你批改 Slot A，但你可以照同樣的順序自律。先不開 AI 寫完一輪，對照練習考卷的解答或單元測試找出錯處，再開 AI 修正。

## 6 個單元、26 講的地圖

講次表把 26 講分成 6 個單元，每份作業只考前面那幾講：HW1 對應 L1–L4、HW2 對應 L5–L8、HW3 對應 L9–L12、HW4 對應 L12–L14。本系列照這個節奏排，每個單元最後放一篇作業。

| 單元 | 講次 | 本系列篇章 |
|---|---|---|
| Generative models of text | L1 RNN LMs / Autodiff；L2 Transformer LMs；L3 Learning LLMs / Decoding；L4 Pre-training, fine-tuning / Modern Transformers | [1 RNN LM 與 autodiff](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)、[2 Transformer LM 與解碼](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding)、[3 現代 Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)、[4 HW1](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa) |
| Generative models of images | L5 CNNs / Encoder-only Transformers / ViT；L6 GANs / PGM；L7–L8 Diffusion models | [5 CNN／BERT／ViT](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)、[6 GAN](/posts/ai/2026-09-30-cmu10423-gans)、[7 Diffusion](/posts/ai/2026-09-30-cmu10423-diffusion-models)、[8 VI 與 VAE](/posts/ai/2026-09-30-cmu10423-variational-inference-vae)、[9 HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm) |
| Applying and adapting foundation models | L9 VAEs；L10 Parameter-efficient fine tuning；L11 In-Context Learning / Prompt Engineering / Instruction Fine-tuning / RLHF | [10 PEFT 與 ICL](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning)、[11 IFT／RLHF／DPO](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)、[12 HW3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2) |
| Multimodal foundation models | L12 DPO / Text-to-image / Latent diffusion；L13 Vision-language models；L14 Cross-Attention / DiT / Prompt-to-Prompt | [13 文生圖與 VLM](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm)、[14 Cross-attention／DiT／Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer)、[15 HW4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image) |
| Scaling Up | L15 Querying Transformer / Scaling Laws；L16 Mixture of Experts；L17 Distributed training；L18 Flash Attention / Efficient decoding | [16 Scaling laws 與 MoE](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)、[17 分散式訓練與高效推論](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference) |
| Advanced Topics | L19 Long Context；L20 Reasoning Models；L21 State Space / Hybrid Models；L22 Real-world Issues；L23 Code Generation / Autonomous Agents；L24 Audio；L25 Video；L26 Interactive World Models + Science of Alignment | [18 長上下文與 SSM](/posts/ai/2026-09-30-cmu10423-long-context-ssm)、[19 推理模型](/posts/ai/2026-09-30-cmu10423-reasoning-models)、[20 風險與對齊](/posts/ai/2026-09-30-cmu10423-risks-alignment)、[21 程式生成與 agent](/posts/ai/2026-09-30-cmu10423-code-generation-agents)、[22 語音、影片與世界模型](/posts/ai/2026-09-30-cmu10423-audio-video-world-models) |

最後一篇 [23 練習考卷、HW623 與期末專案](/posts/ai/2026-09-30-cmu10423-exam-hw623-project)收尾。

有三講的投影片跨了兩個主題：L9 的檔名是 `vae-icl`、L12 是 `dpo-text2img`、L15 是 `querying-scaling`。本系列依主題拆到兩篇，所以篇章和講次不是一對一。

## 評量時程

| 日期（2026） | 事件 |
|---|---|
| 1/14 | HW0 發布 |
| 1/26 | HW0 Slot A 截止、HW1 發布 |
| 1/28 | Quiz 1（L1–L4） |
| 2/9 | HW1 Slot A 截止、HW2 發布 |
| 2/16 | Quiz 2（L5–L9） |
| 2/21 | HW2 Slot A 截止、HW3 發布 |
| 2/25 | 程式測驗 HW1/HW2、Quiz 3（L9–L12） |
| 3/12 | HW3 Slot A 截止、HW4 發布 |
| 3/16 | Quiz 4（L12–L15） |
| 3/23 | HW4 Slot A 截止、HW623 與練習題發布 |
| 3/27 | 程式測驗 HW3/HW4 |
| 3/30 | 考試（晚上舉行） |
| 4/3、4/13 | 專案 proposal、midway report 截止 |
| 4/6、4/20 | Quiz 5（L16–L20）、Quiz 6（L21–L24）；4/20 HW623 截止 |
| 4/26–4/30 | 專案海報截止、期末發表、期末報告截止 |

L15 之後沒有程式作業。後半段的驗收交給 Quiz 5–6、HW623 和專案；專案三人一組，在學期最後四週做完。

## 存取等級：A3，但缺口要講清楚

這門課評為 A3，因為自學需要的核心材料都在：26 講的投影片（講次表連到 40 個 PDF，其中 13 份是課堂上的手寫註記版，L26 有兩份投影片）、HW1–HW4 的 zip（題目 PDF、起始碼、單元測試、LaTeX 模板）、每份作業的 Overleaf 唯讀模板、HW623 說明、[附解答的練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)，以及[專案說明](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)。

練習考卷是 Spring 2026 版，41 頁、167 分、13 大題，從 AutoDiff／RNN-LM 一路考到 Scaling Laws，正好可以拿來對照每個單元的自我檢核。

2026-09-30 逐一測試拿不到的東西：

| 材料 | 狀態 | 影響 |
|---|---|---|
| 講課與 recitation 錄影 | 放在 SCS Panopto，講次表標明「Andrew ID Required」，要用 Canvas 登入；直播連結放在 Piazza | 全系列只能依投影片撰寫 |
| 往年錄影 | F25、S25、F24、S24 四個往年課站也都只連到 Panopto，沒有公開影片 | 不用舊版影片補充 |
| HW0 PyTorch Primer 題目檔 | Google Drive 連結回 401 | 只能讀公開的 HW0 recitation Colab |
| HW1 recitation 投影片 | Google Slides 公開 | 可讀 |
| HW1 Supplemental Material | Drive 回 401 | 缺 |
| HW2 recitation 投影片 | Google Slides 公開 | 可讀 |
| HW3、HW4 recitation 投影片 | 回 401 | 作業篇會註明 |
| 白板筆記 | 講次表寫有 OneNote 筆記本，但連結是空的 | 缺 |
| Gradescope、6 次小考、2 次程式測驗、正式考卷、Piazza | 修課學生限定 | 沒有批改，只能靠練習考卷解答與單元測試自評 |

另外，講次表從 L9 起多數講次沒有列 readings。本系列照原樣處理，只引用投影片本身，不自己補書單。

## 四份作業的算力門檻

| 作業 | 主題（依第一講投影片） | 已核對的環境說明 |
|---|---|---|
| HW0 | PyTorch Primer：影像與文字分類器 | 題目檔 401；recitation Colab 教 PyTorch、LSTM、Weights & Biases、einops |
| HW1 | Large Language Models：在 Transformer LM 加上 GQA 與 RoPE | 題目 PDF 截止 2/9、總分 62；附 Colab（免費 T4）與 Kaggle（每週 30 小時 T4／V100）的設定說明 |
| HW2 | Image Generation：diffusion model | 本系列 HW2 篇另行核對 |
| HW3 | Adapters for LLMs：GPT-2 + LoRA | 題目 PDF 截止 3/12、總分 66；附 `run_in_colab.ipynb` 與 `wandb_api.json`，handout 寫明 Colab 有免費 T4 |
| HW4 | Multimodal Foundation Models：文生圖 | 題目 PDF 截止 3/23、總分 79；附 `download_data.sh` 與 `run_in_cloud.ipynb`，handout 建議用 CMU 信箱申請 Colab Pro、優先用 A100 |

HW4 的 Colab Pro 建議需要 CMU 信箱，校外讀者得自己找 GPU。細節留到各作業篇。

## 自學路線

**只想建立概念**：照講次表順序讀投影片，每個單元讀完，拿練習考卷對應的大題自我檢核。不做作業也能跟上，但你會錯過這門課最重的部分。

**要做作業**：

1. 先跑 [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)，確認 PyTorch 和 W&B 都會用。
2. 每個單元讀完投影片後做對應作業：HW1 → HW2 → HW3 → HW4。書面題照 Slot A 的規矩先自己寫，程式題用 zip 裡的單元測試驗證。
3. 做完四份作業後寫練習考卷，再對解答。
4. 後半段（L15–L26）沒有作業，可以挑一個主題照[專案說明](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)的格式做小專案。

**今晚可以做的一件事**：打開[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)，下載 L1 投影片，同時開 HW0 recitation Colab 跑第一個 cell。

## 延伸閱讀

這門課和站內幾個系列有重疊。本系列每篇都會把內容講完整，下面只是想往深處走時的去處：

- 從零打造語言模型、scaling、平行化與推論：[Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)
- Transformer、LLM 訓練、偏好調整與 agent：[Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)
- Diffusion 與 flow matching 的數學：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)
- LLM 的系統面（CUDA、分散式、服務）：[CMU 11-868 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)
- 先修：[CMU 10-301 導讀](/posts/learning/2026-08-22-cmu-10301-overview)、[CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI 課程首頁（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/)：課程描述、學習成果、先修、配分、Slot A/B 政策、遲交規則
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)：26 講、6 單元、readings、作業與小考時程、Panopto 說明
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)：HW0–HW4、HW623、小考範圍、練習考卷、專案 milestones
- [Previous Course Homepages](https://www.cs.cmu.edu/~mgormley/courses/10423/previous.html)：Fall 2025 到 Spring 2024 四個往年課站
- [Lecture 1 投影片：Course Overview + RNN-LMs + Automatic Differentiation](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)：作業表、先修說明、作業政策的論證
- [Lecture 2 投影片：Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)：Spring 2026 的 HW0 日期
- [HW1 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)、[HW3 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip)、[HW4 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip)：截止日、總分與算力說明
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) 與 [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)：Spring 2026，41 頁、167 分、13 大題
- [Project handout](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/project.pdf)
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
