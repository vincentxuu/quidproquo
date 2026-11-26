# 審稿紀錄：2026-10-19-climbing-shoes（中英共用）

日期：2026-10-19。工具：Groundlane MCP `web_fetch`（Climbing Ninjette 尺寸指南、OUTSiDERS 新手選鞋文、Climbing.com 換底指南、岩流工作室價目、HANCHOR 朱威保養文、DAV 安全研究文章）；PubMed 兩篇用 Groundlane 只回 HHS 擋頁（203），改用 NCBI E-utilities `efetch` 讀摘要（McHenry 2015、Buda 2013）；REI 指南 Groundlane 兩次逾時、firecrawl 額度用完，降級到 jina `read_url` 讀到全文；DAV 的 PSA 段落也用 jina 讀全文。toolDegradation：REI（Groundlane → firecrawl ✗ → jina ✓）、PubMed（Groundlane ✗ → NCBI API ✓）。

## post-verify

逐條對照本 session 打開的原文，約 45 條宣告（正文、三張表、練習題、tldr、description、glossary）。

🟢 Confirmed
- DAV：攀岩鞋屬運動裝備，「Vorschriften für Stabilität etc. gibt es nicht」；以保護為主的才是 PSA。
- REI：三種鞋型與各自適用地形、優缺點（平底好塞裂隙、鞋底厚硬腳感鈍；中度下彎可應付 slab、裂隙、微前傾，鞋底黏薄磨得快；侵略型大下彎、多半往大拇趾彎、腳跟張力大，塞裂隙與 smear 較差）；平底因舒適是新手到中級常見選擇；無內襯皮革最多撐約一號、會染色，有內襯半號以下、有些只在鞋頭加內襯；合成纖維撐不多、用久稍軟；綁帶／魔鬼氈／套鞋的比較；腳趾在關節微彎表現較好但要平放或舒服地彎、指關節不能痛苦地擠在鞋面；死空間讓鞋子在腳點上撐不住；踮腳時鞋跟不夾阿基里斯腱；綁帶鞋全鬆再從腳趾往腳踝拉緊；唯一確定的方法是試穿。
- Climbing Ninjette（2026-08-29）：三個檢查點（腳趾微彎頂前緣不折疊、腳跟不脫空且換款式比換尺寸有用、按壓沒有空洞且常見於腳背低或腳窄）；傍晚腳會腫、下午或運動後試穿；不要用「小兩號」公式、以貼合為準；網購挑可換尺寸的通路；合成纖維買當下就要合腳；新手誤判「會撐開」買了合成纖維緊鞋；租鞋穿襪、自己的鞋多數不穿、可穿薄襪、不要用厚襪填大鞋；不穿襪要拿出背包通風。
- OUTSiDERS（2022）：稍緊不痛，通常比平常小半號至一號；魔鬼氈是抱石最常見；綁帶常見於戶外與上攀。
- McHenry 2015（摘要）：56 人中 55 人鞋不合腳且過緊、91% 攀爬時腳痛、量尺實測平均小近 4 個英國碼、程度越高越傾向更緊（p<0.001）、橫斷面設計。Buda 2013（摘要）：144 人、平均小 2.3 號、義大利 Rizzoli。
- Climbing.com／Pauwels：90% 磨耗在大拇趾區、出廠約 4 mm、薄到像紙就送修、很多人看整片鞋底看錯地方；包邊約 2 mm、有洞要補鞋頭、補鞋頭要連半底一起換（包邊有一部分包在鞋底下）；從小趾捏到大拇趾、軟點像針頭到鉛筆橡皮擦；照顧好的性能鞋可換 3–4 次。
- 岩流工作室（2026-10-19）：半底 NT$1,500／雙、全底 NT$2,000／雙、鞋頭補強 NT$450／處且通常搭配半底或全底；建議磨薄但未磨穿包邊前送修，費用較低、較能保留鞋型；有台灣送修流程。
- HANCHOR 朱威：一週 2–3 天、一雙約八個月到一年；踩點細膩度與動態影響磨耗；鞋身變形會淘汰；濕抹布擦、攀岩粉讓鞋太乾而硬化；避免高溫與車上；洗後陰乾。

🔴／🔵 修正（已改，中英同步）
- tldr「『要小幾號』各家說法從半號到一號都有」→ 只有 OUTSiDERS 給半號到一號，Ninjette 是反對公式（🔵 把一個來源說成「各家」）。改成「台灣媒體寫小半號到一號，也有作者說不要套公式；研究量到的平均差距更大，但那是大家實際穿的緊度，不是建議」。練習題 4 答案同樣改成「OUTSiDERS 寫的是小半號到一號」。
- 試穿檢查點 1 歸給 Ninjette 的「指關節沒有痛苦地擠在鞋面上」其實是 REI 的句子；改回 Ninjette 原意「不會整根折起來、指甲頂著鞋壁發白」，REI 的指關節句併入後面的 REI 說法。
- glossary「侵略型」context「多半只在短而難的路線上穿」→ REI 原文是單繩距運攀與岩館路線、不是一整天的多繩距，照原文改。
- 價目表「全底｜適用」原寫「依鞋款結構與磨耗範圍判斷」，那是判斷方式不是適用情況；補上原文的「鞋底大範圍磨耗或橡膠老化」。
- 練習題 3「整片鞋底看起來還有紋路」→ 攀岩鞋鞋底是平滑橡膠、沒有紋路，情境不成立；改成「整片鞋底看起來還很厚」。
- 能換幾次底：Pauwels 說 3–4 次，岩流工作室 FAQ 說沒有固定次數。依使用者決定「原廠／業者說法不同就並列」，在價目表後補一句並列。
- 參考資料 OUTSiDERS 補年份 2022（文章本身含品牌業配，本篇只取通則句，標題不帶型號）。

🟡 Unverifiable（未寫入／維持原寫法）
- 西班牙 2025、土耳其 2025 兩篇鞋子研究：本篇沒有引用，維持不引用（本 session 未開）。
- 「這些都是橫斷面研究」：McHenry 摘要明寫 cross-sectional；Buda 是單一時段的檢查研究，性質相同，維持。
- REI 對 Groundlane 與 `check:links` 回 403／逾時，jina 讀得到全文，連結有效。

本次只檢查了文中已提出的約 45 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:links` 9 條外部連結 0 壞（REI 403 為擋機器人，jina 已讀到）；`check-post-quality` 中英兩檔無 blocking，WARN：tag `beginner`、`bouldering` 沒在內文找到明顯對應詞——內文有「新手」「抱石」，保留；`check:tw` 0 blocking、0 review；`check:references` 見下。`astro check` 未跑，交給 commit gate。
- frontmatter：必填齊全；tags 5 個，皆為 climbing 分類既有高頻 tag 或本系列共用 tag ✓；type: guide 符合；description 與 tldr 不重複；glossary 四條與正文一致（修正後）。
- 衍生內容：tldr 的歸屬已修（見上）；NT$1,500 與正文、價目表一致；「無內襯皮革最多撐開約一號」與 REI 一致。
- 結構（guide）：情境開場 → 與第 0 篇銜接（不是 PPE、只能靠合腳）→ 鞋型 → 試穿三點 → 小幾號 → 材質 → 開合方式 → 襪子 → 換底 → 保養 → 練習題（details）→ 下一步 ✓。開頭三雙鞋的情境在試穿與練習題 1 回收。
- 主題歸屬：腳法轉到〈攀岩腳法〉、緊鞋傷害與研究細節轉到傷害系列〈腳與攀岩鞋〉，本篇只留研究的尺寸數字與一句因果但書 ✓。沒有連到平行的新系列；沒有提抱石墊；沒有型號推薦。
- 跨節指代：「照上面三點」「上一節的三個檢查點」都指向〈試穿時看三個地方〉✓。
- 台灣讀者位置：開頭是店內試穿情境；台灣媒體 OUTSiDERS 的說法與台灣換底價格都在正文 ✓。

## post-polish

- register-scan（zh）：長句 2 句 >60 字（開場三雙鞋、包邊檢查法），都是一個完整動作，保留。但書 6%、引述區塊 0、姓名當主詞 0、模板化轉折 0、英文術語 0。數字密度 1 段（研究實測兩篇的數字），是讀者判斷「小幾號」要用的數字，保留。
- phrase ledger：0 命中。
- 可執行動作：三處「今晚就能做的動作」（看自己常爬的牆、用三點檢查租鞋、翻鞋底捏包邊），練習題四題都在 `<details>` ✓。新增的並列句 55 字內。中英同步修改。

## 2026-10-24 更新審稿

範圍：只審 2026-10-24 加入的內容（description／tldr 增句、「要小幾號」補三條原廠尺碼建議、「現行型號：11 款」四張表與說明、「實測與心得影片」12 支、下一步改指粉袋、更新紀錄、參考資料新增 6 條）。中英兩檔：`src/content/posts/climbing/2026-10-19-climbing-shoes.md`、`-en.md`。審稿者沒有參與寫稿。日期：2026-10-24。

工具降級（toolDegradation）：Groundlane MCP `web_fetch` 回「server not connected」→ 原廠／評測頁改用 curl 抓 HTML（Shopify 站另抓 `.js` 產品 JSON 讀價格），本地去標籤後 grep；La Sportiva 歐洲站 curl 回 403 → jina MCP 也未連線 → Exa `web_fetch_exa` 讀到全文。影片字幕用研究的 `tmp-shoes/yt/*.vtt`（朱威那支用 `whisper/Sc0M-vOaeyQ/transcript.raw.vtt`），說明欄用同目錄 `*.desc.txt`，標題／頻道／上傳日對 `meta.txt`、`meta3.txt`。

### post-verify

本 session 重開原始來源核對 41 條：🟢 Confirmed 37、🔴 Contradicted 1（已修）、🟡 Unverifiable 1（已拿掉）、🟠 Outdated 0；另 2 處揭露／歸屬不完整（已修）。

🟢 Confirmed（原廠頁，2026-10-24 重抓）
- Tarantulace：USD 99；美國站 Unlined、5mm FriXion RS；歐洲站「FriXion Black 4mm」、Lining「Front section only: sweat absorbing insert」（Exa）。
- Finale：USD 139；美國站 Unlined、5mm Vibram XS Edge、文案「slight downturn」；歐洲站「The last is neutral」（Exa）。
- Momentum：USD 129.95；「Micro suede upper will mold to foot shape, but won't stretch」；Black Label 沒寫厚度（UKC 影片口述 4.3 mm，文章沒寫，不算錯）。
- Origin：美國站 USD 129、雙魔鬼氈（Dual power strap）、1.8mm Suede、Vision 5mm、PROFILE Flat。
- Defy：USD 119、3.5mm TRAX SAS、「Slight camber」；Evolv 原文「Evolv shoes are not designed to be downsized」、Max Performance＝街鞋尺寸、Comfort 加 1–1.5 號；Defy LV 頁存在。
- Klimb V2：Simond 英國站 GBP 59.99；迪卡儂加拿大站「XS Grip Vibram 4 mm」、內襯聚酯、「If you are new to climbing, we recommend choosing your street shoe size」，進步者可小半號到一號。
- Up Mocc：USD 134.50、4.2mm RH、Unlined leather、Fit: Moderate-Asymmetric。
- Kubo：USD 169（另有一個特價變體 67.60，原價 169）、Dual hook-and-loop、Unlined、男款 4mm XS Edge、女款 4mm XS Grip2、女款中底 0.8mm（男款 1.1mm）、「light downturned shape」。
- Veloce：USD 159；文案「Relaxed, neutral last」、規格表 PROFILE「Moderately Downturned」、S-72 4mm；歐洲女款頁「a slightly downturned shape」。
- Skwama：USD 219；美國站 Unlined、4mm XS Grip2、「aggressive downturned shape」；歐洲站「Lining: Dentex in the back」、「Vibram XS Grip2 3,5 mm」（Exa）。
- Instinct VS：USD 219；「minimal stretch」、PROFILE「Moderately Downturned」、男款前掌 XS Edge 3.5mm；女款 XS Grip 2、lower-volume。
- 台灣通路：登山補給站 Momentum、Defy 商品頁與迪卡儂台灣 Klimb V2 頁都打得開、品名對得上。

🟢 Confirmed（評測頁）
- OutdoorGearLab（Updated July 9, 2026）：Finale「Not great for overhanging boulders」；Skwama「Unlined leather stretches out relatively quickly」；Instinct VS「Toe angle is likely too aggressive for newer climbers」。
- Switchback（Last Updated May 28, 2026）：Tarantulace「Roomy fit lacks precision; outsole rubber isn't particularly sticky」；Kubo「Pricier than many true beginner offerings」；Up Mocc「Tough to dial in a good fit」；Veloce「Expensive and not all that versatile」。Switchback Skwama 單篇評測「Insecure on small edges and pockets」。
- Treeline（September 15th, 2026 updated）：Origin「reviewers reporting rubber peeling and sewing issues」；Momentum 的 Black Label「didn't work as well as other shoes on edging」；Defy／Elektra 合併條目缺點「Synthetic material retains odors」。

🟢 Confirmed（影片，12 支：URL、標題、頻道與 meta 一致，全部 2020 年後；起播點對字幕）
- ZBBPScrWUdM：鞋底兩雙都 5 mm、XS Edge 較黏較耐磨、Tarantulace 磨得多、可能因腳法進步；5:5x 結論新手選 Tarantulace。說明欄無贊助。起播見下方修正。
- --OL6Z8zA8c：2:08 起照街鞋 40.5 穿襪、腳跟變鬆、能穿 38.5、「They will stretch a lot」。無贊助。
- N7hElzY6ToQ（2023-12）：13:58 起戶外 Tarantulace 最有信心、室內大體積點硬鞋不如軟鞋；片中 Momentum 為 knit upper 且「are used」。說明欄 Backcountry 連結，未寫是否聯盟 ✅。
- 6URhOnWcI-4：2:25 起「bears little resemblance to reality」、街鞋約 43、穿 39.5；開頭 Black Label 厚、耐磨、室內較不敏感。無贊助。
- 0dOSsl1dga0：說明欄寫 Margalef 石灰岩；1:59 起街鞋尺寸穿襪仍偏大、建議小半號到一號；3:08 起鞋頭偏尖、精準。說明欄導購 EpicTV Shop ✅。
- iiWDuGWdTI8：1:29 起高、低容積、小一個 UK 碼；用了兩年、室內主力；3.5 mm S72。無贊助。
- EC2oGMkz2Pc：確認評的是 Unparallel Up Mocc（說明欄開頭提到 Five Ten NIAD Mocc 是對照）；1:10 起剛穿偏硬、無內襯會貼合；3:03 起平楦、中度不對稱、寬度可能偏窄、要試穿、小 1.5 UK 號。
- JIPC__JZgJ8：0:03「totally unsponsored … Scarpa did send me the shoes」✅；女款；2:48 最軟；3:50 合成幾乎沒撐；5:17 戶外鞋頭鞋跟膠薄會痛。
- CnGuRL6wBh4：0:13 La Sportiva 寄送 10 週年版；4:51–5:25 垂直到微前傾好、很陡不如 Solution Comp；7:24 原廠說男女款鞋型沒差。
- Sc0M-vOaeyQ（無字幕，Whisper 轉錄）：2:29 起選 Skwama 因楦頭較寬、腳跟包覆；4:22 起內側硬片剛穿會痛；7:25 起腳趾微彎看前後空隙、有空隙試小半號、很彎還有空隙就換一雙；8:30 提到試穿店家。說明欄只有與鞋無關的 Myprotein、白蘭氏折扣碼 → 文中「說明欄沒寫鞋子的贊助關係」正確。
- oOxxZWc09_M：zh-TW 字幕；3:02 起依腳型選、不是新手就一定平底；7:32–7:58 踮腳痛到不敢出力就是太小、寧願先大一點；10:06 硬鞋四個月破洞、軟鞋兩個月；說明欄「場地提供 Dapro」「協同台港攀岩品牌共同經營」✅。
- pn9UhVdjG-A：0:33 起小兩號痛到不想爬、第二個錯是街鞋同號撐開太大；7:01 起不必一開始買 200 美元的鞋、第一雙是 Momentum。說明欄只有一支影片連結，無贊助。

🔴 Contradicted（已修，中英同步）
1. 「Black Diamond … 追求性能的穿法最多小兩號」→ BD 原廠頁：「Highest performance fit: Subtract 2–2.5 EU sizes」、All-day performance 1.5–2、comfort 0.5–1。改成「最貼的性能穿法要小 2 到 2.5 號」／en「2 to 2.5 sizes down for the tightest performance fit」。

🟡 Unverifiable（已處理）
2. Scarpa Origin「歐洲站 4 mm Vibram XS Edge」：連結 `scarpa.com/products/origin-the-first-rock-climbing-shoe-70094-000-1` 今天 301 轉到 `/collections/climbing-shoes`，規格無法再核對；研究筆記 `specs-notes.txt` 也記這頁是舊價格的 legacy page。拿掉歐洲站連結與該規格，只留美國站 5 mm Vision（錯的連結，依權限直接修）。

揭露／歸屬修正（已修，中英同步）
3. Connective Climbing（CnGuRL6wBh4）說明欄除了粉袋折扣碼，還有多條攝影器材的 amzn.to 連結 → 補「和攝影器材的 Amazon 連結」。
4. 日光山石：講者不是李虹瑩。說明欄寫「特別來賓｜張紋」，字幕 0:3x「我是張紋」；李虹瑩是頻道經營者之一 → 改成「日光山石是李虹瑩等台灣攀岩選手經營的頻道，這集請來賓張紋講選鞋」。

其他已修
5. ZBBPScrWUdM 起播：鞋底段從 3:52 開始，原 `start: 240`（4:00）切在句子中間 → 改 `start: 230`、內文「3:50 起」（中英）。

### post-review

- 結構：新增段落放在「襪子」之後、「什麼時候該換底」之前，順序是判準 → 型號表 → 影片 → 換底／檢查 → 練習題 → 下一步，符合寫稿規格；型號表每節前有引導句，表後有「今晚就能做的動作」。✅
- 中英對應：12 支影片 ID 與 `start:` 完全一致；價格與 mm 數逐一比對一致（腳本抽出兩檔的 USD／GBP／mm 序列相同）；本次修正都兩檔同步。✅
- 系列連結：plan.md order 2 是 `2026-10-24-climbing-chalk-bag`，中文連 `/posts/climbing/2026-10-24-climbing-chalk-bag`、英文連 `-en`，兩個檔案都存在。✅
- `pnpm -s check:references`：與本篇有關的錯誤 0。`pnpm -s check:tw`：0 blocking、0 to review。
- frontmatter：description 新增型號品牌清單，tldr 新增 BD／Evolv 方向相反一句，與正文一致（BD 修正後 tldr 只寫「叫你買小」，仍成立）。
- 小問題（未改）：「要小幾號」清單中，原有兩條與新增兩條之間有一個空行，Markdown 會渲染成兩個清單；內容沒錯，排版可再合併。

需要人判斷（未改）
- Scarpa Origin 現在只剩美國站規格；表格說明寫「有衝突的地方都寫明出自哪一站」，Origin 已不屬於衝突例。要不要另找 Scarpa 歐洲現行頁補回，或維持現狀。
- Momentum 大底厚度：表格寫「原廠沒寫厚度」屬實，但 UKC 影片口述 4.3 mm；要不要在表格補「UKC 實測說約 4.3 mm」。
- Evolv Defy 的缺點「合成鞋面容易留味道」：Treeline 把 Defy 與 Elektra 合成一個條目，缺點欄寫「Synthetic material retains odors」，但內文那段點名的是 Elektra；保留或改成「Treeline 對 Evolv 合成鞋面的評語」。
- Nate Mitka 影片的 Momentum 是舊版 knit 鞋面二手鞋，文中已註明；要不要因為不是現行款而換掉。
- Simond Klimb V2 沒有媒體評測也沒有影片，收錄理由是預算與台灣實體店可試穿；與其他篇（Simond Rock 頭盔等）同一判斷，看稿時一起決定。
- Kubo 鞋面文章寫「微纖維＋麂皮」，美國站規格寫「microfiber / Leather」；麂皮是皮革的一種，未改，看要不要改成「皮革」。

### post-polish

`register-scan.sh`（zh，修正後）：
- 長句 8 句（63–75 字），新增段落佔 6 句：表格說明「挑選依據是…」、「沒收的：…」、Nate Mitka、Up Mocc、Veloce「2:30 起…」、朱威。比例低於 10%，未達處理閾值；若要順，最值得斷的是朱威那段（75 字）與 Veloce 段（72 字），各在第一個逗號後斷句即可。
- 但書 9%、引述區塊 0、姓名當主詞 0、模板化轉折 0、一般英文術語 0。
- 數字密度：新增段落 7 段落在 4–5 個數字，全部是影片起播時間碼（mm:ss）加一個尺碼或年份；起播時間是讀者要用的導航，維持。只有 Up Mocc 段 5 個（1:00、3:00、1.5 號等），可把「前面 1:00 起講…」那句搬到段首，讓時間碼依序出現，讀起來比較不跳。
- `scan-ledger.sh`：0 命中。
- 英文版：日光山石那句改寫後句型與中文一致；其餘修正只換數字與起播時間。
