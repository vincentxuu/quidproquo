---
title: "Stanford CS103 Lecture 11：廣義鴿籠原理、Ramsey Theory 與平均負載"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, graph-theory, pigeonhole-principle, ramsey-theory]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 13
tldr: "以廣義鴿籠原理證明六人派對必有三位共同朋友或共同陌生人，再用平均負載與反證解出電影偏好 puzzle。"
description: "依 Stanford CS103 Graph Theory Part Three 官方投影片，整理廣義鴿籠原理、單色三角形、Ramsey theory 與平均負載證明。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-12-graphs-3-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 13 篇，對應 **Spring 2026 官方 Lecture 11（2026-04-24）**，題目是 **Graph Theory, Part Three**。本講不是再添一批圖論定義，而是示範如何把極簡的計數事實變成證明引擎：先用廣義鴿籠原理逼出局部結構，再用 case analysis 或 contradiction 推到目標結論。

課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂講者欄位，因此本文不猜實際講者。以下依公開完整投影片重建定義、證明與電影 puzzle；Canvas／Panopto 的口頭內容不在材料範圍內。

## 從 adjacency 與 reachability 接回本講

上一講定義：兩節點之間有邊就稱為 adjacent；兩節點之間存在 path 就稱為彼此 reachable。本講的證明焦點換成：當邊、顏色或偏好被分配到有限類別時，有什麼結構無論如何都躲不掉？

這類問題的難點不是計算，而是建模。必須說清楚 objects、bins、每個 object 如何進入 bin，以及定理保證的 load 如何翻回原題。少了其中一步，「由鴿籠原理顯然可得」只是一句口號。

## 普通鴿籠原理保證碰撞

Pigeonhole principle 說：把 `m` 個 objects 分入 `n` 個 bins，若 `m > n`，至少一個 bin 含兩個以上 objects。它不要求平均分配，也不指出是哪個 bin；結論只保證某處必有碰撞。

套用時先寫 objects、bins、assignment、forced conclusion。例如把十三個人依出生月份分入十二個月份，至少兩人同月出生。若題目改問生日日期，bins 就不同；模型一換，能推出的結論也跟著換。

## 廣義版本同時控制最擠與最鬆

若把 `m` 個 objects 分入 `n > 0` 個 bins，廣義鴿籠原理保證某箱至少有 `⌈m/n⌉` 個 objects，也保證某箱至多有 `⌊m/n⌋` 個。十一個 objects、五個 bins 的平均 load 是 `11/5`，所以至少一箱有三個以上，至少一箱有兩個以下。

不能把結論誤讀成每箱都介於二與三；`7,1,1,1,1` 仍符合定理。若每箱都少於 `m/n`，令 load 為 `x₁,…,xₙ`，則 `m=x₁+⋯+xₙ<n(m/n)=m`，得到矛盾。load 是整數，所以實數平均值要取 ceiling；下界方向則以同樣的總和推理得到 floor。

普通版本其實包含在廣義版本裡。當 `m>n` 時，`m/n>1`，因此 `⌈m/n⌉≥2`，立刻得到某箱至少兩個 objects。不過在寫證明時，應選剛好足以支持結論的版本：只要碰撞就用普通版本；需要三條同色邊或精確 load 門檻時，再清楚代入 `m`、`n` 計算 ceiling。這能讓讀者看見數字從哪裡來，而不是把定理當黑盒。

## 六人派對如何變成 K₆ 染色

派對有六人，每一對人不是朋友就是陌生人。把人畫成節點，每一對連邊；朋友邊塗藍，陌生人邊塗紅。因每一對都有關係，底圖是 complete graph `K₆`。三位共同朋友就是藍色 `K₃`，三位共同陌生人就是紅色 `K₃`。

原命題因此等價於：任意把 `K₆` 每條邊染紅或藍，必有 monochromatic triangle。鴿籠原理不是直接作用在六個人，而是作用在固定節點 incident 的五條邊；選錯 objects，就看不到 `⌈5/2⌉=3`。

## 在任意節點旁逼出三條同色邊

任取節點 `x`。它和其餘五點相鄰，所以有五條 incident edges；顏色只有紅、藍兩個 bins。依顏色分箱後，廣義鴿籠原理保證至少三條同色。

這一步只得到同色 star，尚未得到 triangle。設三條邊通往 `r,s,t`，接下來必須檢查外圍三點間的 `{r,s}`、`{r,t}`、`{s,t}`。完整證明的第二半由它們是否沿用中心顏色決定。

## 「不失一般性」必須有對稱性

投影片把三條同色邊設為藍色，使用 without loss of generality。這不是忽略不方便的 case，而是紅、藍在命題與推理中的角色完全對稱；若逼出紅色，只要交換顏色名稱，同一論證成立。

使用 WLOG 前要指出對稱操作。若兩個 cases 的假設或目標不對稱，就不能刪去一個。這裡交換 red 與 blue 不改變 `K₆` 或單色三角形的定義，因此簡化合法。

## 單色三角形證明的完整 case split

任取 `x`。五條 incident edges 依兩色分類，至少三條同色。不失一般性，設 `x` 到 `r,s,t` 都是藍色。若外圍三條邊至少一條藍色，它與連回 `x` 的兩條藍邊構成藍色 `K₃`。否則三條都不是藍色；每條非紅即藍，所以它們全紅，`r,s,t` 構成紅色 `K₃`。

兩種情況都產生 witness。證明的節奏是：pigeonhole 先逼出局部同質性，excluded middle 再分成「至少一條同色」與「全部異色」。只說「三條同色邊形成三角形」會把 star 誤認成 triangle。

也要留意命題中的「任取」。中心點 `x` 不需要特別挑 degree 最大或顏色最平均的點，因為 `K₆` 的每個節點都恰有五條 incident edges。這讓第一步對任意染色都成立。後半則不需要知道三個外圍點以外的任何邊色；證明只抽出足夠的小型局部結構，避免無目的地列舉整張圖的十五條邊。

## Ramsey theory：規模夠大就逃不掉結構

上述結果是 Ramsey theory 的特例。對任意自然數 `s`，存在 `R(s)`；當 `n<R(s)` 時，有 `Kₙ` 的紅藍染色可避開單色 `Kₛ`，而當 `n≥R(s)` 時，每一種染色都必含單色 `Kₛ`。

本講完整證明六個節點足以強迫單色三角形，也就是 `R(3)≤6`。若要聲稱 `R(3)=6`，還需展示 `K₅` 有一種染色不含單色三角形；一般 Ramsey theorem 在此也只有介紹，沒有完整證明。投影片以「大尺度的真正無序不可能維持」傳達直覺，但這句哲學解讀不能取代 theorem 的精確量詞。

## Sim 遊戲把定理變成無和局保證

Game of Sim 從六個不相連的點開始。兩位玩家分用紅、藍，輪流畫自己的邊；第一位完成自己顏色三角形的人輸。若所有邊畫完便得到紅藍染色的 `K₆`，而定理保證其中有單色三角形，所以遊戲不可能填滿所有邊仍無人輸。

定理只排除和局，沒有直接給最佳策略，也沒有指出哪一方必勝。Existence guarantee 與 strategy construction 是兩個不同問題，不能因終局結構存在就跳過對局順序。

## 高於平均與低於平均成對出現

投影片接著給另一個 pigeonhole-type result：把 `m` 個 objects 分入 `n` 個 bins，存在 load 大於 `m/n` 的 bin，若且唯若存在 load 小於 `m/n` 的 bin。總 load 固定為 `m`；某箱超過平均後，若其餘都不低於平均，總和便超過 `m`，反方向對稱。

實用 lemma 是：若沒有任何 bin 高於 `m/n`，也不會有 bin 低於 `m/n`，所以每箱恰等於平均。這把單側 upper bound 升級成完全均分，是電影 puzzle 的樞紐。

## 用反證證明平均負載 lemma

令第 `i` 箱 load 為 `xᵢ`。假設沒有箱超過 `m/n`，卻有某箱低於平均。不失一般性設 `x₁<m/n`，其餘滿足 `xᵢ≤m/n`。則

`m=x₁+x₂+⋯+xₙ<m/n+x₂+⋯+xₙ≤m/n+⋯+m/n=m`。

這導出 `m<m`，不可能。WLOG 的依據是 bins 編號沒有額外意義；低於平均的箱可重新命名為第一箱。第一個嚴格不等號來自 `x₁<m/n`，後面是非嚴格上界；若全部只寫 `≤`，最後得到 `m≤m`，不構成矛盾。

## 電影 puzzle 的 balls-and-bins 模型

有 `n>0` 人：90% 喜歡《CODA》，80% 喜歡《Nomadland》，70% 喜歡《Parasite》，60% 喜歡《Knives Out》，且無人四部都喜歡。問多少人至少喜歡《CODA》或《Parasite》之一。

每個人是一個 bin；每筆「某人喜歡某部電影」是一顆 ball，放進該人的 bin。總 balls 為 `0.9n+0.8n+0.7n+0.6n=3n`，共有 `n` bins，平均 load 是三。無人喜歡四部，等價於沒有 bin 高於三。由平均負載 lemma，也沒有 bin 低於三，所以每人恰好喜歡三部。

若把四部電影當 bins，只會重述各電影人數，無法約束每人的偏好總數。要回答「每個人至少喜歡哪些」，bins 必須代表人，balls 才是偏好事件。

## 從恰好三部推出答案是全部人

每人恰好喜歡四部中的三部，因此至多漏掉一部。若某人同時不喜歡《CODA》和《Parasite》，他最多只能喜歡另兩部，load 至多為二，與恰為三矛盾。

所以每一位都至少喜歡兩片之一，答案是全部 `n` 人，集合語言為 `|C∪P|=n`。題目不是問交集，也不是把 90% 和 70% 直接相加後截成 100%；百分比加總只建立總 balls，真正推到逐人結論的是「無人四部都喜歡」和平均負載 lemma。

## 常見失誤與修正

平均為三不代表每箱為三；`4,3,2` 就是反例，必須再用「沒有箱高於三」。朋友與陌生人證明中，被分箱的是五條 incident edges，不是六個節點；得到三條同色邊後也只是 star，還要檢查葉節點間的邊。

WLOG 必須伴隨可說明的交換顏色或重新編號。`R(3)≤6` 不等於已證 exact value；Sim 無和局也不等於已構造必勝策略。每次修正都回到量詞：主張對所有安排保證什麼，又只說存在什麼。

## 可執行自測

1. 將十七個 objects 放入六個 bins，求必有一箱至少與至多多少，並各造達界分配。
2. 重寫 `K₆` 證明，標出 objects、bins、WLOG 對稱和最後兩 cases。
3. 說明證 `R(3)=6` 還缺哪個 lower-bound construction。
4. 重證平均負載 lemma，指出嚴格不等號來源。
5. 移除「無人喜歡四部」條件，造出平均仍為三但有人只喜歡兩部的分配。

這些練習測的是能否把鴿籠原理用成建模與證明工具，而不是只背結論。

實作時可把每題答案固定成四欄：模型、數值代入、被迫結構、回譯結論。以派對題為例，模型是 incident edges 按顏色分箱，數值是五與二，被迫結構是三條同色邊，回譯則是再經 case split 得到單色三角形。電影題的被迫結構不是「有人 load 三」，而是 upper bound 配合平均 lemma 後「所有人 load 三」。分清這兩種推力，便不會誤把存在量詞寫成全稱量詞。

## 延伸方向與課程邊界

投影片列出 Sperner's lemma、mountain-climbing theorem、Brouwer fixed-point theorem、Mirsky's theorem，以及任意正整數都有只含零與一的非零倍數，作為延伸 sampler。它們展示 pigeonhole-style reasoning 的廣度，但本講沒有逐一證明。

課程另建議 Math 107、Math 108、CS161 與 CS224W。下一講轉入 mathematical induction，從有限分箱的必然碰撞，移到命題如何沿離散步驟傳遞。

## 材料缺口與閱讀界線

[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/Lecture%20Slides.pdf)公開，足以核對 agenda、完整證明、Sim 與電影 puzzle。錄影和逐字稿只在 Canvas／Panopto，因此本文不推測現場投票答案、講師口語或學生問題；Ramsey 一般定理與延伸結果也只維持投影片給出的介紹深度。

## 更新紀錄

- 2026-08-22：依官方完整投影片逐項重建廣義鴿籠原理、朋友與陌生人定理、Ramsey theory、Sim 與電影偏好 puzzle 的雙語正文。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 11: Graphs, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/)
- [Official Lecture 11 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/11/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs on Discrete Structures](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs_on_discrete_structures)
- [CS103 Spring 2026 Problem Set 3](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps3/)
