---
title: "FDE 戰爭：OpenAI 和 Anthropic 為何同時複製 Palantir 的劇本"
date: 2026-05-10
type: deep-dive
category: ai
tags: [fde, forward-deployed-engineer, openai, anthropic, palantir, enterprise-ai, deployment]
lang: zh-TW
tldr: "MIT 研究說 95% 企業 AI pilot 零回報。OpenAI 和 Anthropic 在同一週各自宣布百億美元規模的合資公司，把 Palantir 用了十幾年的 Forward Deployed Engineer 模式整套搬進企業 AI 落地戰場。"
description: "OpenAI 的 The Deployment Company 與 Anthropic-Blackstone-Goldman 合資企業同週成立，兩家頂級 AI lab 為何都選擇複製 Palantir 的 FDE 模式？這篇拆解資金結構、戰略意圖，以及這對企業 AI、顧問業、Palantir 自己代表什麼。"
draft: false
---

為什麼最強大的 AI 模型，在多數企業內部依然雷聲大雨點小？為什麼許多公司在做完無數次 PoC 之後，仍然不知道怎麼把 AI 真正部署到核心業務？

答案很直接：尖端 AI 從來就不是即插即用的 API。

而 OpenAI 和 Anthropic 在 2026 年 5 月初的同一週，各自宣布了一家規模龐大的合資公司，用一套幾乎一模一樣的劇本來解決這個問題。這套劇本，是 Palantir 用了十幾年的 Forward Deployed Engineer（FDE）模式。

## Palantir 早就證明了這條路能走通

FDE 不是新概念。Palantir 在 2000 年代初創立時，目標客戶是情報機構，產品根本不能拿出來給人看，也沒有所謂的「行銷網站」可以 demo。他們發明了一個內部叫「Delta」的角色：把頂尖工程師直接派進客戶辦公室，跟分析師坐在一起，看他們怎麼用工具、卡在哪裡，然後當場寫程式解決。

這個模式跟「solutions consultant」或「sales engineer」最大的差別是：**FDE 是真的在寫 production code**，不是做投影片。Pragmatic Engineer 整理過一個關鍵數字 —— 2016 年以前，Palantir 的 FDE 數量比一般軟體工程師還多。整家公司本質上是「現場工程師為主、平台工程師為輔」的結構。

直到 Foundry 平台逐漸成形，現場學到的東西才被抽象、回流到產品本身。但 FDE 從未消失，反而成為 Palantir 高毛利率的關鍵 —— 客戶買的是「結果」，不是 license。

## 為什麼光賣 API 不夠了

MIT 一份廣被引用的研究指出，95% 的企業 AI pilot 產生「零可衡量回報」；RAND 的數字更狠：AI 專案失敗率超過 80%，是傳統 IT 專案的兩倍。

這不是因為模型不夠好。這是因為大部分企業根本不知道怎麼把「很厲害的模型」變成「真的能用的東西」。你可以給一家銀行 Claude API，他們也許做得出一個還不錯的 Chatbot，然後就沒有然後了。

企業付錢買的不是「AI 能力」，而是「AI 落地」。落地這件事，光靠 API 文檔和線上影片是教不會的 —— 它需要有人真的進到客戶內部，處理資料治理、整合內部系統、解決 SSO、權限、稽核、合規這些「髒活」。

## OpenAI 的 The Deployment Company：100 億美元的 Palantir 翻版

OpenAI 在 2026 年 5 月初敲定了一家代號為 **The Deployment Company**（早期文件叫 DeployCo）的合資企業，pre-money 估值約 100 億美元，外部募集超過 40 億美元。投資方包含 19 家機構，TPG 是 anchor investor，其他主要參與者包含 Brookfield Asset Management、Advent International、Bain Capital、SoftBank、Dragoneer、Goanna Capital。

幾個關鍵設計值得看：

- **OpenAI 自己出 5 億美元**（並保留追加到 15 億的選擇權），但透過 super-voting shares 維持戰略控制。
- **PE 拿到 17.5% 的五年年化保證報酬**。這個結構讓這筆投資在會計上看起來更像「基礎建設信貸」而非創投股權，也就是把 OpenAI 的成長性換成 PE 可以承銷的固定收益商品。
- **加總起來，這些 PE 控制超過 2,000 家投資組合公司**，橫跨醫療、製造、金融、零售、物流，等於 OpenAI 一夕之間有了一個 captive enterprise 客戶群。

DeployCo 的商業模式幾乎是 Palantir 的拷貝：派工程師進客戶內部，重新設計 workflow、自動化流程、整合系統，靠服務+軟體混合的計價方式，在「部署」這一層而不只是「模型呼叫」這一層收錢。

## Anthropic 的雙線進攻：Accenture + Wall Street JV

Anthropic 沒有蓋一家 DeployCo，而是同時推進兩條戰線。

**第一條：Accenture**。2025 年 12 月，Anthropic 跟 Accenture 宣布成立 **Accenture Anthropic Business Group**，將培訓 **約 30,000 名 Accenture 員工**使用 Claude，其中包含 Accenture 自己定義的「reinvention deployed engineers」—— 直接被派到客戶端、把 Claude 嵌進業務流程的工程師。Anthropic CEO Dario Amodei 直接把這稱為「我們史上最大規模的 Claude Code 部署」。

**第二條：Wall Street 合資**。2026 年 5 月 4 日，Anthropic 與 Blackstone、Hellman & Friedman、Goldman Sachs 公告成立一家 15 億美元的合資企業：

- Anthropic、Blackstone、Hellman & Friedman 各出資約 3 億美元，Goldman Sachs 出資約 1.5 億。
- 其餘由 Apollo、General Atlantic、Leonard Green、GIC、Sequoia Capital 等補齊。
- 鎖定的客戶是 **mid-market 中型企業**，特別是 PE 投資組合中的醫療、製造、金融服務、零售、不動產業者。

Goldman 全球資產與財富管理主管 Marc Nachmann 在 CNBC 上說了一句很關鍵的話：「這家公司的目的，是把 forward-deployed engineers 民主化。」這就是 Palantir 模式被以投資銀行的語言重新講了一遍。

## 為什麼一定是合資公司？

兩家頂級 lab 不約而同走 JV 路線，背後有幾個現實：

1. **規模化 FDE 不能只靠內部招聘**。Palantir 用了二十年才養出今天的 FDE 文化，OpenAI 和 Anthropic 沒有這個時間。借用顧問公司（Accenture）和 PE 既有的人才/客戶網路，是唯一能在兩三年內把規模拉到上萬人的辦法。
2. **PE 的投資組合就是現成的客戶池**。技術評估、採購、內部政治在 PE 控股的公司裡可以被「由上而下」加速。
3. **資本結構優化**。對 OpenAI 和 Anthropic 來說，這部分業務本質是高毛利、人力密集的服務業，估值倍數比模型本身低。把它放在合資公司裡，可以避免拖累母公司的估值倍數，又能讓 PE 用承銷信貸的方式給保證報酬。

## 這跟 Palantir 是合作還是對抗？

兩種都有。可以這樣理解這個堆疊：

- **底層作業系統（Palantir 的護城河）**：Palantir 真正強的不是 AI，是 **Ontology** —— 把企業內混亂、孤立的資料變成結構化、可治理、可被 AI 安全操作的「數位分身」。
- **頂層智能引擎（OpenAI/Anthropic 的核心優勢）**：最強的推理與生成模型。

理論上兩者互補，許多最複雜的部署應該是 Palantir Ontology + OpenAI/Anthropic 模型。但隨著 OpenAI 和 Anthropic 透過 FDE 越來越深入企業流程，他們必然會蠶食 Palantir 原本的「實作層」收入。Palantir 過去靠 FDE 守住的高毛利，現在會直接被新對手用相同打法挑戰。

## 對市場意味著什麼

**短期（2026-2027）**：顧問業是最大受益者。Accenture 一口氣多了一條巨大的營收線，Deloitte、Cognizant 也透過 Anthropic 的 Claude Partner Network 進場。這些大型 SI 突然多出幾萬名「具備頂級 AI lab 認證 + FDE 培訓」的人力可以對外計費。

**中期（2027-2028）**：企業 AI 採用率會明顯加速，但不會一夜爆發。資料品質、組織變革、採購流程仍是瓶頸。比較合理的預期是：到 2028 年我們會看到顯著更多 AI 真正進入 production，而不是停留在 demo。

**對 OpenAI / Anthropic 自己**：他們從「研究機構/模型供應商」轉型為「企業轉型夥伴」。
- 收入結構從 API token 計費，變成 API + 高價值服務。
- 客戶黏性大幅提升 —— 工程師已經跟客戶團隊坐在一起、改了一堆客製化的東西，要換供應商的成本非常高。
- 對開源模型的護城河變寬 —— 就算有免費的開源模型，企業還是需要有人來幫他們部署，而這個「有人」越來越是 OpenAI 和 Anthropic 自己派來的。

## 整體來說

這不是一個融資新聞，是一次戰略體位的轉換。OpenAI 和 Anthropic 認知到：模型能力的差距已經不是企業 AI 採用的瓶頸，部署能力才是。誰能把上萬名「會寫 production code、又能跟客戶業務對話」的工程師塞進中型企業的辦公室，誰就能主宰下一個十年的企業 AI 預算。

「Forward Deployed Engineer」這個十幾年前由一家神祕情報科技公司發明的角色，正在變成 2026 年科技業最炙手可熱的職缺之一。地面戰才剛剛開始。

## 參考資料

### 公司官方來源

**Anthropic**
- [Building a new enterprise AI services company with Blackstone, Hellman & Friedman, and Goldman Sachs（Anthropic, 2026/5/4）](https://www.anthropic.com/news/enterprise-ai-services-company)
- [Accenture and Anthropic launch multi-year partnership to move enterprises from AI pilots to production（Anthropic, 2025/12/9）](https://www.anthropic.com/news/anthropic-accenture-partnership)
- [Anthropic invests $100 million into the Claude Partner Network（Anthropic）](https://www.anthropic.com/news/claude-partner-network)
- [Anthropic raises $30 billion in Series G funding at $380 billion post-money valuation（Anthropic）](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation)

**Blackstone / Goldman Sachs / Hellman & Friedman**
- [Anthropic Partners with Blackstone, Hellman & Friedman, and Goldman Sachs to Launch Enterprise AI Services Firm（Blackstone 官方新聞稿, 2026/5/4）](https://www.blackstone.com/news/press/anthropic-partners-with-blackstone-hellman-friedman-and-goldman-sachs-to-launch-enterprise-ai-services-firm/)
- [Anthropic Partners with Blackstone, Hellman & Friedman, and Goldman Sachs to Launch Enterprise AI Services Firm（BusinessWire 聯合發布版本，含 Goldman、H&F 高管引述）](https://www.businesswire.com/news/home/20260503427206/en/Anthropic-Partners-with-Blackstone-Hellman-Friedman-and-Goldman-Sachs-to-Launch-Enterprise-AI-Services-Firm)

**Accenture**
- [Accenture and Anthropic Launch Multi-Year Partnership to Drive Enterprise AI Innovation and Value Across Industries（Accenture Newsroom, 2025/12/9）](https://newsroom.accenture.com/news/2025/accenture-and-anthropic-launch-multi-year-partnership-to-drive-enterprise-ai-innovation-and-value-across-industries)
- [Accenture and Anthropic Team to Help Organizations Secure, Scale AI-Driven Cybersecurity Operations（Accenture Newsroom, 2026）](https://newsroom.accenture.com/news/2026/accenture-and-anthropic-team-to-help-organizations-secure-scale-ai-driven-cybersecurity-operations)

**OpenAI**（注：「The Deployment Company / DeployCo」目前僅見於 Bloomberg、Reuters、FT 報導，OpenAI 尚未發出獨立公告。OpenAI 自家最早正式提及 FDE 角色的文件是 Frontier 平台的介紹頁。）
- [Introducing OpenAI Frontier — 明確提到「OpenAI Forward Deployed Engineers (FDEs)」與客戶並肩部署 agents（OpenAI 官方）](https://openai.com/index/introducing-openai-frontier/)
- [OpenAI raises $122 billion to accelerate the next phase of AI（OpenAI 官方，提及 enterprise deployment 飛輪）](https://openai.com/index/accelerating-the-next-phase-ai/)

**Palantir**（FDE / Delta 模式的官方說明）
- [Dev versus Delta: Demystifying engineering roles at Palantir（Palantir Blog，官方解釋兩種工程師職務）](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87)
- [A Day in the Life of a Palantir Forward Deployed Software Engineer（Palantir Blog）](https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1)
- [Who Wants to be a Delta?（Palantir Blog）](https://blog.palantir.com/who-wants-to-be-a-delta-8d2ea948035)
- [Palantir Careers — Students and Early Talent（官方對 Forward Deployed Software Engineer 的職務說明）](https://www.palantir.com/careers/students-and-early-talent/)

### 主要新聞報導

**OpenAI The Deployment Company**
- [OpenAI closes The Deployment Company, a $10bn enterprise AI bet on private equity（TheNextWeb）](https://thenextweb.com/news/openai-deployco-finalized-10-billion-joint-venture)
- [OpenAI bags over $4B to build 'Deployment Company' with TPG, Brookfield, Bain（TFN）](https://techfundingnews.com/openai-bags-over-4b-to-build-deployment-company-with-tpg-brookfield-bain-for-enterprise-ai-rollout-report/)
- [TPG, Bain, Brookfield, and Advent in talks with OpenAI on $10bn enterprise AI venture（PE Insights）](https://pe-insights.com/tpg-bain-brookfield-and-advent-in-talks-with-openai-on-10bn-enterprise-ai-venture/)
- [OpenAI's $10B Joint Venture: PE-Backed Enterprise AI Distribution Explained（TeckNexus）](https://tecknexus.com/openais-10b-joint-venture-pe-backed-enterprise-ai-distribution-explained/)

**Anthropic × Wall Street**
- [Anthropic, Goldman and others launch $1.5 billion AI venture（CNBC, 2026/5/4）](https://www.cnbc.com/2026/05/04/anthropic-goldman-blackstone-ai-venture.html)
- [Anthropic forms $1.5B joint venture with Blackstone, Goldman Sachs（Yahoo Finance）](https://finance.yahoo.com/sectors/technology/articles/anthropic-forms-1-5b-joint-123147935.html)
- [Anthropic's $1.5B JV with Blackstone（Augment Pulse 戰略分析）](https://augment.market/pulse/anthropics-1-5b-jv-with-blackstone)

### Forward Deployed Engineer 模式（業界整理）
- [What are Forward Deployed Engineers, and why are they so in demand?（Pragmatic Engineer）](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)
- [So You Want to Hire a Forward Deployed Engineer（First Round Review）](https://review.firstround.com/so-you-want-to-hire-a-forward-deployed-engineer/)
- [Understanding Forward Deployed Engineering（barry.ooo）](https://www.barry.ooo/posts/fde-culture)
- [What's a Forward Deployed Engineer?（Technically）](https://technically.dev/posts/whats-a-forward-deployed-engineer)
- [Forward Deployed Engineering: From Deployment to Delivery Intelligence（Ideas2IT）](https://www.ideas2it.com/blogs/forward-deployed-engineer)
