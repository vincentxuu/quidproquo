---
title: "Rivumi 的 provider-neutral agent loop：為什麼把模型當元件而不是 orchestrator"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, ai-agent, python, llm]
lang: zh-TW
tldr: "Rivumi 是一個 Python-first coding agent。它的核心斷言是『loop 屬於 harness，不屬於模型』：ModelProvider 是個 Protocol，OpenAI / Anthropic / Gemini / Workers AI 都只是 transport；AgentRunner 自己持有 step / repetition / wall-time 三層 guards，所有 deterministic 規則——路徑 allowlist、argv、process group、token 預算、驗證閘——都寫在 Python 程式碼裡，不寫在 prompt。這篇拆解它的設計決定、執行骨架、跟 Claude Code / Codex / Aider / mini-SWE-agent 的差異，以及為什麼這種 provider-neutral 的代價是值得的。"
description: "深入介紹 Rivumi coding agent 的 provider-neutral loop 設計：AgentRunner 的 step / repetition / wall-time guards、ModelProvider Protocol、ContractModel 不可變設計、與 Claude Code / Codex / Aider 等的架構差異。"
series:
  name: "Rivumi 架構拆解"
  order: 1
draft: false
---

[Rivumi](https://github.com/vincentxuu/rivumi) 是一個 Python-first coding agent,作者把它定位成「provider-neutral coding agent harness」。這八篇系列要把它拆開看——這是第一篇,核心斷言:**agent loop 不屬於模型,屬於 harness**。模型是個被呼叫的元件,不是 orchestrator;OpenAI / Anthropic / Gemini / Workers AI / Ollama 都只是 `ModelProvider` Protocol 下的 transport。所有的 deterministic 規則——路徑 allowlist、argv 嚴格化、process group timeout、token / step / wall-time budget、verification 閘——都寫在 Python 程式碼裡,不寫在 prompt。

理解這個斷言之後,Rivumi 其他的設計決定(為什麼源 repo 不被改、為什麼 disposable clone 必須 detached、為什麼 `LocalGitWorkspace` 不是 sandbox、為什麼 verification 失敗才算 loop 終止)就全部串起來了。

## 為什麼 loop 必須 provider-neutral

多數 coding agent 的 loop 都長這樣:

```
loop:
  prompt = build_prompt(history, tools)
  response = provider.complete(prompt)   # 模型自己決定下一步
  for tool_call in response.tool_calls:
      result = execute(tool_call)
      history.append(result)
  if response.is_final: break
```

這個寫法把 loop 的控制權交給模型:模型決定何時結束、決定呼叫什麼工具、決定要不要驗證。在小 fixture 上沒問題,但放到真實專案就會撞牆:

- **模型會自認完成**:model 自己說「修好了」不是驗證證據,真正能決定 patch 可不可用的是測試退出碼。
- **模型會重複同一個動作**:同一個失敗的 `apply_patch` 連叫三次,既浪費 token 又會把 patch 預算燒光。
- **模型會忘記預算**:把整個工具輸出原文塞進下一次 prompt,沒人在意上下文。
- **模型會繞過沙盒**:如果 loop 用一般 shell,模型可以在 prompt injection 下任意讀檔。

Rivumi 把這些全部從 prompt 搬出來,放進 `AgentRunner`。它對模型只說一句:**你給我 tool_calls,我幫你跑;跑完的 observation 我塞回 history;你什麼時候決定結束,我要先跑過驗證才算數。**

## AgentRunner:三層 guards 與一次 run 的全貌

整個 loop 的入口是 `src/rivumi/loop.py` 裡的 `AgentRunner.run()`,約 340 行。一個 `run()` 包含三層 deterministic guards:

- **step guard**:`while self._step < self.task.limits.max_steps`,預設 12 步。
- **repetition guard**:`_record_fingerprint(call)` 偵測同一個 tool call 連續出現三次就 hard fail,terminal reason 是 `repeated_action`。
- **wall-time guard**:跑前算 `deadline = monotonic + (wall_time_budget - already_active_wall_time)`,每一個 await 都呼叫 `self._remaining(deadline)`,超時就 raise `TimeoutError`,外層接住回傳 `RunStatus.FAILED` + `terminal_reason="wall_time_exceeded"`。

整個 `run()` 的骨架(節錄自 `loop.py:707-1051`):

```python
async def run(self) -> RunResult:
    self._run_started_monotonic = time.monotonic()
    deadline = self._run_started_monotonic + (
        self.task.limits.wall_time_seconds - self._active_wall_time_base
    )
    try:
        if not self.allow_unsafe_local_exec and not self._interactive_approvals:
            raise UnsafeLocalExecutionError(
                "local verification executes repository code without an OS sandbox; "
                "set allow_unsafe_local_exec=True only for a trusted repository"
            )
        if not self.model.capabilities.tool_calling:
            raise ValueError(
                f"model {self.model.provider_name}/{self.model.model_id} "
                "does not advertise tool calling"
            )
        # ... 新 run:寫 manifest / 準備 disposable workspace / 初始化 messages ...
        while self._step < self.task.limits.max_steps:        # ← step guard
            if self._cancel_requested.is_set(): ...
            try:
                remaining = self._remaining(deadline)         # ← wall-time guard
            except TimeoutError:
                return await self._finish(
                    status=RunStatus.FAILED,
                    terminal_reason="wall_time_exceeded", ...)
            self._step += 1
            turn = await self._complete_model_or_cancel(remaining)
            if turn is None: return await self._finish(... CANCELLED ...)
            self._messages.append(turn.as_message())
            if turn.tool_calls:
                for call in turn.tool_calls:
                    if self._record_fingerprint(call):        # ← repetition guard
                        return await self._finish(
                            status=RunStatus.FAILED,
                            terminal_reason="repeated_action", ...)
                    # ... approval / execute / observation ...
                continue
            # 模型沒出 tool_calls:跑 verification
            outcomes = await self._verify_all(deadline)
            if all(outcome.ok for outcome in outcomes):
                return await self._finish(status=RunStatus.COMPLETED, ...)
            # 否則把失敗回饋塞回 messages 讓模型修
            ...
        return await self._finish(
            status=RunStatus.FAILED,
            terminal_reason="max_steps_exceeded", ...)
    except ProviderError as exc: ...
    finally: ...
```

注意三件事:第一,**模型出 tool_calls 不會結束 loop**;只有「沒出 tool_calls」才會進入 `_verify_all()`,這是 verification-as-gate。第二,**驗證失敗的輸出會被當成 user message 塞回 history**(標記為「untrusted test output」),模型在下一輪有機會修,但同一個失敗 fingerprint 達三次一樣 hard fail。第三,**所有終止路徑都帶 `terminal_reason`**:verified / wall_time_exceeded / max_steps_exceeded / repeated_action / user_cancelled / provider_*,沒有任何一個是「silent success」。

## 重複偵測怎麼寫:hash + 計數,不是 prompt

repetition guard 是我覺得最值得單獨看的細節。`loop.py:517-534`:

```python
@staticmethod
def _fingerprint(call: ToolCall) -> str:
    payload = json.dumps(
        {"name": call.name, "arguments": call.arguments},
        ensure_ascii=False, sort_keys=True, separators=(",", ":"),
    ).encode()
    return hashlib.sha256(payload).hexdigest()

def _record_fingerprint(self, call: ToolCall) -> bool:
    fingerprint = self._fingerprint(call)
    if fingerprint == self._last_fingerprint:
        self._repeat_count += 1
    else:
        self._last_fingerprint = fingerprint
        self._repeat_count = 1
    return self._repeat_count >= 3
```

這段做了幾個聰明的決定:用 `sort_keys=True` + `separators=(",", ":")` 讓 JSON 正規化,模型就算把 `{"a": 1, "b": 2}` 寫成 `{"b":2,"a":1}` 也算同一個;用 SHA-256 而不是自己寫 `__eq__`,因為 fingerprint 還要序列化進 `checkpoint.json` 跟 `manifest`,hash 形式最穩。計數器跨 step 持有,所以「同一個 tool call 出現第三次」是跨多輪的,不是單輪內的。

把這個放進 Python 而不是 prompt,理由跟在限速器或重試邏輯上一樣:**這個決定不該被模型自己改**。如果寫成「如果三次重複就停下」這種 instruction,模型可以假裝忘記、可以辯稱「這次跟上次不一樣因為 X」、可以在壓力下忽略;寫成 `_record_fingerprint`,模型連看到這段規則的機會都沒有——它只能從 `terminal_reason="repeated_action"` 這個回傳值知道發生過。

## ModelProvider:五個 transport 共用一個 Protocol

`models.py:64-79`:

```python
@runtime_checkable
class ModelProvider(Protocol):
    provider_name: str
    model_id: str
    protocol: ModelProtocol
    capabilities: ModelCapabilities

    async def complete(
        self,
        messages: Sequence[ConversationItem],
        tools: Sequence[ToolDefinition] = (),
    ) -> ModelTurn: ...

    async def aclose(self) -> None: ...
```

`complete()` 是非串流的——`ModelTurn` 是一次性回傳的 content + tool_calls + usage + finish_reason,沒有 streaming delta。這個選擇不是省事,是設計:Rivumi 把「輸出累積與截斷」做成 `bounded_text(turn.content, 2_000)` 在 loop 裡呼叫,而不是讓每個 adapter 自己處理 streaming chunk;streaming 屬於未來可能要加的 `ModelCapabilities.streaming=True` 路徑,但預設關閉。

`protocol` 欄位是 `ModelProtocol` enum,跟 provider 身份解耦:

```python
class ModelProtocol(StrEnum):
    SCRIPTED = "scripted"
    OPENAI_CHAT = "openai_chat"
    OPENAI_CODEX_RESPONSES = "openai_codex_responses"
    ANTHROPIC_MESSAGES = "anthropic_messages"
    GEMINI_GENERATE_CONTENT = "gemini_generate_content"
    WORKERS_AI_RUN = "workers_ai_run"
```

意思是同一個 OpenAI 相容 adapter 可以切 `OPENAI_CHAT` 給 Ollama、給自架 vLLM、給官方 API;同一個 transport 也可以在切換 endpoint 時保留 manifest 標記。adapter 只需要把 provider-specific 的 request / response 翻譯成 canonical 的 `ConversationItem` / `ModelTurn`,其餘一切照 canonical 跑。

錯誤也是 canonical 的:`ProviderError` 帶 `kind: ProviderErrorKind`(`RETRYABLE` / `AUTH` / `RATE_LIMIT` / `INVALID_REQUEST` / `PROVIDER`)跟 `retryable` property。HTTP 401 → auth、429 → rate_limit、5xx → retryable、Workers AI code 7505 → rate_limit——所有 SDK 特定的錯誤都被收斂成這五類,`AgentRunner` 只要 catch `ProviderError` 就能寫出統一的 terminal reason,不需要知道下游用的是 `openai` 還是 `anthropic` SDK。

## ContractModel:不可變 + extra=forbid,讓跨邊界值安全

所有跨元件的值都用 `src/rivumi/contracts.py` 的 `ContractModel`:

```python
class ContractModel(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
```

兩個關鍵設定:`extra="forbid"` 代表未宣告的欄位會 raise,而非靜默忽略;`frozen=True` 代表實例建立後不能再改。前者擋下「provider 回傳新欄位但 adapter 沒更新」的靜默 bug,後者讓 `Message` / `ToolObservation` / `VerificationOutcome` 可以放心地放進 list / set / checkpoint,不用擔心某一層偷偷 mutate。

`TaskContract` 是這個精神的代表:

```python
class TaskContract(ContractModel):
    repository: Path
    instruction: str = Field(min_length=1)
    allowed_paths: tuple[str, ...] = Field(min_length=1)
    verification: tuple[VerificationCommand, ...] = Field(min_length=1)
    limits: Limits = Field(default_factory=Limits)
    task_id: str = Field(default_factory=lambda: uuid4().hex, min_length=1)
    base_sha: str | None = None
```

注意 `allowed_paths` 跟 `verification` 都是 `tuple` 而非 `list`——`tuple` 是不可變序列,跟 `frozen=True` 一致。`VerificationCommand.argv` 也是 tuple,而且經過 validator 拒絕空字串、NUL byte、非嚴格字串,搭配執行時的 `shell=False` 子行程,確保「驗證指令是 allowlist 內的 argv」這個承諾可以從程式碼層級守住,而不是依賴 shell escaping 的運氣。

## Limits 放程式碼不放 prompt:每條都是 deterministic guard

```python
class Limits(ContractModel):
    max_steps: int = Field(default=12, ge=1)
    wall_time_seconds: float = Field(default=900.0, gt=0)
    max_tool_output_bytes: int = Field(default=200_000, ge=1)
    max_patch_bytes: int = Field(default=100_000, ge=1)
```

這四條不是給模型看的建議,是 `AgentRunner` 真的會 raise / truncate / fail 的 guard:`max_steps` 控制外層 while、`wall_time_seconds` 算 deadline、`max_tool_output_bytes` 在 `ToolExecutor` 截斷單次工具輸出、`max_patch_bytes` 在 `apply_patch` 累積時累計。

放在程式碼的理由跟在 production 寫 rate limiter 一樣——**預算不能由被控管的對象自己設定**。如果寫成「請在 12 步內完成」這種 system prompt,模型永遠可以辯稱「再多一步就好」;寫成 `Field(default=12, ge=1)`,超過就是 `terminal_reason="max_steps_exceeded"`,沒有商量。

## 跟 Claude Code / Codex / Aider 的差異

把 Rivumi 放在 coding agent 競品光譜裡,定位比較清楚:

| 專案 | Loop 歸屬 | Provider boundary | Verification gate |
|---|---|---|---|
| **Rivumi** | 自己寫的 `AgentRunner` | Canonical `ModelProvider` Protocol,五個 transport | 自己 rerun 全部 `verification` argv 才算 COMPLETED |
| **Claude Code** | 跟 Anthropic SDK 綁定 | Anthropic 為主 | 由模型宣告 + 內部 heuristic |
| **Codex CLI** | OpenAI Responses + 自家 loop | OpenAI 為主,OAuth 訂閱 | 模型宣告 + CLI 內 sandbox 退出碼 |
| **Aider** | 跟模型 API 直連 | 多 provider 但各自寫 adapter | 依賴模型主動呼叫 lint / test |
| **mini-SWE-agent** | 極簡 Python loop | 多 provider | 跟 Aider 類似 |

差異的本質是兩個:**loop 是公開抽象還是隱私,verification 是 Python guard 還是模型自我宣告**。Rivumi 選前者,代表它可以(也真的)在不改 loop 的前提下加 Ollama、加 Workers AI、把 CodeX CLI 包成外部 runtime(`ExternalCodingRunner`)卻仍然跑同一份 verification——這些在後續幾篇會拆。

## 整體架構

```
TaskContract ──┐
               ▼
        AgentRunner ─── events.jsonl / checkpoint.json / request.json
        │      │  \
        │      │   └── ModelProvider (Protocol)
        │      │         ├─ Scripted (deterministic fixture)
        │      │         ├─ OpenAI-compatible (Ollama / vLLM / 官方)
        │      │         ├─ Anthropic (Messages API)
        │      │         ├─ Gemini (generateContent)
        │      │         └─ Workers AI (run endpoint)
        │      │
        │      └──── ToolExecutor → SafePathPolicy → LocalGitWorkspace
        │                          ├─ list_files / read_file / search_text
        │                          ├─ apply_patch (unified diff + 累積上限)
        │                          ├─ replace_text (精確字串替換)
        │                          ├─ run_check (allowlisted argv)
        │                          └─ git_diff
        │
        └────── verification: 重新跑 task.verification 全部 argv,全 pass 才 COMPLETED
```

## 整體來說

Rivumi 押注的不是「哪個模型最強」,而是「loop 該長什麼樣」是一個獨立、可審計、可測試的工程問題。這篇看到的——`AgentRunner` 的三層 guards、`ModelProvider` Protocol 的 transport 解耦、`ContractModel` 的不可變 + extra=forbid、`Limits` 放程式碼不放 prompt——都是把這個押注貫徹到底的具體選擇。

它的代價是顯而易見的:多寫很多程式碼(1051 行的 loop.py)、所有 provider adapter 都要做 canonical 翻譯、不能直接 reuse 模型 SDK 的 streaming / function calling 進階功能。它的回報是:**同一份 loop 可以接五種 transport,未來接第六種不需要改核心**;同一份 verification 可以在外部 runtime(Codex CLI / Claude Code CLI)跑完後再回來驗;同一份 `RunResult` 對任何 provider 都有同樣的欄位,下游(UI、CI、Cloudflare Worker)不需要做 provider-specific 處理。

下一篇拆 `LocalGitWorkspace` 跟 disposable clone——為什麼源 repo 不能被改、為什麼必須 detached HEAD、為什麼這個「沙盒」不是真的沙盒。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi M1 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m1-local-harness.md)——agent loop 的官方設計說明
- [mini-SWE-agent](https://github.com/SWE-bench/mini-SWE-agent)——Rivumi 明確參考的「Model / Agent / Environment Python boundary」來源
- [Aider](https://aider.chat/)——Rivumi 採用 unified diff 與 Git 作為 review boundary 的參考對象
- [SWE-ReX](https://github.com/SWE-bench/SWE-ReX)——Rivumi 採用「agent / runtime 分離」概念的參考對象
- [OpenAI Codex CLI](https://github.com/openai/codex)——Rivumi 採用「sandbox capability 與人為 approval 分離」的參考對象
- [Pydantic v2 — strict mode 與 frozen model](https://docs.pydantic.dev/latest/concepts/strict_mode/)——`ContractModel` 的 `extra="forbid"` 與 `frozen=True` 行為文件
