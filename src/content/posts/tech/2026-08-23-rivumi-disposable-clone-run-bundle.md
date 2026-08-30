---
title: "Rivumi 的 disposable workspace 與 run bundle：原始 repo 為什麼不會被直接修改"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, git, sandbox, artifacts]
lang: zh-TW
tldr: "Rivumi 先把指定的完整 Git commit 複製到 run directory 裡的 detached-HEAD workspace，再讓 runtime 修改與驗證。原始 repo、執行 workspace 與 run artifacts 因此有清楚邊界；這能提供 source isolation 與 audit bundle，但不等於 OS sandbox。"
description: "追蹤 Rivumi 從 pinned source commit 建立 disposable workspace，再產生 request、events、patch、verification 與 result artifacts 的完整資料流。"
series:
  name: "Rivumi 架構拆解"
  order: 2
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-rivumi-disposable-clone-run-bundle-en)

使用者從 TUI 送出任務後，Rivumi 不會直接把 agent 放進目前開著的 repo。`AgentRunner.run()` 先固定 base commit，再交給 `LocalGitWorkspace.prepare()` 建立一次性的 workspace。這篇追兩件事：程式碼實際在哪裡被改，以及 run 結束後有哪些檔案可供檢查。

## 三個位置，三種責任

```text
source repository
    │  resolve exact base SHA; read only
    ▼
run_dir/workspace/        run_dir/
detached-HEAD clone       request.json
patch / test / verify     events.jsonl
                         session.json
                         checkpoint.json
                         changes.patch
                         verification.json (native)
                         result.json
```

source repository 是輸入；`workspace/` 是 runtime 的工作區；run directory 其餘檔案是 audit 與 resume 用的 bundle。把三者拆開後，取消任務不需要回復使用者原本的 dirty worktree，檢查結果也不依賴「agent 跑完後還沒有人動過 repo」。

## `prepare()` 如何固定輸入

`LocalGitWorkspace` 建立時要求 `base_sha` 是完整 40 字元 commit SHA，`workspace_name` 只能是一段相對名稱。`prepare()` 接著依序做：

1. 解析 source 的真實路徑，拒絕把 run directory 放進 source repository。
2. 用 `git rev-parse --verify <sha>^{commit}` 確認指定 commit 確實存在且完全相符。
3. 執行 `git clone --no-hardlinks --no-checkout`，避免 workspace 與 source 共用 hard link。
4. `git checkout --detach <sha>`，最後再次比對 workspace 的 `HEAD`。

任何一步失敗都拋出 `WorkspacePreparationError`，loop 不會在「大概是那個版本」的目錄繼續執行。這就是本篇的 fail-closed 邊界：錯誤 SHA、已存在的 workspace、source 裡面的 run directory，或超過準備期限，都在第一個 tool call 之前停止。

`tests/test_runtime.py` 的 `test_disposable_workspace_is_pinned_to_commit_not_dirty_source` 驗證 dirty source 中未提交的內容不會混進 clone；`test_disposable_workspace_keeps_source_unchanged_and_produces_patch` 則比較執行前後的 source，並確認改動只出現在 workspace 與 patch artifact。

## Run bundle 回答不同問題

workspace 保存可執行狀態，run bundle 保存可檢查狀態。下表是 native run 的主要 artifact；external runner 共用 request、events、patch 與 result 等核心檔案，但不保證產生相同的 native `verification.json` layout。

| 檔案 | 回答的問題 |
|---|---|
| `request.json` | 這次任務、allowed paths、verification 與 pinned SHA 是什麼？ |
| `events.jsonl` | 每個 model、tool、approval 與 verification 事件依什麼順序發生？ |
| `session.json` | resume 所需的 messages、usage、step、sequence 與 lease 狀態是什麼？ |
| `checkpoint.json` | 可恢復 checkpoint 的狀態與版本是什麼？ |
| `changes.patch` | workspace 相對於 base commit 最後改了什麼？ |
| `test.log` / `verification.json` | 驗證跑了哪些命令，輸出與結論是什麼？ |
| `result.json` | run 的 status、terminal reason 與 artifact map 是什麼？ |

`result.json` 不是唯一真相的替代品。若要重建過程，要讀 event journal 與 session state；若只要 review patch，則從 `changes.patch` 開始。後續 state-first journal 專篇會再處理 crash recovery、replay 與 fork。

## Source isolation 不等於 OS sandbox

disposable workspace 保證「不要直接改 source repo」，但單靠 clone 不能限制程序讀取 host 檔案、連線到網路或使用目前帳號的作業系統權限。Rivumi 另有 path policy、permission layering 與 OS sandbox backend；它們是不同層的保證。

因此，本地 clone 適合把 trusted repository 的修改與 artifacts 隔開，不該被描述成 hostile-code containment。遇到不可信 verification command，應由後續的 tool boundary、permission 與 OS sandbox 專篇回答，而不是替 `LocalGitWorkspace` 加上它沒有的能力。不同 coding agent 如何選擇 sandbox，可參考 [Codex CLI 的產品與架構介紹](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)；這裡只確認 Rivumi 自己的 source boundary。

## 目前沒有什麼

這套設計沒有保證每次 clone 都便宜，大型 repository 仍會付出複製成本。artifacts 也不會自動成為可重現 build，dependency registry、外部服務與時間都可能造成漂移。它提供的是 pinned Git input、隔離的修改位置與固定 audit layout。

[下一篇](/posts/tech/2026-08-30-rivumi-prompt-instructions-memory)會追模型最後看到的 prompt、instruction precedence 與 explicit memory；native loop 則在 order 4 才開始，避免把 workspace 準備與 model turn 混在一起。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——`LocalGitWorkspace`、`AgentRunner` 與 focused tests 的 ground truth
- [Git `clone --no-hardlinks`](https://git-scm.com/docs/git-clone)——workspace 不共用 local hard links 的旗標語意
- [Git detached HEAD](https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt---detach)——pinned checkout 的 Git 語意
- [Reproducible Builds](https://reproducible-builds.org/)——可重現輸入與環境控制的背景原則
