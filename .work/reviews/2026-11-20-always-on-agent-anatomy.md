# 審稿紀錄：零件與三級階梯（order 1，中英）

## post-verify
- Mistral 排程只有時間觸發、事件觸發 may follow、結果出現在側欄 ✅（docs）
- 豆包自動任務依預設時間、完成推送、雲電腦關機照跑 ✅
- Gemini 三種排程、「You tell Gemini what to do and when」、監控不適合快速變化、時間為約略 ✅
- OpenClaw Proactive check：初次設定建立、每 30 分鐘、主對話、閒置才跑、送擁有者私訊、NO_REPLY ✅（heartbeat migration 頁）
- Duet 晨間簡報、定時巡檢、跟進沉寂討論串、主對話只在完成或需決定時出聲 ✅
- Dots 主動研究唯讀、形成記憶、刪記憶要刪 dot ✅；「自己決定何時暫停與回來」標為 Pinggy 整理 ✅
- Grok 主 bot 自己 check in、bot 自行決定記什麼、無記憶頁、共用電腦 ✅
- **抓到並修正**：初稿寫 Hermes cron「不帶任何記憶，不知道你上週說過的事」。Cron Internals 文件與 GitHub issue #147971、#101754 確認長期記憶 MEMORY.md／USER.md 會載入，只是不帶對話歷史。中英兩版改寫該段與結論（Hermes 可自組接近 L3 的任務，差在不帶主對話、要自己設）。

## post-review
- 開頭用同一件事三種行為對照，接著才給定義 ✅；一條主脊：觸發→階梯→判準→電腦→收件匣→記憶→動作 ✅
- 一張分層圖（L1–L3）；四欄判準表是本篇的核心工具 ✅
- 結尾三個設定＋自我檢查，可照做 ✅

## post-polish
- 改掉一句「不是被叫去…而是…」否定式對比；tldr 中「帶著你」被判自指，改「依你的脈絡」「醒來時有沒有你的記憶」
- check:tw 0 blocking；register-scan、scan-ledger、check-post-quality、process-leak 皆清
- 圖：diagram-geometry／text／preview 全 ✓；手機寬度為框內捲動（640 寬圖的預設行為），截圖看過。
