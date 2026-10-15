---
title: "Buffer Overflow: 堆疊溢出與 RCE 的技術原理"
date: 2026-10-15
category: tech
type: guide
difficulty: 中階
tags: [bug-bounty, security, buffer-overflow, stack, overflow, rce, exploitation]
lang: zh-TW
description: "Series 8：系統性解構堆疊溢出（Stack Buffer Overflow）原理，從關鍵位址、格式化字串、ROP 鏈到如何在 Bug Bounty 中報告 RCE 型態漏洞。"
tldr: "堆疊溢出是系統程式設置常見弱點，攻擊者可利用 EBP/RSP 變化、格式化字串印，或 ROP 鏈攻擊，將 Stack Overlfow 轉化為 RCE。Google VRP 獎金 $101,010（T0）→ $121,212（1.2x）。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 8
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-08-buffer-overflow-en)

## TL;DR

**堆疊溢出（Stack Buffer Overflow）是程式設師常見的錯誤：使用 `strcpy`、`gets()`、`scanf` 等函式時未檢查輸入長度，導致資料寫出固定緩衝區上下界。** 進階利用手法包括：
- **EIP/RSP 替換**：覆寫返回地址，強制程式返回惡意程式碼
- **格式化字串**：利用 `%n` 印出自身，其實際是 RCE
- **ROP 鏈**：在 ASLR/DEP 保護下，用已存之代碼串接攻擊
- **Google VRP 獎金**：T0 RCE 基礎 $101,010，1.2x 後為 $121,212

---

## 情境

你正在測試一個古老的 C/C++ 程式：`vuln.php` 僅模擬命令注入，實際的 Buffer Overflow 需要編譯執行。你在手頭有一個 `vuln.c`（示例），需要理解：
1. 為什麼 `strcpy(buffer, input)` 會崩潰
2. 為什麼返回地址被改寫後能執行惡意指令
3. 如何在 Bug Bounty 中寫出完整 PoC（包括輸入長度、觀察行為）

---

## 問題

**錯誤 1：** 使用者相信「若不用 root、無法做什麼」是不對的。堆疊溢出不管程式執行權限，都會在內核層級崩潰，而且在 Google VRP 中的 RCE 判定不區分權限（只要能執行指令）。
**錯誤 2：** 想直接跳到 exploit 編程（shellcode），但需要理解：
- 為什麼 EBP = 0xdeadbeef，EIP = 0x08048000
- 為什麼有人用 `%n` 做「格式化字串 HIJACK」
- 為什麼 ROP 鏈是「用已存之代碼串接」的技術

**錯誤 3：** 報告只寫「發現 Buffer Overflow」，沒有 PoC（例如填充 100 個 A 後 EIP 被改寫成 `0x41414141`）。

---

## 解決方案：堆疊溢出原理 + 測試

### 1. 基本概念

**堆疊結構（Stack Frame）**：
```
[ High Address ]
| 返 用 位 置 (EIP) | ← 用 strcpy 填滿 100 個 A，EIP = 0x41414141 (AAAA)
| 基 底 位 址 (EBP) | ← 函式呼叫前保留
| 局 部 變 數       | ← char buffer[64]; ← 這裡溢出
[ Low Address ]
```

當 `strcpy(buffer, input)` 的 input 長度 > 64，資料會寫入高位址，最終「抵達」作業系統保存的返回地址。

### 2. 測試步驟（Python + pwntools）

```python
# test_bof.py — 測試本機 Buffer Overflow
from pwn import *

context.arch = 'i386'  # 32-bit
# 這裡使用類比方式示範，實際應用於測試環境
buffer_size = 64
payload = b"A" * buffer_size + b"B" * 4  # BBBB = EIP
print(f"Payload length: {len(payload)}")
print(f"EIP will be overwritten with: {payload[buffer_size:buffer_size+4].hex()}")
```

### 3. 常見攻擊向量

| 向量 | 函式 | 機制 |
|---|---|---|
| **堆疊溢出** | `strcpy`, `gets()`, `scanf("%s")` | EIP 替換 → Shellcode |
| **格式化字串** | `printf(user_input)` | `%n` 印出目標地址 → 寫入任意值 |
| **整數溢出** | `malloc(n)` after `n * sizeof` | 計算錯誤 → 釋放過大空間 |

### 4. Google VRP 獎金分配（RCE）

| 等級 | 基礎獎金 | 品質係數 0.8x | 品質係數 1.0x | 品質係數 1.2x |
|---|---|---|---|---|
| **T0 高** | $101,010 | $80,808 | $101,010 | $121,212 |
| **T1 中** | $63,267 | $50,613 | $63,267 | $75,920 |
| **T2 低** | $1,337–$31,337 | $1,069–$25,069 | $1,337–$31,337 | $1,604–$37,604 |

---

## 為什麼會這樣：VRP 為什麼賞高溢出？

1. **權限提升機會**：若程式是 setuid root，堆疊溢出直接提升權限
2. **攻擊面廣**：C/C++ 程式支配龐大生產力（Linux kernel、嵌入式、網路應用）
3. **可重現性**：只要知道 buffer 大小與 EIP 位置，即可自動化測試

**重要**：Google VRP 的 RCE 評級不區分「提權」或「直接執行」，只要能證明「客戶端發送惡意輸入，無需人工干預即執行任意指令」即屬 RCE。

---

## 自我檢查（這篇重點：你懂堆疊溢出嗎？）

- [ ] 你能繪製 Stack Frame 圖（EIP、EBP、Local Variables）
- [ ] 你知道為什麼 `strcpy(buffer, input)` 會導致 EIP 被改寫
- [ ] 你了解「格式化字串」利用 `%n` 印出自身的機制
- [ ] 你知道 ROP 鏈的目的：在 DEP 保護下「串接」已存代碼
- [ ] 你能寫出 PoC（例如 `40A + 4B` → EIP = `0x41414141`）

---

## 參考資料

- [OWASP Buffer Overflow](https://owasp.org/www-community/vulnerabilities/Buffer_Overflows)
- [CTF Wiki — Stack Buffer Overflow](https://ctf-wiki.org/pwn/linux/user-mode/stackoverflow/introduction/)
- [pwntools 官方文件](https://docs.pwntools.com/)
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 版面](https://blog.google/security/vulnerability-reward-program-2024-in/)

---

*這篇是系列 8（堆疊溢出），前面：記憶體（7）；後面：VM（9）、Hyper-V（10）。*