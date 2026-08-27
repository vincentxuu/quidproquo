import fs from 'node:fs';
import path from 'node:path';
const dir='src/content/posts/learning';
const specs={
1:{slug:'what-is-probability',zh:`## Worksheet agenda：從列結果到公理

第一題用三次擲硬幣固定「事件是樣本空間的子集合」。八個序列是等可能的原子結果；「至少兩次正面」包含 HHH、HHT、HTH、THH，「第一次反面」包含 THH、THT、TTH、TTT。兩事件交集是 THH，因此不是互斥。這個小題同時要求三個動作：完整列出樣本空間、把自然語言翻成集合、用交集判斷互斥，而不是看兩句話聽起來是否衝突。

第二題刻意設下「點數和」陷阱。兩顆可區分骰子的基本結果是 36 個有序對；和為 7 有六個，和為 2 只有一個。把 2 到 12 當成十一個結果會錯，因為那些和並不等可能。這也是等可能公式的使用條件：只有在原子結果等可能時，才能用有利結果數除以總結果數。

第三題把公理落在撲克牌。紅心有 13 張，Ace 有 4 張，但紅心 Ace 同時屬於兩個事件，所以聯集不能直接相加；要扣掉被算兩次的交集。Ace 與 J/Q/K 則互斥，可以直接相加。這讓第三條公理的限制變得具體：可加性首先保證互斥事件相加；一般事件的聯集公式要另外處理重疊。

第四題用十二格轉盤比較直接數聯集與補事件。倍數 3 和不大於 4 在結果 3 重疊；「不是 7」則直接用 1 減掉 1/12。補事件不是小技巧，而是把難數的大片集合換成容易數的小集合。

第五題區分機率的長期頻率詮釋與公理限制。365 天裡 219 個晴天給的是資料上的估計，不是下一天的保證。機率 1.2 違反非負與上界；兩個事件的機率相加超過 1 卻不必然違法，因為它們可能重疊。若 P(E)=0.4，補事件精確等於 0.6，不是某個可變的上限。

## 六個 LLM guide 概念如何使用

官方 guide 依序要求 sample space、event、equally likely outcomes、long-run frequency、axioms、complement。正確用法是先自己作答，再請模型檢查遺漏的原子結果或不等可能陷阱。尤其骰子點數和那題，應要求模型指出「哪一層結果才等可能」，而不是只索取分數。`,en:`## Worksheet agenda: from listing outcomes to the axioms

The first problem anchors the statement that an event is a subset of a sample space. Three flips produce eight equally likely sequences. “At least two heads” contains HHH, HHT, HTH, and THH; “first flip is tails” contains THH, THT, TTH, and TTT. Their intersection contains THH, so they are not mutually exclusive. The task combines three moves: enumerate outcomes, translate prose into a set, and use intersection—not verbal intuition—to test exclusivity.

The second problem sets the classic sum-of-dice trap. Two distinguishable dice have 36 ordered outcomes. Six sum to seven and only one sums to two. Treating sums 2 through 12 as eleven equally likely outcomes fails because those sums have different multiplicities. Favorable-over-total counting is valid only after choosing equally likely atomic outcomes.

The card problem turns the axioms into arithmetic. Hearts contain 13 cards and aces contain four, but the ace of hearts belongs to both. The union must subtract that duplicate. Aces and face cards J/Q/K are disjoint and may be added directly. The spinner problem then contrasts direct union counting with the complement rule: multiples of three and values at most four overlap at three, while “not seven” is simply one minus 1/12.

The final problem separates long-run frequency from certainty. The 219 sunny days among 365 observations estimate a rate, not tomorrow’s outcome. Probability 1.2 violates the axioms, while two event probabilities summing above one need not: the events may overlap. If P(E)=0.4, the complement is exactly 0.6.

## Using the six LLM-guide concepts

The official guide orders sample space, event, equally likely outcomes, long-run frequency, axioms, and complement. Use it after attempting the work: ask the model to identify omitted atomic outcomes or a false equal-likelihood assumption. For the dice-sum problem, the useful question is which level of outcomes is equally likely—not a request for the final fraction.`},
2:{slug:'conditional-probability',zh:`## Worksheet agenda：條件、chain rule、全機率與 Bayes

第一題先用單顆骰子複習集合運算：偶數與大於 3 的交集不是空集合，聯集要避免重複計數，補事件可直接處理「不是 6」。這段複習的目的，是讓條件機率分子 P(E∩F) 有清楚的集合意義。

第二題比較三個問題。無條件下，兩骰和為 8 有五個有序對；已知第一顆是 5 時，條件樣本空間只剩六個結果，其中只有第二顆為 3 成功；已知至少一顆是 5 時，條件集合有十一個結果，成功的有 (5,3) 與 (3,5)。兩個條件都提到 5，答案卻不同，因為被保留下來的樣本空間不同。

第三題用不放回抽牌呈現 chain rule。兩張都是 Ace 的機率是 4/52 乘 3/51；King 後接 Queen 是 4/52 乘 4/51；前三張都是紅心則繼續乘 13/52、12/51、11/50。每抽一張，後一項的分母與有利張數都要依已知結果更新。這正是相依，不是公式麻煩。

第四、五題是一棵 spam probability tree。先驗 P(spam)=0.3，likelihood P(free|spam)=0.6；ham 分支是 0.7 與 0.1。全機率公式把兩條通往 free 的路徑相加，得到 P(free)=0.25。Bayes 再取 spam-and-free 的 0.18 除以 0.25，得到 posterior 0.72。prior、likelihood、evidence、posterior 各有不同角色，不能只記分子分母的位置。

第六題用疾病盛行率展示 base-rate effect。一千人中約十人有病，其中約 9.8 人陽性；990 位健康者中約 49.5 人偽陽性。於是陽性者大多仍來自龐大的健康族群。敏感度高不等於 positive predictive value 高，後者必須把盛行率放進分母。

## 一棵樹如何統一四條公式

沿樹枝相乘是 chain rule；通往同一葉標籤的互斥路徑相加是 total probability；觀察葉標籤後反問來自哪條上游分支，就是 Bayes。把公式畫回樹上，比背四個孤立等式穩定。`,en:`## Worksheet agenda: conditioning, chain rule, total probability, and Bayes

The opening die problem reviews sets so that the numerator P(E∩F) has a concrete meaning. The second problem then compares three dice questions. Unconditionally, five ordered pairs sum to eight. Given that the first die is five, only six outcomes remain and only a second die of three succeeds. Given that at least one die is five, eleven outcomes remain and both (5,3) and (3,5) succeed. Similar English conditions produce different answers because they retain different sample spaces.

Drawing without replacement makes the chain rule visible. Two aces have probability 4/52 times 3/51. A king followed by a queen is 4/52 times 4/51. Three hearts multiply 13/52, 12/51, and 11/50. Every draw changes the next denominator and favorable count; that update is the dependence.

The spam problems form one probability tree. The prior is P(spam)=0.3 and the likelihood is P(free|spam)=0.6; the ham branch contributes 0.7 and 0.1. Total probability adds the two paths to “free,” giving 0.25. Bayes divides the spam-and-free path, 0.18, by that evidence to obtain posterior 0.72. Prior, likelihood, evidence, and posterior have distinct roles.

The medical-test problem exposes the base-rate effect. Among one thousand representative people, about ten have the disease and 9.8 test positive; among 990 healthy people, about 49.5 false positives appear. Most positive tests can therefore come from the much larger healthy group. High sensitivity is not high positive predictive value unless prevalence enters the denominator.

## One tree unifies four formulas

Multiplying along branches is the chain rule. Adding disjoint paths to one label is total probability. After observing the label, asking which upstream branch produced it is Bayes. Mapping equations back onto this tree is more reliable than memorizing isolated fractions.`},
3:{slug:'bayes-theorem',zh:`## Worksheet agenda：這一講其實是 independence

Schedule 把 Lecture 3 寫成 Bayes Theorem，但當期 worksheet 與 navbar 都把核心放在 independence 與 inclusion-exclusion。這個來源落差不能抹平：本文以 worksheet 的實際 agenda 為準，同時把它接在前一講 Bayes 之後。

兩事件 inclusion-exclusion 先處理重疊。課程中修 CS 的比例 0.60、修 math 的比例 0.40、兩者皆修 0.25，所以聯集是 0.75，兩者皆非是 0.25。直接相加會把雙修者算兩次。三集合時還要先扣三個兩兩交集，再把被扣太多的三重交集加回。

Cloud City 題目把 independence 變成可從資料檢查的假設。先用 history 中 True 的比例估計 P(rain tomorrow)，再只挑「今天晴天」的相鄰日，估計 P(rain tomorrow|sunny today)。兩者接近只能說資料與獨立模型相容，不能證明天氣在因果上獨立；還要考慮季節性與時間趨勢。

排會議題用補事件避免八個時段的大聯集。每人每格 busy 機率 0.7，所以同一格兩人皆 free 是 0.3²；沒有任何共同空檔是 (1-0.09)^8，至少一格則取補數。這步仰賴跨人、跨時段獨立，少任何一項都不能直接乘。

半小時錯位的印度／英國題不能把兩個候選會議視為獨立，因為它們共享 A 與 D。可行事件是 ACD 或 ABD；應提取共同條件，再對 B 或 C 的聯集做 inclusion-exclusion。這題把 AND、OR、independence 與 shared component 放進同一張圖。

## Independent、mutually exclusive 完全不同

互斥表示不能同時發生，交集機率為零；獨立表示知道一件事不改變另一件事的機率。兩個正機率事件若互斥，知道 E 發生後 F 的機率降為零，反而極度相依。可靠度問題中，元件獨立是模型假設；series system 要全部成功，parallel system 則通常用「全部失敗」的補事件。`,en:`## Worksheet agenda: this lecture is actually about independence

The schedule labels Lecture 3 “Bayes Theorem,” while the current worksheet and navbar center independence and inclusion-exclusion. That source conflict should not be hidden. This guide follows the worksheet agenda and shows how it continues the previous lecture.

Two-event inclusion-exclusion handles overlap. If 0.60 of students take CS, 0.40 take math, and 0.25 take both, the union is 0.75 and neither is 0.25. Direct addition counts dual enrollment twice. With three sets, subtract the pairwise intersections and restore the triple intersection that was removed too often.

The Cloud City problem turns independence into a data-checkable assumption. Estimate marginal rain frequency from all True values, then estimate tomorrow’s rain only among adjacent pairs where today was sunny. Similar estimates are compatible with independence, but do not establish causal independence; seasonality and time trends remain possible.

The scheduling problem uses a complement to avoid an eight-way union. Each person is free with probability 0.3, so both are free in one block with probability 0.3 squared. No common free block has probability (1-0.09)^8, and at least one is its complement. This multiplication requires independence across people and blocks.

The half-hour India/UK problem cannot treat two meeting options as independent because both share blocks A and D. The feasible event is ACD or ABD. Factor the shared requirements, then apply inclusion-exclusion to B or C. The exercise combines AND, OR, independence, and shared components in one diagram.

## Independent is not mutually exclusive

Disjoint events cannot occur together. Independent events leave each other’s probabilities unchanged. Two positive-probability disjoint events are strongly dependent: observing one drives the conditional probability of the other to zero. In reliability models, component independence is an assumption; series systems require every component, while parallel systems are often solved through the complement “all fail.”`},
4:{slug:'counting-combinatorics',zh:`## Worksheet agenda：先問順序與重複，再選公式

三元件服務題先複習獨立與補事件：全數正常是 0.95³，至少一個故障是 1-0.95³。這也預告 counting 的基本策略——直接數困難時，改數補集合。

四位解鎖碼允許重複時是 10⁴；不重複時是 10·9·8·7。已知六個不同數字但不知道順序，排列數是 6!。product rule 的重點不是一直乘，而是把建構結果拆成依序選擇，並在每一步更新剩餘選項。

Fantasy draft 題同時有類別限制與排名。恰好兩位 goalkeeper：先選並排列兩位守門員所在的人選，再選其餘四位非守門員，最後處理六人的排名；等價計數法必須得到同一答案。若六位中四位 forward，再從六位等可能選三位 starter，全是 forward 的機率是 C(4,3)/C(6,3)。draft 有順序，starter committee 沒順序，正是本講要抓的切換。

BANANA 的六個字母含 A 三個、N 兩個，因此是 6!/(3!2!)；MISSISSIPPI 則依 I、S、P 的重複數除掉各群內交換。分母不是神祕修正，而是每個可見字串在全 distinct 排列裡被重複生成的次數。

五張牌手牌、十人選三人、長度十且恰有三個 1 的 bit string 都是 combination：只需選位置或成員，不在意列出的順序。Flush 的有利手牌是四個花色乘每個花色選五張；four of a kind 先選 rank，再選第五張非該四張的牌。分母都用 C(52,5)，因為基本結果是等可能手牌而非發牌序列。

十次硬幣的樣本空間是 2¹⁰。恰四次正面只需選四個正面位置，機率是 C(10,4)/2¹⁰；至少八次正面要把 k=8、9、10 三個互斥計數相加。恰兩張 Ace 的 challenge 同樣分兩步：從四張 Ace 選二，再從 48 張非 Ace 選三。

## 一張決策表

若結果按步驟建立，用 product rule；若使用全部物件且順序重要，用 permutation；若只選子集且順序不重要，用 combination；若有重複物件，除掉群內交換；求機率前最後確認分母中的基本結果是否等可能。`,en:`## Worksheet agenda: decide order and repetition before choosing a formula

The three-component review gives all-up probability 0.95 cubed and at-least-one-down probability one minus that value. It previews a central counting move: count the complement when direct counting is awkward.

A four-digit code has 10^4 possibilities with repetition and 10·9·8·7 without it. If six distinct smudged digits are known but their order is not, there are 6! orders. The product rule is not “multiply everything”; it builds an outcome step by step and updates the choices remaining at each step.

The fantasy draft mixes category constraints and ranking. Exactly two goalkeepers requires selecting eligible people while preserving the six-position ranking. In the second part, if four of six drafted players are forwards and three unordered starters are selected, the all-forward probability is C(4,3)/C(6,3). The draft is ordered; the starter committee is not.

BANANA has six letters with three As and two Ns, giving 6!/(3!2!). MISSISSIPPI divides by the internal permutations of repeated I, S, and P groups. The denominator removes the number of distinct-label permutations that produce the same visible string.

Five-card hands, three-person committees, and length-ten bit strings with exactly three ones are combinations: choose members or positions without ordering them. Flushes count four suits times C(13,5). Four of a kind chooses a rank and then a fifth card. Both divide by C(52,5), because the atomic outcomes are equally likely hands rather than deal sequences.

Ten flips produce 2^10 sequences. Exactly four heads chooses four head positions; at least eight adds the disjoint counts for eight, nine, and ten heads. The two-aces challenge similarly chooses two of four aces and three of 48 non-aces.

## A decision table

Use the product rule to construct outcomes in stages, permutations when order matters, combinations for unordered subsets, and division by internal swaps for repeated objects. Before turning a count into probability, verify that the denominator’s atomic outcomes are equally likely.`},
5:{slug:'random-variables-expectation',zh:`## Worksheet agenda：從 counting 走到 binomial PMF

第一題用十二人委員會複習 combination。四人委員會總數是 C(12,4)；恰兩位 senior 是 C(5,2)C(7,2)；全是 junior 是 C(7,4)。這些計數會直接變成 binomial PMF 裡的組合係數，但不放回抽樣本身不是 binomial。

三次公平硬幣把八個序列映成 Y=正面數。Y 的值只有 0、1、2、3，PMF 分別由對應序列數除以八得到；四個值相加必須為一。隨機變數壓縮了原始結果：HTH 與 THH 是不同 outcome，卻映到同一個 Y=2。

地震題給 P(X=k)=c/2^k。合法 PMF 的總和是 1，而從 k=1 起的幾何級數也等於 1，所以 c=1。接著 P(X=3)=1/8，P(X≤2)=1/2+1/4。這題要練的不是地震模型是否寫實，而是先做 normalization 再問事件機率。

辨認 binomial 要逐項檢查：固定 n 次試驗、每次只有 success/failure、成功率 p 固定、試驗獨立。獨立 bit 與廣告曝光符合；不放回抽五張牌的紅心數不符合，因為每抽一張都改變下一張成功率。恰三個 1 的機率由 C(8,3) 選成功位置，再乘 0.5³0.5⁵。

七台 server 各自以 0.8 存活，X~Bin(7,0.8)。失效事件 X<2 只含 X=0 與 X=1，正常機率用 1 減掉這兩項。這比直接加 X=2 到 7 短，也降低漏項機會。

觀眾題中只有二十位 expert 進入 X，因此 X~Bin(20,0.7)，不是把兩百人全放進 n。恰十四票與至少十八票都從同一 PMF 取不同集合。Best-of-7 題若假定七場全打，勝系列是 X≥4；不能只選四個勝場後把其餘寫成 anything，因為不同選定四場的事件會在五勝、六勝、七勝結果上重疊。

Galton board 把每層向右視為 Bernoulli trial，五層後桶位就是向右次數。C(5,k)/2⁵ 的對稱來自 C(5,k)=C(5,5-k)，中央桶較高則來自能通往中央的路徑較多。

## Binomial 式子的每一塊

C(n,k) 選出成功出現在哪 k 次；p^k 是那些成功同時發生；(1-p)^(n-k) 是其餘失敗；相乘得到一種成功位置集合的機率，再由組合係數加總所有互斥位置集合。只背整式，最容易漏掉的正是四個建模條件。`,en:`## Worksheet agenda: from counting to the binomial PMF

The committee review has C(12,4) total committees, C(5,2)C(7,2) with exactly two seniors, and C(7,4) all-junior committees. These counts anticipate the binomial coefficient, although sampling without replacement itself is not binomial.

Three fair flips map eight sequences to Y, the number of heads. Y takes only 0, 1, 2, and 3, with probabilities obtained by counting mapped sequences; they must sum to one. A random variable compresses outcomes: HTH and THH differ as sequences but both map to Y=2.

The earthquake PMF P(X=k)=c/2^k must normalize. Because the geometric series from k=1 sums to one, c=1; P(X=3)=1/8 and P(X≤2)=1/2+1/4. The exercise tests normalization before event queries, not the realism of this seismic model.

A binomial model requires fixed n, binary trials, constant p, and independence. Independent bits and ad impressions qualify. Hearts in five cards drawn without replacement do not, because every draw changes the next success probability. Exactly three ones in eight positions uses C(8,3) to select success locations and multiplies the appropriate success and failure powers.

For seven servers independently alive with probability 0.8, X is Bin(7,0.8). Failure X<2 contains only zero and one live server; uptime is its complement. In the audience problem, X counts only the twenty experts, so X is Bin(20,0.7), not a model with n=200.

In the best-of-seven exercise, assuming all games are played, winning is X≥4. Selecting four wins and calling the remaining games “anything” double-counts outcomes with five, six, or seven wins because the selected-slot events overlap. The Galton board finally turns every right move into a Bernoulli trial; bucket k has probability C(5,k)/2^5, symmetric because C(5,k)=C(5,5-k).

## Every factor in the binomial formula

C(n,k) chooses the success locations, p^k makes those successes occur, and (1-p)^(n-k) makes the rest fail. Multiplication gives one location pattern; the coefficient adds all disjoint patterns. Memorizing the expression without its four modeling conditions is the common failure mode.`}}
for(const [n,s] of Object.entries(specs)){
 const nn=String(n).padStart(2,'0');
 for(const lang of ['zh','en']){
  const suff=lang==='en'?'-en':'';
  const f=path.join(dir,`2026-08-22-stanford-cs109-lecture-${nn}-${s.slug}${suff}.md`);
  let t=fs.readFileSync(f,'utf8');
  const marker=lang==='en'?'\n---\n\n## Extension:':'\n---\n\n## 延伸：';
  t=t.replace(marker,`\n\n${s[lang]}${marker}`);
  fs.writeFileSync(f,t);
 }
}
