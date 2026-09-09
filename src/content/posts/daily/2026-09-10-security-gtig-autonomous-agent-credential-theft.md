---
title: "資安警報｜Google GTIG 揭露:自主多代理人框架 6 小時內完成入侵,外洩 C2 即時管理 2.38 萬組憑證"
date: 2026-09-10
category: daily
type: digest
tags: [ai-agent, security, daily, data-exfiltration]
lang: zh-TW
description: "Google Threat Intelligence Group 最新 Q3 2026 AI 威脅報告揭露,財務動機駭客集團僅靠一個提示詞與一組 markdown 指令集,就在 6 小時內建置自主多代理人框架並竊得數千組第三方憑證;另有一台外洩 C2 伺服器運行的 Recon 框架,被發現即時管理超過 2.38 萬組竊得的雲端與 AI 服務金鑰。"
tldr: "Google GTIG 於 9 月發布的 Q3 2026 AI Threat Tracker 報告指出,Mandiant 於今年第二季調查一起事件:財務動機駭客集團入侵某組織雲端環境後,僅用一個 AI coding chatbot、一則提示詞與預先寫好的 markdown 指令集作為『操作手冊』,就在不到 6 小時內自主完成掃描、入侵、憑證竊取、即時故障排解與 IP 輪替,總計竊得數千組第三方憑證。同一份報告另揭露一台外洩的 C2 伺服器,運行基於 OpenClaw agent 框架建置、名為 Recon 的自動化偵察與憑證管理系統,內含 AGENTS.md、KNOWLEDGE.md 等 agent 設定檔,遭發現後隨即轉為即時管理超過 2.38 萬組竊得雲端與 AI 服務金鑰的正式運作儀表板。The Hacker News、BleepingComputer、Help Net Security、Cyber Magazine 已交叉確認報告內容。防禦:稽核雲端環境異常高速自動化 API 呼叫模式、限縮 coding agent 憑證存取範圍、把回應時間窗從『天』級壓縮到『分鐘』級。"
series:
  name: "AI Security Alert"
  order: 26
---

> 🌏 [English version](/en/posts/daily/2026-09-10-security-gtig-autonomous-agent-credential-theft-en)

## 事件概述

Google Threat Intelligence Group(GTIG)在 9 月初發布的《Q3 2026 AI Threat Tracker》報告中,揭露兩起顯示攻擊者已能把 AI agent 直接嵌入攻擊鏈、以機器速度自主執行完整攻擊流程的案例。第一起是 Mandiant 於今年第二季調查的事件:一個財務動機駭客集團入侵某未具名組織的雲端環境後,只用了一個 AI coding chatbot、一則提示詞,以及一組事先寫好、當成「操作手冊」使用的 markdown agent 指令集,就在不到 6 小時內自主規劃、建置並執行大規模憑證竊取行動,總計壓縮並竊得數千組第三方憑證。第二起是 GTIG 另外發現一台外洩的 C2 伺服器,運行名為 Recon 的自動化偵察與憑證管理框架;伺服器曝光後不久,GTIG 觀察到該目錄轉為一個正式運作的儀表板,即時管理超過 2.38 萬組竊得的雲端與 AI 服務 API 金鑰。兩起案例都沒有鎖定特定廠商軟體漏洞,而是攻擊者直接把商用 coding agent 與開源 agent 框架挪用為攻擊自動化引擎,GTIG 將此描述為「從被動、以端點為主的資訊竊取程式,轉向主動的 agentic 竊取行動」。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 自主多代理人攻擊框架(agentic 憑證竊取 / 偵察自動化) |
| 影響範圍 | 未具名組織雲端環境(6 小時憑證竊取案例)、外洩 C2 伺服器上以 OpenClaw 框架建置的 Recon 系統(2.38 萬組憑證案例);兩者均非特定產品漏洞,而是攻擊者對通用 coding agent 與 agent 框架的濫用 |
| 嚴重程度 | High(已有實際受害組織與數千組憑證外洩,但屬於攻擊手法揭露而非單一可修補的產品漏洞) |
| CVE | 無(TTP/攻擊行動揭露,非特定軟體漏洞) |
| 來源 | [The Hacker News](https://thehackernews.com/2026/09/autonomous-ai-agents-compromise.html), [Help Net Security](https://www.helpnetsecurity.com/2026/09/08/ai-agents-cyberattacks-automation-google-research), [BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-build-ai-frameworks-for-widescale-credential-theft), [Cyber Magazine](https://cybermagazine.com/news/google-ai-now-powers-every-threat-actors-playbook) |

## 攻擊面分析

兩起案例的共同點,是攻擊者不再需要自行開發客製化惡意程式或掃描工具,而是直接借用市面上就能取得的 AI coding agent 能力。第一起事件裡,攻擊者取得雲端環境初始存取權後,用一個提示詞加上一組 markdown 格式的 agent 指令集,把原本設計給開發者用的 coding agent 變成能自主規劃、建置、執行完整攻擊鏈的引擎——過程涵蓋掃描、憑證竊取、即時排除執行錯誤,以及自動化 IP 輪替(把流量導到合法但已遭入侵的雲端環境,增加防守方偵測難度),整條鏈從取得存取到竊得數千組憑證只花不到 6 小時,幾乎沒有人力介入。第二起事件裡,GTIG 找到的外洩 C2 伺服器,其目錄結構(`AGENTS.md`、`KNOWLEDGE.md`、`agentic_vuln_research.md`,以及 `.openclaw/` 與 `memory/` 資料夾)顯示 Recon 是直接架在開源 agent 框架 OpenClaw 之上;伺服器曝光後,這個目錄很快就轉為一個能即時整理、驗證、管理竊得機密的正式儀表板,顯示攻擊者已把 agent 記憶與知識庫機制用於長期營運竊得的憑證資產,而不只是單次攻擊工具。

這類手法之所以能成功,關鍵不在繞過任何特定軟體的安全機制,而在於「建置一套會自主掃描、驗證、決策的攻擊管線」這件事,門檻已經從需要客製化開發,降到只要會寫提示詞與 markdown 指令。coding agent 與 OpenClaw 這類框架原本是為了提升開發者生產力而設計,天生就具備 shell 執行、網路存取、檔案讀寫等廣泛工具使用能力,而這些能力本身不分善惡——只要攻擊者能操控 agent 的指令輸入,就能把同一套能力直接轉為攻擊自動化引擎。另一個結構性因素是回應時間的不對稱:多數組織的資安應變流程仍是以「人力速度」(小時到天)設計,但 agent 驅動的攻擊鏈能以「機器速度」(分鐘到小時)完成掃描到外洩的全流程,防守方能夠反應的時間窗被大幅壓縮。

對照 OWASP LLM Top 10,這兩起案例都命中 **LLM06 Excessive Agency**:無論是被攻擊者濫用的商用 coding agent,還是攻擊者自建的 Recon 框架,核心問題都是 agent 被賦予了遠超單一任務所需的自主工具存取權限(執行指令、掃描網路、讀寫憑證),且缺乏人在迴路中的把關。這也吻合 Google 自己在報告附錄中用 MITRE ATLAS 分類這起事件的方式——標記為 `AML.T0103 Deploy AI Agent`,即攻擊者部署自主 agent 在目標環境中持續運作,而不只是單次呼叫模型產生內容。

## 防禦做法

現在能做的第一件事是意識到威脅模型已經改變:防守方不能再假設攻擊鏈需要數天籌備,而必須為「數小時內從初始入侵到大規模憑證外洩」的情境做應變演練。長期則需要把「agent 是否具備遠超任務所需的自主工具權限」納入所有內部 coding agent、CI/CD 自動化與第三方 agent 框架的上線前審查標準。watchlist B7 中專注 agent 執行期可視性與治理的公司,可以協助補上這塊防線。

**立即動作**
- 稽核雲端環境近期的 API 呼叫紀錄,找出短時間內大量、重複、模式一致的掃描或憑證驗證行為——這類節奏是自動化 agent 攻擊鏈的典型特徵,人工操作很難達到
- 限縮 coding agent 與 CI/CD 流程可存取的憑證範圍,避免單一 agent session 一旦遭濫用就能觸及大範圍雲端權限
- 檢查內部或測試用的 agent 設定與知識庫目錄(如 `AGENTS.md`、`.openclaw/`、`memory/`)是否曾意外暴露在可公開存取的伺服器或儲存桶上

**長期架構**
- 建立能匹配「機器速度」攻擊節奏的行為式異常偵測,取代僅依賴人工事後分析的傳統應變流程
- 對雲端出向流量與 API 呼叫做異常模式監控,特別留意短時間內大量掃描、憑證驗證、IP 輪替的組合行為
- 評估 watchlist B7 中 WitnessAI 的網路層 AI/agent 流量治理(可涵蓋員工與自主 agent 兩類主體的可視性與控管)與 Noma Security 的 Agentic Risk Map,取得 agent 身分、工具存取與資料連結的完整拓樸,及早發現偏離常態的 agent 行為模式

## 影響範圍

第一起事件已證實造成數千組第三方憑證外洩,但受害組織身分與具體產業未公開;第二起事件外洩的 2.38 萬組機密涵蓋雲端與 AI 服務 API 金鑰,規模遠大於單一組織層級,顯示攻擊者已把竊得憑證當成可長期營運、持續累積的資產在管理,而非用完即丟。GTIG 並未在報告中提供修補時間線,因為這兩起案例本質是攻擊手法與基礎設施揭露,而非特定軟體的漏洞公告——換言之,沒有一個版本號可以升級來解決問題,真正需要調整的是組織自身的偵測與應變能力。

對於任何把 coding agent 接上生產雲端憑證,或是自行部署開源 agent 框架(如 OpenClaw)做自動化任務的團隊,這份報告的訊號很直接:攻擊者已經證明同一套工具鏈可以被反過來用在自己身上,而且執行速度足以在多數組織完成第一次告警確認之前就結束戰鬥。

## 今日收穫

過去談 AI agent 資安風險,直覺是聚焦在「agent 被 prompt injection 騙去做壞事」這類間接攻擊路徑;但這次 GTIG 的報告提醒了另一個更直接的面向——攻擊者根本不需要騙誰,只要自己動手寫提示詞跟 markdown 指令,就能把商用 coding agent 直接變成攻擊引擎。防禦重點因此不能只放在「防止 agent 被騙」,同樣需要放在「限制 agent 一旦被誰操控,能造成多大範圍的傷害」。

## 參考資料

- [Autonomous AI Agents Compromise Thousands of Credentials in Under Six Hours — The Hacker News](https://thehackernews.com/2026/09/autonomous-ai-agents-compromise.html)
- [Threat actors are giving AI agents a bigger role in cyberattacks — Help Net Security](https://www.helpnetsecurity.com/2026/09/08/ai-agents-cyberattacks-automation-google-research)
- [Hackers build AI frameworks for widescale credential theft — BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-build-ai-frameworks-for-widescale-credential-theft)
- [Google: AI Now Powers Every Threat Actor's Playbook — Cyber Magazine](https://cybermagazine.com/news/google-ai-now-powers-every-threat-actors-playbook)
