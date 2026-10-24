# 分類研究每週候選報告

先以城山（`climbing → crags → joyama`）試跑。來源池仍依主題分類；影片、頻道、作者網站、指南與公告是不同來源類型。本流程只發現候選，不會自動修改文章或把搜尋摘要當成已讀來源。

## 執行邊界

- 每週日台北時間09:00，由既有Claude Code雲端排程執行；平台可能延後數分鐘啟動。開啟後須以任務頁的next run與實際run驗收，不以本文件代替。
- 每輪：61個既有頻道中輪查8個（名單穩定時，8週內掃過一輪）、2個作者頁、4個池外／缺口／現況查詢。頻道增加時由當週pool重新計算；輪查不代表每週檢查所有頻道。
- 已知頻道只檢查最新12支公開上傳的標題metadata；舊片與未在標題寫地名的影片可能漏掉。每週仍另外搜陌生來源，不能只看熟悉頻道。
- 「新增來源」表示本次pool新收錄；不是最近發布。日期只能保存提供者標記，不能從搜尋排序推斷新鮮度。全無日期也可成為待查候選。
- 只用公開來源；不掛郵件、雲端硬碟或其他私有資料連接器。routine只保留Groundlane與Exa；repo使用既有GitHub連線。
- 不自動看完影片、不保證找齊所有資料、不更新文章，不修改CI、schema、D1或production設定。

## 每次執行（排程與手動相同）

1. 讀repo的AGENTS及本文件。使用乾淨checkout，保留所有其他工作。日期必須用`TZ=Asia/Taipei date +%F`，不可固定成本次範例日期。
2. 先查pool：`node scripts/research-pool.mjs search --category climbing --topic crags --query joyama --limit 1000`。既有閱讀、採用、淘汰與衝突都要保留。
3. 建立當週計畫：

```bash
node scripts/research-watch.mjs plan --watch joyama --date YYYY-MM-DD --output .research/watch-runs/YYYY-MM-DD-joyama
```

`plan.json`是當輪固定範圍；`requests[].id`用於結果對應。後續config改動不能回頭重寫舊計畫。

4. 搜尋前檢查完整callable inventory：Groundlane `web_search`／`web_fetch`優先；未掛載或一次bounded request失敗，選Exa等合適MCP；沒有合適MCP才用平台搜尋。不得使用退役fetch或Playwright抓公開網站。所有fallback都要保留真實tool與query，不得算成Groundlane驗證。
5. 對`query`跑原字串（每組最多4筆），`page`讀原URL（每頁最多3000字元）。只保留短metadata與自己寫的待查理由，不提交第三方全文、工具envelope、使用者資訊或憑證。另可對最值得查的至多2個新來源補讀，補讀也只是當次範圍，不能宣稱所有候選已讀。
6. `channel`要看實際公開上傳清單，不能把名字搜尋結果當頻道已更新。如果MCP無法讀清單，而環境已有yt-dlp，可用以下YouTube原生metadata adapter。不得為了本輪新增套件；缺工具或失敗就如實留下失敗，再選一種有界平台fallback。

```bash
python3 scripts/research-watch-channels.py --plan .research/watch-runs/YYYY-MM-DD-joyama/plan.json --output .work/joyama-weekly/channel-results.json
```

這個adapter固定無cookies、忽略使用者yt-dlp設定、不下載影音、最多4個並行、每頻道50秒與12支上傳。它只有發現能力，不能證明路線身份／影片品質。`title_terms`只篩標題，找不到地名仍可能漏片。

7. 合併實際結果為同資料夾的`results.json`。不得預先填成功或用舊資料冒充本輪工具執行。成功零結果、失敗、根本未執行必須分開：

```json
{
  "requests": [
    {
      "request_id": "plan中已存在的id",
      "query": "實際搜尋字串或讀取URL；若與plan相同可省略",
      "tool": "真實工具名稱",
      "status": "ok",
      "coverage": "實際查看範圍、上限及被排除的同名雜訊",
      "results": [
        {
          "url": "https://example.org/source",
          "title": "來源原標題",
          "source_type": "web-page",
          "reason": "為何值得補查、可能補到哪條路線或哪種資訊"
        }
      ]
    }
  ]
}
```

範例URL不是實際來源。失敗用`status: failed`、非空`error`和`results: []`；未知發布日期省略。可以加`route`、已知`creator_source_id`、`published_at`，不可猜。`article_paths`是建議更新位置，不是已採用的`used_in`。

8. 先產生報告，再檢查摘要與候選理由：

```bash
node scripts/research-watch.mjs report --plan .research/watch-runs/YYYY-MM-DD-joyama/plan.json --input .research/watch-runs/YYYY-MM-DD-joyama/results.json --output .research/watch-runs/YYYY-MM-DD-joyama
```

報告分新來源與已知來源，保留歷史採用／淘汰；同一source依canonical URL／已保存alias去重。新來源預設snippet/candidate。優先標記路線／現況缺口和池外來源；要宣稱「文章該路線無片」，config必須有明確、當次核對的`covered_routes`，不能靠搜尋結果猜。

9. 確認無假來源後，用同指令加`--write-pool`回填來源、觀察、搜尋。全份輸入先在暫存pool預驗再寫入；兩個既有CLI各自有鎖與原子檔案替換，仍不是跨檔交易。中斷時先跑pool check。報告的`complete`只表示計畫請求成功，不能解讀成全網完整或內容已驗證。
10. 保存plan/results/report/summary/sources/searches六份當輪檔、pool變更與progress狀態；`node scripts/research-pool.mjs check`、`node --test scripts/research-watch.test.mjs scripts/research-pool.test.mjs`、`python3 scripts/research-watch-channels.test.py`、`pnpm verify`通過後才能提交。
11. 在持續累積的`research/watch-joyama`分支上以明確路徑commit、push並建立／更新同一個Draft PR，附候選數、失敗／未執行範圍和最值得補查的3項。無新來源也保存查詢與覆蓋。**不得合併main、更新文章或自動部署。** 若失敗無法提交，保留run內的結果，回報具體blocker，不改檢查規則。

## 雲端排程入口與分支

routine：[城山每週研究候選（分類來源池）](https://claude.ai/code/routines/trig_01N4BTTqJPK268yLNXgNK2rb)。repo：`vincentxuu/quidproquo`。使用repo預設模型／環境，不覆寫模型選擇。2026-10-24已從任務頁核對Active、每週日09:00 GMT+8、下次2026-10-25 09:00，連接器僅Groundlane與Exa；雲端實跑另記驗收。

每次先`git fetch origin main`，確認remote的`research/watch-joyama`分支是否存在。有就從它接續本輪，再合併main新增內容；未合併的前週pool與報告必須保留，不可每週從main重建而漏掉它們。若main與研究分支的JSONL同時新增來源，依穩定ID合併、保留雙方觀察與搜尋，再跑pool check；不得以整檔覆蓋丟資料。其他衝突無法安全合併就回報，不強推。

如果研究分支已在先前PR合併後被刪除，且main已有腳本與本文件，才從main重建它；否則缺檔為blocker。相同日期重跑復用該日目錄與同一Draft PR。所有週報都留在同一研究分支，審閱合併後才成為main的共用pool。排程自身沒有寫main或自動merge授權。

接其他主題時新增`.research/watchlists/<id>.json`，指定合法category/topic、tags、查詢、來源與文章路徑，再單獨核准其排程。不要替16類別建立空跑任務。
