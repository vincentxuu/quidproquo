---
title: "AG2：以對話、GroupChat 與 speaker selection 組織多 Agent 協作"
date: 2026-08-22
category: ai
type: deep-dive
tags: [ag2, ai-agent, multi-agent, autogen, orchestration, python]
lang: zh-TW
tldr: "AG2 延續 AutoGen 的 ConversableAgent 心智模型：agent 透過訊息協作，GroupChatManager 再用 round-robin、manual、random 或 LLM 決定下一位發言者。"
description: "介紹 AG2 的 ConversableAgent、工具、GroupChat、多 agent 編排方式，以及它適合與不適合的系統。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-ag2-multi-agent-framework-en)

[AG2](https://docs.ag2.ai/latest/) 是用 Python 建立 agent 與多 agent 工作流的開放原始碼框架。它的核心不是 graph node 或固定 task，而是「可對話的 agent」：每個角色都能接收訊息、呼叫模型、執行工具、回覆其他 agent 或等待人類介入。

如果你熟悉早期 AutoGen，AG2 的 `autogen` import 與 `ConversableAgent` 會很熟悉。官方安裝文件也明確指出 `autogen` 與 `ag2` 是同一個 PyPI 套件的別名。這同時是採用時最容易混淆的地方：AG2 與微軟後來的 Microsoft Agent Framework 是不同專案，不能只看套件名稱判斷維護路線。

## ConversableAgent 是共同底座

[官方基本概念](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/conversable-agent/)把 `ConversableAgent` 定義為 AG2 最重要的類別。名稱、system message 與 LLM 設定共同決定角色；工具、人類輸入、終止條件與回覆函式再逐步加上去。

```python
from autogen import ConversableAgent, LLMConfig

llm_config = LLMConfig({
    "api_type": "openai",
    "model": "gpt-5-nano",
})

reviewer = ConversableAgent(
    name="reviewer",
    system_message="Review the draft and return concrete corrections.",
    llm_config=llm_config,
)

result = reviewer.run(message="Review this release note.", max_turns=2)
result.process()
```

`run()` 回傳的是事件 iterator，不是已完成的純文字。你可以自己迭代事件接 UI、logging 或人工核准；`process()` 則是方便在終端直接跑完整段對話的 helper。這種事件導向介面適合互動式系統，但也表示正式應用不應只靠 console 輸出判斷成功。

## GroupChat 把「下一個誰說話」變成編排問題

兩個 agent 可以直接對話；角色增加後，[GroupChat](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)用共同 conversation thread 保存脈絡，再由 `GroupChatManager` 選擇下一位 speaker。內建策略包括固定輪流、隨機、人工指定，以及由 LLM 自動選擇。

這個抽象適合研究員、作者、審稿者之間的協作，因為真正的不確定性就是「目前該交給誰」。AG2 也允許限制角色之間可走的轉移，避免任何 agent 都能任意接手。

代價是成本與行為較難預測。自動 speaker selection 本身就是一次模型判斷，共享完整對話也會讓 context 持續變大。上線前應為最大 round、可用工具與終止條件設硬限制，並用 trace 確認每輪為什麼發生。

## 對話歷史不是業務 checkpoint

AG2 很擅長保存「誰對誰說了什麼」，但一串 message history 不會自動成為可重播的訂單、審批或資料管線狀態。外部副作用仍要有 idempotency key；等待數天的人工核准，則需要資料庫或 durable runtime 保存業務狀態。

因此 AG2 最適合多角色協作原型、需要人類穿插對話的工作，以及既有 AutoGen codebase。固定 ETL、付款流程或必須精準從某一步恢復的長工作流，應把核心狀態放在另一層，由 AG2 負責其中需要語言模型判斷的節點。

## 整體來說

AG2 的優勢是把多 agent 協作寫得像對話，而不是先畫完整狀態機。當角色分工本身就是產品需求，GroupChat 與 speaker selection 很直覺；如果只有一個 agent 加兩個工具，普通函式或更薄的 typed agent 框架通常更省事。

最小評估方式是先做兩個角色、固定 round-robin，再和單 agent baseline 比成功率、token 與延遲。只有角色拆分帶來可測量改善時，才加入自動 speaker selection。跨框架選型可接著看[Agent 框架比較](/posts/ai/2026-08-22-agent-framework-selection-guide)。

## 參考資料

- [AG2 documentation](https://docs.ag2.ai/latest/)
- [Installing AG2](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/installing-ag2/)
- [ConversableAgent](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/conversable-agent/)
- [AG2 GroupChat](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/groupchat/groupchat/)
- [站內：2026 Agent 框架怎麼選](/posts/ai/2026-08-22-agent-framework-selection-guide)
