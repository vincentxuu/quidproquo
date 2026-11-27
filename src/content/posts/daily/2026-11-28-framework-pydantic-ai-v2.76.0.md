---
title: "框架更新｜Pydantic AI v2.76.0"
date: 2026-11-28
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.76.0 讓 realtime session 可以在連線不中斷的情況下換工具清單，另外補上跨 sub-agent 的成本歸戶與 CodeMode 直接交輸出"
tldr: "Pydantic AI v2.76.0 的主軸是 realtime session 不用斷線也能換工具：新增 UpdateTools，讓語音／即時連線在中途調整可用工具清單，不必重建連線。同時補上 root_conversation_id 讓巢狀 sub-agent 的花費歸戶到外層對話，CodeMode 也能直接從沙箱程式碼交出最終輸出。FileSystem.read_file 的 offset 改成從 1 起算，是這版最容易漏掉的行為變更。"
series:
  name: "AI Framework Changelog"
  order: 75
---

> :globe: [English version](/posts/daily/2026-11-28-framework-pydantic-ai-v2.76.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.76.0 |
| 前一版 | [v2.75.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0) |
| 發布日 | 2026-11-26 |
| Release Notes | [v2.76.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.4k |

## 這個版本為什麼重要

Realtime（語音／串流）session 建立之後，能用的工具清單以前是連線那一刻就定死的——想在對話中途加一個工具（例如使用者通過身分驗證後才解鎖「轉帳」工具），或拿掉一個不該再用的工具，唯一的辦法是斷線重連，連線重建的延遲和狀態遺失在語音場景裡特別明顯。這版把 `UpdateTools` 加進 `RealtimeConnection.send` 能接受的 `RealtimeInput` 裡,讓應用程式在連線存活期間直接推新的工具清單過去,不用重新建立連線。目前這條路徑只對會在 model profile 宣告 `supports_tool_updates: True` 的模型生效（預設是 `False`），所以現階段更像是先把介面定好，等 provider 端跟上；但對需要「分階段解鎖工具」的語音 agent（客服、身分驗證、分權限操作）來說，這是第一次有官方管道可以不斷線做到這件事。同一版另外補了一個多 agent 常見的痛點：巢狀 sub-agent 執行時，花費現在會透過 `root_conversation_id` 往上捲到最外層對話的 span，先前要自己拼 trace 才能算出一個多 agent 任務總共燒了多少 token。`CodeMode(allow_final_output=True)` 也值得注意——沙箱裡跑的程式碼現在可以直接交出整個 run 的最終輸出，不用再多繞一輪模型呼叫才拿到結構化結果。

```diagram
title: Pydantic AI v2.76.0：Realtime session 中途換工具
desc: 以前要換工具清單只能斷線重連；UpdateTools 讓同一條連線中途收到新的工具清單。
caption: 簡化示意，只畫受影響的工具更新路徑；沒宣告 supports_tool_updates 的模型連線行為不變。
---
<svg viewBox="0 0 680 320">
  <path class="dg-line" d="M160 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 176V224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 176V224" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="24" text-anchor="middle" dominant-baseline="central">之前</text>
  <rect class="dg-box dg-box--ghost" x="20" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="58" text-anchor="middle" dominant-baseline="central">想換工具清單</text>
  <text class="dg-sub" x="160" y="78" text-anchor="middle" dominant-baseline="central">例如驗證通過後解鎖新工具</text>

  <rect class="dg-box dg-box--ghost" x="20" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="140" text-anchor="middle" dominant-baseline="central">斷開 RealtimeConnection</text>

  <rect class="dg-box dg-box--ghost" x="20" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="244" text-anchor="middle" dominant-baseline="central">重新連線，語音／狀態中斷</text>

  <text class="dg-sub" x="520" y="24" text-anchor="middle" dominant-baseline="central">2.76.0 之後</text>
  <rect class="dg-box" x="380" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="58" text-anchor="middle" dominant-baseline="central">想換工具清單</text>
  <text class="dg-sub" x="520" y="78" text-anchor="middle" dominant-baseline="central">model profile 需 supports_tool_updates</text>

  <rect class="dg-box" x="380" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="140" text-anchor="middle" dominant-baseline="central">send(UpdateTools(...))</text>
  <text class="dg-sub" x="520" y="160" text-anchor="middle" dominant-baseline="central">連線不中斷</text>

  <rect class="dg-box" x="380" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="244" text-anchor="middle" dominant-baseline="central">同一條連線繼續對話</text>
</svg>
```

## 重要變更

- **Realtime session 中途換工具（`UpdateTools`）**：`RealtimeInput` 新增 `UpdateTools` 成員，`RealtimeModelProfile.supports_tool_updates` 宣告模型是否接受這個訊息 → 語音／即時 agent 可以在連線存活期間解鎖或收回工具，不用斷線重連；預設 `supports_tool_updates: False`，要等對應模型的 profile 開啟才會生效
- **巢狀 sub-agent 成本歸戶（`root_conversation_id`）**：巢狀 agent run 的 span 現在記錄 `pydantic_ai.root_conversation_id`，花費自動捲到最外層對話 → 多 agent 任務不用自己拼 trace，就能看到一個任務總共花了多少
- **`CodeMode(allow_final_output=True)`**：沙箱執行的程式碼可以直接提交整個 run 的最終輸出 → 省掉「程式碼跑完 → 再讓模型讀結果 → 模型才輸出結構化結果」的多一輪呼叫
- **`GoogleInteractionsModel`**：新增無狀態（stateless）的 Google Interactions 模型支援 → 多一種不依賴 server-side 對話狀態的 Google 模型用法
- **per-tool `ui_visibility`**：工具可以個別設定是否把結果回傳給前端 UI → 某些工具的輸出（例如內部除錯資訊）可以留在模型這邊，不用讓 UI adapter 轉送給使用者
- **`gemini-2.5-pro`／`gemini-2.5-flash` 停用警告**：透過 `GoogleModel`／`GoogleInteractionsModel` 呼叫這兩個模型會跳出 `DeprecatedModelWarning` → 提早收到訊號該換模型，而不是等官方真的下架才發現

## Breaking Changes

本版本沒有獨立的「Breaking Changes」區段，但官方列在「:warning: Compatibility Notes」的幾項會直接改變既有程式碼的行為：

- `RealtimeInput` 新增 `UpdateTools` 成員：
  - 影響範圍：對 `RealtimeInput` 做 exhaustive match（`assert_never`）的程式碼，型別檢查會開始失敗，要補上處理 `UpdateTools` 的分支或主動 raise
- `FileSystem.read_file` 的 `offset` 改成從 1 起算（原本是 0）：
  - 影響範圍：從 Python 呼叫 `read_file(..., offset=N)`，或自己建構帶 `offset` 的 `ReadFileArgs`／`ReadFileCallPart` 的程式碼，讀取起點會往前移一行，`offset=0` 會直接 raise；可以用 `grep -rn "read_file(.*offset" .` 找出要加 1 的呼叫點
- 使用 `SummarizingCompaction`／`RelevanceCompaction` 這類會中途裁減歷史的 capability 時，`result.conversation` 不再只帶「上一次的摘要」往下一輪跑：
  - 影響範圍：把 `result.conversation` 存進記憶體、下一輪繼續帶著跑的應用程式，現在每輪都會重新摘要整段歷史；想維持舊行為（只帶壓縮後的歷史），改成把 `result.all_messages()` 當 `message_history=` 傳入，摘要前的訊息想保留要自己先存起來
- `gemini-2.5-pro`／`gemini-2.5-flash` 的請求會跳出 `DeprecatedModelWarning`（屬於 `UserWarning`）：
  - 影響範圍：把警告轉成錯誤的設定（例如 `filterwarnings = error`）會直接炸掉這兩個模型的請求；要暫時維持現狀可以過濾這個警告，或設定 `profile={'deprecation': None}`

## 遷移指南

### 從 2.75.x 升級到 2.76.0

```bash
pip install --upgrade pydantic-ai==2.76.0
```

```python
# 舊寫法：對 RealtimeInput 做 exhaustive match 時沒有 UpdateTools 分支
match realtime_input:
    case TextInput():
        ...
    case AudioInput():
        ...
    case _:
        assert_never(realtime_input)  # 2.76.0 起會在這裡型別檢查失敗

# 新寫法：補上 UpdateTools 分支（或視情況 raise）
match realtime_input:
    case TextInput():
        ...
    case AudioInput():
        ...
    case UpdateTools():
        ...  # 處理工具清單更新，或明確忽略
    case _:
        assert_never(realtime_input)
```

```python
# 舊寫法：read_file 的 offset 從 0 起算
await toolset.read_file(path, offset=0)  # 從第一行開始讀

# 新寫法：offset 從 1 起算，offset=0 會 raise
await toolset.read_file(path, offset=1)  # 從第一行開始讀，等同舊版 offset=0
```

```python
# 舊寫法：result.conversation 存進記憶體，下一輪直接當 message_history 用
# （有裁減歷史的 capability 時，只會帶「上一次的摘要」繼續跑）
agent_result = await agent.run(prompt, message_history=result.conversation)

# 新寫法：想保留「只帶壓縮後歷史」的行為，改用 result.all_messages()
# 想保留完整訊息自己存，要在摘要發生前先存一份 result.conversation
agent_result = await agent.run(prompt, message_history=result.all_messages())
```

其餘像 `root_conversation_id`、`CodeMode(allow_final_output=True)`、`GoogleInteractionsModel`、per-tool `ui_visibility` 都是加法，不主動使用不影響既有程式碼。

## 與其他框架的對比觀察

「連線中途換能力」這個方向，目前只有 Pydantic AI 把它做在 realtime session 這一層——LangGraph、CrewAI 這幾週的更新仍集中在 checkpoint、tool 本身的功能疊加，沒有碰「連線存活期間動態調整模型可用工具」這塊。這和 Pydantic AI 本身押注 realtime voice agent（repo 說明已經把 realtime voice 列為頭等场景）有關：語音互動對斷線重連的延遲特別敏感，才會優先把這條路徑做出來，而不是先做更泛用但影響面更小的功能。

## 今日收穫

之前以為 realtime session 的工具清單是連線參數的一部分，跟模型名稱、系統提示一樣，連線建立後就定死,要換只能重新連。看到 `UpdateTools` 才意識到：工具清單其實更接近「執行期狀態」而不是「連線設定」,只是以前沒有訊息管道可以在連線存活期間改它。把工具可見性和連線生命週期分開處理，才讓「分階段解鎖工具」這種常見的語音 agent 需求有了官方支援的做法，不用再靠應用層自己模擬斷線重連。

## 參考資料

- [Pydantic AI v2.76.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0)
- [Full Changelog: v2.75.0...v2.76.0](https://github.com/pydantic/pydantic-ai/compare/v2.75.0...v2.76.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #12440：Realtime session 中途換工具（UpdateTools）](https://github.com/pydantic/pydantic-ai/pull/12440)
- [PR #14664：root_conversation_id 跨 sub-agent 成本歸戶](https://github.com/pydantic/pydantic-ai/pull/14664)
- [PR #11349：CodeMode(allow_final_output=True)](https://github.com/pydantic/pydantic-ai/pull/11349)
- [PR #12636：GoogleInteractionsModel](https://github.com/pydantic/pydantic-ai/pull/12636)
- [PR #14645：per-tool ui_visibility](https://github.com/pydantic/pydantic-ai/pull/14645)
- [PR #13250：FileSystem.read_file offset 改為 1-indexed](https://github.com/pydantic/pydantic-ai/pull/13250)
- [PR #13211：result.conversation 搭配歷史裁減 capability 的行為變更](https://github.com/pydantic/pydantic-ai/pull/13211)
- [PR #14679：gemini-2.5-pro／gemini-2.5-flash 停用警告](https://github.com/pydantic/pydantic-ai/pull/14679)
- [Pydantic AI v2.75.0 更新（上一版：指令權限邊界收緊）](/posts/daily/2026-11-26-framework-pydantic-ai-v2.75.0)
