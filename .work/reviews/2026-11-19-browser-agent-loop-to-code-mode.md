# 審稿紀錄：2026-11-19-browser-agent-loop-to-code-mode（AI 瀏覽器自動化 order 15，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-15-18.md）。0 ❌、5 🟡，全部處理：
- Forus 的句子是文章裡的一節標題，不是文章標題 → 改寫並補連結。
- 90% 對 78% 不是「略高」→ LangChain 段縮短、連回 order 13、改講步數與約 13 倍成本。
- EHR 巢狀例子是 Browser Use 的簡化說明 → 改「用一個簡化的例子說明」。
- Notte 外部整合的出處是 v1.10 release notes，不是 PR #1202 → 補 release 連結。
- HardBench $0.12–$3.07 是排行前段的範圍 → 改寫。
- 研究階段修正命題：拿掉的是「固定動作選單＋框架迴圈」，不是執行期推論；Browser Use 1.0 的 Agent 仍是執行期迴圈，且移除了錄製重播。

## post-review

獨立 subagent 編輯審稿（review-15-18.md）。處理：
- 必修全採納：「同一季」實際跨兩季 → 改「四個月內」；LangChain 段補但書並連到 13；Forus、「not in the weights」、「This is not a sandbox」補 inline link。
- 建議：tldr 去掉「不是推論，而是」句型（post-quality 也抓到）。其餘建議（圖畫出「每一步／一次」差別、解釋 harness、縮 tldr）未採納：圖的 sub 標籤已寫「每一步都推論」「執行時不推論」，harness 在正文首次出現處有上下文。

## post-polish

- check:tw 0／0；post-quality、process-leak、diagram-geometry、lang-parity 通過。
- 一併處理：order 16 開頭補 15→16 的橋；總覽連結回填。
