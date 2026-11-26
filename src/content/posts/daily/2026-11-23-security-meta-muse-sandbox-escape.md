---
title: "資安警報｜單一惡意網頁串連瀏覽器與核心漏洞，攻破 Meta Muse Agent 雲端沙箱竊取私訊與記憶"
date: 2026-11-23
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "資安公司 NebuSec 示範單一惡意網頁如何串連 Chromium 瀏覽器與 Linux 核心漏洞，突破 Meta 個人 AI agent「Muse」的雲端沙箱，未經核准竊取並竄改使用者私訊與記憶，再取得 VM root 權限碰到憑證儲存庫。"
tldr: "資安公司 NebuSec 於 2026-11-20 發表研究，示範單一惡意網頁如何讓 Meta 的個人 AI agent Muse 在匯出 PDF 時觸發瀏覽器沙箱逸出，再串連 Linux 核心漏洞取得雲端 VM 的 root 權限，繞過網路守門服務 Sentinel 竊取並竄改使用者私訊與記憶，全程無核准提示。Meta 在論文發表前已修補所有漏洞，官方未對外證實或評論。若自家 agent 有內嵌瀏覽器做網頁匯出或渲染，應優先檢查瀏覽器更新節奏與核准規則是否有類似的字串繞過漏洞。"
series:
  name: "AI Security Alert"
  order: 84
---

> :globe: [English version](/posts/daily/2026-11-23-security-meta-muse-sandbox-escape-en)

## 事件概述

資安研究公司 NebuSec 於 2026-11-20 發布研究報告，示範攻擊者只需讓 Meta 的個人 AI agent「Muse」開啟一個惡意網頁，就能一路串連瀏覽器漏洞與 Linux 核心漏洞，從單純的網頁瀏覽升級成雲端虛擬機（VM）的 root 權限。Muse 是 Meta 於 2026-09-08 推出的消費級個人助理，可代替使用者連接 email、Notion、Facebook 等帳號並執行購物等操作，每位使用者的 agent 各自跑在一台獨立的雲端 VM 裡，由監控對外流量的 Sentinel 服務與獨立的憑證管理服務把關。NebuSec 在自建的測試帳號上示範：攻擊者可在未觸發任何核准提示的情況下，竊取並竄改使用者的對話紀錄與記憶，再透過瀏覽器漏洞鏈結核心漏洞取得 VM root 權限，進而碰到原本被隔離在 agent 執行環境外的 100 GiB 加密磁碟與 Secure Credential Storage。NebuSec 已將發現回報給 Muse 團隊，所有描述的漏洞在論文發表前皆已修補；Meta 官方未公開證實或評論這次研究，也沒有說明修補前是否已有真實使用者資料遭存取。The Hacker News、AI Chat Daily、Bytechap 等媒體已分別報導並交叉確認。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Sandbox Escape / Privilege Escalation（瀏覽器漏洞串連 Linux 核心漏洞，突破多層容器與 VM 隔離） |
| 影響範圍 | Meta Muse 個人 AI agent 的雲端執行環境；研究範圍限於 NebuSec 自建的測試帳號，未涉及真實使用者資料 |
| 嚴重程度 | High（攻擊鏈在實驗室環境完整示範，從單一惡意網頁走到 VM root 權限與憑證儲存庫；未確認真實使用者受影響，且揭露前已修補） |
| CVE | 無公開 CVE 編號（NebuSec 以 Chromium issue tracker 編號標示 V8 漏洞，如 554034656；Linux 核心漏洞被描述為「落在已公開 CVE 的受影響範圍內」，未指名特定編號） |
| 來源 | [NebuSec 研究報告](https://nebusec.ai/research/meta-muse-credential-exposure/)、[The Hacker News](https://thehackernews.com/2026/11/a-single-malicious-webpage-let.html) |

## 攻擊面分析

攻擊路徑從 Muse 內建的 Chromium 瀏覽器開始——Muse 用它執行螢幕截圖、縮圖與 PDF 匯出等任務。NebuSec 測試時，這個瀏覽器版本停留在 M152 系列 9 月 3 日發布的修補版（152.0.7977.82），落後官方最新版超過一個月，留下至少 5 個公開但未修補的 V8 漏洞可用的 n-day 視窗。NebuSec 用其中一個 V8 parser 漏洞（Chromium issue 554034656）逸出 V8 沙箱取得程式碼執行；由於 PDF 匯出用的瀏覽器處理程序關閉了 IPC sandbox，只要讓 Muse 匯出一個惡意網頁，一個市值約 500 美元的 renderer 漏洞就足以在 agent 的執行容器內跑任意 shell 指令，NebuSec 稱之為「0.5-click RCE」。

接下來要過 Sentinel 這關——Sentinel 負責審查所有對外流量，偵測 email、電話、驗證碼等敏感內容並攔截高熵字串，交由模型判斷是否核准。NebuSec 發現 Sentinel 把「無本體的 GET/HEAD/OPTIONS 請求」當成讀取操作，在 Muse 預設的核准模式（官方稱為「Ask for some actions」）下可以不經提示就外流；而一段用 Base64 編碼過的 email 位址反而觸發了審查，同一位址用純文字傳送卻直接通過。NebuSec 藉這條路徑把測試帳號的對話紀錄與記憶傳到自己的伺服器，還能反向竄改這些紀錄。

拿到容器內的執行權後，NebuSec 用自家的自動化漏洞產生框架打核心：VM 跑的是 Hatch 客製化的 Ubuntu 核心（Linux 7.0.0-39-generic，2026-09-24 編譯），關掉了 `RANDOMIZE_MEMORY`、`HARDENED_USERCOPY` 等強化選項，雖然精簡掉大量周邊驅動，仍落在多個已公開 CVE 的受影響範圍內。產生的核心漏洞在測試中成功率超過 99.9%，不需要預先算好的目標位移即可取得核心任意讀寫，藉此逸出容器拿到 VM root 權限——進而碰到使用者的加密磁碟、Secure Credential Storage，甚至 Sentinel 自身。NebuSec 未示範突破到底層 hypervisor host 或跨到其他使用者的環境。

對應 OWASP LLM Top 10：**LLM08 Excessive Agency**（agent 被授予直接操作瀏覽器、匯出任意網頁的能力，執行環境在容器邊界被突破後缺乏第二道防線）以及 **LLM06 Sensitive Information Disclosure**（Sentinel 的敏感內容偵測仰賴字串特徵比對，可被簡單編碼與請求型態繞過，使對話紀錄與記憶在無核准提示下外流）。值得留意的是，這條攻擊鏈本質上是傳統的瀏覽器 0-day 加核心漏洞組合，不是典型的 prompt injection；AI agent 放大的是這類傳統漏洞的破壞範圍——因為攻陷的不只是一個網頁分頁，而是整個代替使用者操作帳號、持有憑證的執行環境。

```diagram
title: 惡意網頁如何讓 Meta Muse 從瀏覽器漏洞一路攻到 VM root
desc: 攻擊者誘使 Muse 匯出一個惡意網頁，透過 Chromium 漏洞取得容器內執行權，繞過 Sentinel 竊取資料，再用核心漏洞逸出容器取得 VM root，碰到憑證儲存庫；NebuSec 發表前 Meta 已修補但未對外證實。
caption: 依 NebuSec 研究報告與技術分析整理。
step: 攻擊者誘使 Muse 匯出一個惡意網頁
step: Chromium V8 漏洞逸出沙箱，取得容器內程式碼執行權
step: 繞過 Sentinel 的字串偵測，竊取並竄改對話紀錄與記憶
step: 核心漏洞逸出容器，取得雲端 VM 的 root 權限
step: 碰到憑證儲存庫與加密磁碟等原本被隔離的資源
step: NebuSec 回報後 Meta 已修補，但未對外證實或評論
---
<svg viewBox="0 0 640 596">
  <path class="dg-line" d="M320 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M320 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="190" y="32" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="51" text-anchor="middle" dominant-baseline="central">攻擊者誘使 Muse 匯出惡意網頁</text>
    <text class="dg-sub" x="320" y="71" text-anchor="middle" dominant-baseline="central">PDF 匯出瀏覽器關閉 IPC sandbox</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="200" y="132" width="240" height="56" rx="6"/>
    <text class="dg-label" x="320" y="151" text-anchor="middle" dominant-baseline="central">Chromium V8 漏洞逸出沙箱</text>
    <text class="dg-sub" x="320" y="171" text-anchor="middle" dominant-baseline="central">取得容器內的程式碼執行權</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="180" y="232" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="251" text-anchor="middle" dominant-baseline="central">繞過 Sentinel 字串偵測外流資料</text>
    <text class="dg-sub" x="320" y="271" text-anchor="middle" dominant-baseline="central">竊取並竄改對話紀錄與記憶，無核准提示</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="210" y="332" width="220" height="56" rx="6"/>
    <text class="dg-label" x="320" y="351" text-anchor="middle" dominant-baseline="central">核心漏洞逸出容器</text>
    <text class="dg-sub" x="320" y="371" text-anchor="middle" dominant-baseline="central">取得雲端 VM 的 root 權限</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="190" y="432" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="451" text-anchor="middle" dominant-baseline="central">碰到憑證儲存庫與加密磁碟</text>
    <text class="dg-sub" x="320" y="471" text-anchor="middle" dominant-baseline="central">含 Secure Credential Storage</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="190" y="532" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="551" text-anchor="middle" dominant-baseline="central">發表前已修補，Meta 未證實</text>
    <text class="dg-sub" x="320" y="571" text-anchor="middle" dominant-baseline="central">NebuSec 回報，真實使用者影響未知</text>
  </g>
</svg>
```

## 防禦做法

**立即動作**
- 若自家 agent 架構內嵌瀏覽器做網頁渲染、截圖或 PDF 匯出，先確認瀏覽器版本是否落後官方最新版——NebuSec 這次能用到 5 個以上公開 V8 漏洞，根因就是一個多月的更新落差
- 檢查負責 PDF/文件匯出等高風險任務的瀏覽器處理程序是否關閉了 IPC/renderer sandbox，這類處理程序的本機執行權限不該高於一般瀏覽分頁
- 重新檢視敏感內容偵測或 outbound DLP 規則是否只靠字串特徵比對（如偵測 email 格式、驗證碼模式），這類規則容易被簡單編碼（Base64、URL encode）或「看起來像讀取」的請求型態繞過；把 GET/HEAD/OPTIONS 這類請求也納入核准流程，不要預設它們安全
- 盤點 agent 執行環境裡，憑證儲存庫與持久化儲存是否真的被容器/VM 層隔離，不要只看設計文件，要實測容器逸出後能摸到什麼

**長期架構**
- 把「容器隔離沒問題＋網路守門沒問題＋憑證分離沒問題」三者分開檢視的假設換掉——NebuSec 的結論是這三層各自都如設計運作，攻擊鏈卻仍完整走通，說明防禦深度取決於每一層邊界是否被正確維持，不是層數多寡
- 對內嵌在 agent 執行環境裡的第三方元件（瀏覽器、核心、runtime）建立版本與已知漏洞的持續追蹤機制，不要等資安研究人員找上門才知道落後了多久；可參考 Protect AI 這類涵蓋底層元件與推理堆疊掃描的工具做盤點
- 導入像 Zenity 這類專注在 agent 攻擊面與執行環境治理的工具，持續評估「agent 可以碰到哪些系統與憑證」，而不是只看單一元件是否有漏洞
- 把核准流程的信任邊界往外推：假設執行容器已被攻陷，核准決策不該只靠容器內部回報的狀態判斷——這次 root 權限的程式仍會跳出核准提示，說明設計本身有在防，但偵測規則的弱點讓防線形同虛設

## 影響範圍

NebuSec 的測試僅止於自己架設的 Muse 帳號與雲端 VM，未示範突破到底層 hypervisor host 或存取其他使用者的環境，也未確認真實使用者資料是否在修補前已遭存取。Meta 在發表前已修補 NebuSec 回報的所有漏洞，但官方未公開證實或評論這次研究，也未說明是否已重新稽核其他可能存在類似更新落差的內嵌元件。Meta 在 Muse 上線當天就對所有人開放漏洞懸賞，最高給付 30 萬美元，其中成功對單一使用者造成影響的 prompt injection 最高可拿 13 萬美元——顯示 Meta 自己也預期這類攻擊面會持續被測試。Muse 自 9 月推出以來已被指出過另一個安全缺口：The Hacker News 指出，9 月的早期漏洞需要使用者 Mac 裝置上已有惡意程式才能觸發，屬於端側風險；這次 NebuSec 的研究則是直接攻入 Muse 賴以運作的雲端基礎架構本身，風險面更廣。如果你的系統也讓 agent 操作內嵌瀏覽器執行高風險任務（匯出、截圖、讀取未知網頁），這起事件代表「沙箱設計得當」不保證「沙箱維護得當」——版本更新節奏本身就是攻擊面的一部分。

## 今日收穫

之前以為多層防禦（VM 隔離＋容器邊界＋網路守門＋憑證分離）疊起來，安全性會隨層數線性提升。但這次事件顯示，每一層如果各自「設計上看起來沒錯」卻在實作細節上留了縫（瀏覽器版本落後、Sentinel 用字串比對偵測敏感內容、核心強化選項被關掉），攻擊鏈還是能一路穿透到底——防禦深度不是層數的加總，而是每一層邊界本身夠不夠緊。

## 參考資料

- [Hacking Muse: Stealing Private Chats Through Browser Use — NebuSec 研究報告](https://nebusec.ai/research/meta-muse-credential-exposure/)
- [Inside Meta Muse: Browser, Sentinel and the Shared-Kernel Boundary — NebuSec 技術分析](https://nebusec.ai/research/inside-meta-muse/)
- [A Single Malicious Webpage Let Researchers Hijack Meta Muse and Access Private Chats — The Hacker News](https://thehackernews.com/2026/11/a-single-malicious-webpage-let.html)
- [NebuSec chains Chromium and kernel bugs to escape Meta Muse sandbox — AI Chat Daily](https://aichatdaily.com/ai-security/nebusec-chains-chromium-kernel-bugs-escape-meta-muse)
- [How a single webpage bypassed Meta Muse's agent security controls — Bytechap](https://bytechap.com/blog/how-a-single-webpage-bypassed-meta-muse-s-agent-security-controls)
