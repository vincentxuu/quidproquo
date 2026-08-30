---
title: "Rivumi 的 Skills、Blocking Hooks 與 Plugin Packages"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, skills, hooks, plugins]
lang: zh-TW
tldr: "Rivumi 把 skills 當成有界的 repository-local guidance、把 hooks 當成 opt-in 且只能否決的 host commands，再用 local plugin manifest 封裝 skill 與 hook；三者的權限完全不同。"
description: "拆解 Rivumi skills 的 discovery／projection、blocking hooks 的 fail-closed gate，以及 local plugin package 的 manifest、install 與能力邊界。"
series:
  name: "Rivumi 架構拆解"
  order: 15
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-skills-hooks-plugins-en)

[上一篇](/posts/tech/2026-08-30-rivumi-native-mcp-authorization)讓外部 MCP capability 進入 ToolExecutor。Repository-local 擴充還有另一組名詞：skill、hook、plugin。它們會一起被載入，卻不共享同一種權限。

## Skill 只改變模型看見的 guidance

[Rivumi](https://github.com/vincentxuu/rivumi)從 `.rivumi/skills/*.md` 找 skill。檔案必須是 regular、非 symlink 的 UTF-8 Markdown，frontmatter 只接受 `name` 與 `description`；檔案數、單檔大小和最後注入 context 的總長度都有上限。指定 skill 時採 exact name，unknown 或 duplicate 直接報錯。

解析後的內容會明確標成 repository-local guidance，優先序低於 system、developer、permission 與 tool safety rules。Native loop 把它放進 initial context；external runner 收到 resolved bundle 與 `skill-resolution.json`。Skill 能教模型怎麼做事，不能憑空增加 tool 或放寬 permission。

## Hook 是 opt-in 的 blocking gate

`.rivumi/hooks.json` 可以在 approval request、tool 前後、compaction 前後執行 exact argv command。Rivumi 對 timeout、argv、輸出量與環境做限制，並把事件 payload 送到 stdin。專案 hook 預設不執行，必須設定 `RIVUMI_ENABLE_PROJECT_HOOKS=1`。

Hook 的語意是 deny-only。輸出 `allow` 只代表「這個 hook 不反對」，不能跳過 permission policy；timeout、nonzero exit、格式錯誤或 runner exception 都 fail closed。pre-tool denial 能擋住執行，post-tool denial 只能記錄已發生的問題，無法把剛才的 side effect 倒轉。

還有更務實的風險：hook command 在 host 執行，cwd 是 source repository。opt-in 代表信任這段程式本身；deny-only 約束的是它對 Rivumi lifecycle 的判斷，不會阻止 hook command 自己改檔案或做其他 side effect。

## Plugin 是本機 package，不是 marketplace

Plugin manifest 位於 `.rivumi/plugins/*.json`，可以列出 description、discovery metadata、skills 與 hooks。Referenced skill path 必須留在 repository 裡，不能走 symlink 或 path escape；plugin skill 以 `<plugin>.<skill>` namespace 載入，plugin hooks 則接在 project hooks 後面。

`rivumi plugin install` 接受 local manifest path，複製 manifest 與 skill files 到專案；重複名稱預設拒絕，除非明確 overwrite。載入 JSON manifest 本身不執行 plugin code。

```text
skill markdown -> bounded prompt guidance
hook argv      -> opt-in, deny-only lifecycle gate
plugin JSON    -> local packaging for skills + hooks
```

目前實作沒有 remote registry、signature verification、dependency solver、lockfile、update／uninstall，也不把 arbitrary executable payload 或 MCP server 包進 plugin。稱它為「本機 package format」比「plugin marketplace」準確。

這三層解決的是不同問題：skill 提供做法，hook 在 lifecycle 上加一道否決，plugin 整理與發現前兩者。把權限分開看，才不會誤以為安裝一份 Markdown 等於授予執行權。[下一篇](/posts/tech/2026-08-30-rivumi-subagent-scheduling)會看 Rivumi 如何把分析交給隔離的 child agent，同時把修改權留在 parent。

---

## 參考資料

- [Skill discovery and context projection](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/skills.py)
- [Blocking hook runner](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/hooks.py)
- [Plugin manifests and local installation](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/plugins.py)
- [Native loop hook integration](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [Skill, hook, and plugin tests](https://github.com/vincentxuu/rivumi/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
