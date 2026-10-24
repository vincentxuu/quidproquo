---
title: "垂降怎麼做：從到站扣上自己，到把繩子拉下來"
date: 2026-10-24
category: climbing
tags: [climbing, outdoor-climbing, multi-pitch, sport-climbing, trad-climbing]
lang: zh-TW
type: guide
description: "垂降的完整操作順序，加上七種垂降方式各自怎麼做：單繩對折、兩條繩對接、單繩加細拉繩、GRIGRI 單股擋繩、固定單繩、沒有垂降器時的 Munter 與鉤環制動、八字環，以及同時垂降與救援用垂降的分界。每一種都附專業來源、事故與示範影片。"
tldr: "垂降事故的致死比例比一般攀登事故高，最常見的是垂降出繩尾、固定點失效、沒有備份，近年 AAC 收錄的致死案例又多了垂降器只穿到一股或裝錯股。對策是同一套順序每次照做：到站先扣上自己、繩尾打結、先裝摩擦套結再延伸垂降器、解開自我確保前先坐上去負重測試並請夥伴檢查。單股垂降（GRIGRI、細拉繩、固定繩）最怕裝錯股，同時垂降與共用垂降器屬於救援技術，不要自己臨場試。"
draft: false
series:
  name: "運動攀登與傳統攀登"
  order: 8
glossary:
  - term: "延伸垂降"
    aliases: ["extended rappel", "extended abseil"]
    definition: "垂降器不直接掛在確保環上，而是用一段扁帶或自我確保繩延伸到身體前方，讓下方的摩擦套結碰不到垂降器。"
    context: "Petzl、AMGA 單繩距教練課程的做法都是延伸垂降器、摩擦套結掛確保環。"
  - term: "負重測試"
    aliases: ["function test", "load test", "Belastungstest"]
    definition: "還連著固定點的時候，先坐上垂降系統讓它承受全身體重，確認垂降器、鉤環、摩擦套結都正確，才解開自我確保。"
    context: "DAV 分析兩起課程事故後指出，只要解開自我確保前做過負重測試，兩起都能避免。"
  - term: "疊式垂降"
    aliases: ["stacked rappel", "pre-rigged rappel"]
    definition: "兩人都在固定點上先把垂降器架好，再依序出發。兩人可以互相檢查；上面那個人的垂降器也會鎖住兩股繩。"
    context: "AAC 分析 2024 年 Stanley Headwall 垂降死亡事故後，建議更廣泛採用疊式垂降。"
  - term: "擋繩垂降"
    aliases: ["blocked rappel", "knot block", "Reepschnur"]
    definition: "在垂降環一側打一個比環大的結、加有鎖鉤環備援，把繩子擋住，只垂降在另一股上。GRIGRI 垂降與單繩加細拉繩都會用到。"
    context: "AAC 收錄的 2025 年 Red Rock 死亡事故，就是 GRIGRI 裝在沒被擋住的拉繩那股。"
  - term: "繩結移位"
    aliases: ["knot migration"]
    definition: "粗細不同的兩條繩一起放進垂降器、對接結又在粗繩那一側時，細繩跑得比較快，結會慢慢被拉離垂降環，細繩那端越來越短，最後可能從垂降器滑出。結放在細繩側、抵住環就不會發生。"
    context: "2026 年 7 月挪威一起死亡事故，就是單繩加細拉繩兩股垂降時發生繩結移位。"
  - term: "同時垂降"
    aliases: ["simul-rappel", "simul-rappelling"]
    definition: "兩人各在穿過固定點的繩子一端同時垂降，互相當配重。一人卸力或滑出繩尾，另一人就跟著掉。"
    context: "AAC 指出，同時垂降讓兩人互相依賴，任一方出錯，兩人都會承擔後果。"
  - term: "消防員確保"
    aliases: ["fireman's belay", "bottom belay"]
    definition: "先下到底的人雙手握住兩股垂降繩，上面的人一失控就往下拉緊，增加摩擦讓他停住。"
    context: "SAC 指出，如果垂降器根本掛錯，消防員確保救不了人，所以不能取代自己的備份。"
---

> 🌏 [English version](/posts/climbing/2026-10-24-how-to-rappel-en)

垂降看起來很單純：把繩子穿過固定點，掛上垂降器，自己滑下來。真正的風險在細節。一股繩沒穿進垂降器、繩尾沒打結、摩擦套結太長碰到垂降器，任何一個漏掉，都可能直接墜落。

上一篇[下放還是垂降](/posts/climbing/2026-10-17-lower-or-rappel)講的是「要不要垂降」：AAC 與龍洞 TOCC 各自的建議，以及垂降最致命的三種錯誤。這篇接著講「怎麼垂降」：先把一次垂降拆成八個步驟，從到站扣上自己，一路到把繩子拉下來；再分開說明七種垂降方式各自怎麼做、哪裡最容易出事。單繩距清路線與[多繩距](/posts/climbing/2026-10-17-multi-pitch-basics)撤退都用得到。

這篇是〈運動攀登與傳統攀登〉系列的第 8 篇。前置是[下放還是垂降](/posts/climbing/2026-10-17-lower-or-rappel)；固定點怎麼看，見[掛片會壞：怎麼判斷一顆 bolt](/posts/climbing/2026-10-17-judging-bolts)與[建立固定點](/posts/climbing/2026-10-17-building-anchors)。

先講清楚：**每一步都要先在地面或岩館，在教練面前做到正確。** 台灣的多繩距課程都包含多段垂降，課程列表見[多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)。 這篇讓你知道每一步在防什麼、各家專業機構怎麼做，不是取代課程的操作手冊。

主要參考的影片是 [Charlie Centa 的〈How to rappel/abseil - safely AND efficiently〉](https://www.youtube.com/watch?v=fMlxmDCie0s)（2026 年 8 月，15 分鐘）。Centa 自述是在西班牙加泰隆尼亞帶課的[西班牙登山嚮導協會（AEGM）](https://www.aegm.org/)攀岩嚮導。他示範的是兩條繩對接的多繩距垂降，從「舊做法為什麼不夠」講起，一路示範到下降的手法。以下各步驟會標出影片對應的時間，再對照 [Petzl](https://petzl.com/int/en/sport/tech-tips/basic-techniques/rappelling/escalade-grde-voie-rappel_SPO_a77w0000000KypxAAC.html)、[UIAA](https://theuiaa.org/mountaineering/alpine-skills-which-knot-to-use-to-join-two-ropes)、[AAC](https://publications.americanalpineclub.org/articles/13201200200/Know-the-Ropes-Rappelling-Fundamentals-to-Save-Your-Life)、[BMC](https://thebmc.co.uk/en/climb-skills-abseiling)、[德國阿爾卑斯協會（DAV）](https://alpenverein.de/artikel/klettern-abseilen_c1137d30-6bc6-436a-9c7c-d7660a300a6d)等專業來源。

```youtube
url: https://www.youtube.com/watch?v=fMlxmDCie0s
title: How to rappel/abseil - safely AND efficiently（Charlie Centa，2026）
start: 36
```

## 為什麼垂降要整篇講

垂降出事的機率不一定最高，但一出事很容易死。《Rock and Ice》2020 年的[〈30 Years of Climbing Accident Data〉](https://rockandice.com/climbing-accidents/30-years-of-climbing-accident-data-an-investigative-report)把 AAC 三十年的事故報告逐篇標記，找出 251 件垂降失誤，其中 76 件致死，接近三成。按作者公開的同一份資料計算，所有攀登事故的致死比例約兩成。

失誤集中在幾種：

- **垂降出繩尾**：繩尾沒打結、兩邊繩長不一樣、中點標記不準。
- **固定點失效**：舊扁帶、單一岩釘。一個垂降點常有好幾個人共用：2022 年 Tahquitz Rock 兩人死亡，2025 年 North Early Winter Spire 一根舊岩釘拔出，[三人死亡](https://publications.americanalpineclub.org/articles/13201217683)。
- **沒有備份**：沒有摩擦套結，手一鬆就失控。
- **垂降器只穿到一股繩，或穿錯那一股**：例如 2024 年加拿大 Stanley Headwall 的死亡事故。AAC 在[〈The Prescription—The Stacked Rappel〉](https://americanalpineclub.org/news/2026/1/20/the-prescriptionthe-stacked-rappel)分析，原因看起來是垂降器只扣到一股繩。

背後常有同一組背景：天快黑、很累、趕時間。AAC 的事故報告是自願通報，算的是件數，不是發生率；但它足以說明，垂降不是爬完之後的休息時間。

**今晚就能做的動作**：回想你上一次垂降，把八個步驟裡你沒做到的，記在手機備忘錄裡。

## 垂降有哪幾種方式

先認得你要用的是哪一種。下面八步以最常見的雙股垂降為準，也就是方式一和方式二；其他方式跟八步不一樣的地方，各自寫在後面的段落。

| 方式 | 什麼時候用 | 一段能下多長 | 垂降器 | 最常見的致命錯誤 |
|---|---|---|---|---|
| [一、單繩對折雙股](#方式一單繩對折雙股垂降) | 單繩距清路線、短的多繩距撤退 | 半條繩長 | 管狀垂降器 | 中點不準、繩尾沒打結 |
| [二、兩條繩對接](#方式二兩條繩對接垂降) | 多繩距撤退 | 一條繩長 | 管狀垂降器 | 只扣到一股、把長尾巴當主繩 |
| [三、單繩加細拉繩](#方式三單繩加細拉繩) | 只帶一條主繩的多繩距 | 一條繩長 | 管狀垂降器或 GRIGRI | 繩結移位、裝錯股、卡繩時只剩細繩 |
| [四、GRIGRI 單股擋繩](#方式四grigri-單股垂降擋繩) | 用輔助制動器垂降 | 擋繩時看拉繩長度 | GRIGRI 等輔助制動器 | 裝在沒被擋住的那股 |
| [五、固定單繩](#方式五固定單繩垂降管狀垂降器) | 架工作繩、頂繩自我確保後下來 | 繩子固定那段 | 管狀垂降器（高摩擦）或 GRIGRI | 以為繩子固定了其實沒有 |
| [六、Munter 與鉤環制動](#方式六沒有垂降器munter-與鉤環制動) | 垂降器掉了 | 同雙股垂降 | 只用鉤環 | 鎖被繩子轉開、沒加備份 |
| [七、八字環](#方式七八字環) | 溪降、救援，或手上只有八字環 | 同雙股垂降 | 八字環 | 八字環撬開鉤環 |

還有同時垂降、兩人共用垂降器、配重垂降這幾種「兩個人一起下」的方式，都屬於救援或緊急狀況，見最後的[認得就好，不要自己試](#認得就好不要自己試同時垂降與救援用的垂降)。

**今晚就能做的動作**：在表上圈出你最常用的那一種，先讀那一節。

## 先備器材

| 器材 | 用途 | 注意 |
|---|---|---|
| 垂降器 | 管狀確保器即可，要能穿兩股繩 | 細繩摩擦力不夠，見[確保器](/posts/climbing/2026-10-24-climbing-belay-device) |
| 自我確保繩 | 到站時把自己扣在固定點上 | 可調式（例如 Petzl CONNECT ADJUST）最好用；用有鎖鉤環，不要用快扣 |
| 延伸用扁帶 | 把垂降器延伸到身體前方 | 60 cm 扁帶，或 120 cm 對折；用尼龍扁帶 |
| 摩擦套結細繩 | 打 autoblock 當「第三隻手」 | 軟的細繩，比主繩細，長度要短到碰不到垂降器 |
| 有鎖鉤環 ×3 | 自我確保、垂降器、摩擦套結各一 | 每次受力前看一眼有沒有鎖 |
| 刀與 5–6 mm 輔助繩 | 多繩距撤退時補強或更換舊扁帶 | 單繩距可以不帶 |

自我確保繩的材質，AAC 2012 年的[〈Know the Ropes: Rappelling〉](https://publications.americanalpineclub.org/articles/13201200200/Know-the-Ropes-Rappelling-Fundamentals-to-Save-Your-Life)與 [DAV 2020 年的垂降專文](https://alpenverein.de/artikel/klettern-abseilen_c1137d30-6bc6-436a-9c7c-d7660a300a6d)都建議用尼龍，不用 Dyneema。AAC 的理由是 Dyneema 幾乎沒有延展性，受到衝擊時在很低的力量下就會斷；DAV 則提到它比較容易老化。

**今晚就能做的動作**：把上面的清單攤在地上點一遍，缺的列進下次的購物清單。

## 整體順序：兩人多段垂降

下面八步是一個人的順序，以雙股垂降為準。兩個人一起撤退時，誰先誰後、在哪裡交接，看這張圖：

```diagram
title: 兩人多段垂降：誰做什麼、在哪裡交接
desc: 第一人架好垂降後請第二人檢查，負重測試再下降；到下一站先扣站、固定繩，第二人才拆站垂降，第一人在下方拉繩保護，最後第二人拉繩。
caption: 簡化示意：疊式垂降時兩人會在第一步就一起架好垂降器、互相檢查。
---
<svg viewBox="0 0 640 632">
  <line class="dg-rule" x1="16" y1="56" x2="624" y2="56"/>
  <line class="dg-rule" x1="320" y1="24" x2="320" y2="616"/>

  <text class="dg-label" x="168" y="40" text-anchor="middle" dominant-baseline="central">第一人</text>
  <text class="dg-label" x="472" y="40" text-anchor="middle" dominant-baseline="central">第二人</text>

  <path class="dg-line" d="M288 100H464Q472 100 472 108V148" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M352 180H176Q168 180 168 188V228" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M168 288V308" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M288 340H464Q472 340 472 348V388" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M168 368V388" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M472 448V468" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M472 528V548" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M168 448V548" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="48" y="72" width="240" height="56" rx="6"/>
  <text class="dg-label" x="168" y="91" text-anchor="middle" dominant-baseline="central">架好垂降</text>
  <text class="dg-sub" x="168" y="111" text-anchor="middle" dominant-baseline="central">先摩擦套結，再延伸垂降器</text>

  <rect class="dg-box dg-box--accent" x="352" y="152" width="240" height="56" rx="6"/>
  <text class="dg-label" x="472" y="171" text-anchor="middle" dominant-baseline="central">夥伴檢查</text>
  <text class="dg-sub" x="472" y="191" text-anchor="middle" dominant-baseline="central">逐項用手摸過、念出來</text>

  <rect class="dg-box" x="48" y="232" width="240" height="56" rx="6"/>
  <text class="dg-label" x="168" y="251" text-anchor="middle" dominant-baseline="central">負重測試後下降</text>
  <text class="dg-sub" x="168" y="271" text-anchor="middle" dominant-baseline="central">坐上去確認，才解自我確保</text>

  <rect class="dg-box" x="48" y="312" width="240" height="56" rx="6"/>
  <text class="dg-label" x="168" y="331" text-anchor="middle" dominant-baseline="central">到站先扣站、固定繩</text>
  <text class="dg-sub" x="168" y="351" text-anchor="middle" dominant-baseline="central">扣好之前垂降器不離繩</text>

  <rect class="dg-box" x="48" y="392" width="240" height="56" rx="6"/>
  <text class="dg-label" x="168" y="411" text-anchor="middle" dominant-baseline="central">下方拉繩保護</text>
  <text class="dg-sub" x="168" y="431" text-anchor="middle" dominant-baseline="central">雙手握住兩股繩</text>

  <rect class="dg-box" x="352" y="392" width="240" height="56" rx="6"/>
  <text class="dg-label" x="472" y="411" text-anchor="middle" dominant-baseline="central">架垂降、拆站、下降</text>
  <text class="dg-sub" x="472" y="431" text-anchor="middle" dominant-baseline="central">一樣先負重測試</text>

  <rect class="dg-box" x="352" y="472" width="240" height="56" rx="6"/>
  <text class="dg-label" x="472" y="491" text-anchor="middle" dominant-baseline="central">到站先扣站</text>
  <text class="dg-sub" x="472" y="511" text-anchor="middle" dominant-baseline="central">兩人都扣好才拿下垂降器</text>

  <rect class="dg-box" x="48" y="552" width="240" height="56" rx="6"/>
  <text class="dg-label" x="168" y="571" text-anchor="middle" dominant-baseline="central">顧著繩子穿過環</text>
  <text class="dg-sub" x="168" y="591" text-anchor="middle" dominant-baseline="central">繩落下時靠牆、低頭</text>

  <rect class="dg-box" x="352" y="552" width="240" height="56" rx="6"/>
  <text class="dg-label" x="472" y="571" text-anchor="middle" dominant-baseline="central">拉繩</text>
  <text class="dg-sub" x="472" y="591" text-anchor="middle" dominant-baseline="central">先解繩尾結，確認拉哪股</text>

  <text class="dg-edge" x="400" y="88" text-anchor="middle" dominant-baseline="central">請檢查</text>
  <text class="dg-edge" x="244" y="168" text-anchor="middle" dominant-baseline="central">沒問題</text>
  <text class="dg-edge" x="400" y="328" text-anchor="middle" dominant-baseline="central">可以下了</text>
</svg>
```

## 第一步：到站先扣上自己，再檢查固定點

到了垂降站，第一個動作是用自我確保繩和有鎖鉤環把自己扣在固定點上。[Petzl 的垂降步驟](https://petzl.com/int/en/sport/tech-tips/basic-techniques/rappelling/escalade-grde-voie-rappel_SPO_a77w0000000KypxAAC.html)開頭就寫：所有在固定點的操作，都要直接連在固定點上。Centa 推薦用可調長度的自我確保繩，因為之後做負重測試時比較好調（[3:26](https://www.youtube.com/watch?v=fMlxmDCie0s&t=206s)）。

扣好之後再檢查固定點。垂降時，你的命全部吊在這個點上，沒有其他備援。DAV 那篇專文提醒的就是這件事。

- **錨栓、鏈條、垂降環**：鏽蝕、磨損、快速扣環有沒有鎖緊。[TOCC〈龍洞的上方固定點〉](https://www.tocc-climbing.org/post/%E9%BE%8D%E6%B4%9E%E7%9A%84%E4%B8%8A%E6%96%B9%E5%9B%BA%E5%AE%9A%E9%BB%9E)提醒，龍洞是海邊岩場。岩友自己加掛的鋁合金垂降環，往往不到一年強度就大幅削弱；304 不鏽鋼快速扣環也有很高的安全疑慮。看到異常要通報 TOCC 的 Rebolting Team。
- **舊扁帶**：AAC 2025 年的[〈Know the Ropes: Crafty Rappel Techniques〉](http://publications.americanalpineclub.org/articles/13201217362)說，每個垂降點在證明無罪之前都是有罪的。2022 年 Tahquitz Rock 的事故裡，垂降點只有一條日曬褪色的扁帶，扁帶斷裂，兩人死亡。
- **單一個點**：[BMC〈Alpine skills: 6 tips for multipitch abseiling〉](https://thebmc.co.uk/en/alpine-skills-multipitch-abseiling-tips)的建議是，不放心就留下自己的器材，或換掉現場的舊扁帶。

[HowNOT2](https://www.youtube.com/@HowNOT2) 這支 2024 年的影片把各種垂降站留下的舊扁帶和細繩拿去拉斷。3:50 起比較日曬褪色和顏色還鮮豔的扁帶：褪色的扁帶在約 3 kN 就斷了，跟 Tahquitz 事故那條差不多。他的結論是不要只靠一條來歷不明的舊扁帶垂降。HowNOT2 也經營自己的器材商店，片尾有導購。

```youtube
url: https://www.youtube.com/watch?v=IpJtTRmg7Og
title: Would you rappel on this?（HowNOT2，2024）
start: 230
```

**今晚就能做的動作**：打開你常去的岩場在地組織的網站或社群，找出它對垂降環、扁帶的維護說明與通報方式。

## 第二步：穿繩，兩條繩怎麼接

**單繩對折**：繩子的中點要剛好在固定點上。中點標記會因為繩子縮短、剪過而跑掉；不確定時，把兩端繩尾對齊找真正的中點，方法在[下放還是垂降](/posts/climbing/2026-10-17-lower-or-rappel)那篇。

**兩條繩對接**：多繩距常用兩條繩接起來，垂降距離才夠長。對接結的主流是 flat overhand：兩條繩並排，一起打一個單結。[UIAA〈Which knot to use to join two ropes〉](https://theuiaa.org/mountaineering/alpine-skills-which-knot-to-use-to-join-two-ropes)、[Petzl](https://petzl.com/INT/en/Sport/Knot-for-joining-rappel-ropes)、[Edelrid](https://edelrid.com/int-en/knowledge/knowledge-base/knots-for-connecting-ropes-when-rappelling-comparison)、DAV 都有兩個共同要求：

1. **四股分別拉緊**：結兩側的四條繩一條一條用力拉，只抓兩邊一起拉不夠。
2. **尾巴至少 30 cm**。

Edelrid 另外提醒，結型要整理乾淨，兩條繩平行、不交叉。

flat overhand 的好處是結偏在一側，拉繩時比較不容易卡在岩縫或岩角。

### 各家意見不一致的地方

| 問題 | 一派 | 另一派 |
|---|---|---|
| flat figure-8 能不能用 | 優勝美地搜救隊員與嚮導在 [Climbing 的專文](https://climbing.com/skills/rappelling-best-practices)：絕對不要用，受力會翻滾解開 | 法國國立滑雪登山學校（ENSA）的[測試](https://climbing.com/skills/how-to-rappel-safely-with-euro-death-knot-offset-figure-8/)：拉緊、尾巴 30 cm 以上就適用 |
| 要不要再加一個結 | Petzl：兩條繩粗細不同時要加；UIAA 改用 double fisherman | [bergundsteigen 2025](https://www.bergundsteigen.com/en/artikel/alpinhacks-abseilen-mit-hilfsleinen-rad-line-co/)：單一個結就夠，連打兩個更容易卡 |
| Centa 的選擇 | 他用 double overhand（兩條繩一起繞兩圈），理由是兩種顏色交錯、一眼看得出有沒有整理好，也比較不會翻滾（[5:10](https://www.youtube.com/watch?v=fMlxmDCie0s&t=310s)） | 片中沒提尾巴長度，照上面的 30 cm 補上 |

這些分歧都建立在同一個前提上：結要拉緊、尾巴要夠長。HowNOT2 2026 年請 IFMGA 國際高山嚮導 Ian Nicholson 一起測試。7:49 起的失敗情境裡，沒拉緊、尾巴又短的 flat figure-8，在不到 1 kN 時就翻滾解開，用體重就能讓它脫落。片尾的建議是每股拉緊、尾巴至少 12 吋（約 30 cm）。HowNOT2 自己也賣攀登繩，片尾有導購。

```youtube
url: https://www.youtube.com/watch?v=rDkLXs-vfuI
title: Which is the real DEATH knot?（HowNOT2，2026）
start: 469
```

反過來，Stanley Headwall 那起事故用的是 flat overhand。AAC 的報告引述同行夥伴的說法，**對接結不是事故原因**，看起來是垂降器只扣到一股繩。比起換哪一種結，更重要的是每次都拉緊、留夠尾巴。

尾巴也不要太長。[bergundsteigen〈Fehler beim Abseilen: 20 Tipps〉](https://bergundsteigen.com/artikel/fehler-beim-abseilen-20-tipps)收錄過一次險情：有人把約 1.5 m 長的尾巴當成主繩，扣進了垂降器。

**穿繩時就先決定要拉哪一條**：結在哪一側，拉繩時就拉那一側。Centa 會把自我確保繩的鉤環扣在要拉的那股上，當作記號（[12:00](https://www.youtube.com/watch?v=fMlxmDCie0s&t=720s)）；[DAV 的垂降技巧篇](https://www.alpenverein.de/artikel/abseilen-klettern-tipps_a8187791-6f13-4d2e-a5c6-9d979859eaed)和 Petzl 也是這樣做。

**今晚就能做的動作**：拿兩段繩子練 flat overhand：四股各自拉緊，量尾巴有沒有 30 cm。再故意只拉兩股，比較結的鬆緊。

## 第三步：繩尾打結，丟繩前先喊

[AAC 2012 年那篇](https://publications.americanalpineclub.org/articles/13201200200/Know-the-Ropes-Rappelling-Fundamentals-to-Save-Your-Life)把垂降出繩尾列為三大主因之一。對策是**封閉系統**：兩端繩尾各打一個止滑結，垂降器就不會滑出繩尾。AAC 建議兩股各打各的，不要綁在一起，繩子的扭轉才能散開；三重桶結（triple barrel knot）是好選擇。

止滑結要不要每次打，各家說法不同：

- **一律打**：AAC、[American Alpine Institute 嚮導](https://climbing.com/skills/5-steps-for-safer-rappelling)。後者特別提醒，很多人在單繩距沒想到要打結，偏偏大多數意外垂降出繩尾的事故就發生在單繩距。
- **看情況**：DAV 說，不能百分之百確定兩股都夠長時就打；BMC 的 Steve Long 說打結會勾住岩角，「沒有固定規則」。

打了結也不是萬無一失。[AAC 2025 那篇](http://publications.americanalpineclub.org/articles/13201217362)引述 HowNOT2 的測試：約 6 kN 的力就能把止滑結拉過 ATC。所以結要打大，也要留尾巴。

丟繩之前：

- **先喊**：Centa 會喊「Rope」，讓下面的人遮住頭（[10:37](https://www.youtube.com/watch?v=fMlxmDCie0s&t=637s)）；[BMC〈How to abseil〉](https://thebmc.co.uk/en/climb-skills-abseiling)用的是「Rope below!」。
- **兩股分開丟**：手上留一些繩的重量，丟出去才拉得動下面的繩。
- **風大、樹叢多時改用背繩（saddlebag）**：把繩尾打結扣在吊帶上，繩子捲成小捆掛在身側，邊下邊放。AAC、YOSAR、bergundsteigen 都建議這個做法。

**繩子卡住時，絕不垂降越過它。** Centa（[11:02](https://www.youtube.com/watch?v=fMlxmDCie0s&t=662s)）和 bergundsteigen 都這樣說：剩下的繩永遠不能在你上方，否則你處理不到它，最後只能爬回去。

**今晚就能做的動作**：練三重桶結，左右手各打一次；再把繩子捲成兩捆練習背繩。

## 第四步：先裝摩擦套結，再延伸垂降器

這是 Centa 影片的核心，也是各家做法差最多的地方。

**舊做法**：垂降器直接掛確保環，摩擦套結掛在腿環。Centa 說這有兩個問題（[2:16](https://www.youtube.com/watch?v=fMlxmDCie0s&t=136s)）：摩擦套結一碰到垂降器就會被推著走，等於失效；鉤環也會壓在腿環的金屬扣上。

**現在常見的做法：延伸垂降器，摩擦套結掛在確保環**：

1. **先裝摩擦套結**：用細繩在兩股繩上打 autoblock，掛在確保環。Centa 解釋為什麼先裝它（[7:27](https://www.youtube.com/watch?v=fMlxmDCie0s&t=447s)）：懸吊的確保站沒有平台，整串繩的重量都掛在你身上。autoblock 可以直接繞在繃緊的繩上；裝好後往上拉一段鬆繩，下面的繩重由 autoblock 吃住，你就有鬆繩可以從容裝垂降器。DAV 也這樣建議，還可以順便測試 autoblock 抓不抓得住。
2. **延伸垂降器**：Centa 用一條 60 cm 扁帶穿過確保環，兩端合起來掛垂降器的鉤環（[8:21](https://www.youtube.com/watch?v=fMlxmDCie0s&t=501s)）。也可以用 120 cm 扁帶對折，或可調式自我確保繩。
3. **兩股繩都穿進垂降器**，鎖上鉤環。
4. **收掉鬆繩**：垂降器到固定點之間、垂降器到 autoblock 之間都要收緊。

[The Mountaineers 整理過 AMGA 單繩距教練課程的做法](https://mountaineers.org/blog/extended-rappel-and-updated-belay-techniques)，列出延伸的好處：autoblock 和衣服都離垂降器比較遠，幾個人也可以同時架好垂降。

### 摩擦套結掛哪裡，專業機構不一致

| 做法 | 誰這樣教 | 理由與缺點 |
|---|---|---|
| 延伸垂降器，摩擦套結掛確保環 | Petzl、AMGA 系課程、ACMG／IFMGA 嚮導 [Cyril Shokoples](http://rescuedynamics.ca/articles/pdfs/BRAKESRappelAcronym.pdf)、奧地利阿爾卑斯協會（ÖAV，[bergundsteigen 2008 年轉述](https://assets.bergundsteigen.com/2021/08/38-41-kurzprusik-ad.pdf)）、Centa | Shokoples 不建議掛腿環：身體側轉或腿抬太高時，備份可能失效 |
| 垂降器掛確保環，摩擦套結掛腿環 | BMC、DAV 的「經典法」 | 摩擦套結要夠短，否則會頂到垂降器 |
| DAV：三種都可以 | DAV 另外提出延伸垂降器、摩擦套結掛腿環的「組合法」 | DAV 提醒掛確保環的缺點：緊急時人會本能地抓住摩擦套結，反而讓它抓不住 |

不管掛在哪裡，各家都同意三件事：

- **摩擦套結要短**，受力時碰不到垂降器。[bergundsteigen 2008 年的〈Kurzprusik a.D.〉](https://assets.bergundsteigen.com/2021/08/38-41-kurzprusik-ad.pdf)記錄過一次訓練事故：套結太長、掛錯位置，學員往後倒時套結滑到垂降器上失效，一路滑了約 20 m。
- **細繩要軟**：[DAV](https://alpenverein.de/artikel/klettern-abseilen_c1137d30-6bc6-436a-9c7c-d7660a300a6d) 認為一起事故的推定原因，就是 6 mm 的硬輔助繩抓不住。
- **它只是備份**：[BMC](https://thebmc.co.uk/en/climb-skills-abseiling) 提醒摩擦套結不是萬無一失，磨到東西就可能鬆開，手要一直握著制動端。

**今晚就能做的動作**：在家用一段繩子綁在門把上，照順序裝一次 autoblock 和延伸垂降器，拉緊之後看兩者之間還有沒有一個拳頭的距離。

## 第五步：解開自我確保之前，先坐上去

垂降器裝好，還不能解開自我確保。先把可調式自我確保繩放長，讓體重坐到垂降系統上。自我確保繩變鬆、確認一切正常，才把它解開。

這一步叫**負重測試**。[DAV 分析兩起課程事故](https://alpenverein.de/artikel/klettern-abseilen_c1137d30-6bc6-436a-9c7c-d7660a300a6d)：一起垂降器只扣到一股繩，另一起把垂降器掛在吊帶的裝備環上。DAV 的結論是，只要解開自我確保之前讓系統受力檢查過，兩起都能發現。Centa 在片中做負重測試時，就發現一個鉤環沒完全鎖上（[11:28](https://www.youtube.com/watch?v=fMlxmDCie0s&t=688s)）。

HowNOT2 2024 年的溪降入門影片也講這件事，在 26:12 起標著「WARNING: MUST WATCH」的段落。順序是先扣自我確保，裝好垂降器，往上拉到自我確保鬆掉，坐下去測試，最後才解開。片子的場景是溪降，用的器材也不同，但「先負重、後解開」的順序和攀岩一樣。

```youtube
url: https://www.youtube.com/watch?v=JwSJrWQnNrA
title: Rappelling Wizards - Intro to Canyoning（HowNOT2，2024）
start: 1572
```

**再請夥伴檢查一次。** Shokoples 的 BRAKES 口訣，每個字母一項：

| 字母 | 檢查 |
|---|---|
| B（Buckles） | 吊帶扣具 |
| R（Rappel device / Rope） | 垂降器裝對、兩股繩都穿過 |
| A（Anchor） | 固定點 |
| K（Knots） | 系統裡所有的結：對接結、繩尾結 |
| E（Ends） | 繩尾結、繩有沒有到地 |
| S（Safety backup） | 摩擦套結 |
| S（Sharp edges） | 繩子經過的岩角 |

Shokoples 要求每一項都用手摸過、念出來。AAC 2025 那篇用的 BRAKES 是另一個版本：B 是垂降器（Belay device）、E 是延伸（Extension）、S 只有一個。德語圈則有 A.B.S.-Check（固定點、制動、停止）。版本不同，重點一樣：還連著固定點時先受力測試，再加上夥伴檢查。

**疊式垂降**讓夥伴檢查更容易。兩人都先在固定點上架好垂降器，互相檢查再依序出發；上面那個人的垂降器還會鎖住兩股繩。AAC 分析 Stanley Headwall 那起事故的結論是：最簡單的解法是夥伴檢查或負重測試，疊式垂降值得更廣泛採用。

**今晚就能做的動作**：把 BRAKES 七項抄在手機桌布或吊帶的扣具附近，下次垂降前逐項念一次。

## 第六步：下降：制動手做事，摩擦套結待命

解開自我確保，制動手握住兩股繩，開始下降。Centa 的說法是（[13:42](https://www.youtube.com/watch?v=fMlxmDCie0s&t=822s)）：控制速度的是制動手；autoblock 只是緊急備份，下降時盡量不要讓它啟動，不要一直讓它抓住再放開。

下降時注意：

- **平順、不要彈跳**：[Edelrid 的測試](https://edelrid.com/int-en/knowledge/knowledge-base/knots-for-connecting-ropes-when-rappelling-comparison)裡，垂降中急停或突然往下一頓，固定點的瞬間受力最高約 2.6 kN，大約是體重的三倍。
- **眼睛看繩尾**：快到底時確認兩股都還在、都夠長。
- **需要雙手時，打一個保險結**：Centa 從 [12:30](https://www.youtube.com/watch?v=fMlxmDCie0s&t=750s) 起示範，後面稱它為「catastrophe knot」。在垂降器下方的兩股繩上打一個 overhand on a bight，用另一個鉤環掛回確保環。要解開卡住的繩或清掉路線上的東西時，就算 autoblock 滑了，這個結也會擋住垂降器。繼續下降前先解開。YOSAR 的說法一樣：不要只靠一個摩擦套結。
- **最後一個人要拆固定點時**：Centa 穿繩時就把繩子放在固定點鉤環的後方，也就是靠岩壁那側（[4:36](https://www.youtube.com/watch?v=fMlxmDCie0s&t=276s)）。這樣繩子受力時不會壓住鉤環，人坐在垂降上也拆得下來。

**今晚就能做的動作**：在家裡練保險結：一手握著「制動端」，另一手單手打 overhand on a bight、掛上鉤環。

## 第七步：到下一站，先扣站再放繩

到下一站，順序是：**先扣站，再把繩子拿出垂降器。** [BMC 的 Mike Margeson](https://thebmc.co.uk/en/alpine-skills-multipitch-abseiling-tips) 寫過自己的險情：到站後忘了扣自我確保，就把垂降器解開了。

[Climbing 雜誌上 YOSAR 隊員與嚮導的專文](https://climbing.com/skills/rappelling-best-practices)做法更保守。第一人扣好站之後，從垂降器多送 1.5–3 m 的繩，但**垂降器先留在繩上**。等第二人也下來扣好站，兩人才把垂降器拿下來。Petzl 的步驟則是第一人到站扣好後，把兩股繩扣在固定點上，避免繩子掉下去，也替第二人的下降多一層保護。

第一人到站之後，還要做三件事：

1. **試拉一下**：[BMC](http://thebmc.co.uk/en/abseiling-do-you-know-the-risks) 建議第一人先短拉一下，確認繩子拉得動。
2. **把要拉的那端穿進下一站**，並在那端打好止滑結。bergundsteigen 建議第一人趁第二人下降時先做好這件事，第二人一到站就能拉繩。
3. **喊「下降完成」**，讓上面的人知道可以開始。

口令各家不同，開爬前跟夥伴講好用哪一套，比用哪幾個字重要。

### 下方拉繩保護（消防員確保）：能不能取代備份

第一人在下方，可以雙手握住兩股繩，上面的人一失控就往下拉，讓他停住。這叫消防員確保。AAC 2012 那篇認為，autoblock 其實只有第一個下去的人需要，後面的人可以靠消防員確保。

[瑞士阿爾卑斯協會（SAC）的官方回應](https://www.sac-cas.ch/de/die-alpen/abseilen-mit-oder-ohne-selbstsicherung-15417/)不同意：SAC 的教學立場是垂降一律要有自己的備份。如果上面的人根本把垂降器掛錯了，例如掛在裝備環上，下面拉得再緊也救不了。[Petzl](https://petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX?ProductName=GRIGRI)另外提醒，上面的人用 GRIGRI 或 NEOX 時，下方用力拉繩反而可能讓它解鎖；Petzl 允許下方的人用手拉繩確保，但不能吊在繩上。所以消防員確保是額外的一層，不能取代上面的人自己的備份。

**今晚就能做的動作**：跟你的固定繩伴約好一套到站口令，寫下來，下次出發前對一次。

## 第八步：拉繩

兩人都扣好站之後才拉繩。拉之前：

- **解開所有止滑結**：[AAC 2025 那篇](http://publications.americanalpineclub.org/articles/13201217362)建議，最後一次垂降落地後，第一個下去的人就先把止滑結解開，養成習慣，就不會帶著結去拉繩。
- **確認拉的是對的那股**：結在哪一側就拉哪一側。拉錯邊，結會卡在垂降環上。
- **要拉的那端先穿進下一站，或先扣住**：Margeson 稱它為「繩子整條飛下山壁」的低級錯誤。

拉繩時：

- **慢慢拉**：BMC 建議慢慢拉，並特別留意固定點正下方的岩角。
- **繩尾快要穿過時加速、往外甩**：[Mark Synnott 在 Climbing 的建議](https://climbing.com/skills/how-to-rappel-safety-techniques)，讓繩子離開岩壁，比較不會卡住。
- **靠牆、低頭**：繩子落下會帶下石頭。

**繩子卡住怎麼辦**：手上還有兩端時，可以兩股一起用 prusik 上升，或沿著繩子攀回去。[BMC 提醒](http://thebmc.co.uk/en/abseiling-do-you-know-the-risks)，**不要用 prusik 只爬單股繩上去**，它隨時可能鬆脫，後果致命。這已經是[自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)的範圍，沒上過課不要在現場第一次試。

**今晚就能做的動作**：下次在岩場拉繩前，先停兩秒，念一次「結解開了、拉這股、那端扣好了」。

## 方式一：單繩對折雙股垂降

一條繩穿過固定點、對折，兩股一起放進管狀垂降器。這是單繩距最常見的垂降方式，八步就是以它和方式二為準寫的。[Petzl](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)的說法是：垂降距離不超過繩長一半，單繩對折就夠；超過就要改用方式二或方式三。

**什麼時候用**：清完運攀路線下來、多繩距撤退但每段不超過半條繩。運攀頂端要不要垂降，先看在地規範。AMGA 講師團的 Dale Remsberg 在 [AMGA 2025 年的影片](https://www.youtube.com/watch?v=MKfPKYSW7iE&t=104s)說，AMGA 和 AAC 都建議運攀固定點用下放。龍洞 TOCC 則請大家盡量垂降。兩邊的理由在[下放還是垂降](/posts/climbing/2026-10-17-lower-or-rappel)。

**跟八步不一樣的地方**：

- **爬到頂、要從繩結改成穿環時，先防掉繩**：AMGA 認證岩攀與高山嚮導 Travis Weil 先扣自我確保，再拉一段繩打結扣在吊帶上，最後才解開原本的繩結。這樣繩子不可能掉下去。
- **中點要對準固定點**：拉到中點標記，或確認兩端都到地。Weil 建議用雙色（bi-pattern）繩，中點不會像標記一樣褪色。中點標記會因為繩子縮短、剪過而跑掉；AAC 收錄的 [2024 年 Devils Tower 死亡事故](https://publications.americanalpineclub.org/articles/13201217342)，據 Mountain Project 上的留言，當事人把繩子剪短過，似乎沒有重新做中點標記，最後兩端不等長。
- **兩端各打止滑結**：Weil 在[另一支影片的 0:35](https://www.youtube.com/watch?v=qkbxXGYfGMk&t=35s)兩端都打桶結，還提到它能防止繩子從鍊環滑回去。
- **拉繩前，先解開不拉的那一端的止滑結**：拉其中一端時，另一端會往上穿過鍊環，那一端的結會卡住。單繩沒有對接結提醒你拉哪一邊，要自己記住。

**最常見的致命錯誤**：中點不準、繩尾沒打結，垂降出比較短的那一端。

Weil 這支 2025 年的影片從 1:29 起示範穿過鍊環、繩尾打結、拉到中點，2:16 起兩股進垂降器並加 autoblock。要注意 4:01 那段：他只用眼睛由上往下檢查，就解開自我確保，沒有先坐上去做負重測試；照第五步，負重測試要補上。說明欄有相機的聯盟連結，沒有攀岩器材贊助。

```youtube
url: https://www.youtube.com/watch?v=w6a0SCc3iAI
title: Rappelling: Learn the Basics（Travis Weil，2025）
start: 89
```

拉繩這一步，Mike Vert 這支多繩距垂降教學拍得很清楚。19:46 起，第二個人也下到站、離開繩子之後，他解開會被拉上去那一端的止滑結，免得它卡在上面的鍊環，再開始拉另一端；繩尾穿進下一站後再重新打結。Mike Vert 自述攀岩 11 年、有戶外冒險文憑，沒有提到嚮導認證，說明欄推廣他的付費課程。片中 18:24–19:02 有一段是同伴還掛在繩上時就先解開止滑結，這一段不要學。

```youtube
url: https://www.youtube.com/watch?v=_C0HXDiGbls
title: Full Masterclass: Multi Pitch Rappelling for Outdoor Rock Climbing - Bolted Anchors（Mike Vert，2026）
start: 1186
```

Weil 在 [3:32](https://www.youtube.com/watch?v=qkbxXGYfGMk&t=212s) 說，上面的夥伴不需要自己的備份，因為他可以在地面拉繩保護；這跟 SAC 的立場相反，見第七步〈下方拉繩保護〉。

**今晚就能做的動作**：攤開繩子，從兩端往回找真正的中點，跟中點標記比一比差多少。

## 方式二：兩條繩對接垂降

兩條繩用對接結接起來，結靠在固定點一側，兩股一起放進垂降器。多繩距撤退、垂降距離超過半條繩時用。開頭那支 Charlie Centa 的影片示範的就是這種：他身上綁著兩條不同顏色的繩，到站後把兩條繩接起來垂降。

**Centa 的順序**（影片時間點）：

1. 用可調式自我確保繩扣上固定點（[3:26](https://www.youtube.com/watch?v=fMlxmDCie0s&t=206s)）。
2. 先解開、先穿**領攀者那條繩**的繩尾（[3:45](https://www.youtube.com/watch?v=fMlxmDCie0s&t=225s)）。理由是跟攀者的繩尾在繩堆最上面，丟繩時繩子比較順，不會亂成一團。
3. 繩子穿在固定點鉤環的**後方**，最後一人才能邊坐在垂降上邊拆鉤環（[4:36](https://www.youtube.com/watch?v=fMlxmDCie0s&t=276s)）。
4. 用 double overhand 對接，確認兩種顏色交錯，把結拉到固定點（[5:10](https://www.youtube.com/watch?v=fMlxmDCie0s&t=310s)）。
5. 先裝 autoblock、再延伸垂降器（第四步）。
6. 兩端各打止滑結、喊「Rope」、兩股分開丟（[9:58](https://www.youtube.com/watch?v=fMlxmDCie0s&t=598s)）。
7. 負重測試，自我確保的鉤環扣在要拉的那一股當記號（第五步）。

**跟方式一不一樣的地方**：

- **對接結**：四股分別拉緊、尾巴至少 30 cm，各家分歧見第二步。
- **拉結所在的那一側**：拉錯邊，結會被拉向垂降環而卡住。
- **兩條繩粗細不同**：Petzl 建議 flat overhand 再加一個止滑結，UIAA 改用 double fisherman；差很多時，見方式三的「繩結移位」。

**最常見的致命錯誤**：垂降器只扣到一股，例如 Stanley Headwall 那起；把對接結的長尾巴當成主繩扣進垂降器。

IFMGA 國際高山嚮導 Dave Searle 這支 2024 年的影片，從 7:52 起示範 flat overhand 怎麼打。兩條繩平行、整理乾淨、四股分別拉緊，再用手腕到手肘的長度量出約 30 cm 的尾巴。他在 10:42 說加了第二個結尾巴可以短一點，這跟 Petzl、UIAA 的要求不同，不要照做。片頭推廣他自己開發的 app，他也是 Rab 的贊助運動員。

```youtube
url: https://www.youtube.com/watch?v=ykzmVwFrVLM
title: Connecting Ropes for Climbing and Mountaineering（Dave Searle，2024）
start: 472
```

AAC 2026 年這支短片接著 Stanley Headwall 事故講對策：IFMGA／AMGA 嚮導 Jason Antin 從 0:35 起示範疊式垂降。兩人都先在固定點架好垂降器，出發前用 HAD 互檢：吊帶（Harness）、固定點（Anchor）、垂降器（Device）。重點是兩股繩都穿過垂降器、鉤環已鎖。

```youtube
url: https://www.youtube.com/watch?v=dkPNdMKzlSg
title: The Prescription | Stacked Rappel（American Alpine Club，2026）
start: 35
```

補充兩支：JB Mountain Skills 2025 年的影片 [0:18](https://www.youtube.com/watch?v=1SGEoyW2aR8&t=18s) 起故意示範錯誤做法，尾巴留太長、把垂降器扣在尾巴上，[1:54](https://www.youtube.com/watch?v=1SGEoyW2aR8&t=114s) 起才講正確的尾巴長度。DMM 2022 年的影片由英國登山教練協會（AMI）教練 Alice Kerr 示範，[4:35](https://www.youtube.com/watch?v=p6uJIg4fL5k&t=275s) 起是疊式垂降；片中尾巴留約 60 cm，比本文的 30 cm 長。

**今晚就能做的動作**：拿兩條不同顏色的繩子打一次 flat overhand，確認顏色平行不交叉，再決定要拉哪一側，用鉤環在那股上做記號。

## 方式三：單繩加細拉繩

只帶一條主繩，又要下超過半條繩長時，加一條 5–6 mm 的細繩接在主繩上，到底後用細繩把主繩拉下來。省重量，但做法分好幾派，而且 2026 年發生過一起死亡事故。

**擋繩派：只垂降在主繩上**。[Petzl〈Multi-pitch rappelling with a single rope〉](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)的做法：

1. 主繩穿過垂降環，在環的一側打一個比環大的結，把主繩擋住。
2. 用有鎖鉤環把結扣回受力的那股主繩。Petzl 寫明一律要加，因為就算看起來卡住了，結還是可能穿過環。
3. 細繩接在擋繩那一側，只用來拉，**絕不垂降在細繩上**。
4. 垂降器只裝在結對面那股主繩。用 REVERSO 時，細繩穿過第二個繩槽，目的是把它帶在身上。

Petzl 也列出缺點。擋繩的結和鉤環比較容易卡繩。主繩卡在搆不到的地方時，手上只剩細繩，沒辦法拿來確保自己爬回去。每一段都要把整條繩重新穿過，不適合連續很多段。[紐西蘭 Alpine Team 2013 年](https://alpineteam.co.nz/post/abseiling-with-a-single-rope-plus-tag-line)也這樣教，理由是 6 mm 細繩太細，不適合直接垂降。

**兩股派：兩股都進管狀垂降器**。山岳嚮導 Chris Semmel 在 [bergundsteigen](https://www.bergundsteigen.com/en/artikel/alpinhacks-abseilen-mit-hilfsleinen-rad-line-co/)寫的做法：

1. 主繩和細繩用一個 flat overhand 接起來，尾巴 30 cm，不要連打兩個。
2. **結放在細繩那一側，抵住垂降環**。
3. 兩股都放進管狀垂降器，下方多扣一個鉤環增加摩擦。
4. 到底後拉細繩，粗繩會自己掉下來，比較不容易卡。

[Beal 2026 年的 Back Up Line 說明書](https://www.beal-planet.com/cdn/shop/files/BEAL_-_XNOTICE.BACK_UP_202607_-_Notice_livret_100x100.pdf)也允許主繩和 5.5 mm 的 Back Up Line 兩股一起垂降，搭配 Beal 的 AIRFORCE 3 垂降器與 5 mm 的 Machard 摩擦套結。

**為什麼結要放在細繩那一側：繩結移位**。細繩在垂降器裡的摩擦比粗繩小，下降時細繩跑得比較快，對接結會慢慢被拉離垂降環，細繩那一端越來越短。[Climbing 2026 年 9 月的報導](https://climbing.com/videos/death-of-27-year-old-climber-exposes-danger-of-knot-migration-during-rappel)記錄了同年 7 月在挪威的一起死亡事故：兩人都用 ATC 兩股一起垂降，結一路移位，細繩尾端穿出垂降器，攀登者墜落身亡。報導指出，如果中點放在粗繩那側，結很可能會被固定點擋住。

**拉粗繩派是少數做法**。紐西蘭 Alpine Team 的 IFMGA 嚮導 Kim Ladiges 在[影片 0:37 起](https://www.youtube.com/watch?v=lC1PIOGWsZM&t=37s)說，難拉的時候他會拉粗繩，出問題時手上才有動力繩可以處理。前提是第二人先把垂降器預掛在兩股上，第一人到底後垂降器留在繩上，或把繩尾固定在站上。同一篇 Climbing 報導裡，英國 IFMGA 嚮導 Calum Muskett 把「中點放在細繩、拉粗繩」稱為本質上不安全，建議一律固定粗繩、用細繩回收。

**卡繩的代價比較高**：[Climbing 報導的 2026 年 Pingora 事件](https://climbing.com/news/a-climber-and-his-rescuer-share-takeaways-after-getting-benighted-on-pingora-peak)，攀登者用 4 mm 細繩拉主繩，主繩卡住了。手上只剩靜力細繩，不能拿來先鋒爬回去，最後在岩壁上過夜等救援。

職業阿爾卑斯式攀登者 Colin Haley 這支 2026 年的影片，2:52 起解釋繩結移位怎麼發生，3:53 起說他幾乎都拉細繩。4:58 起是他的混合做法：在粗繩上用雙套結扣一個有鎖鉤環，擋在環上；說明欄補充，他照樣把兩股都放進垂降器。他打兩個對接結，這點 bergundsteigen 明確反對。Haley 不是認證嚮導；他網站上列 Petzl 為主要贊助商，片中用的細繩是 Petzl 的，影片沒有揭露這層關係。

```youtube
url: https://www.youtube.com/watch?v=xQWcuY6lv0o
title: Rappelling with Ropes of Very Different Diameters（Colin Haley，2026）
start: 172
```

紐西蘭 Alpine Team 這支 2026 年的影片是拉粗繩派的完整示範，從 0:22 看起。一定要看到 2:26–2:50：第一人到底後要讓垂降器留在繩上，或把繩尾固定在站上，不然第二人那股會滑。只看前半段會漏掉這個前提。

```youtube
url: https://www.youtube.com/watch?v=lC1PIOGWsZM
title: How to rappel with a tagline（New Zealand Alpine Team，2026）
start: 22
```

**選哪一派**：預設照擋繩派或兩股派，結放在細繩側、拉細繩；拉粗繩只在兩人都熟練、能做到預掛與鎖住繩尾時用。不管哪一派，都要先在地面或練習場練過，不要現場混用。

**今晚就能做的動作**：拿你的主繩和細繩比一比粗細，查兩者的說明書允不允許一起垂降。

## 方式四：GRIGRI 單股垂降（擋繩）

GRIGRI 這類輔助制動器只能垂降單股。[Petzl〈Rappelling with GRIGRI and NEOX〉](https://petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX?ProductName=GRIGRI)寫得很清楚：可以在擋住一股的可回收系統上垂降，也可以在固定繩上垂降。[單繩多繩距垂降那篇](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)則寫明，GRIGRI 不能像管狀垂降器那樣兩股一起下。單股垂降的好處是半條繩長以上也能一次下完，壞處是只要裝錯股就會直接墜落。

**步驟**（依 Petzl 技術頁與 2024 年 11 月版 GRIGRI 說明書）：

1. 繩子穿過垂降環，在**不垂降的那一股**打擋繩結，結要比環大。
2. 用有鎖鉤環把結扣回垂降的那股。萬一結穿過環，鉤環會把繩子擋住。
3. 超過半條繩長時接上細拉繩（方式三），兩端繩尾都打結。
4. GRIGRI 只裝在**擋繩結對面的那股**，也就是被擋住、固定的那股；照機身標示確認方向，裝反了制動不會作用。拉繩用快扣扣在確保環上。
5. 還連著自我確保時，全身坐上 GRIGRI，確認鎖得住、裝在對的那股，才解開自我確保。
6. 下降時**制動手一直握住制動端**，另一手慢慢拉把手。Petzl 的原話是：把手幫忙調整摩擦，控制下降的是握住制動端的那隻手。需要空出雙手時，在制動端靠近 GRIGRI 的地方打一個結。
7. 到底後拉另一股收繩。

GRIGRI 的適用繩徑是 8.5–11 mm；Petzl 提醒 8.9 mm 以下的細繩垂降時比較難控制。

**最常見的致命錯誤：裝錯股，或那一股根本沒擋住**。AAC 2026 年版事故報告收了三起，其中 Red Rock 那起致死：

- **[Red Rock 死亡事故（2025）](https://publications.americanalpineclub.org/articles/13201217659)**：GRIGRI 裝在拉繩那一股，一受力，繩子直接從固定點被拉過去，她從夥伴身旁墜落。當時日落後、天冷、趕時間。AAC 的結論是條件變差、壓力變大時，正確的反應是放慢。
- **[Psycho Tower 險情（2025）](https://publications.americanalpineclub.org/articles/13201217645)**：當事人自述把拉繩那股裝進 GRIGRI+，只用手拉了一下，覺得有阻力就解開自我確保。他往後一倒就墜落，抓住垂著的繩尾才停下。他的教訓是：拉一下不算測試，要全身坐上去；固定點在腰的高度、下面有平台時，最容易偷懶跳過。
- **[Palisades 事故（2024）](https://publications.americanalpineclub.org/articles/13201217622)**：一名約 11 歲的孩子用 ATC 單股垂降，那一股根本沒固定，下方的消防員確保也擋不住整條繩被拉過固定點。AAC 說，只要一個結直接扣在固定點上就能避免。

Petzl 另外提醒兩件事：下方用力拉制動端，可能讓 GRIGRI 解鎖；排隊時預先裝在繩上的 GRIGRI，可能被下面垂降者的重量翻轉而解鎖。

Petzl 官方 2025 年這支短片沒有旁白，要看畫面。0:22 起打擋繩結，0:30 起用有鎖鉤環扣回主繩，0:38 起裝 GRIGRI，1:02 前後解開自我確保，1:08 起出發。1:28 前後可以看到結和鉤環擋在垂降環上。這支片也嵌在 [Petzl〈Multi-pitch rappelling with a single rope〉](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)技術頁裡。

```youtube
url: https://www.youtube.com/watch?v=UUrPgAP1mfw
title: #Petzltips - Rappelling with a single rope and a pull cord（Petzl，2025）
start: 22
```

Edelrid 這支 2025 年的單繩多繩距教學用的是自家的輔助制動器 PINCH，不是 GRIGRI，但擋繩做法相同。7:19 起示範八字結擋在環上、鉤環扣回受力股，坐上去檢查後才解開自我確保。9:45 起是個好提醒：垂降環太大時，八字結會直接穿過環，他們改用雙套結加有鎖鉤環。這是廠商頻道，說明欄列的都是自家產品。

```youtube
url: https://www.youtube.com/watch?v=aDVjeWyhXpE
title: Single Rope Multi-Pitch Climbing – Our Favorite Setup & Tips（EDELRID，2025）
start: 439
```

目前沒有找到清楚拍出「一手拉把手、一手握制動端」的影片，這一點以 Petzl 說明書的文字為準。

**今晚就能做的動作**：在家用 GRIGRI 和一段繩子，練習先指出「哪一股被擋住」，再把 GRIGRI 裝上那股，大聲念一次。

## 方式五：固定單繩垂降（管狀垂降器）

繩子一端直接綁死在固定點，只垂降那一股，繩子不回收。架工作繩、從上方下到海崖起攀點、頂繩自我確保之後下來，都會用到。

**廠商怎麼說**：三家都沒有禁止管狀垂降器單股垂降，但都要求加摩擦或備份。

- [Black Diamond ATC-Guide 說明書](https://s3.us-west-2.amazonaws.com/catsy.865/M10798_D_ATC-Guide_IS-WEB.pdf)：單股垂降時建議用高摩擦模式。
- [Petzl](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)：REVERSO 可以單股垂降，但要加備份（備份裝置或摩擦套結）。
- [Edelrid GIGA JUL 說明書](https://avs.edelrid.com/images/attribut/5XXXX_GAL_GIGAJUL_ANSICHT.pdf)：沒有特別講單股；所有垂降都要繩尾打結，並加摩擦套結備份。

**摩擦會越來越小**：單股的摩擦本來就比雙股小。AAC 收錄的 [1986 年 Sedona 事故](https://publications.americanalpineclub.org/articles/13198703202)指出，下方垂著的繩子越短，摩擦越小：一開始覺得太緊，接近底部時就太快。增加摩擦的方法由弱到強是：再並排扣一個鉤環、用鉤環扣住垂降器的 guide 孔往後壓、在垂降器下方繞成 Z 字再扣回去。全部都要先在地面試，加太多會卡死。

**最常見的致命錯誤：以為繩子固定了，其實沒有**：

- [2022 年 Auburn 死亡事故](https://publications.americanalpineclub.org/articles/13201216604)：頂繩自我確保之後改成垂降。繩子已經從固定點解開，她只穿了一股就下去；目擊者認為，她可能以為繩子還綁著。
- [2023 年 Vermont 事故](https://publications.americanalpineclub.org/articles/13201217172)：垂降器扣在固定繩八字結的長尾上，滑墜約 30 m。
- [2019 年 Red River Gorge 事故](https://publications.americanalpineclub.org/articles/13201215612)：垂降器被裝成低摩擦那一面，autoblock 有作用但部分鬆脫，可能是被制動手抓住了。AAC 的結論是：單股垂降比雙股需要更多摩擦，也更要注意備份。

Short Guys Beta Works 這支 2026 年的影片示範三種加摩擦的方法，由強到弱。0:57 起是垂降器下方的 Z 字繞繩，2:40 起用鉤環扣住 guide 孔把垂降器往後壓，3:26 起並排第二個鉤環。1:37 起他提醒，Z 字繞繩不要扣在腿環上，人翻過去時會失效。主講者 Jason 在科羅拉多登山會教了多年，沒有查到嚮導認證，說明欄聲明可能有聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=yAUSU27gvTc
title: Heavy Load or Icy- or Thin-Line Rappels Need This Friction Hack（Short Guys Beta Works，2026）
start: 57
```

HowNOT2 2025 年這支主題是 5 mm 細繩，5:50 起有一段用 ATC 單股垂降，在腿環上繞 Z 字增加摩擦，並量出固定點的受力。它把 Z 字扣在腿環上，正好跟上一支的提醒相反；兩支對照看，就知道這個做法有爭議。HowNOT2 自營器材店，片中測試的繩子在店裡有賣。

```youtube
url: https://www.youtube.com/watch?v=TuqUlkAQvBI
title: Rappelling on 5mm?（HowNOT2，2025）
start: 350
```

**今晚就能做的動作**：翻出你的垂降器說明書，找到「單股」或「single rope」那一段，記下它要求的模式與備份。

## 方式六：沒有垂降器：Munter 與鉤環制動

垂降器掉了，或忘了帶，還有兩個辦法：Munter（義大利半扣），或用幾個鉤環組成制動。兩者都是備案，不是平常的垂降方式。

### Munter（義大利半扣）垂降

- **鉤環**：大型梨形（HMS）有鎖鉤環，**直接掛確保環，不要延伸**。[The Mountaineers 整理的 AMGA 單繩距教練課程做法](https://mountaineers.org/blog/extended-rappel-and-updated-belay-techniques)寫明，延伸垂降不適用 Munter。
- **制動端放在鉤環背脊那一側**：放在開口那側，繩子會磨到鎖環，可能把鎖轉開。
- **制動手往上摩擦最大**：Munter 在兩股平行時摩擦最大，跟 ATC 的制動手往下相反。制動端放到腰側，摩擦約少 25%，多數情況仍夠用（[Alpine Savvy](https://alpinesavvy.com/bonus-articles/munter-hitch-brake-strand-does-it-need-to-be-parallel)）。[HowNOT2 2021 年的影片 4:02](https://www.youtube.com/watch?v=BshgXXn4UEk&t=242s)特別點出這個差別。
- **一定加摩擦套結備份**。
- **會扭繩**：扭過的繩子拉繩時可能卡在固定點。[bergundsteigen 2022 年](https://www.bergundsteigen.com/artikel/alpinhacks-abseilgeraet-runtergefallen-3-0/)介紹瑞士阿爾卑斯協會教材裡的防扭做法，並建議課程採用。

**事故**：[AAC 收錄的 2024 年 Ouray 事故](https://publications.americanalpineclub.org/articles/13201217271)，當事人選擇不加 prusik，讓下方夥伴拉繩保護。下降中他轉身看腳下，Munter 往鉤環開口那側移，繩子滾過開口、把鎖轉開，從鉤環脫出。他自由墜落約 24 m，因為一直沒放開制動端才停住。他事後的結論是：再用 Munter 垂降，就換雙重開口或自動鎖的鉤環。[Petzl](https://petzl.com/US/en/Sport/Examples-of-dangerous-carabiner-loading-) 也指出，繩子或岩石摩擦可能轉開鎖環、推開鉤環開口。

JB Mountain Skills 這支 2024 年的影片從 13:45 起示範兩股 Munter 垂降，並在制動端加 prusik。他認為扭繩問題沒有網路上說的那麼嚴重，但連續多段垂降時，他寧可用鉤環制動。主講者 Jez 是北威爾斯的合格攀岩與登山教練，他的網站列器材店 Outside 為支持者。

```youtube
url: https://www.youtube.com/watch?v=mfIJVgtFsKM
title: Munter Hitch / Italian Hitch（JB Mountain Skills，2024）
start: 825
```

另一支可以對照的是 [Short Guys Beta Works 2026 年的 Munter 深入介紹 11:14 起](https://www.youtube.com/watch?v=hbJ1kS0avX4&t=674s)，講為什麼不延伸，以及制動端放在開口側為什麼會轉開鎖。

### 鉤環制動

用三個有鎖鉤環組成制動（做法照 [Alpine Savvy](https://alpinesavvy.com/blog/a-slick-carabiner-rappel-brake) 與 [bergundsteigen 2021 年](https://www.bergundsteigen.com/artikel/alpinhack-abseilen-ohne-abseilgeraet/)）：

1. 第一個有鎖鉤環扣在延伸扁帶上。
2. 第二個有鎖鉤環扣在第一個上。
3. 兩股繩對折成一個繩圈，穿過第二個鉤環。
4. 第三個有鎖鉤環扣進這個繩圈，再扣到往上通往固定點的那兩股繩上，當作制動桿。
5. 全部上鎖，加摩擦套結備份。

扭繩比 Munter 少得多，但有三個風險。bergundsteigen 提醒，系統卸力時鉤環可能滑動、轉向，制動力大減，例如腳踩到平台時。Alpine Savvy 說它的摩擦比垂降器小，適合不太陡的地形。拆的時候也很容易掉鉤環。

奧地利 AlpenAcademy 2024 年這支德文影片從 9:27 起示範三個鉤環的制動，邊下邊推 prusik，也直說這比用管狀垂降器顛簸很多。說明欄有贊助平台與購物聯盟連結。英文版可以看 [Outdoor Research 2018 年由 AMGA 教練示範的影片 3:24 起](https://www.youtube.com/watch?v=VjWzxRJ9vtk&t=204s)，同一支片 2:27 起也有 Munter 的制動端放法。

```youtube
url: https://www.youtube.com/watch?v=zql0JvL3sAI
title: Vom Standplatz zum Abseilen（AlpenAcademy，2024）
start: 567
```

### 不要用：身體垂降

不用任何器材，把繩子繞過臀部和肩膀，靠身體摩擦下降。這種方法一直用到 1970 年代。[SAC 1994 年的文章](https://www.sac-cas.ch/de/die-alpen/abseilen-kein-problem-12767/)形容它操作棘手、容易出錯，因為坐姿和制動全靠繞在臀部和肩膀上的繩子跟身體的摩擦。它還會磨破褲子、燒傷皮膚，制動手一鬆就墜落。

下面這支 2020 年的影片，主講者一開頭就說這些方法嚴重過時、會痛，也不太安全；6:11 起他說，真的沒器材時寧可原地等救援。放這支是讓你認得它，不是要你學。

```youtube
url: https://www.youtube.com/watch?v=CLQ0IltdYd0
title: Two Methods to Rappel with ONLY a Rope（Ascentionism，2020）
start: 26
```

**今晚就能做的動作**：檢查你的吊帶上有沒有一個大的梨形有鎖鉤環。沒有的話，下次多帶一個，它就是你掉了垂降器時的備案。

## 方式七：八字環

八字環是管狀垂降器普及前的標準垂降器，現在攀岩課程大多已改教管狀垂降器，溪降與救援還在用。[bergundsteigen 2012 年](https://www.bergundsteigen.com/magazinartikel/abgeseilt/)寫道，八字環優點少、缺點多，已經從教學和教科書裡消失。

**最大的風險：撬開鉤環**。八字環可能橫卡在鉤環開口上，一受力就把鎖好的鉤環撬開。[BMC](https://www.thebmc.co.uk/en/abseiling-do-you-know-the-risks)說這已造成至少一起死亡和多起重傷。[UIAA 2000 年的分析](http://theuiaa.org/documents/safety/Karabiner_Breakings_when_using_a_Figure-of-eight.pdf)記錄了 1996 年英國一名學員從 40 m 高的橋上垂降，八字環撬開鉤環致死，並指出鎖環本來就不是設計來抵抗這種槓桿力。對策是每次受力前，確認八字環沒有卡在開口上。DMM 的[垂降器說明書](https://assets.dmmwales.com/download/73/)建議搭配 Belay Master 這類能固定方向的鉤環；德國阿爾卑斯協會安全研究的 Pit Schubert [1997 年](https://www.sac-cas.ch/de/die-alpen/schwachstelle-bei-karabinern-mit-verschluss-sicherung-14092/)則建議用兩個並排、開口反向的鉤環。

**其他缺點**：摩擦要出發前就決定好，下到一半很難再加（[Petzl HUIT 技術頁](https://petzl.com/US/en/Sport/Friction-modes-and-tie-offs-for-the-HUIT?ActivityName=canyoning)）；兩股一起穿時容易扭繩，扭轉進到八字環會卡住，拉繩也比較難。

這支 2022 年的溪降教學示範八字環的幾種穿法，1:08 起是攀岩傳統的穿法，接著示範怎麼加鉤環增加摩擦。主講者自述是法國阿爾卑斯的專業溪降嚮導，沒有查到認證機構。HowNOT2 的溪降入門片也談到這段歷史：[15:05 起](https://www.youtube.com/watch?v=JwSJrWQnNrA&t=905s)講溪降垂降器是從八字環演變來的，八字環下到一半沒辦法加摩擦。

```youtube
url: https://www.youtube.com/watch?v=EM2XS8x0VKo
title: 6 ways to rappel like a pro using the figure 8（Sven Van Cleemput，2022）
start: 68
```

**今晚就能做的動作**：如果你家裡有八字環，把它扣上鉤環，故意讓它卡在開口上，看清楚錯誤的樣子長什麼樣，以後一眼就認得出來。

## 認得就好，不要自己試：同時垂降與救援用的垂降

下面這幾種都是「兩個人一起下」，名稱又常被混用，先分清楚：

| 名稱 | 怎麼掛 | 誰控制速度 | 用途 |
|---|---|---|---|
| 同時垂降（simul-rappel） | 兩人各在穿過固定點的繩子一端，互相當配重 | 各自控制 | 想省時間；多數專業來源建議只在緊急時用 |
| 兩人共用垂降器（tandem） | 救援者和傷者用延伸扁帶掛在同一個垂降器上 | 只有救援者 | 帶受傷的夥伴下去 |
| 配重垂降（counterbalance rappel） | 救援者垂降一股，傷者掛在另一股當配重 | 只有救援者 | 從確保站下到傷者身邊 |
| 配重上升 | 救援者往上，傷者在另一端被當配重 | 救援者 | 先鋒墜落後要上去接近傷者 |

有些文章和影片把同時垂降也叫 counterbalance rappel。AMGA 嚮導 Ryan Tilley 則只把「一人控制、另一端是傷者」稱為配重垂降，本文採用他的分法。

### 同時垂降

一人卸力或垂降出繩尾，另一人就跟著掉。[AAC 的說法](https://americanalpineclub.org/news/2018/11/30/simul-rappelling)是：兩人互相依賴，任何一方失控、架錯，或任一股繩被割斷，兩人都會承擔後果。[2019 年 Brad Gobright 在墨西哥 El Potrero Chico 身亡](https://publications.americanalpineclub.org/articles/13201215647)，就是同時垂降時他那端的繩子太短、沒打繩尾結，從繩尾滑出。AAC 認為如果有打止滑結，這起事故很可能不會發生。[Gripped 2020 年](https://gripped.com/profiles/simul-rappelling-is-dangerous-go-one-at-a-time/)的立場是只在緊急狀況使用，而且兩人同時到站其實更慢。American Alpine Institute 的影片 [3:04 起](https://www.youtube.com/watch?v=ricHt4aPJVk&t=184s)提到，AMGA 技術總監大致的意思是不要教；講者自己的建議是不要做，也不要教。

Outdoor Research 2018 年這支由 IFMGA 嚮導 Dale Remsberg 和 Olivia Race 示範，就是 Gripped 文章附的影片。2:13 起 Race 說明：只要對方垂降出繩尾，她就失去配重，兩人一起掉下去。整支片也讓你看到，要把同時垂降做得安全有多麻煩。

```youtube
url: https://www.youtube.com/watch?v=y_bHtt9iWPA
title: How to Set Up a Simul-Rappel（Outdoor Research，2018）
start: 133
```

### 兩人共用垂降器、配重垂降與配重上升

這三種都是救援技術：夥伴受傷、需要把人帶下去時才用。[Climbing 2023 年的〈Buddy Rappel〉](https://www.climbing.com/skills/rappel-with-injured-partner/)提醒，共用垂降器下降時不要錯過下一站，因為掛著兩個人沒辦法爬回去。它也說，當下最安全的決定可能是求援、原地等待。[bergundsteigen 2025 年的嚮導救援系列](https://www.bergundsteigen.com/artikel/bergfuehrerserie-behelfsmaessige-kameradenrettung/)建議先在接近地面、有可靠固定點（例如錨栓）的地方反覆練習。配重上升會讓救援者和傷者的體重同時壓在最後一個接住墜落的保護點上；[Climbing 2019 年](https://www.climbing.com/skills/multi-pitch-911-escape-the-belay)的建議是，那個保護點不可靠，就考慮等待救援。

IFMGA 嚮導、AMGA 董事 Eddie Schoen 這支 2025 年的影片，情境是夥伴昏迷、掛在中間站上。3:36 起示範怎麼把傷者的重量慢慢轉移到共用垂降器上。

```youtube
url: https://www.youtube.com/watch?v=oUIGGHazDFM
title: Transition To Tandem Rappel（Eddie Schoen，2025）
start: 1
```

開設 AMGA 單繩距教練課程、嚮導持 AMGA 認證的 Smile Mountain Guides，這支 2025 年的影片，0:18 起示範從確保站轉成配重垂降，開頭就說先加保護、再拆保護。片中主講者也承認這套流程很複雜。配重上升的風險，可以看 AMGA 攀岩嚮導 Glen Young 2024 年影片的 [5:58 起](https://www.youtube.com/watch?v=CCSczBIY63U&t=358s)，他說會盡一切可能避免配重上升。

```youtube
url: https://www.youtube.com/watch?v=V7LWnJEPgPU
title: Counter-Balanced Rappel Transition（Smile Mountain Guides，2025）
start: 18
```

這些技術怎麼判斷、該不該用，見[自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)；操作要在課程裡學。

**今晚就能做的動作**：跟你的固定繩伴約好：任何人提議同時垂降，另一個人都可以直接說不。

## 練習題：六個情境

答案在每題下方，先自己想再看。想練更多題，可以玩 [nobodyclimb 的繩索系統練習：垂降](https://nobodyclimb.cc/games/rope-system/learn/sport-rappel)。

**1. 你在懸吊的確保站，沒有平台，兩條繩的重量全掛在身上。你先裝垂降器還是先裝摩擦套結？**

<details><summary>答案</summary>

先裝摩擦套結。autoblock 可以直接繞在繃緊的繩上，裝好後往上拉一段鬆繩，繩重由它吃住，你就有鬆繩可以從容裝垂降器。這是 Centa 片中（7:27 起）和 DAV 都建議的順序。

</details>

**2. 垂降器、autoblock 都裝好，夥伴說「看起來沒問題」，你準備解開自我確保。還差什麼？**

<details><summary>答案</summary>

負重測試。把自我確保繩放長，讓體重坐到垂降系統上、自我確保繩變鬆，再逐項檢查：兩股繩都穿過垂降器、鉤環鎖上、autoblock 抓得住、沒碰到垂降器。「看起來」不算。DAV 分析的兩起事故，都是解開自我確保之後，系統才第一次受力。

</details>

**3. 你是第一個下到下一站的人。扣好站之後，你馬上把繩子從垂降器拿出來，開始穿下一站。這樣有什麼問題？**

<details><summary>答案</summary>

不一定錯，但可以更保守。YOSAR 的做法是垂降器先留在繩上，等第二人也到站扣好才拿下來；Petzl 則要求把兩股繩扣在固定點上，避免繩子掉下去。不管用哪一種，都要確保繩子不會在第二人下來之前整條掉下山壁。

</details>

**4. 拉繩拉到一半卡住了。你手上只剩一端，另一端卡在上面。你想在這一端上打 prusik 爬上去。**

<details><summary>答案</summary>

不行。BMC 明確提醒，不要用 prusik 只爬單股繩，卡住的那端隨時可能鬆脫。手上只剩一端時，通常要用這一端當先鋒保護攀回去，這屬於自我救援，需要上過課。下次預防的方式是：拉繩前確認結的位置、慢慢拉、繩尾快穿過時往外甩。

</details>

**5. 你用 GRIGRI 單股垂降。繩子穿過垂降環，一側打了擋繩結、扣好鉤環。GRIGRI 要裝在哪一股？**

<details><summary>答案</summary>

裝在擋繩結**對面**那股，也就是被擋住、固定的那股。另一股是拉繩，裝在那股上，一受力繩子就會整條從環裡被拉過去。AAC 收錄的 2025 年 Red Rock 死亡事故就是這樣。裝好之後還連著自我確保，全身坐上去測試，拉一下不算。

</details>

**6. 你帶一條 9.5 mm 主繩和一條 6 mm 細繩，打算兩股一起放進 ATC 垂降。對接結要放在哪一側、拉哪一條？**

<details><summary>答案</summary>

照 bergundsteigen 的做法，結放在細繩那一側、抵住垂降環，到底後拉細繩。細繩在垂降器裡跑得比較快，結如果在粗繩那側，就會慢慢被拉離垂降環，細繩那端越來越短，最後可能從垂降器滑出。2026 年挪威的死亡事故就是這樣發生的。垂降器下方再多扣一個鉤環，補細繩不足的摩擦。

</details>

## 下一步

運攀與傳攀的下降方式到這裡講完。下一篇是[難度與保護評等](/posts/climbing/2026-10-17-grades-and-protection-ratings)：5.10a、6a、E1 5b、R／X 各在說什麼，接著進入傳統攀登。

多繩距的完整流程，見[多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)；出狀況時的選項，見[自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)。

## 更新紀錄

- 2026-10-24：新增「垂降有哪幾種方式」總覽表與七種方式各自的段落，加上同時垂降與救援用垂降的分界。每種方式都附示範影片、專業來源與事故；練習題增為六題

## 參考資料

依機構分組。同一主題各家有不同做法時，正文已並列。

**影片**

- [How to rappel/abseil - safely AND efficiently（Charlie Centa，2026-08）](https://www.youtube.com/watch?v=fMlxmDCie0s)
- [Which is the real DEATH knot?（HowNOT2，與 IFMGA 嚮導 Ian Nicholson，2026-04）](https://www.youtube.com/watch?v=rDkLXs-vfuI)
- [Would you rappel on this?（HowNOT2，2024-03）](https://www.youtube.com/watch?v=IpJtTRmg7Og)
- [Rappelling Wizards - Intro to Canyoning（HowNOT2，2024-01）](https://www.youtube.com/watch?v=JwSJrWQnNrA)
- [Rappelling: Learn the Basics（Travis Weil，AMGA 認證嚮導，2025-10）](https://www.youtube.com/watch?v=w6a0SCc3iAI)
- [5 Rappelling Best Practices to Keep You Safe（Travis Weil，2025-09）](https://www.youtube.com/watch?v=qkbxXGYfGMk)
- [Full Masterclass: Multi Pitch Rappelling（Mike Vert，2026-08）](https://www.youtube.com/watch?v=_C0HXDiGbls)
- [Cleaning Top Rope Anchors（AMGA，Dale Remsberg，2025-06）](https://www.youtube.com/watch?v=MKfPKYSW7iE)
- [Connecting Ropes for Climbing and Mountaineering（Dave Searle，IFMGA，2024-08）](https://www.youtube.com/watch?v=ykzmVwFrVLM)
- [The Prescription | Stacked Rappel（American Alpine Club，2026-01）](https://www.youtube.com/watch?v=dkPNdMKzlSg)
- [How to join two ropes the right way（JB Mountain Skills，2025-07）](https://www.youtube.com/watch?v=1SGEoyW2aR8)
- [Learning to Trad Climb: Part 5 - How to abseil/rappel（DMM，2022-08）](https://www.youtube.com/watch?v=p6uJIg4fL5k)
- [Rappelling with Ropes of Very Different Diameters（Colin Haley，2026-08）](https://www.youtube.com/watch?v=xQWcuY6lv0o)
- [How to rappel with a tagline（New Zealand Alpine Team，IFMGA 嚮導 Kim Ladiges，2026-10）](https://www.youtube.com/watch?v=lC1PIOGWsZM)
- [#Petzltips - Rappelling with a single rope and a pull cord（Petzl，2025-08）](https://www.youtube.com/watch?v=UUrPgAP1mfw)
- [Single Rope Multi-Pitch Climbing（EDELRID，2025-09）](https://www.youtube.com/watch?v=aDVjeWyhXpE)
- [Heavy Load or Icy- or Thin-Line Rappels Need This Friction Hack（Short Guys Beta Works，2026-08）](https://www.youtube.com/watch?v=yAUSU27gvTc)
- [Rappelling on 5mm?（HowNOT2，2025-01）](https://www.youtube.com/watch?v=TuqUlkAQvBI)
- [Munter Hitch / Italian Hitch（JB Mountain Skills，2024-04）](https://www.youtube.com/watch?v=mfIJVgtFsKM)
- [Munter Hitch Deep Dive（Short Guys Beta Works，2026-01）](https://www.youtube.com/watch?v=hbJ1kS0avX4)
- [Rappelling Hacks（HowNOT2，2021-12）](https://www.youtube.com/watch?v=BshgXXn4UEk)
- [Vom Standplatz zum Abseilen（AlpenAcademy，2024-10）](https://www.youtube.com/watch?v=zql0JvL3sAI)（德文）
- [How to Set Up an Improvised Rappel（Outdoor Research，AMGA 教練，2018-04）](https://www.youtube.com/watch?v=VjWzxRJ9vtk)
- [Two Methods to Rappel with ONLY a Rope（Ascentionism，2020-07）](https://www.youtube.com/watch?v=CLQ0IltdYd0)
- [6 ways to rappel like a pro using the figure 8（Sven Van Cleemput，2022-11）](https://www.youtube.com/watch?v=EM2XS8x0VKo)
- [How to Set Up a Simul-Rappel（Outdoor Research，IFMGA 嚮導 Dale Remsberg、Olivia Race，2018-05）](https://www.youtube.com/watch?v=y_bHtt9iWPA)
- [Simul-Rappel Technique（American Alpine Institute，2022-10）](https://www.youtube.com/watch?v=ricHt4aPJVk)
- [Transition To Tandem Rappel（Eddie Schoen，IFMGA，2025-10）](https://www.youtube.com/watch?v=oUIGGHazDFM)
- [Counter-Balanced Rappel Transition（Smile Mountain Guides，2025-09）](https://www.youtube.com/watch?v=V7LWnJEPgPU)
- [Leader Rescue for Rock Climbing（Glen Young，AMGA 攀岩嚮導，2024-04）](https://www.youtube.com/watch?v=CCSczBIY63U)

**器材廠商**

- [Petzl：Rappelling](https://petzl.com/int/en/sport/tech-tips/basic-techniques/rappelling/escalade-grde-voie-rappel_SPO_a77w0000000KypxAAC.html)
- [Petzl：Knot for joining rappel ropes](https://petzl.com/INT/en/Sport/Knot-for-joining-rappel-ropes)
- [Petzl：Multi-pitch rappelling with a single rope](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)
- [Petzl：Rappelling with GRIGRI and NEOX](https://petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX?ProductName=GRIGRI)
- [Edelrid：Knots for connecting ropes when rappelling – a comparison](https://edelrid.com/int-en/knowledge/knowledge-base/knots-for-connecting-ropes-when-rappelling-comparison)
- [Edelrid：GIGA JUL 使用說明書](https://avs.edelrid.com/images/attribut/5XXXX_GAL_GIGAJUL_ANSICHT.pdf)
- [Black Diamond：ATC-Guide 使用說明書](https://s3.us-west-2.amazonaws.com/catsy.865/M10798_D_ATC-Guide_IS-WEB.pdf)
- [Beal：Back Up Line 使用說明書（2026）](https://www.beal-planet.com/cdn/shop/files/BEAL_-_XNOTICE.BACK_UP_202607_-_Notice_livret_100x100.pdf)
- [Petzl：Friction modes and tie-offs for the HUIT](https://petzl.com/US/en/Sport/Friction-modes-and-tie-offs-for-the-HUIT?ActivityName=canyoning)

**國際與各國登山組織**

- [UIAA：Alpine Skills: Which knot to use to join two ropes（2019）](https://theuiaa.org/mountaineering/alpine-skills-which-knot-to-use-to-join-two-ropes)
- [BMC：How to abseil](https://thebmc.co.uk/en/climb-skills-abseiling)
- [BMC：Alpine skills: 6 tips for multipitch abseiling（Mike Margeson 等）](https://thebmc.co.uk/en/alpine-skills-multipitch-abseiling-tips)
- [BMC：Abseiling: do you know the risks?](http://thebmc.co.uk/en/abseiling-do-you-know-the-risks)
- [DAV：Sicherheitsrelevantes zum Abseilen（Christoph Hummel，2020）](https://alpenverein.de/artikel/klettern-abseilen_c1137d30-6bc6-436a-9c7c-d7660a300a6d)（德文）
- [DAV：Abseilen beim Klettern: Tipps & Tricks（2020）](https://www.alpenverein.de/artikel/abseilen-klettern-tipps_a8187791-6f13-4d2e-a5c6-9d979859eaed)（德文）
- [bergundsteigen：Fehler beim Abseilen: 20 Tipps（Andi Dick，2024）](https://bergundsteigen.com/artikel/fehler-beim-abseilen-20-tipps)（德文）
- [bergundsteigen：Kurzprusik a.D.（Kieselmann、Reinhard，2008）](https://assets.bergundsteigen.com/2021/08/38-41-kurzprusik-ad.pdf)（德文）
- [bergundsteigen：Rappelling with aid lines (Rad Line & Co)（Chris Semmel，2025）](https://www.bergundsteigen.com/en/artikel/alpinhacks-abseilen-mit-hilfsleinen-rad-line-co/)
- [SAC：Abseilen mit oder ohne Selbstsicherung?（2019）](https://www.sac-cas.ch/de/die-alpen/abseilen-mit-oder-ohne-selbstsicherung-15417/)（德文）
- [SAC：Abseilen – kein Problem?（Ueli Mosimann，1994）](https://www.sac-cas.ch/de/die-alpen/abseilen-kein-problem-12767/)（德文）
- [bergundsteigen：Abseilgerät runtergefallen 3.0（2022）](https://www.bergundsteigen.com/artikel/alpinhacks-abseilgeraet-runtergefallen-3-0/)（德文）
- [bergundsteigen：Abseilen ohne Abseilgerät（2021）](https://www.bergundsteigen.com/artikel/alpinhack-abseilen-ohne-abseilgeraet/)（德文）
- [bergundsteigen：abgeseilt（Pit Schubert，2012）](https://www.bergundsteigen.com/magazinartikel/abgeseilt/)（德文）
- [bergundsteigen：Bergführerserie: behelfsmäßige Kameradenrettung（Martin Schmidt，2025）](https://www.bergundsteigen.com/artikel/bergfuehrerserie-behelfsmaessige-kameradenrettung/)（德文）
- [UIAA：Karabiner Breakings when Using a Figure-of-Eight（Neville McMillan，2000）](http://theuiaa.org/documents/safety/Karabiner_Breakings_when_using_a_Figure-of-eight.pdf)
- [Alpine Team NZ：Abseiling with a single rope plus tag line（2013）](https://alpineteam.co.nz/post/abseiling-with-a-single-rope-plus-tag-line)
- [TOCC：龍洞的上方固定點](https://www.tocc-climbing.org/post/%E9%BE%8D%E6%B4%9E%E7%9A%84%E4%B8%8A%E6%96%B9%E5%9B%BA%E5%AE%9A%E9%BB%9E)

**AAC 與事故分析**

- [AAC：Know the Ropes: Rappelling – Fundamentals to Save Your Life（Rob Hess，IFMGA，2012）](https://publications.americanalpineclub.org/articles/13201200200/Know-the-Ropes-Rappelling-Fundamentals-to-Save-Your-Life)
- [AAC：Know the Ropes: Crafty Rappel Techniques（John Godino，2025）](http://publications.americanalpineclub.org/articles/13201217362)
- [AAC：The Prescription—The Stacked Rappel（2026）](https://americanalpineclub.org/news/2026/1/20/the-prescriptionthe-stacked-rappel)
- [Rock and Ice：30 Years of Climbing Accident Data（Eliot Caroom，2020）](https://rockandice.com/climbing-accidents/30-years-of-climbing-accident-data-an-investigative-report)
- [AAC：Simul-Rappelling（2018）](https://americanalpineclub.org/news/2018/11/30/simul-rappelling)
- AAC《Accidents in North American Climbing》事故報告：[Devils Tower（2024）](https://publications.americanalpineclub.org/articles/13201217342)、[Red Rock（2025）](https://publications.americanalpineclub.org/articles/13201217659)、[Psycho Tower（2025）](https://publications.americanalpineclub.org/articles/13201217645)、[Palisades（2024）](https://publications.americanalpineclub.org/articles/13201217622)、[Ouray Munter（2024）](https://publications.americanalpineclub.org/articles/13201217271)、[Auburn（2022）](https://publications.americanalpineclub.org/articles/13201216604)、[Vermont（2023）](https://publications.americanalpineclub.org/articles/13201217172)、[Red River Gorge（2019）](https://publications.americanalpineclub.org/articles/13201215612)、[Sedona（1986）](https://publications.americanalpineclub.org/articles/13198703202)、[El Potrero Chico（2019）](https://publications.americanalpineclub.org/articles/13201215647)
- [Climbing：This Rappel Mistake Can Be Fatal. Why Don't More Climbers Know About It?（2026）](https://climbing.com/videos/death-of-27-year-old-climber-exposes-danger-of-knot-migration-during-rappel)
- [Climbing：A climber and his rescuer share takeaways after getting benighted on Pingora Peak（2026）](https://climbing.com/news/a-climber-and-his-rescuer-share-takeaways-after-getting-benighted-on-pingora-peak)
- [Gripped：Simul-Rappelling is Dangerous, Go One at a Time（2020）](https://gripped.com/profiles/simul-rappelling-is-dangerous-go-one-at-a-time/)

**嚮導撰寫的技術文章**

- [Climbing：Rappelling Is Climbing's Most Dangerous Activity（YOSAR 隊員與優勝美地嚮導，2022）](https://climbing.com/skills/rappelling-best-practices)
- [Climbing：5 Steps for Safer Rappelling（American Alpine Institute 嚮導）](https://climbing.com/skills/5-steps-for-safer-rappelling)
- [Climbing：Six Tips For Safer, More Efficient, Rappelling（Mark Synnott，2022）](https://climbing.com/skills/how-to-rappel-safety-techniques)
- [Climbing：ENSA 測試 Euro Death Knot 與 offset figure-8（2021）](https://climbing.com/skills/how-to-rappel-safely-with-euro-death-knot-offset-figure-8/)
- [Climbing：The Buddy Rappel: Rap Safely With an Injured Partner（2023）](https://www.climbing.com/skills/rappel-with-injured-partner/)
- [Climbing：Multi-Pitch 911: How to Escape the Belay（2019）](https://www.climbing.com/skills/multi-pitch-911-escape-the-belay)
- [Alpine Savvy：A slick carabiner rappel brake](https://alpinesavvy.com/blog/a-slick-carabiner-rappel-brake)
- [The Mountaineers：Extended Rappel and Updated Belay Techniques（AMGA 單繩距教練課程）](https://mountaineers.org/blog/extended-rappel-and-updated-belay-techniques)
- [Rescue Dynamics：BRAKES rappel safety check（Cyril Shokoples，ACMG／IFMGA）](http://rescuedynamics.ca/articles/pdfs/BRAKESRappelAcronym.pdf)

**站內**

- [下放還是垂降](/posts/climbing/2026-10-17-lower-or-rappel)
- [多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)
- [nobodyclimb 繩索系統練習：垂降](https://nobodyclimb.cc/games/rope-system/learn/sport-rappel)
