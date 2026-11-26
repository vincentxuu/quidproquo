# 2026-10-22-ai-security-identity-and-authorization 中英審稿紀錄
日期：2026-10-22。稿件為本機draft true；未commit／push／部署。

## post-verify
逐條查證與來源定位：`.work/ai-security/batch-1/research/research-note.md`、`authorization-evidence.md`；獨立核對見 `.work/ai-security/batch-1/reviews/independent-review.md`。
principal來源、租戶資格、細粒度授權、每次檢索過濾對應Microsoft正文；MCP鎖2025-11-25 revision。owner-only明確自製政策，不泛化。IANA完整正文已讀，狀態碼只是函式欄位；無HTTP或模型實測。Python9案例已實跑且獨立重跑；允許案例對照正確資料，拒絕案例僅error欄位。存在性資訊／認證替身／旁路查詢限制明說。

## post-review
獨立全文審查四檔與程式，必修修正後複核無新必修。中英meta、系列0/1、政策、預期結果、同語互鏈與跨語連結一致。讀者目標、具體例子與練習判準對齊。機械驗證結果依首批verify.log，不以內容審查取代品質閘門。
完整Python檔可下載，無新依賴；正文關鍵程式是節錄，不冒充完整檔。前置Python3.11以上；固定session資料清楚標教學替身。正常功能與安全拒絕並驗；自測改共享政策有答案。政策矩陣比另加圖更清楚。

## post-polish
中文register-scan、phrase-ledger與人工從頭回讀；英文獨立從頭回讀。模板化轉折與一般英文堆疊零命中，少量長句按意思判讀，未引入虛構台灣經驗。正文不搬研究過程；技能執行／查核路徑留本報告。
保留必要的認證替身與有限驗證範圍，未為求簡短刪限制。一般中文敘述先解釋，再引principal等程式欄位。

## 第2批導覽回填（2026-10-22）
僅補第2/3篇閱讀連結與中英同步更新紀錄，date/slug/order與原有外部主張不變。本輪獨立reviewer核對兩語導覽和更新紀錄；不冒稱全篇重新查證。新鏈結及meta驗收見batch-2/delivery-check.log。
