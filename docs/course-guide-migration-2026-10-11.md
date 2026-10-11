# 課程導讀統一與防復發修正（2026-10-11）

使用者已核准整批操作（「要全數完成」）。最新 main 的隔離分支 `fix/course-guide-completion` 為驗證底本，網址、原發文日期、語言與 series.order 均保留。

## 全站格式結果

- 48 個註冊課程系列、801 組中英文章（1,602 檔）。1,600 個舊標題改為主題在前、課程身分與範圍在後；另兩個第 12 堂樣本已合規。
- 中文用「第 N 堂」；原有週次、作業、實驗、助教課、講義章次、分篇與跨堂範圍保留。保留官方第 0 堂／第 7.5 堂／作業 0／第 0 週，不由 series.order 推造課堂次；無官方編號的主題文章不造號。
- 全站嚴格標題檢查 0 issues；歷史 baseline 只保存證據，已不提供豁免。
- 來源區移到教學主體後；影片狀態、必要版本限制與來源衝突仍保留。全站區塊順序檢查 0 issues。來源區搬移保存原文／錨點／影片與連結；另已將少數純查核歷程移存研究筆記。
- 合併重複英文更新紀錄，保留原有條目。
- 課程頁尾依主系列順序導覽，不再使用日期鄰文；非課程維持日期導覽。

## 內容與證據邊界

已對每個系列閱讀代表文章；全站另外完成檔案盤點與來源區位置檢查。缺少實際推演的代表文章補上自編輸入、計算／推理、結果與答案判準。修正了單核心交錯、消去順序、輸入範圍、程式 import、條件獨立及梯度敘述的具體錯誤，中英同步。CS224N Tinker 原本只有材料缺口紀錄，改為有明確來源界線的 LoRA 論文預習，不重建未取得的課堂內容。

這不是 801 組每篇全文／每個子主題的教學認證，也不是全站來源重新查證。語意審稿只覆蓋實際改動與代表文章，不能把 title/layout lint 當成教學驗收。影片與原課材料未取得時保留限制；本次未 commit、push 或 deploy。

## 防復發

五個 skill 直接共用 `.agents/skills/post/references/course-guide-contract.md`。`pnpm verify` 納入全站嚴格標題／雙語範圍與來源順序／重複更新區檢查，10 項標題與 7 項版面回歸測試；新教學改寫需要非作者的語意審稿報告及內容 hash。`.claude/skills` 僅由 skills:sync 產生。

詳細清單與逐段證據在 `.work/course-full-completion/`：`title-migration-manifest.json`、`final-title-audit.json`、`content-audit.json`、`series-editorial-review.json`、`independent-teaching-review.json`、來源搬移與變更 manifests。
