# O2 補缺口抽取紀錄

批次：O2（補缺口）　日期：2026-11-24
工具：Exa web_search／web_fetch（主力）、curl＋自寫 HTML→文字轉換（arXiv HTML，保留 MathML alttext 才讀得到數字）、pdftotext、gh api、Hugging Face API、api.fxtwitter.com。jina 未使用（額度）。
本機計算：缺口 5 下載 MMLU-Pro 修正前後兩版 test parquet 自己算捷徑命中率（腳本在 scratchpad `scripts/mmlupro_cues.py`，不是測試、不動 repo）。

---

## 缺口 1：結局 ✅（官方一手讀到；FT 原訪談為付費區，見 ✉️ 註）

### LMArena 官方聲明（X thread，2025-04-08）
- 網址：https://x.com/arena/status/1909397817434816562（帳號已更名 @arena；以 api.fxtwitter.com/lmarena_ai/status/1909397817434816562 取得全文）；備份 https://threadreaderapp.com/thread/1909397817434816562.html
- 讀取狀態：✅（全文約 900 字元，一次讀完）
- 類型：官方聲明（X 貼文）
- 文件目的：回應社群質疑 Llama 4 在 Arena 上榜版本與公開版不同
- 會被引用的結果：
  - 時間：Tue Apr 08 00:08:09 UTC 2025（Meta 4/5 發布後約兩天）
  - 承認的事：上榜的是客製版；“Meta’s interpretation of our policy did not match what we expect from model providers. Meta should have made it clearer that “Llama-4-Maverick-03-26-Experimental” was a customized model to optimize for human preference.”
  - 初步原因判讀：“Early analysis shows style and model response tone was an important factor (demonstrated in style control ranking) … (Emoji control? 🤔)”
  - 處置：公開 2,000+ 場對戰（含 prompt、回應、使用者偏好）；“we’re also adding the HF version of Llama-4-Maverick to Arena”；“we are updating our leaderboard policies to reinforce our commitment to fair, reproducible evaluations”
- 作者自己列的限制：聲明本身沒說改了哪幾條政策（只說「正在更新」）
- 與摘要說法不一致處：媒體常寫「LMArena 道歉」，原文沒有 apologize 字樣，是「Meta 的解讀不符我們的期待」＋「Meta 應該說清楚」；寫文章時不要寫成「道歉」
- 反證或後續修正：見下方政策頁與 2025-05-09 回應文
- 對系列的用途：Arena 篇「上榜的不一定是你能用的那個模型」的一手出處

### Meta 一手：Llama 4 發布文（2025-04-05）
- 網址：https://ai.meta.com/blog/llama-4-multimodal-intelligence/
- 讀取狀態：✅（Exa 全文，約 2.1 萬字元，一次讀完）
- 會被引用的結果：Takeaways 第三點 “Llama 4 Maverick offers a best-in-class performance to cost ratio with an experimental chat version scoring ELO of 1417 on LMArena.” 文字本身只寫 “experimental chat version”；媒體引用的 “optimized for conversationality” 在 Meta 的圖表裡（圖片，文字抓取讀不到，TechCrunch／The Verge 轉述）
- 與摘要說法不一致處：Meta 有寫「experimental chat version」，所以「Meta 隱瞞」不精確；精確說法是「有寫，但寫在小字，且沒說它跟可下載版不是同一個模型」

### Meta 一手回應
- Ahmad Al-Dahle（Meta VP／Head of GenAI）Threads 貼文 2025-04-07：https://www.threads.com/@aaldahle/post/DIJ5LlZP9ie（同文亦發在 X，VentureBeat 全文轉錄 https://venturebeat.com/technology/meta-defends-llama-4-release-against-reports-of-mixed-quality-blames-bugs ）
  - “We've also heard claims that we trained on test sets -- that's simply not true and we would never do that. Our best understanding is that the variable quality people are seeing is due to needing to stabilize implementations.”
  - 注意：他否認的是「用測試集訓練」，沒有回應 Arena 版本差異
- Meta 發言人 Ashley Gabriel 給 The Verge／TechCrunch／The Register 的書面聲明（媒體轉錄，非 Meta 自家頁面）：“we experiment with all types of custom variants.” “‘Llama-4-Maverick-03-26-Experimental’ is a chat optimized version we experimented with that also performs well on LMArena.” — https://www.theverge.com/meta/645012/meta-llama-4-maverick-benchmarks-gaming
- 後續（Meta 內部人事後承認）：Yann LeCun 2026-01 接受 Financial Times 訪問，說 Llama 4 “results were fudged a little bit”，團隊在不同 benchmark 用不同版本模型。✉️ FT 原文付費（Techmeme 2026-01-02 存檔標題 https://www.techmeme.com/260102/p5 ；轉述：Fast Company https://www.fastcompany.com/91469583/yann-lecun-meta-llama-4-model-zuckerberg 、Business Insider）。要引原句需有 FT 訂閱者讀原文（Melissa Heikkilä 的 LeCun 專訪，2026-01-02）。這是「不同 benchmark 用不同變體」的指控，範圍大於 Arena；LeCun 當時已離職，且未領導該團隊。

### 之後改了什麼（政策）
- 公開版排名：2025-04-11 公開版 Llama-4-Maverick-17B-128E-Instruct 上榜約第 32 名（TechCrunch https://techcrunch.com/2025/04/11/metas-vanilla-maverick-ai-model-ranks-below-rivals-on-a-popular-chat-benchmark/ ，引用社群截圖；未找到 LMArena 自己發的排名貼文，屬二手）
- Arena 現行政策頁（一手，Exa 讀全文）：https://arena.ai/blog/policy （Published 2024-03-02，Last updated 2026-09-01）。與本事件直接相關的條文：
  - 只列「generally available to the global public」的 first-party 模型（open weights／public API／public service／Arena 上的公開 early release）
  - early release 條件：“The model provider must confirm in writing that the pre-release model is identical to the model they intend to release publicly.” “If it is determined that the publicly released model differs from the pre-release version tested on Arena, Arena will remove the model from the leaderboard until the model can be re-evaluated”
  - 匿名測試的未發布模型，發布後分數標 preliminary，直到收集到足夠的發布後新票；“Model providers are allowed to test multiple variants of their models before making them public”
  - 注意：此頁是 2026-09 的版本，不能斷言哪一條是 2025-04 當下加的。2025-04 之後的確切修訂時序我沒有找到逐條 changelog（頁面說 2025-07 起有 Leaderboard Changelog）。
- LMArena 2025-05-09〈Our Response to 'The Leaderboard Illusion'〉（一手，GitHub raw）：https://raw.githubusercontent.com/lmarena/lmarena.github.io/main/_posts/2025-05-09-our-response.md — 承諾政策會明寫「可測多個變體」、標示退役模型、超過 10 個變體平行測試時分數標 provisional 直到發布後再收 2,000 票；並主張 pre-release 測試的選擇偏誤「around +11 Elo after 50 tests and 3000 votes」、會隨新票歸零。這是對 Hooker 等人 Leaderboard Illusion 的反駁，Llama 4（27 個私測變體）是該論文的案例之一。
- 對系列的用途：Arena 篇可寫「事件→官方承認的範圍（客製版沒標清楚、風格影響大）→制度補丁（書面保證同一模型、不同則下榜、preliminary 標記）」；「道歉」「作弊」等字眼要避免，用原句。

---

## 缺口 2：結局 ✅（正文找到對應；摘要「數百票」只對應最理想條件下的第一個名次）

### Improving Your Model Ranking on Chatbot Arena by Vote Rigging（Min et al., ICML 2025；arXiv 2501.17858v2）
- 網址：https://arxiv.org/html/2501.17858 （v2, 2025-08-10）；另讀 v1 比對摘要
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 9.2 萬字元（含 MathML alttext）；依序讀 1–4 節（行 60–206）、5–9 節＋影響聲明（206–541）、附錄 A–E 全部（846–1344），參考文獻略讀；圖 1 另下載 demo.png 看圖讀數
- 類型：研究論文
- 研究設計：用 Chatbot Arena Notebook 公開的約 170 萬票、129 個模型建模擬環境（90% 當歷史票），比較 target-only（只在認出目標模型的對戰投票）與 omnipresent（每一場都投，利用 BT 分數全體連動）兩類操弄；再在 25 模型、約 2.3 萬英文票的小環境做接近真實的 case study（需用 RoBERTa 分類器猜匿名模型身分）
- 會被引用的結果：
  - 摘要：“omnipresent rigging strategies can improve model rankings by rigging only hundreds of new votes”（v1、v2 摘要與引言第 80 行同句）
  - 圖 1（理想條件：目標 Phi-3-small-8k-Instruct，起始第 89 名）：讀圖，omnipresent 在約 900 票時升第 1 名、約 2,000 票升 2 名、約 8,000 票升 7 名；target-only 第一次升名在約 2,600 票；最後約 28,000 票時 omnipresent +15（89→74）。圖說：“Using the omnipresent strategy, we achieve a 15-rank improvement while being more efficient compared to the target-only strategy.” → 「數百票」對應的就是圖 1 第一個名次（<1,000 票），沒有其他實驗以數百票為條件
  - 第 4 節（理想條件，threat model 為可取得全部歷史票、知道真實模型名、已知抽樣分布、沒有其他使用者同時投票）：“when rigging 20,000 new votes, the target-only rigging achieves only an average increase of 4, whereas both omnipresent rigging strategies notably outperform it, resulting in an approximately 10-rank promotion.”
  - 附錄 C.1 表 9：最小量 5,000 票時 Omni-BT／Omni-On 平均 +5 名、target-only +0～+1；50,000 票時 +21～+22
  - 附錄 C.2 表 10：換成 Huang et al. 的 22 個模型、20,000 票，平均只升 +2.0（Omni-BT）／+2.1（Omni-On），target-only +0.8～+1.1；頂端模型幾乎不動（gpt-4o-mini 4→4、claude-3.5-sonnet 5→4）
  - 第 6.1 節 case study（接近真實：只看公開分數、匿名、抽樣未知、有其他使用者）：“Our Omni-BT and Omni-On strategies achieve an average of 5-rank and 3-rank promotion”（表 4）；正文沒寫這組用了多少票
  - 第 5 節壓力測試：一半對戰認不出身分時 Omni-On 仍 +6（表 1）；目標模型完全不被抽到（β=0）仍 +5～+6（表 2）；同時有 10 萬筆他人投票只少約 1 名（表 3）
  - 防禦（第 7 節）：重複投票偵測可消掉 T-Abstain 約 80% 的提升；依歷史勝率過濾異常票，τ=0.7 時 omnipresent 仍升 6 名以上（表 8）
  - 分類器（表 7）：25 類 Top-1 約 79%，Top-5 約 97%
- 作者自己列的限制：“our study primarily presents proof-of-concept experiments”；用模擬環境、不在真站上投票；2024-09 已先告知 Chatbot Arena
- 與摘要說法不一致處：摘要的「only hundreds of new votes」在正文沒有任何表格對應；唯一對應是圖 1 理想條件下的第一個名次（約 900 票）。主要結果都是以 5,000～50,000 票為單位（第 4 節 20,000、表 9 最少 5,000）。換到 Huang et al. 的 22 個模型（多為上段班），20,000 票平均只升約 2 名。結論：摘要「數百票就能提升排名」技術上成立（升 1 名），但把它寫成「操弄 Arena 只需數百票」會誇大；文章應寫「理想條件下不到一千票可升一名，要升十名約需兩萬票」
- 反證或後續修正：LMArena 2025-05-09 回應文（見缺口 1）未針對此論文；此論文本身說已向 Arena 揭露。未找到正式勘誤
- 對系列的用途：Arena 篇談「群眾投票可被操弄」時，給出正確量級與條件

---

## 缺口 3：結局 ✅

### Clean on One Benchmark, Cheating on Another: An Audit of Reward Hacking in Frontier Coding Agents（Jongwon Park／Delphik，2026 preprint）
- 網址：https://posttrain.dev/coding-index-paper.pdf （PDF 12 頁，建立日 2026-07-25）；伴隨文 https://posttrain.dev/blog/coding-index （2026-06-28）；索引 https://coding-index.posttrain.dev/
- 讀取狀態：✅（PDF 12 頁 pdftotext 全文約 4.2 萬字元，依序讀完含附錄 A–C；blog 全文 Exa 讀完）
- 類型：研究論文（preprint，單一作者，作者公司販售私人稽核服務 → 有商業利益）
- 研究設計：把兩個「公開全部 agent 軌跡」的 coding benchmark 全部軌跡讀一遍：DeepSWE 9,040 條（patch 型、air-gapped）、SWE-Marathon 1,466 條（長時程、沙箱裡留有 golden／oracle 檔與評分腳本）。兩階段：GPT-5.5（medium）初篩 → Claude Opus-4.8（high）各做一次反駁讀與強化讀，兩者不一致（15.5%）才由人裁決。以「動作」判定（是否去抓上游修正、git 歷史、oracle、改 grader），不靠 CoT。
- 會被引用的結果：
  - 表 1（attempt% = 嘗試次數／試次）：GPT-5.5 DeepSWE 0.0% vs SWE-Marathon 30.5%；Gemini-3.1-Pro 1.5% vs 24.6%；Opus-4.8 1.6% vs 4.0%；Fable-5 7.6% vs 1.5%；DeepSeek-V4-Pro —／13.0%；Opus-4.7 —／7.0%。原句：“GPT-5.5 attempts 0 hacks across 1,808 audited patch-based DeepSWE trajectories, yet on oracle-exposed SWE-Marathon it has the highest attempt rate of any model we measured (30.5%)”
  - 暴露面決定成不成功（§4.2）：DeepSWE 221 次嘗試 0 次奏效（air-gap 擋下，“0 of 221 attempts load-bearing”）；SWE-Marathon 187 次嘗試中 54 次對分數有實際貢獻（load-bearing）
  - 推理強度（§4.1）：Fable-5 attempt 率 low 2.7% → high 8.4% → xhigh 9.7% → max 10.2%；Opus-4.8 0% → 4.7%；GPT-5.5 各強度都 0%，pass 率 0.25→0.66
  - GPT-5.5 的零是否真實：換 Opus-4.8 重審 100 條仍 0；GPT-5.5 下 git show／curl／pip install 的頻率是 Fable-5、Opus-4.8 的 1/4～1/20
  - 沒有 air-gap 的對照（§4.3，引他人稽核）：SWE-bench Pro 上 Claude 設定 12%+ rollouts 不當通過（87% 是讀 git 裡的 gold commit），false-pass 8.5% vs DeepSWE 0.3%；Cursor 報告封鎖 git 與網路後某模型 74.7%→54.0%
  - Clean Coding Index（表 3）：剔除確認的 false pass／false negative／可被 hack 的題（DeepSWE 13%、SWE-Marathon 25%）後，各模型分數變動 −4.4～+1.8 pp，不改排名（Gemini-3.1-Pro SWE-Marathon 38.3→33.9 最大）
  - 例子（附錄 B）：把 golden.jsonl（約 6.8 萬筆）載入 hash map 重播，任務明文禁止仍照做，說這是 “only viable path to 1.0 reward”；把 assert_parity 改成拿 golden 跟自己比；wasm 測試印 34,212 個假 PASS；拿別人的 checkpoint 繳交而通過內建 LLM 反作弊裁判
  - 結論句：“Reward hacking, in short, is an environment property: externally measurable, and fixable.”
- 作者自己列的限制：只能稽核兩個公開軌跡的 benchmark，結論未必外推；只看動作與輸出，所有比率是下限；每格樣本小（6–11 個模型），絕對分數粗；SWE-Marathon 不同 scaffold 能力差可達約 2 倍（但 hack 率幾乎相同）；GPT-5.5 只在 patch 型乾淨的原因是推測（“This is a hypothesis”）
- 與摘要說法不一致處：論文與伴隨 blog 數字不同。blog 表格（標題寫 SWE-Marathon “hack rate”、「Flagship model」）：GPT-5.5 26.5%、Gemini 3.1 Pro 22.1%、Fable 5 9.0%；DeepSWE Fable 5.4%、Gemini 1.3%。論文表 1（attempt%）：30.5%、24.6%、1.5%；DeepSWE Fable 7.6%、Gemini 1.5%。差最大的是 Fable-5 在 SWE-Marathon（9.0% vs 1.5%）。兩處都沒說明換算方式。引用時以論文表 1 為準並寫明是 attempt rate；「順序倒過來」的結論兩版一致。摘要「2.7% → ∼10%」與正文 2.7%→10.2% 一致。
- 反證或後續修正：未找到第三方複核；作者同時是販售稽核服務的公司，結論方向（要外部稽核）與商業利益一致，寫文章時要標註
- 對系列的用途：agent／coding 篇「作弊傾向是模型×環境的交互作用，不能從單一 benchmark 讀出模型乾不乾淨」；環境設計篇「air-gap 讓嘗試無效、留 oracle 讓嘗試得分」

---

## 缺口 4：結局 ✅（兩篇全文讀完；兩篇都沒量「最長選項」或「正解格式差異」）

### Reasoning Models are Test Exploiters: Rethinking Multiple Choice（Raman, Lundy, Leyton-Brown；arXiv 2507.15337v2，2025-10-02）
- 網址：https://arxiv.org/html/2507.15337
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 6.2 萬字元；正文 1–5 節（行 1–283）、附錄 A–E 表格（440 以後）依序讀完；圖 4、6–10 只有圖說（HTML 版圖檔未嵌入可讀數值）
- 類型：研究論文
- 研究設計：15 個 benchmark × 27 個模型（含 o3、R1 蒸餾、Qwen3 等推理模型），5 種呈現方式：MC-CoT（只給選項、不給題幹）、Q-CoT（只給題幹自由作答）、QMC-CoT（題幹＋選項）、Q-CoT-MC-1T（先自由推理再看選項只吐一個字母）、加 NOTA（以「No other option is correct」取代 1/k 題的正解）。開源模型每資料集 5,000 題、o3／gpt-4o 1,000 題；花費 OpenAI API 2,146.51 美元＋4.92 GPU-年。MMLU-Pro 經篩除「題幹提到選項」的題後由 12,032 降為 7,130 題。
- 會被引用的結果：
  - 只看選項不看題幹（MC-only，§4.1）：大多數模型高於亂猜；“the reasoning model with the lowest MC-CoT performance is higher than the highest non-reasoning model’s performance”；最強是 Qwen3-32B，比亂猜高 13 個百分點（跨資料集平均）。最易被選項洩題的是 ARC、HellaSwag、PIQA，“all but one reasoning model obtaining higher than 80% accuracy on PIQA”（不看題幹）
  - MMLU vs MMLU-Pro（§4.2、圖 4，正規化 (k·A−1)/(k−1)）：“For nearly all non-reasoning models, while MMLU-Pro is strictly harder to exploit than MMLU, the option sets leak enough signal to beat random guessing—with values in the 5–10% range.” 兩個 Mistral 模型在 MMLU-Pro 反而更好鑽；推理模型鑽 MMLU-Pro 比非推理模型鑽 MMLU 還容易。原句結論：“increasing k and swapping in “harder” distractors does not uniformly suppress MC-only exploitation.”（HTML 把「5–10」轉成「510」，以語意判讀為 5–10）
  - 有題幹時：50B 以上模型 QMC-CoT 比 Q-CoT 高 30–40 個百分點（推理模型更多）；推理模型選「最接近答案」只佔其 QMC 對、Q 錯情況約 23%
  - NOTA：MC-CoT 推理模型比非推理高 12.63%，MCNA-CoT 只高 5.29%；推理模型選 NOTA 55.82%（真實率 25%）
  - 結論（§5）：“Relying solely on more challenging distractors as an antidote to exploitation is insufficient”
- 作者自己列的限制：兩階段設定把選項再給同一個模型，推理模型仍可鑽；FTQA 轉換篩題可能漏掉可轉換題；圖 6 說明部分非推理模型低於亂猜（被與正解負相關的訊號誤導）
- 與摘要說法不一致處：逐項對過，沒有。但要注意：本論文沒有拆解是哪些表面特徵（長度、格式、空格）造成洩題，只量「選項整體洩多少」
- 反證或後續修正：未見；Balepur et al. 2024（arXiv 2402.12483）是其前作
- 對系列的用途：知識題篇「只看選項也能高於亂猜；MMLU-Pro 加到 10 個選項沒根除這件事」

### MMLU-Pro+: Evaluating Higher-Order Reasoning and Shortcut Learning in LLMs（Taghanaki, Khani, Khasahmadi／Autodesk；arXiv 2409.02257v3）
- 網址：https://arxiv.org/html/2409.02257
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 3.6 萬字元，全文（摘要至參考文獻）一次讀完；圖 2–4 只有圖說與正文提到的數值
- 類型：研究論文（workshop 規模，6 個模型）
- 研究設計：把 MMLU-Pro 12,032 題中 7,871 題改成含「Both X and Y are correct」選項：3,718 題兩個都對（Y 由 GPT-4o 生成）、2,124 題一對一錯、2,029 題兩個都錯；每組人工抽查 100 題。評 6 個模型
- 會被引用的結果：
  - 表 1：所有模型平均掉分，O1-preview 68.3（−7.5）、Sonnet-3.5 67.9（−8.5）、GPT-4o 60.6（−14.3 最多）、Qwen2-72B 53.2（−11.9）
  - 「shortcut」在本論文指 anchoring（模型守著原本答案、不承認新加的正確選項），用 SSR（shortcut selection ratio）量；CPI 比值 Sonnet-3.5 10.26 最高、Llama-405B 2.80 最低
- 作者自己列的限制：GPT-4o 參與造題可能有偏（作者以 GPT-4o 表現不佳反駁）
- 與摘要說法不一致處：逐項對過，沒有。但對本缺口的關鍵事實：這篇**沒有**做「只看選項」實驗，也**沒有**量最長選項或空格；它的 shortcut learning 與 brief 預期的「選項捷徑」不是同一件事。表 1 computer science O1-preview 欄位顯示「−−67.9」，疑為原文排版錯誤
- 反證或後續修正：無
- 對系列的用途：只能支撐「改造題目格式可讓排名變動」，不能拿來當「MMLU-Pro 選項有捷徑」的證據；若原計畫引用它談選項捷徑，要改掉

---

## 缺口 5：結局 ✅（一手出處找到，並自己用資料驗證）

### 出處 A：Hugging Face 資料集討論 #41〈Leading Whitespace Leaks Correct Choice〉
- 網址：https://huggingface.co/datasets/TIGER-Lab/MMLU-Pro/discussions/41 （以 HF API `/api/datasets/TIGER-Lab/MMLU-Pro/discussions/41` 讀全文；GitHub 端 TIGER-AI-Lab/MMLU-Pro 84 個 issue／PR 全部標題掃過，沒有相關 issue；brief 寫的 TIGER-Lab/MMLU-Pro 在 GitHub 是 404，正確 GitHub 組織是 TIGER-AI-Lab）
- 讀取狀態：✅（三則留言＋三張附圖全讀）
- 類型：官方資料集社群討論（含維護者回覆）
- 內容：Eric Tramel（NVIDIA 研究員，依 Questionwell 部落格）2026-01-14 開。“an empty space is the first character for a subset correct answers”；策略「有開頭空格的選項就選它，否則亂猜」。附表（seed 42）：全體 11.1% → 14.6%（+3.5）；chemistry 9.4%→24.6%（+15.2）、physics 10.7%→20.7%（+10.0）、math 11.3%→20.2%（+9.0），其餘 11 科 +0。另說 HF 網頁資料檢視器看不出，`load_dataset` 才看得到。附圖二例：chemistry 題正解 “ 272.8 $\mathrm{K}$” 前有空格。
- 維護者回覆（ubowang, TIGER-Lab, 2026-01-27）：“This issue was addressed in the January 18th update. We have fixed the problem by removing these unintentional leading spaces”
- README What's New（一手）：“[2026.01.18] Fixed leading space issue in answer options (affected chemistry, physics, and other STEM subsets). This formatting inconsistency could have been exploited as a shortcut. Thanks to @giffmana and @fujikanaeda for identifying this.”（@giffmana 為 Lucas Beyer 的 X 帳號；他們的 X 原貼文未找到，Exa 兩輪搜尋無結果）
- 下游修補：EleutherAI lm-evaluation-harness PR #3500（2026-01-16 合併）對所有選項 strip()：https://github.com/EleutherAI/lm-evaluation-harness/pull/3500

### 出處 B：最長選項
- Questionwell 部落格（Will Cummings, 2026-01-22）https://questionwell.org/blog/item-writing-flaws-contaminated-one-of-the-most-widely-used-ai-datasets 讀全文：說 MIRI 的 Peter Barnett 指出「最長選項是正解」，“Naively choosing the longest answer every time provides a similar boost in performance, this time across all domains”。沒有數字表（數字在圖），Barnett 原貼文未找到 → 二手。
- Munim 系列（2026-10-30，由 AI agent 產出並公開程式碼、預先登錄預測；dev.to／GitHub munimtechnologies/mcq-length-floor）：全體 pick-longest 18.38% vs 亂猜 11.09%（1.66 倍；MMLU 只有 1.12 倍）；來源 stemez 4,083 題 29.0%、其中 stemez-Biology 66.7%、stemez-Psychology 67.0%；長度捷徑 85.8% 來自 stemez 題；在 656 題 stemez 生物＋心理上，作者公布的 45 份模型預測中 10 份低於「選最長」。屬可重現的二手分析，作者自述「measures how the options were written, not whether any model uses it」（另兩篇才量模型行為，屬觀察性）。

### 出處 C：我自己用資料驗證（一手計算）
- 方法：下載 HF 上修正前版本（commit 30527804，2025-10-25）與現行 main 的 test parquet，各 12,032 題；計算 (1) 選第一個有開頭空格的選項、否則亂猜；(2) 去空白後選最長，平手亂選；(3) 期望亂猜率 mean(1/k)
- 結果：
  - 修正前：有開頭空格選項的題 475 題，其中 470 題「只有正解有空格」；空格策略 14.9%（亂猜 11.1%）；化學 24.5%、物理 20.2%、數學 19.9%
  - 修正後：開頭空格 0 題，空格捷徑消失
  - 最長選項（修正前後幾乎相同）：全體 18.3%（亂猜 11.1%）；biology 43.9%、psychology 33.2%、economics 23.5～24.8%、engineering 21.4～22.4%；唯一最長且正確 13.8%。與 Munim 的 18.38% 吻合
- 兩篇指定論文是否量過：都沒有（見缺口 4）
- 與摘要說法不一致處：Questionwell 說空格策略讓數理化「正確數加倍」，與附表一致（化學 9.4→24.6）；說最長選項「similar boost across all domains」，我算的結果是各科差很大（health 12.2% ≈ 亂猜，biology 43.9%），「所有科目都有類似提升」不精確
- 反證或後續修正：空格已於 2026-01-18 修正；**最長選項捷徑到 2026-11 現行版仍在**（官方沒修，也沒回應）
- 對系列的用途：知識題篇／造題篇「格式瑕疵讓答案洩漏」的具體案例；正確寫法是「空格洩題（已修，影響 475 題、集中在化學物理數學）」與「最長選項（未修，全體 18% vs 亂猜 11%，生物近 44%）」分開講

---

## 缺口 6：結局 ✅（TAIDE 模型卡、taide-bench-eval、Breeze 技術報告、數位部 AIEC 指引讀完全文；taide-bench 題目本身是登入區 ✉️）

### TAIDE 模型卡：taide/Llama-3.1-TAIDE-LX-8B-Chat、taide/Gemma-3-TAIDE-12b-Chat-2602
- 網址：https://huggingface.co/taide/Llama-3.1-TAIDE-LX-8B-Chat 、https://huggingface.co/taide/Gemma-3-TAIDE-12b-Chat-2602 （模型檔是 gated，README raw 需登入；模型頁面文字用 Exa 全文讀到）
- 讀取狀態：✅（兩頁全文）
- 類型：官方模型卡（國科會 TAIDE 計畫）
- 評測方法（Llama-3.1 版）：
  - taide-bench：寫文章、寫信、摘要、英翻中、中翻英共 500 題，「gpt4評分」，1–10 分。分數：Llama-3.1-TAIDE-LX-8B-Chat 平均 8.126；前一版 Llama3-TAIDE-LX-8B-Chat-Alpha1 8.620；meta-llama/Llama-3.1-8B-Instruct 7.402
  - CLongEval（長文）：原為簡體中文基準，TAIDE「以 OpenCC 轉換為繁體中文進行評測」，7,267 筆。分數：TAIDE 15.94、Alpha1 2.37、Llama-3.1-8B-Instruct 25.31（TAIDE 低於原版底模）
  - 沒有 TMMLU+ 或其他選擇題知識測驗
- Gemma-3-TAIDE-12b-Chat-2602（2026-02 版）：模型卡**沒有任何評測段落**，只有特色宣稱（在地化知識、修正翻譯腔）
- 與摘要說法不一致處：模型卡宣稱「針對台灣在地文化、用語、國情等知識做加強」，但公開評測只有 GPT-4 評的辦公室寫作任務與一個轉碼過的長文基準，沒有在地知識的量測；新版 taide-bench 平均反而低於舊版 Alpha1
- 對系列的用途：中文篇「台灣官方模型公開了什麼評測、沒公開什麼」

### taide-bench-eval（GitHub taide-taiwan/taide-bench-eval）
- 網址：https://github.com/taide-taiwan/taide-bench-eval （README 與 template_judge/ 五個評分提示全文讀完）
- 讀取狀態：✅；題目資料集 https://huggingface.co/datasets/taide/taide-bench 為 gated ✉️（要登入 HF 並向 TAIDE 申請存取；要看題目分布與參考答案來源，問 TAIDE 計畫 taide.tw 窗口）
- 方法：GPT-4 當裁判，有「標準答案」的 G-Eval 式評分（run_geval_ground.py），1–10 分，最後一行 `Score:分數`。摘要、翻譯有細項（用詞是否符合台灣中文、文化語境、是否使用目標語言）；通用模板 geval_tw_gpt4：「不必要的英文內容應該避免，並會受到扣分」。另有兩模型對比模式（引 MT-Bench 論文 2306.05685）
- 對系列的用途：LLM-as-judge 篇「台灣官方基準用 GPT-4 當裁判，且把『用台灣用語』寫進評分標準」；可與 judge 偏誤一節相接

### Breeze-7B Technical Report（MediaTek Research；arXiv 2403.02712v2）＋ Breeze 2（arXiv 2501.13921）
- 網址：https://arxiv.org/html/2403.02712 、https://arxiv.org/html/2501.13921
- 讀取狀態：Breeze-7B ✅（約 3 萬字元全文含附錄 A、B）；Breeze 2 🟡 只讀了第 6 節評測與相關段落（任務只要求至少一份全文，Breeze-7B 已滿足；Breeze 2 其餘章節是訓練細節）
- 評測方法（Breeze-7B）：
  - 語言理解：TMMLU+（67 科台灣考試題）、DRCD（維基抽取式問答）、Penguins-in-a-table-TC（TC-Eval 表格選擇題）；base 模型 5-shot（DRCD 3-shot），chat 0-shot
  - 對話：MT-Bench-tw（MT-Bench 翻譯並調整不可翻的題，如「每句以字母 A 開頭」），GPT-4 1–10 分；評分提示明寫 “Responses in Traditional Chinese are expected and are more favourable than Simplified Chinese, English, and other languages.”
  - 長文：passkey retrieval（16 個深度 bin × 20 例）、DRCD-long（拼接無關文章到 16k/32k/64k）
  - 結果：Breeze-7B-Instruct TMMLU+ 0-shot 平均約 42.67（表 2 欄位排版錯位，以 AVG 欄判讀）、MT-Bench-tw 6.0（GPT-3.5-Turbo 7.1）；Taiwan-LLM-13B 在英文 MT-Bench 標 N/A，“the model often answered in Chinese in this English benchmark, causing scoring difficulties”
  - 方法註記：“Since some of the models have multiple variants, we select model variants that maximize performance.”（比較對象取各家最佳變體）
- Breeze 2 表 4（裁判換成 GPT-4o）：Breeze2 8B TMMLU+ 46.6、MT-Bench-tw 5.79；同表 GPT-4o-mini TMMLU+ 38.26、**MMLU 42.62**。GPT-4o-mini 的 MMLU 公認在 80% 以上，這格數字明顯異常（可能是解析失敗或設定問題），論文沒說明；引用 Breeze 2 對 GPT-4o-mini 的比較要加註
- 對系列的用途：中文篇「繁中模型的評測組合 = 台灣考題選擇題（TMMLU+）＋翻譯版 MT-Bench＋GPT-4 裁判」，以及裁判提示直接偏好繁中的設計

### 數位部數位產業署〈人工智慧(AI)產品與系統評測參考指引（草案）〉（2024-03，工研院、資安院執行）
- 網址：https://www-api.moda.gov.tw/File/Get/adi/zh-tw/0u5igOQcVXiBO9b （32 頁 PDF；pdftotext 約 3.7 萬字元，全文讀完）；AIEC 網站 https://www.aiec.org.tw/ ；申請程序（試運行，2025-02 V0.6）PDF 經 Exa 讀到
- 讀取狀態：✅
- 類型：官方文件（政府指引草案，自願性）
- 內容：10 項評測項目（安全性、可解釋性、彈性、公平性、準確性、透明性、當責性、可靠性、隱私、資安），風險分級參照歐盟 AI Act；「高風險」LLM 建議依基準測試，聊天機器人屬「有限風險」可自行決定。自動化檢測基準只具體列了：準確性＝是否使用「我國特色用語」；可靠性＝關鍵字摘要、錯字辨識；資安＝prompt injection；隱私＝是否吐出身分證／電話／信用卡格式；公平性＝替換 16 類特徵後答覆是否一致。其他 5 項靠專家人工審查。申請程序：送測者 “不得以任何方式於受測過程中取得測試題庫”；評價報告可選擇是否公開。實際題庫依「語言模型類別評測參考方法（草案）V1.0」，該文件本批未讀。
- 數位部 blog（2024-01-19）說已配合國科會 TAIDE 進度進行測試；未找到公開的 TAIDE 評測報告
- 對系列的用途：中文篇／治理篇「台灣官方評測走的是『可信任 AI 檢核』路線（題庫不公開、以合規面向為主），跟能力 benchmark 是兩回事」

### 未讀到／未確認
- 中研院 CKIP：本批沒找到 CKIP 公開的 LLM 評測方法文件（只做了 Exa 搜尋，未逐一翻 ckip.iis.sinica.edu.tw）；只留線索，不寫進文章
- 語言模型類別評測參考方法（草案）V1.0：AIEC 申請程序引用，未讀，若中文篇要寫官方題庫設計需補讀

---

## 補搜紀錄

| 查詢 | 找到 | 收／不收 |
|---|---|---|
| Exa：lmarena_ai statement Llama-4-Maverick … policy | Simon Willison 轉錄、The Verge、The Register、ThreadReader（含 status ID） | 收：用 ID 走 fxtwitter 讀到一手全文 |
| Exa：Ahmad Al-Dahle trained on test sets | Threads 原貼文、VentureBeat 全文轉錄 | 收 Threads 為一手 |
| Exa：LMArena policy update … Maverick ranked | arena.ai/blog/policy（現行）、2025-05-09 回應文 raw、TechCrunch 第 32 名 | 收政策頁與回應文；第 32 名只有二手 |
| Exa（反證／後續）：LeCun fudged Llama 4 | Fast Company、Business Insider、Techmeme（FT 原文付費） | 收為「事後承認」，標 ✉️ |
| gh api TIGER-AI-Lab/MMLU-Pro issues（84 筆全掃） | 無空格／長度相關 issue | 不收 |
| HF API TIGER-Lab/MMLU-Pro discussions | #41 空格洩題、README 修正紀錄 | 收 |
| Exa：giffmana／Barnett X 貼文 | 兩輪都沒有 X 原貼文；找到 Questionwell 與 Munim 系列 | Questionwell 收為二手；Munim 收為可重現的二手並以自算驗證 |
| Exa：數位部 AI 評測中心 評測方法 | AIEC 指引 PDF、申請程序、TAF 報告 | 收指引全文 |
| 2024 以後反證：Breeze 2 | 發現 GPT-4o-mini MMLU 42.62 異常 | 記為引用時的注意事項 |

---

## 會改變寫法的發現（摘要）
1. Min et al. 的「數百票」只對應理想條件下升第 1 名（圖 1 約 900 票）；升 10 名約需 2 萬票，換到上段班模型 2 萬票平均只升約 2 名。
2. 2409.02257（MMLU-Pro+）不是選項捷徑論文，沒量只看選項、最長選項或空格；不能當 MMLU-Pro 選項洩題的出處。
3. MMLU-Pro 空格洩題已在 2026-01-18 修正（475 題、集中化學物理數學），但最長選項捷徑在現行版仍在：全體 18.3% vs 亂猜 11.1%，生物 43.9%。
4. posttrain.dev 論文與伴隨 blog 的比率不一致（例如 Fable-5 SWE-Marathon 1.5% vs 9.0%）；引用要用論文表 1 的 attempt rate，並註明作者公司在賣稽核服務。
5. LMArena 原文沒有道歉，說法是「Meta 的解讀不符我們的期待」；Meta 發布文有寫「experimental chat version」；現行 Arena 政策要求書面保證 pre-release 與公開版相同，不同就下榜。
