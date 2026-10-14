---
title: "Knowledge——命題邏輯、模型檢查、推理規則與知識表示｜Harvard CS50 AI 第 1 週"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, logic, knowledge, model-checking, resolution, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 2
tldr: "第 1 週講怎麼讓程式依已知事實推出新事實：用命題符號與五個連結詞把知識寫成句子；model checking 列舉全部 2 的 n 次方種真假組合來判斷知識庫是否蘊涵某個查詢；推論規則與 resolution 改成直接操作句子，先轉成 CNF，再用反證法推出空子句；一階邏輯用常數、述詞與量詞減少符號數量。附逐段時間連結，以及 Knights、Minesweeper 兩個專案的解題思路、易錯處與檢查方式（參考實作摺疊）。"
description: "Harvard CS50 AI 第 1 週 Knowledge 導讀：依 2020 年講課錄影的字幕逐段整理命題邏輯的五個連結詞與真值表、model、知識庫與蘊涵、model checking 與 logic.py、Clue 與分院謎題的知識工程、推論規則、resolution 與 CNF 轉換、反證法，以及一階邏輯的述詞與量詞，每節附可點的時間連結與自我檢查，另有 Knights 與 Minesweeper 兩個專案的規格、解題思路、虛擬碼、易錯處、檢查方式與 check50 指令，完整參考實作摺疊在各專案最後。專案規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en)

**影片狀態：已附影片。** 全片 1:47:44。本文的「講課導讀」依這支錄影的英文字幕逐段寫成，每一節開頭有時間連結，點了頁面上的播放器會跳到那一段。講課沒有介紹本週專案，專案部分依課程官網與官方發佈的程式檔寫成；專案的完整參考實作預設不顯示，摺疊在各專案最後。[跳到播放器](#課程影片與時間軸)｜[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年課程官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

第 1 週處理的問題是：程式手上有幾句已知為真的話，怎麼判斷另一句話是不是一定為真。做法分三層。先用命題邏輯把知識寫成句子；再用 model checking（模型檢查）把所有真假組合列出來逐一檢查；組合太多時，改用推論規則（inference rule，也譯「推理規則」）與 resolution 直接從句子推出新句子。最後用一階邏輯說明命題邏輯為什麼需要那麼多符號。兩個專案分別是用 model checking 解邏輯謎題（Knights），以及自己設計知識表示來玩踩地雷（Minesweeper）。

這篇分成兩半：前半「講課導讀」跟著錄影走，後半是兩個專案的實作說明，講課沒有提到專案。

## 課程影片與時間軸

全片 1 小時 47 分，下面「講課導讀」的十個小節依序涵蓋整支錄影。每一節開頭和文中的時間連結都能點，頁面上的播放器會跳到那一段；某一節看不懂時，直接回去聽講者怎麼講。

```youtube
url: https://www.youtube.com/watch?v=HWQLez87vqM
title: Knowledge - Lecture 1 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube：[Week 1 Knowledge (2020 錄製)](https://www.youtube.com/watch?v=HWQLez87vqM)

> 時間說明：下表時間已依帶時間碼的英文字幕核對（2026-10-13），是講者開始講各主題的位置，不是官方章節。此表只描述這支 2020 年的錄影；課程目前版本的講課內容與順序可能不同，且影片本身沒有介紹本週專案。

| 時間（點了從該處播放） | 內容 |
|---|---|
| [0:00–3:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=0s) | knowledge-based agent，以及用三句話推出「今天有下雨」的例子 |
| [3:45–14:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=225s) | 命題邏輯：句子、命題符號、五個連結詞與真值表 |
| [14:30–22:31](https://www.youtube.com/watch?v=HWQLez87vqM&t=870s) | model、知識庫、蘊涵與推論 |
| [22:31–39:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=1351s) | model checking：八個 model 的例子、`logic.py` 與 `harry.py` |
| [39:45–54:03](https://www.youtube.com/watch?v=HWQLez87vqM&t=2385s) | 知識工程：把 Clue 寫成命題邏輯 |
| [54:03–1:04:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3243s) | 分院謎題、Mastermind，以及 model checking 的效率問題 |
| [1:04:28–1:17:43](https://www.youtube.com/watch?v=HWQLez87vqM&t=3868s) | 推論規則，把定理證明當成搜尋問題 |
| [1:17:43–1:30:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=4663s) | resolution 規則、子句、CNF 轉換、factoring 與空子句 |
| [1:30:30–1:37:38](https://www.youtube.com/watch?v=HWQLez87vqM&t=5430s) | 用 resolution 做反證 |
| [1:37:38–1:47:44](https://www.youtube.com/watch?v=HWQLez87vqM&t=5858s) | 一階邏輯：常數、述詞、全稱與存在量詞，課程收尾 |

> 官方筆記：[Week 1 Notes](https://cs50.harvard.edu/ai/2020/notes/1/)

## 講課導讀

以下依錄影的英文字幕逐段寫成。光讀字幕看不到投影片，所以真值表與 model 的表格是本文依講者口頭說出的內容排出來的，邏輯式用標準符號（¬、∧、∨、→、↔、⊨）寫出。每節結尾的自我檢查都是本文出的題目，不是講課內容；其中沿用講課例子的會寫明，標「本文自擬」的連例子也是本文編的。

### 從已知事實推出新事實

[錄影 0:00–3:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=0s)

講者 Brian Yu 先接上一週：搜尋處理的是 agent 在環境裡採取行動。這一週換一個角度，看人怎麼靠已知的事實推出結論，再把同一件事交給程式。能在內部表示知識、並依這些知識推理與行動的 agent，他稱為 **knowledge-based agent**。

他用一個哈利波特的例子說明什麼叫推理（[1:48](https://www.youtube.com/watch?v=HWQLez87vqM&t=108s)）。已知三句話：

1. 如果今天沒下雨，Harry 就去找了 Hagrid。
2. Harry 今天去找了 Hagrid 或 Dumbledore，但不是兩個都去。
3. Harry 今天去找了 Dumbledore。

從第 2、3 句可以知道 Harry 沒去找 Hagrid：只能去一個，而他去了 Dumbledore 那裡。再看第 1 句：沒下雨的話他一定會去找 Hagrid，但他沒去，所以今天有下雨。

三句話裡沒有任何一句提到「有下雨」，這個結論是推出來的。講者說這一週的主題就是這種推理，問題是怎麼讓程式也做得到。人用自然語言就能想，程式需要一套更形式化的寫法，下一節開始定義。

**自我檢查｜先寫下答案，再展開。** 把第 2 句的「但不是兩個都去」拿掉，只留「Harry 今天去找了 Hagrid 或 Dumbledore」。還推得出「今天有下雨」嗎？（改自講課例子，改法是本文自擬）

<details>
<summary>答案</summary>

推不出來。原本的推理靠「去了 Dumbledore 那裡，所以沒去 Hagrid 那裡」這一步，它需要「不是兩個都去」。拿掉之後，「今天沒下雨，Harry 兩個人都去找了」這個情況三句話全部成立，所以「有下雨」不再是必然。只要找得到一個三句都成立、結論卻不成立的情況，結論就不算被推出來，這個判斷方式在第三、四節會變成正式定義。

</details>

### 命題邏輯：符號與五個連結詞

[錄影 3:45–14:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=225s)

講者先定義**句子**（sentence）：在某種知識表示語言裡，對世界的一個斷言。這一週大部分時間用的語言是**命題邏輯**（propositional logic）。

命題邏輯的基本單位是**命題符號**，通常寫成 P、Q、R 這樣的字母，每個符號代表一件關於世界的事。例如 P 代表「正在下雨」，Q 代表「Harry 今天去找了 Hagrid」。要把符號組成更複雜的句子，需要**連結詞**（logical connectives）。講者介紹五個，每個都用真值表說明意思。

| 連結詞 | 符號 | 讀法 | 什麼時候為真 |
|---|---|---|---|
| Not | ¬P | 非 P | P 為假 |
| And | P ∧ Q | P 且 Q | P、Q 都為真 |
| Or | P ∨ Q | P 或 Q | P、Q 至少一個為真 |
| Implication | P → Q | 若 P 則 Q | 除了「P 真、Q 假」之外都為真 |
| Biconditional | P ↔ Q | P 若且唯若 Q | P、Q 真假相同 |

Not 只接一個句子，把真假反過來。其餘四個接兩個句子；兩個符號各有真假兩種狀態，所以真值表有 2 的 2 次方、也就是四列：

| P | Q | P ∧ Q | P ∨ Q | P → Q | P ↔ Q |
|---|---|---|---|---|---|
| 假 | 假 | 假 | 假 | 真 | 真 |
| 假 | 真 | 假 | 真 | 真 | 假 |
| 真 | 假 | 假 | 真 | 假 | 假 |
| 真 | 真 | 真 | 真 | 真 | 真 |

講者特別提醒三件事。

**Or 是「其中一個或兩個都」。** 日常說「或」有時指「只能二選一」，那是另一個符號 exclusive or，這一週不用。這裡的 P ∨ Q 只有在兩邊都為假時才是假。

**Implication 在前提為假時不做任何宣稱（[12:21](https://www.youtube.com/watch?v=HWQLez87vqM&t=741s)）。** 他的例句是「如果下雨，我就會待在室內」。下雨而我在室內，這句話成立；下雨而我不在室內，這句話就是假的。沒下雨的時候，這句話對我在哪裡什麼都沒說，所以不管我在室內還是室外，它都算真。P → Q 唯一為假的情況是前提 P 為真、結論 Q 為假。

**Biconditional 是兩個方向都成立的條件（[13:13](https://www.youtube.com/watch?v=HWQLez87vqM&t=793s)）。** 「我待在室內，若且唯若下雨」的意思是：下雨我就在室內，而且我在室內就代表下雨。它只有在 P、Q 同真或同假時為真。

**自我檢查｜先寫下答案，再展開。** 用講課的例句：P 是「下雨」，Q 是「我在室內」。今天沒下雨，我在室外，P → Q 與 P ↔ Q 各是真還是假？改成沒下雨、我在室內呢？

<details>
<summary>答案</summary>

沒下雨、在室外：P 假、Q 假。P → Q 為真，因為前提為假時 implication 不做宣稱。P ↔ Q 也為真，因為兩邊真假相同。

沒下雨、在室內：P 假、Q 真。P → Q 仍然為真，理由同上。P ↔ Q 為假，因為它還要求「在室內就代表下雨」，而現在在室內卻沒下雨。兩個連結詞的差別就在真值表的第二列。

</details>

### Model、知識庫與蘊涵

[錄影 14:30–22:31](https://www.youtube.com/watch?v=HWQLez87vqM&t=870s)

有了寫句子的語言，還需要幾個名詞才能談推理。

**Model** 是替每個命題符號指定一個真假值，講者說可以把它想成一個「可能的世界」。例如 P 是「正在下雨」、Q 是「今天是星期二」，「P 為真、Q 為假」就是一個 model，代表下雨而且不是星期二的那個世界。有 n 個符號，model 就有 2 的 n 次方個。

**知識庫**（knowledge base，簡稱 KB）是一組 AI 已知為真的句子。我們把問題的資訊告訴 AI，它存進知識庫，再用這些資訊推出其他結論。

**蘊涵**（entailment，[17:04](https://www.youtube.com/watch?v=HWQLez87vqM&t=1024s)）寫成 α ⊨ β，讀作「α 蘊涵 β」，定義是：在每一個 α 為真的 model 裡，β 也為真。講者的例子：α 是「今天是一月的某個星期二」，β 是「現在是一月」。只要是一月的星期二，就一定是一月，所以 α ⊨ β。

注意它和上一節 implication 的差別（這一段是本文補充的整理，講者沒有並排比較）：P → Q 是一個句子，在某個 model 裡有真有假；α ⊨ β 講的是兩個句子的關係，要看過所有 model 才能判斷。中文教材裡「蘊涵」「蘊含」也常用來指 implication，本文只用「蘊涵」指 entailment，implication 一律留英文。

**推論**（inference）是從舊句子導出新句子的過程。第一節從三句話得出「Harry 沒去找 Hagrid」與「今天有下雨」，就是推論。

講者再走一個例子（[19:21](https://www.youtube.com/watch?v=HWQLez87vqM&t=1161s)）。三個符號：P 是「今天是星期二」，Q 是「正在下雨」，R 是「Harry 會去跑步」。知識庫有三句：

- (P ∧ ¬Q) → R：如果今天是星期二而且沒下雨，Harry 就會去跑步
- P：今天是星期二
- ¬Q：沒下雨

P 為真，¬Q 為真，所以 P ∧ ¬Q 為真。Implication 的左邊為真，右邊就必須為真，所以 R 為真：Harry 會去跑步。

這一週所有演算法回答的都是同一個問題：給一個查詢 α，**KB ⊨ α 嗎？** 也就是只靠知識庫裡的句子，能不能確定 α 為真。

**自我檢查｜先寫下答案，再展開。** 把講課的例子反過來：「現在是一月」蘊涵「今天是一月的某個星期二」嗎？用定義回答。

<details>
<summary>答案</summary>

不蘊涵。定義要求在每一個「現在是一月」為真的 model 裡，「今天是一月的某個星期二」也為真。但有一個 model 是一月的星期三：前一句為真，後一句為假。只要有一個這樣的 model，蘊涵就不成立。蘊涵有方向，α ⊨ β 成立不代表 β ⊨ α 成立。

</details>

### Model checking：把所有可能的世界列出來

[錄影 22:31–39:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=1351s)

回答「KB ⊨ α 嗎」最直接的演算法是 **model checking**（模型檢查），它照著蘊涵的定義做：

1. 列舉所有 model。
2. 如果在每一個 KB 為真的 model 裡，α 也為真，KB 就蘊涵 α。
3. 否則不蘊涵。

講者用上一節跑步的例子走一遍，查詢是 R。三個符號，所以有 2 的 3 次方、也就是 8 個 model（[24:59](https://www.youtube.com/watch?v=HWQLez87vqM&t=1499s)）。他依序用知識庫的三句話排除：知識庫說 P 為真，P 為假的前四列不行；知識庫說 ¬Q，Q 為真的都不行；剩下 P 真、Q 假的兩列裡，R 為假的那一列違反 (P ∧ ¬Q) → R。

| P | Q | R | KB |
|---|---|---|---|
| 假 | 假 | 假 | 假 |
| 假 | 假 | 真 | 假 |
| 假 | 真 | 假 | 假 |
| 假 | 真 | 真 | 假 |
| 真 | 假 | 假 | 假 |
| 真 | 假 | 真 | **真** |
| 真 | 真 | 假 | 假 |
| 真 | 真 | 真 | 假 |

知識庫只在一個 model 裡為真，那個 model 的 R 為真，所以 KB ⊨ R。講者補充，其他問題可能有好幾個 model 讓知識庫為真；依演算法的定義，那時每一個都要檢查。表中 KB 那一欄是本文依他說的三個理由填的，並用下面的 `logic.py` 算過一次。

接著是程式（[27:17](https://www.youtube.com/watch?v=HWQLez87vqM&t=1637s)）。講者事先寫好一個 `logic.py`，每一種符號或連結詞各是一個類別：`Symbol`、`Not`、`And`、`Or`、`Implication`、`Biconditional`。他在 `harry.py` 裡用它把第一節的三句話寫成知識庫（註解是本文加的）：

```python
from logic import *

rain = Symbol("rain")              # 正在下雨
hagrid = Symbol("hagrid")          # Harry 去找了 Hagrid
dumbledore = Symbol("dumbledore")  # Harry 去找了 Dumbledore

knowledge = And(
    Implication(Not(rain), hagrid),   # 沒下雨就去找 Hagrid
    Or(hagrid, dumbledore),           # 去找 Hagrid 或 Dumbledore
    Not(And(hagrid, dumbledore)),     # 但不是兩個都去
    dumbledore                        # 去找了 Dumbledore
)

print(model_check(knowledge, rain))
```

「知道好幾件事」就是把它們包進一個 `And`。「或，但不是兩個都」拆成兩句：`Or(hagrid, dumbledore)` 加上 `Not(And(hagrid, dumbledore))`。每個句子都有 `formula()` 可以印出邏輯式，方便檢查自己寫對了沒有。執行結果是 `True`：在知識庫為真的每一個世界裡都有下雨。

`model_check` 本身長這樣（[34:36](https://www.youtube.com/watch?v=HWQLez87vqM&t=2076s)），下面是官方 `logic.py` 的原始碼：

```python
def model_check(knowledge, query):
    """Checks if knowledge base entails query."""

    def check_all(knowledge, query, symbols, model):
        """Checks if knowledge base entails query, given a particular model."""

        # If model has an assignment for each symbol
        if not symbols:

            # If knowledge base is true in model, then query must also be true
            if knowledge.evaluate(model):
                return query.evaluate(model)
            return True
        else:

            # Choose one of the remaining unused symbols
            remaining = symbols.copy()
            p = remaining.pop()

            # Create a model where the symbol is true
            model_true = model.copy()
            model_true[p] = True

            # Create a model where the symbol is false
            model_false = model.copy()
            model_false[p] = False

            # Ensure entailment holds in both models
            return (check_all(knowledge, query, remaining, model_true) and
                    check_all(knowledge, query, remaining, model_false))

    # Get all symbols in both knowledge and query
    symbols = set.union(knowledge.symbols(), query.symbols())

    # Check that knowledge entails query
    return check_all(knowledge, query, symbols, dict())
```

講者的說明對應到三個地方：

- 先收集知識庫與查詢裡出現的所有符號。
- `check_all` 每次拿出一個還沒指定的符號，做兩份 model，一份設成真、一份設成假，兩邊都遞迴下去，而且兩邊都要回傳 `True`。這樣就走遍了每一種真假組合。
- 符號都指定完之後，如果知識庫在這個 model 裡為真，就回傳查詢在這個 model 裡的真假；如果知識庫為假，直接回傳 `True`。講者的說法是：知識庫不成立的世界我們不在乎，就像前面那張表只看知識庫為真的那一列。

專案 Knights 附的 `logic.py` 和這一份只差一行錯誤訊息的例外類別，`model_check` 完全相同，下面專案 1A 用的就是它。

**自我檢查｜先寫下答案，再展開。** 用上面的 `harry.py`，把最後一行的查詢從 `rain` 換成 `hagrid`，會印出什麼？換成 `Not(hagrid)` 呢？（查詢是本文自擬，結果已實際執行）

<details>
<summary>答案</summary>

`model_check(knowledge, hagrid)` 印出 `False`，`model_check(knowledge, Not(hagrid))` 印出 `True`。

知識庫為真的世界只有一個：有下雨、沒去找 Hagrid、去找了 Dumbledore。在那個世界裡 `hagrid` 為假，所以知識庫不蘊涵 `hagrid`；`Not(hagrid)` 為真，所以蘊涵。

要小心的是，`model_check` 回傳 `False` 只代表「推不出這句為真」，不等於「這句為假」。要知道一個符號是不是確定為假，得另外查它的 `Not`。下一節的 Clue 程式就靠這兩次查詢分出「確定是」「確定不是」與「不知道」。

</details>

### 知識工程：把 Clue 寫成命題邏輯

[錄影 39:45–54:03](https://www.youtube.com/watch?v=HWQLez87vqM&t=2385s)

model checking 是通用的，真正要花工夫的是前一步：決定用哪些命題符號、把已知的事寫成哪些句子。講者把這件事叫**知識工程**（knowledge engineering），並用桌遊 Clue 示範（[40:46](https://www.youtube.com/watch?v=HWQLez87vqM&t=2446s)）。

簡化版的 Clue 有三個人（Colonel Mustard、Professor Plum、Miss Scarlet）、三個房間（ballroom、kitchen、library）、三種凶器（knife、revolver、wrench）。開局時一個人、一個房間、一種凶器的牌被放進信封，那就是答案；玩家靠看到的其他牌推理信封裡是什麼。

**符號。** 每張牌一個符號，共九個。符號為真代表那張牌在信封裡，例如 `mustard` 為真就是 Colonel Mustard 是凶手。

**規則寫成句子。** 信封裡一定有一個人、一個房間、一種凶器：

- mustard ∨ plum ∨ scarlet
- ballroom ∨ kitchen ∨ library
- knife ∨ revolver ∨ wrench

**遊戲中得到的資訊寫成句子。** 手上有某張牌，那張牌就不在信封裡，例如拿到 Professor Plum 就加一句 ¬plum。有人猜「Colonel Mustard 在 library 用 revolver」，接著有一張牌被亮給他看、但我沒看到是哪一張：我只知道這三張至少有一張不在信封裡，寫成 ¬mustard ∨ ¬library ∨ ¬revolver。

程式 `clue.py`（[45:31](https://www.youtube.com/watch?v=HWQLez87vqM&t=2731s)）定義了這九個符號，以及一個 `check_knowledge` 函式。它對每個符號查兩次：`model_check(knowledge, symbol)` 為真就印 YES；否則再查 `model_check(knowledge, Not(symbol))`，如果也推不出來就印 MAYBE。確定為假的符號不印。

講者一步一步加資訊，每加一次就重跑：

| 加進知識庫的句子 | 意思 | `check_knowledge` 的結果 |
|---|---|---|
| 三句規則 | 信封裡有一人、一房、一凶器 | 九個符號全是 MAYBE |
| ¬mustard、¬kitchen、¬revolver | 我手上有這三張牌 | 這三個消失；凶器剩 knife 與 wrench 兩個 MAYBE |
| ¬scarlet ∨ ¬library ∨ ¬wrench | 有人這樣猜，有一張牌被亮出但我沒看到 | 沒有新的結論 |
| ¬plum | 有人給我看 Professor Plum 這張牌 | scarlet 變成 YES |
| ¬ballroom | 有人給我看 ballroom 這張牌 | library 變成 YES，knife 也變成 YES |

最後一步（[52:29](https://www.youtube.com/watch?v=HWQLez87vqM&t=3149s)）的 library 好懂：三個房間排除了兩個。knife 就沒那麼明顯，講者說他自己也不會馬上想到。原因在第三列那句 ¬scarlet ∨ ¬library ∨ ¬wrench：現在已經確定是 scarlet、是 library，這一句要成立就只剩 ¬wrench，凶器不是 wrench 也不是 revolver，所以是 knife。加進去當下看不出用途的句子，後來成了關鍵。講者認為這正是交給演算法的好處：它會把每一種可能都檢查完。

**自我檢查｜先寫下答案，再展開。** 沿用上表前四列的知識庫。最後一步如果別人給我看的牌是 library 而不是 ballroom，也就是加的是 ¬library，`check_knowledge` 會印出什麼？（變式是本文自擬，結果已用官方 `logic.py` 實際執行）

<details>
<summary>答案</summary>

scarlet 是 YES，ballroom 是 YES，knife 與 wrench 仍然是 MAYBE。

房間排除了 kitchen 與 library，只剩 ballroom。但凶器這次定不下來：¬scarlet ∨ ¬library ∨ ¬wrench 這一句已經靠 ¬library 成立了，它不再對 wrench 有任何限制，knife 和 wrench 都還有可能。講課的版本能推出 knife，是因為 scarlet 和 library 都確定為真，那一句只能靠 ¬wrench 成立。

</details>

### 邏輯謎題、Mastermind 與 model checking 的極限

[錄影 54:03–1:04:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3243s)

同一套做法可以解一般的邏輯謎題。講者的題目是：Gilderoy、Minerva、Pomona、Horace 四個人各屬於 Gryffindor、Hufflepuff、Ravenclaw、Slytherin 其中一個學院，每個學院一個人。已知：

- Gilderoy 屬於 Gryffindor 或 Ravenclaw
- Pomona 不屬於 Slytherin
- Minerva 屬於 Gryffindor

**符號要 16 個**：每個「人＋學院」的組合一個，例如 `GilderoyGryffindor`、`GilderoyHufflepuff`，各自為真或為假。

**題目的前提也要寫成句子**，而且比線索多得多。每個人只能屬於一個學院，要寫成像 `PomonaSlytherin → ¬PomonaHufflepuff` 這樣的句子，四個人、每兩個不同學院各一句。每個學院只能有一個人，要寫成像 `MinervaRavenclaw → ¬GilderoyRavenclaw` 這樣的句子，四個學院、每兩個不同的人各一句。

程式 `puzzle.py`（[56:57](https://www.youtube.com/watch?v=HWQLez87vqM&t=3417s)）用迴圈產生這些句子：先對每個人加一句「屬於四個學院之一」的 `Or`，再用兩層迴圈對每個人、每對不同的學院 `h1`、`h2` 加一句 `Implication`，然後把人和學院的角色對調再做一次。最後加上三條線索，對 16 個符號逐一 `model_check`，印出確定為真的：Gilderoy 在 Ravenclaw，Pomona 在 Hufflepuff，Minerva 在 Gryffindor，Horace 在 Slytherin。講者自己也說，這樣寫相當繁瑣。

這份 `puzzle.py` 是講課的示範程式，和專案 Knights 裡同名的 `puzzle.py` 是兩個不同的檔案。

接著是簡化版的 Mastermind（[1:01:46](https://www.youtube.com/watch?v=HWQLez87vqM&t=3706s)）。紅、藍、綠、黃四種顏色排成某個順序，你猜一個順序，對方告訴你有幾個位置是對的。

- 猜「紅、藍、綠、黃」，回答是有兩個位置對。
- 把前兩個對調，猜「藍、紅、綠、黃」，回答是沒有任何位置對。

人可以這樣推：第二次全錯、第一次對兩個，兩次的差別只有紅和藍對調，所以第一次對的就是紅和藍，綠和黃的位置是錯的。講者沒有細講程式，只展示 `mastermind.py` 的執行結果：紅在位置 0，藍在位置 1，黃在位置 2，綠在位置 3。

他接著指出這支程式跑了好一陣子（[1:03:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3808s)）。model checking 要把每個符號的每一種真假都列出來，n 個符號就是 2 的 n 次方個世界。這幾個例子符號還算少，所以做得到；符號越多，這個方法越不可行。下一節開始找不必列舉所有世界的做法。

**自我檢查｜先寫下答案，再展開。** 分院謎題不用程式，用人的方式推一次。再算算看：16 個符號，model checking 要檢查幾個 model？（推理步驟與數字是本文自己算的）

<details>
<summary>答案</summary>

Minerva 在 Gryffindor，一個學院只能一個人，所以 Gilderoy 不在 Gryffindor；他只能是 Gryffindor 或 Ravenclaw，所以在 Ravenclaw。剩下 Hufflepuff 與 Slytherin 給 Pomona 與 Horace；Pomona 不在 Slytherin，所以在 Hufflepuff，Horace 在 Slytherin。和程式印出的結果相同。

16 個符號有 2 的 16 次方、也就是 65,536 個 model。Mastermind 的四種顏色乘四個位置也是 16 個符號，同樣是 65,536 個。人只用了四步，model checking 卻要看完六萬多個世界，而且每多一個符號就再翻一倍。

</details>

### 推論規則：不列舉世界，直接改寫句子

[錄影 1:04:28–1:17:43](https://www.youtube.com/watch?v=HWQLez87vqM&t=3868s)

**推論規則**（inference rule，也譯「推理規則」）是一種固定的改寫方式：手上有某種形式的句子，就可以寫下另一個句子。講者的寫法是畫一條橫線，線上是前提，線下是結論。他強調這和 model checking 的思路完全不同：這裡不看任何一個世界，只看手上有什麼句子、能得出什麼句子。

他一條一條用白話例子帶出來（從 [1:05:13](https://www.youtube.com/watch?v=HWQLez87vqM&t=3913s) 開始）：

| 規則 | 前提 | 結論 | 講課的例子 |
|---|---|---|---|
| Modus ponens | α → β，α | β | 如果下雨，Harry 就在室內；現在下雨。所以 Harry 在室內 |
| And elimination | α ∧ β | α（或 β） | Harry 和 Ron、Hermione 都是朋友。所以 Harry 和 Hermione 是朋友 |
| Double negation elimination | ¬(¬α) | α | 「Harry 沒通過考試」不是真的。所以 Harry 通過了考試 |
| Implication elimination | α → β | ¬α ∨ β | 如果下雨，Harry 就在室內。所以沒下雨，或 Harry 在室內 |
| Biconditional elimination | α ↔ β | (α → β) ∧ (β → α) | 下雨若且唯若 Harry 在室內。所以下雨則 Harry 在室內，且 Harry 在室內則下雨 |
| De Morgan's law | ¬(α ∧ β) | ¬α ∨ ¬β | 「Harry 和 Ron 都通過考試」不是真的。所以 Harry 沒通過，或 Ron 沒通過 |
| De Morgan's law | ¬(α ∨ β) | ¬α ∧ ¬β | 「Harry 或 Ron 通過考試」不是真的。所以 Harry 沒通過，而且 Ron 沒通過 |
| Distributive law | α ∧ (β ∨ γ) | (α ∧ β) ∨ (α ∧ γ) | 講者用乘法對加法的分配律來類比 |
| Distributive law | α ∨ (β ∧ γ) | (α ∨ β) ∧ (α ∨ γ) | 同上，方向對調 |

幾條值得多看一眼的：

- **Implication elimination** 把「如果⋯就⋯」換成「或」。講者的解釋是 α 只有兩種可能：α 為假；或 α 為真，這時 β 必須為真。所以 ¬α 與 β 至少一個成立。
- **De Morgan's law** 他的記法是：把否定往括號裡面搬，搬到每一個句子前面，同時把 and 換成 or，或把 or 換成 and（[1:12:24](https://www.youtube.com/watch?v=HWQLez87vqM&t=4344s)）。
- **Distributive law** 能把 or 搬進括號裡（[1:13:45](https://www.youtube.com/watch?v=HWQLez87vqM&t=4425s)），講者預告下一節會用到。

這些規則單看都很理所當然。講者說重點是程式不會自己知道這些，要明確告訴它有哪些規則可用；另外，難的是找出該組合哪幾條。

這正好是上一週的問題（[1:15:10](https://www.youtube.com/watch?v=HWQLez87vqM&t=4510s)）。講者把**定理證明寫成搜尋問題**：

| 搜尋問題的要素 | 在定理證明裡是什麼 |
|---|---|
| Initial state | 一開始的知識庫 |
| Actions | 所有可以套用的推論規則 |
| Transition model | 套用規則之後的新知識庫：舊的句子加上剛推出的那一句 |
| Goal test | 要證明的句子是不是已經在知識庫裡 |
| Path cost | 證明用了幾步 |

所以解迷宮的演算法也能拿來做證明。這是 model checking 之外的第二種方法。

**自我檢查｜先寫下答案，再展開。** 知識庫有兩句：「Harry 和 Ron 都通過了考試」與「如果 Harry 通過考試，他就會去慶祝」。用上表的規則證明「Harry 會去慶祝」，寫出每一步用了哪條規則。把它看成搜尋問題，path cost 是多少？（本文自擬）

<details>
<summary>答案</summary>

令 P 是「Harry 通過考試」，Q 是「Ron 通過考試」，C 是「Harry 會去慶祝」。知識庫是 P ∧ Q 與 P → C。

1. 對 P ∧ Q 用 and elimination，得到 P。
2. 對 P → C 與 P 用 modus ponens，得到 C。

C 進了知識庫，goal test 通過。用了兩條規則，path cost 是 2。整個過程沒有列出任何 model；三個符號用 model checking 要看 8 個。

</details>

### Resolution、子句與 CNF

[錄影 1:17:43–1:30:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=4663s)

第三種方法建立在另一條推論規則上，叫 **resolution**。講者說它相當強，能證明知識庫裡任何可以被證明的事。

先看最簡單的形式。已知「Ron 在 Great Hall，或 Hermione 在圖書館」，又知道「Ron 不在 Great Hall」，結論是 Hermione 在圖書館。「Ron 在 Great Hall」與「Ron 不在 Great Hall」彼此相反，講者稱為 **complementary literals**。這條規則叫 **unit resolution**（[1:18:49](https://www.youtube.com/watch?v=HWQLez87vqM&t=4729s)）：

- 前提：P ∨ Q，¬P
- 結論：Q

Q 不必是單一符號，可以是一長串：從 P ∨ Q₁ ∨ Q₂ ∨ … ∨ Qₙ 與 ¬P，得到 Q₁ ∨ Q₂ ∨ … ∨ Qₙ。P 也不必排在第一個，or 裡面的順序不影響。

再推廣一步（[1:20:18](https://www.youtube.com/watch?v=HWQLez87vqM&t=4818s)）。已知「Ron 在 Great Hall，或 Hermione 在圖書館」，以及「Ron 不在 Great Hall，或 Harry 在睡覺」。Ron 只有兩種可能：他在 Great Hall，那第二句要成立，Harry 就在睡覺；他不在 Great Hall，那第一句要成立，Hermione 就在圖書館。所以「Hermione 在圖書館，或 Harry 在睡覺」。一般形式：

- 前提：P ∨ Q，¬P ∨ R
- 結論：Q ∨ R

同樣地，Q 和 R 都可以是一長串，結論就是兩串接起來。

resolution 的輸入有固定的形狀，講者在這裡定義幾個名詞（[1:22:23](https://www.youtube.com/watch?v=HWQLez87vqM&t=4943s)）：

- **Literal**：一個命題符號，或一個命題符號的否定。P 和 ¬P 都是。
- **Disjunction** 是用 or 連起來的一串；**conjunction** 是用 and 連起來的一串。
- **子句**（clause）：literal 的 disjunction，例如 P ∨ Q ∨ R。
- **Conjunctive normal form（CNF）**：子句的 conjunction，例如 (A ∨ B ∨ C) ∧ (D ∨ ¬E) ∧ (F ∨ G)。括號裡是子句，子句之間用 and 連接，子句裡面用 or 連接。

任何命題邏輯的句子都能轉成 CNF，步驟是（[1:24:10](https://www.youtube.com/watch?v=HWQLez87vqM&t=5050s)）：

1. **消去 biconditional**：α ↔ β 改成 (α → β) ∧ (β → α)。
2. **消去 implication**：α → β 改成 ¬α ∨ β。
3. **把否定往內搬**：用 De Morgan's law，直到每個 ¬ 都緊貼著命題符號。
4. **用 distributive law 把 or 搬進去**，讓 and 留在最外層。

每一步都是上一節的推論規則。講者示範把 (P ∨ Q) → R 轉成 CNF（[1:26:03](https://www.youtube.com/watch?v=HWQLez87vqM&t=5163s)）：

| 步驟 | 句子 | 用的規則 |
|---|---|---|
| 原式 | (P ∨ Q) → R | |
| 消去 implication | ¬(P ∨ Q) ∨ R | implication elimination |
| 否定往內搬 | (¬P ∧ ¬Q) ∨ R | De Morgan's law |
| 把 or 搬進去 | (¬P ∨ R) ∧ (¬Q ∨ R) | distributive law |

最後一行是兩個子句用 and 連接，就是 CNF。

轉成 CNF 的用處是（[1:27:54](https://www.youtube.com/watch?v=HWQLez87vqM&t=5274s)）：子句正是 resolution 的輸入。兩個子句裡只要有一對 complementary literals，就能 resolve 出一個新子句。講者補了兩個細節：

- **Factoring**：P ∨ Q ∨ S 與 ¬P ∨ R ∨ S 做 resolution，會得到 Q ∨ S ∨ R ∨ S。重複的 S 沒有意義，去掉一個，變成 Q ∨ R ∨ S。
- **空子句**（empty clause，[1:29:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=5368s)）：P 與 ¬P 做 resolution，兩邊除了這對 literal 之外什麼都沒有，結果是一個空的子句。空子句永遠為假，因為 P 與 ¬P 不可能同時成立。下一節的演算法就靠它。

**自我檢查｜先寫下答案，再展開。** 把 P → (Q ∧ R) 轉成 CNF。轉完之後，如果另外知道 P，resolution 能得出什麼？（本文自擬）

<details>
<summary>答案</summary>

沒有 biconditional，從第 2 步開始。消去 implication：¬P ∨ (Q ∧ R)。沒有需要往內搬的否定。用 distributive law 把 or 搬進去：(¬P ∨ Q) ∧ (¬P ∨ R)。這就是 CNF，有兩個子句。

加上 P 之後，P 與 ¬P ∨ Q 的 P、¬P 互補，resolve 得到 Q；P 與 ¬P ∨ R 同理得到 R。結果和直接看原式的直覺一致：P 成立，所以 Q 和 R 都成立。

</details>

### 用 resolution 做反證

[錄影 1:30:30–1:37:38](https://www.youtube.com/watch?v=HWQLez87vqM&t=5430s)

要判斷 KB ⊨ α，講者用的是**反證法**（proof by contradiction）：先假設要證的事為假，如果會導出矛盾，它就必須為真。在這裡就是假設 ¬α，看 KB 加上 ¬α 會不會矛盾。演算法是：

1. 把 KB ∧ ¬α 轉成 CNF。
2. 反覆檢查有沒有兩個子句能做 resolution，能就產生新子句，加進去繼續用。
3. 如果產生了空子句，就是矛盾，所以 KB ⊨ α。
4. 如果再也產生不出新子句，而空子句一直沒出現，就不蘊涵。講者說這一點可以證明，但課堂上不證。

他走的例子（[1:34:15](https://www.youtube.com/watch?v=HWQLez87vqM&t=5655s)）：知識庫是 (A ∨ B) ∧ (¬B ∨ C) ∧ ¬C，問它蘊涵 A 嗎？

假設 ¬A，加進去。這已經是 CNF，共四個子句：A ∨ B、¬B ∨ C、¬C、¬A。

| 步 | 拿來 resolve 的兩個子句 | 互補的 literal | 得到的新子句 |
|---|---|---|---|
| 1 | ¬B ∨ C 與 ¬C | C、¬C | ¬B |
| 2 | A ∨ B 與 ¬B | B、¬B | A |
| 3 | A 與 ¬A | A、¬A | 空子句 |

出現空子句，代表「知識庫為真而 A 為假」不可能，所以知識庫蘊涵 A。講者說，寫成程式時可以直接對所有子句兩兩檢查有沒有互補的 literal。

和 model checking 相比，這裡完全沒有列舉世界，只是不斷從現有的子句推出新子句，看會不會撞到矛盾。

**自我檢查｜先寫下答案，再展開。** 用這一節的演算法，重新證明第一節的結論「今天有下雨」。知識庫是 ¬rain → hagrid、hagrid ∨ dumbledore、¬(hagrid ∧ dumbledore)、dumbledore。（知識庫沿用講課的 `harry.py`，用 resolution 來證是本文自擬）

<details>
<summary>答案</summary>

先轉成 CNF。¬rain → hagrid 消去 implication 是 ¬(¬rain) ∨ hagrid，去掉雙重否定得到 rain ∨ hagrid。¬(hagrid ∧ dumbledore) 用 De Morgan's law 得到 ¬hagrid ∨ ¬dumbledore。另外兩句本來就是子句。再加上反證的假設 ¬rain，一共五個子句：

rain ∨ hagrid、hagrid ∨ dumbledore、¬hagrid ∨ ¬dumbledore、dumbledore、¬rain。

1. ¬hagrid ∨ ¬dumbledore 與 dumbledore，得到 ¬hagrid。
2. rain ∨ hagrid 與 ¬hagrid，得到 rain。
3. rain 與 ¬rain，得到空子句。

出現矛盾，所以知識庫蘊涵 rain。這三步和第一節人的推理順序一樣：先得出沒去找 Hagrid，再得出有下雨。hagrid ∨ dumbledore 這個子句沒有用到。

</details>

### 一階邏輯：用述詞與量詞少寫一點符號

[錄影 1:37:38–1:47:44](https://www.youtube.com/watch?v=HWQLez87vqM&t=5858s)

講者最後回頭看命題邏輯的限制。分院謎題為了表達很簡單的事，用了 `MinervaGryffindor`、`MinervaHufflepuff`、`MinervaRavenclaw`、`MinervaSlytherin` 這樣一整排符號。它們明明都在講 Minerva，命題邏輯卻沒辦法表達這層關係，每個符號只是一個獨立的真或假。

**一階邏輯**（first-order logic）把符號分成兩種（[1:39:23](https://www.youtube.com/watch?v=HWQLez87vqM&t=5963s)）：

- **常數符號**（constant symbol）代表物件：Minerva、Pomona、Horace、Gilderoy，以及 Gryffindor、Hufflepuff、Ravenclaw、Slytherin。
- **述詞符號**（predicate symbol）像一個回傳真假的函數，描述某個性質或關係在常數上成不成立：Person、House、BelongsTo。

句子就寫成述詞套在常數上：

| 一階邏輯的句子 | 意思 |
|---|---|
| Person(Minerva) | Minerva 是一個人 |
| House(Gryffindor) | Gryffindor 是一個學院 |
| ¬House(Minerva) | Minerva 不是學院 |
| BelongsTo(Minerva, Gryffindor) | Minerva 屬於 Gryffindor |

命題邏輯的五個連結詞在這裡照樣能用。述詞可以接一個參數，也可以像 BelongsTo 接兩個，表示兩個物件之間的關係。講者算了一下：命題邏輯要 16 個符號，這裡四個人加四個學院只要 8 個常數符號，再配上述詞就能組出所有句子。

一階邏輯另外多了**量詞**（quantifier，[1:42:56](https://www.youtube.com/watch?v=HWQLez87vqM&t=6176s)），有兩種。

**全稱量詞**（universal quantification）寫成 ∀，表示對變數的所有值都成立：

- ∀x. BelongsTo(x, Gryffindor) → ¬BelongsTo(x, Hufflepuff)
- 讀法：對所有物件 x，如果 x 屬於 Gryffindor，x 就不屬於 Hufflepuff。也就是 Gryffindor 的人都不是 Hufflepuff 的人。

**存在量詞**（existential quantification，[1:44:23](https://www.youtube.com/watch?v=HWQLez87vqM&t=6263s)）寫成 ∃，表示至少有一個值讓它成立：

- ∃x. House(x) ∧ BelongsTo(Minerva, x)
- 讀法：存在某個物件 x，x 是學院，而且 Minerva 屬於 x。也就是 Minerva 屬於某個學院。

兩種可以合在一起用：

- ∀x. Person(x) → (∃y. House(y) ∧ BelongsTo(x, y))
- 讀法：對所有 x，如果 x 是人，就存在某個 y，y 是學院而且 x 屬於 y。也就是每個人都屬於某個學院。

分院謎題裡「每個人都屬於某個學院」原本要對每個人各寫一句四個符號的 `Or`，這裡一句就說完了；這個對照是本文加的。

講者提到還有二階邏輯與更高階的邏輯，沒有展開。他的收尾是：不管用哪一種邏輯，目的都是讓 AI 能表示它知道的事，並從中推出結論。這一週處理的都是確定為真或確定為假的知識，下一週要處理不確定性。

**自我檢查｜先寫下答案，再展開。** 用一階邏輯寫出「有人屬於 Slytherin」。括號裡該用 ∧ 還是 →？為什麼？（本文自擬）

<details>
<summary>答案</summary>

∃x. Person(x) ∧ BelongsTo(x, Slytherin)。

要用 ∧，和講課那句 ∃x. House(x) ∧ BelongsTo(Minerva, x) 的寫法一樣。如果寫成 ∃x. Person(x) → BelongsTo(x, Slytherin)，只要找得到一個不是人的物件就會成立：取 x 為 Gryffindor，Person(Gryffindor) 為假，第二節說過前提為假的 implication 為真，整句就成立了，就算 Slytherin 裡一個人也沒有。

全稱量詞剛好相反，講課的 ∀ 例子都搭配 →，意思是「只對符合前提的 x 提出要求」。這個對照是本文的整理，講者沒有明說。

</details>

## 專案 1A：Knights —— 邏輯謎題求解器

課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)不允許在繳交前看別人的解答，所以下面兩個專案預設只寫任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方與檢查方式；完整參考實作摺疊在各專案的最後。

### 任務

在 `puzzle.py` 裡替四個 Knights and Knaves 謎題各寫一個知識庫（`knowledge0` 到 `knowledge3`），讓 `main` 用 model checking 推出每個角色是 knight 還是 knave。規則：每個角色不是 knight 就是 knave；knight 說的每句話都是真的，knave 說的每句話都是假的。

四個謎題（官方規格原文）：

- Puzzle 0：A 說 "I am both a knight and a knave."
- Puzzle 1：A 說 "We are both knaves."，B 什麼都沒說。
- Puzzle 2：A 說 "We are the same kind."，B 說 "We are of different kinds."
- Puzzle 3：A 說了 "I am a knight." 或 "I am a knave." 其中一句，但不知道是哪一句；B 說 "A said 'I am a knave.'"，接著又說 "C is a knave."；C 說 "A is a knight."

規格另外要求兩件事：不要修改 `logic.py`；知識庫要是謎題資訊的直接翻譯，不能自己先推出答案再寫進去。規格舉的反例是把 `knowledge0` 直接設成 `AKnave`，輸出會對，但違反這個專案的用意。

### 官方已提供的程式

下面是官方 `puzzle.py` 的完整內容。六個命題符號與 `main` 都已經寫好，要填的只有四個 `And(...)` 裡標著 `# TODO` 的地方。

```python
from logic import *

AKnight = Symbol("A is a Knight")
AKnave = Symbol("A is a Knave")

BKnight = Symbol("B is a Knight")
BKnave = Symbol("B is a Knave")

CKnight = Symbol("C is a Knight")
CKnave = Symbol("C is a Knave")

# Puzzle 0
# A says "I am both a knight and a knave."
knowledge0 = And(
    # TODO
)

# Puzzle 1
# A says "We are both knaves."
# B says nothing.
knowledge1 = And(
    # TODO
)

# Puzzle 2
# A says "We are the same kind."
# B says "We are of different kinds."
knowledge2 = And(
    # TODO
)

# Puzzle 3
# A says either "I am a knight." or "I am a knave.", but you don't know which.
# B says "A said 'I am a knave'."
# B says "C is a knave."
# C says "A is a knight."
knowledge3 = And(
    # TODO
)


def main():
    symbols = [AKnight, AKnave, BKnight, BKnave, CKnight, CKnave]
    puzzles = [
        ("Puzzle 0", knowledge0),
        ("Puzzle 1", knowledge1),
        ("Puzzle 2", knowledge2),
        ("Puzzle 3", knowledge3)
    ]
    for puzzle, knowledge in puzzles:
        print(puzzle)
        if len(knowledge.conjuncts) == 0:
            print("    Not yet implemented.")
        else:
            for symbol in symbols:
                if model_check(knowledge, symbol):
                    print(f"    {symbol}")


if __name__ == "__main__":
    main()
```

`main` 對每個謎題、每個符號各呼叫一次 `model_check(knowledge, symbol)`，為真就把符號印出來。`logic.py` 與講課那一份幾乎相同（見上面「[Model checking：把所有可能的世界列出來](#model-checking把所有可能的世界列出來)」一節），`And`、`Or`、`Not`、`Implication`、`Biconditional` 都可以互相巢狀。

### 解題思路

規格的提示把要寫的資訊分成兩類：謎題本身的結構，以及角色實際說了什麼。

**結構。** 每個出場的角色各要兩句：他是 knight 或 knave；他不會兩者都是。這和講課處理「Harry 去找了 Hagrid 或 Dumbledore，但不是兩個都去」的寫法相同，拆成一個「或」加一個「不是兩者都」（[27:17](https://www.youtube.com/watch?v=HWQLez87vqM&t=1637s) 起的 `harry.py`）。

**發言。** 角色 X 說了一句話 S。先把 S 本身翻成命題邏輯的句子，再問：S 在什麼條件下為真、什麼條件下為假？X 是 knight 時 S 為真，X 是 knave 時 S 為假，所以寫成兩句：(X 是 knight) → S，以及 (X 是 knave) → ¬S。這裡用的是[第二節](#命題邏輯符號與五個連結詞)的 implication：前提不成立時，這一句不做任何宣稱。

S 的翻譯是這個專案真正要想的部分：

- 「我們都是 knave」是兩個符號的 and。
- 「我們是同一種」有兩種成立方式：都是 knight，或都是 knave。「我們是不同種」同理。
- Puzzle 3 的 B 說的是「A 說了某句話」。這時 S 是「A 說了『我是 knave』」這件事，和「A 是 knave」是兩回事。把「A 說了 T」當成一個句子，用上面同一套方法寫出來（A 是 knight 則 T，A 是 knave 則非 T），再整個放進 B 的那兩句裡。
- Puzzle 3 的 A 說了兩句其中一句：把「A 說了第一句」與「A 說了第二句」各寫成一個句子，中間用 or 連起來。

整體做法就是講課「[知識工程](#知識工程把-clue-寫成命題邏輯)」那一節的流程：選符號、把規則寫成句子、把得到的資訊寫成句子，剩下交給 model checking（[40:46](https://www.youtube.com/watch?v=HWQLez87vqM&t=2446s)）。

### 虛擬碼

```text
對每個謎題：
    知識庫 ← 空的 And

    對每個出場的角色 X：
        加入：X 是 knight，或 X 是 knave
        加入：X 不會同時是 knight 與 knave

    對每一句發言（說話的人 X，內容 S）：
        把 S 翻成命題邏輯的句子
            S 若是「Y 說了 T」：
                先寫出「Y 說了 T」這個句子：
                    (Y 是 knight → T) 而且 (Y 是 knave → 非 T)
                再把它當成 S
        加入：X 是 knight → S
        加入：X 是 knave → 非 S

    只知道 X 說了 S1、S2 其中一句時：
        加入：(X 說了 S1) 或 (X 說了 S2)
```

### 容易出錯的地方

前三條是把寫錯的版本放進官方 `puzzle.py` 實際執行看到的現象（2026-10-13），後兩條是規格的要求。

- **Puzzle 3 底下什麼都沒印。** 知識庫太弱，推不出任何人的身分。本站這篇文章先前的參考實作就是這樣：它把 A 那句不確定的話寫成「A 是 knight 則 A 是 knight」這類恆真的句子，等於沒有加資訊；B 的轉述又只寫了 A 是 knight 的那一半。另一種常見的寫法是把 B 的話當成「A 是 knave」，結果一樣，Puzzle 3 底下是空的。看到某一題沒有輸出，先檢查有沒有哪一句其實永遠為真。
- **只寫 knight 的那一半。** 每句發言只加「X 是 knight → S」，漏掉「X 是 knave → 非 S」。實跑的結果是 Puzzle 1 與 Puzzle 2 只印出 A 的身分，B 不見了；Puzzle 3 只印出 B。少印角色，多半是少了 knave 那一半。
- **同一個角色 Knight 與 Knave 都印出來。** 知識庫自相矛盾。知識庫在任何 model 裡都不成立時，`model_check` 對每個查詢都回傳 `True`（見導讀裡 `check_all` 對知識庫為假的處理），所以六個符號全部被印出，連沒出場的 C 也在內。實跑時故意在 Puzzle 1 加進一對互相矛盾的句子，輸出就是六行。
- **輸出正確，但知識庫是自己推理後的結論。** 規格明說這樣不算。檢查方式是回頭看每一句能不能對應到謎題裡的一句話或一條規則。
- **Knights 要 100% 通過才算過關**，其他專案的 70% 門檻在這裡不適用（官方規格）。

### 怎麼檢查自己寫的對不對

**先用手推出答案，再和程式比。** 每題的角色只有一到三個，身分的組合最多 8 種，可以全部列出來：對每一種組合，檢查「每個 knight 說的話都為真、每個 knave 說的話都為假」是否成立，留下來的那一種就是答案。Puzzle 3 要多分一層：A 說的是哪一句不知道，所以每種身分組合再分「A 說了第一句」「A 說了第二句」兩種情況，共 16 種；只要其中一種情況下每個人的話都說得通，這個身分組合就留下。四題都只有一種身分組合留下來（獨立審稿者用另外寫的列舉程式確認過）。

規格的 Background 示範了 Puzzle 0：A 如果是 knight，那句話就得是真的，但沒有人能同時是 knight 和 knave，所以 A 是 knave。你的程式在 Puzzle 0 底下應該只印 `A is a Knave`。

**看輸出的形狀。** 正確的輸出裡，每個出場的角色恰好印出一行：Puzzle 0 一行，Puzzle 1 與 Puzzle 2 各兩行，Puzzle 3 三行。少行、多行或空白，對照上一節找原因。

**印出邏輯式檢查翻譯。** 每個知識庫都有 `formula()`，印出來逐句對照謎題，確認每一句都對得上原文。

**官方檢查：**

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/knights.zip
unzip knights.zip && cd knights

python puzzle.py

check50 ai50/projects/2024/x/knights
# 注意：Knights 專案需 100% 通過才算過關（非 70%）

style50 puzzle.py
```

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。

符號定義與每題的註解是官方 `puzzle.py` 原有的，`And(...)` 裡面的內容是參考實作。

```python
# puzzle.py 片段
from logic import *

AKnight = Symbol("A is a Knight")
AKnave = Symbol("A is a Knave")

BKnight = Symbol("B is a Knight")
BKnave = Symbol("B is a Knave")

CKnight = Symbol("C is a Knight")
CKnave = Symbol("C is a Knave")

# Puzzle 0
# A says "I am both a knight and a knave."
knowledge0 = And(
    Or(AKnight, AKnave),
    Not(And(AKnight, AKnave)),
    Implication(AKnight, And(AKnight, AKnave)),
    Implication(AKnave, Not(And(AKnight, AKnave)))
)

# Puzzle 1
# A says "We are both knaves."
# B says nothing.
knowledge1 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, And(AKnave, BKnave)),
    Implication(AKnave, Not(And(AKnave, BKnave)))
)

# Puzzle 2
# A says "We are the same kind."
# B says "We are of different kinds."
knowledge2 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, Or(And(AKnight, BKnight), And(AKnave, BKnave))),
    Implication(AKnave, Not(Or(And(AKnight, BKnight), And(AKnave, BKnave)))),
    Implication(BKnight, Or(And(AKnight, BKnave), And(AKnave, BKnight))),
    Implication(BKnave, Not(Or(And(AKnight, BKnave), And(AKnave, BKnight))))
)

# Puzzle 3
# A says either "I am a knight." or "I am a knave.", but you don't know which.
# B says "A said 'I am a knave'."
# B says "C is a knave."
# C says "A is a knight."

# 「A 說了『I am a knight.』」與「A 說了『I am a knave.』」各自代表的限制
a_said_knight = And(Implication(AKnight, AKnight), Implication(AKnave, Not(AKnight)))
a_said_knave = And(Implication(AKnight, AKnave), Implication(AKnave, Not(AKnave)))

knowledge3 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Or(CKnight, CKnave), Not(And(CKnight, CKnave)),
    # A 說了兩句其中一句
    Or(a_said_knight, a_said_knave),
    # B 的第一句："A said 'I am a knave'."
    Implication(BKnight, a_said_knave),
    Implication(BKnave, Not(a_said_knave)),
    # B 的第二句："C is a knave."
    Implication(BKnight, CKnave),
    Implication(BKnave, Not(CKnave)),
    # C 的發言："A is a knight."
    Implication(CKnight, AKnight),
    Implication(CKnave, Not(AKnight))
)
```

> **Puzzle 3 的關鍵**：B 轉述的是「A 說了什麼」，所以要先把「A 說了『I am a knave.』」本身寫成句子 `a_said_knave`，再套上 B 的身分。這一句對任何身分的 A 都不可能成立：Knight 不會說自己是 Knave，Knave 說這句就成了實話。所以 B 在說謊，B 是 Knave；B 的第二句也是假的，C 是 Knight；C 說的是實話，A 是 Knight。

把上面的知識庫放進官方的 `puzzle.py` 實際執行，輸出是：

```text
Puzzle 0
    A is a Knave
Puzzle 1
    A is a Knave
    B is a Knight
Puzzle 2
    A is a Knave
    B is a Knight
Puzzle 3
    A is a Knight
    B is a Knave
    C is a Knight
```

</details>

---

## 專案 1B：Minesweeper —— 踩地雷 AI

### 任務

完成 `minesweeper.py` 裡 `Sentence` 類別的四個方法（`known_mines`、`known_safes`、`mark_mine`、`mark_safe`）與 `MinesweeperAI` 類別的三個方法（`add_knowledge`、`make_safe_move`、`make_random_move`），做出一個靠邏輯推論玩踩地雷的 AI。規格對三個 AI 方法的要求：

- `add_knowledge(cell, count)`：得知 `cell` 是安全格、周圍有 `count` 顆地雷之後，更新 `self.moves_made`、`self.safes`、`self.mines`、`self.knowledge`，把推得出來的結論都推完。
- `make_safe_move()`：回傳一個已知安全而且還沒走過的格子；沒有就回傳 `None`。不能修改 AI 的任何狀態。
- `make_random_move()`：從沒走過、也不是已知地雷的格子裡隨機選一個；沒有就回傳 `None`。

規格允許替類別加新的方法；既有方法的定義與參數不能改。

### 官方已提供的程式

`Minesweeper` 類別（遊戲本身）整個寫好了，格子用 `(i, j)` 表示，`i` 是列、`j` 是行。`Sentence` 的建構、比較與字串表示也已經提供，四個方法留空：

```python
class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    def known_mines(self):
        """
        Returns the set of all cells in self.cells known to be mines.
        """
        raise NotImplementedError

    def known_safes(self):
        """
        Returns the set of all cells in self.cells known to be safe.
        """
        raise NotImplementedError

    def mark_mine(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be a mine.
        """
        raise NotImplementedError

    def mark_safe(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be safe.
        """
        raise NotImplementedError
```

`MinesweeperAI` 的 `__init__`、`mark_mine`、`mark_safe` 已經寫好，其餘三個方法留空。`add_knowledge` 的 docstring 把要做的五件事列出來了：

```python
class MinesweeperAI():
    """
    Minesweeper game player
    """

    def __init__(self, height=8, width=8):

        # Set initial height and width
        self.height = height
        self.width = width

        # Keep track of which cells have been clicked on
        self.moves_made = set()

        # Keep track of cells known to be safe or mines
        self.mines = set()
        self.safes = set()

        # List of sentences about the game known to be true
        self.knowledge = []

    def mark_mine(self, cell):
        """
        Marks a cell as a mine, and updates all knowledge
        to mark that cell as a mine as well.
        """
        self.mines.add(cell)
        for sentence in self.knowledge:
            sentence.mark_mine(cell)

    def mark_safe(self, cell):
        """
        Marks a cell as safe, and updates all knowledge
        to mark that cell as safe as well.
        """
        self.safes.add(cell)
        for sentence in self.knowledge:
            sentence.mark_safe(cell)

    def add_knowledge(self, cell, count):
        """
        Called when the Minesweeper board tells us, for a given
        safe cell, how many neighboring cells have mines in them.

        This function should:
            1) mark the cell as a move that has been made
            2) mark the cell as safe
            3) add a new sentence to the AI's knowledge base
               based on the value of `cell` and `count`
            4) mark any additional cells as safe or as mines
               if it can be concluded based on the AI's knowledge base
            5) add any new sentences to the AI's knowledge base
               if they can be inferred from existing knowledge
        """
        raise NotImplementedError

    def make_safe_move(self):
        """
        Returns a safe cell to choose on the Minesweeper board.
        The move must be known to be safe, and not already a move
        that has been made.

        This function may use the knowledge in self.mines, self.safes
        and self.moves_made, but should not modify any of those values.
        """
        raise NotImplementedError

    def make_random_move(self):
        """
        Returns a move to make on the Minesweeper board.
        Should choose randomly among cells that:
            1) have not already been chosen, and
            2) are not known to be mines
        """
        raise NotImplementedError
```

注意 AI 的 `mark_mine` 與 `mark_safe` 會把同一件事通知知識庫裡的每一個句子，所以 `Sentence` 的同名方法要負責更新自己。

### 解題思路

**為什麼不用講課的命題邏輯。** 規格的 Background 算過：每格一個命題符號，8×8 的棋盤就是 64 個符號、2 的 64 次方個 model。這正是講課說的 model checking 的極限（[1:03:28](https://www.youtube.com/watch?v=HWQLez87vqM&t=3808s)，見「[邏輯謎題、Mastermind 與 model checking 的極限](#邏輯謎題mastermind-與-model-checking-的極限)」）。所以這個專案換一種知識表示：一個句子是「一組格子，加上其中有幾顆地雷」，寫成 `{A, B, C} = 2`。知識庫仍然是「一組已知為真的句子」，推論仍然是「從舊句子導出新句子」（[18:58](https://www.youtube.com/watch?v=HWQLez87vqM&t=1138s)，見「[Model、知識庫與蘊涵](#model知識庫與蘊涵)」），只是句子的形狀與推論規則換了。

**單一句子能直接得出的結論**（規格 Background）：

- 地雷數是 0：這些格子全部安全。
- 格子數等於地雷數：這些格子全部是地雷。

**得知某一格的身分後，句子怎麼更新。** 句子只該談還不確定的格子。得知某格安全，就把它從句子拿掉，地雷數不變。得知某格是地雷，也把它拿掉，但地雷數要減一，因為它原本算在那個數字裡。規格的例子：`{A, B, C} = 2`，得知 C 是地雷之後變成 `{A, B} = 1`。

**兩個句子合起來的結論：子集推論。** 如果句子一的格子是句子二的格子的子集，那麼「句子二多出來的那些格子」裡的地雷數，就是兩個地雷數相減。規格的例子：`{A, B, C} = 1` 與 `{A, B, C, D, E} = 2`，得出 `{D, E} = 1`。

**`add_knowledge` 的五步**（官方 docstring）：記錄這一步；把這格標成安全；用周圍還不確定的格子建一個新句子；能標的格子都標；能推的新句子都推。最後兩步要反覆做：標了一格會讓某些句子變短，變短的句子可能又能標出新的格子，或成為別的句子的子集。規格特別提醒，每次知識有變動，都可能出現先前推不出來的結論。

這個「一直套規則直到沒有新東西」的迴圈，和講課用 resolution 反覆產生新子句、直到沒有新子句為止是同一種結構（「[用 resolution 做反證](#用-resolution-做反證)」，[1:30:30](https://www.youtube.com/watch?v=HWQLez87vqM&t=5430s)）；這個對照是本文加的。

### 虛擬碼

```text
句子（一組格子，其中的地雷數）

    哪些格子確定是地雷：
        格子數等於地雷數 → 全部
        其他情況 → 沒有

    哪些格子確定安全：
        地雷數是 0 → 全部
        其他情況 → 沒有

    得知某格是地雷：
        這格在句子裡 → 把它拿掉，地雷數減 1

    得知某格安全：
        這格在句子裡 → 把它拿掉，地雷數不變


add_knowledge（剛翻開的格子，它顯示的數字）

    把這格記成走過的一步，並標成安全
    用周圍還不確定的格子建一個新句子，加進知識庫
        （周圍已經知道身分的格子怎麼處理，自己想清楚，見下一節第一條）

    重複，直到一整輪下來沒有任何新結論：
        能確定的地雷與安全格都標起來
        任兩個句子有子集關係，就用規格的子集規則推出新句子


make_safe_move：回傳一個已知安全、還沒走過的格子；沒有就回傳「無」
make_random_move：從沒走過、也不是已知地雷的格子裡隨機選一個；沒有就回傳「無」
```

### 容易出錯的地方

以下的數字都來自 2026-10-13 的實跑：把參考實作改壞一處，接進官方 `minesweeper.py`，不開 pygame 視窗，用官方的 `Minesweeper` 類別模擬 300 局 8×8、8 顆地雷的遊戲（亂數種子固定為 50），每一步之後檢查 AI 標記的格子對不對。

- **建立新句子時，已知的地雷只排除、沒有從數字扣掉。** 句子會說「這幾格裡有 2 顆地雷」，其中 1 顆其實是已經排除的那一格，於是把安全格標成地雷，或反過來。實跑 300 局裡有 208 局出現標錯的格子。這個錯不會讓程式當掉；被標錯的格子之後會被當成安全步走出去，或被當成地雷永遠不碰，所以要靠下一節的檢查才抓得到。後半句是本文的推論，模擬在標錯的當下就停了，沒有量到後續。
- **判斷「這個句子是不是已經有了」沒有用到 `Sentence.__eq__`。** 官方有提供 `__eq__`，比的是格子與地雷數。如果重寫 `Sentence` 時漏掉它，或用物件是不是同一個來判斷，內容相同的句子會被當成新的，一再加進知識庫，「直到沒有新結論」的迴圈就不會結束。本站這篇文章先前的參考實作就少了 `__eq__`；拿掉它實跑，第一局就停不下來，30 秒後強制中止。程式跑很久沒有反應，先看這裡。
- **一邊走訪集合一邊修改它。** `known_mines` 如果直接回傳句子自己的格子集合，呼叫端又在走訪它的同時標記地雷，標記會從同一個集合拿掉格子。實跑 300 局裡有 216 局丟出 `RuntimeError: Set changed size during iteration`。規格的提示也有這一條。回傳複本，或先把結果收集起來再標記，都能避開。
- **`mark_safe` 也把地雷數減一。** 拿掉的是安全格，剩下的格子裡地雷數沒變。減了之後實跑 300 局有 223 局出現標錯的格子。
- **子集條件寫成「子集或相等」。** 兩個句子的格子相同時，相減會得到一個沒有格子的空句子。它被當成新結論加進知識庫，下一輪又被推出來一次，「直到沒有新結論」的迴圈不會結束。把條件從真子集改成子集或相等實跑，30 秒未結束；就算先排除「拿句子跟自己比」，結果一樣，因為標記之後可能有兩個句子變得一模一樣。
- **漏掉子集推論。** 程式照樣能玩，也不會標錯，只是比較常被迫亂猜：實跑 300 局贏 168 局，完整版本贏 200 局。勝率偏低而沒有標錯，先檢查這一步。
- **`make_safe_move` 改到狀態。** 規格要求它不能修改 `self.moves_made`、`self.mines`、`self.safes` 與 `self.knowledge`；走過的格子是在 `add_knowledge` 裡記錄的。

### 怎麼檢查自己寫的對不對

**先手算規格的三個小例子**，再用你的 `Sentence` 驗證：

| 情況 | 應該得到 |
|---|---|
| `{A, B, C} = 2`，得知 C 安全 | `{A, B} = 2`，A、B 都確定是地雷 |
| `{A, B, C} = 2`，得知 C 是地雷 | `{A, B} = 1`，還不能確定任何一格 |
| `{A, B, C} = 1` 與 `{A, B, C, D, E} = 2` | 推出 `{D, E} = 1` |

另外兩個邊界：`{D, E, G} = 0` 的三格全部安全；`{E, F, H} = 3` 的三格全部是地雷。這五個都是規格 Background 裡的例子。

**自己寫一個不開視窗的模擬。** 官方的 `Minesweeper` 類別有 `is_mine(cell)` 與 `nearby_mines(cell)`，可以直接拿來當裁判：開一局，反覆問 AI 要安全步，沒有就要隨機步；踩到地雷就結束，否則把那一格的數字交給 `add_knowledge`。每一步之後檢查三件事：

1. `ai.mines` 裡的每一格，`is_mine` 都為真。
2. `ai.safes` 裡沒有任何一格是地雷。
3. 安全步從來沒有踩到地雷；輸的每一局都是隨機步踩到的。

這三條在任何一局都不該被違反，一違反就是推論有錯，和運氣無關。

**勝率當作旁證。** AI 沒有安全步時只能猜，所以不會每局都贏，規格的提示也這樣說。本站的參考實作在 8×8、8 顆地雷的棋盤上，300 局贏 200 局（種子 50）；獨立審稿者換亂數種子重跑，300 局贏 198 局、1000 局贏 670 局。勝率大約三分之二。你的數字如果明顯偏低而前面三條都沒違反，多半是少推了東西。

**用圖形介面看。** `python runner.py` 可以自己玩或按 AI Move 讓 AI 走；依規格的說明，`runner.py` 會印出 AI 這一步是它認為安全的，還是隨機選的。

**官方檢查：**

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/minesweeper.zip
unzip minesweeper.zip && cd minesweeper
pip3 install -r requirements.txt  # pygame

# 人機對戰或 AI 自動玩
python runner.py

check50 ai50/projects/2024/x/minesweeper

style50 minesweeper.py
```

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。

`Sentence` 類別：

```python
# minesweeper.py 片段
class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    # __init__、__eq__、__str__ 是官方提供的
    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    # 以下四個方法是參考實作
    def known_mines(self):
        """格子數等於地雷數：全部是地雷"""
        if self.cells and len(self.cells) == self.count:
            return set(self.cells)
        return set()

    def known_safes(self):
        """地雷數是 0：全部安全"""
        if self.count == 0:
            return set(self.cells)
        return set()

    def mark_mine(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            # count 不變：拿掉的是安全格，剩下的格子裡地雷數一樣
```

`known_mines` 與 `known_safes` 回傳的是複本（`set(self.cells)`）而不是 `self.cells` 本身，呼叫端就算直接走訪結果並呼叫 `mark_mine`、`mark_safe`，也不會改到正在走訪的集合。

`MinesweeperAI` 要實作的三個方法：

```python
# minesweeper.py 片段：MinesweeperAI 裡要實作的三個方法
# （__init__、mark_mine、mark_safe 是官方提供的，這裡不重貼）

    def add_knowledge(self, cell, count):
        # 1、2：記錄這一步，並把這一格標成安全
        self.moves_made.add(cell)
        self.mark_safe(cell)

        # 3：用周圍「還不確定」的格子建立新句子
        cells = set()
        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):
                if (i, j) == cell:
                    continue
                if not (0 <= i < self.height and 0 <= j < self.width):
                    continue
                if (i, j) in self.mines:
                    count -= 1          # 已知是地雷：不放進句子，但要從數量扣掉
                elif (i, j) not in self.safes:
                    cells.add((i, j))
        new_sentence = Sentence(cells, count)
        if cells and new_sentence not in self.knowledge:
            self.knowledge.append(new_sentence)

        # 4、5：反覆推論，直到沒有新結論
        changed = True
        while changed:
            changed = False

            # 4：從現有句子找出確定的地雷與安全格
            mines, safes = set(), set()
            for sentence in self.knowledge:
                mines |= sentence.known_mines()
                safes |= sentence.known_safes()
            for mine in mines - self.mines:
                self.mark_mine(mine)
                changed = True
            for safe in safes - self.safes:
                self.mark_safe(safe)
                changed = True

            # 清掉已經沒有格子的句子
            self.knowledge = [s for s in self.knowledge if s.cells]

            # 5：子集推論。s1 是 s2 的真子集時，s2 − s1 這些格子裡有 count2 − count1 顆地雷
            inferred = []
            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1.cells < s2.cells:
                        candidate = Sentence(s2.cells - s1.cells, s2.count - s1.count)
                        if candidate not in self.knowledge and candidate not in inferred:
                            inferred.append(candidate)
            if inferred:
                self.knowledge.extend(inferred)
                changed = True

    def make_safe_move(self):
        for cell in self.safes:
            if cell not in self.moves_made:
                return cell
        return None

    def make_random_move(self):
        choices = [
            (i, j)
            for i in range(self.height)
            for j in range(self.width)
            if (i, j) not in self.moves_made and (i, j) not in self.mines
        ]
        return random.choice(choices) if choices else None
```

這份參考實作放在官方 `minesweeper.py` 的類別骨架裡，不開 pygame 視窗、直接用官方的 `Minesweeper` 類別模擬了 300 局 8×8、8 顆地雷的遊戲：過程中 AI 標成地雷或安全的格子沒有任何一格標錯，`make_safe_move` 也沒有踩到地雷；300 局裡贏了 200 局（約三分之二，換亂數種子會略有出入），輸的都是沒有安全步可走、隨機選格時踩到的。`runner.py` 的圖形介面與 `check50` 這次沒有跑。

</details>

---

## 學習檢核清單

- [ ] 能寫出五個連結詞的真值表，並說明 implication 在前提為假時為什麼算真
- [ ] 能說出 model、知識庫、蘊涵的定義，並對三個符號的知識庫手動做 model checking
- [ ] 能把一個小遊戲或謎題的規則寫成命題邏輯的句子（選符號、寫限制、加線索）
- [ ] 能說出講課的七種推論規則各自的前提與結論，並用它們寫出兩三步的證明
- [ ] 能把句子轉成 CNF，並用 resolution 反證法推出空子句
- [ ] 能把「每個人都屬於某個學院」這類句子用述詞與量詞寫成一階邏輯
- [ ] Knights：`python puzzle.py` 的輸出裡每個出場角色恰好一行，而且和自己列舉身分組合手推的結果相同
- [ ] Minesweeper：規格的三個小例子用自己的 `Sentence` 算出預期結果；模擬多局，AI 標記的地雷與安全格沒有任何一格標錯
- [ ] 兩個專案 `check50` 全綠

## 課程影片來源

官方 CS50 YouTube 播放清單（CS50's Introduction to Artificial Intelligence with Python，8 支）已於 2026-10-10 即時核對，第 1 週講課錄影在清單中。

原始影片：[Knowledge - Lecture 1 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=HWQLez87vqM)

課程與錄影入口：

- [CS50 AI Week 1 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/1/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-13）：用 yt-dlp 取得帶時間碼的英文字幕，讀完全片 1:47:44 後重寫「講課導讀」，各節起點、例子裡的句子與結果（Harry 的三句話、跑步例子的八個 model、Clue 每一步的 YES／MAYBE、分院與 Mastermind 的答案、CNF 轉換與 resolution 例子的每一步）都取自字幕；沒有看投影片，真值表與 model 表格是依口述排出來的。字幕把人名拼成 Gildaroy、把 conjunctive normal form 聽成 injunctive／conjunction normal form、把 R₂ 聽成 F2，本文依講課原始碼（`src1.zip` 的 `puzzle.py`）與上下文寫成 Gilderoy、conjunctive normal form、R₂。講者口頭示範 Clue 時是逐句 `knowledge.add(Not(...))`，公開的 `clue.py` 把手上三張牌合成一個 `And`，結果相同，本文依口述寫。`harry.py`、`puzzle.py`、`mastermind.py` 用官方原始碼實際執行過，輸出與字幕一致；Clue 各步的結果另用 `logic.py` 重算過。字幕全程未提到本週專案（Knights、Minesweeper），專案說明來自課程官網與官方發佈的程式檔。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 CS50 YouTube 播放清單即時核對，本週講課錄影存在，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。原時間碼無法驗證，改為依字幕估算的約略時間；拆開 Clue 與 Mastermind；移除播放清單「第 2 支」說法，改連到本週影片。
- 2026-10-13：播放器從文末來源區移到「課程影片與時間軸」，開頭補上片長。
- 2026-10-13：「核心概念速覽」依帶時間碼的字幕重寫成十節的「講課導讀」，每節附時間連結與一題自我檢查；時間表從約略分鐘改為實際起點。原速覽裡手寫的簡化版 `logic.py` 類別（`Symbol.evaluate` 寫成 `model[self]`，與官方用符號名稱查表的寫法不符）換成官方 `model_check` 原始碼；「CNF 轉換三步驟」補上講課的第四步（distributive law）。
- 2026-10-13：專案 1A 的 Puzzle 3 參考實作重寫。原本的寫法放進官方 `puzzle.py` 執行，Puzzle 3 推不出任何角色的身分；新版把「A 說了『I am a knave.』」寫成獨立的句子，實際執行得到 A 是 Knight、B 是 Knave、C 是 Knight。各題註解改回官方檔案的原文。
- 2026-10-13：專案 1B 的 `Sentence` 改成官方發佈的類別定義（補回 `__eq__` 與 `__str__`）；`add_knowledge` 重寫。原本的寫法在建立新句子時沒有扣掉已知地雷的數量，而且 `Sentence` 少了 `__eq__`，搭配文中的迴圈實際執行不會結束。新版用官方的 `Minesweeper` 類別模擬 300 局驗證過。標題與內文的「掃雷」改為「踩地雷」；TL;DR 原本把 Minesweeper 說成機率推斷，改為邏輯推理。
- 2026-10-13：依獨立審稿修正。Knights 的 `logic.py` 與講課那份其實差一行例外類別，兩處「就是同一份」的說法改掉；兩個文中時間連結移到講者說那句話的位置（12:21、1:12:24）；兩句講者沒說的後半句改成本文的說法或刪除；model checking 與推論規則第一次出現時補上標題用的譯名；修正 `known_mines` 回傳複本的理由，模擬勝局數註明會隨亂數種子變動；版本提醒的「OCW 官網」改為「課程官網」，「播放列表」改為「播放清單」。
- 2026-10-13：兩個專案節改成任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方、檢查方式在前，完整參考實作摺疊在各專案最後並加上警語，連到課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)。參考實作的程式碼沒有變動。學習檢核清單的兩個專案項目改成可以自己驗證的條件。
- 2026-10-13：依專案節複審修正。Minesweeper 的 `add_knowledge` 虛擬碼改粗，拿掉與實作一行對一行的細節；補一條易錯處（子集條件寫成「子集或相等」迴圈不會結束，已實跑）；Knights 的手推檢查補上 Puzzle 3 要多分的一層；兩句說法改準。tldr 與 description 改成與專案節現況相符。

## 參考資料

- [Week 1 Knowledge 講課頁](https://cs50.harvard.edu/ai/weeks/1/) — 影片、投影片、逐字稿、Quiz
- [Knowledge - Lecture 1（YouTube）](https://www.youtube.com/watch?v=HWQLez87vqM) — 「講課導讀」的底本，內容、例子與時間連結取自它的英文字幕
- [Week 1 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/1/) — 官方筆記，可對照投影片上的真值表與規則
- [講課原始碼 src1.zip](https://cdn.cs50.net/ai/2020/spring/lectures/1/src1.zip) — `logic.py`、`harry.py`、`clue.py`、`puzzle.py`、`mastermind.py`
- [Knights 專案規格](https://cs50.harvard.edu/ai/projects/1/knights/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/knights`（需 100%）
- [Minesweeper 專案規格](https://cs50.harvard.edu/ai/projects/1/minesweeper/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/minesweeper`
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
