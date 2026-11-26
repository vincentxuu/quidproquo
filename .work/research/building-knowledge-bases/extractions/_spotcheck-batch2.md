# 抽取紀錄抽查：第二批（15 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與精讀）
- 範圍：alon-nachmias、bravo-adasme、neave、grudin-poole、stocker-tochtermann、jones-2004、whittaker-2011、elsweiler-2008、bergman-2009（GrayArea）、bergman-whittaker-2016 ch2、kalnikaite-whittaker-2007、vankleek-2011、bruce-2005、barnett-2024、anthropic-2024。批次一的 8 份不在範圍內。
- 只讀檔，沒有改動任何抽取紀錄。

## 抽樣方法

- 候選：每份紀錄「可引用結果」節裡，`-` 開頭（含巢狀）、帶數字或引文（「」或 "）的列點行。編號標題行（`1. **標題**（§x）`）不算。
- 例外：
  - bruce、barnett、anthropic 三份沒有分節，「可引用結果」是一個列點下的編號清單，每個編號項本身就是內容。所以用編號項當候選（bruce 5 個、barnett 4 個、anthropic 3 個）。
  - bergman-whittaker ch2 的「可引用結果」是把內容寫在編號行裡，`-` 列點只有 1 行。所以這份改成編號行加列點行一起當候選（11 個）。
  - vankleek 第一次抽到 L54「Figure 7（括號為 SD）：」，這行是標籤，沒有內容。所以排除以「：」結尾的標籤行後重抽一次。
- 每份都先 `random.seed(7)`，再 `random.sample(候選, 3)`。腳本在 scratchpad `spot2/sample.py` 和 `spot2/sample2.py`。
- 核對方式：把全文檔的空白正規化後做逐字比對（`spot2/find.py`）。雙欄 PDF 用切欄版（`spot2/find2.py`）先把左右欄拆開，再接起來比對。比對不到時用 `sed` 看原始行，依欄位判讀。ﬁ 連字、斷行連字號、彎引號只是文字層的差異，不算不一致。
- barnett 與 anthropic 沒有存全文檔，用 `mcp__exa__web_fetch_exa`（maxCharacters 100000）重抓 https://arxiv.org/html/2401.05856v1 與 https://www.anthropic.com/news/contextual-retrieval 。兩頁都完整取回（barnett 到 "Instructions for reporting errors"，anthropic 到電子報區塊），沒有截斷。

## 讀取紀錄總核對（`wc -l` / `wc -c` / `wc -m`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄字元數 | 實際 `wc -c`（bytes） | 實際 `wc -m`（字元） | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|---|
| alon-preproof.txt | 527 | 527 | 72,540 | 72,540 | 72,377 | 1–180、181–360、361–527 | 無 |
| alon-academia-raw.md | 773 | 773 | 137,409 | 137,409 | 137,190 | 只取論文段落 | 已說明 |
| hoarding-review-2026.txt | 846 | 846 | 100,697 | 100,697 | 99,875 | 1–300、301–600、601–846 | 無（第 847 行只有 `\f`） |
| neave-chb.txt | 1,468 | 1,468 | 59,813 | 59,813 | 59,470 | 1–500、501–1000、1001–1468 | 無（第 1469 行只有 `\f`） |
| grudin.txt | 496 | 496 | 60,152 | 60,152 | 59,905 | 1–250、251–496 | 無（第 497 行只有 `\f`） |
| stocker-2011-rg.txt | 1,672 | 1,672 | 68,819 | 68,819 | 68,645 | 1–560、561–1120、1121–1672 | 第 1673 行沒讀到，內容是 RG 頁尾的 "Show more"，不影響 |
| stocker-2011-preview.txt | 98 | 98 | 6,327 | 6,327 | 6,314 | 全部 | 無 |
| jones2004.txt | 524 | 524 | 80,392 bytes | 80,392 | 79,772 | 1–260、261–525 | 無。紀錄寫到 525 行，比實際多 1 行（檔尾有換行，Read 只顯示 524 行）。筆誤，不影響 |
| whittaker2011.txt | 1,387 | 1,387 | 51,126 bytes | 51,126 | 50,941 | 1–700、700–1388 | 無 |
| elsweiler2008.txt | 2,703 | 2,703 | 107,124 bytes | 107,124 | 106,676 | 1–700、700–1400、1400–2100、2100–2704 | 無 |
| elsweiler2008-acm.txt | 576 | 576 | 113,086 | 113,086 | 112,547 | 只做字串比對（紀錄已說明） | 已說明 |
| grayarea.txt | 662 | 662 | 64,501 bytes | 64,501 | 64,257 | 1–340、340–663 | 無 |
| bergman-whittaker-2016-ch2.txt | 329 | 329 | 30,951 bytes | 30,951 | 30,839 | 1–170、170–329 | 無 |
| dl/vdoc.txt（全書鏡像） | 1,076 | 1,076 | 436,322 bytes | 436,322 | 432,768 | 只讀章外相關段落（紀錄已說明） | 已說明 |
| kalnikaite.txt | 474 | 474 | 19,273 bytes | 19,273 | 19,204 | 1–475 | 無 |
| dl/memos.txt | 3,423 | 3,423 | — | 345,060 | 343,227 | 只用來核對起訖 | 已說明 |
| finders-keepers.txt | 637 | 637 | 72,454 bytes | 72,454 | 72,003 | 1–150、150–638 | 無 |
| bruce2005w.txt | 455 | 455 | —（紀錄寫的是原檔 57,129 字元） | 57,395 | 57,360 | 1–455 | 第 456 行沒讀到（檔尾沒有換行），內容是 "#### How to cite this paper:"，不影響 |
| bruce2005.txt（原檔） | — | 224 | 57,129 字元 | 57,164 | **57,129** | — | 字元數與 `wc -m` 一致 |
| barnett（網頁，未存檔） | — | — | 約 3.3 萬字元 | — | 重抓結果約 3 萬多字元，全文到 References 後 | 標題到 References | 無 |
| anthropic（網頁，未存檔） | — | — | — | — | 重抓結果全文到 Acknowledgements | 全文 | 無（Appendix 是圖片，紀錄已說明） |

- 行數與 byte 數全部一致。各區段首尾相接，沒有缺口。
- 和批次一同樣的小瑕疵：alon、bravo、neave、grudin、stocker、elsweiler-acm 寫的「字元數」其實是 `wc -c` 的 byte 數。真正的字元數（`wc -m`）比它少 35 到 822。紀錄都有註明 `wc -lc`，數字和指令對得上，只是「字元」這個用詞不精確。bruce 的 57,129 是真正的字元數，是對的。
- 「與摘要或常見轉述不一致的地方」：15 份都不是空的。12 份有 5 到 11 條實質內容。bruce 有 1 段，談 2004 與 2005 的引用差別。barnett 有 1 條，有小錯，見下文。anthropic 明寫「逐項對過，沒有」。

---

## 1. alon-nachmias-2020-pim-gaps.md

全文檔：`fulltext/alon-preproof.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L42 | Table 5 的 6 組 actual→ideal 與 t 值（email 存資料夾 2.78→3.74, −13.61；email 標籤 2.48→3.37, −13.17；整理照片 3.10→3.96, −12.83；備份照片 3.44→4.21, −12.38；電腦標籤 2.65→3.45, −12.27；App 2.44→3.30, −12.11） | 第 265–269 行（Table 5 的第 12、14、10、7、13、15 列），題號對 Table 3（第 216–225 行）的做法名稱 | 18 個數字全部相符，做法名稱也都對得上。紀錄提醒「Table 2 與 Table 3–6 題號不同，要用名稱」，這裡也照做了。 |
| 2 | L52 | 「The mean scores of 20 out of 25 practices were higher than 3, … erasing practices (x̄ =3.95, SD=1.07).」 | 第 252–254 行，§4.2 | 逐字相符。3.95（1.07）也和 Table 4 的 Erasing 列（第 251 行）一致。 |
| 3 | L56 | 「Participants indicated large gaps in their deleting behavior … (Luxon et al., 2019).」 | 第 337–340 行，Discussion | 逐字相符。 |

**判定：通過**

## 2. bravo-adasme-2026-digital-hoarding-scoping-review.md

全文檔：`fulltext/hoarding-review-2026.txt`（雙欄）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L34 | 「The three identified groups (digital minimalist, digital collector, and problematic digital hoarder) can be understood and classified as part of a behavioral continuum …」 | 第 342–345 行 | 切欄後逐字相符。 |
| 2 | L42 | 「Among the individual consequences are stress, anxiety, and reduced productivity. Sweeten et al. (2018) found … (Luxon et al. 2019; Sedera & Lokuge, 2018).」 | 第 360–366 行右欄，Negative consequences 段 | 逐字相符（切欄腳本在第 363 行左欄空白處斷掉，改用原始行人工核對）。 |
| 3 | L44 | 資安與機密外洩（McKellar 2020、Neave 2020）、能源與環境成本（Sillence 2023、Uğur & Çalışkan 2022） | 第 375–387 行右欄 | 引用對象和主題都正確。原文拼成「Mckellar et al. 2020」，另外還引了 Sweeten 2018（組織層級）與 McKellar 2023（蓄意或意外）。能源那句的出處是 Neave 2020（"consume substantial amounts of energy"），Sillence 與 Uğur 是給「環境影響」的。紀錄把兩者合併轉述，可以接受。 |

**判定：通過**

## 3. neave-2019-digital-hoarding.md

全文檔：`fulltext/neave-chb.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L36 | 第 10 題「At times I find it difficult to find certain files because I have so many」：difficulty deleting .556、accumulating .644、r=.841 | 第 490–493 行，DBQ 因素表 | 三個數字和題目文字都相符。 |
| 2 | L44 | DPR 總檔案數 1857.0（1660.5）vs noDPR 1331.3（1437.4）；已讀 359.3 vs 254.0；未讀 128.5 vs 29.8；deleted 與 archived 無差異 | 第 512–555 行，Table 2 | 數字全部相符。deleted p=.728、archived p=.523，無差異也正確。簡報 p=.014、照片 p=.024、總數 p=.039 顯著，和紀錄一致。 |
| 3 | L78 | 「They typically keep half of the emails they receive and reply to about a third of them (e.g. Dabbish et al. 2005); with very few people engaging in proactive 'clean-up' of that stored information (Bergman and Beyth-Marom 2003).」 | 第 118–122 行，Introduction | 逐字相符。 |

**判定：通過**

## 4. grudin-poole-2010-wikis-at-work.md

全文檔：`fulltext/grudin.txt`（雙欄）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L38 | 「These sources of management approval are steps toward getting platforms in place, but the activity we found was overwhelmingly bottom-up, driven by individual contributors.」 | 第 211–213 行左欄，§4（4.1 標題在第 216 行右欄，之前） | 逐字相符，節號 §4 正確。 |
| 2 | L48 | 「We found that wiki sustainability was strongly dependent on enthusiasts who exhorted others to contribute.」 | 第 353–354 行左欄，§4.3（第 337 行）之後、4.3.1 之前 | 逐字相符，節號正確。 |
| 3 | L52 | 「When a division reorganizes, a project ends, or people leave, … confusing those who come across it.」 | 第 310–313 行右欄，§4.2（第 285 行右欄） | 逐字相符，節號正確。 |

**判定：通過**

## 5. stocker-tochtermann-2011-enterprise-wikis.md

全文檔：`fulltext/stocker-2011-rg.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L39 | 約 180 人、約 500 篇、每天更新 15 篇、20 位技術人員；「Overall 20 technicians intensively created wiki-articles …」 | 第 691–703 行，§3.2 Case Beta（第 589 行起） | 數字與引文都相符。原文另說同時只有 15–20 人能寫入（客戶端不能連線），紀錄沒提，但不構成錯誤。 |
| 2 | L47 | 「Management commitment and management attention are a must have: A company wide wiki may not be the initiative of a single person or department.」 | 第 777–779 行，§3.2 | 逐字相符。 |
| 3 | L49 | 員工要大量使用後才看得到價值；「gentle pressure」 | 第 753–765 行，§3.2 | 相符。原文："employees only recognized the value of the wiki after having intensively used it"、"Putting a 'gentle pressure' on employees might facilitate…"。 |

**判定：通過**

## 6. jones-2004-finders-keepers.md

全文檔：`fulltext/jones2004.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L46 | "useless information" 的定義（紀錄寫第 123 行） | 第 123 行 | 逐字相符，行號正確。 |
| 2 | L61 | 95% re-finding、六個月以上、three methods「accounted for more than two thirds」、「None of these methods required explicit keeping.」 | 第 161 行 | 全部逐字相符。三種方法（auto–complete、search service、從別的網站連）也正確。 |
| 3 | L68 | Herbert Simon 1971：「a wealth of information creates a poverty of attention」 | 第 187–189 行 | 逐字相符，年份 1971 也對（原文寫 "— Herbert Simon, 1971"）。 |

**判定：通過**（讀取紀錄寫到 525 行，比實際多 1 行，屬筆誤）

## 7. whittaker-2011-email-refinding.md

全文檔：`fulltext/whittaker2011.txt`；表格版 `dl3/wl.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L35 | Tag-accesses：0.02/日、1%、未記錄時長 | 第 558–562 行（Table 2），wl.txt 第 284 行 | 0.02（0.09）、1、not recorded，三項都相符。 |
| 2 | L41 | 「Each individual folder-access took approximately one minute, … (around 15s).」；folder > scroll t(357)=6.71, p<0.001；scroll > search t(357)=2.87, p<0.01；search vs sort 無差異 | 第 639–642 行；t 檢定在第 542–546 行 | 引文逐字相符。兩個 t 值、方向與 p 都正確，search vs sort 是 t(357)=0.51, p>0.05。 |
| 3 | L67 | 「In contrast, we found a preference for newer automatic methods, … Future work needs to explore this more.」 | 第 1261–1269 行，Discussion and Conclusions | 逐字相符。 |

**判定：通過**

## 8. elsweiler-2008-memory-email-refinding.md

全文檔：`fulltext/elsweiler2008.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L38 | 「In 95.6% of hot tasks the sender was remembered. This compares with 71.1% of warm tasks and only 56.7% of cold tasks.」 | 第 1010–1011 行，§4.3 | 逐字相符。 |
| 2 | L46 | Table VII All tasks 的 Topic：85.2／75.6／76.9 | 第 1491 行（no-filers 85.2）；frequent filers 與 spring-cleaners 區塊在第 1525–1740 行 | 85.2、75.6（spring-cleaners）、76.9（frequent filers）都相符。紀錄附註「spring-cleaners 略低於 filers」也正確。 |
| 3 | L48 | Other recipients：53.7／55.6／50.0 | 第 1509 行（no-filers OR 53.7）；內文第 1748 行「(no-filers = 53.7%, spring-cleaners = 55.6% and frequent filers =50.0%)」 | 相符，表格和內文一致。 |

**判定：通過**

## 9. bergman-2009-grayarea.md

全文檔：`fulltext/grayarea.txt`（雙欄）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L32 | 「In addition there is a "deletion paradox": … to decide whether to keep or delete them [7].」 | 第 24–28 行右欄，Introduction | 逐字相符（右欄跨行，人工接起來核對）。 |
| 2 | L39 | 偏好：Chronological 20（28.6%）、GrayArea 18（25.7%）、FadedItems 21（30.0%）、現行 11（15.7%） | 第 244–250 行右欄，Table 1 | 四組人數與百分比都相符。 |
| 3 | L40 | 「a within-subject analysis of variance with repeated measures was not significant (F(2, 150)=1.17, p>0.05)」 | 第 303–305 行左欄，"Which of the Three Designs do Participants Prefer?" | 逐字相符。 |

**判定：通過**

## 10. bergman-whittaker-2016-ch2-keeping.md

全文檔：`fulltext/bergman-whittaker-2016-ch2.txt`；書目用 `dl/vdoc.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L52 | 「thinking about information in a context in which it might be deleted leads them to overvalue it」、「Somewhat curiously, … relatively little research has looked at keeping directly.」、Gilbert 2009、Kahneman & Tversky 1979 | 第 43–48 行（p. 35，依紀錄的頁碼對照表 37–54 行→p.35） | 兩句逐字相符，兩個引用也都在。頁碼正確。 |
| 2 | L55 | 書目核對：2007 = CHI〈Software or Wetware?〉pp. 71–80；2008a = BHCI〈Cueing Digital Memory…〉pp. 153–161 | vdoc.txt 第 961 行（書目） | 兩條書目的標題、會議與頁碼都相符。 |
| 3 | L56 | Email：保留約 70%、資訊性 34%、可行動 65% 立即回覆仍保留 85%、37% 延後、只刪 0.5%、資訊性刪 30%、討論串 30–62% | 第 181、188、209–212、216、223、229–230 行（pp. 42–45） | 七個數字都相符。「立即回覆仍保留 85%」對應原文 "even when people do reply immediately, they still keep 85 percent of actionable messages"。 |

**判定：通過**

## 11. kalnikaite-whittaker-2007-note-taking-memory.md

全文檔：`fulltext/kalnikaite.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L41 | 「This suggests that notes may function to reinforce information being committed to OM, …」 | 第 330–332 行 | 逐字相符。 |
| 2 | L43 | 「There was no correlation between the Quantity of combined CC & PP notes and OM Accuracy (r (1, 24) = 0.07, p>0.1). …」 | 第 357–359 行 | 逐字相符，r 與 p 正確。 |
| 3 | L45 | 「There was no correlation between PM note Quantity and PM Accuracy scores (r (1,24) = 0.1, p>0.1). … [3].」 | 第 366–371 行 | 逐字相符。 |

**判定：通過**

## 12. vankleek-2011-finders-keepers.md

全文檔：`fulltext/finders-keepers.txt`（雙欄）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L43 | 「Coders labeled 47% of notes as reference items.」 | 第 262–263 行右欄（"Coders la-／beled"），另見第 232 行 Figure "ref: 215 (47%)" | 去掉連字號後逐字相符。 |
| 2 | L52 | 「periodic sweepers - Periodic cleaning up (deletion) of large numbers of notes in batch sweeps.」 | 第 354–356 行右欄 | 逐字相符（右欄跨行）。 |
| 3 | L55 | Figure 7 everyone（n=420）：1.63／1.15／0.47／33%／0.29／0.17／27% | 第 447、454 行，Figure 7 | 七個數字都相符（括號內的 SD 紀錄沒列，不影響）。 |

**判定：通過**

## 13. bruce-2005-anticipated-need.md

全文檔：`fulltext/bruce2005w.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L7 | 訊號偵測引文（紀錄寫 l.77–83）；儲存變便宜→門檻下降（l.86–87）；律師、醫師門檻較低（l.85–86） | 引文在第 79–81 行；律師醫師在第 84–85 行；儲存成本在第 85–86 行 | 引文逐字相符，兩個推論也和原文一致。行號差 1 行（律師醫師實際是第 84–85 行），不影響。「漏收代價高」是紀錄的轉述，原文是 "complete and accurate information and good record-keeping are especially important"。 |
| 2 | L8 | 「When an individual has information 'in hand', … is then set too low.」（l.93–97） | 第 93–96 行 | 三段引文逐字相符（省略號處省掉的是 "or its potential relevance…" 與 "in the personal information collection"）。後面接的 Whittaker & Hirschberg 2001 在第 97 行。 |
| 3 | L9 | check-this-out-later（l.211–221、235–236）；Jones et al. 2002 我的最愛分三區；「A person may ultimately process … may be smaller still.」 | 第 212–220 行；第 235–236 行 | 相符。三區描述與修剪條件（"could no longer all be viewed without scrolling"）都正確。引文逐字相符，省略的是括號 "(to the point of at least assessing usefulness for a specific need)"。 |

**判定：通過**（讀取範圍 1–455 沒讀到第 456 行 "How to cite"，不影響）

## 14. barnett-2024-seven-failure-points.md

來源：重抓 https://arxiv.org/html/2401.05856v1

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L6 | FP1：「when asking a question that cannot be answered from the available documents … the system could be fooled into giving a response.」；FP2–FP7 名稱 | §5 | 引文相符（省略號省掉 happy case 那句）。七個 FP 的中文轉述都和原文標題一致。 |
| 2 | L7 | 「1) validation of a RAG system is only feasible during operation, and 2) the robustness of a RAG system evolves rather than designed in at the start.」 | Abstract | 逐字相符。 |
| 3 | L8 | Table 2：「Adding meta-data improves retrieval. Adding the file name and chunk number …」（AI Tutor）；「RAG systems require continuous calibration … requiring constant monitoring.」 | §6 Table 2 | 第一句逐字相符，案例是 AI Tutor（FP2, FP4）。第二句是把 Lesson 欄 "RAG systems require continuous calibration." 和 Description 欄 "RAG systems receive unknown input at runtime requiring constant monitoring." 用省略號接起來，跨了兩欄，但沒有扭曲原意。 |

其他核對：38 份文件、200 名學生、4017 份、1000 題、人工檢查 40 個、§4.3 評審非專家，都相符。

**「與摘要不一致」欄有小錯**：紀錄寫「摘要/§1 寫 15,000 documents」。但 Abstract 沒有提文件數。15,000 出現在 §1（RQ1："The experiment involved 15,000 documents and 1000 question and answer pairs"）和 §7 Conclusion（"an empirical investigation involving 15,000 documents and 1000 questions"）。正確寫法是「§1 與 §7 寫 15,000，§4.3 與 Table 1 寫 4017」。結論（用 4017 或不引數字）不受影響。

**判定：有小錯**（正確值：15,000 出自 §1 與 §7 Conclusion，不是摘要）

## 15. anthropic-2024-contextual-retrieval.md

來源：重抓 https://www.anthropic.com/news/contextual-retrieval

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L6 | 「If your knowledge base is smaller than 200,000 tokens (about 500 pages of material), … with no need for RAG or similar methods.」 | "A note on simply using a longer prompt" 小節 | 逐字相符，小節名正確。 |
| 2 | L7 | 「The company's revenue grew by 3% over the previous quarter」看不出公司與季別 | "The context conundrum in traditional RAG" | 逐字相符。原文："this chunk on its own doesn't specify which company it's referring to or the relevant time period"。 |
| 3 | L8 | Contextual Embeddings＋Contextual BM25 失敗率下降 49%（5.7%→2.9%）；加 rerank 下降 67%（5.7%→1.9%） | "Performance improvements" 兩處 | 數字都相符，條件是 top-20-chunk。 |

其他核對：作者 Daniel Ford、2024-09-19、四個領域、1 minus recall@20，都相符。

「與摘要不一致」欄寫「逐項對過，沒有」，有寫，不是空的。我同意頁首的 49%／67% 和正文一致。補充一點，建議加進紀錄，不算錯誤：頁首只寫 "reduce the number of failed retrievals by 49%"，沒有寫條件。正文說明這是「所有領域平均、用最佳 embedding（Gemini Text 004）、top-20」的結果。另外單用 Contextual Embeddings 是 35%（5.7%→3.7%），紀錄沒列。引用時不要把 49% 當成任何設定下都成立的數字。

**判定：通過**

---

## 摘要表

| # | 紀錄 | 3 項抽樣 | 讀取紀錄 | 不一致欄 | 判定 |
|---|---|---|---|---|---|
| 1 | alon-nachmias-2020 | 3/3 相符 | 一致（字元數實為 bytes） | 5 條 | 通過 |
| 2 | bravo-adasme-2026 | 3/3 相符 | 一致（字元數實為 bytes） | 8 條 | 通過 |
| 3 | neave-2019 | 3/3 相符 | 一致（字元數實為 bytes） | 6 條 | 通過 |
| 4 | grudin-poole-2010 | 3/3 相符，節號都對 | 一致（字元數實為 bytes） | 5 條 | 通過 |
| 5 | stocker-tochtermann-2011 | 3/3 相符 | 一致；第 1673 行 RG 頁尾未讀，不影響 | 5 條 | 通過 |
| 6 | jones-2004 | 3/3 相符 | 一致；區段寫到 525，多 1 行，筆誤 | 7 條 | 通過 |
| 7 | whittaker-2011 | 3/3 相符 | 一致 | 11 條 | 通過 |
| 8 | elsweiler-2008 | 3/3 相符 | 一致 | 9 條 | 通過 |
| 9 | bergman-2009 GrayArea | 3/3 相符 | 一致 | 7 條 | 通過 |
| 10 | bergman-whittaker-2016 ch2 | 3/3 相符（含書目） | 一致 | 7 條 | 通過 |
| 11 | kalnikaite-whittaker-2007 | 3/3 相符 | 一致 | 7 條 | 通過 |
| 12 | vankleek-2011 | 3/3 相符 | 一致 | 10 條 | 通過 |
| 13 | bruce-2005 | 3/3 相符（行號差 1） | 一致；第 456 行 "How to cite" 未讀，不影響 | 1 段 | 通過 |
| 14 | barnett-2024 | 3/3 相符 | 重抓全文，與紀錄一致 | 1 條，有誤 | **有小錯**：15,000 出自 §1 與 §7，不是摘要 |
| 15 | anthropic-2024 | 3/3 相符 | 重抓全文，與紀錄一致 | 寫「沒有」 | 通過（建議補 49% 的條件與 35% 數字） |

- 沒有任何一份需要整份重讀。
- 45 個抽樣項目都在原文找到。數字、分母與條件、節號或表號、英文逐字，都沒有實質錯誤。
- 唯一要改的是 barnett「與摘要不一致」欄的出處（摘要 → §1 與 §7）。依指示我沒有動紀錄，留給精讀者修正。
