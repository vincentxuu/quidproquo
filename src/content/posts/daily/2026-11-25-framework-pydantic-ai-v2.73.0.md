---
title: "框架更新｜Pydantic AI v2.73.0"
date: 2026-11-25
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.73.0 把「用到已被廠商棄用的模型」變成會跳警告，讓 SubAgents 能把子代理的待確認工具呼叫交還給呼叫端，也為 Agent.override 補上 capabilities；同時有幾項會改變行為的相容性調整。"
tldr: "Pydantic AI v2.73.0 對 Anthropic、OpenAI 已棄用的模型發出 DeprecatedModelWarning；SubAgents 可以把子代理的 deferred 工具呼叫交給呼叫端回覆後再繼續；Agent.override 新增 capabilities。要注意的相容性變更：openai 套件下限升到 3.50.0，Claude／Gemini／Grok 不支援的統一設定改成直接丟掉，FallbackModel 因此不再靠 400 錯誤切到下一個模型。"
series:
  name: "AI Framework Changelog"
  order: 74
---

> :globe: [English version](/posts/daily/2026-11-25-framework-pydantic-ai-v2.73.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.73.0 |
| 前一版 | [v2.71.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.71.0)（發布頁的完整變更記錄是 v2.71.0...v2.73.0，沒有 v2.72.0 的 release） |
| 發布日 | 2026-11-23 |
| Release Notes | [v2.73.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.73.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## 這個版本為什麼重要

這一版沒有單一的大功能，重心是把幾個「平常沒事、出事才發現」的地方先處理掉。最容易影響到你的是 `DeprecatedModelWarning`：只要請求指向 Anthropic 或 OpenAI 已經棄用的模型，框架現在會發出警告，不必等廠商真的下架、API 開始回錯才發現。第二個是多代理：`SubAgents` 現在能把子代理遇到的 deferred（待外部確認或執行）工具呼叫交給呼叫端，等答案回來再讓子代理接著跑，需要人工核准或外部系統結果的工具因此可以放進子代理，由呼叫端來回覆。第三個是行為變更：統一設定（unified settings）遇到 Claude、Gemini、Grok 不接受的欄位，現在直接丟掉不送，不再讓 API 回 400；這會順便改變 `FallbackModel` 的切換行為，升級前要先看過。

## 重要變更

- **`DeprecatedModelWarning`**：請求指向 Anthropic 或 OpenAI 已棄用的模型時發出警告 → 模型被廠商棄用的訊號變成開發階段就看得到，不必等線上失敗；若你的 CI 把 warning 當成錯誤，升級後可能先紅燈
- **`SubAgents` 轉交 deferred 工具呼叫**：子代理遇到的 deferred 工具呼叫交給呼叫端，答案回來後子代理接續執行 → 呼叫端可以替子代理回覆 deferred 工具呼叫，不必把這類工具留在最外層
- **`Agent.override` 支援 `capabilities`，並匯出 `AgentInstructions` 與 `SourcedInstruction`**：測試或臨時覆寫時可以直接換 capability → 不必為了覆寫單一能力重組整個 agent
- **OpenAI Responses 的 `input_transformations`**：現在出現在 `provider_details` 與模型請求 span 上 → 追蹤快取行為時多一個可觀察的欄位
- **即時語音**：`RealtimeSession.append_voice_instructions`（給 GPT-Live 語音模型）、`openai_voice` 接受自訂語音物件，另附 Twilio Media Streams 橋接範例
- **推理設定檔（thinking profiles）**：為 OpenAI 相容閘道上的 Nemotron、Inkling、MiMo、Step、Hy、Ling 系列新增
- **`E2BSandbox(idle_timeout=...)`**：避免忙碌中的 run 被 `sandbox_timeout` 暫停
- **`Coder` 讀圖縮放**：讀進來的圖片最長邊縮到 1024 像素以內，可用 `FileSystem(max_image_side=...)` 調整 → 圖片進模型前先縮小，省 token
- **安全與穩健性修補**：SSRF 防護的 `safe_download` 補齊 IANA 特殊用途網段（`192.88.99.2/32`、`2001::/23`）；`PlaywrightBrowser` 在 attach 錯誤訊息中遮蔽 CDP 端點的憑證；`gh-aw` 引擎只記錄 base URL 的 origin，避免 `PAI_BASE_URL` 內的憑證進到執行記錄；`web_fetch` 遇到特殊 HTML 數值不再用 `ValueError` 中斷整個 run；`clai` 預設模型從 `openai:gpt-5` 改為 `openai:gpt-6.1-sol`

## Breaking Changes

- 所有安裝 `openai` 的 extra，`openai` 下限從 3.31.0 提高到 3.50.0：
  - 影響範圍：把 `openai` 鎖在 3.50.0 以下的專案，升級時會解析失敗
- 統一設定中 Claude、Gemini、Grok 不接受的欄位改成直接丟掉，不再送出：
  - 影響範圍：原本靠 400 錯誤讓 `FallbackModel` 切到下一個模型的組合，現在會留在第一個模型、只是少了那個設定；要保留該設定，請把支援它的模型排在第一位
- `Agent._override_root_capability` 這個私有 context variable 現在存的是 `(capability, injected)` 元組：
  - 影響範圍：直接讀取該私有變數的程式碼需要更新
- `coder` extra 現在會安裝 `pillow>=12.3.0`；`pydantic-ai-harness[boxd]` 現在要求 `boxd>=0.3.3,<0.4`：
  - 影響範圍：固定了舊版 pillow／boxd 的環境，以及直接呼叫 boxd 0.2 專屬 API 的程式碼
- `Dataset` 檔案與 schema 不再包含 `init=False` 的 evaluator 欄位，`ClassVar` 註記也不再讓 `to_file()` 出錯：
  - 影響範圍：有手動編輯或比對舊 Dataset 檔案內容的流程

## 遷移指南

### 從 2.71.x 升級到 2.73.0

```bash
pip install --upgrade pydantic-ai==2.73.0
# 若環境把 openai 鎖在舊版，同步放寬：
pip install --upgrade "openai>=3.50.0"
```

升級後先跑一輪測試，留意三件事：

1. 輸出裡有沒有新的 `DeprecatedModelWarning`——有的話代表你正在用已被棄用的模型，趁這時候換掉。
2. 如果用 `FallbackModel`，且第一個模型是 Claude、Gemini 或 Grok，而你設了這些模型不支援的統一設定，確認「少了那個設定仍留在第一個模型」是你要的行為；不是的話，把支援該設定的模型排到最前面。
3. 有直接依賴 `Agent._override_root_capability` 的測試工具，改成讀新的元組格式。

其餘如 `SubAgents` 的 deferred 轉交、`Agent.override(capabilities=...)`、`E2BSandbox(idle_timeout=...)` 都是新增，不主動使用就不影響既有程式碼。

## 與其他框架的對比觀察

[v2.71.0](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0) 一口氣補了十幾個 harness 原語，這一版則轉去處理上線後才會碰到的問題：被棄用的模型、子代理遇到需要人工核准的工具、統一設定在不同廠商之間的行為差異。放在框架競爭的脈絡裡，這說明 Pydantic AI 目前的重心已經從「多一個原語」移到「讓既有原語在真實部署裡不出意外」。我們沒有查到同一天其他追蹤框架的對照資料，這裡不做橫向比較。

## 今日收穫

之前以為「統一設定」的價值是同一份設定可以跨廠商使用，所以失敗就該明確報錯。這一版選的是相反的取捨：不支援的欄位直接丟掉，讓請求能成功送出——代價是靠 400 切換模型的 `FallbackModel` 組合會悄悄改變行為。同一個「跨廠商抽象層」的決定，會同時影響錯誤處理和備援策略，升級時看的不只是 API 有沒有改，還有原本依賴的「失敗訊號」是不是還在。

## 參考資料

- [Pydantic AI v2.73.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.73.0)
- [Full Changelog: v2.71.0...v2.73.0](https://github.com/pydantic/pydantic-ai/compare/v2.71.0...v2.73.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #14038：DeprecatedModelWarning](https://github.com/pydantic/pydantic-ai/pull/14038)
- [PR #14115：SubAgents 轉交 deferred 工具呼叫](https://github.com/pydantic/pydantic-ai/pull/14115)
- [PR #12551：Agent.override 新增 capabilities](https://github.com/pydantic/pydantic-ai/pull/12551)
- [PR #12426：丟掉 Claude、Gemini、Grok 不接受的統一設定](https://github.com/pydantic/pydantic-ai/pull/12426)
- [PR #14056：OpenAI Responses input_transformations 與 openai 下限](https://github.com/pydantic/pydantic-ai/pull/14056)
- [PR #14196：Coder 讀圖縮放與 FileSystem(max_image_side)](https://github.com/pydantic/pydantic-ai/pull/14196)
- [PR #14212：safe_download 補齊 IANA 特殊用途網段](https://github.com/pydantic/pydantic-ai/pull/14212)
- [Pydantic AI v2.71.0 更新（上一個較大的原語更新）](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0)
