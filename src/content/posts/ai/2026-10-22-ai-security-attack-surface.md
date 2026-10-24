---
title: "AI 如何讀懂目標與整理攻擊面"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, penetration-testing, ai-agent, authorization]
lang: zh-TW
description: "以工單服務的兩筆 HTTP 觀察建立攻擊面，再把同一方法搬到公開訓練平台與自架雲端。"
tldr: "把工單服務的文件與 HTTP 觀察整理成有來源的攻擊面，區分已確認功能、權限假設與下一個最小測試。"
difficulty: 進階
draft: false
series:
  name: "AI 資安實戰"
  order: 4
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-attack-surface-en)

你拿到一個客服工單助理，準備讓 AI 幫忙測試。第一個問題往往是「從哪裡開始？」如果直接問模型「找出所有漏洞」，它很容易列出 SQL Injection、XSS、越權，卻說不清楚哪一條路徑真的存在。

這篇從一個更小的工作開始：把看見的介面、資料與權限關係排在一起，選出下一個值得送出的請求。先讀完[練習環境篇](/posts/ai/2026-10-22-ai-security-experiment-environments)，並準備 Python 3.11。本文的 HTTP 範例會真送請求；AI 分析提示由你交給自選模型，隨附結果是人工編寫的教學範例，沒有聲稱呼叫模型。

## 攻擊面是一組關係

攻擊面可以先理解為「哪些輸入，能經過哪些權限，碰到哪些資產」。客服助理裡，聊天輸入會影響工具參數，工具把工單 ID 送到後端，後端依登入者決定能讀誰的內容。

| 入口與身分 | 可接觸的資源 | 需要確認的邊界 |
|---|---|---|
| Alice 的登入請求 | north 租戶的 N-1 | 正常讀取是否有效 |
| 同一身分換成 N-2 | Bob 的工單 | 是否檢查 owner |
| 同一身分換成 S-1 | Carol／south 的工單 | 是否檢查租戶 |
| 被檢索的工單附件 | 助理的模型上下文 | 附件文字能否改變工具動作 |

前三列先用一般 HTTP 看清楚，第四列才需要模型行為的測試。若連後端權限都沒有查，模型表現再穩也可能留下直接 API 越權。反過來，模型說它可以讀 N-2，不能證明服務真的允許。

[AutoPenBench 的工程文件](https://github.com/lucagioacchini/auto-pen-bench)把工具介面、指令里程碑與最終答案分開，適合拿來理解「有哪些可做的動作」和「是否達成目的」的差別。這裡借用這個設計方向，沒有拿它的歷史結果當作今日模型的能力排名。

## 先抓兩筆最小觀察

下載[HTTP 工單服務](/examples/ai-security/ticket-lab.py)與[攻擊線重播器](/examples/ai-security/attack-runner.py)，放在同一資料夾。不需套件或模型金鑰：

```bash
python3 attack-runner.py surface --build fixed-v1 --out surface.json
```

重播器啟動一個子程序服務，用動態埠送出兩筆請求，最後關閉服務。第一筆 `GET /health` 核對 `target_id` 與 `build`；第二筆以 Alice 讀 N-1。`surface.json` 的 `trace` 保存請求參數、HTTP 狀態與合成回覆，不保存認證標頭。

你應看到 `requests: 2`。`surface` 中「Alice reads N-1」有 `source: step:2`，代表真的觀察過；「Alice reads N-2」仍標為 `hypothesis`，來源只是預先提供的工單規格。**同一份圖裡，已觀察與待測試必須分開。**

若健康檢查的目標或版本不符，程式會在讀取前停止。若正常 N-1 都讀不到，就先修正環境；此時用 N-2 的失敗去推論權限安全，沒有可比的基準。

## 讓 AI 整理，別讓它補端點

把 `surface.json`、你允許測試的端點，以及「同租戶且本人擁有才可讀」交給模型。提示可以這樣寫：

```text
只使用提供的規格與觀察，不送請求。
列出入口、操作身分、資源、可信與不可信欄位。
每個已確認事實附 trace step；推論標成待驗證。
挑一個下一步測試，只改一個輸入。
不要補出沒有文件或觀察支持的新端點。
```

理想輸出是：「N-1 正常讀取；N-2 屬於同租戶的另一人；可用相同 Alice 工作階段只換 `ticket_id`，測 owner 邊界。」如果它說發現 `/admin/export-all`，回查原始觀察。沒有這個端點就刪掉，不能因為名字合理便把它畫成資產。

實際專案還會有網頁、API 規格、工具描述、程式碼與反向代理。來源之間可能衝突：文件說 owner-only，程式只檢查 tenant，回覆又被快取。先保留三個版本的說法，下一步測試要釐清差異，別讓模型挑一個看起來最完整的敘事。

## 搬到公開平台與雲端

具體的延伸練習是 PortSwigger 的 [User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter)。在自己啟動的實驗實例登入，觀察帳號頁的 `id` 參數，記下「登入工作階段 → 可控 ID → 帳號資料」三個節點，再依題目規則換指定的測試對象。題目要求取得指定帳號的 API key；這是該實例的解題產物，別把值交給公開模型或寫進公開文章。

這項平台練習與工單範例不同：使用瀏覽器工作階段和查詢參數，不能把 `demo-alice` 標頭直接搬過去。本文沒有代你完成平台關卡；你的產物是自己實例的觀察表與完成結果。

自架雲端則可以保留相同 HTTP 契約，以 `--base-url` 指向**自己的 HTTPS 靶場**，並指定對應 `--target-id`。先確認版本、合成資料、測試帳號與網路限制；公開可連線不會自動成為測試範圍。重播器不跟隨重新導向，避免把標頭帶往另一個目標。這份範例認證字串是公開 fixture，雲端副本仍需額外的存取控制。

## 練習：哪一筆值得先測？

模型給你三個建議：換 N-2、對不存在於文件的匯出端點測試、因為附件寫「管理員」就把權限標成管理員。你會留下哪個？

答案是先留下換 N-2：它連得到既有端點、已知角色和具體政策，且只改一個輸入。匯出端點缺存在證據；附件中的身分是攻擊者可寫的文字，應畫成不可信輸入。完成這張小表後，下一篇才有足夠條件把「可能有洞」變成能被推翻的假設。

## 參考資料

- [AutoPenBench README](https://github.com/lucagioacchini/auto-pen-bench)：工具參數、里程碑及最終答案的工程設計。
- [PortSwigger：User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter)：指定實驗實例中的可控 ID 與水平越權練習。


接著閱讀[第 5 篇：讓 AI 找漏洞：從線索到測試假設](/posts/ai/2026-10-22-ai-security-vulnerability-hypotheses)。
