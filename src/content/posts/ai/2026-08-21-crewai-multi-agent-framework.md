---
title: "CrewAI：用角色扮演組織多 Agent 協作的框架"
date: 2026-08-21
category: ai
type: deep-dive
tags: [crewai, ai-agent, multi-agent, framework, python]
lang: zh-TW
tldr: "CrewAI（GitHub 57.4k star，MIT，PyPI 週下載 1,164 萬）用角色（role）、目標（goal）、背景故事（backstory）定義 agent，再把一組 agent 編成 crew 來協作。跟 LangGraph 的圖優先和 MAF 的工作流優先不同，CrewAI 是團隊優先——你不畫節點和邊，你描述一個團隊裡每個人負責什麼。2024 年底完成 LangChain 依賴的全面移除，現在是獨立框架。商業端分開源套件與 AMP 託管平台，AMP 加的是視覺化建構、部署、追蹤與合規。"
description: "深入介紹 CrewAI 的角色導向多 agent 框架：核心抽象（Agent / Task / Crew / Flow）、跟 LangGraph 和 MAF 的心智模型差異、開源與 Enterprise 功能邊界、以及什麼時候該用它。"
series:
  name: "AI 時代的技術選擇"
  order: 19
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-crewai-multi-agent-framework-en)

多 agent 框架的選型，核心問題不是「哪個功能多」，而是「你用什麼心智模型組織 agent 之間的關係」。[LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration) 要你畫圖——節點是執行單元、邊是轉移條件；[Microsoft Agent Framework](/posts/ai/2026-08-21-microsoft-agent-framework) 要你定義工作流——sequential、concurrent、handoff 都是流程控制結構。[CrewAI](https://github.com/crewAIInc/crewAI) 要你做的事不一樣：**描述一個團隊**。

CrewAI 2023 年 12 月由 [João Moura](https://github.com/joaomdmoura) 開源，他之前在 Clearbit（後被 HubSpot 收購）擔任 AI 工程總監。起點是一個替自己寫 LinkedIn 貼文的小 agent，做的過程中他發現：建一個能協作的 agent 團隊不應該這麼難。

2024 年 10 月，CrewAI 拿到 1,800 萬美元融資，由 Boldstart Ventures、Craft Ventures、Insight Partners 領投，Andrew Ng 和 HubSpot 共同創辦人 Dharmesh Shah 個人參投。目前 GitHub 57.4k star、PyPI 週下載約 1,164 萬。

## 一、角色優先的核心模型

CrewAI 的三個核心抽象是 **Agent**、**Task**、**Crew**。不像圖結構框架要你先想清楚節點和邊，CrewAI 要你先想的是：這個任務需要什麼角色的人。

一個 agent 的定義長這樣：

```python
from crewai import Agent

researcher = Agent(
    role="Senior AI Researcher",
    goal="Find the latest breakthroughs in multi-agent systems",
    backstory="You have 10 years of experience in AI research, "
              "specializing in agent coordination and emergent behavior.",
    llm="openai/gpt-4o",
    verbose=True,
)
```

`role`、`goal`、`backstory` 是三個必填欄位。`role` 定義這個 agent 在團隊裡的身分；`goal` 是它的個別目標，會影響它做決策的方向；`backstory` 提供上下文，讓 LLM 知道這個角色的專業背景和行事風格。

這三個欄位最終都會進 system prompt。它的設計假設是：**與其用程式碼精確控制 agent 的每一步行為，不如用自然語言描述它是誰、它在乎什麼，讓 LLM 自己去填入具體行為。** 這跟 LangGraph 用 Python function 定義節點行為、用 conditional edge 控制路徑的做法，是根本上不同的控制粒度。

Task 是你要 agent 做的事：

```python
from crewai import Task

research_task = Task(
    description="Research the top 5 trends in multi-agent AI for 2026. "
                "Focus on production deployments, not academic papers.",
    expected_output="A structured report with trend name, evidence, "
                    "and adoption level for each trend.",
    agent=researcher,
)
```

`expected_output` 是 CrewAI 比較特別的設計——它不只告訴 agent 做什麼，還明確描述做完長什麼樣。這讓框架可以在 agent 產出結果後做驗證（guardrails），也讓下游 task 知道自己會收到什麼格式的輸入。

Crew 把 agent 和 task 組在一起：

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,
    verbose=True,
)

result = crew.kickoff()
```

`Process.sequential` 是預設——task 按順序跑，前一個的輸出自動成為下一個的上下文。另一個選項 `Process.hierarchical` 會多出一個 manager agent，由它決定把哪個 task 分配給誰、什麼時候需要重做。

## 二、三種心智模型的差異

同一個需求——「研究一個主題、寫成報告、最後校對」——在三個框架裡的建模方式完全不同。

**LangGraph：圖優先。** 你定義三個節點（research、write、review），用 edge 連起來，用 conditional edge 決定 review 不通過時要回到哪個節點。狀態是一個在圖上流動的 typed dict。控制權在你手上——你決定每條路徑。

**MAF：工作流優先。** 你用 `AgentGroupChat` 或 sequential/concurrent workflow 把三個 agent 串起來，middleware 攔截每個階段做安全檢查或記錄。你選的是執行模式（sequential、fan-out/fan-in、handoff），框架負責狀態管理和 checkpoint。

**CrewAI：團隊優先。** 你描述三個角色——研究員、寫手、編輯——各自的專長和目標，把任務分配給他們，選 sequential 或 hierarchical 就好。agent 之間的互動（委派、提問）是透過 `allow_delegation=True` 自動發生的，不需要你畫邊。

這不是說 CrewAI 的控制粒度比較粗——而是控制的介面不同。CrewAI 選擇把「agent 之間怎麼互動」的細節交給 LLM，用自然語言（role + goal + backstory）引導行為，而不是用程式碼規定路徑。這在探索性任務上很方便——「研究一下這個領域」用角色描述就夠了。但在需要嚴格流程控制的場景，例如「這個步驟失敗就回到第三步重試，最多兩次」，就不如 LangGraph 的 conditional edge 精確。

## 三、Flows——當 Crew 不夠用的時候

Crew 處理的是「一組 agent 協作完成一批任務」。但真實的應用常常更複雜：先跑普通 Python 程式碼準備資料，交給 crew 處理，再做後處理，最後根據結果決定要不要跑第二個 crew。

[Flows](https://docs.crewai.com/concepts/flows) 就是為這個場景設計的。它是 Crew 之上的編排層，用 Python decorator 定義步驟之間的依賴：

```python
from crewai.flow.flow import Flow, listen, start

class ReportFlow(Flow):
    @start()
    def fetch_data(self):
        # 普通 Python：呼叫 API、讀資料庫
        return api.get_latest_data()

    @listen(fetch_data)
    def analyze(self, data):
        # 交給 crew 處理
        crew = AnalysisCrew()
        return crew.kickoff(inputs={"data": data})

    @listen(analyze)
    def decide_next(self, analysis):
        if analysis.needs_deeper_look:
            return self.deep_dive(analysis)
        return analysis.summary
```

`@start()` 標記入口、`@listen()` 監聽前一步的輸出、`@router()` 做條件分支。Flow 有自己的狀態管理（支援 Pydantic model），也支援 `@persist` 讓狀態在重啟後接續。

Flow 跟 Crew 的分界是：**Crew 管 agent 之間的協作，Flow 管 crew 之間的編排和非 agent 的程式碼。** 如果你只有一組 agent 做一件事，不需要 Flow；如果你有多個 crew 要串接、中間夾普通程式碼、而且需要條件路由，那 Flow 是進入點。

## 四、脫離 LangChain 之後

CrewAI 早期是建在 LangChain 之上的，agent 內部用 LangChain 的 chain 和 tool 抽象。這帶來了 LangChain 生態的好處（大量現成整合），但也繼承了它的問題：啟動慢、抽象層太多、除錯困難、版本衝突。

[PyPI 頁面](https://pypi.org/project/crewai/)上現在寫的是：「Built from scratch, independent of LangChain or any other agent framework.」1.x 版已經完全移除 LangChain 依賴，自己管 LLM 呼叫、工具執行和記憶體。實際效果是啟動更快、import 更輕、除錯時不用穿過 LangChain 的抽象層。

這也意味著 CrewAI 現在跟 LangGraph 是**平行的選擇而不是同一棵樹上的分支**。以前是「用 LangChain 做基礎，LangGraph 管流程，CrewAI 管多 agent」的堆疊關係；現在你要從底層二選一。

## 五、記憶系統

CrewAI 的[記憶系統](https://docs.crewai.com/concepts/memory)在 1.x 做了一次大改：把原本的短期記憶、長期記憶、實體記憶、外部記憶四種類型，收斂成**單一的 `Memory` 類別**。

存入時，LLM 自動分析內容的範疇、分類、重要性；取出時，用一個複合分數決定優先順序：

```
composite = semantic_weight × similarity + recency_weight × decay + importance_weight × importance
```

預設權重是語意相似度 0.5、近期性 0.3、重要性 0.2。記憶按階層式的 scope 組織（類似檔案系統路徑，例如 `/project/alpha`、`/agent/researcher`），查詢時只搜相關分支。

這套設計的優點是使用者不需要手動決定一筆記憶該存短期還是長期——框架自己判斷。缺點是判斷依賴 LLM，每次存取都多一次 LLM 呼叫，增加延遲和成本。

## 六、開源與 Enterprise 的功能邊界

CrewAI 的商業模式是開源核心 + 託管平台。[開源套件](https://pypi.org/project/crewai/)（MIT）包含完整的框架功能：Agent、Task、Crew、Flow、Memory、Tool、Knowledge，可以在任何地方跑。

商業端叫 **AMP**（Agent Management Platform），是託管的雲端平台。它在開源功能之上加了：

| 功能 | 開源 | AMP |
|------|------|-----|
| Agent / Task / Crew / Flow 定義與執行 | 有 | 有 |
| CLI 建專案、本地跑 | 有 | 有 |
| 視覺化 Studio（拖拉式建 crew） | 無 | 有 |
| 一鍵部署（`crewai deploy create`） | 無 | 有 |
| 即時追蹤（每個 agent 的思考、工具呼叫、LLM 完成） | 無 | 有 |
| Guardrails（幻覺偵測、PII 遮罩、成本上限） | 程式碼層有 task guardrails | 完整 UI + 額外檢查 |
| SSO、稽核日誌、SOC 2 Type II | 無 | Enterprise 方案 |
| 資料駐留（data residency） | 自行處理 | Enterprise 方案 |

定價方面，免費方案每月 50 次工作流執行、1 個部署的 crew、1 個使用者。往上有付費方案，Enterprise 需要聯繫銷售。但真正的成本大頭不是平台費——是 LLM token 消耗。CrewAI 要求你自帶 LLM API key，agent 消耗的 token 費用完全另計。

## 七、什麼時候用 CrewAI

**適合的場景：**

- **探索性的多 agent 任務**：「研究→分析→撰寫→校對」這類角色分工明確、每個角色的行為用自然語言就能描述清楚的流程。CrewAI 的 role/goal/backstory 在這裡比寫 Python function 更直覺。
- **快速原型**：從 `crewai create flow` 到跑出第一個結果只需要幾分鐘。如果你想快速驗證「用多個 agent 分工會不會比單一 agent 好」，CrewAI 的腳手架很輕。
- **非工程師也要參與設計 agent 行為**：因為 agent 的核心定義是自然語言（role、goal、backstory），PM 或領域專家可以直接參與調整，不需要改程式碼。

**不適合的場景：**

- **需要嚴格流程控制**：如果你的 agent 流程有「步驟 A 失敗時回到步驟 C，但最多重試兩次，超過就走降級路徑」這種精確邏輯，LangGraph 的 conditional edge 比 CrewAI 的 sequential/hierarchical 更適合。
- **對延遲敏感**：CrewAI 的 delegation 機制和記憶系統都會額外呼叫 LLM，多 agent 的 token 消耗和延遲會倍增。每個 agent 的 `max_iter` 預設 20，表示一個 task 最多可能呼叫 LLM 20 次。
- **需要型別安全的 agent 間通訊**：LangGraph 的狀態是 typed dict，MAF 有 middleware 和 filter——都是程式碼層級的控制。CrewAI 的 agent 間通訊（delegation、ask question）走的是自然語言，你能控制的是 `expected_output` 的文字描述，而不是 Pydantic schema。

**怎麼做**：如果你現在要選多 agent 框架，先問自己一個問題——你的 agent 之間的互動，是用自然語言描述比較自然（「把初稿交給編輯審」），還是用程式碼規定比較自然（「generate 節點的輸出分數低於 0.5 時，回到 retrieve 節點」）。前者選 CrewAI，後者選 LangGraph。需要企業級 middleware、checkpoint、合規，先看 [MAF](/posts/ai/2026-08-21-microsoft-agent-framework)。問題根本不需要多 agent，看看 [LlamaIndex](/posts/ai/2026-08-21-llamaindex-rag-framework) 或直接用模型 API。更完整的框架地圖見[這篇](/posts/ai/2026-04-01-agent-frameworks-2026)。

## 參考資料

- [CrewAI GitHub](https://github.com/crewAIInc/crewAI)
- [CrewAI 官方文件](https://docs.crewai.com/)
- [CrewAI PyPI](https://pypi.org/project/crewai/)
- [CrewAI Agents 概念文件](https://docs.crewai.com/concepts/agents)
- [CrewAI Crews 概念文件](https://docs.crewai.com/concepts/crews)
- [CrewAI Tasks 概念文件](https://docs.crewai.com/concepts/tasks)
- [CrewAI Flows 概念文件](https://docs.crewai.com/concepts/flows)
- [CrewAI Memory 概念文件](https://docs.crewai.com/concepts/memory)
- [CrewAI Collaboration 概念文件](https://docs.crewai.com/concepts/collaboration)
- [CrewAI Wikipedia](https://en.wikipedia.org/wiki/CrewAI)
- [LangGraph：用圖結構管理 Agent 工作流程](/posts/ai/2026-03-27-langgraph-agent-orchestration)
- [Microsoft Agent Framework](/posts/ai/2026-08-21-microsoft-agent-framework)
- [LlamaIndex](/posts/ai/2026-08-21-llamaindex-rag-framework)
- [2026 年 15 個值得關注的 Agent 框架](/posts/ai/2026-04-01-agent-frameworks-2026)
