---
title: "AI Engineer 面試日練 — 2026-09-26：Paper Reading"
date: 2026-09-26
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: zh-TW
description: "今天讀一篇剛掛上 arXiv 的《When Can Agents Forget Their Reasoning?》——研究長時間運行的 agent 什麼時候可以安全丟掉歷史推理,同時省 token 又不掉 reward,順便拆解『刪推理為什麼會像蝴蝶效應一樣影響後續行為』這種審稿人視角的面試追問。"
tldr: "今天的 Paper Reading 輪練是 arXiv:2609.29875《When Can Agents Forget Their Reasoning? ICLR for Long-Horizon Agent Context Compression》——2026 年 9 月才掛上 arXiv 的新論文,提出 Interaction Aware Compression for Long Horizon Reasoning(ICLR),一個 training-free、on-line 的方法,用 frozen proxy entropy 排序歷史推理區塊的可丟棄程度,同時保留 actions、tool calls、observations 不動;在 260 個 WorkBuddyBench 任務上,平均 reward 從 0.699 提升到 0.718,同時 input/output/cache read token 分別降低 25.5%/14.4%/33.3%。核心概念涵蓋為什麼刪除歷史推理不像刪靜態 CoT 那麼單純(會改變後續動作)、trajectory amplification 這個非線性效應、『推理何時能被安全遺忘』的判準是有沒有被外部化成 code/file/tool output,以及這篇論文的發現如何跟 Claude Code、Deep Agents 這類業界 harness 的 compaction/offloading 機制相呼應。練習題走審稿人視角,討論怎麼驗證這個方法不是在特定 benchmark 上運氣好,以及要落地到跑數小時的 coding agent 該怎麼決定壓縮時機。"
series:
  name: "AI Engineer 面試日練"
  order: 38
---

> 🌏 [English version](/en/posts/daily/2026-09-26-ai-interview-daily-en)

## 今日主題

星期六輪到 Paper Reading。今天選的《When Can Agents Forget Their Reasoning?》才在 9 月 24 日掛上 arXiv,題目直指一個所有做 LLM agent 的人都會撞到的痛點:agent 跑得越久,累積的推理歷史越長,context 越貴、越容易被無關內容稀釋,但你又不敢隨便刪,因為刪錯了會改變 agent 接下來的行為。這篇論文剛好卡在「context engineering」這個 2026 年面試熱區的正中心,拿來練 LLM/Agent Engineering 職能的 paper reading 環節,同時也能延伸到系統設計——怎麼幫一個長時間運行的 agent 做 context 管理,是現在幾乎每個 AI Engineer 職缺都會問的題目。

## 核心概念速記

### 刪歷史推理不是刪靜態 CoT,因為它會改變未來的動作

傳統的 Chain-of-Thought 壓縮處理的是「靜態」文本——推理寫完就是答案,刪掉冗餘句子不影響結果。但 agent 的推理歷史是動態的:某一步的推理決定了下一步呼叫哪個工具、傳什麼參數,如果事後把這段推理刪掉,不只是損失資訊,還可能讓模型在重新生成後續推理時走上完全不同的路徑。面試被問「context compression 跟一般文本摘要有什麼不一樣」,這句話——「靜態文本壓縮是有損但結果確定,agent 推理壓縮是有損而且會改變後續決策軌跡」——是能直接說出口的分野。

### ICLR:用 frozen proxy entropy 排序,但 action / tool call / observation 一律保留

論文提出的 Interaction Aware Compression for Long Horizon Reasoning(ICLR)是一個 training-free、on-line 的方法,核心做法是用一個「frozen」的 proxy 模型算出每個歷史推理區塊的 entropy,依此排序哪些區塊優先被丟棄,但明確排除 actions、tool calls、observations——這三類是 agent 真正執行過、已經落地的行為紀錄,不在壓縮範圍內。這個設計選擇很關鍵:它把「推理過程」跟「已發生的事實」分開處理,只壓縮前者,面試官問「你會壓縮 agent 歷史的哪個部分」,答案不該是「全部一起摘要」,而是先切開這兩種性質不同的內容。

### 推理何時能被安全遺忘:看它有沒有被外部化

論文用 representation probing、activation patching 跟受控軌跡分析發現,一段歷史推理一旦其「任務相關的推導狀態」已經可靠地外部化成程式碼、檔案、工具輸出或環境回饋,這段推理本身就變得可替代——模型不再需要重讀那段文字才能繼續往下走,因為結論已經留在外部世界了。這跟軟體工程一個很直覺的原則同構:一旦決策被寫進 commit 或設定檔,討論這個決策的會議記錄就不再是唯一真相來源。面試被問「你怎麼決定哪些 context 可以丟」,這個判準——「看它的結論有沒有被外部化,而不是看它離現在多久」——比單純用 token 數或時間窗口切,更接近論文的洞察。

### Trajectory amplification:局部刪除,非線性放大

論文最反直覺的發現是 ablation 實驗揭露的「trajectory amplification」——因為 agent 是有狀態的序列決策系統,刪掉某一小段推理不是線性地損失那一段的資訊量,而是可能透過改變下一步的行動,連鎖觸發完全不同的互動軌跡,讓總運算量或結果出現非線性變化。這解釋了為什麼「看起來只刪了 5% 的 token」有時候會讓某個 case 整條軌跡崩掉,有時候卻完全沒事——差別在那段推理是不是剛好落在一個「分岔點」上。面試官深挖「怎麼保證壓縮不會讓 agent 表現變差」時,能講出這個非線性放大的機制,比只講「我會做 A/B test」更顯示你理解問題的本質。

### 效率跟品質不必然是 trade-off:這次 reward 反而漲了

多數 context 壓縮論文的敘事是「犧牲一點品質換效率」,但 ICLR 在 260 個 WorkBuddyBench 任務上把平均 reward 從 0.699 推高到 0.718,同時 input/output/cache read token 分別降低 25.5%/14.4%/33.3%。這個結果的解讀不該直接下「壓縮讓 agent 變聰明」的結論,更合理的解釋是:被丟掉的冗餘推理本來就在稀釋模型的注意力(呼應 Anthropic 的 context engineering 指南講的「注意力預算」概念),清掉雜訊反而讓模型更容易聚焦在真正外部化的事實上。面試時被問「壓縮 context 一定會犧牲品質嗎」,可以用這個案例反駁「不一定,前提是你丟的是雜訊而不是訊號」。

## 今日練習題

### 題目

「最近一篇 arXiv 論文《When Can Agents Forget Their Reasoning?》提出 ICLR 方法:用 frozen proxy entropy 排序歷史推理區塊的可丟棄程度,同時保留 actions、tool calls、observations,在 260 個 WorkBuddyBench 任務上把平均 reward 從 0.699 提升到 0.718,同時省下 25.5% input token、14.4% output token、33.3% cache read token。論文另外用 ablation 實驗發現一個『trajectory amplification』現象:局部刪除某段推理不是線性損失,而是可能透過改變後續動作,對總運算量造成非線性影響。請說明:(1) 如果你是審稿人,你會怎麼設計實驗驗證這個方法是真的理解了『語意上的可替代性』,而不是剛好在這個 benchmark 的任務分佈上運氣好;(2) 如果要把 ICLR 這類方法落地到一個要跑數小時、幾百次工具呼叫的 coding agent,你會怎麼決定壓縮的觸發時機和粒度;(3) trajectory amplification 這個現象,對任何『刪減 agent 歷史』的系統驗收方法論有什麼具體啟示。」

**來源**：改編自 arXiv:2609.29875《When Can Agents Forget Their Reasoning?》論文設計與實驗發現,自擬面試情境　**難度**：進階　**環節**：LLM/Agent Engineering / System Design 混合(onsite)

### 拆解思路

1. **先釐清問題**：先確認「安全遺忘」的判準是什麼——是最終 reward 不掉,還是整條互動軌跡跟不壓縮版本完全一致(這兩者不等價,reward 相同不代表過程沒有偏移)。也要問清楚 proxy entropy 是用哪個模型算的、跟被壓縮的 agent 本體是否同源,因為如果 proxy 跟主模型的「什麼算重要」判斷不一致,排序本身就可能有系統性偏差。
2. **建立框架**：設計三組對照。(a) Random pruning baseline——刪掉同樣 token 數量但隨機挑區塊,比較 reward 差異是否顯著優於 ICLR 的 entropy 排序,證明排序本身有訊號而不是「刪多少都差不多」;(b) Ablation「拿掉 preserve actions/tool calls/observations 的限制」,單獨看 entropy 排序要不要搭配這個結構性限制才有效,分離出兩個設計選擇各自的貢獻;(c) 跨 benchmark 遷移——同一組 proxy entropy 閾值換到任務分佈明顯不同的 benchmark,檢查表現是否顯著下降,判斷結果有沒有過擬合 WorkBuddyBench 的特定任務結構。
3. **深入核心**：trajectory amplification 是這篇論文最值得深挖的部分——因為 agent 是有狀態的序列決策系統,刪除某段推理可能改變下一步行動、進而觸發完全不同的分支路徑,這跟一般靜態文本壓縮的性質完全不同。審稿人該追問「reward 的信賴區間是怎麼跟這個非線性效應一起報告的,有沒有可能少數幾個 case 剛好落在對的分支才拉高平均值」。落地到 coding agent 時,壓縮觸發時機不該綁固定 token 數或固定時間窗口,而該綁「這段推理對應的結論是否已經外部化」——比如一段推理討論完「該呼叫哪個函式」之後,實際執行了該呼叫、拿到了 tool output,這段討論就變得可丟;但如果推理還停留在純規劃、尚未落地成具體行動,丟掉的風險就高得多,粒度上應該以「一個完整的規劃-執行循環」為單位,而不是任意切段。
4. **收尾**：trajectory amplification 對驗收方法論的啟示是——任何「刪減 agent 歷史」的系統都不能只看離線的平均 reward,因為平均值會被少數「刪錯了、整條軌跡崩掉」的 case 拉低變異卻未必被看見。實務上要做 online monitoring:壓縮後讓 agent 繼續執行,追蹤有沒有出現「重複做同一件事」、「前後矛盾的下一步」這類 trajectory 層級的異常信號,而不只是看 token 節省率。這跟業界 harness 的實作邏輯相呼應——像 Claude Code 在 compaction 之後會重讀最近修改過的檔案、重新載入相關規則,本質上就是主動把外部化狀態重新拉回注意力範圍,對沖 trajectory amplification 的風險。

### 範例回答（面試時可以這樣講）

> **問題框定**：這篇論文的核心宣稱是「知道什麼時候能安全丟歷史推理」,我會先把驗證拆成兩層——結果層(reward 有沒有掉)跟過程層(軌跡有沒有偏移),因為 reward 一樣不代表 agent 走的路一樣,兩者混在一起報告會掩蓋掉某些「歪打正著」的情況。proxy entropy 是誰算的、跟被壓縮的主模型是否同源,我也會特別確認,不同源的話排序準確度本身就要重新驗證。
>
> **核心邏輯**：驗證方法我會設計三組對照:第一組是 random pruning 當 baseline,證明 entropy 排序確實比隨機刪選得更好;第二組是拿掉「保留 action/tool call/observation」這個結構性限制的 ablation,看兩個設計選擇各自貢獻多少;第三組是換一個任務分佈不同的 benchmark 測遷移性,避免結論只在 WorkBuddyBench 上成立。落地到跑數小時的 coding agent,我不會用固定 token 數或固定時間當壓縮觸發點,而是綁定「這段推理對應的結論是否已經外部化」——一段規劃討論如果已經落地成實際呼叫並拿到 tool output,就可以壓縮;還停在純規劃、沒有執行過的,風險高就先保留,壓縮粒度以一個完整的規劃-執行循環為單位。
>
> **落地驗證**：trajectory amplification 告訴我,平均 reward 不夠,因為少數「刪錯導致整條軌跡崩掉」的 case 可能被平均值蓋掉。我會在壓縮上線後做 online monitoring,追蹤 agent 有沒有出現重複執行同一動作、前後決策矛盾這類軌跡層級的異常訊號,而不只是看省了多少 token。這跟 Claude Code 在 compaction 後主動重讀最近修改過的檔案是同一種思路——把已經外部化的關鍵狀態重新拉回模型的注意力範圍,降低壓縮引發連鎖偏移的機率。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有提出 random-pruning baseline 驗證 entropy 排序是否真的優於隨機刪除 | |
| 有討論 proxy entropy 的來源、是否跟被壓縮的 agent 同源 | |
| 講清楚「外部化狀態」是判斷推理能否被安全遺忘的核心判準 | |
| 落地方案把壓縮觸發時機綁定「推理是否已落地成 action」,而非固定 token 數 | |
| 有提到 trajectory amplification 對驗收方法論的啟示(不能只看平均 reward) | |
| 加分項:連結到業界 harness 實作(Claude Code / Deep Agents 的 compaction、offloading)的對應機制 | |

## 延伸閱讀

- [Context Engineering Inside the Harness: 4 Mechanisms That Beat Context Overflow and Goal Loss on Long-Horizon Tasks — MarkTechPost](https://www.marktechpost.com/2026/09/12/context-engineering-inside-the-harness-4-mechanisms-that-beat-context-overflow-and-goal-loss-on-long-horizon-tasks/) — 整理 Claude Code、LangChain Deep Agents、OpenAI Codex 等業界 harness 怎麼做 context budgeting、compaction、todo-state 跟跨 session 記憶,跟今天論文「外部化狀態」「trajectory amplification」的概念可以互相對照著讀。
- [Effective Context Engineering for AI Agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — 解釋 attention 預算(n 個 token 有 n² 個 pairwise 關係)為什麼讓「context 是有限資源」這件事成立,補強今天「效率跟品質不必然是 trade-off」段落背後的機制。
- [awesome-harness-engineering — ai-boost](https://github.com/ai-boost/awesome-harness-engineering) — 蒐羅 agent harness engineering 的工具、模式、記憶管理相關資源清單,適合延伸挖掘更多 context compression 的實作案例。

## 參考資料

- [When Can Agents Forget Their Reasoning? ICLR for Long-Horizon Agent Context Compression — arXiv:2609.29875](https://arxiv.org/abs/2609.29875) — 今日 Paper Reading 核心概念速記與練習題設計的原始論文,含 ICLR 方法設計、WorkBuddyBench 實驗結果與 trajectory amplification 的 ablation 分析。
- [Context Engineering Inside the Harness — MarkTechPost](https://www.marktechpost.com/2026/09/12/context-engineering-inside-the-harness-4-mechanisms-that-beat-context-overflow-and-goal-loss-on-long-horizon-tasks/) — 「效率跟品質不必然是 trade-off」與「收尾」段落中,Claude Code compaction 重讀檔案、Deep Agents offloading 機制的來源。
- [Effective Context Engineering for AI Agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — attention 預算與「context 是有限資源」概念的來源,對應今天核心概念第五段的機制解釋。
