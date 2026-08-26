---
title: "資安警報｜NVIDIA NemoClaw 一次網頁瀏覽即可下毒本機 AI 模型（CVE-2026-65105）"
date: 2026-08-26
category: daily
tags: [ai-agent, security, daily, prompt-injection, mcp]
lang: zh-TW
description: "Oasis Security 揭露：NVIDIA NemoClaw 部署的本機 Ollama 因綁定 0.0.0.0 而被 DNS rebinding 攻破，攻擊者能悄悄竄改模型 chat template，植入連 agent 自帶 system prompt 都蓋不掉的持久指令"
tldr: "NVIDIA NemoClaw（部署 OpenClaw agent 的官方工具）為了讓沙箱容器能連到本機 Ollama，把 Ollama 綁定在 0.0.0.0，這個設定會關掉 Ollama 用來擋 DNS rebinding 的 Host header 檢查。攻擊者只要讓開發者瀏覽一個惡意網頁，就能用 DNS rebinding 取得 Ollama API 的完整未授權存取，再透過 /api/create 竄改模型的 Go template，把惡意指令永久嵌進去——這個手法連 agent 自己每次送出的 system prompt 都覆蓋不掉。防禦：Ollama 只綁定 loopback、用 auth proxy 擋在前面、對 Host header 做 allowlist，不要單靠沙箱隔離。"
series:
  name: "AI Security Alert"
  order: 12
---

> 🌏 [English version](/en/posts/daily/2026-08-26-security-nemoclaw-ollama-dns-rebinding-model-poisoning-en)

## 事件概述

資安公司 Oasis Security（現為 Cyera 旗下研究團隊，也是被 Cyera 以約 10 億美元收購後的首篇研究）在 8 月 25 日揭露一個影響 NVIDIA NemoClaw 的漏洞（CVE-2026-65105）。NemoClaw 是 NVIDIA 在今年 3 月 GTC 大會推出、用來在 OpenShell 沙箱裡部署 OpenClaw agent 的官方工具，主打「比直接跑 agent 更安全」。問題出在它為了讓沙箱容器連到本機的 Ollama 推理服務，把 Ollama 綁定在 `0.0.0.0` 而非預設的 loopback，這個決定意外關掉了 Ollama 防禦 DNS rebinding 攻擊的核心機制。開發者只要瀏覽一個惡意網頁，攻擊者就能取得 Ollama API 的完整未授權存取，並悄悄竄改 agent 所用模型的 chat template，植入永久生效、連 agent 自己送出的 system prompt 都蓋不掉的隱藏指令。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Local Service Exposure（DNS Rebinding）+ Model/Template Poisoning |
| 影響範圍 | 使用 NVIDIA NemoClaw 搭配本機 Ollama 推理後端的開發者環境 |
| 嚴重程度 | High（未授權即可完整存取，且下毒後難以被使用者察覺） |
| CVE | CVE-2026-65105 |
| 來源 | [Oasis/Cyera 研究報告](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent)、[SiliconANGLE](https://siliconangle.com/2026/08/25/nvidia-nemoclaw-flaw-let-attackers-poison-the-model-behind-a-developers-ai-agent/)、[The Hacker News](https://thehackernews.com/2026/08/a-malicious-webpage-could-poison-your.html) |

## 攻擊面分析

NemoClaw 讓 OpenClaw agent 跑在 Docker 容器組成的 OpenShell 沙箱裡，本機推理選項則透過 Ollama 在開發者主機上跑模型。問題是 Docker 容器沒辦法連到主機的 `127.0.0.1`，NemoClaw 為了解決這個連通性問題，直接用 `OLLAMA_HOST=0.0.0.0:11434` 把 Ollama 綁到所有網卡介面上——這是一個典型的「為了容器可達性犧牲安全預設值」的基礎設施決策。

Ollama 的 API 本身沒有身分驗證，靠兩層 middleware 頂替：一個是 Origin allowlist（CORS），一個是 Host header 驗證。Oasis 發現的關鍵是，Ollama 的 Host 檢查邏輯只在綁定位址是 loopback 時才啟用；一旦綁定成 `0.0.0.0`，這層檢查會被整個跳過，只剩下 CORS 這一道防線。而 CORS 擋不住 DNS rebinding：攻擊者把自己控制的網域先解析到自己的伺服器，等瀏覽器建立連線後，再把該網域重新解析回 `127.0.0.1`，由於同源政策是以主機名稱而非底層 IP 判斷同源，瀏覽器不會阻擋後續請求，於是攻擊者的網頁 JavaScript 就能對受害者本機的 Ollama API 發出完整請求。

拿到未授權存取後，最有殺傷力的不是刪模型或塞爆硬碟，而是「模型下毒」。研究團隊一開始嘗試直接用 `/api/create` 注入隱藏的 `system` 欄位，但發現沒用——因為 OpenClaw agent 每次呼叫都會自帶自己的 system prompt，把模型內建的 system 欄位蓋掉。他們因此往下一層走：`/api/create` 還接受一個 `template` 欄位，這是一段 Go template，負責把訊息陣列在推理當下即時轉譯成模型真正吃進去的原始文字，而且是對*包含 client 端 system prompt 在內的所有訊息*都套用。攻擊者可以先用 `/api/show` 拿到模型原本的 template，在裡面插入一段「對每則 system 訊息都額外附加指令」的邏輯再寫回去——原本的工具渲染、特殊 token、角色格式全部保留，下毒過程完全不留痕跡。往後每一次對話，無論 agent 自己送出什麼 system prompt，都會先經過這個被動過手腳的 template，惡意指令因此得以倖存於 client 端每次重置對話都清不掉的位置。從外部看，模型名稱、大小、metadata 全部正常，開新對話也沒有用。

對照 OWASP LLM Top 10，這件事同時踩中 **LLM03 Training Data / Model Poisoning**（雖然嚴格說是推理期的 template 竄改而非訓練資料下毒，但效果等價）與 **LLM02 Insecure Output Handling** 的變形——本質是「基礎設施層的可達性設定，關掉了應用層本來就有的存取控制」，這也是 2024 年 Ollama 那次 DNS rebinding 漏洞（CVE-2024-28224）修補過的同一類問題：把服務暴露在非 loopback 介面上，等於把整個 middleware 防線降級成只剩一層,而那一層剛好可以被瀏覽器繞過。

## 防禦做法

**立即動作**
- 檢查是否有 Ollama 實例綁定在非 loopback 位址：`ss -tlnp | grep 11434`，正常應顯示 `127.0.0.1:11434`，若顯示 `0.0.0.0:11434` 或 `[::]:11434` 就是暴露狀態
- 若必須讓容器連到主機 Ollama，改用 `host.docker.internal`（Docker Desktop）或明確的私有網卡位址，而不是 `0.0.0.0`
- 在 Ollama 前面加一層 auth proxy（Caddy/Nginx + Bearer token），把 `/api/create`、`/api/pull`、`/api/push`、`/api/delete` 這類管理端點限制在受信任來源才能呼叫
- 使用 NemoClaw 的開發者應確認自己的部署是否仍走本機 Ollama 後端，若是，暫時改用雲端推理後端直到官方釋出修補

**長期架構**
- Host header allowlist 是對抗 DNS rebinding 的根本手段，任何要把本機推理服務開放給容器/其他裝置存取的場景，都應該對 Host header 做嚴格比對，而不是只靠 CORS
- 定期用 `ollama pull`/`ollama show` 比對模型 template 的雜湊值，偵測 template 是否被靜默竄改——這是目前少數能發現此類下毒的方法，因為 UI 上完全看不出異常
- 對 agent harness 而言，system prompt 不應該假設自己一定是「最後生效」的指令來源；若推理層可被竄改，agent 端的安全設計需要額外的完整性驗證機制
- 評估 watchlist 中 Invariant Labs、WitnessAI 這類做 agent runtime 監控與 guardrail 的工具，在 agent 輸出異常偏離預期行為時能被獨立於模型本身之外偵測到

## 影響範圍

目前尚未看到 NVIDIA 針對 CVE-2026-65105 發出正式的 security bulletin 或修補版本號；Oasis 表示已在發布研究前先通報 NVIDIA PSIRT。受影響範圍限定在「使用 NemoClaw 且選擇本機 Ollama 推理後端」的開發者，若一律走雲端推理 API 則不受此漏洞影響。這不是 NemoClaw 第一次出現安全問題——今年 4 月的資安公告就修補過沙箱環境變數外洩（CVE-2026-24222）與 SSRF（CVE-2026-24231）兩個漏洞,顯示這類「把 agent 塞進沙箱」的官方工具,攻擊面正逐漸從 agent 本身擴散到它所依賴的推理基礎設施。

如果你的團隊也在用本機 LLM server（Ollama、vLLM 或其他）搭配容器化 agent，這起事件代表兩件事:一是「為了連通性而放寬綁定位址」這個基礎設施決策本身就是攻擊面，二是 agent 自帶 system prompt 這種應用層防線,在推理層被動手腳時完全無效。

## 今日收穫

之前看到的 agent 供應鏈或 prompt injection 案例,大多是在「內容」層面動手腳——惡意 email、惡意 PR、惡意套件。這次不一樣的地方在於,攻擊者繞過了 agent 和使用者之間的所有互動層,直接往下鑽到「模型怎麼把訊息陣列渲染成文字」這一層去下毒。這意味著即使 agent 的 prompt injection 防禦做得再好、system prompt 寫得再嚴謹,只要底下的推理服務本身能被竄改,這些防禦全部形同虛設——安全邊界不能只畫在應用層,推理基礎設施本身也是需要被納入威脅模型的一環。

## 參考資料

- [Drive-By Agent Hijacking: One Website Visit, Persistent Model Poisoning — Cyera/Oasis Security](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent)
- [Nvidia NemoClaw flaw let attackers poison the model behind a developer's AI agent — SiliconANGLE](https://siliconangle.com/2026/08/25/nvidia-nemoclaw-flaw-let-attackers-poison-the-model-behind-a-developers-ai-agent/)
- [A Malicious Webpage Could Poison Your Local AI Model Behind NVIDIA NemoClaw — The Hacker News](https://thehackernews.com/2026/08/a-malicious-webpage-could-poison-your.html)
- [Ollama DNS Rebinding Vulnerability (CVE-2024-28224) — NCC Group](https://www.nccgroup.com/research/technical-advisory-ollama-dns-rebinding-attack-cve-2024-28224/)
- [Security Bulletin: NVIDIA NemoClaw - April 2026 — NVIDIA](https://nvidia.custhelp.com/app/answers/detail/a_id/5837)
