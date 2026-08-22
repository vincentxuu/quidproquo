---
title: "Stanford CS103 Lecture 23：不可解問題 I"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 25
tldr: "本講從「從 R、RE 與 UTM 接回來」推進到「self-reference 回顧的三個程式」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「從 R、RE 與 UTM 接回來」與「self-reference 回顧的三個程式」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-24-unsolvable-problems-1-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 25 篇，對應 **Spring 2026 官方 Lecture 23（2026-05-22）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Unsolvable Problems, Part I**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 從 R、RE 與 UTM 接回來

recognizer 對每個字串 w 滿足「M accepts w 當且僅當 \(w\in L\)」。member 必須 accept；nonmember 只要求不 accept，可能 reject，也可能 loop。因此 recognizable 是弱解法，所有此類語言組成 RE。decider 除同一 membership 條件外還必須在所有輸入 halt；nonmember 因而必 reject，所有 decidable 語言 組成 R。

Universal TM 在 \(\langle M,w\rangle\) 上忠實模擬 M：M accept、reject、loop 時 UTM 分別 accept、reject、loop。因此它 recognize

\[
A_{\mathrm{TM}}=\{\langle M,w\rangle\mid M\text{ is a TM and M accepts }w\},
\]

卻不是 decider，因第三種 輸入 不停機。本講要證的 major theorem 是 \(A_{\mathrm{TM}}\) 不只是「UTM 剛好不會 decide」，而是根本不存在任何 decider。

## self-reference 回顧的三個程式

上一講的 theorem 說，可構造對自身 source code 做任意計算的 TM。投影片 用三段鳥名程式校準直覺：`cormorant()` 印出自己的 source；`curlew(input)` 判斷 輸入 是否等於自己的 source；`avocet()` 計算自身 source 中字元 `a` 的個數。三者都不是從外部讀 source file，而是 self-reference construction 所保證的 行為。

這三題逐步增加能力：先把 me 當輸出，再把 me 與 輸入 比較，最後遍歷 me 並計算其 性質。後面的 trickster 也只是在 me 上執行另一個 computation；若不接受這層 self-reference，就無法理解 contradiction 的 輸入 是如何形成。

## self-defeating object 的結構

投影片 定義 self-defeating object：它的 essential 性質 會保證它不存在。例子是「最大整數」。假設最大整數 n 存在，就能使用 n 構造 n+1；因 \(n<n+1\)，n 失去「最大」性。對象本身提供了摧毀自身資格的材料。

這是反證法：若能證 `x exists → ⊥`，可推出 x 不存在。反過來，證 `x exists → ⊤` 沒有存在性結論。「假設 x 是最大整數，看到 \(x>x-1\)，沒有矛盾」不是證明最大整數存在；它只檢查一個 consequence，而且一開始已假設待證事項。沒有找到矛盾，不等於證明不可能有矛盾。

## fortune teller 如何被自己的答案困住

trickster 先約定付款規則：fortune teller 回答 yes，就付 42 美元；回答 no，就付 137 美元。接著問：「我會付你 137 美元嗎？」付款約定給出

\[
\text{SaysYes}\leftrightarrow\text{Pays42},
\]

問題的正確預測又要求

\[
\text{SaysYes}\leftrightarrow\text{Pays137}.
\]

兩式合起來迫使 Pays137 與 Pays42 等價，但約定讓兩者互斥。若答 yes，trickster 付 42，於是預言「會付 137」錯；若答 no，trickster 付 137，預言仍錯。這不是 fortune teller 猜得不夠準，而是「回答所有人的所有 future yes/no questions」這個能力會被針對其答案的策略擊敗。

關鍵是 coupling：trickster 預先把自己未來的 行為 綁到 fortune teller 的 output，選擇相反結果。fortune teller 因宣稱範圍太強，成為 self-defeating object。

## infinite loop 是事故還是計算的本質

實作程式偶爾 loop；Theoryland 也明確允許 TM 既不 accept、也不 reject。問題不是某位工程師能否修掉某個 bug，而是能否建立一個普遍程序，對任意 code/輸入 正確判斷它會不會 accept。

\(A_{\mathrm{TM}}\) recognizable，因 UTM 是 recognizer；但本講將證 \(A_{\mathrm{TM}}\notin R\)。換句話說，至少有些 universal simulation 輸入 必須無限等待。loop 並非只因 UTM 寫得笨；若存在任何永遠停機且正確的替代品，它就是被 theorem 排除的 decider。

## 假想 ATM decider 的完整 contract

把 decider D 寫成：

```text
bool willAccept(string function, string input)
```

若 `function(input)` return true，它 return true；若原程式 return false，它 return false；若原程式 loop，它也必 halt 並 return false。後兩種都代表 encoding 不在 \(A_{\mathrm{TM}}\)。這與 UTM 唯一但致命的差別，就是能在被模擬程式 loop 時仍然得出 false。

投影片 的例題可按 contract 判讀。若 f 對非空字串檢查首字元是否 `a`，輸入 `abbababba` 會回 true，所以 willAccept 回 true。若 g 無條件進入 `while(true)`，willAccept 理應回 false，而不是跟著 loop。hailstone 程式對 10,137 個 a 的輸入是否停機，假想 decider 也必立即給出正確布林值；「目前不知道」不在 contract 裡。

## 為何這個簡單介面包進數學難題

投影片 提到 \(x^3+y^3+z^3=33\) 的整數解直到 2019 年才找到，並列出一組巨大解；截至投影片標示的 May 2025，114 的情況仍未知。定義

\[
L=\{a^n\mid \exists x,y,z\in\mathbb Z.\ x^3+y^3+z^3=n\}.
\]

recognizer `hasTriple(n)` 依 max=0,1,2,... 枚舉盒子 \([-max,max]^3\)。若解存在，某輪必找到並 return true；若不存在，它永遠搜尋。把程式碼與 114 交給 willAccept，true 代表存在解，false 代表不存在。因此任何 ATM decider 都得強到能解答這類 open instance。

同理，可寫 recognizer 跑 hailstone sequence，停到 1 才 accept，再請 D 判斷。這些例子不是 undecidability 證明：數學問題現在很難，不等於永遠無 algorithm。它們提供 intuition：program acceptance 這個看似單一問題，能容納大量其他 search questions。

## 把 fortune teller 翻成 trickster program

假設 willAccept 存在，利用上一講的 own-source theorem 構造：

```text
bool trickster(string input) {
    string me = /* source code of trickster */;
    return !willAccept(me, input);
}
```

willAccept 是 fortune teller；`return !...` 是預先綁定的反向付款策略。對任意 輸入，因 willAccept 的 correctness，

\[
\text{willAccept(me,輸入)=true}
\leftrightarrow
\text{trickster(輸入) returns true}.
\]

但依 trickster 的程式本文，

\[
\text{trickster(輸入) returns true}
\leftrightarrow
\text{willAccept(me,輸入) is false}.
\]

合起來得到 P 當且僅當非 P。注意不需要把 輸入 也設成 me；me 只出現在 函數-code position，矛盾對每個 輸入 都成立。

## 定理：ATM 不可判定

正式證明以反證開始。假設 \(A_{\mathrm{TM}}\in R\)，則存在 decider D，可實作為符合上述 contract 的 willAccept。self-reference theorem 保證能構造 trickster 並取得自己的 code me。D 的正確性說 willAccept(me,輸入) true iff trickster(輸入) returns true；trickster 的 return statement 又說後者 iff willAccept(me,輸入) false。故某 proposition 同時等價於自身否定，不可能。

因此假設錯誤，\(A_{\mathrm{TM}}\notin R\)。搭配 UTM 已證的 \(A_{\mathrm{TM}}\in RE\)，得到它 recognizable but undecidable。這也證明 \(R\subsetneq RE\)：不只每個 decider 都是 recognizer，還確實存在 recognizer 語言 不可 decide。

證明排除的是所有可能 D，不只特定 implementation。trickster 只使用假定 contract，所以 D 用 static analysis、simulation、theorem proving 或未來硬體都無關；只要宣稱對所有 encoded programs/輸入 halt 且正確，就會遇到同一矛盾。

## 三個容易漏掉的 證明 obligations

第一，willAccept 必須 halt，否則 `!willAccept(...)` 未必得到布林值；只有 recognizer 無法支持 trickster 的 equivalence。第二，me 必須真是 trickster source，這由前講 self-reference theorem 提供，不可寫成「讀某檔案」後假設內容沒變。第三，D 的 domain 必須包含合法的 trickster encoding 與任意 string 輸入；若只處理受限程式族，就不是 \(A_{\mathrm{TM}}\) decider。

還要分清楚 returns false 與 does not return true。在 decider contract 中 willAccept 自己總會 halt，所以它只有 true/false；被分析的 函數 則可能 false 或 loop，兩者都映到 false。正是這個 total Boolean answer 讓 negation 可執行，也讓矛盾成立。

## 可執行自測

先做三欄表，對 member/nonmember 寫 recognizer 與 decider 可有的 outcome。再用 n+1 證明 說明 `x exists → ⊥` 與 `x exists → ⊤` 為何只有前者能否定存在。對 fortune teller 分別假設 yes/no，沿付款規則檢查預言。

接著對 f、infinite-loop g、hailstone h 寫出假想 willAccept 應回的值或它必須解決的問題。最後不看本文，重寫 ATM 證明 的四條 equivalence：D correctness、trickster source、negation、contradiction；並回答為何「UTM 不是 decider」本身尚不足以證 \(A_{\mathrm{TM}}\notin R\)。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「從 R、RE 與 UTM 接回來」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 23: Unsolvable Problems, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/)
- [Official Lecture 23 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/Lecture%20Slides.pdf)
- [Alan Turing, On Computable Numbers (1936)](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)
- [MIT OpenCourseWare：Recognizability and Undecidability](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec6/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
