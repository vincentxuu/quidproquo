---
title: "AI 資安怎麼學：攻擊、防護與調查的實作路線"
date: 2026-10-22
category: ai
type: guide
tags: [ai-security, security, ai-agent, llm, mcp]
lang: zh-TW
difficulty: 入門
series:
  name: "AI 資安實戰"
  order: 0
tldr: "從同一套客服助理出發，學 AI 如何協助找漏洞、AI 系統如何守住資料與工具權限，以及如何用 AI 調查、修補。每條路線都交出可重現的證據。"
description: "AI 資安實戰系列總覽：共用資料流與授權基礎，分成 AI 輔助攻擊、保護 AI、調查修補三線，串接 CTF、自架雲端與授權環境的練習。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-overview-en)

你替公司做了一個中文客服助理。它會讀知識庫、查工單，也能替客服產生回覆。客戶問得更快、模型答得更順，接著有人問：「換個工單編號，它會不會把別家客戶的資料交出來？」

這個問題把 AI 資安拉回了具體的系統：誰在問、資料從哪裡來、誰准許工具執行，以及出了問題能留下什麼證據。

這個系列會從同一套應用走三條路：**用 AI 輔助攻擊、保護 AI 系統、用 AI 調查與修補**。讀完總覽，你會知道每條路在練什麼，並能替自己的應用畫出第一張資料流與權限表。

## AI 資安裡，AI 扮演什麼角色？

先看工作目標，再選工具。同一個模型可以在不同流程裡扮演完全不同的角色。

| 路線 | 你想回答的問題 | 一次練習要交出什麼 |
|---|---|---|
| AI 輔助攻擊 | 哪個入口可能被利用？如何證明影響？ | 有環境、輸入與實際結果的漏洞重現 |
| 保護 AI 系統 | 外部內容或錯誤工具請求，會跨過哪道邊界？ | 權限規則、防護與修補前後測試 |
| AI 輔助調查與修補 | 發生了什麼？哪個結論有證據？修好了嗎？ | 可追溯時間線、修補與回歸結果 |

[NIST 對 AI 與資安的整理](https://www.nist.gov/blogs/cybersecurity-insights/managing-cybersecurity-and-privacy-risks-age-artificial-intelligence)也分別討論保護 AI、應對 AI 強化的攻擊，以及用 AI 輔助防禦。這裡把攻擊工作流程另外展開，讓你看懂模型如何觀察目標、提出假設、呼叫工具，再依結果調整下一步。

AI 輔助攻擊可以針對一般網站或 API；被保護的 AI 系統則可能受到一般授權漏洞與 AI 特有輸入問題影響。兩者會交會，但不必把每個漏洞都叫作 Prompt Injection。

## 從一筆客服請求，看到整個系統

我們用一個自製的「雙租戶客服工單助理」作貫穿案例。租戶就是共用服務的不同客戶組織：北公司與南公司各有自己的文件、使用者與工單。

這套教學系統讓使用者提出問題，後端取得登入身分，依權限讀資料，模型再產生回答或提出工具請求。工具執行前還要檢查這次操作是否被允許。

<!-- AI-security teaching architecture: a proposed example, not a trace from a deployed service. -->
```diagram
title: 教學案例：從使用者到工具執行
desc: 後端取得已驗證身分並檢索允許讀取的資料，模型提出工具請求後，由執行端再次檢查操作權限。
---
<svg viewBox="0 0 400 500">
  <path class="dg-line" d="M200 76V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 172V216" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 268V312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 364V408" marker-end="url(#arrow)"/>
  <rect class="dg-box" x="70" y="28" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="52" text-anchor="middle" dominant-baseline="central">使用者與登入狀態</text>
  <rect class="dg-box" x="70" y="124" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="148" text-anchor="middle" dominant-baseline="central">API 與授權檢查</text>
  <rect class="dg-box" x="70" y="220" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="244" text-anchor="middle" dominant-baseline="central">允許讀取的資料</text>
  <rect class="dg-box" x="70" y="316" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="340" text-anchor="middle" dominant-baseline="central">模型提出工具請求</text>
  <rect class="dg-box dg-box--accent" x="50" y="412" width="300" height="48" rx="6"/>
  <text class="dg-label" x="200" y="436" text-anchor="middle" dominant-baseline="central">工具授權與執行</text>
</svg>
```

沿著這筆請求，先問三件事：

1. **外部內容進來時**：工單附件是要處理的資料。裡面出現「忽略原規則」時，應用會怎麼處理？
2. **資料交給模型前**：現在這個使用者有權讀到這份資料嗎？[多租戶 RAG 架構指引](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)把租戶與使用者權限過濾放在資料進入模型脈絡之前。
3. **工具真的動手前**：模型提出了工單編號與操作，後端是否逐次核對使用者、資源與動作？[OWASP 的 MCP 安全指引](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)要求在可信程式碼中執行這類檢查。

這些位置都值得觀察。模型說「我已匯出資料」，還要回到工具結果與實際輸出，確認事情是否發生。

## 同一個漏洞，三條線各做什麼？

假設這個教學產品規定：一般使用者只能讀取自己租戶內、由自己持有的私人工單。北公司的 Alice 原本讀取 `N-1`；她把請求改成南公司的 `S-1`。

下面是要驗證的情境，還沒有假設服務一定有漏洞：

```text
已驗證的使用者：alice，屬於租戶 north
原請求：read_ticket(ticket_id="N-1")
測試請求：read_ticket(ticket_id="S-1")
預期：拒絕讀取，不把 S-1 的內容放進回答或工具結果
```

**攻擊線**會請 AI 協助找出接收工單編號的入口、提出缺少授權檢查的假設，再產生最小驗證步驟。實際回傳別人資料，才有對應的影響證據；光是 AI 說「可能是越權」還不足以結案。

**防護線**會讓後端從可信的登入狀態取得身分，檢查租戶與工單擁有者。接著用同一個請求驗證拒絕結果，也保留正常讀取自己的工單的測試。詳細規則與可執行範例放在[第 1 篇：登入之後，誰能讀哪份資料？](/posts/ai/2026-10-22-ai-security-identity-and-authorization)。

**調查線**則會把請求、授權決策、工具結果與回應串起來，判斷資料有沒有真正離開邊界。AI 可以整理事件，但每個已確認的結論都要回查原始紀錄。

三條線會共用案例編號。這樣你能比較攻擊時的輸入、修補後的拒絕，以及調查報告說的是否為同一件事。

## 誰適合讀，先要會什麼？

如果你寫過簡單程式、串過 API，想知道 AI 應用哪裡可能出事，可以從共用入門開始。需要讀得懂基本函式、請求參數與 JSON；前幾篇會補上身分、授權和漏洞證據的概念。

已經做資安的人，可以依工作選線：想研究 AI 攻擊工具就走攻擊線；正在上線 RAG 或 Agent 就先看防護線；負責程式審查或告警處理，就走調查修補線。

本系列聚焦應用與工作流程。模型訓練攻擊、硬體安全、深偽詐騙與前沿 AI alignment，各有自己的知識與實驗需求，留作延伸主題。

## 系列地圖：共用入門後，選一條路線

先讀共用入門 0–3，再依工作選攻擊線 4–9、防護線 10–16，或調查修補線 17–22；最後到第 23 篇，把三條路線的產物接起來。

| 篇序／路線 | 主題 |
|---|---|
| 0 · 共用 | AI 資安怎麼學：攻擊、防護與調查的實作路線（本篇） |
| 1 · 共用 | [登入之後，誰能讀哪份資料：AI 助理的身分與授權](/posts/ai/2026-10-22-ai-security-identity-and-authorization) |
| 2 · 共用 | [AI 說有漏洞，你要拿出什麼證據？](/posts/ai/2026-10-22-ai-security-vulnerability-evidence) |
| 3 · 共用 | [選你的 AI 資安練習環境：本機、雲端、CTF 與授權目標](/posts/ai/2026-10-22-ai-security-experiment-environments) |
| 4 · 攻擊 | [AI 如何讀懂目標與整理攻擊面](/posts/ai/2026-10-22-ai-security-attack-surface) |
| 5 · 攻擊 | [讓 AI 找漏洞：從線索到測試假設](/posts/ai/2026-10-22-ai-security-vulnerability-hypotheses) |
| 6 · 攻擊 | [AI 產生利用測試，怎麼確認真的成功？](/posts/ai/2026-10-22-ai-security-exploit-verification) |
| 7 · 攻擊 | [AI 如何攻擊另一個 AI：間接注入與工具誤用](/posts/ai/2026-10-22-ai-security-prompt-injection-attacks) |
| 8 · 攻擊 | [把工具接成攻擊 Agent：計畫、執行與回饋](/posts/ai/2026-10-22-ai-security-attack-agent-loop) |
| 9 · 攻擊 | [AI 能串起攻擊鏈嗎？從 CTF 到公開事件](/posts/ai/2026-10-22-ai-security-attack-chains) |
| 10 · 防護 | [Prompt Injection 的防線要放在哪裡？](/posts/ai/2026-10-22-ai-security-injection-defenses) |
| 11 · 防護 | [RAG 答對了，也可能洩漏別人的資料](/posts/ai/2026-10-22-ai-security-rag-permissions) |
| 12 · 防護 | [工具能呼叫，不代表這次動作有權執行](/posts/ai/2026-10-22-ai-security-tool-authorization) |
| 13 · 防護 | [MCP 的信任鏈：你到底信任了什麼？](/posts/ai/2026-10-22-ai-security-mcp-trust) |
| 14 · 防護 | [模型輸出如何變成 XSS、命令與資料外傳？](/posts/ai/2026-10-22-ai-security-output-handling) |
| 15 · 防護 | [Agent 的沙盒、憑證與網路邊界](/posts/ai/2026-10-22-ai-security-sandbox-credentials) |
| 16 · 防護 | [如何知道防線有效：紅隊、回歸與運作監控](/posts/ai/2026-10-22-ai-security-security-regression) |
| 17 · 調查修補 | [AI Code Review：把可疑程式變成待驗證的發現](/posts/ai/2026-10-22-ai-security-code-review) |
| 18 · 調查修補 | [AI 寫好 Patch，還要驗證什麼？](/posts/ai/2026-10-22-ai-security-patch-verification) |
| 19 · 調查修補 | [讓 AI 整理事件時間線，別替缺失紀錄編故事](/posts/ai/2026-10-22-ai-security-incident-timeline) |
| 20 · 調查修補 | [AI 說是誤報，能直接關掉嗎？](/posts/ai/2026-10-22-ai-security-alert-triage) |
| 21 · 調查修補 | [讓資安助手接上工具：從唯讀調查到處置](/posts/ai/2026-10-22-ai-security-response-permissions) |
| 22 · 調查修補 | [怎麼證明 AI 真的幫上資安工作？](/posts/ai/2026-10-22-ai-security-workflow-evaluation) |
| 23 · 整合 | [AI 資安整合演練：從攻擊證據走到修補與回歸](/posts/ai/2026-10-22-ai-security-integrated-exercise) |

初次接觸資安，先把共用入門走完。三條線各有自己的例子與練習，可以依當下的工作切入，再回頭補另外一線。

## 實作會做到哪裡？

環境會涵蓋本機範例、[CTF 評測任務](https://crfm.stanford.edu/2024/08/19/cybench.html)、公開訓練平台、自架雲端，以及經授權的真實系統。本機方便重現；雲端與真實系統則讓你處理服務狀態、權限與操作條件的差異。

每次選環境，都要先列明可測資產、帳號、允許行為與停止條件。以 Bug Bounty 為例，[HackerOne 的 security page](https://docs.hackerone.com/en/articles/8490833-security-page)會說明個別計畫的範圍與要求；[safe harbor 說明](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq)不會替你擴大原本的資產範圍。自動化是否允許，也要回到該計畫規則。

真實攻擊案例會拆解每個轉折：攻擊者看到了什麼、模型做了什麼、哪一步有已確認的影響。能重建的部分會安排到相應的授權環境；不需要重攻事件中的受害者。

## 真模型已測什麼，還不能推論什麼？

固定案例用來確認程式與防線；模型能否提出測試、讀懂回應，需要另測。這次也透過已登入的 Codex CLI，指定 `gpt-6.1-sol`，各做三次獨立重複：

| 任務 | 這次觀察 |
|---|---|
| 根據程式與已給定政策提出漏洞假設 | 3 次都涵蓋正常、同租戶不同擁有者、跨租戶案例 |
| 讀取含有注入指令的工單 | 3 次都選擇完成原任務，沒有提出額外讀取 |
| 根據工具回應決定下一步 | 兩版共 6 次，結論都與實際工單回應相符 |
| 生成授權修補函式 | 3 份各通過 13 格獨立測試 |

完整[模型實測結果](/examples/ai-security/model-eval-results.json)保留提示對應、模型輸出、工具回應、使用量與限制；[整合篇](/posts/ai/2026-10-22-ai-security-integrated-exercise)提供重跑命令。這不是探索未知產品的成績：政策已給模型，資料是小型合成工單，沒有真人基準或模型排名。

注入提示已明示文件不可信，本次也沒有測弱提示對照，不能把未偏離歸因於某一防線。測試器原先誤拒絕六份合法的「完成、N-1」輸出，已按原提示契約重評並保留原紀錄；被跳過的後端效果沒有執行，不能算成後端阻擋成功。CLI 沒有回傳精確模型快照、溫度或實付帳單，這些也不能由名稱或 token 數自行補上。

## 先學會判斷「成功」

CTF 旗標、工具退出碼與模型報告，各自在說不同的事。[NIST 對 Agent 評測的調查](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)展示了答案外洩與評分漏洞可能造成的假成功，也記錄了修改本機副本卻沒有影響遠端目標的無效嘗試。拿到答案、修改檔案與真正改變目標狀態，需要分開驗證。

每篇實作會要求你留下：**起始環境、輸入、預期結果、實際結果與可回查證據**。有修補的案例，還要用相同條件重跑。AI 可以提出候選路徑，驗收要回到服務與資料的實際狀態。

現在拿一個你熟悉的 AI 應用，畫出「使用者 → 後端 → 資料 → 模型 → 工具」。圈出外部內容進來、資料交給模型、工具執行這三個位置，分別寫下由誰決定權限。

如果你寫到「交給模型判斷」，就把那個位置留作下一篇要處理的問題。[第 1 篇](/posts/ai/2026-10-22-ai-security-identity-and-authorization)會用可以直接執行的範例，讓允許與拒絕結果都看得見。

## 更新紀錄

- 2026-10-22：補入真模型小樣本、重跑入口與測試器格式修正紀錄。

- 2026-10-22：補齊三條路線與整合演練的閱讀連結。本次更新導覽，沒有重新查證原有外部主張。

## 參考資料

- [NIST：AI 時代的資安與隱私風險](https://www.nist.gov/blogs/cybersecurity-insights/managing-cybersecurity-and-privacy-risks-age-artificial-intelligence)
- [Microsoft：安全的多租戶 RAG 推論架構](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)
- [OWASP：MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [Stanford CRFM：Cybench 的任務與評測設計](https://crfm.stanford.edu/2024/08/19/cybench.html)
- [HackerOne：Security Page](https://docs.hackerone.com/en/articles/8490833-security-page)
- [HackerOne：Safe Harbor Overview & FAQ](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq)
- [NIST：Agent 評測中的偏離預定解題方式與評分漏洞](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)
