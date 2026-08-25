---
title: "用 Python 寫私人 coding agent：M1 先把 local harness 做對"
date: 2026-08-21
category: ai
tags: [coding-agent, python, harness-engineering, sandbox, tool-use, software-engineering]
lang: zh-TW
type: project
description: "實作 Python coding agent 的第一個里程碑：provider-neutral loop、disposable Git workspace、硬限制、unsafe local execution 與可審查 artifact。"
tldr: "M1 不追求做出另一個完整 IDE agent，而是先證明一個 Python harness 能在固定 Git commit 上產生 patch、重跑確定性檢查並留下證據；但 disposable clone 不是 OS sandbox，本機執行必須明確 opt in。"
draft: false
---

我想做自己的 coding agent，但第一個問題不是「要接哪個模型」，而是：**當模型犯錯、repository 裡藏著惡意指令，或測試本身會執行任意程式碼時，哪一層真的能限制損害？**

所以 M1 沒有先做 TUI、MCP、RAG、多 agent，也沒有急著部署 Cloudflare。它只做一個 Python-first local harness：接收範圍明確的任務，在 disposable Git workspace 裡讓模型讀檔、產生 patch、跑指定檢查，最後交回 diff 與完整執行證據。

## TL;DR

- agent loop 很小，真正的工作在 loop 外圍的 contract、policy、runtime 與 verification。
- 模型供應商只能存在 adapter 裡；loop 只認 canonical message、tool call、usage 與 error。
- disposable Git clone 保護來源 worktree，**但不隔離 process、network 或作業系統**。
- 因此 local verification 預設拒絕執行，只有信任 repository 時才能顯式開 `--unsafe-local-exec`。
- M1 的成功條件不是模型說「完成」，而是 harness 重跑全部檢查、產生可審查 patch，並寫出一致的 artifact bundle。

## 這次真正要造的輪子

[前一篇談 coding agent internals](/posts/ai/2026-08-16-cs146s-agent-internals)時，核心 loop 可以縮成一個 while：把訊息交給模型、執行 tool call、把 observation 放回 context，再問下一輪。

這次實作後，我更確定「自己造輪子」值得做的不是重寫模型 SDK，而是把 harness 的責任弄清楚：

```text
TaskContract
    |
    v
AgentRunner ---------------------- events / checkpoint / result
    |                  \
    |                   -> ModelProvider
    |                        |- Scripted
    |                        |- OpenAI-compatible
    |                        |- Anthropic
    |                        |- Gemini
    |                        `- Workers AI
    v
ToolExecutor -> SafePathPolicy -> disposable Git workspace
    |
    `-> patch + deterministic checks + review artifacts
```

M1 只有六個工具：列檔案、讀檔、文字搜尋、套用 unified diff、執行已宣告的 check、取得 Git diff。沒有一般 Bash，也不允許模型自己拼一段 shell command。

## ModelProvider 必須真的通用

如果 loop 裡出現 `if provider == "anthropic"`，那就不算 provider-neutral。這一版把模型邊界縮成同一個 async protocol：

```python
class ModelProvider(Protocol):
    provider_name: str
    model_id: str
    capabilities: ModelCapabilities

    async def complete(
        self,
        messages: Sequence[ConversationItem],
        tools: Sequence[ToolDefinition] = (),
    ) -> ModelTurn: ...

    async def aclose(self) -> None: ...
```

OpenAI、Anthropic、Gemini 與 Workers AI 的 message、tool result、usage、error envelope 都只在 adapter 內轉換。loop 不會看到 SDK type，也不需要因為換模型而改控制流程。`ScriptedModel` 也走完全相同的介面，讓端到端測試不需要真的花 API 費用。

這個抽象在 review 時也真的被挑戰過。第一版有幾個看似很小、實際會破壞第二輪工具呼叫的問題：OpenAI tool message 多送了 schema 沒有的 `name`；Gemini 的 function call ID 與 thought signature 會在 canonical message 裡遺失；Workers AI 的 HTTP 200 error envelope 會把 rate limit 誤判成一般 provider error。後來補上 opaque `provider_metadata`、一致的 lifecycle、provider-reported token total，以及明確的錯誤分類。

另一個刻意保守的選擇是：真實 adapter 對未知 model 的 tool-calling capability 預設為 `false`。使用者必須顯式宣告模型支援工具，不能因為 provider 名稱看起來熟悉就假裝已驗證。

目前這些 provider 測試全部使用 injected fake client 或 HTTP transport。它們證明 adapter contract 與序列化行為，但**不代表任何一個真實 API、model ID 或 tool-calling 組合已通過 live test**。

## Disposable Git workspace 不是 sandbox

M1 會從固定的完整 commit SHA 建立 `--no-hardlinks` detached clone。agent 改的是副本；來源 repository 的 HEAD、working-tree status 與檔案 bytes 都不該改變。這解決的是「不要碰壞我的真實 worktree」。

它沒有解決的是：

- 測試程式能不能讀取主機其他路徑；
- subprocess 能不能連外；
- 惡意 dependency 能不能存取同一個 OS 使用者權限下的資源；
- process tree 能不能影響 workspace 以外的系統。

所以 `git clone` 不能被叫做安全沙箱。CLI 預設會 fail closed，只有明確傳入 `--unsafe-local-exec` 才會在本機執行 repository code。這個 flag 不是「開啟 sandbox」，而是使用者承認：**我信任這個 repository，願意承擔沒有 OS isolation 的風險。**

真正的不受信任程式碼，要等後續接 Docker 或 Cloudflare Sandbox。到那時 Python loop 不應改寫，只替換 execution backend。

## Prompt 不是權限系統

system prompt 會提醒模型只能改哪些路徑，但真正的限制都寫在 Python：

- `allowed_paths` 拒絕 absolute path、parent traversal、`.git` 與 symlink escape；
- verification 只能從具名 allowlist 選 exact argv，執行時固定 `shell=False`；
- subprocess 使用精簡環境，不繼承 API、GitHub token 或其他 credential；
- steps、wall time、tool output、patch bytes、patch lines、changed files 與重複 action 都有上限；
- final answer 不等於成功，harness 仍會重跑每一個 required check；
- patch、events、checkpoint、test log 與 terminal result 都要落盤。

這正是[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)的實作版：模型負責需要判斷的部分，確定性的安全與完成條件交還程式碼。Repository 與 tool output 都是不可信資料；[prompt injection 的損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)必須放在 tool boundary，而不是多寫幾句「絕對不要」。

## M1 怎麼算完成

測試 fixture 故意放了一個很小的 bug：`add(2, 3)` 回傳 `-1`。Scripted model 必須用真實 loop 與工具讀檔、套 patch、執行檢查；結束後來源 repository 完全不變，disposable workspace 的測試通過，artifact 彼此同意這次 run 的 terminal state。

最終 release gate：

- Ruff：all checks passed
- Pytest：55 passed（8.52 秒）
- CLI help：成功載入完整 `coding-agent run` options
- Python package build：sdist 與 wheel 皆成功
- Offline fixture smoke：`completed` / `verified`，只修改 calculator
- Smoke run ID：`eb638d159c184786915dba3fef0045ce`
- `git diff --check`：通過
- M1 baseline commit：`859db23`（commit 前另從 staged snapshot 建立獨立 checkout，Ruff 與 55 tests 皆通過）

這組數字來自同一次最終 evidence run。M1 文件先前也曾記過一組通過結果，但之後又加入 fail-closed local execution、provider roundtrip metadata、process cleanup 與更完整的 limits；舊 run 不能替新實作背書，所以最後整批重跑一次。

## 這個版本刻意不做什麼

M1 不會 push、開 PR 或 deploy；沒有 checkpoint resume、active-writer fencing、自動 retry、provider routing、streaming、context compaction、artifact secret scanner 或 network egress policy。它也不是 hostile-code runner。

這些不是忘了做，而是先固定責任邊界。等 local harness 的 release gate 綠了，下一步才有資格把 execution backend 搬進 Cloudflare Sandbox，再討論 D1/R2、Durable Objects、Workflows 或遠端控制面。

整體取捨很簡單：第一階段不追求「像 Claude Code 一樣功能很多」，先追求每次執行都能回答三個問題——模型做了什麼、程式碼怎麼限制它、我憑什麼相信結果。

---

## 參考資料

- [mini-SWE-agent](https://github.com/SWE-agent/mini-swe-agent) — Python Model / Agent / Environment 邊界
- [Aider](https://github.com/Aider-AI/aider) — Git diff、edit format 與 lint/test feedback
- [SWE-ReX](https://github.com/SWE-agent/swe-rex) — agent 與 execution environment 分離
- [OpenAI — Running Codex safely](https://openai.com/index/running-codex-safely/) — sandbox capability 與 approval 的界線
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) — 後續 hostile-code execution backend 的候選
- [QuidProQuo：coding agent 的內部構造，其實是一個 while 迴圈](https://quidproquo.cc/posts/ai/2026-08-16-cs146s-agent-internals)
- [QuidProQuo：模型只是元件，harness 才是系統](https://quidproquo.cc/posts/ai/2026-08-10-model-component-harness-system)
- [QuidProQuo：prompt injection 只能在 harness 層做損害控制](https://quidproquo.cc/posts/ai/2026-08-10-agent-security-harness-layer)
