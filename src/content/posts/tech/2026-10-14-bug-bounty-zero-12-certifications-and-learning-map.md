---
title: "Bug Bounty 要不要考證照：系列 0–14 的練習與學習地圖"
date: 2026-10-14
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, certification, career, owasp, learning-path]
lang: zh-TW
description: "依漏洞研究、求職與自學目標選擇練習和證照；用系列 0–14 的成果地圖安排下一步。"
tldr: "先完成可重現的練習報告，再依能力缺口決定課程或證照；證照不替你取得測試授權。"
draft: false
series:
  name: "從零開始的資安獵人"
  order: 14
---

> 🌏 [English version](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map-en)

## 先決定要練什麼，再決定要不要考

讀到系列第 14 篇，你已經看過規則、Web、工作台、報告，以及記憶體、虛擬機、TEE 與 AI 產品。接下來的問題是：要繼續練習，還是報名一張證照？

我的建議是先完成一份自己能重現的練習報告。用它找出缺的是網路基礎、漏洞理解、工具操作，還是解釋影響的能力，再決定需要什麼課程或考試。OSCP、Security+、CISSP 對應的學習與職涯目的不同，沒有一張是本系列所有讀者的必經之路。

證照也不會替你取得某個網站的測試授權。正式計畫的可測資產、禁止行為、參與與付款條件，要看該計畫當下的完整規則；這篇不替各計畫判定參與資格，也不估算賞金收入。

## 站內四篇證照文章怎麼用

四篇證照文原本從軟體開發者與安全平台建構者的需求出發。漏洞研究者可以沿用它們的比較方法，再依自己的目標選讀。

| 文章 | 優先看什麼 | 怎麼用在自己的決定 |
|---|---|---|
| [資安證照全景地圖](/posts/tech/2026-09-10-security-cert-landscape) | 基礎、攻防、應用安全與管理治理的分界 | 先選能力方向，不要把六類證照排成人人都要走完的階梯 |
| [AI 安全證照橫評](/posts/tech/2026-09-10-ai-security-cert-showdown) | 它如何區分防護 AI 系統與使用 AI 進行攻防 | 比較課綱是否包含你要練的威脅與實作；名稱有 AI 不等於適合你的目標 |
| [三大經典證照 ROI 拆解](/posts/tech/2026-09-10-security-cert-roi) | 準備時間、報名與維護成本的計算方式 | 為自己的時間與預算列帳；薪資估計不能直接當成賞金收入預測 |
| [台灣證照生態系](/posts/tech/2026-09-10-taiwan-security-cert-ecosystem) | 職缺與訓練資源的閱讀方式 | 求職時對照自己想投的職位；企業合規需求與測試授權分開判斷 |

想轉職，先找幾個你願意投的職缺，把要求的技能與證照分列。想練 Web 漏洞，先挑課綱與靶場是否符合需求。準備付款前，再回證照官方網站確認版本、費用與規則；本文不重列容易過期的價格與考試時數。

## 系列 0–14 的練習地圖

這張表依新版系列編號安排，檔名中的舊數字不代表目前篇次。每一列都有一個可留下的成果，方便判斷自己是不是真的做過。

| 篇次 | 主題與練習入口 | 留下什麼成果 |
|---|---|---|
| 0–1 | 總覽、規則與範圍：選一個計畫，只讀規則，不發送測試流量 | 一頁筆記：哪些資產可測、哪些方法禁止、哪裡仍不確定 |
| 2–3 | 網站與工作台：對自己的本機服務使用瀏覽器開發工具、攔截代理或 curl | 同一個請求在不同工具裡的對照，標出 Cookie、參數與回應 |
| 4 | XSS 與 IDOR：從 [PortSwigger Web Security Academy](https://portswigger.net/web-security) 的 XSS、Access control 題目選一題 | 說明哪一層缺少了哪個檢查，以及如何驗證修補 |
| 5 | RCE：在 Academy 選 OS command injection 題目 | 畫出輸入如何到達執行命令的邊界，解釋為什麼修補有效 |
| 6 | 報告與分流：用前一題的授權靶場練習寫報告 | 前置條件、重現步驟、觀察結果與影響，讓另一個人能照做 |
| 7–8 | 記憶體與溢位：重跑系列本機範例，再依程度選 [pwn.college](https://pwn.college/) 的教材與挑戰 | 記錄輸入、程式狀態與結果；指出溢位發生的位置 |
| 9–10 | VM、Hypervisor 與逃脫案例：重畫文章中的隔離邊界與公開案例路徑 | 區分 guest、host、受影響元件與漏洞前置條件，不把讀懂案例當成完成逃脫 |
| 11 | TEE 與機密運算：對照文章引用的架構資料 | 一張威脅模型：要保護誰的資料、信任誰、哪些攻擊不在保護範圍 |
| 12 | AI 產品漏洞計畫：閱讀目標計畫規則與 [OWASP LLM 風險清單](https://owasp.org/www-project-top-10-for-large-language-model-applications/) | 把風險類別、可測範圍與合格報告條件分成三欄 |
| 13 | 獎金地圖：回到各計畫官方獎勵頁 | 將最高金額與其必要條件一起記錄，不當成平均收入 |
| 14 | 證照與學習地圖：回顧上述成果 | 選一個缺口、一個資源與下一次檢查成果的時間 |

Academy 官方頁提供免費教材與互動靶場。pwn.college 官方頁說明其平台開放免費參與，並請學員不要公開挑戰的解答、攻略影片或直播。練習時遵守各平台規則；自己的筆記與可公開的作品要分開處理。

[OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) 也是可用的練習專案，適合在自己的環境依官方說明部署。它是刻意有漏洞的應用；部署前先確認存取範圍，避免把練習服務暴露給其他人。上述資源是入口，並不表示本文已逐題完成所有挑戰。VM 與 TEE 的這份地圖以閱讀、重畫與威脅模型為主，不承諾有適合每位新手的現成靶場。

## 三種目標，三個下一步

### 想轉職

1. 找幾個具體職缺，分列必要技能、加分證照與工作內容。
2. 選一個符合職務的靶場題目，做完後寫出能讓別人重現的說明。
3. 對照職缺與自己的缺口，再比較課程或證照的內容、成本與準備安排。

### 想弄懂原理

1. 從第 2–6 篇選一個本機例子，完整走過請求、漏洞與報告。
2. 想看底層，再接第 7–10 篇；先把前置概念與隔離邊界說清楚。
3. 用自己的話解釋一個修補為什麼有效。解釋不出來的地方，就是下次要補的內容。

### 想嘗試正式漏洞計畫

1. 先讀完整規則，確認目標、方法與個人參與條件；不確定的地方先向計畫確認。
2. 先在授權靶場把相關類型練熟，記錄自己的假設與證據。
3. 參照第 6 篇寫出報告結構，設定時間預算。若沒有證據支持漏洞，就不要把猜測寫成已確認的影響。

這三條路可以交錯走。證照能提供課綱或職涯訊號，練習成果能顯示你目前會什麼；兩者都不能保證找到新漏洞或獲得獎勵。

## 自我檢查

- [ ] 我能區分學習資源、證照要求與測試授權。
- [ ] 我有一份包含前置條件、重現步驟與影響的練習報告。
- [ ] 我能指出自己下一個要補的能力缺口。
- [ ] 如果要報名考試，我已查閱官方的當前版本與條件。
- [ ] 我沒有把最高獎金、職場薪資或拿到證照當成收入保證。

## 更新紀錄

- 2026-10-15：依新版系列 0–14 重整練習路線並同步英文；移除未支持的資格、免費書籍、虛擬機分類與固定備考時數說法，保留可操作的練習與證照選讀方向。

## 參考資料

- [PortSwigger Web Security Academy](https://portswigger.net/web-security)：免費教材與互動靶場入口。
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)：刻意有漏洞的開源練習專案。
- [pwn.college](https://pwn.college/)：練習平台、免費參與與分享解答的規則。
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)：辨識 AI 應用風險的閱讀入口。
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)、[Meta Bug Bounty Scope](https://bugbounty.meta.com/scope/)、[Microsoft Hyper-V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)：正式計畫規則入口；參與前須閱讀當前完整條款。
- [OffSec OSCP Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)：考試資訊入口；本文不主張 OSCP 是所有漏洞研究者的必要路線。
