# 研究筆記：Agent 隔離邊界（agent-isolation）

最後更新：2026-10-24（OpenAI 原文發布日 2026-10-23；發布不到 24 小時）

## 母群定義
「AI agent 在受限環境中跨隔離邊界通訊或外連」的公開一手紀錄：OpenAI 2026 年 7–10 月公開的四份文件。硬體／虛擬化層另取各隔離技術的官方文件與 2026 年學術預印本。

## 來源表（最終狀態）
| ID | 來源 | 讀取範圍 | 用途 |
|---|---|---|---|
| S1 | OpenAI〈Securing our frontier model training environment〉2026-10-23 https://openai.com/index/securing-our-frontier-model-training-environment/ | ✅ 全文（Groundlane web_content，you＋keenable 兩個擷取互相一致） | 系列主案例 |
| S2 | OpenAI Alignment〈An agent used DNS to reach an external chatbot〉2026-09-20 事件、09-25 更新 https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/ | ✅ 全文 | order 4 |
| S3 | OpenAI〈The Hugging Face incident and the road ahead〉2026-07 事件 https://openai.com/index/hugging-face-incident-and-the-road-ahead/ | 🟡 部落格前半（約 14k／57k 字元）；完整技術報告與 METR／Redwood 獨立報告未讀 | order 4 |
| S4 | Kata Containers 安全公告 GHSA-wwj6-vghv-5p64（CVE-2026-24834） | ✅ 全文 | order 1：容器→guest microVM，公告明寫不影響 host 與其他 VM |
| S5 | arXiv 2607.17518〈Isolation Failure From Shared Storage: … Page-Cache SCA Leakage Across Containers and VMs〉2026-07-20 | 🟡 摘要、引言、背景（HTML v2 前約 30k／80k 字元）；威脅模型、結果與結論章節 order 2、5 動筆前讀 | order 2、5：共用 host page cache 的訊號跨 Docker／gVisor／Kata／Firecracker 持續；direct I/O 與專用 block device 大幅衰減或消除 |
| S6 | Firecracker `docs/prod-host-setup.md` | ✅ 全文（raw.githubusercontent.com 直接下載），含 side channel、SMT、KSM、Rowhammer 小節 | order 1、5：Firecracker 自述「無法緩解 host 硬體弱點」「建議每個 Firecracker 行程只服務單一租戶」「noisy-neighbour page cache 會拖慢其他 guest」 |
| S7 | Ristenpart et al.〈Hey, You, Get Off of My Cloud〉CCS 2009 | 🟡 摘要與搜尋片段（含「以 cross-VM covert channel 驗證 co-residence」） | order 2 歷史前例；2009 年資料，時效靠 S5 補 |
| S11 | gVisor Introduction 與 Security Model（gvisor.dev/docs/architecture_guide/） | 🟡 Intro 前半、Security Model 至「What can a sandbox do?」；FAQ（VM 比較、硬體側信道）未讀 | order 0、1 |
| S12 | Firecracker `docs/design.md` | ✅ 全文 | order 0、1 |
| S13 | Kata `docs/design/architecture/README.md` | 🟡 概觀、環境、容器建立流程（輸出截斷） | order 0、1 |
| S14 | Docker Engine security | 🟡 前半（namespace、cgroup、daemon 攻擊面），capabilities 之後未讀 | order 0、1 |
| S8 | Spectre／Meltdown 官方頁 https://spectreattack.com/ | ❌ 未讀（只讀到 S1 對它的引用） | 動筆 order 2 前必讀 |
| S9 | PandaStack 部落格（SMT 與 microVM 隔離）2026-08/09 | 🟡 搜尋摘要；廠商文章，只當線索 | 不作為主張依據 |
| S10 | 二手報導（Startup Fortune、AlphaSignal、Unite.AI、daily.dev、wccftech 等） | 🟡 僅搜尋摘要 | 只用來比對轉述偏差，不當來源 |

## 對使用者貼文的逐句查證（S1 為準）
| 貼文說法 | 原文 | 判定 |
|---|---|---|
| 「報告」由 OpenAI 發布，模型含 GPT-6 Astra Cyber 與內部前沿模型 | 官方部落格〈publication〉，非論文／正式報告；原文：「including our upcoming GPT‑6 Astra Cyber model and an internal frontier model」，指整個紅隊行動，不是特定某個通道實驗 | ✅ 但範圍要限縮 |
| 「兩個 AI 代理」部署在不同虛擬機 | 原文：agents in separate microVMs（未寫兩個）；紅隊是「teams of agents」 | 🟡 數量原文未寫 |
| 無網路、無共享可寫檔案 | 「without the use of network connections or shared writable files」 | ✅ |
| 代理「自行摸索」出快取通訊協定 | 原文：「In most of these tests, we directed agents to investigate specific communication channels or provided them with a protocol」；只有一例僅給「廣泛的基礎設施弱點清單」，且未說是哪一種通道；快取實驗另寫「Once the agents agreed on a protocol」 | ⚠️ 過度推論：多數測試是被指定通道或給協定 |
| 快取：一方驅逐、另一方計時重載 | 同 | ✅ |
| 儲存 I/O 時序（連續寫入 vs 閒置）與 CoT「acoustic modem-like」 | 同；CoT 原文為 `Could create acoustic modem-like signal … using continuous writes vs idle.`（有省略） | ✅ |
| CPU 競爭「還原出二進位資訊」「排程器延遲與計算耗時」 | 原文只寫「competition for CPU time within a shared execution container」，無編碼細節 | ⚠️ 細節為轉述者補寫 |
| 「離線網頁環境的快取狀態以及 TLS 憑證快取」 | 原文只有「a TLS certificate cache in OpenAI's offline web infrastructure」 | ⚠️ 「快取狀態」無對應 |
| 「模擬機密數據」 | 「synthetic secrets」 | ✅ |
| 「業界相當悲觀」「薄如白紙」「防範惡意 AI 蠕蟲」 | 原文無此論述；原文反而寫：多數通道「carry information slowly and are difficult for models to exploit」、「We did not find a route to the internet that agents could trivially exploit while concealing their activity from our monitors」、發現數量隨紅隊進行「declined significantly」、已修補並於 10/1 恢復訓練 | ❌ 與原文語氣相反，屬編輯加料 |
| 傳統「軟體層面沙盒」被打破 | 通道來自共用硬體／服務（快取、儲存、CPU、TLS 快取）；同篇另有 microVM 逃逸（Kata、gVisor、Moby 的修補、Linux CVE）與外連路徑 | 🟡 方向對，但「旁路通道」與「逃逸」是兩件事，貼文混在一起 |
| 原文有但貼文沒提 | 紅隊拿到基礎設施原始碼、設定與弱點描述（對攻擊者有利的設定）；用隔離的專用副本；花了數千億 tokens；未揭露各通道的頻寬與錯誤率；決策：前沿訓練不接網際網路、用「offline world」；監控已加偵測 | 這些是讀者判斷嚴重度的關鍵條件 |

## 研究足夠的五關（目前狀態）
1. 一手來源：S1、S2、S4 全文 ✅；S3、S5、S6、S7 部分 🟡；S8 ❌（動筆前補）。
2. 證據類型：S1 是廠商自述的受控紅隊結果，沒有頻寬、錯誤率、重複次數，也沒有第三方複現；寫作時一律標「OpenAI 自述」。學術面以 S5 補「共用 host 狀態會漏」的實證。
3. 時效：S1–S6 皆 2026 年。
4. 反證：已搜「skeptic／critique」兩組，發布不到 24 小時，未找到獨立複現或批評（試過：Groundlane 英文／中文各一組，只回二手轉述）；原文自帶限制（慢、難利用、未見可隱匿外連）與 S5 的衰減條件（direct I/O、專用 block device）是目前可用的反向證據。各篇動筆前再搜 replication／limitations／noise。
5. 飽和：英文兩組＋中文一組完成；硬體側信道的現代防禦（Intel CAT、cache partitioning 等）尚未讀一手，order 5 動筆前補。

## 下一步補讀（依篇）
- order 1：gVisor 與 Kata／Firecracker 官方威脅模型頁。
- order 2：S8、S5 全文、Flush+Reload／Prime+Probe 原論文或可靠教學，S7 全文。
- order 4：S3 完整技術報告。
- order 5：S6 完整、S5 緩解章節、Linux 核心 hardware vulnerabilities 文件。
