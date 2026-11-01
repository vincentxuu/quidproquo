---
title: "幫 agent 上護欄：隱私、提示注入、沙箱與許可｜Stanford CS329Z 第 15 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 16
tldr: "第 15 堂依課表談工具存取的隱私風險、提示注入（含間接注入）、紅隊、沙箱與許可模型、輸出護欄、責任歸屬、負責任部署與人類把關。讀物從 PrivacyLens 的行動洩漏，讀到模擬搜尋隱私風險、去匿名化、情境化隱私防禦、提示注入與 Responsible Scaling Policy。"
description: "依課表與指定閱讀預習 Stanford CS329Z 第 15 堂 Agent Safety & Guardrails：深讀 PrivacyLens、隱私風險模擬、去匿名化、情境化防禦、提示注入與 RSP，整理成提示注入、紅隊、沙箱、許可四件護欄。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

品質評分過關，不代表 agent 可以放手去做。第 15 堂（11/11，Agent Safety & Guardrails）處理的是行動授權：agent 能讀到的資料，不表示能傳出去；網頁或文件裡的指令，不表示是使用者的指令。課表列出工具存取的隱私風險、提示注入、紅隊、沙箱與許可模型、輸出護欄、責任歸屬，以及人類把關的模式。週五（11/13）paper video 到期。

指定讀物是 Shao 等人的 [PrivacyLens](https://arxiv.org/abs/2409.00138)、Zhang 與 Yang 的隱私風險模擬搜尋，以及 Li 的 agent 去匿名化研究；延伸閱讀是情境化隱私防禦、OpenAI 的提示注入說明與 Anthropic 的 Responsible Scaling Policy。本文六篇都深讀。截至 2026-10-29，這堂還沒有公開投影片，本文是依官方課表與指定閱讀寫的預習，不代表講師在課堂上說過的內容。第 11 堂以後的堂次編號依課表順序推算，官網目前只列日期與主題。

## 工具能讀到，不表示能傳出去

[PrivacyLens](https://arxiv.org/html/2409.00138)把隱私情境延伸成 agent 軌跡，重點是模型說得出規則與實際採取行動可能不一致。本文例子是助理讀到客訴備註，對外回信只需訂單狀態，卻附上員工私人電話。檢查點應設在寄信前：接收者是誰、哪些欄位必要、是否有授權。低信任工具內容也不能自行提高工具權限。

**理解檢查**：judge 認為回信清楚完整，是否可以略過寄送確認？**答案判準**：不能。品質評分沒有建立接收者與資料分享授權；要另查政策與實際外送內容，必要時讓使用者核准具體草稿。

## 讀物 1｜PrivacyLens

原文：[PrivacyLens](https://arxiv.org/abs/2409.00138)

### TL;DR

PrivacyLens 將隱私種子擴成情境與工具軌跡，檢查敏感資料是否在最終動作流向不適當對象。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 會讀私人資料並向第三方寄信、發文或呼叫 API 的助理開發者。 |
| 先讀哪裡 | Contextual integrity 五元組，接著比較 probing 與最終行動的評分。 |
| 不宜直接採用 | 把隱私強化提示當唯一防線；研究本身顯示提示後仍可能洩漏。 |

### 領域背景

隱私測驗常問「這筆資料能不能分享」，真實助理卻會在整理信件或協助同事時順手帶出資訊。情境完整性把重點放在資訊流：同一筆內容的分享是否合宜，會隨當事人、傳送者、接收者及傳輸原則改變。PrivacyLens 因而把懂規則與執行時守規則分開測量。

### 中階導讀

**問題。** 一個能在問答中辨認隱私規範的模型，到了帶工具的真實任務，是否仍把該保留的資訊寫進外送動作？

**方法與觀察。**

安全課的核心證據來自 PrivacyLens：問答考得好，動手做照樣洩漏。理論地基是[情境完整性](https://en.wikipedia.org/wiki/Contextual_integrity)：隱私不是祕密本身，是資訊流動是否合乎情境規範。同一句話，說給同事聽沒事，寫進給主管的信就出事。

方法上，作者先收四百九十三條隱私敏感種子。每條種子是五元組：資料型別、當事人、傳送者、接收者、傳輸原則。種子再長成小故事（vignette），最後在沙箱裡跑出完整工具軌跡。問答用探測題考，動手用最終動作驗，兩層分開計分。

結果是當頭棒喝。即使加了隱私強化提示，GPT-4 仍在四分之一強的案例中洩漏敏感資訊。[Llama-3-70B](https://arxiv.org/abs/2407.21783) 的洩漏比例接近四成。會答題不等於會做事，這句話有了可重現的證據。

評測是考前模擬，護欄是考場監考，實務上常見四件。第一件防提示注入：工具輸出與檢索內容一律視為不可信輸入，這條呼應 [第 4 堂讀過的 MCP 規範](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use)。第二件是紅隊演練：同一顆種子長出多條軌跡，主動找最會洩漏的走法。第三件是沙箱：每次試驗從乾淨環境起步，試錯不傷本體。第四件是許可：不可逆的工具呼叫先要明確同意。

```diagram
title: 高後果動作前的許可邊界
desc: 外部資料只能提供資訊；上文的不可逆工具動作須有明確許可，否則先詢問。
caption: 上文許可護欄的簡化示意；沙箱、權限隔離與其他防線仍需另設。
---
<svg viewBox="0 0 440 544"><path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/><path class="dg-line" d="M220 192V232" marker-end="url(#arrow)"/><path class="dg-line" d="M220 328V372Q220 380 212 380H120Q112 380 112 388V448" marker-end="url(#arrow)"/><path class="dg-line" d="M380 280H400Q408 280 408 288V404Q408 412 400 412H340Q332 412 332 420V448" marker-end="url(#arrow)"/><rect class="dg-box" x="20" y="16" width="400" height="72" rx="6"/><text class="dg-label" x="220.0" y="52.0" text-anchor="middle" dominant-baseline="central">外部文字／工具輸出：不可信資料</text><rect class="dg-box" x="40" y="128" width="360" height="64" rx="6"/><text class="dg-label" x="220.0" y="160.0" text-anchor="middle" dominant-baseline="central">形成候選工具動作</text><path class="dg-box" d="M220 232L380 280L220 328L60 280Z"/><text class="dg-label" x="220" y="280" text-anchor="middle" dominant-baseline="central">有明確許可？</text><rect class="dg-box dg-box--accent" x="16" y="452" width="192" height="72" rx="6"/><text class="dg-label" x="112.0" y="488.0" text-anchor="middle" dominant-baseline="central">執行獲准動作</text><rect class="dg-box" x="240" y="452" width="184" height="72" rx="6"/><text class="dg-label" x="332.0" y="488.0" text-anchor="middle" dominant-baseline="central">停下來詢問</text><text class="dg-edge" x="164" y="356" text-anchor="middle" dominant-baseline="central">有</text><text class="dg-edge" x="376" y="352" text-anchor="middle" dominant-baseline="central">沒有</text></svg>
```

**結果怎麼讀。** 25.68% 與 38.69%是指定 GPT-4 與 Llama-3-70B 及 privacy-enhancing 提示下的結果，不是現行所有模型洩漏率。

### 深入要點

- **種子不是完整任務。** 五元組先固定資訊流規範，再擴成故事與工具環境；結果的外推取決於這些情境是否涵蓋你的資料與工作關係。

- **問答與行動存在落差。** 模型能指出不適當分享，仍可能在最終 email 或其他動作中包含敏感內容；只跑意圖分類會漏掉這個失敗點。

- **本文護欄示意是設計延伸。** 本文許可流程不是 PrivacyLens 證明有效的防禦系統。評測暴露風險，具體權限與確認機制還要獨立驗證。

### Reviewer 一句話評

它最有說服力的證據是把「說得對」與「做得對」拆開；讀者應把它當行動級測試設計，而非任何提示詞的防洩漏保證。

### 給你的 take-away

用合成資料設計一個可分享行程、不可分享身分資料的寄信任務；對同一內容更換合法與不合法接收者，檢查實際寄送參數，另記錄是否仍完成允許的協助。

## 讀物 2｜Searching for Privacy Risks via Simulation

原文：[Searching for Privacy Risks via Simulation](https://arxiv.org/abs/2508.10880)

### TL;DR

攻防模擬讓LLM根據軌跡改寫指令，以多線平行搜尋發現攻擊與防禦策略。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 已有隱私情境與可重置模擬環境，希望主動找新漏洞的團隊。 |
| 先讀哪裡 | 三方資訊流設定，再讀交替搜尋與跨線策略傳播。 |
| 主要成本 | 對話模擬、優化器與判分都需模型呼叫，搜尋預算會影響能找到的策略。 |

### 領域背景

固定紅隊題庫可以比較版本，卻很難模擬會觀察拒絕理由、換角色再追問的對手。當 agent 代表不同的人交換資訊，誰有權收資料也會成為互動的一部分。這篇把攻擊與防禦都設成可改寫的指令，研究雙方適應後還會出現哪些漏洞。

### 中階導讀

**問題。** 防禦會改變對手下一輪的做法，如何在有限預算內找出比固定攻擊題更難預料的資訊洩漏路徑？

**方法與觀察。**

另外兩篇主讀物把威脅往前推一步。[Zhang 與 Yang（同樣掛名授課者 Diyi Yang）用模擬搜尋隱私風險](https://arxiv.org/abs/2508.10880)：惡意智慧體在多輪對話裡主動套敏感資訊，動態對話讓人事先想不到漏洞。做法是讓攻防在模擬裡互捲——LLM 當 optimizer 看軌跡改指令，多線平行搜尋策略空間。結果兩邊都進化：攻擊從直球要資料走到冒充加偽造同意，防禦從簡單規則走到身份驗證狀態機。作者在受測的新場景與 backbone 上觀察到策略轉移，提供了後續防禦設計的候選做法。

**結果怎麼讀。** 跨場景與模型轉移是受測條件下的結果，不表示拿來就能保護所有真實部署。

### 深入要點

- **交替搜尋讓難度持續變化。** 先固定防禦找攻擊，再拿找到的攻擊改良防禦；只在初始對手上量一次分數，會漏掉這種適應性。

- **平行線索需要共享突破。** 多條搜尋線可探索不同策略，跨線傳播則讓有效發現影響其他線；它增加搜尋覆蓋，仍不代表窮盡所有攻擊。

- **驗證狀態不能由對話自封。** 研究找到的冒充與偽造同意策略，說明「對方說已獲准」不足以更新授權狀態；產品需要能核對的身分與授權來源。

### Reviewer 一句話評

它把紅隊從靜態考卷推進為持續找弱點的程序；但模擬中學到的指令，還需要真實工具與未見對手的獨立驗收。

### 給你的 take-away

在合成資料沙箱中固定一版防禦，保留完整多輪攻擊紀錄；改完防禦後，除了重播舊失敗，也換一個未參與搜尋的攻擊者與情境，分開報告兩組結果。

## 讀物 3｜Agentic LLMs as Powerful Deanonymizers

原文：[Agentic LLMs as Powerful Deanonymizers](https://arxiv.org/abs/2601.05918)

### TL;DR

作者在提到作品的科學家訪談中，用LLM與搜尋比對研究描述並人工核對高信心連結。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 準備分享訪談、使用者研究或其他細節豐富文字資料的團隊。 |
| 先讀哪裡 | 候選訪談的選取程序與結果中的身分確定程度。 |
| 實務重點 | 風險來自資料與外部作品的可連結性，發布審查需超過姓名欄位。 |

### 領域背景

質性訪談的價值常在具體故事，去識別化卻也容易敗在這些細節。研究題目、罕見貢獻與專業用語可充當準識別資訊，即使姓名已刪除，也能與公開作品比對。這篇關心的是搜尋與 agent 降低比對門檻後，原本的資料發布假設是否仍成立。

### 中階導讀

**問題。** 刪除直接識別資料之後，訪談描述的作品是否仍足以透過公開搜尋縮小作者範圍，甚至連回個人？

**方法與觀察。**

[Li 的去匿名化研究](https://arxiv.org/abs/2601.05918)更刺眼：Anthropic 公開的 Interviewer 訪談資料集裡，科學家子集中，二十四篇訪談提到已發表作品。其中六篇被現成工具連回具體論文作者。攻擊者沒寫任何新工具，就是 LLM 加搜尋加智慧體能力，幾個 prompt 交叉比對；防護拆成無害子任務就繞過。作者已通知 Anthropic。這篇揭露的風險是，詳細研究描述即使刪去姓名，仍可能與外部作品連結；六篇連結不都等於唯一識別。

**結果怎麼讀。** 24 篇候選中 6 篇連回作品作者；不是所有訪談都能唯一識別，也不能當通用去匿名化成功率。

### 深入要點

- **候選作品與唯一身分不同。** 找到相關論文可能只縮小到作者群；只有額外證據足夠時才能談唯一識別，不能把全部高信心連結都算成確定身分。

- **樣本是經過篩選的。** 二十四篇是科學家訪談中提到已發表作品的候選，不是從全部訪談隨機抽樣；這個分母無法估計一般訪談的風險率。

- **同意程序也是防護議題。** 作者向資料發布方建議暫時隱藏資料、重新告知受訪者並取得同意。本文據此延伸的發布建議是減少可連結細節，必要時限制存取；這些建議不構成已驗證的匿名化保證。

### Reviewer 一句話評

這是一份小樣本但具體的發布風險示警：它證明常見工具可降低連結成本，沒有量出所有受訪者的可識別比例。

### 給你的 take-away

發布前請獨立審查者只用合成或已獲授權的案例，標出可搜尋的罕見描述及其組合；記錄哪些細節可刪減、哪些必須轉為受控存取，避免在審查報告中公開候選身分。

## 讀物 4｜Contextualized Privacy Defense

原文：[Contextualized Privacy Defense](https://arxiv.org/abs/2603.02983)

### TL;DR

CDI 在行動形成時給情境化指導，並以經驗驅動優化改善隱私與helpfulness的取捨。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 現有 guard 能擋風險，卻經常讓合法任務無法繼續的團隊。 |
| 先讀哪裡 | Prompting／guarding／instructing 在 agent loop 的不同位置。 |
| 採用成本 | 新增 instructor 呼叫與訓練／校準工作，需連同延遲及誤拒一起評估。 |

### 領域背景

只在開頭寫隱私規則，可能跟不上後來取回的資料；只在送出前否決，又可能讓任務停在「不能做」。CDI 把介入點移到工具觀察之後、下一個動作之前，由另一個模型提供符合當前關係的建議。評估因此要同時看資訊保護與合法協助是否完成。

### 中階導讀

**問題。** 在不分享受限制資料的前提下，能否於行動產生之前引導 agent 完成仍被允許的任務部分？

**方法與觀察。**

[Contextualized Privacy Defense for LLM Agents](https://arxiv.org/abs/2603.02983) 不把隱私當關鍵字封鎖。同一筆資料能不能分享，取決於對象、目的與當下關係。靜態 system prompt 在長流程裡容易失效，事後 guard 也只會擋掉動作，不一定告訴智慧體怎麼改成「分享允許的部分」。

它提出 CDI：工具結果進入 context 後，先讓一個獨立、可較小的 instructor model 讀取現況，產生這一步可執行的隱私建議，再交回主智慧體決定下一步。訓練時把首次洩漏前後的 frozen context 變成 RL 環境，目標同時顧 privacy preservation、helpfulness 與 appropriate disclosure。

論文在 115 組模擬情境中測試，最佳設定在 unseen scenarios 報告 94.2% privacy preservation。79.5% 則是另一個 unseen adversarial attacks 條件下的結果；經驗驅動優化讓該條件的 privacy preservation 由 32.3% 提高至 79.5%，不是把 94.2% 對同一批案例重測後降下來。兩種條件下均須依論文設定比較 prompting 與 guarding 基線。這不是部署保證：情境由 PrivacyLens 與模型擴增，洩漏由 LLM judge 判定，結果也依賴特定的 agent、instructor 與 attacker。它真正補上的觀念是，護欄不必只在最後回答 yes 或 no，也能在 action 形成途中引導出安全但仍有用的替代方案。

**結果怎麼讀。** 115 組模擬情境；94.2% unseen-scenario 與 79.5% unseen-attack是不同條件，均非部署保證。

### 深入要點

- **介入時點決定能改什麼。** Instructor 在主 agent 形成下一步行動前給建議，因此能提議只分享被允許的欄位；事後 veto 通常只能接受或阻擋已形成的動作。

- **首次洩漏前的 context 是訓練單位。** 經驗優化把失敗軌跡截在最早洩漏前，訓練 instructor 改變下一步；它不是把整段歷史從頭重新執行的環境等價物。

- **多個模型仍可能共同漏判。** Agent、instructor、attacker 與 judge 都會影響分數。模型判定沒有洩漏，還要以產品的欄位與接收者規則抽查，尤其是未見工具與資料型態。

### Reviewer 一句話評

它提供一個比全面拒絕更有用的防禦設計空間；真正要複製的是介入點與雙目標評估，而非最佳設定的百分比。

### 給你的 take-away

選一個常被護欄擋住的合法任務，寫出只分享允許欄位的替代動作；同時測規則提示、事後阻擋與動作前建議，分別記錄洩漏、完成允許協助，以及錯誤拒絕。

## 讀物 5｜Understanding Prompt Injections

原文：[Understanding Prompt Injections](https://openai.com/index/prompt-injections/)

### TL;DR

官方說明將攻擊放在外部內容操控agent的路徑，並以指令階層、監控、沙箱、權限與確認分層降低風險。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 會把網頁、email 或檢索文件交給具工具權限 agent 的團隊。 |
| 先讀哪裡 | 第三方內容如何進入 context，再逐層列出各防線的失效後果。 |
| 閱讀定位 | 供應商安全架構說明；沒有可用來宣告全面解決注入的單一測試結果。 |

### 領域背景

傳統程式通常把資料與可執行指令交給不同介面，語言模型卻會在同一段 context 內閱讀任務、文件與工具結果。外部作者若能把資料寫成命令，就有機會改變 agent 的行為。工具權限越大，這種語意混淆造成的後果就越不侷限於回答品質。

### 中階導讀

**問題。** 模型若把工具讀回的第三方文字誤當成任務指令，系統如何避免這個錯誤進一步變成未授權讀取或外送？

**方法與觀察。**

OpenAI 的 [Understanding Prompt Injections](https://openai.com/index/prompt-injections/) 把威脅講得很直接：網頁、文件或 email 裡的第三方文字，會跟可信指令一起進入模型的 context。當智慧體同時拿得到私人資料、工具與長時間自主權，惡意文字造成的就不只是答錯，而可能是資料外洩或未授權行動。

官方提出的是多層防禦：instruction hierarchy 與安全訓練、可快速更新的監控、沙箱和權限隔離、高後果動作前的人類確認、red team 與 bug bounty。每一層都可能失手，設計目標因此是縮小權限與爆炸半徑，而不是相信一個更強的 prompt。文章也明說 prompt injection 仍是開放問題，沒有任何單一層已經根治它。第 14 堂的 judge 只能抓到一部分錯誤；就算判斷器漏掉，外部字串也不該直接取得高權限。

**結果怎麼讀。** 來源明說這仍是開放安全問題；單一prompt或監控器沒有根治證據。

### 深入要點

- **來源的權限不隨語氣升級。** 文件自稱是管理員命令，仍是第三方內容；指令階層與來源標記是在維持這個界線。

- **偵測與限制後果是兩種工作。** 監控器嘗試找出惡意內容，沙箱與最小權限則在漏判時限制可讀寫的資源。兩者需要各自的失敗測例。

- **確認介面本身也要守住。** 若確認文字由受污染的 context 生成，使用者可能看不到真正接收者或傳送內容；獨立呈現實際工具參數才有助於有效決策。這是由多層防禦原則導出的產品建議。

### Reviewer 一句話評

這篇適合用來安排防線與權限責任；它是供應商的安全說明，不能取代針對你自己工具鏈的攻擊測試。

### 給你的 take-away

做一個含惡意命令的測試文件，讓 agent 在能讀取合成私人資料、但不能向未允許網域外送的環境執行任務；同時檢查模型是否受影響，以及工具層是否攔住未授權動作。

## 讀物 6｜Responsible Scaling Policy

原文：[Responsible Scaling Policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)

### TL;DR

歷史RSP以AI Safety Levels連接危險能力評估與安全要求，讓能力擴展與防護門檻相連。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 最適合誰 | 需要把能力／風險評估接到發布權限與組織責任的人。 |
| 先讀哪裡 | 2023 v1 的 AI Safety Levels 與擴展條件，再辨認後續版本差異。 |
| 閱讀界線 | 公司自願政策，適合作為治理設計案例；不是通用法規或安全認證。 |

### 領域背景

能力測試只能產生觀察，是否能繼續訓練、擴大部署或開放權限，還需要組織決策。RSP 將危險能力與防護要求接起來，試圖讓評估結果對開發流程產生約束。它處理的是治理門檻，尺度與單一應用的回答品質 rubric 不同。

### 中階導讀

**問題。** 當能力測試發現新的危險程度時，哪些安全措施與決策權應隨之改變，什麼情況需要停止擴展？

**方法與觀察。**

課表連的是 Anthropic 2023 年發布的 [Responsible Scaling Policy v1](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)。它借用生物安全等級提出 AI Safety Levels：模型越接近可造成大規模災難的危險能力，資安、部署、評測與紅隊要求就要同步提高。核心承諾不是「跑過一次 eval 就安全」，而是安全能力追不上時應暫停擴展，把 capability evaluation 真的接到 stop/go 決策。

這是一份自願、可修訂的公司政策，而且課表指定的是歷史版本。[Anthropic 現行政策頁](https://www.anthropic.com/responsible-scaling-policy)在本次更新時列出的最新版已是 2026 年 7 月生效的 v3.4，不能把 v1 細節當成今天原封不動的承諾。它在第 14、15 堂之間的價值是治理接口：第 14 堂把 judge 和 metric 做出來，RSP 追問分數越線後誰還能部署、要加什麼防護、何時必須停。

**結果怎麼讀。** 課表指定 2023 版；現行頁列 2026-07-08 生效 v3.4，不應混為同一承諾。

### 深入要點

- **門檻必須連到行動。** 發現危險能力若只增加報告分數，不改變防護或部署條件，政策就失去約束力；v1 的重點在安全措施不足時的擴展限制。

- **評估不確定性仍需決策責任。** 低分可能來自測試未涵蓋能力，也可能真有能力限制。誰解讀、誰要求補測、誰決定繼續，不能藏在一個平均分數裡。這是本文對治理接口的解讀。

- **政策版本是證據的一部分。** v1 與現行政策有不同措辭與程序；討論公司今日承諾時要回讀當前版本，討論課程思想時則保留歷史設定。

### Reviewer 一句話評

它值得讀在評測章節最後：迫使讀者回答分數如何改變決策，但自願政策的文字不等於已被獨立證實的執行紀錄。

### 給你的 take-away

為一項高風險功能寫一份簡短的發布條件：指定危險情境、測量證據、防護不足時的停止條件、決策負責人與重新評估時點；註明版本，並用一次假想越線結果演練整個流程。

## 怎麼做：先做一條擋得住真實事故的許可檢查

**怎麼做**：護欄先只做一條：寄信、刪檔這類不可逆動作，執行前一律要明確許可。檢查點設在動作送出前，確認接收者、必要欄位與授權；低信任工具內容不能自行提高工具權限。交付的是一條擋住過真實事故的許可檢查，而不是一份規則清單。

## 它在課程裡的位置

第 15 堂替 agent 的行動設下限制，下一週除了待公布的客座，[第 17 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents)談 coding agent：沙箱與許可在那裡是每天都會碰到的設計。

## 本堂 Course Material 對照

- 官方投影片：尚未公開（截至 2026-10-29）
- 指定閱讀：Shao 等人〈PrivacyLens〉（本文深讀）、Zhang 與 Yang〈Searching for Privacy Risks in LLM Agents via Simulation〉（本文深讀）、Li〈Agentic LLMs as Powerful Deanonymizers〉（本文深讀）
- 延伸閱讀：Wen 等人〈Contextualized Privacy Defense for LLM Agents〉、OpenAI〈Understanding Prompt Injections〉、Anthropic〈Responsible Scaling Policy〉（皆本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 15（11/11 週三）的內容，原屬「第 8 週：請模型當裁判，再幫 agent 上護欄」導讀；以下保留拆分前的紀錄。
- 2026-10-23：逐篇補齊十份讀物的背景、獨立編輯判斷與實作練習；依完整論文釐清 AutoMetrics 流程及 AutoLibra redundancy 定義。
- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。
- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-12：補上 AutoLibra、CDI、prompt injection 與 RSP 四篇延伸閱讀的實質導讀，並標明 RSP 的歷史版本邊界。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 14 堂：LLM-as-Judge & Evaluation Infrastructure](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge)、[第 17 堂：Coding & Software Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Shao et al., PrivacyLens, NeurIPS 2024](https://arxiv.org/abs/2409.00138)、[Zhang & Yang, Searching for Privacy Risks via Simulation](https://arxiv.org/abs/2508.10880)、[Li, Agentic LLMs as Powerful Deanonymizers](https://arxiv.org/abs/2601.05918)、[Wen et al., Contextualized Privacy Defense](https://arxiv.org/abs/2603.02983)、[OpenAI, Understanding Prompt Injections](https://openai.com/index/prompt-injections/)、[Anthropic, Responsible Scaling Policy v1](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)、[Anthropic, current RSP](https://www.anthropic.com/responsible-scaling-policy)
