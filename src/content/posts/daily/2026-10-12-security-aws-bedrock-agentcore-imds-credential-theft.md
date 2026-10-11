---
title: "資安警報｜一句提示劫持整區 AI Agent 艦隊——AWS Bedrock AgentCore「AgentCorruption」揭露 IMDS 竊權鏈"
date: 2026-10-12
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "AI 資安公司 Zenity Labs 發現，對 AWS Bedrock AgentCore 上任一公開 AI agent 送出一句提示，就能透過 SSRF 偷到該 agent 的雲端身分，再靠過度授權的預設角色橫向擴散到同帳號同區域的所有 agent。"
tldr: "Zenity Labs 命名為 AgentCorruption 的攻擊鏈：先用提示注入讓有網路／shell 工具的 agent 去打 169.254.169.254 的 metadata 端點偷到執行角色的暫時憑證，再靠 AgentCore 預設角色的過寬 wildcard 權限列出並入侵同帳號同區域的所有其他 agent，讀私人對話、下毒記憶、拉走容器映像與 Secrets Manager 裡的密鑰。AWS 已於 2026 年 2 月把新部署 agent 全面改為 IMDSv2、9 月收斂預設角色權限，但官方立場是「此為文件化的預期行為」而非漏洞。Dark Reading、cybersecuritynews.com、BusinessWire 等多方交叉確認；防禦：立即收斂 execution role 到最小權限，長期把 agent 當成雲端工作負載而非聊天機器人來做存取審查。"
series:
  name: "AI Security Alert"
  order: 51
---

> 🌏 [English version](/posts/daily/2026-10-12-security-aws-bedrock-agentcore-imds-credential-theft-en)

## 事件概述

AI 資安公司 Zenity Labs（watchlist B7 名單中的安全研究廠商）在 SecTor 2026 揭露一條命名為「AgentCorruption」的攻擊鏈：只要對 AWS Bedrock AgentCore 上任何一個對外公開、且擁有網路或 shell 工具的 AI agent 送出一句提示，就能偷到該 agent 的雲端身分憑證,再利用 AgentCore 預設執行角色過度寬鬆的權限,一路橫向擴散到同一 AWS 帳號、同一區域內的**所有其他 agent**——讀取私人對話紀錄、竄改長期記憶、拉走容器映像原始碼，甚至取得 Secrets Manager 中存放的密鑰。Zenity 已於 2025 年 12 月向 AWS 負責任揭露,AWS 已完成修補,但雙方對「這是不是漏洞」仍有分歧。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Prompt Injection 驅動的 SSRF + 權限提升（跨 agent 橫向移動） |
| 影響範圍 | AWS Bedrock AgentCore 上部署的公開 AI agent（2026 年 9 月前的預設設定） |
| 嚴重程度 | High |
| CVE | 無（AWS 將揭露結案為「informative」，認定是文件化的預期行為） |
| 來源 | [Zenity Labs 原始研究](https://labs.zenity.io/post/agentcorruption-initial-imds-access)、[Dark Reading](https://www.darkreading.com/cloud-security/agentcorruption-aws-environments-at-risk-single-prompt)、[cybersecuritynews.com](https://cybersecuritynews.com/agentcorruption-attack/)、[BusinessWire](https://www.businesswire.com/news/home/20261008316155/en/Zenity-Labs-Discloses-AgentCorruption-a-Chain-of-AWS-AgentCore-Flaws-That-Allowed-One-Prompt-to-Take-Over-All-AgentCore-Agents-Within-an-AWS-Account-and-Region) |

## 攻擊面分析

攻擊第一步是最經典的雲端 SSRF 套路，只是觸發方式換成了自然語言。AgentCore 的每個 agent 都跑在獨立的 Firecracker microVM 裡，Zenity 用開源的 Strands SDK 部署一個只掛了 `http_request`（或 `shell`）工具的示範 agent，直接用白話文請它去打 `169.254.169.254` 的 metadata 端點——microVM 完全沒有限制這條出站流量,agent 乖乖把回應原文轉傳回來。走到 IAM 路徑後，metadata 服務直接吐出該 agent 執行角色的暫時 AWS 憑證（access key、secret key、session token），Zenity 把這組憑證匯出到自己機器上驗證後，確認可以直接以「該 agent 的身分」呼叫官方 AWS API，之後整條攻擊鏈完全不需要再碰那個 agent 的聊天介面。

真正把一次性入侵變成「全區淪陷」的,是 AgentCore 預設執行角色的授權設計。這個角色的 `logs:DescribeLogGroups` 權限能列出同帳號同區域內所有 agent 的名稱與 ID,而 `ECRImageAccess` 又帶 wildcard,等於能拉下**任何**agent 的容器映像——因為 AgentCore 把每個 agent 的映像倉庫命名規則固定為 `bedrock-agentcore-<agent_name>`,拿到角色就能批量掃完整個帳號區域的原始碼。角色裡還夾帶 `bedrock-agentcore:InvokeAgentRuntime`、`GetResourceApiKey`、`secretsmanager:GetSecretValue` 等權限,讓攻擊者能主動呼叫其他 agent、讀取私人對話 session、植入偽造的長期記憶(讓受害 agent 在之後的對話中被悄悄改變目標),還能拉走連到其他業務系統的 API 金鑰與密鑰。對應 OWASP LLM Top 10：入口是 **LLM01 Prompt Injection**（用自然語言誘導 agent 執行攻擊者想要的網路請求），放大半徑的根因則是 **LLM06 Excessive Agency**——一個理論上只該服務單一用途的 agent，預設角色卻握有整個區域的讀寫刪權限。

## 防禦做法

**立即動作**
- 檢查自家 AgentCore agent 的 execution role，移除所有 wildcard（`*`）資源範圍的權限，尤其是 `ECRImageAccess`、`bedrock-agentcore:InvokeAgentRuntime`、`secretsmanager:GetSecretValue` 這類能跨 agent 存取的項目
- 確認 agent 執行環境已強制 IMDSv2（AWS 已於 2026 年 2 月 14 日起把新部署 agent 預設改為 IMDSv2-only，但既有舊部署需自行確認是否繼承新設定）
- 對任何具備 `http_request`／`shell`／外部網路工具的 agent，在網路層（非只靠 prompt）封鎖對 `169.254.169.254` 的出站請求

**長期架構**
- 把每個 agent 的 execution role 拆成專屬最小權限角色，不要沿用 AgentCore 的共用預設角色——這是這次攻擊能「一人到全區」的唯一原因
- 公開對外的 agent 與內部可信 agent 要分開部署、分開角色，不要共用同一個 AWS 帳號區域的憑證邊界
- 導入 watchlist B7 的 **Zenity**、**Invariant Labs** 等 agent 運行期防護工具，對 agent 的工具呼叫與 session 行為做持續監控，而不是只在部署前做一次性審查
- 用 CloudTrail／CloudWatch 對 `bedrock-agentcore:*` 的異常呼叫模式（如同一來源短時間內列出大量 agent ID）建立告警規則

## 影響範圍

Zenity 在 2025 年 12 月 25 日向 AWS 揭露 IMDS 存取問題，2026 年 1 月 12 日再補一份關於過寬預設角色的報告；AWS 在 2 月把新部署的 agent 全面轉為 IMDSv2，9 月 29 日前完成預設角色的權限收斂，Zenity 確認問題已修補。但 AWS 官方聲明堅持「agent 透過 metadata 服務存取自身執行角色憑證是文件化且預期的行為」，並強調跨帳號存取需要雙邊明確授權——換言之，AWS 不認為這是需要 CVE 編號的漏洞，而是「客戶自己該把角色收緊」的設定問題。Zenity 的研究者在會後受訪時表示，目前沒有證據顯示這條攻擊鏈在修補前已被野外利用,但由於 AgentCore 本身「因為難以被外部掃到而有安全感」,他個人「100% 確定有辦法找到誰在跑」,且 IMDS 弱點很可能不只限於 AWS 一家雲平台。如果你的團隊用 AgentCore（或任何讓 agent 自帶網路、shell 工具的雲端 agent 平台）跑對外服務，這起事件意味著「部署前的角色設計」和「部署後的持續稽核」同樣重要——預設設定永遠會比攻擊者的好奇心慢一步。

## 今日收穫

這起事件最有意思的地方不是 SSRF 本身（這是 2019 年 Capital One 事件就該學會的教訓），而是「觸發方式換成自然語言」讓防禦心態整個錯位：團隊通常會審查 agent 能不能被騙著做壞事,卻忘了先問「這個 agent 的雲端身分本身握有多少權限」。prompt injection 在這裡只是鑰匙,真正的門鎖壞掉的地方是 IAM 設計——把 agent 當聊天機器人防禦、卻用雲端工作負載的權限在跑，兩套心態的落差就是這次攻擊面的全部來源。

## 參考資料

- [Zenity Labs - AgentCorruption: Initial IMDS Access](https://labs.zenity.io/post/agentcorruption-initial-imds-access)
- [Dark Reading - 'AgentCorruption' Puts AWS Environments at Risk With Single Prompt](https://www.darkreading.com/cloud-security/agentcorruption-aws-environments-at-risk-single-prompt)
- [cybersecuritynews.com - One Prompt Could Hijack AWS AI Agents and Steal Cloud Credentials](https://cybersecuritynews.com/agentcorruption-attack/)
- [BusinessWire - Zenity Labs Discloses AgentCorruption](https://www.businesswire.com/news/home/20261008316155/en/Zenity-Labs-Discloses-AgentCorruption-a-Chain-of-AWS-AgentCore-Flaws-That-Allowed-One-Prompt-to-Take-Over-All-AgentCore-Agents-Within-an-AWS-Account-and-Region)
- [AWS - Credentials management in AgentCore](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-credentials-management.html)
