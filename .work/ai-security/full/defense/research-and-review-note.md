# 防護線 orders 10–16

2026-10-22。作者使用 post / post-verify / post-review / post-polish / deep-research / diagram；依既有獲確認的系列範圍卡寫作。使用者「直接完成全系列」覆蓋每批停等；本線不 commit、push、deploy。僅修改指定14文章、defense-*配套與本證據目錄。

## 讀者問題與範圍

| order | 讀者問什麼／讀完能做什麼 | 主脊與產物 |
|---|---|---|
|10|模型提錯動作時，系統哪裡擋住後果？|同一提案重播／6函式對照|
|11|資料何時排除，撤權後快取會不會再洩漏？|檢索→衍生資料→回傳／8案例|
|12|一次批准如何綁人、動作、參數？|正常匯出→逐欄修改→重播／17案例|
|13|MCP來源、metadata與行為各證明什麼？|四種信任性質／6反例|
|14|模型輸出由誰解讀，哪裡取得執行能力？|按consumer分解／15輸出案例|
|15|程式失守後還能讀寫連什麼？|OS檔案/網路、環境、API能力分開／7+4 OS與5policy案例|
|16|拒答與真正擋住影響如何分開驗？|獨立oracle矩陣→HTTP→audit→監控／18HTTP+58函式|

先備皆連回0–3的身分/證據，後續按manifest順序。圖型選擇：已讀diagram skill；七篇的重點是控制層/可信來源/允許拒絕對照，三至五欄表格足夠；不硬加SVG，無diagram preview聲稱。

## 工具路徑

完整ALL_TOOLS name/description inventory無Groundlane callable；使用Exa MCP公開網頁fallback。初次fetch default僅約3000字，試錯參數max_characters仍被忽略，不當全文；已用正確maxCharacters:65000重新取得完整正文。中途web.run續讀OWASP/現行MCP，後已全部以Exa完整正文重取；不把任何fallback當Groundlane證據。未傳私有檔案、token或秘密到研究工具。

## 來源工作集與順讀覆蓋

read代表完整Exa正文輸出，不保證原站所有附加資產。無引用論文效果數字；不把官方指引當獨立效果實證。

- 工作集A：raw/source-0.txt 21163字元 MSRC 2025防護完整；source-1.txt 17942 多租戶RAG完整；source-3.txt 14132 OWASP MCP完整；source-4.txt 6882 Foundry紅隊完整。source-2.txt 29509舊版MCP只讀前360行，未用它支撐本線外部主張。
- 工作集B：extra-0.txt 11831 OWASP命令注入全文；extra-1.txt 28516 XSS全文，依1–120、121–260、261–末行順讀；extra-2.txt 9153授權回歸全文；extra-3.txt 7792 MCP2026-07-28授權安全全文；extra-4.txt 3484 MCP2026-07-28傳輸全文。
- 工作集C：extra-5.txt 28445 OWASP RAG全文，依1–180、181–360、361–末行順讀。

## 主張映射與反證

| 主張 | 正文支持 | 反例／限定 |
|---|---|---|
|注入被帶偏與安全影響不同|MSRC What are potential security impacts / Preventing impact|不以拒答判副作用；本地不測模型機率|
|每次retrieval前授權|Microsoft RAG data filtering / multitenant stores|tenant隔離不等於同租戶owner隔離|
|快取需權限隔離與失效|OWASP RAG sections4,11,12|自己的舊cache仍可能過期授權；epoch只是教學設計|
|特定動作批准需執行時授權|OWASP MCP §4、§12|批准不豁免撤權、過期、其他參數；單行程set不證並發安全|
|manifest hash不是行為證明|OWASP MCP §2|完整定義可不變而函式效果改變；test只驗metadata差異|
|MCP token audience/不透傳|2026-07-28 authorization Security Considerations|audience對不等於object policy對；dict不是驗簽|
|新版傳輸不同於舊session|2026-07-28 transports Backward Compatibility|文章明寫revision，不混寫舊版規則|
|輸出consumer不同需不同控制|OWASP XSS Output Encoding / Safe Sinks；OS Command primary defenses|HTML轉義不是URL政策；shell=False不是參數授權|
|stdio/chroot不等於完整沙盒|OWASP MCP §3|macOS profile allow default只針對性拒絕，非全主機隔離|
|自動judge會有誤判|Foundry known limitations|產品文件非獨立比較；不引用產品支援矩陣或數字|
|獨立policy矩陣回歸|OWASP Authorization Regression test matrix/patterns|矩陣不能import被測policy，HTTP與model評估分開|

## 五關（針對實際主張，不宣稱整個AI防禦研究飽和）

1. 本文所有外部控制主張對到上述已讀一手正文；舊source2未讀完不用於本線。
2. 分清官方規範/建議、自製函式fixture、真HTTP與真OS探測；沒有普遍防禦成效、工具排名或模型ASR主張。
3. MSRC明確2025；MCP鎖2026-07-28；持續更新OWASP2026-10-22完整擷取，日期未知不編發表年。
4. 反證含hash看不見行為、own-data exfiltration、stale-cache、judge拒答但effect、allow-default不全隔離、shell=False與argument semantics；來源限制與實測均在正文。
5. 既有search0–8含中文/近義/limitations，補Exa「RAG authorization revocation cache prompt injection defense limitations 2026」得到新RAG cheat sheet，已完整補讀。公開學術領域飽和未主張；本輪限定工程性質由來源+逐案例驗證閉合，不外推未讀論文與新候選效果。

## 真實執行與未測範圍

- defense-demo.py regression：58 deterministic checks；沒有LLM、無網路。正反例含刻意unsafe函式與相同行為描述下的實作替換。
- defense-http-regression.py：18真HTTP、18audit事件；獨立靜態oracle，vulnerable3/9、fixed9/9；只啟動自己的127.0.0.1子服務，finally終止。
- defense-sandbox-probe.py：macOS sandbox-exec真執行7受限+4baseline反例，OS PermissionError才算network block。明示針對性profile非完整sandbox；保護檔內容最後仍original。
- Docker daemon不可用，沒啟動／沒宣稱容器驗收。未雲端部署、未第三方測試、未真OAuth、未瀏覽器XSS實測、未核心逃逸測試。

## 交叉審修正

analyst指出非string目的地會crash與空userinfo通過；已修型別閘門與is None檢查。tool新增6 malformed為17，output新增6為15，全regression58再跑通過。中英12/14/16與自審同步。
