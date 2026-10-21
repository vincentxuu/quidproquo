# Independent review: batu-caves-nyamuk

Reviewer: malaysia_crag_evidence（subagent），2026-10-21。讀完整組 zh/en 文章與完整的 `.research/2026-10-21-malaysia-crag-batu-caves-nyamuk.md` 研究筆記，逐列比對表格與出處。這兩篇是同一個 session 寫的，所以這是對證據的自我覆核，不是第三方獨立查核，父層請依此判斷份量。未傳送任何私有資料。

## post-verify

🟢 路線表逐列比對研究筆記的 Route evidence 表，9 列全部對得上且沒有新增列：Don't Underbreak Me 5c、In Guns We Trust 5c+、Bowel Movements 6a、Bangsar Babes Backdrop 6a+、34 C 6b、Hot Tempered Freaking Glue Gun 6b+、Pear 7a、Osmosis 7c、The Pledge 8a。MP 的另一組標法（5.9+、5.10a、5.10c、5.11d）寫在備註欄，沒有混進難度欄。

🟢 規模數字一致：theCrag Nyamuk 頁 106 條路線、2,628 次攀登、級數 4a–8b+、八個分區、單線 4–32 m（2026-10-16 更新）；UKC 100 次攀登、63 m（2026-10-16）；黑風洞總頁 362 條、10 分區、崖高約 150 m（2026-10-18）。分區計數兩組（2023 部落格 vs 2026 theCrag）都寫進正文並說明是收錄差異。

🟢 收費與通行：免費、沒有許可要求、紅色告示牌「警告：高風險石灰岩區禁止進入，任何意外由當事人自負」、theCrag 視為勸退而非封閉、UKC 的 No Access Issues、土地狀態未公開——五項都照研究筆記寫，沒有把告示牌寫成封閉令。

🟢 岩栓狀況只寫可查證的部分：MP 的不鏽鋼硬體與羊角／豬尾下放岩栓、theCrag 的濕熱腐蝕與志工維護警告、UKC 的 Malaysian Bolting Fund 標籤；研究筆記記「沒有任何有日期的岩栓狀況報告」，正文也照樣沒有假設栓況良好。

🟢 緊急狀況寫 999 與 Hospital Selayang（研究筆記來自雪蘭莪州衛生部門），並要求向承保公司逐項確認戶外先鋒、搜救、醫療與送返。醫院在研究筆記中沒有網址，因此不假造連結。

🔵 覆核中改了三處（已改並回讀）：(1) Grab 的 RM25–40 原本寫成「到站後」的價格，研究筆記 6.3 的原文是市區到黑風洞的 Grab 價，已改成「從市區直接叫 Grab」；(2) 同段車資加上「2026 年 10 月查」的查核時點；(3) Piz Buch 的書名在正文改成行內連結，確保正文與參考資料的網址集合一致。

🟢 目標檢查重跑結果：grade-convert --write/--check 6 檔 60 列全過、process-leak 6 檔全過、check-post-quality OK、check-post-references OK、check-tw-terms 0 blocking、check-lang-parity 全站 OK。

## post-review

讀者情境成立：文章回答了「這面牆有沒有我的級數、怎麼走到起攀點、哪個分區先被曬到、免費進入代表什麼」四個問題，導言末尾就說明這篇幫讀者決定什麼。

結構合約：七個 H2 依序為這是什麼樣的岩場／什麼季節去／怎麼去／去之前要知道的規範／依程度挑路線／查資料的入口／參考資料，三個交通子節齊全；四個程度 H3 標題與 `climbing-grade-convert.mjs` 的 HEAD 完全一致，表格欄位為 路線／難度／YDS／長度／段數／子區／備註。

指南書條目第一句為規定句「路線難度與路線數主要來自線上資料庫，以指南書為準。」，英文版為對應句；其下列出兩本絕版的馬來西亞指南書與「馬來西亞沒有現行紙本全國指南」這件事。

必須提醒父層的兩點：
- 系列總覽（order 0）由平行工作流在同一時間寫出，本篇初稿時尚未存在；總覽完成後已補上雙向連結（本文 → 總覽、Damai、其他岩壁），內部連結檢查全過。若總覽日後改 slug，這些連結要跟著走 post-update。
- 系列規劃提到 Nyamuk 可放影片牆，但 `src/data/climbing-videos.ts` 沒有馬來西亞的 key，研究筆記也沒有任何可核對的影片 ID，因此本篇沒有放 `video-gallery`。要放必須先由有權限者新增資料項目，不能在文章端硬塞 key。

## post-polish

中文逐句讀過：台灣攀岩用語（岩栓、快扣、確保站、抱石、錨栓），沒有用中國叫法；「嗯、筆直上文」的句型沒有堆疊；段落都在 60 字以內，沒有長句障礙。數字集中在真正影響讀者決策的地方（路線數、級數範圍、分區、費用、栓齡），沒有把查核工作量寫進 tldr。

英文版逐句覆核，確認沒有把中文殘留在表格欄位（英文表格子區欄只留牆名，例如 White Wall、Volleyball Site），術語與中文版一一對應，沒有把「有人回報」寫成已公告的規則。

過程外洩與歸因但書都低於門檻；process-leak 全過即為證據。剩餘可選修改：導言第二段「本篇只寫 Nyamuk」的反覆提醒若嫌囉嗦，可濃縮成一句，但這屬編輯偏好，不影響事實。
