---
title: "MIT 6.5940 導讀：Song Han 的高效 AI 課停了一年，這個系列為什麼以 Fall 2024 為主幹"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, quantization, edge-ai, llm-inference]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 0
tldr: "MIT 6.5940（TinyML and Efficient Deep Learning Computing）教的是讓模型變小、變快、塞進手機和微控制器的技術：pruning、quantization、NAS、distillation、LLM 部署與分散式訓練。2025 年秋季因 Song Han 休假停開，2025 年課頁回 404；Fall 2026 正在上，截至 2026-09-30 只放出 L1–L6 與 Lab 0–1。本系列因此以最近一屆完整的 Fall 2024 為主幹：23 講投影片、23 支錄影、Lab 0–5 都公開，屬 A3；Fall 2026 列 A2，每篇另附對照。"
description: "MIT 6.5940 系列入口：課程定位、Fall 2024 與 Fall 2026 的公開程度（A3／A2）、評分與 lab 結構、兩屆排程差異表、校外自學缺口，以及三條閱讀路線。所有事實來自兩屆官方課頁、投影片 PDF 與 lab 檔案。"
draft: false
glossary:
  - term: "sabbatical"
    aliases: ["學術休假"]
    definition: "教授暫停授課一段時間做研究的休假制度。"
    context: "6.5940 的 Fall 2024 課頁寫明 Fall 2025 因 Song Han 休假停開，這是本系列改用 Fall 2024 的直接原因。"
  - term: "EfficientML.ai"
    aliases: ["efficientml.ai"]
    definition: "MIT 6.5940 的課程品牌與網址，實際導向 MIT HAN Lab 的課程頁；每講錄影標題也以「EfficientML.ai Lecture N」開頭。"
    context: "本系列引用的投影片封面與錄影標題都用這個名字。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

[MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) 是 [Song Han](https://songhan.mit.edu) 開的研究所課。投影片封面上他的頭銜是 MIT 副教授兼 NVIDIA Distinguished Scientist。課程網址 [efficientml.ai](https://efficientml.ai) 會導到 MIT HAN Lab 的[課程頁](https://hanlab.mit.edu/course)。這門課處理一個很實際的問題：模型長得比硬體快，要怎麼把它壓小、加速，放進筆電、手機，甚至只有幾百 KB 記憶體的微控制器。

Fall 2024 課頁的課程描述列出的主題有 model compression、pruning、quantization、neural architecture search、distributed training、data/model parallelism、gradient compression、on-device fine-tuning。另外還有針對 LLM 與 diffusion model 的加速技術。課頁承諾的實作成果很具體：學生要親手把 Llama2-7B 部署到自己的筆電上。

這一篇是 MIT 6.5940 導讀的入口，回答四件事：這門課教什麼、為什麼本系列用 Fall 2024 而不是最新一屆、校外讀者實際拿得到什麼，以及怎麼讀。

## 課程影片來源

本篇涵蓋多個講次，請由官方錄影索引依主題與講次選擇影片。

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## 這門課的硬事實

| 項目 | Fall 2024（本系列主幹） | Fall 2026（進行中） |
|---|---|---|
| 課名 | TinyML and Efficient Deep Learning Computing | TinyML and Efficient AI Computing |
| 課頁 | [2024-fall-65940](https://hanlab.mit.edu/courses/2024-fall-65940) | [2026-fall-65940](https://hanlab.mit.edu/courses/2026-fall-65940) |
| 先修 | 6.191 Computation Structures、6.390 Intro to Machine Learning；不符者第二週退選，可交 petition | 同樣兩門；課頁寫明不受理先修豁免，也不收 cross-registration |
| 講次 | 23 講，加 3 次期末專題發表（Dec 3、5、10） | 22 講（最後一講為 Guest Lecture），加 3 次發表（Dec 3、8、10） |
| 考試 | 無，課頁寫明「does not have any tests or exams」 | 同左 |
| 錄影 | 23 支，放在 [MIT HAN Lab YouTube](https://www.youtube.com/c/MITHANLab)，入口是 [live.efficientml.ai](https://live.efficientml.ai/) | 隨課上傳，截至 2026-09-30 有 L1–L6 |
| 繳交／討論 | Canvas、Piazza（限 MIT 修課生） | 同左 |

課頁自稱「PhD level course」。修完後的目標有兩個：理解高效深度學習的技術，以及能把 LLM 部署在自己的筆電上。

## 為什麼以 Fall 2024 為主幹

本站課程導讀的原則是以 2025–2026 年最新一屆完整學期為準。6.5940 在這個時間窗內沒有完整學期：

1. **Fall 2025 停開。** Fall 2024 課頁的「Time」欄位現在寫著：「The course will not be offered in Fall 2025 due to Prof. Han is on sabbatical」。直接開 `hanlab.mit.edu/courses/2025-fall-65940` 會得到 HTTP 404。課頁底部的「Previous Courses」也只列 2026、2024、2023 三屆 6.5940，加上 2022 年的前身 6.S965。
2. **Fall 2026 還沒上完。** 課頁排程到 12 月 10 日。截至 2026-09-30，L1–L6 有投影片和錄影，Lab 0 與 Lab 1 已經放出；L7 之後的 Slides 與 Video 都還是空連結。

所以本系列用最近一屆完整版 Fall 2024 當主幹。每篇另設「Fall 2026 對照」一節，列出新學期已公開的對應材料和差異。Fall 2026 之後的講次上線，會用更新紀錄補進各篇，篇目順序不變。

## 公開程度：F24 是 A3，F26 是 A2

分級依本站[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的 A0–A3 定義。

**Fall 2024：A3（足以自學）。** 課頁上每一講都有 Dropbox 投影片與 YouTube 錄影連結，Lab 0–4 是公開的 Colab notebook，Lab 5 是公開的 Google Drive 資料夾，期末專題題目清單也是公開的 Google Doc。系統化教材加上作業檔案都拿得到，這符合 A3。

A3 不代表沒有缺口。以下幾件事要先知道：

- **沒有官方解答。** lab 在 Canvas 繳交，校外讀者沒有評分回饋，只能自己對照講義檢查。
- **四個「Chapter」時段沒有材料。** 排程裡的 Chapter I–IV（Sep 11、Oct 16、Nov 11、Nov 20）是章節標記，Slides 與 Video 都是空連結。
- **L22 只有課程總結投影片。** L22 的主題是「Course Summary + Quantum Machine Learning I」，但連結的投影片是 13 頁的 Course-Summary.pdf，內容沒有量子 ML；Quantum ML Part I 只有錄影可看。
- **期末發表沒有錄影。** 三次 Final Project Presentation 都沒有連結。

**Fall 2026：A2（教材部分開放）。** 投影片與錄影隨進度上線，目前只到 L6。課頁明說不收 cross-registration。

## 評分與 lab 結構

Fall 2024 課頁的評分：

| 項目 | 比重 |
|---|---|
| 5 個 lab | 各 15%，共 75% |
| 期末專題 | 25%（Proposal 5%＋Presentation 與 Final Report 20%） |
| Participation Bonus | 4%（學期末填課程問卷） |

其他規則：lab 要個人繳交，但可以一起討論，要註明跟誰合作；整學期有 6 天不扣分的遲交額度；5 個 lab 至少要交 4 個才能過。期末專題的組數規定，課頁寫 4 或 5 人一組，第一講投影片（第 89 頁）寫「group of 3-4」，兩份官方材料不一致。報告格式是 4 頁、NeurIPS 模板；[Course Summary 投影片](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0)第 11 頁另外要求附 GitHub 連結開源程式碼。[專題題目清單](https://docs.google.com/document/d/1QiCkCUr_1DnLNUCXUM3g0SQRIbVG5XyrQjdfsUPrIeA)在 2024-10-24 公布。

Fall 2024 的 lab：

| Lab | 主題 | 對應講次 |
|---|---|---|
| Lab 0 | PyTorch 教學 | L2 |
| Lab 1 | Pruning | L3–L4 |
| Lab 2 | Quantization | L5–L6 |
| Lab 3 | Neural architecture search | L7–L8 |
| Lab 4 | LLM compression | L13 |
| Lab 5 | LLM deployment on laptop | L13 |

第一講投影片（第 88 頁）列了 Lab 5 的最低硬體需求：macOS、Linux 或 Windows；x86 或 ARM（Apple M1/M2）處理器；8 GB 記憶體；5 GB 可用儲存空間。

Fall 2026 的評分沒寫在課頁上，只出現在 [Fall 2026 第一講投影片](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0)第 88 頁：5 個 lab 各 14%、期末專題 30%（Proposal 5%＋Presentation 與 Final Report 25%），另有 Class Survey Bonus（沒寫比重）。

## Fall 2024 → Fall 2026 差異

下表只列兩份課頁與投影片能直接對上的差異。

| 項目 | Fall 2024 | Fall 2026 |
|---|---|---|
| L1–L6 | Introduction、Basics、Pruning I/II、Quantization I/II | 主題相同；L2 的 Lecture Plan 多一項 CNN 架構回顧（AlexNet、VGG-16、ResNet-50、MobileNetV2） |
| L13 | Efficient LLM Deployment | LLM Quantization and Deployment |
| L17–L18 | GAN, Video, and Point Cloud；Diffusion Model | Diffusion Model Part I、Part II |
| 期末前 | L22 Course Summary＋Quantum ML I；L23 Quantum ML II | Dec 1 Guest Lecture（講者與講題未公布） |
| Lab 1 | Pruning | GPU Basics（壓縮檔內題為「Lab1: Efficient AI Fundamentals」） |
| Lab 2、Lab 4 | Quantization；LLM compression | 課頁寫 Quantization、Quantization；L1 投影片寫 Pruning、Quantization |
| 評分 | Lab 15%×5、專題 25%、Bonus 4% | Lab 14%×5、專題 30%、Survey Bonus |

Lab 2 那一列要特別說明。Fall 2026 課頁的 lab 清單寫「Lab2: Quantization」與「Lab4: Quantization」，同一份清單出現兩次 Quantization；第一講投影片第 87 頁與第 89 頁卻寫「Lab 2 — Pruning」。兩份官方材料互相矛盾，本系列不替它選邊，等 Lab 2 實際放出後再補。在那之前，想練 pruning 的讀者請用 Fall 2024 的 Lab 1。

Fall 2026 Lab 1 的內容已經可以確認。它的 [README](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&st=2xh5vnk3&dl=1) 列出五個部分：latency 與 MAC/FLOPs/I/O、roofline model、Gemma-3 decoder layer 案例（prefill 對 decode）、PyTorch Profiler 與 kernel fusion、Flash Attention。總分 80 分加 20 分 bonus。Part 5 在 Colab 上要選 A100 GPU。Fall 2024 沒有這種 GPU profiling lab，所以本系列把它收成一篇獨立的補充篇。

## 課程地圖：四章

排程用四個章節標記把 23 講分組：

| 章 | 講次 | 主題 |
|---|---|---|
| Chapter I: Efficient Inference | L3–L11 | Pruning、Quantization、NAS、Knowledge Distillation、MCUNet、TinyEngine |
| Chapter II: Domain-Specific Optimization | L12–L18 | Transformer 與 LLM、LLM 部署、後訓練、長上下文、ViT、GAN／影片／點雲、Diffusion |
| Chapter III: Efficient Training | L19–L21 | 分散式訓練、裝置端訓練與遷移學習 |
| Chapter IV: Advanced Topics | L22–L23 | 課程總結、量子 ML |

L1–L2 在第一章之前，負責動機與量尺。Course Summary 投影片第 6–7 頁用另一種切法收尾：把內容分成 Efficient Inference、Efficient Training、Application-Specific Optimizations 三塊，再用 Algorithm 與 System 兩個軸定位。這門課同時講演算法和系統，這是它跟一般深度學習課最大的不同。

## 系列目錄

本系列共 25 篇（order 0–24）。篇數比講次多，是因為 pruning、quantization、NAS 三個 lab 題量大，各自獨立成篇。

| order | 篇目 | 對應材料 |
|---|---|---|
| 0 | 本篇：系列入口 | 兩屆課頁 |
| 1 | [為什麼要高效、怎麼量模型大小與運算量](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics) | L1、L2、Lab 0 |
| 2 | [Pruning I：剪枝的粒度與準則](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria) | L3 |
| 3 | [Pruning II：每層剪多少、硬體怎麼支援](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support) | L4 |
| 4 | [Lab 1：fine-grained 與 channel pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning) | F24 Lab 1 |
| 5 | [Quantization I：數字格式與基本量化](/posts/ai/2026-09-30-mit-65940-quantization-basics) | L5 |
| 6 | [Quantization II：PTQ、QAT 與混合精度](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat) | L6 |
| 7 | [Lab 2：k-means 與 linear quantization](/posts/ai/2026-09-30-mit-65940-lab2-quantization) | F24 Lab 2 |
| 8 | [NAS I：搜尋空間與搜尋策略](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy) | L7 |
| 9 | [NAS II：hardware-aware NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware) | L8 |
| 10 | [Lab 3：在限制下搜子網路](/posts/ai/2026-09-30-mit-65940-lab3-nas) | F24 Lab 3 |
| 11 | [Knowledge Distillation](/posts/ai/2026-09-30-mit-65940-knowledge-distillation) | L9 |
| 12 | [MCUNet：在微控制器上跑神經網路](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml) | L10 |
| 13 | [TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing) | L11 |
| 14 | [Transformer 與 LLM 橋接篇](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer) | L12 |
| 15 | [LLM 部署](/posts/ai/2026-09-30-mit-65940-llm-deployment) | L13 |
| 16 | [Lab 4＋Lab 5：AWQ 與筆電上的 LLM](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop) | F24 Lab 4、Lab 5 |
| 17 | [Fall 2026 補充：Lab 1 GPU Basics](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics) | F26 Lab 1 |
| 18 | [LLM 後訓練](/posts/ai/2026-09-30-mit-65940-llm-post-training) | L14 |
| 19 | [長上下文 LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm) | L15 |
| 20 | [高效視覺：ViT、GAN、影片、點雲](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud) | L16、L17 |
| 21 | [Diffusion 加速](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency) | L18 |
| 22 | [分散式訓練](/posts/ai/2026-09-30-mit-65940-distributed-training) | L19、L20 |
| 23 | [裝置端訓練](/posts/ai/2026-09-30-mit-65940-on-device-training) | L21 |
| 24 | [課程總結與量子 ML](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml) | L22、L23 |

## 三條閱讀路線

**完整路線。** 照 order 0–24 讀，每篇配該講的投影片與錄影，lab 篇讀完就動手。Fall 2024 的 lab 排程是每兩到三講一個，照這個節奏大約一學期。

**只想做 LLM 效率。** 讀 order 1（量尺）→ 5、6（量化基礎，AWQ 的前置知識）→ 14 → 15 → 16 → 17 → 19。Pruning 與 NAS 可以先跳過，遇到 LLM 稀疏化時再回頭讀 order 2。

**TinyML 與邊緣裝置。** 讀 order 1 → 2、3、4 → 5、6、7 → 8、9、10 → 12 → 13 → 23。這條線就是第一章加裝置端訓練，重點在 KB 級記憶體限制下的設計。

## 自學前先準備

- **Python 與 PyTorch。** Lab 0 就是 PyTorch 教學，跟不上就先補。
- **反向傳播與 CNN。** L2 只複習術語和層的形狀，不教訓練原理。沒學過的話先讀 [MIT 6.7960 導讀](/posts/ai/2026-08-26-mit-67960-deep-learning-guide)或 [CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)。
- **計算機結構的基本概念。** 先修 6.191 是計算機結構課，後面 TinyEngine、SIMD、記憶體階層都會用到。
- **一個 Google 帳號。** Lab 0–4 都在 Colab 上跑。

## 延伸閱讀

這些是站內跟 6.5940 有重疊的系列。重疊的部分本系列照樣完整寫，下面只是給想換角度的讀者：

- [MIT AI／ML 課程地圖](/posts/learning/2026-08-21-mit-ai-ml-course-map)：6.5940 在 MIT 課程體系裡的位置
- [Stanford CS336 導讀：GPU 與 TPU](/posts/ai/2026-08-22-cs336-gpu-tpu)、[推論](/posts/ai/2026-08-22-cs336-inference)：從語言模型訓練課的角度看硬體與推論
- [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[Stanford CME295 導讀](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)：Transformer 與 LLM 的完整原理
- [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)：ViT 與電腦視覺
- [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)：diffusion 與 flow matching 的理論

**系列導覽**：下一篇 [為什麼要高效、怎麼量模型大小與運算量](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課頁](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 課頁](https://hanlab.mit.edu/courses/2026-fall-65940)
- [MIT 6.5940 Fall 2023 課頁](https://hanlab.mit.edu/courses/2023-fall-65940)
- [EfficientML.ai 錄影入口（MIT HAN Lab YouTube）](https://live.efficientml.ai/)
- [Fall 2024 Lecture 1 投影片：Introduction](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0)
- [Fall 2024 Course Summary 投影片](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0)
- [Fall 2026 Lecture 1 投影片：Introduction](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0)
- [Fall 2026 Lab 1 壓縮檔（lab1_gpu_basics.zip）](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&st=2xh5vnk3&dl=1)
- [Fall 2024 期末專題題目清單](https://docs.google.com/document/d/1QiCkCUr_1DnLNUCXUM3g0SQRIbVG5XyrQjdfsUPrIeA)
- [Fall 2024 Lab 0：PyTorch Tutorial（Colab）](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)
- [Fall 2024 Lab 5 資料夾（Google Drive）](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0)
- [全球 AI／CS 課程地圖：A0–A3 分級定義](/posts/learning/2026-08-21-global-ai-cs-course-map)
