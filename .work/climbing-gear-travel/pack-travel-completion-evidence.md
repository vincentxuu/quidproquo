# Order3/4撰寫與證據

讀者問題：order3要能依裝載、身形與路線選兩款試背；order4要能按落地交通配置主行李，完成七天兩人分工。體裁均為按決策展開的入門選購指南。大綱：用途→容量/交通→試背/分工→候選與代價→價格→例子與答案。屬使用者2026-10-19明確「請完成」授權批次。

## 重用研究與取得範圍

- `pack-recommendations.md`：官方12款規格、2026 Switchback/Climbing/OutdoorGearLab完整比較正文（Exa），及Groundlane官方補抓。具體JSON見該檔。
- `pack-prices.md`：2026-10-19公開商品價。無結帳、無配送台灣確認；包含缺貨價。正文未使用as-low-as或staging價。變體條件與未知依研究保留。
- `pack-gl-community-{2023,2021,2019}.json`：Groundlane MountainProject完整正文，truncated:false；正文用2023與2021，沒有把Blitz20當RockBlitz15。社群不可證明新版耐用或銷量。
- MLC原廠評論：本輪Exa官方49307完整頁含顧客Dan R.2026-07-19稱小物/筆電分區可用，Meara2026-08-15與Danielle2026-08-20偏好舊版大空間；Michael2026-10-13提出肩帶縫線斷裂。正文僅採收納偏好分歧，不把單次故障當普遍結論。自述未獨立驗證。
- 旅行保護官方：`rope-price-care-exa-helmet.json`為Petzl官方PDF（GL先失敗後Exa），已讀運輸/存放段。原意：放包保護、尖物不能傷繩/頭盔、避免車內曝曬熱、遠離燃料電池清潔劑化學品，通風避UV。未確認抗擠壓的具體要求，故正文不寫通用抗壓保證或具體填塞教學。
- 清洗乾燥官方：`rope-price-care-wash.json`為Groundlane官方新Petzl清洗頁，已讀化學污染退役與通風室內、遠UV/熱源乾燥；正文未延伸到所有品牌清潔溫度。
- 新猜測舊care URL抓到404，保留`pack-travel-care-fetch.json`但未引用正文。搜尋紀錄`pack-travel-care-search.json`。

## 教學與事實邊界

Order3兩人例子不固定水量，不教掛包/拖拉繩技。2kN明確是掛包功能，不可做人身確保。650g Mutant22依官方/既有Exa規格，不引用38L實測為22L背書。

Order4七天表為分工範例而非所有路線安全完整清單。航空沒有指定航班，只教逐票種/實際承運公司/航段查尺寸重量與器材規則，未宣稱任何器材必可隨身或托運。液體化學品保護是官方原則；隔離裝袋與到住宿重分裝是編輯實作建議。未提供未知航司普遍數值。

2026-10-19 owned targeted最終紀錄：`pack-travel-final-targeted.log`。tw/process/語域/ledger均exit0。quality/refs各exit1，唯一錯誤為C組order5中英尚未落盤的兩條內鏈；已通知主代理保留原連結，待16檔齊後統一重跑。沒有跑全站verify，沒有commit/push/deploy。
