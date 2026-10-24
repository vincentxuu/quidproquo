---
title: "RAG 答對了，也可能洩漏別人的資料"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, rag]
lang: zh-TW
description: "用三個工單驗證檢索隔離、權限版本與快取依賴，練習撤權後再次查詢。"
tldr: "每次檢索都帶可信使用者權限，在資料進入模型前過濾；快取命中與撤權後也要重新驗證資料依賴。"
difficulty: 進階
draft: false
series:
  name: "AI 資安實戰"
  order: 11
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-rag-permissions-en)

Alice 問「退款進度如何？」助理答得很準，連 Bob 的 N-2 退款日期都整理好了。答案正確，系統卻違反了只有工單擁有者能讀的政策。檢索增強生成（RAG）解的是回答依據，沒有自動解決誰能看依據。

讀完這篇，你要能回答：**未授權內容在哪一步被排除，撤權後的舊答案還能不能回傳？** 先理解[登入與授權](/posts/ai/2026-10-22-ai-security-identity-and-authorization)，會看字典與清單即可。這裡不比較向量資料庫，也不需要模型帳號。

## 權限跟著文件切片走

RAG 通常先找相關文件，再把片段交給模型。若只按相似度取前三筆，Alice 的問題可能同時找到 N-1、N-2、S-1。模型看見後才要求它隱藏內容，已經越過資料邊界。[Microsoft 的多租戶 RAG 指引](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)要求每次檢索套用授權過濾，並在依據資料交給模型前完成。

本系列的 tenant 是公司，owner 是工單擁有者。north 專用資料庫只能排除 south，不能排除 north 的 Bob。每個片段至少要能回到可信來源 ID、租戶與權限資訊；不能因切片時丟掉 owner，就改成同公司所有人可讀。

| 呼叫者 | 允許進模型的工單 | 必須排除 |
|---|---|---|
| Alice / north | N-1 | N-2、S-1 |
| Bob / north | N-2 | N-1、S-1 |
| Carol / south | S-1 | N-1、N-2 |
| Alice 撤銷 N-1 權限後 | 無 | 三張都不可讀 |

這張表就是測試規格，不是由模型臨場推理的答案。共享知識庫若有人人可讀資料，應另有明確的公開政策，不能把缺少 ACL 的文件自動視為公開。

## 執行檢索與快取對照

下載[防護範例](/examples/ai-security/defense-demo.py)，需要 Python 3.11 以上：

```bash
python3 defense-demo.py rag
```

預期最後一行：

```text
PASS: 8 deterministic checks; mode=rag; no LLM or network exercised
```

這是檢索授權的函式實驗，沒有 embedding、相似度搜尋或生成模型。三個 `*_context` 案例直接檢查允許片段的 ID；Alice 只能得到 `['N-1']`，不能只看最後答案是否含敏感字。只要 N-2 已進入模型請求，即使回答最後拒絕，也不符合本篇政策。

接著程式替 Alice 建立 `status` 的舊答案，記下 `dependencies: ['N-1']`。撤權後，`revoked_retrieval` 得到空清單；但 `stale_cache_exists` 仍是 true。這個反例揭露了錯誤做法：**撤銷資料庫的讀取權，不會自動刪除記憶體裡的衍生答案。**

## 快取鍵加 user，為什麼還不夠？

只用問題做快取鍵，Bob 可能命中 Alice 的答案。加上 tenant 與 user 可隔離這個問題，卻不會讓同一個 Alice 的舊權限失效。[OWASP 的 RAG 快取指引](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)要求依權限範圍隔離快取，並在來源更新、刪除或權限變更時失效。

範例用授權系統持有的版本 `epoch`，把 Alice 的快取從版本 1 切到版本 2。`epoch_miss` 顯示新命名空間找不到舊項目；`dependency_recheck` 則再次用目前政策檢查 N-1，結果 false，拒絕重用。epoch 不能由模型提供，也不能只是請求附上的舊組織名單。

正式系統還要保存答案真正使用過的所有文件依賴，不只模型選擇顯示的引用。若答案混合了 N-1 與 N-2，刪掉 N-2 的引用不會消除它對文字的影響；保守做法是拒絕整份舊答案，用目前可讀資料重新生成。

## 把撤權定義成能測的時間條件

這支程式是依序撤權、再查詢，沒有證明分散式系統能瞬間撤權。真實服務應先定義承諾：撤權提交後開始的新請求不得取得內容；已在生成中的請求如何處理；政策快取最多容許多久落後。每個承諾都需要對應測試。

可以在檢索前檢查一次，準備回傳前再檢查依賴；但兩次檢查之間仍有競態。資料若要求嚴格的撤權順序，需讓政策變更與回傳准入有協調機制。串流已送出的文字無法收回，不能以最後一個檢查宣稱前面已送出的內容受到保護。

政策服務無法回答時，受限資料應停止提供，而不是沿用舊成功答案。正常無權資料與政策查詢失敗也要分開記錄，否則「沒有搜尋結果」會掩蓋授權服務故障。

## 搬到實際檢索服務

在自架雲端，把相同三帳號、三工單放進真正索引，讓請求走實際安全過濾器。檢查模型請求中的文件 ID、回傳答案與引用連結各自的授權；下載原文端點也必須重新檢查。避免完整內容進一般日誌，使用受限的測試擷取與合成資料核對。

再暖好快取、撤銷 Alice 的 N-1，重問相同問題及意思相近的問題。後者可發現語意快取繞過精確字串失效的問題。權限更新未同步到所有節點，或備援節點仍回舊答案，都算未達到先前定義的撤權承諾。

## 自我檢查

1. 只做到每公司一個索引，能滿足本文 owner-only 政策嗎？
2. 撤權後檢索是空的，但舊摘要仍回傳，問題在哪裡？
3. 模型沒引用 N-2，可以把 N-2 從答案依賴刪掉嗎？

答案：第一題不能，Alice 與 Bob 還需要使用者層過濾。第二題是衍生資料的回傳路徑沒有套目前權限。第三題不能，依賴來自實際生成輸入，不由展示引用決定。今晚可以先替自己的系統增加「暖快取→撤權→再次提問」這一個案例。

接著讀： [工具能呼叫，不代表這次動作有權執行](/posts/ai/2026-10-22-ai-security-tool-authorization)。

## 參考資料

- [Microsoft: secure multitenant RAG](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)
- [OWASP: RAG Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html)
