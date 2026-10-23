# 攀岩器材文章的實測影片

適用：`climbing` 分類裡講器材與保護系統的文章——繩子、確保器、鉤環、快扣、吊帶、頭盔、岩楔／cam、固定點、bolt、頂繩架設、確保、裝備檢查與汰換。只講選購包款、行李、打包的文章不強制。

範例：`2026-10-17-building-anchors`（中英）。2026-10-23 九篇器材文章的研究紀錄與候選清單在 `.work/climbing-gear-videos-20261023/`，同主題可先 grep 那裡的 `hownot2.md`、`others.md`。

## 預設要做

1. **先找這兩個頻道**：[HowNOT2](https://www.youtube.com/@HowNOT2) 與 [Hard Is Easy](https://www.youtube.com/@HardIsEasy)。用 `yt-dlp --flat-playlist --print "%(id)s|%(title)s|%(duration)s" <頻道>/videos` 抓清單、依段落主題 grep。
2. **兩者沒拍到的主題才補其他頻道**：EDELRID Knowledge Base（實驗室 kN 數字）、BMC TV（檢查示範）、DMM（檢查與放置教學）、JB Mountain Skills（架設教學）。
3. **全篇 3–5 支**，放在最貼切段落的結尾，不是每節都要有；同一支影片一篇只嵌一次。找不到合適的就不放，不硬塞。
4. **每支配 1–3 句**：示範了什麼、從哪一秒看、最多一個關鍵數字，加半句限制。`youtube` fence 的 `title` 用「原標題（頻道名）」，英文版用半形括號；有可靠秒數才加 `start`。
5. **文末加頻道介紹**：`## 延伸觀看：器材實測與教學頻道`（英文 `## Further viewing: gear-testing and instruction channels`），放在練習題／下一步／系列回顧之後、更新紀錄與參考資料之前。只列本篇用到的頻道，但 HowNOT2 與 Hard Is Easy 一定列。文字用下方標準稿，事實不改。

## 查證（每支都要）

- 讀過字幕（`yt-dlp --skip-download --write-auto-subs --sub-langs en`）或說明欄才能列入；不能只看標題。
- oEmbed 或 yt-dlp 確認影片存在、標題與頻道一致；`start` 小於影片長度。
- 自動字幕可能聽錯數字，說明欄有寫的以說明欄為準。

## 限制與衝突

- 標明單次或少量樣本、慢拉不是落錘、非 EN／UIAA 標準測法；HowNOT2 有自家器材店、Hard Is Easy 多集與 Mammut 合作，相關時要講。
- 不准讓影片被讀成「舊的／磨損的／掉過的裝備可以繼續用」。露芯繩、舊扁帶還很強這類片，要嘛不用，要嘛明寫汰換照原廠。
- 影片和文章來源不一致時：不用那支，或兩種說法並列並以標準／原廠／較保守的為準。不准改掉文章有來源的事實去配合影片。
- 影片後段立場與本文衝突時，用 `end` 限定片段並說明其餘部分不採用。

## 頻道介紹標準稿

### zh-TW

- **[HowNOT2](https://www.youtube.com/@HowNOT2)**：Ryan Jenks 經營，2016 年從走繩（highline）安全教學起家，後來把攀岩、洞穴、溪降器材拿去拉斷，還有在真岩上拉 bolt 的 Bolt Busters 系列。看點是「標示強度以外」的情況：打結、磨損、舊裝備、放錯位置。限制：多數是自製機器慢拉、每組 1–3 個樣本，他自己也說這是娛樂不是科學；頻道背後有網路器材店，部分受測品是店內商品。
- **[Hard Is Easy](https://www.youtube.com/@HardIsEasy)**：署名 Ben 的攀岩者獨自經營，以前是軟體工程師。一次在泰國 Tonsai 看到確保者接太硬、攀者撞上岩石，他回家設計實驗，從此專拍確保、繩子、鉤環與確保器的實驗與物理解說，近年多支在 Mammut 實驗室合拍。限制：實驗多是自己設計，不是 EN／UIAA 標準測試。
- **[EDELRID Knowledge Base](https://www.youtube.com/@EDELRIDKnowledgeBase)**：德國器材廠 EDELRID 的產品與教育團隊 2025 年開的頻道，在自家實驗室做拉力、落錘、銳角切割測試，會報 kN 數字。限制：廠商頻道，畫面多是自家產品。
- **[BMC TV](https://www.youtube.com/@teamBMCTV)**：英國登山協會（BMC）的頻道。2017 年拍的一系列 1–3 分鐘短片逐步示範怎麼檢查繩子、吊帶、頭盔、鉤環、bolt。限制：只示範、不測數字，是英國情境。
- **[DMM](https://www.youtube.com/@dmmclimbing81)**：威爾斯 Llanberis 的器材廠，頻道多為產品片，但有一組自家出的鉤環、cam、扁帶與繩子檢查教學，和傳攀放置教學。
- **[JB Mountain Skills](https://www.youtube.com/@JBMountainSkills)**：北威爾斯的攀岩與登山教練 Jez 經營，大量固定點、頂繩架設的實作教學。限制：教練個人經驗與英國作法，沒有實驗數據。

### en

- **[HowNOT2](https://www.youtube.com/@HowNOT2)**: run by Ryan Jenks. It started in 2016 as highline safety instruction and grew into breaking climbing, caving and canyoneering gear, plus the Bolt Busters series that pulls bolts out of real rock. Its value is in the cases beyond the rated number: knots, wear, old gear, bad placements. Limits: most tests are slow pulls on a home-built rig with one to three samples, and Ryan himself calls it entertainment, not science; the channel is backed by an online gear shop, and some tested items are sold there.
- **[Hard Is Easy](https://www.youtube.com/@HardIsEasy)**: run solo by a climber who signs as Ben, a former software developer. After watching a hard catch slam a climber into the rock in Tonsai, Thailand, he designed his first experiment; the channel now focuses on experiments and physics explanations about belaying, ropes, carabiners and belay devices, with several recent episodes filmed in Mammut's lab. Limits: most experiments are his own design, not EN/UIAA standard tests.
- **[EDELRID Knowledge Base](https://www.youtube.com/@EDELRIDKnowledgeBase)**: launched in 2025 by the product and education team at the German manufacturer EDELRID. Pull, drop and sharp-edge tests in their lab, with kN figures. Limits: a manufacturer channel, mostly showing its own products.
- **[BMC TV](https://www.youtube.com/@teamBMCTV)**: the British Mountaineering Council's channel. A 2017 series of one-to-three-minute clips walks through inspecting ropes, harnesses, helmets, carabiners and bolts. Limits: demonstration only, no measurements, UK context.
- **[DMM](https://www.youtube.com/@dmmclimbing81)**: the Llanberis, Wales manufacturer. Mostly product videos, but it has its own inspection guides for carabiners, cams, slings and ropes, and trad placement lessons.
- **[JB Mountain Skills](https://www.youtube.com/@JBMountainSkills)**: run by Jez, a climbing and mountaineering instructor in North Wales; lots of hands-on anchor and top-rope setup lessons. Limits: one instructor's experience and UK practice, no test data.

頻道事實查於 2026-10-23；經營者、合作廠商有變動時更新本檔。
