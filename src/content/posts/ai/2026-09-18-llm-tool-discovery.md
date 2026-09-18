---
title: "LLM Agent 工具發現：為什麼 Agent 有工具卻不用，以及怎麼修"
date: 2026-09-18
category: ai
type: deep-dive
tags: [agent-tools, tool-use, prompt-engineering, anthropic, context-engineering, mcp]
lang: zh-TW
tldr: "Agent 有 workspace_browse 工具卻說「找不到檔案」——問題不在工具實作，在工具描述。Anthropic、OpenAI、Google 三家的官方指南都指向同一件事：觸發條件和工作流程要寫在 tool description 裡。一份 2025 年研究發現 97.1% 的 MCP 工具描述有品質問題。"
description: "從一個真實的 AI Agent 不主動使用搜尋工具的案例出發，整理三大供應商官方指南、學術研究與社群實踐，歸納出讓 LLM 可靠地發現和使用工具的四個原則。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-18-llm-tool-discovery-en)

Agent 有能力做一件事，跟 Agent 知道自己能做這件事，是兩回事。

我們的產品 [MaiAgent](https://maiagent.ai) 裡，MaiGPT 的 AI 助理有一組 `workspace_browse` 工具，能搜尋使用者所有可存取的檔案工作區。但使用者說「幫我改 RAG_原理與影響要素.md 檔名」時，Agent 回了一句「找不到檔案，目前沒有掛載任何工作區」就停了——完全沒嘗試用工具搜尋。

工具能力完整，API 沒壞，測試能通過。問題出在哪？

## 這不是個案

依一份 [2025 年分析 MCP 工具生態的研究](https://dev.to/aws-heroes/mcp-tool-design-why-your-ai-agent-is-failing-and-how-to-fix-it-40fc)，**97.1% 的 MCP 工具描述至少有一個品質問題**，超過一半（56%）的描述「目的不明確」。學術界也觀察到類似現象——[Tool-DE](https://www.emergentmind.com/topics/tool-de)（Lu et al., 2025）分析大規模工具生態後發現，**41.6% 的原始工具文件缺乏功能說明或使用情境**。

結果呢？不是工具壞了，而是 Agent 不知道什麼時候該用它。

## 問題根源：工具描述太被動

我們原本的設計分成兩層：

**System prompt（可用性描述）**：
```
You cannot mount or switch a workspace yourself;
offer to help the user find one with workspace_browse
when appropriate.
```

**Tool description（工具描述）**：
```
Browse file workspaces the user has access to.
Actions: "list_workspaces" returns all accessible workspaces...
Use this to help the user find files even when no workspace
is mounted on this conversation.
```

兩邊都有提到 `workspace_browse`，但都太被動——「when appropriate」和「Use this to help」把決定權留給了 Agent 的推理，而 Agent 選擇了「先告訴使用者找不到」。

## 四個原則：三家供應商的共識

研讀 [Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents)、[OpenAI](https://developers.openai.com/api/docs/guides/function-calling) 和 [Google](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/function-calling) 三家的官方指南後，發現它們用不同的措辭講同一件事。

### 1. 觸發條件放在工具描述裡，不是 system prompt

Anthropic 的指南明確建議：

> Think of how you would describe your tool to a new hire — make implicit context explicit.

OpenAI 的 [function calling 文件](https://developers.openai.com/api/docs/guides/function-calling)用了一個更直白的測試：

> Pass the intern test. Can an intern/human correctly use the function given nothing but what you gave the model?

Google 的 [Gemini function calling 指南](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/function-calling)也強調同一點：

> Be extremely clear and specific in your function and parameter descriptions. The model relies on these to choose the correct function and provide appropriate arguments.

三家的共識：**Agent 決定要不要呼叫工具時，讀的是 tool description**。system prompt 是背景知識，tool description 才是行動指南。觸發條件放錯地方，Agent 就不會主動行動。

### 2. 寫明工作流程，不是只列功能

列出三個 action 讓 Agent 自己判斷順序，Agent 很可能只用其中一個，或根本不用。明確的步驟序列消除推理負擔：

```
WORKFLOW:
(1) list_workspaces → 找到相關工作區
(2) list_directory + workspace_id → 看資料夾結構
(3) expand_folder + folder_id → 找到具體檔案
```

這不是限制 Agent 的自由度，是降低它「猜錯該怎麼做」的機率。依 Anthropic 的 [context engineering 文章](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，好的 context 設計像寫給新同事的 onboarding 文件——不假設對方知道流程。

[LangChain 社群的實踐](https://www.digitalapplied.com/blog/langchain-ai-agents-guide-2025)也觀察到同樣的模式：「The docstring is critical — it's how agents decide when to use your tool. Include: what the tool does, when to use it, parameter descriptions, return value format, example use cases.」

### 3. 正面指令勝過單純禁止

「不要說找不到檔案」是禁止語，Agent 理解它的方式是「我知道不該說這句話」，但不一定知道該做什麼。正面指令直接給行動：

| 寫法 | 效果 |
|---|---|
| ❌ 「Do NOT say you cannot find a file」 | Agent 知道不該說，但可能換個方式表達同樣的意思 |
| ✅ 「Your FIRST step is list_workspaces」 | Agent 有明確的第一步行動 |
| ✅✅ 兩者並用 | 正面指令在前，防護語在後 |

OpenAI 的建議同樣偏向正面指令：「Use the system prompt to describe when (and when not) to use each function. Generally, tell the model _exactly_ what to do.」——先說什麼時候用，再說什麼時候不用。

### 4. 加上具體的呼叫範例

依 [Anthropic 的工具定義文件](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools)，`input_examples` 能顯著降低工具選擇和參數填入的錯誤率。OpenAI 也建議「Include examples and edge cases, especially to rectify any recurring failures.」

```json
{
  "action": "list_workspaces"
}
```

```json
{
  "action": "expand_folder",
  "folder_id": "abc-123"
}
```

框架不一定都支援 `input_examples` 欄位，但把範例寫進 description 文字也有類似效果。

## 量化支持：工具數量和描述品質都影響選擇準確度

理論之外，也有量化證據支持這些原則：

- [RAG-MCP](https://huggingface.co/papers/2505.03275)（2025）用語意檢索過濾工具描述，把 prompt token 砍超過 50%，工具選擇準確率從 13.62% 提升到 **43.13%**——三倍以上。這說明「Agent 看到的工具越少越精準」。
- [GitHub Copilot 把工具從 40 個砍到 13 個](https://github.blog/ai-and-ml/github-copilot/how-were-making-github-copilot-smarter-with-fewer-tools/)，benchmark 指標有可測量的改善。[Block 重建 Linear MCP Server 三次](https://engineering.block.xyz/blog/blocks-playbook-for-designing-mcp-servers)，從 30+ 工具降到 2 個。
- 一份針對 MCP 生態的[研究](https://dev.to/aws-heroes/mcp-tool-design-why-your-ai-agent-is-failing-and-how-to-fix-it-40fc)識別出好的 tool description 應包含六個要素：**Purpose**（做什麼）、**Guidelines**（何時和如何用）、**Limitations**（不能做什麼）、**Parameter Explanation**（輸入格式）、**Length**（適當長度）、**Examples**（具體範例）。

## 修正前後對比

**修正前**（tool description）：
```
Browse file workspaces the user has access to.
Actions: "list_workspaces" returns all accessible workspaces;
"list_directory" returns the directory tree of a specific
workspace (provide workspace_id);
"expand_folder" returns files in a specific folder
(provide folder_id).
Use this to help the user find files even when no workspace
is mounted on this conversation.
```

**修正後**：
```
Browse and search file workspaces the user has access to.
WHEN TO USE: whenever the user mentions a file by name,
asks to find/read/modify/rename a file, or references
workspace contents — even if no workspace is mounted on
this conversation.
Your FIRST step is always action="list_workspaces" to
discover available workspaces.
WORKFLOW: (1) list_workspaces → pick the relevant workspace,
(2) list_directory with workspace_id → see the folder tree,
(3) expand_folder with folder_id → find the specific file.
...
IMPORTANT: never tell the user you cannot find a file
without completing this workflow first.
```

差異：觸發條件（WHEN TO USE）、第一步行動、完整流程、防護語——全部在 tool description 裡，一個地方講完。用六要素檢查：Purpose ✅、Guidelines ✅、Limitations（隱含在 workflow 裡）、Parameter Explanation ✅、Length（約 120 字）、Examples（可再加）。

## 適用場景與限制

這套原則適用於「Agent 有工具但不主動用」的情境，常見於：

- 多步驟工具（需要先查再讀再寫）
- 沒有明顯觸發訊號的工具（使用者說「幫我改檔名」，Agent 不一定聯想到要先搜尋）
- 有前置條件的工具（必須先掛載工作區才能讀檔——但其實不用掛載也能瀏覽）

不適用的情況：Agent 呼叫工具但參數填錯（那是 schema 設計問題），或工具本身有 bug。

tool description 也不是越長越好。依我們的經驗，超過 200 字的 description 開始出現 Agent 忽略後半段的情況。把最重要的觸發條件和第一步放在最前面。

## 整體來說

「Agent 有工具但不用」幾乎永遠是 prompt 問題，不是程式問題。而 prompt 的修正位置很關鍵——tool description 是 Agent 做工具選擇決策時的第一手資料，system prompt 是背景知識。三大供應商不約而同地用不同語言表達同一件事：把觸發條件、工作流程、防護語寫在 tool description 裡，像帶一個新同事一樣把隱性知識顯性化。

## 參考資料

- [Writing effective tools for AI agents — Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Effective context engineering for AI agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Define tools — Anthropic Docs](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools)
- [Function calling — OpenAI API Docs](https://developers.openai.com/api/docs/guides/function-calling)
- [Introduction to function calling — Google Cloud / Gemini](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/function-calling)
- [MCP Tool Design: Why Your AI Agent Is Failing — DEV Community](https://dev.to/aws-heroes/mcp-tool-design-why-your-ai-agent-is-failing-and-how-to-fix-it-40fc)
- [RAG-MCP: Mitigating Prompt Bloat in LLM Tool Selection — Hugging Face Papers](https://huggingface.co/papers/2505.03275)
- [Tool-DE: Benchmark for LLM Tool Retrieval — Emergent Mind](https://www.emergentmind.com/topics/tool-de)
- [How we're making GitHub Copilot smarter with fewer tools — GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-were-making-github-copilot-smarter-with-fewer-tools/)
- [Block's playbook for designing MCP servers — Block Engineering](https://engineering.block.xyz/blog/blocks-playbook-for-designing-mcp-servers)
- [LangChain AI Agents: Complete Implementation Guide — Digital Applied](https://www.digitalapplied.com/blog/langchain-ai-agents-guide-2025)
