# 審稿紀錄：容器、gVisor、microVM 差在哪（agent-isolation order 1）

## post-verify
獨立查證者核對：多數 Confirmed；Overstated／查不到的處理如下（中英同步）：
- 「單租戶是官方底線」：文件說的是每個 Firecracker「行程」對應單一租戶，不是整台主機；「底線」是作者的詞 → 改為依原文，並明說「主機也留給單一租戶」是比文件更保守的做法；表格欄名改「一行程一租戶」。
- CVE-2026-24834 段落：公告摘要有「依我目前的理解」的保留，並註明 arm64＋QEMU 未驗證；只有 Impact 欄是無保留句 → 兩者都寫出；「L1 破、L2 還在」標為本文的歸類。CVE 編號與 GHSA 的對應來自 OpenAI 文中的連結文字，公告本文沒有 CVE 編號；文章只說 OpenAI 把它列在回饋 Kata 上游的修補中，未說是 OpenAI 發現的。
- arXiv：「不是端對端攻擊示範」原文只指 WordPress 案例 → 範圍改正。論文另有位元傳輸原語與動作分類，測試平台資訊、中段實驗章節（約 7k 字元）查證者未讀；order 2、5 動筆前我會讀完。
- `SMT Host state unknown` 的字面解釋不在指定來源 → 刪解釋，只留「需要時向供應商詢問」。sysfs 路徑已在本環境實際執行確認存在。
已確認：引文 "one system call away from host compromise"、Sentry 從不轉送系統呼叫、Gofer、Firecracker 一行程一 microVM、vCPU 執行緒視為惡意、page cache 積壓拖慢其他 guest、Kata「VM 裡再跑容器」、公告 CAP_MKNOD／Cloud Hypervisor／root in guest。

## post-review
- 對象與問題：前兩段說清楚三種隔離、兩個問題、先讀哪篇 ✅
- 主脊：由容器→gVisor→microVM 的核心數量，一條 ✅
- 動作：三題選型表＋兩行指令（含預期輸出說明）✅
- 圖：1 張三欄堆疊圖，強調最底下共用硬體（accent）；表格補數字化比較 ✅
- 增量歸因：未把 microVM 的既有能力歸給新東西；CVE 例子只說明邊界位置 ✅
- 限制節：不排名、不代表已有真實平台上的攻擊 ✅

## post-polish
register-scan：但書 4%、引述 0、無模板化轉折；人名主詞 4 處為產品名稱（gVisor、Firecracker、Kata），不是研究者。ledger 無命中。check:tw 0 blocking。
