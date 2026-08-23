---
title: "Stanford CS224W 第 18 講：Deep Generative Models for Graphs：GraphRNN 與目標導向分子生成"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 19
tldr: "依 Fall 2025 官方投影片整理第 18 講，涵蓋 圖生成問題與資料表示、生成品質的評估、GraphRNN 的 autoregressive factorization，並標明公開材料邊界。"
description: "Stanford CS224W Fall 2025 第 18 講完整 agenda 與自學筆記，不混用 2021 錄影。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-18-graph-generative-models-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 18 講**，官方日期 2025-12-02。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[第 18 講官方投影片](https://web.stanford.edu/class/cs224w/slides/18-deep-generation.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。

## 本講完整 agenda

### 1. 圖生成問題與資料表示

圖生成要學的是圖分布，而不是固定圖上的標籤。輸出大小可變、節點沒有天然順序，且 adjacency matrix 的不同排列可能代表同一張圖，讓 likelihood 與生成順序都變複雜。

### 2. 生成品質的評估

評估需同時看 validity、uniqueness、novelty 與結構統計是否接近資料；特定應用還要看 downstream property。只比較漂亮樣本會忽略 mode collapse 與重複生成。

### 3. GraphRNN 的 autoregressive factorization

GraphRNN 把圖拆成節點序列與每個新節點連到既有節點的 edge sequence，以階層式 RNN autoregressively 生成。節點排序仍影響序列，因此 ordering strategy 是模型的一部分。

### 4. 分子圖與 validity constraints

分子圖還受原子價數與化學有效性限制。任意加邊可能立刻產生無效分子，所以 action space、mask 與 environment validation 必須共同保證合法操作。

### 5. GCPN 的 reinforcement learning objective

GCPN 把分子建立視為 policy，reward 結合目標 property、validity 與其他約束。reward 設計會決定模型鑽哪個漏洞；應逐項報 reward component 與生成失敗。

## 圖生成完整 agenda

### 問題定義

Graph generation學的是可變大小graph分布，可能是unconditional、conditioned on attributes，或goal-directed optimization。Node ordering不是graph語意，generation likelihood卻常依序列factorization，因此ordering與permutation handling是核心。

### 表示選擇

Adjacency matrix一次生成有O(n²)輸出且排列多義；edge list序列長度可變；node-by-node方法每次加入node與edges。不同表示改變validity、parallelism與error accumulation，不能只比較decoder名稱。

### Autoregressive factorization

將p(G)拆成一連串node/edge decisions，可用teacher forcing訓練。Inference時吃自己先前sample，會有exposure bias；early error改變後續所有可用actions。報invalid partial graphs與termination behavior。

### GraphRNN hierarchy

GraphRNN以graph-level RNN維持已生成nodes狀態，再以edge-level RNN生成新node對先前nodes的連接。BFS-like ordering縮短edge sequence、降低排列空間，但ordering仍是model protocol。需報max nodes與max previous-node window。

### Likelihood與sampling

Teacher-forced likelihood高不保證sample多樣或valid。Sampling temperature、top-k與termination threshold改生成distribution。所有quality comparison固定sampling policy並生成足夠樣本，不能挑最好看的幾張。

### 評估統計

比較degree、clustering、orbit/motif、path length等distributions，可用MMD等距離；還要validity、uniqueness、novelty。沒有單一metric涵蓋全部。Train memorization可讓structural statistics漂亮但novelty低。

### 分子graph

Atoms與bonds有type、valence與chemical validity。Action mask可禁止非法bond，environment可用chemistry toolkit驗證。Validity高可能只是action space限制，不等於property好或molecules可合成。

### GCPN

Graph Convolutional Policy Network把partial molecule編碼成state，以RL選加atom/bond等actions。Reward結合target property、validity與可能的adversarial/similarity terms。Reward scaling與termination會塑造policy。

### Reward hacking

若只最大化單一predicted property，generator可能找到predictor漏洞或不現實structure。報每個reward component、constraint violation與out-of-domain score；最好用獨立evaluator或人工/實驗驗證，不把同一predictor分數當真實成果。

### Conditional generation

Condition可為desired property、size或scaffold。評估同時看condition satisfaction與diversity。若training data中property與size高度相關，模型可能靠size proxy；做matched-size或counterfactual condition test。

### Scaling與reproducibility

保存node ordering、vocabulary、max size、teacher forcing、sampling seed、temperature、validity rules、reward model version。Generation需報sample count與compute；少量samples的distribution metric variance很大。

### 驗收

在paths、cycles、stars synthetic dataset先驗證size/degree/motif distributions，再進molecules。對GraphRNN重排training graphs測ordering sensitivity；對GCPN逐步記action、mask、reward。另做train-nearest-neighbor檢查避免memorization。

## 實作、失敗模式與驗收

### Permutation likelihood

同一graph有多個node orderings，sequence model對每個ordering likelihood不同。Canonical/BFS ordering降低variance但引入bias；random permutations可augmentation但增加訓練負擔。報ordering policy與evaluation是否對多ordering marginalize。

### Validity stages

Syntax validity（序列可解析）、graph validity（無非法index/duplicate）、domain validity（化學valence）、task constraint分層報。只報最後一項會看不到失敗在哪階段；hard masks與post-hoc repair也需區分。

### Mode collapse

Uniqueness高仍可能只在少數modes附近變動。比較motif/size/property joint distribution、coverage of training clusters與nearest-neighbor distance。Sample count固定並附confidence/variance。

### Novelty

不在training set不代表真正新：node ordering不同可能是isomorphic duplicate。Novelty check需canonical graph hash/isomorphism-aware；分子可用canonical representation與scaffold similarity。

### RL evaluation

GCPN reward curve 不是最終品質。用獨立 property predictor 或真實 oracle 複評，報告 reward model 與 independent evaluator 的差距。多 objective 需用 Pareto 或逐 component 報告，不以加權總分掩蓋 constraint failure。

### Acceptance

Tiny generator 應 overfit 一小組 graphs 並重現 distribution；再於 held-out size 測試 termination 與 generalization。每個 sample 保存 actions、log-probs、validity 與 reward，發現 invalid 時定位第一個非法 action。

## 自學檢查點

所有統計都以同一批canonicalized samples計算。

Generation報告必須附raw samples或可重建seed，不能只附經人工挑選的案例。

最終建立固定evaluation harness：同一checkpoint以三個sampling seeds各生成相同數量graphs，先canonicalize/deduplicate，再計validity、uniqueness、novelty與structural/property distributions。Metric同時對training bootstrap samples計一次，提供資料本身有限樣本的reference variance。若model-to-data distance沒有優於train split間自然差異，不能宣稱高度逼真。

對molecule generator另列hard constraint rejection、post-hoc repair與independent property evaluation。Repair後有效率不能混成raw validity；property optimizer也要報scaffold diversity與nearest training molecule。這能辨認generator是在創造新候選，還是微調/複製已知高分structure。

把 pipeline 拆成 graph construction、retrieval 或 sampling、encoder、prediction head 與 evaluation。每次只替換一個部件，保留成本與失敗 trace，才知道改動是否真的有效。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 18 official slides](https://web.stanford.edu/class/cs224w/slides/18-deep-generation.pdf)
