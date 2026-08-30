# 從考試到 ML/AI 的統計學導讀

Last updated: 2026-08-29

## 定位

這個系列不是只看兩年考古題猜考點，也不是完整統計系訓練。它分三層：第一層補考試用基礎統計，第二層補統計推論核心，第三層補應用統計與 ML/AI 實務。總計 53 篇中文主文，依站內雙語規則同步產出英文版，共 106 個 Markdown 檔。

## 來源分層與驗證規則

1. 官方題面：台大圖書館考古題索引與 PDF 是考題年份、科目名稱、題面文字的最高優先來源。
2. 備考站整理：grad-exam-prep 的 subject、lesson、questions、past-papers 頁只當作題型索引、練習入口與學習路線線索。
3. 標準統計教材：OpenIntro Statistics、OpenStax Introductory Statistics 與開放教材用來確認公式、定義、假設與推導。
4. ML/AI 對接來源：Stanford CS109、scikit-learn 文件與公開 ML 課程材料，用來確認統計概念如何接到模型訓練、評估、交叉驗證、regularization、A/B testing 與不確定性報告。

寫作禁區：不把 114-115 兩年題型說成完整考試範圍；不把備考站非官方詳解說成官方答案；不用單一教材的章節順序冒充統計學唯一標準；不把 ML/AI 接點硬塞成考試會考 AI。

## 規劃表

| order | 主題 | 聚焦問題 | ML/AI 接點 | 狀態 |
|---|---|---|---|---|
| 1 | 總覽：從考試到 ML/AI 的統計學 / How to Study Statistics from Exams to ML/AI | 初學者應該怎麼排統計學順序？ / How should a beginner order the study of statistics? | 統計是模型評估、實驗與不確定性的共同語言。 / Statistics is the shared language of model evaluation, experiments, and uncertainty. | 第三輪強化：已補章節級來源對照與精準練習 |
| 2 | 統計學到底在解什麼問題 / What Statistics Solves | 為什麼統計不是背公式？ / Why is statistics not just memorizing formulas? | 資料、noise、model、generalization 的入口。 / An entry point into data, noise, models, and generalization. | 第三輪強化：已補章節級來源對照與精準練習 |
| 3 | 資料型態與描述統計 / Data Types and Descriptive Statistics | 平均、變異、類別與連續資料各在描述什麼？ / What do means, variation, categorical data, and continuous data describe? | dataset summary、feature inspection、data drift。 / Dataset summaries, feature inspection, and data drift. | 第三輪強化：已補章節級來源對照與精準練習 |
| 4 | 機率基礎 / Probability Basics | 事件、條件機率、獨立與貝氏怎麼用？ / How do events, conditional probability, independence, and Bayes work? | classifier、Naive Bayes、posterior probability。 / Classifiers, Naive Bayes, and posterior probability. | 第三輪強化：已補章節級來源對照與精準練習 |
| 5 | 隨機變數：PMF、PDF、CDF / Random Variables: PMF, PDF, and CDF | 機率如何從事件變成可計算的變數？ / How does probability become a computable variable? | token sampling、score distribution、uncertainty。 / Token sampling, score distributions, and uncertainty. | 第三輪強化：已補章節級來源對照與精準練習 |
| 6 | 常見分布 / Common Distributions | Bernoulli、Binomial、Normal、Poisson 各描述什麼？ / What do Bernoulli, Binomial, Normal, and Poisson describe? | label/noise model、count model、normal approximation。 / Label models, count models, and normal approximation. | 第三輪強化：已補章節級來源對照與精準練習 |
| 7 | 期望值與變異數 / Expectation and Variance | 中心與波動怎麼算？ / How do we compute center and spread? | loss 平均、variance、bias-variance tradeoff。 / Average loss, variance, and the bias-variance tradeoff. | 第三輪強化：已補章節級來源對照與精準練習 |
| 8 | 抽樣、標準誤與 CLT / Sampling, Standard Error, and CLT | 為什麼樣本平均可以推回母體？ / Why can a sample mean say something about a population? | benchmark mean、evaluation uncertainty。 / Benchmark means and evaluation uncertainty. | 第三輪強化：已補章節級來源對照與精準練習 |
| 9 | 信賴區間 / Confidence Intervals | 估計值的不確定性怎麼表達？ / How should uncertainty around an estimate be expressed? | model metric CI、A/B testing interval。 / Model metric intervals and A/B testing intervals. | 第三輪強化：已補章節級來源對照與精準練習 |
| 10 | 假設檢定總流程 / The Hypothesis Testing Workflow | H0/H1、p 值、power 怎麼串成決策？ / How do H0/H1, p-values, and power become a decision? | 比較兩個模型是否真的有差。 / Testing whether two models are meaningfully different. | 第三輪強化：已補章節級來源對照與精準練習 |
| 11 | 兩母體比較 / Two-Sample Comparisons | 兩樣本 t、paired test、比例差何時用？ / When should two-sample, paired, or proportion tests be used? | model A/B、paired eval、win-rate comparison。 / Model A/B tests, paired evaluation, and win-rate comparison. | 第三輪強化：已補章節級來源對照與精準練習 |
| 12 | 卡方檢定 / Chi-Square Tests | 適合度與獨立性怎麼分？ / How do goodness-of-fit and independence tests differ? | 類別特徵關聯、資料偏差檢查。 / Categorical feature association and dataset-bias checks. | 第三輪強化：已補章節級來源對照與精準練習 |
| 13 | ANOVA / ANOVA | 多組平均比較為什麼不能一直做 t-test？ / Why should multiple means not be compared only by repeated t-tests? | 多版本模型比較、treatment effect。 / Multi-version model comparison and treatment effects. | 第三輪強化：已補章節級來源對照與精準練習 |
| 14 | 估計量 / Estimators | 不偏、變異數、效率、MSE 怎麼比較？ / How should unbiasedness, variance, efficiency, and MSE be compared? | parameter estimation、loss、bias vs variance。 / Parameter estimation, loss, and bias versus variance. | 第三輪強化：已補章節級來源對照與精準練習 |
| 15 | 簡單線性迴歸 / Simple Linear Regression | 一條線如何描述 X 和 Y？ / How can one line describe X and Y? | supervised learning 的最小模型。 / The smallest supervised-learning model. | 第三輪強化：已補章節級來源對照與精準練習 |
| 16 | 多元迴歸與模型解讀 / Reading Regression Output | coef、SE、t、F、R2 怎麼讀？ / How should coef, SE, t, F, and R2 be read? | feature effect、baseline model、interpretability。 / Feature effects, baseline models, and interpretability. | 第三輪強化：已補章節級來源對照與精準練習 |
| 17 | 分類模型前置：log odds 與 logistic regression / Log Odds and Logistic Regression | 線性模型怎麼接到分類？ / How does a linear model connect to classification? | classifier、cross entropy 的入口。 / An entry point into classifiers and cross entropy. | 第三輪強化：已補章節級來源對照與精準練習 |
| 18 | Joint distribution / PMF 轉換題型 / Joint Distributions and PMF Transformations | 聯合分布、邊際化、變數轉換怎麼不漏格？ / How can joint distributions, marginalization, and transformations avoid missing cells? | joint probability、latent state、probabilistic models。 / Joint probability, latent states, and probabilistic models. | 第三輪強化：已補章節級來源對照與精準練習 |
| 19 | 台大資管 114-115 考古題完整拆解 / NTU IM 114-115 Past-Paper Walkthrough | 兩年題目完整申論答案長什麼樣？ / What should complete written solutions for the two available years look like? | exam-oriented solution discipline。 / Exam-oriented solution discipline. | 第三輪強化：已補章節級來源對照與精準練習 |
| 20 | 混合題辨識與考前 14 天複習 / Mixed Problem Recognition and 14-Day Review | 看到題目如何判斷該用哪套工具？ / How do you decide which statistical tool a question needs? | model/eval 問題的統計辨識力。 / Statistical recognition for model and evaluation problems. | 第三輪強化：已補章節級來源對照與精準練習 |
| 21 | 隨機樣本與統計量 / Random Samples and Statistics | 樣本、統計量、抽樣分布的正式關係是什麼？ / What is the formal relation among samples, statistics, and sampling distributions? | dataset sample、metric as statistic。 / Dataset samples and metrics as statistics. | 第三輪強化：已補章節級來源對照與精準練習 |
| 22 | 抽樣分配深入 / Sampling Distributions Deep Dive | 樣本平均、比例、變異數的分布怎麼來？ / Where do distributions of sample means, proportions, and variances come from? | evaluation metric distribution。 / Evaluation metric distributions. | 第三輪強化：已補章節級來源對照與精準練習 |
| 23 | 點估計：bias、variance、consistency / Point Estimation: Bias, Variance, and Consistency | 好估計量的標準是什麼？ / What makes an estimator good? | estimator quality、generalization。 / Estimator quality and generalization. | 第三輪強化：已補章節級來源對照與精準練習 |
| 24 | Method of Moments / Method of Moments | 用矩條件估參數是什麼直覺？ / What is the intuition behind estimating parameters with moment conditions? | simple parameter fitting。 / Simple parameter fitting. | 第三輪強化：已補章節級來源對照與精準練習 |
| 25 | Maximum Likelihood Estimation / Maximum Likelihood Estimation | 為什麼最大化 likelihood 等於學參數？ / Why does maximizing likelihood learn parameters? | cross entropy、language model training。 / Cross entropy and language model training. | 第三輪強化：已補章節級來源對照與精準練習 |
| 26 | Fisher information 與標準誤 / Fisher Information and Standard Error | 參數不確定性如何從 likelihood 來？ / How does parameter uncertainty come from likelihood? | uncertainty of learned parameters。 / Uncertainty of learned parameters. | 第三輪強化：已補章節級來源對照與精準練習 |
| 27 | Likelihood Ratio Test / Likelihood Ratio Test | 兩個模型如何用 likelihood 比較？ / How can two models be compared with likelihood? | nested model comparison。 / Nested model comparison. | 第三輪強化：已補章節級來源對照與精準練習 |
| 28 | Neyman-Pearson 觀點 / The Neyman-Pearson View | 檢定的最適性在說什麼？ / What does optimality of a test mean? | thresholding、classifier decision boundary。 / Thresholding and classifier decision boundaries. | 第三輪強化：已補章節級來源對照與精準練習 |
| 29 | 信賴區間的一般建構 / General Confidence Interval Construction | CI 不只是 t 表，還有哪些做法？ / What methods exist beyond t-table intervals? | metric interval and uncertainty reporting。 / Metric intervals and uncertainty reporting. | 第三輪強化：已補章節級來源對照與精準練習 |
| 30 | Asymptotic normality / Asymptotic Normality | 大樣本近似為什麼常常可用？ / Why are large-sample approximations often useful? | large-scale evaluation。 / Large-scale evaluation. | 第三輪強化：已補章節級來源對照與精準練習 |
| 31 | Delta method / Delta Method | 非線性指標的不確定性怎麼估？ / How can uncertainty of nonlinear metrics be estimated? | ratio metrics、derived benchmark scores。 / Ratio metrics and derived benchmark scores. | 第三輪強化：已補章節級來源對照與精準練習 |
| 32 | Bootstrap / Bootstrap | 不知道分布時如何用重抽樣估不確定性？ / How does resampling estimate uncertainty when the distribution is unknown? | benchmark uncertainty、small eval sets。 / Benchmark uncertainty and small evaluation sets. | 第三輪強化：已補章節級來源對照與精準練習 |
| 33 | Bayesian inference 入門 / Bayesian Inference Basics | prior、likelihood、posterior 怎麼接？ / How do prior, likelihood, and posterior connect? | Bayesian modeling、uncertainty-aware AI。 / Bayesian modeling and uncertainty-aware AI. | 第三輪強化：已補章節級來源對照與精準練習 |
| 34 | MAP 與 regularization / MAP and Regularization | 正則化如何等價於先驗？ / How can regularization be read as a prior? | L2/L1 regularization、MAP training。 / L2/L1 regularization and MAP training. | 第三輪強化：已補章節級來源對照與精準練習 |
| 35 | 推論層總複習 / Inference Layer Review | 估計、檢定、likelihood、Bayes 如何互相連接？ / How do estimation, testing, likelihood, and Bayes connect? | ML objective and evaluation map。 / A map of ML objectives and evaluation. | 第三輪強化：已補章節級來源對照與精準練習 |
| 36 | 線性模型深入 / Linear Models Deep Dive | OLS 的假設、診斷與限制是什麼？ / What are the assumptions, diagnostics, and limits of OLS? | regression baseline and diagnostics。 / Regression baselines and diagnostics. | 第三輪強化：已補章節級來源對照與精準練習 |
| 37 | Logistic regression 深入 / Logistic Regression Deep Dive | 分類模型如何從 log odds 建起來？ / How is a classifier built from log odds? | binary classifier、cross entropy。 / Binary classifiers and cross entropy. | 第三輪強化：已補章節級來源對照與精準練習 |
| 38 | GLM / Generalized Linear Models GLM | 不同資料型態如何換 link function？ / How do different data types use different link functions? | structured baseline models。 / Structured baseline models. | 第三輪強化：已補章節級來源對照與精準練習 |
| 39 | Model diagnostics / Model Diagnostics | 殘差、outlier、leverage 在看什麼？ / What do residuals, outliers, and leverage reveal? | error analysis。 / Error analysis. | 第三輪強化：已補章節級來源對照與精準練習 |
| 40 | Variable selection / Variable Selection | 變數選擇如何避免過度配適？ / How can variable selection avoid overfitting? | feature selection。 / Feature selection. | 第三輪強化：已補章節級來源對照與精準練習 |
| 41 | Regularization / Regularization | Ridge、Lasso 為什麼能穩定模型？ / Why do Ridge and Lasso stabilize models? | modern ML regularization。 / Modern ML regularization. | 第三輪強化：已補章節級來源對照與精準練習 |
| 42 | Nonparametric methods / Nonparametric Methods | 不假設固定分布時怎麼做？ / What can be done without a fixed distributional assumption? | flexible modeling baseline。 / Flexible modeling baselines. | 第三輪強化：已補章節級來源對照與精準練習 |
| 43 | Experimental design / Experimental Design | 實驗怎麼設計才可解讀？ / How should experiments be designed so results are interpretable? | offline/online ML experiments。 / Offline and online ML experiments. | 第三輪強化：已補章節級來源對照與精準練習 |
| 44 | A/B testing / A/B Testing | 產品實驗如何估效果與風險？ / How do product experiments estimate effects and risk? | product ML evaluation。 / Product ML evaluation. | 第三輪強化：已補章節級來源對照與精準練習 |
| 45 | Causal inference 入門 / Causal Inference Basics | 關聯和因果如何分開？ / How can association and causation be separated? | recommender、policy evaluation。 / Recommenders and policy evaluation. | 第三輪強化：已補章節級來源對照與精準練習 |
| 46 | Matching / weighting / Matching and Weighting | 觀察資料如何模擬比較？ / How can observational data approximate comparisons? | counterfactual evaluation。 / Counterfactual evaluation. | 第三輪強化：已補章節級來源對照與精準練習 |
| 47 | Time series 入門 / Time Series Basics | 時間相依資料不能怎麼亂切？ / Why should time-dependent data not be split casually? | forecasting、monitoring。 / Forecasting and monitoring. | 第三輪強化：已補章節級來源對照與精準練習 |
| 48 | Multivariate analysis 入門 / Multivariate Analysis Basics | 多個變數一起變動如何整理？ / How can many variables moving together be summarized? | embeddings、PCA intuition。 / Embeddings and PCA intuition. | 第三輪強化：已補章節級來源對照與精準練習 |
| 49 | Missing data / Missing Data | 缺資料會帶來什麼偏誤？ / What bias can missing data introduce? | dataset bias。 / Dataset bias. | 第三輪強化：已補章節級來源對照與精準練習 |
| 50 | Simulation / Monte Carlo / Simulation and Monte Carlo | 用模擬回答統計問題 / How can simulation answer statistical questions? | agent eval、uncertainty propagation。 / Agent evaluation and uncertainty propagation. | 第三輪強化：已補章節級來源對照與精準練習 |
| 51 | Reproducible statistical workflow / Reproducible Statistical Workflow | 統計分析如何可重現？ / How can statistical analysis be reproducible? | eval pipeline、experiment tracking。 / Evaluation pipelines and experiment tracking. | 第三輪強化：已補章節級來源對照與精準練習 |
| 52 | ML/AI 評估報告怎麼寫 / Writing ML/AI Evaluation Reports | 如何把統計結果寫成可用結論？ / How can statistical results become usable conclusions? | benchmark report discipline。 / Benchmark reporting discipline. | 第三輪強化：已補章節級來源對照與精準練習 |
| 53 | 全系列地圖與下一步 / Series Map and Next Steps | 讀完 53 篇後如何繼續？ / Where should a reader go after the 53 posts? | 走向 ML、因果、數理統計或 Bayesian。 / Paths into ML, causality, mathematical statistics, or Bayesian work. | 第三輪強化：已補章節級來源對照與精準練習 |

## Series metadata

- zh-TW: 從考試到 ML/AI 的統計學導讀
- en: Statistics from Exams to ML/AI
- slug: statistics-ml-ai
