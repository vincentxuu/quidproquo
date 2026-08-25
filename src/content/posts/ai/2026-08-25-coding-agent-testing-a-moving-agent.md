---
title: "跟成熟 coding agent 學設計（24）：測試一個會動的 agent——fake-CLI 合約、錄製串流、TUI pilot"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 24
tags: [coding-agent, testing, rivumi, codex, textual]
lang: zh-TW
tldr: "agent 的兩個依賴——LLM 和外部 CLI——都不是決定性的，但成熟專案的招式是把「會動的部分」與「邊界的形狀」切開：codex 用 wiremock 假 Responses API 加腳本化 SSE server，TUI 用 insta 快照；opencode 乾脆做了 VCR 式的 http-recorder 錄放套件；pi 把 eval 與 unit test 分成兩份 vitest config；omp 把 edit benchmark 本身用 unit test 圍起來。rivumi 對外部 CLI 做了四層：單元測試、fake-CLI 合約、錄製串流整合、Textual pilot TUI 測試。核心方法論一句話：錄下真實的非決定性輸出，對它做決定性的斷言。"
description: "對照 codex、opencode、pi、omp、claude-code 五家的測試策略，拆解「如何測試一個依賴 LLM 與外部 CLI 的非決定性系統」，並說明 rivumi M13 的四層測試設計：單元、fake-CLI 合約、錄製串流整合、Textual pilot TUI。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-testing-a-moving-agent-en)

[系列總覽](/posts/ai/2026-08-25-coding-agent-design-series-overview)說好每篇五段、證據給到 `repo/path/file.ext#symbolName`。這篇的主題是最難寫的那種測試：受測系統自己不聽話。

先講取證範圍：五家都在本地 clone 實際 grep 過——**codex**（openai/codex Rust workspace）、**opencode**（sst/opencode）、**pi**（badlogic/pi-mono）、**omp**（can1357/oh-my-pi）、**claude-code**（社群反編譯 v2.1.88）。rivumi 側引用 M13 stage doc 與 commits `573c752`/`a1bfaca`/`b84fe3a`。

## 設計問題：兩個依賴都不聽話，要測什麼

coding agent 站在兩個非決定性元件上：

1. **LLM**——同一個 prompt 兩次跑出不同 token；
2. **外部 CLI**——Claude Code、Codex、OpenCode、Pi、OMP 各自改版，JSONL 事件 schema 說變就變，你連版本號都管不到。

傳統單元測試的前提「同輸入同輸出」直接失效。但注意：失效的只有「內容」，不是「形狀」。模型每次講的話不同，但事件流的結構（哪裡該有 tool call、哪裡該收尾）是穩定的；CLI 版本會變，但 argv 形狀和 JSON schema 在特定版本區間是凍結的。所以問題其實是：**把決定性的部分從非決定性系統裡切出來，分層各測各的**。

## 五家怎麼做

### codex：假 API server + 快照測試

codex-rs 的測試基建最完整。core 測試共用一組 helper，其中 `codex-rs/core/tests/common/responses.rs#ResponseMock` 用 wiremock 起假的 Responses API server，可以事後檢查收到的請求（`requests()`、`saw_function_call()`）；需要串流場景時，`codex-rs/core/tests/common/streaming_sse.rs#StreamingSseServer` 讓你預先排好一串 SSE chunk，server 照劇本吐。也就是說：模型被換成一個可編劇的 HTTP server，agent loop 本體照跑。

值得學的還有一條紀律：`codex-rs/core/src/test_support.rs` 開頭註解明寫「Production code should not depend on this module」——測試 helper 有專門出口，不和產品碼混住。

TUI 側則是快照王國：`codex-rs/tui/src/chatwidget/tests/` 底下二十幾個檔案按主題拆（approval_requests、slash_commands、status_and_layout……），渲染結果用 `insta::assert_snapshot!`（`tests/status_and_layout.rs`）比對 `.snap` 檔。畫面會動沒關係，每一格都釘死在快照裡。

### opencode：VCR 式錄放套件

opencode 把「錄下來重播」做成獨立 package：`opencode/packages/http-recorder`，package.json 的自我描述就是「Record and replay Effect HTTP client traffic with deterministic cassettes」——VCR 隱喻直接寫在名字裡。`packages/http-recorder/src/cassette.ts#CassetteNotFoundError` 定義了 cassette 遺失時的明確錯誤，`cassette.ts#fileSystem` 提供檔案版 layer、還有記憶體版。core 的測試目錄裡也有 `recordings/` 目錄配合使用。錄製時順帶處理 redaction（`redaction.ts`），避免把憑證錄進 fixture——這是錄製路線很容易漏的一步。

### pi：eval 與 unit test 分家

`pi-mono/packages/evals` 有兩份 vitest config：`vitest.config.ts` 只收 `src/**/*.eval.ts`（model-backed，跑一次要錢要時間，timeout 120 秒），`vitest.test.config.ts` 只收 `test/**/*.test.ts`（決定性）。eval 用 [vitest-evals](https://github.com/getsentry/vitest-evals) 的 `describeEval` 包起來，harness 由 `packages/evals/src/pi-harness.ts#createPiCodingAgentHarness` 提供——把真的 AgentSession 接到 eval 框架上，跑完留下 session JSONL 當 artifact。`packages/evals/src/smoke.eval.ts` 是最小案例：問巴黎首都，斷言回答是 Paris 且 token 數大於零。

分工很清楚：unit test 管「程式對不對」，eval 管「模型行為對不對」，兩者用不同的指令、不同的節奏跑。

### omp：benchmark 本身也要能測

omp 的 `packages/typescript-edit-benchmark` 展示了第三種角色：benchmark-as-test。`packages/typescript-edit-benchmark/src/generate.ts` 從真實 TypeScript 原始碼生成編輯考題，難度分 easy 到 nightmare（重複行、300 行長檔、相似區塊）；`packages/typescript-edit-benchmark/src/verify.ts#verifyExpectedFiles` 負責比對答案檔（過 Prettier 格式化後比對，容忍無害的空行差異）。關鍵在於：benchmark 的機器本身——hunk 解析、round-trip、驗證器——全部用決定性測試圍住（`packages/typescript-edit-benchmark/test/hunks.test.ts`）。量測儀器自己要先可信，量出來的分數才有意義。

### claude-code：反編譯後只剩殘留

反編譯的 claude-code-source 裡找不到正式測試套件（合理，發佈的 bundle 不帶測試）。但有個有趣的殘留：`claude-code-source/src/tools/testing/TestingPermissionTool.tsx`——一個「永遠跳權限確認框」的測試工具，`isEnabled()` 寫著 `"production" === 'test'` 才啟用。連閉源商業 agent 都會在產品碼裡埋測試掛鉤，方便 end-to-end 測試觸發特定互動路徑。測試需求會塑造產品碼的形狀，這是間接證據。

## rivumi 的四層測試

rivumi 要驅動五種外部 CLI（M13），面對的就是上面同樣的問題。目前的答案是四層，由便宜到貴：

**第一層：純單元測試。** policy、tools、normalizer 這些決定性模組照常規測（`tests/test_policy.py`、`tests/test_tools.py`）。全綠是基本盤。

**第二層：fake-CLI 合約測試。** 外部 CLI 不在場也能測它的介面合約。`tests/test_external_cli_backends.py#_fake_executable` 做法很樸素：寫一支假執行檔，從環境變數讀 payload 印到 stdout，然後讓真的 backend 去跑它——argv 形狀（`test_pi_argv_shape` 斷言 `pi --mode json prompt`）、normalizer 映射（tool 名稱在哪個欄位）、錯誤 schema 全部在無網路、無 vendor binary 的前提下釘死。這層抓的是「我以為的 schema 和實作不一致」。

**第三層：錄製串流整合測試。** fake 的串流是我編的，可能編得太乾淨。所以 M13 先用 `scripts/m13_capture_runtimes.py` 對真實安裝的 Pi/OMP/OpenCode 各跑一次真任務，把原始 stdout 錄成 JSONL 存進 `tests/fixtures/m13/`（commits `573c752`、`b84fe3a`），再由 `tests/test_external_runner_integration.py#RecordedStreamBackend` 重播：真 normalizer 吃真串流，接上真 `ExternalCodingRunner`，工作區修改用合成 patch 讓 diff/verify pipeline 有東西可對帳。每個 runtime 都斷言四件事：normalize 出正確 tool 名稱與助手文字、runner 走到 `verified`、錯誤串流映射到帶提示的 `external_agent_error`、取消映射到 `user_cancelled`。OpenCode 的成功 schema 就是靠真 capture 才發現 assistant 文字在 `part.text`、tool 名稱在 `part.tool`——編的 fixture 編不出這種錯（commit `b84fe3a`）。

**第四層：Textual pilot TUI 測試。** TUI 不用截圖比對，而是用 Textual 內建 pilot 在 headless 環境開真的 app：`tests/test_tui.py` 裡隨手可見 `app.run_test(size=(100, 30)) as pilot`，然後 `pilot.click("#task")`、`pilot.press("enter")`，像真人一樣操作，斷言狀態與畫面文字。onboarding 流程、runtime 切換、快捷鍵都是這樣測的。另外 live smoke 是 opt-in 的：裝了真 CLI 才跑真 CLI（stage doc 裡的 live capture 就是這類），CI 平常不依賴它。

## 工程依據

第四層的做法有官方文件背書：[Textual guide 的 testing 章](https://textual.textualize.io/guide/testing/) 明確說 `run_test()` 會提供 `Pilot` 物件，用 `click()`、`press()`、`pause()` 模擬使用者輸入，且整個 app 跑在同一個 event loop 裡、可直接 await 內部狀態——這正是把「TUI 很難自動化測」變成「TUI 只是另一個 async 函式」的設計。快照路線的理論基礎則可看 [insta](https://insta.rs/) 的 snapshot review 工作流；eval 分家的參考實作是 [vitest-evals](https://github.com/getsentry/vitest-evals)。至於「錄製重播」模式，最早普及於 HTTP 測試的 VCR 類工具，opencode 的 http-recorder 把同一套思路搬到 Effect HTTP client 上。

## 改善路線

rivumi 四層已經能跑，但照五家的標準看還有三個縫：

1. **錄製範圍太窄。** 目前 fixtures 只有單輪唯讀任務加一條錯誤流；多輪 resume、approval 往返、diff 對帳的真實串流還沒錄（stage doc 自己也列為限制）。opencode 的 http-recorder 連 redaction 都做好了，rivumi 的 capture harness 還沒有自動遮蔽敏感內容的步驟。
2. **缺 model-backed eval 層。** pi 用 `describeEval` 把「模型行為對不對」變成可比較、留 artifact 的例行公事；rivumi 目前只有一次性 live smoke，沒有可重複的 eval suite。native harness 的 prompt 一旦開始迭代（系列第 24 篇之後的 prompt versioning），沒有 eval 就只能靠手感。
3. **TUI 測試偏互動流程、缺視覺回歸。** pilot 測的是行為，不是畫面。codex 用 insta 快照把每個渲染狀態釘死；rivumi 若要在改 layout 時不怕改壞，遲早要補一層渲染快照（Textual 匯出 SVG 截圖的路徑已在 smoke 流程驗證過，離快照化只差半步）。

一句話收尾：非決定性系統不是不能測，是不能只用一種方式測。把 schema 釘在 fake-CLI、把真實行為錄成串流、把畫面釘成快照、把模型行為丟給 eval——四層各管一段，「會動的 agent」就變成一套可以放心重構的系統。

## 參考資料

- [Textual Testing Guide（Pilot、run_test）](https://textual.textualize.io/guide/testing/)
- [insta — Rust snapshot testing](https://insta.rs/)
- [vitest-evals（Sentry）](https://github.com/getsentry/vitest-evals)
- [openai/codex — codex-rs core tests](https://github.com/openai/codex/tree/main/codex-rs/core/tests)
- [sst/opencode — packages/http-recorder](https://github.com/sst/opencode/tree/dev/packages/http-recorder)
- [badlogic/pi-mono — packages/evals](https://github.com/badlogic/pi-mono/tree/main/packages/evals)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
