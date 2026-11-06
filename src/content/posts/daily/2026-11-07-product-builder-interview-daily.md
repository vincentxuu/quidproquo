---
title: "Product Builder 面試日練 — 2026-11-07：Technical PM"
date: 2026-11-07
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "Technical PM 面試日練：用 RFC／ADR 把工程團隊的技術分歧收斂成一份可留存的決策紀錄，而不是自己拍板技術細節。"
tldr: "今天的核心框架是 RFC 加 ADR：PM 不裁定哪個技術方案比較好，而是補上商業脈絡、指定 decision owner、把接受的風險寫進可回溯的紀錄；練習題是協調兩位工程師對儲存層遷移策略的分歧。"
series:
  name: "Product Builder 面試日練"
  order: 80
---

> 🌏 [English version](/posts/daily/2026-11-07-product-builder-interview-daily-en)

## 今日主題

Technical PM 面試考的不是「你懂不懂系統設計」，而是你知不知道自己該在哪個高度切進技術對話。Four-Leaf 整理的 Amazon TPM 題庫說得很直白：TPM 的技術輪要測的是「能不能在計畫變成延期之前先找到風險」，不是能不能看懂架構圖。這代表當兩個工程師對技術方案吵起來時，PM 的價值不是跳下去比技術深度，而是知道怎麼把爭議收斂成一份誰都能查的決策紀錄。

## 核心框架速記

### RFC 流程（收斂技術分歧）

| 階段 | 做什麼 | PM 的角色 |
|------|--------|-----------|
| 起草 | 把問題、選項、初步建議寫下來 | 通常由工程師主筆，PM 補商業脈絡 |
| 徵求意見 | 相關工程師、架構師、安全／隱私審查留言 | 確認每個反對意見有被攤開，不是被壓下去 |
| 決議 | 指定 decision owner 簽核 | 確保商業限制（時程、預算）被納入權衡 |
| 存檔 | 留存成可搜尋的紀錄 | 讓六個月後的人看得懂「當初為什麼選這個」 |

### ADR 範本（Architecture Decision Record）

consultevo 整理的決策紀錄欄位，拿來寫 ADR 一樣好用：

1. **Context**：問題背景與限制是什麼
2. **Options Considered**：列出的選項與各自的權衡（不是只寫選中的那個）
3. **Decision**：選了哪個、decision owner 是誰、什麼時候決定的
4. **Consequences**：這個決定帶來的後續影響、接受了哪些風險、什麼時候要重新評估

這兩套工具解決的是同一件事：**技術可行性的判斷權該留在工程端，但誰來收斂、誰來拍板、風險攤開給誰看——這是 PM 該設計的流程，不是 PM 該代替工程師做的技術決定。**

## 今日練習題

### 題目

你是企業文件助手 API 平台的 PM。工程團隊要把儲存層換到新供應商以降低成本、提升可用性，但兩位資深工程師意見分歧：一位主張「一次性全量切換」，風險集中但時程短；另一位主張「雙寫漸進遷移」，風險分散但要多維護兩套系統三個月，而且遷移期間的讀取一致性沒人敢打包票。業務方要在下一個財季結束前看到成本下降。你會怎麼推動這個決定？

(來源: 自擬，整合 Four-Leaf「落後團隊」情境的診斷邏輯與 consultevo PM-engineering 決策紀錄做法)

### 拆解思路

1. **釐清問題**：先問業務方「財季前看到成本下降」是硬性承諾還是期望值——這決定我要不要為了趕時程而承擔更大的遷移風險。
2. **定義關係人**：誰承擔遷移風險（平台團隊）、誰要為一致性問題負責（依賴這個儲存層的下游服務）、誰要為成本時程負責（業務／財務）。
3. **結構化分析**：發起一個輕量 RFC，讓兩位工程師把「一次性切換」和「雙寫漸進」的風險、時程、所需人力寫成可比較的選項，我補上業務限制（deadline 的彈性空間、下游服務對短暫不一致的容忍度）。
4. **提出方案**：指定架構師（不是我自己）作為 decision owner，因為技術可行性的判斷權本來就該留在工程端；最終紀錄裡明確寫出「接受的風險」是什麼、誰要盯。
5. **定義成功**：遷移完成後沒有資料遺失事件、下游服務的錯誤率沒有在遷移窗口超過 SLA、ADR 留存下來讓之後的人不用重新開會吵一次。

### 範例回答（面試時可以這樣講）

> **先把「成本下降」這句話拆開問清楚**：我會先跟業務方確認財季前的成本下降是不是硬性承諾，因為這決定我接下來要不要為了趕時程而承擔更大的遷移風險。同時我會分別找兩位工程師聊，發現他們的分歧其實不是「哪個方案比較好」，而是對「下游服務能不能忍受遷移期間的短暫資料不一致」這個業務容忍度沒有共識——這才是真正該由 PM 補上的 context，不是技術細節。
>
> **接著我會發起一個輕量 RFC，而不是自己拍板**：請兩位工程師把兩個方案各自的風險、所需時間、需要的人力寫成可比較的選項，我補上業務面的限制，指定架構師作為 decision owner。最終選擇雙寫漸進，但把窗口從原本的三個月壓縮到六週，並明確記錄「接受的風險」：遷移窗口內允許短暫讀取延遲，但一致性問題必須 24 小時內有人 on-call 盯著。
>
> **取捨與風險**：這麼做會讓財季末的成本下降時間點往後推兩週，我會提前跟業務方溝通這個取捨，並把 ADR 存檔下來——半年後如果有人問「當初為什麼不選一次性切換」，這份紀錄能直接回答，不用重新開會吵一次。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 問題定義：區分這是技術 trade-off 還是業務優先序 | |
| 關係人：誰承擔風險、誰有決定權（不是只有工程師和業務方） | |
| 框架運用：用 RFC／ADR 收斂分歧，而不是 PM 自己拍板技術細節 | |
| 具體方案：decision owner 是誰、接受的風險寫清楚 | |
| 成功指標：SLA、資料完整性、文件留存 | |
| 加分項：知道 PM 該站在哪個高度——不跟工程師比技術深度 | |

## 今日案例

**Amazon TPM 面試題庫裡的「落後團隊」情境，示範 TPM 的技術高度該怎麼切**

Four-Leaf 整理的 Amazon TPM 面試題庫裡有個經典情境：一個專案有三個工程 team，其中一個 team 落後兩週，卡住其他 team。面試官要看的不是你會不會下去 debug，而是你會不會先問「為什麼落後」——是需求不清、沒預期到的依賴，還是人力不足——因為這三種原因對應完全不同的處理方式，接著評估對下游兩個 team 的衝擊範圍，最後才在 scope、排序、資源、時程四個維度之間提出選項。工程師被問同一個問題時會直接跳進技術細節去 debug，TPM 的角色是在「系統設計」和「專案風險」之間架橋，而不是取代工程師的判斷。

**面試連結**：這個案例可以直接拿來回答「怎麼跟工程團隊打交道」類的問題，示範你知道 Technical PM 該在哪個高度切入——不是比技術深度，而是把風險攤開成可以做決定的選項，再用一份留得住的紀錄收尾。

## 延伸閱讀

- [Technical program manager interview questions, and what they test](https://dev.to/fourleaf/technical-program-manager-interview-questions-and-what-they-test-41lb) — 今日案例「落後團隊」情境與 TPM 系統設計高度的完整說明。
- [How Product Managers and Engineers Work Together: A Decision Workflow](https://consultevo.com/how-product-managers-and-engineers-work-together/) — ADR 欄位設計與決策權責分離的操作模型。
- [OpenAI Product Manager Interview Preparation: Product Judgment and API Trade-Offs](https://prachub.com/resources/openai-product-manager-interview-preparation-product-judgment-and-api-trade-offs) — 延伸練習：併發請求、預算保留與一致性邊界的技術 trade-off 拆解方式。

## 參考資料

- [Technical program manager interview questions, and what they test](https://dev.to/fourleaf/technical-program-manager-interview-questions-and-what-they-test-41lb) — 今日主題開頭引用的 TPM 技術輪定位，以及今日案例的「落後團隊」情境。
- [How Product Managers and Engineers Work Together: A Decision Workflow](https://consultevo.com/how-product-managers-and-engineers-work-together/) — 核心框架 ADR 欄位（Context／Options／Decision／Consequences）與決策紀錄做法的來源。
- [OpenAI Product Manager Interview Preparation: Product Judgment and API Trade-Offs](https://prachub.com/resources/openai-product-manager-interview-preparation-product-judgment-and-api-trade-offs) — 併發請求與預算保留案例，佐證技術 trade-off 拆解的寫法。
