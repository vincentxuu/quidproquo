# Stanford CS229 2026 主講義逐章導讀 manifest

- Primary source: https://cs229.stanford.edu/main_notes.pdf
- Source title: `CS229 Lecture Notes`
- Authors: Tengyu Ma and Andrew Ng
- Source date: 2026-08-18
- PDF metadata creation date: 2026-08-19
- Length: 278 PDF pages
- Editorial unit: one bilingual article pair per numbered chapter; the appendix is supporting material, not a standalone article.
- Series order: the existing course overview remains order 1; chapters 1–21 use orders 2–22.
- Scope boundary: these are chapter-by-chapter readings of the current public notes, not a reconstruction of any quarter's lecture schedule or recordings.

## Chapter plan

| Chapter | Printed pages | Part | Slug | 中文題名 | English title | Series order |
|---:|---:|---|---|---|---|---:|
| 1 | 9–20 | I Supervised learning | `linear-regression` | 線性迴歸：從 LMS 到局部加權迴歸 | Linear Regression: From LMS to Locally Weighted Regression | 2 |
| 2 | 21–29 | I Supervised learning | `classification-logistic-regression` | 分類與邏輯斯迴歸：從決策邊界到 Newton 法 | Classification and Logistic Regression: Decision Boundaries and Newton's Method | 3 |
| 3 | 30–34 | I Supervised learning | `generalized-linear-models` | 廣義線性模型：用指數族統一迴歸與分類 | Generalized Linear Models: Unifying Regression and Classification | 4 |
| 4 | 35–48 | I Supervised learning | `generative-learning-algorithms` | 生成式學習演算法：GDA、Naive Bayes 與平滑 | Generative Learning Algorithms: GDA, Naive Bayes, and Smoothing | 5 |
| 5 | 49–59 | I Supervised learning | `kernel-methods` | 核方法：不顯式展開特徵的非線性學習 | Kernel Methods: Nonlinear Learning Without Explicit Features | 6 |
| 6 | 60–78 | I Supervised learning | `support-vector-machines` | 支援向量機：間隔、對偶與 SMO | Support Vector Machines: Margins, Duality, and SMO | 7 |
| 7 | 80–113 | II Deep learning | `deep-learning` | 深度學習：模組、反向傳播與向量化 | Deep Learning: Modules, Backpropagation, and Vectorization | 8 |
| 8 | 115–136 | III Generalization and regularization | `generalization` | 泛化：偏差變異、雙降與樣本複雜度 | Generalization: Bias–Variance, Double Descent, and Sample Complexity | 9 |
| 9 | 137–145 | III Generalization and regularization | `regularization-model-selection` | 正規化與模型選擇：顯式、隱式與交叉驗證 | Regularization and Model Selection: Explicit, Implicit, and Cross-Validated | 10 |
| 10 | 147–149 | IV Unsupervised learning | `clustering-k-means` | 分群與 k-means：交替最佳化的第一個範例 | Clustering and k-Means: A First Alternating-Optimization Algorithm | 11 |
| 11 | 150–166 | IV Unsupervised learning | `em-algorithms` | EM 演算法：從高斯混合到 VAE | EM Algorithms: From Gaussian Mixtures to VAEs | 12 |
| 12 | 167–172 | IV Unsupervised learning | `principal-components-analysis` | 主成分分析：投影、重建與降維 | Principal Components Analysis: Projection, Reconstruction, and Reduction | 13 |
| 13 | 173–178 | IV Unsupervised learning | `independent-components-analysis` | 獨立成分分析：從混合訊號恢復獨立來源 | Independent Components Analysis: Recovering Independent Sources | 14 |
| 14 | 180–190 | V Generative models and Foundation Models | `diffusion-models` | 擴散模型：正向加噪、反向生成與 ELBO | Diffusion Models: Forward Noise, Reverse Generation, and the ELBO | 15 |
| 15 | 191–195 | V Generative models and Foundation Models | `foundation-models-overview` | 基礎模型概覽：線性探測、微調與 LoRA | Foundation Models Overview: Linear Probes, Fine-Tuning, and LoRA | 16 |
| 16 | 196–201 | V Generative models and Foundation Models | `representation-learning` | 表徵學習：對比學習、語意檢索與 RAG | Representation Learning: Contrastive Learning, Retrieval, and RAG | 17 |
| 17 | 202–219 | V Generative models and Foundation Models | `large-language-models` | 大型語言模型：分詞、Transformer、MoE 與 SFT | Large Language Models: Tokenization, Transformers, MoE, and SFT | 18 |
| 18 | 220–225 | V Generative models and Foundation Models | `reasoning-in-llms` | LLM 推理：思維鏈與長推理 RLVR | Reasoning in LLMs: Chain of Thought and Long-Reasoning RLVR | 19 |
| 19 | 227–243 | VI Reinforcement Learning and Control | `reinforcement-learning` | 強化學習：MDP、價值迭代與連續狀態 | Reinforcement Learning: MDPs, Value Iteration, and Continuous States | 20 |
| 20 | 244–257 | VI Reinforcement Learning and Control | `lqr-ddp-lqg` | LQR、DDP 與 LQG：從線性控制到不確定性 | LQR, DDP, and LQG: From Linear Control to Uncertainty | 21 |
| 21 | 258–265 | VI Reinforcement Learning and Control | `policy-gradient-variants` | 策略梯度及其變體：REINFORCE 與 PPO | Policy Gradient and Its Variants: REINFORCE and PPO | 22 |

## Shared article contract

- Filename: `src/content/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-NN-<slug>.md`; English adds `-en`.
- Frontmatter: `category: ai`, `type: deep-dive`, `draft: false`, localized `lang`, series name `Stanford CS229 導讀` / `Reading Stanford CS229`, exact order from the table.
- Opening: identify the exact chapter and printed page range, link the official PDF inline, and state that this is a notes chapter—not a lecture reconstruction.
- Body: motivation, central model/derivation, operational intuition, failure modes or assumptions, connection to adjacent chapters, and one concrete self-study exercise.
- Math: explain notation in prose; do not claim the post reproduces every proof.
- Sources: end with `## 參考資料` / `## References`; include the main notes and only directly relevant official or primary supporting references.
- Translation: English is a natural rewrite with identical factual scope, internal links, and series order.
- Editorial guardrail: do not import Fall 2025 lecture topics or Spring 2026 video claims unless explicitly identified as separate context and independently sourced.
