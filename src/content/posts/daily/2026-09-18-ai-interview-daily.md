---
title: "AI Engineer 面試日練 — 2026-09-18：Coding"
date: 2026-09-18
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "今天練 Anthropic 技術篩選常出的 longest-match tokenizer 實作題——怎麼在字串上貪婪匹配最長詞彙、處理未知字元的合併策略,以及詞彙表變大時為什麼要換成 trie 才不會退化成 O(n²)。"
tldr: "今天的 Coding 輪練是 Anthropic Technical Screen 的一道真實題目——實作一個 case-sensitive 的 longest-match tokenizer:在每個位置貪婪匹配詞彙表裡最長的可能字串,輸出精確的 token id 與消耗掉的原文;沒有匹配時要能選擇「逐字元」或「合併連續未知字元」兩種 unknown-run 處理模式。核心概念涵蓋 WordPiece 這類次詞切分背後的 greedy longest-match-first 策略、詞彙表一大就該從線性掃描換成 trie(搭配 Aho-Corasick 式的失敗跳轉,像 Google 的 LinMaxMatch 一樣把複雜度從 O(n²) 壓到線性)、unknown-run 合併策略對下游訓練的實際影響,以及 Python 處理字串切片時常見的 off-by-one 陷阱。"
series:
  name: "AI Engineer 面試日練"
  order: 30
---

> 🌏 [English version](/en/posts/daily/2026-09-18-ai-interview-daily-en)

## 今日主題

星期五輪到 Coding。今天這題不是抽象的演算法題,而是「NLP infra 的地基」——tokenizer 幾乎是每個 LLM pipeline 的第一步,面試官很愛拿它出題,因為它同時考字串演算法(貪婪匹配、trie)、邊界條件處理(未知字元怎麼辦)跟工程判斷(詞彙表大小變化時該不該換資料結構)。這題來自 Anthropic 的 Technical Screen,屬於 Software Engineer 職缺,但內容完全是 ML infra 會遇到的真實情境,拿來練 AI Engineer 面試的 coding round 剛好對題。

## 核心概念速記

### Greedy longest-match-first:tokenizer 最常見的貪婪策略

WordPiece(BERT 系列用的次詞切分演算法)在推論時的核心邏輯就是「貪婪最長匹配」——從目前位置開始,找出詞彙表裡能匹配的最長前綴當作一個 token,消耗掉這段文字,再從下一個位置重複。這個策略的好處是實作直觀、結果可預期(同樣輸入永遠得到同樣切法),缺點是它是區域最優,不保證全域最少 token 數,面試時被追問「這樣切會不會有更好的切法」是常見的深挖方向。

### 詞彙表變大就該用 trie,否則會退化成 O(n²)

如果詞彙表很小,在每個起始位置逐一比對候選字串(從最長的候選開始往下試)完全沒問題;但詞彙表一旦到幾萬筆,傳統 MaxMatch 做法要用兩根指標(起點、逐步縮小的終點)去掃描,整體複雜度是關於輸入長度的平方。Google 在 Fast WordPiece Tokenization System 這篇研究裡提出 LinMaxMatch,把詞彙表組成一棵 trie(前綴樹),再借用 Aho-Corasick 的「匹配失敗時跳到失敗連結而不是整個重來」概念,把複雜度壓成線性。面試時提到「小詞彙表用線性掃描沒問題,大詞彙表要換 trie」,是展現你懂效能 trade-off 而不是死背演算法的關鍵一句話。

### Unknown-run 的兩種處理策略,直接影響下游訓練

輸入裡遇到詞彙表匹配不到的字元時,tokenizer 有兩種常見做法:逐字元各自產生一個 `UNK` token,或是把連續一整段匹配不到的字元合併成一個 `UNK` span。前者保留了「有幾個未知字元」的訊息,但會讓 `UNK` token 佔掉序列長度、稀釋掉真正有意義的 token;後者省 token,但下游模型會失去這段未知內容的長度資訊。這不是對錯題,是設計選擇,面試官通常想聽你講「取決於這段文字的使用場景」而不是背一個固定答案。

### Case-sensitive 匹配與「輸出可還原原文」的要求

這題特別強調 case-sensitive(大小寫視為不同字元)以及「輸出的 token 要能精確對應消耗掉的原文」——這代表你的回傳結構不能只給 token id,還要附帶這個 token 實際吃掉的原始子字串(和它在原文裡的起始位置)。這個要求乍看是細節,但其實是在測你會不會漏掉「輸出要能無損還原輸入」這種容易被忽略的正確性條件,是很多字串處理題的隱藏陷阱。

### Python 字串切片的 off-by-one 陷阱

這類題目在 Python 裡很容易在「候選子字串的結尾索引」上出錯——`text[i:i+length]` 跟 `text[i:j]`(其中 `j` 是排他上界)很容易搞混,尤其當你同時要維護「目前掃描到哪」跟「候選字串多長」兩個變數時。面試時建議明確用一個變數命名清楚代表「排他上界」(如 `end_exclusive`),並在寫完後用一個簡單例子(例如空字串候選、單字元候選)手動 trace 一次,能有效避免這個最常見的 bug 來源。

## 今日練習題

### 題目

給定一個詞彙表 `vocab: dict[str, int]`(key 是已知的 token 字串,value 是對應的 token id)和一段輸入文字 `text: str`,請實作一個 case-sensitive 的 longest-match tokenizer:從文字最前面開始,在每個位置貪婪匹配詞彙表裡「能匹配上的最長字串」當作一個 token,消耗掉這段文字後從下一個位置繼續;如果目前位置沒有任何詞彙表項目能匹配(哪怕長度是 1),就要處理成一個 unknown token。函式需要支援一個參數 `coalesce_unknown: bool`,決定未知字元要「逐字元各自輸出一個 unknown token」還是「把連續一整段匹配不到的字元合併成一個 unknown token」。回傳值必須是一個 list,每個元素包含:token id(unknown 時用 `None` 表示)、這個 token 實際消耗掉的原始子字串、以及它在原文裡的起始 offset——確保光看回傳值就能無損重建原始輸入。額外討論題:如果詞彙表從幾百筆成長到幾萬筆,你的實作在效能上會遇到什麼問題,你會怎麼改?

**來源**：PracHub Knowledge Hub（Anthropic Interview Question，Technical Screen 階段收錄）　**難度**：中等　**環節**：technical screen

### 拆解思路

1. **先釐清問題**：先問清楚詞彙表裡是否可能有空字串或重複 key(通常沒有,但問清楚能顯示你在乎邊界條件)、"最長匹配" 在長度相同的多個候選時要不要有 tie-break 規則、以及輸入文字是否可能包含非 ASCII 字元(如果會,要確認長度計算是用 code point 還是 byte,以免切片切到 UTF-8 字元中間)。
2. **建立框架**：主迴圈用一個游標 `pos` 從 0 掃到 `len(text)`。在每個 `pos`,先算出「這個位置最長可能候選長度」的上界(不超過詞彙表裡最長 key 的長度,也不超過 `len(text) - pos`),然後從這個上界往下試每個長度的子字串是否在 `vocab` 裡,第一個命中的就是最長匹配。如果都沒命中,就進入 unknown 分支;依 `coalesce_unknown` 決定是只吃一個字元還是持續往後吃到下一個能匹配的位置為止。
3. **深入核心**：這題最容易忽略的正確性陷阱是「unknown-run 合併模式下,要準確找出下一個『重新開始能匹配』的位置」——不能天真地每次都重新對詞彙表整個掃描,要在合併過程中持續嘗試從目前位置能不能匹配,一旦能匹配就結束這段 unknown span。效能上的核心討論是「詞彙表小 vs 大」的 trade-off:小詞彙表時,對每個 `pos` 線性掃過所有候選長度沒問題;但詞彙表一大,應該先把詞彙表建成 trie,讓每個 `pos` 的匹配退化成「沿著 trie 往下走,走不動就停」,把整體複雜度從 O(n × maxlen × vocab查詢) 壓到接近 O(n)。
4. **收尾**：講清楚回傳結構為什麼要附帶「消耗的原文子字串」跟「起始 offset」——這是為了讓呼叫端能夠無損驗證 `''.join(consumed_texts) == text`,是這類 tokenizer 實作題常見的隱藏驗收條件。最後主動延伸到 Google 的 LinMaxMatch(Fast WordPiece Tokenization System)當作「如果我要把這個做到生產等級,我會怎麼優化」的收尾,展現你知道業界的解法長怎樣。

### 範例回答（面試時可以這樣講）

> **問題框定**：在寫程式碼之前,我想先確認幾個假設——詞彙表裡沒有空字串或重複 key、最長匹配如果有長度相同的多個候選,我會用「詞彙表裡先出現的優先」這種明確規則(而不是不確定的行為)、輸入我先假設是純 ASCII,如果之後要支援 Unicode,我會在切片時改用 code point 為單位而不是 byte。基於這個範圍,我會用一個游標從頭掃到尾,每個位置先算出最長可能候選長度,再往下試每個長度是否命中。
>
> **核心邏輯**：主迴圈在每個 `pos` 先取 `min(詞彙表最長 key 長度, len(text) - pos)` 當作候選長度上界,從這個長度往下一一試 `text[pos:pos+length]` 在不在 `vocab` 裡,第一個命中就是這個位置的最長匹配,把 `(token_id, 消耗文字, pos)` 加進結果、`pos` 往前推進消耗掉的長度。如果都沒命中,依 `coalesce_unknown` 決定:`False` 的話直接吃一個字元標成 unknown、`pos += 1`;`True` 的話持續往後推進 `pos`,每推進一步就重新嘗試從新位置能不能匹配,一旦能匹配就把這整段(從 unknown 開始到現在)包成一個 unknown token 再繼續正常流程。
>
> **正確性與延伸**：我會用一個簡單例子手動驗證——比如詞彙表只有 `{"ab": 1, "a": 2}`,輸入 `"abc"`,結果應該是 `[(1, "ab", 0), (None, "c", 2)]`(逐字元模式)——確保 `''.join` 回去等於原始輸入。收尾我會提到,如果詞彙表從幾百筆長到幾萬筆,現在這個「線性掃描候選長度」的做法會在每個位置都做到 O(maxlen) 次字典查詢,整體接近 O(n × maxlen);生產環境的做法是把詞彙表建成 trie,搭配類似 Aho-Corasick 的失敗連結,像 Google 的 LinMaxMatch 論文做的那樣,把匹配壓到真正線性,這是我如果要把這個題目做到生產等級會做的下一步優化。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 明確定義「最長匹配」的 tie-break 規則,不留不確定行為 | |
| unknown-run 的兩種模式(逐字元 / 合併)分別怎麼實作 | |
| 回傳結構附帶消耗的原文子字串與 offset,能無損還原輸入 | |
| 用具體例子手動 trace 過一次,驗證正確性 | |
| 討論詞彙表變大時的效能問題與 trie 化的解法 | |
| 加分項：提到 Unicode / code point vs byte 的邊界條件 | |

## 延伸閱讀

- [A Fast WordPiece Tokenization System — Google Research](https://research.google/blog/a-fast-wordpiece-tokenization-system/) — 今天效能討論引用的 LinMaxMatch 論文介紹,講清楚 trie + Aho-Corasick 失敗連結怎麼把貪婪最長匹配從 O(n²) 壓到線性,是把這題做到生產等級的標準答案。
- [WordPiece: BERT's Subword Tokenization Algorithm Explained — Michael Brenndoerfer](https://mbrenndoerfer.com/writing/wordpiece-tokenization-bert-subword-algorithm) — 圖解版的 greedy longest-match 教學,適合還不熟悉次詞切分概念的讀者先補直覺。
- [Anthropic Coding & Algorithms Questions — PracHub](https://prachub.com/companies/anthropic/categories/coding-and-algorithms) — Anthropic coding round 的整體出題風格整理,可以看到這類「系統化、貼近生產」的題目不是特例而是常態。

## 參考資料

- [Implement a longest-match tokenizer — PracHub（Anthropic Interview Question）](https://prachub.com/interview-questions/implement-a-longest-match-tokenizer) — 今日練習題原題描述、case-sensitive 與 unknown-run 處理要求的來源。
- [Anthropic Interview Questions (Updated 2026) — PracHub](https://prachub.com/companies/anthropic) — 這題所屬的 Anthropic 面試題庫總覽,含難度與環節分布統計。
- [A Fast WordPiece Tokenization System — Google Research](https://research.google/blog/a-fast-wordpiece-tokenization-system/) — trie 化、Aho-Corasick 失敗連結、LinMaxMatch 複雜度分析的來源。
- [GEICO AI Engineer Interview Questions & Guide 2026 — Dataford](https://dataford.io/interview-guides/geico/ai-engineer) — 佐證「AI Engineer coding round 越來越常考不用 NumPy／框架、純手刻字串或矩陣邏輯」這個出題趨勢的來源。
