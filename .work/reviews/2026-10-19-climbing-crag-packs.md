# 審稿紀錄：2026-10-19-climbing-crag-packs（出國攀岩裝備 order 5）

檔案：`src/content/posts/climbing/2026-10-19-climbing-crag-packs.md`、`-en.md`
日期：2026-10-19
來源：`.work/climbing-gear-travel/research-v2/parts/C-crag-packs.md`、`D2-multipitch-ropebags.md`（繩袋）；舊稿 climbing-travel-packing 岩場包段落（只沿用 Creek 50／Cragsmith 45／Crag 40／Neon 45 的原廠事實，舊稿的旅行包品牌 Aer、Cotopaxi、Osprey Farpoint、Patagonia MLC 全數不收）。

工具降級（toolDegradation）：Groundlane MCP 不在工具清單；Groundlane 直接 HTTP POST 回空回應 → Keenable 搜尋 → Exa web_fetch 讀頁；BD／Grivel／Metolius 價格用 Shopify `.json`；Switchback Travel 對 curl 回 342 bytes（被擋），改用 Exa 快取（2025-05-19 版）。

## post-verify

抽查關鍵事實，2026-10-19 重新打開：

| 宣稱 | 來源 | 結論 |
|---|---|---|
| Creek 50 USD 259.95、Crag 40 USD 159.95、Pipe Dream 45 USD 199.95 | BD Shopify JSON | ✅ |
| Rocker 45 USD 202、1,402 g | Grivel US Shopify JSON | ✅ |
| Crag Station Classic USD 149.95 | Metolius Shopify JSON | ✅ |
| Neon 45 USD 199.95、1,500 g、平底可站立、可拆繩袋、頂開＋背板 | Mammut US（Exa） | ✅ |
| Cragsmith 45L USD 239、1,420 g、S/M/L、U 型頂蓋＋背板 | Patagonia US（Exa） | ✅ |
| KLIFF USD 89.95、750 g、36 L、≤100 m、140×140 cm 繩布、背面鉤子 | Petzl US（Exa） | ✅ |
| Stamina 41 L、可拆繩布、55×32×21 cm、USD 124.95／特價 93.71 | Wild Country US（Exa） | ✅ |
| Falesia 45 L、1,000 g、55×35×20 cm、可當登機行李、背帶收納、PVC 貼地面 | Climbing Technology 官網（Exa） | ✅ |
| UKC Neon 45：可站立、單一背長、腰帶不如 Rab Outcast、Céüse 每天上坡一小時看法可能不同、放得進頭頂行李櫃 | UKC 2024-09-30 | ✅；初稿寫「他會換別的包」過頭，改成「看法可能就不同了」 |
| Climbing Cragsmith 評測：70 m 繩＋15 快扣等全部裝得下；硬殼壓不小 | Climbing 2024-02-02 | ✅ |
| Switchback：Creek 50 最佳岩場包；2025 版新增 Pipe Dream 45 | Switchback（Exa 2025-05-19 版） | ✅；研究檔另記 2026-06-23 版，本人讀不到，正文只寫 2025 |
| OGL：Dirt Bag II 最佳 CP 值、KLIFF 岩館到岩場最佳 | OGL 2024-07-30 | ✅ |
| 萊利只能搭長尾船、上岸靠走路、Railay West→Ton Sai 15–20 分鐘 | The Thailand Guides 2026-06-11 | ✅ |
| 卡林諾斯機車最普遍、部分岩場走路可到 | theCrag Kalymnos | ✅ |
| 登機 7 kg／兩件合計 7 kg、Volta 9.2 55 g/m | 引用 order 2 正文（該篇已查證官方頁） | 沿用 |
| 約 8 個實例岩場包兼登機；2023 Creek 50 托運背帶被扯壞 | 引用 order 3 正文 | 沿用 |
| Edelrid PIT／Crag Jack／Beal／Movement／Dirt Bag 規格與價格 | 研究檔（當日官方頁） | 未重開，沿用研究檔 |

刪掉沒有來源的句子：「熱帶岩場一人至少 2 L 水」、「上下船常要涉水」、「Crag 40 布料較薄」、「Arc'teryx／Osprey 主力是多繩距包」（後者也不在範圍內）、Crag Hauler（缺貨、表內未收）。
不當現行款推薦：CAMP Rox（官網打不開）、Patagonia Cragsmith 32L（未確認）、Mystery Ranch Tower 47、Mammut Neon Gear 45、Metolius Freerider、Arc'teryx Konseal 40（停產或可能停產，只在一段寫成「已非現行款」）。

## post-review

- 範圍卡對照：大開口、繩布、站立底部、耐磨、容量 35–50 L、背負、空重、登機包兼用 ✅；10 個品牌（BD、Mammut、Patagonia、Petzl、Edelrid、Grivel、Metolius、Wild Country、Climbing Technology、Beal）14 款 ✅；兩人單繩距裝載例子 ✅；繩袋要不要另帶 ✅；不講多繩距（連 order 6）✅；鞋、吊帶、頭盔連 climbing-gear ✅；只收攀岩／戶外品牌 ✅。
- 情境：開頭用萊利／奧南的長尾船和卡林諾斯機車帶出接近方式，第一節依步行／船／機車／租車分包型，加一張 mermaid 決策圖（中英兩張已用 Mermaid Chart 驗證 valid）。
- 評測欄只收 2020 後；沒有的寫「—」。價格標 2026-10-19、幣別，沒有官方價的寫零售店名並註明。
- 內文連結：表格第一欄全部連原廠頁；評測、站內篇章第一次出現都有 inline 連結。
- 修正：「下一節細講」指向錯誤（下一節是比較表），改成指名「岩場包能不能當登機包」一節；Creek 50「托運時背帶怕被扯壞」改成「社群有托運時背帶被扯壞的實例」；「三成額度」改「近三成」（2/7）。
- 和 order 4 可能重疊：order 4 description 也寫「岩場包兼登機包的條件」。本篇依指派保留這一節，但只講岩場包本身的重量、尺寸、可壓縮性，配置搭配連 order 4。請主 session 對照兩篇。
- `pnpm check:tw`：0 blocking、0 review。`check-process-leak`：通過。

## post-polish

- `register-scan.sh`：初稿長句 7 句 → 修到 1 句（63 字，列舉評測者裝進包裡的東西，保留）；但書段落 6%；引述區塊 0；模板化轉折 0；`scan-ledger.sh` 無命中。
- 數字密集段：比較表與「容量」「繩袋」兩段本來就是規格比較，保留；把繩布列舉從長句拆成獨立段落、把 Dirt Bag 兩款拆成兩句。
- 研究者姓名當主詞 0；建議都配動作（最後「三個步驟」：寫下接近方式、裝備攤兩堆、決定兼不兼登機包）。
- 英文版：避免被動與名詞化，長句在中文斷句處同步斷開；series name 用登錄的 "Climbing Travel Gear"。
