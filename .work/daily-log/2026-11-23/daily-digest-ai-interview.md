產出 2026-11-23 ML Fundamentals 主題（週一固定排程，權重全 1，未加練）：機率校準（probability calibration），練習題改寫自 Pallav Mahapatra Interview Bank Q7（詐欺損失預測情境）。中英雙版皆附一張三階段流程圖（訓練/校準/驗證三份資料不能互換）。

- 搜尋：Groundlane MCP 連線被拒（已登入但 refused），依契約降級到 Exa（雲端 MCP 層）取得面試題與教學資源，跳過 Groundlane 直接 HTTP／Keenable／You.com 中間層（toolDegradation）。
- 環境：session 無 node_modules，執行 `pnpm install`；playwright 預裝瀏覽器版本（chromium_headless_shell-1243）與 @playwright/test 期待版本（1208）不符，建立 `/opt/pw-browsers/chromium_headless_shell-1208` symlink 指向 1243 後 diagram-preview 可正常執行（中英文版皆 0 issue，截圖目視確認淺色/深色/手機寬度正常）。
- check:references 初版有「關鍵詞重疊」WARN（標題 ML Fundamentals 與參考資料無交集），已在參考資料描述補上「ML fundamentals 面試題庫」字樣修正，重跑後 0 WARN。
- check:tw / check:lang-parity / check:series-order / check:diagram-text / check:no-emoji 皆通過，無 blocking。
