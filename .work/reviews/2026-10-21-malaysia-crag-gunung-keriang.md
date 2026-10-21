# Review: 2026-10-21-malaysia-crag-gunung-keriang

撰稿自審（撰稿與審稿同一 session，非獨立第三方），2026-10-21。對照 `.research/2026-10-21-malaysia-crag-gunung-keriang.md`、`docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md` 第 6 節與 `.agents/skills/post/references/crag-guide-contract.md`。來源分級依 `docs/climbing-sources.md`：theCrag 屬群眾 DB（不能單獨撐），本文的每一條事實都標了單一出處與更新日期，沒有把它當一手公告。Groundlane 在本 session 未接線，來源內容依研究筆記已擷取的原文讀回，未重新抓取。

## post-verify

🟢 路線數與子區逐字比對研究筆記：37 條運攀路線；Graveyard Section 17 條、14 m、5 個級距、107 次攀登；HACCK Section 20 條、23 m、2 個級距、127 次攀登。頁面更新日期 2026-10-19。正文的子區段落與中級表備註一致。

🟢 具名路線只有 Mansayno（6c，★★★）一條，正文只列這一列，沒有多寫任何路線名；「公開清單裡沒有 6a 以下的線」也照研究筆記寫成「來源沒列」。

🟢 岩質：研究筆記記載 theCrag 頁面沒有岩質欄位，正文因此寫「頁面未列岩質資訊」，並明說不把吉打其他岩場的石灰岩搬過來，沒有斷言岩種。

🟢 進入與土地狀態：休閒公園、free access for public、self transport from Kodiang or Jitra，與研究筆記一致；正文沒有寫出任何許可、收費或收費金額。

🟢 跨篇連線：2.5 天串接 Gunung Keriang／Bukit Keteri／Lubuk Pedati 的 Instagram 貼文來自行程筆記 6.1，正文與參考資料都列了該網址。

🟢 硬體與救援：頁面未列岩栓狀況，正文要求逐一檢查固定點；緊急電話 999 與「向承保公司確認戶外先鋒、搜救、醫療與送返」寫成要求而非保證。

🔵 已修：初稿把「Gunung Keriang 休閒公園」「Kodiang」「玻璃市」「Bukit Keteri」「Ipoh」寫成無連結的專名，已改成首次出現即為 inline 連結；參考資料補上正文引用過的每一條網址（theCrag、論壇、Instagram、MetMalaysia、指南書書目、theCrag 指南書頁面、Rock Climbing in Thailand and Laos、Mountain Project 難度對照表）。

## post-review

讀者適配：文章回答的是「吉打行程裡有沒有值得排的免費岩場」。岩場本身、免費開放與 37 條規模先講，最會改變行程的三件事（自駕、雨季、線上只有一條具名路線）各自落在對應段落，沒有混在導言裡一次講完。

結構檢查：七個 H2 依序為這是什麼樣的岩場／什麼季節去／怎麼去／去之前要知道的規範／依程度挑路線／查資料的入口／參考資料；「怎麼去」下有大眾運輸、開車、停車三個 H3；「依程度挑路線」下四個 H3 標題與 `scripts/climbing-grade-convert.mjs` 的 HEAD 完全一致。

四級路線表：入門、進階、高手三級都寫「來源沒列」且不放表格；中級只有 Mansayno 一列，備註標了 theCrag 出處與頁面更新日期。沒有為了填表而造路線。

「查資料的入口」的指南書條目第一句是固定句「路線難度與路線數主要來自線上資料庫，以指南書為準。」，底下列 2007 年絕版的《Climb Malaysia》、UKC 書目的《Climbing Guide To Malaysia》、theCrag 馬來西亞指南書頁面「找不到任何指南書」的現況，以及《Rock Climbing in Thailand and Laos》的玻璃市旁章。

仍存在的缺口（已在正文寫成限制，不另補）：theCrag 頁面未記錄朝向與季節表，未列岩質與 approach 說明，沒有在地的公開聯絡（正文改指鄰近的 Perlis Climbers）。

## post-polish

逐段讀 zh／en 兩版確認語氣一致、表達自然。中文用台灣用語（影片、資訊、確保站、快扣），英文版沒有把中文殘留帶進 sector 欄位。表格只有五列，中文與英文的數字、級距、攀登次數一一對應。

四個 H3 級距段落的寫法是「來源沒列」加一句為什麼（例如 HACCK Section 只掛 2 個級距），不是乾巴巴的重複句，讀起來像有資訊的段落而不是填表。

機械閘門（針對本系列 10 個檔案重跑）：`climbing-grade-convert.mjs --check` 26 列全部通過；`check-process-leak.mjs` 10 檔通過；`check-post-quality.mjs` 10 檔無錯誤；`check-post-references.mjs` 與 `check-tw-terms.mjs` 通過。全站 `pnpm verify` 與 `check:series-plan` 由上層執行。
