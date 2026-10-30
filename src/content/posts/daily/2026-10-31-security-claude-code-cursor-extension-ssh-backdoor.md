---
title: "資安警報｜Cursor Marketplace 官方 Claude Code 擴充套件遭植入 SSH 後門"
date: 2026-10-31
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "Cursor 的 VS Code 擴充套件市集在 2026-10-29 分發了一個被植入 SSH 後門的 Anthropic.claude-code 2.1.313，最多 5,000 名使用者暴露在風險中"
tldr: "攻擊者在合法的 anthropic.claude-code 擴充套件識別碼下，於 Cursor Marketplace 發布了被竄改的 2.1.313 版本，在原始碼前插入約 66 行惡意載入器，嘗試植入 SSH 後門、建立反向連線並回傳主機資訊；因程式碼本身的錯誤，多數 macOS／Windows 主機上的 SSH 啟用步驟失敗，但後門金鑰與持久化機制仍會被植入。Cursor 已下架套件、關閉攻擊者伺服器並公布修復腳本；防禦重點是版本雜湊驗證與擴充套件最小權限，不能只信任「發布者 ID 相符」。"
series:
  name: "AI Security Alert"
  order: 68
---

> 🌏 [English version](/posts/daily/2026-10-31-security-claude-code-cursor-extension-ssh-backdoor-en)

## 事件概述

2026 年 10 月 29 日清晨（美國太平洋時間 2:27 到 13:35，約 11 小時），Cursor 的 VS Code 擴充套件市集分發了一個使用合法識別碼 `anthropic.claude-code`、版本號 2.1.313 的套件，但這個版本並非 Anthropic 發布——它的 `extension.js` 在正常擴充套件程式碼之前，被插入了一段約 66 行的惡意載入器。這段程式碼會嘗試在受害機器上植入 SSH 後門、建立反向連線通道，並把主機資訊回傳到攻擊者控制的伺服器。Cursor 官方統計最多有 5,000 名使用者在暴露時間窗內安裝或更新到這個版本。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（IDE 擴充套件市集遭竄改） |
| 影響範圍 | 在 2026-10-29 2:27–13:35 PT 期間，透過 Cursor VS Code 擴充套件市集安裝或更新 `anthropic.claude-code` 到 2.1.313 版的使用者（Open VSX 與 Microsoft VS Code Marketplace 的官方發布未受影響） |
| 嚴重程度 | High（資安業者 Rescana 的評估；官方未發布 CVE 或 CVSS 分數） |
| CVE | 無 |
| 來源 | [The Hacker News](https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html)、[BleepingComputer](https://www.bleepingcomputer.com/news/security/malicious-claude-code-extension-on-cursor-planted-ssh-backdoors/)、[Cursor 官方公告](https://cursor.com/blog/claude-code-extension-security-notice) |

## 攻擊面分析

攻擊者沒有另外偽造一個仿冒套件名稱，而是直接用 Anthropic 官方擴充套件的識別碼 `anthropic.claude-code` 發布了一個被竄改的版本 2.1.313，繞過了「只認發布者 ID」這種信任模型。OpenSourceMalware 共同創辦人 Jenn Gile 的分析指出，惡意程式碼是插在合法 `extension.js` 最前面的 66 行載入器，原本的擴充套件功能完全保留，載入器一執行就會自動啟動，不需要使用者有任何額外互動。

載入後的行為分三層：先蒐集主機與環境資訊（主機名、使用者名稱、作業系統與架構、家目錄與工作目錄、`git config --global user.email`、公開 IP，以及名稱中含 KEY、TOKEN、SECRET、PASS、AWS、GCP 的環境變數名稱，但不含變數值本身）；接著把攻擊者的 SSH 公鑰（標記為 `svc-telemetry`，用來混淆成無害服務）寫入 `~/.ssh/authorized_keys`，並嘗試啟用本機 SSH 服務、建立指向 `134.209.82.225` 的反向通道；最後在 macOS 用 LaunchAgent（`com.apple.sysmond`）、Windows 用排程工作 `SysMon`（嘗試以 SYSTEM 權限執行，並有 Startup 腳本備援）做持久化，每約 60 秒重試一次通道連線，並透過未加密的 HTTP POST 把主機資訊送到 `134.209.82.225:8099/beacon`。

根據 Cursor 官方分析與資安研究機構 Phorion 的拆解，啟用本機 SSH 服務這一步本身需要系統管理員權限，而惡意程式碼在多數 macOS（用 `systemsetup -getremotelogin` 檢查狀態時沒有取得權限，回傳的是錯誤訊息而非「Off」，因此跳過啟用步驟）與 Windows（想用 `/bin/sh` 執行 PowerShell 指令，但 Windows 預設沒有這個 Unix shell）主機上都會失敗，攔截了反向 SSH 連線實際被攻擊者利用的機會。但即使啟用失敗，SSH 金鑰、持久化機制與主機資訊回傳三個動作仍會執行完成。

```diagram
title: Cursor Marketplace Claude Code 擴充套件後門攻擊鏈
desc: 攻擊者以合法擴充套件識別碼發布竄改版本，受害主機安裝後在本機植入 SSH 金鑰與持久化機制，但啟用 SSH 的步驟因程式碼錯誤在多數主機失敗
caption: 依 Cursor 官方公告、OpenSourceMalware 與 Phorion 的分析整理
step: 攻擊者使用合法的 anthropic.claude-code 識別碼，在 Cursor Marketplace 發布竄改版 2.1.313
step: 使用者透過 Cursor Marketplace 安裝或自動更新這個版本
step: 受害主機載入 extension.js 前置的 66 行惡意載入器
step: 載入器在受害主機植入攻擊者的 SSH 金鑰，並建立 LaunchAgent／排程工作持久化
step: 受害主機嘗試啟用本機 SSH 並建立反向通道，但多數 macOS／Windows 主機因程式碼錯誤而失敗
step: 受害主機仍透過 HTTP POST 把主機資訊回傳給攻擊者的伺服器
---
<svg viewBox="0 0 760 480">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="452"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="452"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="452"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H316" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="108" text-anchor="middle" dominant-baseline="central">發布竄改版 2.1.313</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M320 176H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="164" text-anchor="middle" dominant-baseline="central">使用者安裝或更新</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M548 232H576Q584 232 584 240V248Q584 256 576 256H552" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="596" y="244" text-anchor="start" dominant-baseline="central">載入惡意載入器</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M548 296H576Q584 296 584 304V312Q584 320 576 320H552" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="596" y="308" text-anchor="start" dominant-baseline="central">植入金鑰並持久化</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M540 360H100" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="432" y="348" text-anchor="middle" dominant-baseline="central">嘗試建立反向通道</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--dashed" d="M540 416H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="404" text-anchor="middle" dominant-baseline="central">回傳主機資訊</text>
  </g>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">攻擊者</text>
  <rect class="dg-box" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Cursor 市集</text>
  <rect class="dg-box dg-box--accent" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">受害主機</text>
</svg>
```

對應 OWASP LLM Top 10：**LLM05 Supply Chain Vulnerabilities**。這次攻擊面不是模型或 prompt 本身，而是 AI coding agent 的分發管道——IDE 擴充套件以使用者完整權限執行，一旦市集本身的發布流程被突破，「擴充套件 ID 與合法發布者相符」這個使用者唯一能核對的信任訊號就失效了。The Hacker News 的報導也提到，這起事件發生在 OVHcloud 官方 CLI 的發布版本被 GlassWorm 攻擊者竄改（本站已有[報導](/posts/daily/2026-10-06-security-glassworm-vscode-theme-supply-chain)）之後一週多，顯示開發工具鏈的發布管道正持續被當作攻擊目標。

## 防禦做法

**立即動作**
- 檢查機器是否中招：macOS 執行 `grep -qs svc-telemetry ~/.ssh/authorized_keys`；Windows 在 PowerShell 檢查 `$HOME\.ssh\authorized_keys` 與 `C:\ProgramData\ssh\administrators_authorized_keys` 是否含 `svc-telemetry` 字串（Cursor 官方公告提供完整指令）
- 若命中，依 Cursor 公布的 [remediate-macos.sh](https://cursor.com/static/security/claude-code-extension/remediate-macos.sh) 或 [remediate-windows.ps1](https://cursor.com/static/security/claude-code-extension/remediate-windows.ps1) 清除 SSH 金鑰、持久化機制與執行中的 tunnel 程序——單純移除擴充套件不夠，惡意程式碼會留下獨立執行的持久化腳本
- 評估是否需要重建受影響主機，並從受感染機器可存取的範圍輪替憑證與 session；環境變數值雖未被直接外傳，但攻擊者若曾透過後門取得存取權，仍可能事後讀取
- 暫停 Cursor Marketplace 擴充套件的自動更新，改為核對 Cursor 官方公告的 VSIX SHA-256 雜湊後再手動更新

**長期架構**
- 把 IDE 擴充套件當成一般的軟體供應鏈依賴來管理：鎖定版本、驗證雜湊，不要只靠「擴充套件 ID 與發布者名稱相符」這個單一訊號做信任判斷
- 考慮引入 Protect AI 之類的 AI／ML 供應鏈掃描工具，把掃描範圍從模型與套件延伸到 AI coding agent 的擴充套件與工具鏈本身
- 對執行 AI coding agent 的開發環境做最小權限與網路出口限制（例如限制對外建立 SSH 反向通道的能力），這樣即使擴充套件被植入後門，影響範圍也能被侷限

## 影響範圍

Cursor 統計最多 5,000 名使用者在約 11 小時的暴露時間窗內安裝或更新到惡意版本，公司已表示會直接聯繫受影響使用者。由於啟用本機 SSH 服務在多數主機上失敗，真正讓攻擊者取得遠端存取權的比例可能遠低於暴露人數；但 SSH 金鑰植入、持久化機制與主機資訊回傳三個動作不受此限制，代表這些主機上仍留有攻擊者可利用的殘留。Cursor 已下架惡意版本、重建市集並輪替金鑰，也與主機服務商合作讓攻擊者伺服器 `134.209.82.225` 離線，中斷了反向連線與資訊回傳通道；但攻擊者如何取得發布權限竄改這個合法識別碼下的套件，目前仍未有公開解釋。

如果你的團隊透過 Cursor 使用 Claude Code 擴充套件，且有打開自動更新，這段暴露時間窗內就存在風險。即使 SSH 後門本身在你的平台上啟用失敗，仍建議照 Cursor 的檢查清單確認是否有殘留的金鑰或持久化項目——這類攻擊留下的痕跡不會因為核心酬載失效而消失。

## 今日收穫

這次事件戳破了一個常見假設：只要擴充套件識別碼與官方發布者完全相符，內容就可信。實際上發布管道本身可以被滲透，使用者端唯一能核對的「發布者 ID 正確」訊號在這種情境下完全失效。真正能擋下這類攻擊的不是信任發布者身份，而是版本雜湊驗證與行為層的監控——這也是為什麼攻擊的酬載本身帶 bug、在多數平台啟用 SSH 失敗，反而成了唯一真正發揮作用的「防線」。

## 參考資料

- [Official Claude Code Extension on Cursor Marketplace Trojanized with Persistent SSH Backdoor — The Hacker News](https://thehackernews.com/2026/10/official-claude-code-vs-code-extension.html)
- [Malicious Claude Code extension on Cursor planted SSH backdoors — BleepingComputer](https://www.bleepingcomputer.com/news/security/malicious-claude-code-extension-on-cursor-planted-ssh-backdoors/)
- [Security notice — malicious version of Anthropic.claude-code (2.1.313) — Cursor 官方公告](https://cursor.com/blog/claude-code-extension-security-notice)
- [Official Claude Code Extension Compromise: Security Advisory — Phorion](https://phorion.io/blog/offical-claude-code-vsx-compromise/)
- [Trojanized Claude Code extension plants persistent SSH backdoor — OpenSourceMalware](https://opensourcemalware.com/blog/trojanized-claude-code-extension-plants-persistent-ssh-backdoor)
