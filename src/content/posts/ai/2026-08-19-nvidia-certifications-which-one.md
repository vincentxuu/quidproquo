---
title: "NVIDIA 四張怎麼選：兩張還不能報名，訓練全要付費，官方文件還在打架"
date: 2026-08-19
type: guide
category: ai
tags: [certification, nvidia, career, gpu, agents]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 23
tldr: "NVIDIA 生成式 AI 線有四張：NCA-GENL、NCA-GENM（各 $125，associate）、NCP-GENL、NCP-AAI（各 $200，professional）。選之前先看三件別家沒有的事：一、兩張 professional 的 Register 按鈕都標著「Coming soon」，近期計畫直接只剩兩張 associate；二、NVIDIA 是本系列唯一官方備考課全部付費的廠商，真實成本是考試費加課程費，NCA-GENL 自學五門 $390、NCA-GENM 有兩門只有 $500 講師版、NCP-GENL 官方清單列價合計 $1,620；三、官方文件自相矛盾——NCP-AAI 的權重網頁加總 98%、PDF 加總 92%，NCP-GENL 網頁表格有兩格描述錯置（其中一格是 OpenUSD 的文字）。另外綁定程度差很多：NCP-AAI 只有 7% 綁 NVIDIA 產品，NCP-GENL 有 31% 在考 GPU 與模型壓縮。"
description: "NVIDIA 四張生成式 AI 證照（NCA-GENL、NCA-GENM、NCP-GENL、NCP-AAI）的選擇指南：從報名狀態、含課程的真實總成本、官方文件矛盾與廠商綁定程度四個決策輸入切入，附四種讀者情境的建議與續期成本試算。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-19-nvidia-certifications-which-one-en)
>
> 本文是從官方資料建出來的選擇指南，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回 [NVIDIA 官方認證頁](https://www.nvidia.com/en-us/learn/certification/)與各張的官方 Exam Study Guide，不含考古題。查證日期：2026-08-19。

NVIDIA 的生成式 AI 認證線目前有四張，兩張 associate、兩張 professional。系列前面四篇已經一張一篇拆過考綱，這篇只處理一件事：**你該考哪一張，以及不該考哪一張。**

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 先講最硬的限制：兩張現在報不了名

在比考綱、比難度、比含金量之前，先看報名按鈕。

| 證照 | 級別 | 費用 | 報名狀態（2026-08-19 查證） |
|---|---|---|---|
| [NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide) | Associate | $125 | **已開放**（Register for Exam，走 Certiverse） |
| [NCA-GENM](/posts/ai/2026-08-18-nvidia-nca-genm-prep-guide) | Associate | $125 | **已開放**（同上） |
| [NCP-GENL](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide) | Professional | $200 | **Register for Exam (Coming soon)** |
| [NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide) | Professional | $200 | **Register for Exam (Coming soon)** |

兩張 professional 的官方頁面上，Register 按鈕旁邊都掛著 `(Coming soon)`，**NVIDIA 沒有公布開放日期**。

這條件的殺傷力比它看起來大：**如果你的需求有時間壓力**（年底前要交一張證照、換工作前要補一行履歷、公司教育訓練預算今年要用完），**這兩張直接出局**，不是難不難的問題，是拿不到。四選一在這一步就縮成二選一。

反過來說，如果你沒有期限、只是想照考綱盤點自己的能力缺口，兩張 professional 的 blueprint 已經完整公開，可以現在就當檢核表用 —— 只是別把「考過」排進近期計畫。

## 決策輸入二：訓練全部要付費，所以真實成本不是考試費

其他廠商的官方備考材料幾乎都免費 —— AWS Skill Builder 的 Exam Prep Plan、微軟的 Microsoft Learn 路徑、Google Skills、Anthropic Academy 都是。**NVIDIA 四張全部不是。** 官方在每張認證頁的 Certification Learning Path 區塊直接把課程標價列出來，$30 到 $500 不等。

所以比較成本時，要比的是「考試費 + 官方建議課程」這一整包：

| | 考試費 | 官方建議課程 | 自學版買得到的部分 | 只能走講師課的部分 |
|---|---|---|---|---|
| **NCA-GENL** | $125 | 五門 | **五門全有自學版，合計 $390** | 無 |
| **NCA-GENM** | $125 | 五門 | 三門，合計 **$210** | **兩門，合計 $1,000** |
| **NCP-GENL** | $200 | 五門 | 官方標「Self-Paced」的三門合計 **$620**（含一門標自學卻要 $500 的） | 兩門，合計 $1,000 |
| **NCP-AAI** | $200 | 五門 | **四門，合計 $300** | 一門，$500 |

幾個直接可用的結論：

**一、NCP-AAI 的課程性價比最好。** 五門裡有四門買得到自學版，$300 就能蓋掉官方建議的大部分，而且這四門對應的是佔比最重的幾塊（Agent Development 15%、Evaluation and Tuning 13%、Knowledge Integration 10%）。考試 $200 加課程 $300，$500 拿下一張 professional 的完整官方路徑。

**二、單門投報率最高的是 NCP-AAI 頁面上的 Evaluating RAG and Semantic Search Systems。** 官方標價 **$30、3 小時**，直接對應 Evaluation and Tuning 那 **13%** —— 這是四張裡「每一塊錢買到的考綱覆蓋」最划算的一門。另外兩門 $30 的課同樣值得注意：NCA-GENL 與 NCA-GENM 共用的 [Introduction to Transformer-Based NLP](https://courses.nvidia.com/courses/course-v1:DLI+S-FX-08+V1/)（6 小時），以及 NCP-GENL 的 [Optimizing CUDA ML Codes With NVIDIA Nsight's Profiling Tools](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-AC-03+V2)（4 小時）。**四張的官方清單裡，$30 這個價位一共只有這三門，它們是整條產品線的甜蜜點。**

**三、NCA-GENM 的自學路線先天蓋不滿。** 五門建議課裡有兩門（Building Conversational AI Applications、Building AI Agents with Multimodal Models）**只有 $500 的講師版，沒有自學選項**。想完整照官方路徑走，是 $125 + $210 + $1,000 = $1,335；但這兩門對應的內容（對話式 AI 應用、多模態 agent）可以用官方文件與開源專案自己補，**不建議為它們花 $1,000**。

**四、NCP-GENL 是列價最貴的一張。** 官方清單五門合計 **$1,620**（$90 + $500 + $500 + $500 + $30），其中還有一個怪處：Deploying RAG Pipelines for Production at Scale 被標成「Self-Paced」卻要 $500，而 NCP-AAI 頁面上名稱相近的 **Introduction to** Deploying RAG Pipelines… 只要 $90 —— 兩者課程代碼不同（`C-FX-18` 與 `S-FX-19`），是不同的課，**買之前一定要核對代碼**。

**買課的順序建議**：先買 $30 那門對應你目標證照的，再依權重補 $90 的，$500 的講師課只有在公司出錢時才考慮。NCP-GENL 若公司願意出，Model Parallelism 那門 $500 最對應它的核心（GPU Acceleration 14% 幾乎整塊）。

## 決策輸入三：哪些官方數字可以信

這條在別家證照通常不用討論，但 NVIDIA 這四張要。**同一個廠商的網頁與 PDF 對不上，而且不只一次。**

| 證照 | 矛盾內容 | 現況 |
|---|---|---|
| **NCP-AAI** | 權重表兩處不同：Deployment and Scaling **網頁 13% / PDF 5%**；Run, Monitor, and Maintain **網頁 5% / PDF 7%**。兩版加總分別是 **98%** 與 **92%**，**沒有一版加總到 100%** | 兩份都是 nvidia.com 官方文件 |
| **NCP-GENL** | 網頁權重表有兩格描述文字錯置：Model Optimization（17%）那格寫的是**部署**內容（容器化推論、Kubernetes、Triton），Fine-Tuning（13%）那格寫的是 **OpenUSD 的資料交換**，跟微調毫無關係 | **權重本身是對的，壞掉的只有描述**；PDF study guide 裡兩塊的描述正常 |
| **NCA-GENL / NCA-GENM** | 題數：官方頁面內文寫「includes 50 questions」，規格欄寫「50–60 multiple-choice」 | 兩個數字並存於同一頁 |

**怎麼用這些資訊做決定**：

- **NCP-AAI 的兩塊權重不要挑一版當事實。** 把 Deployment and Scaling 當成 **5% 到 13% 的不確定區間**，配時間時取中間偏保守（當它 10% 左右）；其餘八項兩版一致，可以照數字排。
- **NCP-GENL 的準備一律以官方 PDF 為準**，不要照網頁那兩格讀。正確的內容是：Model Optimization 講剪枝、稀疏化、量化、知識蒸餾、超參數搜尋、進階取樣與 TensorRT；Fine-Tuning 講 SFT 與 RLHF（含 DPO、GRPO）、對比損失、LoRA／adapter／P-tuning、early stopping。
- **兩張 associate 的題數就照 50–60 抓**，反正時間固定一小時，練習節奏抓每題一分鐘不會錯。

這也是選 NVIDIA 這條線要有的心理準備：**你會需要自己交叉比對官方網頁與官方 PDF**，這件事在 AWS、微軟、Google 的考綱上都不必做。

## 決策輸入四：準備過程能不能轉移到非 NVIDIA 的工作

四張的廠商綁定程度差距很大，這直接決定「就算沒考成，讀的東西有沒有白讀」。

| 證照 | 綁定程度 | 具體綁在哪 |
|---|---|---|
| **NCP-AAI** | **最低** | 十個領域裡只有 **NVIDIA Platform Implementation 7%** 明確考自家產品（NeMo Guardrails、NIM microservices、NeMo Agent Toolkit、TensorRT-LLM、Triton），其餘 93% 是通用的 agentic 工程知識 |
| **NCA-GENL** | 低 | Trustworthy AI 那 10% 裡有一條「用 NVIDIA 與其他技術提升可信度」，其餘偏通用 ML 與 LLM 應用 |
| **NCA-GENM** | 中 | Software Development 那 15% 直接點名 **Riva、NeMo、Triton、Avatar Cloud Engine（ACE）** 四個 SDK；但同一塊的 U-Net、CLIP、擴散模型是通用知識 |
| **NCP-GENL** | **最高** | Model Optimization 17% + GPU Acceleration 14% = **31%** 在考量化、蒸餾、剪枝、分散式平行與 CUDA profiling，官方明確點到 **A100／H100 Tensor Core、TensorRT、Dynamo-Triton**，先修條件連 **C++** 都寫進去 |

**這張表反過來讀也成立**：如果你的工作本來就在 NVIDIA 硬體上跑訓練與推論，NCP-GENL 那 31% 是你每天在做的事，準備成本反而最低；如果你做的是雲端 API 上的 agent 應用，NCP-AAI 的 93% 通用內容才是能帶著走的。

**別把綁定程度低直接讀成「比較好考」**。NCP-AAI 的先修條件寫的是「1–2 年 AI/ML 經驗且做過 **production-level agentic AI projects**」，那是讀書補不了的門檻。

## 四種情況，四個建議

**情況一：你要在近期拿到一張，履歷上要有「NVIDIA」。**
考 **NCA-GENL**。理由不是它最好，是**它與 NCA-GENM 是現在唯二能報名的**，而職缺欄位寫「NVIDIA Generative AI / LLM 相關認證」時多半指的就是 NCA-GENL。成本 $125 起，課程按缺口挑著買。

先確認一件事：**NCA-GENL 名字寫 LLM，但沒有任何一塊叫「LLM」或「RAG」**。權重是 Core Machine Learning and AI Knowledge 30%、Software Development 24%、Experimentation 22%、Data Analysis and Visualization 14%、Trustworthy AI 10%，spaCy、NumPy、Keras、交叉驗證都在考。**抱著「我會接 LLM API，這張應該很快」的心態去考會失血**，這是本系列名實落差最大的一張。

**情況二：你做影像、音訊或跨模態。**
考 **NCA-GENM**，同樣 $125、一小時、現在可報名。它跟 NCA-GENL 是**平行的兄弟而不是階梯**：Experimentation 升到 25%（最重）、Core ML 降到 20%，並多出 Multimodal Data 15% 與 Performance Optimization 10% 兩塊全新的，考 U-Net、CLIP、擴散模型與多模態損失函數。準備時直接跳過那兩門 $500 講師課。

**情況三：你在做 agent 系統，沒有時間壓力。**
把 **NCP-AAI** 當成盤點工具而不是近期目標：十個領域當檢核表逐條問「我在生產環境做過嗎」，缺的補上；平台那 7%（NeMo Guardrails、NIM、NeMo Agent Toolkit、TensorRT-LLM、Triton）是唯一無法從通用 agent 經驗轉移過來的部分，值得先補。**課先別買** —— 考綱可能隨開放而調整，太早買可能學到被改掉的內容。

如果你需要的是「現在就能考到的 agentic 專業級證照」，NVIDIA 這條線暫時給不了，可以看[微軟 AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)（beta 階段，但必須先持有 AI-103）。

**情況四：你的工作是把模型壓小、在 GPU 上跑快。**
**NCP-GENL** 是四張裡唯一對應這件事的，也同樣還不能報名。它的定位不是「NCA-GENL 的進階版」—— 那是最常見的誤解。NCA-GENL 橫跨傳統 ML 與 LLM 應用，NCP-GENL 往下鑽模型與硬體，兩者的重心不同。等開放期間，$30 的 Nsight profiling 課是最便宜的起手式。

## 三個常見的選型誤解

**一、以為 professional 要先考 associate。** 不用。官方**沒有把 associate 設成 professional 的先修條件**，兩級的先修寫的都是「幾年經驗」而不是「先拿哪張證照」——NCP-AAI 寫 1–2 年、NCP-GENL 寫 2–3 年。

**二、以為兩張 professional 是階梯。** 它們是平行關係：NCP-GENL 往下鑽模型與硬體（Model Optimization 17% + GPU 14%），NCP-AAI 往上長系統與 agent（Agent Architecture 15% + Agent Development 15%）。選哪張看你工作在哪一層，不看誰比較「高」。

**三、以為兩張 associate 是階梯。** 同樣不是。NCA-GENL 與 NCA-GENM 同價（$125）、同時長（1 小時）、同級別，一張走 LLM、一張走多模態。如果你已經準備過 NCA-GENL，NCA-GENM 大約有四分之一是全新內容（Multimodal Data 15% + Performance Optimization 10%），其餘是同一套骨架換題材。

## 續期成本：這條線沒有便宜的續命方式

四張證照的官方頁面都是同一句話：

> This certification is valid for two years from issuance. Recertification may be achieved by retaking the exam.

官方 FAQ 更直接：「NVIDIA certifications are valid for two years, after which you must retake the exam to be recertified.」**沒有繼續教育路徑、沒有續期折扣、沒有像微軟那樣的免費線上評量。**

所以每張證照的長期成本是「首考 + 每兩年重考一次全額」：

| 持有組合 | 首次成本（僅考試費） | 每兩年續期 |
|---|---|---|
| 一張 associate | $125 | $125 |
| 兩張 associate | $250 | $250 |
| 一張 professional | $200 | $200 |
| 四張全拿 | $650 | $650 |

**這條會反過來影響選型**：多拿一張的邊際成本不只是那一次考試費，而是**每兩年都要再付一次**。除非職缺明確點名，否則同時養兩張以上不划算 —— 挑一張最對應你工作內容的，續下去就好。

**失敗成本**則相對友善：依官方 FAQ，沒過可以再考，**間隔 14 天**，且**同一張考試 12 個月內最多五次**，每次重新購買。這比 Google 的階梯式罰則（第三次沒過等一年）寬鬆得多，所以時程不必抓得過度保守。

## 決策一頁表

| | NCA-GENL | NCA-GENM | NCP-GENL | NCP-AAI |
|---|---|---|---|---|
| 級別／費用 | Associate ／ $125 | Associate ／ $125 | Professional ／ $200 | Professional ／ $200 |
| 時長／題數 | 1 小時／50–60 | 1 小時／50–60 | 120 分鐘／60–70 | 120 分鐘／60–70 |
| **能否報名** | **可以** | **可以** | **Coming soon** | **Coming soon** |
| 最重的塊 | Core ML 30% | Experimentation 25% | Model Optimization 17% + GPU 14% | 架構 15% + 開發 15% |
| 自學課程成本 | $390（五門全有） | $210（只有三門） | $620（三門，含一門標自學卻 $500） | **$300（四門）** |
| NVIDIA 綁定 | 低 | 中（四個 SDK） | **高（31% 硬體層）** | **最低（7%）** |
| 官方文件問題 | 題數兩個數字 | 題數兩個數字 | 網頁兩格描述錯置 | 權重網頁 98%／PDF 92% |
| 適合誰 | 職缺點名 NVIDIA GenAI／LLM | 做影像、音訊、跨模態 | 訓練與推論最佳化工程師 | 做 production agent 系統 |

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-19 查證） | 什麼時候要重查 |
|---|---|---|
| 兩張 professional 的報名狀態 | 仍是 Coming soon | **每月** |
| NCP-AAI 權重矛盾 | 網頁 98%、PDF 92%，兩項數字不同 | 開放報名時 |
| NCP-GENL 網頁兩格錯置描述 | 仍是錯的（Model Optimization 寫部署、Fine-Tuning 寫 OpenUSD） | 每季 |
| DLI 課程與價格 | $30 / $90 / $500 三檔 | 每季 |
| 考試費與效期 | $125 / $200、兩年、只能重考 | 每半年 |

## 參考資料

- [NVIDIA 認證總覽與 FAQ（計分方式、重考規則、續期）](https://www.nvidia.com/en-us/learn/certification/)
- [NCA-GENL 官方認證頁](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NCA-GENM 官方認證頁](https://www.nvidia.com/en-us/learn/certification/generative-ai-multimodal-associate/)
- [NCP-GENL 官方認證頁](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/)
- [NCP-AAI 官方認證頁](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [Evaluating RAG and Semantic Search Systems（$30／3 小時）](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-32+V1)
- [Optimizing CUDA ML Codes With NVIDIA Nsight's Profiling Tools（$30／4 小時）](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-AC-03+V2)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [NVIDIA NCA-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide)
- [NVIDIA NCA-GENM 備考路徑](/posts/ai/2026-08-18-nvidia-nca-genm-prep-guide)
- [NVIDIA NCP-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide)
- [NVIDIA NCP-AAI 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide)
- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
