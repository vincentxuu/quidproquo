---
title: "Optimization——局部搜尋、模擬退火、約束滿足問題與填字遊戲｜Harvard CS50 AI 第 3 週"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, optimization, local-search, simulated-annealing, csp, ac-3, backtracking, crossword, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 4
tldr: "第 3 週講最佳化的三種寫法：局部搜尋只記一個 state，hill climbing 往更好的鄰居走、會卡在局部極值，模擬退火用 e^(ΔE/T) 的機率接受變差的一步；線性規劃把問題寫成線性成本函數加線性限制，交給現成的求解器；約束滿足問題用 node consistency、arc consistency（AC-3）縮小 domain，再用回溯搜尋配合 MRV、degree、least-constraining value 三個 heuristic 找解。附逐段時間連結，以及 Crossword 專案的解題思路、虛擬碼、易錯處與檢查方式（參考實作摺疊在最後）。"
description: "Harvard CS50 AI 第 3 週 Optimization 導讀：依 2020 年講課錄影的字幕逐段整理局部搜尋與 state-space landscape、hill climbing 與五種變形、模擬退火、旅行推銷員問題、線性規劃、約束滿足問題、node 與 arc consistency、AC-3、回溯搜尋、maintaining arc consistency，以及 MRV、degree、least-constraining value 三個 heuristic，每節附可點的時間連結與自我檢查，另有 Crossword 專案的規格、與官方檔案一致的 distribution code、解題思路、虛擬碼、容易出錯的地方、檢查方式與 check50 指令；參考實作摺疊在專案最後。專案規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en)

**影片狀態：已附影片。** 全片 1:44:44。本文的「講課導讀」依這支錄影的英文字幕逐段寫成，每一節開頭有時間連結，點了頁面上的播放器會跳到那一段。講課沒有介紹本週專案，專案部分依課程官網寫成。[跳到播放器](#課程影片與時間軸)｜[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年課程官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

第 3 週把「從一堆選項裡挑最好的」寫成三種問題，各有現成的解法。局部搜尋（local search）只記一個 state，靠 hill climbing 與模擬退火（simulated annealing）在鄰居之間移動；線性規劃（linear programming）把問題寫成線性的成本函數與限制式；約束滿足問題（constraint satisfaction problem，CSP）用 arc consistency 縮小每個變數的 domain，再用回溯搜尋（backtracking search）找出一組指派。專案 Crossword 用的是第三種。

這篇分成兩半：前半「講課導讀」跟著錄影走，後半是 Crossword 專案的實作說明，講課沒有提到專案。

## 課程影片與時間軸

全片 1 小時 44 分，下面「講課導讀」的十個小節依序涵蓋 0:52 之後的全部內容。每一節開頭和文中的時間連結都能點，頁面上的播放器會跳到那一段；某一節看不懂時，直接回去聽講者怎麼講。

```youtube
url: https://www.youtube.com/watch?v=qK46ET1xk2A
title: Optimization - Lecture 3 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube：[Week 3 Optimization (2020 錄製)](https://www.youtube.com/watch?v=qK46ET1xk2A)

> 時間說明：下表時間已依帶時間碼的英文字幕核對（2026-10-13），是講者開始講各主題的位置，不是官方章節。此表只描述這支 2020 年的錄影；課程目前版本的講課內容與順序可能不同，且影片本身沒有介紹本週專案。

| 時間（點了從該處播放） | 內容 |
|---|---|
| [0:00–0:52](https://www.youtube.com/watch?v=qK46ET1xk2A&t=0s) | 回顧前幾週：搜尋、對弈搜尋、知識與推論、機率模型 |
| [0:52–7:25](https://www.youtube.com/watch?v=qK46ET1xk2A&t=52s) | 最佳化與局部搜尋：醫院選址例子、state-space landscape、目標函數與成本函數、鄰居 |
| [7:25–17:46](https://www.youtube.com/watch?v=qK46ET1xk2A&t=445s) | Hill climbing：虛擬碼、醫院例子從 17 走到 11、局部極值與平坦區 |
| [17:46–29:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1066s) | Hill climbing 的五種變形，`hospitals.py` 與 random restart 實測 |
| [29:00–40:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1740s) | 模擬退火與旅行推銷員問題 |
| [40:44–51:02](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2444s) | 線性規劃：兩台機器的例子與 `scipy.optimize.linprog` |
| [51:02–59:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3062s) | 約束滿足問題：考試排程、constraint graph、變數與 domain、hard／soft、unary／binary |
| [59:18–1:14:35](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3558s) | Node consistency、arc consistency、`Revise` 與 AC-3 |
| [1:14:35–1:29:22](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4475s) | 把 CSP 當搜尋問題：回溯搜尋的虛擬碼、逐步示範與 `schedule0.py` |
| [1:29:22–1:35:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5362s) | 搜尋與推論交錯：maintaining arc consistency |
| [1:35:10–1:44:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5710s) | 選變數與排值的 heuristic：MRV、degree、least-constraining value，以及收尾 |

> 官方筆記與投影片：[Week 3 Notes](https://cs50.harvard.edu/ai/2020/notes/3/)

## 講課導讀

以下依錄影的英文字幕逐段寫成。光讀字幕看不到投影片，地圖上房子與醫院的位置、state-space landscape 的形狀、constraint graph 的畫法本文都不重建，只寫講者口頭說出的數字與推理。虛擬碼照講者逐行唸的內容整理，並與[官方筆記](https://cs50.harvard.edu/ai/2020/notes/3/)對過，寫法一致；唯一的差別是 `Hill-Climb` 的 `highest valued neighbor`，筆記寫 `best valued neighbor`，本文照講者口述。每節結尾的自我檢查都是本文出的題目，不是講課內容；其中沿用講課例子的會寫明，標「本文自擬」的連例子也是本文編的。

### 最佳化與局部搜尋：只在乎答案，不在乎路徑

[錄影 0:52–7:25](https://www.youtube.com/watch?v=qK46ET1xk2A&t=52s)

講者 Brian Yu 把最佳化（optimization）定義成「從一組可能的選項裡選出最好的那一個」。前面幾週其實已經碰過，例如對弈時從所有走法裡挑最好的一步；這一週要看的是能處理更多種最佳化問題的做法。

第一種是**局部搜尋**（local search）（[1:20](https://www.youtube.com/watch?v=qK46ET1xk2A&t=80s)）。第 0 週的 BFS 與 A\* 會同時維護很多條正在探索的路徑；局部搜尋只維護一個節點，也就是目前的 state，每次移到它旁邊的某個 state。講者說它適合的情況和走迷宮相反：走迷宮時終點在哪裡一看就知道，難的是怎麼走過去；局部搜尋用在不在乎路徑、只在乎答案的問題，而且「答案長什麼樣子」本身就是難處。

他舉的例子是醫院選址（[2:38](https://www.youtube.com/watch?v=qK46ET1xk2A&t=158s)）。一張格狀地圖上有四棟房子，要放兩家醫院，目標是讓房子到醫院的距離越短越好。距離用第 0 週的曼哈頓距離：只能橫著或直著走，要走幾格。在他示範的那種擺法下，四棟房子到最近醫院的距離分別是 3、6、4、4，加起來是 17，所以這個 state 的成本是 17。問題變成：怎麼擺，這個總和最小？

把問題抽象化之後，講者畫了一張 **state-space landscape**（[4:17](https://www.youtube.com/watch?v=qK46ET1xk2A&t=257s)）：每一根直條是一個 state（兩家醫院的一種擺法），直條的高度是這個 state 的某個函數值。在這張圖上要做的事有兩種：

- 找**全域最大值**（global maximum）：值比其他所有 state 都高的那一個。這時被最佳化的函數叫**目標函數**（objective function），輸入一個 state，回傳它有多好。
- 找**全域最小值**（global minimum）：值比其他所有 state 都低的那一個。這時的函數叫**成本函數**（cost function），成本可以是金錢、時間，或像醫院例子裡的距離。

兩者是同一件事的正反面。

局部搜尋的走法是：手上只有一個目前的 state，每次移到它的一個**鄰居**（neighbor）（[6:27](https://www.youtube.com/watch?v=qK46ET1xk2A&t=387s)）。在那張一維的圖上，鄰居就是左邊或右邊那一根直條。換一個問題，鄰居要自己定義；醫院問題裡，鄰居可以是「把其中一家醫院往上、下、左或右移一格」。鄰居和目前的 state 很像，只差一點，所以函數值也只差一點。

**自我檢查｜先寫下答案，再展開。** 講課的醫院例子裡，四棟房子到最近醫院的距離是 3、6、4、4。這個 state 的成本是多少？這個問題要找的是全域最大值還是全域最小值？被最佳化的函數叫什麼？

<details>
<summary>答案</summary>

成本是 3 + 6 + 4 + 4 = 17。距離越短越好，所以要找的是全域最小值，被最佳化的函數叫成本函數。如果把同一個問題改寫成「讓某個分數越高越好」，就會變成找全域最大值，那時的函數叫目標函數；兩種寫法可以互換。

</details>

### Hill climbing：一直往更好的鄰居走

[錄影 7:25–17:46](https://www.youtube.com/watch?v=qK46ET1xk2A&t=445s)

最簡單的局部搜尋是 **hill climbing**。要找最大值時：看目前 state 的所有鄰居，移到值最高的那一個；重複這件事，直到所有鄰居都比自己低，就停下來，把目前的 state 當成答案。要找最小值時方向相反，每次移到值最低的鄰居，直到所有鄰居都比自己高。

講者唸的虛擬碼（[9:01](https://www.youtube.com/watch?v=qK46ET1xk2A&t=541s)）：

```text
function Hill-Climb(problem):
    current = initial state of problem
    repeat:
        neighbor = highest valued neighbor of current
        if neighbor not better than current:
            return current
        current = neighbor
```

講者順帶說明了三件事：

- 有些問題有現成的起點，有些沒有；沒有的話就隨機產生一個，例如隨機挑兩個位置放醫院。
- 上面是找最大值的寫法。找最小值時，`neighbor` 改成值最低的鄰居。
- 好幾個鄰居一樣好時，隨機挑一個。

接著用醫院例子走一遍（[11:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=670s)）。鄰居的定義是「挑一家醫院，往上、下、左或右移一格」，講者說那個擺法有六個鄰居，每家醫院各有三格可以移。起點的成本是 17。

1. 先看右邊那家醫院。往上移，離上面那棟房子近了，離下面那棟卻遠了，左邊兩棟房子不受影響，沒有幫助。往下移是同樣的問題，只是反過來。往左移一格，右邊兩棟房子都變近，左邊兩棟離另一家醫院比較近，所以不受影響。成本下降，移過去。這一步之後的成本講者沒有當場報，下一步才提到是 15。
2. 再看另一家醫院。它的位置偏上，往下移一格，成本從 15 降到 13。
3. 同一家醫院再往左移一格，成本從 13 降到 11。這時四棟房子的距離是 1、4、3、3。

到這裡演算法就停了。任何一家醫院往任何方向移一格，成本不是變高就是不變，沒有一個鄰居的成本低於 11。

11 是最好的擺法嗎？（[14:42](https://www.youtube.com/watch?v=qK46ET1xk2A&t=882s)）不是。把其中一家醫院往斜向移一格，成本是 9。但斜移不在鄰居的定義裡；要靠上下左右兩步走到那裡，中途得經過一個不比目前好的 state，hill climbing 不會走那一步。

這就是 hill climbing 的限制：它不保證找到最佳解。講者回到 state-space landscape 說明會卡住的幾種地方（[15:40](https://www.youtube.com/watch?v=qK46ET1xk2A&t=940s)）：

- **局部最大值**（local maximum）：值比所有鄰居都高，卻不是全域最大值。找最大值時走到這裡就不動了，因為左右都比較差。
- **局部最小值**（local minimum）：值比所有鄰居都低，卻不是全域最小值。醫院例子停在 11，就是停在局部最小值。嚴格說，11 有幾個鄰居和它同分，只是沒有任何鄰居比它低；這一句是本文的補充。
- **Flat local maximum**（[16:58](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1018s)）：好幾個相鄰的 state 值一樣高，講者圖上是六個。沒有哪個鄰居比自己好，照上面的演算法就停在這裡。
- **Shoulder**（[17:19](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1039s)）：同樣是一段平坦區，但它不是局部極值，再往前其實還能往上或往下。局部搜尋有可能在這段平地上迷路，沒辦法繼續前進。

**自我檢查｜先寫下答案，再展開。** 一排七個 state，成本依序是 8、6、7、5、3、4、9，鄰居是左右相鄰的 state。用找最小值的 hill climbing，從最左邊（成本 8）出發會停在哪裡？從最右邊（成本 9）出發呢？（本文自擬）

<details>
<summary>答案</summary>

從最左邊出發：8 只有一個鄰居 6，比較低，移過去。在 6 這裡，鄰居是 8 和 7，都比 6 高，停下來。答案是 6，這是局部最小值。

從最右邊出發：9 的鄰居是 4，移過去；4 的鄰居是 3 和 9，移到 3；3 的鄰居是 5 和 4，都比 3 高，停下來。答案是 3，這次剛好是全域最小值。

同一個問題、同一個演算法，起點不同，結果就不同。下一節的 random restart 就是利用這一點。

</details>

### Hill climbing 的變形與 `hospitals.py` 實測

[錄影 17:46–29:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1066s)

因為 hill climbing 不一定找到最佳解，它有好幾種變形，哪一種合用要看問題。講者一口氣介紹了五種：

| 變形 | 做法 |
|---|---|
| Steepest-ascent | 選值最高的鄰居（找最小值時選最低的）。前一節示範的就是這一種 |
| Stochastic | 從所有比自己好的鄰居裡隨機選一個 |
| First-choice | 不看完所有鄰居，找到第一個比自己好的就移過去 |
| Random-restart | 做很多次 hill climbing，每次換一個隨機起點，最後取最好的結果 |
| Local beam search | 不只記一個 state，同時記 k 個值最高的 |

講者對 steepest-ascent 的評語是它有點貪婪：每一步都拿當下最好的，但有時選一個只好一點點的鄰居，後面反而走得到更好的結果。Stochastic 的想法是只要比較好就算進步；first-choice 省掉檢查全部鄰居的時間。這三種都還是會卡在局部極值，要降低這個風險，就重複做很多次，也就是 random-restart（[19:43](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1183s)）。Local beam search（[20:24](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1224s)）不只維護一個 state：從三、四、五個隨機起點開始，產生它們所有的鄰居，留下最好的三、四、五個，再重複。

接著看程式（[20:58](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1258s)）。`hospitals.py` 的 `Space` 類別記地圖的高、寬與醫院數量，`hill_climb` 就是 steepest-ascent：先把醫院隨機放到空格上，然後在迴圈裡對每家醫院、每個可以移過去的格子算出成本，記下成本最低的那些鄰居。迴圈的結尾是這一段（取自講課原始碼）：

```python
# None of the neighbors are better than the current state
if best_neighbor_cost >= self.get_cost(self.hospitals):
    return self.hospitals

# Move to a highest-valued neighbor
else:
    if log:
        print(f"Found better neighbor: cost {best_neighbor_cost}")
    self.hospitals = random.choice(best_neighbors)
```

最好的鄰居不比現在好就回傳，否則從一樣好的鄰居裡用 `random.choice` 隨機挑一個移過去，和虛擬碼一一對應。

講者在高 10、寬 20 的地圖上隨機放 15 棟房子、3 家醫院，執行結果是：起點成本 72，之後找到 69、66、63，一路降到 53 停下來。他提醒 53 不一定是全域最小值，可能只是局部最小值。要確定的話得把所有擺法都算過，state 一多就太花時間；如果不要求最好、只要夠好，局部搜尋就很有用。

然後換成 random restart（[26:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1604s)）。`random_restart` 把 `hill_climb` 重複執行指定的次數，記下目前為止最好的結果。講者設 20 次，輸出是：第一次得到 56，接著 46，再來一次比 46 高所以略過，然後 41；剩下 16 次都沒有比 41 更好。41 出現在第 3 次嘗試（從 0 開始數）。

這些數字是講課當場那次執行的結果。房子與醫院的起點都是隨機產生的，自己跑同一份程式不會得到同樣的數字，這一句是本文依程式碼補的。

**自我檢查｜先寫下答案，再展開。** 講課那次 random restart 跑了 20 次：56、46、一次比 46 高、41，之後 16 次都沒有更好。把次數對一遍，確認 41 是第幾次嘗試（從 0 數）。能不能說 41 是這張地圖的全域最小值？

<details>
<summary>答案</summary>

第 0 次是 56，第 1 次是 46，第 2 次比 46 高被略過，第 3 次是 41。前面 4 次加上後面 16 次，剛好 20 次。

不能說 41 是全域最小值。Random restart 回傳的是 20 個局部最小值裡最好的一個，講者自己也說可能還有更好的擺法只是沒找到。要確定是全域最小值，得把所有擺法都算過。

</details>

### 模擬退火與旅行推銷員問題

[錄影 29:00–40:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1740s)

講者指出前面幾種 hill climbing 共同的毛病：它們從來不走讓情況變差的一步。可是卡在局部極值時，要脫身就得先往差的方向走。

最常用的解法是**模擬退火**（simulated annealing）（[29:48](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1788s)）。名字來自物理上的退火：一個粒子系統加熱之後能量高，粒子亂動；慢慢降溫，最後停在一個穩定的位置。搬到搜尋上：

- 一開始「溫度」高，比較願意接受比目前差的鄰居，尤其是只差一點點的。
- 之後溫度逐步降低，越來越不願意接受變差的鄰居。

講者的理由是：早期亂走才有機會離開局部極值；等走到了全域最大值附近，就不該再往差的地方移。

虛擬碼（[32:03](https://www.youtube.com/watch?v=qK46ET1xk2A&t=1923s)）：

```text
function Simulated-Annealing(problem, max):
    current = initial state of problem
    for t = 1 to max:
        T = Temperature(t)
        neighbor = random neighbor of current
        ΔE = how much better neighbor is than current
        if ΔE > 0:
            current = neighbor
        with probability e^(ΔE/T) set current = neighbor
    return current
```

逐行看：

- `max` 是要重複幾次，依問題而定。
- `Temperature(t)` 回傳目前的溫度，早期高、後期低。最簡單的寫法是「剩餘時間佔總時間的比例」。
- 這裡挑的是**隨機**的鄰居，不再挑最好的。
- `ΔE` 是鄰居比目前的 state 好多少。正的代表鄰居比較好，負的代表比較差。
- 鄰居比較好（`ΔE > 0`）就一定移過去，和 hill climbing 一樣。
- 鄰居比較差時，以 `e^(ΔE/T)` 的機率移過去（[35:05](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2105s)）。這時 `ΔE` 是負的，所以這個值落在 0 與 1 之間。鄰居只差一點（`ΔE` 接近 0）時機率高；溫度低（`T` 小）時機率低。

迴圈跑完，回傳當時的 state。

講者接著說，任何問題只要能寫成「有一個擺法、能問鄰居有沒有比較好、而且有辦法量化」，就能用這類演算法，醫院選址是一種，另一個有名的例子是**旅行推銷員問題**（traveling salesman problem）（[37:02](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2222s)）：有一群城市，要找一條經過每個城市再回到起點的路線，總距離越短越好。物流公司規劃送貨路線就是這種問題。它屬於 NP-complete 問題，講者的說法是目前沒有已知的有效率解法，所以只能找近似解：不求最好，但要在可行的時間內找到夠好的。

寫成局部搜尋：state 是一條路線，成本是路線總長，剩下的問題是鄰居怎麼定義。講者給的定義是「挑兩條邊，把它們對調」（[39:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2340s)）：拿掉這兩條邊，把端點改接到原本沒連的那個城市，中間那一段的方向反過來。有了鄰居的定義，就能套 hill climbing 或模擬退火。

**自我檢查｜先寫下答案，再展開。** 某個鄰居比目前的 state 差 2（`ΔE = −2`）。溫度 `T = 10` 與 `T = 1` 時，模擬退火各以多大的機率移過去？如果另一個鄰居差 10（`ΔE = −10`），在 `T = 10` 時機率是多少？（本文自擬）

<details>
<summary>答案</summary>

`T = 10`：e^(−2/10) = e^(−0.2) ≈ 0.82。`T = 1`：e^(−2/1) = e^(−2) ≈ 0.14。同一個鄰居，溫度高時十次有八次會接受，溫度低時只剩一成多。

`ΔE = −10`、`T = 10`：e^(−10/10) = e^(−1) ≈ 0.37。同樣的溫度下，差 10 的鄰居（0.37）比差 2 的鄰居（0.82）難被接受。這兩個方向就是講者說的：機率要同時看溫度和差多少。

</details>

### 線性規劃：寫成成本函數加限制式，交給現成的求解器

[錄影 40:44–51:02](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2444s)

下一類是**線性規劃**（linear programming）。講者說它常出現在要最佳化某個數學函數的時候，而且變數是實數：不限於幾個離散的固定值，可以是任何小數。它的問題長這樣：

- 最小化一個成本函數 `c₁x₁ + c₂x₂ + … + cₙxₙ`。每個變數乘上一個係數再相加，不會有平方或立方，所以叫線性。
- 限制式的形式是 `a₁x₁ + a₂x₂ + … + aₙxₙ ≤ b`，也可以是等式 `= b`。
- 每個變數可以有上下界，例如必須是正數，或必須小於 50。

只要問題能寫成這個形式，就有現成的演算法可以解。

講者的例子（[43:07](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2587s)）：工廠有兩台機器 x₁ 與 x₂。

| | x₁ | x₂ | 條件 |
|---|---|---|---|
| 每小時成本（美元） | 50 | 80 | 總成本越低越好 |
| 每小時需要的人力（單位） | 5 | 2 | 總共只有 20 單位 |
| 每小時產出（單位） | 10 | 12 | 公司需要 90 單位 |

讓 `x₁`、`x₂` 代表兩台機器各跑幾小時，三列分別寫成：

- 成本函數：`50x₁ + 80x₂`，要最小化。
- 人力限制：`5x₁ + 2x₂ ≤ 20`。
- 產出限制：`10x₁ + 12x₂ ≥ 90`。

第三條是「大於等於」，而前面說線性規劃用的是等式或「小於等於」。講者的處理是兩邊同乘 −1，不等號就反過來：`−10x₁ − 12x₂ ≤ −90`，意思相同。

解這類問題的演算法，講者只點了名字（[47:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2820s)）：simplex（最早被提出的解法之一），以及後來的 interior-point 一類。它們牽涉幾何與線性代數，這門課不講。他的重點是：不必懂它們怎麼運作，知道問題寫成這個形式就有函式庫能解。

`production.py`（[47:21](https://www.youtube.com/watch?v=qK46ET1xk2A&t=2841s)）用的是 `scipy`，全檔如下（取自講課原始碼）：

```python
import scipy.optimize

# Objective Function: 50x_1 + 80x_2
# Constraint 1: 5x_1 + 2x_2 <= 20
# Constraint 2: -10x_1 + -12x_2 <= -90

result = scipy.optimize.linprog(
    [50, 80],  # Cost function: 50x_1 + 80x_2
    A_ub=[[5, 2], [-10, -12]],  # Coefficients for inequalities
    b_ub=[20, -90],  # Constraints for inequalities: 20 and -90
)

if result.success:
    print(f"X1: {round(result.x[0], 2)} hours")
    print(f"X2: {round(result.x[1], 2)} hours")
else:
    print("No solution")
```

第一個參數是成本函數的係數，`A_ub` 是每條「小於等於」限制式的係數，`b_ub` 是每條限制式的上界（`ub` 是 upper bound）。講者也說這種寫法不如直接寫數學式好懂。執行結果（[50:15](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3015s)）：x₁ 跑 1.5 小時，x₂ 跑 6.25 小時。

講者在這裡點出今天反覆出現的主題：把手上的問題化成一個已經會解的問題，就能直接用現成的方法。

**自我檢查｜先寫下答案，再展開。** 把講課的答案 `x₁ = 1.5`、`x₂ = 6.25` 代回兩條限制式，確認都滿足。這個解的總成本是多少？

<details>
<summary>答案</summary>

人力：5 × 1.5 + 2 × 6.25 = 7.5 + 12.5 = 20，剛好等於上限 20。產出：10 × 1.5 + 12 × 6.25 = 15 + 75 = 90，剛好等於需求 90。兩條限制都剛好用滿。

總成本是 50 × 1.5 + 80 × 6.25 = 75 + 500 = 575 美元。講課只報了兩個小時數，575 是本文照講課的係數算的。

</details>

### 約束滿足問題：變數、domain 與約束

[錄影 51:02–59:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3062s)

有限制的問題不只線性規劃一種。更一般的一類叫**約束滿足問題**（constraint satisfaction problem，以下寫 CSP）。這裡的「約束」和上一節的「限制式」是同一個字 constraint，本文依兩個領域各自的習慣分開譯。CSP 的定義是：有一些變數要各自取一個值，而這些變數受到約束，限制了它們能取哪些值。

講者的例子是考試排程（[51:37](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3097s)）。四個學生各修三門課，課用字母代表：

| 學生 | 修的課 |
|---|---|
| 1 | A、B、C |
| 2 | B、D、E |
| 3 | C、E、F |
| 4 | E、F、G |

考試時段只有星期一、二、三，每門課要排進其中一天，而且不希望任何人同一天考兩科。

要讓電腦處理，講者把它畫成圖（[52:31](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3151s)）：每門課是一個節點，兩門課之間有約束就連一條邊。學生 1 修 A、B、C，所以 A–B、B–C、C–A 各連一條邊，代表這幾門課不能排在同一天。其他學生照做。學生 4 的 E–F 在處理學生 3 時已經連過，不用再連一次。這張圖叫 **constraint graph**。

有了例子，講者給出定義（[54:21](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3261s)）。一個 CSP 有三樣東西：

- 一組**變數** `X₁, …, Xₙ`。
- 每個變數的 **domain**：它可以取的值。各變數的 domain 可以相同，也可以不同。
- 一組**約束** `C`：例如 `X₁ ≠ X₂`；變數是數字時也可以是 `X₁ = X₂ + 1` 這種形式。

同一套定義套在兩個例子上：

| | 數獨（[55:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3310s)） | 考試排程 |
|---|---|---|
| 變數 | 每一個空格 | 課程 A 到 G |
| Domain | 1 到 9 | 星期一、二、三 |
| 約束 | 同一列、同一行、同一個 3×3 區塊裡的格子兩兩不同 | A ≠ B、A ≠ C 等，每條邊一條 |

約束有幾種分法。第一種是看能不能違反（[56:56](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3416s)）：

- **Hard constraint**：正確的解一定要滿足，例如數獨同一列的兩格不能同值。
- **Soft constraint**：表達偏好，例如有人希望 A 比 B 早考。不滿足也算解，只是比較不好；這時問題會變成盡量滿足大家的偏好。

講者說這一週主要只處理 hard constraint。

第二種是看牽涉幾個變數（[58:00](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3480s)）：

- **Unary constraint**：只牽涉一個變數，例如 `A ≠ 星期一`（授課老師星期一沒空）。
- **Binary constraint**：牽涉兩個變數，例如 `A ≠ B`。Constraint graph 上的每一條邊就是一個 binary constraint，這條邊也叫 arc。

**自我檢查｜先寫下答案，再展開。** 照講課的四個學生畫 constraint graph，總共有幾條邊？E 這個節點連到哪幾門課？

<details>
<summary>答案</summary>

每個學生修三門課，三門課兩兩相連是 3 條邊，四個學生共 12 條。其中 E–F 同時出現在學生 3 與學生 4，只算一次，所以是 11 條：A–B、A–C、B–C、B–D、B–E、D–E、C–E、C–F、E–F、E–G、F–G。

E 出現在學生 2、3、4 的課表裡，連到 B、D、C、F、G 五門課。講課程式 `schedule0.py` 的 `CONSTRAINTS` 清單也是這 11 條。

</details>

### Node consistency、arc consistency 與 AC-3

[錄影 59:18–1:14:35](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3558s)

分出 unary 與 binary 之後，可以先靠約束把每個變數的 domain 縮小，再開始找解。

**Node consistency**：一個變數的 domain 裡，每一個值都滿足它的 unary constraint。

講者把例子縮小成兩門課（[59:53](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3593s)）。A 與 B 的 domain 都是 {星期一、星期二、星期三}，約束有四條：`A ≠ 星期一`、`B ≠ 星期二`、`B ≠ 星期一`、`A ≠ B`。前三條是 unary，逐條處理：

1. `A ≠ 星期一`：把星期一從 A 的 domain 拿掉，A 剩 {星期二、星期三}。
2. `B ≠ 星期二`：把星期二從 B 的 domain 拿掉，B 剩 {星期一、星期三}。
3. `B ≠ 星期一`：再拿掉星期一，B 剩 {星期三}。

到這裡兩個變數都是 node consistent。第四條 `A ≠ B` 是 binary，還沒用到。

**Arc consistency**（[1:03:09](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3789s)）：一個變數的 domain 裡，每一個值都滿足它的 binary constraint。講者給的精確說法是：要讓 X 對 Y 是 arc consistent，就把 X 的 domain 裡「讓 Y 無值可選」的值都拿掉，使得 X 的每一個選擇，Y 都還有至少一個值可以配。

接著做 A 對 B（[1:04:52](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3892s)）。A 的 domain 是 {星期二、星期三}，B 是 {星期三}。

- A 選星期二：B 可以選星期三，`A ≠ B` 成立，保留。
- A 選星期三：B 只有星期三可選，會和 A 同一天，沒有值可配。把星期三從 A 的 domain 拿掉。

A 剩 {星期二}，B 是 {星期三}。這個小問題光靠兩種 consistency 就解完了。

把「讓 X 對 Y 是 arc consistent」寫成函式（[1:06:48](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4008s)）：

```text
function Revise(csp, X, Y):
    revised = false
    for x in X.domain:
        if no y in Y.domain satisfies constraint for (X, Y):
            delete x from X.domain
            revised = true
    return revised
```

`Revise` 只會動 X 的 domain，回傳值是「有沒有拿掉東西」。這個回傳值下一步會用到。

要讓整個問題都是 arc consistent，用的是 **AC-3**（[1:09:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4154s)）：

```text
function AC-3(csp):
    queue = all arcs in csp
    while queue non-empty:
        (X, Y) = Dequeue(queue)
        if Revise(csp, X, Y):
            if size of X.domain == 0:
                return false
            for each Z in X.neighbors - {Y}:
                Enqueue(queue, (Z, X))
    return true
```

它維護一個 queue，裡面是所有還需要檢查的 arc，一開始放進問題裡全部的 arc。每次取出一條 `(X, Y)`，呼叫 `Revise`：

- 回傳 false：X 的 domain 沒變，這條 arc 處理完了，換下一條。
- 回傳 true：X 的 domain 變小了。先看是不是空了（[1:11:49](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4309s)），空了代表 X 無值可選，整個問題無解，回傳 false。沒空的話，X 的其他鄰居 Z 原本可能靠著剛被拿掉的那個值才和 X 一致，現在不一定了，所以把 `(Z, X)` 放回 queue 重新檢查。Y 剛處理過，不用放。

Queue 空了就回傳 true。講者補了一句：嚴格說不一定要用 queue，只是傳統上這樣寫。

那麼把 AC-3 用在七門課的考試排程上會怎樣？（[1:13:37](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4417s)）什麼都不會變。每門課有三天可選，約束只要求兩門課不同天，所以不管 X 選哪一天，Y 都還有另外兩天可選，每條 arc 一開始就是一致的。Arc consistency 一次只看一條邊上的兩個變數，不會同時考慮其他節點。所以 AC-3 有時能縮小 domain、讓解比較好找，但不一定能把問題解完，還是需要搜尋。

**自我檢查｜先寫下答案，再展開。** 兩個變數 X、Y 的 domain 都是 {1, 2, 3}，只有一條約束 `X < Y`。先做 `Revise(X, Y)`，再做 `Revise(Y, X)`，兩個 domain 各剩什麼？兩次的回傳值是什麼？做完之後問題解完了嗎？（本文自擬）

<details>
<summary>答案</summary>

`Revise(X, Y)`：X = 1 時 Y 可以選 2 或 3；X = 2 時 Y 可以選 3；X = 3 時 Y 沒有比 3 大的值，拿掉 3。X 剩 {1, 2}，回傳 true。

`Revise(Y, X)`：Y = 1 時 X 沒有比 1 小的值，拿掉 1；Y = 2 時 X 可以選 1；Y = 3 時 X 可以選 1 或 2。Y 剩 {2, 3}，回傳 true。

問題還沒解完。兩個 domain 現在是 arc consistent，但還有 (1, 2)、(1, 3)、(2, 3) 三組解可以選，要靠搜尋挑出一組。這和講課的七門課例子是同一件事：arc consistency 能縮小 domain，不保證把每個變數縮到只剩一個值。

</details>

### 把 CSP 當搜尋問題：回溯搜尋

[錄影 1:14:35–1:29:22](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4475s)

講者先把 CSP 套進第 0 週的搜尋問題格式：

- Initial state：空的**指派**（assignment），也就是還沒有任何變數被指定值。
- Actions：在指派裡加一組「變數 = 值」。
- Transition model：加了之後得到的新指派。
- Goal test：所有變數都指派了，而且所有約束都滿足。
- Path cost：用不到。這裡只在乎找到解，每條路徑的成本都一樣。

直接拿 BFS 或 DFS 來跑會非常沒效率。講者點出 CSP 有一個可以利用的結構（[1:16:28](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4588s)）：指派的順序不影響結果。先 `A = 2` 再 `B = 8`，和先 `B = 8` 再 `A = 2`，是同一個指派。

針對 CSP 的搜尋方法叫**回溯搜尋**（backtracking search）（[1:16:57](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4617s)）：一個一個替變數指派值，走到沒辦法在不違反約束的情況下繼續時，就退回去改試別的值。虛擬碼（[1:17:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4638s)）：

```text
function Backtrack(assignment, csp):
    if assignment complete: return assignment
    var = Select-Unassigned-Var(assignment, csp)
    for value in Domain-Values(var, assignment, csp):
        if value consistent with assignment:
            add {var = value} to assignment
            result = Backtrack(assignment, csp)
            if result ≠ failure: return result
            remove {var = value} from assignment
    return failure
```

這是遞迴函式，一開始傳進空的指派。指派完整了就回傳；否則挑一個還沒指派的變數，把它 domain 裡的值一個一個試。某個值不違反約束，就加進指派，遞迴處理剩下的變數。遞迴回傳的不是 failure 就一路往上回傳；是 failure 就代表這個值走不通，把它從指派拿掉，試下一個值。所有值都試完還不行，回傳 failure，讓上一層去改它的選擇。

講者在七門課的圖上走了一遍（[1:20:20](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4820s)）。每個變數的值都照星期一、二、三的順序試，變數的順序是他在圖上選的：A、B、D、E、C、F、G。

| 步驟 | 變數 | 試的值與結果 |
|---|---|---|
| 1 | A | 星期一，可以 |
| 2 | B | 星期一和 A 衝突；星期二可以 |
| 3 | D | 星期一可以（B 是星期二） |
| 4 | E | 星期一和 D 衝突；星期二和 B 衝突；星期三可以 |
| 5 | C | 星期一和 A 衝突；星期二和 B 衝突；星期三和 E 衝突。三個都不行，回傳 failure |
| 6 | 回到 E | 三個值都試過了，星期三看起來可以，結果也走不通。E 回傳 failure |
| 7 | 回到 D | 星期一是錯的選擇。星期二和 B 衝突；星期三可以 |
| 8 | E | 星期一可以 |
| 9 | C | 星期一不行（講者說這裡一次違反兩條約束）；星期二不行；星期三可以 |
| 10 | F | 星期一不行；星期二可以 |
| 11 | G | 星期一不行；星期二不行；星期三可以 |

結果：A 與 E 在星期一，B 與 F 在星期二，C、D、G 在星期三。第 3 步選 D = 星期一的時候看不出問題，要到第 5 步才發現走不通，然後退兩層回去改。

`schedule0.py`（[1:25:05](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5105s)）把這個流程寫成 Python：`VARIABLES` 是七門課，`CONSTRAINTS` 是那些邊；`backtrack` 先看指派完整了沒，再用 `select_unassigned_variable` 依清單順序挑一個還沒指派的變數，對三個值各做一份新的指派，用 `consistent` 檢查，過了才遞迴；全部不行就回傳 `None`。`consistent` 逐條看約束：兩端都已指派而且值相同，就回傳 `False`。執行後印出一組解，A 是星期一、B 是星期二、C 是星期三。

講者接著說（[1:27:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5264s)），CSP 很常見，所以有現成的函式庫，重點是知道有函式庫可用，不在於用哪一個。`schedule1.py` 用的是 `python-constraint`：建立一個 problem，加變數與 domain，再對每條邊呼叫 `addConstraint`，傳進一個「兩個值不相等」的函式，最後用 `getSolutions` 取得所有解。這個問題一共有六組解。

六這個數字可以從 constraint graph 直接看出來，以下是本文的推導，講課只報了數字。B–C、B–E、C–E 三條邊都在圖上（分別來自學生 1、2、3），所以 B、C、E 兩兩不同天，三門課分三天共 3 × 2 × 1 = 6 種排法。B、C、E 排定之後，A（連到 B、C）、D（連到 B、E）、F（連到 C、E）都只剩一天可選，G（連到 E、F）也跟著被決定，所以總共就是 6 組。

**自我檢查｜先寫下答案，再展開。** 講者在圖上走的順序是 A、B、D、E、C、F、G。`schedule0.py` 改成依清單順序 A、B、C、D、E、F、G 挑變數，值一樣照星期一、二、三試。手動走一遍：回溯會在哪個變數失敗？要退幾層？最後的解和講者走出來的一樣嗎？

<details>
<summary>答案</summary>

A 星期一。B 星期一和 A 衝突，星期二可以。C 星期一和 A 衝突、星期二和 B 衝突，星期三可以。D 連到 B 和 E，E 還沒指派，星期一不和任何人衝突，可以。

接著 E 三個值都不行：星期一和 D 衝突，星期二和 B 衝突，星期三和 C 衝突。E 回傳 failure，退一層回到 D。D 改試星期二，和 B 衝突；星期三可以。

再往下就順了：E 星期一可以；F 星期一和 E 衝突，星期二可以；G 星期一和 E 衝突、星期二和 F 衝突，星期三可以。

失敗的變數是 E，只退一層（改 D）。最後的解是 A、E 星期一，B、F 星期二，C、D、G 星期三，和講者走出來的那一組相同，也和 `schedule0.py` 實際印出來的結果相同。講者的順序在 C 失敗、要退兩層；這裡先排了 C，所以錯誤早一步被發現。這一題的走法是本文自己算的，並用程式逐步印出來核對過。

</details>

### 搜尋與推論交錯：maintaining arc consistency

[錄影 1:29:22–1:35:10](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5362s)

剛才的回溯搜尋只管「目前有沒有違反約束」，所以會走進 D = 星期一這種死路。講者問：能不能回頭用先前講過的推論（inference），靠已經知道的事提早排除不用走的路？

回到第一次卡住之前，A = 星期一、B = 星期二剛指派完的時候。這時 C 的 domain 還是三天，但圖已經不是 arc consistent 了：

- C 連到 A（星期一）和 B（星期二），所以 C 不能是星期一或星期二，只剩星期三。
- E 連到 B（星期二）和 C（只剩星期三），所以 E 只能是星期一。
- D 連到 B（星期二）和 E（星期一），所以 D 只能是星期三。
- 講者說 F 和 G 也能用同樣的方式推出來，沒有逐一示範。

只指派了兩個變數，剩下的全靠維持 arc consistency 推出來，完全不用回溯。

這種把搜尋和推論交錯進行的做法叫 **maintaining arc consistency**（[1:32:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5534s)）。AC-3 可以在搜尋開始前跑一次，先把 domain 縮小；也可以在搜尋途中，每指派一個變數就跑一次。後者的做法是：替變數 X 指派值之後呼叫 AC-3，但 queue 一開始只放所有 `(Y, X)`，其中 Y 是 X 的鄰居，不用放全部的 arc。

`Backtrack` 跟著改兩處（[1:33:35](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5615s)）：

```text
function Backtrack(assignment, csp):
    if assignment complete: return assignment
    var = Select-Unassigned-Var(assignment, csp)
    for value in Domain-Values(var, assignment, csp):
        if value consistent with assignment:
            add {var = value} to assignment
            inferences = Inference(assignment, csp)
            if inferences ≠ failure: add inferences to assignment
            result = Backtrack(assignment, csp)
            if result ≠ failure: return result
            remove {var = value} and inferences from assignment
    return failure
```

- 加了 `{var = value}` 之後呼叫 `Inference`。它可以做很多事，其中一種就是 maintaining arc consistency。推出來的結論（某個變數一定是某個值）只要不是 failure，就一起加進指派。
- 這個值走不通要退回時，除了拿掉 `{var = value}`，剛才推出來的結論也要一起拿掉。

每指派一個值，其他變數的 domain 可能跟著縮小，利用這一點，需要回溯的次數常常比原本少。

專案 Crossword 的 `ac3(self, arcs=None)` 多一個 `arcs` 參數，就是為了這個用途：傳進一份 arc 清單，AC-3 就從那份清單開始，不從全部的 arc 開始。規格說這一步可做可不做。

**自我檢查｜先寫下答案，再展開。** 沿用講課的情況：A = 星期一、B = 星期二，已經推出 C = 星期三、E = 星期一、D = 星期三。把講者沒有示範的 F 和 G 推出來。結果和上一節回溯搜尋走出來的解一樣嗎？

<details>
<summary>答案</summary>

F 連到 C、E、G。C 是星期三、E 是星期一，所以 F 只能是星期二。G 連到 E 和 F，E 是星期一、F 是星期二，所以 G 只能是星期三。

結果是 A 與 E 星期一、B 與 F 星期二、C、D、G 星期三，和上一節走了十一步、退了兩層才得到的解完全相同。差別在這一次沒有試過任何會失敗的值。F 與 G 的推導是本文照講者的做法補完的。

</details>

### 選變數與排值的 heuristic：MRV、degree、least-constraining value

[錄影 1:35:10–1:44:44](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5710s)

虛擬碼裡還有兩個函式沒有交代：`Select-Unassigned-Var` 和 `Domain-Values`。到目前為止，前者是隨便挑一個還沒指派的變數，後者是照星期一、二、三的順序。講者說這兩處挑得聰明一點，搜尋會快很多。

**選哪個變數**有兩個 heuristic：

- **Minimum remaining values（MRV）**（[1:35:56](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5756s)）：選 domain 最小的變數，也就是剩下的值最少的。理由是：只剩兩個值的話，解如果存在一定是其中一個，早點試掉一個就知道了。
- **Degree heuristic**（[1:36:34](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5794s)）：MRV 分不出高下時（例如大家剩下的值一樣多），選 degree 最高的變數。節點的 degree 是它連到幾個其他節點，也就是它約束了幾個變數。選 degree 高的，一指派就能約束到最多其他變數，比較可能一次排除一大片不用搜尋的空間。

兩個例子（[1:37:30](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5850s)）。已經指派了兩個變數時，C 的 domain 只剩星期三一個值，依 MRV 下一個該選 C：反正它只有這個選擇，先定下來再看其他的。而在最一開始，七個變數的 domain 大小都是 3，MRV 幫不上忙；講者先前隨手從最上面的 A 開始，其實該看 degree。E 的 degree 最高，從 E 開始，接著就能替其他變數指派值，講者說這樣連推論都不用，就能不回溯地排完。

**值照什麼順序試**（[1:39:25](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5965s)）用的是 **least-constraining value**（[1:40:12](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6012s)）：看每個值會讓鄰居的 domain 少掉幾個選項，從排除最少的值開始試。理由是：這裡的目的只是找到一組解，排除越少，後面還有解的機會越大。

講者自己點出這兩件事聽起來互相矛盾（[1:40:57](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6057s)）：選變數時挑選項最少的，選值時卻挑限制最少的。他的解釋是目的不同。選變數是為了盡快砍掉大片搜尋空間；選定變數之後，在它的值裡面挑，是為了盡量留住找到解的可能，免得之後又要回溯。

例子（[1:41:47](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6107s)）：A 已經是星期一，所以 C 只能是星期二或星期三，先試哪一個？講者指著圖數：選星期二會排除三個選項，選星期三會排除兩個。依 least-constraining value，先試星期三。字幕看不出他指的是哪幾個節點；官方筆記對同一個例子的說明是：C 選星期二會限制到 B、E、F 三個，選星期三只限制到 B、E 兩個。節點名稱取自官方筆記，不是字幕。

最後是收尾（[1:43:07](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6187s)）。這一週看了三種把問題寫下來的方式：局部搜尋、線性規劃、約束滿足問題。只要手上的問題能寫成其中一種，就能用對應的現成演算法：hill climbing 與模擬退火、simplex 與 interior-point、arc consistency 與回溯搜尋。

專案 Crossword 的 `select_unassigned_variable` 要實作的就是 MRV 加 degree 當平手時的判準，`order_domain_values` 要實作的就是 least-constraining value。

**自我檢查｜先寫下答案，再展開。** 七門課一開始 domain 大小都是 3。算出每個節點的 degree，確認講者說的「E 最高」。再回答：least-constraining value 的例子裡，星期二排除三個、星期三排除兩個，為什麼先試排除比較少的那個？

<details>
<summary>答案</summary>

照 11 條邊數：A 連到 B、C，degree 是 2；B 連到 A、C、D、E，是 4；C 連到 A、B、E、F，是 4；D 連到 B、E，是 2；E 連到 B、C、D、F、G，是 5；F 連到 C、E、G，是 3；G 連到 E、F，是 2。E 是 5，最高。全部加起來是 22，等於邊數 11 的兩倍，數目對得上。Degree 的數字是本文照講課的圖算的，講者只說 E 最高。

先試星期三，是因為這一步的目的是找到一組解。排除的選項越少，鄰居留下的值越多，這條路走得通的機會越大，之後越不需要回溯。這和選變數時的想法方向相反：選變數挑限制多的，是為了早點發現走不通；選值挑限制少的，是為了盡量走得通。

</details>

## 專案 3：Crossword —— CSP 生成填字遊戲

本站對專案解答的處理方式：這一節預設只寫任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方與檢查方式，不放可以直接繳交的程式。完整參考實作摺疊在這一節最後，打開之前請先讀那裡的說明。

### 任務

給定結構檔（例如 `data/structure1.txt`，`_` 代表要填字母的格子）與單字表（例如 `data/words1.txt`），替每一個橫向或直向的格子序列選一個單字，使交叉處的字母一致，而且同一個單字不重複使用。

對應到講課的 CSP：每個格子序列是一個變數，domain 是單字表裡的單字。Unary constraint 是單字長度要等於變數的長度；binary constraint 是兩個變數交叉的那一格字母要相同。

`crossword.py` 已經寫好，不能改。要在 `generate.py` 實作八個函式：

| 函式 | 要做的事 | 對應的講課內容 |
|---|---|---|
| `enforce_node_consistency()` | 把每個變數 domain 裡長度不對的單字拿掉 | Node consistency |
| `revise(x, y)` | 把 `x` 的 domain 裡在 `y` 找不到相容單字的值拿掉；有拿掉回傳 `True` | `Revise` |
| `ac3(arcs=None)` | 做 arc consistency；有 domain 變空回傳 `False`，否則 `True`。`arcs` 是 `None` 時從全部的 arc 開始 | AC-3 |
| `assignment_complete(assignment)` | 每個變數都有值就回傳 `True` | 回溯搜尋的第一行 |
| `consistent(assignment)` | 所有值互不相同、長度正確、相鄰變數沒有衝突才回傳 `True` | 回溯搜尋裡的 consistent 檢查 |
| `order_domain_values(var, assignment)` | 回傳 `var` 的值，依「會排除鄰居多少個值」由少到多排序 | Least-constraining value |
| `select_unassigned_variable(assignment)` | 回傳剩餘值最少的未指派變數；平手時取 degree 最高的 | MRV 與 degree heuristic |
| `backtrack(assignment)` | 回傳完整的指派，無解回傳 `None` | 回溯搜尋 |

規格提醒：`ac3` 不用處理「單字不重複」，那是 `consistent` 的工作；`order_domain_values` 計算時不算已經指派的鄰居；在 `backtrack` 裡交錯做推論是選做。

### 官方已提供的程式

`crossword.py` 整個檔案都已經寫好。`generate.py` 裡 `letter_grid`、`print`、`save`、`solve` 與 `main` 已經寫好；任務表列的八個函式在官方檔案裡只有說明文字與一行 `raise NotImplementedError`，要自己寫。

`crossword.py` 的 `Variable`（官方檔案，略去 `__str__` 與 `__repr__`）：

```python
class Variable():

    ACROSS = "across"
    DOWN = "down"

    def __init__(self, i, j, direction, length):
        """Create a new variable with starting point, direction, and length."""
        self.i = i
        self.j = j
        self.direction = direction
        self.length = length
        self.cells = []
        for k in range(self.length):
            self.cells.append(
                (self.i + (k if self.direction == Variable.DOWN else 0),
                 self.j + (k if self.direction == Variable.ACROSS else 0))
            )

    def __hash__(self):
        return hash((self.i, self.j, self.direction, self.length))

    def __eq__(self, other):
        return (
            (self.i == other.i) and
            (self.j == other.j) and
            (self.direction == other.direction) and
            (self.length == other.length)
        )
```

`Crossword(structure_file, words_file)` 物件上會用到的屬性與方法：

| 名稱 | 內容 |
|---|---|
| `crossword.height`、`crossword.width` | 填字遊戲的高與寬 |
| `crossword.structure` | 二維 list，`structure[i][j]` 是 `True` 表示這一格要填字母 |
| `crossword.words` | 所有可用單字的 set（讀檔時已轉成大寫） |
| `crossword.variables` | 所有 `Variable` 的 set |
| `crossword.overlaps` | dict，鍵是一對變數。`overlaps[v1, v2]` 是 `None` 表示不交叉；是 `(i, j)` 表示 `v1` 的第 `i` 個字元要等於 `v2` 的第 `j` 個字元 |
| `crossword.neighbors(var)` | 方法，回傳與 `var` 交叉的所有變數（set） |

`generate.py` 的 `CrosswordCreator`（官方檔案，略去 `letter_grid`、`print`、`save`）：

```python
class CrosswordCreator():

    def __init__(self, crossword):
        """
        Create new CSP crossword generate.
        """
        self.crossword = crossword
        self.domains = {
            var: self.crossword.words.copy()
            for var in self.crossword.variables
        }

    def solve(self):
        """
        Enforce node and arc consistency, and then solve the CSP.
        """
        self.enforce_node_consistency()
        self.ac3()
        return self.backtrack(dict())
```

`solve` 的三行就是講課的順序：先 node consistency，再 AC-3，最後回溯搜尋。

### 解題思路

先把講課的名詞對到這個專案：變數是每一個橫向或直向的格子序列（`Variable`），domain 是 `self.domains[var]` 這個單字 set，unary constraint 是單字長度，binary constraint 是 `overlaps` 記的那一格字母要相同。`solve` 已經排好三步的順序，八個函式建議照下面的順序寫，每寫完一個都能單獨檢查。

1. **`enforce_node_consistency`**。對應[〈Node consistency、arc consistency 與 AC-3〉](#node-consistencyarc-consistency-與-ac-3)開頭的兩門課例子（[59:53](https://www.youtube.com/watch?v=qK46ET1xk2A&t=3593s)）：講課是把不滿足 `A ≠ 星期一` 的值從 A 的 domain 拿掉。這裡每個變數只有一條 unary constraint，就是長度。逐一看每個變數的 domain，長度不等於變數長度的單字都拿掉。
2. **`revise(x, y)`**。對應同一節的 `Revise`（[1:06:48](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4008s)）。講課虛擬碼的「Y 的 domain 裡沒有值滿足約束」，在這裡的意思是：`x` 的某個單字在交叉格是某個字母，而 `y` 的 domain 裡沒有任何單字在那一格是同一個字母。交叉格在兩個單字裡各是第幾個字元，查 `overlaps[x, y]`；查到 `None` 表示兩個變數不交叉，沒有東西可拿掉。只動 `x` 的 domain，`y` 的不動。
3. **`ac3(arcs)`**。對應 AC-3（[1:09:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4154s)）。`arcs` 是 `None` 時，queue 一開始放所有交叉的變數對，兩個方向都要放，因為 `(X, Y)` 和 `(Y, X)` 檢查的是不同的 domain。之後照虛擬碼：取出一條、呼叫 `revise`、有變動就檢查 domain 是不是空了，再把 `x` 的其他鄰居排回 queue。
4. **`assignment_complete` 與 `consistent`**。對應[〈把 CSP 當搜尋問題：回溯搜尋〉](#把-csp-當搜尋問題回溯搜尋)（[1:17:18](https://www.youtube.com/watch?v=qK46ET1xk2A&t=4638s)）。`consistent` 收到的指派常常是不完整的，做法和講課 `schedule0.py` 的 `consistent` 相同：只檢查兩端都已經指派的約束。這個專案要檢查三件事：沒有重複的單字、每個單字長度正確、相鄰而且都已指派的變數在交叉格字母相同。
5. **`order_domain_values`**。對應[〈選變數與排值的 heuristic〉](#選變數與排值的-heuristicmrvdegreeleast-constraining-value)的 least-constraining value（[1:40:12](https://www.youtube.com/watch?v=qK46ET1xk2A&t=6012s)）。對 `var` 的每個候選單字，數它會讓多少個鄰居的單字不能用：鄰居的單字在交叉格字母和它不同，就算被排除。只算還沒指派的鄰居，把各鄰居的數字加起來，由少到多排。
6. **`select_unassigned_variable`**。對應同一節的 MRV（[1:35:56](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5756s)）與 degree heuristic（[1:36:34](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5794s)）。在還沒指派的變數裡挑 domain 最小的；平手時挑鄰居最多的。
7. **`backtrack`**。照講課的 `Backtrack` 虛擬碼寫。指派是一個 dict，鍵是 `Variable`，值是單字。要不要在裡面做[〈maintaining arc consistency〉](#搜尋與推論交錯maintaining-arc-consistency)（[1:32:14](https://www.youtube.com/watch?v=qK46ET1xk2A&t=5534s)）是選做；要做的話就用 `ac3` 的 `arcs` 參數。本文的提醒：`ac3` 會直接改 `self.domains`，所以某個單字走不通要退回時，被它縮小的 domain 也要還原。

規格的建議是 `order_domain_values` 與 `select_unassigned_variable` 先不管 heuristic、隨便回傳一個順序，讓整個流程跑通，再回頭補上排序；沒有 heuristic 結果一樣正確，只是可能多試一些指派。

### 虛擬碼

下面是把講課的虛擬碼換成填字遊戲的說法，沒有寫到 Python 的資料結構怎麼操作，那一部分要自己決定。

```text
Enforce-Node-Consistency():
    for each variable V:
        remove from V.domain every word whose length differs from V.length

Revise(X, Y):
    if X and Y share no cell: return false
    (i, j) = where the shared cell falls in X's word and in Y's word
    revised = false
    for each word x in X.domain:
        if no word y in Y.domain has the letter at j that x has at i:
            delete x from X.domain
            revised = true
    return revised

AC-3(arcs):
    queue = arcs if given, otherwise every pair (X, Y) that overlaps
    while queue non-empty:
        (X, Y) = Dequeue(queue)
        if Revise(X, Y):
            if X.domain is empty: return false
            for each Z in X.neighbors - {Y}:
                Enqueue(queue, (Z, X))
    return true

Consistent(assignment):
    inconsistent if two variables hold the same word
    inconsistent if some word's length differs from its variable's length
    inconsistent if two overlapping variables, both assigned, disagree on their shared cell
    otherwise consistent

Order-Domain-Values(V, assignment):
    for each word w in V.domain:
        cost(w) = how many words w rules out, summed over V's unassigned neighbors
    return V.domain ordered by cost, lowest first

Select-Unassigned-Variable(assignment):
    among the variables not in assignment:
        prefer the smallest domain
        on a tie, prefer the most neighbors
        on a further tie, any of them

Backtrack(assignment):
    if assignment complete: return assignment
    V = Select-Unassigned-Variable(assignment)
    for each word w in Order-Domain-Values(V, assignment):
        if assignment with {V = w} is consistent:
            result = Backtrack(assignment with {V = w})
            if result ≠ failure: return result
    return failure
```

### 容易出錯的地方

以下各條來自本站 2026-10-13 把參考實作接上官方檔案實跑，並在另一份副本裡刻意改錯的結果；列出的錯誤訊息都是實際看到的。

- **把 `neighbors` 當成 dict 用。** 現象：`TypeError: 'method' object is not subscriptable`。原因：`crossword.neighbors` 是方法，要用小括號呼叫，回傳一個 set。
- **把 `overlaps` 當成兩層 dict 用。** 現象：`KeyError: Variable(...)`。原因：它的鍵是一對變數，寫法是 `overlaps[v1, v2]`。另外，同一個變數配自己不在裡面，`overlaps[v, v]` 一樣是 `KeyError`；自己列舉所有變數對的時候要跳過相同的。
- **一邊走訪 domain 一邊從裡面刪單字。** 現象：`RuntimeError: Set changed size during iteration`。原因：domain 是 set，走訪途中不能改它的大小。講課的虛擬碼寫的是在迴圈裡 delete，照字面搬到 Python 的 set 上就會遇到，`enforce_node_consistency` 與 `revise` 都有這個問題。
- **把交叉位置的兩個數字用反。** 現象：`IndexError: string index out of range`，本站在三組官方資料上故意用反，多數時候是這個錯誤；`structure1`／`words1` 有時不報錯，直接印出 `No solution.`，同一份程式每次執行不一定相同。兩個位置剛好都在單字長度內時一定不會報錯，結果是明明有解卻說無解：本站另做了一組小資料當最小重現，橫向 CAT 與直向 TOP 在 T 交叉，交叉位置是 `(2, 0)`，正確的版本印出填字，用反的版本直接說無解。原因：`overlaps[x, y]` 的 `(i, j)` 裡，`i` 是 `x` 的單字的位置，`j` 是 `y` 的。察覺方式：`structure0` 裡長度 5 的直向變數和最下面長度 4 的橫向變數，兩個方向查到的分別是 `(4, 0)` 與 `(0, 4)`；用反了就會去拿四個字母的單字的第 4 個位置（從 0 數），那裡沒有字母。
- **以為 `ac3` 跑完就不會有重複的單字。** 現象：同一個單字在填字結果裡出現兩次。原因：arc consistency 只看交叉格的字母，不管單字有沒有重複。`structure0`／`words0` 就遇得到：`ac3` 之後，右邊長度 4 的直向變數還剩 FIVE 與 NINE 兩個字，而下面長度 4 的橫向變數只剩 NINE。兩個都填 NINE，交叉格的字母是對的，要靠 `consistent` 擋掉。少了這個檢查不是每次都會出錯：domain 的走訪順序每次不同，先試到 FIVE 的那幾次結果是對的，所以跑一次沒看到重複不代表沒有這個問題，要多跑幾次。
- **`consistent` 假設每個鄰居都已經有單字。** 現象：`KeyError: Variable(...)`。原因：傳進來的指派大多不完整，鄰居還沒指派就去拿它的單字。
- **無解時回傳 `None` 以外的東西。** 現象：`AttributeError: 'bool' object has no attribute 'items'`（回傳 `False` 的情況）。原因：官方的 `main` 用 `assignment is None` 判斷無解，其他的值都會被拿去印。察覺方式：跑 `structure1` 配 `words0`，應該印出 `No solution.`。
- **`ac3` 的回傳值沒有人接。** 官方的 `solve` 呼叫 `ac3` 之後不看回傳值，直接進 `backtrack`。所以就算 `ac3` 已經發現有 domain 變空，`backtrack` 還是會被呼叫，它自己要能在這種情況下回傳 `None`。
- **兩個排序函式寫錯，從結果看不出來。** `order_domain_values` 的順序排反，或 `select_unassigned_variable` 平手時挑錯，填字結果一樣是對的，只是多試幾次。這兩個函式要另外印出回傳值檢查，下一節有可以手算的案例。
- **每次執行的結果不一樣。** 這不是錯。domain 是 set，Python 每次啟動時字串的雜湊值不同，走訪順序跟著變。用參考實作把 `structure1`／`words1` 連跑十次，會看到好幾種不同的填字（本站一次看到 3 種，審稿者另一次看到 4 種），每一種都合法。所以不能拿自己的輸出和規格頁的範例逐字比。
- **自己測試時用小寫單字。** `crossword.words` 在讀檔時已經全部轉成大寫，拿 `"six"` 去比會一直不相等。
- **輸出圖檔失敗。** 沒裝 Pillow 會是 `ModuleNotFoundError`。裝了之後在別的目錄執行，會是 `OSError: cannot open resource`，因為 `save` 用相對路徑 `assets/fonts/OpenSans-Regular.ttf` 找字型，要在 `crossword` 目錄裡執行。

### 怎麼檢查自己寫的對不對

**1. 用最小的那組資料手算。** `structure0` 有四個變數：上面的橫向（長度 3）、左邊的直向（長度 5）、右邊的直向（長度 4）、下面的橫向（長度 4）。`words0` 是 ONE 到 TEN 十個單字。每一步之後把 `self.domains` 印出來，應該是：

| 變數 | 一開始 | `enforce_node_consistency` 之後 | `ac3` 之後 |
|---|---|---|---|
| 上面橫向，長度 3 | 10 個字 | ONE、SIX、TEN、TWO | SIX |
| 左邊直向，長度 5 | 10 個字 | EIGHT、SEVEN、THREE | SEVEN |
| 右邊直向，長度 4 | 10 個字 | FIVE、FOUR、NINE | FIVE、NINE |
| 下面橫向，長度 4 | 10 個字 | FIVE、FOUR、NINE | NINE |

這張表可以自己推：上面橫向的第一個字母要和左邊直向的第一個字母相同，ONE 配不到字，EIGHT 也配不到；左邊直向的最後一個字母要和下面橫向的第一個字母相同，只有 SEVEN 配 NINE 成立，SIX 跟著被決定；右邊直向和下面橫向的最後一個字母要相同，FOUR 出局。`ac3` 在這組資料上回傳 `True`。最後的填字只有一種：SIX、SEVEN、FIVE、NINE。

**2. 兩個排序函式的手算案例。** 同一組資料，只做完 `enforce_node_consistency`、指派還是空的時候：

- `order_domain_values`（上面橫向那個變數）：SIX、TEN、TWO 各會排除左邊直向的 2 個單字，ONE 會排除 3 個。回傳的 list 應該有四個單字，ONE 排最後，前三個順序不拘。
- `select_unassigned_variable`：後三個變數的 domain 都是 3 個字，平手；左邊直向與下面橫向各有 2 個鄰居，右邊直向只有 1 個。應該回傳左邊直向或下面橫向，不該是右邊直向，更不該是 domain 有 4 個字的上面橫向。

**3. 三個結構配三份單字表。** 本站用參考實作把九種組合各跑一次（2026-10-13，Python 3.15.0），結果如下。`None` 的兩格應該印出 `No solution.`：

| | `words0`（10 個字） | `words1`（51 個字） | `words2`（3000 個字） |
|---|---|---|---|
| `structure0`（4 個變數） | 有解 | 有解 | 有解 |
| `structure1`（6 個變數） | `None` | 有解 | 有解 |
| `structure2`（6 個變數） | `None` | 有解 | 有解 |

`structure1` 需要一個 12 個字母的單字，`words0` 裡沒有，所以無解。九種組合在本站的機器上每一種都在 0.1 秒內跑完；如果你的版本在 `structure2`／`words2` 上要等很久，先檢查兩個 heuristic 與 `ac3`。

**4. 檢查印出來的填字合不合法。** 因為每次的結果可能不同，要檢查的是性質：每個格子序列都有單字、長度正確、單字都在單字表裡、沒有重複、每個交叉格橫的直的讀起來是同一個字母。

**5. 圖檔。** 帶上第三個參數會輸出 PNG，每格 100 像素；`structure1` 是 14 欄 9 列，本站實跑得到 1400×900 的圖。

**6. 官方的檢查。**

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/3/crossword.zip
unzip crossword.zip && cd crossword

# 只印在終端機
python generate.py data/structure1.txt data/words1.txt

# 同時輸出圖檔（需要先 pip3 install Pillow）
python generate.py data/structure1.txt data/words1.txt output.png

# 自動評分
check50 ai50/projects/2024/x/crossword

style50 generate.py
```

規格開頭寫明這門課建議使用的 Python 版本最高到 3.12。這一週只有 Crossword 一個專案。

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。

下面八個函式填進官方 `generate.py` 的 `CrosswordCreator`：整段縮排四格，取代類別裡同名的八個方法（官方檔案裡它們的內容都是 `raise NotImplementedError`）。`backtrack` 用的是講課 `schedule0.py` 那種不帶推論的寫法。

```python
def enforce_node_consistency(self):
    for var in self.domains:
        self.domains[var] = {
            word for word in self.domains[var]
            if len(word) == var.length
        }

def revise(self, x, y):
    overlap = self.crossword.overlaps[x, y]
    if overlap is None:
        return False
    i, j = overlap
    removable = {
        wx for wx in self.domains[x]
        if not any(wx[i] == wy[j] for wy in self.domains[y])
    }
    self.domains[x] -= removable
    return bool(removable)

def ac3(self, arcs=None):
    if arcs is None:
        queue = [
            (x, y)
            for x in self.crossword.variables
            for y in self.crossword.neighbors(x)
        ]
    else:
        queue = list(arcs)
    while queue:
        x, y = queue.pop(0)
        if self.revise(x, y):
            if not self.domains[x]:
                return False
            for z in self.crossword.neighbors(x) - {y}:
                queue.append((z, x))
    return True

def assignment_complete(self, assignment):
    return all(var in assignment for var in self.crossword.variables)

def consistent(self, assignment):
    words = list(assignment.values())
    if len(words) != len(set(words)):
        return False
    for var, word in assignment.items():
        if len(word) != var.length:
            return False
        for other in self.crossword.neighbors(var):
            if other in assignment:
                i, j = self.crossword.overlaps[var, other]
                if word[i] != assignment[other][j]:
                    return False
    return True

def order_domain_values(self, var, assignment):
    def ruled_out(word):
        count = 0
        for other in self.crossword.neighbors(var):
            if other in assignment:
                continue
            i, j = self.crossword.overlaps[var, other]
            count += sum(1 for w in self.domains[other] if w[j] != word[i])
        return count

    return sorted(self.domains[var], key=ruled_out)

def select_unassigned_variable(self, assignment):
    unassigned = [
        var for var in self.crossword.variables
        if var not in assignment
    ]
    return min(
        unassigned,
        key=lambda var: (
            len(self.domains[var]),
            -len(self.crossword.neighbors(var))
        )
    )

def backtrack(self, assignment):
    if self.assignment_complete(assignment):
        return assignment
    var = self.select_unassigned_variable(assignment)
    for word in self.order_domain_values(var, assignment):
        new_assignment = assignment.copy()
        new_assignment[var] = word
        if self.consistent(new_assignment):
            result = self.backtrack(new_assignment)
            if result is not None:
                return result
    return None
```

和講課對照：`revise` 與 `ac3` 是虛擬碼的直譯，`(z, x)` 放回 queue 的那一行對應 `Enqueue(queue, (Z, X))`。`select_unassigned_variable` 的排序鍵先比 domain 大小（MRV），再比鄰居數的負值（degree 高的排前面）。

實跑紀錄（2026-10-13，macOS，Python 3.15.0）：放進官方 2023/x 的 distribution，三個結構配三份單字表共九種組合都跑過，結果就是上面「怎麼檢查」第 3 點那張表；有解的七種都通過第 4 點列的合法性檢查。另外在裝了 Pillow 的拋棄式環境裡跑過帶 `output.png` 的指令，產生 1400×900 的 PNG。沒有跑 `check50`。

</details>

---

## 學習檢核清單

- [ ] 能說出局部搜尋和第 0 週的搜尋差在哪裡，以及什麼樣的問題適合用它
- [ ] 能解釋 hill climbing 為什麼會停在局部極值，以及 random restart 與模擬退火各用什麼方式處理
- [ ] 能用 `e^(ΔE/T)` 說明溫度與「差多少」怎麼影響接受變差鄰居的機率
- [ ] 能把一個兩變數的問題寫成線性規劃的成本函數與限制式，包含把「大於等於」改寫成「小於等於」
- [ ] 能解釋 `Revise` 回傳 true 之後為什麼要把 `(Z, X)` 放回 queue
- [ ] 自己的 Crossword 在 `structure0`／`words0` 上，`enforce_node_consistency` 與 `ac3` 之後各變數的 domain 和「怎麼檢查」第 1 點的表相同
- [ ] 自己的 `order_domain_values` 與 `select_unassigned_variable` 通過「怎麼檢查」第 2 點的兩個手算案例
- [ ] 九種結構與單字表的組合，有解與 `No solution.` 的分布和「怎麼檢查」第 3 點的表相同
- [ ] 能在考試排程的圖上手動走一次回溯搜尋，並說明 maintaining arc consistency 省掉了哪些步驟
- [ ] 能說明 MRV、degree heuristic 與 least-constraining value 各自決定什麼，以及後兩者方向相反的理由
- [ ] 能解釋 Crossword 的 `overlaps[v1, v2]` 怎麼表示 binary constraint
- [ ] Crossword 專案 `check50` 全綠

## 課程影片來源

官方 CS50 YouTube 播放清單（CS50's Introduction to Artificial Intelligence with Python，8 支）已於 2026-10-10 即時核對，第 3 週的講課錄影在清單中。

原始影片：[Optimization - Lecture 3 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=qK46ET1xk2A)

課程與錄影入口：

- [CS50 AI Week 3 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/3/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-13）：用 yt-dlp 取得帶時間碼的英文字幕，讀完全片 1:44:44 後重寫「講課導讀」，各節起點與文中引用的數字（醫院例子的成本、`hospitals.py` 與 random restart 的輸出、線性規劃的係數與解、考試排程的修課表與回溯步驟、least-constraining value 的排除數）都取自字幕；沒有看投影片，地圖、state-space landscape 與 constraint graph 的畫面沒有重建。字幕有四處會影響數字或意思的口誤，本文依前後文與講課原始碼寫：16:21 把「還不是全域最小值」說成 local minimum；25:09 把移動的醫院說成 house；45:31 把 x₁ 每小時的人力說成 50（前後與程式都是 5）；49:15 把第二條限制式的上界說成 90（程式是 −90）。另有幾處不影響內容的口誤，正文已寫對：44:48 把 x₁ 說成 x；1:28:44 把 `schedule1.py` 說成 `schedule.py`；1:37:39 把 C 剩下的 value 說成 variable；1:40:17 把 least-constraining value 定義裡的 values 與 variables 說反。六段虛擬碼與官方筆記（2020 版 Week 3 Notes）逐行對過：`Simulated-Annealing`、`Revise`、`AC-3` 與兩版 `Backtrack` 相同，只差筆記把 `if …: return …` 這類句子拆成兩行；`Hill-Climb` 筆記寫 `best valued neighbor`，本文照講者 9:54 的口述寫 `highest valued neighbor`。least-constraining value 例子的節點名稱（B、E、F）取自官方筆記。`hospitals.py`、`production.py`、`schedule0.py` 的片段與描述另外對過講課原始碼（`src3.zip`）。`production.py` 由獨立審稿者用 scipy 1.18.1 實跑，輸出 `X1: 1.5 hours`、`X2: 6.25 hours`，目標值 575.0，與字幕 50:15 相同；作者之後也在拋棄式環境重跑，得到同樣兩行輸出。字幕全程未提到本週專案 Crossword，專案說明來自課程官網而非影片。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 CS50 YouTube 播放清單即時核對，本週講課錄影存在，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。移除字幕中沒有的項目與專案介紹，時間碼改為依字幕估算的約略值。
- 2026-10-13：播放器從文末來源區移到「課程影片與時間軸」，開頭補上片長。
- 2026-10-13：用帶時間碼的字幕重新核對時間軸，約略分鐘數改為實際起點，每一列連到影片的對應位置；片長依 yt-dlp 回報改為 1:44:44。
- 2026-10-13：「核心概念速覽」依字幕重寫成十節的「講課導讀」，每節附時間連結與一題自我檢查。原速覽裡講課沒有提到的內容已移除：sideways moves、山脊（ridge）、各演算法的「缺點」欄、「T → 0 時退化為 Hill Climbing」、前向檢查（forward checking）、「最小衝突值」的說法，以及不是講課程式的 `ac3.py`、`backtracking.py` 片段。
- 2026-10-13：專案節依官方 2023/x 的 `crossword.zip` 重寫。原本貼的 distribution code 與官方檔案不符（`CrosswordCreator.__init__` 多了 `words` 參數、`overlaps` 寫成兩層 dict、`neighbors` 當成屬性、`solve` 少了 node consistency 與 AC-3 兩步），參考實作用了官方沒有的 `add_constraints`、`self.constraints`、`is_consistent`、`forward_check`，放進官方檔案無法執行。改成官方的類別定義與八個待實作函式，參考實作換成實跑過三組官方資料的版本。
- 2026-10-13：依獨立審稿修正。simplex 改為「最早被提出的解法之一」（原寫成最早的）；回溯搜尋一節的自我檢查換成手動走 `schedule0.py` 的變數順序，原本「為什麼剛好六組解」的推導移進正文；least-constraining value 的例子補上官方筆記寫明的節點；虛擬碼與官方筆記對過後改寫來源說明；交代「約束」與「限制式」是同一個字；參考實作補上縮排方式與圖檔輸出的實跑結果；內容核對行補列其餘口誤與 `production.py` 的實跑結果；用語統一為「第 3 週」「這一週」「播放清單」「課程官網」。
- 2026-10-13：專案節改成任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方、檢查方式在前，完整參考實作摺疊在最後並加上說明，連到課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)。參考實作的程式碼沒有改動；新增九種結構與單字表組合的實跑結果。學習檢核清單裡關於專案的項目改成可以自己驗證的條件。
- 2026-10-13：依專案節複審修正。`Consistent` 的虛擬碼改成只列三個條件；`tldr` 與 `description` 改成與現況相符（參考實作摺疊在最後）；交叉位置用反而不報錯的情況改成小資料的實測結果；「每次結果不同」與「重複單字」兩條改成不依賴單次執行的說法；最後一個小節標題改為「完整參考實作」。摺疊區塊的程式碼沒有改動。

## 參考資料

- [Week 3 Optimization 講課頁](https://cs50.harvard.edu/ai/weeks/3/) — 影片、投影片、逐字稿、Quiz
- [Optimization - Lecture 3（YouTube）](https://www.youtube.com/watch?v=qK46ET1xk2A) — 「講課導讀」的底本，內容、數字與時間連結取自它的英文字幕
- [第 3 週講課原始碼 src3.zip](https://cdn.cs50.net/ai/2020/spring/lectures/3/src3.zip) — `hospitals.py`、`production.py`、`schedule0.py`、`schedule1.py`
- [Week 3 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/3/) — 官方筆記，可對照投影片上的圖
- [Crossword 專案規格](https://cs50.harvard.edu/ai/projects/3/crossword/) — Distribution code `2023/x`、check50 slug `ai50/projects/2024/x/crossword`
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm) — 含第 3 週完整影片
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
