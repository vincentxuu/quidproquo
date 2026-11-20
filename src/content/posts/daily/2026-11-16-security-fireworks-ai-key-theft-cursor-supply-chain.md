---
title: "資安警報｜Cursor 揭露：Fireworks AI 金鑰外流是擴充套件後門事件根因"
date: 2026-11-16
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "Cursor 公布為期兩週的調查結果：攻擊者用從 Fireworks AI 外流的存取金鑰，橫向進入 Cursor 內部 SaaS 工具並竊得憑證，才能在 Marketplace 植入竄改版 Claude Code 擴充套件；同一起 Fireworks 外洩另外也波及 Uber 與 Notion。"
tldr: "Cursor 公布 10/29 Claude Code 擴充套件後門事件的根因：攻擊者用從 Fireworks AI 外流的存取金鑰讀取雙方共享的資料桶，找到未遮蔽的使用者憑證，再橫向進入 Cursor 內部 SaaS 工具竄改套件。同一把 Fireworks 金鑰外流另外也牽出 Uber 駕照資料與 Notion AI 對話紀錄外洩。"
series:
  name: "AI Security Alert"
  order: 79
---

> :globe: [English version](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain-en)

## 事件概述

本站先前報導過 [Cursor Marketplace 官方 Claude Code 擴充套件遭植入 SSH 後門](/posts/daily/2026-10-31-security-claude-code-cursor-extension-ssh-backdoor) 一事，當時留下一個沒有答案的問題：攻擊者究竟怎麼拿到發布權限，竄改了一個使用合法識別碼的套件？Cursor 在 2026-11-13 公布長達兩週的調查結果，補上了這個根因——攻擊者先拿到 Cursor 發給推論供應商 Fireworks AI 的一把存取金鑰，這把金鑰被 Fireworks 自己的資安事件外流，攻擊者用它讀到雙方共享的資料桶，從裡面殘留的未遮蔽憑證一路橫向移動到 Cursor 內部 SaaS 工具，最後才能在 Marketplace 快取植入竄改版擴充套件。同一起 Fireworks AI 外洩，另外也分別牽出 Uber 駕照資料外洩與 Notion AI 對話紀錄外洩兩起獨立事件。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（第三方推論供應商金鑰外流，橫向移動到 SaaS 工具鏈與套件發布管道） |
| 影響範圍 | Cursor 內部系統與少數客戶資料；透過 Cursor Marketplace 於 2026-10-29 安裝或更新到 `anthropic.claude-code` 2.1.312／2.1.313 的使用者；另外波及 Fireworks AI 的部分客戶（含 Uber、Notion） |
| 嚴重程度 | High（涉及原始碼倉庫、客戶支援資料與憑證外流，並衍生成供應鏈攻擊） |
| CVE | 無 |
| 來源 | [The Hacker News](https://thehackernews.com/2026/11/stolen-fireworks-ai-key-led-to-cursor.html)、[Cursor 官方更新](https://cursor.com/blog/security-incident-update)、[Fireworks AI 資安公告](https://fireworks.ai/security/bulletins)、[Beam 攻擊追蹤器](https://agentbeam.com/blog/cursor-fireworks-security-incident-agent-traces-november-2026) |

## 攻擊面分析

攻擊鏈的起點不在 Cursor，而在 Cursor 的推論供應商 Fireworks AI。Fireworks 本身在 2026-10-23 遭第三方雲端供應商入侵，隔天攻擊者就用這個立足點進入 Fireworks 的研發機器、跑了未授權的工作負載；這起事件後來被 Fireworks 自己在 11 月 9 日的公告中擴大範圍，坦承除了評測作業用的 secrets 之外，部分客戶的帳務資料、資料集與未完成的模型權重也遭存取。Cursor 是受害客戶之一：Cursor 發給 Fireworks 的一把存取金鑰在這起外洩中曝光，攻擊者用它讀取一個雙方共享的唯讀資料桶——桶內存放的是 2025 年、未啟用 Privacy Mode、原本就同意用於模型訓練的 coding agent trace。問題是這批 trace 裡混進了少量沒有被遮蔽的憑證，影響不到 0.01% 客戶的 API 金鑰。

攻擊者就是從這批外流憑證開始橫向移動：先用它們存取 Cursor 內部使用的若干 SaaS 工具，再從這些工具拿到非正式環境的原始碼倉庫（部分含商業聯絡資訊）、客戶支援信件、產品使用數據，以及使用者過去寄給 Cursor 支援團隊的憑證。10 月 29 日，攻擊者用從內部系統外流的另一把憑證，直接把竄改版的 Anthropic Claude Code 擴充套件放進 Cursor VS Code Marketplace 的發布快取，約 11 小時內最多 5,000 名使用者可能收到這個版本——這正是上一篇文章報導的事件本身。同一時間，Fireworks 這起外洩還延伸出兩條獨立支線：TechCrunch 證實 Uber 申報的「服務供應商憑證遭竊」就是 Fireworks，導致數千名駕駛的駕照資料外洩；Notion 則發現自己與 Fireworks 的合約明定「零資料保留」，但 Fireworks 端仍保留了 Notion AI 的對話紀錄副本。

```diagram
title: Fireworks AI 金鑰外流如何牽出擴充套件後門與 Uber、Notion 外洩
desc: 第三方雲端供應商遭突破後蔓延到 Fireworks 開發機器，Cursor 與 Fireworks 共享的資料桶內未遮蔽憑證外流，攻擊者藉此橫向進入 Cursor 內部 SaaS 工具並植入竄改版擴充套件；同一起 Fireworks 外洩另外也波及 Uber 與 Notion。
caption: 依 Cursor、Fireworks AI 官方公告與 The Hacker News、i10x.ai 的報導整理。
step: 攻擊者入侵 Cursor 研發用的第三方雲端供應商
step: 藉此立足點進入 Fireworks 的開發機器
step: 竊得 Cursor 與 Fireworks 共享的資料桶存取金鑰，桶內未遮蔽憑證外流
step: 用外流憑證橫向進入 Cursor 內部 SaaS 工具，取得原始碼、支援資料與使用者憑證
step: 用竊得憑證在 Cursor Marketplace 快取植入竄改版 Claude Code 擴充套件
step: 同一起 Fireworks 外洩另外也分別波及 Uber 的駕照資料與 Notion 的 AI 對話紀錄
---
<svg viewBox="0 0 760 536">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V220H168Q160 220 160 228V248" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 188V248" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line" d="M400 188V220H632Q640 220 640 228V248" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line" d="M160 308V348" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M160 408V448" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="320" y="32" width="160" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">第三方雲端供應商</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">攻擊者先入侵</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="308" y="132" width="184" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">Fireworks 開發機器</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">研發環境遭存取</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="76" y="252" width="168" height="56" rx="6"/>
    <text class="dg-label" x="160" y="271" text-anchor="middle" dominant-baseline="central">Cursor 共享資料桶</text>
    <text class="dg-sub" x="160" y="291" text-anchor="middle" dominant-baseline="central">未遮蔽憑證外流</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="328" y="252" width="144" height="56" rx="6"/>
    <text class="dg-label" x="400" y="271" text-anchor="middle" dominant-baseline="central">Uber</text>
    <text class="dg-sub" x="400" y="291" text-anchor="middle" dominant-baseline="central">駕照資料外洩</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="560" y="252" width="160" height="56" rx="6"/>
    <text class="dg-label" x="640" y="271" text-anchor="middle" dominant-baseline="central">Notion</text>
    <text class="dg-sub" x="640" y="291" text-anchor="middle" dominant-baseline="central">AI 對話紀錄外洩</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="60" y="352" width="200" height="56" rx="6"/>
    <text class="dg-label" x="160" y="371" text-anchor="middle" dominant-baseline="central">Cursor SaaS 工具鏈</text>
    <text class="dg-sub" x="160" y="391" text-anchor="middle" dominant-baseline="central">原始碼／支援資料／憑證</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="60" y="452" width="200" height="56" rx="6"/>
    <text class="dg-label" x="160" y="471" text-anchor="middle" dominant-baseline="central">竄改版擴充套件</text>
    <text class="dg-sub" x="160" y="491" text-anchor="middle" dominant-baseline="central">2.1.312／313 快取發布</text>
  </g>
</svg>
```

這條鏈路對應到 OWASP LLM Top 10 的兩個類別：**LLM06 Sensitive Information Disclosure**（coding agent trace 這種同意用於訓練的資料裡，殘留了沒被遮蔽的憑證）與 **LLM05 Supply Chain Vulnerabilities**（這批外流憑證被用來橫向移動、最終轉成對套件發布管道的供應鏈攻擊）。值得注意的是，根本原因不是模型或 prompt 本身的弱點，也不是 Cursor 或 Anthropic 的程式碼有漏洞——Cursor 在公告中特別澄清「這不是 Anthropic 產品的漏洞」。真正的破口是「允許用於訓練」這個同意框背後，沒有自動化機制去檢查資料裡是否殘留機密；一旦下游供應商（Fireworks）自己出事，這份本來只是離線訓練用的歷史資料，就變成了攻擊者進入正式系統的墊腳石。

## 防禦做法

**立即動作**
- 若團隊曾在 2026-10-29 當日透過 Cursor Marketplace 安裝或更新到 `anthropic.claude-code` 2.1.312 或 2.1.313，依前篇文章整理的 Cursor 官方清除腳本確認是否有殘留的 SSH 金鑰或持久化項目——單純移除擴充套件不夠
- 若團隊是 Fireworks AI 的直接客戶，盤點所有與 Fireworks 共享過的資料桶與 API 金鑰，全面輪替，並檢查歷史資料中是否曾意外附帶憑證
- 若團隊使用 Notion AI 或任何透過 Fireworks 代管推論的 SaaS，依供應商公告檢查「Security incident review」，輪替曾貼進去的密碼或金鑰

**長期架構**
- 任何要分享給第三方訓練或推論供應商的 log、trace，在匯出前就做自動化的憑證／密鑰 redaction，不要只靠「使用者同意用於訓練」這個同意框來把關資料內容
- 把發給第三方供應商的存取金鑰換成最小權限、短期有效的憑證，讓金鑰洩漏後的自動失效時間短於攻擊者橫向移動所需的時間
- 導入 Protect AI 之類涵蓋資料集與模型權重的 ML 供應鏈掃描，把稽核範圍從套件、模型延伸到訓練與評測資料本身的外流風險——這次事件裡 Fireworks 連資料集與未完成的模型權重都被存取
- 對內部 SaaS 工具鏈做分段隔離，讓單一外部供應商金鑰洩漏不足以串連到原始碼倉庫、客戶支援信箱與套件發布快取這三個不同系統

## 影響範圍

Cursor 統計最多 5,000 名使用者在約 11 小時的暴露時間窗內安裝或更新到惡意版本，另有低於 0.05% 的使用者的 coding agent trace 曾外洩（先前估計低於 0.01% 的使用者有 API 憑證外流），公司已逐一聯絡受影響客戶；Cursor 表示最後一次觀測到攻擊者活動是在 11 月 1 日，且當次嘗試已被封鎖。更上游的 Fireworks AI 事件影響範圍更廣：10 月 23 日第三方雲端供應商遭突破，隔天蔓延到 Fireworks 研發機器，波及全體客戶的帳務資訊，以及部分客戶的 secrets、資料集與未完成的模型權重；Notion 表示不到 1% 的工作區可能受影響，已於 11 月 3 日切斷與 Fireworks 的連線；Uber 則透過一家未具名「服務供應商」（TechCrunch 證實即 Fireworks）的憑證外洩，導致數千名駕駛的駕照資料遭竊，並已向加州州檢察長辦公室申報。

如果貴團隊同時是 Cursor 使用者、Fireworks AI 直接客戶，或是透過 Notion AI 等下游服務間接使用 Fireworks，都落在這起事件的影響範圍內，需要分別對照三邊各自的公告逐一檢查，不能只看其中一份就當作事情結束。

## 今日收穫

上一篇報導這起事件時，結尾留了一個沒有答案的問題：攻擊者怎麼拿到發布權限，竄改一個合法識別碼下的套件？這次 Cursor 的揭露給出的答案，不是「擴充套件市集本身被攻破」，而是「分享給訓練供應商的歷史資料裡，混進了沒被遮蔽的憑證」。這提醒我：供應鏈風險鏈結裡最薄弱的一環，常常不是最顯眼的那段（套件簽章、發布流程、CI/CD 權限），而是資料共享協議裡「這批資料允許拿去訓練」這個同意框背後，到底有沒有人在把關資料內容本身。

## 參考資料

- [Cursor Says Stolen Fireworks AI Key Led to Trojanized Claude Code Extension Incident — The Hacker News](https://thehackernews.com/2026/11/stolen-fireworks-ai-key-led-to-cursor.html)
- [An update on our recent security incident — Cursor 官方部落格](https://cursor.com/blog/security-incident-update)
- [Security bulletins — Fireworks AI](https://fireworks.ai/security/bulletins)
- [Fireworks AI breach exposed customer datasets and Notion AI chats — i10x.ai](https://i10x.ai/news/fireworks-ai-breach-exposed-customer-datasets-notion-ai-chats)
- [Cursor: Fireworks-exposed key led to trace theft and a tampered Claude Code extension — Beam 攻擊追蹤器](https://agentbeam.com/blog/cursor-fireworks-security-incident-agent-traces-november-2026)
- [Cursor Marketplace 官方 Claude Code 擴充套件遭植入 SSH 後門（本站前篇報導）](/posts/daily/2026-10-31-security-claude-code-cursor-extension-ssh-backdoor)
