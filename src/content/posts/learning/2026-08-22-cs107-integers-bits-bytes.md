---
title: "Stanford CS107 Lecture 3：整數、位元組與 two's complement"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, binary, integer-overflow]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS107 導讀"
  order: 4
tldr: "第三講從 32／64-bit 位址空間出發，推導 unsigned 與 two's-complement signed integer 的範圍、反相加一與共用加法硬體，再分清 unsigned modulo 運算和 C signed overflow，最後用四組故障案例檢查模型。"
description: "逐頁導讀 Stanford CS107 Winter 2026 Lecture 3：固定寬度整數、two's complement、二進位加法、unsigned 與 signed overflow，以及溢位如何成為真實系統故障。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-cs107-integers-bits-bytes-en)

同一串 bit 沒有天生的正負號。`1011` 可以是 unsigned 的 11，也可以是 4-bit two's complement 的 -5；差別不在儲存格，而在程式選擇用哪套規則解讀它。CS107 第三講要建立的就是這層區分：先固定寬度，再定義編碼，最後才談算術結果。

這篇依 [Winter 2026 Lecture 3 官方投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/03/Lecture03.pdf) 的順序完整展開。主脊是「一個有限長度的 bit pattern，如何同時支撐 unsigned、signed 與加法」。讀完應該能徒手判讀小型 bit pattern，也能說明為何「處理器看起來會繞回」不等於「C 保證 signed overflow 會繞回」。

## 講次資料與材料邊界

- 課程：Stanford CS107: Computer Organization and Systems
- 學期：Winter 2026
- 官方講次：Lecture 3, *Integers, Bits and Bytes*（投影片封面作 *Bits and Bytes, Integer Representations*）
- 上課日期：2026-01-09
- 講者：Jerry Cain
- 官方材料：[課程 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)、[Lecture 3 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/03/Lecture03.pdf)、[SEI CERT C signed overflow 規則](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int32-c/)、[SEI CERT C integer conversion 規則](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int31-c/)
- 指定閱讀：Bryant 與 O’Hallaron，第 2.2–2.3 節略讀

公開 PDF 完整，共 28 頁；課堂錄影只在 Canvas，因此本文無法核對講者現場補充、問答與口頭但書。投影片足以支撐型別寬度、unsigned、two's complement、加法與 overflow 的主線。文末四個案例依投影片呈現，本文把它們當作表示法的應用題，不額外補寫投影片未提供的事故因果。

## 本講完整 agenda

1. 32-bit 與 64-bit 系統的型別寬度、pointer 與理論位址空間。
2. unsigned integer 的 binary interpretation、範圍與 odometer 模型。
3. signed integer 的第一個候選：most significant bit 表示 sign，其餘 bits 表示 magnitude。
4. sign-and-magnitude 的正負零、可表示值浪費與加法硬體複雜度。
5. 從「正數加上什麼會得到零」推導 two's complement。
6. 反相再加一、正負互換、唯一的零與共用二進位加法。
7. 固定寬度 binary arithmetic、unsigned overflow 與 underflow。
8. signed／unsigned number wheel 上的 discontinuity，以及 C 對 signed overflow 的限制。
9. PSY 的觀看次數、Pac-Man 第 256 關與 Donkey Kong 第 22 關。
10. Boeing 787 控制單元與 Delta 排班系統案例。

## 32-bit 與 64-bit，先問「哪個東西」是幾 bit

投影片從 2000 年代初常見的 32-bit 電腦談起。當 pointer 是 32 bits，也就是 4 bytes，它能區分 `0` 到 `2^32 - 1` 的位址。若每個位址對應一個 byte，總共就是 `2^32` bytes，約 4GB 的理論可定址空間。

64-bit pointer 則可區分 `2^64` 個 byte 位址，理論值為 16 exabytes。這個數字描述 pointer pattern 的容量，不代表一台 64-bit 電腦真的裝有 16EB RAM，也不代表硬體與作業系統一定開放完整 64-bit 虛擬位址。這講的目的不是盤點現代 CPU 實作，而是看寬度每增加一 bit，可區分的 pattern 數就加倍。

「64-bit system」也不表示每個 C type 都自動變成 64 bits。投影片特別說 pointer 會擴大，`long` 經常也會擴大；精確型別寬度仍取決於資料模型與平台。寫 C 時，不能看到機器是 64-bit 就推定 `int`、`long`、pointer 全部同寬。這個分寸很重要，因為後面每一條範圍公式都有同一個前提：先知道實際寬度 `w`。

## Unsigned integer：所有 pattern 都拿來表示非負整數

Unsigned integer 只表示零與正整數。讀法和上一講的位值系統一致：每個位置的權重是 2 的冪次。例如 4-bit pattern：

```text
0101₂ = 5₁₀
1011₂ = 11₁₀
1111₂ = 15₁₀
```

若寬度是 `w`，總共有 `2^w` 個 pattern。最小值是所有 bits 為零，最大值是所有 bits 為一，因此範圍是：

```text
0 ... 2^w - 1
```

以 4 bits 為例，範圍是 0 到 15。注意「共 16 個值」和「最大值 15」並不矛盾，因為計數從零開始。以 32 bits 為例，最大 unsigned value 是 `2^32 - 1`，但 pattern 總數是 `2^32`。

投影片用里程表式的 number wheel 表示有限寬度。4-bit wheel 從 `0000` 走到 `1111`，下一步沒有第五個 bit 可放 carry，所以回到 `0000`。這個圓環不是畫圖趣味，而是 unsigned arithmetic 的核心模型：固定寬度只保留除以 `2^w` 的餘數。

## 第一種 signed 提案：最高位放正負號

要讓同一組 pattern 表示正數、負數與零，最直觀的設計是把 most significant bit（MSB，最高有效位元）當 sign：`0` 表示正，`1` 表示負，其餘 bits 表示 magnitude。於是：

```text
0110 = +6
1110 = -6

0011 = +3
1011 = -3
```

人很好讀，正負配對也很直觀。問題先出現在零：`0000` 是 `+0`，`1000` 是 `-0`。16 個 patterns 只表示 15 個不同數值，一個編碼位置浪費在重複的零。

更麻煩的是加法。若 sign 和 magnitude 分開，硬體不能只把每一欄 bits 相加。它得先檢查兩個 sign：同號可能相加 magnitude，異號可能改做減法；接著要比較大小、處理 borrow，再決定結果的 sign。投影片真正重視的缺點不是人類轉換麻煩，而是最基本的 addition 因此需要特殊分支。

這裡的設計目標逐漸清楚：理想的 signed representation 應保留一個零，MSB 最好仍能快速提示正負，而且相同加法電路能處理任何正負組合。

## 從「加到零」反推 two's complement

投影片不先背規則，而是問一個工程問題：在 4-bit 世界裡，哪個 pattern 和 `0101` 相加會得到 `0000`？答案是：

```text
  0101
+ 1011
------
 10000
```

結果其實有第五個 carry，但容器只有 4 bits，最左邊的 `1` 被丟掉，留下 `0000`。所以若 `0101` 代表 +5，`1011` 很適合代表 -5。再看 +3：

```text
  0011
+ 1101
------
 10000
```

`1101` 因此可代表 -3。零則和自己配對：`0000 + 0000 = 0000`。這三組例子露出共同規律：把原數每一 bit 反相，再加一。

```text
0101 反相得到 1010，再加 1 得到 1011
0011 反相得到 1100，再加 1 得到 1101
```

為什麼如此？一個 pattern 和它的 bitwise inverse 相加，每一欄都是 `0 + 1`，結果全為一；再加一就會一路 carry，形成 `1` 後面接 `w` 個零。固定寬度丟掉最左 carry，結果正好是零。這套實際採用的表示法就是 two's complement（二補數）。

## Two's complement 的讀法與範圍

正數照原本 binary 表示；負數則用對應正數反相加一。相同操作也能從負數回到正數，因為固定寬度下再做一次 two's complement 會回到原 pattern。

4-bit 對照如下：

```text
0000 =  0      1000 = -8
0001 =  1      1001 = -7
0010 =  2      1010 = -6
0011 =  3      1011 = -5
0100 =  4      1100 = -4
0101 =  5      1101 = -3
0110 =  6      1110 = -2
0111 =  7      1111 = -1
```

一般 `w`-bit signed range 是：

```text
-2^(w-1) ... 2^(w-1) - 1
```

範圍不對稱：4-bit 有 -8，卻沒有 +8。原因是零占用非負那一半的一個位置；MSB 為 `0` 的 pattern 從零到正最大值，MSB 為 `1` 的整半區都交給負數。最小值 `1000` 也沒有可表示的正數對應；把它反相加一，固定在 `1000`。實務上若對 signed minimum 做 negation，必須先考慮結果是否超出型別範圍，不能只機械套公式。

要快速讀一個 MSB 為 `1` 的 pattern，有兩條路。第一條是反相加一得到 magnitude，再加負號；例如 `1011` 反相為 `0100`，加一為 `0101`，所以是 -5。第二條是直接把 MSB 權重視為 `-2^(w-1)`，其餘位仍是正權重；`1011` 就是 `-8 + 2 + 1 = -5`。前者適合初學轉換，後者適合快速心算與理解範圍。

## 為何相同加法硬體可以處理正負數

Two's complement 的最大設計收益不是「負數有個漂亮寫法」，而是加法不需要先分類正正、正負、負負。CPU 可以逐欄相加，保留容器內的低 `w` bits，丟掉超出的 carry。編碼規則讓結果在可表示範圍內時自然對上 signed arithmetic。

例如 4-bit 的 5 加 -3：

```text
  0101   (+5)
+ 1101   (-3)
------
 10010
```

保留低 4 bits 得 `0010`，也就是 +2。再看 -5 加 -2：

```text
  1011   (-5)
+ 1110   (-2)
------
 11001
```

保留 `1001`，它代表 -7。硬體做的是同一套 column-wise addition；signed 或 unsigned 的差別主要落在如何解讀 operands、如何判定條件，以及語言允許程式依賴哪些結果。

這句需要保留邊界：共用加法器不代表所有超界結果都合法。bit pattern 仍會產生，但 C 語言對 unsigned 與 signed 超界給了不同契約。

## Unsigned overflow：明確的 modulo `2^w`

固定 `w` bits 的 unsigned 加法若超過最大值，結果繞回零端。例如 6-bit：

```text
111111 + 000001 = 000000
```

數值上是 `63 + 1 = 64`，而 `64 mod 64 = 0`。減法低於零也從頂端繞回；9-bit 的零減一會得到九個 `1`，也就是 511。這不只是「常見 CPU 恰好如此」，而是 unsigned arithmetic 可以用 modulo `2^w` 理解。

Number wheel 上的 discontinuity 只有一處：最大正值到零。沿著遞增方向走，數值原本一路上升，跨過邊界突然變小。這就是投影片問答中 unsigned overflow 的位置。

這個行為可被有意利用，例如固定寬度 counter 或 circular sequence 的差值；但「定義良好」不等於「符合產品需求」。若觀看次數、金額或陣列大小悄悄回到零，程式語言契約雖然明確，應用仍然是錯的。動手寫這類程式時，先在運算前檢查 `max - a < b`，不要等結果產生後才用大小猜測是否溢位。

## Signed overflow：bit pattern 會轉，C 契約不保證

Two's-complement signed wheel 的順序不同。`000...000` 是零，走到 `011...111` 是最大正值；下一個 pattern `100...000` 卻是最小負值。從 -1 再往前則回到零。因此若只看 wheel，signed value 在正最大值與負最小值之間出現 discontinuity。

投影片特別加上但書：硬體仍會保留 modulo `2^w` 的低 bits，所以真實 two's-complement 機器上，+7 加一常看起來成為 -8；但 C 並沒有把 signed overflow 定義成可靠的 wraparound。程式不應依賴這個觀察。

差別會直接影響最佳化。若 compiler 能依 C 規則假設合法執行不會發生 signed overflow，它可能重排或移除依賴「溢位後變負」的檢查。因此這種寫法並不可靠：

```c
int sum = a + b;
if (sum < a) {
    /* too late: a + b may already have overflowed */
}
```

安全方向是先檢查 operands 是否會越界，或改用寬度足夠且語意適當的型別。若需求本來就是 modular arithmetic，應明確使用 unsigned type，而不是期待 signed type 模仿同一個圓環。

## 四個案例：寬度選擇會一路冒到產品表面

投影片最後用四組案例把 number wheel 從紙上帶回系統。它們不是四種新表示法，而是同一個問題的四種外觀：欄位寬度與業務生命週期不相容。

第一個是 PSY 的〈Gangnam Style〉觀看次數。投影片引用 YouTube 當年的公開說法：系統原本沒預期影片觀看次數超過 32-bit integer 上限 `2,147,483,647`，後來升級為 64-bit。投影片也同時列出 YouTube 的補充，表示團隊數月前已預見並更新系統。這個例子最適合說明「上限成為使用者可見事件」，不宜簡化成影片當場把 YouTube 計數器弄壞。

第二個是原始 Pac-Man 的 Map 256 glitch。投影片把它歸因於 8-bit level counter：通過第 255 關後，counter 無法直接表示 256，畫面右半部出現亂碼與不完整豆子，讓進度無法正常繼續。從表示法看，關鍵不是遊戲老，而是 8-bit unsigned pattern 只有 256 種，邊界終究會被碰到。

第三個是原始 Donkey Kong 的 level 22 kill screen。投影片給的 timer 公式是 `10 × (level + 4)`；第 22 關算出 260。它的 binary 是 `1 0000 0100`，但 8-bit 欄位只留得下 `0000 0100`，因此 Mario 只得到 4 個 time units，而不是設計預期的 260。這是一個可以直接手算的 modulo 題：`260 mod 256 = 4`。

第四組進到營運系統。投影片描述 2015 年 Boeing 787 generator control unit 的 signed 32-bit counter，在連續供電約 248.5 天後可能觸發控制單元關閉；四個單元若同步到達邊界，可能一起失去作用。投影片也描述 2004 年 Delta 排班軟體以 signed 16-bit counter 追蹤 crew changes，惡劣天候使計數越過 32,767 並繞到負值，妨礙可用機組員統計，伴隨大量延誤與取消。

這些案例的共同教訓不是「全部換 64-bit 就安全」。更大的寬度只把某些邊界推遠，沒有證明生命週期內永遠碰不到。真正的工程動作是先寫出欄位的單位、更新頻率、最大合理值與重設條件，再決定型別並測試邊界前後：最大值前一格、最大值、再加一，以及最小值附近。

## 把這講整理成三個層次

**表示層**問 pattern 如何解讀。Unsigned 讓所有權重為正；two's complement 讓 MSB 帶負權重。`1011` 本身只是一串 bits，型別決定它是 11 或 -5。

**算術層**問固定寬度保留哪些 bits。加法器做逐欄相加，超出的 carry 不在目的欄位內。Unsigned 把結果定義成 modulo `2^w`；signed 的 pattern 雖常呈現相同截斷，C 程式不能把超界當成保證。

**系統層**問欄位範圍是否覆蓋真實需求。影片流量、遊戲關卡、開機時間與排班變更都會把抽象 counter 推到邊界。型別不是只為了省幾個 bytes；它同時是對值域與生命週期的假設。

今晚可以做的練習很簡單：拿一張紙畫 4-bit wheel，把每個 pattern 同時標上 unsigned 與 signed 值；接著算 `7 + 1`、`-8 - 1`、`15 + 1`，分別寫下「保留的 pattern」「unsigned 解讀」「signed 解讀」和「C 是否允許依賴」。如果四欄能分開回答，這講最重要的模型就已經建立。

## 這講之後應該帶走什麼

1. 寬度 `w` 決定 pattern 數，編碼規則才決定每個 pattern 的數值。
2. `w`-bit unsigned range 是 `0` 到 `2^w - 1`。
3. `w`-bit two's-complement signed range 是 `-2^(w-1)` 到 `2^(w-1) - 1`。
4. 反相加一可在固定寬度內取得 additive inverse；相同加法硬體因此能處理正負 operands。
5. Unsigned arithmetic 有明確 modulo 語意；C signed overflow 不能當作 wraparound 契約。
6. Overflow 是值域設計問題。除了換型別，還要定義上限、檢查邊界並測試長時間累積。

下一講會把 bit pattern 從「被動表示數字」推到「主動操作欄位」：AND、OR、XOR、NOT 與 mask。若這講的 signed／unsigned 解讀沒有分清，下一講很容易只剩運算表；先掌握同一串 bits 可以有不同數值語意，bitwise operator 才會成為可推理的工具。

## 參考資料

- [Stanford CS107 Winter 2026 course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 3 slides: Bits and Bytes, Integer Representations](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/03/Lecture03.pdf)
- [SEI CERT C INT32-C: Ensure that operations on signed integers do not result in overflow](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int32-c/)
- [SEI CERT C INT31-C: Ensure that integer conversions do not result in lost or misinterpreted data](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int31-c/)
