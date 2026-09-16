# Cross-review: DIGITIMES supply-chain intelligence

- Reviewed files:
  - `src/content/posts/product/2026-09-16-digitimes-supply-chain-intelligence.md`
  - `src/content/posts/product/2026-09-16-digitimes-supply-chain-intelligence-en.md`
- Review date: 2026-09-16
- Mode: report only; no article edits
- Overall verdict: **內容主脊、雙語結論、ELI5、當事人自述邊界與圖表設計都成熟；發布前有 1 個必修來源問題，另有 4 個值得收斂的雙語／查證問題。**

## Targeted checks

| Check | Result | Notes |
|---|---|---|
| `pnpm check:tw <zh file>` | ✅ pass | 0 blocking, 0 review |
| `register-scan.sh <zh file>` | ✅ pass | 0 長句；但書密度 6%；0 模板化轉折 |
| `scan-ledger.sh <zh file>` | ✅ pass | 無慣性句型、台灣中文高風險詞或標題壓縮語氣 |
| `pnpm check:links <zh file>` | ❌ fail | TIME inline 與 reference URL 共 2 筆 TypeError |
| `pnpm check:links <en file>` | ❌ fail | 同上 |
| Groundlane fetch：TIME root 與 `/2/` | ❌ unavailable | 兩個 URL 都回 `UPSTREAM_ERROR`／local browser failed；本輪不能把全文判為已讀 |
| Groundlane fetch：DIGITIMES single-user pricing | ✅ 200/full | 支持研究訂閱 5,700 美元、TechStats 加購 3,000 美元；頁面另標台灣以新台幣計價並加 5% 稅 |
| Groundlane fetch：DIGITIMES 中文研究中心 | ✅ 200/full | 支持每年 300+ 報告、23 個頻道、到府簡報與顧問專案；均屬公司自報 |
| Groundlane fetch：About DIGITIMES | ✅ 200/full | 支持供應鏈定位、產品線與公司自報規模；文章沒有把自報規模寫成獨立驗證 |

## 🔴 必修（影響發布）

### 1. TIME 歷史反例的來源未達「完整讀過」門檻，且兩個實際 URL 都無法通過 targeted link check

- 位置：中文第 98–100、133 行；英文第 94、127 行。
- 問題：
  - 中英文 inline 都連到 `https://techland.time.com/.../2/`，reference 則連到 root；targeted link checker 對兩者都回 TypeError。
  - Groundlane 對兩個 URL 的 bounded fetch 都失敗，本輪無法證明頁面目前可讀。
  - 既有 dossier 自己把 TIME 標為「🟡 大篇幅摘錄，未取得完整 25 案全文」，但文章把它列在正式參考資料。這違反 post writing guide「參考資料每一條都必須完整讀過」的硬規則。
  - 英文第 94 行又進一步列出 `16 / 5 / 4` 的精確拆分；中文只寫「多數案例大致或完全失準」。英文數字比現有可追證據更強。
- 建議：發布前取得可讀的 TIME 全文或合法 archive，逐項確認 25 案與 `16 / 5 / 4` 分類，再把 inline／reference 統一成可工作的 canonical URL。若仍拿不到全文，移除 reference entry，並把歷史反例改用已完整讀過、能支持同一窄結論的來源；不要只靠搜尋摘錄保留精確計數。

## 🟡 建議修（影響一致性、可追證性或分寸）

### 2. 中英文在兩個高風險數字上不是同一層資訊

- 位置：中文第 70–72、98–100 行；英文第 68、94 行。
- 問題：
  - 英文列出四個 5,700 美元研究頻道、3,000 美元加購，另加 900／1,200 美元單篇報告例子；中文只寫「研究頻道單一頻道都是 5,700 美元」與部分加購 3,000 美元。
  - 英文列 TIME 的 `16 / 5 / 4`，中文只有「多數失準」。
  - 兩版核心判斷一致，但讀者會拿到不同的證據強度。這類價格與歷史命中數屬高風險事實，不宜讓翻譯版比原文更斷言。
- 建議：兩版採同一資訊層級。若保留細項，中文版也列同一組且各自有 inline source；若證據不足，英文一起降到中文版的窄說法。

### 3. 5,700／3,000 美元是單一官方頁的查詢日快照，尚未達高風險價格的雙來源標準

- 位置：中文第 70–72 行；英文第 68 行。
- 查核：Groundlane 本輪完整抓到官方 single-user pricing，確認頁面反覆列出一年／單人研究訂閱 5,700 美元及多個 TechStats 加購 3,000 美元。頁面同時註明台灣使用者以新台幣計價並加 5% 稅。
- 問題：數字由 authoritative source 直接支持，且文章已標查詢日、單人價格、非企業合約，分寸很好；但 post-verify 對價格的門檻是至少兩個獨立來源。現有第二來源只確認產品結構，沒有獨立列價。
- 建議：把 verdict 留在「官方定價頁查詢日快照」，不要升格成普遍現價。若能取得實際 checkout／歷史價格通知或獨立採購證據，再升為雙來源 Confirmed。中文版也可像英文一樣寫明 `2026-09-16`，避免「查詢當日」離開文章日期後失去辨識度。

### 4. 台灣供應鏈聚落與跨節點採訪優勢的第一句沒有貼身 inline source

- 位置：中文第 44 行；英文第 44 行。
- 問題：段落先斷言台灣同時聚集晶圓、封測、零組件、筆電與伺服器 ODM，之後才連到 DIGITIMES research services；該產品頁支持追蹤欄位，卻不是「台灣聚落構成」的直接證據。讀者點現有 inline source，不一定看到前一句的依據。
- 建議：在聚落敘述本身補一個能直接支持台灣產業位置的官方／產業來源；或把句子明確標成本文的產業背景判斷。不要讓後半段產品頁替前半段承擔它沒有說的主張。

### 5. AI／零點擊段落有兩個推論寫得比證據更確定，英文尤其明顯

- 位置：中文第 106–110 行；英文第 100–104 行。
- 問題：
  - 「靠搜尋流量與一般快訊吸引讀者的部分，會直接承受零點擊壓力」／`face direct pressure from zero-click answers` 沒有 inline source，也沒有 DIGITIMES 流量來源資料。
  - `AI is more naturally a new interface` 後接能搜尋 archive、比較季度、草擬問題，屬合理產品推論，但 DIGITIMES 公開材料沒有證明這些功能已存在或帶來成效。
  - 中文有「若」「比較像」稍微降強度；英文更像現況陳述。
- 建議：兩版都加上 `[推論]` 或改成條件式：「若公開新聞負責獲客，零點擊可能削弱這一層；若歷史資料已結構化，AI 可以成為查詢介面。」若要寫成產業現況，需補零點擊研究與 DIGITIMES 自身流量／產品證據，兩者不能混為一個來源。

## 🟢 通過／保留（不建議為改而改）

### 雙語核心結論一致

- title、tldr、開頭與結尾都維持同一主張：供應鏈關係只是原料，續約價值來自可重複的情報生產線、歷史資料與工作流程。
- series name／order、tags、frontmatter、跨語言連結一致。
- 英文不是逐句硬譯，仍忠實保留中文論證次序。

### ELI5 hook 自然且有功能

- 菜市場價格牌／缺貨／盤商調價能讓非科技讀者理解「公開價格」與「提前知道供需變化」的差別。
- 類比只佔三段開場，之後立刻回到晶片、封裝、ODM 與品牌，沒有拖成裝飾故事。
- 英文把「菜市場」自然改成 produce market，沒有翻譯腔。

### 公司自述與可驗證事實分得清楚

- 第 46 行把創辦人對市場缺口的描述明確標為受訪敘事，不冒充量化市場研究。
- 第 60 行把每年 300+ 報告標成公司自報，且不外推研究品質或客戶成效。
- 第 90–92 行明說續約率、收入占比、資料庫使用頻率未公開；前兩年虧 2 億元與第十三年打平也標成同一當事人的回憶，而非兩個獨立財務來源。
- 英文完整保留這些限制，沒有把中文但書刪掉。

### TIME 反例的「用法」是對的，問題在來源可讀性

- 文章沒有拿 2012 年 Apple rumors 回查推翻 2026 年研究產品，也沒有把國際媒體引用當準確率。
- 第 100／94 行都保留樣本不代表全部 coverage 的限制。
- 「供應鏈動作 → 記者描述 → 最終結果推論」三層拆分有教學價值，避免把真實試產訊號直接等同上市產品。

### Mermaid 與表格都有資訊價值

- 第一張 Mermaid 把接觸、零碎訊號、編輯、產品、企業使用與續約串成完整生產線；第 38 行立即標示 feedback loop 是推論。
- 第二張 Mermaid 把可比資料、工作流程與再投資連回產業接觸；第 90／86 行明講無公開續約率，沒有把圖當成實證成效。
- 三列比較表各自回答公開新聞、供應鏈情報、決策建議的任務與弱點，比再加一張裝飾圖更有效。
- 兩張圖節點均為 6 個、採 `flowchart TD`，手機閱讀風險低；仍需由整合者在瀏覽器確認實際 Mermaid 字體與截斷。

### 台灣讀者位置成立

- 文章不是把外國 B2B 媒體摘要翻成繁中；核心案例本身就是台灣科技供應鏈的資訊優勢。
- 第 44–46 行把台灣製造聚落與創辦產品視角接起來，第 112–118 行又給讀者三個今晚可做的訂閱評估動作。
- 因此沒有必要硬塞「台灣啟示」標題。若系列日後要強化創業者角度，可另在總覽比較「哪個台灣垂直領域也有類似資訊密度」，不必在本篇新增未查證案例。

## Fact verdict snapshot

| Claim | Verdict | Reason |
|---|---|---|
| 1998 年創辦、創辦人曾在資策會市場情報中心 12.5 年 | 🟢 Confirmed as interview account | Business Weekly 全文支持；文章清楚標示敘事性質 |
| 每年 300+ 研究報告 | 🟢 Confirmed (company-reported) | DIGITIMES 中文研究中心全文支持；文章沒有外推品質 |
| 研究訂閱 5,700 美元／年、TechStats 3,000 美元 | 🟡 Single-source current snapshot | 官方定價頁全文支持；價格高風險，缺獨立第二來源 |
| 企業價格、續約率、收入占比 | 🟢 Correctly left unknown | 文章未捏造數字 |
| 前兩年虧約 2 億元、第十三年填平累虧 | 🟡 Attributed participant recollection | 兩媒體都依同一當事人口述；文章標示正確 |
| TIME 回查 25 案、多數失準 | 🟡 Source unavailable in this review | framing 謹慎，但來源未完整讀且連結檢查失敗 |
| TIME `16 / 5 / 4` 精確分類（英文） | 🟡 Unverifiable in this review | 現有 dossier 只記錄部分摘錄，Groundlane／link checker 都取不到全文 |
| AI 摘要與零點擊影響 | 🔵 Inference, partly over-asserted | 方向合理，缺 DIGITIMES 流量與實際 AI 產品成效證據 |
| 服務條款禁止未授權擷取／聚合 | 🟢 Confirmed in cited official terms | 可支持權利風險；不等於已發生 AI 授權爭議 |

## Scope statement

本次交叉審查檢查了文章中已提出的主要高風險宣告、雙語對應、inline source、ELI5、圖表與台灣讀者位置；沒有證明 DIGITIMES 商業模式的所有面向都已被完整涵蓋，也沒有以文章或公司自述驗證實際客戶成效。
