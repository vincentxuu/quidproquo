# CB Insights 雙語稿交叉審稿

審稿日期：2026-09-17
檔案：

- `src/content/posts/product/2026-09-17-cb-insights-research-to-workflow.md`
- `src/content/posts/product/2026-09-17-cb-insights-research-to-workflow-en.md`

範圍：依 `post-review` / `post-verify` 思路做 targeted review；不修改文章。公開事實以 Groundlane `web_fetch` / `web_extract` 回讀主要來源。本文只檢查文中已提出的宣告與指定風險，沒有重新研究 CB Insights 的完整產品史。

## 結論

整體已接近可發：中英實質一致，ELI5 的「試吃／中央廚房」比喻清楚，Mosaic 的公司自評、回溯研究與「獨角獸命中率不等於投資報酬」界線寫得好；沒有把未驗證 ARR 寫成已實現營收，也沒有硬選互相衝突的成立年份。Mermaid 與四層比較表都有資訊功能，不是裝飾。

發布前建議處理 2 個必修：把「嵌入工作流會帶來續約」從已證因果改成分析性推論，並替成立年份互相衝突的說法補上第二個 inline source。另有 3 個建議修。

## 機械檢查

| 檢查 | 結果 | 判讀 |
|---|---|---|
| `pnpm check:tw <zh>` | 0 blocking、1 review | 命中「貼標」，實際原句是「貼標籤」，為正常台灣用法，不需改 |
| `register-scan.sh` | 0 長句、3% 但書、0 模板轉折、無高數字密度 | 通過 |
| `scan-ledger.sh` | 無命中 | 通過 |
| `pnpm check:links <zh>` | 1 failed：Reuters 401 | Groundlane 同 URL `web_fetch` 為 HTTP 200 且全文可讀，內容不是壞鏈；但本機 link checker 仍紅，需決定是否換可穩定檢查的鏡像／官方來源 |

## 🔴 必修（影響發布）

### 1. 「工作流嵌入 → 續約」被寫成已證因果

位置：

- 中文 frontmatter `tldr`（line 8）：「資料、評分與工作流才負責續約」
- 中文 line 41：Mermaid `CRM、API、內部模型 → 持續監控與續約`
- 中文 lines 74、103、111：「這一步改變了續約理由」「形成更高的更換成本」「企業續約，則是因為……」
- 英文 frontmatter `tldr`、lines 41、74、103、109 的對應句

問題：Salesforce、Affinity 與 API 官方頁能證明「可以整合哪些欄位／觸發哪些動作」，不能證明整合已造成更高續約率或某個實際 renewal reason。文章目前沒有 churn、retention、cohort 或客戶研究。這是合理的商業模式推論，但圖中的箭頭與 `tldr` 把它呈現成已觀察到的因果。

建議：全篇統一改成推論語氣，例如「可能提高續約黏性」「形成潛在更換成本」「企業有理由續約，是因為……」。Mermaid 最後一格可改成「持續監控／提高更換成本」，不要直接畫到「續約」。`tldr` 也要同步降級，因為它最容易被單獨引用。

### 2. 「公開來源對成立年份不一致」只有 Reuters 一個 inline source

位置：中文 line 99、英文 line 99。

問題：句子主張來源互相衝突，inline 只連到 Reuters；Reuters 全文明確寫「formed in 2010」，卻看不到另一個年份。這是一個高風險日期宣告，讀者點開現有連結無法驗證「不一致」。研究 dossier 記錄 Business Insider 稱 2008、其他資料源稱 2009、Reuters 稱 2010，但正文只讓讀者看到其中一邊。

建議：在「不一致」旁同時連 Business Insider（2008）與 Reuters（2010），或刪掉來源衝突的句子，只保留「本文不需要精確成立年份」。不要為了填空硬選一年。

## 🟡 建議修（影響可讀性／分寸）

### 3. Mosaic 四構面的描述少了動態重分配，容易讀成固定配方

位置：中文 line 60、英文 line 60。

目前寫法：「現行分數主要由……四個面向組成。」這句本身沒有錯；Groundlane 讀到的官方白皮書確實列 Growth Momentum、Financial Strength、Industry Health、Management Strength 四構面。可是白皮書 FAQ 另說，欄位缺失時會動態重分配權重，且 management 的處理不是所有公司都相同。

文章 line 66 已談資料缺口，但沒有把缺值與分數計算連起來。建議在 Mosaic 限制段補一句：「構面缺值時，官方稱權重會動態重分配，因此同一分數不代表每家公司由完全相同的證據組成。」這會讓「看似精準的分數」批評更具體。

### 4. 免費內容與付費資料「共用同一座資料工廠」應標為分析，不是官方揭露

位置：中文 lines 26、44；英文 lines 26、44。

The Cruncher 與 API 文件能證明公司如何清洗資料，newsletter／研究頁能證明有公開內容；目前來源沒有逐項揭露每篇公開研究與付費資料是否真的共用同一 pipeline。文章用「可以反過來做」尚有留白，但圖後的「兩邊共用資料工廠」較斷言。

建議：改為「從產品結構看，兩邊可以共用資料工廠」或「合理推測兩邊大量共用底層資料」。不要把漂亮的架構圖當成公司公開的內部系統圖。

### 5. Reuters 連結內容正確，但外部連結檢查會紅

位置：中文／英文 line 99 與 references。

`check:links` 回 401；Groundlane 在本次審稿對同 URL 取得 200、作者 Reuters、發布日 2015-11-09，全文支持 1,000 萬美元 Series A、第一筆機構投資與資金用途。因此這不是內容查證失敗，而是檢查器與 Reuters 存取策略不相容。

建議：若發布流程要求 `check:links` 綠，可換成穩定可存取且同樣支持 claim 的官方募資公告，再把 Reuters 留作第二來源；不要因 401 刪掉交叉來源。

## 🟢 已確認／不必改

### 中英一致

- frontmatter、series order、標題方向、`tldr` 與核心結論一致。
- 中文 lines 107–111 在英文 lines 107–109 合併成較緊湊段落，但沒有漏掉「今晚可做的表格練習」或結論。
- 兩版的數字、年份、Mosaic 限制、VentureSource 與 Series A 敘述一致。

### ELI5 與結構

- 前三段已說清楚 CB Insights 是什麼、免費內容與付費產品差在哪裡。
- 「試吃／中央廚房」能一路對應 newsletter、資料清洗與整合，不只出現在開頭。
- 主脊依產品化步驟排列：內容 → 資料 → 排序 → 工作流 → AI／歷史資料 → 護城河，閱讀順序清楚。

### Mosaic 自評與回測限制

- Groundlane 回讀官方白皮書確認：0–1,000 分、2023-10-01 scoring date、24 個月結果窗、top 30 中 7 家成為獨角獸、23.3% hit rate、為比較組 VC 中位數的 4.7 倍。
- 文章清楚標「CB Insights 自行發布」，沒有把同公司的 product page 當獨立驗證。
- 正確區分「兩年內成為獨角獸」與基金報酬，也指出 VC 有 stage、ownership、deal access 與 mandate 限制。
- 「Mosaic 是分流，不是判決」是合適落點；沒有把公司自評寫成獨立證明。

### 定價、ARR、成立年份

- Groundlane `web_extract` 確認官方 pricing 頁三處 `Request pricing`，Data Solutions 明寫 `Consumption-based access`，也列 onboarding、migration 與 dedicated forward-deployed strategist。中文／英文 line 83 的定價敘述符合頁面。
- 沒有引用 SEO 比價站的未驗證每席價格。
- 沒有把 2021 年「on track」的 ARR 預測寫成已實現營收；文章完全不寫 ARR，處理正確。
- 沒有硬選 2008／2009／2010 任一年為成立年份；方向正確，只差把衝突雙方的 inline source 補齊。

### Mermaid 與表格

- Mermaid 用 9 個節點呈現兩個出口，節點數在可讀範圍內，確實幫助理解「同一資料加工、不同商品出口」。
- 四層比較表把產品單位、工作與限制放在同一列，資訊價值高於段落重述。
- 唯一需要調整的是 Mermaid 最後的 renewal 因果，不需要刪圖或另畫更多圖。

### Inline sources

- 高風險數字都有原位連結：Mosaic 4.7 倍、VentureSource 1983、2015 Series A。
- The Cruncher 明確標為歷史流程，沒有把舊自動化比例當成 2026 現況。
- API、Salesforce、Affinity、ChatCBI 與 pricing 都連到對應官方頁，不是泛用首頁。

## 查證 verdict 摘要

| 宣告 | Verdict | 證據／理由 |
|---|---|---|
| Mosaic 為 0–1,000 分、四構面 | 🟢 Confirmed（官方單一來源） | Mosaic whitepaper；但缺值會動態重分配，建議補限制 |
| Top 30 hit rate 為 VC 中位數 4.7 倍 | 🟢 Confirmed as company self-evaluation | 數字與方法符合白皮書；不是獨立研究或投資報酬 |
| 官方不公開固定美元價、Data Solutions 依用量 | 🟢 Confirmed（官方現行頁） | pricing page `Request pricing` / `Consumption-based access` |
| 2020 收購 VentureSource、資料追溯 1983 | 🟢 Confirmed | Business Insider 全文；研究 dossier 另有公司新聞稿候選 |
| 2015 年 1,000 萬美元 Series A、第一筆機構投資 | 🟢 Confirmed | Reuters 全文；Groundlane 200 |
| 精確成立年份有衝突 | 🟡 Evidence incomplete inline | 研究底稿有 2008/2009/2010 衝突，正文只連 Reuters 2010 |
| CRM/API 整合提高續約／造成續約 | 🔵 Misframed | 能力可證，續約因果沒有 retention/churn 證據 |
| 免費內容與付費資料共用同一資料工廠 | 🟡 Inference | 產品與方法可支持合理推論，未找到公司內部 pipeline 的直接揭露 |

## 審稿優先順序

1. 先把 renewal 因果全篇同步降級（含 `tldr`、Mermaid、正文與英文）。
2. 替成立年份衝突補第二個 inline source。
3. 補 Mosaic 缺值／動態權重一句。
4. 將「共用資料工廠」標成分析性推論。
5. 視發布流程處理 Reuters 401。
