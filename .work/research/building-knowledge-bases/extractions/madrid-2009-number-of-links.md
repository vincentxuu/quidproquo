# Madrid, van Oostendorp & Puerta Melguizo 2009 — 連結數量、導航支援與認知負荷

read_status=read（accepted manuscript 全文 22 頁，從標題讀到參考文獻最後一條）

## 書目

- Madrid, R. I., van Oostendorp, H., & Puerta Melguizo, M. C. (2009). The effects of the number of links and navigation support on cognitive load and learning with hypertext: The mediating role of reading order. *Computers in Human Behavior*, 25(1), 66–75. DOI 10.1016/j.chb.2008.06.005。
- 單位：Universidad de Granada 實驗心理學系（Madrid）；Utrecht University, Center for Content and Knowledge Engineering（van Oostendorp、Puerta Melguizo）。經費：西班牙科教部 SEJ2004-05430。
- 讀的版本：**作者 accepted manuscript**（Universidad de Málaga 典藏 RIUMA，`https://riuma.uma.es/bitstreams/bc680a4a-8ccc-4941-8b82-a83b5cbe72c5/download`；首行寫「This is the accepted manuscript version of the paper」）。不是期刊排版版，**沒有期刊頁碼**，下面引用以節號／表號標位置。Fig. 1–5 的圖在 pdftotext 中沒有內容，只有圖說；數字取自內文與 Table 1–5。
- `curl -L -A "Mozilla/5.0"` → 22 頁 PDF → `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/madrid2009.txt`（1,017 行，61,481 bytes）。

## 設計

- **目的**：直接檢驗 DeStefano & LeFevre (2007) 的預測——每頁連結越多，認知負荷越高、學得越差；同時檢驗「連結建議」能不能降負荷、助學習（§1、§3）。
- **受試者**：Utrecht University 學生 45 人，刻意找與主題（腦解剖與功能）無關科系（多為數學、社會學、資訊科學）以取得**低先備知識**樣本；3 人沒照指示被排除，**分析 42 人**（§4.1）。先備知識測驗平均 4.98／10（SD 2.18），所有分析都把它當共變數（§5）。
- **設計**：2 × 2 受試者間——每頁連結數（3 vs 8）× 支援（無 vs 連結建議）。每格約 10–11 人（由 Table 3 加總：3 連結無支援 11、3 連結有建議 10、8 連結無支援 10、8 連結有建議 11）。
- **材料**（§4.3）：神經心理學入門電子教科書（Boeree 2003）改寫，4,440 字，依主題切成 **21 頁**。
  - **連結放在左側選單，不是內嵌在文字裡**。讀的時候選單隱藏，按「I have finished reading」才出現；點完連結選單又消失。目的是把「閱讀」和「選連結」兩段分開量負荷。
  - 選單內容：每頁用 LSA 算出與剛讀完內文最相關的 **2 個**連結一定出現，**其餘（補到 3 或 8 個）從連結標籤池隨機抽**。有支援組在這 2 個旁邊標「≫」。選單順序隨機。
  - 已讀頁面的連結變色；點了會提示已讀，必須另選。
- **程序**（§4.5）：先備知識測驗 → 反應時間基線（10 個嗶聲）→ 讀超文本，**必須讀完全部 21 頁**，並被**指示「永遠選看起來與剛讀內容最相關的連結」**（coherence strategy）→ 關聯判斷 → 文本題 → 推論題 → 人口資料。
- **量了什麼**（§4.4）：
  - 閱讀順序連貫性：每人所走路徑中相鄰頁面的平均 LSA cosine。
  - 認知負荷：雙重作業——聽到嗶聲按「z」的反應時間（扣基線），閱讀時與選連結時分開算；閱讀時嗶聲間隔 15–45 秒，選連結時 4–9 秒。作者把 mental effort 與 cognitive load 當同義詞用。
  - 選連結時間（每次選擇平均秒數，共 20 次）、閱讀時間（每字秒數）。
  - 學習：21 題文本題（答案在單一頁）、10 題推論題（需整合至少兩頁，測 situation model）、91 對概念關聯判斷（14 個概念）→ Pathfinder 網路與專家網路的相似度 C。

## 可引用結果

1. **連結數量對閱讀順序連貫性：邊緣**（§5.1, Table 1）。2×2 ANCOVA，連結數主效應 F(1,37) = 4.02, p = 0.05（作者稱「nearly significant」）；8 連結 M = 0.327（SD 0.053），3 連結 M = 0.348（SD 0.035）。支援主效應 F(1,37) = 4.84, p < 0.05；有建議 M = 0.351（SD 0.038），無 M = 0.324（SD 0.049）。無交互作用。
2. **連結數量與連結建議對認知負荷：完全沒有效果**（§5.2）。原句：「2 × 2 ANCOVA's using number of links and support as independent variables were performed using average cognitive load for reading and selecting links. No significant effects were found (for all, F < 1).」
   - 另：選連結時的負荷（M = 241.16 ms, SD 58.36）高於閱讀時（M = 174.42, SD 90.79），t(41) = −4.007, p < 0.01。
3. **連結多只讓「選」變慢**（§5.3）。選連結時間連結數主效應 F(1,37) = 5.04, p < .05；3 連結 M = 8.80 秒（SD 3.74），8 連結 M = 12.70 秒（SD 6.68）。閱讀時間無效果（all F's < 1）。作者解讀：「more time is needed for selecting when more links are presented can be interpreted as a direct consequence of having to read more link labels prior to make a decision」（§5.5）。
4. **連結數量對學習：沒有效果；連結建議對推論題有幫助**（§5.4, Table 2）。文本題兩因子都不顯著。推論題支援主效應 F(1,37) = 4.63, p < 0.05：有建議 M = 4.52（SD 2.16）vs 無 M = 3.33（SD 1.68）。Pathfinder 同方向但不顯著。無交互作用。§5.5 原句：「we did not find learning impairments for students using a hypertext with more links (H3a).」
5. **假設對照**（§5.5）：H1（連貫性）支持；H3b（建議助學習）支持；H3a（連結多學得差）不支持；**H2 全部不支持**——「Neither varying the number of links nor giving support or not had a significant effect on cognitive load.」
6. **每個條件裡都有人走出連貫或不連貫的路徑**（§5.5, Table 3）。以中位數 0.353 切高／低連貫：有建議組仍有 1/3 走低連貫路徑；無支援組也有 1/3 走高連貫路徑；最不利的「8 連結無支援」也有 20%（2/10）走高連貫。
7. **事後分組後，負荷差異跟著「讀的順序」走，不跟著「連結數」走**（§6.1, Table 4）。以連結數 × 閱讀順序（高／低連貫，中位數切分；建議因子因格子太小被拿掉）重跑 ANCOVA：
   - 閱讀時負荷：閱讀順序主效應 F(1,37) = 11.65, p < 0.01；高連貫 M = 149.14 ms（SD 30.62）vs 低連貫 M = 199.70（SD 68.57）。
   - 選連結時負荷：閱讀順序邊緣效應 F(1,37) = 3.02, p = 0.09；低連貫 261.75 vs 高連貫 220.56。
   - 「No significant main effect for number of links and no interaction effects were found (all F's < 1).」
8. **連貫路徑者推論題較好（邊緣）**（§6.3, Table 5）：F(1,37) = 3.41, p = 0.07；高連貫 M = 4.65（SD 1.84）vs 低連貫 M = 3.27（SD 1.96）。連結數無效果。
9. **作者結論**（§7）：「Results did not show any evidence of an increase in cognitive load during link selection when more links were presented nor a reduction in cognitive load when link support was offered. Actually, we found that the increase in cognitive load seems to be directly influenced by the way in which participants read the content.」
   - §6.4：「Readers can avoid high cognitive load either with 8 or 3 links if they have the needed abilities for a successful navigation.」
   - §5.5：「cognitive load can be largely dependent on user actions, and not only on system manipulation.」

## 作者列的限制

- **連結是選單，不是內嵌**：DeStefano & LeFevre 的預測是針對嵌在文字中的連結；本研究為了分開量閱讀與選擇負荷，把連結放在選單。「In future experiments, it will be interesting to examine the effects of the number of embedded links on cognitive load.」（§7）
- 先備知識：只招低知識者，但組內差異仍大，多項分析中先備知識共變數顯著；建議做專家反轉效應（Kalyuga 2007）的後續研究（§7）。
- 主題較簡單；更複雜或全新領域時，讀者選對順序的能力可能下降，支援會更有用（§7，推測）。
- 第二組分析把「連結建議」拿掉，因為格子太小（§6）。

## 與摘要或常見轉述不一致處

1. **摘要說「the effects of our manipulations on cognitive load were mediated by the reading order」，但操弄對負荷根本沒有效果**（§5.2, all F < 1）。內文沒有做任何正式中介檢定（沒有 Baron–Kenny、沒有間接效果估計），做的是**事後中位數切分**閱讀連貫性、再當成第二個自變項跑 ANCOVA。「中介」是作者的詮釋用語，不是統計結果。閱讀順序本身是受試者自己選的，不是隨機分派，所以「連貫順序 → 負荷低」只是相關，也可能是較有能力的讀者既走得連貫、反應又快（作者在 §6.4 自己也提到能力差異）。
2. **「連結多不增加負荷」不能直接讀成「連結越多越好」**。8 連結組多出來的 5 個連結是**從標籤池隨機抽的**，不是有意義的關聯連結；也就是「2 個相關 + 1 個隨機」對「2 個相關 + 6 個隨機」。本研究測的是「多加干擾選項」的效果，不是「多加有意義連結」的效果。連結多也沒有帶來任何學習好處（只是沒有壞處），而且確實讓每次選擇慢了約 4 秒、連貫性邊緣下降。
3. **受試者被指示「永遠選最相關的連結」**，且必須讀完全部 21 頁、已讀頁面不能重讀。這是高度約束的導航，不是自由瀏覽；自由情境下連結數量的效應可能更大。
4. **只報告顯著結果**：「In this paper, we only present the effects that were significant.」（§5）——非顯著效應多只寫「F < 1」，沒有效應量。
5. 排版錯誤：§5.4 寫 Pathfinder「though they did not reach statistical significance (p > 1)」，p 值不可能 > 1，應是筆誤；Table 1 的「0.344(0.46)」SD 應為 0.046。Table 2 文本題「3 連結＋建議」M = 8.70 反而是四格最低，作者未討論。
6. `_order3-saturation.md` 對本篇的摘要層轉述「連結數量對學習沒有效果，不支持『密集連結有害』的強版本」大致正確，但要補上：負荷也沒有被連結數影響；連結是選單形式；多出的連結是隨機的。

## 與本系列的距離（order 3〈怎麼連〉用）

- 受試者是**讀別人做好的教學超文本**的低先備知識大學生，單次實驗、立即後測。不是自己建筆記庫、自己決定連什麼、長期回頭用。
- 連結數 3 vs 8 是「每頁選單上的選項數」，不是筆記庫裡一則筆記的出連結或反向連結數；也沒有 Obsidian 那種內嵌 wikilink、反向連結面板或圖譜。
- 能支持的最強說法：**在讀別人的超文本時，每頁從 3 個加到 8 個選項（多的是隨機連結），沒有測到認知負荷增加或學習變差，只讓選擇變慢；真正跟負荷與理解相關的是讀者實際走的路徑是否語意連貫，而「標出最相關的連結」能提高連貫性與推論題表現。**
- 不能支持：「連結越多越好」（沒有好處的證據）；也不能支持「連結多增加認知負荷」（本研究就是對這個預測的直接檢驗，結果是零）。兩邊都不能用這篇站台。
- 可轉用的啟示（需標為推論）：連結的**相關性與標示**比數量重要——跟 DeStefano & LeFevre 2007「the type of links, rather than the sheer number, may be an important factor」一致。

## 讀取紀錄

- 2026-10-22。Exa 搜尋找到 RIUMA accepted manuscript → `curl` 下載 22 頁 PDF → `pdftotext -layout`。
- 依序讀：L1–299（書目、摘要、§1 引言、§2 理論、§3 假設 H1–H3）、L300–699（§4 方法、§5 結果與 §5.5 討論、§6 中介分析前段）、L699–1017（§6.3 學習、§6.4 討論、§7 結論與限制、致謝、參考文獻）。
- 未讀：期刊排版版（ScienceDirect 付費）；同團隊相關文章 Puerta Melguizo, Salmerón, Madrid & van Oostendorp (2009) *The Ergonomics Open Journal* 2:97（DOI 10.2174/1875934300902010097，Exa highlight 顯示「number of links per page had no effect on cognitive load」）與 ISLS 2008 會議版〈The Importance of Navigation Support and Reading Order on Hypertext Learning and Cognitive Load〉，可作重複驗證候選。
