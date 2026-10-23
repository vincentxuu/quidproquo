# OpenVLHarness 文章證據紀錄（2026-10-23）

## 讀者問題
有看圖產品、模型常數錯／漏小字／認不出物件的團隊：這套框架給模型哪些工具、記憶存什麼、成績與部署成本放一起值不值得試。

## 來源與讀取範圍
- 起點：aiposthub 中文導讀（全文讀完，二手整理；內容逐項回查到下列一手來源）
- 論文 arXiv:2610.26860：摘要頁讀完；全文以 Exa web_fetch 取得 arxiv.org/html/2610.26860（約 12 萬字元，存 scratchpad）。讀過 §1–2（設計）、§3.1–3.6（設定、主結果、推理強度、消融、失敗分析、harness 優化）、§5 結論；附錄 B.2、B.6 只讀標題與表格說明（未逐表核對）。
- 專案頁 openvlharness.github.io：全文讀完（作者、結果摘要、與其他 harness 比較數字）。
- GitHub README：全文讀完；SECURITY.md 全文讀完。docs/ 與 services README 未讀。

## 工具鏈紀錄
- Groundlane web_fetch：專案頁、GitHub、arXiv abs 成功；arXiv HTML 回 OUTPUT_LIMIT（上游超過位元組上限，maxBytes 設到 20MB 仍失敗）。
- curl arxiv.org：403，代理拒絕（arxiv.org 不在此 session 白名單）。
- jina read_url（PDF）：回傳空內容（問答抽取需 API key）。
- Exa web_fetch_exa：成功取得 arXiv HTML 全文。
- WebSearch 結果中的 dev.to 兩篇（arXiv ID 錯寫為 2605.05287、聲稱 SaaS 版與 3x 加速）與論文／README 不符，未採用。

## 數字核對（皆對照一手來源）
- 9.7–12.6：README 七個主模型表；摘要稱八個 backbone；專案頁稱六個 backbone——正文用 README 的「七個主模型」。
- 34.24→45.41（Qwen3-VL-8B）：README。Astra 60.27→70.17 且 22 項皆進步：README／論文 §3.2。
- Luna 45.8／Codex 43.8／Ours 56.5／Sketchpad 45.6：專案頁、論文 §3.2。
- Qwen2.5-VL-7B 33.45 vs AdaReasoner 25.29／PixelReasoner 28.02／DeepEyesV2 25.02：論文 §3.2；README 說此設定不在釋出中。
- 推理強度：Base 低 44.3→最高 48.0；Ours 中等 56.5、低 49.9、最高 60.1；成本至多 37%：論文 §3.3。
- 失敗分析 9,893 條；擁擠畫面 >25 物件；grounding 中 incorrect tool output 75%；VS&DR omitted call 49%：論文 §3.5。
- 消融 8B overall：37.06／40.84／44.23／44.93／47.14：論文 Table 3。
  - 注意：Table 3 的 overall 前四列等於四領域平均，最後一列（47.14）不等於 (45.46+33.10+59.81+50.82)/4=47.05；且內文「+3.1／+4.5」與表內差值（約 +2.2／+3.4）對不上。正文只引表內數字，並註明口徑與 22 項平均不同。
  - 消融基線 37.06 ≠ 主表基線 34.24（口徑不同），正文已提醒不能互比。
- Harness search vs tool generation：ERQA +4.1／RealWorldQA +3.7 對 +0.2／+0.1；SparBench +8.2／FREAK-VQA +4.5 對 −0.5／−1.0：論文 §3.6。
- 部署／資料外送／執行風險：README Quick start、SECURITY.md。
- 評審：SECURITY.md「The paper uses GPT-4o for search and deep-research judging」。

## 環境限制
- pnpm install 失敗：codeload.github.com 取 lanefoundry/gatelane 回 403（疑似私有 repo），整個安裝回滾，未能跑 pnpm verify / astro check / diagram-preview。
