---
title: "建立固定點：冗餘、不延伸，以及墜落時固定點受多大的力"
date: 2026-10-17
category: climbing
tags: [climbing, trad-climbing, multi-pitch, outdoor-climbing, taiwan]
lang: zh-TW
type: guide
series:
  name: "運動攀登與傳統攀登"
  order: 11
description: "頂端沒有 bolt 時，怎麼用岩楔和活動岩楔組出能掛兩個人的固定點：SERENE／ERNEST 口訣在檢查什麼、Petzl 真人實測的墜落受力、Quad 與 cordelette 的取捨，以及 2019 年龍洞 #313 通道固定點整組脫出的事故。"
tldr: "固定點要過三關：每個點夠強、任一點失效還有別的點接住（冗餘）、失效時不會猛然下墜衝擊剩下的點（不延伸）。Petzl 用 80 公斤真人實測，墜落係數 1 時攀登者約受 4 kN、確保者約 2 kN、頂端保護點約 6 kN。Quad 能跟著拉力方向調整，但一點失效會衝擊另一點。2019 年龍洞 #313 的三點傳攀固定點，在兩人把體重交給它時全數脫出。"
draft: false
glossary:
  - term: "固定點"
    aliases: ["anchor", "確保站", "belay station"]
    definition: "把幾個保護點連在一起、讓攀登者能掛上去確保或休息的地方。單繩距在頂端，多繩距在每一段的終點。"
    context: "本文講的是頂端沒有 bolt、要用岩楔與活動岩楔自己組的固定點。"
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

[Petzl 的確保站教學](https://petzl.com/us/en/sport/tech-tips/basic-techniques/building-a-belay-anchor-and-belaying-on-a-bolted-multi-pitch-route/Relais-grande-voie_SPO_a77Tx000000E3MEIA0.html)的下限是：至少兩個互相連結的固定點，防止其中一個失效。這是針對有 bolt 的多繩距；Petzl 自己說明，用岩楔和活動岩楔的傳統路線，部分概念不一定適用。

用傳攀器材時，數字往上加。AMGA 認證攀岩嚮導 [Elaina Arenz 的教學](https://www.climbing.com/skills/gym-to-crag-trad-climbing-outdoor-research/)要求傳攀固定點至少三個點。檢查方法很好記：想像有人拿一把魔法剪刀剪斷任何一處，整個固定點都不能散掉。

HowNOT2 把魔法剪刀真的做了一次。從 11:40 開始，他們在 Dyneema 扁帶受力時拿刀割斷其中一條腿，模擬岩角磨斷或一個點失效：用繫帶結（girth hitch）或雙套結做的主點，結會一路滑脫，繫帶結那組大約 4 kN 就滑掉。這是後院的慢拉測試、每種只做一兩次，Ryan 自己也說是娛樂不是科學；它示範的是主點本身也要過剪刀檢查，不是在回答要放幾個點。

```youtube
url: https://www.youtube.com/watch?v=-MmX8h4F0po
title: Are climbing master points made with a girth hitch or clove hitch REDUNDANT???（HowNOT2）
start: 700
```

### 均分：做不到完全平均

均分聽起來是讓每個點各分一樣的力。實際上很難。[Karsten Delap 在〈Strong Anchors〉](https://www.karstendelap.com/blog/strong-anchors)寫到，連在實驗室都很難做到真正平均。所以業界的用語正從「均分」轉向「力量分配」，也就是把較多的力導到你判斷比較牢的點。

Delap 也認為「強」是最重要的屬性，過度追求冗餘會讓你多帶器材、架得更慢。但他對初學者的建議仍是**至少放三個點**，因為冗餘可以掩蓋你還看不出來的錯誤。

### 角度：兩腿張得越開，每個點受力越大

連到主點的兩條腿之間的夾角越小，每個點受的力越小。Petzl 的建議是 **90° 當上限**，好記也好判斷；Arenz 寫的是不超過 60–90°。

HowNOT2 的〈American Death Triangle is a Myth〉從 7:23 的第三組測試看起：教練 Bobby 先說他教學時要學生守住 Petzl 那個上限，接著把兩腿張得遠超過它，每顆 bolt 受的力變成主點的約 1.5 倍。這是兩個人用手拉、角度用量角器估，力量只有幾 kN。標題的「迷思」是指受力沒有他原本想得那麼誇張，Ryan 在片中同樣說這種架法不冗餘，不建議照做。

```youtube
url: https://www.youtube.com/watch?v=7sQNpjnJe40
title: American Death Triangle is a Myth（HowNOT2）
start: 443
```

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

Hard Is Easy 從另一個角度講同一件事。影片從 11:22 開始比較兩種墜落：一次很長的大墜落，和一次離 bolt 很近、確保者又拉得很硬的小墜落。作者用繩子伸長的比例手算減速距離，結論是大墜落對攀登者反而軟約 2.5 倍，跟「繩子越長越能吸收」的方向一致。但他在說明欄寫明刻意不談墜落係數，認為它在先鋒情境幾乎沒有意義，因為公式沒算到確保者接得軟還是硬。兩種說法可以並列：本文照 Petzl 用墜落係數比較繩長的影響，確保的軟硬是另一個要分開看的變數。這段是作者的估算，不是實測墜落。

```youtube
url: https://www.youtube.com/watch?v=WyExE2qH4Fs
title: Falling physics that Every Climber Needs to know（Hard Is Easy）
start: 682
```

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

HowNOT2 的〈Gym Climbing Forces〉從 1:40 開始，Ryan 在岩館用三顆 LineScale 3 測力計同時量攀登者、確保者和快扣。規律和 Petzl 一樣是快扣最大，他整理的岩館墜落資料裡，快扣多落在 3 kN 後段到 4 kN 中段。不同的是，他量到快扣常常比攀登者加確保者還大，他認為是繩子和快扣之間的摩擦。這是少數幾次岩館墜落、體重和 Petzl 的測試不同，LineScale 3 也是 Ryan 參與開發、自家店有賣的產品；數字以 Petzl 的表為準，影片的用處是看到頂端那顆快扣被兩邊拉的樣子。

```youtube
url: https://www.youtube.com/watch?v=fZIj5HAV8xA
title: Gym Climbing Forces - Climbing Science（HowNOT2）
start: 100
```

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

HowNOT2 也拉斷過打結的扁帶。從 6:20 開始，他們在窄版 Dyneema 扁帶中間打一個單結再拉，斷點都在結上，Ryan 算出強度少了超過 60%。降幅比 BD 的數字大，可能跟窄版 Dyneema 對結特別敏感有關，兩者不能直接比。片子後段拉了加限位結的 Sliding X，結被拉斷時整組會散開，不是完全冗餘。每種接法新舊各兩條、都是慢拉；同一支片裡用了好幾年的舊扁帶，直拉就比新的弱一截。

```youtube
url: https://www.youtube.com/watch?v=NwbMfh4FqT4
title: Mammut Dyneema Climbing Slings Tested - Limiter Knots are NOT redundant!!!（HowNOT2）
start: 380
```

**今晚就能做的動作**：用一條 180 公分扁帶（Petzl 做 Quad 用的長度），在兩個門把之間分別做一次 Quad 和一次 Sliding X。做完後拔掉其中一邊，看主點往下掉了多遠。

## 多繩距：確保方式決定確保站要扛什麼

單繩距的固定點只要吃得住頂繩的重量。到了多繩距，確保站還要扛先鋒的墜落，而先鋒怎麼被確保，會改變確保站受力的方向和大小。[〈多繩距入門〉](/posts/climbing/2026-10-17-multi-pitch-basics#確保的兩派站上確保與身上確保)比較了各國確保先鋒的預設，這裡只看對確保站的要求。

### ACMG：什麼時候改用固定點確保，確保站要多強

加拿大山岳嚮導協會（ACMG）的 [TechFiles](http://web.archive.org/web/20220402105149/https://www.acmg.ca/05pdf/TechFiles/TechFiles_Vol1_No1.pdf) 把「固定點確保」定義為：確保器或義大利半扣直接裝在確保站的固定點上確保先鋒。墜落的力直接傳到確保站，確保者只負責制動。它列了四種該考慮這樣做的狀況：

- 先鋒容易掉：難度高、岩石濕滑。
- 可能出現高係數墜落。
- 可能掉很長：例如平板或高山冰攀。
- 確保本身不穩：確保者經驗不足、繩子結冰、站位差。

改用固定點確保，確保站的要求跟著變高：

- **至少兩個能承受各方向拉力的好點**：例如兩根 bolt、水平放的 cam、冰螺栓。先鋒墜落時拉力可能朝上，只能承受向下拉力的點不算。
- **固定點本身要有確保站等級的強度**：ACMG 寫約 20 kN。常見的扁帶或輔繩，可能要在固定點用雙股才夠。
- **固定點大約在胸口高度**：收放繩才順手。
- **確保器的選擇**：義大利半扣通常最好用。用管狀確保器的話，制動端要先轉向，或確保站附近已經有可靠的先鋒保護點。

### CAI：三種確保法，確保站受力不同

義大利登山協會（CAI）全國登山學校委員會 [2016 年的確保站教學文件](https://organizzazione.cai.it/commissione-nazionale-scuole-alpinismo-scialpinismo-arrampicata-libera-vfg/wp-content/uploads/sites/107/2025/01/2016-03-29-Soste-per-Alpinismo-Didattica.pdf)要學員認識三種確保先鋒的方法：

- **經典式**（classica）：義大利半扣裝在確保站上。基礎課程優先教這個，理由是學員不會直接被捲進先鋒的墜落，也比較拉得住。
- **平衡式**（bilanciata）與**腹部式**（ventrale）：確保者掛在確保站的主點上，先鋒墜落時確保者也是系統的一部分。腹部式是確保器掛在吊帶上，主點要先掛一個「假快扣」當方向點。

腹部式有一個取捨。主點上的假快扣像滑輪，會讓確保站受的力比其他兩種多，CAI 實驗測到多出約 1–1.5 kN。但先鋒最後一個保護點的受力會小很多，這正是選它的理由。CAI 的結論是：先鋒離開確保站後要馬上放第一個保護點，讓確保站不必長時間承受這個放大的力。

確保者掛在主點上時，CAI 還要求兩件事：確保站用固定式（主點打結鎖住）而不是滑動式，自我連結也連在主點上。這樣即使其中一個點失效，確保者也不會跟著往下掉。在要自己架確保站的冒險路線上，CAI 建議用腹部式來減輕保護點的負擔，並且搭配固定式確保站與主點上的假快扣。

**今晚就能做的動作**：拿出你常用的確保站器材，想一遍先鋒剛離站就掉時拉力朝哪個方向，再問自己：每個點都承受得了向上的拉力嗎？

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

## 延伸觀看：器材實測與教學頻道

本文嵌入的影片來自下面兩個頻道。想自己往下挖，可以從這裡開始；看的時候記得每個頻道的限制。

- **[HowNOT2](https://www.youtube.com/@HowNOT2)**：Ryan Jenks 經營，2016 年從走繩（highline）安全教學起家，後來把攀岩、洞穴、溪降器材拿去拉斷，還有在真岩上拉 bolt 的 Bolt Busters 系列。看點是「標示強度以外」的情況：打結、磨損、舊裝備、放錯位置。限制：多數是自製機器慢拉、每組 1–3 個樣本，他自己也說這是娛樂不是科學；頻道背後有網路器材店，部分受測品是店內商品。
- **[Hard Is Easy](https://www.youtube.com/@HardIsEasy)**：署名 Ben 的攀岩者獨自經營，以前是軟體工程師。一次在泰國 Tonsai 看到確保者接太硬、攀者撞上岩石，他回家設計實驗，從此專拍確保、繩子、鉤環與確保器的實驗與物理解說，近年多支在 Mammut 實驗室合拍。限制：實驗多是自己設計，不是 EN／UIAA 標準測試。

## 更新紀錄

- 2026-10-23：新增「多繩距：確保方式決定確保站要扛什麼」一節，整理 ACMG 的固定點確保條件與確保站要求，以及 CAI 三種確保法對確保站受力的影響
- 2026-10-23：補充 HowNOT2、Hard Is Easy 等頻道的器材實測影片與頻道介紹

## 參考資料

- [台灣岩友聯盟（TOCC）大事紀：2019-05-16 #313 通道事故](https://www.tocc-climbing.org/chronicle-of-events)
- [建立確保站固定點（含 Quad）：Building a belay anchor and belaying on a bolted multi-pitch route（Petzl）](https://petzl.com/us/en/sport/tech-tips/basic-techniques/building-a-belay-anchor-and-belaying-on-a-bolted-multi-pitch-route/Relais-grande-voie_SPO_a77Tx000000E3MEIA0.html)
- [墜落係數與衝擊力：Fall factor and impact force – theory（Petzl）](https://petzl.com/us/en/sport/tech-tips/basic-techniques/fall-factor-and-impact-force---theory/CORDES-chute-theorie_SPO_a77w0000000KywUAAS.html)
- [Forces at work in a real fall（Petzl）](https://petzl.com/us/en/sport/tech-tips/product-information-and-specifications/forces-at-work-in-a-real-fall/CORDES-chute-efforts_SPO_a77w0000000KywPAAS.html)
- [固定點確保與自動制動確保器：TechFiles Vol. 1 No. 1（ACMG，2012，Wayback Machine 存檔）](http://web.archive.org/web/20220402105149/https://www.acmg.ca/05pdf/TechFiles/TechFiles_Vol1_No1.pdf)
- [三種確保法與確保站受力：Soste per alpinismo: didattica（CAI 全國登山學校委員會，2016，義大利文 PDF）](https://organizzazione.cai.it/commissione-nazionale-scuole-alpinismo-scialpinismo-arrampicata-libera-vfg/wp-content/uploads/sites/107/2025/01/2016-03-29-Soste-per-Alpinismo-Didattica.pdf)
- [固定點口訣：SERENE and ERNEST Anchors（American Alpine Institute）](https://alpineinstitute.com/serene-and-ernest-anchors)
- [Gym to Crag: Trad Climbing（Elaina Arenz，Climbing，2019）](https://www.climbing.com/skills/gym-to-crag-trad-climbing-outdoor-research/)
- [Strong Anchors（Karsten Delap，2020）](https://www.karstendelap.com/blog/strong-anchors)
- [QC Lab: Sling Strength in 3 Anchor Configurations（Black Diamond）](https://blackdiamondequipment.com/blogs/stories/qc-lab-sling-strength-in-3-anchor-configurations)
- [艾格探險：單繩距傳統攀登](https://www.adventuretaiwan.com/product/single-pitch-trad-climbing/)
- [百合搖滾：單繩距傳統攀登完整課程](https://www.wildlily.rocks/full-course)
- [nobodyclimb 繩索系統練習：傳攀固定點](https://nobodyclimb.cc/games/rope-system/learn/trad-anchor)
- [傳攀保護：岩楔與活動岩楔](/posts/climbing/2026-10-17-trad-protection-nuts-cams)
- [多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)
- [學習路徑與常見事故](/posts/climbing/2026-10-17-sport-to-trad-learning-path)
