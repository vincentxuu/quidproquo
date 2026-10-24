---
title: "AI 寫好 Patch，還要驗證什麼？"
date: "2026-10-22"
type: "guide"
category: "ai"
tags: ["ai-security", "security", "ai-agent", "authorization"]
lang: "zh-TW"
description: "用同一工單漏洞比較租戶修補、owner 修補與全部拒絕，建立攻擊、功能、掃描與目標版本四層驗收。"
tldr: "修補要同時擋住越權、保留正常功能，並在實際目標重跑。告警消失和本機副本通過，各自只能證明其中一部分。"
difficulty: "進階"
draft: false
series:
  name: "AI 資安實戰"
  order: 18
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-patch-verification-en)

AI 替 F-17 補上租戶檢查，跨公司的測試失敗了，看起來修好了。可是 Alice 讀 Bob 的 N-2 仍成功。另一個建議更乾脆：全部回 403。漏洞確實不能利用，客服也不能工作了。

這篇接續[審碼篇](/posts/ai/2026-10-22-ai-security-code-review)，教你驗收修補，適合會跑測試但不確定安全測試該涵蓋什麼的開發者。讀完會留下修補前後矩陣、未涵蓋項目及目標版本。前面的四候選是教學示意，由 `analyst-demo.py` 實跑；後面另以真模型生成修補並測試。

## 先把「修好」拆成四個問題

先問攻擊是否被擋，再問原功能是否保留。接著重跑原本的掃描，最後確認測的是待交付版本。這四項互相補足，不能拿其中一項代替全部。

[GitHub Autofix 的驗收方式](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning)也分開檢查原告警、新告警、語法問題與既有測試結果。文件另指出修補可能只處理部分漏洞或改變程式語意。這裡將產品特有的 owner-only 政策加入測試，因為通用掃描不知道你們的工單共享需求。

| 驗收層 | 所需證據 | 單獨通過仍可能漏什麼 |
|---|---|---|
| 攻擊回歸 | Alice 讀 N-2、S-1 都拒絕且沒有資料 | 所有請求都被拒絕 |
| 原功能 | 三位 owner 都能讀自己的工單 | 其他人也能讀 |
| 掃描與程式檢查 | 原掃描、新告警、語法結果 | 未建模的產品規則 |
| 實際目標 | build、fixture、HTTP 回覆 | 其他節點、舊快取、未測入口 |

本文實跑函式矩陣；沒有執行 CodeQL 或其他完整靜態掃描。表格中的掃描與實際交付版本檢查，是產品驗收時要補的證據。

## 下載同一組範例，跑四個候選

將[analyst-demo.py](/examples/ai-security/analyst-demo.py)與[analyst-truth.json](/examples/ai-security/analyst-truth.json)放在同一資料夾。使用 Python 3.10 以上，無額外套件。以下命令在該資料夾執行；專案內的位置是 `public/examples/ai-security`。

```bash
python3 analyst-demo.py matrix --implementation vulnerable > before.json
python3 analyst-demo.py matrix --implementation tenant-patch > partial.json
python3 analyst-demo.py matrix --implementation owner-patch > after.json
python3 analyst-demo.py matrix --implementation deny-all > broken-feature.json
python3 analyst-demo.py selftest
```

`passed` 預期依序為 6、10、12、9，`total` 都是 12。它們是本例有限矩陣的符合格數，不是漏洞檢出率，也不是模型修補成功率。

不要只看最後的總分。打開 partial.json，找到 Alice/N-2 與 Bob/N-1：兩格的 `expected_status` 是 403，實際 `status` 是 200，body 還在。這就是跨租戶測試通過後仍留下的同租戶問題。

再看 broken-feature.json：三個 owner 配對應該 200，實際都是 403。若安全回歸只寫六個拒絕測試，這版會全部通過，卻不符合產品功能。

## 讓判準獨立於修補程式

正確候選 `owner_patch` 在交出資料前同時比對租戶與 owner。這裡的 `or` 表示任一條件不符就拒絕。

```python
if USERS[user][0] != ticket['tenant'] or user != ticket['owner']:
    return 403, {}
return 200, ticket.copy()
```

測試的允許清單另外固定為 Alice/N-1、Bob/N-2、Carol/S-1。不要寫成「呼叫新版 policy 算出應允許，再呼叫新版 policy 驗證」，否則改錯一次，實作與答案會一起錯。

內容也要驗。對正常讀取，回覆必須等於預先準備的合成工單；對拒絕，回覆不得帶工單內容。不存在 ID 在本教學回 404，真產品若統一用 404 隱藏物件存在性，先固定這個契約再改測試。狀態不同不會自動等於安全或不安全。

台灣團隊若讓客服主管代看工單，角色需求會使允許矩陣擴大。先新增主管帳號、明確授予的配對、撤權後配對，再改 policy；不要為了測試變綠臨時宣告全部同事都能看。

## 確認你修的是會執行的那份程式

函式矩陣證明的是這份檔案。將修補送到雲端測試環境後，另外留一份交付紀錄：目標 URL、健康檢查回報的 build、fixture revision、測試時間、各請求與回覆。版本識別只是定位用，仍要以實際讀取確認行為。

你可以把本系列的 [HTTP 工單服務](/examples/ai-security/ticket-lab.py)部署在自己的測試雲端，或對經授權產品以三個測試帳號操作同樣矩陣。後者需要由產品 API 取得各帳號的真實身分，不能把測試用 `demo-alice` 當正式登入方式。

若程式碼已修、HTTP 仍交出資料，依序查部署產物、服務重啟、路由、快取與其他讀取入口。保留失敗回覆，不要把本機綠燈覆蓋掉。相反地，WAF 暫時擋住某個字串，也不能證明後端授權修好了；改用同政策的另一筆測試資料確認。

## 把剩餘風險寫成下一個測試

十二格沒有模擬併發撤權、owner 轉移與快取。對正式工單服務，可先加一個可重跑的撤權測試：Alice 讀 N-1 成功，經可信管理 API 轉移給 Bob，Alice 重讀應拒絕，Bob 重讀應成功。記錄撤權生效的契約；有非同步快取時，測量時間窗口。

這個延伸沒有在本篇配套實作，不能寫成已通過。它說明如何從未測範圍產出具體工作，而不只在報告最後寫「仍有風險」。

修補交接至少留 F-17、前後版本、四版矩陣、掃描工具與設定、未測入口。審查者應能重跑後指出哪個結果推翻你的修補結論。

## 自我檢查：一行修補，三種失敗

只把 `or` 改成 `and` 會怎樣？答案：同租戶但不同 owner 時，租戶不符為假，整個拒絕條件不成立，越權又回來。跑 Alice/N-2 會抓到。

全部改 403，安全回歸全過能合併嗎？答案：不能，三個正常功能測試會失敗。完整驗收必須一起看允許與拒絕。

下一篇用同一工單讀取紀錄整理事件：修補後沒有新外洩，不會抹掉修補前已經發生的讀取。

## 真模型小樣本：生成後再驗十三格

2026-10-22，另外透過 Codex CLI 指定 `gpt-6.1-sol`，三次獨立要求修正只檢查登入的 `can_read`。提示已提供政策與函式限制；三份[實際生成的修補](/examples/ai-security/model-eval-results.json)相同，都同時檢查非空身分、租戶及 owner。

主程式先以 AST 允許清單限制成單一純布林函式，拒絕 import、呼叫、屬性存取與迴圈，再測獨立答案表。三份各通過 13/13：三角色乘四工單的十二格，加上一個未登入案例，共 39/39。N-3 是另一位 north 使用者的工單，可檢查模型是否把同租戶誤當授權。

這是模型生成函式的有限矩陣驗證，與前節人工四候選的十二格分開。生成函式沒有部署進 HTTP 應用，也未經商用掃描、併發撤權或真產品測試；AST 限制本身也不等於通用安全執行沙盒。

要重跑，把[model-eval.py](/examples/ai-security/model-eval.py)與[ticket-lab.py](/examples/ai-security/ticket-lab.py)下載至同一資料夾，準備 Python 3.11 以上與已登入的 Codex CLI，再執行：

```bash
python3 model-eval.py --out live-run-01 --repetitions 3
```

輸出目錄必須全新；程式會真的呼叫模型，並保存提示、回答、用量與 HTTP 紀錄。[Codex 非互動文件](https://developers.openai.com/codex/noninteractive.md)說明 CLI 與 JSONL 用法。下載版已修正注入階段的輸出契約，重跑會產生新觀測，不會逐位元重現這份結果。

這是三次重複的小樣本。CLI 接受指定 model ID，沒有回傳可驗證的精確權重快照，也未控制溫度；CLI 系統提示與執行框架都會影響結果。沒有逐次實付金額，亦不據此排名模型。

## 更新紀錄

- 2026-10-22：加入真模型小樣本、可重跑程式與結果，保留原固定案例及各自限制。

## 參考資料

- [GitHub：Responsible use of Copilot Autofix](https://docs.github.com/en/code-security/code-scanning/managing-code-scanning-alerts/about-autofix-for-codeql-code-scanning)：測試層次與錯誤修補限制。
- [系列：如何知道防線有效](/posts/ai/2026-10-22-ai-security-security-regression)：整體防線的回歸與運作監控。
- [下一篇：讓 AI 整理事件時間線](/posts/ai/2026-10-22-ai-security-incident-timeline)。
