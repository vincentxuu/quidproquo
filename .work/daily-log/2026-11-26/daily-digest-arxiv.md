published: 入選 3 篇（RECAP context 壓縮訓練法 2611.31258、Adobe 的 agentic RAG 多次評測實證 2611.31266、MIMPA 共享記憶內部投毒攻擊 2611.31307），主題「agent 的 context/記憶層——訓練、評測、安全三個角度的壓力測試」。

例外與降級：
- Semantic Scholar 公開 API 連續 6 次請求皆回 429（rate limited），三篇入選論文的 citationCount/venue 改用論文自身 metadata 推斷（均為今日才進入官方公告批次的 arXiv preprint），未使用未經驗證的估計值。
- diagram-preview 未跑：此沙箱無 Chromium（/opt/pw-browsers 下找不到 chrome-headless-shell），`--skip-if-no-browser` 自動略過；check:diagram-geometry 與 check:diagram-text（不需瀏覽器）兩篇文章各 1 張圖，均 0 error。
- 圖解：僅在論文三（MIMPA）加了一張循序圖畫攻擊鏈（Planting → Storage → Retrieval → Triggering → Influence），其他兩篇段落沒有清楚的多步驟流程或分支判斷，依規則不硬畫。
- Layer A 受單次 fetch 輸出長度限制，cs.AI 102 篇 new submissions 只讀了前 29 篇、cs.CL 74 篇只讀了前 25 篇，cs.MA（7 篇 new + 11 cross）全讀；三篇入選論文與多數次強候選集中在已讀取範圍內，細節見篩選紀錄 candidateSources.layerA。
- 完整 `pnpm verify` 已跑過一次，exit code 0，全綠（唯一既有 WARN 與本次改動無關：`check:course-videos` 提示 2 篇課程影片查核日期過期，不擋 commit）。
