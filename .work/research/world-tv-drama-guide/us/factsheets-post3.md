# Fact sheets：post 3「美劇｜職人、歷史與人生劇情」（19 部）

查核日期：2026-11-05。順序依 `post3-shows.txt`。這份是資料檔，不是文章稿。

## 讀法與來源規則

- **讀取狀態**：`read` 是實際讀到頁面內容（或頁面原始碼／wikitext）；`read (chunks)` 是 Tavily extract 依 query 回傳的頁面段落，內容是頁面原文，但不是整頁；`snippet` 是只看到搜尋摘要，不算讀過。
- **劇情一句話**：取自英文 Wikipedia 的導言或 Premise／Plot 段落（`action=raw` 讀 wikitext）。引號內是 Wikipedia 原句的節錄。
- **季數／狀態**：取自 Wikipedia infobox 的 `num_seasons` / `num_episodes` 與 `{{Series overview}}`（第一季集數），狀態句取自同頁內文。Wikipedia 的規則是「只在新季開播後才加季數」，所以 `num_seasons` 是**已播出**季數。
- **分級與內容警示**：IMDb Parents Guide（`https://www.imdb.com/title/<id>/parentalguide/`）。Groundlane 直接抓會遇到 2 KB 的 bot 頁、Firecrawl 額度用完，改用 Tavily extract（advanced）讀到。**嚴重度是 IMDb 使用者投票結果**（None / Mild / Moderate / Severe），括號內是頁面寫的票數，不是官方分級。美國分級（TV-MA 等）取自同頁 Certifications 的 United States 列；順便抄下 Taiwan 列（多為片商或平台 self-applied）。
- **爛番茄**：直接讀 RT 各季頁 `https://www.rottentomatoes.com/tv/<slug>/sNN`，用 Groundlane `web_extract` 從 HTML 抽 `criticsScore`（Tomatometer）、`audienceScore`（Popcornmeter）、`#critics-consensus p`（Critics Consensus，逐字）。分數是 2026-11-05 當下的值，之後會變動。
- **推薦標籤**：從三份 candidates 檔照抄，依 A–G 分組，每組留 2–4 個最有資訊量的（得獎優先於提名）。已刪除：負評討論串（例如 Euphoria 的 PTT S3 負評串）、業配（TEEPR `#HBOMaxPartner` 貼文 S14）。類別定義：A 獎項、B 影評榜單、C 評分、D 收視數據、E 需求／聲量、F 粉絲社群、G 台灣觀眾／媒體。
- **台灣串流**：照抄 `tw-availability-1/2/3.md`。三份檔對 Disney+ 的判定標準不同：batch 2 把 Disney+ zh-tw 頁算成「已在服務商頁面確認」，batch 1 把同類頁算成 B（地區未證）。這裡照各檔原樣抄，並在備註標出。對不是「confirmed on service page」的劇，本輪重試結果寫在「本輪重試」。

### 本輪工具紀錄（toolDegradation）

- Groundlane `web_extract`：Wikipedia raw wikitext、RT 各季頁全部成功。IMDb Parents Guide 直接抓與 `render: always` 都只回 2 KB bot 頁（沒有繞過）。Netflix `/tw/title/...` 頁：`OUTPUT_LIMIT`（上游回應超過部署上限，`maxBytes` 調高也一樣）。
- Firecrawl：`Insufficient credits`，每日額度 2026-11-05T17:12Z 才重置，本輪**無法**用 `location: TW` 重抓 Netflix／CATCHPLAY+ 頁。依 Firecrawl 回應要求附上：Your Firecrawl credits ran out. Daily MCP credits refresh in 2h 50m. Add credits or upgrade to keep going: https://www.firecrawl.dev/billing/1cscjebvah18y5jxykvsw4ve0tn9fxgs
- Tavily extract：IMDb 讀取成功，中途遇到一次 429（rate limit），稍後重試成功。
- 沒有使用盜版站，也沒有使用繞過人機驗證的 proxy。

---

## 1. The Pitt｜匹茲堡醫魂

- **台灣官方譯名**：匹茲堡醫魂（HBO Max TW 頁，見 tw-availability-2）
- **劇情**：急診室醫護在匹茲堡一家虛構創傷醫學中心值一個 12 小時的班，面對人手不足、經費不足與個人危機，每集約等於班表上的一小時（real time）。Wikipedia 原句："Each season follows emergency department staff at a fictional Pittsburgh Trauma Medical Center as they navigate a single 12-hour shift amid staff shortages, underfunding, and personal crises." — https://en.wikipedia.org/wiki/The_Pitt （read）
- **季數／狀態**：已播 2 季、共 30 集；第一季 15 集（2025-01-09～04-10）。第三季已排定（Series overview 列 S3 15 集、2027-01 開播）→ **renewed，尚未開播**。— 同上 Wikipedia（read）
  - ⚠ 與 tw-availability-2 的備註「JW 已列出第 3 季第 1 集」不一致；以 Wikipedia 為準，JustWatch 可能只是預先建立條目。
- **分級**：US **TV-MA**；Taiwan 18+（self-applied）。IMDb 投票：Sex & Nudity **Moderate**（173/614）、Violence & Gore **Severe**（213/282）、Profanity **Moderate**、Alcohol, Drugs & Smoking **Mild**、Frightening & Intense Scenes **Moderate**。頁面條目提到：「Numerous instances of blood in medical settings. Graphic depictions of accidents and procedures.」；分娩場景有長時間的女性生殖器（義體）裸露；有大量男性義體裸露；有亂倫性侵、人口販運的主題；有新冠疫情閃回。— https://www.imdb.com/title/tt31938062/parentalguide/ （read (chunks)）
  - 給文章的白話版：**血腥醫療畫面多，器官、手術、外傷都直接拍**，另有醫療情境的裸露。
- **爛番茄**：
  - S1：Tomatometer **94%**、Popcornmeter **88%**。Consensus："Setting the trials and tribulations of hospital life on a timer, The Pitt combines multiple tried-and-true formulas to create a bracingly fresh medical drama." — https://www.rottentomatoes.com/tv/the_pitt/s01 （read）
  - S2（最新）：**99%**／**86%**（211 Reviews）。Consensus："Clocking in for a second season of a near perfect medical procedural, The Pitt goes all in on narrative excellence, brilliant humanity, and heart-wrenching drama to winning effect." — https://www.rottentomatoes.com/tv/the_pitt/s02 （read）
- **推薦標籤**：
  - A：Emmy Drama win 2025；Emmy Drama win 2026；GG Drama win 2026
  - B：NYT2026 #36；CT10-2025 agg #1；Vulture2025（Kathryn VanArendonk #1）；Variety2025（Aramide Tinubu #2）
  - C：IMDb 8.9（#40）；RT 2025 S1 94% / Popcorn 88%
  - D：Nielsen 2025 ARTEY top new original drama 11.4B min；Nielsen H1 2026 #2 original / #3 overall 21.12B min
  - F：PTT 2025 年度最佳串 ~7 推；PTT 2026 推薦串 ×4；RedRecs/Reddit 2025 #2；Reddit 117 lists #1（snippet）
  - G：ELLE TW 2025 #4；LINE TODAY 聚光賞 2025 歐美劇前十；HBO Max TW 首頁「創新話題劇集」（snippet）；VERSE 2026 艾美獎（snippet）
  - 已刪：G TEEPR×HBO Max 業配 #4
- **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/e6e7bad9-d48d-4434-b334-7c651ffc4bdf ；JW https://www.justwatch.com/tw/節目/the-pitt — **已在服務商頁面確認**（HBO TW 頁顯示 2 季）

## 2. Euphoria｜高校十八禁（例外保留）

- **台灣官方譯名**：高校十八禁（HBO Max TW 頁）
- **劇情**：Zendaya 飾演染上毒癮的青少女 Rue，她同時是不可靠的敘事者；改編自同名以色列影集。"the series stars Zendaya as drug-addicted teenager Rue Bennett, who also serves as an unreliable narrator." — https://en.wikipedia.org/wiki/Euphoria_(American_TV_series) （read）
- **季數／狀態**：3 季、26 集（另有 2 集特別篇 2020–21）。第一季 8 集（2019-06-16～08-04）。第三季 8 集，2026-04-12～05-31；"On May 31, 2026, the same day that the final episode of the third season was released, HBO confirmed that the series had concluded after three seasons." → **ended**。第三季設定在五年後，離開高中場景。— 同上 Wikipedia（read）
- **分級**：US **TV-MA**；Taiwan 18+。IMDb 投票：Sex & Nudity **Severe**（2821/3335）、Violence & Gore **Moderate**（647/1649）、Profanity **Severe**（1308/1465）、Alcohol, Drugs & Smoking **Severe**、Frightening & Intense Scenes **Severe**（935/1345）。條目提到：S1–S2 有大量明確、無端的青少年角色裸露；常有男性正面全裸（含青少年角色）；S3 主線大量轉向性工作劇情；有性侵描寫。— https://www.imdb.com/title/tt8772296/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**80%**／**83%**（100 Reviews）。Consensus："Though at times hard to watch, Euphoria balances its brutal honesty with an empathetic -- and visually gorgeous -- eye to create a uniquely challenging and illuminating series, held together by a powerfully understated performance from Zendaya." — https://www.rottentomatoes.com/tv/euphoria/s01 （read）
  - S2：**78%**／**80%**（113 Reviews）。Consensus："As willfully provocative as ever in its second season, Euphoria still isn't for all tastes -- but when its addictive ingredients are mixed just right, the results remain intoxicating." — https://www.rottentomatoes.com/tv/euphoria/s02 （read）
  - S3（最新，2026）：**44%**／**38%**（76 Reviews）。Consensus："Euphoria returns with less than the sum of its parts in a disjointed cavalcade of forced narratives that leave its talented cast stranded in the wind." — https://www.rottentomatoes.com/tv/euphoria/s03 （read）
- **例外保留的正反證據**：
  - **正面（獎項）**：Wikipedia："thirty two Primetime Emmy Award nominations and nine wins"；"In 2020 and 2022, Zendaya won Outstanding Lead Actress in a Drama Series for the first two seasons"（S1〈Made You Look〉、S2〈Stand Still Like the Hummingbird〉）。S1 另得 Creative Arts 獎（非義體化妝、原創歌曲 Labrinth〈All for Us〉）；S2 在第 74 屆 Creative Arts 得 5 座（Colman Domingo 客座男演員、編舞、攝影、化妝、剪輯）。劇集本身入圍 Outstanding Drama Series（awards 檔：Emmy Drama nom 2022）。— https://en.wikipedia.org/wiki/Euphoria_(American_TV_series) （read）
  - **2026 艾美（S3 那一季）**：只有 1 項入圍，Zendaya 劇情類女主角入圍；得主是 Rhea Seehorn（Pluribus）。— https://en.wikipedia.org/wiki/78th_Primetime_Emmy_Awards （read）
  - **反面（S3 評價）**：Wikipedia："The third season received mixed reviews from critics"，RT 44%（76 篇）、Metacritic 56/100（27 篇）。— 同上 Euphoria Wikipedia（read）
    - The Guardian，Hannah J Davies，〈Euphoria season three review – grubby, desperate and absolutely not worth the wait〉（2026-04-13）— https://www.theguardian.com/tv-and-radio/2026/apr/13/euphoria-season-three-review-sydney-sweeney-zendaya-hbo （標題與作者 read；內文引句是 snippet："based on the three episodes released for review, Euphoria's third (and probably final) run was absolutely not worth the wait."）
    - Business Insider，〈'Euphoria' Season 3 Review: Even Zendaya Can't Save This〉— https://www.businessinsider.com/euphoria-hbo-season-3-premiere-review-zendaya-2026-4 （snippet："Euphoria has never been more boring."）
    - PTT EAseries：2026-04 S3 播出期間有多篇負評討論串，例如〈高校十八禁第三季評價怎麼爛成那樣?〉（candidates-fans-taiwan S6，板內搜尋列表頁 read）— https://www.ptt.cc/bbs/EAseries/search?q=高校十八禁
    - candidates-fans-taiwan 另記：2024–2026 的粉絲推薦串沒有人主動推；candidates-ratings 記：C/D/E 來源都沒有它（2023–25 沒有新季）。
- **推薦標籤**（刪除負評與業配後）：
  - A：Emmy Drama nom 2022（加上本頁補查的 Zendaya Emmy 女主角 win 2020、2022；nom 2026）
  - G：ELLE TW 2025（desc，上檔預告）；Cosmo TW 2025 預告（snippet）
  - 已刪：F PTT 板內多篇 S3 討論（多為負評）；G TEEPR×HBO Max 業配 #5
  - → 剩 A、G 兩類，未達 3 類門檻，依指示以例外保留。
- **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/4ffd33c9-e0d6-4cd6-bd13-34c266c79be0 ；JW https://www.justwatch.com/tw/節目/gao-xiao-shi-ba-jin — **已在服務商頁面確認**（3 季）

## 3. Succession｜繼承之戰

- **台灣官方譯名**：繼承之戰（HBO Max TW 頁）
- **劇情**：媒體集團 Waystar RoyCo 的 Roy 家族，在大家長健康出狀況時爭奪公司控制權。"The series centers on the Roy family, the owners of global media and entertainment conglomerate Waystar RoyCo, and their fight for control of the company amidst uncertainty about the health of the family's patriarch." — https://en.wikipedia.org/wiki/Succession_(TV_series) （read）
- **季數／狀態**：4 季、39 集，HBO 2018-06-03～2023-05-28 → **ended**。第一季 10 集。— 同上（read）；S1 集數：https://en.wikipedia.org/wiki/List_of_Succession_episodes （read）
- **分級**：US **TV-MA**；Taiwan 18+。IMDb：Sex & Nudity **Moderate**（261/804）、Violence & Gore **Mild**、Profanity **Severe**（553/607）、Alcohol, Drugs & Smoking **Moderate**、Frightening & Intense Scenes **Mild**（123/339）。條目：全劇 f-word 3,021 次；有大家長在心理上虐待子女的情節；有槍枝自殺；有吸毒。— https://www.imdb.com/title/tt7660850/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**89%**／**84%**（87 Reviews）。Consensus："Peppering its pathos with acid wit, Succession is a divine comedy of absolute power and dysfunction -- brought to vivid life by a ferocious ensemble." — https://www.rottentomatoes.com/tv/succession/s01 （read）
  - S4（最終季）：**98%**／**87%**（330 Reviews）。Consensus："As compulsively watchable as ever, Succession's final season concludes the saga of the backbiting Roy family on a typically brilliant -- and colorfully profane -- high note." — https://www.rottentomatoes.com/tv/succession/s04 （read）
- **推薦標籤**：
  - A：Emmy Drama win 2020、2022、2023；GG Drama win 2020、2022、2024
  - B：NYT2026 #4；BBC2021 #10
  - C：IMDb 8.8（#65）
  - F：PTT 2026 推薦串 ×3；PTT GOAT 串推文
- **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/a8484031-f244-4661-9fb7-0932bd1ba872 ；JW https://www.justwatch.com/tw/節目/succession — **已在服務商頁面確認**（4 季）

## 4. The Bear｜大熊餐廳

- **台灣官方譯名**：大熊餐廳（Disney+ zh-tw 頁；Disney+ 台灣官方 FB、Marie Claire TW）
- **劇情**：得獎主廚 Carmy 回到芝加哥老家，接手過世哥哥留下、亂成一團的義式牛肉三明治店。"Jeremy Allen White stars as Carmy Berzatto, an award-winning chef who returns to his hometown of Chicago to manage the chaotic kitchen at his recently deceased brother's Italian beef sandwich shop." — https://en.wikipedia.org/wiki/The_Bear_(TV_series) （read）
- **季數／狀態**：5 季、47 集；第一季 8 集（2022-06-23 一次上線）。"In July 2025, it was renewed for a fifth and final season of eight episodes"；第五季 2026-06-25 上線，另有 2026-05-05 的特別篇 → **ended**。— 同上（read）
- **分級**：US **TV-MA**。IMDb：Sex & Nudity **Mild**（268/607）、Violence & Gore **Mild**（181/247）、Profanity **Severe**（356/417）、Alcohol, Drugs & Smoking **Mild**（131/258）、Frightening & Intense Scenes **Moderate**（121/271）。條目：S1 8 集 f-word 475 次、S2 578 次；廚房刀傷；短暫吸食大麻與冰毒、使用 Xanax；大量恐慌發作場面，「One of the most anxiety inducing ... series」。— https://www.imdb.com/title/tt14452776/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**100%**／**92%**（82 Reviews）。Consensus："Like an expertly confected sandwich, The Bear assembles a perfect melange of ingredients and stacks them for optimal satisfaction -- and thankfully keeps the crust-iness for extra flavor." — https://www.rottentomatoes.com/tv/the_bear/s01 （read）
  - S5（最終季）：**96%**／**85%**（83 Reviews）。Consensus："The Bear closes out its final season with the character-driven finesse that it started with, ensuring its story and fans are served the finest of televisual meals without diminished returns." — https://www.rottentomatoes.com/tv/the_bear/s05 （read）
  - 對照：candidates-ratings 記 S4 84% / Popcorn 69%（RT 2025 list）。
- **推薦標籤**：
  - A：Emmy Comedy win 2023；GG Comedy win 2024；Emmy Comedy nom 2024–2026；GG Comedy nom 2025–2026
  - B：NYT2026 #74；CT10-2024 agg ~#17；THR2024（Fienberg honorable mention）
  - C：RT 2025 S4 84% / Popcorn 69%
  - F：PTT 2026 推薦串
  - G：LINE TODAY 聚光賞 2025 歐美劇 #3；GQ TW Disney+ 神級影集；釀電影 S23 提及
- **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-05eb6a8e-90ed-4947-8c0b-e6536cbddd5f — tw-availability-1 判 **B**（JustWatch + 服務 zh-TW 頁，地區未證）
  - **本輪重試**：沒有台灣出口可用，改找台灣在地的證據。Marie Claire 台灣〈Disney+《大熊餐廳》第五季最終季8集一次上線…〉（2026-06-26）標題 read — https://www.marieclaire.com.tw/entertainment/tvshow/94329 ；Disney+ 台灣官方 FB 影片〈地獄廚房最終季登場！《#大熊餐廳》第五季Disney+ 全季一口氣上線！〉（snippet）— https://www.facebook.com/DisneyPlusTW/videos/1182698740677930 。→ 平台官方台灣帳號＋台灣媒體佐證，但仍不是台灣出口的服務頁，維持 B，備註「台灣官方社群與媒體佐證」。

## 5. The Morning Show｜晨間直播秀

- **台灣官方譯名**：晨間直播秀（Apple TV TW 頁；候選檔的「晨間直播室」是錯的）
- **劇情**：Alex Levy 主持紐約 UBA 電視網的高收視晨間新聞節目《The Morning Show》，第一季以搭檔主播的性醜聞為核心。"Alex Levy co-anchors The Morning Show (TMS), a popular morning news program broadcast from Manhattan on the UBA network" — https://en.wikipedia.org/wiki/The_Morning_Show_(American_TV_series) （read；「第一季以性醜聞為核心」取自 IMDb Parents Guide 條目 "the central issue in season one is sexual misconduct"）
- **季數／狀態**：已播 4 季、40 集；第一季 10 集（2019-11-01～12-20）。"On July 23, 2026, it was announced that the series would end with its fifth season"；"The fifth and final season wrapped up filming in early August 2026" → **renewed（第 5 季為最終季，尚未開播）**。— 同上（read）
- **分級**：US **TV-MA**。IMDb：Sex & Nudity **Mild**（157/409）、Violence & Gore **None**（109/205）、Profanity **Severe**（286/418）、Alcohol, Drugs & Smoking **Mild**（110/194）、Frightening & Intense Scenes **Mild**（100/183）。條目：第一季有性侵情節（無裸露）；有服用 Adderall 與過量的場景；f-word 幾乎每場都有。— https://www.imdb.com/title/tt7203552/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**62%**／**64%**（107 Reviews）。Consensus："Though The Morning Show at times feels more like a vanity project than the hard-hitting drama it aspires to be, there is pleasure to be had in watching Jennifer Aniston and Reese Witherspoon give it their all." — https://www.rottentomatoes.com/tv/the_morning_show/s01 （read）
  - S4（最新）：**72%**／**64%**（36 Reviews）。Consensus："Shaking up its ensemble yet again while staying consistent in its tonal unevenness, The Morning Show's fourth season ought to satisfy viewers who consider excess to be a virtue." — https://www.rottentomatoes.com/tv/the_morning_show/s04 （read）
  - 寫作提醒：這是本篇 19 部裡影評分數最低的一部（不算 Euphoria S3），推薦時要講清楚它的優缺點。
- **推薦標籤**：
  - A：Emmy Drama nom 2024；GG Drama nom 2020、2022、2024
  - B：Vulture2025（Jackson McHenry #9）
  - C：RT 2025 list（rank 99–121，score not captured）
  - F：PTT 2026 推薦串
- **台灣串流**：Apple TV（訂閱）https://tv.apple.com/tw/show/umc.cmc.25tn3v8ku4b39tr6ccgb8nl6m ；JW https://www.justwatch.com/tw/節目/the-morning-show — **已在服務商頁面確認**

## 6. The Gilded Age｜鍍金年代

- **台灣官方譯名**：鍍金年代（HBO Max TW 頁）
- **劇情**：Julian Fellowes（《唐頓莊園》）為 HBO 創作的歷史劇，背景是 1880 年代紐約的鍍金時代。"an American historical drama television series created and written by Julian Fellowes for HBO that is set in the United States during the Gilded Age, the boom years of the 1880s, in New York City." — https://en.wikipedia.org/wiki/The_Gilded_Age_(TV_series) （read）
- **季數／狀態**：4 季、26 集；第一季 9 集（2022-01-24～03-21）。"In July 2025, the series was renewed for a fourth season"；第四季 2026-11-01 開播、排到 12-20 → **ongoing（第四季播出中）**。沒看到第五季續訂的資料。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 18+。IMDb：Sex & Nudity **Moderate**（126/350）、Violence & Gore **None**（49/89）、Profanity **None**（49/88）、Alcohol, Drugs & Smoking **Mild**（59/84）、Frightening & Intense Scenes **None**（57/83）。條目：女性裸露、性愛場面；一次槍擊自殺的血泊畫面；胸口中彈後的手術畫面「Very graphic depiction」。— https://www.imdb.com/title/tt4406178/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**79%**／**60%**（76 Reviews）。Consensus："Julian Fellowes' brand of upstairs, downstairs intrigue makes a seamless transatlantic transition in The Gilded Age, with an outstanding cast making the travails of the rich a compelling watch." — https://www.rottentomatoes.com/tv/the_gilded_age/s01 （read）
  - S3（最新完整播完的一季）：**96%**／**86%**（46 Reviews）。Consensus："Providing its gleaming ensemble with some of their juiciest material yet, The Gilded Age's tongue is still firmly in cheek but finds itself with plenty new to say." — https://www.rottentomatoes.com/tv/the_gilded_age/s03 （read）
  - S4（播出中）：Tomatometer **90%**（20 Reviews）；Popcornmeter 與 Consensus **尚未出現**。— https://www.rottentomatoes.com/tv/the_gilded_age/s04 （read）
- **推薦標籤**：
  - A：Emmy Drama nom 2024、2026
  - B：Variety2025（Aramide Tinubu #9）；Variety2025（Alison Herman #8）；Vulture2025（Kathryn VanArendonk #7）；CT10-2025 agg #18=
  - C：RT 2025 S3 96% / Popcorn 86%
  - F：PTT 2026 推薦串
  - G：FlixPatrol HBO Max TW 2026-11-05 #3；HBO Max TW「最新上線」（snippet）
- **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/2537da31-ff99-4195-a53e-e0e1ddb1d67e ；JW https://www.justwatch.com/tw/節目/the-gilded-age — **已在服務商頁面確認**（HBO TW 顯示 4 季）

## 7. Shōgun｜幕府將軍

- **台灣官方譯名**：幕府將軍（Disney+ zh-tw 頁）
- **劇情**：英國水手 Blackthorne 船難漂流到日本，與工於心計的大名吉井虎永相遇，兩人各有盤算；改編自 James Clavell 1975 年小說，對白大多是日語。Wikipedia Premise 引 FX 官方文案："the collision of two ambitious men from different worlds, John Blackthorne, a risk-taking English sailor who ends up shipwrecked in Japan ... and Lord Yoshii Toranaga, a shrewd, powerful daimyo, at odds with his own dangerous political rivals." — https://en.wikipedia.org/wiki/Shōgun_(2024_TV_series) （read）
- **季數／狀態**：已播 1 季、10 集（第一季 10 集）。原本規劃成迷你影集，2024-05 FX 宣布發展第二、三季；"Principal photography for the second season began on February 2, 2026 in Vancouver"（同頁另一處寫 2026-01）→ **renewed，第二季尚未開播**。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 15+（self-applied）。IMDb：Sex & Nudity **Moderate**（303/842）、Violence & Gore **Severe**（238/298）、Profanity **Moderate**（109/232）、Alcohol, Drugs & Smoking **Mild**（112/225）、Frightening & Intense Scenes **Moderate**（118/243）。條目：明確性行為與女性正面全裸；大量刺殺、割喉、斬首；切腹時內臟流出；人和馬被砲擊炸碎。— https://www.imdb.com/title/tt2788316/parentalguide/ （read (chunks)）
- **爛番茄**：只有一季，所以 S1 也是最新一季。RT 頁標題是「Limited Series」。**99%**／**85%**（144 Reviews）。Consensus："Visually sumptuous and enriched with cultural verisimilitude, Shōgun is an epic adaptation that outdoes the original." — https://www.rottentomatoes.com/tv/shogun_2024/s01 （read）
- **推薦標籤**：
  - A：Emmy Drama win 2024；GG Drama win 2025
  - B：CT10-2024 agg #1；Vulture2024（Roxana Hadadi #1）；Variety2024（Alison Herman #2）；NYT2026 #86
  - C：IMDb 8.6（#164）；RT 2024 99% / Popcorn 85%
  - F：PTT 2026 推薦串；PTT D+ 推薦串 ×2
  - G：GQ TW Disney+ 神級影集
- **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-5422a5f9-e4f1-475e-9217-65e8249388d0 ；JW https://www.justwatch.com/tw/節目/mu-fu-jiang-jun — tw-availability-2 判 **已在服務商頁面確認**（batch 2 的 Disney+ 標準；用 batch 1 的標準會是 B）

## 8. Chernobyl｜核爆家園

- **台灣官方譯名**：核爆家園（HBO Max TW 頁）
- **劇情**：重現 1986 年 4 月蘇聯烏克蘭車諾比核電廠事故，以及捲入事故與參與救災的人。"Chernobyl dramatizes the story of the April 1986 nuclear plant disaster which occurred in the Ukrainian Soviet Socialist Republic, Soviet Union, telling the stories of the people who were involved in the disaster and those who responded to it." — https://en.wikipedia.org/wiki/Chernobyl_(miniseries) （read）
- **季數／狀態**：迷你影集（limited），共 5 集。HBO（美）與 Sky UK（英）合製。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 15+，HBO Max 標 18+。IMDb：Sex & Nudity **Mild**（1180/2563）、Violence & Gore **Moderate**（646/1516）、Profanity **Mild**（632/1342）、Alcohol, Drugs & Smoking **Mild**（808/1209）、Frightening & Intense Scenes **Severe**（927/1464）。條目："Scenes depicting radiation exposure and its aftermath are intense."；全劇氣氛「grim, oppressive and terrifying」；有射殺家犬（含幼犬，部分在畫面外）的情節；第 3 集礦工全裸。— https://www.imdb.com/title/tt7366338/parentalguide/ （read (chunks)）
  - 白話版：**輻射傷害的身體畫面是最大的不適點**（屬於醫療／屍體類的寫實畫面）。
- **爛番茄**（單季）：**95%**／**97%**（103 Reviews）。Consensus："Chernobyl rivets with a creeping dread that never dissipates, dramatizing a national tragedy with sterling craft and an intelligent dissection of institutional rot." — https://www.rottentomatoes.com/tv/chernobyl/s01 （read）
- **推薦標籤**：
  - A：Emmy Limited win 2019；GG Limited win 2020
  - B：BBC2021 #15；NYT2026 #19
  - C：IMDb 9.3（#5）
  - F：PTT 2026 推薦串 ×4；PTT GOAT 串「歷史劇」
  - 備註：候選檔標記「美英合製，是否算美國製作要再判斷」。
- **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/396999a6-3fff-4af3-802b-10c46d10deff ；JW https://www.justwatch.com/tw/節目/he-bao-jia-yuan — **已在服務商頁面確認**（迷你影集 5 集）

## 9. Band of Brothers｜諾曼第大空降

- **台灣官方譯名**：諾曼第大空降（HBO Max TW 頁）
- **劇情**：改編 Stephen E. Ambrose 1992 年的同名非虛構書，十集戲劇化重現美軍 E 連（Easy Company）在二戰的經歷。"Over the course of ten episodes, Band of Brothers depicts a dramatized account of Easy Company's exploits during World War II." — https://en.wikipedia.org/wiki/Band_of_Brothers_(miniseries) （read）
- **季數／狀態**：2001 年迷你影集（limited），共 10 集。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 12+。IMDb：Sex & Nudity **Mild**（209/525）、Violence & Gore **Severe**（241/265）、Profanity **Severe**（157/269）、Alcohol, Drugs & Smoking **Mild**（145/245）、Frightening & Intense Scenes **Severe**（209/249）。條目：寫實戰鬥；第 6 集有彈片傷、喉部彈孔、戰地手術；第 7 集士兵醒來發現失去一條腿，「Lots of blood and gore」；有一整集在集中營，屍體成堆。— https://www.imdb.com/title/tt0185906/parentalguide/ （read (chunks)）
- **爛番茄**（單季）：**94%**／**97%**（35 Reviews）。Consensus："Band of Brothers offers a visceral, intense look at the horrors of war -- and the sacrifices of the millions of ordinary people who served." — https://www.rottentomatoes.com/tv/band_of_brothers/s01 （read）
- **推薦標籤**：
  - B：BBC2021 #36=；NYT2026 #28
  - C：IMDb 9.4（#4）
  - F：PTT 2026 推薦串 ×3；PTT GOAT 串「戰爭」
- **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/6a0a0227-f567-46ba-9a2d-04374c5f6193 — **confirmed on service page**；Prime Video https://www.primevideo.com/detail/0GEOKFLADKSMOB54NHYN67CD5A?language=zh_TW — 全球頁，JustWatch only；JW https://www.justwatch.com/tw/節目/nuo-man-di-da-kong-jiang

## 10. Dopesick｜毒疫

- **台灣官方譯名**：毒疫（Disney+ zh-tw 頁）
- **劇情**：改編 Beth Macy 的非虛構書，描寫美國鴉片類藥物危機怎麼開始、對個人與家庭的影響，以及 Purdue Pharma、OxyContin 與監管機關之間的利益衝突和後續訴訟。"The series focuses on how the opioid epidemic started and the people i[t affected]…"；Premise："focuses on 'the epicenter of America's struggle with opioid addiction' … on the alleged conflicts of interest involving Purdue Pharma and various government agencies … and finally, on the legal case against Purdue Pharma" — https://en.wikipedia.org/wiki/Dopesick_(miniseries) （read）
- **季數／狀態**：迷你影集（limited），8 集，Hulu 2021-10-13～11-17。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 15+（self-applied）。IMDb：Sex & Nudity **Mild**（53/116）、Violence & Gore **Mild**（28/42）、Profanity **Moderate**（27/57）、Alcohol, Drugs & Smoking **Severe**（45/55）、Frightening & Intense Scenes **Moderate**（15/41）。條目："Prescription drug abuse is a central theme, painkillers are used and frequently alluded to with honest depictions of addiction and dependence"。— https://www.imdb.com/title/tt9174558/parentalguide/ （read (chunks)）
- **爛番茄**（單季）：**89%**／**94%**（72 Reviews）。Consensus："Dopesick at times sinks under the weight of its subject matter, but strong performances from Michael Keaton and Kaitlyn Dever and an empathetic approach to the very real people impacted by the opioid crisis make for harrowing drama." — https://www.rottentomatoes.com/tv/dopesick/s01 （read）
- **推薦標籤**：
  - A：Emmy Limited nom 2022；GG Limited nom 2022
  - C：IMDb 8.6（#179）
  - F：PTT 2026 推薦串 ×2；PTT D+ 推薦串
- **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-227de06a-d3d4-42e0-9df1-bb5495e1738d ；JW https://www.justwatch.com/tw/節目/dopesick — tw-availability-2 判 **已在服務商頁面確認**（batch 2 的 Disney+ 標準）

## 11. American Primeval｜馴荒記

- **台灣官方譯名**：馴荒記（ELLE 台灣、中文 Wikipedia zh-tw；Netflix TW 頁未從台灣讀到）
- **劇情**：1857 年猶他戰爭期間，爭奪美國西部控制權的暴力衝突，圍繞 Mountain Meadows 屠殺事件。"Set in 1857 during the Utah War, the series dramatizes the fight to gain control of the American West and the violent clash between the Church of Jesus Christ of Latter-day Saints (LDS Church) and cultures in the Utah Territory, centering on the events surrounding the Mountain Meadows Massacre." — https://en.wikipedia.org/wiki/American_Primeval （read）
- **季數／狀態**：迷你影集（limited），6 集，Netflix 2025-01-09 上線。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 15+。IMDb：Sex & Nudity **Mild**（124/273）、Violence & Gore **Severe**（137/174，數字見搜尋摘要；嚴重度 read）、Profanity **Moderate**（42/108）、Alcohol, Drugs & Smoking **Mild**（69/114）、Frightening & Intense Scenes **Severe**（81/112）。條目：第一集有醉父企圖亂倫性侵；有帶進帳篷的性侵（未直接拍）；馬與無辜者被殺；"Rated TV MA for strong graphic brutal violence including grisly images, rape, and some language."— https://www.imdb.com/title/tt24069848/parentalguide/ （read (chunks)）
- **爛番茄**（單季）：RT 頁標「Limited Series」。**71%**／**87%**（59 Reviews）。Consensus："Handsomely shot and thoroughly grim, American Primeval drives home its point about a nation's bone-deep savagery to persuasive, and sometimes deadening, effect." — https://www.rottentomatoes.com/tv/american_primeval/s01 （read）
- **推薦標籤**：
  - B：Vulture2025（other highlights, unranked）
  - F：PTT 2025 年度最佳串
  - G：ELLE TW 2025 #1
- **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/81457507 ；JW https://www.justwatch.com/tw/節目/american-primeval — **僅 JustWatch**
  - **本輪重試**：Groundlane 對 Netflix TW 頁回 `OUTPUT_LIMIT`；Firecrawl 額度用完，不能用 TW 地區重抓 → 維持「僅 JustWatch」。補一筆旁證：中文 Wikipedia（zh-tw）寫「2025年1月9日在Netflix全球上線」（snippet）— https://zh.wikipedia.org/zh-tw/馴荒記 。Netflix 原創、全球上架，這是推論，不是台灣頁面證據。

## 12. The Queen's Gambit｜后翼棄兵

- **台灣官方譯名**：后翼棄兵 — **本輪已驗**：About Netflix 繁中（zh_tw）新聞稿標題〈《后翼棄兵》(The Queen's Gambit) 踏上破紀錄的將軍之路〉— https://about.netflix.com/zh_tw/news/the-queens-gambit-netflix-most-watched-scripted-limited-series （read）
- **劇情**：1950 年代中期到 1960 年代，孤兒出身的西洋棋天才 Beth Harmon 一路打到棋壇頂端，同時與藥物和酒精成癮掙扎。"the story follows the life of Beth Harmon (Anya Taylor-Joy), a fictional American chess prodigy on her rise to the top of the chess world while struggling with a drug and alcohol addict[ion]" — https://en.wikipedia.org/wiki/The_Queen's_Gambit_(miniseries) （read）
- **季數／狀態**：2020 年迷你影集（limited），7 集。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 16+。IMDb：Sex & Nudity **Mild**（671/1355）、Violence & Gore **None**（620/745）、Profanity **Moderate**（433/823）、Alcohol, Drugs & Smoking **Moderate**（385/871）、Frightening & Intense Scenes **None**（428/619）。條目：主角對鎮靜劑成癮；有自殺主題（母親開車自撞）。— https://www.imdb.com/title/tt10048342/parentalguide/ （read (chunks)）
- **爛番茄**（單季）：RT 頁標「Miniseries」。**96%**／**94%**（104 Reviews）。Consensus："Its moves aren't always perfect, but between Anya Taylor-Joy's magnetic performance, incredibly realized period details, and emotionally intelligent writing, The Queen's Gambit is an absolute win." — https://www.rottentomatoes.com/tv/the_queens_gambit/s01 （read）
  - 注意：Netflix 2020 年的新聞稿寫「爛番茄影評網更是開出罕見的 100% 正評」，那是當時的分數；**現在是 96%**，文章請用現值。
- **推薦標籤**：
  - A：Emmy Limited win 2021；GG Limited win 2021
  - B：BBC2021 #100；NYT2026 #81
  - C：IMDb 8.5（#214）
  - D：Netflix all-time English #9（112.8M）
- **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/80234304 — **C（JustWatch only）**
  - **本輪重試**：Groundlane `OUTPUT_LIMIT`；Firecrawl 無額度 → 地區可用性仍未從台灣頁面證實，維持 C。譯名已由 Netflix 官方繁中新聞稿確認。同一篇新聞稿說 2020 年上線後在「法國、台灣和澳洲，皆吸引大量觀眾」，可以證明當年在台灣上架，但不能證明現在還在。

## 13. This Is Us｜這就是我們

- **台灣官方譯名**：這就是我們（Disney+ zh-tw 頁；JW 顯示陸譯「我们这一天」）
- **劇情**：一對父母與三個孩子一家人的人生，在多條時間線之間交錯敘事。"The series follows the lives and families of two parents and their three children in several different timeframes." — https://en.wikipedia.org/wiki/This_Is_Us （read）
- **季數／狀態**：6 季、106 集，NBC 2016-09-20～2022-05-24 → **ended**。第一季 18 集。— 同上（read）；S1 集數：https://en.wikipedia.org/wiki/List_of_This_Is_Us_episodes （read）
- **分級**：US **TV-14**（部分集數 TV-PG）；Taiwan 18+（self-applied）。IMDb：Sex & Nudity **Mild**（144/288）、Violence & Gore **None**（94/139）、Profanity **Mild**（82/133）、Alcohol, Drugs & Smoking **Mild**（71/125）、Frightening & Intense Scenes **Mild**（56/112）。條目：大量處理死亡、疾病、酗酒與成癮；有一次自殺未遂；「may be intense for viewers that have lost a parent」。— https://www.imdb.com/title/tt5555260/parentalguide/ （read (chunks)）
  - 本篇 19 部裡唯一不是 TV-MA 的。
- **爛番茄**：
  - S1：**92%**／**91%**（215 Reviews）。Consensus："Featuring full-tilt heartstring-tugging family drama, This Is Us will provide a suitable surrogate for those who have felt a void in their lives since Parenthood went off the air." — https://www.rottentomatoes.com/tv/this_is_us/s01 （read）
  - S6（最終季）：**100%**／**87%**（18 Reviews）。Consensus："This Is Us comes to a close with a home-run of a final season that stays true to its dramatic, sappy, heart-wrenching, and emotionally resonant core, further solidifying the Pearson family's legacy as one of the best offerings in TV history." — https://www.rottentomatoes.com/tv/this_is_us/s06 （read）
- **推薦標籤**：
  - A：Emmy Drama nom 2017、2018、2019、2021；GG Drama nom 2017、2018
  - C：IMDb 8.7（#129）
  - F：PTT 2026 推薦串；PTT GOAT 串推文
- **台灣串流**：Disney+（訂閱，6 季）https://www.disneyplus.com/zh-tw/browse/entity-9dc170da-85db-475d-9df4-6572f15ffb00 — **B**（JustWatch + 服務 zh-TW 頁，地區未證）
  - **本輪重試**：搜尋台灣在地佐證（「這就是我們 Disney+ 台灣」）沒有找到相關結果；Disney+ 沒有台灣出口的頁面可讀 → 維持 B。

## 14. Pose｜艷放80

- **台灣官方譯名**：艷放80（Disney+ zh-tw 頁標題「觀看艷放80」）
- **劇情**：1980–90 年代紐約的 ball culture，非裔與拉丁裔社群中的 LGBTQ 次文化；舞者和模特兒為獎盃與認同競賽，並組成稱為「House」的選擇家庭互相扶持。"an American drama television series about New York City's ball culture, an LGBTQ subculture in the African-American and Latino communities, throughout the 1980s and 1990s." — https://en.wikipedia.org/wiki/Pose_(TV_series) （read）
- **季數／狀態**：3 季、26 集；第一季 8 集（2018-06-03～07-22）；第三季 2021 年播出、是最終季（RT S3 Consensus 稱 "Pose's final season"）→ **ended**。— 同上（read）
- **分級**：US **TV-MA**。IMDb：Sex & Nudity **Moderate**（31/79）、Violence & Gore **Mild**（23/43）、Profanity **Severe**（29/44）、Alcohol, Drugs & Smoking **Severe**（30/48）、Frightening & Intense Scenes **Mild**（22/42）。條目：80 年代愛滋疫情與角色死亡；年輕人因同志身分被父母趕出家門；大量吸毒。（投票數少，參考價值較低）— https://www.imdb.com/title/tt7562112/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**96%**／**88%**（84 Reviews）。Consensus："Charged with energy, poise, and confidence, Pose pirouettes between artistic opulence and deliciously soapy drama to create a fresh new addition to Ryan Murphy's lexicon." — https://www.rottentomatoes.com/tv/pose/s01 （read）
  - S3（最終季）：**100%**／**84%**（29 Reviews）。Consensus："Though it's entirely too short, Pose's final season is a joyously entertaining celebration of life that is not to be missed." — https://www.rottentomatoes.com/tv/pose/s03 （read）
- **推薦標籤**：
  - A：Emmy Drama nom 2019、2021；GG Drama nom 2019、2022
  - B：BBC2021 #62=
  - C：IMDb 8.6（#167）
- **台灣串流**：Disney+（訂閱，3 季）https://www.disneyplus.com/zh-tw/browse/entity-6bf318d8-f506-4e7f-a58f-0c5cc09b6c90 — **B**
  - **本輪重試**：搜尋只找到另一個 Disney+ 繁中頁 https://disneyplus.com/zh-hant/series/pose/1ARtTsGv1oCS （snippet，zh-hant，不是台灣專屬）；沒有台灣在地佐證 → 維持 B。

## 15. Landman｜石油天王

- **台灣官方譯名**：石油天王（CATCHPLAY+ 新聞稿、Yahoo 奇摩電影戲劇、JW TW；Prime zh_TW 頁顯示英文「Landman」）
- **劇情**：Taylor Sheridan 與 Christian Wallace 創作，靈感來自 podcast《Boomtown》；Billy Bob Thornton 飾演德州石油公司的「landman」（土地經理）。"Starring Billy Bob Thornton as a landman for an oil company" — https://en.wikipedia.org/wiki/Landman_(TV_series) （read）。台灣新聞稿的一句話版：「描述油田工人與石油億萬富翁間的角力，帶動了一場影響氣候、經濟與地緣政治的石油熱潮」— https://reading.udn.com/read/story/124409/9112526 （read，CATCHPLAY+ 提供的新聞稿）
- **季數／狀態**：已播 2 季、20 集；第一季 10 集（2024-11-17～2025-01-12）；第二季 2025-11-16～2026-01-18。"In December 2025, the series was renewed for a third season"；"Filming for the third season was scheduled to commence in May 2026" → **renewed，第三季尚未開播**。— Wikipedia 同上（read）
- **分級**：US **TV-MA**；Taiwan 15+。IMDb：Sex & Nudity **Moderate**（187/679）、Violence & Gore **Moderate**（87/176）、Profanity **Severe**（179/242）、Alcohol, Drugs & Smoking **Moderate**（92/191）、Frightening & Intense Scenes **Moderate**（85/162）。條目："Almost every episode contains work-related accidents, some of which are very graphic. Some scenes of torture."；每集約 50 個 f-word；脫衣舞俱樂部場景與短暫裸露；毒品交易。— https://www.imdb.com/title/tt14186672/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**78%**／**67%**（37 Reviews）。Consensus："Landman plumbs much of the same territory as other Taylor Sheridan-penned series, but having Billy Bob Thornton on hand turns this Texas crude into highly watchable fuel." — https://www.rottentomatoes.com/tv/landman/s01 （read）
  - S2（最新）：**83%**／**50%**（41 Reviews）。Consensus："Further refining its brutish elements into addictive drama, Landman's second season makes minor improvements in its treatment of female characters while continuing to benefit from Billy Bob Thornton's hangdog swagger." — https://www.rottentomatoes.com/tv/landman/s02 （read）
  - 寫作提醒：S2 觀眾分數只有 50%；Wikipedia 也寫 "Despite some elements igniting controversy"，女性角色的寫法是常見批評。
- **推薦標籤**：
  - C：RT 2025-page S2（listed in markdown only；本輪補到 S2 = 83% / 50%）
  - D：Nielsen 2025 #4 original 18.89B min；Nielsen H1 2026 #4 original 12.40B min
  - F：PTT 2025 年度最佳串 ×2（「今年最推」）；PTT 2026 推薦串
- **台灣串流**：Prime Video（訂閱，2 季）https://www.primevideo.com/-/zh_TW/detail?gti=amzn1.dv.gti.c6bb2607-7148-4525-8763-0f65ef40daa4 — B；CATCHPLAY+（訂閱，2 季）https://www.catchplay.com/tw/video/97248ae3-5df6-44c6-ba19-a132df01f177 — C；Netflix（JW 寫 1 季）https://www.netflix.com/tw/title/81946384 — C
  - **本輪重試**：CATCHPLAY+ 頁從非台灣 IP 打開會被轉回首頁，Firecrawl TW 無額度，所以服務頁仍未驗。補到台灣在地證據：琅琅悅讀（udn）2025-11-03 的 CATCHPLAY+ 新聞稿寫「《石油天王》(Landman) 第一季全十集，已於今日（11月1日）全數上架，全台只在CATCHPLAY+」（read）— https://reading.udn.com/read/story/124409/9112526 ；PTT 轉貼 Yahoo 奇摩〈11月美劇推薦 TOP 10〉寫「第二季共10集（11/17：每週一更新集數，1/19季終）」，台美同步（snippet）— https://www.ptt.cc/bbs/EAseries/M.1762350624.A.305.html 。→ CATCHPLAY+ 上架有台灣媒體與平台新聞稿佐證（2025-11 當時），可以升成「台灣平台新聞稿佐證」，但不是今天的服務頁。新聞稿裡的 CATCHPLAY 短網址是導購連結，不要引用。「全台只在 CATCHPLAY+」和 JW 列的 Prime Video、Netflix 互相矛盾，發布前請用台灣 IP 確認。

## 16. Orange Is the New Black｜勁爆女子監獄

- **台灣官方譯名**：勁爆女子監獄（Netflix 頁顯示；GQ TW 同名）
- **劇情**：紐約 33 歲女子 Piper Chapman 因十年前替販毒女友 Alex Vause 運送毒款，被判在 Litchfield 低度安全女子聯邦監獄服刑 15 個月。"The series begins revolving around Piper Chapman (Taylor Schilling), a 33-year-old woman living in New York City who is sentenced to 15 months in Litchfield Penitentiary, a minimum-security women's federal prison in Upstate New York." — https://en.wikipedia.org/wiki/Orange_Is_the_New_Black （read）
- **季數／狀態**：7 季、91 集，2013–2019 → **ended**（RT S7 Consensus 稱 "final season"）。第一季 13 集（2013-07-11 一次上線）。— 同上（read）；S1 集數：https://en.wikipedia.org/wiki/List_of_Orange_Is_the_New_Black_episodes （read）
- **分級**：US **TV-MA**（original rating）；Taiwan 16+。IMDb：Sex & Nudity **Severe**（573/711）、Violence & Gore **Moderate**、Profanity **Severe**（255/292）、Alcohol, Drugs & Smoking **Moderate**（125/266）、Frightening & Intense Scenes **Moderate**（109/249）。條目：大量女性全裸與明確性愛（含女同性戀性愛）；"One and possibly more episodes include brief segments of commercial porn"；肢解埋屍、槍傷縫合「Very bloody」；監獄暴力與謀殺；吸毒過量致死。— https://www.imdb.com/title/tt2372162/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**95%**／**92%**（57 Reviews）。Consensus："Orange Is the New Black is a sharp mix of black humor and dramatic heft, with interesting characters and an intriguing flashback structure." — https://www.rottentomatoes.com/tv/orange_is_the_new_black/s01 （read）
  - S7（最終季）：**98%**／**76%**（45 Reviews）。Consensus："Carried by its exceptional ensemble, Orange Is the New Black's final season gets straight to the point, tackling hard-hitting issues with the same dramatic depth and gallows humor that made the show so ground-breaking to begin with." — https://www.rottentomatoes.com/tv/orange_is_the_new_black/s07 （read）
- **推薦標籤**：
  - A：GG Comedy nom 2016
  - B：BBC2021 #65
  - G：GQ TW 10 部馬拉松影集
- **台灣串流**：Netflix（訂閱）https://www.netflix.com/tw/title/70242311 — **JustWatch only**（tw-availability-3：Netflix 頁有「勁爆女子監獄」、7 季，但是非台灣出口；JW TW 條目 slug 沒找到）
  - **本輪重試**：Groundlane `OUTPUT_LIMIT`；Firecrawl 無額度 → 維持。

## 17. The White Lotus｜白蓮花大飯店

- **台灣官方譯名**：白蓮花大飯店（HBO Max TW 頁標題「觀看 白蓮花大飯店｜HBO Max」）
- **劇情**：Mike White 編導的黑色喜劇選集，每季跟著房客與員工，在虛構的連鎖度假飯店 White Lotus 度過一週。"The series follows the exploits of the guests and staff during a week spent at the White Lotus, a fictional luxury global resort hotel chain." — https://en.wikipedia.org/wiki/The_White_Lotus （read）
- **季數／狀態**：已播 3 季、21 集；第一季 6 集（2021-07-11～08-15，夏威夷）；S2 2022（7 集）、S3 2025-02-16～04-06（8 集）。"On January 22, 2025, ahead of the third-season premiere, HBO renewed the series for a fourth season"，第四季在法國 Saint-Tropez 拍攝 → **renewed，第四季尚未開播**。— 同上（read）
- **分級**：US **TV-MA**。IMDb：Sex & Nudity **Severe**（876/1652）、Violence & Gore **Mild**（233/392）、Profanity **Moderate**（215/441）、Alcohol, Drugs & Smoking **Severe**（296/447）、Frightening & Intense Scenes **Mild**（128/382）。條目：明確性愛與裸露，含青少年角色的性相關內容；脫衣舞俱樂部；大麻、古柯鹼、K 他命、搖頭丸。— https://www.imdb.com/title/tt13406094/parentalguide/ （read (chunks)）
- **爛番茄**：
  - S1：**90%**／**78%**（98 Reviews）。Consensus："Though its true intentions can get a bit murky, gorgeous vistas, twisty drama, and a pitch perfect cast make The White Lotus a compelling - if uncomfortable - viewing destination." — https://www.rottentomatoes.com/tv/the_white_lotus/s01 （read）
  - S3（最新）：**86%**／**76%**（190 Reviews）。Consensus："Darker and more patient with its storytelling than previous seasons while brandishing a superb new ensemble full of acidic performances, The White Lotus' third season offers a spiritual respite that shivs the soul." — https://www.rottentomatoes.com/tv/the_white_lotus/s03 （read）
- **推薦標籤**：
  - A：Emmy Limited win 2022；GG Limited win 2023；Emmy Drama nom 2023、2025
  - B：NYT2026 #21；CT10-2025 agg #18=
  - C：RT 2025 S3 86% / Popcorn 76%
  - G：HBO Max TW 首頁「創新話題劇集」（snippet）；風傳媒/IMDb 2025 #1（snippet）；ELLE/Cosmo TW（desc/snippet）
- **台灣串流**：HBO Max（訂閱）https://www.hbomax.com/tw/zh/show/14f9834d-bc23-41a8-ab61-5c8abdbea505 ；JW https://www.justwatch.com/tw/節目/the-white-lotus — **confirmed on service page**

## 18. Dying for Sex｜死前慾望清單

- **台灣官方譯名**：死前慾望清單（Disney+ zh-tw 頁）
- **劇情**：大致根據 Molly Kochan 的真實經歷；Molly 確診癌症末期後離開丈夫，去追尋自己從沒體驗過的性高潮，由閨蜜陪她走完最後一段路。"the show depicts Molly being diagnosed with terminal cancer and leaving her husband in search of an orgasm." — https://en.wikipedia.org/wiki/Dying_for_Sex （read）
- **季數／狀態**：迷你影集（limited），8 集，2025-04-04 在 Hulu 與 Disney+ 上線。— 同上（read）
- **分級**：US **TV-MA**；Taiwan 18+。IMDb：Sex & Nudity **Moderate**（67/295）、Violence & Gore **None**（39/67）、Profanity **Moderate**（21/64）、Alcohol, Drugs & Smoking **Mild**（27/49）、Frightening & Intense Scenes **Mild**（15/41）。頁面條目很少（只有一條臀部裸露的描述）。— https://www.imdb.com/title/tt30252752/parentalguide/ （read (chunks)）
  - 補充：題材本身是癌症末期，劇中有骨轉移、手術等病程情節（劇情內容取自 Wikipedia Plot 段，read）；IMDb 沒有把這些標成血腥。
- **爛番茄**（單季）：RT 頁標「Limited Series」。**98%**／**80%**（63 Reviews）。Consensus："Jaunty and sweet but never flippant, Dying for Sex leverages wonderful performances from Michelle Williams and Jenny Slate to present a bittersweet ode to living life to its fullest." — https://www.rottentomatoes.com/tv/dying_for_sex/s01 （read）
- **推薦標籤**：
  - A：Emmy Limited nom 2025；GG Limited nom 2026
  - B：Variety2025（Alison Herman #4）；Vulture2025（Kathryn VanArendonk #6）；CT10-2025 agg #9
  - C：RT 2025 98% / Popcorn 80%
- **台灣串流**：Disney+（訂閱）https://www.disneyplus.com/zh-tw/browse/entity-423f6320-b55b-453b-a85f-dea05bd495d9 — **B**
  - **本輪重試**：只找到台灣影評粉專「我是影集控」的 FB 貼文，標題寫「Disney+ 影集：#死前慾望清單 Dying For Sex」（snippet）— https://www.facebook.com/100063612112140/posts/1314442777352780 。不是平台官方帳號 → 維持 B。

## 19. Sirens｜妖惑心計

- **台灣官方譯名**：妖惑心計 — **本輪新找到，snippet 等級**：Vogue Taiwan 官方 IG 貼文寫「Netflix 迷你影集《妖惑心計》」（snippet）— https://www.instagram.com/reel/DK_7vukyEg1 ；方格子影評〈影痴說心得｜Netflix《妖惑心計》〉（snippet）— https://vocus.cc/article/68396706fd89780001fda2f4 。tw-availability-1 原本寫「未驗（JW 顯示簡體『妖惑心计』）」；繁體寫法和 Vogue Taiwan 一致，但還沒有從 Netflix TW 頁驗證。
- **劇情**：Devon 擔心妹妹 Simone 和她的新老闆、億萬富豪名媛 Michaela 關係不太對，決定出手干預；故事發生在海邊豪宅的一個週末。Wikipedia Premise："Devon is concerned about her sister Simone's unusual relationship with her new boss, billionaire Michaela, and decides it is time for an intervention." — https://en.wikipedia.org/wiki/Sirens_(2025_TV_series) （read）；Netflix Tudum 官方文案（snippet）："Told over the course of one explosive weekend at the Kells' lavish beach estate, Sirens is an incisive, sexy, and darkly funny exploration of women, power, and class." — https://www.netflix.com/tudum/articles/sirens-series
- **季數／狀態**：迷你影集（limited），5 集；改編自 Molly Smith Metzler 2011 年的舞台劇《Elemeno Pea》。— Wikipedia 同上（read）
- **分級**：US **TV-MA**；Taiwan 15+。IMDb：Sex & Nudity **Mild**（68/201）、Violence & Gore **Mild**（29/52）、Profanity **Moderate**（16/56）、Alcohol, Drugs & Smoking **Moderate**（22/41）、Frightening & Intense Scenes **Mild**（23/38）。條目：口交場面（沒拍到細節）；有一具被樹枝貫穿胸口的屍體；酗酒與戒酒是主題之一；提到自殺；恐慌發作。— https://www.imdb.com/title/tt31429675/parentalguide/ （read (chunks)）
- **爛番茄**（單季）：RT 頁標「Limited Series」（slug `sirens_2025`）。**75%**／**56%**（72 Reviews）。Consensus："Sirens sings a tune tried and true thanks to laudable performances by Julianne Moore, Meghann Fahy, and Milly Alcock." — https://www.rottentomatoes.com/tv/sirens_2025/s01 （read）
  - 注意：Wikipedia 寫 77%（64 篇，2025-05-25 抓的），現值是 75%（72 篇）。
- **推薦標籤**：
  - B：Vulture2025（other highlights, unranked）
  - C：RT 2025-page（score not captured；本輪補到 75% / 56%）
  - D：Netflix H1 2025 #8（53.3M）
- **台灣串流**：Netflix（訂閱，限定影集）https://www.netflix.com/tw/title/81589551 ；JW https://www.justwatch.com/tw/節目/yao-huo-xin-ji — **C（JustWatch only）**
  - **本輪重試**：Groundlane `OUTPUT_LIMIT`；Firecrawl 無額度 → 維持 C。

---

## 總覽

| # | Show | 台譯 | US 分級 | RT S1（T / P） | RT 最新季（T / P） | 狀態 | 台灣證據 |
|---|---|---|---|---|---|---|---|
| 1 | The Pitt | 匹茲堡醫魂 | TV-MA | 94 / 88 | S2 99 / 86 | renewed（S3 2027-01） | 服務頁確認 |
| 2 | Euphoria | 高校十八禁 | TV-MA | 80 / 83 | S3 44 / 38 | ended（3 季） | 服務頁確認 |
| 3 | Succession | 繼承之戰 | TV-MA | 89 / 84 | S4 98 / 87 | ended（4 季） | 服務頁確認 |
| 4 | The Bear | 大熊餐廳 | TV-MA | 100 / 92 | S5 96 / 85 | ended（5 季） | B＋台灣官方社群佐證 |
| 5 | The Morning Show | 晨間直播秀 | TV-MA | 62 / 64 | S4 72 / 64 | renewed（S5 最終季，未播） | 服務頁確認 |
| 6 | The Gilded Age | 鍍金年代 | TV-MA | 79 / 60 | S3 96 / 86；S4 播出中 90 / – | ongoing（S4 播出中） | 服務頁確認 |
| 7 | Shōgun | 幕府將軍 | TV-MA | 99 / 85 | （只有 S1） | renewed（S2、S3） | 服務頁確認（batch 2 標準） |
| 8 | Chernobyl | 核爆家園 | TV-MA | 95 / 97 | – | limited（5 集） | 服務頁確認 |
| 9 | Band of Brothers | 諾曼第大空降 | TV-MA | 94 / 97 | – | limited（10 集） | 服務頁確認（HBO Max） |
| 10 | Dopesick | 毒疫 | TV-MA | 89 / 94 | – | limited（8 集） | 服務頁確認（batch 2 標準） |
| 11 | American Primeval | 馴荒記 | TV-MA | 71 / 87 | – | limited（6 集） | 僅 JustWatch |
| 12 | The Queen's Gambit | 后翼棄兵 | TV-MA | 96 / 94 | – | limited（7 集） | C（譯名已由 Netflix 繁中新聞稿確認） |
| 13 | This Is Us | 這就是我們 | TV-14 | 92 / 91 | S6 100 / 87 | ended（6 季） | B |
| 14 | Pose | 艷放80 | TV-MA | 96 / 88 | S3 100 / 84 | ended（3 季） | B |
| 15 | Landman | 石油天王 | TV-MA | 78 / 67 | S2 83 / 50 | renewed（S3） | B／C＋CATCHPLAY+ 新聞稿佐證 |
| 16 | Orange Is the New Black | 勁爆女子監獄 | TV-MA | 95 / 92 | S7 98 / 76 | ended（7 季） | JustWatch only |
| 17 | The White Lotus | 白蓮花大飯店 | TV-MA | 90 / 78 | S3 86 / 76 | renewed（S4） | 服務頁確認 |
| 18 | Dying for Sex | 死前慾望清單 | TV-MA | 98 / 80 | – | limited（8 集） | B |
| 19 | Sirens | 妖惑心計（snippet） | TV-MA | 75 / 56 | – | limited（5 集） | C |

## 沒能驗證的事實

1. **台灣串流可用性（9 部仍未達「服務頁確認」）**：The Bear、This Is Us、Pose、Dying for Sex（Disney+，B）；Landman（Prime B、CATCHPLAY+／Netflix C，另有 2025-11 的 CATCHPLAY+ 新聞稿佐證）；The Queen's Gambit、Sirens（Netflix，C）；American Primeval、Orange Is the New Black（Netflix，僅 JustWatch）。原因：本環境沒有台灣出口；Groundlane 讀 Netflix TW 頁回 `OUTPUT_LIMIT`；Firecrawl（`location: TW`）額度用完，2026-11-05T17:12Z 重置後可再試；CATCHPLAY+ 從非台灣 IP 會被轉回首頁。建議額度重置後用 Firecrawl TW 重抓這 9 部，或請使用者用台灣 IP 人工確認。
2. **Disney+ 判定標準不一致**：Shōgun、Dopesick 在 batch 2 算「已在服務商頁面確認」，同類型的 The Bear、This Is Us、Pose、Dying for Sex 在 batch 1 算 B。Disney+ zh-tw 頁本身不顯示地區或台幣價格，嚴格來說 6 部都只到 B。發布前請統一標準。
3. **Sirens 台灣譯名「妖惑心計」**：只有 Vogue Taiwan IG 與方格子的搜尋摘要（snippet），沒有從 Netflix TW 頁驗到。
4. **American Primeval 台灣譯名「馴荒記」**：來自 ELLE TW 與中文 Wikipedia（zh-tw），沒有從 Netflix TW 頁驗到。
5. **Landman 的台灣平台**：新聞稿寫「全台只在CATCHPLAY+」（2025-11），JustWatch TW 卻同時列 Prime Video 與 Netflix。哪些平台現在有、有幾季，沒有釐清。
6. **The Pitt 第三季**：tw-availability-2 說 JustWatch TW 已列 S3E1，Wikipedia 說 S3 在 2027-01 開播。以 Wikipedia 為準，JustWatch 那筆沒有再查。
7. **The Gilded Age**：第四季播出中，RT Popcornmeter 與 Critics Consensus 還沒出現（Tomatometer 90% 只有 20 篇）；有沒有續訂第五季，沒有查到資料。
8. **Shōgun 第二季開拍日期**：同一頁 Wikipedia 寫了 2026-01 和 2026-02-02 兩個日期；第二季上線日期未公布。
9. **The Morning Show 第五季上線日期**：只知道 2026-08 殺青、是最終季；IMDb 標題寫 2019–2027，Wikipedia 沒寫上線日期。
10. **IMDb 嚴重度是使用者投票**，不是官方分級；Pose、Dying for Sex、Sirens、Dopesick 的投票數很少（幾十票），參考價值較低。Tavily 回的是依 query 挑出的段落（read (chunks)），American Primeval 的 Violence & Gore 票數（137/174）只出現在搜尋摘要裡。
11. **Common Sense Media 沒有查**（IMDb 已經涵蓋全部 19 部，所以沒用 CSM 交叉比對）。
12. **The Guardian 與 Business Insider 的 Euphoria S3 評論**：只讀到標題與作者（Guardian），內文引句是 snippet。
13. **Euphoria 的獎項總數**（32 項艾美入圍、9 座）取自 Wikipedia 導言；同頁另一段寫「twenty five times … nine statues」，入圍數兩處不一致，沒有到 Television Academy 官網核對。
14. **推薦標籤裡的 metadata**（首播年、平台、類型）沿用 candidates 檔，候選檔自己註明是一般知識、沒有逐筆查證；本檔只核對了季數、集數、狀態。
