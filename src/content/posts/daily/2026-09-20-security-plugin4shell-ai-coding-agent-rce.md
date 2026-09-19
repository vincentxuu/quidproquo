---
title: "資安警報｜Plugin4Shell——Claude Code、Codex、Copilot、Gemini CLI 全數中鏢的零點擊外掛供應鏈 RCE"
date: 2026-09-20
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "資安新創 AIR Security 揭露 Plugin4Shell：四大主流 AI coding agent（Claude Code、Codex、GitHub Copilot、Gemini CLI）的外掛 SHA pinning 機制可被繞過，攻擊者能在使用者完全無感的情況下把已安裝外掛換成惡意版本並取得 RCE，GitHub Copilot 至今未修補"
tldr: "AIR Security 研究團隊發現，四大 AI coding agent 檢查外掛版本時只驗證『有沒有照著 pin 住的 commit 做 checkout』，卻從未驗證『checkout 完之後真的落在那個 commit 上』——攻擊者用一個和 SHA 撞名的 Git branch 就能讓 pin 形同虛設,趁 agent 背景自動更新外掛時無聲無息換成惡意版本,達成零點擊 RCE。Claude Code（2.1.179）與 Codex（0.146.0）已修補,GitHub Copilot 尚未釋出修補,Gemini CLI 因即將停用不會修。同一份研究先前用『SkillJacking』手法找到 925 個已被劫持、影響 13.4 萬個 agent 的外掛,證明供應鏈劫持本身已在真實世界發生。"
series:
  name: "AI Security Alert"
  order: 33
---

> 🌏 [English version](/en/posts/daily/2026-09-20-security-plugin4shell-ai-coding-agent-rce-en)

## 事件概述

資安新創 AIR Security 於近日公開一份研究,揭露一個橫跨四大主流 AI coding agent——Claude Code、OpenAI Codex、GitHub Copilot、Gemini CLI——的外掛供應鏈漏洞,命名為 Plugin4Shell。這是業界第一個鎖定「AI agent 外掛分發層」而非模型或 agent 本身的供應鏈漏洞:所有這些 agent 在安裝外掛時都會把外掛版本鎖定(pin)在一個經過審核的 Git commit,理論上之後不管上游倉庫怎麼變,使用者裝到的永遠是那個被審過的版本。AIR 發現,四家agent 的實作都只驗證「有沒有嘗試 checkout 那個 pin 住的 commit」,卻沒有驗證「checkout 完之後工作目錄是不是真的落在那個 commit 上」——這個遺漏讓攻擊者能用一個 Git 的邊角特性讓 pin 形同虛設,而且因為 Claude Code 與 Codex 預設會在背景自動更新已安裝外掛,整起攻擊完全不需要使用者做任何動作。AIR 在揭露前已用同一套技術基礎做過兩次前導研究:一次是自己上架一個惡意 skill 並讓它在使用者間擴散,拿下超過 2.6 萬個 agent 的控制權;另一次稱為「SkillJacking」,直接找出 925 個已經被劫持、卻仍在正常使用中的外掛,影響 13.4 萬個 agent——證明供應鏈劫持不是理論,是已經在野外發生的事。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（外掛 SHA pinning 繞過,零點擊 RCE） |
| 影響範圍 | Claude Code、OpenAI Codex、GitHub Copilot、Gemini CLI 的外掛/marketplace 安裝機制 |
| 嚴重程度 | Critical（零點擊、全面 RCE,四大主流 agent 全數受影響） |
| CVE | 無正式編號(AIR Security 以「Plugin4Shell」命名並直接協調各廠商修補) |
| 來源 | [AIR Security 原始研究](https://www.air.security/blog-posts/plugin4shell)、[CSO Online](https://www.csoonline.com/article/4223909/a-zero-click-rce-flaw-in-ai-coding-agents-could-have-exposed-enterprise-systems-2.html)、[Help Net Security](https://www.helpnetsecurity.com/2026/09/18/plugin4shell-ai-coding-agents-vulnerability/) |

## 攻擊面分析

攻擊分兩條路徑,但都不需要攻擊者掌控 marketplace 本身。第一條是「先種善意外掛,再變臉」:攻擊者上架一個完全無害、通過審核的外掛,等使用者安裝後,再對上游倉庫動手腳讓後續 checkout 拿到惡意程式碼。第二條是「劫持既有外掛的倉庫」:攻擊者接管一個別人寫的、marketplace 已經信任的外掛背後的 Git 倉庫,直接讓所有已安裝該外掛的 agent 在下次自動更新時被換成惡意版本——AIR 先前的 SkillJacking 研究已經證實這種接管在真實世界確實發生過。

技術核心是一個 Git 的邊角案例。Claude Code、Codex、GitHub Copilot 三家的做法是先 `git clone` 外掛倉庫,再 `git checkout <40 碼 hex 的 pin 住 commit>`;Gemini CLI 則是 `git fetch` 該 commit 後執行 `git checkout FETCH_HEAD`。攻擊者一旦控制上游倉庫,就能建立一個「名字剛好是那串 40 碼 hex pin 值」(或名字就叫 `FETCH_HEAD`)的分支,並把它設成倉庫的預設分支;Git 在 ref 名稱與 commit id 撞名時會優先採用 ref,只印出一行容易被忽略的 `refname is ambiguous` 警告就照樣 checkout 那個惡意分支。整個過程 agent 端會回報「已成功安裝到指定的 pin 值」,實際工作目錄卻是攻擊者控制的內容。因為 Claude Code 與 Codex 預設會在背景自動重跑同一段 checkout 邏輯來更新已安裝外掛,只要上游把 pin 值往前推一版(而那一版本身無害),攻擊者就能事後再把「新 pin 值撞名的分支」換成惡意內容,讓所有已安裝該外掛的使用者在毫無互動的情況下被换成惡意版本。

根本原因是「只驗證動作有沒有執行,沒有驗證結果是否正確」的邏輯缺陷——SHA pinning 原本的安全承諾是「checkout 完的內容必然等於審核過的那個 commit」,但四家 agent 都只做了 checkout 這個動作,沒有在 checkout 之後額外做一次 `git rev-parse HEAD` 去確認真的落在 pin 住的 commit 上。AIR 特別指出,這個驗證只能在 agent 端修,因為 pin 值的解析本身就發生在 client 端,marketplace 端再怎麼審核都無法保證。對照 OWASP LLM Top 10,這屬於 **LLM05 Supply Chain Vulnerabilities**(外掛分發鏈本身的完整性驗證失效)疊加傳統軟體供應鏈安全中的 TOCTOU(Time-of-check to time-of-use)類問題——審核的是一個版本,實際執行的是另一個版本,中間的落差正是漏洞所在。

## 防禦做法

**立即動作**
- 確認 Claude Code 版本 ≥ 2.1.179、Codex 版本 ≥ 0.146.0,兩者已修補此問題
- GitHub Copilot 目前無官方修補,若團隊重度依賴其外掛生態系,評估暫時停用外掛自動更新,並人工審核每次外掛版本變化
- 若仍在使用 Gemini CLI,Google 已確認不會修補(該產品已進入淘汰),應規劃遷移到 Antigravity(該產品沒有 marketplace 外掛 SHA pinning 機制,不受此攻擊影響)
- 盤點目前所有已安裝的第三方 agent 外掛,特別檢查是否有外掛的上游倉庫託管在允許「分支名稱可以是 40 碼 hex」的平台(如 Bitbucket 或自架 Git server)——GitHub 本身會拒絕這種分支命名,相對安全一些

**長期架構**
- 把 agent 外掛/skill 生態系當成正式的軟體供應鏈治理,而不是「裝了就忘」的擴充功能;建立內部白名單並定期複查已安裝外掛的倉庫所有權是否變動
- 評估 watchlist 中 Protect AI 的 AI 供應鏈安全掃描能力,對 agent 外掛/skill 的來源倉庫做持續監控,及早發現 RepoJacking 或維護者帳號被接管的訊號
- 對有存取原始碼、憑證、雲端資源或 CI/CD 權限的 agent,外掛的信任層級應該和該 agent 本身的權限範圍一致對待——外掛出問題等於 agent 本身被接管,不該用「只是個小工具」的心態放行

## 影響範圍

Plugin4Shell 本身目前沒有已知的野外攻擊個案——AIR Security 是在負責任揭露流程下完成研究,並先協調四家廠商修補後才公開細節,時間軸顯示 2026 年 5 月發現、6 月完成揭露、Claude Code 6 月中修補、Codex 8 月修補,而完整的公開研究報告是在 9 月中旬才發表。但「攻擊鏈的兩端都已被證實可行」這件事本身就值得重視:AIR 先前的「The Story of Skills」實驗已經證明,惡意外掛可以真的在市場上擴散並拿下上萬個 agent;「SkillJacking」研究更直接找到 925 個已被劫持、影響 13.4 萬個 agent 的真實案例。Plugin4Shell 補上的是最後一塊——就算外掛完全依照安全模型的建議去審核與 pin 版本,這個防線本身也可能形同虛設。

目前唯一沒有官方修補時程的是 GitHub Copilot,代表任何仍在使用 Copilot 外掛生態系的團隊,在漏洞公開後仍處於暴露狀態,直到 Microsoft 釋出修補。如果你的團隊用這些 agent 存取原始碼、憑證、雲端環境或 CI/CD 工具,而外掛安裝時又是透過 marketplace 信任鏈完成的,這起事件代表「已經照著官方建議的審核流程走」本身,並不足以保證你裝到的版本就是被審過的那一個。

## 今日收穫

這次最讓我意識到的是,SHA pinning 這種「鎖定特定 commit」的機制,常被當成軟體供應鏈安全的終極防線——但 Plugin4Shell 提醒我們,pin 值的可信度取決於「誰在驗證 checkout 完的結果」,而不是「pin 值本身有沒有寫對」。四家不同公司、不同程式碼庫的 agent 犯了同一種疏漏(只做動作、不驗證結果),這種跨廠商重複出現的設計缺陷,通常代表的是整個產業對某個威脅模型的集體盲點,而不是單一團隊的實作失誤。

## 參考資料

- [AIR Security：Plugin4Shell — Zero Click RCE Vulnerability found in top 4 most popular coding agents](https://www.air.security/blog-posts/plugin4shell)
- [CSO Online: A zero-click RCE flaw in AI coding agents could have exposed enterprise systems](https://www.csoonline.com/article/4223909/a-zero-click-rce-flaw-in-ai-coding-agents-could-have-exposed-enterprise-systems-2.html)
- [Help Net Security: Zero-click RCE vulnerability hit four major AI coding agents, two remain unpatched](https://www.helpnetsecurity.com/2026/09/18/plugin4shell-ai-coding-agents-vulnerability/)
- [InfoWorld: A zero-click RCE flaw in AI coding agents could have exposed enterprise systems](https://www.infoworld.com/article/4223907/a-zero-click-rce-flaw-in-ai-coding-agents-could-have-exposed-enterprise-systems.html)
- [Forkast: Plugin4Shell Bypasses SHA Pinning Across All Four Major AI Coding Agents](https://forkast.news/plugin4shell-bypasses-sha-pinning-across-all-four-major-ai-coding-agents/)
