# 審稿紀錄：2026-10-19-climbing-gear-buying-order（中英共用）

日期：2026-10-19。工具：Groundlane MCP `web_fetch`（UIAA 購買建議、UIAA 安全標準總表、DAV 安全研究文章、原岩萬華價目表、Climbing Ninjette）＋ `web_search`（找 Petzl 新網址）；PDF 用 curl 下載後 pdftotext（Petzl 保養說明、DAV 2010、GRIGRI 使用說明），UIAA 101／105 圖解是影像 PDF，用 pdftoppm＋tesseract OCR。原始擷取存於 scratchpad `gearbuy/`。未降級。

## post-verify

逐條對照本 session 打開的原文，約 40 條宣告（正文、兩張表、練習題、tldr、description、glossary）。

🟢 Confirmed
- UIAA 購買建議（2026-02-24，取代 2019-04 版）：只買有 UIAA Safety Label 和／或 CE 標示的裝備；標示刻在、縫在裝備上或在說明書；提防仿冒、低價是警訊；網購只買知名品牌、原廠或有信譽的經銷商；有疑問查 Certified Equipment Database；不認可二手、吊帶頭盔繩子特別不該買二手、受損難察覺；拿到就檢查損傷／變形／縫線不完整／鏽蝕、確認新品、標示清楚、不接近使用年限；記錄品牌、型號、序號、購買日、檢查日、使用情形（六項，對上「上面那六項」）。
- UIAA 安全標準總表：1960 年從繩子開始、超過 25 種裝備、與 CEN 協調、部分加測所以更嚴；編號 101 繩、105 吊帶、106 頭盔、121 連接器、129 制動器 ✓。
- DAV 安全研究文章：攀岩鞋屬運動裝備、沒有強度規定；以保護為主的叫 PSA，EU 有 PSA 法規、分三級；PSA 必須有 CE；依現行標準吊帶、動力繩、頭盔、Bandfalldämpfer、縫合扁帶要標製造年；多數原廠紡織 PSA 最長約 10 年。
- DAV 2010 PDF：「Seit 2007 muss das Herstellungsjahr auf dem Produkt angegeben sein」（在紡織品段落）。
- Petzl 保養說明 PDF：PPE 三級（手套眼鏡／通風頭盔冰爪／吊帶鉤環冰斧）；塑膠紡織品最長 10 年自製造日起；序號「09 365 AB 1234」與舊吊帶「99 289 A」的讀法。
- UIAA 101 圖解（OCR）：繩端標示含繩型符號、長度與繩徑、製造年、製造商。UIAA 105 圖解：「All harnesses shall be labelled with the year of manufacture」。
- 原岩萬華價目表（2026-10-19）：岩鞋 $100、粉袋 $80、租鞋需穿襪、可現場買襪 $50。
- Climbing Ninjette：爬不到 5 次先租、一週一次以上可以買、租鞋尺寸通常較寬鬆。
- GRIGRI 使用說明 D0015500K（051124）：EN 15151-1 type 6；符合 (EU) 2016/425；退役條件含「You do not know its full usage history」。

🔴／🟠 修正（已改，中英同步）
- Petzl GRIGRI 產品頁（INT 與 US）回 404；Petzl FAQ 舊網址被導到泛用 FAQ 首頁、內容消失。原文「認證欄寫 CE EN 15151-1、UKCA、UIAA」改以 GRIGRI 使用說明為來源，改寫成說明書實有的「EN 15151-1 type 6、符合 (EU) 2016/425」；UKCA／UIAA 只在 Brave 搜尋摘要看得到，未讀到原頁，不再宣稱。
- 「Petzl 的退役條件：不知道完整使用歷史」連結從失效 FAQ 改到 GRIGRI 使用說明（原文逐字找到）；參考資料移除失效 FAQ，GRIGRI 產品頁換成使用說明。
- 「金屬件：刻在本體上的序號」放在「製造年印在哪裡」之下，與 DAV 相反（金屬不老化，不強制標製造年）→ 改成「不一定有；有標的話通常藏在序號裡」。
- 「DAV 2010：2007 年起產品上必須標示製造年」→ 原文在紡織品段落，改成「吊帶、扁帶這類紡織品」。
- 「要找到真正貼合自己腳的鞋，只能靠自己的鞋」→ Ninjette 沒有這句，原文是「有自己的鞋，腳感穩定」，改回原意。
- 「這是業者經驗」→ Climbing Ninjette 是個人部落格（作者 2020 年開始攀岩），不是業者；改成「攀岩部落客／作者的經驗」。
- 「UIAA 建議的最後兩步」→ 原文最後一組 Record and Review 有三條（3.1–3.3），文中引了 3.1、3.3；改成「最後一組『記錄與檢視』，其中兩條」。
- 練習題 3「Petzl 紡織品 10 年」原本沒有 inline 來源 → 補 Petzl 保養說明連結，並照原文寫「塑膠與紡織品」。

🟡 Unverifiable（未寫入／維持原寫法）
- 「二手軟裝備幾乎不可能知道它有沒有放在汽車電瓶旁邊」是作者的舉例（Petzl 保養說明提到酸與車廂），不是引述，維持。
- 「頭盔：看殼內的標籤或刻印」沒有單一來源逐字支持；DAV 確認頭盔要標製造年，位置描述屬一般性說法，維持。

本次只檢查文中已提出的宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`pnpm verify` 只有 `check:series-plan` 紅，原因是本系列五篇都還沒有審稿紀錄（本檔補上本篇；其餘四篇待各自審稿）。`check:links` 11 條外部連結 0 壞（修正後）；`check:references` 全站 0 error；`check-post-quality` 中英兩檔 OK；`check:tw` 0 blocking、0 review。`astro check` 未跑，交給 commit gate。
- frontmatter：必填齊全；tags 4 個（climbing、climbing-gear、beginner、indoor-climbing），與同分類既有高頻 tag 一致，climbing-gear 是本系列共用新 tag ✓。type: guide 符合內容。description 與 tldr 不重複 ✓；tldr 有具體順序與 UIAA 2026 年的明確建議 ✓。glossary 三條與正文一致 ✓。
- 衍生內容：tldr「UIAA 2026 年的購買建議明講吊帶、頭盔、繩子不該買二手」與原文一致，強度沒有放大 ✓。
- 結構（guide）：購買階段表 → PPE 分類 → CE／UIAA → 標準編號表 → 製造年 → 二手 → 網購 → 買後檢查與記錄 → 購物清單 → 練習題（details）→ 下一步 ✓。開頭的朋友繩子情境在「二手」一節與練習題 4 回收 ✓。
- 主題歸屬：確保操作轉到〈岩館上攀確保〉、頭盔理由轉到〈戶外確保〉（該篇有「確保者也要戴頭盔」一節 ✓）、檢查與汰換轉到第 4 篇，都只留分界與連結 ✓。
- 跨節指代：「上面每一件都會老」「上面提到的資料庫」「上面那六項」都指得到 ✓。
- 台灣讀者位置：開頭是台灣岩館租鞋情境，價格用原岩萬華店 ✓。

## post-polish

- register-scan（zh）：長句原有 5 句 >60 字；修正時新增的 GRIGRI 句和 91 字的 DAV 句已斷句，其餘 3 句（UIAA 總表、Petzl 序號、UIAA 二手）都是單一引述，保留。但書 1%、引述區塊 0、模板化轉折 0、英文術語 0。數字密度 2 段（原岩價格、Petzl 序號範例），都是讀者要用的數字，保留。
- phrase ledger：0 命中。
- 可執行動作：三處「今晚就能做的動作」（列租／自己的、找標示與製造年、開紀錄表），練習題四題都在 <details> ✓。中英同步修改。
