# 非 Oliunid 繩索價格調查

查核日：2026-10-19。僅公開商品頁，不登入、不結帳。不得把起價視為 60 m 價；含稅文字屬網站顯示地區，不代表送台灣稅金已付。運往台灣的可配送性、運費、進口稅及結帳折扣均未核實。沒有在這份資料上做最低價排名。

## 可綁定 60 m 的商品正文價

| 型號與處理 | 店家／版本 | 60 m 可見價 | 庫存證據 | 價格界線 | 來源 |
|---|---|---|---|---|---|
| Petzl VOLTA 9.2 Duratec Dry | Summits Outdoor，Orange，正文稱 PFAS-free Duratec，但未列製造年 | GBP 199.99 | Exa 商品正文未呈現庫存，待確認 | 固定 60 m 商品頁；不是起價。稅運未知 | https://summits.co.uk/products/petzl-volta-rope-9-2mm-x-60m-orange |
| Edelrid SWIFT 48 ECO DRY 8.9 | Taunton Leisure，Pink，48 bobbins，未列製造年；不是 2R | GBP 157.50（原 GBP 225.00） | Pre-Order；預計出貨 Undetermined | 固定 60 m 頁，促銷 30%；不能當現貨 | https://www.tauntonleisure.com/climbing-equipment-accessories/ropes-slings/edelrid-swift-48-eco-dry-89mm-x-60m-climbing-rope--pink__24239 |
| Beal OPERA 8.5 UNICORE Golden Dry | SportOkay，60 m，色需另選，商品碼 bc085o.60gd.b，未列製造年 | EUR 249.99（EUR 4.17/m，Incl. VAT） | Groundlane #main 正文：In stock / Available for delivery immediately；1–3工作天屬店家地區說明 | 固定 60 m。正文廣告有 ALL10 購物車碼，但未核結帳，不計折後價。Exa 備援舊投射呈 EUR 219.99；採 Groundlane 即時 EUR 249.99 | https://www.sportokay.com/de_en/beal-opera-8-5mm-golden-dry-kletterseil-60m.html |

這三款可給讀者具體預算參考，但三個店家各一款不能推論店家間價差。最重要的同店跨店比價仍需與 Oliunid 的同長度同處理版配對；若 Oliunid 只有起價，必須保留無法直接比較的註記。

## 常見店家：有商品正文價格，但未能綁定長度

| 型號 | 店家 | 正文可見價格 | 長度與處理 | 庫存／稅運 | 來源 |
|---|---|---|---|---|---|
| Edelrid SWIFT 48 ECO DRY 8.9 | Alpinetrek | GBP 135.96 起；原 GBP 159.95 | 長度未綁定；完整 Eco Dry，不是 2R | 頁稱 incl. duties and taxes；GB免運、5–6工作天不代表台灣。特定變體庫存未知 | https://www.alpinetrek.co.uk/edelrid-swift-48-eco-dry-89-single-rope/ |
| Beal OPERA 8.5 Golden Dry | Alpinetrek | GBP 169.05 起；原 GBP 177.95 | 長度未綁定；Golden Dry | 同上 | https://www.alpinetrek.co.uk/beal-opera-85-golden-dry-single-rope/ |
| Petzl VOLTA GUIDE 9.0 | Alpinetrek | GBP 188.05 起 | 長度未綁定；Guide UIAA Dry | 同上 | https://www.alpinetrek.co.uk/petzl-volta-guide-single-rope/ |
| Beal OPERA 8.5 UNICORE Golden Dry | EpicTV UK | GBP 160.78 起；原 GBP 193.99 | 長度未綁定；H1／內文 Golden Dry，但頁面 title 有 Dry Cover 舊字，購買前核SKU | Available 屬產品級，特定長度未知；稅運未知 | https://epictv.co.uk/beal-opera-8-5mm-golden-dry-cover |
| Beal JOKER 9.1 UNICORE Golden Dry | EpicTV UK | GBP 170.68 起；原 GBP 171.62 | 長度未綁定；H1 Golden Dry，內文規格Family卻寫Dry Cover，購買前核SKU | Available 屬產品級；稅運未知 | https://epictv.co.uk/beal-joker-unicore-9-1mm-golden-dry |

## 證據與工具邊界

- Groundlane first；初次 18087 ECONNREFUSED，主代理重啟後可用。EpicTV Groundlane `web_fetch` 返回 browser-challenge `UPSTREAM_ERROR`（rope-price-epic-list.json）；EpicTV/Alpinetrek/Taunton/Summits 的上述文字用 Exa `web_fetch_exa` 公開頁正文備援，不是搜尋摘要核價。
- Groundlane SportOkay `selector:#main` 成功（rope-price-sportokay-main.json），內容可見60m標題、249.99、含VAT、現貨。較早 full 回應截在導覽，不能作核價證據。
- Exa 存檔：rope-price-exa-alpinetrek.json、rope-price-exa-details.json、rope-price-exa-sportokay.json。檔為完整工具回應，可能含 provider 投射／快取，不保證即時庫存。SportOkay 即時與 Exa 不同已明標。
- Trekkinn 搜尋有找到 Opera Golden Dry，但只有分類起價與多長度，沒有可核同長度商品正文，故沒有列入價格。
- 未取得 Alpine Sender 8.7 Dry、TANGO 8.5、PASO GUIDE 7.7 的合格跨店價格。不可填補猜測價格。
- 沒有調整任何文章；價格表只是補充市場採買資料，安全認證與確保器相容仍以品牌官方文件為準。
