產出資安警報（中英雙版）：開源自主滲透測試工具 AntiFox（ARTEX 分支）被用於真實入侵，攻陷 IIS 伺服器植入 webshell 後取得 AWS 身分，橫向枚舉十幾種雲端服務，成功執行 GetSecretValue 撈到正式環境密鑰，另一起刪改 S3 物件；AWS 已回應確認服務本身未被攻破。series order 76。

- 事件交叉驗證：Arctic Wolf Labs 原始報告 + The Hacker News + BleepingComputer，三方獨立確認。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 只有 chromium-1243，腳本要的 chromium_headless_shell-1208 不存在）；check:diagram-geometry 已過（0 錯誤）。
- check:references / check:lang-parity / check:tw / check:series-order 皆過。
