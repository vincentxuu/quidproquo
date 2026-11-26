# 調查修補線寫前範圍卡
使用者已要求直接完成全部。owned orders17–22；作者自審不冒稱獨立審稿。
讀者：會讀Python及API，尚未做過SOC工作；繁中客服工具的開發者。
連續例子：Alice/Bob north、Carol south；owner-only；同一F-17越權修補、事件與分流。
17 問：AI報告該查哪個路徑？目標：分開程式假說與執行證據。順序：輸入/邊界→三版讀取→固定矩陣→finding。
18 問：修補告警消失夠嗎？目標：用正常/同租戶越權/跨租戶/不存在ID驗收。順序：失敗patch→獨立判準→回歸→遷移。
19 問：事件有沒有外洩？目標：保留原timestamp/eventID/source及缺口。順序：查詢→時區→觀察/推論→產品映射。
20 問：可否關單？目標：把false positive/blocked attempt/unknown分開。順序：三案例→規則分流→反例→升級。
21 問：助手應有哪些處置權？目標：分開讀取、提案、審批、操作；演示重放/版本不符。順序：能力表→本機模擬executor→事後檢查→真平台遷移。
22 問：如何量化幫助？目標：固定真值、保留未判定、重算成本。順序：baseline→workflow replay→混淆矩陣→成本與正式試驗設計。
來源：GitHub Autofix, OWASP Logging, Microsoft SecurityCopilot FAQ, SIABench 2026 full, Microsoft SOC observation 2024 (previous full extraction)。不引paper分數，不作產品效果比較。
圖解選擇：三欄對照與帶eventID時間表比另製SVG更利於回查，採表格。
產物：單一analyst-demo.py與固定fixtures，無外部dependency，模型建議為明示示意，不實際呼叫模型。
