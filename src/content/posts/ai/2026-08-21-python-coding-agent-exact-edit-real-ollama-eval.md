---
title: "用 Python 寫私人 coding agent：M3 用 exact edit 讓 qwen3:4b 真實 eval 從失敗到 5/5"
date: 2026-08-21
category: ai
tags: [coding-agent, python, ollama, qwen3, tool-use, eval, harness-engineering]
lang: zh-TW
type: project
description: "Python coding agent 第三個里程碑：把小模型的 malformed unified diff 分類成 harness 問題，加入受限 replace_text，並以完整 CLI 跑五次真實 Ollama eval。"
tldr: "模型已找到正確修改卻寫不出合法 diff 時，不一定要先換更大的模型；把常見操作改成可驗證的窄工具，能在不放寬 path、patch、approval 與 verification 的前提下提升成功率。"
draft: false
---

M2 結束時，`pca` 已有自己的 agent loop、互動 approval、session、resume 與 provider adapter，但真實 coding eval 沒過。

`qwen3:4b` 其實讀到了正確檔案，也知道 `left - right` 應該變成 `left + right`。它失敗的地方是 unified diff：一次 hunk 行數錯，一次缺少 EOF newline bookkeeping。語意正確，傳給 `git apply` 的格式卻不合法。

這個差異決定了 M3 的方向。若把所有失敗都叫做「模型不夠強」，我只會繼續換模型或堆 prompt；但從 harness 角度看，這更像是工具合約把一個單行替換變成了不必要的 diff 算術題。

## TL;DR

- 新增 `replace_text(path, old_text, new_text)`，只允許既有、Git-tracked UTF-8 檔案中恰好一次的 exact replacement。
- 模型必須先完整 `read_file`；檔案在 read 後若改變，edit 會 fail closed。
- path policy、approval、讀取上限、累積 patch 上限、`git diff --check` 與 verification 都沒有放寬。
- 寫入採 temp file、fsync、atomic replace；任何後續檢查失敗都恢復原始 bytes 與 mode。
- `apply_patch` 仍負責 multi-hunk、新檔與刪檔；沒有 fuzzy edit、regex、replace-all 或 unrestricted `write_file`。
- 真實 Ollama `qwen3:4b` 經完整 `pca run` 跑五個獨立 fixture，5/5 都完成並通過 pytest；原始 source repo 每次都保持不變。

## 問題不是「不會改」，而是工具太難用

Unified diff 很適合人類 review，也能表示新增、刪除與多檔修改。它不適合每一種 model action。

單行修改仍要求模型同時做到：

1. 找到正確舊內容；
2. 算對 hunk header 的 old/new line count；
3. 保留 context 與 newline metadata；
4. 產生可被 parser 接受的完整 envelope。

這些 bookkeeping 跟「程式應該加法而不是減法」是兩種能力。M2 的事件與 rejected patch 已證明模型通過第一種判斷，卡在第二種格式。

因此我沒有先把 system prompt 改成一頁 diff 教學。Prompt 只能提醒，不能讓 hunk count 變成 deterministic。更實際的做法，是讓 harness 為最常見的小修改提供一個較窄、較容易驗證的 action。

## 解法：unique-only exact replacement

工具 schema 很小：

```json
{
  "name": "replace_text",
  "arguments": {
    "path": "src/tiny_python_bug/calculator.py",
    "old_text": "left - right",
    "new_text": "left + right"
  }
}
```

但實作不是直接呼叫 Python 的 `str.replace()`。真正的 contract 是：

```text
allowed existing path
  -> must already be Git-tracked
  -> bounded binary read
  -> strict UTF-8 / no NUL
  -> prior complete read hash still matches
  -> old_text count must equal 1
  -> bounded resulting content
  -> temp write + fsync + preserve mode + atomic replace
  -> git diff --check
  -> cumulative patch byte / line / changed-file limits
  -> success, or restore original bytes and mode
```

先讀後改不是 prompt 禮貌，而是 code-level guard。`read_file` 只在回傳完整內容時記錄 hash；檔案太大而被截斷，就不能拿截斷片段去 edit。若其他 action 在中間改了檔案，hash 不一致，模型必須重新讀取。

`old_text` 也必須恰好出現一次。零次通常代表 context 過期；兩次以上代表修改意圖不夠精確。兩者都不猜。輸入不能帶 NUL，target 也必須已由 Git 追蹤；否則一次看似成功的改寫可能只留下 `Binary files differ`，或根本不出現在 reviewable diff。這裡刻意不用 fuzzy matching，因為「猜最像哪一段」會把 policy 從可測試的 code 移回 heuristic。

## 為什麼不做 `write_file`

完整覆寫看起來最容易讓模型成功，代價卻很大：漏掉檔尾、改壞換行、覆蓋同時發生的變更，或把原本只需一行的 diff 擴成整檔。

所以 M3 保留兩條明確路徑：

- 小型、既有檔案、唯一舊文字：`replace_text`；
- multi-hunk、新檔、刪檔、結構性改動：`apply_patch`。

沒有一個「如果失敗就隨便整檔寫入」的逃生門。Approval 也把 `replace_text` 視為 modify，terminal 會顯示 path、old text 與 new text；允許一次 edit 不會順便開放其他 path 或 execute。

## Prompt 只改一個邊界

新的 system prompt 有版本 `m3-exact-edit-v1`，核心只增加兩句：先讀檔；小型 exact edit 優先用 `replace_text`，新檔、刪檔或 multi-hunk 才用 `apply_patch`。

版本會進 session 與 `run.created` event。這讓之後比較成功率時，能知道某個 artifact 使用哪一版 tool guidance，而不是只看到「最近 prompt 好像改過」。

## 真實 eval 不是呼叫一次 API

這次沒有把「provider 回一段文字」算成 coding E2E。Eval runner 每一次都會：

1. 從 fixture 建立新的 Git repository 與 base commit；
2. 建立 repository 外的獨立 run root；
3. 用子程序執行公開介面 `python -m coding_agent run`；
4. 讓真實本機 Ollama `qwen3:4b` 自己選 tool；
5. 要求 final status 為 `completed`、terminal reason 為 `verified`；
6. 核對 changed files、patch 內容與 `replace_text` event；
7. 再核對 source HEAD、Git status 與檔案 bytes 完全不變。

固定 manifest 預先定義五次中至少四次成功才算 daily-ready：

```bash
eval_root=$(mktemp -d /tmp/pca-live-eval.XXXXXX)
uv run python scripts/eval_live_provider.py \
  --provider ollama \
  --model qwen3:4b \
  --output-dir "$eval_root/ollama-qwen3-4b"
```

初次結果是 5/5。獨立 review 隨後抓到三個不能忽略的洞：untracked existing file 改了卻不會出現在 Git diff；`new_text` 可以塞 NUL 產生 `Binary files differ`；累積 patch 只檢 bytes，沒有檢總行數與 changed-file 數。修完並加入 regression tests 後，最終版本重新跑完整五次，仍是 5/5，耗時分別為 152.59、167.46、174.32、227.52 與 158.54 秒。每次 tool sequence 都包含 read、成功完成的 `replace_text` 與 pytest check，最後再由 harness 執行 mandatory verification。

1024-token turn bound 會被 Qwen 的 hidden reasoning 吃完，甚至在 8 steps 內來不及送 edit。最後把 Ollama preset 的有限上限調成 4096，同時保留 8-step 與 300 秒 task wall-time；final 5-run 沒有 truncated turn，但本機 4B 推理仍然慢，token usage 也有波動。這是應該保留的限制：**5/5 只證明這份 tiny-calculator manifest 在這台機器與這個 model config 下可重複完成，不代表 4B 模型能穩定處理任意專案。**

## 這次調整的真正意義

結果看起來是「多了一個 edit tool」，實際上是在決定 agent system 的責任分配。

模型負責判斷要改什麼；harness 負責把常見 action 變成窄合約，檢查 context 是否仍有效，限制寫入範圍，留下 patch，並重跑 deterministic verification。當 semantic decision 已經正確，卻反覆敗在機械格式時，改善 harness 比要求模型「再小心一點」更可靠。

這也沒有否定 unified diff。好的 agent toolset 不是只留一把萬用刀，而是讓 action 的表達能力和風險相稱。Exact replacement 解最小修改；unified diff 保留完整結構能力；未來 Cloudflare Sandbox 則處理現在 local runtime 仍缺少的 OS 與 network isolation。

---

## 參考資料

- [Pi coding agent custom tools](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent)
- [OpenCode source](https://github.com/anomalyco/opencode)
- [OMP / oh-my-pi source](https://github.com/can1357/oh-my-pi)
- [QuidProQuo：模型只是元件，harness 才是系統](https://quidproquo.cc/posts/ai/2026-08-10-model-component-harness-system)
- [QuidProQuo：Prompt Engineering 完整迭代指南](https://quidproquo.cc/posts/ai/2026-03-13-prompt-engineering-iteration-guide)
- [QuidProQuo：Auto-Dev Agent 的 15 道牆](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls)
