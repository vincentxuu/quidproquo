# 獨立審稿：MIT 6.5940 課程總覽（中英）

- 審稿日期：2026-10-14
- 審稿者：獨立審稿 agent（未參與撰寫）
- 審稿對象與 sha256：
  - `src/content/posts/ai/2026-09-30-mit-65940-course-overview.md` — `061d3efca2084968aee646bc35678a8f69d9498cdd14b72078fa9cb7551b7084`
  - `src/content/posts/ai/2026-09-30-mit-65940-course-overview-en.md` — `f00280cb8f94ee77d32809ae1d3aae2d1321b6079cbc1645f5eea4d7479731f4`
- 對照：`.work/process-leak-backfill/mit-65940-course-overview-before.md`、同目錄 `2026-09-30-mit-65940-*.md` 各篇導讀
- 依據：`course-guide-contract.md`「依角色教學」「影片與正文的搭配」「查證資訊的位置」；`writing-guide.md`「查證過程不寫進正文」
- 機器檢查：`check-process-leak.mjs` 兩檔 0 問題；`check-course-guide-layout.mjs` 2 posts 0 issue；`check:course-videos` 無 65940 相關錯誤；`check:tw` 0 blocking／0 review；文內站內連結全部對得到檔案。
- 影片片長：yt-dlp 取得 `U7EPZv8Kh9w` duration = 3961 秒 = 66 分 1 秒，「1 小時 6 分」正確。

**結論：需修改（小幅）。** 結構、手算、自我檢查與限制保留都合格；需修的是兩處機制缺漏（L7 building block、L17 整講）、量化範圍慣例與第 5 講導讀不一致未說明、141KB 歸因、LLM 路線疑似漏 order 18，以及一句容易誤讀的句子。

---

## 1. 四章是否每講都講出機制

中文行號（英文行號約 −1）。

| 講次 | 位置 | 判定 | 說明 |
|---|---|---|---|
| L1–2 量尺 | zh L45／en L44 | 有機制 | 參數量／model size／peak activation、MAC／FLOP，並點出 MCU 上 activation 先爆。 |
| L3–4 Pruning | zh L49 | 有機制 | 規則度與加速的取捨、2:4、敏感度分析、小學習率 fine-tune。L4 的 EIE／系統支援只以 2:4 帶過，可接受。 |
| L5–6 Quantization | zh L50 | 有機制 | $r=S(q-Z)$ → 整數運算；PTQ（粒度、裁切）→ QAT。 |
| **L7 NAS I** | zh L51 | **只有主題名** | 「讓搜尋找出又小又準的架構」只是定義；L7 有一半在講 building block（bottleneck、depthwise、MobileNetV2 如何省 MAC），搜尋空間與搜尋策略也沒有一句機制。該行的機制句（評估最貴、OFA 超網路）全部屬於 L8。 |
| L8 NAS II | zh L51 | 有機制 | 評估成本 → OFA 共享權重、$10^{19}$ 子網路免各自訓練。 |
| L9 Distillation | zh L52 | 有機制 | 溫度攤平分布，附數字。 |
| L10 MCUNet | zh L53 | 有機制 | 先挑搜尋空間再搜、patch-based inference 1372→172kB。 |
| L11 TinyEngine | zh L53 | 偏名詞清單 | loop reordering、tiling、in-place depthwise 只列名，沒說它們省的是什麼（cache 命中、峰值記憶體）。半句即可補，例如「tiling 讓重複用到的資料留在 cache，in-place depthwise 讓輸出覆寫輸入以壓峰值記憶體」。建議修，非阻擋。 |
| L12 Transformer | zh L57 | 有機制 | $O(N^2)$、KV cache 線性成長、GQA／MQA 共用 KV（與 primer 篇一致）。 |
| L13 部署 | zh L57 | 大致有 | SmoothQuant、AWQ 有機制；稀疏與 serving 兩條只有「只用一部分參數或 token」與 PagedAttention／speculative decoding 名稱。可接受，若要補可各加半句。 |
| L14 後訓練 | zh L58 | 有機制 | LoRA 可併回的低秩分支、QLoRA 4-bit 主幹。 |
| L15 長上下文 | zh L58 | 有機制 | attention sink + 最近視窗。 |
| L16 ViT | zh L59 | 有機制 | 解析度平方成本 → window／linear attention（與導讀 tldr 一致）。 |
| **L17 GAN／影片／點雲** | zh L59 | **完全缺** | 標題寫「第 16–17 講」，但內容只講 ViT 與（L18 的）diffusion。L17 的核心機制「每種資料各有冗餘：GAN 2D 空間、影片時間（TSM 零 FLOPs 時間位移）、點雲 3D 稀疏」一句都沒有。 |
| L18 Diffusion | zh L59 | 有機制 | 步數多 → 少跑步、每步少算、多卡分攤。 |
| L19–20 分散式 | zh L63 | 有機制 | 350GB > 80GB → 資料／ZeRO／pipeline／tensor 平行，L20 通訊瓶頸與梯度壓縮。 |
| L21 裝置端訓練 | zh L63 | 有機制（歸因有誤，見 §2） | 存 activation 是訓練貴的原因、bias-only、只更新重要層。 |
| L22–23 | zh L67 | 有機制 | 三塊×兩軸重畫、SuperCircuit 與閘剪枝對應超網路與 magnitude pruning（與總結篇 L165–182 一致）。 |

## 2. 與各篇導讀的一致性

| 數字／說法 | 總覽位置 | 對照篇 | 判定 |
|---|---|---|---|
| AlexNet 61M／724M MACs | zh L45 | basics-efficiency-metrics tldr、L108、L145 | 一致 |
| 2:4 在 Ampere 最多 2 倍 | zh L49 | pruning-granularity-criteria L22、L114 | 一致（細節篇另記實測 BERT 1.5×，總覽寫「最多」無誤） |
| $10^{19}$ 子網路 | zh L51 | nas-hardware-aware L11、L113；lab3-nas L75（「超過」） | 一致 |
| 0.982／0.017 → 0.599／0.401 | zh L52 | knowledge-distillation L70 | 一致 |
| SRAM 256–320kB | zh L53 | mcunet-tinyml tldr | 一致 |
| 1372 → 172kB | zh L53 | mcunet-tinyml L112–114 | 一致 |
| SmoothQuant／AWQ 約 1% | zh L57 | llm-deployment tldr、L92–96 | 一致 |
| GQA／MQA 歸 L12 | zh L57 | transformer-llm-primer（14 處）；llm-deployment 0 處 | 一致（歸在 L12 正確） |
| ViT 成本隨解析度平方 | zh L59 | efficient-vision L11、L74 | 一致 |
| GPT-3 fp16 350GB | zh L63 | distributed-training L82 | 一致 |
| **141KB** | zh L63／en L62 | on-device-training L140–150 | **歸因不精確**：總覽寫「只調 bias、只更新重要的層，最後……壓到 141KB」，讀起來像 bias-only 加 sparse update 達成 141KB。實際表格是 PockEngine 5.7MB →＋QAS 2.9MB →＋sparse layer/tensor update 355KB →＋operator reordering 141KB；bias-only（TinyTL）是另一條線（省 6.5／12 倍）。建議改成「再加上 sparse update 與編譯期的 operator reordering，最後……141KB」。 |
| 量子 ML：超網路、magnitude pruning | zh L67 | course-summary-quantum-ml L165–182 | 一致（SuperCircuit 對應 OFA；小角度閘剪枝對應 magnitude pruning） |
| 「23 講投影片、錄影……都公開」 | zh tldr L12、L103 | course-summary-quantum-ml tldr：L22 的 Quantum ML Part I「只有錄影、沒有投影片」 | 小幅過度宣稱，建議改「23 講錄影與投影片（L22 量子 ML 部分只有錄影）」或至少在 L103 補半句。非阻擋。 |
| Lab 5 需求 8GB／5GB | zh L73、L86 | lab4-lab5 L115 | 一致 |
| 連結對應 | 全部 | — | 每講連結都指向對應講次的導讀；中英連結各自指向 `-en` 版；全部檔案存在。 |

## 3. 手算一次（zh L69–79／en L68–78）

重算：

- $7\times10^9\times2 = 1.4\times10^{10}$ B = 14 GB ✓；$\times0.5$ = 3.5 GB ✓；「四分之一」= 16 bit → 4 bit ✓。
- $S = 1/7 = 0.142857$ ✓；$0.3/0.142857 = 2.1$，round = 2 ✓；$2\times0.142857 = 0.2857 \approx 0.286$ ✓；誤差 0.0143 ≈ 0.014 ✓。
- 離群值：$S = 8/7 = 1.1429$ ✓；$0.3/1.1429 = 0.2625$，round(0.26) = 0 ✓。「組裡其他小權重也一樣」：$|w| < S/2 \approx 0.571$ 都變 0，原本的最大值 1 會變成 round(0.875)=1 → 1.143；說法對「小權重」成立 ✓。
- 自我檢查 2：$13\times10^9\times0.5 = 6.5$ GB ✓。
- 自我檢查 3：$S = 1/127$，$0.3\times127 = 38.1$，round = 38 ✓；$38/127 = 0.29921 \approx 0.299$ ✓；誤差 0.00079 ≈ 0.001 ✓。
- 例子有條件、計算、結果、意思四段，並明示「本文的教學例子」✓。

**範圍慣例（需修）：** 第 5 講導讀（quantization-basics L170）寫的是 N-bit 有號整數 $[-2^{N-1}, 2^{N-1}-1]$，4-bit 是 **−8 到 7**，並以 full range mode $S = |r|_{\max}/2^{N-1}$（4-bit 為 $|r|_{\max}/8$）為準。總覽用 −7 到 7、$S = |r|_{\max}/7$（自我檢查 3 用 −127 到 127、$S=1/127$），是捨棄 −8 的 restricted／對稱範圍。數學沒錯，但讀者接著讀第 5 講會看到 $S = 1/8$，以為總覽算錯。建議在「再量化一個數」補一句：「這裡用 −7 到 7（捨棄 −8，讓正負對稱）；第 5 講的 full range 用 −8 到 7、$S = |r|_{\max}/8$，換成那個算法 0.3 會量化成 round(2.4)=2、還原 0.25，結論不變。」英文同步。

**措辭（需修）：** zh L73「加上 KV cache 和執行時的 activation 才有機會放得下」字面意思是「加上之後才放得下」，與原意（3.5GB 加上 KV cache 與 activation 仍有機會塞進 8GB）相反。建議改成「3.5GB 加上 KV cache 和執行時的 activation，仍有機會放進 8GB」。en L72 "which leaves a chance of fitting once the KV cache and runtime activations are added" 可讀，但同樣建議改成 "leaving room for the KV cache and runtime activations within 8 GB"。

## 4. 自我檢查五題（zh L88–99／en L87–98）

| 題 | 答案正確 | 有判準 | 備註 |
|---|---|---|---|
| 1 channel vs fine-grained | ✓ | ✓（矩陣變小可用密集運算 vs 需稀疏硬體／kernel） | 正文 L49 只說「越規則越容易變快」，答案補了原因，屬合理的解釋題。 |
| 2 13B 4-bit | ✓ 6.5GB | ✓ 算式 | — |
| 3 8-bit 還原 | ✓ 0.299／0.001 | ✓ 算式 | 同 §3，−127..127 慣例要與第 5 講對齊說明。 |
| 4 溫度 | ✓ | ✓ | 與 L52 呼應。 |
| 5 activation 先爆 | ✓ | ✓（Flash vs SRAM、峰值在高解析度前段層） | 與 mcunet-tinyml L112「前段幾個 block 很高」一致。 |

合格。契約「各節自我檢查」是針對依錄影寫成的文章；總覽不強制，不列為問題。

## 5. 查證過程外洩與限制保留

**外洩：** 正文（出處區以前）沒有「經查證」「打開核對」「404」「本系列沒有確認」類句型；查課型 H2（硬事實、公開程度、兩屆差異）全部移除，0 個，符合「最多一個」。H2 共 10 個，講課程內容與讀法的（主線、手算、先備與自我檢查、怎麼讀、系列目錄、今晚）過半。glossary 的 sabbatical context 已改成讀者語言。✓

**限制保留：**

| 限制 | 位置 | 判定 |
|---|---|---|
| Fall 2025 停開 | zh L103、glossary | ✓ |
| lab 無公開解答 | zh L103 | ✓，並給替代做法（對照講義與 notebook 檢查點） |
| Lab 5 硬體需求 | zh L73、L86 | ✓（省略 x86／ARM 處理器一項，可接受） |
| Fall 2026 Lab 2 矛盾 | zh L103 | ✓，並給做法（用 Fall 2024 Lab 1） |
| 期末發表無錄影 | zh L161（課程影片來源） | ✓ |
| L22 量子 ML Part I 沒有投影片 | 已刪 | 見 §2：tldr／L103 的「23 講投影片都公開」因此小幅失真；限制本身在總結篇有交代。 |
| F26 Lab 1 Part 5 需 A100 | 已刪 | 補充篇 L53 有交代，總覽不需要。 |

## 6. 導言影片嵌入

- 位置：導言末尾、第一個 H2 之前，影片狀態行之後 ✓（zh L36–39／en L35–38）。
- 狀態行：「已附影片。導言附第 1 講錄影（1 小時 6 分），各講錄影在各篇導讀」✓，符合契約對課程總覽的寫法；附來源錨點 ✓。
- 片長：1 小時 6 分，實測 3961 秒 ✓。
- 搭配句：zh L34「下面是第 1 講錄影，講為什麼需要高效 AI，以及整門課的地圖。」說了影片內容，但沒說和本文哪段對應、怎麼搭配。建議補半句，例如「對應本文開頭的動機與『主線』的章節地圖；量尺在第 2 講，不在這支影片裡」。非阻擋。
- 出處區只有連結、版本與查核日期，沒有第二個播放器 ✓；`check-course-guide-layout` 0 issue。

## 7. 中英一致與 zh-TW 用語

- 段落、數字、例子、答案、路線、表格、連結逐段對應一致；英文連結全部指向 `-en`。
- 英文 glossary 的 sabbatical 少了 aliases，無影響。
- zh-TW：`check:tw` 0 blocking／0 review；人工掃描無中國用語（「優化器」「部署」在允許清單）。
- 用字小註：契約要求「台灣中文授課序號用『堂』，不用『講』」，中文正文全用「第 N 講」，系列其他篇正文也用「講」、標題用「堂」。此條在契約裡寫在標題段，正文不列為阻擋；若要統一，屬系列層級決定。

## 其他

- **閱讀路線（需確認）：** zh L107／en L106「只想做 LLM 效率：1 → 5、6 → 14 → 15 → 16 → 17 → 19」。order 17 是 Fall 2026 的 GPU Lab 補充篇，order 18 是 LLM 後訓練（LoRA／QLoRA）卻被跳過；而正文 L58 把 LoRA／QLoRA 列為 LLM 效率的一部分。改寫前版本也是這串，疑為插入補充篇時沒有重排的 off-by-one。建議改成 `14 → 15 → 16 → 18 → 19`（GPU 補充篇視需要加），或說明為何跳過 18。

---

## 需修改清單

1. zh L51／en L50：NAS 那條補 L7 的機制（building block 怎麼省 MAC、搜尋空間與搜尋策略各一句），目前 L7 只有主題名。
2. zh L59／en L58：「第 16–17 講」那條補 L17 的機制（GAN 2D 空間冗餘、影片時間冗餘如 TSM、點雲 3D 稀疏），目前整講缺。
3. zh L75／en L74（含自我檢查第 3 題 zh L94／en L93）：說明 −7..7、−127..127 是捨棄最小值的對稱範圍，第 5 講導讀用 −8..7、$S=|r|_{\max}/8$，結論不變。
4. zh L63／en L62：141KB 的歸因改成 sparse update 加 operator reordering（PockEngine／QAS 疊加），不要讓讀者以為是 bias-only 達成。
5. zh L73／en L72：「加上 KV cache 和 activation 才有機會放得下」改成「3.5GB 加上 KV cache 與 activation 仍有機會放進 8GB」。
6. zh L107／en L106：LLM 路線跳過 order 18（後訓練）卻含 order 17（F26 GPU 補充），確認並修正或說明。

建議（非阻擋）：
- zh L53：TinyEngine 三個技巧各補半句省的是什麼。
- zh L12、L103：「23 講投影片都公開」補 L22 量子 ML Part I 只有錄影。
- zh L34／en L33：導言補一句影片與本文段落的搭配方式。

---

# 複審（2026-10-14，第 2 輪）

- 新版 sha256：
  - `src/content/posts/ai/2026-09-30-mit-65940-course-overview.md` — `3e6470e716dcbbd8c3dd1c4d0ac14cd9739f5e9ff6fbd74dcb80e9c0d5a0461a`
  - `src/content/posts/ai/2026-09-30-mit-65940-course-overview-en.md` — `7dd2cd19ce0b45425ca0ad907ec36a3c5081f3024f9e10d78a557adc35158955`
- 機器檢查重跑：`check-process-leak.mjs` 兩檔 0 問題（exit 0）；`check-course-guide-layout.mjs` 2 posts 0 issue；`check:tw` 0 blocking／0 review；`check:course-videos` 無 65940 相關輸出。

**結論：通過。** 六項需修全部解決，三項採用的建議也到位；新增句子與各講導讀一致。剩一個非阻擋的小建議（GAN Compression 的機制寫法）。

## 逐項確認

| # | 位置（zh／en） | 新內容 | 對照導讀 | 判定 |
|---|---|---|---|---|
| 1 | L51／L50 | 第 7 講：bottleneck 用 1×1 降通道、比 2048 通道直接做少 8.5 倍 MAC；搜尋空間（深度、寬度、解析度、kernel size）與搜尋策略（隨機、強化學習、梯度、演化）；第 8 講獨立成句 | nas-search-space-strategy tldr（8.5 倍）、L143–146（四個維度）、L164–167（策略） | ✓ 一致。導讀另列 grid search 與拓撲維度，總覽省略可接受。 |
| 2 | L59／L58 | 第 17 講三種冗餘：GAN 空間（GAN Compression）、影片時間（TSM 沿時間軸位移、不加 FLOPs）、點雲只在有點處計算 | efficient-vision L52（三種冗餘的框架）、L19–21（TSM 定義：零 FLOPs）、L166–170（點雲稀疏、SPVConv 稀疏卷積） | ✓ 一致。小建議：GAN Compression 實際機制是「蒸餾＋NAS 壓生成器的 channel 數」（導讀 L125），目前括號只掛方法名，「影像在空間上重複」也沒說它怎麼省。非阻擋。 |
| 3 | L75、L95／L74、L94 | 4-bit 範圍 −8 到 7，捨棄 −8 用 −7 到 7；8-bit 題同樣說明 | quantization-basics L170（4-bit −8 到 7） | ✓ 不再和第 5 講衝突。第 5 講導讀的 full range 用 $S=|r|_{\max}/8$，總覽沒點名這個差異；因為已經明說「捨棄 −8」，讀者對得起來，不再列為需修。 |
| 4 | L63／L62 | TinyTL、sparse update，再由 PockEngine 疊上 int8 訓練與編譯期最佳化 → 141KB | on-device-training L140–150（PockEngine → ＋QAS（int8）→ ＋sparse update → ＋operator reordering = 141KB）、L105（sparse update 方案中後段層只調 bias） | ✓ 歸因正確。TinyTL 本身不在 141KB 那條鏈上，但 sparse update 方案含 bias-only 的更新，「把這些疊在一起」的說法可以接受。 |
| 5 | L73／L72 | 「再加上 KV cache 和執行時的 activation，仍有機會放進 8GB」 | — | ✓ 語意正確，中英一致。 |
| 6 | L107／L106 | 14 → 15 → 16 → 18 → 19，17 列為選讀（GPU 層量測） | 系列目錄 order 17＝F26 Lab 1 GPU Basics、18＝LLM 後訓練 | ✓ |

## 採用的建議

| 項目 | 位置 | 對照 | 判定 |
|---|---|---|---|
| TinyEngine 半句 | zh L53／en L52 | tinyengine L11（loop reordering／tiling 加速、in-place depthwise 峰值 2×C×H×W → (1+C)×H×W） | ✓ 「讓資料留在快取」「輸出覆寫輸入、省下一份 activation 記憶體」與導讀一致。 |
| 投影片只缺第 22 講量子 ML 部分 | zh tldr L12、L103；en L12、L102 | course-summary-quantum-ml tldr（L22 Quantum ML Part I 只有錄影） | ✓ |
| 導言搭配句 | zh L34／en L33 | 契約「導言交代片長與搭配方式」 | ✓ 片長在狀態行；說明影片對應「主線」一節，並給先看或後看兩種讀法。 |

## 中英一致

逐段比對改動處，數字、方法、路線中英一致；英文 tldr 與「How to read it」段同步改成「只缺第 22 講量子 ML 投影片」。

## 剩餘項目（非阻擋）

- zh L59／en L58：GAN 那一項可補半句 GAN Compression 的機制（蒸餾加 NAS 決定每層 channel 數），取代「影像在空間上重複」。
- 中文正文「講」與標題「堂」的用字一致性，屬系列層級決定（同第 1 輪）。
