# 韓劇 4 事實表：職人——醫療、法律與職場（14 部）

- 查核日：2026-11-08。順序照 `post-kr4-shows.txt`。這份是資料表，不是文章草稿。
- 讀取狀態：**read** 表示整頁或目標區塊真的讀到了；**cache** 表示 Exa 回傳的頁面快取（非即時）；**partial** 表示只讀到部分；**snippet** 表示只看到搜尋摘要，不能當成事實，只當線索。
- 欄位 1 的台灣片名、欄位 8 的台灣串流，一律照抄 `tw-availability-1.md`／`tw-availability-2.md`（原判定寫法照抄英文），沒有另外改寫。
- 欄位 6（推薦 tag）取自 `candidates-awards-critics.md`（A/B）、`candidates-ratings-viewing-buzz.md`（C/D/E）、`candidates-fans-taiwan.md`（F/G），並對照 `merged-candidates.md`。每類只留 2–4 個最有資訊量的，得獎排在提名前。已刪掉：`A SDA-K`、`C Douban`（只有 snippet）、`G(轉譯)`（Joynews24 韓國業內票選轉譯）、負評為主的提及；**Extraordinary Attorney Woo 的 `E Good Data weekly drama buzz #1`（ratings 檔自己標 snippet）也刪了**。這輪 14 部沒有遇到業配標示。**拆列說明**：Doctor Cha（#6）的 `G LINE TODAY 2023 網友投票 #7` 是從 fans 檔第 151 行「LINE TODAY 2023 網友投票其他上榜作」合併列拆出來的。
- **欄位 4 分級的兩種來源要分開看**：「韓國播出分級」優先用韓文維基 `시청 등급`；韓文維基沒有欄位或沒有條目時，改用 IMDb Certifications 的 South Korea 列（使用者可編輯，屬旁證，各劇會註明）。IMDb Parents Guide 是**使用者投稿與投票**，不是官方分級。嚴重度用 IMDb 原文詞（None / Mild / Moderate / Severe），括號是「X of Y found this …」票數。**本篇 Parents Guide 票數比韓劇 1 還少：4 部完全沒有投票（Doctor Cha、Agency、The Art of Negotiation、Undercover Miss Hong），另有 5 部每類只有 1–11 票**。醫療劇的手術、器官畫面在投稿裡多半被歸在 Violence & Gore。
- **欄位 5 RT**：14 部只有 3 部有 Tomatometer（非常律師禹英禑 11 則、精神病房也會迎來清晨 6 則、車貞淑醫生 8 則），樣本都很小。

## 來源與方法

| 用途 | 來源 | 工具 | 讀取狀態 |
|---|---|---|---|
| 劇情、類型、集數、首播／完結日、電視台、片長、前置作品 | 英文 Wikipedia wikitext（`action=raw`），抽 infobox `genre` / `based_on` / `num_episodes` / `runtime` / `network` / `first_aired` / `last_aired` / `related`、導言、Synopsis／Plot／Premise、續季段落 | Groundlane `web_extract`（pattern） | read（14/14；Agency 用 `Agency_(South_Korean_TV_series)`） |
| 韓國播出分級、集數 | 韓文 Wikipedia wikitext（`시청 등급`、`방송 횟수`） | Groundlane `web_extract` | read（10 個條目有分級欄；外傷重症中心、非常律師禹英禑、狂醫魔徒、臥底洪小姐的條目沒有分級欄；協商的技術沒找到條目） |
| 續季消息 | Deadline（外傷重症中心）、엑스포츠뉴스（車貞淑醫生）、Bloter／엑스포츠뉴스（非常律師禹英禑）、머니투데이／엑스포츠뉴스（機智住院醫生生活）、스타데일리뉴스＋나무위키（浪漫醫生金師傅） | Groundlane `web_fetch`（read）；Exa `web_search_exa`（cache） | 見各劇 |
| IMDb ID、MDL ID | Wikidata SPARQL（P345、P3868） | Groundlane `web_fetch` | read（14/14 有 IMDb ID；7/14 有 MDL ID，其餘用 MDL 站內搜尋找到） |
| Parents Guide 五類別 + 各國分級 | `https://www.imdb.com/title/<id>/parentalguide/` | jina `read_url`（無 key，回全文） | read（14/14；本輪每頁都有類別標題，沒有 partial） |
| IMDb 評分與票數 | IMDb 標題頁 | Exa `web_fetch_exa` | cache（14/14） |
| MyDramaList 分數與評分人數 | `mydramalist.com/<id>` 的「Score: X (scored by N users)」 | Groundlane `web_extract`（render=never） | read（14/14；浪漫醫生金師傅三季分開讀） |
| Rotten Tomatoes | `rottentomatoes.com/tv/<slug>`，選取 `rt-text[slot=critics-score]`、`rt-link[slot=critics-reviews]`、`rt-text[slot=audience-score]` | Groundlane `web_extract` | read（9 個 slug 有頁面；5 個 slug 猜測回首頁） |

---

## 1. The Trauma Code: Heroes on Call

1. **片名**：**外傷重症中心**（Netflix Taiwan YT；tw-availability-1）／중증외상센터／*The Trauma Code: Heroes on Call*
2. **劇情**：曾在世界各地戰地行醫的天才外傷外科醫師白剛赫，來到人手不足、處境艱難的大學醫院外傷小組，用非典型作風把團隊帶成頂尖的外傷中心。Wikipedia Synopsis：「he possesses exceptional surgical skills honed through experience in conflict zones worldwide」。來源：https://en.wikipedia.org/wiki/The_Trauma_Code:_Heroes_on_Call （read）
3. **季數與狀態**：第 1 季 8 集，Netflix 2025-01-24 上線。片長 47–55 分鐘（infobox）。**已續訂第 2、3 季**：Deadline 2026-10-19〈Ju Ji-hoon & Choo Young-woo Return To 'The Trauma Code: Heroes On Call' With Seasons 2 & 3 In Production At Netflix〉寫「has gone into production on the second and third runs of the show」，主演 Ju Ji-hoon、Choo Young-woo 回歸，導演 Lee Do-yun 續任並親自寫劇本（https://deadline.com/2026/10/trauma-code-heroes-on-call-netflix-seasons-2-3-confirmed-1237165650/ ，read；英文維基導言也引用這篇，read）。**第 2 季沒有公布上線日期**。沒有讀到特別篇。
4. **分級**：
   - 韓國：**15**（IMDb Certifications South Korea 15，read）。韓文維基條目 `중증외상센터 (드라마)` 沒有分級欄（read）。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒有標平台）。美國 TV-MA、英國 15。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt28106730/parentalguide/ ）：Sex & Nudity **None**（19/22）、Violence & Gore **Moderate**（7/11）、Profanity **Moderate**（5/14）、Alcohol, Drugs & Smoking **None**（7/9）、Frightening & Intense **Mild**（8/10）。投稿提到：「quite of few scenes of surgical procedures with the requisite showing of organs, blood, etc. Nothing is too graphic」；有人說英文配音與字幕有多次 F*、M*F*。**手術、器官畫面是主要提醒。票數 9–22，參考性有限。**
5. **觀眾評分**：MDL **9.1**（64,565 人，https://mydramalist.com/54697-golden-hour ，read）；IMDb **8.4**（12K，cache）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**；Popcornmeter 99%（read，不建議引用）。
6. **推薦 tag**：
   - A：BlueDragon Drama win 2025；Baeksang Drama nom 2025
   - B：Time-K2025（Burt）honorable mention
   - C：MDL #6 9.1；IMDb 8.4（12K）
   - D：Netflix H1 2025 34M
   - F：PTT 2025 最愛串 約 13 人；Dcard 777果 5💡；Dcard Z.Y 4 分（神劇）
   - G：LINE TODAY 2025 十大追劇榜 #7；LINE TODAY 韓劇年度榜（前十，名次未知）；遠見 #9；DailyView 聲量 #4（聲量不等於好評）
   - （已刪：`A SDA-K Excellence 2025`、`G(轉譯) Joynews24 #3`。）
7. **前置作品**：改編自 Hansanleega 與 Hongbichira 的網路小說 *Trauma Center: Golden Hour*，2019 年改成 Naver Webtoon（導言與 infobox `based_on`，read）。不必先看原作。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81677629 — 證據 https://www.youtube.com/watch?v=-nSuieL6jNU 「《外傷重症中心》| 正式預告 | Netflix」，Netflix Taiwan，2025-01-13；JustWatch TW 列 Netflix；另見風傳媒 2026-09-09 — **confirmed (official channel)**（tw-availability-1）
- **類型核對**：infobox genre＝Medical / Comedy；導言「medical comedy television series」（read）。**符合本篇（醫療）**。注意 Wikipedia 把它歸成喜劇向，但投稿與劇情都有大量手術場面。

## 2. Dr. Romantic

1. **片名**：**浪漫醫生金師傅**（S3 宣傳名為「浪漫醫生金師傅3」）（Disney+ TW page；tw-availability-1）／낭만닥터 김사부／*Dr. Romantic*
2. **劇情**：在小型醫院「石牆醫院」，天才醫師金師傅帶著一批年輕醫師，學習什麼才是真正的醫師。Wikipedia 三季導言只寫播出資訊；IMDb 簡介寫「a "real doctor" story set in a small, humble hospital called Dol Dam Hospital」（cache）。英文維基 S3 段落：「the Doldam Hospital Regional Trauma Center, Kim Sa-bu's long-held dream, is set to be opened」（read）。來源：https://en.wikipedia.org/wiki/Dr._Romantic （read）
3. **季數與狀態**：**3 季，共 52 集 + 2 集特別篇**（infobox「52 + 2 special」，read），SBS TV。
   - 第 1 季：20 集，2016-11-07 到 2017-01-16（週一二 22:00），另有 2017-01-17 特別篇 1 集。片長 60 分鐘。韓文維基「20부작 + 스페셜 번외편 1부작」，read。
   - 第 2 季：開播前 2019-12-30 先播特別篇 1 集；正片 16 集，2020-01-06 到 02-25（週一二 21:40）。片長 63–90 分鐘。
   - 第 3 季：16 集，2023-04-28 到 06-17（週五六 22:00）。片長 70 分鐘。
   - 來源：英文維基 Series overview 與導言（read）；韓文維基 S2、S3 條目各「16부작」（read）。
   - **第 4 季沒有確認**：스타데일리뉴스 2026-09-22〈한석규의 '낭만닥터 김사부 4'가 기다려지는 이유〉是期待文，不是製作消息（cache）；나무위키「낭만닥터 김사부 시리즈」寫「현재 3년이 되었지만 시즌4의 소식은 들리지 않고 있다」（cache）。
   - 英文維基導言：S1–S2 在 Viu、S3 在 Disney+ 部分地區串流（read）。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 S1 條目 `시청 등급 = 15`、S3 條目 `= 15`，read；S2 條目沒有分級欄。IMDb Certifications South Korea 15，read）
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-1，2026-11-08）；IMDb Certifications 寫「Taiwan 16+ self-applied」（read）。**兩者不一致，文章用 Disney+ 的 15+。** 美國 TV-14；新加坡另列「NC16 season 3: Disney+」。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt6157190/parentalguide/ ；IMDb 把三季合成同一個條目）：Sex & Nudity **Mild**（7/11）、Violence & Gore **None**（2/3）、Profanity **None**（2/2）、Alcohol, Drugs & Smoking **Mild**（2/4）、Frightening & Intense **Moderate**（3/5）。投稿只提到主角幾次說要「sleeping together」。**票數只有 2–11，幾乎沒有參考價值；手術血腥沒有人投稿。**
5. **觀眾評分**：MDL 三季分開評分——S1 **8.7**（48,435 人，https://mydramalist.com/19510-romantic-doctor-teacher-kim ）、S2 **8.7**（43,576 人，https://mydramalist.com/38301-romantic-doctor-teacher-kim-2 ）、S3 **8.9**（23,389 人，https://mydramalist.com/711113-dr-romantic-3 ）（皆 read）；IMDb **8.4**（7.3K，三季合併，cache）。RT：`/tv/dr_romantic` slug 回首頁，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2017
   - C：MDL S3 #30 8.9；S2 #53 8.7
   - D：KDF 2020 #2 27.1%（S2）；KDF 2023 #9 14.4%（S3）
   - E：FUNdex Awards 2023 TV drama finalist（S3）
   - F：PTT 2023 徵文 12 推（S3）；PTT 2021 入坑串 金師傅系列 約 4 人
   - G：LINE TODAY 2023 網友投票 #3（5.8%，S3）
7. **前置作品**：原創劇（infobox 沒有 `based_on`）。**季與季之間有連續性**：S2、S3 的年輕主角群相同（Ahn Hyo-seop、Lee Sung-kyung、Kim Joo-hun，導言 read），S3 接 S2 三年後（S3 劇情段落，read）；S1 年輕主角是 Yoo Yeon-seok、Seo Hyun-jin；Han Suk-kyu 三季都是金師傅。依序看最好；只看 S2 起跳也看得懂主線（這句是判斷，不是來源）。
8. **台灣串流**：Disney+ https://www.disneyplus.com/zh-tw/browse/entity-37b31212-ee3e-4440-9d10-b9247c830d5c （頁面標 2016–2023，看來三季都在）。uptogo.com.tw（2026-03）稱 Netflix TW 有 S1–S2，只是線索。證據：服務頁「觀看浪漫醫生金師傅 | Disney+」，15+，2026-11-08；另 https://www.youtube.com/watch?v=fbb4cj4k7qc 「韓國醫療神劇《#浪漫醫生金師傅》#第三季 Disney+現正熱播中」，Disney Plus TW，2023-05-19 — **confirmed (service page)**（tw-availability-1）
- **類型核對**：infobox genre＝Romance / Medical / Melodrama（read）。**符合本篇（醫療）**。

## 3. Extraordinary Attorney Woo

1. **片名**：**非常律師禹英禑**（Netflix YT；tw-availability-1）／이상한 변호사 우영우／*Extraordinary Attorney Woo*
2. **劇情**：有自閉症、記憶力過人的新手律師禹英禑進入首爾大型律師事務所，靠一件件案子證明自己，也贏得同事與委託人的信任。Wikipedia：「an autistic female rookie attorney hired by a major law firm in Seoul」。來源：https://en.wikipedia.org/wiki/Extraordinary_Attorney_Woo （read）
3. **季數與狀態**：第 1 季 16 集，ENA 2022-06-29 到 08-18（週三四 21:00）。片長 64–82 分鐘（infobox）。韓文維基「16부작」（read）。
   - **第 2 季：宣布過，但沒有播出時間、沒有確認卡司**。英文維基：2022-08-17 製作公司 AStory 代表李相伯說將做第 2 季、預計 2024 年播出（read）——**這個時程已經過了**。韓文維基 infobox 有 `후편 = 이상한 변호사 우영우 시즌 2` 連結，但條目不存在（404，read）。
   - 最新消息：Bloter 2026-01-29 引業界人士說文智媛編劇正在寫第 2 季劇本、進入前期製作（cache）；導演劉仁植 2026-05-15 受訪說「시즌2는 아직 이야기할 수 있는 단계가 아니」（엑스포츠뉴스，cache）；나무위키（2026-09-18 修正）寫編劇曾告製作公司、第 2 季「불명확한 상태」（cache，屬 wiki 整理，不是一手來源）。**結論：寫「第 2 季仍在籌備、沒有播出時間」，不要寫「已確定播出」。**
   - 沒有讀到特別篇。
4. **分級**：
   - 韓國：**15**（IMDb Certifications「South Korea 15 self-applied」，read）。韓文維基沒有分級欄（read）。
   - 台灣：IMDb Certifications「Taiwan 16+ self-applied」（read）。美國 TV-14 self-applied、英國 15。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt20869502/parentalguide/ ）：Sex & Nudity **None**（35/50）、Violence & Gore **Mild**（18/31）、Profanity **Mild**（17/30）、Alcohol, Drugs & Smoking **Mild**（22/31）、Frightening & Intense **None**（27/36）。投稿提到：有一集討論智能障礙女性被控性侵的案件（「nothing is shown」）；有角色企圖自殺；全劇約兩次 F-word。**本篇票數最多的一部（30–50 票）。**
5. **觀眾評分**：MDL **8.8**（117,052 人，https://mydramalist.com/705723-strange-lawyer-woo-young-woo ，read；本篇評分人數最多）；IMDb **8.5**（41K，cache）。RT：Tomatometer **100%**（11 則）、Popcornmeter **94%**（https://www.rottentomatoes.com/tv/extraordinary_attorney_woo ，read；本篇影評數最多，但仍小）。
6. **推薦 tag**：
   - A：IntlEmmy Drama Series nom 2023；Baeksang Drama nom 2023
   - B：Cine21-2022 #1
   - C：IMDb 8.5（41K）；MDL #34 8.8
   - D：NielsenKR cable #10 17.534%；KDF 2022 #2 17.5%；Netflix 非英語影集歷來前十（曾上榜，已掉出）
   - F／G：無（fans 檔沒有這部的台灣口碑 tag）
   - （已刪：`A SDA-K Excellence 2023`；`E Good Data weekly drama buzz #1 5 weeks`，ratings 檔標 snippet。）
7. **前置作品**：原創劇（infobox 沒有 `based_on`，read）。不必先看任何作品。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81518991 — 證據 https://www.youtube.com/watch?v=rzqCypKbE7Y 「非常律師禹英禑 | 正式前導預告 | Netflix」，Netflix Malaysia（Asia zh channel），2022-06-24（「NETFLIX 獨家」）— **confirmed (official channel, Asia zh). This is a licensed ENA title and the evidence is from 2022.**（tw-availability-1）
   - ⚠️ **舊證據**：授權劇，最新證據是 2022 年。寫文前最好用台灣裝置確認還在架。
- **類型核對**：infobox genre＝Legal drama（read）。**符合本篇（法律）**。

## 4. Resident Playbook

1. **片名**：**機智住院醫生生活**（Netflix Taiwan YT；tw-availability-1）／언젠가는 슬기로울 전공의생활／*Resident Playbook*
2. **劇情**：在低生育率年代，一群年輕住院醫師自願走進冷門的婦產科，在律濟醫院鍾路分院一邊出錯、一邊長大，也慢慢成為彼此的朋友。Wikipedia Synopsis：「young obstetrics and gynaecology residents who proudly enter the unpopular department in an era of low birth rates」。來源：https://en.wikipedia.org/wiki/Resident_Playbook （read）
3. **季數與狀態**：1 季 12 集，tvN 2025-04-12 到 05-18（週六日 21:10）。片長 70–90 分鐘（infobox）。韓國以外在 Netflix 部分地區串流（導言，read）。韓文維基「12부작」（read）。原訂 2024 年播出，因醫師罷工延期（英文維基製作段落「postponed」「cancelled this year until further notice」，read；머니투데이 2025-05-27 也提到，cache）。
   - **第 2 季沒有確認**：導演李珉洙 2025-05-27 說「아직 시즌2에 대한 구체적인 계획은 없습니다」（머니투데이、엑스포츠뉴스，cache）。2026 年沒有找到新消息。
   - 沒有讀到特別篇（韓文維基只寫 12부작）。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications 沒有台灣列；沒有找到 Netflix TW 分級來源。美國 TV-14、英國 12。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt31171500/parentalguide/ ）：Sex & Nudity **None**（4/4）、Violence & Gore **None**（3/5）、Profanity **None**（2/2）、Alcohol, Drugs & Smoking **Mild**（2/4）、Frightening & Intense **Mild**（2/4）。投稿提到：「graphic scenes including blood, open surgical incisions showing organs, and childbirth details」——**雖然投票選 None，投稿文字寫有開刀與分娩畫面**。**票數只有 2–5，幾乎沒有參考價值。**
5. **觀眾評分**：MDL **8.7**（37,394 人，https://mydramalist.com/757797-a-life-of-a-resident-that-will-be-wise-someday ，read）；IMDb **8.0**（5.5K，cache）。RT：頁面存在但 **0 則影評，也沒有 Popcornmeter**（read）。
6. **推薦 tag**：
   - B：Time-K2025（Burt）#6
   - C：MDL #60 8.7
   - E：FUNdex Awards 2025 男主角＋女主角＋配角（3 項獲獎）；2025 ending-drama buzz top 10
   - F：PTT 2025 最愛串 約 20 人；PTT 2025 印象串 原 PO #5（並列）
   - G：Netflix TW 2025-04-28～05-04 #3（累計 8 週）；LINE TODAY 韓劇年度榜（前十）；遠見 #8；DailyView 聲量 #6
   - （已刪：`G(轉譯) Joynews24 #7（並列）`。）
7. **前置作品**：**《機智醫生生活》（*Hospital Playlist*，2020–2021）的衍生劇（spin-off）**，infobox `related`＝Hospital Playlist（read）；導言「This TV series is a spin-off of the 2020–2021 series Hospital Playlist」（read）。由申源浩、李祐汀創作（導言「created by Shin Won-ho and Lee Woo-jung」，read）。舞台是同一家律濟醫院，但主角是新的一批住院醫師；英文維基製作段落也記錄製作中曾有媒體說它「neither prequel nor spin-off」，播出時定位為 spin-off（read）。**不必先看《機智醫生生活》也看得懂**（判斷）；看過的人會認出原作角色——nbntv 2025-05-18 結局報導寫第 12 集秋敏荷成為教授、丈夫梁錫亨也出場（cache）。另：同一團隊也做過本篇 #11《機智牢房生活》，但兩者沒有劇情關係。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81739043 — 證據 https://www.youtube.com/watch?v=LatkjyWUras 「《機智住院醫生生活》 | 正式預告 | Netflix」，Netflix Taiwan，2025-03-26 — **confirmed (official channel)**（tw-availability-1）
- **類型核對**：infobox genre＝Medical drama（read）。**符合本篇（醫療）**。

## 5. Daily Dose of Sunshine

1. **片名**：**精神病房也會迎來清晨**（Netflix Taiwan YT；tw-availability-1）／정신병동에도 아침이 와요／*Daily Dose of Sunshine*
2. **劇情**：從內科調到精神科的三年資歷護理師鄭多恩，在明信大學醫院精神病房照顧形形色色的病人。Wikipedia Synopsis：「a skilled nurse in the Department of Psychiatry at Myungshin University Hospital, and her interactions with the patients under her care」。來源：https://en.wikipedia.org/wiki/Daily_Dose_of_Sunshine （read）
3. **季數與狀態**：1 季 12 集，**Netflix 原創**，2023-11-03 上線（infobox `released`、導言，read）。片長 52–72 分鐘。韓文維基「12부작」（read）。**已完結的單季完整故事**，沒有讀到續季或特別篇。
4. **分級**：
   - 韓國：**15세 이상 시청가（주제, 언어, 모방위험）**——韓文維基標示 15 歲以上，理由是主題、語言、模仿風險（read）。IMDb South Korea 15（read）。
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒有標平台）。美國 TV-14、英國 15、紐西蘭 R16（Netflix rating）。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26258202/parentalguide/ ）：Sex & Nudity **Mild**（9/26，投稿說「there was no nudity whatsoever」，票數分歧）、Violence & Gore **Mild**（12/14）、Profanity **None**（12/14）、Alcohol, Drugs & Smoking **Mild**（7/12）、Frightening & Intense **Mild**（6/13）。投稿提到：「one episode in which someone is shown self-harming」；「a scene of self-harm and two scenes of suicide」。**自傷、自殺情節是這部最重要的觀看提醒。**
5. **觀眾評分**：MDL **8.8**（39,485 人，https://mydramalist.com/720737-morning-comes-to-the-mental-ward ，read）；IMDb **8.1**（6.6K，cache）。⚠️ 同一個 IMDb 快取頁顯示「S1 Episodes 5.5 Average from 5.7K episode ratings」，單集分數 5.4–5.7，和總分 8.1 落差很大，原因不明，**單集分數不要引用**。RT：Tomatometer **100%**（6 則）、Popcornmeter **91%**（https://www.rottentomatoes.com/tv/daily_dose_of_sunshine ，read；樣本很小）。
6. **推薦 tag**：
   - A：BlueDragon Drama win 2024；**International Emmy Best Comedy nom 2024**（英文維基獎項表也列「2024 | Best Comedy | Nominated」，read）；Baeksang Drama nom 2024
   - B：Cine21-2023 #7；Time-K2023（de Guzman，只列 Netflix 劇、未排名）
   - C：MDL #49 8.8
   - F：PTT 2023 年度徵文兩篇 26、19 推
   - G：LINE TODAY 2023 網友投票 #5（4.84%）
   - （補充，不在候選檔：英文維基獎項表列 Korea Broadcast Critics Awards 2024 Best Drama「won」，read。）
7. **前置作品**：改編自前護理師李羅荷（Lee Ra-ha）的同名 Kakao Webtoon，取材自作者的親身經歷（導言、infobox `based_on`，read）。不必先看原作。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81572595 — 證據 https://www.youtube.com/watch?v=R6zOwqATr8o 「《精神病房也會迎來清晨》| 正式預告 | Netflix」，Netflix Taiwan，2023-10-19；另見風傳媒 2026-09-09（11162785）— **confirmed (official channel)**（tw-availability-1）
- **類型核對**：infobox genre 第一項 Medical drama（後續項目被 ref 截斷，partial）（read）。**符合本篇（醫療）**；基調是療癒與心理健康，不是外科緊張戲。

## 6. Doctor Cha

1. **片名**：**車貞淑醫生**（Netflix YT；tw-availability-1）／닥터 차정숙／*Doctor Cha*
2. **劇情**：醫學院畢業後當了二十年家庭主婦的車貞淑，在一場意外危機後決定重回醫界，從一年級住院醫師做起；IMDb 簡介另寫醫師丈夫「is also great at cheating on his wife」（cache）。Wikipedia Synopsis：「a housewife of twenty years who becomes a first-year medical resident」。來源：https://en.wikipedia.org/wiki/Doctor_Cha （read）
3. **季數與狀態**：第 1 季 16 集，JTBC 2023-04-15 到 06-04（週六日 22:30）。韓國在 TVING、其他地區在 Netflix（導言，read）。英文維基沒有片長；IMDb 標 1h（cache）。韓文維基「16부작」（read）。
   - **第 2 季：演員端確認、製作端未確認**。엑스포츠뉴스 2025-09-01：嚴正花、金炳哲的經紀公司說「'닥터 차정숙2'에 출연하는 것이 맞다」，但製作公司 SLL 說「제작 관련해서 구체적으로 논의된 부분은 없다」（https://www.xportsnews.com/article/2047426 ，read）。MyDramaList 有「Doctor Cha Season 2 (2027)」條目，標 Upcoming（https://mydramalist.com/800176-doctor-cha-season-2 ，read；MDL 是使用者編輯，不是官方）。**沒有找到電視台或播出時間的正式公告。**
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications 沒有台灣列。美國 TV-14 self-applied、英國 15。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt27075857/parentalguide/ ；IMDb 標題是「Doctor Cha Jeong Suk」）：**五個類別全部「No data」，沒有投票。**
5. **觀眾評分**：MDL **8.1**（20,672 人，https://mydramalist.com/718109-doctor-cha-jung-sook ，read）；IMDb **7.5**（2.9K，cache；後段單集分數 7.3–7.5，比前段 8.2 低）。RT：Tomatometer **88%**（8 則）、Popcornmeter **93%**（https://www.rottentomatoes.com/tv/doctor_cha ，read；樣本很小）。
6. **推薦 tag**：
   - B：Time-K2023（de Guzman，只列 Netflix 劇、未排名）
   - D：NielsenKR cable #8 18.546%；KDF 2023 #5 18.5%；Netflix H1 2023 #25 197.7M 小時
   - E：FUNdex Awards 2023 news/clip finalist
   - G：LINE TODAY 2023 網友投票 #7（從 fans 檔第 151 行合併列拆出）
7. **前置作品**：原創劇（infobox 沒有 `based_on`）。不必先看。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81682438 — 證據 https://www.youtube.com/watch?v=6dAUcVjjv78 「車貞淑醫生 | 正式預告 | Netflix」，Netflix Malaysia（Asia zh channel），2023-04-19 — **confirmed (official channel, Asia zh). This is a licensed JTBC title and the evidence is from 2023.**（tw-availability-1）
   - ⚠️ **舊證據**：授權劇，最新證據是 2023 年，需台灣裝置確認。
- **類型核對**：infobox genre 第一項 Medical（後續項目被 ref 截斷，partial）；infobox 引用的 Korea Times 標題稱它「hopeful comedy」（read）。**符合本篇（醫療）**，但主線一半是婚姻與家庭（外遇），介紹時要說清楚是「醫療＋家庭喜劇」。

## 7. Hyper Knife

1. **片名**：**狂醫魔徒**（Disney+ TW page；tw-availability-2）／하이퍼나이프／*Hyper Knife*
2. **劇情**：被吊銷執照的天才神經外科醫師鄭世玉，在暗處進行非法手術，直到和當年的恩師崔德熙重逢，兩人展開權力與復仇的角力。Wikipedia Synopsis：「Stripped of her medical license, she resorts to performing illegal surgeries in the shadows」。來源：https://en.wikipedia.org/wiki/Hyper_Knife （read）
3. **季數與狀態**：1 季 8 集，**Disney+ 原創**，2025-03-19 到 04-09（infobox，read）。英文維基沒有片長；IMDb 標 1h（cache）。韓文維基「8부작」（read）。沒有讀到續季或特別篇。**2026 國際艾美獎 TV Movie/Mini-series 入圍，頒獎典禮 2026-11-23，結果未出**（英文維基獎項表標 `pending`，引 Variety，read；awards 檔同）。
4. **分級**：
   - 韓國：**19**（IMDb Certifications「South Korea 19」，read）。韓文維基沒有分級欄（read）。**只有 IMDb 一個來源，而 IMDb 是使用者可編輯資料；需要時再用韓國來源確認。**
   - 台灣：Disney+ TW 頁標 **15+**（tw-availability-2，2026-11-08）；IMDb「Taiwan 15+」（read）。美國 TV-MA、新加坡 M18、紐西蘭 R16。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35378081/parentalguide/ ）：Sex & Nudity **Mild**（6/10，投稿：第 4 集約 22:42 有胸部裸露）、Violence & Gore **Severe**（5/5，投稿：「People have their heart removed and forced to bite it」）、Profanity **Severe**（3/5）、Alcohol, Drugs & Smoking **Severe**（3/3）、Frightening & Intense **Severe**（4/4）。**本篇唯一四類都是 Severe 的一部，但每類只有 3–10 票。** 寫文時要清楚標示血腥與暴力。
5. **觀眾評分**：MDL **7.9**（10,753 人，https://mydramalist.com/760649-hyper-knife ，read；本篇 MDL 最低）；IMDb **7.3**（2.7K，cache；本篇 IMDb 最低）。RT：頁面存在但 **0 則影評**；Popcornmeter 81%（read，不建議引用）。
6. **推薦 tag**：
   - A：IntlEmmy TV Movie/Mini-series nom 2026（2026-11-23 揭曉，待定）
   - B：Cine21-2025 #10
   - F：PTT 2025 最愛串 約 15 人（只有一個來源，但提名數高）
7. **前置作品**：原創劇（infobox 沒有 `based_on`）。不必先看。
8. **台灣串流**：**Disney+** https://www.disneyplus.com/zh-tw/browse/entity-2ec24dc1-0c67-44c9-b043-b5d0537a66cb （訂閱）— 證據：Disney+ TW 頁「觀看狂醫魔徒 | Disney+」（15+）2026-11-08 在架 — **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre＝Medical drama / Crime thriller（read）。**符合本篇（醫療）**，但它是黑暗驚悚，跟其他醫療劇的溫暖路線很不同，介紹時要分開說。

## 8. Agency

1. **片名**：**代理公司**（Netflix TW page title; TW media；tw-availability-1）／대행사／*Agency*
2. **劇情**：高雅仁在一家大型廣告公司一路往上爬，成為公司第一位女性高階主管。Wikipedia Synopsis：「Go Ah-in who becomes the first female executive member of a large advertising agency」。來源：https://en.wikipedia.org/wiki/Agency_(South_Korean_TV_series) （read）
3. **季數與狀態**：1 季 16 集，JTBC 2023-01-07 到 02-26（週六日 22:30）。片長 60–72 分鐘（infobox）。韓文維基「16부작」（read）。**已完結的單季完整故事**，沒有讀到續季或特別篇。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基條目「대행사」`시청등급 = 15`，read；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications 沒有台灣列。加拿大 TV-14 self-applied、新加坡 NC16。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt26253514/parentalguide/ ）：**五個類別全部「No data」，沒有投票**；頁面寫「not yet rated」。
5. **觀眾評分**：MDL **8.2**（4,783 人，https://mydramalist.com/723665-advertising-agency ，read）；IMDb **7.8**（850 票，cache；票數少）。RT：`/tv/agency` slug 回首頁，**沒有找到 RT 頁面**（slug 很可能撞名，未再試）。
6. **推薦 tag**：
   - D：NielsenKR cable #18 16.044%；KDF 2023 #7 16%
   - E：FUNdex Awards 2023 TV drama finalist
   - F：PTT 2023 年度徵文 17 推；PTT 2026 入坑串 2（推文說「片名取超爛」，是講片名不是講劇）
   - G：LINE TODAY 2023 網友投票 #27
7. **前置作品**：英文維基 infobox 沒有 `based_on`（read）。不必先看任何作品。
8. **台灣串流**：Netflix https://www.netflix.com/tw/title/81672245 。LINE TV（https://www.linetv.tw/drama/14287/eps/1 ）現在寫「此戲劇因授權到期，已下架」。證據 https://www.harpersbazaar.com/tw/culture/drama/g44218747/agency-quotes/ Harper's Bazaar TW，2023-06-16：「Netflix職場劇《代理公司》」— **confirmed (Taiwan media, 2023-06). The evidence is old; no 2025–26 source was found.**（tw-availability-1）
   - ⚠️ **舊證據**：授權劇，最新證據是 2023-06，而且 LINE TV 已經因授權到期下架，Netflix 也可能有同樣狀況。寫文前一定要台灣裝置確認。
- **類型核對**：infobox genre＝Workplace（read）。**符合本篇（職場）**。

## 9. The Dream Life of Mr. Kim

1. **片名**：**金部長的夢想人生**（Netflix Taiwan trailer；tw-availability-2）／서울 자가에 대기업 다니는 김 부장 이야기／*The Dream Life of Mr. Kim*
2. **劇情**：在首爾有房、在大企業做了 25 年的業務部長金洛洙，自以為人生勝利組，卻在職場與家庭接連失去一切，被迫重新認識自己。Wikipedia 角色介紹：「A veteran sales manager who built his life on success now faces the slow collapse of everything he has earned」。來源：https://en.wikipedia.org/wiki/The_Dream_Life_of_Mr._Kim （read）
3. **季數與狀態**：1 季 12 集，JTBC 2025-10-25 到 11-30（週六 22:40、週日 22:30）。全球在 Netflix 串流（導言，read）。片長 60–70 分鐘（英文 infobox）；韓文維基寫「방송 분량 = 1시간 30분」（read），**兩者不一致**。韓文維基「12부작」。**已完結的單季完整故事**，沒有讀到續季或特別篇。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications「Taiwan 15+」（read，沒有標平台）。美國 TV-MA、英國 15。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt38570528/parentalguide/ ）：Sex & Nudity **None**（2/2）、Violence & Gore **None**（1/1）、Profanity **None**（2/2，投稿列 bastard、sh*t、a**hole 等輕度髒話）、Alcohol, Drugs & Smoking **Mild**（1/1，有人喝醉）、Frightening & Intense **None**（1/1）。**每類只有 1–2 票，等於沒有資料。** 美國 TV-MA 和投稿內容落差大，原因未查。
5. **觀眾評分**：MDL **8.0**（**1,314 人**，https://mydramalist.com/780692-the-story-of-manager-kim-who-works-for-a-large-company-in-seoul ，read；本篇評分人數最少）；IMDb **7.7**（533 票，cache；票數最少）。RT：頁面存在但 **0 則影評、沒有任何分數**（read）。
6. **推薦 tag**：
   - A：Baeksang Drama nom 2026
   - B：Cine21-2025 #6；Time-K2025（Burt）honorable mention
   - F：PTT 2025 最愛串 約 20 人（多人說前 4 集難熬、後面倒吃甘蔗）；PTT 2025 印象串 2；PTT 2026 入坑串 2（三個都是 PTT）
7. **前置作品**：改編自宋熙久（Song Hee-gu）的同名小說《서울 자가에 대기업 다니는 김 부장 이야기》（infobox `based_on`、導言，read）。不必先看原作。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/82068378 （JustWatch ID；預告連到 82068379）— 證據 https://www.youtube.com/watch?v=BQ8fPjzmYWA （「金部長的夢想人生 | 正式預告 | Netflix」，Netflix Taiwan，「10 月 25 日, NETFLIX 獨家」），2025-10-14 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Workplace comedy / Slice-of-life（read）。**符合本篇（職場）**；主線同樣是中年危機與家庭。

## 10. Hot Stove League

1. **片名**：**金牌救援：Stove League**（friDay page; Netflix TW listing；tw-availability-2；行文可簡稱「金牌救援」）／스토브리그／*Hot Stove League*
2. **劇情**：連續四年墊底的職棒隊「夢想隊」換來一位完全沒有棒球經驗、但帶過多支冠軍隊的新團長白承秀，他在預算縮水和內鬥中從球團辦公室著手改造整支球隊。Wikipedia Synopsis：「the team hires Baek Seung-soo, who has managed several championship winning sports teams, as his replacement, despite Seung-soo having zero experience with managing a baseball team」。來源：https://en.wikipedia.org/wiki/Hot_Stove_League （read）
3. **季數與狀態**：1 季 16 集，SBS TV 2019-12-13 到 2020-02-14。片長 59–63 分鐘（infobox）。韓文維基條目「스토브리그 (드라마)」「16부작」（read）。**已完結的單季完整故事**，沒有讀到續季或特別篇。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications 沒有台灣列；friDay 頁分級沒有記錄。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt11378124/parentalguide/ ；IMDb 標題是「Stove League」）：Sex & Nudity **None**（2/2）、Violence & Gore **Mild**（2/2）、Profanity **Mild**（2/2，投稿：「what the fu..」被改口兩次，「Language clean otherwise」）、Alcohol, Drugs & Smoking **Mild**（2/2）、Frightening & Intense **Mild**（1/2）。**每類只有 1–2 票。**
5. **觀眾評分**：MDL **8.5**（16,148 人，https://mydramalist.com/39221-stove-league ，read）；IMDb **8.2**（2.6K，cache）。RT：`/tv/hot_stove_league` slug 回首頁，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - A：Baeksang Drama **win** 2020
   - D：KDF 2020 #5 19.1%
   - F：PTT 2021 入坑串 原 PO＋4；Dcard Z.Y 4 分；PTT 2026 入坑串 1
   - （已刪：`A SDA-K Excellence 2020`、`C Douban 9.3 (snippet)`。）
7. **前置作品**：原創劇（infobox 沒有 `based_on`）。不必先看。
8. **台灣串流**：**friDay影音** https://video.friday.tw/drama/detail/1112 （數位珍藏＝買斷）。Netflix https://www.netflix.com/tw/title/81343880 （只有 JustWatch；索引名「金牌救援：Stove League」）— 證據：friDay 頁「金牌救援：Stove League」有「購買數位珍藏版」、沒有下架公告，2026-11-08。Netflix：JustWatch TW 只列 Netflix，另有台灣部落格說 2022-12-31 上架 — **confirmed (service page): friDay purchase. Netflix is JustWatch only.**（tw-availability-2）
   - ⚠️ 確認的只有 friDay **購買**；訂閱制的 Netflix 只有 JustWatch 線索。
- **類型核對**：infobox genre＝Sports drama（read）；導言引用的 SBS 官方預告標題是「야구 드라마? 돌직구 오피스 드라마가 온다!」（read）。**類型有落差**：Wikipedia 歸運動劇，但劇情幾乎都在球團辦公室（交易、預算、人事）。可以放在職場，介紹時說是「棒球球團的辦公室劇」，不是比賽劇。

## 11. Prison Playbook

1. **片名**：**機智牢房生活**（HBO Max TW page；tw-availability-2）／슬기로운 감빵생활／*Prison Playbook*
2. **劇情**：即將加盟波士頓紅襪隊的明星投手金濟赫，為了保護妹妹失手重傷對方而入獄一年，在監獄裡從頭適應、重新練球，也和各式各樣的受刑人相處。Wikipedia Synopsis：「His life changes overnight when he assaults a man who tries to sexually assault his sister」。來源：https://en.wikipedia.org/wiki/Prison_Playbook （read）
3. **季數與狀態**：1 季 16 集，tvN 2017-11-22 到 2018-01-18（週三四 21:10）。片長 90 分鐘（infobox）。韓文維基「16부작」（read）。**已完結的單季完整故事**。導演申源浩（導言，read），同一團隊後來拍了《機智醫生生活》與本篇 #4 的衍生劇。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）
   - 台灣：HBO Max TW 頁標 **16+**（tw-availability-2，2026-11-08）；IMDb「Taiwan 16+ self-applied」（read），兩者一致。新加坡 HBO Max 列 M18。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt7622902/parentalguide/ ）：Sex & Nudity **None**（5/6）、Violence & Gore **Mild**（5/5，「Some normal fight scenes with punches… Nothing grotesque」）、Profanity **Mild**（5/5）、Alcohol, Drugs & Smoking **Moderate**（3/5）、Frightening & Intense **Mild**（4/5）。**票數只有 3–6。**
5. **觀眾評分**：MDL **8.9**（39,407 人，https://mydramalist.com/22624-wise-prison-life ，read）；IMDb **8.3**（6.5K，cache）。RT：`/tv/prison_playbook` slug 回首頁，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - C：MDL #19 8.9（39,408）
   - D：NielsenKR cable #39 11.195%
   - F：PTT 2026 入坑串 5；PTT 2021 入坑串 3
   - （已刪：`C Douban 9.4 (snippet)`。）
7. **前置作品**：原創劇（infobox 沒有 `based_on`）。不必先看。
8. **台灣串流**：**HBO Max** https://www.hbomax.com/tw/zh/show/46d40a09-4e36-4b58-9bf2-09724440d82e （訂閱）。Netflix https://www.netflix.com/tw/title/80214406 （只有 JustWatch）— 證據：HBO Max TW 頁「觀看 機智牢房生活 | HBO Max」（16+）2026-11-08 在架。Netflix：JustWatch TW 有列，但 2023 年 storm.mg 報導它 1 月下架 Netflix TW，Netflix 狀態不明 — **confirmed (service page): HBO Max**（tw-availability-2）
   - 注意：HBO Max 是 2026-11-08 的新證據；**舊的、可能失效的是 Netflix**（2023 年已報導下架），文章只寫 HBO Max。
- **類型核對**：infobox genre＝Black comedy（read）；IMDb 類型標籤 Prison Drama / Comedy Drama（cache）。**類型不符**：這是監獄喜劇，不是醫療、法律或職場劇。若保留，要說成「同一團隊的群像喜劇」，或移到其他篇。

## 12. The Art of Negotiation

1. **片名**：**協商的技術**（Hami Video page；tw-availability-2）／협상의 기술／*The Art of Negotiation*
2. **劇情**：大企業集團的傳奇併購談判專家尹柱午，帶著他的 M&A 團隊在一樁樁企業收購案裡周旋。Wikipedia Synopsis：「the exploits of a major corporation's M&A expert, known as a legendary negotiator, and his team」。來源：https://en.wikipedia.org/wiki/The_Art_of_Negotiation （read）
3. **季數與狀態**：1 季 12 集，JTBC 2025-03-08 到 04-13（週六日 22:30）。片長 70 分鐘（infobox）。部分地區在 Viu 串流（導言，read）。**已完結的單季完整故事**，沒有讀到續季或特別篇。韓文維基 `협상의_기술_(드라마)` 沒有條目（read 404）。
4. **分級**：
   - 韓國：**15**（IMDb Certifications South Korea 15，read）。韓文維基沒有找到條目。
   - 台灣：IMDb 沒有台灣列；Hami Video 頁分級沒有記錄。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt35746806/parentalguide/ ）：**五個類別全部「No data」，沒有投票**；頁面寫「not yet rated」。
5. **觀眾評分**：MDL **8.0**（4,772 人，https://mydramalist.com/766509-the-art-of-negotiation ，read）；IMDb **7.8**（891 票，cache；票數少）。RT：`/tv/the_art_of_negotiation` slug 回首頁，**沒有找到 RT 頁面**。
6. **推薦 tag**：
   - B：Cine21-2025 #5
   - F：PTT 2025 最愛串 1；PTT 2025 印象串 1
   - G：Hami Video 影劇館＋ 2025 年度戲劇收視 #4（標示 Hami 獨家韓劇）
7. **前置作品**：原創劇（infobox 沒有 `based_on`）。不必先看。
8. **台灣串流**：**Hami Video** https://hamivideo.hinet.net/product/286760.do （訂閱，「部分免費」；中華電信 MOD 也有）— 證據：Hami 頁可載入（全12集，3/8起每週六、日），2026-11-08 查核。MOD／Hami 影劇館⁺ YouTube 預告 https://www.youtube.com/watch?v=eh0Va1GMffA （「全台獨家！《協商的技術》正式預告」）是 2025-03-07，頻道名稱未抽取。不在 Netflix TW：JustWatch 沒有 TW 條目 — **confirmed (service page)**（tw-availability-2）
- **類型核對**：infobox genre＝Workplace（read）。**符合本篇（職場）**。

## 13. Undercover Miss Hong

1. **片名**：**臥底洪小姐**（Netflix Taiwan trailer；tw-availability-2）／언더커버 미쓰홍／*Undercover Miss Hong*
2. **劇情**：1997 年的首爾，35 歲的金融監督院菁英稽查員洪金寶，靠一張娃娃臉假扮成 20 歲新進員工，潛入資金流向可疑的證券公司臥底調查。Wikipedia 導言：「an elite securities inspector Hong Keum-bo, who goes undercover as a 20-year-old junior employee at a suspicious investment firm」。來源：https://en.wikipedia.org/wiki/Undercover_Miss_Hong （read）
3. **季數與狀態**：1 季 16 集，tvN 2026-01-17 到 03-08（週六日 21:10）。片長 74–78 分鐘（infobox）。韓國在 TVING、其他地區在 Netflix（導言，read）。韓文維基「16부작」（read）。**已完結的單季完整故事**，沒有讀到續季或特別篇。
4. **分級**：
   - 韓國：**15**（IMDb Certifications South Korea 15，read）。韓文維基沒有分級欄（read）。
   - 台灣：IMDb Certifications 沒有台灣列。美國 TV-14、英國 12。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt39219419/parentalguide/ ）：**五個類別全部「No data」，沒有投票。**
5. **觀眾評分**：MDL **8.3**（11,359 人，https://mydramalist.com/786716-miss-undercover-boss ，read；MDL 網址用的是暫名）；IMDb **7.5**（1.9K，cache）。RT：頁面存在但 **0 則影評、沒有任何分數**（read）。
6. **推薦 tag**：
   - D：NielsenKR cable #27 13.121%；WRC 2026 #3 13.1%
   - F：PTT 2026 入坑串 2
   - G：Netflix TW 2026-03-09～15 #6（累計 9 週）
7. **前置作品**：原創劇（infobox 沒有 `based_on`）。不必先看。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/82632108 （JustWatch ID；預告連到 82632109）— 證據 https://www.youtube.com/watch?v=vwFuKrOhl94 （「臥底洪小姐 | 正式預告 | Netflix」，Netflix Taiwan，「1 月 17 日, NETFLIX 獨家」），2026-01-08 — **confirmed (official channel)**（tw-availability-2）
- **類型核對**：infobox genre＝Workplace comedy；導言「workplace comedy television series」（read）。**符合「職場」字面**，但主調是年代臥底喜劇，介紹時要說是「職場喜劇」，不是寫實職人劇。

## 14. Itaewon Class

1. **片名**：**梨泰院 Class**（Netflix trailer；tw-availability-2）／이태원 클라쓰／*Itaewon Class*
2. **劇情**：父親死於長家集團少爺造成的車禍，朴世路尋仇入獄；出獄後他在梨泰院開了小酒館「甜夜」，一步步把它做大，目標是向長家集團復仇。Wikipedia Synopsis：「After his release from prison, Park Sae-ro-yi opens DanBam in Itaewon. He wants to be successful and seeks revenge towards Jangga Group」。來源：https://en.wikipedia.org/wiki/Itaewon_Class （read）
3. **季數與狀態**：1 季 16 集，JTBC 2020-01-31 到 03-21。片長 70 分鐘（infobox）。全球在 Netflix 串流（導言，read）。韓文維基條目「이태원 클라쓰 (드라마)」「16부작」（read）。**已完結的單季完整故事**，沒有讀到續季或特別篇。
4. **分級**：
   - 韓國：**15세 이상**（韓文維基 `시청 등급 = 15`，read；IMDb South Korea 15，read）
   - 台灣：IMDb Certifications「Taiwan 13+ self-applied」（read）。美國 TV-MA self-applied、英國 15。
   - IMDb Parents Guide（read，https://www.imdb.com/title/tt11239552/parentalguide/ ）：Sex & Nudity **None**（27/39）、Violence & Gore **Mild**（13/24）、Profanity **Moderate**（15/22，投稿：英文字幕的 F-word「dropped more frequently than an average KD」）、Alcohol, Drugs & Smoking **Moderate**（16/23，「a lot of drinking, partying, and clubbing scenes」）、Frightening & Intense **Mild**（17/21）。票數 21–39，本篇第二多。
5. **觀眾評分**：MDL **8.4**（104,421 人，https://mydramalist.com/33898-itaewon-class ，read）；IMDb **8.1**（26K，cache）。RT：頁面存在但 **0 則影評、沒有 Tomatometer**；Popcornmeter 83%（read，不建議引用）。
6. **推薦 tag**：
   - A：SDA Mini-series runner-up 2020（不是 SDA-K）
   - C：IMDb 8.1（26K）
   - D：NielsenKR cable #16 16.548%；KDF 2020 #6 16.5%
7. **前置作品**：改編自光進（Gwang Jin）的同名 Daum Webtoon（infobox `based_on`、導言，read）；IMDb 把 Gwang Jin 列為 Creator（cache）。不必先看原作。
8. **台灣串流**：**Netflix** https://www.netflix.com/tw/title/81193309 — 證據 https://www.youtube.com/watch?v=PxFI5-Idi5Q （「《梨泰院 Class》| 正式預告 | Netflix」，Netflix Malaysia/@netflixasia），2020-01-22；JustWatch TW：Netflix — **confirmed (official channel, Asia zh channel, 2020)**（tw-availability-2）
   - ⚠️ **舊證據**：最新官方證據是 2020 年；JustWatch TW（2026-11-08）仍列 Netflix，但 JustWatch 只算線索。
- **類型核對**：infobox genre＝Romantic drama / Comedy（read）；IMDb 簡介「An ex-con opens a street bar in Itaewon, while also seeking revenge」（cache）。**類型不符**：主線是復仇與創業，不是醫療、法律或職場職人劇。若保留，要說成「創業／復仇劇」，或移到其他篇。

---

## 總結

- **季數與續季**：
  - 多季：**浪漫醫生金師傅 3 季**（2016／2020／2023，共 52 集＋2 集特別篇；第 4 季沒有確認）。
  - **已續訂**：外傷重症中心第 2、3 季已在製作（Deadline 2026-10-19，read），沒有上線日期。
  - **宣布過但不明**：非常律師禹英禑第 2 季（2022 年宣布、目標 2024 年已過；2026-05 導演說「還不到能談的階段」）；車貞淑醫生第 2 季（2025-09 演員端確認、製作公司說沒有具體討論；MDL 標 2027）。
  - **沒有續季計畫**：機智住院醫生生活（導演 2025-05：沒有具體計畫）。
  - 其他 9 部都是已完結的單季完整故事。
- **集數**：16 集 7 部（禹英禑、車貞淑、代理公司、金牌救援、機智牢房、臥底洪小姐、梨泰院）；12 集 4 部（機智住院、精神病房、金部長、協商的技術）；8 集 2 部（外傷重症中心、狂醫魔徒）；浪漫醫生金師傅 20＋16＋16。
- **韓國分級**：13 部 15 歲以上；**狂醫魔徒 IMDb 列 19**（只有 IMDb 一個來源）。外傷重症中心、禹英禑、狂醫魔徒、協商的技術、臥底洪小姐的韓國分級只來自 IMDb。
- **台灣平台分級**：Disney+ 浪漫醫生金師傅 15+、狂醫魔徒 15+；HBO Max 機智牢房生活 16+。IMDb 另列台灣 15+（外傷重症中心、精神病房、金部長、狂醫魔徒）、16+ self-applied（金師傅、禹英禑、機智牢房）、13+ self-applied（梨泰院）。**金師傅 Disney+ 15+ 和 IMDb 16+ 不一致。**
- **IMDb Parents Guide**：4 部完全沒有投票（車貞淑、代理公司、協商的技術、臥底洪小姐）；金部長、金牌救援、金師傅、機智住院每類只有 1–11 票。要特別提醒的內容：**狂醫魔徒**（血腥暴力 Severe、裸露）、**精神病房也會迎來清晨**（自傷、自殺場面）、**外傷重症中心**（手術器官畫面，Violence Moderate）、**機智住院醫生生活**（投稿寫有開刀、分娩畫面，但票選 None）、**非常律師禹英禑**（性侵案件討論、自殺企圖）、**梨泰院 Class**（英文字幕髒話、大量飲酒夜店）。
- **評分**：MDL 7.9–9.1，最高外傷重症中心 9.1，最低狂醫魔徒 7.9；評分人數最多禹英禑 117,052、最少金部長 1,314。IMDb 7.3–8.5。RT Tomatometer 只有 3 部：禹英禑 100%（11）、精神病房 100%（6）、車貞淑 88%（8）。
- **類型核對**：
  - 醫療（6）：外傷重症中心、浪漫醫生金師傅、機智住院醫生生活、精神病房也會迎來清晨、車貞淑醫生（醫療＋家庭）、狂醫魔徒（醫療驚悚）。
  - 法律（1）：非常律師禹英禑。
  - 職場（4）：代理公司、金部長的夢想人生、協商的技術、臥底洪小姐（年代臥底喜劇，說法要調整）。
  - **需要人工判斷 3 部**：**機智牢房生活**（監獄喜劇）、**梨泰院 Class**（復仇／創業）、**金牌救援**（Wikipedia 歸運動劇；內容是球團辦公室，可保留但要說明）。
- **台灣串流風險**：
  - 授權劇、最新證據在 2023 年或更早：**非常律師禹英禑（2022）、車貞淑醫生（2023-04）、代理公司（2023-06，LINE TV 已因授權到期下架）、梨泰院 Class（2020）**。需台灣裝置確認。
  - 機智牢房生活：HBO Max 是 2026-11-08 服務頁證據；Netflix 2023 年已報導下架，不要寫 Netflix。
  - 金牌救援：只有 friDay **購買**確認；Netflix 只有 JustWatch。
  - 協商的技術只在 Hami Video（不在 Netflix）。
  - 浪漫醫生金師傅、狂醫魔徒在 Disney+。

## 無法查證的事實

1. **狂醫魔徒韓國 19 歲分級**：只有 IMDb Certifications（使用者可編輯）；韓文維基沒有分級欄，沒有找到韓國官方或新聞來源。
2. 外傷重症中心、非常律師禹英禑、協商的技術、臥底洪小姐的韓國分級只來自 IMDb Certifications。
3. **外傷重症中心第 2 季上線時間**：Deadline 只寫「in production」，沒有日期。
4. **非常律師禹英禑第 2 季**：Bloter 2026-01-29「대본 집필」與 indulgexpress 2026-08-19「Season 2 … moves forward」都是轉述業界人士（cache）；나무위키寫首篇報導措辭被修改、編劇與製作公司有訴訟（cache，wiki 整理，未回原報導核對）。沒有電視台或卡司公告。
5. **車貞淑醫生第 2 季 2027**：只有 MDL 使用者條目；製作公司 SLL 2025-09-01 說沒有具體討論。
6. 浪漫醫生金師傅第 4 季「沒有消息」：根據是 나무위키（cache）與 2026-09 的期待文；沒有讀到 SBS 正式否認或確認。SBS 2026-06-01 片單發表的 Exa 摘要沒有提到它，但那是 partial 摘要。
7. 精神病房也會迎來清晨 IMDb 單集平均 5.5（5.7K 單集評分）和總分 8.1 不一致，原因不明。
8. 金部長的夢想人生：片長英文維基 60–70 分鐘 vs 韓文維基「1시간 30분」不一致；IMDb 美國 TV-MA 與投稿內容（幾乎無敏感內容）落差，原因未查。
9. 車貞淑醫生、精神病房也會迎來清晨的 Wikipedia genre 只讀到第一項（後面被 ref 截斷）。
10. 機智住院醫生生活第 12 集出現《機智醫生生活》角色：來自 nbntv 報導的 Exa 摘要（cache），沒有看劇確認。
11. 所有 Netflix TW 上架狀態：沒有台灣 IP，netflix.com/tw 頁不是證據（沿用 tw-availability 規則）。

## toolDegradation

- **Groundlane `web_extract`**：英文／韓文 Wikipedia raw、Wikidata SPARQL、MyDramaList（含站內搜尋）、Rotten Tomatoes 都正常。plainlist／`{{PL|` 多行 genre 第一次抓到 `{{plainlist|`，改 pattern 後成功；Doctor Cha、Daily Dose 的 genre 項目後面接 `<ref>`，只讀到第一項。韓文維基有 5 個條目名稱猜錯（重定向或 404：`중증외상센터` 重定向到醫療條目、`대행사_(드라마)`、`서울_자가에…_(드라마)`、`협상의_기술_(드라마)`、`이상한_변호사_우영우_시즌_2`），前 3 個改用其他名稱找到。
- **Groundlane `web_fetch`**：Deadline、엑스포츠뉴스 正常（read）。
- **Groundlane `web_search`**：一次 Bad Gateway；另一次 Tavily、Exa 後端 unavailable，結果來自 Brave／You.com（只用來找車貞淑醫生第 2 季新聞，再用 `web_fetch` 讀原文）。
- **IMDb 標題頁**：沿用韓劇 1 的做法，直接用 Exa `web_fetch_exa`（cache，14/14 成功），沒有先試 Groundlane（韓劇 1 已確認會拿到 2KB 機器人頁）。
- **IMDb Parents Guide**：jina `read_url`（無 key）14/14 成功，本輪每頁都有類別標題。jina 沒有 API key，每次回全文。
- **續季新聞**：Exa `web_search_exa` 回傳的 highlights 是 cache；禹英禑、機智住院、金師傅的續季狀態只讀到 Exa 摘要，沒有再用 Groundlane 逐篇讀原文。
- **Rotten Tomatoes**：5 個 slug 猜測回首頁（dr_romantic、hot_stove_league、prison_playbook、the_art_of_negotiation、agency）。只代表該網址不存在，不完全排除 RT 用別的 slug 收錄。
- **沒有使用**：Tavily MCP（限流）、Firecrawl（額度用完）、終端機 curl（環境封鎖）。
