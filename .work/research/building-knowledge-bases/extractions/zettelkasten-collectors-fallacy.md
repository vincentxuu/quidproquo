# 抽取紀錄：zettelkasten.de, The Collector's Fallacy（2014）

read_status=full（正文從標題讀到文末兩條腳註；頁尾訂閱與留言區不屬正文）

## 書目

- Christian（Christian Tietze），zettelkasten.de，2014-01-20。頁面注明「originally appeared on christiantietze.de」。
- 網址：https://zettelkasten.de/posts/collectors-fallacy/
- 性質：方法推廣者的部落格文章（作者也是 The Archive 軟體開發者），論點與經驗建議，沒有研究數據。
- 讀取方式與全文檔（scratchpad/fulltext/）：
  - `curl -sL -A "Mozilla/5.0 …Chrome/130"` → HTTP 200，26,314 bytes HTML（dl/cf.html）
  - `pandoc -f html -t plain --wrap=none` → fix-collectors-fallacy.raw.txt（99 行，8,902 bytes）
  - 目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文行號都是 fix-collectors-fallacy.raw.txt 的行號。第 28–30 行是嵌入影片（Skinner 鴿子實驗）轉文字後的錯誤訊息，影片本身沒看。

## 可引用原句

1. 收集本身就是獎勵（10）：「There's a tendency in all of us to gather useful stuff and feel good about it. To collect is a reward in itself.」書籤也算：「we store half the internet as bookmarks」。
2. 命名與定義（12）：「Let's call this "The Collector's Fallacy". Why fallacy? Because 'to know about something' isn't the same as 'knowing something'.」原文用彎引號 ‘ ’ “ ”。
3. Eco 影印例（18）：「It's quite common that students prepare lots and lots of photocopies of the texts they have to read — and stop just there. The copies grow to be an alibi, says Umberto Eco in his book "How to Write a Thesis": "there's a lot someone doesn't know anything about precisely because she photocopied a text; she has given herself in to the illusion of having read the text already."」作者注明是從德譯本第 162 頁自行英譯。
4. 書籤同理（22）：「The digital pile of bookmarks isn't any different from a tangible pile of papers … Here, too, kept isn't read, though.」
5. 成癮機制（26、32、34）：按影印鍵立即得到紙張回饋，像 Skinner 制約鴿子；存書籤是因為「we get rid of the fear of losing access to the information」（34）。
6. 處方：讀並做筆記（40–54）：「We need to extract what's inside and write things down.」（40）；「reading without taking notes is just a waste of time in the long run」（42）；「Reading alone won't suffice: we have to create notes, too」（54）。
7. 短循環（58–60）：「Shorter cycles of research, reading, and knowledge assimilation are better than long ones.」
8. 一小時的起步規則（64–70）：
   - 「To form a habit, you have to set yourself actionable limits and keep score.」（64）
   - 「To get started, do research for one hour and no second more. Process the collected material until the stack is empty.」（66）
   - 接著回顧這一輪、必要時調整時間上限（67–68）；「Repeat the cycle and keep track of your perceived productivity」（70）；文末問讀者「What time cap did you end up with?」（74）。
9. 2014-07-17 更新（62）：另有一篇 Knowledge Cycle 給更完整的排程。

## 核對系列正文

| 正文位置 | 正文說法 | 原文 | 判定 |
|---|---|---|---|
| order 0 L78 | zettelkasten.de 是推廣 Zettelkasten 筆記法的網站 | 本頁訂閱區與標籤（76–85）；站方性質另見 zettelkasten-de-introduction.md | 吻合 |
| order 1 L23 | 2014 年取名；存下來的感覺本身就是一種獎勵 | 3 行日期 2014-01-20；10 行「To collect is a reward in itself.」 | 吻合 |
| order 1 L25 | 英文引文 "Why fallacy? Because 'to know about something' isn't the same as 'knowing something'." | 12 行，字詞逐字相同；原文用彎引號，正文用直引號 | 吻合（只差引號字形） |
| order 1 L27 | 引 Eco《如何撰寫論文》談影印：學生影印一疊文獻就產生已讀過的錯覺；書籤也一樣 | 18 行（Eco 引文）、22 行（書籤） | 吻合。可補：引文是作者從德譯本自譯 |
| order 1 L56 | 建議更短：收集一小時就停，處理完再收下一批 | 66–70 行：研究一小時就停、處理到清空、回顧並調整時間、再重複 | 大致吻合。原文是「起步用的」上限，並鼓勵依回顧調整時間；正文寫成固定建議略強 |
| order 1 L72（第三步） | 讀完、寫下自己的理解，才算進到知識庫，是收集者謬誤給的處方 | 40、54 行 | 吻合 |

## 沒寫的事

- 沒有任何資料；「一小時」是作者的起始建議，不是試出來的最佳值。
- 沒講收件匣或每週清理；它的節奏是「一輪研究—處理」，與 GTD／Forte 的每週批次不是同一種單位。

## 限制

- 單篇部落格，作者自述的經驗與推論；Eco 引文為二手轉譯。

## 讀取紀錄

- 全文檔：fix-collectors-fallacy.raw.txt，99 行，8,902 bytes。
- 依序讀完第 1–99 行（cat -n 一次讀完）。1–74 正文，76–81 標籤與出處，83–95 訂閱與留言區，97–99 兩條 Amazon 聯盟連結腳註。
- 讀取日期：2026-10-22
