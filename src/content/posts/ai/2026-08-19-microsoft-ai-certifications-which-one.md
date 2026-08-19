---
title: "微軟這條線怎麼選：AI-103、AI-500、AB-620、AB-100 四張的分岔點"
date: 2026-08-19
type: guide
category: ai
tags: [certification, azure, agents, copilot-studio, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 22
tldr: "微軟四張 AI／agent 認證裡，只有 AI-103 → AI-500 是官方寫死的階梯，其餘全是定位問題。選擇要走三個分岔：寫不寫 Python（AI-103／AI-500 vs AB-620）、建東西還是做判斷（AB-100 vs 其餘三張）、以及今天能不能真的開始——AI-500 的四條官方學習路徑目前全 404、AB-620 沒有練習測驗、AB-100 有免費練習測驗。對台灣讀者還有第四個分岔：AI-103 與 AB-620 有繁體中文，AI-500 與 AB-100 只有英文。四張都是 $165、效期一年、續期免費但只在到期前六個月開放。"
description: "微軟 AI-103、AI-500、AB-620、AB-100 四張 AI 認證的選擇指南：彙整四篇備考路徑的官方權重、先修條件、語言、教材成熟度與續期規則成一張表，說明 code-first 與低程式碼的分岔、架構師線的定位，以及四種讀者情境的建議路線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en)
>
> 本文是從官方資料建出來的選擇指南，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回各張的官方 study guide，所有規格都指回微軟官方頁面，不含考古題。查證日期：2026-08-19。

微軟在 2026 年一口氣把 AI 認證線鋪成四張：[AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)、[AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)、[AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide)、[AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide)。四張同價（$165）、同效期（一年）、同及格線（700），所以價格與制度幫不了你做決定。

**能幫你做決定的只有四件事**：要不要寫 Python、你是建東西還是決定要不要做、你讀不讀得下英文、以及這張今天有沒有教材可用。這篇把四篇備考路徑裡散落的比較表彙整成一份，並處理它們之間的不一致。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 先看唯一的硬規則

四張裡**只有一條官方明訂的階梯**：

> To become a Microsoft Certified: Multi-Agent AI Solutions Expert (beta), you must earn the Microsoft Certified: Azure AI Apps and Agents Developer Associate certification.

[AI-500 的認證頁](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)欄位另標 `Prerequisites: 1 certification`，PREREQUISITE OPTION 1 就是 AI-103。**想考 AI-500，AI-103 是唯一入口，沒有替代路徑。**

其餘三組關係全都不是規定：

- **AB-620 沒有任何先修條件**，可以直接考。
- **AB-100 也沒有強制先修**。[官方考試頁](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/)列了 15 張「current possible associate certs that can be used for this expert certification」（含 AI-103 與 AB-620），但官方文字沒有寫「必須」，頁面也沒有 AI-500 那種 `Prerequisites` 欄位。所以那 15 張是**可以搭配**，不是**必須先有**。
- AB-620 → AB-100 這條「低程式碼線的階梯」是從清單推出來的合理路徑，**不是官方規定**，別當成規則排時程。

## 四張總表（彙整四篇的比較表）

| | **AI-103** | **AI-500** | **AB-620** | **AB-100** |
|---|---|---|---|---|
| 認證名稱 | Azure AI Apps and Agents Developer Associate | Multi-Agent AI Solutions Expert（beta） | AI Agent Builder Associate | Agentic AI Business Solutions Architect |
| 級別 | associate | expert | associate | expert |
| 角色 | code-first 開發者 | code-first 多 agent 工程師 | 低程式碼建造者 | 架構師 |
| 主戰場 | Microsoft Foundry、Python | Agent Framework／LangGraph、MCP server、Azure Functions | Copilot Studio、Power Platform | Dynamics 365／Copilot Studio／Foundry 跨產品選型 |
| 狀態 | GA | **beta** | GA | GA |
| 費用 | $165 | $165 | $165 | $165 |
| 時間 | 120 分鐘 | 官方未公布 | 120 分鐘 | 官方未公布 |
| 及格 | 700 | 700 | 700 | 700 |
| 效期 | 1 年 | 1 年 | 1 年 | 1 年 |
| 語言 | 10 種，**含繁中** | **僅英文** | 13 種，**含繁中** | **僅英文** |
| 先修 | 無 | **必須有 AI-103** | 無 | 無（列 15 張可搭配） |
| 練習測驗 | 已搬到 AI Skills Navigator，**是否免費官方未說明** | 尚未提供 | 尚未提供 | **有，免費** |

技能權重（各張的官方 study guide，粗體是最重的一塊）：

| AI-103（五塊） | AI-500（四塊） | AB-620（三塊） | AB-100（三塊） |
|---|---|---|---|
| Plan and manage 25–30% | Architect 15–20% | Plan and configure 30–35% | Plan 25–30% |
| **Generative AI and agentic 30–35%** | **Develop in Azure 30–35%** | **Integrate and extend 40–45%** | Design 25–30% |
| Computer vision 10–15% | Evaluate/optimize/monitor 20–25% | Test and manage 20–25% | **Deploy 40–45%** |
| Text analysis 10–15% | Secure/govern/deploy 20–25% | | |
| Information extraction 10–15% | | | |

**兩個 expert 級的重心完全相反**：AI-500 最重的是「開發」（30–35%），架構只佔 15–20%；AB-100 最重的是「部署與治理」（40–45%），而它的 Deploy 涵蓋監控調校、測試策略、ALM 設計與負責任 AI，動詞全是 design／recommend。同樣叫 expert，一個要你把系統送上線過，一個要你做過跨部門的導入判斷。

## 第一個分岔：寫不寫 Python

這是最乾淨的一刀，兩邊幾乎不重疊。

**code-first 那側（AI-103 → AI-500）**：AI-103 的官方 audience profile 直接寫「you should have experience developing apps by using Python」。AI-500 的考綱點名 Agent Framework、LangChain、LangGraph、Hugging Face Transformers，以及把 MCP server 架在 Azure Functions／Logic Apps／API Management。這條線考的是你有沒有把多 agent 系統寫出來、送上線、加上 tracing 與 guardrail。

**低程式碼那側（AB-620）**：官方對考生的描述是「professional developer or advanced builder」，但要熟的是 Power Fx、Dataverse、Power Platform 環境、adaptive cards。它最重的 40–45% 是「Integrate and extend」——接知識來源、加 MCP tools 與 computer use、整合 Foundry agent 與 Fabric data agent、用 A2A 建多 agent 方案。**不寫 Python，但一樣考 MCP 與 A2A。**

**判斷法**：你平常打開的是 VS Code 還是 Copilot Studio 的畫布？答案就是你的那一側。兩邊的重疊只在概念層（RAG、MCP、A2A、編排模式），實作技能不互通——跨證照的重疊面向見[多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)。

## 第二個分岔：建東西還是做判斷

AB-100 是四張裡唯一不考「怎麼做」的。它的 Plan 那塊考 ROI 準則與總持有成本、自建／購買／擴充的取捨、Azure Cloud Adoption Framework 的 AI 導入流程、AI Center of Excellence；Design 那塊考選型邊界（自建 vs 擴充 Microsoft 365 Copilot、標準 NLP vs 對話式語言理解 vs 生成式編排、任務型 agent vs 自主 agent）。

官方講師課 [AB-100T00](https://learn.microsoft.com/en-us/training/courses/ab-100t00) 自己寫著「**it is not a test-preparation course**」，改提供 architectural foundations 與 design reasoning。這句話說明了這張的性質：**判斷來自做過的專案，不來自讀書。**

**判斷法**：如果你的工作內容是「決定公司要不要做、做哪一個、誰負責治理」，AB-100 直接對應；如果你的工作是把東西做出來，先拿 AI-103 或 AB-620，AB-100 之後再說。

## 第三個分岔：語言（台灣讀者的實際變數）

這一項在別家證照很少成為決策點，但微軟這條線的落差很大：

| 有繁體中文 | 僅英文 |
|---|---|
| **AI-103**（10 種語言） | **AI-500** |
| **AB-620**（13 種語言） | **AB-100** |

我在 2026-08-19 逐頁確認過四張考試頁的語言欄位：AI-103 與 AB-620 都列了 Chinese (Traditional)，AI-500 與 AB-100 都只有 English。

**這造成一個不太漂亮的事實**：兩張有繁中的都在入門／associate 級，兩張 expert 級都只有英文。所以走到 expert 這步一定要能讀英文考題——**而且 AI-500 這張的英文不只是考題，連準備材料都只有英文官方文件可用**（見下一節）。

**實務建議**：如果英文閱讀速度是你的瓶頸，先用 AB-620 或 AI-103 拿到第一張（繁中考題可以把「看不懂題目」和「不會這個技術」分開），再決定要不要往 expert 走。

## 第四個分岔：今天真的能開始準備哪一張

四張的教材成熟度差距，比考綱難度的差距更會影響你這個月的實際進度。

| | 官方學習路徑 | 講師課 | 練習測驗 |
|---|---|---|---|
| **AI-103** | ✅ 四條全部可用（等同講師課 AI-103T00-A 的教材） | 有 | 已搬到 AI Skills Navigator，**免費與否官方未說明** |
| **AI-500** | ❌ 考試頁列了四條，**公開網址全部 404**；認證頁自己寫「Learning paths or modules are not yet available for this certification」 | [AI-500T00](https://learn.microsoft.com/en-us/training/courses/ai-500t00) 標示 **2026/9/30** 開課 | ❌ 尚未提供 |
| **AB-620** | ✅ 三條可用（標示時數合計 8 小時 29 分） | [AB-620T00-A](https://learn.microsoft.com/en-us/training/courses/ab-620t00) 標示 **2026/9/18** 開課 | ❌ 尚未提供（官方寫「usually available within 8 weeks of the exam being out of beta and generally available」） |
| **AB-100** | ✅ [Architect agentic AI business solutions](https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/) | 有，但官方自述非考前準備課 | ✅ **有，而且免費** |

（AI-500 的認證頁那句「Learning paths or modules are not yet available」我在 2026-08-19 重新取頁確認仍在。）

**三個可操作的結論**：

1. **AI-500 現在不適合排讀書計畫。** 唯一可用的官方材料是 study guide 的 22 條目標、Microsoft Foundry 文件與 exam sandbox。如果你沒實際做過多 agent 上線，等 9/30 的課上線再開始，成本會低很多；如果你已經在做，那 22 條就是很好的自我盤點清單。而且它還在 beta ——**beta 期間只能考一次**，沒過要等正式上線才能重考，成績也要等重新計分。
2. **AB-620 可以現在開始，但要接受沒有模擬題。** 三條學習路徑現在就能自學，不用等 9/18 的講師課；練習測驗的缺口只能用實作與 exam sandbox 補。
3. **AB-100 是四張裡唯一「學習路徑 + 免費練習測驗」都齊的。** 這在準備節奏上是實質優勢——但別忘了它考的是判斷，練習測驗補得了熟悉度，補不了專案經驗。

AI-103 的練習測驗狀態要特別講清楚：它**已經搬離 Microsoft Learn**，改到 AI Skills Navigator 且需登入。微軟的通用政策說「Some exams have free Practice Assessments… delivered through Learn」，但這張已經不在 Learn 上，**那句話不適用，官方也沒在新位置說明是否免費**。所以「AB-100 是唯一有免費練習測驗的」這個說法，準確的講法是：**AB-100 是四張裡唯一確定免費的**，AI-103 未知，另外兩張確定沒有。

## 四種人的建議路線

以下都以每週 5–8 小時估算，時程換算依據寫在各張的備考路徑篇裡。

**一、Azure 上寫 AI 應用的工程師** → **AI-103**（六週，$165）。這是四張裡唯一「有繁中 + 教材完整 + 直接對應日常工作」的組合。要注意的是 [Foundry 換代](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)：考綱整份重寫，prompt flow、Azure AI Studio、Azure OpenAI Service、Azure AI Agent Service 這些名詞在技能目標裡一個都沒出現，圍繞它們寫的舊教材講的是 Foundry 之前的世界。

**二、已經在做多 agent 系統、想要 expert 頭銜** → **AI-103 → AI-500**（總計 $330）。先花六週拿 AI-103（本來就是硬性先修），其中「Develop AI agents on Azure」那條學習路徑與 AI-500 第二塊重疊度最高。AI-500 本身，有實務經驗的話四到六週補齊缺口；沒有的話建議等 9/30。

**三、在 Copilot Studio 上做企業 agent 的開發者／顧問／ISV 夥伴** → **AB-620**（五週，$165）。沒有先修、有繁中、教材現成，是四張裡進入門檻最低的一張。它與 AI-103 幾乎不重疊，**不要因為「先考個簡單的」而把 AB-620 當成 AI-103 的墊腳石**——那不是同一條線。

**四、負責決定要不要導入、怎麼算 ROI、誰來治理** → **AB-100**（有企業架構經驗四到六週）。只有英文，但有免費練習測驗。**沒有架構經驗、只有開發經驗的人不建議直接衝這張**：它的 outline 幾乎全是 design、recommend、propose，先去參與一次跨部門的 AI 導入專案比讀書實際。

**如果你兩側都想要**：先做完你日常在用的那一側（AI-103 或 AB-620），另一側的價值主要是履歷廣度而不是能力補強——兩邊的實作技能不互通，同時準備會拖慢兩邊。

## 一年效期：四張共通的長期成本

四張的效期都是**一年**，跟 AWS 的三年、Google 與 NVIDIA 的兩年差一個量級。但續期規則對持證者相當友善，值得完整讀一次[官方續期說明](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)：

**好的部分**：續期**完全免費**，形式是線上、非監考、**開書**的評量，官方說大約 45 分鐘。沒過可以立刻再試，第二次之後才需要間隔 24 小時，次數無上限。

**錯過窗口的後果**（這是四張共同的最大風險）：

- 續期評量**只在到期前六個月的窗口內開放**，官方明講不能更早：「Can I renew my certification more than six months before it expires? **No.**」
- 續期成功是**從原到期日往後加一年**，不是從你考的那天算。
- **過期就沒有續期這條路**：「If your certification expires, you must earn the certification again by passing the required exam(s).」官方對這條的態度是「**There are no exceptions to this policy.**」
- 通過 beta 考試或重考正式考試**都不能代替續期評量**。

**換算成成本**：一張 $165 拿到，之後每年 45 分鐘免費維持。如果你拿了 AI-103 + AI-500 兩張，就是每年兩次評量、兩個各自的六個月窗口要記。**忘記一次，那張就要重付 $165 整張重考**——而 AI-500 還會連帶要求你當時的 AI-103 仍然有效。

一個查證上的細節：**AB-620 的專屬續期頁在 2026-08-18 查證時仍回 404**（`/ai-agent-builder-associate/renew/`），AI-500 的也尚未上線，只有 AB-100 的已上線。這通常代表第一批持證者還沒進入續期窗口，不是沒有續期路徑，但值得在你接近到期時重新確認。

**重考規則四張相同**：第一次沒過等 [24 小時](https://learn.microsoft.com/en-us/credentials/support/retake-policy)，之後每次間隔 14 天，同一張考試 12 個月內最多 5 次，每次都要付費。唯一的例外是 beta 期間的 AI-500 ——只能考一次。

## 資料之間的不一致（照實記錄）

**一、本系列前幾篇對「唯一繁中」的說法不一致。** [AI-103 那篇](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)寫 AI-103 是「本系列裡除了 AWS AIF-C01 之外唯一提供繁中的」，[AB-620 那篇](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide)寫 AB-620 是「微軟三張 agent 證照裡唯一在地化的」。我在 2026-08-19 逐頁確認：**AI-103 與 AB-620 兩張都有繁體中文**，AI-500 與 AB-100 都沒有。AB-620 那句在它自己的範圍（AB-620／AI-500／AB-100 三張）內成立，AI-103 那句的範圍寫得太寬。**以本文這張表為準。**

**二、「微軟三張 agent 證照」這個框架會漏掉 AI-103。** AB-620 與 AB-100 兩篇都用「三張 agent 證照」指 AB-620／AI-500／AB-100，但 AI-103 最重的一塊正是「Implement generative AI and agentic solutions」（30–35%），而且它是 AI-500 的唯一入口。**要做選擇時，四張要一起看**，這也是本文用四欄表而不是三欄表的原因。

**三、微軟自己的頁面互相打架，兩處已知**：AI-103 的 study guide 目標區已全面改用 Microsoft Foundry 命名，但**同一頁的「Find documentation」連結區塊仍指向 Azure AI services、Azure AI Vision、Azure OpenAI 等舊名**；AB-100 的[考試頁簡介段落](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/)則是資訊保護與 DLP 的樣板文（「implement information protection; implement data loss prevention and retention…」），與同頁下方的「Assessed on this exam」自相矛盾。**兩處都以 study guide 為準。**

**四、命名不一致**：AB-100 的考試頁用「Azure AI Foundry」「Azure AI services」「Azure OpenAI」，AI-103 的技能目標已全面改用「Microsoft Foundry」與「Foundry Tools」。同一家公司、同一條產品線，兩套命名。判斷教材新舊時別把單一頁面的用詞當成全公司現況。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-19 查證） | 什麼時候要重查 |
|---|---|---|
| AI-500 beta 狀態 | 仍是 beta；官方部落格寫 GA 預計 2026/10（前瞻性說法，認證頁未載明） | 每月 |
| AI-500 學習路徑 | 考試頁列了四條，公開網址全部 404；認證頁寫尚未提供 | 每月 |
| AI-500T00 講師課 | 標示 2026/9/30 開課 | 9 月底 |
| AB-620T00-A 講師課 | 標示 2026/9/18 開課 | 9 月中 |
| AB-620 練習測驗 | 尚未提供 | 每月 |
| AI-103 練習測驗是否免費 | 已搬到 AI Skills Navigator，官方未說明 | 登入即可確認 |
| 四張的權重 | 見上方權重表 | 每季／改版時 |
| 語言 | AI-103 10 種、AB-620 13 種（皆含繁中）；AI-500 與 AB-100 僅英文 | 每半年 |
| AB-620／AI-500 專屬續期頁 | 尚未上線 | 每季 |
| AB-100 頁面簡介錯置 | 仍寫著資訊保護／DLP 的樣板文 | 每季 |

## 參考資料

- [Azure AI Apps and Agents Developer Associate 認證頁（AI-103）](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [AI-103 官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
- [Multi-Agent AI Solutions Expert（beta）認證頁（AI-500，含先修條件）](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Exam AI-500 頁面](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-500/)
- [AI-500 官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [課程 AI-500T00（標示 2026/9/30 開課）](https://learn.microsoft.com/en-us/training/courses/ai-500t00)
- [AI Agent Builder Associate 認證頁（AB-620）](https://learn.microsoft.com/en-us/credentials/certifications/ai-agent-builder-associate/)
- [AB-620 官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [課程 AB-620T00-A（標示 2026/9/18 開課）](https://learn.microsoft.com/en-us/training/courses/ab-620t00)
- [Agentic AI Business Solutions Architect 認證頁（AB-100）](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Exam AB-100 頁面（含那段錯置的簡介與 15 張 associate 清單）](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/)
- [AB-100 官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [課程 AB-100T00（官方自述非考前準備課）](https://learn.microsoft.com/en-us/training/courses/ab-100t00)
- [學習路徑：Architect agentic AI business solutions](https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/)
- [學習路徑：Develop AI agents on Azure](https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/)
- [微軟認證續期規則](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [微軟認證效期政策](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [考試時長與考場體驗說明](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [微軟 AI-103 備考路徑](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
- [微軟 AB-620 備考路徑](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide)
- [微軟 AB-100 備考路徑](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide)
- [多 agent 架構的考點交集：五張證照重複考什麼](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
