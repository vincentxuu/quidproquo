# 2026-10-22-ai-security-attack-surface

2026-10-22。作者原紀錄：`.work/ai-security/full/attack/writing-gate.md`、`claims.md`、`style-scans.log`、`test-results.json`。作者原始執行不冒稱獨立新執行。獨立交叉審者：defense_series，完整閱讀本篇中英與來源正文。審者隨後依主agent明確指派，接手範圍內runner錯誤保存及研究登錄修正；不將自己修補稱第二名獨立者批准。

## post-verify

結論：限定主張成立。兩筆HTTP觀察，step2與hypothesis分開；PortSwigger IDOR全文與AutoPenBench工具/里程碑正文吻合。

來源完整性：原source1–5誤在正文H1切斷而只存metadata，已修prepare.py與registry，由現存完整fetch1/2重建全文，不拿搜尋片段補證。另source7保存既有完整Meta方法頁。已讀原文與精確字符數見sources.jsonl；全文抽核與限制見cross-reviews/attack.md。沒有未完整讀的論文數字。

實作：2/2HTTP每build成立，模型提示未實跑的限制明確。 獨立覆核共12組mode/build、49真HTTP、37audit與4guard；錯誤負例只對自製合成臨時服務，不測第三方。正文、tldr與description未放大這些結果為真AI成效或雲端已驗收。

本次只檢查文中提出的機制、規範與實作主張，未評估整個AI攻擊領域是否完整。
後續post-review、post-polish已完成，紀錄如下。

## post-review

結論：教學承諾由具體例子與答案兌現。開頭解釋攻擊面，來源表→兩請求→模型提示→平台/雲端遷移→練習答案；不讓模型補端點。

正文定位：

- L23: ## 攻擊面是一組關係
- L38: ## 先抓兩筆最小觀察
- L52: ## 讓 AI 整理，別讓它補端點
- L68: ## 搬到公開平台與雲端
- L76: ## 練習：哪一筆值得先測？
- L82: ## 參考資料

- metadata：中英同date/category/type/order/draft；系列正確語言名稱，四個tags，description已與tldr分開。
- 先備、完整命令、預期輸出、失敗判準與練習答案都有；表格比較控制條件，適合本篇，不硬加SVG。
- CTF/公開平台/自架雲端不是僅本機的範圍；指定實例與規則不外推整站授權；平台步驟未宣稱已操作完成。
- 中英的身份、工單、請求數、模型未測限制與參考資料一致。
- 機械：本審者在最後metadata/正文變更後重跑process-leak/anchored-link、中文TW/register/ledger共42項exit0；未跑全站verify/astro，交主agent最終統一閘門。

## post-polish

結論：作者原語域掃描存在；本審者另整篇回讀中英、反向檢查大綱與跨節承諾。中文約1418字，按讀者下一步問題推進，並非來源目錄或研究工作清單。來源指引、供應商事件觀察、自製HTTP範例分清，未堆未讀數據。命令與原始欄位保留英文，其他一般敘述自然中文；長句有具體主詞，範圍限定貼合用到的段落。

最終仍draft true；無commit/push/deploy。獨立審結論與修補後hash見 `.work/ai-security/full/cross-reviews/attack.md`。
