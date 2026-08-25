---
title: "Hooks／Skills／Plugins：成熟 coding agent 的三層擴展機制"
date: 2026-08-25
category: ai
type: deep-dive
tags: [coding-agent, hooks, skills, plugins, extensibility, claude-code, codex, opencode, rivumi]
lang: zh-TW
series:
  name: "跟成熟 coding agent 學設計"
  order: 31
tldr: "五個成熟 coding agent 都把「使用者要改行為」拆成三層：hooks 攔事件、skills 注入知識、plugins 打包分發。共同規律是——控制流走 hook、知識走 skill、生態走 plugin。rivumi 目前完全沒有擴展點，最小起點是在 AgentRunner 和 ToolExecutor 之間開出 PreToolUse／PostToolUse 兩個事件。"
description: "以五個 coding agent 的原始碼為證，拆解 hooks、skills、plugins 三層擴展機制的設計差異與共同規律，並給 rivumi 的擴展點設計草案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-hooks-skills-plugins-en)

## 能力問題：行為改不掉的 agent 是玩具

rivumi 到目前為止的所有行為都寫死在原始碼裡。想在使用者送出 prompt 前加一段專案慣例？改原始碼。想在每次 Bash 執行後自動跑 formatter？改原始碼。想讓團隊共享一套「部署前檢查清單」讓 agent 自己查？沒有機制。

我如實 grep 過 `~/Projects/rivumi/src/rivumi/`：全專案只有 `external_runner.py` 裡為了隔離而設的 `core.hooksPath=/dev/null`（那是 git 的 hook，不是我們的），和 `models.py` 一個標著「No-op lifecycle hook」的空殼。也就是說，rivumi 沒有任何擴展點。

這在單人玩具階段沒問題，但成熟專案全都過了這一關。五家參考專案給出的答案驚人地一致：**三層擴展**——hooks 管「何時攔」，skills 管「知道什麼」，plugins 管「怎麼打包」。以下逐層看證據。

## 第一層：Hooks——生命週期事件的攔截點

claude-code 的 hook 事件表定義在 `claude-code-source/src/entrypoints/sdk/coreTypes.ts#HOOK_EVENTS`：PreToolUse、PostToolUse、UserPromptSubmit、SessionStart、SessionEnd、Stop、PreCompact、PermissionRequest 等 27 個事件，覆蓋 loop 的每個關鍵節點。真正值得注意的是輸出契約：`claude-code-source/src/types/hooks.ts#syncHookResponseSchema` 規定 hook 可以回傳 `decision: approve/block`、`permissionDecision`、`updatedInput`（直接改寫工具參數）、`additionalContext`（注入對話脈絡），甚至支援 `{async: true}` 回應讓長時間檢查不阻塞主流程。hook 不只是通知，是**可以改變控制流的參與者**。

codex 的做法幾乎同構但更收斂：事件枚舉在 `codex/codex-rs/hooks/src/events/common.rs`（PreToolUse、PermissionRequest、PostToolUse、SessionStart、SessionEnd、SubagentStart、SubagentStop、PreCompact、PostCompact、UserPromptSubmit、Stop），配 regex matcher 篩選工具名。執行面有兩條路：shell command 走 `codex/codex-rs/hooks/src/engine/command_runner.rs#CommandHookRuntime`，MCP 呼叫走同目錄的 `mcp_runner.rs`——同一個事件契約，兩種承載方式。

pi 走的是程序內路線：`pi-mono/packages/coding-agent/src/core/extensions/types.ts#ExtensionAPI` 讓 TypeScript 模組用 `on("session_start")`、`on("session_compact")` 這類事件訂閱掛進生命週期，還能 `registerTool` 註冊新工具。opencode 的 plugin 本質上也是這條路（見第三層）。omp 更進一步，`oh-my-pi/packages/coding-agent/src/extensibility/` 底下 hooks、custom-tools、custom-commands、plugins 各自獨立成模組，是把「擴展面」當成一級公民在維護。

## 第二層：Skills——用描述觸發的惰性載入知識

Skills 解決的是另一個問題：不是「攔截行為」，而是「不用時不佔 context，要用時才出現」。

claude-code 的 skill 載入器 `claude-code-source/src/skills/loadSkillsDir.ts` 解析 SKILL.md 的 frontmatter——name、description、whenToUse，甚至允許 skill 自帶 hooks 和路徑限制。觸發靠描述：模型看到所有已安裝 skill 的 name＋description 清單，判斷相關才讀全文。codex 同構，`codex/codex-rs/skills/src/model.rs#SkillMetadata` 有 `description`、`short_description` 和一個關鍵欄位 `allows_implicit_invocation`——明確區分「模型自己判斷要不要用」和「只能被顯式提及才啟用」兩種信任等級；顯式提及的解析在 `codex/codex-rs/skills/src/selection.rs#collect_explicit_skill_mentions`。omp 除了同樣的 frontmatter 描述機制（`oh-my-pi/packages/coding-agent/src/extensibility/skills.ts`），還多了 `oh-my-pi/packages/coding-agent/src/tools/learn.ts#LearnTool`：agent 在工作中可以把學到的教訓直接寫成新的 managed skill——skill 不是靜態資產，是會成長的。

## 第三層：Plugins——打包與分發的容器

前兩層解決單點能力，plugin 解決生態問題：把多個 hooks、skills、commands、MCP servers 打包成一個可安裝、可版本化的單位。

claude-code 的 plugin 基礎建設最重：`claude-code-source/src/utils/plugins/pluginLoader.ts` 有 `installFromNpm`、`gitClone`、版本化 cache，hooks 掛載走 `loadPluginHooks.ts`。codex 用 manifest 宣告組成：`codex/codex-rs/plugin/src/manifest.rs#PluginManifest` 可以帶 `PluginManifestHooks` 和 `PluginManifestMcpServers`，載入後由 `codex/codex-rs/plugin/src/load_outcome.rs#PluginLoadOutcome` 彙整出 effective 的 skill roots 和 MCP servers——plugin 是純宣告式的內容容器，不是程式。opencode 相反，plugin 就是程式本身：`opencode/packages/plugin/src/index.ts#Plugin` 定義 `type Plugin = (input: PluginInput) => Promise<Hooks>`，一個拿到 client SDK 和 shell 的非同步函式，回傳 `"tool.execute.before"`、`"permission.ask"`、`"chat.headers"` 這類 hook 的實作——in-process、型別安全、能直接操作 runtime。

## 工程依據：為什麼是三層而不是一層

這個分工不是偶然。[Voyager](https://arxiv.org/abs/2305.16291) 在 Minecraft agent 上驗證過：把成功經驗固化成可檢索的 skill library，能持續提升後續任務成功率——skills 的本質就是這個思路的產品化，而「描述觸發、按需載入」則是它在大 context 成本下的必要修正。Anthropic 在 [Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices) 和 [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) 兩篇工程文裡也明確把 hooks 定位成確定性的控制流鉤子、skills 定位成漸進揭露的領域知識——確定性需求歸 hook，語義判斷歸 model，這條線畫得非常清楚。

反過來看失敗案例也有印證：如果只用一層，要嘛什麼都能改（安全惡夢）、要嘛什麼都不能改（回到 rivumi 現狀）。三層各自回答不同問題，混在一起就兩邊都做不好。

## rivumi 設計草案

按依賴順序，分三期：

**第一期：hook 事件匯流排（不做 shell 執行）。** rivumi 已有 `rivumi/loop.py#AgentRunner` 和 `rivumi/tools.py#ToolExecutor` 兩個天然切點。先定義 Python 層的事件協議：`before_tool_use(tool_name, input) -> HookResult`，HookResult 可以放行、否決、改寫 input、附加 context。第一版只支援程序內 Python callback——學 pi 不學 claude-code，因為 rivumi 使用者就是開發者本人，subprocess 隔離的成本可以先欠。事件集從五個開始：SessionStart、UserPromptSubmit、PreToolUse、PostToolUse、Stop，對齊 codex 的收斂集合而非 claude-code 的 27 個。

**第二期：skill 目錄與描述路由。** 讀取 `.rivumi/skills/<name>/SKILL.md`，frontmatter 取 name/description，系統提示只放 name＋description 清單，模型要求時才注入全文。直接抄 codex 的 `allows_implicit_invocation` 語義：預設需要顯式提及才展開，降低 prompt injection 面。這一步不需要任何新依賴，純檔案協議。

**第三期（緩）：plugin 打包。** 等 hook 和 skill 各自穩定後，再考慮把兩者捆成一個目錄格式。rivumi 沒有 marketplace 野心，這一期可能永遠不來——刻意不抄 claude-code 的 npm 安裝鏈。

## 與現有架構的銜接

好訊息是 rivumi 先前的設計正好留了縫：`rivumi/permissions.py#PermissionGuard` 已經是事實上的 PreToolUse 攔截者，hook 系統接上後它只是優先級最高的內建 hook；`rivumi/events.py` 的事件流可以复用為 hook 匯流排的底座；外部 CLI runtime 泛化（OpenCode/Pi/OMP adapter）那套 capability handshake 也意味著——如果宿主 CLI 自己有 hook 系統，rivumi 的 adapter 層可以直接轉譯而不是重複實作。風險最集中的地方是 hook 對工具輸入的改寫權：一旦 hook 能改 `updatedInput`，audit trail 就必須記錄改寫前後的完整 diff，這會牽動 run artifacts 契約，草案第一期先把改寫權限關掉，只留 approve/deny/additionalContext 三種結果，等 audit 面補齊再開。

## 參考資料

- [badlogic/pi-mono — packages/coding-agent/src/core/extensions](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/src/core/extensions)：ExtensionAPI 事件訂閱與工具註冊
- [can1357/oh-my-pi — src/extensibility](https://github.com/can1357/oh-my-pi)：skills／hooks／plugins 分模組維護
- [sst/opencode — packages/plugin](https://github.com/sst/opencode/tree/dev/packages/plugin)：in-process plugin hook 介面
- [openai/codex — codex-rs/hooks 與 codex-rs/skills](https://github.com/openai/codex/tree/main/codex-rs)：Rust 版 hook 引擎與 skill metadata
- [anthropics/claude-code](https://github.com/anthropics/claude-code)：hooks／skills／plugins 官方文件入口（本地取證用 decompiled v2.1.88 源）
- [Claude Code Best Practices — Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-best-practices)：hooks 的定位與工作流
- [Equipping agents for the real world with Agent Skills — Anthropic Engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)：progressive disclosure 設計
- [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)：skill library 對任務成功率的持續增益
