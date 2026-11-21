產出工具推薦：EYRA（layer8labs8/EYRA，Rust 寫的 Windows MCP server，用 UI Automation + OCR 取代截圖猜座標），series order 86，中英雙版。

- 圖解：補 1 張架構圖（Agent → EYRA → Eye/Ear/Hand → 目標視窗），check:diagram-geometry / check:diagram-text 皆過。
- diagram-preview 未跑：環境只有 `/opt/pw-browsers/chromium`，腳本找的是 `chrome-headless-shell`，不存在；check:diagram-text 已過。
- git pull 時遇到 shallow clone 造成本機 main 與 origin/main 看起來「無共同祖先」，確認過 `git fetch --depth=200` 後 merge-base 就是本機 main 的 tip（純淺層複製假象，無本機未推送內容），已 `--ff-only` 快轉完成，無資料遺失。
