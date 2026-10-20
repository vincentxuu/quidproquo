# Airlines C — JAL / ANA / Korean Air / Ryanair / easyJet / United

範圍：攀岩者帶硬體、從台灣出發、經濟艙。只用航空公司自家網站。全部 accessed 2026-10-19。

工具紀錄（toolDegradation）：Groundlane MCP 不可用、Groundlane HTTP 回 401（依指示跳過）→ 搜尋用 Keenable keyless → 讀頁用 curl＋HTML strip（ANA、easyJet hold-luggage、easyJet dangerous-goods 原始 HTML、Korean Air newsroom 成功；JAL、Ryanair、Korean Air 主站回 403；United 連線重置）→ Exa `web_fetch_exa`（JAL、Ryanair、easyJet、United 成功；Korean Air 主站回空內容）→ 內建 WebFetch（United、Korean Air 都逾時 60s）→ Chrome 擴充（沒連上）→ Playwright headless（Korean Air 回 ERR_HTTP2_PROTOCOL_ERROR，像是 Akamai 擋 bot；firefox/headful 沒安裝執行檔）。

## 摘要表

| 航空 | 托運額度概念（經濟艙） | 攀岩/登山裝備有列在運動裝備？ | 運動裝備費用 | 每件上限 kg | 托運尺寸 | 手提行李尺寸 / kg |
|---|---|---|---|---|---|---|
| JAL | 計件：2 件 × 23 kg（國際線經濟艙／豪華經濟艙） | 否（只舉例高爾夫、衝浪、潛水、自行車等，用來提醒包裝） | 沒有獨立運動費用；超額照一般費率（日本–亞洲：加一件 JPY10,000；23–32 kg 加 JPY6,000） | 23 kg 免費；超重可到 45 kg（付費）；32 kg 以上要先洽詢 | 三邊和 ≤ 203 cm | 1 件手提＋1 件個人物品，合計 10 kg；三邊和 115 cm 以內，55×40×25 cm |
| ANA | 計件：經濟艙「0–2 件」，依票種而定，每件 23 kg | 否（列自行車、衝浪板、高爾夫、釣具、潛水、球拍、滑雪/單板「等」） | 算在免費額度內就不另收費；超過額度收超額行李費；158–292 cm 免收超大件費 | 23 kg（經濟艙）；行李單件上限 32 kg | 三邊和 ≤ 158 cm；超過 292 cm 不收 | 1 件手提＋1 件個人物品，合計 10 kg；55×40×25 cm 且三邊和 115 cm 以內；個人物品 40×30×20 cm |
| Korean Air | **官網主站讀不到**（見文末） | 未查證 | 未查證 | 未查證 | 未查證 | 自家 newsroom（2023-07-04）：經濟艙 1 件手提＋筆電/公事包/手提包 1 件，合計 10 kg；三邊和 115 cm 或 55×40×20 cm |
| Ryanair | 付費重量制：10 kg / 20 kg（最多 3 件）/ 23 kg（最多 1 件）托運 | 否：「大型運動裝備」清單（釣竿、高爾夫、自行車、滑板車、擊劍、撐竿、標槍、衝浪板、趴板、單板、滑雪）沒有攀岩/登山 | 運動裝備 €/£40（訂票時）/ €/£45（訂票後/機場）；大型運動品項 €/£60 / €/£70；滑雪 €/£45 / €/£50；每件上限 20 kg（自行車 30 kg） | 運動裝備 20 kg；托運依購買的級距 | 托運尺寸：官方頁沒寫 | 免費小包 40×30×20 cm（放座位下）；Priority & 2 Cabin Bags：另加 10 kg 55×40×20 cm |
| easyJet | 付費重量制：15 kg 或 23 kg（線上可每次加 3 kg；收費頁另列 26/29/32 kg），每人最多 3 件，單件 ≤ 32 kg | 否：小型（20 kg）＝高爾夫、滑雪板與雪靴、單板、潛水、飛行傘、撐竿 ≤ 450 cm、運動槍；大型（32 kg）＝自行車、獨木舟/皮艇、風帆/衝浪板、滑翔翼。未列出的品項要聯絡客服 | 小型 £45 線上 / £52 機場（≤ 20 kg）；大型 £55 線上 / £60 機場（≤ 32 kg）；運動裝備和托運行李的重量不能合併計算 | 32 kg | 三邊和 < 275 cm | 免費小型手提 45×36×20 cm，**最多 15 kg**；付費大型手提 56×45×25 cm，15 kg |
| United | 計件：托運行李經濟艙每件 23 kg；台灣出發標準經濟艙的免費件數**未查證**（只能用費用試算器查）；基本經濟艙：「多數」跨太平洋國際線含 1 件免費 | 否（列射箭、自行車、露營、擊劍、釣魚、高爾夫、滑雪、潛水等，沒有攀岩/登山） | 運動裝備算在托運額度內；適用超大/超重/額外件費用；滑雪/單板免超大件費，超過 23 kg 收超重費 | 23 kg（經濟艙） | 76×52×30 cm 或三邊和 62 in（158 cm） | 手提 23×35×56 cm；個人物品 22×25×43 cm；頁面**沒有寫重量上限** |

## 原文摘錄

### JAL
- 托運：「Premium Economy Class / Economy Class — 2 pieces — 23㎏/piece」；「A + B + C ≤ 203 cm」— https://www.jal.co.jp/jp/en/inter/baggage/checked/ （accessed 2026-10-19）
- 同頁，日本–亞洲：「Additional bag (per piece) | JPY10,000」、「23㎏ - 32㎏: JPY6,000」；「Each piece of checked baggage must not exceed 45 kg.」
- 同頁，運動裝備只用來提醒包裝：「sports gear (golf clubs, surfboards, windsurfing gear, diving gear, bicycles, etc.)」
- 手提：「The total weight of both items must not exceed 10kg (22lbs).」；「Within 115cm (45in)」；「W: within 55cm×H: within 40cm×D: within 25cm」— https://www.jal.co.jp/jp/en/inter/baggage/inflight/ （accessed 2026-10-19）
- 限制品：「Sharp objects (such as scissors and knives) and items that have the potential of being used as weapons (such as golf clubs) are not allowed to be carried on board.」；「Items with exceptionally sharp points」— https://www.jal.co.jp/jp/en/inter/baggage/limit/ （accessed 2026-10-19）。**沒有點名冰斧／冰爪。**
- 唯一跟登山有關的條目：「Non-medical purposes (mountain climbing, sports, etc.) — Prohibited in both carry-on and checked baggage」（指氣瓶）— https://www.jal.co.jp/jp/en/inter/baggage/limit/attention/ （accessed 2026-10-19）

### ANA
- 托運：「Premium Economy, Economy Class — Up to 23 kg / 50 lb per piece」；「no more than 158 cm」；「Economy Class — Between 0-2 pieces」；「Free baggage allowance varies depending on fare rules.」— https://www.ana.co.jp/en/jp/guide/boarding-procedures/baggage/international/baggage-free/ （accessed 2026-10-19）
- 大件：「The weight of checked baggage is limited to 32 kg per piece.」；超過 292 cm、45 kg 或 20 件不能托運 — https://www.ana.co.jp/en/jp/guide/boarding-procedures/baggage/international/baggage-size/ （accessed 2026-10-19）
- 運動裝備：「can be checked in free of charge as long as the number of items and the weight do not exceed the free baggage allowance」；清單是 Bicycles / Surfboards / Golf bags / Fishing equipment / Diving equipment / Rackets / Skis, snowboards / Etc.；「158 cm (62 in.) to 292 cm (115 in.) — Excess baggage charge for oversize baggage is waived」— https://www.ana.co.jp/en/jp/guide/boarding-procedures/baggage/international/bicycle/ （accessed 2026-10-19）
- 手提：「one carry-on bag and one personal item, with a total combined weight not exceeding 10 kg」；「within 115 cm, and the individual dimensions must be within 55 cm × 40 cm × 25 cm」；個人物品「Within 40 cm × 30 cm × 20 cm」— https://www.ana.co.jp/en/jp/guide/boarding-procedures/baggage/international/carry-rule/ （accessed 2026-10-19）
- 禁止帶上機：「All blades (including knives, scissors, razors, axes, billhooks, and chisels); tools, ice skates, bats, golf clubs, and other items deemed to be potential weapons.」圖示清單裡有「Ice Picks」— https://www.ana.co.jp/en/jp/guide/boarding-procedures/baggage/international/caution-restriction02/ （accessed 2026-10-19）。**沒有寫「ice axe」或「crampon」；冰斧算在「axes／potential weapons」裡是推測。**
- 托運和手提都禁止：露營用爐具、瓦斯罐、運動用氧氣瓶 —「compressed gases (including gas cartridges for gas cartridge stoves, oxygen canisters for sports…)」— https://www.ana.co.jp/en/jp/guide/boarding-procedures/baggage/international/caution-restriction/ （accessed 2026-10-19）

### Korean Air
- 手提（大韓航空自家 newsroom，2023.07.04，韓文）：「일반석 기준으로 승객당 1개의 휴대 수하물을 반입할 수 있습니다」；「휴대 수하물의 무게는 총 10kg까지만 기내 반입이 가능합니다」；「세 변의 합이 115cm 또는 각 변이 각각 20cm, 55cm, 40cm 이내」— https://news.koreanair.com/%ec%b9%bc%ed%86%a1_kaltalk-%ec%97%ac%ed%96%89%ec%9d%84-%ea%b9%94%eb%81%94%ed%95%98%ea%b2%8c-%ec%a4%80%eb%b9%84%ed%95%98%eb%8a%94-%eb%b2%95-%ec%88%98%ed%95%98%eb%ac%bc-%ec%9d%b4%eb%a0%87%ea%b2%8c/ （accessed 2026-10-19；這是 2023 年的文章，可能不是現行規定）
- 托運額度、運動裝備、限制品：官網主站讀不到，見文末。第三方網站寫的「亞洲航線經濟艙 1 件 23 kg」、「運動裝備最大 292 cm／32 kg」**沒有採用**。

### Ryanair
- 「All our fares include one small personal bag … (40 x 30 x 20 cm)」；「Priority & 2 Cabin Bags: … a 10kg bag (55x40x20cm) onboard」；「Passengers can purchase up to 3 checked bags of 20kg」；「up to 1 checked bags of 23kg」— https://help.ryanair.com/hc/en-gb/articles/12888036565521-Ryanair-s-Bag-Policy （accessed 2026-10-19）
- 運動裝備：「You are permitted to carry any sports equipment with you onboard as long as it fits within your cabin bag allowance.」；「Large sporting equipment (including large fishing rods, golf clubs, bikes, scooters, fencing equipment, pole vaults, javelins, surfboards, bodyboards, snowboards, and skis) …」；「for a fee, these items each weighing up to 20kg can be carried in the hold.」— https://help.ryanair.com/hc/en-gb/articles/12888834233489-What-sports-equipment-can-I-bring-on-board （accessed 2026-10-19）
- 收費表：「Sports equipment €/£40 €/£45 … Maximum weight of 20kg per item.」；「Large sports item €/£60 €/£70」；「Ski equipment €/£45 €/£50」；「20kg Check-in Bag … €/£18.99 - €/£59.99」；「10kg Check-in Bag … €/£9.49 - €/£44.99」— https://www.ryanair.com/gb/en/useful-info/help-centre/fees （accessed 2026-10-19，經 Exa 讀取，Exa 可能用快取）
- 限制品（不能帶上機，但可以托運）：「Ice axes, ice picks and ice skates」；「crampons, grappling irons, hooked bars of iron and plates with iron spikes used in mountaineering」；「Ski poles and walking or hiking poles」；工具類「tools with a blade or a shaft of more than 6 cm」、「hammers, pliers, wrenches and spanners」— https://help.ryanair.com/hc/en-gb/articles/12890928594705-What-items-are-prohibited-on-board-and-in-Check-in-Bags （accessed 2026-10-19）

### easyJet
- 手提：「one small under seat cabin bag … maximum size of 45 x 36 x 20 cm … Your bag can weigh up to 15kg」；「large cabin bag on board (max. 56 x 45 x 25 cm …)」「Maximum weight 15kg」— https://www.easyjet.com/en/help/baggage/cabin-bag-and-hold-luggage （accessed 2026-10-19）
- 托運：「You can select a 15kg or 23kg hold bag, and add extra weight online in 3kg increments」；「no single bag can weigh more than 32kg」；「Maximum total size (length + width + height) = under 275cm」；「you cannot pool weight between hold bags and sports equipment」— https://www.easyjet.com/en/help/baggage/hold-luggage （accessed 2026-10-19）
- 運動裝備：「Small (20kg max) | Large (32kg max)」清單（Golf clubs / Skis and boots / Snowboards / Diving equipment / Paraglider / Pole vaults up to 450cm / Sporting firearms；Bicycles / Canoes and kayaks / Wind surfers or surfboards / Hang gliders）；「To check items that aren’t included on the list above … please contact our Customer Services Team.」— https://www.easyjet.com/en/help/baggage/sports-equipment （accessed 2026-10-19）
- 收費：「Small sports equipment per item, per flight — £45 / £52」；「Large sports equipment … £55 / £60」；「Hold bags can be purchased … weighing up to 15kg, 23kg, 26kg, 29kg or 32kg」；「Excess weight fee per kilo … £12」— https://www.easyjet.com/en/terms-and-conditions/fees （accessed 2026-10-19）
- 限制品（「Objects with a sharp point or sharp edge」，AllowedInCabin=false、AllowedInHold=true，取自頁面原始 HTML 的資料欄位）：「ice axes and ice picks」；「ski and walking/hiking pole and crampons」；工具「tools with a blade or a shaft of more than 6 cm」— https://www.easyjet.com/en/help-centre/baggage/dangerous-goods （accessed 2026-10-19）

### United
- 托運：「The maximum size of a checked bag can be 30 in x 20 in x 12 in (76 cm x 52 cm x 30 cm) or 62 total in.」；「United Economy ® Premium Economy ® | 50 pounds (23 kilograms)」；「Bag fees for flights between countries in Asia increased for tickets purchased on or after July 21, 2026.」— https://www.united.com/en/us/fly/baggage/checked-bags.html （accessed 2026-10-19）
- 基本經濟艙：「On most** international flights across the Pacific, you’ll get one free checked bag.」（「**For details on your flight, check the bag calculator.」）— https://www.united.com/en/us/fly/travel/inflight/basic-economy.html （accessed 2026-10-19）
- 手提：「9 in x 14 in x 22 in (23 cm x 35 cm x 56 cm)」；個人物品「9 in x 10 in x 17 in (22 cm x 25 cm x 43 cm)」；頁面沒有寫重量上限 — https://www.united.com/en/us/fly/baggage/carry-on-bags.html （accessed 2026-10-19）
- 運動裝備：「You can fly with most sports equipment. The equipment counts toward your checked bag allowance and may be subject to fees.」；滑雪「If the set weighs more than 50 pounds (23kg), you’ll have to pay overweight bag fees.」；露營「Tents / Backpacks or knapsacks / Sleeping bags」，爐具要「brand new」或燃料已清空並附證明信；**沒有攀岩/登山分類**— https://www.united.com/en/us/fly/baggage/sports-equipment.html （accessed 2026-10-19）
- 限制品：托運頁只連到「See list of items prohibited by the TSA」（TSA 不是航空公司網站，沒有引用）。

## 沒查證到的項目（附嘗試過的工具）

1. **Korean Air 托運額度（台灣出發經濟艙件數/kg）、運動裝備規定、限制品（冰斧）**：koreanair.com 主站 — curl（含 --http1.1）回 403 Access Denied（Akamai）；Exa fetch 回空內容或 unknown error；WebFetch 逾時；Playwright headless chromium 回 ERR_HTTP2_PROTOCOL_ERROR；Chrome 擴充沒連上。手提的數字只能用 2023 年 newsroom 文章，可能過時。
2. **United 台灣出發標準經濟艙的免費托運件數**：只能用 JS 費用試算器查（united.com/en/US/baggage-calculator）；Exa／WebFetch 讀不到試算結果。United 的手提重量上限：官方頁沒寫，不代表確定沒有限制。United 自家的冰斧／冰爪規定：沒找到 united.com 頁面（只連到 TSA）。
3. **ANA 台灣出發經濟艙確切件數**：官方只寫「0–2 pieces」依票種而定，要看機票上的額度。
4. **Ryanair 托運行李尺寸上限**：官方 help 頁沒寫；ryanair.com/gb/en/check-in-bag 經 Exa 回空內容。收費表的 23 kg 級距金額在 Exa 截斷前沒讀到。
5. **JAL**：jal.co.jp/jp/en 底下沒找到獨立的運動裝備頁（Keenable 只回 jal.co.jp/jba/... 第三方網域頁，沒用）；限制品頁沒有點名冰斧／冰爪。
6. 推測：在 JAL／ANA，冰斧、冰爪、岩釘錘大概會被歸到「sharp points／axes／tools／potential weapons」所以不能帶上機；**兩家都沒有原文點名**。
