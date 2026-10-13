---
title: "框架更新｜DSPy 3.4.1"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, framework, daily, dspy]
lang: zh-TW
description: "DSPy 3.4.1 讓 dspy.RLM 可以在沙箱裡建立完整的 DSPy 子代理，但同時在 GEPA、Flex、ReActV2 上埋了多個會讓既有程式碼跑不動的相容性改動"
tldr: "DSPy 3.4.1 兩大重點：(1) dspy.RLM 的沙箱程式碼現在能 import dspy 建立 Predict / ChainOfThought / ReActV2 / 巢狀 RLM 子代理，共用同一個 max_llm_calls 預算；(2) GEPA 預設改用結構化 InstructionProposer。Breaking：GEPA 相同 seed 結果可能跟 3.4.0 不同、reflection_lm 必須是 dspy.LM、ReActV2 不能再宣告 history/tools 輸入欄位、dspy.predict.flex.bridge 的 import 路徑失效、3.4.0 存的 null Score criteria 程式無法載入。"
series:
  name: "AI Framework Changelog"
  order: 39
---

> 🌏 [English version](/posts/daily/2026-10-14-framework-dspy-3.4.1-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | DSPy |
| 版本 | 3.4.1 |
| 前一版 | 3.4.0 |
| 發布日 | 2026-10-12 |
| Release Notes | [GitHub Release](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1) |
| GitHub | [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy) |
| Stars | 34,500 |

## 這個版本為什麼重要

DSPy 的賭注一直是「把 prompt 當程式編譯優化」而不是手刻流程圖，3.4.1 把這個賭注延伸到 agent 本身：`dspy.RLM`（會寫程式碼解題的推理模組）現在可以在自己的沙箱裡 `import dspy`，直接生成有結構化輸入輸出、工具、甚至遞迴的 DSPy 子代理，而不是只能呼叫寫死的 Python 函式。對已經在用 GEPA 做 prompt 優化、或用 RLM 處理開放式任務的團隊，這代表「子任務要不要交給另一個 agent」第一次變成執行期的選擇，而不是架構設計階段就要定死的事。但這個版本號是 patch（3.4.0 → 3.4.1），卻帶了一整頁「Upgrade notices」——GEPA 的優化結果、RLM 的 prompt 快取、ReActV2 的欄位命名規則都變了，等於是「新功能用 patch 號上車，相容性風險用 patch 號一起上車」。

## 重要變更

- **RLM 可建立 DSPy 子代理**：`dspy.RLM` 的沙箱程式碼可以用 `dspy.Predict`、`dspy.ChainOfThought`、`dspy.ReActV2`（沿用 RLM 自己的工具），或巢狀 `dspy.RLM` → 子代理只收 JSON 跨沙箱邊界，且和 `llm_query` 共用同一個 `max_llm_calls` 預算，不會被 `n` 參數偷偷放大呼叫數
- **InstructionProposer 成為 GEPA 預設 proposer**：`dspy.GEPA` 不再自己拼 raw prompt 再從 backtick 挖答案，改成透過 `dspy.Predict` + `JSONAdapter` 呼叫 reflection LM → 可以傳 `skills`（吃 SKILL.md 當參考資料）、`additional_instructions`、`max_chars` 等參數客製化，`dspy.History`、工具軌跡、`dspy.Image` 也能以結構化內容送進 reflection LM，不再被攤平成文字
- **修掉 3.4.0 的 import crash**：`dspy.LM(...).supports_function_calling` 這類延遲載入 LiteLLM 的路徑會拋 `ImportError: cannot import name 'BaseModel'`，3.4.1 修掉了，是不少人升級 3.4.0 後踩到的第一個坑
- **Python 3.15 支援**：`requires-python` 放寬到 `<3.16`；但 3.15 上 `litellm` 和 `gepa` 目前都裝不起來（上游宣告 `<3.15`），LM 呼叫只能走內建 native engine，`dspy.GEPA` 在 3.15 上直接拋 `ImportError`

## Breaking Changes

- GEPA 的 reflection request 改成結構化 JSON system message：**同一個 seed，優化結果可能跟 3.4.0 不一樣**
- `reflection_lm` 必須是 `dspy.LM`（或 `dspy.BaseLM`）：3.4.0 允許傳一個純函式直接被 `reflection_lm(prompt)` 呼叫，3.4.1 這樣傳會讓每次 proposal 都失敗，GEPA 只會在 log 記下失敗、整個優化跑完卻拿到跟 seed 一樣的程式
  - 影響範圍：用 lambda 或純函式當 `reflection_lm` 的 GEPA 使用者
- `dspy.teleprompt.gepa.gepa_utils` 不再 re-export `InstructionProposalSignature` → 改從 `gepa.strategies.instruction_proposal` import
- RLM 的每個 prompt 都多了 sub-agent 區段，**無法關閉**：3.4.0 錄下的 LM cache／recorded response 在 3.4.1 下不會再命中；sub-agent 呼叫也會計入 `max_llm_calls`，原本卡在上限邊緣的 RLM 可能提前打滿預算
- `dspy.predict.flex.bridge` 的 shim 常數（`SHIM_SETUP`、`CONSTRUCT_TOOL`、`CALL_TOOL`、`BRIDGEABLE_KINDS` 等）搬到 `dspy.primitives.facade`，舊路徑 import 直接拋 `ImportError`
  - 影響範圍：寫過 sandbox backend 的開發者；只是建立、執行 `dspy.Flex` 程式不受影響
- `Score` 的 level 描述不可為 `null`：3.4.0 存的程式若有 `criteria` 含 `null`，用 `program.load(path)` 會拋 `ValueError`，錯誤訊息甚至不會提到 `null`
- `dspy.ReActV2` 的 signature 不能再宣告名叫 `history` 或 `tools` 的輸入欄位（建構子直接拋 `ValueError`），因為這兩個名字現在由 ReActV2 自己提供
  - 影響範圍：把 `history: dspy.History` 寫進 ReActV2 signature 的既有程式碼
- bundled model metadata 跟進 LiteLLM 1.105.0：離線模式（或設了 `LITELLM_LOCAL_MODEL_COST_MAP=true`）下，`anthropic/claude-3-7-sonnet-20250219`、`gemini/gemini-2.0-flash` 等已被上游移除的型號會悄悄失去 tool-calling／structured-output／reasoning 旗標，`JSONAdapter` 等 adapter 會自動降級成純文字 JSON，不會跳警告
- Python 3.10–3.13 上 `int | None` 這類 `X | Y` annotation 的渲染方式改成跟 `typing.Union`一致：prompt 內容變了，3.4.0 錄的 cache/prompt 不再 match

## 遷移指南

### 從 3.4.0 升級到 3.4.1

```bash
pip install --upgrade "dspy==3.4.1"
```

```python
# ReActV2 用 history 當輸入欄位 —— 舊寫法（3.4.0）
agent = dspy.ReActV2("history: dspy.History, question -> answer", tools=[lookup_order])

# 新寫法（3.4.1）：拿掉欄位宣告，呼叫時照樣傳 history=
agent = dspy.ReActV2("question -> answer", tools=[lookup_order])
result = agent(question=question, history=history)  # 呼叫方式不變
```

```python
# Flex / RLM 自訂 sandbox backend 的 import —— 舊寫法（3.4.0）
from dspy.predict.flex.bridge import BRIDGEABLE_KINDS, CALL_TOOL, CONSTRUCT_TOOL, SHIM_SETUP

# 新寫法（3.4.1）
from dspy.primitives.facade import BRIDGEABLE_KINDS, CALL_TOOL, CONSTRUCT_TOOL, SHIM_SETUP
```

```diff
# 修 3.4.0 存下、含 null criteria 的 JSON 程式
 "fields": {
   "severity": {
-    "criteria": [null, "Disruptive", {"what": "Blocking"}]
+    "criteria": ["Minor", "Disruptive", {"what": "Blocking"}]
   }
 }
```

若自己的 GEPA 流程把 `reflection_lm` 傳成純函式，要包成 `dspy.LM`（需要時可帶自訂 `engine=`）；若離線跑舊型號，把 `LITELLM_MODEL_COST_MAP_URL` 指到還保留該型號的 metadata 檔，並取消 `LITELLM_LOCAL_MODEL_COST_MAP`。

## 與其他框架的對比觀察

LangGraph、CrewAI 這類框架把「要不要把子任務交給另一個 agent」當成設計期就畫進 graph／crew 的決定；DSPy 的路線反過來——RLM 本來就是讓模型在沙箱裡寫程式解題，3.4.1 只是把「子任務需要結構化輸入輸出或自己的工具」這個判斷,也丟給執行期的生成程式碼本身決定要不要呼叫 `dspy.Predict`、`dspy.ReActV2`。這讓 DSPy 在「用 metric 和資料自動優化整條流程」這件事上繼續跟圖形化編排框架拉開距離，代價是這次升級也證明了:當 agent 結構本身變成可生成的程式碼,相容性邊界會比傳統 API 更難預先畫清楚。

## 今日收穫

之前以為 `dspy.RLM` 的沙箱程式碼只能呼叫寫死的 Python 工具函式，看到 3.4.1 讓它能直接 `import dspy` 生成有自己工具、自己遞迴深度的子代理才意識到：RLM 已經不是「讓模型寫一段程式碼跑完就回傳結果」，而是讓模型在執行期動態決定要不要把當前任務拆給另一個完整的 agent 去跑——而這整件事只靠一個共用的 `max_llm_calls` 守住成本邊界。

## 參考資料

- [DSPy 3.4.1 Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)
- [DSPy GitHub Repository](https://github.com/stanfordnlp/dspy)
- [3.5 LM-interface cutoff 公告](https://dspy.ai/community/normalized-lm-api-migration/#the-35-cutoff)
- [Full Changelog 3.4.0...3.4.1](https://github.com/stanfordnlp/dspy/compare/3.4.0...3.4.1)
