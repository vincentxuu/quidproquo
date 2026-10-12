# 範圍卡：CS229 Spring 2026 第 8 堂

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影）；講義為 2026 年 8 月版 main_notes。
- **原課堂次與 order**：第 8 堂（Lecture 8: Neural Networks 2 (Backprop)）；`series.order: 8`。
- **文章**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation.md`，角色為概念導讀。
- **讀者先備**：多變數鏈鎖律、矩陣乘法與轉置、第 7 堂的 MLP 模組記號（MM、σ）。
- **主問題**：損失對所有參數的梯度，為什麼能用跟一次前向同量級的成本算出來？
- **讀完的能力**：
  1. 說出 Theorem 7.4.1 的條件與結論，並對應到 forward／backward pass。
  2. 把鏈鎖律寫成「轉置 Jacobian 乘 ∂J/∂u」，說明為何只需要 g 與 z。
  3. 推導並使用三個 backward 函數：Wᵀv、vzᵀ（與 bias 的 v）、σ′(z)⊙v。
  4. 對小型 MLP 手算全部參數梯度。
  5. 解釋 Hessian-vector product 為何可在 O(N) 算出而完整 Hessian 不行。
- **完整例子**（本文自擬，非課堂）：2-2-1 ReLU 網路、平方損失。x=(1,2)，W1=[[1,−1],[2,1]]，b1=(0,−1)，W2=[3,2]，b2=1，y=5。前向 z1=(−1,3)，a1=(0,3)，z2=7，J=2。反向 ∂J/∂z2=2，∂J/∂W2=[0,6]，∂J/∂b2=2，∂J/∂a1=(6,4)，∂J/∂z1=(0,4)，∂J/∂W1=[[0,0],[4,8]]，∂J/∂b1=(0,4)，∂J/∂x=(8,4)。NumPy 差分驗算相符；η=0.01 更新一步後 J≈0.890。
- **自我檢查題與答案**：
  1. g:R³→R² 的 backward 矩陣形狀與 (3,1) 元素 → 3×2，∂g₁/∂z₃。
  2. W=[[1,2,0],[−1,0,3]]，z=(1,1,1)，v=(2,1) → ∂J/∂z=(1,4,3)，∂J/∂W=[[2,2,2],[1,1,1]]，∂J/∂b=(2,1)。
  3. 例子改 b1=(2,−1) → J=12.5，∂J/∂W2=(5,15)，∂J/∂W1=[[15,30],[10,20]]，∂J/∂b1=(15,10)。
  4. 反向需要保留哪些前向值 → 各層 z 與 a；判準是能逐一說出每個 backward 函數的依賴。
  5. HVP 可 O(N)、完整 Hessian 不行 → 輸出有 ℓ² 個元素；需 ℓ 次 HVP。
- **來源底本**：逐字稿 `.work/cs229-spring2026/txt/08-ne2ngVAoMG8.txt`（全文讀完，未看板書畫面）；主講義 7.4 節（pp.99–111）。
- **課堂未涵蓋、依講義補的**：bias 梯度、損失函數 backward、Algorithm 3 的串接順序。7.5 向量化本堂未講，文中未寫。
