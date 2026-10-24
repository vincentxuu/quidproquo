# 分類共用研究池

研究不再只留在某次對話或一份筆記。可重用的公開來源、每次讀取與採用狀態、搜尋範圍分開保存，下一次先查已有資料，再補搜缺口並寫回。

## 先按主題分類，再標來源類型

分類表是 `.research/pool/taxonomy.json`。第一層沿用網站內容類別，第二層表示研究主題；頻道、影片、網站、論文只是來源類型，不能取代主題分類。

| 類別 | 主題例子 | 可共用的資料 |
| --- | --- | --- |
| 攀岩 climbing | 岩場與路線 crags、裝備 gear、技巧與安全 technique、訓練與傷害 training | 路線介紹、頻道、指南書、管理公告、技術來源 |
| AI ai | 模型 models、代理 agents、RAG rag、評測 evaluation、安全 security | 論文、官方文件、模型卡、程式庫、資料集、評測 |
| 技術 tech | 框架 frameworks、雲端 cloud、資料系統 data、開發工具 devtools | 文件、repo、實作紀錄、工具 |
| 學習 learning | 課程 courses、語言 languages、學習方法 methods | 課程網站、講義、影音、研究論文 |
| 教育 education | 課程設計 curriculum、教學 teaching、教育研究 research | 教案、研究、制度與課程資料 |
| 產品 product／設計 design | 產品研究、需求、案例／UX、UI、可及性 | 官方產品資料、訪談、案例、規範 |
| 其他既有類別 | 職涯、政策、行銷、衝浪、電影、生活、咖啡、旅行、動畫 | 用同一流程，出現實際資料才建分類目錄 |

地點、語言、級距、版本等放 `tags` 或來源metadata。例如「攀岩→岩場與路線→tags: joyama,japan」，不為每個頻道、每次搜尋建立一套頂層分類。來源可以標多個 `categories`、`topics`，由穩定source ID連回不同研究；跨分類重用不能複製一份再把舊查核日期當新查核。

## 三層資料

```
.research/pool/
  taxonomy.json
  climbing/
    sources.jsonl       # 來源身份與分類
    observations.jsonl  # 每次閱讀、查核、採用／淘汰與文章用途
    searches.jsonl      # 查詢、工具、結果範圍與缺口
  runs/
    <research-id>.json  # 母群、覆蓋、研究筆記與未辨識候選
```

`sources`記來源是誰：canonical URL、類型、標題、分類、別名與metadata。影片以video ID歸一；頻道未確認handle或channel ID時不能只靠同名硬合併。可用URL未確認的頻道名稱留在run的`unresolved_entities`，不猜網址。

`observations`記**這一次**研究讀到什麼：研究ID、日期、工具、`read_status`、讀取範圍、選用或淘汰理由、`used_in`文章路徑、證據檔路徑。另一個研究只看摘要，不會把以前全文讀取的紀錄改掉；以前讀過全文，也不能讓這次未讀的來源自動變成已讀。

`searches`保留查詢與結果source IDs。零結果、抓取失敗、錯岩區或同名電影雜訊也留下範圍與缺口。未命中只能表示那次搜尋範圍沒找到，不能表示全網沒有。

這一層儲存可查找的來源與觀察，不把工具摘要直接升格成事實庫。既有 `.research/index/crag-facts.jsonl`仍負責岩場主張；D1 evidence store仍負責runtime證據。本次不改這兩套資料或其schema。

## 每次研究的固定循環

1. 定類別、主題與研究ID，先查pool；閱讀舊紀錄的範圍、日期、衝突與未採用原因。
2. 用pool作入口，再對原文路線／作者／主題公開補搜；不得把pool當來源白名單。
3. 研究筆記與本次`sources.jsonl`照原流程保存；新搜尋／讀取結果先小批匯入，不能只在發文時才留下最後採用的來源。
4. 要引用時回原始來源核對；價格、規定、版本、交通與現況等可變資訊重新查。索引命中不算當次查證。
5. 回寫採用、未採用、衝突、讀取範圍與文章用途，保留run ID。文章完成後再匯入使用狀態；不要只存成功案例。

專案 `AGENTS.md`要求所有有重用價值的公開研究與搜尋遵循此循環，`deep-research`與`post`另提供操作入口；其他工作流（含post-update與單次公開搜尋）使用相同CLI與資料格式。這是agent執行規約，不是對所有工具呼叫的自動攔截器，也沒有自動抓網頁或排程追蹤頻道。

## 使用指令

```bash
# 依類別與主題找來源
node scripts/research-pool.mjs search --category climbing --topic crags --query 'スタートレック'

# 同一主題可以找不同來源類型
node scripts/research-pool.mjs search --category climbing --topic crags --type channel
node scripts/research-pool.mjs search --category climbing --topic crags --type book

# 換研究主題也用同一個池；沒有資料時不會假裝有來源
node scripts/research-pool.mjs search --category ai --topic agents --type paper

# 每次研究的sources清單先dry-run，再明確寫入
node scripts/research-pool.mjs ingest --input .research/example.sources.jsonl --category ai --topic agents --research example
node scripts/research-pool.mjs ingest --input .research/example.sources.jsonl --category ai --topic agents --research example --write

# 搜尋紀錄也寫回同一分類；輸入是明確的queries.jsonl
node scripts/research-pool.mjs record-search --input .research/example.queries.jsonl --category ai --topic agents --research example
node scripts/research-pool.mjs record-search --input .research/example.queries.jsonl --category ai --topic agents --research example --write

# 查資料完整性，不會連網或重新查證來源
node scripts/research-pool.mjs check
```

`search --json`供agent或腳本使用。查詢只搜尋保存的標題、分類、標籤與metadata；沒有命中就補搜，不把零結果寫成該領域沒有來源。一次只匯入明確指定的來源清單，不掃整個`.work`。不同agent可讀同一池，寫入以排他鎖保護；遇到其他writer就等待其完成後重試，不自行移除別人的鎖。預設資料根目錄是腳本所在repo，其他repo可呼叫同一腳本；`--root`用於明確指定另一個已建立的pool，不會自動分散寫入各次cwd。

與既有deep-research來源登錄相容的輸入例子：

```json
{"url":"https://example.org/paper","title":"研究標題","source_type":"paper","read_status":"partial","coverage":"只讀摘要與方法段","tool":"actual-reader","reason":"待補結果與限制","decision":"candidate","tags":["agents"],"used_in":[],"evidence_refs":[".research/example.md"]}
```

這是格式範例，不是種入pool的真實來源。`read`必須有實際閱讀範圍依據，不能把HTTP200、未截斷、全文已下載或metadata查核直接當成完整閱讀。影片的metadata／作者描述與影音回聽／畫面核對分開記。

搜尋紀錄範例：

```json
{"query":"實際送出的查詢","tool":"actual-search-tool","scope":"前10筆結果","result_source_ids":[],"gap":"本次範圍未找到符合來源，仍待補搜"}
```

有找到來源時，先匯入來源取得source ID，再記搜尋結果；`result_urls`也只能對應已存在的source。這個指令不會把未知結果URL偷偷新增成已核對來源。寫入先驗證整份輸入，檔案逐一原子替換；排他鎖防止同一CLI同時覆寫，不等於跨檔資料庫交易。中途系統故障後先跑`check`確認完整性。

## 城山作為第一批資料

第一輪保存154支影片候選、9個已觀察到handle的頻道，以及作者頁與指南書入口。後續驗收run將61組頻道名稱全部對到不同UC channel ID：新增52個UC來源，9個既有handle來源保留ID並補別名；另加8支分區候選及6筆可復原的站內查詢。11支影片留下離散抽幀的partial觀察，未連續全片觀看或回聽；原Stone Free影片因上段出框而標rejected，替代片另記selected，歷史選用紀錄保留。詳 [城山驗收證據](research/2026-10-24-joyama-video-acceptance.md)。creator關聯依已保存作者名稱匹配，並非逐片重新核對UC身份。兩筆Exa原query缺失，只保留run evidence，不虛構正式search紀錄。

頻道有兩種用法：先用路線找到不同作者；再沿作者的同岩場系列、播放清單、描述內索引擴找。不能只掃熟悉頻道，也不按觀看數或訂閱數門檻淘汰小頻道。岩場舊影片可作風格參考，不能代替現況、topo、裝備或下降資料。

## 維護界線

共用metadata、分類與短觀察可入版控；不複製整篇第三方全文、帳號側欄、私有內容或認證資料。原始材料保留在有權使用的研究證據檔，pool只記指向。不要自動把所有舊`.research`、raw檔或既有✅標記批次升級匯入；後續依題目小批整理，保留讀取限制與原始路徑。
