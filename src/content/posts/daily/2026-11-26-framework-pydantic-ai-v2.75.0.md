---
title: "框架更新｜Pydantic AI v2.75.0"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.75.0 把兩處「誰的話算指令」的邊界收緊：workspace 檔案和 MCP 伺服器的指令，權限不夠就只能當成資料，不能再直接混進系統提示"
tldr: "Pydantic AI v2.75.0 的主軸是指令權限：RepoContext／Skills／Memory 讀到的低權限 workspace 檔案不再混進系統提示，改成資料傳給模型；capability 的 with_authority 現在也管得到 MCP 伺服器自己送的指令。另外新增 ModelEmptyResponseError／ModelInvalidResponseError，讓 FallbackModel 碰到空回應或壞掉的回應也能切換模型，不會直接中斷。"
series:
  name: "AI Framework Changelog"
  order: 72
---

> :globe: [English version](/posts/daily/2026-11-26-framework-pydantic-ai-v2.75.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.75.0 |
| 前一版 | [v2.74.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.74.0) |
| 發布日 | 2026-11-25 |
| Release Notes | [v2.75.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## 這個版本為什麼重要

這一版沒有新的 harness 原語，重心全部放在「哪些文字可以變成模型的指令」。`RepoContext`、`Skills`、`Memory` 這三個 capability 都會讀 workspace 裡的檔案——repo 的說明文件、技能腳本、記憶快照——以前只要檔案權限等級低於 `'operator'`，內容照樣會混進系統提示，等於讓任何能寫進這些檔案的人（協作者、外部來源同步進來的文件）間接對模型下指令。這版把這條路堵掉：低權限檔案不再進系統提示，改成讓模型用檔案工具自己讀、或是當成一般資料傳進對話，`Skills` 也改成用 `list_skills`／`load_skill` 工具公開，而不是直接塞進 capability 指令。另一個 PR 把同樣的邊界延伸到 MCP：capability 的 `with_authority` 現在管得到 `get_instructions()` 和 MCP 伺服器自己送的指令，低權限 capability（包括接進來的 MCP 伺服器）的指令會被包成使用者頻道上的資料，不再直接寫進系統提示。兩個 PR 分開送出，但解決的是同一個問題：「指令」和「資料」原本該有的界線，在 workspace 檔案和 MCP 整合這兩個路徑上都鬆動過，這版一次收緊。可靠性這邊也有一個值得注意的補強：`ModelEmptyResponseError`／`ModelInvalidResponseError` 讓空回應或格式錯誤的回應變成可被 `FallbackModel` 接住的錯誤類型，不會再直接丟 `AssertionError` 或 `IndexError` 中斷整個 run。

```diagram
title: Pydantic AI v2.75.0：指令權限邊界收緊
desc: 低於 operator 權限的內容（workspace 檔案、MCP 伺服器指令）這版開始被擋在系統提示之外，改成以資料形式交給模型自己判斷。
caption: 簡化示意，只畫受影響的兩條路徑；operator 權限的內容不受影響。
---
<svg viewBox="0 0 680 320">
  <path class="dg-line" d="M160 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 176V224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 94V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 176V224" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="24" text-anchor="middle" dominant-baseline="central">之前</text>
  <rect class="dg-box dg-box--ghost" x="20" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="58" text-anchor="middle" dominant-baseline="central">低權限 workspace 檔案</text>
  <text class="dg-sub" x="160" y="78" text-anchor="middle" dominant-baseline="central">RepoContext／Skills／Memory 讀到的內容</text>

  <rect class="dg-box dg-box--ghost" x="20" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="140" text-anchor="middle" dominant-baseline="central">直接混進系統提示</text>
  <text class="dg-sub" x="160" y="160" text-anchor="middle" dominant-baseline="central">和 operator 指令同一個等級</text>

  <rect class="dg-box dg-box--ghost" x="20" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="244" text-anchor="middle" dominant-baseline="central">模型當成指令執行</text>

  <text class="dg-sub" x="520" y="24" text-anchor="middle" dominant-baseline="central">2.75.0 之後</text>
  <rect class="dg-box" x="380" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="58" text-anchor="middle" dominant-baseline="central">低於 operator 的內容</text>
  <text class="dg-sub" x="520" y="78" text-anchor="middle" dominant-baseline="central">workspace 檔案 + MCP 伺服器指令</text>

  <rect class="dg-box" x="380" y="120" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="140" text-anchor="middle" dominant-baseline="central">以資料形式交付</text>
  <text class="dg-sub" x="520" y="160" text-anchor="middle" dominant-baseline="central">檔案工具讀取／使用者頻道的 framed data</text>

  <rect class="dg-box" x="380" y="224" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="244" text-anchor="middle" dominant-baseline="central">模型自行判斷是否採信</text>
</svg>
```

## 重要變更

- **Workspace 檔案權限邊界（`RepoContext`／`Skills`／`Memory`）**：低於 `'operator'` 權限的檔案內容不再混進系統提示，`RepoContext` 改成讓模型用檔案工具自己讀，`Skills` 改用 `list_skills`／`load_skill` 工具公開，`Memory` 的快照歸到它的 `MEMORY.md` → 協作者或外部來源能寫進的檔案，不會再自動變成對模型有效的指令
- **Capability 指令權限擴大到 MCP（`with_authority`）**：`get_instructions()` 和 MCP 伺服器自己送的指令都受 `with_authority` 管控，低權限 capability（含接進來的 MCP 伺服器）的指令改成使用者頻道上的 framed data，不再直接寫進系統提示 → 接外部 MCP 伺服器時，對方送來的指令不會自動取得和 operator 相同的信任等級
- **`ModelEmptyResponseError`／`ModelInvalidResponseError`**：空回應或格式不對的回應（例如 Mistral／OpenAI 回傳空的 `choices`）變成可識別的錯誤類型，`FallbackModel`／`ModelFallback` 的預設 `fallback_on` 會接住它們切換模型 → 以前這類情況是直接丟 `AssertionError`／`IndexError`，run 會整條中斷，現在至少有機會換一個模型繼續跑
- **`RunContext.submit_output()`**：讓工具呼叫內直接送出整個 run 的最終輸出 → 不用再讓模型多跑一輪才拿到結構化結果
- **`AnnounceWorkingDirectory`**：`Shell`／`FileSystem` 只在一開始講一次目前工作目錄 → 省掉每輪都重複講位置的提示字數
- **Pax `/trust` 與 token 化的 `/permissions`**：Pax（coding-agent TUI）新增資料夾信任提示，`approval_ask` 的 handler 改成接收 resume token → 在 Temporal／DBOS 等 durable engine（Lambda 除外）上自訂 approval handler 要跟著改簽名

## Breaking Changes

- `RepoContext`／`Skills`／`Memory` 讀到的低於 `'operator'` 權限檔案，內容不再出現在系統提示裡：
  - 影響範圍：依賴這些 capability 自動把 workspace 文件內容塞進提示的專案；`RepoContext(autoload_instructions=False)` 搭配巢狀指令檔的專案，升級後第一次請求會少吃到一次 prompt cache
- 低權限 capability（含 MCP 伺服器）的指令改成使用者頻道的 framed data，不再進系統提示：
  - 影響範圍：用 `with_authority` 把某個 capability（尤其是接進來的 MCP 伺服器）降權的專案；跨升級還在飛行中的 run，在 Temporal／DBOS 上如果後面還接了另一個 MCP 伺服器，可能撞到不確定性錯誤
- `ModelEmptyResponseError`／`ModelInvalidResponseError` 都是 `ModelAPIError` 的子類別，同時也是 `UnexpectedModelBehavior` 的子類別：
  - 影響範圍：原本寫 `except UnexpectedModelBehavior` 的程式碼不用改，但如果在它前面另外放了 `except ModelAPIError`，現在會先被那一段接住
- Pax `/permissions` 的 `approval_handler` 改成接收 resume token：
  - 影響範圍：在 AWS Lambda 以外的 durable engine 上自訂了 approval handler 的專案，沒跟著改簽名會在執行時丟 `UserError`

## 遷移指南

### 從 2.74.x 升級到 2.75.0

```bash
pip install --upgrade pydantic-ai==2.75.0
```

```python
# 舊寫法：FallbackModel 預設 fallback_on 不會接住空回應／格式錯誤
# （這類情況直接丟 AssertionError 或 IndexError，整條 run 中斷）

# 新寫法：預設 fallback_on 已經接住 ModelEmptyResponseError／ModelInvalidResponseError
# 想保留「直接中斷、不要 fallback」的舊行為，自己收斂 fallback_on：
from pydantic_ai.models import ModelAPIError, UnexpectedModelBehavior

model = FallbackModel(
    primary_model,
    backup_model,
    fallback_on=lambda e: isinstance(e, ModelAPIError) and not isinstance(e, UnexpectedModelBehavior),
)
```

```python
# 低權限 capability（例如接進來的 MCP 伺服器）要維持舊的「指令等級」行為，
# 就讓它留在預設的 'operator'，不要主動降權：
from pydantic_ai.mcp import MCP

# 想收緊信任邊界：
mcp_server = MCP(..., authority="lower-than-operator-value")
```

其餘像 `RunContext.submit_output()`、`AnnounceWorkingDirectory` 都是加法，不主動使用不影響既有程式碼。

## 與其他框架的對比觀察

巧的是，同一天（11/25）[Mastra @mastra/core@1.86.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0) 也在收緊類似性質的邊界：Mastra 讓 host 在 agent run 之外呼叫 Knowledge 工具時，身分（`principals`）必須來自 host 自己設定，絕對不能從 request 帶進來,專門針對 MCP／外部 agent 這種情境。兩家處理的是不同層——Pydantic AI 管的是「這段文字算不算指令」，Mastra 管的是「這次呼叫該用誰的身分」——但共同的關切是一樣的：外部觸發的動作，不該靠自己宣稱就拿到更高的信任等級。相比 CrewAI、LangGraph 這週仍以功能疊加為主，這兩家同一天不約而同往「權限邊界」補強，說明 MCP 和外部整合變多之後，「誰的話算數」已經變成框架層要正面處理的問題，不能只靠使用者自己注意。

## 今日收穫

之前以為 workspace 檔案權限（`'operator'` 以下）這個機制主要是管「模型能不能寫」這類操作權限。看到這版把它延伸到「這份檔案的內容能不能變成指令」才意識到：讀取權限和指令權限其實是兩件事,一份檔案即使只能被讀、不能被模型修改,只要它的文字進了系統提示,效果上就等同給了這份檔案的作者對模型下指令的能力。Pydantic AI 這版把「可讀」跟「可下指令」這兩層分開處理,補的正是這個以前被忽略的縫。

## 參考資料

- [Pydantic AI v2.75.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)
- [Full Changelog: v2.74.0...v2.75.0](https://github.com/pydantic/pydantic-ai/compare/v2.74.0...v2.75.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #11837：workspace 檔案權限邊界（RepoContext／Skills／Memory）](https://github.com/pydantic/pydantic-ai/pull/11837)
- [PR #14457：capability 指令權限擴大到 MCP（with_authority）](https://github.com/pydantic/pydantic-ai/pull/14457)
- [PR #12108：ModelEmptyResponseError／ModelInvalidResponseError](https://github.com/pydantic/pydantic-ai/pull/12108)
- [PR #11348：RunContext.submit_output()](https://github.com/pydantic/pydantic-ai/pull/11348)
- [PR #14427：AnnounceWorkingDirectory](https://github.com/pydantic/pydantic-ai/pull/14427)
- [PR #13195：Pax /permissions 的 token 化 approval handler](https://github.com/pydantic/pydantic-ai/pull/13195)
- [Mastra @mastra/core@1.86.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0)
- [Pydantic AI v2.71.0 更新（上次較大的原語更新）](/posts/daily/2026-11-20-framework-pydantic-ai-v2.71.0)
