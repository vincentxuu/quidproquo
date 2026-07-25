---
title: "Product Builder 是什麼？跟 PM 的差別與轉型路徑"
date: 2026-03-27
updated: 2026-07-25
type: deep-dive
tldr: "Product Builder 是能獨立跑完「發現問題→設計→建造」完整循環的人。跟 PM 最大的差別是：PM 靠權威影響團隊執行，Product Builder 靠能力直接產出可用產品。LinkedIn 已用 Associate Product Builder track 取代原本的 APM 計畫，PayFit 早在 2019 年就定義了這個角色。"
category: product
tags: [product-builder, product-management, ai, vibe-coding, career]
lang: zh-TW
description: "Product Builder 是什麼、跟 Product Manager 差在哪、需要什麼能力、以及 PM／設計師／工程師各自該怎麼轉型。附 LinkedIn、Walmart、PayFit 的實際案例與常見問題整理，並標註各項說法的一手來源。"
glossary:
  - term: "vibe coding"
    aliases: ["Vibe Coding"]
    definition: "不逐行寫程式，而是用自然語言描述你要什麼、讓 AI 生成實作，人負責看結果對不對。Andrej Karpathy 在 2025 年 2 月提出這個說法。"
    advanced: "實務上的瓶頸不在生成而在驗證：模型產出能跑的程式碼的能力持續進步，產出安全程式碼的能力卻幾乎沒有改善，所以審查與測試的成本會回到人身上。"
    context: "常出現在 Claude Code、Cursor、Lovable、Replit 這類 AI 編碼工具的討論。"
  - term: "APM"
    aliases: ["Associate Product Manager"]
    definition: "大型科技公司培訓初階產品經理的輪調計畫，通常招收應屆畢業生，兩年內輪過數個產品團隊。Google、LinkedIn、Meta 都有類似制度。"
    advanced: "LinkedIn 已於 2026 年結束 APM 計畫，改設 Associate Product Builder（APB）track，訓練重心從協調與 roadmap 移向自己動手做出東西。"
    context: "討論產品經理職涯入口與 Product Builder 轉型時常出現。"
faq:
  - q: "Product Builder 是什麼？"
    a: "Product Builder 是能把想法從概念推到可用產品、對其他團隊依賴降到最低的人。他同時具備產品判斷、基本設計、以及用 AI 工具動手建造的能力，能獨立跑完「發現問題 → 設計解法 → 建造驗證」的完整循環，而不需要在 PM、設計、工程之間層層交接。"
  - q: "Product Builder 跟 Product Manager 差在哪？"
    a: "最核心的差別是影響力的來源。PM 透過權威影響團隊執行，產出是 PRD 和 roadmap；Product Builder 透過能力直接貢獻產出，交付的直接就是可用的 prototype 或功能。PM 需要說服團隊去做，Product Builder 可以自己先做出來再談。"
  - q: "成為 Product Builder 需要哪些能力？"
    a: "四塊：技術面要有基本的 Python／JavaScript 和 API 串接能力，能跟 AI pair programming；設計面要能用 Figma 做 wireframe 並理解基本 UX 原則；產品面要會用戶研究、SQL 數據分析和假設驗證；AI 素養則包含 prompt engineering 和判斷 AI 產出邊界的能力。重點不是每項精通，而是每項都懂到足以獨立推進。"
  - q: "Product Builder 會取代 PM、設計師和工程師嗎？"
    a: "不會。當產品複雜度提高、需要大規模系統架構或深度用戶研究時，專業分工仍不可取代。Product Builder 最適合的是早期產品探索、內部工具、快速功能迭代這類「先驗證再投入」的階段。"
  - q: "PM 想轉型成 Product Builder 該從哪裡開始？"
    a: "從補上你缺的那一塊開始。PM 學用 AI 工具做 prototype，能自己驗證想法而不是等別人做；設計師學基本程式能力，讓設計不只停在 Figma；工程師花時間直接跟客戶對話，而不是只讀 PRD。先挑一個小範圍的真實問題，用 Claude Code 或 Cursor 從頭做到能上線，比讀十篇文章有用。"
draft: false
---

🌏 [English version](/posts/product/2026-03-27-product-builder-hybrid-role-en)

Anthropic 的 Boris Cherny（Claude Code 的創造者）說了一句話：

> Today coding is practically solved... We're going to start to see the title of 'software engineer' go away. It's just going to be 'builder' or 'product manager.'

這不是預測，這是正在發生的事。

## 什麼是 Product Builder

Product Builder 是一個能把想法從概念推到可用產品的人，對其他團隊的依賴降到最低。不是 PM，不是設計師，也不是工程師，但三件事都做得到。

傳統產品開發是一條流水線：PM 寫 spec → Designer 出稿 → Dev 開發 → QA 驗收。每個節點之間都有等待和溝通成本。Product Builder 把這條線壓縮成一個循環，一個人就能快速驗證假設、迭代方案。

核心差異在於：**PM 透過權威影響團隊執行，Product Builder 透過能力直接貢獻產出**。PM 的產出是 PRD 和 roadmap，Product Builder 的產出直接就是可用的 prototype 或功能。

## 為什麼是現在

兩個字：**AI**。

2025 年 2 月，Andrej Karpathy 提出 vibe coding — 不再逐行寫程式，而是用自然語言描述你要什麼，AI 幫你生成。這直接降低了「做出東西」的門檻。關於這套工作方式已經沉澱出哪些具體模式，可以參考 [Encyclopedia of Agentic Coding Patterns 的 190 個 pattern](/posts/ai/2026-04-18-encyclopedia-of-agentic-coding-patterns)。

McKinsey 找 40 位 PM 做的實驗顯示，生成式 AI 讓 **PM 個人生產力提升 40%** — 但同一份研究裡，產品上市時間只縮短 **5%**。

這個落差值得停下來看：個人產出變快，不等於整條產品線變快。卡住的通常不是「做不出來」，而是決策、對齊、與驗證。這也正是 Product Builder 這個角色主張要拆掉的環節 — 但它同時提醒，把 AI 塞進既有流程而不改流程本身，效益會被交接成本吃掉。

導入的實際進度也比想像慢。GitLab 2024 Global DevSecOps Report 常被引用的「78%」指的是**已導入或計畫兩年內導入**；同一份報告裡，回報**實際已導入**的只有 26%。

當 Claude Code、Cursor、Lovable、Replit 這些工具讓一個人能在幾小時內從想法做出 working prototype，傳統的三人組（PM + Designer + Dev）就不再是唯一選項了。

LogRocket 的文章算了一筆帳：傳統三人組一年成本約 120-150 萬美元，而 50-60% 上線的功能表現不如預期。如果一個 Product Builder 能在投入完整工程資源之前就先驗證假設，每年避免 5 個不必要的功能就能省下 50 萬美元以上。

## 誰已經在做

這不是小公司的實驗，大公司已經在動了：

- **LinkedIn** 結束了行之有年的 APM（Associate Product Manager）計畫，另設 **Associate Product Builder（APB）** track，訓練跨產品、設計、工程的通才。CPO Tomer Cohen 在 Lenny's Podcast 上的說法是：要教他們在 LinkedIn 怎麼寫程式、做設計、做 PM
- **Walmart** 開出了 **Agent Developer** 職位（公司自稱是第一個「biz/tech」職位），用低程式碼與自然語言介面，讓一個人不靠團隊、也不需要技術背景就能設計並部署 agent。人資長的說法是：一年前我們沒有任何專職的 agent builder，今天有了
- **Meta** 的 PM 開始自稱「AI Builder」
- **PayFit** 早在 2019 年就定義了 Product Builder 角色，結合 PM、UX、Dev 三種能力，用自研的 low-code 語言 JetLang 直接建構功能
- **SoFi** 在 2026 年初開出過掛 Product Builder 名稱的職缺（職缺會關，這裡只當作「這個名稱已進入正式職稱體系」的證據，不是即時招聘資訊）

Khan Academy 的 Sal Khan 說得很直接：

> The people who are just waiting to get the spec... they're going to have trouble. But the people who are like, 'I'm going to go meet with the customer, and I can build it,' I think they're going to do great.

## 需要什麼能力

Product Builder 不是什麼都要精通，而是每個領域都懂到足以獨立推進：

**技術面**：基本的 Python / JavaScript、API 串接、能用 AI 工具寫出堪用的程式。不需要是 senior engineer，但要能跟 AI pair programming。

**設計面**：能用 Figma 做 wireframe 和 prototype，理解基本的 UX 原則。

**產品面**：用戶研究、數據分析（SQL）、假設驗證、優先序排定。

**AI 素養**：prompt engineering、理解 AI 工具的能力邊界和限制。

這最後一項不是加分項，是門檻。Veracode 2025 GenAI Code Security Report 測了 100 多個模型，**45% 的生成程式碼引入了 OWASP Top 10 等級的安全漏洞**；Java 的失敗率高達 72%，XSS 這類問題在相關樣本裡有 86% 沒被擋下。更值得注意的是：模型在「寫出能跑的程式」上持續進步，但在「寫出安全的程式」上幾乎沒有改善。

換句話說，Product Builder 的技術判斷力不是為了寫得更快，是為了看得出 AI 寫錯了什麼。這也是這個角色最容易被低估的成本。

## 這不是取代專業分工

當產品複雜度提高、需要大規模系統架構、需要深度的用戶研究時，專業分工仍然不可取代。Product Builder 最適合的場景是：

- 早期產品，需要快速探索和驗證
- 內部工具，不需要大規模工程投入
- 功能迭代，需要快速實驗和數據驅動
- 任何「先驗證再投入」的階段

LinkedIn 的 Aneesh Raman 說：

> The full stack builder takes what would've been days or weeks as a conveyor belt between design, product, engineering... and gives it to an individual with these tools.

## 如果你想往這個方向走

不管你現在是 PM、設計師、還是工程師，路徑都一樣：**補上你缺的那一塊**。值得注意的是，LinkedIn 的 APB 計畫明講歡迎 career pivot — 不限應屆、不要求正式產品經歷，這本身就說明了這條職涯路徑的入口比傳統 PM 寬。

PM → 學用 AI 工具做 prototype，能自己驗證想法而不是等別人做。

設計師 → 學基本的程式能力，讓你的設計不只停在 Figma 裡。

工程師 → 花時間理解用戶，直接跟客戶對話，而不是只讀 PRD。

Product Builder 不是一個職稱，是一種工作方式。在 AI 讓每個人都能做更多事的時代，能夠獨立從問題走到解法的人，會越來越有價值。

最小可行的起手式是：挑一個你自己真的會用的小工具，從頭做到能上線。這個部落格本身就是這樣來的 — 選型、實作到部署的完整過程記錄在 [用 Astro + Cloudflare Workers 從零建立低摩擦部落格](/posts/product/2026-03-12-quidproquo-blog-from-scratch)。想看 Product Builder 思維套用在平台策略層級的例子，可以看 [數位生態系研究：從 LINE、Shopify 到台灣 MarTech](/posts/product/2026-04-02-digital-ecosystem-cresclab-research)。

---

## 更新紀錄

- **2026-07-25**：重寫標題與描述聚焦「Product Builder 與 PM 的差別」，新增常見問題整理與站內延伸閱讀連結。
- **2026-07-25**：事實查證後修正三處。GitLab 的 78% 原文是「已導入**或**計畫兩年內導入」，實際已導入為 26%，原文誤植為「已經在用」；LinkedIn 是**結束** APM 計畫另設 Associate Product Builder track，不是改名；McKinsey 的 40% 是 PM 個人生產力（n=40），補上與「上市時間僅縮短 5%」的張力。另將 AI 程式碼安全的引用從過寬的 25–70% 區間換成 Veracode 2025 的實測數字，並移除資訊量不足的「Product Builder 的一天」一節。
- **2026-07-25**：修正 Walmart 一項。該職位的正式名稱是 **Agent Developer**（Walmart 稱為第一個 biz/tech 職位），不是「Agent Builder」——後者是人資長的描述性說法；另原文寫「全部由內部員工轉任」並不成立，該職位有對外公開招募。

---

## 參考資料

- ['Engineer' is so 2025. In AI land, everyone's a 'builder' now - SF Standard](https://sfstandard.com/2026/03/05/engineer-2025-ai-land-everyone-s-builder-now/)
- [Why product managers must become product builders in 2026 - LogRocket](https://blog.logrocket.com/product-management/product-builders-future-product-management/)
- [AI is turning product managers into builders - Fast Company](https://www.fastcompany.com/91452231/ai-is-turning-product-managers-into-builders)
- [What It's Like to Be a Product Builder in 2025 - CuriousCore](https://curiouscore.com/resource/what-its-like-to-be-a-product-builder-in-2025/)
- [The Vibe Coding Imperative for Product Managers - ACM](https://cacm.acm.org/blogcacm/the-vibe-coding-imperative-for-product-managers/)
- [Introducing the Product Builder - PayFit](https://backstage.payfit.com/introducing-the-product-builder/)
- [The Era of the Product Creator - SVPG](https://www.svpg.com/the-era-of-the-product-creator/) — 注意：Cagan 與 Baxley 在這篇主張 PM 角色**仍然必要**、且應與設計師和工程師每日並肩工作，他們警告的是「非創造者型 PM」。這與本文「一個人壓縮整條產線」的取向並不一致，列出供對照
- [How generative AI could accelerate software product time to market - McKinsey](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/how-generative-ai-could-accelerate-software-product-time-to-market)
- [2024 Global DevSecOps Report - GitLab](https://about.gitlab.com/resources/developer-survey/2024/)
- [2025 GenAI Code Security Report - Veracode](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/)
- [Why LinkedIn is replacing PMs with AI-powered "full-stack builders" - Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-linkedin-is-replacing-pms)
- [All in on Agents - Walmart Global Tech](https://public.walmart.com/content/walmart-global-tech/en_us/blog/post/all-in-on-agents.html)
- [How Walmart is securing a new cohort of AI builders - IT Brew](https://www.itbrew.com/stories/how-walmart-is-securing-a-new-cohort-of-ai-builders)
