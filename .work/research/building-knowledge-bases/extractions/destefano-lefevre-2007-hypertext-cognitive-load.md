# DeStefano & LeFevre 2007 — Cognitive load in hypertext reading: A review

read_status=read（全文 26 頁，期刊排版版，含參考文獻與作者簡介）

## 書目

- DeStefano, D., & LeFevre, J.-A. (2007). Cognitive load in hypertext reading: A review. *Computers in Human Behavior*, 23(3), 1616–1641. DOI 10.1016/j.chb.2005.08.012。線上發表 2005-09-30（「Available online 30 September 2005」）。
- 單位：Carleton University, Centre for Applied Cognitive Research。經費：加拿大 SSHRC（Cybercartography 計畫）。
- 讀的檔案：`https://benjaminvw.wordpress.com/wp-content/uploads/2009/01/destefano.pdf`（第三方部落格托管的期刊 PDF，頁首頁碼 1616–1641 與期刊一致）。`curl -L -A "Mozilla/5.0"` HTTP 200，248,906 bytes → `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/destefano.txt`（1,256 行，101,867 bytes）。ScienceDirect 原版付費。

## 設計

- **敘事型綜述（narrative review），不是統合分析**。作者明說：「We were unable to conduct statistical meta-analyses for the clusters of studies for two reasons」——研究間操弄不同、效應量與變異沒有一致報告（§1.2, p. 1618）。做法是把設計相似的研究分群、報告「patterns of results」。
- 檢索：PsycInfo、ERIC，1990–2004；關鍵字 hypertext navigation, hypertext reading comprehension, links, text structure, text topology；加上被引文獻追溯。
- 納入：比較同一文本多個版本（通常數個超文本版本＋一個線性版本）的實證研究，共 **38 篇**（參考文獻中以 * 標記；逐條計數確認為 38）。
- 受試者：除非另註，都是大學生、電腦螢幕閱讀；少數兒童（二年級、五年級、9–17 歲）與高齡者（57–67、62–80 歲）。
- 術語：linear＝只有 Next/Back；hierarchical＝樹狀；networked/nonlinear＝語意相關節點互連，連結可指向任何地方。
- 理論框架：工作記憶模型＋Kintsch 的 construction-integration（situation model）。作者自建「超文本閱讀歷程模型」（Fig. 1），提出四個預測（p. 1620）：
  1. 有內嵌連結的超文本比線性文本認知負荷高；
  2. 連結越多負荷越高；
  3. 指向語意遙遠資訊的連結比指向相近資訊（如階層下層）的干擾大；
  4. 負荷增加會破壞 situation model，導致理解變差與迷失感。

## 可引用結果

1. **連結數量：方向支持但不一致**（§2.1, p. 1621–1622）。
   - Zhu (1999)：每節點 3–7 個連結比 8–12 個連結學得好（選擇題與摘要），使用者也較喜歡。
   - McDonald & Stevenson (1996)：線性 < 階層 < 非線性（連結最多）的導航速度遞減。
   - 但 Mohageg (1992)、McDonald & Stevenson (1998) 沒差；Lin (2003) 高齡者在 70 連結網狀文本反而較快，但走了更多不必要連結。
   - 原句：「Thus, the effect of number of links was inconsistent across studies although there was little evidence that more links led to better performance.」（p. 1622）
2. **加語意（橫向）連結：較一致地負面**（p. 1622–1623）。
   - 「In contrast to these inconsistent findings with respect to number of links, the effect of adding semantic links was more consistently negative. In four of the five studies, navigation was slower in hypertexts that included semantic links than in those that were strictly hierarchical」。
   - 作者解釋：「Semantic links may have obscured the hierarchical nature of the texts. These studies suggest that the type of links, rather than the sheer number, may be an important factor in comprehension.」
   - 注意：這四篇量的是**導航效率**（找答案的速度），不是理解或記憶。
3. **§2.1 小結**：「the impact of decision-making on comprehension has not been tested using direct manipulations of decision-making load. Hierarchical structure of a text usually helped navigation whereas obscuring the inherent hierarchical structure of the information by adding lateral links sometimes impaired navigation」（p. 1623）。
4. **工作記憶低、先備知識低的人受害較多**（§2.2）。Lee & Tedder (2003)：線性文本事實回憶最好，低工作記憶者的線性優勢最大。高齡者在階層式比網狀式記得多（Lin 2004）。Hailey & Hailey (1998)：A 等學生兩種文本一樣好，B、C 等學生在超文本較差。
5. **超文本 vs 線性的學習**（§2.3, p. 1628）：「results of studies comparing linear texts to hypertexts did not support the view that hypertext was better for learning, and sometimes it was worse because students may have missed important information.」
   - 例外：Eveland et al. (2004) 非線性文本事實回憶較差，但受試者評的概念關聯度（knowledge structure density）較高；Jonassen & Wang (1993) 生成語意網路。
6. **先備知識**：低知識者在**階層式、與領域結構一致**的超文本受益（Calisir & Gurel 2003；Balcytiene 1999；Potelle & Rouet 2003：低知識者用階層地圖比語意網路地圖或字母清單推論題好）；高知識者幾乎不受影響；「there was no evidence that students with high knowledge derived benefit from the flexibility of hypertext」（p. 1629）。
7. **未標示的連結不幫助理解；有標示目的地內容的連結有幫助**（p. 1629–1631）。
   - 「A link does not serve to develop the situation model: a link tells merely that more information is available, but not how the linked text is related to other elements of the situation model.」（作者依 van Dijk & Kintsch 的推論）
   - 連結預覽（Cress & Knabel 2003）、目的地描述（Zhao et al. 1994）提升學習；有標籤的語意連結（如「definition」「contrast」）提升找資訊的正確率（Baron et al. 1996）。但只標示關係類型的彈出視窗（Jonassen & Wang 1993）對回憶沒影響。
8. **圖形總覽（graphical overview）不穩定**（§3, p. 1632–1633）。de Jong & van der Hulst (2002)、Chen & Rada (1996) 統合分析（7 篇）有正面結果；但 Dias & Sousa 1997、Heo & Hirtle 2001、Jonassen & Wang 1993、Nilsson & Mayer 2002、Schwartz et al. 2004 沒改善或更差。Jonassen & Wang：地圖組的事實回憶比清單組低。「When overviews are visually complex, the increase in cognitive load required to use the overview may detract from the overall processing」（p. 1633）。Wright et al. (1990)：圖可隨時看時幾乎沒人看；系統主動插入時理解變好。
9. **明確結構提示反而不幫理解**（p. 1633–1635）。Niederhauser et al. (2000)：越常用「compare and contrast」跳轉功能的人後測越低，依序讀的人表現較好。Shapiro (1998)：無結構標示的超文本寫作分數最高，線性居中，高度結構標示最低。小結：「features added to hypertext to make explicit the text's structure did not enhance reading comprehension」。
10. **總結論**（§4, p. 1635–1636）：
    - 「In general, we found that hypertext features that introduced novel structures or required additional processing (e.g., navigating from semantic maps) decreased readers' comprehension relative to linear texts or hypertexts without these features.」
    - 「Hypertexts that were structured to capitalize on the inherent organization of the domain (usually hierarchical structures for informational content) often resulted in better comprehension, memory, and navigation.」
    - 「Notably, our review uncovered very little support for the idea that hypertext will lead to an enriched experience of the text.」
    - 「none explored long-term comprehension and memory for information presented in various text formats.」

## 作者列的限制

- 無法做統合分析，只能報告各群研究的模式。
- 研究間的 breadth、depth、topology 沒有系統操弄或控制，所以連結數量的效應無法分離。
- 決策負荷從未被直接操弄（雙重作業研究只有 2 篇，Wenger & Payne 1996、Plass et al. 2003，前者沒找到效應）。
- 沒有任何研究測**長期**理解與記憶；少有研究看投入感或樂趣。
- 敘事文本只有 1 篇（Miall & Dobson 2001）。
- 高知識者在所有條件都表現好（天花板），所以「高知識者能從超文本彈性受益」的預測不能否定。
- Barab et al. (1999) 的線性優勢可能是因為線性讀者讀到更多內容。

## 與摘要或常見轉述不一致處

- 摘要說「the increased demands of decision-making and visual processing in hypertext impaired reading performance」「Consistent with our predictions」，但正文對「連結越多越差」的結論是**不一致**（inconsistent across studies），且「the impact of decision-making on comprehension has not been tested using direct manipulations」。摘要的語氣比正文強。
- 「語意連結較一致地負面」那 4/5 篇量的是導航速度，不是理解；把它寫成「密集連結讓人理解變差」是過度延伸。
- 常見轉述「超文本讓人迷失（lost in hyperspace）」：本綜述中迷失感的直接證據主要是 Miall & Dobson (2001) 的文學閱讀（假超文本，連結其實都指向同一頁），以及受試者自評；不是大量研究的穩定結論。
- 本綜述的情境是**讀別人寫好的超文本**（學習材料），不是**自己建立並維護的個人筆記網路**。作者的機制（每個連結都要決策、跳轉打斷 situation model）可以類推到「讀自己的筆記庫」，但沒有研究直接測過。
- 「階層結構有幫助」的條件是「與知識領域的內在組織一致」且多對低先備知識者；對高知識者（例如自己筆記的作者）多半沒差。
- 年代：檢索只到 2004；之後有 Madrid, van Oostendorp & Puerta Melguizo (2009, *CHB*) 直接操弄連結數量（見 _order3-saturation.md），本紀錄未讀其全文。

## 對 order 3 的意義（「密集連結」的反證候選）

- 可支持的說法：在 1990–2004 的超文本閱讀研究中，「多連結、網狀」**沒有**被證明比「少連結、階層」更好；加橫向語意連結常讓找資訊變慢；未說明「為何相連」的連結不幫助理解；有標示目的地內容或關係的連結有幫助；複雜的圖形總覽（類似 graph view）常沒被使用或反而增加負荷。
- 對 MOC 的啟示（推論）：階層式、與內容結構一致的入口對低先備知識讀者最有幫助——這比較像 MOC／索引頁的角色，而不是全圖 graph view。但這是讀者面的研究，不是筆記作者自己回頭用的情境。
- 必須標明的落差：(1) 被動讀者 vs 自建知識庫的作者；(2) 單次閱讀 vs 長期使用；(3) 研究多為大學生與教學材料；(4) 證據多為導航效率，理解證據較少且混雜。

## 讀取紀錄

- 1–52 行：p. 1616 標題、作者、摘要、關鍵字、引言開頭。
- 53–131 行：p. 1617–1618 §1 引言、§1.1 Overview、§1.2 Methods（檢索、38 篇、術語、為何不做統合分析）。
- 132–202 行：p. 1618–1620 §1.3 理論（工作記憶、Fig. 1 歷程模型、四個預測）。
- 204–257 行：p. 1620–1621 §2 雙重作業研究（Wenger & Payne；Plass et al.）。
- 258–373 行：p. 1621–1623 §2.1 決策負荷（連結數量、語意連結、限制路徑、小結）。
- 375–541 行：p. 1623–1627 §2.2 個別差異（工作記憶、年齡、認知風格、能力、小結）。
- 543–737 行：p. 1627–1631 §2.3 situation model（超文本 vs 線性、先備知識、連結標籤、連結預覽）。
- 738–777 行：p. 1631 §2.4 Summary。
- 780–954 行：p. 1632–1635 §3 介面功能（圖形總覽、Wright et al.、複雜總覽、compare-and-contrast、Shapiro 1998/1999、小結）。
- 956–1038 行：p. 1635–1637 §4 Discussion 與研究議程。
- 1040–1249 行：p. 1637–1640 致謝、參考文獻（逐條掃過，計數 38 個 *）。
- 1250–1256 行：p. 1641 作者簡介。
