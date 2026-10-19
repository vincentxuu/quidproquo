# 研究筆記：其他攀登類型（H 模組）——冰攀與混合攀、高山攀登、大岩壁與人工攀登、深水獨攀、獨攀

日期：2026-10-18
用途：`.work/series-plans/climbing-disciplines.md` 的依據；之後逐篇寫作時再對每篇做 post-verify。
範圍來源：`.research/2026-10-17-climbing-full-curriculum.md` 的 H 列（1 總覽＋選寫：冰攀、高山攀登、大岩壁／人工攀登、深水獨攀、free solo）。

## toolDegradation

- Groundlane MCP（`mcp__claude_ai_Groundlane__web_search`）：載入後回 `MCP server "claude.ai Groundlane" is not connected`。
- Groundlane 直接 HTTP（POST `groundlane.vincent-xu-work.workers.dev/mcp`）：回空內容。
- Keenable keyless：可用，全部搜尋走這一層（同時並發太多會回 `query: None`，改成逐筆送 + 1.5 秒間隔）。
- 抓頁：Jina reader（`r.jina.ai`）可用但每 IP 限流（429）；firecrawl MCP 顯示 not connected；linkup 404。其餘頁面以 `curl` 直抓後去 HTML，PDF 以 `pdftotext`，Wikipedia 用 `action=raw`，PubMed 用 eutils。
- 讀不到：psicobloc.com（回 2 bytes）、Facebook 貼文（登入牆，改用 Keenable 摘要＋同業者官網列表）、bath.ac.uk 的 Going Solo PDF（回 cookie 頁）、yosemitebigwall.com（連線失敗，改用 Wikipedia Aid climbing 引的 McNamara 定義）。

## 來源與讀取程度

✅ = 全文讀過；🟡 = 只讀到搜尋摘要或轉引；🔴 = 未讀。

### 分級系統
| 來源 | 內容 | 程度 |
|---|---|---|
| ACMG〈Alpine Route Grade Definitions〉PDF https://acmg.ca/app/uploads/2025/10/Alpine_Route_Grade_Definitions.pdf | F–ED 定義（Jones & McLane），含岩性、雪坡角度、撤退與下撤難度 | ✅ |
| Alpinist〈Climbing Grade Comparison Chart〉https://alpinist.com/climbing-grade-comparison-chart/ | NCCS 承諾等級 I–VII、法式高山等級、WI/M | ✅ |
| AAC〈International Grade Comparison Chart〉https://publications.americanalpineclub.org/articles/13201212386/International-Grade-Comparison-Chart | NCCS I–VI 時間定義 | 🟡 |
| Alaska Ice Climbing〈Climb Ratings〉https://alaskaiceclimbing.com/climb-ratings | WI1–WI7、M1–M11 對照 YDS | ✅ |
| Terragalleria〈Ice climbing FAQ: ratings〉https://terragalleria.com/mountain/info/ice/ice-rating.html | 加拿大式「嚴重度羅馬數字＋技術阿拉伯數字」；M 級「沒有共識」 | ✅ |
| Wikipedia〈Aid climbing〉https://en.wikipedia.org/wiki/Aid_climbing | A0–A5 定義（引 McNamara《Yosemite Big Walls》）、new wave、等級隨重複攀登而降 | ✅ |
| Wikipedia〈Deep-water soloing〉https://en.wikipedia.org/wiki/Deep-water_soloing | S0–S3（1995 英國），潮汐改變 S 級 | ✅ |
| UIAA〈Rock climbing grades〉http://theuiaa.org/grades-standards/rock-climbing | UIAA I–XII | 🟡 |

### 冰攀與混合攀
| 來源 | 內容 | 程度 |
|---|---|---|
| Wikipedia〈Ice climbing〉https://en.wikipedia.org/wiki/Ice_climbing | 水冰／高山冰、裝備、技術 | ✅ |
| Ganti et al. 2021, *Wilderness Environ Med* 32(2):181–186（PubMed 33972162）https://pubmed.ncbi.nlm.nih.gov/33972162 | 2019 Ouray 冰攀節，75 份問卷、912 參與小時、16 件輕傷 → 17.6/1000 h；過去估計 4.8–248/1000 h | ✅（摘要全文） |
| Climbing.com〈30 years of climbing accident data〉https://climbing.com/skills/30-years-of-climbing-accident-data-an-investigative-report | 冰攀事故首要因素：保護不足／冰螺栓拔出；拔出時 runout 占 20% | ✅ |
| Wikipedia〈Dry-tooling〉https://en.wikipedia.org/wiki/Dry-tooling | 乾攀定義 | 🟡 |
| OUTSiDERS〈乾攀是什麼？〉https://www.outsiders.com.tw/post/50098 | 中文：乾攀定義、1994 Jeff Lowe（Vail）、室內乾攀工具、韓國青松、四川雙橋溝 | ✅ |
| go4mosa〈來自台灣的攀冰選手！高雄「冰友」林益帆〉https://www.go4mosa.net/blog/posts/iceclimbing | 台灣冰攀者的路徑：2018、2025 去四川雙橋溝；2025-01 北京攀冰公開賽第 8 | ✅ |
| 山野悠遊〈韓國冰攀訓練〉https://www.goforwild.com.tw/actD4X.php?act_no=491 | 台灣業者帶韓國冰攀；先備繩結清單；「台灣冰雪期不穩定」 | ✅ |
| 光合作用內湖運動中心 FB（室外乾攀體驗） | 台灣岩館辦過乾攀體驗，350 元/人；年份不明 | 🟡 |
| 黃重九 IG reel（高雄室內岩館 dry tooling） | 高雄岩館有乾攀路線與特製金屬錨點 | 🟡 |
| UIAA Ice〈2030 Olympic update〉https://iceclimbing.sport/2030-ice-climbing | UIAA 申請冰攀列 2030 附加項目 | ✅ |
| UIAA〈Statement on Ice Climbing and French Alps 2030〉https://theuiaa.org/statement-on-ice-climbing-and-the-olympic-winter-games-french-alps-2030 ；Climbing.com https://climbing.com/news/ice-climbing-2030-olympics | 2030 組委會不把冰攀放進提案（6 月 2 日消息） | 🟡（兩處摘要一致，寫作時要讀全文） |
| UIAA 2026 Ice Climbing World Cup – Cheongsong https://theuiaa.org/event/2026-uiaa-ice-climbing-world-cup-cheongsong-south-korea | 世界盃有韓國站 | 🟡 |
| AMGA Ice Instructor Program https://amga.com/programs/mountain-guide-programs/ice-guide-program | 冰攀嚮導課程結構 | ✅ |
| Alpine Club of Canada〈Intro to Ice Climbing〉 | 入門課（頁面只抓到 cookie 文字） | 🔴 |

### 高山攀登
| 來源 | 內容 | 程度 |
|---|---|---|
| Wikipedia〈Alpine climbing〉https://en.wikipedia.org/wiki/Alpine_climbing | 客觀危險：落石、雪崩、冰塔、冰河裂隙、風暴、高度 | ✅ |
| UIAA〈Alpinism gets recognition from UNESCO〉https://theuiaa.org/alpinism-gets-recognition-from-unesco-as-intangible-cultural-heritage-of-humanity | 2019 列入人類非物質文化遺產；法、瑞、義共同申請；定義「以自身體力、技術、智識攀登山頂與山壁」 | ✅ |
| UIAA〈Alpine Summer Skills Handbook〉https://theuiaa.org/training/alpine-handbook | 與 Petzl 基金會、ACC 合編的技能手冊，第四版 | ✅ |
| 站內 IFMGA 系列（尤其〈ifmga-pre-entry-prep〉、〈ifmga-training-and-exams〉） | 台灣練得到／練不到的冰雪能力、日韓冰攀點、雪攀嚮導證 | ✅ |

### 大岩壁與人工攀登
| 來源 | 內容 | 程度 |
|---|---|---|
| Climbing.com〈How to Climb a Big Wall〉https://www.climbing.com/skills/how-to-climb-a-big-wall/ | 基本流程：領攀、拖吊、跟攀用上升器清裝備 | ✅ |
| NPS Yosemite〈Climbing Regulations〉https://www.nps.gov/yose/planyourvisit/climbing_regulations.htm | 固定繩 24 小時規則、荒野區不留永久設施 | ✅ |
| NPS Yosemite〈Wilderness Climbing Permits〉https://home.nps.gov/yose/planyourvisit/climbingpermits.htm | 過夜大岩壁許可 | ✅（頁面多為導覽，重點靠 AAC 文） |
| AAC〈The Yosemite Big Wall Permit System〉https://americanalpineclub.org/news/2025/5/27/the-yosemite-big-wall-permit-system-impact-and-logistics | 2021 試辦、2023-01 常設，過夜大岩壁一律要許可 | ✅ |
| 動一動・小PO〈大牆攀登（Big Wall）的學習之路〉https://www.don1don.com/archives/59390/ | 中文學習路徑：傳攀 → 固定點 → 多繩距 → 大量 Grade III/IV 再上 Grade V | ✅ |
| 中文維基〈大岩壁攀登〉https://zh.wikipedia.org/zh-tw/大岩壁攀登 | 中文名：大岩壁攀登、大峭壁攀登、大牆攀登 | ✅ |
| SuperTopo / VDiff / UKC El Cap 系列（拖吊、撤退、確保站管理） | 技術細節 | 🟡（寫作時再讀） |
| AdventureTaiwan IG〈攀岩訓練－大岩壁攀登〉 | 台灣有業者開大岩壁訓練課 | 🟡 |
| 太魯閣規劃報告（經 IFMGA 文轉引）https://www.taroko.gov.tw/ch/planlist/research-reports/393 | 「大岩壁僅有白沙峰有記錄」 | 🟡（轉引） |

### 深水獨攀（DWS）
| 來源 | 內容 | 程度 |
|---|---|---|
| AAC〈Essentials: Deep Water Soloing〉https://publications.americanalpineclub.org/articles/13201214308 | 溺水、入水撞擊、水下障礙；歐洲至少 3 起死亡；入水姿勢；不要往下看 | ✅ |
| AAC〈Deep Water Soloing Injury〉https://publications.americanalpineclub.org/articles/13201214421 | 2016 PsicoRoc（Summersville Lake）約 55 ft 墜落、腦震盪與斷牙 | ✅ |
| Climbing.com〈Deep-Water Soloing This Summer? Read This First.〉https://www.climbing.com/skills/learn-this-deep-water-soloing-101/ | 冷水休克、armchair 入水（<10 ft 淺水用）、平靜水面表面張力較大 | ✅ |
| UKC〈A History of Mallorca Deep Water Soloing〉https://www.ukclimbing.com/articles/features/a_history_of_mallorca_deep_water_soloing-3539 | 1978 Riera 在 Porto Pi；英國 1983 Nick Buckley *The Conger*；2001 國際攀登者到 Cova del Diablo | ✅ |
| Climbing.com〈Interview: Miquel Riera〉https://www.climbing.com/culture-climbing/interview-miquel-riera-on-the-birth-of-deep-water-soloing/ | psicobloc 名稱由來；2002 Big Up 拍 Sharma；建議用逃生梯不要留固定繩 | ✅ |
| Mountain Project〈Crystal Blue Temptation, Long Dong〉https://mountainproject.com/route/108330150/crystal-blue-temptation | 龍洞的 DWS 路線，在被礁石圍住的池子；「有強烈離岸流，其他地方不建議」 | 🟡 |
| climbstone.com（龍洞資訊）http://www.climbstone.com/information.html | 「a couple decent DWS routes around 5.8」 | 🟡 |
| Taiwan Pathfinder 活動列表 https://www.taiwanpathfinder.com/adventureZN/ ＋ IG/FB 貼文 | 龍洞 DWS 商業場次，NT$3,500，2026 年 6/6、7/4、9/20，提供救生衣；中文稱「深水抱石」 | 🟡 |
| 商周 alive・方俊強〈到泰國喀比體驗深水獨攀〉https://alive.businessweekly.com.tw/single/Index/ARTL006001799 | 台灣人去喀比 DWS 的實況；同行者十幾公尺跳水後耳膜出血 | ✅ |
| psicobloc.com〈What is Psicobloc〉 | 比賽格式 | 🔴（抓不到；改用 Wikipedia 與 Riera 訪談） |

### 獨攀（free solo、rope solo）
| 來源 | 內容 | 程度 |
|---|---|---|
| Wikipedia〈Free solo climbing〉(raw) https://en.wikipedia.org/wiki/Free_solo_climbing | 定義、代表人物、倫理爭議、死亡名單、highball 與 DWS 的邊界 | ✅ |
| AAC〈The Prescription—Free Solo Fall〉2025-08 https://americanalpineclub.org/news/2025/8/12/the-prescription | 2024-12 Flatirons 兩天內兩起死亡；「幾乎都致命，常發生在熱門中等難度路線」；Flatirons 自 1950 年代 33 起、11 死 | ✅ |
| AAC〈Free Solo Death〉2022-12 https://americanalpineclub.org/news/2022/12/19/the-prescription | El Cajon Mountain，22 歲，5.9 三段路線；走錯路線 | ✅ |
| Climbing.com〈9 Interesting Stats From 210 Climbing Accidents〉https://www.climbing.com/news/9-takeaways-climbing-accidents-2024/ | ANAC 2025 版：2024 美國 49 死；高山 71 起最多、傳攀 52、運攀 35；**是總數不是比率**；專家事故比新手多 | ✅ |
| suburbanmountaineer（轉述 Synnott《The Impossible Climb》）https://suburbanmountaineer.com/2019/04/29/how-free-soloists-die-according-to-alex-honnold/ | Honnold 的說法：「沒有獨攀者在挑戰極限時墜落」；Bachar 2009、Hersey 1993 | ✅（二手轉述） |
| Wikipedia〈Skyscraper Live (2026)〉https://en.wikipedia.org/wiki/Skyscraper_Live_(2026) | 2026-01-25 Netflix 直播 Honnold 無繩攀台北 101；「最高的城市獨攀」被 Dan Goodwin 1986 CN Tower 質疑 | ✅ |
| DW 中文〈徒手成功攀登台北101：生死直播引爆爭議〉https://www.dw.com/zh-hant/.../a-75640731 | 延後一天、直播倫理爭議、Honnold 說風險「幾乎是零」 | ✅ |
| 台視〈霍諾德成功攻頂！全程僅用1小時31分〉https://news.ttv.com.tw/news/11501250000600W | 用時 1 小時 31 分 | 🟡 |
| AAC Rope-solo / top-rope-solo 事故（Prescription 2023-02、2025-02；ANAC Mark Byers；Craig Faulhaber） | rope solo 系統失效案例 | 🟡（摘要；寫作時讀全文） |
| Brent Barghahn〈Redpoint Rope Soloing〉、UKC／MP 論壇 | rope solo 裝置（Silent Partner、GriGri 改裝） | 🟡 |
| 站內〈攀岩書籍知識版圖〉 | 已有 Free Solo、自由攀登 vs 人工攀登的 glossary 與 Honnold 段落 | ✅ |

## 主要發現

### 1. 這五類不是同一件事的不同難度，而是三個軸的組合

- **保護方式**：沒有保護（free solo、DWS 用水當保護）→ 自己一人帶繩（rope solo）→ 繩伴確保＋自然保護（大岩壁、冰攀、高山）。
- **介質**：岩、冰、雪、混合。
- **承諾程度**：NCCS I–VII 量的是「一般繩隊要花多久」（Alpinist、AAC 對照表）；高山 F–ED 量的是整條路線含接近、下撤與客觀危險（ACMG）。

這個三軸架構是總覽篇的主圖，也決定排序：從讀者熟悉的（抱石、岩館）往外推。[推論，依據為各分級系統的定義]

### 2. 每一類都有自己的分級系統，這是分篇的主要理由

| 類型 | 分級 | 來源 |
|---|---|---|
| DWS | 技術難度＋S0–S3（1995 英國；S 級以滿潮為準，退潮可能從 S1 變 S3） | Wikipedia DWS |
| 人工攀登 | A0–A5（打岩釘）／C1–C5（不用槌）；A0 即 French free；A5 = 一個失敗就至少墜 20 m | Wikipedia Aid climbing（引 McNamara） |
| 大岩壁 | NCCS V–VII（V 一兩晚、VI 2–7 晚、VII 超過 7 晚）＋自由難度＋人工難度，三個並列（例：The Nose 5.9 C2 VI 類寫法） | yosemitebigwall 摘要、MP 論壇 |
| 冰攀 | WI1–WI7；加拿大式嚴重度 I–VII＋技術 1–7 | Alaska Ice、Terragalleria |
| 混合／乾攀 | M1–M11（M6 ≈ 5.10、M8 ≈ 5.12） | Alaska Ice |
| 高山 | F／PD／AD／D／TD／ED1–3 | ACMG（Jones & McLane） |

一篇總覽講不完六套分級加裝備加台灣現況，會變成名詞表。

### 3. 風險資料：只有總數，沒有比率

- ANAC 2025 版（2024 年資料）：高山 71 起、傳攀 52、運攀 35；free solo 與 DWS 合計 9 起。Climbing.com 明講這是總數不是比率，參與人數少的類型比率可能很高。
- 冰攀：Ouray 冰攀節（人工冰壁）17.6 件／1000 小時，全部輕傷；過去估計 4.8–248。樣本 75 人，不能外推到天然冰瀑。
- 冰攀事故首要因素：保護不足／冰螺栓拔出（30 年 ANAC 分析）。
- Free solo：AAC 說「幾乎都致命」，而且多半在熱門中等難度路線（Flatirons 5.4、5.7；El Cajon 5.9）。
- DWS：歐洲至少 3 起死亡（AAC 2017）；主要風險是溺水、冷水休克、入水姿勢錯誤、水下障礙。

### 4. 台灣現況（決定每篇的「在台灣」段落）

| 類型 | 台灣做得到嗎 | 證據 |
|---|---|---|
| DWS | 做得到，但只有少數點 | 龍洞 Crystal Blue Temptation（礁石圍住的池子）、約 5.8 的幾條路線；有業者辦 DWS 場次（NT$3,500、救生衣）；MP 提醒其他位置有離岸流 |
| 乾攀 | 岩館偶爾有 | 內湖運動中心室外乾攀體驗、高雄岩館乾攀路線 |
| 冰攀 | 天然冰幾乎沒有 | 合歡山冰攀活動因冰況取消（IFMGA 文轉引）；台灣人去韓國（山野悠遊課程）、四川雙橋溝（林益帆）、日本八岳（IFMGA 文） |
| 大岩壁 | 沒有真正的大岩壁 | 太魯閣報告「大岩壁僅有白沙峰有記錄」；龍洞最高約 80 m；可在龍洞練多繩距系統；有業者開大岩壁訓練課 |
| 高山 | 只有雪攀層級 | 雪攀嚮導證、雪季入園；技術高山路線最長約 300 m（IFMGA 文） |
| Free solo | 2026-01-25 Honnold 直播攀台北 101 | Wikipedia、DW、台視；台灣讀者最熟悉的接點 |

### 5. 跟站內既有文章的重疊

- **IFMGA 系列**：〈ifmga-pre-entry-prep〉已經寫完台灣練得到／練不到的冰雪能力、日韓冰攀地點與價格、雪崩課。H 系列的冰攀與高山篇只寫「這是什麼、怎麼開始」，地點和價格連過去，不重寫。〈ifmga-training-and-exams〉講嚮導考試，不碰入門者。
- **運攀與傳攀系列**：多繩距、自救概念、傳攀保護、固定點是大岩壁與高山篇的前置，連回去。
- **攀岩動作技術**：裂隙技術是大岩壁（優勝美地）的前置。
- **攀岩書籍知識版圖**：已有 Free Solo 的 glossary 與 Honnold 的書；獨攀篇連過去，不重講書。
- **規劃中的 K 賽事系列**：Psicobloc 與冰攀世界盃屬於 K；H 只用一兩句帶過並連結。
- **規劃中的文化與歷史系列（climbing-history-culture）**：Preuss 等早期獨攀史屬於那邊；H 只帶一句。

## 衝突與不一致（不選邊，寫作時並列）

1. **WI 的角度定義各家不同**：glacierworldmap 寫 WI2 為 50–60°；nationalparks.org 寫 WI2 約 60°、一支冰斧即可；UKC 論壇指出加拿大 WI5 要整段繩距 85–90°，短的同角度只給 WI4+。最高等級也有 WI7（多數來源）與 WI10+（中文部落格）之別。
2. **M 級沒有共識**：Terragalleria 明寫「There is no consensus」；Alaska Ice 的 M↔YDS 對照只是一家說法。
3. **人工攀登分級在變**：McNamara 認為 new wave 系統「只帶來更多混亂」；同一條路線被重複攀登後會從 A5 降到 A3+（Wikipedia 引 2011 文獻）。
4. **DWS 的起源**：Mallorca 1978（Riera）與英國 1983（Nick Buckley *The Conger*）兩條線各自發展；S 級是英國 1995 年訂的。
5. **DWS 的中文名**：業者用「深水抱石」，商周與本站課綱用「深水獨攀」，也有人用「深水攀岩」。
6. **Free solo 的風險怎麼說**：Honnold 說台北 101「風險幾乎是零」、「沒有獨攀者在挑戰極限時墜落」；AAC 的事故報告顯示死亡多發生在熟練者的熟悉中等路線，「經驗與體能不保證存活，熟悉反而降低專注」。兩者其實相容，但讀者容易讀成互相矛盾。
7. **「最高城市獨攀」**：Outside 稱台北 101 是最高；Gripped 引 Dan Goodwin 1986 CN Tower 提出質疑。
8. **冰攀受傷率**：Ouray 研究 17.6/1000 h（人工冰壁、全輕傷）vs 過去估計 4.8–248；兩者條件不同。
9. **高山等級的定義來源不同**：歐洲 IFAS 與加拿大 Jones & McLane 版大致對應，但 D+ 在後者沒有定義（ACMG 自己註明）。

## 台灣用語

| 英文 | 本系列建議用語 | 其他寫法 | 依據 |
|---|---|---|---|
| ice climbing | 冰攀 | 攀冰（OUTSiDERS、go4mosa、中文維基） | 站內 IFMGA 系列一律用「冰攀」，保持一致 |
| mixed climbing | 混合攀登 | 冰岩混合攀登、Mix | OUTSiDERS |
| dry tooling | 乾攀（dry tooling） | 乾式攀登 | OUTSiDERS、內湖岩館貼文 |
| alpine climbing / alpinism | 高山攀登、阿式攀登（alpine style） | 阿爾卑斯式攀登 | Mammut HK、好讀網 |
| big wall | 大岩壁攀登 | 大牆攀登（小PO）、大峭壁攀登 | 中文維基、小PO 專欄 |
| aid climbing | 人工攀登 | 器械攀登 | 站內書籍文 glossary |
| aider / etrier | 繩梯（aider） | 踏帶 | 待確認，寫作時查台灣業者用語 |
| jumar / ascender | 上升器 | 猴爪 | 待確認 |
| haul bag | 拖吊袋 | — | 待確認 |
| portaledge | 吊帳（portaledge） | 岩壁吊床 | 待確認 |
| deep water solo | 深水獨攀（DWS） | 深水抱石、深水攀岩 | 見衝突 5 |
| free solo | 無繩獨攀（free solo） | 徒手獨攀、徒手攀岩、赤手獨攀（Netflix 台灣片名） | 站內書籍文用「無繩獨攀」；中文維基用「徒手獨攀」 |
| rope solo | 帶繩獨攀（rope solo） | 繩索獨攀 | 待確認 |
| highball | 高抱石（highball） | — | G 系列用語 |

## 待解問題

需要使用者拍板：
1. **篇數**：6 篇（總覽＋DWS＋大岩壁＋冰攀＋高山＋獨攀）還是精簡成 4 篇（總覽＋無繩攀登〔DWS 與 free solo〕＋大岩壁＋冰雪〔冰攀與高山〕）。
2. **獨攀篇的寫法**：只講是什麼、風險資料與倫理爭議（含台北 101），不教 rope solo 架設？本筆記建議「只講概念與風險，不給架設步驟」，同運攀傳攀系列〈自救概念〉的處理。
3. **DWS 篇要不要點名台灣商業場次**：龍洞業者有收費 DWS 活動，但沒有任何安全審查資料；建議只寫「有業者辦，選擇時要問什麼」，不點名推薦。

寫作時再查（不影響規劃）：
- 繩梯、上升器、拖吊袋、吊帳的台灣通用中文。
- 2030 冬奧不列冰攀：讀 UIAA 聲明全文確認日期與措辭。
- Psicobloc 比賽格式：psicobloc.com 讀不到，改找 Red Bull 或 Wikipedia 引文。
- 龍洞 DWS 路線的等級、潮汐與離岸流：讀 Mountain Project 全頁與龍洞 topo；TOCC 是否有 DWS 相關公告。
- 內湖運動中心乾攀活動的年份、高雄哪一間岩館有乾攀牆。
- Rope solo 事故：讀 AAC Prescription 2023-02、2025-02 全文。
