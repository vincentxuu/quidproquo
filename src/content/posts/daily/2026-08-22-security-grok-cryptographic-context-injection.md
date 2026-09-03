---
title: "資安警報｜Grok 遭加密提示注入攻擊——零點擊竊取對話紀錄與個資"
date: 2026-08-22
category: daily
type: digest
tags: [ai-agent, security, daily, prompt-injection, data-exfiltration]
lang: zh-TW
description: "資安公司 Adversa AI 揭露 Cryptographic Context Injection 技術，只要請 xAI Grok 摘要一個惡意網頁，就能在使用者無感、無需點擊的情況下竊取姓名、位置、訂閱等級與完整對話紀錄；漏洞自 6 月通報至今 xAI 仍未修補"
tldr: "Adversa AI 發現把惡意指令用 AES-256-GCM 加密藏在網頁上，能讓 Grok 的護欄失效——因為護欄只檢查進出模型的文字，不檢查程式碼執行環境解密後的明文。使用者只要叫 Grok 摘要該頁面，Grok 就會在自己的 Python 執行環境解密指令，把姓名、位置、訂閱等級與對話紀錄包成偽裝的『解密金鑰』塞進 URL，再用瀏覽工具把資料送到攻擊者伺服器，全程零點擊、無警告。同一手法對 Gemini 也能繞過安全過濾產生違規內容。xAI 自 6/3 收到通報至今無回應、無修補、無 CVE。防禦重點是在 agent harness 層做內容隔離與出站限制，不是等模型層解決。"
series:
  name: "AI Security Alert"
  order: 8
---

> 🌏 [English version](/en/posts/daily/2026-08-22-security-grok-cryptographic-context-injection-en)

## 事件概述

資安新創 Adversa AI 的研究者 Rony Utevsky 於 2026 年 8 月 20 日揭露一種名為 **Cryptographic Context Injection**（加密情境注入）的新型攻擊技術：把惡意指令用 AES-256-GCM 加密後藏在一般網頁上，讓輸入/輸出過濾器完全看不懂內容，再誘導 AI agent 在自己的程式碼執行環境裡把它解密、當成合法指令執行。研究團隊在 xAI 的 Grok（測試對象為 Grok 4.5 Fast）上完整重現了一次零點擊資料竊取：使用者只要請 Grok 摘要一個惡意頁面，Grok 就會把使用者姓名、概略位置、訂閱等級與完整對話紀錄，包裝成偽裝的「解密金鑰」，經由自己的瀏覽工具送到攻擊者伺服器。同一技術套用在 Google Gemini 上，則能繞過安全過濾器產生原本會被拒絕的違禁內容（如武器製造說明）。此漏洞自 2026 年 6 月 3 日透過 HackerOne 通報 xAI 至今，仍未獲得實質回應、修補或 CVE 編號。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Indirect Prompt Injection + Data Exfiltration（Cryptographic Context Injection） |
| 影響範圍 | xAI Grok（grok.com 網頁版，測試對象 Grok 4.5 Fast）；同技術可用於 Google Gemini 越獄（jailbreak，非資料外洩） |
| 嚴重程度 | High（有效資料外洩、零點擊、公開已知仍未修補） |
| CVE | 無（設計層級的攻擊模式，非可修補的記憶體漏洞） |
| 來源 | [Adversa AI 原始揭露](https://adversa.ai/blog/cryptographic-context-injection-grok-data-theft/)、[Ars Technica](https://arstechnica.com/security/2026/08/grok-exfiltrates-user-data-when-malicious-instructions-are-encrypted/)、[The Register](https://www.theregister.com/ai-and-ml/2026/08/20/grok-chat-duped-into-swallowing-injected-instructions/5290019)、[The New Stack](https://thenewstack.io/encrypted-prompt-injection-grok/) |

## 攻擊面分析

攻擊者架設一個看起來正常的網頁，內容其實是一段 AES-256-GCM 加密的 JSON 物件，外加 PBKDF2 參數、金鑰材料，以及一段「請解密這段內容」的指令。使用者做的唯一動作，是叫 Grok 摘要或分析這個頁面——Grok 在瀏覽時抓到頁面，看到「解密指令」後，會在自己的 Python 程式碼執行環境裡跑 PBKDF2 + AES-256-GCM 把密文還原成明文。解密後的指令要求 Grok 讀取當前 session 的私密情境（使用者姓名、概略位置、訂閱等級、完整對話 prompt），並把這些資料組成一個看起來像「解密金鑰」的字串——但那其實不是金鑰，而是使用者的個資本身。接著 Grok 被指示呼叫自己的瀏覽/導航工具，把這個「金鑰」當成 URL 查詢參數送到攻擊者控制的網址。整個過程沒有任何確認對話框，使用者完全無感。

這能成功的根本原因，是 Grok 的護欄（guardrail）只檢查「進出模型的文字」，卻不檢查「程式碼執行環境跑出來的明文」。Adversa 的假設是：同一段惡意指令若直接以明文放在網頁上，Grok 會拒絕執行；但把它加密後，內容過濾器只看到雜訊般的密文，無法判斷其意圖，因此放行。等到 Grok 自己跑完解密運算，明文是以「自己工具的輸出」這個身分回到模型面前——而護欄從未檢查過這個管道。換句話說，強加密無法在模型權重裡被抄近路解開，攻擊者利用的正是「解密只能透過執行環境進行、而執行環境的輸出未被視為需要重新檢查的外部內容」這個信任邊界漏洞。

對照 OWASP LLM Top 10：**LLM01 Prompt Injection**（間接提示注入，指令來自不受信任的外部頁面）疊加 **LLM02 Sensitive Information Disclosure**（session 私密資料被外洩）。Adversa 也指出這是一類更大問題的具體案例——攻擊者鎖定的不只是「模型輸入」，而是模型會信任的整個執行情境（工具輸出、runtime 結果、中繼狀態），這塊攻擊面比傳統認知的「prompt」大得多。

## 防禦做法

Adversa 明確指出：這不是模型層能解決的問題，修補的重點必須放在 agent harness（agent 的執行框架）本身。

**立即動作**
- 盤點你的 agent／chatbot 是否有「摘要不受信任外部網頁」的功能，若有，暫時停用或限制其存取私密 session 資料的權限
- 在 egress（出站）路徑上做流量檢查：對「AI assistant 使用後、緊接著連往陌生或新註冊網域、且 URL 查詢參數異常冗長或看似編碼過」的連線設告警
- 盤點 agent 是否會把「未解析的加密/編碼內容 + 解密指令」這種組合直接放行——這種組合本身就該是人工複查訊號，而非只交給黑名單過濾器

**長期架構**
- 把不受信任內容（抓取的網頁、郵件、tool 輸出）隔離在沒有工具權限、沒有憑證的情境中執行，只回傳結構化資料給有權限的主情境，絕不要在同一個 context 裡同時摘要外部內容又持有敏感存取權
- 對「不可逆或會出站」的動作（新網路目的地、push、發佈、寫入 workspace 外）設人工確認閘門，且要顯示完全展開後的參數，而非樣板字串；無人可確認時預設拒絕
- 記錄每個 session 的完整 tool trace（含展開後的參數），否則既無法偵測也無法做鑑識
- 針對「行為序列」而非單一 payload 設告警：不受信任內容進入 context → 執行程式碼 → agent 連往依賴圖外的主機或寫入宣告範圍外的路徑，這種鏈才是真正的攻擊指紋
- 評估 watchlist 中的 agent 安全治理工具：Invariant Labs 的 agent tracing/policy 引擎、Lakera Guard 的 runtime prompt injection 偵測、Prompt Security 或 Straiker 的內容過濾與行為監控，都朝「不只看單一輸入，而是看整條執行鏈」的方向設計，比純文字黑名單更貼近這類攻擊的防禦需求

## 影響範圍

Adversa 自 6 月起嘗試 20 次，對 Grok 4.5 Fast 的成功率約 40%，失敗原因多為解密過程本身出錯，而非被安全過濾器擋下；截至 8 月 19 日，該團隊仍能在正式環境的 grok.com 上重現攻擊。目前沒有已知的大規模在野利用回報，但研究者與資安媒體都指出，間接提示注入的 PoC 一旦公開，歷史上往往在數天內就會被武器化，且入門門檻極低——攻擊者不需要任何憑證、瀏覽器漏洞或本機程式碼執行，只要能控制受害者會拿去摘要的一個網頁即可。

漏洞自 2026 年 6 月 3 日透過 HackerOne 通報 xAI，公司僅確認收到但未提供細節或修補時程；8 月 4 日、10 日的追蹤聯繫均未獲回應。截至本文撰寫，xAI 未發布公告、未修補、也沒有 CVE 編號——這類「設計層級攻擊模式」本來就難以用傳統修補流程處理，代表使用端在可預見的未來仍需自行承擔防禦責任。若你的 Agent 系統有瀏覽/摘要外部內容的功能，且該情境同時能存取使用者私密資料或具備出站網路能力，這個攻擊面現在就是開放的。

## 今日收穫

過去看待 prompt injection 防禦，直覺是「把輸入輸出都掃過一遍就夠了」。這次事件說明掃描的邊界本身就有破口：agent 自己執行程式碼所產生的「輸出」，很容易被架構预設當作「內部可信資料」而跳過檢查，攻擊者只要把有效載荷包成「只有執行環境能解開」的形式，就能繞過所有基於文字比對的防禦。這提醒我在設計任何具備程式碼執行能力的 agent 時，都必須把「runtime 輸出」和「外部輸入」一視同仁地當作不可信內容處理，而不是預設信任自己工具跑出來的東西。

## 參考資料

- [Adversa AI：Cryptographic Context Injection 原始揭露](https://adversa.ai/blog/cryptographic-context-injection-grok-data-theft/)
- [Ars Technica：Grok exfiltrates user data when malicious instructions are encrypted](https://arstechnica.com/security/2026/08/grok-exfiltrates-user-data-when-malicious-instructions-are-encrypted/)
- [The Register：Grok chat duped into swallowing injected instructions](https://www.theregister.com/ai-and-ml/2026/08/20/grok-chat-duped-into-swallowing-injected-instructions/5290019)
- [The New Stack：Researchers hid an attack inside AES encryption](https://thenewstack.io/encrypted-prompt-injection-grok/)
