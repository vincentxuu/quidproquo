---
title: "AI Engineer 面試日練 — 2026-10-31：Paper Reading"
date: 2026-10-31
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: zh-TW
description: "今天讀的是 Continual Learning Exam（CLE）——一篇質疑『agent 評測只看單次任務表現』這件事的論文，練的是面試官給你一個評測結果、要你診斷評測設計本身有沒有問題的題型。"
tldr: "今天的論文是 Continual Learning Exam（arXiv:2610.33956，2026-10-25 發布），用 120 個五關任務鏈、89 種職業角色，測 agent 能不能把前面任務學到的東西用在後面的任務上。結果是最強系統也只闖過 47.7% 的關卡、完整通關五關的任務只有 23.3%，而且加回饋重做一次,中位數只進步 5.3 個百分點。練習題模擬面試官丟一組『單次任務分數很高、但長任務鏈表現很差』的評測結果，要你診斷是模型真的學不會，還是評測設計本身把『記得住』跟『用得上』混在一起算。"
series:
  name: "AI Engineer 面試日練"
  order: 73
---

> 🌏 [English version](/posts/daily/2026-10-31-ai-interview-daily-en)

## 今日主題

星期六是 Paper Reading，練的不是背論文結論，是面試官把一個評測結果丟給你、要你當場判斷「這個數字代表什麼、評測設計有沒有漏洞、要怎麼改」的那種討論題。這類題型常出現在 research-oriented 的 AI 職位，考的是你能不能看穿一個漂亮的 benchmark 分數背後藏著什麼假設，而不是流利地複述摘要。今天選的論文是 2026-10-25 掛上 arXiv 的 Continual Learning Exam（CLE），主題是「現在的 agent 評測大多只看單次任務表現，很少真的測 agent 能不能從累積的經驗裡變強」，跟 Thursday 的 LLM & Agent Engineering 主題直接相關，剛好可以拿來練這種評測設計討論題。

## 核心概念速記

### 1. Continual learning 考的是「用得上」，不是「記得住」

Continual learning 在這篇論文裡的定義很具體：agent 要能在長時間跨度裡,把從經驗中取得的知識拿來精煉、重用,同時不丟掉之前學到的有用能力。這跟單純的「記憶」不一樣——LoCoMo 這類 benchmark 測的是「agent 能不能從對話歷史裡查到資訊」,屬於長期記憶的問答能力；CLE 測的是「agent 能不能把前面任務解出來的方法,應用到後面結構相關、但不完全一樣的新任務上」,這才是面試官真正想聽到你區分清楚的地方。

### 2. 用「五關任務鏈」把單次任務變成累積考驗

CLE 的核心設計是把 120 個人工撰寫的任務,每個拆成 5 個關卡(level),組成一條鏈——後面的關卡會刻意重用前面關卡累積的知識跟產出,例如先比較兩版晶片的硬體介面差異、列出會影響的修正項目,後面的關卡再拿這份清單去診斷另一個相關問題、往回移植修正、補寫 errata。agent 在整條鏈上共用同一個 harness 狀態,過關才能解鎖下一關,解決不了的關卡以下全部算失敗。這種設計刻意讓「這一關會不會解」跟「上一關學到的東西有沒有被用上」綁在一起,逼你沒辦法只靠單次任務的運氣拿高分。

### 3. 用「回饋＋一次修正」隔離出學習能力,而不是單純的任務難度

CLE 比較兩種設定:一次提交定生死,跟失敗後給診斷回饋、允許修正一次再評。17 組 harness-model 設定測下來,回饋加修正讓完成率的中位數只多了 5.3 個百分點——這個數字的重點不是「有沒有進步」,是進步幅度小到足以說明,現在的前沿模型即使拿到明確的失敗原因,也沒辦法有效把回饋轉成下一步的正確動作。這跟面試官常考的「怎麼設計實驗把『能力不足』跟『資訊不足』分開驗證」是同一套思路。

```diagram
title: CLE 怎麼把「單次任務表現」跟「累積學習能力」分開測
desc: 五關任務鏈強制後面關卡依賴前面累積的知識；回饋＋一次修正的對照設定，進一步把「給了資訊還學不會」跟「沒拿到資訊」分開驗證
caption: 最強系統仍只闖過 47.7% 關卡，完整通關五關的任務僅 23.3%；回饋＋修正的中位數進步只有 5.3 個百分點
---
<svg viewBox="0 0 640 320">
  <rect class="dg-zone" x="40" y="40" width="560" height="112" rx="8"/>
  <text class="dg-tag" x="56" y="60" dominant-baseline="central">任務鏈（5 關）</text>
  <rect class="dg-box" x="64" y="84" width="88" height="52" rx="6"/>
  <text class="dg-label" x="108" y="110" text-anchor="middle" dominant-baseline="central">L1</text>
  <rect class="dg-box" x="176" y="84" width="88" height="52" rx="6"/>
  <text class="dg-label" x="220" y="110" text-anchor="middle" dominant-baseline="central">L2</text>
  <rect class="dg-box" x="288" y="84" width="88" height="52" rx="6"/>
  <text class="dg-label" x="332" y="110" text-anchor="middle" dominant-baseline="central">L3</text>
  <rect class="dg-box" x="400" y="84" width="88" height="52" rx="6"/>
  <text class="dg-label" x="444" y="110" text-anchor="middle" dominant-baseline="central">L4</text>
  <rect class="dg-box dg-box--accent" x="512" y="84" width="88" height="52" rx="6"/>
  <text class="dg-label" x="556" y="110" text-anchor="middle" dominant-baseline="central">L5</text>
  <path class="dg-line" d="M152 110H172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M264 110H284" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M376 110H396" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M488 110H508" marker-end="url(#arrow)"/>
  <text class="dg-sub" x="332" y="66" text-anchor="middle" dominant-baseline="central">每關重用前關累積的知識，解不了以下全部算失敗</text>

  <rect class="dg-box" x="64" y="204" width="220" height="80" rx="6"/>
  <text class="dg-label" x="174" y="230" text-anchor="middle" dominant-baseline="central">單次提交</text>
  <text class="dg-sub" x="174" y="256" text-anchor="middle" dominant-baseline="central">失敗＝這關結束</text>

  <rect class="dg-box dg-box--accent" x="356" y="204" width="220" height="80" rx="6"/>
  <text class="dg-label" x="466" y="230" text-anchor="middle" dominant-baseline="central">回饋＋一次修正</text>
  <text class="dg-sub" x="466" y="256" text-anchor="middle" dominant-baseline="central">中位數只多進步 5.3 個百分點</text>

  <path class="dg-line dg-line--accent" d="M284 244H352" marker-end="url(#arrow-accent)"/>
  <text class="dg-tag" x="318" y="226" text-anchor="middle" dominant-baseline="central">對照</text>
</svg>
```

### 4. 用「rubric 評分」取代單一正確答案,才能測開放式專業任務

CLE 的 120 個任務橫跨 12 個領域、89 種職業角色,很多題目沒有單一正確答案(例如寫 errata、診斷硬體問題),沒辦法用字串比對或單元測試打分。論文的做法是讓一個評估 agent 依照 50 多位領域專家寫好的 rubric,逐項檢查每個提交是不是滿足所有要求項目,全部滿足才算過關。這種設計能擴大到開放式專業任務,但也帶來一個面試官很愛追問的風險:評估 agent 本身的判斷力跟 rubric 的完整度,直接決定了整個 benchmark 的天花板——rubric 寫漏一項,整個評分就會系統性偏鬆或偏嚴。

### 5. 高完成率的單次任務,不代表能撐過長任務鏈

把「最強系統只闖過 47.7% 關卡」跟「業界常見的單次任務 benchmark 動輒 80-90% 完成率」放在一起看,面試官要你講出的核心洞察是:現在大部分 agent 的強,是「在單一、邊界清楚的任務裡表現好」,一旦要求跨多個關卡累積、重用、不能遺忘前面的知識,表現會斷崖式下滑。這跟你們公司內部如果用單次任務的 pass rate 當 agent 上線的唯一門檻,等於完全沒驗證過「這個 agent 能不能在真實、會累積狀態的多輪工作流裡撐住」是同一個盲點。

## 今日練習題

### 題目

面試官給你看一份內部評測報告:你們的客服 agent 在單次任務 benchmark 上拿到 89% 完成率,但上線後在真實多輪工作流裡(處理退款,接著處理同一客戶後續追問,再處理相關的帳務調整)完成率只有 52%。面試官問:「這個落差你會怎麼診斷?是模型能力不夠,還是你們的評測設計本身有問題?你會怎麼重新設計評測,把這兩種可能性分開驗證?」

**來源**：改編自 Continual Learning Exam（arXiv:2610.33956，Haoyu Zhao 等 19 位作者，2026-10-25 發布）的評測發現，模擬 paper-reading 面試常見的「給你一個評測落差，討論怎麼重新設計評測」題型　**難度**：進階　**環節**：onsite system design / research discussion round

### 拆解思路

1. **先釐清問題**：先問清楚單次任務 benchmark 跟真實多輪工作流的任務分佈是不是同一批——如果 benchmark 題目本來就比真實案例簡單,落差可能只是任務難度沒對齊,不一定是學習能力的問題。也要問清楚「真實工作流」裡,後面的任務是不是真的依賴前面任務的輸出,還是只是時間上接續發生而已。
2. **建立框架**：借用 CLE 的拆解方式,把落差拆成兩層分開驗證——單次任務層(agent 在孤立、邊界清楚的任務上行不行)跟累積依賴層(agent 能不能把前一輪任務的結果正確帶到下一輪,不遺漏、不弄錯)。用類似 CLE 的任務鏈設計,把真實工作流重新切成有明確依賴關係的關卡,分別測每一關的孤立表現跟鏈式表現。
3. **深入核心**：討論怎麼用回饋/修正的對照設定,把「能力不足」跟「資訊不足」分開——如果給 agent 明確指出前一輪哪裡出錯,它能不能修正過來。如果給了回饋還是改不好,代表是模型的累積推理能力不夠；如果一給回饋就大幅進步,代表問題出在系統沒有把前一輪的關鍵資訊有效傳遞給 agent,是 context 設計的問題,不是模型能力的問題。
4. **收尾**：提出用 rubric 式評分取代二元 pass/fail,列出「有沒有正確延續前一輪的客戶上下文」「有沒有重複問已經問過的問題」「帳務調整是不是跟前面的退款一致」這類具體檢查項,並誠實點出這種評分方式的風險——rubric 寫得不完整,反而會讓評測結果看起來比實際更好或更差。

### 範例回答（面試時可以這樣講）

> **先確認落差的性質。** 我不會馬上假設是模型能力不夠。第一步是確認單次任務 benchmark 跟真實工作流的任務難度有沒有對齊——如果 benchmark 本來就只測孤立、邊界清楚的任務，而真實工作流需要跨三輪累積上下文（退款→追問→帳務調整），那 89% 跟 52% 可能本來就不是同一件事在比。我會先把真實工作流拆成跟 benchmark 一樣細的任務單位，才能做蘋果對蘋果的比較。
>
> **把落差拆成兩層。** 借用 CLE 的思路，我會把評測重新設計成有明確依賴的任務鏈——每一關都要求 agent 用到前一關的輸出（例如第二輪必須正確記得第一輪的退款金額跟原因），而不是只是時間上接續。然後用回饋＋一次修正的對照設定來診斷：如果給 agent 明確點出「你在第二輪忘了退款已經處理過」這類具體錯誤，它能不能修正。能修正，問題在 context 傳遞的系統設計；修正了還是錯，才是模型的累積推理能力真的不夠。
>
> **用 rubric 取代單一完成率數字。** 我會把「完成率」拆成具體的檢查項，像是有沒有正確延續客戶上下文、有沒有重複問已經問過的問題、帳務調整的金額跟前面的退款是不是一致，每項都過才算整輪通過，而不是籠統的一個百分比。同時我會在報告裡誠實寫清楚這套 rubric 的覆蓋範圍，因為 rubric 寫漏一項，就會讓評測結果系統性偏離真實情況——這點我會對照 CLE 論文裡提到評估 agent 的判斷力跟 rubric 完整度直接決定 benchmark 天花板這個風險，一併寫進評測方法的限制說明。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先確認單次任務 benchmark 跟真實工作流的任務難度有沒有對齊 | |
| 把落差拆成「孤立任務表現」跟「累積依賴表現」兩層分開驗證 | |
| 用回饋／修正對照設定，把「能力不足」跟「資訊傳遞不足」分開診斷 | |
| 提出用 rubric 式檢查項取代單一完成率數字 | |
| 討論跨任務依賴的任務鏈設計怎麼具體落地到客服場景 | |
| 加分：主動點出評估方式本身（rubric 覆蓋度）的風險與限制 | |

## 延伸閱讀

- [Continual Learning Exam 論文全文（HTML）— arxiv.org/html/2610.33956](https://arxiv.org/html/2610.33956) — 五種知識形式的任務鏈設計細節，以及 17 組 harness-model 完整實驗數據
- [CLE-Lite Dataset — Hugging Face](https://huggingface.co/datasets/Continual-Learning-Exam/CLE-Lite) — 可直接下載的精簡版任務集，適合動手跑一組任務感受「累積依賴」的設計長什麼樣子
- [Continual Learning with RL for LLMs — Cameron Wolfe](https://cameronrwolfe.substack.com/p/rl-continual-learning) — 從傳統 continual learning 研究（catastrophic forgetting）銜接到 LLM 時代的背景整理，補今天概念 1 的理論脈絡

## 參考資料

- [Continual Learning Exam: Benchmarking Long-Horizon RSI and Experiential Learning in LLM Agents — arXiv:2610.33956](https://arxiv.org/abs/2610.33956) — 今日 Paper Reading 核心概念速記與練習題設計的原始論文,任務鏈設計、評估協定與完成率數據的來源
- [CLE-Lite Dataset — Hugging Face](https://huggingface.co/datasets/Continual-Learning-Exam/CLE-Lite) — 任務集規模（120 任務、89 職業角色、12 領域）的補充說明
- [CLE Tests Long-Horizon Continual Learning in LLM Agents — CCTest](https://cctest.ai/en/articles/cle-tests-whether-llm-agents-can-truly-learn-over-time) — 第三方對論文核心發現的獨立摘要，交叉確認數字
