# zettelkasten.de — Introduction to the Zettelkasten Method（Sascha Fast）

read_status=fulltext（整份讀完；性質是方法推廣者的主張，作者也是 The Archive 軟體的開發者）

## 來源與讀取版本

- https://zettelkasten.de/introduction/ ，頁首標示日期 Oct 27th, 2020，作者 Sascha（Sascha Fast）。讀取日 2026-10-22。→ `fulltext/zk-intro.txt`
- 利益揭露：文中推薦作者自家的 The Archive（「free 60 day trial」），軟體章節有推銷性質。
- 圖片只有替代文字（例如 Zettel 範例、structure note 截圖），圖內文字沒讀到。

## 作者主張

### 定義

- 「A Zettelkasten is a personal tool for thinking and writing. It has hypertextual features to make a web of thoughts possible. The difference to other systems is that you create a web of thoughts instead of notes of arbitrary size and form, and emphasize connection, not a collection.」
- 三個特徵：(1) hyper-textual；(2) Principle of Atomicity；(3) personal。
  - 「A Zettelkasten makes connecting and not collecting a priority」。
  - 原子性：「aiming for one knowledge building block per note. It is not a rigid law, but a guiding compass.」
  - 個人：「there is one Zettelkasten per person, and one person per Zettelkasten.」共用的專案 hypertext 可以有用，「But that is not what we are talking about」。

### 從 Luhmann 抽出的原則

- 固定位址：「The fixed address of each note is the alpha and omega of the world of Zettelkasten. Everything becomes possible because of it.」
- 編號帶來兩件事：organic growth（像 wiki 的分支）與 linking。
- 索引不是標籤：「His register is purely a list of entry points, not a tag list.」例：「the term system had just one entry」。
- 要複製 Luhmann：「you would have to create a hypertext and limit your entry into it via the most central pages on a topic, from which you would continue by following links.」

### 一張 Zettel 的組成

- 三部分：unique identifier、body、references。
- ID 四種：Luhmann-ID（紙本推薦）、time-based（例 `202006110955`，數位推薦）、任意字串（不推薦，會犧牲可讀性）、標題當 ID（不推薦，改標題會斷連結）。
- 內文要用自己的話：「one of the core rules to make the Zettelkasten work for you is to use your own words」。
- 長度由目的決定；「we recommend limiting each Zettel to one thought each」。
- 存知識不存資訊：「You should always translate information to knowledge by adding context and relevance.」拿不準就寫：「If in doubt, write the note, within the confines of your deadline.」

### 連結

- 每張新卡都要和其他卡建立關係。
- **連結脈絡**：「To make the most of a connection, always state explicitly why you made it. This is the link context.」沒有說明的連結「you will not create knowledge」，而且「as a habit, it is even counter-productive」。

### Structure notes（結構卡）

- 「A Zettelkasten should not only be a web of thoughts that you create from the bottom up of Zettels and their connection. Some sort of hierarchical structure is very useful.」
- Structure note 是「a Zettel about other Zettels and their relationships」，類似 Luhmann 的 hub notes。重疊的結構卡形成 semilattice，更準確的模型是 heterarchy。
- 結構卡也可以是序列型（論證 a → b → c）。

### 軟體需求

- 三項：能做 hypertext（連結功能或全文搜尋模擬連結）、全文搜尋加連結導覽（全文搜尋相當於 Luhmann 的索引入口）、sandbox（Luhmann 的書桌，數位版不容易做到，作者用 structure note 代替）。
- 偏好軟體無關、純文字：「Even Zettel links boil down to search.」

## 例子

- Luhmann：「He published 50 books and over 600 articles」，遺稿有超過 150 份未完成手稿（註腳引 Schmidt 2016）。
- 資訊對知識：「At this time (2020-05-20 09:14), I, Sascha, create the first draft of an article…」是死資訊。
- 蟻丘與工廠的類比，說明連結讓人看到模式。
- 作者營養書的一章後來寫成一整本書（偏離專案的副產品）。
- 冷水澡論證的序列型 structure note。
- 不同人該允許多少偏離：趕論文的學生少偏離、退休工程師盡量偏離。

## 原句

- 「emphasize connection, not a collection.」
- 「The fixed address of each note is the alpha and omega of the world of Zettelkasten.」
- 「His register is purely a list of entry points, not a tag list.」
- 「always state explicitly why you made it. This is the link context.」
- 「Some sort of hierarchical structure is very useful.」
- 「Having a Zettelkasten makes nothing easier, but it makes anything possible.」

## 作者自述的限制或適用範圍

- 要投入：「this only comes as a result of putting in a high level of consistent effort.」「First, you will have the feeling that you don't do anything useful.」
- 「It is possible to produce more in less time, but not with less effort per time.」
- Luhmann 的產量不只是卡片盒的功勞：註 2「Luhmann's productivity wasn't so high just because he used a Zettelkasten. He worked all day, every day. Being a workaholic helps in getting work done.」
- Luhmann 的「reasonable」是對一個「workaholic and an enthusiastic bureaucrat」而言。
- 偏離專案的程度受截止期限限制：「You cannot just take random notes on what you are interested in and expect to get anything done.」
- 數位版缺少實體書桌的自由排列。
- 紙本轉數位很痛苦，除非字跡清楚可 OCR 或有人幫忙轉錄。
- 編號說明為了教學省略了 Luhmann 的斜線（註 3）。
- 註 4 承認 heterarchy 的完整討論超出本文範圍。

## 與常見轉述不一致處

- **「放哪裡不重要」比 Luhmann 原文更絕對**：本文寫「It is not important where you place a new note as long as you can link to it」，Luhmann 英譯是「it is less important where we place a new note」。
- **「Zettelkasten 不要階層」與本文相反**：本文明說「Some sort of hierarchical structure is very useful」，並推薦 structure notes。反對階層的轉述比較接近 Matuschak 或 zettelkasten.de 另一篇〈no categories〉。
- **「Luhmann 的索引就是標籤」**：本文明確否定，說索引只是入口清單。檔案館資料（每個關鍵字通常最多 4 個位置）支持這點。
- **編號是簡化版**：本文用 `1`、`1a`、`1a1`，沒有 Luhmann 實際的斜線或逗號（ZK II `21/3a1`、ZK I `1,1`），也沒有提主題區號。
- **「Luhmann 產量高是因為卡片盒」**：作者在註腳自己打折扣，說工作狂也是原因。
- **「Zettelkasten 只能自己用」**：作者說一人一盒，但也承認共享的專案 hypertext 有用，只是不叫 Zettelkasten。Matuschak 的筆記則是公開的，兩者立場不同。
- **時間 ID 的推薦有軟體背景**：time-based ID 是 The Archive 的預設做法。

## 讀取紀錄

- `zk-intro.txt`：404 行、48,468 bytes（`wc -lc`）。讀過第 1–220 行（開頭、Luhmann's Zettelkasten、Fixed Address、三特徵、Anatomy、ID、Body、偏離與例子、Reference 前半）與第 221–404 行（Reference 後半、Connecting、Structure Notes、軟體、The Archive、DokuWiki、Starting Now、致謝、註 1–4）。合計第 1–404 行全文。
- 管道：Jina Reader（curl r.jina.ai）。
