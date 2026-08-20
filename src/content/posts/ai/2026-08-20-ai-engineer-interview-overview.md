---
title: "AI Engineer 面試全景圖：從公司類型到準備策略"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, career, machine-learning, system-design]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試的完整地圖——面試流程、公司類型差異、考核維度，以及一條可執行的準備路線。"
tldr: "AI Engineer 面試不只考 ML——大廠看系統設計與 coding，新創看端到端交付，AI-native 公司看 LLM 工程深度。準備策略：先釐清目標公司類型，再按六大維度（ML 基礎、系統設計、LLM 應用、Coding、Paper Reading、行為面試）分配時間。"
series:
  name: "AI Engineer 面試準備"
  order: 1
---

## AI Engineer 這個角色，現在到底在找什麼人

2025 到 2026 年，AI Engineer 的定義快速分裂。兩年前這個頭銜幾乎等於 ML Engineer；現在打開職缺，同一個 title 底下可能是在做 fine-tuning pipeline、也可能是在用 LLM API 組裝 agent 系統、或是在寫 evaluation framework。

這代表面試也分裂了。你不可能用同一套準備策略應付所有公司——先搞清楚目標公司在找哪一種 AI Engineer，才能把時間花在對的地方。

## 面試流程的共通結構

不管公司類型，大多數 AI Engineer 面試都走類似的流水線：

1. **Recruiter Screen**（15-30 分鐘）：確認背景、薪資預期、簽證狀態。這一關不刷技術，但會刷掉敘事不清楚的人——如果你無法用三句話說清楚「我做過什麼、為什麼想來」，就會卡在這裡。

2. **Technical Phone Screen**（45-60 分鐘）：通常是一題 coding 加幾個 ML 概念問題，或反過來——一段技術深度對話加一題簡單的程式題。目的是確認你不是紙上談兵。

3. **Onsite / Virtual Onsite**（3-5 輪，每輪 45-60 分鐘）：
   - **Coding**：LeetCode medium 等級，部分公司會出 ML-flavored 的題（例如實作一個 tokenizer、寫一個 batch inference pipeline）
   - **ML Deep Dive**：針對你做過的專案深挖——模型選擇的理由、失敗過的實驗、如何評估效果
   - **System Design**：設計一個推薦系統、設計一個 RAG pipeline、設計一個 real-time fraud detection 系統
   - **Behavioral**：Leadership principles、conflict resolution、如何推動跨團隊專案

4. **Team Match / Hiring Committee**（部分公司）：Google 系的公司會有 HC review；有些新創則是 CEO 最後面一輪。

關鍵觀察：**輪數和重點會因公司類型劇烈不同**，但上面這個骨架在大多數地方都成立。

## 四種公司類型，四套面試邏輯

### 大廠（Google、Meta、Amazon、Microsoft）

面試結構最標準化，也最重 coding。通常 5 輪 onsite 裡有 2 輪是純 coding（LeetCode style），1 輪 system design，1 輪 ML deep dive，1 輪 behavioral。

大廠的 AI Engineer 面試和 SWE 面試高度重疊——差別在 system design 那一輪會出 ML-specific 的題目（設計一個 content moderation pipeline，而不是設計一個 URL shortener）。如果你的 coding 基礎不夠，大廠面試會很痛苦，因為那兩輪 coding 是硬門檻。

### AI-Native 公司（Anthropic、OpenAI、Cohere、Mistral）

這些公司的面試重 depth over breadth。Coding 通常只有一輪，但 ML 和系統設計的深度會拉到很高。他們會問你對 attention mechanism 的直覺理解、RLHF 的 failure mode、inference optimization 的具體做法。

另一個特點是 **paper discussion**——他們可能會丟一篇最近的論文給你，要你當場讀完討論。這不是考你有沒有讀過那篇 paper，而是考你能不能快速理解一個新方法並找出它的限制。

AI-native 公司也特別看重你對 safety 和 alignment 的想法，即使你面試的不是 safety 崗位。

### 新創（種子到 B 輪，用 AI 解決特定領域問題）

新創面試最看 end-to-end delivery。他們的 ML team 通常很小（2-5 人），需要的是能從問題定義做到 production deployment 的人。面試形式更靈活——可能是一個 take-home project（用他們的真實資料做一個 prototype），可能是 pair programming session。

新創比較不在乎你能不能解 hard LeetCode，但非常在乎你能不能用最少的資源把一個 ML feature 推上線。Domain knowledge 也重要——如果你面試一家 healthtech 新創，有沒有處理過醫療資料的經驗會是加分項。

### 傳統企業 AI 部門（銀行、電信、製造業的 AI team）

這些面試通常最輕量，但最看 communication。技術面試可能只有 1-2 輪，重點不在演算法深度，而在你能不能把 ML 的價值翻譯成業務語言。他們常問的問題是：「如果業務部門說模型的 accuracy 不夠高，你會怎麼處理？」

傳統企業的 AI Engineer 花大量時間在 data pipeline 和 stakeholder management 上，面試自然也反映這一點。

## 六大考核維度

不管哪種公司，AI Engineer 面試考的東西都可以歸進這六個維度。差別在各公司的權重分配。

| 維度 | 大廠 | AI-Native | 新創 | 傳統企業 |
|------|------|-----------|------|----------|
| ML 基礎 | 中 | 高 | 中 | 低 |
| 系統設計 | 高 | 高 | 中 | 低 |
| LLM 應用 | 中 | 高 | 高 | 中 |
| Coding | 高 | 中 | 中 | 低 |
| Paper Reading | 低 | 高 | 低 | 無 |
| 行為面試 | 高 | 中 | 中 | 高 |

本系列共十篇，每篇聚焦一個面試維度：

1. **全景圖**（本篇）——面試流程、公司類型、準備策略
2. **ML Fundamentals**——bias-variance、regularization、optimization、evaluation metrics
3. **Deep Learning**——CNN、RNN、Transformer、attention、training tricks
4. **NLP & LLM**——tokenization、fine-tuning、RLHF、prompting、LLM evaluation
5. **ML System Design**——feature store、training pipeline、serving、monitoring
6. **LLM Application Design**——RAG、agent 架構、context engineering、guardrails
7. **Coding**——ML-flavored coding 題型與解題策略
8. **Paper Reading**——怎麼讀、怎麼討論、必讀論文清單
9. **MLOps & Deployment**——CI/CD、A/B testing、model registry、scaling
10. **Behavioral & Ethics**——AI 倫理、團隊合作、影響力敘事

## 準備策略：先選靶再練槍

面試準備最大的陷阱是「什麼都練一點」。更有效的做法是：

**第一步：鎖定 2-3 種目標公司類型。** 如果你同時投大廠和 AI-native 公司，至少 coding 和 ML depth 兩頭都要顧。但如果你只投新創，就不需要花三個月刷 LeetCode hard。

**第二步：按權重分配準備時間。** 回頭看上面的權重表，把你每週的準備時間按比例分配。一個粗略的分法——如果你目標是 AI-native 公司，時間分配大概是：
- ML 基礎 + Deep Learning + NLP/LLM：40%
- 系統設計（ML + LLM）：25%
- Coding：15%
- Paper Reading：15%
- Behavioral：5%（不是不重要，而是 behavioral 靠的是日常的反思累積，不是短期衝刺）

**第三步：建立 feedback loop。** 每週至少做一次模擬面試——可以找朋友互相練、用 Pramp 或 interviewing.io 這類平台、或是錄音自己回放。光看書和做題不會讓你在面試時表達流暢，只有開口講才會。

**第四步：追蹤弱點。** 每次練習後記錄：哪個問題卡住了、卡在哪裡（概念不清楚？表達不順？時間管理？）。下一週優先補這些洞。

## 接下來

下一篇進入第一個技術維度——ML Fundamentals。不是從零教機器學習，而是整理「面試會怎麼問、怎麼答才算好」的實戰框架。

## 參考資料

- [Chip Huyen — ML Interviews Book](https://huyenchip.com/ml-interviews-book/) — AI Engineer 面試準備指南，涵蓋 ML 基礎、深度學習、系統設計等六大考核維度
- [Designing Machine Learning Systems](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) — Chip Huyen 的 ML 系統設計書，對應 AI Engineer 面試中的系統設計環節
- [Stanford CS 329S: Machine Learning Systems Design](https://stanford-cs329s.github.io/) — AI 系統設計課程，涵蓋面試流程中 system design round 的核心概念
