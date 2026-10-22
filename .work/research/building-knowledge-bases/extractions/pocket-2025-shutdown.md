# 抽取紀錄：Mozilla 宣布 Pocket 停止服務（2025）

read_status=full（三個官方頁面各自整頁讀完；支援頁是 2026-10 的現行版，不是 2025-05 公告當時的版本）

## 書目與實際讀的版本

1. Mozilla 官方部落格公告：Mozilla, "Investing in what moves the internet forward", 2025-05-22
   - https://blog.mozilla.org/en/mozilla/building-whats-next/
   - 讀取：exa web_fetch 全頁（2026-10-22）
2. Mozilla Support 知識庫："Pocket has shut down - What you need to know | Pocket Help"
   - https://support.mozilla.org/en-US/kb/future-of-pocket （短網址 https://mzl.la/3Ftj9rP）
   - 讀取：firecrawl_scrape（cacheState=hit，快取時間 2026-10-20T18:44Z）。頁首標註 "This article is no longer maintained, so its content might be out of date."
   - 這是公告後多次修改過的現行版本；2025-05 原始版本沒讀到（見讀取紀錄）。
3. Pocket 告別頁：https://pocket.com/ 與 https://getpocket.com/farewell（"So long, farewell, Auf Wiedersehen..."），exa web_fetch 全頁。
4. 次級來源（只用來確認延期經過，非官方）：Vice, Matt Jancer, 2025-10-09 與 2025-11-09 兩篇（exa 搜尋摘錄，未讀全文）。

## 性質

官方服務終止公告與支援文件。不是研究。

## 可引用事實

### 公告當時（2025-05-22 部落格）
- 關閉日期："Pocket shuts down July 8, 2025"
- 停止下載與新訂閱："You will no longer be able to download Pocket or purchase a new Pocket Premium subscription from May 22, 2025."
- 匯出期限（原定）："Users can export saves anytime until October 8, 2025, after which their data will be permanently deleted."
- API："API users will no longer be able to transact data (read or write) over Pocket's API from October 8, 2025 and will need to export their data before this date."
- 理由原句："But the way people save and consume content on the web has evolved, so we're channeling our resources into projects that better match browsing habits today." 以及 "Meanwhile, new features like Tab Groups and enhanced bookmarks now provide built-in ways to manage reading lists easily."
- 同篇也宣布 Fakespot 2025-07-01 關閉。

### 實際結果（支援頁現行版 Key dates 表）
- 2025-05-22：Pocket removed from app stores；Monthly subscription renewals disabled；New Pocket account sign-ups disabled
- 2025-07-08：Pocket shut down；Annual subscriber refunds occurred – prorated and automatic；"Export-only mode on Pocket Web continues for 90 days"
- 2025-11-12：Export mode on Pocket Web closed；All deletion of accounts and user data began
- 帳號與資料原句："As of November 12, 2025, user data export has been disabled, and all user data has been queued for permanent deletion."
- API 原句："The Pocket API was disabled on November 12, 2025, concurrent with the end of the user export window and the beginning of data deletion."
- App："If you previously installed the Android or iOS apps on your device, they no longer can communicate with Pocket's servers ... Any continued use beyond July 8, 2025 is not supported by Pocket or Mozilla."

### 告別頁
- 範圍："This includes the Pocket Web, Android, iOS, and macOS apps, as well as the Pocket browser extensions."
- 歷史："After Mozilla acquired Pocket in 2017, we invested in building content curation and recommendation capabilities"（Pocket 本身更早就存在，2017 是 Mozilla 收購年）

## 限制

- 支援頁是事後改寫的現行版；公告期間它被改過至少兩次（延期），我沒取得那些中間版本的原文。延期經過只有 Vice 的轉述。
- 官方沒公布受影響使用者數。告別頁只寫 "Pocket has helped millions save articles"。
- 匯出內容包含什麼（例如有無劃線、標籤、全文）官方三頁都沒寫；第三方 Listy 頁說匯出 "does not include the text content of saved links, tags, or highlights"，但 Web Highlights 頁說可匯入 "highlights from the annotations JSON"，兩個第三方說法互相矛盾，且非官方，不可引用為事實。

## 與摘要或常見轉述不一致處

1. 匯出期限：公告寫 2025-10-08；實際關閉匯出是 2025-11-12。依 Vice（次級）：10-08 當天下午延到 11-06，之後又延到 11-12，兩次都是直接改支援頁，沒有另發公告。很多文章（含 The Verge 2025-05-22 報導）停留在「10 月 8 日」，引用時要寫「原定 10/8，最後延到 11/12」。
2. 支援頁 Key dates 表寫 7/8 起 "Export-only mode ... continues for 90 days"（約到 10/6–10/8），但同一張表下一列寫 11/12 才關閉；「90 天」是原計畫的殘留文字，與實際 127 天不符。
3. 「Pocket 7 月 8 日關閉」與「資料 7 月 8 日消失」不同：7/8 之後 app 與存檔功能停止，只剩 Pocket Web 的匯出模式；資料刪除是 11/12 才開始。
4. 2025-05-22 起 app 從商店下架，但 The Verge 報導說已安裝的人可重新下載到 10/8；官方支援頁現行版沒有這句，無法用官方來源確認。

## 讀取紀錄

- 全文合輯：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/pocket-shutdown.txt（83 行，7,511 bytes；含部落格全文、支援頁全文、告別頁全文、Vice 摘錄）
- 依序讀過：部落格全頁 → 支援頁全頁 → pocket.com 與 getpocket.com/farewell 全頁 → Vice 兩篇搜尋摘錄
- 失敗管道：support.mozilla.org 以 curl、exa web_fetch、tavily_extract（advanced）、Wayback（2026-09-23 快照）取得的都是 "Client Challenge" 機器人驗證頁（3,038 bytes）；jina read_url 回 HTTP 402（帳戶餘額不足）。最後由 firecrawl_scrape 取得。
- 讀取日期：2026-10-22
