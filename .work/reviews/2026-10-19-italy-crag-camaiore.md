# Review: 2026-10-19-italy-crag-camaiore（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-camaiore.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-camaiore.md`。系列〈義大利岩場〉order 901。作者自審（依 post-verify／post-review／post-polish 檢查清單）。

工具降級（toolDegradation）：Groundlane web_search 可用；web_fetch 第一次成功，之後 CONCURRENCY_LIMIT（佇列滿，其他 agent 共用）→ 改 Exa web_fetch_exa 與 curl；at-bus.it 直接 curl 回「Accesso negato」改用 Exa；theCrag 用 area ID 網址經 Exa 讀到。Firecrawl 未用。

## post-verify

本 session 打開 27 個來源，抽 40 條宣告逐條對照（封閉、交通、救援、bolt 狀況全數檢查）。

- 🟢 Climb Europe：「without doubt the best sport climbing area in Tuscany」、25 處石灰岩岩場、F6b–F8c、tufa 與屋簷、春秋最好、海拔 1,000 m 以上夏天可爬、Marathon 1,000 m／24 段／F6b+（F6a obl）。
- 🟢 falesiaonline：坎達拉是山谷打 bolt 最多的岩場、上下兩條帶狀岩區、「da molti considerato il più bel settore della Toscana」、canne d'organo、Placche a Mare 適合 7a 以下、下區「ideale nelle calde giornate estive」。
- 🟢 Versante Apuano 下區：「Quasi 100 vie」、topo 到 97、路標 Vado/Lombrici/Casoli、Emilio e Bona 直走停往磨坊的路、遵守禁停讓巴士迴轉、磨坊有飲用水、過小橋 10 分鐘、渡河、Magicandalla 全部重打清理、下雨可爬；表內 13 條路線難度逐條對過。
- 🟢 Versante Apuano 上區：30–35 分鐘、Placche a mare→Bao→Pancione Bianco→Le Villette→Penitenziario、topo 到 99、下雨可爬；Placche a mare 季節與日照、Calamijeans 舊 bolt「da evitare」；表內 6 條路線難度與長度對過。
- 🟢 Versante Apuano San Rocchino：「Arrampicata atletica su strapiombi」、夏季與春秋、Trescolli 私人道路、柵欄前停車。
- 🟢 Climbook Placche a mare：17 條、Tre minuti per sognare 6a 17 次（早期 5+）、Un' ti sposa' 5c 15 次、Stattento 6b 9 次。
- 🟢 theCrag：Camaiore 711 條；Candalla 229 條（101／128）。
- 🟢 Planetmountain 2017：Ondra 首攀 Naturalmente 9a+、La Terza Eta 9a、「one of the best routes I can imagine」。Planetmountain 2021：Moroni、Bogliacino 第二、三攀、「freezing wind」。
- 🟢 Autolinee Toscane：E33 停靠 Vado、Lombrici、Casoli，公告「Passaggio linea E33 a nuovo gestore dall'11/6/2026」；E2 PDF 2026-10-05 起生效、Camaiore P.za Romboni 07:33→Viareggio P.za Mazzini 08:02（約 30 分）、08:33、09:33 每小時一班。
- 🟢 Toscana Today 2024：免費接駁、週五到週日、50–60 分鐘、到 9/1、停 Emilio e Bona。
- 🟢 LuccaInDiretta：2025-08-27 坎達拉落石、Querceta 救援站、Pegaso 3 直升機。
- 🟢 SAST：頁面撥號連結 112（另列 118）、要求轉 CNSAS、說明位置與電話、不要占線。
- 🟢 WB Guides：660 m／850 m、18–20 段、IV–V、V+、7–9 h／10–12 h、5–10 月、6 月與 9 月、朝北陰影、Donegani＋CAI 187＋ferrata 1.5–2 h、Ugliancaldo 兩車方案、5c 與 8–10 段先備。
- 🟢 維基百科：1,781 m、「alta quasi 800 m」、Via dei Genovesi 1922 700 m IV+、Oppio-Colnaghi 最多人爬、Diretta dei Pisani 1965 660 m V/V+、Gran Diedro Nord 1969 V–VI、Diedro Sud 200 m V（接 Tiziana 400 m V+）。REDclimber：TD、岩釘保護、要帶 cam。
- 🟢 Rifugio Orto di Donna：SS 445→Minucciano→Val Serenaia、髮夾彎停車、柏油路到 Donegani。
- 🟢 CAI Toscana dossier：88% ZPS、Oppio-Colnaghi 可經採石場道路並穿過採石場。
- 🟢 Versante Sud 三本書頁（年份、ISBN、頁數、系列代碼、Toscana Pareti「Non disponibile」）；GognaBlog 書評 345 條、2026 年 6 月；falesiaonline 書目 2015 年 5 月初版 170 頁；Ptit Hotel 785 條。
- 🔵→已修：tldr 原寫「往北一小時車程」，沒有來源 → 改「北邊的阿普安阿爾卑斯山區」。中英同步。
- 🔵→已修：tldr 原寫「上下兩區合計 200 條上下，多數在 7a 以上」→ 改「theCrag 列 229 條，主力在 7 字頭」（Mapo Tapo「mainly in the 7th」）。中英同步。
- 🔵→已修：Oppio-Colnaghi 首攀日期來源不一（WB Guides／REDclimber 寫 1940-10-02，GognaBlog 書評摘錄寫 1940 年 6 月）→ 正文只寫 1940 年。
- 🔵→已修：`climbing-grade-convert --check` 抓到 5 處 YDS 手填錯（Cip 5b 應 5.8、三條 6c 應 5.11a/b、Marathon 欄應 5.10d）→ 改正後中英各 31 列通過。
- 🟡 保留為二手並在正文標示：Solco d'Equi 季節禁攀只有 GognaBlog 讀者留言；北壁本身沒找到公園的攀登限制公告。
- 未查到：E33 新營運者名稱與時刻表；2025、2026 年夏季接駁是否續辦（正文已寫「要再問」）。

本次只檢查了文中已提出的宣告，覆蓋交 post-review。

## post-review

- 機械檢查：`check-tw-terms` 0 blocking、0 to review；`check-process-leak` 中英皆過；`climbing-grade-convert --check` 中英 62 列通過。`pnpm verify`／`check:references` 由協調者統一跑。
- frontmatter：date 2026-10-19、category climbing、type guide、series 中英名稱與 order 901 正確；tags 7 個（sport-climbing、multi-pitch、trad-climbing、tuscany）；tldr 先講岩場（規模、風格、9a+、北壁）再講最會改變行程的事（E33 換營運者）；description 是主題清單，不與 tldr 重複。
- 結構對照契約：這是什麼樣的岩場（含規模表）→ 什麼季節去（來源表）→ 怎麼去（三列表＋大眾運輸／開車／停車分節）→ 規範（停車、私人道路、落石、bolt、公園與採石場、救援）→ 依程度挑路線（四級＋UIAA 傳攀表）→ 查資料的入口（含指南書條目，首句照固定寫法）→ 參考資料 ✅。導言末句交代這篇幫讀者決定什麼 ✅。
- 停車：契約要 `### 停車`；本篇停車資訊併在「開車到坎達拉」「開車到 San Rocchino」「開車到皮佐德烏切洛」三節與規範節，比照加埃塔範本的寫法，未另開標題。
- 連結：導言連系列總覽（英文版連 `-en`）、同批的厄爾巴島與 Capo d'Uomo（同批指派，檔名照規劃表）；Versante Apuano、Autolinee Toscane、SAST、CAI 首次出現都有 inline 連結。
- 每級都有 ≥6 條可查證路線，沒有空的等級；傳攀另開 UIAA 表。
- 中英對等：所有修正中英同步；英文版 H2 名稱比照加埃塔英文範本。

## post-polish

- register-scan 第一輪：長句 13 句、但書段落 0%、引述區塊 0、姓名當主詞 0、模板化轉折 0、英文術語 0；數字密度 8 段（指南書條目 9 個）。
- 已改：夏季接駁句（77 字）拆成兩句；公園限制與 Solco d'Equi 拆成兩句；上下區描述用分號斷開。
- 保留：其餘長句多為路線指引（路標、步道編號）或含義大利文原句，拆開反而難照做；數字密集段是規模、交通與書目，屬查表資訊。
- 保護片段（引號原文、數字、連結）回讀未變。
