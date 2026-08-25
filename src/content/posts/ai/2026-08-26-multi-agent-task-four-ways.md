---
title: "同一個多 Agent 任務，四種寫法：Omnigent YAML、LangGraph、CrewAI 與 Goose"
date: 2026-08-26
category: ai
type: deep-dive
tags: [multi-agent, omnigent, langgraph, crewai, goose]
lang: zh-TW
tldr: "用同一個 Polly 任務（平行 git worktree + 跨廠商審查）對照四種多 Agent 寫法：Omnigent 以 YAML 在 Server 層治理、LangGraph 以 StateGraph 精準控流程、CrewAI 以角色扮演快速拼裝、Goose 以 Recipe 跑單機自動化，對比 token、延遲與可維護性的真實取捨。"
description: "以 Omnigent 內建 Polly 的平行 worktree 與跨廠商審查為基準任務，實作對照 Omnigent YAML、LangGraph、CrewAI 與 Goose 四種寫法的最小可用程式碼，比較 token 與延遲、治理與可維護性，並給出選型建議。"
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 3
---

> 🌏 [English version](/posts/ai/2026-08-26-multi-agent-task-four-ways-en)

上一篇把 [Omnigent](https://github.com/omnigent-ai/omnigent)（[omnigent.ai](https://omnigent.ai/)）、[Zed ACP](https://agentclientprotocol.com/)、[Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) 與 [Cloudflare Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) 放進四層模型，這篇直接動手：拿 **同一個任務**，用四種技術各寫一次。

基準任務選 [Omnigent 內建的 Polly](https://github.com/omnigent-ai/omnigent/tree/main/examples/polly) 模式——也是本系列最具代表性的多 Agent 協作樣板：**規劃 → 平行 git worktree 委派 → 跨廠商審查 → 彙整合併**。問題敘述固定為：「為 API 加入限流中介層（rate-limit middleware），含測試與文件」。

## 基準任務：Polly Pattern

完整流程與系列第一篇一致：

```
Issue: "Add rate-limit middleware to API"
  │
  ├─ Planner：拆成 3 子任務（middleware / 測試 / 文件）
  ├─ Workers：各自在獨立 git worktree 實作，平行執行
  ├─ Reviewers：每個 diff 由不同廠商模型審查（例如作者用 Claude，審查者用 GPT）
  └─ Aggregator：彙整審查意見，由人決定合併
```

重點在兩個可觀測的協作特性：**平行 worktree 隔離**與**跨廠商審查路由**。這兩點正好能照出四種框架的設計取捨。

## 1. [Omnigent](https://github.com/omnigent-ai/omnigent) YAML — 治理在 Server 層

Polly 的本體是 YAML + Server 層的 Policy 與 Session，價值在「可攜、治理、協作」。

```yaml
# examples/polly/polly.yaml（精簡）
name: polly
prompt: |
  You are Polly, an orchestrator. You do not write code yourself.
  Plan the task, delegate to sub-agents in parallel git worktrees,
  then route each diff to a cross-vendor reviewer.

executor:
  harness: claude-sdk   # 一行切換：claude-native / codex / pi / opencode ...

tools:
  planner:
    type: agent
    prompt: Break the issue into sub-tasks with acceptance criteria.
  worker_claude:
    type: agent
    prompt: Implement one sub-task in an isolated git worktree.
    executor: { harness: claude-sdk }
    tools:
      shell: { type: function, callable: tools.shell.exec }
  worker_codex:
    type: agent
    prompt: Implement one sub-task in an isolated git worktree.
    executor: { harness: codex }
  reviewer_gpt:
    type: agent
    executor: { harness: openai-agents }
    prompt: Review the diff. Approve or request changes with rationale.
  reviewer_claude:
    type: agent
    executor: { harness: claude-sdk }
    prompt: Review the diff. Approve or request changes with rationale.

policies:
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params: { max_cost_usd: 5.00 }
  ask_on_push:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools
```

啟動：`omnigent run examples/polly --harness claude-sdk` 或 `omnigent start` 後在瀏覽器開啟 `http://localhost:6767` 分享 Session 連結。

**設計哲學**：把「編排」寫成宣告式 YAML，把「治理」交給 [Server 層 Policy](https://omnigent.ai/docs/policies/overview)（`allow / deny / ask`）與 [Omnibox 沙盒](https://omnigent.ai/docs/policies/os-sandbox)。跨廠商能力的來源不是 prompt 技巧，而是 sub-agent 各自綁不同 `harness`。

**適合**：團隊已同時用多種 harness、需要分享活的 Session、需要可審計的成本與權限護欄。
**不適合**：單機單一 harness、對 alpha 版本（`0.11.0.dev0`）容忍度低、或 Windows 原生的檔案與網路隔離需求。

## 2. [LangGraph](https://github.com/langchain-ai/langgraph) — 以 StateGraph 精準控流程

[LangGraph](https://langchain-ai.github.io/langgraph/)（[文件](https://langchain-ai.github.io/langgraph/)) 是 LangChain 生態的流程編排框架，核心是 **StateGraph + 條件邊**。平行扇出用 `Send` API，狀態聚合由 reducer 決定。

```python
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from typing import TypedDict, Annotated
import operator

class State(TypedDict):
    issue: str
    plan: list[str]          # planner 產生的子任務
    diffs: Annotated[list[str], operator.add]  # 平行 worker 的 diff 累加
    reviews: Annotated[list[str], operator.add]

def planner(state: State):
    # 呼叫模型把 issue 拆成子任務
    return {"plan": ["middleware", "tests", "docs"]}

def worker(state: dict):
    # state 含單一 sub_task；在獨立 worktree 內執行
    diff = run_in_worktree(state["sub_task"])
    return {"diffs": [diff]}

def fanout(state: State):
    return [Send("worker", {"sub_task": t}) for t in state["plan"]]

def reviewer(state: State):
    # 以不同模型審查每個 diff（此處簡化為單節點，實務可再扇出）
    reviews = [review_with_other_vendor(d) for d in state["diffs"]]
    return {"reviews": reviews}

g = StateGraph(State)
g.add_node("planner", planner)
g.add_node("worker", worker)
g.add_node("reviewer", reviewer)
g.add_edge(START, "planner")
g.add_conditional_edges("planner", fanout, ["worker"])
g.add_edge("worker", "reviewer")
g.add_edge("reviewer", END)
app = g.compile()
app.invoke({"issue": "Add rate-limit middleware", "diffs": [], "reviews": []})
```

**設計哲學**：把流程當圖來寫，每個節點的輸入輸出皆為可觀測的狀態。`Send` 讓「規劃後平行執行 N 個 worker」成為一等公民，適合需要精準控制分支與匯合的場景。

**適合**：流程複雜、需要條件分支與可追蹤狀態、已在 LangChain 生態內。
**不適合**：只想快速拼角色分工、或需要跨 vendor harness 一鍵替換（LangGraph 不抽象 harness，需自行封裝）。

## 3. [CrewAI](https://github.com/crewAIInc/crewAI) — 以角色扮演快速拼裝

[CrewAI](https://crewai.com/)（[文件](https://docs.crewai.com/)）的賣點是**角色、任務、Crew 三件套**，用自然語言定義每個 Agent 的角色與目標，最接近「找一組人來開會」的直覺。

```python
from crewai import Agent, Task, Crew, Process

planner = Agent(role="Planner", goal="Break the issue into sub-tasks",
                backstory="You are a senior planner.", verbose=True)
coder_a = Agent(role="Backend Coder", goal="Implement middleware in worktree A",
                backstory="You write clean Python middleware.")
coder_b = Agent(role="Test Engineer", goal="Add tests in worktree B",
                backstory="You care about coverage.")
reviewer = Agent(role="Reviewer", goal="Cross-vendor review",
                 backstory="You review diffs from a different model family.")

t1 = Task(description="Plan sub-tasks for: {issue}", expected_output="3 sub-tasks", agent=planner)
t2 = Task(description="Implement middleware", expected_output="diff in worktree A", agent=coder_a)
t3 = Task(description="Add tests", expected_output="diff in worktree B", agent=coder_b)
t4 = Task(description="Review all diffs and list blockers", expected_output="review report", agent=reviewer)

crew = Crew(agents=[planner, coder_a, coder_b, reviewer],
            tasks=[t1, t2, t3, t4], process=Process.sequential, verbose=True)
crew.kickoff(inputs={"issue": "Add rate-limit middleware"})
# 需平行 worktree 時，CrewAI 支援 `async_execution=True` 或以 Crew 巢狀呼叫實作
```

**設計哲學**：把寫流程的成本壓到最低，靠角色設定與任務描述驅動分工。平行能力透過 `async_execution` 與工具層的 worktree 封裝達成，但隔離粒度與排程可觀測性不如 LangGraph 或 Omnigent。

**適合**：原型驗證、非工程背景也能讀懂分工、快速示範多 Agent 協作。
**不適合**：需要強隔離 worktree、需要跨廠商模型路由的審計、或流程需精準重現與除錯。

## 4. [Goose](https://github.com/block/goose) — 以 Recipe 跑單機自動化

[Goose](https://block.github.io/goose/)（[官網](https://block.github.io/goose/)）是 Block 開源的桌面 Agent，定位是「單機自動化 + Recipe 可分享」。[Recipe](https://block.github.io/goose/docs/guides/recipes/) 是 YAML 描述的自動化腳本，適合把 Polly 的子步驟收斂為可在桌機一鍵重放的任務。

```yaml
# recipe.yaml
version: 1.0.0
title: polly-rate-limit
description: Plan, parallel worktree, cross-vendor review
prompt: |
  Implement rate-limit middleware for the API.
  Steps: plan sub-tasks, create git worktrees, implement in parallel,
  then review each diff with a different model.
instructions: |
  Use shell tools to create worktrees under .worktrees/,
  run tests in each worktree, and collect diffs.
activities:
  - Plan sub-tasks and write to plan.md
  - Create worktrees: git worktree add .worktrees/a -b feat/rate-limit-a
  - Implement and test in each worktree
  - Review diffs and output report
extensions:
  - type: builtin
    name: developer
    display_name: Developer
    timeout: 300
```

執行：`goose run --recipe recipe.yaml` 或在 Goose 桌面版載入 Recipe。可透過 Goose 的 [MCP 擴充](https://block.github.io/goose/docs/mcp/)掛資料庫、瀏覽器或自定義工具。

**設計哲學**：把自動化當成「可分享的桌面腳本」，強調本機執行與單鍵重放。平行 worktree 由 shell 工具自行建立，跨廠商審查需在 Recipe 內以不同模型設定達成，不如 Omnigent 的 `executor.harness` 宣告式。

**適合**：個人桌機自動化、單人快速驗證、Recipe 形式的團隊分享。
**不適合**：需要 Server 層治理、持久化共享 Session、或雲端 sandbox 每任務隔離。

## 四種寫法並排比較

| 維度 | [Omnigent](https://github.com/omnigent-ai/omnigent) YAML | [LangGraph](https://langchain-ai.github.io/langgraph/) | [CrewAI](https://docs.crewai.com/) | [Goose](https://block.github.io/goose/) |
|---|---|---|---|---|
| 抽象層 | harness 之上的 meta-harness | 單 harness 內的流程圖 | 角色與任務的協作框架 | 單機 Recipe 自動化 |
| 平行 worktree | 原生（Polly 範例） | `Send` 扇出，需自行封裝 git | `async_execution` + 工具封裝 | shell 工具自建 |
| 跨廠商審查 | sub-agent 各綁不同 harness | 自行路由不同模型 | Agent 各配不同 LLM | Recipe 內切模型 |
| 治理 | 三層 Policy + Omnibox 沙盒 | 無內建，需外加 | 無內建 | 本機權限 + 擴充 |
| 可觀測性 | Server 持久 Session + WebSocket 同步 | State 與圖遍歷可追蹤 | 日誌與 verbose 輸出 | 本機日誌與 Recipe 報告 |
| 適用團隊 | 多 harness 團隊、需協作與審計 | 需精準流程控制的工程團隊 | 快速原型與非工程協作 | 個人與小團隊自動化 |

## Token、延遲與可維護性：實務取捨

以下為定性對比，實際數字取決於模型選擇、子任務粒度與工具呼叫次數，建議用同一份 issue 在四種實作上各跑 3 次取平均。

- **Token**：Omnigent 與 LangGraph 因編排開銷相近，總 token 主要由「子任務數 × 每次模型呼叫」決定；CrewAI 的角色 prompt 較長，通常多 10–20% 的系統提示 token；Goose 的 Recipe 指令較精簡，token 最省，但需自行補足審查邏輯時會回升。
- **延遲**：三個 worker 平行時，端到端延遲取決於最慢分支。Omnigent 與 LangGraph 的平行扇出可讓延遲接近 `max(worker)` 而非 `sum(worker)`；CrewAI 在 `Process.sequential` 預設下為序列，需顯式開啟非同步才有同等效果；Goose 的平行度取決於 shell 工具的並行實作。
- **可維護性**：Omnigent 的 YAML 讓「加一個審查者」是一行 `executor.harness` 的改動，治理規則集中在 `policies`；LangGraph 的圖結構讓流程變更可追蹤，但每新增分支就要改節點與邊；CrewAI 新增角色最快，但流程隱含在任務順序，久了易成「角色膨脹」；Goose 的 Recipe 最易讀，但複雜分支與審計需求會讓 YAML 迅速膨脹。

選型建議：

- 已同時用多種 harness 且需要「分享活的 Session」→ 選 [Omnigent](https://github.com/omnigent-ai/omnigent)。
- 流程複雜、需要可重現的條件分支 → 選 [LangGraph](https://langchain-ai.github.io/langgraph/)。
- 要最快讓一組角色動起來 → 選 [CrewAI](https://docs.crewai.com/)。
- 單機自動化、想把成果做成可分享的桌面腳本 → 選 [Goose](https://block.github.io/goose/)。

四者亦可疊加：以 Omnigent 為控制面，底層 worker 用 LangGraph 的圖保證流程正確性，審查角色沿用 CrewAI 的角色描述，個人自動化則以 Goose Recipe 對外分發。

## 整體來說

同一個任務照出四種不同的「省力點」：[Omnigent](https://github.com/omnigent-ai/omnigent) 省的是跨 harness 的治理與協作成本，[LangGraph](https://langchain-ai.github.io/langgraph/) 省的是複雜流程的除錯成本，[CrewAI](https://docs.crewai.com/) 省的是把人找齊的溝通成本，[Goose](https://block.github.io/goose/) 省的是把步驟變成可重放腳本的成本。沒有全贏的解，只有「你現在最痛哪一種成本」的選擇。

下一篇將回到治理細節，深入 Omnibox 的 egress 策略與無憑證（secretless）憑證代理在企業環境的落地。

## 參考資料

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent) / [Polly 範例](https://github.com/omnigent-ai/omnigent/tree/main/examples/polly) / [Agent YAML Spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)
- [Omnibox 沙盒](https://omnigent.ai/docs/policies/os-sandbox) / [Policy 總覽](https://omnigent.ai/docs/policies/overview)
- [LangGraph 文件](https://langchain-ai.github.io/langgraph/) / [LangGraph GitHub](https://github.com/langchain-ai/langgraph)
- [CrewAI 文件](https://docs.crewai.com/) / [CrewAI GitHub](https://github.com/crewAIInc/crewAI)
- [Goose 官網](https://block.github.io/goose/) / [Goose GitHub](https://github.com/block/goose) / [Goose Recipe 指南](https://block.github.io/goose/docs/guides/recipes/)
- [Block/Goose 擴充與 MCP](https://block.github.io/goose/docs/mcp/) / [What Is a Meta-Harness? — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
