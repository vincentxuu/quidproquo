---
title: "跟成熟 coding agent 學設計：系列總覽——拆五個專案的原始碼，蓋自己的 agent"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 1
tags: [coding-agent, agent-loop, harness-engineering, looplane, open-source]
lang: zh-TW
tldr: "我在寫自己的 Python coding agent「looplane」，這個系列把 pi、oh-my-pi、opencode、codex、claude-code 五個成熟專案的原始碼逐題對照，也對照 Looplane 現在已經落地的 TUI、外部 CLI runtime、local gateway、usage/OTel/session 工具與 Cloudflare 切片。每篇固定走「設計問題→五家做法→looplane 選擇→學術依據→改善路線」五段，證據一律給到 file#symbol 層級。"
description: "coding agent 設計系列總覽：為什麼自己寫 looplane、五個參考專案（pi、oh-my-pi、opencode、codex、claude-code）各自的定位，以及本系列兩部曲 38 篇的讀法與證據標準。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-design-series-overview-en)

過去半年我在寫一個自己的 coding agent，叫 **looplane**。卡關的次數遠比想像多：agent loop 要怎麼收尾、審批要做到多細、session 斷線怎麼續、小模型亂吐 diff 怎麼擋。每次憑空設計，兩週後就會發現某個開源專案早就踩過同樣的坑。

所以我把流程反過來：先讀五個成熟專案的原始碼，再決定 looplane 怎麼做。讀出心得的東西太多，乾脆寫成系列。這篇是總覽，講清楚三件事：looplane 在解什麼問題、五個參考專案各自是誰、這個系列怎麼讀。

## 為什麼自己寫一個 coding agent

市面上的 coding CLI 已經夠多了，再寫一個的理由只有一個：你想要的能力組合沒有人賣。

我要的是一個 **Python-first** 的 agent：日常可以當互動式 CLI 用，進 CI 或之後丟上 Cloudflare 時，切到一個有界、可稽核的 headless 模式。聽起來簡單，但這句話裡藏著一堆設計決策——工作區要隔離到什麼程度、patch 套用前誰簽核、驗證不過算不算失敗、模型 API 換一家要改多少程式。

looplane 的架構刻意分成兩條平行的執行路徑：

1. **原生 harness**：自己擁有 agent loop、審批、session、工具集、驗證閘門和 model API adapter。
2. **外部 CLI runtime**：明確選定的外部 coding CLI（Claude Code、Codex CLI、OpenCode、Pi、OMP）當 backend，它們跑自己的 loop，但共享 looplane 的對話 UI、工作區安全、patch 稽核和驗證邊界。

關鍵紀律是一條路徑永遠不偽裝成另一條。外部 CLI 就是外部 CLI，不會假裝那是原生實作。這條紀律本身，就是讀了別人的原始碼之後才學會的。

現在的 Looplane 已經不只是早期 Python harness。除了 provider-neutral `ModelProvider` contract、state-first event journaling、`looplane resume`、runtime-first TUI、local model gateway，以及 Worker control plane + Cloudflare Sandbox 的受限部署切片，原生 loop 也已有 allowlist MCP、明確 JSONL 記憶、context pressure 自動壓縮、model fallback、靜態價格表成本估算、ripgrep-backed 搜尋與有界工具批次。這些都是可跑、可測的 baseline；跨 runtime parity、完整 provider 價格覆蓋、hostile-code production hardening 和實際 production traffic 仍未由這些本機實作證明。

## 五個參考專案是誰

五個專案的 shallow clone 都在我的機器上，以下描述是我實際看過頂層結構後寫的，不是官網文案。

### pi（badlogic/pi-mono）

TypeScript monorepo，走極簡路線。`packages/` 底下切成 `agent`（agent loop）、`ai`（provider 層）、`coding-agent`、`tui`、`protocol`、`server`、`session-backends`、`telemetry`、`evals`。它的價值在於小：整個 loop 就是 `pi-mono/packages/agent/src/agent-loop.ts#agentLoop` 一個 exported function，適合當「最小可行 agent」的教科書讀。looplane 的 provider 表就是從 `packages/ai` 的定義衍生來的。

### omp（can1357/oh-my-pi）

pi 的 fork，然後瘋狂加料。TS `packages/` 多出一堆 pi 沒有的東西：`snapcompact`（context 壓縮）、`mnemopi`（跨 session 記憶）、`hashline`（hash 錨定的行編輯）、`catalog`（model 資料庫）、`metaharness`（實驗基礎設施）、`collab-web`（多人協作）。底層熱路徑另外補了 Rust crates：`pi-shell`、`pi-walker`、`pi-ast`。同一個問題先看 pi 的極簡答案、再看 omp 加了什麼，兩代演進本身就是一份設計文件。

### opencode（sst/opencode）

TypeScript，規模完全是另一個量級。engine 在 `packages/core`（session、config、provider、credential），外面掛了 `cli`、`tui`、`desktop`、`server`、`sdk`、`plugin`、`codemode`（工具呼叫編譯成程式批次執行）、`containers` 等三十幾個 package。想看「一個 agent 專案長成一個平台之後」長什麼樣，看它。

### codex（openai/codex）

OpenAI 的官方 CLI，核心在 `codex-rs/`——一個 Rust workspace，crate 數量破百：`core`、`tui`、`apply-patch`、`rollout`（session 錄製）、`mcp-server`、`code-mode-*`，還有一整套安全棧：`sandboxing`（`landlock.rs`、`bwrap.rs` 等）、`linux-sandbox`、`windows-sandbox-rs`、`execpolicy`、`shell-escalation`、`network-proxy`。OS 級沙箱和危險指令攔截，目前公開原始碼裡做得最完整的就是它。

### claude-code（decompiled source）

先誠實講：anthropics/claude-code 的官方 repo 只發布 minified bundle，我手上這份是社群反編譯／重建的 v2.1.88 原始碼。`src/` 底下的 `query.ts`、`tools/`、`services/`、`context/`、`memdir/`、`skills/`、`hooks/` 結構清楚到驚人，symbol 名稱有可能與原版有出入，引用時我會標注這點。它是唯一能看到「產品級 agent 的內部臟器」的材料。

## 這個系列怎麼讀

兩部曲共 38 篇，全部中英雙語。

**第一部「已實作的對照」（24 篇）**：looplane 已經做掉的主題——agent loop 的形狀、workspace 隔離、approval 分級、verification gate、ModelProvider 抽象、retry policy、訂閱 OAuth、外部 CLI 當 backend、edit 工具取捨、沙箱與遠端執行、CLI 人體工學等。每篇都是「五家怎麼做 vs 我怎麼做」的正面對決，包含我做錯的部分。

**第二部「改善路線與落地追蹤」（13 篇）**：這批文章最初從缺口出發，但 Looplane 後來已補上多個 baseline，包括 context 壓縮、明確記憶、native MCP、hooks/skills/plugins、subagent、replay/fork、usage/OTel/成本估算、靜態 model role 路由、IDE/LSP snapshot、有界 code-mode 工具程式，以及 Cloudflare control plane。文章現在同時記錄「已落地到哪」與 remaining gaps；危險指令規則語言、全面 egress 控制、跨 runtime 一致性與 production validation 仍不能寫成完成。

每篇固定五段結構：

1. **設計問題**：這題到底在問什麼、為什麼難。
2. **五家做法**：五個參考專案各自的解法，附原始碼證據。
3. **looplane 的選擇**：我選了什麼、為什麼不同（或為什麼照抄）。
4. **學術依據**：ReAct、SWE-agent、Reflexion 這類論文或技術報告怎麼說，第一次出現就附連結。
5. **改善路線**：還能更好嗎？具體到可以動工。

## 證據標準

這個系列的每個主張都要求 **file#symbol 層級的引用**，格式如 `codex-rs/sandboxing/src/landlock.rs#create_linux_sandbox_command_args_for_permission_profile`——檔案加函式或型別名，不給行號（clone 會更新，行號會漂移）。查不到的就明說查不到，禁止編造。第二部的主題我會在動筆前逐一 grep 五家原始碼確認引用位置；如果某家根本沒做某件事，那也是一個值得寫下來的事實。

順帶一提，這套「先查再寫、證據落盤」的流程本身就是這個系列的方法論：我把自己開發 looplane 時的研究筆記流程，直接搬來當寫作流程。

如果你正在寫自己的 agent、或只是想知道 Claude Code 與 Codex 的引擎蓋底下長什麼樣，這個系列是寫給你的。第一篇正式內容從 agent loop 開始——所有東西的地基。

## 參考資料

- [Looplane README（固定 commit `2ed5efb`）](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/README.md) — 目前能力、兩條 runtime 路徑與安全邊界
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — pi 原始碼，TypeScript monorepo
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — omp 原始碼，pi 的 fork
- [sst/opencode](https://github.com/sst/opencode) — opencode 原始碼
- [openai/codex](https://github.com/openai/codex) — Codex CLI 原始碼，Rust workspace
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — Claude Code 官方 repo（發布 minified bundle）
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — 推理與行動交錯的 agent 基礎範式
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) — agent–電腦介面設計如何影響表現
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) — 以語言回饋做自我反思的 agent 記憶機制
