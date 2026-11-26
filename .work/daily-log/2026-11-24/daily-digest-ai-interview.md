產出：AI Engineer 面試日練 2026-11-24（星期二 Deep Learning & NLP，無加權覆寫）——KV cache 為什麼在 decode 階段變成記憶體頻寬瓶頸，以及 GQA／MQA 怎麼靠共享 KV head 縮小它，練習題取自 Mistral 7B 的 GQA＋sliding-window attention 真實面試題，中英雙版，series order 97。

- toolDegradation：Groundlane 掛載但登入被拒（需使用者重新授權）；firecrawl_search／firecrawl_scrape 回「Insufficient credits」（當日額度用盡，24h 後重置）；改用 Exa `web_search_exa` + `web_fetch_exa` 完成全部搜尋與頁面擷取，資料充足，未再往下層降級。
- 圖解：1 張 flow-diagram（decode 一步的 KV cache 讀寫路徑 + GQA 怎麼縮小它），中英文座標相同、只換文字；check:diagram-text 中英文皆 0 error；diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），check:diagram-text 已過。
- targeted verify：check:references／check:lang-parity／check:tw／check:series-order／check:diagram-text／check:no-emoji 皆無新增 WARN/ERROR（check:tw、check:series-order 既有的 WARN 均為其他舊檔案）。
