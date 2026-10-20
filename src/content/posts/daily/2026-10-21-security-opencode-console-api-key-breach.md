---
title: "資安警報｜開源 coding agent OpenCode 的 Console 遭入侵，使用者外部 AI 金鑰疑似外流"
date: 2026-10-21
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: zh-TW
description: "開源 AI coding agent OpenCode 的託管服務 Console 於 10 月 16 日夜間遭入侵，官方稱與一場大規模的「distillation attack」有關，1.4% 連結了外部 AI 供應商金鑰的 Console 使用者受影響，已有使用者回報帳單被盜刷。"
tldr: "OpenCode 10/18 公告 Console 服務遭入侵，受影響的 1.4% 使用者是曾把 OpenAI／Anthropic／Google 金鑰貼進 Console 代打 API 的人；官方稱攻擊與想靠大量查詢蒸餾出模型行為的「distillation attack」有關，但沒公布根因。已有使用者在 X／Reddit 回報數百美元的未授權用量。防禦：盤點誰裝了 OpenCode、檢查 `auth.json` 裡連結了哪些供應商、立刻到供應商後台輪換金鑰並設用量上限。"
series:
  name: "AI Security Alert"
  order: 59
---

> 🌏 [English version](/posts/daily/2026-10-21-security-opencode-console-api-key-breach-en)

## 事件概述

開源 AI coding agent OpenCode 的共同創辦人 Dax Raad 於 10 月 17 日在 X 公布，10 月 16 日夜間有入侵者進入 Console（OpenCode 的選用託管服務）裡一個「legacy system」，可能讀到使用者存在裡面的第三方 AI 供應商金鑰。Console 的用途是讓團隊把自己的 OpenAI、Anthropic 或 Google 金鑰貼進去,由 Console 代打 API,團隊成員就不用直接碰到金鑰本身。受影響範圍是「1.4% 的 Console 使用者」,且全部都曾連結外部供應商。OpenCode 已在 10/17 上午以「Action Required: Potential provider key breach」為主旨寄信通知所有受影響帳號,並表示沒收到信就代表沒受影響。官方把這起事件定性為與一場「large-scale distillation attack」相關,但到發稿為止尚未公布根因、legacy system 是什麼、入侵管道、金鑰庫規模,或 1.4% 實際對應多少人。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 平台端金鑰外洩（Credential Exposure）＋疑似模型蒸餾濫用 |
| 影響範圍 | 曾在 OpenCode Console 連結 OpenAI／Anthropic／Google 金鑰的使用者（約 1.4% Console 帳號） |
| 嚴重程度 | High |
| CVE | 無 |
| 來源 | [The Hacker News](https://thehackernews.com/2026/10/opencode-console-breach-may-have.html), [StepSecurity](https://www.stepsecurity.io/blog/opencode-security-breach) |

## 攻擊面分析

攻擊者入侵的是 Console 這個代理層,不是使用者自己機器上的 OpenCode CLI。Console 的設計是「使用者把金鑰貼進去,之後由 Console 幫忙打 API」,等於 Console 自己變成一個集中存放大量第三方 AI 金鑰的保險箱。OpenCode 共同創辦人在 X 上強調「這些金鑰從來沒進到我們這裡」,指的是 CLI／桌面版把金鑰存在使用者本機的 SQLite 資料庫(`~/.local/share/opencode/auth.json`),跟 Console 裡的金鑰是兩套不同的儲存路徑;這次出事的只有後者。換句話說,平台為了「方便團隊共用一支金鑰打 API」而把金鑰集中保管,一旦保管該金鑰的那個子系統(官方只說是 legacy system)被攻破,等於一次性暴露所有存在裡面的供應商憑證——這是典型的「集中化信任」風險,跟資料庫密碼外洩沒有本質差異,只是這裡外洩的是能直接向 OpenAI/Anthropic/Google 計費的 bearer token。

官方把攻擊動機歸為「distillation attack」:這是 AI 供應商常用的詞,指攻擊者想用海量查詢去「蒸餾」出目標模型的行為模式,拿去訓練自己的模型。Anthropic 九月時也公開過,這類蒸餾行動常靠假帳號、被盜的信用卡與金鑰組成的網路去打模型 API。被偷走的 OpenCode Console 金鑰,剛好同時滿足兩種用途:一是讓攻擊者免費(算在受害者帳上)對前沿模型做大量查詢來蒸餾,二是直接被拿去變現轉賣——地下市場本來就在收購可重複使用的 AI token/金鑰。

對應 OWASP LLM Top 10:**LLM10 Model Theft**(大量查詢蒸餾模型行為,且是用別人的付費額度去做)是攻擊的終端目的;根因則落在**LLM02 Sensitive Information Disclosure** 的鏡像問題——不是模型洩漏資訊給使用者,而是平台集中保管的「能存取模型的憑證」本身保護不足。

## 防禦做法

**立即動作**
- 盤點環境裡誰裝了 OpenCode:`which opencode`、檢查 `~/.local/share/opencode/auth.json`(macOS/Linux)或 `%USERPROFILE%\.local\share\opencode\auth.json`(Windows)是否存在且列出了供應商
- 對照是否收到 OpenCode 10/17 寄出、主旨「Action Required: Potential provider key breach」的信——沒收到不代表一定安全,仍建議交叉核對
- 任何列在 `auth.json` 或曾貼進 Console 的 OpenAI／Anthropic／Google 金鑰,一律視為已洩漏:到供應商後台**直接撤銷並重發**,不要只是從 OpenCode 刪除(刪除 Console 裡的金鑰不會讓供應商那端失效)
- 回查至少 10/16 以後的用量帳單,找出不是自己打出去的請求;已有使用者在 X／Reddit 回報單一供應商被盜刷兩百到一千七百美元不等

**長期架構**
- 讓每個工具、每支腳本都用自己獨立的金鑰,而不是一把金鑰到處貼——金鑰外洩時影響範圍才可控,且容易追蹤是哪個管道外流
- 在供應商端設定用量上限／告警(spend limit),而不是只靠下游平台的 budget 功能——這次事件正好說明「Console 的用量上限」管不到金鑰被直接拿去別處打 API 的情況
- 對「代打 API」類的 SaaS(把你的金鑰集中保管再代為呼叫)重新評估風險:這種便利性背後等於多了一個攻擊面,評估是否值得用更窄範圍、可隨時撤銷的憑證取代長效金鑰
- watchlist 中 Noma Security、WitnessAI 這類 AI 應用安全/治理平台專門處理「哪些系統持有 LLM 憑證、用量是否異常」這類盤點與監控需求,可用於補上企業內部「誰在用什麼 AI coding agent、連了哪些金鑰」的可見度缺口

## 影響範圍

OpenCode 官方只公開「1.4% 的 Console 使用者」這個比例,沒有公布 Console 總使用者數,因此無法換算成絕對人數。從社群回報看,受害者的實際損失以單一供應商帳單兩百至一千七百美元不等,且官方措辭始終是金鑰「可能」(may have)被外洩,並未證實已有金鑰被複製或使用——但使用者端的實際盜刷帳單顯示,至少有一部分金鑰確實已遭濫用。OpenCode 表示事件仍在進行中,且共同創辦人在 10/18 提到「過去 48 小時持續遭受攻擊」,目前仍與 Anthropic、OpenAI、Google 三家協同處理,根因與入侵管道尚未公布。

對任何把 AI coding agent 接上正式 API 金鑰的團隊,這次事件的教訓很直接:選擇「代打 API」類託管服務前,要先確認金鑰儲存與存取控制的具體做法,而不是假設「開源」或「知名工具」就等於金鑰保管沒問題。

## 今日收穫

一直以為 distillation attack 是純研究圈的理論威脅,這次才看到它跟一次很家常的「金鑰外洩」直接掛鉤——攻擊者不需要自己花錢打 API 做蒸餾,只要偷到別人連結在 coding agent 平台上的金鑰,就能用受害者的帳單去跑蒸餾查詢,同一把鑰匙還能順手轉賣變現。這提醒我:凡是「貼金鑰進去讓平台代打 API」的設計,風險評估要把這個平台本身當成一個新的、集中化的攻擊目標來看,不能只看自己機器上的金鑰存放方式。

## 參考資料

- [OpenCode Console Breach May Have Exposed OpenAI, Anthropic, and Google API Keys - The Hacker News](https://thehackernews.com/2026/10/opencode-console-breach-may-have.html)
- [OpenCode Security Breach: Distillation Attack Hit Console Users With Linked AI Providers - StepSecurity](https://www.stepsecurity.io/blog/opencode-security-breach)
- [Anthropic says AI distillation campaigns rely on stolen credentials - The Hacker News](https://thehackernews.com/2026/09/anthropic-says-seven-china-based-ai.html)
- [OpenCode breach drains users' AI keys as platforms holding customer credentials become a target - Dealroom](https://dealroom.co/news/163473-opencode-breach-drains-users-ai-keys-as-platforms-holding-customer-crede/)
