# 泰國岩場研究整合

2026-10-21 起始。主要證據來源：`docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md`（泰國章節，2026-10-07 查證）、theCrag 各岩場頁（2026-10-21 讀取）、Mountain Project（2026-10-21 讀取）、CMRCA 官網與行程筆記的既有收錄。

## 證據入口（2026-10-21 完整抓取後的最終清單）

逐區的 theCrag 路線資料已全部抓下來，存成 JSON，每個檔案含 sector、url、area_route_count 與 routes 陣列（grade／stars／name／url／style／length／pitches／bolts／desc／setter／warnings）：

- `routes/ton-sai/*.json`：Tonsai 23 個子區共 445 條（`_all.json`）。theCrag 頁面標 448 條，差額 3 條是 theCrag 未在三個子頁列出的（記在 `_failed.json`）。
- `routes/railay/*.json`：Railay 19 個子區（含 `_index.json`）
- `routes/chong-phli/*.json`：Chong Phli 6 個子區
- `routes/north-wall/*.json`：North Wall 6 個子區共 103 條（`_all.json`）
- `routes/crazy-horse/*.json`：Crazy Horse 15 個子區共 208 條
- `routes/lopburi/*.json`：華富里 8 個子區共 127 條（`_all.json`）
- `routes/namphapayai/*.json`：北標 4 個子區共 101 條（`_all.json`）
- `routes/koh-tao/*.json`：龜島 15 個子區共 496 條（`_all.json`）
- `routes/lampang.json`、`routes/chiang-dao.json`：南邦 21 條、清道 30 條
- `routes/mp-classics.json`：Mountain Project 15 個泰國區域的經典路線表

**關鍵發現（都寫進正文，因為只看路線數會錯）：**

- **整批不可爬的子區**：Tonsai 的 Shadow Wall 12 條與 Iguana Park 6 條全區標 Closed（Shadow Wall 每條都寫「舊吊帶，不要爬」）；Railay 的 Universe Wall 5 條全不可爬、Happy Island 13 條有 10 條不可爬、Jungle Gym 15 條有 9 條不可爬；Resort Cave 6 條有 4 條不可爬（另兩條是 8a 與 8b）。
- **子區層級的生物警告**：North Wall 的 Jurassic X-Mas「Hornet situation as of 9.3.2026」、Rock'n Roll 整區「Bird nest」；Railay 的 Hidden World Rocket Head「蜂巢」、Tonsai 的 Monkey World 兩條「藤蔓擋住通往 belay ledge 的路」。
- **物理條件**：Koh Tao 的 Boulder 5「Abrasive rock」、Boulder 7「watch the tide」、Boulder 9「low tide only」；Chong Phli 每年檢查所有確保點與吊帶。
- **級距上限**：Tonsai 最高 8c+（Greed）、8b+（Avocado Power、Of Popes and Power、Dragon Ball、Czech Open、Black Bird、Truls）、8b（Sissyfuss、Jai Dum、Ant Jump、Cara Cangreso）；Chong Phli 最高 8c/c+（三條開放專案）；North Wall 最高 9a（Furiosa，開放專案）。

## 工具與限制

theCrag 直接 curl 與程式化 fetch 一律回 403（Cloudflare）。`webfetch` 工具可讀完整頁面（輸出存到 tool-output 檔），Playwright 只在第一次請求成功、第二次起被封。因此本輪路線資料以 `webfetch` 讀取的 theCrag 頁面為主，Mountain Project 用 curl 讀（MP 沒有 Cloudflare 阻擋）。

`r.jina.ai` 代理對 theCrag 回傳快取空頁，不可用。

## 研究足夠的判準

1. 關鍵主張：每個岩場的岩質、風格、路線數與子區結構都回到 theCrag 原頁；路線級數回到 theCrag 逐條表或 Mountain Project 經典表。
2. 來源分工：theCrag 支撐路線數、級數、子區與岩栓描述；Mountain Project 支撐多段的段數與跨區交叉檢查；CMRCA 官網支撐 Crazy Horse 與 Lampang 的進入規定；外交部領事事務局支撐入境規定；行程筆記支撐交通、價格與封閉史。
3. 新資料：所有 theCrag 頁面讀取日為 2026-10-21；行程筆記的交通與價格資料為 2026-10-07。
4. 反證：Crazy Horse 沒有官方重開公告；theCrag 的 Railay 頁自述「2023 年撰寫時仍在重打，本站許多資訊已過時」；Nam Pha Pa Yai 只有 River Wall 關閉、不是整個營地；Koh Yao Noi 官方禁止；Chiang Dao 在國家公園內且標 Tolerated。全部在正文處理，不寫成官方確認。
5. 替代檢索：theCrag 被擋時改用 MP curl 與 `webfetch`；泰文地名、英文地名與中文旅遊資料交叉。查不到就寫「未查到」。

## 逐篇已查證要點

### Tonsai（Ton Sai）
- theCrag 448 條、Mostly Sport climbing、25,344 次攀登、168 張照片。子區：Ton Sai Wall & Roof 64、Tiger Wall 11、Dum's Kitchen 36、Tyrolean Wall 22、Eagle Wall 39、Cobra Wall 9、Melting Wall 21、Fire Wall 21、Cat Wall 12、The Nest & Wild Kingdom 35、Monkey World 15、Big Wave Pillar 7、Temple Boulder Cave 71（抱石）、Generator Wall 6、The Gibbon Roof 19、Resort Cave 6。Iguana Park 與 Shadow Wall 標為 Closed。
- 官方描述：5c 到 8c、三維石灰岩、大 jug 到小 pocket、sloper、鐘乳石、tufa、洞穴。簡單路線在 11–3 月旺季很擁擠且被磨到發光。Lord of the Thais（7b）被列為世界最佳之一。
- 無公路；從 Ao Nang 搭長尾船，只在白天行駛。海灘側多數牆到中午前有蔭，西側下午有蔭。禁止露營。住宿從竹屋到度假村都有。
- 多段經典：Humanity 6b+（7 段）、The Wave 6b（4 段）、Lord of the Thais 7b（5 段）、Orange Chandeliers 6c（3 段）、Crystal Flame 6b+（3 段）、The Candlestick 6c（2 段 70 m）。

### Railay
- theCrag 314 條、19,094 次攀登。頁面自述「撰寫時（2023）仍在重打，網站許多資訊已過時」。
- 結構：Railay West（Wee's Present 20、Thaiwand 29、Candlestick 5、Railay Beach Corner 已關閉、Lap Lair 1）、Railay East 右（Muay Thai 24、One-Two-Three 31、Duncan's Boot 10、Hidden World 8、The Keep 9、Jungle Gym 15、Low Tide Wall 9、Castle Wall 4、Project Wall 8、CoCo Wall 4、Diamond Cave 28、Amphitheater 11）、Phra-Nang Beach（Phra-Nang Beach 24、Escher World 26、Happy Island 13、The Defile 13、Universe Wall 5、DWS Wall 1 深水抱石）。
- 白天 9 點到 16 點攀岩學校最擁擠（Muay Thai、One-Two-Three、Diamond Cave 頁面都寫）。
- Thaiwand 多段：Lord of the Thais 7b 5 段 120 m（可合併成單段）、Circus Oz 7a 4 段 120 m、Continental Drifters 7c+ 4 段 99 m、Inaka 7b 4 段 120 m（theCrag 直接寫「這條很亂，不要爬」，1996 年後未重打）。
- Candlestick 5 條：Approach Pitch 3+、The Red Line 6c+ 2 段、Crystal Flame 6b+ 3 段 70 m、The Candlestick 6c 2 段 70 m、Thai Stick 6c 2 段 70 m。接近路線要爬 30 m 固定繩。
- Diamond Cave：北面左側三條舊膨脹栓線不可爬；Keep the Jam, Man 只有前兩段重打；洞內舊路線因國家公園幾乎確定不能爬。

### Ao Nang 本島（North Wall、Chong Phli）
- Krabi Mainland 合計 346 條。North Wall 103 條、Chong Phli 157 條。
- North Wall：入場費 50 THB 全日、全鈦栓（Hilti 500 膠）、多數雨天可爬、有廁所、需租裝備；停車必須停在外頭（用 Emerald Muay Thai 拳館入口），有竊賊盯裝備；私人土地，禁鑽孔改造岩面。
- Chong Phli：約 90% 鈦栓（RE-500 膠），部分路線因岩質軟改用 sling，確保點與 sling 每年檢查；岩場旁有 homestay 與社區中心。

### 華富里 Khao Jeen Lae
- theCrag 127 條、FR 3a–8a。Temple Area 38、Secret Garden 43、Kitchen Wall 19、Sukhumvit 15、Star Wall 10、Easter Island 2。
- Tolerated。經 Wat Pa Suwannahong 寺院；到離都要打招呼、捐 20–100 THB。2023-03 起每天限 20 人且須事先登記，18:00 前離開。車停寺院對面 1st Pitch Thailand，勿停鐵絲圍籬邊。
- 兩種接近：Temple Access 10–20 分鐘、Back Access 20–30 分鐘到 Secret Garden。

### 北標 Nam Pha Pa Yai
- 101 條：River Wall 65、Bat Cave Wall 17、Peaceful Wall 12、School Wall 7。營地收 100 THB 吊索與停車費，4–6 月休園。River Wall 自 2024-01 因進入問題關閉，theCrag 掛「疑似一年前因進入管制關閉，未見變更」的警告。

### 清邁 Crazy Horse
- 289 條、FR 4a–8b、22 個子區。Heart Wall 36 條但從停車場走 15 分鐘，其餘多數幾分鐘。距離清邁市約 45 分鐘車程。
- 封閉史：2018-07 封閉、2022-09 重開、2024-06 又見禁止告示；沒有官方重開公告，但 CMRCA 照常賣接駁、UKC 寫「據 CMRCA 表示已重開」、2026-01 有上傳影片、2027-01 有帶團公告。

### 清道 Chiang Dao
- theCrag 61 條、FR 5b–8a+（頁面描述稱約 100 條）。主牆 Padaeng / Main Wall 30 條，另有 Pit Stop 11、White Whale 8、Japanese Wall 7、Pa Lai 4、Vagabond 1。
- 在國家公園內，狀態 Tolerated。約 2019 年公園曾立牌禁止攀岩，牌後來燒毀；巡山員偶爾要求停止，被要求就配合離開。曾在某處停車踩農田引發糾紛，該岩壁因此不能再去。
- 2025-03-01 至 05-15 清道野生動物保護區因防火封閉（Nation Thailand）；2027 年日期未公布。

### 南邦 Lampang
- theCrag 25 條（CMRCA 稱 50 條以上含多段）。The Veteran Wall 11、The Ranger wall 10、No Name 4。FR 5b–6c+。
- 軍方土地，必須事先向 CMRCA 登記並取得許可，只在 CMRCA 嚮導在場的日子開放。theCrag 標 Paid + Private。鬆石仍多，要戴頭盔。

### 龜島 Koh Tao
- 496 條、以 FB 抱石級數為主（1A+–8A+），另有運攀與傳攀。Backyard & Frontyard 123 條、Lang Khai 80、Tanote Bay 68、Golden View 48 條運攀。
- 部分岩場進入敏感，須聯絡 Koh Tao Climbing Club；未經許可不可打栓。指南是 Rakkup App（US$8，收益全數投入開發），The Bunker 提供免費 PDF。

### 不成篇的
- Koh Yao Noi：2017 年起官方禁止攀岩，150 條以上路線仍有人爬。只在總覽說明，不單獨成篇。
- 深海抱石（DWS）合法性有爭議：2016 年海洋公園規定視為禁止，但仍有業者照常出團。只在總覽提示風險。
- Phi Phi、Ko Lao Liang、Muak Lek、Chon Buri、Rayong、Phetchaburi、Prachuap Khiri Khan、Chiang Rai、Sikhio 等有 theCrag 條目但資料量不足以支撐一篇，列為延伸池。
