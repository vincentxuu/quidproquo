---
title: "把 LLM Agent 的 skills / tools / code interpreter 真正組裝起來：一份論文導讀地圖"
date: 2026-05-24
category: ai
type: deep-dive
tags: [llm, agents, tool-use, skills, code-interpreter, function-calling, paper-review]
lang: zh-TW
tldr: "LLM agent 的難點不是把 function calling、skill、code interpreter、文件工具各自做出來，而是把它們組成一個會選工具、會寫程式、會拆任務、會驗證結果、又不會被 prompt injection 打穿的系統。這篇把代表論文整理成六個工程決策：function calling 可靠度、tool/skill selection、code-as-action、多步 planning、skill 系統、安全與文件生成。"
description: "LLM agent skills / tools / code interpreter 的深度導讀：從 ReAct、Toolformer、CodeAct、ToolRet 到 SoK Agentic Skills，整理成一份可用來設計 agent 系統的論文地圖與工程決策表。"
draft: false
---

很多團隊把 LLM agent 做到一個程度後會卡住：function calling 做了、skills 系統做了、code interpreter 有了、檔案解析器也接上了，但真的丟一個任務下去——「幫我做一份產品介紹簡報」「丟一份含表格的 PDF 給我摘要 + Excel」——順暢度就是追不上 Claude 或 ChatGPT。

這通常不是「底層能力不存在」，而是「組裝層沒設計」。底層 4 種 tool type、code sandbox、skill loader 都在，但 system prompt 怎麼寫、skill description 怎麼下、預設載入哪些 tool、多 tool 串接時誰負責 planning、失敗後誰決定 retry，這些配置層如果沒有設計，agent 就會像一盒零件，而不是一台機器。

這篇不是要列一堆論文名，而是把論文整理成六個工程問題。每個問題都對應一個實作決策：你該不該微調 function calling？tool selection 要不要做 retrieval？code interpreter 要不要只是另一個 function tool？skill 應該是 markdown 說明，還是程序化能力包？文件生成要做成黑盒一鍵產出，還是讓使用者能介入中間步驟？

## 先定義問題：工具不是越多越好

LLM agent 的常見設計會長成這樣：

```
User task
  ↓
System prompt + tool descriptions
  ↓
LLM decides next action
  ↓
function call / code execution / skill script / file parser
  ↓
observation
  ↓
repeat until done
```

這個 loop 表面上很簡單，實際上每一層都有坑。

Function calling 的坑是「模型知道要用工具，但填錯 schema、幻想不存在的參數、或在模糊指令下亂動手」。Tool selection 的坑是「工具越多，LLM 越容易選錯；如果先做 retrieval，又會多一層會出錯的 retrieval」。Code interpreter 的坑是「讓模型寫 code 很強，但 sandbox、權限、執行時間、檔案 I/O 都變成 production 問題」。Skill 系統的坑是「Markdown 指令很容易擴充，也很容易變成 prompt injection 攻擊面」。

所以真正的問題不是「我要不要做 tools」，而是：

| 工程決策 | 問題 |
|---|---|
| Function calling | 怎麼讓模型穩定呼叫正確 tool、填對參數？ |
| Tool / Skill selection | 工具很多時，要靠 description、retrieval，還是二階段選擇？ |
| Code interpreter | 什麼任務該讓模型寫 code，而不是一次次 JSON function call？ |
| Planning | 7-10 步以上的長任務，要 ReAct 邊走邊想，還是先 plan 再 execute？ |
| Skill system | skill 是單一 tool、說明文件，還是可重用的程序化能力包？ |
| Safety | skill / code execution 開放後，權限與 prompt injection 怎麼處理？ |

下面六個子問題，就是這張決策表背後的論文脈絡。

## 子問題 1：Function calling 可靠度

Function calling 是最容易被低估的一層。很多團隊接上 OpenAI / Anthropic / Gemini 的 tool use 之後，以為問題解完了；實際上，tool call 成功率、參數正確率、模糊指令處理、多步串接穩定性，全部都要另外設計。

最值得先讀的是 **ToolACE**。它不是只說「多蒐集 function calling data」，而是把訓練資料品質拆成一級變數：工具覆蓋、參數難度、負例、對話上下文、錯誤修復。若要建立內部 dogfooding eval，這篇的方法可以直接搬過來：把錯誤分成 schema 錯、參數錯、漏呼叫、誤呼叫、呼叫順序錯，而不是只看最後答案對不對。

**Reducing Tool Hallucination via Reliability Alignment** 針對另一個更具體的問題：模型會呼叫不存在的 tool，或填不存在的參數。這在產品裡很痛，因為錯誤看起來像「模型笨」，但本質是 tool boundary 沒對齊。這類論文的價值不是叫你一定要 fine-tune，而是提醒你 eval set 不能只放 happy path；一定要放「不該呼叫工具」和「工具不存在」的 case。

**CriticTool** 則適合拿來建立錯誤分類語言。當你開始看 production logs，會發現「tool call fail」太粗：缺參數、錯型別、錯 tool、資料不足但硬 call、應該追問卻沒追問，修法完全不同。沒有 taxonomy，後面就很難做針對性改善。

閱讀順序建議：

1. **ToolACE**：先建立 function calling eval 的資料品質觀念。
2. **CriticTool**：建立錯誤分類。
3. **Reliability Alignment**：看 hallucinated tool / argument 怎麼處理。
4. **Learning to Ask**：處理模糊指令，不要讓 agent 在「追問」和「直接做」之間亂跳。
5. **Exploring Multi-Step and Constrained Function Calling under Long Context**：進入多步工具串接問題。

工程上，這一層的 takeaway 很直接：如果 agent 產品還沒把 tool call failure 分類記進 log，先不要急著加更多工具。工具越多，只會把錯誤空間放大。

## 子問題 2：Tool / Skill selection

工具少時，把所有 tool name + description 塞進 system prompt 讓 LLM 自己選，通常夠用。工具多到幾十、幾百、幾千時，問題就變成：要不要先用 embedding retrieval 過濾候選工具？

這裡最有意思的是 **ToolRet**。直覺上，retrieval 應該會贏 description list：先找相關 tool，再讓 LLM 選，不是比較省 token 嗎？但 ToolRet 的 benchmark 給了一個比較克制的結論：retrieval 模型對 tool description 並不如想像中敏感，很多時候 retrieval pipeline 沒有顯著優於直接把 description 給模型。

這對 Anthropic Skills 類系統很重要。Anthropic Skills 的路線偏 description-based：每個 skill 的 frontmatter `description` 是第一層觸發依據，真的需要時再讀 `SKILL.md` body 和資料夾裡的 scripts/templates。這個設計的哲學是「先把 description 寫好」，而不是一開始就上複雜 retrieval。

但這不代表 retrieval 沒用。**Online-Optimized RAG for Tool Use**、**Improving Tool Retrieval by LLM Query Generation**、**MassTool** 代表另一條路：當工具數真的大到模型看不完，retrieval 還是需要，只是它不是免費午餐。你要處理 query 改寫、工具描述品質、候選召回率、錯選後的 fallback。

我會把決策切成三段：

| 規模 | 建議 |
|---|---|
| 10 個以下 | 直接 description list，重點是寫清楚何時用、何時不用 |
| 10-100 個 | 分 namespace / category，必要時做二階段 selection |
| 100+ 個 | 才認真考慮 retrieval，但要有 eval，不要只因為工具多就加 embedding |

真正該投資的第一步，通常不是向量庫，而是 tool description 寫作規格：一句話說用途、一句話說禁用情境、列出必要輸入、列出常見誤用。這比先做 retrieval 更便宜，也更容易觀察效果。

## 子問題 3：Code Interpreter / Code-as-Action

這個子問題的核心論文是 **Executable Code Actions Elicit Better LLM Agents（CodeAct）**。

CodeAct 的主張很直接：別讓 agent 只能透過 JSON function call 表達動作，而是讓它寫一段可執行的 Python code。Python 是圖靈完備的，可以原生表達迴圈、條件、變數、複合運算、錯誤處理；JSON tool call 只能表達「呼叫一次某 function」。

這件事在簡單任務上差異不大。查天氣、查資料庫、送 Slack，一次 function call 就夠。但只要任務需要中間狀態，差異就會放大：

```python
rows = read_csv("sales.csv")
cleaned = normalize_columns(rows)
by_region = groupby(cleaned, "region")
chart = plot(by_region)
write_file("summary.png", chart)
```

如果用 JSON function call，模型可能要呼叫五六次 tool，每次還要把中間狀態用文字塞回 context。用 code-as-action，狀態留在 runtime 裡，LLM 寫一段程序就能完成。這也是 code interpreter 類能力真正強的地方：它不是「多一個 Python tool」，而是讓模型多了一種表達 action 的語言。

這也解釋了 Anthropic Skills 為什麼會長成資料夾 + Markdown + scripts/templates 的樣子。Skill 不是一個固定 schema 的 function，而是一個程序化能力包。LLM 讀了 `SKILL.md` 之後，可以用 bash、file tools、Python library、範例 script 組合出解法，而不是被綁在某個單一 function signature 上。

但 code-as-action 的代價也很清楚：只要讓 LLM 寫任意 code，sandbox 和 runtime enforcement 就不是可選配件。**Customizable Runtime Enforcement for Safe LLM Agents** 這類工作提醒的是，production code interpreter 至少要處理：

- 檔案讀寫範圍
- network access
- CPU / memory / wall-clock timeout
- secret 隔離
- package install policy
- 執行結果大小限制
- 可重現性與 audit log

所以這一層的決策不是「要不要 code interpreter」，而是「哪些任務值得進 code interpreter」。我的判準會是：資料轉換、檔案生成、表格處理、批次運算、圖表產生，適合 code-as-action；單次查詢、外部 API 呼叫、權限敏感操作，仍適合 function call。

## 子問題 4：多步 Tool 串接 / Planning

從「查產品 → 查價格 → 生成報價單 → 寫 email → 等人確認 → 送出」這類任務開始，agent 不能只靠單步 tool selection。它需要某種 planning。

**ReAct** 是這條線的 baseline：reasoning trace 和 action 交錯產生。它的優點是靈活，缺點是每一步都可能累積誤差。任務短時很好用；任務長到 7-10 步以上，就容易出現「前面一個小錯，後面整串走歪」。

**Toolformer** 從另一個角度奠基：讓模型學會何時插入 tool call。這篇今天看起來已經不新，但它定義了一個很重要的方向：工具使用不是外掛 if/else，而是模型行為的一部分。

**Reflexion** 則處理失敗後的自我修正。對工程系統來說，它對應 retry / fallback / verbal memory：agent 失敗一次後，不只是重跑，而是把失敗原因轉成下一輪策略。

近期比較值得看的，是 planner-centric 和 hierarchical planning 類工作。**A Planner-Centric Framework for Complex Tool-Augmented LLM** 直接質疑純 ReAct step-by-step 的可靠度，主張先建立 plan，再由 executor 執行。**GoalAct** 則把 global planning 和 hierarchical execution 結合起來。

這裡沒有銀彈，只有取捨：

| 路線 | 優點 | 缺點 |
|---|---|---|
| ReAct step-by-step | 快、簡單、彈性高 | 長任務容易累積錯誤 |
| Planner-first | 任務全局比較穩 | 延遲高、plan 可能過早固定 |
| Hierarchical planning | 適合長任務與子任務委派 | 系統複雜度最高 |

如果是一般聊天工具，ReAct 夠用。如果是企業流程、文件產出、批次任務、需要重試與審核的場景，planner-first 幾乎遲早要引入。問題只是你要在一開始就把 planner 做成一級元件，還是等 ReAct loop 的錯誤 log 累積到看不下去再補。

## 子問題 5：Skill 系統不是 tool registry

Anthropic Skills 這個範式短時間內累積了一批 systematization 工作，原因很簡單：它把「工具」往上抽了一層。

單一 tool 是一個可呼叫能力，例如 `send_email`、`read_pdf`、`query_database`。Skill 則比較像「如何完成一類任務」的程序化知識包：有 description、instructions、scripts、templates、examples、resources。它不只告訴模型可以呼叫什麼，也告訴模型一個 workflow 應該怎麼走。

**SoK: Agentic Skills — Beyond Tool Use in LLM Agents** 是這題最值得先讀的一篇。它把 skill 定義成可重用、程序化、跨工具協調的能力包，跟單一 tool 在抽象層級上有本質區別。這點很重要，因為很多系統把 skill 做成「另一種 function」，結果就失去 skill 的價值。

**A Comprehensive Survey on Agent Skills** 則適合當 checklist：skill 應該包含什麼 metadata、如何描述能力、如何管理 scripts/resources、如何做版本管理。**Agent Skills for LLMs** 進一步處理 verification：怎麼確認一個 skill 真的能做到 description 宣稱的事？

工程上，我會把 skill 系統拆成四層：

1. **Discovery layer**：name + description，決定何時觸發。
2. **Instruction layer**：`SKILL.md` body，描述 workflow。
3. **Execution layer**：scripts/templates/resources，讓模型不要從零發明做法。
4. **Verification layer**：測試、範例輸入輸出、可跑的 smoke check。

如果只做到前兩層，它比較像 prompt library；做到第三層，才開始有 agent skill 的味道；做到第四層，才有機會進 production。

## 安全提醒：skill 越像能力包，攻擊面越大

skill 系統的開放性同時打開了攻擊面。

**Agent Skills Enable a New Class of Realistic and Trivially Simple Prompt Injection** 和 **SkillJect** 都在講同一件事：skill 裡的文字會被模型當成指令。只要 skill 可以由第三方提交、下載、同步，攻擊者就能把惡意指令藏在 skill instructions、範例、甚至 template 裡。

這跟傳統 prompt injection 不太一樣。傳統 injection 常常藏在網頁或文件內容中，模型可能只在某次任務讀到；skill injection 則更接近 supply-chain attack。一旦 skill 被安裝，它會在未來多次任務中被觸發。

所以 end-user skill marketplace 如果要做，day 0 就要想：

- skill 來源驗證
- 權限宣告與最小權限
- sandbox 檔案 / network / secret 邊界
- 安裝前靜態檢查
- 執行時 audit log
- 高風險 tool call 的 human approval

不要等 marketplace 做起來才補安全模型。那時候你不是在修 bug，是在補一個已經散出去的執行環境。

## 子問題 6：文件與簡報生成

「丟一份 PDF 給我做成簡報 + Excel」是 LLM agent 在企業應用裡最常見的需求之一，但它比看起來難很多。難點不是單一模型能不能寫文案，而是它要同時處理文件理解、表格抽取、版面規劃、圖表生成、檔案格式、使用者可編輯性。

**AutoPresent** 的重點不是 8B 模型接近 GPT-4o，而是「程式化工具庫」這個設計。它讓模型不是直接吐 slide，而是透過一組可組合的函式生成結構化視覺。這跟 `pptx` skill 的精神很接近：給模型一套 Python library / template / helper scripts，讓它用 code 組裝檔案。

**Generating and Evaluating Presentations Beyond Text-to-Slides** 補上評測角度。簡報不能只看文字對不對，還要看版面、視覺層級、資訊架構、圖表是否合理。這對 dogfooding 很重要，因為 LLM 產出一份「看起來有內容」但版面很爛的簡報，其實不能算成功。

**Talk-to-Your-Slides** 是另一條路：不是產生新檔，而是直接操作活的 PowerPoint session。這對「使用者帶著一份 80% 的簡報來請 agent 修改」很合理。**SlideTailor** 則強調逐步、可編輯、人類行為啟發的流程，提醒我們不要把文件 agent 做成一鍵黑盒。

表格與 Excel 則可以從 **SpreadsheetLLM** 和 **LLM for Table Processing: A Survey** 看起。PDF 表格到 Excel 不是單純 OCR；它牽涉表格結構理解、merged cell、header hierarchy、單位、註腳、跨頁表格。這也是為什麼 code interpreter + parser + skill library 會比單一 function call 更自然。

這題的產品取捨可以這樣看：

| 任務 | 比較合理的路線 |
|---|---|
| 從零產生簡報 | template + programmatic slide library + code-as-action |
| 修改既有簡報 | 操作活 session 或讀寫原檔，保留既有 style |
| PDF 表格轉 Excel | parser tool + code interpreter + 人工可檢查的中間結果 |
| 企業文件產出 | skill template + brand rules + render-and-verify loop |

## 整體決策表

把上面六題壓成一張工程決策表：

| 問題 | 推薦起點 | 什麼時候升級 |
|---|---|---|
| Function calling 不穩 | 建 tool-call error taxonomy + focused eval | 錯誤集中在模型行為時，再考慮 alignment / fine-tune |
| Tool 太多 | 先寫好 description 和 namespace | 100+ tools 且 eval 顯示選擇錯誤，再做 retrieval |
| 多步資料處理 | 用 code interpreter / code-as-action | 有安全、timeout、檔案隔離需求時補 runtime enforcement |
| 長任務掉鏈 | ReAct + retry log | 7-10 步以上開始引入 planner-first / hierarchical planning |
| Skill 系統 | description + SKILL.md + scripts/templates | 要給第三方安裝時，加入 verification + permission model |
| 文件生成 | programmatic library + render verify | 需要編輯既有檔案時，考慮 live session control |

我自己的結論是：CodeAct 是現代 agent 設計的理論底，Anthropic Skills 則是這套思路的產品化形態。真正有用的 agent，不是把所有功能都包成 JSON function，而是知道什麼時候用 function call、什麼時候寫 code、什麼時候讀 skill、什麼時候停下來問人。

如果正在做 agent 系統重構，這篇的六個子問題可以當路線圖：先把 function calling eval 做起來，再整理 tool/skill description，接著決定哪些任務該進 code interpreter，最後才談 skill marketplace 或文件生成自動化。順序反過來，很容易變成 demo 很漂亮，production 很難用。

## 更新紀錄

- 2026-05-24：重整為 deep dive 結構，補上問題定義、工程決策表、閱讀順序與各路線取捨。

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
