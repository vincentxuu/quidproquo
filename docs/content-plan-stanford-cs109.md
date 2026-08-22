# 內容規劃：Stanford CS109 逐講系列

- Offering：Stanford CS109, **Summer 2026**（目前最新且 schedule 完整公開的單一 offering）
- 講者：Chris Gregg；Lecture 24 為未具名 guest lecture
- 官方規模：28 lectures；目前 **22 / 28 組已完成 fidelity rewrite 與獨立內容審查**，已解除 `draft`；其餘 6 講維持材料阻塞。
- Lecture 1–22 已完成 artifact-level rewrite；Lecture 23–28 為 L1，已移出發布內容目錄。
- 總覽：既有 `2026-08-21-stanford-cs109-probability{,-en}.md`，保留 slug、date 與 `series.order: 1`
- 預定逐講：官方 Lecture 1–28 對應連續 `series.order: 2–29`；只有通過 agenda coverage 稽核才可解除 draft。
- 來源 manifest：`.work/stanford-cs109-notes/SOURCES.md`

## Offering 決策

不把 Spring 2026 或封存學期當成 Summer 2026 的逐講證據。Summer 2026 官網首頁明列 term、教室與授課者，schedule 則有 28 個編號教學單元；`/spr26` 讀本與部分講次頁／投影片只作為跨 offering 共用教材。文章必須明說這層來源邊界，不能把 Spring-dated artifact 稱為 Summer 當期頁面。

## 編號衝突的處理

Schedule 是 canonical manifest：Lecture 23 是 Midterm 2 practice、24 是 Diffusion、25 是 Beyond Classification、26 是 Applications / Practice、27 是 Beyond CS109、28 是 Review Session。

2026-08-22 直接檢視官網 HTML 時，啟用中的 navbar 有 24、25、26、27、28，卻漏掉 23；同一份 HTML 還保留多組被註解掉的舊連結，其中 27/28 曾分別指向 Diffusion / Your Future，另有 Reinforcement 版本。這說明衝突來自未清除的歷史 navigation，而不是當期 schedule 有兩套正式編號。文章標題、日期與順序一律依 schedule；navbar 只用來連到仍可存取的講次頁。

## 編輯契約

1. 每篇前三段標出 course、term、lecture/date、講者、官方材料與缺口。
2. 課程內容按該講主題推進；無公開錄影，不把重建內容寫成講者逐字主張。
3. Lecture 1–14 以 Summer schedule／worksheet／answer key／LLM guide 為當期 agenda 證據，再以 Spring-dated 共用講次頁、投影片與讀本補充概念；15 起共用投影片多為 404，改以 worksheet/guide、讀本與 schedule，並明說限制。
4. Lecture 23 沒有現行 navbar page，Lecture 24 是 guest lecture 但未公布姓名；不可推測。
5. 中文與英文使用相同章節、公式、來源與材料缺口；英文系列名為 `Reading Stanford CS109`。
6. 系列的主脊按課程順序：公理與計數 → 隨機變數 → 推論 → 不確定性 → 機器學習與回顧。

## Material-fidelity 判定

- L3：Lecture 1–14，有 schedule + lecture page/slides + worksheet/answer key + LLM guide + reader；材料可支撐寫作，但目前草稿尚未逐份沿 agenda 展開。
- L2：Lecture 15–22，schedule + worksheet/guide + reader，公開投影片缺失、錄影 gated；材料可支撐有限範圍文章，且均已完成 artifact-level rewrite。
- L1：Lecture 23–28，多數只有 schedule 與零散頁面。重新盤點後不足以升 L2，**不得發布正文**；只保留 blocker notes 與非發布草稿。

L1 單元不進 `src/content/posts`。Lecture 23–28 維持 blocker notes，不可把其研究骨架算成 agenda coverage。

Batch 1（Lecture 1–5）已移除所有共用解題模板，逐題依當期 worksheet、answer key 與 LLM guide 重寫；中文正文為 3,372–3,667 字元。這五份官方 worksheet 只有 2–3 頁，刪除模板後低於一般 6,000 字元目標，因此採「短材料不灌水」例外。Lecture 6 亦已逐題重寫，中文正文 5,606 字元，完整涵蓋七題、linearity、LOTUS 與 optional challenge。Lecture 7 已依 P1–P7、DNA challenge 與 LLM guide 六個概念重寫；官方 worksheet／guide 各僅兩頁，同樣採短材料例外。P4 在 worksheet 與 answer key 皆完整，先前缺題判讀只是 PDF 跨頁文字抽取 artifact。段落雜湊掃描確認沒有沿用舊共用正文。

Lecture 8 已依 P1–P7、memorylessness challenge 與 LLM guide 六個概念重寫，涵蓋 PDF/CDF、Uniform、Exponential 與 minimum。P3 是 pset3 題，官方 answer key 刻意不刊解答；文章只依公開題目推導。Worksheet／guide 各兩頁，因此採短材料例外，不用通用段落補長度。

Lecture 9 已按原始兩頁核對 P1–P7 與 challenge，沒有跨頁缺號；內容涵蓋 Normal、標準化／Φ、線性組合、binomial approximation 與 continuity correction。P5 與 challenge 是公開 answer key 刻意省略的 pset 題，文章只依題目推導。Worksheet／guide 各兩頁，採短材料例外。

Lecture 10 已依 P1–P6、tired-baby challenge 與 LLM guide 六個概念重寫，涵蓋 joint PMF、marginal、conditioning、independence，以及離散 hypothesis 搭配連續 likelihood 的 Bayes。P6 與 challenge 是公開 key 刻意省略的 pset4 題；challenge prior 為 `3/4`，文字抽取的 `34` 是分數 artifact。Worksheet／guide 各兩頁，採短材料例外。

Lecture 11 已按原始兩頁核對 P1–P6 與 due-date challenge，涵蓋 belief dictionary、Bayes update loop、normalization、多次 observations、continuous discretization 與 indicator／PMF likelihood。P6 是公開 key 刻意省略的 pset4 題，文章只依 prompt 建立 mutation-clock likelihood 與 posterior。Worksheet／guide 各兩頁，採短材料例外。

Lecture 12 已依正式 P1–P6、rare-evidence challenge 與 LLM guide 六個概念重寫，涵蓋 Bayesian-network factorization、conditional independence、ancestral／rejection sampling 與 MCMC。官方 worksheet PDF 另夾一頁沒有講次標頭、題號、answer-key／guide 對應的 1-D Tracking；文章以 orphan supplemental artifact 獨立涵蓋，不誤編為 P7。P6 為公開 key 省略的 pset4 題。正式 worksheet／guide 各兩頁，採短材料例外。

Lecture 13 已依 P1–P6、Multinomial-to-Binomial challenge 與 LLM guide 六個概念重寫，涵蓋 multinomial coefficient／PMF、適用假設、marginal Binomial、bag of words、Bayes authorship 與 log probabilities。Guide 的第三頁只有延續收尾文字與頁碼，沒有額外 concept。Worksheet／answer key 各兩頁，採短材料例外。

Lecture 14 已依 P1–P7、two-Beta-facts challenge 與 LLM guide 六個概念重寫，涵蓋 Beta posterior／moments、conjugacy、Laplace smoothing、CDF decision 與 Thompson sampling。P6、P7 是公開 answer key 省略的 pset4 題，文章只依 worksheet／guide 推導。Guide 第三頁僅延續 wrap-up 與結語；主要材料各兩頁，採短材料例外。

Lecture 15 是首篇 L2 rewrite，已依 P1–P7、sum-of-Betas challenge 與 LLM guide 六個概念完成 IID、convolution、closed-form sums、Normal difference、CLT 與 continuity correction。P7、challenge 是公開 key 省略的 pset5 題，只依 prompt 推導；當期投影片 unavailable、錄影 gated，文章明示不重建。Worksheet／answer key 各兩頁，guide 第三頁僅延續收尾，採短材料例外。

Lecture 16 已依三頁 P1–P6、Bayesian-vs-bootstrap challenge 與 LLM guide 六個概念重寫，涵蓋 sample variance／SE、bootstrap resampling、median uncertainty、failure modes、null hypothesis／p-values 與 estimator uncertainty。三份 artifacts 題號一致且無 orphan page；當期投影片 unavailable、錄影 gated，維持 L2 邊界與短材料例外。

Lecture 17 已依三頁 P1–P7、llama-flu challenge 與 LLM guide 六個概念重寫，涵蓋 conditional／total expectation、runtime、recursive equations、indicators、hash collisions 與 coupon collector。P4、challenge 是公開 key 省略的 pset5 code 題，只依 prompt 推導；當期投影片 unavailable、錄影 gated，維持 L2 與短材料邊界。

Lecture 18 已依正式 P1–P5 與 LLM guide 六個概念重寫，涵蓋 surprise、entropy、information gain、entropy code、KL／cross-entropy 與 distribution comparisons。Worksheet／key 只有 P1–P5，沒有 P6／challenge；P5 是公開 key 省略的 pset5 題。文章保留此 agenda 差異，當期投影片 unavailable、錄影 gated，維持 L2 與短材料邊界。

Lecture 19 已依三頁正式 P1–P6、Negative-Binomial challenge 與 LLM guide 六個概念重寫，涵蓋 parametric models、likelihood／log-likelihood、Geometric／Exponential／Rayleigh MLE、boundary maximum、gradient ascent 與 Bayesian comparison。P5 與 challenge 是公開 key 省略的 pset6 題，只依 prompt 推導；guide 第三頁只延續 Concept 6 與 wrap-up。當期投影片 unavailable、錄影 gated，維持 L2 與短材料邊界。

Lecture 20 已依三頁 P1–P6、Gaussian-prior MAP challenge 與 LLM guide 六個概念重寫，涵蓋 sigmoid、decision boundary、Bernoulli log-likelihood、gradient derivation／ascent、interaction features 與 L2 regularization。四頁 key 只有 P5 pset7 code 題省略，challenge 有完整解答；guide 無額外 concept。當期投影片 unavailable、錄影 gated，維持 L2 與短材料邊界。

Lecture 21 已依四頁 P1–P8、Platt recalibration challenge 與 guide 六個概念重寫，涵蓋 Naive Bayes、train/test、calibration、precision／recall、fairness 與 decision-tree entropy。五頁 key 只省略 P8 pset7 題，challenge 完整；維持 L2 與短材料邊界。

Lecture 22 已依四頁 P1–P7、multi-class challenge 與 guide 六個概念重寫，涵蓋 softmax、parameter counting、forward pass、output／hidden backpropagation、deep-learning MLE 與 categorical likelihood。五頁 key 沒有省略題；維持 L2 與短材料邊界。

## 預計檔名與順序

檔名採 `2026-08-22-stanford-cs109-lecture-NN-<topic>{,-en}.md`；Lecture N 的閱讀順序是 N+1。完整 slug、日期、來源等級與材料狀態見 SOURCES manifest。

## 驗收

- Fidelity rewrite 完成數：**22 / 28**；可發布數為 **22 / 28**。Lecture 23–28 維持 L1 blocker，沒有發布檔。
- `pnpm check:references`、`pnpm check:series-order`、`pnpm check:lang-parity` 通過。
- 中文逐檔通過 `pnpm check:tw`；targeted lint/astro check 無新增錯誤。
- 不修改既有總覽、registry、glossary、治理檔或 progress。
