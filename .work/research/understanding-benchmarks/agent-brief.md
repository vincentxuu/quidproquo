# 精讀 agent 共用規格（認識 benchmark 系列）

你負責精讀一批來源，交出抽取紀錄。你不寫文章、不改 repo 其他檔案、不 commit。

## 讀法

- 每個來源從頭依序讀到尾：方法、結果表、限制、正文引用到的附錄。不准用關鍵字跳讀代替全文。
- 論文優先讀 arXiv HTML（`https://arxiv.org/html/<id>`）或 PDF 全文；`/abs/` 頁只算摘要。
- 抓取工具與 fallback 順序（一個失敗就換下一個，不准停在第一個）：
  1. Exa `web_fetch_exa`（先用 ToolSearch `select:mcp__claude_ai_Exa__web_fetch_exa,mcp__claude_ai_Exa__web_search_exa` 載入；`maxCharacters` 設大，例如 200000，長文分段讀時記下起訖）
  2. jina `read_url`（ToolSearch `select:mcp__jina__read_url,mcp__jina__search_web`；主要來源不要帶 `question`，那只回片段）
  3. 內建 `WebFetch`（ToolSearch `select:WebFetch`）
  4. Bash `curl -sL`（存到 scratchpad 再讀；PDF 可用 `pdftotext` 若可用）
- 讀不到時換管道：作者個人網站、研究室頁、arXiv HTML／PDF、會議 proceedings、GitHub repo 的 README／paper 連結、第三方鏡像。全部試過仍讀不到，寫清楚每個工具＋網址＋失敗原因。
- 結果被截斷（`truncated`、設了字元上限只讀到前段）就繼續分段讀，讀到全文為止；做不到就把該來源標 `partial` 並寫讀了多少。

## 結案標準

每個來源只能有三種結局：
- ✅ 讀完全文，附抽取紀錄
- ⚪ 確認讀不到全文：列出所有試過的工具＋網址＋失敗原因（此時只能交摘要層級內容，標 🟡）
- ✉️ 只在登入區或付費區：寫出該問誰、問什麼

「標 🟡 後交差」不算完成；還有管道沒試就繼續試。

## 每個來源的抽取紀錄格式

```
### <標題>（<年份>）
- 網址：
- 讀取狀態：✅ / 🟡 / ⚪ / ✉️
- 讀取紀錄：原文總長度約 N 字元（或頁數）；依序讀過的段落起訖（例如 0–60000、60000–120000），加總要涵蓋全文
- 類型：研究論文 / 官方文件 / 部落格 / 排行榜頁
- 研究設計或文件目的：（量什麼、怎麼建、對象、比較對象）
- 會被引用的結果：每條寫「數字＋對照條件＋所在的節／表＋原文一句（英文原句）」
- 作者自己列的限制：
- 與摘要說法不一致處：（不能留空；沒有就寫「逐項對過，沒有」）
- 反證或後續修正：（有沒有後續論文、勘誤、官方回應推翻或修正它；有就附網址）
- 對系列的用途：這份來源能支撐哪一篇的哪個主張（一句）
```

## 補搜

每批除了指定來源，另做：
1. 限定 2024 年以後補搜一輪，看指定來源的結論有沒有被更新或推翻。
2. 加 criticism / limitations / replication / flaws 搜一輪反證。
找到值得精讀的就照同格式讀完補進來（每批最多補 2 篇），並在檔尾列「補搜紀錄」：用了哪些查詢、找到什麼、為什麼收或不收。

## 輸出

寫到指定的檔案（`.work/research/understanding-benchmarks/extracts/<批次>.md`，用絕對路徑 `/Users/vincent/Work/study/quidproquo/.work/research/understanding-benchmarks/extracts/<批次>.md`）。最後回覆只要：檔案路徑、每個來源的讀取狀態一行、三到五條最重要的發現。不要把抽取紀錄貼在回覆裡。

語言：抽取紀錄用繁體中文，原文句保留英文。
