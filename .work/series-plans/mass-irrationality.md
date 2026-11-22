# 系列規劃：群體非理性閱讀地圖（mass-irrationality）

使用者確認：2026-11-17（Canetti 放 order 5 縮小範圍；Kahneman 篇定位存續盤點；每篇結尾回扣「這個機制在 2026 年的台灣長什麼樣？」；研究池歸 learning/methods）

決定（2026-11-16）：共 12 篇（order 0 總覽＋11 本書）。每篇固定四段：①原文句（英文原文＋中譯，無中譯的書標明）②這本書在解釋鏈上的位置 ③後來的研究修正了什麼（批評並列，不選邊）④讀者可帶走的一個判準。譯本狀態每篇都要寫。中英同步。每篇 `.work/reviews/<slug>.md` 三節（post-verify／post-review／post-polish）。入口是總覽不是事件文。

來源：`.work/research/mass-irrationality/research-note.md`（六份掃描報告＋九份 main-session 精讀抽取＋來源清單＋事實交叉表＋五關結果；L0–L5 掃描與精讀檔在同目錄 scan/ 與 deep/）。

## 系列登錄資料（給 `src/utils/series.ts`，確認後再登錄）

- slug：`mass-irrationality`
- category：`learning`
- 名稱：zh-TW「群體非理性閱讀地圖」／en「The Mass Irrationality Reading Map」
- 描述 zh-TW：從 1841 年的金融狂熱敘事到 2024 年的錯誤資訊辯論，用十一本書搭一條解釋鏈：群體非理性在歷史上怎麼反覆出現、群眾心理與認知科學怎麼解釋它、文化與制度怎麼放大它、當代平台機制又怎麼讓它更難被糾正。每篇導讀一本書，並列後來研究修正了什麼。
- 描述 en：Eleven books, one explanation chain: why collective delusions keep recurring in history, what crowd psychology and cognitive science say about why, how culture and institutions amplify them, and what contemporary platform mechanics change. Each post reads one book against later research, with the criticisms alongside.

## 目標讀者

對金融泡沫、政治狂熱、陰謀論、反智浪潮只有「這些人好蠢」的表面判斷、想看到機制與結構的人；以及想分辨「人性不不變的弱點」與「被技術放大的新現象」的 zh-TW 讀者。不寫給：要找快速書單收藏的人（每篇給原文關鍵句與出處，不是書摘）；想要操作手冊的人（這是理解框架，不是防騙指南）。每篇自足，不必照順序讀，但總覽篇建議先讀。

## 入口

order 0 是總覽：同一個問題的三個時間切面（1841 鬱金香章的敘事模板→1989/2007 史料清算→2024 misinformation 效應辯論），五層地圖，三個誠實警告（①書單偏英語圈經典 ②多本書的繁中譯本有品質爭議或絕版 ③第五層的效應大小本身在爭論中，兩側證據等級不對稱），以及每篇讀完能帶走什麼。從使用者的五層分類接手，不重做。

## 弧線

總覽（地圖＋誠實警告）→ L1 歷史：Mackay（1841 模板）→ Bernstein（2021 更新＋四行為清單）→ L2 群眾心理：Le Bon（三機制＋當代清算）→ Hoffer（信徒結構）→ Canetti（權力意象，最難讀的一本）→ L3 認知：Kahneman（偏誤底層＋複製危機存續狀態）→ L4 文化制度：Hofstadter 反智傳統 → Hofstadter 偏執狂風格 → L5 當代：McIntyre 後真相 → Rauch 知識的憲法 → Nichols 專家之死

排序原則：可見先於不可見（先發生過的案例，再機制，再大腦，再制度，再當代）；動機先於抽象（order 0 用「為什麼讀了還是一樣被樣被騙」當鉤子——Bernstein 的 amnesia 論＋Mackay 180 年前後對照）；一次一個跳躍（一本書一個核心概念）；螺旋加深（郁金香、獵巫、QAnon、2024 選舉在不同層反覆出現，每次加深一層）；每篇固定「後來的研究修正了什麼」段落，避免經典崇拜。

## 斷崖處理

- 0→1：總覽只給地圖與警告，不講機制細節；Mackay 篇直接從鬱金香章原文句進入（「It is related that…」的無出處敘事就是第一段的證據）。
- 1→2：用 Bernstein 自己的話橋（New Bazaar 逐字稿：讀 Mackay 三十多年後「I had read the script and I knew how the movie ended」）；Mackay 篇的史料清算（Garber/Goldgar）已讀者帶著「敘事模板」概念進 Bernstein 篇。
- 2→3：Le Bon 篇要處理「案例→機制」的跳：用 Goldgar 的「不是金融危機是社會文化危機」引出「那群體裡到底發生了什麼」。Thonhauser 的疾病模型清算是本篇 spine，不是附錄；Le Bon 自己的限定語（what crowds may become, not what they invariably are）要先講，避免「經典全錯」形狀。
- 3→4：Le Bon 講群體內機制，Hoffer 回答「什麼樣的人會成為信徒」（挫折、自尊替代、零和競爭）；跳法是問句橋。
- 4→5：Canetti 斷崖最大（格言體、無實證、繁中絕版）。處理：本篇範圍縮成「兩個概念（指令／蜇刺）＋群眾與權力的平行＋為什麼他是最難讀的一本＋譯本現況」，不講全書體系；Nobel 1981 citation 與 Sontag 讚譽／Honneth 批評並列（兩側都在牆內，如實標記）。
- 5→6：Canetti 講權力意象，Kahneman 講個人大腦——橋是「群體機制最後要落到個人判斷」；Kahneman 篇不是全書導讀，是「複製危機後還站得住哪些」的存續盤點（2012 信＋R-Index=14＋loss aversion 爭議＋dual-process 批評），繁中譯本爭議（洪蘭譯、2013 退書、2023 新版同譯者）要寫。
- 6→7：Kahneman 是個人怎麼錯，Hofstadter 反智篇是社會為什麼特別容易錯——橋句從偏误跳到制度；余英時 1975〈反智論與中國政治傳統〉做 zh-TW 橋（標明那是歷史分析不是反智實證）。
- 7→8：同作者同年，斷崖小；橋是「反智是態度，paranoid style 是話語形態」；Hofstadter 自己的自我限定（not clinical、more or less normal people、not necessarily right-wing）先講，避免常見誤讀。
- 8→9：paranoid style 的「堆證據修辭」（313 腳註那句）直接接到 McIntyre 的 post-truth 定義與科學否定論系譜（菸草→創造論→氣候→post-truth）；McIntyre 篇是歷史層進入當代層的門。
- 9→10：McIntyre 診斷問題，Rauch 問制度怎麼修（認識論憲法、Popper 除錯傳統）；橋是「知道問題後，什麼制度在生產知識」。Rauch 無中譯（兩組查詢零結果），文中如實標明並給原文入口。
- 10→11：Rauch 的憲法需要公民美德，Nichols 問「為什麼公民不再尊重專家」；Nichols 2024 二版的 COVID 反思與兩側書評（軼事無實證／反身性越權）並列。
- 每篇結尾用同一個收束問題：「這個機制在 2026 年的台灣長什麼樣？」——第五層之後每篇都回扣，總覽篇預告這個設計。

## 篇目與範圍卡

共通規格：教學與導讀混合口吻（不是書摘，不是書評）；每篇至少一個「今晚就能做的動作」（例： Mackay 篇＝打開 Gutenberg 原文找一句「It is related that」並記下它沒有出處）；每個數字連對照條件；preprint 狀態要標（Röseler 錨定 meta 仍 preprint）；利益申報要並列（Ecker et al. 多位作者有 Google/Meta 諮詢）；譯本品質爭議如實寫（Le Bon 繁中四家＋簡體 30+ 版有逐段比較文、快思慢想洪蘭譯爭議）；中英同步；每篇 `.work/reviews/<slug>.md`。

| order | slug | 主題 | 聚焦問題 |
|---|---|---|---|
| 0 | mass-irrationality-overview | 總覽：人為何會集體陷入幻覺 | 五層地圖怎麼讀、三個誠實警告、每篇帶走什麼 |
| 1 | mackay-popular-delusions | Mackay《異常流行幻象與群眾瘋狂》(1841) | 1841 年的「群眾瘋狂」敘事模板是怎麼寫出來的，它的史料鏈撐得住嗎？ |
| 2 | bernstein-delusions-of-crowds | Bernstein《群眾的幻覺》(2021) | 180 年後同一個模板更新成什麼樣子，作者本人為什麼仍悲觀？ |
| 3 | lebon-the-crowd | Le Bon《烏合之眾》(1895) | 群眾心理的三機制原典怎麼說，當代群眾科學清算清了什麼、沒清什麼？ |
| 4 | hoffer-true-believer | Hoffer《群眾運動聖經》(1951) | 什麼樣的人會成為狂熱信徒——參與者的心理結構是什麼？ |
| 5 | canetti-crowds-and-power | Canetti《群眾與權力》(1960) | 群眾與權力為什麼是同兩個東西的兩面，這本最難讀的經典還值得讀嗎？ |
| 6 | kahneman-thinking-fast-slow | Kahneman《思考，快與慢》(2011) | 個人認知偏誤的底層是什麼，複製危機之後還站得住哪些部分？ |
| 7 | hofstadter-anti-intellectualism | Hofstadter《美國的反智傳統》(1963) | 為什麼某些社會特別容易反智——四個來源的結構性分析還站得住嗎？ |
| 8 | hofstadter-paranoid-style | Hofstadter《偏執狂風格》(1964) | 陰謀思維的話語結構是什麼，1964 年的原文預言了 2024 年的什麼？ |
| 9 | mcintyre-post-truth | McIntyre《後真相》(2018) | 後真相的定義是什麼，科學否定論的系譜怎麼連到當代？ |
| 10 | rauch-constitution-of-knowledge | Rauch《知識的憲法》(2021) | 生產知識的制度規則是什麼，左右兩側分別怎麼批它？ |
| 11 | nichols-death-of-expertise | Nichols《專家之死》(2017) | 專業權威的社會基礎為什麼崩塌，COVID 之後這本書自己修正了什麼？ |

### 範圍卡（聚焦問題／邊界／讀完後讀者能／對應來源狀態）

- **order 0**：講五層地圖、三個誠實警告（英語圈經典偏誤／譯本問題／L5 效應爭論）、每篇的帶走判準預告、系列怎麼讀（可跳可走全徑）。不講：任何單本書的深入內容（留給各篇）；不給「必讀順序」強迫（主題式地圖的定義）。讀完後讀者能：說出這個系列回答的三層問題（發生過什麼→為什麼→現在新變數），並選一條路徑開始讀。來源：Drury 2026 🟡、Altay & Gilardi 2024 🟡、Budak 2024 ✅、Ecker 2024 ✅、DNR Taiwan 2025 ✅、L1–L4 各篇錨點 ✅/✅(scan)。
- **order 1**：講 Mackay 的敘事模板（價格數字＋全階層癲狂＋法院救不了＋道德收尾）與史料鏈清算（Beckmann→Munting→Gaergoedt & Waermondt 對話錄；Garber 的 observational equivalence 論；Goldgar 的 propaganda 論＋社會文化危機重定位）。不講：南海/密西西比泡沫細節（留給 Bernstein 篇對照）、獵巫章（一句帶到 Doten-Snitker 2024 觀念擴散論，不展開）。讀完後讀者能：拿到任何「歷史上的瘋狂」故事時，用三個問題檢查它（價格有日期嗎？出處是宣傳文還是檔案？崩盤有經濟數據嗎？）。來源：Mackay 原文 ✅、Garber 1989 ✅、Goldgar 序章 ✅（書後半檔案數字 🟡 待補）、McClure & Thomas 2017 🟡、Doten-Snitker 2024 🟡。
- **order 2**：講 Bernstein 的更新版模板（四行為清單：日常話題／辭職投機／懷疑換來憤怒／極端預測）、amnesia 論、Festinger 機制與 QAnon 例、泡沫的社會效益（Global Crossing）與稀有性、他對通訊技術「quantitatively yes, qualitatively no」＋算法認識危機的區分、他的悲觀收尾。不講：宗教狂熱隨世俗化下降（未確認，不寫）；Minsky 四條件與四 P（未確認）。讀完後讀者能：用四行為清單偵測自己身邊正在發生的投機狂熱，並說出為什麼「知道歷史也擋不住」（amnesia）。來源：NBIC 作者摘要 ✅、New Bazaar 逐字稿 ✅、Grove 頁 🟡、Quillette/NYRB 書評 🟡（動筆前讀一本）。
- **order 3**：講 Le Bon 原文三機制（匿名→責任消失、傳染、暗示＋催眠）與三手段（斷言、重複、傳染）＋prestige，附他自己的限定語；講 Thonhauser 的三层清算（crowd 概念不對應真實現象／疾病模型錯置情緒傳遞／英譯本隱藏種族框架）＋影響史（Taine→Tarde→Durkheim 對照→Simmel/Weber→Scheler→Stein→mimicry 模型）；當代事故研究（梨泰院用流體力學語言）做對照。不講：Freud 1921 的接受史（一句帶到）；Mussolini/Goebbels 引用線（Reicher 訪談 🟡，動筆前補或標未證實）。讀完後讀者能：分辨「群眾非理性」敘事裡哪些是 Le Bon 原句、哪些是後世發展，並說出 disease model 為什麼被清算。來源：Le Bon 原文 ✅、Thonhauser 2022 ✅、Reicher 2001 🟡、Drury 2026 🟡、McPhail 1991 🟡、Liang 2024 🟡。
- **order 4**：講 Hoffer 的四部結構與核心概念（挫折／新窮人／無聊作為指標／統一貧窮者不加入／替代運動／men of words→fanatics→men of action）；當代引用（2016–2024）與批評（不精確、誇大、犬儒、cheap cynicism；社運理論系統性批評缺——如實寫這個缺口）。不講：把他當預言家用（QAnon 等當代案例只作對照不展開）。讀完後讀者能：用 Hoffer 的框架辨識一個運動在招募「什麼樣的人」，並知道這套框架沒有系統性實證支持。來源：Buchholz 2017 Military Review 🟡(scan partial)、Qeios 回顧 🟡(scan partial)、HarperCollins 頁 🟡、Hoffer 原文 PDF 🟡（動筆前 main session 補讀關鍵章）。
- **order 5**：講 Canetti 兩個概念（指令 command／蜇刺 sting）＋open/closed crowds＋群眾與權力的平行＋1981 Nobel citation 原文；講為什麼這本書不是學術寫法（Wikipedia 直陳）與學術界兩極（Honneth 正面處理 vs「不系統」批評，Sontag 文學界讚譽）；繁中譯本現況（博學 1982／駱駝 1987 絕版，現售僅簡體）。不講：全書體系（格言體無法系統導讀，硬講會造假）；Canetti 與 Le Bon 的細節對照（讀者自行連 order 3）。讀完後讀者能：說出指令與蜇刺兩個概念，並判斷這本書該不該進自己的閱讀清單（給誠實的取捨）。來源：Nobel facts 頁 ✅(scan)、readmoo 評介 🟡、Wikipedia ✅(scan)、Honneth 1996 🔴、Sontag 1980 🔴（牆，如實標）。
- **order 6**：講 Kahneman 兩系統框架的書本地圖（五部 38 章）＋複製危機存續盤點：2012 信與 2017 留言（作者自認）＋第四章 R-Index=14＋priming/ego depletion 複製失敗（Doyen 2012、Hagger 2016 d=0.04、Vohs 2021 d=0.06）＋錨定存活（Many Labs t 42–90、Röseler meta g≈0.55–0.70 但仍 preprint）＋loss aversion 爭議兩造＋dual-process 批評（Melnikoff & Bargh、Gigerenzer 2025）＋繁中譯本爭議。不講：Noise 全書（一句定位）；逐章導讀。讀完後讀者能：拿到任何「研究顯示人類非理性」的新闻時，用四個問題四個問題檢查（檢定力？複製了嗎？效應量？哪一派的爭議？）。來源：Kahneman 信 ✅(scan)、Schimmack 2017 ✅(scan)、Doyen 2012 🟡、Gal & Rucker 2018 🟡、Mrkva 2020 🟡、Melnikoff & Bargh 2018 🟡、Gigerenzer 2025 🟡(scan partial)、Heatley 2024 ✅(scan)、Kogan 2025 🟡。
- **order 7**：講 Hofstadter 反智的四個來源（宗教福音／商業實用／政治民粹／教育生活適應）＋mind vs character 框架＋Pulitzer 1964 官方確認；講批評三線（status politics 溯源／病理化爭議／populism 修正——Postel 的「left in ruins」）＋當代實證接續（Motta 2024 約 1/3、Pew 2024 76%、Milkoreit & Smith 2025 黨派分化）＋余英時 1975 的中文橋。不講：逐章導讀（書太厚）；把余英時當反智實證（標明那是歷史分析）。讀完後讀者能：分辨「反智態度」與「不信任特定專家」的差別，並說出 Hofstadter thesis 被修正了什麼。來源：archive.org 掃描 🟡(scan partial)、Pulitzer 頁 ✅(scan)、Postel 2019 ✅(scan)、McKenzie-McHarg 2022 🟡、Olmsted 2018 ✅(scan)、Motta 2024 🟡、Pew 2024 🟡、余英時 1975 ✅(scan)。
- **order 8**：講 Harper's 原文全文（定義、三元素、apocalyptic、投射、renegade、pedantry 與 313 腳註、Cohn 引用、double sufferer）＋他的自我限定（not clinical／not necessarily right-wing／conjecture）＋1959 BBC 講稿到 1964 Harper's 的文本史；講批評（病理化＝剝奪正當性：Olmsted/Ribuffo/Brotherton；概念任意性：Guilhot）；2016–2026 回歸文章與 Enders 2022「陰謀信念未上升」的制衡。不講：把 Trump/MAGA 當案例展開（只引用原文的 Goldwater 與 Welch 段）。讀完後讀者能：認出 paranoid style 的四個話語特徵（末日框架／絕對善惡／投射敵人／堆證據），並知道「堆證據」不是反指標。來源：Harper's 原文 ✅、Postel ✅(scan)、McKenzie-McHarg 🟡、Olmsted ✅(scan)、Ribuffo 🟡(scan partial)、Enders 2022 🟡(scan partial)、Motta/Pew 🟡。
- **order 9**：講 McIntyre 的 post-truth 定義（情感與個人信念勝過客觀事實）＋科學否定論系譜（菸草→創造論→氣候）＋他對認識論的處理＋On Disinformation (2023) 的一句話定位；講 philosophyandsociety 書評的批評。不講：把 post-truth 當 2016 年英美專利（要寫詞源 Tesich 1992 與中研院 glossary 線索）。讀完後讀者能：用 McIntyre 的定義判斷一個個爭論是「價值分歧」還是「後真相操作」。來源：Carnegie 訪談 ✅(scan)、MIT Press 頁 🟡、philosophyandsociety 書評 🟡、Lawfare 對 On Disinformation 🟡、中研院 glossary ✅(scan)。
- **order 10**：講 Rauch 的認識論憲法（peer review、fact-checking、institutions 作為 epistem operating system）＋troll army 分析；講左右兩側批評（Bulwark Field：界線＝權力與階層；IJOC Jansen：未處理 Popper 寬容悖論；City Journal：真相＝治理手段；Kling：建制內部腐壞）＋National Review 正面書評對照；無中譯的取捨要寫。不講：把 Rauch 當解方推薦（只呈現制度設計與它的批評）。讀完後讀者能：說出「知識的憲法」指哪三條制度規則，並評判一項平台改革是強化還是削弱它。來源：Brookings 頁 🟡(scan)、Bulwark 🟡、IJOC 🟡、City Journal/Kling/Chicago Fog 🟡、NR 🟡。
- **order 11**：講 Nichols 的核心論點（expertise vs「我懂」的文化）＋2024 二版 COVID 反思＋繁中《專業之死》臉譜 2018 鄭煥昇譯；講兩側書評（Ethics & Medicine：軼事無實證、未處理專家分歧；tecnoscienza：反身性越權）；接 DNR Taiwan 2025（信任 30%、YouTube 46%）與台灣查核生態（TFC/Cofacts/MyGoPen 的規模與自我申報性質）收尾。不講：把專家不死論當結論（兩側並列）。讀完後讀者能：分辨「不信任專家」的三種不同理由（利益、往績、制度），並知道哪一種有證據。來源：tecnoscienza 書評 ✅(scan)、Ethics & Medicine 🟡、NYT 書評 🟡、Wikipedia ✅(scan)、DNR Taiwan ✅、TFC/Cofacts/DSET/新聞學研究 162 期 🟡(scan)。

### 系列層級的斷崖總檢

- 最大斷崖：order 4→5（Canetti）與 5→6（Kahneman），已用範圍縮小＋橋接句處理；Canetti 篇若動筆時仍無可靠二手，則改寫成「為什麼這本書讀不懂也讀不完」的誠實導讀（這本身符合系列主題）。
- 每篇跳躍檢查：相鄰兩篇只引入一個新核心概念（模板→更新版模板→機制→信徒→權力→個人認知→文化態度→話語形態→認識論→制度→專業权威），沒有同時塞兩個的。

## 研究足夠的判準（五關，詳見 research-note.md）

- ①一手來源：L1/L2/L4/L5 主錨 main session 全文讀完 ✅；L3 靠掃描 agent 全文讀取 ✅(scan) 且逐字記錄在案；Hoffer/Canetti/Anti-Intellectualism 正文各篇動筆前補讀（已列入該篇範圍卡）。
- ②作者主張 vs 實證：每份 extract 分開記；Bernstein 標作者自述層級、Budak 標 Perspective 非新證據、Ecker 標利益申報。
- ③2024+：Doten-Snitker 2024、Drury 2026、Motta 2024、Pew 2024、Milkoreit & Smith 2025、Budak 2024、Ecker 2024、PNAS 2025、DNR 2025、Kogan 2025、Gigerenzer 2025、AI Forensics 2025 等。
- ④反證：每層都有（Garber/Goldgar vs Mackay；Thonhauser/Reicher/McPhail vs Le Bon；Gal&Rucker/Melnikoff&Bargh/Gigerenzer vs Kahneman；Postel/Olmsted/Ribuffo vs Hofstadter；Uscinski/Budak vs Ecker；Rauch 三側批評；Nichols 兩書評）。
- ⑤飽和：六份掃描共 133+ 組查詢，中英繁中並搜；缺口與偏誤已列（英語圈偏誤、批評線 open-access 偏誤、L5 證據等級不對稱、台灣數據自我申報性質）。

## 給使用者確認的三件事（動筆前）

1. **弧線順序**：總覽→L1（Mackay→Bernstein）→L2（Le Bon→Hoffer→Canetti）→L3（Kahneman）→L4（反智→偏執狂風格）→L5（後真相→知識的憲法→專家之死）。Canetti 放中間（權力橋）或挪到附錄？
2. **每篇範圍**：Canetti 篇縮小範範圍（兩概念＋譯本現況，不講全書體系）OK 嗎？Kahneman 篇定位成「存續盤點」而非全書導讀 OK 嗎？
3. **斷崖處理**：每篇結尾固定回扣「這個機制在 2026 年的台灣長什麼樣？」——這個設計要還是不要？
