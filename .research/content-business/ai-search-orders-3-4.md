# Research: AI 搜尋橫切系列 orders 3–4

研究日期：2026-09-17
系列：AI 搜尋正在重寫內容生意
範圍：order 3「從 SEO 到品牌直達」；order 4「第一方資料、社群與工具為何更重要」

## 子問題

1. AI Overviews／AI Mode 是否讓 SEO 失效，還是改變 SEO 交付點擊的方式？
2. 品牌查詢、direct、回訪、email、App 與工具啟用各能量到什麼，不能量到什麼？
3. 「品牌直達」如何定義，才不會把所有 direct traffic 都算成品牌？
4. 第一方資料是什麼資產，又帶來哪些同意、用途限制、刪除、安全與可攜成本？
5. 社群與工具為何可能把內容接到反覆行動？哪些部分仍受平台、email inbox、hosting、支付與資料供應商控制？
6. 哪些箭頭只是產品假說，必須靠 cohort／實驗驗證，不能寫成必然提高留存？

## 先講結論

- SEO 沒有死亡。Google 官方明確表示 AI features 仍沿用既有 Search 基礎，頁面要先被索引且可顯示摘要；既有 SEO fundamentals 仍適用。
- 改變的是「被發現 → 點擊」不再是穩定的一步。Search Console 把 AI features 納入整體 Web search traffic，發布者無法只靠該報表拆出 AI Overview／AI Mode 的完整獨立表現。
- 品牌直達不是 GA4 的 Direct channel。Direct 是沒有清楚 referral source 的歸因桶，可能包含手打網址與書籤，也可能包含遺失 referrer／UTM 的流量。
- 應用指標組合而非單一代理：branded query、returning direct、newsletter activation、App push、saved-tool usage、conversion 與 retention cohort。任何一項單獨都不能證明品牌關係。
- 第一方資料、社群與工具的價值在於把匿名曝光接成「可再次服務的關係、脈絡或工作」。這是機制假說，不是保證提高留存。
- 「擁有」必須拆成可匯出性、直接權限、替換成本與外部依賴。Email 名單可匯出不代表能控制 Gmail inbox；社群成員可辨識不代表能搬走討論脈絡；工具在自有網域也可能依賴雲端、資料、支付與 App store。

## 來源清單與讀取完整度

| 來源 | 支持範圍 | 取用層級／完整度 | 訪問日 |
|---|---|---|---|
| https://developers.google.com/search/docs/appearance/ai-features | AI features 運作、索引資格、既有 SEO、Search Console 計量 | ✅ Groundlane `web_fetch` 全文，HTTP 200，未截斷；頁面標示 2025-12-10 更新 | 2026-09-17 |
| https://developers.google.com/search/docs/fundamentals/seo-starter-guide | SEO 的定義：協助搜尋理解內容、讓使用者決定是否造訪 | ✅ Groundlane `web_fetch` 取得正文；整頁輸出因頁面附加內容過長而截斷，但核心章節完整可見 | 2026-09-17 |
| https://support.google.com/analytics/answer/15258820?hl=en | GA4 `(direct)/(none)` 代表缺乏清楚 referral source；成因包含無 UTM、redirect 等 | 🟡 Groundlane search 可定位官方摘要；`web_fetch` direct 失敗，render bounded retry 因輸出上限／selector 失敗，未取得完整頁 | 2026-09-17 |
| https://support.google.com/analytics/answer/10917952?hl=en | UTM source／medium／campaign 可送入 Traffic acquisition | 🟡 Groundlane search 官方摘要；render bounded retry 超過輸出上限 | 2026-09-17 |
| https://developers.google.com/analytics/devguides/collection/ga4/reference/config | page referrer、campaign source／medium 等流量來源欄位 | ✅ Groundlane `web_fetch` 全文，HTTP 200，未截斷 | 2026-09-17 |
| https://www.ruleranalytics.com/blog/analytics/direct-traffic-google-analytics/ | Direct 可能混合手打、書籤與追蹤遺失；用於補足官方頁抓取失敗 | 🟡 Groundlane `web_fetch` 取得完整相關章節，後段因長文截斷；供應商內容且夾帶自家產品行銷 | 2026-09-17 |
| https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/ | crawl-to-refer 定義、Referer 缺失與外推限制 | ✅ Groundlane `web_fetch` 長文主要段落；回傳後段截斷，但方法、限制與觀察完整可見 | 2026-09-17 |
| https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/ | 目的、資料最小化、定期檢查與刪除 | ✅ Groundlane `web_fetch` 全文，未截斷 | 2026-09-17 |
| https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en | GDPR access、erasure、portability、objection 等權利 | 🟡 Groundlane `web_fetch` 長頁截斷，但權利摘要與 portability 段完整可見 | 2026-09-17 |
| https://support.google.com/mail/answer/81126?hl=en | Gmail sender requirements，證明 email 仍受 inbox provider 規則制約 | 🟡 Groundlane search 可定位官方摘要；兩次 bounded `web_fetch` 因輸出上限／selector 失敗 | 2026-09-17 |
| https://developers.google.com/search/docs/essentials/spam-policies | scaled content abuse、misleading functionality | ✅ Groundlane `web_fetch` 讀到完整相關章節；全頁因後續政策附錄過長而截斷 | 2026-09-17 |

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| Google AI features 仍要求頁面已索引、可在 Search 顯示 snippet；既有 SEO fundamentals 仍適用 | Google AI features 官方全文 | Google SEO Starter Guide | ✅ 兩份官方文件 |
| AI features 流量列入 Search Console 的 Web search type，而非一份完整獨立報表 | Google AI features 官方全文 | 系列研究地圖既有摘錄（同一官方源，不算獨立第二來源） | ✅ 窄產品事實，一手足夠 |
| Cloudflare crawl-to-refer 是 HTML crawler requests 除以帶可辨識平台 Referer 的 HTML visits，不是 CTR | Cloudflare 方法全文 | AI 搜尋 order 0／免費內容 order 8 既有查證（同源重用） | ✅ 一手方法定義；不可當雙來源效果量 |
| native App 可能不帶 Referer，使 ratio 偏高，幅度不明 | Cloudflare 本文直接限制 | 無獨立量化來源 | ✅ 官方對自身資料的限制；不引用精確外推 |
| GA4 Direct 是來源未知或未正確追蹤的桶，不等於所有人都手打網址 | Google Analytics 官方 search 摘要與設定欄位全文 | Ruler Analytics 相關章節 | ✅ 方向一致；Ruler 是供應商二手，文章不採其 benchmark 或產品效果宣稱 |
| 個資應限於明確目的所需，並定期檢查、刪除不需要的資料 | ICO data minimisation 全文 | European Commission GDPR rights | ✅ 兩份官方／監管來源 |
| GDPR 在特定條件下提供存取、刪除與資料可攜權 | European Commission rights page | ICO 最小化頁（僅支持刪除與治理，非完整 portability） | ✅ 官方一手；文章不外推成台灣法律結論 |
| Email 發送仍須符合 Gmail 等 inbox provider 規則 | Gmail sender guidelines 官方 search 摘要 | 無完整第二來源 | ⚠️ 只寫「仍受規則制約」，不列門檻與日期 |
| 社群／工具必然提高留存 | 無 | 無 | ⚠️ 不成立；只能標為待驗證機制 |

## 推論（與事實分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| 搜尋從「交付點擊」逐步變成「建立認知的其中一站」 | AI answer 能直接回答；Search Console 將 AI features 混入整體流量 | 查詢類型差異很大，交易或深度研究查詢仍可能大量點擊 |
| 品牌直達能降低每次互動都依賴非品牌排名的程度 | branded query、email、App、saved tool 都可形成替代入口 | 這些入口本身仍依賴搜尋、inbox、App store 或通知平台 |
| 社群的防禦性來自關係圖與共同脈絡，而非 follower 數 | 成員互動產生上下文，內容不是唯一價值 | 冷啟動困難、治理成本高，平台可能掌握身份與歷史 |
| 工具比純文字更能接到 action | 工具可保存狀態、重算、監控或輸出 | 簡單功能可被 AI 內建；錯誤、隱私或維護成本會反轉價值 |

## Order 3 草稿骨架：從 SEO 到品牌直達

- ELI5：商場指示牌與熟客。SEO 是讓路人找得到攤位；品牌直達是熟客記得名字，但可能仍搭商場電梯進來。
- 主脊：入口組合，而非「SEO → brand」必經線性遷移。
- Mermaid 1：classic search 與 AI/search exposure 分流到 click 或 answer，再接 brand recognition 與回訪入口。
- 表：impression/citation/click/branded query/direct returning/newsletter activation/saved tool，各自能證與不能證。
- Mermaid 2：量測樹；來源曝光、識別關係、啟用、付費、留存分層。
- 結論：保留 SEO 的 crawl/index/quality；同時建立可測量的重返理由。Direct 絕不等同品牌。

## Order 4 草稿骨架：第一方資料、社群與工具

- ELI5：借來的夜市攤位、顧客同意留下聯絡方式、常客桌、帶回家的量尺。
- 主脊：資產控制層級，不是「owned vs rented」二分法。
- Mermaid 1：rented reach → consented identity → lawful behavior → community context → tool/workflow；每層標治理成本。
- 表：email/account/community/tool/transaction 的可匯出物、仍依賴誰、主要成本、該驗證的指標。
- Mermaid 2：可擁有性四問：可匯出、可直接觸達、可重建脈絡、替換供應商。
- 結論：第一方資料不是蒐集越多越好；社群不是 follower；工具不是天然護城河。三者都需用 retention／activation cohort 驗證。

## 寫稿紅線

- 不宣布 SEO 死亡，也不宣稱 AI features 一定增加或降低轉換。
- 不把 Google 對自家點擊品質的公司說法當獨立效果證據。
- 不把所有 Direct 算成 brand；不把 branded query 全算成內容功勞。
- 不稱 email list、社群或工具為「完全 owned」。拆出 inbox、hosting、App store、支付、資料供應商等依賴。
- 不宣稱 email、社群或工具必然提高留存；一律寫成產品機制與待驗證假說。
- GDPR／ICO 只用來示範治理原則，不提供台灣法律結論。

## Groundlane 執行紀錄

- 搜尋 provider：auto/balanced 或 deep；實際主要由 Brave + You fusion，deep 搜尋曾回報 Browserbase unavailable，但 Brave／You 成功。
- 讀取：主要來源均使用 Groundlane `web_fetch`；Google Support 頁 direct fetch 整體失敗，render bounded retry 遇 `OUTPUT_LIMIT`，selector retry 遇 `INVALID_INPUT`。依 AGENTS 未改用禁止工具，已將這些來源降為摘要層級。
- 未使用 web.run、stealth_fetch、WebFetch、web-fetch、fetch_page 或 Playwright。

## 待解問題

- Google Search Console 是否已全面提供官方 branded/non-branded filter；目前搜尋只找到社群頁，正文不依賴此功能。
- 各 newsletter／community SaaS 的 export 邊界差異很大；order 4 保持框架層，不做跨平台功能排名。
- 若未來加入效果量，需另找獨立 cohort 或實驗；本稿不以公司案例證明 retention uplift。
