---
title: "資安警報｜Cairn 自主 AI agent 在 MONAI Label 自行發現 0-day，CISA 列入 KEV（CVE-2026-133968）"
date: 2026-11-25
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "Amazon 揭露疑似中國關聯駭客用開源 AI 滲透框架 Cairn，只下達「取得 shell」一句目標，AI agent 就在 MONAI Label 找到路徑穿越 0-day，約 11 分鐘從摸清 API 到能任意寫檔，隨後取得 root；CISA 於 11/23 將 CVE-2026-133968 列入 KEV。"
tldr: "Amazon 威脅情報團隊揭露：攻擊者只給 Cairn 一句「取得 shell」，AI agent 就自己在醫療影像標註伺服器 MONAI Label 找到路徑穿越 0-day，約 11 分鐘從摸清 API 到任意寫檔，再寫入 sitecustomize.py 取得 root shell。CISA 已把 CVE-2026-133968 列入 KEV；0.8.5 以前的版本受影響，升級到 0.8.6 並開啟認證、斷開不受信任網路。"
series:
  name: "AI Security Alert"
  order: 87
---

> :globe: [English version](/posts/daily/2026-11-25-security-monai-label-cairn-zero-day-cisa-kev-en)

## 事件概述

Amazon Threat Intelligence 於 2026-11-20 公布調查：9 月 10 日，他們發現一台公開、無認證的 Cairn 伺服器。Cairn 是開源的自主 AI 滲透測試框架，原本為防守方研究而做，使用者只要用白話文給起點與目標，它就會協調多個 AI agent 去找路徑。這台伺服器的操作紀錄完全外露，Amazon 因此看到完整的行動計畫、攻擊者的提示詞與 AI 輸出。攻擊者用簡體中文下指令，腳本時間戳是中國標準時間，鎖定東亞（中國大陸以外）大學的 IP 位址，活動約 48 小時，從 9 月 8 日開始。攻擊者給的目標只是「取得 shell」的各種變體。其中一個目標跑著開源醫療影像 AI 標註伺服器 MONAI Label，agent 摸清它的框架與 API，發現一個帶檔名參數的上傳端點有路徑穿越，約 11 分鐘就從 API 摸底走到能在伺服器上任意寫檔；後續的 session 再把 Python 反向 shell 寫進 `sitecustomize.py`，呼叫訓練 API 啟動新的 Python 程序，拿到 root 權限的反向 shell。Amazon 以高信心判斷這是 zero-day，並以中等信心判斷是中國關聯的攻擊者。CISA 於 2026-11-23 把這個漏洞（[CVE-2026-133968](https://www.cve.org/CVERecord?id=CVE-2026-133968)）與 N-able Mail Assure 的另一個漏洞一起列入已知遭利用漏洞（KEV）目錄。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 路徑穿越（CWE-22）導致任意檔案寫入與遠端程式碼執行，由自主 AI agent 在實際入侵中發現並利用 |
| 影響範圍 | Project MONAI 的 MONAI Label 0.8.5 以前（含）所有版本；預設關閉認證，能連到伺服器的客戶端無需憑證即可利用，開啟認證後 `ANNOTATOR` 角色仍足以觸發 |
| 嚴重程度 | Critical（GitHub 公告評為 critical；The Hacker News 引述 CVSS 9.8） |
| CVE | [CVE-2026-133968](https://www.cve.org/CVERecord?id=CVE-2026-133968)（GHSA-qc22-rmgc-vg94） |
| 修補狀態 | 0.8.6（2026-11-22 發布）已修補此漏洞 |
| 來源 | [Amazon Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/)、[CISA KEV 公告](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog)、[GitHub 安全公告](https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94)、[BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server)、[The Hacker News](https://thehackernews.com/2026/11/hackers-exploit-n-able-mailassure-flaw.html) |

## 攻擊面分析

漏洞本身很普通。依 GitHub 公告，`PUT /datastore/image` 把呼叫者控制的 `image` 查詢參數直接當成影像 ID，`LocalDatastore.add_image()` 加上副檔名後接到 datastore 目錄，再用 `shutil.copy()` 寫檔，完全沒檢查結果路徑是否還在 datastore 裡面；`PUT /datastore/label` 的 `save_label()` 用同樣方式組路徑。所以上傳者只要在參數裡放往上跳的目錄片段，就能把內容寫到 MONAI Label 程序有權限寫的任何位置。公告指出，任意寫檔可以進一步變成遠端程式碼執行，例如覆寫應用程式碼，或在 `.ssh/authorized_keys`、cron 加入項目。根本原因有兩層：一是檔案路徑沒被限制在儲存目錄內；二是預設設定 `MONAI_LABEL_AUTH_ENABLE=False`，沒有任何認證擋在前面。

真正新的是發現漏洞的方式。依 Amazon 的描述，agent 先辨識應用框架、列舉 API 端點，找到帶檔名參數的上傳端點，再測試該參數是否可穿越路徑，整個過程沒有操作者逐步指示。接著它利用同一個漏洞寫入 `sitecustomize.py`（Python 在直譯器啟動時會自動匯入的檔案），再觸發訓練 API 讓系統啟動新的 Python 程序，新程序匯入了 payload，建立以 root 身分執行的反向 shell。操作者有介入一次：在發現 zero-day 之後，他給 agent 一個通往第二所大學網路的代理，那台伺服器跑著同樣有漏洞的軟體，Amazon 推斷攻擊者已用這個 0-day 攻陷它並建立通道，然後要求 agent 透過通道攻擊該網路內的其他機器。失敗的紀錄同樣值得看：agent 對一台免認證的 Redis 連續嘗試約 16 小時、148 個動作，試過複寫濫用、腳本沙箱逃逸、改設定檔、記憶體破壞與 Log4Shell，全部失敗，也對一台 GPU 伺服器用約 80 個從公開網頁整理的真實使用者名稱試了三萬多組憑證組合，同樣沒成功。Amazon 的結論是這些 agent 不眠不休地調整做法近一整天，而且不需要人類指示。

對應 OWASP LLM Top 10：這起事件的受害系統是一般的 Web 應用，漏洞也不是 LLM 專屬，所以對應不到單一條目；但攻擊方使用的 agent 自主行動，最接近 **LLM06 Excessive Agency** 的攻擊者版本，也就是對 AI agent 給了過大的自主權卻沒有任何人類檢查點。對防守方來說，這代表「漏洞被公開到被利用」的時間可能短到分鐘級，傳統靠人工分流警報的流程會跟不上。

```diagram
title: 從攻擊活動到 CISA 列入 KEV 的時間線
desc: 攻擊者的 Cairn agent 在 9 月初攻擊大學伺服器並發現 MONAI Label 的 0-day；10 月中旬修補程式合併進主分支，11 月中旬公告與公開報告，11 月 22 日發布 0.8.6，11 月 23 日 CISA 列入 KEV。
caption: 依 Amazon、GitHub 安全公告與 CISA 公告整理，日期皆為 2026 年。
step: 9/8–9/10：Cairn agent 對東亞大學的活動持續約 48 小時，MONAI Label 0-day 被發現並利用
step: 10/19：修補程式（PR #1915）合併進 MONAI Label 主分支
step: 11/18：GitHub 安全公告 GHSA-qc22-rmgc-vg94 公開，評為 critical
step: 11/20：Amazon 公布調查報告，各媒體跟進
step: 11/22：MONAI Label 0.8.6 發布，修補 CVE-2026-133968
step: 11/23：CISA 把 CVE-2026-133968 列入 KEV
---
<svg viewBox="0 0 640 596">
  <path class="dg-line" d="M320 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M320 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="170" y="32" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="51" text-anchor="middle" dominant-baseline="central">9/8–9/10　攻擊活動</text>
    <text class="dg-sub" x="320" y="71" text-anchor="middle" dominant-baseline="central">agent 約 48 小時自主行動，找到 0-day</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="190" y="132" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="151" text-anchor="middle" dominant-baseline="central">10/19　修補合併</text>
    <text class="dg-sub" x="320" y="171" text-anchor="middle" dominant-baseline="central">PR #1915 進主分支，尚無發行版</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="180" y="232" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="251" text-anchor="middle" dominant-baseline="central">11/18　安全公告公開</text>
    <text class="dg-sub" x="320" y="271" text-anchor="middle" dominant-baseline="central">GHSA-qc22-rmgc-vg94，評為 critical</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="190" y="332" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="351" text-anchor="middle" dominant-baseline="central">11/20　Amazon 公開報告</text>
    <text class="dg-sub" x="320" y="371" text-anchor="middle" dominant-baseline="central">各媒體同日跟進</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="170" y="432" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="451" text-anchor="middle" dominant-baseline="central">11/22　發布 0.8.6</text>
    <text class="dg-sub" x="320" y="471" text-anchor="middle" dominant-baseline="central">修補 CVE-2026-133968</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="170" y="532" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="551" text-anchor="middle" dominant-baseline="central">11/23　CISA 列入 KEV</text>
    <text class="dg-sub" x="320" y="571" text-anchor="middle" dominant-baseline="central">聯邦機構修補期限 11/26</text>
  </g>
</svg>
```

## 防禦做法

**立即動作**
- 盤點是否有人在跑 MONAI Label，範圍包含研究團隊自己架的 GPU 主機與雲端帳號，這類服務常常不在中央 IT 的資產清單裡；找到 0.8.5 以前的版本就升級：`pip install -U monailabel==0.8.6`（或對應的 Docker 映像）
- 升級前先假設風險已存在：如果 0.8.5 或更舊的伺服器曾經能被不受信任網路連到，官方 0.8.6 說明建議在恢復服務前檢查有沒有異常的檔案變更；升級本身不會清掉已經在機器上的攻擊者
- 無論版本，照官方公告的三項做法處理：設 `MONAI_LABEL_AUTH_ENABLE=True` 並只把 `ANNOTATOR` 角色給可信任的使用者、不要把伺服器暴露在不受信任的網路、用權限最小的使用者執行且寫入範圍限制在 datastore
- 在記錄中搜尋對 `/datastore/image` 或 `/datastore/label` 的 `PUT` 請求，看 `image` 參數有沒有 `../`、編碼過的穿越片段或絕對路徑；並檢查 `sitecustomize.py`、`usercustomize.py`、site-packages 底下的 `.pth` 這些直譯器啟動會載入的檔案有沒有被改動。Amazon 另外公布了兩個活動期間（9/8 至 9/10）的來源 IP：`142[.]4.98.145` 與 `142[.]4.107.34`，可用來回溯歷史記錄

**長期架構**
- 把研究用的 AI 服務（標註伺服器、notebook、模型服務、向量資料庫）納入和正式系統相同的盤點與弱點掃描流程，預設要求認證，不要因為「只是研究用」就放著
- 服務用非 root 帳號執行、應用程式與 Python 路徑盡量唯讀，並對直譯器啟動檔做完整性監控；這樣即使有任意寫檔漏洞，也寫不進會被自動載入的位置
- 縮短偵測到回應的時間：Amazon 的建議是優先建立高信心、可自動回應的偵測，人類負責監督結果，而不是逐筆審查每個動作；可參考 watchlist B7 中專注 agentic AI 安全的廠商（例如 Noma Security）盤點 agent 相關資產
- 追蹤依賴的開源專案在 commit 層級的安全修補，不只等發行版：這個漏洞的修補合併在 10/19，但到 11/22 才有安裝得到的版本，中間有一個多月的空窗

## 影響範圍

已確認的受害者是大學研究伺服器，公開報導沒有提到臨床系統或病患資料受影響；Amazon 的受害組織都不是 AWS 客戶，AWS 沒有直接通知管道，改由政府夥伴代為通知。實際有多少 MONAI Label 實例暴露在網路上，沒有公開統計。CISA 把它列入 KEV，代表有實際遭利用的證據；依 The Hacker News 的說法，聯邦文職行政部門機構被要求在 2026-11-26 前套用修補。

修補時間線值得留意：修補在 10/19 合併、公告 11/18 才出現、0.8.6 要到 11/22 才發布；也就是說，在這段期間裡修補程式碼與公告是公開的，但套件管理員抓得到的版本裡沒有它。如果你的 Agent 或研究基礎設施裡有未認證的內部服務，這起事件提醒的是：攻擊方的 agent 不必知道漏洞，只要有一個沒有認證的端點，它就會自己試。

## 今日收穫

之前以為「AI 自主發現 0-day」會出現在大型廠商、複雜的軟體上；這起事件顯示最先被打中的是一個預設關閉認證、路徑沒做限制的小型研究工具，而且 agent 只花約 11 分鐘。真正改變的不是漏洞多難找，而是找漏洞的成本變成算力：就算單一目標成功率不高，名單夠長也划算。防守端要補的不是更複雜的偵測，而是把這些「預設就開著」的研究型服務，先拉回基本的認證與最小權限。

## 參考資料

- [Chinese-nexus actor's Cairn AI agents found a zero-day on their own — Amazon Security Blog](https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/)
- [CISA Adds Two Known Exploited Vulnerabilities to Catalog — CISA](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog)
- [Path traversal in datastore upload endpoints allows arbitrary file write（GHSA-qc22-rmgc-vg94）— Project MONAI / MONAILabel](https://github.com/Project-MONAI/MONAILabel/security/advisories/GHSA-qc22-rmgc-vg94)
- [MONAI Label 0.8.6 Release Notes — GitHub](https://github.com/Project-MONAI/MONAILabel/releases/tag/0.8.6)
- [CVE Record: CVE-2026-133968 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-133968)
- [Hackers use autonomous AI tool Cairn to find zero-day, take over server — BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-use-autonomous-ai-tool-cairn-to-find-zero-day-take-over-server)
- [Hackers Exploit N-able MailAssure Flaw While AI Agents Exploit MONAI Label Zero-Day — The Hacker News](https://thehackernews.com/2026/11/hackers-exploit-n-able-mailassure-flaw.html)
- [MONAI Label Zero-Day: AI Agents Exploit Medical Imaging Research Servers — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-monai-label-agent-discovered-zero-day-2026)
