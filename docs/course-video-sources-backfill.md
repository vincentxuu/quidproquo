# 課程系列影片來源回填（2026-10-10）

使用者確認批次計畫後，對 774 組中英文章（1548 檔）補上課程影片來源與更新紀錄。

- 628 檔有對應影片，加入 810 個播放器；每篇先顯示最多兩支，其餘保留原始連結。
- 920 檔使用官方入口、課程總覽、錄影權限或尚未確認講次錄影的說明。舊年度補充材料另標版本。
- 修正 14 個來源網址，中英文同步。CS50 AI 改用官方週次頁所列影片；MIT Modern CNN 誤連 Lecture 2 的來源改為官方錄影索引。
- 保留原有 frontmatter、date、slug、series 與正文；除經官方證據核對的來源網址更正。

## 查核與限制

1548 檔原文保留與中英影片 URL 對照通過；810 影片區塊用 production parser 與 renderer 成功解析；774 篇中文語域掃描成功；diff whitespace 檢查通過。已抽樣審閱 12 組中英與 4 篇代表文章。

本機 Astro 預覽因記憶體不足中止，8GB heap 重試仍失敗，沒有完成版面與影片播放驗證。播放器可解析不代表所有影片可嵌入、可播放或具有字幕。部分既有影片連結未逐支重驗播放，文章已標示限制。

MIT Modern CNN 原始正文的講次與教材身份仍有矛盾：OCW Fall 2024 Lec 06 是 Generalization Theory。新增來源區塊已揭露，尚未重寫原文論述。

研究預設使用 Groundlane；部分子代理未掛載 Groundlane，使用 Exa 與平台 web 讀取公開官方來源。Fallback 不視為 Groundlane 路徑的驗證。

## 發佈驗證

提交前於最新 origin/main 的隔離 worktree 執行完整 pnpm verify，結果記錄於提交說明。遠端 CI 與正式站實際播放需另行確認。

## 逐篇狀態與追加來源查核

使用者要求每篇文章明確標示是否有影片，並繼續核對 125 組沒有播放器的待確認文章。所有 774 組中英課程文章現在於開頭顯示影片狀態，並可跳轉至來源說明：已附影片、官方入口、需登入、官方公開頁未列錄影、補充影片或待確認。

追加核對 125 組的結果：

| 狀態 | 組數 | 說明 |
|---|---:|---|
| 已確認對應公開影片 | 11 | CMU AI Agents 與 Harvard CS2881R |
| 相關補充影片 | 2 | Harvard 學生實驗與 MIT L04 CNN；不冒充原講次 |
| 錄影需登入 | 23 | Stanford CS109 Summer 2026 官方封存與 syllabus，Canvas 入口導向登入 |
| 官方公開頁未列對應錄影 | 82 | 核對課程版本、課表與教材清單；不代表校內沒有錄影 |
| 僅官方入口 | 2 | 作業入口，不任意配講課影片 |
| 課表提及錄影，未取得公開連結 | 1 | Harvard CS181 Embedded EthiCS 課表文字有 see recording，公開 HTML 儲存格沒有可開啟影片連結 |
| 對應錄影仍未確認 | 4 | 下列 CMU AI Agents 講次；完整課表抽取與講師影片清單讀取受限，精確搜尋沒有對應結果 |

追加後共有 836 個播放器。來源與狀態中英同步；原日期、分類、series 與 URL 保留。只修正與來源證據矛盾的錄影說明，包括部分標題／摘要過度宣稱「沒有錄影」的文字。

待確認四篇：
- [2026-09-29-cmu-11768-lecture-11-advanced-rl](https://quidproquo.cc/posts/ai/2026-09-29-cmu-11768-lecture-11-advanced-rl/#課程影片來源)
- [2026-09-29-cmu-11768-lecture-07-computer-use-agents](https://quidproquo.cc/posts/ai/2026-09-29-cmu-11768-lecture-07-computer-use-agents/#課程影片來源)
- [2026-09-29-cmu-11768-lecture-10-deep-research-agents](https://quidproquo.cc/posts/ai/2026-09-29-cmu-11768-lecture-10-deep-research-agents/#課程影片來源)
- [2026-09-29-cmu-11768-lecture-08-sft](https://quidproquo.cc/posts/ai/2026-09-29-cmu-11768-lecture-08-sft/#課程影片來源)

正式站來源區與文章開頭狀態需要部署後另行讀取確認；本地 parser 與內容核對不代表所有 YouTube 影片已逐支測試播放。
