# 抽取紀錄抽查：第三批（18 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與精讀）
- 範圍：bergman-2008、bergman-2010、bergman-dvir-2024、dinneen-julien-2020、dinneen-frissen-2020、forte-para、johnny-decimal、luhmann-slip-boxes、luhmann-archiv-zettelkasten、zettelkasten-de-introduction、matuschak-evergreen-notes、lyt-mocs、bertsch-2007、mccurdy-2020、urry-2021、destefano-lefevre-2007、ferreira-2025、malashenko-2023。檔名都和任務書一致。
- 只讀檔，沒有改動任何抽取紀錄。

## 抽樣方法

- 候選範圍：論文類紀錄取「可引用結果」節。網頁類紀錄（forte、johnny-decimal、luhmann 兩份、zettelkasten.de、matuschak、lyt）沒有這一節，改取「作者主張」（luhmann-archiv 是「作者（檔案館）主張與資料」）和「原句」兩節。
- 候選行：`-` 或 `數字.` 開頭（含巢狀）的列點。條件是去掉節／頁／表／行號括號之後，還有數字，或有含 3 個以上拉丁字母的引文（"…"、“…”、「…」）。
- 排除：
  - 純標題行，也就是去掉出處括號後只剩標題、沒有數字也沒有引文的編號行。例：bergman-2010 L19「結構淺、資料夾小（摘要；Results 1.1–1.3）」、destefano L26／31／40／45、ferreira L24／34。
  - 以「：」結尾的標籤行。
  - mccurdy L40「**自訂步調 > 計時呈現**（t(121) = 3.30…）」雖然是粗體標題，但帶統計值，所以保留在候選裡。
- 每份都先 `random.seed(11)`，再 `random.sample(候選, 3)`。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot3/cands.py`（候選）、`.../spot3/sample.py`（抽樣）。
- 核對方式：
  - 原句先正規化再逐字比對（`.../spot3/find.py`）。正規化包括 NFKC、彎引號、斷行連字號、空白。
  - 比對不到的，再用 `grep`／`sed` 看原始行。雙欄 PDF 用 `.../spot3/cols.py` 把左右欄拆開來讀。
  - 數字都回到原表或原句逐個對過。
  - 下列差異只是文字層的不同，不算不一致：ﬁ 連字、Markdown 強調（`_is_`、`**…**`、`_collide_`）、內嵌連結的錨文字、pdftotext 把 ’ 轉成 Õ。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| bergman-2008-tois.txt | 1,245 | 1,245 | 84,588 | 84,588 | 1–650、650–1246 | 無（1246 是檔尾 `\f`） |
| bergman2010-folder.txt | 2,054 | 2,054 | 82,713 | 82,713 | 1–40（head）、40–739、739–1438、1438–2054 | 無 |
| bergman-dvir-2024-hypersearching.txt | 1,161 | 1,161 | 113,979 | 113,979 | 1–420、420–860 | 本文到 852 行。861–1161 是參考文獻，沒有讀；紀錄寫「至參考文獻開頭」，等於已經揭露 |
| dinneen-julien-2020.txt | 3,001 | 3,001 | 232,078 | 232,078 | 1–60、60–619、619–1118、1118–1617、1617–2091 | 參考文獻 2,088–3,001 沒有逐條讀（紀錄已說明） |
| dinneen-frissen-2020-mac.txt | 406 | 406 | 47,660 | 47,660 | 1–406 | 無 |
| para.txt | 188 | 188 | 14,295 | 14,295 | 1–188 | 無 |
| para-2017-every.txt | 228 | 228 | 25,985 | 25,985 | 1–228 | 無 |
| para-part2-every.txt | 173 | 173 | 25,056 | 25,056 | 1–173 | 無 |
| para-raw.html | 431 | 431 | 225,053 | 225,053 | 只用來搜尋（紀錄已說明） | 已說明 |
| jd-*.txt（9 檔） | 185／56／77／38／155／92／36／282／58 | 全部相符 | 11,012／2,926／3,998／2,239／9,974／4,208／1,748／12,246／2,923 | 全部相符 | 各檔全文 | 無 |
| luhmann-slipbox.txt | 60 | 60 | 17,777 | 17,777 | 1–60 | 無 |
| luhmann-archiv.txt | 4,270 | 4,270 | 388,977 | 388,977 | 1–120 逐行讀；121–4,256 用程式解析，加上抽看 1,434–1,470 與 3,986；4,257–4,270 逐行讀 | 中段是程式解析，不是逐行人讀，紀錄照實標註了。抽查時看了第 3,986 行「9/8 Zettelkasten [18]」，和紀錄一致 |
| luhmann-archiv-nachlass-zk.txt | 143 | 143 | 31,866 | 31,866 | 1–143 | 無 |
| zk-intro.txt | 404 | 404 | 48,468 | 48,468 | 1–220、221–404 | 無 |
| am-*.txt（7 檔） | 36／32／42／34／32／18／32 | 全部相符 | 3,390／10,885／5,673／5,395／3,385／2,523／5,178 | 全部相符 | 各檔全文 | 無 |
| lyt-*.txt（8 檔）＋ lyt-maps-raw.html | 23／41／25／18／65／86／27／12；92 | 全部相符 | 1,486／1,991／1,369／1,441／6,079／5,472／1,409／1,143；14,261 | 全部相符 | 各檔全文 | `lyt-maps-exa.txt` 實際 14 行、629 bytes。紀錄有提到這個檔和它的用途，但沒寫行數與 bytes。小瑕疵，不影響 |
| bertsch.txt | 644 | 644 | 72,270 | 72,270 | 1–62、63–208、209–355、356–416、417–482、483–631、632–645 | 無（645 是檔尾 `\f`） |
| mccurdy.txt | 574 | 574 | 141,982 | 141,982 | 1–63、65–83、85–110、111–163、165–191、193–299、301–435、437–467、469–499、501–511、513–543、545–575 | 跳過的 64、84、164、192、300、436、468、500、512、544 都是空行。檔尾沒有換行，所以實際有 575 行，紀錄讀到 575 是對的 |
| urry.txt | 1,682 | 1,682 | 114,607 | 114,607 | 1–64、66–115、…、1566–1682（14 段） | 跳過的 65、968–969、1528 都是空行 |
| destefano.txt | 1,256 | 1,256 | 101,867 | 101,867 | 1–52、…、1250–1256（12 段） | 跳過的 203、374、542、955、1039 是空行，778–779 是頁首，都不影響 |
| ferreira.txt | 406 | 406 | 25,769 | 25,769 | 1–31、34–111、…、367–406（8 段） | 跳過的 32–33、112–113、168–169、257、304–305、350–351、364–366 都是空行或頁首 |
| malashenko.txt | 848 | 848 | 70,157 | 70,157 | 1–75、76–148、…、819–848（14 段） | 跳過的 149、187、258–263、317、392–398、454、563、621、661、685、812–818 都是空行、頁碼或頁首 |

- 18 份的行數與 bytes 全部和 `wc` 一致。各區段首尾相接，沒有缺正文。
- 「與摘要或常見轉述不一致處」（網頁類叫「與常見轉述不一致處」）：18 份都不是空的，每份有 4 到 8 條列點。

---

## 1. bergman-2008-tois-navigation-preference.md

全文檔：`fulltext/bergman-2008-tois.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L38 | "Only 12 of 481 Spotlight users reported … with more subfolders"（§6.1） | 第 896–900 行，§6.1 Main Findings（809–910） | 逐字相符，節也對。 |
| 2 | L40 | "The hierarchical method is boringly consistent"；"In PIM, the same user both organizes and retrieves the information."（§6.2） | 第 941、994 行，§6.2（911–1007） | 兩句都逐字相符，節也對。 |
| 3 | L41 | "If search engines are the PIM 'fire escapes,' then, in case of emergency, you want to have the best one available."（§7） | 第 1055–1056 行，§7 CONCLUSIONS（1052 起） | 文字相符。原文 fire escapes 用的是雙彎引號 “fire escapes,”，紀錄改成單引號，只是標點，不影響。 |

判定：**通過**。

## 2. bergman-2010-folder-structure.md

全文檔：`fulltext/bergman2010-folder.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | 摘要原句 "Navigation was largely successful … 94% … 14.76 seconds …" | 第 80 行附近，摘要 | 逐字相符。 |
| 2 | L36 | p.30 原句 "each additional folder step … 2.236 … 0.106 … 21.09 … about 21 information items …" | 第 1475–1481 行。第 29 頁的頁碼在第 1446 行，所以這段在 p.30 | 逐字相符，數字與頁碼都對。 |
| 3 | L37 | 「up to 21」經驗法則：一個資料夾超過約 21 項就再開一層子資料夾 | 第 1483–1487 行："avoid storing more than 21 information items per folder and create an additional level of subfolders instead. We call this the 'up to 21' heuristic." | 轉述正確。紀錄在不一致節另外提醒 21 指的是資訊項目、第 1489–1491 行的「67.3% of the files」應為 folders，原文確實是這樣寫的。 |

判定：**通過**。

## 3. bergman-dvir-2024-hypersearching.md

全文檔：`fulltext/bergman-dvir-2024-hypersearching.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L39 | 39/46（85%）回答者的 hyper-searcher 建議「把資料夾整理好」（列在「4. 資料夾比較亂（§5.2）」之下） | 第 612–613 行："39 of 46 hyper-searchers who answered this question (85%) advocated improving folder organization"。這一行在 **§5.7 Interviews**（589–614），不在 §5.2（486–541） | 數字與分母都對，**節別標錯**：應為 §5.7，不是 §5.2。 |
| 2 | L44 | 失敗率 8% vs 4%（變異大，不顯著）；取回時間 27.23 vs 28.09 秒；重新分析 2019 資料 63.86 vs 39.29 秒（顯著）（§6.6） | 第 749–751 行，§6.6（736–763）；27.23／28.09 在 §5.1 的第 435–436 行（t(98) = −0.26, p = .80）；63.86／39.29 的 t(287) = 5.46, p < .001 | 全部相符。 |
| 3 | L47 | email：hyper 53% vs 對照 43%；對照組 email 43% 是檔案 7% 的 6 倍以上（§5.8、§6.7.2） | 第 622 行，§5.8（615 起）；第 782–784 行，§6.7.2（780 起）："over 6 times" | 全部相符。這兩個都是問卷自評估計值，原文寫 "estimated"。 |

判定：**有小錯**。L39 的出處應改為 §5.7（Interviews）。數字沒有問題，不需要重讀。

## 4. dinneen-julien-2020-file-management-review.md

全文檔：`fulltext/dinneen-julien-2020.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L37 | Massey, TenBrook et al. 2014 的盡責性結果；神經質與開放性無關；只有 Windows 使用者的盡責性與桌面檔數正相關 | 第 698–702 行、第 753–756 行 | 每一點都和原文相符（fewer files overall、more files per folder (i.e., fewer folders)、more files on the desktop；neuroticism and openness were not correlated；Windows 有相關，Mac 沒有）。 |
| 2 | L39 | 作業系統：唯一明確研究是 Bergman et al. 2012，Mac 取回較快，根目錄附近資料夾多、每個資料夾檔案少、子資料夾多；圖示檢視表現最好 | 第 757–766 行："Only one study has explicitly investigated …" | 全部相符。 |
| 3 | L41 | "That search, tagging, or any other feature will replace … likely specious hope for the majority of users." | 第 1923 行附近，Future of files 段 | 逐字相符。 |

判定：**通過**。

## 5. dinneen-frissen-2020-mac-individual-differences.md

全文檔：`fulltext/dinneen-frissen-2020-mac.txt`（雙欄，用 cols.py 拆開來讀）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L33 | >99% 的 Mac 與 Windows 使用者用預設檔案管理器；44 位 Linux 使用者用了 14 種（p.5） | 第 235–239 行右欄，在「LBW135, Page 5」（第 270 行）之前 | 全部相符："All but four Mac users and four Windows users (i.e., >99% of each group)"、"the 44 Linux participants used 14 different file managers"。 |
| 2 | L34 | "It is possible that command-line navigation is more demanding of spatial cognition … like a map would"（Discussion p.6） | 第 283–288 行左欄，在 p.6 | 逐字相符，原文句尾接引用 [23]。 |
| 3 | L35 | "PIM is personal, but it is also highly circumstantial, so examining variables collectively (e.g., for latent profiles) may prove more elucidating."；並探討工具、外部任務與限制（時間、組織政策） | 第 277–280 行左欄；第 305–306 行右欄："external tasks and constraints (e.g., limited time or organisational policy)" | 逐字相符，轉述的部分也對得上。 |

判定：**通過**。

## 6. forte-para.md

全文檔：`fulltext/para-part2-every.txt`、`fulltext/para-2017-every.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L44 | Projects → Archives：「one of the most common flows」 | para-part2-every.txt 第 83 行（**To Archives**） | 逐字相符，流向也對。 |
| 2 | L47 | Resources → Projects：「This is one of the primary use cases for resource notebooks actually.」 | para-part2-every.txt 第 99 行（**To Projects:**） | 逐字相符。 |
| 3 | L69 | 「define your projects, or they will define you」（2017 原版） | para-2017-every.txt 第 153 行 | 逐字相符，版本也對。 |

判定：**通過**。

## 7. johnny-decimal.md

全文檔：`fulltext/jd-the-jdex.txt`、`fulltext/jd-the-standard-zeros.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L50 | 「Creating the note is creating the new ID.」「Your filesystem is not your index.」 | jd-the-jdex.txt 第 101 行（原文是 `Creating the note _is_ creating the new ID.`）、第 73 行（粗體） | 文字相符，差別只在 Markdown 強調。 |
| 2 | L56 | `.00` JDex、`.01` Inbox、`.02` 任務、`.03` 範本、`.04` 連結、`.05` AI（2026-09-07 新增）、`.06–.08` 保留、`.09` Archive；area 的 `A0` 與系統的 `00-09` 照同樣規則 | jd-the-standard-zeros.txt 第 32–86 行（第 70 行 "Added: 2026-09-07."，第 84 行 "Reserved for expansion. Do not use."）、第 124–159 行 | 全部相符。 |
| 3 | L74 | 「Your filesystem is not your index.」 | jd-the-jdex.txt 第 73 行 | 逐字相符。 |

判定：**通過**。

## 8. luhmann-slip-boxes.md

全文檔：`fulltext/luhmann-slipbox.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L42 | 「Theoretical publications do therefore not result from simply copying what can already be found in the slip box.」（第 III 節） | 第 50 行，在 `## III`（42–51）之內 | 逐字相符，節也對。 |
| 2 | L56 | 「It is impossible to think without writing」 | 第 16 行，第 I 節 | 逐字相符。 |
| 3 | L57 | 「The fixed filing place needs no system.」 | 第 28 行，第 II 節 | 逐字相符。 |

判定：**通過**。

## 9. luhmann-archiv-zettelkasten.md

全文檔：`fulltext/luhmann-archiv-nachlass-zk.txt`、`fulltext/luhmann-archiv.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L36 | 9/8 區（18 張）：「Denkwerkzeug」「Zweitgedächtnis」「Klärgrube」「Junior-Partner」「man liest anders, wenn man auf die Möglichkeit der Verzettelung achtet」 | nachlass-zk.txt 第 18 行（Zettel 9/8 ff.、9/8g）；luhmann-archiv.txt 第 3,986 行「9/8 Zettelkasten [18]」 | 四個詞和德文原句都逐字相符，「18 張」也對得上。 |
| 2 | L38 | 「inklusive möglicher Irrtümer und Holzwege, die durch spätere Eintragungen revidiert, nicht aber eliminiert wurden」 | nachlass-zk.txt 第 141 行（4 總結） | 逐字相符。 |
| 3 | L48 | 「Insgesamt umfasst der Kasten ca. 90.000 undatierte und mit wenigen Ausnahmen handschriftlich beschriebene Zettel」 | nachlass-zk.txt 第 30 行 | 逐字相符。 |

判定：**通過**。luhmann-archiv.txt 的中段是程式解析，紀錄已照實標註，抽到的 9/8 條目也核對過了。

## 10. zettelkasten-de-introduction.md

全文檔：`fulltext/zk-intro.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L44 | Structure note 是「a Zettel about other Zettels and their relationships」，類似 Luhmann 的 hub notes；重疊形成 semilattice，更準確的模型是 heterarchy | 第 278 行（"A Structure Note is a Meta-Note: it is a Zettel about other Zettels and their relationships. Luhmann's hub notes …"）、第 290–296 行 | 全部相符。 |
| 2 | L63 | 「emphasize connection, not a collection.」 | 第 22 行 | 逐字相符。 |
| 3 | L64 | 「The fixed address of each note is the alpha and omega of the world of Zettelkasten.」 | 第 90 行 | 逐字相符。 |

判定：**通過**。

## 11. matuschak-evergreen-notes.md

全文檔：`fulltext/am-associative.txt`、`fulltext/am-foryourself.txt`、`fulltext/am-concept.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L55 | 「fuzz their edges」；新類別看不到形狀；「further sorting requires undoing existing structure.」 | am-associative.txt 第 10 行 | 逐字相符，轉述也對。 |
| 2 | L61 | 失敗模式：把原子筆記當文章段落來寫，「I often find that I can't write anything at all!」 | am-foryourself.txt 第 8 行（"…write them _as if_ they're sections in a larger essay … Then I often find that I can't write anything at all!"） | 逐字相符。am-atomic.txt 第 32 行的回連清單裡也有這句，但正文出處是 am-foryourself，紀錄放在第 5 原則之下，是對的。 |
| 3 | L81 | 「It's best to factor Evergreen notes by concept (rather than by author, book, event, project, topic, etc).」 | am-concept.txt 第 6 行（"Evergreen notes" 是內嵌連結的錨文字） | 文字相符。 |

判定：**通過**。

## 12. lyt-mocs.md

全文檔：`fulltext/lyt-mocs.txt`、`fulltext/lyt-collide.txt`、`fulltext/lyt-coda.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L59 | 「An M—O—C is a cluster of information that maps "things" in context with other "things".」 | lyt-mocs.txt 第 6 行 | 逐字相符，原文用彎引號。 |
| 2 | L62 | 「This is where you generate all the insights. This is where ideas collide.」 | lyt-collide.txt 第 6 行（原文是 `ideas _collide_`） | 文字相符，差別只在斜體。 |
| 3 | L64 | 「An MOC is rarely a finalized concrete statue. Instead, it should be able to freely evolve over time.」 | lyt-coda.txt 第 19 行 | 逐字相符。 |

判定：**通過**。

## 13. bertsch-2007-generation-effect-meta.md

全文檔：`fulltext/bertsch.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | 生成規則的效應量：calculation .92、sentence completion .60、rhyme .46、category .41、synonym .41、word fragment .37、letter rearrangement .37、association .32、antonym .28、anagram −.05 | Table 1（Generate Rule），第 274–312 行，Effect Size 欄 | 10 個值全部相符。anagram 在原檔顯示為 `].05`，是減號被誤轉，紀錄寫 −.05 是對的。 |
| 2 | L32 | whole .55、part .32 | Table 1（Stimuli Generated），第 315–320 行 | 相符。 |
| 3 | L37 | 「Regardless of what the underlying cognitive mechanisms may be, the generation effect appears to be a real phenomenon that deserves further empirical study.」（p. 207） | 第 459–462 行右欄（雙欄），在 p. 207 範圍（417–482） | 逐字相符。 |

判定：**通過**。

## 14. mccurdy-2020-generation-effect-meta.md

全文檔：`fulltext/mccurdy.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L35 | 約束 low .642／medium .586／high .528，F(2, 121) = 4.89, p = .009；recognition F = 0.42, p = .659；cued recall .717／.642／.567；free recall .484／.354／.295, F = 9.40, p < .001；relational processing 原句 | Table 1 的 9a／9b（第 295–297 行）；正文第 459、461 行；原句在 Model 9b 討論後（"…these findings provide some evidence that fewer generation constraints increase the magnitude of the generation effect through enhanced relational processing…"） | 數字、自由度、p 值和原句全部相符。recognition 與 free recall 的自由度是 F(2, 113)，紀錄只寫 F 值、沒寫自由度，不算錯。 |
| 2 | L36 | >1 day 的效應較大（約多 7 個百分點，ts > 2.35, ps < .020）；Table 2：immediate .479／.579、short .487／.580、long .444／.608；「generation may act to slow the decay of memory relative to reading」 | 第 465 行（Model 結果）；Table 2 的 Retention delay 列（第 414–425 行）；Discussion 第 493 行附近 | 全部相符。 |
| 3 | L41 | anagram 讀 .471／生成 .584，t(109) = 8.83；letter transposition .507→.540, p = .072；與 word stem 相當 | Table 2 的 Generation task 列（第 362–368 行）；第 465 行 "All other tasks (e.g., anagram, …) were similar in magnitude as word stem tasks" | 全部相符。 |

判定：**通過**。

## 15. urry-2021-laptop-replication.md

全文檔：`fulltext/urry.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L33 | 「It would be tempting to conclude … do better on the test.」（Discussion） | 第 735 行起，Discussion（716–856） | 整段逐字相符。 |
| 2 | L34 | 原 Study 1 題型為因子：主效應 F(1, 63) = 1.01, p = .319；交互 F(1, 63) = 0.87, p = .355；Bayes 概念題：原研究 BF10 = 0.45、本研究 0.17、replication BF10 = 0.22 | 第 1353–1356 行（Treating Item Type as a Factor，"In the original Study 1"）；第 1249–1327 行（For conceptual-application performance …） | 全部相符，「概念題」的條件也對。 |
| 3 | L36 | 「Results, thus, did not support the idea that longhand note-taking improves performance via better encoding of information.」與「students and professors … may not need to ditch the laptop just yet.」 | 第 829 行；第 849–853 行（結論段） | 兩句都逐字相符。 |

判定：**通過**。

## 16. destefano-lefevre-2007-hypertext-cognitive-load.md

全文檔：`fulltext/destefano.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L44 | Niederhauser et al. (2000)：越常用 compare-and-contrast 的人後測越低，依序讀的人表現較好；Shapiro (1998)：無結構標示最高、線性居中、高度結構最低；小結原句（p. 1633–1635） | 第 886–915 行；小結在第 946–947 行（"In sum, features added to hypertext to make explicit the text's structure did not enhance reading comprehension"，原檔把 ’ 轉成 Õ）；頁首顯示第 876 行是 p. 1634、第 925 行是 p. 1635 | 全部相符。 |
| 2 | L48 | 「Notably, our review uncovered very little support for the idea that hypertext will lead to an enriched experience of the text.」 | 第 1000 行，§4，p. 1636（974 起） | 逐字相符。 |
| 3 | L49 | 「none explored long-term comprehension and memory for information presented in various text formats.」 | 第 1003 行，§4，p. 1636 | 逐字相符。 |

判定：**通過**。

## 17. ferreira-2025-second-brains-obsidian.md

全文檔：`fulltext/ferreira.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L33 | 四種取回方式（§3.2、Fig. 3）；後兩種發生在「reading or analyzing a note」時，連結與標籤「work as pointers to other related information」 | 第 266–284 行，§3.2，Fig. 3 | 兩句都逐字相符。 |
| 2 | L39 | 這是全文唯一提到「index」的使用者引文，指資料夾上的索引，不是 MOC | `grep -i index` 只出現在第 295、297 行，是同一段 P6 引文的兩個欄位片段 | 相符，「唯一」成立。 |
| 3 | L40 | P5「there are 3 moments, right? … information retrieval.」；P3「I write, I register, then I think about organizing or discarding them」（§4） | 第 345–349 行（P5）、第 343–344 行（P3），§4 Discussion（306–349） | 兩句都逐字相符，人物歸屬也對。 |

判定：**通過**。

## 18. malashenko-2023-zettelkasten-spaced-repetition.md

全文檔：`fulltext/malashenko.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | 實驗組 M = 40.25（SD 4.21）vs 對照組 29.05（SD 4.27），差 11.2，t = 8.348, df = 37.992, p = .000（Table 2–3） | Table 2（第 428–430 行）、Table 3（第 439–441 行，df 37.992 是 "Equal variances not assumed" 那一列） | 全部相符。 |
| 2 | L23 | Table 6：3.15（SD 0.20）vs 2.90（SD 0.27）；Table 7：t = 3.327, df = 35.026, p = .002 | 第 542–543 行、第 559–560 行 | 全部相符。正文第 547 行寫 SD 0.37、第 553 行寫 "t (35.026) = 0.25, p > 0.05"，和表格互相矛盾，紀錄的品質判定節（L45）已經列出。 |
| 3 | L24 | 「the hypothesis of the study was found to be true」；「the proposed digital model of full-cycle training was found to be highly effective」（§6） | 第 565 行、第 619 行，都在 §6（564–620） | 逐字相符，節也對。 |

判定：**通過**。

---

## 摘要表

| # | 紀錄 | 抽查 3 項 | 讀取紀錄（行數／bytes／涵蓋） | 不一致節 | 判定 |
|---|---|---|---|---|---|
| 1 | bergman-2008-tois-navigation-preference | 3/3 相符（fire escapes 的引號形式不同，不影響） | 一致／全文 | 6 條 | 通過 |
| 2 | bergman-2010-folder-structure | 3/3 | 一致／全文 | 8 條 | 通過 |
| 3 | bergman-dvir-2024-hypersearching | 數字 3/3；L39 節別錯 | 一致／本文全讀，參考文獻沒讀（已揭露） | 6 條 | **有小錯**：L39 出處應為 §5.7（Interviews，第 612 行），不是 §5.2 |
| 4 | dinneen-julien-2020-file-management-review | 3/3 | 一致／本文全讀，參考文獻沒逐條讀（已說明） | 6 條 | 通過 |
| 5 | dinneen-frissen-2020-mac-individual-differences | 3/3 | 一致／全文 | 7 條 | 通過 |
| 6 | forte-para | 3/3 | 一致／三檔全文 | 7 條 | 通過 |
| 7 | johnny-decimal | 3/3 | 9 檔全部一致 | 5 條 | 通過 |
| 8 | luhmann-slip-boxes | 3/3 | 一致／全文 | 7 條 | 通過 |
| 9 | luhmann-archiv-zettelkasten | 3/3 | 一致；中段程式解析，已照實標註 | 7 條 | 通過 |
| 10 | zettelkasten-de-introduction | 3/3 | 一致／全文 | 7 條 | 通過 |
| 11 | matuschak-evergreen-notes | 3/3 | 7 檔全部一致 | 6 條 | 通過 |
| 12 | lyt-mocs | 3/3 | 9 檔一致；lyt-maps-exa.txt 沒寫行數與 bytes（實際 14 行、629 bytes） | 5 條 | 通過 |
| 13 | bertsch-2007-generation-effect-meta | 3/3（13 個效應量都對） | 一致／全文 | 7 條 | 通過 |
| 14 | mccurdy-2020-generation-effect-meta | 3/3 | 一致／全文（跳過的都是空行） | 5 條 | 通過 |
| 15 | urry-2021-laptop-replication | 3/3 | 一致／全文 | 5 條 | 通過 |
| 16 | destefano-lefevre-2007-hypertext-cognitive-load | 3/3 | 一致／全文 | 6 條 | 通過 |
| 17 | ferreira-2025-second-brains-obsidian | 3/3 | 一致／全文 | 6 條 | 通過 |
| 18 | malashenko-2023-zettelkasten-spaced-repetition | 3/3 | 一致／全文 | 4 條 | 通過 |

結論：18 份裡 17 份通過，1 份有小錯（bergman-dvir L39 的節別）。沒有任何一份需要重讀。54 個抽查項目中，數字、條件與分母、原句全部相符，唯一的錯誤是一處節別標錯。
