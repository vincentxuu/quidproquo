---
title: "NVIDIA NCP-AAI 備考路徑：還不能報名，而且官方兩份文件的權重互相矛盾"
date: 2026-08-18
type: guide
category: ai
tags: [certification, nvidia, agents, multi-agent, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 10
tldr: "NCP-AAI 是 NVIDIA 的 agentic AI 專業級認證，$200、120 分鐘、60–70 題、效期兩年。但兩件事要先知道：一、官方頁面的 Register 按鈕旁標著「Coming soon」，現在還不能報名；二、官方網頁與官方 PDF study guide 的權重表互相矛盾——Deployment and Scaling 網頁寫 13%、PDF 寫 5%，Run/Monitor/Maintain 網頁寫 5%、PDF 寫 7%，而且兩版加總分別只有 98% 與 92%。兩份都是 nvidia.com。文章把它標成範圍與不確定性，不挑一個當事實。"
description: "NVIDIA NCP-AAI（Agentic AI Professional）備考指南，逐項拆解十個主題領域，處理官方網頁與 PDF 權重表互相矛盾的問題，說明尚未開放報名的現況、五門 DLI 課程的取捨，以及兩年效期只能重考的規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試（現階段也無法報考，見下）。所有「考什麼」都指回 [NVIDIA 官方認證頁](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)與官方 Exam Study Guide，不含考古題。查證日期：2026-08-18。

NCP-AAI 是**少數專攻 agentic AI 的專業級認證**，跟微軟的 AI-500 同屬這個稀有類別。但在你花時間準備之前，有兩件事會直接影響可行性。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 一、現在還不能報名

官方認證頁的 Register for Exam 按鈕旁邊，標著 **「(Coming soon)」**。同一頁的姊妹張 NCP-GENL 也是同樣狀態，而兩張 associate 級（NCA-GENL、NCA-GENM）則直接連到 Certiverse 結帳頁。

**NVIDIA 沒有公布開放日期。** 所以這篇的定位是：考綱已經公開，你可以先照它盤點自己的缺口與安排實作，但別把「考過」排進近期計畫。

## 二、官方兩份文件的權重不一致

這是我在查證時撞到、而且**兩邊都逐字核對過**的問題。

**官方網頁的表格**：

| 主題 | 網頁 |
|---|---|
| Agent Architecture and Design | 15% |
| Agent Development | 15% |
| Evaluation and Tuning | 13% |
| **Deployment and Scaling** | **13%** |
| Cognition, Planning, and Memory | 10% |
| Knowledge Integration and Data Handling | 10% |
| NVIDIA Platform Implementation | 7% |
| **Run, Monitor, and Maintain** | **5%** |
| Safety, Ethics, and Compliance | 5% |
| Human-AI Interaction and Oversight | 5% |
| **合計** | **98%** |

**官方 PDF study guide** 對其中兩項寫了不同數字：**Deployment and Scaling 是 5%**、**Run, Monitor, and Maintain 是 7%**，其餘相同 —— 加總是 **92%**。

兩份都是 nvidia.com 的官方文件，**沒有一版加總到 100%**。

**怎麼處理**：不要挑一個當事實。實務上把 Deployment and Scaling 當成 **5% 到 13% 之間的不確定區間**，準備時取中間偏保守（當它是 10% 左右）；其餘八項兩版一致，可以照數字配時間。這種官方內部不一致的情況，也是「別把單一來源當定論」的好例子 —— 同一個廠商的網頁與 PDF 都可能對不上。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | **$200** |
| 時間 | **120 分鐘** |
| 題數 | **60–70 題** |
| 及格 | **不公布** —— 官方 FAQ：「pass/fail. You won't receive a score.」 |
| 效期 | 2 年，**只能靠重考續期** |
| 語言 | 僅英文 |
| 形式 | 線上遠端監考 |
| 報名 | **尚未開放（Coming soon）** |

**先修條件**官方寫得很具體：

> 1–2 years of experience in AI/ML roles and hands-on work with production-level agentic AI projects. Strong knowledge of agent development, architecture, orchestration, multi-agent frameworks, and the integration of tools and models across various platforms. Experience with evaluation, observability, deployment, user interface design, reliability guardrails, and rapid prototyping platforms is also essential…

注意「**production-level agentic AI projects**」—— 這不是讀書能補的門檻。

## 十個主題領域

NVIDIA 把這張切得比其他證照細，十個領域。以下的主題描述取自官方網頁表格。

**Agent Architecture and Design（15%）** —— 官方描述：「agentic AI 系統的基礎結構與設計，聚焦 agent 在其環境中如何互動、推理與溝通」。條目包含 **ReAct 這類推理與行動框架**、**agent 對 agent 的通訊協定**、短期與長期記憶管理、多 agent 工作流編排、**用邏輯樹與 prompt 鏈做多步推理**、**整合知識圖譜做關聯推理**。

**Agent Development（15%）** —— 「agent 的實際建置、整合與強化」。條目包含 prompt 與動態 prompt 鏈、**整合生成式與多模態模型（文字、視覺、音訊）**、建立自訂工具與 API、**錯誤處理（重試邏輯、優雅失敗復原）**、即時串流與回饋的動態對話流程。

**Evaluation and Tuning（13%）** —— 「測量、比較與最佳化 agent 效能」。條目包含評估管線與任務 benchmark、跨任務與資料集比較、**結構化使用者回饋的蒐集與整合**、**準確度與延遲效率的取捨調校**。

**Deployment and Scaling（5–13%，兩版矛盾）** —— 「將 agentic 系統營運化與規模化」。條目包含生產規模的多 agent 部署與編排、**MLOps 的 CI/CD、監控與治理**、分散式負載下的效能剖析、**容器化擴展（Docker、Kubernetes）與負載平衡**、成本最佳化與高可用。

**Cognition, Planning, and Memory（10%）** —— 「智慧 agent 行為背後的核心認知歷程」。條目包含短長期 context 的記憶機制、**推理框架（chain-of-thought、任務分解）**、序列與多步決策的規劃策略、**有狀態編排**、依過往經驗調整推理策略。

**Knowledge Integration and Data Handling（10%）** —— 條目包含 **檢索管線（RAG、嵌入搜尋、混合式）**、**向量資料庫的設定與最佳化**、企業資料的 ETL、資料品質檢查與增強、對結構化與非結構化知識的即時存取與推理。

**NVIDIA Platform Implementation（7%）** —— 這是唯一綁定 NVIDIA 產品的一塊：**整合 NeMo Guardrails** 做合規與安全、**部署 NIM microservices** 做高效能推論、**用 NeMo Agent Toolkit 最佳化工作流**、**用 TensorRT-LLM 與 Triton Inference Server 降低延遲**、在 NVIDIA 硬體上管理多模態輸入管線。

**Run, Monitor, and Maintain（5–7%，兩版矛盾）** —— 監控儀表板與可靠性指標、日誌與異常追蹤、**持續與前版做 benchmark**、自動化調校與重訓練與版控。

**Safety, Ethics, and Compliance（5%）** —— 系統安全與稽核軌跡、合規 guardrail、偏誤與毒性緩解、**分層安全框架（過濾器、升級協定）**、授權與法規遵循。

**Human-AI Interaction and Oversight（5%）** —— 使用者在迴圈中的介面、結構化回饋迴圈、**透明機制（可解釋推理、決策可追溯）**、人類監督與介入。

## 這張與微軟 AI-500 的差別

兩張都是 agentic AI 的專業級，值得放在一起看：

| | NCP-AAI | 微軟 AI-500 |
|---|---|---|
| 費用 | $200 | $165（另需先考 $165 的 AI-103） |
| 現況 | **尚未開放報名** | beta，GA 預計 2026/10 |
| 最重的塊 | 架構 15% + 開發 15% | 開發 30–35% |
| 平台綁定 | **只有 7%** 明確綁 NVIDIA 產品 | 全篇繞著 Microsoft Foundry |
| 先修 | 1–2 年 AI/ML 且做過 production agentic 專案 | **必須持有 AI-103 認證** |
| 官方教材 | 五門 DLI 課程，**全部付費** | 學習路徑尚未上線，講師課 9/30 開課 |

**NCP-AAI 的平台綁定程度低得意外** —— 十個領域裡只有一個（7%）明確考 NVIDIA 產品，其餘九個都是通用的 agentic 工程知識。這讓它比多數廠商證照更接近「廠商中立」，也代表**準備它的過程對你的實際工作比較有轉移價值**。

## 官方建議的五門課

NVIDIA 在頁面上列出建議訓練，每門標價（**全部付費**，這是 NVIDIA 的一貫作法）：

| 課程 | 形式 | 價格 | 時數 |
|---|---|---|---|
| [Building RAG Agents With LLMs](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-15+V1) | 自學 | $90 | 8 小時 |
| [Evaluating RAG and Semantic Search Systems](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-32+V1) | 自學 | **$30** | 3 小時 |
| [Building Agentic AI Applications With LLMs](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-41+V1) | 自學 | $90 | 8 小時 |
| [Adding New Knowledge to LLMs](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+C-FX-26+V1) | 講師課 | **$500** | 8 小時 |
| [Introduction to Deploying RAG Pipelines for Production at Scale](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-19+V1) | 自學 | $90 | 8 小時 |

自學四門合計 **$300**，加上講師課那門是 $800。

**取捨建議**：**Building Agentic AI Applications With LLMs（$90）** 最直接對應 Agent Development 那 15%；**Evaluating RAG and Semantic Search Systems（$30）** 對應 Evaluation and Tuning 13% 且最便宜。這兩門 $120 是投報率最高的組合。**Adding New Knowledge to LLMs 的 $500 講師課**在考綱裡對應的內容不多，除非公司出錢否則可略過。

## 現階段怎麼準備

因為還不能報名，正確的做法不是排讀書計畫，而是**照考綱盤點缺口**：

1. **十個領域當檢核表**，每項問自己「我在生產環境做過嗎」—— 官方先修條件要求的就是這個
2. **補平台那 7%**：NeMo Guardrails、NIM microservices、NeMo Agent Toolkit、TensorRT-LLM、Triton，這五個是唯一無法從通用 agent 經驗轉移過來的
3. **等開放報名再買課**：DLI 課程沒有效期壓力，但考綱可能隨開放而調整，太早買可能學到被改掉的內容

站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)與 [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)可以直接對應到 Safety 那 5% 與 Evaluation 那 13%。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 報名狀態 | **Coming soon，尚未開放** | 每月 |
| 權重矛盾 | 網頁 98%、PDF 92%，兩項數字不同 | 開放報名時 |
| 費用與題數 | $200、60–70 題、120 分鐘 | 開放報名時 |
| DLI 課程與價格 | 五門，$30–$500 | 每季 |
| 語言 | 僅英文 | 每半年 |

## 參考資料

- [NCP-AAI 官方認證頁（規格、blueprint、建議課程）](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NVIDIA 認證總覽與 FAQ（計分、重考、續期）](https://www.nvidia.com/en-us/learn/certification/)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [NVIDIA NCA-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide)
- [微軟 AI-500 備考路徑（另一張 agentic 專業級）](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
