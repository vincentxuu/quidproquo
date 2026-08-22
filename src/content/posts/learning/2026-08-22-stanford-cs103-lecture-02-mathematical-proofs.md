---
title: "Stanford CS103 Lecture 1：從 even／odd 定義寫出第一個直接證明"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 3
tldr: "用偶數平方與兩奇數相加兩個例題，練習任取、假設、見證與 want-to-show 如何組成可逐行檢查的直接證明。"
description: "依 Stanford CS103 Mathematical Proofs 投影片重建 even／odd 定義、全稱蘊含式、代數見證與證明書寫規範。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-02-mathematical-proofs-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 3 篇，對應 **Spring 2026 官方 Lecture 1（2026-04-01）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Mathematical Proofs**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 證明是交給讀者執行的論證

投影片把 proof 定位成讓另一位讀者確信主張成立的 argument。作者知道自己想什麼不算完成；每個新變數從哪裡來、每個等式用哪個定義、結論為何符合目標，都必須讓讀者能沿文字重播。證明的力量來自 generality：它一次處理所有合法輸入，而不是展示幾個成功案例。

「顯然」、「稍微整理」不一定錯，但若省略處正是核心推理，讀者就無法檢查。好的壓縮應省略可機械重建的代數，而不是省略 witness、quantifier 或關鍵 implication。

## even 與 odd 是存在量詞定義

整數 n 為 even，表示存在 \(k\in\mathbb Z\) 使 \(n=2k\)。n 為 odd，表示存在 \(k\in\mathbb Z\) 使 \(n=2k+1\)。重點不只是「可被 2 整除」，而是定義直接交付一個整數 witness。

若已知 n even，可以寫「依 even 定義，取某 \(k\in\mathbb Z\) 使 \(n=2k\)」。k 不是任意整數，也不是全程固定的神祕常數；它依賴當前 n。反方向若要證某 expression even，就要造出整數 s，使 expression =2s。

檢查 8 是 even 可用 k=4；檢查 7 odd 可用 k=3。這是驗證個別 instance，不是證明所有偶數或奇數的 theorem。

## 全稱蘊含式的 proof game

命題「對所有整數 n，若 n even，則 \(n^2\) even」外層是 universal quantifier，內層是 implication。標準開場是任取一個符合 domain 的 n，再假設 antecedent n even，最後證 consequent \(n^2\) even。

「任取」保證不能利用某個特例；「假設 even」只因正在證 implication，並非偷偷假設結論。want-to-show 把目標依定義展開：必構造整數 s 使 \(n^2=2s\)。這三步分別處理 \(\forall\)、\(\to\) 與 existential definition。

## 完整證明：偶數的平方是偶數

任取 even integer n。依定義，存在 \(k\in\mathbb Z\) 使 n=2k。於是

\[
n^2=(2k)^2=4k^2=2(2k^2).
\]

令 \(s=2k^2\)。因 k 為整數，整數在乘法下封閉，所以 \(s\in\mathbb Z\)。因此 \(n^2=2s\)，依 even 定義 \(n^2\) even。

最後兩句不能只寫「所以完成」。目標要求某個 integer witness；證明必命名 s、確認型別，再呼叫定義。若只停在 \(4k^2\)，讀者雖可猜到下一步，proof obligation 仍未明示。

## witness 的 scope 與依賴關係

evenness 給出的 k 位於「固定任取 n 之後」的 scope，因此可依賴 n。不能在任取 n 之前先選一個共同 k，因不同偶數需要不同 witness。形式量詞是 \(\forall n\,(Even(n)\to\exists k\,n=2k)\)，不是 \(\exists k\,\forall n\)。

新造的 s 又依賴 k。寫 s=2k² 不只是代數縮寫，它明確交付 consequent 中的存在量詞。每次看到「存在」，問自己 witness 是什麼、它允許依賴哪些先前變數、為何落在指定 domain。

## 兩個 odd integers 相加的目標

theorem 是：對所有 integers m,n，若 m、n 都 odd，則 m+n even。任取 odd m,n。依 odd 定義，存在 \(k,r\in\mathbb Z\)，使 \(m=2k+1\)、\(n=2r+1\)。兩個 witness 要分開命名，因沒有理由兩個 odd numbers 使用同一 quotient。

代入：

\[
m+n=(2k+1)+(2r+1)=2k+2r+2=2(k+r+1).
\]

令 \(s=k+r+1\)。整數對加法封閉，所以 \(s\in\mathbb Z\)。因此 m+n=2s，依定義 m+n even。

## 為何 7+3 不是 theorem proof

7 與 3 都 odd，而且 7+3=10 even，只證明一個 input pair。全稱命題要求每一對 odd integers；再多算 9+5、101+7 也只是更多 examples。反例一個就能推翻 universal claim，正例有限個卻不能建立它。

例子仍有用途：它協助猜測公式與 witness。7=2·3+1、3=2·1+1，相加後 quotient 是 3+1+1；這提示一般 witness \(s=k+r+1\)。proof 的工作是把這個 pattern 對任意 m,n 表達。

## arbitrary choice 與 existential witness 的相反責任

面對 \(\forall x\)，證明者必讓 x arbitrary，不能選最方便者；面對 \(\exists y\)，證明者反而要主動選一個 y。偶數平方 proof 的 n 是 arbitrary，k 由 assumption 提供，s 由證明者構造。把三種來源混在一起會造成量詞錯誤。

若要使用 universal fact，可對當前物件 instantiate；若要使用 existential fact，可取一個符合條件的 witness，但不能假設它還有未給出的性質。若要證 existential goal，列出 witness 後還須驗證全部條件。

## floor／ceiling 例題揭示 case split

deck 後段研究 \(\lfloor n/2\rfloor+\lceil n/2\rceil=n\)。對任意 integer n，僅靠代數無法消掉 floor/ceiling；應依 n 的 parity 分 cases。

若 n=2k，兩者都等 k，和為 2k=n。若 n=2k+1，floor 為 k、ceiling 為 k+1，和為 2k+1=n。cases 必 exhaustive：每個整數 exactly even or odd。每一 branch 都使用相應定義取得 witness，最後再合併結論。

這個例子補充 direct proof 並非永遠一條直線；case split 仍是直接論證，只要每個合法 input 都被覆蓋。

## 寫作者與讀者的資訊差

投影片以 Proof Writer 與 Proof Reader 的視角提醒：作者知道下一步想去哪，讀者只擁有已寫出的句子。變數若未宣告、assumption 若未標記、witness 若未驗證為 integer，讀者不能靠善意替作者補齊。

逐行自查可問：這個符號第一次在哪裡定義？這句用哪個已知條件？等式是否保持相等？最後一句是否直接命中 theorem 的 consequent？答案若只能是「你懂我的意思」，就需要補寫。

## 把兩份主證明逐行標註

偶數平方證明的第一句同時完成兩件事：「任取」處理全稱量詞，「even integer」把 antecedent 帶入當前 scope。第二句 \(n=2k\) 不是新假設，而是展開 even 定義；其中「k 是整數」之後會被用來證明 \(2k^2\) 仍是整數。第三段代數把原目標改寫成 2 乘某物。最後命名 s，才真正交付 consequent 所需的 witness。

兩奇數相加證明也可用相同標籤閱讀。m、n 是 arbitrary；oddness 是 assumptions；k、r 是 assumptions 各自提供的 witnesses；\(s=k+r+1\) 是為目標新造的 witness。若誤把 k=r，證明就偷偷增加題目沒有給的條件。若漏掉 +1，則 \(2(k+r)\) 與原式差 2，代數本身也錯。

這種標註法可執行：在草稿每行左側寫 `∀`、`assume`、`definition`、`algebra`、`witness` 或 `conclusion`。若某個結論前找不到對應的 definition/witness 行，缺口就很具體，而不是模糊地覺得「證明不夠嚴謹」。

## 定義能用的方向取決於當下任務

even 的 biconditional 定義有兩個方向。已知 n even 時，使用「even ⇒ 存在 k」取得表示式；已知 \(n=2k\) 且 k integer 時，使用「存在此 k ⇒ even」得到分類。平方證明的開頭用前一方向，結尾用後一方向。

odd 定義同理。這解釋為何 proof 中同一個定義會出現兩次，角色卻不同：第一次拆 assumption，第二次驗收 goal。把定義只當名詞解釋，會看不出它其實是可以雙向呼叫的推理介面。

若題目只給 \(n=2x\) 卻沒有 x integer，不能直接說 n even；x 可能是 1/2，使 n=1。domain condition 是定義的一部分，不是旁註。

## 可執行自測

先證「若 n odd，則 \(n^2\) odd」：任取 n、由 oddness 取 k，展開 \((2k+1)^2\)，並明確寫出 odd witness。接著證「even + odd = odd」，分別為兩個 assumptions 命名 witness，最後交付新的 integer witness。

再審查三個錯誤稿：只算 n=4；寫 n=2k 卻未說 k integer；算到 \(m+n=2k+2r+2\) 就結束。逐一指出它們分別沒有處理 universal quantifier、witness type 與 consequent definition。

完成後再做一次反向驗收：把最後一句「所以是 even／odd」換回定義，看前一行是否真的具有 \(2s\) 或 \(2s+1\) 的形式，並確認 s 已被證明為整數。接著遮住開頭，從正文列出所有 assumptions；若多出「k=r」或某個固定數值，表示草稿偷偷縮小了全稱命題。這兩個動作分別檢查結論與適用範圍。

最後把同一份證明交給沒有看過題目的人，只讓他依文字還原 theorem；若他能正確說出變數的 domain、全部前提、量詞順序與最後結論，證明的資訊才算自足，也真正能被另一位讀者逐行獨立檢查、完整且清楚地重播整份論證。

## 材料缺口與閱讀界線

公開投影片完整呈現 even／odd 定義、偶數平方、兩奇數相加與 floor／ceiling case split。錄影與逐字稿不公開；本文不重建口頭 feedback 或未出現在 deck 的證明版本。

## 更新紀錄

- 2026-08-22：依 clean review 從官方 deck 重建直接證明正文，恢復 witness scope、odd-sum 與 floor／ceiling 例題。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 1: Mathematical Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/)
- [Official Lecture 1 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/01/Lecture%20Slides.pdf)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
- [CS103 Guide to Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/guide_to_proofs)
- [CS103 Proofwriting Checklist](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/proofwriting_checklist)
- [CS103 Spring 2026 Problem Set 1](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps1/)
