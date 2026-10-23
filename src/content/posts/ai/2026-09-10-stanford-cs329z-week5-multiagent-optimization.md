---
title: "該單幹還是開會——多智慧體與優化三軸｜Stanford CS329Z 第 5 週"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, compound-ai-systems]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 6
tldr: "Lecture 08 拆開編排、通訊與協調，教你用 task ledger 和 worktree 管理分工；Lecture 09 從資料與評估出發，比較 context 優化、SFT、RL 與蒸餾。透過可追溯的 email 例子，判斷多加 agent 或優化哪一層才對準瓶頸。"
description: "帶讀 Stanford CS329Z Week 5 兩堂課：AutoGen 的 conversable agent 與 conversation programming，GEPA 的反思式 prompt 演化與 test-time compute 的按難度分配，以及它們如何收斂成 HW1 收尾時的三選一。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

本次導讀以 Lecture 08–09 完整投影片文字與指定閱讀為底本；先備是 [Week 4 的 agent 迴圈與記憶分層](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory)。

一個模型解不開的題目，直覺解法是多找幾個模型來分工。一個寫程式、一個跑程式、一個負責挑錯，就像開一場會。這就是 multi-agent 在吵的事：什麼時候一個人做完就好，什麼時候值得開會。

但開過會的人都知道，會議本身有成本。誰先發言、結論誰寫、錯了算誰的，一樣都少不了。模型開會也一樣，而且錯得更安靜：上游 agent 的幻覺，會變成下游 agent 深信不疑的事實。週一（10/19，Multi-Agent Systems）的主讀物是 Wu 等人的 [AutoGen](https://arxiv.org/abs/2308.08155)（COLM 2024）：把開會規則寫成程式的框架。

週三（10/21，Optimization）換了一個問題：不管單幹還是開會，可以先從三個地方檢查系統。改 prompt（換說明書）、改權重（換腦袋）、加推理算力（想久一點）。主讀物是 Snell 等人的 [test-time compute 論文](https://arxiv.org/abs/2408.03314)（ICLR 2025）與 Agrawal 等人的 [GEPA](https://arxiv.org/abs/2507.19457)。時間點很現實：[HW1 在 10/30 截止](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，這是交卷前最後一個完整週。這篇幫你決定力氣花在哪一軸。

## 單體 vs 多體：AutoGen 把分工寫成對話

AutoGen 的核心抽象有兩個，[開源實作](https://github.com/microsoft/autogen)可以直接玩。第一是 conversable agent：每個 agent 都能收訊息、做事、回訊息，後端可以是 LLM、人、工具或混搭。內建最常用的兩個是 AssistantAgent（LLM 主力，負責想和寫）與 UserProxyAgent（人或工具的代理，負責跑 code、回傳結果、必要時找人）。

第二是 conversation programming：複雜流程不寫成管線，寫成 agent 之間的對話。計算（收到訊息後做什麼）與流程控制（訊息傳給誰、何時停）都繞著對話轉。機制是統一的 send/receive 加上 generate_reply，再配 auto-reply：收到訊息就自動回，除非觸發終止條件。

控制手段有兩種，程式和自然語言混用。自然語言控制寫在 system message 裡，例如叫 agent 修好錯誤再交、做完回 TERMINATE。程式控制寫在 Python 裡，例如最大回覆輪數與工具執行邏輯。兩種可以互轉：在 code 裡呼叫一次 LLM 就是切到自然語言，LLM 吐一個 function call 就是切回程式。

三個應用裡最好記的是 [ALFWorld](https://arxiv.org/abs/2010.03768) 那個：雙 agent 卡在重複錯誤迴圈時，多掛一個專門補常識的 grounding agent，成功率平均漲 15%。分工的價值不在人多，在有人專門負責大家都忽略的那件事。

**怎麼做**：先別拆。拿 HW1 的 email 助理跑 20 題，把失敗分成兩堆：單一步驟錯、後面跟著全錯。只有當同一條分工邊界反覆出現（例如寫 code 和驗 code 老是互相污染），才把那條邊切成第二個 agent。切分要有失敗證據，不要為組織圖好看而切。

## 協調成本：開會真正的帳單

課程週一的標題直接點名：coordination and error propagation。多體架構的帳單有三張。第一張是狀態交接：agent 之間傳的不只是答案，還有做到哪、為什麼這樣做。傳丟了，下游就重蹈覆轍。

第二張是錯誤放大：沒人檢查的管線，每多一站就多一次把幻覺當事實的機會。AutoGen 把原本解供應鏈問答的 [OptiGuide](https://arxiv.org/abs/2307.03875)重寫成多智慧體：Commander 協調 Writer 與 Safeguard，寫 code 和驗 code 分家，正是為了讓檢查獨立於生產。自己驗自己寫的東西，人跟模型都做不好。

第三張是流程本身：誰決定下一個發言者。AutoGen 內建 GroupChatManager，用角色扮演式 prompt 動態選下一個講者，再廣播給全員，適合沒有固定順序的協作。代價是除錯時得先還原當時為什麼輪到他。人類介入也是成本設計：UserProxyAgent 的 human_input_mode 可以調成每輪都問，也可以讓人跳過。自動化與人類控制的平衡，論文討論章節明說是開放問題。

**怎麼做**：HW1 不准用框架，AutoGen 的規矩要自己寫進迴圈：TERMINATE 終止條件、最大輪數、一個只檢查不做事的角色（抄 Safeguard）。檢查者判定沒把握時就停下來問人，這正好是 HW1 要求的 human in the loop。拿 10 題難題跑一次，記下檢查者攔下幾次、誤攔幾次、轉給人幾次。這張攔截紀錄就是報告裡協調成本的現成素材。

## 優化三軸：prompt、權重、推理算力

週三課表的定位句是 when to optimize prompts vs. weights vs. inference compute。這週兩篇讀物各守一軸，同場其他 prompt 優化器課表另有列點，這裡只談主讀物。

GEPA 守 prompt 軸。它看著系統跑出來的軌跡（推理、工具呼叫、工具輸出）用自然語言反思，診斷哪裡壞、該改哪句 prompt。多次嘗試裡互補的經驗，再從 Pareto 前沿合起來。[開源實作](https://github.com/gepa-ai/gepa)把這個循環具體化：提出 prompt 改動、執行、檢查回饋，再保留有用的候選。Lecture 09 把 GEPA 與 MIPROv2、TextGrad 放在同一條反思式優化脈絡，並不保證某個優化器在你的工作負載一定勝出。

Snell 那篇守推理算力軸。它把 test-time compute 拆成兩招：對 process verifier 做搜尋，以及讓模型迭代改自己的答案。論文研究修訂與搜尋的效益如何隨題目難度和預算改變；在 [MATH](https://arxiv.org/abs/2103.03874) 上的實驗支持按情況配置算力。它沒有證明 email 助理「怎樣都答不對」就必須改權重：漏檢索、工具失效、評分標準出錯，也會長得一樣。先看失敗軌跡，才能選優化方向。

Lecture 09 比指定閱讀走得更遠，權重優化佔了完整一節。監督式微調（SFT）拿教師模型完成任務的軌跡訓練學生；先篩出成功結果，可以避免把每次嘗試都當示範。強化學習則讓學生自己跑任務，用完成任務的獎勵改進行為。講義比較 PPO 與 GRPO：後者從同題一組輸出的相對表現計算 advantage，減少對獨立 value model 的依賴。On-policy distillation 同樣從學生實際產生的軌跡出發，但回饋來自教師的逐 token 分布。三者需要的資料與回饋不同，不能都叫「拿好答案微調」。

**理解檢查**：手上有強教師成功完成任務的軌跡，卻無法讓學生重新操作環境，直接支持哪條路？**答案判準**：能指出用既有軌跡做 SFT；RL 需要學生 rollout 與獎勵，on-policy distillation 則需要對學生自己抽樣的軌跡提供教師回饋。

## 從會聊天到能協作：Lecture 08 的三層設計

[Lecture 08](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)把設計拆成 orchestration、communication、coordination。第一層決定工作怎麼分；第二層決定資訊怎麼交換；第三層管理相依、承諾與共同資源。會傳訊息，只代表第二層存在。

| 編排方式 | 中途資訊怎麼走 | 適合試驗的條件 | 主要代價 |
|---|---|---|---|
| Independent | 各自完成，最後彙整 | 可獨立查證的來源或候選解 | 無法利用彼此中途發現 |
| Centralized | 由 orchestrator 派工、收回 | 需要單一整合者 | 中央可能塞車 |
| Decentralized | 同儕直接交換 | 大範圍探索、可自行領任務 | 承諾與衝突難追蹤 |
| Hybrid | 中央整合，同儕有限互通 | 有全域目標，也有局部相依 | 必須界定何時直接協調 |

Communication 還要分清 handoff 與 agent-as-tool。前者把後續控制權交給接手的 specialist；後者把有界問題交出去，拿回結果後由呼叫者繼續整合。這個差別決定誰負責最後的答案，不能只看呼叫了幾個模型。

協調需要可檢查的狀態。Task ledger 記目標、任務歸屬、相依、進度與阻塞；shared memory 保存跨任務經驗；worktree isolation 讓寫程式的 agent 各用自己的 checkout 與 branch。Worktree 只減少工作時互踩，合併後仍須解衝突、測共同結果，不能把「各自測過」當成整合成功。

**理解檢查**：兩個 agent 都能讀同一個聊天室，卻各自改了同一個介面，為什麼仍會整合失敗？**答案判準**：指出聊天解決資訊通道，沒有自動解決資源歸屬與介面承諾；要補 task ledger 的 owner、共同介面約定、隔離工作區與整合驗證。

講義把失敗分成設計、agent 間、驗證等問題，也提醒從眾和目標不相容：所有 agent 同意，不代表證據更強；各自達標，也不代表整體目標一致。因此 reviewer 應回到原始工具輸出與測試，而不是只替上一個 agent 的摘要背書。

## 用資料決定改哪裡：Lecture 09 的選擇方式

[Lecture 09](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)先要求三樣東西一起存在：資料、可執行的系統、評估與指標。若「好答案」還沒定義，優化器只會更有效率地追逐模糊目標。成功率之外，也要測成本與延遲；資料要分成調整用與保留驗收用，避免把看過的題目記熟誤認為泛化。

Context optimization 不只改一句 system prompt。Few-shot 路線先從成功軌跡建立示範，再搜尋有用的組合；MIPROv2 同時提出指令與示範候選，用小批量評估更新搜尋。反思式路線把失敗軌跡與回饋交給模型，讓它提出下一個修改。這說明了為什麼只存最後分數不夠：工具回傳錯在哪，才可能告訴你哪個模組該改。

| 手上的條件 | 優先試驗 | 要先確認的事 |
|---|---|---|
| 只有 API、常換任務、環境執行昂貴 | Context／prompt 優化 | 評估是否涵蓋真實失敗 |
| 有好教師，要把任務移到較便宜學生 | SFT／蒸餾 | 教師軌跡品質與多樣性 |
| 學生能互動，任務結果可驗證 | RL | 獎勵是否反映真正完成 |
| 某些題目重試會改善，且有可靠 verifier | 增加推理算力 | 增益是否值得成本與延遲 |

這張表是根據講義整理的試驗起點，不是互斥選單。講義用 BetterTogether 說明 prompt、權重、再 prompt 可以交替；也談到讓 agent 修改 harness、跑實驗、保留有效改動。越能自動探索，越要把評估固定在它不能任意改寫的地方，並保留未用於調參的題目。

## 本文教學例子：兩個 agent 整理 email

以下是本文自擬例子，數字是示範資料，並非官方作業結果。任務是回答「哪幾封信支持本週要延期交付？」原始信件必須可追溯，否則答案不算成功。檢索 agent 找信，整理 agent 寫答案；前者交出的摘要若把「可能延期」寫成「已決定延期」，下游再流暢也只是放大錯誤。

先設交接契約：每項結論附 email ID、原句與不確定性；task ledger 記誰已完成檢索、是否還缺反例。整理者不得把候選結論升格為已確認事項；最後依原始信件驗證引用與措辭。

```diagram
title: 讓證據穿過交接仍不變形
desc: 檢索把原始證據與不確定性交給整理者，最後驗證回到原信。
caption: 本文教學例子；箭頭表示交接資料的方向。
---
<svg viewBox="0 0 440 440">
<path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 200V240" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 312V352" marker-end="url(#arrow)"/>
<rect class="dg-box" x="40" y="16" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="52" text-anchor="middle" dominant-baseline="central">檢索 agent：回到原始信件</text>
<rect class="dg-box dg-box--accent" x="40" y="128" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="164" text-anchor="middle" dominant-baseline="central">交接契約：ID、原句、不確定性</text>
<rect class="dg-box" x="40" y="240" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="276" text-anchor="middle" dominant-baseline="central">整理 agent：保留證據邊界</text>
<rect class="dg-box" x="40" y="352" width="360" height="72" rx="6"/>
<text class="dg-label" x="220" y="388" text-anchor="middle" dominant-baseline="central">驗證：逐項對照原始信件</text>
</svg>
```

假設凍結系統在保留的二十題只答對十二題。另用開發集檢查失敗，發現多數錯在交接摘要丟失不確定性，因此先改交接 prompt，加入一個成功示範。再跑同一保留集得到十六題成功：成功率由 60% 到 80%，增加二十個百分點。這是這份示範資料上的對照結果；小樣本不足以保證未來有相同提升。若題目已被拿來反覆選版本，就另留一批沒看過的題目做最後驗收。

下一步要看成本與失敗軌跡。假如剩下的錯都是搜尋工具沒回傳正確信件，加一個 reviewer 無法憑空補出證據；應先檢查查詢與索引。如果有正確候選、卻挑錯答案，才試更多候選加 verifier。是否拆 agent、改 prompt 或訓練權重，都要對著同一個瓶頸做對照。

**綜合理解檢查**：拆成三個 agent 後，每個都回報成功，整體仍錯；你會先增加 agent，還是改哪一個檢查？**答案判準**：先用原始 email 對照端到端輸出，找資訊在哪次交接變形；檢查 ledger、交接契約與 evaluator。只有確認可分工的瓶頸，且對照顯示收益大於協調成本，才擴編。單一失敗結果無法直接判定需要微調。

## HW1 收尾：交卷前只做三件事

第一，鎖骨架。[Week 4](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory) 把 [ReAct](https://arxiv.org/abs/2210.03629) 迴圈形狀和記憶分層定下來之後就別再改，凍結一個能跑的版本當對照組。第二，把 harness 補齊：HW1 要的不只是會查信的 pipeline，還有工具、terminal、記憶和人類介入。缺哪塊先補哪塊，每補一塊就拿同一組 email 題對凍結版跑一次。第三，錯誤分析三行寫好：哪類題目最常失敗、失敗落在檢索還是推理、人類介入在哪裡攔下了錯。

**怎麼做**：依尚缺的項目分配剩餘時間：鎖骨架、補齊 harness 並逐塊對照，再預留錯誤分析與收尾。每天只動一軸：今天改 prompt，明天加算力，後天才考慮拆 agent。混著調的失敗是沒法寫進報告的。

## 它在課程裡的位置

Week 5 接著進入 Week 6 的嘉賓演講與 Data for Agentic Systems，[HW2 在 10/26 釋出](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)，HW1 在 10/30 交卷。多智慧體的錯誤傳遞會在 Week 8 的安全與護欄回來，注入攻擊與 sandbox 算的是同一筆帳。優化三軸則直接連著季度專案：demo 前每一輪迭代都是同一個三選一。Week 4 定迴圈形狀，Week 5 決定這個迴圈複製幾份、力氣花在哪。順序讀下來，HW1 就是這五週的總驗收。

## 本週 Course Material 對照

- 週一 10/19 Multi-Agent Systems：主讀物 AutoGen（本文已導讀）。[Cemri 等人收了 1600 多條多智慧體軌跡](https://arxiv.org/abs/2503.13657)，做成 MAST-Data。失敗模式按設計問題、智慧體對不齊、缺驗證分堆，給開會出事點名。呼應週一主題：協調失敗有結構，不是運氣。[Neubig](https://openhands.dev/blog/dont-sleep-on-single-agent-systems)拿 [OpenHands](https://github.com/OpenHands/OpenHands) 經驗幫單體說話：多體的痛在結構僵硬、交接漏上下文、維護貴。一個強模型配通用工具箱加長 prompt，多數分工都吃得下。[Liu 等人的 DyLAN](https://arxiv.org/abs/2310.02170)先選隊再動態組網：在特定 [MMLU](https://arxiv.org/abs/2009.03300) 子集上，選對隊伍最多拉高 25% 準確率。誰上場本身就是可優化的變數。
- 週三 10/21 Optimization：主讀物 Snell 等人 test-time compute、GEPA（本文已導讀）。[Soylu 等人把微調權重和優化 prompt 交替做](https://aclanthology.org/2024.emnlp-main.597/)，讓同一個模型自己教自己。在多跳問答和數學推理上，一起做贏過只做一邊。[Opsahl-Ong 等人的 MIPRO](https://arxiv.org/abs/2406.11695)把多階段程式每段的指令和示範一起優化，用小批量代理評估解跨模組歸因。最強的一組拉高 13 個百分點，優化器已收進 [DSPy](https://dspy.ai)。它的後續版本 MIPROv2，正是 GEPA 論文鎖定的最強基線。
- 課表原文：[CS329Z 官網 Week 5](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-23：依 Lecture 08–09 補入協調、worktree、權重優化與依評估選策略，新增完整教學例子、圖解與理解檢查。


- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、語料換成企業 email、改成不用框架的完整 harness），改寫「HW1 收尾」的十天計畫與各節「怎麼做」裡的作業對應
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[Week 4：ReAct 與記憶](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory)、[Week 3：工具與 DSPy](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 講義：[Lecture 08: Multi-Agent Systems](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)、[Lecture 09: Optimization](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Wu et al., AutoGen, COLM 2024](https://arxiv.org/abs/2308.08155)、[Snell et al., Scaling LLM Test-Time Compute Optimally, ICLR 2025](https://arxiv.org/abs/2408.03314)、[Agrawal et al., GEPA, arXiv 2025 (ICLR 2026 Oral)](https://arxiv.org/abs/2507.19457)
- 工具：[AutoGen](https://github.com/microsoft/autogen)、[GEPA](https://github.com/gepa-ai/gepa)
