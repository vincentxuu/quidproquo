# 審稿紀錄：2026-10-24-climbing-rope（攀岩裝備 order 8，拆自 rope-belay-device）

檔案：`src/content/posts/climbing/2026-10-24-climbing-rope.md`、`-en.md`
日期：2026-10-24（獨立審稿，未參與寫稿）
研究線索：`.work/climbing-gear-models/R-rope.md`、`tmp-rope/`（字幕、說明欄）。研究檔只當線索，下表每條都重開原始來源。

工具降級（toolDegradation）：Groundlane MCP 回「needs you to sign in again」→ 不再重試；jina、firecrawl 未連線；Tavily extract 對 UIAA 逾時。實際使用：
- curl：BD Shopify `.js`（變體價格與庫存）、BD 產品頁（規格）、Mammut US 產品頁 JSON-LD（逐一試出 60 m／40 m 的型號編號，例如 9.8 Crag Classic 60 m＝2010-05860、40 m＝2010-05840）、Sterling BigCommerce `remote/v1/product-attributes`（逐色逐長度查價）、Beal 與 Edelrid 產品頁變體資料、馬布谷搜尋頁、UIAA 101 圖解 PDF（圖片型 PDF，轉 PNG 目視讀表）。
- Exa `web_fetch_exa`：OutdoorGearLab 總表與 BD 9.9 評測、GearJunkie、Switchback、BD 選繩指南、Mammut 保養頁。
- UIAA 2014 防水繩公告：官網 curl／Exa／Tavily 都逾時 → Wayback Machine 2025 快照讀全文。
- 影片：研究目錄已有字幕與說明欄的直接讀；fZIj5HAV8xA、JnNA4mLqwtQ（從舊合併文帶過來、研究目錄沒有字幕）用 `yt-dlp --cookies-from-browser chrome` 重抓字幕與說明欄。

## post-verify

### 規格與價格（全部 2026-10-24 重查，原廠頁）

| 宣稱 | 來源 | 結論 |
|---|---|---|
| BD 9.9：40 m USD 139.95、60 m 199.95、70 m 219.95（70 m 缺貨）；Sheath Mass 34%；有中點 | BD `.js`＋產品頁 | 🟢 數字對；🔴 框架錯，見下 |
| Mammut 9.8 Crag Classic 61 g/m、40%、8 次；60／70 m 199.95／229.95；有 40 m（129.95） | Mammut US | 🟢 |
| Mammut 9.5 Crag Classic 58 g/m、42%、6 次；184.95／219.95 | Mammut US | 🟢 |
| Mammut 9.5 Crag We Care Classic 58 g/m、42%、6 次；184.95／219.95 | Mammut US（60 m 2010-06150、70 m 2010-06160） | 🟢 |
| Mammut 9.5 Crag Dry 60 g/m、40%、8 次；UIAA dry test 1.5%（≤5%）；264.95／304.95 | Mammut US | 🟢 |
| Crag Dry「這張表裡最貴的一款」 | 同上＋Sterling：Velocity XEROS 70 m 323.99 比 Crag Dry 304.95 貴 | 🔴 已改 |
| Sterling VR9 9.8：35%、62 g/m、6 次、DryCore（只處理繩芯）、40 m 沒中點、60／70 m 189.99／219.99 | Sterling 產品頁＋變體 API | 🟢 |
| Sterling Velocity XEROS：35%、62 g/m、6 次、60 m 以上有中點、70 m 323.99 | 同上 | 🟢 |
| Velocity XEROS 60 m USD 267.99 | 變體 API：Olive Drab 267.99，Blue／Green 278.99 | 🔴 部分（依顏色）→ 改「267.99–278.99（依顏色）」 |
| Beal Booster III：61 g/m、42%、6 次（實驗室 8 次）、Dry Cover、Unicore；60／70 m EUR 210.12／245.14 | Beal 產品頁 | 🟢（Anise／Blue 色；Metal 色 189.11／220.62，見需要人判斷） |
| Edelrid Boa 9.8：62 g/m、40%、7 次、有中點；40–80 m；60／70 m EUR 165／185 | Edelrid 產品頁變體 | 🟢 |
| Edelrid Python 10：64 g/m、38%、8 次；原廠寫「entry-level rope」；30–80 m；EUR 170／190 | 同上 | 🟢 |
| Beal Virus 10：63 g/m、37%、7 次；衝擊力保證 7.4 kN（表內最低，Booster 7.5、We Care 7.7）；EUR 166.01／193.69；原廠頁沒寫中點與防水 | Beal 產品頁 | 🟢 |
| Beal Karma 9.8：33%、5 次 | Beal 產品頁 | 🟢 |
| 馬布谷有 Karma 9.8、Booster III 9.7、Zenith 9.5、Top Gun II 10.5 | mabuvalley.com 搜尋 | 🟢 |
| 「BD 9.9 外皮比例是本篇最低」（正文＋tldr） | 同篇寫了 Karma 33% | 🔴 已改「比上表每一款都低」 |

**BD 9.9 的「便宜」框架（指派重點）**：🔴 Contradicted。原標題「知道它便宜在哪」、結論「預算最緊，它可以用」、情境段「預算最緊才考慮 BD 9.9」都以「便宜」為前提，但原廠價：40 m 139.95 比 Mammut 9.8 Crag Classic 40 m（129.95）、Sterling VR9 40 m（129.99）都貴；60 m 199.95 與 9.8 Crag Classic 同價，比 9.5 Crag Classic（184.95）、VR9（189.99）貴。已把框架改成「沒有比較便宜，外皮比例又最低」，補價格比較，結論與情境段改成陳述事實（見直接修改 7–9）。保留型號，要不要整段拿掉列在需要人判斷。

**10-23／10-24 標示（指派重點）**：表內原本 6 款標 10-23（沿用旅行繩研究），本次全部重查，數字除 Velocity 60 m 外都相符，所以全部改標 10-24，並刪掉「標 10-23 的沒重查」那條說明。

### 評測宣稱（指派重點：寫稿者沒重開的 OGL／GearJunkie／Switchback）

| 宣稱 | 來源 | 結論 |
|---|---|---|
| OGL 2026：9.5 Crag Classic 首選（Best Overall；We Care 段稱它 Editors' Choice）；中點很快磨掉 | OGL 總表（2026-08-19 更新） | 🟢 |
| OGL：Crag Classic 會吃髒 | OGL BD 9.9 評測頁「doesn't have a dry treatment so more easily absorbs dirt」 | 🟢 |
| OGL／GearJunkie／Switchback 2026 都把 We Care Classic 列最划算 | OGL Best Budget；GearJunkie（2026-05-14）Best Budget；Switchback（2026-05-27）Best Budget | 🟢 |
| Switchback 2026：Crag Dry 首選 | Switchback Best Overall | 🟢 |
| OGL BD 9.9：用得不算多外皮就變軟、最適合岩館先鋒 | OGL BD 9.9 評測（2026-08-19） | 🟢 正文；🔵 tldr 寫成「只適合岩館」，原文是「best suited」→ 改「最適合岩館先鋒」 |

### 標準、指南、保養

| 宣稱 | 來源 | 結論 |
|---|---|---|
| 繩型標示（EN 892 耐用標籤帶、UIAA 101 可直接印）、標籤內容 | UIAA 101 圖解 p.1 | 🟢 |
| EN 892 表：80／55／80 kg、≤12／8／12 kN、5／5／12 次、靜態 ≤10／12／10%、動態 ≤40%；滑移 ≤20 mm；2.3 m、2.5 m、5 mm 半徑 | UIAA 101 圖解 p.1–2 | 🟢 |
| UIAA 2014：輕度磨損（相當幾天使用）、泡水 15 分鐘、≤5%、未處理約 50%、處理不足 20–40%、Beal：只做表面處理過不了 | UIAA 公告（Wayback 快照） | 🟢 |
| BD：單繩 8.8–10.2 mm、半繩雙子繩多半 <8 mm、7.4 mm 雙認證要兩條一起用、靜力繩用於上升拖吊、60／70／80 m 用途、70 m 是現在岩場與多繩距標準、9.5+／9.4／8.8 以下三段、dry 增加耐用並可用於結冰 | BD 選繩指南 | 🟢 |
| Mammut：墜落係數超過 1.0 繩子就受損；設計承受最多五次係數 1.7 | Mammut 保養頁（2025-12-22 更新） | 🟢 |
| 馬布谷動力繩說明、DAV 2010 動態性能隨老化下降 | 舊合併文帶過來的內容 | 🟡 本次未重開 |
| GRIGRI 8.9–10.5 mm、Giga Jul 上限 10 mm | 屬確保器篇範圍 | 🟡 本次未重開（交確保器篇審稿） |
| 美國登山協會「下放事故一半以上是繩尾滑出」 | 轉引〈戶外確保〉 | 🟡 本次未重開 |
| Mammut 9.8 Crag Classic「耐磨中點」、Duodess 70／80 m | R-rope 線索 | 🟡 本次未重開 |

### 影片（字幕逐支對過）

| 影片 | 起播 | 結論 |
|---|---|---|
| HowNOT2 fZIj5HAV8xA（2022-02-09）Gym Climbing Forces | 1:40 | 🟢 1:43 起戶外岩館三個 LineScale；climber 峰值 2.64（Ben 的資料 2.92、兩年前 2.43）；6:07「I pulled Andrea up…soft catch」；9:16「backyard science」；10:09 他說 UIAA「7 falls」、1.8 係數，與表的 5 次門檻不同；10:48「fall more than seven times…not have to replace it」。說明欄有自營商店連結（文中頻道介紹已寫）。 |
| Hard Is Easy JnNA4mLqwtQ（2024-10-08） | 27:23 | 🟢 說明欄章節 27:23 UIAA Water Repellent；磨毛、24 h 調濕、2 L/min 淋水不浸沒、15 分鐘、甩乾秤重；31:25「treated…doesn't mean it passed UIAA water repellent」。說明欄沒有贊助字樣，在 Mammut 實驗室拍攝由片中可見。 |
| Hard Is Easy ncUGR2JbefY | 7:26 | 🟢 7:35 9.5 vs 9.8 三分之一毫米；8:28 戶外甜蜜點 9.5、9.2 很快要剪；8:50 岩館粗繩較耐用；10:02 單繩距建議 80 m、10:26 岩館約 40 m 先問牆高；12:44 dry 明顯較貴、只在岩館不需要；16:39 繩端最先壞、17:02 捏繩檢查。說明欄聯盟連結與感謝 Mammut 相符。 |
| Hard Is Easy quB-KEsqJNU | 6:29 | 🟢 80 kg、Mammut 自行設計非標準測試（2:30）、乾淨未處理約 200 次、乾淨 dry 約 600 次（6:52）、髒的部分 50 次就起毛（4:06–4:33）。🔵「同一條髒繩洗過後明顯耐磨」：12:26 的 dry 繩洗與不洗差異很小，13:44 起未處理繩才差很多 → 已改，情境段同步改。 |
| EpicTV Ft9ac3u3z3o | 0:27 | 🟢 0:50 岩館繩 9.5–11 mm、耐用便宜；Virus 未處理；3:33 岩館多 30–40 m；5:09 選粗、岩館不必防水、放繩袋；三條都在 EpicTV shop 賣（揭露相符）。 |
| UKClimbing YGkUnYjht2E | 0:26 | 🟢 0:26 趨勢往 9.5、9.7 好握好控制；1:13 9.2／9.5 很快磨壞、9.7 以上耐用；1:37 晶片、2:01 剪繩保留晶片端。說明欄未說明樣品來源（文中已寫）。 |
| JB Mountain Skills 9q-8BKtz2LM | 8:16 → 8:08 | 🔴 起播落在句中（8:16「of funny patterns…」），We Care 段 8:09 開始 → 改 `start: 488`、文字 8:08。其餘 🟢：We Care 磨得快一點、£135、9:10「9.8 for me in 2026…too thick」、買得起選 dry、60 m 在英國最全能、兩端先壞；11:52「a shop like Outside who support…」；說明欄 buy me a coffee。 |
| カモシカスポーツ ty8gquvk6bU | 0:26 | 🟢 兩段 5 g、泡水後 8 g 與 5 g；3:27 撥水讓外皮不易起毛；4:39 起 Unicore 示範與割外皮實驗（5:48–7:02）。店家頻道。 |
| HowNOT2 XlL7XFm0-Q4 | 0:00 | 🟢 授權經銷商、BD 包裝、車縫套環、BD 回覆不是他們的繩；3:12 很可能是 AliExpress 靜力繩；2:49 只是轉述；說明欄自營商店。🔵「片尾查那條繩附的證書編號」：10:40–11:25 查的是購物平台上同款商品頁附的證書，不是當事人那條繩 → 已改。 |
| 連結不嵌入：Sterling RUR9WpUfSJA、HP Reviews Rfnx5EY6txI、Nomads LKYoCCCVFgo（5:08）、香港攀爬樂園 Df1M-CEs_hw（5:57–6:22）、カモシカ bVZ7v1vipmM（0:24–1:10） | — | 🟢 定位、一年未剪、扭結與 core shot、剪短要 mark 長度、買時跟店員確認動力繩，都與字幕相符 |

小計：🟢 Confirmed 54 條（規格價格 15、評測 6、標準指南 6 組共 20 條、影片細項 13）；🟠 Outdated 0；🟡 Unverifiable 4（本次未重開，都是舊文帶來或屬他篇）；🔴 Contradicted 6（BD 9.9 便宜框架、BD 外皮「本篇最低」、Crag Dry「最貴」、Velocity 60 m 價、JB 起播、counterfeit 證書歸屬）；🔵 Misframed 2（OGL「只適合」、洗繩結論）。全部已修。

## post-review

- **機械檢查**：`check:tw` 0 blocking；`check:references` 只有 WARN「參考資料和標題關鍵詞重疊少」（舊合併文同樣有，屬既有通病，不擋）；中英 9 支 `start:` 一致、站內連結數一致、所有小數一致。
- **frontmatter**：title／date 2026-10-24／category climbing／type guide／series 攀岩裝備 order 8 ✅；tags 6 個皆既有 ✅；glossary 動力繩／靜力繩／衝擊力從舊文帶過，新增外皮比例、Unicore ✅。
- **tldr 與正文**：BD 9.9 兩處已同步修正（外皮比例、OGL 原意），其餘數字與正文一致 ✅。
- **結構**：開頭兩段（情境＋範圍與轉手連結）→ 六判準各有「今晚就能做的事」→ 型號表 → 影片 → 三種情況 → 檢查汰換（連 order 12）→ 練習題 4 題 → 下一步（order 9 普魯士繩）→ 延伸觀看 → 參考資料 ✅，與 plan.md 順序相符。
- **拆分完整性**：對照舊合併文〈2026-10-19-climbing-rope-belay-device〉的繩子部分：繩端標示、動力／靜力、衝擊力、EN 892 表與 details、HowNOT2 fZIj5HAV8xA（start 100）、繩長、繩徑 BD 三段、GRIGRI 細繩提醒（併入「繩徑要跟確保器一起看」）、Dry 與 UIAA 防水、Hard Is Easy JnNA4mLqwtQ（start 1643）、舊練習題 1（½ 繩）與 4（dry 冰攀）→ 新題 1、2；glossary 三條；頻道介紹 HowNOT2／Hard Is Easy；參考資料 UIAA 兩條、BD、Mammut、馬布谷、DAV 全部帶過來 ✅。無遺漏。
- **練習題 4 與確保器篇（指派重點）**：本篇題 4 是「只在岩館、朋友推薦 80 m 9.2 mm」，考繩長與繩徑；確保器篇四題是 11 mm 粗繩配 9–10 mm 確保器、8.7 mm 新繩配 GRIGRI、ATC Pilot 會自己鎖、GRIGRI 去多繩距。沒有重疊。舊文的兩題確保器題已在確保器篇（題 1、2），本篇沒有重複收。✅
- **站內連結**：全部 `/posts/climbing/<slug>`，英文加 `-en`；連到確保器、鉤環、普魯士繩、汰換、出國繩等篇的檔案都存在 ✅。
- **接縫**：刪掉 10-23 說明後，下一條「去那篇的大表」失去指涉 → 已改成直接連〈出國攀岩的繩怎麼挑〉（直接修改 4）。

### 直接修改（中英同步）

1. tldr：BD 9.9「外皮比例是本篇最低、OGL 說只適合岩館」→「比型號表裡每一款都低、價格也沒有比較便宜、OGL 說最適合岩館先鋒」。
2. 型號表價格說明：刪「10-23 沿用」那條，改「原廠標價，2026-10-24 查」；6 款 10-23 標示改 10-24。
3. Velocity XEROS 60 m：267.99 → 267.99–278.99（依顏色）。
4. 「更多選擇」改成直接連〈出國攀岩的繩怎麼挑〉（原指涉被刪）。
5. Crag Dry「這張表裡最貴的一款」→「價格和 Velocity XEROS 相近，在表裡偏高」。
6. BD 9.9 段標題「知道它便宜在哪」→「沒有比較便宜，外皮比例又最低」；新增「價格」條列（40 m 比 Mammut 9.8／VR9 同長度貴、60 m 與 Mammut 9.8 同價）。
7. BD 9.9「外皮比例本篇最低」→「比上表每一款都低」。
8. BD 9.9 結論「只在岩館爬、預算最緊，它可以用」→「它可以當岩館繩，但不是省錢的選擇」。
9. 情境「只在岩館先鋒」：「預算最緊才考慮 BD 9.9」→ 陳述 40 m 同長度的 Mammut 9.8／VR9 原廠價更低、外皮比例更高。
10. 沙土影片：「同一條髒繩洗過後明顯耐磨」→「12:26 起 dry 繩洗與不洗差別不大；13:44 起未處理繩洗過明顯耐磨」；情境段「洗過的髒繩」→「未處理的髒繩洗過後」。
11. JB Mountain Skills：`start: 496` → `488`，文字 8:16 → 8:08。
12. HowNOT2 假繩：「查那條繩附的證書編號」→「查購物平台上同款繩附的證書編號」。

### 需要人判斷

- BD 9.9 既不比較便宜、外皮比例又最低、評測評分墊底（OGL 16 款第 16），要不要整段拿掉、只留「沒收的」一句。
- 「只在岩館先鋒」情境的 BD 9.9 條目已改成事實比較；是否乾脆刪掉這一條。
- Beal Booster III 的 Metal 色比較便宜（EUR 189.11／220.62），表內寫的是 Anise／Blue 價；要不要註明。
- Nomads 影片說 BD 9.9「市面上最便宜之一」，跟原廠價不符（推測是美國通路折扣）；文中只轉述「別只因為便宜買它」，要不要加一句說明。
- 表內 USD 與 EUR 混列，只能同幣別比較；「偏高」「偏貴」的說法目前只對 USD 款成立。

## post-polish

- `register-scan.sh`（修改後）：長句 12 句（約 8%，綠）；但書 13%（綠）；引述區塊 0；姓名當主詞 1；模板化轉折 0；一般英文術語 0。
- 數字密集段 8 段：EN 892 細節（details 內）、UIAA 防水、馬布谷四款、HowNOT2 測力、確保器繩徑都是讀者要用的門檻或型號名，保留。BD 9.9 段我改寫後一度 16 個數字，已拆成標題＋「價格」條列，剩 10 個（多為型號與長度），保留。
- `scan-ledger.sh`：0 命中。`check:tw`：0 blocking、0 待查。
- 讀不下去的地方：「沒收的」那段 93 字一句塞了四個型號與三種排除理由，建議拆成條列（未改，屬結構）。
