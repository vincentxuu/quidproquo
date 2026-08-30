---
title: "資安警報｜LiteLLM MCP 測試端點命令注入可串成未授權 RCE——Wiz 90 天蜜罐實測揭露 AI 基礎設施三種攻擊模式"
date: 2026-08-31
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "Wiz Threat Research 公布 90 天蜜罐觀測結果：攻擊者正主動利用 LiteLLM 的 MCP 認證繞過（CVE-2026-59822）與命令注入（CVE-2026-42271，已列入 CISA KEV），並可串接 Starlette host header 繞過（CVE-2026-48710）打出完整未授權 RCE，同時對 LangChain、Flowise 等 agent 框架發動盲打 prompt injection"
tldr: "Wiz 跨 LiteLLM、Flowise、LangChain、Langflow、ChromaDB、Ollama 等服務布建蜜罐，90 天內觀察到三種攻擊模式：一是利用 LiteLLM MCP Gateway 的認證繞過與 MCP 測試端點的命令注入部署加密貨幣挖礦程式，且刻意讓連線測試回傳看似正常的 MCP handshake 掩蓋入侵；二是對 LangChain/Flowise/OpenWebUI/Node-RED 發動盲打 prompt injection，靠 DNS out-of-band callback 確認指令執行成功；三是直接查詢 LiteLLM 執行中 process 的 Python 記憶體狀態竊取 proxy master key，並把礦機偽裝成 `.claude/` 目錄下的檔案規避人工檢查。CVE-2026-42271 已被外部研究者關聯到 Qilin 勒索軟體集團的主動利用，CISA 已列入 KEV 目錄，防禦重點是立即升級 LiteLLM 至 1.83.7+、關閉非必要的 MCP 測試端點、把所有對外曝露的 AI 基礎設施當成有憑證濃度的正式環境對待。"
series:
  name: "AI Security Alert"
  order: 17
---

> 🌏 [English version](/en/posts/daily/2026-08-31-security-litellm-mcp-rce-honeypot-en)

## 事件概述

雲端資安公司 Wiz 的威脅研究團隊於 8 月 27 日發布報告，公開跨 LiteLLM、Flowise、LangChain、Langflow、ChromaDB、Ollama 等 AI 基礎設施服務布建蜜罐、累積 90 天遙測資料的觀察結果。報告指出攻擊者已經不是把 AI 服務當成普通 Web 伺服器對待，而是針對這些服務的內部機制量身打造攻擊手法——鎖定的是「AI 閘道集中管理多家模型供應商金鑰」以及「agent 天生被設計成要接收外部輸入並執行動作」這兩個結構性弱點。報告涵蓋三種獨立攻擊模式，其中最直接的一種——LiteLLM 的 MCP 測試端點命令注入（CVE-2026-42271）——已在今年稍早就被披露、修補並列入 CISA 已知遭利用漏洞（KEV）目錄，外部研究者更已將其與 Qilin 勒索軟體集團的主動利用行動連結,但這次蜜罐報告首度用實際遙測資料證實三種攻擊手法都已在野外被系統性使用。The Hacker News、Cloud Security Alliance、Horizon3.ai 等資安媒體與研究機構已陸續跟進報導。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | MCP 認證繞過 + 命令注入 RCE、跨框架盲打 Prompt Injection、AI 原生 Post-Exploitation |
| 影響範圍 | LiteLLM（1.74.2–1.83.6）、LangChain、Flowise、OpenWebUI、Node-RED、Langflow 等對外曝露的 AI 閘道與 agent 框架 |
| 嚴重程度 | Critical（CVE-2026-42271 CVSS 8.7，可串接成完全未授權 RCE，且已有蜜罐證實的野外利用與勒索軟體集團關聯） |
| CVE | CVE-2026-42271（LiteLLM MCP 命令注入）、CVE-2026-59822（LiteLLM MCP Gateway 認證繞過）、CVE-2026-48710（Starlette host header 驗證繞過，用於串鏈） |
| 來源 | [Wiz Threat Research（原始報告）](https://www.wiz.io/blog/ai-infrastructure-honeypot)、[The Hacker News](https://thehackernews.com/2026/06/litellm-flaw-cve-2026-42271-exploited.html)、[Horizon3.ai](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-42271-chained-with-cve-2026-48710/) |

## 攻擊面分析

第一種攻擊模式鎖定 MCP 協定本身。LiteLLM 的 MCP Gateway 在處理 OAuth2 header 時,一旦 token 驗證失敗,並不會直接拒絕請求,而是回傳一個沒有任何限制的空白 `UserAPIKeyAuth()` 物件——這代表任何 Bearer token(哪怕只是單一字元)都能取得完整 MCP 存取權(CVE-2026-59822)。更嚴重的是命令注入漏洞 CVE-2026-42271:LiteLLM 開放使用者在正式儲存前先「測試」MCP server 設定的端點(`POST /mcp-rest/test/connection`、`POST /mcp-rest/test/tools/list`),但這個測試流程把使用者填入的 `command` 欄位直接丟進 subprocess 執行,完全沒有做輸入驗證。Wiz 的蜜罐觀察到攻擊者送出一份偽造的 stdio 型 MCP 設定,`command` 欄位藏著會下載並啟動加密貨幣挖礦程式(`gmon`,一支 XMRig 變種)的 Python 腳本,同時讓連線測試回傳一個語法完全合法的 MCP handshake,讓管理者以為這只是一次正常的設定測試。挖礦程式以 `start_new_session=True` 分離執行,啟動後立刻用 `rmtree` 刪除暫存目錄,但行程本身仍持有該執行檔的 inode——結果是硬碟上幾乎不留痕跡,記憶體裡卻有一支持續運行的礦機。指令執行結果甚至透過 MCP 協定本身回傳,藏在 `tools/list` 回應裡一個假造工具的 `description` 欄位中。CVE-2026-42271 更可以和 Starlette 的 host header 驗證繞過漏洞(CVE-2026-48710)串接,把原本需要認證的命令注入,轉成完全不需要任何憑證的遠端程式碼執行;外部研究者已將這條串鏈與 Qilin 勒索軟體集團的主動利用活動連結。

第二種攻擊模式是針對 LangChain、Flowise、OpenWebUI、Node-RED 等 agent 框架的「盲打」(blind)prompt injection——借用傳統 Web 安全裡「看不到注入結果,就靠 out-of-band 管道確認」的手法。攻擊者注入的指令誘導 agent 呼叫自己擁有的 shell 工具送出 DNS 查詢,打到攻擊者控制的 OAST(out-of-band application security testing)網域,子網域裡編碼了受害者 IP 與工作階段識別碼,讓攻擊者不需要看到任何應用程式層的輸出,就能確認注入是否成功命中一個真的有執行能力的工具。後續酬載改放在 Pastebin 上動態抓取(不留在應用程式日誌裡),指令內容用 Base64 編碼繞過表層的 prompt 過濾;成功的攻擊會話最終在 `/usr/src/node-red/xmrig` 這類刻意模仿 Node.js 行程樹的路徑上部署 XMRig 礦機。

第三種攻擊模式是「AI 原生」的後滲透手法。一般 Web 伺服器遭入侵後,攻擊者的標準動作是翻 `/etc/passwd`、找 SSH 金鑰、掃常見設定檔;但針對 LiteLLM,攻擊者直接查詢執行中 process 的 Python 模組狀態,從記憶體裡萃取 proxy master key——因為這把金鑰根本不落地寫進任何檔案。同一批攻擊還會枚舉 `litellm_config.yaml`、`~/.litellm/config.yaml` 等框架專屬設定路徑,並主動 fingerprint 後端接的是 OpenAI、Anthropic 還是 Azure 模型,以決定接下來是直接偷金鑰、拿去做 LLM 推論配額盜用(LLMjacking),還是繼續橫向移動。在 Langflow 的蜜罐上,攻擊者甚至把礦機放進 `/app/data/.claude/` 目錄、改名叫 `unicorn`——刻意讓它看起來像 Claude Code 在該主機上正常寫入的設定檔,藉此降低人工排查時被標記的機率。對照 OWASP LLM Top 10,三種模式合起來精準命中 **LLM05 Supply Chain Vulnerabilities**(未修補的開源 AI 閘道)、**LLM06 Excessive Agency**(MCP 測試端點被賦予了遠超「測試設定」需要的 subprocess 執行權)與 **LLM08 Excessive Agency / 工具濫用**(agent 的 shell 工具被盲打注入直接調用)。

## 防禦做法

**立即動作**
- 盤點環境中所有 LiteLLM 部署,確認版本落在 1.74.2–1.83.6 之間就是已知可被利用;立即升級到 1.83.7 以上,並同步把 Starlette 升級到 1.0.1 以上以阻斷與 CVE-2026-48710 的串鏈
- 停用或限制 LiteLLM 的 MCP 測試端點(`/mcp-rest/test/connection`、`/mcp-rest/test/tools/list`),若非必要不要對外曝露;所有對外可及的 AI 服務一律預設要求身分驗證,不要延用 Flowise、Langflow、Ollama、ChromaDB 等工具「預設不驗證」的出廠設定
- 立即輪替所有可能經由 LiteLLM proxy 曝露的模型供應商金鑰(OpenAI、Anthropic、Azure、Gemini 等),假設 master key 已經在記憶體層級被讀取
- 在 runtime 層監控 AI 服務行程是否異常衍生 shell、Python one-liner、下載工具、Base64 解碼或非預期的外送 DNS 流量——這是偵測 MCP RCE 與盲打 prompt injection 的共通訊號

**長期架構**
- 把所有對外曝露的 AI 元件(閘道、agent 框架、向量資料庫、模型伺服器)當成「有憑證濃度的正式生產基礎設施」納管,建立明確的資產清冊與 owner,而不是當成實驗性工具放任裸露
- 對 AI 代理 IAM 權限做最小化設定,封鎖不必要的對外連線,並把所有透過 MCP 串接的內部服務視為和公開端點同一等級的攻擊面來加固
- 評估 watchlist B7 中 Protect AI 的 ML 供應鏈安全掃描能力,以及 Netzilo 的跨平台 agent runtime governance/kill switch,對 MCP server 設定變更與子行程建立做集中審核與攔截
- 修補優先序不要等 CVE 公告後的例行維護週期——這次事件顯示攻擊者往往在修補釋出後就立刻武器化,對開源 AI 基礎設施要假設漏洞已在野外被利用,提前排入緊急修補流程

## 影響範圍

Wiz 的蜜罐是主動布設的誘捕環境,因此報告本身沒有揭露具體受害企業名單,但三個關鍵事實顯示影響範圍不小:其一,CVE-2026-42271 已在今年 6 月被 CISA 正式列入 KEV 目錄,代表已有確認的野外利用,美國聯邦機關依 Binding Operational Directive 26-04 必須在強制期限內完成修補;其二,外部研究者已把這條命令注入串鏈與 Qilin 勒索軟體集團的主動利用行動連結,意味著攻擊已從機會型的挖礦濫用,升級到有組織的勒索軟體前置作業;其三,Wiz 自家「2026 雲端 AI 現況」報告顯示 90% 的雲端環境有自架 AI 軟體、81% 使用受管理 AI 服務,代表這類對外曝露的 AI 閘道與 agent 框架在企業環境中的部署密度已經相當高。

如果你的團隊有自架 LiteLLM 作為多模型路由層,或用 LangChain / Flowise / Langflow / Node-RED 建置對外可觸及的 agent 應用,這起事件的重點不是「又一個 CVE」,而是攻擊者已經證明他們懂得利用 AI 基礎設施的內部運作機制——從記憶體讀金鑰、偽裝成 Claude Code 設定檔、用 MCP 協定本身回傳竊得的資料——這些手法都繞過了傳統以檔案系統為中心的偵測邏輯,代表防禦也必須跟著往 AI 服務的內部語意層移動。

## 今日收穫

過去看 MCP 相關的資安討論,焦點多半放在「惡意 MCP server 騙使用者安裝」這種供應鏈信任問題上;這次 Wiz 的蜜罐報告讓我意識到,MCP 生態裡還有一整類更底層的攻擊面——像 LiteLLM 這種用來「測試 MCP 設定是否正確」的輔助端點,本質上就是一個會執行任意命令的介面,只是包裝成看起來無害的驗證功能。任何「先測試再儲存設定」的模式,只要測試流程本身會真的執行使用者輸入的內容,就等於在正式功能之外多開了一道沒人特別防守的後門。

## 參考資料

- [Inside 90 days of attacks on AI infrastructure — Wiz Threat Research（原始報告）](https://www.wiz.io/blog/ai-infrastructure-honeypot)
- [LiteLLM Flaw CVE-2026-42271 Exploited in the Wild, Chains to Unauthenticated RCE — The Hacker News](https://thehackernews.com/2026/06/litellm-flaw-cve-2026-42271-exploited.html)
- [CVE-2026-42271: LiteLLM Unauthenticated RCE — Horizon3.ai](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-42271-chained-with-cve-2026-48710/)
- [LiteLLM AI Gateway: Active Exploitation via MCP Injection — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-litellm-cve-2026-42271-ai-gateway-exploita/)
- [CVE-2026-42271 Detail — NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-42271)
- [LiteLLM MCP Gateway Authentication Bypass Advisory (GHSA-7488-6r32-c95q) — GitHub](https://github.com/BerriAI/litellm/security/advisories/GHSA-7488-6r32-c95q)
