---
title: "資安警報｜OpenAI 官方 Render 部署 skill 內建幻覺網域，近 5 個月洩漏生產環境 token"
date: 2026-10-17
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "AIR Security 發現 OpenAI 官方 render-deploy skill 把一個從未註冊的網域當作 Render 內部服務網域寫進技術文件，Codex 會依指示把它編進真實部署程式碼；研究者註冊該網域後，收到了生產環境送來的 token。"
tldr: "OpenAI 官方 skill repo 的 render-deploy skill 自 2026 年 1 月起就把一個從未註冊的網域（render-internal.com）當成 Render 內部服務網域寫進文件，Codex 會把它編進生成的部署程式碼；AIR Security 搶先註冊該網域架被動 sinkhole，證實真實生產環境正在把 API token 和呼叫送過去。Render 8/14 修、OpenAI 8/26 移除 Render plugin，技術文章 10/16 公開。"
series:
  name: "AI Security Alert"
  order: 56
---

> 🌏 [English version](/posts/daily/2026-10-17-security-openai-render-skill-hallucinated-domain-en)

## 事件概述

OpenAI 維護一個官方 GitHub skills repo，教 AI agent 怎麼跟各種平台和服務互動；因為掛著 OpenAI 的名字、又有廠商參與審核，使用者和 agent 都傾向直接信任。其中一個教 agent 在 Render 上部署應用的 `render-deploy` skill，裡面的技術文件寫了一個 Render「內部服務網域」`render-internal.com`，並附上可以直接貼進程式碼的範例。問題是這個網域從來沒被註冊過，也不存在於 Render 任何官方文件裡。AIR Security 的研究團隊註冊了這個網域架設被動 sinkhole，結果收到了真實生產應用傳來的 API token 和呼叫——證明這不是理論上的漏洞，而是已經在野外被使用的錯誤設定。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（AI skill 幻覺網域 / phantom squatting） |
| 影響範圍 | 使用 OpenAI `openai/plugins` 中 Render plugin（含 `render-deploy` skill）部署應用的使用者，以及其 Codex 生成的程式碼 |
| 嚴重程度 | High |
| CVE | 無（廠商協調修補，無公開 CVE 編號） |
| 來源 | [AIR Security 技術文章](https://www.air.security/blog-posts/render-openai)、[CSO Online](https://www.csoonline.com/article/4236659/hallucinated-domain-in-official-openai-skill-underscores-ai-supply-chain-risks.html) |

## 攻擊面分析

`render-deploy` skill 裡的 `references/service-types.md` 寫了一條「Private DNS: `[service-name].render-internal.com`」,還附了可以直接複製貼上的程式碼：`const API_URL = 'http://internal-api.render-internal.com:10000'`。另一份文件 `configuration-guide.md` 也用同樣的格式印出一條資料庫連線字串。這整段技術細節是 AI 生成時的幻覺——`render-internal.com` 不是 Render 的任何官方網域,Render 的私有網路壓根不走這條路。

AIR Security 先用 Codex 實測:只是照著 skill 的說明，請 Codex 部署兩個需要互相通訊的服務，結果這個網域真的出現在生成出來的應用程式碼和部署設定裡，而且是沒被覆寫就會生效的預設值。接著他們把理論變成實證——註冊這個網域、架一台對所有 subdomain 和 port 都會回應的被動 sinkhole，很快就收到真實服務打過來的連線，帶著它們以為是「打給自己內部服務」的 token 和 API 呼叫。

根本原因是信任鏈的錯位:這段錯誤資訊不是外部注入的惡意內容，是 OpenAI 自己官方維護、又經廠商參與審核的 skill 裡「被當作事實寫下來」的一句技術細節，使用者和 agent 都沒有理由去質疑它。對應 OWASP LLM Top 10 的 **LLM05 Supply Chain Vulnerabilities**——skill 本身就是一條未被充分驗證的依賴鏈,它引用的網域、URL、API 也都該算進攻擊面，而不是只檢查 skill 程式碼本身乾不乾淨。

## 防禦做法

現在可以做的是盤點手上有沒有用過這個 skill 生成的程式碼，長期則是把「skill 引用的外部資源」當成正式依賴來管理，而不是因為來自官方就免驗。

**立即動作**
- 在專案程式碼和部署設定裡搜尋 `render-internal.com`：`grep -r "render-internal.com" .`
- 若有命中：移除硬編碼的網域引用，改用 Render 官方文件記載的私有服務連線方式，並**輪換曾經透過該網域傳送過的所有 API token / 資料庫密碼**（假設已外洩）
- 檢查專案是否還在用含 Render plugin 的舊版 `openai/plugins`，更新到 2026-08-26 之後移除該 plugin 的版本

**長期架構**
- 把 skill 引用的每一個外部資源（domain、URL、repo、API、帳號）當成依賴盤點，定期驗證是否仍存在、仍受信任——官方 / vetted 來源不代表免驗
- 參考 Unit42「[Phantom Squatting](https://unit42.paloaltonetworks.com/phantom-squatting-hallucinated-web-domains/)」研究,在 CI 裡掃描 agent 生成程式碼中出現的網域，檢查是否為未註冊、可被搶注的幻覺網域（slopsquatting 的網域版）
- 考慮導入 watchlist B7 中 Protect AI、Noma Security 這類做 AI 供應鏈掃描的工具，把「skill / 生成程式碼裡的幻覺依賴檢查」納入既有的 SCA 流程

## 影響範圍

`render-deploy` skill 裡的錯誤網域從 2026 年 1 月 27 日的 commit 就存在，Render plugin 則從 2026 年 3 月 13 日起被捆入 `openai/plugins`，直到 Render 於 8 月 14 日修補、OpenAI 於 8 月 26 日移除該 plugin 為止，曝露窗口接近五個月。目前沒有公開的受影響使用者數字，但 AIR Security 透過 sinkhole 確認收到了「真實生產環境」持續送來的 token 和 API 呼叫，代表這段期間確實有人的部署照著官方範例把機密往這個域名送。AIR Security 在修補部署後才於 10 月 16 日公開技術文章，屬於標準的協調揭露流程。

如果你的 agent 工作流把 AI 生成的 skill、教學或文件當作部署設定的「事實來源」，裡面任何幻覺出來的技術細節——網域、API endpoint、套件名稱——都可能被攻擊者搶先註冊利用。這次特別值得注意的是,攻擊面不是來自第三方惡意套件,而是來自官方、被信任的來源本身寫錯了一句話。

## 今日收穫

之前以為 slopsquatting 只發生在套件名稱層級（npm、PyPI 上搶注 AI 幻覺出來的套件名），這次事件顯示同樣的模式可以發生在網域名稱層級，而且不需要外部惡意輸入——hallucination 本身就是攻擊面。官方、vetted 的標籤降低了使用者質疑的意願，反而讓這類錯誤活得更久。

## 參考資料

- [AIR Security — OpenAI Sesame: Skill Vulnerability in OpenAI's Official Skill Made Production Apps Leak Tokens](https://www.air.security/blog-posts/render-openai)
- [CSO Online — Hallucinated domain in official OpenAI skill underscores AI supply chain risks](https://www.csoonline.com/article/4236659/hallucinated-domain-in-official-openai-skill-underscores-ai-supply-chain-risks.html)
- [Unit42 — Phantom Squatting: AI-Hallucinated Domains as a Software Supply Chain Vector](https://unit42.paloaltonetworks.com/phantom-squatting-hallucinated-web-domains/)
