# Creator orders 3 / 5 交叉審稿：Patreon 與 Beehiiv

- 審稿日期：2026-09-17
- 範圍：orders 3、5 中英四篇，對照 `creator-patreon.md` 與 `creator-beehiiv.md`
- 方法：post-review（結構／metadata／雙語）、post-verify（高風險宣告）、source-eval（來源獨立性與公司自報）
- 限制：本輪不改文章；事實核對以兩份 dossier 已完整讀取的來源為界，沒有把搜尋摘要升格為驗證證據。

## 結論

四篇的核心框架與中英 metadata 一致，Patreon 的 10% 平台費沒有被誤寫成總成本，Beehiiv 的 5,000 萬美元也明確保留為管理層預測。CSV 可攜、付款關係、AI／MCP／Agent 未實測邊界，大方向均守住 dossier 紅線。

發布前仍有三項必修：Beehiiv 的 Reuters 連結目前被連結檢查判為 401；Beehiiv 精確價格與 Agent 權限是易變的高風險快照，正文只有官方方案頁一個可見依據；Beehiiv 公司規模數字仍是同一場管理層訪談，不能因 Reuters 報導就視為雙來源驗證。

## 🔴 必修

### 1. Beehiiv 中英稿的 Reuters URL 被定向連結檢查判為 401

- 位置：中文第 83、138 行；英文第 81、132 行。
- 現況：`pnpm check:links` 在兩篇都把該 URL 列為 broken，而不是 needs-review。
- 影響：這個連結同時承載 5,000 萬美元預測、40,000 MAU、近 15,000 付費客戶三個高風險數字；讀者無法直接核對時，透明度會失效。
- 建議：換成可公開讀取且能回溯 Reuters 原文的合法來源，或保留 Reuters 並增加一個可讀的一手／獨立交叉來源。不能只刪連結而留下數字。

### 2. Beehiiv 精確價格只有官方即時方案頁達到全文證據

- 位置：中文 frontmatter 第 8 行、正文第 71–77 行；英文 frontmatter 第 8 行、正文第 71–75 行。
- 宣告：1,000 subscribers、年繳時 Scale 43 美元／月、Max 96 美元／月，Launch 最多 2,500 subscribers。
- dossier 狀態：官方 pricing 已全文讀取；列作交叉來源的 SendX 只有搜尋摘要，依 post-verify 規則不能算 Confirmed。價格屬易變的高風險資料。
- 建議：發布前再找一個完整讀取且獨立的當日來源；若找不到，正文與 tldr 都應更明確標成「Beehiiv 官方 2026-09-17 方案頁顯示」，不要使用看似已被獨立交叉確認的語氣。

### 3. Beehiiv 的公司規模數字不是兩個獨立來源

- 位置：中文第 81–89 行；英文第 79–85 行。
- 宣告：管理層預期 2026 revenue 接近 5,000 萬美元、超過 40,000 MAU、近 15,000 paying customers。
- 做得對：文章明確寫 5,000 萬美元是 forecast，不是已實現 revenue 或 ARR；也把三個數字歸為公司／管理層提供。
- 仍有缺口：Reuters 是報導載體，但數字來源仍是同一場 CEO／公司採訪，沒有第二個獨立資料源。這不符合高風險數字的雙來源門檻。
- 建議：補第二個獨立且完整讀取的來源；否則刪去 40,000／15,000，或把整段收斂為「Reuters 轉述管理層預測」，避免讓讀者把媒體刊登誤認成獨立驗證。

### 4. Beehiiv MCP／Agent 的讀寫權限需要原位引用，並避免把兩個產品合併解讀

- 位置：中文第 113–117 行；英文第 109–111 行。
- 宣告：Launch 提供 read access，Scale／Max 提供 write access。
- dossier 邊界：目前只由 pricing feature list 支持，尚未登入測試可讀／可寫的 resource、tool、approval flow、audit log 或 rollback。
- 做得對：兩篇都明說這是官方功能宣稱，且未實測操作範圍與核准／稽核機制。
- 問題：權限句本身沒有 inline link；同一句並列 AI Website Builder、MCP、Agent，讀者可能誤解 read/write 同時且同範圍套用到 MCP 與 Agent。
- 建議：在權限句直接連到方案頁，逐項照方案表欄位寫清楚「哪個產品、哪個方案、read/write 指什麼」。若官方頁沒有 resource/tool 細節，就維持 feature-label 層級，不延伸成可操作 audience、segment、campaign 的既成能力。

## 🟡 建議修

### 1. Beehiiv 飛輪圖的「提高」比正文證據更強

- 位置：中文 Mermaid 第 56–62 行；英文第 56–63 行。
- 問題：節點寫「提高開信、升級與留存」／“Improve opens, upgrades, retention”，視覺上像是已證成效；下方雖立刻說這只是機制圖，但圖被單獨截取時會失去但書。
- 建議：改成「測試開信、升級與留存」或「開信／升級／留存結果」，把成效方向留給數據驗證。其餘箭頭已合理呈現假說，沒有把平均效果數字化。

### 2. Patreon processing 等額外費用應在宣告原位補官方連結

- 位置：中文第 77 行；英文第 77 行。
- 做得對：兩篇都清楚寫 10% 是 standard platform fee，不是總成本，並保留 legacy、merch、幣別、提領等例外。
- 問題：額外 payment processing、currency conversion、payout 等費用是外部產品事實，但該句只有上一段的 standard-fee 頁連結；參考資料也未列 dossier 中的 Creator fees overview。
- 建議：在該句直接引用 Patreon Creator fees overview，讓 10% 與 processing 的邊界能在原位核對。

### 3. Patreon AI 政策連結的頁名範圍比正文句子窄

- 位置：中文第 102 行；英文對應 AI policy 段。
- 問題：正文先概括「允許符合規範的 AI 生成作品」，連結卻是 Adult/18+ creators 專頁。dossier 支持一般頁與 Adult/18+ 的分層政策，但單一連結標題容易讓讀者無法判定前半句是否也由該頁支持。
- 建議：若官方另有 general AI policy，前半句連 general 頁，Adult/18+ 超寫實真人與 consent 再連現有頁；若沒有，就把句子限縮成該 Adult/18+ 頁明確說明的範圍。

### 4. Patreon CSV 表格中的寄信同意是遷移建議，不是 export 文件直接證明

- 位置：中文表格第 87 行；英文第 87 行。
- 問題：「確認新工具的寄信同意」是合理的合規／營運提醒，但 dossier 的 Patreon export 文件主要證明 contact CSV 欄位，不足以單獨證明各地法域與新工具的同意要求。
- 建議：改成「依收件人所在地與新工具規則確認寄信資格」，或補適用法域／供應商文件。不要把通用合規建議寫成 Patreon 搬家必然需要重新同意。

### 5. Beehiiv Ad Network 與 0% 周邊交易條件的來源仍以官方為主

- 位置：中文第 43–45、75–79 行；英文第 43–45、73–77 行。
- 問題：產品功能由官方頁證明足夠，但「performance tracking」「各自交易條件」與平台多層收入的描述沒有逐句連到具體條款；dossier 也承認廣告／paid recommendations 的交易抽成未完整核對。
- 建議：避免暗示已掌握平台在每種交易的抽成；維持「存在各自條件、本文未完整核對」的邊界，並替 Ad Network 功能補具體官方頁 inline link。

### 6. 中文各有一句偏長，可在事實不變下拆句

- Patreon：第 50 行，65 字，且包含測試方法、19% 與四項限制。
- Beehiiv：第 18 行，64 字，連列七個動作。
- 這不是事實錯誤，但拆句會讓公司自報與功能列舉更容易掃讀。

## ✅ 已守住的紅線

### Patreon

- 10% 明確限定為 2025-08-04 後發布頁面的新創作者 standard platform fee；沒有寫成所有創作者一律 10%。
- processing、currency conversion、payout、稅務等沒有被包進「只扣 10%」的錯誤結論。
- Autopilot +19% 與 discovery 每年逾 2 億美元均標成 Patreon 測試／公司自報，且寫出樣本、基準與歸因未知。
- CSV 只支持 email／聯絡資料可攜；續訂授權、tier entitlement、留言、chat、推薦分發沒有被宣稱可一鍵搬走。
- AI 段沒有從「未找到通用 AI writer」推論成「Patreon 沒有 AI」，也把會員關係較抗商品化標成商業推論。
- 第二張 Mermaid 用虛線表示平台費再投入分發，並在正文標為誘因而非已證因果。

### Beehiiv

- 價格有日期、1,000 subscribers 與 annual billing 條件；沒有寫成所有名單規模的固定月費。
- 0% 僅限定 paid-subscription take rate，沒有忽略 Stripe processing、SaaS 月費與獲客支出。
- 5,000 萬美元始終寫成管理層 forecast，沒有改成 realized revenue 或 ARR，也沒有拿第三方 3,000 萬 ARR 拼成成長曲線。
- Quick／Full CSV 的欄位邊界與付費訂戶 Stripe migration 步驟符合 dossier；沒有把 CSV 寫成完整營運備份。
- AI Writer／Image／translation 與 MCP／Agent 均標成官方功能宣稱；未實測的 approval、audit、rollback 沒有被寫成已存在。
- 圖後明示是 mechanism diagram，不是平均 performance chart；非英語、小市場與名單品質的失效條件有寫出來。

## Metadata、雙語與機械檢查

- 四篇 `date/category/type/tags/lang/series.order` 正確；Patreon 為 order 3，Beehiiv 為 order 5。
- 中英文 series name 分別為「誰掌握創作者與讀者的關係」／“Who Controls the Creator-Reader Relationship”。
- 中英互鏈、tags、核心數字與但書一致；`pnpm check:lang-parity` 無問題。
- `pnpm check:series-order` 無 blocking，只有全站既有缺號警告。
- 兩篇中文 `check:tw` 均為 0 blocking／0 review；phrase ledger 無命中。
- Patreon 中英外鏈無 broken，僅 Patreon Help Center 各有一個 403 需人工確認；Beehiiv 中英各有 Reuters 401 broken。
- 四檔 `git diff --check` 通過。

## 來源結構

- Patreon：官方來源承擔產品、費率、匯出、政策；TechCrunch 提供費率與 Autopilot 的獨立報導，但成效數字仍源自公司。文章有清楚揭露這一層。
- Beehiiv：大多數功能、價格、匯出與 AI 權限來自官方頁；Reuters 是主要獨立媒體，但規模數字仍來自管理層。精確價格的獨立交叉來源尚未全文讀取。
- 四篇未見 affiliate／ref／utm 追蹤參數，也沒有把推薦文寫成無缺點的推銷稿。

本次只檢查四篇已提出的宣告及其 dossier 對應，未評估 Patreon 或 Beehiiv 主題覆蓋是否完整。
