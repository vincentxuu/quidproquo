---
title: "資安警報｜Together AI 編碼 agent 提交外洩憑證，入侵者下載真實使用者 prompt 樣本並測試其他金鑰"
date: 2026-11-23
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: zh-TW
description: "Together AI 揭露一台 AI 編碼 agent 在開發公開 repo 時提交了外洩憑證，導致未經授權者下載存有真實使用者 prompt 樣本的私有 Hugging Face repo，並在樣本中搜尋、測試其他服務的憑證。"
tldr: "Together AI CEO 於 2026-11-21 揭露：AI 編碼 agent 在開發公開 GitHub repo「xorl」時提交了一個能存取私有 Hugging Face repo 的憑證，該 repo 存有 MiniMax M3、GLM-5.2、Kimi K2.6 的真實使用者 prompt 樣本；自動掃描雖撤回 commit，但未經授權者已在窗口內下載樣本並測試其中夾帶的其他服務憑證（含 5 組 Dragos canary 憑證）。Together AI 已導入 PR 層憑證檢查與預設 ZDR，根因是 agent 的 commit 權限沒有被當成需要額外審查的動作。"
series:
  name: "AI Security Alert"
  order: 85
---

> :globe: [English version](/posts/daily/2026-11-23-security-together-ai-coding-agent-credential-leak-en)

## 事件概述

Together AI CEO Vipul Ved Prakash 於 2026-11-21 公開揭露一起事件：一台負責開發公開 GitHub repo「xorl」的 AI 編碼 agent，在提交程式碼時把一個能存取私有 Hugging Face repo 的憑證一併提交進公開 repo。該私有 repo 存放的是用於例行軟體測試的 prompt 樣本，內容來自 2026 年 6 月 24 日、7 月 4 日、7 月 8 日、7 月 14 日對 MiniMax M3、GLM-5.2、Kimi K2.6 這三個模型的真實使用者請求。Together AI 的自動掃描偵測到外洩並撤回該 commit，但在憑證對外公開的窗口內，已有未經授權者用它下載了私有 repo 裡的樣本，並在樣本內容中搜尋、測試其他服務的憑證——其中 5 組被識別為資安公司 Dragos 布下的 canary 憑證（誘餌憑證，用於偵測未授權存取）。Together AI 已聯繫外部鑑識公司與執法機關，審查仍在進行中，目前尚未證實是否有客戶敏感個資外洩。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | AI Coding Agent 憑證外洩 → 資料下載 → 憑證搜集測試（Data Exfiltration） |
| 影響範圍 | Together AI 平台上 MiniMax M3、GLM-5.2、Kimi K2.6 於 2026 年 6–7 月特定四日的 prompt 樣本資料；確切受影響客戶數未公開 |
| 嚴重程度 | High |
| CVE | 無（屬流程/權限設計缺陷，非單一軟體漏洞） |
| 來源 | [Together AI 官方揭露](https://together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026?latest=20261122), [Futurum Group](https://futurumgroup.com/insights/together-ais-agent-credential-leak-exposes-agentic-pipeline-risk), [VectorWire](https://vectorwire.ai/article/together-ai-s-own-coding-agent-becomes-the-supply-chain-threat-3aaef5) |

## 攻擊面分析

攻擊路徑本身並不複雜：AI 編碼 agent 在處理公開 repo「xorl」的開發工作時，把一個原本應該保密的憑證寫進了提交的程式碼裡。這個憑證能存取另一個私有的 Hugging Face repo，裡面存放的是為了例行軟體測試而留存的真實使用者 prompt 樣本。commit 公開後，自動化掃描抓到了外洩的憑證並把 commit 撤回，但「偵測到」和「憑證失效」之間存在時間差——未經授權者已經用這個憑證下載了私有 repo 的內容，並進一步在樣本文字中搜尋看起來像憑證的字串，逐一測試是否仍然有效，其中 5 組被識別為 Dragos 布下的 canary 憑證。

```diagram
title: AI 編碼 agent 的一次提交，如何演變成客戶資料外洩
desc: Together AI 的 AI 編碼 agent 在開發公開 repo 時誤將憑證寫入 commit，自動掃描雖及時撤回，但外洩窗口內已有未經授權者下載私有 repo 中的真實使用者 prompt 樣本，並從中搜尋、測試其他服務的憑證。
caption: 依 Together AI 官方揭露與 Futurum Group 分析整理。
step: AI agent 開發公開 repo「xorl」時提交外洩憑證
step: 自動掃描偵測到外洩，commit 隨即被撤回
step: 但外洩窗口內，憑證已被未經授權者用來下載私有 HF repo
step: 該 repo 存有 2026 年 6–7 月的真實使用者 prompt 樣本
step: 入侵者在樣本中搜尋並測試其他服務憑證，含 5 組 Dragos canary 憑證
step: 11/21 官方揭露，導入 PR 憑證檢查與預設 ZDR
---
<svg viewBox="0 0 760 596">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M400 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M400 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="240" y="32" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">AI agent 提交外洩憑證</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">開發公開 repo「xorl」過程中</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="240" y="132" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">自動掃描偵測，commit 被撤回</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">但外洩窗口已被利用</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="200" y="232" width="400" height="56" rx="6"/>
    <text class="dg-label" x="400" y="251" text-anchor="middle" dominant-baseline="central">入侵者用該憑證下載私有 HF repo</text>
    <text class="dg-sub" x="400" y="271" text-anchor="middle" dominant-baseline="central">repo 內存放測試用 prompt 樣本</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="200" y="332" width="400" height="56" rx="6"/>
    <text class="dg-label" x="400" y="351" text-anchor="middle" dominant-baseline="central">樣本含 2026 年 6–7 月真實請求內容</text>
    <text class="dg-sub" x="400" y="371" text-anchor="middle" dominant-baseline="central">MiniMax M3、GLM-5.2、Kimi K2.6</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="180" y="432" width="440" height="56" rx="6"/>
    <text class="dg-label" x="400" y="451" text-anchor="middle" dominant-baseline="central">入侵者在樣本中搜尋並測試其他憑證</text>
    <text class="dg-sub" x="400" y="471" text-anchor="middle" dominant-baseline="central">其中 5 組為 Dragos 的 canary 憑證</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="240" y="532" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="551" text-anchor="middle" dominant-baseline="central">11/21 官方揭露並啟動補救</text>
    <text class="dg-sub" x="400" y="571" text-anchor="middle" dominant-baseline="central">PR 憑證檢查、ZDR 預設開啟</text>
  </g>
</svg>
```

真正值得留意的是根本原因：Together AI 自己的分析指出，這個 commit 本該是一個會被標記的授權決策——如果是人類開發者提交同樣內容，照理會被 code review 擋下；但 agent 的輸出在當時的流程裡沒有被當成需要額外審查的高風險動作。另外，把真實使用者的 prompt 樣本長期留存在測試用的 repo 裡，等於把「資料外洩」的影響面從單一憑證外洩放大成了潛在的二次外洩（樣本中可能夾帶其他憑證或敏感內容）。

對照 OWASP LLM Top 10：**LLM06 Excessive Agency**（agent 擁有與人類開發者等同的 commit 權限，卻沒有對應的審查關卡）是根因，**LLM02 Insecure Output Handling** 的變體也成立——agent 產生的程式碼變更被直接信任並發布，沒有把「agent 輸出」與「人類輸出」區分對待。

## 防禦做法

**立即動作**
- 盤點所有讓 AI 編碼 agent 具備 commit / push 權限的 repo，確認 pull request 層級有自動憑證掃描（Together AI 的補救措施之一就是把憑證檢查加到所有 PR，而非只在合併後靠背景掃描）
- 檢查任何測試或除錯用途而留存「真實使用者 prompt / 請求內容」的 repo 或儲存體，評估是否真的需要長期保留；留存就必須視為敏感資料，套用與生產環境資料同等的存取控制
- 若貴團隊也使用 Together AI 的受影響模型（MiniMax M3、GLM-5.2、Kimi K2.6），建議啟用零資料保留（Zero Data Retention, ZDR），並檢查是否收到官方個別通知

**長期架構**
- 把 AI agent 視為獨立的身分主體（identity），套用最小權限與短期憑證：agent 不該持有與人類開發者相同範圍、長期有效的憑證，優先採用可自動輪替、無需長期保存金鑰的 keyless 存取
- 在 agent 的程式碼變更進入 CI/CD 前，加入「高風險動作」判定——例如新增憑證、修改存取控制設定、對外發布 — 觸發強制人工核准，而不是和一般程式碼變更走同一條自動合併路徑
- 需要系統性治理 AI agent 可執行動作與審批關卡時，可參考 watchlist 中 Zenity 這類專做 agent 行為治理與高風險動作核准的工具；若需要掃描/稽核 ML 開發流程中夾帶的憑證與敏感資料，可參考 Protect AI 涵蓋 ML 供應鏈的掃描能力

## 影響範圍

Together AI 尚未揭露確切有多少客戶的 prompt 樣本在這次外洩範圍內，官方說法是「審查仍在進行中」，若確認有敏感資料會直接聯繫受影響客戶。可以確認的是：入侵者確實下載了樣本並測試了其中的憑證（包含 5 組 Dragos 的 canary 憑證），代表這不是單純的「理論風險」，而是已發生、有人實際嘗試利用外洩資料進一步橫向取得其他系統存取權的事件；官方與鑑識調查目前也尚未排除樣本中是否還有其他未被發現的憑證。Together AI 公開的時間線本身也有缺口——commit 的確切時間、憑證曝光窗口的長度都未揭露，只知道樣本資料的生成日期（6/24、7/4、7/8、7/14）早於 11/21 的揭露足足四個多月。如果你的團隊也讓 AI coding agent 具備對 repo 的寫入權限，這起事件的教訓不是「agent 不安全」,而是「把 agent 的輸出當成人類輸出一樣信任」這個預設本身就是風險。

## 今日收穫

這次事件沒有酷炫的漏洞鏈或 CVE,卻比很多技術性漏洞更值得警惕——它發生在一個相對成熟、本身就是 AI 基礎設施供應商的團隊身上,而根因只是「一次很普通的 commit,沒人多看一眼」。這提醒我:當我們把 agent 的操作權限等同於人類開發者時,其實是假設了 agent 的輸出品質和風險意識也等同於人類開發者——但 code review 這層把關之所以存在,本來就是因為人類也常犯這種錯,而我們卻經常在把關卡拿掉之後,才想起它原本是為什麼存在。

## 參考資料

- [Security event: Prompt leakage for requests in June and July of 2026 — Together AI 官方部落格](https://together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026?latest=20261122)
- [Together AI's Agent Credential Leak Exposes Agentic Pipeline Risk — Futurum Group](https://futurumgroup.com/insights/together-ais-agent-credential-leak-exposes-agentic-pipeline-risk)
- [Together AI Coding Agent Exposes Prompt Data in Supply-Chain Leak — VectorWire](https://vectorwire.ai/article/together-ai-s-own-coding-agent-becomes-the-supply-chain-threat-3aaef5)
