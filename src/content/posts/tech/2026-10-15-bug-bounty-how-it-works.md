---
title: "從零開始的資安獵人：系列導讀——用白話走完 XSS、記憶體、VM 逃脫、TEE 與 AI 漏洞獎金"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, series-guide, beginner-guide]
lang: zh-TW
description: "從零開始的資安獵人系列導讀：15 篇完整路徑，從讀獎金規則、架工作台，走過 XSS、IDOR、RCE、記憶體漏洞、緩衝區溢位、VM/Hypervisor、Hyper-V 逃脫、TEE，再到 AI 產品漏洞獎金、獎金地圖查核與證照學習地圖。"
tldr: "這是 `從零開始的資安獵人` 系列（0 → 14）的閱讀入口。每篇用白話講一個決定，並附可驗證的官方來源，適合沒有資安背景的讀者。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 0
---

> 🌏 [English version](/posts/tech/2026-10-15-bug-bounty-how-it-works-en)

這篇是 `從零開始的資安獵人` 系列的閱讀入口。整個系列共 15 篇（第 0–14 篇），沿著一條弧線排列：**先讀懂計畫規則與獎金表，再架好可重現的工作台，從網站漏洞（XSS、IDOR）走到 RCE，接著往下層的記憶體、緩衝區溢位、虛擬機逃脫與 TEE，最後回到 AI 產品漏洞獎金與獎金地圖查核，收尾是證照與練習地圖。**

每篇只講一個決定，並附可驗證的官方來源；不教攻擊工具的濫用，也不鼓勵未授權測試。

## 這個系列在回答什麼

如果你打開 Google VRP、Meta Bug Bounty 或 Microsoft MSRC 的規則頁，會看到一堆名詞：In-scope、Out-of-scope、Rewards、Exceptions。這個系列幫你把長篇規則轉成能開始練習的計畫，並回答三個問題：

1. **哪些東西允許我測？** 看規則頁的 scope 與 exclusions，不假設、不碰猜。
2. **我怎麼把發現證明出來？** 用可重現的工作台與報告模板，讓審查者不靠猜測就能重現。
3. **這個發現大概值多少錢？** 對照各計畫的獎金表與實際判例，不要憑印象倒推漏洞價值。

## 這個系列不是什麼

- 不是滲透測試教學。不介紹攻擊工具怎麼跑、不教怎麼找真實目標的洞。
- 不是資安證照備考。第 14 篇會提證照，但本身不替代官方考綱。
- 不是鼓勵違法測試。所有範例都在本地練習伺服器或你有明確授權的目標上進行。

## 學習路徑

```
第 0 篇（本篇） → 第 1 篇 規則 → 第 2 篇 網站原理 → 第 3 篇 工作台
     → 第 4 篇 XSS/IDOR → 第 5 篇 RCE → 第 6 篇 報告與期望值
     → 第 7 篇 記憶體 → 第 8 篇 緩衝區溢位 → 第 9 篇 VM/Hypervisor
     → 第 10 篇 Hyper-V 逃脫 → 第 11 篇 TEE → 第 12 篇 AI 漏洞獎金
     → 第 13 篇 獎金地圖查核 → 第 14 篇 證照與學習地圖
```

編號是導覽順序，不表示讀完就通過了某種能力評量。前六篇是 Web 測試的完整流程，從第 7 篇開始進入較底層的系統漏洞，是較大的斷崖；建議先把前六篇讀通再決定要不要往下。

## 各篇總覽

### 第一階段：規則與工作台（第 0–3 篇）

**0. 系列導讀（本篇）**  
閱讀入口，說明 15 篇的脈絡、順序與邊界。

**1. [Bug Bounty 規則怎麼讀：Scope、Rewards、Exclusions 與回報條件](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)**  
讀懂規則頁的四個區塊：scope（允許測什麼）、rewards（發什麼錢）、exclusions（排除什麼）、reporting（要留什麼證據）。

**2. [按下連結後，瀏覽器和伺服器交換了什麼？](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work)**  
補上 HTTP、Cookie、Session 與輸入驗證的基礎，為後續找漏洞打下語彙。

**3. [漏洞獵人的工作台：抓請求、改參數、驗證權限](/posts/tech/2026-10-15-bug-bounty-hunter-workbench)**  
Burp Suite Community、瀏覽器 DevTools 與本地練習伺服器，讓你能重送同一個請求、每次只改一個輸入。

### 第二階段：網站漏洞與報告（第 4–6 篇）

**4. [網站最常見的兩種洞：XSS 與 IDOR，為什麼獎金差這麼多](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs)**  
XSS 與 IDOR 的原理、差異，以及同樣是瀏覽器端漏洞，為什麼 Google 對兩者的獎金差距那麼大。

**5. [Google 獎金表裡 RCE 為什麼最貴：Command Injection 與不安全反序列化](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce)**  
從「把使用者輸入拼進 shell 指令」到「不可信資料被還原成物件」，認出 RCE 的寫法與危險。

**6. [漏洞報告怎麼寫才拿得到全額：品質係數、一頁模板與期望值試算](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value)**  
報告模板、影響分析怎麼寫、低/中/高嚴重度的區分，以及整個測試流程值不值得花時間。

### 第三階段：底層系統漏洞（第 7–11 篇）

**7. [程式在記憶體裡怎麼跑：位址、stack、heap 與返回位址](/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory)**  
變數住哪、函式結束回哪，補上讀底層範例需要的 C 與記憶體觀念。

**8. [多寫幾個字元，為什麼可能讓別人控制程式：緩衝區溢位入門](/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow)**  
寫超長度資料覆蓋鄰近記憶體，如何控制程式流程，以及怎麼改成長度受限的呼叫。

**9. [虛擬機與 Hypervisor 是什麼：Hyper-V 獎金表的 L1、L2 各是哪一道牆](/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor)**  
虛擬機與 hypervisor 之間的邊界，Hyper-V 獎金表 L1/L2 各對應哪一層。

**10. [Hyper-V 逃脫案例拆解：CVE-2021-28476 從 guest 封包到 host 當機](/posts/tech/2026-10-13-bug-bounty-zero-08-hyper-v-escape-case-study)**  
真實、已修補、有公開技術分析的案例，看虛擬機逃脫的洞長什麼樣子。

**11. [TEE 與機密運算：WhatsApp 為什麼把 AI 放進連 Meta 都看不到的房間](/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing)**  
可信執行環境與機密運算，為什麼有些 AI 運算連平台本身都看不到內容。

### 第四階段：AI 漏洞獎金與學習地圖（第 12–14 篇）

**12. [AI 產品的 Bug Bounty 怎麼算：Google、OpenAI、Anthropic、Meta 的收件範圍與獎金對照](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty)**  
AI 產品獎金頁多半不收「模型說了什麼」（越獄、幻覺），收「模型被叫去對別人做了什麼」與產品周邊的傳統漏洞。

**13. [Bug Bounty 獎金地圖：Google、Hyper-V、Meta TEE、Apple 與 Mozilla 的價碼在付什麼](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)**  
逐格對過各計畫的上限與條件，把「最高幾十萬美元」這種數字放回脈絡裡讀。

**14. [Bug Bounty 要不要考證照：系列 0–14 的練習與學習地圖](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map)**  
證照的位置、系列 0–14 的練習路線，以及該怎麼繼續往下學。

## 須知

- **先授權，後測試。** 技術上成立的漏洞，若不在計畫 scope 內或已有重複報告，照樣不被接受。
- **範例僅在本地運行。** 系列內建立的 `shop.mjs` 練習伺服器只監聽 `127.0.0.1`，不碰真實目標。
- **不要憑印象算獎金。** 各計畫的獎金表與判例會變，評估發現時請看現行官方規則。

## 與本站其他系列的關係

這個系列偏「從零開始的實戰入口」，不深入研討單一技術。如果你讀完想往下鑽，可以接：

- **[資安證照攻略](/series/security-cert-prep)**：以官方考綱為主軸的證照備考路徑。
- **[私有語料管線](/series/private-corpus-pipeline)**：私有資料進入索引的生命週期，與第 12 篇 AI 漏洞獎金的資料外洩角度相呼應。
- **[AI 模型家族](/series/ai)**：個別模型家族的架構與授權，作為第 12 篇的補充背景。

## 怎麼讀

- **趕時間**：先讀第 0 篇（本篇）與第 1 篇規則，再直接跳到你關心的主題（例如第 12 篇 AI 漏洞獎金）。
- **想走完整個路徑**：按順序從第 0 篇讀到第 14 篇，每篇讀完可在文末檢查自己是否能用白話複述該篇的核心決定。
- **已經有基礎**：可跳過第 0–3 篇，直接從第 4 篇 XSS/IDOR 或第 7 篇記憶體開始。

每篇文末都附官方來源與延伸閱讀，想深入的讀者可以從那裡接軌。

## 參考資料

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) — 計畫範圍與獎勵條件。
- [Meta Bug Bounty 範圍頁](https://bugbounty.meta.com/scope/) — 無效報告原因、重複報告、獎金考量因素。
- [Microsoft MSRC Bounty](https://www.microsoft.com/en-us/msrc/bounty) — Microsoft 漏洞獎金計畫總覽。
- [PortSwigger — XSS 漏洞說明](https://portswigger.net/web-security/xss) — 跨站腳本（XSS）原理與防禦，對應系列第 4 篇。
- [OWASP — Buffer Overflow](https://owasp.org/www-community/attacks/Buffer_Overflow) — 緩衝區溢位攻擊與防禦，對應系列第 8 篇。
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation) — 工作台工具說明。
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — 刻意設計有漏洞的練習應用程式。
- [本系列英文版](/posts/tech/2026-10-15-bug-bounty-how-it-works-en)
