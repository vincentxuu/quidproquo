---
title: "成本、延遲與可用性的考點交集：六張證照從三個不同高度考同一件事"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, llm, inference, cost-optimization, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 20
tldr: "Google PMLE、AWS AIF-C01 與 AIP-C01、微軟 AI-103 與 AI-500、NVIDIA NCP-GENL 都考「怎麼讓 GenAI 應用又快又便宜又不掛」，但排起來是一道三階梯子：AIF-C01 問你知不知道成本隨 token 走，AIP-C01 與微軟兩張問你控不控得住，NCP-GENL 問你改不改得動模型與硬體。切入的高度差三層：NVIDIA 在 kernel 與量化層（Model Optimization 17% + GPU Acceleration 14% = 31%，全系列最重的單一成本延遲區塊），AWS 與微軟在應用層（快取三層、token 上限、chargeback），Google 在 MLOps 層（CPU/GPU/TPU 評估、資料平行 vs 模型平行、依吞吐量擴展服務後端）。交集是八根槓桿，但同一根在三個高度上是三種題目。本文刻意不帶任何價格與硬體規格數字——那是這個主題腐敗最快的部分。"
description: "跨證照的 GenAI 成本、延遲與可用性考點整理：比對 Google PMLE、AWS AIF-C01 / AIP-C01、微軟 AI-103 / AI-500、NVIDIA NCP-GENL 的官方 exam guide，抽出八根共用槓桿、四家名詞對照表、不能互相轉移的考點，以及一份能蓋掉交集的練習清單。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-genai-cost-latency-exam-domains-en)
>
> 本文是從官方資料建出來的備考材料，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回各家官方 exam guide 或 study guide，來源逐條列在文末。查證日期：2026-08-18。

這是 [AI 證照備考系列](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)的技術深潛篇。系列 A 軌是一張證照一篇，這篇反過來：**把「成本、延遲、可用性最佳化」這個被六張證照重複考的主題抽出來，一次講完交集，再標出各家不能互相取代的部分。**

這個主題跟 [多 agent 架構那篇](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)有個關鍵差別：**多 agent 的交集是同一高度上的同一件事，成本延遲的交集不是。** 六張證照講的槓桿名字很像，但它們站在不同的抽象層——NVIDIA 在問「這個 kernel 為什麼慢」，AIP-C01 與微軟在問「這個請求該不該打到模型」，Google 在問「這個服務後端該怎麼擴」，而 foundational 級的 AIF-C01 只問「你知不知道成本是隨 token 走的」。**只把交集背下來，任何一張都會在自己那層的細節上失血。**

## 哪六張，考點各在哪、佔多重

| 證照 | 相關 domain | 權重 | 這張的高度 |
|---|---|---|---|
| [NVIDIA NCP-GENL](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide) | Model Optimization | **17%** | 模型層：量化、剪枝、蒸餾、KV cache |
| 同上 | GPU Acceleration and Optimization | **14%** | 硬體層：六種平行、Tensor Core、CUDA profiling |
| 同上 | Model Deployment | 9% | serving 層：動態批次、Dynamo-Triton |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide) | Operational Efficiency and Optimization | 12% | 應用層：token 成本、快取、延遲、可觀測性 |
| 同上 | FM Integration（1.2 韌性設計） | 31% 的一部分 | 可用性：跨區推論、circuit breaker、優雅降級 |
| 同上 | Implementation and Integration（2.2 部署、2.4 韌性） | 26% 的一部分 | provisioned throughput、model cascading、模型路由 |
| [微軟 AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)（beta） | Evaluate, optimize, and monitor | 20–25% | 平台可用性與 SLA、token 上限、chargeback |
| [微軟 AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide) | Plan and manage an Azure AI solution | 25–30% | 配額、擴展、速率限制與成本管理 |
| [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) | 第 3 章 Scaling prototypes | ~21% | 選型與訓練：CPU/GPU/TPU、資料平行 vs 模型平行 |
| 同上 | 第 4 章 Serving and scaling | ~20% | 服務層：依吞吐量擴展服務後端 |
| 同上 | 第 1 章 低程式碼 AI 方案 | ~13% | 「針對成本、延遲、可用性最佳化 Gemini 應用」逐字出現在這 |
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)（foundational） | 第 2 章 Fundamentals of GenAI | 24% | 概念層：token 計價模型與成本效能關係 |
| 同上 | 第 3 章 Applications of Foundation Models | 28% | 概念層：FM 選擇準則含 prompt caching、客製化方式的成本取捨 |

**頭條是 NCP-GENL 的 31%。** Model Optimization 17% 加 GPU Acceleration and Optimization 14%，是本系列十五張證照裡**最重的單一成本／延遲區塊**——別家的 GenAI 認證考的是怎麼用模型，這張考的是怎麼讓模型在 GPU 上跑得更快、佔更少記憶體。

**這六張排起來是一道梯子，三階**：

| 階 | 證照 | 它問的問題 |
|---|---|---|
| 一、知不知道 | AIF-C01（foundational） | **成本是不是隨 token 走**、換模型或壓 prompt 會差多少、四種客製化方式哪個貴 |
| 二、控不控得住 | AIP-C01、AI-103、AI-500 | 怎麼量、怎麼快取、怎麼設上限、怎麼分帳、怎麼在供應商掛掉時還能回應 |
| 三、改不改得動 | NCP-GENL（＋PMLE 的訓練那半） | 換模型本身、換精度、換硬體、換平行策略 |

**這道梯子有實用價值**：如果你連第一階都還沒踩穩——說不出同一個任務換模型之後成本差在哪——那先讀 AIF-C01 的第 2、3 章比直接啃 AIP-C01 的第 4 章快。AIF-C01 官方的準備建議就是要能**算出**「同樣一個任務，換模型或壓縮 prompt 之後成本差多少」，那是這整個主題的入口門檻。

**但第一階不會自動帶你上第二階**：AIF-C01 是 foundational 級，它問的是概念關係（token 越多越貴、prompt caching 是選型準則之一），不問你怎麼實作。下面八根槓桿裡，AIF-C01 只在第一、二、三根出現，而且都停在「知道有這回事」。

**兩個範圍上的注意事項要先講**：

一、**AIP-C01 的成本延遲考點不只在那 12%。** 官方把 Operational Efficiency 單獨列成第 4 章，但韌性設計（1.2）、部署策略與模型路由（2.2、2.4）、token 效率與延遲品質比（5.1）分散在另外三章裡。**照「12%」分配讀書時間會低估這個主題在這張的實際份量。**

二、**NCP-GENL 官方網頁的 Model Optimization 那格描述是壞的**——網頁寫的是部署內容（容器化推論管線、Kubernetes、Triton），跟同表 Model Deployment（9%）幾乎重複。**權重是對的，壞的只有描述文字**，正確描述（剪枝、稀疏化、量化、知識蒸餾、超參數搜尋、進階取樣、TensorRT）在官方 PDF study guide 裡。準備這塊時以 PDF 為準。細節見 [NCP-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide)。

## 交集：八根槓桿

### 一、模型與硬體選型是第一根槓桿，也是最便宜的一根

六份材料都把「選對東西」放在最前面，而且都要求你**用取捨條件而不是偏好**來選：

- **PMLE 第 3 章**：依**成本、複雜度、延遲、擴展性**選模型型態（ARIMA、DNN、LLM）與產品；並且**評估 CPU、GPU 與 TPU**。這是六份材料裡唯一把三種運算單元並列要你判斷的。
- **AIP-C01 4.1**：成本與能力的取捨、**依查詢複雜度分層使用 FM**、性價比評估；2.2 另有 **model cascading** 與**小型任務專用模型**。
- **AI-500 架構塊**：把**任務需求對應到模型家族的能力**。
- **AI-103 規劃塊**：為各任務挑對模型（LLM、小型語言模型、多模態、Foundry Tools）。
- **[AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide)**（架構師視角）：**實作 model router 把請求導向最合適的模型**，並用**含總持有成本的 ROI 準則**做判斷。
- **[AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide) 第 2 章**：模型選擇因素明列**成本、延遲、模型複雜度**；第 3 章的 **FM 選擇準則**更長——成本、模態、延遲、多語言、模型大小、複雜度、客製化、輸入輸出長度、prompt caching。**這是六份裡把選型準則列得最完整的一份**，雖然它只要求你認得這些準則，不要求你權衡到數字。

**這幾條講的是同一件事的兩個版本**：靜態選型（這個任務用哪個模型）與動態路由（這個請求用哪個模型）。AWS 叫 model cascading 與智慧模型路由，微軟叫 model router，Google 沒給名字但把它藏在「依成本、複雜度、延遲、擴展性選模型」裡。**題目通常給你一個混合負載的情境**——大量簡單請求加少量複雜請求——正解幾乎都是分層而不是全部打大模型。

**要點回指**：PMLE 第 3 章（~21%）、AIP-C01 4.1／2.2（12% + 26% 的一部分）、AI-500 Architect（15–20%）、AI-103 Plan（25–30%）、AB-100 Plan（25–30%）、AIF-C01 第 2 章（24%）＋第 3 章（28%）。

### 二、快取有三層，而考綱把三層分開命名

這是本文最值得單獨背下來的一組名詞。**AI-500 把快取策略逐一列成三個**：

| 層 | 快取的是什麼 | 命中條件 |
|---|---|---|
| **prompt caching** | 請求前綴（系統 prompt、長脈絡） | 前綴逐字相同 |
| **語意快取** | 語意相近的查詢與其回應 | 向量相似度超過門檻 |
| **回應快取** | 完整請求到回應的映射 | 請求鍵相同 |

AIP-C01 的 4.1 列的是同一組再加兩個機制：**語意快取、結果指紋、邊緣快取、確定性請求雜湊、prompt caching**。「確定性請求雜湊」與「結果指紋」是回應快取的實作手段——**AWS 考的是怎麼做，微軟考的是分幾層**，兩份材料合起來讀最完整。

**三層的分界是考點本身**：prompt caching 省的是重複前綴的處理，語意快取省的是整次呼叫，回應快取要求請求完全一致。**把它們當成同一個東西是最常見的錯誤**，而題目正好喜歡在「這個情境該用哪一層」上打轉。

站內的[語意快取](/posts/ai/2026-03-12-semantic-caching)與 [ReAct agent 的快取設計](/posts/ai/2026-04-03-react-agent-cache-design)有實作層的細節與命中率的實際問題，可以補這塊的直覺——考綱只給名詞，不給門檻怎麼調。

**AIF-C01 在這根槓桿上只出現一次，而且位置很說明問題**：prompt caching 被列在第 3 章的 **FM 選擇準則**裡，跟成本、延遲、模型大小並列。**在 foundational 級，快取不是一個要你設計的機制，是一個「這個模型支不支援」的選型欄位。** 語意快取與回應快取在 AIF-C01 的考綱裡沒有出現——那兩層要到 AIP-C01 與 AI-500 才進場。

**要點回指**：AI-500 Develop（30–35%）、AIP-C01 4.1（12%）、AIF-C01 第 3 章（28%，僅 prompt caching 一條）。

### 三、token 預算控制：上限、迴圈、長度、壓縮

**AI-500 把它寫成三個控制點**：**token 上限、迴圈控制、工具呼叫**。這個切法是 agent 專用的——迴圈控制與工具呼叫之所以進來，是因為 agent 的 token 成本主要不是被單次回應吃掉，是被反覆的工具呼叫回合吃掉。

**AIP-C01 4.1 的切法是應用專用的**：token 估算與追蹤、**context window 最佳化**、**回應長度控制**、**prompt 壓縮與 context pruning**。

**兩者合起來才是完整清單**，而且各自漏掉對方的一半：微軟沒提 prompt 壓縮，AWS 沒提迴圈上限。準備任一張時，把另一張的那半當補充讀。

**AI-103 在規劃塊要求「管理配額、擴展、速率限制與成本」**——這是把 token 預算往上拉一層到租戶與服務層級的講法。

站內的 [RAG 的 token 配額系統](/posts/ai/2026-03-12-rag-token-quota-system)與 [RAG 成本最佳化](/posts/ai/2026-03-12-rag-cost-optimization)講的是這塊的實作面，包含配額怎麼分配與超額怎麼處理，考綱不會講到那個深度。

**AIF-C01 考的是這根槓桿的前提**：第 2 章的 2.1.4 是「**token 計價模型**及其對成本與推論效能的影響」——它問的不是你怎麼控制 token，是你知不知道**成本隨 token 走**。同章的模型選擇因素也把成本與延遲並列。**這條是 v1.1（2026-04-30）新增的**，2024 年那版的教材裡沒有。

**兩者的落差就是第一階與第二階的落差**：AIF-C01 要你算得出換模型或壓 prompt 之後成本差多少；AIP-C01 與 AI-500 要你把那個計算變成上限、告警與分帳。

**要點回指**：AI-500 Evaluate/optimize/monitor（20–25%）、AIP-C01 4.1（12%）、AI-103 Plan（25–30%）、AIF-C01 第 2 章（24%）。

### 四、批次與並行：三家都考，但批的東西不同

這根槓桿是三個高度差異最明顯的地方：

- **NCP-GENL Model Deployment（9%）**：**動態批次**（dynamic batching），批的是**推論引擎裡的請求**；GPU Acceleration（14%）另考**批次與記憶體管理**與**梯度累積**，那批的是**訓練樣本**。
- **AIP-C01 4.1／4.2**：**批次推論**與**併發管理**、**平行請求**，批的是**應用送出的呼叫**。
- **AI-500 Develop**：**控制 agent 的生成、批次與並行執行**；Evaluate 塊另有**優化任務時長（平行度與速率限制）**，批的是 **agent 的執行單元**。
- **PMLE 第 4 章**：**批次與線上推論的部署**，考的是**兩種模式怎麼選**，不是怎麼調批次大小。

**「批次」這個詞在四份材料裡指四個不同的東西**，這是這個主題最容易讀混的一點。判斷法很簡單：**看它被放在哪一層的 domain 裡**——放在 GPU／部署塊講的是引擎內的批次，放在應用塊講的是呼叫端的批次，放在編排塊講的是 agent 的並行度。

**要點回指**：NCP-GENL Model Deployment（9%）＋ GPU Acceleration（14%）、AIP-C01 4.1／4.2（12%）、AI-500 Develop（30–35%）＋ Evaluate（20–25%）、PMLE 第 4 章（~20%）。

### 五、量化與 serving 最佳化：這塊只有 NVIDIA 真的在考

**NCP-GENL Model Optimization（17%）是全系列在這塊挖得最深的一份**，官方 PDF 的描述逐條是：剪枝、稀疏化、**權重與激活量化以降低記憶體佔用**；**選擇並實作量化策略**（訓練後量化、量化感知訓練、激活量化），**針對硬體與任務調整並衡量精度取捨**；**知識蒸餾**做出更小的模型；系統化超參數調校與分散式參數搜尋；**進階取樣（beam search、temperature scaling）與消融研究**；選用最佳化方法（**TensorRT、sliding-window／streaming attention、KV cache**）。

**官方明寫「measure accuracy trade-offs」**，代表題目要的是取捨判斷而不是名詞背誦——問的會是「量化到什麼程度、精度掉多少還可接受」，不是「INT8 是什麼」。

其他五張在這塊幾乎是空的。最接近的三條：

- **AIP-C01 4.2** 有「**延遲最佳化的 Bedrock 模型**」——這是選一個 AWS 已經優化好的模型，不是自己優化。
- **AIF-C01 第 3 章**把**模型蒸餾**列進「客製化方式的成本取捨」，跟預訓練、微調、in-context learning、RAG 並列。**注意這是把蒸餾當成一個要比成本的選項，不是一種要你實作的技術**——同一個詞在 NCP-GENL 那裡是「做出更小的模型」的動手項目。
- **[NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide) 的 NVIDIA Platform Implementation（7%）** 有「**用 TensorRT-LLM 與 Triton Inference Server 降低延遲**」與「**部署 NIM microservices 做高效能推論**」——是產品層的整合，不是最佳化技術本身。

**這是本文最重要的一條「不能轉移」**：做過 Bedrock 或 Foundry 的成本最佳化，對 NCP-GENL 這 17% 幾乎沒有幫助，反之亦然。

站內的 [vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)、[TurboQuant 與 KV cache 壓縮](/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression)、[本地推論的硬體選擇](/posts/ai/2026-04-02-ai-hardware-local-inference-guide)是這塊的實務入口——考綱點名的 KV cache、streaming attention、量化精度取捨在那三篇裡都有可動手的版本。

**要點回指**：NCP-GENL Model Optimization（17%）、NCP-AAI NVIDIA Platform Implementation（7%）、AIP-C01 4.2（12% 的一部分）。

### 六、分散式與依吞吐量擴展

**PMLE 第 3 章直接點名兩種分散式訓練策略**：**資料平行與模型平行**。**NCP-GENL 把同一件事拆得細得多**——GPU Acceleration（14%）列的是 **DDP、FSDP，以及 model／pipeline／tensor／data／sequence／expert 六種平行**。

**兩份材料的顆粒度差距就是這兩張證照的難度差距**：PMLE 要你分得清資料平行與模型平行的適用時機，NCP-GENL 要你分得清六種。準備 PMLE 時讀 NCP-GENL 那六種是超綱的，反過來只讀兩種則不夠。

服務端的擴展：

- **PMLE 第 4 章**：**依吞吐量擴展服務後端**；四個部署選項（Agent Platform、Cloud Run、GKE、批次推論）的分界；公開與私有 endpoint。
- **AIP-C01 4.1**：容量規劃、**自動擴展**、**provisioned throughput 最佳化**；2.2 的部署策略是 Lambda 隨選呼叫、Bedrock provisioned throughput、SageMaker endpoint 三者混合。
- **NCP-AAI Deployment and Scaling**：**容器化擴展（Docker、Kubernetes）與負載平衡**、分散式負載下的效能剖析。（這塊的權重官方兩版矛盾——**網頁寫 5%、PDF 寫 13%**，兩份都在 nvidia.com，準備時當不確定區間看。）

**「隨選 vs 預留容量」是這根槓桿的核心判斷**，AWS 用 provisioned throughput 這個詞考它，Google 用「依吞吐量擴展」考它。**穩定高流量選預留、尖峰不可測選隨選**是通用答案，但兩家的題目都會給你成本數字要你算——這也是為什麼**價格是這個主題唯一必須現查的東西**。

**要點回指**：PMLE 第 3 章（~21%）＋第 4 章（~20%）、NCP-GENL GPU Acceleration（14%）、AIP-C01 4.1／2.2、NCP-AAI Deployment and Scaling（5–13%，兩版矛盾）。

### 七、可用性：SLA、降級與跨區

可用性是這六張裡分歧最大的一塊，因為它同時是架構題與採購題：

- **AI-500** 把它寫成一條：**平台可用性與 SLA**——這是唯一把 SLA 這個詞直接寫進考綱的一份。
- **AIP-C01 1.2** 給的是最具體的機制清單：**Step Functions circuit breaker、Bedrock Cross-Region Inference、跨區部署、優雅降級**；2.4 另有**指數退避、API Gateway 速率限制、fallback**。
- **PMLE 第 1 章**逐字寫「針對**成本、延遲、可用性**最佳化 Gemini 應用」，把三者綁成同一條 consideration；第 4 章的 **A/B 測試與 canary 部署**是可用性的另一面。
- **NCP-AAI Deployment and Scaling** 寫**成本最佳化與高可用**，同樣把兩者綁在一起。

**「三者綁在一條」這件事本身是考點**：官方不把成本、延遲、可用性當三個獨立目標，而是當一組要互相交換的約束。**題目的典型形式是給你兩個要求要你犧牲第三個**——例如壓低延遲且維持可用性，代價是什麼。

**要點回指**：AI-500 Evaluate/optimize/monitor（20–25%）、AIP-C01 1.2（31% 的一部分）＋2.4、PMLE 第 1 章（~13%）＋第 4 章（~20%）、NCP-AAI Deployment and Scaling（5–13%）。

### 八、成本監控與 chargeback

**AI-500 是唯一把 chargeback 寫進考綱的**：「成本監控與管理（**用量、配額、分配、chargeback**）」，並在同一塊要求**在 Foundry 實作 tracing（token、prompt、correlation ID、告警、執行追蹤）**。

**AIP-C01 4.3 的講法是可觀測性優先**：CloudWatch 追蹤 token 用量、prompt 有效性、幻覺率、回應品質；**異常偵測（token 暴衝、回應漂移）**；**Bedrock Model Invocation Logs**；**成本異常偵測**。

**AI-103** 在最佳化與維運那段要求建立可觀測性，並明列**token 分析**與**延遲拆解**——「延遲拆解」（latency breakdown）是這六份裡唯一把延遲當成可分解量的措辭。

**三家的差別很好記**：微軟考的是**錢分給誰**（分配與 chargeback），AWS 考的是**錢什麼時候異常**（token 暴衝與成本異常偵測），AI-103 考的是**時間花在哪**（延遲拆解）。**三個問題都要能回答，但只有微軟那份要求你設計分帳。**

**要點回指**：AI-500 Evaluate/optimize/monitor（20–25%）、AIP-C01 4.3（12%）、AI-103 Implement generative AI and agentic solutions（30–35%）。

## 同一件事，四家四個名字

| 概念 | Google（PMLE） | AWS（AIP-C01；括號內為 AIF-C01） | 微軟（AI-103 / AI-500 / AB-100） | NVIDIA（NCP-GENL / NCP-AAI） |
|---|---|---|---|---|
| 動態選模型 | 「依成本、複雜度、延遲、擴展性選模型型態」 | model cascading、智慧模型路由（AIF-C01：FM 選擇準則，含成本、延遲、複雜度） | model router（AB-100） | 未列為考點 |
| 快取 | 未列為獨立考點 | 語意快取、prompt caching、結果指紋、確定性請求雜湊、邊緣快取（AIF-C01：prompt caching，僅作選型準則） | prompt caching／語意快取／回應快取（三層並列） | 未列為考點 |
| token 控制 | 未列為獨立考點 | token 估算與追蹤、context window 最佳化、回應長度控制、prompt 壓縮（AIF-C01：token 計價模型的概念） | token 上限、迴圈控制、工具呼叫；配額與速率限制 | 未列為考點 |
| 批次 | 批次 vs 線上推論的部署選擇 | 批次推論、併發管理 | 控制 agent 的生成、批次與並行執行 | 動態批次（部署）、批次與記憶體管理（GPU） |
| 平行 | 資料平行、模型平行 | 平行請求 | 優化任務時長（平行度與速率限制） | DDP、FSDP，六種平行 |
| 模型壓縮 | 未列為考點 | 「延遲最佳化的模型」（選用，非自製）（AIF-C01：模型蒸餾，僅列為客製化成本選項） | 未列為考點 | 剪枝、稀疏化、量化（PTQ／QAT／激活）、知識蒸餾 |
| serving 最佳化 | 依吞吐量擴展服務後端 | provisioned throughput、自動擴展 | 平台可用性與 SLA | TensorRT、KV cache、streaming attention、Dynamo-Triton、NIM |
| 韌性 | A/B 與 canary 部署 | circuit breaker、Cross-Region Inference、優雅降級、指數退避 | 平台可用性與 SLA | 成本最佳化與高可用 |
| 成本可觀測性 | Model Monitoring（偏模型品質） | CloudWatch token 追蹤、成本異常偵測、Model Invocation Logs | 用量／配額／分配／chargeback、Foundry tracing、延遲拆解 | 監控儀表板與可靠性指標、與前版持續 benchmark |
| 硬體選擇 | 評估 CPU / GPU / TPU | 容器依記憶體／GPU／token 吞吐調校 | 未列為考點 | Tensor Core 與混合精度、CUDA profiling |

**用法**：讀完一家的材料後，用這張表把名詞翻過去，另外幾家的同一格就不必重讀——但**空白格要特別注意**，那不是遺漏，是那張真的不考，讀了是浪費時間。

## 不能互相取代的部分

**NCP-GENL 獨有**：整個模型壓縮技術棧（剪枝、稀疏化、PTQ／QAT／激活量化、知識蒸餾），六種平行策略的分界，**Tensor Core 與混合精度最佳化**，**分散並最佳化 self-attention head 的 GEMM 運算**，**用 CUDA profiling 找瓶頸**與 kernel 效率排錯，TensorRT，sliding-window／streaming attention，**Dynamo-Triton 部署與動態批次**，encoder／decoder／encoder-decoder 的運算取捨。先修條件官方寫**「Python 之外還要 C++」**——這條精準說明了這塊為什麼轉移不過去。

**AIP-C01 獨有**：**結果指紋與確定性請求雜湊**（回應快取的具體實作）、**邊緣快取**、**prompt 壓縮與 context pruning**、**Bedrock provisioned throughput 最佳化**、**Bedrock Cross-Region Inference**、**Step Functions circuit breaker**、**Bedrock Model Invocation Logs**、**成本異常偵測**、**temperature 與 top-k／top-p 的選擇與 A/B 測試**、**token 效率與延遲品質比**（5.1 的評估指標）。這些幾乎全部綁 AWS 服務名。

**AI-500 獨有**：**chargeback**（六份材料裡唯一）、**平台可用性與 SLA** 這個措辭、**token 上限＋迴圈控制＋工具呼叫**的三點式 token 治理、**Foundry tracing 的 correlation ID**、快取三層的並列命名。

**AI-103 獨有**：**延遲拆解**（latency breakdown）這個要求、把**配額、擴展、速率限制與成本**綁成同一條規劃技能。

**PMLE 獨有**：**CPU / GPU / TPU 三者並列評估**（TPU 只有 Google 考）、**資料平行 vs 模型平行**的兩分法、**依吞吐量擴展服務後端**、四個部署選項（Agent Platform、Cloud Run、GKE、批次推論）的分界、**訓練失敗排除**。注意 PMLE 的產品名在 2026 年整批改過（Vertex AI → Gemini Enterprise Agent Platform，Vertex AI Prediction → Agent Platform Inference），**舊教材的服務名對不上題目**。

**AB-100 獨有**：**含總持有成本的 ROI 準則**與**自建／購買／擴充的取捨**——這是唯一從採購而不是工程角度考成本的一份。

**AIF-C01 獨有**：**token 計價模型本身**被列成一條獨立目標（2.1.4）、**四種客製化方式（預訓練、微調、in-context learning、RAG）加模型蒸餾的成本排序**、以及第 3 章那份最長的 FM 選擇準則清單。這些在 professional 級的考綱裡都被當成前提略過了——**唯一一張會直接問你「成本從哪裡來」的證照**。另外提醒：這些是 **v1.1（2026-04-30）** 才加進去的，2024 年那版的教材完全沒有。

## 一個練習專案能蓋掉多少

**能蓋掉交集的七成，蓋不掉 NCP-GENL 那 31%。** 這份清單對應上面八根槓桿：

1. 同一個任務用兩種尺寸的模型各跑一次，量出**品質差與延遲差**，寫下分界條件 →（一）
2. 實作**分層路由**：簡單請求走小模型，複雜請求升級，並記錄升級率 →（一）
3. 三層快取**各做一次**（prompt caching、語意快取、回應快取），各自量命中率，並刻意製造一次語意快取誤命中 →（二）
4. 加上 **token 上限與迴圈上限**，讓一個會失控的 agent 在預算內停下來 →（三）
5. 把同一批請求分別用**逐一送出**與**批次送出**跑一次，比較總時間與總成本 →（四）
6. 對一個開源模型做一次**量化**，量精度掉多少、延遲改善多少 →（五，只有這條能碰到 NCP-GENL 的核心）
7. 做一次**負載測試**，找出吞吐量瓶頸並實際擴一次服務後端 →（六）
8. 加**指數退避、fallback 與優雅降級**，然後把主要供應商斷掉，確認系統仍能回應 →（七）
9. 建一份**成本儀表板**：依租戶或功能拆分 token 用量，並設一個異常暴衝告警 →（八）
10. 把一次請求的**延遲逐段拆開**（檢索、embedding、模型、後處理），找出佔比最大的一段 →（八）

**第 6 條之外的部分，NCP-GENL 都蓋不到。** 那 31% 需要的是 GPU 上的動手經驗與 CUDA profiling，官方建議課裡對應的是 Model Parallelism 那門講師課與 Nsight profiling 那門自學課，價格與時數見 [NCP-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide)。

## 只讀一份的話，讀哪一份

**看你在哪一層工作，這題沒有通解。**

- **做 LLM 應用**：讀 [AIP-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html) 的第 4 章。它是六份裡把應用層成本延遲槓桿列得最全的——快取、token、批次、路由、可觀測性一條不漏，而且是免費公開的 HTML。缺點是每一條都掛著 AWS 服務名，要自己剝掉。
- **做 agent 系統**：讀 [AI-500 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500) 的第三塊。快取三層、token 三點式治理、chargeback、SLA 這四組概念的命名是這六份裡最乾淨的。
- **還沒踩穩第一階**：讀 [AIF-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) 的第 2、3 章。它是六份裡唯一把「成本從哪裡來」當成考點而不是前提的，讀完再回頭看 AIP-C01 第 4 章會省很多力氣。注意要讀 **v1.1**（2026-04-30 起），token 計價那條是新加的。
- **做模型與推論基礎設施**：只有 [NCP-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/) 這條路，而且要讀官方 PDF study guide 而不是網頁（網頁那格描述是壞的）。

## 會過期的東西（下次複查看這裡）

**這一節在這個主題上比其他主題重要得多。** 成本延遲是整個系列裡**知識腐敗最快的一塊**——模型價格、GPU 世代、供應商的預留容量方案幾乎每季都在動。

**所以本文刻意不帶任何價格、token 單價、延遲毫秒數與 GPU 規格。** 上面所有內容都是「考綱點名了哪些槓桿與取捨」，不是「哪個模型多少錢、哪張卡多快」。**任何備考材料只要寫死了這類數字，它的保鮮期就是一季。** 需要數字時去官方定價頁現查，別信任何轉述——包括本文。

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 模型價格與 token 單價 | **本文刻意不列** | 每次要算成本時現查官方定價頁 |
| GPU 世代與規格 | **本文刻意不列** | 同上 |
| NCP-GENL 十塊權重 | 17/14/13/13/9/9/7/7/6/5，合計 100% | 開放報名時（目前 Coming soon） |
| NCP-GENL 網頁描述錯置 | Model Optimization 與 Fine-Tuning 兩格仍錯 | 每季 |
| NCP-AAI Deployment and Scaling 權重 | **網頁 5%、PDF 13%，兩版矛盾** | 開放報名時 |
| AIP-C01 五章權重 | 31 / 26 / 20 / 12 / 11 | 每次 AWS 改版 |
| PMLE 六章權重 | 13 / 16 / 21 / 20 / 18 / 13 | 每次考綱更新 |
| PMLE 產品命名 | 已改為 Gemini Enterprise Agent Platform | Google Cloud Next 之後 |
| AI-500 狀態與權重 | beta；15-20 / 30-35 / 20-25 / 20-25 | GA 之後 |
| AI-103 五塊權重 | 25-30 / 30-35 / 10-15 / 10-15 / 10-15 | 每季 |
| AIF-C01 五章權重與版本 | 20 / 24 / 28 / 14 / 14，exam guide v1.1（2026-04-30） | 每次 AWS 改版 |

## 參考資料

- [Google Professional ML Engineer 官方考試指南（六章權重與 considerations 全文）](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Google Professional ML Engineer 認證頁](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [AWS AIF-C01 官方 exam guide（五章權重與技能點全文）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide 改版紀錄（v1.0 → v1.1，含 token 計價那條）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS AIP-C01 官方 exam guide（五章權重與技能點全文）](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Certified Generative AI Developer – Professional 官方認證頁](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [微軟 AI-103 官方 study guide（五塊權重與技能目標）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
- [微軟 AI-500 官方 study guide（四塊權重與 22 條子目標）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [微軟 AB-100 官方 study guide（含總持有成本 ROI 與 model router）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [NVIDIA NCP-GENL 官方認證頁（十塊權重與建議課程）](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/)
- [NVIDIA NCP-AAI 官方認證頁（十個領域與權重表）](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NVIDIA 認證總覽與 FAQ](https://www.nvidia.com/en-us/learn/certification/)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [NVIDIA NCP-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide)
- [NVIDIA NCP-AAI 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [AWS GenAI Developer Professional（AIP-C01）備考路徑](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [微軟 AI-103 備考路徑](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
- [微軟 AB-100 備考路徑](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [語意快取](/posts/ai/2026-03-12-semantic-caching)
- [ReAct agent 的快取設計](/posts/ai/2026-04-03-react-agent-cache-design)
- [RAG 成本最佳化](/posts/ai/2026-03-12-rag-cost-optimization)
- [RAG 的 token 配額系統](/posts/ai/2026-03-12-rag-token-quota-system)
- [vLLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)
- [TurboQuant 與 KV cache 壓縮](/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression)
- [本地推論的硬體選擇](/posts/ai/2026-04-02-ai-hardware-local-inference-guide)
