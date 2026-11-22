產出 AI Agent Arxiv Digest 2026-11-16（zh-TW + en），主題為 Agent 記憶系統：MAPE（程式演化找出跨系統可遷移的兩個記憶設計模式）、DISCERN（企業場景把記憶問題從檢索重新框定成解析）、WikiTrace（證據鏈記憶降低記憶誘發退化）。三層候選池共篩選約 30 篇候選（14 天回溯池延續的 watch/rejected ~17 篇 + 本輪新發現 ~13 篇），3 篇入選。

例外與降級：
- Semantic Scholar API 多次 429，已重試後對 2611.17068／2611.14320 查得 citationCount=0，對 2611.15729（DISCERN）始終未查得，依同批論文年齡推估趨近 0，已在文章編輯判斷表與 screening JSON 的 toolDegradation 中記錄。
- arXiv 官方 /new 批次於本次執行時仍停留在 Friday 13 Nov 2026（週末無公告 + 週一批次尚未上線），依 skill 指示照樣收集該批次候選，未略過。
- 圖解：放了 1 張（三層卡點對照圖，中英版座標相同只換文字），沿用 2026-11-15 文章已驗證過的 dg-box/dg-tag/dg-label/dg-sub/dg-rule CSS class。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 下無 chrome-headless-shell 執行檔，中英兩版皆被腳本自動 skip）。
- targeted verify 全綠：check:tw 0 blocking（新檔無 WARN）、check:series-order 0 錯誤（新檔 order=176 無缺號無撞號）、check:references 0 error（新檔無 WARN）、check:lang-parity 0 issue。
