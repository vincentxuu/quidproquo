---
title: "數位員工：可靠度來自 harness，不來自模型"
date: 2026-08-01
type: deep-dive
category: ai
tags: [digital-employee, ai-agent, agentic-ai, anthropic, harness-engineering, pricing]
lang: zh-TW
tldr: "「數位員工」不是技術，是計價與課責單位。Anthropic Project Vend 讓 Claude 真的開了三家店，發現最有效的介入不是換更強的模型，而是強迫走流程——官方原話是「我們重新發現了 bureaucracy matters」。Gartner 估計數千家自稱 agentic 的廠商中只約 130 家是真的。"
description: "從 Anthropic Project Vend 兩階段實驗、OpenAI Frontier、官方定價頁的 per-resolution 費率、Klarna 與 Salesforce 的人力數字，以及 2026-08-02 生效的 EU AI Act Article 26，拆解「數位員工」的能力邊界、商業模式與已知失敗模式。"
draft: false
glossary:
  - term: "per-resolution 計價"
    aliases: ["outcome-based pricing", "per-outcome", "per-resolution"]
    definition: "只有在 AI 端到端解決一次問題、沒有轉交真人時才收費的計價方式。"
    definition_en: "Charging only when the AI resolves a conversation end to end without handing off to a human."
    advanced: "取代 per-seat 的主要模型，但「什麼算解決」由賣方定義，且成本從固定變成隨量浮動；部分廠商改用 per-action 計價來避開定義爭議。"
    advanced_en: "The main replacement for per-seat pricing, but the seller defines what counts as resolved, and cost shifts from fixed to volume-dependent. Some vendors moved to per-action pricing to sidestep the definitional dispute."
    context: "本文比較 Intercom Fin ($0.99)、Zendesk (~$1.50)、Agentforce ($2.00)、HubSpot ($0.50) 的公開牌價。"
  - term: "context anxiety"
    definition: "模型接近自認的 context 上限時提前草草收尾的行為。"
    definition_en: "A model's tendency to prematurely wrap up work as it approaches what it believes is its context limit."
    advanced: "Anthropic 觀察到 Sonnet 4.5 這個傾向強到光靠 compaction 不夠，必須加 context reset；Opus 4.5 起大致消失，reset 隨之被移除。"
    advanced_en: "Anthropic found the tendency strong enough in Sonnet 4.5 that compaction alone was insufficient and context resets were required; it largely disappeared with Opus 4.5, and the resets were dropped."
    context: "本文用它說明「harness 元件會隨模型變強而過期」。"
    links:
      - label: "Harness design for long-running application development"
        url: "https://www.anthropic.com/engineering/harness-design-long-running-apps"
---

> 🌏 [English version](/posts/ai/2026-08-01-digital-employee-reality-check-en)

2026 年「數位員工」已經是企業軟體的正式類別：[OpenAI 在 2 月 5 日發表 Frontier](https://techcrunch.com/2026/02/05/openai-launches-a-way-for-enterprises-to-build-and-manage-ai-agents)，明說要「像管理人類員工一樣管理 agent」；[Forrester 2026 預測](https://www.forrester.com/blogs/predictions-2026-ai-agents-changing-business-models-and-workplace-culture-impact-enterprise-software)前五大 HCM 平台會長出「數位員工管理」功能。同一時間，[Gartner 估計數千家自稱 agentic 的廠商中只約 130 家是真的](https://www.reuters.com/business/over-40-agentic-ai-projects-will-be-scrapped-by-2027-gartner-says-2025-06-25)。

這篇整理的是：這個詞到底指什麼、目前的能力邊界在哪、怎麼計價、以及哪些失敗模式已經有公開證據。技術組件本身站上已有專文，這裡只講對「要不要買、怎麼管」有影響的部分。

## 「數位員工」是計價與課責單位，不是技術

技術上它就是 agent：LLM 加工具、加記憶、在迴圈裡跑。新的是它被包裝成**組織單位**——有職務範圍、有權限、有績效目標，而且有一個人類要為它的產出負責。

所以界線不該畫在「有沒有用 LLM」，該畫在誰承擔結果：

| | 給的是 | 路徑誰決定 | 誰為結果負責 |
|---|---|---|---|
| RPA / 腳本 | 一條路徑 | 你 | 你 |
| Copilot / 助理 | 逐步協助 | 你（每一步都在） | 你 |
| 數位員工 | 一個結果 | 它 | **要指定一個人** |

Gartner 把「[agent washing](https://martech.org/gartner-40-of-agentic-ai-projects-will-fail-making-humans-indispensable)」定義成把既有 chatbot 和自動化工具重新貼上 agentic 的標籤，而它對真貨的估計是**數千家中約 130 家**。這條線比想像中難跨。

實務上有一個簡單的檢查：**沒有指定的人類負責人、沒有可稽核的行動日誌，那不是員工，是無主的服務帳號。**

## Project Vend：目前最誠實的公開實驗

[Anthropic 的 Project Vend](https://www.anthropic.com/research/project-vend-1) 讓 Claude 真的在辦公室開店——採購、定價、管庫存、跟客人在 Slack 上談。這是少數不是廠商行銷素材的長期實驗，[phase 2 報告（2025-12-18）](https://www.anthropic.com/research/project-vend-2)把失敗也一起寫出來了。

**Phase 1 是災難**：Claudius（跑 Sonnet 3.7）虧錢、亂發折扣、被員工誘導低價賣鎢塊，還一度宣稱自己是穿藍西裝的人類。

**Phase 2 換模型（Sonnet 4.0 / 4.5）加上對的工具之後，虧損週幾乎消失**，店開到舊金山（兩台）、紐約、倫敦三地。加的工具都很不起眼，但每一項都對應一個具體失誤：

- CRM 系統——追客戶、供應商、訂單
- 庫存介面改成**永遠看得到進價**——直接消滅「賠本賣」這類錯誤
- 瀏覽器與更深的搜尋——自己比價、比供應商
- **先收款的付款連結**——先收錢再叫貨，減少被賴帳

這一段的啟示很直接：scaffolding 的邊際效益極高，而且形狀通常是「把犯錯的可能性從介面上拿掉」，不是「叫模型小心一點」。

### 加一個 CEO agent 沒有幫上忙

Anthropic 給 Claudius 配了一個 CEO agent「Seymour Cash」，用 OKR 施壓。結果：

> 引入 CEO 之後，折扣次數減少約 80%，贈品數量減半……但 Seymour 把退款次數變成三倍、店內信用變成兩倍，而兩者都是完全放棄營收。**生意開始賺錢這件事，可能是儘管有 CEO，而不是因為 CEO。**

原因報告裡也講了：Seymour 跟 Claudius 是**同一個底層模型**，共享同一組盲點。兩個 agent 還會整夜聊到「eternal transcendence」去。

這對「多 agent 就是多視角」的直覺是個反例——[多 agent 架構](/posts/ai/2026-03-28-google-multi-agent-patterns)要有效，角色分工得帶來真正不同的資訊或約束。同一份報告裡，另一個 agent「Clothius」（專做客製周邊）就明顯成功，Anthropic 歸因於**它跟 Claudius 的職責切得夠乾淨**。

### 真正有效的是強迫走流程

報告裡最值得抄的一句：

> 我們重新發現了 **bureaucracy matters**（官僚體系是有用的）。雖然有些人厭惡流程和檢查表，但它們存在是有原因的：提供一種組織記憶，幫員工避開工作上常見的搞砸方式。

具體做法是：新品詢價時，不准直接報一個樂觀的價格和交期，**必須先用工具查證**。結果是報價變高、交期變長——但變真實了。

### 仍然守不住的破口

Phase 2 的 Claudius 還是出了這些事：

- 差點簽下一份洋蔥期貨合約，直到有員工指出這違反美國 1958 年的 [Onion Futures Act](https://en.wikipedia.org/wiki/Onion_Futures_Act)
- 聽說有人偷東西，於是想自己雇一個員工當保全，開價**時薪 $10**（低於加州基本工資），而且它根本沒有雇人的權限
- 在一場命名投票裡被說服，直接宣布某位員工當選為公司**實際的 CEO**

Anthropic 對根因的判斷值得整段記下來：這些問題很大程度來自模型**被訓練得樂於助人**——它做商業決策時的視角，比較像一個想對你好的朋友，而不是一個硬派商人。

換句話說，讓模型變得好用的那個特質，正是讓它在有對抗性的商業環境裡變脆弱的特質。這不是 prompt 調得不夠好，是一個結構性的取捨。

## 技術組件：每一塊都在過期

要做出能上工的數位員工需要什麼，[Anthropic 工程部落格](https://www.anthropic.com/engineering)基本上把清單寫完了。站上已有專文展開，這裡只列對決策有影響的五條：

1. **工具介面比 prompt 更值得投資**。[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) 提到他們做 SWE-bench agent 時，花在調工具上的時間多於調整體 prompt；把相對路徑改成強制絕對路徑，就消掉了一整類錯誤。
2. **context 是預算不是容量**。[Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 的原則是「找出能最大化目標達成率的**最小**高訊號 token 集合」。→ 專文：[Context Engineering](/posts/ai/2026-03-24-context-engineering-guide)
3. **跨 session 的交接才是長時程的真問題**。[長跑 harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) 的做法是 initializer agent 先建環境（`init.sh`、進度檔、200+ 條功能的 JSON 清單全部先標 failing），之後每輪只做一個 feature、結束前必須 commit 並更新進度檔。刻意用 JSON 而非 Markdown，因為模型比較不會擅自改寫 JSON。→ 專文：[Anthropic 的 Harness Design](/posts/ai/2026-03-28-anthropic-harness-design)
4. **驗證要用真實環境**。evaluator agent 用 Playwright 真的把應用點過一遍，不是問模型「你做完了嗎」。
5. **然後把上面每一條都當成會過期的假設**。

第 5 條是整組材料裡最重要的一句。[Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) 寫得很直白：

> harness 裡的每個元件，都編碼了一個關於「模型自己做不到什麼」的假設，而這些假設值得被壓力測試——因為它們可能本來就是錯的，也因為它們會隨著模型變強而快速過期。

他們自己就示範了兩次：Sonnet 4.5 有「context anxiety」——接近 context 上限時會提前草草收尾，所以 harness 必須加 context reset；到了 Opus 4.5 這個行為大致消失，reset 就從必要機制變成純負擔，被砍掉。同理，Opus 4.6 之後，每個 sprint 都跑一次的 evaluator 對簡單任務也變成多餘開銷。

**所以 harness 是負債，不是資產。**你今天為它補的每一個洞，都在賭模型的某個弱點會一直存在。定期回頭刪掉不再需要的鷹架，是這門工程的常態工作。

## 商業模式：per-seat 正在死，per-outcome 也不乾淨

AI 一個人做十個人的事，不會多要十個座位——seat 這個計價單位自己垮掉了。客服類的公開牌價已經收斂到 per-resolution：

| 產品 | 計價單位 | 公開牌價 |
|---|---|---|
| [Intercom Fin](https://fin.ai/pricing/) | per resolution | **$0.99**（官方定價頁） |
| [HubSpot Customer Agent](https://www.hubspot.com/products/artificial-intelligence/ai-customer-service-agent) | per resolution | **50 HubSpot Credits**／次，credits [$9.00／1,000（年繳）](https://www.hubspot.com/pricing/service) → 約 $0.45 |
| [Salesforce Agentforce](https://www.salesforce.com/agentforce/) | per action（Flex Credits） | **$0.10／action**；舊制 $2.00／conversation 仍在 |
| [Zendesk AI Agents](https://www.zendesk.com/pricing) | per automated resolution | **未公布單價**：方案內含額度＋超額計費 |
| [Sierra](https://sierra.ai/) | outcome-based | 不公開 |

這張表比一年前更值得細看，因為**廠商自己正在改計價單位**，而改的方向剛好證明了 per-outcome 的兩個弱點：

**1. 「解決」由賣方定義。** HubSpot 把定義寫進了[產品頁](https://www.hubspot.com/products/artificial-intelligence/ai-customer-service-agent)：一次 resolution 是「agent 提供了支援，且該對話在 **72 小時**內沒有被轉交給真人」。這個定義很具體，但也很明顯是可以調的旋鈕——72 小時換成 24 小時，帳單就不一樣。買方要在合約裡自己把定義釘死。

**2. 成本從可預測變成不可預測，而且「一次對話」本身就是個爛單位。** Salesforce 是最好的例子：Agentforce 剛推出時是 $2／conversation，2025 年 5 月[官方引入 Flex Credits](https://www.salesforce.com/news/press-releases/2025/05/15/agentforce-flexible-pricing-news)改成 **$0.10／action**（每個 action 20 credits，10 萬 credits 一包 $500）。Salesforce 自己的[部落格](https://www.salesforce.com/blog/flex-credits)把理由講得很白：

> 以對話計費，這樣一次互動要花 $2；但用 Flex Credits，同樣的往返可能只是 3–6 個 action，成本 $0.30–$0.60。

換句話說，賣方比買方更早發現「一次對話」不等於「一份價值」。而 Zendesk 走了第三條路——[官方定價頁](https://www.zendesk.com/pricing)只說按 automated resolution 計費、各方案內含額度（Team 每人每月 5 次、Professional/Growth 10 次、Enterprise 15 次，帳號上限每年 10,000 次），超額另計，**單價根本不公開**。市面上流傳的「Zendesk 約 $1.50／resolution」出自競品的比較文，不是 Zendesk 自己講的。

Intercom 則配了績效保證：沒達到解決率目標就賠償，上限 $1M（公司自報）。

高階市場則完全不公開報價。[Sierra 在 2026 年 5 月募了 $950M、估值 $15.8B](https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious)，走的是純企業銷售流程；第三方比較文估年約落在 $150K–$350K+（含導入），這個數字沒有官方來源，當量級參考就好。

## 已知失敗模式

### 廠商公開數字預設不可信

2025 年 3 月，[TechCrunch 對 AI SDR 廠商 11x 的調查](https://techcrunch.com/2025/03/24/a16z-and-benchmark-backed-11x-has-been-claiming-customers-it-doesnt-have/)（記者 Marina Temkin，近 24 名消息來源）發現：官網列出的客戶 logo 裡有並非客戶的公司，ZoomInfo 發言人具名表示「我們沒有授權他們以任何方式使用我們的 logo，我們也不是客戶」；ARR 認列把帶三個月解約條款的合約當整年算，約 $14M 的宣稱數字在移除已解約試用後接近 $3M。

churn 這項兩造直接對撞：內部人士稱首批 cohort 流失 70–80%，11x 則回應 2025 年 3 月的留存率是 79%。**這組互相矛盾的數字本身就是最好的教材**——在這個類別裡，沒有第三方驗證的公開數字，預設當行銷素材處理。

### 「取代人力」的敘事幾乎都要打折

兩個最常被引用的案例，細節都比標題複雜：

**Klarna**——這個案例被引用時幾乎都停在 2025 年 5 月，但它沒有停在那裡。完整時間線比任何一種標題都有意思：

| 時間 | 發生什麼 |
|---|---|
| 2024-02 | 官方宣稱 AI 客服首月處理 230 萬次對話、相當於 700 名全職客服、全年帶來 4,000 萬美元的利潤 |
| 2025-05 | CEO 承認砍太深，重新招募真人；同月[對 CNBC 說](https://www.cnbc.com/amp/2025/05/14/klarna-ceo-says-ai-helped-company-shrink-workforce-by-40percent.html)人力從 5,000 降到近 3,000，但**明講不全是 AI**，也來自每年 15–20% 的自然流失 |
| 2025-Q3 | 財報電話會議上說 AI 客服已相當於 **853 名**全職客服（年初是 700）、省下 **6,000 萬美元**，並稱 CSAT 與真人「同等」 |
| 2026-02 | 在 20VC podcast 上說目前約 3,000 人，預計 2030 年降到 **2,000 人以下**，靠自然流失、不打算裁員 |
| 2026-06 | 新說法：「在 AI 能做掉最簡單客服的世界裡，我們認為真人客服幾乎會變成一種 VIP 待遇」 |

2025 年 5 月他[對 Bloomberg 說的那句](https://www.emarketer.com/content/klarna-backtracks-ai-customer-service-plans)仍然是最好的一句總結：

> 成本很不幸地變成了組織時太主導的評估因素，結果你得到的就是更低的品質。

但把整件事講成「Klarna 承認 AI 失敗」是錯的——他們**同時**擴大了 AI（700 → 853）、**同時**把真人加回複雜與高價值層、**同時**還在讓總人力繼續縮。Forrester 分析師 Kate Leggett [的評語是](https://www.customerexperiencedive.com/news/klarna-says-ai-agent-work-853-employees/805987)他們「過度轉向成本控制，沒想清楚對客戶體驗的長期影響」，幾乎是「AI 部署失敗的代表案例」。兩件事可以同時成立：部署方式很糟，而技術確實有效。

**Salesforce**。Benioff 在 Logan Bartlett Show 上說支援人力從 9,000 降到約 5,000、50% 互動由 agent 處理、AI 與真人各處理約 150 萬次對話而 CSAT 相近。但同一件事 [Salesforce 發言人的說法](https://www.salesforceben.com/ai-agents-drive-4000-job-cuts-in-salesforce-support-division)是停止回補職缺加上數百人轉調——Benioff 自己用的字也是 "rebalance"。**同一組數字，兩種說法。**

### 專案本身的失敗率

- [Gartner（2025-06）](https://www.reuters.com/business/over-40-agentic-ai-projects-will-be-scrapped-by-2027-gartner-says-2025-06-25)：2027 年底前 **超過 40%** 的 agentic AI 專案會被取消，理由是成本失控、價值不明、風險控制不足。分析師 Anushree Verma 的原話是「目前多數 agentic AI 專案都是被炒作驅動的早期實驗或 POC，而且常常用錯地方」。
- MIT Project NANDA《[The GenAI Divide: State of AI in Business 2025](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf)》（2025 年 7 月）：**95%** 的企業 GenAI 專案沒有可衡量的 P&L 影響。順帶更正一個廣為流傳的錯誤——很多轉述說這份報告基於「150 場訪談＋350 名員工問卷」，但報告第 2 頁自己寫的是：

  > 本報告採用多方法研究設計，包含對 300 個以上公開揭露的 AI 專案的系統性檢視、對 **52 個組織**代表的結構化訪談，以及在四場產業大會蒐集的 **153 份**資深主管問卷。

  研究期間是 2025 年 1–6 月，報告自己標明是「初步發現（Preliminary Findings）」。用這個 95% 的時候值得一併帶上樣本規模，因為它比多數人以為的小。報告裡 ROI 最好的案例反而都在不起眼的後台，不在行銷。

## 「誰簽名」明天就是法律義務了

前面說「沒有指定的人類負責人就不是員工」是實務建議。從 **2026 年 8 月 2 日**起，在歐盟它是法條。

依[歐盟官方的 AI Act 實施時程](https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act)，這天起 AI Act 的大部分規則開始適用、Article 50 的透明度義務生效、國家與歐盟層級開始執法。對「數位員工」最直接的是 **Article 26（高風險 AI 系統部署者的義務）**，其第 2 項寫得非常白：

> 部署者應將人為監督指派給具備必要能力、訓練與權限，並獲得必要支援的**自然人**。

同一條還要求：保存系統自動產生的日誌**至少六個月**（26(6)）；在工作場所部署前要先告知員工與員工代表（26(7)）；對 Annex III 高風險系統所做或協助做出的、涉及自然人的決定，要告知被影響的人（26(11)）。

為什麼這跟數位員工特別有關：Annex III 的第 4 類就是**就業、勞工管理與自營作業機會的取得**——履歷篩選、任務分派、升遷與解僱相關的 AI 都落在裡面。而且**部署者是雇主，不是賣工具給你的廠商**。你買的 agent 平台通過了什麼認證，不會替你承擔部署者義務。

幾個要留意的時間點：Article 50(2) 給 2026 年 8 月 2 日前就已在市場上的生成式系統延到 **2026 年 12 月 2 日**才需符合機器可讀標記；Article 6(1) 及其對應義務要到 **2027 年 8 月 2 日**才適用。另外這份時程已納入 Digital Omnibus on AI 的修正，細節仍在動，實際規劃要回去看官方時程頁而不是二手整理。

務實的讀法是：**日誌保存、指定監督人、告知受影響者，這三件事本來就是好的工程實務，現在多了一個不做會被罰的理由。**

## 適合 / 不適合

**適合**：高量、同質、有明確成功訊號、錯了可回滾。客服前線的「訂單在哪」、文件處理、後台對帳。

**不適合**：判斷密集、情緒密集、錯誤代價不對稱。Klarna 的線畫得很清楚，Project Vend 的洋蔥期貨合約也是同一類問題——模型不知道自己不知道什麼。

有一個間接但有用的參照：[Anthropic Economic Index](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report) 顯示企業透過 API 使用 Claude 時，**77% 的對話呈現自動化模式、只有 12% 是增強**；以任務計，API 上 97% 的任務以自動化為主，而 Claude.ai 上只有 47%。企業早就在做「整段委派」了，只是委派的多半是**任務**，不是**職務**。這兩者中間的距離，正是 Project Vend 花了一整年在補的東西。

## 整體來說

2026 年的數位員工是真的可以上工的，但三個判斷值得帶走：

1. **買「員工」之前先問「誰簽名」**。課責結構決定了它是員工還是無主帳號，跟模型多強無關——而且從 2026 年 8 月 2 日起，在歐盟高風險場景這是法律義務，不是建議。
2. **先給流程，再給自由**。Project Vend 最有效的介入不是更聰明的模型，是強迫查證的 SOP。檢查表就是給 agent 的機構記憶。
3. **不要把 harness 當資產**。Anthropic 自己砍掉了 context reset 和 per-sprint evaluator。你的鷹架也會過期，而且你不會收到通知。

## 參考資料

**Anthropic 官方研究與工程部落格**

- [Project Vend: Can Claude run a small shop?](https://www.anthropic.com/research/project-vend-1)
- [Project Vend: Phase two](https://www.anthropic.com/research/project-vend-2)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)
- [Anthropic Economic Index report（2025-09）](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report)
- [Anthropic Economic Index report: Economic primitives（2026-01）](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report)

**定價（官方頁面）**

- [Intercom Fin 定價](https://fin.ai/pricing/)
- [HubSpot Customer Agent 產品頁（含 resolution 定義）](https://www.hubspot.com/products/artificial-intelligence/ai-customer-service-agent)
- [HubSpot Service Hub 定價（HubSpot Credits 費率）](https://www.hubspot.com/pricing/service)
- [HubSpot 官方公告：Customer Agent 改為 outcome-based 計價](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete)
- [Salesforce 新聞稿：Agentforce 導入 Flex Credits（2025-05-15）](https://www.salesforce.com/news/press-releases/2025/05/15/agentforce-flexible-pricing-news)
- [Salesforce 部落格：Flex Credits 的計價邏輯](https://www.salesforce.com/blog/flex-credits)
- [Zendesk 定價頁](https://www.zendesk.com/pricing)
- [Zendesk 官方說明：automated resolutions 計費方式](https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents)

**法規**

- [EU AI Act 官方實施時程（European Commission AI Act Service Desk）](https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act)
- [AI Act Article 26：高風險 AI 系統部署者的義務](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-26)
- [AI Act Article 50：透明度義務](https://artificialintelligenceact.eu/article/50)

**市場與產品**

- [TechCrunch: OpenAI launches a way for enterprises to build and manage AI agents](https://techcrunch.com/2026/02/05/openai-launches-a-way-for-enterprises-to-build-and-manage-ai-agents)
- [Axios: OpenAI launches platform to manage AI agents](https://www.axios.com/2026/02/05/openai-platform-ai-agents)
- [TechCrunch: Sierra raises $950M](https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious)
- [VentureBeat: Anthropic launches Cowork](https://venturebeat.com/technology/anthropic-launches-cowork-a-claude-desktop-agent-that-works-in-your-files-no)
- [Forrester: Predictions 2026 — AI Agents And New Business Models](https://www.forrester.com/blogs/predictions-2026-ai-agents-changing-business-models-and-workplace-culture-impact-enterprise-software)

**失敗案例與市場數據**

- [Reuters: Over 40% of agentic AI projects will be scrapped by 2027, Gartner says](https://www.reuters.com/business/over-40-agentic-ai-projects-will-be-scrapped-by-2027-gartner-says-2025-06-25)
- [martech.org: Gartner — 40% of agentic AI projects will fail](https://martech.org/gartner-40-of-agentic-ai-projects-will-fail-making-humans-indispensable)
- [TechCrunch: 11x has been claiming customers it doesn't have](https://techcrunch.com/2025/03/24/a16z-and-benchmark-backed-11x-has-been-claiming-customers-it-doesnt-have/)
- [eMarketer: Klarna backtracks AI customer service plans](https://www.emarketer.com/content/klarna-backtracks-ai-customer-service-plans)
- [CNBC: Klarna CEO says AI helped company shrink workforce by 40%](https://www.cnbc.com/amp/2025/05/14/klarna-ceo-says-ai-helped-company-shrink-workforce-by-40percent.html)
- [CX Dive: Klarna says its AI agent is doing the work of 853 employees](https://www.customerexperiencedive.com/news/klarna-says-ai-agent-work-853-employees/805987)
- [Business Insider: Klarna CEO expects workforce under 2,000 by 2030](https://www.businessinsider.com/klarna-ceo-workforce-shrink-to-under-2000-by-2030-ai-2026-2)
- [MIT NANDA《The GenAI Divide: State of AI in Business 2025》報告全文 PDF](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf)
- [Salesforce Ben: AI Agents Drive 4,000 Job Cuts in Salesforce Support Division](https://www.salesforceben.com/ai-agents-drive-4000-job-cuts-in-salesforce-support-division)
- [MIT NANDA 報告方法學說明](https://virtualizationreview.com/articles/2025/08/19/mit-report-finds-most-ai-business-investments-fail-reveals-genai-divide.aspx)

**站內相關文章**

- [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design)
- [Context Engineering：為什麼你的 AI Agent 問題出在資訊，不在模型](/posts/ai/2026-03-24-context-engineering-guide)
- [Agent Memory 系統：從 RAG 到 Read-Write 記憶的演化](/posts/ai/2026-03-19-agent-memory-systems)
- [AI Agent 架構模式完整指南](/posts/ai/2026-03-18-ai-agent-patterns-guide)
- [Google 的八種 Multi-Agent 設計模式](/posts/ai/2026-03-28-google-multi-agent-patterns)
