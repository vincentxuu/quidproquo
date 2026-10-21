# Independent review: batu-caves-damai

Reviewer: malaysia_crag_evidence（subagent），2026-10-21。讀完整組 zh/en 文章與完整的 `.research/2026-10-21-malaysia-crag-batu-caves-damai.md` 研究筆記，逐列比對表格與出處。這兩篇是同一個 session 寫的，所以這是對證據的自我覆核，不是第三方獨立查核，父層請依此判斷份量。未傳送任何私有資料。

## post-verify

🟢 路線表逐列比對研究筆記的 Route evidence 表，9 列全部對得上：Pokok 5c、Golly Gully 5c、Lead Man 5c、Anchor 6a、TJ 6a+、Sweet Maria 6a+、Monsoon 6b（3 段）、Dry Season 最難 6c+、Enter the Dragon 7c。MP 的另一組標法（5.9、5.10b、5.10a/b）寫在備註欄。

🟢 路線數衝突照原樣呈現：官方頁寫「超過 100 條打栓路線、5 到 7 級」，theCrag 記 80 條（76 條運動）、3,487 次攀登、5b–7c；正文說明對不上、沒有任何解釋，並讓讀者以 80 條為準，沒有把行銷數字寫成事實。

🟢 費用與規則有分層：許可 RM5／RM10 引官方原句；頭盔（攀登者與確保者都要）明確標為社群一致見證、官方頁未列；廁所 50 仙或每天 RM1、沖洗 RM1 標為 2023 年部落格；官方 2026-05-17 價目表只列課程與嚮導、沒有當日入場列。沒有任何一條被寫成官方規則。

🟢 硬體與歷史：1990 年代末膨脹栓、栓齡 20–30 年、部分確保站是磨損繩環（2023-12 註記）、theCrag 的「Caution some routes at Damai have old bolts!」、無具名換栓組織；1990 年代 Mustapha 與 Wira 打 3 Brothers 與 Monsoon、Akmal 後加 Nyamuk Ades 與 Jah Love Climbing；「很多線在岩壁上沒有名字」也寫進正文，沒有把 3 Brothers 等無級數的名線塞進路線表。

🟢 日照寫法正確：朝北、3 月中到 8 月大致全天有太陽、8 月到 3 月中大致全天有蔭（theCrag 原文）；10 月到 12 月季風不適合是兩篇 2023 年文章的經驗值，沒有寫成官方封閉。

🔵 覆核中改了一處（已改並回讀）：租借頭盔的描述，英文研究筆記寫的是 sweaty，正文原本譯成「很臭」，已改為「汗濕」。

🟢 緊急狀況寫 999、Hospital Selayang 與園方聯絡電話 +6012 481 2005（官方頁），並要求向承保公司逐項確認。

🟢 目標檢查重跑結果：grade-convert --write/--check 6 檔 60 列全過、process-leak 6 檔全過、check-post-quality OK、check-post-references OK、check-tw-terms 0 blocking、check-lang-parity 全站 OK。

## post-review

讀者情境成立：文章回答了「值不值得付門票、幾點去、70 m 繩與 16 支快扣是不是必要、1990 年代的栓現在怎麼樣」，並在導言末尾說明這篇幫讀者決定什麼。

結構合約：七個 H2 與三個交通子節齊全；四個程度 H3 標題與腳本 HEAD 一致；表格欄位為 路線／難度／YDS／長度／段數／子區／備註。分區（Left／Main／Cave／Right）沿用來源名稱，英文版子區欄只留英文名稱。

指南書條目第一句為規定句，英文版為對應句；其下列出兩本絕版的馬來西亞指南書，以及「馬來西亞沒有現行紙本全國指南」。

必須提醒父層的三點：
- 系列總覽（order 0）由平行工作流在同一時間寫出，本篇初稿時尚未存在；總覽完成後已補上雙向連結（本文 → 總覽、Nyamuk、其他岩壁），內部連結檢查全過。若總覽日後改 slug，這些連結要跟著走 post-update。
- 官方 topo（ramonfadli.com/topo-batu-caves/）在研究筆記裡標為「未開啟、內容新舊不明」，正文照樣列出，但明確寫出這點，讀者不會誤以為是現行拓普。
- 系列規劃提到 Damai 可放影片牆，但沒有可核對的公開影片 ID 與資料項目，故本篇不放 `video-gallery`；要放必須先新增 `src/data/climbing-videos.ts` 的條目。

## post-polish

中文逐句讀過：台灣攀岩用語（岩栓、快扣、確保站、頂繩），沒有用中國叫法；段落長度都在門檻內，沒有長句堆疊。費用、栓齡、日照方向是數字最密集的三段，也正好是讀者最需要比較的三件事。

英文版逐句覆核：術語與中文版一一對應，英文表格子區欄沒有殘留中文，引用官方原文時保留英文原句（permit 那句整句引用），方便讀者回到園方頁面核對。

過程外洩與歸因但書都低於門檻；process-leak 全過即為證據。剩餘可選修改：歷史段（Mustapha／Wira／Akmal）對只想排路線的讀者略長，可視父層偏好濃縮，但事實與來源沒有問題。
