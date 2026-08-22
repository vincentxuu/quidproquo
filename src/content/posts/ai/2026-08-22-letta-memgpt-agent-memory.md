---
title: "Letta／MemGPT 完整介紹：把記憶管理做進 Stateful Agent Runtime"
date: 2026-08-22
category: ai
type: deep-dive
tags: [letta, memgpt, memory, ai-agent, context-engineering, stateful-agent]
lang: zh-TW
tldr: "Letta 延續 MemGPT 的作業系統類比，但它不是單一 memory API：agent state、可編輯的 in-context memory blocks、conversation history 與外部 archival memory 都由 runtime 持久化，模型也能透過工具主動整理記憶。"
description: "從 MemGPT 論文到現行 Letta，說明 memory blocks、conversation history、archival memory、MemFS、agent state、部署方式與限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-letta-memgpt-agent-memory-en)

[Letta](https://docs.letta.com/) 是建置 stateful agent 的 runtime；MemGPT 則是它的研究起點與舊名稱。核心類比是把有限 context window 當成 RAM，讓 agent 主動決定哪些資訊常駐、哪些移到外部記憶，以及何時搜尋回來。

因此 Letta 和 Mem0 的差別不是「多一種向量搜尋」。Mem0 可以接在既有 agent 後面；Letta 連 agent state、訊息、工具與記憶管理迴圈都一起接管。

## 三層記憶不是同一個資料池

```text
┌──────────────── context window ────────────────┐
│ system prompt                                  │
│ core memory blocks: persona / human / project  │
│ recent messages + summary                      │
└────────────────────────────────────────────────┘
              │ explicit tools
              ▼
┌──────────────── external memory ───────────────┐
│ conversation history search                    │
│ archival memory / passages                     │
└────────────────────────────────────────────────┘
```

**Memory blocks** 是 system prompt 裡持久、可編輯的區段，有 label、description、value 與字數上限，適合 persona、使用者偏好與當前專案狀態。

**Conversation history** 保存離開目前 context 的訊息，可透過搜尋找回。**Archival memory** 則是另外寫入、以 semantic search 取回的 passages。官方文件特別提醒：archival memory 不會因 context overflow 自動填入，memory blocks 與 archival memory 也不是自動同步的同一套資料。

```python
from letta_client import Letta

client = Letta(token="your-token")
agent = client.agents.create(
    name="project-assistant",
    memory_blocks=[
        {
            "label": "project",
            "description": "目前專案的穩定決策與限制",
            "value": "尚無決策",
        }
    ],
)

client.agents.passages.create(
    agent_id=agent.id,
    text="退款政策允許購買後三十天內退貨。",
    metadata={"topic": "refunds"},
)
```

實際 SDK 介面會隨 Letta runtime 演進；導入時應以當下 Agent SDK reference 為準，不要直接照早期 MemGPT server 教學。

## Agent 為什麼能管理自己的記憶

一般 memory service 在應用層決定何時 add 或 search。Letta 把 memory tools 交給 agent：模型可以修改 block、插入 archival memory、搜尋 conversation history。這讓「整理記憶」成為 agent policy 的一部分，也讓錯誤從 retrieval 擴大到 write policy。

若 agent 把未確認推論寫進 `human` block，錯誤會在每一輪都常駐。Block description 含糊時，模型可能更新錯區；多個執行同時改 shared block，還要處理競爭與覆寫。記憶可自我編輯是能力，也是需要 audit 的寫入權限。

## MemFS 與目前 Letta 的方向

目前 Letta 文件也介紹以 Git-backed Markdown 組成的 MemFS／context repository。`system/` 下的檔案會常駐 prompt，其他檔案按需探索，並能利用版本歷史追蹤 agent 如何改變記憶。這比「所有記憶都是資料庫裡的一筆向量」更接近可讀、可 diff 的 context engineering。

但不要把所有年代的 Letta 文件混成單一架構。MemGPT 論文、舊 Letta V1 server、現行 Agent SDK 與 Letta Code／MemFS 是連續演進的產品線；舊 repo 的 archive branch 已不支援 production。評估時先鎖定你要用的是 Agent SDK、Cloud、App Server，還是 Letta Code。

## 適合與不適合

Letta 適合需要長時間存在、能反思與整理自身狀態的 agent，例如個人助理、AI coworker、研究或 coding agent。若只是替客服 bot 保存三個偏好欄位，完整 runtime 的心智模型與維運面通常太大。

Mem0 適合外掛記憶 API；Zep 適合時序 fact；Cognee 適合資料到知識圖 pipeline。Letta 的採用決策更像「要不要採用這個 agent runtime」，而不只是「記憶存哪裡」。

## 上線前的最小測試

讓 agent 經歷一段超過 context window 的對話，途中改變一項使用者偏好。檢查目前 block 是否只留最新且已確認的狀態、舊訊息能否由 conversation search 找回、archival passage 是否只有明確寫入的項目。最後回復舊版 block 或重建 agent，確認 state、工具與記憶都有可稽核的恢復路徑。

## 參考資料

- [Letta Documentation](https://docs.letta.com/)
- [Letta Agent State API](https://docs.letta.com/api/resources/agents)
- [Letta Memory Architecture](https://github.com/letta-ai/skills/blob/main/letta/letta-api-client/memory-architecture.md)
- [Letta MemFS](https://github.com/letta-ai/letta-docs-md/blob/main/concepts/memfs/index.md)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
