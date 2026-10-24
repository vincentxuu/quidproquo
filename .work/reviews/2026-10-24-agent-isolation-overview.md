# 審稿紀錄：Agent 的程式碼跑在哪裡（agent-isolation order 0）

## post-verify
獨立查證者（未看作者結論，自行重讀 OpenAI 原文與事故報告、gVisor、Firecracker、Kata、Docker 文件）核對約 45 條主張：33 Confirmed、8 Overstated、0 Wrong、5 查不到。
已修（中英同步）：
- 五層表的「承諾／不承諾」是本文歸納，原寫得像各家原話 → 表前加一句說明，例子才是來源原話。
- L2「承諾」原寫「碰不到 host 核心的系統呼叫介面」，gVisor 的 Sentry 與 microVM 的 VM exit 仍是間接路徑 → 改為「不能直接發、只能間接觸及」。
- L4 引的 gVisor「沙盒不能取代安全架構」原文語境是 host 上的可利用服務，不是出口控制 → 刪掉，只留 Firecracker 的出處。
- OpenAI 文字「microVM」在兩份擷取的措辭不同 → 改「輕量虛擬機（microVM）」。
- 開頭「幾乎都會寫」是市場概括 → 改「不少」。
- 補：L3 例子加上「OpenAI 紅隊就在這一層找到通訊管道」；L5 例子加上報告說 run 沒有如預期自動停止。
時間算術確認：9:50:23→10:02:11 約 12 分鐘；→12:34:30 約 2 小時 44 分。
仍查不到的項目（標準工具行為，不在指定來源）：`docker run --network none`、seccomp 列為容器機制（gVisor 文件把 seccomp-bpf 列為核心安全機制，Docker 專頁未讀）。兩者都是通用知識，維持原文；若要發布前補，連 Docker 網路與 seccomp 文件。

## post-review
- 對象：前三段說明是什麼、給誰、讀完能做什麼 ✅
- 主脊：按「由內往外的層」，一條 ✅
- 動作：五格表填寫（含範例列）＋「三格以上沒寫就列入風險清單」✅
- 圖：1 張巢狀圖，內容對應正文；監控不在包含關係裡，圖說已明寫 ✅
- 連結：首次出現的 Docker、gVisor、Firecracker、Kata、OpenAI、站內文章皆為 inline ✅
- 風險：L3「幾乎沒有承諾」是強語氣，已由 Firecracker 與 gVisor 兩處原文支撐，並標為本文歸納。
- 事件文不當入口：只用 9/20 事件當 L5 的一個例子，案例精讀在 order 3 ✅

## post-polish
register-scan：但書 10%、引述 0、無模板化轉折、無英文術語堆疊；「數字密度」曾因時間戳報 13 個，已刪去 10:02、10:05 兩個時刻。ledger 掃描無命中。check:tw 0 blocking。
