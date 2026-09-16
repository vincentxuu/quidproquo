# AI 搜尋 orders 3–4 中英交叉審稿

審稿日期：2026-09-17
範圍：

- `src/content/posts/product/2026-09-17-seo-to-brand-direct.md`
- `src/content/posts/product/2026-09-17-seo-to-brand-direct-en.md`
- `src/content/posts/product/2026-09-17-first-party-community-tools.md`
- `src/content/posts/product/2026-09-17-first-party-community-tools-en.md`

方法：依 `post-review`、`post-verify`、`source-eval` 檢查結構、事實、來源角色與推論邊界。公開來源先檢查完整 callable inventory，再以 Groundlane `web_search` 找候選、`web_fetch` 讀全文。Google Analytics Help 首次抓取因輸出上限失敗，縮小格式與提高 byte budget 後由 Groundlane 完整讀取；未改用其他網頁工具。

## 結論

兩篇的主結論大致站得住：order 3 明確寫出 Direct 不等於品牌、SEO 並未死亡；order 4 也沒有把 email、社群或工具寫成完全 owned，且有處理匯出、供應商、隱私、維護與留存限制。中英 frontmatter、series order、語言互連、段落、表格與 Mermaid 數量一致。

發布前仍有 **5 組必修**。其中兩組是 inline source 缺口，兩組是圖表用實線畫出正文已否認的必然因果，另一組是 cohort 觀察仍用了「改變／outperform」這類因果字眼。建議同步修改中英稿，避免語意 parity 漂移。

## 🔴 必修

### 1. Order 3：Search Console 的 AI 流量合併規則缺 inline citation

- 位置：`seo-to-brand-direct.md:66`；英文 `:66`。
- 現況：正文宣稱 AI Overviews 與 AI Mode 納入 Search Console Performance 的整體 Web search traffic，且不能靠該報表拆出各 AI 介面貢獻。這是可變的產品能力，但本段沒有 inline link；同一 Google 來源只在前一節與文末出現。
- 查證：Groundlane 完整讀取 Google Search Central 頁面，官方明載 AI features 併入 Performance report 的 Web search type。文章的保守說法與來源一致。
- 直接修法：中英兩句的主詞直接掛回官方頁，不要讓讀者回文末猜來源。

  - 中文：`[Google 官方說明](https://developers.google.com/search/docs/appearance/ai-features)將 AI Overviews 與 AI Mode 帶來的網站表現納入……`
  - English: `[Google's documentation](https://developers.google.com/search/docs/appearance/ai-features) includes performance from AI Overviews and AI Mode…`

### 2. Order 3：Direct 的核心定義應改引 Google 官方頁；現有 Google config 頁不是直接證據

- 位置：中英 `seo-to-brand-direct*:48` 與參考資料。
- 現況：核心主張由 Ruler Analytics 支持，接著以 Google Analytics configuration reference 說明 referrer、source、medium 欄位。Ruler 是分析服務商，對這項定義有商業利益；Google config reference 只列設定欄位，沒有直接完整解釋 `(direct) / (none)` 的分類與成因。
- 查證：Groundlane 找到並完整讀取 Google Analytics Help 的官方頁。官方明確說 `(direct) / (none)` 代表沒有清楚 referral source 的流量，並列出缺 UTM、redirect、手打網址／離線文件與 ad blocker 等原因。這比 Ruler 更接近原始規則。
- 直接修法：把該段第一個來源改為或至少並列 [Google Analytics：Understand (direct) / (none) traffic](https://support.google.com/analytics/answer/15258820?hl=en)。Ruler 可留作二手解說，但不應是核心定義的主要依據；config reference 只保留用來支持欄位如何設定，不要把它描述成完整 Direct 分類規則。

### 3. Order 3：第二張 Mermaid 把觀察框架畫成必然轉換漏斗

- 位置：中英 `seo-to-brand-direct*:72–90`。
- 現況：`第一次有用的體驗 → 品牌查詢／訂閱／保存工具 → 啟用 → 付費 → 留存與毛利` 全用實線。正文與表格其實已正確說明 activation 不保證回訪、saved-tool usage 不證明留存；圖的視覺語法卻把它們畫成連續因果。
- 風險：Mermaid 常被單獨截圖或由 answer engine 抽取，讀者未必會把第一張圖後的 caveat 套到第二張圖。
- 直接修法：把跨層箭頭改成虛線並標 `可能形成`／`possible path`，或改成三個並列量測層，由 `同一 cohort` 連到三層，而不是把三層串成必經流程。圖下再補一句：「跨層差異是待驗證關聯，不是這張圖已證明的因果。」中英同步。

### 4. Order 4：第一張 Mermaid 暗示 email → 行為資料 → 社群 → 工具 → 交易的成熟度與因果階梯

- 位置：中英 `first-party-community-tools*:26–37`。
- 現況：正文 `:39` 已說「不是必經漏斗」，但圖仍以五個實線箭頭串成單一路徑。這會暗示社群必須建立在行為資料上、工具必須經過社群、交易又是工具的自然下游；這些都不是文中來源證成的關係。
- 直接修法：以「一次匿名曝光」為中心，分支到 `consented identity`、`community context`、`saved-state tool`；三者再以虛線連到「可能的再次服務／交易結果」。治理與營運成本各自掛在分支旁。圖名可改為「可控制資產的不同層，不是成熟度階梯」／`Different control layers, not a maturity ladder`。

### 5. Order 4：cohort 段已寫 correlation ≠ causation，但前一句仍宣稱資產「改變／outperform」留存

- 位置：中文 `first-party-community-tools.md:90–94`；英文 `:90–94`。
- 現況：中文先寫「是否改變啟用、重複使用、付費與留存」，英文寫 `whether these assets outperform another public article`，最後才說 correlation is not causation。參與社群或啟用工具的人本來就可能是高意圖使用者；單純 cohort 比較無法排除 selection bias。
- 直接修法：

  - 中文標題改為「用 cohort 找差異，不把差異當因果」；正文改成「觀察這些資產是否**伴隨**較高的啟用、重複使用、付費與留存」。
  - 英文改為 `observe whether these assets are associated with different activation, repeat use, payment, and retention`，不要用 `outperform`。
  - 若要寫「造成／改變」，另補預先定義的實驗或準實驗設計；目前這篇不需要擴寫，保留描述性 cohort 即可。

## 🟡 建議修

### 1. Order 4 開場的 AI 搜尋前提沒有 inline source，且語氣比 Google 官方頁更強

- 位置：中英 `first-party-community-tools*:22`。
- 現況：「公開文字更容易在站外被回答／public text easier to answer away from the source」是系列前提，但本篇沒有 inline citation。文末雖列 Google AI features 頁，該頁說 AI Overviews／AI Mode 提供答案與 supporting links，並沒有直接證明「更容易在站外被完整取代」。
- 直接修法：改成明確的推論：「Google 的 AI features 會在搜尋介面組合答案並附 supporting links；因此，內容業者不能假設每次曝光都會帶來原站造訪。」第一句掛 [Google 官方頁](https://developers.google.com/search/docs/appearance/ai-features)，第二句標成本文推論。若 order 0 已有完整證據，亦可用站內連結轉手，避免本篇重講。

### 2. Order 4 的第一方資料定義最好補來源或降成本文操作定義

- 位置：中英 `first-party-community-tools*:45`。
- 現況：email、帳號偏好、產品內行為被統稱為 first-party data。這是常見產品用法，但來源段落下一段直接進入 ICO／GDPR，讀者可能誤以為這是法規分類。
- 直接修法：句首先加「本文把第一方資料操作性地定義為……」；或補一個明確定義 first-party data 的權威來源。不要把行銷分析術語包裝成 GDPR 的法定分類。

### 3. 台灣讀者的隱私落點仍偏薄

- 位置：中英 `first-party-community-tools*:47–49`。
- 做得好的地方：文章明標 ICO／GDPR 是歐洲與英國來源，不是台灣法律意見，沒有把 GDPR 偷換成全球規則。
- 缺口：中文稿談的是台灣讀者會實作的 email、帳號、匯出與刪除流程，卻完全沒有台灣法規的一手入口。
- 直接修法：不必展開法律教學；在「不是台灣法律意見」後補一個台灣主管機關或全國法規資料庫的個資法入口，並寫「實際告知、利用、查詢／更正／刪除義務仍依適用法規與個案判斷」。英文同步概述並標 `(in Chinese)`。若不補，就維持目前產品設計範圍，避免再增加台灣法律結論。

### 4. 中文語域可再收斂

- `seo-to-brand-direct.md`：register scan 抓到 2 個超過 60 字長句（`:92`、`:94`）及 1 個模板化句型（`:50`）；`crawl-to-refer ratio` 段英文術語密度較高。
- `first-party-community-tools.md`：2 個長句（`:49`、`:94`），4 個「不是 A，而是 B」型句法（`:22`、`:45`、`:59`、`:96`）。
- 直接修法：把每個長句拆成兩句；`channel label` 改成「流量管道標籤」；四個對照句保留最有力的一處，其餘直接陳述。這不影響事實，但能減少模板感。

### 5. 來源角色與透明度可在文中簡短交代

- Order 3 來源組成：Google 官方／產品文件 3 項、Cloudflare 自家研究 1 項、Ruler Analytics 廠商解說 1 項。Cloudflare 的 crawl-to-refer 是平台以自身可見資料建立的指標，文章已把 native-app referrer 缺口與不可當 CTR 寫清楚，這點做得好。
- Order 4 來源組成：Google 官方文件 2 項、ICO 與歐盟執委會主管機關資料 2 項。全是適合支持「自家產品規則」或「法規原則」的一手來源，但它們不驗證 email、community、tool 會提升 retention；文章不可讓表格或圖替來源補出這個因果。
- 四篇沒有 affiliate、短網址或追蹤參數，不需利益揭露。若未實測任何平台，維持現在的框架語氣，不要補「實務證明」一類措辭。

## 🟢 已通過／做得好

- **Direct ≠ brand**：order 3 的標題、tldr、專節、表格與行動建議一致；沒有把 unknown-source traffic 當品牌忠誠。
- **SEO 未死**：Google 官方全文支持「AI features 仍使用 Search 技術要求、索引、snippet eligibility 與既有 SEO fundamentals」。文章沒有宣告 SEO 被取代。
- **量測邊界**：Cloudflare ratio 被正確描述為 crawl requests ÷ identifiable referrals，並保留 native App 可能不送 `Referer`、不能當 CTR 或單站流量損失的限制。
- **owned 邊界**：order 4 同時檢查 export、合法觸達、context/state reconstruction、vendor replaceability，沒有把匯出 CSV 或自有網域等同完全控制。
- **隱私邊界**：ICO data minimisation 與 EU individual-rights 頁均由 Groundlane 完整讀取，文章對必要性、定期刪除以及特定條件下可攜的寫法保守；也有地域免責。
- **工具風險**：Google spam policy 全文支持 misleading functionality 案例；文章只用它要求「工具先真的可用」，沒有誇大成留存證據。
- **格式**：四篇皆為 ELI5 前三段、2 張 Mermaid、1 張實用表格；中英互連 URL 存在。
- **metadata/parity**：order 3 與 4 的 `date`、`category`、`type`、tags、語言、series name/order 成對；`pnpm check:lang-parity` 通過，`check:series-order` 無 blocking issue。
- **機械檢查**：四篇外部連結全通；兩篇中文 `check:tw` 均為 0 blocking／0 review。

## 來源查證紀錄

| 來源 | 支持範圍 | 角色 | Groundlane 讀取 |
|---|---|---|---|
| https://developers.google.com/search/docs/appearance/ai-features | AI features eligibility、SEO fundamentals、Search Console Web traffic 合併 | Google 官方 | 全文，未截斷 |
| https://support.google.com/analytics/answer/15258820?hl=en | `(direct)/(none)` 無清楚 referral source；UTM、redirect、手打網址、離線文件、ad blocker 等成因 | Google 官方 | 首次 OUTPUT_LIMIT；第二次全文，未截斷 |
| https://developers.google.com/analytics/devguides/collection/ga4/reference/config | page referrer、campaign source／medium 設定欄位 | Google 官方 | 全文，未截斷 |
| https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/ | crawl-to-refer 定義與 native App referrer 限制 | Cloudflare 自家研究 | 全文，未截斷 |
| https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/ | adequate、relevant、limited；定期檢查與刪除 | 英國主管機關 | 全文，未截斷 |
| https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en | EU 個人資料權利及條件 | 歐盟執委會 | 全文，未截斷 |
| https://developers.google.com/search/docs/essentials/spam-policies | misleading functionality 定義與案例 | Google 官方政策 | 全文；頁面較長，輸出截斷，但相關段落完整取得 |

## 檢查範圍聲明

本次查核文章已提出的產品、量測與法規宣告，並檢查主題覆蓋、因果圖示及來源可信度。沒有把官方產品文件當成 email／community／tool retention 的獨立效果研究，也未提供台灣、英國或歐盟法律意見。
