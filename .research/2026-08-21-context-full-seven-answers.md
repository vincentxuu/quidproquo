# Research Note：coding agent 的「context 滿了怎麼辦」——七種答案

- 日期：2026-08-21
- 狀態：蒐集完成，可餵給 `post` skill
- 目標文章：deep-dive，category `ai`（或 `tech`），lang zh-TW

---

## 研究子問題

1. 長 context 真的會劣化嗎？劣化的形狀是什麼——有對照實驗嗎
2. 成本結構怎麼決定「該不該壓縮」：cache 經濟學
3. 壓縮派主張什麼、代價是什麼
4. 換手派主張什麼、代價是什麼
5. 少載入派（just-in-time / deferred）有沒有可驗證數字
6. 剪枝派與隔離派——Cognition 反對 multi-agent 的論證撐得住嗎
7. 這七條路線能不能被一個框架統一描述

---

## 事實交叉表

| # | 事實 | 來源 | 狀態 |
|---|---|---|---|
| F1 | 18 個模型，**固定任務難度、只變輸入長度**，表現一致衰退 | Chroma（一手 + 開源 codebase） | ✅ 可複現 |
| F2 | LongMemEval：focused prompt ~300 tokens vs full ~113k tokens，全模型 focused 明顯勝出 | Chroma | ✅ |
| F3 | 連「原樣複製重複詞」這種瑣事，都隨長度出現非均勻失敗（含拒答、反問、亂碼） | Chroma | ✅ |
| F4 | Claude 家族 focused/full 落差最大，主因是**面對歧義時傾向棄答** | Chroma | ✅ |
| F5 | NIAH 只測詞彙檢索，導致「長 context 已解決」的錯覺 | Chroma、NoLiMa、AbsenceBench | ✅ 多源 |
| F6 | cached input ≈ uncached 的 1/10（Claude Sonnet $0.30 vs $3/MTok） | Manus、Anthropic（0.1x） | ✅ 兩源 |
| F7 | output token 價格約 input 的 5x | Anthropic | ✅ |
| F8 | prefix 差一個 token，該點之後的 cache 全部失效 | Manus、Anthropic、xAI docs | ✅ 三源 |
| F9 | Cursor MCP 動態載入 A/B test：**呼叫過 MCP 的 run，agent 總 token 降 46.9%** | Cursor（自家 A/B，標註 statistically significant、high variance） | ⚠️ 單源自家 |
| F10 | Factory deferred context：平均降 **15.1%**、p90 **39.4%**、100+ 隱藏工具的 session **50.8%**、20–50 工具 **21.0%** | Factory（自家生產遙測，且是 estimated input tokens） | ⚠️ 單源自家 |
| F11 | Factory 遙測：16.6% 的 session 啟動了 MCP server，但只有 **5.4%** 真的執行過 MCP 工具 | Factory | ⚠️ 單源 |
| F12 | 典型企業 MCP stack ≈ 330 個工具 ≈ **47K schema tokens** | Factory（估算） | ⚠️ 單源估算 |
| F13 | Anthropic multi-agent researcher 用到 chat 的 **15×** token | LangChain 引 Anthropic 一手 | ✅ |
| F14 | Manus 平均 input:output ≈ **100:1** | Manus | ⚠️ 單源自陳 |
| F15 | Amp 團隊實例：一個 feature = 13 條 thread，最大 151k，平均約 80k | Amp | ⚠️ 單源自陳 |
| F16 | Amp 最長 thread 被 compact 過 68 次；不壓縮的話超過 2100 萬 token | Amp | ⚠️ 單源 |
| F17 | 對工具描述做 RAG 可讓工具選擇準確度提升 **3 倍** | LangChain 引 arXiv:2505.03275 | ⚠️ 二手引論文，未讀原文 |
| F18 | Claude Code auto-compact 在超過 **95%** context 後觸發 | LangChain 引 Anthropic docs（2025 當時） | ⚠️ 可能已過時 |

### ❌ 衝突（不選邊，這是文章的核心）

**C1｜工具 schema 該不該動態載入**

- **Manus**：「除非絕對必要，避免在迭代中動態增刪工具。」兩個理由：(a) 工具定義位於 context 前段，一改就讓後面所有 action 與 observation 的 KV-cache 失效；(b) 歷史訊息若引用了現在已不存在的工具，模型會產生 schema 違規或幻覺動作。他們的解法是 **mask logits，不是移除**（用狀態機約束可選動作，工具定義本身不動）。
- **Cursor / Factory**：工具 schema 就是該按需載入。Cursor 有 46.9% 的 A/B 數字，Factory 有 15.1%/50.8% 的生產遙測。

**調和點（文章要講的關鍵）**：兩邊其實都同意「前綴必須穩定」。分歧在做法——Cursor 把工具描述同步成**檔案**，前段只留穩定的名稱索引，實際載入變成附加在**尾端**的 tool result；Factory 的 discover / promote / reuse 也是同一招。Manus 反對的是「改動前段」，不是「省 token」。這是 2025 年中與 2026 年中的技術差距，不是價值觀衝突。

**C2｜錯誤該留還是該剪**

- **Manus**：「Keep the Wrong Stuff In」。抹掉失敗就抹掉了證據，模型看到失敗的 action 與 stack trace 會隱性更新信念、降低重犯機率。他們認為**錯誤復原能力才是真 agent 行為的指標**。
- **Atlassian Rovo Dev**：剪枝時優先砍「大型機器產生的工具輸出」——而失敗的 stack trace 正好符合這個描述。

部分可調和（Atlassian 保護頭尾、砍中間；Manus 講的是近期失敗），但張力是真的。

**C3｜compact 到底該不該做**

- **Amp**：直接把 compaction 從產品裡拿掉。理由不只是有損，更是**「compaction 鼓勵冗長漫遊的 thread——你只是在 context 用完時壓一下，然後把摘要疊在摘要上」**。
- **Anthropic**：`/compact` 趁 cache 還熱時做很便宜，離開鍵盤前先壓一次。
- **Atlassian**：摘要塌縮是**最後手段**，不是預設。

分歧的根源是**在衡量什麼**：Amp 衡量產出品質，Anthropic 衡量帳單，Atlassian 衡量資訊損失。三邊都對，只是目標函數不同。

### ⚠️ 時效性註記

- Cognition 那篇（2025-06）說「Claude Code 從不與 subtask agent 平行工作，subtask agent 通常只負責回答問題，不寫程式」——**2026 年已不成立**（agent teams、平行 subagent 都有了）。引用時必須標日期。
- Amp handoff 發表於 **2025-10-23**；200k 那篇寫於 Opus 4.5 剛出時（2025 冬）。
- LangChain 那篇 2025-07-02，Manus 2025-07-18，Chroma 2025-07-14 —— 2025 年 7 月是這個題目的密集期。

---

## 核心概念：它在解什麼問題

不是「context window 不夠大」。Chroma 證明的是：**即使塞得下，塞滿也會變差**，而且是在任務難度完全固定的對照條件下。所以問題不是容量，是**訊噪比**。

Amp 的話最白：「你餵太多 token，agent 會醉。」Chroma 的話最嚴謹：「相關資訊是否在 context 裡並非全部；更重要的是它**如何被呈現**。」

同時，成本結構讓這件事有第二層：每一輪都要重送整個對話，所以任何進到 context 的東西都是**複利**的——它不是被算一次，是被算到 session 結束為止。

---

## 七種答案（文章骨架）

以 LangChain 的 **write / select / compress / isolate** 當座標系，但要指出它蓋不住第 6、7 種（那兩種發生在 harness 之外）。

### 1. 壓縮（compress）
Claude Code `/compact`、Cline `/smol`、Kilo、OpenHands condenser、Strands `SummarizingConversationManager`。
- **賭注**：摘要夠好，而且趁 cache 還熱時做很便宜。
- **代價**：有損，且會累積——摘要的摘要。Amp 說這還會**鼓勵壞習慣**（讓你放任 thread 漫遊）。
- 可驗證：OpenHands 宣稱每輪 API 成本降 2x 且 SWE 任務表現持平或更好（開源可驗）。

### 2. 換手（isolate，但由人決定帶什麼走）
Amp `/handoff`、Cline `/newtask`。
- **關鍵設計**：handoff 要你**先講下一步的目標**，再由模型依這個目標從舊 thread 抽取。摘要是「回顧」，handoff 是「前瞻」。而且產出的 prompt 是草稿，你可以改。
- **賭注**：有損壓縮不可信，讓人在切點上決定帶什麼走。
- **代價**：你變成 orchestrator。Amp 那個「13 條 thread 組成一個 feature」的工作流，管理成本是實打實的。

### 3. 剪枝（compress，但機械式）
Atlassian Rovo Dev。
- **關鍵設計**：**級聯**，從最不具破壞性開始，夠了就停。先砍大型工具輸出 → 再砍工具輸入 → 再壓 assistant 回應 → 中間鷹架 → 最後才是摘要塌縮。
- **保護「兩端」**：開頭（任務框架、限制條件）和最近幾輪（局部連貫性）。**「留住任務定義、留住當前工作線，先壓中間那坨肥的。」**
- **對摘要的正面反駁**（有張對照表）：結構化剪枝是**即時的**（不用多一次模型呼叫）、**免費的**、且**保留原始對話結構**。LLM compaction 會把 tool call JSON 改寫成散文，訊息邊界消失，而且「大部分 token 節省本來就來自砍掉肥大的工具結果——那剪枝也做得到」。
- 他們的結論句很好用：**「如果 session 裡貴的部分主要是肥大的機器產生文字，第一步應該是機械式剪掉它，而不是花另一次模型呼叫把整個 session 重寫一遍。」**

### 4. 少載入（select，前置）
Cursor dynamic context discovery、Factory Deferred Context Engine、Anthropic 的 just-in-time。
- **關鍵設計（Cursor 五招）**：長工具輸出寫成**檔案**讓 agent 自己 `tail`（而非截斷，截斷會掉資料）；摘要時把**對話歷史也當檔案**，agent 發現摘要缺東西可以回頭搜；Skills 只在前段放名稱與描述；MCP 工具描述同步成資料夾；終端機輸出同步到檔案系統。
- **關鍵設計（Factory）**：discover（精簡能力索引）→ promote（要用才載完整 schema）→ reuse（載過的留著、常用的留在快取）。
- **可驗證數字**：Cursor 46.9%（F9）、Factory 15.1%/39.4%/50.8%（F10）。**這是整個題目上最硬的兩組數字**，但都是自家測量。
- **Factory 補的一刀很重要**：就算有 prompt caching，「不相關的工具定義仍然佔據模型的工作記憶——模型還是得處理它們到足以判斷它們無關的程度」。三個失效模式：注意力稀釋、工具選擇雜訊、更早觸發壓縮。
- **代價 / 反對意見**：見 C1（Manus 的 KV-cache 論證）。

### 5. 隔離到 subagent（isolate）
Anthropic subagent、Amp subagent、HuggingFace CodeAgent 沙箱、LangGraph state。
- **賭注**：髒活在另一個 context 裡發生，主 session 只收結論。
- **代價**：token 用量可能是 15×（F13）；而且主 session 只拿得到它願意回報的東西。
- **Cognition 的反對（2025-06）**：兩條原則——(1) 分享 context，而且要分享**完整 agent trace**，不是單則訊息；(2) **行動隱含決策，衝突的決策產生糟糕的結果**。Flappy Bird 例子：subagent 1 做成超級瑪利歐風格的背景，subagent 2 做了隻不像遊戲素材的鳥，主 agent 只能收拾。就算把原始任務複製給每個 subagent 也不夠——它們**看不見彼此在做什麼**，風格還是會不一致。
- Cognition 的建議架構：預設用**單執行緒線性 agent**；真的太長就加一個**專門做壓縮的模型**（他們真的 fine-tune 了一個）。

### 6. 換模型來解（超出 harness）
Cursor Composer 自我摘要、Cognition SWE-grep、Meta CWM。
- 主張：context 管理不該是使用者的工作，也不該只是 harness 的工作，該進權重。

### 7. 換單位來解（超出 context window）
worktree + 平行 agent（cmux、Conductor、Orca）；雲端 agent 把單位換成 task/PR。
- 主張：與其在一個 context 裡管理，不如開 N 個，每個配一個隔離的工作目錄。
- **代價**：問題從「token 效率」變成「注意力管理」——所以這批工具的功能清單長得都一樣（通知、未讀、sidebar）。

---

## 抽象層：能不能統一描述

**LangChain 的四動作**（2025-07）：write（存到 context 外）/ select（拉進來）/ compress（只留必要的 token）/ isolate（拆開）。座標系好用，但：
- 蓋得住 1–5
- 蓋不住 6（改模型）和 7（改單位）——因為那兩個不在 harness 層

**AWS Strands** 則把這件事做成**可插拔的具名介面**，是唯一把爭論變成 API 的：
- `NullConversationManager`（不動）
- `SlidingWindowConversationManager`（預設；含 dangling message 清理、溢位時**優先截斷最舊的工具結果**而非訊息本身、文字保頭尾並插入 `<truncated chars="N"/>`、圖片影片換成 typed placeholder、保留 `status`/`error` 欄位）
- `SummarizingConversationManager`（`summaryRatio` 預設 0.3、`preserveRecentMessages` 預設 10、可用便宜模型跑摘要）
- 兩者共通：**Message Pinning**（`pinFirst` 保護前 N 則不被淘汰——就是 Atlassian「保護開頭」的 API 版）
- **Proactive Compression**：預設閾值 0.7，在模型呼叫**之前**估算就先壓，而不是等 overflow 錯誤回來才反應。連工具呼叫迴圈中間都會觸發。
- Token 估算是**字元啟發式**（文字 ÷4、JSON ÷2）+ 讀上一則 assistant 訊息的 usage metadata 做增量。

Strands 值得單獨講一段：它證明了這場爭論**可以被抽象化**。你不用選邊，你可以 `import` 一個策略。

---

## 適合 / 不適合

| 情境 | 選什麼 |
|---|---|
| 同一件事還沒做完，只是話變多 | 剪枝 > 壓縮 |
| 階段轉換（研究完要實作、實作完要 review） | 換手 / 開新 thread |
| 掛了一堆 MCP，但這次用不到 | 少載入（或手動 `/mcp` 關掉） |
| 要跑一份很吵的 log | subagent |
| 兩個彼此獨立、不需要共識的任務 | 平行 worktree |
| 兩個需要風格一致的任務 | **不要**平行（Cognition 原則 2） |
| 離開鍵盤前 | 趁 cache 還熱先壓（Anthropic） |

---

## 限制 / 已知問題

- 除了 Chroma，**幾乎所有數字都是廠商自家測量**，而且多半是為了支持自家產品發表的。Cursor 46.9% 和 Factory 15.1% 都值得打折看。
- Factory 的節省是 **estimated** input tokens，不是計費帳單。
- 沒有任何獨立第三方做過「同一個任務、同一個模型、換不同 context 策略」的對照實驗。**這是整個領域的空缺**，也是文章該點出的。
- 學術界（Chroma、Berkeley、Stanford）在測「長 context 會不會壞」；廠商在測「我的策略省多少」。**沒有人測「哪個策略在真實任務上贏」**。

---

## 取捨總結（文章的收尾）

七種答案不是七個選項，是**兩個層次上的三種立場**：

1. **在 context 裡解決**：壓縮、剪枝、少載入 —— 賭「留下對的東西就夠了」
2. **換一個 context**：換手、subagent —— 賭「有損壓縮不可信，不如重開」
3. **換掉問題本身**：進模型、換單位 —— 賭「這不該是使用者的工作」

而 Chroma 的結論同時支持這三種，因為它證明的只是「塞滿會壞」，沒說該怎麼辦。

最誠實的一句話留給 Manus：他們把自己摸索的過程叫 **"Stochastic Graduate Descent"**——架構亂搜、prompt 亂調、經驗性猜測，agent 框架重寫了四次。「不優雅，但有效。」這個領域現在就是這個狀態。

---

## 草稿骨架（給 post skill）

1. **開場**：不是 context window 不夠大——Chroma 的對照實驗（固定難度、只變長度）
2. **成本那一層**：為什麼 context 是複利的（每輪重送 + cache 經濟學）
3. **七種答案**，每種：主張 / 可驗證數字 / 賭注 / 代價
4. **三場真實的分歧**（C1 工具動態載入、C2 錯誤留不留、C3 compact 該不該做）——不選邊，講清楚各自在衡量什麼
5. **抽象層**：LangChain 四動作蓋得住五種、蓋不住兩種；Strands 把爭論變成 API
6. **實務對照表**：什麼情況選什麼
7. **收尾**：沒有人做過對照實驗 + Stochastic Graduate Descent

---

## 來源清單（全部已完整讀取）

- Chroma, *Context Rot: How Increasing Input Tokens Impacts LLM Performance*, 2025-07-14 — https://www.trychroma.com/research/context-rot（[codebase](https://github.com/chroma-core/context-rot)）
- Anthropic, *Maximizing the value of your Claude Code sessions*, 2026-08-14, Lydia Hallie — https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions
- Amp, *Handoff (No More Compaction)*, 2025-10-23 — https://ampcode.com/news/handoff
- Amp, *200k Tokens Is Plenty* — https://ampcode.com/notes/200k-tokens-is-plenty
- Cursor, *Dynamic context discovery*, 2026-01-06, Jediah Katz — https://cursor.com/blog/dynamic-context-discovery
- Cognition, *Don't Build Multi-Agents*, 2025-06-12, Walden Yan — https://cognition.com/blog/dont-build-multi-agents
- Manus, *Context Engineering for AI Agents: Lessons from Building Manus*, 2025-07-18, Yichao 'Peak' Ji — https://manus.im/en/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus（有[繁中版](https://manus.im/zh-tw/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)）
- Factory, *Deferred Context Engine*, 2026-05-20, Shashank Sharma — https://factory.ai/news/deferred-context-engine
- LangChain, *Context Engineering*, 2025-07-02 — https://www.langchain.com/blog/context-engineering-for-agents
- Atlassian, *Agent Context Pruning: How Rovo Dev keeps long sessions useful*, 2026-03-30, Tim Esler — https://www.atlassian.com/blog/development/rovo-dev-keeps-long-sessions-useful
- AWS Strands Agents, *Conversation Management* — https://strandsagents.com/docs/user-guide/concepts/agents/conversation-management/

### 次要來源（前幾輪搜集，摘要層級，引用需再查證）

Cline context engineering、OpenHands condenser、Kilo Code compaction、Cursor self-summarization、Cognition SWE-grep、Meta CWM、xAI prompt caching、Amp read-bigger-threads、Simon Willison / Armin Ronacher / 宝玉
