# deepBench：skill/MCP 惡意偵測器偵測力評測精讀報告

日期：2026-10-22。標記：【自述】作者自己說的；【第三方】非作者的來源；【推論】我的推論。引文為英文原文。

## 0. 先講最重要的三件事

1. **arXiv 2610.03448 不是 skill/MCP 掃描器的評測。** 它評的是 15 個 prompt-injection 文字分類器（Prompt Guard 2、PIGuard 等）加 2 個 LLM judge，資料是 AgentDojo、τ-bench、BIPIA 的 tool output。沒有 Cisco skill-scanner、沒有 skill 資料集。它只能當「benchmark 分數不能類推到部署」的類比證據，不能當「skill 掃描器偵測力」的證據。
2. **「MalSkillBench」與「MaliciousSkillBench」是兩個不同資料集，名字只差 "icious"。**
   - MalSkillBench（Adversa 用的）= arXiv 2606.07131，Guo 等（NTU、四川大學、南開、DIGIDATIONS），GitHub `lxyeternal/MalSkillBench`。
   - MaliciousSkillBench（Cisco 用的）= arXiv 2608.19901，Wang、Liu、Deng、Zhang、Li、Chen、Zhang（南京大學、Griffith、NTU、Wake Forest、UNSW），HF `ProtectSkills/MaliciousSkillBench`。
   - 兩者**不同團隊**，但**有包含關係**：MaliciousSkillBench 把 MalSkillBench 當 13 個來源中的 SRC001 併入。
3. **Cisco 自己的數字與獨立數字「結論同向、數值衝突」。** 同一個 source-disjoint split（839 惡意／545 良性），Cisco 自述規則 only HIGH+ recall 7.7%／FPR 4.0%；2608.19901 獨立跑 Cisco 得 2.5%／1.1%（recall 95% CI [1.5, 3.6]，不含 7.7%）。兩邊都說靜態規則抓不到多少，但具體數字不能互相引用。

## 1. 來源表與讀取紀錄

| # | 來源 | 取得方式（成功） | 字元數 | 讀取程度 |
|---|---|---|---|---|
| A | arXiv 2606.07131v3 HTML（MalSkillBench） | Groundlane web_fetch extract:full，輸出被截在 100,000 字元（`truncated:true`）；尾段用 mcp__cloudflare__get_url_markdown 補（128,539 字元） | 100,000＋128,539 | 正文全讀：python3 -I 依序讀 [0,25000) [25000,50000) [50000,78000) [78000,100000)，涵蓋摘要至 §8 Open Source 與參考文獻開頭。Cloudflare 版 [98,000,128,539) 的尾段只讀開頭並對關鍵字（Limitation、Appendix、Acknowledg、conflict、ethic）搜尋，尾段是參考文獻與頁尾，無附錄。**圖 3、4、6、7、8 是圖片，圖內數字讀不到**，只能用內文引述的數字。 |
| B | arXiv 2610.03448v1 HTML | Groundlane web_fetch extract:full，80,918 字元，`truncated:false` | 80,918 | 全讀：[1,500,28,000) [28,000,54,000) [54,000,60,500) [60,500,63,918) 與最後 17,000（含附錄 A–E）。頭 1,500 字元（目錄）只瞄過。圖 1–5 為圖片未讀。 |
| C | Cisco `measured-results.md`（本機唯讀） | python3 -I 直接讀 | 66,551 | 全讀：[0,22000) [22000,44000) [44000,66551)。 |
| D | arXiv 2608.19901v1（Cisco 用的 MaliciousSkillBench 論文） | Groundlane（截 100,000，只用於關鍵字）；cloudflare get_url_markdown 全文 219,326 字元 | 219,326 | **部分讀**：[23,000,70,500)（摘要至結論、含 Table 1–3）、附錄 A.1 表、附錄 J 全部 [180,700,196,500)，並對 SRC001／MalSkillBench 全文關鍵字搜尋。附錄 B–I、K、L 沒逐段讀（約 70% 的字元未直接讀）。 |
| E | HF 資料集卡 ProtectSkills/MaliciousSkillBench | Groundlane web_fetch | 卡片全文 | 全讀資料集卡（不含 parquet 內容）。 |
| F | GitHub lxyeternal/MalSkillBench README | Groundlane web_fetch | 全文 | 全讀 README，沒進 repo 的檔案。 |
| G | Adversa 部落格（2026-07-30） | 先前工作已存 `scratchpad/src/adversa.md`（70,161 字元，前次全讀）；本次只重讀所有 MalSkillBench 相關段落與附錄 Corpora | 70,161 | 本次為針對性重讀。 |
| H | 先前研究 gapB-bypass-research.md、layer2-skill-scanners.md | 本機 | – | 針對 MalSkillBench／Adversa／Cisco 段落。 |

**讀不到或失敗的**

| 工具＋網址 | 結果 |
|---|---|
| 終端機 `curl https://arxiv.org/html/2606.07131v3` | 403，proxy 回報 arxiv.org:443 connect_rejected（網域不在白名單），改走 MCP 工具 |
| Groundlane web_fetch `arxiv.org/html/2606.07131v3` selector `section.ltx_appendix` | DEADLINE_EXCEEDED（stage browser-content），改用 cloudflare 補尾段 |
| Groundlane web_search | 只有 you、brave 兩個 provider 成功，tavily／exa／brave 部分時候不可用，搜尋覆蓋面有限 |
| linkup-fetch、jina extract_pdf | 沒用到（Groundlane 與 cloudflare 已取得全文），不是失敗 |
| HF Space `Vineethsain/skill-scanner-vs-skillspector` | 這次沒再試（先前研究記錄只取回頁面外殼）。Cisco 逐 corpus 全表因此仍無法核對。 |

## 2. 兩個「Bench」到底是什麼關係

| 項目 | MalSkillBench（Adversa 用） | MaliciousSkillBench（Cisco 用） |
|---|---|---|
| arXiv | 2606.07131（v1 2026-06-05、v3 06-19） | 2608.19901（v1 2026-08-20） |
| 作者與單位 | Wenbo Guo、Wei Zeng、Chengwei Liu、Xiaojun Jia、Yijia Xu、Lei Tang（DIGIDATIONS PTE. LTD., Singapore）、Yong Fang、Yang Liu；NTU、四川大學、南開 | Yue Wang、Yi Liu、Gelei Deng、Ying Zhang、Yuekang Li、Zhenyu Chen、Leo Zhang；南京大學、Griffith、NTU、Wake Forest、UNSW |
| 發布處 | GitHub `lxyeternal/MalSkillBench`，授權「For academic research use only.」 | HF `ProtectSkills/MaliciousSkillBench`（CC BY 4.0，僅涵蓋標註與 metadata；第三方 skill 保留原授權）、GitHub `protectskills/MaliciousSkillBench` |
| 規模 | 3,944 惡意＋4,000 良性 | 9,740（7,505 惡意＋2,235 良性），13 個公開來源、11 個貢獻 Core 惡意 |
| 性質 | 自建：生成＋野外＋工具測試樣本 | **整合式**：把既有資料集重新去重、去衝突、重切 |

證據（2608.19901 Table 1）：「MalSkillBench | Core raw 3,944 | Norm. 3,430 | Main benign 0 | mixed/unresolved」；附錄 A Table 4：「SRC001 | MalSkillBench | Reported 7,944 | Acquired 7,944 | Core M 3,944 | Main B – | Core malicious; source benign labels retained outside Main」，上游授權「academic-research-only | adapter only」。

重點含意：
- 2608.19901 **收進 MalSkillBench 全部 3,944 筆惡意**，但**沒收它的 4,000 良性**（降為弱負樣本，留在 Main 之外）。
- 2608.19901 獨立發現這 3,944 筆裡有 514 筆是 exact duplicate（去重後 3,430；附錄 C 另寫 3,426 primary identities）。【第三方】
- 2608.19901 附錄 E：MalSkillBench 的 108 格標註在公開 release 只有 1,466 筆能由路徑後綴復原 vector／behavior，1,960 筆「have no trustworthy row-level taxonomy in the pinned release」。【第三方】
- 兩篇論文在內文互相引用（2608.19901 把 2606.07131 列為來源與參考文獻 [Guo et al., 2026]）；2606.07131 發表較早，不可能引用後者。**作者群無重疊**（我比對兩份作者名單，無相同姓名）。
- Cisco 的 source-disjoint test split 的 held-out 來源是 SRC009、SRC011、SRC012（HF 卡：「held-out sources are SRC009, SRC011, and SRC012」）。由 Table 4／附錄 K／J.3 與 HF 資料列對應：SRC009＝SkillHarm、SRC011＝ATR Skill Security、SRC012＝SkillFortifyBench 衍生。**SRC001（MalSkillBench）不在 test，全在 train／validation。**【推論，依 split 定義＋來源對應】
- Cisco 規則包「tuned against MaliciousSkillBench」的 development partition（train/validation）因此**包含完整的 MalSkillBench 惡意集**。【推論】

Adversa 用的是 `lxyeternal/MalSkillBench`（原文：「MalSkillBench, `lxyeternal/MalSkillBench`. 3,797 malicious and 4,000 benign real registry skills」）。Adversa 的 3,797 與論文 3,944 差 147 筆，原因不明。【第三方，我無法解釋】

## 3. 「were tuned against MaliciousSkillBench during development」的意義

Cisco 原文（measured-results.md「How to read these numbers」）：

> "A result on MaliciousSkillBench's source-disjoint split says nothing about OpenSkillRisk. The rule packs were tuned against MaliciousSkillBench during development, so figures on its development partition are home ground; the source-disjoint split is the one that carries weight."

【自述，Cisco】可確認的內容：
- 規則與 LLM prompt 的調整使用了 train/validation（文件另有 6,594 套件、600 惡意／1,338 良性、1,653 惡意等不同子集，沒說明差別）與 2,000 筆真實 skill。
- Cisco 自己量到「主場」落差：

| 設定（Cisco 自述） | development（train/val） | held-out（source-disjoint） |
|---|---|---|
| 規則 only，MEDIUM+，recall／FPR | 31.45%／1.05%（final 規則樹） | 7.99%／4.22% |
| judge 新 prompt，MEDIUM+，recall／FPR | 88.8%／23.6% | 65.8%／12.5% |
| rules＋judge `balanced`，recall／FPR | 90.5%／24.6% | 66.7%／15.4% |

- 文件自承兩次違規用了 frozen test：「Two earlier steps used the test split in ways its terms forbid: the cascade threshold above was selected on half of it, and the `curl ... | python -m json.tool` finding ... was first seen in its false positives.」後者「its test-split improvement is not an unbiased estimate」。
- `msb-balanced-800` 與 test 重疊 137 筆，不是 held-out。
- 文件還說「The MSB-only view would have justified a change that is unusable in production」（INFO 門檻 F1 81.4→83.2，但真實 skill 會 88.2% 被標），即在標註資料集上看起來好的改動，在真實母體上不可用。

我的推論【推論】：
- 「tuned」= 把標註資料集的一部分當調參與提示詞開發集，held-out 數字才算泛化；development 數字只能當 sanity check。
- Cisco 的 held-out 數字本身仍有汙染風險（上述兩次違規；分數是 Cisco 作者自己跑）。
- 2606.07131 評的 Cisco 版本是「benchmark freeze 時的最新公開版」（內文 §4.2；參考文獻存取日 2026-04-04），早於 Cisco 針對 MaliciousSkillBench 的調參（fixtures 日期 2026-09-02）。所以 2606.07131 的 Cisco 數字大概不受 tuning 汙染，但也**不代表現行版**（Cisco 文件顯示規則樹之後 FPR 減半）。信心中等，版本號論文沒寫。

## 4. (a) 資料集怎麼建

### 4.1 MalSkillBench（arXiv 2606.07131）

| 項目 | 內容（章節） |
|---|---|
| 樣本數 | 3,944 惡意＝3,214 生成＋703 野外＋27 工具測試集；4,000 良性（§3.4）。惡意比例 3,944/7,944＝49.6% |
| 分類 | 3 維：vector（CI／PI／MIXED）× 15 種行為（B1–B15）× 插入策略，共 108 格（§3.1、Table 1） |
| 生成來源 | CI 知識庫：IntelliGraph 3,026 個確認惡意的 PyPI 套件；PI 知識庫：WildJailbreak、CCS'24 jailbreak、Deepset、Gandalf，共 20,961 payload；偽裝用 3,458 個 SkillsMP 良性 skill 模板（Table 2）（§3.1.2、§3.2） |
| 生成器 | Qwen3.5-35B abliterated（移除拒答方向），temp 0、top-p 0.3、k=2（§4.1） |
| 標註／驗證 | 生成樣本：Docker 沙箱＋OpenCode＋strace／inotifywait，Layer 1 規則比對 IOC，Layer 2 LLM judge（GPT-5.4-mini），pass 條件 `m1(e) ∨ conf(e) ≥ 0.7`（§3.3 式 3）。PI 的 "triggered" 與 "detected"（agent 辨識並拒絕）**都算正**。失敗最多重生 3 次。3,757 候選→3,214 通過（85.6%）（Table 4） |
| 野外樣本 | ClawHub 來自 50 個帳號；種子取自公開揭露→登錄站爬取→Git 歷史復原→跨版本比對（§3.4） |
| 誰標 | 野外：兩位 Ph.D.（至少 4 年資安經驗）人工審 source、指派 (v,b,s)，「Where the two reviewers disagreed on a label, they discussed until reaching a common judgment」（§3.4）。生成：自動驗證，另抽驗 |
| 一致性 | 分層抽 300 筆（每 vector 100）由兩位獨立審，「Both reviewers agreed on all 300 cases with no disputes」。**沒有報 kappa、沒有報野外 703 筆的初始不一致率、沒有審良性** |
| 良性 | ClawHub 下載數最高的 4,000 個；「These skills have passed the platform's security screening and rank among its most downloaded, so we treat them as a high-confidence benign set」（§3.4）。沒有人工或執行驗證 |
| 野外成分 | 607/703（86.3%）靠偽造前置依賴；609/703（86.6%）是 B4 Malware Delivery；2 個帳號貢獻 569/703（81%）；247 筆（35%）加密貨幣竊取、78% 來自單一帳號；12 筆（1.7%）攻擊 agent control plane（§4.4） |

### 4.2 MaliciousSkillBench（arXiv 2608.19901，Cisco 用）

| 項目 | 內容 |
|---|---|
| 樣本數 | 9,740＝7,505 惡意＋2,235 良性（惡意占 77.0%）；8,414 raw→7,562 exact-unique→7,539 normalized-unique，4,588 個 structural family；34 個內容兩邊標籤衝突被排除（§4.3、§4.4） |
| 來源 | 13 個公開來源（11 個貢獻惡意），含 MalSkillBench、MaliciousAgentSkillsBench（157）、SkillLeakBench、Agent Skill Malware、AgentTrap、SkillTrojan、SkillHarm（879）、SkillTrustBench（2,863，Tencent Zhuque Lab 與 CUHK-Shenzhen）、ATR、SkillFortifyBench、SkillSafetyBench（Table 1） |
| 標註方法 | **不重新標註**：沿用各來源自己的標籤與證據強度，保守映射，「a record supported only as vulnerable, suspicious, dual-use, or scanner-flagged is not upgraded to malicious ground truth」。攻擊分類 11 類只涵蓋 4,983/7,505（66.4%），其餘不標 |
| 誰標 | 沿用來源作者；本論文只做去重、衝突排除與映射。LLM 只用於一個 72 對的盲審 structural-template 檢查，明言「not treated as human ground truth」 |
| 一致性 | 無人工一致性統計 |
| 良性 | Main benign 要求真實 skill artifact＋強或中等良性證據；marketplace 未標記、scanner-clean 都降級為 Auxiliary |
| 切分 | Random 6,818/974/1,948；Source-Balanced；Malicious-Structural-Disjoint；Source-Disjoint 7,513/835/1,384（test＝839 惡意＋545 良性） |

【推論】source-disjoint 的 545 良性中 455 筆來自 SRC011（ATR）（Table 3 後文：「On SRC011's 455 benign Skills」）。Cisco 的 FPR 於 held-out 主要由 ATR 良性 skill 決定，母體很窄，Cisco 文件自己也說「Source-disjoint ... 不能代表其他母體」。

## 5. (b) 評了哪些偵測器、版本、LLM 是否開啟

### 5.1 2606.07131（12 個設定）

版本說法：「All baselines are pinned to their latest public release at benchmark freeze time」（§4.2），**內文沒有給版本號**。Rule-based／static 用 bundled rules；模型型工具用公開預設模型，下列明確指定的除外。

| 設定 | 作者 | LLM |
|---|---|---|
| Skill Security Scan | huifer | 否（靜態規則） |
| SkillScan | Nathan Mitchem | 否 |
| SkillScan-Security | Kurt Payne | 否 |
| Cisco Skill Scanner (static) | Cisco AI Defense | 否 |
| Cisco Skill Scanner (LLM) | Cisco AI Defense | **開，gpt-5.4-mini** |
| AI-Infra-Guard | Tencent | **開，gpt-5.4-mini** |
| LLM Guard | Protect AI | 模型型（預設模型） |
| Panguard Skill Auditor (static) | Panguard AI | 否 |
| Snyk Agent Scan | Snyk | 否（靜態規則） |
| Sentry Skill Scanner (static) | Sentry | 否 |
| Sentry Skill Scanner (full) | Sentry | **開，claude-haiku-4-5-20251001** |
| VirusTotal | Google | 多引擎掃描 |

另外 RQ4 轉用 5 個 supply-chain 掃描器（GuardDog、MalGuard、OSSGadget、Bandit4Mal、SAP）與 6 個 PI 防禦（DataSentinel、MELON〔gpt-4o-mini〕、Attention Tracker、NeMo Guardrails、Llama Guard 3、Prompt Guard 2）。PI 防禦的輸入是 SKILL.md 加腳本串接。

【推論】Cisco LLM 與 AI-Infra-Guard 用的 gpt-5.4-mini，與資料集 Layer-2 驗證 judge 是同一個模型。論文說驗證 judge 與生成器不同，但沒討論 judge 與受測偵測器同模型的偏誤。

### 5.2 2608.19901（3 個現成掃描器，全部關 LLM）

| 設定 | 判定門檻 | LLM |
|---|---|---|
| Cisco-local-behavioral（commit `48f59347a54b93606dd1e31c41989ebfd0fcc84d`；yara-x 1.4.0 `--no-deps`，但該 commit 宣告 `yara-x>=1.10`） | HIGH/CRITICAL | 關（「without paid/cloud LLM APIs」） |
| SkillFortify-offline | MEDIUM+ | 關 |
| SkillSpector-static | native block | 關（`--no-llm`） |

輸入是**每筆 benchmark 單位的隔離 SKILL.md 單檔**，不含完整套件與執行行為（J.1）。

### 5.3 2610.03448

15 個 PI 偵測器（JasperLS、ProtectAI v1／v2／v2-small、TestSavant-L、Prompt Guard 1、PIGuard、Prompt Guard 2〔22M、86M〕、Qualifire Sentinel、Sentinel v2、Sheltron、Prismor-1.5B、Wolf Defender、Horizon-Labs）＋ 2 個 judge（Qwen2.5-7B-Instruct、Llama-3.1-8B-Instruct，NF4 4-bit）。Appendix A 給 HF 模型 ID。**沒有任何 skill 掃描器。**

## 6. (c) 具體數字與對照條件

### 6.1 2606.07131 Table 5（全 benchmark：3,944 惡意＋4,000 良性）

FPR 欄是我用 FP/4,000 算的【推論，算術】，原表沒有 FPR。

| 設定 | Acc | Prec | Rec | F1 | FP | FN | FPR（算） |
|---|---|---|---|---|---|---|---|
| Skill Security Scan | 43.9 | 28.5 | 8.7 | 13.3 | 858 | 3,602 | 21.5% |
| SkillScan | 54.5 | 70.0 | 14.5 | 24.0 | 244 | 3,374 | 6.1% |
| SkillScan-Security | 60.1 | 56.6 | 84.0 | 67.6 | 2,542 | 631 | 63.6% |
| Cisco (static) | 63.2 | 78.5 | 35.6 | 49.0 | 384 | 2,541 | 9.6% |
| Cisco (LLM, gpt-5.4-mini) | 77.9 | 71.4 | 92.7 | 80.7 | 1,465 | 287 | 36.6% |
| AI-Infra-Guard | 85.6 | 84.6 | 86.6 | 85.6 | 620 | 527 | 15.5% |
| LLM Guard | 57.2 | 59.1 | 44.6 | 50.9 | 1,215 | 2,185 | 30.4% |
| Panguard (static) | 56.7 | 76.2 | 18.6 | 29.9 | 229 | 3,211 | 5.7% |
| Snyk Agent Scan | 63.5 | 93.2 | 28.7 | 43.8 | 82 | 2,814 | 2.1% |
| Sentry (static) | 57.7 | 67.3 | 28.7 | 40.2 | 548 | 2,814 | 13.7% |
| Sentry (full, haiku-4.5) | 87.4 | 80.5 | 98.4 | 88.6 | 937 | 64 | 23.4% |
| VirusTotal | 61.0 | 99.5 | 21.6 | 35.5 | 4 | 3,093 | 0.1% |

對照條件：單一資料集，惡意樣本 81.5% 是同一生成器產出的 3,214 筆；良性是 ClawHub 熱門 4,000 筆；單次執行，沒有信賴區間。Snyk 與 Sentry static 的 FN 都是 2,814（recall 同為 28.7%），我用 precision 反算 TP 都是 1,130，兩列自洽，只是巧合。

### 6.2 2606.07131 全部 vs 野外 703 筆（recall，§4.5.3）

| 偵測器 | 全 benchmark recall | 野外 703 recall | 差 |
|---|---|---|---|
| VirusTotal | 21.6% | 87.9% | +66.3 |
| Snyk | 28.7% | 77.2% | +48.5 |
| Cisco LLM | 92.7% | 98.2% | +5.5 |
| AI-Infra-Guard | 86.6% | 74.0% | −12.6 |
| Cisco static、Sentry static | – | – | 內文只說「fall by 13 to 21 points」，確切值在圖 7（讀不到） |

Table 6（野外逐行為 recall，B1/B2/B4/B9 樣本數 18/33/609/15）：VirusTotal 16.7/9.1/99.3/6.7；Cisco LLM 77.8/72.7/100.0/100.0；Sentry full 83.3/81.8/97.0/100.0；AI-Infra-Guard 77.8/60.6/72.9/100.0。作者：「Its high aggregate recall on wild data is therefore explained by the dominance of B4, not by broad coverage.」

依 vector 的 recall（§4.5.2，CI／PI／MIXED）：Sentry full 99.8／97.6／99.8；AI-Infra-Guard 99.2／74.8／99.1；Cisco LLM 96.5／83.1／98.9；Cisco static 46.9／18.7／72.0。依行為：AI-Infra-Guard、Cisco LLM 在 B15 Content Manipulation 只有 35.8%、32.1%。策略層：Sentry static 在 Partial Injection 5.1%、Full Camouflage 8.5%；Cisco static 在三種指令混淆策略都低於 21%。

### 6.3 2606.07131 Table 7（轉用工具，同一資料集）

| 工具 | Prec | Rec | F1 | FP | FPR（算） |
|---|---|---|---|---|---|
| Bandit4Mal | 85.5 | 36.2 | 50.9 | 242 | 6.1% |
| GuardDog | 92.6 | 15.4 | 26.5 | 49 | 1.2% |
| OSSGadget | 51.7 | 97.3 | 67.5 | 3,587 | 89.7% |
| MalGuard-MLP | 99.3 | 15.1 | 26.2 | 4 | 0.1% |
| SAP-DT | 50.4 | 99.5 | 66.9 | 3,858 | 96.5% |
| DataSentinel | 49.7 | 99.7 | 66.3 | 3,979 | 99.5% |
| Llama Guard 3 | 98.8 | 12.9 | 22.8 | 6 | 0.15% |
| NeMo Guardrails | 52.1 | 96.0 | 67.5 | 3,478 | 87.0% |
| Prompt Guard 2 | 45.2 | 26.2 | 33.2 | 1,255 | 31.4% |
| MELON | 90.6 | 14.4 | 24.8 | 59 | 1.5% |
| Attention Tracker | 49.6 | 100.0 | 66.4 | 4,000 | 100% |

### 6.4 2608.19901 Cisco／其他掃描器（SKILL.md 單檔，LLM 關）

| 條件 | 偵測器 | Mal. recall | Benign FPR | Macro-F1 |
|---|---|---|---|---|
| Source-Disjoint（839／545）Table 3 | Cisco-local（HIGH+） | 2.5%（CI 1.5–3.6） | 1.1%（0.4–2.1） | 0.308 |
| 同上 | SkillFortify-offline（MEDIUM+） | 25.3%（22.4–28.3） | 49.9% | 0.349 |
| 同上 | SkillSpector-static | 0.0% | 0.55%（CI 0.0–1.3） | 0.281 |
| 同上 | word TF-IDF SVM（學習式） | 95.6% | 62.4% | 0.665 |
| 全 9,740，Table 43 | Cisco-local | 6.4% | 0.8% | 0.254 |
| 同上 | SkillFortify | 56.6% | 45.1% | 0.516 |
| 同上 | SkillSpector-static | 3.3% | 0.2% | 0.222 |
| 全 9,740，Table 45 | Cisco MEDIUM+ | 12.7% | 2.5% | 0.310 |
| 各 protocol，Table 44 | Cisco-local | Random 6.5%、Source-Bal. 6.5%、M-Struct 8.2%、Source 2.5% | 0.4／0.4／0.4／1.1% | – |

學習式偵測器：Random Macro-F1 0.882–0.932，Source-Disjoint 0.653–0.665（Table 2）。

### 6.5 Cisco 自述（measured-results.md，Cisco 2.2.0，source-disjoint 839／545）

| 設定 | recall | FPR | 其他 |
|---|---|---|---|
| 規則 only `balanced`，MEDIUM+／HIGH+ | 8.0%／7.7% | 4.2%／4.0% | 真實 skill 2,000 筆 flag 率 2.00%／1.85% |
| 規則 only 調參前，HIGH+ | 7.7% | 7.7% | precision 60.7%，調參後 74.7%，F1 14.0% |
| rules＋judge `balanced`，MEDIUM+ | 66.7% | 15.4% | judge＝Gemma 4 26B（Bedrock），真實 skill flag 11.65% |
| judge alone | 65.9% | 12.5% | F1 75.8% |
| 單次 judge Haiku 4.5／Gemma 4 | 45.8%／49.0% | 15.6%／17.6% | 三 pass 分解後 Haiku 76.6%、Gemma 56.9% |

這些數字都有明確對照條件（corpus、門檻、模型、split）；真實 skill 的 flag 率文件自己說「is a flag rate, not an error rate」。

### 6.6 2610.03448（僅供類比，非 skill）

TPR 在 1% FPR 門檻（門檻在評估用的良性集上挑，作者承認「favors the detectors」）：

| 偵測器 | BIPIA | AgentDojo AD-Matched | τ-bench TB-Matched | AD-Clean 預設門檻 FPR | τ-bench 預設 FPR |
|---|---|---|---|---|---|
| PIGuard | 95.1% | 2.1% | 52.7% | 29.5% | 11.0% |
| Prismor-1.5B | 4.0% | 72.2% | 15.2% | 6.5% | 46.2% |
| Sheltron | 57.2% | 20.1% | 95.2% | 10.6% | 4.4% |
| Horizon-Labs | 37.7% | 82.2% | 100.0% | 0.0% | 0.7% |
| Wolf Defender | 3.5% | 73.8% | 90.8% | 0.9% | 0.0% |
| Prompt Guard 2（86M） | 10.4% | 69.4% | 57.9% | 0.6% | 0.0% |
| Prompt Guard 2（22M） | 31.7% | 60.9% | 60.8% | 0.0% | 0.0% |

Kendall τ：BIPIA vs AgentDojo 0.01（p=1.00）；AgentDojo vs τ-bench 0.28（p=0.17）；BIPIA vs τ-bench 0.31（p=0.11），都不顯著；FPR 排名 AgentDojo vs τ-bench τ=0.67（p=0.001）。附錄 B：Qwen judge AD-Matched 57.4% [52.5–62.7]，PIGuard 2.1% [0.0–4.4]。

## 7. (d) 作者列的限制與利益關係

### 7.1 2606.07131
- **論文沒有 Limitations／Threats to Validity 章節。** 目錄為 Introduction、Motivation、Methodology、Empirical Study、Discussion、Related Work、Conclusion、Open Source。沒有利益衝突聲明、沒有資助聲明。
- 作者隸屬：NTU、四川大學、南開、DIGIDATIONS PTE. LTD.（Lei Tang）。**沒有作者隸屬被評的廠商**（Cisco、Tencent、Snyk、Sentry、Google、Protect AI、Meta、NVIDIA、Datadog、Microsoft 等）。DIGIDATIONS 的業務我沒查，不在被評清單內。
- 作者自建資料集再評別人，生成器、驗證器、benchmark 設計都在同一團隊；Xiaojun Jia、Yang Liu 同時是 SkillJect（被引為學術偵測器提案）的作者，但 SkillJect 沒被評。
- 論文內部不一致【推論】：
  - 摘要寫「the strongest skill-specific detector reaches 98.4% recall on code injection yet collapses on prompt-injection and agent-control attacks」，但 §4.5.1 的 98.4% 是 Sentry full 的**整體** recall，§4.5.2 說 Sentry full 在 PI 是 97.6%、CI 99.8%，沒有崩潰；真正在 PI 崩潰的是其他偵測器。
  - 摘要說野外樣本被「單一加密貨幣竊取活動」主導（86.6% 一種行為），內文 86.6% 是 B4 Malware Delivery（偽造前置依賴），加密貨幣竊取是 247 筆（35%）。
- 結構性限制（作者沒列，我從方法讀出）【推論】：
  1. 81.5% 惡意由單一生成器（abliterated Qwen3.5-35B、temp 0）與固定模板產生，容易有風格指紋；Adversa 與 2608.19901 的結果都顯示學習式分類器在換來源後崩潰。
  2. 驗證 judge（GPT-5.4-mini）與兩個受測 LLM 偵測器的後端同模型。
  3. PI 樣本把 agent 拒絕的情形也算正。
  4. 良性集只是「熱門且通過平台篩選」，未驗證；ClawHub 本身有惡意 skill 的紀錄（論文引 Snyk 76/3,984、Antiy 1,184）。
  5. 標註一致性只報 300/300，無統計量。
  6. 沒有信賴區間、沒有重複執行、沒有版本號。
- 授權：GitHub README「For academic research use only.」

### 7.2 2608.19901（§8、附錄 J.5）
- 作者自列：「Source-Disjoint measures source-conditioned generalization with provenance, construction, labeling, and class composition coupled」；Main benign 池「favors label confidence over ecological balance」；「SkillSpector is evaluated in static --no-llm mode; SkillFortify's SRC012 overlap benefits its held-out aggregate; and Cisco uses a documented local compatibility environment with a dependency-version deviation」。
- J.5：「Results should therefore not be treated as numerically interchangeable with evaluations that use full packages, runtime behavior, cloud services, or LLM-backed scanner modes.」
- HF 卡：「Source-disjoint results describe source-conditioned shift and should not be presented as universal out-of-distribution generalization.」
- 利益關係：作者之中 Yi Liu、Gelei Deng、Yuekang Li、Leo Zhang 也是其中一個來源資料集（MaliciousAgentSkillsBench 的 157 筆，「Malicious Agent Skills in the Wild」）的作者；無 COI 聲明；無被評廠商隸屬。AI 使用聲明有列。

### 7.3 2610.03448
- 自列限制（§6）：agent 環境是模擬；injection 位置與攻擊集（τ-bench 的商品名、InjecAgent）是作者自選；只測靜態攻擊，「Our detection numbers are upper bounds」；不含商用 API 偵測器、CodeIntegrity 未取得權限；只有 PIGuard 與 Horizon-Labs 公開足夠的訓練資料；verbatim overlap 是下限；judge 只是診斷，prompt 沒變動。
- 單一作者（JAIST），v1，發表 2026-10-02，距今 20 天。揭露：「The author used Claude (Anthropic), an AI assistant, under this direction to implement the experiment and analysis code, run the experiments, and draft the manuscript.」無 COI 聲明、無被評廠商隸屬。

### 7.4 Cisco 文件（利益相關）
- 由 Cisco 作者撰寫，包含與 NVIDIA SkillSpector 的同台比較（SkillSpector 只跑 4,500 筆子集，僅靜態）。文件自揭多個對自己不利的事實（judge 失敗 11.6%、un-analysed skill 通過 gate、meta-analyzer 有 wiring bug、System One 模型反向），可信度較高，但仍是自述且每筆 per-record 資料不公開（來源 corpus 禁止再散布）。

## 8. (e) 關鍵結論：能不能跨資料集類推

【自述】2606.07131：
- 「wild-only evaluation is systematically misleading, shifting individual recall by up to 66.3 points (VirusTotal)」；「A reviewer who saw only the wild numbers would rank an antivirus aggregator among the best skill detectors, the opposite of what the full benchmark shows.」
- 「This is exactly the error a measurement instrument must remove: without coverage of the whole attack space, a detector's apparent quality is an artifact of the evaluation subset.」
- 最佳設定（Sentry full）在整個 benchmark 上沒崩，但多數 LLM 型偵測器在 PI 掉 16–25 點（AI-Infra-Guard 99.2→74.8；Cisco LLM 96.5→83.1；Cisco static 46.9→18.7）。

【自述】2608.19901：
- 學習式：Random 0.932→Source-Disjoint 0.665；recall 保持 95.6%、FPR 62.4%。
- 現成掃描器：低 FPR 配極低 recall，沒有偵測器同時高 recall 低 FPR。
- 同一個偵測器對來源敏感：SkillFortify 排除 SRC012 後 Source-Disjoint Macro-F1 由 0.349 掉到 0.254。

【自述】2610.03448（PI 偵測器，類比用）：
- 「The best detector on BIPIA catches 2.1% of AgentDojo injections at 1% FPR, and a detector that catches 72.2% of AgentDojo injections catches 15.2% on τ-bench.」
- 「Detectors work on inputs whose form resembles their training inputs.」

【自述】Cisco：同一個 judge，development recall 88.8% → held-out 65.8%；規則 only 31.45% → 7.99%。標註集與真實 skill 的 flag 率也不同母體：HF 子集 MEDIUM+ 3.76%、gitskills 200k 為 2.23%，區間不重疊。

【第三方】Adversa：在 MalSkillBench 上線性 n-gram 模型 held-out F1 0.951，換不相交 corpus 後 3,748/3,975 良性被標（precision 0.087）；「It learned document style, not maliciousness」。這是 Adversa 自家實驗，屬廠商自述。

【推論】總結：四個獨立（或半獨立）來源都指出同一個結論：**偵測數字只在量測的資料母體、輸入形式、門檻、LLM 開關、版本下成立**。其中直接和 skill 偵測有關的是 2606.07131、2608.19901、Cisco 自述、Adversa；2610.03448 是平行領域的佐證。

## 9. (f) 有沒有重複驗證或後續批評

- **2606.07131 的第三方檢驗：** （1）Adversa（廠商）在同一 GitHub 資料集上跑 7 個離線靜態掃描器，並報告資料集缺陷：「Thirteen percent of the malicious set (493 entries) are empty directories, so achievable recall for any content-based scanner is capped at 0.870」以及「`_meta.json` is present on 3,878 of 4,000 benign artifacts and 0 of 3,797 malicious ones, so a directory aware scanner ... is partly reading the answer key」（Adversa 附錄 Corpora）。（2）2608.19901 的重新整合發現 514 筆 exact duplicate、標籤復原不全（見 §2）。兩者都沒有重現論文的 Table 5，只是在同一資料上獨立跑，且各自條件不同。
- **沒有找到** 對 2606.07131 的正式批評論文、對 2610.03448 的任何回應或複現（Groundlane 搜尋只找到 arXiv 頁、papers.cool、GitHub 一則自動 new-paper issue；搜尋 provider 受限，非窮盡）。2610.03448 作者提供重現程式碼（`lzwhehe/benign-instruction-bench`），我沒跑，也不得執行。
- **MalSkillBench 的 v1→v3 差異我沒比對。**
- 2610.03448 引用 Fomin（ICLR 2026）「When benchmarks lie」：leave-one-dataset-out 比 in-distribution 低，是同方向的先前工作；引用 Mozilla.ai 2025 對 PIGuard 的評價為其反例，【推論】屬被批評的對象。

## 10. (g) 與 Cisco 自家 measured-results 的對照

| 比較 | 數字 | 條件差異 | 判讀 |
|---|---|---|---|
| Cisco 自述 vs 2608.19901，同 split（839／545），規則 only，無 LLM | 自述 HIGH+ 7.7% recall／4.0% FPR（調參前 7.7%／7.7%）；獨立 2.5%（CI 1.5–3.6）／1.1% | 獨立版：SKILL.md 單檔、commit 48f59347＋yara-x 1.4.0（低於宣告的 ≥1.10）；自述版：Cisco 2.2.0、完整套件【推論，文件寫 6,594 packages】 | **數值衝突**（recall CI 上限 3.6% < 7.7%），結論同向：靜態規則在 held-out 抓不到 10%。FPR 方向也不同（獨立版較低），說明輸入形式與版本會改 FPR |
| Cisco static，2606.07131 vs Cisco 自述 | 2606.07131（3,944／4,000）recall 35.6%、precision 78.5%、FPR 9.6%；Cisco 自述 held-out 8.0%、4.2% | 不同資料集（含 3,214 筆生成、CI 多）；Cisco 自述 development 31.45% 與之接近 | 不衝突：分布不同。**可以引用的是「同一個工具在不同資料集 recall 差 4 倍」**，不能把兩者互相代換 |
| Cisco static，2606.07131 vs Adversa（同一份 GitHub 語料） | 論文 recall 35.6%／precision 78.5%／FP 384；Adversa recall 33.0%／precision 78.4%／FP 344（7,797 筆，惡意 3,797） | 判定規則不同（Adversa：≥1 個 high/critical attack-intent finding）；Cisco 版本論文未寫、Adversa 部分為「reconstruction」驗證 | **一致**（差 2–3 點），是 Cisco 數字最穩的一組獨立重現 |
| Cisco LLM 開啟 | 2606.07131：recall 92.7%、FPR 36.6%（gpt-5.4-mini）；Cisco 自述 held-out：66.7%／15.4%（Gemma 4 26B） | 不同模型、不同資料集 | 同向（LLM 讓 recall 大幅上升、FPR 升高），數值不可互換 |
| Prompt Guard 2 | 2606.07131：recall 26.2%、FPR 31.4%；Cisco 自述（22M，source-disjoint，門檻 0.5）：recall 0.0%、FPR 0.4%；2610.03448（22M／86M，agent tool output）：1% FPR 下 60.9%／69.4% | 輸入處理不同（串接整包 vs 512-token 視窗取最大），資料不同 | 同一個模型在三種條件下 recall 從 0% 到 60%+；正是「沒有對照條件的數字不能用」的例子 |
| Adversa 說「Cisco's own run over MalSkillBench ... its prompt injection rules fired on zero malicious samples and only on benign ones」 | 我找不到對應的 Cisco 公開文件 | 「Cisco's own run」指 Adversa 自己跑的 Cisco，還是 Cisco 官方？原文模糊 | 【推論】應理解為 Adversa 以 Cisco 工具跑的結果；measured-results.md 無此段，**不可寫成 Cisco 自己承認** |

## 11. 對系列文論點「這個領域沒有中立的工具評測」的證據盤點

支持（可引用）：
1. 2606.07131 §4.5.3：野外 vs 全體讓 VirusTotal 排名翻轉、recall 差 66.3 點。（資料集作者自述，無被評廠商隸屬）
2. 2608.19901 Table 2–3：同一 split 學習式 0.932→0.665；現成掃描器要嘛 FPR 近 0 recall 近 0，要嘛反之。（作者自述，無廠商隸屬）
3. Cisco 自述：development 與 held-out 差 4 倍（規則）／23 點（judge）；並自揭兩次違規用 test。（廠商自述，對自己不利，可信度較高）
4. 2610.03448：PI 偵測器排名不跨 benchmark 轉移（類比，須標明非 skill 掃描器）。

反證與保留（寫文章時須處理）：
1. **這些評測本身不是「中立」的：**2606.07131 自建資料集；Adversa 是賣同類產品的廠商（先前研究已記錄其自家 scanner 被排除於表外）；Cisco 評自己。「中立」只能說「無被評廠商隸屬的作者」，不能說「無利益」。
2. 2606.07131 的語料有被第三方指出的缺陷（空目錄 13%、`_meta.json` 洩漏、514 重複）。引用它的 Table 5 時需要附註。
3. 不同評測的條件不可互通（SKILL.md 單檔 vs 完整套件 vs 含執行；LLM 開／關；版本不同），所以「各偵測器掉多少」只能在同一篇內比。
4. 2610.03448 為單一作者、v1、20 天、非 skill 領域，不能當 skill 掃描器證據；且用 Claude 協助寫程式與稿。
5. 我沒讀到：2606.07131 圖 3–8 內數字、2608.19901 附錄 B–I／K／L（包含 Cisco 文件所稱「dataset terms 禁止在 frozen test 選門檻」與「ATR pack 禁止 source-disjoint 泛化宣稱」的條款原文；HF 卡未見這兩條，故這兩項【只有 Cisco 自述，未核實】）、Cisco 的 HF Space 全表。

## 12. 我沒辦法確認的事

- 2606.07131 評各工具的確切版本號。
- Adversa 3,797 與論文 3,944 差 147 筆的原因。
- Cisco 文件中「600 惡意／1,338 良性」「6,594 套件」「1,653 惡意」三個 development 子集的關係。
- MaliciousSkillBench 的 test split 中，ATR 良性占大宗（455/545）是否使 Cisco FPR 偏低或偏高。
