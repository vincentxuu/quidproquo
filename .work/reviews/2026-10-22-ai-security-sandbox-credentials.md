# 2026-10-22-ai-security-sandbox-credentials

作者自審，2026-10-22。範圍中英兩版；獨立交叉審另見 `.work/ai-security/full/cross-reviews/defense.md`。本報告不冒稱獨立審稿。

## post-verify

結論：限定主張 Confirmed；外部規範/指引由完整正文 single-source 或交叉確認，自製結果由實跑核對。macOS PermissionError真實驗；7+4counterchecks與capability5分開；profile不宣稱全面隔離。

主張定位：

- L23: ## 沙盒與授權，是兩種控制
- L38: ## 先跑作業系統探測
- L56: ## 不要讓工具繼承整個工作階段
- L70: ## 將探測結果變成部署規格
- L78: ## 自我檢查
- L88: ## 參考資料

來源與逐主張映射、完整讀取範圍見 `.work/ai-security/full/defense/research-and-review-note.md` 與 `sources.jsonl`。執行stdout：`demo-regression.txt`、`http-regression.txt`、`sandbox-result.txt`。未測LLM、遠端OAuth、瀏覽器XSS、雲端部署；不以本機結果代替。沒有價格、論文比較或廠商benchmark數字。

本次只檢查文中提出的規範/設計/實作主張，未評估整個AI資安領域的覆蓋是否完整。
後續post-review、post-polish已完成，紀錄如下。

## post-review

結論：作者整篇回讀完成，教學目標由具體例子與答案兌現。先baseline再限制，同listener避免把refused當policy；envmarker非token；部署遷移有驗收。

- metadata：中英date/category/type/order/draft一致；系列按語言登錄；tags4個，description與tldr分開。
- 教學：前三段定位問題與先備；條件→操作→預期→解釋→失敗判準完整；owner-only三工單一致。
- 中英：案例、命令、數量、政策與未測範圍一致；自製fixture不冒充來源實例或LLM輸出。
- 範圍：前置與下一篇內鏈；自架雲端遷移含驗收條件，不限制只能本機。
- 圖型：已讀diagram；控制矩陣表格足夠，沒有SVG與不存在的視覺驗收。
- 機械：process-leak、anchored-link、check:tw、register-scan見scans.json；全站pnpm verify/astro由主agent統一跑，未在此假稱全綠。

## post-polish

結論：作者逐段回讀與反向大綱完成。限定句緊接profile，避免誤抄；表格足夠，不寫Docker實跑。

正文1377個中文字，長度不取代教學驗收。工單開場承諾由正文兌現；章節按讀者問題，不按研究工作量。一般詞用中文，精確程式欄位保留；每篇問題均有答案與可操作命令。仍為draft true，未commit/push/deploy。
