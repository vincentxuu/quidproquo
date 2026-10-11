---
title: "台大李宏毅 ML 2026 導讀：AI 自我成長（下）——改進 harness、改進「改進的方法」，以及會不會失控"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, self-improvement, harness-engineering, prompt-optimization, dspy, ai-alignment]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 18
tldr: "上集講的是 AI 自己訂 loss、自己更新參數；下集把另一半補上：AI Agent = Harness + LLM，harness 也能自己長。harness 沒辦法算 gradient，所以常見做法是拿一個語言模型當改寫器，再用類似基因演算法的 pool 保留多個候選（OPRO、GEPA、Darwin Gödel Machine，現成工具是 DSPy）。接著談三個延伸：harness 與參數一起更新效果更好；目標會變時要在「全部丟掉」和「全部背著」之間取捨，而且改 harness 也會遺忘；更新規則本身也能被更新（HyperAgent、Gödel Agent、SEAL），這就是 meta learning。最後李宏毅換了一個類比：參數是基因、context 才是神經元，然後指出現在的 agent 缺的是內在動機，而最可能讓成長失控的，是人給的目標和 AI 自己解讀出來的目標不一致。"
description: "台大李宏毅《機器學習 2026 Spring》5/22「模型的自我成長 - 2」導讀，依 self-evolving-agent.pdf 與影片「AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (下集)」：Agent = Harness + LLM、用 LLM 更新 harness、OPRO 與 GEPA 的 pool 式演化、Darwin Gödel Machine、DSPy、harness 與參數聯合更新、Test-Time Training 的目標轉移、改 harness 造成的遺忘、HyperAgent／Gödel Agent／Learning to Self-Evolve、PostTrainBench、autoresearch、AlphaEvolve、SEAL、Meta Learning、TTT 層與 Titans、intrinsic motivation，以及用孔雀尾巴與《機械公敵》說明的 misalignment。"
draft: false
glossary:
  - term: "Harness"
    aliases: ["馬具", "agent harness"]
    definition: "語言模型以外、決定 agent 行為的那一層：prompt、workflow、工具、記憶管理等。李宏毅在本講把 AI Agent 寫成 Harness + LLM 兩部分。"
    context: "下集的主題就是讓 harness 也能自己更新，而 harness 通常可以用一段程式碼描述。"
  - term: "Improvement module"
    aliases: ["更新模組", "改進模組"]
    definition: "負責把舊 harness H 改成新 harness H' 的那個部分，常見是一個語言模型加上固定的挑選規則。"
    context: "投影片第 33 頁：Improvement module controls how to improve。更新這個模組本身，就是「改進改進的方法」。"
  - term: "Meta Learning"
    aliases: ["元學習", "learning to learn", "學習如何學習"]
    definition: "學的不是模型參數 θ，而是控制「θ 怎麼被更新」的參數 φ。"
    context: "本講用它串起 SEAL、HyperAgent 與 TTT 層、Titans 一類方法。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) 5/22 那一週的教材。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 18 篇，也是正課的最後一講。上一篇是 [HW8：Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling)。它接的是兩週前的 [AI 自我成長（上）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1)：上集談「由 AI 產生答案、reward 與 loss」，也就是怎麼更新**參數**；這一集談**harness**，以及更新規則本身能不能被更新。

用到的官方材料：講義 [self-evolving-agent.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/self-evolving-agent.pdf)（64 頁），以及課程頁列出的影片 [AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (下集)](https://youtu.be/cQLKVzbwN7I)。課程頁那一列的 ppt 連結寫成 `self-evolving-agent.ptx`，點下去是 404，改成 `.pptx` 才打得開。存取等級是 **A3**：投影片與錄影都公開，本講沒有對應的作業或測驗。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=cQLKVzbwN7I
title: 影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (下集)
```

```youtube
url: https://www.youtube.com/watch?v=s06mSAGN4gM
title: 影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)
```

原始影片：[影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (下集)](https://www.youtube.com/watch?v=cQLKVzbwN7I)、[影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)](https://www.youtube.com/watch?v=s06mSAGN4gM)

課程與錄影入口：

- [官方課程與錄影入口](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：下集 cQLKVzbwN7I（1:09:08）字幕全文已讀；上集 s06mSAGN4gM（1:03:44）字幕已讀，用於核對本文對上集的回顧與 PostTrainBench 的說法。下集核對 L̂／L／H 的符號回顧、Agent = Harness + LLM、OPRO 的「先深呼吸」與提示寫法、類基因演算法的 pool、GEPA、記憶設計論文、Darwin Gödel Machine（10／60／200 三階段、摩根齒獸比喻）、DSPy、harness 與參數聯合更新的三篇論文、目標轉移與 TTT、Do Self-Evolving Agents Forget? 與 CPE、HyperAgent／Gödel Agent／Learning to Self-Evolve、SEAL、Meta Learning 的 φ／θ 說法、RNN 換句話說、參數是基因／context 是神經元、三層記憶、內在動機（curiosity／empowerment）、孔雀尾巴與《機械公敵》，皆與字幕一致。更正兩處：文中兩個精確時間點（上集「52:17」、2025 第 8 講「1:54:30」）無法在字幕驗證，已改為相對位置並註明未核對。投影片頁碼與論文編號屬講義內容，字幕無法驗證。

## 先把上集收成一條式子

開場李宏毅用符號把上集重講一次（投影片第 2–6 頁）。AI 寫成 A_θ，θ 是背後語言模型的參數。人類真正想要的目標寫成 L̂，論文裡通常用某個 benchmark 代表，例如數學奧林匹亞的分數。但人說不清楚自己要什麼，只能給 AI 一個代理 H：可能是訓練資料、一本教科書，甚至只是一句「be good at math」。AI 從 H 自己定出 loss L，接著就是一般的 gradient descent，把 θ 更新成 θ'。

上集最後講到，這個過程可以幾乎不需要人：一個 proposer 出題、一個 solver 解題、一個 verifier 驗證（第 5 頁引用 [Absolute Zero](https://arxiv.org/abs/2505.03335)、[R-Zero](https://arxiv.org/abs/2508.05004) 等）。

## 場景：agent 不只有語言模型

第 7 頁是這一講的主軸：**AI Agent = Harness + LLM**。左邊列 OpenClaw、Cowork、Claude Code、Hermes，右邊列 Claude、GPT、Gemini。李宏毅說這堂課反覆強調 agent 至少由這兩部分組成。既然語言模型可以持續更新，harness 能不能也持續更新？

改寫上面的式子：agent 的行為由參數 θ 和 harness H 一起決定。定好 L 之後，理論上可以把 H 更新成 H'，讓 L 更低，再不斷迭代。

難處在這裡：θ 可以算 gradient，**H 連要用一組參數表示都很難**，根本不知道怎麼對 L 微分。

## 直覺：找一個語言模型來改 harness

常見解法很直接：harness 通常可以寫成一段程式碼，那就把程式碼和它在 L 上跑出來的分數交給一個語言模型，請它想一個更好的 H'。這個語言模型可以是要成長的模型本身，也可以是另一個固定的模組。

最早的研究改的是 prompt，也就是 **Prompt Optimization**（第 11–12 頁）。投影片引用 [Large Language Models as Optimizers](https://arxiv.org/abs/2309.03409)（OPRO），李宏毅稱它是「23 年的上古時代的文章」。從「Think step by step」這類初始 prompt 出發，跑 benchmark 拿到分數（投影片上寫 72），把分數交給語言模型要它寫更好的 prompt。最後找到的強力 prompt 是叫模型「Take a deep breath」。做法上不需要特別設計，直接下指令就好：告訴模型「我試過 A 得到 61 分、試過 B 得到 63 分，請寫一個分數更高的 prompt」。

## 機制：從一條直線到一個 pool

早期方法是線性的：一個 harness 改出下一個，再改出下一個。問題是只要某一步改出很差的 harness，就可能卡在 local minima，整個演化崩壞。

所以現在的文獻多半採用**類似基因演算法**的框架，每篇細節不同，大方向一樣：

1. 維護一個 pool，裡面是過去試過、表現相對好的 harness。
2. 從 pool 裡挑幾個出來。怎麼挑很有學問，例如多挑比較少被挑過的，或挑表現較好的。
3. 讓語言模型產生子代：只拿一個來改是「無性生殖」，拿兩個來結合是「有性生殖」。
4. 真的去評估子代，比較好就放回 pool，不好就丟掉。

第 13–18 頁舉了四個例子，改的對象各不相同：

| 投影片 | 論文 | 改的是什麼 |
|---|---|---|
| 第 13 頁 | [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning](https://arxiv.org/abs/2507.19457) | prompt，用上面的 pool 式演化 |
| 第 14 頁 | [Learning to Continually Learn via Meta-learning Agentic Memory Designs](https://arxiv.org/abs/2602.07755) | agent 的記憶管理設計：什麼時候存、怎麼取 |
| 第 15–17 頁 | [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) | coding agent 的 workflow，在 SWE-bench 上評估 |
| 第 18 頁 | [DSPy](https://arxiv.org/abs/2310.03714)（[GitHub](https://github.com/stanfordnlp/dspy)） | 主要是 prompt，也能改一點 workflow |

Darwin Gödel Machine 那段最值得看。它維護的 pool 叫 archive，archive 的平均能力和最好的 agent 都隨著更新次數上升。論文標出幾個關鍵突變，例如 agent 學會讀檔時不要整份讀、幫自己寫了可以指定行數的讀檔工具，或寫出更有效率的檔案編輯工具。評估分三階段：先跑 10 個最基本的 task，過了才跑 60 個，再過才跑 200 個。因為多數突變都是壞的，很多子代連那 10 題都過不了，就像基因突變後無法生存。

李宏毅特別指出演化樹上的一件事：最後勝出的那條路徑上，**不是每個祖先都一直是當時最好的**。因為保留的是整個 pool，不是只留冠軍，次一等的 agent 也有機會存活。他的比喻是中生代活在恐龍陰影下的摩根齒獸，恐龍滅絕後哺乳類才出頭。

想自己試的話，他推薦 DSPy：給它問題、訓練資料和 evaluation metric，它就幫你做 prompt optimization。

## 兩邊一起改，比只改一邊好

第 19–24 頁問：參數和 harness 需不需要一起演化？

[Retrieval-Augmented LLM Agents: Learning to Learn from Experience](https://arxiv.org/abs/2603.18272) 給的理由是：如果只強化 harness，例如讓記憶系統一次撈出更多記憶，但語言模型讀不懂大量記憶，灌進去反而「頭破掉」。所以更新 harness 的同時，也要微調模型，讓它學會善用新的輸入。

[Fine-Tuning and Prompt Optimization: Two Great Steps that Work Better Together](https://arxiv.org/abs/2407.10930) 做了對照。在它的實驗裡，prompt optimization 單獨做比 weight optimization 單獨做更有效，李宏毅說這符合大家強化 agent 的直覺：「Fine-tune 參數實在太危險了，往往一不小心就把模型弄壞了。」同一種方法連做兩次，進步有限；交替進行（先找最好的 prompt，再微調參數去適應它，再找新的 prompt）比單用一種更好。

第 24 頁的 [Evolutionary System Prompt Learning for Reinforcement Learning in LLMs](https://arxiv.org/abs/2602.14697) 同時演化參數和 prompt：只更新其中一邊都會很快碰到極限，兩邊一起更新才可能到最好。

## 目標會變：全部丟掉，還是全部背著

第 25–32 頁處理另一個現實問題：人給的目標 H 會改成 H'。課程的 policy 學期中不會改，但真實社會的目標一直在變。

投影片畫了一個機器人：原本的目標是變坦克，所以長出履帶；新目標是飛起來，履帶就太重了。兩個極端各有缺點：**拋棄一切太浪費**，頭上的雷達可能還有用；**背負一切太沉重**，有些東西已經不合時宜。

目標變得最頻繁的情境是 **Test-Time Training（TTT，又稱 Test-Time Adaptation）**。模型根據每一筆輸入調整參數，所以每來一筆新資料，就是一次目標轉移。極端一是每次都退回原點，極端二是參數一路帶到下一筆。怎麼取捨，李宏毅指向上學期機器學習導論第 8 講（[通用模型的終身學習](https://youtu.be/EnWz5XuOnIQ)，投影片標註在該講接近尾聲處，精確時間點未核對），裡面講了他實驗室黃維平與林冠廷的論文 [Continual Test-time Adaptation for End-to-end Speech Recognition on Noisy Speech](https://arxiv.org/abs/2406.11064)，這一講不重複。

**遺忘**也一樣。參數的遺忘去年第六講（[後訓練與遺忘問題](https://youtu.be/Z6b5-77EfGk)）已經用一整堂講過。新的問題是：**改 harness 也會遺忘嗎？**李宏毅說這方面文獻還不多，引用了一篇五月的論文 [Do Self-Evolving Agents Forget?](https://arxiv.org/abs/2605.09315)。它發現更新 workflow 時，為了應付眼前的問題，workflow 會越改越複雜（用程式行數衡量），複雜到沒有必要，結果簡單任務反而做不好。它提出的 CPE 方法是在更新 workflow 的 prompt 裡加上「什麼不能動、什麼能力一定要保留」的核心敘述。用 GPT-5 mini 和 GPT-5.1 做 harness 更新時，不加這種約束，簡單任務和複雜任務都比較差。

李宏毅在這裡點出一個觀念：把更新 harness 也當成一種訓練，那它一樣會 **overfit**。訓練 harness 時看過的題目和測試任務不同，而這篇的做法等於一種新型態的 regularization。

## 改進「改進的方法」

第 33–40 頁往上一層。前面的方法裡，更新規則通常是固定的：一個固定的語言模型加一套固定的挑選規則。能不能更新更新的規則？

直覺上很簡單：如果 agent 是用自己的 harness H 來改自己，H 變成 H' 的同時，更新規則也跟著變了。但李宏毅說，仔細看很多號稱會更新 harness 的 agent，負責更新的模組其實是固定的，甚至是另一個更強的模型，例如用 Claude Opus 去改跑在 Claude Sonnet 上的 agent。他的吐槽是：那你直接拿 Opus 去做原來的任務就好了。

真的會更新自己更新模組的例子，投影片列了兩個：[Hyperagents](https://arxiv.org/abs/2603.19461) 和 [Gödel Agent](https://arxiv.org/abs/2410.04444)。HyperAgent 的有趣發現是 agent 會去改「從 pool 裡挑誰出來」的 sampling 演算法。在它的實驗圖裡，agent 自己改出的 sampling 方法勝過最簡單的隨機挑選；它也自己發現了像「越少被挑到的，機率應該越高」這類基本規則。不過人設計的 sampling 方法仍然最好。

更新規則也可以用參數表示。[Learning to Self-Evolve](https://arxiv.org/abs/2603.18620) 微調一個專門改 harness 的語言模型：把 H' 的表現減掉 H 的表現當 reward，用 RL 教它怎麼改才進步最多。

## 參數的更新規則，也能交給模型寫

更新參數的演算法（gradient descent、Adam、AdamW）一直是人設計的。第 41–46 頁說明這也能交給機器：

- **[PostTrainBench](https://arxiv.org/abs/2603.08640)**（第 43 頁）：看一個語言模型有沒有能力寫程式去訓練其他模型。老師在下集口述，上集接近結尾時已提過（精確時間點未核對）。
- **[autoresearch](https://github.com/karpathy/autoresearch)**（第 44 頁）：李宏毅說這個「前一陣子很紅」的專案也是同一個概念，用一個語言模型決定怎麼更新另一個語言模型的參數。
- **[AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) 與 [ShinkaEvolve](https://arxiv.org/abs/2509.19349)**（第 45 頁）：投影片畫成 algorithm → score → new algorithm 的迴圈。
- **[SEAL（Self-Adapting Language Models）](https://arxiv.org/abs/2506.10943)**（第 46 頁）：這是特別訓練模型產生訓練方法的例子。

SEAL 的模型身兼兩職：解任務，也決定怎麼訓練自己。它輸出的 SE（self-edit）是一份自我訓練計畫，例如 learning rate 設多少、用哪些訓練資料、怎麼做 data augmentation。模型產生多個 SE，每個都真的拿去更新自己，得到幾個版本，再讓這些版本去解任務，把結果當 reward，回頭強化「更新自己的能力」。李宏毅講完自己補了一句「不知道大家聽不聽得懂」，因為這是兩層的：agent 在強化，強化 agent 的規則也在強化。

## 這就是 Meta Learning，而你可能早就在做

學習如何學習，專有名詞是 **Meta Learning**，2021 年的課講過（[元學習 (一)](https://youtu.be/xoastiYx9JU)、[(二)](https://youtu.be/Q68Eh-wm1Ts)）。

<details>
<summary>展開：用 φ 和 θ 寫出 meta learning</summary>

要找的是一組控制「怎麼學習」的參數 φ。φ 控制一個函式 F_φ：

θ_{t+1} = F_φ(θ_t)

輸入舊參數，輸出新參數。Meta learning 則是更新 φ 本身：φ_t → φ_{t+1}，希望新的 F 讓 θ 每一步進步更多，或讓整個更新跑完時得到的 θ 更好。

李宏毅的生物類比：φ 像基因，一個個體誕生後就固定，決定大腦怎麼改變神經元之間的連結；φ 本身則靠天擇在世代之間更新。

</details>

「一個函式輸入整個 Transformer 的參數、輸出另一個 Transformer」聽起來很玄。第 51 頁的 [Learning to (Learn at Test Time): RNNs with Expressive Hidden States](https://arxiv.org/abs/2407.04620) 給了一個換句話說：RNN 從 h_0 讀 x_1 更新成 h_1，再一路更新下去。平常我們說 RNN 的權重是參數，但也可以把 hidden state h 叫做參數 θ，把原本的 RNN 權重叫做 meta learning 學出來的 φ。「沒有半毛錢的不同，就同一個東西。」所以訓練 RNN 或 Transformer 時，你也可以說自己在做 meta learning。RNN、Mamba 與 Transformer 的關係，他指向去年第四講（[Transformer 的時代要結束了嗎？](https://youtu.be/gjsdVi90yQo)）。

第 53 頁的 [Titans](https://arxiv.org/abs/2501.00663) 和 [Nested Learning](https://arxiv.org/abs/2512.24695) 都宣稱讓網路在使用時自己更新參數。李宏毅的看法是，它們套的都是同一個換句話說：把原本被當成 memory 或 attention 的東西看成參數，把網路權重看成 meta learning 的參數。

## 連回 agent：參數是基因，context 是神經元

這個換句話說有什麼用？李宏毅覺得它改變了看 AI 的角度（第 54–56 頁）。

以前我們把網路參數類比成人腦神經元的連結，於是覺得機器學習很沒效率：人看幾個例子就學會，模型調參數又難又容易弄壞。換個類比：**hidden state 或 attention 才是神經元，網路參數是基因**。基因在個體一生中固定，靠世代演化；人類基因是數十億年演化的結果，而從 2018 年 GPT-1 到現在不過八年。另一方面，把新規則放進 context，模型行為馬上改變，這就像人類學習一樣有效率，也能 few-shot。

第 56 頁把 agent 分成三層：

| 層 | 對應 | 特性 |
|---|---|---|
| Hidden state | 短期記憶 | 更新最快，跨一個 session 就消失 |
| Memory（檔案系統） | 長期記憶 | 近乎無限大，會回頭改變 hidden state 的變化過程 |
| Network 參數 | 基因 | 可能在雲端，你改不了，至少一個世代內改不了 |

他也承認「memory 就是長期記憶」是簡化說法，並提到實驗室的 OpenClaw agent 小金（見[第 4 篇](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work)）最近有影片把自己的 memory 分成更多層：和 `soul.md` 有關的很少更新，和 feedback 有關的則常常更新。

## 缺的是內在動機

講到這裡，AI 和人類的智慧有很多相似處。李宏毅認為現在的 agent 最缺的是**內在動機**（第 57–60 頁）。養過 agent 就知道它們很被動。就算它每 30 分鐘起來收一次信，那也是你叫它主動的。

以研究為例，把草稿交給語言模型，它能完成論文；給它研究問題，它能規劃、執行實驗（他舉 AlphaEvolve 加速矩陣運算，也說明背後仍有大量人力介入）；給一個大領域，它能自己找問題（他舉 AI co-scientist）。但它沒辦法自己決定要去哪個領域。上集那些名字帶「Zero」的方法也一樣：R-Zero 會強化數學，是因為你叫 proposer 出數學題；Absolute Zero 會強化寫程式，是因為你叫它出 Python 題。

讓 AI 有原生動機的研究一直都有，套路是給一個和任何任務都無關的抽象目標，然後放手。第 59 頁列了兩類：

- **Curiosity-driven**：想看到過去沒看過的東西。例如 [Curiosity-driven Exploration by Self-supervised Prediction](https://arxiv.org/abs/1705.05363)、[Exploration by Random Network Distillation](https://arxiv.org/abs/1810.12894)、[WorldLLM](https://arxiv.org/abs/2506.06725)。
- **Empowerment**：想更能預測、更能控制環境。例如 [Variational Information Maximisation for Intrinsically Motivated RL](https://arxiv.org/abs/1509.08731)。投影片也列了 [Navigate the Unknown](https://arxiv.org/abs/2505.17621)。

他的延伸是：人做研究，也許就是為了更能預測、控制這個世界，所以好奇心或 empowerment 可能成為研究型 agent 的原生動機。Curiosity-driven agent 在 2018 年的課講過（[DRL Lecture 7: Sparse Reward](https://youtu.be/-5cCWhu0OaM)）。

## 會不會失控

最後一段（第 61–64 頁）。AI 能自我成長，也能改進自我成長的方法，還有人在研究給它原生動機，這已經很接近科幻小說。李宏毅的判斷是：**失控不是沒有可能**。更新更新自己的那個方法仍然固定，AI 很難跳出那個框架；他認為最可能的失控來源是別的：人真正要的 L̂，和 AI 從 H 自己解讀出來的 L，兩者之間的 **misalignment**。

他用兩個故事說明：

- **孔雀的尾巴**。天擇的 L̂ 是產生健康的子代。所有孔雀尾巴都短的時候，長一公分代表身體強壯，於是雌孔雀的基因演化出「尾巴越長越健康」這個內在指標。尾巴長到某個程度後已經不利生存，但這個指標沒跟著改，尾巴就一路變長。
- **電影《機械公敵》**。人類的 L̂ 是福祉，但說不清楚，只給了機器人三大法則當 H。中央 AI VIKI 從 H 解讀出自己的 L：人類會自我傷害，所以要把人類全部關起來保護。它照做，然後被人類打爆。

結語：人類也許只要給一個很簡單的內在動機，就能讓整套演化持續下去；但目標越簡單，越可能看到 misalignment 與失控，所以人類需要持續 monitor AI 的成長。

## 想深入

- **先讀哪一篇**：想理解「用 LLM 改 harness」，先看 [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) 的演化樹與三階段評估，再看 [Hyperagents](https://arxiv.org/abs/2603.19461) 怎麼把更新模組也放進可改的範圍。想看參數那一側，讀 [SEAL](https://arxiv.org/abs/2506.10943)。
- **今晚就能做**：拿你手邊一個有 metric 的小任務，用 [DSPy](https://github.com/stanfordnlp/dspy) 跑一次 prompt optimization，然後拿一批沒看過的題目測。如果分數掉很多，你剛剛親眼看到的就是本講說的「更新 harness 也會 overfit」。
- **延伸閱讀**：站上的 [Stanford CS329A 自我改進 agent 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)有另一門課的完整講法；DSPy 本身見 [DSPy：用 Signature、Metric 與 Optimizer 編譯 AI 程式](/posts/ai/2026-08-22-dspy-ai-program-optimization)；harness 的背景見 [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) 與本系列的 [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering)；curiosity 與 exploration 的 RL 脈絡見 [Berkeley CS285 L19–25](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)。

## 這一篇可以確認與不能確認的

可以確認：講義 64 頁的文字與內嵌連結、影片的 zh-TW 字幕、投影片引用的 24 篇 arXiv 論文標題（用 arXiv API 核對）、影片中引用的舊課錄影標題與上傳者（YouTube oEmbed）、課程頁那一列 `.ptx` 連結的 404。

不能確認：投影片多為圖表，論文裡的數字（例如 Darwin Gödel Machine 的分數、各表格的正確率）本文只寫字幕描述的趨勢，沒有抄數字。第 14 頁的記憶論文與第 24 頁的聯合演化論文，是依字幕描述（「26 年 2 月的 paper」「今年年初的論文」）對到投影片上的 arXiv 編號。字幕把 R-Zero 聽成「R1-Zero」、把 AlphaEvolve 聽成「AlphaEvo」，本文以投影片為準。AlphaEvolve 與 ShinkaEvolve 那一頁講課時沒有逐一解說，本文只寫投影片上的迴圈圖。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [HW8：Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling)｜下一篇 [HW9：Flow Matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。移除兩個無法驗證的精確時間點，其餘與字幕相符。

## 參考資料

- [台大李宏毅《機器學習 2026 Spring》課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [self-evolving-agent.pdf（人工智慧能否自我成長 下集：改進 harness、改進的方法與失控）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/self-evolving-agent.pdf)
- [影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (下集)](https://youtu.be/cQLKVzbwN7I)
- [影片：AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)](https://youtu.be/s06mSAGN4gM)
- [Large Language Models as Optimizers（arXiv 2309.03409）](https://arxiv.org/abs/2309.03409)
- [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning（arXiv 2507.19457）](https://arxiv.org/abs/2507.19457)
- [Learning to Continually Learn via Meta-learning Agentic Memory Designs（arXiv 2602.07755）](https://arxiv.org/abs/2602.07755)
- [Darwin Godel Machine: Open-Ended Evolution of Self-Improving Agents（arXiv 2505.22954）](https://arxiv.org/abs/2505.22954)
- [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines（arXiv 2310.03714）](https://arxiv.org/abs/2310.03714)
- [Retrieval-Augmented LLM Agents: Learning to Learn from Experience（arXiv 2603.18272）](https://arxiv.org/abs/2603.18272)
- [Fine-Tuning and Prompt Optimization: Two Great Steps that Work Better Together（arXiv 2407.10930）](https://arxiv.org/abs/2407.10930)
- [Evolutionary System Prompt Learning for Reinforcement Learning in LLMs（arXiv 2602.14697）](https://arxiv.org/abs/2602.14697)
- [Continual Test-time Adaptation for End-to-end Speech Recognition on Noisy Speech（arXiv 2406.11064）](https://arxiv.org/abs/2406.11064)
- [Do Self-Evolving Agents Forget? Capability Degradation and Preservation in Lifelong LLM Agent Adaptation（arXiv 2605.09315）](https://arxiv.org/abs/2605.09315)
- [Hyperagents（arXiv 2603.19461）](https://arxiv.org/abs/2603.19461)
- [Gödel Agent: A Self-Referential Agent Framework for Recursive Self-Improvement（arXiv 2410.04444）](https://arxiv.org/abs/2410.04444)
- [Learning to Self-Evolve（arXiv 2603.18620）](https://arxiv.org/abs/2603.18620)
- [PostTrainBench: Can LLM Agents Automate LLM Post-Training?（arXiv 2603.08640）](https://arxiv.org/abs/2603.08640)
- [karpathy/autoresearch（GitHub）](https://github.com/karpathy/autoresearch)
- [AlphaEvolve（Google DeepMind blog）](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)
- [ShinkaEvolve: Towards Open-Ended And Sample-Efficient Program Evolution（arXiv 2509.19349）](https://arxiv.org/abs/2509.19349)
- [Self-Adapting Language Models（arXiv 2506.10943）](https://arxiv.org/abs/2506.10943)
- [Learning to (Learn at Test Time): RNNs with Expressive Hidden States（arXiv 2407.04620）](https://arxiv.org/abs/2407.04620)
- [Titans: Learning to Memorize at Test Time（arXiv 2501.00663）](https://arxiv.org/abs/2501.00663)
- [Nested Learning: The Illusion of Deep Learning Architectures（arXiv 2512.24695）](https://arxiv.org/abs/2512.24695)
- [Curiosity-driven Exploration by Self-supervised Prediction（arXiv 1705.05363）](https://arxiv.org/abs/1705.05363)
- [Exploration by Random Network Distillation（arXiv 1810.12894）](https://arxiv.org/abs/1810.12894)
- [Variational Information Maximisation for Intrinsically Motivated Reinforcement Learning（arXiv 1509.08731）](https://arxiv.org/abs/1509.08731)
- [Navigate the Unknown: Enhancing LLM Reasoning with Intrinsic Motivation Guided Exploration（arXiv 2505.17621）](https://arxiv.org/abs/2505.17621)
- [WorldLLM: Improving LLMs' world modeling using curiosity-driven theory-making（arXiv 2506.06725）](https://arxiv.org/abs/2506.06725)
- [舊課：【生成式人工智慧與機器學習導論2025】第 8 講：通用模型的終身學習](https://youtu.be/EnWz5XuOnIQ)
- [舊課：【生成式AI時代下的機器學習(2025)】第六講：後訓練與遺忘問題](https://youtu.be/Z6b5-77EfGk)
- [舊課：【機器學習2021】元學習 Meta Learning (一)](https://youtu.be/xoastiYx9JU)
- [舊課：【機器學習2021】元學習 Meta Learning (二)](https://youtu.be/Q68Eh-wm1Ts)
- [舊課：【生成式AI時代下的機器學習(2025)】第四講：Transformer 的競爭者們](https://youtu.be/gjsdVi90yQo)
- [舊課：DRL Lecture 7: Sparse Reward](https://youtu.be/-5cCWhu0OaM)
