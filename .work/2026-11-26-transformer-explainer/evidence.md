# Transformer Explainer — 查證紀錄（2026-11-26）

- 官網 https://poloclub.github.io/transformer-explainer/ ：Groundlane web_fetch 全文（文章說明區），GPT-2 small 124M、50,257 詞彙、768 維、12 block/12 head、MLP 768→3072、temperature/top-k/top-p、nanoGPT→ONNX、Svelte+D3、作者名單。
- GitHub README：MIT、CHI 2026、本機執行 Node 20+/npm 10+、npm install && npm run dev、localhost:5173、示範影片 TFUc41G2ikY。
- arXiv 2408.04619 v2（2026-08-10）摘要＋HTML 全文關鍵段落：VIS 2024 Best Poster、490,000+ users、ONNX Runtime Web + IndexedDB 快取、Generate 會把 token 接回輸入、90 人 between-subject（工具／Illustrated GPT-2 部落格／教學影片，45 分鐘），正確率 73.3/59.5/61.9%；自評 3.59 vs 3.02（Blog 顯著）vs 3.54（Video 不顯著）；體驗 3.61 vs 2.94/3.17；§10.3 三項研究限制；§10.1–10.2 未來方向（ViT/Whisper、更大模型）。圖 1 說明：create 20.87%。
- 原始碼（commit bfe50af, 2026-06-06）：Temperature.svelte 可選 0.2…1.0, 2.0…10.0，預設 0.8；store sampling 預設 top-k=5；top-k 範圍 1–50、top-p 0.1–1。
- 未逐一核對：教學影片組使用的是哪支影片（論文正文未在抓取段落列出），文章只寫「一支教學影片」。
