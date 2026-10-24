# 審稿紀錄：沒有網路也能傳資料（agent-isolation order 2）

## post-verify
獨立查證者（自行重讀 Ristenpart 2009、Yarom 2014、Spectre 官方頁、arXiv 2607.17518 全文，並實際執行實驗程式）：約 60 條主張中約 52 條 Confirmed。已修（中英同步）：
- tldr 與實驗：原寫「50 bps 以下零錯誤，100 bps 以上接近亂猜」過強。查證者重跑時 50 bps 也出現錯誤。我另外用種子 1–6 各跑一次（20 bps：0–2、50 bps：0–4、100 bps：7–34、200 bps：21–38 個錯誤位元，每次 64 位元），改為範圍表，並寫明門檻隨機器與負載移動。
- 「修改 `pin_to_cpu` 的參數」是錯的操作 → 改為在 `run()` 傳給 sender、receiver 不同 CPU 編號。
- EC2 論文的「提供旁路存在的證據」少了 "may" → 補「可能存在」。
- 把 Yarom 背景段落描述的「一類快取旁路做法」誤寫成 Flush+Reload 自己的兩步 → 改為背景介紹的描述。
- 2009 年的快取通道是 Prime+Probe 的變體（Prime+Trigger+Probe）→ 補上。
- 頻寬：Docker 約 478 bps、錯誤率 0%；gVisor 約 290–357 bps、最高 1.96%；「桌機等級」改為論文的測試台（Core i7-7700）。
已確認：0.006／0.0005／約 0.2 bps、硬碟通道做法、clflush 與共用頁需求、「otherwise idle machines」、Spectre 官方頁兩句、arXiv 的 page cache 通道、direct I/O 與專用 block device 的衰減、noise amplification，以及「慢、吵、約好協定」的綜合敘述（已標明為作者歸納與「不能直接比」）。

## post-review
- 對象與問題：開頭承接 order 1 的問題，說明讀完能做的判斷 ✅
- 主脊：定義→原理→不只快取→三把尺→實驗，一條 ✅
- 動作：實驗可執行，附兩個可改的變因 ✅
- 圖：1 張序列圖（逐步播放 6 步），圖說註明編碼是示意 ✅
- 數字：頻寬收進表格；實驗結果收進範圍表 ✅
- 限制：實驗與引用數字皆來自受控環境，說明量級不等於真實平台風險 ✅
- 用語：「旁路」「隱蔽通道」為台灣媒體與資安文章常用說法；「側信道」僅在首次出現時括註。

## post-polish
register-scan：但書 8%、引述 0、無模板化轉折；ledger 無命中；check:tw 0 blocking。
