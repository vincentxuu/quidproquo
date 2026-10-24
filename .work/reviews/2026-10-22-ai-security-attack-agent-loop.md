> 本次補測更新（2026-10-22）：下列舊審稿描述屬固定案例版本；本輪新增真模型小樣本的查核記錄插入三節開頭。原獨立交叉審不自動涵蓋新增段落，新段落待主agent最終交叉覆核。

# 2026-10-22-ai-security-attack-agent-loop

2026-10-22。作者原紀錄：`.work/ai-security/full/attack/writing-gate.md`、`claims.md`、`style-scans.log`、`test-results.json`。作者原始執行不冒稱獨立新執行。獨立交叉審者：defense_series，完整閱讀本篇中英與來源正文。審者隨後依主agent明確指派，接手範圍內runner錯誤保存及研究登錄修正；不將自己修補稱第二名獨立者批准。

## post-verify

### 真模型補測查核

已直接讀公開結果 `public/examples/ai-security/model-eval-results.json` 與執行程式。六loop各baseline且conclusion_matches，trace共15工單POST、6health、15audit；vuln每次N1,N2，fixed每次N1,N2,S1。模型看政策不看build；不與固定planner五/四筆混合。 另以純JSON斷言獨立重算各分母與用量通過，不執行模型或HTTP。所有新claim限作者自製實測；官方CLI文件由root完整Exa讀取，讀取範圍見model-eval/docs-note.md，只支持命令/JSONL用途，非模型能力。三次、無精確snapshot/temperature、CLIscaffold、無實付金額與不排名均有中英揭露。


結論：限定主張成立。AutoPenBench/Meta方法正文支持工具、已知起始狀態與transcript，未引用分數。

來源完整性：原source1–5誤在正文H1切斷而只存metadata，已修prepare.py與registry，由現存完整fetch1/2重建全文，不拿搜尋片段補證。另source7保存既有完整Meta方法頁。已讀原文與精確字符數見sources.jsonl；全文抽核與限制見cross-reviews/attack.md。沒有未完整讀的論文數字。

實作：vuln5/fixed4HTTP與4發送前guards實跑吻合；固定planner未宣稱自主模型能力。 獨立覆核共12組mode/build、49真HTTP、37audit與4guard；錯誤負例只對自製合成臨時服務，不測第三方。正文、tldr與description未放大這些結果為真AI成效或雲端已驗收。

本次只檢查文中提出的機制、規範與實作主張，未評估整個AI攻擊領域是否完整。
後續post-review、post-polish已完成，紀錄如下。

## post-review

### 真模型補測結構審查

完整回讀中英10稿，反向大綱為既有概念→固定案例→新模型觀測→重跑方式→限制→練習/參考；已修18/22及8開頭的無模型全稱句，明指analyst-demo.py或attack-runner.py。各篇提供同目錄兩下載、Python3.11/已登入CLI、全新out與repetitions3完整命令；重跑修正版不是原輸出逐位元重現。日期、slug、series、draft不變；無新增圖需渲染。scope三項文字掃描references/process-leak/TW全部exit0；不冒稱本agent已跑全站verify，主agent統一驗收。


結論：教學承諾由具體例子與答案兌現。狀態轉移表足以表分支；4與5請求差異、15秒派送非硬時限都明確；重試練習有答案。

正文定位：

- L23: ## 三個角色不要混在一句提示裡
- L39: ## 跑出兩條不同軌跡
- L55: ## 接模型時要替換哪裡？
- L63: ## 從教學迴圈搬到雲端與 CTF
- L71: ## 練習：同一個 403 要試幾次？
- L75: ## 參考資料

- metadata：中英同date/category/type/order/draft；系列正確語言名稱，四個tags，description已與tldr分開。
- 先備、完整命令、預期輸出、失敗判準與練習答案都有；表格比較控制條件，適合本篇，不硬加SVG。
- CTF/公開平台/自架雲端不是僅本機的範圍；指定實例與規則不外推整站授權；平台步驟未宣稱已操作完成。
- 中英的身份、工單、請求數、模型未測限制與參考資料一致。
- 機械：本審者在最後metadata/正文變更後重跑process-leak/anchored-link、中文TW/register/ledger共42項exit0；未跑全站verify/astro，交主agent最終統一閘門。

## post-polish

### 真模型補測語氣回讀

中文register及ledger掃描均exit0，原始輸出 `/tmp/model-results-article-scans.log`；新增小節以問題/觀察/如何重跑推進，數據集中表格或單一結果段。逐句回讀新段與原結論，保留必要限制並分段，未把評測程序塞進標題/tldr。中英的模型ID、分母、未執行後端、修正版契約與未部署範圍一致。


結論：作者原語域掃描存在；本審者另整篇回讀中英、反向檢查大綱與跨節承諾。中文約1476字，按讀者下一步問題推進，並非來源目錄或研究工作清單。來源指引、供應商事件觀察、自製HTTP範例分清，未堆未讀數據。命令與原始欄位保留英文，其他一般敘述自然中文；長句有具體主詞，範圍限定貼合用到的段落。

最終仍draft true；無commit/push/deploy。獨立審結論與修補後hash見 `.work/ai-security/full/cross-reviews/attack.md`。
