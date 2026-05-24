---
title: "把 LLM Agent 的 skills / tools / code interpreter 真正組裝起來：一份論文導讀地圖"
date: 2026-05-24
category: ai
type: deep-dive
tags: [llm, agents, tool-use, skills, code-interpreter, function-calling, paper-review]
lang: zh-TW
tldr: "現在做 LLM agent 產品，瓶頸大多不在『底層工具沒做』，而是『組裝層沒設計』。從 ReAct / Toolformer 到 CodeAct，再到 Anthropic Skills 範式，這篇把六個關鍵議題的代表論文整理成一張地圖：function calling 可靠度、tool selection、code-as-action、多步串接、skill 工程、文件自動生成。"
description: "LLM agent skills / tools / code interpreter 的研究地圖，涵蓋 CodeAct、ToolRet、SoK Agentic Skills 等代表論文。"
draft: false
---

很多團隊把 LLM agent 做到一個程度後會卡住：function calling、skills 系統、code interpreter、檔案解析器都做完了，但實際丟個任務下去——「幫我做一份產品介紹簡報」「丟一份含表格的 PDF 給我摘要 + Excel」——順暢度就是追不上 Claude 或 ChatGPT。

這通常不是「技術沒做」，是「組裝沒設計」。底層 4 種 tool type、code sandbox、skill loader 都在，但 system prompt 怎麼寫、skill description 怎麼下、預設要載入哪幾個 tool、多 tool 串接時誰負責 planning，這些「配置層」沒人認真設計過。

這篇把這個議題切成六個子問題，每題挑出 3-7 篇代表論文，當成接下來做設計決策的學術依據。不寫任何特定產品的內部細節，只談 paradigm 與決策依據。

## 子問題 1：Function calling 可靠度

目標：把 tool call 成功率拉到 95% 以上、降低 hallucinated arguments、多 tool 串接時不掉鏈。

- **ToolACE** 把 function calling 訓練資料的「品質」當成一級變數，做了很完整的拆解——若要建立內部 dogfooding 評測集，這篇的方法可以照搬。
- **Reducing Tool Hallucination via Reliability Alignment** 直接針對「呼叫了不存在的 tool」「填了不存在的參數」做 alignment，是降低錯呼叫率的代表作。
- **CriticTool** 把 function calling 的錯誤分類整理得很完整：缺參數、錯 schema、誤觸發、參數型別錯⋯⋯適合拿來建立內部錯誤分類體系，做 log 分析時有共同語言。
- **Learning to Ask: When LLM Agents Meet Unclear Instruction** 對應到一個很常見的反 pattern：使用者下了模糊指令，agent 不是直接動手、不是合理追問，而是陷入「對話迴圈」一直繞圈圈。這篇給出何時該追問、何時該動手的判準。
- **Exploring Multi-Step and Constrained Function Calling under Long Context** 處理多 tool 串接在 long context 下的掉鏈問題。

## 子問題 2：Tool / Skill selection——從一堆候選裡選對的

現在的 agent 設計有兩派：description-based（把所有 tool 的 name + description 塞進 system prompt 讓 LLM 自己選）與 embedding retrieval（先用向量檢索找相關 tool 再給 LLM）。

Anthropic Skills 走的是前者。**ToolRet** 這篇 benchmark 給了一個有意思的結論：retrieval 模型對 tool description 並不特別敏感，許多時候 retrieval pipeline 沒有顯著優於直接用 description 列表的做法。換句話說，與其去投資 retrieval pipeline，不如花同樣的力氣把每個 tool 的 description 寫好。

- **Tool Learning with LLMs: A Survey** 把兩派路線整理得很清楚，適合先看完拿到全景。
- **ToolRet** 是那個關鍵 benchmark，支撐「不重做 retrieval」這個決策有實證依據。
- **Online-Optimized RAG for Tool Use** 是另一條路——若 tool 數量真的多到幾千上萬時還是得回到 retrieval，這篇是近期的方法。
- **Improving Tool Retrieval by LLM Query Generation** 用 LLM 動態改寫 retrieval query，是「description 寫法影響 selection」的另一個切角。
- **MassTool** 是較新的 multi-task retrieval 框架，可以當作 Claude-style 之外的對照組看。

## 子問題 3：Code Interpreter / Code-as-Action

這個子問題的核心論文是 **Executable Code Actions Elicit Better LLM Agents（CodeAct）**。

CodeAct 的主張很直接：別讓 agent 透過 JSON function call 表達動作，而是讓它寫一段可執行的 Python code。Python 是圖靈完備的，可以原生表達迴圈、條件、變數、複合運算；JSON tool call 只能表達「呼叫一次某 function」。在多 tool 串接、需要中間狀態傳遞、需要錯誤處理時，code-as-action 的表達力顯著更強，實證上多步任務成功率也明顯較高。

這也解釋了為什麼 Anthropic 的 skills 範式長那樣：每個 skill 不是一個 JSON-schema-定義的 function，而是一份內含 bash / file 操作工具的「程序化能力包」。LLM 透過寫 code 去調用 skill 裡的 script，而不是被綁在固定的 function 簽名上。

- **CodeAct** 是必讀。
- **A Survey on Code-Enhanced Reasoning and Reasoning-Driven Code Intelligence** 把 CodeAct 系工作整理成 family，方便快速看完整脈絡。
- **Customizable Runtime Enforcement for Safe LLM Agents** 是配套：code interpreter 一旦讓 LLM 寫任意 code，sandbox 與安全層就變成 production 級的必要設計。

如果你的系統已經有 code interpreter，把「檔案產生」「資料處理」這類 tool 改成讓 LLM 直接寫 code 呼叫——而不是再外包一層 JSON function——往往可以一口氣解決一大堆「該觸發沒觸發」「參數錯填」的疑難雜症。

## 子問題 4：多步驟 Tool 串接 / Planning

從「查產品 → 查價 → 生報價單」這類多步任務開始，agent 設計必須引入某種形式的 planning。

- **ReAct** 是祖師爺，是所有後續工作的 baseline。把 reasoning trace 跟 action 交錯產生，是當代 agent 的基本範式。
- **Toolformer** 是同期的奠基論文，讓模型「自學」何時插入 tool call。
- **Reflexion** 把「失敗後做 verbal RL」的概念引入 agent，對應到「重試 / fallback」這類異常處理設計的理論基礎。
- **ToolLLM** 大規模 tool ecosystem 工程化的代表作，16,000+ API 的訓練資料與 pipeline 設計很有參考價值。
- **The Evolution of Tool Use in LLM Agents: From Single-Tool Call to Trajectories**（2026/03）把「長 trajectory tool use」的問題整理得最系統，是入坑這題的最新總覽。
- **A Planner-Centric Framework for Complex Tool-Augmented LLM** 直接質疑 ReAct 的 step-by-step 範式，提出「先 plan 再 execute」的框架，對於多步任務的 reliability 有很多啟發。
- **GoalAct** 引入 global planning + hierarchical execution，是工程化框架的代表。

近期有個越來越清楚的趨勢：純 ReAct 式的 step-by-step 在簡單任務上很俐落，但在 7-10 步以上的長任務會累積誤差。Planner-first 或 hierarchical planning 正在把成功率往上拉，但代價是延遲與系統複雜度。

## 子問題 5：System Prompt / Skill 系統的工程文獻

Anthropic Skills 這個範式短時間內就累積了一批 systematization 工作，值得整批讀完。

- **SoK: Agentic Skills — Beyond Tool Use in LLM Agents**（2026/02）是最值得讀的一篇。直接以 Anthropic Skills 為對象做 systematization，提出 skill 是「可重用、程序化、跨工具協調」的能力包，與單一 tool 在抽象層級上有本質區別。
- **A Comprehensive Survey on Agent Skills: Taxonomy, Techniques** 把 skill 該包含什麼（description、scripts、resources、metadata）整理成 taxonomy。如果在做「skill 重構」這類專案，這篇可以直接當作設計 checklist。
- **Agent Skills for LLMs: Architecture, Acquisition** 處理一個很關鍵的問題：skill verification——怎麼確認一個 skill 真的做了它 description 所宣稱的事？這對 skill 生態系的可信度是底層問題。
- **AgentSkillOS** 處理當 skill 數量爆炸（幾百個以上）時怎麼選擇、編排、版本管理。
- **Many-Tier Instruction Hierarchy in LLM Agents** 用 Codex CLI 的 system prompt 當案例做分析，對於想參考現有 frontier agent 的 system prompt 結構來重寫自家系統的人很有幫助。

### 安全提醒不要跳過

skill 系統的開放性同時打開了攻擊面：

- **Agent Skills Enable a New Class of Realistic and Trivially Simple prompt injection** 指出 skill 內幾乎每一行文字都會被當成指令執行，prompt injection 變得非常容易。
- **SkillJect: Skill-Based Prompt Injection** 進一步系統化這個攻擊面。

如果你的系統計畫讓 end user 自建 skill，sandbox、權限模型、skill 來源驗證在 day 0 就要設計，不是事後補。

## 子問題 6：簡報 / 文件自動生成（PPTX / DOCX / XLSX）

「丟一份 PDF 給我做成簡報 + Excel」是 LLM agent 在企業應用最常見的具體需求之一，但出乎意料地難做穩定。

- **AutoPresent** 訓練 8B 模型透過程式化工具庫產生簡報，接近 GPT-4o 水準。**重點不是模型大小，是「程式化工具庫」這個設計**——它正好對應 Anthropic 的 `pptx` skill 形態：一組可組合的 Python 函式 + LLM 寫 code 去組裝。
- **Generating and Evaluating Presentations Beyond Text-to-Slides** 給了簡報生成的評測方法（不只看文字，要看版面、視覺、結構），做 dogfooding 評測時可以參考。
- **Talk-to-Your-Slides** 走另一條路：透過 COM 直接編輯活躍的 PowerPoint session，agent 不產生新檔案而是改既有檔案。對「使用者帶著一份 80% 的簡報來請 agent 改」這種情境是另一種解。
- **SlideTailor** 強調「逐步、可編輯、人類行為啟發」的 agentic 框架——這呼應了一個更廣的 UX 心法：不要把 agent 做成一鍵生成的黑盒，使用者要看得到中間步驟、能介入、能控制。
- **SpreadsheetLLM** 給了試算表編碼的方法，是「PDF 表格 → Excel」這類任務的底層理解基礎。
- **LLM for Table Processing: A Survey** 是表格處理任務的全景圖。

簡報生成路線基本上分兩派：產生檔案（AutoPresent / SlideTailor）vs 操作活 session（Talk-to-Your-Slides）。多數產品走前者，但後者在「協作既有檔案」的情境會是另一條合理路線。

## 整體來說

把上面六個子問題壓縮成五條 takeaway：

1. **CodeAct 是現代 agent 設計的理論底**。Anthropic Skills 的 skills + bash + file tools 結構，本質上就是 CodeAct 範式的產品化實作。
2. **「不重做 embedding retrieval」是有實證依據的決策**。ToolRet 顯示 retrieval 對 tool description 並不敏感——投資在「寫好 description + 設計好 system prompt」比投資 retrieval pipeline 划算。
3. **skill systematization 已經成熟**。SoK Agentic Skills、Skills Survey 兩篇值得整篇讀完，會直接影響 skill 系統的抽象設計。
4. **簡報 / 文件生成沒有銀彈**。產生檔案 vs 操作 session 是兩條路；無論走哪條，「程式化工具庫」+ code-as-action 都是當代主流範式。
5. **安全是 day-0 工作**。skill 系統一旦開放給第三方，prompt injection 攻擊面立刻成倍擴大，事後補很難補乾淨。

如果在做類似的 agent 系統重構，這六題基本上是一張地圖：每個子問題對應到一組設計決策，每個決策都有可引用的 baseline 與較新的反論。

## 參考資料

### Function calling 可靠度

- [ToolACE: Winning the Points of LLM Function Calling](https://arxiv.org/abs/2409.00920)
- [Reducing Tool Hallucination via Reliability Alignment](https://arxiv.org/abs/2412.04141)
- [CriticTool: Self-Critique Capabilities of Large Language Models](https://arxiv.org/abs/2506.13977)
- [Learning to Ask: When LLM Agents Meet Unclear Instruction](https://arxiv.org/abs/2409.00557)
- [Exploring Multi-Step and Constrained Function Calling under Long Context](https://arxiv.org/abs/2501.10132)

### Tool / Skill selection

- [Tool Learning with Large Language Models: A Survey](https://arxiv.org/abs/2405.17935)
- [ToolRet: Benchmarking Tool Retrieval for Large Language Models](https://arxiv.org/abs/2503.01763)
- [Online-Optimized RAG for Tool Use and Function Calling](https://arxiv.org/abs/2509.20415)
- [Improving Tool Retrieval by Leveraging LLMs for Query Generation](https://arxiv.org/abs/2412.03573)
- [MassTool: Multi-Task Search-Based Tool Retrieval Framework](https://arxiv.org/abs/2507.00487)

### Code Interpreter / Code-as-Action

- [Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030)
- [A Survey on Code-Enhanced Reasoning and Reasoning-Driven Code Intelligence](https://arxiv.org/abs/2502.19411)
- [Customizable Runtime Enforcement for Safe and Reliable LLM Agents](https://arxiv.org/abs/2503.18666)

### 多步 Tool 串接 / Planning

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [ToolLLM: Facilitating Large Language Models to Master 16000+ Real-World APIs](https://arxiv.org/abs/2307.16789)
- [The Evolution of Tool Use in LLM Agents: From Single-Tool Call to Trajectories](https://arxiv.org/abs/2603.22862)
- [A Planner-Centric Framework for Complex Tool-Augmented LLM](https://arxiv.org/abs/2511.10037)
- [GoalAct: Global Planning and Hierarchical Execution](https://arxiv.org/abs/2504.16563)

### System Prompt / Skill 工程

- [SoK: Agentic Skills — Beyond Tool Use in LLM Agents](https://arxiv.org/abs/2602.20867)
- [A Comprehensive Survey on Agent Skills: Taxonomy, Techniques](https://arxiv.org/abs/2605.07358)
- [Agent Skills for Large Language Models: Architecture, Acquisition](https://arxiv.org/abs/2602.12430)
- [Organizing, Orchestrating, and Benchmarking Agent Skills (AgentSkillOS)](https://arxiv.org/abs/2603.02176)
- [Many-Tier Instruction Hierarchy in LLM Agents](https://arxiv.org/abs/2604.09443)
- [Agent Skills Enable a New Class of Realistic and Trivially Simple Prompt Injection](https://arxiv.org/abs/2510.26328)
- [SkillJect: Skill-Based Prompt Injection](https://arxiv.org/abs/2602.14211)

### 簡報 / 文件自動生成

- [AutoPresent: Designing Structured Visuals from Scratch](https://arxiv.org/abs/2501.00912)
- [Generating and Evaluating Presentations Beyond Text-to-Slides](https://arxiv.org/abs/2501.03936)
- [Talk-to-Your-Slides: Efficient Slide Editing Agent](https://arxiv.org/abs/2505.11604)
- [SlideTailor: Personalized Presentation Slide Generation](https://arxiv.org/abs/2512.20292)
- [SpreadsheetLLM: Encoding Spreadsheets for Large Language Models](https://arxiv.org/abs/2407.09025)
- [Large Language Model for Table Processing: A Survey](https://arxiv.org/abs/2402.05121)

### 站內相關文章

- [Claude 檔案處理的三層架構](/posts/ai/claude-file-handling-three-layers/)
- [System Prompts Leaks Archive](/posts/ai/system-prompts-leaks-archive/)
