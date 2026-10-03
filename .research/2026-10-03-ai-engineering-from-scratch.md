# Research: rohitg00/ai-engineering-from-scratch 全量導讀

- 研究日：2026-10-02 ～ 2026-10-03
- 對象：github.com/rohitg00/ai-engineering-from-scratch @ `3be078b`（2026-10-02 05:37 UTC）
- 方法：**全量，不抽樣**——523 堂課的 `docs/en.md` 與主程式由 15 份審閱逐堂讀完（逐堂評分表與附 `檔案:行號` 的錯誤清單在 `2026-10-03-aies-review/G*.md`）；645 支 Python 程式全部實際執行（原始結果 `2026-10-03-aies-review/run-results-raw.tsv`）。
- 侷限：審閱由多個 AI agent 完成，評分是各組依同一份 rubric 給的主觀分數，跨組尺度不完全一致；「錯誤」中我親自回到原始碼覆核的只有少數（標 ✅ 覆核）。待查證主張（數百條）未逐條上網核對。

## 審查本身的限制（2026-10-03 自我覆核後補）

1. **錯誤清單是 AI 審閱者的判斷，大多未經人工覆核。** 用 AI 抓 AI 生成內容的錯，本身也會有誤報。我回原始碼覆核了 6 條：
   - ✅ 成立：P10 SFT/RLHF/DPO 用 `lr*randn` 更新權重；07-12 KV cache 每 token 少乘 32 個 head（16 KB 應為 512 KB）；11-13 的 semantic cache 用 SHA-256 雜湊當 embedding，換句話說就不會命中；07-02 Use It 沒有數值比對。
   - ⚠️ 成立但需加註：11-11 的 1000 倍是單句筆誤，後續計算正確。
   - ❌ 審閱者說法過頭：18-24 罰款「寫錯」→ 實為只寫了較低一級、漏掉最高級。
   - 6 條中 1 條過頭、1 條需降級，代表**其他數百條未覆核的錯誤也可能有類似比例的誤報或誇大**，引用前請回原始碼確認。
2. **評分跨組不一致。** 15 份報告由不同 agent 依同一份 rubric 給分，尺度寬嚴不同；表中「約略平均」部分取自各組自報，部分由我解析表格算出，解析時有重複計列（例如 G07 解析出 54 列但只有 31 堂），P19 的 ~2.9 精度有限。分數只適合看相對高低，不適合當絕對品質。
3. **覆蓋有小缺口。** G02 的 8 份 Julia 移植檔只看檔頭；P19 的 G10a／G10b／G10c 三份因額度中斷，逐堂表與錯誤齊全，但沒有 phase 總評章節。
4. **執行測試只看 exit code。** 沒有驗證輸出正確性；gloo 兩支失敗歸為環境問題但未證實；58/59 的 unittest 撞名疑慮未實測。
5. **比較對象只到摘要層級。** Karpathy、HF、Microsoft 課程沒有用同樣方法逐課審，比較段落不對等。

## 子問題

1. 課程內容品質：523 堂逐堂讀，講義正確性、Build It 是否真的從零、講義與程式是否一致
2. 專案健康度：commit 歷史、貢獻者、可跑性
3. 作者背景與動機
4. 社群反應
5. 與同類課程比較

## 一句話結論

**它是一份「名詞地圖 + 大量可跑的小玩具程式」，不是可以照單全收的教材。** 前段（數學、ML、DL 基礎、RL 前半、MCP 新版課）大致兌現「先手刻」的承諾；中後段（Phase 10 訓練、12、15、17、18、19 研究代理）充斥 mock、寫死的結論字串、算錯的數字與無來源的「2026 數據」。全量平均約 2.9／5。

## 1. 量化盤點（自己跑的，✅ 一手）

| 指標 | 數值 |
|---|---|
| 課程數 | 523（20 phases），講義合計 923,120 words，程式 170,154 行 |
| 宣稱語言 | Python、TypeScript、Rust、Julia |
| 實際程式檔 | `.py` 515、`.ts` 39、`.jl` 20、`.rs` 10——Rust/Julia 只出現在 Phase 0–10 少數課 |
| quiz.json | 373／523（AGENTS.md 宣稱每堂都有；Phase 06、08 全缺，07 缺 15/16，15 全缺，16 只有 2 堂） |
| outputs/（Ship It 產物） | Phase 19 有 57／85 堂沒有；Phase 00 有 7／12 堂沒有 |
| 執行結果 | 645 支 .py 中 624 支（96.7%）exit 0；其餘 21 支：9 支 CPU 訓練超過 15 分鐘、2 支依賴未列在 requirements（jax、langchain_anthropic）、2 支需下載資料（本環境 proxy 擋）、2 支 gloo 多程序在容器內連線失敗、3 支是刻意失敗的 fixture、其餘雜項 |
| **注意** | exit 0 ≠ 正確。Phase 10 的 RLHF／DPO 都能正常跑完，但權重是用隨機雜訊更新的（見下） |

## 2. 各 phase 品質（逐堂讀完，評分 1–5）

| Phase | 堂數 | 約略平均 | 一句話 |
|---|---|---|---|
| 00 Setup | 12 | 2.5 | 指令清單，多處小 bug（`set -e`、vscode 路徑） |
| 01 Math | 22 | 3.4 | **全課程最好的區段之一**：autodiff、LU/Cholesky/CG、p 值從不完全 beta/gamma 自算、FFT 都是真手刻 |
| 02 ML | 18 | 3.1 | 多為真手刻；但有資料洩漏示範（先標準化再切分）、ensemble 機率算錯 |
| 03 DL core | 13 | 3.2 | Backprop 好；Loss 課整課建立在錯誤前提上；BatchNorm 實作壞掉 |
| 04 Vision | 28 | 中等 | 前 10 課真手刻＋訓練；後段 stub 化、「2026」時事堆疊 |
| 05 NLP | 29 | ~3.2 | 前段扎實（n-gram LM 5 分）；seq2seq 是衰減加總模擬 |
| 06 Speech | 17 | 中下 | DSP 手刻誠實；07–16 約半數只是 `time.sleep`／隨機數 stub；MusicGen 授權寫錯（CC-BY-NC 寫成 MIT 並建議商用） |
| 07 Transformers | 16 | ~3.2 | attention/MHA/RoPE/spec decoding 好；KV cache 公式漏乘 head 數（差 32 倍） |
| 08 GenAI | 15 | ~3 | VAE/GAN/DDPM/flow matching 好；DDPM 用 T=40 沿用 1000 步 schedule；audio「transformer」實為 bigram 表 |
| 09 RL | 12 | 3.1 | 同一 GridWorld 上 stdlib 手刻，演算法大致正確；概念錯誤偏多 |
| 10 LLMs from scratch | 24 | 2.8 | **最大問題**：SFT／RLHF／DPO 算完梯度就丟掉，改對權重加 `lr*randn` 雜訊（✅ 覆核 `06-instruction-tuning-sft/code/main.py:157-160`、`07-rlhf/code/main.py:261-266`、`08-dpo/code/main.py:195-201`）；DeepSeek-V3 參數量算錯後編造說法圓過去 |
| 11 LLM Eng | 17 | 2.9 | MCP 課 4 分；11-11 單句 cost 寫 $3.75／百萬次請求，應為 $3,750（下一句的 $375/天 是對的，屬單點筆誤）；「semantic cache」其實是 SHA-256；TS 測試改成必過 |
| 12 Multimodal | 25 | 2.4 | 25 課無一真有 Build It 段落；「two-loss 訓練」是計數器；模型歸屬錯誤多（TMRoPE、Janus-Pro MMMU） |
| 13 Tools & Protocols | 31 | 新版 4–5／舊版弱 | 23 堂已改寫成 MCP 2026-07-28 無狀態模型，stdlib 實作＋11–51 個測試，**全課程最扎實**；01–05、19–21 是舊模板（A2A 過時、OTLP 寫錯） |
| 14 Agent Eng | 54 | ~3 | 三代模板；L34–38（workbench）扎實；**全 phase 沒有任何一堂呼叫真 LLM**，L01–30 用腳本／關鍵字規則冒充 |
| 15 Autonomous | 22 | 偏弱 | 安全治理新聞導讀＋機率模擬器，多堂模擬參數讓講義主張不成立；無 quiz |
| 16 Multi-agent | 25 | 2.8 | 16-22、16-03 好 |
| 17 Infra | 28 | 2.55 | 講義宣稱的效果，程式算出相反結果（17-15、17-18） |
| 18 Ethics/Safety | 30 | 2.4 | 18-24 罰款只寫 15M/3%（高風險義務那一級），漏掉禁止行為的 35M/7% 最高級（17-26 兩級都寫對）；CamoLeak 歸屬錯；跨課重複虛構引用 |
| 19 Capstones | 85 | ~2.9 | 「capstone」幾乎不 import 前面 phase 的程式；研究代理 track 的 critic 靠補 80 個 "x" 提高 clarity；75、87 是少數真整合 |

逐 phase 最強／最弱課、全部錯誤（附行號）、待查證清單見 `2026-10-03-aies-review/`。

## 3. 跨 phase 的系統性問題（多組獨立觀察到）

1. **講義與程式脫節**：至少數十堂「講義描述的模型／步驟／結果在程式裡不存在」，或程式算出相反結果。
2. **寫死的結論**：多處 `print("KEY FINDING: ...")` 是固定字串，不管計算結果。
3. **AI 量產痕跡**：講義留有「wait… Actually」思考殘渣（P10）、批次貼上的 Production note 引用不存在的 notebook（P08）、同一 diffusion 程式逐字重複 5 次、quiz 91% 正解是最長選項（P19 47–59）。
4. **事實與數字錯誤密度高**：每堂平均 1–3 個概念或數字錯誤；「2026 數據」大量無來源，部分疑似虛構（API 名稱、arXiv 編號 2602.12345、「NIST AI SPD」）。
5. **重新編號殘留**：Phase 08 跳 14→19、Phase 10 缺號、交叉引用指向不存在的課。
6. **作者自家專案推廣**：Phase 14 多處推 agentmemory、SkillKit、pro-workflow。

## 4. 專案健康度（✅ 一手：git log）

| 事實 | 數值 |
|---|---|
| 第一個 commit | 2026-03-18 |
| commit 數 | main 1,813；含所有分支（如 translations）時作者 1,723、github-actions bot 499 |
| 貢獻者 | 22 人，作者以外最多 13 commits |
| 單日最多 commits | 247（2026-05-26）、220（04-23）、205（04-24） |
| 月分布 | 3 月 171、4 月 725、5 月 686，之後驟降（6 月 54、7 月 21） |
| 明示 AI 共同作者 | commit trailer 有 Claude Opus 4.8／5 共 16 筆（只代表有標的） |
| GitHub | 62.7k stars、10.7k forks、23 open issues、41 open PRs（2026-10-02 頁面） |

## 5. 來源清單

| 來源 | 角色 | 讀取 |
|---|---|---|
| repo 本體（523 堂＋程式） | 一手 | ✅ 全量 |
| [作者 dev.to：How I wrote 435 AI engineering lessons](https://dev.to/rohitg00/build-it-then-use-it-how-i-wrote-435-ai-engineering-lessons-from-scratch-5d2d)（2026-05-24） | 一手作者 | ✅ 全文 |
| [Hacker News 討論 item 48219853](https://news.ycombinator.com/item?id=48219853) | 社群 | ✅ 全文 |
| [r/MachineLearning 討論](https://www.reddit.com/r/MachineLearning/comments/1ws6e9p/) | 社群 | 🔴 Reddit 人機驗證擋住，只有搜尋摘要 |
| [rohitghumare.com](https://rohitghumare.com/)、[LinkedIn](https://uk.linkedin.com/in/rohit-ghumare)、[sessionize](https://sessionize.com/rohit-ghumare) | 作者背景 | 🟡 搜尋摘要 |
| [MCP 2026-07-28 官方發布文](https://blog.modelcontextprotocol.io/posts/2026-07-28) | 官方 | ✅ 全文 |
| [AAIF：Introducing the MCPA](https://aaif.io/blog/introducing-the-mcpa-the-first-official-certification-for-the-model-context-protocol)、[CSA research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcpa-certification-governance-20260925-csa) | 官方／二手 | 🟡 搜尋摘要 |
| 比較對象：[Karpathy Zero to Hero](https://karpathy.ai/zero-to-hero.html)、[Microsoft ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners)、[HF Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) | 官方 | 🟡 搜尋摘要 |

## 6. 事實交叉表

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 作者花 18 個月寫成 | dev.to「for the next eighteen months」 | git log 首 commit 2026-03-18，發文時僅約 2 個月 | ❌ conflict（repo 可能是之後才建，但無其他證據） |
| 第一堂 transformer 課會用 `nn.MultiheadAttention` 比對手刻輸出到數值精度 | dev.to | `07/02` 的 Use It 只用隨機輸入印 shape；code/ 無 torch | ❌ conflict（✅ 覆核） |
| 四種語言 | README | 檔案統計：Rust 10、Julia 20 檔，集中在前段 | ⚠️ 名義成立，實質以 Python 為主 |
| 每堂有 quiz | AGENTS.md | 373／523 | ❌ |
| 「84% 學生用 AI、18% 覺得準備好」 | README、dev.to | 未找到原始調查 | ⚠️ unverified |
| MCP 2026-07-28 為正式規格，含 server/discover、MRTR、SEP-2577 棄用 Roots/Sampling/Logging、Tasks extension、DCR 棄用 | 官方 blog | Cloudflare、WorkOS 部落格 | ✅（Phase 13 新版課依據正確） |
| MCPA 2026-09-14 推出，五領域 16/14/26/24/20% | Linux Foundation 新聞稿（Yahoo 轉載） | CSA research note、WorkOS | ✅（摘要層級） |
| 作者：Docker Captain、CNCF Ambassador、GDE；曾任 Motia Head of DevRel，現 iii founding DevRel；Claude／AAIF／Devin Ambassador | 個人網站 | LinkedIn、dev.to 簡介 | ✅（摘要層級） |
| 課程數 435 → 503 → 523 | dev.to／YouTube（435）、作者部落格（503） | README（523） | ✅ 持續擴充中 |

## 7. 社群反應

- **HN（58 points，被 flag）**：主調是「AI 生成、冗長重複」「不信任 vibe-generated course」「應該從人寫的書學」；也有人認為不該只因用 AI 就 flag。一則專業意見：Autonomous Systems／Swarms 完全沒提 control theory。
- **dev.to、Medium、YouTube**：多為轉介紹與「像一整個學位」的正面推薦，未見逐課查證。
- **star 數 62.7k** 反映曝光與收藏，不反映內容正確性——本次全量審閱的結論與高 star 數之間落差很大。

## 8. 我的推論（與上表分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| 課程大部分由 LLM 生成、作者做結構與編排 | 單日 200+ commits、三代模板、思考殘渣、寫死結論、虛構引用、commit trailer 有 Claude | 作者可能用 AI 輔助後人工審過部分；有 trailer 的 commit 只是少數 |
| 品質與「是否被重寫過」高度相關 | Phase 13 新版（有測試、對規格）明顯優於同 phase 舊版；Phase 14 L34–38、L43–54 也較好 | 只是兩個 phase 的觀察 |
| 這份課程最大風險是「看起來能跑、其實是錯的」 | 96.7% 程式能跑，但 Phase 10 訓練、Phase 12 訓練、多處 benchmark 是假 | — |

## 9. 草稿骨架

### 核心概念
想用「先手刻、再用框架、最後產出 skill/MCP」的三段式，把 AI 工程從數學串到 agent。點子好，結構清楚，覆蓋面廣到 523 堂。

### 實際兌現程度
- 兌現：Phase 01、02、03 前段、05 前段、07 核心、08 生成模型核心、09 前段、13 新版、14 workbench mini-track。
- 沒兌現：Phase 10 的訓練（加雜訊）、12、15、17、18 大部分、19 研究代理 track；Phase 14 從未呼叫真 LLM。

### 跟替代方案的比較（摘要層級，未逐課審）
| 課程 | 定位 | 跟本課程的差別 |
|---|---|---|
| Karpathy Neural Networks: Zero to Hero | 從 backprop 手刻到 GPT、tokenizer，影片＋程式 | 範圍窄（只到 LLM），但由單一專家逐行講解，正確性與深度高；想學 Phase 3/7/10 的手刻部分，這是更可靠的選擇 |
| Microsoft ai-agents-for-beginners | 18 課，agent 入門，綁 Microsoft Agent Framework／Foundry | 有真 LLM 呼叫，但偏單一生態系 |
| Hugging Face Agents／LLM Course | 免費、有證書，smolagents／LangGraph／LlamaIndex | 框架導向，不手刻；HF 生態團隊維護 |
| 本課程 | 數學到 swarms 全包，可裝成 agent skill 當家教 | 廣度最大、免費、互動式；但正確性需自行把關 |

### 適合 / 不適合
- 適合：想要一張 2026 年 AI 工程名詞地圖的人；把 Phase 01、13（新版）、14（L34–38）當練習題的人；想研究「如何把課程包成 agent skill」的人。
- 不適合：想學正確的 SFT／RLHF／DPO 實作；需要可引用的數字、年份、法規內容；完全沒有能力自行查錯的初學者。

### 取捨總結
免費、廣、能跑、設計理念對；但錯誤密度高到每堂都需要自己查證，而且錯誤常藏在「能跑完的程式」和「看起來權威的數字」裡。建議當索引與練習素材，搭配人寫的權威教材（Karpathy、Strang、Sutton & Barto、官方規格）使用。

## 待解問題
- 各組待查證主張（數百條）未逐條上網核對；最優先：P2-3 的 Llama 3 學習率、P10 Mamba-3 arXiv 編號、P13 錯誤碼 -32020/21/22、P19 gloo 是否支援 `reduce_scatter`／`ReduceOp.AVG`。
- Reddit 討論串未讀到全文。
- 「18 個月」說法與 repo 歷史的衝突，可直接問作者。
