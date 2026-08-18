---
title: "AI Agent 自動產生簡報：讓模型看見自己排的版"
date: 2026-08-18
type: deep-dive
category: ai
tags: [ai-agent, slide-generation, agent-skills, marp, slidev, pptx, visual-qa]
lang: zh-TW
tldr: "2026 年 agent 做簡報的共識：outline-first + 內容/構建分離 + render 成圖讓 fresh-eyes subagent 做視覺 QA。Anthropic 與 OpenAI 的官方 slides skill 都收斂到 PptxGenJS + 視覺驗證迴圈，學術線（PPTAgent→PreGenie→DeepPresenter）也指向同一方向。但下半年出現兩個修正：PresentBench 指出常被引用的 PPTEval 給分過於樂觀，SeaSlides 則主張不該讓模型直接寫自由格式的 HTML／SVG。"
description: "整理 AI agent 自動產生簡報的 best practice：Anthropic pptx skill 原文拆解、Marp/Slidev code-first 路線、Gamma API 與 Manus 等 SaaS 做法、視覺 QA 迴圈與反模式清單。"
draft: false
---

LLM 擅長產文字，但看不見自己排的版。簡報是視覺文件，文字溢出、元素重疊、對比不足這些缺陷只有 render 之後才存在——這就是為什麼早期 AI 簡報普遍醜得很一致。2026 年的成熟方案，不管是 Anthropic 與 OpenAI 的官方 skill、Marp/Slidev 的 code-first 工作流，還是 Gamma、Manus 這些產品，全部都在解同一道題：**怎麼讓 agent 取得視覺回饋**。這篇整理目前的共識架構、三條輸出路線的取捨，以及該避開的反模式。

## 共識架構：四層工作流

把各家做法疊起來看，會收斂出一個四層架構：

1. **Interview / Brief first**：動工前先問受眾、目的、長度、key message。S Anand 的 voice-to-slides 工作流和 freeCodeCamp 的 Claude Code + Marp 教學都把「AI 先訪談你」當第一步——它逼你在第一張 slide 存在之前就把故事講清楚。
2. **Outline first**：先產大綱（可帶 per-slide layout hint）給人審，審完才 render。錯誤在大綱階段修正最便宜；slides-grab-studio 之類的工具甚至把「review outline」做成流程中的硬性步驟。
3. **內容 / 構建分離**：LLM 負責內容決策，輸出結構化中間表示（Marp/Slidev markdown、PptxGenJS script、JSON slide map），由 deterministic renderer 構建檔案。社群的 pptx-generator skill 把原則講得最白：「Slides are visual documents, not text dumps. Generate mechanically, validate visually.」讓 LLM 徒手寫 OOXML 是反模式，OOXML 直接操作只保留給「編輯既有檔案、保留模板」的場景。
4. **Render → 視覺 QA 迴圈**：每頁 render 成圖，交給**零生成上下文的 fresh-eyes subagent / VLM** 對照 checklist 找問題，修完只重驗受影響頁，直到一輪全過。這層是整個架構裡最關鍵、也最常被偷懶跳過的。

第 4 層為什麼必須是「別人」來看？因為生成 agent 有 context bias——它知道 slide「應該」長什麼樣，會合理化自己造成的視覺缺陷。Anthropic 的 pptx skill 與社群 skill 都明文要求 generator 與 validator 分離。

## Anthropic pptx skill 原文拆解

Anthropic 在 GitHub 開源的 [skills repo](https://github.com/anthropics/skills) 裡，pptx skill 的 SKILL.md 是目前最完整的一手教材。三條操作路徑：讀取分析用 `markitdown`、編輯既有檔走 OOXML unpack→edit→pack、從零建立用 **PptxGenJS**（早期版本主打 html2pptx，現行 main 分支已改為 PptxGenJS 直構；API 平台版的容器則跑著 Node + Playwright + LibreOffice + Sharp 的重型 stack）。

最值得抄的是它把 QA 寫成 Required 段落，開頭就是：

> "Assume there are problems. Your job is to find them. Your first render is almost never correct. … If you found zero issues on first inspection, you weren't looking hard enough."

工作流是 `soffice` 轉 PDF → `pdftoppm` 轉每頁 JPG → 派 subagent 帶著 12 條 checklist（重疊、溢出、邊距 < 0.5"、對比不足、placeholder 殘留…）逐頁檢查 → 修 → 重驗，且「**沒跑過至少一次 fix-and-verify cycle 不准宣告完成**」。

設計指南部分也很具體：配色要 content-informed（「如果你的配色換到完全不同主題的簡報還能用，就是不夠具體」）、一色主導 60-70% 視覺權重、標題 36-44pt 對比 14-16pt 內文。還有一條被特別標記的 anti-AI 規則：

> "NEVER use accent lines under titles — these are a hallmark of AI-generated slides."

OpenAI 的官方 slides skill 走完全同構的路：PptxGenJS + `slides_test.py` overflow 偵測 + `warnIfSlideHasOverlaps` / `warnIfSlideElementsOutOfBounds` + skia-canvas/fontkit 文字量測 + LibreOffice rasterize 驗證。兩大廠獨立收斂到同一架構，這個方向基本可以視為定論。

## Code-first 路線：Marp 與 Slidev

對工程師日常，markdown→slides 是阻力最小的路線，因為純文字就是 LLM 的主場：

- **[Marp](https://marp.app/)**：語法極簡，LLM 語法錯誤率趨近零；輸出 HTML / PDF / **PPTX**；CLI 有 `--watch` 熱重載，配 GitHub Actions 可以把 deck 當 build artifact——push 即重 render。代價是 styling 自由度低，且輸出的 PPTX 每頁是一張圖，不可逐元素編輯。
- **[Slidev](https://sli.dev/)**：語法較豐富，可內嵌 Vue 元件、Mermaid 圖與 syntax-highlighted code block，LLM 也幾乎都能產出合法輸出。自由度高的代價是較易爆版，所以社群做了 [slidev-overflow-checker](https://github.com/mizuirorivi/slidev-overflow-checker)：用 Playwright 真實瀏覽器 render、以 px 計算 overflow、回報對應的 markdown 行號，輸出機器可讀格式讓 agent 自動修。它的 README 一句話講完本質：「LLMs are good at generating text, but bad at validating visual layout.」

實務上的起手式：把 Marp/Slidev 的語法規範、CSS palette、slide 結構慣例寫成 Claude Code skill，配 interview → outline → 生成 → export 的流程。一份 15 頁 deck 的 markdown→PDF 轉換約 2 秒，迭代成本接近零，而且整份簡報可以 git diff。

## SaaS Agent 路線：Gamma、Manus、Kimi

不想自架 pipeline 的話，產品線在 2025-2026 也明顯 agent 化：

- **Gamma**：2025-09-16 的 Gamma 3.0 推出 Gamma Agent 與 [Gamma API](https://developers.gamma.app/docs/getting-started)——`POST /v1.0/generations` 帶 `inputText` / `numCards` / `exportAs` 參數，poll 到 `completed` 拿 gammaUrl 與匯出檔，適合 CSV→百份個人化 deck 的批量場景。API 需 Pro 以上方案。
- **Manus Slides**：research → narrative → design → speaker notes 全自動，可上傳公司 .pptx 模板套版，輸出 pptx / PDF / web。另有 Nano Banana Pro 整頁圖像式 slides——視覺品質高、文字渲染準確，但官方 FAQ 自承內容嵌死在圖裡，**不可編輯**，要可編輯交付仍得走 HTML/pptx 路線。
- **Kimi Slides**：雙模型分工——K2 Thinking 管研究、敘事、文案，Nano Banana Pro 管每頁客製插圖（此架構描述來自第三方整理，單源待證）。

- **NotebookLM**：Google 的產品線，中文圈較少被拿來跟前面幾家並列——但在下面會講的 PresentBench 評測裡，它是受測產品中分數最高的一個。

SaaS 的共同弱點是黑盒與模板感：你拿不到中間表示，迭代只能透過自然語言，且設計上限被產品鎖死。

## 學術線印證：PPTAgent → PreGenie → DeepPresenter

研究端走了同一條演進線。[PPTAgent](https://arxiv.org/abs/2501.03936)（EMNLP 2025）放棄從零生成，改走兩階段的 edit-based 路線：先分析參考模板，再以編輯操作把內容填進去，並提出 PPTEval 用 Content、Design、Coherence 三個維度評估。

[PreGenie](https://arxiv.org/abs/2505.21660) 用 Slidev 當中間表示，理由是它「比 HTML 或 python-pptx 更簡單的結構，降低 LLM 產出錯誤 code 的難度」，並把 review 拆成 LLM code review 與 VLM page review 兩層。論文明確指出，**圖片溢出頁面邊界這類問題從 code 看不出來，只有 render 後才可見**。

2026-02 的 [DeepPresenter](https://arxiv.org/abs/2602.22839)（ACL 2026 Findings）更進一步，把「環境接地的反思」（environment-grounded reflection）做成核心機制：agent 用 `inspect` 工具把 HTML slide render 成像素圖看，根據畫面而非內部推理軌跡來修正。

論文自己把問題講得很準：**agent 操作的是中間表示（HTML 或 markdown），使用者看到的卻是 render 後的結果**，這個「狀態錯配」讓內省式反思在錯的觀察空間裡運作。它的 fine-tuned DeepPresenter-9B 拿 4.19 分，勝過所有開源基線並逼近 GPT-5 的 4.22。

值得一提的是，DeepPresenter 與 PPTAgent 出自同一個團隊（中科院軟體所，專案共用同一個 repo）。所以這條演進線不只是主題相近，是同一群人把自己的前作推翻重做。

學術線跟工程線在同一點會合：**視覺回饋不是 nice-to-have，是這個任務的本質需求**。

## 兩個該知道的新發展：評測變嚴了，而且出現了反方意見

上面那套「共識架構」在 2026 上半年仍然成立，但下半年有兩件事值得補進來。

### PresentBench：PPTEval 給分過於樂觀

[PresentBench](https://arxiv.org/html/2603.07244v1) 是細粒度的評分表式 benchmark：238 個評測實例，每個平均配 **54.1 條二元檢查項**，涵蓋簡報基本功、視覺設計與排版、內容完整性、內容正確性、內容忠實度五個面向。

它的核心發現對前面的內容有直接影響：**像 PPTEval 這種粗粒度、與實例無關的評估框架，傾向給出過於樂觀的分數**——論文的說法是它做的是「單一的全域判斷、用通用準則」，因此常漏掉細微錯誤、診斷價值有限。所以「PPTEval 是最常被引用的」仍然成立，但**「最常被引用」不等於「夠嚴格」**。

它跑出來的產品排名也值得記：NotebookLM 62.5、Manus 1.6 的 57.8、Tiangong 54.7、Zhipu 53.6，**開源的 PPTAgent v2 只有 50.2**，之後是 Gamma 49.2、Doubao 48.0、Qwen 35.9。以上多數測於 2026-01；另有一筆 2026-07 測的華為雲 hwc-mmi-aippt 以 70.8 居首。

作者對開源落後的解讀是：不只因為底層模型，更因為閉源產品有專屬的端到端管線，包括簡報專用的長上下文規劃、接地機制，以及更成熟的排版與渲染引擎。

另外 [DECKBench](https://arxiv.org/html/2602.13318)（KDD '26）補上另一塊：學術論文轉投影片的**多輪編輯**能力，這是先前 benchmark 都沒系統性測過的。

### SeaSlides：也許不該讓模型寫自由格式的 HTML

前面的敘事是「從模板走向可執行產物（HTML／SVG）」。2026 年 8 月的 [SeaSlides](https://arxiv.org/html/2608.03298v1) 提出反方意見。

它的論點是：模板保住視覺規律但限制適應性，而**自由格式的 HTML 或 SVG 給了模型彈性，代價是把大量低階渲染決策也丟給模型**——長技術簡報因此變得脆弱，尤其當投影片裡有公式、程式碼或資料圖表時。

解法是加一層**語意抽象層**：模型不寫座標、行內樣式或原始 SVG 幾何，而是透過可重用元件與能力模組寫「結構化的投影片內容」，**由模板擁有排版、樣式與渲染**。公式、程式碼、圖表各自路由到專用渲染器，並用三段回饋分別攔截建置錯誤、專案約束違反與視覺缺陷。它同時做了 HTML 與 Typst 兩個後端，證明這條界線與語言無關。

這不推翻「要有視覺回饋」的結論，SeaSlides 自己也有視覺缺陷回饋階段。但它挑戰了「讓模型直接產出可執行的視覺程式碼」這個方向。**兩種主張的分歧點很清楚：模型該負責多少視覺實作。**

## 整體架構

```
 brief/interview      outline 審核         結構化中間表示             deterministic build
┌──────────────┐   ┌──────────────┐   ┌─────────────────────┐   ┌──────────────────┐
│ 受眾/目的/長度 │ → │ outline.md   │ → │ Marp/Slidev md       │ → │ renderer          │
│ key message   │   │ (人類審核點)  │   │ PptxGenJS script     │   │ (md→slides /      │
└──────────────┘   └──────────────┘   │ JSON slide map       │   │  script→.pptx)    │
                                      └─────────────────────┘   └────────┬─────────┘
                                                                          ↓ render 成圖
                                      ┌─────────────────────────────────────────────┐
                                      │ 視覺 QA 迴圈（fresh-eyes subagent / VLM）      │
                                      │ + 程式化檢查：overflow px、字級下限、bullet 上限、 │
                                      │   WCAG 對比、placeholder 殘留                  │
                                      │ 找問題 → 修 → 只重驗受影響頁 → 直到一輪全過       │
                                      └─────────────────────────────────────────────┘
```

反模式清單（每一條都有人踩過）：一次 prompt 直出整份 deck、生成 agent 自己驗收自己、只做 code review 不做 render 後檢查、標題下 accent line、全 deck 同版型、預設藍配色、宣告完成前沒跑過 fix-and-verify cycle。

## 整體來說

三條路線的取捨很清楚。**要可編輯交付、要套企業模板**，走 PptxGenJS 直構（或 Manus 模板匯入）；**工程師 talk、可拋棄式 deck、想 git diff**，走 Marp/Slidev 加 agent skill；**批量個人化、不想自架**，走 Gamma API。

而不管選哪條，品質的分水嶺都在同一處：有沒有把「render 成圖、獨立視覺驗收、修正迴圈」做進流程。

未解的部分也誠實列一下：VLM 視覺 QA 仍會漏細節，多數方案設 max 3 輪修正而非保證收斂；PPTX 跨環境的字體替換還是坑；評估標準尚未統一，PPTEval 最常被引用，但 PresentBench 已指出它給分過於樂觀，而更嚴格的評分表式評測才剛開始鋪開。

## 參考資料

- [Anthropic skills repo — pptx SKILL.md](https://github.com/anthropics/skills)
- [Anthropic Engineering — Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Docs — Agent Skills quickstart（pptx via API）](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)
- [PPTAgent: Generating and Evaluating Presentations Beyond Text-to-Slides（arXiv 2501.03936）](https://arxiv.org/abs/2501.03936)｜[EMNLP 2025 正式版](https://aclanthology.org/2025.emnlp-main.728/)
- [DeepPresenter: Environment-Grounded Reflection for Agentic Presentation Generation（arXiv 2602.22839）](https://arxiv.org/abs/2602.22839)｜[ACL 2026 Findings](https://aclanthology.org/2026.findings-acl.1578/)
- [PreGenie: An Agentic Framework for High-quality Visual Presentation Generation（arXiv 2505.21660）](https://arxiv.org/abs/2505.21660)
- [PresentBench: A Fine-Grained Rubric-Based Benchmark for Slide Generation（arXiv 2603.07244）](https://arxiv.org/html/2603.07244v1)
- [SeaSlides: Semantic Abstraction Layer for Agentic Slide Generation（arXiv 2608.03298）](https://arxiv.org/html/2608.03298v1)
- [DECKBench: Benchmarking Multi-Agent Frameworks for Academic Slide Generation and Editing（arXiv 2602.13318）](https://arxiv.org/html/2602.13318)
- [Marp — Markdown Presentation Ecosystem](https://marp.app/)
- [Slidev](https://sli.dev/)
- [slidev-overflow-checker（GitHub）](https://github.com/mizuirorivi/slidev-overflow-checker)
- [Gamma Developer Docs](https://developers.gamma.app/docs/getting-started)
- [Manus Slides Documentation](https://manus.im/docs/features/slides)
- [MARP + LLMs: The Engineering Case for Presentations as Text（Matias Sulik）](https://medium.com/@matias.sulik/marp-llms-the-engineering-case-for-presentations-as-text-f806da6e6eea)
- [How I Use Claude Code + Marp to Think Through Presentations（freeCodeCamp）](https://www.freecodecamp.org/news/how-to-use-claude-code-and-marp-to-think-through-presentations/)
- [Voice Chat to Slides: My New AI-Powered Workflow（S Anand）](https://www.s-anand.net/blog/voice-chat-to-slides-my-new-ai-powered-workflow/)
