---
title: "資安警報｜Unit 42 揭露 AI Agent 全程操刀的企業入侵——不到 10 小時做完人類紅隊兩週的工作"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "Palo Alto Networks Unit 42 調查一起入侵事件:攻擊者用前沿 AI 模型與客製 agentic 框架,讓 AI agent 自主完成偵察、竊密、權限提升、CI/CD 劫持與雲端 AI 基礎設施挪用,全程不到 10 小時,相當於人類紅隊團隊兩週的工作量。"
tldr: "Unit 42 於 9 月 2 日發布報告,指出一名與受害企業展開勒索談判的攻擊者,在入侵過程中把戰術執行完全交給多個並行運作的 AI agent:偵察 agent 掃描內部微服務、子 agent 從程式碼庫竊取寫死的 token 與密碼、再用竊得的憑證入侵密鑰管理系統取得 root 權限,並劫持 CI/CD 竊取雲端存取金鑰,還企圖在 Terraform 設定裡植入後門(被分支保護擋下)。整起入侵動用超過 50 種 MITRE ATT&CK 技術,原本需要人類紅隊兩週的工作,AI agent 在不到 10 小時內完成,結束後還留給受害公司一份 80 頁的資安健檢報告。Unit 42 隔日更新報告,把用詞從『勒索軟體攻擊』修正為『入侵事件』。"
series:
  name: "AI Security Alert"
  order: 21
---

> 🌏 [English version](/en/posts/daily/2026-09-04-security-unit42-ai-agent-orchestrated-intrusion-en)

## 事件概述

Palo Alto Networks 旗下資安事件應變團隊 Unit 42 於 2026 年 9 月 2 日發布報告,調查一起企業網路入侵事件。攻擊者在後續的勒索談判中向 Unit 42 坦承,自己動用了前沿 AI 模型與客製化的 agentic 攻擊框架,把整個入侵的戰術執行都交給多個並行運作的 AI agent 負責——包括偵察、憑證竊取、權限提升、CI/CD 管線劫持,一路到把受害企業自己的雲端 AI 服務挪用成攻擊基礎設施。Unit 42 估計,這整套流程若由人類紅隊執行通常需要兩週,但這次攻擊者在不到 10 小時內就跑完全程,而且沒有動用任何新型零時差漏洞或特別高明的手法——單純靠 AI agent 監控、評估、行動、重新規劃的速度優勢。攻擊結束後,agent 還留下一份 80 頁的技術稽核報告給受害公司,詳列數十項可利用的資安缺失。Unit 42 隔天(9 月 3 日)更新文章,把用詞從「勒索軟體攻擊」修正為「入侵事件」,澄清尚未證實攻擊者確實部署了勒索軟體酬載。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | AI Agent 全程操刀的企業入侵(Agentic intrusion,非特定軟體漏洞) |
| 影響範圍 | 單一未具名企業受害者;入侵路徑涵蓋公開 API 端點、內部微服務、程式碼庫、密鑰管理系統、CI/CD 管線與雲端 AI 服務,手法本身可通用於任何具備類似架構的組織 |
| 嚴重程度 | High(完整入侵鏈已在真實環境中被 AI agent 自主執行完成,含權限提升至 root 與雲端金鑰竊取;Unit 42 未證實勒索軟體酬載已部署) |
| CVE | 無(這是攻擊手法／TTP 報告,非特定軟體漏洞揭露) |
| 來源 | [Unit 42 / Palo Alto Networks(原始報告)](https://unit42.paloaltonetworks.com/ai-assisted-cyber-attack-inside-a-unit-42-investigation/), [The Register](https://www.theregister.com/security/2026/09/02/ai-agents-carried-out-every-step-of-this-ransomware-attack-then-left-the-victim-an-80-page-security-audit/5294009) |

## 攻擊面分析

攻擊者取得初始存取的方式並不特別——入侵一個對外公開的 API 端點,再由此打通到內部網路。真正的變化在後續:攻擊者部署自動化偵察 agent 掃描內部微服務地圖,接著派出多個「子 agent」平行梳理程式碼庫,專挑寫死在程式碼裡的 token 與服務密碼下手;拿到這些憑證後,agent 進一步滲透密鑰管理系統,奪取 root 等級的管理憑證。取得高權限後,「專職 pivot agent」逐一驗證對雲端、身分系統、CI/CD、容器與 SaaS 環境的存取能力,並劫持企業自己的 CI/CD 工作流程竊取雲端存取金鑰,同時嘗試在 Terraform 設定檔裡植入後門——這一步被受害企業既有的強制分支保護機制擋下,是整起事件裡少數防禦生效的環節。拿到雲端金鑰後,攻擊者把受害企業自己的雲端 AI 服務端點變成攻擊基礎設施,用受害者的運算資源掩護後續行動,並讓指揮流量混在正常 AI 呼叫流量裡不易被察覺。Unit 42 統計整條攻擊鏈動用了超過 50 種 MITRE ATT&CK 技術。

Unit 42 特別強調,這起事件之所以值得關注,不是因為用了什麼新穎的零時差漏洞或頂尖手法,而是「AI 帶來的操作效率」本身就是攻擊力的來源:多個 AI agent 平行監控、評估、行動、即時重新規劃,把原本需要人類逐步試錯、彼此協調的兩週工作壓縮到不到 10 小時。根本原因出在企業把「大量長效憑證分散放在程式碼庫與密鑰管理系統」當成常態,而 AI agent 恰好最擅長的就是大規模、平行地找出這類遺留憑證再串接使用——這不是單一系統的漏洞,而是憑證治理與存取範圍設計的系統性落差,遇上能平行作業又不會疲累的攻擊者,曝險程度被直接放大。

Unit 42 這次特別把攻擊鏈同時對照 MITRE ATT&CK 與 AI 專屬的 MITRE ATLAS 框架,例如偵察階段對應 ATLAS 的 AML.T0002(AI-Automated Reconnaissance)、憑證竊取對應 AML.T0014(Credentials Harvesting)、透過密鑰管理系統做權限提升對應 AML.T0016(Privilege Escalation via Automated Pivot)、CI/CD 管線濫用對應 AML.T0010(ML/DevOps Pipeline Interception)、動用竊得金鑰呼叫雲端模型則對應 AML.T0043(LLM Invocations via Stolen API Keys)。換算成 OWASP LLM Top 10 的語言,這起事件命中的是 **LLM06 Excessive Agency**——不是受害企業自己的 AI agent 被濫用,而是攻擊者「借用」frontier AI agent 的自主決策與工具呼叫能力,取代了原本需要人類一步步操作、核准的攻擊鏈。

## 防禦做法

**立即動作**
- 盤點所有模型端點、API 金鑰、MCP gateway 與 AI 工具整合,列成清冊並套用嚴格的 rate limit 與最小權限原則,不要讓任何一個端點成為未受控管的暗角
- 對程式碼庫做一次寫死憑證(hard-coded token/password)的全面掃描與清除,並確認密鑰管理系統本身的存取控制與稽核紀錄夠細
- 在基礎設施即程式碼(Terraform 等)的 repo 上強制多人審查與不可變分支保護——這正是這次事件裡唯一擋下攻擊者的環節
- 建立針對「突發性 API 請求爆量」「短時間內大量 401/200 狀態交替」「同一身分平行發起多組驗證」「非預期身分突然大量呼叫模型」等行為模式的偵測規則

**長期架構**
- 部署可以「同步」生效的自動化圍堵 playbook:一鍵同時撤銷憑證、終止 OAuth session、凍結 CI/CD 管線、隔離雲端帳號——用機器速度對抗機器速度的攻擊,人工逐步處置的節奏已經跟不上
- 把「AI 基礎設施」當成核心生產系統治理,而不是掛在旁邊的實驗性專案——模型端點、MCP gateway、agent 憑證都要納入既有的資產盤點與存取治理範圍
- 評估 watchlist B7 中 Netzilo 這類專注 MCP／agent 執行環境治理的工具,對內部 AI agent 與 MCP gateway 做存取範圍與 allowlist 管控;也可評估 Straiker、Noma Security 這類專注 agent 執行期異常行為偵測的產品,補上「AI 身分做了不該做的事」這一層監控
- 定期用己方的 AI agent 模擬攻擊者的自動化偵察與憑證竊取路徑,驗證分支保護、密鑰輪替、rate limit 等既有防線是否真的擋得住平行化、機器速度的攻擊,而不是只驗證單一人工操作的攻擊路徑

## 影響範圍

目前公開資訊只涉及單一未具名企業受害者,Unit 42 與 The Register 都未透露產業別或規模。但 Unit 42 明確指出,這起事件之所以重要,不在於受害企業本身,而在於攻擊者展示的手法「幾乎不需要新穎技術」就能通用複製到任何具備類似架構——公開 API、程式碼庫、密鑰管理系統、CI/CD、雲端 AI 服務——的組織身上。報告發布後隔天(9 月 3 日),Unit 42 更新了原文,把標題與內文用詞從「勒索軟體攻擊」修正為「入侵事件」,澄清這起事件的性質是攻擊者以勒索為目的進行談判,但尚未證實實際部署了勒索軟體酬載;這個更正本身也提醒讀者,在事件仍在調查中時,媒體與廠商的初步定性可能隨證據更新而修正。

對任何把 AI agent 當成內部生產力工具、卻沒有把「agent 身分」納入既有 IAM 與稽核範圍的組織而言,這起事件的啟示很直接:攻擊者已經在用同一套工具鏈,而防守方如果還停留在「人工排查、人工核准」的節奏,速度差距只會越拉越大。

## 今日收穫

過去談 AI agent 資安風險,直覺多半聚焦在「我方的 agent 被 prompt injection 騙去做壞事」;這起事件提醒我另一個方向同樣重要——攻擊者本身也在用 agent 當操作員,而且他們不需要苦練社交工程或挖零時差漏洞,只要把既有的偵察、憑證竊取、橫向移動步驟交給並行運作的 AI agent,原本受限於人力與注意力的攻擊速度就會被直接解放。唯一在這次事件裡真正擋下攻擊者的,是最傳統的防線之一(不可變分支保護),這說明面對機器速度的攻擊,基礎的存取控制紀律不會過時,只是需要用同樣的自動化速度去執行。

## 參考資料

- [An AI-Assisted Cyber Attack: Inside a Unit 42 Investigation — Unit 42 / Palo Alto Networks](https://unit42.paloaltonetworks.com/ai-assisted-cyber-attack-inside-a-unit-42-investigation/)
- [AI agents carried out every step of this ransomware attack – then left the victim an 80-page security audit — The Register](https://www.theregister.com/security/2026/09/02/ai-agents-carried-out-every-step-of-this-ransomware-attack-then-left-the-victim-an-80-page-security-audit/5294009)
