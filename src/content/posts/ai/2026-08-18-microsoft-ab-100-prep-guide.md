---
title: "微軟 AB-100 備考路徑：架構師那張，別照官方頁面那段簡介準備"
date: 2026-08-18
type: guide
category: ai
tags: [certification, azure, agents, architecture, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 13
tldr: "AB-100 是微軟 agent 線的架構師版，三塊權重 25-30 / 25-30 / 40-45，重心在部署與治理。它的 outline 幾乎全是 design、recommend、propose 這類動詞——考的是情境判斷而不是實作。三個要先知道的：官方考試頁的簡介段落是錯的（寫成資訊保護與 DLP 的樣板文，我逐字驗過），準備要以 study guide 為準；它有免費練習測驗，是微軟三張 agent 證照裡唯一有的；官方列了 15 張可用的 associate 證照但沒有一張是必要條件。官方規格：$165、僅英文、及格 700、效期一年。"
description: "微軟 AB-100（Agentic AI Business Solutions Architect）備考指南，依官方 study guide 的三塊權重拆解規劃、設計與部署治理，說明官方頁面簡介錯置的問題、免費練習測驗、15 張 associate 證照清單的實際效力，以及與 AI-500、AB-620 的分工。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)，不含考古題。查證日期：2026-08-18，對照的是「Skills measured as of **July 22, 2026**」那一版。

AB-100 是微軟三張 agent 認證裡的架構師版 —— [AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide) 建東西、[AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide) 寫程式、**AB-100 決定要不要做、怎麼算 ROI、怎麼治理**。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 先講一個官方頁面的錯誤

[官方考試頁](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/)的 Schedule exam 區塊裡，有這麼一段：

> This exam measures your ability to accomplish the following technical tasks: implement information protection; implement data loss prevention and retention; manage risks, alerts, and activities.

**這段是錯的。** 資訊保護、資料外洩防護與保留、風險與警示管理 —— 這是微軟合規類考試的樣板文，跟 AB-100 毫無關係，而且**跟同一頁下方的「Assessed on this exam」自相矛盾**（那裡列的是 Plan／Design／Deploy AI-powered business solutions）。

**實務含意**：**照 study guide 準備，不要照那段簡介。** 這是本系列第三次遇到官方文件內部打架（前兩次是 [NVIDIA 的權重表與描述](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide)、[AI-103 的文件連結區塊](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)）—— 官方來源要交叉比對，不能單看一頁。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | AB-100 |
| 認證名稱 | Agentic AI Business Solutions Architect（expert 級） |
| 狀態 | **已 GA**（頁面無 beta 標記） |
| 費用 | **$165 USD** |
| 時間 | **官方未公布** |
| 題數 | **官方未公布** |
| 及格 | **700** |
| 語言 | **僅英文** |
| 效期 | 1 年（免費線上續期評量，**專屬續期頁已上線**） |
| 先修 | **無強制先修**（詳見下） |
| 練習測驗 | **有，而且免費** |

**免費練習測驗是它比另外兩張強的地方** —— AI-500 與 AB-620 目前都還沒有。這張的 study guide 也是三張裡唯一有「Skills measured as of」日期與 change log 的。

## 那 15 張 associate 證照是什麼意思

官方考試頁列出一份清單，開頭寫：

> Here is a list of the current possible associate certs that can be used for this expert certification:

清單含 MB-280、PL-200、MB-330、PL-400、MB-230、MB-310、MB-500、MB-800、MB-820、AI-300、**AI-103**、**AB-620**、AB-210、AB-410、AB-250 —— 十五張，橫跨 Dynamics 365、Power Platform 與 AI 線。

**但官方文字沒有說「必須」持有其中之一。** 對照 [AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide) —— 那張有明確的 `Prerequisites: 1 certification` 欄位與獨立的 Certification prerequisites 段落 —— AB-100 兩者皆無。

**所以正確的理解是**：這 15 張是「可以搭配」而不是「必須先有」。要百分之百確認，得問 Microsoft Credentials 支援；本文照官方文字報告，不替它補上沒寫的規定。

## 三塊權重

| 技能 | 比重 |
|---|---|
| Plan AI-powered business solutions | 25–30% |
| Design AI-powered business solutions | 25–30% |
| **Deploy AI-powered business solutions** | **40–45%** |

**重心在部署與治理**，而且這裡的「Deploy」不是按部署鍵 —— 它涵蓋監控調校、測試策略、ALM 流程設計，以及負責任 AI、安全、治理、風險與合規。

## 逐塊準備

### Plan AI-powered business solutions（25–30%）

**官方考什麼**：評估 agent 在任務自動化、資料分析與決策上的用途；**檢視用於 grounding 的資料**（正確性、相關性、時效性、乾淨度、可得性）；組織資料供其他 AI 系統使用。

策略層：**套用 Azure Cloud Adoption Framework 的 AI 導入流程**；設計在商業方案中建 AI 與 agent 的策略；**用 Microsoft 365 Copilot、Copilot Studio 與 Microsoft Foundry 設計多 agent 方案**；預建 agent 的使用案例；**決定要自建 agent 還是擴充 Microsoft 365 Copilot**；決定何時該建自訂模型；**提供 prompt library 的建立準則**；客製化小型語言模型的使用案例；**納入 Microsoft AI Center of Excellence 的要素**。

成本效益：**選擇含總持有成本的 ROI 準則**、為提案做 ROI 分析、**分析自建／購買／擴充的取捨**、**實作 model router 把請求導向最合適的模型**。

**怎麼準備**：這塊最不像技術考試的一塊，也是工程師最容易輕忽的 —— **ROI 分析與 build/buy/extend 判斷是實打實的考點**。建議把自己做過的一個 AI 專案，真的算一次總持有成本。

### Design AI-powered business solutions（25–30%）

**官方考什麼**：為 Dynamics 365 各應用設計 Copilot 的商業術語與客製化；為 Dynamics 365 Contact Center 通路設計整合用 agent；**設計任務型 agent、自主 agent、prompt 與回應型 agent**；提出 Foundry Tools 的選用建議；設計 Copilot Studio 的 topic（含 fallback）；**套用 Power Platform Well-Architected Framework**；**判斷何時該用標準 NLP、對話式語言理解或生成式 AI 編排**；設計 agent flow 與 prompt action。

擴充性：**用 Microsoft Foundry 的自訂模型設計方案**；在 Microsoft 365 Copilot 裡設計 agent；**用 MCP 設計 Copilot Studio 的 agent 擴充**；**用 Computer Use 設計自動化 app 與網站任務的 agent**；設計 agent 行為（含推理與語音模式）；用 Teams 與 SharePoint 的 agent 最佳化方案設計。

**怎麼準備**：這塊考的是**選型的邊界**。三個最常出現的判斷題：自建 vs 擴充 Copilot、標準 NLP vs 生成式編排、task agent vs autonomous agent。三組分界能講清楚，這塊就穩了。

### Deploy AI-powered business solutions（40–45%，最重）

**分析、監控與調校**：建議監控 agent 的流程與工具；分析 AI 與 agent 使用的待辦與使用者回饋；**用 AI 工具分析問題並調校**；監控 agent 效能與指標；**解讀遙測資料**做效能與模型調校。

**測試管理**：建議測試 agent 的流程與指標；**建立自訂 AI 模型的驗證準則**；驗證 Copilot prompt 的最佳實踐；設計跨多個 Dynamics 365 應用的端到端測試情境；**用 Copilot 建立測試案例的策略**。

**ALM 流程設計**：為 AI 模型與 agent 用的資料、Copilot Studio 的 agent／connector／action、**Microsoft Foundry Agents service**、自訂 AI 模型，以及 Dynamics 365 各應用的 AI，分別設計 ALM。

**負責任 AI、安全、治理、風險與合規**：設計 agent 的安全與治理、模型安全；**分析方案與 AI 的漏洞與緩解，含 prompt manipulation**；審視是否符合負責任 AI 原則；**驗證資料落地與資料移動的合規**；設計 grounding 資料與模型調校的存取控制；**設計模型與資料變更的稽核軌跡**。

**怎麼準備**：這 40–45% 是四個子塊的總和，而且**每一塊都是「設計流程」而不是「執行操作」**。準備方式是把每個子塊寫成一份你自己的檢核表 —— 例如「一個 agent 上線前，ALM 要涵蓋哪五件事」。官方 study guide 有 change log，值得對照確認自己讀的是 7 月 22 日那版。

## 時程與官方課程的定位

**這張沒有辦法用「讀完就考」的方式準備**，因為 outline 幾乎全是 design、recommend、propose 這類動詞 —— 考的是判斷，而判斷來自做過的專案。

官方講師課 [AB-100T00](https://learn.microsoft.com/en-us/training/courses/ab-100t00) 自己也這樣說：

> While this course aligns conceptually with many of the AB-100 exam skill areas, **it is not a test-preparation course** and does not focus on test-taking strategies. Instead, it provides the architectural foundations, enterprise context, and design reasoning that make AB-100 learning meaningful and applicable.

**微軟自己說這門課不是考前準備課**，這在官方教材裡很少見，也說明了這張的性質。

自學路線是免費的 Microsoft Learn 學習路徑 [Architect agentic AI business solutions](https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/)（考試頁 learn_item 指向的那條），加上**免費練習測驗**。

**時程建議**：有企業架構經驗的人，**四到六週**足夠把微軟產品線的對應關係補齊；沒有架構經驗、只有開發經驗的人，這張不是靠讀書能過的 —— 先去參與一次跨部門的 AI 導入專案比較實際。

## 微軟三張 agent 證照的分工

| | AB-620 | AI-500 | **AB-100（本文）** |
|---|---|---|---|
| 角色 | 低程式碼建造者 | code-first 工程師 | **架構師** |
| 最重的塊 | 整合 40–45% | 開發 30–35% | **部署與治理 40–45%** |
| 先修 | 無 | **必須有 AI-103** | 無（列了 15 張可搭配） |
| 語言 | 13 種含繁中 | 僅英文 | 僅英文 |
| 練習測驗 | 尚未提供 | 尚未提供 | **有，免費** |

**唯一的官方階梯仍是 AI-103 → AI-500。** AB-620 與 AB-100 各自獨立，只是 AB-620 出現在 AB-100 的可搭配清單裡。

## 一個跨頁面的命名不一致

值得順帶記錄：AB-100 的考試頁描述考生能力時，用的是「**Azure AI services**」「**Azure OpenAI**」「**Azure AI Foundry**」；而 [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide) 的技能目標已經全面改用「**Microsoft Foundry**」與「**Foundry Tools**」。

同一家公司、同一條產品線、同一個月更新的兩個頁面，用著兩套命名。**判斷教材新舊時，別把單一頁面的用詞當成全公司的現況。**

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 頁面簡介錯置 | 仍寫著資訊保護／DLP 的樣板文 | 每季（修好就更新本文） |
| 三塊權重 | 25-30 / 25-30 / 40-45 | 每季 |
| 技能目標版本 | Skills measured as of 2026-07-22，有 change log | 每季 |
| 題數與時長 | **官方未公布** | 每半年 |
| 命名 | 此頁用 Azure AI Foundry，AI-103 用 Microsoft Foundry | 微軟統一時 |

## 參考資料

- [Agentic AI Business Solutions Architect 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Exam AB-100 頁面（含那段錯置的簡介與 15 張 associate 清單）](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/)
- [AB-100 官方 study guide（三塊權重與 change log）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [課程 AB-100T00（官方自述非考前準備課）](https://learn.microsoft.com/en-us/training/courses/ab-100t00)
- [微軟認證續期規則](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [微軟 AB-620 備考路徑](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
