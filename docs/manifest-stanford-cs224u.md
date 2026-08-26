# Stanford CS224U 導讀系列規劃文件

## 系列基本資訊

| 欄位 | 內容 |
|------|------|
| **Series Slug** | `stanford-cs224u` |
| **Series Name** | Stanford CS224U 導讀 (Spring 2023) |
| **Canonical Offering** | Spring 2023 (Christopher Potts, Kawin Ethayarajh, Sidd Karamcheti, Mina Lee, Siyan Li, Xiang "Lisa" Li, Tolúlope Ògúnremí, Tianyi Zhang) |
| **Course URL** | https://web.stanford.edu/class/cs224u/ |
| **GitHub Repo** | https://github.com/cgpotts/cs224u |
| **Fidelity Assessment** | **L3 (High)** — 完整投影片、筆記本、作業、GitHub 公開、專案指導文件齊全 |
| **Series Type** | Historical (歷史性系列，非當期開課) |
| **Language** | zh-TW |

---

## 7 大主題束對照表

| 週次 | 日期範圍 | 主題束 | 核心講義/投影片 | 筆記本/代碼 | 作業/里程碑 | 指定閱讀 (精選) |
|------|----------|--------|-----------------|-------------|-------------|-----------------|
| **1** | Apr 3–5 | **課程導論與語境化詞向量** | [Course intro](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf)<br>[Contextual reps](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf)<br>[Diffusion objectives](https://web.stanford.edu/class/cs224u/slides/lisa-224u-diffusion.pdf)<br>[Fantastic LMs](https://web.stanford.edu/class/cs224u/slides/sidd-fantastic-lms-cs224u.pdf) | [setup.ipynb](https://github.com/cgpotts/cs224u/blob/main/setup.ipynb)<br>[vsm_03_contextualreps.ipynb](https://github.com/cgpotts/cs224u/blob/main/vsm_03_contextualreps.ipynb) | — | Levesque 2013; Manning 2015; Foundation Models §2.6; Vaswani et al. 2017; Devlin et al. 2018 (BERT); Liu et al. 2019 (RoBERTa) |
| **2** | Apr 10–17 | **檢索增強與語境內學習** | [HW2 Overview](https://web.stanford.edu/class/cs224u/slides/cs224u-hw2-overview-2023.pdf)<br>[Neural IR](https://web.stanford.edu/class/cs224u/slides/cs224u-neuralir-2023-handout.pdf)<br>[In-context learning](https://web.stanford.edu/class/cs224u/slides/cs224u-incontextlearning-2023-handout.pdf)<br>[Prompters before prompts](https://drive.google.com/file/d/1RIOAOTOOPyVLezFiIfGnYJSE8ofKuR4L/view) | [hw_openqa.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_openqa.ipynb) | **Assign/Bakeoff 1** (Sentiment) 截止 Apr 17<br>Quiz 0, Quiz 1 | Khattab & Zaharia 2020 (ColBERT); Karpukhin et al. 2020 (DPR); Lewis et al. 2020 (RAG); Brown et al. 2020 (GPT-3); Wei et al. 2022 (CoT); Khattab et al. 2022 (DSP) |
| **3** | Apr 19–26 | **先進行為評測** | [HW3 Overview](https://web.stanford.edu/class/cs224u/slides/cs224u-hw3-overview-2023.pdf)<br>[Behavioral eval](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf) | [hw_recogs.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb) | **Assign/Bakeoff 2** (Open QA) 截止 Apr 26<br>Quiz 2 | Jia & Liang 2017; Glockner et al. 2018; ANLI (Nie et al. 2020); Dynabench (Kiela et al. 2021); COGS (Kim & Linzen 2020); ReCOGS (Wu et al. 2023) |
| **4** | May 1–3 | **NLU 分析方法** | [Lit review overview](https://web.stanford.edu/class/cs224u/slides/cs224u-litreview-overview-2023.pdf)<br>[Siyan projects](https://web.stanford.edu/class/cs224u/slides/siyan-projects-cs224u.pdf)<br>[Analysis methods](https://web.stanford.edu/class/cs224u/slides/cs224u-analysis-2023-handout.pdf) | [feature_attribution.ipynb](https://github.com/cgpotts/cs224u/blob/main/feature_attribution.ipynb)<br>[iit_equality.ipynb](https://github.com/cgpotts/cs224u/blob/main/iit_equality.ipynb)<br>[evaluation_methods.ipynb](https://github.com/cgpotts/cs224u/blob/main/evaluation_methods.ipynb) | **Assign/Bakeoff 3** (ReCOGS) 截止 May 8<br>Quiz 3<br>**Literature Review** 截止 May 17 | LIME (Ribeiro et al. 2016); Probing (Tenney et al. 2019); Integrated Gradients (Sundararajan et al. 2017); Causal abstraction (Geiger et al. 2022); DAS (Geiger et al. 2023); Circuits (Cammarata et al. 2020) |
| **5** | May 8–10 | **NLP 實驗方法與指標** | [Protocol overview](https://web.stanford.edu/class/cs224u/slides/cs224u-protocol-overview-2023.pdf)<br>[NLP methods](https://web.stanford.edu/class/cs224u/slides/cs224u-methods-2023-handout.pdf) | [evaluation_metrics.ipynb](https://github.com/cgpotts/cs224u/blob/main/evaluation_metrics.ipynb)<br>[dynascoring.ipynb](https://github.com/cgpotts/cs224u/blob/main/dynascoring.ipynb)<br>[finetuning.ipynb](https://github.com/cgpotts/cs224u/blob/main/finetuning.ipynb) | **Experiment Protocol** 截止 May 29<br>Quiz 4 | Resnik & Lin 2010; Smith 2011; Dynascores (Ma et al. 2021); Santhanam et al. 2022 |
| **6** | May 15–24 | **專案開發與文獻綜述** | [Presenting research](https://web.stanford.edu/class/cs224u/slides/cs224u-presenting-2023-handout.pdf) | [projects.md](https://github.com/cgpotts/cs224u/blob/main/projects.md) | **Literature Review** 截止 May 17<br>專案導師指導 | Eisner's Advice; Shieber on reporting; Gebru et al. 2018 (Datasheets); Mitchell et al. 2019 (Model Cards) |
| **7** | May 29–31 | **研究溝通與期末發表** | [Presenting research](https://web.stanford.edu/class/cs224u/slides/cs224u-presenting-2023-handout.pdf) (重溫) | — | **Final Paper** 截止 Jun 10 | 同上 + Jeopardy! 復習 |

---

## 教材完整性檢查

| 素材類型 | 狀態 | 備註 |
|----------|------|------|
| 投影片 (PDF) | ✅ 完整 | 14 份手冊版投影片，含客座講師專題 |
| Jupyter Notebooks | ✅ 完整 | 30+ 筆記本，涵蓋教學、作業、教學輔助 |
| 作業 (hw_*.ipynb) | ✅ 完整 | 3 份 bakeoff 作業 + 專案三階段里程碑 |
| GitHub Repo | ✅ 公開 | Apache 2.0 + CC BY-SA 4.0，2.2k stars |
| 指定閱讀 | ✅ 完整 | 每週 8–15 篇核心論文，含 ACL/ArXiv 連結 |
| 專案指導 | ✅ 完整 | projects.md、Overleaf 模板、歷屆範例(限學生) |
| 錄影/播客 | ⚠️ 部分 | Podcast 頁面存在但需驗證可用性 |
| Quiz/Gradescope | ❌ 不公開 | Canvas/Gradescope 需登入，僅供參考 |

---

## 導讀系列切入點建議

1. **技術深度導向** — 逐週拆解核心技術：語境表示 → RAG/ICL → 行為評測 → 解釋性 → 實驗方法
2. **專案實作導向** — 以三次 bakeoff 為主線，串聯情感分析 → 開放域 QA → 組合泛化評測
3. **研究方法論導向** — 文獻綜述 → 實驗協定 → 最終論文，適合想學「怎麼做 NLP 研究」的讀者
4. **歷史演進導向** — 對比 2022/2021/2020 版本，看 NLU 領域如何從 BERT 走到 LLM + RAG + 評測

---

## 擴充計畫對應檔

詳細擴充規劃請見：`docs/content-plan-stanford-cs224u-expansion.md`