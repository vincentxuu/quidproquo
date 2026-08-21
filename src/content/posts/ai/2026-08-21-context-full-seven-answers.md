---
title: "Context 滿了怎麼辦：七種答案，沒有一種是共識"
date: 2026-08-21
type: deep-dive
category: ai
tags: [context-engineering, ai-agent, harness-engineering, claude-code, agent-cli, llm]
lang: zh-TW
tldr: "Chroma 的對照實驗證明：就算塞得下，塞滿也會變差。於是各家 coding agent 發展出七種對策——壓縮、換手、剪枝、少載入、隔離、進模型、換單位。Amp 直接移除 /compact，Atlassian 說摘要該是最後手段，Cursor 的 A/B 測出 46.9% token 降幅。三場分歧的根源不是誰對，是各自在衡量不同的東西。"
description: "比較 Anthropic、Amp、Cursor、Factory、Atlassian、Cognition、Manus、AWS 對「agent context 滿了」的七種處理策略，含各家公開數字、三場真實技術分歧，以及這個領域缺少的對照實驗。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-context-full-seven-answers-en)

你用 Claude Code、Cursor 或 Codex 寫一個下午的程式，到了某個時刻，畫面會提示 context 快滿了，問你要不要壓縮。這個提示背後是一個沒被解決的工程問題。agent 每問一次，都要把整段對話重送一次給模型。它讀過的檔案、跑過的指令輸出、走過的冤枉路，全部都在裡面。

問題是這堆東西該怎麼處理。過去一年半，至少八家做 coding agent 的公司公開寫過他們的答案，而且**彼此不同意**。Amp 把壓縮功能整個從產品裡拿掉。Atlassian 寫了一張表反駁用模型做摘要。Manus 說不要動態增減工具，但 Cursor 和 Factory 的整個設計就是動態載入工具。

這篇整理這七種答案各自的主張、公開的數字、賭注和代價。範圍限定在**有公開技術論述的家**——很多工具有功能但沒說明理由，那些不在這裡。

## 不是視窗不夠大

先破除一個直覺：這不是「context window 太小」的問題。

Chroma 在 2025 年 7 月發表的 [Context Rot](https://www.trychroma.com/research/context-rot) 研究做了一件之前少有人做的事：**固定任務難度，只改變輸入長度**。過去的長 context 評測有個結構問題——輸入變長通常任務也變難（圖變大、清單變長），所以分不出來是長度害的還是難度害的。Chroma 把難度鎖死，只讓無關內容變長。

結果是十八個模型全部隨長度衰退。而且不只在困難任務上：他們設計了一個「把這段文字原樣複製一遍」的任務，重複詞裡插一個不一樣的詞。這種瑣事本該像程式一樣可靠，但隨著長度增加，模型開始拒答、開始反問使用者要不要順便修正、開始輸出亂碼。

他們的結論是這個題目的地基：

> 相關資訊是否存在於模型的 context 中並不是全部；更重要的是那些資訊**如何被呈現**。

另一組數字更貼近日常。他們用 LongMemEval 這個對話記憶測試比較兩種輸入。一種只給回答問題所需的段落，平均約 300 token；另一種給完整對話，平均約 113,000 token。答案在兩邊都在，差別只是有沒有雜訊。所有模型在精簡版上都明顯較好。

Chroma 也點出一個值得記住的細節：Claude 系列在這個落差上最大，主因不是它找不到答案，而是**面對歧義時傾向棄答**。塞進去的雜訊製造了歧義，模型就說「我無法判斷」。

## 為什麼 context 是複利的

第二層是錢。

依 Anthropic 在 [Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)（2026 年 8 月）的說明，agent 的每一輪都會把整個對話重送一次。所以任何進入 context 的東西——一個讀進來的檔案、一次測試輸出的四百行 PASS——**不是被算一次，是被算到 session 結束為止**。

省下這筆錢的機制是 prompt caching：如果這次請求的開頭和上次完全一樣，伺服器可以沿用之前算好的狀態。Manus 用 Claude Sonnet 的牌價說明這個差距——快取過的 input token 是每百萬 0.30 美元，沒快取的是 3 美元，十倍。

但快取有個殘酷的性質：它從請求的最開頭往後比對，**差一個 token，那之後全部重算**。這解釋了為什麼工具定義的位置這麼要命——它排在對話前面，一動就把後面全部作廢。這個機制會在後面的分歧裡再出現一次。

## 七種答案

以下按判決排列，不按時間也不按廠商。每一種給四樣東西：主張、一個代表性數字、賭注，以及今晚就能做的一個動作。

### 一、壓縮：把舊的變成摘要

Claude Code 的 `/compact`、Cline 的 `/smol`、Kilo Code、OpenHands 的 condenser 都屬於這派。做法是讓模型讀完整段對話，寫一份摘要，然後用摘要取代原文。

賭注是摘要夠好。Anthropic 補了一個成本上的理由：摘要這件事本身要花錢，但**趁快取還熱的時候做很便宜**。所以離開鍵盤前先壓一次，比隔天回來再壓划算。

代價是有損，而且會累積——摘要之上再疊摘要。

**怎麼做**：離座前先 `/compact`，並在指令後面直接講要保留什麼（例如「保留 API 的設計決定和還沒修的三個 bug」）。

### 二、換手：不壓縮，開一條新的

Amp 在 2025 年 10 月[直接把 compaction 從產品裡移除](https://ampcode.com/news/handoff)，換成 handoff。

關鍵設計不在技術，在**順序**。摘要是回顧——把已經發生的事濃縮；handoff 要你先講下一步要幹嘛，再由模型依這個目標從舊對話裡抽取。你打 `/handoff 現在把這個也套用到團隊帳號`，它產生的是新對話的起手 prompt，而且是草稿，你可以改再送。

Amp 給的理由比「有損」更有意思。他們認為 compaction 會**鼓勵壞習慣**：反正滿了就壓一下，於是對話越拖越長、越拖越發散。而 Amp 團隊的工作方式是一個功能拆成十幾條各自獨立的短對話，最大一條十五萬 token，平均八萬。

代價是你變成調度員。這套流程要人在切點上判斷「這裡該換手了」。

**怎麼做**：下次做完調查、要開始實作時，不要接著問，開一條新的，只把結論帶過去。

### 三、剪枝：機械式砍掉最肥的那段

Atlassian 的 Rovo Dev 走[另一條路](https://www.atlassian.com/blog/development/rovo-dev-keeps-long-sessions-useful)：不叫模型摘要，直接按規則刪。

他們的設計是一個**級聯**，從最不具破壞性的開始，夠了就停。先砍大型工具輸出，再砍工具輸入，然後才壓 assistant 的回應和中間鷹架，摘要塌縮排在最後。同時保護兩端：開頭有任務框架和限制條件，最近幾輪負責局部連貫性。他們把它總結成一句好記的話——留住任務定義、留住當前工作線，先壓中間那坨肥的。

他們對摘要派的反駁值得完整看：

> 如果 session 裡貴的部分主要是肥大的機器產生文字，第一步通常應該是機械式地剪掉它，而不是花另一次模型呼叫把整個 session 重寫一遍。

機械剪枝是即時的（不用多一次模型呼叫）、免費的、而且保留原始對話結構。相對地，LLM 摘要會把 tool call 的 JSON 改寫成散文，訊息邊界就消失了。而它省下的 token 大部分本來也來自砍掉肥大的工具結果——那剪枝也做得到。

代價是機械的：剪掉就是剪掉，不會被改寫成別的形式留下來。

**怎麼做**：在 `CLAUDE.md` 或 `AGENTS.md` 裡寫下你每天跑的兩三個指令，附上安靜參數（例如 `npx vitest run <file> --reporter=dot`）。這是最省力的剪枝——從源頭不讓四百行進來。

### 四、少載入：需要才拉進來

前三種都在處理「已經進來的東西」。第四種處理「一開始就別進來」。

Cursor 把這個模式叫 [dynamic context discovery](https://cursor.com/blog/dynamic-context-discovery)。五個做法都圍繞同一個原語——**檔案**。長工具輸出寫成檔案讓 agent 自己 `tail`，而不是截斷，因為截斷會掉資料。摘要時把對話歷史也當檔案，agent 發現摘要缺東西可以回頭搜。MCP 工具描述同步成資料夾，前段只留名稱。

他們對最後一項做了 A/B 測試：在有呼叫 MCP 工具的執行中，這個策略讓 agent 總 token 降 46.9%。這是自家測量，他們自己也註明變異數很大，取決於裝了幾個 MCP。

Factory 的 [Deferred Context Engine](https://factory.ai/news/deferred-context-engine) 做同一件事但講得更細，分成三步。discover 在前段只放精簡的能力索引，promote 是要用才載完整 schema，reuse 讓載過的留著。他們的生產遙測顯示，掛了一百個以上工具的 session 平均省下 50.8% 的輸入 token。

Factory 補的一句話很重要：**就算有快取也一樣**。不相關的工具定義仍然佔據模型的工作記憶，模型還是得讀它們，讀到足以判斷它們無關為止。

**怎麼做**：跑一次 `/context`，看看開場就載了什麼。用不到的 MCP server 關掉。

### 五、隔離：讓它在別的 context 裡發生

subagent 的邏輯是：髒活在另一個 context 窗口裡進行，主對話只收結論。要翻一份三千行的 log，這招最划算。

但這一派有個公開的反對者。Cognition 在 2025 年 6 月的 [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) 提出兩條原則。第一，要分享 context，而且要分享**完整的 agent trace**，不是單則訊息。第二，行動隱含決策，而衝突的決策會產生糟糕的結果。

他們的例子很好懂：你要複製一個 Flappy Bird，拆成「做背景和水管」跟「做一隻能上下移動的鳥」。subagent 1 誤會了，做出超級瑪利歐風格的背景；subagent 2 做了隻不像遊戲素材的鳥。就算你把原始任務複製給每一個 subagent 也不夠——它們**看不見彼此在做什麼**，風格還是會撞。

代價還有帳單。依 Anthropic 自己的多 agent 研究系統報告，這種架構的 token 用量可以到一般對話的十五倍。

這篇要標日期。文中說「Claude Code 從不與 subtask agent 平行工作，subtask agent 通常只負責回答問題、不寫程式」，這個觀察在 2026 年已經不成立了。但兩條原則本身還站得住。

**怎麼做**：兩件事要不要平行跑，先問一句「它們需不需要風格一致」。需要就不要平行。

### 六、進模型：這不該是使用者的工作

Cursor 把自我摘要[訓練進 Composer](https://cursor.com/blog/self-summarization)，Cognition 訓了一個專門做快速檢索的 [SWE-grep](https://cognition.com/blog/swe-grep)。Meta 的 [Code World Model](https://ai.meta.com/research/publications/cwm-an-open-weights-llm-for-research-on-code-generation-with-world-models/) 更激進，用 Python 直譯器和 Docker 環境的觀察-動作軌跡做中期訓練，目標是讓模型能逐步模擬程式執行。不用讀，就知道會發生什麼。

這一派的主張是：前面五種都在要求使用者學會管理 context，但這件事本身就是設計失敗。

代價是你等不到。這是模型世代的事，不是你今晚能調的設定。

**怎麼做**：沒有。但它會影響你要不要花力氣建立一套手動流程——如果半年後這些技巧被內建掉，投資就浪費了。

### 七、換單位：不只一個 context

最後一種跳出 context window 本身：與其在一個對話裡管理，不如開好幾個，每個配一個獨立的 git worktree。cmux、Conductor、Orca 這類工具都在做這件事，雲端 agent（Devin、Jules、Codex cloud）則把單位換成 task 和 PR。

代價很誠實：問題從「token 效率」變成「注意力管理」。所以這批工具的功能清單長得都一樣——通知、未讀狀態、sidebar 顯示每個 agent 在幹嘛。它們解的不是 token，是你的注意力。

**怎麼做**：`git worktree add ../myproject-bugfix -b bugfix`，在那裡開第二個 agent。兩個 agent 共用一個工作目錄會互相踩。

## 三場分歧，各自在衡量什麼

上面七種不是七個並列選項，其中有三處是真的互相矛盾。值得看的是矛盾的**根源**。

**第一場：工具 schema 該不該動態載入。** Manus 在 [Context Engineering for AI Agents](https://manus.im/zh-tw/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) 明確反對：不要在迭代中動態增刪工具。理由是前面講過的快取機制。工具定義排在 context 前段，一改就讓後面所有東西重算。而且歷史訊息若引用了現在已不存在的工具，模型會產生幻覺動作。他們的解法是遮蔽 token 機率，用狀態機限制這一步能選哪些工具，工具定義本身不動。

但 Cursor 和 Factory 的整個設計就是動態載入，還帶著 46.9% 和 50.8% 的數字。

這其實**可以調和**，而且調和點就是重點：兩邊都同意前綴必須穩定。Cursor 的做法是把工具描述搬進檔案系統，前段只留穩定不變的名稱索引。實際載入變成附加在**尾端**的一次工具呼叫結果，而尾端是快取的理想位置，因為後面沒東西了。Manus 反對的是「改動前段」，不是「省 token」。這是 2025 年中和 2026 年中的技術差距，不是價值觀對立。

**第二場：錯誤該留還是該剪。** Manus 有一節叫「Keep the Wrong Stuff In」。抹掉失敗就抹掉了證據，模型看到失敗的動作和堆疊追蹤會降低重犯機率。他們甚至認為錯誤復原能力才是真 agent 行為的指標。但 Atlassian 剪枝時第一個砍的就是「大型機器產生的工具輸出」，而失敗的堆疊追蹤正好符合這個描述。

部分可調和（Atlassian 保護最近幾輪，Manus 講的多半是近期失敗），但張力是真的。

**第三場：compact 到底該不該做。** Anthropic 說趁快取還熱時做很便宜，Amp 說它鼓勵壞習慣所以整個拿掉，Atlassian 說它該是最後手段。

三邊都對，因為**它們在衡量不同的東西**：Amp 衡量產出品質，Anthropic 衡量帳單，Atlassian 衡量資訊損失。你該聽誰，取決於你這個下午最痛的是哪一個。

## 這場爭論可以被抽象化

抽象發生在兩個層級。

第一層是詞彙。write / select / compress / isolate 這組詞出自 [LangChain](https://www.langchain.com/blog/context-engineering-for-agents)，是目前這個題目最通用的講法，本站先前的 [Context Engineering 指南](/posts/ai/2026-03-24-context-engineering-guide)有完整拆解。

第二層是 API，而 AWS 的 [Strands Agents SDK](https://strandsagents.com/docs/user-guide/concepts/agents/conversation-management/) 是唯一走到這一步的。它把上述爭論做成三個可以直接抽換的類別：`NullConversationManager`（不動）、`SlidingWindowConversationManager`（滑動視窗，預設）、`SummarizingConversationManager`（摘要）。

幾個細節透露了設計者讀過同樣的爭論。滑動視窗溢位時**優先截斷最舊的工具結果**而非訊息本身——這是 Atlassian 那條原則的程式碼版。兩種管理器都支援 message pinning，可以保護前 N 則不被淘汰——這是「保護開頭」的 API 版。還有 proactive compression：預設在用掉七成視窗時就先壓，而不是等模型回一個 overflow 錯誤才反應。

如果你在自己寫 agent，這份文件比任何一篇部落格都值得先讀——你不用選邊，你可以 import 一個策略。

## 怎麼選

| 情境 | 選什麼 |
|---|---|
| 同一件事還沒做完，只是話變多了 | 剪枝優先於壓縮 |
| 階段轉換（研究完要實作、實作完要 review） | 換手，開新對話 |
| 掛了一堆 MCP 但這次用不到 | 關掉，或用支援延遲載入的工具 |
| 要翻一份很吵的 log | subagent |
| 兩件事彼此獨立、不需要共識 | 平行 worktree |
| 兩件事需要風格一致 | 不要平行 |
| 離開鍵盤前 | 趁快取還熱先壓一次 |

## 沒有人做過那個實驗

寫完這一輪最強的感受不是誰對，是一個空缺。

Chroma 測的是「長 context 會不會壞」，答案是會。各家測的是「我的策略省多少 token」，數字從 15.1% 到 50.8% 都有。但**沒有任何獨立第三方做過這個實驗：同一個任務、同一個模型、只換 context 策略，看哪個真的把事情做完了。**

省 token 不等於做得好。Atlassian 的剪枝和 Amp 的換手可能在不同任務型態上各有勝負，但目前沒有人知道，因為沒人測。學術界在測模型，廠商在測自家產品，中間這一格是空的。

在那之前，最誠實的描述可能來自 Manus。他們把自己摸索的過程叫 Stochastic Graduate Descent——架構亂搜、prompt 亂調、經驗性猜測，agent 框架整個重寫了四次。用他們自己的話說：不優雅，但有效。這個領域現在就是這個狀態，包括那些拿出漂亮數字的家。

## 附錄：方法學數字

正文每個主張只留一個數字，其餘方法學細節收在這裡。

**Chroma Context Rot**：18 個模型（含閉源與開放權重）、8 種輸入長度、11 個 needle 位置、temperature=0，用對齊過的 GPT-4.1 當評分者（與人類判斷一致率 >99%）。LongMemEval 部分篩選出 306 題，完整版平均約 113k token，精簡版平均約 300 token。needle-question 相似度用五個 embedding 模型取平均以求穩健。全部程式碼[開源](https://github.com/chroma-core/context-rot)。

**Cursor**：MCP 動態載入的 A/B 測試，在有呼叫 MCP 工具的執行中總 token 降 46.9%，官方註明統計顯著但變異數大，取決於安裝的 MCP 數量。

**Factory**：五天的生產遙測，對象限定為有觸發 MCP 工具的 session，且是 estimated input token 而非計費帳單。整體平均降 15.1%、p90 降 39.4%；按隱藏工具數分桶後，20–50 個工具的 session 降 21.0%，100 個以上降 50.8%。另有兩個數字：16.6% 的 session 啟動了 MCP server，但只有 5.4% 真的執行過 MCP 工具；他們估算典型企業 stack 約 330 個 MCP 工具、約 47K schema token。

**Anthropic 多 agent 系統**：token 用量可達一般對話的 15 倍，出自其多 agent 研究系統的工程報告，由 LangChain 引用。

**Amp**：作者自陳的一個功能包含 13 條互相引用的 thread，最大一條 151k 輸出 token、四則使用者訊息，平均約 80k。另一篇提到他們最長的一條 thread 被壓縮過 68 次，若不壓縮會超過 2100 萬 token。

以上全部是有商業立場的一方自己測的，Chroma 也不例外——他們賣的就是檢索基礎設施。差別在能不能複現：Chroma 公開了完整實驗設計和程式碼，其餘各家只公開了結論。

## 參考資料

- [Context Rot: How Increasing Input Tokens Impacts LLM Performance — Chroma](https://www.trychroma.com/research/context-rot)（[開源程式碼](https://github.com/chroma-core/context-rot)）
- [Maximizing the value of your Claude Code sessions — Anthropic](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)
- [Handoff (No More Compaction) — Amp](https://ampcode.com/news/handoff)
- [200k Tokens Is Plenty — Amp](https://ampcode.com/notes/200k-tokens-is-plenty)
- [Dynamic context discovery — Cursor](https://cursor.com/blog/dynamic-context-discovery)
- [Training Composer for longer horizons — Cursor](https://cursor.com/blog/self-summarization)
- [Agent Context Pruning: How Rovo Dev keeps long sessions useful — Atlassian](https://www.atlassian.com/blog/development/rovo-dev-keeps-long-sessions-useful)
- [Deferred Context Engine — Factory](https://factory.ai/news/deferred-context-engine)
- [Don't Build Multi-Agents — Cognition](https://cognition.com/blog/dont-build-multi-agents)
- [SWE-grep: RL for Multi-Turn, Fast Context Retrieval — Cognition](https://cognition.com/blog/swe-grep)
- [Context Engineering for AI Agents: Lessons from Building Manus — Manus（繁中版）](https://manus.im/zh-tw/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [Context Engineering — LangChain](https://www.langchain.com/blog/context-engineering-for-agents)
- [Conversation Management — AWS Strands Agents SDK](https://strandsagents.com/docs/user-guide/concepts/agents/conversation-management/)
- [CWM: An Open-Weights LLM for Research on Code Generation with World Models — Meta AI](https://ai.meta.com/research/publications/cwm-an-open-weights-llm-for-research-on-code-generation-with-world-models/)
- [How to Think about Context Engineering in Cline](https://cline.bot/blog/how-to-think-about-context-engineering-in-cline)
- [Context Condensation for More Efficient AI Agents — OpenHands](https://www.openhands.dev/blog/openhands-context-condensensation-for-more-efficient-ai-agents)
- 站內：[Context Engineering：為什麼你的 AI Agent 問題出在資訊，不在模型](/posts/ai/2026-03-24-context-engineering-guide)
