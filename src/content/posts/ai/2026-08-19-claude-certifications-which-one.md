---
title: "Claude 四張認證怎麼選：先確認你報不報得了名"
date: 2026-08-19
type: guide
category: ai
tags: [certification, anthropic, claude, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 24
tldr: "選 Claude 四張認證之前有一個比所有考點都重要的前提：報考只開放給 Claude Partner Network 的組織，個人無法自行報名。過得了這關的人，實際的分岔點有四個——CCAO-F $99 不計入 partner tier 資格（另外三張計入）；Claude Code 在 CCAR-F 佔 20%、在 CCDV-F 只佔 3.1%，架構師那張考這個工具比開發者那張重；CCAR-P 有 28% 是治理與利害關係人溝通，系列裡沒有第二張這樣；CCAO-F 最便宜但 Prompting 只有 14%，輸出評估 21% 才是主軸。四張效期都是 12 個月，重考間隔 14 / 30 / 90 天、12 個月內最多 4 次。"
description: "Anthropic 四張認證（CCAO-F、CCDV-F、CCAR-F、CCAR-P）的選擇指南：先講清楚只有 partner 組織能報名這道門檻，再用官方 exam guide 的領域權重比對四張的實際分工，含 partner tier 計入差異、Claude Code 權重反轉、28% 非技術內容，以及官方來源互相打架與尚未公布的部分。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-19-claude-certifications-which-one-en)
>
> 本文是從官方資料建出來的選擇指南，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回四份官方 exam guide 與認證頁，不含考古題。查證日期：2026-08-19。

## 先講最重要的一件事：你可能報不了名

[Pearson VUE 的 Claude Certification Program 頁](https://www.pearsonvue.com/us/en/anthropic.html)寫得很直白：

> Certification is **open to organizations in the Claude Partner Network** and counts toward partner program standing.

**四張都一樣。** 沒有個人報名管道 —— 你不能自己刷卡去考一張 CCAO-F 放進履歷。這個系列當初把 Claude 四張排除在外，理由就是這條（見系列的[規格總表](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)）；後來補寫成四篇，是因為它們的 exam guide 是目前市面上把「AI 導入的角色分工」講得最細的公開材料。

所以這篇有兩種讀法：

- **你在 partner 組織裡**（Accenture、Deloitte、PwC、EPAM、Wipro 這類已公開承諾大規模認證的公司都在名單上）：往下讀是四張的選擇依據。
- **你不在**：這四張你考不了，但**四份 exam guide 的權重表就是 Anthropic 對這四種角色的定義**——它認為「用 Claude 做事」「寫程式串 Claude」「設計方案」「面對法遵與客戶」各自該會什麼、各佔多少比重。這份定義拿來對照自己的職涯位置、或設計團隊的內訓路徑，比證照本身有用。

## 四張的官方規格（四篇對照表彙整）

四篇備考文各自都帶了一張比較表。**逐格核對後四張表彼此一致，沒有互相矛盾的數字**，彙整如下：

| | [CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide) | [CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide) | [CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide) | [CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide) |
|---|---|---|---|---|
| 費用 | **$99** | $125 | $125 | **$175** |
| 題數 | 60 | **53**（最少） | 60 | **63**（最多） |
| 時間 | 120 分鐘 | 120 分鐘 | 120 分鐘 | 120 分鐘 |
| 及格 | 720（量尺 100–1,000） | 720 | 720 | 720 |
| 效期 | 12 個月 | 12 個月 | 12 個月 | 12 個月 |
| 領域數 | 7 | 8 | 5 | 7 |
| 最重的領域 | 輸出評估 **21%** | 應用與整合 **33.1%** | agentic 架構 **27%** | 整合 **19%** |
| 需要寫程式 | **否** | 是（Python／TypeScript） | 是 | 是 |
| 計入 partner tier | **否** | 是 | 是 | 是 |

四張都是 120 分鐘，所以**每題的時間預算差很多**：CCDV-F 平均每題約 2 分 15 秒最寬裕，CCAR-P 的 63 題平均不到 1 分 55 秒最緊。CCAR-F 的價格另有一條：官方寫結帳金額會反映所屬 partner tier 的折扣，所以 $125 是牌價不是成交價。

## 分岔點一：CCAO-F 不計入 partner tier 資格

這是四張裡唯一一條「會直接改變答案」的規則。CCAO-F 的官方認證頁上有一行註記：**新的 Claude Certified Associate 認證不計入 Claude Partner Network 的 tier 資格**，另外三張都計入 partner program standing。

Anthropic 的公告文對 tier 的組成寫得更完整：

> Tier standing in the Claude Partner Network combines certified practitioners with deployed customers and public customer references.

**所以要先問清楚組織為什麼要考**：

- **為了衝 partner 等級** → CCAO-F 這張沒有用，$99 的價差沒有意義，該把預算放在另外三張。
- **為了讓非技術同事真的把 Claude 用對** → CCAO-F 是唯一適合的那張，而且它是四張裡唯一不要求寫程式的。

這兩個目的常常在同一次採購裡被混在一起談，結果是買了一批不計入 tier 的名額。

## 分岔點二：Claude Code 在架構師那張佔 20%，在開發者那張只佔 3.1%

這是四份 exam guide 對照起來最反直覺的一格：

| 考試 | Claude Code 相關領域 | 比重 |
|---|---|---|
| CCAR-F | Claude Code Configuration & Workflows | **20%** |
| CCDV-F | Claude Code | **3.1%** |
| CCAR-P | Developer Productivity & Operational Enablement | 7% |
| CCAO-F | 無獨立領域 | — |

**多數人會猜反。** 直覺是「開發者天天用 Claude Code，所以開發者那張考最多」，實際是 CCAR-F 考的六倍多於 CCDV-F。原因在兩張考的問題不同：

- **CCAR-F 考「怎麼把 Claude Code 導入一個團隊」**：CLAUDE.md 的三層層級（使用者／專案／目錄）、`.claude/rules/` 的路徑條件式載入、Commands 與 Skills 的差別、`context: fork`、plan mode 與 direct execution 的取捨、CI/CD 裡用 `-p` 跑非互動模式。這些是**組態與流程決策**。
- **CCDV-F 考「怎麼用 API 把東西建出來」**：33.1% 的第一領域是 Claude API 機制與軟體工程，Claude Code 只是它的其中一個介面。

CCAR-P 的 7% 則是同一件事在 professional 級被壓縮的樣子 —— 它假設你已經會設定，考的是替團隊做啟用與排障。

**選擇上的意思**：如果你的實際工作是「替團隊訂 Claude Code 的規範」，該考的是 CCAR-F 而不是 CCDV-F，即使你自認是工程師。

## 分岔點三：CCAO-F 最便宜，但它不考 prompt 技巧

CCAO-F 的七個領域權重是 21 / 16 / 15 / 14 / 12 / 12 / 10：

| 領域 | 比重 |
|---|---|
| Output Evaluation and Validation | **21%** |
| Workflow Integration and Solution Design | 16% |
| Governance, Risk, and Responsible Use | **15%** |
| Prompting and Task Execution | **14%** |
| Product and Model Selection | 12% |
| Configuration and Knowledge Management | 12% |
| Troubleshooting and Optimization | 10% |

**Prompting 只有 14%，而輸出評估 21% 加治理 15% 是 36%。** 也就是三分之一以上在考「怎麼判斷 Claude 的輸出可不可信、什麼時候不該用它」——辨識幻覺、判斷何時需要人工複核、套用資料敏感性與法規考量。

這改變了誰適合考它。它不是「入門版的開發者認證」，也不是 prompt 寫作班的結業證明；官方的排除條款寫明**不適合建 API 或設計 agentic 系統的軟體開發者**，那個範圍屬於 Architect 與 Developer 兩張。它是給「會把技術問題往上轉交」的角色的 —— 官方用的動詞是 escalate。

## 分岔點四：CCAR-P 有 28% 不考技術

CCAR-P 的七個領域是 19 / 17 / 16 / 14 / 14 / 13 / 7，其中兩塊是它的身分證：

- **Governance, Safety & Risk Management 14%**：guardrail、LLM 系統的風險與失效模式、法規合規（官方點名 **GDPR、HIPAA、FedRAMP**）、AI 倫理、human-in-the-loop。
- **Stakeholder Communication & Lifecycle Management 14%**：結構化需求探索與訪談、利害關係人期望與 SLA 對齊、架構文件撰寫、交付生命週期五階段。

**合計 28%，本系列其他任何一張證照都沒有「利害關係人溝通」這種領域。** 相對地它的 Claude Models, Prompting & Context Engineering 只有 13%，比 CCDV-F 的對應內容低得多。

判斷方式很簡單：**如果你的職責只到「把系統做出來」，這 28% 是你最陌生也最貴的一段（$175 是四張最高）；如果你要面對客戶法務與資安，這張就是為你設計的。** 治理那塊的橫向材料見[AI 治理框架對照](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains)。

## 一頁的選擇依據

| 你的實際工作 | 選 | 理由 |
|---|---|---|
| 用 Claude 做日常工作、建 Claude Projects，不寫程式 | **CCAO-F $99** | 唯一不要求寫程式的一張；但**不計入 partner tier** |
| 天天呼叫 Claude API 出貨、寫 MCP server 與 agent | **CCDV-F $125** | 33.1% 在 API 機制與軟體工程，Claude Code 只 3.1% |
| 替團隊設計 Claude Code 流程、設計 agentic 方案 | **CCAR-F $125** | Claude Code 20% + agentic 架構 27% |
| 面對客戶法遵與資安、主導架構決策與交付 | **CCAR-P $175** | 治理 14% + 利害關係人 14% |
| 組織是為了衝 partner tier | 除 CCAO-F 外任一張 | 只有那三張計入 partner program standing |

**四張不是階梯。** 官方 exam guide 沒有把任何一張設為另一張的先修條件，CCAR-F 也不是 CCAR-P 的前置 —— 選的依據是職責範圍，不是年資。（這句話有一個官方來源打架的地方，見下一節。）

## 四張共用的規則

**效期 12 個月，四張都一樣。** 準時續期是**免費、非監考**的評量，在 Anthropic Partner Academy 上完成；**過期就沒有這條路**，要恢復必須付全額重考（$99 / $125 / $125 / $175）。另外如果考試內容有重大改版，Anthropic 可以要求持證者直接重考而不是做更新評量。

**重考間隔**（[Pearson VUE 頁](https://www.pearsonvue.com/us/en/anthropic.html)）：

> If you don't pass, you can retake the exam after a short waiting period: **14 days** after your first attempt, **30 days** after your second, and **90 days** after your third. You can take up to **4 attempts** per exam in any rolling 12-month period.

這個罰則在本系列裡屬於中間：比 AWS 的無限次重考嚴，比 Google 的「第三次沒過等一年」寬鬆得多。實務含意是**時程可以抓得比 Google 那條線積極，但不要壓到只剩一次機會的程度** —— 第三次沒過就要等 90 天，加上 12 個月效期的時鐘一直在走。

**考試形式**：四張都是 proctored（線上監考或 Pearson 考場），需驗證身分，通過後透過 Credly by Pearson 發數位徽章。

## 兩處官方來源互相打架

依系列紀律，**遇到官方來源不一致時兩邊都引、標成不確定，不挑一個當事實。**

**一、四張是不是階梯？**

- Anthropic 的[公告文](https://claude.com/blog/four-role-based-claude-certifications)寫：「Every path to getting credentialed **starts with a foundation-level certification and advances to the professional-level**.」——讀起來像是 CCAR-P 要先有 foundation 級。
- 但 CCAR-P 的 exam guide 沒有設任何先修條件，四份 guide 都沒有把某一張列為另一張的 prerequisite。

**目前的判斷**：報考機制上沒有硬性先修（exam guide 是規範性文件），公告文那句較可能是描述建議路徑而非報名條件。但若你的組織要據此排訓練順序，**去跟 partner 窗口確認**，不要拿這篇當依據。

**二、到底是三個角色還是四個？**

- Pearson VUE 頁寫：「three roles to choose from: **Practitioner, Architect, and Developer**」，然後在同一頁列出四張認證。
- Anthropic 公告文寫認證「maps to the **four** largest [roles]」，而且那個非技術角色的 credential 叫 **Associate**，不叫 Practitioner。

三張 vs 四張其實可以調和（Architect 有 Foundations 與 Professional 兩級，三個角色四張考試），但 **Practitioner 與 Associate 的命名不一致是實打實的** —— 找官方資料時兩個詞都要搜。

## 官方沒公布的東西（不要靠估）

Anthropic 在這四張上公布的資訊比本系列其他廠商少。以下是**查得到「沒有」的部分**，這篇不填空：

| 項目 | 狀態 |
|---|---|
| 子領域權重 | **只有 CCDV-F 公布**（拆到 1% 以下），CCAO-F / CCAR-F / CCAR-P 三張只公布到領域層級 |
| 答錯是否倒扣 | CCAR-F 的 exam guide 沒有說明，**別把「答錯不扣分」當已知** |
| 通過率 | 未公布 |
| 情境抽題結構 | **只有 CCAR-F 公布**「六個情境題庫隨機抽四個」；另外三張的 guide 沒有對應敘述，不代表它們也是這個結構 |
| 個人報考管道 | 不存在（不是「未公布」，是官方明說只開放 partner 組織） |

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-19 查證） | 什麼時候要重查 |
|---|---|---|
| 報考門檻 | 限 Claude Partner Network 組織，個人不可 | 每季 |
| CCAO-F 不計入 partner tier | 官方認證頁仍有此註記 | 每半年 |
| 四張規格 | $99／$125／$125／$175，60／53／60／63 題 | 每季 |
| 領域權重 | 21-16-15-14-12-12-10、33.1-16.8-14.7-11.0-10.6-8.1-3.1-2.6、27-18-20-20-15、19-17-16-14-14-13-7 | 每季 |
| 重考規則 | 14 / 30 / 90 天，12 個月 4 次 | 每半年 |
| 三角色 vs 四認證的命名不一致 | 兩份官方頁仍不同調 | 每次頁面改版 |

## 參考資料

- [Pearson VUE — Claude Certification Program（報考門檻、重考與監考規則）](https://www.pearsonvue.com/us/en/anthropic.html)
- [Anthropic：四張角色制認證公告](https://claude.com/blog/four-role-based-claude-certifications)
- [Claude Certified Associate – Foundations 官方認證頁](https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification)
- [Claude Certified Developer – Foundations 官方認證頁](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [Claude Certified Architect – Foundations 官方認證頁](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
- [Claude Certified Architect – Professional 官方認證頁](https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification)
- [Claude Academy FAQ（免費課程證書與監考認證的差別）](https://academy.claude.com/help/faq)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Claude Certified Associate（CCAO-F）備考路徑](/posts/ai/2026-08-18-claude-certified-associate-prep-guide)
- [Claude Certified Developer（CCDV-F）備考路徑](/posts/ai/2026-08-18-claude-certified-developer-prep-guide)
- [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
- [Claude Certified Architect Professional（CCAR-P）備考路徑](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide)
- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [AI 治理框架對照](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains)
- [prompt 與 context engineering 的考法](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains)
