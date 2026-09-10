---
title: "台灣資安證照生態——法規、培訓機構、備考資源與考場全攻略"
date: 2026-09-10
category: tech
type: guide
tags: [cybersecurity, certification, taiwan, career, cissp, comptia, training]
lang: zh-TW
tldr: "台灣資安法 2.0 已三讀、金管會三級制度到位，但都不強制指定證照——真正的需求來自徵才市場。台灣有 7+ 家培訓機構可選：恆逸課程最齊全（唯一同開 SecAI+ 和 COASP）、WUSON 吳文智是 CISSP 圈的傳奇（月月額滿）、DEVCORE 獨家引進 OffSec 原廠講師。考場在台北信義區和高雄，多數證照也支援在家線上監考。"
description: "台灣資安證照生態的完整指南：資安法 2.0 與金管會管控指引的實際影響、7 家培訓機構比較、考場位置、iPAS 在地證照、備考資源與免費起步路徑。"
draft: false
series:
  name: "資安證照攻略"
  order: 4
---

> 🌏 [English version](/en/posts/tech/2026-09-10-taiwan-security-cert-ecosystem-en)

前三篇畫了[全景地圖](/posts/tech/2026-09-10-security-cert-landscape)、做了 [AI 安全證照橫評](/posts/tech/2026-09-10-ai-security-cert-showdown)、算了[三大經典證照的 ROI](/posts/tech/2026-09-10-security-cert-roi)。這篇收尾，把台灣特有的脈絡講清楚：法規到底要求什麼、哪裡上課、哪裡考試、有沒有在地替代方案。

## 法規：推力在哪裡

### 資安法 2.0（2025/8/29 三讀，2026 上半年子法施行）

依 [SSDLC by 飛飛的法規分析](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc)，本次是資安法自 2019 年施行以來的首次重大修正：

| 修正重點 | 內容 |
|---|---|
| 主管機關變更 | 行政院 → 數位發展部（資安署執行） |
| 擴大稽核範圍 | 總統府及五院均納入 |
| 特定非公務機關 | 須設**資安長**與**專職人員** |
| 禁用危害國安產品 | 提升至法律位階 |
| 罰則上限 | 未通報：NT$1,000 萬；未改正：NT$500 萬 |
| 委外管理 | 須書面契約載明權利義務 |
| 人員適任性查核 | 專職資安人員須通過查核 |

**對你的影響**：如果你的公司是政府委外廠商、關鍵基礎設施供應商、或上市櫃公司的供應鏈——資安法的要求會間接影響到你。但法規本身**不強制指定任何證照**，只要求：
- 每人每 2 年 ≥3 小時專業訓練
- 每年 ≥3 小時通識教育

### 金管會上市櫃資通安全管控指引

依 [ICSDA 問答整理](https://icsda.org.tw/)，上市櫃公司依規模分三級：

| 級別 | 條件 | 資安人力要求 | 完成時程 |
|---|---|---|---|
| 第一級 | 資本額 ≥NT$100 億或台灣 50 成分股 | 資安長 + 資安專責主管 + ≥2 名專責人員 | 2022 年底 |
| 第二級 | 其餘未連續虧損 | 資安專責主管 + ≥1 名專責人員 | 2023 年底 |
| 第三級 | 連續虧損或每股淨值低於面額 | 鼓勵 ≥1 名 | 無固定 |

指引「建議」的證照：**CISSP、CISM、中級資訊安全工程師**。但同樣不強制。

**真正的推力來自徵才市場**。依 [國泰證券 2025 永續報告](https://www.cathaysec.com.tw/download/2025年永續報告書.pdf)，其 11 名資安專責人員共持有 25 張國際證照，分布：ISO 27701 主導稽核員（20 張）、CEH（6 張）、CompTIA Security+（4 張）、CISM（2 張）、CISSP（1 張）、CCSP（1 張）。[華南銀行 2026/09 的 104 職缺](https://www.104.com.tw/job/7o6p3)則直接列出認可清單：CISSP、CISM、Security+、AWS Security Specialty、CEH、CCSP、CSSLP。

### 金融資安行動方案 2.0

金管會 2022 年推出的金融業專屬框架，對開發者的關鍵要求：

- 核心系統上線前須做安全測試（SAST、DAST、滲透測試）
- 定期弱點掃描與修補
- 電子交易安全：多因素認證、交易簽章
- 資安事件通報：30 分鐘至 24 小時（依嚴重等級）

如果你的 AI Agent 平台服務金融業客戶，這些要求會直接變成你的產品需求。

## 台灣培訓機構完整比較

### 國際證照培訓

| 機構 | 授權 | 主要證照課程 | 特色 | 參考價格帶 |
|---|---|---|---|---|
| [恆逸教育訓練中心](https://www.uuu.com.tw/Course/Show/47/CISSP) | EC-Council / CompTIA / ISC2 | CISSP、CCSP、CSSLP、SSCP、[Security+](https://www.uuu.com.tw/Course/Show/1607/CompTIA-Security-)、[SecAI+](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-)、CySA+、CEH、CPENT、CCT、[COASP AI 資安專家](https://www.uuu.com.tw/Course/Show/3332/COASP)、CCSE | **課程最齊全**——台灣唯一同時開 SecAI+ 和 COASP AI 安全實體班；三大認證機構授權都有 | NT$42,000–$65,000（依證照） |
| [全智網科技 AI Network](https://ainetwork-training.com/) | ISC2 / Cisco / CompTIA / Palo Alto | CISSP、CCSP、CEH、SecAI+、CCNA | 台北實體小班制，CISSP 附 2 天總複習班（市值 NT$20,000）；2026/09 正在推 SecAI+ webinar | NT$32,200+（CISSP 假日班特價） |
| [WUSON 吳文智老師](https://wentzwu.com/courses) | — | **CISSP 專精** | 台灣唯一 CISSP 進階認證大滿貫（ISSAP + ISSEP + ISSMP）；每月開班，2026 全年到 2027 中已排滿且長期額滿；有 WUSON 志工教練團做考前社群輔導；以「WISE 資安基礎架構」教學法著稱 | 請洽官網 |
| [iSpan 資展國際](https://www.ispan.com.tw/CISSP) | — | CISSP 輔導班 | 37 小時實體課，週末班；適合有底子想短期衝刺的人 | 請洽官網 |
| [DEVCORE](https://netmag.tw/2024/07/19/devcore-bring-global-security-training-agency-offsec-introduces-factory-instructor-physical-course-to-alive-taiwan-security-talent) | OffSec 合作 | OSCP、OSWA、OSDA、OSEE | 台灣首家引進 OffSec 原廠講師實體課程；偏攻擊面，適合想走滲透測試的人 | NT$109,000（OSCP，依 [HackMD 整理](https://hackmd.io/@hiiii/ryOzgaf0a)） |
| 巨匠電腦 | CompTIA | Security+、iPAS、基礎資安 | 全台連鎖、入門導向、價格較親民 | NT$10,000–$30,000（估） |

### 金融業法定培訓

| 機構 | 課程 | 特色 |
|---|---|---|
| [台灣金融研訓院](https://www.tabf.org.tw/CourseLegalIntroduce.aspx?a=nlOruBvit%2Fw%3D) | 金融 ISMS 導向管理、第三方供應鏈資安治理、網站攻擊防禦、零信任架構、**AI 金融資安韌性防護**、雲端資安 | 金融業法定資安訓練時數認可，2026 Q4 有 7 門專題（含 AI 資安） |
| 安碁學苑 ACAD | 資安通識、技術、證照、職能、客製化 | 數位線上 + 實體，偏企業培訓導向 |

### 怎麼選

| 你的目標 | 推薦機構 | 原因 |
|---|---|---|
| CISSP 一次考過 | **WUSON 吳文智** 或 **恆逸** | WUSON 是台灣 CISSP 圈公認最強講師，但要提早搶位；恆逸有 ISC2 原廠教材 + 總複習班 |
| Security+ 入門 | **恆逸** 或 **全智網** | 兩家都有 CompTIA 授權，全智網小班制 |
| AI 安全證照（SecAI+ / COASP） | **恆逸** | 台灣唯一同時開兩種 AI 安全認證實體班 |
| OSCP 攻擊面 | **DEVCORE** | OffSec 原廠講師，台灣獨家 |
| 預算有限、純入門 | **巨匠** 或自學 | iPAS + Security+ 的自學路線最省錢 |
| 金融業法定時數 | **台灣金融研訓院** | 法定認可，含 AI 資安專題 |

## iPAS 資訊安全工程師——台灣在地證照

國際證照之外，台灣有自己的認證體系：

| 項目 | 初級 | 中級 |
|---|---|---|
| 發照單位 | 經濟部產業發展署 | 經濟部產業發展署 |
| 費用 | ~NT$1,600（兩科） | ~NT$2,400（兩科） |
| 考試語言 | **繁體中文** | **繁體中文** |
| 考試科目 | 資訊安全管理概論、資訊安全技術概論 | 資訊安全規劃實務、資訊安全防護實務 |
| 效期 | **永久有效** | 5 年（48 小時訓練時數換發） |
| 法規認可 | 數位發展部資安署認可 | 數位發展部資安署認可、NCC 規範測試工程師資格之一 |

依 [HackMD iPAS 討論區](https://hackmd.io/@hiiii/ryOzgaf0a)整理，iPAS 中級的定位：

- **優勢**：繁體中文考試、費用極低（NT$2,400 vs CISSP 的 US$749）、有法規在地化內容、政府標案加分
- **限制**：國際認可度低，出了台灣基本沒用
- **適合**：台灣求職新手、在校生、轉職者；想進政府標案或公務體系

**iPAS vs Security+**：想在台灣本土市場求職且預算有限 → iPAS 先考；想要國際認可度或進外商 → Security+ 更有價值。兩張不衝突，可以都考。

## 考場與考試方式

### Pearson VUE 實體考場

| 地點 | 地址 | 電話 | 適用證照 |
|---|---|---|---|
| **台北** | 信義區基隆路一段 163 號 12 樓之 3（聯合世紀大樓） | (02) 2756-7808 | CISSP、CCSP、Security+、SecAI+、CEH、CISM 等 |
| **高雄** | 苓雅區新光路 38 號 4 樓之 1（亞太財經廣場） | (07) 536-1199 | 同上 |

依 [全智網 CISSP 課程頁](https://ainetwork-training.com/courses/cissp)，考試採隨報隨考，但座位有限，建議提早預約。

### 線上監考（OnVUE / PSI）

| 方式 | 適用證照 | 要求 |
|---|---|---|
| **Pearson OnVUE** | Security+、SecAI+、CISSP（部分場次） | 獨立房間、穩定網路、攝影鏡頭、全程英文溝通 |
| **AWS PSI** | AWS Security Specialty、AWS AIF-C01 | 同上 |
| **Practical DevSecOps** | CAISP | 完全線上，6h 實作 + 24h 報告，無監考環境要求 |

**在家考的注意事項**：
- 桌面要清空、房間不能有其他人
- 網路斷線可能導致考試中止（建議有線連接）
- 有些監考員會要求你用鏡頭掃描整個房間
- CISSP 的 CAT 格式在線上監考時體驗跟實體一樣

### 考試語言

| 證照 | 可選語言 | 備註 |
|---|---|---|
| CISSP | 英文（CAT 3 小時）、簡體中文 / 日文 / 韓文等（線性 6 小時 250 題） | 依 [KnowledgeHut 指南](https://www.knowledgehut.com/blog/security/cissp-exam-preparation)，非英文版是線性考試（固定 250 題 / 6 小時），不是 CAT |
| Security+ | 英文、日文、葡萄牙文 | 無繁體中文 |
| SecAI+ | 英文 | 2026/02 才上線，暫時只有英文 |
| AWS Security | 英文、韓文、簡體中文、日文 | 無繁體中文 |
| CEH | 英文 | — |
| CAISP | 英文 | 報告也用英文撰寫 |
| iPAS | **繁體中文** | 台灣在地唯一中文選項 |

## 薪資與市場需求

### 薪資行情

依 [CloudInsight 2026 資安工程師指南](https://cloudinsight.cc/zh/blog/security-engineer-guide)：

| 年資 | 月薪 (NTD) | 年薪估算 | 證照影響 |
|---|---|---|---|
| 0–2 年 | 40,000–55,000 | 52–72 萬 | iPAS / Security+ 有加分 |
| 3–5 年 | 55,000–80,000 | 72–104 萬 | CEH / AWS Security 明顯加分 |
| 5–8 年 | 80,000–120,000 | 104–156 萬 | CISSP / OSCP 可多 10–20% |
| 8 年以上 | 120,000–200,000+ | 156–260 萬+ | CISSP 幾乎是標配 |

- **金融業**薪資最高，科技業次之
- **外商**比本土高 20–50%
- 台灣 CISSP 持證者僅約 500 人，稀缺性極高

### 產業需求趨勢

依 [數位時代報導](https://security.uuu.com.tw)（恆逸資安課程首頁引用），台灣遭駭次數全球之冠，金融業重砸 2–3 倍薪水挖角資安人才。全球缺少 343 萬資安人才，其中雲端安全與資安分析職務需求最高。

## 免費起步路線

還沒決定要不要花錢？先用零成本資源試水溫：

### 通識層

1. **OWASP Top 10 for LLM Applications 2025**：[免費閱讀](https://owasp.org/www-project-top-10-for-large-language-model-applications/)——做 AI 平台的人必讀，不管考不考證照
2. **數位發展部資安署認可證照清單**：了解哪些證照在台灣法規框架下被認可

### Security+ 備考

1. [Professor Messer YouTube 全課程](https://www.youtube.com/@professormesser)：免費、完整、品質極高
2. CompTIA 官方樣題
3. Reddit r/CompTIA 社群

### AWS Security 備考

1. [AWS Skill Builder 免費學習路徑](https://skillbuilder.aws/)
2. [Digital Cloud Training 免費 PDF cheat sheets](https://digitalcloud.training/aws-security-specialty-resources-udemy)
3. AWS 官方白皮書（Security Best Practices、Well-Architected Security Pillar）

### CISSP 備考

1. ISC2 官方樣題
2. [Reddit r/cissp](https://www.reddit.com/r/cissp/) 每日討論串——活躍度極高，很多台灣考生分享
3. Discord 學習群
4. CISSP 用兩套 AI 幫出練習題（[恆逸有文章介紹](https://security.uuu.com.tw)）

### AI 安全入門

1. [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
2. [OWASP Top 10 for Agentic Applications 2026](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
3. Practical DevSecOps 部落格的免費比較文章

## 整體來說

台灣的資安證照生態有三個特色：

1. **法規推但不指定**：資安法 2.0 和金管會管控指引都要求設置資安人員和定期訓練，但不強制指定哪張證照。真正的需求來自徵才市場——看 104 的職缺描述比看法規條文更準。

2. **培訓資源比想像的豐富**：恆逸的課程齊全度在亞洲可能也數一數二（同時有 ISC2、CompTIA、EC-Council 三家授權加上 AI 安全新課），WUSON 吳文智的 CISSP 班是台灣圈內公認的傳奇。不是只有自學一條路。

3. **iPAS 是被低估的起點**：NT$2,400、繁體中文、政府標案加分。如果你完全沒有資安背景，從 iPAS 中級開始建立信心，再攻 Security+ 進入國際體系，是一條務實的路線。

這是「資安證照攻略」系列的最後一篇。回顧整個系列：

- [第一篇：全景地圖](/posts/tech/2026-09-10-security-cert-landscape)——16 張證照的分類框架與三階段路線圖
- [第二篇：AI 安全證照橫評](/posts/tech/2026-09-10-ai-security-cert-showdown)——SecAI+ vs CAISP vs GAIPS vs AAISM
- [第三篇：ROI 拆解](/posts/tech/2026-09-10-security-cert-roi)——Security+ → AWS Security → CISSP 的投資報酬
- **第四篇（本篇）**：台灣生態——法規、培訓、考場、在地資源

## 參考資料

- [SSDLC by 飛飛 — 台灣法規遵循指南](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc)
- [ICSDA — 上市櫃資通安全管控指引問答](https://icsda.org.tw/)
- [國泰證券 2025 永續報告](https://www.cathaysec.com.tw/download/2025年永續報告書.pdf)
- [華南銀行 104 職缺（2026/09）](https://www.104.com.tw/job/7o6p3)
- [恆逸教育訓練中心 — CISSP](https://www.uuu.com.tw/Course/Show/47/CISSP)
- [恆逸 — SecAI+ 國際 AI 資安認證班](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-)
- [恆逸 — COASP AI 資安專家認證](https://www.uuu.com.tw/Course/Show/3332/COASP)
- [恆逸 — Security+](https://www.uuu.com.tw/Course/Show/1607/CompTIA-Security-)
- [恆逸 — CCSP](https://www.uuu.com.tw/Course/Show/1146/CCSP)
- [恆逸資安課程首頁](https://security.uuu.com.tw)
- [全智網科技 AI Network](https://ainetwork-training.com/)
- [全智網 — CISSP 課程](https://ainetwork-training.com/courses/cissp)
- [WUSON 吳文智 — CISSP 課程](https://wentzwu.com/courses)
- [iSpan 資展國際 — CISSP 輔導班](https://www.ispan.com.tw/CISSP)
- [DEVCORE × OffSec 合作報導](https://netmag.tw/2024/07/19/devcore-bring-global-security-training-agency-offsec-introduces-factory-instructor-physical-course-to-alive-taiwan-security-talent)
- [台灣金融研訓院 — 資訊安全人員法定課程](https://www.tabf.org.tw/CourseLegalIntroduce.aspx?a=nlOruBvit%2Fw%3D)
- [HackMD iPAS 資安證照討論區](https://hackmd.io/@hiiii/ryOzgaf0a)
- [CloudInsight — 資安工程師完整指南 2026](https://cloudinsight.cc/zh/blog/security-engineer-guide)
- [CloudInsight — 資安證照完整攻略](https://cloudinsight.cc/zh/blog/security-certifications)
- [KnowledgeHut — CISSP Exam Preparation Guide 2026](https://www.knowledgehut.com/blog/security/cissp-exam-preparation)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Professor Messer YouTube](https://www.youtube.com/@professormesser)
- [AWS Skill Builder](https://skillbuilder.aws/)
- [Digital Cloud Training — AWS Security Specialty 免費資源](https://digitalcloud.training/aws-security-specialty-resources-udemy)
