---
title: "CMU 11-868 LLM Systems 導讀：總覽與自學路線——28 份講義、7 份作業全公開，但官方課表未列公開錄影連結、要自備 GPU"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm, course-guide, self-study]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 0
tldr: "CMU 11-868 是 Lei Li 開的 LLM 系統研究所課：從 CUDA kernel、自己的 MiniTorch 框架，一路做到分散式訓練、SGLang 服務與 RLHF。Spring 2026 的 28 份講義、7 份作業頁與 7 個起始碼 repo 全部公開，可評為 A3；缺的是錄影、GPU 與 PSC 帳號、quiz，以及「哪兩份作業是選修」這件事官方沒寫。"
description: "CMU 11-868 LLM Systems 系列總覽：課程定位、2024 春到 2026 秋四個學期的演變、A3 存取等級與缺口、Fall 2026 的政策差異（禁止用 AI agent 完成作業、TPU 新講題、遲交每天扣 30%）、期末專題規格與時程，以及依硬體條件分層的自學路線。"
draft: false
glossary:
  - term: "MiniTorch"
    aliases: ["miniTorch"]
    definition: "Sasha Rush 為教學寫的迷你深度學習框架，支援張量運算與自動微分。CMU 11-868 在上面加了真正的 CUDA kernel 與 GPU 加速，七份作業大多圍繞它展開。"
    context: "11-868 作業站的 Overview 頁說明了這個來源與擴充。"
  - term: "PSC"
    aliases: ["Pittsburgh Supercomputing Center", "Bridges-2"]
    definition: "Pittsburgh Supercomputing Center，匹茲堡超級電腦中心。11-868 提供修課學生 PSC 的 GPU 叢集帳號，採排隊制的 job scheduling。"
    context: "Fall 2026 Logistics 寫明一般排隊時間超過 24 小時，且不會因此延長截止日。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本系列依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版（最近一個已結束、材料最齊的學期），Fall 2026 正在上課，只拿來對照差異。所有事實都在 2026-09-30 打開官方頁面、講義 PDF 與 GitHub repo 核對。存取等級 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：講義、作業說明、起始碼、專題規格都公開，足以自學；拿不到的是錄影、GPU 叢集、quiz 與評分。

**系列位置**：本篇是總覽｜下一篇 [L01 開場：LLM 為什麼需要系統](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems)

CMU 11-868 是 [Language Technologies Institute](https://www.lti.cmu.edu/) 的研究所課，講師是 [Lei Li](https://www.cs.cmu.edu/~leili/)。它不教怎麼用 LLM，教的是怎麼把 LLM 的訓練、微調與服務做成跑得動的系統。Spring 2026 首頁的課程描述列了八件事：用大量資料高效訓練、embedding 的儲存與檢索、資料效率高的微調、通訊效率高的演算法、RLHF 的高效實作、GPU 與其他硬體的加速、部署用的模型壓縮，以及上線後的維護。

作業的主角是 [MiniTorch](https://llmsystem.github.io/llmsystemhomework)。[作業站 Overview](https://llmsystem.github.io/llmsystemhomework) 說明，它原本是 [Sasha Rush](https://rush-nlp.com/) 的教學框架，本課「extend the original framework to support real cuda kernels」。你先寫 CUDA kernel，再在自己的框架裡做 autodiff、Transformer、融合 kernel，最後才換到 DeepSpeed、SGLang 這些產業框架。

FAQ 把它跟 CMU 另一門 LLM 課 11-667 分得很清楚：11-667 講模型、學習演算法與應用；11-868 講「building systems for LLM, including training, serving, and maintaining」。FAQ 也直說，不想寫底層系統程式碼的人應該去修 11-667。

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 這門課的硬事實

| 項目 | Spring 2026 |
|---|---|
| 上課 | 1/12–4/28，一三 12:30–1:50，週五有選修 recitation |
| 講師／TA | Lei Li；TA 四人（Aditya Tummala、Danqing Wang、Jackey Hua、Sreeram Vennam） |
| 先修 | 線代、微積分、機率統計；Python 加 C／C++／Java（15-122 程度）；ML 背景「preferred but not required」 |
| 作業 | 「five required and two optional programming assignments」，個人完成 |
| 配分 | 作業 44%（另有 5% optional）、Quiz 10%、Participation 2%（最多再加 5%）、Project 44% |
| 教材 | 不指定課本；不熟 GPU 程式的人建議讀 *Programming Massively Parallel Processors* 第 4 版 |
| 運算資源 | PSC 叢集，新手可用 Google Colab |
| 論壇 | Ed；不要寄信給個別助教 |
| 錄影 | 官方頁面沒有任何錄影或 YouTube 連結 |

資料來源：[Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics)、[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)、[FAQ](https://llmsystem.github.io/llmsystem2026spring/docs/FAQ)。

FAQ 對負擔的估計是：已修過機器學習、也習慣寫 C 的人，每週約 12 小時。Participation 的加分規則很有這門課的味道：在作業 repo 找到錯字或 bug、送 pull request 且被合併，就能拿 bonus。`llmsys_hw1` 到 `llmsys_hw7` 的最新 commit 大多就是「Merge pull request」，這條管道確實有人在用。

## 四個學期怎麼演變

[課程入口](https://llmsystem.github.io/)列了四個學期：2024 春、2025 春、2026 春、2026 秋。入口也註明，本課的「slightly adjusted」版本是 [CMU GenAI/LLM certificate](https://www.cmu.edu/online/generative-ai-llms) 的核心課。

| 學期 | 作業 | 評量特色 | 課表變化 |
|---|---|---|---|
| [2024 春](https://llmsystem.github.io/llmsystem2024spring/docs/Syllabus) | HW1–HW4 | 作業各 10%、課堂論文報告 10%、每位學生寫論文 review | 後半段有 RAG、HNSW、多模態、Attention Sink 等講題 |
| [2025 春](https://llmsystem.github.io/llmsystem2025spring/docs/Syllabus) | Syllabus 列 HW1–HW5 截止日 | Logistics 寫「Homework 10% each, 40% in total」；每人 150 美元 AWS 額度 | 加入 Tri Dao、Woosuk Kwon、Hao Zhang、Ying Sheng 等客座；最後一講是 RL 系統 |
| [2026 春](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) | HW1–HW7（5 必修＋2 選修） | 作業 44%（+5%） | Google 客座講 TPU／JAX 與 Pallas；prefill／decode 拆分（Vikram Mailthody）與 LMCache（Junchen Jiang）客座 |
| [2026 秋](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) | 同 7 份作業 | 作業 44%，拿掉「+5% optional」 | 新增 Week 13「Acceleration on TPU 1/2」 |

2025 春的兩個頁面彼此對不上：Syllabus 排了五份作業的截止日，Logistics 卻寫每份 10%、總共 40%。官方沒有說明，本文不替它補解釋。

整體走向很清楚。2024 春還帶著研討課的形式，要學生讀論文、寫 review、上台報告；之後這些拿掉，換成更多實作作業與產業客座。後半學期的 RAG、向量搜尋、多模態等講題，到 2026 春退到 Syllabus 底部的「未排日期」區，只剩 reading、沒有投影片。

## 存取等級 A3，與六個缺口

Spring 2026 公開的東西夠完整：[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 上 28 份講義 PDF、[作業站](https://llmsystem.github.io/llmsystemhomework)七份作業說明、[GitHub 組織](https://github.com/llmsystem)底下七個作業 repo 與範例程式 [`llmsys_code_examples`](https://github.com/llmsystem/llmsys_code_examples)，加上[專題規格](https://llmsystem.github.io/llmsystem2026spring/docs/Projects)。照課程地圖的定義，這是 A3：有系統化教材、作業與必要檔案。

但 A3 不等於沒有缺口。校外讀者會碰到這六件事：

1. **官方課表未列公開錄影連結。** Spring 與 Fall 2026 的頁面都沒有錄影連結。這是它跟 [Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) 最大的差別：你只能讀投影片與論文，投影片上的口頭補充一律拿不到。
2. **要 NVIDIA GPU。** [Assignment 1](https://llmsystem.github.io/llmsystemhomework/assignment_1/) 開頭寫「You'll need a GPU」；[Assignment 5](https://llmsystem.github.io/llmsystemhomework/assignment_5/) 要至少兩張 GPU；[Assignment 6](https://llmsystem.github.io/llmsystemhomework/assignment_6/) 建議在 PSC 開兩張 GPU，用 LoRA 讓 Llama-2-7B 在「2 V100 GPUs/ 16GB GPU memory」上訓練得起來。校外讀者沒有 PSC 帳號，要自己租雲端 GPU。
3. **Quiz 與評分不公開。** Quiz 佔 10%，投影片上的 quiz 連結都指向 CMU Canvas；Ed 論壇與繳交系統也只對修課學生開放。
4. **哪兩份作業是選修，官方沒寫。** Logistics 只說「five required and two optional」，作業站七頁都沒標示哪份是 optional。本系列不猜。
5. **有些講題沒有投影片。** 4/15「Efficient Reinforcement Learning System for LLMs」只有 [ReaLHF](https://arxiv.org/abs/2406.14088) 論文連結；「Accelerating Transformer on GPU」Part 1 和 Part 2 共用同一份 PDF；Syllabus 底部的 Triton、RAG、HNSW、多模態、Attention Sink 五個未排日期講題只有 reading。
6. **課本要自己買。** PMPP 第 4 版的連結走 O'Reilly 的 CMU SSO，Logistics 寫「Please login using your andrew email for free access」。

另外，FAQ 明講這門課沒有旁聽選項，因為要先消化很長的候補名單。

## 作業 repo 是跨學期共用的

這點會直接影響你 clone 下來的程式碼。作業站與 `llmsys_hw1`–`llmsys_hw7` 沒有依學期分開，Fall 2026 正在改。2026-09-30 用 GitHub API 查預設分支 `main` 的最新 commit：

| repo | 最新 commit | 狀態 |
|---|---|---|
| `llmsys_hw1` | 2026-01-30 | 春季期間 |
| `llmsys_hw2` | 2026-09-02 | 已被 Fall 2026 改過 |
| `llmsys_hw3` | 2026-09-09 | 已被 Fall 2026 改過 |
| `llmsys_hw4` | 2026-09-30 | 已被 Fall 2026 改過 |
| `llmsys_hw5` | 2026-04-30 | 春季狀態 |
| `llmsys_hw6` | 2026-03-23 | 春季狀態 |
| `llmsys_hw7` | 2026-05-02 | 春季狀態 |

更早的 `llmsys_s24_hw1–4` 與 `llmsys_s25_hw1–5` 仍然公開。

**怎麼做**：想對齊春季版，就在 clone 後切到春季結課前的 commit：

```bash
git clone https://github.com/llmsystem/llmsys_hw2.git
cd llmsys_hw2
git checkout $(git rev-list -n 1 --before=2026-04-29 main)
```

想跟著 Fall 2026 的修正走，就留在 `main`，但作業頁的題號與配分可能跟本系列寫的不一樣。

## 總覽之外的 22 篇怎麼排

本系列大致照官方課序，只做三處調整，都是為了讀起來順，不是官方安排：作業篇緊接在它依賴的講座之後（官方常先發作業再上課，例如 HW1 在 L02 當天就發）；Google 的 TPU／JAX 與 Pallas 客座從 Week 7 移到 FlashAttention 之後，讓 Splash Attention 能直接對照 FlashAttention 的 tiling；三份未排日期但有投影片的 serving 講義，併進「大規模服務」那篇。

| # | 階段 | 文章 |
|---|---|---|
| 1 | 動機 | [L01 開場：LLM 為什麼需要系統](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems) |
| 2 | 硬體 | [L02–L04 GPU 程式模型與加速](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration) |
| 3 | 硬體 | [HW1：CUDA Programming](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming) |
| 4 | 框架 | [L05 深度學習框架與自動微分](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff) |
| 5 | 框架 | [HW2：MiniTorch Framework](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework) |
| 6 | 模型 | [L06–L07 Transformer 與預訓練 LLM](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms) |
| 7 | 模型 | [L08–L09 Tokenization、解碼與 speculative decoding](/posts/ai/2026-09-30-cmu11868-tokenization-decoding) |
| 8 | 模型 | [HW3：在 MiniTorch 實作 decoder-only Transformer](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture) |
| 9 | 單卡加速 | [L10 在 GPU 上加速 Transformer（LightSeq）](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq) |
| 10 | 單卡加速 | [HW4：Softmax／LayerNorm 融合 kernel](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration) |
| 11 | 多卡訓練 | [L14–L15 分散式訓練與資料平行](/posts/ai/2026-09-30-cmu11868-data-parallel-training) |
| 12 | 多卡訓練 | [L16–L17 模型平行與 MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe) |
| 13 | 多卡訓練 | [L18 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization) |
| 14 | 多卡訓練 | [HW5：資料平行與管線平行](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training) |
| 15 | 變小變快 | [L19–L20 模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization) |
| 16 | 變小變快 | [L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention) |
| 17 | 變小變快 | [L12–L13 TPU、JAX 與 Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas) |
| 18 | 變小變快 | [L23 高效微調（LoRA、QLoRA）](/posts/ai/2026-09-30-cmu11868-peft-lora) |
| 19 | 服務 | [L22、L24 LLM 服務：SGLang 與 vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm) |
| 20 | 服務 | [HW6：DeepSpeed＋SGLang](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems) |
| 21 | 服務 | [L26–L30 大規模服務與 KV cache](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache) |
| 22 | 對齊系統 | [RLHF 系統與 HW7](/posts/ai/2026-09-30-cmu11868-hw7-rlhf-systems) |

## Fall 2026 改了什麼

| 項目 | Spring 2026 | Fall 2026 |
|---|---|---|
| 上課 | 一三 12:30–1:50 | 一三 5:00–6:20，週五 recitation；矽谷校區學生線上參加 |
| TA | 4 人 | 6 人 |
| AI 工具 | 「Using Github copilot or any AI agent is ok for explanation purpose」 | 「It is strictly forbidden to use any AI agent to complete the homework」，LLM 只能用來解釋 |
| 遲交 | 全學期 3 天免罰，之後每天扣 20%；期末報告不能遲交 | 「Each late day will incur 30% discount on the grades」 |
| PSC | 不保證 job 何時開始跑 | 一般排隊時間超過 24 小時，不會因 job 沒跑到而延期（除非 PSC 停機超過 24 小時） |
| 作業配分 | 44%（+5% optional） | 44% |
| 課序 | Google 客座在 Week 7 | Google 客座提前到 Week 6；Week 13 新增「Acceleration on TPU 1/2」，目前沒有投影片 |

資料來源：[Fall 2026 Logistics](https://llmsystem.github.io/llmsystem2026fall/docs/Logistics)、[Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus)。

Fall 2026 首頁的課程描述也整段改寫，點名 vLLM、SGLang、FlashAttention，並說學生會寫「custom GPU/TPU acceleration kernels (CUDA/Triton)」。GitHub 組織在 2026-09-29 新建了一個 [`shared-tpu-notebooks`](https://github.com/llmsystem/shared-tpu-notebooks) repo，描述是讓上百個學生從 Jupyter notebook 用到 Cloud TPU。它會不會用在 Week 13 的 TPU 講題，官方頁面沒有說。

## 期末專題：規格與時程

專題佔 44%，拆成 proposal 2%、mid-term 2%、presentation 20%、final report 20%。[Projects 頁](https://llmsystem.github.io/llmsystem2026spring/docs/Projects)的規格如下：

- **組隊**：2–3 人，題目要同時有系統面與 LLM 面。
- **兩種題型**：在 MiniTorch 裡重新實作一篇近期的 LLM 系統論文；或做研究型題目，目標投稿 MLSys、OSDI、SOSP、SC 等會議。L01 投影片補充，MiniTorch 題型「should not use external PyTorch/Tensorflow code」。
- **Proposal**：用 MLSys 2024 的 LaTeX 樣式，回答要解決的系統問題、現有最佳方法、評估方式與 workload、分工、時程，以及需要多少 CPU／GPU／儲存與計算時間。
- **Mid-term report**：不限頁數，建議最多 6 頁，包含動機、相關研究、方法、已有實驗、剩餘工作。
- **Final report**：建議最多 8 頁，多了實作細節、分析與 ablation、限制，以及具體到檔案層級的成員貢獻（例如「Author X contributed to the function in the file ABC.py」）。
- **種子題目**：在 MiniTorch 實作 FlashAttention、PagedAttention、混合精度訓練、DPO；研究題有 KV cache 管理、MoE 訓練加速、異質硬體訓練、在瀏覽器裡加速 WebLLM 等。

Spring 2026 的時程（Syllabus）：

| 里程碑 | 日期 |
|---|---|
| 組隊名單 | 2/20 |
| Proposal | 2/27 |
| Mid-term report | 4/1 |
| 期末發表 | 4/27 |
| Final report | 4/28 |

L03 投影片寫的組隊期限是 2/18，跟 Syllabus 的 2/20 不同，以 Syllabus 為準。

## 自學路線

這門課的材料是公開的，真正的門檻是硬體。先看你手上有什麼，再決定走哪條路。

### 路線一：只讀講義，不碰 GPU

照本系列順序讀投影片與 Syllabus 列的論文。能做的作業只有 [Assignment 2](https://llmsystem.github.io/llmsystemhomework/assignment_2/)：它在 MiniTorch 裡實作 autodiff 與情感分類器，作業頁寫「Training on CPU can take some time」，代表 CPU 跑得動。

**今晚能做的事**：打開 [L02 GPU Programming](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf)，把第 15 頁 B200、H100、A100 的規格表抄下來，標出 FP32 算力與記憶體頻寬的比例，後面好幾講都會用到。

### 路線二：一張 NVIDIA GPU

加上 HW1（CUDA kernel）、HW3（在 MiniTorch 做 decoder-only Transformer）、HW4（Softmax 與 LayerNorm 的融合 kernel）。Colab 的 T4 可以先拿來跑範例：`llmsys_code_examples` 的 notebook 就是用 `-arch=sm_75` 為 T4 編譯。HW3 的第 4 題要訓練翻譯模型，作業頁提醒「You may need to spend at least 10 hours for the training process」，免費 Colab 的連線時限撐不住，建議租一台按小時計費的雲端 GPU。

**今晚能做的事**：在 Colab 開 GPU runtime，跑 [`simple_cuda_demo/CUDA_Code_Examples.ipynb`](https://github.com/llmsystem/llmsys_code_examples/blob/main/simple_cuda_demo/CUDA_Code_Examples.ipynb)，確認 `nvcc` 編得過向量加法。

### 路線三：兩張以上 GPU

HW5（自己寫資料平行與管線平行）要至少兩張 GPU；HW6（DeepSpeed ZeRO 加 LoRA 訓練 Llama-2-7B，再用 SGLang 推論）作業頁以兩張 V100 為目標。HW7 在 VERL 風格的框架裡做 RLHF，指令範例用 GPT-2，作業頁沒有寫硬體需求。

**今晚能做的事**：先估價。把雙卡機器的每小時價格乘上 HW3 那種「至少 10 小時」的訓練量，再決定要不要走完整條路線，還是只做 HW5 的資料平行那一半。

### 專題

校外讀者沒有隊友與評分，但專題規格本身就是一份很好的練習清單。挑一個種子題目（例如在 MiniTorch 實作 FlashAttention），照 mid-term report 的五節格式寫給自己看。

## 延伸閱讀

- [Stanford CS336 導讀](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)：從零訓練語言模型，GPU、kernel、平行化、推論都有對應講次，而且有錄影。
- [CME295 第 5 講：LLM 系統](/posts/ai/2026-09-29-cme295-llm-systems)：一講的篇幅快速掃過 KV cache、分散式訓練與推論加速。
- [CMU 11-785 深度學習導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)：autodiff 與 Transformer 的背景。
- CMU 10-414/714 Deep Learning Systems（[dlsyscourse.org](https://dlsyscourse.org/)）：也是自己寫框架的課，站上還沒有系列，定位可以先看 [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Large Language Model Systems Courses（課程入口，列出四個學期）](https://llmsystem.github.io/)
- [CMU 11-868 Spring 2026 首頁](https://llmsystem.github.io/llmsystem2026spring/)
- [Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics)
- [Spring 2026 Projects](https://llmsystem.github.io/llmsystem2026spring/docs/Projects)
- [Spring 2026 FAQ](https://llmsystem.github.io/llmsystem2026spring/docs/FAQ)
- [CMU 11-868 作業站（Assignment 1–7）](https://llmsystem.github.io/llmsystemhomework)
- [GitHub 組織 llmsystem（作業 repo 與範例程式）](https://github.com/llmsystem)
- [Fall 2026 首頁](https://llmsystem.github.io/llmsystem2026fall/)
- [Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus)
- [Fall 2026 Logistics](https://llmsystem.github.io/llmsystem2026fall/docs/Logistics)
- [Spring 2025 Syllabus](https://llmsystem.github.io/llmsystem2025spring/docs/Syllabus)
- [Spring 2024 Syllabus](https://llmsystem.github.io/llmsystem2024spring/docs/Syllabus)
- [L01 Introduction 投影片（Spring 2026）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-01-intro-14e74a426e4a7e3ed485a026e1f65b70.pdf)
- [全球 AI／CS 課程地圖（A0–A3 定義）](/posts/learning/2026-08-21-global-ai-cs-course-map)
