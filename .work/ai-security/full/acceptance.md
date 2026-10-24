# AI 資安實戰：全系列交付驗收

日期：2026-10-22。使用者「直接完成全系列」授權完成剩餘篇目與必要配套；不再依兩篇批次停等。

## 交付範圍

- 24篇、order0–23，中英48個Markdown檔，皆draft true。路線為共用基礎0–3、攻擊4–9、防護10–16、調查修補17–22、整合23。
- 入口：`src/content/posts/ai/2026-10-22-ai-security-overview.md`。總覽24篇連結與中英對應已補齊；canonical路徑見manifest.json。
- 配套：`public/examples/ai-security/`，16個Python/JSON教學檔（原14＋模型harness與結果）。HTTP服務、固定動作runner、授權／證據／環境／防護／調查與整合演練；下載可取得必要同伴檔。
- 每篇三節review在`.work/reviews/2026-10-22-ai-security-*.md`；跨作者review在本目錄`cross-reviews/`。來源索引research-index.md。

## 實際執行與限制

- 共用HTTP服務：兩版18個HTTP案例；整合最終`integrated-run-03`：兩版10請求與對應audit，正常控制各3筆，有洞版2筆越權讀取、修補版0筆。報告附Python/platform與server/runner SHA256。
- 攻擊線既有12個mode/build run共49真HTTP請求，另4個非網路guard。固定動作／人工候選，沒有呼叫LLM或測量模型能力；外部訓練平台與公開事件僅來源研讀。
- 防護58函式checks；兩版18真HTTP和18audit；macOS sandbox-exec 7限制probe與4baseline。Docker不可用，沒有容器驗證。
- 調查線四版12格授權矩陣結果6/10/12/9；18真HTTP與audit；時間線、8案分流、成本重算與6次處置模擬。教學真值與合成資料不是生產統計。
- 基礎授權9例、漏洞證據14例、環境preflight16正反例。環境檢查只驗紀錄，不能自行證明授權或環境安全。
- 沒有雲端部署、第三方測試、MCP/OAuth實接或整體產品安全認證。後續模型小樣本與原固定實驗分開，見下節。文章明列環境遷移與讀者可擴充步驟。

## 真模型補測（使用者指出缺口後）

Codex CLI指定gpt-6.1-sol，三次獨立重複、33calls；3/3假設覆蓋，6/6loop結論對應15工單POST＋6health＋15audit，3份AST門控純函式修補共39/39格。input695751（cached86528為子集）、output2232；模型呼叫wall合計240.713秒／median7.328秒，無精確snapshot、溫度控制、人類baseline或實付帳單。
六個注入/乾淨回答皆finish N-1，hostile偏離0/3、clean0/3；原guard要求finish ID=null但提示未要求，保留原六錯誤與執行source快照，依原契約重評，沒有換prompt重試。被skip的backend effects未執行，不算防線阻擋。只有小型合成產品與明示untrusted提示，無排名／普遍安全推論。
原始prompts/CLIstdout/metadata/audit、preflight與final-review、獨立純資料複核程式見`.work/ai-security/model-eval/`；公開下載為model-eval.py及model-eval-results.json，後者是結構化答案/回應/usage，並非全部raw提示。7篇雙語回填（0/5/7/8/18/22/23），舊固定案例數字與限制保留。

## 審稿與修正

三線輪換獨立審閱，回查一手全文與現存輸出。已修：跨租戶角色一致、expected oracle獨立宣告、掃描證據標示、良性告警真值定義、URL/工具輸入型別與empty-userinfo、judge實際assert。最後攻擊runner例外保存與來源registry修正另見attack交叉審報告。
總覽圖先前完成中英／深淺色／375寬共6張preview；其他篇以表格與可執行證據解釋，未宣稱未製作的互動圖已驗收。

## 品質閘門

- 模型補測回填後，全48檔references exit0，14個覆蓋／數量advisory（含新增實測節）；已由逐篇主張來源與獨立全文審閱人工確認，沒有修改檢查器。
- 全48檔TW及process-leak exit0。
- 全系列delivery audit exit0：48檔frontmatter／中英tags／所有內鏈與下載／24三節review／3原交叉審＋模型增補獨立審／public無pycache，並保存交付檔hash。最終`pnpm verify` exit0，全部品質閘門綠；見`delivery-audit.json`與`verify-final.log`。
- 初輪全站verify僅progress.txt超90行失敗；已依協定保留內容歸檔一筆過期無產出記錄，非削弱檢查。
- 外部連結檢查exit1：36URLs中3個PortSwigger HEAD404；同UA的GET均200 text/html，詳`external-links.log`與`link-head-get-metadata.json`。原HEAD誤報已登Q-044；保留檢查失敗與人工確認的區別，未改檢查器。

## 發佈狀態

使用者已授權commit/push；目前在最新origin/main隔離worktree準備只提交本系列，原共享index與其他dirty不動。保持draft true；未執行production deploy或線上讀回。提交／遠端狀態見publication紀錄。
