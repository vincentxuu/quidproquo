# Review: 2026-10-19-italy-crag-cornalba（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-cornalba.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-cornalba.md`。系列〈義大利岩場〉order 303。作者自審（同一 agent 寫稿與審稿）。

工具降級（toolDegradation）：Groundlane MCP 可用為主；偶發 CONCURRENCY_LIMIT、300 秒逾時（Val Brembana Web）與 502（AREU、theCrag html）→ 改用 jina read_url 讀成功；theCrag `/routes` 直接 curl 遇 Cloudflare、Exa 回首頁 → 改用 Groundlane extract=full 讀區域頁；8a.nu 用 Exa；Climbook 直接 curl。Firecrawl 未用（額度）。原始擷取存於 scratchpad/cornalba/。

## post-verify

宣告逐條對照研究筆記中已開啟的來源（封閉、交通、救援全數檢查）。

- 🟢 鎮公所岩場頁：海拔 1100 m、朝南與朝東、全年可爬（極冷日除外）、「una delle più belle e famose falesie italiane」、指力牆、「almeno il 6c」、4／46／50／38 分布、5 級「spesso relegati in posti poco accessibili」、牆高 200 m 最長 5 段、「Chiodatura ingaggiante, ma ormai quasi sempre ottima, a fix o resinati」、開車路線（Dalmine、11 km 接 SS40、Ambria、10 km、1 km）。
- 🟢 鎮公所 Ordinanza n. 1/2019：2019-06-18 發布，禁攀與禁入 Cornabusa 步道及岩壁右側，期間 19/06–31/07/2019，原因「lavori di valorizzazione」。
- 🟢 2024 聖誕燈飾禁攀：Up-Climbing（「interdizione all'arrampicata … fino al dieci di gennaio」、170×70 m、鎮長 Vistalli 說清樹是為了直升機絞盤）、Val Brembana Web（「per ordinanza del sindaco … fino al 10 gennaio」、170 m）、Montagna.TV（120×70 m、「fino al dieci gennaio 2025」）。三者皆二手，鎮公所網站未找到命令原文 → 正文已標「二手」並寫尺寸差異。
- 🟢 Planetmountain 岩場頁：「ora un po' in disuso」整段引文、「poche ripetizioni」、「paretona centrale … potenziale notevolissimo」、Camòs 自由攀登 Apache 8a／Peter Pan 8a+／Jedi 8b、Moro Figli del Vento L2 8a、Dallona Settimo Senso 8c 與 Les sindacalistes 8c+/9a、Bar-Ristorante Vico 附近 3 個停車場、酒吧後方 10 分鐘、1996 年書目。
- 🟢 Planetmountain 2010：17 歲 Ondra 首攀 Goldrake 9a+、Camos 打 bolt、在 Jedi 右邊、先前爬了 Vento nei Capelli 8c+/9a。
- 🟢 Planetmountain 2021（Bana 自述）：2021-12-26 首攀、Parimbelli 2010 打 bolt、心形岩塊、「basks in the sun all day」、先爬簡單第一段到小平台確保、Goldrake 在「east face」、Bana 2019-04 重攀 Goldrake、11 月起嘗試。
- 🟢 UKC 2016：Ghisolfi 第 4 次；先前 Ondra、Moroni、Carnati。Climbook：Moroni 2014-10 首次重攀。
- 🟢 Up-Climbing 2022：Cornalba 收在 Versante Sud《Valli Bergamasche》；Sindacalistes 由 Giuseppe Bonfanti「Ciusse」打 bolt。
- 🟢 VisitBrembo：1980 年 Tassi 與 Tiraboschi 開始、「più di 132 vie」、建議春夏。
- 🟢 theCrag：119 條、8 子區名稱、微外傾小點技術型、5–10 分鐘、Bar Vico；El santo 7a／Apache 8a／Extrasistole 9a 三星；列《Kletterführer Valli Bergamasche》Parimbelli 2022。8a.nu：124 條、1,334 筆、風格標籤 Technical／Crimps／Cruxy。
- 🟢 Climbook 各子區：表內所有路線名、難度、分段、重複次數逐列對照（Via dei gastù 7 次、Via delle dindone 5、Ambra 5、Bella frittella 4、Letizia 3 等）；Settimo senso 8b+、Les sindacalistes 8c+、Vento nei capelli 列 Progetto；12 個子區（919–930）。
- 🟢 Arriva B 線冬季 PDF：有效 2026-09-14～2027-06-08（2026-10-12 版）、「A ZOGNO cambiare bus per … CORNALBA」、Cornalba Chiesa 班次少且多為 SCO、FEST 頁只到 Zogno、客服 035 289000。Arriva 總站頁：Piazza Marconi、1–5 號月台往 Val Brembana。
- 🟢 AREU：112／113／115／118 都進 CUR、Varese CUR 負責 Bergamo 省、「112 Where ARE U」傳 GPS。
- 🟢 Versante Sud：2022、464 頁、ISBN 978 8855470 308、LV 152、義大利文、只收運攀、介紹同時寫 Fourth／fifth edition；Oliunid 列德文與義大利文。
- 🔵→已修：初稿寫「約三百人的小村」，人口只看過搜尋摘要（Wikipedia 2010 年 310 人），未開頁 → 刪掉。
- 🔵→已修：初稿把 Extrasistole galoppante 寫成「第 2 段、中央大牆」；Bana 原文是「先爬一段較簡單的路線到小平台確保」、位置是從村子看得到的心形岩塊，「中央大牆」是 Planetmountain 另一段講潛力的話 → 改寫。中英同步。
- 🔵→已修：季節段初稿寫「夏天正午很曬、挑朝東的區或早上爬」，來源沒寫 → 改成鎮公所、觀光網與 Bana 經驗三者並列。中英同步。
- 🔵→已補：Goldrake 子區補「東面」（Bana 原文 east face）。
- 🟡 未找到：2025 年冬天是否再掛燈飾與禁攀；正文改成給讀者具體動作（看鎮公所新聞頁）。

本次只檢查了文中已提出的宣告，未評估覆蓋是否完整（覆蓋見 post-review）。

## post-review

- 機械檢查：`node scripts/climbing-grade-convert.mjs --check` 兩檔 48 列 0 問題；`pnpm check:tw` 0 blocking、0 to review；`check-process-leak` 兩檔通過；`check-post-references` 只報站內連結 `/posts/climbing/2026-10-19-italy-crag-lecco-grigne(-en)` 尚不存在（同批 order 302 由另一個 agent 撰寫，該檔落地後自動解除；若 302 不出，需拿掉導言那個連結）。
- frontmatter：date 2026-10-19、type guide、series 中「義大利岩場」／英「Italy Climbing Crags」order 303；tags 5 個沿用既有（lombardy 與 Val di Mello 一致）；tldr 先講岩場（海拔、朝向、高度、風格、程度、Goldrake），再講最會改變行程的公車與 2024 禁攀；description 列主題清單，不重複 tldr。
- 結構對照契約：這是什麼樣的岩場（含規模比較表）→ 什麼季節去 → 怎麼去（大眾運輸／開車／停車三個 H3）→ 規範（封閉表、bolt、救援）→ 依程度挑路線（四級標題與換算說明照 HEAD）→ 查資料的入口（含「指南書」bullet、第一句固定）→ 參考資料 ✅。導言末句說明本篇幫讀者決定什麼 ✅。
- 聚焦問題「Val Serina 的老牌高難度岩場現況如何？」：「為什麼現在人少」段（Planetmountain 引文＋Climbook 重複次數）、2019／2024 禁攀、bolt 現況、2021 年新 9a 都有回答 ✅。
- 依程度表：四級都有路線；入門與中級多為 Climbook 單一出處，備註已寫「單一出處」；8a 以上與 Planetmountain 交叉，難度不一者並列（Settimo senso、Les sindacalistes）。Vento nei capelli 來源矛盾，寫成段落不入表。
- 跨篇連結：系列總覽、Val di Mello（已存在）、Lecco／Grigne（同批）中英各自連對應語言 ✅。
- 中英對等：段落、表格列數（各 24 列）、連結一一對應；英文參考資料義大利文來源標 (in Italian)。
- 台灣讀者位置：交通從貝加莫火車站旁的 Arriva 總站講起，明講週日沒車、建議租車，並給客服電話 ✅。

## post-polish

- register-scan 第一輪：長句 8 句、但書段落 9%、引述區塊 0、姓名當主詞 0、模板化轉折 0、英文術語 0；數字密度 4 個以上 8 段，「歷史」段 10 個最高。
- 已改：「歷史」段把各路線難度與年份移到下方路線表，段內只留路線名與推進到 8c+，數字從 10 個降到 3 個（中英同步）。
- 保留：時刻表段（有效期間、班次標記、客服電話）、開車路線（公里數）、救援段（四個電話號碼）屬查表資訊；長句多為義大利文原句引用或指南書書目。
- 保護片段（引號原文、數字、連結）回讀未變；改後重跑 grade check 與 check:tw 皆通過。
