---
title: "2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production"
date: 2026-07-10
category: ai
tags:
  - ai-course
  - learning-path
  - openai-academy
  - anthropic-academy
  - ai-literacy
  - claude-code
  - mcp
  - ai-agent
  - prompt-engineering
lang: zh-TW
tldr: "把 OpenAI、Anthropic、Google 三家官方課程平台，加上 Stanford CS146S/CS336、Elements of AI、Hugging Face、MIT 6.S191、李宏毅等資源實際逐頁抓過一遍，按「不懂 AI / vibe coding / 讓它能上 production / 底層 AI」四層重排。結論：課幾乎全部免費，稀缺的不是課，是選課的判斷力；而第四層不會解決第三層的問題。"
description: "2026 年 AI 課程總覽，依不懂 AI、vibe coding、上 production、底層 AI 四層分類：OpenAI Academy、Anthropic Academy、Google 免費與付費課、Elements of AI、Stanford CS146S 與 CS336、MIT 6.S191、Hugging Face、李宏毅課程的實際內容、費用、時長與適用對象"
draft: false
---

2026 年上半年，三家前沿模型公司不約而同把「教你用 AI」變成產品的一部分。OpenAI Academy 在 6 月上線了三門核心課程，Anthropic Academy 累積了 21 門免費課，Google 推出了新的 AI Professional Certificate。同一時間，Stanford 開了一門專門教「怎麼指揮 coding agent」的正式學分課，講者名單包含 Claude Code 的創造者本人。

這篇把這些資源實際逐頁抓過一遍，記錄下費用、時長、對象與先修條件，並按四層重新排過：

1. **不懂 AI**——還不知道能拿它做什麼
2. **vibe coding**——已經在用 AI 寫 code，但主要靠感覺
3. **vibe coding 的下一步**——讓 AI 寫出來的東西能上 production
4. **底層 AI**——搞懂模型裡面發生什麼事

用「技術 vs 非技術」分類會失準，因為現在有一大群人天天在 vibe coding，卻不自認是工程師；而有些掛著「初學者」標籤的課，作業要你 finetune 一個 LLM。第二層到第三層的落差，也遠比大多數課程目錄願意承認的大。

先講結論：**課程幾乎全部免費，真正稀缺的不是課，是選課的判斷力。**

寫作方法上先說清楚：以下數字都來自 2026-07-10 當天實際抓取的官方頁面，不用印象或既有知識補完。有幾處官方頁面自己前後矛盾，我照實記下來，沒有自行「修正」成看起來合理的版本。

價格與語言一律以**現行官方頁面**為準，不採信舊部落格。這件事比想像中重要：AWS 那篇宣布訂閱制的官方公告寫著年繳 $299、支援 12 種語言，但那是 2022 年的文章——現行定價頁是 $449，現行 FAQ 是 17 種語言。Google Cloud 那篇廣為流傳的「免費徽章」公告，則發布於 2023 年。**引用官方來源不等於引用到現況**，日期一定要看。

全文剩三處標記「未能確認」，都不是查得不夠，是**結構性拿不到**：OpenAI Academy 的逐課大綱藏在需要登入的 Gradual 平台後面；Maven 那門付費 cohort 的頁面顯示 Sold out、不列金額；NVIDIA 自學課程頁不標語言。

## 第一層：不懂 AI——還不知道能拿它做什麼

這一層的共同特徵：不需要寫程式、90 分鐘內能上完一門、幾乎都發結業證書。三家官方平台的內容高度同質，選一家上完就好，不必都上。

### OpenAI Academy

[`academy.openai.com`](https://academy.openai.com/)，OpenAI 官方經營，**完全免費**，全球開放，只要有 ChatGPT 帳號就能上。技術上課程託管在第三方平台 Gradual，負責報名、進度與結業證書。

2026-06-12 [官方發布了三門課](https://openai.com/index/academy-courses-applying-ai-at-work/)，構成一條清楚的路徑：

| 課程 | 對象 | 時長 |
|---|---|---|
| AI Foundations | 完全新手 | 60–75 分鐘 |
| Applied AI Foundations | 已有一些經驗 | 75–90 分鐘 |
| Agents and Workflows | 能自在使用 AI 者 | 75–90 分鐘 |

三門都有結業證書，但官方特別聲明這**不等於**「OpenAI Certifications」正式認證——這個區分值得注意，別把結業證書當成資格認證去寫履歷。

路徑的終點是「指揮 agent」而不是「寫更好的 prompt」，這個編排本身就是訊號：OpenAI 認為 2026 年的基礎技能已經從 prompting 移動到 workflow 設計與 agent 委派。

課程內容是否有中文版：**未能確認**。只確認了說明文件有繁中與港繁版本，Academy 站本體與所有公開課程頁都是英文。逐課大綱需登入 Gradual 才看得到，我沒有抓到。

### Anthropic Academy

[`anthropic.skilljar.com`](https://anthropic.skilljar.com/)。21 門課，**逐頁確認全部免費**，幾乎都有完成證書。

非技術向的部分分兩塊。一塊是 Claude 使用基礎：Claude 101、Introduction to Claude Cowork（0.5 小時）、AI Capabilities and Limitations（0.25 小時）。另一塊是 **AI Fluency 系列共 9 門**，圍繞一個叫 4D 的框架（Delegation、Description、Discernment、Diligence），並且切成族群版：教育工作者、學生、非營利、小型企業、pK-12 教師、builders 各有一門，都建議先修總綱那門 Framework & Foundations（1.1 小時）。

這個「一套框架 × 六個族群」的做法在其他平台沒看到，如果你要在組織內推 AI 教育，這系列的分眾程度是目前最細的。

平台上唯一要付錢的是認證考試 [**Claude Certified Architect – Foundations**](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)**，$125 USD**，60 題、120 分鐘、線上監考或 Pearson 考場。它的考試範圍權重很能說明 Anthropic 認為什麼重要：Agentic Architecture & Orchestration 27%、Claude Code Configuration & Workflows 20%、Prompt Engineering & Structured Output 20%、Tool Design & MCP Integration 18%、Context Management & Reliability 15%。

有意思的是，**所有課程頁面都沒有難度標籤，也都沒有顯示最近更新時間**。唯一標了 Level 的地方是這張認證的備考頁。

### Google：有付費證書，也有免費入門課

Google 是這篇裡唯一有訂閱制付費課程的一家。它的官方頁面對「到底要不要錢」給出四種互相打結的說法，值得先解開——因為解開之後你會發現，**$49/月買的其實不是課，是證書**。

#### 免費的那一批

先講規則，因為 Google 自己把規則寫在同一個地方。官方學習入口 [`ai.google/learn-ai-skills`](https://ai.google/learn-ai-skills) 明講：**課程若標有「no charge」標籤即為免費**；加入 GEAR 社群可拿**每月自動續發的 35 點學習點數**，用於課程與實作 labs；若要存取完整目錄，則是**每月 $29 美元**。高教、政府、非營利與勞動力發展單位另有 no-charge 的 cohort 方案。

具體最值得上的免費那一門：

[**Introduction to Generative AI**](https://www.skills.google/course_templates/536)，45 分鐘、Introductory、完成拿 badge，Google Skills 上顯示幾天前才更新過。[Coursera 版](https://www.coursera.org/learn/introduction-to-generative-ai)標示「Enroll for free」，162 萬人註冊、4.7 分（12,349 則評論）、**提供 29 種語言**；Udacity 上直接標為 Free Course。一位在 Class Central 留言的完課者講得最精確：「完成後給的是免費徽章，不是正式證書。」

它同時是 Beginner 級 [Introduction to Generative AI 學習路徑](https://www.skills.google/paths/118)的第一站，該路徑共 5 個活動，兩個月前才更新過。

（Google Cloud 部落格在 [2025 年 12 月](https://cloud.google.com/blog/topics/training-certifications/upskill-for-the-holidays-no-cost-ai-training-from-google-skills)另外列過一批標「no credits required」的課程，包括 Generative AI Leader、Introduction to Gemini Enterprise。那是季節性活動貼文，該站也有更早期、現已過時的免費徽章公告，引用時要看發布日期。）

#### 付費的那兩條線

- [**Google AI Essentials**](https://grow.google/intl/zh-TW_tw/ai-essentials/)：5 個單元，初學者入門。
- [**Google AI Professional Certificate**](https://grow.google/intl/zh-TW_tw/ai-professional/)：7 門課、20+ 實作 labs，最後一門用 Vibe Coding 做 App（不需寫程式）。報名送 3 個月 Google AI Pro 試用。

台灣 grow.google 頁面明載訂閱費 **US$49/月**（Coursera 訂閱制，另可走 Google Skills 或 Udemy）。

#### 那個「免不免費」的謎題，答案是這樣

四個通路四種說法：grow.google 台灣頁說 $49/月加 7 天試用；Google Skills 的路徑頁說「訂閱後可用，新用戶 7 天免費試用」；Google Cloud 部落格把 AI Essentials 列為「no credits required」且完成發證書；Udemy 上同一門課標「$20/月起」。

拆開來看其實不矛盾，只是沒有一個頁面願意把話講完整。有三件事被混在一起了：

1. **Coursera 走的是 audit 模式。** 一位在 2026 年第一季實際完課的評測者說得很清楚——[所有影片與閱讀教材都能免費看，只有評分作業與證書需要付費](https://www.aiifi.ai/ai-course-guides/google-ai-essentials-worth-it)。
2. **「credits」不是錢，是點數。** Google Skills 上的「no credits required」指的是不消耗平台的學習點數（跑 labs 用的內部貨幣，GEAR 每月送 35 點），跟訂閱費是兩回事。
3. **$29 和 $49 是兩種不同的訂閱。** 前者是 Google Skills 的完整課程目錄，後者是 Google Career Certificates（AI Essentials、AI Professional 屬於這一類）。兩張帳單，兩個東西。

所以結論很簡單：**課程內容你可以免費看完，$49 買的是那張 Google 證書。** 這也解釋了為什麼那麼多評測都在爭論「值不值 $49」——他們爭的其實是那張證書的品牌價值，而不是課程品質。

順帶一提，時長也沒有統一版本：grow.google 一處寫「不到 15 小時」、AI Skills 總覽頁寫「不到 10 小時」、Google Skills 頁寫 4 小時 45 分、Coursera 頁寫 4 小時，而實際上過的人寫約 6 到 8 小時。AI Professional 則同時稱「7 門課程」與「七個單元、每單元約 1 小時」，但它又說有 20+ 個實作 labs，一小時一單元的宣稱恐怕低估。

繁中讀者要注意一個實用細節：**AI Professional 頁面自己說「目前僅提供英文版，很快增加 10+ 語言」**。別因為看到繁中行銷頁就以為是中文授課。

台灣唯一明確標示「免費」的在地官方訓練是 [Grow with Google 的「Gemini 學院 - 教育工作者專場」](https://grow.google/intl/zh-TW_tw/gemini-academy/)工作坊，但對象是教師與學生，不是一般上班族。至於台灣政府或產業的在地補助、專屬折扣，抓到的所有 Google 頁面完全沒有提及。

### Elements of AI：唯一不賣自家產品的入門課

上面三家都有同一個問題：課的終點是讓你更會用它家的產品。這不是陰謀，是商業合理性，但你至少該知道有中立選項。

[**Elements of AI**](https://www.elementsofai.com/)，赫爾辛基大學與 MinnaLearn 合作，2018 年推出。免費、不需寫程式、約 30 小時、完成發證書。超過 **200 萬人**註冊、畢業生遍及 170 個國家；2019 年被 Class Central 從 1,167 門線上課程中選為全球最佳資訊科學線上課。女性參與比例約 40%，是資訊科學課程平均的兩倍以上。

課程分兩部分：Introduction to AI（六個模組，不需數學與程式）與 Building AI（五個模組，建議有基礎 Python）。內容是老派而紮實的 AI 素養——AI 是什麼、能做什麼、不能做什麼，機器學習、神經網路，以及 AI 的社會影響與倫理。它不會教你怎麼在 Gmail 裡按 Gemini 按鈕，但它會讓你在聽到任何一家廠商的宣稱時，知道該問什麼問題。

一個要先講清楚的限制：**它沒有中文版。** 官方說課程翻譯成 26 種語言、在 30 個國家在地化，但這批語言全是歐洲語言——這門課的緣起，是芬蘭擔任歐盟輪值主席國時，把它當成「送給所有會員國的無形禮物」。官網的國家選單列出的三十個站點，從奧地利到烏克蘭，沒有一個在亞洲。繁中讀者要上，只能上英文版。

## 第二層：vibe coding——已經在用，但主要靠感覺

這一層的目標很單純：讓工具在你手上跑順。你不需要懂 transformer，但你需要知道 CLAUDE.md 該寫什麼、context 滿了會發生什麼事、什麼時候該開新對話。

這一層的課有個共同特徵——**都很短**，一到兩小時。也因為短，它們的內容重疊度很高，挑一家的上完就好。

### Anthropic：Claude Code 的四門課

- [**Claude Code 101**](https://anthropic.skilljar.com/claude-code-101)（12 課 / 1.5 小時）：新手與資深工程師都可上，需要 code editor 與命令列基礎。
- [**Claude Code in Action**](https://anthropic.skilljar.com/claude-code-in-action)（15 課 / 1 小時）：給想加速開發流程的工程師，涵蓋 context 管理、hooks、custom commands 與 Agent SDK。
- [**Introduction to agent skills**](https://anthropic.skilljar.com/introduction-to-agent-skills)：在 Claude Code 裡建立與分享可重用的 markdown 指令。
- [**Introduction to subagents**](https://anthropic.skilljar.com/introduction-to-subagents)：用 subagent 管理 context、委派任務。

實際上完的人給的建議相當一致：Claude Code 101 有不少填充內容，真正該看的是 CLAUDE.md、skills、MCP 與 context 管理那幾段。有位 reviewer 花 20 分鐘上完 subagents 那門，覺得對 subagent 與主 agent 的 context window 差異講得清楚，但沒教「subagent 跑到一半卡住怎麼辦」——而那恰好是實務上最常遇到的問題。

### OpenAI：Codex 系列

OpenAI Academy 的三門正式課都是非技術向，真正的 Codex 內容在 [Builders 社群](https://academy.openai.com/public/clubs/builders-etkn1/overview)（27,030 名成員）裡：**Codex 101（入門）、102（實務工作流）、103（進階工作流與自動化）**，另有 Codex for Everyday Use、Building Websites with Codex Sites 等。

2026 上半年 OpenAI 的兩條主軸很明顯：**agent 與 Codex**。這些內容多數需登入才能完整存取，公開頁只看得到標題。

### Google：Vibe Coding 做 App

Google AI Professional Certificate 的最後一門課就是用 Vibe Coding 做 App，明說不需寫程式。這是這份清單裡唯一把 vibe coding 直接寫進課綱的付費證書課（$49/月）。

Kaggle 在 2026 年 6 月也開過一梯 [**Vibe Coding 版的 5-Day Intensive**](https://blog.google/innovation-and-ai/technology/developers-tools/kaggle-genai-intensive-course-vibe-coding-june-2026/)，免費、含 capstone project。

## 第三層：vibe coding 的下一步——讓它能上 production

這是這篇的主戰場，也是落差最大的一層。

第二層讓 AI 幫你把東西寫出來，第三層問的是另一個問題：**你怎麼知道它是對的？** 評估怎麼做、guardrails 怎麼設、多個 agent 同時改同一份 codebase 怎麼不打結、prompt injection 怎麼防、agent 上線之後怎麼監控。

多數人卡在這裡，而且卡很久。因為第二層的課教你怎麼發指令，第三層的課教你怎麼建立一套不靠運氣的流程。

### Stanford CS146S：唯一廠商中立的實戰全景

[`themodernsoftware.dev`](https://themodernsoftware.dev/) 看起來像獨立課程平台，實際上是 **Stanford 正式學分課「CS146S: The Modern Software Developer」的課程官網**（Fall 2025）：3 學分、10 週，每週投入約 10–12 小時，先修要求是 CS111 等同程度的程式經驗。

主講 Mihail Eric：Stanford NLP Group 出身（指導教授含 Manning、Percy Liang、Potts），前 Amazon Alexa AI 科學家，YC 新創 Storia AI 共同創辦人。

關鍵是，**每週的 slides、reading list、[GitHub 作業](https://github.com/mihail911/modern-software-dev-assignments)全部對外公開**，等於一份免費的自學教材。10 週大綱：

```
1  Introduction to Coding LLMs
2  The Anatomy of Coding Agents      ← agent 架構、tool use、MCP
3  The AI IDE                        ← context 管理、"Specs Are the New Source Code"
4  Coding Agent Patterns             ← autonomy 層級、Claude Code
5  The Modern Terminal
6  AI Testing and Security           ← prompt injection、context rot
7  Modern Software Support           ← AI code review、debugging
8  Automated UI and App Building
9  Agents Post-Deployment            ← observability、多 agent
10 What's Next for AI SWE
```

Guest speaker 名單相當誇張：**Boris Cherney（Claude Code 創造者）**、Silas Alberti（Cognition/Devin 研究主管）、Zach Lloyd（Warp CEO）、Isaac Evans（Semgrep CEO）、Gaspar Garcia（Vercel AI 研究主管）、Martin Casado（a16z GP）。

它跟 OpenAI Academy、Anthropic Academy 最大的差異是**廠商中立**：同一門課裡同時教 Cursor、Claude Code、Windsurf、Warp，而不是只教自家產品。作業裡包含從零手刻一個 coding agent 和一個 MCP server。

同一套內容另有 [Maven 上的付費 cohort 版](https://maven.com/the-modern-software-developer/ai-course)「AI Software Development: From First Prompt to Production Code」：4 週、8 場 live session、14 堂課、4 個專案，附私人 Discord 社群與結業證書，已辦到第三梯。**價格未能確認**——頁面顯示 Sold out，未列金額。

風評要打個折。Maven 頁上的 4.9 分（50 則）是課程自家頁面的評價，不是中立第三方；Reddit r/theprimeagen 雖有討論串，但站方擋掉抓取，留言內容取不到，因此也不能反過來宣稱風評一面倒好。課程行銷語言裡的「世界第一門這類課」「10x productivity」屬 marketing claim，未經獨立查證。

### Anthropic：API 與 MCP，份量突然變重

同一個 Academy 平台，跨過第二層之後份量差距非常明顯——從一小時的短課，跳到八小時的硬課：

- [**Building with the Claude API**](https://anthropic.skilljar.com/claude-with-the-anthropic-api)：84 課、8.1 小時、10 份 quiz。涵蓋 prompt engineering & evaluation、tool use、RAG、MCP、Computer Use、agents and workflows。需 Python + JSON + API key。
- [**Claude with Amazon Bedrock**](https://anthropic.skilljar.com/claude-in-amazon-bedrock) / [**Claude with Google Vertex AI**](https://anthropic.skilljar.com/claude-with-google-vertex)：各 85 課、8 小時，結構與 API 課高度重疊，差在雲端平台。
- [**Introduction to MCP**](https://anthropic.skilljar.com/introduction-to-model-context-protocol)（16 課 / 1 小時）與 [**MCP: Advanced Topics**](https://anthropic.skilljar.com/model-context-protocol-advanced-topics)（15 課 / 1.1 小時，涵蓋 sampling、notifications、transports）。

[上過 API 那門的人](https://www.youtube.com/watch?v=qUQbU7h4RoE)說它是整個平台「最完整的技術課」，而且值得——但也提醒，如果你已經上過 AI Fluency，prompt engineering 那段可以跳過；如果你本來就讀得懂程式碼，看影片逐行講解不會比自己讀快。[另一位工程師](https://www.ericapisani.dev/what-i-learned-from-anthropics-building-with-the-claude-api-course)的具體收穫是用 XML tag 分隔 prompt 裡的範例與資料，以及 Claude Code 搭配 git worktree 平行開發。她的批評也很具體：agent 那段只講到高層概念，沒有深入 evaluation framework 該長什麼樣。

而 evaluation 正是這一層最重要的東西。

一個容易踩空的點：**平台上沒有獨立的 prompt engineering 課**。它被塞在 API/Bedrock/Vertex 課的一個段落裡。想單練 prompt engineering 的話，獨立教材在 GitHub 上的 [`anthropics/prompt-eng-interactive-tutorial`](https://github.com/anthropics/prompt-eng-interactive-tutorial)，另外 [`anthropics/courses`](https://github.com/anthropics/courses)（約 22.1k stars）收了五門 Notebook 課。

### Kaggle 5-Day AI Agents Intensive

這門課的課綱幾乎就是這一層的定義，而且免費。由 Google ML 研究員與工程師設計，原為 2025 年 11 月的線上直播（首梯觸及超過 150 萬名學習者），現已改為 self-paced 的 [Kaggle Learn Guide](https://www.kaggle.com/learn-guide/5-day-agents)，隨時可上：

- Day 1 Introduction to Agents（ADK + Gemini 建 multi-agent）
- Day 2 Agent Tools & Interoperability with MCP
- Day 3 Context Engineering: Sessions & Memory
- Day 4 Agent Quality（observability、LLM-as-a-Judge、HITL）
- Day 5 Prototype to Production（A2A Protocol、部署到 Vertex AI Agent Engine）

每單元含 whitepaper、podcast、Kaggle codelabs 與直播回放。

但要先有心理準備：它比聽起來的難。詳見後面「上過的人怎麼說」那一節。

### Hugging Face：課程數量最多、而且發免費證書

[`huggingface.co/learn`](https://huggingface.co/learn) 是這輪掃下來覆蓋面最完整的免費生態，而且它不綁單一模型供應商。目前上架的課程包含 LLM Course、Agents Course、[MCP Course](https://huggingface.co/learn/mcp-course/en/unit0/introduction)、Context Course（專講 context engineering for code agents，是較新的一門）、Deep RL Course、Diffusion Course、Audio Course、Computer Vision Course、Robotics Course（LeRobot）、a smol course（post-training）以及 Open-Source AI Cookbook。

以逐頁確認過的 [Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) 為例，它的設計相當實在：需要基本 Python 與 LLM 知識，建議步調是每章一週、每週投入 3–4 小時，沒有截止日，可以隨時開始。**它提供兩種免費證書**——完成 Unit 1 拿 fundamentals 證書，再加一個 use case 作業與 final challenge 可拿完整結業證書。維護者是 Ben Burtenshaw 與 Sergio Paniego，官方定位為持續維護的 living project。

語言方面，Agents Course 目前提供的翻譯是英文、西班牙文、法文、韓文、俄文、越南文與**簡體中文**。**沒有繁體中文版。**

如果你想要的是「有結構、有證書、又不必付錢也不必綁 OpenAI 或 Anthropic 帳號」，這裡是起點。

### Microsoft：開源選項裡最扎實的一份

[`microsoft/generative-ai-for-beginners`](https://github.com/microsoft/generative-ai-for-beginners) 是一份 21 課的開源課程，MIT License，約 113k stars、60.6k forks。每課包含短影片、README 與 Python／TypeScript 範例。

它有兩個其他資源少見的優點。第一，**README 提供 50 多種語言的翻譯，其中包含繁體中文（台灣）**——在這份清單裡，明確確認有繁中的只有它和李宏毅。第二，它在 2026 年仍然活躍更新，最新的 commit 正在做 Azure OpenAI 到 Responses API 的遷移，不是一份放著長灰塵的教材。

兩個要注意的點：課程需要搭配 Azure OpenAI、Microsoft Foundry Models 或 OpenAI API 才能跑，本身不含額度；另外頁面明確提到 **GitHub Models 將於 2026 年 7 月底退役**，如果你照著範例走，這部分要換掉。沒有結業證書。

如果你要的是正式認證而非開源教材，[Microsoft Learn 的 AI learning hub](https://learn.microsoft.com/en-us/ai/) 免費，並依角色分成八條路徑（商業/技術主管、一般使用者、資料科學家、開發者、IT、資安等）。它的正式認證是 **Azure AI Fundamentals（Exam AI-901）**，主打用 Microsoft Foundry 與 Python 建構 AI 解決方案。

### DeepLearning.AI：廣度標竿

[DeepLearning.AI 的課程頁](https://www.deeplearning.ai/courses/)顯示共 124 門課（短課程 100 門、course 13 門、專業證書 11 門），難度分布是初階 64 門、中階 60 門。**網站上的短課程免費**，而且逐課標示時數，這點對排學習計畫很有用：AI Prompting for Everyone 7 小時 4 分、Agentic AI 10 小時 55 分、Deep Learning Specialization 則是 127 小時 31 分。

它真正的價值在合作方名單——課程直接跟 Anthropic(4)、OpenAI(4)、Google(4)、Hugging Face(5)、Microsoft(3)、Meta(3)、AWS(1) 合開。2025–26 的新課包含 Claude Code、Agent Skills with Anthropic、Spec-Driven Development，等於把各家官方教材再做一次課程化整理。首頁橫幅還掛著新課 Voice for AI Agents and Applications，更新非常勤。

短課程完成有 completion 標記。**Coursera 上的專項證書要付費**，[官方定價頁](https://www.coursera.org/courseraplus)寫得很清楚：單一學習方案 $49–$79 美元/月，Coursera Plus 月繳 $59、年繳 $399（抓取當天有 40% 促銷，年繳 $239.40）。也就是說，Google 那張 $49/月的帳單，跟你在 Coursera 上修任何一個專項的價錢是同一個量級。

### NVIDIA、AWS：偏企業與雲端

[**NVIDIA Deep Learning Institute**](https://www.nvidia.com/en-us/training/) 採混合制：多數熱門的 self-paced 課程免費（例如 Find the Bottleneck: Optimize AI Pipelines With Nsight Systems，3 小時），instructor-led workshop 則收費，常見 8 小時一場（例如 Building AI Agents with Multimodal Models）。部分課程可拿 DLI 證書，付費認證考試另計。平台活躍，官網掛著 2026 年 7 月的 SIGGRAPH 訓練場次。

繁中讀者這裡有個少見的好消息：NVIDIA 在台灣有官方授權的 DLI 合作夥伴（[麗臺科技](https://www.leadtek.com/cht/courses/DLI)自 2017 年起），開設**中文授課**的公開班與企業包班，通過測驗一樣拿 NVIDIA 官方證書。至於 learn.nvidia.com 上的自學課程有沒有繁中介面，現行課程頁未標語言，**未能確認**。

[**AWS Skill Builder**](https://aws.amazon.com/training/digital) 是 freemium：免費層有 **500 多門隨選數位課程**（首頁另稱「1,000+ 免費學習資源」與「900+ 免費自學課程」，三個數字口徑不一，看你怎麼算），付費個人訂閱 **$29 美元/月或 $449 美元/年**（年繳版多了 Digital Classrooms 的專家授課），團隊方案同樣是每席每年 $449。訂閱含 Builder Labs 與認證備考。

這裡對繁中讀者有實質意義：[AWS 官方 FAQ](https://aws.amazon.com/training/faqs) 明載免費數位訓練提供 **17 種語言，包含繁體中文**（Chinese (Traditional)）。這是本文清單裡少數在現行官方頁面上就把繁中寫進去的商業平台。

另外一則 2026 年的變動值得知道：AWS 的 **microcredentials 已改為免費**，不需 Skill Builder 訂閱。

## 第四層：底層 AI——搞懂模型裡面在幹嘛

前三層都在講怎麼駕馭模型，這一層只問一件事：模型本身是怎麼造出來的。

**先說一個容易搞錯的方向感。** 卡在第三層的人，直覺反應常常是「我是不是該去補原理」，於是一頭栽進這一層。但 agent 上不了 production 的原因，九成是缺 evals、context 管理沒做好、guardrails 沒設，不是因為你不會手刻 attention kernel。第四層不會解決第三層的問題。

真正該來這一層的理由只有一個：你想知道它為什麼會這樣，而不只是讓它動起來。這裡有四個台階，從緩到陡。

### 李宏毅：繁中讀者的入口

如果你讀中文比讀英文快，這一段比後面三段都重要。

台大李宏毅[《生成式人工智慧與機器學習導論 2025 Fall》](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)，**全繁體中文、免費、投影片與影片全公開**，2025 Fall 共 10 講，2026 年 1 月學期剛結束，內容已完整上架。他每年開新版。無正式證書（旁聽無學分）。

課程 FAQ 明講目標受眾是初學者，甚至說「即使沒有程式經驗，按助教指示至少可及格」。**但別被「初學者」三個字騙了。** 這裡的初學者是大學課程語境下的初學者——預設你是理工科系學生，只是還沒碰過機器學習。作業清單長這樣：HW2 建 RAG 系統、HW4 做 LLM 惡意指令防禦、HW7 finetuning LLM、HW9 Diffusion、HW10 語音生成，全部在 Colab 免費 GPU 上跑。

一個只想學怎麼用 ChatGPT 寫週報的人，點進 HW7 會直接關掉。這就是為什麼它不在第一層——它不是 AI 素養課，是一門**用中文教的底層技術課**。

如果你願意寫 code，它是繁中資源裡沒有第二個的選擇：免費、成體系、每年更新、有紮實實作。

### MIT 6.S191：英文世界最平緩的入口

先修門檻是三門裡最低的：微積分與線性代數，**Python 有經驗有幫助但非必要**，其他的課程會邊講邊補。

[2026 版](https://introtodeeplearning.com/)從 3 月 30 日開始，每週一釋出新的 lecture、slides 與 lab，全部開源，實驗跑在 Google Colab 上。內容從神經網路基礎、深度序列模型、電腦視覺、生成模型、強化學習，一路到大型語言模型與 AI for science。它每年更新，2026 版加強了 LLM 與 agentic AI 的篇幅。

如果你想理解「模型為什麼會這樣」但不想一開始就手刻 kernel，這是最合理的第一站。

### Harvard CS50 AI：LLM 以外的 AI

CS50's Introduction to Artificial Intelligence with Python 值得單獨提，因為它教的東西**刻意不只是 LLM**：搜尋演算法、知識表示與邏輯、機率、最佳化、機器學習、神經網路、自然語言處理。

在一個所有課程都在教 prompt 和 agent 的年份，補一門講 search 與 logic 的課，反而會讓你對「什麼問題該用 LLM、什麼問題根本不該用」有判斷力。

[Harvard OpenCourseWare 上**免費且含證書**](https://www.classcentral.com/report/harvard-cs50-guide)；edX 上的驗證證書要 $299。課程頁標示約 7 週、每週 20 小時。

### Stanford CS336：最硬的一門

如果 DeepLearning.AI 是廣度標竿，CS336: Language Modeling from Scratch 就是深度標竿的另一端。

[網站](https://cs336.stanford.edu/)、投影片、作業說明與 YouTube 錄影全部免費公開（正式學分與 Gradescope 批改限 Stanford 學生）。官網現已更新到 **Spring 2026 版**，主講 Tatsunori Hashimoto 與 Percy Liang，19 講，搭配 5 個大型 assignment：從手刻 tokenizer、model、optimizer，到 FlashAttention2 與 Triton kernel，再到 scaling law、資料處理，最後是 SFT + RL。

先修門檻是實話實說的高：熟練 Python、PyTorch、深度學習與系統基礎，加上微積分、線性代數、機率。官方自述**「實作量至少比其他課多一個數量級」**。沒有證書，也沒有中文。

它跟李宏毅的差異在於深度而非方向：李宏毅讓你理解模型在做什麼，CS336 要你把它整個做出來。合理的順序是先李宏毅、再 CS336，中間隔一段真的動手寫過東西的時間。

## 上過的人怎麼說

上面全是官方頁面的說法。真正上完的人怎麼講，參考價值更高，而且不太好聽。

**「課不是最好的學法。」** 一位[把 Anthropic 全部 18 門課在一個週末刷完](https://www.youtube.com/watch?v=T-3bE2IIK4M)的 reviewer 說得最直接：真正有用的只有其中少數幾門，「none of these courses are the best way to learn Claude — 最好的學法不是看課，是自己去用」。他點名 Claude Code 101「有很多 fluff」，真正有價值的是 CLAUDE.md、skills、MCP 與 context 管理那幾段，其餘是填充。他也提到自己把所有認證都考完，拿了 99 分——這對「證書值多少」是個相當清楚的答案。

**官方課的共同盲點是不教你判斷。** 有 reviewer 直接指出 Anthropic Academy 的內容是 Claude-specific、「zero cross-platform transferability」；Google 的課則教你在 Workspace 裡用 Gemini。這不是陰謀，是商業合理性——但它解釋了為什麼 CS146S 那種同時教 Cursor、Claude Code、Windsurf、Warp 的廠商中立課特別值錢。

**Google AI Essentials 的評價高度一致：新手很好，老手太淺。** [一位完課者](https://productivitystack.substack.com/p/google-ai-essentials-review)（2025 年 5 月）寫「這門課對我來說太簡單了……它沒教我任何新技能，只是讓我意識到我還缺哪些技能」，並認為 $49 對這個內容量「有點貴」。另一位在 [LinkedIn](https://www.linkedin.com/posts/automatewithjames_i-took-a-google-ai-essentials-course-today-activity-7392604986662244352-tUnK) 上（2025 年 11 月）更不留情：內容基本、教得不錯，但「以這個難度來說課太長了」，而且「上次更新是五月——以 AI 的時間尺度這是幾十年前」。[較新的評測](https://blog.theinterviewguys.com/google-ai-essentials-review)（2026 年 2 月）結論類似：對完全沒碰過 AI 的人 8/10，對已經天天用 ChatGPT 的技術工作者 5/10。

**Kaggle 那五天沒有它聽起來那麼親民。** 免費、Google 出品、破百萬人上過，很容易讓人以為適合所有人。[NYU 的一篇評測](https://nexus.sps.nyu.edu/post/nexus-review-kaggle-5-day-gen-ai-intensive-course-with-google)講得很白：這門課適合「已經有寫程式與機器學習基礎」的人，對只有一般興趣的休閒學習者，「與其說是教育，不如說是壓垮」。它的 whitepaper 有時超過 100 頁，podcast 是 AI 生成的，而且完全自主學習、沒有任何回饋機制。

順帶一提，這門課的前身在 2025 年 4 月拿下金氏世界紀錄（28 萬人同時參與），agent 版則吸引超過 150 萬名學習者。規模不代表適合你。

**但真正上完的人，帶走的東西是一致的。** 一位完成 Kaggle agent 課的工程師的筆記可以當這整篇的總結：傳統軟體工程的最佳實踐沒有消失（模組化、測試、版本控管、監控）；「evaluation is everything——你不能用猜的判斷 agent 有沒有效，你要量測」；guardrails 不是裝飾；「沒有工具的模型聰明但無用，配錯工具的模型則很危險」。

## 怎麼選

**第一層**（不懂 AI）：挑 OpenAI Academy 三門課走完就夠，免費、有證書、三小時內。只想花 45 分鐘搞懂生成式 AI 是什麼，就上 Google 的 Introduction to Generative AI，免費而且有 29 種語言。想要不綁廠商的視角，Elements of AI，但只有英文。需要在組織內推 AI 教育，才換成 Anthropic 的 AI Fluency 分眾系列。這一層不要碰李宏毅。

至於 Google 那 $49/月：**先用 audit 模式把影片看完，確定你真的想要那張證書，再付錢。** 課程內容本來就免費開放，付費買的只是評分作業與證書。

**第二層**（vibe coding）：Anthropic Claude Code 101（1.5 小時）加 Claude Code in Action（1 小時）就足以讓工具跑順。用 Codex 的話換 OpenAI 的 Codex 101/102/103。這一層很短，別在這裡待太久——它的天花板很低。

**第三層**（讓它能上 production）：這是大多數人真正該投資的地方。

```
Kaggle 5-Day AI Agents Intensive     ← 免費，evals / context / 部署一次到位
        ↓
Stanford CS146S 公開教材              ← 廠商中立的實戰全景，含安全與多 agent
        ↓
分岔：
  想深入 protocol → Anthropic MCP 兩門 (2.1h)
  想深入 API     → Building with the Claude API (8.1h)
  想要一張證書   → Hugging Face Agents Course（免費發證）
```

**第四層**（底層 AI）：讀中文就從李宏毅開始；讀英文從 MIT 6.S191 入門，CS50 AI 補上 LLM 以外的視野，CS336 收尾。全部免費公開。

最後提醒一次那個方向感：**第四層不會解決第三層的問題。** 卡在「AI 寫的東西不敢上線」的人，需要的是 evals、guardrails 與 observability，那些在 Kaggle 那五天和 CS146S 裡，不在 FlashAttention kernel 裡。

掃完這一輪，最強烈的感受是：這個領域的免費教材品質已經高到有點荒謬——Stanford 的正式課程教材公開、Claude Code 的作者親自來當客座、Google 的 agent 課完全免費、李宏毅每年更新一版中文課。

瓶頸從來不在取得管道。是在你願不願意真的把作業寫完。

---

## 參考資料

- [OpenAI Academy](https://academy.openai.com/)
- [New OpenAI Academy courses for the next era of work](https://openai.com/index/academy-courses-applying-ai-at-work/)
- [OpenAI Academy 課程說明（繁中）](https://help.openai.com/zh-hant/articles/20001270-openai-academy-courses)
- [Anthropic Academy](https://anthropic.skilljar.com/)
- [Claude Certified Architect – Foundations](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)
- [anthropics/courses（GitHub）](https://github.com/anthropics/courses)
- [anthropics/prompt-eng-interactive-tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial)
- [Google AI Professional Certificate（繁中頁）](https://grow.google/intl/zh-TW_tw/ai-professional/)
- [Google AI Essentials（繁中頁）](https://grow.google/intl/zh-TW_tw/ai-essentials/)
- [Kaggle 5-Day AI Agents Intensive](https://www.kaggle.com/learn-guide/5-day-agents)
- [Kaggle GenAI Intensive: Vibe Coding 梯次公告，2026 年 6 月（Google Blog）](https://blog.google/innovation-and-ai/technology/developers-tools/kaggle-genai-intensive-course-vibe-coding-june-2026/)
- [CS146S: The Modern Software Developer（Stanford）](https://themodernsoftware.dev/)
- [CS146S 作業 repo](https://github.com/mihail911/modern-software-dev-assignments)
- [AI Software Development: From First Prompt to Production Code（Maven）](https://maven.com/the-modern-software-developer/ai-course)
- [Hugging Face Learn](https://huggingface.co/learn)
- [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction)
- [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [DeepLearning.AI Courses](https://www.deeplearning.ai/courses/)
- [Stanford CS336: Language Modeling from Scratch](https://cs336.stanford.edu/)
- [Elements of AI（University of Helsinki × MinnaLearn）](https://www.elementsofai.com/)
- [Elements of AI 破百萬學習者（University of Helsinki 官方新聞，較早期里程碑；官網現稱已逾 200 萬）](https://www.helsinki.fi/en/news/artificial-intelligence/elements-ai-has-introduced-one-million-people-basics-artificial-intelligence)
- [MIT 6.S191: Introduction to Deep Learning](https://introtodeeplearning.com/)
- [Harvard CS50 指南：如何拿免費證書（Class Central）](https://www.classcentral.com/report/harvard-cs50-guide)
- [Introduction to Generative AI（Google Skills，45 分鐘免費課）](https://www.skills.google/course_templates/536)
- [Introduction to Generative AI（Coursera 版，Enroll for free）](https://www.coursera.org/learn/introduction-to-generative-ai)
- [Upskill for the holidays: No-cost AI training from Google Skills（Google Cloud Blog，2025-12-02）](https://cloud.google.com/blog/topics/training-certifications/upskill-for-the-holidays-no-cost-ai-training-from-google-skills)
- [Understanding AI: AI tools, training, and skills（Google 官方學習入口，持續更新）](https://ai.google/learn-ai-skills)
- [Beginner: Introduction to Generative AI 學習路徑（Google Skills）](https://www.skills.google/paths/118)
- [Is Google AI Essentials Worth It?（含 audit 免費、證書付費的拆解）](https://www.aiifi.ai/ai-course-guides/google-ai-essentials-worth-it)
- [Coursera Plus 官方定價頁](https://www.coursera.org/courseraplus)
- [AWS Skill Builder 數位訓練與現行訂閱定價](https://aws.amazon.com/training/digital)
- [AWS Training FAQ（免費課程數與 17 種語言清單，含繁體中文）](https://aws.amazon.com/training/faqs)
- [Microsoft Learn AI learning hub](https://learn.microsoft.com/en-us/ai/)
- [Inside Kaggle's AI Agents Intensive Course with Google（官方 recap）](https://blog.google/innovation-and-ai/technology/developers-tools/ai-agents-intensive-recap)
- [Nexus Review: Kaggle 5-Day Gen AI Intensive Course（NYU，含負面評價）](https://nexus.sps.nyu.edu/post/nexus-review-kaggle-5-day-gen-ai-intensive-course-with-google)
- [Google AI Essentials Review（Amanda Claypool）](https://productivitystack.substack.com/p/google-ai-essentials-review)
- [What I learned from Anthropic's "Building with the Claude API" course（Erica Pisani）](https://www.ericapisani.dev/what-i-learned-from-anthropics-building-with-the-claude-api-course)
- [How to learn Claude Code for free with Anthropic's AI courses（ZDNET）](https://www.zdnet.com/article/how-to-learn-claude-code-with-free-anthropic-ai-courses-online)
- [Hugging Face MCP Course](https://huggingface.co/learn/mcp-course/en/unit0/introduction)
- [李宏毅《生成式人工智慧與機器學習導論 2025 Fall》](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)
- [NVIDIA Deep Learning Institute](https://www.nvidia.com/en-us/training/)
- [AWS Skill Builder](https://skillbuilder.aws/)
