產出模型卡：SenseNova Loop-9B 正式版（`sensenova/SenseNova-Loop-9B`，2026-11-17 商湯發布，取代 10-30 的 Preview），條件 B（官方公告確認的新模型，Pandaily／IT Home／HF model card 三方交叉核實）。中英雙版皆已寫入 `src/content/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b{,-en}.md`，series order 78。

- 圖解：補 1 張前後對照長條圖（Preview vs 正式版，GAIA／Terminal-Bench 2.1／AutomationBench），中英各一版。
- diagram-preview 未跑：此沙箱無瀏覽器（`/opt/pw-browsers` 缺 chrome-headless-shell），`check:diagram-text` 已過（0 錯誤，7363 篇／506 張圖）。
- 搜尋工具：HF trending API 直接 curl（公開 JSON，未用 Groundlane）；firecrawl_search／firecrawl_scrape 用於官方公告與第三方報導交叉核實，無降級。
- `check:references`／`check:lang-parity`／`check:tw`／`check:series-order`／`check:diagram-text`／`check:no-emoji` 針對新檔皆 0 error／0 blocking。
