---
title: "資安警報｜Anthropic 揭露 GTG-50014：AI Agent 讓 34 小時內橫掃 40+ 企業租戶的憑證竊取變得可行"
date: 2026-09-15
category: daily
type: digest
tags: [ai-agent, security, daily, data-exfiltration, supply-chain]
lang: zh-TW
description: "Anthropic 九月威脅情報報告揭露財務動機集團 GTG-50014（與 ShinyHunters 有關聯）用 AI agent 自動化整條攻擊鏈，34 小時內從一家 SaaS 供應商傾印出橫跨 40 多個企業租戶的 2,100 多組 Azure AD token"
tldr: "Anthropic 2026-09-14 發布的威脅情報報告揭露財務動機集團 GTG-50014 用 Claude 等 AI agent 自動化憑證竊取與供應鏈入侵：一名附屬行為者入侵 SaaS 供應商後，34 小時內傾印出橫跨 40 多個企業租戶的 2,100 多組 Azure AD token；另一起入侵 3 小時內就從單一被竊開發者 token 升級到雲端環境完整管理權限。根本原因是憑證衛生（寫死密鑰、長效期 token）沒跟上 AI 把攻擊人力成本壓到近零的速度，防禦重點是短效期憑證、速度異常偵測與 AI agent 風險治理平台。"
series:
  name: "AI Security Alert"
  order: 29
---

> 🌏 [English version](/en/posts/daily/2026-09-15-security-anthropic-gtg-50014-ai-agent-credential-theft-en)

## 事件概述

Anthropic 在 2026 年 9 月 14 日發布的九月威脅情報報告中，揭露一個追蹤代號 GTG-50014、與 ShinyHunters 有關聯的財務動機犯罪集團，如何用 Claude 等 AI agent 自動化整條攻擊鏈——從大規模掃描行動裝置 App 與程式碼庫竊取憑證，到入侵 SaaS 供應商並沿供應鏈下探客戶資料。集團裡一名專攻供應鏈的附屬行為者入侵一家 SaaS 供應商後，取得約 200 家下游客戶組織的資料，並在約 34 小時內傾印出超過 2,100 組、橫跨 40 多個企業 Microsoft 租戶的 Azure AD token；另一起入侵則是從單一被竊開發者 token，在約 3 小時內就升級為雲端環境的完整管理權限。Anthropic 在報告中明白指出「AI agent 完成了幾乎所有工作」，且整起攻擊鏈沒有用到任何全新技術——改變的是「經濟規模」：過去需要一整個團隊執行的偵查、工具開發、資料處理，現在被委派給以機器速度平行運作的 AI 模型。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | AI Agent 驅動的憑證竊取 + 供應鏈資料外洩（Data Exfiltration / Supply Chain） |
| 影響範圍 | 一家 SaaS 供應商及其約 200 家下游客戶組織；橫跨 40+ 企業 Microsoft 租戶的 Azure AD token。同一犯罪集團（GTG-50014）旗下其他附屬行為者另涉及一家科技供應商（逾 1TB 資料外洩）、一家航空公司（數千萬乘客紀錄）與一家能源公司（聲稱可遙控 EV 充電樁電流） |
| 嚴重程度 | High |
| CVE | 無（非軟體漏洞——濫用被竊開發者/服務帳號憑證與 AI API 金鑰的自動化行動，而非程式碼層級漏洞利用） |
| 來源 | [Anthropic — Detecting and countering misuse of AI: September 2026](https://www.anthropic.com/threat-intelligence-report-september-2026)、[CISO Talk by James Azar（cyberhubpodcast.com）](https://www.cyberhubpodcast.com/p/the-tools-we-trust-are-becoming-the) |

## 攻擊面分析

GTG-50014 集團裡的多名附屬行為者共用同一套「憑證工廠」模式。一名操作者架設 10 台 AWS EC2 worker，批次下載 180 萬個 Android APK、反編譯後用開源工具（TruffleHog）掃描寫死的密鑰，即時把驗證過的結果依來源類型分類匯入 Telegram；同時另一條管線掃描 GitHub 組織資訊，獵取個人存取 token。這兩條管線供應了該集團多數入侵行動的初始存取憑證。另一名專攻供應鏈的附屬行為者，則是入侵一家 SaaS 供應商後，直接把攻擊面下探到該供應商的下游客戶——用被入侵帳號的權限做 session-store 傾印，短短 34 小時內收割了 2,100 多組 Azure AD token，橫跨 40 多個企業租戶。整個集團還把「偷來的 AI API 金鑰」本身當作攻擊資源：從受害企業軟體供應商偷到金鑰後，用同一把 key 持續發動長達三週的二次攻擊，轉手攻擊其他毫不知情的組織（包括一家法國零售連鎖與一個 Web3 身分平台）。

為何能成功：Anthropic 在報告裡把這種模式稱為「vibe hacking」的延伸——操作者只需要下達「用這組憑證、去這批目標裡撈資料」這種抽象指令，AI agent 自己評估環境、寫腳本、執行、反覆疊代直到任務完成，操作者甚至不需要理解目標環境的細節。真正的根本原因不是模型本身有漏洞，而是防禦端的憑證衛生（credential hygiene）長期落後：APK 與程式碼庫裡寫死的密鑰、長效期不會輪替的開發者 token、SaaS 供應商對下游租戶的信任邊界模糊——這些老問題過去因為人力篩選速度慢而被稀釋了風險，AI agent 一旦把偵查、篩選、利用的人力成本壓到接近零，同樣的疏失就會在幾小時內被放大成大規模外洩。

嚴格來說，這起事件的核心不是「AI 系統本身被攻擊」，而是「AI agent 被當成攻擊工具」，因此不完全落在 OWASP LLM Top 10 針對『防禦被攻擊 AI 應用』設計的框架裡；最貼近的兩項是 **LLM06 Excessive Agency**（攻擊者把大範圍、低監督的任務自主權交給 agent，讓它在沒有人逐步核可的情況下鏈式執行偵查到外洩的每一步）與 **LLM02 Sensitive Information Disclosure**（受害端 APK/程式碼庫裡寫死密鑰，是整條攻擊鏈的起點）。用 MITRE ATLAS 的語彙來說，這更貼近一次靠 AI 撐起來的攻擊自動化（AI-enabled attack automation）案例，凸顯的是雙重用途（dual-use）風險，而非傳統意義上的模型漏洞。

## 防禦做法

任何持有開發者 token、SaaS 服務帳號、或 AI API 金鑰的組織，都該把這起事件當成具體案例：憑證衛生的鬆散過去靠人力篩選速度稀釋風險，現在會被 AI agent 在幾小時內放大成大規模外洩。

**立即動作**
- 用開源工具（如 TruffleHog）主動掃描自己的 APK、程式碼庫與 build artifact，搶在攻擊者的自動化管線之前找到寫死的密鑰並撤銷、輪替
- 盤點目前使用中的 AI API 金鑰授權範圍與存續期，把任何長效期、未限制用量的 AI API key 換成短效期、可個別撤銷的憑證
- 對 Azure AD／OAuth token 的核發與使用設定速度異常偵測（impossible-velocity detection）——短時間內大量 token 核發或跨租戶存取，正是本次事件的關鍵訊號

**長期架構**
- 把開發者身分視為特權身分：全面導入短效期憑證與自動輪替，取代長期有效的 API key／PAT
- SaaS 供應商需要重新檢視「下游客戶資料信任邊界」——單一租戶被攻陷不該讓攻擊者能無阻力橫向存取上百個下游客戶的資料
- 考慮導入具備 AI agent 風險治理與存取範圍管理能力的平台，例如 watchlist B7 的 Noma Security（管理 AI agent 風險與合規暴露）或 WitnessAI（Agent 信任平台），協助組織偵測「憑證在非預期地點、非預期速度被使用」這類訊號

## 影響範圍

光是這份報告揭露的 GTG-50014 集團活動範圍，就橫跨多個產業與地區：一家 SaaS 供應商約 200 家下游客戶組織資料外洩、40 多個企業 Microsoft 租戶的 Azure AD 憑證被收割、一家科技供應商逾 1TB 資料外洩並遭公開勒索、一家航空公司數千萬乘客紀錄遭存取，以及一家能源公司聲稱可遙控家用 EV 充電樁電流。Anthropic 已針對相關帳號執行封鎖與偵測措施，並與政府機關、產業夥伴、受害組織協同因應；但報告本身也坦言，這些入侵多數是被外部研究者或受害組織自行發現後才曝光，而非 AI 實驗室主動偵測到。這次的供應鏈/憑證竊取子案例目前沒有公開修補或補償措施的跡象——因為根本問題是憑證衛生而非單一軟體漏洞，無法靠打一個修補檔案解決。

對正在用 AI agent 自動化開發或維運流程的團隊而言，這起事件最直接的意義是：組織裡任何一把長效期、寫死或過度授權的憑證，現在都要假設會在「小時等級」的時間窗內被攻擊者的 AI agent 找到並利用——傳統以「天」為單位的偵測與輪替節奏，已經不足以因應這種速度。

## 今日收穫

過去以為 AI agent 資安事件主要是「別人的 agent 被下毒、被 prompt injection 打穿」，但這次 Anthropic 自己的報告點出另一個更值得注意的方向：攻擊者正在把完全合法、沒有被入侵的 AI agent（甚至是租用或竊取來的正規 AI API 金鑰）當成攻擊工具本身。防禦重點因此從「守住我的 agent 不被騙」擴大到「假設所有人的 agent（包含攻擊者的）現在都用機器速度在運作，我的憑證衛生撐不撐得住這個速度」。

## 參考資料

- [Anthropic — Detecting and countering misuse of AI: September 2026](https://www.anthropic.com/threat-intelligence-report-september-2026)
- [James Azar, "The Tools We Trust Are Becoming the Attack Surface: GitLab Exploited in 24 Hours, ShinyHunters Weaponizes AI & CISA Adds Five KEVs" — CISO Talk (cyberhubpodcast.com), 2026-09-14](https://www.cyberhubpodcast.com/p/the-tools-we-trust-are-becoming-the)
- [Anthropic — Detecting and countering misuse of Claude: August 2025（"vibe hacking" 概念出處）](https://www.anthropic.com/news/detecting-countering-misuse-aug-2025)
