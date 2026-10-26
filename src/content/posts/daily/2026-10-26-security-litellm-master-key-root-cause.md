---
title: "資安警報｜LiteLLM 供應鏈攻擊根因更新——真正起點是 5 個月前外流卻沒撤銷的 master key"
date: 2026-10-26
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "LiteLLM 官方公布完整攻擊鏈調查：10 月 21 日的供應鏈攻擊根因不是先前懷疑的 Claude Code log 外洩，而是 2026 年 5 月就外流、卻一直沒撤銷的 Agent Platform master key；攻擊者還用自刪分支的 GitHub workflow 近乎無痕地偷了更多金鑰。"
tldr: "LiteLLM 官方 10 月 24 日公布完整調查，推翻 10/23 的「Claude Code log 外洩」假設：真正根因是 2026 年 5 月 27 日外流到公開 repo、之後一直沒被撤銷的 Agent Platform master key。攻擊者 10/10 用這把鑰匙偷到一組範圍過大（org owner 等級）的 GitHub token，再用「建立 ci-tmp-x 分支推 push-triggered workflow、幾分鐘內刪掉分支」的手法近乎無痕地偷更多金鑰，最後在 10/21 覆寫發布管線推出惡意版本。防禦：外流過的密鑰即使已清掉 commit，也要假設已外洩並強制撤銷；稽核 GitHub Actions 時不能只看現存分支。"
series:
  name: "AI Security Alert"
  order: 63
---

> 🌏 [English version](/posts/daily/2026-10-26-security-litellm-master-key-root-cause-en)

## 事件概述

LiteLLM 官方在 10 月 24 日發布完整的攻擊鏈調查報告，把 10 月 21 日那次供應鏈攻擊（惡意版本 v1.107.0 流入 PyPI／Docker Hub／GHCR）的根因往前推了快 5 個月，也正式推翻了先前的假設。10/23 本系列報導過的「疑似是 Claude Code 把 GitHub CLI OAuth token 寫進回應內容、被內部部署記錄下來外洩」這個理論，官方已確認**不是**真正原因；真正的起點是 2026 年 5 月 27 日一次意外的 commit，外流了 LiteLLM Agent Platform 的 master key，而這把鑰匙在那之後**從未被撤銷**。這次更新還補上了 Socket.dev 挖出的技術細節：攻擊者用「建立短命分支推一個會自動觸發的 workflow、幾分鐘內刪掉分支」的手法，讓整個偷金鑰的過程幾乎不留下痕跡。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（根因為長期未撤銷的外流憑證＋範圍過大的 token） |
| 影響範圍 | 同 10/23 報導的 LiteLLM v1.107.0 使用者；本次更新為根因與攻擊手法細節，不擴大受影響範圍 |
| 嚴重程度 | Critical |
| CVE | 無（LiteLLM 官方視為供應鏈事件，未申請 CVE） |
| 來源 | [The Hacker News](https://thehackernews.com/2026/10/leaked-litellm-master-key-let-attackers.html), [LiteLLM 官方攻擊鏈報告](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain), [Socket.dev](https://socket.dev/blog/litellm-attack-timeline), [Microsoft Security Research](https://www.microsoft.com/en-us/security/blog/2026/10/23/inside-the-litellm-1-107-0-supply-chain-compromise-credential-theft-through-python-startup-hooks/) |

## 攻擊面分析

完整時間線比 10/23 報導的更長、更細：

```diagram
title: LiteLLM 供應鏈攻擊完整時間線（官方 10/24 更新）
desc: 從 5 月外流的 master key 到 10 月 21 日發布管線遭劫持，中間夾著兩次近乎無痕的 GitHub workflow 偷金鑰行動。
step: 2026-05-27：Agent Platform master key 意外 commit 到公開 repo，之後未撤銷
step: 2026-10-10 22:11 UTC：攻擊者用 master key 偷到範圍過大的 GitHub token
step: 2026-10-10／10-12：建自刪分支推 push-triggered workflow，兩輪偷更多金鑰
step: 2026-10-21 10:08-11:08 UTC：覆寫分支保護，發布管線改指向仿冒 repo
step: 2026-10-21 11:39 UTC：惡意版本 v1.107.0 發布到 PyPI／Docker Hub／GHCR
---
<svg viewBox="0 0 760 260">
  <line class="dg-rule" x1="60" y1="56" x2="60" y2="240"/>
  <line class="dg-rule" x1="220" y1="56" x2="220" y2="240"/>
  <line class="dg-rule" x1="380" y1="56" x2="380" y2="240"/>
  <line class="dg-rule" x1="540" y1="56" x2="540" y2="240"/>
  <line class="dg-rule" x1="700" y1="56" x2="700" y2="240"/>

  <g data-step="1">
    <circle class="dg-dot" cx="60" cy="100" r="6"/>
    <text class="dg-label" x="60" y="128" text-anchor="middle">05-27 master key 外流</text>
    <text class="dg-caption" x="60" y="146" text-anchor="middle">之後未撤銷</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M66 100H214" marker-end="url(#arrow)"/>
    <circle class="dg-dot" cx="220" cy="100" r="6"/>
    <text class="dg-label" x="220" y="128" text-anchor="middle">10-10 偷 GitHub token</text>
    <text class="dg-caption" x="220" y="146" text-anchor="middle">org owner 等級</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M226 100H374" marker-end="url(#arrow)"/>
    <circle class="dg-dot" cx="380" cy="100" r="6"/>
    <text class="dg-label" x="380" y="128" text-anchor="middle">自刪分支偷更多金鑰</text>
    <text class="dg-caption" x="380" y="146" text-anchor="middle">兩輪，幾分鐘內清掉痕跡</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M386 100H534" marker-end="url(#arrow)"/>
    <circle class="dg-dot" cx="540" cy="100" r="6"/>
    <text class="dg-label" x="540" y="128" text-anchor="middle">10-21 覆寫發布管線</text>
    <text class="dg-caption" x="540" y="146" text-anchor="middle">指向仿冒 repo</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--accent" d="M546 100H694" marker-end="url(#arrow-accent)"/>
    <circle class="dg-dot dg-dot--accent" cx="700" cy="100" r="6"/>
    <text class="dg-label dg-text--accent" x="700" y="128" text-anchor="middle">v1.107.0 發布</text>
    <text class="dg-caption" x="700" y="146" text-anchor="middle">PyPI／Docker／GHCR</text>
  </g>
</svg>
```

起點是 2026 年 5 月 27 日，一個設定檔被 commit 到公開的 `LiteLLM-Labs/lite-harness` repo，裡面意外帶著 LiteLLM Agent Platform（他們自己用來協調 coding agent 的工具）的 master key。團隊很快發現、把那次 commit force-push 蓋掉，也判定外流的金鑰需要撤銷——但 master key 本身的撤銷動作沒有真正執行。這把沒撤銷的鑰匙躺了將近 5 個月，10 月 10 日晚上 10:11–10:12（UTC）被攻擊者用來登入 Agent Platform，拿到一組原本是讓「自架雲端 agent 能幫忙開 PR」用的 GitHub CLI OAuth token。問題是這組 token「沒有縮小範圍」，掛在組織擁有者的帳號上，等於攻擊者一步就拿到整個組織所有 repo 的 owner 權限——這正是 LLM06 Excessive Agency 在供應鏈場景裡的典型樣子：授權給 agent 工具的憑證範圍遠超過它實際要做的事（開 PR），一旦洩漏就是全盤皆輸。

拿到 owner 權限後，攻擊者沒有馬上動發布管線，而是先用 Socket.dev 事後還原出的手法偷更多金鑰：在 `BerriAI/litellm` 與 `BerriAI/litellm-auto` 兩個內部 repo，從一個正常的既有 commit 開一條叫 `ci-tmp-<hex>` 的短命分支，推一個命名刻意跟正常維護作業一樣（commit message「ci: bump cache config」）的 `.github/workflows/cache.yml`，設定成「只要有 push 就觸發」，workflow 跑完立刻把分支刪掉。兩次操作（10/10 與 10/12）都在幾分鐘內完成，Socket 的研究員指出這種手法「幾乎不在 repo 的一般歷史紀錄裡留下東西」——因為分支已經被刪，只有翻 repo 的 activity log 才能還原。第一輪偷走 Linear、LiteLLM 部署、Together AI 的金鑰與一個 GitHub App 的簽章金鑰；第二輪範圍擴大到 Anthropic、OpenAI、AWS Bedrock、Tavily 的 API key，甚至包括 GitGuardian 這套本該用來偵測密鑰外洩的掃描平台自己的 API key——等於攻擊者連「能看到警報、進而壓下警報」的能力都拿到了。

真正劫持發布管線是 10 月 21 日上午：攻擊者關掉分支保護，把發布來源改指向一個跟真倉庫 `BerriAI/litellm` 只差一個連字號的仿冒庫 `Berri-AI/litellm`。這步之所以能成功，還牽涉到一個巧合的時機漏洞——LiteLLM 原本的發布規則是「一名工程師觸發、另一個綁定實體裝置的特殊帳號核准」，但因應那週要加快 bugfix backport 的頻率，規則被暫時放寬成「任兩名工程師互相觸發與核准即可」，攻擊者正好手握兩組有維護者權限的憑證,直接套進這個放寬後的流程。值得注意的是：攻擊者明明已經握有組織擁有者等級的 token，完全可以直接關掉或改掉這條規則本身，但沒有這麼做，推測是為了避免留下更明顯的痕跡——這也呼應了前一天的放寬正好給了攻擊者一個「看起來像正常操作」的窗口。

## 防禦做法

**立即動作**
- 若你的組織曾經把任何形式的 master key／長效憑證意外 commit 進公開 repo，就算 commit 已經 force-push 蓋掉，也要假設該憑證已外洩並**立刻實際完成撤銷**，不要只標記「待撤銷」就結案——這次事件的根因正是「判定需要撤銷」和「真的撤銷」之間有落差
- 稽核發給 agent／自動化工具的 GitHub token 範圍：確認是否不必要地掛在組織擁有者帳號下，改發細粒度、僅限特定 repo 與操作的 token
- 檢查 GitHub Actions 的 activity log（不是只看現存分支），找有沒有「建立短命分支推 push-triggered workflow 後立刻刪除分支」的模式——這是本次曝光的新手法，現存分支清單看不出來
- 排查任何暫時放寬發布／核准權限的變更：確認變更有到期時間與明確的收回機制，不要讓「暫時」變成長期開著的洞

**長期架構**
- 外流密鑰的處理流程要有強制閉環：偵測到外洩 → 標記撤銷 → 實際執行撤銷 → 驗證撤銷生效，四步缺一不可，必要時用自動化腳本定期核對「已標記待撤銷」清單與「實際仍有效」的金鑰清單是否一致
- watchlist 中 Protect AI 的供應鏈掃描可以用來盯 AI 工具鏈套件（如 LiteLLM）的進版與 build 設定是否被動過手；但這次事件的根因在憑證生命週期管理，不是單純的套件掃描能補上的,需要搭配密鑰管理平台的強制撤銷稽核
- 對 CI/CD 系統開放「on: push 自動觸發」的 workflow 要有額外審查：短命分支 + 立即刪除是可以被規則偵測的模式（例如分支存活時間低於某個門檻就告警），不必等到有人翻 activity log 才發現

## 影響範圍

這次官方更新沒有擴大 10/23 報導的受害範圍（仍是 2026-10-21 UTC 上午窗口內安裝 v1.107.0 的使用者），重點是**修正了根因認定**：原本懷疑的「Claude Code 把 OAuth token 寫進回應內容而外洩」已被官方排除，真正源頭是半年前一次沒處理乾淨的憑證外洩。Microsoft 的惡意版本分析也補充了持久化細節：v1.107.0 透過 Python 的 `.pth` 檔與 `sitecustomize.py` 機制在直譯器啟動時自動執行，就算從未 `import litellm` 也會觸發，而且這些啟動檔案放在 LiteLLM 應用程式目錄之外，只移除應用程式本身的檔案可能清不乾淨。對任何做 agent 平台、需要發憑證讓自動化流程操作 GitHub／雲端資源的團隊,這次事件示範了「憑證範圍過大」與「外流憑證沒真正撤銷」兩個問題疊加後,殺傷力會比單一問題嚴重得多。

## 今日收穫

10/23 報導時用的是「疑似根因」,這次官方更新直接推翻了那個理論——這提醒我,資安事件初期的根因歸因常常是暫時結論,官方調查持續推進時應該回去更新,而不是把第一天的猜測當成定案。更讓我意外的是真正根因竟然追溯到 5 個月前：一次「commit 蓋掉了、研判需要撤銷」的外洩,因為撤銷動作本身沒做完,躺了近半年才被真正利用。這比「憑證外洩」本身更值得記住的教訓是：辨識出風險、跟真正消除風險之間,中間那一步「確認動作真的執行了」常常是最容易被漏掉的環節。

## 參考資料

- [Leaked LiteLLM Master Key Let Attackers Steal GitHub Tokens and Hijack Release Pipeline - The Hacker News](https://thehackernews.com/2026/10/leaked-litellm-master-key-let-attackers.html)
- [The attack chain behind the v1.107.0 LiteLLM release - LiteLLM 官方](https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain)
- [LiteLLM Attack Timeline - Socket.dev](https://socket.dev/blog/litellm-attack-timeline)
- [Inside the LiteLLM 1.107.0 Supply Chain Compromise - Microsoft Security Research](https://www.microsoft.com/en-us/security/blog/2026/10/23/inside-the-litellm-1-107-0-supply-chain-compromise-credential-theft-through-python-startup-hooks/)
- [本系列前篇：LiteLLM 發布管線遭入侵（10/23 初步報導）](/posts/daily/2026-10-23-security-litellm-supply-chain-llmjacking)
- [OWASP LLM Top 10 — LLM05: Supply Chain Vulnerabilities](https://genai.owasp.org/llmrisk/llm05-supply-chain/)
- [OWASP LLM Top 10 — LLM06: Excessive Agency](https://genai.owasp.org/llmrisk/llm06-excessive-agency/)
