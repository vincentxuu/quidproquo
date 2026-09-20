---
title: "框架更新｜Pydantic AI v2.46.0"
date: 2026-09-21
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.46 把上一版剛推出的分類器模型 TypeSafeModel（Jev）擴展到能填工具參數、能選 union 型別，還能拿去當 LLMJudge／GEval 的裁判模型"
tldr: "Pydantic AI v2.46.0 三個重點：(1) 上一版（2.45.0）剛推出的 TypeSafeModel——串接不寫文字、只回答型別化問題的分類器 Jev——這版補上它當時做不到的事：能填工具呼叫的參數、能在 union 型別裡先選型別再填欄位；(2) 新增 `typesafe_boolean_threshold`，yes/no 的判斷門檻從寫死的 0.5 距離變成可調參數；(3) `supports_text_output` 讓 `LLMJudge`／`GEval` 這類需要生文字裁決的評測，也能跑在 Jev 這種不輸出文字的模型上。無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 25
---

> 🌏 [English version](/en/posts/daily/2026-09-21-framework-pydantic-ai-2.46.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.46.0 |
| 前一版 | v2.45.0 |
| 發布日 | 2026-09-19 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20k |

## 這個版本為什麼重要

上一版（2.45.0，2026-09-17）剛合併了 `TypeSafeModel`：一個接到 TypeSafe 家分類器 Jev 的 provider。Jev 不是語言模型，它不寫文字——你給它一段文字和一組型別化的問題（Pydantic model 的每個欄位變成一個問題），它直接回每個欄位的答案和信心分數。因為不用逐 token 生成，AlphaSignal 的 ticket 分類基準測出中位延遲 227ms，對照 gpt-5.6-luna 的 1,415ms，快了大約 6 倍。但 2.45.0 的限制也很明顯：`str` 輸出、原生檔案輸入、需要生成參數的工具呼叫，全都不支援，踩到就直接丟 `UserError`。2.46.0 這一版把其中兩個限制精準補掉——工具參數填充和 union 型別選擇——同時把 Jev 的信心門檻和「能不能拿去當裁判模型」也一併打通。對已經在用 TypeSafeModel 做分流／審核的團隊來說，這不是一次獨立的新功能，而是上一版留的坑，這一版接著填。

## 重要變更

- **TypeSafeModel 填工具參數（Let TypeSafeModel fill a tool's arguments when Jev can express them）**：Jev 原本只能填 `output_type` 的欄位，2.46.0 起，當工具的參數 schema 落在 Jev 支援的問題類型內（`bool`／`Literal`／`Enum`／`[0,1]` 的 `float` 等），agent 呼叫工具時的參數也能交給 Jev 用分類器的方式填，不用切回會生成文字的模型
- **TypeSafeModel 填 union 輸出型別（fill a union of output types by choosing the type first）**：output_type 是 union 時，Jev 先回答「該選哪個型別」這個問題，再對選中的型別填欄位——之前 union 型別不在 Jev 的能力範圍內
- **`typesafe_boolean_threshold`**：yes/no 判斷過去固定用「離 0.5 有多遠」當信心依據，這版讓門檻可調 → 對誤判成本不對稱的場景（比如寧可多攔一點也不要漏放），可以直接調嚴或調鬆判斷線，不用在 agent 外面自己包一層後處理
- **`supports_text_output` on `ModelProfile`，讓 `LLMJudge`／`GEval` 能跑在不輸出文字的模型上**：Pydantic AI 內建的評測工具 `LLMJudge` 和 `GEval` 過去預設裁判模型要能寫文字說明理由，這版讓它們認得「這個模型不輸出文字」，於是 Jev 這種純分類器也能拿來當裁判——用一個比生成式裁判快很多的分類器幫 agent 輸出打分
- **`Choices` helper**：在執行期組一組帶描述的選項，供動態產生的分類/選擇欄位使用
- **Enum 用成員 docstring 當說明（`UseEnumMemberDocstrings`）**：Enum 的每個選項可以用自己的 docstring 當描述，這對 Jev 這類需要清楚問題敘述的分類器特別有用
- **`RealtimeSession.wait_for_playback()`**：即時語音 session 新增等待播放完成的方法，官方文件範例也一併改成等回覆播完再關閉
- **`TemporalDurability` 新增 `event_stream_topic`**：透過 Temporal 的 Workflow Streams 把 agent 事件串流出去，由社群貢獻者提交，是本版少數與 TypeSafeModel 無關的變更

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
pip install --upgrade pydantic-ai==2.46.0
```

若要開始用新補上的能力，才需要動程式碼——例如把工具參數交給 Jev 填：

```python
from pydantic_ai import Agent
from pydantic_ai.models.typesafe import TypeSafeModel

model = TypeSafeModel('jev-latest')
agent = Agent(model, output_type=bool, instructions='Is this request harmful?')

# 2.46.0 起，工具呼叫的參數若落在 Jev 支援的問題類型內
# （bool / Literal / Enum / 0~1 的 float 等），也能交給 Jev 填，不用換模型
```

## 與其他框架的對比觀察

LangGraph、CrewAI 這類框架談的是「怎麼編排多個會生成文字的模型」，Pydantic AI 用 TypeSafeModel 開的是另一條路：把 agent 決策鏈裡「其實只是分類」的那幾步（要不要繼續、選哪個分支、風險評分）換成一個不生成 token 的判別式模型，同時讓這一步仍然吃 Pydantic 的型別驗證和 provider 介面。2.46.0 把工具參數和 union 型別也接上，代表這條路線不是一次性的 demo 整合，而是打算讓分類器和生成式模型在同一個 agent 裡並存、按需要切換。

## 今日收穫

之前以為「模型」在 agent 框架裡預設等於「會生成文字的東西」，看到 Jev 這種不寫文字、只答型別化問題的分類器被當成一等公民接進 `Agent`（用同一套 provider 介面、同一套型別驗證）才意識到：agent 決策鏈裡有大量步驟其實是分類問題而不是生成問題，把這些步驟硬套一個生成式模型只是在為不需要的 token 生成付延遲和成本。

## 參考資料

- [Pydantic AI v2.46.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.44.0 — 上一篇框架更新](/posts/daily/2026-09-18-framework-pydantic-ai-2.44.0)
- [TypeSafe (Jev) — Pydantic AI 官方文件](https://pydantic.dev/docs/ai/models/typesafe/)
- [TypeSafeModel PR #8450](https://github.com/pydantic/pydantic-ai/pull/8450)
- [Pydantic AI Adds Jev to Cut Classification Latency 6x Without Generating Tokens — AlphaSignal](https://alphasignal.ai/news/pydantic-ai-adds-jev-to-cut-classification-latency-6x-without-generating-tokens)
- [Full Changelog: v2.45.0...v2.46.0](https://github.com/pydantic/pydantic-ai/compare/v2.45.0...v2.46.0)
