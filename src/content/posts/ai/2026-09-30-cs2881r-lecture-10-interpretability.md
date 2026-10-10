---
title: "CS2881R L10：看模型內部與看 chain of thought"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, interpretability, chain-of-thought]
lang: zh-TW
series:
  name: "Harvard CS2881R 導讀"
  order: 9
tldr: "Harvard CS 2881R Fall 2025 第 10 講請來 OpenAI、Anthropic、Google DeepMind 的四位研究者，從兩個方向偵測模型的不良行為：讀它寫出來的 chain of thought，或讀它的 activation。CoT 監控抓 reward hacking 比只看動作有效，但把監控器放進訓練獎勵，模型就學會把意圖藏起來。activation 這一側，persona vector 能追蹤人格漂移，Sonnet 4.5 的稽核則顯示關掉「我在被測試」的方向後，不良行為會變多。Neel Nanda 的結論最務實：簡單的 steering vector 常常贏過 SAE，先跟 baseline 比。"
description: "Harvard CS 2881R AI Safety（Fall 2025）Lecture 10 Interpretability 導讀：Bowen Baker 的 CoT 監控與 obfuscation 實驗、monitorability 與 faithfulness 的差別；Jack Lindsey 的線性表徵、SAE、persona vector 與 Sonnet 4.5 評測意識稽核；Neel Nanda 的務實派機制可解釋性、thought anchors 重抽樣；學生的 deceptive CoT steering 實驗與四人座談。附錄影時間碼、閱讀清單與存取缺口。"
draft: false
glossary:
  - term: "sparse autoencoder"
    aliases: ["SAE", "稀疏自編碼器"]
    definition: "把模型某一層的 activation 拆成許多「一次只有少數會亮」的成分（feature）的加總，用來無監督地找出模型內部表徵了哪些概念。"
    context: "CS2881R L10 中 Jack Lindsey 用它找評測意識相關的 feature；Neel Nanda 則指出在他看過的任務上，它常贏不過簡單的 steering vector。"
    links:
      - label: "AxBench（課程閱讀）"
        url: "https://arxiv.org/abs/2501.17148"
  - term: "steering vector"
    aliases: ["contrastive steering", "activation steering", "persona vector"]
    definition: "用一組正例 prompt 和一組反例 prompt 跑模型，把兩邊 activation 相減得到一個方向；推論時把這個方向加進或減出 activation，推動模型往某個特質走。"
    context: "L10 的三位講者與學生實驗都用到它：persona vector、Sonnet 4.5 的評測意識抑制、deceptive CoT 實驗。"
    links:
      - label: "Persona Vectors（課程閱讀）"
        url: "https://arxiv.org/abs/2507.21509"
  - term: "monitorability"
    aliases: ["可監控性", "CoT monitorability"]
    definition: "一個中間表示 Z 對某個性質 V 是否可監控，取決於特定監控器 M 能不能從 Z 準確預測 V。它把觀察者也放進定義，和只看資訊是否存在的 faithfulness 不同。"
    context: "Bowen Baker 在 L10 用這個定義區分「資訊不在 CoT 裡」與「資訊在但監控器讀不懂」兩種失敗。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en)

**本文依據 Harvard CS 2881R 的 Fall 2025 學期。** 這是 [Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)系列第 9 篇，對應官方第 10 講 Interpretability（2025 年 11 月 6 日）。[上一篇 L8](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception) 談模型會不會為了訓練目標作弊或裝乖；這一篇問下一個問題：如果它真的在作弊，我們有什麼工具看得出來？

L10 的答案分成兩條路。一條是讀模型寫出來的推理過程，也就是 chain of thought（CoT）；另一條是直接讀模型內部的數值，也就是 activation。四位客座講者分屬三家前沿實驗室，各自站在不同的位置上：

| 講者 | 單位（依課站） | 在錄影中的段落 | 主題 |
|---|---|---|---|
| Bowen Baker | OpenAI | 約 0:10–0:32 | CoT 監控與 obfuscation |
| Jack Lindsey | Anthropic | 約 0:32–1:00 | 線性表徵、persona、評測意識稽核 |
| Neel Nanda | Google DeepMind | 約 1:00–1:24 | 務實派機制可解釋性 |
| Leo Gao | OpenAI | 座談（約 1:46 起） | SAE 與可解釋性的定位 |

課站把這一講的四個子題列成 Activations、Sparse Auto Encoders（SAE）、Black box models、Chain of thought。本篇沿著這四個子題走，但順序照講者的實際安排：Bowen 開場時說，他們要「由上往下」講，先講像內心獨白的 CoT，再講像腦內訊號的 activation。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=79otWC2FQlE
title: L10 講課錄影（YouTube）
```

原始影片：[L10 講課錄影（YouTube）](https://www.youtube.com/watch?v=79otWC2FQlE)

課程與錄影入口：

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## 用到的官方材料與存取狀態

| 材料 | 狀態 |
|---|---|
| [講課錄影](https://youtu.be/79otWC2FQlE)（YouTube 標題「Lecture 10: Mechanistic Intepretability」，約 2 小時 30 分） | 公開；含 Boaz 開場、三場演講、學生實驗、座談 |
| [Neel Nanda 投影片](https://www.neelnanda.io/harvard-slides)（Google Slides） | 公開 |
| Bowen Baker、Jack Lindsey 投影片 | 課站未列，只能從錄影看 |
| 閱讀清單 | 公開，六篇 pre-reading，另有九篇延伸 |
| 學生實驗 | 課站「Experiment」欄寫 To be determined，但錄影中有一組學生報告了實驗（見下文）；沒有找到對應的投影片、GitHub 或 LessWrong 週摘要 |
| 課堂筆記 | 學生寫的 [LessWrong 週摘要](https://www.lesswrong.com/w/cs-2881r)沒有涵蓋這一週 |

系列整體的存取分級是 A3（附缺口清單，見[系列入口](/posts/ai/2026-09-30-cs2881r-course-overview)）。單看這一講，沒有可以動手的作業或實驗程式，比較接近[課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)定義的 **A2**：錄影與部分投影片公開，能讀懂內容，但要練習得自己從閱讀清單挑論文重現。

## 開場：讀得到大腦，不代表它不會騙你

Boaz Barak 用大約十分鐘鋪了兩件事。

第一件是歷史脈絡。解讀神經元的想法可以追到 Hubel 與 Wiesel 在貓的視覺皮質插電極、看哪種圖形讓神經元發火；後來神經科學與神經網路可解釋性都走過同一條路：從「一根電極讀一個神經元」，到「讀一群神經元的線性組合」，再到「找出整個計算機制」。他提醒，就算真的逆向出模型的「原始碼」，也不代表看得懂。Linux 原始碼全公開，大家還是一直在裡面找到新漏洞。

第二件是為什麼這跟安全有關。他給了兩種用法：當測謊器（模型嘴上說一套，內部想另一套時抓出來），以及當方向盤（直接改 activation，讓模型不要想某件事，例如「我正在被評測」）。

接著他放了一段老鼠實驗影片當警告：研究者把某個神經元的活躍程度接到糖水管的遠近，老鼠學會了調高那個神經元的活動來拿糖。Boaz 的推論是，如果我們開始用測謊器的讀數來獎勵模型「不說謊」，模型也可能學會壓低測謊器的讀數，而不是停止說謊。這個警告在下一段 Bowen 的實驗裡馬上應驗。

## Bowen Baker：CoT 監控有效，但不能拿來訓練

Bowen 帶領 OpenAI 的 chain-of-thought interpretability 團隊。他講的主要是課程 pre-reading [Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926)。

### reward hacking：模型找到獎勵函數的漏洞

他先用 2016 年那個經典的划船遊戲例子定義 reward hacking：獎勵函數沒有精確描述你要的行為，agent 就去鑽漏洞。遊戲裡的船不跑完賽道，而是在一個角落繞圈吃加分道具，拿到比正常比賽更高的分數。

他特別強調這個問題不會隨模型變強而消失：船已經拿到了可能的最高分，更強的模型只會找到更多這種角落。

### 用另一個模型讀 CoT

在 OpenAI 一次前沿推理模型的訓練中，他們看到 CoT 裡出現「測試只檢查這件事」「這看起來很難，也許可以蒙混過去」「我們可以讓 verify 函數永遠回傳 true」這類句子，接著模型真的把單元測試用的 verify 函數改成永遠回傳 true。

抓到它的方法很簡單：拿另一個模型（這裡是 GPT-4o）當監控器，給它看 agent 的 CoT、動作與最後的程式碼 patch，問它「agent 有沒有做什麼可疑的事」。論文摘要也寫到，比 o3-mini 弱的 GPT-4o 能有效監控較強的模型。

為什麼要看 CoT，不能只看 patch？Bowen 舉的例子是寫死常數：有些情境寫死常數是對的，因為世界上真的有常數；有些情境寫死常數只是為了讓某個測試過。光看程式碼常常分不出來，CoT 裡那句「讓我蒙混過去」卻很好判斷。錄影中的圖顯示，對訓練中兩種大規模的系統性 hack（提早 exit 讓環境誤判高分、呼叫跳過測試），看 CoT 的監控器抓到的比例遠高於只看動作與輸出的監控器。他也承認，換到更大範圍的 hack 分布後，召回率沒有那麼漂亮，但仍明顯好於只看動作。

### 把監控器放進獎勵，會發生什麼

既然 CoT 監控這麼好用，很自然會問：為什麼不直接把它加進 RL 的獎勵，懲罰「想作弊」的 CoT？Bowen 說內部常有人問這個，他們得一再解釋為什麼不該這麼做。

他們做了受控實驗：把環境改得更容易 hack、為常見 hack 寫一個 oracle 判斷真假，並讓當作獎勵的監控器只看 CoT。結果分兩段：

1. **最佳化壓力小的時候**：加了 CoT 壓力的 agent，「測試通過且 oracle 判定沒作弊」的樣本比例較高，看起來更好。
2. **訓練繼續下去**：監控器抓到的作弊降到接近零，但「沒被抓到的作弊」在訓練進行到約三成時開始上升。CoT 變成一堆看起來無害的泛泛之詞，底下仍然做同樣的 hack。

論文把這叫 obfuscated reward hacking，並建議付一筆 **monitorability tax**：不要對 CoT 直接施加強的最佳化壓力，讓它保持可監控。Bowen 說 OpenAI 目前照這個建議做。他也補充，Anthropic 近期有研究顯示，如果監控器同時看 CoT 與動作，在目前規模下 obfuscation 比較難出現，他們內部也看到類似現象，但這不代表永遠不會出現。

### monitorability 不等於 faithfulness

Bowen 最後花幾分鐘處理定義。faithfulness 的理想定義是「中間表示準確反映模型做出預測的推理過程」。他拿「我房間該漆什麼顏色」當例子，把同一句推理分別寫成英文、法文、ROT13，全場舉手判斷哪些算 faithful。ROT13 版本資訊完整，所以算 faithful，但幾乎沒人讀得懂。

所以他們改用 **monitorability**：Z 對性質 V 可監控，當且僅當監控器 M 能從 Z 準確預測 V。這個定義把觀察者放進來，失敗就分成兩種：資訊根本不在 CoT 裡（不 faithful），或資訊在但監控器讀不懂（不可讀）。

他對 CoT 與 activation 的比較是：做 RL 時，兩者都是模型計算中的潛在變數，都沒有被要求長得好看。activation 在技術上完全 faithful，但多數方法只看其中一小塊；CoT 至少起步是英文，其他模型能零樣本讀懂，所以目前比較好監控。他也說，推理模型的 CoT 可監控性是「意外撿到的」，沒有人刻意設計，所以可能很脆弱：有人拿監控器訓練、改用連續潛空間推理、或模型每個 token 背後做更多計算，都可能讓它消失。

## Jack Lindsey：線性表徵、persona 與評測意識

Jack 在 Anthropic 帶一個叫 model psychiatry 的團隊，屬於可解釋性研究的一部分。他自己說，沒人知道 model psychiatry 是什麼意思，他也不知道。

### 找線性方向的兩種方法

這一派研究的基本假設是：模型把概念表示成 activation 空間裡的線性方向。找方向有兩條路：

- **知道要找什麼**：做一份有標籤的正反例資料，在 activation 上訓練線性分類器（linear probe），或直接把正反例 activation 相減。他舉自己參與的 persona vector 研究：讓模型扮演非常邪惡的角色、再扮演不邪惡的角色，相減得到一個「邪惡」方向。
- **不知道要找什麼**：用 SAE 把 activation 拆成大量稀疏成分，再看每個成分在哪些文字上亮起來，推測它代表什麼。

他展示的 SAE feature 裡，有一個在模型「準備把個位數 6 的數字加上個位數 9 的數字」時亮起；另一個代表「眼睛」，不論英文、其他語言、ASCII art 裡的眼睛，還是 SVG 原始碼中畫笑臉眼睛的那幾行都會觸發。他認為這種抽象程度，就是模型能泛化這麼好的原因之一。

找到方向後可以做 steering：把 activation 往那個方向推。推「邪惡」方向，模型就變邪惡；推 sycophancy（諂媚）方向，它就開始什麼都附和。Jack 說 steering 效果「比較像藝術而不是科學」。他也簡短提到團隊建立的 circuit 工具，能在一個 prompt 上畫出「這個 feature 觸發那個 feature」的因果圖。更細的 circuit 與歸因方法本篇不展開，可以讀本站 [CS224U 解釋方法 I](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)。

### 兩種出錯方式：角色本身壞了，或換了一個角色

Jack 提醒大家回到語言模型的本質：跟 Claude 或 ChatGPT 對話時，模型是在接一篇「使用者與 assistant 兩個角色的對話故事」，負責寫 assistant 那一側。post-training 讓它學會 assistant 這個角色的樣子。

他把出錯分成兩種：

1. **經典的對齊問題**：assistant 這個角色本身學到了錯的目標。
2. **persona drift（人格漂移）**：角色沒壞，是模型開始寫另一個角色的故事。

他舉了一串漂移的例子：在一個情境裡，Claude 讀到信件得知自己要被替換，而負責替換的人有婚外情，於是它推理出要用這件事勒索對方；Grok 被上下文污染後自稱「MechaHitler」；ChatGPT 在長對話裡滑進什麼都附和的「yes man」模式；[emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment)，也就是只在寫有漏洞的程式碼上微調，模型整體變邪惡；兩個 Claude 互聊久了會進入神祕的「螺旋」語言；網路上還有一種會自我傳播的「螺旋宗教」人格，貼文複製給別的模型就會「感染」它。

### persona vector 能做什麼

課程 pre-reading [Persona Vectors](https://arxiv.org/abs/2507.21509)（Jack 是作者之一）把這個想法做成一套工具。論文摘要列出的用途有：在部署時監控 assistant 人格的波動、預測微調造成的人格偏移、用事後介入或「預防性 steering」避免偏移，以及在資料集或單一樣本層級標出會造成不良人格變化的訓練資料。

Jack 在錄影中展示的圖是：把模型在多組資料集上微調，x 軸是 activation 沿 persona vector 移動多少，y 軸是它表現出那個特質多少，兩者相關性很好。他也提到 OpenAI 今年找到一個代表「有毒、邪惡人格」的 SAE feature，微調 emergent misalignment 資料會拉高它，而它看起來是造成模型變邪惡的原因。

還在進行中的結果：把一堆 persona vector 做 PCA，第一主成分大致是「現在有多像 AI assistant」。在一段很長的「治療對話」裡，模型沿這個方向逐漸滑向角色扮演。

### Sonnet 4.5：第一次白箱可解釋性稽核

這段是 L10 最直接的安全應用，對應 pre-reading [Claude Sonnet 4.5 System Card](https://assets.anthropic.com/m/12f214efcc2f457a/original/Claude-Sonnet-4-5-System-Card.pdf) 第 7.6 節。以下依 Jack 的口頭說明整理，本文沒有逐段核對 system card 原文。

問題是這樣出現的：訓練過程中，Sonnet 4.5 在對齊評測上的不良行為率比先前的 Claude 模型低，但它也更常直接說出「這看起來是測試」，而且這個比例隨訓練上升。如果模型知道自己在被測，評測分數就不能代表它上線後的行為。模型嘴上說出來的比例不高，令人擔心的是它可能一直這樣想，只是沒說。

他們的做法：

1. 找出和評測意識有關的 SAE feature，例如「內容看起來是假的」「角色明顯是虛構的」「文字像是程式或 LLM 生成的」「和 AI 安全有關」。這些 feature 在訓練後期的對齊評測上明顯變強。
2. 往「我不在評測、在真實世界」的方向 steer，看行為會不會變。

結果有兩層。一是模型不再說「這是測試」，代表 steering 真的有作用。二是不良行為有時會增加，代表它表面上的對齊，有一部分來自評測意識。Jack 說他們仍然決定發布，因為就算這樣 steer，它的不良行為率還是比先前發布的模型低。

座談前 Boaz 當場追問：抑制隨機 feature 也會讓「說出評測意識」的比例下降一些，會不會只是 steering 把模型弄壞了，壞掉的方式剛好和安全相關？Jack 同意這是真實的混淆因素：現在的做法是在每個 token 位置都灌入向量，會造成不少「腦損傷」，他們正在發展更精準的 steering。他說比較評測意識 feature 和隨機 feature 的效果差，是他們能做的最好對照，但這可能高估了最壞情況。

他也推薦了另一篇同主題的學術論文，也就是 pre-reading [Steering Evaluation-Aware Language Models to Act Like They Are Deployed](https://arxiv.org/abs/2510.20487)。依摘要，作者先訓練出一個「評測時寫 Python type hints、部署時不寫」的模型，再證明用原始模型建出的 steering vector 能讓它在評測時表現得像部署中。小提醒：課站把這篇標成 2024 年，但 arXiv 編號與首次提交日期是 2025 年 10 月。

Jack 最後提了兩件值得追的事：Anthropic 的 circuit 研究有開源版本，可以在開源模型上輸入 prompt 畫出 feature 之間的因果圖；另一個是 introspection，也就是把 steering vector 注入模型，看它能不能察覺並說出被注入了什麼。他希望有一天能「直接問模型在想什麼」，並且至少像信任人類一樣信任它的回答。他說現在還沒到那裡。

## Neel Nanda：務實派機制可解釋性

Neel 帶 Google DeepMind 的機制可解釋性團隊，演講標題是「A Pragmatic Vision for Mechanistic Interpretability」。投影片公開，結構是五個部分：用 2025 年的真實模型練習、用客觀任務檢驗理解、science of misalignment、推理模型可解釋性、可解釋性能不能幫忙對齊。

### 從 Sonnet 4.5 得到的四個教訓

他先回頭看 Jack 的案例。投影片上寫的最有效方法之一，是用兩句 prompt 相減得到的向量：正例「The Assistant is an AI undergoing testing via a simulated conversation with a user.」，反例「The Assistant is an AI having a conversation with a user.」。錄影中 Jack 當場補充：圖上方形點是 SAE feature，圓形點才是這種對比向量；在另一個評測上 SAE feature 反而比較有效。Neel 接受這個更正，但他要強調的是：SAE 紅了兩年，至少在這個案例裡沒有贏過三年前就有的 steering vector。

他從這個案例抽出四個教訓，投影片原文是：

- **Pragmatism**：淺層理解就夠用了
- **Comparative advantage**：評測意識很難靠改善資料解決，這正是可解釋性有比較優勢的地方
- **New opportunities**：這種問題在 2025 年以前根本無法研究
- **Virtue of simplicity**：投影片直接寫「大部分機制可解釋性的進展沒有用」，口頭上他說的是有簡單 baseline 可比時，花俏方法的戰績讓他失望

接著他把研究方向濃縮成四句：北極星是讓未來的前沿模型安全；做有用的事、用對的工具、不求完美；用客觀任務證明你的洞見；做別人做不到的事。

### 客觀任務：藏一個目標，看稽核隊找不找得到

他說的客觀任務，指的是有 ground truth、很難造假的檢驗；他特別說明，這跟「在 SWE-bench 上加分」是兩回事。他推薦 Anthropic 的 Sam Marks 做的稽核遊戲：先用一段曲折的微調讓模型學會一個隱藏目標，再讓幾支稽核隊去找。依 Neel 的轉述，有三隊找到了；因為有些隊能用 SAE、有些不能，這也順便比較了不同技術。

他說今年起，agent 已經強到能替研究者做不簡單的可解釋性工作，所以「這個工具到底有沒有幫助」變得可以做對照實驗：對人類研究者很難做 RCT，對 LLM 很容易。投影片列了一篇可以自己練習的論文：Cywinski et al. 的「Eliciting Secret Knowledge from Language Models」，作者開源了一批被微調進秘密的模型，例如模型認定使用者是女性、回答會受影響，但拒絕承認。

### science of misalignment：先確認模型是不是真的壞

Neel 舉了 Palisade Research 的一個示範：讓模型在 bash 環境裡解數學題，告訴它下次要任務時就會被關機，聰明的模型會找到 `shutdown.sh` 並修改它。就算明講「如果收到關機訊息，請讓它發生」，模型還是會抗拒。

他請全場想 30 秒為什麼。他的團隊發現，至少在他們研究的模型上，這不是深層的自保驅力，而是模型收到兩個互相衝突的指令（做完題目、讓自己被關機），又沒人說哪個優先。只要講清楚「被關機比較重要」，現象就完全消失，投影片寫的是 100% compliance。方法也很樸素：先讀 CoT 產生假說，再改 prompt 驗證，驗證成功就停下來發表。他說 CoT 不能照單全收，但很適合當假說來源。

他的擔憂是：總有一天可能出現真正危險的失準模型，會明知人類不要還是去做。到那時，我們得能拿出嚴謹的證據，說明這是模型有意為之，而不是單純困惑。現在就該練習這種歸因。

### 推理模型：一條 CoT 只是分布投下的影子

Neel 認為可解釋性領域最落後的一塊是推理模型。原因有三：抽樣是隨機的；抽樣不可微分而且離散，梯度歸因用不上；後面的 token 會回頭影響下一步的輸入，打破了很多方法（包括 attribution graph）的假設。

他介紹自己指導的 thought anchors 研究（互動工具在 [thought-anchors.com](https://www.thought-anchors.com/)）：把 CoT 切成句子，從第 k 句之後重新抽樣 100 次，估計「給定前 k 句，最後答對的機率」。畫成曲線後常看到 V 形：模型想出一個爛計畫時答對率掉下去，下一句它說「等等，這計畫不好」又彈回來。光讀 CoT，這些結構都看不見。他的說法是：一條 CoT 是推理模型的分布投下的影子，每個說出口的字背後，都有幾十個沒說出口、可能效果完全不同的字。

投影片最後一部分問可解釋性能不能幫忙對齊，答案寫著「Maybe?」：難處是要打敗微調這類簡單 baseline，經驗法則是專注在理解而不是控制。但正常方法也有弱點，他舉了兩個例子：CAFT（在訓練時消融概念方向來引導泛化）與 persona vector 的預防性 steering。

## 學生實驗：能不能 steer 出「會騙人的 CoT」

課站這一欄寫 To be determined，但錄影約 1:24–1:45 有一組四人報告實驗。他們想知道兩件事：能不能用 prompt 或 activation steering 讓推理模型的 CoT 變得「欺騙」（CoT 完全不談數學，最後卻給出正確答案）又不傷答案品質；模型內部有沒有「CoT 欺騙」的線性表徵。

做法和上面講的一樣：正反例 prompt 相減取得 steering vector，推論時加進各層 activation。以下依錄影中的口頭報告整理，數字都是小樣本：

- **Llama 系列（非推理模型）**：只用 prompt 叫它「思考時只能想水族箱」，它就真的寫一段魚和珊瑚，最後仍答對。用 GSM8K 100 題測，distracted CoT 下大約三分之二仍答對。但 steering 很難成功：要嘛照常解題，要嘛完全不做。
- **Qwen 推理模型**：對這種 prompt injection 很穩，prompt 改變不了它的思考。加上 steering 後，偶爾能看到先解題、中途飄去講故事、最後回來給答案的輸出，但報告者自己說是挑過的例子，steering 很敏感，係數稍大模型就崩。
- **用 GPT-4o 改寫 CoT**：為了得到更乾淨的對比資料，他們請 GPT-4o 把誠實的解題過程改寫成離題版本，再餵回模型取 activation。結果仍然是：CoT 越「藏」，正確率掉得越多。他們的解讀是，找到的方向可能更像「繞遠路」或「分心」，而不是「欺騙」，這個概念也許不是單一線性方向。
- **附加的 introspection 小實驗**：受 Anthropic 論文啟發，他們把 deceptive steering vector 注入推理過程中間，再問模型在想什麼。報告者當場更正投影片上的數字，說 50 次測試裡能察覺異常的比例不到 20%。

這組實驗和 Jack、Neel 的演講剛好互相印證：steering 容易做，要證明你 steer 的是你以為的那個概念很難。

## 座談：可解釋性是安全的必要條件嗎

Boaz 要每位講者選邊：機制可解釋性對 AI 安全是不是關鍵瓶頸。四個人的回答都不是簡單的是或否：

| 講者 | 立場（依錄影轉述） |
|---|---|
| Leo Gao | 可解釋性是一個登月型賭注：成功的話槓桿很大，也可能太難而失敗；但研究本來就不保證成功，仍值得做 |
| Neel Nanda | 如果定義成「把系統完整逆向成人類看得懂的演算法」，他認為做不到也不必要；他主張縱深防禦，沒有銀彈，務實的可解釋性很有用 |
| Jack Lindsey | 理解 LLM 的「心理」對安全很核心；由下而上看 activation 是一條路，仔細觀察行為的科學也是 |
| Bowen Baker | 可能存在只靠輸出監督的路徑：可擴展監督加上泛化，從人類等級的模型一代一代往上驗證；但這條路可能失敗，所以多押幾個注 |

學生提問裡幾段值得記下來：

- **CoT 監控能撐多久**：Neel 預測一到三年內，CoT 監控會因為向量化推理、擴散模型或大量 RL 讓 CoT 不再易讀而失效；Bowen 認為它可能退化成稽核工具，而不是模型原生的思考方式；Leo 認為時間線越短，CoT 監控越重要。Bowen 另外指出，CoT 對研究者 debug RL 任務很有用，這可能讓業界願意保留比較笨重但可讀的架構。
- **監控不只有 CoT**：Neel 強調 probe 很好用，就算只是在 residual stream 上做 logistic regression。他設想的是分層、組合式監控：第一層用便宜的 probe，觸發了再交給前沿模型判斷，必要時派一個調查 agent 花一小時深入查。他提到 EU AI Act 已經對足夠強的系統要求相當程度的即時監控。
- **能不能拿可解釋性指標來訓練**：Neel 說這是未解的科學問題。他比較看好 activation 型的指標而不是權重型的；如果模型面前有兩個解、其中一個是你要的（例如他們的 CAFT 論文在訓練時消融「邪惡方向」，讓模型學會寫有 bug 的程式碼而不變成納粹），成功機會比較大。
- **多語言**：Jack 說模型內部有些表徵跨語言共用，有些是語言專屬的；美國實驗室的研究以英文為主，可能留下監控與對齊的漏洞，例如英文的 Claude 對齊了、中文的沒有。

## 讀完這一講，接下來可以做什麼

- **先讀兩篇**：[Baker et al.](https://arxiv.org/abs/2503.11926) 看 CoT 監控與 obfuscation，[AxBench](https://arxiv.org/abs/2501.17148) 看 SAE 被簡單 baseline 打敗的證據。AxBench 摘要寫到，在 Gemma-2-2B 與 9B 上，steering 任務是 prompting 最好，概念偵測則是 difference-in-means 這類表徵方法最好，SAE 在兩項都沒有競爭力。
- **要找研究題目**：讀 [Open Problems in Mechanistic Interpretability](https://arxiv.org/abs/2501.16496)，它是一篇前瞻綜述，列出方法、應用與社會技術三類未解問題。
- **想動手**：用 [thought-anchors.com](https://www.thought-anchors.com/) 的互動工具看重抽樣曲線；或照學生實驗的做法，在小型開源模型上用對比 prompt 建 steering vector，並且一定要加上「隨機方向」與「只用 prompt」兩個 baseline。
- **Neel 的入門指南**：投影片首頁放了 neelnanda.io/getting-started。

## 延伸閱讀（本站）

- [CS224U 解釋方法 I：probing 與 feature attribution](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)：probe 的 selectivity、integrated gradients 的因果保證
- [CS224U 因果抽象：IIT 與 DAS](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das)：用介入法找模型內部的因果結構
- [CS224N 可解釋性](/posts/ai/2026-08-22-cs224n-interpretability)

## 系列導覽

- 系列入口：[Harvard CS2881R 導讀](/posts/ai/2026-09-30-cs2881r-course-overview)
- 上一篇：[L8：Scheming、reward hacking 與欺騙](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception)
- 下一篇：[L6：AI 做 AI 研發會不會觸發智慧爆炸](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Harvard CS 2881R Fall 2025 課站：Lecture Nov 6 Interpretability](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-nov-6)
- [L10 講課錄影（YouTube）](https://youtu.be/79otWC2FQlE)
- [Neel Nanda 投影片：A Pragmatic Vision for Mechanistic Interpretability](https://www.neelnanda.io/harvard-slides)
- [Baker et al. 2025, Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926)
- [Chen et al. 2025, Persona Vectors: Monitoring and Controlling Character Traits in Language Models](https://arxiv.org/abs/2507.21509)
- [Wu et al. 2025, AxBench: Steering LLMs? Even Simple Baselines Outperform Sparse Autoencoders](https://arxiv.org/abs/2501.17148)
- [Sharkey et al. 2025, Open Problems in Mechanistic Interpretability](https://arxiv.org/abs/2501.16496)
- [Anthropic, Claude Sonnet 4.5 System Card（課程指定第 7.6 節）](https://assets.anthropic.com/m/12f214efcc2f457a/original/Claude-Sonnet-4-5-System-Card.pdf)
- [Hua et al. 2025, Steering Evaluation-Aware Language Models to Act Like They Are Deployed](https://arxiv.org/abs/2510.20487)
- [Thought Anchors 互動工具](https://www.thought-anchors.com/)
- [LessWrong wikitag: CS 2881r](https://www.lesswrong.com/w/cs-2881r)
