---
title: "Language Agents 的推理、記憶、規劃與多代理｜台大陳縕儂 深度學習之應用 第 11 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, multi-agent, agent-memory]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 12
tldr: "ADL Fall 2025 第 11 堂以 EMNLP 2024 的 Language Agents tutorial 為底，把 agent 定義成「感知環境並採取行動的實體」，再指出 language agent 的新東西：推理本身也是一種內部行動。講義用推理、記憶、規劃三個概念組織整堂，推理這段講 CoT 與 ReAct，記憶這段講 Generative Agents 的 recency／importance／relevance 檢索，規劃這段從貪婪的反應式規劃講到 tree search 與 world model，最後用初始化、協作、團隊最佳化三步驟講多代理系統。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）11/10 的 Language Agents 講義與影片 11.1–11.5：agent 的一般定義與 language agent 的差別、logical／neural／language agent 的演進、CoT 與 ReAct、推理擴大行動空間、短期與長期記憶、Generative Agents、社會模擬、規劃範式與 world model（Deep Dyna-Q、D3Q、LLM 當使用者模擬器）、多代理系統的初始化、協作與團隊最佳化。附 ReAct、記憶檢索與規劃代價的例子和自我檢查。"
draft: false
glossary:
  - term: "language agent"
    aliases: ["語言代理"]
    definition: "把 LLM 整合進 agent，用語言表示感知與外部行動，並把「生成推理 token」當成一種內部行動的 agent。"
    context: "講義第 5 頁的定義。"
  - term: "ReAct"
    definition: "讓 LLM 交錯產生推理（Thought）與行動（Action），並把環境回傳的觀察（Observation）接回下一步推理的做法。"
    context: "講義第 13–17 頁引 Yao 等人 2022，結論是推理與行動兩者都不可少。"
  - term: "world model"
    aliases: ["世界模型"]
    definition: "環境模擬器：給定目前狀態與要採取的行動，預測接下來會發生什麼（下一個狀態或觀察）。"
    context: "講義第 38–47 頁用它串起對話規劃與 web agent 的 model-based planning。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 11 堂。ADL Fall 2025（114-1，2025/09/01–12/15）在 11/10 上這一堂，[課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)把這一週標為線上（Virtual）。這是課程頁上最後一個附講義的堂次，之後三列（Knowledge／Multimodality、Personalization、Reasoning）只有標題。

**本文依據**：講義 [Language Agents（251110_LangAgent.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf)（65 頁），以及五支影片：[11.1 Language Agents Introduction 最近熱門的語言模型 Agent 是甚麼？](https://youtu.be/R0YBJve0NoI)（21:11）、[11.2 Reasoning 推論以進行內部反思](https://youtu.be/UO527XuWEzg)（21:40）、[11.3 Memory 長期記憶中有各種重要資訊](https://youtu.be/nAcLNc-H5Sc)（19:28）、[11.4 Planning 達成長期目標進行短期規劃](https://youtu.be/ny7qcF1BzaA)（23:19）、[11.5 Multi-Agent Systems 多人討論後效果更加](https://youtu.be/0b8NdMfZ8Fs)（19:38）。本文頁碼都指講義 PDF。

> **版本提醒**：講義封面寫 November 10th, 2025，並註明以 [EMNLP 2024 的 Language Agents tutorial](https://language-agent-tutorial.github.io/) 為參考。五支影片在 2025/11/10 上傳到 Fall 2025 播放清單，但說明欄標的日期是 2024/12/04。本文沒有逐頁比對影片畫面與 2025 講義，兩者有出入時以講義為準。

**系列位置**：上一篇 [偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)｜下一篇 [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

這一堂沒有對應作業，講義與影片都公開，沒有額外缺口，系列整體的存取分級是 A2。它要回答的問題是：**大家都在講 agent，它到底是什麼？推理、記憶、規劃、多代理各自解決什麼？**

讀完這一堂要能做四件事：說出 agent 的定義，以及 language agent 的「內部行動」是什麼；用 observation、thought、action 寫出一段 ReAct 式的過程；說明短期記憶與長期記憶各放什麼、檢索長期記憶時要看哪三件事；比較三種規劃方式的代價。標成「本文自編」的例子不是課堂內容。

## Agent 是什麼，language agent 又多了什麼

第 2 頁先擺出兩邊的聲音：Bill Gates、Andrew Ng、Sam Altman 看好 agent，另一邊則說目前的 agent 只是在 LLM 外面包一層、自回歸 LLM 永遠無法推理或規劃。講義沒有選邊，而是回到定義。

第 3–4 頁引 Russell 與 Norvig 的《AI: A Modern Approach》：agent 是透過感測器感知環境、透過致動器作用於環境的任何東西。簡化成一句：**agent 是會感知、會行動的實體**；理性的 agent 選擇能最大化（期望）效用的行動。

第 5 頁說明 language agent 的新意：

- 生成推理 token 可以看成一種**內部行動**，發生在內在獨白（inner monologue）式的內部環境裡。
- 自我反思是「後設」推理，也就是對推理過程再推理。
- 推理是為了行動得更好：推斷環境狀態、重新規劃等。
- 感知與外部行動都用語言表示。

老師的解釋是：語言模型每一步都在從詞彙表裡選一個 token 產生出來，這本身也是一種 action。它和對環境做的動作不同：對外的是 external action，產生 token 來思考的是 internal action，發生在 agent 自己內部。agent 的定義沒有變，一樣是感知環境、選擇行動；變的是中間「怎麼從感知走到行動」改由語言模型用語言來推理。她補了一句：以後如果有比語言模型更好的工具，中間這一塊可以換掉，agent 的概念不會變。

第 6 頁的表格把 agent 分三代比較：

| | Logical agent | Neural agent | Language agent |
|---|---|---|---|
| 表達力 | 低：受限於邏輯語言 | 中：小型神經網路能編碼的 | 高：幾乎任何能說出口的 |
| 推理 | 邏輯推論：嚴謹、明確、僵硬 | 參數化推論：隨機、隱含、僵硬 | 以語言推理：模糊、半明確、彈性 |
| 適應性 | 低：受限於知識整理 | 中：資料驅動但樣本效率差 | 高：LLM 的強先驗加上語言使用 |

老師對三欄的補充：logical agent 的推理最嚴謹，但只有邏輯語言寫得出來的東西才處理得了。neural agent 的推理藏在網路裡，看不到它為什麼做這個動作。language agent 的推理是講出來的，所以看得到過程；代價是模糊，只要說得通就能過關，這也是大家說語言模型「一本正經講沒內容的話」的原因。

第 7 頁定下整堂的三個關鍵概念：**推理、記憶、規劃**。

## 推理：CoT 與 ReAct

第 9 頁把 language agent 的行動空間整理成三種：推理（更新短期記憶，也就是 context window）、檢索與學習（讀寫長期記憶）、規劃（在推論時選擇外部行動）。

老師先解釋「推理更新短期記憶」是什麼意思：語言模型產生的每一句話，都會留在 context window 裡被自己接下來讀到。反思一次，context 就多一段；第二次反思時看到的內容已經不同。短期記憶指的就是 context window 裡的東西。

- **[Chain-of-Thought](https://arxiv.org/abs/2201.11903)**（Wei 等人 2022，第 10 頁）：讓模型生成中間步驟，模仿人的思考過程。這些中間步驟留在 context 裡，同一個模型接下去就比較容易說出正確答案。
- **推理幫助行動、行動也幫助推理**（第 11–12 頁）：第 12 頁的例子是問「你知道台大的陳縕儂嗎？」，模型先搜尋，再根據搜尋結果回答。
- **[ReAct](https://arxiv.org/abs/2210.03629)**（Yao 等人 2022，第 13–17 頁）：推理與行動交錯進行。講義的兩個結論是「兩者都不可少」，以及推理為控制行動提供了解釋。

**為什麼行動需要推理：煮菜缺鹽的例子。** 第 11 頁列出觀察與動作四格，中間的 thought 是老師在影片裡補上的。機器人正在煮菜，觀察到的是「沒有鹽了」，而理想的下一個動作是「向右轉」。只看這一組觀察與動作，中間沒有任何關聯，要直接學會這個對應非常困難。補上推理就通了：

```text
Observation：正在煮菜，鹽用完了
Thought：這道菜是鹹的。沒有鹽，要找別的鹹的東西代替。醬油可以。醬油在右邊的櫃子裡。
Action：向右轉
Observation：看到櫃子和桌子
Action：打開櫃子
```

人看到沒有鹽會向右轉，是因為要去拿醬油。中間那段 thought 把觀察和動作接了起來。

**ReAct 的另一個好處：人可以改它的想法。** 第 16–17 頁是 ReAct 論文在虛擬房間（AlfWorld）裡的任務：把兩個鑰匙圈放進保險箱。模型找到第一個之後，自己認定第二個在某個抽屜裡，其實它並不知道，是幻覺。因為 thought 是寫出來的文字，人可以直接把那一句刪掉或改掉，後面的行動就跟著改變，不會一直執著去翻同一個抽屜。

第 18–19 頁補一個比較抽象但重要的觀點：**推理擴大了行動空間**。語言與推理的空間是無限的，行動空間變大代表能力更強，但決策也更難；LLM 透過模仿各種人類推理軌跡，學到推理的先驗。老師接著用第 20 頁（Yao 等人 2023）說，往哪個方向想本身就是一種規劃：chain-of-thought 是一條直線；也可以展開很多條思考路徑，如果八成都得到同一個結果，就比較相信那個結果；還可以把思考展成一棵樹，每一步再分出好幾個方向。

本系列的[下一篇 Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning) 只有影片、沒有投影片，所以會回頭引用這裡第 8–20 頁的 CoT 與 ReAct。

## 記憶：短期、長期與 Generative Agents

第 22 頁的對照很好記：

| | 短期記憶 | 長期記憶 |
|---|---|---|
| 形式 | Instruction、Thought、Action、Obs 依序累加 | 可讀可寫 |
| 內容 | 目前任務的 context | 經驗、知識、技能 |
| 限制 | 只能追加；context 有限；注意力有限 | — |
| 持久性 | 換新任務就不保留 | 跨新經驗持續保存 |

老師用 RAG 來定位長期記憶：之前講的 RAG 等於一個只能讀的長期記憶，每次回答前去裡面找相關文件。這裡的長期記憶還可以寫，把新的經驗、知識與技能存進去，之後的任務也能用。

**[Generative Agents](https://arxiv.org/abs/2304.03442)**（Park 等人 2023，第 23–25 頁）面對的問題是：context window 裝不下所有事件流，也很難注意到相關的事件。做法分兩步：先模擬一連串事件形成情節記憶，再檢索記憶。第 25 頁的重點是**檢索要同時考慮 recency、importance 與 relevance**，不能只看相關性。

**算一次（本文自編）。** 有人問這個 agent：「你最近最期待什麼事？」它的記憶裡有三筆，每一項給 0 到 1 的分數，三項相加。講義第 25 頁的原例也是相加：最高的一筆是 2.34 = 0.91 + 0.63 + 0.80，取出的是情人節派對。下面是我另外編的數字：

| 記憶 | Recency | Importance | Relevance | 合計 |
|---|---|---|---|---|
| 上個月同事提到年底有發表會 | 0.2 | 0.6 | 0.8 | 1.6 |
| 今天早上爸媽說週末要辦派對 | 0.9 | 0.7 | 0.7 | 2.3 |
| 今天早上打翻咖啡 | 0.95 | 0.2 | 0.1 | 1.25 |

只看 relevance，會取出發表會（0.8）。三項都看，取出的是派對（2.3）。這和老師講的例子一致：兩件事都值得期待，一件是很久以前聽到的，一件是今天早上才聽到的，人會先想到後者。

第 26–30 頁是社會模擬 agent（Zhang 等人 2024）：同一句「我通過律師考試了！」，自己剛升遷的 agent 會說「辦個派對慶祝」，自己也考但沒過的 agent 則回得很勉強。講義用這組研究說明 agent 的「自身情緒」會改變回應，模擬團體討論時，負面情緒傾向反對、正面情緒傾向同意，正面情緒的團體比較容易做出和平的決定。老師補充了做法：先讓語言模型替每個角色合成一天裡的一連串事件，以及每件事帶來的情緒（早上打翻咖啡、九點收到緊急需求、十一點半解掉一個難纏的 bug），再看帶著這些情緒的 agent 怎麼對話、怎麼開會。負面情緒多的會議，常常討論半天沒有結論，或以妥協收場。

## 規劃：從反應式、tree search 到 world model

第 32 頁的定義：給定目標 G，決定一串行動 (a0, a1, …, an)，使最後的狀態通過目標檢驗 g(·)。

講義用幾個例子鋪陳：

- **常識推論的規劃**（Kuo & Chen 2023，第 33 頁）：使用者只說「我想規劃去舊金山的旅行」，agent 推出隱含的訂機票與訂房意圖，再依序叫出航空與訂房 bot。
- **Web 規劃 agent**（Deng 等人 2024，第 34 頁）：把任務拆成多個網頁操作。

上面兩個例子都是先把目標拆成幾個動作、再逐一執行。老師說明了這種做法為什麼不夠：只要其中一步失敗，例如該點的按鈕點不進去，整個流程就卡住，因為沒有回饋與調整的機制。Tree search 的做法是失敗就退回上一步換一條路，每走一步用一個數值估計離目標還有多遠，數值掉下來就回頭。它的問題是每一步都要真的去做：有些動作做了就很難復原，例如更改設定；有些不安全；而且真的做完才知道不好，很慢。

第 35–37 頁比較三種規劃範式：

| 範式 | 優點 | 缺點 |
|---|---|---|
| 反應式（每步直接決定） | 快、好實作 | 貪婪、短視 |
| 在真實環境做 tree search（[Koh 等人 2024](https://arxiv.org/abs/2407.01476)） | 有系統地探索 | 有不可逆的行動、不安全、慢 |
| 用 world model 做 model-based planning | 更快、更安全、有系統地探索 | 要怎麼得到 world model？ |

### World model

第 38 頁：**world model 是環境模擬器**，回答「在狀態 s_t 做行動 a_t，接下來會發生什麼」。第 39–42 頁用兩篇對話策略學習的研究說明（第 41 頁列出 D3Q 的作者，陳縕儂是其中之一）：

- **[Deep Dyna-Q](https://arxiv.org/abs/1801.06176)**（Peng 等人 2018）：跟真實使用者互動時，同時學一個 world model 產生模擬經驗來規劃。問題是假經驗品質差會拖累策略學習。它的好處是減少和真實使用者互動的次數；從第 40 頁的曲線看，加少量模擬經驗時，前期學得比只用真實互動快。第 40 頁的曲線圖例是 DQN(1)、DDQ(2)、DDQ(5)、DDQ(10)、DDQ(20)。老師指出模擬經驗配太多的那條黃線（圖例是 DDQ(20)）抖動很大，後期比只用真實互動的藍線差；紅線 DDQ(5)，她說是每次真實互動多配四次模擬，還算穩定。
- **[D3Q](https://arxiv.org/abs/1808.09442)**（Su 等人 2018）：加一個判別器把品質差的模擬經驗濾掉，策略學習更穩健，人工評估也有改善。

第 43–45 頁把這條線接到 LLM：**LLM 可以直接當使用者模擬器**。第 44 頁給了外向型與內向型兩個 persona 的角色扮演 prompt，講義的結論是這樣很容易做出多樣的使用者模擬器來訓練助理；第 45 頁再說 LLM 在某些情況下能預測狀態轉移。第 46–47 頁引 [Gu 等人 2024](https://arxiv.org/abs/2411.06559) 的 web agent：在 VisualWebArena 上，model-based planning 比反應式規劃準，也比 tree search 有效率。

老師描述了實際的做法：面對幾個可以點的選項，先請 LLM 想像每一個點下去之後頁面會變成什麼樣子，例如「會進到商品的詳細頁，有名稱、尺寸、顧客評論」，再評估每個想像出來的狀態離目標多近，選最近的那個去真的執行。

**數一下代價（本文自編）。** 假設每一步有 3 個選項，任務要走 4 步。

- 反應式：每步直接選一個，真的執行 4 個動作。選錯了沒有補救。
- 真實環境的 tree search：最壞情況每一步三個選項都要真的試過，四層全部展開是 3 + 9 + 27 + 81 = 120 個節點，真實操作遠多於 4 次，其中有些無法復原。
- Model-based：每一步在腦中模擬 3 個選項，共模擬 12 次，真的執行的仍然只有 4 個動作。

講義第 47 頁的數字也是這個方向：成功率依序是反應式 17.7%、model-based 23.6%、tree search 26.4%；執行的動作數是 4.3、4.6、11.6 步；花的時間是 80、199、836 秒。Model-based 的成功率比 tree search 低一點，動作數卻和反應式差不多。

## 多代理系統

第 49 頁列出動機：單一 agent 不夠強、容易平行擴展、不同 agent 代表不同專長、去中心化控制與隱私保護。第 50 頁把建構流程分成三步：

1. **Agent 初始化**：用 persona 描述（第 52 頁，Generative Agents 裡藥局老闆 John Lin 的長段設定），或用角色與行動來定義（Chen 等人 2024，第 53–54 頁）。
2. **協作流程**：[多代理辯論](https://arxiv.org/abs/2305.14325)（Du 等人 2023，第 56–58 頁）能改善事實性與推理；[AutoGen](https://arxiv.org/abs/2308.08155)（Wu 等人 2023，第 59–60 頁）讓 agent 透過對話互動，講義稱之為 conversational programming。老師補充辯論的過程：兩個 agent 各自解同一道數學題，第一輪一個答 225、一個答 595，彼此不知道誰對。第二輪讓每個 agent 看對方的解法再決定要不要改，答錯的那個改成 560，還是錯；第三輪再看一次，它才同意對方的算法，改成 595，兩邊達成共識。她的比喻是三個臭皮匠勝過一個諸葛亮。AutoGen 則不限定兩兩辯論，可以是三方一起談，也可以像主管對部屬那樣分層。
3. **團隊最佳化**：透過挑選 agent 讓團隊最佳化（[Liu 等人 2024](https://arxiv.org/abs/2310.02170)，第 62–63 頁），最佳化之後同樣的團隊規模效果更好，API 呼叫也更少。老師解釋了為什麼要挑：每一輪讓所有 agent 互看彼此的回答很花時間，而某一題可能有 agent 根本不擅長，例如生物題交給沒修過生物的人。做法是讓 agent 互相給第一輪的回答打分數，像同儕互評，分數低的那些就不納入這一題。講義第 63 頁的數字：4 個 agent 直接辯論約 69.3%、呼叫 12 次；挑過之後的 4 人團隊是 70.5%、平均呼叫 4.39 次。同一張圖也顯示不是挑越少越好：只留 2 個時掉到 68.4%，比不挑還低。

第 64 頁的總結把三個概念各壓成一兩句：推理是 agent 的內部行動，推理引導行動、行動更新推理；language agent 同時跟外部環境與內部記憶互動；用語言推理帶來新的規劃能力。

## 常見的誤解

這幾條是我依課堂內容整理的。

- **「Agent 是語言模型出現之後才有的概念。」** 定義來自傳統 AI：能感知環境並對環境行動的東西。語言模型只是現在用來做中間那一段推理的工具。
- **「推理就是模型在回答前多寫幾句話。」** 在這一堂的框架裡，推理是一種內部行動，作用是更新 context window 裡的短期記憶，目的是選出更好的外部行動。
- **「長期記憶就是 RAG。」** RAG 只讀不寫，而且只看相關性。這裡的長期記憶可以寫入新的經驗，檢索時還要看新近程度與重要性。
- **「Tree search 最完整，所以最好。」** 它要在真實環境裡一步步試，有些動作不能復原，也慢。
- **「Agent 越多越好。」** 每多一個 agent，每一輪的溝通成本就增加。挑出適合這一題的 agent，效果更好、呼叫也更少；但挑得太少，準確率會掉。

## 自我檢查

題目是本文自擬的。

**1. 一個 language agent 產生了一段「我應該先查一下這個詞的意思」的文字，然後呼叫搜尋工具。哪一個是內部行動，哪一個是外部行動？**

產生那段文字是內部行動，它只更新 context。呼叫搜尋工具是外部行動，它作用在環境上，並帶回新的 observation。

**2. 照煮菜的例子，替這個情境寫出完整的 observation、thought、action：機器人要泡茶，發現茶壺是空的。**

例如：Observation「要泡茶，茶壺是空的」；Thought「泡茶需要熱水。茶壺是空的，要先裝水。水龍頭在水槽那裡」；Action「走向水槽」。檢查的標準是 thought 有沒有把觀察和動作接起來。

**3. 沿用上面三筆記憶的表，如果把問題換成「你今天早上發生了什麼事？」，三筆的 relevance 變成 0.1、0.8、0.9，其他不變。取出的是哪一筆？**

合計變成 0.2 + 0.6 + 0.1 = 0.9、0.9 + 0.7 + 0.8 = 2.4、0.95 + 0.2 + 0.9 = 2.05。取出的仍是派對那一筆，因為它重要性高；打翻咖啡排第二。

**4. 一個 agent 要替使用者在網站上「更改寄送地址」再下單。為什麼不適合用真實環境的 tree search？**

更改地址是會留下結果的動作，試錯之後不一定能復原，也可能真的下了錯的訂單。依這一堂的說法，這類任務適合先用 world model 模擬。（執行前先向使用者確認是本文補充的做法，課堂沒有講。）

**5. World model 回答的是什麼問題？在對話助理的情境裡，環境是誰？**

它回答「在狀態 s 做了動作 a，接下來會發生什麼」。對話助理的環境是使用者，world model 預測的是使用者接下來會說什麼。

**6. 四個 agent 做三輪辯論，每一輪每個 agent 呼叫一次模型，共呼叫幾次？如果每題只挑兩個 agent 參與呢？**

照題目的簡化假設是 4 × 3 = 12 次；講義第 63 頁辯論基準線也是 12 次，但講義沒有寫它跑幾輪。只挑兩個、仍跑三輪是 2 × 3 = 6 次。這是簡化的算法：講義裡實際的做法是中途淘汰 agent，第 63 頁量到的平均呼叫次數是 4 人 4.39 次、2 人 2.83 次。呼叫變少不代表比較好：只留 2 個 agent 時，準確率 68.4% 低於不挑的基準線。

## 延伸閱讀

- [CMU 11-768 AI Agents 導讀](/posts/ai/2026-09-29-cmu-11768-course-overview)：整門課講 agent，尤其是 [Lecture 4：Skills 與 Memory](/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory) 和 [Lecture 5：Planning](/posts/ai/2026-09-29-cmu-11768-lecture-05-planning)。
- [CME295 第 7 堂：Agentic LLM](/posts/ai/2026-09-29-cme295-agentic-llms) 與 [CME295 2026 第 6 堂預習：AI Agents](/posts/ai/2026-09-29-cme295-ai-agents)
- [CS224N 第 10 堂：RAG 與 Language Agents 的六個元件](/posts/ai/2026-08-22-cs224n-rag-language-agents)

上一篇：[偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)
下一篇：[Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning)

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=R0YBJve0NoI
title: ADL 11.1: Language Agents Introduction（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=UO527XuWEzg
title: ADL 11.2: Reasoning（YouTube）
```

原始影片：[ADL 11.1: Language Agents Introduction（YouTube）](https://www.youtube.com/watch?v=R0YBJve0NoI)、[ADL 11.2: Reasoning（YouTube）](https://www.youtube.com/watch?v=UO527XuWEzg)、[ADL 11.3: Memory（YouTube）](https://www.youtube.com/watch?v=nAcLNc-H5Sc)、[ADL 11.4: Planning（YouTube）](https://www.youtube.com/watch?v=ny7qcF1BzaA)、[ADL 11.5: Multi-Agent Systems（YouTube）](https://www.youtube.com/watch?v=0b8NdMfZ8Fs)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-13。

內容核對：已依字幕核對（2026-10-13）：11.1–11.5 五支都依字幕整理。11.1 開場說「這是這學期的倒數第二堂課」，說明欄日期是 2024/12/04，是 2024 學期的錄影。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：依字幕核對影片內容。確認 11.1、11.2 與文章相符，版本提醒屬實（影片自述是學期倒數第二堂，為 2024 學期錄影）。
- 2026-10-13：查證歷程移出正文；系列內互相引用由篇序改為堂次。
- 2026-10-13：依五支影片的課堂口述補上各段說明，加入煮菜缺鹽的 ReAct 例子、記憶檢索與規劃代價的例子、常見誤解與附答案的自我檢查。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 11/10 課表列
- [Language Agents 講義（251110_LangAgent.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251110_LangAgent.pdf) — 本文所有頁碼
- [EMNLP 2024 Tutorial: Language Agents: Foundations, Prospects, and Risks](https://language-agent-tutorial.github.io/) — 講義的參考來源
- [ADL 11.1: Language Agents Introduction（YouTube）](https://youtu.be/R0YBJve0NoI)
- [ADL 11.2: Reasoning（YouTube）](https://youtu.be/UO527XuWEzg)
- [ADL 11.3: Memory（YouTube）](https://youtu.be/nAcLNc-H5Sc)
- [ADL 11.4: Planning（YouTube）](https://youtu.be/ny7qcF1BzaA)
- [ADL 11.5: Multi-Agent Systems（YouTube）](https://youtu.be/0b8NdMfZ8Fs)
- [Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Yao et al., ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Park et al., Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
- [Koh et al., Tree Search for Language Model Agents](https://arxiv.org/abs/2407.01476)
- [Peng et al., Deep Dyna-Q: Integrating Planning for Task-Completion Dialogue Policy Learning](https://arxiv.org/abs/1801.06176)
- [Su et al., Discriminative Deep Dyna-Q: Robust Planning for Dialogue Policy Learning (EMNLP 2018)](https://arxiv.org/abs/1808.09442)
- [Gu et al., Is Your LLM Secretly a World Model of the Internet? Model-Based Planning for Web Agents](https://arxiv.org/abs/2411.06559)
- [Du et al., Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325)
- [Wu et al., AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155)
- [Liu et al., A Dynamic LLM-Powered Agent Network for Task-Oriented Agent Collaboration](https://arxiv.org/abs/2310.02170)
