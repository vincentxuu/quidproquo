# 審稿：order 24「教學文章的非母語讀者與手機讀者」

- 檔案：`src/content/posts/learning/2026-10-14-language-translation-mobile-reading.md`（只有中文稿，未審中英一致）
- 審稿時間：2026-10-14 19:04–19:13（台灣時間）
- sha256 審前：`2a8a568755d3fd14a435fcd34edda1ad94a38a36eb699021e126530b396a3bfe`
- sha256 審後：`2a8a568755d3fd14a435fcd34edda1ad94a38a36eb699021e126530b396a3bfe`（相同，審稿期間沒有人改檔）
- 核對依據：`.research/extractions/articles-that-teach/` 下 15 份抽取紀錄、`_audit/group-16〜20.md`，必要處回 `.research/raw/learning-content/` 原文檔；站內現況用 repo 與正式站實測。

## 必須修

### M1. Cloudflare Web Analytics 漏寫，「我不知道本站讀者有多少比例用手機」寫法不完整（L18）
- 正式站有 Cloudflare Web Analytics，由邊緣注入。驗證：用一般瀏覽器標頭 curl 文章頁，HTML 裡有 `static.cloudflareinsights.com/beacon.min.js` 的 `<script ... data-cf-beacon=...>`；不帶 Accept 標頭時看不到（order 16 踩過同一個坑）。我用 Playwright 量 28 個請求，其中一個就是這支 beacon（10,438 B）。
- Cloudflare 文件（developers.cloudflare.com/web-analytics/data-metrics/）列的維度包括「**Device type**: … desktop, mobile, or tablet」。所以本站其實有手機占比的匯總資料，只是這篇沒有去查。
- 同系列 order 16、18、19 都寫了 Cloudflare Web Analytics 這段，而且寫的是「量的是匯總的頁面瀏覽、造訪、來源網站、**裝置**…」。這篇偏偏就是在講裝置，卻說「不知道」，和其他篇對不起來。
- 修法：改成「正式站有 Cloudflare Web Analytics（邊緣注入，不在網站程式裡），它有匯總的裝置類型；這篇寫的時候我沒有去查手機占比」，或者實際查了再寫數字。寫法沿用 order 19 L20 那一句。另外附錄的量測說明可以補一句：28 個請求裡含這支 beacon（約 10 KB，算在 JavaScript 289 KB 裡）。

### M2. 課程導讀的字幕設定寫錯（L18、L226）
- L18：「本站的課程導讀……影片要不要開字幕、開哪一種，由讀者自己決定」。
- L226：「本站預設開英文字幕的 31 篇，包括英文跟讀練習的段落，也包括**幾篇**課程導讀的整堂錄影」。
- 實測（中文稿裡 ```youtube 區塊有 `captions:` 的檔案）：31 篇裡 **28 篇是 Stanford CS229／CS329A 的課程導讀**，每篇整堂錄影都設了 `captions: en`，`remarkYoutubeEmbed.ts` L113–115 會把它轉成 `cc_lang_pref` 加 `cc_load_policy=1`。剩下 3 篇是 `learning/2026-10-10-agency-ai-shadowing`（跟讀）、`ai/2026-10-07-poteto-trust-ladder-verification-first`、`ai/2026-10-13-meta-muse-launch-gate-eval-rows`。
- 所以「課程導讀的字幕由讀者決定」對這 28 篇不成立，「幾篇」也和 28／31 的實際比例差很多。可以做的事第 3 條說「後者的依據要另外想」，問題規模被寫小了。L214 的「447 篇、31 篇」本身正確。
- 修法：L18 改成「多數課程導讀不替讀者開字幕，CS229 與 CS329A 的導讀則預設開英文字幕」。L226 改成「31 篇裡 28 篇是課程導讀的整堂錄影，1 篇是英文跟讀練習」。

### M3. Kwak 的翻譯指標寫成「自動指標都高、標題低很多」，和原文 Table 1 不符（L125）
- Table 1（抽取紀錄 L27–38，已對 PDF 版面）：標題句 BLEU 偏低（17.72–61.27），**xCOMET 反而比題目句高**（例：GPT-4o 題目 91.88、標題 92.95；RAG 題目 92.06、標題 95.15）。原文 L969–971 也寫了：「Conversely, xCOMET scores were higher for titles, likely because xCOMET emphasizes semantic equivalence and is more forgiving of minor terminology errors.」
- 文章寫「各模型的自動指標都高；章節標題這類術語密集的句子低很多」，等於把 xCOMET 也算進「低很多」。抽取紀錄 L79 的摘要句同樣寫得太寬，文章照抄了過來。
- 修法：改成「題目句的 BLEU 各模型都在 84 到 94；章節標題這類術語密集的句子，BLEU 只有 18 到 61。另一個比較看語意的指標 xCOMET，標題句反而略高，作者的解釋是它對小的術語錯誤比較寬容。」附錄 Kwak 那段可以補 xCOMET 的數字。

### M4. Kizilcec 等 2020 的子群寫成「同樣定義」（L73）
- 文章寫：寫讀書計畫的提示，「放大後在同樣定義的子群沒有測到差異」。
- SI（`raw/learning-content/q3-activity/kizilcec2020_si.txt` L400–445）明寫子群定義一路在改：Wave 1 是「英語流利且打算完成」，Wave 2 拿掉「打算完成」只留英語流利，Wave 3 用英語流利，Wave 4 連英語流利的條件也拿掉。抽取紀錄 L121、L131 也有記。
- 這句剛好是這篇唯一拿來談「英語流利」的放大結果，子群定義有沒有改是重點。
- 修法：改成「放大後在對應的子群沒有測到差異（各波的子群定義有調整：先是說要完成且英語流利，後來只看英語流利，最後一波拿掉英語條件）」。
- 附帶：已發佈的 order 19 L163 也寫「和原始研究相同定義的子群」，雖然同篇 L248 又說定義改過，自己前後矛盾。建議主控順手修 order 19，不算這篇的必須修。

### M5. 把 Karp Gershon 與 Lee 的樣本說成「英文夠用／英文夠好的人」（L65、L224）
- L65：「英文夠用的非母語者，在完課與學科成績上沒有找到落後」。L224 依據寫：「Karp Gershon 與 Lee 的資料裡，英文夠好的人語言本身的影響沒有找到」。
- Karp Gershon 的「非母語」是用 IP 所在國家推的，**沒有量也沒有篩選英文程度**；比較只在高 HDI 國家之間做（抽取紀錄 L19、L76–77）。Lee 等人比的是 EMI 組對母語授課組，也不是依英文程度挑出來的人。真正有「英文程度高」這個樣本條件的只有 Guo（83% 自評熟練或完全流利）。
- L65 有標「是我的讀法」，但樣本的描述本身就錯了。L224 的依據欄把它寫成資料的性質。
- 修法：L224 依據改成「Karp Gershon（高 HDI 國家之間，以國家推定母語）與 Lee（大學 EMI）都沒有找到語言本身的影響；Guo 的受訪者多數英文熟練，自述的困難是讀得慢、卡在術語」。L65 同樣把「英文夠用的」從前兩份資料的描述裡拿掉。

## 建議修

1. L32 表格：雙語字幕寫「和母語字幕相當」，建議改成「和母語字幕沒有測到差異」，符合寫稿說明「不寫一樣好」的規則（Wang 的 p = .97，Liao 四種條件都不顯著）。
2. L35 表格：「需要捲動時較明顯」只有 Clinton-Lisell 一份把資料分開算；Delgado 的調節差異不顯著，Salmerón 只有 5 個效果量。這和 L206 的衝突節對不上，建議補「（只有一份分開算出）」。
3. L28 表格：「富裕國家之間」建議改成「高 HDI 國家之間」。HDI 含教育與壽命，不等於富裕，正文 L45 也是用 HDI。
4. L65：「這群人多數自評英文閱讀熟練或完全流利」接在 7% 的子群後面，讀起來像是在講那 7%。83% 其實是全部 656 位非母語者，建議改成「受訪的非母語者 83% 自評……」。
5. L18：「每篇中文文章都另有一篇英文版，目前是 2,788 篇中文對 2,787 篇英文」。我審的當下，git 追蹤的是 2,786 篇中文對 2,785 篇英文，工作目錄是 2,793 篇對 2,787 篇（多出來的是今天新寫、還沒翻的稿）。長期缺英文版的是 `food/2026-07-25-pour-over-dripper-trapezoid-vs-cone`，所以「每篇」不成立。建議改成「幾乎每篇中文文章都有英文版（2026-10-14 約 2,790 篇對 2,790 篇）」，或者不寫精確數字。
6. L18「英文版由 AI 依本站的翻譯規格產生，預設是改寫」：`post-translate` 的 SKILL.md L48 確實寫「預設用『改寫』」，skill 在 2026-05-10 加入，比最早的英文檔（2026-06-11）早，所以寫法大致成立。不過新增英文檔的 749 個 commit 裡，帶 AI 共同作者標記的是 611 個；其餘 138 個的作者是 xiaoxu／VincentXu／Claude，從 git 證明不了全部都是 AI。另外規格的預設是改寫，不代表每篇都照預設翻。最多寫到「英文版是 AI 依本站的翻譯規格翻的，規格預設改寫、不逐句直譯」；如果要更保險，加「絕大多數」。
7. L183–188 的量測：建議把「2026 年 10 月」改成確切日期與時間。第 1 篇在今天 18:22 還改過（commit ac323386），我 19:10 重測時頁高已經是 25,994 px（約 36 個畫面，不是 34 個），HTML 是 458 KB，其餘幾項都對得上（見下）。
8. 「對照本站」那張表可以補一筆：英文版也預先載入同一個 1.4 MB 的中文字型。我量英文版第 1 篇時字型照樣下載，傳輸 1,840,308 B。英文讀者完全用不到這個字型，這是本站很具體的頁面重量問題。
9. L87 Pannatier 的引文在「choice of language」截斷，原句後面還有「(native or same language as narration)」，建議補上括號或加刪節號。
10. L115：「多學會約 3 個百分點」，3.11 是原文 Table 3 的數字，沒問題。只是「13.75% 對 10.64%」沒寫出來，讀者不知道基準。建議在正文加這兩個數字。
11. L18 開頭的句型「起因是本站自己的形狀」和 order 19、order 21（forums）一模一樣，系列連著讀會覺得是模板，建議換個說法。
12. 標籤：`check-post-quality` 對 `blog`、`mobile` 發出 WARN（不擋 commit）。我的判斷是兩個都留。`blog` 是系列 24 篇共用的標籤。`mobile` 是既有標籤，order 2 與 order 14 已經用它標手機版面，這篇有一整節在講手機。缺的反而是語言、翻譯、字幕這一半的主題完全沒有對應的標籤；如果要加，只能新開，例如 `translation`。依 writing-guide 的「核心主題在前」，也建議把 `mobile` 往前移。

## 沒問題的項目

- **重測的本站數字**（2026-10-14 19:10，Playwright 1.58 的 Pixel 5 裝置設定，CDP 關快取，量正式站第 1 篇中文版）：總傳輸 1,874,828 B／28 個請求（文章寫 1,877,709）；字型 `NotoSansTC-Medium.otf` 1,401,589 B（寫 1,401,562，curl 下載是 1,396,115 B）；JavaScript 285,489 B（含 Cloudflare beacon）；HTML 傳輸 149,813 B；視窗 393 × 727；內文 16 px、行高 28.8 px、段落寬 325 px；**表格 1,682 px，外框 367 px，`width: max-content`**（PostLayout.astro L660–661）；詞彙表 `<script id="glossary-data">` 270,394 B（寫 270,403）。字型在 PostLayout.astro L95 用 `rel="preload"`，L161 設 `font-display: swap`，和文章描述一致。1.79 MiB 與 1.34 MiB 換算正確。英文版：1,840,308 B（寫 1,835,491）、頁高 39,213 px（寫 37,911）。「約」字頭的數字都還成立。
- 447 篇中文稿嵌 YouTube、31 篇設 `captions`：數字正確（問題在 M2 的描述）。不依瀏覽器語言導向：帶 `Accept-Language: en` 打首頁回 200、沒有轉址，src 裡也沒有讀 accept-language。頁面有 hreflang 與 TOC。
- **使用者指定的四點**：
  - Salmerón 不含手機：納入標準 L202 原句是「studies that only included computers … or mobile phones … were discarded」，文章 L157 寫對了。
  - Clinton-Lisell 捲動組手機不顯著：0.48，CI −0.14 到 1.10，p = .13，文章 L148–149 寫對，也指出了摘要寫過頭的地方。
  - Liao 實際 15–18 人：L103、L241 都寫對了（眼動 16、負荷 18、回憶 15）。
  - Kwak 沒量學習：L121 寫對，有引作者「未來工作」的說法。
- **英文引文逐字比對**：Kizilcec & Cohen「Moreover, our pattern of results does not appear to be related to English proficiency per se.」（原文 L498）、Pannatier（原文 L288，只差截斷，見建議 9）、Kwak「The models tested … like section titles」（nolayout L968–969）、Clinton-Lisell「For college students … may be useful.」（原文 L1976–1980，只有斷字差異）。全部相符。
- **數字逐項核對**：Karp Gershon（1.076、1.83→55%、47% 的性質、五門／四門、0.49）、Lee（0.13、0.04、0.41、1.57、限制）、Kizilcec & Cohen（6.6–8 分、32%／15%、1.8／3.8 有標「我從原文表格算的」、實際障礙占比）、Pannatier（131 人、各級人數、p 值）、Wang（27.93／27.38／23.48、69% 有標換算、0.42／0.20、限制第一條）、Kurokawa（0.56、0.14、6 個實驗半數 TED、前測 1.01 對 0.29–0.35）、Delgado（0.12 p = .11、0.25／0.13 p = .06、QB）、Honma（34 人、3,060／3,067 字、F = 26.445、前額葉主效果不顯著、探索性）、Russell（9／3／100、A24、2.6 MiB、9 倍、P90–95）。都和抽取紀錄一致。抽查 `_audit/group-17、18` 這幾份紀錄也都標「通過」。
- **⚠ 來源處理正確**：Kizilcec 等 2017 Science 只寫「存在、沒讀到」，沒有引數字，也沒有列進參考資料。Türkay 有標轉引。
- **不顯著的寫法**：全文用「沒有測到差異」，L39 有定義，沒有出現「沒有效果」或「一樣好」（例外是 L32 的「相當」，見建議 1）。
- **研究者代名詞**：沒有單數性別代名詞；「他們」只用在作者群與受訪者群。
- **和已發佈各篇比對**：
  - order 4（Guo 656／840、35%、7%；Dasgupta & Hill）：一致。
  - order 9（Delgado g = −0.21，符號慣例在附錄有說明）：一致。
  - order 19（247 門課、49.7–55.4% 流利）：一致，例外是 M4 的「同樣定義」。
  - 沒有重複展開已寫過的內容。
- 連結：6 個站內連結的檔案都存在，而且已被 git 追蹤。外部連結 17 個回 200；6 個 DOI（APA、PNAS、Wiley、ACM ×3）用 curl 回 403，屬出版者擋機器人，我用 doi.org handle API 查過，這 6 個都已註冊並導向正確的出版者頁。
- 用語：`check-tw-terms.mjs` 0 命中，手掃替換表也沒有命中。

## 需要人判斷的事項

- 「英文版由 AI 依本站翻譯規格產生」能寫到什麼程度：見建議 6。我的結論是可以寫，但不要加「每篇」，git 能證明的是「絕大多數」。
- Cloudflare Web Analytics：見 M1。這不是寫錯，而是有資料沒查還說不知道。要嘛有人進 Cloudflare 後台看手機占比，把數字補進去；要嘛照 order 19 的句型寫明「有裝置的匯總資料，這次沒查」。
- tags：見建議 12，`blog` 與 `mobile` 都留。

## 沒做的事

- 中英一致：沒有英文稿，跳過。
- 沒有進 Cloudflare 後台查手機占比（我沒有權限）。
- 沒有在限速條件下量測，也沒有量其他文章。
- 沒有重讀每份原文全文；數字以抽取紀錄為準，引文與 Kwak、Kizilcec 2020 的子群定義回原文檔核對過。Lee、Wang、Salmerón 的刊出版沒有核對（作者自己已經聲明）。
- 沒有開瀏覽器看渲染後的頁面（這篇還沒部署）。

## 2026-10-14 複審

- 時間：19:32–19:33（台灣時間）。sha256 審前與審後都是 `c6806115d25cc023a9e8b54089c469e46992bcb813efb5cc453803a1ecbd8e96`，複審期間檔案沒有變動。

### 逐項確認

- M1 Cloudflare：L18 補上了，也寫了「這篇寫的時候我沒有去查手機占比」；L185 和附錄註明 JavaScript 含 beacon 10,438 B；參考資料加了 Cloudflare 文件。原則上改好，剩下的寫法問題見「仍須修」1。
- M2 字幕：L18 改成「多數課程導讀不替讀者開字幕，Stanford CS229 與 CS329A 的導讀則預設開英文字幕」，L227 寫「31 篇裡 28 篇是課程導讀的整堂錄影、1 篇跟讀、另 2 篇一般文章」，和我的實測相符。另外查到：帶 `course-guide` tag 又有嵌影片的 93 篇都沒有設 captions，「多數」成立。
- M3 Kwak：L125 與附錄 L276 改成 BLEU 84–94 對 18–61，並寫明 xCOMET 標題句反而略高，作者的解釋是 xCOMET 對小的術語錯誤比較寬容。回原文核對：nolayout L969–971 是「Conversely, xCOMET scores were higher for titles, likely because xCOMET emphasizes semantic equivalence and is more forgiving of minor terminology errors」，Table 1 的 91.88／92.95、92.06／95.15 也正確。新寫法正確。「84 到 94」「18 到 61」是 84.42–94.25、17.72–61.27 四捨五入的結果，可以接受。
- M4：L73 改成「對應的子群」，並列出各波定義的調整。已改好。
- M5：L65、L225 改成「高 HDI 國家之間，以國家推定母語」「兩份都沒有依英文程度挑人」。已改好。
- 建議 1–12：L32「沒有測到差異」、L35「只有一份分開算出」、L28「高 HDI 國家之間」、L65「受訪的非母語者有 83%」、L87 引文補上括號、L115 補 13.75% 對 10.64%、L183／L290 寫明 19:22 量測時間、L219 補英文版預載中文字型、開頭句型換掉，都確認改了。tags 改成 `[learning-science, mobile, translation, …]`，`translation` 是新 tag，站上沒有其他篇用；寫稿說明允許新增一兩個，可以接受。

### 重測（19:32，條件同前）

- 總傳輸 1,878,234 B／28 個請求（文章寫 1,881,703，「約 1.88 MB」成立）；字型 1,401,556 B（約 1.40 MB 成立）；頁高 25,994 px（和文章一致，約 36 個畫面）。
- 表格 1,682 px、外框 367 px，段落寬 325 px。
- 都和改後的文字相符。

### 仍須修

1. **Cloudflare 的寫法和其他篇不一致，連結的頁面也沒寫「裝置」**（L18）。
   - 其他篇的統一寫法是「正式站至少載入了 Cloudflare Web Analytics」（order 16、18、19 的開頭都已改成這樣），本篇還是「正式站有」。
   - 本篇寫「它量的是匯總的頁面瀏覽、造訪、來源網站、裝置與頁面載入效能」，但連結的 data-metrics 總覽頁裡沒有 device 這個字；「Device type: … desktop, mobile, or tablet」在子頁 https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/ （L25）。
   - 建議改成「正式站至少載入了 Cloudflare Web Analytics（邊緣注入，不在網站程式裡）；流量統計是匯總的，依 Cloudflare 的文件，可以依[裝置類型](…/dimensions/)分開看。這篇寫的時候我沒有去查手機占比」。參考資料 L311 也一併改成指向 dimensions 頁，或兩頁都列。
2. **新的不一致**：L212 對照表第一列還是「每篇中文文章都有英文版，由 AI 依翻譯規格產生」，和改後 L18 的「絕大多數……絕大多數是 AI」矛盾，要改成同一個說法。

### 其他

- 沒有發現其他新的錯誤。
- `check-tw-terms` 0 命中；`check-post-quality` 對 blog、mobile 仍有 WARN（不擋，判斷同前）。
- 開頭還沒有 `> 🌏 English version` 那行，寫稿說明說英文稿之後補，不算問題。

## 2026-10-14 英文稿

- 時間：19:53–19:58（台灣時間）。
- sha256 審前與審後相同：
  - en `dd7f61f81b7526386c010fed9902aa03db688371666d7a525120e64203cedf4b`
  - zh `f17aee0c4e07f577e238d3df232dc1ed9bdda5fb9b17018d0e785b103ae9eef6`

### 複審兩項確認

1. Cloudflare：中文稿 L20 已改成「正式站至少載入了 Cloudflare Web Analytics」，並連到 dimensions 頁說明有裝置類型的匯總資料；參考資料 L313 也已改指 dimensions 頁。已改好。
2. 中文稿 L214 已改成「絕大多數中文文章都有英文版，絕大多數由 AI…」，和 L20 一致。已改好。

### 必須修

1. **代名詞從名字推測**（en L192）：「within **his** 2.0 MiB budget」用 his 指 Russell，原文沒有提供可依據的資訊。改成「within Russell's 2.0 MiB budget」或「the 2.0 MiB budget」。全文其他地方沒有 he／she／his／her。

### 建議修（英文自然度，沒有內容錯誤）

1. L198：「Türkay asking about language in a survey **where** they inferred it from IP」，where 應該是 whereas，否則讀起來像同一份問卷，意思就錯了。建議改成「Türkay asked about language in a survey, whereas Karp Gershon and colleagues inferred it from IP」。
2. 中文主題句前置的直譯句型，建議改成英文語序：
   - L171「whether phones add a further gap, the evidence is not enough to say」→「the evidence is not enough to say whether phones add a further gap」
   - L181「Whether slow pages … learn less, I found no study.」→「I found no study on whether …」
   - L200「Which of these is the main cause, no study has compared directly.」→「No study has directly compared which of these matters most.」
3. L24「the meta-analyses are mostly university students」→「mostly involve university students」。

### 確認沒問題

- **中英一致**：逐段對過正文、表格、附錄、限制與參考資料。自動比對兩版的數字，差異只有標點黏連與「159 萬」對「1.59 million」、「八成」對「80%」這類換寫；外部連結集合完全相同。對照表八列一一對應，包括英文版預載中文字型那一列。28／31、xCOMET、子群定義、19:22 的量測值，兩版一致。
- **英文引號逐字**（各自回原文核對）：
  - Kizilcec & Cohen：「Moreover, our pattern …」，原文 L498。
  - Pannatier：含括號的完整句，原文 L288。
  - Kwak：「The models tested … like section titles」，nolayout L968–969。
  - Clinton-Lisell：「For college students … may be useful.」，原文 L1976–1980。
  - 摘要用語「notably better」，原文 L44。
  - 以上全部相符。
- **連結**：6 個站內英文連結的檔案都存在，連結文字和各篇英文標題一致。量測一節連到中文版 Part 1，有標註「in Chinese」，符合正在進行的改法。中文版連結 `> 🌏` 與英文版的互連都有。
- 系列名稱「Writing Articles That Teach」和其他英文篇一致；section five 的名稱只有這篇用到，沒有對照對象。
- 單數 they（「their first language」）用法正確。
- 補記：19:54 審後再算一次，en 的 sha256 已變成 `3f811cd4fe1e9b88070e311e2200da30a92c6b14739bd0fd4bebcaa90c914468`，表示審稿途中有人改了英文稿。
  - 查過改動內容：只有 L185 量測一節的連結，改成「Loading the Chinese version of [Part 1](…teaching-text-evidence) (in Chinese)」，正是主控說正在改的那一處。
  - 上面所列的必須修與建議修，在新版裡都還在，結論不變。

## 2026-10-14 英文稿修正確認

- 時間：20:13（台灣時間）
- en 檔 sha256：`8f5dda017de8daa67feb7a7afd1331380016fd604ae58d8898c6d1d7603bce00`

逐項確認：

- **L192（必須修）**：已改為「within Russell's 2.0 MiB budget」。全文已沒有 he、she、his、her、him。
- **L198**：已改為「…whereas they inferred it from IP」。
- **L171**：已改為「the evidence is not enough to say whether phones add a further gap」。
- **L181**：已改為「I found no study on whether slow pages or expensive data make readers learn less」。
- **L200**：已改為「No study has directly compared which of these is the main cause」。
- **L24**：已改為「mostly involve university students」。

上一輪的必須修與建議修全部處理完，英文稿沒有待修項目。
