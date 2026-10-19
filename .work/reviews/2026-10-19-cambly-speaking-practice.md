# Cambly 中英專篇審稿

範圍：2026-10-19 Cambly 中英新稿；台灣成人。兩稿 draft:true、系列 order 2。公開資料研究，無帳號登入、結帳交易、付費或實際課堂測試。

## post-verify

已讀官方課型、分鐘、預約、取消課程、續訂與終止方案各頁。逐項核對 Small Groups 21+、Private+/Pro 18+、團體人數、自選老師、Pro專屬老師、教材/錄影/逐字稿/自動回饋、每週一當地03:00重置、不累積、每日60分鐘、12h取消規則與半數返回、返還分鐘當週使用。中英表格及數字對齊；教學段30分鐘分配5+10+10+5=30，明示自訂非官方教案。沒有貼新英文例句或聲稱成效。

價格與退款為高風險，沒有兩個獨立機構證實：以多個官方頁交叉檢查。購課頁台灣情境返回NT$單堂數字，但欠當下所選課型與頻率，不足以成固定報價，正文不刊數字。全球方案說明列Pro，台灣購課抽取只見Small Groups/Private+，正文保留帳號當地購買可用性限制，不宣稱已確認台灣Pro販售。

退款衝突已呈現：購課頁中文購買條款含七天/70%，en-us取消說明為原價重算使用期間。未推定兩入口適用地區/付款管道相同，也未選一條當全區規則；正文給結帳保存與書面問指定日期退款金額的具體動作。停止續訂保留至到期、提前解約客服辦理與課時失效分開寫。未驗：帳號實際checkout、客服回覆、個別支付管道與台灣適用退款法律，不寫成保證。

社群主文全文三篇：2021 PTT暫停Cambly、2022 Dcard正負體驗、2020 PTT選師。首篇雙平台推薦連結、Dcard舊促銷均揭露，第三篇取得主文未見推薦碼。Dcard搜尋日期與fetch日期不同，只採年份。2020主文兒童片段不納入成人結論。舊老師名單/時段/舊價格不當成現行資料。使用自述限備課、說話比例、修正方式線索，不認定整體品質或學習因果效果。

本機Groundlane成功讀多頁，後續bounded請求IncompleteRead；parent查明程序Unhandled Socket write EPIPE崩潰。依inventory改Exa公開頁fallback，來源回傳與backend/status/truncated保存在sources.json，差異記evidence.md；搜尋摘要只作發現，非全文查證。Exa plan文末截在Pro段，採用資訊位於已取得表格與主文，不憑未取得文字補結論。

## post-review

讀者任務：台灣成人判斷Cambly課型、時間成本與訂閱風險，帶旅遊澄清任務試課。段落依適配→課型→購課比較→分鐘/預約→老師教材→社群→任務→退出→續買判準；不是其他平台壓縮比較。連結總覽與NativeCamp，首次品牌有官方inline link。外部數字/政策在原段有來源，文末覆蓋全部來源，英文中文來源註in Mandarin。兩語逐節對齊；不把台灣讀者文翻成美國報價。

targeted references、post-quality、process-leak、check:tw均通過。首次references/quality用多餘--被當路徑，修正指令後正式成功，沒有繞過檢查。完整全站pnpm verify由parent統一跑；這裡不宣稱全站驗證或發布完成。

## post-polish

已讀skills與完整兩稿，中文register掃描35段、長句1、但書3/35=8%、模板轉折0、一般英文術語0；phrase ledger無命中。長句初有4處，已拆解選課、負面社群、退款敘述；留存一處含問句，實際閱讀有停頓。價格資訊集中比較欄位表，不在正文塞未具選項數字。自訂任務四項完成判準、課前資訊、課後錄音與陌生追問均有可執行動作；英文人工看過自然度，沒有聲稱實際試課。無必修未解項；購課退款差異是讀者須確認的產品限制，非待補占位字。

Parent final language pass: removed self-referential research-process phrasing from price/referral paragraphs while retaining the same purchasing conditions and incentive uncertainty in both languages. Source verification is recorded here rather than in the opening.

Parent independent acceptance: reviewer rechecked three core official-policy claims per platform against saved source bodies; no teacher/student policy mixup or bilingual rule mismatch. Final italki PTT quotations are paraphrases supported by saved full main posts; incentive disclosures and confirmed-future-lesson/no-login exceptions are aligned. No further factual corrections required.

Final integration: six touched drafts (two new bilingual guides plus overview pair) passed references, post-quality, check:tw, process-leak, series-plan, series-order, and lang-parity. Full pnpm verify completed after final article edits: types/lint/grades and other checks passed; references/post-quality/series-plan failed due to concurrent climbing drafts. Full references and quality reruns each reported16 missing-link errors, all in climbing files. See .work/english-speaking/batch2-checks.log; full failure output /tmp/english-speaking-batch2-full-{references,quality}.log. No checks weakened; no commit/push/publication performed.
