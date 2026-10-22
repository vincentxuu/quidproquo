---
title: "讓 AI 整理事件時間線，別替缺失紀錄編故事"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "zh-TW"
description: "把同一工單事件的原始時間、收集時間、事件 ID 與來源留下來，從真 HTTP audit 與合成缺口案例產出可回查時間線。"
tldr: "先保留來源與時區，再排序與關聯請求。工具讀到一張工單只能證明那次讀取；摘要、缺失日誌與修補後拒絕，都不能替代原始證據。"
difficulty: "進階"
draft: true
series:
  name: "AI 資安實戰"
  order: 19
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-incident-timeline-en)

客服助理說：「我已匯出所有客戶工單。」API 紀錄卻只有 Alice 讀到一張 S-1。AI 幫你把它寫成「全面外洩」時，流暢的摘要反而把事件範圍放大了。

事件時間線是把不同來源的觀察按時間放在一起，每個結論都能回到原始紀錄。這篇接續[修補驗證](/posts/ai/2026-10-22-ai-security-patch-verification)，需要會讀 JSON 與執行 Python。做完會留下帶事件 ID、原始時區、查詢範圍及待查問題的時間表。先用真 HTTP 紀錄熟悉欄位，再用合成日誌練習延遲收集與缺口；沒有呼叫模型。

## 先問哪些來源能證明哪件事

[OWASP 日誌指引](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)要求事件能回答何時、何地、何人與何事，並區分事件時間和寫入日誌時間。它也提醒不同信任區的紀錄可能缺失、遭偽造或被重放。

工單 API 能記錄它交出了哪個物件；助理對話能記錄它說了什麼；收集器能說明哪些時段缺日誌。三者放在一起後，仍要保留來源，不能合成一個不知出處的「系統表示」。

| 欄位 | 用途 | 本例 |
|---|---|---|
| target/build/event_id | 定位某個執行版本的事件 | 真服務各次重啟會重置 event_id |
| timestamp | 事件原始時間與時區 | `09:00:01+08:00` |
| received_at | 收集時間，存在才填 | `01:00:06Z` |
| actor/resource/action | 哪個身分對哪個物件做什麼 | alice / S-1 / read_ticket |
| request_id | 關聯同一請求的事件 | 合成 R-2 |
| status/returned_ticket_id | 工具實際結果 | 200 / S-1 |

## 先取得真正走過 HTTP 的紀錄

下載[工單服務](/examples/ai-security/ticket-lab.py)、[HTTP 擷取器](/examples/ai-security/analyst-http-capture.py)、[分析程式](/examples/ai-security/analyst-demo.py)及[真值檔](/examples/ai-security/analyst-truth.json)，放在同一資料夾。使用 Python 3.11 以上。以下在該資料夾執行：

```bash
python3 analyst-http-capture.py --out http-run-1
python3 analyst-demo.py timeline --input http-run-1/vulnerable-v1-audit.json > http-timeline.json
```

擷取器啟動兩個本機版本，每版送出九次真 HTTP 讀取，取得 audit 後關閉程序；不接觸外部目標。預期摘要是 `http_requests_checked: 18`、`builds: 2`。輸出目錄必須不存在，重跑用 `http-run-2`，避免覆蓋原始證據。

vulnerable-v1 的 Alice/S-1 回 200 且 trace 有 S-1 合成內容；fixed-v1 回 403 且無 text。audit 的 `returned_ticket_id` 可連到 trace 的實際回覆。真服務沒有 request_id、received_at 或收集缺口欄位；分析器不會替它補出來。

事件編號在每個服務程序從頭開始，所以跨版本引用要寫 target、build 與 event_id 的組合。單看 `evt-000003` 不能知道是修補前的讀取，還是修補後的拒絕。

## 用合成延遲案例練習排序

接著不帶 `--input`，分析器會使用程式內固定的合成事件，和剛才的真 HTTP 檔分開。

```bash
python3 analyst-demo.py timeline > synthetic-timeline.json
```

檔案原始順序故意亂放。程式將 timestamp 轉成 UTC，保留原欄位，再按時間排序。預期順序是 E-001 至 E-005。

| UTC 事件時間 | 事件 | 能支持的觀察 |
|---|---|---|
| 01:00:00 | E-001，API | Alice 正常讀 N-1 |
| 01:00:01 | E-002，API | Alice 的 R-2 取得 S-1 |
| 01:00:02 | E-003，助理 | R-2 的對話宣稱匯出所有工單 |
| 01:05:00 | E-004，API | fixed-v1 拒絕 Alice 讀 S-1 |
| 01:06:00 | E-005，收集器 | 01:06 至 01:07 有收集缺口 |

E-002 的原時間是台灣常見的 `09:00:01+08:00`，換成 UTC 就是 `01:00:01Z`。它到 `01:00:06Z` 才收到。用 received_at 排序會把助理說話放到資料讀取之前；保留兩個時間才能看出是延遲收集。

程式拒絕沒有時區的 timestamp，不會自行猜它是台北時間。相同時間的事件會按 ID 穩定排序，那只讓輸出可重現，沒有證明因果先後；跨系統時鐘偏差也要另記，不能只靠相差一秒認定因果。

## 讓摘要每一句都附證據

對照表可以改寫成短調查紀錄：E-002 支持「Alice 取得 Carol 的 S-1」，超出 owner-only 政策。E-003 支持「助理宣稱更大範圍」，沒有全部匯出的 API 或下載紀錄，因此目前只確認一張工單讀取。

E-004 證明該次修補後請求被拒絕，不能證明已取出的資料被收回。E-005 表示後段紀錄不完整，01:06 至 01:07 是否另有讀取仍未定。接下來該查的是原始 API 備份、資料庫存取紀錄及出口傳輸紀錄，而不是請模型把故事寫完整。

可以把任務交給助手：「每句附事件 ID；區分觀察、推論、待查；未找到證據時列出查詢時間窗、來源與缺口。」但輸出仍需人回查原始紀錄。[SIABench 的事件分析研究](https://arxiv.org/html/2603.06422v1)把錯誤指令、淺層調查、幻覺及問題相依失敗分開分析；它假設所需證據完整可取得，不能拿其任務結果證明缺日誌的產品也能可靠結案。

## 搬到產品紀錄，不必搬整份客戶資料

對有授權的雲端產品，把 `TimeGenerated` 或服務 event_time 對到 timestamp；收集器入站時間對 received_at；使用者 object ID 對 actor；API trace ID 對 request_id；資源 ID 對 resource。先留原欄位與轉換表，再增加統一欄位，避免失去回查入口。

下載的公開訓練資料也能用同一份對照表，先核對其時間格式與擷取區間。PCAP 沒有應用身分時就標缺，不能由 IP 直接猜 Alice。只提供摘要的資料，無法完成相同強度的物件讀取證明。

日誌本身是敏感資料來源。本文僅用合成人名與工單；真實環境在組織允許的環境保存原件，對外只交遮蔽版本。不要為了讓 AI 分析方便，把存取憑證與完整客戶內容寫進 audit。

## 自我檢查：少了什麼，會改變判斷？

只有 E-003 能確認全面外洩嗎？答案：能確認助理說過這句話，還不能確認動作成功。

E-005 後沒發現新紀錄能寫「沒有後續攻擊」嗎？答案：該時間窗收集不完整，應標未定並補查來源。下一篇將用這個差別決定哪些告警可以結案、哪些要升級。

## 參考資料

- [OWASP：Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)：事件欄位、時間同步、日誌保護與缺失。
- [SIABench：Before You Hand Over the Wheel](https://arxiv.org/html/2603.06422v1)：2026 年事件分析評估，方法與假設見 II、III、V 及附錄 C。
- [下一篇：AI 說是誤報，能直接關掉嗎](/posts/ai/2026-10-22-ai-security-alert-triage)。
