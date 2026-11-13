# 審稿報告：order 21〈教學文章要不要開留言區〉

- 審的檔：`src/content/posts/learning/2026-10-14-forums-comments-community-learning.md`（只有中文稿，跳過中英一致）
- 審稿者：rev-o21（獨立，沒有參與撰寫）；只寫這份報告，沒有改任何其他檔
- sha256 審前（2026-10-14 19:04）：`8500160b0f50cf9aceaccf37f379f7b67b49ad627d3ead728e7074e3c9637856`
- sha256 審後（2026-10-14 19:10）：`0dd26f3554ab4c2ebb0a6e3f8fbe800179d5125e90dde8399c264eedb42781b2`
- **審稿期間有人改了檔**：只動了第 261 行，「本站也沒有讀者行為的資料」改成「本站只有匯總的流量統計，沒有個別讀者的行為資料」。我原本要列成必須修，現在已經修好（見「沒問題的項目」）。下面的行號以審後版本為準，兩版行號相同。
- 依據：`.research/2026-10-14-writing-brief.md` 的證據規則；13 份抽取紀錄（`.research/extractions/articles-that-teach/` 的 coetzee2014、wise2018、mehta2025、ou2025、loh2024、gillani2014、li2014、delrio-chanona2024、bridson2022、davis2018-activating-learning、kizilcec2020、crystal2026、camden2024）全部讀完；抽查 `_audit/group-16、17、18、19、20` 與 `provenance.md`。

## 必須修

1. **tldr（第 9 行）與第 51 行把講師回覆實驗也算成「動得了發文量」**。tldr：「隨機改變論壇設計（聲望制度、講師回覆）會改變發文量」。Tomkin 與 Charlevoix 2014 經 Davis 轉述是「completion rate or course engagement」都沒有差異（davis2018 紀錄 #10，L745–748），沒有發文量增加的結果；Kizilcec 2014a 的鼓勵發文提示反而讓參與**下降**（#7）。第 51 行「隨機實驗動得了參與量，動不了成績或完成率」也是同樣的概括。改法：tldr 寫「加上聲望制度讓回覆變多變快，成績沒有測到差異；講師積極回覆對不回覆，完成率與投入都沒有測到差異」；第 51 行改成「有的隨機實驗動得了發文量（聲望制度），有的沒有、甚至下降（講師回覆、集體框架提示）；量了成績或完成率的都沒有測到差異」。

2. **「論壇類實驗沒有一篇在成績或完成率上正向」要補分母（第 42、144 行，第 268 行同項）**。這句有標明是作者從 Davis 的表整理、回顧作者沒有這樣歸納（第 42、144、268 行都有標），標示本身合格，抽取紀錄 #19 也是同一個說法。但它站得住只是因為量了成績或完成率的只有兩篇：Coetzee 2014（成績、持續度 ∘）與 Tomkin 與 Charlevoix 2014（完成率 ∘）；Kizilcec 2014a 與 Lamb 2015 只量了論壇參與，根本沒量成績（davis2018 紀錄 #7–#10）。現在的寫法讓讀者以為有四篇測過成績都沒效果，結論超出證據。改法：第 42 行與第 144 行都寫成「量了成績或完成率的只有兩篇（Coetzee、Tomkin 與 Charlevoix），兩篇都沒有測到差異；另外兩篇只量發文，一篇正向、一篇負向」。Beheshitha 2016（Class 環境，∘ 論壇參與）不在 MOOC，不列也可以，但若說「論壇類」應註明只算 MOOC。

3. **Wise 與 Cui 的「非內容發文和成績沒有關係」把不顯著寫成沒有關係（第 168 行）**。原文：在及格的發文者裡，非內容串貼文數 r = .009（p = .878），不顯著；而且 6 個非內容變項裡有 1 個（NC betweenness r = .119）顯著（wise2018 紀錄 #10，Table 9）。違反「不顯著不寫成沒有效果」。改法：「在及格的發文者裡，非內容串的發文數和成績沒有測到相關（6 個非內容指標只有 1 個顯著）；內容串的指標 6 個有 5 個顯著，但最強的也只有 r = .19」。

4. **Bridson「發文集中在……截止日前」把作者的推測寫成結果（第 176 行）**。資料是週二到週四佔七成以上、週末 11%；「與截止日有關」是作者推測，教師說的是印象，紀錄標成軼事觀察（bridson2022 紀錄 #6，L608–616）。改法：「發文集中在晚上（19 點到凌晨 5 點佔 65%）與週二到週四（逾七成），作者推測後者和截止日多在這幾天有關」。

5. **Kizilcec 2020 的 8.8% 沒有標成自己算的（第 154 行，第 268 行的清單也漏了）**。抽取紀錄寫「312,221 ÷ 3,546,206，我算的」；寫稿說明要求本紀錄計算的數字寫成「我算的」。第 19 篇同一個數字有標（該篇第 35、304 行）。改法：第 154 行改「約佔註冊者的 8.8%（我從原文的人數算的）」，並把 8.8% 加進第 268 行「我自己算或整理的」。

6. **參考資料裡三筆 ACM 刊出版沒有寫取用依據（第 307、309、314 行）**。Wise 與 Cui、Ou 與 Joyner、Bridson 都只寫「（ACM 刊出版）」。這三份的抽取紀錄都記載 Unpaywall／OpenAlex 標 closed（wise2018 與 bridson2022 檔頭；group-20 抽查把 Wise 列為「來源版本待確認」），合法性要靠 ACM 自 2026 年起全庫開放（`provenance.md` 第 9 行：ACM 文章頁都標 FREE ACCESS 或 OPEN ACCESS，頁面橫幅寫「ACM is now Open Access」；bridson2022 紀錄引 ACM 官方說明「As of January 2026, all ACM publications … have been made open access.」）。主線判定可用，但參考資料要寫明，否則讀者與後來的審稿看不出這三篇不是付費牆後的版本。系列其他篇的寫法是「ACM Digital Library 開放取用」（第 8、10 篇）。改法：三筆都改成「（ACM 刊出版，ACM Digital Library 開放取用）」；Mehta 那筆的 DOI 也指向 ACM，可一併註明。

## 建議修

- 第 22 行「除了一份研究所課程、一門大學部軟體工程課、一份公開問答平台的分析與一份廠商資料，其餘都是 MOOC」：漏了 Camden 的個人部落格；Li 2014 是翻轉教室裡實體讀書會看 MOOC 影片，也不是 MOOC 本身的資料。
- 第 29 行「發文的人佔註冊者不到 5%」：Wise 與 Cui 的分母是有成績者，不是註冊者；改成「佔有成績者或註冊者的 5% 以下」。
- 第 249 行「只限成績在 0.01 以上」：被排除的是 ≤ 0.01，應寫「高於 0.01」。
- 第 67 行「差距從七倍縮到兩倍」與第 224 行「三分之二」「六成」是自己算的比值，正文沒標，第 268 行也沒列；補一個「我算的」。
- 第 75 行「這篇的摘要與結論寫『peer assessment is strongly linked…』，結論用『enhances』」：引句只在摘要（L28–29），讀起來像摘要與結論都用這句；改成「摘要寫…，結論寫…enhances」。
- 第 18、235 行「回答來自本站文章」：`src/i18n/chat.ts` 的副標確實這樣寫，但同一個檔有「找不到足夠來源，改用備援回答」（`chat.activity.fallback`），表示有不以本站文章為依據的回答路徑。建議寫「以本站文章為主要來源」或「先檢索本站文章再回答」。
- 第 266 行「Kizilcec 2020 放大重做的介入，原始研究是同一批作者的」：本篇用到的是社會問責，抽取紀錄說它「之前沒在線上課測過」，沒有原始研究；這句在本篇脈絡會誤導，改成「放大重做的其他介入」或刪掉。
- 「Davis 等 2018」在本系列指兩篇不同的研究：第 10 篇是 *JLA* 的 qCard 實驗（10.18608/jla.2018.53.3），本篇是 *Computers & Education* 的回顧。建議本篇第一次出現時寫「Davis 等 2018 的回顧」，避免讀者連到第 10 篇的那篇。
- 第 16 行「前面一篇」：第 20 篇（`2026-10-14-learning-alone-vs-together.md`）已經存在且 `draft: false`，但還沒進 git。發佈時若同批，補上連結。
- 第 162 行「有教師出題、反覆討論的子論壇」：這是抽取者在「不合的地方」一節的描述，不是 Gillani 的原話；原文只說 Cases 與 Final Project 最不脆弱。改成「個案討論與期末專題兩個子論壇」就夠了。
- `check-post-quality` 對 tag `blog` 給 WARN（標題與內文沒有對應詞）。內文其實有「部落格」，可忽略，或保留現狀。

## 沒問題的項目

- **來源核對**：13 份參考資料都有抽取紀錄，沒有 ⚠ 不得引用的來源被引用。所有作者全名、年份、樣本數、百分比、檢定值，我逐項回紀錄核對過（附錄全部段落也核過），除了上面列的之外都一致。具體包括：Coetzee 的 78% 對 26%（並註明 Table 3 寫 88%）、3.5 對 2.4、59 分鐘對 2 小時 20 分、73 對 71（89 對 97 人）、48.5 對 49.8、89%、前 10 名 54% 與 32%；Wise 與 Cui 的 555／11,664、57% 對 8%、8,314（71%）、3,350、492（15%）、64% 對 32%、t(1,219) = 1.610、p = .107、0.869 對 0.845、R²adj = .032；Mehta 的 748、ρ 0.389 與 0.305、κ 0.70–0.89、15／168；Ou 與 Joyner 的四組平均與 SD、η² = .033、Games-Howell 各 p；Loh 的 20 篇、6 篇實驗、9／10／2；Gillani 的 15,000 與 4,500、三分之二、8%；Li 的 54 人、150 瑞郎、4.12 與三條件值；del Rio-Chanona 的 15%、25%、10%（p < .1）、經驗分層；Bridson 的 98.2、37、90% 對約四成、p ≥ 0.2、67%；Davis 的 7,706／126、42%、71%、61% 對 49%；Ruzuku 的 53.4%／41.9%、50.9%／37.3%。
- **英文引文**：13 段引文（Coetzee 兩段、Wise 與 Cui 兩段、Loh、Mehta、Gillani、Tomkin 轉述、Bridson、Li、Ruzuku 兩段、Camden 兩段、Ou 的摘要措辭）都和抽取紀錄的原文一句逐字相同。
- **轉引**：Tomkin 與 Charlevoix、Kizilcec 2014a、Lamb、Kulkarni、Cambre、Zheng、Labarthe、Kellogg、Zhang、Burtch 都寫明是經回顧或原作者轉述，第 269 行集中列出。
- **因果措辭**：Coetzee、Wise 與 Cui、Loh 的「相關不是因果」都引了作者原話；Ou 與 Joyner、Mehta、Bridson 的摘要因果措辭與正文設計的落差寫在「來源說法不同的地方」，並列沒有選邊。Mehta 的職涯結果寫成「沒找到關聯，但能檢驗的只有 15 人」，沒寫成無關。Coetzee 的課程留存寫成「無法判斷」，沒照摘要寫成沒差。Bridson 的少數族群寫成「沒有測到差異，不是一樣多」。
- **不顯著的寫法**：除了必須修第 3 項，其餘都寫成「沒有測到差異」。
- **推論標示**：「多數讀者只讀留言」「AI 問答與公開問答的差別」「觸及率」「搬回正文」等都當場標成我的推論，第 267 行再集中列一次。「可以做的事」每條寫了依據。
- **取樣偏誤**：第 22 行交代了觀察研究多、MOOC 多、全英文、沒有一份量部落格留言區。
- **本站現況**（19:05–19:10 查）：文章頁沒有留言區（`PostLayout.astro` 與 `[...slug].astro` 沒有任何留言元件）；文章頁掛 `ChatSidebar`（`PostLayout.astro` 第 142–144 行，`articleSlug` 由 `[...slug].astro` 第 162 行傳入），標題「Ask AI」；名詞解釋的彈出框有「入門／進階」兩層按鈕（`[...slug].astro` 第 345–354 行，schema 在 `content.config.ts` 第 34–44 行的 `glossary.definition`／`advanced`）；`course-guide-contract.md` 全文沒有讀者互動的要求。分析工具：第 261 行在審稿期間已改成「只有匯總的流量統計，沒有個別讀者的行為資料」，和第 10、19 篇及規劃檔 2026-10-14 的更正一致；全文已沒有「沒有分析工具」的寫法。第 210 行「站上沒有任何資料能說明讀者想不想留言、會不會讀留言」是對的（沒有留言區，Cloudflare Web Analytics 也不支援自訂事件），不用改。
- **和已發佈各篇**：第 19 篇的六條界線、Kizilcec 2020 的 +0.89（−0.22 到 1.99）與第 1、2 週活動量，兩篇一致。第 10 篇沒有論壇內容，沒有重複；分析工具的寫法現在也一致。第 20 篇（未進 git）說留言區留給之後的篇談，本篇接得上，沒有矛盾。
- **站內連結**：第 4、8、10、19 篇的檔都存在、`draft: false`、已在 git。
- **外部連結**（curl，19:07）：所有 DOI 都解析得到出版者頁；ACM、PNAS、T&F、OUP 對 curl 回 403 是擋爬蟲，不是失效。Frontiers、Nature、PMC 三篇、NSF PAR、TU Delft、Ruzuku、Camden 都是 200。EPFL handle 頁對 curl 回 405，改用 Exa 讀到該頁（題名、作者、摘要都在），定稿 PDF 的 bitstream 回 200。
- **用語**：`check-tw-terms` 0 blocking、0 to review；我另外 grep 常見中國用語，零命中。標題與 tldr 講對象與結論，沒講查了多少。研究者都用名字或「作者」稱呼，沒有用性別代名詞。

## 需要人判斷的事

- **Davis 歸納能不能留**：我的判斷是能留，標示已經夠清楚，但一定要補分母（必須修第 2 項）。補了之後它其實是「兩篇沒有測到差異」，份量比現在的寫法輕很多，第 51 行「合起來」那段與 tldr 也要跟著降。
- **Wise 與 Cui 的 ACM 版本**：主線判定可用（ACM 自 2026 年全庫開放，有 provenance 與 ACM 官方說明撐），我沒有再開瀏覽器親見這一篇的 OA 標示；參考資料寫明取用依據即可（必須修第 6 項）。

## 我沒做的事

- 沒有回原文 PDF 重新核對數字，數字核對以抽取紀錄為準（紀錄本身已有 `_audit` 抽查通過）。
- 沒有用瀏覽器開 ACM 頁面親見 Wise、Ou、Bridson 的 OA 標示。
- 沒有跑 `pnpm dev`／build，沒有看渲染後的頁面；沒有確認 Ask AI 備援路徑實際回什麼。
- 沒有審英文稿（尚未有）。

## 2026-10-14 複審

- 時間：19:32。sha256：`c7438f699b3317dfb4ad74dd661c2c3c527b3e14f49790d565bc27fa5dffb55f`（和初審審後版本逐行 diff 過，只改了下列各處）。
- **必須修 6 項：全部改好。**
  1. tldr（第 9 行）與第 51 行：聲望制度與講師回覆分開寫了，講師回覆寫成「完成率與投入都沒有測到差異」，集體框架提示寫成讓參與下降。和 davis2018 紀錄 #7、#10 一致。
  2. Davis 的分母（第 42、144、245、268 行）：現在寫「量了成績或完成率的只有兩篇（Coetzee、Tomkin 與 Charlevoix），兩篇都沒有測到差異；另外兩篇只量發文，一篇正向（Lamb）、一篇負向（Kizilcec 2014）」，Beheshitha 2016 註明是一般課堂、沒算進去。回 davis2018 紀錄 #7–#11、#19 核對：Lamb 是 + 論壇參與；Kizilcec 2014a 是 ∘ 與 − 論壇參與，寫成「負向」可以接受；Beheshitha 是 Class 環境、∘ 論壇參與。都對。
  3. 第 168 行：改成「在及格的發文者裡沒有測到相關，6 個非內容指標只有 1 個顯著；內容指標 6 個有 5 個顯著，最強 r = .19」，和 wise2018 紀錄 #10、#11 一致。
  4. 第 176 行：改成 65%、逾七成，截止日寫成作者推測，和 bridson2022 紀錄 #5、#6 一致。
  5. 第 154 行的 8.8% 標了「我從原文的人數算的」，第 268 行也列了。
  6. Wise、Ou、Bridson 三筆改成「刊出版，ACM Digital Library 開放取用」，和第 8、10 篇的寫法一致；Mehta 補了「刊出版在 ACM Digital Library」。
- **建議修 10 項：都處理了。** 第 22 行的來源組成（讀書會、部落格文）、第 29 行的分母、第 249 行「高於 0.01」、第 67、224 行標了「我算的」並列進第 268 行、第 75 行的摘要／結論分寫、第 266 行的社會問責、第 137 行區分兩篇 Davis、第 16 行與參考資料補了第 20 篇的連結、第 162 行刪掉了抽取者的描述。
- **Ask AI 的描述**：第 18 行「先檢索本站文章再回答，找不到足夠來源時改用備援回答」、第 235 行「以本站文章為主要來源」。`src/i18n/chat.ts` 有 `chat.activity.searching`「檢索中」與 `chat.activity.fallback`「找不到足夠來源，改用備援回答」，描述一致。我沒有追後端備援路徑實際怎麼回答。
- **流量統計**：全文只在第 261 行提到，寫「本站的流量統計是匯總的，沒有個別讀者的行為資料」，和第 10 篇（第 235 行）、第 19 篇（第 274 行）的用語一致，沒有「沒有分析工具」的寫法。本篇沒有點名 Cloudflare Web Analytics，也沒有寫「正式站至少載入了」那句；以這篇的主題來說可以接受，要全系列統一的話，可以在第 210 行補一句。不列為必須修。
- **新引入的問題（建議修，1 項）**：第 137 行說第 10 篇的 MOOC 實驗是「同一批作者」做的。兩篇的作者是 Davis、Kizilcec、Hauff、Houben（*JLA*，見 davis2018-retrieval-practice-moocs 紀錄檔頭）與 Davis、Chen、Hauff、Houben（*C&E*），四位有三位相同，改成「部分作者相同」比較準。
- **要注意的事**：第 16 行與參考資料連到第 20 篇（`2026-10-14-learning-alone-vs-together`），那個檔 `draft: false`，但 19:32 時還沒進 git。兩篇要同批發佈，否則連結會斷。
- **用語**：`check-tw-terms` 0 blocking、0 to review；新寫的段落我另外看過，沒有中國用語，也沒有性別代名詞。
- **結論**：可以發佈。剩一項建議修（第 137 行的「同一批作者」），還有要和第 20 篇同批發佈這個條件。

## 2026-10-14 英文稿

- 時間：19:53。sha256：中文 `ed58eef2cb01a7081dd270c54edb42a0d94873dad5648c5144a5b78c2e674e9d`、英文 `5f2443237c256cb8634b491fee06510769d4db8b1e3032c7d87e664082d04b02`。兩檔都是 321 行。
- **中文兩處修改**：第 139 行改成「兩篇的作者部分相同」，對（*JLA* 那篇是 Davis、Kizilcec、Hauff、Houben，*C&E* 這篇是 Davis、Chen、Hauff、Houben）。第 212 行「正式站至少載入了 Cloudflare Web Analytics，流量統計是匯總的，沒有個別讀者的行為資料」，和第 10、19 篇的統一說法一致。

### 必須修（英文稿引號內和原文不逐字相同，3 處）

1. **第 69 行**：`The abstract's "15% of learners contributed to the forums"`。原文摘要是「overall, 15% of course learners contributed to the forums」（重轉 PDF 確認過），漏了 course。改成 `"15% of course learners contributed to the forums"`，或拿掉引號改寫成轉述。
2. **第 103 行**：`The authors list "we cannot separate these few people's influence from the overall effect" as a limitation.` 這不是原文，是中文稿的轉述被加上引號。原文的意思是 top 5 users 的行為「may have had a strong effect on metrics」、「it is difficult」分開。拿掉引號，改寫成 `The authors list the difficulty of separating these few users' influence from the overall forum effect as a limitation.`
3. **第 133 行**：`"concrete but limited"`。原文是「Reputation systems provide concrete, yet limited benefits」（PDF 與 group-16 抽查都是 concrete, yet limited）。改成 `"concrete, yet limited"`。

### 建議修

- 第 18 行的部名寫「who you learn with, and who can't read this」，第 20 篇英文稿第 18 行寫「…who can't read it」。兩篇統一一個寫法。
- 篇名稱呼大小寫不一：本篇寫 `Part 19`、`Part 10`，第 20 篇英文稿寫 `part 8`、`part 22`。看全系列英文稿怎麼寫，統一即可。
- 第 69 行「The gap shrinks from sevenfold to twofold」：57/8 約 7.1、64/32 = 2，算法沒問題。中文稿是「差距」，英文用 sevenfold 也對；可考慮寫明是 pass-rate ratio，讓讀者知道比的是比值。非必要。

### 沒問題的項目

- **中英一致**：逐段對過正文、兩張表、「來源說法不同的地方」、可以做的事、今晚三件事、限制、附錄 13 段與參考資料。數字、比較對象、標成「我算的」「我的推論」的地方，兩邊都一致。中文複審後新寫的段落（Davis 分母、Wise 非內容指標、Bridson 時段、Ask AI 備援、社會問責、Cloudflare 句）英文都有，意思相同。
- **其餘英文引文**：Coetzee 兩段、Wise 與 Cui 兩段、Mehta、Loh 三處（clear positive effects、unclear、consistent findings）、Gillani、Tomkin 轉述、Bridson、Li、Ruzuku 兩段、Camden 兩段、Ou 的 strongly linked／enhances、Mehta 的 enhances academic achievement、Bridson 的 led to、Coetzee 的 unimportant／a little important，都和抽取紀錄的原文一句逐字相同。
- **代名詞**：全文沒有 he／she／his／her／him；Camden 那段用被動句避開了。
- **站內連結**：都指向 `-en` 檔，檔案都存在。第 20 篇的中英兩檔在 19:53 時都還沒進 git，所以仍要同批發佈。中文版連結 `/posts/learning/2026-10-14-forums-comments-community-learning` 存在。外部連結和中文稿相同，初審已查過。
- **英文自然度**：整體通順，用詞統一（no difference was detected、my calculation、my inference）。沒有看到直譯造成的怪句。
- frontmatter 的 tags 和 series order 與中文稿一致；series 名稱 "Writing Articles That Teach" 和第 20 篇英文稿一致。

### 我沒做的事

- 沒有跑 build，也沒有看渲染後的頁面。

## 2026-10-14 英文稿修正確認

- 時間：20:14。sha256：中文 `1b4f8049013173b1f5323dd0635482da8981afc4dc35d3723bbc239aca283b99`、英文 `9b9b8c949655d32b9a5fbc2ff8cc3fad4803797b6ddcb5f0fd964c80287f9223`。
- **3 項必須修都改好了**：第 69 行改成 "15% of course learners contributed to the forums"，和原文逐字相同；第 103 行拿掉引號，改成轉述；第 133 行改成 "concrete, yet limited."。
- **留著的引號逐一核對過**：英文稿正文裡所有雙引號字串都抓出來看過，分成三類：
  - **原文逐字**：Wise 摘要、Ou 摘要（strongly linked、enhances）、Mehta（15 of 168、enhances academic achievement）、Coetzee（difficult to interpret、concrete, yet limited、unimportant／a little important）、as many as 45%、Loh（clear positive effects、unclear、consistent findings）、Tomkin 轉述、Gillani 兩處（含 may）、Bridson（after all…、led to、had an opportunity to ask questions，最後一句是評鑑題目的片段）、Li、Ruzuku 三處、Camden 兩處、51.3% (48.3% for large)。和抽取紀錄的原文一句都一致。
  - **名稱與術語**：系列名、部名、Ask AI、ICAP 的 interactive／constructive、節名 "Where the sources disagree"、Ruzuku 題名的 "2,000"、"Scheduled Cohort"。
  - **作者自己的詞，用引號表示特定用法**：participation、coming back、"learning by doing"（第 8 篇的連結文字）。可以接受。
  - 轉述都改成斜體了（第 65、83、97、236、247、249 行等），沒有留下假引文。
- **新加的原標籤**：Ruzuku 的 "Scheduled Cohort"（第 194 行），和 crystal2026 紀錄結果第 1 項的「Scheduled Cohort（依行事曆開放）」一致。Gillani 的 "Study Groups"（第 162 行），和 gillani2014 紀錄的子論壇名稱一致。
- **中英一致**：中文第 69、270 行改成「兩組及格率的比值從約七倍縮到兩倍」，英文第 69 行是 "The ratio of pass rates shrinks from about sevenfold to twofold"，一致。第 226 行的小標改成問句 "Did underrepresented groups post less?"，中文是「少數族群『沒有比較少發文』」；寫法不同，內容相同，可以接受。部名 "who can't read this" 和 "Part N" 的寫法，現在和第 20 篇英文稿一致。
- **建議修（1 項，非必要）**：第 164 行 "the case discussion and final project sub-forums" 還是描述性寫法，原名是 Cases 與 Final Project。第 162 行已經改用原名 Study Groups，這裡可以一併統一。
- 結論：可以發佈。
