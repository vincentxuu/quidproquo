# Review: 2026-10-19-italy-crag-ulassai（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-ulassai.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-ulassai.md`。系列〈義大利岩場〉order 2005。作者自審（同一 agent），依 post-verify／post-review／post-polish 清單逐項檢查。

工具降級（toolDegradation）：Groundlane MCP 中途斷線 → Keenable keyless 搜尋＋r.jina.ai 讀頁；theCrag 在斷線前用 Groundlane html 抓到；climbingitaly、ARST 用 curl。原始擷取存於 scratchpad/sard/。

## post-verify

- 🟢 Climbing Ulassai（climbing 頁）：春 3–5 月、秋 9 月到 11 月中；775 m、比其他區低幾度、熱天可到 35 度上下；冬天雨可能連下幾天；「Of the 2000 routes around Ulassai」、多數 6、7 字頭、到 9a；外傾很少超過 15 度；錨栓「safe and well-thought」、定期維護、與市府更新老路線、指南收入用於重打；70 m／80 m（Su Casteddu、Bacilli、Scala Ussassa）、16 快扣；新路線落石、戴頭盔；「Bolting in Ulassai is regulated」與四個聯絡點；WhatsApp 群組；Dirt Bags 店與租裝備。
- 🟢 Climbing Ulassai（ulassai 頁）：卡利亞里 115 km、奧爾比亞 180 km、阿蓋羅 220 km；機場火車每 20 分鐘；巴士約 3 小時 15 分，最快 11:00、14:00；村子約 1 公里。
- 🟢 climbingitaly 區頁與 8 個子區頁：區頁原句、Jerzu 1989 起、三區超過 240 條、Ulassai 2002 起、2011 Nannai；Sa Tappara 154 條與標籤；各子區日照與季節標籤；表內全部路線的難度與長度；Su Sussiu 多段。
- 🟢 theCrag：Ogliastra 頁 Ulassai 983／9.6k、Jerzu 359、Osini 25、Ussassai 75；Ulassai 與 Jerzu 子區路線數；Marosini 警告原句（建立於 2026 年 10 月初）。
- 🟢 UKC 2018：「sandstone feel」、精選路線清單與難度、Logbook 熱門清單、超過 500 條走得到、「get away with not having a car」、Baunei 50 分鐘、4–10 月、朝東下午背陰、Olbia／Alghero 交通差、露營「is tolerated」與 Campo Sportivo、Jerzu 醫院與 Lanusei 急診 30 分鐘、「some rock is strictly off limits」、316L 或鈦。
- 🟢 Planetmountain（Oviglia）：Ulassai 距 Jerzu 5 km；新 SS125 約 1 小時 15 分、Cala Gonone 近 2 小時、Baunei 約 45 分鐘；約 800 m、春秋最好、夏天「coolest」；Educanza 2012 年「allungata」。
- 🟢 Planetmountain Festival 頁與官網：2026-05-30～06-01、第六屆、市府主辦、免費報名。
- 🟢 Climb Europe 書頁：約 1,300 條、Ulassai／Jerzu／Osini／Ussassai／Gairo、3–12 月、F6a–F7c+、2025 修訂第 6 版、義英、238 頁、收益用於打錨重打、附 GPS 與 QR code。climbing-guide.eu：作者欄 Ruben Becker、2023 版 Oviglia／Piras 112 頁、32＋6 區。
- 🟢 ARST 103 線：路線名稱與 Osini、Ulassai、Jerzu 站；只寫「少數班次」，不寫時刻。
- 🟢 CNSAS Sardegna：撥 112。
- 🔵→已修：UKC 精選與 climbingitaly 難度不同的四條（Vision crack、Bocabulario、Pink ball、Pugni volanti 名稱）在表內並列，中英同步。
- 🔵→已標明：露營與醫院資訊來自 UKC 2018，正文寫年份並建議到當地確認；Marosini 固定繩是 DB 使用者回報，正文寫明。
- 🟡 未寫：ARST 103 逐班時刻（表格欄位對不齊）；開車的具體道路編號只採 Planetmountain「新 SS125」。

## post-review

- 機械檢查：`climbing-grade-convert --check` 兩檔 48 列通過；`check-tw-terms` 0 blocking；`check-process-leak` 通過；`check-lang-parity` OK。
- 結構：H2 照契約順序，含大眾運輸／開車／停車三個 H3；四級路線表都有（6／7／5／6），本區幾乎沒有多段與傳攀，不另開表。
- 導言末句交代本篇幫讀者決定什麼；tldr 先講規模與風格，再講夏天可爬與交通限制。
- 規範：查無封閉也明寫；開線規範、錨栓維護、落石、救援都有一手出處（在地團隊、CNSAS）。
- 指南書條目首句照規格，三本書。
- 內文連結：包內伊（同批）、卡拉戈諾內、系列總覽、各子區頁、ARST、CNSAS 首次出現 inline；英文版連 `-en`。

## post-polish

- register-scan 第一輪：長句 11 句、但書段落 5%、引述區塊 0、姓名當主詞 0、模板化轉折 0；數字密集段 7 段（交通段 10 個）。
- 已改：「這是什麼樣的岩場」首段、「適合誰」、大眾運輸段各拆一句。
- 保留：交通與距離段的數字屬查表資訊；長句多含英文原句引用。
- 改後重跑 check-tw-terms，結果同前。
