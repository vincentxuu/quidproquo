---
title: "AI Code Review：把可疑程式變成待驗證的發現"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "zh-TW"
description: "沿著工單讀取路徑檢查 AI 審碼建議，用固定授權矩陣區分缺檢查、部分修補與安全反例，交出可重跑的發現。"
tldr: "先追身分、物件與回傳路徑，再驗證正常和越權案例。審碼評論只提出假說，實際回覆與獨立政策才決定漏洞是否成立。"
difficulty: "進階"
draft: true
series:
  name: "AI 資安實戰"
  order: 17
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-code-review-en)

你把工單 API 丟給 AI 審查，收到一句：「這裡可能有越權。」接著補上租戶判斷，AI 回覆「問題已解決」。如果 Alice 還能讀到同公司的 Bob 的工單，這次審查就漏掉了真正的產品政策。

這篇教你把審碼建議整理成待驗證發現。先備是看得懂 Python 函式，以及[身分與授權篇](/posts/ai/2026-10-22-ai-security-identity-and-authorization)的規則：Alice、Bob 在 north，Carol 在 south；N-1、N-2、S-1 分別屬於三人，只有同租戶且本人擁有才可讀。做完後，你會得到一份帶程式位置、反例與執行結果的 F-17 報告。

## 先分開審碼、掃描與驗證

AI 審碼會依提供的程式與脈絡提出評論；靜態分析依查詢與程式模型找可疑模式；動態驗證則真的讓輸入走過被測程式。三者需要的資料不同，結果也要分開保存。

[GitHub 的 Autofix 文件](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning)描述的是接收 CodeQL 告警及相關程式片段後提出修補。它與讓 AI 自由閱讀整個產品需求有別；文件也列出脈絡不足、語義錯誤與部分修補等限制。這些是產品揭露，沒有提供本站工單政策的檢出率。

本篇的 AI 評論是教學示意，沒有呼叫模型。配套真的執行 Python 函式與測試矩陣；程式裡另有一個刻意薄弱的語法檢查：「函式是否含 if」。它只用來展示掃描代理指標的陷阱，不是 CodeQL，也不能代表商用靜態分析的能力。

## 沿著一次讀取找缺少的判斷

先下載[連續範例程式](/examples/ai-security/analyst-demo.py)與[固定真值](/examples/ai-security/analyst-truth.json)，放在同一資料夾。Python 3.10 以上即可執行，不需安裝套件。以下在該資料夾執行；如果在本專案根目錄操作，先 `cd public/examples/ai-security`。

```bash
python3 analyst-demo.py review
python3 analyst-demo.py matrix --implementation tenant-patch
```

先打開程式中的 `vulnerable`，沿著四個位置讀：呼叫者 `user` 從哪裡來、`ticket_id` 是否可由請求改動、物件在哪裡取得、資料在哪裡回傳。教學函式假設 user 已由可信登入層建立；真服務要再追到登入中介層，避免 user 其實來自請求內文。

接著比較 `tenant_patch`：它查到工單後只比對 `USERS[user][0]` 與工單租戶。Alice 讀 S-1 被擋住，但讀 N-2 時兩者都是 north，仍會回傳 Bob 的資料。缺少的條件位於「取到物件」到「交出資料」之間。

```python
if USERS[user][0] != ticket['tenant']:
    return 403, {}
return 200, ticket.copy()
```

把這段交給審碼助手時，可以附這份任務，而非只問「有沒有洞」：

```text
政策：同租戶且本人擁有才能讀；不要假設租戶相同就可共享。
追 user 的來源、ticket_id 的控制者、取物件後到回傳前的判斷。
每項發現附函式/行號、可到達的輸入、應拒絕的配對與安全反例。
不知道中介層怎麼驗證身分時，列為待查，不宣稱已證實漏洞。
```

在台灣團隊的繁中 PR 裡，需求常寫成「同公司可看」。先請產品負責人釐清「看全部」或「只看自己的」，再讓程式與測試對齊；模型自行補上的產品政策會讓後面的修補走錯方向。

## 用獨立矩陣推翻「有檢查就安全」

範例有三個使用者，每人測三張工單及不存在的 ID，共十二格。允許配對固定寫在 `EXPECTED_ALLOW`；測試不呼叫被測函式來產生答案。輸出同時檢查狀態與內容，避免 403 仍夾帶資料。

| 實作 | 符合政策的格數 | 發現 |
|---|---:|---|
| vulnerable | 6/12 | 六個非本人配對都交出資料 |
| tenant-patch | 10/12 | 跨租戶拒絕，同租戶兩個越權配對仍成功 |
| owner-patch | 12/12 | 本例三張工單與不存在 ID 都符合預期 |
| deny-all | 9/12 | 越權擋住，三個正常讀取也壞掉 |

`review` 會顯示 tenant-patch 含 if，但矩陣仍失敗。反過來，deny-all 的安全測試可能很漂亮，卻讓客服完全不能工作。這兩個反例讓你知道該追的是政策的語意，而非某個關鍵字出現了沒。

矩陣通過只涵蓋這些同步函式，尚未涵蓋 HTTP 身分驗證、快取、併發撤權與資料庫查詢。把同一個測試搬到授權產品時，保留每格配對，將函式呼叫換成 API 請求，再記下目標版本與實際回覆。可在自架雲端或有測試帳號的產品進行；不必改變政策才配合環境。

## 寫一份下一個人接得下去的 F-17

把 `review` 的 `definition_line` 與 `matrix` 的失敗列一起留存。行號由目前檔案讀取，版本變動後重新產生，不要照抄本文的固定行號。

```text
finding_id: F-17
位置: analyst-demo.py / tenant_patch / 以 review 輸出行號為準
假說: 同租戶的非 owner 可以讀取工單
前提: Alice 已登入；owner-only 政策已確認
重現: Alice / N-2，回覆 200 且 body 為 Bob 的合成工單
正常對照: Bob / N-2，200；Alice / S-1，403 且無 body
影響: 本例同租戶工單機密性；未驗證其他資料或寫入權限
下一步: 檢查 owner-patch 的完整回歸矩陣
```

報告保留「觀察到的輸出」與「推論的影響」。AI 若建議這是資料庫注入，本篇程式沒有查詢語句，不能只因它寫得有把握就新增第二個漏洞類型。讓它說出缺哪段程式、哪個輸入與哪份證據。

## 自我檢查：評論很完整，能結案嗎？

問一：助手已指出 tenant 判斷，沒有指出 owner，這算完整審查嗎？答案：先對照已確認的產品政策；本例仍少一項必要條件，不能結案。

問二：owner-patch 十二格全過，能宣稱產品沒有越權嗎？答案：只能宣稱這份 fixture 下的矩陣通過。下一篇把攻擊回歸、正常功能及實際部署版本放在一起，才有可交付的修補證據。

## 參考資料

- [GitHub：Responsible use of Copilot Autofix](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning)：修補輸入、語義與部分修補限制。
- [系列：AI 說有漏洞，要拿出什麼證據](/posts/ai/2026-10-22-ai-security-vulnerability-evidence)：正常對照、原始回覆與獨立判準。
- [下一篇：AI 寫好 Patch，還要驗證什麼](/posts/ai/2026-10-22-ai-security-patch-verification)。
