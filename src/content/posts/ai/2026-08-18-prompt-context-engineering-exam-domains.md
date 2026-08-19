---
title: "prompt 與 context engineering 的考法：十張證照怎麼問，跟實務差在哪"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, prompt-engineering, context-engineering, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 19
tldr: "多數人以為 GenAI 證照的主軸是 prompt 寫作，但 CCAO-F 的 Prompting 只有 14%，輸出評估卻有 21%；CCDV-F 的 Prompt and Context Engineering 只有 11%。真正被考的是結構化輸出、防禦性 prompt、動態 context 注入、context 壓縮與快取、prompt 生命週期治理，以及「prompt 改了怎麼證明變好」——這六件事比較接近 context engineering 與軟體工程，而不是寫作技巧。另外沒有任何一張要你現場寫 prompt，全是選擇題，所以練「說得出為什麼」比練手感有用。最該記住的一條來自 CCAR-F：業務邏輯必須被保證時，「先改 prompt」通常是錯誤選項。"
description: "跨十張 AI 證照的 prompt 與 context engineering 考點整理：比對 AWS AIF-C01 / AIP-C01、微軟 AI-500 / AB-100 / AB-620、NVIDIA NCA-GENL / NCP-GENL、Claude CCAO-F / CCAR-F / CCDV-F 的官方考綱，說明六個共同核心、四家名詞對照、考試問法與實務做法的落差，以及哪些東西不能互相轉移。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains-en)
>
> 本文是從官方資料建出來的備考材料，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回各家官方 exam guide 或 study guide，來源逐條列在文末。查證日期：2026-08-18。

這是 [AI 證照備考系列](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)的技術深潛篇，接在[多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)後面。

先講最反直覺的一件事：**prompt 在這些證照裡佔的比例，比大家想的小。**

[CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide) 是四張 Claude 認證裡唯一不要求寫程式的一張，直覺上應該最像「prompt 證照」——結果它的 **Prompting and Task Execution 只有 14%，而 Output Evaluation and Validation 有 21%**。[CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide) 的 **Prompt and Context Engineering 是 11.0%**，比 Applications and Integration 的 33.1% 小了三倍。

更關鍵的是**這 11% 到 20% 裡面裝的是什麼**。翻開官方條目，裡面幾乎沒有「怎麼寫出好句子」，全是 token 預算、compaction、context 隔離、JSON schema、版本控制、注入防禦。**這些是 context engineering 與軟體工程，不是寫作。**

## 十張證照，prompt 與 context 各佔多少

| 證照 | 相關 domain 與條目 | 權重 |
|---|---|---|
| [Claude CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide) | Domain 4 Prompt Engineering & Structured Output | **20%** |
| 同上 | Domain 5 Context Management & Reliability | 15% |
| [Claude CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide) | Prompting and Task Execution | **14%** |
| 同上 | Output Evaluation and Validation（含「迭代 prompt 以改善品質」） | 21% |
| [Claude CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide) | Prompt and Context Engineering | **11.0%** |
| [微軟 AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)（beta） | Develop 裡的「進階 prompt 工程」與「記憶、context 管理與知識整合」 | 該塊共 **30–35%** |
| 同上 | Evaluate 裡的 context window 失效模式診斷與 prompt 評估 | 該塊共 20–25% |
| [NVIDIA NCP-GENL](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide) | Prompt Engineering（唯一以此命名的獨立領域） | **13%** |
| [NVIDIA NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide) | 無獨立領域，「用 prompt engineering 原則寫 prompt」在 Core ML 條目層 | 該塊共 30% |
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide) | 2.1.5 context engineering（v1.1 新增） | 第 2 章 24% |
| 同上 | 3.x prompt 技巧與風險、3.2.5 Bedrock Prompt Management | 第 3 章 **28%** |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide) | 1.6 Prompt 工程與治理 | 第 1 章 **31%** |
| 同上 | 4.1 prompt 壓縮與 context pruning；5.2 context window 溢位與 prompt 版本比較 | 12% / 11% |
| [微軟 AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide) | Plan 裡的「提供 prompt library 的建立準則」 | 該塊共 25–30% |
| 同上 | Design 裡的「prompt 與回應型 agent」「agent flow 與 prompt action」 | 該塊共 25–30% |
| [微軟 AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide) | Topics 裡用**自訂 prompt** 設定進階回應 | 該塊共 30–35% |
| 同上 | 讓自訂 prompt 使用 Foundry model catalog | 該塊共 40–45% |

**讀這張表要注意兩件事。**

第一，**只有 NCP-GENL 有一個叫「Prompt Engineering」的獨立領域**（13%）。其他九張都把 prompt 拆散進別的領域——這代表你在考綱目錄裡搜 "prompt" 找不到東西，不等於它不考。

第二，**CCAO-F 的 14% 嚴重低估了實際比重**。它把 prompt 相關能力拆到四個地方：Prompting 14% 只有兩條（為商業與技術任務寫 prompt、用任務分解結構化複雜請求），但 Output Evaluation（21%）裡有「迭代 prompt 以改善品質」與「依任務型態調整策略」，Configuration and Knowledge Management（12%）裡有「撰寫有效的系統層級指示」，Product and Model Selection（12%）裡有「理解與管理 context 限制與記憶考量（何時該重開、摘要或持久化）」。**加起來遠超過 14%，但沒有一條在考句子怎麼寫。**

**要點回指**：CCAR-F Domain 4（20%）+ Domain 5（15%）、CCAO-F Prompting（14%）、CCDV-F Prompt and Context Engineering（11.0%）、NCP-GENL Prompt Engineering（13%）、AI-500 Develop（30–35%）、AIF-C01 第 2–3 章（24% + 28%）、AIP-C01 第 1 章（31%）。

## 共同核心：六件所有考綱都在問的事

### 一、結構化輸出，不是「請用 JSON 回我」

**CCAR-F 的 Domain 4 名字裡就有 Structured Output**，而且給了最具體的答案：用 `tool_use` 加 JSON schema，不要求 Claude 輸出 JSON 字串。`tool_choice` 三個選項各有適用場景——`"auto"` 讓模型自己決定（可能回純文字）、`"any"` 保證會呼叫某個工具、`{"type": "tool", "name": ...}` 強制特定工具。

**這個 domain 最容易被漏掉的一句是**：`tool_use` 消除 JSON 語法錯誤，**但不消除語意錯誤**（例如 line items 加總不等於 total），語意驗證要另外實作，並配 validation-retry loop。

其他家的等價考點：

- **AIP-C01** 把「JSON Schema 結構化輸出」放進 3.1 的**降低幻覺組合拳**裡——官方要的是 Knowledge Base grounding + 事實查核 + 信心分數 + 結構化輸出四件一起，不是單一技巧
- **NCP-GENL** 用的是完全不同的詞：**設計包住 LLM 的模組，內建驗證與受限解碼**，以提升一致性、減少幻覺。「受限解碼」（constrained decoding）這個詞只有 NVIDIA 這張用
- **AI-500** 沒有「結構化輸出」這個措辭，最接近的是工具生態那條的**工具結果驗證與品質檢查**

**要點回指**：CCAR-F Domain 4（20%）、AIP-C01 第 3 章（20%）、NCP-GENL Prompt Engineering（13%）、AI-500 Develop（30–35%）。

### 二、防禦性 prompt：注入、越獄、輸入清洗

四家都考，措辭各自不同，但講的是同一個信任邊界問題。

- **AWS AIF-C01** 把 prompt 的風險逐一命名：**曝露（exposure）、poisoning、hijacking、jailbreaking**，這組四字詞在其他家考綱裡找不到
- **AIP-C01** 要求得更細：3.1 的 **prompt injection 與 jailbreak 偵測、輸入清洗、安全分類器、自動化對抗測試**，以及縱深防禦的四層（Comprehend 前置過濾、模型端 guardrail、Lambda 後處理、API Gateway 回應過濾）
- **AI-500** 的措辭是進階 prompt 工程裡的**防禦性準則**，只有短短一詞，但它同一塊還有 shift-left 安全與 AI Red Teaming Agent
- **AB-100** 從架構師角度切：**分析方案與 AI 的漏洞與緩解，含 prompt manipulation**
- **CCDV-F** 的 Security and Safety（8.1%）寫的是 **prompt injection 的認知與緩解、jailbreak 防禦、不可信輸入處理**；輸入清洗則被放在 Prompt and Context Engineering 那 11% 的 prompt 原則裡

**注意 CCDV-F 這個切法**：輸入清洗被歸類成 **prompt 原則**而不是安全機制。這是個很值得記的分類——它把「怎麼組 prompt」跟「怎麼防注入」當成同一件事的兩面。站內的 [agent 安全：prompt injection 與信任邊界](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)有實務脈絡。

**要點回指**：AIF-C01 第 3 章（28%）與第 5 章（14%）、AIP-C01 第 3 章（20%）、AI-500 Develop（30–35%）與 Secure（20–25%）、AB-100 Deploy（40–45%）、CCDV-F Security and Safety（8.1%）。

### 三、動態 context 注入與 grounding

**AI-500 的措辭最直接**：進階 prompt 工程那條裡明列**動態 context 注入**，同一塊的記憶與 context 管理則要求掌握 context 的**累積、檢索、注入、壓縮**四個動作，加上供多 agent 消費的知識整合（搜尋、RAG、MCP 可取得的來源、語意搜尋）。

其他家：

- **AIP-C01** 的 1.6 有一組「互動式脈絡」的具體做法：Step Functions 的澄清流程、Comprehend 意圖辨識、DynamoDB 存對話歷史
- **CCAR-F** 給的是反面教訓——**subagent 不會自動繼承 coordinator 的對話歷史，必須在 prompt 裡明確傳入**；以及 Domain 5 的 **structured facts block**：客服情境裡日期、金額、訂單號碼、狀態這類事實性資料不該被摘要掉，要以未壓縮的區塊每次附上
- **AIF-C01** 是唯一把 **context engineering 直接列成一條目標**的（2.1.5），而且是 2026 年 4 月 30 日 v1.1 才新增的——**目錄裡沒有這個詞的教材就是舊版**

站內的 [context engineering 指南](/posts/ai/2026-03-24-context-engineering-guide)與 [Stanford CS146S 的 context engineering](/posts/ai/2026-08-16-cs146s-context-engineering)是這塊最直接的背景補充。

**要點回指**：AI-500 Develop（30–35%）、AIP-C01 第 1 章（31%）、CCAR-F Domain 5（15%）、AIF-C01 第 2 章（24%）。

### 四、壓縮、修剪與快取——這塊實際上是成本考題

**這是本文最想強調的一節**：多數人把 context 管理當成品質問題，但考綱把它當**成本與可靠性**問題。

- **CCDV-F** 的 11% 裡，第一條是 **token 預算與成本管理**（用量追蹤、成本建模、**prompt caching 與 cache check-pointing**），第二條是**防止 context 漂移與膨脹**（工具輸出修剪、**compaction**），第三條是**用 subagent 或多步流程做 context 隔離**。三條有兩條半在講成本
- **AIP-C01** 的 4.1 更明確：token 估算與追蹤、**context window 最佳化、回應長度控制、prompt 壓縮與 context pruning**，加上**語意快取、結果指紋、邊緣快取、確定性請求雜湊、prompt caching**
- **AI-500** 的編排塊列了三種快取：**prompt caching、語意快取、回應快取**；可觀測性塊則有 **token 用量最佳化（token 上限、迴圈控制、工具呼叫）**
- **AIF-C01** 在 FM 選擇準則裡把 **prompt caching** 列為選型因素之一，並在 v1.1 新增 **token 計價與成本效能關係**
- **CCAR-F** 的做法偏操作：`/compact` 壓縮、把關鍵發現存 scratchpad 檔案、用 subagent 探索只回傳摘要

**三家用三個詞講同一件事**：Anthropic 說 compaction，AWS 說 prompt 壓縮與 context pruning，微軟說壓縮。看到任何一個，另外兩個就不用重讀。

**要點回指**：CCDV-F Prompt and Context Engineering（11.0%）、AIP-C01 第 4 章（12%）、AI-500 Develop（30–35%）與 Evaluate（20–25%）、AIF-C01 第 2–3 章。

### 五、prompt 的生命週期：版控、library、審核

**這是考綱明顯領先多數團隊實務的一塊。** 考試把 prompt 當成一個有版本、有審核流程、有儲存庫的資產，而不是程式碼裡的字串常數。

- **AIP-C01** 的 1.6 給了最完整的一份：**參數化模板、審核流程、S3 儲存庫、CloudTrail、CloudWatch Logs**，以及 **Bedrock Prompt Flows** 的 prompt 鏈、條件分支與可重用元件
- **AIF-C01** 用 **Bedrock Prompt Management 做 prompt 版本管理**（3.2.5）
- **AI-500** 的措辭是 **prompt 生命週期管理**
- **AB-100** 從治理角度：**提供 prompt library 的建立準則**（Plan 那塊）
- **CCDV-F** 把 **prompt 版控**列在設定管理裡，跟 CLAUDE.md、settings.json、模型版本釘選並列

**AB-620 的角度不一樣**，值得單獨標：它的自訂 prompt 是**產品裡的一個可設定物件**——在 topic 裡用自訂 prompt 設定進階回應，以及讓自訂 prompt 使用 Foundry model catalog。低程式碼線考的是「在哪個 UI 設定它」，不是「怎麼管理它的版本」。

**要點回指**：AIP-C01 第 1 章（31%）、AIF-C01 第 3 章（28%）、AI-500 Develop（30–35%）、AB-100 Plan（25–30%）、CCDV-F Applications and Integration（33.1%）、AB-620 Plan and configure（30–35%）與 Integrate（40–45%）。

### 六、prompt 改了，怎麼證明它變好

四家都要求你能回答「這個 prompt 改動有沒有效」，而且都不接受「看起來比較好」。

- **AI-500** 的措辭最乾淨：**針對記憶、知識、工具、prompt 分別做評估**——四個維度分開評，不混在一起
- **AIP-C01**：**prompt 的 QA 與回歸測試**（1.6）、**prompt 測試框架與版本比較**（5.2）、用 Prompt Management 與 Prompt Flows 做 **A/B**、**LLM-as-a-judge 自動評估**（3.4），以及 CloudWatch 追蹤 **prompt 有效性**與**幻覺率**
- **CCAO-F** 把「**迭代 prompt 以改善品質**」放在權重最高的 Output Evaluation（21%）而不是 Prompting（14%）——**這個歸類本身就是考點的暗示**
- **CCDV-F** 的 Eval, Testing, and Debugging 只有 **2.6%**，是八個領域裡最小的一塊

最後那條要小心解讀：**CCDV-F 的 eval 權重低，不代表 Anthropic 認為 eval 不重要**——官方對這張的 Intended Audience 描述裡就寫了「設計並執行 eval」是應具備能力。它只是不在這張考試的計分重心上。

站內的 [prompt 迭代方法](/posts/ai/2026-03-13-prompt-engineering-iteration-guide)可以補這塊的實作流程。

**要點回指**：AI-500 Evaluate（20–25%）、AIP-C01 第 1 章（31%）／第 3 章（20%）／第 5 章（11%）、CCAO-F Output Evaluation（21%）、CCDV-F Eval, Testing, and Debugging（2.6%）。

## 同一件事，四家四個名字

| 概念 | AWS（AIF／AIP） | 微軟（AI-500／AB-100／AB-620） | NVIDIA（NCP-GENL） | Anthropic（CCAR-F／CCDV-F／CCAO-F） |
|---|---|---|---|---|
| 結構化輸出 | JSON Schema 結構化輸出（降幻覺組合拳之一） | 工具結果驗證與品質檢查 | 受限解碼、包住 LLM 的驗證模組 | `tool_use` + JSON schema、`tool_choice` |
| 少樣本與模板 | prompt 技巧（CoT、zero／single／few-shot、模板） | 進階 prompt 工程的「範例」 | zero／one／few-shot、prompt learning、CoT | few-shot（明列在 prompt 原則） |
| 動態脈絡 | 互動式脈絡（Step Functions／Comprehend／DynamoDB）、Knowledge Base grounding | **動態 context 注入**、累積／檢索／注入／壓縮 | 未點名 | subagent 需明確傳入 context、structured facts block |
| 壓縮與修剪 | prompt 壓縮與 context pruning、context window 最佳化 | 壓縮（context 管理四動作之一） | 未點名 | compaction、工具輸出修剪、`/compact` |
| 快取 | prompt caching、語意快取、結果指紋、邊緣快取 | prompt caching、語意快取、回應快取 | 未點名 | prompt caching 與 cache check-pointing |
| 版控與治理 | Bedrock Prompt Management、Prompt Flows、S3 儲存庫與審核流程 | **prompt 生命週期管理**、**prompt library 建立準則**、prompt action | 未點名 | prompt 版控（與 CLAUDE.md、settings.json 並列） |
| 防禦 | 曝露／poisoning／hijacking／jailbreaking、輸入清洗、安全分類器 | 防禦性準則、prompt manipulation | 未點名 | prompt injection 緩解、輸入清洗（歸在 prompt 原則） |
| context 失效診斷 | context window 溢位、動態 chunking、截斷錯誤 | **sliding-window amnesia／summary drift／vector-only recall／entity continuity** | 未點名 | lost-in-the-middle、長 session 的 context 退化 |
| 改動的驗證 | prompt QA 與回歸測試、版本比較、A/B、LLM-as-a-judge | 記憶／知識／工具／prompt 分開評估 | 未點名（Evaluation 自成 7% 的領域） | 迭代 prompt 以改善品質（CCAO-F 21% 那塊） |

**NVIDIA 那欄大量「未點名」不是疏漏**，是 NCP-GENL 的 Prompt Engineering 只有三條目標：模板設計（含 CoT 與 prompt learning）、zero／one／few-shot、受限解碼模組。官方 PDF 在這塊還跳過了 2.3 這個編號、沒公布內容——**這是一份不完整的考綱，準備時要有心理準備**。

## 考試怎麼問，跟實務怎麼做

這一節是本文的重點。前面六件事在實務上都成立，但**考試問它們的方式跟你平常做事的方式不一樣**。

**一、考試給症狀要你選診斷，不會給你 prompt 讓你改。** AI-500 把四種 context window 失效模式逐一命名（sliding-window amnesia、summary drift、vector-only recall、entity continuity），命名的用途就是出題：給你「跨輪次的人名指涉接不上」，要你答 entity continuity。**這種題型獎勵詞彙，不獎勵手感。**

**二、「先改 prompt」通常是錯誤選項。** 這是 CCAR-F 最重要的一條，也是最反工程師直覺的一條：**當某個工具呼叫順序是業務邏輯的必要條件時，正確答案是用程式碼強制執行，不是在 prompt 裡加更多指示。** 官方的例子是「必須先驗證客戶身分才能退款」——只在 prompt 寫「請先呼叫 `get_customer`」，一定機率會被跳過；正確做法是在 `lookup_order` 與 `process_refund` 的 hook 裡檢查 `get_customer` 是否執行過。

**這條在實務上同樣成立，而且是本文所有內容裡最該直接搬進工作的一條。** prompt 是機率性的，業務規則需要確定性；能用程式碼保證的事，不要交給 prompt。

**三、模糊指示無效，明確標準才有效。** CCAR-F 明講「只回報高信心的問題」或「保守一點」不會降低 false positive 率，要改成逐條列舉：REPORT 什麼、SKIP 什麼、什麼算 HIGH、什麼算 MEDIUM。這條考試與實務完全一致，可以直接用。

**四、工具選錯的 root cause 是描述不清，不是缺 routing classifier。** 這是 CCAR-F sample question 反覆出現的陷阱——看到「agent 選錯工具」的情境，先想工具描述，不要先加一層分類器。站內的 [自動最佳化工具描述](/posts/ai/2026-06-04-auto-prompt-optimization-tool-descriptions)是同一個主題的實作面。

**五、考綱把 prompt 當受治理的資產，多數團隊還把它當字串常數。** AIP-C01 要求 S3 儲存庫、審核流程、CloudTrail 稽核、回歸測試；AB-100 要求你能訂出 prompt library 的建立準則。**這塊是考綱領先實務的地方**——如果你的團隊 prompt 散在程式碼裡沒有版本，考試會問到你沒做過的事。

**六、沒有任何一張要你現場寫 prompt。** 這十張全是選擇題（CCAR-F 是單選與複選混合，每題標明選幾個）。**所以「prompt 寫得好」不加分，「說得出為什麼這樣寫」才加分。** 準備方式要跟著改：與其收集提示詞模板，不如針對每個技巧問自己「它解決哪個失效模式、什麼時候不該用」。

**要點回指**：AI-500 Evaluate（20–25%）、CCAR-F Domain 1（27%）與 Domain 4（20%）、AIP-C01 第 1 章（31%）、AB-100 Plan（25–30%）。

## 不能互相取代的部分

**AI-500 獨有**：四種 context window 失效模式的名詞、「prompt 生命週期管理」這個措辭、prompt／語意／回應三種快取的分法、「針對記憶、知識、工具、prompt 分別評估」的四維切法。

**AWS 獨有**：**Bedrock Prompt Management** 與 **Bedrock Prompt Flows** 這兩個產品（版本管理、prompt 鏈、條件分支、可重用元件）、prompt 風險四詞（曝露／poisoning／hijacking／jailbreaking）、「prompt 壓縮與 context pruning」這個條目、以及把 **context engineering 直接列成一條考試目標**（AIF-C01 2.1.5，v1.1 新增）。

**NVIDIA 獨有**：**受限解碼**（constrained decoding）、**prompt learning**（小資料集或專門領域）、以及把 Prompt Engineering 當成一個 13% 的獨立領域這件事本身。

**Anthropic 獨有**：`tool_choice` 的三個選項與各自語意、「`tool_use` 消除語法錯誤但不消除語意錯誤」、validation-retry loop、structured facts block（不該被摘要的事實區塊）、`/compact`、`context: fork`、以及 provenance 要求——**兩個來源數字衝突時不要選一個，兩個都保留並標注來源**。這些多半是 SDK 與產品層細節，換平台就不成立。

**微軟低程式碼線獨有**：**prompt action**、**prompt 與回應型 agent** 這個 agent 分類（跟任務型、自主型並列）、以及讓自訂 prompt 綁 **Foundry model catalog**。

## 一份練習清單

這份清單對應上面六件事，**做完能蓋掉共同核心，蓋不掉獨有那節**：

1. 拿一個抽取任務，用 **JSON schema 強制結構化輸出**，再刻意餵一份會讓總和對不上的資料，確認語法正確但語意錯誤會發生 →（一）
2. 在同一個抽取器外面加 **validation-retry loop**，最多重試三次，記錄每次失敗原因 →（一）
3. 對自己的 agent 做一次注入測試：把惡意指示藏在工具回應裡，看它會不會照做；再加輸入清洗與輸出過濾各測一次 →（二）
4. 把一段長對話拆成「**不可摘要的事實區塊**」與「可壓縮的歷史」，比較兩種做法在第 20 輪的事實正確率 →（三）
5. 對同一個工作負載量測三種成本：無快取、prompt caching、語意快取，並寫下各自的失效條件 →（四）
6. 把所有 prompt 移出程式碼，放進一個有版本號的儲存庫，改動走 review；至少留一次「回滾到前一版」的紀錄 →（五）
7. 為一個 prompt 建 **10–20 題的回歸測試集**，改動前後各跑一次，用 LLM-as-a-judge 加人工抽查，說得出「變好」的證據 →（六）
8. 最後做一次反向練習：找一個你目前**用 prompt 指示模型「一定要先做 X」**的地方，改成程式碼強制執行 →（考試怎麼問那節的第二條）

補獨有考點的最短路徑：AWS 線讀 [AIF-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) 與 [AIP-C01 的官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)；微軟線讀 [AI-500 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)；NVIDIA 線只有[認證頁與 PDF](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/)；Claude 線讀 [Agent SDK 文件](https://platform.claude.com/docs/en/agent-sdk/overview)。

## 只讀一份的話，讀哪一份

**[AIP-C01 的官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)。** 理由是它把 prompt 的**治理面**寫得最完整——1.6 一節就涵蓋參數化模板、審核流程、儲存庫、稽核日誌、QA 與回歸測試、prompt 鏈，這些在其他家考綱裡是散落的一兩個詞。而且它是免費公開網頁。

**但它的偏誤也最明顯**：整份繞著 Bedrock 的產品名轉。想要不綁產品的版本，讀 CCAR-F 的 Domain 4 與 Domain 5——那兩塊的概念（結構化輸出、lost-in-the-middle、事實區塊、provenance）換平台仍然成立，只有 API 名稱要換。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| AIF-C01 考綱版本 | v1.1，2026-04-30 生效，新增 context engineering 等七條 | 每季 |
| CCAO-F 七領域權重 | 21 / 16 / 15 / 14 / 12 / 12 / 10 | 每季 |
| CCAR-F 五領域權重 | 27 / 18 / 20 / 20 / 15（Exam Guide v1.0, Effective July 2026） | 每季 |
| CCDV-F 八領域權重 | 33.1 / 16.8 / 14.7 / 11.0 / 10.6 / 8.1 / 3.1 / 2.6 | 每季 |
| AI-500 狀態與權重 | 仍是 beta；四塊 15-20 / 30-35 / 20-25 / 20-25 | 每月 |
| NCP-GENL 考綱完整度 | 官方 PDF 的 Prompt Engineering 跳過 2.3 編號，未公布內容 | 開放報名時 |
| AWS 的 prompt 產品名 | Bedrock Prompt Management、Bedrock Prompt Flows | 每季 |
| AB-100 / AB-620 權重 | 25-30 / 25-30 / 40-45；30-35 / 40-45 / 20-25 | 每季 |

## 參考資料

- [AWS AIF-C01 官方 exam guide（五章權重與逐條目標）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AWS AIF-C01 exam guide 修訂紀錄（v1.1 新增條目）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS AIP-C01 官方 exam guide（含 1.6 prompt 工程與治理）](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [微軟 AI-500 官方 study guide（進階 prompt 工程與 context 管理條目）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [微軟 AB-100 官方 study guide（prompt library 建立準則）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [微軟 AB-620 官方 study guide（自訂 prompt 與 Foundry model catalog）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [NVIDIA NCP-GENL 官方認證頁（十個領域與 Prompt Engineering 13%）](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/)
- [NVIDIA NCA-GENL 官方認證頁（五塊權重）](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [Claude Certified Associate – Foundations 官方認證頁（含 exam guide 下載）](https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification)
- [Claude Certified Architect – Foundations 官方認證頁（含 exam guide 下載）](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
- [Claude Certified Developer – Foundations 官方認證頁（含 exam guide 下載）](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [Claude Agent SDK 文件](https://platform.claude.com/docs/en/agent-sdk/overview)

**站內相關**

- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Claude Certified Associate（CCAO-F）備考路徑](/posts/ai/2026-08-18-claude-certified-associate-prep-guide)
- [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
- [Claude Certified Developer（CCDV-F）備考路徑](/posts/ai/2026-08-18-claude-certified-developer-prep-guide)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
- [AWS AIF-C01 備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [AWS AIP-C01 備考路徑](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [NVIDIA NCP-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide)
- [context engineering 指南](/posts/ai/2026-03-24-context-engineering-guide)
- [prompt engineering 迭代方法](/posts/ai/2026-03-13-prompt-engineering-iteration-guide)
- [Stanford CS146S：context engineering](/posts/ai/2026-08-16-cs146s-context-engineering)
- [當 prompting 不再有效](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)
- [agent 安全：prompt injection 與信任邊界](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)
- [自動最佳化工具描述](/posts/ai/2026-06-04-auto-prompt-optimization-tool-descriptions)
- [agent 的 context 與記憶失效](/posts/ai/2026-08-10-agent-context-memory-failure)
