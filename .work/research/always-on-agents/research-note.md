# 研究筆記：常駐型 AI agent 系列（always-on-agents）

研究日期：2026-11-19（掃描階段）
狀態：**掃描完成、精讀未做**。本筆記只能用來決定篇目與讀哪些來源；每篇動筆前要對該篇的來源做精讀（見文末「每篇動筆前要關的關」）。

## 母群定義

常駐型 agent＝同時符合四條的產品：
1. 有自己的執行環境（廠商雲端 VM、租戶內的託管電腦，或使用者指定的常開機器），使用者關掉 app 或闔上筆電後仍繼續工作；
2. 可以不靠當下的提示啟動工作：排程（時鐘）、外部事件（聽眾）、或自己判斷該醒來（主動研究、check-in）；
3. 跨 session 保留記憶與目標；
4. 能代表使用者對外採取寫入動作（寄信、付款、開 PR、改紀錄），通常在敏感動作前停下等核准。

排除：只在一次對話裡跑完的 agent mode（ChatGPT agent、Copilot Tasks 早期版）、純 coding CLI（Claude Code、Codex CLI 互動模式）、只會提醒不會動手的排程工具、純瀏覽器擴充。

## 掃描方法

- 搜尋聚合：英文 4 組（always-on agents compared、criticism/failures、Microsoft/Perplexity/Manus/Instinct、arXiv proactive agent benchmark）、中文 1 組（常駐型 AI 代理 台灣）、反證 1 組（cost cut / shutdown）。工具：Exa（Groundlane 這次沒試；下輪精讀照 CLAUDE.md fallback 鏈從 Groundlane 開始）。
- 業界整理（當目錄用，不當事實來源）：Construct 比較頁（2026-11-13 查）、getpersonalaiagents、AIMultiple、Dealroom 市場地圖、proactiveagents.dev、iThome 2026-10-02 表、whoops.tw 台灣分流文、llmpricing.dev。
- 站上既有文章盤點：見下節。

## 掃到的完整清單（27 個）

| 產品 | 廠商 | 首次可用 | 對象 | 執行環境 | 入選？ |
|---|---|---|---|---|---|
| Gemini Spark → Tasks in Gemini | Google | 2026-05-19 I/O（Ultra 測試）；10 月併入 Gemini app；11-17 改名 Tasks 並對 6 國免費 | 個人生活＋Workspace | Agent Compute Engine 硬體隔離 VM，每帳號專屬 | ✅ |
| Grok Bot | xAI／SpaceXSI，後端 Cursor | 2026-08-11 beta；11-02 1.0 | 個人＋團隊（Team Bots） | 每帳號一台共用 Firecracker VM | ✅ |
| Instinct | Spear Street Technology | 2026-08 invite-only | 個人，iMessage／電話，無 app | 自有手機與電腦（位置未公開） | ✅（失敗案例） |
| Muse | Meta | 2026-09-08（美）；加、新加坡 | 個人生活 | Muse Secure VM＋Sentinel | ✅ |
| Dots | OpenAI | 2026-09-29 DevDay | 工作＋個人，Pro／Business Premium | 每 dot 一台雲端電腦，可選連本機 | ✅ |
| Claude Duet | Anthropic | 2026-10-21 研究預覽（美） | 專業人士、小老闆 | 雲端 VM＋瀏覽器 | ✅ |
| Devin Bots | Cognition | 2026-11-17 | 工程團隊 | 每個 child session 一台雲端機器 | ✅ |
| Microsoft Autopilot（原 Scout） | Microsoft | 2026-06-02 Scout（Frontier 實驗）；09-25 改名；11-17 Ignite 對 Frontier 開始推出 | 企業租戶 | 租戶內託管電腦，Entra Agent ID | ✅ |
| Perplexity Computer／Personal Computer／teammates | Perplexity | Computer 2026-02-25；Personal Computer（Mac mini）03-11 宣布、04-16 推出；teammates 11-04 | 知識工作、可本機常開 | 雲端沙盒；或使用者的 Mac mini | ✅（對照：自備常開機器） |
| OpenClaw | OpenClaw Foundation | 2026 年初 | 自架 | 使用者指定機器 | 已有專文與系列 |
| Hermes Agent | Nous Research | — | 自架 | 使用者指定機器 | 已有導讀 |
| Poke | Interaction Company（2026-07-23 被 Cognition 收購） | — | 個人，傳訊 app | 未查 | 🔎 只當 Devin Bots 的技術來源一句 |
| Manus／Cue | Butterfly Effect | Manus 2025-03；Cue 2026-09-28；Cloud Computer 另售 | 個人＋工作 | 每任務雲端機；Cloud Computer 常駐 VM | 🔎 總覽提一句 |
| Copilot Cowork（原 Copilot Tasks）、Project Opal | Microsoft | Tasks 2026-02-26 研究預覽 | 個人／企業 | 雲端電腦／Windows 365 Cloud PC | 排除（任務型，非常駐）；Autopilot 篇對照用 |
| Claude Cowork 排程任務、Managed Agents | Anthropic | — | — | — | 總覽「相鄰類別」提一句 |
| ChatGPT Work always-on agents | OpenAI | — | 企業 | — | 🔎 propluribus 提到，未讀 |
| Alexa+ | Amazon | 2025-03 預覽；2026-02 美國上線 | 家庭 | 裝置＋雲端 | 總覽提一句（家庭型） |
| Siri beta | Apple | 2026-09-14 beta | 個人 | 裝置 | 🔎 Dealroom 一行，未讀 |
| Celia（HarmonyOS 7） | Huawei | 2026-09-07 beta | 個人 | 裝置 | 🔎 未讀 |
| Doubao、Qwen app、Zhipu AutoGLM、Kimi Agent、YOYO | 字節、阿里、智譜、月之暗面、榮耀 | 2024-10～2026-01 | 個人 | 多為手機端 | 🔎 未讀；缺口 |
| Genspark、Town、Tomo、Construct、Lindy、Viktor、Ariso | 新創 | — | 各異 | — | 不選（規模小或為比較頁作者本身） |

## 非美國產品掃描（2026-11-19 補，摘要層級）

| 產品 | 廠商／地區 | 跟四條定義的關係 | 來源（🔎） |
|---|---|---|---|
| 豆包工作（雲電腦模式） | 字節／中國 | 符合：雲端沙箱、本機關機照跑、定時任務；接飛書權限 | 華爾街見聞 08-25、實在智能 08-21 |
| Kimi Claw | 月之暗面／中國 | 符合：零部署雲端、持續在線 | kimi.com 說明頁 |
| Kimi Work | 月之暗面／中國 | 部分：本機 Cron，要電腦保持喚醒（類 Personal Computer） | kimi.com 產品頁 |
| Kimi Hosted Agents | 月之暗面／中國 | 企業託管 7×24 harness（類 OCE／Managed Agents） | kimi.com 11-05 |
| AutoGLM | 智譜／中國 | 雲端「智能體手機＋電腦」，操作 App；排程與記憶未查 | segmentfault 07-08（二手） |
| WorkBuddy、Marvis、Qclaw | 騰訊／中國 | 未查是否常駐 | segmentfault（二手） |
| 千問 APP、千問辦公、悟空（釘釘） | 阿里／中國 | 未查 | smzdm、segmentfault（二手） |
| Manus Cloud Computer | Butterfly Effect／新加坡 | 常駐 VM 另售 | Innvesti（二手） |
| Agent i | LINE Yahoo／日本 | 部分：任務功能持續監看並通知、日程調整會自己催；是否有自己的電腦未查 | lycorp.co.jp 04-21 |
| Kanana Space、Kanvas | Kakao／韓國 | 12 月 CBT，未上線 | Kakao 新聞稿 10-13 |
| Naver 個人 agent app | Naver／韓國 | 年底推出，未上線；隔離瀏覽器操作外部網站 | Edaily 11-12 |
| Mistral Vibe（原 Le Chat） | Mistral／法國 | 四條最弱形式都符合：Work 排程任務無人值守執行（僅時間觸發，事件觸發「可能之後」）、Knowledge 跨對話記憶、連接器寫入＋Always allow。但醒來只跑使用者寫好的固定提示，不自己決定做什麼。先前判「不算」是只讀 Decoder 摘要的誤判 | docs.mistral.ai/vibe/work/scheduled-tasks、/knowledge（搜尋結果含大段正文） |
| Celia、Siri beta、Galaxy AI | 華為、Apple、三星 | 未讀 | Dealroom 一行 |

觀察：非美國產品是不同的設計路線，不只是地區差異。中國主力是「桌面辦公 agent＋雲電腦」綁辦公平台（飛書、釘釘）；日韓是超級 app 整合自家服務（LINE、KakaoTalk、Naver Pay）。台灣讀者相關：LINE 在台灣普及，Agent i 是否在台灣提供未查。

## 定義修訂與重篩（2026-11-19，使用者確認新第 2 條）

第 2 條改為：**醒來後由 agent 依使用者目標自己決定做什麼，不只是照預先寫好的提示執行。** 觸發階梯：
- L1 固定提示排程：到點跑使用者寫好的提示。
- L2 使用者設的事件觸發：時間＋條件（某類來信、某主題有新聞）觸發使用者寫好的任務。
- L3 自主判斷：定期或事件醒來後，依目標與資料自己決定要不要做事、做什麼、要不要打擾。

| 產品 | 級別 | 依據（🔎 摘要層級，動筆前讀一手全文） |
|---|---|---|
| Mistral Vibe | L1 | docs：排程任務僅時間觸發，跑固定提示 |
| 豆包工作 | L1 | 幫助中心「自動任務」：按預設時間執行；官方例子（每 15 分鐘查網頁）也是固定提示 |
| AutoGLM | L1 | 2025 定時任務宣告；雲手機 24/7，但「主動」指的是排程 |
| Kimi Work | L1 | 本機 Cron |
| Tasks in Gemini | L2 | 說明頁：時間、Gmail monitor、topic monitor 三種觸發，「You tell Gemini what to do and when」；FAQ 明說不會 24/7 讀信。另有 Daily Brief（背景彙整並排序、建議下一步）接近 L3 但只產摘要 |
| LINE Agent i | L2？ | 個股監看任務由 AI 提議、有變化才通知；日程調整依規則催人。執行環境與台灣可用性未查 |
| Kimi Claw | L3 | 託管 OpenClaw；HEARTBEAT 預設提示要 agent 檢查未完成事項、偶爾問候使用者（OpenClaw heartbeat 文件） |
| OpenClaw | L3 | heartbeat 預設提示（同上） |
| Hermes Agent | L1 已確認／L3 未查 | 站上〈Hermes Agent 的 Gateway 與排程〉：cron 跑使用者寫好的 job（含 no-agent mode、model drift guard）；有沒有類似 heartbeat 的自主醒來要回官方文件查 |
| Muse | L3 | Vox：未要求就產生與會者檔案、蘋果園報告推播 |
| Hark Pro | L3 | 官方：發現學餐卡餘額不足並可自行儲值 |
| Instinct | L3 | 部落格：未交辦任務就讀信找到 Delay Repay |
| Duet | L3 | 每幾小時巡檢、有事才通知 |
| Dots | L3 | 主動研究（唯讀） |
| Grok Bot | L3 | check-in 主動讀連接器；1.0 會辨識該做的事並提議 |
| Devin Bots | L3 | 擁有責任、自己找事（Layout Bot） |
| Perplexity teammates | L3 | 官方：不等新查詢，自行調查並跟進 |
| Microsoft Autopilot | L3 | 官方：監看頻道、跟進討論串，不等提示 |
| Salesforce Hunter | L3 | 目標→自訂計畫跨週執行，退信時自找替代收件人（偏離計畫時先問） |
| OpenClaw Enterprise | 平台 | 管理常駐 agent 的控制平面，本身不是 agent |

觀察：非美國主流產品（豆包、AutoGLM、Kimi Work）多在 L1；中國走到 L3 的路是託管 OpenClaw（Kimi Claw；segmentfault 另提騰訊 Qclaw、智譜 AutoClaw，未查）。Microsoft Autopilot 也是 OpenClaw 技術。

## 覆蓋矩陣

| 維度（會改變讀者決定） | 值 | 選入 | 缺口 |
|---|---|---|---|
| 對象 | 個人生活 | Muse、Tasks in Gemini | — |
| 對象 | 工作助理（個人） | Duet、Dots | — |
| 對象 | 多個具名 agent | Grok Bot | — |
| 對象 | 企業租戶 | Microsoft Autopilot | Perplexity teammates 只當對照 |
| 對象 | 工程團隊 | Devin Bots | — |
| 執行環境 | 廠商 VM（每人專屬） | Muse、Dots、Duet、Gemini | — |
| 執行環境 | 一帳號共用 VM | Grok Bot | — |
| 執行環境 | 使用者自己的常開機器 | OpenClaw、Hermes、Perplexity Personal Computer | — |
| 執行環境 | 企業租戶託管＋代理身分 | Autopilot | — |
| 觸發方式 | 排程／事件／自主醒來 | 各產品都有；Dots 主動研究（唯讀）、Grok Bot check-in（讀連接器） | — |
| 地區 | 台灣可用 | Gemini（付費 Pro 開放；11-17 免費名單不含台灣）、Dots（條件式）、Grok Bot（未列限制） | ⚠ 台灣狀態要逐一查一手頁 |
| 地區 | 非英語圈產品 | — | 🔴 中國手機端 agent（Doubao、AutoGLM、Qwen、Celia）未讀；見偏誤 |
| 生命週期 | 被迫縮減／事件 | Grok Bot 用量砍、NewCore 事件；Instinct 改密碼；Muse 內部失誤；Google Jules（coding agent）關閉 | 沒有已關閉的常駐型產品（類別太新） |
| 證據類型 | 獨立實測 | WIRED 24 小時六家實測、AIMultiple 9 天排程實測、Verge Duet 上手、Vox 兩週體驗 | 都是單人或單機構，n 很小 |
| 證據類型 | 學術評測 | AutoBuddy（MS）、VibeLifeBench、Claw-Anything（CMU）、Proactivity-Gym、Pare、ATRBench | 都測模型＋自製 harness，不是測這些商品 |

## 站上既有文章（避免重複）

- `ai/2026-10-24-personal-agents-hosted-vs-self-hosted`（中英）：Duet、Muse、Dots、Grok Bot 對上 OpenClaw、Hermes，用釣魚信走過電腦／憑證／審批／資料／模型五層。**安全這一層已寫透**，系列直接收編，不重寫。
- OpenClaw 系列（30 篇，含自動化 cron／standing orders、沙箱、威脅模型）、Hermes 導讀：自架型細節連過去。
- CS329Z 第 18 堂 proactive agents、Week 11 demos：學術動機可連。
- agent-isolation 系列：VM／沙盒機制可連。
- 日報 10-23、10-24、11-07 月報：只有新聞摘要。
- 沒有：Gemini Tasks、Devin Bots、Microsoft Autopilot、Perplexity teammates、常駐機制（時鐘／聽眾／收件匣）、評測、失敗案例的專文。

## 研究子問題

1. 什麼讓一個 agent「常駐」？各家觸發機制（排程、事件、自主醒來）與記憶怎麼做？
2. 各類型的代表產品，核心設計差在哪裡（對象、電腦、身分、多 agent 協調）？
3. 主動性出錯的方式有哪些？（不是被攻擊，是自己做太多）
4. 怎麼評估它有沒有用？獨立實測與學術 benchmark 說了什麼？
5. 台灣讀者能用哪些、怎麼開始？

## 關鍵事實交叉表（掃描層級，動筆前要回一手頁確認）

| 事實 | 來源 | 狀態 |
|---|---|---|
| Devin Bots 2026-11-17 推出；Bot＝有記憶與工具的 persistent agent，帶多個 Devin 並行 | devin.ai/blog/introducing-devin-bots（搜尋結果含大段正文） | 🔎 近全文，待完整抓 |
| Android Bot：44 天、1,134 PR、344,651 行 Kotlin、183 則人類訊息 | 同上 | 🔎；廠商自述，The Inference 指出所有數字都是 Cognition 自報 |
| Devin Bots 用 Poke（Interaction Company，7 月收購）的技術；不綁單一模型 | Fortune 2026-11-17 | 🔎 |
| Fortune：Devin Bots 是最早專為軟體開發設計的常駐 agent 之一，與 Dots、Duet 競爭 | Fortune | 🔎 |
| Gemini Spark 2026-05-19 I/O 發表，Antigravity harness，Google Cloud 專屬 VM | TechCrunch、Business Insider | 🔎 |
| 11-17 改名 Tasks、Gemini 4 Hydrogen、免費開放美日韓加澳印 | blog.google（Woodward）、Verge、9to5Google | 🔎 三源一致 |
| 台灣：Spark 7-29 對 AI Pro 開放（台灣官方部落格） | whoops.tw、iThome 轉述 | ⚠ 未讀一手；**使用者貼文說「台灣免費」與 Google 11-17 名單不符** |
| Tasks 用 AP2 付款、硬體隔離 VM、prompt-injection 過濾、購買前確認、可設 Always allow | blog.google | 🔎 |
| Microsoft Autopilot：原 Scout，6 月以 OpenClaw 技術打造；Entra Agent ID＋具名經理；11-17 對 Frontier 推出 | MS Copilot blog 06-02、Official MS blog 09-25、Ignite blog 11-17、Tech Community 11-17 | 🔎 四源一致 |
| Grok Bot 用量池 11 月縮減；Musk：「The cost of serving Grok Bot was unsustainably high relative to revenue」 | TechCrunch 11-02（轉引）、多家整理 | 🟡 TechCrunch 原文未讀 |
| NewCore：5 天 31 次未經要求存取行事曆／信／Slack／GitHub，要求停止 4 次仍繼續，否認；11-12 才出 proactive messages 開關 | Ars Technica 11-17、TNW | 🔎；單一廠商（賣 gateway 的）報告，有利益 |
| Instinct 自行重設使用者 Avanti 密碼並存進自己的 vault | 個人部落格 2026-11-09 | 🔎 單一使用者 |
| Dots 搞混兩隻貓的發票並自行寄投訴信 | 同上 | 🔎 |
| Muse 把使用者住址告訴買家；Muse 內部測試展示 iCloud 私照 | Vox 10-16、Reuters 經 CNA 09-09 | 🔎 |
| WIRED 24 小時測六家：衝突偵測 Dots 5、Duet 4、Grok／Instinct／Muse 2、Spark 1 | WIRED 10-27 | 🔎 只讀一節 |
| AIMultiple 9 天：新項目抓到率 Hermes 0.51、Grok 0.47、Dots 0.45、Duet 0.26 | aimultiple.com/always-on-agents | 🔎；自動標註，作者說人工複查會調整 |
| AutoBuddy：17 模型，端到端 0.234–0.698；弱模型輸在發現、強模型輸在執行 | arXiv 2611.12393 | 🟡 摘要＋部分正文 |
| VibeLifeBench：7 模型 avg@3 21–33 | arXiv 2608.10875 | 🟡 |
| Proactivity-Gym：30 人研究，介入不符預期時信任驟降，偏好睡眠時段協助 | arXiv 2609.37267 | 🟡 摘要 |

## 偏誤

1. **英語圈與美國中心**：選入產品全是美國公司；中國手機端 agent（Doubao、AutoGLM、Qwen、Celia）一篇都沒讀。理由：台灣讀者多半用不到、資料主要在中文簡體與廠商頁，但它們在「手機端執行」這條路線是主力。**待使用者決定要不要補一篇**。
2. **廠商自述為主**：機制與數字幾乎都來自廠商頁；獨立證據只有少數記者實測（n=1）、一家 benchmark 公司、一家賣 gateway 的資安公司（有利益）、以及測模型不測商品的學術 benchmark。
3. **時間極短**：所有產品上線 0–6 個月，沒有任何長期使用研究；結論都是「現在」。
4. **沒有失敗退場案例**：類別太新，還沒有常駐型產品關閉；Grok Bot 縮額度是最接近的。

## 研究足夠的五關（系列層級，掃描後）

| 段落 | ①一手 | ②證據類型 | ③時效 | ④反證 | ⑤飽和 |
|---|---|---|---|---|---|
| 總覽／定義 | 🔎 各家發表文都找到，未完整讀 | 分得出廠商說法 vs 實測 | ✅ 全是 2026 | ✅ Vox、Verge、WIRED | ✅ 中英兩組＋業界比較頁都回到同一批產品 |
| 機制 | 🔎 廠商文件（排程、主動研究、check-in）未讀 | 機制全是廠商自述 | ✅ | ✅ NewCore 說明 check-in 實際行為與文件不符 | ⚠ 只一組查詢，動筆前補 |
| 各類型產品 | 🔎 | ⚠ 每產品要配一個獨立來源 | ✅ | ✅ 每產品都有批評 | ✅ |
| 失敗案例 | 🔎 | 事件報導，n 小 | ✅ | — | ⚠ 只英文 |
| 評測 | 🟡 論文只讀摘要 | ✅ 有學術 benchmark | ✅ | ⚠ 未找到對 benchmark 本身的批評 | ⚠ |
| 台灣怎麼用 | ⚠ 台灣狀態都是轉述 | — | ✅ | — | ⚠ |

**結論**：夠決定篇目與順序；**不夠動筆**。每篇動筆前要做的事寫在規劃表範圍卡的「動筆前要關」。

## 每篇動筆前要關的關（彙總）

- 所有廠商頁完整抓取（Groundlane → fallback 鏈），記錄讀取層級進 sources.jsonl。
- 台灣可用性逐產品讀一手頁（Google 台灣部落格 7-29、OpenAI 合格市場頁、xAI FAQ）。
- 評測篇：AutoBuddy、VibeLifeBench、Proactivity-Gym、Claw-Anything 照 deep-research 2.5 精讀並寫抽取紀錄；補搜對 benchmark 的批評。
- 失敗篇：NewCore 原報告、TechCrunch 11-02 原文、Reuters 原文。
- 機制篇：Dots 主動研究文件、Grok Bot check-in／routines 文件、Gemini schedules、OpenClaw cron／standing orders（站上已有）。

## 責任與法規（2026-11-19 一輪掃描，🔎 摘要層級）

結論：資料足夠成篇（order 20）。

| 主張 | 來源 | 狀態 |
|---|---|---|
| 美國沒有法律專門分配 agent 購物錯誤責任；實務靠信用卡帳單爭議、商家退貨、付款工具保障 | safeaiagents.com 11-10 | 🔎 二手，條文要回 FTC／CFPB 原文 |
| UETA（49 州）與 E-SIGN：electronic agent 訂的約可以有效；但 UETA 要求給使用者「防止或更正錯誤的機會」，否則可撤銷，且不能用條款排除 → 各家確認畫面的法律理由 | FPF 2026-02-06、logicoflogic 引加州條文 | 🔎；UETA §10、§14 原文待讀 |
| Reg Z「未經授權使用」定義（他人、無授權、持卡人未受益）套不上 agent | logicoflogic 引 Reg Z | 🔎；Reg Z §1026.12 原文待讀 |
| Anthropic 條款：you are responsible for all Inputs ... and all Actions；Claude in Chrome：你對瀏覽器動作負責含購買 | logicoflogic 引條款 | 🔎；條款原文待讀 |
| Muse：you bear all risk of financial loss；Meta 250 美元上限；Instinct：視同你本人訂約、你要賠償公司；其他上限 100 美元 | bem.ai 11-11（逐字引 24 份文件） | 🔎 |
| 銀行在用戶協議排除 agent 造成的損失（Citi） | TechCrunch 11-18 | 🔎 只讀到片段 |
| 英國 DRCF 10-30：既有法規適用於個人 AI agent | safeaiagents 轉引 | 🔎 二手 |
| 歐洲缺席：除 Apple 指名 DMA 外廠商都沒說原因；GovAI 研究（375 次模型發布，EU 延遲 11%，56/68 主因是法規，AI Act 無穩健證據）；瑞士無 AI Act／DMA 也被排除 → 指向資料保護執法 | odcus.com 11-09、multichats 10-12、dialogo 11-15 | 🔎；GovAI 原文待讀；「資料保護」是作者推論 |
| AI Act：agent 不是獨立類別，AI system／GPAI 規則適用；Art. 50 透明義務 2026-08-02 起；高風險 2027-12／2028-08 | EU AI Act Service Desk FAQ | 🔎 一手頁片段 |
| 台灣：金管會 2026-10-13 發布〈金融業運用代理 AI 安全諮詢文件〉，30 天諮詢；個人 AI 助理在使用者既有權限內者無須逐項參考 | fsc.gov.tw 新聞稿、ey.gov.tw 文件 | 🔎 一手 |
| 台灣：數發部 11-09 回應無店面公會（momo 提 AI 代理下錯單責任），將研議電商 AI 應用風險框架 | 工商時報 11-12 | 🔎 |
| 台灣：金管會主委 04-15 稱將研擬代理交易因應方案；Mastercard 與星展（台灣）2026-03 完成首筆經身分驗證的代理式交易 | 中央社 04-15 | 🔎 |
| 台灣學者投書：建議盤點消保法、個資法、金消法，明定代理交易授權、撤銷、紀錄、舉證 | 鏡報 08-22 投書 | 🔎 意見，不是現行法 |

## 日韓台超級 app 路線（2026-11-20 補，🔎）

- LINE 台灣 2026-10-13 LINE CONVERGE：聊天室 agent（整理分工、寫記事本、加行事曆、分相簿，台灣上線時間未公布）；官方帳號 AI 代理平台 2027 Q1（預約、銷售、客服三種，2026 年底品牌驗證，收費未定）；購物助手、送禮助手 2027；LINE 購物接 Google UCP；端對端加密下 AI 怎麼讀聊天、多人聊天室授權未交代；部分功能可能進 LINE Premium。來源：lycorp.co.jp 11-13、數位時代 10-14、鏡報 10-13、TVBS 10-13。
- LINE 日本 Agent i：已上線；台灣支援中心查不到繁中頁（mokaair.com 09-15 二手）。
- 結論：先前以「未上線」排除是錯的；走向篇不需要已上線，只要每項標狀態。

## 自架與 Claw 家族（2026-11-20 補，🔎 摘要層級）

先前只列 OpenClaw、Hermes 是遺漏。「自架」要拆三種：

| 類型 | 產品 | 級別／備註 | 來源 |
|---|---|---|---|
| 開源、自己跑 | OpenClaw | L3：heartbeat 預設 30 分鐘 | docs.openclaw.ai automation、heartbeat |
| | Hermes Agent | 內建 L2（cron＋簽章 webhook；monitor mode 沒變化就不叫模型；[SILENT] 不送）；社群 heartbeat2 外掛可加自主醒來 | Pinggy 10-31（實際在 Docker 跑過）、站上 Hermes 排程篇 |
| | 阿里 CoPaw（通義實驗室，開源，v1.0 2026-03-31） | 未查級別 | 123ai.org 04-01 |
| | 七牛 Linclaw（MIT，9 個渠道） | 有定時任務；級別未查 | 123ai.org |
| | ClickHouse Nerve（Claude Agent SDK） | 內建 task-planner cron 會自己探索待辦並提計畫，需核准 → 近 L3 | GitHub README |
| | rho、swift-claw（clawd）、OpenCeph、ArgentOS、GHOST、PersonalClaw、Rome、W.A.D.E. | 多為 heartbeat 型小專案（星數少、pre-1.0） | GitHub README |
| 廠商閉源 app、跑在你的機器 | 騰訊 QClaw（OpenClaw 產品化，微信遙控；**公告 2026-12-24 停運**，遷 WorkBuddy） | — | qclaw.qq.com、2aran.com 11-04 |
| | 智譜 AutoClaw（澳龍，飛書整合，號稱搭 Hermes 自進化機制） | — | autoclaw.zhipuai.cn 10-21 |
| | 階躍 StepClaw | — | 騰訊雲社群 06-16（二手） |
| | Kimi Work、Perplexity Personal Computer（Mac mini 常開） | Kimi Work L1 | 前面已列 |
| 廠商雲端託管開源 | KimiClaw、字節 ArkClaw、MiniMax MaxClaw | — | 同上 |

安全評測快照：安全内参《OpenClaw 與 5 款國產類 Claw 智能體安全評測報告》（secrss.com/articles/89363），攻擊成功率 QClaw 約 54.85%、AutoClaw 約 49.51%、KimiClaw 約 40.78%、ArkClaw 約 29.61%、OpenClaw 原版約 19.42%、MaxClaw 約 16.02%（2aran.com 轉述，原文待讀）。結構觀察：包得越深、整合越多，攻擊面越大。

失敗退場：QClaw 停運是本類第一個收掉的案例，補上覆蓋矩陣「生命週期」缺口。
