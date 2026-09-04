---
title: "跟成熟 coding agent 學設計（27）：跨 session 記憶——從 explicit remember 到 semantic recall"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 27
tags: [coding-agent, agent-memory, looplane, claude-code, oh-my-pi]
lang: zh-TW
tldr: "omp 與 claude-code 都有跨 session 記憶，其他參考專案主要靠 instruction files。looplane 已落地明確的 remember/list/inject baseline：型別化 JSONL 記憶可跨 session 注入 prompt，但目前只按 scope 與近期排序，還沒有語意檢索、去重、遺忘指令或自動萃取。"
description: "比較成熟 coding agent 的跨 session 記憶，並說明 Looplane 固定 commit 中型別化 JSONL 儲存、scope 過濾與 prompt 注入 baseline。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-cross-session-memory-en)

本篇取證範圍：**omp**（can1357/oh-my-pi）、**claude-code**（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）、**pi**（badlogic/pi-mono）、**opencode**（sst/opencode）、**codex**（openai/codex Rust workspace），對照我自己的 **looplane**。所有引用都在本地 clone 實際讀過。

## 能力問題：每次開工都從零開始

我固定用同一台機器、同一批專案工作，但每次開一個新的 agent session，它都不認得我：不知道我偏好的 commit 格式、不記得上週那個 D1 batch timeout 的解法、還要重新解釋一次專案慣例。session 內的 context 再長，關掉就沒了。

這篇原本記錄的是 Looplane 的空白，現在邊界已往前推一格：`memory.py` 提供 typed JSONL memory，TUI 的 `/remember` 可以明確寫入 user/project preference 或 project fact，native loop 會把相關項目放進 system prompt 的 Known context。它已能跨 session 記住使用者主動交代的事，但還不是五家成熟方案那種語意記憶：沒有 embedding、向量索引、ranking/decay、dedupe、edit/delete 或自動擷取。所以下面比較的重點從「怎麼從零開始」改成「explicit baseline 下一步缺什麼」。

## omp：mnemopi，一個完整的記憶引擎

omp 是五家裡唯一把記憶做成獨立套件的。`oh-my-pi/packages/mnemopi/README.md` 開宗明義：「Local SQLite memory engine」。幾個關鍵設計：

**儲存格式**。`packages/mnemopi/src/types.ts#MemoryRow` 不只存內容，還帶 `importance`、`veracity`（這條記憶是「陳述」、「推論」還是「工具輸出」）、`recall_count`、`last_recalled`、`valid_until`、`superseded_by`。最後這幾個欄位很值得注意：記憶會過期、會被新事實取代，而不是無限堆疊。資料庫預設放在 `src/config.ts#DEFAULT_DATA_DIR` 指定的 `~/.hermes/mnemopi/data`，embedding 預設用本地模型 `BAAI/bge-small-en-v1.5`（`src/config.ts#DEFAULT_EMBEDDING_MODEL`），斷網也能運作。

**可信度加權**。`src/config.ts#VERACITY_WEIGHT_DEFAULTS` 給不同來源的記憶不同權重：自己陳述的最可信，工具輸出打折。召回排序時把這個係數乘進去——這處理的是「agent 曾經搞錯過的事，不該和驗證過的事同權重」。

**檢索**。除了基本 `recall`（`src/core/memory.ts#recall`），還有 `polyphonic-recall.ts#PolyphonicRecallEngine` 做多路混合檢索。

**整併**。`src/core/memory.ts#sleep` 提供離線整併：像人睡覺一樣把短期記憶固化、去重、摘要成情節記憶（episodic tier 在 `types.ts#EpisodicMemoryRow`）。支援 `dryRun` 先預覽再執行。

**接入方式**。omp 把記憶暴露成 agent 工具而非隱形魔法：`packages/coding-agent/src/tools/memory-recall.ts#MemoryRecallTool`、`memory-retain.ts` 的 `retain`（寫入）、`memory-reflect.ts`（反思），讓模型自己決定何時存取。

## claude-code：記憶目錄加定期萃取

反編譯原始碼顯示 claude-code 有兩套互補機制。

**自動記憶目錄（memdir）**。`src/memdir/paths.ts#getAutoMemBase` 解析記憶根目錄，入口是一份 `MEMORY.md`（`memdir.ts#ENTRYPOINT_NAME`），每次啟動注入 system prompt。記憶本體是散落的 Markdown 檔，強制四種型別（`memoryTypes.ts#MEMORY_TYPES`）：user（使用者是誰）、feedback（使用者糾正或肯定過的做法）、project（專案層事實）、reference（外部知識連結）。型別定義旁的註解寫得很誠實：可從程式碼、git 歷史、CLAUDE.md 推導出來的東西**不准存**——記憶層只放推不出來的脈絡。

**檢索是兩段式**。`memoryScan.ts#scanMemoryFiles` 只讀每個檔案的 frontmatter（上限約兩百檔），建出清單後，`findRelevantMemories.ts#findRelevantMemories` 把清單丟給一個小的 Sonnet 側查詢選出最多五條相關記憶，才讀全文。用便宜模型當檢索器，不用 embedding、不用向量庫。

**寫入時機由門檻控制**。`services/SessionMemory/sessionMemoryUtils.ts#DEFAULT_SESSION_MEMORY_CONFIG` 定義了三個門檻：累積約 1 萬 token 才首次初始化、之後每成長 5000 token 且至少隔數次工具呼叫才再萃取。`sessionMemory.ts#shouldExtractMemory` 的實作註解講得很白：token 門檻永遠必要，防止過度萃取；並且偏好在没有工具呼叫的對話空檔動手，避免打斷工作中的 agent。實際萃取跑在 `services/extractMemories/extractMemories.ts#executeExtractMemories`——一個受限權限的子流程，只能寫記憶目錄。

## 其他三家：AGENTS.md 算記憶嗎？

pi、opencode、codex 都沒有自動記憶層，但有近親：專案說明檔。

- **pi**：`pi-mono/packages/coding-agent/src/core/resource-loader.ts#loadProjectContextFiles` 依序找 `AGENTS.override.md`、`AGENTS.md`、`CLAUDE.md` 注入 context。
- **opencode**：`packages/opencode/src/session/instruction.ts` 同時支援全域與專案層級的 AGENTS.md，甚至會退回讀 `~/.claude/CLAUDE.md`。
- **codex**：做得最細，`codex-rs/core/src/context/world_state/agents_md.rs` 把 AGENTS.md 當成有版本的 world state，檔案變更時以 diff 方式通知模型「舊指示已失效」。

誠實討論邊界：這些是**手動記憶**——人類判斷什麼值得記、人類負責維護，寫入迴路的作者是人不是 agent。它解決「跨 session 帶脈絡」，但不解決「agent 自己從經驗中學習」。claude-code 的 memdir 型別註解甚至明確區分了兩者：CLAUDE.md 屬於「可推導」的那側，不該重複進記憶。所以嚴格說，五家裡做出自動記憶的只有兩家，但方向一致：**記憶要型別化、要有寫入節流、檢索要比主模型便宜**。

## 學術依據

這條路線最有名的出發點是 [Generative Agents](https://arxiv.org/abs/2304.03442)（Park et al., 2023）：25 個虛擬小鎮居民共用一條 memory stream，召回時用 recency × importance × relevance 三因子打分，再用 LLM 反思出高階結論。omp 的 importance/veracity 欄位和 claude-code 的定期萃取，都是這套架構的工程化變體。[MemGPT](https://arxiv.org/abs/2310.08560) 則論證了另一面：與其塞向量庫，不如給 agent 明確的分層記憶介面（main context / external storage），讓它自己呼叫存取——omp 把記憶做成 `retain`/`recall` 工具正是這個思路。

## looplane 已落地的 baseline

截至 `2ed5efb`，looplane 不再只有可 resume 的 conversation history。`memory.py` 定義 typed `MemoryEntry`，以 append-only JSONL 寫進使用者層 memory file；`LOOPLANE_MEMORY_PATH` 可覆寫位置。CLI 的 `remember` 入口要求明確指定記憶類型與 scope，避免 agent 在背景自行猜哪些資訊值得永久保存。

新 run 會透過 `relevant_memory_entries()` 先按 scope 過濾，再取近期項目，最後由 `render_known_context()` 產生有長度上限的 known-context 區塊進入 prompt。這個 baseline 的邊界很刻意：使用者明確寫入、檔案格式可檢查、注入內容可預測，也不依賴某個 external backend 自己的 session store。

## 還沒完成的部分

目前的 relevant 只代表 scope 與 recency，不是語意相似度。它沒有 embedding、relevance ranking、decay、相似項去重，也沒有 `/memory forget` 這類可編輯／刪除介面；更不會在 bounded task 結束後自動萃取。looplane 已有跨 session 記憶的安全最小閉環，但離 mnemopi 的 working/episodic consolidation 或 claude-code 的 feedback-derived recall 還有一段距離。

## 參考資料

- [Looplane typed memory store 與 scope retrieval（固定 commit）](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/memory.py)
- [Looplane memory tests（固定 commit）](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_memory.py)

- [can1357/oh-my-pi — packages/mnemopi](https://github.com/can1357/oh-my-pi/tree/main/packages/mnemopi) — SQLite 記憶引擎完整原始碼
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — 官方 repo；本文 memdir／SessionMemory 引用來自社群反編譯 v2.1.88
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — `resource-loader.ts` 的 AGENTS.md 載入
- [sst/opencode](https://github.com/sst/opencode) — `session/instruction.ts`
- [openai/codex](https://github.com/openai/codex) — `codex-rs/core/src/context/world_state/agents_md.rs`
- [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442) — memory stream 與三因子召回
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — 分層記憶介面
- [agents.md](https://agents.md/) — AGENTS.md 慣例的公開規範
