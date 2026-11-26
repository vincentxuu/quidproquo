# 抽取紀錄：NN/g 7 Ways to Improve Your Website's or Intranet's Built-In Search Engine（Laubheimer 2016）

read_status=read（正文 L1–L109 讀完；L111 之後為課程連結）

## 書目

- Page Laubheimer. *7 Ways to Improve Your Website's or Intranet's Built-In Search Engine*. Nielsen Norman Group，2016-03-13。https://www.nngroup.com/articles/internal-website-search/
- 讀取方式：2026-10-22 curl 抓 HTML（Search-Log Analysis 頁的 Related Articles 連到這篇）→ pandoc。
- 全文檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o10-nng-internal-search.txt（190 行，13,898 bytes）。已讀 L1–L111。

## 性質

- 實務說明文，無實證資料。七招都是搜尋端的調校（查詢改寫），不是內容端的修正。

## 可引用內容（附行號）

1. 內網重視召回率（L41）："for internal searches on a single website or intranet, recall can be quite important."；電商漏掉商品，客人會以為沒賣。
2. 手動改善常見查詢（L49）：要 "routinely review search logs"；但 "be cautious about separating the manually promoted items into a 'promoted' or 'best bets' list when presenting the results, as users often ignore these, like they ignore pay-per-click ads ... Instead, just integrate the manual hits with the search-engine–generated hits and present a single list".
3. 搜尋建議要人工整理（L53）："an unedited list of common queries from the search logs will not be helpful ... Instead, suggest curated query terms that retrieve useful results."
4. 內網最高報酬（L59）：員工姓名建議、"zero-click" 聯絡資訊。
5. 同義詞（L67）："your users likely don't know the carefully crafted lingo that everyone in your office uses on a daily basis. Review your search logs and look for synonyms that you don't currently have in your content. Then you can create synonym tables in your search engine where user search terms map to existing terminology".
6. 詞幹（L71–77）：例 "marketing automation" vs "automated marketing solutions" 零結果；預設常沒開；召回升、精確度降，要用搜尋紀錄判斷。
7. 拼字建議（L81–83）：零結果時直接改用建議拼法取結果，但要標明。
8. 同音（L89–91）、停用詞（L95–99）。
9. 總結（L103）：這些都 "may improve the quality or the number of search results without requiring a major development investment."

## 沒寫的事

- 沒有「改文件標題、摘要」這類內容端修正；全篇只談搜尋引擎設定。所以範圍卡自我檢查「改標題或摘要」要另引 Farrell 2017 L150（把使用者的詞放進頁面）與 Cleverley & Burnett 2019（標題權重最高、模板強制標題）。
- 詞幹、停用詞、同音都是英文情境；中文斷詞問題沒有談。

## 與範圍卡或常見轉述不一致處

- 範圍卡對策寫「best bets」。本篇提醒 best bets 若做成獨立區塊會被忽略（L49），Cleverley & Burnett 2019 在企業內也觀察到使用者沒看到置頂推薦結果。文章寫 best bets 時要附這個呈現方式的但書。

## 限制

- 2016 年；搜尋引擎技術（語意搜尋、向量搜尋）之後已改變，L99 自己也說若引擎有自然語言處理就不要移除停用詞。
