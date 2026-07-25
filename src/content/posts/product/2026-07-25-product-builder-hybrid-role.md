---
title: "Product Builder 是什麼？跟 PM 的差別與轉型路徑"
date: 2026-07-25
type: deep-dive
tldr: "Product Builder 是能獨立跑完「發現問題→設計→建造」完整循環的人。跟 PM 最大的差別是：PM 靠權威影響團隊執行，Product Builder 靠能力直接產出可用產品。LinkedIn 已用 Associate Product Builder track 取代原本的 APM 計畫，PayFit 早在 2019 年就定義了這個角色。"
category: product
tags: [product-builder, product-management, ai, vibe-coding, career]
lang: zh-TW
description: "Product Builder 是什麼、跟 Product Manager 差在哪、需要什麼能力、以及 PM／設計師／工程師各自該怎麼轉型。附 LinkedIn、Walmart、PayFit 的實際案例、Roman Pichler 與 SVPG 的反方論證，以及 Builder PM／Integrator PM 的角色分岔。"
glossary:
  - term: "vibe coding"
    aliases: ["Vibe Coding"]
    definition: "不逐行寫程式，而是用自然語言描述你要什麼、讓 AI 生成實作，人負責看結果對不對。Andrej Karpathy 在 2025 年 2 月提出這個說法。"
    advanced: "實務上的瓶頸不在生成而在驗證：模型產出能跑的程式碼的能力持續進步，產出安全程式碼的能力卻幾乎沒有改善，所以審查與測試的成本會回到人身上。"
    context: "常出現在 Claude Code、Cursor、Lovable、Replit 這類 AI 編碼工具的討論。"
  - term: "PRD"
    aliases: ["Product Requirements Document"]
    definition: "產品需求文件，PM 用來定義一個功能「要做什麼、為什麼做、怎麼驗收」的書面規格。傳統流程中，PRD 是工程團隊開始動工的前提。"
    advanced: "Anthropic 的做法是幾乎不寫 PRD——直接做出 working prototype，用可運行的東西取代書面規格。Cat Wu 說他們用 team principles 取代 PRD，只有特別模糊或需要重基建的專案才會寫一頁式文件。"
    context: "本文用來對比 PM（產出是 PRD）和 Product Builder（產出是可用的 prototype）。"
  - term: "prototype"
    aliases: ["原型"]
    definition: "一個可以實際操作、用來測試想法的早期版本。在本文的語境裡，prototype 不是紙上草圖或靜態 Figma 截圖，而是能跑、能點、能讓用戶試用的 working version。"
    advanced: "Boris Cherny 的團隊在出貨前會做上百個 prototype 進行測試，其中約 80% 不會上線。prototype 的價值不在於完美，在於讓你用最低成本驗證假設是否成立。"
    context: "注意本文同時用了「原型」的兩個意思：Boris 的五種「角色原型（archetype）」和產品開發的「原型（prototype）」，兩者不同。"
  - term: "outcome"
    aliases: ["成果"]
    definition: "產品上線後實際產生的商業或用戶結果——留存率有沒有提高、營收有沒有成長、用戶問題有沒有被解決。跟 output（產出量，例如上了幾個功能、寫了多少行程式碼）是不同的概念。"
    advanced: "SVPG 觀察到的核心問題就是 output 和 outcome 的脫鉤：團隊靠 AI 交付得更快（output 增加），但 outcome 沒有跟著變好。被加速的是產出，不是判斷。"
    context: "本文在討論 AI 是否真的讓產品開發變好時，反覆用到這個 output vs outcome 的對比。"
  - term: "OWASP Top 10"
    definition: "開放網路應用安全計畫（OWASP）整理的十大最常見、最危險的網頁應用程式安全風險清單，包含 SQL injection、XSS、身分驗證漏洞等。是業界衡量程式碼安全性的基準。"
    advanced: "Veracode 2025 年報告以 OWASP Top 10 為基準測試 AI 生成的程式碼，發現 45% 引入了這個等級的漏洞。這個數字的嚴重性在於：這不是冷門邊緣的攻擊手法，而是最基本、最該被擋下的那一層。"
    context: "本文引用這個標準來說明 Product Builder 不能盲目信任 AI 產出的程式碼。"
  - term: "XSS"
    aliases: ["Cross-Site Scripting", "跨站腳本攻擊"]
    definition: "一種網頁安全漏洞，攻擊者把惡意腳本注入到其他用戶會看到的頁面裡，可以竊取登入憑證、冒充用戶操作。是 OWASP Top 10 的常客。"
    context: "本文提到 Veracode 報告中 XSS 在相關樣本裡有 86% 沒被 AI 擋下。"
  - term: "用戶訪談"
    aliases: ["user interview"]
    definition: "產品團隊跟真實用戶一對一對話，了解他們的使用情境、痛點和期待。通常 15–30 分鐘，重點是聽用戶描述行為和動機，不是推銷功能或要求評分。"
    advanced: "跟問卷調查的差別在於深度：問卷告訴你「多少人碰到這個問題」，訪談告訴你「為什麼會碰到、碰到時在想什麼、目前怎麼繞過去」。Product Builder 需要這個能力，因為沒有 PM 幫你翻譯用戶需求。"
    context: "本文建議工程師每週做 3 場 15 分鐘的用戶訪談作為轉型起步。"
  - term: "用戶面指標"
    aliases: ["user-facing metric"]
    definition: "直接反映用戶行為或感受的量化指標，例如 activation rate（啟用率）、retention（留存率）、NPS（淨推薦值）、task completion rate（任務完成率）。跟工程指標（latency、uptime、error rate）不同，後者衡量系統健康，前者衡量用戶是否得到價值。"
    context: "本文建議工程師認領一個用戶面指標，把 customer signal 變成每天盯的數字。"
  - term: "session recording"
    aliases: ["工作階段錄影"]
    definition: "用工具（如 Hotjar、FullStory、PostHog）錄下真實用戶在你的產品上的操作過程——滑鼠移動、點擊、捲動、猶豫、放棄。不需要用戶知情以外的設定，就能看到「用戶實際怎麼用」而不是「用戶說他怎麼用」。"
    context: "本文建議工程師每週看 5 段 session recording，作為培養產品感的起步。"
  - term: "production-grade"
    aliases: ["生產等級"]
    definition: "程式碼或產品已經達到可以面對真實用戶、承受真實流量的品質——包含錯誤處理、安全性、效能、監控和部署流程都到位。跟 prototype（能跑就好）的差別在於：壞掉的時候會不會傷到用戶。"
    context: "Boris 定義 Builder 原型的核心能力就是把 prototype 推進到 production-grade。"
  - term: "技術債"
    aliases: ["technical debt"]
    definition: "為了短期速度而在程式碼品質上做的妥協，像是跳過測試、硬寫繞過去、複製貼上而不重構。就像借錢一樣，現在省時間，之後要連本帶利地用更多時間還。"
    advanced: "在 Product Builder 的語境裡特別值得注意：一個人快速出貨的模式天生容易累積技術債，因為沒有其他工程師在旁邊擋住品質。這也是文章裡 LogRocket 成本試算漏掉的一項。"
    context: "本文在分析 Product Builder 模式的隱藏成本時提到。"
  - term: "APM"
    aliases: ["Associate Product Manager"]
    definition: "大型科技公司培訓初階產品經理的輪調計畫，通常招收應屆畢業生，兩年內輪過數個產品團隊。Google、LinkedIn、Meta 都有類似制度。"
    advanced: "LinkedIn 已於 2026 年結束 APM 計畫，改設 Associate Product Builder（APB）track，訓練重心從協調與 roadmap 移向自己動手做出東西。"
    context: "討論產品經理職涯入口與 Product Builder 轉型時常出現。"
faq:
  - q: "Product Builder 是什麼？"
    a: "Product Builder 是能把想法從概念推到可用產品、對其他團隊依賴降到最低的人。他同時具備產品判斷、基本設計、以及用 AI 工具動手建造的能力，能獨立跑完「發現問題 → 設計解法 → 建造驗證」的完整循環，而不需要在 PM、設計、工程之間層層交接。"
  - q: "Boris Cherny 的五種原型是什麼？"
    a: "Claude Code 創造者 Boris Cherny 觀察自己團隊的工作方式，歸納出五種角色原型：Prototyper（不斷產出新想法，多數不會上線）、Builder（把存活的 prototype 推進到 production-grade）、Sweeper（清理 UI、簡化系統、下架不必要的功能）、Grower（迭代已上線的產品以改善 PMF）、Maintainer（確保成熟系統的安全性與可靠性）。這些原型不綁定職稱——在 Anthropic，設計師、工程師、PM 都可能是其中任何一種。"
  - q: "五種原型跟 Product Builder 是什麼關係？"
    a: "Boris 的五種原型描述的是一個人在產品裡怎麼貢獻，Product Builder 描述的是一個人能不能獨立跑完整個產品循環。兩者互補：五種原型是透鏡（你現在在 prototype、build、還是 sweep？），Product Builder 是角色主張（一個人應該能跨越多種原型）。實務上，一個好的 Product Builder 需要能在多種原型之間切換，而 Boris 觀察到的常態是一個人橫跨 2–3 種。特別值得注意的是 Sweeper——如果只會 prototype 和 build 卻不會做減法，做出來的東西會臃腫到無法維護。"
  - q: "Product Builder 跟 Product Manager 差在哪？"
    a: "最核心的差別是影響力的來源。PM 透過權威影響團隊執行，產出是 PRD 和 roadmap；Product Builder 透過能力直接貢獻產出，交付的直接就是可用的 prototype 或功能。PM 需要說服團隊去做，Product Builder 可以自己先做出來再談。"
  - q: "成為 Product Builder 需要哪些能力？"
    a: "四塊：技術面要有基本的 Python／JavaScript 和 API 串接能力，能跟 AI pair programming；設計面要能用 v0、Lovable、Claude Design 或 Claude Artifacts 產出可互動的 prototype，在 working code 層級判斷 UX 好不好；產品面要會用戶研究、SQL 數據分析和假設驗證；AI 素養則包含 prompt engineering 和判斷 AI 產出邊界的能力。重點不是每項精通，而是每項都懂到足以獨立推進。"
  - q: "Product Builder 會取代 PM、設計師和工程師嗎？"
    a: "不會。當產品複雜度提高、需要大規模系統架構或深度用戶研究時，專業分工仍不可取代。Product Builder 最適合的是早期產品探索、內部工具、快速功能迭代這類「先驗證再投入」的階段。"
  - q: "不同公司的 Product Builder 職缺是同一種工作嗎？"
    a: "不是。LinkedIn 的 Associate Product Builder 是取代 APM 的入門級培訓，招沒有正式產品經歷的人；Mews 的 Product Builder 是資深工程師的進階軌，要求高度技術能力；Walmart 的 Agent Developer 明確不需要技術背景，靠低程式碼工具讓營運端的人自己做 agent；PayFit 的 Product Builder 從 2019 年就存在，本質是用自研低程式碼平台 JetLang 設定各國勞動法規，跟 AI 浪潮沒有關係。看到這個職稱時，先問清楚它是從哪個部門長出來的，比研究職稱本身有用。"
  - q: "Product Builder 這個角色有什麼批評或風險？"
    a: "主要有三類。一是 Roman Pichler 指出的「分散式智慧消失」——當一個人做完所有事，參與的專業視角變少，等於帶著更窄的假設跑得更快。二是 SVPG 的觀察：團隊靠 AI 交付變快了，但 outcome 沒有跟著變好，被加速的是產出而不是判斷。三是角色邊界不清造成的實務問題，Userpilot 2026 年調查中有 46.7% 的 PM 擔心被要求用不足的支援做過多的事，31.6% 擔心什麼都做等於什麼都不精。"
  - q: "PM 想轉型成 Product Builder 該從哪裡開始？"
    a: "從補上你缺的那一塊開始。PM 挑 backlog 裡一個問題，用 Claude Code 或 Codex 做 5 個方案各花 30 分鐘，砍掉 4 個留 1 個——練的是用可運行的東西取代會議室裡的爭論。設計師用 v0、Claude Design 或 Claude Artifacts 把設計直接變成可互動的 prototype，在 working code 層級判斷 UX，不再只交 Figma 截圖。工程師這週做 3 場用戶訪談、看 5 段 session recording，然後認領一個用戶面指標。先挑一個小範圍的真實問題從頭做到能上線，比讀十篇文章有用。"
draft: false
---

🌏 [English version](/posts/product/2026-07-25-product-builder-hybrid-role-en)

Anthropic 的 Boris Cherny（Claude Code 的創造者）說了一句話：

> Today coding is practically solved... We're going to start to see the title of 'software engineer' go away. It's just going to be 'builder' or 'product manager.'

這不是預測，這是正在發生的事。

而在 2026 年 6 月，Boris 進一步把這句話展開成一套具體的框架。他[觀察 Claude Code 團隊的工作方式](https://x.com/bcherny/status/2071379474277613732)，發現角色不是按職稱劃分的，而是按五種原型運作：

> 1. **Prototyper**：不斷產出全新想法，大量嘗試但多數不會上線
> 2. **Builder**：把存活的 prototype 快速推進到 production-grade 的產品或基礎設施
> 3. **Sweeper**：清理 UI、簡化程式碼和系統、下架不必要的功能、優化效能
> 4. **Grower**：接手已上線的產品，持續迭代以改善 Product-Market Fit
> 5. **Maintainer**：負責成熟系統的安全性、可靠性、速度和效率

Boris 強調：很多人會橫跨 2–3 種原型，而且這些原型**不綁定職能**——在 Anthropic，有些設計師是 Prototyper，有些是 Sweeper；工程師、PM、資料科學家也一樣。他還提出不同產品階段需要不同的原型組合：pre-PMF 需要大量 1+2+3，成長期需要 2+3+4 加上一些 5，成熟期則以 3+4+5 為主力。

[Aakash Gupta 的延伸分析](https://x.com/aakashgupta/status/2071692050714501494)補充了 Anthropic 讓這套模式運作的文化背景：全員統一頭銜 Member of Technical Staff、不寫 PRD 先做再說、預期多數 prototype 會死（Claude Code 的 spinner 動畫做了 50–100 個版本，80% 從未出貨）、Claude Code 先 review 每個 PR 再由人做最後把關，以及團隊座位旁掛了一張裱框的 [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)。

這則推文累積超過 300 萬次觀看，在中英文圈都引發大量討論（見文末參考資料）。以下這篇文章從「Product Builder」這個更廣的角色切入，把 Boris 的五種原型放在產業脈絡裡看。

## 什麼是 Product Builder

Product Builder 是一個能把想法從概念推到可用產品的人，對其他團隊的依賴降到最低。不是 PM，不是設計師，也不是工程師，但三件事都做得到。

傳統產品開發是一條流水線：PM 寫 spec → Designer 出稿 → Dev 開發 → QA 驗收。每個節點之間都有等待和溝通成本。Product Builder 把這條線壓縮成一個循環，一個人就能快速驗證假設、迭代方案。

核心差異在於：**PM 透過權威影響團隊執行，Product Builder 透過能力直接貢獻產出**。PM 的產出是 PRD 和 roadmap，Product Builder 的產出直接就是可用的 prototype 或功能。

## 為什麼是現在

兩個字：**AI**。

2025 年 2 月，Andrej Karpathy 提出 vibe coding — 不再逐行寫程式，而是用自然語言描述你要什麼，AI 幫你生成。這直接降低了「做出東西」的門檻。關於這套工作方式已經沉澱出哪些具體模式，可以參考 [Encyclopedia of Agentic Coding Patterns 的 190 個 pattern](/posts/ai/2026-04-18-encyclopedia-of-agentic-coding-patterns)。

[McKinsey 找 40 位 PM 做的實驗](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/how-generative-ai-could-accelerate-software-product-time-to-market)顯示，生成式 AI 讓 **PM 個人生產力提升 40%**（主要來自內容密集型任務如寫 PRD、建 backlog 的完成時間大幅縮短）— 但同一份研究裡，整個六個月產品開發週期的上市時間只縮短 **5%**，因為 PM 能加速的只是整條線的一小段。

這個落差值得停下來看：個人產出變快，不等於整條產品線變快。卡住的通常不是「做不出來」，而是決策、對齊、與驗證。這也正是 Product Builder 這個角色主張要拆掉的環節 — 但它同時提醒，把 AI 塞進既有流程而不改流程本身，效益會被交接成本吃掉。

導入的實際進度也比想像慢。[GitLab 2024 Global DevSecOps Report](https://about.gitlab.com/resources/developer-survey/2024/) 常被引用的「78%」指的是**已導入或計畫兩年內導入**；同一份報告裡，回報**實際已導入**的只有 26%。

當 Claude Code、Cursor、Lovable、Replit 這些工具讓一個人能在幾小時內從想法做出 working prototype，傳統的三人組（PM + Designer + Dev）就不再是唯一選項了。

[LogRocket 的文章](https://blog.logrocket.com/product-management/product-builders-future-product-management/)算了一筆帳：傳統三人組一年成本約 120-150 萬美元，而 50-60% 上線的功能表現不如預期。如果一個 Product Builder 能在投入完整工程資源之前就先驗證假設，每年避免 5 個不必要的功能就能省下 50 萬美元以上。

這筆帳看起來很有說服力，但它只算了省下來的錢，沒算新增的成本。至少有三項沒進到分母：

**一、AI 產出的安全與維護成本。** 這筆帳假設 Product Builder 做出來的東西可以直接算進產出，但後面會提到，Veracode 實測 45% 的 AI 生成程式碼帶有 OWASP Top 10 等級漏洞。省下的工程週數，有一部分會以資安審查和技術債的形式回來。

**二、驗證品質下降的機率成本。** 這筆帳的前提是「一個人的驗證跟三個人一樣準」。但少了設計和工程的視角，假設本身可能就更窄——你更快地驗證了一個錯的問題，省下的錢會變成方向錯誤的代價。

**三、outcome 未必改善。** SVPG 觀察到的現象最直接：團隊靠 AI 交付得更快，但 outcome 沒有跟著變好。如果加速的只是產出而不是判斷，那 50 萬美元省的是「做錯東西的成本」還是「做對東西的機會」，這筆帳沒有回答。

換句話說，這個模式真正的財務論證不該是「一個人比三個人便宜」，而是「**在什麼條件下，一個人的判斷不會比三個人差**」。這是個經營問題，不是人力成本問題。

## 市場現狀：誰在做、怎麼定義、開多少錢

### 大公司帶頭

這不是小公司的實驗，大公司已經在動了：

- **[LinkedIn](https://www.lennysnewsletter.com/p/why-linkedin-is-replacing-pms)** 結束了行之有年的 APM 計畫，另設 **Associate Product Builder（APB）** track。CPO Tomer Cohen 的說法：要教他們怎麼寫程式、做設計、做 PM
- **[Walmart](https://public.walmart.com/content/walmart-global-tech/en_us/blog/post/all-in-on-agents.html)** 開出 **Agent Developer** 職位（自稱第一個「biz/tech」職位），不需要技術背景。[人資長](https://www.itbrew.com/stories/how-walmart-is-securing-a-new-cohort-of-ai-builders)：一年前我們沒有任何專職的 agent builder，今天有了
- **Meta** 的 PM 開始自稱「AI Builder」
- **[PayFit](https://backstage.payfit.com/introducing-the-product-builder/)** 早在 2019 年就定義了 Product Builder 角色，用自研的 low-code 語言 JetLang 直接建構功能——跟 AI 浪潮無關

### 同一個職稱，不同的工作

把這些攤開對照，會看到一件很少被指出的事：**「Product Builder」在不同公司指的根本不是同一個角色**。

| 公司 | 正式職稱 | 從哪裡長出來 | 技術背景要求 | 薪資帶 |
|------|---------|-----------|-----------|-------|
| LinkedIn | Associate Product Builder (APB) | 早期職涯培訓，取代 APM | 要能動手，不需是工程專家 | $126k–$207k |
| [Mews](https://developers.mews.com/what-it-means-to-be-a-product-builder-at-mews/) | Product Builder | 資深工程師往上游走 | 是，high-agency 工程師 | 未公開 |
| Walmart | Agent Developer | 營運端，低程式碼工具 | 不需要 | $110k–$220k |
| PayFit | Product Builder | 2019 年就存在，JetLang 領域設定 | 低程式碼，非傳統工程 | 未公開 |

LinkedIn 招的是還沒有產品經歷的人，Mews 招的是資深工程師，Walmart 明確不要技術背景，PayFit 的跟 AI 完全無關。**先問清楚這個職位從哪個部門長出來的，比研究職稱本身有用。**

### 2026 年 7 月職缺快照

以下是撰文時實際在招的 Product Builder 職缺。職缺會關，這裡的用途是呈現市場現狀，不是即時招聘資訊。

#### 國際

| 公司 | 職稱 | 地點 | 薪資 | 一句話重點 |
|------|------|------|------|-----------|
| [ShipBob](https://job-boards.greenhouse.io/shipbobinc/jobs/4698995005) | Senior AI Product Builder（多個 domain） | Remote US | $151k–$290k | 建了整個 job family「AI Builders」——要讀 data model、evaluate AI-generated code、向 Director of AI Product Builder 報告 |
| [Abnormal Security](https://remotive.com/remote/jobs/product/ai-product-builder-4687819) | AI Product Builder | Remote US | $141k–$203k | 資安獨角獸，AI Transformation Pod 直接向 CEO 報告 |
| [ShopMy](https://careerport.is-great.net/job/senior-product-builder-creator) | Senior Product Builder-Creator | Remote US | $175k–$225k | $1.5B 估值的 creator commerce 獨角獸，第二個 Product Builder hire |
| [Camunda](https://za.linkedin.com/jobs/view/product-builder-at-camunda-4430626412) | Product Builder / Senior | Remote 全球 | US $119k–$231k | Enterprise agentic orchestration，pod 制，明確要「AI-native delivery habits」 |
| [Anima](https://uk.linkedin.com/jobs/view/product-builder-%C2%A3100k-%C2%A3170k-%2B-equity-at-anima-at-jack-jill-4433484237) | Product Builder (All Levels) | London | £100k–£170k + equity | YC W21 healthtech，AI 臨床 OS |
| [Apollo.io](https://jobsy.42web.io/job/remote-product-builder-product-manager-ai-agents) | Product Builder, AI Agents | Remote US | 未公開 | 50 萬+企業用戶的 GTM 平台，負責 Autonomous AI Agents |
| [Knotch](https://pitchmeai.com/jobs/knotch/product-builder-m754vg5ryk) | Product Builder | NYC | $160k–$180k | 5+ yr PM + 2-3 yr 工程背景，「AI is your ultimate execution engine」 |
| [MrQ / Lindar](https://careers.lindar.com/jobs/8000520-fullstack-product-builder) | FullStack Product Builder | UK / Gibraltar / Malta | 未公開 | 「Two builders per pod. No specialist.」7+ yr |
| [Whalar Group](https://careersync.liveblog365.com/remote-jobs/product-builder-1) | Product Builder (Ops Labs) | Remote US | 未公開 | 第一個 hire，新設的 AI-native 內部工具部門 |
| [Go.Shop](https://builtin.com/job/product-builder-creator-brand-ai-platform/9477419) | Product Builder | Remote GMT–GMT+8 | 面議 + equity | 第三個 Product Builder hire，PM + designer + engineer 三合一 |
| [AI Fund](https://www.linkedin.com/jobs/view/product-builder-at-ai-fund-4267686491) | Product Builder | Palo Alto | 未公開 | Andrew Ng 的 venture studio，entry level |
| [Alan](https://www.linkedin.com/posts/vincent-l-8633bb7_were-hiring-a-senior-ops-product-builder-activity-7462913537007415296-v3zv) | Senior Ops & Product Builder | France / Belgium / Spain | 未公開 | 歐洲 healthtech，1M+ 會員，10-15 yr 經驗 |
| [Foundever](https://jobs.foundever.com/job/Remote-AI-Product-Builder-Any/1400681900/) | AI Product Builder | Remote CET | 未公開 | Enterprise BPO，1-3 yr，用 vibe coding 做企業內部工具 |
| [Rare Candy](https://www.linkedin.com/jobs/view/lead-product-builder-product-design-at-rare-candy-4429374033) | Lead Product Builder | NYC | Startup comp + equity | 第一個 product hire，要 PM + Design 雙能力 |
| [Optima](https://getmereferred.com/in/job-listing/ainative-product-builder-optima-inmhmumbai-2-to-5-years-experience-06137375-110b-41f9-ac43-78479b0cbc11) | AI-Native Product Builder | Mumbai | ₹50L–1Cr | 「傳統分工是產品變平庸的原因」 |
| [HighLevel](https://in.linkedin.com/jobs/view/full-stack-builder-team-of-one-at-highlevel-4380254435) | Full Stack Builder (Team of One) | Remote India | 未公開 | 一個人 = 一個 squad |
| [Adly](https://jobvectora.synergize.co/job/remote-prompt-engineer-ai-product-builder-4) | AI Product Builder | Remote US | 未公開 | SaaS portfolio，Claude Code / Cursor / Lovable 端到端 |
| [Alps2Alps](https://bebee.com/cy/jobs/product-builder-alps2alps-ski-transfers--theirstack-692636484) | Product Builder | Remote CET | 未公開 | 旅遊集團，要懂 growth hacking |
| [Motion Recruitment 代招](https://motionrecruitment.com/tech-jobs/mississauga/direct-hire/product-builder/877667) | AI-Native Product Builder | Toronto / GTA | 未公開 | 35% discovery + 30% AI prototyping + 20% 協作 + 15% 迭代 |

#### 台灣

| 公司 | 職稱 | 地點 | 薪資 | 一句話重點 |
|------|------|------|------|-----------|
| [菜蟲農食](https://www.104.com.tw/jobs/search/?keyword=product+builder) | Forward-Deployed Product Builder | 台北松山 | 月薪 6–12 萬 | 農產流通數位化，FDE × Product Builder 混合 |
| [全曜財經 CMoney](https://www.104.com.tw/jobs/search/?keyword=product+builder) | Associate Product Builder (APB) | 新北板橋 | 面議 | 新鮮人計畫，仿 LinkedIn APB——「為未來能獨立做出產品的人設計」 |
| [奧創智慧](https://www.104.com.tw/jobs/search/?keyword=product+builder) | IoT Product Builder | 台北內湖 | 面議 | 一人從 firmware 到 mobile app |
| [光時代](https://www.104.com.tw/jobs/search/?keyword=product+builder) | AI Builder | 台北中山 | 月薪 5–7 萬 | 明確用 Claude Code，資深 AI Builder 帶領 |
| [摩速科技](https://www.104.com.tw/jobs/search/?keyword=product+builder) | Senior AI Product Manager (Cortex) | 台北大安 | 面議 | JD 自稱「AI-native product builder」 |

### 從職缺裡看到什麼

**ShipBob 最值得研究**。他們建了整個 job family 叫「AI Builders」——有自己的職級（Director of AI Product Builder）、pod 結構（AI Engineer + AI/Prompt Engineer + Designer + AI Product Builder）、工作模式（discovery → spec → prototype → production PR，一個人端到端）。這是目前把 Product Builder 制度化做得最徹底的案例。

**獨角獸開始用這個職稱**。Abnormal Security（資安）和 ShopMy（creator commerce，$1.5B 估值）都在招 Product Builder，薪資帶 $141k–$225k。這不再是小新創的實驗。

**台灣已經有 5 筆職缺**，跨度跟國際一樣大：CMoney 是新鮮人培訓（仿 LinkedIn APB），菜蟲農食是 forward-deployed 實戰角色，光時代本質是 AI-native 工程師。

**印度市場特別活躍**。Optima、HighLevel、Sairr 都在印度招，薪資從 ₹30k/月到 ₹1Cr/年。HighLevel 的「Team of One」是最極端的定位。

**薪資帶反映了定義分歧**：ShipBob senior 開到 $290k，Foundever junior 只要 1-3 年經驗。ZipRecruiter 的全美平均 $159k 參考就好——職稱指涉不同的工作，平均值意義有限。

Khan Academy 的 Sal Khan 說得直接：

> The people who are just waiting to get the spec... they're going to have trouble. But the people who are like, 'I'm going to go meet with the customer, and I can build it,' I think they're going to do great.

## 需要什麼能力

Product Builder 不是什麼都要精通，而是每個領域都懂到足以獨立推進：

**技術面**：基本的 Python / JavaScript、API 串接、能用 AI 工具寫出堪用的程式。不需要是 senior engineer，但要能跟 AI pair programming。

**設計面**：能用 v0、Lovable、Claude Design 或 Claude Artifacts 產出可互動的 prototype，在 working code 層級判斷 UX 好不好——不是畫靜態稿，是跑起來看。

**產品面**：用戶研究、數據分析（SQL）、假設驗證、優先序排定。

**AI 素養**：prompt engineering、理解 AI 工具的能力邊界和限制。

這最後一項不是加分項，是門檻。[Veracode 2025 GenAI Code Security Report](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/) 測了 100 多個模型，**45% 的生成程式碼引入了 OWASP Top 10 等級的安全漏洞**；Java 的失敗率高達 72%，XSS 這類問題在相關樣本裡有 86% 沒被擋下。更值得注意的是：模型在「寫出能跑的程式」上持續進步，但在「寫出安全的程式」上幾乎沒有改善。

換句話說，Product Builder 的技術判斷力不是為了寫得更快，是為了看得出 AI 寫錯了什麼。這也是這個角色最容易被低估的成本。

## 反方怎麼說

到這裡為止講的都是這個角色的上行空間。但它有真實的代價，而且提出質疑的不是外行。

[Roman Pichler 的反駁](https://www.romanpichler.com/blog/product-managers-product-builders/)最值得認真對待。他的重點不是「一個人會太累」，而是**當一個人能做完所有事，分散式智慧就從流程裡消失了**。參與的專業愈少，你只是帶著更窄的假設跑得更快。快速驗證的前提是假設本身夠好，而假設的品質往往來自不同視角的碰撞——這正是被壓縮掉的東西。

SVPG 的觀察更難反駁。Marty Cagan 在〈[AI Product Management 2 Years In](https://www.svpg.com/ai-product-management-2-years-in/)〉裡指出：他們看到的團隊確實靠 AI 交付得更快，但 **outcome 並沒有跟著變好**。這跟前面 McKinsey 那組數字指向同一件事——個人生產力提升 40%、上市時間只縮短 5%。被加速的是產出，不是判斷。

從業者自己也有疑慮。[Userpilot 2026 年的調查](https://userpilot.com/blog/product-management-trends/)裡：

- **46.7%** 擔心被要求「用不足的支援做過多的事」
- **37.3%** 擔心陷入長期的角色混亂
- **31.6%** 擔心「什麼都做，等於什麼都不精」

還有一個實務上的副作用：Product Builder 若沒有清楚的邊界，很容易踩進設計和工程的領域，侵蝕隊友的自主權，最後沒人清楚誰負責什麼。速度換來的混亂，有時候比省下的時間貴。

## 更可能的走向：一分為二，而不是全部變 builder

比「所有 PM 都要變成 builder」更貼近現況的說法是：**這個角色正在分岔**。

- **Builder PM**：AI-native，自己做 prototype，對其他團隊依賴低。適合早期探索、內部工具、快速迭代
- **Integrator PM**：強在對齊與溝通，讓行銷、業務、產品往同一個方向走。適合複雜組織與規模化階段

兩者都在成長，不是誰取代誰。真正被壓縮的是中間地帶——只做資訊傳遞、寫 spec、排 roadmap，既不動手也不負責對齊的那種角色。這也是 Cagan 說的「非創造者型 PM」真正的處境。

所以該問的不是「我該不該變成 Product Builder」，而是「我要往哪一邊靠，然後把那一邊做到夠深」。

## 什麼時候適合用這個模式

當產品複雜度提高、需要大規模系統架構、需要深度的用戶研究時，專業分工仍然不可取代。Product Builder 最適合的場景是：

- 早期產品，需要快速探索和驗證
- 內部工具，不需要大規模工程投入
- 功能迭代，需要快速實驗和數據驅動
- 任何「先驗證再投入」的階段

LinkedIn 的 Aneesh Raman 說：

> The full stack builder takes what would've been days or weeks as a conveyor belt between design, product, engineering... and gives it to an individual with these tools.

## 中文圈在討論什麼

這個題目在中文世界已經不算冷門，值得一起看：

- **Peter Su**〈[想法即產品：AI 時代 Product Builder 的崛起](https://petersuppi.substack.com/p/ai-product-builder)〉——中文圈最直接處理這個題目的一篇，主軸是 AI 讓抽象想法變成具體交付物的成本大幅下降。同作者的〈[2025 產品經理大事件回顧與 2026 展望](https://petersuppi.substack.com/p/2025-2026)〉把角色邊界模糊化放在年度趨勢裡談
- **AAPD**〈[打造你的 Product Builder 核心能力](https://academy.aapd.com.tw/events/ai-productbuilder)〉——台灣已經有人把這個題目做成課程，是從設計師視角切入的轉型路徑
- **CMoney**〈[AI 沒有在取代人，而是讓普通人變得多餘](https://blogs.cmoney.tw/ai-product-team)〉——有 AI Lab 的一手實作經驗，標題比內容更悲觀，重點是「真正有差別的不是技能，是解決問題和理解使用者的能力」
- **Vista**〈[PM 的美麗與哀愁：AI 時代，產品經理會被取代還是被迫升級？](https://www.vista.tw/blog/pm-beautiful-sorrow-ai-era)〉——同文也上了 Business Insider Taiwan，談的是 PM 的焦慮本身

一個觀察：中文圈這幾篇的共同傾向是**樂觀敘事為主**，把 Product Builder 當成機會而非取捨。前面那節的反方論證——Pichler 的分散式智慧、SVPG 的 outcome 未改善——目前在中文討論裡幾乎看不到。如果你正在考慮轉型，那一節值得比這節多讀兩遍。

## 如果你想往這個方向走

不管你現在是 PM、設計師、還是工程師，路徑都一樣：**補上你缺的那一塊**。值得注意的是，LinkedIn 的 APB 計畫明講歡迎 career pivot — 不限應屆、不要求正式產品經歷，這本身就說明了這條職涯路徑的入口比傳統 PM 寬。

PM → 挑 backlog 裡一個真實問題，用 Claude Code 或 Codex 做 5 個不同方案各花 30 分鐘，砍掉 4 個留 1 個。這就是 Prototyper 的肌肉記憶。練的不是寫程式，是用可運行的東西取代會議室裡的爭論。

設計師 → 用 v0、Lovable、Claude Design 或 Claude Artifacts 把你的設計直接變成可互動的 prototype，在 working code 層級判斷 UX——layout 對不對、flow 順不順、回饋感夠不夠。Anthropic 的設計師已經在送 PR 了，靜態 Figma 截圖不再是交付物。

工程師 → 這週做 3 場 15 分鐘的用戶訪談，看 5 段 session recording，然後自己認領一個用戶面指標。不是「花時間理解用戶」這種空話，是把 customer signal 變成你每天盯的數字。

Product Builder 不是一個職稱，是一種工作方式。在 AI 讓每個人都能做更多事的時代，能夠獨立從問題走到解法的人，會越來越有價值。

---

## 參考資料

- ['Engineer' is so 2025. In AI land, everyone's a 'builder' now - SF Standard](https://sfstandard.com/2026/03/05/engineer-2025-ai-land-everyone-s-builder-now/)
- [Why product managers must become product builders in 2026 - LogRocket](https://blog.logrocket.com/product-management/product-builders-future-product-management/)
- [AI is turning product managers into builders - Fast Company](https://www.fastcompany.com/91452231/ai-is-turning-product-managers-into-builders)
- [What It's Like to Be a Product Builder in 2025 - CuriousCore](https://curiouscore.com/resource/what-its-like-to-be-a-product-builder-in-2025/)
- [The Vibe Coding Imperative for Product Managers - ACM](https://cacm.acm.org/blogcacm/the-vibe-coding-imperative-for-product-managers/)
- [Introducing the Product Builder - PayFit](https://backstage.payfit.com/introducing-the-product-builder/)
- [The Era of the Product Creator - SVPG](https://www.svpg.com/the-era-of-the-product-creator/) — 注意：Cagan 與 Baxley 在這篇主張 PM 角色**仍然必要**、且應與設計師和工程師每日並肩工作，他們警告的是「非創造者型 PM」。這與本文「一個人壓縮整條產線」的取向並不一致，列出供對照
- [What It Means to Be a Product Builder at Mews - Mews Developers](https://developers.mews.com/what-it-means-to-be-a-product-builder-at-mews/) — 少數把這個角色明確定位在工程職涯軌的公司
- [Comment le métier de Product builder est apparu chez PayFit - PayFit](https://payfit.com/fr/metier-product-builder-payfit/) — PayFit 的 Product Builder 與 JetLang 低程式碼平台
- [Should Product Managers be Product Builders? - Roman Pichler](https://www.romanpichler.com/blog/product-managers-product-builders/) — 目前最有份量的懷疑論，核心論點是「分散式智慧消失」
- [AI Product Management 2 Years In - SVPG](https://www.svpg.com/ai-product-management-2-years-in/) — 團隊靠 AI 交付更快，但 outcome 沒有變好
- [6 Product Management Trends in 2026: The PM Role Is Splitting - Userpilot](https://userpilot.com/blog/product-management-trends/) — Builder PM / Integrator PM 分岔與從業者疑慮調查
- [How generative AI could accelerate software product time to market - McKinsey](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/how-generative-ai-could-accelerate-software-product-time-to-market)
- [2024 Global DevSecOps Report - GitLab](https://about.gitlab.com/resources/developer-survey/2024/)
- [2025 GenAI Code Security Report - Veracode](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/)
- [Why LinkedIn is replacing PMs with AI-powered "full-stack builders" - Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-linkedin-is-replacing-pms)
- [All in on Agents - Walmart Global Tech](https://public.walmart.com/content/walmart-global-tech/en_us/blog/post/all-in-on-agents.html)
- [How Walmart is securing a new cohort of AI builders - IT Brew](https://www.itbrew.com/stories/how-walmart-is-securing-a-new-cohort-of-ai-builders)
