---
title: "跟成熟 coding agent 學設計（14）：Onboarding 設計——provider-aware 初始化與即時驗證"
date: 2026-08-25
type: deep-dive
category: ai
tags: [coding-agent, onboarding, cli, tui, developer-experience, claude-code, codex, opencode]
lang: zh-TW
tldr: "空白設定檔勸退人，憑證錯太晚發現更勸退人。五家成熟 agent 都把 setup 做成 first-class state，rivumi 再補上存完 key 立即驗證這一步。"
description: "對照 Claude Code、Codex、Pi、OMP、OpenCode 的首次執行設計，拆解 rivumi 從 raw Model 輸入到 provider-aware wizard 加即時 credential 驗證的兩段演進。"
draft: false
series:
  name: "跟成熟 coding agent 學設計"
  order: 14
---

🌏 [English version](/posts/ai/2026-08-25-coding-agent-onboarding-design-en)

## TL;DR

首次執行的設計問題有兩層：一是空白設定檔讓使用者不知道要填什麼，二是憑證錯誤要到真正執行任務才被發現。五家成熟的 coding agent 都把 setup 當成 first-class state 處理；rivumi 先抄了「provider-aware 初始化」這一課，後來又補上「存完 key 立即打一次 API 驗證」，這一步反而是多數參考專案沒做的。

## 設計問題

一個 coding agent 裝好之後，第一次執行會遇到什麼？

最糟的版本是 rivumi 早期的樣子：使用者輸入任務之後，agent 才回頭問一句 `Model:`——你要自己知道 adapter 層的 model ID 長什麼樣、API key 放哪個環境變數。填錯了也不會馬上知道，要等到任務跑起來、真的打到 provider API，才收到一個 401。這時 context 已經浪費了一輪，使用者只看到一串 traceback。

問題拆開是兩個：

1. **空白設定檔勸退**：設定欄位沒有選項可選、沒有預設值可猜，等於把整合工作丟回給使用者。
2. **憑證驗證太晚**：key 存進去了不代表能用。驗證點放得越晚，除錯成本越高。

## 五家怎麼做

**Claude Code**：首次執行是一段獨立的 setup 流程，不是夾在對話裡的追問。`claude-code-source/src/interactiveHelpers.tsx#showSetupScreens` 檢查 `config.theme` 和 `hasCompletedOnboarding`，缺了就動態載入 `src/components/Onboarding.tsx#Onboarding`，用 step 陣列組出 preflight → theme → api-key → oauth → security → terminal-setup 的序列，其中 oauth 步驟可以跳過。OAuth 本身是明確的狀態機：`src/components/ConsoleOAuthFlow.tsx#ConsoleOAuthFlow` 有 `idle / ready_to_start / creating_api_key / about_to_retry / success / error` 六個狀態，瀏覽器沒開起來還提供貼上 code 的 fallback。

**Codex**：TUI 啟動時就決定要進哪個畫面。`codex/codex-rs/tui/src/startup_orchestration.rs` 依 `startup_preflight::should_delay_startup_composer_for_first_login` 判斷是否尚未登入，是的話 initial screen 直接給 `StartupDraftInitialScreen::Onboarding`，onboarding 目錄下再分 welcome、auth、trust_directory 三個子畫面。`codex-rs/tui/src/onboarding/auth.rs#AuthModeWidget` 把登入方式攤開成選項：瀏覽器 OAuth、device code、API key 三條路各自有對應的 state struct。底層的 `codex-rs/login/src/device_code_auth.rs#run_device_code_login` 是「申請 device code → 印提示 → 輪詢完成 → persist_tokens_async」一條線，成功才落盤。

**Pi**：把 first-run 條件寫得很白。`pi-mono/packages/coding-agent/src/cli/startup-ui.ts#shouldRunFirstTimeSetup` 明列四個門檻：官方發行版、實驗功能開啟、沒 override agent dir、settings.json 不存在。setup 本身很薄（`components/first-time-setup.ts#FirstTimeSetupComponent` 只問 theme 和 analytics），真正的重點是 model 缺失時走 provider/model UI——`components/login-dialog.ts#LoginDialogComponent` 在 OAuth 流程期間直接取代 editor，`components/model-selector.ts#ModelSelectorComponent` 提供模型清單選擇而不是自由輸入。

**OMP**：解的是「model 清單從哪來」。`oh-my-pi/packages/catalog/src/model-manager.ts#resolveProviderModels` 用三種 refresh 策略（`online / offline / online-if-uncached`）合併靜態 catalog、快取和動態 discovery，`packages/catalog/src/discovery/` 底下每家 provider 一個 fetcher（antigravity、codex、gemini 等）。也就是說它不假設使用者在設定檔裡拼對 model ID，而是主動去問 provider。

**OpenCode**：把 provider 登入做成顯式 CLI 指令。`opencode/packages/opencode/src/cli/cmd/providers.ts#ProvidersLoginCommand` 先 refresh models.dev catalog，再用 autocomplete 列出 provider 清單（帶 priority 排序和「ChatGPT Plus/Pro or API key」這類 hint），支援 plugin 接管 auth 和 well-known URL 流程，最後 `Prompt.password` 收 key 存進 auth store。值得注意的是：它存完 key 就結束，**沒有**對 provider 打一次驗證請求。

## rivumi 的選擇與差異

rivumi 的演進分兩段，剛好對應上面兩個設計問題。

**第一段：provider-aware 初始化。** 最早的版本是在任務輸入之後才問 `Model:`，使用者得自己知道 adapter 層的 ID 格式。M8 重做之後，bare `rivumi` 進互動模式會先完成 runtime/provider/model 選擇再收任務；Ollama 走本地 discovery（`rivumi/src/rivumi/cli.py#_fetch_ollama_models`），遠端 provider 顯示名稱讓使用者挑而不是填空。跟五家不同的取捨有兩個：discovery 只打固定的 loopback endpoint 且各種維度設了上限（時間、位元組數、數量、名稱長度），不掃其他 CLI、不執行 repo 裡的程式碼；另外 `rivumi -p` 和 exec 保持完全 non-interactive，headless 場景缺設定就給 actionable error，絕不出現互動 prompt。

**第二段：即時 credential 驗證。** 這是 rivumi 反過來做得比多數參考專案多的地方。原本 `auth set-key` 存完 key 只印一句提示，key 對不對要等到跑任務才知道——正是 OpenCode 至今仍存在的形態。後續三個 commit 把它補齊：先新增驗證核心（commit 965f0af，`rivumi/src/rivumi/provider_verification.py#verify_native_credential`），CLI 的 `auth set-key` 改成存完立即驗證並加上 `auth list --verify`（commit 34a1c78），最後 TUI 的 OnboardingModal 拆成 overview → connection → credential → model 四步 wizard，credential 步驟內建 spinner 和即時結果（commit 54bd929，`rivumi/src/rivumi/tui.py#OnboardingModal`）。wizard 維持單一 ModalScreen 內部切狀態，`push_screen_wait` 的呼叫點不用動。

## 工程依據

幾個關鍵決策背後的理由：

- **驗證 timeout 用 UI 時間尺度**。`verify_native_credential` 預設 10 秒，而任務執行的 timeout 是 60 秒——因為這條 code path 上有一個人正在盯著 spinner，不是 agent 在等 API 回應。
- **驗證失敗不鎖死使用者**。`auth set-key` 在 verification 失敗時仍然保留已存的 key，只印黃色警告：離線或 provider 酬載暫時故障不該讓人失去自己剛設定的憑證，之後可以用 `auth list --verify` 重驗。
- **model listing 失敗要有原因**。`provider_verification.py#fetch_models_result` 回傳的 `VerificationResult` 區分「ok 但空清單」（endpoint 不支援 listing，degraded）和「失敗且帶訊息」，UI 據此 fallback 回自由輸入而不是直接壞掉。
- **discovery 要 bounded**。Ollama discovery 固定打 `http://127.0.0.1:11434/api/tags`、關 proxy、identity encoding、256 KiB 上限、最多 100 台、名稱 ≤ 256 可印字元——本地服務也可能回傳垃圾，onboarding 不該是攻擊面。
- 這些其實都是 usability 工程的老原則：錯誤要在發生的當下就近回報（Nielsen 的 "help users recognize, diagnose, and recover from errors"），而不是累積到最後一起爆炸。

## 還能改善什麼

對照五家，rivumi 還缺的：

1. **遠端 model catalog**。OMP 和 OpenCode 都會拉遠端清單（models.dev 或 provider 自家的 discovery API），rivumi 的遠端 provider 目前仍是手動輸入 model ID。`fetch_models_result` 已經會回傳 models tuple，下一步是把 model 步驟從「驗完給你打字」升級成「驗完列出清單」。
2. **OAuth 登入路徑**。Claude Code 和 Codex 的瀏覽器 OAuth 加 device code fallback 是訂閱制使用者的正道，rivumi 目前只有 API key 一條路（codex OAuth adapter 是另一回事，不在 onboarding 流程內）。
3. **first-run 條件的文件化**。Pi 把 `shouldRunFirstTimeSetup` 的四個條件寫成註釋放在函式上方，這種自我文件的寫法值得抄——onboarding 觸發條件是最容易被後人改壞的地方。

## 參考資料

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — `packages/coding-agent/src/cli/startup-ui.ts`
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — `packages/catalog/src/model-manager.ts`
- [sst/opencode](https://github.com/sst/opencode) — `packages/opencode/src/cli/cmd/providers.ts`
- [openai/codex](https://github.com/openai/codex) — `codex-rs/tui/src/onboarding/`
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — decompiled source 分析
- [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) — Nielsen Norman Group
