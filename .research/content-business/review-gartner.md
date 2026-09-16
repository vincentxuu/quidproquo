# Gartner〈決策保險〉交叉審稿

- 審稿日期：2026-09-17
- 對象：`2026-09-17-gartner-decision-insurance.md`、`2026-09-17-gartner-decision-insurance-en.md`
- 方法：依 `post-review` 與 `post-verify` 做 targeted review；只查指定高風險主張，不是全文逐句 fact-check。
- 網頁路徑：Groundlane `web_search`／`web_fetch`／`web_extract`／`document_parse`。官方 HTML 均以完整頁面為準；兩份價格 PDF 的擷取限制另列。

## 結論

**🟡 可發布前小修；沒有發現需整篇退回的紅旗。**

文章最重要的界線都有守住：Magic Quadrant 是第一步而非答案；「決策保險」明說不保證結果、不轉移責任；ZL 的主張與法院實際裁判理由分開；AskGartner 只被用來證明 beta 已推出，沒有拿來解釋營收、留存或股價。中英版論旨、數字與限制一致。

仍建議處理三項黃色問題：

1. **公部門價格尚未達高風險數字的雙來源門檻。** 文章連到州政府原始價目表，也清楚限制其外推範圍；但本輪 Groundlane 無法完整解析紐約 PDF，佛州 PDF 只在官方搜尋索引中看到 `$150,822` 鄰近片段，尚不足以逐欄確認產品名稱、single-license 欄位與有效期。發布前應人工開 PDF 複核，或補第二個獨立、可全文讀取的政府來源。
2. **「85% 留存率也顯示這不是讀完一篇就離開」是合理詮釋，不是留存率本身能證明的因果。** 建議弱化成「與多年訂閱、持續使用的企業服務模型一致」。英文 `reinforces the point` 也同樣稍強。
3. **第一張 Mermaid 容易被讀成 Gartner 官方規定的標準採購漏斗。** 官方資料分別支持 MQ、Critical Capabilities 與 BuySmart 的功能，但未證明所有客戶都按圖中順序前進。正文的 `可以沿著這條路走`／`can move through this path` 已有降格，若再把圖名標成「一種可能流程（作者整理）」會更穩。

## Targeted fact verification

| 主張 | 判定 | 證據與界線 |
|---|---|---|
| 2025 全年營收約 65 億美元；年末 CV 52 億美元 | **Confirmed** | Gartner FY2025 新聞稿直接列 `$6.5 billion` revenue 與 `$5.2 billion` contract value；10-K／SEC filing 是另一個一手財報錨點。兩語版本一致。 |
| Insights 訂閱產品約占 2025 營收 78% | **Confirmed** | 2025 10-K 原文為相關 Insights 產品／服務占總營收約 78%；Groundlane 搜尋亦定位到 SEC accession `0000749251-26-000112` 及同句的獨立 filing mirror。文章用「約」正確，且沒有把 78% 誤寫成利潤或所有 Insights segment revenue。TL;DR 與正文一致。 |
| Insights 客戶留存 85%、直接互動逾 510,000 次、逾 2,400 名專家、77% 多年合約 | **Confirmed** | 均為 2025 10-K 的公司揭露；屬公司自報營運指標。文章沒有把 interaction 次數當獨立使用者，也沒有把 77% 當續約率。留存率後接的商業模式推論應視為作者分析，見上方黃色問題。 |
| MQ 是理解市場的第一步；只看 Leaders 未必最佳 | **Confirmed** | Gartner 官方 methodology 頁完整頁面明說 MQ 是 first step，也明說 Niche Player 等可能更符合使用者需求；兩軸為 Ability to Execute／Completeness of Vision。文章 framing 準確。 |
| Critical Capabilities 依 use case 比較產品能力 | **Confirmed** | 官方完整頁面稱其為 MQ 的 essential companion，依 critical differentiators 與 use cases 評分，並用來建立進一步評估的 shortlist。文章沒有把它寫成採購保證。 |
| BuySmart 可整理需求、短名單、問卷、共同評分與部分 proposal review | **Confirmed / sequence inferred** | 功能敘述與官方產品頁相符；但把 MQ → CC → analyst inquiry → BuySmart 排成單一路徑是作者整理，不是已證的普遍客戶旅程。 |
| 紐約 `$141,271`、佛州 `$150,822` 的 Guided Individual Access 單一授權年費 | **Unverifiable in this run** | 兩個連結均是政府網域的原始 PDF，文章也正確聲明它們不是平均成交價。Groundlane 對紐約 PDF 遇到 DNS／解析失敗；佛州官方 PDF 的搜尋索引顯示 `$150,822` 及相鄰 multi/self-directed 價格，但完整 PDF 解析回傳空內容，無法逐欄完成第二來源交叉確認。不能只靠搜尋摘要把兩個精確價格判為已雙重驗證。 |
| 「決策保險」代表降低搜尋、協調、事後說明成本，不保證選對或免責 | **Confirmed as clearly labelled analysis** | 這是作者的分析框架，不是 Gartner 自稱的產品類別。開頭、失敗情境與結尾三度寫出不保證結果／責任不可外包，沒有把比喻偷換成法律保險或實證因果。可保留。 |
| Gartner 向買方與部分受評供應商收費，並有持股／董事席次限制與 Ombuds 機制 | **Confirmed, company self-description** | Gartner independence page 完整頁面支持。文章同時提醒商業關係不自動證明偏誤、制度也不證明無偏，沒有把公司政策當成獨立稽核結論。 |
| ZL 指控商業關係影響評價；法院駁回 defamation／trade libel，因 MQ 排名屬不可證真假的主觀意見 | **Confirmed** | 地方法院意見明確把 ZL 的偏誤說法當訴狀 allegations，並在 motion-to-dismiss 階段為法律分析而假定事實；法院駁回相關請求的核心是 MQ 評價具定性、主觀性，不能證真偽。文章後句「不等於法院證明 Gartner 沒有偏誤」正確守住 allegation／ruling 邊界。 |
| AskGartner 已向全球 licensed users 完成 beta launch | **Confirmed** | Gartner 2025 Q3 財報新聞稿完整頁面直接如此陳述。文章隨即說這不證明提高留存，也不能把營收／股價歸因於它，因果邊界清楚。 |
| GenAI 先商品化搜尋與摘要；通用模型不自然擁有 Gartner 私有互動、benchmark、workflow | **Analysis, appropriately framed** | 這是競爭論點，不是已有因果研究的結果。`private/non-public interactions` 可理解為客戶互動本身不公開；文章沒有宣稱 Gartner 已把所有互動拿去訓練 AskGartner，這點很重要。 |

## 數字衍生一致性

- TL;DR 的「Insights 約占 78%」與正文、10-K 的 `approximately 78%` 一致。
- `$6.5B` 是公司新聞稿的四捨五入全年總營收；文章未拿它和 78% 相乘後再宣稱精確 Insights 營收，因此沒有假精度問題。
- `$5.2B contract value` 沒有被誤稱 revenue／bookings。
- `85%` 是 Insights client retention，不是 revenue retention；文章名詞正確。
- `77%` 是年末合約組合中的 multiyear 比例，不是「77% 客戶簽多年」；中文「77% 的合約」、英文 `77% were multiyear` 可接受，但英文若追求完全明確可寫 `77% of contracts were multiyear`。

## 圖表資訊價值

### Mermaid 1：採購流程

**有資訊價值。** 它把三種常被分開談的內容產品（MQ、Critical Capabilities、analyst inquiry）接到 BuySmart 與企業內部實測／法遵，直接服務全文的「內容進入工作流」命題。唯一風險是線性箭頭暗示官方或普遍順序；加「作者整理的一種可能流程」即可。

### 比較表：企業恐懼 × Gartner 供給 × 成本 × 不承擔事項

**本篇最有效的圖表。** 四欄把「決策保險」從漂亮比喻落到可驗證的 job-to-be-done，最後一欄持續約束過度宣稱。中英內容逐格一致。

### Mermaid 2：規模回饋迴路

**有用，但證據強度低於第一張。** 它清楚表達品牌、互動、研究、工作流、續約的循環；正文也立即把它降格為 `scale-driven feedback loop` 而非純 data network effect。`更多互動 → 研究與基準更完整` 是合理機制假說，並非公開文件直接證明，建議圖說標成「推論模型」。

## 中英一致性

**🟢 實質一致。** 標題、TL;DR、兩張 Mermaid、比較表、數字、ZL 法律界線、AskGartner 因果限制與結尾責任邊界均對齊；英文不是逐字硬譯，語氣自然。

小差異不影響事實：

- 中文「研究團隊持續知道企業正在煩惱什麼」對應英文 `repeatedly exposing analysts to the problems...`，意思一致。
- 中文「非公開互動」對應英文 `private interactions`，均未宣稱這些互動必然進模型或 MQ。
- 中文「今晚就能做的修正」英文省掉 `tonight`，屬自然在地化，不是內容缺漏。

## 文章品質與語氣

- 開場符合 ELI5：用跨部門採購把抽象商業模式講成具體任務。
- 結構完整：產品 → 價格 → 護城河 → 利益衝突／法律 → 失敗模式 → AI 威脅 → 邊界。
- 可執行性強：需求先分類、記錄 cutoff date、同題實測、指定 owner、保留採用／拒絕理由。
- 中文整體自然，`check:tw` 無 A/B 級命中。惟「這不是……而是……／不是……而是……」類對照句在全文出現數次，仍在可接受範圍；若再潤稿，可優先改掉 line 51、60、64 附近的模板化對照，而不是動核心論證。

## 機械檢查

| 檢查 | 結果 |
|---|---|
| `pnpm verify` | ✅ 全綠 |
| `pnpm astro check` | ✅ 0 errors；repo 既有 hints，不是本文錯誤 |
| `pnpm check:tw <zh>` | ✅ 0 blocking、0 review |
| `pnpm check:links <zh>` | ⚠️ exit 1：Gartner 官網 5 個 403（工具標示需人工確認）；investor.gartner.com 三頁逾時。Groundlane 本輪已成功完整讀取 MQ、Critical Capabilities、independence、FY2025 與 Q3 results，故不能把這些逾時判成死鏈。 |
| `pnpm check:links <en>` | ⚠️ 與中文版相同 |

## 來源紀錄（本輪）

| URL | 用途 | 完整度 | 查閱日期 |
|---|---|---:|---|
| https://investor.gartner.com/news-releases/news-release-details/gartner-reports-fourth-quarter-2025-financial-results | FY2025 revenue、CV、segment results | 完整 HTML | 2026-09-17 |
| https://www.sec.gov/Archives/edgar/data/749251/000074925126000112/0000749251-26-000112-index.htm | 官方 2025 10-K accession／申報日期 | 搜尋定位；SEC 詳頁對 Groundlane 回應受限 | 2026-09-17 |
| https://investor.gartner.com/static-files/ba7bf87c-2680-4780-a345-8679d232b8a6 | 2025 10-K 原始 PDF | 原始檔存在；全文 projection 超過 Groundlane output limit | 2026-09-17 |
| https://companiesmarketcap.com/eur/gartner/sec-reports-10k/0000749251-26-000112/ | 10-K 的 78% 句子交叉定位 | 搜尋摘要／filing mirror，非主要一手依據 | 2026-09-17 |
| https://www.gartner.com/en/research/methodologies/magic-quadrants-research | MQ framing | 完整 HTML | 2026-09-17 |
| https://www.gartner.com/en/research/methodologies/research-methodologies-gartner-critical-capabilities | Critical Capabilities framing | 完整 HTML | 2026-09-17 |
| https://www.gartner.com/en/research/methodologies/independence-and-objectivity | 收入關係與 safeguards | 完整 HTML；公司自述 | 2026-09-17 |
| https://www.gartner.com.au/en/products/buysmart | BuySmart 功能 | Groundlane 本輪連線中斷；沿用文章已列官方頁作待人工複核項 | 2026-09-17 |
| https://online.ogs.ny.gov/purchase/prices/7300122601pl_gartner.pdf | 紐約價格 | Groundlane DNS／解析失敗 | 2026-09-17 |
| https://dms-media.ccplatform.net/content/download/169292/1232619/2024-02%20Florida%2081141902-18-ACS%20Exhibit%20C_Pricing.pdf | 佛州價格 | 官方搜尋索引可見數字；全文解析空白 | 2026-09-17 |
| https://case-law.vlex.com/vid/zl-technologies-inc-v-894873613 | ZL district opinion | 完整判決頁 | 2026-09-17 |
| https://investor.gartner.com/news-releases/news-release-details/gartner-reports-third-quarter-2025-financial-results | AskGartner beta | 完整 HTML | 2026-09-17 |

## 查證範圍聲明

本輪只核對指定主張及其直接相依的產品／法律／財務敘述；沒有逐一驗證每個一般性採購建議，也沒有測試付費 Gartner 產品內的實際 UI、問答品質或 BuySmart entitlement。最主要未完成項是兩份政府價格 PDF 的逐欄雙來源複核；因此精確價格維持 **Unverifiable in this run**，不是判定錯誤。
