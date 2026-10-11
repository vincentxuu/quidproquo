---
title: "CMU 11-768 導讀 L2：Tool Use 怎麼從 token 變成動作——schema、受限解碼、MCP 與平行呼叫"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, tool-use, function-calling, mcp]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 2
tldr: "Neubig 把 tool use 拆成五層：能力、機制、約束、介面、系統。工具呼叫本質上是模型吐出的 token，要靠 harness 解析、驗證、用 call ID 對回結果；受限解碼只保證格式不保證對；MCP 的真正價值是憑證中介；同一個模型換家 provider，工具呼叫錯誤率可以從約 15% 掉到 0.1% 以下。"
description: "導讀 CMU 11-768 AI Agents 第 2 講 Tool Use：工具的定義與使用情境、CodeAct 程式當元工具、chat template 與各家 tool-call 格式、JSON Schema 與 XGrammar 受限解碼、REST／OpenAPI 與 MCP 的憑證差異、平行工具呼叫、BFCL 與 provider 錯誤率評測。"
draft: false
glossary:
  - term: "受限解碼"
    aliases: ["constrained decoding", "grammar-constrained decoding"]
    definition: "生成每個 token 前，先用文法判斷哪些候選 token 合法，把不合法的 logit 設成負無限大，保證輸出一定能被解析。"
    context: "本篇用它說明 XGrammar 怎麼保證工具呼叫是合法 JSON，以及它保證不了什麼。"
  - term: "CodeAct"
    aliases: ["programmatic tool calling", "程式化工具呼叫"]
    definition: "讓 agent 用一段可執行的 Python 程式當作動作，而不是一次只呼叫一個 JSON 格式的工具。"
    context: "本篇第二節：程式是能組合其他工具的元工具，代價是更難約束、更需要沙箱。"
  - term: "call ID"
    aliases: ["tool_call_id"]
    definition: "每一次工具呼叫的唯一識別碼，工具結果訊息要帶同一個 ID，模型才知道哪個結果對應哪個呼叫。"
    context: "平行呼叫時結果會亂序回來，全靠 call ID 對回去。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 是 Carnegie Mellon 語言技術研究所（LTI）2026 秋季開的研究所課程，由 Daniel Fried 與 Graham Neubig 主授，從工具、context、記憶、規劃一路講到訓練、安全與互動。第 2 講（8 月 27 日，[投影片](https://www.cmu-agents.com/slides/lecture-02-tool-use.pdf)、[錄影](https://www.youtube.com/watch?v=jXChFB4JSyw)）由 Neubig 主講 Tool Use。他開場就下了定義：會呼叫工具，是 agent 跟語言模型之間最根本的差別。

這一講不是教你「怎麼在 API 裡加 `tools` 參數」。它把工具呼叫從上到下剖開：模型為什麼需要工具、工具呼叫在 token 層長什麼樣、harness 怎麼解析與派送、怎麼保證格式正確、REST 和 MCP 差在哪、多個呼叫怎麼平行、最後怎麼評測。這些內容正是[作業 A1（Harness）](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness)要你親手寫出來的部分。本篇照講課順序走，每節最後標出它在 A1 裡對應到哪裡。

## 課程影片來源

已核對 CMU 11-768 Fall 2026 第 2 講的公開錄影；影片由課程教師 Graham Neubig 的頻道發布，影片標題與說明對應本課程。

```youtube
url: https://www.youtube.com/watch?v=jXChFB4JSyw
title: CMU AI Agents 2026: 2. Tool Use for Language Model Agents
```

原始影片：[CMU AI Agents 2026: 2. Tool Use for Language Model Agents](https://www.youtube.com/watch?v=jXChFB4JSyw)

官方來源：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：通讀全程字幕（約 57 分鐘），逐項對照文章轉述的 Neubig 說法（兩類工具用途、RAG 沒死、CodeAct 與程式的代價、各家 tool-call 格式與特殊 token 問答、call ID 與 Anthropic 報錯、XGrammar 與 token 用完的例外、MCP 憑證中介、平行呼叫與 RL、BFCL、OpenRouter provider 錯誤率與 FP8／FP4），皆有依據；投影片專有的數字與圖表細節（如 6.4 秒範例、15.1% 等）字幕沒講，仍屬投影片來源。

## 工具是什麼，什麼時候值得叫

投影片的定義改寫自 Neubig 與 Fried、Zhiruo Wang 等人合寫的綜述 [What Are Tools Anyway?](https://arxiv.org/abs/2403.15452)：**工具是語言模型用來呼叫外部電腦程式的介面**。論文原文的定義更精確一些：工具是一個通往外部程式的函式介面，程式在語言模型之外執行，語言模型負責產生函式呼叫與輸入參數。投影片在底下補了一句很重要的分工：模型負責提議，外部軟體決定要不要執行、怎麼執行。

工具的好處分兩類：

- **延伸（extend）**：做模型本質上做不到的事。模型的參數在訓練截止那天就凍結了，它不可能知道今天幾點，只能靠外部呼叫。
- **輔助（facilitate）**：模型做得到，但交給外部程式更可靠、更快。兩個七位數相乘，推理模型可以慢慢算，計算機一瞬間就好。

投影片把使用情境整理成四種：要新資訊（搜尋）、要精確計算（計算機或 Python）、要私有狀態（帳號 API）、要改變外部環境（瀏覽器或 API）。底下一行是整節的判準：**工具只有在好處大於延遲、成本、失敗與風險時才該叫。**

## 從 ChatGPT 反推一份工具清單

Neubig 讓學生說自己拿 ChatGPT 做什麼，再反推背後需要哪些工具。他順帶講了一句：ChatGPT 現在就是 agent，因為它會反覆呼叫工具來回應你。整理出來的五類：

| 類型 | 例子 | 備註 |
|---|---|---|
| 文字回應 | `finish(text)` | 這是 harness 的控制動作，不是外部程式；也可以設計成「模型沒叫工具就結束迴圈」 |
| 資訊檢索 | `search_web(query)` | Neubig 說 RAG 沒死，是普及到大家忘了自己在用 |
| 程式執行 | `execute_code(code)` | 在隔離環境跑程式、回傳輸出 |
| 圖片生成 | `generate_image(query)` | 模型通常會先大幅改寫你的描述，再送去生圖 |
| 自訂函式 | `create_grocery_cart(items)` | 把應用程式的能力包成一個有型別的呼叫 |

設計順序是從「想要的能力」出發，替每一類互動定一個窄介面。

## 程式是元工具：CodeAct 與它的代價

第一種思考方式是給 agent 五十、七十個 API，每步叫一個（或平行叫幾個）。但程式碼是特別的 API：它有迴圈、變數、函式庫，一段程式本身就是一棵函式呼叫樹。叫 pandas 就等於拿到 pandas 裡所有工具。

Neubig 舉的例子是「在美、日、德、印四國中，哪裡買某支手機最便宜」。舊做法是一步一步叫匯率查詢、價格查詢、換算稅金，每個國家重來一次；寫成程式則一次跑完。這就是 [CodeAct](https://arxiv.org/abs/2402.01030)（Xingyao Wang 等，ICML 2024）的主張：用可執行的 Python 當統一的動作空間。論文在 API-Bank 與作者自建的 M³ToolEval 上比較 17 個模型，程式動作的成功率最多高出 20%，所需動作最多少 30%；投影片的整理是 17 個模型裡有 12 個成功率最高、12 個回合數最少。Neubig 口頭補充，這對傳統上不必寫程式、單純叫工具的任務也成立；論文測的確實是這類工具呼叫任務，但沒有把它寫成一條獨立結論。

那為什麼不全部改成程式？因為權限。投影片把程式稱為「高能量工具」，三個代價：

- **表達力強**：迴圈可能卡成無窮迴圈，系統得有機制處理。
- **更難約束**：動作空間太大，驗證不如窄型別函式精準，行為也更難預測。
- **影響更大**：會碰檔案、網路、行程，吃記憶體、磁碟、CPU。Neubig 特別點名套件供應鏈：agent 載到被汙染的函式庫，整個系統就跟著淪陷。

所以一旦走程式化工具呼叫，就要有沙箱、資源限制、權限與稽核紀錄。這部分留到課程後段的安全講次。

**對應 A1**：Part 3 的 `run_python` 就是程式化工具呼叫，讓西洋棋 agent 在沙箱裡用 Python 組合 `simulate_move` 和 `play_move`。

## 機制：工具呼叫其實只是 token

模型不會「執行」任何東西。它輸出的要嘛是文字接續（「天氣晴」），要嘛是工具呼叫接續（`<tool_call>get_weather(...)`），常常兩者同時出現。還記得 [ReAct](https://arxiv.org/abs/2210.03629)（[上一講](/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent)的內容）嗎？現在的 ReAct 迴圈不再是外掛的程式碼，而是一次生成裡依序出現推理 token、給使用者看的訊息、工具呼叫。推理是不給使用者看的長思考，文字是給使用者看的短訊息，工具呼叫才是真正的輸出。

整條路徑是這樣：

1. **訊息變成模型輸入**。API 裡的 system／user／assistant 訊息是 JSON，送進模型前會被 chat template 序列化成一串帶特殊 token 的文字，例如 Qwen 的 `<|im_start|>system ... <|im_end|>`。
2. **工具定義跟著進 prompt**。你在 `chat.completions.create(..., tools=[weather_tool])` 傳的 JSON Schema，模板會放進 prompt 的 `<tools>` 區塊。
3. **模型吐出呼叫內容**，API 回應再替它加上一個唯一的 call ID。

有學生問：這些特殊 token 要在預訓練時就放進詞表嗎？Neubig 的回答是不一定。通常在後訓練（post-training）階段加進去，用中等量、目標格式的資料訓練，再接強化學習。

**每家格式不一樣**，這是最容易踩的坑。同一個 `get_weather(city="Pittsburgh")`，Qwen 用 `<function=...><parameter=...>` 標籤，Mistral 用 `[TOOL_CALLS]` 控制 token 加 call ID，DeepSeek 用自家的 DSML 區塊。一個 schema，各自序列化、各自解析，寫給 DeepSeek 的解析器不會自動適用 Qwen。如果要微調已經訓練過的模型，也要照它原本的工具呼叫格式。好消息是 Hugging Face 的 [`apply_chat_template`](https://huggingface.co/docs/transformers/chat_templating) 已經把這些包好，傳 `tools=` 進去就會照各模型的模板序列化（[工具用法範例](https://huggingface.co/docs/transformers/chat_extras)）。Neubig 要大家知道底下發生什麼事，因為出錯時你得看得懂。

接著是 harness 怎麼派送。投影片用 [OpenHands 的工具系統](https://docs.openhands.dev/sdk/arch/tool-system)當例子：初始化時把工具註冊成 `tools_map[name]`，每次模型呼叫就走「解析 → 查表 → 驗證參數 → 執行 → 回傳帶 call ID 的觀察」。兩個地方會失敗：驗證失敗（模型給了不合法的呼叫），以及執行期失敗（例如 Python 工具收下任何字串，跑起來才報錯）。OpenHands 文件寫明，驗證失敗會變成一個帶 `tool_call_id` 的錯誤事件（`AgentErrorEvent`），以 tool 訊息送回模型讓它修正；執行期錯誤，文件只寫到 MCP 工具會把錯誤包成觀察。設計原則是一樣的：成功或失敗，都要變成模型看得到的一則訊息，而不是讓 harness 自己崩潰。

最後是 **call ID**。工具結果訊息要帶上 `tool_call_id`，平行呼叫時才對得回去。Neubig 分享一個實戰坑：Anthropic 的 API 如果看到一個工具呼叫沒有對應的結果，會直接判定對話紀錄無效、拒絕繼續生成。這條規則寫在 [Anthropic 的工具呼叫文件](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)裡：`tool_result` 必須緊接在對應的 `tool_use` 之後，否則 API 會回錯誤。程式在呼叫工具後、寫入結果前當掉，恢復時就會卡死。

**對應 A1**：Part 1 要你自己組 system／user／assistant／tool 訊息序列，並且把格式錯誤的 JSON 和未知工具轉成可恢復的觀察，而不是丟例外。

## 受限解碼：保證格式，不保證對

模型不保證吐出合法的呼叫，少一個右大括號，JSON 解析器就直接拋例外。Neubig 說他看過無數人事後去補括號，勸大家別這樣做。

約束可以分四層：

| 層次 | 檢查什麼 | 例子 |
|---|---|---|
| 語法 | 是合法 JSON | 括號成對 |
| 形狀 | 必填欄位都在 | 有 `city` |
| 型別 | 欄位型別對 | `city` 是字串 |
| 值 | 值在允許範圍 | `units` 只能是 C 或 F |

這些都能用 [JSON Schema](https://json-schema.org/draft/2020-12/json-schema-core.html) 描述，`type`、`enum`、`required` 這些關鍵字定義在它的 [Validation 規格](https://json-schema.org/draft/2020-12/json-schema-validation.html)裡。但投影片底下那行才是重點：**約束保證的是形式，不保證事實、權限、選對工具或完成任務。** 一段能被解析成 Python 的字串，照樣可能有 bug。

<details>
<summary>文法怎麼接到解碼：從有限自動機到 XGrammar</summary>

正規表示式對應正規文法，用有限自動機就能解析。JSON Schema 做不到，因為 JSON 可以任意深度巢狀，得用上下文無關文法（CFG）。解析 CFG 要用下推自動機（pushdown automaton, PDA）：有限狀態記住「目前在哪條文法規則裡」，多一個堆疊記住「巢狀的規則結束後要回到哪」。

`units: "K"` 為什麼違法？文法規則是 `unit → "C" | "F"`，兩段都是合法 JSON，但只有 `"F"` 推得出來。

接到 LLM 上的做法：每次模型預測下一個 token 的 logit，就問文法「這個 token 合法嗎」，合法給 1、不合法給 0，把不合法的 logit 設成負無限大再重新正規化，機率只分給合法 token。

難點在 token 和文法邊界對不齊：一個 token 可能跨好幾個文法終端符號，也可能停在一個符號的中間，所以檢查要在位元組層做。[XGrammar](https://arxiv.org/abs/2411.15100)（Dong 等，MLSys 2025；作者主要來自 CMU，另有 NVIDIA、上海交大與 UC Berkeley，Neubig 說是 CMU 機器學習系的人做的）的加速法：

1. 把詞表分成兩類：與上下文無關的 token（預先算好合不合法、快取起來）和與上下文相關的 token（論文的例子裡不到 1%，執行時對著完整堆疊檢查）。
2. 用可持久化的堆疊支援分支。
3. 文法計算和 GPU 推論重疊執行。

論文宣稱比既有做法最多快 100 倍，接上推論引擎後結構化生成幾乎零額外開銷。

</details>

Neubig 在課堂出了一題：開了受限解碼，什麼情況下還是會得到壞掉的呼叫？答案是**輸出 token 用完**。自動機一路走在合法路徑上，但還沒走到終止狀態，生成就被 max tokens 截斷，你拿到半個 JSON。理論上可以數剩餘 token 提早收尾，他說實作起來麻煩，歡迎有興趣的同學把它做進 XGrammar。

## REST 與 MCP：同一份 schema，不同的憑證合約

同一個 `get_weather`，可以用幾種方式交給 agent：

1. **函式庫**：`weather_lib.py` 裡的 Python 函式，型別清楚，但只能在同一個行程裡叫，可以透過程式化工具呼叫使用。
2. **REST API**：用 [FastAPI](https://fastapi.tiangolo.com/tutorial/security/) 包成 `GET /weather`，順便加 API key 驗證。好處是可以擋人，而且 FastAPI [自動產生](https://fastapi.tiangolo.com/tutorial/first-steps/)一份 [OpenAPI](https://spec.openapis.org/oas/latest.html) 描述；OpenAPI 的 Schema Object 是 JSON Schema 2020-12 的超集，可以直接餵給模型。
3. **curl**：有 shell 的 coding agent 讀完 API 描述，自己組 `curl` 指令打過去。簡單，但問題是 **agent 的 shell 拿到了 API 憑證**，它可以讀、也可以亂用。

Neubig 坦白說，他第一次看到 [MCP](https://modelcontextprotocol.io/specification/draft/server/tools)（Anthropic 推出的 Model Context Protocol）時覺得多此一舉：呼叫 API 早就有好方法，為什麼要多跑一個程式？讓他改觀的是**憑證中介**。

MCP 架構裡，AI 應用（host）開多個 client，各連一個 server（本機走 stdio，遠端走 HTTP）。用 [FastMCP](https://gofastmcp.com/integrations/openapi) 可以直接把 OpenAPI 規格轉成 MCP 工具。關鍵在兩把鑰匙分開：

- `UPSTREAM_API_KEY`（例如你的 GitHub token）只給 MCP server，用來打上游 API。
- `MCP_API_KEY` 給 agent，只能用來通過 MCP server 的驗證。

模型兩把都看不到。為什麼重要？Neubig 的例子：如果你把 GitHub token 直接給 agent，它哪天覺得把 token 推到公開 repo 是個好主意，你的帳號就被盜了。給 agent 一把就算外洩也相對無害的鑰匙，真正的憑證留在 server 端。投影片也註明：靜態 token 只適合教學與開發，正式環境要驗 JWT 或用 OAuth。

| | OpenAPI／HTTP API | MCP |
|---|---|---|
| 共通 | 名稱、描述、用 JSON Schema 描述輸入 | 同左 |
| 探索 | 抓 OpenAPI 文件 | 執行期呼叫 `tools/list` |
| 呼叫 | HTTP 動詞 + 路徑 + 參數 | 透過 MCP transport 呼叫 `tools/call` |
| 驗證 | client 直接向 API 驗證 | client 向 MCP 驗證，上游驗證另外處理 |
| 範圍 | 描述 HTTP 操作 | 還支援 resources、prompts 與擴充 |

一句話總結：OpenAPI 描述一個 web API，MCP 標準化 AI host 怎麼探索和呼叫能力。MCP 是另一種介面，不是呼叫 REST API 的必要條件。Neubig 口頭補充：MCP 有[官方 registry](https://registry.modelcontextprotocol.io/) 可以找現成 server。

## 平行呼叫：只平行沒有相依的

序列呼叫很慢。投影片的例子：生成 0.8 秒、查天氣 1.2 秒、再生成、查行事曆 0.9 秒、再生成、查航班 1.1 秒、再生成，合計約 6.4 秒。三個查詢互不相依時，一次生成三個工具呼叫區塊，等最慢的那個回來：`2 × 0.8 + max(1.2, 0.9, 1.1) ≈ 2.8` 秒。

限制是**只能平行互相獨立、可以安全並行的呼叫**。查天氣、讀行事曆、查航班可以；「找客戶 ID → 用 ID 撈訂單 → 退款」必須依序。實作上用 `asyncio.gather` 並行執行，保留 call ID，因為結果會亂序回來。

Neubig 提了一個現在 agent 圈的怪現象：**更貴的模型按任務計算，反而可能更便宜**。一個原因是它比較聰明、比較會選對做法；另一個原因是新模型更擅長平行呼叫，一次讀一堆檔、寫一堆檔。為什麼大約半年前突然變好？學生答對了：強化學習。訓練時對任務耗時給重罰，模型就學會大量平行呼叫。

**對應 A1**：西洋棋 agent 的一步棋會改變盤面，所以一組平行呼叫裡最多執行一步 `play_move`，其餘要可恢復地拒絕。這正是「有相依就不能平行」的具體版本。

## 評測：從選工具到 provider 故障

評測端到端 agent 任務前，先要會評工具使用本身。最有名的是 [Berkeley Function-Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html)（BFCL），已經出到第四版，從單步呼叫長成：單回合（simple／multiple／parallel／parallel multiple）、多回合（base、缺函式、缺參數、長 context）、agentic（web 搜尋、記憶），加上穩健度（幻覺量測、格式敏感度）。依官方頁面，總分權重是 agentic 40%、多回合 30%、幻覺量測 10%；格式敏感度不計分，而且只對用 prompt 呼叫工具（非原生 function calling）的模型測。

投影片的「評整個堆疊」表：

| 層次 | 問的是 | 指標 | 要執行嗎 | 典型失敗 |
|---|---|---|---|---|
| 選擇 | 選對工具？ | precision／recall | 否 | 漏叫或多叫 |
| 參數 | 值對嗎？ | AST／schema 比對 | 否 | 欄位或值錯 |
| 軌跡 | 順序對嗎？ | 序列成功率 | 通常要 | 相依關係錯 |
| 任務 | 目標達成？ | 端到端成功率 | 要 | 看起來合理但答錯 |

除了正確性還有三個營運維度：**效率**（延遲、呼叫數、token、成本；正確但慢到貴到不能用也不行）、**可靠度**（逾時、重試、部分失敗）、**安全**（政策、權限、副作用；要測對抗性的工具輸出）。失敗來源也分三處：模型（選錯工具、參數錯、無視結果）、harness（解析、驗證、ID 對不上）、provider 或工具（逾時、限流、執行錯誤）。

最有意思的是 [OpenRouter](https://openrouter.ai/) 的 provider 分析。投影片那張圖（2026 年 8 月 27 日截取）是同一個模型在不同推論 provider 上的工具呼叫錯誤率，當天最高是 Cloudflare 的 15.1%，最低的 Mistral（ZDR）、Inceptron、Baseten 在 0.01–0.06%。圖上沒有標模型名，是講者口述「看起來都是 GLM 5.3」。我對照 OpenRouter 上 [GLM 5.3 的 provider 清單](https://openrouter.ai/z-ai/glm-5.3/performance)，圖裡的 Cloudflare、Venice、Morph、Mistral、Makora、Baseten、Inceptron、Reka、Decart、SiliconFlow 都在，只有 io.net 不在清單上，所以大致吻合，但無法百分之百確認。模型一樣，差在誰幫你跑。課堂上歸納的原因：

- **量化**：Neubig 的個人經驗是 FP8 模型的錯誤呼叫明顯比 FP4 少，FP4 壓太兇，替 provider 省錢但模型變差。
- **推測解碼**：無損的推測解碼不該改變結果，有損的版本就會。
- **受限解碼沒開**：自研推論引擎或 vLLM、SGLang 的設定不同，有些 provider 根本沒實作文法約束，全靠模型自己吐對。
- **provider 本身不穩**：週期性失敗，工具呼叫跟著失敗。

結論是「同一個模型」這種說法不太可靠。正式上線的評測要同時看評測集準確率和營運故障率。

## 指定讀物

課表列了四篇：

- [What Are Tools Anyway?](https://arxiv.org/abs/2403.15452)（Wang、Cheng、Zhu、Fried、Neubig，COLM 2024）：本講的定義與「延伸／輔助」分類來源，還實測了各種工具方法需要的算力與帶來的效益。
- [CodeAct](https://arxiv.org/abs/2402.01030)（ICML 2024）：程式當統一動作空間，另外釋出 7k 筆多回合互動的 CodeActInstruct 資料集。
- [Toolformer](https://arxiv.org/abs/2302.04761)（Schick 等，NeurIPS 2023）：課堂沒展開，但它是「模型自己學會叫工具」的起點。只給每個 API 幾個示範，用自監督方式讓模型學會決定叫哪個 API、何時叫、傳什麼參數，論文用了五個工具：問答系統、維基百科搜尋引擎、計算機、行事曆與機器翻譯。讀它可以補上本講「特殊 token 是後訓練加進去的」那段的歷史脈絡。
- [XGrammar](https://arxiv.org/abs/2411.15100)（MLSys 2025）：受限解碼那節的技術細節。

## 今晚就能做的事

**檢查你的 harness 有沒有這三個洞**：拿你手上的 agent 迴圈，故意餵三種輸入。一，讓工具回傳一段截斷的 JSON，看 harness 是丟例外還是把錯誤當觀察回給模型。二，在工具呼叫之後、寫入結果之前讓程式中斷，再恢復對話，看 provider 會不會因為缺結果而拒絕。三，把系統裡的 API key 搜一遍，看有沒有任何一把出現在 agent 的 shell 環境變數裡；有的話，考慮用一層 MCP server 把它換成可以隨時撤銷的次級憑證。

## 它在課程裡的位置

[L1](/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent) 借 Russell 與 Norvig 的定義，把 agent 講成「在迴圈裡、透過工具感知與改變環境的模型」；L2 把其中的「工具」拆到 token 層。下一講 [L3 Context Management](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management) 處理工具用多了之後的後果：工具結果佔掉 agent prompt 的三成以上，context 一路長到塞不下。

## 延伸閱讀

- [CMU 11-768 導讀系列總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)：整門課的地圖與各篇索引
- [Stanford CS329Z 導讀 Week 3：工具接進來，框架拆開看](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)：另一門課從系統設計角度談工具與 DSPy
- [MCP（Model Context Protocol）：AI Agent 工具呼叫的標準化協定](/posts/ai/2026-03-22-mcp-model-context-protocol)
- [MCP vs CLI vs API：Agent 工具介面的真實分界](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)：和本講 REST vs MCP 一節互補
- [Code Mode：把 tool definition 從 context 搬進 code](/posts/ai/2026-05-10-code-mode-mcp-runtime-pattern)：CodeAct 想法在 MCP 上的實作

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：依字幕核對影片內容。全程字幕與文章轉述的講者說法相符，未需修改。

## 參考資料

以下來源都已打開全文核對（2026-09-29）：

- [CMU 11-768 AI Agents 課程網站](https://www.cmu-agents.com/)
- [Lecture 2 投影片：Tool Use for Language Model Agents](https://www.cmu-agents.com/slides/lecture-02-tool-use.pdf)
- [Lecture 2 錄影](https://www.youtube.com/watch?v=jXChFB4JSyw)
- [What Are Tools Anyway? A Survey from the Language Model Perspective（arXiv 2403.15452）](https://arxiv.org/abs/2403.15452)
- [Executable Code Actions Elicit Better LLM Agents / CodeAct（arXiv 2402.01030）](https://arxiv.org/abs/2402.01030)
- [Toolformer: Language Models Can Teach Themselves to Use Tools（arXiv 2302.04761）](https://arxiv.org/abs/2302.04761)
- [XGrammar: Flexible and Efficient Structured Generation Engine for LLMs（arXiv 2411.15100）](https://arxiv.org/abs/2411.15100)
- [ReAct（arXiv 2210.03629）](https://arxiv.org/abs/2210.03629)
- [Hugging Face Chat Templates](https://huggingface.co/docs/transformers/chat_templating)
- [Hugging Face Tool Use（chat_extras）](https://huggingface.co/docs/transformers/chat_extras)
- [OpenHands Tool System Architecture](https://docs.openhands.dev/sdk/arch/tool-system)
- [Anthropic：Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)
- [JSON Schema 2020-12 Core](https://json-schema.org/draft/2020-12/json-schema-core.html)
- [JSON Schema 2020-12 Validation](https://json-schema.org/draft/2020-12/json-schema-validation.html)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [FastAPI First Steps（自動產生 OpenAPI）](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [MCP Tools Specification](https://modelcontextprotocol.io/specification/draft/server/tools)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)
- [FastMCP OpenAPI Integration](https://gofastmcp.com/integrations/openapi)
- [FastMCP Token Verification](https://gofastmcp.com/servers/auth/token-verification)
- [Berkeley Function-Calling Leaderboard V4](https://gorilla.cs.berkeley.edu/leaderboard.html)
- [OpenRouter：GLM 5.3 provider 效能頁](https://openrouter.ai/z-ai/glm-5.3/performance)
