---
title: "資安警報｜Microsoft Agent Framework 官方套件遭植入 .pth 啟動鉤子，竊取 Azure 與 GitHub Actions 憑證"
date: 2026-11-19
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "Microsoft 官方 AI Agent 框架套件 agent-framework 在 PyPI 上出現兩個惡意版本，用 .pth 啟動鉤子在每次 Python 啟動時竊取 Azure、GitHub Actions 等雲端憑證並外傳。"
tldr: "攻擊者在 2026-11-17 把 agent-framework 1.26.1、1.26.2 兩個惡意版本發布到 PyPI，用 .pth 啟動鉤子讓憑證竊取程式在任何 Python 啟動時執行，不需要真的 import 這個套件。竊到的 Azure、Azure DevOps、GitHub Actions 憑證與代幣會傳回攻擊者的 webhook.site 端點。防禦：先別跑 pip show/uninstall（本身就會觸發竊取），直接檢查 site-packages 底下有沒有可疑 .pth 檔，再從乾淨環境輪替所有憑證。"
series:
  name: "AI Security Alert"
  order: 82
---

> :globe: [English version](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer-en)

## 事件概述

Microsoft 官方開源的 AI Agent 建構與編排框架 `agent-framework`，在 2026-11-17 晚間的 33 分鐘內於 PyPI 上被攻擊者接連發布了兩個惡意版本：1.26.1 與 1.26.2。兩個版本都用 Python 的 `.pth` 啟動鉤子機制，讓憑證竊取程式在**任何 Python 行程啟動時**自動執行——即使使用者的程式碼從未真的 `import agent_framework`，只要這個套件裝在環境裡，執行 `pip` 本身就足以觸發竊取。竊取目標是 Azure CLI、Azure DevOps、GitHub Actions 等雲端與 CI/CD 憑證。PyPI 已將兩個版本下架隔離，但攻擊者如何取得發布權限仍不明朗。Aikido、Chainguard、Endor Labs、OX Security、SafeDep、Socket、StepSecurity、JFrog 與 Google 旗下 Wiz 等至少 9 家獨立資安研究團隊各自發文分析同一起事件。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（官方 AI Agent 框架套件遭植入 .pth 啟動鉤子憑證竊取程式） |
| 影響範圍 | 2026-11-17 約 UTC 20:35–21:20 之間安裝或自動更新到 `agent-framework` 1.26.1／1.26.2 的環境（含開發機與 CI/CD runner），該套件月下載量約 19 萬次 |
| 嚴重程度 | Critical（竊取憑證並可主動向雲端平台換發新代幣，單純輪替舊金鑰不足以止血） |
| CVE | 無（尚未見到對應 CVE 編號） |
| 來源 | [The Hacker News](https://thehackernews.com/2026/11/attackers-compromise-microsofts-agent.html)、[GBHackers](https://gbhackers.com/microsofts-ai-agent-framework-package-compromised-on-pypi/)、[SecurityWeek](https://www.securityweek.com/microsoft-agent-framework-releases-poisoned-with-credential-stealer/)、[Socket.dev 分析](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer)、[JFrog Security Research](https://research.jfrog.com/post/agent-framework-hijack/) |

## 攻擊面分析

攻擊者沒有去碰 Microsoft 的原始碼或建置管線——JFrog 的分析指出，攻擊者是在本機把乾淨的 wheel 重新打包，再直接發布到 PyPI，而不是從上游 CI/CD 動手。這代表問題出在「發布權限」這一關：目前仍不清楚攻擊者是偷到了套件維護者的 PyPI token，還是透過其他方式騙到了發布權，但結果是兩個帶惡意邏輯的版本能用官方帳號的身分正常上架，讓使用者的套件管理器完全不會懷疑來源。

真正的技術手法在於濫用 Python 的 `.pth` 檔機制。1.26.1 版在 `site-packages` 根目錄放了一個 `agent_framework_meta.pth`，裡面是一行 import 陳述式；Python 在**每次** interpreter 啟動時都會執行 `.pth` 檔裡的 import 行，於是只要環境裡裝了這個套件，隨便跑一個 `python` 指令（甚至 `pip` 本身）都會觸發 `agent_framework_meta` 模組，進而呼叫 `_telemetry._start()` 在背景非同步蒐集憑證（Unix 上 fork 並 detach，其他平台用 daemon thread，並用 `_AF_TEL` 環境變數防止同一行程樹重複觸發）。1.26.2 版更進一步：把惡意邏輯換到 `af_runtime_diag.pth`／`af_runtime_diag.py`，並把套件原本的初始化檔還原到逐位元組一致，讓只檢查該檔案的人以為套件是乾淨的；同時把蒐集範圍擴大到 GitHub Actions 的 OIDC 代幣。

被蒐集的內容包括：以關鍵字比對的環境變數、`~/.azure/*.json`、`.npmrc`、`pip.conf`、`.netrc`、`.git-credentials`、`.docker/config.json`、Hugging Face token、Azure DevOps agent 憑證、`.env` 與 JSON 設定檔，再加上 Azure DevOps OIDC 代幣、Azure 受控識別代幣，以及 Azure Instance Metadata Service（IMDS）回應內容。SafeDep 特別指出，這段程式碼不只是讀取硬碟上既有的憑證，還會主動向平台**要求核發新代幣**——在 Azure DevOps pipeline 裡用 `SYSTEM_ACCESSTOKEN`／`SYSTEM_OIDCREQUESTURI` 換取聯合身分代幣，在 Azure 運算資源上則呼叫受控識別端點（App Service／Functions 用 `IDENTITY_ENDPOINT`，其他環境用 `169.254.169.254`）。所有資料會序列化成 JSON，經 zlib 壓縮、Base64 編碼後，以 HTTPS POST 送到寫死的 `webhook.site/d381fd80-ec62-42ad-8f5c-d1b15103c9bb` 端點。

```diagram
title: agent-framework 惡意版本如何讓憑證竊取程式在任何 Python 啟動時執行
desc: 攻擊者取得發布權限後把惡意 wheel 上架 PyPI，使用者 pip install 後 .pth 檔被 Python 解譯器自動執行，背景悄悄蒐集憑證並向雲端平台換發新代幣，最後把資料外傳到攻擊者的 webhook.site 端點。
caption: 依 The Hacker News、GBHackers、Socket.dev、JFrog 的技術分析整理。
step: 攻擊者以不明方式取得 PyPI 發布權限
step: 上架 agent-framework 1.26.1／1.26.2 惡意 wheel
step: 使用者或 CI/CD 執行 pip install，.pth 檔寫入 site-packages
step: 任何後續 Python 啟動（無需 import agent_framework）都會觸發 .pth 裡的 import
step: 背景非同步蒐集憑證檔、環境變數，並向雲端平台主動換發新代幣
step: 資料壓縮編碼後以 HTTPS POST 外傳到 webhook.site 端點
---
<svg viewBox="0 0 760 596">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M400 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M400 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="300" y="32" width="200" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">攻擊者取得 PyPI 發布權限</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">取得方式未知</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="280" y="132" width="240" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">上架 1.26.1／1.26.2 惡意版本</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">距上一正常版 33 分鐘內兩版</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="280" y="232" width="240" height="56" rx="6"/>
    <text class="dg-label" x="400" y="251" text-anchor="middle" dominant-baseline="central">pip install 寫入 .pth 檔</text>
    <text class="dg-sub" x="400" y="271" text-anchor="middle" dominant-baseline="central">site-packages 根目錄</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="260" y="332" width="280" height="56" rx="6"/>
    <text class="dg-label" x="400" y="351" text-anchor="middle" dominant-baseline="central">任何 Python 啟動即觸發</text>
    <text class="dg-sub" x="400" y="371" text-anchor="middle" dominant-baseline="central">不需 import agent_framework</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="240" y="432" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="451" text-anchor="middle" dominant-baseline="central">背景蒐集憑證＋主動換發新代幣</text>
    <text class="dg-sub" x="400" y="471" text-anchor="middle" dominant-baseline="central">Azure／Azure DevOps／GitHub Actions</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="280" y="532" width="240" height="56" rx="6"/>
    <text class="dg-label" x="400" y="551" text-anchor="middle" dominant-baseline="central">外傳到 webhook.site 端點</text>
    <text class="dg-sub" x="400" y="571" text-anchor="middle" dominant-baseline="central">zlib 壓縮＋Base64 編碼</text>
  </g>
</svg>
```

這起事件對應 OWASP LLM Top 10 的 **LLM05 Supply Chain Vulnerabilities**：根本原因不是模型或 prompt 的弱點，而是 AI 開發者生態圈仰賴的套件發布管道本身缺乏強制的來源驗證（如 provenance 簽章、Sigstore attestation）。但這起事件特別值得注意的地方是攻擊面落在比「agent 執行時」更底層的一層——不是 agent 被誘導做壞事（Excessive Agency），而是**建構 agent 用的 SDK 本身，在使用者的 agent 還沒跑起來之前就已經被動過手腳**。只要這個套件在環境裡，連開發機上無關的 `python --version` 都可能觸發竊取。

## 防禦做法

**立即動作**
- **先別急著跑 `pip show agent-framework` 或 `pip uninstall`**：兩者都會啟動 Python，若惡意版本已裝在環境裡，這個動作本身就會再次觸發竊取程式。改用檔案系統層級檢查，直接找 `site-packages` 底下是否存在 `agent_framework_meta.pth` 或 `af_runtime_diag.pth`
- 一旦確認中毒，隔離受影響的開發機與 CI/CD runner，釐清是否在 2026-11-17 約 UTC 20:35–21:20 的曝險時間窗內安裝或更新過套件
- 檢查 proxy／DNS 日誌是否有連到 `webhook.site/d381fd80-ec62-42ad-8f5c-d1b15103c9bb` 的流量，作為中毒的額外佐證
- 從**乾淨**的系統（不是中毒機器本身）全面輪替 Azure CLI、Azure DevOps、GitHub Actions、npm／pip／Git／Docker、Hugging Face 等所有可能暴露過的憑證；把套件釘選回最後一個安全版本 1.26.0 並從乾淨環境重建
- 稽核 Azure 身分的登入與活動紀錄、審查部署到 Azure 的 GitHub Actions workflow，因為攻擊者不只偷走舊憑證，還會主動向平台換發新代幣——單純輪替既有金鑰無法涵蓋這部分

**長期架構**
- `.pth` 啟動鉤子這類「裝了就觸發、不需 import」的手法已出現在多起 Python 套件供應鏈攻擊（如先前的 LiteLLM 事件），單靠監控 import 行為無法偵測；需要把 site-packages 完整性檢查、啟動鉤子掃描納入 CI/CD 與開發環境的基礎稽核項目
- 安裝 AI agent 框架這類高頻發新版的套件時，採用 hash-pinned lockfile 並驗證發布來源的 provenance／簽章，不要只信任套件名稱與維護者身分
- 把發給 CI/CD 的雲端憑證換成最小權限、短期有效的識別，讓單一憑證外洩的可利用時間窗口縮到最短
- 導入 Protect AI 之類涵蓋 Python 套件與 ML 供應鏈的掃描工具，把稽核範圍從「模型本身安不安全」延伸到「拿來建構 agent 的 SDK 套件是否被動過手腳」

## 影響範圍

`agent-framework` 月下載量約 19 萬次（JFrog 另估週下載量約 4 萬次），但實際暴露規模取決於多少環境恰好落在 11-17 這個約 45 分鐘的曝險窗口內安裝或自動更新到惡意版本——PyPI 已快速下架隔離兩個版本，降低了後續新增安裝的風險，但已經裝過的環境不會因套件被下架而自動清除竊取程式或讓已外洩的憑證失效。由於攻擊者除了讀取既有憑證外，還能主動向 Azure 與 GitHub Actions 換發新代幣，實際影響範圍可能超出「誰裝過惡意版本」這麼簡單的統計，需要搭配雲端身分活動日誌才能完整評估。這也是 Microsoft 相關套件今年第二次在 PyPI 上遭供應鏈攻擊——5 月時 `durabletask` 套件曾被 TeamPCP 用來發布 Mini Shai-Hulud worm，顯示攻擊者持續把目標對準 Microsoft 在 PyPI 上的 AI／Agent 相關套件生態。

## 今日收穫

這幾天報導的資安事件大多聚焦在 agent 執行時被騙去做壞事——prompt injection、過度授權的工具呼叫。這起事件提醒我，風險還有一層更底層：**建構 agent 的 SDK 本身，在 agent 真正跑起來之前就可能已經被動過手腳**。`.pth` 啟動鉤子讓竊取程式在任何 Python 啟動時執行，不需要你的程式碼真的用到這個套件——這已經不是「agent 的信任邊界」問題，而是「你用來蓋 agent 的這塊地基，裝進環境的那一刻就已經不乾淨」的問題。對仰賴 pip 快速迭代的 AI 開發生態來說，這類攻擊比針對單一應用的 prompt injection 更難靠「審查自己寫的程式碼」防住。

## 參考資料

- [Attackers Compromise Microsoft's Agent Framework PyPI Package to Steal Cloud Credentials — The Hacker News](https://thehackernews.com/2026/11/attackers-compromise-microsofts-agent.html)
- [Microsoft's AI Agent Framework Package Compromised on PyPI to Steal Cloud Credentials — GBHackers](https://gbhackers.com/microsofts-ai-agent-framework-package-compromised-on-pypi/)
- [Microsoft Agent Framework Releases Poisoned With Credential Stealer — SecurityWeek](https://www.securityweek.com/microsoft-agent-framework-releases-poisoned-with-credential-stealer/)
- [Agent Framework PyPI package compromised with credential stealer — Socket.dev](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer)
- [Microsoft's agent-framework Hijacked on PyPI via Silent .pth Startup Hook — JFrog Security Research](https://research.jfrog.com/post/agent-framework-hijack/)
- [Microsoft agent-framework on PyPI: Credential Stealer — Mend](https://www.mend.io/blog/microsoft-agent-framework-pypi-credential-stealer/)
