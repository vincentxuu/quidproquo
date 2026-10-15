---
title: "How Programs Use Memory: The Foundation of Buffer Overflow"
date: 2026-10-15
category: tech
type: guide
difficulty: intermediate
tags: [bug-bounty, security, memory, buffer-overflow, programming, python]
lang: zh-TW
description: "Series 7: Understand how programs allocate memory (heap, stack) and why buffer overflows occur — the foundation for vulnerability discovery."
tldr: "Memory layout explains vulnerabilities: stack overflows corrupt execution flow; heap overflows corrupt data; understanding both helps find RCE and buffer overflow bugs."
draft: false
series:
  name: "從零開始的資安獵人"
  order: 7
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-07-how-programs-use-memory-en)

## TL;DR

**理解程式記憶體配置（Heap / Stack / BSS / Data / Text），才能理解漏洞為什麼發生。** 本篇介紹：
- Stack：自動分配，容量有限，溢出可覆寫返回地址 → RCE
- Heap：動態分配，需手動釋放，溢出可破壞相鄰資料 → 資料竊取或邏輯錯誤
- **範例**：Python `bytearray` 與 `ctypes` 操作，以及簡單的 C `strcpy` 安全問題
- **與後續文章關聯**：文章 8（Buffer Overflow 深入）、記事 9（VM / Hypervisor）、記事 10（Hyper-V 逃逸）

---

## 情境

你正在學習如何在 Bug Bounty 計畫中搜尋深層漏洞。你已經掌握 XSS / IDOR / RCE 的基本概念，但需要理解**為什麼 RCE 能發生**：其根源往往是記憶體溢出（Buffer Overflow）或不安全的記憶體操作。理解記憶體結構，是從「發現漏洞」到「理解影響」的關鍵一步。

---

## 問題

**錯誤 1：** 只知道「漏洞存在」，但不知道是「堆疊溢出」還是「堆疊溢出」。這直接影響報告的 CVSS 評分與修補建議。
**錯誤 2：** 沒有理解記憶體分配機制（Stack / Heap / BSS / Data / Text），導致無法判斷漏洞的影響範圍（例如：是否可覆寫返回地址？是否可竊取相鄰資料？）。
**錯誤 3：** 直接測試真實目標，缺乏本地記憶體檢測工具（例如 Python `ctypes` 或 GDB）。

---

## 解決方案：記憶體結構 + 範例

### 記憶體區塊

| 區塊 | 功能 | 風險 |
|---|---|---|
| **Text** | 程式碼（可執行指令） | 通常只讀，無直接寫入風險 |
| **Data / BSS** | 全域變數（已初始化 / 未初始化） | 全域資料可被覆寫，影響邏輯 |
| **Heap** | 動態分配（`malloc` / `new`） | 溢出可破壞相鄰物件（資料竊取 / 邏輯錯誤） |
| **Stack** | 函式呼叫（參數 / 區域變數 / 返回地址） | 溢出可覆寫返回地址 → RCE |

### Python 簡易範例：Buffer Overflow 模擬

```python
# memory_example.py — 安全測試，僅在本地執行
# 目標：理解堆疊操作

# Stack 模擬：固定容量陣列
buffer = bytearray(8)  # 固定容量 8 bytes
try:
    # 嘗試寫入超過容量（會引發 IndexError，不直接溢出，但說明概念）
    buffer[10] = 65  # 這會拋出錯誤
except IndexError:
    print("Index out of range — buffer overflow prevented by Python bounds")

# Heap 模擬：使用 list 動態分配
items = ["A", "B"]
items.append("C")  # 動態擴展
print(f"Heap-like list: {items}")
```

> ⚠️ 這只是概念示範，真實的 Buffer Overflow 需要 C/C++ 編譯環境與 GDB，建議在虛擬機中測試。

---

## 為什麼會這樣：記憶體與漏洞的關聯

1. **Stack Overflow** → 覆寫返回地址 → 攻擊者可控制流程 → **RCE**
2. **Heap Overflow** → 破壞相鄰物件 → 資料竊取 / 邏輯錯誤 → **資料外洩**
3. **BSS / Data 溢出** → 全域資料被覆寫 → 影響程式邏輯 → **邏輯漏洞**

**Bug Bounty 影響**：RCE 最常由 Stack Overflow 導致（例如 `strcpy` 未檢查長度），而資料竊取多由 Heap Overflow 導致（例如 `malloc` 後未檢查邊界）。

---

## 自我檢查（這篇重點：你理解記憶體結構嗎？）

- [ ] 你能說出 Stack / Heap / Data / BSS / Text 的差異
- [ ] 你知道為什麼 Stack Overflow 最容易導致 RCE
- [ ] 你能用 Python `bytearray` 自行測試固定容量限制
- [ ] 你理解「覆寫返回地址」是 RCE 的核心機制
- [ ] 你已閱讀文章 8（Buffer Overflow 深入），準備進一步學習

---

## 參考資料

- [OWASP Buffer Overflow](https://owasp.org/www-community/vulnerabilities/Buffer_Overflows)
- [CTF Wiki — Buffer Overflow](https://ctf-wiki.org/pwn/linux/user-mode/stackoverflow/introduction)
- [Python ctypes documentation](https://docs.python.org/3/library/ctypes.html)
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)

---

*這篇是系列 7（記憶體），前面：報告（6）、RCE（5）、XSS/IDOR（4）；後面：Buffer Overflow 深入（8）、VM（9）、Hyper-V（10）。*