產出 2026-11-16 Product Builder 面試日練（Product Sense）中英雙版，練習題為 KORE1 2026 年整理的 Series B 金融科技公司真實面試題（自由工作者財務規劃產品），案例為 Duolingo 連續紀錄機制分層設計。

- 權重設定（interview-focus.json）全為 1，依星期預設主題（一 → Product Sense），無加練覆寫。
- 圖解：無適合段落——CIRCLES 框架與拆解思路都是無分支的順序步驟，已用表格呈現，不符合 flowchart 的「有分支判斷」條件，未畫圖。
- 環境一開始沒有 node_modules，跑 `pnpm install` 補齊依賴，完成後確認 `pnpm-lock.yaml` 無異動（與既有鎖檔一致）。
- check:tw 抓到新檔 3 處「用戶」A 級用詞，已改為「使用者」後重跑確認 0 error。
- check:references / check:lang-parity / check:series-order 均通過（series-order 僅既有缺號 warning，非本次新增重複）。
