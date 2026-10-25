# post-verify：claims-without-evidence（認識人體 order 21）

範圍聲明：只檢查文中已提出的宣告；未檢查文中沒寫的內容。行號以 zh 檔為準，-en 檔同行號（除非另註）。

## 實際取得程度（本輪）
- 全文（Europe PMC fullTextXML，經 Groundlane web_fetch，truncated=false）：Nuuttila 2026（85,805 字元）、Hogan 2026（73,354）、Meixner 2025（65,826，這次讀到結果與討論，不只摘要與引言）、Ovali & Us 2023（75,659 bytes）。
- 摘要（Europe PMC core record）：Sitko 2025、Storoschuk 2025、Wegner 2013 Cochrane。這三篇全文拿不到（付費；Cochrane Library 頁回 412 cookie 錯誤）。
- 網頁：HSS、Everyday Health 全文取得。
- curl 對外 403；PubMed 站本身未能直接查，改用 Europe PMC 的 MED（即 PubMed 記錄）。

## Contradicted
1. L48（zh/en）「PubMed 以 zone 2 搜尋免費全文為 0 筆」：無法重現，與現況矛盾。Europe PMC `"zone 2" AND SRC:MED AND HAS_FT:y` = 14,130 筆；`TITLE_ABS:"zone 2" AND OPEN_ACCESS:y` = 518 筆；再加 TITLE_ABS 含 training/endurance/exercise 仍有 32 筆免費全文。多數是主動脈弓等無關 "zone 2"，但「0 筆」本身不成立。建議：整條刪除（連同 evidence.md 第 2 點），或改寫成可重現的說法並標日期，例如「2026-10-25 在 Europe PMC 以 'zone 2' 加 training/endurance/exercise 搜標題摘要、限免費全文，有 32 筆，我只看了前 25 筆標題」。
2. L56（zh/en）「通氣閾值和最大脂肪氧化強度的結果接近」：這句照抄 Meixner 摘要的 "strong alignment"，但全文表 2 與討論矛盾：FatMax 平均 56.0% VO2peak、125 W，VT1 69.8% VO2peak、200 W；多重比較中 VT1 與 FatMax 屬顯著差異；討論明寫 "FatMax is generally ~25% lower than VT1 — indicating that these markers represent distinct intensity domains"（與 Hogan 2026 的結論方向也一致）。建議：改成「摘要說 VT1 與 FatMax 'strong alignment'，但內文表格顯示 FatMax 平均比 VT1 低約 25%，作者自己也說它們是不同的強度範圍」，或乾脆刪掉這句。目前參考資料標「讀到摘要與引言」，需改成「全文」或「摘要與結果」。

## Misframed
3. L56 變異係數：「6% 到 29%」數字對，但混了不同單位，且「固定最大心率百分比個人差異大」與結果段衝突。表 2：以心率（bpm）表示的 CV 約 5.7–10.8%（最低），以攝氧量約 19–26%，以功率約 19–30%；結果文字寫 HR72%、HR82%、BLa2.5 變異最低。摘要與討論則主張固定 %HRmax 有大個體差異（討論也承認 "heart rate-based measures generally exhibit less interindividual variation"，但 5% 約等於 10 bpm）。建議：寫「CV 6%–29%，以功率表示的最大，以心率表示的最小；作者仍主張固定心率百分比會讓不同人的實際強度落差很大」。另「它量的是標記之間一不一致」不準，主要量的是同一標記在不同人之間的變異，標記之間的一致性是次要。
4. L55 Sitko：「大家對 zone 2 的定義沒有明確共識」是摘要 Background（討論前的現況），不是結果；結果是 14 人小組達成共識 "preferably… immediately below the first lactate or ventilatory threshold"。目前句序讓讀者以為小組結論是「沒共識」。另摘要還說預期的適應 "might not be unique to zone 2 and could also be induced with sessions performed at slightly higher and lower intensities"，文章沒寫，可補一句（與 L60 論點相符）。「14 位運動科學家與教練」正確；小組由作者挑選，是專家意見，文章已說。
5. L58 Storoschuk：漏兩個限定。摘要結論後半是 "prioritizing higher exercise intensities (> Zone 2) is critical to maximize cardiometabolic health benefits, particularly in the context of lower training volumes"，文章寫「主張要優先考慮更高強度」少了「在訓練量較低時」；回顧範圍是「一般大眾」的粒線體與脂肪氧化能力的建議。其餘（敘述性回顧、菁英選手觀察資料、只讀摘要）正確。
6. L77 Ovali：「懸吊比人工牽引拉得多，和側彎姿勢沒有顯著差別」只在「全部結構性曲線合併」成立（柔軟度 0.398 vs 0.311，P<.001；與 side-bending 0.336 無顯著差）。分層不同：非結構性曲線 side-bending 顯著高於懸吊（P<.001）；<50° 的曲線 side-bending 較佳；主胸彎 >60° 懸吊顯著較佳。建議加「整體來看（結構性曲線）」，並把「側彎姿勢」改成「側彎（side-bending）拍片」避免誤讀成病人姿勢。其餘描述正確：33 人、平均 16.9 歲（11–21）、59 人中納入 33 位有懸吊片者、回溯、膝彎 90 度離地懸吊、只量 Cobb 角柔軟度與術後矯正，沒量疼痛與椎間盤；作者限制（樣本小、無長期追蹤、標準化）。「準備開刀」：全部已接受手術，可寫「術前」。
7. L78 Cochrane：數字與結論正確（32 RCT、2,762 人、7 試驗報告副作用含疼痛增加、"little or no impact"、"limited-quality evidence"、作者說效果小且不具臨床意義）。需補兩個限定：搜尋截至 2012 年 8 月；該回顧納入「非特異性下背痛，含或不含坐骨神經痛」。
8. L83（僅 zh）「也沒有資料說它有害」缺「在我查的範圍內」；en 有 "I found no data"，兩版不一致。且 L78 自己寫了牽引試驗有疼痛增加等副作用，建議 zh 改成「我沒有找到說懸吊有害的資料，但牽引的研究有回報副作用」。
9. L92 動作 2：「強度在第一閾值以下」是簡化。Nuuttila 摘要的納入條件是 "exclusively below VT1, or ≤60% HRR, or [VO2max 條件], or ≤75% HRmax"（四選一）。L54 已正確列出，L92 與 en 對應句要一致，改成「強度在低強度範圍（摘要列出的幾種界定之一）」。另「健康成人 18–65 歲」正確（討論還說是久坐／未訓練的工作年齡成人）。
10. L47 搜尋描述：前 25 筆實際內容混雜，有護理機構、太空飛行、馬、營養補充、文獻計量等無關項，也有相關項（Storoschuk 2025、Sun 2025、Fernandez & Seiler 2025 討論文、Cozma 2026 敘述性回顧、Zhou 2026 RCT、Wang 2026 乒乓球員）。「多數是運動表現或心率監測」只對一部分。建議改「多數與運動訓練無關，或只是順帶提到 zone 2」。補充：Zhou 2026（J Sports Sci Med，obese untrained 女性，polarized vs HIIT vs threshold，10 週 RCT，n=40）用的是三區模型，Z2 指 VT1–VT2 之間，與本文 zone 2 定義不同，不構成直接比較；不需入文，但若審稿者問可答。
11. L112–113 網頁：HSS 頁其實是 HSS 新聞站放的短摘要，內容是轉述 Well+Good 報導並引一位 HSS 運動生理師的話（頁面有點名，文章沒點名，OK）。建議參考資料註明「HSS 新聞摘要，轉述 Well+Good 報導」。Everyday Health 的受訪者是健身教練（CSCS）；文章寫「專業人士」可，但建議「運動／健身專業人士」，避免讀成醫師。又該篇整體偏懷疑（"it's a big leap to say they might help spinal issues"，同時也說 "does provide some gentle decompression"），歸在「說法的例子」可能讓讀者以為它在背書，建議標題改「討論這個說法的網頁」。

## Cochrane 是否有更新版（回答你的問題）
- Europe PMC 上 CD003010 只有三版：pub3（2005）、pub4（2007）、pub5（2013，Wegner et al.）。沒有 2013 之後的 Cochrane 牽引更新版；該筆記錄 2025 年有 metadata 修訂，但仍是 pub5。Cochrane Library 網站本身無法讀取（412 cookie），所以「無撤回或新版」只能說在 Europe PMC 範圍內。
- 2013 之後有非 Cochrane 系統性回顧未讀：Alrwaily 2018、Cheng 2020（機械牽引，椎間盤突出）、Vanti 2021（機械牽引，腰神經根病）、Vanti 2023（機械牽引加物理治療，下背痛）、Zhao 2026（按摩加牽引，椎間盤突出）。文章不必引用，但「牽引最新的 Cochrane 回顧是 2013 年版，搜尋到 2012 年；之後還有非 Cochrane 的回顧我沒讀」應寫進 L78 或「沒講的」。2025 年的 Cochrane 總覽（Rizzo 2025，非藥物非手術下背痛治療）也沒讀。

## Confirmed
- Nuuttila 2026：50 研究、介入組 824 人（文章未寫 824，無礙）、RCT、健康成人 18–65、≥3 週；相對 VO2max ES=0.94，GRADE 對 VO2max/Pmax 為 high（VT1 與血壓／血脂為中或低，文章只說「這類結果」，OK）；強度次分析只在 VO2max 有關（p=0.02）；作者「lends support to the assumption that… (zone 2) may promote fitness-related adaptations」；"zone 2" 在摘要為 0 次，正文 2 次（引言、討論）；引言明說 zone 2 是 LIT 範圍的上緣，故「定義比 zone 2 寬」有作者自己的話可佐證（建議在 evidence.md 補這點，不再只是「我的解讀」）。「它沒有拿低強度去比較中高強度」成立（比較對象為對照組；作者也說 HIT vs LIT 是別的統合分析）。可考慮補一句該文的異質性（I²=0.73、作者提「prediction interval 寬」），非必要。
- Hogan 2026：42 研究、158 個效果量、1,505 人；FatMax 比 LT/GET 低約 5.78% VO2max（ES 0.74）；限制「只含健康族群」「群體平均」；"zone 2" 全文 0 次。小提醒：參與者平均年齡 28.1，範圍 13.9–48.5，15% 未滿 20 歲，「健康成人」略粗，可寫「健康、非肥胖的參與者（多為年輕成人）」。
- Meixner 2025 其餘：50 位自行車手（30 男 20 女）、騎車 >3 年、兩種測驗（ramp、step）、橫斷面、只有自行車，無追蹤訓練成果（作者限制自述）。
- Sitko 2025：14 位專家、共識措辭正確；Storoschuk 2025：摘要引述正確；Ovali 與 Cochrane 其餘數字見上。
- 搜尋重跑：Europe PMC `"zone 2" AND (training OR exercise)` = 3,469（與 evidence.md 一致）；懸吊搜尋 52 筆一致，前 25 筆確實只有 Ovali 一篇相關、一篇攀岩傷害社論，其餘無關；Cochrane 與 Ovali 兩條「找得到」的路徑可重現。

## 其他檢查
- 「找不到／沒有」限定：L37、L47、L70、L81、L87、L96、tldr 都有「在我查的範圍內／我看過的標題」類限定；L57、L54 的「全文沒有出現 zone 2」是對文本的事實陳述，已驗證（Hogan 0 次；Nuuttila 摘要 0 次）。缺限定者：L83 zh（見 #8）、L48（見 #1）。
- 只讀摘要的來源（Sitko、Storoschuk、Cochrane）：文中都明說只讀摘要，且僅引摘要內容，沒有被當全文用。Meixner 標「讀到摘要與引言」，但 L56 引用的是摘要的 "strong alignment"，與全文衝突（#2）。
- 歸屬標籤：文中對研究的標籤（全文／只讀摘要）屬正常揭露，沒有超量的立場標籤。
- 是否點名社群貼文作者或帳號：沒有。是否有「怎麼查證貼文」的方法教學：沒有；「今晚就能做的兩個動作」是讀一份摘要的練習，針對研究而非貼文，可接受，但動作 2 的措辭需修正（#9）。是否有懸吊怎麼做的處方（時間、次數、姿勢、握法）：沒有；L66 只是描述說法；L83 與 L39 已導向醫師或物理治療師。51% 體重的牽引力估計確實沒有寫入。
- 兩個網頁沒有點名受訪者（HSS 頁點名 Matthew Accetta、Everyday Health 點名 Josh Henkin，文章均未寫），符合。
- zh/en 一致性：除 #8 外，主張與數字一致。
