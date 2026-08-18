---
title: "Claude Certified Associate（CCAO-F）備考路徑：最重的一塊是「怎麼判斷 Claude 講錯了」"
date: 2026-08-18
type: guide
category: ai
tags: [certification, claude, prompt-engineering, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 15
tldr: "CCAO-F 是 Anthropic 四張裡最便宜的一張（$99、60 題、120 分鐘），給的是「用 Claude 做事」而不是「寫程式串 Claude」的人。七個領域裡最重的是 Output Evaluation and Validation 21%——辨識幻覺、判斷何時需要人工複核、比較與改寫輸出；Governance, Risk, and Responsible Use 也有 15%。官方明講它不適合寫 API 或設計 agentic 系統的開發者。另有一條容易被忽略：這張不計入 Claude Partner Network 的 tier 資格，另外三張才算。"
description: "Claude Certified Associate – Foundations（CCAO-F）備考指南，依官方 exam guide 的七個領域權重逐項拆解輸出驗證、工作流整合、Projects 設定與負責任使用，說明它與另外三張的分工、四週時程換算依據，以及不計入 partner tier 的限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回官方 **Claude Certified Associate – Foundations Exam Guide**，不含考古題。查證日期：2026-08-18。

CCAO-F 是 Anthropic 四張認證裡最便宜、也是唯一**不要求你會寫程式**的一張。但它不是「入門版的開發者認證」—— 它考的是另一件事：**在日常工作裡把 Claude 用對，並且知道它什麼時候不可信。**

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

官方 Intended Audience 描述的是：**把 Claude 當生產力工具、並且會建 Claude Projects 的專業工作者** —— 橫跨營運、行銷、專案管理、教育、傳播與一般知識工作；包含維護與最佳化 AI 工作流的內部員工，以及協助導入、找使用案例、重新設計流程的外部顧問。

官方對這個角色的定位很精確：

> They are positioned **between casual AI prompt users and technical AI practitioners**, and are distinguished by their ability to translate business objectives into effective AI interactions… critically evaluate AI-generated content, adapt outputs for different audiences, and **recognize when human expertise, validation, or escalation is required**.

**排除條款也寫得很清楚**：

> This certification is **not** intended for software developers who build against APIs or design agentic systems, nor for specialists in machine learning, software engineering, or advanced AI system design… that scope belongs to the Claude Architect and Claude Developer credentials, **to which Associates escalate more complex or technical work**.

也就是說：**工程師不該考這張**，該考 [CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide)。這張是給你團隊裡那位「很會用 Claude、但不寫程式」的同事的。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | CCAO-F |
| 題數 | **60 題** |
| 時間 | 120 分鐘 |
| 費用 | **$99 USD**（四張裡最便宜） |
| 及格 | **720**（量尺 100–1,000） |
| 效期 | **12 個月** |
| 報考 | 限 Claude Partner Network 組織 |

**一條容易被忽略的限制**：官方認證頁上有一行註記 —— 「The new Claude Certified Associate certification **does not count towards Claude Partner Network tier eligibility**」。另外三張都計入 partner program standing，只有這張不算。**如果你公司考證照是為了衝 partner 等級，這張沒有用。**

## 七個領域

| 領域 | 比重 |
|---|---|
| **Output Evaluation and Validation** | **21%** |
| Workflow Integration and Solution Design | 16% |
| **Governance, Risk, and Responsible Use** | **15%** |
| Prompting and Task Execution | 14% |
| Product and Model Selection | 12% |
| Configuration and Knowledge Management | 12% |
| Troubleshooting and Optimization | 10% |

**注意權重的分布方式**：多數人以為這種證照會把 prompt 寫作當主軸，但 **Prompting 只有 14%**，而 **Output Evaluation 佔 21%、Governance 佔 15%** —— 加起來 36% 在考「怎麼判斷 AI 的輸出可不可信、什麼時候不該用它」。

**這其實是這張證照最有價值的地方**：它把重點放在**懷疑輸出**而不是**產生輸出**。

## 逐領域準備

### Output Evaluation and Validation（21%，最重）

**官方考什麼**：評估輸出的正確性與完整性；**迭代 prompt 以改善品質**；**依任務型態調整策略（分析、研究、草擬、腦力激盪）**；**判斷何時需要人工複核或額外驗證**；**辨識幻覺、不一致與偏誤**；為目標受眾編輯、改寫、精修與比較輸出；**組織與策展資訊，並選擇合適的輸出格式（artifacts、行內、結構化資料）**。

**怎麼準備**：這塊的核心是**懷疑的方法論**。實務練習：拿三個你熟悉領域的問題問 Claude，逐句標出哪些是可驗證的事實、哪些是它的推測，再實際去查證 —— 這個動作做過幾次，「辨識幻覺」就不再是抽象名詞。

### Workflow Integration and Solution Design（16%）

**官方考什麼**：用 Claude 分析需求與使用案例；用於研究、規劃與流程最佳化；支援方案設計、開發與迭代；**把 Claude 整合進既有工作流以增強或重新設計流程**；**向利害關係人溝通 Claude 的價值與限制**。

**怎麼準備**：最後那條是重點 —— **要能同時講清楚價值「與限制」**。這塊跟 [CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide) 的利害關係人溝通同源，只是層級較淺。

### Governance, Risk, and Responsible Use（15%）

**官方考什麼**：**辨識合適與不合適的使用案例**；**套用資料敏感性、法規與隱私考量**；**遵循組織的 AI 政策與治理標準**；理解 AI 使用的倫理意涵。

**怎麼準備**：這塊不需要法條細節，但要能判斷「這份資料能不能貼進去」。建議把自己公司的 AI 使用政策讀一次，對照官方這四條。

### Prompting and Task Execution（14%）

**官方考什麼**：為商業與技術任務寫有效的 prompt；**套用任務分解技巧來結構化複雜請求**。

只有兩條，權重也只有 14% —— **prompt 技巧在這張證照裡遠沒有多數人想的重要。**

### 其餘三塊

**Product and Model Selection（12%）**：選對 Claude 產品功能（**Projects、research mode、chat、artifacts**）；**分辨 Haiku、Sonnet、Opus 的差異**；依成本、速度、品質對齊模型選擇；**理解與管理 context 限制與記憶考量（何時該重開、摘要或持久化）**。

**Configuration and Knowledge Management（12%）**：**用指示與知識來源設定 Claude Projects**；管理上傳的知識與連接器（官方點名 **Google Drive、Gmail**）；撰寫有效的系統層級指示；維護與更新設定。

**Troubleshooting and Optimization（10%）**：診斷表現不佳的 prompt 與輸出；依回饋與結果調整做法；最佳化工作流的效率與效果。

## 四週時程與換算依據

**換算方式**：這是四張裡技術門檻最低的一張，官方預設考生「技術專業有限到中等」，沒有需要寫程式的領域。時程主要由**練習量**決定而不是閱讀量 —— 因為最重的三塊（評估 21%、整合 16%、治理 15%）都是判斷力，讀不出來，要練。

以每週 4–6 小時、共四週估算：

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 exam guide + 做 Section 8 官方 sample questions | 先看題目風格，判斷型題目跟知識型題目的準備方式不同 |
| 第 2 週 | **Output Evaluation（21%）**：做上面那個「標記事實與推測再查證」的練習 | 最重且最需要練 |
| 第 3 週 | Configuration（12%）+ Product/Model Selection（12%）：**實際建一個 Claude Project**，接上知識來源與連接器 | 官方備考建議直接寫「Build real workflows」 |
| 第 4 週 | Workflow Integration（16%）+ Governance（15%）+ Prompting（14%）+ Troubleshooting（10%）+ 複習 | 剩下的判斷型內容一起收 |

**官方的備考建議**（exam guide 第 7 節）也是同一個方向：

> Build real workflows: configure a Project with instructions and knowledge sources, and evaluate outputs for accuracy and bias
>
> Practice responsible-use judgment: data sensitivity, appropriate use cases, and when to escalate or seek human review

## 12 個月效期與續期

跟另外三張相同：**12 個月，準時續期是免費、非監考的評量**，過期要付全額重考 $99。內容重大改版時 Anthropic 可要求全面重考。

## 四張怎麼選

| | **CCAO-F $99** | [CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide) $125 | [CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide) $125 | [CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide) $175 |
|---|---|---|---|---|
| 對象 | **用 Claude 做事的人** | 用 API 建東西的工程師 | 設計方案的架構師 | 資深架構師／顧問 |
| 最重的塊 | **輸出評估 21%** | 應用與整合 33.1% | agentic 架構 27% | 整合 19% |
| 需要寫程式 | **否** | 是（Python／TypeScript） | 是 | 是 |
| 計入 partner tier | **否** | 是 | 是 | 是 |

**四張都不是階梯**，選的依據是你的工作內容。官方對這張的定位是「Associates **escalate** more complex or technical work」—— 它明確設計成一個會把技術問題往上轉交的角色。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 七領域權重 | 21 / 16 / 15 / 14 / 12 / 12 / 10 | 每季 |
| 規格 | $99、60 題、120 分鐘、及格 720、12 個月 | 每季 |
| 不計入 partner tier | 官方頁面仍有此註記 | 每半年 |
| 官方點名的連接器 | Google Drive、Gmail | 每次 guide 改版 |

## 參考資料

- [Claude Certified Associate – Foundations 官方認證頁（含 exam guide 下載與 partner tier 註記）](https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification)
- [Pearson VUE — Claude Certification Program（重考與報考規則）](https://www.pearsonvue.com/us/en/anthropic.html)
- [Claude Academy FAQ（免費課程證書與監考認證的差別）](https://academy.claude.com/help/faq)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Claude Certified Developer（CCDV-F）備考路徑](/posts/ai/2026-08-18-claude-certified-developer-prep-guide)
- [Claude Certified Architect Professional（CCAR-P）備考路徑](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide)
