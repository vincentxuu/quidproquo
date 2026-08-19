---
title: "AI 治理框架對照：EU AI Act、NIST AI RMF、ISO/IEC 42001，以及沒有一張證照點名它們"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, ai-governance, compliance, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 18
tldr: "治理在證照裡的比重比多數工程師以為的高——CCAR-P 的 Governance 14% 加 Stakeholder 14% 共 28%、CCAO-F 治理 15%、AB-100 的部署治理塊 40–45%、AIF-C01 的負責任 AI 14% 加安全治理 14%。但把十五份官方 exam guide 逐份查過，沒有任何一張點名 EU AI Act、NIST AI RMF 或 ISO/IEC 42001；全系列唯一被官方點名的法規只有 CCAR-P 的 GDPR、HIPAA、FedRAMP。所以這篇的用法不是「背框架去考試」，而是用三份框架當骨架，把六張證照散落的治理條目歸位。三份框架的分工是：EU AI Act 是法律（2026-08-02 全面適用，高風險義務被 AI Omnibus 延到 2027-12-02）、NIST AI RMF 是自願框架（GOVERN／MAP／MEASURE／MANAGE 四個功能，且 1.0 正在改版）、ISO/IEC 42001 是可驗證的管理系統標準（條文付費，本文只用 ISO 官方公開頁能證實的部分）。"
description: "跨證照的 AI 治理考點整理：先用官方 exam guide 比對六張證照的治理權重與條目，再從歐盟執委會、NIST 與 ISO 的官方頁面對照 EU AI Act、NIST AI RMF 1.0 與 ISO/IEC 42001 的適用範圍、拘束力與時程，最後把每張證照的治理目標對應回最接近的框架。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains-en)
>
> 本文是從官方資料建出來的備考材料，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回各家官方 exam guide 或 study guide，所有框架事實都指回歐盟執委會、NIST 或 ISO 的官方頁面，來源逐條列在文末。查證日期：2026-08-18。

這是 [AI 證照備考系列](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)的技術深潛篇，跟 [B1 多 agent 架構](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)同一種寫法：抽一個被多張證照重複考的主題，一次講完，再標出不能互相取代的部分。

但這篇跟 B1 有一個關鍵差別，而且必須放在最前面：

**把系列十五篇 A 軌逐份查過，沒有任何一張證照的官方 exam guide 點名 EU AI Act、NIST AI RMF 或 ISO/IEC 42001。** 全系列唯一被官方逐字點名的法規，是 [CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide) Governance 那塊的 **GDPR、HIPAA、FedRAMP** —— 三份都不是 AI 專法。

所以這篇的用法不是「背這三份框架去考試」。**是反過來：用這三份框架當骨架，把六張證照散落各處、措辭互不相同的治理條目歸位。** 這件事有價值，因為證照的治理條目講的義務，幾乎都能在這三份框架裡找到對應的原型 —— 只是換了名字，而且沒有引用出處。

## 哪些證照考治理，考多少

| 證照 | 治理相關 domain | 權重 | 這張的角度 |
|---|---|---|---|
| [Claude CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide) | Governance, Safety & Risk Management | **14%** | 唯一點名具體法規的一張 |
| 同上 | Stakeholder Communication & Lifecycle Management | **14%** | 合計 **28% 不考技術** |
| [Claude CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide) | Governance, Risk, and Responsible Use | **15%** | 使用者視角：什麼場景不該用 |
| [微軟 AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide) | Deploy（含負責任 AI、安全、治理、風險與合規） | **40–45%** | 條目最接近高風險 AI 的法定義務 |
| [微軟 AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)（beta） | Secure, govern, and deploy | 20–25% | 名字有 govern，內容幾乎全是操作控制 |
| [NVIDIA NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide) | Safety, Ethics, and Compliance | 5% | 條目最像 NIST 的可信賴特徵 |
| 同上 | Human-AI Interaction and Oversight | 5% | 透明機制與人類介入 |
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide) | 負責任 AI 準則 | 14% | 六個面向是全系列最完整的一組 |
| 同上 | 安全、合規與治理 | 14% | 合計 **28%** |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide) | AI 安全、資安與治理 | 20% | 血緣、model card、決策日誌 |

**先修掉一個直覺**：多數工程師會假設治理是入門級證照的填充題，越專業的證照越少。**實際反過來。** CCAR-P 是 Anthropic 四張裡最貴最資深的一張，非技術比重卻是 28%；AB-100 是微軟 agent 線的架構師版，最重的 Deploy 塊 40–45% 裡有一整條在講治理、風險與合規。**越往架構師走，治理佔比越高。**

**第二個要修的直覺**：AI-500 那塊叫 `Secure, govern, and deploy`，但把 study guide 的條目攤開看 —— RBAC、Azure Key Vault、OAuth 2.0、on-behalf-of、四個介入點的 guardrail、AI Red Teaming Agent、DTAP／藍綠／金絲雀 —— **裡面沒有一條在講法規**。它的 govern 指的是「操作面的控制權」，不是「法遵」。準備時把這兩種 governance 分開看，否則會拿錯材料讀。

**要點回指**：CCAR-P Governance（14%）＋ Stakeholder（14%）、CCAO-F Governance（15%）、AB-100 Deploy（40–45%）、AI-500 Secure/govern/deploy（20–25%）、NCP-AAI Safety/Ethics/Compliance（5%）＋ Human-AI Interaction（5%）、AIF-C01 第 4 章（14%）＋第 5 章（14%）、AIP-C01 第 3 章（20%）。

## 三份框架，先分清楚性質

這三份最常被並列，但它們**不是同一類東西**，混在一起讀會浪費時間。

| | EU AI Act | NIST AI RMF 1.0 | ISO/IEC 42001:2023 |
|---|---|---|---|
| 是什麼 | 法規（Regulation (EU) 2024/1689） | 自願性風險管理框架 | 管理系統標準（MSS），可第三方驗證 |
| 誰發布 | 歐盟（歐洲議會與理事會） | 美國 NIST（ITL AI Program） | ISO／IEC JTC 1/SC 42 |
| 拘束力 | **法律強制** | **自願** | 自願，但可申請驗證 |
| 管什麼 | 特定「用途」的 AI 系統，依風險分級 | 組織如何管理 AI 風險，不分產業、不分用例 | 組織的 **AI 管理系統（AIMS）** |
| 管誰 | 在歐盟市場投放或使用 AI 系統的 provider 與 deployer | 任何設計、開發、部署、評估或取得 AI 系統的組織 | 任何提供或使用 AI 產品與服務的組織，含公部門與非營利 |
| 骨架 | 四級風險 ＋ 通用型 AI（GPAI）專章 | **GOVERN／MAP／MEASURE／MANAGE** 四個功能 | **Plan-Do-Check-Act**，51 頁 |
| 關鍵日期 | 2024-08-01 生效、**2026-08-02 全面適用** | 2023-01-26 發布，**目前正在改版** | 2023-12-18 發布，第 1 版 |
| 取得成本 | 公開免費 | 公開免費 | **CHF 225（付費）** |

一句話版本：**EU AI Act 管「你的產品能不能在歐盟上市」，NIST AI RMF 管「你怎麼在內部把風險想清楚」，ISO/IEC 42001 管「你有沒有一套能被稽核的制度」。** 它們不互斥，實務上是疊在一起用的。

### EU AI Act：唯一有罰則的那一份

歐盟執委會官方頁面把風險切成四級：

| 級別 | 內容 | 生效時點 |
|---|---|---|
| **不可接受風險** | 禁止 **9 種**實務（操縱與欺騙、剝削弱勢、社會評分、個人犯罪風險預測、無差別抓取臉部影像建庫、職場與教育的情緒辨識、生物特徵推論受保護特徵、執法用即時遠端生物辨識，加上第 9 項非自願性私密影像與 CSAM 生成） | 第 1–8 項 **2025 年 2 月**；第 9 項 **2026 年 12 月** |
| **高風險** | 關鍵基礎設施、教育、產品安全元件、就業與人力管理、必要公私服務（如信用評分）、遠端生物辨識、執法、移民與邊境、司法與民主程序 | **Annex III 用例 2027-12-02**；**Annex I 內嵌於產品者 2028-08-02** |
| **透明度風險** | 與人互動的系統要讓人知道在跟機器對話；生成式 AI 產出要可辨識；deepfake 與涉公共利益的文字要明確標示 | **2026 年 8 月** |
| **最低或無風險** | 不設規則（執委會表示歐盟目前絕大多數 AI 系統落在這一級） | — |

高風險系統上市前的義務，執委會頁面列了七項：**風險評估與緩解、餵給系統的資料集品質（避免歧視性結果）、活動記錄以確保結果可追溯、詳盡的技術文件、給 deployer 的清楚資訊、適當的人類監督措施、高水準的穩健性與資安與準確度**。

我另外在 EUR-Lex 的規則本文裡逐條確認了對應的條號（**這是 2024 年原始文本，見下面的不確定性標記**）：

| 條號 | 標題 | 工程上的意思 |
|---|---|---|
| Article 5 | Prohibited AI practices | 九項禁令 |
| Article 6 | Classification rules for high-risk AI systems | 你的系統算不算高風險 |
| Article 9 | Risk management system | 風險管理要是「建立、實作、記錄、維護」的持續制度 |
| Article 10 | Data and data governance | 訓練資料的治理要求 |
| Article 12 | Record-keeping | 系統要能在生命週期內自動記錄事件（logs） |
| Article 14 | Human oversight | 要設計成能被自然人有效監督，含人機介面工具 |
| Article 15 | Accuracy, robustness and cybersecurity | 準確度、穩健性、資安 |
| Article 26 | Obligations of deployers of high-risk AI systems | **部署者也有義務，不只開發者** |
| Article 50 | Transparency obligations for providers and deployers | 標示與告知 |
| Article 51 | Classification of GPAI models with systemic risk | 通用型模型的系統性風險門檻 |

上市後：執委會頁面寫明**主管機關負責市場監督、deployer 負責人類監督與監控、provider 要有上市後監控機制，且雙方都要通報重大事故與失效**。

**治理與執法**：自 **2026-08-02** 起由 AI Office 與各會員國主管機關負責實施、監督與執法；AI Office 對 GPAI 模型有執法權，可要求技術文件、評估模型、要求改正措施並開罰。

**這一段有正在變動的部分，必須標成不確定**：所謂 **AI Omnibus**（簡化包）於 **2025-11-19 提出、2026-05-07 達成政治協議、2026-07-27 生效**，把高風險義務的適用日往後推（Annex III 到 2027-12-02、Annex I 到 2028-08-02），並新增第 9 項禁令、強化 AI Office 權限、擴大沙盒與中小企業簡化措施。**因此上面那張條號表引自 EUR-Lex 的 2024 年原始文本，經 Omnibus 修正後的合併版條文可能已有差異** —— 引用條號時請以合併版為準，本文只保證這些條號在原始文本中確實是這些標題。

**罰則金額本文不寫。** 罰則條文不在本次能完整讀到的範圍內，寧可留白。

### NIST AI RMF：四個功能、七個可信賴特徵

NIST 官方頁面把定位講得很清楚：**「intended for voluntary use」**，2023-01-26 發布，透過公開徵求意見、多次草案與工作坊的共識程序產出。框架本文（NIST AI 100-1）自述是 **voluntary、rights-preserving、non-sector-specific、use-case agnostic**。

**Core 是四個功能**：

| 功能 | 做什麼 |
|---|---|
| **GOVERN** | 培養並落實組織的風險管理文化；訂出能預期、辨識與管理風險的流程、文件與組織架構；把技術設計連回組織價值與政策；涵蓋完整產品生命週期 |
| **MAP** | 建立脈絡、辨識風險 |
| **MEASURE** | 分析、評估、追蹤風險 |
| **MANAGE** | 依優先序配置資源、處置風險 |

**這個框架最該記住的一條結構事實**：**GOVERN 是橫跨性（cross-cutting）功能，適用於組織風險管理流程的所有階段，並貫穿並啟動其他三個功能**；而 MAP／MEASURE／MANAGE 是可以套在特定系統脈絡與特定生命週期階段的。框架也明說：假設治理結構已就位，這些功能可以依需要以任何順序執行，且過程應是迭代的。

**七個可信賴特徵**（框架 Part 1 列的）：**valid and reliable（有效且可靠）、safe（安全）、secure and resilient（資安且有韌性）、accountable and transparent（可問責且透明）、explainable and interpretable（可解釋且可詮釋）、privacy-enhanced（隱私強化）、fair with harmful bias managed（公平且有害偏誤受控）**。框架強調這些特徵之間要權衡，不是每項拉滿 —— 它舉的例子是：準確但不安全、安全但不準確、不準確但資安隱私透明都好，這些都是不理想的。

**配套資源**：AI RMF Playbook（線上、同樣自願）、Roadmap、Crosswalk 與各種 Perspectives，都掛在 NIST 的 Trustworthy and Responsible AI Resource Center（2023-03-30 上線）。另有兩份 profile：**Generative AI Profile（NIST-AI-600-1，2024-07-26 發布）**，以及 **2026-04-07 發布的關鍵基礎設施可信賴 AI profile 概念說明（concept note，尚非正式 profile）**。

**最大的過期風險就在這裡**：NIST 官方頁面在頁首與內文各寫了一次 —— **「The AI RMF 1.0 is being revised as part of the White House AI Action Plan.」** 也就是說，你現在讀的 1.0 正在改。備考時記結構（四個功能、七個特徵）比記細節划算。

### ISO/IEC 42001：付費，所以本文只寫官方公開頁說得出的部分

ISO 官方頁面能證實的事實：

- 全名 **ISO/IEC 42001:2023，Information technology — Artificial intelligence — Management system**
- **Edition 1，2023-12-18 發布，51 頁**，狀態 Published（stage 60.60）
- 技術委員會 **ISO/IEC JTC 1/SC 42**
- 價格 **CHF 225**（PDF）
- 它規範建立、實作、維護與持續改善 **AI 管理系統（AIMS）** 的要求，對象是提供或使用 AI 產品與服務的組織
- ISO 自述它是**世界第一份 AI 管理系統標準**，用 **Plan-Do-Check-Act** 方法論，是管理系統標準（MSS）而不是針對特定 AI 應用的技術標準
- ISO 頁面自己列的相關標準：**ISO/IEC 22989**（術語）、**ISO/IEC 23053**（ML 框架）、**ISO/IEC 23894**（AI 風險管理指引）、**ISO/IEC 42005**（影響評估）

**條文層級的內容本文不寫，因為它在付費牆後。** 具體有哪些條款、Annex A 有哪些控制項、驗證要走什麼程序 —— **未查證**。任何把 42001 的控制項清單當事實列出來的二手整理，在沒有讀過標準本文之前都不該當來源用。這是本篇唯一必須留白的一塊，留白比填錯好。

**要點回指**：這一整節對應 CCAR-P Governance（14%）「確保法規合規」、CCAO-F Governance（15%）「套用資料敏感性、法規與隱私考量」與「遵循組織的 AI 政策與治理標準」、AB-100 Deploy（40–45%）的「驗證資料落地與資料移動的合規」。

## 每張證照的治理考點，最像哪一份框架

這是本文最實用的一張表 —— **左邊是官方 exam guide 的原始條目，右邊是它在三份框架裡的原型**。再強調一次：**沒有任何一張證照引用這些框架，這個對應是本文做的，不是官方做的。**

| 證照與 domain | 官方條目（摘自 exam guide） | 最接近的框架原型 |
|---|---|---|
| **CCAR-P** Governance 14% | 實作 guardrail 與安全控制；辨識 LLM 系統的風險、限制與失效模式；確保法規合規（**GDPR、HIPAA、FedRAMP**）；處理偏誤、公平性、透明度；套用 human-in-the-loop 驗證策略 | NIST **MAP＋MEASURE＋MANAGE**＋七特徵；法規部分是資料保護與產業別規範，**不是 AI 專法** |
| **CCAO-F** Governance 15% | 辨識合適與不合適的使用案例；套用資料敏感性、法規與隱私考量；**遵循組織的 AI 政策與治理標準**；理解倫理意涵 | **ISO/IEC 42001 的 AIMS 思維** —— 「照組織的政策做」正是管理系統標準的語言 |
| **AB-100** Deploy 40–45% | 設計 agent 的安全與治理；分析漏洞與緩解（含 prompt manipulation）；審視是否符合負責任 AI 原則；**驗證資料落地與資料移動的合規**；設計 grounding 資料與模型調校的存取控制；**設計模型與資料變更的稽核軌跡** | **最接近 EU AI Act 的高風險義務**：資料治理（Art 10）、記錄與可追溯（Art 12）、穩健性與資安（Art 15） |
| **AI-500** Secure/govern/deploy 20–25% | RBAC、Key Vault、OAuth 2.0、on-behalf-of；四個介入點的 guardrail（輸入／工具呼叫／工具回應／輸出）；合成資料測 guardrail；AI Red Teaming Agent；DTAP／藍綠／金絲雀 | **NIST GOVERN 的操作面**，法遵成分極低 —— 它的 govern 是控制權不是合規 |
| **NCP-AAI** Safety/Ethics/Compliance 5% | 系統安全與稽核軌跡；合規 guardrail；**偏誤與毒性緩解**；分層安全框架（過濾器、升級協定）；授權與法規遵循 | **NIST 七特徵**幾乎逐項對得上：safe、secure and resilient、fair with harmful bias managed |
| **NCP-AAI** Human-AI Interaction 5% | 使用者在迴圈中的介面；結構化回饋迴圈；**透明機制（可解釋推理、決策可追溯）**；人類監督與介入 | NIST 的 **accountable and transparent**＋**explainable and interpretable**；也對應 EU AI Act 的人類監督（Art 14） |
| **AIF-C01** 負責任 AI 14% | 六個面向：**偏誤、公平性、包容性、穩健性、安全、真實性**；環境與永續；法律風險；偵測工具（標註品質分析、人工稽核、子群分析）；透明與可解釋 | **全系列最接近 NIST 七特徵的一組措辭**，雖然 AWS 沒引用 NIST |
| **AIF-C01** 安全合規治理 14% | IAM、加密、責任共擔；**資料來源與血緣、Model Cards**；prompt injection；輸出過濾與驗證；**AI 互動的稽核軌跡與日誌**；資料生命週期與駐留 | EU AI Act **Art 10 資料治理**＋**Art 12 記錄**；駐留對應 AB-100 的資料落地 |
| **AIP-C01** 安全資安治理 20% | 程式化 **model card**、資料血緣、metadata 標籤、**決策日誌**；來源註冊與稽核；持續監控（誤用、drift、政策違規、**偏誤 drift**、token 層級遮蔽、回應記錄、輸出政策過濾） | EU AI Act 的**上市後監控**（執委會頁面：provider 要有上市後監控機制並通報重大事故）＋ NIST **MEASURE／MANAGE** 的持續性 |

**看這張表的方式**：如果你同時準備兩張以上，先讀 NIST AI RMF 1.0（免費、48 頁的 Part 1＋Part 2 結構清楚），因為**八組治理條目裡有五組的原型在它身上**。EU AI Act 只有 AB-100 與兩張 AWS 的條目真正踩到，ISO/IEC 42001 則只有 CCAO-F 那種「照組織政策做」的框架感。

**要點回指**：CCAR-P Governance（14%）、CCAO-F Governance（15%）、AB-100 Deploy（40–45%）、AI-500 Secure/govern/deploy（20–25%）、NCP-AAI Safety/Ethics/Compliance（5%）＋ Human-AI Interaction（5%）、AIF-C01 第 4／5 章（各 14%）、AIP-C01 第 3 章（20%）。

## 工程師要會做的事，不是會背的事

治理考題的共同特徵是**情境判斷**，不是名詞定義。下面七件事是把上面所有條目收斂之後，實際要能做出來的東西 —— 每一條都同時對得上至少一份框架與至少一張證照。

**一、先判斷你的系統落在哪一級。** EU AI Act 的義務量隨風險級別跳一個數量級。多數企業內部的 agent 系統落在**透明度風險**（要讓人知道在跟機器對話、生成內容要可辨識），不是高風險。但一旦碰到履歷篩選、信用評分、教育評分這類 Annex III 用例，整套高風險義務就開了。**「我們只是做個內部工具」不是分級依據，用途才是。**
→ 對應 EU AI Act Art 6；AB-100「審視是否符合負責任 AI 原則」；CCAO-F「辨識合適與不合適的使用案例」。

**二、log 要寫成別人能追的，不是你能 debug 的。** Art 12 要求高風險系統在生命週期內自動記錄事件；AIP-C01 考**決策日誌**與 CloudTrail 稽核；AI-500 考 **agent replay 擷取以重現除錯**。三者要的是同一件事的不同強度：**能把一次決策完整重建出來。** 只印 error 不算。

**三、人類監督要設計成可介入，不是加一顆確認按鈕。** Art 14 的措辭是「設計與開發成能被自然人有效監督，含適當的人機介面工具」—— 重點在 **effectively**。CCAR-P 考「套用 human-in-the-loop 驗證策略」、AI-500 考「核可流程、覆寫、邊界案例」、NCP-AAI 有一整個 5% 的領域在講人類監督與介入。**一個永遠被按下去的確認鍵不構成監督。**

**四、資料來源與血緣要說得清楚。** Art 10 是資料治理專條；AIF-C01 考 data lineage 與 Model Cards；AIP-C01 考 Glue 資料血緣與來源註冊；AB-100 考**資料落地與資料移動的合規**。這一條是最容易在架構定案後補不回來的 —— 血緣是設計時決定的，不是事後查出來的。

**五、AI 生成內容要標示。** EU AI Act 的透明度規則 **2026 年 8 月**生效，執委會另外發了《AI 生成內容標記與標示行為準則》（自願工具，含一組可用的圖示）與《透明度義務指引》。這條在證照裡對應得最弱（只有 AIF-C01 的「AI 決策透明度」勉強沾到），但**在實務上是現在就要做的**。

**六、要有一份組織層級的 AI 政策，而且系統要能對照它。** 這是 ISO/IEC 42001 的核心 —— AIMS 就是「訂出政策與目標，再訂出達成目標的流程」。CCAO-F 直接把「遵循組織的 AI 政策與治理標準」列成考點。**這條是團隊層級的，個人補不了**，但你至少要知道自己的系統受哪份政策管。

**七、風險管理是持續的，不是上線前的一次性檢查。** NIST 的 GOVERN 是橫跨性功能、貫穿其他三個；ISO 42001 用 PDCA；EU AI Act 的 Art 9 要求風險管理系統「建立、實作、記錄、維護」，且上市後 provider 要有監控機制並通報重大事故。AIP-C01 的**持續監控（drift、政策違規、偏誤 drift）**是同一件事的實作版。**三份框架在這一點上完全一致，證照也是。**

**要點回指**：EU AI Act Art 6／9／10／12／14／50；NIST GOVERN（橫跨）＋ MEASURE／MANAGE；ISO/IEC 42001 的 PDCA；AB-100 Deploy（40–45%）、AIP-C01 第 3 章（20%）、AIF-C01 第 4／5 章（各 14%）、CCAR-P Governance（14%）、CCAO-F Governance（15%）、NCP-AAI Human-AI Interaction（5%）。

## 查證上踩到的坑（也是給下次的提醒）

這一節放進來是因為它會直接影響你自己去查證時的成敗：

- **`iso.org/standard/42001.html` 不是 ISO/IEC 42001。** 那個網址回的是 **ISO 12164-4:2008**（工具機的空心錐介面，早已 withdrawn）。正確的是 `iso.org/standard/42001`（等同 `81230.html`）。**副檔名 `.html` 那一版是完全不同的標準，抓到就會整段寫錯。**
- **HTTP 200 不等於頁面存在。** 執委會網站的 `standardisation-and-ai-act` 這個路徑回 200，內容卻是 "Page not found"。soft-404 用狀態碼是驗不出來的，一定要讀內文。
- **EUR-Lex 與 ISO 都擋自動抓取**：EUR-Lex 對 `curl` 回 **202**（不是內容），ISO 對 `curl` 回 **403**。兩者的內容都是改用能執行 JS 的抓取器才拿到的。**看到 202／403 不要當成「來源不存在」。**
- **同一頁裡的日期會有兩種寫法**：執委會頁面同時寫「全面適用 2026-08-02」與「透明度規則 2026 年 8 月生效」，兩者相容但精度不同；引用時取精確那個。

## 會過期的東西（下次複查看這裡）

這個主題是全系列老化最快的一塊 —— 三份框架裡有兩份正在動。

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| **NIST AI RMF 1.0 改版** | 官方頁面明寫「正在依 White House AI Action Plan 改版」，未給時程 | **每月**（這是三份裡最可能整份換掉的） |
| EU AI Act 高風險適用日 | Annex III **2027-12-02**、Annex I **2028-08-02**（AI Omnibus 延後後的版本） | 每季 |
| AI Omnibus 合併版條文 | 2026-07-27 生效；本文條號引自 2024 原始文本，合併版可能有差異 | **下次引用條號前必查** |
| EU AI Act 第 9 項禁令 | 非自願性私密影像與 CSAM 生成，**2026 年 12 月**生效 | 2026 年 12 月 |
| EU AI Act 透明度規則 | 2026 年 8 月生效；執委會 2026-07-20 發布透明度義務指引 | 每季 |
| AI 模型第三方評估能力 | 執委會將徵案擴充歐盟評估能量，**預計 2027 年運作** | 2027 年 |
| NIST 關鍵基礎設施 profile | 2026-04-07 只發了 concept note，**尚非正式 profile** | 每季 |
| NIST GenAI Profile | NIST-AI-600-1，2024-07-26 發布 | AI RMF 改版時連帶重查 |
| ISO/IEC 42001 版本 | Edition 1（2023-12），尚未進入系統性審查（stage 90） | 每半年 |
| ISO/IEC 42001 條文內容 | **未查證（付費牆，CHF 225）** | 若取得標準本文 |
| EU AI Act 罰則金額 | **本文未寫**（未讀到罰則條文） | 若補讀合併版 |
| CCAR-P 官方點名的法規 | GDPR、HIPAA、FedRAMP（**仍未點名任何 AI 專法**） | 每次 exam guide 改版 |
| 各證照是否開始考 AI 專法 | 十五份 exam guide **全部未點名** EU AI Act／NIST AI RMF／ISO 42001 | 每季（AI Act 全面適用後最可能改變） |
| AI-500 權重 | 仍是 beta，四塊 15-20 / 30-35 / 20-25 / 20-25 | GA 之後 |

**最後一列是這篇最值得盯的一列。** EU AI Act 在 2026-08-02 才全面適用，而這些 exam guide 多數是在那之前定版的。**如果有一天證照開始點名 AI 專法，最可能先動的是 AB-100（條目已經最貼近高風險義務）與 CCAR-P（唯一有點名法規的習慣）。**

## 參考資料

**官方一手來源**

- [歐盟執委會 AI Act 官方政策頁（風險分級、時程、AI Omnibus、治理與執法）](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
- [Regulation (EU) 2024/1689 全文（EUR-Lex，條號與條文標題出處）](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- [EUR-Lex ELI 常設連結](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [歐盟 AI Office（執法主體）](https://digital-strategy.ec.europa.eu/en/policies/ai-office)
- [AI Act Service Desk（官方問答與支援）](https://digital-strategy.ec.europa.eu/en/policies/ai-act-service-desk)
- [NIST AI Risk Management Framework 官方頁（發布日、改版聲明、配套資源）](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI 100-1，AI RMF 1.0 全文 PDF（四功能、七特徵）](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf)
- [NIST AI 600-1，Generative AI Profile PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [NIST Trustworthy and Responsible AI Resource Center — AI RMF 資源](https://airc.nist.gov/airmf-resources/airmf/)
- [NIST AI RMF Playbook](https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook)
- [ISO/IEC 42001:2023 官方標準頁（版本、頁數、委員會、價格、AIMS 定義）](https://www.iso.org/standard/42001)

**證照官方來源**

- [AI-500 官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [AB-100 官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [NCP-AAI 官方認證頁](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [Claude Certified Architect Professional（CCAR-P）備考指南](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide)
- [Claude Certified Associate（CCAO-F）備考指南](/posts/ai/2026-08-18-claude-certified-associate-prep-guide)
- [微軟 AB-100 備考路徑](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
- [NVIDIA NCP-AAI 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide)
- [AWS AIF-C01 備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [AWS AIP-C01 備考路徑](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)
- [agent 安全：prompt injection 與信任邊界](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)
- [RAG guardrails](/posts/ai/2026-03-12-rag-guardrails)
