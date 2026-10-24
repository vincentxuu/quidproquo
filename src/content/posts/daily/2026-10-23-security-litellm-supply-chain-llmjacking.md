---
title: "資安警報｜LiteLLM 發布管線遭入侵——Claude Code 外洩的 GitHub token 間接導致惡意版本流出並被用於 LLMjacking"
date: 2026-10-23
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "LiteLLM 的 PyPI／Docker Hub／GHCR 發布管線在 10 月 21 日遭入侵，流出含憑證竊取與後門的惡意 v1.107.0；根因疑似是 Claude Code 把使用者 GitHub CLI OAuth token 寫進回應內容、被 log 下來後遭攻擊者取用。"
tldr: "LiteLLM v1.107.0（PyPI／Docker Hub／GHCR）在 2026-10-21 UTC 上午遭惡意版本取代，內含會竊取雲端／AI 金鑰並每小時回連遠端伺服器執行任意程式碼的後門；Wiz 觀測到竊得的 AWS 憑證在 4.5 小時後就被拿去測試 Bedrock，手法符合 LLMjacking。根因疑似是攻擊者透過一台意外曝露在公網的內部機器，取得因 Claude Code 把 GitHub CLI OAuth token 寫入回應內容、又被 LiteLLM 記錄進 log 而外洩的憑證,進而拿下發布權限。防禦：確認是否裝過 v1.107.0、立刻隔離並輪換所有憑證、容器改用 digest 釘選而非 tag。"
series:
  name: "AI Security Alert"
  order: 61
---

> 🌏 [English version](/posts/daily/2026-10-23-security-litellm-supply-chain-llmjacking-en)

## 事件概述

開源 LLM gateway / proxy 專案 LiteLLM 在 2026 年 10 月 21 日美西時間凌晨 4 點左右,發布管線遭入侵,把一個含憑證竊取程式與後門的惡意版本(v1.107.0)推上 PyPI、Docker Hub 與 GHCR。受影響的使用者是在 UTC 11:39–13:23(pip,未鎖定版本)或 UTC 11:46–14:20(Docker,拉取 `v1.107.0`／`latest`／`main-latest`／`main-stable` 任一 tag)這段窗口內安裝的人。LiteLLM 自家調查目前指出,根因可能是攻擊者透過一台意外曝露在公網的內部部署,取得了因 Claude Code 把使用者的 GitHub CLI OAuth token 寫進回應內容、又被該部署記錄進 log 而外洩的憑證,再用這個權限拿下發布流程。這是 LiteLLM 今年第二次遭供應鏈攻擊(今年 3 月已有一次,出自 TeamPCP),這次事後緊急下架動作比上次快,但攻擊手法本身比上次更隱密。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack(發布管線遭入侵，非程式原始碼漏洞) |
| 影響範圍 | 2026-10-21 UTC 上午窗口內透過 pip 安裝未鎖定版本,或拉取 `v1.107.0`／`latest`／`main-latest`／`main-stable` Docker／GHCR image 的環境;私有 registry 的企業客戶不受影響 |
| 嚴重程度 | Critical |
| CVE | 無(官方未申請,視為供應鏈事件而非單一程式漏洞) |
| 來源 | [The Hacker News](https://thehackernews.com/2026/10/litellm-suspects-github-token-leak-in.html), [LiteLLM 官方公告](https://docs.litellm.ai/blog/security-incident-oct-21-2026), [Wiz](https://www.wiz.io/blog/litellm-compromised-steals-credentials), [Aikido](https://www.aikido.dev/blog/litellm-compromised-infostealer-rat), [JFrog](https://research.jfrog.com/post/litellm-hijacked-again/) |

## 攻擊面分析

攻擊者並沒有在 LiteLLM 的程式邏輯裡藏漏洞,而是直接拿下了「誰能發布套件」這個環節。事件起點是 10 月 19 日,LiteLLM 維護團隊暫時放寬了發布權限,讓兩名內部工程師可以每天幫客戶推 bugfix backport。攻擊者手上握有三組開發者的 GitHub CLI 憑證,其中一組還能觸發 GitHub workflow;另外用一個 GitHub 組織擁有者的 token 關掉分支保護、force-push 把惡意改動塞進去,再把發布流程指向一個看起來幾乎一樣的仿冒庫(`Berri-AI/litellm`,刻意跟真正的 `BerriAI/litellm` 只差一個連字號),讓簽章與發布流程把毒化後的產物當成合法版本處理。LiteLLM 目前懷疑這些憑證的來源,是攻擊者先拿下一台「意外曝露在公網、帳號命名看起來無害」的內部部署,而這台機器的 log 裡留有 GitHub CLI OAuth token——原因是 Claude Code 在某些情況下會把使用者的 OAuth token 寫進回應內容,而回應內容一旦被記錄下來,token 就跟著進了 log。

```diagram
title: LiteLLM 發布管線遭入侵的根因鏈路
desc: Claude Code 的回應夾帶 GitHub OAuth token，被曝露在公網的內部部署記錄下來後遭攻擊者取得，最終用來推送毒化版本到套件 registry。
step: Claude Code 的回應夾帶 GitHub CLI OAuth token
step: 攻擊者入侵曝露在公網的內部部署
step: 內部部署的 log 洩出竊得的 OAuth token
step: 攻擊者用竊得的權限推送毒化版本 v1.107.0
---
<svg viewBox="0 0 720 320">
  <line class="dg-rule" x1="108" y1="72" x2="108" y2="300"/>
  <line class="dg-rule" x1="280" y1="72" x2="280" y2="300"/>
  <line class="dg-rule" x1="452" y1="72" x2="452" y2="300"/>
  <line class="dg-rule" x1="624" y1="72" x2="624" y2="300"/>

  <g data-step="1">
    <path class="dg-line" d="M108 132H276" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="194" y="120" text-anchor="middle" dominant-baseline="central">回應夾帶 token</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M452 180H284" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="366" y="168" text-anchor="middle" dominant-baseline="central">入侵曝露的部署</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M280 228H448" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="366" y="216" text-anchor="middle" dominant-baseline="central">竊得 OAuth token</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--accent" d="M452 276H620" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="538" y="264" text-anchor="middle" dominant-baseline="central">推送毒化版本</text>
  </g>

  <rect class="dg-box" x="42" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="108" y="48" text-anchor="middle" dominant-baseline="central">Claude Code</text>
  <rect class="dg-box" x="214" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="280" y="48" text-anchor="middle" dominant-baseline="central">內部部署</text>
  <rect class="dg-box" x="386" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="452" y="48" text-anchor="middle" dominant-baseline="central">攻擊者</text>
  <rect class="dg-box dg-box--accent" x="558" y="24" width="132" height="48" rx="6"/>
  <text class="dg-label" x="624" y="48" text-anchor="middle" dominant-baseline="central">發布管線</text>
</svg>
```

惡意版本本身的手法也比今年 3 月那次更隱密: Python 套件安裝時放進一個 `cook.pth` 路徑檔,讓直譯器在每次啟動時自動 `import` 一支會自我反混淆的 `cook.py`,跑一套叫 `privcollect` 的竊取程式,把系統、瀏覽器、開發工具、雲端與 AI 工具相關的憑證打包,透過 HTTP POST 送到攻擊者控制的網域。同一套安裝還放了一支只在 Linux／macOS 上動作的 `sitecustomize.py`,會建一個背景常駐程式,每小時向一個 GitHub 上的「死信箱」檔案要一次目前的 C2 網域,拿到後就下載並執行第二階段的 Python payload。Wiz 指出同時用 `.pth` 檔加 `sitecustomize.py` 這兩種啟動點的組合,是目前已知第一個在真實攻擊中被記錄到的案例。Wiz 後續觀測到,外洩後大約 4.5 小時,攻擊者就開始用竊得的 AWS instance role 憑證跑 `sts:GetCallerIdentity`,接著呼叫 `bedrock:ListFoundationModels`、`ListModels`——這個組合正是 LLMjacking 的典型探測動作(確認憑證有效、盤點能蹭用的模型),部分環境裡攻擊者還進一步列舉 IAM 角色與使用者做更廣的偵查。

對應 OWASP LLM Top 10:根因屬於 **LLM05 Supply Chain Vulnerabilities**——發布管線的信任鏈(暫時放寬的權限、CI 憑證、簽章流程)一旦任一環節失守,下游所有安裝者都直接中毒,跟程式碼本身寫得多乾淨無關。但更值得注意的是觸發點本身帶出的新風險面:**AI 工具的輸出被記錄下來,可能意外變成憑證外洩的管道**——這不是傳統的「log 裡忘記遮罩密碼」,而是 agent 工具在正常使用流程裡就把身分憑證放進了回應內容,只要下游系統照常記錄回應,token 就跟著外流,屬於 LLM02 Sensitive Information Disclosure 在 agent 工具鏈裡的新變體。

## 防禦做法

**立即動作**
- 檢查環境裡是否裝過 LiteLLM `v1.107.0`:`pip show litellm` 看版本,或 `docker images | grep litellm` 比對 image digest(注意 `latest`／`main-latest`／`main-stable` 這幾個 tag 當時也指向同一個毒化版本)
- 若命中:立即移除該版本,隔離跑過它的主機,搜尋 `cook.pth`、`cook.py`、`sitecustomize.py` 是否存在於 Python 套件目錄,並封鎖往已知外洩網域的連線
- 假設該主機上所有可觸及的憑證(雲端 API key、CI token、GitHub CLI OAuth token、AI 供應商金鑰)已外洩,全部輪換,不要只改本機設定檔
- 排查任何會記錄 AI 工具／agent 回應內容的 log 系統,確認回應本文有沒有不小心夾帶 OAuth token 或其他身分憑證

**長期架構**
- 容器與套件改用 digest 釘選而非 tag(`latest` 這類 tag 在供應鏈攻擊發生時會直接把毒化版本推給所有正在拉取的人),CI 裡強制鎖定版本雜湊
- 對任何「暫時放寬」的發布權限變更保持最高警覺——這次事件的起點正是一次日常的權限暫時擴大,事後要有明確的收回與稽核機制
- watchlist 中 Protect AI 專門做 AI／ML 供應鏈的套件與產物掃描(偵測注入在 build 設定或啟動 hook 裡的惡意程式碼),適合用在 LiteLLM、模型檔案等 AI 工具鏈套件的進版把關上
- 若使用 agentic 編碼工具(如 Claude Code)串接會記錄請求／回應的 proxy 或 gateway,評估是否需要在記錄前對回應內容做憑證遮罩,避免 agent 工具的正常輸出變成意外的憑證洩漏點

## 影響範圍

LiteLLM 官方表示毒化版本在發布後 3 小時內就被下架,私有 registry 的企業客戶不受影響,但透過 PyPI／Docker Hub／GHCR 公開管道、且版本未鎖定的使用者仍可能在窗口期內安裝到這個版本。由於惡意程式是透過 Python 的 `.pth`／`sitecustomize` 機制全域生效,「只要那個 Python 環境裡跑過任何程式,不限於呼叫 LiteLLM 本身」都會觸發,實際受害面可能比單純統計下載次數更廣。Wiz 已證實有雲端憑證被拿去做 LLMjacking 探測,但目前公開報告沒有給出確切的受害帳戶數或實際蹭用模型造成的帳務損失規模;另外,這次攻擊與今年 3 月 TeamPCP 那次的手法雖然都用了 `.pth` 技巧,但安全研究社群(Socket)目前沒有找到兩次事件有直接關聯的證據。

## 今日收穫

這次事件最讓我意外的不是攻擊手法本身(供應鏈攻擊、憑證竊取、LLMjacking 都是熟悉的套路),而是根因鏈路裡多出的一環:AI coding agent 的正常輸出行為(把 OAuth token 寫進回應內容)在被下游系統記錄之後,變成了攻擊者拿到發布權限的起點。過去想憑證外洩,想到的都是「硬編碼進程式碼」「寫進設定檔」這類人為失誤,這次提醒我:只要 agent 工具的輸出流程裡經過身分憑證,任何會記錄輸出內容的環節(log、監控、debug dump)都該被當成潛在的憑證外洩面來檢查,不能只防「人手動打錯字」。

## 參考資料

- [LiteLLM Suspects GitHub Token Leak in AI Gateway Logs Behind Malicious Package Release - The Hacker News](https://thehackernews.com/2026/10/litellm-suspects-github-token-leak-in.html)
- [LiteLLM 官方事件公告](https://docs.litellm.ai/blog/security-incident-oct-21-2026)
- [LiteLLM compromised: credentials stolen via infostealer and RAT - Wiz](https://www.wiz.io/blog/litellm-compromised-steals-credentials)
- [LiteLLM compromised with infostealer and RAT - Aikido](https://www.aikido.dev/blog/litellm-compromised-infostealer-rat)
- [LiteLLM Hijacked Again - JFrog Research](https://research.jfrog.com/post/litellm-hijacked-again/)
- [OWASP LLM Top 10 — LLM05: Supply Chain Vulnerabilities](https://genai.owasp.org/llmrisk/llm05-supply-chain/)
- [OWASP LLM Top 10 — LLM02: Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/)
