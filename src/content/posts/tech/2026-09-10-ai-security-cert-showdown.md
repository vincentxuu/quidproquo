---
title: "AI 安全證照橫評——SecAI+ vs CAISP vs GAIPS vs AAISM"
date: 2026-09-10
category: tech
type: deep-dive
tags: [cybersecurity, certification, ai-security, owasp, llm, prompt-injection]
lang: zh-TW
tldr: "四張 AI 安全證照各有定位：SecAI+（$359）是 CompTIA 品牌的中階擴充、CAISP（$999 全包）實作最強且 OWASP LLM Top 10 覆蓋最完整、GAIPS（$999/$9K）是 SANS 金字招牌的防禦側 CyberLive 考試、AAISM（$459+）偏治理但需先持有 CISM 或 CISSP。預算 $400 以下選 SecAI+，想動手做選 CAISP，公司出錢選 GAIPS。想走攻擊側（AI 紅隊），2026 年新上線的 OSAI+、HTB COAE、COASP 另成一組，見文末補充。"
description: "深入比較 2025–2026 年四張新興 AI 安全證照的考域、考試格式、OWASP LLM Top 10 覆蓋度與真實考生口碑，幫 AI 平台開發者選出最適合的一張。"
draft: false
series:
  name: "資安證照攻略"
  order: 2
---

> 🌏 [English version](/en/posts/tech/2026-09-10-ai-security-cert-showdown-en)

2025 年 8 月 ISACA 推出 AAISM，2026 年 2 月 CompTIA 上線 SecAI+，4 月 GIAC 開賣 GASAE，7 月再加 GAIPS——18 個月內四大認證機構各自押寶 AI 安全。依 [Practical DevSecOps 的市場分析](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)，2025/10 至 2026/3 之間，要求 AI 技能的資安職缺比例從 14.2% 翻倍到 28.5%。需求在那裡，但哪張證照真的教你東西？

這篇拿 OWASP LLM Top 10 v2.0 當標尺，拆解四張 AI 安全證照的考域、考試格式和真實口碑，幫你選出最適合的一張。

這四張都偏防禦與治理。2026 年上半年另外冒出一批攻擊側（AI 紅隊）證照——EC-Council COASP、OffSec OSAI+、HTB COAE、GIAC GOAA——放在[後面獨立一節](#2026-年新上線攻擊側的四張)整理。

## 評比基準：OWASP LLM Top 10 v2.0（2025）

在評比之前，先對齊標尺。[OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/) 是目前業界最廣泛採用的 LLM 安全風險框架：

| # | 風險 | 一句話說明 |
|---|---|---|
| LLM01 | **Prompt Injection** | 攻擊者透過精心構造的輸入覆蓋系統指令——連續兩版排名第一 |
| LLM02 | Sensitive Information Disclosure | 模型洩漏訓練資料中的個資、商業機密或 API 金鑰 |
| LLM03 | Supply Chain | 第三方模型、資料集、plugin 帶入的隱藏風險 |
| LLM04 | Data and Model Poisoning | 訓練資料 / fine-tuning / RAG 語料被汙染 |
| LLM05 | Improper Output Handling | 把模型輸出直接丟給 DB / API / 瀏覽器而不做驗證 |
| LLM06 | **Excessive Agency** | agent 擁有超出必要的權限——**做 AI Agent 平台的人最該擔心這條** |
| LLM07 | System Prompt Leakage | 系統提示詞被攻擊者誘導洩漏 |
| LLM08 | **Vector and Embedding Weaknesses** | RAG pipeline 和向量資料庫的漏洞 |
| LLM09 | Misinformation | 模型產出虛假但看起來可信的內容 |
| LLM10 | Unbounded Consumption | 不受限的 token 消耗導致成本爆炸或 DoS |

另外注意 [OWASP Top 10 for Agentic Applications（2026）](https://owasp.org/www-project-top-10-for-large-language-model-applications/) 是**獨立框架**，專門針對有 memory、tools、multi-step autonomy 的 agent 系統，與 LLM Top 10 互補。

## CompTIA SecAI+

### 定位

CompTIA 在 2026/2/17 推出的第一張 AI 安全專屬證照，屬於「Expansion Series」——設計為疊在 Security+、CySA+ 或 PenTest+ 之上的中階擴充，不是入門也不是取代。

### 考試格式

| 項目 | 內容 |
|---|---|
| 考試代碼 | CY0-001 |
| 題數 / 時間 | 最多 60 題（選擇 + 情境實作 PBQ）/ 60 分鐘 |
| 及格線 | 600/900 |
| 費用 | **$359**（考券 only，教材另購） |
| 效期 | 3 年，需 CEU 續期 |
| 建議經驗 | 3–4 年 IT + 2 年資安 |

**來源**：[ACI Learning SecAI+ 指南](https://www.acilearning.com/blog/comp-tia-sec-ai-a-complete-guide-to-the-ai-security-certification)、[Udemy Blog SecAI+ 指南](https://blog.udemy.com/comptia-secai-certification-guide)

### 四大考域

| 考域 | 比重 | 涵蓋內容 |
|---|---|---|
| Basic AI Concepts | 17% | ML、NLP、深度學習、AI 驅動的威脅（如多型態惡意程式） |
| **Securing AI Systems** | **40%** | 保護模型、資料管線、部署環境（on-prem / cloud / hybrid） |
| AI-Assisted Security | 24% | 用 AI 加速威脅偵測、自動化告警分析、改善事件回應 |
| AI Governance, Risk & Compliance | 19% | GDPR、NIST AI RMF、全球 AI 法規框架 |

40% 的權重放在「Securing AI Systems」是好事——代表不只是理論，至少要知道怎麼保護 AI 管線。但 60 分鐘 60 題的格式意味著深度有限，PBQ 題目只能做到「設定一個安全控制」的層級，不會讓你真正攻防。

### OWASP 覆蓋

Prompt Injection、Data Poisoning、Supply Chain、Improper Output Handling 都有概念級覆蓋。Excessive Agency 和 Vector & Embedding Weaknesses 偏淺——考試問你「這是什麼風險」，不會問你「怎麼在 RAG pipeline 裡實作防禦」。

### 適合誰

已有 Security+ 或同等經驗，想快速在履歷上加一行「AI 安全」，預算有限（$359 考券 + $30–$100 教材）。CompTIA 品牌在 HR 端的辨識度是真實優勢。

## Practical DevSecOps CAISP

### 定位

由 Practical DevSecOps 推出的實作導向 AI 安全證照，從 2024 Q4 開始販售。不是選擇題考試——6 小時實戰 + 24 小時報告，你得真的攻破和修復 LLM pipeline。

### 考試格式

| 項目 | 內容 |
|---|---|
| 費用 | **$999–$1,099 全包**（含課程影片、PDF、60 天 lab、24/7 Mattermost 支援、1 次考試） |
| 考試格式 | 6h 實作（5 題，滿分 100，80 分及格）+ 24h 報告撰寫 |
| 效期 | 終身有效 |
| 先決條件 | 無 |

**價格結構很重要**：SecAI+ 的 $359 只買到考券，教材和培訓另算；CAISP 的 $999–$1,099 已含所有教材、60 天 lab 和一次考試。依 [Practical DevSecOps 的比較](https://www.practical-devsecops.com/caisp-vs-comptia-secai-plus)，SecAI+ 加上 Infosec Institute 的 boot camp 總成本超過 $2,500。

### 課程內容與 Lab

依四位獨立考生的 review：

- [tunelko.com](https://blogs.tunelko.com/2026/07/16/certified-ai-security-professional-caisp-practical-devsecops/)（**9/10**）：「Labs 是 CAISP 真正發光的地方。模型、NVIDIA 驅動、CUDA 全部開箱即用，零環境除錯時間。」不過也指出偶爾會偏回傳統 SAST/DAST 領域，對 DevSecOps 老手來說可跳過。
- [LinkedIn Mel Drews](https://www.linkedin.com/posts/meldrews_certified-ai-security-professional-credential-activity-7491467633704435712-Hyft)（SANS 講師、22 年資安經驗）：「SANS 是金標準，但如果你要用 1/8 的價格走很長一段路，看看 Practical DevSecOps。」花了 59 天 lab + 1 週整理筆記。
- [Medium Divith Shetty](https://divshettyy.medium.com/my-review-of-the-caisp-certified-ai-security-professional-certification-by-practical-devsecops-fb658fabf5da)：「如果你已經有進階攻擊型 LLM 安全經驗，內容可能偏基礎。對初學者和早期職涯則是很好的起點。」
- [LinkedIn Richie Prieto](https://www.linkedin.com/posts/richieprieto_aisecurity-cybersecurity-practicaldevsecops-activity-7457536949931696128-YW9n)（AI 安全顧問）：「OWASP LLM Top 10 覆蓋紮實，但在 Agentic AI 和 MCP/A2A 等新協議上有缺口。2026 年已開始顯老。」

**共識**：Lab 品質頂級（10/10），實作深度 intro-to-intermediate，對資深紅隊可能偏淺，但對想入門 AI 安全的 DevSecOps / AppSec / 開發者剛好。

### OWASP 覆蓋

課綱明確引用 OWASP LLM Top 10。Prompt Injection 有逐步攻防 lab、Data Poisoning 有 TextAttack 實作、RAG pipeline 安全有專門 lab、Supply Chain 有實作練習。覆蓋度在四張證照中最完整。

### 適合誰

想要真正動手做的人——你不只是想知道 prompt injection 是什麼，你想在 lab 裡把一個 LLM 打穿再修好。預算 $1,000 左右能接受，且不介意品牌認知度低於 CompTIA/SANS。

## GIAC GAIPS

### 定位

SANS/GIAC 在 2026/7/28 開放一般購買的防禦側 AI 安全證照，對應 SANS SEC545「GenAI and LLM Application Security」五天課程。依 [CertCrush 分析](https://www.certcrush.app/blog/giac-gaips-ai-platform-security-explained-worth-it-2026)，GIAC 計畫在 2026 年底前推出共 4 張 AI 安全證照（GAIPS 防禦、GASAE 自動化、GOAA 攻擊、第四張待公布）。其中 GOAA 已經上線，細節見後面攻擊側一節。

### 考試格式

| 項目 | 內容 |
|---|---|
| 費用 | **~$999 單考** / **~$9,000 含 SEC545 五天課程** |
| 考試格式 | CyberLive（在真實 VM 環境中操作真實工具，不是純選擇題） |
| 效期 | 4 年（36 CPE + ~$479 續期費） |
| 先決條件 | 無硬性要求，建議有 AppSec / Cloud / MLOps 實務經驗 |

**來源**：[GIAC 官方](https://www.giac.org/certifications/ai-security-platform-security-gaips)、[CertMap GAIPS](https://certmap.de/en/cert/gaips)

### 考域

依 [CertCrush](https://www.certcrush.app/blog/giac-gaips-ai-platform-security-explained-worth-it-2026) 與 [CertMap](https://certmap.de/en/cert/gaips)，GAIPS 涵蓋八個域：AI 應用架構、基礎設施與部署安全、MLOps pipeline、RAG（檢索增強生成）、**agentic systems**、模型完整性、資料保護、AI 治理。

關鍵差異：GAIPS 明確涵蓋 **agentic systems 安全**——這是其他三張證照都沒有專門拉出來的領域。對做 AI Agent 平台的人來說，這是直接命中。

### OWASP 覆蓋

高度對齊。Prompt Injection、Supply Chain、Data Poisoning、Excessive Agency（透過 agentic systems 域）、Vector & Embedding Weaknesses（透過 RAG 域）都有覆蓋。CyberLive 格式意味著是在真實環境中驗證，不是背定義。

### 適合誰

預算充足（公司出錢最理想）、想要 SANS/GIAC 金字招牌、且需要在面試或客戶面前展示「頂級認證」的人。單考 $999 的門檻其實跟 CAISP 差不多，但少了 60 天 lab 的準備過程——你得自己找資源。

## ISACA AAISM

### 定位

ISACA 在 2025/8 推出的 AI 安全**管理**認證——注意是「管理」不是「工程」。這不是讓你動手防禦的證照，是讓你建立治理框架、制定政策、評估風險的證照。

### 硬門檻

**必須持有 CISM 或 CISSP** 才能考。這不是入門證照，是建立在資深管理者基礎上的專業化。

### 考試格式

| 項目 | 內容 |
|---|---|
| 費用 | **$459（ISACA 會員）/ $599（非會員）**，另有 $50 申請費 |
| 考試格式 | 90 題情境式選擇題 / 150 分鐘 |
| 及格線 | 450/800 |
| 效期 | 3 年（20 CPE/年） |

**來源**：[CertCrush AAISM 分析](https://www.certcrush.app/blog/isaca-aaism-explained-domains-cost-worth-it-2026)、[ISACA 芝加哥分會課程](https://engage.isaca.org/chicagochapter/events/eventdescription?CalendarEventKey=f2013755-f3bf-493c-b4c0-019b7fb46820)

### 三大考域

| 考域 | 比重 | 涵蓋內容 |
|---|---|---|
| AI Governance and Program Management | 31% | AI 政策制定、利害關係人溝通、資料治理、事件回應 |
| AI Risk Management | 31% | AI 特有的威脅評估、漏洞管理、供應鏈風險 |
| **AI Technologies and Controls** | **38%** | AI 架構、安全控制、adversarial testing、生產監控 |

依 [aaismexam.com 分析](https://aaismexam.com/blog/aaism-exam-format-question-types-and-time-limits)，Domain 3 比重最高（約 34/90 題），對純治理背景的人來說是最容易失分的區域——你需要真的理解 AI 系統怎麼建造、哪裡會壞。

### OWASP 覆蓋

概念級。Supply Chain 和 Excessive Agency 在治理框架層面有覆蓋（「你應該要求最小權限」），但不會教你怎麼在程式碼裡實作。Prompt Injection 和 Data Poisoning 停留在「知道這個風險存在」的層級。

### 適合誰

已經是 CISM/CISSP 持證者，工作內容從傳統資安管理延伸到 AI 治理——需要向董事會解釋「我們的 AI 安全計畫」的 CISO 或資安主管。如果你是開發者，這不是你要的。

## 橫向比較

| | SecAI+ | CAISP | GAIPS | AAISM |
|---|---|---|---|---|
| **費用** | $359（考券 only） | $999–$1,099（全包） | ~$999 考 / ~$9K 含課 | $459–$599 |
| **考試格式** | 60 題 / 60 分鐘 | 6h 實戰 + 24h 報告 | CyberLive 實作 | 90 題 / 150 分鐘 |
| **動手程度** | PBQ（有限） | **最高**（真實 lab） | **高**（VM 環境） | 無（純選擇題） |
| **品牌認可** | CompTIA（HR 端強） | Practical DevSecOps（利基） | SANS/GIAC（業界最高） | ISACA（治理圈強） |
| **門檻** | 建議 2 年資安 | 無 | 無（建議有 AppSec 經驗） | **需 CISM 或 CISSP** |
| **效期** | 3 年 | 終身 | 4 年 | 3 年 |
| **Agentic 系統** | 概念級 | 部分 | **明確涵蓋** | 概念級 |
| **OWASP 覆蓋** | 概念 + PBQ | **最完整**（lab 級） | 高（CyberLive 級） | 概念級 |

### OWASP LLM Top 10 逐項覆蓋

| OWASP 風險 | SecAI+ | CAISP | GAIPS | AAISM |
|---|---|---|---|---|
| LLM01 Prompt Injection | 概念 + PBQ | **深度 lab** | **CyberLive** | 概念 |
| LLM02 Sensitive Info Disclosure | ✅ | ✅ | ✅ | 概念 |
| LLM03 Supply Chain | ✅ | **實作** | **實作** | ✅ 治理 |
| LLM04 Data & Model Poisoning | ✅ 概念 | **TextAttack lab** | ✅ | 概念 |
| LLM05 Improper Output Handling | ✅ | ✅ | ✅ | — |
| LLM06 Excessive Agency | 概念 | ✅ | **✅ agentic** | ✅ 治理 |
| LLM07 System Prompt Leakage | ✅ | ✅ | 部分 | — |
| LLM08 Vector & Embedding | 部分 | **RAG lab** | **RAG lab** | — |
| LLM09 Misinformation | 概念 | 部分 | 部分 | 概念 |
| LLM10 Unbounded Consumption | 部分 | 部分 | 部分 | — |

## 選購建議

### 依預算

| 預算 | 首選 | 原因 |
|---|---|---|
| < $400 | **SecAI+** | $359 考券，CompTIA 品牌辨識度高 |
| $1,000 左右 | **CAISP** | 全包含 lab，實作最強 |
| 公司出錢 | **GAIPS**（含 SEC545 課程） | SANS 金字招牌 + CyberLive 實作 |
| 已有 CISSP/CISM | 加考 **AAISM** | 治理層面的 AI 安全專門化 |

### 依經驗

| 你的背景 | 推薦 | 原因 |
|---|---|---|
| 軟體開發者，剛開始關注 AI 安全 | CAISP 或 SecAI+ | CAISP lab 教你動手；SecAI+ 更快考完 |
| DevSecOps / AppSec 有經驗 | CAISP | 擴展到 AI 領域，lab 格式跟你的工作模式一致 |
| 資安管理者 / CISO | AAISM | 你需要的是治理框架，不是寫程式 |
| 做 AI Agent 平台 | **GAIPS** 或 CAISP | GAIPS 明確涵蓋 agentic systems；CAISP 的 RAG lab 也直接相關 |
| 滲透測試 / 紅隊 | OSAI+、HTB COAE 或 COASP | 攻擊側證照，見後面獨立一節 |

### 依目標

| 你要的是… | 選這張 |
|---|---|
| 履歷快速加分 | SecAI+（60 分鐘考完，$359） |
| 真的會動手防禦 | CAISP（6h 實戰，有 lab 記憶） |
| 頂級品牌背書 | GAIPS（SANS/GIAC） |
| AI 治理框架 | AAISM（ISACA） |
| 做 AI 紅隊 | OSAI+、HTB COAE、COASP（攻擊側） |

## 2026 年新上線：攻擊側的四張

前面四張主角談的是「怎麼守」和「怎麼管」。2026 年 2 月到 4 月之間，EC-Council、OffSec、Hack The Box 接連推出以 AI 紅隊為主題的證照，加上 GIAC 的 GOAA，攻擊側一口氣多了四個選項。

| | EC-Council COASP | OffSec OSAI+ | HTB COAE | GIAC GOAA |
|---|---|---|---|---|
| **全名** | Certified Offensive AI Security Professional | OffSec AI Red Teamer（課程 AI-300） | Certified Offensive AI Expert | Offensive AI Analyst（課程 SEC535） |
| **上線** | 2026/2（隨 Enterprise AI Credential Suite 發表） | 2026/3/31 | 2026/4 | 已上線 |
| **考試格式** | 70 題（選擇題 + 實作題）/ 6 小時，線上監考 | 24 小時監考實作，攻破一個含 AI 的企業環境 | 7 天實作評估 + 商業等級報告 | 56 題 / 2 小時，CyberLive |
| **及格線** | 70–80% | 官方頁未列 | 官方頁未列 | 67% |
| **費用** | 官方 on-demand 課程 $1,699 起 | $1,749（90 天課程 + 1 次考試）或 $2,749/年（2 次考試） | 需先修完 AI Red Teamer 路徑，官方建議買 Silver Annual 訂閱（含考券，可考 2 次） | 見 GIAC 官方 |
| **效期** | 見 EC-Council 官方 | OSAI 不過期；OSAI+ 3 年 | 見 HTB 官方 | 見 GIAC 官方 |
| **打的對象** | AI 系統本身 | AI 系統本身 | AI 系統本身 | **用 AI 打傳統目標** |

### EC-Council COASP

EC-Council 在 2026/2/10 發表的四張 AI 證照之一（另外三張是 AIE 入門素養、CAIPM 專案管理、CRAGE 治理與倫理），考試代碼 312-52。課程十個模組：攻擊方法論、AI 偵察與攻擊面盤點、漏洞掃描與 fuzzing、prompt injection 與 LLM 應用攻擊、對抗性機器學習與模型隱私攻擊、資料與訓練管線攻擊、agentic AI 與模型對模型攻擊、AI 基礎設施與供應鏈攻擊、測試評估與強化、AI 事故應變與鑑識。官方說明課綱對齊 OWASP LLM Top 10、NIST AI RMF 與 ISO 42001。

對台灣讀者最實際的一點：[恆逸教育訓練中心有開實體班](https://www.uuu.com.tw/Course/Show/3332/COASP)，40 小時、NT$68,000，附 180 天原廠 lab 和一次考試（恆逸標示考試原價 USD 650）。四張攻擊側證照裡，在台灣有實體班的是 COASP 和 OSAI+，COASP 的價格不到一半。

### OffSec OSAI+

OSCP 那家出的 AI 紅隊證照。AI-300 課程約 65 小時內容、11 個模組，涵蓋攻擊 LLM、RAG pipeline、embedding、多代理系統和 AI 基礎設施。考試是 OffSec 一貫的風格：24 小時監考，沒有選擇題。通過後同時拿到不過期的 OSAI 和 3 年效期的 OSAI+。官方定位為進階課程，要求扎實的資安基礎和對 LLM 的基本認識。恆逸也開了 [OSAI+ 實體班](https://www.uuu.com.tw/Course/Show/3408/OSAI)，40 小時、NT$149,000。

### HTB COAE

Hack The Box 的 AI Red Teamer 路徑是和 Google 合作開發的，對齊 Google SAIF 框架，COAE 是這條路徑的結業認證。必須先修完全部 12 個模組才能考，沒有捷徑。內容比其他三張更偏機器學習本身：除了 prompt injection 和 LLM 輸出攻擊，還有規避攻擊、梯度式對抗樣本、隱私攻擊與差分隱私，以及 MCP 的安全問題。考試為期 7 天，只打下目標不算通過，還要交一份可以直接給客戶的報告。

### GIAC GOAA

名字有「Offensive AI」，但方向和另外三張相反：它教的是**把 AI 當攻擊工具**，例如 deepfake 語音與影像釣魚、AI 輔助的漏洞挖掘與 exploit 產生、用 AI 寫惡意程式、繞過防禦機制。對象是做傳統紅隊與社交工程、想把 AI 納入工具箱的人。如果你的目標是測試自家的 LLM 應用，這張不對題。

### 攻擊側怎麼選

| 你的情況 | 選這張 |
|---|---|
| 想在台灣上實體課、公司付費 | COASP（NT$68,000）或 OSAI+（NT$149,000），都在恆逸 |
| 已有 OSCP 等級的滲透測試底子 | OSAI+ |
| 想把對抗性機器學習的數學一起補起來 | HTB COAE |
| 做紅隊與社交工程，想用 AI 加速 | GOAA |

對做 AI Agent 平台的開發者，攻擊側證照不是第一張該考的。先用 CAISP 或 GAIPS 建立防禦能力，之後想理解攻擊者怎麼想，再挑一張。

## 其他新增與還在開發的

- **Microsoft SC-500**：Cloud and AI Security Engineer Associate。取代已在 2026/8/31 退役的 AZ-500，考試費 $165、120 分鐘。它是雲端資安證照加上 AI 工作負載，不是純 AI 安全證照——AI 相關的考點是 Defender for Cloud 的 AI 防護、Foundry 的 agent guardrails、Purview DSPM 這類 Azure 上的設定。
- **ISACA AAIR（Advanced in AI Risk）**：2026/4/15 上線，會員 $459、非會員 $599，需先持有 CRISC、CISA、CISM、CISSP 等 25 張指定證照之一。加上 2025 年的 AAIA（稽核）和 AAISM（資安管理），ISACA 的 AI 三件組到齊，分別對應風險、稽核、資安管理三種角色。
- **CSA TAISE（Trusted AI Safety Expert）**：Cloud Security Alliance 與 Northeastern University 合作，$795 含課程與 2 次考試，60 題選擇題、80% 及格，無先決條件。偏 AI 安全治理的基礎認知。
- **GIAC GASAE**：2026/4 已開賣，82 題 / 3 小時、70% 及格，偏紅藍紫隊的 AI 自動化，與 GAIPS 互補。
- **ISC2 的 AI 安全證照**：還沒有正式名稱。ISC2 在 2026/7/15 宣布開始開發並徵求志工，8 月在三地開完第一輪 Job Task Analysis 工作坊，預計 2026 年底辦 pilot exam，正式上線不會早於 2027 年。現階段 ISC2 的做法是把 AI 安全概念併入既有九張證照的考綱。

## 整體來說

AI 安全證照市場極度年輕——18 個月前這些證照一張都不存在。依 [StationX 的分析](https://app.stationx.net/articles/best-ai-security-certifications)，「到 2027 年格局會再次不同」。現在選證照的策略不是找「永遠正確的答案」，而是找「現在就能幫你建立能力的工具」。

如果只能選一張：做 AI Agent 平台的開發者，CAISP 的 lab 訓練對你的日常工作最直接有用。但記得，證照證明你學過，不證明你會用——真正的安全能力還是要在實際系統上練。

## 更新紀錄

- 2026-10-08：新增「2026 年新上線：攻擊側的四張」一節（COASP、OSAI+、HTB COAE、GOAA），補上 SC-500、AAIR、TAISE；更正 ISC2 的進度（原文寫「CCAI pilot 中」有誤，實際是 2026/7 才宣布開始開發）；OSAI 由「即將推出」改為已上線。

## 參考資料

- [CompTIA SecAI+ 認證頁（CY0-001）](https://www.comptia.org/certifications/secai)
- [ACI Learning — SecAI+ Complete Guide](https://www.acilearning.com/blog/comp-tia-sec-ai-a-complete-guide-to-the-ai-security-certification)
- [Udemy Blog — SecAI+ Certification Guide](https://blog.udemy.com/comptia-secai-certification-guide)
- [CIAT — Security+ vs SecAI+](https://www.ciat.edu/blog/blog-security-plus-vs-secai-plus)
- [Practical DevSecOps — CAISP](https://www.practical-devsecops.com/certified-ai-security-professional/)
- [Practical DevSecOps — CAISP vs SecAI+](https://www.practical-devsecops.com/caisp-vs-comptia-secai-plus)
- [Practical DevSecOps — CAISP vs AAISM](https://www.practical-devsecops.com/caisp-vs-aaism-compared)
- [tunelko.com — CAISP Review（9/10）](https://blogs.tunelko.com/2026/07/16/certified-ai-security-professional-caisp-practical-devsecops/)
- [LinkedIn Richie Prieto — CAISP Review](https://www.linkedin.com/posts/richieprieto_aisecurity-cybersecurity-practicaldevsecops-activity-7457536949931696128-YW9n)
- [Medium Divith Shetty — CAISP Review](https://divshettyy.medium.com/my-review-of-the-caisp-certified-ai-security-professional-certification-by-practical-devsecops-fb658fabf5da)
- [LinkedIn Mel Drews — CAISP Review](https://www.linkedin.com/posts/meldrews_certified-ai-security-professional-credential-activity-7491467633704435712-Hyft)
- [GIAC GAIPS 官方](https://www.giac.org/certifications/ai-security-platform-security-gaips)
- [CertCrush — GAIPS Explained](https://www.certcrush.app/blog/giac-gaips-ai-platform-security-explained-worth-it-2026)
- [CertMap — GAIPS](https://certmap.de/en/cert/gaips)
- [ISACA AAISM 認證頁](https://www.isaca.org/credentialing/aaism)
- [CertCrush — AAISM Explained](https://www.certcrush.app/blog/isaca-aaism-explained-domains-cost-worth-it-2026)
- [aaismexam.com — AAISM Exam Format](https://aaismexam.com/blog/aaism-exam-format-question-types-and-time-limits)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Practical DevSecOps — AI Security Certification 市場分析](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)
- [StationX — Best AI Security Certifications 2026](https://app.stationx.net/articles/best-ai-security-certifications)
- [EC-Council — Certified Offensive AI Security Professional（COASP）](https://iclass.eccouncil.org/our-courses/certified-offensive-ai-security-professional)
- [EC-Council — Enterprise AI Credential Suite 發表新聞稿（2026/2）](https://www.cybersecuritydive.com/press-release/20260211-ec-council-expands-ai-certification-portfolio-to-strengthen-us-ai-workfor-1/)
- [恆逸教育訓練中心 — COASP AI 資安專家認證課程](https://www.uuu.com.tw/Course/Show/3332/COASP)
- [恆逸教育訓練中心 — OSAI+ 認證課程 AI-300](https://www.uuu.com.tw/Course/Show/3408/OSAI)
- [OffSec — AI-300: Advanced AI Red Teaming（OSAI+）](https://www.offsec.com/courses/ai-300/)
- [OffSec — OSAI+ AI-300 FAQ](https://help.offsec.com/hc/en-us/articles/46593095198740-OSAI-Advanced-AI-Red-Teaming-AI-300-FAQ)
- [Hack The Box — HTB Certified Offensive AI Expert（COAE）](https://academy.hackthebox.com/preview/certifications/htb-certified-offensive-ai-expert)
- [Hack The Box — HTB COAE 上線公告](https://academy.hackthebox.com/news/the-new-htb-certified-offensive-ai-expert-htb-coae-is-officially-here)
- [GIAC GOAA 官方](https://www.giac.org/certifications/offensive-ai-analyst-goaa)
- [GIAC GASAE 官方](https://www.giac.org/certifications/ai-security-automation-engineer-gasae)
- [Microsoft Certified: Cloud and AI Security Engineer Associate（SC-500）](https://learn.microsoft.com/en-us/credentials/certifications/cloud-and-ai-security-engineer-associate/)
- [ISACA AAIR 認證頁](https://www.isaca.org/credentialing/aair)
- [ISACA — AAIR 上線新聞稿（2026/4/15）](https://www.isaca.org/about-us/newsroom/press-releases/2026/isaca-launches-advanced-in-ai-risk-aair-certification-to-equip-it-risk-professionals)
- [CSA TAISE](https://cloudsecurityalliance.org/education/taise)
- [ISC2 — AI Security Certification 開發進度](https://www.isc2.org/new-ai-certification)
- [ISC2 — 開始開發 AI 安全證照公告（2026/7/15）](https://www.isc2.org/insights/2026/07/ai-security-certification-development)
- [ISC2 — AI 考試指引更新（2026/9）](https://www.isc2.org/Insights/2026/09/updated-ISC2-ai-guidance-published)
