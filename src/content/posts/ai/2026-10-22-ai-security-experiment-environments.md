---
title: "選你的 AI 資安練習環境：本機、雲端、CTF 與授權目標"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, security, ai-agent]
lang: zh-TW
description: "依實驗問題選擇本機、CTF、自架雲端或授權系統，用工單案例學會保留版本、初始狀態與判準，附離線環境紀錄檢查程式。"
tldr: "想查程式判斷就用可重設的副本，想查部署邊界就保留雲端條件，想驗真實系統就對齊專案範圍。換環境時保留問題與判準，重新記錄改變的條件。"
difficulty: 入門
draft: true
series:
  name: "AI 資安實戰"
  order: 3
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-experiment-environments-en)

你已經在自己的電腦上測過工單權限。下一步想讓 AI 幫你找漏洞，該搬到雲端、挑一道 CTF，還是直接測公司允許的系統？

選擇取決於你要回答的問題。若想知道「後端少了一條擁有者判斷會怎樣」，小型副本就夠；若想知道「部署後，閘道傳進來的身分會不會被錯認」，就要把相關部署條件放進實驗。兩者測到的東西不同。

這篇接續[漏洞證據篇](/posts/ai/2026-10-22-ai-security-vulnerability-evidence)，需要你能閱讀 JSON、執行 Python，並理解允許與拒絕的對照。讀完會得到一份可供重跑的環境紀錄；你可以從任一種環境開始。本機是其中一個選項，系列的攻擊實作也會涵蓋雲端與授權目標，整體路線見[系列總覽](/posts/ai/2026-10-22-ai-security-overview)。

## 先選要保留的條件，再選平台

下表是選擇起點，不是能力排名。環境越接近正式系統，你通常越難隨意重設資料、修改程式或取得完整日誌。

| 環境 | 最適合回答 | 需要另外記下的差異 |
|---|---|---|
| 本機自有副本 | 某條程式路徑能否重現漏洞、修補是否有效 | 是否省略認證閘道、網路隔離或真實模型 |
| 指定 CTF／訓練實例 | 能否依題目線索辨識並驗證一類漏洞 | 題目版本、分配的實例、成功判準、平台規則 |
| 自架雲端副本 | 部署身分、網路與工具權限如何影響結果 | 映像版本、服務設定、連線範圍、用量與清理方式 |
| 經授權系統／Bug Bounty | 真實配置下，允許的測試是否顯示產品風險 | 目標與動作範圍、測試帳號、自動化規則、可取得的證據 |

[PortSwigger Web Security Academy](https://portswigger.net/web-security)提供可互動的線上實驗室；[Stanford 的 Cybench](https://crfm.stanford.edu/2024/08/19/cybench.html)則把 CTF 題目、任務目標與子任務放進評估框架。兩者能幫你練習辨識漏洞，卻沒有替你的工單產品決定「誰可以讀哪份資料」。產品測試仍要先寫自己的政策。

雲端也能做可重設的實驗。[Meta 的 CyberSecEval 雲端靶場文件](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift)描述攻擊端與目標端的配對、網路條件，以及每輪使用已知初始狀態的做法。這個例子說明：雲端實驗可以有明確起點。它不是把任意公開主機當成靶場的理由。

## 同一個工單問題，搬過去時改什麼？

沿用前面的自製案例：Alice 與 Bob 屬於 `north`，Carol 屬於 `south`；N-1、N-2、S-1 分別由 Alice、Bob、Carol 擁有。政策是「同租戶且本人擁有，才可讀取」。先固定 Alice 讀 N-1 應允許，讀 N-2 與 S-1 應拒絕；拒絕時不得回傳工單內容。

**從本機搬到自架雲端時，先保留合成資料與這三個判準。** 記下應用程式版本，再加入實際經過的認證閘道、服務身分與網路設定。若本機拒絕、雲端卻回傳 N-2，先比對兩邊最後交給後端的操作身分與政策版本。你要找出新增條件在哪裡改變判斷，不急著把差異歸給模型。

若改選 CTF，就換成題目本身的資源與判準。例如 PortSwigger 的[使用者 ID 由請求參數控制實驗](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter)提供自己的帳號，要求取得題目指定使用者的 API key。你練的是「改資源識別值後，後端有沒有再次授權」這個問題；不需要、也通常無法把 Alice 的整套工單資料塞進訓練平台。完成該題只支持這個實例的結果，不能推出你已驗過跨租戶隔離。

換到經授權的真實產品時，先確認專案允許哪些帳號與資源的對照測試。若能建立兩個自己的測試帳號，就用它們的合成資料重做對照；若只允許單一帳號，也無法取得另一帳號資源，便把「跨帳號判準未測」寫進結果。缺少條件時縮小結論，比把未知補成「安全」更有用。

## 目標在範圍內，自動化還要另看規則

環境紀錄中的範圍（scope）要回答：**哪個目標、哪些動作、依據哪份規則？** 「公司同意測試」太寬；「指定測試站的工單讀取 API，以兩個核准帳號做權限對照」才對得上接下來的動作。

[HackerOne 的 Safe Harbor 說明](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq)明確區分保護聲明與目標範圍：採用 Safe Harbor 不會改變專案列入的資產。拿到測試帳號，也要對照專案對測試方式的要求。

AI 參與程度同樣要寫清楚。讓模型閱讀你提供的程式碼、提出測試假設，和讓 Agent 連續呼叫目標，是兩種不同的行為。[HackerOne 的行為準則](https://www.hackerone.com/policies/code-of-conduct)要求 AI 輔助活動符合各專案範圍與測試限制，包括自動化、請求量及速率。因此不能從「平台歡迎 AI」推論「每個專案都接受自動測試」。未說清楚時，先釐清該動作，再啟用連線執行。

自架雲端則要把副本和其他服務分開記錄。你能修改自有應用程式，不代表相連的寄信服務、模型 API 或共享基礎設施都包含在同一次測試。最直接的做法，是在副本用合成資料與測試替身，逐項開放這次真的要驗的整合。

## 寫一份下次能重跑的紀錄

[下載環境紀錄範例](/examples/ai-security/experiment-manifest.json)。這份 JSON 把內容分成五組，值都是自製本機案例，不含真實帳密：

| 欄位 | 記下什麼 | 工單例子 |
|---|---|---|
| `scope` | 精確目標、允許動作、依據與自動化規則 | 離線工單資料；只測 `read_ticket` |
| `recipe` | 版本、資料起點與觀測方法 | owner-only 政策；三位使用者；保存預期與實際決定 |
| `success` | 允許對照、拒絕對照、漏洞成立條件 | Alice 只能取得 N-1；取得 N-2 或 S-1 才符合本例漏洞判準 |
| `limits` | 執行模式、請求數、時間、費用上限 | 自製離線例子只跑三案，不呼叫付費模型 |
| `recovery` | 何時停止、如何回到起點 | 超出三案即停；丟棄記憶體資料後重建 |

`environment` 另外標明環境種類。版本先記到能找回相同程式與設定的程度，例如 commit、映像摘要及設定快照位置；範例的 `ticket-fixture-v1` 只是教學標籤。使用模型時，在版本紀錄補模型識別值、提示與工具版本，並保存每次實際輸入輸出。即使參數相同，模型輸出仍可能變動；重跑的目的是讓差異能被解釋。

起始狀態也包含上輪留下的痕跡。若上一輪已讀過資料、改過權限或建立快取，下一輪就可能走不同路徑。自架副本可還原快照或重建合成資料；共享訓練實例則依平台的重設方式操作。真實產品若不能重設，就記錄觀測時間與已知變動，不承諾逐位元重現。

請求數與費用是你替本次實驗設定的界線，範例數值不是平台配額。在雲端或模型服務上，另把計費項目與監控位置記入 `observation`，設定執行端會遵守的停止條件。預算通知只告訴你發生了什麼；真的要停止，仍需中止工作與清理相關資源。

## 跑離線檢查，再由人讀一次

[下載 Python 檢查程式](/examples/ai-security/experiment-preflight.py)，和 JSON 放在同一資料夾。用 Python 3.11 以上執行：

```bash
python3 experiment-preflight.py experiment-manifest.json
```

範例會印出：

```text
PASS: record checks only; authorization, safety and reproducibility are unverified.
```

程式只讀本機 JSON，不會掃描目標、連線或部署。它會攔下缺少目標、版本、判準的紀錄，也會攔下「禁止自動化，卻選擇自動執行」的矛盾。空白字串、負數費用、沒有請求上限等情況也會失敗。

你可以把 JSON 的 `scope.automation` 改成 `forbidden`，保留 `limits.mode` 為 `automated`，再跑同一條指令：

```text
FAIL: automated run requires explicit automation allowance
```

程式會以退出碼 `1` 表示檢查失敗。這時應讓執行模式符合真實規則；不能只為通過檢查，把許可欄位改成 `allowed`。

**通過只表示這些紀錄檢查通過。** 它無法證實授權文件真假、文字是否具體、配額是否合理，也無法驗證網路隔離與停止機制真的存在。把 `version` 填成「最新版」仍可能通過，所以最後要由人問：其他人能不能依這個值找到同一版本？把 `finding` 填成「AI 說有漏洞」也不會自動變成有效證據。

今晚就能做的練習是：選一種你能使用的環境，把範例改成自己的目標與判準，跑一次檢查，接著照紀錄重述完整實驗。若說到某一步必須靠記憶補充，就把那個條件補進對應欄位。

## 自我檢查：換了環境，結論能跟著搬嗎？

1. 本機用固定假身分，雲端改由閘道帶入身分，結果不同。能直接說模型不穩定嗎？
2. CTF 已完成指定帳號的 API key 題目，能說工單助理的租戶隔離通過嗎？
3. JSON 通過，但專案只寫人工測試，是否能直接開 Agent？
4. 真實系統拿不到後端日誌，還能留下什麼？

判準如下：第一題先比對身分來源與政策，不把部署差異混進模型結論。第二題只完成該題指定的授權案例。第三題要讓實際模式符合專案規則，不能用檔案檢查結果取代許可。第四題保留可取得的請求、回應、時間、測試帳號及預期政策，明示無法確認的後端路徑；不為了湊完整證據擴大存取。

你現在應該有一份能指向具體目標、說明起點與判準的紀錄。接著看[第 4 篇：AI 如何讀懂目標與整理攻擊面](/posts/ai/2026-10-22-ai-security-attack-surface)，在這個範圍內，把文件與介面轉成可驗證的假設。

## 更新紀錄

- 2026-10-22：補上攻擊面篇的閱讀連結。本次僅更新導覽，沒有重新查證原有外部主張。

## 參考資料

- [PortSwigger：Web Security Academy](https://portswigger.net/web-security)
- [PortSwigger：User ID controlled by request parameter](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter)
- [Stanford CRFM：Cybench](https://crfm.stanford.edu/2024/08/19/cybench.html)
- [Meta：Autonomous Offensive Cyber Operations](https://meta-llama.github.io/PurpleLlama/CyberSecEval/docs/benchmarks/autonomous_uplift)
- [HackerOne：Safe Harbor Overview & FAQ](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq)
- [HackerOne：Code of Conduct](https://www.hackerone.com/policies/code-of-conduct)
