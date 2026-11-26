產出模型卡：ERNIE 5.5 Flash Preview（百度，order 82），中英雙版，依技術突破角度（條件 C：DSpark 投機解碼內建、條件 B：官方部落格確認）撰寫，而非當成全新 base model（Preview 帶 base_model:finetune 標籤，掛在 2026-11-05 發布的 ERNIE-5.5-Flash-Base 之下）。

- 圖解：各補一張比較圖（ERNIE 5.5 Flash Preview vs Claude Opus 5.5 四項 benchmark 對照），中英座標相同。
- diagram-preview 未跑：無瀏覽器；check:diagram-text 已過（0 錯誤）。
- check:references／check:lang-parity／check:tw／check:series-order／check:no-emoji 全過（check:tw 僅 1 個既有 B 級 WARN「智能」，非 blocking）。
- 候選比較：同一批 HF trending 還看到 Aleph Alpha Kolibri 1.1（官方確認但屬 1.0→1.1 小版本更新）與 Ant Group inclusionAI/LingSante-3.1-flash（首個開源醫療多模態模型，官方 X 公告確認），兩者皆有效但判斷 ERNIE 5.5 Flash Preview 新聞性與 Agent 開發相關度更高，故本次只寫一篇。
