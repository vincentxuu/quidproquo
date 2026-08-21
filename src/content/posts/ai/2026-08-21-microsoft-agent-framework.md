---
title: "Microsoft Agent Framework：兩個框架合併之後，AutoGen 這個名字現在指誰"
date: 2026-08-21
category: ai
type: deep-dive
tags: [microsoft-agent-framework, autogen, semantic-kernel, agent, ai-agent, mcp]
lang: zh-TW
tldr: "微軟把 Semantic Kernel 與自家 AutoGen 合併成 Microsoft Agent Framework，2026-04-02 發 1.0 GA（.NET 與 Python，Go 仍是 public preview）。被收編的 autogen-agentchat 停在 2025-09-30 沒再發版；但原作者那側的社群分支 AG2 沒有合併，六天前還在發 1.0.2，而且 `pip install autogen` 裝到的是 AG2 不是微軟。這篇拆解 MAF 的抽象、遷移時程，以及這團名字到底該怎麼讀。"
description: "Microsoft Agent Framework 深入介紹：它如何合併 Semantic Kernel 與 AutoGen、1.0 的功能邊界與預覽功能、Semantic Kernel 的落日時程，以及 AutoGen / AG2 / autogen 套件名的實際歸屬。"
series:
  name: "AI 時代的技術選擇"
  order: 9
draft: false
---

🌏 [English version](/posts/ai/2026-08-21-microsoft-agent-framework-en)

先解決一個實際問題：**你現在打 `pip install autogen`，裝到的不是微軟的東西。**

那個套件名在 AG2 手上，指向 `ag2ai/ag2classic`。微軟自家那條線的套件叫 `autogen-agentchat` 與 `autogen-core`，而它們最後一次發版是 2025 年 9 月 30 日。至於微軟現在真正在推的東西，叫 Microsoft Agent Framework，套件名是 `agent-framework`。

一個名字，三個歸屬。這篇先把它理清楚，再談這個框架本身。

## 合併了什麼

Microsoft Agent Framework（下稱 MAF）2025 年 10 月宣布，2026 年 2 月進 Release Candidate，**2026 年 4 月 2 日發 1.0 GA**，涵蓋 .NET 與 Python 兩個語言。Go 版目前仍是 public preview，官方文件寫明宣告式 agent、RAG、CodeAct 與 functional workflow 都還沒有。

它合併的是微軟自己的兩個專案。官方文件的說法很直接：

> Semantic Kernel 與 AutoGen 開創了 AI agent 與多 agent 協作的概念。Agent Framework 是它們的直接後繼者，由同一批團隊打造⋯⋯簡而言之，Agent Framework 是 Semantic Kernel 與 AutoGen 兩者的下一代。

分工也講得清楚。**AutoGen 貢獻的是單 agent 與多 agent 的簡潔抽象，Semantic Kernel 貢獻的是企業級的那一半**：以 session 為單位的狀態管理、型別安全、filter、telemetry，以及廣泛的模型與 embedding 支援。在兩者之上，MAF 再新增圖結構的 workflow，讓多 agent 的執行路徑可以被明確控制。

## 1.0 裡面有什麼

「1.0」在這裡是有承諾的：官方說這是 production-ready 的版本，API 穩定，並且**往後保證向後相容**。列進 1.0 的功能是已經被實戰驗證過的那些：

- **單 agent 與服務連接器**：第一方連接器涵蓋 Microsoft Foundry、Azure OpenAI、OpenAI、Anthropic Claude、Amazon Bedrock、Google Gemini 與 Ollama
- **Middleware hooks**：在執行的每個階段攔截、轉換、擴充 agent 行為——內容安全過濾、記錄、合規政策，都不必改動 agent 的 prompt
- **記憶與 context provider**：可插拔的後端，支援 Foundry Agent Service 的記憶、Mem0、Redis、Neo4j 或自訂儲存
- **Agent workflows**：圖結構引擎，可以分支、fan out 到平行步驟再收斂；**checkpointing 讓長時間流程在中斷後還能接續**
- **多 agent 協作**：sequential、concurrent、handoff、group chat 與 Magentic-One，全部支援串流、checkpoint、human-in-the-loop 核可與暫停／恢復
- **宣告式 YAML**：把 agent 的指令、工具、記憶設定與協作拓撲寫進版控的 YAML，一個 API 呼叫載入
- **A2A 與 MCP**：MCP 讓 agent 動態發現並呼叫外部工具；A2A 讓跨 runtime 的 agent 協作成為可能（官方註明 A2A 1.0 的支援「即將推出」）

預覽階段的功能另外一批：瀏覽器端的本機除錯器 DevUI、Foundry 託管 agent、AG-UI / CopilotKit / ChatKit 的前端轉接器，還有 Skills。其中一個值得單獨拿出來講：**GitHub Copilot SDK 與 Claude Code SDK 可以直接當成 agent harness 被 MAF 包起來**。這讓一個具備寫程式能力的 agent，能跟其他 agent 並列在同一個多 agent 流程裡。

## 最小可用的樣子

Python 這側，一個 agent 大概長這樣：

```python
# pip install agent-framework
from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential

agent = Agent(
    client=FoundryChatClient(
        project_endpoint="https://your-foundry-service.services.ai.azure.com/api/projects/your-project",
        model="gpt-5.4-mini",
        credential=AzureCliCredential(),
    ),
    name="HelloAgent",
    instructions="You are a friendly assistant. Keep your answers brief.",
)

result = await agent.run("What is the largest city in France?")
```

套件結構值得先知道：`pip install agent-framework` 會裝進核心加上一批常用的供應商套件。核心是 `agent-framework-core`，其餘按供應商拆開（`agent-framework-openai`、`-foundry`、`-mem0`、`-copilotstudio` 等），確定需求之後可以只裝需要的那幾個。但**匯入路徑一律從 `agent_framework` 走**，不隨套件拆分改變。

另外一個從 Semantic Kernel 遷移過來的人會立刻感覺到的差異：SK 為不同服務準備了不同的 agent 類別（`ChatCompletionAgent`、`OpenAIAssistantAgent`、`AzureAIAgent`⋯⋯），MAF 收斂成單一的 `Agent`，只要底層 SDK 實作了對應介面就能接。.NET 那側對應的是 `ChatClientAgent`。額外只留兩個特例：`CopilotStudioAgent` 與 `A2AAgent`。

## 官方自己踩的煞車

文件裡有一句話我認為是整份文件最有價值的：

> 如果你可以寫一個函式來處理這件事，那就寫函式，不要用 AI agent。

同一頁還給了 agent 與 workflow 的分界：任務開放、對話式、需要自主用工具與規劃的用 agent；流程步驟明確、需要控制執行順序、多個 agent 或函式必須協調的用 workflow。

一份框架文件願意先告訴你「多數情況你不需要這個」，比列一百個功能有說服力。

## 遷移有時程

這是選型時最該注意的部分：**Semantic Kernel 的落日是有日期的。**

微軟的承諾是 SK v1.x 會繼續支援「至 MAF 正式 GA 之後至少一年」。MAF 在 2026-04-02 GA，換算下來大約是 **2027 年 4 月**。這段期間 SK 只修重大錯誤與資安問題，新功能絕大多數只會進 MAF。

配套的遷移工具做得比一般的遷移文件積極：除了 Semantic Kernel 與 AutoGen 各自的遷移指南之外，官方還提供**遷移助理**——分析你現有的程式碼，產出逐步的遷移計畫。已有 SK 程式碼的人還有一條相容路徑，`KernelFunction` 可以用 `.as_agent_framework_tool` 轉成 MAF 的工具（需要 `semantic-kernel` 1.38 以上）。

會做到這個程度，通常代表他們真的希望你搬。

## AutoGen 這個名字現在指誰

回到開頭。這團名字實際的歸屬長這樣（2026-08-21 於 PyPI 實查）：

| 套件 | 最新版 | 最後發布 | 誰的 |
|---|---|---|---|
| `agent-framework` | 1.14.0 | 2026-08-14 | 微軟，就是 MAF |
| `autogen-agentchat` / `autogen-core` | 0.7.5 | **2025-09-30** | 微軟的舊 AutoGen |
| `pyautogen` | 0.10.0 | 2025-07-15 | 微軟，`autogen-agentchat` 的 proxy |
| `ag2` | 1.0.2 | **2026-08-15** | Chi Wang 與 Qingyun Wu（`ag2ai/ag2`） |
| `autogen` | 0.14.1rc1 | 2026-06-30 | **也是 AG2 的**，指向 `ag2ai/ag2classic` |

兩件事值得從這張表讀出來。

第一，**微軟那條 AutoGen 確實停了**。`autogen-agentchat` 最後一次發版是 2025-09-30，而 MAF 在隔月宣布——時間點吻合到不需要多解釋。

第二，**AG2 沒有合併**。它由原作者維護，2026-08-15 還發了 1.0.2，比 MAF 的最新版只早一天。它跟微軟是兩條各自活著的線，不是一條線的兩個階段。

實務上的坑就在最後一列：`pip install autogen` 裝到的是 AG2 的 classic 線。你如果照著某篇 2025 年的教學打這行指令，然後對著微軟的文件除錯，會很久都想不通為什麼對不上。

## 誠實面

三件事值得先知道。

**它跟 Azure 的引力很強。** 第一方連接器確實涵蓋 Anthropic、Google、Bedrock、Ollama，不是只能用 Azure。但文件的預設路徑、快速開始的範例、以及託管、記憶、可觀測性、評估這些週邊，都繞著 Microsoft Foundry 打轉。不在 Azure 生態裡的團隊要有心理準備：你用得到核心，但用不到那一半的完整體驗。

**官方對第三方系統的免責寫得很重。** 文件明講：用 MAF 去接任何第三方伺服器、agent、程式碼或非 Azure Direct 的模型，風險自負。那些屬於 Non-Microsoft Products，依其各自的授權條款規範，費用、以及資料是否流出組織的合規與地理邊界，都由你負責。這段話不影響技術判斷，但會影響採購與法遵的討論。

**1.0 的邊界要看清楚。** 真正承諾向後相容的只有上面列的那幾項。DevUI、Foundry 託管、AG-UI 轉接器、Skills、Agent Harness、Copilot 與 Claude Code SDK 整合全都還在預覽，官方明說這些 API 可能依社群回饋而變。押在預覽功能上，押的就不是 1.0 那份穩定承諾。

## 什麼時候該選它

用這個系列的判準看：**採用度這條 MAF 拿不到滿分**——它太新，`agent-framework` 從 2025 年 10 月才開始。但它有一個多數框架沒有的東西：**一個由大廠背書的、寫下日期的長期支援承諾**，以及兩個前身累積的使用者基數。

所以合理的分界是：

- **已經在 Semantic Kernel 或微軟自家 AutoGen 上的**，這題沒得選，只有搬與晚點搬的差別。SK 的支援窗口大約到 2027 年 4 月，遷移助理現在就有。
- **主要跑在 Azure、且是 .NET 團隊的**，MAF 是這個生態裡的預設答案，.NET 那側的 agent 框架本來就沒幾個像樣的選項。
- **Python 團隊、不在 Azure 上的**，就沒有非它不可的理由。這時候要比的是它跟 LangGraph 這類選項的差距，而不是 MAF 本身好不好。
- **想找 AutoGen 的多 agent 協作模式**，先確認你要的是哪一條線。sequential、handoff、group chat、Magentic-One 這些模式 MAF 都收了；但如果你的既有程式碼是 AG2，那是另一個專案，遷移到 MAF 不是升級而是換框架。

## 整體來說

MAF 最值得記住的不是功能表，是它示範了一種**大廠收束自家分裂專案的標準做法**：合併、給日期、附遷移助理、把新功能全部押在新的那一個。從選型的角度，這種做法其實是好消息——它把「該押哪一邊」這個問題替你回答了，代價是你得在窗口內動手。

真正麻煩的是留下來的那個名字。AutoGen 現在同時是一個停更的微軟套件、一個活躍的社群專案、以及一個指向後者的 PyPI 名稱。查資料時先確認年份與歸屬，再決定要不要相信那篇教學。

## 參考資料

- [Microsoft Agent Framework Version 1.0 發布公告](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/)
- [Microsoft Agent Framework Overview（Microsoft Learn）](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [Semantic Kernel 遷移指南](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/)
- [Semantic Kernel and Microsoft Agent Framework（支援時程說明）](https://devblogs.microsoft.com/agent-framework/semantic-kernel-and-microsoft-agent-framework/)
- [Microsoft Agent Framework 進入 Release Candidate](https://devblogs.microsoft.com/foundry/microsoft-agent-framework-reaches-release-candidate/)
- [microsoft/agent-framework（GitHub）](https://github.com/microsoft/agent-framework)
- [ag2ai/ag2（GitHub）](https://github.com/ag2ai/ag2)
- 站內相關：[LangGraph：用圖結構管理 Agent 工作流程](/posts/ai/2026-03-27-langgraph-agent-orchestration)、[MCP（Model Context Protocol）](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration)
