---
title: "Agentic / Reasoning RAG：從 Search-R1 的 RL 多輪搜索到 Deep Research 與 MCP 的推理×檢索新範式"
date: 2026-08-25
category: ai
type: deep-dive
tags: [rag, agentic-rag, reasoning, reinforcement-learning, mcp, search-r1]
lang: zh-TW
tldr: "2025 年的 RAG 不再是「檢一次、生成一次」。Search-R1 用 RL 讓模型在推理中自主多輪搜索，REX-RAG/AlignRAG 補上策略與對齊的分支，OpenAI Deep Research 把整條鏈產品化，MCP 則把檢索泛化為統一的工具調用。本文拆開設計哲學、與舊世代的取捨、以及何時該用這套新範式。"
description: "拆解 2025 年 Agentic/Reasoning RAG 新範式：Search-R1 的 RL 多輪搜索、REX-RAG/GTA-RAG/Interact-RAG/AlignRAG 分支、OpenAI Deep Research 的產品化與 MCP 協議的工具泛化，含設計哲學、與十代 RAG 的比較、適用情境與 LangGraph + MCP 程式範例。"
draft: false
series:
  name: "RAG 技法大全"
  order: 46
---

> 🌏 [English version](/posts/ai/2026-08-25-agentic-reasoning-rag-en)

2025 年前的 RAG 是單次管線：query 進來，檢索一次，生成一次，結束。2025 年後的新集群把這個假設推翻了：模型在**推理的過程中自主決定何時搜、搜什麼、怎麼用結果**，並用強化學習訓練出這套決策。這篇文章把這次範式遷移拆開——它為什麼發生、技術起點是什麼、產品與協議層如何落地、以及它跟你手上的十代 RAG 怎麼取捨。

讀完你會得到：一張不再以 Gen 11 硬編號的「Agentic Era」分界圖，一份 Search-R1 家族的選型對照，以及一個可直接貼進 LangGraph 的 MCP 工具調用骨架，讓你判斷專案是否真的需要多輪推理×檢索。

## 什麼是 Agentic / Reasoning RAG

Agentic / Reasoning RAG 的核心概念是**推理與檢索的雙向交織**，而非「先檢索再推理」的單向管線。兩份 2025 年獨立綜述把它定義為新範式：[Towards Agentic RAG with Deep Reasoning](https://arxiv.org/abs/2507.09477) 稱為 *Synergized RAG-Reasoning*（三類：Reasoning-Enhanced RAG / RAG-Enhanced Reasoning / 兩者交織的 Agentic 迭代），[Reasoning RAG via System 1 or System 2](https://arxiv.org/abs/2506.10408) 則以 System 1/2 區分 *predefined reasoning* 與 *agentic reasoning*，直指工具協調與架構設計的差異。兩份綜述的劃界一致：這不是 Gen 8/9 的細分，而是檢索從「黑盒查詢」變成「可被模型操縱的推理步驟」。

設計哲學上，它捨棄「固定流程可預測」的優點，換取「模型自主探索」的覆蓋率。代價是延遲、成本與可觀測性的全面上升——每多一輪就是一次 LLM 調用 + 檢索 + 工具執行，錯誤也會跨輪累積。限制在這裡就很清楚：若你的問題一次檢索就能回答（事實型、單文件問答），這套範式的額外輪次只會增加不確定性；[Agent-Orchestrated Adaptive RAG 的對比研究](https://arxiv.org/abs/2606.05658)也顯示，query decomposition 在結構化域有提升但在多跳任務上可能降 ranking precision，reflection 提 citation 精度但伴隨高延遲——是否採用取決於問題是否真的需要跨工具、多步推理。

## 技術起點：Search-R1 與 2025 分支

起點是 [Search-R1](https://arxiv.org/abs/2503.09516)（2025-03-12 v1 → 2025-08-05 v5）。它用 RL 訓練 LLM 在逐步推理中自主產生多次搜索查詢，關鍵技巧是 retrieved token masking（檢索回來的 token 不進梯度）與 outcome reward，讓 Qwen2.5-7B 較 RAG baseline 提升顯著，Qwen2.5-3B 亦有提升。論文的價值不在某個百分比，而在證明「多輪檢索×推理交織」可以用 outcome reward 直接訓練出來，不需要人工設計固定的檢索時機。

2025 年的四個分支補齊不同短板。 [REX-RAG](https://arxiv.org/abs/2508.08149) 針對 RL 搜索智能體的 dead-end 問題，提出 Mixed Sampling + Importance Sampling Policy Correction，在 7 個 QA 任務上較強基線有數個百分點的平均提升。[GTA-RAG](https://arxiv.org/abs/2608.22479)（EMNLP 2026）從 entity-document graph 採樣可執行軌跡，以 GRPO + trajectory-guided reward 同時優化答案與證據鏈覆蓋，是 Graph 與 Agentic 的交叉。[Interact-RAG](https://arxiv.org/abs/2510.27566) 推翻「檢索即黑盒」假設，提供 Corpus Interaction Engine 讓 agent 操作索引、過濾與重排，並以 SFT+RL 端到端訓練。[AlignRAG](https://arxiv.org/abs/2504.14858)（NeurIPS 2025）定義 *Reasoning Misalignment*，訓練 retrieval-augmented Critic LM 以 contrastive critique 在測試時迭代對齊推理與證據，8B Critic 甚至超越 72B 模型的對齊效果。

與替代方案比較：相較於 [Self-RAG](https://arxiv.org/abs/2310.11511) 的單模型 reflection token（Gen 8 核心，2023），這批工作把「是否檢索」的二元決策擴展為「檢索策略的連續控制」；相較於 [Adaptive-RAG](https://arxiv.org/abs/2403.14403) 的三檔路由（No/Single/Multi-step），它們不再預設檔位，而是讓策略在 RL 中湧現。適合的情境是開放域多跳、需跨文件綜合、或檢索質量不穩定需自我修正的研究型問題；不適合的是高一致性要求的單次問答與延遲敏感的線上服務——那些場景仍應留在 Gen 2/3 的 Advanced/Modular。

## 產品與協議層：Deep Research 與 MCP

論文證明可行性，產品與協議決定它能否進生產。[OpenAI Deep Research](https://openai.com/index/introducing-deep-research/)（2025-02-02）基於 o3 優化版的多步瀏覽 + Python 工具 agent，能在數十分鐘內搜尋、分析與綜合數百來源，把 Agentic RAG 從研究原型推向端到端產品。它的設計選擇是「用時間換深度」——適合研究報告、盡職調查等可等待的任務，不適合即時對話。

協議層的關鍵是 [MCP（Model Context Protocol）](https://modelcontextprotocol.io/specification/2025-06-18)。Anthropic 於 2024-11-25 開源的 [MCP 官方公告](https://www.anthropic.com/news/model-context-protocol)將其定位為 *USB-C for AI*：Host / Client / Server 三件套，Resources / Tools / Prompts 三能力，搭配 Sampling / Roots / Elicitation 的能力協商。MCP 把 RAG 的「檢索」從向量庫查詢泛化為統一的工具與數據源調用，2025 年已被 ChatGPT、Claude、VS Code、Cursor 採納，並被 [LangGraph 1.2.11](https://github.com/langchain-ai/langgraph/releases) 等編排框架整合—— [LangGraph 官方文件](https://docs.langchain.com/oss/python/langgraph/overview)已明確將自身定位為 *orchestration runtime*（durable execution / persistence / human-in-the-loop / streaming），而非高階 agent 框架。

適合與不適合的判斷：新系統若需跨工具（搜尋、資料庫、文件、API）且希望一次開發多處運行，優先以 MCP 為主、自製 tool-use 為輔；企業內網禁用 MCP server 或需細粒度權限審計時，自製工具層仍有存活空間。限制是 MCP 將工具描述視為不可信輸入，安全審計面擴大，宿主授權與隔離必須在架構圖中明確標出。

## 怎麼選：新範式 vs 十代 RAG

- **選 Gen 2/3（Advanced/Modular）**：問題一次檢索可解、延遲與成本敏感、需可解釋與可測試的 DAG。這些仍是大量生產案例驗證過的基線。
- **選 Gen 6 GraphRAG**：關係推理是主矛盾（法規引用、藥物交互、組織關係），且願意付出圖構建成本。2025 年後注意 [GraphRAG 已至 v3.1.2](https://github.com/microsoft/graphrag/releases)的四查詢與索引變更，輕量替代可考慮 LightRAG / HippoRAG 2。
- **選 Agentic/Reasoning RAG（本篇）**：問題需超過一次檢索、需在推理中動態修正檢索策略、或需跨工具綜合（搜尋 + 計算 + 文件操作）。此時才值得承擔多輪成本與可觀測性負擔。
- **不選的原因**：若知識庫小且完整，或答案在結構化資料中（Text-to-SQL 更準），Agentic 的額外輪次不會提升召回，只會稀釋上下文與增加幻覺面。

## 程式範例：LangGraph + MCP 的最小可運行骨架

以下骨架展示 Agentic RAG 在 LangGraph 中如何以 MCP 作為統一檢索層。每個 MCP server 是一個可替換的檢索源（向量庫、搜尋引擎、文件解析），圖的節點負責推理與工具調度，邊負責狀態持久化與人工介入。

```python
# 概念範例：Agentic RAG with LangGraph + MCP
# 依賴：langgraph>=1.2, mcp[cli]
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

# 1. 定義狀態：問題、推理軌跡、檢索結果、工具調用歷史
class AgentState(dict):
    question: str
    trajectory: list  # [{thought, action, observation}]
    context: list     # 合併後的檢索片段

# 2. 推理節點：決定下一動作（搜尋 / 計算 / 回答）
def think(state: AgentState):
    # 呼叫 LLM 產生 Thought + Action（工具名與參數）
    # Action 可能是 mcp__search / mcp__vector_search / mcp__code_exec
    return {"next_action": llm.decide(state)}

# 3. MCP 工具節點：統一調用 Resources / Tools
def act_with_mcp(state: AgentState):
    tool_call = state["next_action"]
    # 透過 MCP client 路由至對應 server
    observation = mcp_client.call(tool_call.name, tool_call.args)
    return {"trajectory": state["trajectory"] + [observation]}

# 4. 判斷是否繼續
def should_continue(state: AgentState):
    if llm.should_answer(state):
        return "generate"
    return "think"

builder = StateGraph(AgentState)
builder.add_node("think", think)
builder.add_node("act", act_with_mcp)
builder.add_node("generate", lambda s: {"answer": llm.generate(s)})
builder.set_entry_point("think")
builder.add_conditional_edges("think", lambda s: "act")
builder.add_conditional_edges("act", should_continue, {"think": "think", "generate": "generate"})
builder.add_edge("generate", END)

# 持久化與可觀測：checkpoint + human-in-the-loop
graph = builder.compile(checkpointer=MemorySaver(), interrupt_before=["act"])
```

可執行動作：今晚就能做的是把既有 RAG 的單次檢索節點替換為上述 `think → act(MCP) → think` 的小迴圈，先在離線評測集上對比單次 vs 兩輪的召回與成本，再決定是否放寬輪次上限與工具白名單。

## 整體架構

```
Query → Think (LLM 推理) → MCP Tool Router ─┬─→ Vector Search Server
                                            ├─→ Web Search Server
                                            ├─→ Document Parse Server
                                            └─→ Code / SQL Server
         ↑  Observation (結果回填)  ←─────────┘
         ↓  (多輪，直到 should_answer)
      Generate (綜合答案 + 引用)
         │
      Memory / Checkpoint (可回放與人工介入)
```

## 整體來說

Agentic / Reasoning RAG 不是「更強的檢索」，而是把檢索變成推理的子程序，並用 RL 與工具協議讓這套子程序可被訓練與復用。它的取捨很清晰：用多輪與跨工具的成本換取開放域研究的覆蓋率與可修正性。對多數團隊，務實的採用路徑是——保留 Gen 2/3 作為線上基線，將 Agentic 小迴圈作為離線研究或高價值任務的第二條路，並以 MCP 統一檢索面，否則你會在自製 tool-use 與可觀測性上重複造輪子。

## 參考資料

- [Towards Agentic RAG with Deep Reasoning: A Survey](https://arxiv.org/abs/2507.09477) — 2025-07，Synergized RAG-Reasoning 三類劃界，Agentic Era 世代依據（zh 版無需標註語言）
- [Reasoning RAG via System 1 or System 2: A Survey](https://arxiv.org/abs/2506.10408) — 2025-06，以 System 1/2 區分 predefined vs agentic reasoning
- [Search-R1: Training LLMs to Reason and Leverage Search Engines with RL](https://arxiv.org/abs/2503.09516) — 2025-03，多輪搜索的 RL 訓練起點
- [REX-RAG: Reasoning Exploration with Policy Correction](https://arxiv.org/abs/2508.08149) — 2025-08，RL dead-end 的策略修正
- [GTA-RAG: Graph-Trajectory-Augmented RL](https://arxiv.org/abs/2608.22479) — 2025-08，graph-trajectory 蒸餾（EMNLP 2026）
- [Interact-RAG: Reason and Interact with the Corpus](https://arxiv.org/abs/2510.27566) — 2025-10，可操縱的語料庫交互
- [AlignRAG: Enhancing RAG Reasoning through Test-Time Critique](https://arxiv.org/abs/2504.14858) — 2025-04，test-time critique 對齊（NeurIPS 2025）
- [Introducing deep research](https://openai.com/index/introducing-deep-research/) — OpenAI 官方 Blog，2025-02-02，端到端研究產品
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) — Anthropic 官方，2024-11-25，MCP 開源公告
- [Model Context Protocol Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18) — 官方 Spec，Resources/Tools/Prompts 與能力協商
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview) — 官方文件，orchestration runtime 定位與持久化
- [LangGraph Releases 1.2.11](https://github.com/langchain-ai/langgraph/releases) — 2025-08-11，編排框架版本錨點
- [GraphRAG Releases v3.1.2](https://github.com/microsoft/graphrag/releases) — 2025-08-21，對比 Graph 世代的版本錨點
- [RAG 技法大全導航](https://quidproquo.cc/posts/ai/2026-03-14-rag-patterns-complete-guide) — 本文所屬系列的總覽與選型
