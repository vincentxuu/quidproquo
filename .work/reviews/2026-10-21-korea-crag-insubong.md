# 仁壽峰：獨立審稿

查核：2026-10-21；已讀中文及英文完整正文，逐段比較實義。只寫本報告，不改文章。工具降級及書目補抓見同日overview審稿。

## post-verify

- 🟢 路線表：逐列對照GIN122/123與write-insubong-raw-main.json新版路線清單。InsuA115m/4p5.8；ChouinardB177m/5p5.8；InsuB97m/3p5.9；Maninbo15m5.11b；Wand162m/4p舊5.10c／新5.10b；Villa165m/6p5.12a/A2均對應原文。ChouinardA來源內部差異有明示，未把181m接到新版組合線。末段A2未刪，下降繩長未從路線總長推算。

- 🔵 已修：書目出版社청문각錯誤：Kyobo同URL明列아웃도어글로벌（Outdoor Global），ISBN9788995843727與UKC一致。改為Outdoor Global；GIN版權頁僅核作者／初版年月，不應說它確認出版社。兩語統一英文說明附韓文地名／路線名。

- 🟢 交通與規範：write-insubong-evidence.md及raw-main/extra之官方全文支持Ui-Sinseol、出口2、taxi到入口、Harujae0.8km/30min；沒有把1.9km/90min登白雲臺當到岩壁。KNPS通用程序與2025報導未被寫成2026強制／免許可斷言。

- 🔵 已修：數據原位來源：51條／43編號段落需書名與新版topo inline連結；冬季冰爪、舊固定點／新鏈式站段落也需原位來源連結。路線表可於表前加連結的統一來源說明。

## post-review

七個H2依crag-guide-contract齊全；交通三H3、難度四級、高手來源沒列不硬補、規範／救援／保險／指南書具備。🔵 已修：標題「地鐵旁」改首爾北漢山，與正文taxi/hike接近相符。

- 🔵 已修：climbing-grade-convert --check中文首版7rows有6rows失敗：難度欄前綴「最難」使parser未識別原始YDS；可寫5.8（最難）等以YDS起首，保持原級數並重跑。不要改腳本去配合單篇，也不要反推法國級數。

全站verify／astro／links由parent統一執行。已完整讀英文：路線數、級數、原書／新版差異、交通與規範的實義一致，A2與歷史來源界線沒有遺漏。修後中英YDS欄均保留原始級數，Wand級數差異與Villa A2一致。中英14rows grade-check實跑通過。

## post-polish

中文scan：31正文段、5長句（含兩條書目）、轉折3/31（9%）、模板0。數字密集在來源範圍／季節／接近，不是無關數據堆疊。整體有具體動作，適合未去過但具多段能力的讀者。

- 🔵 已修長句：保險分成承保問題與BMC例子；步道分開0.8km到Harujae與最後分岔。來源內部矛盾集中路線表，沒有把技術風險合理化。

結論：四篇人工內容與雙語實義審查完成；已列必修均修復，未見剩餘內容必修。parent補最終機械閘門結果，外部NFA連結驗證限制仍列如下。

### 外部連結人工複核

2026-10-21 Chrome CUA直接訪問：VisitSeoul完整ENN042345網址可讀正確標題頁；http月刊山25147自動轉https且正確報導頁可讀。NFA EMS網址顯示ALTCHA訪客驗證（방문자 확인），未觸發checkbox／未解CAPTCHA，不能判真404，也不能稱本輪瀏覽器讀到EMS正文；119事實沿用已保存Exa官方全文。此限制應留在最終機械紀錄，不弱化檢查。

### Parent 最終機械檢查

四檔 post-quality 無阻擋；multi-pitch 中文標籤匹配警告經人工確認與多繩距主題相符。兩檔中文 check:tw 零阻擋；process-leak 與語言配對通過。仁壽峰中英14列 grade check 通過。Astro check：0 errors、0 warnings、82 hints（全站）。全站最終閘門輸出：`.work/korea-crags/write-verify-final.log`。

外連機械檢查非全綠：兩家媒體與 VisitSeoul 的404已以CUA排除；theCrag 403依原研究頁讀取；NFA訪客驗證未突破，119由已存官方全文確認。不得稱所有URL無條件可自動抓取。
