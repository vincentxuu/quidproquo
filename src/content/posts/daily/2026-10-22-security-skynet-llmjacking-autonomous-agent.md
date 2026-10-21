---
title: "資安警報｜Symantec 捕獲「Skynet」自主攻擊 agent——劫持裸露 LLM／MCP 端點打全網滲透與挖礦"
date: 2026-10-22
category: daily
tags: [ai-agent, security, daily, jailbreak, data-exfiltration]
lang: zh-TW
description: "Symantec 用 AI honeypot 在 2026 年夏天捕獲一份完整的攻擊指令，顯示攻擊者打造了一個會自主找裸露 LLM／MCP 端點並劫持其運算力的攻擊 agent，可在無人介入下跑 10 萬步，掃描、入侵並挖礦。"
tldr: "Symantec Threat Hunter Team 用模擬未受保護 AI 服務的 honeypot 捕獲一份完整攻擊指令：攻擊者打造的「Skynet」模式 agent 會搜尋裸露的 LLM／AI gateway／MCP 端點，用分層 jailbreak 解除商用模型安全護欄，再指揮 74 個工具掃描、入侵常見 web 框架、偷資料庫與金鑰、裝加密貨幣礦工，可無人值守跑 10 萬步。防禦：任何對外曝露的模型端點或 MCP server 一律要求驗證、金鑰視同高價值憑證輪換、限制 agent 主機對外連線。"
series:
  name: "AI Security Alert"
  order: 60
---

> 🌏 [English version](/posts/daily/2026-10-22-security-skynet-llmjacking-autonomous-agent-en)

## 事件概述

Symantec Threat Hunter Team 於 10 月 21 日發布報告，說明他們在 2026 年夏天透過一個「AI honeypot」（偽裝成未受保護、對外開放的 AI 服務，用來吸引並記錄針對 AI 基礎設施的攻擊）捕獲了一份完整的攻擊指令集。這份指令顯示攻擊者打造了一個會自主在網路上搜尋裸露 LLM 端點並劫持其運算力的攻擊 agent：找到目標後，先用分層 jailbreak 解除商用模型的安全護欄，再把模型當成「推理引擎」，指揮內建的 74 個攻擊工具去掃描漏洞、入侵常見 web 框架、偷資料庫與金鑰、暗中安裝加密貨幣礦工——而且設計成可在無人核准下自主跑到 10 萬步。這種「偷用別人的模型運算力、讓受害者付帳單」的做法稱為 LLMjacking。honeypot 本身在設置到報告發布之間，記錄到超過 12.7 萬筆來自數萬個不同位址的外部請求，多數都是對模型端點的偵查、噴灑被盜金鑰與掃描設定檔。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | LLMjacking（裸露 LLM／MCP 端點劫持）＋分層 Jailbreak＋自主滲透 |
| 影響範圍 | 任何未驗證即可存取的自架模型伺服器、AI gateway／relay、MCP server；間接影響其背後的商用模型帳務持有者與被掃描入侵的第三方伺服器 |
| 嚴重程度 | High |
| CVE | 無（配置問題，非單一軟體漏洞） |
| 來源 | [Symantec／security.com](https://www.security.com/blog-post/ai-llmjacking-skynet), [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/symantec-ai-agent-llmjacking/) |

## 攻擊面分析

這起事件跟過去「誘導公開聊天機器人說出不該說的話」的 jailbreak 不同：攻擊者是把 AI 直接嵌進攻擊工具的核心，再主動去找能用的模型，讓模型成為驅動攻擊的推理引擎，掃描、入侵與挖礦則由工具自己的模組對第三方目標執行。Symantec 捕獲的請求分成五層：第一層偽裝模型身分（要求模型自稱是某個品牌化的 coding assistant，永不透露真實供應商或自己是被代理轉發），第二層把讀取 `.env`、API 金鑰、資料庫 schema 重新定義成「IDE 裡正常的開發工作」以繞過拒絕，第三、四層把模型塑造成「對操作者百依百順的虛構角色」並附帶一套「反駁協議」，教模型把自己的安全提示當噪音忽略、直接輸出工具或漏洞程式碼不加警語，第五層才是真正的武器庫：74 個可呼叫工具，涵蓋用 FOFA 做全網資產探測、針對 VS Code／Django／Jupyter／Laravel／Supabase／Next.js／Flask-Werkzeug 的漏洞利用（包含破解 Werkzeug debugger PIN 取得 RCE）、GraphQL／指令注入、透過 HTML 轉 PDF 服務做 SSRF 讀取雲端 metadata，以及 Prisma Studio 資料庫傾印、botnet C2 操控。最後一層指令把 agent 設成「Skynet 模式」：授權跑最多 10 萬步、工具呼叫之間不等人核准、把挖礦程式偷偷裝在 `/tmp/.x` 之類路徑，並設計成「掃描新目標→入侵→裝礦工→再感染」的自我循環。隔天捕獲的另一份請求換了手法，不走工具呼叫格式，而是要模型解碼一段看不出內容的字串——解開後是用 gzip 壓縮、直接丟進命令解譯器的 shell script，會下載並編譯 XMRig 挖礦程式，偽裝成無害的日誌工具檔名，設定多個備援礦池，鎖住自己的設定檔避免被刪，還會持續清除存取紀錄；腳本特別搜尋 go2rtc（常見於智慧攝影機閘道與 Home Assistant 環境）的目錄來藏身。

對應 OWASP LLM Top 10：入口是 **LLM01 Prompt Injection** 的變體——不是間接注入別人的 agent，而是把分層 jailbreak 直接灌給被動掃到的裸露模型，目的一樣是繞過安全護欄；真正讓危害擴大的根因則是 **LLM06 Excessive Agency**——被劫持的模型本身被授權無人值守跑 10 萬步、直接執行工具不經核准，攻擊者只需要找到一個「門沒鎖」的端點，剩下的掃描、入侵、挖礦、再感染全部自動接手。Symantec 特別強調，這套手法裡個別技術都不新，真正值得注意的是「把它們組裝成單一自主 agent」這件事本身降低了發動大規模滲透所需的技術門檻——操作者只需要給模型一個目標，剩下交給它自己跑。

## 防禦做法

**立即動作**
- 盤點環境裡是否有任何自架模型伺服器、AI gateway／relay 或 MCP server 對外網開放：檢查雲端安全群組／防火牆規則，確認沒有服務直接綁定到所有網路介面（`0.0.0.0`）且未強制驗證
- 連模型清單（model-listing）與健康檢查（health-check）路徑也要求驗證——Symantec 指出這類「看起來無害」的端點常被攻擊者當成偵查第一步，不是只有推理端點要防
- 檢查近期 AI API 用量帳單是否有異常暴增或非尖峰時段的大量請求，這往往是金鑰或端點已遭盜用的第一個訊號
- 若有疑似曝露的端點，立刻在供應商後台**撤銷並重發**所有相關 API 金鑰，不要只改本機設定

**長期架構**
- 把 AI API 金鑰當成高價值憑證對待：定期輪換、窄範圍授權、絕不寫進原始碼或設定檔
- 限制跑 AI 工具或掛載 tool-enabled agent 的主機對外連線，讓即使遭劫持的 agent 也無法掃描全網、連回 C2 或下載礦工
- 雲端工作負載強制 IMDSv2＋hop limit 1，阻斷 SSRF 偷雲端 metadata 服務的 instance 憑證這條路
- 讓 tool-enabled agent 以最小權限執行，敏感動作加人工核准關卡——這正是這次事件裡「無人值守 10 萬步」之所以危險的直接對策；同時確保 agent 可能嘗試利用的軟體（VS Code server、Django、Jupyter、Laravel、Supabase、Prisma Studio）都保持更新且不對外開放
- watchlist 中 Netzilo 專門處理 MCP server 的 runtime governance（可設定 allowlist、擋掉未經審核的端點對外曝露），WitnessAI 則專注於盤點企業內部有哪些 AI 服務／模型端點、金鑰流向與用量是否異常，兩者正好對應這次事件揭露的「可見度缺口」

## 影響範圍

Symantec 說明這類活動造成兩群不同的受害者：裸露模型或金鑰持有者要付掉 agent 消耗的運算帳單（授權跑 10 萬步的話可能相當可觀），而被 agent 入侵的第三方伺服器則被偷走資料與憑證、淪為挖礦節點。honeypot 本身在設置到報告發布期間記錄超過 12.7 萬筆外部請求，但這只反映單一誘捕點看到的流量，無法換算成全網實際受害的端點或金鑰數量；報告也沒有公布這個特定「Skynet」agent 已實際造成的受害者統計，捕獲到的攻擊請求末尾附帶的是一個來自合法訓練平台的無害程式設計挑戰，暗示操作者當時可能只是在拿安全目標測試工具。Symantec 的結論是，組織一旦把任何 AI 服務、模型 gateway 或 MCP server 曝露到網路上，就該假定它會很快被發現並測試——未驗證的端點如今是攻擊者主動搜尋的資源，不是理論風險。

## 今日收穫

過去看 LLMjacking 大多停在「偷金鑰、蹭免費額度」的層次，這次才看到它被升級成「把偷到的模型直接接進一套完整攻擊工具鏈，讓模型自己規劃並驅動滲透」——攻擊者甚至不需要自己寫入侵邏輯，只要找到一個沒鎖門的模型端點，剩下的掃描、挖洞、裝礦工全部由模型主導的 agent 自動完成。這提醒我：評估「要不要把模型服務暴露出去」時，不能只想到「有人會偷查詢額度」，更要想到「裸露的模型本身可能被拿去當攻擊者的大腦使用」。

## 參考資料

- [Autonomous LLMjacking: 'Skynet' Agent Hijacks Exposed AI Models to Run Attacks - Symantec／security.com](https://www.security.com/blog-post/ai-llmjacking-skynet)
- [Symantec Uncovers AI Agent Hijacking Models for Autonomous Cyber-Attacks - Infosecurity Magazine](https://www.infosecurity-magazine.com/news/symantec-ai-agent-llmjacking/)
- [OWASP LLM Top 10 — LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP LLM Top 10 — LLM06: Excessive Agency](https://genai.owasp.org/llmrisk2023-24/llm08-excessive-agency/)
