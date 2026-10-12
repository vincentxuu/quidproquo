---
title: "台灣資安證照生態——法規、培訓機構、備考資源與考場全攻略"
date: 2026-09-10
category: tech
type: guide
tags: [cybersecurity, certification, taiwan, career, cissp, comptia, training]
lang: zh-TW
tldr: "台灣資安法 2.0 已三讀、金管會三級制度到位，但都不強制指定證照——真正的需求來自徵才市場。台灣有 7+ 家培訓機構可選：恆逸課程最齊全（SecAI+、COASP、OSAI+ 三種 AI 安全實體班都有）、WUSON 吳文智是 CISSP 圈的傳奇（月月額滿）、DEVCORE 是首家引進 OffSec 原廠講師的機構。ISC2 考場在台北信義區和高雄，多數證照也支援在家線上監考。"
description: "台灣資安證照生態的完整指南：資安法 2.0、金管會資安人力分級與證交所管控指引的實際影響、7 家培訓機構比較、考場位置、iPAS 在地證照、備考資源與免費起步路徑。"
draft: false
series:
  name: "資安證照攻略"
  order: 4
---

> 🌏 [English version](/posts/tech/2026-09-10-taiwan-security-cert-ecosystem-en)

前三篇畫了[全景地圖](/posts/tech/2026-09-10-security-cert-landscape)、做了 [AI 安全證照橫評](/posts/tech/2026-09-10-ai-security-cert-showdown)、算了[三大經典證照的 ROI](/posts/tech/2026-09-10-security-cert-roi)。這篇收尾，把台灣特有的脈絡講清楚：法規到底要求什麼、哪裡上課、哪裡考試、有沒有在地替代方案。

## 法規：推力在哪裡

### 資安法 2.0（2025/8/29 三讀，2025/12/1 施行，子法 2026/1 修正發布）

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

### 金管會資安人力分級與證交所管控指引

這裡是兩份文件，常被合稱「金管會指引」。有強制力的是金管會 2021/12/28 的函令（金管證審字第 11003656544 號，依《公開發行公司建立內部控制制度處理準則》第 9 條之 1）。依[證交所的宣導簡報](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf)，上市櫃公司依規模分三級配置資安人力，等級只升不降：

| 級別 | 條件 | 資安人力要求 | 完成時程 |
|---|---|---|---|
| 第一級 | 資本額 ≥NT$100 億或台灣 50 成分股 | 資安長 + 資安專責主管 + ≥2 名專責人員 | 2022 年底 |
| 第二級 | 其餘未連續虧損 | 資安專責主管 + ≥1 名專責人員 | 2023 年底 |
| 第三級 | 連續虧損或每股淨值低於面額 | 鼓勵 ≥1 名 | 無固定 |

另一份是證交所與櫃買中心發布的《上市上櫃公司資通安全管控指引》，共十章，涵蓋政策與組織、風險評估、防護控制、委外管理、事件通報等，屬參考性質，公司可依產業特性與規模適度採行。[指引本文](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf)沒有提到任何證照，只要求資安主管與人員每年接受專業課程訓練。證期局的內控處理準則問答集提到公司可「給予適當之教育訓練或要求取得相關之資通安全職能證照」，但沒有指定哪一張。常聽到的 **CISSP、CISM、中級資訊安全工程師**，是 ICSDA 等民間單位的實務建議，不是指引的要求。

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
| [恆逸教育訓練中心](https://www.uuu.com.tw/Course/Show/47/CISSP) | EC-Council / CompTIA / ISC2 | CISSP、CCSP、CSSLP、SSCP、[Security+](https://www.uuu.com.tw/Course/Show/1607/CompTIA-Security-)、[SecAI+](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-)、CySA+、CEH、CPENT、CCT、[COASP AI 資安專家](https://www.uuu.com.tw/Course/Show/3332/COASP)、[OSAI+](https://www.uuu.com.tw/Course/Show/3408/OSAI)、CCSE | **課程最齊全**——SecAI+、COASP、OSAI+ 三種 AI 安全實體班都有；三大認證機構授權都有 | NT$42,000–$65,000（依證照）；COASP NT$68,000、OSAI+ NT$149,000 |
| [全智網科技 AI Network](https://ainetwork-training.com/) | ISC2 / Cisco / CompTIA / Palo Alto | CISSP、CCSP、Security+、SecAI+、CCNA | 台北實體小班制，CISSP 附 2 天總複習班（市值 NT$20,000）；2026/09 正在推 SecAI+ webinar | NT$36,000（CISSP 假日班早鳥，定價 NT$56,000） |
| [WUSON 吳文智老師](https://wentzwu.com/courses) | — | **CISSP 專精** | 台灣唯一 CISSP 進階認證大滿貫（ISSAP + ISSEP + ISSMP）；每月開班，2026 全年到 2027 中已排滿且長期額滿；有 WUSON 志工教練團做考前社群輔導；以「WISE 資安基礎架構」教學法著稱 | 請洽官網 |
| [iSpan 資展國際](https://www.ispan.com.tw/CISSP) | — | CISSP 輔導班 | 37 小時實體課，週末班；適合有底子想短期衝刺的人 | 請洽官網 |
| [DEVCORE](https://netmag.tw/2024/07/19/devcore-bring-global-security-training-agency-offsec-introduces-factory-instructor-physical-course-to-alive-taiwan-security-talent) | OffSec 合作 | OSCP+、OSEP、OSWE | 2024 年開出台灣首個 OffSec 原廠講師實體課程（當年為 OSCP、OSWA、OSDA、OSEE）；[2026 年](https://training.devco.re/2026)以 DEVCORE 講師中文授課為主；偏攻擊面，適合想走滲透測試的人 | NT$109,000（OSCP，依 [HackMD 整理](https://hackmd.io/@hiiii/ryOzgaf0a)） |
| 巨匠電腦 | CompTIA | Security+、iPAS 資訊安全工程師初級 | 全台連鎖、入門導向；也是 Pearson VUE 合作考場 | 官網未標價 |

### AI 安全證照去哪上課

2026/10 整理。台灣實體班集中在 SecAI+，攻擊側只有恆逸有開；其餘證照目前只查到原廠線上課程。

| 證照 | 台灣實體班 | 原廠線上 / 自學 |
|---|---|---|
| SecAI+ | [恆逸](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-)、[全智網](https://ainetwork-training.com/courses/secai/)（3 天，NT$30,000）、[網安智慧](https://www.nsit.com.tw/course_detail/46)（5 天，NT$38,000）、[資展國際 iSpan](https://www.ispan.com.tw/comptia-secai-plus/) | Udemy 上有多門 CY0-001 備考課 |
| COASP | [恆逸](https://www.uuu.com.tw/Course/Show/3332/COASP)（40 小時，NT$68,000，含一次考試） | [EC-Council](https://iclass.eccouncil.org/our-courses/certified-offensive-ai-security-professional) on-demand $1,699 起、線上直播 $2,499 起 |
| OSAI+ | [恆逸](https://www.uuu.com.tw/Course/Show/3408/OSAI)（40 小時，NT$149,000） | [OffSec](https://www.offsec.com/courses/ai-300/) $1,749（90 天自學 + 1 次考試） |
| HTB COAE | 沒查到 | [HTB Academy](https://academy.hackthebox.com/preview/certifications/htb-certified-offensive-ai-expert) AI Red Teamer 路徑，訂閱制 |
| CAISP | 沒查到 | [Practical DevSecOps](https://www.practical-devsecops.com/certified-ai-security-professional/) $1,099，含 60 天 lab 與考試 |
| GAIPS | 沒查到 | [SANS SEC545](https://www.sans.org/cyber-security-courses/genai-llm-application-security)，5 天直播或自學 |
| AAISM | 沒查到 | [ISACA](https://www.isaca.org/credentialing/aaism) 官方 Online Review Course |
| TAISE | 沒查到 | [CSA](https://cloudsecurityalliance.org/education/taise) $795，課程與考試綁售 |

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
| AI 安全證照（SecAI+ / COASP / OSAI+） | **恆逸** | 三種 AI 安全認證實體班都有開 |
| OSCP 攻擊面 | **DEVCORE** | 2024 年首個引進 OffSec 原廠講師實體課，現由 DEVCORE 講師中文授課 |
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
| **台北** | 信義區基隆路一段 163 號 12 樓之 3（聯合世紀大樓） | (02) 2756-7808 | CISSP、CCSP、Security+、SecAI+ 等（Pearson 直營考場） |
| **高雄** | 苓雅區新光路 38 號 4 樓之 1（亞太財經廣場） | (07) 536-1199 分機 115 | 同上（恆逸的 Pearson VUE 授權考場） |

ISC2 的考試在台灣只有這兩處可考。CompTIA（Security+、SecAI+）另可在[恆逸各地中心](https://www.uuu.com.tw/TestCenter/Info)與巨匠等 Pearson VUE 授權考場應試；ISACA 的 CISM、CRISC 走 PSI 考試中心，不在 Pearson VUE。

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

[CloudInsight 的資安工程師指南](https://cloudinsight.cc/zh/blog/security-engineer-guide)引用 104 薪資情報「資安工程師」的統計（2026/9/28 更新、有效樣本 543）：

| 年資 | 月薪 P25–P75 (NTD) | 月均薪 |
|---|---|---|
| 1 年以下 | 41,000–60,000 | 55,000 |
| 1–3 年 | 45,000–63,000 | 56,000 |
| 3–5 年 | 46,000–68,000 | 59,000 |
| 5–10 年 | 51,000–74,000 | 63,000 |
| 10 年以上 | 51,000–87,000 | 72,000 |

- 資安主管與 CISO 另列為其他職務，不在表內
- **金融業**薪資最高，科技業次之
- 證照的作用：該文建議完全沒經驗的人先考一張入門證照（Security+ 或 iPAS）比較好找工作；CISSP、OSCP 是談薪的加分項，但沒有實務經驗、光靠證照幫助有限
- 台灣 CISSP 持證者不多：依[吳文智整理的 ISC2 分國統計](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf)，2022 年 1 月為 465 人，之後的分國數字未見公開來源

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

1. **法規推但不指定**：資安法 2.0、金管會的人力分級和證交所的管控指引都要求設置資安人員或定期訓練，但不強制指定哪張證照。真正的需求來自徵才市場——看 104 的職缺描述比看法規條文更準。

2. **培訓資源比想像的豐富**：恆逸的課程齊全度在亞洲可能也數一數二（同時有 ISC2、CompTIA、EC-Council 三家授權加上 AI 安全新課），WUSON 吳文智的 CISSP 班是台灣圈內公認的傳奇。不是只有自學一條路。

3. **iPAS 是被低估的起點**：NT$2,400、繁體中文、政府標案加分。如果你完全沒有資安背景，從 iPAS 中級開始建立信心，再攻 Security+ 進入國際體系，是一條務實的路線。

這是「資安證照攻略」系列的最後一篇。回顧整個系列：

- [第一篇：全景地圖](/posts/tech/2026-09-10-security-cert-landscape)——22 張證照的分類框架與三階段路線圖
- [第二篇：AI 安全證照橫評](/posts/tech/2026-09-10-ai-security-cert-showdown)——SecAI+ vs CAISP vs GAIPS vs AAISM
- [第三篇：ROI 拆解](/posts/tech/2026-09-10-security-cert-roi)——Security+ → AWS Security → CISSP 的投資報酬
- **第四篇（本篇）**：台灣生態——法規、培訓、考場、在地資源

## 更新紀錄

- 2026-10-12：資安法補上施行日（2025/12/1）與子法發布時間；薪資表原本引用的數字在來源頁改版後已不存在，改用來源現在引用的 104 薪資情報統計，並移除「CISSP / OSCP 可多 10–20%」「外商高 20–50%」；台灣 CISSP 人數改為有年份的統計；CAISP 改為現價 $1,099。法規一段更正：人力分級出自金管會函令，管控指引是證交所與櫃買中心發布的參考文件，指引本文沒有建議任何證照；考場表改為依發證機構區分，移除 CEH、CISM；DEVCORE、全智網、巨匠的課程與價格依官網現況更新。
- 2026-10-08：恆逸新增 OffSec OSAI+ 實體班（NT$149,000），AI 安全實體班由兩種變三種；補上 COASP 課程價格；DEVCORE 的 OffSec 課程由「獨家」改為「首家引進」；新增「AI 安全證照去哪上課」對照表。

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
- [恆逸 — OSAI+ 認證課程 AI-300](https://www.uuu.com.tw/Course/Show/3408/OSAI)
- [全智網 — CompTIA SecAI+ 課程](https://ainetwork-training.com/courses/secai/)
- [網安智慧 — CompTIA SecAI+ 課程](https://www.nsit.com.tw/course_detail/46)
- [資展國際 iSpan — CompTIA SecAI+ 認證班](https://www.ispan.com.tw/comptia-secai-plus/)
- [SANS SEC545: GenAI and LLM Application Security](https://www.sans.org/cyber-security-courses/genai-llm-application-security)
- [Wentz Wu — CISSP by Countries（ISC2 member counts，2022/1/1）](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf)
- [理律法律事務所 — 總統公布修正資通安全管理法](https://www.leeandli.com/TW/NewslettersDetail/7505.htm)
- [證交所 — 上市公司資通安全宣導（資安人力分級）](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf)
- [證交所／櫃買中心 — 上市上櫃公司資通安全管控指引（113.9 修正）](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf)
- [證交所資安專區（含內控處理準則問答集）](https://dsp.twse.com.tw/informationSecurity/list)
- [恆逸 — 考試中心資訊](https://www.uuu.com.tw/TestCenter/Info)
- [DEVCORE Training 2026](https://training.devco.re/2026)
- [OffSec — OSCP+ Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- [暨南大學計網中心 — 資通安全管理法自 114/12/1 施行](https://cc.ncnu.edu.tw/p/406-1001-31660,r471.php?Lang=zh-tw)
