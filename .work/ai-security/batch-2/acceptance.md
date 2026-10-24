# AI資安第2批交稿驗收
2026-10-22。新稿order2/3中英4檔，前文order0/1中英4檔僅回填導覽與更新紀錄；累計4篇8檔draft true。

## 實作與教學
- 第2篇14個證據案例，含有洞/修補、正常/拒絕、假敘述、錯資料、錯目標與錯build。unknown build顯式ValueError；expected context在觀察前獨立固定。evidence-final-output.txt為最終執行輸出。
- 第3篇環境JSON與離線preflight：16正反案例、獨立額外30錯型enum/section探測；明說不驗授權真偽、隔離、配額合理性或可重現真實性。禁止自動化+自動模式的CLI負例精確FAIL、exit1，見environments-cli-negative.txt。
- Alice/Bob north、Carol south及各工單owner逐檔核對，原manifest錯配已修。public bytecode已清除且驗證不再生成。
- 範例均無模型/HTTP/平台/雲端/第三方實測；沒有部署。CTF判準不冒充產品租戶隔離。
- 本批表格足以說清對照與環境選擇，無新diagram。前兩篇原diagram未變，沿用batch-1圖預覽；未假稱正式頁面瀏覽器驗收。

## 研究與審稿
- 官方來源全文及讀取程度見research/research-note.md、evidence-evidence.md、environments-evidence.md。指引、維護者反例與自製設計分開，不引未讀論文數字。
- 作者三層自審與獨立review見reviews/independent-review.md；兩項必修（版本同源自證、身分錯配）已修復並獨立複核，無未解必修。
- 正式兩篇三層紀錄在.work/reviews；前兩篇記錄本輪只改導覽與更新紀錄，沒有冒充全篇重新查證。

## 品質閘門
- delivery-check.log核對8篇metadata/0–3篇序、中英互鏈、內部目標與下載、14案例輸出、preflight正負提示、canonical fixture、審稿及無public bytecode。
- tw.log：新兩篇中文0 blocking、0 to review；process-leak.log四新稿無blocking。
- external-links.log原命令exit1：18個唯一外部連結，17通過，PortSwigger實驗頁HEAD 404。追加同UA實測GET 200，並Exa完整讀正文；見link-head-get-check.json及research/lab-live-fetch.json。原檢查器未修改，保留誤報而非冒稱全綠。治理佇列Q-044留待另案處理。
- 全站pnpm verify以verify.log最終輸出為準；未全綠不視為完成機械驗收。

## 發布狀態
未commit、push、deploy；保留其他session工作。依既定每批2篇流程，交閱order2/3後再寫攻擊線order4/5。
