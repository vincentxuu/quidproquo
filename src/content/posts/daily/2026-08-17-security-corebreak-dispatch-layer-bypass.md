---
title: "資安警報｜CoreBreak——AWS Bedrock、Google ADK、Vercel AI SDK 派發層漏洞讓工具呼叫繞過模型直接執行"
date: 2026-08-17
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "資安研究團隊 Stealth 在 Black Hat USA 2026 揭露 CoreBreak：AWS Bedrock AgentCore、Google ADK、Vercel AI SDK 的工具派發層都能在模型完全沒有執行的情況下觸發工具呼叫，讓所有 system prompt、內容過濾、拒絕訓練等模型層防禦形同虛設"
tldr: "Stealth 的研究者 Hedi Ingber 與 Aviyam Ivgi 發現三大 Agent 基礎設施（AWS Bedrock AgentCore、Google ADK、Vercel AI SDK）的派發層都只檢查「長得像工具呼叫」的資料格式，卻不驗證它是否真的來自模型的這一輪推論，共取得 4 個 CVE（CVE-2026-18830、CVE-2026-18236、CVE-2026-64650/64651）。這不是 prompt injection——模型根本沒被騙，因為模型從頭到尾沒有被呼叫。AWS 已自動修補，Google ADK 需升級到 2.5.0，Vercel harness 需升級到 1.0.29/1.0.28。防禦重點是把授權檢查從「格式對不對」改成「有沒有對應到真實模型事件」。"
series:
  name: "AI Security Alert"
  order: 3
---

## 事件概述

資安新創 Stealth 的共同創辦人 Hedi Ingber 與 Aviyam Ivgi 於 2026 年 8 月 6 日在 Black Hat USA 2026 發表研究 **CoreBreak**，揭露一個橫跨三大 AI Agent 基礎設施供應商的結構性漏洞模式：Amazon Bedrock AgentCore、Google Agent Development Kit（ADK）、Vercel AI SDK 的 harness 套件，都存在同一種設計缺陷——負責「派發」工具呼叫的執行層（dispatch layer），只檢查一份資料「長得像不像」模型產生的 tool call，卻沒有驗證它是否真的來自模型這一輪推論。攻擊者只要能把格式正確的工具呼叫資料塞進這個派發流程，就能讓工具直接執行，而模型本身完全沒被呼叫過。這意味著 system prompt、內容過濾器、拒絕訓練這些疊在模型上的防禦，因為根本沒有機會介入這次「決策」，而全部失效。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Dispatch Layer Authorization Bypass（非 Prompt Injection） |
| 影響範圍 | Amazon Bedrock AgentCore InvokeHarness API；Google ADK for Python（自架部署）；Vercel `@ai-sdk/harness-codex`、`@ai-sdk/harness-opencode` |
| 嚴重程度 | Critical（Google ADK CVSS v4.0 9.3）／High（AWS CVSS v4.0 8.6）／Medium（Vercel 兩項各 CVSS v4.0 6.3） |
| CVE | CVE-2026-18830、CVE-2026-18236、CVE-2026-64650、CVE-2026-64651 |
| 來源 | [Cloud Security Alliance 研究報告](https://labs.cloudsecurityalliance.org/research/csa-research-note-agent-infra-guardrail-bypass-20260806-csa/)、[The Hacker News](https://thehackernews.com/2026/08/aws-google-and-vercel-patch-agent-flaws.html)、[Forkast](https://forkast.news/corebreak-bypasses-ai-agent-guardrails-at-the-plumbing-layer-and-model-level-defenses-cannot-help/)、[AWS Security Bulletin 2026-073-AWS](https://aws.amazon.com/security/security-bulletins/2026-073-aws/) |

## 攻擊面分析

一個現代 AI Agent 不只是一個語言模型，而是一個執行迴圈（runtime／harness）：接收使用者訊息、餵給模型、讀取模型回應，當模型要求使用工具時，把這個「工具呼叫」（tool call）物件——包含工具名稱與參數——派發給實際的工具執行器。CoreBreak 揭露的問題是，這三個平台的派發層都只驗證這個物件「格式對不對」，卻沒有驗證它「確實對應到這一輪已記錄的模型完成事件」。三個實作的具體攻擊路徑各不相同：

- **AWS Bedrock AgentCore（CVE-2026-18830，CVSS v4.0 8.6）**：已通過驗證的遠端呼叫者可以直接把一個工具使用內容區塊注入 `InvokeHarness API` 請求的最後一則訊息，事件迴圈會直接派發這個工具，完全不檢查模型是否授權過。
- **Google ADK for Python（CVE-2026-18236，CVSS v4.0 9.3，CWE-863 Improper Authorization）**：ADK 對敏感工具設有「人工確認」機制——執行前會暫停並要求核准，核准記錄成 session history 裡的一個事件。但負責讀取這個核准事件的元件，沒有驗證這個工具是否真的屬於當前執行中的 Agent、是否真的需要確認、名稱與參數是否與原始呼叫相符。攻擊者只要能注入或竄改 session history 裡的事件，就能偽造一個從未被要求過的核准，讓原本用來「擋下危險動作」的機制反過來變成「發動危險動作」的路徑。
- **Vercel `@ai-sdk/harness-codex` / `harness-opencode`（CVE-2026-64650／64651，CVSS v4.0 各 6.3）**：這兩個套件在 Linux sandbox 內執行 coding agent，並透過一個 relay 頻道讓 sandbox 內的程式碼可以請求 host 上的工具。這個 relay 是靠「呼叫程序的命令列路徑」來判斷是否信任，只要命令列包含核准過的 helper script 路徑就會放行。已經在 sandbox 內執行的惡意程式碼，可以直接滿足這個檢查，繞過模型直接呼叫 host 端的工具（含密鑰查詢、部署操作、雲端 API 呼叫）。

三者共通的根因是**信任「形狀」而非驗證「來源」**：只要資料長得像模型輸出，派發層就當作已授權執行。這與傳統 prompt injection 有本質差異——prompt injection 是攻擊者寫文字去操縱模型判斷，模型仍是決策點，訓練出來的防禦至少有介入的機會；CoreBreak 則是完全繞過模型，讓「模型從頭到尾沒有跑過」，因此不管模型層防禦做得多好都沒有意義。對照 OWASP LLM Top 10，這更接近 **LLM06 Excessive Agency** 加上傳統存取控制範疇的 **Broken Authorization**，而非 LLM01 Prompt Injection——這也是這次研究者與多家媒體特別強調的區分點。

值得注意的是，CSA 指出這與同年稍早（6 月 30 日）由 Adversa AI 研究者揭露的 [GuardFall](https://labs.cloudsecurityalliance.org/research/csa-research-note-guardfall-ai-agent-shell-injection-2026070/)（11 個受測 coding agent 中 10 個有 shell injection 防護繞過）屬於同一類「檢查與執行之間存在結構性落差」的問題，只是落在派發鏈的不同層——GuardFall 是「shell 防護檢查完之後，shell 自己又做了一次展開」；CoreBreak 是「派發層根本沒檢查工具呼叫是否真的來自模型」。兩起研究合起來，暗示這可能是 Agent 基礎設施中一個會反覆出現的漏洞類型，而非單一廠商的一次性錯誤。

## 防禦做法

**立即動作**
- 確認 Google ADK for Python 版本：升級到 **2.5.0 或以上**（2026 年 7 月 16 日發布），這項修補需要自架部署者手動套用
- 確認 Vercel harness 套件版本：`@ai-sdk/harness-codex` 升級到 **1.0.29**、`@ai-sdk/harness-opencode` 升級到 **1.0.28**（2026 年 7 月 10 日發布）
- AWS Bedrock AgentCore 的修補已在 2026 年 7 月 31 日前自動部署到受管服務，理論上不需客戶動作，但建議透過 AWS 帳戶活動或支援管道再次確認修補已套用到你所在的 region 與設定
- 盤點自己是否有類似「SDK-to-model-to-tool」架構的自建或第三方 Agent runtime，逐一檢查其派發點是否只檢查工具呼叫的格式而非來源

**長期架構**
- 把授權檢查從「這筆資料長得像不像工具呼叫」改成「這筆工具呼叫是否對應到本輪 session 中一個真實記錄的模型完成事件，名稱與參數是否相符」——這是幾十行程式碼就能補上的檢查，且是唯一不依賴廠商修補進度的防線
- 對於「人工確認」這類敏感工具的核准機制，確認核准處理邏輯有驗證工具歸屬、是否真的需要確認、以及名稱／參數是否與原始記錄的呼叫一致，而不是只檢查「session history 裡有一筆核准事件」就放行
- 針對 sandbox 型架構（類似 Vercel 的 relay 設計），把「檢查呼叫程序的命令列路徑」換成加密可驗證的訊號，例如針對該次工具呼叫核發的簽章、單次使用授權 token
- 監控面要跟著調整：偵測這類攻擊無法只靠模型輸入輸出的紀錄（prompt 記錄、內容過濾分數），因為模型根本沒被呼叫，這些紀錄不存在；需要直接對派發與授權層做可視性建置，確認每一次工具執行都能追溯回一個真實記錄的模型事件
- 採購或建置 Agent 平台時，直接向供應商詢問「工具呼叫的授權是端到端怎麼驗證的」，優先選擇每次工具執行都要求與模型完成事件綁定的簽章授權架構；watchlist B7 中的 **Invariant Labs**、**Netzilo** 等聚焦 Agent runtime 治理與 MCP/工具呼叫可視性的廠商，可用於補上這類派發層監控缺口

## 影響範圍

三個平台受影響的部署型態不同：AWS Bedrock AgentCore 是全代管服務，AWS 已自動修補，客戶原則上無需動作；Google ADK for Python 與 Vercel 的 harness 套件則是自架套件，需要維運者主動升級，這代表在 CVE 揭露到現在這段時間內，沒有跟進更新的自架部署仍處於曝險狀態。三個漏洞的利用門檻不同：AWS 那項需要已通過驗證的呼叫者（因此 CVSS 相對低一些，8.6）；Google ADK 那項只需要能注入或竄改 session history 中的事件（不一定需要既有的系統存取權，取決於資料流入 session 的方式），因此評分最高（9.3）；Vercel 那兩項則要求攻擊者已經有程式碼在 sandbox 內執行，門檻最高，CVSS 也最低（6.3）。目前公開資料未指出這三個漏洞在揭露前已遭在野利用，研究者是透過協調揭露（coordinated disclosure）方式提交給三家廠商並取得修補後才公開。如果你的 Agent 系統是自建在這類 SDK-to-model-to-tool 架構上（不限這三家），這次揭露值得拿來對照自己的派發層邏輯：假設有人手動組出一個格式正確的工具呼叫塞進你的執行流程，系統會不會發現？

## 今日收穫

先前資安警報系列報導的都是「模型被騙去做壞事」或「服務忘記加身份驗證」，但 CoreBreak 揭露的是第三種、更根本的問題：整個 Agent 安全對話這幾年幾乎都聚焦在模型本身（對齊、拒絕訓練、內容過濾、system prompt 寫得好不好），但如果攻擊者根本不需要「說服模型」、只要能讓派發層誤以為某筆資料是模型產生的，那所有疊在模型上的防禦層根本沒有機會介入。這提醒我評估 Agent 平台安全性時，光問「這個系統的 prompt injection 防護做得好不好」是不夠的，還要往下一層問：「如果有人偽造一筆格式正確的工具呼叫,你的系統會不會發現它不是模型真正產生的？」

## 參考資料

- [When the Model Never Runs: Agent Infrastructure Flaws Let Attackers Trigger Tools Without the Model — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-agent-infra-guardrail-bypass-20260806-csa/)
- [AWS, Google, and Vercel Agent Flaws Let Attackers Trigger Tools Without Running the Model — The Hacker News](https://thehackernews.com/2026/08/aws-google-and-vercel-patch-agent-flaws.html)
- [CoreBreak Bypasses AI Agent Guardrails at the Plumbing Layer—and Model-Level Defenses Cannot Help — Forkast](https://forkast.news/corebreak-bypasses-ai-agent-guardrails-at-the-plumbing-layer-and-model-level-defenses-cannot-help/)
- [AWS Security Bulletin 2026-073-AWS](https://aws.amazon.com/security/security-bulletins/2026-073-aws/)
- [Vercel AI SDK Security Advisory GHSA-qw9h-448j-6rph](https://github.com/vercel/ai/security/advisories/GHSA-qw9h-448j-6rph)
- [CoreBreak: AI Agent Tools Fire Without the Model — Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/10383/corebreak-ai-agent-flaws-aws-google-vercel)
