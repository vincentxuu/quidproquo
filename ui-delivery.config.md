# QuidProQuo UI 交付設定

- 流程正本：`.agents/skills/ui-delivery/SKILL.md`；Claude 鏡像由 `pnpm skills:sync` 產生。
- 技術：Astro + React；檢查 Astro scoped CSS、React CSS import、Tailwind utility 生成與執行時建立的 DOM。
- 設計來源：`src/styles/tokens.css`、`src/components/` 既有控制項與鄰近頁面。新增控制項須說明樣式來源，不能只檢查 class 存在。
- 盤點：使用 `rg` 查找元件 import、文字、路由、createElement 與所有 consumer；含中英文版本。
- 唯一品質閘門：`pnpm verify`；pre-commit 使用既有 `pnpm verify:staged`，不得跳過。
- 行為測試：`pnpm exec vitest run <相關測試路徑>`，依修改範圍選擇；有測試不代表畫面通過。
- 額外診斷：`pnpm exec astro check`；與既有 verify 的通過狀態分開記錄。
- 視覺工具：現有 `pnpm test:visual` 使用瀏覽器，僅在使用者允許時執行。禁止瀏覽器時不得執行，也不得以來源檢查冒充畫面驗收。
- 適用驗收：桌面與窄螢幕、深淺色、鍵盤焦點；狀態功能須涵蓋 guest/authenticated、loading、empty、success、failure 中適用的狀態。
- 任務證據：`.work/ui-delivery/<task>.md`，使用 skill 的 task-report 模板；含來源 revision、檢查指令、觀察及待驗項目。
- CI 設定：Quality 先比對 PR base/head 或 push before/head；UI 範圍變更必跑 visual job，失敗會讓 Quality 失敗並阻擋依賴它的正式部署與 Preview。無比較基準時保守要求驗證。內容與 API-only 變更保留既有 gates。
- 範圍檢查：`node --test scripts/ui-change-scope.test.mjs`。偵測檔案範圍不代表畫面品質已合格；現有視覺測試亦不等於覆蓋全部頁面。遠端 branch protection 尚未核對。
- 使用者禁止瀏覽器時，不在本機執行視覺測試，也不觸發遠端瀏覽器驗證；必須保留待驗，不能跳過必要 gate 後聲稱完成。
- 驗收責任：agent 提供證據；工具受限的畫面或操作由使用者或指定 reviewer 驗收。未取得證據前保留 pending。
- CI、hooks、branch protection 變更遵守專案既有授權規則。不能只在文件宣稱已強制執行。

- 截圖基線：預設 updateSnapshots=none，缺少基線會失敗，不自動寫入 source。明確更新指令仍需逐張核對；測試自行產出的候選圖不能算已核准基線。
