# 審稿紀錄：2026-10-18-climbing-balance（中英共用）

日期：2026-10-18。工具：Groundlane MCP 未連線（"not connected"）；改用 Jina reader（中途 429，間隔重試）、curl＋去標籤（climbing.com、PRG）、PubMed E-utilities、OpenAlex（Quaine 1997 摘要）、pdftotext（BMC PDF）。bergsport.life 在 Jina 被擋（AbuseAlleviationError），未引用。原始擷取存於 scratchpad `b23src/`。

## post-verify

逐條對照本 session 打開的原文。

🟢 Confirmed
- BMC FUNdamentals PDF：重心在肚臍到脊椎連線中點稍下、用髖部當記號；重心移轉是最基本技能之一；新手太依賴手臂、讓腿推；直臂讓負擔落在骨骼、適合掛快扣與休息、「not possible in every climbing situation」。
- iclimb prose2_4（黃國維 2007 第 17 期）：原則三「先平衡後移動」、「三點不動一點動」是最常聽到的術語、高手常只剩兩點甚至一點；原則四「貼壁離壁都要」。
- de.wikipedia Drei-Punkt-Regel：定義、安全理由、1950 年代以前嚴格遵守、Eidenschink 1964、Gill、運動攀登興起、今日在入門教學與差保護／鬆動高山路線仍有效。
- John Gill Page 3：1950 年代超出 three-point suspension 被視為 risky and heretical、貶稱 lunge、1955 年開始練習 controlled dynamics。
- Climb Strong：Heavy Feet、Simple Triangle Drill 內容。
- Hooper's Beta（Dan）：blocked、casting out、plumb line 左右與前後、最常失去前後平衡、修正初學「stay sucked in」；放鬆要移動的那隻手臂。
- REI：straight arms are happy arms；髖部正對牆把重量推離牆。
- Gresham（Climbing.com outside edge）：前傾牆正身要拉、鎖臂、hips swing（barn-door）。
- 論文摘要／全文：Quaine & Martin 1999（垂直力三點、水平力在左手左腳）；Noé 2006（垂直牆有 APA、前傾牆支撐面大、無 APA）；Quaine 1997 JAB（軀幹貼牆接觸力較小）；Zampagni 2011（菁英離牆約 5 cm、側向晃動較大）；Young 2024（耗能不隨重心位置變、技術重在穩定與降低墜落風險）；Bonelli 2026 全文（UP/DOWN 定義、DOWN 手上負荷較多、屈指肌與肱橈肌活化較高、前傾牆 UP 用到較多二頭肌與背闊肌、作者推測 DOWN 的偏好來自疲勞與姿勢調整；14 人、±5°、10 秒、≥1 年經驗）。

🔴／🟠 修正（已改）
- 初稿寫 Quaine 1999「左側那條對角線把你留在牆上」→ 左手左腳是同側不是對角，改成「穩住左右平衡的是另一側的手腳」。
- Bonelli 附錄初稿寫「坐下去時轉到對側腳的負荷比較明顯」→ 摘要原文是陡度造成的轉移方向，容易誤讀，刪除，只留「牆越陡負荷越從腳轉到手」。
- 黃國維初稿冠「台灣攀岩教練」→ 頁面只寫作者，刪頭銜。

🟡 Unverifiable（未寫入）
- Bonelli「手多 23–32% 體重」：全文有「HAND mean diff.: 23–32%」，但擷取文字看不到單位是否為體重百分比，所以 details 只寫「平均差值 23–32%」，不寫「體重」。
- iclimb「70% 力量因踩不到腳點流失」：無出處，未引用。
- bergsport.life 對三點規則的說法：本次打不開，改用維基與 Gill。

本次只檢查文中已提出的宣告，未評估覆蓋是否完整（覆蓋見 post-review）。

## post-review

- 機械檢查：`check:tw` 0 blocking；`check:references` 本篇中英無錯（全站剩 6 個錯誤在其他作者的 order 7、9 英文版尚未建立）；`check:process-leak` 中英皆通過；`check-post-quality` 原本警告 `bouldering` tag 不貼切 → 已移除，改為 `[climbing, indoor-climbing]`。`pnpm verify`／`astro check` 未跑（多 agent 同時改 worktree，交給 commit gate）。
- 範圍卡對照（order 2）：重心在支撐點上方 ✓、先移重心再移手 ✓、三點不動的出處與適用範圍（入門規則不是定律）✓、屁股貼牆真相（靜態貼、移動找鉛垂線）✓、直臂省二頭肌不是手指 ✓；不講側身，只在末節當橋接到 order 3 ✓。讀完能判斷該守還是該放：有「該守還是該放」表與練習題 2 ✓。
- 結構：每個教學節都有「今晚就能做的動作」✓；練習題 4 題、答案收在 details ✓；下一步、參考資料 ✓；🌏 連結 ✓。
- tldr 與正文一致性：「1950 年代以前教條」「入門與鬆動岩壁」「先移重心到其餘三點」「貼牆靜態／移動找鉛垂線」「直臂省二頭肌」皆與正文及來源一致；description 與 tldr 不重複 ✓。
- 數字：正文每個主張最多一個數字（5 公分、1955、1964）；Bonelli 細節收進 details ✓。
- inline link：每個來源第一次出現都有連結；系列兄弟篇（總覽、腳法、動態、側身）與入門文皆為站內連結 ✓。
- 主題歸屬：與 order 8 牆角度篇對 Bonelli 的說法一致（直臂不等於手指休息）；側身內容只留一段轉手 ✓。
- 術語：「三點不動一點動」有台灣用例（iclimb）；鉛垂線為一般詞，標英文 plumb line ✓。

## post-polish

- register-scan（中文）：長句初稿 8 句（BMC 定義、黃國維、Noé、Gill、維基結論、Zampagni、鉛垂線、REI 正身）→ 斷句後 0；但書 10%；數字密度無超標段；模板化轉折 0；引述區塊 0。
- writing-phrase-ledger：無命中。
- 英文版：register-scan 的長句指標以字元計，對英文不適用；人讀確認段落長度與中文同步。
- 人讀：每個口訣（三點、貼牆、直臂）都依「原口訣 → 修正 → 來源」寫；中英同步修改了上述三處 post-verify 修正。
