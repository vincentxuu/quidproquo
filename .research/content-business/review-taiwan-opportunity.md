# 台灣垂直情報收束篇：中英稿交叉審查

審查日期：2026-09-17

審查範圍：

- `src/content/posts/product/2026-09-17-taiwan-vertical-intelligence-opportunity.md`
- `src/content/posts/product/2026-09-17-taiwan-vertical-intelligence-opportunity-en.md`

本報告只記錄問題與驗證結果，未修改文章。

## 結論

**整體：有 1 項必修事實邊界、3 項建議修正，其餘核心要求通過。**

文章已清楚把 TrendForce 的規模與客群描述標成公司自報，也沒有引用單一來源的精確半導體市占數字；五個機會方向明確標成研究假說，並主動揭露尚缺付費訪談、合約、續約率與競爭全貌。中英文的系列、順序、標籤、結構與圖表一致。

主要風險出現在 IEK／MIC 段落：正文一方面承認沒有讀到完整服務頁，另一方面仍把「政策研究與顧問服務已有成熟供給」寫成確定事實。這超過 dossier 允許的窄結論，應收斂成「台灣已有法人／機構型研究供給」。

## 🔴 必須修正

### 1. IEK／MIC 的功能與供給成熟度超出可驗證範圍

- 中文：第 71 行附近，「它們說明一般產業趨勢、政策研究與顧問服務已有成熟供給。」
- 英文：第 71 行附近，`Their presence shows that broad industry trends, policy research, and advisory work already have established suppliers.`

研究 dossier 的證據邊界是：IEK 服務頁抓取逾時、MIC 官網遭 WAF 阻擋，因此只能確認兩者是既有法人／機構型研究供給，不能把服務內容或成熟度寫成已驗證事實。雖然下一句誠實揭露抓取限制，但不能反向支持前一句的功能描述。

建議把中英文都縮成不描述功能的窄結論，例如：

- 中文：「第三層是既有法人與機構型研究供給，包括 IEK 與 MIC。」
- 英文：`The third layer is existing institutional research supply, including IEK and MIC.`

保留後面的抓取限制與「不做方案／營收比較」說明即可。

## 🟡 建議修正

### 2. `TrendForce 證明／proves` 的語氣強於現有證據

- 中文 frontmatter `tldr`：「TrendForce 證明模式存在」；小標「TrendForce 已經證明」；結論「TrendForce 已經說明答案不只一種」。
- 英文 frontmatter `tldr`：`TrendForce proves the model exists`。

正文對公司自報界線處理得好，但目前證據能確認的是產品與研究方法存在，以及公司自報的客戶分布；沒有獨立財務、續約或留存資料能證明這套模式的商業成效。`證明／proves` 容易讓讀者讀成成功已被獨立驗證。

建議統一改成「顯示這種模式存在／shows that the model exists」或「提供一個已存在的案例／provides an existing example」。這不影響文章論點，卻能讓語氣與證據強度一致。

### 3. TrendForce 客群與據點的自報主張應在同段直接掛來源

- 中文第 32 行附近：「它也自報多數客戶來自境外，並在……設點。」
- 英文第 32 行附近：`TrendForce also reports that most of its customers are overseas and lists offices...`

兩段都立即標出「公司自報、未獨立稽核」，界線正確；但來源連結只出現在前面公司沿革段。建議在 `它也自報／TrendForce also reports` 直接連回官方公司介紹，讓高風險主張的 inline source 不必跨段尋找。

### 4. 生產線圖應明標為作者提出的模型，不是 TrendForce 已揭露流程

- 中文第 38–47 行附近。
- 英文同一節的第一張 Mermaid。

圖中的「境外企業工作流 → 續約與使用回饋 → 固定欄位」是合理的產品模型，但 TrendForce 官方頁並未證明這一整條因果迴圈。正文目前以「真正值得複製的是一條……生產線」引入，讀者仍可能把圖視為對 TrendForce 實際營運的還原。

建議在圖前明寫「以下是本文提出的可複製模型」，英文對應 `The following is this article's proposed model`。第二張 go／no-go 圖已明確放在作者提出的四週測試裡，不需同樣修正。

## 🟢 可選改善

### 5. 參考資料中的 Taiwan Trend Research 沒有進入正文論證

中英文參考資料都列出 Taiwan Trend Research，但正文沒有引用或提及。可擇一處理：

- 若要補強「台灣已有更廣泛研究供給」，在不宣稱其當前規模與方案的前提下於競爭環境段落 inline 引用。
- 若不需要支撐任何正文主張，移除該筆，避免形成裝飾性來源。

### 6. 英文版中文來源標示可依專案慣例改為 `(in Mandarin)`

英文參考資料目前使用 `(in Chinese)`。不影響正確性，但 `post-review` 慣例是 `(in Mandarin)`；可統一用語。

### 7. 決策樹的 `No → one-off research` 可保留更多診斷空間

「境外買方沒有反覆使用」未必立即證明應改做一次性研究，也可能是買方角色、決策問題或更新頻率選錯。正文後面已有「重選決策問題」的觀念，因此圖中可考慮把該節點寫成「診斷需求；必要時改做一次性研究」，避免二元推論。不改也不構成事實錯誤。

## 指定風險檢查

| 檢查項目 | 結果 | 判斷 |
|---|---|---|
| TrendForce 規模／客群界線 | 通過，但建議補同段 inline source | 正文明寫是公司自報、無獨立稽核，不把自報數字當第三方驗證 |
| IEK／MIC 未全文讀取資訊 | **未通過** | 「政策研究、顧問服務、成熟供給」超過可證範圍；須縮成機構型研究供給存在 |
| 五個方向是否為假說 | 通過 | 標題、首句與次段均明寫研究假說、不能稱為市場成立，並列出缺失證據 |
| 美國商務部精確 60／90 數字 | 通過 | 正文刻意不引用單一頁面百分比，只使用「全球關鍵節點」窄結論 |
| 是否暗示 DIGITIMES 唯一 | 通過 | 開頭與結論都明確拒絕「再做一家 DIGITIMES」及唯一模型敘事 |
| 第一張 Mermaid | 建議加框 | 模型有用，但續約回饋迴圈屬作者推演，應明標為 proposed model |
| 第二張 Mermaid | 通過 | 位於四週驗證框架，分支清楚；僅有可選的診斷細化 |
| 比較表 | 通過 | 五道門對應問題、通過狀態與失敗模式，沒有虛構量化門檻 |

## 中英與 metadata 檢查

- `date`：兩篇皆為 `2026-09-17`。
- `category`／`type`：兩篇皆為 `product`／`deep-dive`。
- `series`：中文為 `情報如何成為一門企業生意`、英文為 `How Intelligence Becomes an Enterprise Business`，兩篇皆 `order: 6`。
- `tags`：兩篇完全一致，共 6 個，皆為既有 kebab-case 標籤。
- 語言連結：中英文互鏈 slug 與日期正確。
- 結構：中英文各 9 個 H2、2 張 Mermaid、1 張五道門比較表，章節順序一致。
- 開頭：前三段完成夜市後台比喻、台灣情境與五道門論點。
- `tldr` 與 `description`：資訊具體且不是逐字重複；唯一建議是把 `proves／證明` 降階。

## 機械驗證

| 命令 | 結果 |
|---|---|
| `pnpm verify` | 通過；包含 references、post-quality、台灣用語、series order、lang parity、SEO、skills sync 等檢查 |
| `pnpm astro check` | 通過：0 errors、0 warnings；80 個既有 hints |
| `pnpm check:links <中文稿>` | 通過：6 個外部連結，0 broken |
| `pnpm check:links <英文稿>` | 通過：6 個外部連結，0 broken |

## 建議處理順序

1. 先收斂 IEK／MIC 功能描述，解除唯一必修事實風險。
2. 把 `證明／proves` 降為 `顯示／shows`，並替 TrendForce 客群自報補同段來源。
3. 為第一張 Mermaid 加上「本文提出的模型」標籤。
4. 最後決定 Taiwan Trend Research 是進入正文支撐競爭環境，或從參考資料移除。
