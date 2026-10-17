---
title: "建立固定點：冗餘、不延伸，以及墜落時固定點受多大的力"
date: 2026-10-17
category: climbing
tags: [climbing, trad-climbing, multi-pitch, outdoor-climbing, taiwan]
lang: zh-TW
type: guide
series:
  name: "運動攀登與傳統攀登"
  order: 8
description: "頂端沒有 bolt 時，怎麼用岩楔和機械塞組出能掛兩個人的固定點：SERENE／ERNEST 口訣在檢查什麼、Petzl 真人實測的墜落受力、Quad 與 cordelette 的取捨，以及 2019 年龍洞 #313 通道固定點整組脫出的事故。"
tldr: "固定點要過三關：每個點夠強、任一點失效還有別的點接住（冗餘）、失效時不會猛然下墜衝擊剩下的點（不延伸）。Petzl 用 80 公斤真人實測，墜落係數 1 時攀登者約受 4 kN、確保者約 2 kN、頂端保護點約 6 kN。Quad 能跟著拉力方向調整，但一點失效會衝擊另一點。2019 年龍洞 #313 的三點傳攀固定點，在兩人把體重交給它時全數脫出。"
draft: false
glossary:
  - term: "固定點"
    aliases: ["anchor", "確保站", "belay station"]
    definition: "把幾個保護點連在一起、讓攀登者能掛上去確保或休息的地方。單繩距在頂端，多繩距在每一段的終點。"
    context: "本文講的是頂端沒有 bolt、要用岩楔與機械塞自己組的固定點。"
  - term: "主點"
    aliases: ["master point", "均分點"]
    definition: "固定點上所有保護點的力匯集的那一個環或結，確保器、繩子和自我確保都掛在這裡。"
    context: "用 cordelette 時，主點通常是一個繩耳八字結。"
  - term: "墜落係數"
    aliases: ["fall factor"]
    definition: "墜落距離除以確保者到攀登者之間的繩長。數字越大，繩子能吸收能量的長度相對越短，墜落越嚴重。攀岩中介於 0 到 2。"
    context: "本文用 Petzl 的定義與實測數據。"
  - term: "延伸"
    aliases: ["extension", "shock load", "衝擊負載"]
    definition: "固定點裡某一點失效後，主點往下掉一段才被其他點接住。掉的那一段會讓剩下的點受到突然的衝擊。"
    context: "SERENE 和 ERNEST 裡的 No Extension，就是要避免這件事。"
  - term: "Quad"
    aliases: ["四股均分"]
    definition: "把一條長扁帶或輔助繩對折成四股，兩端各打一個結，主鉤環扣進兩個結之間其中兩股。拉力方向改變時，兩個點仍能分攤。"
    context: "Petzl 把它列為有 bolt 的多繩距常用確保站之一。"
---

> 🌏 [English version](/posts/climbing/2026-10-17-building-anchors-en)

2019 年 5 月 16 日，龍洞大禮堂的 #313 通道。依[臺灣戶外攀岩協會（TOCC）的龍洞大事紀](https://www.tocc-climbing.org/chronicle-of-events)，三人繩隊的先鋒完攀後，用傳攀器材架了一個固定點，把跟攀者確保上來。跟攀者到了確保站，兩人把體重轉移到固定點上的那一刻，三個保護點因不明原因全數脫出。兩人墜落約 20 公尺撞擊地面，其中一人留下永久性傷害。TOCC 記為龍洞第一起多傷患的重大意外。

固定點是整條繩隊最後的依靠。先鋒墜落時，力會傳到這裡；確保跟攀者時，兩個人都掛在這裡。前一篇[〈傳攀保護〉](/posts/climbing/2026-10-17-trad-protection-nuts-cams)講了怎麼放好一顆保護，這篇講怎麼把幾顆組成固定點，以及它到底要撐多大的力。

讀完後，你應該能檢查別人架好的固定點：是不是冗餘、會不會延伸。

先講清楚：**這篇不能取代實際上課。** 固定點要在有經驗的人面前一次一次架、被拆解、被指出問題，才學得會。

## 直覺：固定點要過三關

把一個固定點想成一張由幾根繩子吊著的吊床。你會問三件事：

1. **每一根繩子綁的地方夠牢嗎？**（每個點夠強）
2. **斷了一根，其他根接得住嗎？**（冗餘）
3. **斷了一根的時候，吊床會不會先往下掉一段，再猛然被其他根拉住？**（不延伸）

攀岩圈把這些整理成口訣。[American Alpine Institute 的說明](https://alpineinstitute.com/serene-and-ernest-anchors)列了最常用的兩個，SERENE 和 ERNEST，並說兩者「基本上相同」，有些學校教這個、有些教那個：

| 字母 | 意思 | 在檢查什麼 |
|---|---|---|
| S（Solid） | 堅固 | 每個點單獨都要夠強 |
| R（Redundant） | 冗餘 | 不只一個點，任一點失效還有別的接住 |
| E（Equalized） | 均分 | 每個點分攤負重 |
| N.E.（No Extension） | 不延伸 | 一點失效時，不會讓剩下的點受到突然衝擊 |
| T／E（Timely／Efficient） | 及時、有效率 | 能在合理時間內架好 |

台灣的傳攀課也用這些口訣：[艾格探險的單繩距傳攀課](https://www.adventuretaiwan.com/product/single-pitch-trad-climbing/)教 E.A.R.N.E.S.T.，[百合搖滾的傳攀課](https://www.wildlily.rocks/full-course)教 SERENE。口訣只是檢查清單，下面一條一條看它們背後的道理。

### 冗餘：幾個點才夠

[Petzl 的確保站教學](https://petzl.com/us/en/sport/tech-tips/basic-techniques/building-a-belay-anchor-and-belaying-on-a-bolted-multi-pitch-route/Relais-grande-voie_SPO_a77Tx000000E3MEIA0.html)的下限是：至少兩個互相連結的固定點，防止其中一個失效。這是針對有 bolt 的多繩距；Petzl 自己說明，用岩楔和機械塞的傳統路線，部分概念不一定適用。

用傳攀器材時，數字往上加。AMGA 認證攀岩嚮導 [Elaina Arenz 的教學](https://www.climbing.com/skills/gym-to-crag-trad-climbing-outdoor-research/)要求傳攀固定點至少三個點。檢查方法很好記：想像有人拿一把魔法剪刀剪斷任何一處，整個固定點都不能散掉。

### 均分：做不到完全平均

均分聽起來是讓每個點各分一樣的力。實際上很難。[Karsten Delap 在〈Strong Anchors〉](https://www.karstendelap.com/blog/strong-anchors)寫到，連在實驗室都很難做到真正平均。所以業界的用語正從「均分」轉向「力量分配」，也就是把較多的力導到你判斷比較牢的點。

Delap 也認為「強」是最重要的屬性，過度追求冗餘會讓你多帶器材、架得更慢。但他對初學者的建議仍是**至少放三個點**，因為冗餘可以掩蓋你還看不出來的錯誤。

### 角度：兩腿張得越開，每個點受力越大

連到主點的兩條腿之間的夾角越小，每個點受的力越小。Petzl 的建議是 **90° 當上限**，好記也好判斷；Arenz 寫的是不超過 60–90°。

**今晚就能做的動作**：用一條扁帶和兩個鉤環，掛在家裡兩個門把（或椅背）上，打一個結當主點往下拉。把兩個點拉遠一點再拉一次，看兩條腿的角度怎麼變。

## 機制：固定點到底受多大的力

### 墜落係數：看比例，不看距離

[Petzl 對墜落係數的說明](https://petzl.com/us/en/sport/tech-tips/basic-techniques/fall-factor-and-impact-force---theory/CORDES-chute-theorie_SPO_a77w0000000KywUAAS.html)是這樣：墜落有多嚴重，要看掉的距離和放出去的繩長之間的比例。繩子越長，能吸收的能量越多。

同樣掉 4 公尺：繩子放出 10 公尺時，嚴重度低；只放出 2 公尺時，嚴重度高。

<details><summary>公式與兩個例子（Petzl）</summary>

理論墜落係數 ＝ 墜落距離 ÷ 繩長（確保者到攀登者之間的繩子）

- 繩長 10 m、墜落 4 m：4 ÷ 10 ＝ 0.4，嚴重度低。
- 繩長 2 m、墜落 4 m：4 ÷ 2 ＝ 2，嚴重度高。

攀岩中這個數字介於 0 到 2。實際上，繩子和岩壁、快扣之間有摩擦，只有一部分繩子真的在伸長吸收能量。Petzl 因此另外定義「實際墜落係數」＝ 墜落距離 ÷ 有效繩長。繩阻處理不好時，實際係數會比理論值高很多。

</details>

這解釋了一件反直覺的事：**多繩距剛離開確保站時的小墜落，比爬到一半時的大墜落更兇。** 繩子還很短，係數就高。Petzl 的確保站教學也指出，先鋒墜落是固定點受力最大的情況，剛起步時更大，因為繩短、係數高、快扣摩擦少。

### 真人實測：頂端保護點受力最大

規格上常看到的大數字，多半來自標準測試：金屬假人、固定點、嚴苛條件。Petzl 用 80 公斤的真人做了[一系列實地墜落](https://petzl.com/us/en/sport/tech-tips/product-information-and-specifications/forces-at-work-in-a-real-fall/CORDES-chute-efforts_SPO_a77w0000000KywPAAS.html)，確保者也是 80 公斤，用 GRIGRI 2 確保：

| 情境 | 墜落係數 | 攀登者 | 確保者 | 頂端保護點 |
|---|---|---|---|---|
| 一般單繩距墜落（繩長 6.9 m、掉 2 m） | 0.3 | 約 2.5 kN | 約 1.5 kN | 約 4 kN |
| 多繩距起步（繩長 3 m、掉 2 m） | 0.7 | 約 3 kN | 約 2 kN | 約 5 kN |
| 多繩距剛離開確保站（繩長 3.6 m、掉 3.6 m） | 1 | 約 4 kN | 約 2 kN | 約 6 kN |

Petzl 說明這些數字的誤差約 ±0.3 kN，只適用於測試的情境。但規律很清楚：**頂端那個保護點每次都受最大的力**，數字上剛好是攀登者和確保者兩邊相加。繩子在那裡轉向，Petzl 稱為滑輪效應。

對係數 1 的那組，Petzl 的註解是：6 kN 對牢靠的固定點不是問題，但如果那個點是一顆小號岩楔或一支爛岩釘，就很危險。回頭看上一篇的標準：岩楔的最低強度只要求 2 kN。

<details><summary>為什麼頂端保護點會受雙倍的力</summary>

繩子穿過頂端保護點後往下折，一邊連攀登者，一邊連確保者。墜落時兩邊的繩子都被拉緊，保護點同時被兩股力往下拉。Petzl 的確保站教學把這叫做「轉向點超載」，列為先鋒墜落的第一大風險：墜落係數高時，力可能超過不夠牢的點，尤其是轉向點。

</details>

**今晚就能做的動作**：下次在岩館看別人先鋒，找出他目前最上面那顆快扣。如果他現在掉下來，那顆快扣同時被攀登者和確保者兩邊拉。

## 回到實作：Quad、cordelette 和主點

架固定點的方法很多，這裡看兩種最常見的，重點是各自在一點失效時會發生什麼。

### Quad：跟著方向調整，但會延伸

Petzl 把 Quad 列為有 bolt 的多繩距常用確保站之一，優缺點寫得很具體：

- **優點**：拉力方向改變時，兩個點仍能分攤；主點可以拆成兩個獨立的環，掛多個鉤環比較方便。
- **缺點**：一個點失效時，均分點會滑到繩環末端，對另一個點產生衝擊。兩個結之間距離越大，可以左右移動的範圍越大，失效時的衝擊力也越大。
- **操作要點**：主鉤環要扣進兩個結之間四股中的兩股。

### Cordelette：用一個結鎖住主點

Arenz 教的傳攀固定點，是用一條 cordelette（長的輔助繩環）或雙倍長扁帶：

1. 扣進三個點。
2. 用食指把三個點之間的繩子拉出三個環，左右撥動，讓每一條腿都分到力。
3. 打一個繩耳八字結做主點。這個結也讓連接材料有冗餘，並在任一點失效時限制延伸。
4. 像撥吉他弦一樣撥每一條腿。每條都要繃緊；有一條鬆，就代表分攤不均，要重打主點的結。

Petzl 對「單向均分」確保站的描述可以拿來對照：一點失效時沒有衝擊負載，但側向拉力時分攤差。我的理解是，用結把主點固定住的做法，都在 Quad 的反面做取捨：延伸少，換來的是拉力方向一變，分攤就跟著變差。

### 打結會不會讓扁帶變弱

會，但通常還夠。[Black Diamond 的 QC Lab](https://blackdiamondequipment.com/blogs/stories/qc-lab-sling-strength-in-3-anchor-configurations) 用同一條 48 吋扁帶測了三種接法：

- Sliding X：拉力機拉不斷。
- 加結的 Sliding X、八字結：都超過 20 kN 才斷，斷點都在結上。打結讓強度下降 40–60%。

讀這份數據要注意兩件事。第一，BD 每種接法只測了一個樣本。第二，BD 明說這只比較強度，**不評論延伸、衝擊負載或均分得多平均**。所以它能告訴你打結的扁帶夠強，不能告訴你哪一種固定點比較安全。

American Alpine Institute 另外提醒：自動均分的 Sliding X（也叫 Magic X）一定要加限位結，否則一點失效時會延伸。Petzl 的版本也一樣，要在其中一股扭一圈，失效時才兜得住鉤環。

**今晚就能做的動作**：用一條 180 公分扁帶（Petzl 做 Quad 用的長度），在兩個門把之間分別做一次 Quad 和一次 Sliding X。做完後拔掉其中一邊，看主點往下掉了多遠。

## 檢查別人架好的固定點

跟攀到確保站，或在岩場看到別人的固定點，用這個順序檢查：

1. **每個點都是好放置嗎？** 用上一篇的三個條件：岩石、尺寸、方向。固定點的強度從單點開始。
2. **有幾個獨立的點？** 傳攀固定點至少三個。想像剪斷任一處，剩下的還接得住嗎？
3. **一點失效時，主點會掉多遠？** 找出結的位置。Quad 兩個結之間、Sliding X 有沒有限位結，決定了延伸的長度。
4. **兩腿的夾角多大？** 超過 90° 就要調整。
5. **拉力方向會變嗎？** 確保跟攀者、先鋒離開確保站後墜落，拉力方向可能不一樣。Petzl 把「方向改變時仍能分攤」列為 Quad 的主要優點，就是在處理這件事。

再回到 #313。依 Petzl 的說法，人只是掛在固定點上時，加上的是體重的靜態力，這不會讓可靠的固定點失效。#313 的固定點卻正是在兩人把體重交給它的時候全數脫出，原因至今不明。我們不知道是哪一個環節出錯，但能確定一件事：**把體重交給固定點之前，是最後一次檢查的機會。** 跟攀者抵達、還沒把體重交出去之前，兩人都該看一次固定點。

## 往深處學

這篇只講到單繩距頂端的固定點。多繩距的確保站還要考慮先鋒剛離開確保站時的墜落、確保者被拉向岩壁、換段時誰掛在哪裡，這些會在下一篇[〈多繩距入門〉](/posts/climbing/2026-10-17-multi-pitch-basics)講。

想上課的話，艾格的單繩距傳攀課是兩天 14 小時，教 E.A.R.N.E.S.T. 和事先均力、自我均力兩種系統。百合搖滾的完整課程包含 SERENE 確保站示範和墜落衝擊力試算。課程比較與學習順序，會在[〈學習路徑與常見事故〉](/posts/climbing/2026-10-17-sport-to-trad-learning-path)整理。

## 練習題：四個情境

答案在每題下方，先自己想再看。想練更多題，可以玩 [nobodyclimb 的繩索系統練習：傳攀固定點](https://nobodyclimb.cc/games/rope-system/learn/trad-anchor)。

**1. 你跟攀到確保站，看到先鋒用兩顆 cam 架了固定點，cam 都放得很好。可以直接掛上去嗎？**

<details><summary>答案</summary>

先跟先鋒討論。Petzl 的下限兩個點是針對有 bolt 的確保站；傳攀固定點，Arenz 的要求和 Delap 給初學者的建議都是至少三個點。在你還判斷不出「這兩顆夠強」之前，多放一顆是用冗餘掩護你看不出來的錯誤。

</details>

**2. 一個 Quad 的兩個結打得很開，主點可以左右滑很大的範圍。這樣有什麼代價？**

<details><summary>答案</summary>

Petzl 的說法是：兩個結之間距離越大，可以側移的範圍越大，但一個點失效時，主點掉得越遠，對另一個點的衝擊力也越大。

</details>

**3. 多繩距的先鋒剛離開確保站 2 公尺就墜落，確保者放出的繩子不到 3 公尺。這次墜落嚴不嚴重？**

<details><summary>答案</summary>

嚴重。墜落係數看的是墜落距離和繩長的比例，不是掉了幾公尺。繩短、係數高，Petzl 的確保站教學也把這種情況列為固定點受力最大的時候。Petzl 的建議是：離開確保站後的第一個保護點一定要牢靠。

</details>

**4. 你用 cordelette 架好固定點，撥一撥三條腿，發現有一條是鬆的。**

<details><summary>答案</summary>

代表那一條沒分到力，固定點實際上只靠另外兩個點。Arenz 的做法是重打主點的繩耳八字結，讓三條腿都繃緊。

</details>

## 參考資料

- [台灣岩友聯盟（TOCC）大事紀：2019-05-16 #313 通道事故](https://www.tocc-climbing.org/chronicle-of-events)
- [建立確保站固定點（含 Quad）：Building a belay anchor and belaying on a bolted multi-pitch route（Petzl）](https://petzl.com/us/en/sport/tech-tips/basic-techniques/building-a-belay-anchor-and-belaying-on-a-bolted-multi-pitch-route/Relais-grande-voie_SPO_a77Tx000000E3MEIA0.html)
- [墜落係數與衝擊力：Fall factor and impact force – theory（Petzl）](https://petzl.com/us/en/sport/tech-tips/basic-techniques/fall-factor-and-impact-force---theory/CORDES-chute-theorie_SPO_a77w0000000KywUAAS.html)
- [Forces at work in a real fall（Petzl）](https://petzl.com/us/en/sport/tech-tips/product-information-and-specifications/forces-at-work-in-a-real-fall/CORDES-chute-efforts_SPO_a77w0000000KywPAAS.html)
- [固定點口訣：SERENE and ERNEST Anchors（American Alpine Institute）](https://alpineinstitute.com/serene-and-ernest-anchors)
- [Gym to Crag: Trad Climbing（Elaina Arenz，Climbing，2019）](https://www.climbing.com/skills/gym-to-crag-trad-climbing-outdoor-research/)
- [Strong Anchors（Karsten Delap，2020）](https://www.karstendelap.com/blog/strong-anchors)
- [QC Lab: Sling Strength in 3 Anchor Configurations（Black Diamond）](https://blackdiamondequipment.com/blogs/stories/qc-lab-sling-strength-in-3-anchor-configurations)
- [艾格探險：單繩距傳統攀登](https://www.adventuretaiwan.com/product/single-pitch-trad-climbing/)
- [百合搖滾：單繩距傳統攀登完整課程](https://www.wildlily.rocks/full-course)
- [nobodyclimb 繩索系統練習：傳攀固定點](https://nobodyclimb.cc/games/rope-system/learn/trad-anchor)
- [傳攀保護：岩楔與機械塞](/posts/climbing/2026-10-17-trad-protection-nuts-cams)
- [多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)
- [學習路徑與常見事故](/posts/climbing/2026-10-17-sport-to-trad-learning-path)
