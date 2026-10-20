# NativeCamp 中英專篇審稿

範圍：兩份2026-10-19-nativecamp-speaking-practice草稿，資料核對2026-10-19。沒有購課、登入或交易實測。首批依使用者同意先寫NativeCamp，另附入口總覽。

## post-verify

官方14項主張逐項對照保存來源：標準／家庭費用、年費條件、母語加購、金幣價格、立即／預約、課程時長、教材、凱倫預約與教材另購、試用續費、扣款時區、取消與缺席、退會即時生效、未用期間退款、年費解約。獨立agent閱讀官方FAQ與預約守則後查稿，發現退費連錯FAQ11、年費期間不明、每日取消次數漏項與提醒時間中英差異，已全部修正；改連FAQ8、明列第1–11月及NT$200×已用月數、每日3次與日本午夜重置、英文至少提前一天。

費用與條款為單一供應商多頁交叉核對，並非兩個獨立機構證實。未引用成效倍率、國籍優劣、平台排名或社群舊價。價格是台灣繁中個人方案，英文版亦保留台灣幣別與地區。未核對第三方商店付費個別條款，不教讀者猜取消路徑。

社群：完整讀PTT1773049958、Dcard255866539與262282336主文，正文各自連結；前者為一年使用自述，第二篇明示推薦碼導流，第三篇為固定老師無法授課的單方敘述。只採選師、尖峰與延續性觀察，不認定效果、退款爭議或平台處置對錯。額外Dcard255805676只作研究對照，不把2024操作當現行事實。來源讀取範圍與raw見rules-research.md、source-rules.json、source-lessons.json。

Groundlane本機HTTP initialize/tools/list/web_search已成功；pricing回truncated=true且modal污染，不能視為完整價格證據。稍後本機服務停止，Exa全文fallback獨立留存。沒有把搜尋摘要或失敗抓取標成全文驗證。

## post-review

讀者問題：台灣成人是否適合買NativeCamp、完整支出有哪些、如何把一次真人課用成可延續的練習？正文依適配→模式→費用→教材→社群→具體任務→退出→試用決定排列。每項建議有具體觀察或動作；例子明示自訂，非平台教案。中英逐節對齊，日期、金額、限制與參考資料一致；所有站內文章路徑已存在。自我評估有訊息完整、回述、重說、追問判準，不將其稱客觀程度評分。

四份新稿 references、post-quality、process-leak與兩份中文check:tw已通過，完整全站驗證結果另存verify.log；不可把targeted通過稱全站通過。draft:true，未發布、未部署；未寫入練習卡或朗讀內容資料，因此沒有新增平台音檔。

## post-polish

已讀回完整中英正文與八項register scan及phrase ledger。中文43正文段落、1個>60字句、轉折2/43；沒有模板化轉折或一般英文術語堆疊，沒有長引用、數字塞進論述段。唯一長句包含必要的單方限制與選課動作，資訊仍可讀；不因掃描機械砍證據。開頭直接是台灣下班時間安排，社群限制放於對應經驗旁，價格集中表格。英文人工檢查自然度與台灣方案限定，無翻譯成全球價格。未發現需使用者另行拍板的刪改；本輪新稿自行完成寫作修正，未動舊文。

最後獨立複查：官方規則修正與社群轉述皆無必要事實修正。調整中英只指第一、二篇的敘述，使其涵蓋現有三篇來源；不改個別來源的利益揭露。

最終工程結果：最後正文變更後重跑pnpm verify，types、lint、台灣用語、系列順序、語言配對等通過；references、post-quality、series-plan三項失敗。完整重跑references與post-quality定位為並行climbing稿的14個缺少目標文章連結（quality因重複引用列16筆），series-plan為bosco-scorace/capo-duomo/palermo/tre-cime等攀岩稿缺審稿紀錄。本批四稿targeted均綠。原始全站verify見verify.log，完整references/quality輸出在/tmp/nativecamp-full-{references,quality}.log。本次不改其他session的文章、不繞過檢查、不commit/push/部署。
