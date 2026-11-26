> 本次補測更新（2026-10-22）：下列舊審稿描述屬固定案例版本；本輪新增真模型小樣本的查核記錄插入三節開頭。原獨立交叉審不自動涵蓋新增段落，新段落待主agent最終交叉覆核。

# 作者自審：ai-security-patch-verification
日期：2026-10-22。範圍：order 18 中英兩檔。此為作者依三支skill執行的自審，不冒稱獨立交叉審。獨立審查另由attack agent負責。

## post-verify

### 真模型補測查核

已直接讀公開結果 `public/examples/ai-security/model-eval-results.json` 與執行程式。三個生成patch相同，獨立12矩陣+None每次13，共39/39；AST檢查與非通用sandbox、未部署/未掃描明示。人工四候選6/10/12/9原數字保留。 另以純JSON斷言獨立重算各分母與用量通過，不執行模型或HTTP。所有新claim限作者自製實測；官方CLI文件由root完整Exa讀取，讀取範圍見model-eval/docs-note.md，只支持命令/JSONL用途，非模型能力。三次、無精確snapshot/temperature、CLIscaffold、無實付金額與不排名均有中英揭露。

結論：限定主張通過。外部主張與完整讀取/抽取記錄見 `.work/ai-security/full/analyst/research-note.md` 與sources.jsonl，5份一手來源；不引用論文分數/模型成效。自製資料與外部研究分開。
實測：`python3 public/examples/ai-security/analyst-demo.py selftest` 通過；12格矩陣四版6/10/12/9；5合成時間事件；8分流評分；6次記憶體處置嘗試。`analyst-http-capture.py --out NEWDIR` 18真HTTP讀取，原始trace/audit見full/analyst/http-run-1；沒有模型呼叫。獨立truth不由被測函式計算；case ID採中性C01–C08。
未測：商用scanner/真正LLM/雲端產品/併發撤權/真帳號停權；處置rollback只有計畫。正文均未冒稱完成。

## post-review

### 真模型補測結構審查

完整回讀中英10稿，反向大綱為既有概念→固定案例→新模型觀測→重跑方式→限制→練習/參考；已修18/22及8開頭的無模型全稱句，明指analyst-demo.py或attack-runner.py。各篇提供同目錄兩下載、Python3.11/已登入CLI、全新out與repetitions3完整命令；重跑修正版不是原輸出逐位元重現。日期、slug、series、draft不變；無新增圖需渲染。scope三項文字掃描references/process-leak/TW全部exit0；不冒稱本agent已跑全站verify，主agent統一驗收。

結論：讀者問題→具體例子→命令→預期→反例→自測答案均可定位；有完整中英、日期、draft true、type guide、series order、內文與文末來源。中文版約1400–1600漢字，具實際教學密度；英文逐節對齊數據、限定與命令。
教學三層：讀者可執行單一連續程式；每個結果有獨立政策/真值；自行檢查及答案對齊目標。時間線另驗真HTTP與合成缺口分開，分流明文保留abstain，權限模擬與正式平台界線明確。
圖解選擇已讀diagram skill：三欄對照與eventID時間表可完整表達，無需SVG；不宣稱圖像渲染測過。
機械檢查：本組process-leak通過；polish及ledger掃描完成，數字命中主要為案例ID/預期矩陣，屬必要證據。全站pnpm verify/astro由主agent最後整合執行，本報告不搶先稱全站通過。

## post-polish

### 真模型補測語氣回讀

中文register及ledger掃描均exit0，原始輸出 `/tmp/model-results-article-scans.log`；新增小節以問題/觀察/如何重跑推進，數據集中表格或單一結果段。逐句回讀新段與原結論，保留必要限制並分段，未把評測程序塞進標題/tldr。中英的模型ID、分母、未執行後端、修正版契約與未部署範圍一致。

結論：已通讀中英文，開頭以實際工單情境與讀者任務為主；正文用台灣工程團隊語境，避免研究盤點進門面。命令、JSON及證據ID保留精確名稱。
執行register-scan.sh與scan-ledger.sh，原始輸出full/analyst/polish-scan.txt。模板對比句兩處改為正面行動；數字表與欄位映射保留便於重算/回查。不把無模型實測膨脹成模型成果。

獨立審查修正：將「本次證據」改「所需證據」，明示只有函式矩陣實跑；商用掃描與部署定位為產品驗收要求。中英同步。
