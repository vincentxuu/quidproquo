---
title: "資安證照全景地圖——軟體開發者該從哪裡開始"
date: 2026-09-10
category: tech
type: guide
tags: [cybersecurity, certification, ai-security, career, cissp, comptia, aws]
lang: zh-TW
tldr: "2025–2026 年 18 個月內有 6+ 張 AI 安全證照密集上市，傳統三強 Security+（$404）、AWS Security Specialty（$300）、CISSP（$749）仍是基礎。非資安專職的 AI 平台開發者，建議三階段：Security+ → AWS Security → SecAI+ 或 CAISP → CISSP，總預算 $1,800–$2,650。"
description: "給非資安專職軟體開發者的資安證照選考指南：涵蓋 16 張主流證照的費用、門檻與台灣市場認可度比較，以及針對 AI/SaaS 平台開發者的三階段路線圖。"
draft: false
series:
  name: "資安證照攻略"
  order: 1
---

> 🌏 [English version](/en/posts/tech/2026-09-10-security-cert-landscape-en)

你寫 AI Agent 平台、串 LLM API、管 AWS IAM，但從來沒考過資安證照。客戶問你「你們有什麼安全認證嗎？」的時候，你答不上來。

這篇是系列第一篇，目標是給你一張地圖：16 張主流資安證照的定位、費用、門檻，以及一棵決策樹讓你在 10 分鐘內選出自己的路線。後續三篇會分別深入 AI 安全證照橫評、三大經典證照 ROI 拆解、台灣法規與備考資源。

## 證照分六類，先搞清楚自己在哪

資安證照不是一條直線，是六條平行的跑道。你不需要每條都跑，但要知道它們存在。

### 1. 入門基礎

打底用，建立共同語言。

- **CompTIA Security+**（$404–$439）：國際通用的入門證照，90 題 / 90 分鐘，無經驗門檻。台灣金融業徵才清單常見。依 [SecuSpark 2026 統計](https://www.secuspark.com/blog/security-plus-pass-rate-statistics)，自學首次通過率約 50–65%，搭配培訓可達 85–93%。
- **ISC2 CC**（$199）：ISC2 品牌的入門款，門檻更低，但作為跳板通往 CISSP/CCSP 有策略價值。

### 2. 雲端資安

你的程式碼跑在哪朵雲，就考哪朵雲的安全證照。

- **AWS Security Specialty**（$300）：65 題 / 170 分鐘，涵蓋 IAM 策略、KMS、VPC 安全、GuardDuty、Bedrock 安全配置。依 [Pruvos 社群數據](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03)，首次通過率約 45–55%，有 AWS 經驗者可達 65–70%。持有任何 AWS 認證可享 50% 折扣（$150）。
- **Azure AZ-500**（$165）：微軟生態最便宜的雲端資安證照，1 年效期、每年免費線上續期。政府與金融業偏好 Azure 的場景適用。
- **GCP Professional Cloud Security Engineer**（$200）：用 Vertex AI 才需要優先考慮。

### 3. 管理治理

給要帶團隊、做合規、面對董事會的人。

- **CISSP**（$749）：資安界的金字招牌。依 [Training Camp 2026 分析](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026)，首次通過率的可信估計為 50–60%（網路上流傳的 20% 無可溯源）。台灣僅約 500 人持有，稀缺性極高。門檻：5 年跨 2 域經驗，學位可折 1 年。
- **CISM**（$575–$760）：偏資安管理——治理、風險、事件管理。需 5 年資安管理經驗。
- **CRISC**（$575–$760）：IT 風險控制路線，偏稽核。

### 4. 攻防實戰

紅隊、滲透測試、漏洞獵人的路線。

- **OSCP**（$1,749 含課程 + lab）：23 小時 45 分鐘實戰考試，終身有效。技術圈含金量最高，但投入巨大。
- **CEH v13**（$950–$1,199）：知名度高但業界評價兩極。注意：依 [ISC2 2026/4/1 新規](https://destcert.com/resources/how-much-cissp-certification-costs/)，CEH 已被從 CISSP 經驗折抵清單中移除。

### 5. 應用安全

你寫的程式碼本身要安全。

- **CSSLP**（$599）：涵蓋安全需求、安全設計、安全編碼、測試、部署全生命週期。門檻 4 年軟體開發安全經驗。對 AI Agent 平台的 SDLC 直接相關。

### 6. AI 安全（2025–2026 新興）

**這是爆發中的戰場。** 18 個月內 6+ 張全新證照上市，市場尚未收斂出業界標準。

| 證照 | 費用 | 上線日 | 考試格式 | 定位 |
|---|---|---|---|---|
| **CompTIA SecAI+** | $359 | 2026/02 | 60 題 / 60 分鐘 | 中階擴充，疊在 Security+ 上 |
| **CAISP** | $999–$1,099 全包 | 2024 Q4 | 6h 實戰 + 24h 報告 | 實作攻防，OWASP LLM Top 10 |
| **GIAC GAIPS** | ~$999 考 / ~$9K 含課 | 2026/07 | CyberLive 實作 | 防禦側 GenAI/LLM 平台安全 |
| **ISACA AAISM** | $459–$599 | 2025/08 | 90 題 / 150 分鐘 | 治理管理層（需 CISM 或 CISSP） |
| **GIAC GASAE** | ~$979 考 | 2026/04 | CyberLive | 紅藍紫隊 AI 自動化 |
| **ISC2 CCAI** | TBA | pilot 2025 Q4 | TBA | 安全工程（未正式） |

依 [Practical DevSecOps 市場分析](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)，2025/10 至 2026/3 之間，要求 AI 技能的資安職缺比例從 14.2% 翻倍到 28.5%。

## 總覽比較表

一張表看全貌。費用為考試報名費（USD），不含培訓教材。

| 證照 | 費用 | 難度 | 經驗門檻 | 效期 | 台灣認可 | AI/SaaS 相關 |
|---|---|---|---|---|---|---|
| ISC2 CC | $199 | ⭐ | 無 | 3 年 | 中 | 低 |
| Security+ | $404 | ⭐⭐ | 無 | 3 年 | 高 | 中 |
| SecAI+ | $359 | ⭐⭐ | 建議 2 年資安 | 3 年 | 中（新） | 高 |
| AZ-500 | $165 | ⭐⭐ | 無 | 1 年 | 中高 | 中 |
| AWS Security | $300 | ⭐⭐⭐ | 建議 5 年 IT | 3 年 | 高 | 最高 |
| CAISP | $999 | ⭐⭐⭐ | 無 | 終身 | 低（新） | 最高 |
| CSSLP | $599 | ⭐⭐⭐ | 4 年 | 3 年 | 中 | 高 |
| CEH v13 | $950+ | ⭐⭐⭐ | 2 年或官訓 | 3 年 | 中 | 低 |
| GAIPS | ~$999 | ⭐⭐⭐⭐ | 無 | 4 年 | 低（新） | 最高 |
| CISM | $575+ | ⭐⭐⭐⭐ | 5 年管理 | 3 年 | 高 | 中 |
| AAISM | $459+ | ⭐⭐⭐ | 需 CISM/CISSP | 3 年 | 低（新） | 高 |
| CISSP | $749 | ⭐⭐⭐⭐⭐ | 5 年 | 3 年 | 最高 | 高 |
| CCSP | $599 | ⭐⭐⭐⭐ | 5 年（含 3 年資安） | 3 年 | 高 | 中 |
| OSCP | $1,749 | ⭐⭐⭐⭐⭐ | 建議 2 年 | 終身 | 高（技術圈） | 中 |

## 台灣法規脈絡速覽

你不一定需要為了法規去考，但了解推力在哪有助於判斷哪些證照「市場真的在要」。

**資安法 2.0**（2025/8 三讀，2026 上半年子法施行）：特定非公務機關須設資安長與專職人員，罰則上限提高至 NT$1,000 萬。但**無強制指定證照**，只要求定期專業訓練。

**金管會上市櫃資通安全管控指引**：依資本額分三級，第一級（資本額 ≥NT$100 億）須設資安長 + ≥2 名專責人員。指引「建議」持有 CISSP、CISM 或中級資訊安全工程師，但同樣不強制。

**實際徵才怎麼寫**：[華南銀行 2026/09 的 104 職缺](https://www.104.com.tw/job/7o6p3)直接列出認可清單——CISSP、CISM、CompTIA Security+、AWS Certified Security – Specialty、CEH、CCSP、CSSLP。這是台灣金融業的真實需求快照。

依 [CloudInsight 2026 薪資調查](https://cloudinsight.cc/zh/blog/security-engineer-guide)，台灣資安工程師持有 CISSP / OSCP 等高階證照，薪資可多 10–20%。5–8 年資歷的資安主管月薪區間為 NT$80,000–120,000。

## 決策樹：三階段路線圖

如果你是非資安專職的軟體開發者，特別是做 AI/SaaS 產品：

```
Phase 1（打基礎 + 雲端深化）
├── CompTIA Security+ ($404)
│   無門檻、台灣認可度高、可折抵 CISSP 1 年經驗
│   準備：2–3 個月自學
│
└── AWS Security Specialty ($150–$300)
    與日常工作完全對齊（IAM、KMS、VPC、Bedrock）
    準備：2–3 個月，趁 AIF-C01 知識餘熱

Phase 2（AI 安全專門化）
├── 首選：CompTIA SecAI+ ($359)
│   性價比最高、vendor-neutral、疊在 Security+ 上
│   40% 考域 = Securing AI Systems
│
├── 或：CAISP ($999–$1,099 全包)
│   實作最強、6h 實戰考、OWASP LLM Top 10 完整覆蓋
│   多位考生 review 一致 9/10（見後續篇章詳評）
│
└── 觀望：ISC2 CCAI（pilot 中）、GIAC GAIPS（$999/$9K）

Phase 3（長期王牌）
└── CISSP ($749)
    台灣最高認可度，全台僅約 500 人持有
    Security+ 可折 1 年經驗
    可先通過考試成為 Associate of ISC2，再累積經驗
```

### 費用估算

| 階段 | 證照 | 考試費 | 備考材料（估） | 小計 |
|---|---|---|---|---|
| Phase 1 | Security+ | $404 | ~$30 | ~$434 |
| Phase 1 | AWS Security | $150–$300 | ~$30 | ~$180–$330 |
| Phase 2 | SecAI+ | $359 | ~$30 | ~$389 |
| Phase 3 | CISSP | $749 | ~$50 | ~$799 |
| **合計** | | | | **~$1,802–$1,952** |

走 CAISP 路線的話，Phase 2 改為 ~$1,099（已含教材和 lab），總計 ~$2,512–$2,662。

## 備考資源速覽

每張證照的準備生態差異很大。這裡列出最常見的路徑，細節在系列第四篇展開。

### 線上課程

| 證照 | 平台 | 價格帶 | 備註 |
|---|---|---|---|
| Security+ | Udemy（Professor Messer、Jason Dion） | $15–$30（特價） | Professor Messer 另有免費 YouTube 完整課程 |
| AWS Security | Udemy（Stephane Maarek、Neal Davis）、AWS Skill Builder | $28–$120 | AWS Skill Builder 有免費基礎課 |
| CISSP | Udemy、LinkedIn Learning、Training Camp bootcamp | $30–$3,000+ | Reddit r/cissp 社群活躍度最高，每日討論串 |
| SecAI+ | Infosec Institute Boot Camp、Udemy | $30–$2,500+ | 2026/02 才上線，資源還在建立中 |
| CAISP | Practical DevSecOps 官方（唯一來源） | $999–$1,099 全包 | 含 60 天 lab、影片、PDF、24/7 Mattermost 支援、1 次考試 |
| GAIPS | SANS SEC545（唯一來源） | ~$9,000 含課 / ~$999 單考 | CyberLive 實作考，2026/07 才開放一般購買 |

### 台灣在地培訓

| 機構 | 主要課程 | 特色 |
|---|---|---|
| [全智網科技 AI Network](https://ainetwork-training.com/) | CISSP、CCSP、CEH、SecAI+ | ISC2 官方授權，台北實體，附 2 天總複習班 |
| 恆逸教育訓練中心 | CISSP、CISM、Security+、CEH | EC-Council / CompTIA 授權，課程選擇最多 |
| 巨匠電腦 | Security+、iPAS、基礎資安 | 全台連鎖、入門導向、價格較親民 |

### 考試地點（台灣）

- **Pearson VUE 考場**（CISSP、Security+、SecAI+、CEH）：台北信義區聯合世紀大樓 12F-3、高雄苓雅區亞太財經廣場 4F-1
- **OnVUE 線上監考**（Security+、SecAI+、AWS）：在家考，需獨立房間 + 穩定網路
- **CAISP**：完全線上，6h 實作 + 24h 報告撰寫

### 免費起步資源

如果你還不確定要不要投入，這些零成本資源可以幫你試水溫：

- **Security+**：[Professor Messer YouTube 完整課程](https://www.youtube.com/@professormesser)、CompTIA 官方題庫樣本
- **AWS Security**：[AWS Skill Builder 免費學習路徑](https://skillbuilder.aws/)、[Digital Cloud Training 免費 PDF cheat sheets](https://digitalcloud.training/aws-security-specialty-resources-udemy)
- **CISSP**：ISC2 官方樣題、Reddit r/cissp 每日討論、Discord 學習群
- **AI 安全通識**：[OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)（免費、必讀）

## 不推薦的路（現階段）

| 證照 | 原因 |
|---|---|
| CEH | 性價比差、ISC2 已從 CISSP 折抵清單移除、技術深度不如 OSCP |
| OSCP | 優秀但太偏攻擊面，與「建構安全 AI 平台」目標不直接對齊 |
| AAISM | 需先持有 CISM 或 CISSP，是第二張證照不是第一張 |
| CCSP / CISM / CRISC | 經驗門檻 3–5 年資安管理，更適合資安專職 |

## 系列導覽

這是「資安證照攻略」系列的第一篇。後續：

- **第二篇**：AI 安全證照橫評——SecAI+ vs CAISP vs GAIPS vs AAISM，誰真的教你防 prompt injection
- **第三篇**：Security+ → AWS Security → CISSP 的 ROI 拆解——準備時間、通過率、維護成本實證
- **第四篇**：台灣資安證照生態——法規細節、在地培訓機構、備考資源與考場資訊

## 參考資料

- [CompTIA Security+ 官方認證頁](https://www.comptia.org/certifications/security)
- [CompTIA SecAI+ 認證頁（CY0-001）](https://www.comptia.org/certifications/secai)
- [AWS Certified Security – Specialty（SCS-C03）](https://aws.amazon.com/certification/certified-security-specialty/)
- [ISC2 CISSP 認證頁](https://www.isc2.org/certifications/cissp)
- [ISC2 AI Security Certification 開發中](https://www.isc2.org/new-ai-certification)
- [GIAC GAIPS（AI Platform Security）](https://www.giac.org/certifications/ai-security-platform-security-gaips)
- [Practical DevSecOps CAISP](https://www.practical-devsecops.com/certified-ai-security-professional/)
- [ISACA AAISM（Advanced in AI Security Management）](https://www.isaca.org/credentialing/aaism)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [SecuSpark — Security+ Pass Rate Statistics 2026](https://www.secuspark.com/blog/security-plus-pass-rate-statistics)
- [Training Camp — CISSP Pass Rate 2026](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026)
- [Pruvos — AWS SCS-C03 Practice Tests](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03)
- [CyberSecJobs — Best Cybersecurity Certifications 2026](https://cybersecjobs.com/best-cybersecurity-certifications)
- [CloudInsight — 資安工程師完整指南 2026](https://cloudinsight.cc/zh/blog/security-engineer-guide)
- [ICSDA — 上市櫃資通安全管控指引問答](https://icsda.org.tw/)
- [SSDLC by 飛飛 — 台灣法規遵循指南](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc)
- [Practical DevSecOps — AI Security Certification 比較](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)
