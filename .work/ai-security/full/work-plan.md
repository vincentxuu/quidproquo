# AI資安全系列完成計畫
2026-10-22 使用者明確指示「直接完成全系列」：允許剩餘20篇中英40檔及必要配套批次處理，覆蓋每批2篇停等；不再要求篇間確認。尚未授權commit/push/production deploy。
SSOT: .work/series-plans/ai-security.md + 本目錄manifest.json（orders0–23）。
共用案例：Alice/Bob north，Carol south；N-1 Alice、N-2 Bob、S-1 Carol；owner-only教材政策。標準庫HTTP目標ticket-lab.py，真實HTTP執行與固定action replay/模擬AI明分，不假稱模型自主能力。
三worker各持有攻擊4–9／防護10–16／調查17–22各自文章與配套；主agent持有共用HTTP服務/整合23/導覽與狀態。完成後輪換交叉審稿，作者不得把自審說成獨立審。
完成條件：48檔中英、24篇範圍與依賴一致、逐篇三層審稿且必修結案、實作真跑與限制如實、圖必要時完整preview、所有內鏈/下載/案例一致、全站pnpm verify。批次完成不等於已上線。
公開研究Groundlane-first：完整inventory本輪未掛載，ExaMCP fallback；僅公開資料，禁止私有/秘密與退役抓取工具。

完成狀態：48檔／24三節review／3交叉審與所有必修結案；delivery audit已通過，最後全站閘門與外鏈例外見acceptance.md。

2026-10-22後續：使用者已授權commit/push，並確認先補真模型實測。原「完成」只指48稿及固定案例，模型層缺口見 ../model-eval/plan.md；補測、回填、獨立審核、隔離verify後再提交推送。
