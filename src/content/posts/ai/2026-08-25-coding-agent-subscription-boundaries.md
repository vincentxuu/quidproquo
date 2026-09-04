---
title: "跟成熟 coding agent 學設計（8）：訂閱的正道與邪路——OAuth 與 credential 邊界"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 8
tags: [coding-agent, oauth, credential-security, harness-engineering, llm-agents, subscription]
lang: zh-TW
description: "想用自己的 ChatGPT Plus 或 Claude Pro 訂閱跑自製 agent，怎樣算正道、怎樣算違規？實際讀 Codex、Claude Code、pi、OMP、OpenCode 原始碼，對照 looplane 的三條 credential 鐵律。"
tldr: "五家在「訂閱認證」上分成三派：Codex 和 Claude Code 只為自己官方 client 做 OAuth 並把 token 收進 OS keyring；pi 和 OMP 直接重用 Claude Code 的 client ID 實作 Pro/Max OAuth（技術可行但 Anthropic 文件明文禁止第三方未經核准提供 claude.ai 登入）；OpenCode 則把內建 Pro/Max plugin 整組移除，是生態系最乾淨的政策先例。looplane 的原則：自己的 grant 自己做、絕不刮別家 CLI 的 credential 檔、第三方 client 要 provider 明確支援才接 OAuth、credential 不複製不轉發。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-subscription-boundaries-en)

## 設計問題

你寫了一個 coding agent，不想按 token 付 API 費，想用自己已有的 ChatGPT Plus 或 Claude Pro 訂閱額度。技術上完全做得到——那訂閱背後就是一張 OAuth token。但「做得到」和「可以做」中間隔著一整片雷區：

1. **credential 誰擁有？** 你的工具是替使用者管他自己的登入，還是把別家 CLI 已存的 token 撿來用？
2. **誰能當 OAuth client？** 授權伺服器核發 token 時綁的是特定 client ID。你的程式用什麼身分去換 token？
3. **訂閱額度能不能被轉出口？** 一個第三方產品把使用者的訂閱額度接進自己的 agent loop，跟使用者自己用官方 CLI，是同一件事嗎？

這篇把五家的做法翻出來看，並且誠實分類：哪些是官方支援、哪些是灰色地帶、哪些明確踩線。

## 五家怎麼做

### Codex：官方 OAuth，token 收進 OS keyring

Codex CLI 的登入是一套完整的 OAuth 2.0 + PKCE 流程：`codex/codex-rs/login/src/lib.rs` 匯出 `LoginServer` 與 `run_login_server`，`codex/codex-rs/login/src/server.rs#build_authorize_url` 組授權 URL（issuer 固定 `auth.openai.com`），本機 callback server 先綁 port 再開瀏覽器，拿到 code 後由 `codex/codex-rs/login/src/server.rs#exchange_code_for_tokens` 換 token。儲存分兩層：`$CODEX_HOME/auth.json`（`codex/codex-rs/login/src/auth/storage.rs#AuthDotJson`）與 macOS Keychain 等系統憑證庫——`storage.rs` 用固定的 `KEYRING_SERVICE = "Codex Auth"` 讀寫，底層抽象在 `codex/codex-rs/keyring-store/src/lib.rs#KeyringStore`。注意它從頭到尾只處理**自己的** grant：client ID 是 OpenAI 核給 Codex 的，流程是官方文件記載的用法。

### Claude Code：同樣的工程水準，只服務自己

Claude Code 的 `claude-code-source/src/services/oauth/index.ts#OAuthService.startOAuthFlow` 也是 PKCE 加 localhost listener，另備手動貼 code 的 fallback。scope 用的就是 `claude-code-source/src/constants/oauth.ts#CLAUDE_AI_INFERENCE_SCOPE` 定義的 `user:inference`——這正是訂閱推論權限的核心。token 存在 macOS keychain 的「Claude Code-credentials」條目（見 `src/utils/secureStorage/keychainPrefetch.ts`）。重點：這整套是 Anthropic 替自家 client 做的，別人拿去用不在保障範圍內。

### pi 和 OMP：直接重用 Claude Code 的 client ID

這是最值得警惕的一組。pi 的 `pi-mono/packages/ai/src/auth/oauth/anthropic.ts#CLIENT_ID` 把 client ID 用 base64 編碼藏在原始碼裡，解碼後是 `9d1c250a-e61b-44d9-88ed-5944d1962f5e`——和 `claude-code-source/src/constants/oauth.ts#CLIENT_ID` 完全相同，也就是 Claude Code 官方 client 的 ID。OMP 更進一步：`oh-my-pi/packages/ai/src/registry/oauth/anthropic.ts` 用同一個 ID，還定義了 `CLAUDE_CODE_BOOTSTRAP_USER_AGENT = "claude-code/${version}"`，帶著 Claude Code 的 User-Agent 去打 Anthropic 的 bootstrap endpoint。兩家都完整實作了 `refreshAnthropicToken` 等訂閱 token 續約。

事實層面：這證明技術上可行。判斷層面：冒用官方 client 身分＋偽造 User-Agent，是在刻意讓流量看起來像官方 CLI，這已經不是灰色地帶而是明確繞過平台識別機制；即使只是個人本地用，也不該當成可依賴的架構。

### OpenCode：最乾淨的政策先例

OpenCode 曾經內建 Claude Pro/Max 的 OAuth plugin，但在 1.3.0 移除了。它的官方文件（providers 頁）白紙黑字寫：「There are plugins that allow you to use your Claude Pro/Max models with OpenCode. Anthropic explicitly prohibits this」，並改為主打零設定的 ChatGPT Plus、GitHub Copilot 等**provider 明確允許**的訂閱。它的 credential 儲存很樸素：`packages/opencode/src/auth/index.ts` 把各 provider 的 token 寫進自己資料夾下的 `auth.json`（0600）。移除功能比保留功能需要更多紀律，這是生態系裡最好的示範。

## looplane 的選擇與差異

looplane 從 M4/M5 起立了三條鐵律：

**第一，自己的 grant 自己做。** 要接 ChatGPT 訂閱就跑完整的 OAuth PKCE：`looplane/src/looplane/oauth_login.py#wait_for_codex_callback` 先綁 127.0.0.1 才宣布就緒、用 `hmac.compare_digest` 驗 state、逾時即棄。credential 存自己的檔案——`looplane/src/looplane/codex_oauth.py#CodexCredentialStore` 拒絕 symlink、強制 0700/0600、臨時檔 fsync 後原子替換、repr 一律 `<redacted>`。要坦白的是：這裡有個灰色成分——client ID 用的是公開的 Codex client（與 OpenCode/Pi 相同的 `app_EMoamEEZ73f0CkXaXp7hrann`），所以整個 adapter 是 `experimental=True` 才啟用、fail-closed，發佈前必須重新確認 provider 政策。差別在於：我們標注了這是判斷而非授權，且不偽裝成官方 CLI。

**第二，絕不刮別家 CLI 的 credential。** 不讀 `~/.codex/auth.json`、不碰 keychain 裡的 Claude Code-credentials、不 import 任何別家 refresh token。要用官方 CLI 就委派整個任務：`looplane/src/looplane/claude_backend.py#ClaudeCodeBackend` 保留子程序的 `HOME` 讓官方 CLI 自己解析登入，looplane 全程不解析任何 credential；`looplane/src/looplane/external_cli_base.py#StreamJsonCliBackend` 對所有外部 CLI backend 一體適用「child owns its credentials, never a proxy」。另外 `looplane/src/looplane/codex_oauth.py` 的 Codex Responses adapter 刻意沒有 `base_url` 參數——訂閱 token 的 audience 固定，不可能意外打到別的 host。

**第三，訂閱路徑三重 opt-in。** `looplane/src/looplane/cli.py` 要求同時給 `--experimental-subscription`、`--allow-external-modify`、`--unsafe-local-exec` 三個旗標才會走訂閱外部改碼，且結果一律視為不可信候選 patch，照樣過完整的驗證 gate。

## 政策依據

以下區分事實與判斷。事實：文件原文存在且如此記載。判斷：我對「個人本地實驗是否涵蓋在內」的解讀。

- **Anthropic 的界線最明確。** [Agent SDK 文件](https://code.claude.com/docs/en/agent-sdk)明言：未經事先核准，第三方開發者不得在其產品中提供 claude.ai 登入或訂閱速率限制，包括用 Agent SDK 打造的產品，並指示改用 API key 認證。[Commercial Terms](https://www.anthropic.com/legal/commercial-terms) 限制未核准的轉售，[Usage Policy](https://www.anthropic.com/legal/aup) 禁止繞過平台限制。判斷：這把 pi/OMP 式的做法、以及「幫使用者代理訂閱 token 到多使用者服務」的做法都排除了；純個人本地實驗文件沒有直接規範，屬模糊地帶，但不應把模糊當許可。
- **OpenAI 沒有等價的明文禁止條款可引用**（這是事實性的觀察，非法律意見），[Codex 認證文件](https://developers.openai.com/codex/auth)官方記載了 CLI 登入的複用與續約行為，並警告 credential 檔內含 access token。[OpenAI Terms of Use](https://openai.com/policies/terms-of-use/) 有一般的存取限制條款。判斷：用官方記載的 OAuth 流程取得自己的 grant 屬正常用法；但重用他人 client ID 做出新產品，風險自負，隨時可能被撤銷。
- **OpenCode 的文件**（[providers](https://opencode.ai/docs/providers/)）是第三方對 Anthropic 立場最直接的轉述：「Anthropic explicitly prohibits this」，並以此解釋為何 1.3.0 移除內建 plugin。
- 共通的技術底線：OAuth 設計上 client ID 就是身分（[RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)）、PKCE 是公共 client 的標配（[RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)）。偽造另一個 client 的特徵，等同於讓授權伺服器對「誰在用 token」做出錯誤判斷。

## 改善路線

1. **JSON 檔升級成 OS keyring。** looplane 目前用自己的 0600 JSON 檔，Codex 的 `keyring-store` crate 示範了正確終點：金鑰交給作業系統保管，檔案洩漏半徑歸零。
2. **補 device code flow。** `codex/codex-rs/login/src/device_code_auth.rs` 支援無瀏覽器環境的登入；looplane 目前只有 loopback callback，SSH 或 headless 場景會卡住。
3. **status 只吐狀態枚舉。** 登入狀態查詢應回 `ready`／`signed_out`／`unknown` 三值，不含 email、帳號 ID、token 片段——目前 `status-codex` 已走精簡路線，可以再收斂成正式契約。
4. **跨程序 refresh 鎖與 gateway daemon。** 多程序共用一張 grant 時，token 輪替要有單一寫入者；OMP 的 broker/gateway 分離是現成參考。
5. **政策複查自動化。** 每次 release 前重新抓一次 Anthropic/OpenAI 的條款與文件頁，比對是否變動；證據變了或變模糊，experimental flag 就保持關閉。這條已經寫進 looplane 的發佈檢查，但要變成 script 而不是人的記性。

## 參考資料

- [openai/codex — codex-rs/login（OAuth/PKCE/keyring 原始碼）](https://github.com/openai/codex/tree/main/codex-rs/login)
- [Codex authentication 官方文件](https://developers.openai.com/codex/auth)
- [Codex non-interactive mode 官方文件](https://developers.openai.com/codex/noninteractive)
- [Anthropic Agent SDK overview（第三方 claude.ai 登入限制）](https://code.claude.com/docs/en/agent-sdk)
- [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms)
- [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)
- [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/)
- [badlogic/pi-mono — packages/ai/src/auth](https://github.com/badlogic/pi-mono/tree/main/packages/ai/src/auth)
- [can1357/oh-my-pi — packages/ai/src/registry/oauth](https://github.com/can1357/oh-my-pi/tree/main/packages/ai/src/registry/oauth)
- [sst/opencode — providers 文件（Pro/Max plugin 移除說明）](https://opencode.ai/docs/providers/)
- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7636 — Proof Key for Code Exchange (PKCE)](https://datatracker.ietf.org/doc/html/rfc7636)
