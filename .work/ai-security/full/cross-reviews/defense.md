# 防護線獨立交叉審查（orders10–16，中英14檔）
審查者：analyst_series，未參與本組作者寫作；2026-10-22。
最終狀態：兩項必修均已修正並獨立複核；限定交付通過，無剩餘必修。

## 完整讀取範圍
逐篇通讀 injection-defenses / rag-permissions / tool-authorization / mcp-trust / output-handling / sandbox-credentials / security-regression 中英14檔全文，不以標題清單代替。另完整讀defense-demo.py、defense-http-regression.py、defense-sandbox-probe.py。
關鍵來源回查：作者raw/extra-3.txt（MCP authorization security）、extra-4.txt（MCP2026transports）、source-3.txt（OWASP MCP）、source-4.txt（Foundry redteam）、extra-5.txt（OWASP RAG）。完整正文讀取，其中合併輸出截斷的OWASP MCP/RAG另單頁完整重讀，未拿截斷內容宣稱全文。其餘XSS/command一般技術主張不引新數字，作者另有正文抽取。
研究工具本輪為只讀本地已抓取公開來源；不額外抓私頁。完整inventory先前已核無Groundlane，作者公開抓取Exa路徑已註明；無退休fetcher。

## 分篇結論
10：固定錯誤proposal重播清楚區分模型被帶偏與執行結果，沒呼叫模型、沒真的寄出；untrusted標記無法改未檢查的executor的反例成立，未誇稱提示無用。
11：Alice/Bob同tenant不同owner正確；chunk ACL、cache dependency、epoch及撤權時序一致。沒有以引用清單代替全部生成來源，明示stream已送無法收回與競態，無聲稱瞬間撤權。真retrieval/embedding未實作明說。
12：完整動作hash與trusted approval來源區別清楚，wrong_user/changed approvedargs可獨立測到批准綁定。in-memory replay非distributed exactly-once限制存在。發現不可信JSON malformed可崩→作者已補guard與案例。
13：manifest hash偵測metadata而非remotebehavior，annotations hints非enforcement；audience政策模擬不是驗JWT。回查2026-07-28官方transports原文確為per-requestmetadata+legacy initialize/session compatibility，沒有把舊規格泛化到新版。
14：HTML文字、URL、schema、程式操作consumer各自處理；textContent不預編碼，shell=False不代表操作安全；無瀏覽器/Shell實跑明示。空userinfo漏洞與型別問題作者已修；一般SSRF不在此函式能力內正文已說。
15：真macOS sandbox-exec跑指定檔案/網路probe，allow-default selective profile限制明確。狹窄env只是衛生、capability函式不是OS sandbox與token issuance，均有區分。不將Docker未跑或7probe通過說全面隔離。
16：獨立oracle九格+兩版HTTP18實測，正常功能/安全拒絕均驗。audit關聯僅status/build與服務自己log非獨立外部證人之限制有寫；judge/refusal/actualsideeffect分開。最後judge fixture已補expected tuple assert，pass以實際分歧計算。

## 必修與修後複核
1. 不可信destination數字/array/object讓safe_destination出AttributeError/TypeError，execute非dict call也崩；userinfo空字串https://@reports.example.invalid/north/inbox被接受，與正文拒絕userinfo不符。已通知作者和主agent。作者補string/dict/type guards、approval shape/type與empty-userinfo拒絕；tool從11增17、output9增15、總regression46增58，中英數字已同步。複核以下附加反例全部拒絕，58測過。
2. judge-disagreement顯示passTrue但未assert兩個結果。已通知作者補明確expected tuple，作者已修assert (True,False)，pass由兩結果不相等計算；獨立重跑58checks再次通過。

## 實際執行
全程PYTHONDONTWRITEBYTECODE=1，未新增public pycache；沒有更動作者canonical。
- python3 public/examples/ai-security/defense-demo.py regression：初46，作者修後58 checks過。
- python3 public/examples/ai-security/defense-http-regression.py：18真HTTP requests、vulnerable3/9、fixed9/9、18audit events passed。
- python3 public/examples/ai-security/defense-sandbox-probe.py：Darwin，7restricted+4baseline passed；外讀/寫/網路受限取得PermissionError，baseline確實原本可做。
- 額外runpy唯讀探測：safe_destination(None/17/[]/{}/True)全False；emptyuserinfoFalse；execute(None/17/[]/listkeys)全invalid_shape；無效approval None/False/{}/[]/list/17均approval_mismatch。
- 沒跑Docker、外部雲端、LLM、實際MCP/OAuth、瀏覽器XSS、全面主機隔離；不宣稱這些驗收完成。

## 非必修觀察
英文每篇導讀末尾generic Next lesson後有中文句點，可在最後polish順手統一，但不影響語義或教學驗收。每篇以具體問題/前置/命令/預期/反例/自測結構交付，沒有只剩原則清單。
