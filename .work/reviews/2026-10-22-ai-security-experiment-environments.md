# 2026-10-22-ai-security-experiment-environments 中英審稿紀錄
日期：2026-10-22；draft true，本機交稿，未commit／push／deploy。
作者自審：`.work/ai-security/batch-2/environments-self-review.md`。
獨立審閱：`.work/ai-security/batch-2/reviews/independent-review.md`，必修已解決。

## post-verify
PortSwigger Academy/指定Lab、Stanford Cybench、Meta雲端靶場、HackerOne safe-harbor及現行CoC都有完整一手正文，讀取記錄在environments-evidence.md與research/。只談方法／平台規則，不作法律保證或模型成功率。
原manifest與正文把Bob/Carol的tenant及owner寫反，已回到共用案例並逐語核對。Python16案例、額外獨立30個異常enum/section探測與CLI負例通過。forbidden automation+automated mode精確FAIL且exit1；檢查不連線，也不驗授權真偽／環境安全／可重現真實性。

## post-review
逐篇中英完整回讀，讀者先備、目標、例子、可複製命令、預期輸出、失敗判準與練習答案對齊。兩語meta、篇序、政策、資料、檔名、案例數與範圍一致。表格比再畫框箭頭圖更清楚，無diagram fence。
四種環境皆可選；CTF採自己的題目與判準，不要求移植工單，不將完成題目外推租戶隔離。本機只是最小重現路徑。補可操作負例，禁止只改許可欄讓檢查變綠。

## post-polish
作者與獨立reviewer皆完整回讀中英；register/ledger、check:tw及process-leak記錄在batch-2。沒有研究日誌搬進門面；欄位與專名保留必要英文，一般敘述用中文。必要範圍限制保留而不逐句堆歸因。
導言改「可供重跑的環境紀錄」，避免比preflight實際能證明的更強；身分名單與場景全文同步。

機械閘門與交付檔案依 `.work/ai-security/batch-2/acceptance.md` 及verify.log實際結果，不把內容審閱當機械通過。

外鏈附註：PortSwigger Lab在原check:links被HEAD404誤報，另同UA GET200與Exa完整正文確認可讀。原命令及手動核對並存，未弱化檢查；Q-044另案評估。

## 全系列導覽更新複核
2026-10-22：補齊24篇已存在的中英站內連結；order3接order4，未變更既有slug/date。最終delivery audit核對連結與語言。
