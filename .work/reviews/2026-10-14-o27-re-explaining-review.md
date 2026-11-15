# 審稿報告：系列 order 27〈把別人的課重新講一次，值得嗎〉

- 文章：`src/content/posts/learning/2026-10-14-re-explaining-existing-courses.md`（只有中文稿，未審中英一致）
- 審稿者：獨立審稿（未參與撰寫），只讀不改
- 審前 sha256（2026-10-15 09:37）：`6769a9932a7758adff760500234adc37b154f3ab27d142b7e859b85e15af33e6`
- 審後 sha256（2026-10-15 09:41）：`6769a9932a7758adff760500234adc37b154f3ab27d142b7e859b85e15af33e6`（相同，審稿期間沒有人改檔）
- 依據：`.work/reviews/REVIEW-BRIEF-research-posts.md`、`.research/2026-10-14-writing-brief.md`、七份抽取紀錄（`.research/extractions/articles-that-teach/` 下 olah2017-research-debt、clinton2019-open-textbook-meta、hilton2020-oer-synthesis、koedel2017-textbooks、ginns2006-minimalist-meta、diataxis-site、mirhosseini2020-docable）、`_audit/` group-02/04/05/06/08/10/11（七份抽查全部「通過」）、清單 `.research/2026-10-13-reading-list-order-25-28.md`

## 總評

數字與引文的品質很好：我逐段對過七份抽取紀錄，正文與附錄的數字都找得到出處，限定條件（準實驗、±0.2 界限、6/11 個退選數字是索取的、0.08 那端不顯著、26% 是 Naive++ 且單位是區塊、40 篇樣本）都帶上了。⚠ 類來源（Blazar、Carroll 1987、Lazonder 1993）都只寫存在、沒引結果、沒列參考資料。英文引文 14 句回原文檔逐字比對全部相符（含彎引號）。必須修的是三處「說得比來源滿」或描述不準的地方，以及一處沒有來源的事實宣稱。

## 必須修

1. **L31（先看結論表）與 L9 tldr：把 d = 1.12 寫成「把現成手冊重寫成極簡手冊」的效果。** 抽取紀錄 ginns2006「與清單不合」第 4 點明寫「d = 1.12 不能寫成『極簡手冊』的效果：13 個裡有 3 個是 genetic growing system 對講師訓練；只算 minimal manual 的 10 個是多少，文件沒有分開報告」。正文 L144 有講，但表格與 tldr 直接把 1.12 掛在「重寫成極簡手冊」上。建議表格寫「極簡設計的教材對傳統做法（13 個效果量，10 個是改寫手冊）d = 1.12」，tldr 改成「極簡設計的教材（多數是改寫的手冊）效果很大」之類。L231「極簡手冊的研究比的是同一套軟體的兩份手冊」同理，補「13 個裡 3 個不是手冊」或改「多數」。
2. **L181、L195：把 6 位業界人士寫成「訪談」「受訪」。** 抽取紀錄 mirhosseini2020「研究設計」：6 位 informant 做的是 peer debriefing——看作者的發現、寫評估（p.4 §2.5.4）；原文沒有說是訪談。改成「研究請 6 位在大公司負責技術文件的人看結果並給意見」、L195「給意見的文件負責人意見分歧」。
3. **L155「技術文件圈最常被引用的分法是 Diátaxis」沒有來源。** 七份紀錄都沒有支持「最常被引用」的資料；Diátaxis 首頁自己的說法是「hundreds of documentation projects」採用（diataxis-site #6）。改成「技術文件圈常見的一種分法」，或改引首頁的採用說法並標明是它自己的說法。

## 建議修

- L221 本站流量：寫法「本站有 Cloudflare 的匯總流量統計」沒有寫「只有」，不矛盾，但和第 10、19 篇的固定說法不同。建議照第 19 篇 L20 的寫法：「正式站至少載入了 Cloudflare Web Analytics，流量統計是匯總的」，並連到[第 19 篇](/posts/learning/2026-10-14-why-readers-dont-finish)（已發佈）。
- L216 與 L219 CS50 AI 第 6 週對應 Diátaxis：表格那一列已標「這個對應是我的判斷」，L237 限制也列了；但 L219 那段本身只在最後一句標「這是我的推論」，指的是「該用它自己的方法判斷」。建議在 L219 的對應句前加「我的對應是：」。另外，第 6 週的「講課導讀」每節結尾都有一題附摺疊答案的自我檢查（w06 L83–88 等九處），文末還有「學習檢核清單」（L1024）；這些在 Diátaxis 偏教學，L219 只寫「最接近解說」漏了這一層，建議補一句。描述本身（前半講課導讀、兩個專案的任務／官方程式／解題思路／虛擬碼／容易出錯／怎麼檢查、完整參考實作摺疊在最後）我回 w06 檔核對過，正確；七週檔都有「講課導讀」與「完整參考實作」，表格的概括成立；「課程回顧」指 `2026-08-30-harvard-cs50ai-wrapup.md`，存在。
- L62「（第 22 篇提過這件事）」：第 22 篇 L245 只提 AI agent 起稿（並說第 29 篇會談這個流程），沒有提「另外的 agent 審稿」。改成「第 22 篇提過起稿這件事」。
- L29 表格：「等價檢定判為等同於零」補「（以 ±0.2 為界）」，正文 L72 與附錄有，表格少了。強度欄「學習那一側中到強」偏寬：I² = 98、底層多是準實驗、只有 8 個研究兩組用同一份測量，建議「中」。
- L30 表格：「學校成績高 0.05 到 0.065 個標準差」補「學生層級」；寫成學校成績容易被讀成學校層級標準差（那是 0.11 以上）。
- L107「換成一本內容相當的免費教科書」：Clinton & Khan 沒有確認內容相當，「品質相近」只是作者列的推測解釋之一（clinton2019 討論第 3 點）。刪「內容相當」。
- L90 Colvard：DFW 是 D、F 與退選，「不及格與退選率」把 D 算成不及格。改「拿 D、F 或退選的比率」。
- L101「學生的小考成績和他們對教科書的評分沒有相關」：這是 Hilton 轉述的 Landrum 2012，照證據規則寫「沒有測到相關」較穩。
- L126「另一份常被拿來對照的研究」：「常被拿來對照」沒有來源，改「另一份教科書比較」即可。Blazar 只寫存在、不引結果，符合規則。
- L202、L231「30 年前」：原始研究是 1985–1995，距今 31–41 年，改「三四十年前」或「1985 到 1995 年的」。
- L52「『解說是一種公共財』這個說法也是我的，原文沒有用這個詞」：正文前面沒有出現過這個說法（它來自清單），讀者會不知道在否認什麼。刪掉，或先寫出這個說法再標明。
- L157「也需要先習得再應用」：Foundations 原句是「both acquired, and applied」，沒有先後，改「需要習得，也需要應用」。
- L187「不考慮各研究的大小與方向強弱」：「方向強弱」不通，改「效果大小」。
- tags 的 `blog`：`check-post-quality` 警告標題與內文沒有對應詞；系列其他篇若也用就忽略。

## 沒問題的項目

- **來源核對**：七份抽取紀錄的數字逐項對過。Clinton & Khan（g = 0.01、SE、CI、I²、Z = −2.25、OR 0.71、6/11 索取、11 正 1 零 10 負、N 對不上、±0.1 是自算）；Hilton（16 篇、12 篇重疊、9／1、25 篇 11／1、114,419／27,710、Winitzky 兩份人數、Gurung、Colvard、Lawrence & Lester 74%／57%、Griffiths 29%／30%、COI 聲明、內部不一致三處）；Koedel（1,878 所／309 學區、0.45 換算、三種估計逐年數字、54–56 百分位、24 個估計 1 個顯著、point toward、0.08–0.17、34 美元／0.32%、12%）；Ginns（13／288、1.12 與 CI、Q、0.59／0.89、各研究 d、Merritt 軼事、integrated 字樣）；Docable（663／14,876、13%／26%、逾時 75%／39%、787 區塊分類、52.3%、47 個直接記失敗、約 56% 自算、E127）；Olah & Carter 與 Diátaxis 的主張與位置（正文／註腳）。紀錄標「我算的」的（27%、41%、22 人、56%、±0.1、Table 3 計數）文中都寫成「我算的／我數的」。
- **英文引文**：L42、L44、L56、L78、L101、L151、L159、L161（proven in practice、four and only four）、L163、L245（several forms、is just a start）、L255（runs counter…）、L119（point toward），回 `.research/raw/learning-content/q6-evaluate/` 原文檔逐字比對，全部相符；Research Debt 對的是去註解後的 `researchdebt.visible.txt`，沒有引到被註解掉的舊稿。
- **⚠ 來源**：Blazar（只有專案頁）、Carroll 1987、Lazonder & van der Meij 1993：正文只寫存在，不引結果，不列參考資料；附錄的這兩篇 d 值放在 Ginns 那一段、L238 明寫是 Ginns 表上的數字，轉引標示到位。兩個 DOI 用 Crossref 核過題名、作者、期刊與年份正確。
- **轉引**：Durwin & Sherman、Slavin & Lake、NRC 2004、Landrum、Hilton 逐篇摘要的原始研究、Koedel 的先前研究、Merritt，都標「我沒讀，是作者轉述」並列在 L239。
- **結論與證據**：Research Debt 的三點適用限制（研究者彼此、不能外包、作者意見）都寫了；開放教科書「比的是授權與價格」、Koedel「不是重講」、Docable「不是讀者照做的成功率」都當場交代；來源衝突（零 vs 小但為正、觀感 2 比 2 比 1、Diátaxis 首頁 vs Foundations、模糊寫法是不是缺陷）並列沒有選邊。開頭 L22 交代取樣偏誤；「可以做的事」每條標依據與「我的推論」；L237 列了七處推論。
- **不顯著的寫法**：L72、L88、L119、L189「沒有測到差異」；L72 指出摘要的「沒有顯著調節變項」是沒檢出。
- **Clinton 的成果測量**：L70「多數是課程成績或有沒有拿到 C 以上」、L232「多半是課程成績或州測驗」，符合紀錄。
- **研究者代名詞**：全文沒有單數的他／她；Olah 與 Carter 用「他們」（兩位作者），Chiorescu 用「老師」，Diátaxis 沒有寫作者姓名（紀錄說存檔核不到作者）。
- **粗體與全形標點**：用程式掃過所有 `**…**`，沒有收尾 `**` 前是全形標點、後面接文字的情況。
- **本站現況**（2026-10-15 09:40 查）：`course-guide-contract.md` 的四種角色（概念導讀、實作教學、課程總覽／地圖、作業／週次，L28–31）與設計依據列 Diátaxis（L80），和 L215 一致；CS50 AI 總覽、第 6 週、跨週整理（一）、CS229 第 1 堂四篇都存在且 draft: false；CS229 第 1 堂確實寫「依 Spring 2026 公開錄影的英文字幕」與主講義；第 3 篇有「本站的例子：CS50 AI 導讀的舊版專案程式」一節（L175）。
- **和已發佈各篇**：第 4 篇對 Research Debt 的說法（四項、立場文、只引顯示文字）一致；第 9 篇對 Diátaxis 的說法（首頁依據是採用與三則證言、Foundations 自己說不夠、從業慣例）一致，本篇補第三頁沒有重複；第 3 篇談的是 Pimentel／Yang 的片段可執行性，沒有引 Docable，不重複也不矛盾。沒有連到未發佈的篇（第 25、26、28、29 篇只寫「前面的篇」「之後的篇」）。
- **站內連結**：12 個全部存在（learning 8 篇、ai 2 篇、tech 2 篇）。
- **外部連結**（curl，2026-10-15）：diataxis.fr 三頁、distill.pub、doi 10.23915、10.1007、10.1006、ERIC PDF、chrisparnin.me PDF 都是 200；doi 10.1145、10.1177 ×2、10.1207 回 302 轉到 ACM／Sage／T&F 後被擋成 403（機器人驗證），Crossref 核過三個 DOI 的題名正確；cepr.harvard.edu/curriculum 對 curl 回 403，存檔 `blazar2019.md` 證明頁面存在。
- **用語**：`check-tw-terms` 0 命中；`check-process-leak` 通過；手掃替換表，「支持」都是論證或支援人的意思，不是軟體的「支援」。標題與 tldr 講的是對象與結論，不講查了多少。

## 指派訊息特別要看的項目

- CS50 AI 第 6 週對應 Diátaxis：是作者判斷，表格與限制有標，段落內建議補標（見建議修第 2 條）；描述與原文相符。
- 本站流量：沒有寫「只有」，但措辭和第 10、19 篇不一致（建議修第 1 條）。
- Blazar、Carroll、Lazonder：只寫存在；附錄效果量已標轉引自 Ginns。
- Clinton 的成果多是課程成績：有寫。
- 不顯著／英文引文／代名詞／粗體／重複矛盾：見「沒問題的項目」。

## 我沒做的事

- 沒有讀七份來源的原文全文，只對抽取紀錄核數字；引文另回原文檔逐字比對。沒有重做 `_audit` 的抽查。
- 沒有開瀏覽器看渲染頁面（依任務書不跑 pnpm dev／build）。
- 沒有審英文稿（尚未存在）。開頭沒有 `> 🌏 English version` 行，和其他尚未翻譯的篇（25、26、28）一致，翻譯時要補。
- 沒有查第 25、26 篇是否已發佈，只確認本篇沒有連過去。

## 2026-10-15 複審

- 複審時 sha256（09:44）：`818d3706aa456c4b2319062ef68ab9b201c27d241145516c423940ea6068d9d9`；審完再算一次沒有變動。
- **必須修三項都已修好**：L9／L31 改成「極簡設計的教材」，並註明「13 個效果量裡 10 個是改寫手冊」，L231 補了「13 個效果量裡有 3 個不是手冊」，和 ginns2006 紀錄一致；L181／L195 改成「請 6 位……看結果並給意見」「給意見的文件負責人」，和 mirhosseini2020 紀錄（peer debriefing）一致；L155 改成「常見的一種分法」。
- **建議修**：16 項全部處理（blog tag 依作者決定保留）。逐項核過：
  - L221 照第 19 篇的措辭改寫，並連到第 19 篇（已發佈）。
  - L219 前面標了「我的對應是」，並補上各節自我檢查與學習檢核清單；我回 w06 核過，九處 `<details>` 答案在 L83–474、檢核清單在 L1024，相符。
  - L62 改成「提過起稿這件事」，和第 22 篇 L245 相符。
  - L29 補「±0.2 為界」，強度改為「中」；L30 補「學生層級」；L107 刪掉「內容相當」。
  - L90、附錄 L249 改成「D、F 或退選」；L101 改成「沒有測到相關」；L126 刪掉「常被拿來對照」。
  - L202、L231 改成「1985 到 1995 年」（後續分析含 1995 年的研究，正確）；L52 刪掉公共財那句；L157 改成「需要習得、需要應用」；L187 改成「樣本大小與效果大小」。
- 殘留「30 年」「最常」「訪談」「受訪」「公共財」「內容相當」「不及格」：全文掃過，零命中。
- **新引入或殘留的小問題（建議修，不擋）**：
  1. L31 強度欄仍寫「全是 1985 到 1994 年的軟體手冊」，和同列「10 個是改寫手冊」對不上，建議改成「全是 1985 到 1994 年的軟體訓練教材」。
  2. L126「另一份教科書比較，是 Blazar 等人 2019 年的教科書比較」，「教科書比較」重複，可改成「另一份是 Blazar 等人 2019 年的教科書比較」。
- 檢查：`check-tw-terms` 0 命中；`check-process-leak` 通過；粗體收尾全形標點，程式重掃無問題。改動段落沒有新的中國用語。
- **結論：通過**。上面兩點是措辭，可以順手修。

## 2026-10-15 英文稿審稿

- 英文稿：`src/content/posts/learning/2026-10-14-re-explaining-existing-courses-en.md`，對照已定稿的中文稿 `src/content/posts/learning/2026-10-14-re-explaining-existing-courses.md`
- 審稿者：獨立審稿（沒有參與撰寫或翻譯），只讀不改文章
- 審前 sha256（2026-10-15，審稿開始時；當時沒有記下分鐘）：英文 `248435876691be822bc679b85448be3ac990b8a04959503e9837d8bc0c505028`；中文 `f30f0217696522d305e72f1303fe34ae3f34e57ca1ed03a8eaca3947fb7386fd`
- 審後 sha256（2026-10-15 11:38）：英文 `248435876691be822bc679b85448be3ac990b8a04959503e9837d8bc0c505028`；中文 `f30f0217696522d305e72f1303fe34ae3f34e57ca1ed03a8eaca3947fb7386fd`（相同，審稿期間沒有人改檔）
- 中文稿的雜湊和上一節複審時（`818d37…`）不同。我看過差異處：補了 `> 🌏 English version` 行，複審留下的兩點措辭（表格「軟體訓練教材」、「另一份是 Blazar 等人…」）也改了，沒有別的改動跡象。以下對照的是現在這一版。
- 行號以 `grep -n` 為準。兩份檔都是 273 行，段落逐行對齊。

### 結論

**通過，沒有必須修的項目。** 數字、表格、連結、引文、推論標記、轉引標記都和中文稿一致；下面的建議修都是英文措辭。

### 必須修

（無）

### 建議修

1. **L153**：「So these studies support *rewrites that went through task analysis and user testing work*, not *rewriting works*.」斜體裡的 work 是動詞，但很容易被讀成「user testing work」這個名詞。建議改成「*rewrites work when they go through task analysis and user testing*, not *any rewrite works*」。
2. **L74**：「the authors said the results were unreliable and could not be interpreted」。抽取紀錄（clinton2019 L121）的原文是「cannot be trusted」「inconclusive」，中文寫「不可信、無法判定」。「could not be interpreted」語意偏了一點，建議改成「could not be trusted and were inconclusive」。
3. **L181**：一句 83 字，夾著五類失敗原因和括號裡的例子。中文也是一句，但英文太長，建議拆成條列，或先寫「five categories:」再分成兩三句。
4. **L197**：「*the machine couldn't run it* is partly not the same as *a person following it would fail*」裡的「partly not the same as」不通順。建議改成「some blocks the machine couldn't run would not trip up a person following along」。
5. **L105**：「That readers liking something doesn't mean they learned from it was discussed in earlier parts, from the side of the signals an author has.」主詞是很長的子句，句子又是被動，讀起來是翻譯腔。建議改成「Earlier parts discussed, from the side of the signals an author has, why readers liking an article doesn't mean they learned from it.」
6. **L159**：「Why these two dimensions and no others, the page simply asserts without argument.」受詞提到句首，是中文語序。建議改成「The page asserts these two dimensions without arguing for them.」
7. **L44**：「The essay opens by comparing reaching research-level understanding to climbing a mountain」，「comparing reaching」連用動名詞很拗口。建議改成「The essay opens by likening the path to research-level understanding to climbing a mountain」。
8. **L236**：「Only three pages of Diátaxis were read.」是沒有主詞的被動，其他地方都寫 I。建議改成「I read only three pages of Diátaxis.」L76「the withdrawal figures were obtained privately from the original authors」也可以改成「the authors obtained … privately」，把動作的人寫出來。
9. **L217**：角色名稱「assignments and weeks」讀起來像兩種東西，看不出是一種文章角色。建議改成「assignment and weekly guides」。
10. **L86**：「Hilton did not compute effect sizes; Hilton summarized each study…」為了避開代名詞，同一句裡 Hilton 連寫兩次。可以改成「Hilton did not compute effect sizes, instead summarizing each study and counting…」。（不擋發佈）

### 沒問題的項目

- **數字**：寫程式逐行抽出中英兩份的數字比對。有差異的 11 行都是寫法轉換，例如「第二個研究」→ Study 2、三年級 → grade 3、十萬 → 100,000、50 萬美元 → US$500,000、1,900 萬 → US$19 million、2018 年 8 月 → August 2018、約四成 → about 40%、（一）→ (1)。沒有數字被改、多出或漏掉。七列結論表、五列本站對照表的列數與每格內容逐格對過，一致。tldr、description 也逐句對過。
- **內容增刪**：逐段讀過，沒有新增或刪減說法。限定語都保留了，例如「學生層級」、±0.2 為界、6/11 是索取的、10/13 是改寫手冊、單位是區塊、40 篇、「作者自述」、1985–1994 與 1985–1995 兩種寫法各在原位。
- **不顯著的寫法**：L90、L103、L117、L121、L190 都寫成「no difference / no correlation was detected」。L74 寫「none were detected, not tested and found absent」。沒有出現 no effect，也沒有把不顯著寫成 the same。L121 的「the other three are about the same」和中文的「差不多」一樣是轉述作者的判斷，後面接著寫了依據是不顯著、標準誤很大的點估計。
- **推論標記**：中文的「我的推論」「我的延伸」「我的判斷」「我算的／我數的」在英文都保留了，位置是 L54、L64、L184、L203、L216、L218、L177–178、L144、L249、L259，寫成 my extension、my inference、my reading、my calculation、I counted。
- **英文引文**：15 句（3 句區塊引文、12 句行內引文）都回 `.research/raw/learning-content/q6-evaluate/` 原文檔，用程式做逐字比對，全部相符，彎引號也一樣。對照檔包括 `researchdebt.visible.txt`、clinton2019oermeta、hilton2020oer-pdf、koedel2017textbooks、ginns2005minimalistmeta、diataxis-home、theory、howtouse。英文的引文集合和中文稿「」裡的英文引文一一對應，沒有多也沒有少。「point toward」我另外查了 Koedel p.7 的上下文，指的是兩兩比較（collectively, the pairwise comparisons point toward…），符合 L121 的用法。L103、L121、L163、L195、L247、L255、L257 把句末逗號或句號放進引號，是美式標點，字本身逐字相同。依 o12、o20 審稿的先例，這樣可以接受。
- **轉述沒有加引號**：中文用「」轉述的內容，例如「外包給不夠專業的非專家」「重寫就有效」「換一個版本」「機器跑不過」「N 個人互相理解」，英文改用斜體或直接敘述，沒有加引號。L18 引號裡是系列名稱與段落名稱，不是來源引文。
- **代名詞**：全文沒有 he、she、his、her、him。指 Hilton 時一律寫名字，指作者群時用 they 或 the authors。
- **篇號**：12 處都寫成 Part N（1、3、4、9、12、15、19、22、24、27）。
- **站內連結**：14 個目標檔都存在，都是 draft: false。其中 13 個是 -en 版，另一個是中文版互連。中文稿連到的站內頁，英文稿都改連對應的 -en 版，順序一致。參考資料裡的站內篇名和各 -en 檔的 title 一致（取前段）。本篇沒有連到第 25、26、28 篇，中文稿也沒有，所以不需要處理同批發佈的問題。
- **外部連結**：英文與中文的外部連結逐一比對，順序和網址完全相同（狀態碼已在上一輪 curl 檢查過，這次沒有重跑）。
- **frontmatter**：title、description、tldr 和中文對應；tags 相同（含 `blog`，依作者決定保留）；series order 27，系列名「Writing Articles That Teach」和其他 -en 篇一致；date 相同；lang: en；開頭有 `> 🌏 [中文版]` 互連。
- **檢查程式**：`node scripts/check-post-quality.mjs <英文檔>` → `OK: checked 1 post file, no quality issues found.`；`check-process-leak.mjs` exit 0。

### 我沒做的事

- 沒有重新核對來源數字。中文稿上一輪已逐項對過抽取紀錄，這次只核中英一致，加上英文引文逐字比對原文檔。
- 沒有重跑外部連結的 curl。
- 沒有跑 pnpm dev/build，也沒有看渲染頁面；沒有 commit。
- 沒有審第 25、26、28 篇的 -en 版（本篇沒有連過去）。
