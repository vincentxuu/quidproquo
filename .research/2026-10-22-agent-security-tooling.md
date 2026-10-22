# Research: AI agent / skill / MCP 資安工具生態（四層比較）

研究日：2026-10-22。方法：4 個 agent 分層精讀（各層詳細紀錄見 `2026-10-22-agent-security-tooling/` 內四份檔案），我再抽查關鍵數字回原文。全程只讀資料，沒有安裝或執行任何被研究的工具，也沒有掃描任何目標。

標記：【自述】作者自己說的；【第三方】獨立報導或研究；【實測】讀原始碼確認；[推論] 我的判斷。

## 子問題
1. 每個工具實際做什麼（偵測規則、檢查對象、輸出）？
2. 威脅模型與覆蓋範圍，對照 OWASP Agentic Top 10 到哪裡？
3. 已知限制、誤報漏報、繞過與第三方批評？
4. 成熟度與可信度（維護者、更新、授權）？
5. 四層如何互補、各適合什麼情境？

## 一句話結論
- 四層測的是**不同的東西**，不是同類產品：審計 skill 審「你的程式碼」，掃描器審「你要裝的 skill／MCP」，執行期治理管「agent 執行時做什麼」，紅隊工具則分兩派，一派用 AI 打傳統軟體，一派打 AI 本身。
- **沒有任何一層有中立的準確率數據。** 每個公開數字都來自作者自己或有利益關係的競品。
- **第 2 層掃描器全部被第三方繞過過**（含 Cisco 與 NVIDIA），不能當唯一防線。
- 微軟 toolkit 的「涵蓋 OWASP 10/10」是行銷用語，repo 自己寫的是 **7 Full、3 Partial**，且自稱內部自評。
- **HexStrike-AI 本身是風險**，不是防禦工具（見下）。

## 讀取完整度盤點（彙總）
各層逐項來源表在附檔。彙總規則：只有「整份讀完」才算 ✅；關鍵字搜尋或只讀前段一律 🟡。

| 項目 | 程度 | 說明 |
|---|---|---|
| Cloudflare 部落格全文 | ✅ | 我自己重抓並核對引文 |
| Cloudflare SKILL.md、ATTACK-CLASSES、CLOUD-AND-DEPLOYMENT | ✅ | 其餘 12 個附檔只做關鍵字搜尋 🟡 |
| trailofbits 各 plugin 的 SKILL.md | 🟡 | 多數只讀前 1/5 到 1/2 |
| SkillSpector／Cisco／AgentSeal README | ✅ | 原始碼為片段 🟡；已本機 clone 讀碼 |
| Cisco measured-results.md | 🟡 | 約前 330 行；7.7% 我已回原文核對 |
| Trail of Bits、Adversa 繞過研究 | 🟡 | 各讀到約 12k、16k 字元處被截斷 |
| AGT README、LIMITATIONS、OWASP 對照文件 | ✅ | MCP 規格 §7 之後、ACS 決策引擎本體未讀 🟡 |
| OWASP Agentic Top 10 官方 PDF | 🟡 | 只經 SlideShare 鏡像取得前 10 萬字元：10 項名稱齊全，但 ASI02–05、07、09 的完整定義未取得 |
| Strix、PyRIT、HackAgent README 與文件 | ✅ | PyRIT 論文與 HackAgent 白皮書只讀摘要 🟡 |
| HexStrike server 原始碼（734KB） | 🟡 | 只做 grep 式閱讀；關鍵行我已自行核對 |
| Reddit r/netsec Strix RCE 貼文 | 🔴 blocked | 四個工具皆失敗，不作依據 |

## 四層總覽

| 層 | 工具 | 做法 | 公開準確率 | 主要限制 |
|---|---|---|---|---|
| 1 審計 skill | cloudflare/security-audit-skill | 純 LLM 六階段多代理＋對抗驗證＋2 支 JSON 驗證腳本，不呼叫 Semgrep／CodeQL | 無；自述單次只找到約一半 | 無 Workers／D1／KV／Astro 專屬檢查；token 成本高 |
| 1 | trailofbits/skills（約 50 個 plugin） | Semgrep／CodeQL 腳本＋LLM 判斷的混合 | 無 | 同樣無 Workers／Astro 檢查；supply-chain 審計器不讀 pnpm-lock |
| 2 安裝前掃描 | NVIDIA/SkillSpector | 規則＋AST＋taint＋YARA，LLM 可選且只升不降 | 無自家評測；有第三方誤報 issue | 被 Adversa 繞過；規則數文件間不一致 |
| 2 | cisco-ai-defense/skill-scanner | 規則極輕，實務靠 LLM judge | 自述：規則單獨 recall 7.7%；加 LLM 後 66.7%／FPR 15.4% | 被 Trail of Bits 與 Adversa 繞過；大檔可逃過語意階段 |
| 2 | getagentseal/agentseal | regex＋去混淆＋嵌入模型 | 無 | `scan-mcp` 會啟動目標 server；FSL 授權；4 個月沒更新 |
| 3 執行期治理 | microsoft/agent-governance-toolkit | 函式庫＋hook；MCP 閘道全是啟發式 | 無獨立稽核 | Public Preview；未載入政策時預設放行；自承同行程邊界 |
| 4 紅隊（打傳統軟體） | usestrix/strix | AI agent 迴圈＋Kali 容器 | 自述 96%（CTF）；Escape 實測 1/20 | 範圍限制靠自然語言；有 prompt injection 反控的研究 |
| 4 | 0x4m4/hexstrike-ai | LLM 經 MCP 呼叫 150+ 工具 | 98.7% 等數字無方法說明 | 伺服器無驗證且可執行任意指令（見下） |
| 4 紅隊（打 AI 本身） | microsoft/PyRIT | 攻擊者模型＋converter＋scorer | 無偵測率 benchmark | 測的是模型回應，不是 agent 實際行為；PyPI 仍標 Alpha |
| 4 | AISecurityLab/hackagent | campaign＋攻擊目錄＋judge 模型 | 無獨立 benchmark | 小專案（528 ⭐）；judge 誤判率無公開數字 |

## 事實交叉表（只放「來源說了什麼」）

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| Cloudflare skill 不用 Semgrep：Hunter 一個月呼叫 0 次 | Cloudflare 部落格原文（我重抓核對） | 檔案樹只有 .md 與 4 支 .cjs | ✅ |
| Cloudflare 單次只找到多次總和約一半，且不聲稱假陰性率 | 部落格原文（核對） | README | ✅ |
| Cloudflare 內部 harness 驗證拒絕率 40%→11%，20,799 候選→約 12,057 存活 | 部落格原文（核對） | — | ✅ 限內部 harness，非公開 skill |
| Cisco 規則單獨 recall 7.7%、FPR 4.0% | Cisco README（我 grep 核對） | measured-results.md | ✅ 作者自述 |
| SkillSpector「從不執行被掃描的 skill」 | README 第 989 行（核對） | docs.nvidia.com | ✅ 自述 |
| AGT 自評 7 Full、3 Partial，且為內部自評 | 對照文件第 45、12 行（核對） | README 徽章 | ✅ |
| AGT 對外宣稱「10/10」 | repo 描述（GitHub API 核對） | 發表文 | ✅ 與上一列並存，是用語差異 |
| HexStrike `/api/command`、`shell=True`、`app.run(host="0.0.0.0")`、範圍為空時預設放行 | 我自行抓原始碼 grep：第 9137、5274、17289、13374 行 | issue #224 | ✅ 讀碼確認，未執行 |
| HexStrike 被地下論壇討論用於攻擊 Citrix 漏洞 | Check Point（措辭為 claimed） | 其他媒體多為轉述 | ⚠️ 只證明「有人討論」，不證明有效 |
| NVIDIA/SkillSpector 歸屬 NVIDIA 官方、20.8k ⭐ | GitHub API、docs.nvidia.com | NVIDIA 官方部落格 | ✅ 歸屬與星數屬實；成長曲線 ⚪ 無法驗證 |
| 微軟 toolkit 套件數 | 發表文與 Socket：7 | repo README 表：9；PyPI：5；目錄：26 | ❌ conflict（層次不同，非單純矛盾） |
| PolicyLayer：微軟 toolkit「完全看不到 MCP」 | PolicyLayer 全文 | repo 有 mcp_gateway.py、mcp_security.py 與 1970 行規格 | ❌ conflict，以 repo 為準；但「是函式庫而非獨立 proxy」部分成立；PolicyLayer 是競品廠商 |
| 第三方繞過了 Cisco 與 NVIDIA 掃描器 | Trail of Bits（只測 Cisco） | Adversa（測八個，含兩者；LLM judge 關閉） | ✅ 但兩者測試版本較舊，現行版本未被重測 |

## 我的推論（與上表分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| 「規則存在」不等於「有效偵測」，掃描器只能當輔助篩選 | 兩份獨立繞過研究；Cisco 自承規則 recall 7.7%；Adversa 自己預測在 77 格中錯 53 格 | 繞過測試多在較舊版本且 LLM 關閉；SkillSpector 後來新增了相關規則，沒人重測 |
| Strix 的 96% 與 Escape 的 5% 不能互相推翻 | 題型（CTF vs 多漏洞 API）、模型、版本、單次運氣皆不同 | 可能有我沒看到的第五個變因 |
| 微軟 toolkit 的 OWASP Full 評級在 ASI01／03／05／10 偏樂觀 | 對照它自己的 LIMITATIONS 與證據檔內容 | 我只讀了片段，ACS 決策引擎本體不在 repo 中，未讀 |
| 這四層的星數主要反映話題度，不是成熟度 | Strix 70.8k 與 PyRIT 4.7k 差 15 倍；Cloudflare repo 只有 14 筆 commit 卻有 36.5k ⭐ | 沒取得星數時間序列，不能判斷是否自然成長 |
| 對 quidproquo：審計價值最大的是通用類別（存取控制、SSRF、機密外洩、AI／LLM 類別），不是 Workers 專屬 | 兩個審計 skill 皆無 Workers／D1／KV／Astro 規則 | 只做了關鍵字層級的 grep，沒逐行讀完附檔 |

## 草稿骨架

### 核心概念
這四層分別回答四個問題：我的程式碼有洞嗎？我要裝的 skill 安全嗎？agent 跑起來時誰來管？我的系統打得穿嗎？它們不是同一種工具，也不互相取代。

### 關鍵設計決定
- Cloudflare 放棄靜態分析、改走純 LLM 讀碼，理由是 agent 自己不愛用 Semgrep。Trail of Bits 反過來以工具為主。兩種取向在公開資料中都沒有準確率可比。
- 掃描器的共通取捨：規則便宜但容易被改寫繞過，LLM 判斷較強但會被「說服」、成本高，大檔還可能直接跳過語意階段。
- 微軟 toolkit 選擇做「函式庫＋hook」，而不是獨立 proxy，所以必須嵌進應用程式或 agent 框架。

### 跟替代方案的比較
見「四層總覽」表。

### 適合／不適合
- 審計 skill：適合當一次性基準審計；不適合當每次 PR 的閘門（成本高、Cloudflare 自己也把大掃描當定期作業）。
- 掃描器：適合安裝前篩選；不適合當唯一防線。
- 執行期治理：適合自己開發 agent 產品的團隊；對只是「使用」Claude Code 的個人網站，效益有限。
- 紅隊：只能對自己擁有或有書面授權的目標；HexStrike 不建議使用。

### 限制
所有準確率數據皆為作者自述或競品所測；沒有中立同台評測。

### 取捨總結
把每一層當成「減少風險的一道網」而非保證。最便宜的組合是安裝前掃描加自己審計一次。

## 待解問題（結案狀態）

| 項目 | 狀態 | 說明 |
|---|---|---|
| SkillSpector 星數成長是否自然 | ⚪ 確認無公開資料 | 試過 GitHub MCP、gh、star-history 頁（只有 title）、curl；未用瀏覽器看 star-history 圖 |
| SkillSpector「87% precision」出處 | ✉️ 需問 NVIDIA | README 無；只有 Help Net Security 與 CSA 轉述 |
| OWASP ASI02–05、07、09 的完整定義 | ⚪ 官方頁與 PDF 直連被 403 | 試過 Groundlane、jina、Exa、firecrawl（額度用盡）、SlideShare 鏡像（截斷在 10 萬字元）；補法：分段取 SlideShare 後半，或有人直接下載 PDF |
| Cisco 與 SkillSpector 的 OWASP 編號（ASI16、LLM 2026 編號）是否官方 | ✉️ 需讀 OWASP 原文 | 與 agent 所知 2025 版不一致，未判對錯 |
| Cloudflare skill 是否持續維護 | ✉️ 只能問人 | 14 筆 commit，最後 push 2026-09-14，issues 持續進來；可寄 README 公開的 security-ai-research@cloudflare.com |
| HexStrike issue #224 為何關閉 | ✉️ 只有擁有者或提報者知道 | 0 留言、無修補 commit |
| Strix 對 prompt injection 反控研究的官方回應 | ✉️ 需問 Strix 團隊 | 目前只有研究者轉述；研究對象為 0.4.0，現行 v1.7.0 是否仍存在未知 |
| AGT 7↔9 套件的轉折日期、基金會狀態、SUPPORT.md | ⚪ 淺 clone 追不到／未讀 | |
| AgentSeal 營運者身分與第三方評測 | ⚪ 確認無公開資料 | |
| 使用者給的 Strix 連結是否就是 usestrix/strix | ✉️ 請你確認 | agent 只確認該 repo 存在且名稱吻合 |

## 過程備註（降級與範圍）
- GitHub MCP 被 session 限制在本 repo，各 agent 改走 Groundlane、curl raw 檔案，或 `add_repo` 後淺 clone。第 2、3 層的 agent 用了 `add_repo` 加入掃描器與微軟 toolkit 的 repo（唯讀）。
- Firecrawl 額度在研究中用盡，其餘工具未受影響。
- 本筆記沒有 `sources.jsonl`：各層檔案內有逐來源的讀取程度表，但未轉成 jsonl 格式。
- 附檔（均為各層 agent 的完整原始紀錄）：`2026-10-22-agent-security-tooling/layer1-audit-skills.md`、`layer2-skill-scanners.md`、`layer3-runtime-governance.md`、`layer4-red-team.md`。
