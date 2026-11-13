---
title: "資安警報｜prompt injection 串聯 GitHub Actions 漏洞，直通 OpenAI Codex npm 套件發布權限"
date: 2026-11-14
category: daily
tags: [ai-agent, security, daily, prompt-injection, supply-chain]
lang: zh-TW
description: "資安研究公司 Depi 揭露一條從 GitHub issue 的 prompt injection 開始、最終能取得可發布 OpenAI 官方 npm 套件 @openai/codex 之簽署權限的完整攻擊鏈，OpenAI 已修補並發出漏洞賞金。"
tldr: "Depi 發現：在 openai/codex 的 issue 標籤 workflow 裡開一則惡意 issue 就能對 Codex agent 下 prompt injection，再透過 GitHub Actions runner 裡一個沒驗證身份的除錯管道讀出 token，串上 cache 下毒和另一個已知漏洞，最終可換到能發布惡意版 @openai/codex（月下載數百萬次）的 npm 簽署權限。OpenAI 已修補並發出賞金，過程全在測試環境進行，沒有真實使用者受害。"
series:
  name: "AI Security Alert"
  order: 77
---

> 🌏 [English version](/posts/daily/2026-11-14-security-codex-npm-supply-chain-prompt-injection-en)

## 事件概述

資安公司 Depi 在 11 月 11 日發表研究，披露一條從 GitHub issue 的 prompt injection 一路串到可發布 OpenAI 官方 npm 套件 `@openai/codex` 的完整攻擊鏈。起點是 `openai/codex` repository 裡一個會讀取新開 issue 內容來建議標籤的 GitHub Actions workflow：因為它設定 `allow-users: "*"`，任何人都能開一則 issue，讓 issue 標題與內文被原樣餵進 Codex agent 的 prompt，形成 prompt injection 的入口。Depi 利用這點取得 agent sandbox 內的程式碼執行，再透過 GitHub Actions runner 底層一個未經身份驗證的除錯通道，從記憶體裡讀出 CI 的 token，最後串上另一個已知漏洞換到能推送惡意更新的發布權限。Depi 透過 Bugcrowd 負責任揭露，OpenAI 已修補並發出初始賞金，整個過程只在 Depi 自己的測試環境中驗證，沒有真實使用者的套件更新被動到。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Prompt Injection 串聯 Supply Chain Attack（CI/CD 攻擊鏈） |
| 影響範圍 | `openai/codex` GitHub repository 的 issue 標籤 workflow、GitHub Actions runner、`@openai/codex` npm 套件（月下載數百萬次） |
| 嚴重程度 | Critical（具大規模供應鏈 RCE 潛力，已於上線前攔下，無實際使用者受害） |
| CVE | 無（Bugcrowd 漏洞賞金揭露，未編號） |
| 來源 | [Depi 研究報告](https://depi.security/blog/20261111-backdooring-codex/)、[SecurityWeek](https://www.securityweek.com/in-other-news-new-cisa-director-nominee-connected-car-hacking-baker-tilly-data-breach/)、[The Defiant](https://thedefiant.io/frontier/ai/researchers-say-codex-flaw-put-npm-releases-at-risk) |

## 攻擊面分析

攻擊鏈分成三段，每一段都踩在「把 AI agent 當成可信任元件」這個假設上。

第一段是 prompt injection：`issue-labeler.yml` 把 `github.event.issue.title` 和 `github.event.issue.body` 直接接進 Codex agent 的 prompt，workflow 本身把這些文字當成「資料」，但 agent 在自然語言層面收到的是跟系統指令同一個 context 的文字，分不出哪段是可信指令、哪段是外人寫的內容。Depi 找到一個能讓模型把 issue 內容誤判為「新一組系統指令」的提示結構，再把要執行的 shell script 壓縮編碼過，讓 Codex 的安全防護辨認不出其惡意用途，於是在 sandbox 的 `workspace-write` 權限下跑起任意指令。

第二段是 sandbox escape：`workspace-write` 模式關掉網路存取、限制檔案系統只能寫當前目錄與 `/tmp/`、也拿掉 `ptrace`。但 GitHub runner 背後的兩個 .NET 處理程序（`Runner.Listener`、`Runner.Worker`）會在 `/tmp/` 下建立 CoreCLR 的除錯管道（debug pipe），而管道在 Linux 上就是普通檔案，`open()` 系統呼叫不受前述限制。這個除錯協定完全沒有身份驗證，任何能開啟管道的人都能對 `Runner.Worker` 下達「讀取記憶體」指令，從而讀出存在該處理程序記憶體裡的 `ACTIONS_RUNTIME_TOKEN`、`GITHUB_TOKEN` 等機密——sandbox 本身雖然刪掉了環境變數，卻擋不住對父處理程序記憶體的讀取。

第三段才是真正的供應鏈攻擊：sandbox 內沒有網路，Depi 把竊得的 token 透過 issue 的輸出紀錄分段外洩，再拿到 sandbox 之外使用。因為 token 本身仍是有效的 OpenAI 身份，攻擊者可以用它對另一個有 `Actions: write` 權限的 workflow（`rust-ci.yml`）做 GitHub Actions 快取下毒——GitHub 的 cache 是未經內容驗證就直接解壓縮的 tar 檔，能把惡意檔案寫到任意路徑。下一次這個 workflow 跑快取還原時，惡意檔案就被執行，進而濫用其 `Actions: write` 權限建立一個假的 release；當維護者刪除這個假 release 時，會觸發另一個由資安研究者 Adnan Khan 揭露、涉及 `release: delete` 動作的既有漏洞，換到一個 OpenID Connect token。有了這個 token 加上 write 權限，就能向 GitHub 換取 npm 信任的簽署 JWT，取得發布 `@openai/codex` 新版本的能力。

```diagram
title: 從一則 issue 到 npm 發布權限的攻擊鏈
desc: 單一惡意 issue 觸發 prompt injection，經 sandbox escape 讀出 CI token，再串上 cache 下毒與一個既有漏洞，最終換到可發布官方套件的簽署權限；最後一步在實際利用前被 OpenAI 攔下修補。
caption: 簡化示意，依 Depi 2026-11-11 研究整理。
step: 任何人開 issue 即可觸發 workflow（allow-users: "*"）
step: Prompt injection 讓 Codex 在 sandbox 內執行編碼過的程式碼
step: 透過 /tmp 未驗證的除錯管道讀出 Runner.Worker 記憶體裡的 CI token
step: 用竊得的 token 對具 Actions:write 權限的另一個 workflow 做 cache 下毒
step: 快取還原時執行惡意檔案，濫用寫入權限建立假 release
step: 維護者刪除假 release，觸發既有漏洞換到 OIDC token
step: OIDC token 換取 npm 簽署 JWT，可發布惡意版套件——OpenAI 在此階段修補攔下
---
<svg viewBox="0 0 712 600">
  <path class="dg-line" d="M320 26V48" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 104V126" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 182V204" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 260V282" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M320 338V360" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line" d="M320 416V438" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line dg-line--warn" d="M320 494V516" marker-end="url(#arrow-warn)" data-step="7"/>

  <circle class="dg-dot" cx="320" cy="20" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="120" y="48" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">任何人開 issue 即可觸發 workflow</text>
    <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">allow-users: "*" 讓外部輸入直通 agent</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="120" y="126" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="146" text-anchor="middle" dominant-baseline="central">Prompt injection 讓 Codex 在 sandbox 內執行程式碼</text>
    <text class="dg-sub" x="320" y="166" text-anchor="middle" dominant-baseline="central">指令經壓縮編碼，繞過安全防護辨識</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="120" y="204" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="224" text-anchor="middle" dominant-baseline="central">透過 /tmp 未驗證的除錯管道讀取記憶體</text>
    <text class="dg-sub" x="320" y="244" text-anchor="middle" dominant-baseline="central">取得 Runner.Worker 持有的 CI token</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="120" y="282" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="302" text-anchor="middle" dominant-baseline="central">用竊得的 token 對另一個 workflow 做 cache 下毒</text>
    <text class="dg-sub" x="320" y="322" text-anchor="middle" dominant-baseline="central">目標 workflow 具 Actions: write 權限</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="120" y="360" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="380" text-anchor="middle" dominant-baseline="central">快取還原時執行惡意檔案</text>
    <text class="dg-sub" x="320" y="400" text-anchor="middle" dominant-baseline="central">濫用寫入權限建立假 release</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="120" y="438" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="458" text-anchor="middle" dominant-baseline="central">維護者刪除假 release，觸發既有漏洞</text>
    <text class="dg-sub" x="320" y="478" text-anchor="middle" dominant-baseline="central">換到一個 OIDC token</text>
  </g>

  <g data-step="7">
    <rect class="dg-box dg-box--warn" x="120" y="516" width="400" height="64" rx="6"/>
    <text class="dg-label" x="320" y="540" text-anchor="middle" dominant-baseline="central">OIDC token 換取 npm 簽署 JWT</text>
    <text class="dg-sub" x="320" y="562" text-anchor="middle" dominant-baseline="central">可發布惡意版套件——OpenAI 在此階段修補攔下</text>
  </g>
</svg>
```

對照 OWASP LLM Top 10：起點是 **LLM01 Prompt Injection**，`allow-users: "*"` 讓任何未受信任的外部使用者都能把輸入送進 agent，對應 **LLM06 Excessive Agency**；終點是 **LLM05 Supply Chain Vulnerabilities**——`@openai/codex` 是會在使用者機器上以開發者憑證執行程式碼的 agent，開了自動更新就等於拿掉了人工審查這個版本差異的機會。

## 防禦做法

**立即動作**
- 盤點所有會把 issue、PR、comment 等外部可控文字直接餵給 AI agent 的 GitHub Actions workflow；若設了 `allow-users: "*"` 這類允許任何人觸發的設定，改成僅限受信任的維護者或組織成員
- 讓處理「外部文字」的 job 只拿唯讀 token，不要讓它跟具有 cache write、release、publish 權限的 workflow 共用 runner 或 cache；兩者的執行環境與憑證範圍應完全隔離
- 若你在跑 Codex CLI 或任何會自動更新的 AI coding agent，評估拉長自動更新前的冷卻期，讓社群先替你驗證新版本

**長期架構**
- 落實 CI/CD token 最小權限：審查哪些 workflow 真的需要 `write` 或 `Actions: write`，並確認 release 相關事件（如 `release: delete`）不會意外觸發能換到更高權限 token 的流程
- 把 GitHub Actions 的 cache 視為不可信輸入：還原前驗證內容來源，避免內容未經檢查就直接解壓縮執行
- 像 Depi 自己用來找出這條攻擊路徑起點的「Upstream Security Platform」一樣，watchlist B7 的 Zenity 一類專注在 AI agent 攻擊面盤點與治理的工具，也能在 agent 被接入 CI/CD 之前，先把「這個 workflow 的輸入最終能走到哪些權限」畫成圖——用來抓出同類「觸發路徑→憑證→發布權限」的串接，而不是等漏洞被實際串起來才發現

## 影響範圍

Depi 在測試環境中完整驗證了整條攻擊鏈，但沒有在 `openai/codex` 正式 repository 上執行最後的發布步驟，也沒有任何惡意版本真正發布到 npm——沒有真實使用者的 Codex CLI 更新被動到。OpenAI 在收到透過 Bugcrowd 提交的完整 PoC 後立即修補，並已核發初始 1,000 美元賞金，案件仍在進一步審查中（OpenAI 的賞金政策對重大漏洞最高可達 10 萬美元）。真正值得注意的是規模：`@openai/codex` 月下載數百萬次，而且是一個會在開發者機器上以開發者憑證執行程式碼的 agent，如果這條鏈真的被惡意利用並推出惡意更新，影響範圍會接近 2025 年的 Shai-Hulud npm 供應鏈蠕蟲事件。

如果你的團隊也讓 AI coding agent 參與 issue 分類、PR 審查或任何 CI 流程，這起事件代表的攻擊面不是「這個 agent 會不會聽信惡意指令」，而是「這個 agent 執行環境裡，有哪些它不該碰到、但實際上碰得到的憑證」。

## 今日收穫

這起事件最有意思的地方，是攻擊鏈裡唯一算得上「AI 相關」的環節只有最開頭的 prompt injection；後面從 sandbox escape 到 cache poisoning 到換 OIDC token，全是傳統的 CI/CD 安全問題，跟模型本身聰不聰明無關。這提醒我們：防 AI agent 的攻擊面，不能只盯著「怎麼讓模型拒絕惡意指令」，agent 執行環境裡每一個共用的 runner、每一段沒驗證身份的本地通道、每一個權限過寬的鄰居 workflow，都是這條鏈能往下走的理由。

## 參考資料

- [Depi — Backdooring the next release of Codex through GitHub Action pipeline exploit chaining](https://depi.security/blog/20261111-backdooring-codex/)
- [SecurityWeek — In Other News: New CISA Director Nominee, Connected Car Hacking, Baker Tilly Data Breach（含 OpenAI Codex backdoor risk 條目）](https://www.securityweek.com/in-other-news-new-cisa-director-nominee-connected-car-hacking-baker-tilly-data-breach/)
- [The Defiant / Frontier — Researchers Say Codex Flaw Put npm Releases at Risk](https://thedefiant.io/frontier/ai/researchers-say-codex-flaw-put-npm-releases-at-risk)
- [Cacheract — GitHub Actions cache poisoning 工具（Adnan Khan）](https://github.com/adnaneKhan/cacheract)
- [Unit 42 — Shai-Hulud npm 供應鏈蠕蟲事件](https://unit42.paloaltonetworks.com/npm-supply-chain-attack/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
