# 審稿紀錄：2026-11-18-stagehand-vs-playwright（AI 瀏覽器自動化 order 9，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-9-16.md）。引文、HN 兩版程式碼、差異表各列、Test Agents 描述、遷移順序逐字對過一手來源（Stagehand 遷移指南、v4 blog、playwright.dev/docs/test-agents、dev.to EHR 文）。0 ❌、4 🟡，處理：
- EHR 反例少了「改成寫腳本時才用 AI」→ 併入新的「換之前先分類失敗原因」段。
- 自動等待條件補「掛上 DOM」（attached）。
- 「每跑一次多一次推論」加「預設」。
- 「Playwright 有 CLI」未對一手查證 → 刪掉 CLI，只留 MCP。

## post-review

獨立 subagent 編輯審稿（review-9-16.md #1–14）。處理：
- #1 必修：選型補第三條路「掛在 Playwright 上的 SDK（Midscene、AgentQL）」，tldr 同步。
- #2 必修：指出 HN 範例的 extract() 在穩定 selector 上不必要，補「每一步問這裡真的需要模型嗎」。
- #3 healer 會把測試標成 skipped，補上並建議當 PR 審。
- #4 EHR 段改成可做的動作（分類最近二十次失敗），細節轉手到 v4 篇。
- #5「會得到什麼」與 v4 篇重複的三點併成一點並連過去。
- #6 setDomainPolicy API 名；#7 補 goto 預設等待也不報錯；#9 圖上兩種「壞掉時」標出差別；#10 tldr 縮短；#12 長句拆、遷移順序改編號清單；#13 英文語感；#14 改連 Browser Use 篇。
- 未採納：#8 不連 Playwright CLI（未查證，改刪）；#11 標題保留問句（與聚焦問題一致）。

## post-polish

- check:tw 0／0；post-quality 只剩 tag `testing` 的 WARN（正文大量談測試，保留）；process-leak、diagram-geometry、lang-parity 通過。
- register-scan 長句 2 句（64、66 字），可接受。
- 圖：diagram-preview 中英 ✓，淺色／深色／手機看過。
