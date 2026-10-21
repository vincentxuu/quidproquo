# 龍坡邦 Luang Prabang：中英獨立審稿

2026-10-21。theCrag 龍坡邦頁（區塊計數、FR 級數表、子區清單、Nearby Icons）、The Crag Journal 2023 龍坡邦段、GCH 攀岩頁指南書說明讀取。中英全文讀完。

## post-verify

- 🟢 全區 19 條（theCrag，2026-10-21）、子區只有 Pak Ou 與 Gecko Wall 兩個：theCrag 龍坡邦頁的子區清單。
- 🟢 FR 級數分布 3b×1、3c×1、4b×1、4c×1、5a×1、5c×1、6b×2、6c×1、7a×1、7b×1，合計 10 條有級數、其餘 9 條未填：解析 theCrag 級數表，與正文表格逐格一致。
- 🟢 Mind the Owl 5.10d（YDS）：theCrag Nearby Icons。正文寫「約 6b 到 6b+」為 YDS↔FR 的近似換算，非 theCrag 的原始標示，已用「約」標示。
- 🟢 Pak Ou 13 條 4c–7c+、其中 6 條在 7a 以上、岩壁巨大、岩質不穩（部分鬆動帶粉）、位置在湄公與南烏河交會處、附近有數百尊佛像的洞穴、可請載送者順路帶去：Crag Journal 2023 原文。
- 🟢 Gecko Wall 6 條、5 條在 3–5c、1 條 6b+、原本為帶新手課程而開發、位於下游方向：Crag Journal 2023 原文（"It seems the crag was bolted for taking novices on climbing courses"、"slightly downstream of Luang Prabang, so in the opposite direction of Pak Ou"）。
- 🟢 指南書收錄落差：GCH 官方頁明列 "Thakhek, Sala Hinboun Valley, Vang Vieng, Pha Tang, Xaysomboun, Luang Phrabang, and Nong Kiau"；Crag Journal 2023 寫 "The Luang Prabang area doesn't feature in the GCH guide"。兩處都實際查過，正文並列並給出「2023 年版沒有、後版加入或 GCH 筆誤」的可能解讀，沒有選邊。
- 🟢 季節：北部 11–2 月乾爽、2–4 月燒季、5–10 月雨季：與 GCH 對寮國季節的描述及北寮燒季的普遍現象一致，正文用「北寮受影響比中部明顯」而非寫死 PM2.5 數字。
- 未驗：船班時刻、Gecko Wall 的接近路線細節、2026 年 Pak Ou 的岩栓狀況、Mind the Owl 以外的具名路線。正文全部標為需當地確認。

## post-review

這一篇的功能是「告訴你這裡不適合專程來」。開頭就給 19 條與兩個岩場的方向相反，接著才描述岩質與風格，避免讀者誤判期待。結尾把它放回旅行動線（龍坡邦值得待兩三天，攀岩排其中一天）。

「指南書到底收不收龍坡邦」獨立成節，是本篇最有價值的一段：兩個官方級來源互相矛盾，文章給出並列與可能解讀，並提醒買書前不要假設。符合系列「來源分工與衝突照寫」的原則。

風險段落列了五項：路線少、岩質鬆（點名「鬆動的握點是掉落的危險，不是小意外」）、無人管理、救援更少、與旅行一起安排。

## post-polish

「這裡的攀岩不是主要行程，而是行程裡可以塞進去的一段」把期待值講在前面。級數表後面接「看起來很碎，正好反映這個岩場的現況」，把資料的粗糙轉成判斷而不是掩飾。

可選修：英文版 Pak Ou 段用 "loose holds are a fall hazard, not a minor surprise"，中文版對應句為「在石灰岩上鬆動的握點是掉落的危險，不是『小意外』」，語氣對齊，可再讀一次確認沒有義差。

### 定稿掃描補記

register-scan 與 phrase-ledger 已實際執行，無 ledger 命中。級數表與 Pak Ou／Gecko Wall 的描述在中英兩版逐項比對一致。

### 定稿結構調整（2026-10-21 晚間）

依 `crag-guide-contract` 重寫 H2 與「依程度挑路線」：四級標題由 `climbing-grade-convert.mjs --write` 補 YDS 範圍。公開頁面沒有逐線名稱，四級小節以級數分布與子區說明；唯一具名路線 Mind the Owl 在 theCrag 是 YDS 標示，難度欄寫 `5.10d（theCrag 以 YDS 標示）`，換算器判定為已是目標系統而跳過，1 row / 0 issues。進階級另外註明 Crag Journal 的「6 條 7a 以上」與 theCrag 級數表（7a 1 條、7b 1 條）數量對不上，屬來源差異而非本文取捨。
