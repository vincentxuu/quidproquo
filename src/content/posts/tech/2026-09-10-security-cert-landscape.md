---
title: "資安證照全景地圖——軟體開發者該從哪裡開始"
date: 2026-09-10
category: tech
type: guide
tags: [cybersecurity, certification, ai-security, career, cissp, comptia, aws]
lang: zh-TW
tldr: "2025–2026 年 18 個月內有 10+ 張 AI 安全證照密集上市，傳統三強 Security+（$439）、AWS Security Specialty（$300）、CISSP（$749）仍是基礎。非資安專職的 AI 平台開發者，建議三階段：Security+ → AWS Security → SecAI+ 或 CAISP → CISSP，總預算 $1,780–$2,700。"
description: "給非資安專職軟體開發者的資安證照選考指南：涵蓋 22 張主流證照的費用、門檻與台灣市場認可度比較，以及針對 AI/SaaS 平台開發者的三階段路線圖。"
draft: false
series:
  name: "資安證照攻略"
  order: 1
---

> 🌏 [English version](/posts/tech/2026-09-10-security-cert-landscape-en)

你寫 AI Agent 平台、串 LLM API、管 AWS IAM，但從來沒考過資安證照。客戶問你「你們有什麼安全認證嗎？」的時候，你答不上來。

這篇是系列第一篇，目標是給你一張地圖：22 張主流資安證照的定位、費用、門檻，以及一棵決策樹讓你在 10 分鐘內選出自己的路線。後續三篇會分別深入 AI 安全證照橫評、三大經典證照 ROI 拆解、台灣法規與備考資源。

## 證照分六類，先搞清楚自己在哪

資安證照不是一條直線，是六條平行的跑道。你不需要每條都跑，但要知道它們存在。

### 1. 入門基礎

打底用，建立共同語言。

- **CompTIA Security+**（$439，2026/6 調價）：國際通用的入門證照，90 題 / 90 分鐘，無經驗門檻。台灣金融業徵才清單常見。CompTIA 不公布通過率，[SecuSpark 的整理](https://www.secuspark.com/blog/security-plus-pass-rate-statistics)提醒網路上流傳的百分比都是培訓商或論壇的估計；比較可靠的自我檢核是在沒看過的模擬題上穩定拿到 85% 以上再報名。新版 V8（SY0-801）預計 2026/11/17 上線，會加入 AI 風險相關考點。
- **ISC2 CC**（$199）：ISC2 品牌的入門款，門檻更低，但作為跳板通往 CISSP/CCSP 有策略價值。

### 2. 雲端資安

你的程式碼跑在哪朵雲，就考哪朵雲的安全證照。

- **AWS Security Specialty**（$300）：65 題 / 170 分鐘，涵蓋 IAM 策略、KMS、VPC 安全、GuardDuty、Bedrock 安全配置。依 [Pruvos 社群數據](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03)，首次通過率約 45–55%，有 AWS 經驗者可達 65–70%。持有任何 AWS 認證可享 50% 折扣（$150）。
- **Microsoft SC-500**（$165）：取代已在 2026/8/31 退役的 AZ-500，考試範圍加入 AI 工作負載的安全控制，仍是微軟生態最便宜的雲端資安證照。政府與金融業偏好 Azure 的場景適用。
- **GCP Professional Cloud Security Engineer**（$200）：用 Vertex AI 才需要優先考慮。

### 3. 管理治理

給要帶團隊、做合規、面對董事會的人。

- **CISSP**（$749）：資安界的金字招牌。依 [Training Camp 2026 分析](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026)，首次通過率的可信估計為 50–60%（網路上流傳的 20% 無可溯源）。台灣持證者不多：依[吳文智整理的 ISC2 分國統計](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf)，2022 年 1 月為 465 人，之後的分國數字未見公開來源。門檻：5 年跨 2 域經驗，學位可折 1 年。
- **CISM**（$575–$760）：偏資安管理——治理、風險、事件管理。需 5 年資安管理經驗。
- **CRISC**（$575–$760）：IT 風險控制路線，偏稽核。

### 4. 攻防實戰

紅隊、滲透測試、漏洞獵人的路線。

- **OSCP**（$1,749 含課程 + lab）：23 小時 45 分鐘實戰考試，另有 24 小時交報告；通過後取得終身有效的 OSCP 與 3 年效期的 OSCP+。技術圈含金量最高，但投入巨大。
- **CEH v13**（$950–$1,199）：知名度高但業界評價兩極。注意：依 [ISC2 2026/4/1 生效的折抵清單](https://www.isc2.org/Insights/2026/05/CISSP-Experiene-Waiver-Updates)，CEH 已不在 CISSP 經驗折抵清單內（同時被移除的還有 CISA、CRISC、OSCP）。

### 5. 應用安全

你寫的程式碼本身要安全。

- **CSSLP**（$599）：涵蓋安全需求、安全設計、安全編碼、測試、部署全生命週期。門檻 4 年軟體開發安全經驗。對 AI Agent 平台的 SDLC 直接相關。

### 6. AI 安全（2025–2026 新興）

**這是爆發中的戰場。** 18 個月內 10+ 張全新證照上市，市場尚未收斂出業界標準。

| 證照 | 費用 | 上線日 | 考試格式 | 定位 |
|---|---|---|---|---|
| **CompTIA SecAI+** | $298（上線時 $359） | 2026/02 | 60 題 / 60 分鐘 | 中階擴充，疊在 Security+ 上 |
| **CAISP** | $1,099 全包 | 2024 下半年 | 6h 實戰 + 24h 報告 | 實作攻防，OWASP LLM Top 10 |
| **GIAC GAIPS** | ~$999 考 / ~$9K 含課 | 2026/07 | CyberLive 實作 | 防禦側 GenAI/LLM 平台安全 |
| **ISACA AAISM** | $459–$599 | 2025/08 | 90 題 / 150 分鐘 | 治理管理層（需 CISM 或 CISSP） |
| **GIAC GASAE** | $999 考 | 2026/04 | 82 題 / 3 小時 CyberLive | 紅藍紫隊 AI 自動化 |
| **EC-Council COASP** | 官方課程 $1,699 起 | 2026/02 | 70 題 / 6 小時（含實作題） | 攻擊側：AI 紅隊，恆逸有實體班 |
| **OffSec OSAI+** | $1,749（含課程） | 2026/03 | 24h 實作 | 攻擊側：進階 AI 紅隊 |
| **HTB COAE** | 訂閱制 | 2026/04 | 7 天實作 + 報告 | 攻擊側：偏對抗性機器學習 |
| **GIAC GOAA** | $999 考 | 已上線 | 56 題 / 2 小時 CyberLive | 把 AI 當攻擊工具（不是攻擊 AI） |
| **ISACA AAIR** | $459–$599 | 2026/04 | 90 題 / 150 分鐘 | AI 風險（需 CRISC 等指定證照） |
| **ISC2（名稱未定）** | TBA | 預計 2026 年底 pilot | TBA | 開發中，2027 年前不會正式上線 |

依 [Practical DevSecOps 市場分析](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)引用的 Cisco AI Workforce Consortium 數據，2025/10 至 2026/3 之間有 28.5% 的資安職缺要求 AI 技能，前一年同期是 14.2%。

攻擊側四張（COASP、OSAI+、HTB COAE、GOAA）的細節與選法見[第二篇](/posts/tech/2026-09-10-ai-security-cert-showdown)。

## 總覽比較表

一張表看全貌。費用為考試報名費（USD），不含培訓教材。

| 證照 | 費用 | 難度 | 經驗門檻 | 效期 | 台灣認可 | AI/SaaS 相關 |
|---|---|---|---|---|---|---|
| ISC2 CC | $199 | ⭐ | 無 | 3 年 | 中 | 低 |
| Security+ | $439 | ⭐⭐ | 無 | 3 年 | 高 | 中 |
| SecAI+ | $298 | ⭐⭐ | 建議 2 年資安 | 3 年 | 中（新） | 高 |
| SC-500（取代 AZ-500） | $165 | ⭐⭐ | 無 | 見官方 | 中高 | 中 |
| GCP Cloud Security Engineer | $200 | ⭐⭐⭐ | 無（建議 3 年） | 見官方 | 中 | 中 |
| AWS Security | $300 | ⭐⭐⭐ | 建議 5 年 IT | 3 年 | 高 | 最高 |
| CAISP | $1,099 | ⭐⭐⭐ | 無 | 終身 | 低（新） | 最高 |
| CSSLP | $599 | ⭐⭐⭐ | 4 年 | 3 年 | 中 | 高 |
| CEH v13 | $950+ | ⭐⭐⭐ | 2 年或官訓 | 3 年 | 中 | 低 |
| GAIPS | $999 | ⭐⭐⭐⭐ | 無 | 4 年 | 低（新） | 最高 |
| GASAE | $999 | ⭐⭐⭐⭐ | 無 | 4 年 | 低（新） | 高 |
| GOAA | $999 | ⭐⭐⭐ | 無 | 4 年 | 低（新） | 低 |
| COASP | 課程 $1,699 起 | ⭐⭐⭐ | 無 | 見官方 | 低（新，恆逸有班） | 高 |
| HTB COAE | 訂閱制 | ⭐⭐⭐⭐⭐ | 須修完 AI Red Teamer 路徑 | 見官方 | 低（新） | 高 |
| OSAI+ | $1,749 | ⭐⭐⭐⭐⭐ | 無（建議扎實資安基礎） | OSAI 終身 / OSAI+ 3 年 | 低（新，恆逸有班） | 高 |
| CISM | $575+ | ⭐⭐⭐⭐ | 5 年管理 | 3 年 | 高 | 中 |
| CRISC | $575+ | ⭐⭐⭐⭐ | 3 年 | 3 年 | 中 | 低 |
| AAISM | $459+ | ⭐⭐⭐ | 需 CISM/CISSP | 3 年 | 低（新） | 高 |
| AAIR | $459+ | ⭐⭐⭐ | 需 CRISC 等指定證照 | 見官方 | 低（新） | 中 |
| CISSP | $749 | ⭐⭐⭐⭐⭐ | 5 年 | 3 年 | 最高 | 高 |
| CCSP | $599 | ⭐⭐⭐⭐ | 5 年（含 3 年資安） | 3 年 | 高 | 中 |
| OSCP | $1,749 | ⭐⭐⭐⭐⭐ | 建議 2 年 | 終身 | 高（技術圈） | 中 |

## 台灣法規脈絡速覽

你不一定需要為了法規去考，但了解推力在哪有助於判斷哪些證照「市場真的在要」。

**資安法 2.0**（2025/8/29 三讀，2025/12/1 施行，子法於 2026/1 修正發布）：特定非公務機關須設資安長與專職人員，罰則上限提高至 NT$1,000 萬。但**無強制指定證照**，只要求定期專業訓練。

**金管會資安人力分級與證交所管控指引**：這是兩份文件。有強制力的是金管會 2021 年底的函令，依[證交所的宣導簡報](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf)，上市櫃公司分三級，第一級（資本額 ≥NT$100 億或臺灣 50 成分股等）須設資安長與資安專責單位，單位內配置專責主管及至少 2 名專責人員。證交所與櫃買中心另外發布的[《上市上櫃公司資通安全管控指引》](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf)屬參考性質，本文沒有提到任何證照，只要求資安主管與人員每年接受專業課程訓練；證期局的內控處理準則問答集提到公司可「要求取得相關之資通安全職能證照」，但沒有指定哪一張。常聽到的 CISSP、CISM、中級資訊安全工程師，是 ICSDA 等民間單位的實務建議。

**實際徵才怎麼寫**：[華南銀行 2026/09 的 104 職缺](https://www.104.com.tw/job/7o6p3)直接列出認可清單——CISSP、CISM、CompTIA Security+、AWS Certified Security – Specialty、CEH、CCSP、CSSLP。這是台灣金融業的真實需求快照。

薪資方面，[CloudInsight 的資安工程師指南](https://cloudinsight.cc/zh/blog/security-engineer-guide)引用 104 薪資情報（2026/9/28 更新、有效樣本 543）：資安工程師 5–10 年資歷的月薪 P25–P75 為 NT$51,000–74,000，10 年以上為 NT$51,000–87,000，資安主管與 CISO 不在這個統計內。該文對證照的說法是：CISSP、OSCP 是談薪的加分項，但沒有實務經驗、光靠證照，對薪資的幫助有限。

## 決策樹：三階段路線圖

如果你是非資安專職的軟體開發者，特別是做 AI/SaaS 產品：

```
Phase 1（打基礎 + 雲端深化）
├── CompTIA Security+ ($439)
│   無門檻、台灣認可度高、可折抵 CISSP 1 年經驗
│   準備：2–3 個月自學
│
└── AWS Security Specialty ($150–$300)
    與日常工作完全對齊（IAM、KMS、VPC、Bedrock）
    準備：2–3 個月，趁 AIF-C01 知識餘熱

Phase 2（AI 安全專門化）
├── 首選：CompTIA SecAI+ ($298)
│   性價比最高、vendor-neutral、疊在 Security+ 上
│   40% 考域 = Securing AI Systems
│
├── 或：CAISP ($1,099 全包)
│   實作最強、6h 實戰考、OWASP LLM Top 10 完整覆蓋
│   多位考生 review 一致 9/10（見後續篇章詳評）
│
└── 觀望：ISC2 AI 安全證照（開發中）、GIAC GAIPS（$999/$9K）

Phase 3（長期王牌）
└── CISSP ($749)
    台灣最高認可度，持證者少
    Security+ 可折 1 年經驗
    可先通過考試成為 Associate of ISC2，再累積經驗
```

### 費用估算

| 階段 | 證照 | 考試費 | 備考材料（估） | 小計 |
|---|---|---|---|---|
| Phase 1 | Security+ | $439 | ~$30 | ~$469 |
| Phase 1 | AWS Security | $150–$300 | ~$30 | ~$180–$330 |
| Phase 2 | SecAI+ | $298 | ~$30 | ~$328 |
| Phase 3 | CISSP | $749 | ~$50 | ~$799 |
| **合計** | | | | **~$1,776–$1,926** |

走 CAISP 路線的話，Phase 2 改為 ~$1,099（已含教材和 lab），總計 ~$2,547–$2,697。

## 備考資源速覽

每張證照的準備生態差異很大。這裡列出最常見的路徑，細節在系列第四篇展開。

### 第三方線上課程

2026/10/18–19 逐項查過。Udemy 價格是匿名訪客在 Udemy 頁面上看到的標價，常態打折且依地區、時間變動，實際成交價可能更低；沒查到的項目會明確標示。下單前以頁面為準。

| 證照 | 平台 | 價格 | 備註 |
|---|---|---|---|
| Security+ | Udemy（[Jason Dion](https://www.udemy.com/course/securityplus)、[Total Seminars／Mike Meyers](https://www.udemy.com/course/total-comptia-security-plus)） | Jason Dion 課程標價 $119.99、Mike Meyers 課程 $24.99；Dion 的 Security+ 模擬考 Set 1 另售 $64.99 | Jason Dion 課程約 31 小時、附一套完整模擬考，評分 4.7。Professor Messer 的課在[他自己的網站](https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/)免費；沒查到他在 Udemy 上架，原文「Udemy（Professor Messer）」的寫法已移除 |
| AWS Security | Udemy（[Stephane Maarek SCS-C03](https://www.udemy.com/course/ultimate-aws-certified-security-specialty/)）、AWS Skill Builder | Udemy 主題頁（2026/7）曾顯示課程特價 $17.99（原價 $119.99）、練習題 $14.99（原價 $64.99）；2026/10 重查時課程頁沒顯示價格，現價以頁面為準 | Maarek 課程約 17 小時、以投影片為主、不含模擬考，課程頁要求先有 Solutions Architect Associate 程度。原文提到的 Neal Davis 課程沒查到 |
| CISSP | [LinkedIn Learning（Mike Chapple）](https://www.linkedin.com/learning/isc2-certified-information-systems-security-professional-cissp-2024-cert-prep)、Udemy（Jason Dion、Thor Pedersen）、[Destination Certification](https://destcert.com/cissp)、[Training Camp](https://trainingcamp.com/training/cissp-certification-bootcamp/) | LinkedIn Learning 第三方來源報價不一（$29.99–$39.99／月，年繳約 $239.88），沒查到官方現價；Udemy 上 Jason Dion 的 CISSP 完整課程標價 $99.99（39 小時，另有 6 套模擬考 $64.99），Thor Pedersen 的題庫課每門約 $59.99–$79.99、分領域影片課約 $94.99–$139.99；DestCert 5 天線上 bootcamp $2,697；Training Camp 6 天直播班頁面不公開價格，需詢價 | Chapple 課程為 2024 年版、約 21 小時半、只有影片；Thor 在 Udemy 同時有題庫課與分領域影片課，但依他自己的網站說明，Udemy 上不是全部內容（不含閃卡等），完整合集在他的網站；Reddit r/cissp 社群活躍度最高 |
| SecAI+ | [Infosec Institute Boot Camp](https://www.infosecinstitute.com/courses/comptia-secai-plus-boot-camp/)、Udemy（多位講師，2026 年新課） | Infosec 3 天營 $2,699（含考試券）；Udemy 上的 SecAI+ 課程標價約 $19.99（個別講師，如 Mana Dowlatshahi Yeganeh 的題庫課），其他課程沒逐一查價 | 2026/02 才上線，Udemy 上的課評價數還少（多數不到 500 則） |
| CAISP | Practical DevSecOps 官方（唯一來源） | $1,099 全包 | 含 60 天 lab、影片、PDF、24/7 Mattermost 支援、1 次考試 |
| GAIPS | SANS SEC545（唯一來源） | ~$9,000 含課 / ~$999 單考 | CyberLive 實作考，2026/07 才開放一般購買 |

### 國外原廠與平台的線上課程

不用出國、不用進教室，這幾條路都能在家上國外課程（價格為 2026/10 查到的公開價，會變動，下單前以官方頁為準）：

| 證照 | 課程 | 價格／條件 | 備註 |
|---|---|---|---|
| Security+ | [Professor Messer 免費完整課程](https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/) | 免費 | SY0-701，121 支影片、約 15 小時；講義 PDF 另售 |
| Security+ | [CompTIA CertMaster Learn](https://www.comptia.org/en-us/resources/certmaster-training/learn/) | 通路公開標價約 $450–$600，12 個月存取 | 原廠自學課程，含影片、實作題與練習題；可與考試券組合購買 |
| Security+ | [Google Cybersecurity Certificate（Coursera）](https://www.coursera.org/professional-certificates/google-cybersecurity) | 美加地區 $49／月，官方估多數人少於 $300 | 8 門課、少於 6 個月；結業後可用折扣價買 Security+ 考試與課程；偏 SOC 分析入門，不等於 Security+ 考綱 |
| CISSP | [ISC2 官方線上自學課程](https://www.isc2.org/training/online-self-paced/cissp-online-self-paced) | 官方商店標價 $995（180 天存取） | 自適應學習、官方電子書、400+ 練習題；首次沒過可免費再上一次課（限一年內） |
| CC（ISC2 入門證照） | [ISC2 CC 免費計畫公告](https://www.isc2.org/landing/1mcc) | 免費計畫已於 2026/5/20 停收新報名；CC 考試費 $199 | 已拿到考試碼的人須在 2026/12/31 前考完 |
| AWS Security | [AWS Skill Builder](https://aws.amazon.com/training/digital/) | 免費層含標準備考課與官方練習題組；個人訂閱 $29／月或 $449／年 | 訂閱才有 Builder Labs、加強版備考課與官方模擬考 |
| SC-900（微軟資安入門） | [Microsoft Learn 學習路徑](https://learn.microsoft.com/en-us/training/paths/describe-concepts-of-security-compliance-identity/) | 免費 | 入門級，不是進階資安證照 |

整體來說：Security+ 和 AWS Security 有品質夠好的免費或低價線上資源，CISSP 的原廠線上課程偏貴，多數人會改用 Udemy 或社群資源加官方樣題。

### 台灣在地培訓

| 機構 | 主要課程 | 特色 |
|---|---|---|
| [恆逸教育訓練中心](https://www.uuu.com.tw/Course/Show/47/CISSP) | CISSP、CCSP、CSSLP、Security+、[SecAI+](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-)、CEH、CPENT、[COASP AI 資安專家](https://www.uuu.com.tw/Course/Show/3332/COASP) | EC-Council / CompTIA / ISC2 三家授權，課程最齊全，台灣唯一同時開 SecAI+ 和 COASP 實體班 |
| [全智網科技 AI Network](https://ainetwork-training.com/) | CISSP、CCSP、Security+、SecAI+ | ISC2 / Cisco / CompTIA / Palo Alto 官方授權，台北實體，附 2 天總複習班 |
| [WUSON 吳文智老師](https://wentzwu.com/courses) | CISSP 專精 | 台灣唯一 CISSP 進階認證大滿貫（ISSAP + ISSEP + ISSMP），每月開班長期額滿，有志工教練團考前輔導 |
| [DEVCORE](https://netmag.tw/2024/07/19/devcore-bring-global-security-training-agency-offsec-introduces-factory-instructor-physical-course-to-alive-taiwan-security-talent) | OSCP+、OSEP、OSWE | 2024 年與 OffSec 合作，開出台灣首個原廠講師實體課程（當年為 OSCP、OSWA、OSDA、OSEE）；[2026 年](https://training.devco.re/2026)以 DEVCORE 講師中文授課為主 |
| 巨匠電腦 | Security+、iPAS 資訊安全工程師初級 | 全台連鎖、入門導向 |

### 考試地點（台灣）

- **Pearson VUE 考場**：ISC2（CISSP、CCSP）在台灣有兩處可考，台北信義區聯合世紀大樓 12F-3 的 Pearson 直營考場，以及高雄苓雅區亞太財經廣場 4F-1 的[恆逸授權考場](https://www.uuu.com.tw/TestCenter/Info)。CompTIA（Security+、SecAI+）另可在恆逸各地中心與巨匠等授權考場應試
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
| CCSP / CISM / CRISC | 經驗門檻 3–5 年（CCSP 5 年 IT 含 3 年資安、CISM 5 年資安管理、CRISC 3 年），更適合資安專職 |

## 系列導覽

這是「資安證照攻略」系列的第一篇。後續：

- **第二篇**：AI 安全證照橫評——SecAI+ vs CAISP vs GAIPS vs AAISM，誰真的教你防 prompt injection
- **第三篇**：Security+ → AWS Security → CISSP 的 ROI 拆解——準備時間、通過率、維護成本實證
- **第四篇**：台灣資安證照生態——法規細節、在地培訓機構、備考資源與考場資訊

## 更新紀錄

- 2026-10-18：備考資源新增「國外原廠與平台的線上課程」表，補上 Professor Messer、CertMaster Learn、Google Cybersecurity Certificate、ISC2 CISSP 線上自學、AWS Skill Builder、Microsoft Learn 的價格與條件；原「線上課程」表改為「第三方線上課程」並逐項重查：移除「Udemy 上有 Professor Messer」與未查到的 Neal Davis，原本籠統的 $15–$30、$28–$120、$30–$3,000+ 區間改成有來源的個別價格，查不到現價的明確標示。10-19 再用 Udemy 頁面補查：Jason Dion Security+ 課程標價 $119.99（先前引用第三方評測的「特價多在 $20 以下」沒有 Udemy 頁面佐證，已移除）、Mike Meyers $24.99、Jason Dion CISSP 課程 $99.99、Thor Pedersen 題庫課與分領域課的價格；Maarek 課程頁本次沒顯示價格，維持 7 月的特價快照並註明。
- 2026-10-12：SecAI+ 考試費由 $359 改為現行的 $298，費用估算重算；CAISP 改為現價 $1,099、GASAE 改為 $999；Security+ 通過率與台灣薪資兩段原本引用的數字，來源頁已改版不再支持，改寫為來源現在的說法；台灣 CISSP 人數改為有年份的統計；資安法補上施行日；修正 CEH 折抵清單的來源連結與 AI 職缺比例的敘述；總覽表補上 GCP、CRISC、GASAE、GOAA、COASP、HTB COAE、OSAI+、AAIR；證照數由 16 張更正為 22 張。法規一段更正：人力分級出自金管會函令，管控指引是證交所與櫃買中心發布的參考文件，指引本文沒有建議任何證照；考場說明改為依發證機構區分；DEVCORE、全智網、巨匠的課程依官網現況更新；CAISP 上線時間改為 2024 下半年；OSCP 補上報告時間與 OSCP+ 效期。
- 2026-10-08：AI 安全分類補上 COASP、OSAI+、HTB COAE、GOAA、AAIR；AZ-500 已退役，改為 SC-500；更正 ISC2 的進度（原文「CCAI pilot 2025 Q4」有誤）；Security+ 考試費改用 2026/6 調價後的 $439，費用估算隨之重算。

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
- [SecuSpark — Security+ Pass Rate 2026: Why There Is No Official Number](https://www.secuspark.com/blog/security-plus-pass-rate-statistics)
- [Training Camp — CISSP Pass Rate 2026](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026)
- [Pruvos — AWS SCS-C03 Practice Tests](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03)
- [CyberSecJobs — Best Cybersecurity Certifications 2026](https://cybersecjobs.com/best-cybersecurity-certifications)
- [CloudInsight — 資安工程師完整指南 2026](https://cloudinsight.cc/zh/blog/security-engineer-guide)
- [ICSDA — 上市櫃資通安全管控指引問答](https://icsda.org.tw/)
- [SSDLC by 飛飛 — 台灣法規遵循指南](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc)
- [Practical DevSecOps — AI Security Certification 比較](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)
- [EC-Council COASP](https://iclass.eccouncil.org/our-courses/certified-offensive-ai-security-professional)
- [OffSec AI-300（OSAI+）](https://www.offsec.com/courses/ai-300/)
- [Hack The Box COAE](https://academy.hackthebox.com/preview/certifications/htb-certified-offensive-ai-expert)
- [GIAC GOAA](https://www.giac.org/certifications/offensive-ai-analyst-goaa)
- [ISACA AAIR](https://www.isaca.org/credentialing/aair)
- [Microsoft SC-500（Cloud and AI Security Engineer Associate）](https://learn.microsoft.com/en-us/credentials/certifications/cloud-and-ai-security-engineer-associate/)
- [Microsoft — AZ-500 退役公告](https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/)
- [ISC2 — CISSP Experience Waiver Updates](https://www.isc2.org/Insights/2026/05/CISSP-Experiene-Waiver-Updates)
- [ISC2 — CISSP Experience Requirements](https://www.isc2.org/certifications/cissp/cissp-experience-requirements)
- [Wentz Wu — CISSP by Countries（ISC2 member counts，2022/1/1）](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf)
- [GIAC — Certification Pricing and Fees](https://www.giac.org/pricing)
- [證交所 — 上市公司資通安全宣導（資安人力分級）](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf)
- [證交所／櫃買中心 — 上市上櫃公司資通安全管控指引（113.9 修正）](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf)
- [證交所資安專區（含內控處理準則問答集）](https://dsp.twse.com.tw/informationSecurity/list)
- [恆逸 — 考試中心資訊](https://www.uuu.com.tw/TestCenter/Info)
- [DEVCORE Training 2026](https://training.devco.re/2026)
- [OffSec — OSCP+ Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- [GIAC GASAE](https://www.giac.org/certifications/ai-security-automation-engineer-gasae)
- [ISACA — Earn a CRISC Certification](https://www.isaca.org/credentialing/crisc/get-crisc-certified)
- [Google Cloud — Professional Cloud Security Engineer](https://cloud.google.com/learn/certification/cloud-security-engineer)
- [理律法律事務所 — 總統公布修正資通安全管理法](https://www.leeandli.com/TW/NewslettersDetail/7505.htm)
- [暨南大學計網中心 — 資通安全管理法自 114/12/1 施行](https://cc.ncnu.edu.tw/p/406-1001-31660,r471.php?Lang=zh-tw)
- [恆逸 — CompTIA SecAI+ 課程（贈考試價值 USD 298）](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-)
- [Professor Messer — SY0-701 Security+ 免費課程](https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/)
- [CompTIA — CertMaster Learn](https://www.comptia.org/en-us/resources/certmaster-training/learn/)
- [Coursera — Google Cybersecurity Professional Certificate](https://www.coursera.org/professional-certificates/google-cybersecurity)
- [ISC2 — CISSP Online Self-Paced Training](https://www.isc2.org/training/online-self-paced/cissp-online-self-paced)
- [ISC2 — One Million Certified in Cybersecurity（已結束）](https://www.isc2.org/landing/1mcc)
- [AWS Skill Builder](https://aws.amazon.com/training/digital/)
- [Microsoft Learn — SC-900 學習路徑](https://learn.microsoft.com/en-us/training/paths/describe-concepts-of-security-compliance-identity/)
