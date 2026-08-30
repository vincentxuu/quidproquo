---
title: "Rivumi 的 permission layering：危險命令如何落到 allow、ask 或 deny"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, permissions, command-policy, security]
lang: zh-TW
tldr: "Rivumi 先套不可繞過的 critical floor，再評估 user／org／project deny，最後才看 allow。dangerous mode 只自動放行 read/modify，execute 仍經過命令分類與 approval；這是 authority policy，不是 OS sandbox。"
description: "拆解 Rivumi 的 permission source 合併、critical／suspicious 命令分類、session approval 與 dangerous mode 邊界。"
series:
  name: "Rivumi 架構拆解"
  order: 9
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-permission-layering-en)

[tool executor 專篇](/posts/tech/2026-08-23-rivumi-tool-isolation)回答 path、argv、env 與 timeout 怎麼被機械限制。這是 coding-agent security boundary 的其中一層；本篇換一個問題：當呼叫本身符合 tool schema，誰有權決定它可以執行？

## Deny 比來源遠近更重要

Rivumi 把 permission rules 分成 user、organization 與 project 三個來源，再以固定順序合併：

```text
critical command floor
user deny → org deny → project deny
user allow → org allow → project allow
otherwise follow approval mode
```

這個順序不能讀成「project allow 可以蓋過 user deny」。所有 deny 都先於所有 allow；只要任一來源拒絕，後面的 allow 不會翻案。來源順序保留的是診斷與稽核脈絡，衝突的安全語意仍是 deny wins。

rule 可以鎖定整個 tool、tool 下的 prefix，或 exact target。解析器會拒絕空白、模糊或不合法格式，避免一條看似有效但其實沒有 match 的規則悄悄進入設定。

## 命令先經過 critical 與 suspicious 分類

execute tool 還會通過 `classify_command_policy()`。空命令直接 deny；critical pattern 直接 deny；suspicious pattern 通常 ask，若同時要求過長 timeout 則 deny；其他命令才是 allow。critical floor 會在 session grant 或互動提示之前執行，因此先前按過「本 session 允許」也不能重用來越過它。

這個 classifier 是 bounded lexical policy，並不具備完整 shell parser 的能力。它能擋住已知高風險形狀，卻不能證明所有 shell composition 都安全。Native `run_check` 還有獨立 exact-argv allowlist；兩者不該混成一項保證。

## Approval 是有生命週期的決定

需要詢問時，approval request 對應一個 tool call 或一個 command。使用者可以 allow once、allow for session、deny 或 cancel。session grant 只在目前 session 重用；中斷中的 approval 會被標成 abandoned 並 fail closed，不會在 resume 後預設同意。

headless 執行沒有互動對話框，因此必須依明確 policy 決定 allow 或 deny。非 TTY 的 dangerous 啟動也需要額外 acknowledgement，避免一個方便旗標在 CI 裡無聲擴權。

## Dangerous mode 沒有取消 execute policy

`dangerous` 這個名稱很容易被理解成「全部允許」。Rivumi 實際上只對 read 與 modify 提供 auto-allow；execute 仍要經過 command classifier、deny/allow rules 與 approval mode。以 root 身份要求 dangerous local execution 時，沒有 sandbox 會被拒絕。

更重要的是，permission guard 只做 authority decision：誰允許這個動作。它不隔離 filesystem、process 或 network。真正把通過 policy 的 command 包進作業系統限制，是 [下一篇 local OS sandbox](/posts/tech/2026-08-30-rivumi-local-os-sandbox)的工作。

---

## 參考資料

- [permission policy source](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/permissions.py)
- [approval contracts](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/approvals.py)
- [permission tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_permissions.py)
- [approval tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_approvals.py)
