產出模型卡：SenseNova Loop-9B 正式版（`sensenova/SenseNova-Loop-9B`，2026-11-17 商湯發布，取代 10-30 的 Preview），條件 B（官方公告確認的新模型，Pandaily／IT Home／HF model card 三方交叉核實）。中英雙版皆已寫入 `src/content/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b{,-en}.md`，series order 78。

- 圖解：補 1 張前後對照長條圖（Preview vs 正式版，GAIA／Terminal-Bench 2.1／AutomationBench），中英各一版。
- diagram-preview 未跑：此沙箱無瀏覽器（`/opt/pw-browsers` 缺 chrome-headless-shell），`check:diagram-text` 已過（0 錯誤，7363 篇／506 張圖）。
- 搜尋工具：HF trending API 直接 curl（公開 JSON，未用 Groundlane）；firecrawl_search／firecrawl_scrape 用於官方公告與第三方報導交叉核實，無降級。
- `check:references`／`check:lang-parity`／`check:tw`／`check:series-order`／`check:diagram-text`／`check:no-emoji` 針對新檔皆 0 error／0 blocking。

---

第二輪（同日第二次觸發）產出模型卡：Thinking Machines Lab「Inkling 2 Mini」（`thinkingmachines/Inkling-2-Mini`，2026-11-20 發布），條件 A+B 皆符合（HF trending #1、createdAt 在 7 天內、無 base_model tag、likes 1878；且 Thinking Machines 官方 blog／model card／Artificial Analysis 三方交叉核實）。業界首個公開發布的 looped transformer，26.4B 總參數／3.4B 原生 active（循環 3 次等效 5.4B）。中英雙版已寫入 `src/content/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini{,-en}.md`，series order 79。

- 篩選範圍：HF trending API（T1 文字生成／T2 多模態／T3 圖像／T4 影片四組）直接 curl（公開 JSON，未用 Groundlane）。candidate 排查：Tencent Hy4-flash（已於 11-19 寫過，排除）、Microsoft Aion-1.0-Instruct-2.3B（符合條件 A 但 downloads 僅 3099、trend 落後 Inkling 2 Mini 許多，優先度較低，本輪未寫）、Maxwell-V1-Flash（createdAt 超過 7 天且 downloads<100k，不符任一條件，未寫）、Apple FastFrames-L/S（有 base_model tag，非新 base model，本輪未深入）。
- 圖解：補 1 張長條圖（Inkling 2 Mini vs Qwen3.8-27B，DeepSWE v1.1／SWE-bench Pro v2 Hard／SWE-bench Verified），中英各一版。`check:diagram-text` 第一輪跑出 TEXT-OVERLAP（圖例文字跟第三組長條數字疊字，因為分數接近繪圖區頂），把圖例 y 從 32 調到 18 後重跑 0 error。
- diagram-preview 未跑：此沙箱 Playwright 預期的 chrome-headless-shell revision（1208）跟實際安裝的 revision（1243）不符，`browserType.launch` 直接報 Executable 不存在；`check:diagram-text` 已過（0 錯誤，7381 篇／518 張圖）。
- 搜尋工具：Groundlane MCP `web_search`／`web_fetch` 正常可用，無降級；HF trending API 用 curl 直連（公開 JSON，不吃 Groundlane 額度）。
- `check:references`／`check:lang-parity`／`check:tw`／`check:series-order`／`check:diagram-text`／`check:no-emoji` 針對新檔皆 0 error／0 blocking。
