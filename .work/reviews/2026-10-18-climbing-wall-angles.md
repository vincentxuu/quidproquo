# 審稿紀錄：2026-10-18-climbing-wall-angles（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回報 not connected；改用 Jina reader（climbing.com 被擋）＋ curl 去標籤，PubMed E-utilities 讀 Noé 2001 摘要。原始擷取存於 scratchpad `b89/raw/`。

## post-verify

逐條對照本 session 打開的原文（Climbing.com 斜板／外傾／勾腳／休息四篇、REI 動作教學、UKC 掛腳、Hooper's Beta 兩集、Baláš 2014 全文摘要、Bonelli 全文、Noé 2001 摘要、climbingninjette、方格子術語表）。

🟢 Confirmed
- Baláš 2014：11 位女性（5 新手＋6 中級）、85／90／98 度、壓力鞋墊；越陡腳負荷越小（p<0.001）；新手腳負荷較少、耗氧與心跳較高。正文改成「三種角度，從略緩於垂直到微外傾」以降低數字密度。
- Noé 2001 摘要：外傾時手臂明顯參與以防墜落。
- Bonelli：14 人、+5／0／−5 度；越陡負荷由腳轉到手；DOWN（直臂）姿勢在三種角度手指屈肌與肱橈肌活化都較高；只測靜態三點站姿。
- Findlay（Climbing.com）：相信腳、把體重壓上去讓看不見的點可用；腳跟低、前腳掌貼踩、「Don't edge」；手軟、手肘微彎；伸高、高跨、捏小點會把身體拉向岩石、減少腳上重量；腳跟下沉休息小腿；保持移動；墜落時保持姿勢、腳貼岩面滑、手不要跟著拖。
- REI：直臂由骨架承重；髖部正對牆會把重量推離牆；一側髖部貼牆；backstep／drop knee；斜板適合 smearing；斜板上手指朝下 palming。
- Climbing.com 外傾：收核心不讓屁股垂、髖部近牆有更多 toeing-in power；每個腳點用力、點在大拇趾下；身體在手點正下方、用髖部帶；手臂直而靜讓腳找位置、側拉可變倒抓；drop knee／heel／toe hook 減手臂負擔；rest to rest；洞穴墜落落入空中。
- Gresham 勾腳：「Page one of overhanging climbing is to keep your feet on」；出手前往下找；小腿前側持續拉、不猶豫；小步移腳、必要時先放一腳用核心止擺；clamping；大屋簷腳先出去；抱石區天花板找勾腳的練習。
- UKC 掛腳：翻天花板邊緣最簡單常是掛腳；Parkinson「plonk their heel… and hope」、腳角度與腿出力；「four completely interchangeable limbs」。
- Climbing.com 休息：heel hook 是此地形最常見休息；knee bar 在外傾需要強腹肌；內角 stemming／drop knee；核心型休息很快讓腹部與腿先累，甩手補粉後繼續。
- Hooper's：貼太緊一放手就外盪、遠離下方手、鉛垂線；大動作前直臂、往下坐在腳上，有空間移腳、較長加速距離；慢慢平衡伸手時可以貼緊。
- 台灣用語：斜板／直牆／外傾牆／天花板、掛腳＝heel、勾腳＝toe、膝頂＝knee bar（climbingninjette）；方格子「大家都是講原文」。

🔴／🟠 修正（已改）
- 「膝蓋卡（knee bar）」→ 卡膝類說法查無台灣用例，改用有出處的「膝頂」。
- 「這也是外傾牆比較適合放手嘗試大動作的原因之一」→ 來源沒有此推論，刪除，改寫成 Findlay 的斜板墜落建議。
- glossary「台灣部落格與岩館多半直接說 slab」「台灣岩友常叫天花板」→ 岩館口語無來源，改成「術語文章」「部落格寫作」。

🟡 Unverifiable（未寫入）
- Bonelli「直臂手部負荷多 23–32% 體重」：本 session 全文快速檢索未定位該數字，正文不寫數字，只寫手指屈肌活化較高。
- Mountaineers 斜板文（JS 空殼）、BMC FUNdamentals 的角度進程（頁面只有導覽）未讀到內文，不引用。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:references` 本篇 0 error；`check-process-leak` 通過；`check-post-quality` 僅警告 `bouldering` 與內文對應弱，系列其他篇同樣使用，保留。
- tags：原用 `climbing-technique`，全站無人使用、會分裂 tag，改為與系列其他篇一致的 `[climbing, indoor-climbing, bouldering]`。
- 範圍卡對照：斜板（腳與摩擦、重心）、垂直、外傾（腳不離牆、核心、手負荷升高）、屋簷（toe hook、heel hook）全覆蓋；每種角度把前面技巧重新排序，結尾有「三個優先技巧」表，達成「讀完後讀者能依牆角度挑出該優先用的三個技巧」✓。未引入新動作 ✓（backstep／drop knee 只連回 order 3）。
- 迷思：「用腳爬不要用手」（Baláš、Noé、Bonelli 修正＋Gresham 正確說法）、「屁股貼牆」（Hooper's 依階段）、「直臂就是休息」（Bonelli）都寫出原口訣、修正與來源 ✓。
- 結構：🌏 連結、前置連結、每節有「今晚就能做的動作」、練習題 4 題含 details、下一步、參考資料 ✓；mermaid 一張、表格三張。
- inline link：每個外部來源首次出現皆有連結；系列兄弟篇（footwork、balance、turning-twisting、holds-grips、overview、crack）都已存在 ✓。
- 主題歸屬：訓練（核心、手指、小腿肌力）只交代屬未來系列，不連結 ✓。

## post-polish

- register-scan（中）：長句 1 句（Parkinson 結論句）→ 斷成兩句，現為 0；數字密度 1 段（Baláš 段 5 個數字）→ 拿掉三個角度數字，現為 0；但書 5%、模板化轉折 0、引述區塊 0。
- register-scan（英）：數字密度同步修正；英文術語密度命中 1 處是刻意保留的台灣用語對照，保留。
- 可執行動作：四個角度各有一個岩館可做的今晚動作；結論表給出每個角度的三件事。
- 中英同步：修正都同時套用到 -en。
