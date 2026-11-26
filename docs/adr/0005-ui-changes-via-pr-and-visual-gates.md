# ADR 0005：UI 變更走 PR，部署由版面斷言把關

## 背景

2026-10-23 的 9eed8c3e 直接 push main，同一筆把截圖比對改成擋部署，但 three-column 28 張 `-linux` 基線不存在、chat 6 張已過時，run 39937025650 跳過部署。`-linux` 基線只能在 CI 產，Mac 本機預先發現不了。

## 決定

擋部署的 `visual` job 只跑版面、對比、互動斷言；像素比對移到 continue-on-error 的 `screenshots` job（PR #200）。UI 變更一律走 feature branch＋PR，截圖基線用 `visual-baselines.yml` 在 PR 分支產，逐張看過再 merge。`pnpm verify` 擋沒有 `-linux` 基線的截圖呼叫點。

## 理由與後果

斷言跨平台一致、刻意改版不需更新基線，部署不再因基線維護卡住；真的版面壞掉仍會擋。純視覺變化（顏色、字型）不擋部署，只靠 PR 上的 diff 由人審。新增擋部署的檢查時，同一筆變更必須讓它在 CI 上先綠。
