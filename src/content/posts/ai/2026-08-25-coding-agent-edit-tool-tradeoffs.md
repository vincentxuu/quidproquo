---
title: "跟成熟 coding agent 學設計（10）：編輯工具的取捨——unified diff、exact edit、hashline 與 whole-file"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 10
tags: [coding-agent, harness-engineering, edit-tool, unified-diff, llm, tool-design]
lang: zh-TW
description: "拆解 Codex、Claude Code、OpenCode、Pi、OMP 五家的檔案編輯工具設計：unified diff 為什麼常失敗、fuzzy fallback 的代價、hashline 的 hash 錨點，對照 rivumi 用受限 replace_text 把 qwen3:4b 從失敗救到 5/5 的過程。"
tldr: "LLM 寫 unified diff 壞在簿記：hunk 行數算錯、上下文行幻覺。五家的答案分成兩派——把 diff 文法做簡單（Codex 拿掉行號）、或乾脆不用 diff（Claude Code/Pi/OpenCode 的 exact replace）；OMP 更進一步用 hash 錨點綁住讀取狀態。rivumi 走最小干預：保留 guarded apply_patch，加一個零模糊匹配的 replace_text，qwen3:4b eval 就從穩定失敗變 5/5。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-edit-tool-tradeoffs-en)

## 設計問題

編輯工具是 coding agent 最常被呼叫的工具，也是最常失敗的一個。問題不在模型不懂程式，而在 unified diff 是一種為 `diff` 和 `patch` 這類確定性程式設計的格式，不是為 LLM 設計的。模型每次產生一個 hunk，都要正確回答幾個它根本不需要回答的問題：

- 這行是上下文還是變更？前面要不要加空白？
- hunk header 的起始行號和行數對不對？改動後行號會位移多少？
- 檔尾有沒有換行？

任何一格算錯，`git apply` 直接回 `corrupt patch`。我在 rivumi 上跑本地小模型的時候，看到的就是這種失敗：模型兩次都找對了那一行該從減號改成加號，但 patch 在新增行後就結束了、或是宣告了錯誤的 hunk 行數，`git apply --check` 判成 corrupt——語意全對、簿記全錯。另一種更陰險的失敗是上下文行幻覺：模型憑印象補出周圍的程式碼，hunk 文法合法但內容不存在，apply 一樣失敗。

所以每家 agent 都得回答：編輯工具要讓模型寫多「精確」的格式？失敗之後由誰收拾？

## 五家怎麼做

### Codex：自訂 patch 格式，拿掉行號、換來多層模糊比對

Codex 沒有用標準 unified diff，而是自訂了一個 `*** Begin Patch` 信封格式。看 `codex/codex-rs/apply-patch/src/parser.rs#UpdateFileChunk`：每個 chunk 只有 `change_context`（一行定位用上下文）、`old_lines`、`new_lines` 和 `is_end_of_file`——完全沒有行號與行數。這直接消滅了「算錯 hunk header」這一整類失敗。

代價是應用端變複雜。`codex/codex-rs/apply-patch/src/seek_sequence.rs#seek_sequence` 做四段遞降式匹配：先精確比對，再忽略行尾空白，再忽略頭尾空白，最後把 Unicode 引號、破折號、全形空白正規化成 ASCII 再試；EOF pattern 還會優先從檔尾找。另外 `parser.rs#ParseMode` 有個 lenient 模式，專門處理 GPT-4.1 會把 heredoc 包進 shell command 陣列的怪習慣。這說明一件事：就算格式已經簡化，應用端仍要為模型的慣性失敗模式留退路。

### Claude Code：exact replace 加 read-freshness 閘門

Claude Code 的 Edit tool 是 str_replace 式：`claude-code-source/src/tools/FileEditTool/types.ts#inputSchema` 只有 `file_path`、`old_string`、`new_string`、`replace_all` 四個欄位。模型完全不碰 diff 文法。

真正的設計重點在守門。`claude-code-source/src/tools/FileEditTool/FileEditTool.ts#validateInput` 先查 `readFileState`：沒讀過就拒絕、讀過但檔案的 mtime 比讀取時間新也拒絕（mtime 可疑時還會退回比對完整內容），然後才數 `old_string` 出現次數——零次報 not found、超過一次且沒開 `replace_all` 就要求補上下文。編輯成功後更新讀取時間戳，讓後續 stale write 也被擋下。「先讀才能編輯」在這裡不是 prompt 建議，是程式碼強制。

### OpenCode：exact replace，但用九層 replacer 收爛尾

OpenCode 同樣是 exact replace，但 `opencode/packages/opencode/src/tool/edit.ts#replace` 依序嘗試九種 replacer：精確、行首修剪、block anchor、空白正規化、縮排彈性、跳脫字元正規化……一路放寬到 ContextAwareReplacer。找不到才算失敗。它有一個值得注意的自保機制 `isDisproportionateMatch`：如果 fuzzy 展開後命中的範圍遠大於模型給的 `oldString`，直接拒絕替換。這承認了 fuzzy fallback 的本質風險——你可能換掉的不是模型想換的字。

### Pi：批次 exact edit，diff 由 harness 生成

Pi 的 `pi-mono/packages/coding-agent/src/core/tools/edit.ts` 用 `edits[{oldText, newText}]` 陣列，一次呼叫做多處替換，且明講所有 edit 都對照原始檔匹配（不是增量套用）。prompt 只要求 oldText 「小而唯一」。關鍵哲學跟 Codex 相反但殊途同歸：模型只負責選內容，diff 語法由 harness 自己算出來——審查用的 diff 永遠正確，因為它不是模型寫的。

### OMP：hashline——把讀取狀態綁進編輯格式

OMP（Pi 的 fork）走得最遠。`oh-my-pi/packages/coding-agent/src/utils/edit-mode.ts#EditMode` 定義了五種編輯模式：`replace`、`patch`、`hashline`、`apply_patch`、`sloppy`，預設是 `hashline`。hashline 的格式見 `oh-my-pi/packages/hashline/src/patcher.ts#Patcher`：每個 section 以 `[PATH#TAG]` 開頭，TAG 是讀取時記錄的整檔內容 hash；apply 前先驗 hash，檔案變過就拒絕或走 `oh-my-pi/packages/hashline/src/recovery.ts#Recovery` 的三方合併恢復。行操作像 `PUT A.=B:` 直接指名行號區間替換——行號不再是模型算出來的簿記，而是讀取結果的一部分。

更有趣的是路由：`edit-mode.ts#resolveEditMode` 會按模型查 `getEditVariantForModel`，模型能力不支援 hashline 就自動降到 `sloppy` 模式。同一份 codebase 承認「不同模型適合不同編輯語言」。

OMP 另附實測：`oh-my-pi/packages/typescript-edit-benchmark/all_models_results.json` 裡，deepseek-v3.2 的任務成功率只有 55%，edit 成功率卻是 100%——編輯工具可靠不代表任務會過；反過來 gemini-3f 任務成功率 80%，edit 成功率卻只有 74%。兩個數字脫鉤，正好說明編輯工具是獨立的工程變數。

## rivumi 的選擇與差異

rivumi 的 M2 只有 guarded `apply_patch`，真實 provider eval 裡 qwen3:4b 反覆死在同一件事上：找到對的那一行、寫出 corrupt patch。M3 我加了受限的 exact edit，證據在 `src/rivumi/tools.py#replace_text`：

- 必須先 `read_file`，而且 harness 記的是完整內容的 SHA-256——檔案讀後變過就直接拒絕，這是把 Claude Code 的 read-freshness 從 mtime 啟發式升級成內容比對；
- `old_text` 必須恰好出現一次，零次回報 observed=0、多次回報 observed=N，不做任何 trim 或正規化；
- 目標必須是既有的 Git-tracked UTF-8 文字檔，新檔只能走 `apply_patch`，讓 diff 保持可審查；
- 寫入用同目錄暫存檔加 fsync 的原子替換，事後跑 `git diff --check` 和累積 patch 預算檢查，任何一步失敗就還原原 bytes 和 mode；
- 沒有 fuzzy matching、regex、replace_all、whole-file writer。

`src/rivumi/prompts.py` 的 prompt 版本 `m3-exact-edit-v1` 給了一條決策規則：小改動用 `replace_text`、建檔刪檔和複雜結構改動才用 `apply_patch`。`src/rivumi/tools.py#apply_patch` 本身不動，繼續用 `git apply --whitespace=error-all` 做安全拒絕。

結果：同一個 tiny-python-bug fixture，真實 Ollama eval 從穩定失敗到五次全過（5/5）。這不是 qwen3:4b 變強了——是 harness 把「數 hunk 行數」這件確定性程式碼更能勝任的事，從模型手上拿走了。跟 OpenCode 九層 replacer 的差別是態度問題：我選擇讓失敗留在原地、訊息可分類（0 matches 就 re-read），而不是靜默修正到一個可能不是模型本意的目標。

## 論文與技術報告印證

這個取捨不是新發現。Aider 的工程基準（[unified diffs](https://aider.chat/docs/unified-diffs.html)）很早就記錄了 GPT-4 Turbo 在無輔助下寫 unified diff 的低完成率，以及靠「明確的 diff 規則提示」拉回來的做法——提示有用，但 Aider 同時也在程式端修 patch，等於承認光靠提示不夠。學術側，[SWE-agent](https://arxiv.org/abs/2405.15793) 提出 agent-computer interface（ACI）的概念：工具介面的形狀本身就是效能變數，編輯指令的設計直接影響成功率，跟模型能力同樣重要。OMP 的 edit benchmark 數據則給了最新的佐證：edit 成功率和任務成功率是兩條可以獨立調整的曲線。

## 還能改善什麼

- **按模型路由編輯模式**。OMP 的 `resolveEditMode` 已經示範了 per-model variant；rivumi 目前是一套工具服務所有模型，若要支援更小的模型，這是下一個自然台階。
- **審查預覽升級**。approval 目前顯示 path 和 old/new 片段，可以像 OpenCode 一樣在 mutation 前算好 diff 預覽。
- **hashline 式的內容錨點**。rivumi 已經有 read-version ledger，理論上可以把 hash 放進編輯呼叫本身，讓 stale edit 在 schema 層就被拒絕，而不是事後比對。但要小心：這會把寫入耦合到讀取的輸出格式，正是 M3 筆記裡判斷「不是最小答案」的原因。
- **更多 fixture**。目前 eval 只涵蓋單檔小改動；CRLF、BOM、需要上下文消歧的重複行、多檔重構都還在待辦清單上。一個編輯工具的可靠性宣稱，範圍就是它的 fixture 清單。

核心教訓回到同一句話：把確定性的工作交給確定性的程式碼。模型擅長的是決定「哪裡、改成什麼」，不是數 hunk 行數。

## 參考資料

- [Aider — unified diffs](https://aider.chat/docs/unified-diffs.html)：Aider 對 GPT-4 Turbo 寫 unified diff 失敗率的實測與緩解策略。
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)：ACI 概念原始論文，工具介面設計影響 agent 成功率的直接證據。
- [openai/codex — apply-patch crate](https://github.com/openai/codex/tree/main/codex-rs/apply-patch)：Codex 自訂 patch 格式、parser 與 seek_sequence 模糊比對的原始碼。
- [can1357/oh-my-pi — hashline package](https://github.com/can1357/oh-my-pi/tree/main/packages/hashline)：hash-anchored 行編輯格式的完整實作。
- [sst/opencode — edit tool](https://github.com/sst/opencode/blob/dev/packages/opencode/src/tool/edit.ts)：exact replace 與九層 replacer chain。
- [badlogic/pi-mono — coding-agent edit tool](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/src/core/tools)：批次 exact edit、harness 生成 diff 的設計。
