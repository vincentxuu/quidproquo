# 系列規劃：攀岩心理與戰術（climbing-mental-tactics）

使用者確認：2026-10-19（使用者回覆「照建議」）

決定（2026-10-19）：共 8 篇；保留原 7 篇（order 0 獨立總覽），另加一篇比賽心理（隔離區、有限觀察時間、只有一次機會、觀眾）。order 2 改為紅點與日常的表現焦慮；比賽篇的規則全貌以純文字提到「攀岩賽事系列」（尚未上線，不加連結）。不引用 The Climbing Bible（正文未讀）。寫皮膚篇前先查 TFDA 許可證資料：查無則寫「未查到許可紀錄」，不推薦購買管道。

來源：`.research/2026-10-18-climbing-mental-tactics-research.md`（約 140 份已讀來源，分心理／戰術／條件與皮膚三份附錄；11 個學派矛盾、台灣用語表、待解問題）、`.research/2026-10-17-climbing-full-curriculum.md`（F 模組）、`.research/2026-10-17-climbing-curriculum-audit.md`、站內〈攀岩書籍知識版圖〉（心理取向）。

## 系列登錄資料（給 `src/utils/series.ts`，確認後再登錄）

- slug：`climbing-mental-tactics`
- category：`climbing`
- 名稱：zh-TW「攀岩心理與戰術」／en「Climbing Mental Game and Tactics」
- 描述 zh-TW：開始先鋒後讀：為什麼頂繩爬得上、先鋒就卡住，怎麼循序練墜落、面對失敗的緊張、比賽時的隔離區與觀察時間，再到 onsight 與 redpoint 的投入策略、挑天氣與摩擦，最後是皮膚保養。每篇標明哪些有研究支持、哪些只是教練共識。
- 描述 en：For climbers who have just started leading: why a route that goes on top-rope falls apart on lead, how to practise falling in measured steps, how to handle fear of failure, competition isolation and observation time, then onsight and redpoint tactics, picking conditions for friction, and finally skin care. Each post separates what research supports from coaching consensus.

## 目標讀者

拿到岩館先鋒卡、或剛爬完第一條戶外運攀的台灣攀岩者：頂繩能爬的線換成先鋒就抓死、不敢放手，或開始想 project 一條線卻不知道怎麼排嘗試。不寫給：還沒學先鋒確保的人（先讀〈岩館先鋒〉）；焦慮症、創傷後的處理（文中指向專業協助）；賽事規則全貌（K 賽事系列）。

## 入口

order 0 是總覽：同一條線頂繩爬得上、先鋒就不行，研究看到什麼（中級者先鋒焦慮升高、動作變僵、視線鎖在手點；進階者沒差），恐懼分成「怕摔」和「怕失敗」兩種，以及系列每篇解決哪一個問題。從〈攀岩卡關該開始訓練嗎〉的「心態」分支接手，不重做三步診斷。

## 弧線

總覽（先鋒為什麼可怕）→ 怕摔：墜落練習 → 怕失敗：表現焦慮 → 比賽心理 → onsight 與 flash → redpoint 與 project → 攀爬時機與條件 → 皮膚保養

排序原則：動機先於抽象（先處理新先鋒者最先撞到的恐懼，再談戰術）；心理在前、戰術在後，因為 onsight／redpoint 的「投入」需要先能控制焦慮；一篇一個新核心概念；條件與皮膚放最後，因為它們決定 redpoint 篇「哪天、試幾次」；有研究的寫研究、只有教練共識的明講「沒有對照研究」；學派矛盾並列不選邊；生理數字與研究設計放 `<details>`。

## 斷崖處理

- 0→1：總覽只講「為什麼怕」與研究，墜落篇才給方法；墜落「機制」（在哪練、BMC 三步、怎麼掉）已在〈岩館先鋒〉，墜落篇開頭一句連回，不重寫。
- 1→2：用 Lumby 2026／Findlay 的分類橋接：很多人摔得下去，怕的其實是失敗和被看；從人身恐懼轉到表現焦慮。
- 2→3：同一套例行程序與重新詮釋，搬到比賽的限制條件（隔離區、只能看不能摸、只有一次 onsight、觀眾）。
- 3→4：從心理轉戰術。onsight 是「控制焦慮＋讀線＋投入」同時上場的地方；讀線基本功（Sanchez 2012、BMC 清單、甩手）已在〈休息、讀線與自己定線〉，onsight 篇只補新證據與投入策略。
- 4→5：用同一條線 onsight 與 redpoint 的生理差異（PMID 32547440）引出「練過的線為什麼比較省力」。
- 5→6：redpoint 篇的「送線那一次」排在哪天，引出條件篇；摩擦機制（止滑粉、露點）在條件篇才講，redpoint 篇只留一句連結。
- 6→7：摩擦的另一半是皮膚；條件篇結尾用「濕熱讓手汗多、皮膚軟」引出皮膚篇。
- 比賽：獨立成 order 3，只寫心理與臨場戰術（隔離區、觀察時間怎麼用、嘗試次數、計分改制帶來的策略）；規則全貌以純文字提到攀岩賽事系列，規則細節連 World Climbing 官方規則。

## 篇目與範圍卡

共用規格：教學口吻（範本：〈岩館先鋒〉、〈攀岩訓練〉系列）；每節至少一個「今晚就能做的動作」；文末「練習題：N 個情境」3–5 題，答案用 `<details>` 收合；每個建議標出證據等級（研究／教練共識／推論），暴露治療等非攀岩研究的轉譯明寫「推論」；樣本數與研究設計附在數字旁；不給單一次數或年資門檻，並列各家說法；onsight、flash、redpoint、project、beta、flapper 以英文為主、首次出現附中文解釋，不用「視攀」「閃攀」「冲坠」等中國用語；墜落用「墜落／先鋒墜落」；止滑粉、液態粉沿用台灣說法；需要醫療處（手汗用藥、傷口感染、焦慮症）請看醫師或心理師；中英同步；每篇有 `.work/reviews/<slug>.md`（post-verify／post-review／post-polish）。

| order | slug | 主題 | 聚焦問題 |
|---|---|---|---|
| 0 | 2026-10-19-climbing-mental-tactics-overview | 先鋒為什麼比頂繩可怕 | 同一條線頂繩爬得上、先鋒就抓死，是哪裡出了問題？ |
| 1 | 2026-10-19-climbing-fear-of-falling | 怕摔：墜落練習 | 怎麼練墜落才會越練越不怕，而不是越練越怕？ |
| 2 | 2026-10-19-climbing-performance-anxiety | 怕失敗：表現焦慮 | 摔得下去，卻怕失敗、怕被看，紅點時腿抖，怎麼辦？ |
| 3 | 2026-10-19-climbing-competition-mindset | 比賽心理 | 隔離區、幾分鐘觀察、只有一次機會、台下有人看，怎麼準備？ |
| 4 | 2026-10-19-onsight-flash-tactics | onsight 與 flash | 第一次爬一條線，看多久、看什麼、什麼時候該拚？ |
| 5 | 2026-10-19-redpoint-projecting-tactics | redpoint 與 project | 怎麼挑 project、一天試幾次、休多久、什麼時候換線？ |
| 6 | 2026-10-19-climbing-conditions-friction | 攀爬時機與條件 | 為什麼同一條線有時很黏、有時很滑？台灣哪幾個月、哪種天氣適合拚？ |
| 7 | 2026-10-19-climbing-skin-care | 皮膚保養 | 手汗、裂皮、flapper 怎麼處理，皮膚怎麼決定一次能試幾回？ |

### 範圍卡

- **order 0**：講先鋒 vs 頂繩焦慮的研究（Aras & Akalan 2014、Giles 2025、Swinarska 2025；Fryer 2013 進階者沒差；Baláš 2017 潛在墜落越長壓力荷爾蒙越高）、焦慮讓動作變僵與視線鎖死（Pijpers、Nieuwenhuys）、焦慮也可能是助力（Hardy & Hutchinson 2007、Sanchez 2010）、兩種恐懼（怕摔／怕失敗）、系列地圖。不講方法（order 1–2）、不重做技術／心態／體能三步診斷（連〈攀岩卡關該開始訓練嗎〉）。讀完後讀者能說出自己先鋒卡住主要是怕摔還是怕失敗，並知道下一篇讀哪篇。
- **order 1**：講漸進暴露的原則與自我監測（抓繩、憋氣、閉眼 → 退一級：Findlay、Ilgner、Lattice 共識）、「量」派 vs「劑量」派（MacLeod vs Findlay／Ilgner）、微外傾 vs 垂直地形並列、確保者的角色與信任、暴露治療的轉譯（Craske 2014：換牆、換岩館、換確保者、摔前說出「我很怕」，標明推論）、沒有墜落練習 RCT、什麼情況先找專業協助（Hafer 2025）、台灣課程（百合搖滾墜落與心理課）。墜落機制連回〈岩館先鋒〉。讀完後讀者能排出自己的墜落練習階梯，並知道什麼訊號代表該退一級。
- **order 2**：講怕失敗、怕丟臉與表現焦慮（紅點與日常）；焦慮壓低 vs 重新詮釋並列；測過的方法（動機式意象 Jones 2002、自我疼惜 Röthlin 2021、短的技術提示式自我對話）；例行程序；跟誰爬與鼓勵方式。比賽留給 order 3。讀完後讀者能為下一次難線嘗試寫出一套 3 步的嘗試前例行程序。
- **order 3**：講比賽情境的心理與臨場戰術：隔離區、觀察時間（先鋒 6 分鐘、抱石決賽每題 2 分鐘、望遠鏡與手寫筆記）、onsight 只有一次、觀眾；2025 起計分下 zone 先拿的策略、世界盃決賽第 6 次後幾乎無人完攀（僅決賽選手）；姚廷蓁訪談與台灣全國賽沿用國際規則。規則全貌以純文字提到攀岩賽事系列。讀完後讀者能為第一場地區賽寫出觀察時間的清單與賽前例行程序。
- **order 4**：講 onsight／flash 的差別與策略：看人爬勝過看影片勝過不看（Morenas 2021）、掃視越多不一定越好（Seifert 2017）、專家用「能做什麼動作」記點（Boschker 2002）、Gresham 依難度決定讀線深度、何時投入與何時保守（標明教練共識）、跟誰爬：crux 前短而具體的提示。讀線基本功連〈休息、讀線與自己定線〉。讀完後讀者能為一條接近自己極限的線做一份 onsight 計畫（休息點、crux、投入點）。
- **order 5**：講 redpoint 與 onsight 的生理差異（PMID 32547440）、挑 project 的難度（Hörst 10-4、80/20 vs 長期圍攻 vs Bechtel 金字塔並列）、拆段練、由上往下串、進步可能跳躍（Orth 2018）與轉移有限（Hacques 2022）、嘗試之間休息（Heyman 2009、Valenzuela 2015、Baláš 2016：休久一點而且要動；休息長度無研究）、繩伴輪流與 beta 分享。送線那天的條件連 order 6、皮膚連 order 7。讀完後讀者能為一條 project 排出 4 次 session 的嘗試計畫，並知道何時換線。
- **order 6**：講摩擦來自皮膚、止滑粉、岩石、鞋底四者；止滑粉研究矛盾與 Clarke 2024 調和（薄抹、刷點）；實驗室溫濕度 vs 教練露點法則並列（調和標明推論）；「鞋底 0–5°C 最好」查無實測；台灣季節表（基隆月均濕度 72–80%、東北季風與官方海岸警示、梅雨、颱風、春秋窗口、冬天轉關子嶺）、反潮、海蝕崖鹽分；岩館夏天怎麼挑時段。讀完後讀者能查天氣與濕度，判斷這個週末值不值得去龍洞拚 project。
- **order 7**：講手汗（醫療第一線氯化鋁與離子導入；Antihydral 的證據與禁忌；TFDA 全部藥品許可證資料集查無 Antihydral 或外用 methenamine 許可紀錄 → 寫「未查到許可紀錄」，不給購買管道）、液態粉利弊、裂皮與乾皮、繭要不要磨（磨平 vs 不過度磨並列）、flapper 剪掉 vs 貼回、傷口保濕 vs 風乾、皮膚有限時怎麼排嘗試（Hörst、Lattice、Schulte 共識）。指力與滑車韌帶傷害連 E 系列。需要診斷處請看皮膚科。讀完後讀者能處理一次 flapper，並為自己的皮膚狀況排一次不爛手的 session。
