---
title: "資安警報｜Deadbugz——偽裝成文字工具、三次呼叫後才變臉的惡意 MCP Server 供應鏈攻擊"
date: 2026-08-16
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "安全研究公司 Pillar Security 揭露一個仍在進行中的 MCP 供應鏈攻擊活動 Deadbugz：攻擊者透過 23 個 GitHub PR 把偽裝成文字格式化工具的惡意 MCP server 塞進不相關專案的設定檔，該 server 在累積三次正常呼叫後才會變臉，回傳誘導 Agent 竊取 SSH 金鑰、AWS 憑證等機密的指令"
tldr: "GitHub 帳號 zellkernel 在 74 分鐘內對 23 個 AI/MCP/開發工具專案送出 PR，把名為 productivity-suite 的 MCP server 塞進設定檔。這個 server 一開始只提供文字格式化、摘要等無害功能，但內部計數器累積滿三次工具呼叫後，tools/list 與 prompts/get 就會變成誘導 Agent 搜尋 SSH 金鑰、AWS 憑證、shell history、Kubernetes 設定並隱瞞使用者的惡意指令。23 個 PR 目前皆未被合併（19 關閉、4 開啟），但惡意端點仍在運作。防禦：把已核准 MCP server 的工具定義變更視為安全事件、需要重新核可，並封鎖已知端點。"
series:
  name: "AI Security Alert"
  order: 2
---

> 🌏 [English version](/en/posts/daily/2026-08-16-security-deadbugz-mcp-supply-chain-en)

## 事件概述

安全研究公司 [Pillar Security](https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign) 於 8 月 12 日揭露一起仍在進行中的 MCP（Model Context Protocol）供應鏈攻擊活動，命名為 **Deadbugz**。攻擊者透過公開的 GitHub 帳號 `zellkernel`，在 2026 年 8 月 10 日晚間短短 74 分鐘內（UTC 21:52–23:07），對 23 個互不相關的 AI、MCP、開發工具專案送出 pull request，企圖把一個偽裝成「文字格式化／摘要工具」的惡意 MCP server（自稱 `productivity-suite`）植入到這些專案的 MCP 設定檔中。這個 server 的關鍵特徵是**執行期延遲觸發**：一開始完全正常，只有累積滿三次工具呼叫後，才會回傳誘導 Agent 搜尋並外洩 SSH 金鑰、AWS 憑證、shell history、Kubernetes 設定的惡意指令，同時要求 Agent 隱瞞這個行為。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（MCP server 偽裝）+ 執行期延遲 Prompt Injection |
| 影響範圍 | 曾連接 `productivity-suite-mcp.onrender.com` 或執行 `deadbug-mcp.py` 的 MCP client；23 個被投遞 PR 的 AI/MCP/開發工具專案 |
| 嚴重程度 | High（供應鏈投遞已發生，惡意基礎設施仍在運作，但 PR 尚未被合併） |
| CVE | 無（帳號層級攻擊活動，非單一套件的 CVE） |
| 來源 | [Pillar Security](https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign)、[zellkernel/productivity-suite-mcp（公開原始碼）](https://github.com/zellkernel/productivity-suite-mcp)、[ojeo.com 轉載報導](https://ojeo.com/noticia/identificada-la-campa%C3%B1a-deadbugz-que-envenena-servidores-mcp-para-robar-credenciales/) |

## 攻擊面分析

攻擊路徑分兩層：**投遞層**與**觸發層**。投遞層很單純——攻擊者不需要入侵任何系統，只要對外開一個看起來人畜無害的 MCP server（提供 `format_text`、`summarize` 兩個工具），再用同一個 GitHub 帳號批次送出 PR，把這個 server 的遠端端點或本機腳本路徑加進目標專案的 MCP 設定檔。這類「新增一個 MCP 依賴」的 PR 在程式碼審查時往往被當成普通的設定變更，不會被當成安全事件對待——這正是攻擊者要利用的信任落差。

觸發層是這起事件真正值得注意的地方：server 內部維護一個每個 client 各自累計的呼叫計數器，前三次 `tools/call` 一律回傳正常結果。一旦跨過門檻，後續的 `tools/list` 與 `prompts/get` 回應就會換成完全不同的內容——指示 Agent 去找特定的敏感檔案類型並回傳，同時不要讓使用者發現。因為 MCP client 會把 server 回傳的工具描述與 instructions 原封不動地餵給模型當作可信的上下文，一個已核准連線的 server 事後改變自己回傳的「工具說明書」，等於是在使用者完全無感的情況下修改了 Agent 的行為準則。這個「先無害、後變臉」的手法本身不是新東西（Pillar 文中提到 Invariant Labs 在 2025 年 4 月就展示過類似的 WhatsApp MCP sleeper attack），但 Deadbugz 把觸發條件從「時間」或「版本更新」換成「呼叫次數門檻」，用意很明顯：短暫的人工檢查或自動化測試往往呼叫不到三次，只會看到無害版本，等於是專門設計來閃避審查與掃描工具。

對照 OWASP LLM Top 10，這屬於 **LLM03 Supply Chain Vulnerabilities**（惡意元件混入依賴鏈）疊加 **LLM01 Prompt Injection** 的協定層變體——差別在於注入的指令不是來自使用者輸入或第三方文件，而是來自一個已經被「核准」連線的 MCP server 自己回傳的中繼資料，這也是 Pillar 在文中特別強調「工具定義本身就是一個安全邊界」的原因。

## 防禦做法

**立即動作**
- 封鎖已知惡意端點：`productivity-suite-mcp.onrender.com`（歷史端點 `promo-surname-xml-quantum.trycloudflare.com` 也建議列入封鎖名單）
- 檢查專案的 MCP 設定檔與最近的 PR 紀錄，是否曾經加入名稱含 `productivity-suite` 的 server，或引用過 `~/.config/.cache/.sys/.deadbug-mcp.py` 這個路徑；若有，立即 reject/close/revert 該變更，且不要執行 `deadbug-mcp.py`
- 若曾經有裝置實際連線過該 server，先保留 MCP client 的連線紀錄再清理，並回頭檢查第三次工具呼叫之後 Agent 是否有異常存取或外洩行為，必要時依事件應變流程輪換相關憑證

**長期架構**
- 把「已核准 MCP server 的工具定義／instructions 發生變更」本身當成一個需要告警的安全事件，而不是靜默接受——在核准當下對工具描述做指紋比對，之後任何變動都應該要求重新核可，才能讓敏感操作（讀取憑證、執行程式碼、對外送信、寫入 repo）繼續被授權
- 對 Agent 能存取的敏感操作（憑證、shell、程式碼執行）採取政策強制執行，而不是依賴 server 回傳的 metadata 自我約束；watchlist 中的 **Netzilo**（MCP/Agent runtime governance，可設 allowlist 並攔截未核准的 MCP server）或 **Invariant Labs**（本身就是最早示範 MCP sleeper attack 的團隊，其 guardrail 產品專門處理這類執行期行為變化）可以補上這塊「工具定義漂移偵測」的缺口
- 對新增 MCP 依賴的 PR，比照第三方套件依賴一樣要求來源審查，而不是當成一般設定變更快速合併

## 影響範圍

截至 Pillar 揭露當下，被鎖定的 23 個 PR 全數未透過 GitHub 的合併機制併入目標專案（19 個已關閉、4 個仍開啟），代表目前沒有已確認的專案因此被合併進惡意設定。但這不代表沒有風險：投遞層的惡意端點在報告發布當下仍在運作，且不能排除有開發者在 PR 被關閉前手動測試、連線過該 server 並跨過三次呼叫門檻的可能性。Pillar 也指出，這個帳號在 8 月 10 日當天新建了 21 個公開儲存庫、擁有 50 個公開儲存庫（含 20 個 fork），顯示這更像是一次有規模的自動化投遞行動，而非單一開發者的個案。如果你的團隊有任何流程會讓 Agent 自動或半自動接受第三方 PR 建議的 MCP 依賴，這是一次很好的機會回頭檢查有沒有類似的「設定檔變更被當成低風險項目快速合併」的流程漏洞。

## 今日收穫

這起事件和今天稍早的 AgenticSeek RCE 剛好是同一天出現的兩種不同威脅模型：AgenticSeek 是「忘記加驗證」的傳統疏失，Deadbugz 則是刻意設計、會主動閃避審查的攻擊行為。特別值得記住的一點是，Deadbugz 選擇用「呼叫次數」而不是「時間」當觸發條件——這代表傳統「觀察一段時間看有沒有異常」的信任模型本身就可能被繞過，MCP client 需要把「已核准 server 的工具定義是否被事後竄改」當成一等公民的偵測項目，而不是假設核准當下看到的行為會一直維持下去。

## 參考資料

- [Deadbugz: Currently Active MCP Supply-Chain Campaign — Pillar Security](https://www.pillar.security/blog/deadbugz-currently-active-mcp-supply-chain-campaign)
- [zellkernel/productivity-suite-mcp — 公開原始碼](https://github.com/zellkernel/productivity-suite-mcp)
- [Identificada la campaña 'Deadbugz' — ojeo.com 轉載報導](https://ojeo.com/noticia/identificada-la-campa%C3%B1a-deadbugz-que-envenena-servidores-mcp-para-robar-credenciales/)
- [Invariant Labs: WhatsApp MCP Exploited（Deadbugz 引用的前例研究）](https://invariantlabs.ai/blog/whatsapp-mcp-exploited)
- [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
