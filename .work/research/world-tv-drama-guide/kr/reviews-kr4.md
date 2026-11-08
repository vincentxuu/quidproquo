# KR4 評價資料表：韓劇｜職人：醫療、法律與職場 14 部（Metacritic／豆瓣／英文評論／台灣中文評論／分歧）

研究日期：2026-11-08。片單來自 `post-kr4-shows.txt`。IMDb／MDL／韓國收視數字沿用 `candidates-ratings-viewing-buzz.md`、獎項與年度榜單沿用 `candidates-awards-critics.md`、台灣 PTT／平台熱度沿用 `candidates-fans-taiwan.md`（三檔已標 read），這裡不重抓，只在「分歧」欄引用並標註「（ratings 檔）」「（awards 檔）」「（fans 檔）」。

## 來源與方法

| 欄位 | 來源 | 工具 | 狀態 |
|---|---|---|---|
| Metacritic S1 | Metacritic 站內搜尋 `metacritic.com/search/<詞>/?category=1` 逐部查（extraordinary attorney woo、trauma code、itaewon class、dr. romantic、resident playbook、daily dose of sunshine、doctor cha、hyper knife、agency、dream life of mr. kim、hot stove league、prison playbook、art of negotiation、undercover miss hong） | Groundlane `web_extract`（render=never，抓 `/tv/` 連結） | 14/14 read：**14 部都沒有 Metacritic 頁面** |
| 豆瓣 | 只採用新聞或媒體文章引述的分數；豆瓣 subject 頁沒有另外再試（KR1 已確認 Exa 回 CRAWL_HTTP_403／timeout），沒有繞過 sec.douban.com | Exa search、Groundlane fetch | 4 部有媒體引述（禹英禑、外傷重症中心、機智住院醫生生活、金部長）；梨泰院只有「網路評分」報導；其餘沒有可用來源 |
| 英文評論 | 署名評論，讀全文或大半 | Exa `web_fetch_exa`、Groundlane `web_fetch` | 12 read（其中 4 篇只評首集或前幾集）、1 read 但屬議題分析（TIME 住院醫生）、1 partial（Polygon 後段截斷）；4 篇出自清單外媒體 |
| 台灣中文評論 | 電影神搜、聯合報〈娛樂有評〉、鏡週刊、關鍵評論網、釀電影、500輯等 | Groundlane `web_fetch`；關鍵評論網與 Tatler 用 Exa `web_fetch_exa`（Tatler 在 Groundlane 遇 browser challenge） | 13 read、1 沒有找到（臥底洪小姐） |

標記說明：**read** = 工具讀到頁面內文；**read (Exa)** = Exa 抓到的全文副本；**partial** = 只讀到前段或一半，或只看到 Exa 搜尋結果裡的長摘要；**snippet** = 只看到搜尋摘要，不算讀過、不當評論用。

> 英文評論的媒體使用次數（上限 3）：Decider 2（外傷重症中心、臥底洪小姐）、NME 2（浪漫醫生金師傅 S3、精神病房也會迎來清晨）；Polygon、Vulture、The Hindu、Korea Herald、Korea Times、TIME 各 1。**清單外**：HanCinema（機智牢房生活）、MediaCat UK（代理公司）、The Review Geek（金牌救援）、The Blossom Review（協商的技術）各 1。這四部在清單內媒體都找不到署名單篇評論（見各部說明與「缺口」）。
>
> SCMP 的 Pierce Conran 這組劇幾乎每部都有評論（禹英禑以外的醫療劇、車貞淑、狂醫魔徒、協商的技術、梨泰院 Edmund Lee），但 SCMP 有付費牆，這次只看到標題、副標，所以只在「分歧」欄當 snippet。
>
> 台灣中文評論：電影神搜（news.agentm.tw）5 部，作者多為筆名（推坑人妻、Winnie、薇琪吳不負責任的報告書），但〈代理公司〉完結劇評署名專業編劇潘光中；聯合報〈娛樂有評〉2 部（潘光中、雀雀）；鏡週刊〈追劇指南〉2 部（廖佩玲）；關鍵評論網、釀電影、500輯（聯合新聞網）各 1；Tatler Asia 1（lifestyle，不在清單）。14 篇都沒有「合作／贊助」標記。電影神搜舊文多半原發在姊妹站歐搜哇，這裡寫的是頁面 `publishedAt`。

---

## 1. The Trauma Code: Heroes on Call 外傷重症中心（Netflix，2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「trauma code」只有 Code Black 等，read）。
2. **豆瓣**：**8.3**（人數不明），Beauty321〈2025最高分韓劇排行榜TOP10〉，Kristen，2026-01-06。https://www.beauty321.com/post/70875 （read；年底快照）。騰訊新聞創作者文章 2025-02-12 寫「豆瓣開分8.1」（https://news.qq.com/rain/a/20250212A08CCX00 ，自媒體，partial，不採用）。
3. **英文評論**：Decider，Joel Keller，2025-01-28，〈Stream It Or Skip It: 'The Trauma Code: Heroes On Call' On Netflix, About A Trauma Surgeon Shaking Up An ER In Seoul〉。https://decider.com/2025/01/28/the-trauma-code-heroes-on-call-netflix-review/ （read (Exa)；只評第 1 集）
   - 摘要：他說這部把主角寫成「像穿披風的超級英雄」，與其說醫療劇，不如說是醫療版印第安納瓊斯；主角對同事毫無尊重、亂取綽號，第一集看不到人性的一面。結論 SKIP IT。
   - 原文：「The Pitt but a whole lot less realistic」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），潘光中（專業編劇），2025-02-15，〈潘光中／別只看帥到掉渣的朱智勳！《外傷重症中心》體現「醫療商品化」帶來的崩潰與解離〉。https://stars.udn.com/star/story/10093/8548803 （read）
   - 摘要：他說醫療劇是「業界公認最難拍好的地獄級別」，這部在分際上拿捏得很好：節奏快、主打一個「爽」字，雖然不少情節煽情浮誇，但仍符合醫療專業。他特別點出財務長報告「營收前三名是殯儀館、停車場、美食街」那場戲，認為浮誇背後是韓國醫療體系瀕臨崩潰的現實，並連到醫師罷工潮。
5. **分歧**：**英文首集評論冷、觀眾與串流熱、真實醫師說太誇張**。Decider 首集 SKIP，但 Netflix 2025 上半年 34M views、MDL 9.1（64,555 人）、IMDb 8.4（ratings 檔）、豆瓣 8.3。寫實度爭議：Korea Biomedical Review 專訪外傷外科醫師 Noh（Kim Ji-hye，2025-02-24）說「No one is a one-man trauma unit」，但醫院拒收外傷病患「是真的」（https://www.koreabiomed.com/news/articleView.html?idxno=26722 ，partial：Exa 摘要）；Korea Herald 訪問外傷護理師（Choi Jae-hee，2025-03-05）指出直升機上實際上一定有護理師，劇裡省略了（https://www.koreaherald.com/article/10433769 ，partial）；韓國網站轉載《헬스조선》2025-02-07 訪問：檀國大醫院外傷科장성욱教授說「醫學上不對的地方太多，看第 1 集就關掉了」（https://www.yugacrew.com/crewtalk/11946 ，轉載，partial；原文 health.chosun.com 未讀）。原作者李洛俊醫師則說主角「had to be larger than life」（Korea Biomedical Review 2025-02-21，partial）。

## 2. Dr. Romantic 浪漫醫生金師傅（SBS，2016–2023，三季）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「dr. romantic」只有 Dr. Brain 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：NME，Hidzir Junaini，2023-05-09，〈'Dr. Romantic' season 3 review: medical melodrama at its finest〉。https://www.nme.com/reviews/tv-reviews/dr-romantic-season-3-review-medical-melodrama-finest-3441100 （read，Groundlane；**評的是第三季前 4 集**，Exa 回 CRAWL_HTTP_403）。**注意**：第一季（2016）沒找到清單內媒體的署名英文評論；Korea Times 2017-01-04〈'Romantic Doctor' puts injustice under knife〉是報導型文章（snippet，未確認署名）。
   - 摘要：他說這是醫療劇裡少見「真正特別」的一部，前兩季已經奠定類型第一的地位；第三季開場的東海漁船槍戰與脫北者急救，是全系列政治與倫理最複雜的案子，編導「沒有退步，還加碼」。也稱讚第三季把主角們的戀情寫成穩定關係，擺脫了「會不會在一起」的老套。
   - 原文：「season three is shaping up to be Dr. Romantic's best yet」
4. **中文評論（台灣）**：鏡週刊〈追劇指南〉，廖佩玲，頁面 publishedAt 2017-01-29（URL 日期 20161207，第一季播出中），〈【追劇指南】《浪漫醫生金師傅》 不靠顏值的神劇〉。https://www.mirrormedia.mg/story/20161207inf002 （read）
   - 摘要：她坦白說「嚴格來說是一部很老套的傳統醫療劇」，編導演對台灣觀眾都不算有吸引力，但韓石圭的氣場「立刻讓這齣戲無條件升格至神劇之列」；比起神展開的愛情線，人與人之間的感情線和勵志、生命尊嚴的主軸更吸引人。
5. **分歧**：大致一致，口碑與收視都高。第二季全國收視 27.1%、第三季 14.4%（KDF，ratings 檔），MDL S3 8.9、S2 8.7（ratings 檔）。中英文評論都承認是「傳統／老套」醫療劇，但靠演員與台詞撐起。Korea Times 2017-01-04 報導提到韓國評論者把它和崔順實事件後的社會不公氛圍連在一起（snippet）。

## 3. Extraordinary Attorney Woo 非常律師禹英禑（ENA，2022）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「extraordinary attorney woo」只有 She-Hulk: Attorney at Law 等，read）。
2. **豆瓣**：**9.3**（短評 5000 多條，人數不明），亞洲日報中文版，王海納，2022-07-25，〈拿下14国奈飞"收视王"豆瓣评分9.3 韩国再出神剧《非常律师禹英禑》〉。https://www.ajudaily.com/view/20220725075638686 （partial：Exa 搜尋結果裡的長摘要，含報導全文段落）。自由時報 2022-07-25 同樣寫 9.3、短評近 6000 條（https://ent.ltn.com.tw/news/breakingnews/4003799 ，partial）。注意：這是播出中的數字；網易娛樂 2022-09-06 寫 9.0（partial），豆瓣用戶長評說結局後「9.1，最高時 9.3」（用戶文，不採用）。
3. **英文評論**：Polygon，Geoffrey Bunting，2022-08-17，〈Extraordinary Attorney Woo is autistic representation at its best and its worst〉。https://www.polygon.com/23308322/extraordinary-attorney-woo-netflix-autistic-representation-episode/ （partial (Exa)：讀到約三分之二，「The best of intentions」一節中段之後截斷；作者本人是自閉症者，屬評論兼議題分析）
   - 摘要：他訪問了自閉症觀眾、自閉症律師 Haley Moss 等，結論是「yes… and no」：劇對職場歧視的描寫很好，很多自閉症觀眾覺得被看見；但韓文原名是「奇怪的律師禹英禑」，主角被寫成極罕見的天才型學者症候群，又由非自閉症演員演出，等於把障礙者包裝成好入口、卻有誤導性的形象。
   - 原文：「text that highlights Myung-seok's, and Korea's, ableism while the subtext reinforces the idea that disabled people's value is derived from what they can contribute」
4. **中文評論（台灣）**：關鍵評論網（轉載自《思想坦克》），楊添圍（精神科專科醫師），2022-08-06，〈【韓劇】《非常律師禹英禑》：其實相當主流也相當正常，美化不只忽視真正的問題，更會扭曲現實〉。https://www.thenewslens.com/article/171148 （read (Exa)）
   - 摘要：他說禹英禑「智商164、首爾大學法律系第一名」，自閉症其實「完美掩護了女主角是人生勝利組的經歷」，這是一部彰顯主流價值的時尚偶像劇；把精神障礙理想化，會抹殺照顧者的辛苦、扭曲現實。他擔心韓劇用「小小的政治正確」包裝主流價值，讓人誤以為這就是去汙名化，並推薦《我們與惡的距離》。（同站另有貓心〈社會不可能「撕掉所有標籤」〉2022-09-24，partial：TNL+ 會員內容只讀到前幾段）
5. **分歧**：**全表最明確的再現爭議**。收視從 0.9% 漲到有線 17.534%、Netflix 非英語史上前十（曾上榜）、IMDb 8.5、Good Data 話題榜連 5 週第 1（ratings 檔），豆瓣 9.3；但自閉症社群與專業者意見分裂。NYT 2022-09-04〈In South Korea, a Hit Show Brings Autism Into the Spotlight〉寫自閉症學者 Yoon Wn-ho 看第一集就關掉，覺得角色像「一堆自閉症特質的集合」，但也肯定劇促進討論（https://www.nytimes.com/2022/09/04/world/asia/south-korea-autism-extraordinary-attorney-woo.html ，partial：Exa 摘要）；Korea JoongAng Daily 2022-07-19 報導家長擔心劇呈現的是極少見的高功能／學者症候群（partial）。Decider 首集評論（Radhika Menon，2022-06-29）則說「a kind rendering of autism」（partial）。

## 4. Resident Playbook 機智住院醫生生活（tvN，2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「resident playbook」只有 The Resident 等，read）。
2. **豆瓣**：**8.3**（人數不明），Beauty321，2026-01-06（同第 1 部，read；年底快照）。
3. **英文評論**：TIME，Kayti Burt，2025-04-16，〈How K-Drama Resident Playbook Reflects the Stark Reality of a Medical System in Crisis〉（頁面標題 Breaking Down 'Resident Playbook'）。https://time.com/7278386/resident-playbook-netflix-medical-k-drama/ （read，Groundlane extract=full；**這是首 2 集上線時的背景解析，不是正式劇評**）。NME、Decider、The Hindu、韓國三大英文報都只找到新聞或預告（Groundlane 站內限定搜尋，read 搜尋結果）。
   - 摘要：她說這部原本「看起來穩賺」：《機智醫生生活》衍生、高允貞主演，卻撞上 2024 年醫學院擴招引發的住院醫師集體辭職，播出延後一年。第 2 集四個主角都想辭職，劇中工時與現實相符（住院醫師法定可到每週 88 小時）；劇雖在罷工前拍攝，但呈現了導致罷工的結構問題。
   - 原文：「its story is broadly informed by the systemic conditions that have led to the stalemate between the medical community and the government」
4. **中文評論（台灣）**：電影神搜，Winnie，2025-04-15，〈【首播劇評】《機智住院醫生生活》：維持「機醫」溫暖日常風格，首播收視卻不如預期？〉。https://news.agentm.tw/355327/ （read；只評前 2 集）
   - 摘要：主角從老鳥變菜鳥，人物設定鮮明，醫患衝突後和解的段落觸動人心，客串也有亮點；但「目前兩集看下來劇情架構還是稍顯鬆散」，第 2 集收視只有 3.986%，不如預期。
5. **分歧**：**開播口碑冷、後段回溫；醫師罷工背景引發反彈**。首播 3.68%（TIME），但 FUNdex 2025 主演男女與配角 3 獎、年度完結劇話題前十、MDL 8.7（ratings 檔），豆瓣 8.3。The Blossom Review（Karen Mansoldo，2025-05-21）說第一集「an absolute trainwreck」但之後成長（snippet，非大媒體）。Korea Herald 2025-03-28〈'Resident Playbook,' set to air in April, faces backlash〉與 Korea Times 2025-04-26〈'Resident Playbook' surpasses 5 percent, but reality is different?〉都談到罷工後觀眾對醫師角色的反感與劇情和現實落差（snippet，未讀）。

## 5. Daily Dose of Sunshine 精神病房也會迎來清晨（Netflix，2023）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「daily dose of sunshine」只有 Alaska Daily、Mr. Sunshine 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：NME，Carmen Chin，2023-11-08，〈'Daily Dose of Sunshine' review: an earnest, destigmatising portrayal of mental health〉。https://www.nme.com/reviews/tv-reviews/daily-dose-of-sunshine-review-3533868 （read，Groundlane）
   - 摘要：她說韓國媒體向來用刻板印象呈現精神疾病，這部「以前所未見的謹慎」處理，把思覺失調、憂鬱、恐慌、強迫症患者寫成立體的人，不是暴力反派；朴寶英的表演可能是她最好的一次；病房被拍成療癒的地方而不是絕望之地。
   - 原文：「It is incredibly refreshing to finally have a Korean drama that doesn't relegate them to violent and antagonistic stereotypes」
4. **中文評論（台灣）**：釀電影，九號球，2023-12-05，〈《精神病房也會迎來清晨》：好像只有善良的人才會來到這裡〉。https://filmaholic.tw/series/656f4bb8fd89780001e3842e/ （read）
   - 摘要：他說人感冒會看醫生，心理受傷卻常忽視；這部用動畫把症狀發作的感受具像化，大致一集一個故事（情緒勒索、職場 PUA、職業母親、長年國考）。他最有感的是第 6 集國考生陷入妄想的段落，並把劇和《我們與惡的距離》對照。
5. **分歧**：評論一致正面，爭議小。Decider 首集評論（Joel Keller，2023-11-03，read (Exa 摘要含全文大半)）給 STREAM IT，但提醒第一位躁鬱症病人的成因說法「a potentially reductive way to talk about bipolar disorder」。SCMP Pierce Conran 2023-11-07 副標稱它「empathetic exploration」（snippet）。MDL 8.8（ratings 檔）。沒有韓國收視（Netflix 原創）。

## 6. Doctor Cha 車貞淑醫生（JTBC，2023）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「doctor cha」只有 Doctor Who 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：The Hindu，S. Poorvaja，2023-06-07，〈'Doctor Cha' K-Drama review: Uhm Jung-hwa aces this journey towards empowerment and independence〉。https://www.thehindu.com/entertainment/movies/doctor-cha-k-drama-review-uhm-jung-hwa-aces-this-journey-towards-empowerment-and-independence/article66942259.ece （read (Exa)；評全劇）
   - 摘要：她說前半很精彩，嚴正化把家庭主婦重回住院醫師的路演得可親又真實；但第 9 集後急轉成冗長的八點檔，過度醜化小三、花太多時間洗白丈夫，Roy Kim 被塞進不具說服力的三角戀。結局找回部分光彩，收得低調但令人滿足。
   - 原文：「Choppy writing aside, Jeong-suk's journey towards putting herself first is refreshing」
4. **中文評論（台灣）**：聯合報〈娛樂有評〉（噓！星聞），雀雀，2023-06-10，〈雀雀／檢察官的「壞媽媽」與好媽媽「車貞淑醫生」〉。https://stars.udn.com/star/story/10093/7224576 （read；**與《壞媽媽》合評**，車貞淑約占三分之一）
   - 摘要：她說這部大膽玩荒誕喜劇，把醫生一家、小三、老王全放進同一間醫院，「又扯又爆笑」，卻能在最八點檔的設定裡讓觀眾看得解氣；最過足戲癮的是金炳哲演的外遇丈夫，從奸角演到小丑再到洗白，「是韓劇繼《黑暗榮耀》朴涎鎮之後最有戲的反派」。（另有電影神搜〈【完結劇評】《車貞淑醫生》收視新高完美收官！〉https://news.agentm.tw/289196/ ，snippet，未讀）
5. **分歧**：**收視與串流極高，評論普遍說後半走弱**。有線 18.546%、Netflix 2023 上半年 197.7M 小時（ratings 檔）；但 The Hindu 說後半「choppy」、SCMP Pierce Conran 完結評論標題寫「ends on drawn-out note full of drab filler material」（2023-06-05，snippet）。Jae-Ha Kim（substack，2023-06-04，snippet）批評編劇一直想把背叛多年的丈夫塑造成可被原諒的選項。中文評論反而把渣夫的戲份看成亮點。

## 7. Hyper Knife 狂醫魔徒（Disney+，2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「hyper knife」只有 Bad Surgeon: Love Under the Knife 等，read）。
2. **豆瓣**：沒有找到新聞引述。豆瓣用戶長評（分派電影公眾號轉載）寫「豆瓣8.0分」（https://movie.douban.com/review/16592884/ ，2025-03-28，播出中，用戶文，不採用）。
3. **英文評論**：Korea Herald，Lee Yoon-seo，2025-03-20，〈Review: 'Woo Young-woo' star Park Eun-bin delivers in 'Hyper Knife' as psychopath doctor〉。https://www.koreaherald.com/article/10446226 （read (Exa)；**只評前 2 集**）
   - 摘要：她說這部靠角色而不是情節推動，朴恩斌演出「career-defining」，嬌小外表反襯角色的精神病態；朴恩斌與薛景求的師徒張力迷人。缺點是可信度：女主角白天當藥師、晚上做非法手術殺人卻都沒事，助手的無條件忠誠也說不過去。
   - 原文：「Where "Hyper Knife" falters is in its credibility」
4. **中文評論（台灣）**：電影神搜，推坑人妻，2025-04-11，〈【劇評】《狂醫魔徒》結局：毫無冷場！薛景求、朴恩斌師徒間的相愛相殺，顛覆醫療倫理的人性對決〉。https://news.agentm.tw/353676/ （read；評全劇）
   - 摘要：她說全劇反轉不斷、從開場到結局沒有冷場；朴恩斌跳脫禹英禑框架，薛景求內斂壓抑；結局把師徒鬥爭翻轉成恩師的一片苦心，並延伸到「尊師重道」老觀念與世代權威崩解的討論。屬粉絲型劇評，幾乎沒有批評。
5. **分歧**：**表演一面倒稱讚，劇情與結局意見分裂**。Korea Herald 說可信度不足；NME（Carmen Chin，2025-03-19，snippet）稱讚類型混搭；Leisurebyte（2025-04-09，snippet，非大媒體）說結局「melodramatic」令人失望；豆瓣用戶長評說「缺乏主線」（snippet）。另一方面入圍 2026 國際艾美獎電視電影／迷你劇（典禮 2026-11-23，結果未知）、Cine21 2025 年度第 10（awards 檔）；台灣 PTT 2025 最愛串約 15 人推（fans 檔）。

## 8. Agency 代理公司（JTBC，2023）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「agency」只有 The Agency 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：MediaCat UK，Seoyoung (Sage) Lee、Antoinette Hoes，2023-09-04，〈Agency, to have and have not〉。https://mediacat.uk/agency-to-have-and-have-not/ （read (Exa)；評全劇）。**注意**：MediaCat 是英國廣告業媒體，不在原清單；兩位作者自承在首爾財閥旗下廣告公司工作（文中有揭露）。清單內媒體（Korea Herald、Korea Times、JoongAng Daily、NME）只找到選角、記者會、專訪新聞（Groundlane 站內搜尋，read 搜尋結果）。
   - 摘要：從業者角度看，她們說劇中女性互助、聚焦中階管理層、女主角沒有感情線都是韓劇少見的；很多職場性別歧視情節「sadly ring true」。但劇美化酗酒與工作狂，把女主角的心理疾病歸因於貧窮童年；整體是「over-the-top, glamorised and soapy」的廣告公司，重點是公司政治而不是廣告本身。
   - 原文：「Agency is an-over-the-top, glamorised and soapy version of an Ad agency, one we'd never encounter in real life」
4. **中文評論（台灣）**：電影神搜（原刊歐搜哇），潘光中，2023-03-02，〈【完結劇評】《代理公司》大結局收視率衝破16%！李寶英孫娜恩化敵為友，爽度極高的復仇劇〉。https://news.agentm.tw/289921/ （read）
   - 摘要：他說貼上「一代神劇」或許誇張，但無論當作廣告業職場正劇或大女主復仇爽劇，都「堪稱是一部足以呈現韓國影視工業高端水平的優秀作品」；稱讚最後兩集首尾呼應的剪接，也提醒全員歡樂收場只是戲劇，現實裡不公義仍在。
5. **分歧**：**收視高，但韓國女性主義觀點評論給低分**。全國收視從 4.79% 漲到 16.044%（電影神搜同文；有線 16.044%，ratings 檔），FUNdex 2023 年度劇入圍（ratings 檔）。韓國《女性新聞》作家유해 2023-02-26 評為「B級도 못 되는 C급」，批評沒做業界取材、廣告公司的工作方式全被省略、只剩幼稚的權力鬥爭（https://www.womennews.co.kr/news/curationView.html?idxno=233270 ，partial：Exa 摘要）。英文從業者評論也說「不像真實的廣告公司」。

## 9. The Dream Life of Mr. Kim 金部長的夢想人生（JTBC，2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「dream life of mr. kim」只有 Mr. Robot 等，read）。
2. **豆瓣**：**8.3**（人數不明），Beauty321，2026-01-06（同第 1 部，read；完結後快照）。
3. **英文評論**：Korea Times，Baek Byung-yeul，2025-12-02，〈[REVIEW] 'The Dream Life of Mr. Kim' unpacks midlife crisis〉。https://www.koreatimes.co.kr/entertainment/shows-dramas/20251202/the-dream-life-of-mr-kim-unpacks-midlife-crisis （read (Exa)；完結後評全劇）
   - 摘要：他說這部給韓國中年人「深刻的安慰與自省」，靠柳承龍撐起：在喜劇與深沉悲傷之間切換自如。缺點是「成功者失去一切才找到人生意義」的套路可預期；主角被下放到安全管理職也引發爭議，有觀眾認為只是為了讓墜落更戲劇化。
   - 原文：「the emotional strength of the drama clearly came from Ryu's performance」
4. **中文評論（台灣）**：Tatler Asia（繁中），Irene Chen，2025-10-30，〈《金部長的夢想人生》柳承龍是大公司部長，但卻不是這麼「成功」？6大看點〉。https://www.tatlerasia.com/lifestyle/entertainment/the-dream-life-of-mr-kim-review-zh-hant （read (Exa)；**lifestyle 媒體、不在清單**；開播約一週時寫，評前段）。指定清單內的台灣媒體沒有找到署名劇評（Groundlane 站內搜尋 thenewslens、filmaholic、opinion.udn、agentm、mirrormedia、stars.udn、ELLE／Vogue／GQ，只找到同名異劇《金特務》）。
   - 摘要：她說這部不把中年危機浪漫化，而是像「職場紀錄片」：上司以組織調整暗示讓位、買公事包要比上司便宜一點、比部屬貴一點；父子代溝是價值觀錯位而非對錯之爭；柳承龍「不討喜」反而讓角色有說服力。問它是不是《未生》的中年版。
5. **分歧**：**開播收視低、口碑後發；安全管理職描寫被批「職務歧視」**。首播 2.9%、完結 7.6%（Korea Times 同文），Netflix 韓國週榜第 1、Good Data 話題第 2（MK 多人評論 2025-11-19，snippet）；Baeksang 2026 戲劇作品入圍、TIME 2025 韓劇榜榮譽提名、Cine21 2025 第 6（awards 檔）。MK〈Multi-Review〉指出把安全管理職寫成「被踢出升遷路的人做的工作」不恰當，也有原作讀者嫌改編老套（https://www.mk.co.kr/en/culture/11472344 ，partial：Exa 摘要）。台灣 PTT 多人說「前 4 集難熬、後面倒吃甘蔗」（fans 檔），與中英文評論一致。網路上有「柳承龍憑本劇拿下第 62 屆百想大賞」的說法（奈飛推薦網，snippet，**未證實**，awards 檔只記入圍）。

## 10. Hot Stove League 金牌救援：Stove League（SBS，2019–20）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「hot stove league」只有 A League of Their Own 等，read）。
2. **豆瓣**：沒有可用來源。ratings 檔記有微博／新浪列表寫 9.3（snippet，不採用）。
3. **英文評論**：The Review Geek，Greg Wheeler，2020-02-17，〈Hot Stove League – Full Season 1 Review〉。https://www.thereviewgeek.com/stoveleague-s1review/ （read (Exa)；評全劇，8/10）。**注意**：The Review Geek 是英國影評網站，不在原清單。清單內媒體（Korea Herald、Korea Times、JoongAng Daily、NME、Paste、The Hindu）只找到收視、得獎、導演報導（Groundlane 站內搜尋，read 搜尋結果）。
   - 摘要：他說這部接續《魔球》的路線，把角色劇和政治、社會議題織在一起；連載主線加上每集聚焦一名球員或職員的單元結構，讓角色有深度；球場比賽戲很少，但「你不會想念」。不懂棒球也看得懂，懂的人也有足夠的數據和術語。
   - 原文：「Stove League seamlessly weaves character drama with political and societal issues in a cleverly written and engrossing 16 episode series」
4. **中文評論（台灣）**：電影神搜，薇琪吳不負責任的報告書（筆名），2021-02-03，〈【劇評】《金牌救援：Stove League》： 不只是運動電視劇，是貨真價實的熱血職場劇！〉。https://news.agentm.tw/159691/ （read）
   - 摘要：她說這是描寫球團經營的職場劇，主角是行政人員不是球員；動人之處是職人精神（「即使明天就會消失的地方，也要種下蘋果樹」），女主角摔杯說「越線的人是你！」是女力名場面。後半介紹新人編劇、導演與南宮珉主動接演的幕後故事。
5. **分歧**：沒有明顯分歧，是「冷門題材逆襲」的例子。首播 3.3%（電影神搜同文）／5.5%（Korea Times 2019-12-26 報導，snippet），完結 19.1%（KDF 2020 #5，ratings 檔）；2020 百想藝術大賞電視作品獎（電影神搜同文；JoongAng Daily 2020-06-07 snippet）。部落格評論（JazmineMedia，snippet）說每集「出事→被反對→翻盤」的公式重複到後段會膩，是少數批評。

## 11. Prison Playbook 機智牢房生活（tvN，2017–18）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「prison playbook」只有 Prison Break 等，read）。
2. **豆瓣**：沒有可用來源。ratings 檔記有微博列表寫 9.4（snippet，不採用）。
3. **英文評論**：HanCinema，Vasia Orion，2018-04-28，〈[HanCinema's Drama Review] "Prison Playbook"〉。https://www.hancinema.net/hancinema-s-drama-review-prison-playbook-118114.html （read (Exa)；評全劇）。**注意**：HanCinema 是韓劇資料庫網站，不在原清單。清單內媒體只找到 Korea Times 專訪製作人、Korea Herald 收視新聞、TIME「10 Best Korean Dramas to Watch on Netflix」清單短評（snippet）。
   - 摘要：她說這是「你不知道自己需要」的生活劇，最大強項是演員群的化學反應；不追求下一步會發生什麼，而是「現在」。缺點是男主角與從小看著長大的女友那條感情線「off-putting」且重複；但劇對失去目標、重返社會、同性戀、藥物成癮等少見議題的社會評論很到位。
   - 原文：「it is the most unlikely feel-good series I can confidently vouch for」
4. **中文評論（台灣）**：鏡週刊〈追劇指南〉，廖佩玲，頁面 publishedAt 2018-03-03（URL 日期 20180208），〈【追劇指南】《機智牢房生活》 監獄題材也能哭得嫑嫑的〉。https://www.mirrormedia.mg/story/20180208insight007 （read）
   - 摘要：她說剛開始看會覺得「這到底在搞什麼鬼」，但只要耐著性子看下去，就會被犯人們的小故事打動；監獄劇通常是逞凶鬥狠或越獄，能拍成催淚溫情戲「好像只有韓國有這樣的本事」；沒有大明星，靠音樂劇、舞台劇出身的硬底子演員撐起。（文中「相當於無線收視率 41.5%」的換算無出處，不要引用）
5. **分歧**：**口碑極高，但有評論者擔心美化監獄**。MDL 8.9（39,408 人）、有線最高 11.195%（ratings 檔）。Korea Times 2017-12-07〈[TV REVIEW] Prison reality show crosses line〉引韓國評論家김헌식說溫暖調性「could distort what is happening in real life」，但另一位評論家정덕현稱讚它把監獄寫成社會縮影（https://www.koreatimes.co.kr/entertainment/shows-dramas/20171207/tv-review-prison-reality-show-crosses-line ，partial：Exa 摘要；文章主題其實是監獄實境節目）。HanCinema 與中文評論都提到開頭難入戲、每集 90 分鐘偏長。

## 12. The Art of Negotiation 協商的技術（JTBC，2025）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「art of negotiation」只有 The Art of More 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞；Beauty321 2025 年度前十榜沒有這部，不能推論分數）。
3. **英文評論**：The Blossom Review，Karen Mansoldo，2025-04-16，〈The Art of Negotiation Review: "A Good Pitch Needs Drama"〉。https://theblossomreview.com/the-art-of-negotiation-viki-review/ （partial (Exa)：讀到約四分之三，「The Art of Negotiation Is More Than What It Seems」一節開頭後截斷；評全劇）。**注意**：The Blossom Review 是小型 K-drama 評論網站，不在原清單。Forbes（Joan MacDonald，contributor，2025-03-29）只讀到第一段（Groundlane 403、jina 空白，partial）；SCMP Pierce Conran 2025-03-11 只看到副標（snippet）；清單內其他媒體只有記者會與專訪。
   - 摘要：她說這部打破韓劇愛情、復仇、狗血的公式，用寫實與大量潛台詞拍出好看的商戰劇；兩集一個併購案的結構讓節奏不拖，實習生角色替觀眾學習 M&A；最後兩集用不同視角的回憶揭露真相，主題從「正義」轉成「追求真相」。財務長是主角的好對照角色。
   - 原文：「a business drama with a healthy dose of realism and an extraordinary use of subtext」
4. **中文評論（台灣）**：電影神搜，推坑人妻，2025-03-10，〈【首播劇評】《協商的技術》：李帝勳化身企業談判專家領軍小組，用最少資源達成不可能的任務！〉。https://news.agentm.tw/329775/ （read；只評前 2 集）
   - 摘要：她介紹安畔錫導演從愛情劇轉拍職場劇、四人併購小組的組成；首集要交代主軸與角色、敘事感重，開播平均收視 4.6% 落後同檔期，但第二集進入併購環節後「開低走高」，預期兩集一案。屬介紹型首播評論，沒有完結評論。
5. **分歧**：**慢熱：開播收視與首集口碑偏冷，完結收視翻倍**。開播 3.3%（Blossom）或 4.6%（電影神搜，兩者數字不同，可能一為首集、一為前兩集平均，未查證），完結 10.3%（Blossom；鏡週刊 2025-04-15 snippet）；Cine21 2025 年度第 5（awards 檔）；台灣 Hami Video 獨家、2025 戲劇第 4、PTT 年度最愛與印象串都有人推（fans 檔）。zapzee 首集評論（2025-03-11，snippet，非大媒體）說對話太多、首集不吸引人，6.5/10。

## 13. Undercover Miss Hong 臥底洪小姐（tvN／Netflix，2026）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「undercover miss hong」只有 Undercover Boss 等，read）。
2. **豆瓣**：沒有找到可用來源（未另外搜尋新聞）。
3. **英文評論**：Decider，Joel Keller，2026-01-20，〈Stream It Or Skip It: 'Undercover Miss Hong' On Netflix, A Comedy Where A Financial Crimes Investigator Poses As A Young Intern At A Top Investment Firm〉。https://decider.com/2026/01/20/undercover-miss-hong-netflix-review/ （read (Exa)；只評第 1 集）
   - 摘要：他說首集長達 74 分鐘、塞太多東西：前 45 分鐘都在建立女主角多強悍，看完仍不清楚核心案件；笑點是韓式音效搭配側眼、肢體搞笑和大吼，「more goofy than actually funny」。但朴信惠把角色的自信與兇狠演得很好。結論 SKIP IT。
   - 原文：「There's too much going on in the first episode of Undercover Miss Hong, including a central case that's hard to understand」
4. **中文評論（台灣）**：**沒有找到**。搜尋過：Groundlane 站內限定 thenewslens、filmaholic、opinion.udn、news.agentm、mirrormedia、stars.udn、ELLE／Vogue／GQ TW（「臥底洪小姐 劇評」「臥底洪小姐 朴信惠 完結 評論」）；Exa「臥底洪小姐 朴信惠 韓劇 劇評 完結」。只找到 ELLE TW 開播前的〈8亮點〉介紹（2026-01-17，snippet，lifestyle、非劇評）、聯合報與自由時報的新聞、個人部落格「Netflix追劇筆記本」（screenpotatoes.com，非清單媒體）與 pinkjhs 分集整理。
5. **分歧**：**英文首集評論 SKIP，完結收視與口碑雙高**。首播 3.5%、第 11 集破 10%、第 15 集 13.1%、完結 12.4%（KSD 韓星網 2026-03-09，snippet；自由時報 2026-03-10 寫 12.3%，snippet）；有線排行 13.121%（ratings 檔）。MK 中文版 2026-03-08 收官評論稱「龍頭龍尾」、為 16 集劇樹立新標竿（partial：Exa 摘要）；Bangkok Post（Suwitcha Chaiyong，2026-02-17，snippet）與 The Blossom Review（2026-03-18，snippet）都給全劇高評價。India Today 首集評論（Bhavna Agarwal，2026-01-23，partial）同樣說首集「overstuffed」。分歧主要是「只看首集」與「看完全劇」的差別。

## 14. Itaewon Class 梨泰院Class（JTBC，2020）

1. **Metacritic S1**：沒有 Metascore（站內搜尋「itaewon class」只有 Deadly Class 等，read）。
2. **豆瓣**：沒有可用的明確豆瓣新聞引述。東方網（姜方，2020-03-19）報導最後兩集播出前「网络评分已从9分以上跌至8分」，沒寫明是豆瓣（https://j.eastday.com/m/1584600487018059 ，partial：Exa 摘要）；內容農場轉文寫「開分8.6、收官7.9」（xinsiji.cc，snippet，不採用）；新浪微博帳號寫「8.7」（2020-02-17，snippet，不採用）。
3. **英文評論**：Vulture，E. Alex Jung，2020-04-02，〈Itaewon Class, a Korean Drama That Just Hits Different〉。https://www.vulture.com/2020/04/itaewon-class-a-korean-drama-that-just-hits-different.html （read (Exa)；完結後評全劇）
   - 摘要：他說這是「重混的經典」：血仇、階級戰爭、多角戀都在，但製作與編劇更好；配角群（跨性別廚師、尋父的黑人韓國人、前科犯）是韓劇少見的；男主角代表「Good Daddy Capitalism」，對手是「Bad Daddy Capitalism」。善惡分明讓結局「something of a foregone conclusion」，但過程仍讓人上癮。
   - 原文：「The show delivers that great salve of middlebrow television: It surprises and delights」
4. **中文評論（台灣）**：500輯（聯合新聞網〈文藝視角〉），田育志，2021-02-25，〈【機智的韓劇生活】《驅魔麵館》與《梨泰院Class》：賣吃的從來就只是個幌子，真正賣的是熱血〉。https://500times.udn.com/wtimes/story/12672/5276612 （read；**與《驅魔麵館》合評**；500輯是聯合報系，但不在原清單名單上）。指定清單媒體只找到鏡週刊新聞、關鍵評論網的譯名考據文（〈《梨泰院CLASS》的姓名之謎〉，snippet）。
   - 摘要：他把兩部都看成網漫改編的「熱血漫畫」：主角加夥伴一路打怪升級。梨泰院前半口碑好，但第 13 集一跳四年，IC 公司就能和長家比拚，「朴世路的一步、一腳印，在某個時間點忽然變成一步登天，先前十幾集關於創業的鋪陳，似乎都變得多餘」，所以被批爛尾。
5. **分歧**：**收視創新高，結局被批「爛尾」**。完結全國 16.548%（ratings 檔；Vogue TW 2020-03-24 snippet），IMDb 8.1（ratings 檔）；但結局反應兩極：ETtoday 2020-03-23 報導韓網「最後一集只是為了粉紅泡泡而演」等負評，原作者兼編劇趙光真在 IG 說「不夠好的只有我」（https://star.ettoday.net/news/1674799 ，snippet）；東方網說後半節奏拖沓、感情線引發棄劇聲浪（partial）。英文評論（Vulture、SCMP Edmund Lee 3.5/5 snippet）多寫在完結後，評價仍正面，Vulture 只輕描淡寫說結局可預期。

---

## 總表

| # | 劇名 | Metacritic S1 | 豆瓣（媒體引述） | 英文評論 | 狀態 | 台灣中文評論 | 狀態 | 主要分歧 |
|---|---|---|---|---|---|---|---|---|
| 1 | 外傷重症中心 | 無 | 8.3（Beauty321 年底） | Decider／Keller | read（ep1） | 聯合報娛樂有評／潘光中 | read | 首集 SKIP vs 串流爆紅；醫師說不寫實 |
| 2 | 浪漫醫生金師傅 | 無 | 未找 | NME／Hidzir Junaini（S3） | read（S3 前 4 集） | 鏡週刊／廖佩玲（S1） | read | 大致一致 |
| 3 | 非常律師禹英禑 | 無 | 9.3（播出中，亞洲日報） | Polygon／Geoffrey Bunting | partial | 關鍵評論網（思想坦克）／楊添圍 | read (Exa) | 自閉症再現爭議 |
| 4 | 機智住院醫生生活 | 無 | 8.3（Beauty321 年底） | TIME／Kayti Burt（背景解析） | read | 電影神搜／Winnie | read（ep1–2） | 開播冷 vs 後段回溫；醫師罷工反彈 |
| 5 | 精神病房也會迎來清晨 | 無 | 未找 | NME／Carmen Chin | read | 釀電影／九號球 | read | 大致一致 |
| 6 | 車貞淑醫生 | 無 | 未找 | The Hindu／Poorvaja | read (Exa) | 聯合報娛樂有評／雀雀（合評） | read | 高收視 vs 後半冗長 |
| 7 | 狂醫魔徒 | 無 | 無可用（只有用戶長評） | Korea Herald／Lee Yoon-seo | read (Exa, ep1–2) | 電影神搜／推坑人妻 | read | 表演好 vs 可信度、結局 |
| 8 | 代理公司 | 無 | 未找 | MediaCat UK／Seoyoung Lee（清單外） | read (Exa) | 電影神搜／潘光中 | read | 高收視 vs 韓國女性主義評論 C 級 |
| 9 | 金部長的夢想人生 | 無 | 8.3（Beauty321） | Korea Times／Baek Byung-yeul | read (Exa) | Tatler Asia／Irene Chen（lifestyle、清單外） | read (Exa) | 開低走高；安全管理職爭議 |
| 10 | 金牌救援 | 無 | 無可用 | The Review Geek／Greg Wheeler（清單外） | read (Exa) | 電影神搜／薇琪吳 | read | 無明顯分歧 |
| 11 | 機智牢房生活 | 無 | 無可用 | HanCinema／Vasia Orion（清單外） | read (Exa) | 鏡週刊／廖佩玲 | read | 高口碑 vs 美化監獄疑慮 |
| 12 | 協商的技術 | 無 | 未找 | The Blossom Review／Karen Mansoldo（清單外） | partial | 電影神搜／推坑人妻 | read（ep1–2） | 慢熱，收視翻倍 |
| 13 | 臥底洪小姐 | 無 | 未找 | Decider／Keller | read (Exa, ep1) | 沒有找到 | — | 首集 SKIP vs 完結 12.4% |
| 14 | 梨泰院Class | 無 | 無明確豆瓣（「網路評分」9→8） | Vulture／E. Alex Jung | read (Exa) | 500輯／田育志（合評、清單外） | read | 高收視 vs 結局爛尾 |

「未找」= 這次沒有為該劇另外搜尋豆瓣新聞；「無可用」= 搜過但只有 snippet、用戶評論或列表。

## 缺口

1. **Metacritic**：14 部都沒有頁面，這個欄位對韓劇沒用。
2. **豆瓣**：只有 4 部有媒體引述（禹英禑、外傷重症中心、機智住院醫生生活、金部長），其中三部來自同一篇 Beauty321 年度榜（2026-01 快照），禹英禑是播出中的數字。金牌救援 9.3、機智牢房生活 9.4 只在微博列表看過（snippet）。豆瓣 subject 頁沒有重試。
3. **英文大媒體覆蓋薄**：職場劇（代理公司、金牌救援、機智牢房生活、協商的技術）在清單內媒體都找不到署名單篇評論，只好用 HanCinema、MediaCat UK、The Review Geek、The Blossom Review。若正文要引，建議只當「海外評論一例」，不要寫成「外媒評」。浪漫醫生金師傅只找到第三季評論，第一季沒有。
4. **只評首集或前幾集的英文評論**：Decider 兩篇（外傷重症中心、臥底洪小姐都給 SKIP）、Korea Herald（狂醫魔徒）、NME（浪漫醫生金師傅 S3 前 4 集）；TIME 機智住院醫生生活是背景解析不是劇評。引用時要寫明「首集評論」。
5. **台灣中文評論**：臥底洪小姐沒有找到；金部長只有 lifestyle 媒體 Tatler；梨泰院只有 500輯的合評。電影神搜 5 部多是筆名粉絲劇評，評論深度最好的是潘光中（外傷重症中心、代理公司）、楊添圍（禹英禑）、九號球（精神病房）。只評首播的：機智住院醫生生活、協商的技術。
6. 「分歧」欄裡的 SCMP、NYT、Korea JoongAng Daily、Korea Biomedical Review、ETtoday、MK、韓國《女性新聞》等多是 **partial 或 snippet**，正文引用前要再讀原文。「柳承龍拿下百想大賞」是未證實說法；協商的技術開播收視 3.3% 與 4.6% 兩個數字未對齊；鏡週刊「相當於無線 41.5%」不能引用。

## toolDegradation

- **Groundlane MCP**（`web_extract`／`web_fetch`／`web_search`）為主：Metacritic 14 次站內搜尋、NME 兩篇、TIME、聯合報娛樂有評兩篇、鏡週刊兩篇、電影神搜五篇、釀電影、500輯、Beauty321 都讀到。失敗：Forbes 回 403（js_empty_document）；Tatler Asia 回 browser-challenge；TIME 預設 article 抽取只回圖片，改 `extract=full` 才讀到全文。Groundlane 搜尋內部的 tavily／exa provider 多次 unavailable，由 brave／you 補上。
- **Exa**：`web_search_exa` 用來找英文評論、豆瓣新聞與中文評論（摘要長，部分只當 partial 用）；`web_fetch_exa` 讀到 Decider 兩篇、Polygon（截斷）、Vulture、The Hindu、Korea Herald、Korea Times、HanCinema、MediaCat、The Review Geek、The Blossom Review（截斷）、關鍵評論網、Tatler。失敗：NME 回 CRAWL_HTTP_403；Forbes 只回第一段；關鍵評論網 TNL+ 文章（貓心）只回前幾段。
- **jina `read_url`**：試 Forbes 一次，回空白頁。
- **Tavily**：未使用（已知會 429）。**Firecrawl**：額度用完，未使用。**Groundlane 直接 HTTP／Keenable／You.com keyless**：未需要。
