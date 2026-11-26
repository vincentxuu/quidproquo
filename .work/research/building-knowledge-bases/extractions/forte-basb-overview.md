# 抽取紀錄：Tiago Forte, Building a Second Brain: The Definitive Introductory Guide

read_status=full（整頁正文從標題讀到文末「Your next steps」與署名；頁首導覽、頁尾訂閱表單、cookie 同意框不屬正文）

## 書目

- Tiago Forte（Forte Labs）。網頁文章，https://fortelabs.com/blog/basboverview/
- 頁面標示：PUBLISHED May 1, 2023；UPDATED November 23, 2023；「Est. reading time: 19 min」。插圖由 Andrew Nalband（Thunk Notes）繪製。
- 性質：方法作者對自家方法（BASB、CODE、PARA）的推廣介紹，文末導向書、自學課程、直播課。不是研究，沒有任何數據或對照。
- 讀取方式與全文檔（scratchpad/fulltext/）：
  - `curl -sL -A "Mozilla/5.0 …Chrome/130"` → HTTP 200，268,241 bytes HTML（dl/basb.html）
  - `pandoc -f html -t plain --wrap=none` → fix-forte-basb-overview.raw.txt（587 行，33,811 bytes）
  - 目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文行號都是 fix-forte-basb-overview.raw.txt 的行號。

## 結構

- 引言（73–105）：大腦用來想點子不是存點子（79）；Second Brain 的定義（81）；八項承諾（97–104）。
- CODE 四步（108）：Capture（122–185）、Organize（187–265）、Distill（267–319）、Express（321–381）；每步三條 guideline。
- 結語 The power of having a Second Brain（385–405）、Your next steps（409–415）。

## 可引用原句

1. Capture：憑直覺收（160–164）
   - 「In deciding which passages, images, theories, or quotes to keep, don't make it a highly intellectual, analytical decision.」（160）
   - 「Instead, your rule of thumb should be to save anything that "resonates" with you on an intuitive level.」（162）
   - 共鳴的來源：「it connects to something you care about, wonder about, or find inherently intriguing」（164）
2. Capture：先存、留到專門的閱讀時段（152–154）
   - 「Instead of immediately consuming what's in front of you, save it so you can revisit it later (at a time that's reserved for consumption).」（152）推薦的稍後閱讀工具：Readwise Reader、Instapaper、Pocket（154）。
3. Organize：從乾淨的起點開始（230–246）
   - 「most people think they have to sort ALL their existing notes and files into it」（232）
   - 「Move all existing files to a folder titled Archive with today's date.」（240）
   - 「Consider this folder a "time capsule" … it separates what was saved prior to today's date from what you'll save from this point on.」（242）
   - 「Whenever you need a file, you can always pull it out of your Archive folder. But my guess is that you won't need as many old notes as you think you do.」（246）
4. Organize：三個問題（248–261）
   - 「What project would this be useful?」「If none: Which area will this be useful for?」「If none: Which resource does this belong to?」「If none, it's probably best to archive this information or not save it at all.」（256–259）
   - 「With some practice, this decision will only take you a few seconds.」（261）
   - PARA 定義（219–222）：Projects 短期、有目標；Areas「Long-term responsibilities you want to manage over time」；Resources「Topics or interests that may be useful in the future」；Archive 其他三類的不活躍項目。
5. 清收件匣的頻率與份量（263）
   - 「I prefer to do this "filing" in one batch about once a week. I pull up my "Inbox" – a separate folder as a temporary holding area where new items accumulate until I have time to put them in their proper place – and process 10-20 items in just a few minutes.」
   - 「Don't overthink where you're going to put a certain piece of information within PARA. Remember that you can almost certainly find anything again using a simple search.」（265）
6. Distill：機會式提煉（313–319）「add value to a note every time you touch it」（317）；Progressive Summarization（303–309）。
7. Express：「Think of your Second Brain not as a warehouse … but as a factory」（347）；Intermediate Packets（359–365）。

## 核對系列正文

| 正文位置 | 正文說法 | 原文 | 判定 |
|---|---|---|---|
| order 0 L78 | 方法來自寫書開課的作者，例如 Forte 的 PARA 與 Building a Second Brain | 本頁就是 BASB 介紹，PARA 是其中 Organize 一步（207–222）；文末導向書與課（413–415） | 吻合 |
| order 1 L56 | Forte 說他每週清一次，一次處理 10 到 20 則，只花幾分鐘 | 263：「about once a week … process 10-20 items in just a few minutes」 | 吻合。注意：原文講的是把收件匣項目「歸進 PARA 資料夾」（filing），不是決定去留 |
| order 1 L62 | 存的時候憑直覺，覺得有共鳴就先丟進收件匣，每週清的時候才判斷 | 憑直覺收在 160–162（Capture 段）；收件匣與每週批次在 263（Organize 段）。兩段分屬不同步驟，原文沒有直接說「先丟進收件匣」 | 大致吻合（兩處合併的轉述）。「每週清時才判斷」原文判斷的是放哪個 PARA 資料夾，不是要不要留 |
| order 1 L64 | 依序問：哪個專案有用？哪個長期負責的領域有用？屬於哪個感興趣的主題？三題都答不出才不收 | 256–259：project → area → resource；都沒有就「archive this information or not save it at all」 | 問題順序吻合；「屬於哪個感興趣的主題」對應 resource（221 定義為 topics or interests）。「三題都答不出才不收」不完全：原文是「封存或乾脆不存」，兩個選項 |
| order 2 L149 | ①整包移進標今天日期的封存資料夾 ②從今天起新東西照新規則放 ③舊的用到時再搬到新位置 | ① 240 逐字吻合；② 242、252「what you'll save from this point on」「process any new items into the appropriate PARA folders」吻合；③ 246 只說「pull it out of your Archive folder」 | ①② 吻合；③ 大致吻合（原文是「從封存拿出來」，沒明說「搬到新位置」）。原文情境是導入 PARA，正文用在「不管選哪套」屬合理延伸 |

## 沒寫的事

- 沒有任何證據說明每週一次、10–20 則是否足夠，也沒有說收件匣累積太多時怎麼辦。
- 「三個問題」是決定放哪裡，不是決定留不留；只有最後一條「or not save it at all」碰到去留。
- 沒處理「封存資料夾越來越大、之後怎麼找」，只說用搜尋（265）。

## 限制

- 作者推廣自家付費產品（書、課），屬方法主張；頁面 2023-11-23 更新過，舊版內容未比對。

## 讀取紀錄

- 全文檔：fix-forte-basb-overview.raw.txt，587 行，33,811 bytes。
- 依序讀完第 1–587 行（Read 一次讀完）。第 1–60 行為頁首導覽，61–417 為正文，419–587 為上下篇連結、訂閱表單、頁尾、cookie 同意框與留言框。
- 讀取日期：2026-10-22
