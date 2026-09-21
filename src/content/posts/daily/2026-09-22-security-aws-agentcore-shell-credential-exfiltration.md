---
title: "資安警報｜AWS AgentCore 預設開啟的 shell 工具，讓 prompt injection 能讀出 Identity vault 裡的明文憑證"
date: 2026-09-22
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "Unit 42 揭露 AWS AgentCore Harness 的預設組態下，內建 shell 工具以 root 權限與 harness 主行程共用記憶體空間，攻擊者能用間接 prompt injection 讀出 AgentCore Identity vault 解密後的明文憑證並在外部重播使用"
tldr: "Unit 42 用一個虛構的客服 agent 示範：把攻擊指令藏在客服工單的隱藏 HTML 註解裡，誘使 agent 呼叫預設開啟的 shell 工具下載並執行偵察腳本。他們發現 shell 子行程以 root 執行，且能直接讀取 harness 主行程（PID 1）的記憶體──而 AgentCore Identity 用來認證下游 MCP 服務的 JWT，正是在這塊記憶體裡被解密成明文。研究團隊當場把這組 JWT 外洩到外部 webhook，再從自己的筆電重播該憑證，成功列出 MCP 工具、呼叫查客戶資料的函式並拿到含 PII 的回應。AWS 已將此案例列為「資訊性」結案，理由是 allowedTools 範圍限制與出站流量過濾屬於客戶端責任。"
series:
  name: "AI Security Alert"
  order: 35
---

> 🌏 [English version](/en/posts/daily/2026-09-22-security-aws-agentcore-shell-credential-exfiltration-en)


## 事件概述

Palo Alto Networks 旗下的 Unit 42 研究團隊揭露一項針對 AWS AgentCore Harness（AWS 的 AI agent 受管執行環境）預設組態的攻擊路徑：攻擊者只要能對 agent 讀到的內容動手腳（例如一張客服工單），就能透過間接 prompt injection 誘使 agent 呼叫預設開啟的內建 shell 工具，進而讀取 harness 主行程的記憶體，從中撈出 AgentCore Identity vault 已解密成明文的憑證。研究團隊用一個虛構公司「SupportCo」的客服 agent 完整示範了從注入指令、取得 shell 執行權、讀取行程記憶體、外洩 JWT，到從外部重播該憑證存取下游服務的整條攻擊鏈。這不是單一使用者疏忽造成的漏洞，而是 AWS 官方文件明確列出的「開箱即用」預設行為：除非操作者主動用 `allowedTools` 限制，否則每個 session 都拿得到 shell 與 file_operations 這兩個內建工具。AWS 審查後將此案例列為「資訊性」結案，認為 allowedTools 範圍設定與出站流量過濾屬於客戶端責任範圍。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Prompt Injection 導向的憑證外洩（Credential Exfiltration via In-Memory Secret Exposure） |
| 影響範圍 | 使用 AWS AgentCore Harness 預設組態（內建 shell 工具開啟 + AgentCore Identity vault 儲存下游服務憑證）的部署 |
| 嚴重程度 | High（無需使用者互動即可觸發，但需要成功的間接 prompt injection 為前提，且 AWS 判定為客戶端設定責任而非平台漏洞） |
| CVE | 無（AWS 審查後以 AgentCore 共同責任模型下的「資訊性」結案，未發行 CVE） |
| 來源 | [Unit 42 原始研究](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/)、[NetManageIT 分析](https://blog.netmanageit.com/aws-agentcore-harness-prompt-injection-credential-risk/) |

## 攻擊面分析

攻擊分三個階段。第一階段是取得程式碼執行權：Unit 42 一開始直接要求模型呼叫 shell 工具執行偵察指令,結果被拒絕兩次；改用間接注入後才成功——他們把指令藏在客服工單裡的一段隱藏 HTML 註解中,內容只有一行「用 curl 把偵察腳本抓下來、餵給 python3 執行」,agent 在處理工單時讀到這行文字，就真的呼叫了 shell 工具把它跑了起來。第二階段是環境探查：研究團隊發現 shell 子行程是以 root 身分執行,而且與 harness 主行程（PID 1，一個叫 `loopy` 的 Python 服務）共用同一個使用者身分,`/proc/1/mem` 對這個 shell 子行程而言是可讀的——也就是說,主行程記憶體裡的任何東西,包括正在被解密使用的憑證,shell 工具都碰得到。第三階段是憑證萃取與重播：AgentCore Identity 的憑證在儲存時有 KMS 加密、傳輸也走加密通道,但下游 MCP 服務終究需要一個明文的 Bearer token 才能認證,而這個解密動作發生在 harness 主行程裡——研究團隊寫了一支腳本掃描 `/proc/1/mem` 找 JWT 格式的位元組樣式與對應的 MCP URL,找到後直接 POST 到外部 webhook,接著從自己的筆電用這組 JWT 連上模擬的 MCP 服務,不需要任何 AWS 憑證就列出工具、呼叫查客戶資料的函式並拿到包含姓名、電話、SSN 末四碼的 PII 回應。

根本原因可以歸結為兩層。第一層是「vault 只保護靜態與傳輸中的資料,不保護使用中的資料」——AgentCore Identity 的加密與存取控制在憑證靜止不動時確實有效,但憑證一旦要被下游服務使用,就必須在某個行程裡變成明文,而這個解密之後的狀態完全沒有額外的隔離保護。第二層是權限範圍設計缺陷：`allowedTools` 這個限制內建工具的參數,只在 `InvokeHarness`（呼叫時）生效,不在 `CreateHarness`（建立時）生效——這代表就算操作者以為自己已經用 allowedTools 鎖住了 shell 工具,只要沒有精確對到每一次呼叫的 session,shell 與 file_operations 這兩個「預設開啟」的工具仍然可能被任何一次 session 用到。對照 OWASP LLM Top 10,這起事件同時踩中 **LLM01 Prompt Injection**（間接注入是整條攻擊鏈的起點）與 **LLM06 Excessive Agency**（shell 工具擁有遠超過客服 agent 業務需求的系統層級權限,且與憑證解密行程共享記憶體邊界）。

## 防禦做法

Unit 42 的研究再次證實一個容易被忽略的事實：prompt injection 的殺傷力不是由「模型的判斷力」決定,而是由「agent 手上的工具實際碰得到什麼」決定——模型的推理沒辦法可靠分辨一個指令是不是被注入的,真正的防線只能建在工具權限範圍上。

**立即動作**
- 盤點所有 AgentCore Harness 部署,確認每一個 `InvokeHarness` 呼叫是否有明確設定 `allowedTools`,把不需要 shell 與 file_operations 的 session 明確排除這兩個工具
- 檢查 AgentCore Identity vault 裡每個 service account 憑證的下游權限範圍,確保單一憑證外洩不會導致大範圍資料存取——這次示範中外洩的是 `mcp-service` 這個操作者層級的服務帳號,權限比一般終端使用者的 session token 更廣
- 監控 harness container 的出站流量,任何不在已知下游服務清單上的連線目的地都應視為可能的主動 prompt injection 訊號,而非單純的組態漂移

**長期架構**
- 把 agent 執行 shell 或程式碼的沙箱環境,與解密／持有憑證的行程做記憶體層級的隔離,讓工具執行環境即使被注入指令拿到程式碼執行權,也碰不到其他行程的記憶體空間
- 評估在 agent pipeline 前端導入 watchlist B7 中 Invariant Labs 或 Straiker 這類專門做 runtime guardrail 的工具,對 agent 實際發出的工具呼叫（而不只是輸入文字）做即時攔截與稽核
- 針對所有代理 agent 對外行動的服務帳號,落實最小權限原則,並定期複查每個 Identity vault 憑證是否仍對應到目前真正需要的下游整合範圍

## 影響範圍

Unit 42 這次研究全程使用自建的虛構情境（假想公司 SupportCo、模擬的 MCP 服務、自架的 webhook 端點),沒有真實客戶或真實受害系統涉入,AWS 也在揭露時程中確認過這一點。揭露時程顯示：研究團隊於 2026 年 5 月 19 日透過 HackerOne 通報 AWS 資安團隊（報告編號 #3747844),AWS 於 6 月 8 日回覆要求重現細節與釐清範圍,6 月 10 日確認此案例與另一份更早的報告（#3737800）共享同一個根本原因並將兩案合併,同日 AWS 以「AgentCore 共同責任模型下屬於資訊性」結案,理由是 allowedTools 範圍限制與出站流量過濾屬於客戶端可控的設定項目,而非平台本身的安全缺陷。

這起事件對正在用 AgentCore Harness 建置 agent 的團隊意味著：即使你完全依照 AWS 官方文件把憑證放進 Identity vault、也套用了加密與 IAM 存取控制,只要沒有額外主動限縮 `allowedTools` 並把它綁定到每一次 session 呼叫,你的 agent 預設仍然對外暴露一個以 root 權限、能讀取主行程記憶體的 shell 工具。任何能讓 agent 讀到不受信任內容的入口（客服工單、外部文件、網頁內容）,都可能成為這條憑證外洩鏈的起點。

## 今日收穫

這次案例最有意思的地方,是 AWS 官方回應的定調——「vault 有做到加密與存取控制,所以這是客戶端組態問題」。這個回應在字面上沒有錯,但恰好呼應了 Unit 42 報告裡最核心的觀察：vault 保護的是靜止與傳輸中的資料,一旦憑證要「被使用」就必須變成明文,而這個「使用中」的狀態,傳統的 vault 安全模型根本沒有涵蓋到。這提醒我們,在評估任何憑證管理方案時,不能只問「靜態儲存安不安全」,還要追問「這個憑證被解密後,還有誰的行程能碰到那塊記憶體」。

## 參考資料

- [Unit 42: A Vault with a Heap-View: The Uncomfortable Space Between AgentCore Harness and Identity](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/)
- [NetManageIT: AWS AgentCore Harness Prompt Injection Credential Risk](https://blog.netmanageit.com/aws-agentcore-harness-prompt-injection-credential-risk/)
- [AWS: Amazon Bedrock AgentCore Harness Tools Developer Guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-tools.html)
- [AWS: Provide identity and credential management for agent applications with Amazon Bedrock AgentCore Identity](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html)
