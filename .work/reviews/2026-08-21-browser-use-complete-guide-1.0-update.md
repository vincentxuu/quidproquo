# 審稿紀錄：2026-08-21-browser-use-complete-guide（order 14）1.0 改寫，2026-11-19

依 research-15-loop.md 的「Browser Use 1.0 post-update notes」22 項，把全文改成 1.0.6：迴圈改成模型寫 Python、`Browser('chromium')`、1.0 結果物件與 judge、登入改 profile 表、`type_secret`、新增安全邊界與「從 0.x 升級」一節；移除失效的模型清單與文件連結；加更新紀錄。slug、date 不變。

## post-verify

獨立 subagent 對 README／MIGRATING.md／pyproject／Cloud quickstart 核對 43 條，0 ❌、8 🟡，全部處理：`<secret:…>` 遮罩適用所有值；`checkpoint(..., partial=True)`；少數 0.x 調校參數只警告不報錯；`Browser('chrome', profile=...)` 也開無驗證除錯埠；`uv init --python 3.12`；補 `browser-use login`、`Agent(..., tools=tools)`、`browser-use-sdk` 安裝。

## post-polish

- check:tw 0／0；post-quality、process-leak、lang-parity 通過。
