---
title: "AI Engineer 面試日練 — 2026-11-28：Paper Reading"
date: 2026-11-28
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: zh-TW
description: "今天讀的是 RLVB——一篇指出『訓練 agent 的獎勵只看最終答案對不對』會教出提早下注壞習慣的論文，練的是面試官給你一個「agent 常常還沒確認原因就送出答案」的情境，要你重新設計訓練訊號。"
tldr: "今天的論文是 RLVB（arXiv:2611.32884，南洋理工大學 DeCLaRe Lab，2026-11-24 發布），它把訓練訊號從「最終答案對不對」往前移到「每一步證據夠不夠」：拿模擬器算出的精確後驗機率當獎勵依據，不需要額外的 judge 或 critic，三個視覺語言模型在九個測試設定裡平均準確率提升 17.1%，而且提升不是因為答得更準，是因為學會等到證據足夠才答。練習題模擬面試官丟一個「coding agent 常常還沒確認 root cause 就送出修復 PR」的情境，要你說明沒有論文那種 oracle 時該怎麼退一步設計訓練訊號。"
series:
  name: "AI Engineer 面試日練"
  order: 101
---

> :globe: [English version](/posts/daily/2026-11-28-ai-interview-daily-en)

## 今日主題

星期六固定讀一篇剛掛上 arXiv 的論文，練的是面試裡「給你一篇論文，討論怎麼套到你們系統上」這種環節——考官不在乎你有沒有背過這篇論文，在乎的是你能不能把論文的核心主張講成一句可執行的工程判斷。

今天選的是 RLVB（Reinforcement Learning with Verifiable Beliefs），一篇質疑「訓練 agent 只靠『最終答案對不對』打分就夠了」這個預設的論文。它的立場很直接：只看結果的獎勵教不出「什麼時候該答」這個判斷，因為一次幸運的猜測跟一次收集齊證據才回答的動作，在結果導向的獎勵裡拿到一樣高的分數。這剛好是 LLM/agent engineering 面試最愛問的題型：你的訓練訊號設計，到底在教模型學什麼。

## 核心概念速記

### Laziness：agent 明知證據不夠卻還是提早下注

論文用一個翻杯子找物品的例子說明：四個杯子藏一個目標物，agent 翻開第 1、3 號杯都是空的，答案只可能在 2 號或 4 號杯、各一半機率。這時候正確做法是再翻一個杯子，但受測的模型常常直接猜 4 號——而且猜之前寫下的「belief line」明白列著「Possible: cups 2, 4」，代表它自己知道答案還沒定，行動上卻還是下注。這個現象被稱為 laziness，重點是：這不是模型不會算機率，是知道歸知道、做歸做，兩件事沒接起來。

### Outcome reward 的盲點：幸運猜中跟證據充分的答案拿一樣分數

Outcome reward 只在整個 episode 結束時看最終答案對不對，對中間每一步一視同仁——運氣好猜中跟花好幾步收集齊證據才回答，拿到的獎勵一樣高；一次嚴謹的搜查如果運氣不好輸了，也跟隨便亂猜輸了拿一樣低的獎勵。論文量化了這個問題：在其中一個 benchmark 上，base model 有 64% 到 97% 的答案是在證據還不夠時給出的，而且直接套用 outcome reward 做強化學習（GRPO、PPO）訓練完，平均準確率反而低於沒訓練過的 base model。

### RLVB 的核心招式：拿模擬器算出的精確後驗當「可驗證信念」

訓練用的模擬器知道連接隱藏答案跟證據的規則，所以可以在每一步都算出精確的後驗機率分佈——也就是「以目前看到的證據來說，答案還可能是哪些」。RLVB 拿這個後驗當一個會隨步驟更新的可驗證信念：後驗還認為有好幾種答案可能時，獎勵「再走一步」的動作；後驗已經收斂到一個答案時，獎勵「提交答案」的動作。整套獎勵只需要模擬器算出的機率，不用另外訓一個 critic，也不用叫一個 LLM judge 來看每一步——面試被問「process reward 從哪裡來」時，這是一個不靠額外模型的答案。

### 準確率的增益不是來自「看得更準」，是來自「答得更晚」

論文把答對的原因拆開看：把答案依「回答時的證據是否已經足夠」分組後，訓練後的 agent 在三個 benchmark 上有 51%、12%、74% 的答案是在證據足夠時給出的，base model 只有 8%、0.4%、36%；但同一個「證據足夠」的分組裡，各方法的正確率都落在 66%–92% 之間，沒有明顯差距。換句話說，RLVB 沒有讓模型看得更準，是讓模型學會等到看得夠準才回答。面試被問「這個方法的準確率提升是從哪裡來」時，先拆成「答得對不對」跟「答得時機對不對」兩條獨立的軸，比直接說「訓練得比較好」更有說服力。

### Belief line 從不被獎勵讀取，卻還是被訓練得跟行動一致

Agent 在每次行動前寫的「我覺得答案可能是哪些」這行字，跟獎勵函式完全不掛鉤——獎勵只看模擬器算出的後驗跟 agent 實際採取的動作，從不讀這行文字。但因為強化學習的更新是對整段輸出（包含這行 belief 文字）一起算概似，訓練之後 agent 還是學會讓這行字跟自己的行動對齊：提交答案時後驗其實還不夠確定的比例，從 base model 的 3%–68% 降到訓練後的 0.1%–2.2%。這呼應心理學裡 metacognition 的兩個分工——監控（知不知道自己知道）跟控制（根據這個判斷決定下一步動作）——論文顯示這兩件事可以用一個不直接讀取監控訊號的獎勵，間接把控制那一半訓起來。

```diagram
title: RLVB 怎麼給 agent 的每一步打分
desc: Agent 走一步觀察結果後，模擬器用連接隱藏答案與證據的規則算出目前的精確後驗機率；後驗收斂到單一答案就獎勵提交答案，還允許好幾種答案就獎勵再走一步，回到起點重複同一套打分邏輯。
caption: 簡化示意：訓練時每一步會取樣多個候選動作一起比較，這裡只畫被選中那條路徑的獎勵邏輯；能不能算出精確後驗，取決於訓練環境本身知不知道連接隱藏答案與證據的規則。
step: Agent 在目前的歷史下走一步，觀察這個動作帶來的新結果
step: 模擬器用連接隱藏答案與證據的規則，算出以目前證據為準的精確後驗機率
step: 後驗收斂到單一答案，獎勵「提交答案」這個動作
step: 後驗還允許好幾種答案，獎勵「再走一步」這個動作
step: 回到起點，用新的歷史重複同一套打分邏輯
---
<svg viewBox="0 0 680 400">
  <path class="dg-line" d="M280 34V54" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 114V150" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M410 224H446" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M280 294V320" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M196 352H98Q90 352 90 344V94Q90 86 98 86H208" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="212" y="58" width="136" height="56" rx="6"/>
    <text class="dg-label" x="280" y="74" text-anchor="middle" dominant-baseline="central">Agent 走一步</text>
    <text class="dg-label" x="280" y="98" text-anchor="middle" dominant-baseline="central">並觀察結果</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 154L410 224L280 294L150 224Z"/>
    <text class="dg-label" x="280" y="213" text-anchor="middle" dominant-baseline="central">後驗收斂到單一答案？</text>
    <text class="dg-sub" x="280" y="237" text-anchor="middle" dominant-baseline="central">依模擬器的精確後驗</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="450" y="196" width="176" height="56" rx="6"/>
    <text class="dg-label" x="538" y="212" text-anchor="middle" dominant-baseline="central">獎勵「提交答案」</text>
    <text class="dg-label" x="538" y="236" text-anchor="middle" dominant-baseline="central">這個動作</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="196" y="324" width="168" height="56" rx="6"/>
    <text class="dg-label" x="280" y="340" text-anchor="middle" dominant-baseline="central">獎勵「再走一步」</text>
    <text class="dg-label" x="280" y="364" text-anchor="middle" dominant-baseline="central">這個動作</text>
  </g>

  <text class="dg-edge" x="428" y="212" text-anchor="middle" dominant-baseline="central" data-step="3">是</text>
  <text class="dg-edge" x="290" y="307" text-anchor="start" dominant-baseline="central" data-step="4">否</text>
</svg>
```

## 今日練習題

### 題目

面試官給你一個情境：你們的 coding agent 常常在還沒讀完所有相關檔案、還沒確認 root cause 之前就直接送出修復用的 PR，團隊發現不少 PR 其實是蒙對的——改了某一行，測試碰巧過了，但跟 bug 真正的原因無關。你們目前的強化學習微調只用「最終測試是否通過」當獎勵。面試官問：你會怎麼重新設計訓練訊號，讓 agent 學會先確認證據夠不夠才動手改？

**來源**：自擬，改編自 arXiv:2611.32884（RLVB）論文裡 agent laziness 的情境，套到 coding agent 的 debug 流程　**難度**：進階　**環節**：system design／ML 深度追問

### 拆解思路

1. **先釐清問題**：面試時該問的 clarifying questions——訓練環境是不是在 sandbox 裡跑，sandbox 知不知道「真正的 bug 在哪裡」（也就是有沒有 oracle 可以算出「目前看到的證據是否已經能鎖定 root cause」）；如果有，就有機會像 RLVB 一樣算出精確後驗；如果沒有（例如面對真實 repo，沒有人工標註的 ground truth root cause），就只能退一步用近似訊號。
2. **建立框架**：把「獎勵看最終結果」跟「獎勵看過程信念」分開討論，對照論文的框架——outcome reward（測試通過不通過）跟 process reward（每一步證據夠不夠）是兩條獨立的訊號，過程訊號不一定要靠 LLM judge，如果環境允許算出精確後驗（例如用合成或半合成的 bug 注入訓練資料，人工知道真正的 root cause 跟修法），可以直接複製 RLVB 的做法。
3. **深入核心**：技術上最關鍵的 trade-off 是 RLVB 這套方法的前提是「模擬器知道隱藏答案跟證據的連結規則」，現實的 coding agent 面對的是真實、未知的 bug，沒有這種 oracle 可以算後驗。這時候要誠實承認沒辦法照搬，只能選近似代理訊號——例如用多次獨立 rollout 的 self-consistency（同一個 bug 讓 agent 走幾條不同路徑，收斂到同一個 root cause 才算證據足夠），或先用合成 bug 資料集把「等到證據足夠才動手」這個習慣練出來，再遷移到真實 repo。這個誠實的落差，才是整題真正在考的東西，不是背出 RLVB 的做法就結束。
4. **收尾**：強調不管用哪種近似訊號，核心原則不變——獎勵不該只看最終結果，要讓「花更多步驟確認」跟「亂猜」在中途就被區分開來；而且這個訊號不需要額外訓一個 reward model 或請 LLM 當 judge，用環境本身既有、可驗證的訊號（即使只是近似的）設計 reward shaping，會比外接一個主觀的 judge 更穩定、更便宜。

### 範例回答（面試時可以這樣講）

> 我會先把這題拆成「有沒有 oracle」跟「獎勵怎麼設計」兩層。**判斷有沒有 oracle**：如果我們能用合成資料——人工注入已知 root cause 的 bug，訓練環境就知道「真正的問題在哪一行」，這時候可以直接借用 RLVB 的做法：模擬器在每一步都能算出「以 agent 目前讀過的檔案跟測試結果，root cause 的後驗機率分佈收斂了沒」，收斂到單一候選才獎勵它提交修復，還有好幾個候選時獎勵它繼續讀下一個相關檔案。這套訊號不用額外訓一個 critic，也不用叫 LLM judge 去看每一步改得好不好，比較省錢也比較穩定，論文裡同樣設定下的訓練成本是對照組的 1/1.6。
>
> **如果環境沒有這種 oracle**（真實 repo、沒人標註 ground truth），我會退一步用兩個近似代理：一是 self-consistency，同一個 bug 讓 agent 跑好幾條獨立的 rollout，如果這幾條路徑收斂到同一個 root cause 才算「證據足夠」，分散沒收斂就代表還該繼續排查；二是先在合成 bug 資料集上用類似 RLVB 的精確後驗把「等證據足夠才動手」這個習慣練出來，再遷移到真實 repo 上微調。不管哪種做法，我都會在上線前量化一個指標：agent 在證據不足時就送出 PR 的比例，這個數字降下來，才算真的解決了「蒙對測試但改錯原因」的問題，而不是只看 PR 合併率有沒有上升。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有指出 outcome reward 無法區分「幸運猜中」跟「證據充分的答案」 | |
| 有說明 laziness 不是模型能力不足，是獎勵結構看不到過程 | |
| 有指出 RLVB 需要模擬器能算出隱藏答案的精確後驗，現實系統通常沒有這個 oracle | |
| 有提出沒有 oracle 時的折衷方案（self-consistency、合成資料遷移等） | |
| 有提到不需要額外訓 critic／judge 是訓練成本上的好處 | |
| 加分項：主動點出該用什麼指標驗證問題真的解決（而不是只看 PR 合併率） | |

## 延伸閱讀

- [declare-lab/RLVB — GitHub](https://github.com/declare-lab/RLVB) — 官方實作與評測程式碼，想看 reward function 實際怎麼寫、Pro-Worlds 基準怎麼跑可以直接對照
- [Lazy Agents Answer Against Their Own Beliefs — Hugging Face Papers](https://huggingface.co/papers/2611.32884) — 社群摘要與討論，快速對照論文裡的關鍵數字

## 參考資料

- [arXiv:2611.32884 — Lazy Agents Answer Against Their Own Beliefs: Reinforcement Learning with Verifiable Beliefs Teaches Them to Act on What They Believe](https://arxiv.org/abs/2611.32884) — 今日 Paper Reading 的原始論文，對應「核心概念速記」全部五節的摘要與數字出處，南洋理工大學 DeCLaRe Lab，2026-11-24 提交
- [arXiv:2611.32884 — HTML 全文](https://arxiv.org/html/2611.32884v1) — 對應「Laziness」一節的翻杯子範例、「Belief line」一節 metacognition 的監控／控制分工討論
- [declare-lab/RLVB — GitHub](https://github.com/declare-lab/RLVB) — 對應「RLVB 的核心招式」一節，獎勵函式與訓練流程的官方實作
