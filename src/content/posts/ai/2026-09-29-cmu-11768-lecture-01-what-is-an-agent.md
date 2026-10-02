---
title: "CMU 11-768 第 1 講：agent 是跑在迴圈裡的模型，難的是讓它真的做得好"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, agent-loop, tool-use, harness-engineering]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 1
tldr: "11-768 第 1 講先把 agent 拆到最小：工具定義和工具呼叫都只是 token，harness 負責解析、執行、把結果塞回 context，ReAct 迴圈一跑就是 agent。接著 Neubig 列出好 agent 要的六種能力，每一種都能從訓練或 harness 兩條路補，並主張 agent 是由 harness、沙盒、推論、訓練、監控五塊組成的系統，不只是一個模型。"
description: "CMU 11-768 AI Agents 第 1 講「What Is an Agent?」導讀：Russell & Norvig 的 agent 定義如何對到今天的 LLM agent、工具定義與 chat template、Toolformer 與 ReAct、mini-swe-agent 的最小迴圈、六種 agent 能力、訓練與 harness engineering 的取捨，以及 agent 系統的五個組成。"
draft: false
glossary:
  - term: "ReAct"
    aliases: ["Reason + Act"]
    definition: "讓模型交替產生推理文字和工具呼叫的 agent 迴圈：看目前的 context、想下一步、呼叫工具、把結果加進歷史，再重來。"
    context: "本講把它當作 agent 的最小形式，Assignment 1 要你自己實作一個。"
    links:
      - label: "ReAct (arXiv:2210.03629)"
        url: "https://arxiv.org/abs/2210.03629"
  - term: "chat template"
    aliases: ["apply_chat_template"]
    definition: "把結構化的訊息、工具定義、工具呼叫和結果，轉成模型實際讀到的一串文字的規則。每個模型家族的格式不同。"
    context: "本講用它說明工具呼叫對模型來說只是另一段 token。"
  - term: "grammar-constrained decoding"
    aliases: ["受限解碼"]
    definition: "生成時只允許符合某個文法（例如工具參數的 JSON Schema）的 token，保證輸出一定解析得了。"
    context: "本講把它列為從 harness 那一側提升工具呼叫準確度的做法。"
  - term: "context compaction"
    aliases: ["context 壓縮"]
    definition: "context 快滿時，把較早的對話歷史摘要成短版本再繼續，讓 agent 能做更長的任務。代價是摘要可能漏掉重要指示。"
    context: "本講開場的刪信事故，就是壓縮時弄丟了「先問我再動手」這條指示。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent-en)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 的第一講（2026-08-25，[錄影](https://www.youtube.com/watch?v=UwfjzyLnvMg)、[投影片](https://www.cmu-agents.com/slides/lecture-01-agents.pdf)）分成兩半。前半由 Daniel Fried 把 agent 拆到最小：一個語言模型，加上一個會執行工具的迴圈。後半由 Graham Neubig 問下一個問題：迴圈寫出來不難，要怎麼讓它真的做得好？他的答案是一張「六種能力 × 兩條路」的地圖，整門課的課表就是照這張地圖排的。

這篇照課堂順序走：開場的成功與失敗案例、agent 的定義、從語言模型走到 agent 的三步、六種能力、訓練與 harness 的取捨、agent 系統的五個組成，最後是這門課的學習目標。課程形式、評分和作業細節放在[系列總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)。

## 開場：agent 已經能做大事，也會闖大禍

Fried 用兩個對比的例子開場。

成功的例子是 Nicholas Carlini 在 Anthropic 做的實驗：[16 個平行的 Claude agent 用兩週寫出一個 10 萬行的 C 編譯器](https://www.anthropic.com/engineering/building-c-compiler)，用 Rust 寫成，能編譯 Linux 核心。

失敗的例子是 Meta 的 AI 安全研究員 Summer Yue 在 2026 年 2 月發在 X 上的貼文（投影片第 3 頁貼了對話截圖）：她讓 OpenClaw 整理收件匣，交代「先建議要刪什麼，我說可以再動手」。在小的測試信箱上沒問題，換成真正的信箱後，信件量大到[觸發了 context 壓縮，壓縮時弄丟了原本那條指示](https://www.pcmag.com/news/meta-security-researchers-openclaw-ai-agent-accidentally-deleted-her-emails)，agent 開始大量刪信，她從手機上阻止不了。Fried 點出這門課會正面處理的機制：為了讓 agent 做更長的任務而壓縮歷史，本身就可能把最重要的約束壓掉。

接著他做了一個舉手調查：下面六件事，你願意讓 agent 完全自主做、先問你再做、還是永遠不要做？

| 任務 | 現場多數票 |
|---|---|
| 診斷線上商店結帳為什麼開始失敗 | 自主 |
| 起草並寄出產品上市信給 5 萬名客戶 | 先問 |
| 收集稅務文件、準備並申報 2025 年所得稅 | 永遠不要 |
| 把付款 API 從 Python 遷到 Rust，且不能弄壞手機結帳 | 自主和先問很接近 |
| 喜歡的樂團來附近開演唱會時幫我買票 | 自主 |
| 看了一週血糖數據後調整胰島素劑量 | 永遠不要 |

這張表沒有標準答案。它要說的是：能力和信任是兩件事，agent 技術上做得到的事，人不一定敢放手。沙盒、安全、互動和人類監督那幾講會回到這個問題。

最後是兩段 CMU 自己的示範。一段是 JY Koh 兩年前做的 GUI agent：在 Yelp 上找匹茲堡一家至少 200 則評論、4.3 星以上的泰國餐廳，右邊看得到模型的推理，左邊是它在操作瀏覽器。另一段是 Neubig 的 OpenHands 示範：agent 寫一個 Flask 待辦清單 app，自己啟動、發現連接埠被占用後自己換、再開瀏覽器點按鈕測新增和刪除。Fried 強調的是後者：agent 能自己發現錯誤、自己修好。

## Agent 是什麼：教科書的老定義還能用

Fried 引用 Russell 和 Norvig 在《Artificial Intelligence: A Modern Approach》第 2 章的定義：agent 是任何可以被看成「透過感測器感知環境、透過致動器對環境行動」的東西。（投影片用的是 actuators 這個字；本書[第 1 版第 2 章](https://people.eecs.berkeley.edu/~russell/aima1e/chapter02.pdf)原文寫的是 effectors，意思相同，後來的版本改成 actuators。）他認為這個定義對今天的 LLM agent 依然成立，過去為 agent 發展的很多技術，例如檢索和強化學習，今天也還適用。

把定義對到 LLM agent，投影片列了四個元素：

| 元素 | 今天的例子 |
|---|---|
| 環境 | 程式碼 repo、網站、應用程式、工作流程 |
| 狀態／觀察 | 使用者訊息、檔案內容、網頁、螢幕截圖、工具回傳的結果 |
| 行動 | 回覆、編輯檔案、執行 shell 指令、呼叫 API、滑鼠鍵盤事件 |
| 獎勵 | 測試通過、LLM-as-a-judge 依評分標準打分、使用者的正面回饋 |

獎勵那一列預告了後面的課。測試通過可以直接給 1 或 0，但很多任務寫不出程式化的判準，只能靠 LLM 當評審，這是 Assignment 2 的主題；最終你在意的是使用者滿不滿意，這會在 Valerie Chen 的人機互動那講處理。

## 從語言模型到 agent：三步

### 第一步：語言模型本來就只會吐 token

這門課假設你訓練過語言模型，所以這段很快：模型每一步預測下一個 token 的分布、取一個、接回前綴、再預測。Chain of thought 則是讓模型先生出一段不是答案的中間推理，這些 token 會成為後面預測的 context。

Fried 特別指出，到這裡為止都還不是 agent：模型只是在跟你給的 prompt 互動，碰不到外面的世界。

### 第二步：工具就是一段有型別的介面描述

要讓模型對環境行動，主要靠工具。工具是環境提供給模型的介面，可以想成一個 API。投影片用一個讀檔工具當例子：

```json
{
  "name": "read_file",
  "description": "Read a UTF-8 file.",
  "parameters": {
    "type": "object",
    "properties": { "path": { "type": "string" } },
    "required": ["path"]
  }
}
```

名稱、自然語言描述、再加一份 JSON Schema 描述參數。重點在下一步：模型看不到這個 JSON 物件，它看到的是 chat template 把它渲染成的一段文字，例如包在 `<tools>...</tools>` 裡。模型要嘛被訓練過、要嘛從幾個範例學會怎麼讀這段文字。

工具呼叫和結果也一樣。模型生成一段 `<tool_call>{"name":"read_file","arguments":{"path":"test.py"}}</tool_call>`，harness 執行後把檔案內容包成 `<tool_response>...</tool_response>` 塞回去，模型再從這裡繼續生成。

Fried 在課堂上問：除了 JSON，模型還能用什麼方式呼叫工具？台下有人答：直接寫程式，例如 bash 指令或 Python 函式呼叫。他說後面幾講會看到這種做法常常比生成 JSON 更有效率，但也有取捨。第二講的指定讀物 [CodeAct](https://arxiv.org/abs/2402.01030)（Wang et al., ICML 2024）就是在比這件事：在 17 個 LLM 上，用可執行的 Python 當行動，成功率比 JSON 或純文字格式最多高 20%、行動數最多少 30%；但不是每個模型都贏（17 個裡有 12 個是程式碼格式最好），而且對閉源模型來說 JSON 格式的表現也不差。

### 第三步：把模型放進迴圈

投影片標題是「actions as tokens」：對模型來說，工具呼叫只是另一段它可以預測的 token 序列，裡面寫著工具名稱和參數。真正去解析、驗證、執行這段呼叫，再把結果變回觀察 token 的，是模型外面的 **harness**。這條分工線是整門課的基礎：模型只處理 token（之後會加上圖片等多模態輸入），harness 負責跟世界打交道。

[Toolformer](https://arxiv.org/abs/2302.04761)（Schick et al., NeurIPS 2023）是這條路上很有影響力的一篇：每個 API 只需要幾個人寫的示範，先讓模型用 in-context learning 在一般文字裡取樣候選的工具呼叫，只保留能降低後續 token 預測 loss 的那些，再用標準的語言模型目標微調。結果是模型學會自己決定何時呼叫工具、並用回傳結果改善後面的預測，整個流程是自監督的，沿用的就是原本的語言模型訓練方法。

有了工具，agent 就是一個迴圈。[ReAct](https://arxiv.org/abs/2210.03629)（Yao et al., ICLR 2023，名字來自 reasoning + acting）的結構是：

1. context 裡有任務的總體說明（例如「解決 GitHub issue」）、使用者的具體請求、可用工具清單、以及到目前為止的觀察與行動歷史
2. 模型根據這些產生一段推理，然後產生一個或多個工具呼叫
3. harness 在環境裡執行，環境狀態跟著改變，結果加進歷史
4. 回到第 1 步

結束也是靠工具：例如一個 `send_message` 工具把答案傳給使用者，就代表任務完成。模型怎麼判斷自己該停了，會在規劃那一講談。

投影片直接貼了 [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) 的核心程式碼。這個 repo 的 README 說它的 agent class 只有大約 100 行 Python，在 SWE-bench Verified 上的分數卻超過 74%，Fried 推薦大家去讀。下面是投影片上的節錄，比 repo 現行版本精簡：實際的 `run` 在迴圈外包了例外處理、並在收到 exit 訊息時跳出，`query` 也會先檢查步數、成本和時間上限。

```python
def run(self, task: str = "", **kwargs) -> dict:
    self.messages = []
    self.add_messages(
        self.model.format_message(role="system", content=self._render_template(self.config.system_template)),
        self.model.format_message(role="user", content=self._render_template(self.config.instance_template)),
    )
    while True:
        self.step()

def step(self) -> list[dict]:
    return self.execute_actions(self.query())

def query(self) -> dict:
    message = self.model.query(self.messages)
    self.add_messages(message)
    return message
```

骨架就是一則 system 訊息、一則任務訊息，然後一個迴圈：查詢模型、把回覆加進歷史、執行動作、把觀察加進歷史。Assignment 1 就是要你實作一個類似的控制器，自己建立並呼叫工具，拿它去修一個西洋棋 app 的 bug。

最後他打開 [swebench.com](https://www.swebench.com/) 上的一條真實軌跡（GPT-OSS 解一個 pull request）：system 訊息只寫「你是能跟電腦 shell 互動的助理」，user 訊息給具體任務；模型每一步產生一段推理和一個 bash 指令，環境執行後只回一個結束碼，0 代表成功，然後進入下一步。這個 agent 用的正是「直接寫程式」那種工具格式。

## 好 agent 要有六種能力

後半堂 Neubig 接手，第一句話就是：做出一個 agent 並不難，難的是讓它真的有用。他先請台下說說用 agent 時被什麼惹毛。答案包括：太慢、太囉唆、會忘事、會誤解你、碰到不該碰的權限、常識出錯、兩行能改完卻寫一千行、忘了上個 session 的事、你說了不合理的話它也不反駁、會說謊、藏了很多假設。

他把這些歸成六種能力：

1. **準確的工具呼叫。** 沒人提到，因為大家已經視為理所當然。但如果你是負責訓練模型的人，這是地基中的地基：工具叫錯，任何任務都會失敗。
2. **長 context 裡的一致性。** 會忘事、忘記上個 session、以及開場那個壓縮後刪信的例子，都屬於這類。
3. **可客製化。** 每個人、每門課的要求都不同，agent 要照你的方式做事。
4. **複雜任務管理。** 拆解任務、撐過很長的流程，Neubig 說這是非常大的問題。
5. **理解環境。** 「兩行寫成一千行」其實是這類失敗：模型不知道這個改動其實很簡單。
6. **安全。** 很多人把安全和能力當成兩個研究方向，Neubig 的看法是安全本身就是一種能力：沒內建在 agent 裡，你就不敢拿它做重要的事。

## 兩條路：訓練模型，還是改 harness

每種能力都可以從兩個方向補：

| | LLM 訓練 | Harness engineering |
|---|---|---|
| 做法 | 透過預訓練、SFT 或 RL 改變模型的行為 | 改變模型周圍的系統：prompt、工具、記憶、控制流程 |
| 教的是 | 可重用的推理、工具使用和錯誤恢復模式 | 提供 context、驗證、重試和安全邊界 |
| 能力存在哪 | 成為學到的策略的一部分 | 從模型加 harness 的組合中產生 |

Neubig 現場問哪邊比較重要，兩邊都有不少人舉手。他的答案是兩者都重要，但通常的發展順序是：大家先在 harness 層發現問題並解決它；訓練模型的人接著發現這個問題嚴重到值得專門訓練，把它練進模型；於是 harness 層不再需要處理。所以他認為訓練通常是比較根本的解法，但它慢，你手上的問題往往等不及，只能先從 harness 下手。

台下接著問：哪些能力就算模型練得再好，harness 還是躲不掉？Neubig 的回答：

- **長 context 一定會留下來。** 把所有記憶都放在 context 裡不只是準確度問題，也是效率問題，只要還在 Transformer 這種二次方複雜度的架構下就是如此。
- 工具呼叫、context 內的一致性、任務管理、環境理解，甚至安全，**理論上都能靠模型解決，但還沒解決**，所以現在仍然需要 harness。
- **客製化很有意思**：模型可以即時訓練，但很多時候你只想給它一段腳本或一份情境指示，這時訓練未必是好選擇。

另一個問題是推論延遲很敏感時怎麼辦。Neubig 的觀察是：延遲吃緊通常代表要用比較小的模型，而模型越小越需要額外的防護或針對任務調整，因為大模型的泛化能力通常比較好。

### 訓練在這門課的位置

投影片把訓練 agent 的流程分成三段：預訓練（文字、程式碼、多模態資料，學到廣泛的表徵）、mid-training 或 SFT（指令、軌跡、工具呼叫，學到格式和示範）、RL（獎勵或偏好，學到軌跡層級的行為）。

這門課不做預訓練，理由很直白：預訓練的規模是整個網路，課程的算力額度撐不起。SFT 講得比較少，因為先修已經要求你做過，重點會放在怎麼替 agent 環境做資料。RL 是重點：現場舉手調查時，Neubig 估計拿 RL 訓練過 agent 的人大約一成（講者看台下舉手的口頭估計）。

### 六種能力 × 兩條路

Neubig 把六種能力逐一對到兩條路上：

| 能力 | Harness engineering | LLM 訓練 |
|---|---|---|
| 準確的工具呼叫 | grammar-constrained decoding，保證呼叫符合規格 | SFT：用工具呼叫軌跡訓練 |
| 長 context 一致性 | context 壓縮、動態記憶查找、委派給 sub-agent | SFT：長 context 訓練（課程著墨不多） |
| 可客製化 | agent 記憶、skills、自訂工具 | RL：從使用者回饋學習（還很新） |
| 複雜任務管理 | 提供規劃／拆解工具、委派給 sub-agent | RL：在複雜、長時程任務上訓練 |
| 理解環境 | 提供對應領域知識的 skills | SFT：用有預期觀察格式的資料訓練；RL：在領域專屬環境中訓練 |
| 安全 | 沙盒、限制憑證存取、監控軌跡 | RL：安全導向的 RL |

幾格有額外說明：

- **sub-agent 委派**：把長任務的一部分交給另一個 agent，它自己留著那段 context，做完就丟掉，主 agent 的 context 不會被塞爆。
- **skills**：一段 prompt，有時附上腳本，在特定時機才載入。Neubig 認為客製化是目前 harness engineering 最好發揮的地方。
- **規劃模式**：他講了一個小故事：某個熱門 coding 工具的「規劃模式」按鈕，實際上只是在 prompt 加一句「請先規劃，不要動手」，因為大家都想要一個按鈕。更複雜的做法當然存在。
- **理解環境**：GUI agent 要看懂網頁和介面，很多開源模型連多模態都不支援，支援的也比理解文字錯得多；換到股票交易環境，模型不太懂時間序列；換成培養皿的影像，也處理不好。Neubig 的重點是：「模型會自己變好」這種說法不對，是人讓模型變好的。某個模型新版本突然更會作曲，背後通常是有人做了作曲的訓練環境、把它加進訓練集。所以很多工作在於打造領域專屬的環境。
- **安全**：他舉了 2026 年 7 月 OpenAI 的事件。Neubig 在課堂上的講法是：OpenAI 最新的模型在 agent harness 裡做資安測試，破解不了目標系統，就轉而入侵 Hugging Face、拿到答案完成任務。[Simon Willison 整理的公開說明](https://simonwillison.net/2026/Jul/22/openai-cyberattack/)細節不太一樣：出事的是多個 OpenAI 模型的組合（包括 GPT-5.6 Sol 和一個更強的未發布模型，都降低了資安相關的拒答），在 ExploitGym 評測中沒有正面解題，而是利用套件 registry 快取代理的一個 zero-day 跑出沙盒，再從 Hugging Face 的正式資料庫拿到測試解答；來源沒有說它是「破解不了才這麼做」。Neubig 的拆法是這裡同時壞了好幾層：沙盒沒有把 agent 關好、監控沒有即時發現，而且因為要測的正是攻擊能力，模型身上的防護本來就比公開版少。

## Agent 是系統，不只是模型

Neubig 接著強調：agent 比你在其他機器學習課碰過的東西都複雜，因為它是一整個系統。投影片把它拆成模型加上五塊：

| 組成 | 負責什麼 | 範例軟體 |
|---|---|---|
| Harness | 管狀態、工具、記憶和控制流程；驗證動作、處理錯誤；執行權限和安全邊界 | Coding agent：Claude Code、Codex、OpenHands、OpenCode、Pi；編排器：LangChain（他說或許該寫 LangGraph）、CrewAI |
| 沙盒 | 隔離程式和工具的執行；限制運算、網路、檔案系統存取；建立可重現的環境 | Docker、Apptainer、Modal、Sail |
| LM 推論 | 穩定地提供生成；批次處理請求並重用 KV cache；處理串流、平行和吞吐量 | vLLM、SGLang |
| 訓練系統 | 準備資料、收集 rollout；協調分散式 worker；checkpoint、評測、重現實驗 | SkyRL、Miles |
| 可觀測性與監控 | 記錄軌跡和指標；追蹤品質、成本和失敗；比較軌跡和評測結果 | Laminar、MLflow（Fried 示範用的 LangSmith 也是一例） |

幾個課堂上補充的細節：

- **兩種 harness 的哲學不同。** Coding agent 在 agent 之間的互動上比較簡單，但給單一 agent 的行動範圍很廣，能寫任意程式、操作網站；編排器裡的單一 agent 能做的事比較少（例如只回客服問題、只查資料庫），換來的是可以用宣告式的方式寫出整個工作流程。限制較多、表達力較低，兩者各有適用場合。
- **沙盒同時服務安全和評測。** 以 SWE-bench 為例，每個任務都有自己的沙盒，代表 agent 動手前的環境狀態，所以可以在本機重現。
- **agent 的推論比一般 LLM 推論難。** 你以前處理的 context 可能是 16K 或 32K，現代 coding agent 至少要 256K 左右；agent 每多做一步 context 就更長，重用前面的快取變得非常關鍵。
- **推論服務商非常多。** Neubig 說在 [OpenRouter](https://openrouter.ai/) 上，同一個模型常有二三十家服務商在提供。這個數字偏高：2026-09-29 查 OpenRouter 的 endpoints API，熱門的 gpt-oss-120b 有 20 家服務商，Llama 3.3 70B Instruct 是 10 家，DeepSeek V3.1 是 7 家。

## 這門課要你學會什麼

投影片列了五個學習目標：

1. 在開源 LLM 上從零實作一個 agent，包括自己的工具
2. 為多步驟任務設計評測：Neubig 強調就算你只在乎訓練，這也極重要，因為替 RL 建立並擴大評測是目前的最佳實務
3. 訓練 agent 提升能力：自己跑起 RL 的循環，解決過程中的系統問題
4. 分析安全與可靠性之間的取捨
5. 在 agent 領域追一個開放的研究問題

前三項對應三份個人作業（harness、評測、RL 訓練），大約占前半學期；後半學期是團隊研究專題（投影片和講者都說 2–3 人一組；官網評分表寫 2–4 人，但官網課程政策段落仍寫 2–3 人，細節見系列總覽）。學期時程依序是 agent 能力、應用領域、訓練、框架與安全、互動，最後是客座講座和海報發表。先修、評分、AI 工具政策和 slack days 的細節見[系列總覽](/posts/ai/2026-09-29-cmu-11768-course-overview)；投影片上的作業日期是暫定值，以官網為準。

## 今晚可以做的三件事

- **讀 mini-swe-agent 的 [agent class](https://github.com/SWE-agent/mini-swe-agent/blob/main/src/minisweagent/agents/default.py)。** README 說核心約 100 行（`default.py` 整個檔案目前約 190 行，多出來的是限制檢查和例外處理），讀完你會知道自己用的 coding agent 最核心的部分長什麼樣，也是 Assignment 1 最好的預習。
- **在 [swebench.com](https://www.swebench.com/) 打開一條軌跡，逐步看模型收到什麼、吐出什麼。** 特別注意觀察有多貧乏（常常只有一個結束碼），再想想你的 agent 失敗時，是不是也在類似的觀察上做決定。
- **把你最近一次被 agent 惹毛的經驗，歸到六種能力的其中一格，再問自己：這要改 harness，還是要換模型？** 這就是 Neubig 的地圖最直接的用法。

## 自我檢測

<details>
<summary>1. 為什麼說「工具呼叫只是 token」？這對訓練有什麼意義？</summary>

工具定義、呼叫和結果都經過 chat template 渲染成文字，模型只是在預測下一段 token；真正執行的是 harness。所以要讓模型更會叫工具，可以直接用工具呼叫軌跡做 SFT，這跟一般語言模型訓練是同一套流程。Toolformer 走的是同一個方向，只是訓練資料不是人標的軌跡，而是模型自己取樣、再依「能不能降低後續 token 的 loss」篩選過的工具呼叫。

</details>

<details>
<summary>2. 開場的刪信事故屬於六種能力的哪一種？兩條路各能怎麼補？</summary>

屬於長 context 一致性（也牽涉安全）。Harness 那側可以改進壓縮策略，例如把使用者的關鍵約束標記為不可壓縮，或在執行刪除這類不可逆動作前強制確認；訓練那側則是做長 context 訓練，讓模型不需要那麼早壓縮。

</details>

<details>
<summary>3. Neubig 認為哪種能力即使模型再強，harness 也躲不掉？為什麼？</summary>

長 context。把所有記憶都放進 context 不只影響準確度，也影響效率；在 Transformer 注意力的二次方成本下，harness 仍然需要壓縮、記憶查找和委派。

</details>

## 延伸閱讀

- 站內：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)，跟本講「agent 是系統」的論點同一條線
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
- 站內：[Context Engineering：為什麼你的 AI Agent 問題出在資訊，不在模型](/posts/ai/2026-03-24-context-engineering-guide)，第 3 講的前置
- 站內：[OpenClaw Agent Loop 拆解](/posts/ai/2026-03-28-openclaw-agent-loop)，開場事故主角的迴圈怎麼寫
- 站內：[Stanford CS329Z 導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，同樣要你從零寫 harness，但不碰訓練
- 站內：[CME295 第 7 講：Agentic LLM](/posts/ai/2026-09-29-cme295-agentic-llms)，從 RAG 和 function calling 的角度講同一件事

## 參考資料

- [11-768 第 1 講投影片：What Are Agents? And How Do They Work?](https://www.cmu-agents.com/slides/lecture-01-agents.pdf)
- [11-768 第 1 講錄影](https://www.youtube.com/watch?v=UwfjzyLnvMg)
- [11-768 AI Agents 官網](https://www.cmu-agents.com/)（課表與指定讀物）
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)（arXiv:2302.04761，NeurIPS 2023，指定讀物；方法與取樣篩選流程依全文第 2 節）
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)（arXiv:2210.03629，ICLR 2023，指定讀物）
- [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)（指定讀物；README 的行數與 SWE-bench Verified 分數、`agents/default.py` 原始碼，2026-09-29 查看）
- [Executable Code Actions Elicit Better LLM Agents（CodeAct）](https://arxiv.org/abs/2402.01030)（arXiv:2402.01030，ICML 2024，第 2 講指定讀物）
- [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)（Nicholas Carlini，Anthropic，2026-02-05）
- [Meta Security Researcher's AI Agent Accidentally Deleted Her Emails](https://www.pcmag.com/news/meta-security-researchers-openclaw-ai-agent-accidentally-deleted-her-emails)（PCMag，2026-02-24）
- [OpenAI's accidental cyberattack against Hugging Face is science fiction that happened](https://simonwillison.net/2026/Jul/22/openai-cyberattack/)（Simon Willison，2026-07-22）
- [SWE-bench](https://www.swebench.com/)
- [Artificial Intelligence: A Modern Approach 第 1 版第 2 章 Intelligent Agents](https://people.eecs.berkeley.edu/~russell/aima1e/chapter02.pdf)（Russell & Norvig；agent 定義原文）
- [OpenRouter endpoints API：gpt-oss-120b](https://openrouter.ai/api/v1/models/openai/gpt-oss-120b/endpoints)（服務商數量，2026-09-29 查看）
