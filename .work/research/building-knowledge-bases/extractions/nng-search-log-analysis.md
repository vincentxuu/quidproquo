# 抽取紀錄：NN/g Search-Log Analysis（Farrell 2017）

read_status=read（正文從標題讀到 More Information；文末推薦連結區未算正文）

## 書目

- Susan Farrell. *Search-Log Analysis: The Most Overlooked Opportunity in Web UX Research*. Nielsen Norman Group，2017-07-30。https://www.nngroup.com/articles/search-log-analysis/
- 讀取方式：2026-10-22 curl（一般瀏覽器 UA）抓 HTML → pandoc 轉純文字。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-nng-slog.txt（318 行，19,398 bytes）。已讀 L1–L218（正文＋More Information）；L220–318 是課程與相關文章連結，掃過。
- 下文行號皆指該檔。

## 性質

- 實務說明文，不是研究。沒有樣本、沒有測量；文中數字（heating pads、organic chicken stock）是示意例子，沒有交代出處，不能當統計引用。
- 對象是「網站站內搜尋」，內網只在第 7 點順帶提到（L190 people search）。
- 文末只推薦一本書：Rosenfeld, *Search Analytics*（2011）（L216）。

## 可引用內容（附行號）

1. 頻率與時間窗
   - L68："ask for logging to be turned on, so you can look through your log every 6 months or so for usability clues."
   - L70：要看跨幾個月的紀錄，才能把廣告活動、新聞造成的關鍵字暴衝放回脈絡。
2. 四份要拉的清單（L76–106，原文編號）
   - (1) L76："Get a list with the top 1000 query terms over 3–6 months. Sort these by frequency"。L78：分析前 300 名左右時，往下找同義、可歸成一群的詞。
   - L80：把意思相近的詞分組（例：ATM locations, paychecks, bank, payday, payroll, direct deposit），用來改內容分組、交叉連結、see-also 清單、best bets。
   - L82：試算表欄位示意：查詢次數、Recommendation、Owner、Status、Preferred target URL。（這是「每個缺口要有 owner 與狀態」的現成表格欄位。）
   - (2) L86：依使用者 ID／IP 再依時間排序，看同一人連續查了什麼；"repeated searches for related terms may indicate ineffective queries"。L88 例：5 分鐘內 dog → canine → dog toys → bones。
   - L96：同一 IP 可能是一整間公司（proxy），不一定是一個人。
   - (3) L100："Get the list of search terms with no results. These queries often indicate both misspellings and wanted information that the search engine can't find for some reason. Terms that were only used a few times are not of interest, but any terms with lots of searches may point to problems you can address."
   - L102：零結果頁至少要有導覽、保留查詢字的搜尋框、「檢查拼字、換詞或少用幾個詞」提示；知道網站沒有的東西，可以給自訂結果指向別處。
   - (4) L106：最長查詢，常是整句，能幫忙理解前段那些單字查詢的意思。
3. 七種發現（L112–190，原文標題）
   - 1 "What people want but can't find"（L112）— 用途：IA、搜尋調校、best bets、熱門連結、FAQ。對策清單 L120–126：同義詞、best bet、把使用者用的詞加進商品描述、首頁連結、FAQ。
   - 2 "What people want but does not exist"（L128）— 用途：內容策略；對策 L136：優先補內容；L137：既有內容能沾上邊就用 best bets／搜尋建議；L138：超出範圍就導外部。
   - 3 "The difference between users' vocabulary and the website's vocabulary"（L140）— L144："Vocabulary mismatch problems happen a lot on websites that use branded terms, acronyms and abbreviations, or cute labeling instead of generic terms."；對策 L150–152：把使用者的詞放進頁面、設同義詞（dark=noir）、導覽標籤兩種詞並列（品牌詞就改用通用詞）。
   - 4 常拼錯的詞與結果很差的詞（L154）— 同義詞＋best bet。
   - 5 最常見的查詢是空白（L165）。
   - 6 最長查詢裡的客戶困擾或攻擊嘗試（L171–182）。
   - 7 很多數字查詢（L184–190）— L190："If you see people searching with phone numbers on an intranet, it could be time to implement a people search."
4. 調校的定義（L64）：best bets（強制把好結果放頂端）與同義詞關係 "form search-engine tuning"。
5. 行動（L196）："Run the top-100 queries and capture the first page of results. Note whether anything useful was found."；用這份資料做 best bets、隱藏誤導結果。
6. 個資（L204–206）
   - L204："Sequential searches are the only reason you would need unique identifiers for search-log analysis, so you can still do a lot of analysis without that information."
   - L206："don't email unencrypted logs containing PII, and never put logs in world-readable locations, not even inside companies. Remove PII before sharing log data with anyone else, and destroy logs after you have analyzed them."

## 沒寫的事

- 沒有「前十個缺口」或任何優先排序公式；只說「次數多的才值得看」（L100）。
- 沒說「換搜尋引擎」該不該做；全文對策都是調校、改內容、改 IA。
- 沒有零結果率的基準值，也沒有分析要花多少人力。
- 沒提「有結果但點擊率低」這種失敗（只有 L196 跑前 100 名看第一頁）；企業搜尋研究（Cleverley 2023）用的正是 CTR。
- 沒談 best bets 的呈現方式；同站 Laubheimer 2016 說不要把 best bets 做成獨立區塊（見 nng-internal-search-7-ways.md）。

## 與範圍卡或常見轉述不一致處

- 範圍卡的三分類「想要但找不到／想要但不存在／詞彙落差」對應原文 7 種發現的前 3 種（L112、L128、L140）；原文還有拼錯、空白查詢、長查詢、數字查詢 4 種。文章用三分類沒問題，但要說是「挑前三種」，不要寫成 NN/g 只分三類。
- 範圍卡寫「同一人連續查詢」：原文確實列為第 2 份清單（L86），但也說這是唯一需要使用者識別碼的分析（L204），沒有 ID 也能做大部分分析。
- 範圍卡「方法出自 NN/g 實務說明，不寫成研究結論」：與本篇性質相符。

## 限制

- 2017 年的文章，例子是電商與內容網站；內網只順帶一提。
- 文中數字是示意，不可當實證。
