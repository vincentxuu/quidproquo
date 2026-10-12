# 範圍卡：CS229 Spring 2026 第 11 堂（Diffusion Models）

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影，播放清單 17 支）。
- **文章角色**：概念導讀（單堂）。
- **原課堂次與 order**：影片標題 Lecture 11；`series.order: 11`。講者 Tengyu Ma（開場說 "the EM algorithms that Chris talked about last week"，並多次提到自己寫的講義）。
- **文章**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models.md`
- **讀者先備**：高斯分布（線性組合、取條件）、共變異數、期望值、KL 散度定義；上一堂的 EM／ELBO（講義 11.3）。PCA 用不到。
- **主問題**：加高斯雜訊的過程是自己設計的，反方向要怎麼參數化、損失函數怎麼從最大概似推出來？
- **讀完的能力**：
  1. 寫出並驗證 $x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\hat\epsilon_t$，解釋根號係數的由來。
  2. 解釋反向為什麼用高斯參數化（布朗運動直覺＋反向時間定理的形狀）。
  3. 從 ELBO (11.15) 經 KL 連鎖律推到 $L_{t-1}=\mathbb E_q[\lVert\tilde\mu_t-\mu_\theta\rVert^2/(2\tilde\beta_t)]$，並會算 $\tilde\mu_t$、$\tilde\beta_t$。
- **完整例子（本文自擬，已用 Python 驗算）**：一維，$\beta=(0.1,0.2,0.3)$，$x_0=1.5$，$\epsilon_1=0.5$，$\epsilon_2=-1$。
  - 逐步：$x_1=1.5811$，$x_2=0.9670$；一步到位：$1.2728-0.3058=0.9670$；雜訊變異數 $0.08+0.2=0.28=1-\bar\alpha_2$。
  - 後驗：$\tilde\beta_2=0.0714$，$\tilde\mu_2=0.6776x_0+0.3194x_2=1.3253$；$\mu_\theta=1.2$ 時損失 0.110，$1.3$ 時 0.0045。
  - 輔助：變異數 4→3.7→3.16→2.512；$\bar\alpha_T$ 表（$\beta=10^{-2}$：T=100/500/1000 → 0.366/0.0066/4.3e-5；$\beta=10^{-4}$、T=1000 → 0.905）。
- **自我檢查題與答案**：
  1. $\beta=(0.05,0.1)$、$x_0=2$ 的 $q(x_2\mid x_0)$：平均 1.849、變異數 0.145。
  2. 少一個根號的前向過程變異數不動點：$1/(2-\beta)\approx0.5$。
  3. $\hat\epsilon_t$ 之間為何不獨立、為何無妨：共用前面的 $\epsilon$；每個 $L_{t-1}$ 只用單一 $t$ 的邊際。
  4. $t=3$：$\tilde\beta_3=0.1694$，係數 0.5132（$x_0$）、0.4723（$x_3$）。
  5. 為什麼目標是 $q(x_{t-1}\mid x_t,x_0)$：沒有 $x_0$ 要用到未知的 $p_{\text{data}}$，有 $x_0$ 是封閉公式。
- **這堂停在哪**：式 (14.21)。雜訊預測化簡、$L_0$、訓練／取樣演算法在第 12 堂。
- **來源底本**：`.work/cs229-spring2026/txt/11-dqUMCzWjZSI.txt`（英文字幕，全讀）；`main_notes.txt` 第 14 章（pp.180–190）、11.3.1（p.160）、附錄 A.1（pp.266–268）。未看板書畫面；1:10:08–1:12:04 字幕無口述，KL 分解式依講義 (14.16)。
- **已知限制**：19:47 前講者板書漏根號（已在文中註明）；Anderson 年份課堂說 1985、講義 1982。
