---
title: "Stanford CS103 Lecture 25：不可解問題 III"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 27
tldr: "本講從「Lava Diagram 的兩個辨識任務」推進到「Rice's Theorem 的 投影片 版判讀」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「Lava Diagram 的兩個辨識任務」與「Rice's Theorem 的 投影片 版判讀」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-26-unsolvable-problems-3-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 27 篇，對應 **Spring 2026 官方 Lecture 25（2026-05-27）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Unsolvable Problems, Part III**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## Lava Diagram 的兩個辨識任務

前兩講把 \(A_{\mathrm{TM}}\) 與 HALT 放進 \(RE\setminus R\)：兩者都有 recognizer，卻沒有 decider。本講收尾時要分開回答兩題。第一，看到 machine-code 語言，如何判斷它在 R 外？Rice's Theorem 提供快速篩選。第二，如何判斷甚至在 RE 外？要檢查是否可能有 recognizer／verifier，或用 diagonal 語言 直接反證。

圖上的 containment 是 Regular ⊆ CFL ⊆ R ⊊ RE ⊊ All Languages。Rice 只告訴我們不在 R，未保證在 RE；「undecidable」與「unrecognizable」不能混為同義詞。

## Rice's Theorem 的 投影片 版判讀

若 語言 的 strings 是 TM code，並依 TM 的 語言 或執行 行為 做非平凡篩選，它 undecidable。投影片 列的模板包括：\(\langle M,w\rangle\) 上的 行為、單一 \(\langle M\rangle\) 的 行為/語言 性質，以及比較 \(M_1,M_2\) 語言 或 行為。例子有「M accepts 至少一個 string」、「\(\mathcal L(M)\) finite」、「M loops on w」。

實際判讀做三步：輸入 是否含合法 TM encoding；性質 是否取決於執行後接受、拒絕、loop 或 recognized 語言；性質 是否 nontrivial，也就是至少一台 TM 有、至少一台沒有。三項皆是，才套 theorem。這把反覆重寫 trickster 的工作封裝成一般結果。

## caveat 1：syntax 性質 不在射程內

只有 code 長得像 \(\langle M\rangle\) 不夠。若問題只看 source text，不需執行 M，通常可直接 scan 而 decidable。例如

\[
L_1=\{\langle M,w\rangle\mid \langle M\rangle\text{ contains more a's than }w\},
\]

與「\(\langle M\rangle\) length 為 odd」。decoder 驗證 encoding 後數字元或長度即可 halt。它們談的是 representation，不是 semantic 行為；Rice 不適用。

同一 computation 可有很多不同 code strings，所以 semantic 性質 應對所有 recognize 同一 語言 的 machines 給相同判斷；syntax 性質 則可能因重新命名 state 或加入 unreachable code 改變。

## caveat 2：性質 必須真的篩選

若 criteria 對所有 TMs 都 true，語言 是全部合法 encodings（投影片 簡寫 \(\Sigma^\*\)），可由 parser decide；例如每台 TM 至少有一個 state。若 criteria 對零台 TM true，語言 是 \(\varnothing\)，也是 regular。沒有 yes/no 分界，就沒有 undecidability 困難。

所以「M recognizes \(\varnothing\)」雖然有些 machine 符合、有些不符合，而且是 語言 性質，屬 nontrivial，Rice 判 undecidable。反之單獨的 \(L=\Sigma^\*\) 明顯 decidable。考題先找正反 見證，而不是看到 angle brackets 就自動答 undecidable。

## Rice 能說什麼、不能說什麼

theorem 的結論只到「不在 R」。某 semantic 性質 可能在 \(RE\setminus R\)，也可能完全在 RE 外。例如「M accepts at least one string」可 dovetail 所有 輸入 找 acceptance，因此 recognizable；「M 的 語言 等於另一台的 語言」則 投影片 列為 unrecognizable 例子。

因此 Lava Diagram placement 要分兩階段：Rice 排除 R；再獨立找 recognizer/verifier 來證 RE membership，或用 complement/diagonal reasoning 證 non-RE。不可從 undecidable 直接畫到 All Languages 區。

## counting argument：為何 RE 外有大量 語言

TM 本質是有限 code string。把每個 malformed string 解讀成 always-reject TM，所有 TMs 數量就是 \(|\Sigma^\*|\)，可數無窮。語言 是 \(\Sigma^\*\) 的任意 subset，所以總數是 \(|\mathcal P(\Sigma^\*)|\)。Cantor theorem 給

\[
|\Sigma^\*|<|\mathcal P(\Sigma^\*)|.
\]

每台 TM 至多 recognize 一個 語言，machines 數量不足以覆蓋所有 語言。因此不只存在一兩個 unrecognizable problems，而有不可數多個。這是 existence/counting 證明，沒有指出哪一個具體 語言 在外面；後面的 \(L_D\) 補上 explicit 見證。

## unrecognizable 的 verifier 語意

若 \(L\notin RE\)，不存在 M 使 \(\mathcal L(M)=L\)；依前講等價 theorem，也不存在 L-verifier。也就是沒有一般的 finite 證明憑證 system，能讓每個 member w 提供某 c 並由 total 檢查器 驗證。

「想不到 證明憑證」只是 intuition，不是 證明。可能需要更巧妙 encoding。但負面 性質 特別可疑：要證 M accepts，步 count n 可展示在有限時間看到 acceptance；要證 M 永遠不 accept，單一 finite 步 bound 只表示「目前還沒」，無法涵蓋無限 future。

## undecidable RE 語言 的 complement 為何不在 RE

令 L∈RE 且 undecidable。若 complement \(\overline L\) 也在 RE，就可平行模擬兩台 recognizers：同一 輸入 必在 L 或 complement，終有一台 accept；依是哪台先 accept 作 yes/no，得到 L-decider，矛盾。因此 \(\overline L\notin RE\)。

所以 \(\overline{A_{\mathrm{TM}}}\) 與 \(\overline{HALT}\) 都在 RE 外。正面 HALT 證明憑證 是「第 n 步驟 accept/reject」；non-halting 沒有對稱 步-count 證明憑證。diagram 把 ATM、HALT 放在 RE 區，再把 complements 放到 All Languages 的外圈。

## 例子：語言 equality 與至少五個 loops

投影片 列

\[
EQ_{\mathrm{TM}}=\{\langle M_1,M_2\rangle\mid \mathcal L(M_1)=\mathcal L(M_2)\}
\]

與 \(\{\langle M\rangle\mid M\text{ loops on at least five strings}\}\) 作 non-RE 例子。兩者要求排除無限可能：equality 必確保沒有任一 distinguishing string；looping 必確保五次 executions 永不結束。有限觀察難以證明這種 negative claim。

對比「M accepts at least five strings」在 RE：證明憑證 可為

\[
\langle w_1,n_1,\ldots,w_5,n_5\rangle,
\]

其中五個 distinct strings 各附 acceptance 步 bound。verifier 有限模擬並檢查 distinctness 即可。把 accepts 換成 loops，\(n_i\) 無法證明第 n_i 步以後永不 halt。

## diagonal 語言 LD

定義

\[
L_D=\{\langle M\rangle\mid M\text{ does not accept }\langle M\rangle\}
=\{\langle M\rangle\mid \langle M\rangle\notin\mathcal L(M)\}.
\]

第二式的符號必是 \(\notin\)：它正是第一式的 set-語言 翻譯。這個 語言 沿 enumeration 的 diagonal 對每台 machine 的 self-輸入 行為 取反。

假設有 recognizer \(M_D\) recognize \(L_D\)，問它是否 accept \(\langle M_D\rangle\)。若 accept，依 recognizer 定義 encoding 在 \(L_D\)，再依 \(L_D\) 定義它不 accept 自己，矛盾。若不 accept，則依 \(L_D\) 定義 encoding 應在 \(L_D\)，recognizer 又必 accept，矛盾。兩種情況皆不可能，因此 \(L_D\notin RE\)。

## gardener story 的 iff 結構

故事中唯一 gardener 替且僅替「不自己除草」的 residents 除草。gardener 本身也是 resident。令 G 表示 gardener 替自己除草，規則套到本人得到 \(G\leftrightarrow\neg G\)。答 true 時規則要求 false；答 false 時規則要求 true。

這不是要在兩個答案中挑較合理者，而是規格描述的 gardener 不可能存在。對應到 \(M_D\)，「recognizes LD」這個 essential 性質 在 self-輸入 上摧毀自身，延續前兩講 self-defeating object 主線。

## 常見分類錯誤與自測

第一，把 Rice 當「含 TM encoding 就 undecidable」；應先區分 syntax/semantics。第二，忘了 nontrivial caveat；all/none 性質 regular。第三，把 undecidable 等同 non-RE；\(A_{\mathrm{TM}}\)、HALT 是反例。第四，用「想不到 證明憑證」冒充 證明。第五，把 \(L_D\) 第二式漏掉 not-in，會把定義改成 self-acceptance 語言。

自測時分類四題：code odd length、recognizes empty 語言、accepts at least five strings、loops on at least five strings。每題先跑 Rice 三步，再問可否寫 finite 證明憑證。最後完整展開 \(M_D\) accept／not accept 兩分支，並以 parallel recognizers 證明為何 undecidable RE 語言 的 complement 不在 RE。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「Lava Diagram 的兩個辨識任務」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 25: Unsolvable Problems, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/)
- [Official Lecture 25 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/25/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Recognizability and Undecidability](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec6/)
- [Stanford Encyclopedia of Philosophy：Computability and Complexity](https://plato.stanford.edu/entries/computability/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
