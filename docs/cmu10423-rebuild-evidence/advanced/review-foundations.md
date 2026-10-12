# Foundations independent semantic review

Reviewer: advanced author; did not author or edit foundations articles. Reviewed complete Chinese and English bodies, checked objective–mechanism–worked example–variation alignment, recomputed arithmetic externally, and executed the exact HW0 Python snippet. All 26 current files pass semantic review after reported corrections. This does not establish lecture-video access or a PDF visual audit.

Corrections requested and rechecked: overview hub labels and English scope cells, complete tldr sentence rather than slicing, Chinese simplified characters, model parameters/locality/codebook item terminology, and Lecture 6 prerequisite wording.

Arithmetic: review-foundations-numbers.py passed. Exact HW0 execution returned 4.5/−6/−3, 1.6000000238/.3000000119/1.125.

## order 0 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-generative-ai-overview.md`
- SHA256: `c609749d6189b7e76b5f26f493e8eda45c8b85f564a0cfa7439472f2b8743603`
- Learning target: 能選讀書路線並分清原課與本站篇數
- Mechanism evidence: 三條路線按能力/先備串接，不按模型名清單；40核心+12保留導覽與26堂分開
- Complete worked example: 診斷prefix .05、梯度−6、4patch×4值作為定位工具，沒有要求總覽冒充單堂推導
- Variation/answer alignment: 每個診斷均給答案與下一步；12hub labels已改自然語意；英scope翻譯已修
- Paragraph anchors: line 24 `先判斷自己缺哪一段`; line 32 `三條路線，各有明確起點`; line 40 `核心閱讀地圖`; line 88 `作業如何用來學，而不是隻用來打勾`; line 96 `保留導覽的用途`; line 113 `來源能支援甚麼`
- Source/identity: official course material plus primary references (15 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 0 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en.md`
- SHA256: `f60df5aab8c61674bf012e1f364e5256f1c42d05f25bf316cb2efe0f4613af78`
- Learning target: 能選讀書路線並分清原課與本站篇數
- Mechanism evidence: 三條路線按能力/先備串接，不按模型名清單；40核心+12保留導覽與26堂分開
- Complete worked example: 診斷prefix .05、梯度−6、4patch×4值作為定位工具，沒有要求總覽冒充單堂推導
- Variation/answer alignment: 每個診斷均給答案與下一步；12hub labels已改自然語意；英scope翻譯已修
- Paragraph anchors: line 24 `Diagnose your starting point`; line 32 `Three routes with concrete starting points`; line 40 `Core reading map`; line 88 `Use assignments as learning checks`; line 96 `What the retained guides do`; line 113 `What the sources establish`
- Source/identity: official course material plus primary references (15 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 1 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff.md`
- SHA256: `bafd3df38f42d0b7eb97ca292f86287ab82a9e1e2bc3ac14281f6b7089809ff5`
- Learning target: 追序列機率與跨時間梯度
- Mechanism evidence: 鏈式法則→共享state更新→Jacobian連乘；detach分清前向與梯度
- Complete worked example: 三token .05/NLL2.9957；h1=.7616 h2=.3634；梯度path .1823
- Variation/answer alignment: 第三機率.5後.1/2.3026；detach前向不變梯度切斷
- Paragraph anchors: line 24 `先走完一次生成`; line 32 `隱藏狀態是怎麼記住字首的`; line 40 `梯度沿著時間回傳`; line 48 `訓練時給正確字首，生成時給自己的輸出`; line 54 `自我檢查與答案`
- Source/identity: official course material plus primary references (17 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 1 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en.md`
- SHA256: `9abaeae06eb20f1f129b6b0112aab7ef5f79feb5a29ffb048d2aad9c8a4a0b35`
- Learning target: 追序列機率與跨時間梯度
- Mechanism evidence: 鏈式法則→共享state更新→Jacobian連乘；detach分清前向與梯度
- Complete worked example: 三token .05/NLL2.9957；h1=.7616 h2=.3634；梯度path .1823
- Variation/answer alignment: 第三機率.5後.1/2.3026；detach前向不變梯度切斷
- Paragraph anchors: line 24 `Follow one sequence all the way through`; line 32 `A hidden state summarizes the prefix`; line 40 `Gradients follow the temporal edges`; line 48 `Training prefixes and generated prefixes differ`; line 54 `Check your understanding`
- Source/identity: official course material plus primary references (17 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 2 / zh: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-hw0-autodiff.md`
- SHA256: `38931cbd2fb06f2b781cb788241d7ceef116a47562c106ca7e8a116281f65661`
- Learning target: 把手算梯度接上可跑訓練loop
- Mechanism evidence: requires_grad/backward/no_grad/清grad；batch reduction及broadcast陷阱
- Complete worked example: x2 y5 w1 b0→loss4.5 grads−6−3→1.6/.3/loss1.125；code實際執行一致
- Variation/answer alignment: 移除1/2後−12−6；retain graph與gradient accumulation分清
- Paragraph anchors: line 24 `先把目標寫清楚`; line 30 `用 autograd 核對同一件事`; line 55 `batch 改變的是哪些維度`; line 63 `從一輪變成訓練迴圈`; line 69 `變式練習與答案`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 2 / en: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-hw0-autodiff-en.md`
- SHA256: `a7ee38af14963538eb43529de68c534481593884f33ea95f6de4c3803e735552`
- Learning target: 把手算梯度接上可跑訓練loop
- Mechanism evidence: requires_grad/backward/no_grad/清grad；batch reduction及broadcast陷阱
- Complete worked example: x2 y5 w1 b0→loss4.5 grads−6−3→1.6/.3/loss1.125；code實際執行一致
- Variation/answer alignment: 移除1/2後−12−6；retain graph與gradient accumulation分清
- Paragraph anchors: line 24 `Specify the objective before writing the loop`; line 30 `Match autograd to the same calculation`; line 55 `A batch changes the reduction and the shapes`; line 63 `Turn a single step into a loop`; line 69 `Variations with answers`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 3 / zh: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention.md`
- SHA256: `223de0bbcee2174c0605b6f29876a450733b78e4f9cc6d3b7034dccaf99a9035`
- Learning target: 算QK、mask、softmax與weighted values
- Mechanism evidence: roles與[T,T]score；先mask再normalize；hidden不是vocab probability
- Complete worked example: Q1 K0,ln2,ln4 V2,4,8→1st2/2nd10/3/3rd6；錯序10/7反例
- Variation/answer alignment: V3=15僅第三變10；zero後不renormalize明確錯誤
- Paragraph anchors: line 22 `查詢、比對、取值是三個步驟`; line 28 `三個 token 的完整數值例子`; line 36 `mask 為什麼要在 softmax 之前`; line 42 `attention 輸出還不是字詞機率`; line 48 `訓練可以平行讀字首，生成仍逐步走`; line 54 `變式題與答案`
- Source/identity: official course material plus primary references (2 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 3 / en: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en.md`
- SHA256: `b1130dbe57c2f73c2f650b5e320f35599e5cb8926a4990d42a887a4eb0203052`
- Learning target: 算QK、mask、softmax與weighted values
- Mechanism evidence: roles與[T,T]score；先mask再normalize；hidden不是vocab probability
- Complete worked example: Q1 K0,ln2,ln4 V2,4,8→1st2/2nd10/3/3rd6；錯序10/7反例
- Variation/answer alignment: V3=15僅第三變10；zero後不renormalize明確錯誤
- Paragraph anchors: line 22 `Query, match, and retrieve`; line 28 `Calculate three positions completely`; line 36 `Apply masking before normalization`; line 42 `An attention output is not a token probability`; line 48 `Parallel training does not remove sequential generation`; line 54 `Variations with answers`
- Source/identity: official course material plus primary references (2 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 4 / zh: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding.md`
- SHA256: `f6f2fa1ea93f8601b31e940c3d417c3bddbd71d687e864733f15df756e08234c`
- Learning target: 區分學分布與從分布抽樣
- Mechanism evidence: CE p−onehot；greedy路徑反例；temperature與top-p先後
- Complete worked example: ln4,ln2,0→4/7,2/7,1/7；tau2=.4531,.3204,.2265；p.8保留A/B
- Variation/answer alignment: C loss ln7/梯度4/7,2/7,−6/7；tau2先做需三個
- Paragraph anchors: line 22 `訓練把正確續文變成訊號`; line 30 `greedy 選的是當下最可能`; line 36 `temperature 改變分佈的尖銳程度`; line 42 `top-p 先留下機率質量，再重新正規化`; line 50 `預訓練、微調與生成要分開觀察`; line 56 `變式題與答案`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 4 / en: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en.md`
- SHA256: `0e57de1d07b5c9f36f3275a3835ecf227b828876a2365dc82fa3c5bc338568c5`
- Learning target: 區分學分布與從分布抽樣
- Mechanism evidence: CE p−onehot；greedy路徑反例；temperature與top-p先後
- Complete worked example: ln4,ln2,0→4/7,2/7,1/7；tau2=.4531,.3204,.2265；p.8保留A/B
- Variation/answer alignment: C loss ln7/梯度4/7,2/7,−6/7；tau2先做需三個
- Paragraph anchors: line 22 `Training turns reference continuations into gradients`; line 30 `Greedy chooses the current maximum`; line 36 `Temperature controls concentration`; line 42 `Top-p retains probability mass, then renormalizes`; line 50 `Separate pretraining, fine-tuning, and generation`; line 56 `Variations with answers`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 5 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa.md`
- SHA256: `18e1f013064f836e99970d255e125960090415ddb6e2b0e40174e25fee4d8025`
- Learning target: 把RoPE/GQA/local attention放正確位置
- Mechanism evidence: 相對旋轉內積證明；queryheads不消失；local mask與context外插限制
- Complete worked example: 90° qk平移內積不變；cache48→24elements/96→48bytes
- Variation/answer alignment: B2 T5 KV1得40vs160；relative shift1,3→5,7不改代數
- Paragraph anchors: line 22 `RoPE 用旋轉讓內積帶上相對位置`; line 32 `GQA 減少 KV heads，保留 query heads`; line 40 `區域性 attention 限制的是誰能被讀到`; line 46 `預訓練與微調是訓練階段，架構是運算結構`; line 50 `變式題與答案`
- Source/identity: official course material plus primary references (14 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 5 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en.md`
- SHA256: `5806545a65cfb78a84b7ebcb5066cc412cdcf830bf1d5e945b967af6451bc04c`
- Learning target: 把RoPE/GQA/local attention放正確位置
- Mechanism evidence: 相對旋轉內積證明；queryheads不消失；local mask與context外插限制
- Complete worked example: 90° qk平移內積不變；cache48→24elements/96→48bytes
- Variation/answer alignment: B2 T5 KV1得40vs160；relative shift1,3→5,7不改代數
- Paragraph anchors: line 22 `Rotation makes a dot product depend on position difference`; line 32 `GQA reduces KV heads without removing query heads`; line 40 `Local attention restricts access`; line 46 `Architecture is distinct from the training stage`; line 50 `Variations with answers`
- Source/identity: official course material plus primary references (14 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 6 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa.md`
- SHA256: `125281af07b4fb2e4d5616fce08196acf26f6e23dfd2c6197833e99ecbf9f043`
- Learning target: 建立HW1 shape/mask/offset模式驗收
- Mechanism evidence: starter基準與NotImplemented/import錯誤分開；transpose前後語意；cache/full比對
- Complete worked example: B2T3E8 Q4/KV2→Q2,4,3,2與score2,4,3,3；KV48vs96
- Variation/answer alignment: E12Q3KV1D4→cache40；mask過但cache失敗先查offset/長度
- Paragraph anchors: line 24 `先建立基準，再改模組`; line 30 `自擬 shape ledger`; line 38 `用因果不變性抓洩漏`; line 44 `RoPE 用 offset 驗收，dropout 用模式驗收`; line 52 `變式題與答案`
- Source/identity: official course material plus primary references (10 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 6 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en.md`
- SHA256: `3c7eb659e5691f5a2db16b9c47500036a76622e66e6a4ef34ded5f7d7f1db791`
- Learning target: 建立HW1 shape/mask/offset模式驗收
- Mechanism evidence: starter基準與NotImplemented/import錯誤分開；transpose前後語意；cache/full比對
- Complete worked example: B2T3E8 Q4/KV2→Q2,4,3,2與score2,4,3,3；KV48vs96
- Variation/answer alignment: E12Q3KV1D4→cache40；mask過但cache失敗先查offset/長度
- Paragraph anchors: line 24 `Establish a baseline before changing a module`; line 30 `Build a shape ledger`; line 38 `Test causal invariance to detect leakage`; line 44 `Test position offsets and dropout modes independently`; line 52 `Variations with answers`
- Source/identity: official course material plus primary references (10 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 7 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-cnn-bert-vit.md`
- SHA256: `4fac5813440c16ca60b86e2f3f7595d008262aa919f6a14e8ccaf7dfee3aba10`
- Learning target: 追CNN與ViT輸入及任務可見性
- Mechanism evidence: 共享filter與感受野；patch線性投影；BERT雙向與autoregressive leakage
- Complete worked example: 4×4 allones2×2 stride2→14,22,46,54；4patch→[4,3]/CLS[5,3]
- Variation/answer alignment: RGB8patch2→16tokens/raw12/proj72+6/17²scores；stride1→3×3
- Paragraph anchors: line 24 `一個濾波器走完一張小圖`; line 34 `局部性與感受野是架構選擇`; line 40 `同一張圖切成 ViT tokens`; line 48 `BERT 的雙向不是拿來偷看答案`; line 54 `變式題與答案`
- Source/identity: official course material plus primary references (12 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 7 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en.md`
- SHA256: `8aa747038d908cb752cfbe0cf46a40d437dae89a3139195cb1727bfcd8c08be6`
- Learning target: 追CNN與ViT輸入及任務可見性
- Mechanism evidence: 共享filter與感受野；patch線性投影；BERT雙向與autoregressive leakage
- Complete worked example: 4×4 allones2×2 stride2→14,22,46,54；4patch→[4,3]/CLS[5,3]
- Variation/answer alignment: RGB8patch2→16tokens/raw12/proj72+6/17²scores；stride1→3×3
- Paragraph anchors: line 24 `Move one filter across an image`; line 34 `Locality and receptive fields impose useful assumptions`; line 40 `Convert the same image into ViT tokens`; line 48 `Bidirectional attention depends on the task`; line 54 `Variations with answers`
- Source/identity: official course material plus primary references (12 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 8 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-gans.md`
- SHA256: `c43cec84c1e162eae8d948273fdb9af9a1c1c0dbf9e022db408c89ae81118a5c`
- Learning target: 區分GAN兩方loss並算factorgraph normalization
- Mechanism evidence: minimax與non-saturating分開；freezeD保留input梯度；局部factor與Z分开
- Complete worked example: Dreal.8Dfake.2→LD.4463 LG1.6094；fake.6→G.5108/D1.1394；weights3,1,2,6/Z12
- Variation/answer alignment: fake.1→LD.3285/LG2.3026；factor改1→Z8/marginal.5/conditional.75
- Paragraph anchors: line 24 `判別器學分辨，生成器學改變樣本`; line 32 `輪流更新需要正確梯度路徑`; line 40 `機率圖模型：區域性分數要變成全域性機率`; line 50 `變式題與答案`
- Source/identity: official course material plus primary references (12 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 8 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-gans-en.md`
- SHA256: `4ec69e2ecbe2df9c96b29d7621785ca032b25dee4772c38f55809967de083d3a`
- Learning target: 區分GAN兩方loss並算factorgraph normalization
- Mechanism evidence: minimax與non-saturating分開；freezeD保留input梯度；局部factor與Z分开
- Complete worked example: Dreal.8Dfake.2→LD.4463 LG1.6094；fake.6→G.5108/D1.1394；weights3,1,2,6/Z12
- Variation/answer alignment: fake.1→LD.3285/LG2.3026；factor改1→Z8/marginal.5/conditional.75
- Paragraph anchors: line 24 `Two models have different objectives`; line 32 `Alternation requires the right gradient paths`; line 40 `Factor graphs convert local scores into probabilities`; line 50 `Variations with answers`
- Source/identity: official course material plus primary references (12 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 9 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-diffusion-models.md`
- SHA256: `8622ee04ae338cc3653378614bbdf3f6c9b2463abf585739fa35d53f4d61b37b`
- Learning target: 區分逐步/aggregate噪聲與訓練/生成
- Mechanism evidence: 線性高斯鏈展開→alpha_bar閉式；時間condition與noise目標；MSE對作業L1分開
- Complete worked example: x02/.8/.8 eps1−1→2.2361/1.5528；aggregateσ.6/ε−.0787；noiseMSE.25
- Variation/answer alignment: eps−1→xt1/MSE2.25；.9×.8=.72/σsqrt.28非.3
- Paragraph anchors: line 24 `前向鏈有訊號縮放，也有隨機噪聲`; line 34 `任意時間點都可以直接取樣`; line 40 `噪聲預測怎麼形成 loss`; line 48 `生成與訓練的起點不同`; line 54 `變式題與答案`
- Source/identity: official course material plus primary references (11 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 9 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-diffusion-models-en.md`
- SHA256: `dffc6773a82c1fee8d6818f63dee479d02160690797cf30a8ac55eccc7be11f6`
- Learning target: 區分逐步/aggregate噪聲與訓練/生成
- Mechanism evidence: 線性高斯鏈展開→alpha_bar閉式；時間condition與noise目標；MSE對作業L1分開
- Complete worked example: x02/.8/.8 eps1−1→2.2361/1.5528；aggregateσ.6/ε−.0787；noiseMSE.25
- Variation/answer alignment: eps−1→xt1/MSE2.25；.9×.8=.72/σsqrt.28非.3
- Paragraph anchors: line 24 `The forward chain scales signal and adds randomness`; line 34 `Sample any timestep directly`; line 40 `Predicting noise creates a supervised objective`; line 48 `Generation starts elsewhere`; line 54 `Variations with answers`
- Source/identity: official course material plus primary references (11 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 10 / zh: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling.md`
- SHA256: `130216347a63cd2ef9c99ee36604c2013bc46e922304bf5cfdf9fb4486efc166`
- Learning target: 把epsilon/x0/mu與reverse chain連起來
- Mechanism evidence: 三parameterization換算；xhat0不是xt−1；variance、權重與sampling邊界
- Complete worked example: x2=2.2 eps1→xhat02/mu2.0870；posterior coeff.4969；variance1/9 z.3→2.187
- Variation/answer alignment: eps.5→xhat02.375/mu2.2733；error.375/squared.140625
- Paragraph anchors: line 22 `先分清三種需要預測的量`; line 28 `一個例子同時計算 x₀、ε 與均值`; line 38 `訓練抽一個 t，生成反覆走全部 t`; line 44 `相同換算不代表 loss 完全等價`; line 50 `變式題與答案`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 10 / en: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling-en.md`
- SHA256: `6206bab85cce5112d9d92b0485c91acfb5f24866871de92a4827860d6108e8b9`
- Learning target: 把epsilon/x0/mu與reverse chain連起來
- Mechanism evidence: 三parameterization換算；xhat0不是xt−1；variance、權重與sampling邊界
- Complete worked example: x2=2.2 eps1→xhat02/mu2.0870；posterior coeff.4969；variance1/9 z.3→2.187
- Variation/answer alignment: eps.5→xhat02.375/mu2.2733；error.375/squared.140625
- Paragraph anchors: line 22 `Distinguish the predicted quantities`; line 28 `Calculate noise, clean data, and reverse mean together`; line 38 `Training samples a timestep; generation traverses the chain`; line 44 `Convertible predictions do not imply identical objectives`; line 50 `Variations with answers`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 11 / zh: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-09-vae.md`
- SHA256: `51f9fa00e39353120b409099bd81ef003500e351ddf25fdc2510ad793d516120`
- Learning target: 展ELBO、算KL並追reparameterization梯度
- Mechanism evidence: logp=ELBO+posteriorKL→reconstruction−priorKL；q inference與prior generation
- Complete worked example: A1/.5 B0/1 decoderN(z,1)；KL.8181/0；MC.6591vs exact.7216；KL梯度1/−1.5
- Variation/answer alignment: A改prior→recon期望1vs.125；eps2→z2/導數1/2；VQ不套Gaussian KL
- Paragraph anchors: line 24 `生成方向與推論方向不同`; line 30 `ELBO 為什麼是下界`; line 38 `兩筆資料走完一次取樣與 loss`; line 48 `隨機節點如何傳回梯度`; line 54 `後驗崩塌與離散潛在的邊界`; line 60 `變式題與答案`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 11 / en: PASS
- File: `src/content/posts/ai/2026-10-11-cmu10423-lecture-09-vae-en.md`
- SHA256: `4850b223f98b510a037e24f4ab1560ebefb4881b49012c2ee96f8ade1936b59f`
- Learning target: 展ELBO、算KL並追reparameterization梯度
- Mechanism evidence: logp=ELBO+posteriorKL→reconstruction−priorKL；q inference與prior generation
- Complete worked example: A1/.5 B0/1 decoderN(z,1)；KL.8181/0；MC.6591vs exact.7216；KL梯度1/−1.5
- Variation/answer alignment: A改prior→recon期望1vs.125；eps2→z2/導數1/2；VQ不套Gaussian KL
- Paragraph anchors: line 24 `Generation and inference point in different directions`; line 30 `Derive the bound`; line 38 `Calculate two inputs completely`; line 48 `Follow gradients through randomness`; line 54 `Interpret collapse and discrete latents carefully`; line 60 `Variations with answers`
- Source/identity: official course material plus primary references (3 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 12 / zh: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-hw2-ddpm.md`
- SHA256: `93c438ee4cf39f73b16bb41985f1e56b685856fcfaf53f289e418c2b5c766d46`
- Learning target: 把DDPM timestep與batch係數對齊
- Mechanism evidence: 環境/transforms/noise-target關係；[B]錯broadcast到W；sampling sentinel/clip
- Complete worked example: [2,1,1,2] A→2.2,−.6 B→.9,−.0282；L1=1 MSE1.5
- Variation/answer alignment: B3C2H4W5→[3,1,1,1]；noise loss0不保證逆向variance/index正確
- Paragraph anchors: line 24 `環境與資料先過一輪`; line 30 `自擬兩筆 batch 的完整加噪`; line 38 `訓練目標要對上同一份噪聲`; line 44 `逆向鏈另做邊界測試`; line 52 `訓練、評估與提交證據`; line 58 `變式題與答案`
- Source/identity: official course material plus primary references (15 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.

## order 12 / en: PASS
- File: `src/content/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en.md`
- SHA256: `5a300dd1bbd2f4e937a5384bdb773c85680a4b0c5e18d94e423eb4736c812c8f`
- Learning target: 把DDPM timestep與batch係數對齊
- Mechanism evidence: 環境/transforms/noise-target關係；[B]錯broadcast到W；sampling sentinel/clip
- Complete worked example: [2,1,1,2] A→2.2,−.6 B→.9,−.0282；L1=1 MSE1.5
- Variation/answer alignment: B3C2H4W5→[3,1,1,1]；noise loss0不保證逆向variance/index正確
- Paragraph anchors: line 24 `Validate environment and input data first`; line 30 `Calculate a two-example batch`; line 38 `Targets must use the same noise`; line 44 `Test reverse sampling separately`; line 52 `Keep training and evaluation evidence distinct`; line 58 `Variations with answers`
- Source/identity: official course material plus primary references (15 external links in reference section); original lecture/HW scope and URL/date preserved, new guides draft true. Examples expressly site-authored, unavailable oral material not claimed. Chinese/English calculations and caveats match; English prose is complete rather than a summary.
