# Creator orders 2 / 4 交叉審稿：Substack、Ghost

- 審稿日期：2026-09-17
- 範圍：
  - `src/content/posts/product/2026-09-17-substack-ten-percent-discovery.md`
  - `src/content/posts/product/2026-09-17-substack-ten-percent-discovery-en.md`
  - `src/content/posts/product/2026-09-17-ghost-ownership-not-just-hosting.md`
  - `src/content/posts/product/2026-09-17-ghost-ownership-not-just-hosting-en.md`
- 對照 dossier：`creator-substack.md`、`creator-ghost.md`
- 結論：**有 3 組發佈前必修；主論旨、遷移邊界、公司自報標示、Ghost 0%／Recommendations／ActivityPub、AI 邊界與中英 metadata 整體一致。**

## 必修

### 1. Substack 的 10% 被三處寫成「全部收入」，範圍過大（中英都要同步）

- 位置：zh 39、95、141；en 39、95、141。
- 現況：圖中寫「Substack 收全部收入的 10%」／`10% of all revenue`，決策圖與結論也沿用「全部營收／all revenue」。
- 問題：官方支持的是對 **paid subscriptions／付費訂閱營收** 收 10%，不是對創作者的廣告、贊助、顧問或其他站外營收一律抽 10%。正文開頭與 TL;DR 原本寫對了，但圖與結論把範圍擴大，讀者只看圖會得到錯誤規則。
- 建議修法：三處統一成「全部付費訂閱營收的 10%」／`10% of paid-subscription revenue`；決策圖可寫「平台費是否低於可留存增量與節省成本」，避免把 `ΔR` 誤稱為已扣成本的 profit。
- 證據：Substack 官方 Stripe 說明寫「If you add paid subscriptions, we charge 10%」；Axios 是第二來源。2026-09-17 Groundlane 重讀官方頁，全文、未截斷。

### 2. Platformer「2023 年增加超過 70,000 免費訂戶」目前只有一個可用來源

- 位置：zh/en 123。
- 判定：數字與 dossier 中的一手公告一致，**不是已發現的錯誤**；但依本系列「高風險數字至少兩個獨立來源、至少一手」的證據閘門，尚未達標。
- 現況：Platformer 原文是一手來源，但 dossier 標記為 `truncated:true`；沒有第二個完整、獨立來源確認精確的 `>70,000`。
- 建議修法（二選一）：
  1. 補一個全文可讀、獨立且直接支持 `>70,000 free subscribers in 2023` 的來源；或
  2. 移除精確數字，保留較低風險的個案結論：Platformer 明確表示 Substack Recommendations／network 對其成長有幫助，但最後仍因成本與治理考量遷移。
- 不應把 The Verge 的一般遷移訪談當成精確數字的第二來源，除非全文實際出現相同數字與期間。

### 3. Ghost(Pro) 價格快照中的 Starter `$18` 缺第二個可靠完整來源

- 位置：zh/en 44。
- 判定：2026-09-17 Groundlane 重讀官方 pricing 頁，確實顯示年繳、1,000 members 下 Starter `$18`、Publisher `$29`、Business `$199`，Starter 不含 paid subscriptions；文章的日期與條件寫法正確。
- 問題：dossier 的獨立價格資料對 Starter 曾出現 `$15/$18` 差異，可能來自計費週期或近期改價。Publisher／Business 有較一致的交叉資料，但 Starter `$18` 尚未有第二個全文、同期來源。依本系列高風險定價雙來源規則，仍缺證據，不宜僅因官方快照正確就視為完成。
- 建議修法（二選一）：
  1. 找到同期獨立來源完整確認三個方案、年繳與 1,000 members 條件；或
  2. 刪除 Starter 的精確價格，只保留經營付費會員須從 Publisher 起、官方當日快照為 `$29/mo billed yearly`，並確保 `$29` 也有第二來源。

## 建議

### Substack

1. **公式表加上「示意單位」欄註。** zh/en 82–89 已說不是美元預測，但表格純數字容易先被讀成美元；可在欄名加 `illustrative units`，資訊會更自足。
2. **決策圖不要把 `ΔR` 直接叫 incremental profit。** 公式把 `ΔR` 定義為增量營收，圖中的「增量淨利／incremental profit」比公式多做了一層未明示轉換。改成「可留存增量收入＋節省成本」會更精確。
3. **Network 數字標示已合格。** 2022 約 10%、2024 25% new paid、2025 30% paid、現行頁 25% paid 的分母與期間被拆開，且明確說是公司／共同創辦人自報、非 audit；不要再把它們畫成成長趨勢。
4. **Stripe 遷移邊界已合格。** 文章沒有再說「一定重刷卡」，也沒有反向說「有 CSV 就能搬」；同一 Stripe account、舊訂閱費率協調、直接關閉可能取消與按比例退款都寫清楚。
5. **AI 邊界已合格。** WIRED 樣本的偵測限制、Substack 規範未全面禁止 AI、Pew 僅支持搜尋點擊關聯而不支持 Substack 轉換因果，均未過度外推。

### Ghost

1. **中文 TL;DR 與標題可把「Ghost 抽成 0%」收窄為「Ghost 平台交易費 0%」。** 英文已精確使用 `0% transaction fee`，中文正文也有說明；同步收窄可避免讀者誤以為 Stripe 或其他成本也是零。
2. **第一張 Mermaid 的箭頭語意不明。** 「讀者關係 → 付款 → 品牌 → 內容 → 程式碼」比較像因果鏈，但正文其實是在列五個控制層。可改用 subgraph／平行節點，或在箭頭標示「控制層往下」，讓圖真的承載結構而非裝飾。
3. **Recommendations 表述已合格。** 官方文件支持可推薦任何網站、以 Webmention 通知有 endpoint 的網站；一鍵訂閱目前限 Ghost-to-Ghost。文章沒有把任意網站推薦誤寫成任意網站都能一鍵訂閱。
4. **ActivityPub 表述已合格。** Ghost 6 官方與 Nieman Lab 交叉支持 social-web 分發；文章保留「相容／compatible」限制，也沒有宣稱其 reach 或轉換等同 Substack。
5. **0% 與 Stripe 可攜性已合格。** 正文清楚區分 Ghost 0% transaction fee、Stripe processing、Ghost(Pro) 與 self-hosted 維運成本；也沒有把自己的 Stripe 說成所有來源都能一鍵續扣。
6. **AI 邊界已合格。** 文章只說 API／開源提供整合選擇，明確表示未找到 Ghost core 原生生成式寫作助手，且沒有把第三方 GhostAI／OpenAI 說成原生功能或宣稱所有權必然帶來流量。

## 中英、metadata 與圖表檢查

- 四檔 `date/category/type/tags/series.order` 對齊；zh series order 2/4、en series order 2/4 正確，互鏈正確。
- 中英主張、表格、公式與 Mermaid 結構一致；沒有只在單一語言出現的高風險結論。
- Substack 的轉換鏈、損益決策、遷移流程，以及 Ghost 的遷移與分發圖都有資訊價值；需修的是 Substack 費率節點範圍與 Ghost 五層圖的箭頭語意。
- Ghost 比較表把 self-hosted discovery 寫成「同左／The same」大致有官方依據：Ghost 6.0 稱 social-web integration 適用 Ghost(Pro) 與 self-hosted，Recommendations 也是產品核心；但「自行維運」仍是必要限定，文章已有保留。

## Targeted checks

| 檢查 | 結果 | 備註 |
|---|---|---|
| `check:references` 四檔 | PASS | 無 reference issue |
| `check:lang-parity` | PASS | 全站 1,909 對無 parity issue |
| `check:series-order` | PASS with unrelated warnings | 本系列 order 2/4 metadata 正確；輸出中的既有缺號非本四檔 blocker |
| `check:tw` 兩篇中文 | PASS | 0 blocking、0 review |
| `check:post-quality` 四檔 | PASS with warnings | Ghost tags 的詞面命中警告；標籤與內容實際相關，不列必修 |
| `check:links` 四檔 | PASS | 22 links 無 broken；兩個 Substack support URL 回 403，工具標記人工確認，但 Groundlane 可全文讀取官方頁 |

第一次 targeted `check:references` 曾因把 `--` 傳給專案 script 而報 `Path not found: --`；移除 `--` 後重跑通過，這是呼叫方式錯誤，不是文章失敗。

## 本輪官方頁重讀紀錄

| URL | 支持 claim | 完整度 | 存取日期 |
|---|---|---:|---|
| https://support.substack.com/hc/en-us/articles/4405482746132-How-do-I-set-up-my-Stripe-account-on-Substack-to-start-receiving-payments | paid subscriptions 10%；Stripe/billing 另計；iOS Apple fee | 全文、未截斷 | 2026-09-17 |
| https://substack.com/growthfeatures | 公司自報 network 25% paid subscriptions；未標統計期間 | 全文、未截斷 | 2026-09-17 |
| https://docs.ghost.org/migration/substack | 同一 Stripe account 條件；內容與會員遷移 | 全文、未截斷 | 2026-09-17 |
| https://ghost.org/pricing/ | `$18/$29/$199`、年繳、1,000 members、Starter 無 paid subscriptions | 全文、未截斷 | 2026-09-17 |
| https://ghost.org/help/are-there-really-no-transaction-fees/ | Ghost 0% transaction fee；Stripe 成本另計 | 全文、未截斷 | 2026-09-17 |
| https://docs.ghost.org/recommendations | Webmention、可推薦任意網站、1-click 限 Ghost 站點 | 全文、未截斷 | 2026-09-17 |
| https://ghost.org/changelog/6/ | Ghost 6 social web／ActivityPub；Ghost(Pro) 與 self-hosted | 本輪輸出截斷，但關鍵段完整出現；dossier 曾全文讀取 | 2026-09-17 |
