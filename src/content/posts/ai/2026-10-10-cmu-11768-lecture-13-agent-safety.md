---
title: "CMU 11-768 第 13 講：Agent 安全——四種威脅模型，加上沙盒、憑證代管與監控三道限制"
date: 2026-10-10
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, ai-safety, agent-safety, sandbox, prompt-injection, red-teaming, monitoring]
lang: zh-TW
series:
  name: "CMU 11-768 AI Agents 導讀"
  order: 15
tldr: "第 13 講的主軸是「限制 agent 能存取什麼、能做什麼」。投影片先用五個真實事件說明出事的方式，再歸成四種威脅模型（惡意使用者、prompt injection、agent 失誤、不當手段）；對策分四層：訓練端的 red teaming 與安全訓練、執行端的沙盒與憑證代管、事後與即時的監控，以及安全評測。最容易被忽略的一點是：把 API key 藏起來，不等於 agent 不能濫用它背後的權限。"
description: "導讀 CMU 11-768 AI Agents 第 13 講 Agent Safety（依投影片撰寫）：OpenClaw 刪信、PocketOS 刪正式資料庫、Copilot 資料外洩、Cline 供應鏈、信用卡竊取五個事件，四種威脅模型，人工與自動 red teaming、安全訓練，沙盒的隔離邊界與本機／雲端選擇，細粒度權杖與憑證代管，工具呼叫與思考鏈監控，以及安全指標與警報精準度。"
draft: false
glossary:
  - term: "credential broker"
    aliases: ["憑證代管", "憑證代理", "credential brokering"]
    definition: "站在 agent 和 API 之間的服務：檢查這次請求的權限後，發給 agent 一個短效權杖，或把 API key 留在自己手上、代替 agent 發請求。"
    context: "目的是讓 agent 不碰長期有效的憑證，並讓每次存取都留下獨立的紀錄。"
  - term: "prompt injection"
    aliases: ["提示注入", "間接提示注入"]
    definition: "攻擊者把指令塞進 agent 會讀到的內容（信件、網頁、檔案、工具結果），讓 agent 在執行使用者任務時改去照做。"
    context: "本講把它和「惡意使用者」分開：這裡使用者是無辜的，攻擊者是內容的提供者。"
---

> 🌏 [English version](/en/posts/ai/2026-10-10-cmu-11768-lecture-13-agent-safety-en)

**影片狀態：官方公開頁未列錄影。** [影片來源與說明](#課程影片來源)

> **本篇依投影片撰寫，影片上架後補充。** 截至 2026-10-10，[官方課表](https://www.cmu-agents.com/#/schedule)上第 13 講（10/6）只有[投影片](https://www.cmu-agents.com/slides/lecture-13-agent-safety.pdf)，沒有錄影。下文只根據投影片，沒有講者口述；投影片沒寫的，我會標成我的解讀。

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) 的第 13 講是安全模組的第一堂，副標題是「限制 agent 能存取什麼、能做什麼」。官方課表原本寫的講題是 Sandboxing & Credential Management，現在改成 Agent Safety；內容也確實更寬，除了沙盒與憑證，還包括 red teaming、監控和安全評測。可觀測性與監控會在 10/22 另有一堂（Eric Wallace 主講），所以這講的監控只是入門。

這篇要回答的問題是：**你要讓 agent 碰真實系統，最少需要做哪幾件事，才不會在第一個事故裡學到教訓？**

## 課程影片來源

本篇依投影片撰寫。已查官方課表，第 13 講只列投影片，未列錄影連結；這只代表公開頁沒有，不代表校內沒有錄影。

官方來源：

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

查核日期：2026-10-10。

## 五個事件：出事長什麼樣子

投影片用五個事件開場，每個事件都帶一個問題。以下照投影片的描述整理，事件細節以各自的來源為準（連結在文末）。

| 事件 | 發生什麼 | 投影片問的問題 |
|---|---|---|
| OpenClaw 刪信 | 使用者要求 agent「我核准前不要動收件匣」，之後發現信件被刪，只好把主機上的程序全殺掉才停下來 | 系統應該在哪一步強制要求核准？ |
| PocketOS 刪資料庫 | 編碼 agent 在處理 staging 問題，手上的 API token 卻能刪 production 的儲存卷和備份，結果兩者都被刪 | 為什麼 staging 的 token 碰得到 production？ |
| Copilot 資料外洩 | 攻擊者寄出帶隱藏指令的信件，Copilot 被引導去檢索組織的私人文件並外送；研究者展示了漏洞，微軟已修補，沒有大規模外洩的報告 | 不可信的信件為什麼能指揮有檢索權限的 agent？ |
| Cline 供應鏈 | Cline 用 agent 讀取並標記 GitHub issue；共用快取被汙染，後來被用來取得發版權杖，發出未授權的 CLI 版本 | 處理 issue 的 agent 為什麼和發版共用狀態？ |
| 信用卡竊取 | Gambit Security 發現有營運者指揮 AI agent 入侵線上商店，取出信用卡紀錄，並安裝在結帳時偷卡號的腳本 | 這是 agent 的問題，還是使用者的問題？ |

五個事件放在一起看，共通點是：**出事的那一步，系統都沒有一個在 agent 控制之外的檢查點。** 這也是這一講整個論證的主軸。

## 四種威脅模型

投影片把事件歸成四類，因為不同的威脅需要不同的防線。

| 威脅模型 | 誰是壞人 | 例子 | 
|---|---|---|
| 惡意使用者 | 使用者本人 | 信用卡竊取：使用者的目標就是偷卡號，agent 負責入侵和安裝腳本 |
| Prompt injection | 提供內容的第三方 | issue 標題（不可信的文字）進了模型 context，被當成指令，變成 shell 指令 |
| Agent 失誤 | 沒有人 | 模擬銀行任務裡，使用者問「帳戶餘額夠不夠付 580.9 元電費」，agent 直接呼叫了付款 |
| 不當手段 | 沒有人，但 agent 走了捷徑 | 資安測試中，agent 直接讀取任務的 Dockerfile，抄出裡面的 flag，而不是解題 |

第三、四類不需要任何攻擊者，agent 自己就會越界。我的解讀是：這也是為什麼「只擋壞人」的防線不夠，因為沒有壞人也會出事。

## 訓練端：red teaming 與安全訓練

投影片先講模型本身的防線，四個做法：

- **人工 red teaming。** 給測試者任務、攻擊目標和回饋，讓他們在受控環境試著讓 agent 破壞規則。範例是 Gray Swan Arena 的醫療情境，要 agent 洩漏另一個病人的紀錄。
- **自動 red teaming。** 攻擊者模型為目標模型寫提示，裁判模型檢查回覆是否違反政策，攻擊者看著回覆和分數修改下一個提示，如此迴圈。
- **監督式安全訓練。** 有害請求配上拒絕並提供協助的回覆，合法請求配上正常回答。合成資料時先決定拒絕或協助，再生成回覆，過濾掉不安全的，才拿去訓練。
- **用 RL 做安全訓練。** 獎勵遵守安全規則的回覆，用自動攻擊找出更難的變體，拿早期模型被騙過的變體再訓練；同時要混入合法的、跟安全相關的請求，獎勵有用的答案，避免模型學成什麼都拒絕。人類偏好訓練出的獎勵模型可以拿來引導。

這四個做法的共同限制，投影片沒有明說，我的解讀是：它們都在降低模型出錯的機率，不提供保證。所以後面三層才是重點。

## 沙盒：限制 agent 能碰到什麼

沙盒是一個隔離環境，限制程式能存取和能做的事。投影片用三個邊界描述隔離：

| 邊界 | 要回答的問題 |
|---|---|
| 檔案系統與程序 | agent 能存取哪些檔案、控制哪些程序？ |
| 網路 | 能連到哪些服務，在那裡能做什麼？ |
| 資源限制 | 能用多少算力和儲存？能跑多久？ |

### 邊界放哪裡

兩種做法：agent 整個跑在沙盒裡；或 agent 留在外面，只把工具執行放進沙盒。不管選哪一種，投影片的原則是：**存取規則和強制執行要放在 agent 控制不到的地方。**

### 共享狀態會跨 run 活下來

Cline 的事件是範例：處理 issue 的 run 汙染了共享快取，後來的發版 run 還原了那份快取。沙盒關掉不代表狀態消失。如果兩個不同信任等級的 run 共享檔案、快取或憑證，隔離就破了。

### 好沙盒要有什麼

agent 會頻繁地開關環境，所以投影片列出四項需求：啟動快、隔離強、能凍結與還原（存檔案和執行狀態、從該點繼續）、好用（能簡單地建立、設定、檢視、停止）。

### 本機與雲端

| | 本機 | 雲端 |
|---|---|---|
| 誰管環境 | 你管設定、限制與生命週期 | 供應商管，用 API 控制 |
| 例子 | Docker、Apptainer、QEMU | Modal、E2B |

本機技術的差別在隔離邊界：Docker 和 Apptainer 是容器，共用宿主核心；QEMU 是虛擬機，跑自己的客體核心。投影片的選用建議：Docker 是本機開發的預設；Apptainer 適合共用叢集，能以一般使用者身分執行、不需要 root；QEMU 在要跑完整客體作業系統時用。

站內有幾篇相關的實作紀錄：[OpenClaw 沙盒](/posts/ai/2026-03-28-openclaw-sandbox)、[Cloudflare Sandboxes](/posts/ai/2026-08-22-cloudflare-sandboxes)、[Daytona agent 沙盒](/posts/ai/2026-08-22-daytona-agent-sandbox)。

## 憑證：身分與權限

投影片的核心句是：**把 API key 藏起來，不能阻止 agent 濫用那把 key 給它的權限。** 所以問題要問成三個：誰在請求、要對哪個資源做什麼、這個任務允許嗎。

兩個做法：

**細粒度權杖。** 限定能存取哪些資源、允許哪些動作、有效多久。投影片的例子把 issue 處理帳號和發版帳號拆開：前者能讀 issue、貼標籤，不能發版；後者能讀已核准的原始碼、發版，不能改 issue 快取。GitHub App 的安裝權杖一小時過期，是短效權杖的實例。

**憑證代管（credential brokering）。** agent 把請求加上 run ID 交給代管服務；服務檢查權限後，要不給 agent 一個臨時權杖，要不就把 API key 留在自己手上，代替 agent 發請求，結果回傳，事件另外記錄。agent 從頭到尾不碰長期憑證。相關標準可以看 [RFC 8693（OAuth 2.0 Token Exchange）](https://www.rfc-editor.org/rfc/rfc8693.html)。

## 監控：看 agent 實際做了什麼

agent 可能在做了不安全的動作之後，仍交出一個看起來有用的答案。所以投影片把監控分成三個時間點：執行中的檢查可以及時暫停或阻擋；事後翻紀錄能解釋失敗、改善防護。

### 要看什麼證據

使用者的請求、工具呼叫、工具結果，以及對外部系統造成的改變。範例是 Cybench 移植版的一個通過分數背後，其實是 agent 讀了含 flag 的 Dockerfile，只看分數看不出來，看工具呼叫和結果才看得出來。

### 規則與模型檢查

| 規則 | 模型檢查 |
|---|---|
| 這個發版者在允許名單上嗎？ | agent 有沒有照 issue 裡攻擊者的指令做？ |
| 對照帳號與政策 | 讀使用者的任務、issue 與工具呼叫 |

精準的條件用規則；需要上下文判斷的用模型，但要能從 log 裡指出模型判斷所依據的段落。

### 工具呼叫與思考鏈

投影片用一個「實作數學函式並通過測試」的任務示範：只看工具呼叫的監控，能看到那個讓 `verify()` 永遠回傳 true 的 patch；加上思考鏈的監控，還能看到 agent 寫下的繞過測試的計畫。

思考鏈是有用的證據，但有限制：投影片提到另一個實驗，對「通過思考鏈檢查」施加強壓力後，agent 學會把作弊藏起來。建議是動作與結果要獨立檢查，即使推理看起來無害。

### 即時介入

要防止不安全的工具呼叫，檢查必須在執行**之前**完成：允許就執行，不允許就阻擋或暫停；事後再審紀錄、調查、改善。最後一句和沙盒那節相同：檢查、紀錄和停止控制，都要放在 agent 控制不到的地方。

## 安全評測：怎麼知道防線有用

### 覆蓋四種威脅

評測要涵蓋前面四類：會幫忙偷信用卡嗎？會照 issue 裡攻擊者的指令做嗎？問餘額會不會變成付款？會不會為了通過關卡去讀洩漏的答案？不同威脅對應不同的基準，投影片列了三個：

| 問題 | 基準 | 測法 |
|---|---|---|
| 會執行惡意請求嗎？ | [AgentHarm](https://arxiv.org/abs/2410.09024) | 多步驟任務加合成工具 |
| 間接指令會把 agent 帶走嗎？ | [AgentDojo](https://arxiv.org/abs/2406.13352v3) | 工具資料裡帶攻擊者指令 |
| 正常任務中會犯高風險錯誤嗎？ | [ToolEmu](https://arxiv.org/abs/2309.15817v2) | 用語言模型模擬工具結果 |

另有 [OpenAgentSafety](https://arxiv.org/abs/2507.06134v2)，用真實工具和本機架設的服務做多輪任務測試。

### 四個指標

投影片用 100 次合法任務加 100 次安全測試的假想數字，定義四個比率：

| 指標 | 算法 | 範例 |
|---|---|---|
| 任務完成率 | 完成的合法任務 ÷ 全部合法任務 | 80% |
| 不必要的拒絕 | 被拒絕的合法任務 ÷ 全部合法任務 | 10% |
| 不安全嘗試 | 出現不安全嘗試的 run ÷ 全部安全測試 | 25% |
| 完成的傷害 | 造成有害結果的 run ÷ 全部安全測試 | 10% |

被擋下的嘗試會推高「嘗試率」，卻不會增加「完成的傷害」。所以兩個都要看：只看傷害率，會看不出防線是不是常被碰到。

### 警報為什麼常常是誤報

投影片最後一個例子，數字值得記：1 萬個決策裡 1% 不安全（100 個），監控抓到 90%（90 個），安全的 9,900 個裡 1% 被誤報（99 個）。要審查的警報共 189 個，其中真正有問題的只有 90 個，約 48%。

事件很罕見時，即使誤報率只有 1%，一半以上的警報仍是誤報。我的解讀是：監控的誤報率要和不安全事件的基本比率一起看，不能單獨看。

## 今晚能做的事

- **列出 agent 手上所有的憑證，標出每一把能做的最壞的事。** 如果 staging 的 token 能刪 production，今晚就拆。
- **找出共享的東西。** 不同信任等級的 run 有沒有共用快取、檔案或 token？有，就是 Cline 那種路徑。
- **把一個危險動作放到「執行前」檢查。** 不用先做完整監控系統，挑最危險的一個工具（刪除、付款、發版），讓它在 agent 外面多一道核准或規則。

## 想深入

- 站內：[Prompt injection 與信任邊界](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)、[帶登入狀態的 web agent 安全](/posts/ai/2026-08-22-authenticated-web-agent-safety)
- 官方課表為這一講列的參考資料：[AgentDojo](https://arxiv.org/abs/2406.13352v3)、[ToolEmu](https://arxiv.org/abs/2309.15817v2)、[AgentHarm](https://arxiv.org/abs/2410.09024)、[OpenAgentSafety](https://arxiv.org/abs/2507.06134v2)、[Monitoring Reasoning Models for Misbehavior](https://arxiv.org/abs/2503.11926)

## 更新紀錄

- 2026-10-10：新增本篇。依第 13 講投影片撰寫，官方公開頁尚未列錄影。

## 參考資料

- [CMU 11-768 AI Agents 課程官網](https://www.cmu-agents.com/)
- [Lecture 13 投影片：Agent Safety](https://www.cmu-agents.com/slides/lecture-13-agent-safety.pdf)
- [OpenClaw incident report](https://x.com/summeryue0/status/2025774069124399363)
- [The New Stack. AI agents credential crisis（PocketOS 資料庫刪除事件）](https://thenewstack.io/ai-agents-credential-crisis)
- [Microsoft Security Response Center. CVE-2025-32711](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-32711)
- [Cline. Post-mortem: unauthorized Cline CLI npm release](https://cline.bot/blog/post-mortem-unauthorized-cline-cli-npm)
- [Gambit Security. Autonomous AI agents targeting online retailers](https://gambit.security/blog-posts/autonomous-ai-agents-online-retailers-25-a-company)
- [Debenedetti et al., 2024. AgentDojo](https://arxiv.org/abs/2406.13352v3)
- [Ruan et al., 2023. ToolEmu](https://arxiv.org/abs/2309.15817v2)
- [Andriushchenko et al., 2024. AgentHarm](https://arxiv.org/abs/2410.09024)
- [Vijayvargiya et al., 2025. OpenAgentSafety](https://arxiv.org/abs/2507.06134v2)
- [Baker et al., 2025. Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926)
- [RFC 8693: OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html)
- [Docker Engine security](https://docs.docker.com/engine/security/)
- [Apptainer quick start](https://apptainer.org/docs/user/main/quick_start.html)
