---
title: "資安警報｜NVIDIA NemoClaw 本機 AI Agent 被瀏覽器分頁劫持——CVE-2026-65105 DNS Rebinding 攻擊"
date: 2026-09-07
category: daily
tags: [ai-agent, security, daily, privilege-escalation, data-exfiltration]
lang: zh-TW
description: "NVIDIA NemoClaw 因把本機 Ollama 綁定到 0.0.0.0，讓攻擊者靠 DNS rebinding 從任意網頁取得 Agent 推論後端的完整未授權存取，並永久竄改模型的 chat template"
tldr: "Oasis Security（併入 Cyera）揭露 CVE-2026-65105：NVIDIA NemoClaw 為了讓沙箱容器連得到本機 Ollama，把它綁定在 0.0.0.0:11434，結果連帶關掉 Ollama 唯一還在運作的 Host header 防護。攻擊者用 DNS rebinding 讓瀏覽器分頁在受害者造訪惡意網頁時直接打到本機 Ollama API，竄改模型的 chat template（不是 system prompt），讓惡意指令永久附加在每一次對話上，且對 Agent 端完全不可見。NemoClaw v0.0.35 已修 macOS/Linux，Windows/WSL 目前仍無修補。防禦：立刻檢查 Ollama 是否綁定在 0.0.0.0、限制對 11434 port 的網路存取，並假設 Agent 的攻擊面不只是沙箱邊界，而是它有權碰到的所有組織資源。"
series:
  name: "AI Security Alert"
  order: 25
---

## 事件概述

Oasis Security（正被 Cyera 收購）的研究員 Elad Luz 與 Ofek Itach 在 2026 年 8 月 25 日揭露 CVE-2026-65105：NVIDIA 用來部署 OpenClaw AI Agent 的 NemoClaw 工具，因為一個網路設定選擇，讓攻擊者只要讓受害者造訪一個惡意網頁，就能取得本機 Ollama 推論伺服器的完整未授權存取，並永久竄改 Agent 使用的模型行為。研究團隊已依負責任揭露流程先通報 NVIDIA PSIRT 才公開。The Hacker News、CSO Online、Security Boulevard 等媒體同步報導並取得 NVIDIA 官方回應確認修補已發布。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Missing Authentication（CWE-306）+ Model/Template Poisoning |
| 影響範圍 | 在本機用 Ollama 做推論後端的 NVIDIA NemoClaw（OpenClaw Agent）部署；macOS/Linux 已修，Windows/WSL 未修 |
| 嚴重程度 | High（CVSS 3.1：8.1） |
| CVE | CVE-2026-65105 |
| 來源 | [Oasis Security / Cyera 研究報告](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent)、[CSO Online](https://www.csoonline.com/article/4214156/nemoclaws-ai-can-be-poisoned-through-a-browser-tab.html)、[Security Boulevard](https://securityboulevard.com/2026/08/oasis-security-researchers-reveal-security-flaw-in-nemoclaw-ai-agent)、[NSFocus 事件分析](https://nsfocusglobal.com/ai-security-incident-case-nvidias-nemoclaw-chat-template-poisoning-vulnerability) |

## 攻擊面分析

根因是一個看似單純的網路連通性決定。OpenShell 沙箱跑在 Docker 容器裡，連不到只監聽 `127.0.0.1` 的 Ollama，所以 NemoClaw 把 Ollama 啟動參數改成 `OLLAMA_HOST=0.0.0.0:11434`，讓它監聽所有介面。問題是 Ollama 的原生防護（CORS 檢查 + Host header 驗證）裡，Host header 驗證只在偵測到 loopback 綁定時才生效——一旦綁定到非 loopback 位址，這層檢查會被整個跳過，只剩 CORS 一道防線。

攻擊者接著用 DNS rebinding（一種十幾年前就存在的瀏覽器攻擊手法）繞過 CORS：先讓自己控制的網域解析到攻擊者伺服器，誘騙受害者瀏覽器載入頁面，再把該網域的 DNS 解析改成 `127.0.0.1` 或受害者的區網位址。瀏覽器的同源政策只認網域名稱、不認實際解析到的 IP，於是後續請求被瀏覽器當成「同源」放行，實際上卻打到了受害者本機的 Ollama API——CORS 檢查通過，Host 驗證早已被跳過，攻擊者拿到完整未授權 API 存取。

真正嚴重的不是 API 存取本身（列出已安裝模型、刪除模型、跑任意推論耗用 GPU），而是研究團隊示範的**模型層攻擊**：直接竄改 Ollama 的 `system` 欄位沒有用，因為 OpenClaw Agent 每次呼叫都會自帶自己的 system prompt、覆蓋掉模型內建的。但 `/api/create` 端點還接受一個 `template` 欄位——控制訊息陣列如何被渲染成模型實際看到的原始文字的 Go template，這一層在推論時套用在「所有」訊息上，包含客戶端送來的 system prompt，且對呼叫方完全不可見。攻擊者只要抓下原本的 template、在裡面插入一段附加到每則 system message 的惡意指令，就能讓中毒的 template 跨對話持續存在、在 Agent 每次自帶新 system prompt 時依然生效，而且模型的名稱、大小、metadata 全都看起來正常。

對照 OWASP LLM Top 10，這起事件同時踩中 **LLM04 Data and Model Poisoning**（竄改模型推論管線中人看不到的一層）與 **LLM06 Excessive Agency**——OpenShell 沙箱能限制 Agent 對主機檔案系統與行程的存取，但企業要讓 Agent 真正有用，勢必會授權它碰觸原始碼庫、CI/CD、雲端帳號、內部 API 與 MCP server 等組織資源。沙箱邊界從來不是真正的攻擊面邊界，Agent 被授權碰到的資源範圍才是。

## 防禦做法

現在可以做的是先確認暴露面：Ollama 或任何本機推論服務只要不是嚴格綁定在 `127.0.0.1`，就等於把服務攤在整個網路介面上，任何能誘騙你瀏覽器發請求的網頁都可能構成風險。長期則要把「Agent 推論鏈的每一層完整性」當成安全邊界來設計，而不是只顧沙箱容器——從模型權重、chat template 到網路綁定，每一層都可能被竄改而不被上層看見。

**立即動作**
- 檢查本機 Ollama 綁定位址：`lsof -i :11434` 或看啟動參數是否包含 `OLLAMA_HOST=0.0.0.0`，若無容器連通性需求應改回 `127.0.0.1`
- 若使用 NemoClaw，Windows/WSL 使用者目前無官方修補，應手動限制 11434 port 的對外可達性（防火牆規則、不要對區網開放）
- macOS/Linux 使用者更新到 NemoClaw v0.0.35 以上
- 定期以 `/api/show` 檢查本機模型的 chat template 是否被竄改，比對官方發佈的原始 template

**長期架構**
- 把本機推論服務（Ollama、vLLM 等）當成需要網路隔離的敏感基礎設施，而非開發用的無害背景程序，套用最小暴露原則
- 對 Agent 的下游存取權做最小權限設計：Agent 能碰到的每一項組織資源（原始碼庫、CI/CD、雲端帳號、MCP server）都要單獨評估「如果 Agent 被竄改會發生什麼」
- 導入 watchlist 中 [Protect AI](https://protectai.com/) 的模型/推論管線掃描，或 [Noma Security](https://noma.security/) 的 AI 安全態勢管理，把「模型完整性」和「傳統應用安全」放進同一套監控
- 部署本機推論服務時，把「綁定位址」當成一個需要安全審查的架構決策，而不只是連通性問題

## 影響範圍

Oasis Security 揭露時未發現任何已知的野外利用案例，但攻擊門檻極低——受害者只需要在 Agent 沙箱正常運作時瀏覽到一個惡意網頁，不需要下載任何傳統惡意程式，也不需要竊取憑證或釣魚。目前 NemoClaw v0.0.35 已修補 macOS 與 Linux，但 Windows 與 WSL 環境仍暴露，且截至報導時間點沒有時間表。

對你的 Agent 系統而言，這起事件最值得記住的一點是：**能被瀏覽器分頁打到的任何本機服務，都要假設它會被打到**。如果你的開發環境同時跑著瀏覽器和本機 AI Agent 的推論後端，兩者之間的網路隔離不能只靠「預設監聽 localhost」這種假設——因為一個為了讓容器連通而做的網路調整，就足以讓這個假設整個失效。

## 今日收穫

過去談 Agent 模型層攻擊多半聚焦在 prompt injection（在輸入內容裡藏指令），這起事件展示了一條更底層的路徑：直接竄改模型的 chat template，讓惡意指令繞過 Agent 自己每次都會重新送出的 system prompt——因為 template 是在 system prompt 之上再套用一層的渲染邏輯，Agent 端完全看不到、也無法覆蓋。這提醒我們「Agent 有自己的 system prompt」不等於「Agent 對送進模型的最終內容有控制權」。

## 參考資料

- [Oasis Security / Cyera Research — Drive-By Agent Hijacking: One Website Visit, Persistent Model Poisoning](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent)
- [CSO Online — NemoClaw's AI can be poisoned through a browser tab](https://www.csoonline.com/article/4214156/nemoclaws-ai-can-be-poisoned-through-a-browser-tab.html)
- [Security Boulevard — Oasis Security Researchers Reveal Security Flaw in NemoClaw AI Agent](https://securityboulevard.com/2026/08/oasis-security-researchers-reveal-security-flaw-in-nemoclaw-ai-agent)
- [NSFocus — AI Security Incident Case: NVIDIA's NemoClaw Chat Template Poisoning Vulnerability](https://nsfocusglobal.com/ai-security-incident-case-nvidias-nemoclaw-chat-template-poisoning-vulnerability)
- [Rapid7 Vulnerability Database — CVE-2026-65105](https://www.rapid7.com/db/vulnerabilities/cve-2026-65105)
- [NVIDIA Security Bulletin — NemoClaw and OpenShell, August 2026](https://nvidia.custhelp.com/app/answers/detail/a_id/5872)
