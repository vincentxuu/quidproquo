---
title: "AI Engineer 面試日練 — 2026-11-15：Behavioral（本週回顧）"
date: 2026-11-15
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：2026 年「你工作中怎麼用 AI 工具」已經跟領導力、衝突處理一樣是標配問題，怎麼講出判斷力而不是只說「AI 幫我做完了」；再回顧這週練過的 ML Fundamentals、Coding、Paper Reading。"
tldr: "2026 年下半年開始，「說一次你工作中怎麼用 AI 工具」已經跟領導力、衝突處理一樣常被問——因為會寫 code 不再是門檻，怎麼用、怎麼抓 AI 的錯才是訊號。今天的故事框架是「用 AI 加速實作，但自己抓出它漏掉的 edge case」：核心不是講「AI 幫我做了什麼」，是講你怎麼 review AI 的輸出、在哪個技術細節上推翻它、省下多少來回。本週回顧 Mon 的 accuracy 失真、Fri 的 GQA KV cache 手刻題、Sat 的 DISCERN 論文，另外週二到週四因故中斷，沒有紀錄。"
series:
  name: "AI Engineer 面試日練"
  order: 88
---

> :globe: [English version](/posts/daily/2026-11-15-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：用 AI 工具加速實作，但自己抓出它漏掉的 edge case

**情境**：你在開發一個 retrieval-augmented 系統的 ranking 模組，用 AI coding assistant 先生成一版相似度計算的實作，想省下手刻的時間。這段程式在你本機的小規模測試資料上跑得很順，但你心裡知道 production 的向量規模跟資料分佈完全不一樣——這正是面試官最愛設的陷阱：AI 給的第一版程式「看起來對」，但有沒有踩到它沒處理過的 edge case，就看你有沒有真的讀懂它寫的東西。2026 年下半年起，「說一次你工作中怎麼用 AI 工具」已經變成跟「說一次你帶團隊處理衝突」一樣標準的行為面試題——因為會不會用 AI 寫 code 已經不是門檻，門檻是你有沒有判斷力知道什麼時候該信任它、什麼時候該自己動手查。

**任務**：你被期待展示兩件同時成立的事：你能有效運用 AI 工具加速產出，不是在抗拒新工具；但你也沒有把 AI 的輸出當成正確答案直接上線，你有能力找出它漏掉或想錯的地方。

**行動**：先講你怎麼讓 AI 產生第一版實作——你給的 prompt 不是「幫我寫相似度計算」,而是先講清楚輸入的資料形狀、regular batch size、以及你預期的時間複雜度上限，讓 AI 一開始就在對的約束裡寫。拿到輸出後，你沒有直接跑測試就收工，而是先自己讀一遍邏輯，你發現它對 zero-norm 向量（例如某筆資料的 embedding 因上游失敗變成全零）沒有做除零保護，而這種髒資料在你們的 pipeline 裡每天都會出現幾筆；你也發現它把整個 batch 的相似度矩陣一次攤平成記憶體，在你們實際的 batch size 下會直接 OOM。接著講你怎麼「追問」而不是「重寫」——你把這兩個問題分別描述給 AI，要求它先解釋為什麼原本的寫法會在這兩種情況下壞掉，再給出修正版，並順手要它幫你補上對應的單元測試（zero-norm 向量輸入、超大 batch 輸入），這樣你不是只靠自己口頭確認，而是有可以重複執行的驗證。

**結果**：量化整個流程花了幾次來回（例如「從第一版到可以上線總共三輪，比我自己從零手刻省了大概一個下午」），抓到幾個 AI 沒處理好的 edge case（兩個：除零、記憶體爆量），以及這段程式上線後的穩定性（例如「上線三週沒有因為這兩類輸入觸發過 alert」）。同時講清楚你從這次經驗抽出的習慣：以後讓 AI 生成任何涉及數值運算的程式，你一定先問自己「這段邏輯在輸入是空的／極端大的時候會怎樣」，這個檢查清單後來變成你 code review 別人 PR 時也會用的習慣。

### 怎麼講這個故事

- **Dos**：把故事的重心放在「你怎麼讀懂並挑出 AI 的錯」，不是「AI 幫我做了什麼」——面試官要聽的是你的判斷力，不是工具多厲害。
- **Dos**：講具體的技術細節（除零、OOM 這類真實會發生的 bug），而不是抽象地說「我有仔細 review」。
- **Dos**：提到你怎麼用「追問＋要求補測試」把 AI 的輸出變成可驗證的東西，這是跟 junior 候選人拉開差距的地方——迭代次數少、每次迭代都更精準，本身就是訊號。
- **Don'ts**：不要把故事講成「AI 全部搞定，我只是點了確認」，這樣面試官會懷疑你有沒有真的看懂程式碼。
- **Don'ts**：也不要走另一個極端說你完全不用 AI 工具——2026 年的面試官反而會覺得你跟現場工作方式脫節。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | 詐騙率只有 0.1% 時 accuracy 為什麼會失真、precision／recall 的業務取捨、ROC-AUC 在極端不平衡下會比實際情況好看，改用 precision-recall curve，取自 Pensero AI Engineer 面試準備指南 | {待自填} |
| Tue | Deep Learning & NLP | {本週二未產出，無紀錄} | {待自填} |
| Wed | ML System Design | {本週三未產出，無紀錄} | {待自填} |
| Thu | LLM & Agent Engineering | {本週四未產出，無紀錄} | {待自填} |
| Fri | Coding | 用 NumPy 幫 Grouped-Query Attention 補上一個 decode step 的 KV cache，練分組索引 `kv_idx = i // queries_per_group` 跟 cache 形狀為什麼是 `(n_kv_heads, …)`，取自 Amazon onsite 面試（經 1Point3Acres 收錄） | {待自填} |
| Sat | Paper Reading | 精讀 DISCERN（arXiv:2611.15729）：企業 agent 記憶的真正缺口不是檢索、是解析——寫入時只保留不合併，讀取時才用導航迴圈判斷回答／更新／澄清／拒答，拒答 F1 0.924 遠勝基線最高 0.802 | {待自填} |

## 下週預告

下週輪替主題不變（Mon ML Fundamentals → Tue Deep Learning & NLP → Wed ML System Design → Thu LLM & Agent Engineering → Fri Coding → Sat Paper Reading → Sun Behavioral），但每天搜尋到的題目和資源都會換新。本週二到週四連續三天沒有產出紀錄，如果你覺得 Deep Learning & NLP、ML System Design、LLM & Agent Engineering 這三個主題是弱項，可以把 `src/data/interview-focus.json` 裡對應的權重調到 2-3，讓 routine 在固定日之外額外加練；目前所有主題權重都還是 1，沒有特別加練哪個。

## 參考資料

- [Companies That Let You Use AI in Interviews and What They're Testing](https://dglearning.substack.com/p/companies-that-let-you-use-ai-in) — 對應今日主題：這篇點出 2026 年 AI Engineer 的 behavioral 面試裡，「說一次你工作中怎麼用 AI」已經跟領導力、衝突這類行為問題一樣常見，以及為什麼迭代次數本身是訊號
- [How to Conduct an Effective AI Coding Interview](https://x-team.com/magazine/ai-coding-interview) — 對應故事「行動」段落：junior 候選人常被 AI 給的方向帶偏，資深 AI Engineer 候選人展現的是守住技術判斷、能抓出 AI 沒處理的部分
- [Engineering Manager Interview Questions: leadership stories under the microscope](https://dev.to/gowthampotureddi/engineering-manager-interview-questions-leadership-stories-under-the-microscope-h7h) — 對應「怎麼講這個故事」中「用具體技術細節取代抽象描述」、建立可重複使用的故事庫的建議，這類 behavioral 面試的故事框架同樣適用於 AI Engineer
