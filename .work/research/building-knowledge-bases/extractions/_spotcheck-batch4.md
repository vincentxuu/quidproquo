# 抽取紀錄抽查：第四批（16 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與精讀）
- 範圍：kleppmann-2019-local-first、obsidian-official-docs、notion-export-import、ango-2023-file-over-app、dix-2024-future-of-pim、forte-progressive-summarization、chen-2025-ai-assistance-dilemma、lee-2025-genai-critical-thinking、etkin-2025-gpt-tools-comprehension、huq-2025-noteeline、vankleek-2009-note-to-self、bergman-2013-jasist-folder-vs-tag、civan-2008-folders-vs-tags、notion-pages-databases、madrid-2009-number-of-links、alford-mendes-2009-link-type-directionality。檔名都和任務書一致。
- 只讀檔，沒有改動任何抽取紀錄。

## 抽樣方法

- 候選範圍：
  - 論文類取「可引用結果」節（chen、lee、etkin、huq、vankleek、bergman-2013、civan、madrid、alford-mendes）。
  - notion-pages-databases 取「可引用內容（官方原句）」節。
  - 網頁／立場文類取「主張／事實」與「原句照抄」兩節（kleppmann、obsidian、notion-export-import、ango、dix）。
  - forte 沒有這兩節，改取「各層定義（原文照抄）」「何時加一層」「其他可引用」三節。
- 候選行：`-`、`數字.` 或表格列（排除分隔列）開頭。條件是去掉節／行／表等出處括號之後，還有數字，或有含 3 個以上拉丁字母的引文（"…"、“…”、「…」）。
- 排除：純標題行（`#` 開頭）、以「：」結尾的標籤行。
- 每份都先 `random.seed(13)`，再 `random.sample(候選, 3)`。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot4/sample.py`。
- 核對方式：
  - 用 `grep -n`、`sed -n`、python 子字串搜尋，回到全文找原處。
  - 數字逐個對到原句或原表，並確認表的欄序（例如 chen Table 3 的欄序是 Automated／Intermediate／Minimal，Table 5 是 Minimal／Intermediate／Automated）。
  - 雙欄 PDF 先確認同一頁的左右欄閱讀順序，再判定節號。
  - 下列差異只是文字層的不同，不算不一致：彎直引號（’ 與 '）、ﬁ 連字、Markdown 強調。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|
| localfirst.full.txt | 815 | 815 | 77,236 | 77,236 | 1–300、300–815 | 無 |
| obs-*.txt（7 檔） | 55／184／68／306／133／43／52 | 全部相符 | 3,473／8,992／3,045／10,453／3,125／2,564／1,777 | 全部相符 | 各檔整檔 | 無 |
| notion-export.full.txt | 628 | 628 | 13,344 | 13,344 | 140–628；1–147 用 sed 確認是導覽列 | 無 |
| notion-import.full.txt | 1,340 | 1,340 | 24,618 | 24,618 | 148–1236；1–147 導覽列；1237–1340 用 grep 確認是頁尾 | 無正文缺口 |
| fileoverapp.full.txt | 91 | 91 | 3,741 | 3,741 | 整檔 | 無 |
| dix-2024-future-of-pim.txt | 463 | 463 | 110,999 | 110,999 | 1–200、200–390、390–464 | 無。檔尾沒有換行，所以 wc 計 463，實際有 464 行，紀錄寫的與此一致 |
| forte-ps-part1.txt | 439 | 439 | 22,789 | 22,789 | 61–304 | 1–60 是導覽列。305–439 沒有讀，抽查時看過，是電子報訂閱區與頁尾，不影響 |
| forte-ps-part2.txt | 331 | 331 | 15,691 | 15,691 | 61 起讀到頁尾 | 無 |
| forte-ps-part3.txt | 380 | 380 | 19,633 | 19,633 | 61 起讀到頁尾 | 無 |
| chen-2025-ai-assistance.txt | 1,463 | 1,463 | 116,825 | 116,825 | 1–749、750–1209、1210–1289 | 1290 起是參考文獻，只掃過（紀錄已說明） |
| lee-2025-genai-critical-thinking.txt（layout） | 1,434 | 1,434 | 185,666 | 185,666 | 1–420、576–650 | layout 檔 421–575 對應 flow 檔 690 之後，已由 flow 檔補讀 |
| lee-2025-genai-critical-thinking.flow.txt | 2,868 | 2,868 | 144,464 | 144,464 | 690–1389、1500–2056、2567–2868 | 1–689 對應 layout 檔 1–420，已讀。1390–1499 抽查時看過，都是 Table 4 拆開的單格，紀錄改看 layout 檔，所以不算缺正文。2056–2566 是參考文獻，紀錄已說明 |
| etkin-2025-gpt-tools.txt | 551 | 551 | 52,775 | 52,775 | 1–295 | 296 起是參考文獻（紀錄已說明） |
| noteeline-2025.flow.txt | 2,285 | 2,285 | 94,175 | 94,175 | 1–800、800–1529 | 1525 起的參考文獻與附錄（含 Table 3–5）沒有讀，紀錄已說明 |
| noteeline-2025.txt（layout） | 1,198 | 1,198 | 148,164 | 148,164 | 沒有讀，只備查（紀錄已說明） | 已說明 |
| vankleek-2009-note-to-self.txt | 437 | 437 | 20,617 | 20,617 | 1–415 | 416 起是參考文獻（紀錄已說明） |
| bergman2013-asist-attitudes.txt | 115 | 115 | 27,540 | 27,540 | 1–115 | JASIST 正文被擋。紀錄逐條列了 11 個管道的失敗原因，改用姊妹篇，已揭露 |
| civan2008.txt | 552 | 552 | 51,236 | 51,236 | 1–68、70–133、135–255、257–416、418–464、466–553 | 跳過的 69、134、256、417、465 是空行。檔尾沒有換行，所以實際有 553 行 |
| notion-create-a-subpage.txt | 24 | 24 | 1,697 | 1,697 | 1–24 | 無 |
| notion-create-your-first-page.txt | 28 | 28 | 1,759 | 1,759 | 1–28 | 無 |
| notion-intro-to-databases.txt | 173 | 173 | 11,416 | 11,416 | 1–173 | 無 |
| madrid2009.txt | 1,017 | 1,017 | 61,481 | 61,481 | 1–299、300–699、699–1017 | 無 |
| alford-mendes2009.txt | 652 | 652 | 72,255 | 72,255 | 1–340、340–653 | 無。檔尾是 `\f`，所以讀到 653 行是對的 |

- 16 份紀錄寫的行數與 bytes，全部和 `wc` 一致。
- 各區段首尾相接，沒有缺正文。沒讀的部分都是導覽列、頁尾、參考文獻或附錄，而且紀錄都已說明。forte part1 的 305–439 行是例外，紀錄沒寫，但抽查確認那段是頁尾。
- 「與摘要／常見轉述不一致處」節：16 份都不是空的。列點數依序是 kleppmann 6、obsidian 6、notion-export-import 6、ango 4、dix 4、forte 5、chen 6、lee 6、etkin 4、huq 5、vankleek 4、bergman-2013 6、civan 6、notion-pages-databases 3、madrid 6、alford-mendes 6。

---

## 1. kleppmann-2019-local-first.md

全文檔：`fulltext/localfirst.full.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L41 | 理想 7：擁有資料也帶來責任，包括備份、防勒索、整理檔案（行 215） | 第 215 行，在七理想段（105–217）內 | 轉述正確。 |
| 2 | L66 | 「many technologies satisfy some of the goals, but none are able to satisfy them all」（行 227） | 第 227 行 | 逐字相符。 |
| 3 | L88 | 行 215 原句 "With data ownership comes responsibility: … managing of file archives." | 第 215 行 | 逐字相符。 |

判定：**通過**。

## 2. obsidian-official-docs.md

全文檔：`fulltext/obs-properties.txt`、`fulltext/obs-flavored-md.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L75 | 也可以用 JSON 寫，但會被讀取並「存成 YAML」（行 259–272） | obs-properties 第 259 行（### JSON properties）到第 272 行（"Note that the JSON block will be read, interpreted, and saved as YAML."） | 正確，行號也對。 |
| 2 | L76 | 日期格式 `2020-08-21`，日期時間 `2020-08-21T10:30:00`（行 204–238） | 第 204／210 行（Date）、第 230／236 行（Date & time） | 正確。 |
| 3 | L105 | obs-flavored-md.txt 行 43 原句 "Some of these, such as internal links, comments, and highlights, are specific to Obsidian. …" | 第 43 行 | 逐字相符。 |

判定：**通過**。

## 3. notion-export-import.md

全文檔：`fulltext/notion-import.full.txt`、`fulltext/notion-export.full.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L52 | Notion Desktop 可以「開啟」Markdown 檔，最多 10 個，會建立唯讀副本（行 933–947） | import 第 935 行 "You can open up to 10 Markdown files at once … creates a read-only copy"；第 943 行 "read-only preview" | 正確，行號範圍也對。 |
| 2 | L59 | 匯入 FAQ 原句「Imports focus on preserving content structure. …」（行 1166） | import 第 1166 行 | 逐字相符。 |
| 3 | L63 | export 行 151 原句 "You can export a Notion page, database, or entire workspace at any time." | export 第 151 行。這行是 `## Need to share … We got you covered! You can export …` 的標題列 | 逐字相符。紀錄只截了後半句，沒有改字。 |

判定：**通過**。

## 4. ango-2023-file-over-app.md

全文檔：`fulltext/fileoverapp.full.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | 行 15 "File over app is an appeal to tool makers: …" | 第 15 行 | 逐字相符。 |
| 2 | L33 | 行 23 "Even the files on your hard drive use proprietary formats …" | 第 23 行（段落的最後一句） | 逐字相符。 |
| 3 | L34 | 行 27 "If you want your writing to still be readable on a computer from the 2060s or 2160s, …" | 第 27 行 | 逐字相符。 |

判定：**通過**。

## 5. dix-2024-future-of-pim.md

全文檔：`fulltext/dix-2024-future-of-pim.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L37 | Eudora 2000+ 資料夾，換到 Gmail／Outlook 後只剩少數（行 269–271）；作者承認這和 Whittaker et al. 2011 相反（行 273） | 第 270 行 "more than 2000 folders in Eudora"、"never had more than a handful of folders"；第 273 行 "at odds with empirical research … slower and less successful than search (Whittaker et al., 2011)" | 數字、行號、方向都對。 |
| 2 | L43 | 組織的成本現在付、效益給未來的自己，人會大幅折現（行 308–310，引 B&W 2016 "a solipsistic interaction…"） | 第 308 行（solipsistic）、第 309 行（"humans tend to discount future benefit heavily"） | 正確。 |
| 3 | L45 | 引 Kidd 1994「the marks are on the knowledge worker」：少數被需要的那一次很重要（行 120–123） | 第 122 行（引句）、第 123 行 "the odd one in a thousand can be critically important" | 正確。 |

判定：**通過**。

## 6. forte-progressive-summarization.md

全文檔：`fulltext/forte-ps-part1.txt`／`part2.txt`／`part3.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L21 | Layer 5 定義原句「for a tiny minority of sources, … turn them into something else.」。前面附註「Part I 沒標『Layer 5』編號，Part III 才稱 Layer 5 remix」 | 原句在 part1 第 271 行 | 原句逐字相符（差別只有 ’ 與 '）。Part I 確實沒有出現「Layer 5」。**但附註「Part III 才稱」不對**：part2 第 127 行已經寫 "One final example, of a Layer 5 note:"，Part II 就用了 Layer 5 的稱呼。Part III 第 120 行才是「Layer 5 remix」的完整說法。 |
| 2 | L27 | 「opportunistic compression」定義原句（Part I） | part1 第 228 行 | 逐字相符，Part 也對。 |
| 3 | L28 | 「I don't summarize notes on any sort of schedule, … for some other purpose anyway.」（Part II） | part2 第 163 行 | 逐字相符（’ 改成 '），Part 也對。 |

判定：**有小錯**。L21 的附註應改為「Part I 沒標 Layer 5；Part II（行 127）開始稱 Layer 5，Part III（行 120）稱 Layer 5 remix」。原句與定義本身無誤。

## 7. chen-2025-ai-assistance-dilemma.md

全文檔：`fulltext/chen-2025-ai-assistance.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L34 | 整體心力沒有差別：F(2,58)=1.67, p=0.197；Automated 4.60、Intermediate 4.53、Minimal 5.17。「外在負荷**各題** Minimal 最高」，例如讀 AI 筆記 4.57 vs 2.93 vs 3.07, F=9.30 | §5.1.2 第 754–760 行；Table 3 第 776–791 行；第 808–810 行 | 心力的 F、p 和三個平均數都對，Table 3 的欄序是 Automated／Intermediate／Minimal。讀 AI 筆記那題 4.57／2.93／3.07、F=9.30 也對。**「各題」不對**：Table 3 共有 5 題外在負荷，第一題 "The instructor did not explain the concepts clearly" 的 Minimal 是 2.10，三組裡最低（2.40／2.30／2.10，F=0.73，不顯著）。Minimal 最高的只有另外 4 題，而且這 4 題都顯著。 |
| 2 | L36 | 「總字數」Automated 300.68 vs Intermediate 170.46 vs Minimal 143.69（F=16.66）；修改比例 Intermediate 40.0%、Minimal 26.3%、Automated 8.0%（F=23.60）；原句 "Automated AI led users to more passively accept AI outputs with minimal modification." | §5.1.3 第 830–834 行；Table 5 第 901 行（欄序 Minimal／Intermediate／Automated）；第 916–917 行 | 數字、F 值、欄序、原句都對。**「總字數」的用詞不準**：原文第 830–831 行與 Fig. 7 圖說（第 850 行）都寫 "total note count"，沒有說單位是字數。 |
| 3 | L41 | 「Intermediate AI should not be viewed as a one-size-fits-all solution」（§6.2）；複習為主的課，有學生偏好完整結構化筆記（P8） | 原句在第 1146 行，§6.2（1137 起）；P8 的話在第 1068 行 | 原句逐字相符，節也對。P8 的引述其實在 §5.2.6（1056 起），§6.2 只是回頭指向 §5.2.6。出處標成 §6.2 稍微不精確，不影響內容。 |

判定：**有小錯**。
- L34「外在負荷各題 Minimal 最高」應改為「5 題外在負荷中有 4 題 Minimal 最高，而且都顯著；『講者沒講清楚』那題三組差不多（Minimal 2.10 最低，F=0.73，不顯著）」。
- L36「總字數」應改為「總筆記數（total note count）」。
- 其他數字都正確，不需要重讀。

## 8. lee-2025-genai-critical-thinking.md

全文檔：`fulltext/lee-2025-genai-critical-thinking.txt`（layout）、`….flow.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 整體信任 GenAI 與「是否批判思考」沒有顯著關係（§4.2.2, Table 4）：β=−0.01, p=0.967。作者解釋任務層級的信心已經吸收了變異 | layout 檔第 646–648 行，Table 4 的 Trust in GenAI 列、Perceived Enaction 欄；flow 檔第 934–947 行，§4.2.2 的解釋句 | 數字、表、節都對，解釋的轉述也正確。 |
| 2 | L30 | 對 AI 的信心與費力度負相關：K −0.11 (0.029)、C −0.13 (0.014)、An −0.15 (0.003)、S −0.12 (0.026)、E −0.23 (<0.001)，Application 不顯著；自我信心 App 0.08 (0.029)、E 0.10 (0.027)（§5.1.1） | flow 檔第 1657–1663 行；Table 4 的 Confidence in AI 列（Application −0.09, p=0.128） | 7 個 β 與 p 全部相符，節也對。 |
| 3 | L37 | 「Our analysis does not establish causation.」（§6.1.1） | flow 檔第 1863 行，§6.1.1（1850 起） | 逐字相符。 |

判定：**通過**。

## 9. etkin-2025-gpt-tools-comprehension.md

全文檔：`fulltext/etkin-2025-gpt-tools.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | 高表現者：summary t(123)=9.2, d=0.83；outline 5.7／0.51；tutor 4.1／0.37；Socratic 3.7／0.33；都是 p<0.001，方向為下降 | 第 157 行，Results，Fig. 2B | 8 個數字與方向都相符。 |
| 2 | L32 | 對照正確率與 AI 平均效果強負相關：r=−0.785, p<0.001（Fig. 3） | 第 167 行 | 相符。 |
| 3 | L36 | 摘要對低表現者的效果「inconsistent」：對照分組顯著改善，SAT/ACT 分組沒有顯著效果 | 第 235 行，Discussion："The AI-generated summary's effect on lower performers was inconsistent. In the control split analyses, … significantly improved …, whereas when splitting by SAT/ACT score, … no significant effect." | 正確。 |

判定：**通過**。

## 10. huq-2025-noteeline.md

全文檔：`fulltext/noteeline-2025.flow.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L33 | 可用性兩者一樣高（§8.1.2）：SUS NoTeeline 80.972 vs baseline 80.833 | 第 691–695 行，§8.1.2 | 相符。 |
| 2 | L35 | 擴寫內容和 micronote 的 SBERT 相似度 0.58、和逐字稿 0.42（§8.2.5）；摘要比 baseline 和使用者筆記的相似度高 11%（§8.2.6） | 第 912–918 行（§8.2.5）、第 922–926 行（§8.2.6，"11% more relevant to the user note (Table 1)"） | 相符，節也對。 |
| 3 | L36 | 「All 12 participants wished to continue using NoTeeline in the future」；「All participants in the study preferred NoTeeline over the baseline」；P7 研究結束後繼續用於訪談標註（§8.3.2, §9.1） | 第 1166–1169 行（§8.3.2）、第 1398 行（§9.1） | 兩句都逐字相符，P7 的部分也正確。 |

判定：**通過**。

## 11. vankleek-2009-note-to-self.md

全文檔：`fulltext/vankleek-2009-note-to-self.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L27 | "After capture, 75% … 19% … 39% … 76% were changed within a day."；40% 只改一兩個字元；"it was more common for participants to append information …" | 第 247–261 行（Notes Are Rarely Revised or Deleted） | 兩句原句逐字相符，40% 也對。 |
| 2 | L29 | 335 次搜尋；42 人中 32 人少於 10 次；72% 至少搜一次；自報 34% 刻意找回、21% 瀏覽時碰到；兩位重度搜尋者 76% 的查詢是 "today"／"todo" | 第 290–310 行 | 數字全部相符。 |
| 3 | L30 | 在筆記頭尾加「to do」「classes」「@」「**」「!!」，是作者的假設，以搜尋詞和這些附加詞相符作為支持 | 第 225–245 行（Metadata added to aid re-finding） | 正確，也照實標出這是假設。 |

判定：**通過**。

## 12. bergman-2013-jasist-folder-vs-tag.md

全文檔：`fulltext/bergman2013-asist-attitudes.txt`（姊妹篇。JASIST 正文被擋，已揭露）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L30 | 75 人中 26 人用過 tag-labels，這 26 人已分類的信 92% 單一分類、8% 多重分類 | 姊妹篇 Discussion："the 26 participants who used tag-labels (out of the 75 …) … single classification for 92% … multiple classification for only 8%." | 相符。 |
| 2 | L33 | 強制期（前 2 週）貼了 71% 存取過的檔案，其中 55% 多重分類 | 姊妹篇 Discussion："forcing them to tag their files for two weeks (… tagged 71% of the files that they had accessed, and used multiple classification on 55% of the tagged files)" | 相符。 |
| 3 | L34 | 自由期（5 週）23 人中只有 6 人貼過標籤（作者寫 23%，實為 26%），其中 2 人只貼了 1 個檔案 | 姊妹篇："only 6 of 23 participants (23%) tagged any of their files during the 5 weeks free choice activity (two of them tagged only a single file each)." | 相符。6/23 = 26.1%，紀錄指出原文百分比算錯，這個判斷正確。 |

判定：**通過**。這三項的來源都是姊妹篇轉述，不是 JASIST 正文，紀錄已經標明。

## 13. civan-2008-folders-vs-tags.md

全文檔：`fulltext/civan2008.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L29 | 平均每篇 1.4 個標籤；最後一天每個資料夾 6.2 篇、每個標籤 7.2 篇；「每天標籤比資料夾**多建** 1 個」 | 第 310–312 行："participants applied one more label than folder to the batch of articles they received each day … (6.2 articles/folder) … (7.2 articles/label) … 1.4 labels per article." | 1.4、6.2、7.2 都對。**「多建」不準**：原文寫的是 "applied"，意思是每天那批文章上多用 1 個標籤，不是多建 1 個。上一句雖然談建立速率，但原文說的是「兩者建立速率相近」（"The rate with which folders and labels were created was similar"）。 |
| 2 | L32 | 兩套都不支援階層，但 6 人（Hotmail）與 7 人（Gmail）用命名慣例（"General"、共同前綴 "Marathon…"）做出上下層 | 第 313–316 行 | 相符。 |
| 3 | L35 | 手繪草圖比資料夾／標籤豐富：6 人在資料夾集合的草圖畫出階層，7 人在標籤集合畫出階層，2 人畫出時間順序；兩套系統都放不進這些關係 | 第 323–342 行（Parallel Limits on External Expression） | 6／7 正確。2 人的部分，原文是 "Two participants incorporated temporal characteristics into the sketches of their **tag** collections"，只限標籤集合，紀錄沒寫出這個條件。小省略。 |

判定：**有小錯**。
- L29 應改為「每天那批文章平均多用 1 個標籤（applied one more label than folder），資料夾與標籤的建立速率相近」。
- L35 可補「2 人（都在標籤集合的草圖）畫出時間順序」。
- 數字都對，不需要重讀。

## 14. notion-pages-databases.md

全文檔：`fulltext/notion-intro-to-databases.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L40 | "You can visualize your data in different ways: Your data isn't limited to a table. Organize your database as a list, calendar, chart, and more" | 第 12 行 | 逐字相符（截在「and more」）。這條紀錄沒有標行號，小瑕疵。 |
| 2 | L41 | "You can view multiple sets of data in one database."；OKR 例子、"without jumping from one part of your workspace to another." | 第 14、18 行 | 逐字相符，例子的轉述也正確。 |
| 3 | L42 | 「Views allow you to organize … as many views as you'd like.」（行 29）；"filter, sort, and group the items"（行 33） | 第 29、33 行 | 逐字相符，行號也對。 |

判定：**通過**。

## 15. madrid-2009-number-of-links.md

全文檔：`fulltext/madrid2009.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L34 | 連結數量對學習沒有效果；推論題的支援主效應 F(1,37)=4.63, p<0.05，有建議 M=4.52 (SD 2.16) vs 沒有 M=3.33 (SD 1.68)；Pathfinder 同方向但不顯著；沒有交互作用；§5.5 原句 "we did not find learning impairments … (H3a)." | 第 545–558 行（§5.4，Table 2）、第 589–590 行（§5.5） | 數字、節、表、原句都相符。 |
| 2 | L41 | 連貫路徑者推論題較好（邊緣）：F(1,37)=3.41, p=0.07；高連貫 M=4.65 (1.84) vs 低連貫 M=3.27 (1.96)；連結數沒有效果（§6.3, Table 5） | 第 696–708 行（§6.3） | 數字相符。原文推論題這段指向 Fig. 5，Table 5 在第 708 行，是給文本題的；表號範圍大致對。 |
| 3 | L44 | §5.5 原句「cognitive load can be largely dependent on user actions, and not only on system manipulation.」 | 第 603–604 行（§5.5） | 逐字相符。 |

判定：**通過**。

## 16. alford-mendes-2009-link-type-directionality.md

全文檔：`fulltext/alford-mendes2009.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | H1 typed links（§6.3）：完成時間 p=0.0058、信心 p=0.0152；原句 "typed links provide significantly faster completion time, and greater user confidence than untyped links." | 第 455–462 行右欄。同頁（429–503 行之間沒有分頁符）左欄第 489 行是 "6.3 Results"，照閱讀順序，右欄接在後面，屬於 §6.3 | 數字、原句、節都相符。 |
| 2 | L33 | H2：完成時間 p=0.7978（不顯著）；信心 p=0.0278 | 第 471–473 行右欄，§6.3 | 相符。 |
| 3 | L37 | §7 結論兩句原句 "We have shown empirically that scholars will benefit …"、"the confidence of users will improve when performing tasks …" | 第 541–550 行右欄。第 528 行是 "7. CONCLUSIONS AND FUTURE WORK" | 兩句逐字相符（跨行接合），節也對。 |

判定：**通過**。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 不一致欄 | 判定 |
|---|---|---|---|---|---|---|
| 1 | kleppmann-2019-local-first | 3/3 | 一致 | 完整 | 6 條 | 通過 |
| 2 | obsidian-official-docs | 3/3 | 一致（7 檔） | 完整 | 6 條 | 通過 |
| 3 | notion-export-import | 3/3 | 一致（2 檔） | 正文完整 | 6 條 | 通過 |
| 4 | ango-2023-file-over-app | 3/3 | 一致 | 完整 | 4 條 | 通過 |
| 5 | dix-2024-future-of-pim | 3/3 | 一致 | 完整 | 4 條 | 通過 |
| 6 | forte-progressive-summarization | 原句 3/3；L21 附註錯 | 一致（3 檔） | 正文完整（part1 頁尾未讀，無影響） | 5 條 | 有小錯：Layer 5 的稱呼在 Part II（行 127）就出現了，不是 Part III 才有 |
| 7 | chen-2025-ai-assistance-dilemma | 數字 3/3；兩處用詞錯 | 一致 | 正文完整 | 6 條 | 有小錯：外在負荷是 5 題中 4 題 Minimal 最高，不是「各題」；「總字數」應為 total note count |
| 8 | lee-2025-genai-critical-thinking | 3/3 | 一致（2 檔） | 正文完整（flow 1390–1499 是表格單格） | 6 條 | 通過 |
| 9 | etkin-2025-gpt-tools-comprehension | 3/3 | 一致 | 正文完整 | 4 條 | 通過 |
| 10 | huq-2025-noteeline | 3/3 | 一致（2 檔） | 正文完整，附錄未讀（已說明） | 5 條 | 通過 |
| 11 | vankleek-2009-note-to-self | 3/3 | 一致 | 正文完整 | 4 條 | 通過 |
| 12 | bergman-2013-jasist-folder-vs-tag | 3/3（姊妹篇轉述） | 一致 | 姊妹篇完整，JASIST 正文被擋（已揭露） | 6 條 | 通過 |
| 13 | civan-2008-folders-vs-tags | 數字 3/3；兩處用詞或條件 | 一致 | 完整 | 6 條 | 有小錯：原文是每天多「用」1 個標籤，不是多「建」；時間順序那 2 人只限標籤集合 |
| 14 | notion-pages-databases | 3/3 | 一致（3 檔） | 完整 | 3 條 | 通過 |
| 15 | madrid-2009-number-of-links | 3/3 | 一致 | 完整 | 6 條 | 通過 |
| 16 | alford-mendes-2009-link-type-directionality | 3/3 | 一致 | 完整 | 6 條 | 通過 |

- 通過 13 份，有小錯 3 份（forte、chen、civan），不通過 0 份。
- 沒有需要重讀的紀錄。
- 3 份小錯都是轉述的用詞或範圍不準，抽中的數字與原句本身都對。建議依上面列的正確值修正那幾行就好。
