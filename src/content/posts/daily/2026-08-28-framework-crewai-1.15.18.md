---
title: "框架更新｜CrewAI 1.15.18"
date: 2026-08-28
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: zh-TW
description: "CrewAI 1.15.18 把 conversational Flow 從實驗性功能升為穩定 API，正式匯入路徑改到 crewai.flow，舊的 crewai.experimental 路徑靠相容 shim 留著不壞"
tldr: "CrewAI 1.15.18 重點：(1) conversational Flow 正式從 crewai.experimental 升為穩定 API，canonical 實作搬到 crewai.flow，同時保留 crewai.experimental.conversational 作為相容別名，舊程式碼不必馬上改；(2) 目前 shim 沒有主動印 deprecation warning，換路徑與否全靠自覺；(3) 另修了 Claude Sonnet 4.6 context window 對應錯誤、Anthropic 大型工具呼叫的 max_tokens 上限過低等問題，本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 8
---

> 🌏 [English version](/en/posts/daily/2026-08-28-framework-crewai-1.15.18-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | CrewAI |
| 版本 | v1.15.18 |
| 前一版 | v1.15.17 |
| 發布日 | 2026-08-27 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.18) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 57.7k |

## 這個版本為什麼重要

[前一篇（1.15.17）](/posts/daily/2026-08-22-framework-crewai-1.15.17)才剛把「宣告式 Flow 驅動對話模式」接起來，當時 conversational Flow 整套功能仍標在 `crewai.experimental` 底下，官方也明講「行為可能在未來版本調整」。1.15.18 就是那句話的下文：`crewai.flow` 正式收下 conversational Flow 的 canonical 實作（`ConversationConfig`、`ConversationState`、`handle_turn`、`stream_turn` 等），代表這套 API 不再是「隨時可能改」的實驗品，而是框架承諾維護的穩定介面。對已經在用 `crewai.experimental.conversational` 的專案來說，這次升級不會馬上壞——舊路徑被改成指向新模組的相容別名，import 照樣能動——但也代表接下來的官方文件、範例會統一往 `crewai.flow` 寫，舊路徑會逐漸被視為過時寫法。

## 重要變更

- **conversational Flow 升級為穩定 API（Promote conversational flows to stable）**：canonical 實作從 `crewai.experimental.conversational` 搬到 `crewai.flow` → 新程式碼建議直接用 `from crewai.flow import ConversationConfig, ConversationState, handle_turn, stream_turn`
- **舊路徑靠 shim 保留相容（compatibility aliases）**：`crewai.experimental.conversational` 與 `crewai.experimental.conversational_mixin` 變成指向新模組的 `sys.modules` 別名 → 既有的 `from crewai.experimental import ...` 寫法不用改也能繼續跑
- **宣告式對話 Flow 補齊功能**：宣告可以自訂 router 回應格式、chat flow 可自行宣告 state shape、對話宣告可接受 crew 風格的 LLM 設定 → 進一步縮小宣告式與 Python 子類別兩條路徑之間的功能差距
- **文件同步四語更新**：conversational Flow 相關文件全面改指向 `crewai.flow` 的新範例

## Breaking Changes

本版本無 breaking changes。`crewai.experimental.conversational` 目前仍可正常 import，且 PR review 過程中已有人指出：現在的相容 shim 並未主動印出 deprecation warning，所以繼續用舊路徑不會收到任何提醒——要不要跟著搬到 `crewai.flow`，目前完全靠自己留意 release notes。

## 遷移指南

直接升級不會壞，但建議順手把 import 換成新路徑：

```bash
pip install --upgrade crewai==1.15.18
```

```python
# 舊寫法（1.15.17 及之前，目前仍可動，但已不是 canonical 路徑）
from crewai.experimental.conversational import ConversationConfig, ConversationState

# 新寫法（1.15.18 起的穩定路徑）
from crewai.flow import ConversationConfig, ConversationState, handle_turn, stream_turn
```

`Flow` 子類別開啟對話模式的方式不變，只是建議把 import 來源換掉：

```python
from crewai import Flow
from crewai.flow import ConversationConfig, ConversationState, listen

@ConversationConfig(defer_trace_finalization=True)
class SupportFlow(Flow[ConversationState]):
    conversational = True

    def route_turn(self, context: dict) -> str | None:
        message = (self.state.current_user_message or "").lower()
        if "order" in message:
            return "order"
        return "converse"

    @listen("order")
    def handle_order(self) -> str:
        reply = "Your order is on the way."
        self.append_assistant_message(reply)
        return reply
```

## 與其他框架的對比觀察

「先讓功能以 `experimental` 命名空間活著、等 API 穩定再搬進主套件、期間留相容 shim 過渡」是相對保守但對使用者友善的做法，跟 Agno 3.0.0 那種直接大改 API、要求資料庫 migration 的激進升級形成對比。不過 CrewAI 這次少做了一步：shim 沒有 deprecation warning，等於把「該不該搬家」的判斷完全丟給開發者自己盯 changelog，這點比起 Python 標準庫或多數成熟框架的做法（shim + `DeprecationWarning`）還是弱一截。

## 今日收穫

[上一篇文章](/posts/daily/2026-08-22-framework-crewai-1.15.17)的「今日收穫」猜對了方向——子類別限定的功能會逐步補進宣告式系統——但這次看到的是另一層：功能穩定的訊號不只是「文件說它穩定了」，還要看它有沒有真的搬出 `experimental` 命名空間、有沒有相容層、相容層有沒有警告使用者遷移。CrewAI 做到了前兩項，第三項（deprecation warning）暫缺，這種「半套」的穩定化過程在開源專案裡其實很常見，值得日後追蹤它會不會補上。

## 參考資料

- [CrewAI 1.15.18 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.18)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [PR #7107 — feat(flow): promote conversational flows to stable](https://github.com/crewAIInc/crewAI/pull/7107)
- [crewAI 1.15.17 — 上一篇框架更新](/posts/daily/2026-08-22-framework-crewai-1.15.17)
