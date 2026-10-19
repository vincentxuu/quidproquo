# 背包電商價格快照

查核日：2026-10-19。公開未登入頁面；未選配送地、未結帳、未驗證可寄台灣。以下是頁面商品價，不含未確認的運費、匯差、信用卡費、進口稅及可能的退稅；不是最低價或到手價排行。跨USD/EUR/GBP不換算。店頁寫In stock/Available仍不代表每色、每背長都有貨。

工具：先Groundlane本機web_search（pack-price-search1–3.json）與web_fetch；aer/crag/wadi成功（pack-price-{aer,crag,wadi}.json），其餘同批socket closed後bounded fallback改Exa search/fetch。Oliunid搜尋出staging站，已排除staging價。Exa資料不冒稱Groundlane驗證。

## 12款至少一個可見商品價／明確缺口

除明列VAT者，含稅狀態一律未知。USD是美國頁/美元商店；Oliunid `.com`顯示美元，不能以它當台灣結帳幣別。缺貨仍可作標價參考，不能寫成可買價格。

| 型號／規格 | 店與可見商品價 | 顏色／尺寸／庫存與版次 | 稅及可比性 |
|---|---|---|---|
| BD Rock Blitz15／15L、403g | [Oliunid](https://www.oliunid.com/bd-black-diamond-rock-blitz-15-l-multi-pitch-climbing-backpack) USD55.63（原74.29） | Universal；In stock；抽取未顯示色。403g相符，但未顯示再生布新版SKU，版次未完全鎖定 | 稅未知；不是同色同SKU最終比價 |
| Blue Ice Wadi15／15L | [Blue Ice US](https://us.blueice.com/products/wadi-15-pack) USD99.95 | 選中North atlantic；另列Vulcan；Sold out | 稅未知；缺貨標價 |
| Petzl BUG／18L、新665g版 | [Petzl US](https://www.petzl.com/US/en/Sport/Packs-And-Accessories/BUG) USD109.95 | S073AB00黑、AB01橘、AB02煙燻藍三參考號均同價；庫存未明 | 稅未知；新版價格可用，不與舊525g折價混比 |
| Osprey Mutant22／22L | [CDC Greece](https://www.cdc.gr/climbing/packs/osprey-mutant-22-unisex-en/) EUR140.00 | Tungsten Grey，OS10004559，In stock；NanoFly/robic，現行同系列但非BlueFlame色 | 明示VAT included；不是Osprey官網「as low as140」冒充選定價 |
| BD Creek50／50L | [BD US](https://blackdiamondequipment.com/products/creek-50-pack) USD259.95 | S/M與M/L為範圍，未鎖選中背長；Out of Stock；本次官方材料列Ballistic Nylon | 稅結帳計；缺貨、尺碼未鎖，不作同規格差價結論 |
| Patagonia Cragsmith45／45L、48066 | [Patagonia US](https://www.patagonia.com/product/cragsmith-climbing-pack-45-liters/48066.html?cgid=luggage-technical-packs&dwvar_48065_color=BLK) USD229 | BLK；420D/1420g現行規格；尺碼文字自相矛盾（OneSize與S/M/L皆列），庫存未明 | 稅未知；不把尺碼推定成已選好 |
| BD Crag40／40L、941g | [BD US](https://blackdiamondequipment.com/products/crag-40-backpack) USD159.95 | Carbon；頁SKU BD6812980003S_M1（S/M）；Out of Stock | 頁明示taxes/shipping calculated at checkout；缺貨參考 |
| Mammut Neon45／45L | [Oliunid](https://www.oliunid.com/mammut-neon-45-crag-backpack) USD138.39（原162.35） | In stock；45L、62×31×31cm；未抽到色/SKU；非Women版頁 | 稅未知；顏色及精確版次待鎖 |
| Osprey Farpoint40／40L、現行1.48kg版 | [Outdoorweb](https://www.outdoorweb.eu/FARPOINT-40-black) EUR154.80（原193.49） | Black，code10066351OSP，頁列Autumn2026、1.48kg/210D+420D尼龍；未見可靠庫存字樣；配送提示日期已過，勿引用 | 稅未知；不引用碼OUTDOOR10折後價，未驗資格；商品頁有「4 wheels」矛盾，不照抄 |
| Patagonia Black Hole MLC45／45L、49307 | [Patagonia US](https://www.patagonia.com/product/black-hole-mlc-convertible-carry-on-backpack-45-liters/49307.html) USD249 | 列BerryFig／BlackwBlack／WeatheredStone；未鎖色，庫存未明；300D+TPU/1635g | 稅未知 |
| Cotopaxi Allpa35／標準新版35L | [Cotopaxi UK](https://uk.cotopaxi.com/products/cotopaxi-allpa-35l-travel-pack-black) GBP220.00 | Black，標準再生布料1.33kg；非DelDía；庫存未明 | 稅未知 |
| Aer TravelPack4／35L | [Aer](https://aersf.com/products/travel-pack-4-35l) USD259.00 | 35L、Black；3.90lb；頁顯示Sale SoldOut並同時有AddtoBag，保守記缺貨/未確認可售 | 稅未知；不是TravelPack3，不套舊3價格 |

## 主推款第二店與比價限制

| 型號 | 第一店 | 第二店／頁價 | 是否真的同規格 |
|---|---|---|---|
| RockBlitz15 | Oliunid USD55.63 | [BD US](https://blackdiamondequipment.com/products/rock-blitz-15-backpack) USD99.95，OutofStock | 都15L/403g；Oliunid未鎖色與SKU。可列兩頁價格，不能稱同色新版便宜44.32 |
| Wadi15 | BlueIce USD99.95缺貨，Northatlantic | [BananaFingers EU](https://bananafingers.com/eu/blue-ice-wadi-15-pack-climbing-and-mountaineering-backpack) EUR76.90（原90），Available，Universal15L | 容量明確；第二店顏色未抽到、稅未知。英國另一頁「as low as72.95」混容量，已排除 |
| Creek50 | BD USD259.95缺貨 | [Oliunid分類頁](https://www.oliunid.com/climbing/backpacks/crag-backpacks)搜尋索引顯示USD142.00 | **尚未讀單品並鎖背長，不能納正式比價表**；50L S/M可能實際48L，不能硬比 |
| Cragsmith45 | Patagonia USD229、BLK | [Bergfreunde EU](https://www.bergfreunde.eu/patagonia-cragsmith-45-climbing-backpack/) EUR229.95 incl.VAT | 同420D/1420g/45L，頁提示需選色/尺碼，交期2–3工作日只屬店頁資訊；不能當同色已選定報價 |
| Farpoint40 | Outdoorweb EUR154.80、Black、2026 1.48kg | [Osprey US](https://www.osprey.com/farpointtm-40-travel-pack-1)只顯示「As low asUSD200」 | **起價排除**。Bergfreunde抓到1580g舊版且no longer available；Treksport180EUR為450D聚酯1.6kg舊版，均不當相同2026版二店 |
| MLC45 | Patagonia US USD249、未鎖色 | [Backpack Paris](https://backpack.paris/en/products/black-hole-mlc-45) EUR220，WeatheredStone，Lyon店可取、Paris店不能取 | 同45L/300D+TPU規格；頁未列49307，不能完全鎖定SKU。稅未知，門店可取不證明寄台灣 |

### 資料不足的誠實範圍

12款都有現行可見價，包含缺貨標價；不等於12款可立即買。主推6款有5款找到第二店數字，其中Creek只有分類搜尋索引，故不納正式第二店；Farpoint的同版第二店仍缺。多數頁沒有選定顏色/背長與配送地，不能發布成「同規格最低價」或到手價比較。若文章只需價格級距，可用主表並將缺貨及未知條件一起列出；若要購買決策，先補同SKU與配送條件再算差額。

沒有登入、加購物車或結帳；沒有抓私人資訊。折扣碼、運費門檻、各店自稱可登機均未當作交易承諾。
