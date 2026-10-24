# 分類研究追蹤設定

一份watchlist代表一個要持續追蹤的研究主題，不代表一種媒體或一個頻道。主題依`.research/pool/taxonomy.json`的category/topic分類；來源可以是網站、文件、論文、repository、書籍入口、課程、影音等。

`enabled: true`才加入每週批次。未啟用設定不會偷偷跑；沒有實際追蹤需求的類別不建空任務。目前只有`joyama.json`啟用，作為第一個驗證案例。

必要欄位：`id`、`title`、合法`category/topic`、`tags`、`article_paths`、`queries`。`context_terms`供搜尋脈絡，不限定地點；`place_terms`僅相容舊設定。`article_paths`可以為空，不代表任何來源已採用。

- `known_source_types`：輪查哪些來源類型；省略表示taxonomy全部類型。例：`["paper", "repository", "documentation"]`。不能把來源類型當頂層主題分類。
- `source_limit`：每輪已知來源總數，包含頻道，預設8、最大20；依穩定source ID與週次輪換。`channel_limit`只保留相容，不是新設定的通用入口。
- `queries`：池外查詢，含唯一`id`、`query`，可以有研究目標`route`；路線是城山案例的可選脈絡，不是通用必填。
- `query_limit`：每輪查詢上限，預設4、最大12。
- `known_pages`：最多4個額外指定公開入口；可省略。書籍／課程等只讀可公開取得的頁面，不能因成功下載或讀到摘要就標已讀全文。
- `title_terms`：可選的YouTube adapter標題篩選詞；一般論文、文件或repo追蹤不需要。
- `covered_routes`：攀岩案例的可選、當次核對過的既有影片路線清單。未提供時不能推論缺片。

執行方式見[通用研究追蹤流程](../../docs/research-watch.md)。新增一份設定不會建立一套新工具：批次排程會自動讀取所有已啟用設定，再使用相同來源池、去重與候選報告流程。
