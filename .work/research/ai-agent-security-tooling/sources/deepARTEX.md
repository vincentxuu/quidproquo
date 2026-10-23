# ARTEX 深讀：AI 自主滲透測試系統與其被濫用事件

研究日期：2026-10-22。完成度：**大致完成，BSRC 比賽官方公告原文未讀到（見 §2）**。
標記：[一手] 當事廠商／官方自述或自有遙測；[二手] 轉述或彙整；[推論] 我的判斷，非任何來源明說。
全程只讀文字（網頁、README、GitHub API 的 metadata），沒有安裝、執行、下載 ARTEX 或任何分叉的二進位檔或 release 附件，沒有對任何目標做掃描。IOC 以外不列可複製的攻擊步驟。

---

## 0. 結論先行（給主寫作 agent）

1. ARTEX 的濫用有**多家廠商層級證據**，與 HexStrike（Check Point 單一來源、措辭 claimed）的證據強度不同級。但這些證據大半來自「攻擊者自己外流的工件」（開放目錄、設定檔、對話紀錄）與「ARTEX 控制台特徵字串」，不是受害端的完整鑑識。
2. 韓國銀行案與微軟報告的 Storm-0940 案是**兩個不同的行為者**。前者微軟沒提，CrowdStrike 說「未歸因、中文使用者、財務動機（moderate confidence）」；後者微軟說「中國國家級關聯」，且微軟文中**沒有公開說明它如何辨識出該活動用了 ARTEX**（IOC 全是 IP 與通用 User-Agent）。
3. 「防濫用設計」存在，但全是操作者可改的預設值，而且 README 的使用限制比一般認知更極端（禁止對任何線上系統測試，連自有資產都禁）。「閉源」只擋官方更新，不擋已散布的程式碼；閉源後 12 天內分叉、改名、續更版本全面出現，微軟報告的活動（10/10-16）就發生在閉源之後。
4. 站內有數處說法比一手來源更肯定或與之矛盾（§7），其中最硬的兩處：10/17 日報把「至少 16 家金融機構」歸給 CrowdStrike；10/08、10/09 把具體銀行名稱（新韓、KB、韓亞）直接綁到 CrowdStrike 的 ARTEX 結論，但 CrowdStrike 全文沒點名任何銀行。

---

## 1. 時間線（每個節點的來源）

| 日期（2026） | 事件 | 來源與等級 |
|---|---|---|
| 7/26 | 作者 Autumn-27 首次 commit 並發 v0.1.0；7/27 在 ruanyf/weekly 發自薦 issue；AGPL-3.0 | piyolog（彙整，引 GitHub commit 歷史與 issue，[二手] 但引用可查）；technology.org 說 7/26 上 GitHub、AGPL-3.0 |
| 8/5 起 | 百度 BSRC「Agent+」攻防能力挑戰賽線上賽，150+ 隊；8/16 線上靶場，ARTEX 67.83 分第 7 | cn-sec 轉載的微信文章 [二手]；piyolog 引 BSRC 公告 [二手] |
| 9/3 | 成都總決賽，8 隊，ARTEX 奪冠（50% 靶場 + 50% 作品評審；TSecBench 89.78 第 6、Agent+ 靶場第 7，綜合第 1） | cn-sec 5418792 [二手，作者自述式文章]；ThreatBook 官方部落格也寫「Sept 3 … won the championship」[一手但利害關係方]；gm7 搜尋摘要稱前三名 ARTEX、Cruiser、炒米線 [二手摘要]；**BSRC 原文四個工具都讀不到** |
| 9/17 | v0.3.12：記錄代理預設只聽 localhost | piyolog 引 CHANGELOG（已下架，無法複核）[二手] |
| 9/18-19 | README「許可與免責聲明」整理、採 AGPL-3.0；v0.3.13：登入前免責勾選、預設遮罩 .gov/.edu 等、任務級黑白名單 | piyolog [二手]；securitypointbreak 同說 9/19 blocklist+disclaimer |
| 9/18 起 | Yegaram 儲蓄銀行已有存取痕跡（Genians 表；與 ARTEX 的連結未見） | Genians 報告 [一手彙整，自述未接觸受害端日誌] |
| 9/27-30 | KB 國民（9/27 起）、新韓（9/28 18:04 起，9/29 09:30 發覺）遭入侵 | Genians 報告；Reflectiz 時間表（引 SBS）[二手] |
| 9/24 | v0.3.14 為 GitHub 最後一個 Release | piyolog [二手] |
| 10/1-2 | 新韓公告外洩；金融監督機構現場檢查 | Genians；Reflectiz [二手] |
| 10/2 | Genians 文鍾賢（Moon/Mun Jong-hyun）在 LinkedIn 指出攻擊用 web server 的 HTML title 含「ARTEX-自主渗透测试控制台」 | BigGo 10/2 報導 [二手]；piyolog [二手]；Genians 10/12 報告確認自己抓到登入頁與頁面原始碼 [一手] |
| 10/3 | Team Cymru Research 發文：ARTEX 在 52 台 host 上跑（皆兼作 LLM API 中繼站） | piyolog 轉述 [二手] |
| 10/4 | 金融保安院長：「IP 上有 ARTEX 痕跡」，但「沒有直接看到 agent，無法確定」 | piyolog 引 Money Today [二手]；Reflectiz 引美國銀行家：FSI 官員稱 AI「並非沒有人類介入而獨立行動」[二手] |
| 10/6 | 警方轉正式偵辦，網路恐怖偵查隊 28 人；總統稱「已出現使用 AI 的跡象」 | Genians；Reflectiz [二手] |
| 10/7 | **CrowdStrike 發布**；同日 Autumn-27 commit「定版 0.3.15」；上游被 Software Heritage 存檔 | CrowdStrike 本文 [一手]；Hinln/ARTEX commit 歷史（GitHub API，我自己讀到，e6ec569…，作者 Autumn-27，2026-10-07T12:54Z）[一手 metadata]；piyolog [二手] |
| 10/8 | Autumn-27 於個人檔案頁發「ARTEX 安全聲明」：不再更新、轉閉源、不發版、不維護；聲明未直接提韓國事件 | THN 引述全文片段 [二手但為原文引用]；JoongAng、technology.org 同；原聲明頁面本身讀不到 |
| 10/8 | Telegram @[某帳號，已省略] 發文否認 | THN（引其 Telegram 貼文）[二手] |
| 10/8-9 | Hinln/ARTEX 建立（10/8 11:00Z，完整保留歷史，v0.3.15 備份）；上游 repo 與 Docker 鏡像 404 | GitHub API [一手 metadata]；BigGo 10/10；Genians |
| 10/9 | Logpresso：[某帳號，已省略] 是 GodNet/VITAS（DDoS 租用團）社群管理員之一；該中國籍人士稱手機號碼被盜用；Logpresso 評估「難以斷定是單一個人」 | Logpresso 本文 [一手]；JoongAng 轉述 |
| 10/12 | Genians 報告 | Genians [一手] |
| 10/14-15 | AhnLab ASEC：ARTEX 暴露實例 600→約 900 IP；在其中發現含攻擊痕跡的開放目錄；仿製版興起（ScopeWeaver、Tangora PTaaS、Horda、Meze、AegisLoop、Bob Research Labs/REAPER） | ASEC #95845、#95875 [一手] |
| 10/15 | ThreatBook 官方部落格：開源版 ARTEX 是其員工（RedAgents.ai 產品負責人）的個人專案；推出閉源企業版 ARTEX Pro；承認舊公開版「缺乏內建安全控管，建議僅用於測試環境」 | ThreatBook 本文 [一手，利害關係方]；BigGo 10/16 報導 CEO 薛鋒說法 [二手] |
| 8/17 起 | Recorded Future（TAG-217）：同一行為者 8/17 就在測基礎設施，另有加密貨幣挖礦平台工具、iPhone/Android 測試環境 | Recorded Future 本文 [一手] |
| 10/10-14 | Microsoft 觀測：Storm-0940 基礎設施 144.172.64.99 對 8 個組織 327 個帳號密碼噴灑，15.1 萬+ 失敗登入，無成功 | Microsoft 本文 [一手遙測] |
| 10/15-16 | 公開報導 ConnectWise Cloud Backup（前 SkyKick）遭入侵；ConnectWise 10/16 首份公告 | ConnectWise 狀態頁 [一手] |
| 10/21 | Zscaler ThreatLabz 發布全球性 AI 輔助攻擊分析；**Microsoft 發布 Storm-0940 + ARTEX 報告** | Zscaler [一手]；Microsoft [一手] |

備註：piyolog 把「v0.3.15 tag 在 10/7」與「GitHub Release 停在 v0.3.14」並列；我在 Hinln 鏡像 commit 歷史看到 10/7 的「docs(changelog): 定版 0.3.15」，一致。

---

## 2. 來源表與讀取程度

讀取方式：Groundlane web_fetch 為主（本次全部成功，回傳 `truncated:false` 者為整篇主文）；我**沒有把全文另存本機檔**，全文是在對話內容中完整讀過。「字元」欄為工具回報的原始頁面 bytes（含網站雜訊），不是主文長度。

| # | 來源 | 讀取 | 備註 |
|---|---|---|---|
| S1 | Microsoft Security Blog 2026-10-21 | **全文**（330KB 原頁，主文與 IOC、KQL、MITRE 全讀） | [一手] |
| S2 | CrowdStrike blog | **全文**（170KB 頁） | [一手] |
| S3 | The Hacker News（韓國）| **全文** | 其「the cybersecurity company」= CrowdStrike，明文連結 |
| S4 | The Hacker News（Storm-0940）| **全文** | 另含 Recorded Future、Zscaler 引述 |
| S5 | technology.org 10/9 | **全文** | [二手]，無獨立調查 |
| S6 | securitypointbreak 10/7 | **全文** | [二手]，含 Alt Security CEO 評論與 release note 引用（v0.3.8/10/13）|
| S7 | BigGo 10/2（Genians 發現）、10/10（閉源）、10/16（商業化）| 三篇**全文** | [二手]，來源為韓媒 |
| S8 | Genians 10/12 報告 | **全文** | [一手]（但自述未接觸受害端日誌）|
| S9 | Recorded Future TAG-217 | **全文** | [一手] |
| S10 | Zscaler ThreatLabz | 主文**全文**（頁面萃取移除部分導覽）| [一手] |
| S11 | AhnLab ASEC #95845、#95875 | 兩篇**全文** | [一手] |
| S12 | Logpresso 10/9 | **全文** | [一手] |
| S13 | ThreatBook 部落格 10/15 | **全文** | [一手，利害關係方] |
| S14 | ConnectWise 狀態頁（10/16-10/21 全部更新）| **全文** | [一手] |
| S15 | The Register 10/22 | 主文**全文** | [二手] |
| S16 | BleepingComputer 10/10 | 主文**全文**（頁面萃取移除部分）| [二手] |
| S17 | Reflectiz 部落格 | **全文** | [二手，且為賣 agentic pentest 產品的廠商部落格；整理表格有用，採用其「引 SBS/Korea Times」的內容時只當線索] |
| S18 | piyolog 彙整 | **全文** | [二手彙整，引 26 筆來源，是這次最完整的時間線；其中 CHANGELOG/Release 頁已下架，我無法複核] |
| S19 | cn-sec 5490221（架構拆解）、5418792（賽果）| 兩篇**全文** | [二手，中文自媒體轉載；5418792 的賽果數字出自作者文章，未見 BSRC 原文] |
| S20 | Korea JoongAng Daily 10/10 | **全文** | [二手] |
| S21 | Autumn-27/ARTEX README | 上游 404（raw 與 github.com）；改讀 **Internet Archive 2026-10-07 快照全文**（552KB 頁）與 **Hinln/ARTEX 鏡像 README 全文**（24KB），兩者內容一致 | 上游 README 已無法直接讀，快照時間點在閉源前一天 |
| S22 | GitHub API：Hinln/ARTEX metadata 與前 8 筆 commit（輸出被截斷）；mssky9527/ARTEX metadata；search_repositories（ARTEX in:name 前 20）| metadata 讀；commit 只讀前幾筆 | GitHub MCP 的 list_tags/list_commits 被 session 擋（只允許本站 repo），改走 api.github.com |
| S23 | BSRC「Agent+」官方公告 | **未讀到**。gm7.org（=wx.secv.cc）是 JS SPA；Groundlane、cloudflare、linkup(renderJs)、jina 四個工具都只回殼；微信原文要驗證。Exa、WebFetch 未試 | 賽果只能靠 cn-sec、ThreatBook、piyolog 引文、gm7 搜尋摘要交叉 |
| 未讀 | Reuters、WSJ、qz.com、NYT、American Banker、Korea Herald/Times、SBS、Yonhap、Plura IOC、FSC 公告、ASEC #1-3、Straits Times、Electronic Times、Forkast、Genians LinkedIn、ThreatBook CEO LinkedIn | 僅見搜尋摘要或他人轉述，**不當作已核對** | |

---

## 3. 事實表（逐題）

### (b) ARTEX 做什麼、怎麼做、需要什麼前置

| 事實 | 來源 |
|---|---|
| 定位：「AI 自主渗透测试系统」，Go 後端內嵌 Next.js 前端的單一二進位 + PostgreSQL；agent 能力來自作者另一個 SDK `norma` | README 快照 [一手]；Microsoft：「multi-agent LLM system written in Go with a Next.js frontend」 |
| 自身不含模型，呼叫外部 LLM（Anthropic/OpenAI 及相容介面，供應商與 base URL 可在介面設定）| README；Genians；CrowdStrike/Zscaler 的設定檔顯示 OpenAI 相容格式指向 DeepSeek |
| 架構：資產圖（全域共享）+ 探索圖（每任務）；goals → planner（唯一產生「意圖」者）→ N 個 worker（預設 3），事件驅動；planner 跨喚醒共享 todolist；worker 可檢索其他 worker 的執行過程；人可透過主 agent 對話介入 | README；ASEC 獨立描述一致 |
| 支撐子系統：記錄型 MITM 代理（流量全留痕）、攔截規則與審批閘（規則可「申請」或「禁止」）、MCP、skills（附 api-recon 等）、漏洞複測 agent、證據 SHA-256 快照 | README；cn-sec 5490221 |
| 前置：PostgreSQL、一組 LLM API key、一台伺服器；Genians：「實際需要的只有 LLM API key 與一台伺服器」 | README；Genians |
| 操作者輸入：目標與範圍（自然語言），不需要提供服務名稱或漏洞 | ASEC 在隔離測試環境自行安裝實測：只給目標、目的、允許範圍，兩個案例中 ARTEX 自己選入口並完成程式執行與內網橫向（4 台主機）；ASEC 明講「prompt 簡單到不具資安背景者也能輸入」|
| 規模：約 15 萬行（Go 6.3 萬、Go 測試 3 萬、TS 5.6 萬）；18 個版本在 2 個月內（v0.1.0 到 v0.3.15）| cn-sec 5490221（作者自行統計，我未複核）；piyolog |
| 預設語言：Microsoft 說 UI 與輸出預設英文，可切韓、中、西、日 | Microsoft。注意與 Genians、CrowdStrike 看到的中文控制台標題與中文提示詞不一致，見 §7 |

### 比賽（「百度 agent+ 攻防挑戰賽冠軍」是否屬實）

- 屬實的部分：多個獨立管道（cn-sec 賽後文章、ThreatBook 官方、piyolog 引 BSRC 公告、gm7 對 BSRC 文章的摘要）都說 9/3 成都總決賽、ARTEX 拿下**綜合評分第一**。
- 需要精確化的部分：靶場實跑**不是第一**（Agent+ 靶場第 7、TSecBench 第 6）；冠軍來自「50% 靶場 + 50% 作品評審」加權。站上 10/08 寫「拿下…獎項」沒問題；10/12 digest 寫「冠軍項目」也沒錯，但別寫成「在所有靶場跑分最高」。
- 限制：BSRC 原文我讀不到，上述賽制數字出處是 cn-sec 的作者文章（作者自稱拆了 v0.3.7 原始碼，文章本身是在推廣式地讚揚架構）。[二手]

### 閉源與 ThreatBook 的關係

- ThreatBook 官方部落格：開源版是「ThreatBook 的 RedAgents.Ai 產品負責人的個人專案」；10/8 轉閉源；閉源企業版 ARTEX Pro 現在是 RedAgents.ai 平台的一個 agent；平台允許授權目標白名單、測試資料留在 ThreatBook 環境、支援 ZDR。BigGo 報導 CEO 薛鋒在 LinkedIn 稱「Artex is back with a commercial edition」，也說該工程師「現在領導 RedAgents 開發」。（piyolog 註：作者 10/8 聲明本身沒有寫所屬單位。）
- 這與 Genians 報告把作者描述為「中國資安工程師李浦華（Li Puhua，別名 Autumn）」並不衝突，但**站內 10/08 把作者寫成獨立中國開發者，沒有提到所屬廠商**。這是證據補充，不是矛盾。

---

## 4. 證據強度分級（含與 HexStrike 對比）

等級定義：
- **A：廠商遙測／自行取得的工件**（廠商自己看到或抓到的東西，可複核性高）
- **B：官方／事件調查**（監管、警方、受害者聲明；多半經媒體轉述）
- **C：轉述**（媒體或部落格重述）
- 括號為我給的信心。

| 主張 | 證據 | 等級 | 限制 |
|---|---|---|---|
| 韓國金融攻擊的行為者操作過 ARTEX（含 DeepSeek/GLM/Grok 為模型）| CrowdStrike 抓到攻擊者控制的開放目錄：Claude Code 對話紀錄、ARTEX 設定檔、memory 檔；Genians 自己截圖到 38.244.50.120 上的 ARTEX 登入頁與原始碼字串；Recorded Future、Zscaler 沿同一組開放目錄做進一步分析 | **A（高）** | 三家共用同一批攻擊者外流工件，不算完全獨立的三個證據；Zscaler 明講「請求的模型 ID 無法獨立驗證實際回應的是哪個模型」|
| 該 ARTEX 實例就是**這些銀行**被入侵的工具 | CrowdStrike 只說「目標組織與業界報導重疊」，描述兩家銀行的系統類型（放款進度查詢、員工行動辦公）但**不點名**；Reflectiz 表格逐家標註：新韓＝HTML title 線索、KB＝系統類型相符屬其推論、BNK 釜山＝銀行自稱用 AI agent、Hana＝重複嘗試顯示自動化；Yegaram、Welcome、現代資本＝沒有公開 AI 連結 | **B/C（中）** | 金融保安院長自己說「沒有直接看到 agent，無法確定」；Genians 把「ARTEX 是否用於整個攻擊過程」列為「情況證據（정황）」，並說官方調查結果尚未發布 |
| 攻擊者身分（[個人屬性，已省略]、[某帳號，已省略]）| CrowdStrike 自己寫：個人資料「likely belong」但「無法確定關聯」；初始提供的出生日期是 [已省略]；Logpresso 發現 [某帳號，已省略] 是 DDoS 租用團 GodNet/VITAS 的社群管理員之一，且該人否認，稱手機號碼被盜用；Logpresso 結論：難以斷定單一個人 | **A（身分不可採信）** | 技術文章不該寫這個人是攻擊者 |
| 國家級／國籍 | CrowdStrike：「中文使用者、財務動機」，依據是中國開發工具與中文提示詞，moderate confidence；Genians：「IP 所在國可繞過，只靠中文痕跡不能斷定」| **A 但有限** | 不要寫「中國攻擊者」|
| Storm-0940 用 ARTEX 自動化攻擊數百個組織、ConnectWise 後續下游登入 | Microsoft 自有遙測：IP 144.172.64.99 等與 ConnectWise 公告 IOC 一致（ConnectWise 10/18 公告新增 .99 與 .60，吻合）；「machine speed」：2,250+ 租戶、每分鐘 2,900 次登入嘗試、<3 小時到特權存取 | **A（對行為與速度）；對「這是 ARTEX 做的」為 B-** | Microsoft 全文沒說明憑什麼判定是 ARTEX：IOC 只有 IP 與 python-requests、python-urllib、curl、azure-toolkit 等通用 UA；ASEC 實測 ARTEX 自己的 UA 是 `norma/0.4`、`artex-selfupdate`，微軟 IOC 沒有這些 [推論：可能依速度模式、其他遙測或公開研究，但文中沒寫，不能代它補]。ConnectWise 到 10/21 仍說正與外部專家查「最初怎麼被入侵」；ARTEX 在微軟敘述中是**取得應用身分之後**的加速器，不是初始入侵向量 |
| 「多地區多行為者」都在用 ARTEX | Microsoft 一句話；Recorded Future 評估「很可能更多行為者會採用」；AhnLab 找到 Bob Research Labs/REAPER 改造版，內有 CVE-2026-75650 利用工件與 IRC bot；Zscaler 看到全球目標 | **A（行為者有多個）** | Microsoft 沒列其他行為者；AhnLab 明說這些不能連到韓國案，也說 900 個 IP 不能全當攻擊基礎設施 |
| 6.8 萬人／7 家／100,000 筆／16 家 | 數字來源是韓國金融監督機構與警方，經媒體轉述（Genians：7 家、約 6.6 萬人 + 2,200 筆法人資料；WSJ/Recorded Future：至少 6.8 萬人；BigGo 10/16 引金融當局：16 家、約 10 萬筆）| **B/C** | 數字隨時間變動，逐家筆數有 25,727/25,729 這類差異；站內應標「至 xx 日」|
| HexStrike 被濫用（對比）| Check Point 單篇，地下論壇對話截圖，措辭 claimed/discussing；其他媒體轉述同一來源（前次研究 layer4 §5.3）| **C，僅單一二手廠商部落格** | 沒有遙測、沒有事件調查 |

**與 HexStrike 的對比結論**：ARTEX 有**至少四家廠商**（CrowdStrike、Genians、Recorded Future、Zscaler）基於攻擊者外流工件的分析，加上 ASEC 在公開 ARTEX 控制台上找到實際攻擊後工件，加上 Microsoft 自有遙測的另一個行為者。就「真實攻擊者曾使用開源 AI 滲透工具」這個主張，證據強度明顯高於 HexStrike。但三個保留：(1) 多家共用同一批外流工件；(2) 逐家銀行連結偏弱；(3) Microsoft 的 ARTEX 判定依據未公開。因此「雙用途風險」一節可以從「claimed 於論壇」升級成「多廠商證實有人在實戰使用此類工具」，但不要升級成「ARTEX 造成了這些外洩」。

---

## 5. (d) 防濫用設計為何無效，閉源的實際效果

### 設計存在什麼（來源：README 快照、piyolog 對 CHANGELOG 的整理、securitypointbreak 引 release note）

- 文字層：README 把用途限縮到「個人學習、程式碼研究、本機隔離環境技術驗證」，**禁止對任何網站、線上服務、聯網系統發起掃描、探測、利用或攻擊，無論是否獲授權、是否為自有資產**，也禁止實際滲透測試與生產環境。這些是「額外約定」，README 自己註明與 AGPL 分開。
- 執行層：攔截規則表（內建「破壞性命令需審批」「外發流量直接拒絕」、v0.3.15 新增「刪除類接口路徑」規則）、v0.3.3 起的 LLM 兜底審批（規則未命中時由模型判許可/確認/拒絕）、v0.3.12 記錄代理預設只聽 localhost、v0.3.13 登入前免責勾選與預設遮罩 .gov/.edu/.gov.cn/.edu.cn（遮罩先於允許判定）。
- 人在環路：任務可暫停，審批卡片可放行或拒絕。

### 為何無效（有來源的）

1. 這些全是**操作者可設定的預設值**。Genians 在控制台元件表直接寫「由操作者自行設定，被濫用時難期待實效」。securitypointbreak：blocklist 可編輯或關閉，免責聲明只是勾選，沒有廠商可撤銷存取；銀行網域不在預設遮罩。
2. Zscaler 看到的實際部署：操作者把 ARTEX 換成自己的本機版本、加裝 nmap/sqlmap/nuclei 等工具；指示 AI「假設所有提供的目標都已預先授權」；部分設定允許不逐步批准的自主動作。（這證明「攻擊者主動拆掉審批與範圍假設」是真實發生的，不是理論。）
3. 同時，v0.3.8（9/9）新增代理功能，release note 寫的效果是**避免操作者來源 IP 洩漏**（securitypointbreak 引述）。這類功能對合法紅隊也有用，但對匿名化同樣有利。
4. ThreatBook 自己承認舊公開版「缺乏內建安全控管」。這與 cn-sec 拆解的四層護欄並存；合理的讀法是：護欄是為防「模型犯錯、打過頭」設計的，不是為防「持有者蓄意濫用」設計的。[推論，cn-sec 5490221 的第二個教訓也是這個方向]
5. 授權條款層面 [一般法律知識，非本案來源，需要法務確認]：GPLv3/AGPLv3 對「額外限制」有條款，接收者可移除被視為「further restrictions」的非許可性附加條款。若成立，README 的「禁止用途」在法律上對下游分叉的拘束力有限。此點不宜在文章裡當結論寫，只能當「值得查」。

### 閉源的實際效果（已觀察到的）

| 觀察 | 來源 |
|---|---|
| 10/7 已被 Software Heritage 存檔；10/8 起 Hinln/ARTEX 等鏡像出現（Hinln 於 10/8 11:00Z 建立，保留原始 commit 歷史）| piyolog；GitHub API |
| 10/20 GitHub 上主要 15 個系列的 fork 數字加總超過 12,000（piyolog 自己註明：簡單加總、未去重、已不可見的起點數字可能過時）| piyolog [二手] |
| 閉源後仍續更：3 個以上系列發出本家沒有的版本號（v0.3.22、v0.4.2、v0.12.8），4 個以上系列已超越 v0.3.15 | piyolog |
| 非 GitHub 通路：SourceForge 鏡像、Docker Hub 17 個疑似 ARTEX 映像（最多約 1 萬次拉取）、GitCode 至少 4 個 | piyolog |
| 韓文版（含自加偵測規則的藍隊版）、英文版、日文版、改名版 | piyolog；SBS Biz（經 piyolog）；BleepingComputer；ASEC #95875 |
| 改造版已出現在實際攻擊準備環境（Bob Research Labs/REAPER）| ASEC #95875，明講不能連到韓國案 |
| 閉源後的微軟觀測：Storm-0940 的 ConnectWise 相關活動 10/10-16 | Microsoft。所用版本不明 [推論：必為閉源前取得的副本或分叉，因為閉源版只在 ThreatBook 平台] |
| 官方 Docker Hub 映像 autumn27/artex 下架，社群自維護映像出現 | Genians；本站 10/12 digest 也寫到 |
| 商業版 ARTEX Pro：授權目標白名單 + ZDR | ThreatBook [一手，利害關係方，效果未見獨立驗證] |

結論：閉源**降低了新用戶找到官方最新版的便利、讓官方不再為它負責**，但以上全是閉源之後出現的證據，沒有任何來源量到「濫用因此下降」。technology.org 與 JoongAng 都只說「不太可能阻止」。技術上的可取得性（程式碼已散布）才是主因，這個結論有來源支持；「閉源完全無用」則無法證明，因為沒有反事實。

---

## 6. (e) 對合法使用者的意義（授權與範圍控制）

1. **README 現狀對合法使用者很尷尬**：它禁止對任何線上目標測試，包括自有資產。任何拿它做真實授權滲透測試的組織，都是在作者的書面使用條件之外使用。這與 ThreatBook 後來的「企業版」說法（允許授權範圍內測試）形成區隔：要合法、可稽核地用，作者端的路徑是買商業版。
2. **範圍控制在開源版是軟性的**：goals agent 從自然語言抽取範圍；攔截規則可擋外發；但 ASEC 的測試只證明「它會完成任務」，**沒有獨立測試驗證它是否嚴格遵守範圍**（我沒找到這樣的評測）。「授權」在系統裡是一段 prompt 與規則，不是密碼學層面的約束。Zscaler 看到的「假設所有目標已預先授權」提示，說明這個軟性邊界很容易被改寫。
3. **稽核證據是它的優點**：全流量錄製代理與證據快照（SHA-256），在合法專案裡能當工作紀錄；對防守方，這同時意味著被入侵的 ARTEX 主機會留下大量資料（AhnLab、CrowdStrike 靠暴露的工件追蹤）。
4. **供應鏈風險**：現在流通的是 v0.3.15 分叉、改名版、續更版。我只有證據顯示「有改造版被用於攻擊準備」，**沒有證據顯示任何分叉被植入後門**。要不要用，等同於審查一個無法驗證出處的 Go 二進位。[推論，無來源說分叉有後門，不要寫成事實]
5. **偵測面**：ASEC 指出 UA 偵測不可靠（只在部分 HTTP 請求出現、可被改、curl 等工具通用），建議看跨日誌的行為序列。

---

## 7. 站內陳述核對（唯讀；檔案：/home/user/quidproquo/src/content/posts/daily/）

| 檔案:行 | 站上句子 | 與一手來源的關係 |
|---|---|---|
| 2026-10-08-security-artex-ai-pentest-korea-banks.md:7（description）| 「CrowdStrike 靠攻擊者自己外流的 Claude Code 對話紀錄還原完整攻擊鏈」| **過強**。CrowdStrike 原文：這些工件提供「對攻擊者作業方法與工具的直接洞察（direct insight into operational methodology and tooling）」；沒有逐步還原對銀行的入侵鏈，只寫兩家銀行的系統類型，且明說受影響組織總數未確認。建議改為「還原其作業架構與工具」|
| 同檔:18 | 「南韓至少 7 家金融機構（含 KB 國民銀行、新韓銀行、韓亞銀行）…CrowdStrike…重建出攻擊者使用 ARTEX…自動化入侵銀行系統的完整過程」| 7 家與三家名稱出自韓方報導（Genians 表可證）；**CrowdStrike 全文不點名任何銀行**，不能把這三家寫成 CrowdStrike 的 ARTEX 結論。「完整過程」同上 |
| 同檔:32 | 「Li Puhua（別名 Autumn…）今年 7 月公開、…9 月還拿下百度主辦的『Agent+』攻防挑戰賽獎項」| 日期與冠軍有佐證（見 §3）。補強：是「綜合評分第一」而非靶場最高分；10/15 起作者所屬廠商 ThreatBook 推出閉源商用版，站內 10/08 之後沒有補這點 |
| 同檔:49（影響範圍）| 「作者 Autumn-27 已於事件曝光後將專案轉為閉源並停止更新與維護」| 對公開版屬實。但 ThreatBook 10/15 起提供商業版 ARTEX Pro，「停止維護」只指公開版；且分叉續更中 |
| 同檔:tldr | 「被不明財務動機攻擊者…」 | 與 CrowdStrike 一致（moderate confidence）|
| 2026-10-09-ai-agent-daily.md:8（tldr）、:27、:103 | 「新韓銀行遭 ARTEX＋Claude Code 入侵逾 2.5 萬筆資料外洩」| **過強**。新韓與 ARTEX 的連結是 Genians 抓到的 HTML title（BigGo 10/2 原文：「是否實際用於新韓入侵尚未確認…僅發現字串不足以證明」），金融保安院長也說無法確定。另 Zscaler 指出 Claude Code 是用戶端，實際模型設定是 DeepSeek/GLM/Grok，「可能有些會話用了 Anthropic 模型」不能確認 |
| 2026-10-17-ai-agent-daily.md:73 | 「CrowdStrike 將新韓銀行、KB 國民銀行等至少 16 家金融機構的入侵，追溯到使用中國開發開源滲透工具 ARTEX 的中文語系攻擊者」| **與一手來源矛盾**。CrowdStrike 不點名銀行、不給機構總數（「尚未確認」）；「16 家」是韓國金融當局的受影響機構數（BigGo 10/16：約 10 萬筆、16 家），不是 CrowdStrike 的歸因範圍。該句引用的 Straits Times 我未讀，不確定是該文的措辭還是站內改寫 |
| 2026-10-19-ai-agent-daily.md:8、:43、:85 | 「CrowdStrike 揪出…攻擊南韓 7-9 家銀行…ARTEX 作者 10/8 把專案轉為私有」| 「7-9 家」源自 JoongAng 引 Reuters「至少 9 家被報導攻擊」與官方 7 家外洩的混用，不是 CrowdStrike 數字；「轉為私有」與聲明「轉閉源」意義略不同，但 BigGo 與 ThreatBook 都用過 private，可接受 |
| 2026-10-12-ai-agent-github-digest.md:33-38；2026-10-12-ai-agent-daily.md:49 | 把 mhtsec/ARTEX（3,121★）列為值得看的 trending repo：「示範了 agent 做資安測試已經走到可以贏比賽的成熟度」，且「ARTEX 讓 agent 自主滲透測試真實網路資產」| 沒有提到同一個專案 10/7 已被 CrowdStrike 連到韓國銀行事件、10/8 已被作者閉源。同月同站另有 10/08 資安警報，推薦語氣與其形成落差。我未核對 mhtsec/ARTEX 與上游的關係；digest 自己稱是「原始碼備份」|
| 2026-10-06-ai-agent-daily.md:69 ; 2026-10-07-ai-agent-daily.md:63 | 「外洩逾 6.5 萬筆／6.8 萬人」、「首批 AI agent 入侵全球金融系統案例之一」| 數字隨時間變（6.5 → 6.6 → 6.8 → 10 萬筆／16 家）屬正常；「首批」是評論。10/06 日報說 ARTEX 事件時，CrowdStrike 報告尚未發布（10/7），當天來源是 techtimes 之類二手。若文章要引用，需標「至 xx 日」|
| 2026-10-09-weekly-review.md:25 | 「CrowdStrike 靠…重建了攻擊鏈」「目前為止 agentic pentest 工具造成真實財務級損害最…」| 同上「重建攻擊鏈」過強；「財務級損害」截斷，無法完整核對，但目前沒有任何來源量化金錢損失（American Banker 經 Reflectiz：未確認客戶財務損失）|

**與 Microsoft 報告的潛在張力**（站內 10/08、10/17 尚未寫入微軟報告，這些是寫新文章時要處理的）：

1. 站內既有敘事是「單一財務動機行為者打韓國銀行」；微軟引入的是第二個、國家級關聯的行為者，且活動時間是閉源之後。不要合併成同一個故事。
2. Microsoft 說 ARTEX 的 UI 與輸出預設英文、可切韓/中/西/日；CrowdStrike 與 Genians 看到的是中文控制台標題與中文提示詞，README 也是中文。可能的解釋是微軟分析的是本地化分叉，也可能只是描述上游某版本的多語系 [推論，兩者皆無來源明證]。
3. Microsoft 圖 1 把「15.1 萬次失敗登入／327 個帳號／8 個組織」（10/10-14 的噴灑，無一成功）與「2,250+ 租戶／每分鐘 2,900 次嘗試」（拿到 ConnectWise 應用身分之後的登入嘗試）放在同一張資訊圖，容易被誤讀成「2,250 個租戶被入侵」。CyberScoop 的措辭是「reach」，微軟內文是「attempt to sign in」。Microsoft 與 The Register 都明講：成功驗證不等於資料被存取，且未披露受害數量。
4. Microsoft 說「Following the unauthorized access」才用 ARTEX；ConnectWise 到 10/20-21 仍說還在釐清最初存取如何發生。因此不能寫成「ARTEX 入侵了 ConnectWise」。

---

## 8. 分叉、鏡像與異常星數／fork 數

GitHub API 2026-10-22 讀到的數字（star / fork，建立日；皆為快照，可能變動）：

| Repo | star | fork | 建立 | 自述 |
|---|---|---|---|---|
| jiwoochris/artex-global | 1,959 | 2,156 | 10/03 | ARTEX 韓文版，標榜 blue-team/detection（早於上游閉源）|
| trhhubsd/ARTEX | 1,657 | 809 | 10/08 | 沿用「百度 agent+ 攻防挑戰賽冠軍」標題，一般鏡像 |
| **Hinln/ARTEX** | **939** | **1,447** | 10/08 11:00Z | 「源码备份：基于 Autumn-27/ARTEX v0.3.15，保留原始提交历史与 AGPL-3.0」；fork:false；最後 push 10/08 11:06Z |
| RuoJi6/ARTEX | 507 | 336 | 10/09 | 「持续维护开源版本」|
| bdg9412/artex-ko-plus | 215 | 201 | 10/09 | 韓文版 + AI 事件應變功能 |
| Ernket/CodeScan-Artex | 163 | 84 | 10/14 | 二次開發為程式碼稽核平台 |
| mssky9527/ARTEX | 14 | 958 | **7/27** | 建於上游首次發布次日；pushed_at 10/07 14:53Z |
| panda0x123/artex-ymh | 13 | 494 | 9/22 | 二次開發版（外網突破→內網縱深）|
| Xiao1an/ARTEX-God | 13 | 9 | 10/21 | 「二开增强版…优化敏感操作拦截，增加一键 getshell、长链路后渗透、内网横向…」|

我沒有讀到 cskwork/scopeweaver 或 odin1024/ARTEX 的頁面本身：scopeweaver 只在 ASEC 名單（ScopeWeaver）中出現；odin1024/ARTEX 在 cn-sec 5490221 被稱為「最後一個版本純源碼備份」。

**星數／fork 異常的分析（不宣稱刷星）**：

- 事實：Hinln 的 fork（1,447）高於 star（939）；mssky9527 的 star 只有 14 但 fork 958；jiwoochris 的 fork 也高於 star。
- 一般機制 [推論]：fork 是「保存一份」的一鍵動作，在「來源即將或已經被刪除」的情境下，人們傾向先 fork 備份而不是點星；star 是社交信號，fork 是保存信號。上游 10/8 刪除前後的時間窗正是這種情境（Software Heritage 10/7 存檔、Hinln 10/8 11:00Z 建立）。這與「刷星」的典型特徵（star 異常高、fork 低）剛好相反。
- mssky9527（7/27 建立、10/7 push）是上游發布隔天建立的副本，有 958 個 fork：可能是早期被大量 fork 的副本，也可能是被許多人當作上游的替身。我沒有去查其 fork 的建立時間分布或擁有者，無法區分。[推論]
- GitHub 文件我讀到的只有「刪除公開 repo 不會刪除 fork」；關於「上游被刪後 fork 網路如何重新掛靠」的機制我沒有查到來源，所以不能用它解釋 fork 數的集中。
- 使用者提供的數字（Hinln 939★／1,446 forks）與我 10/22 讀到的 939★／1,447 一致。piyolog 的「最大系列 6,602 forks」是起點已不可見的子 fork 資訊，與上表不同口徑。

---

## 9. 反證、限制與批評

1. **歸因僅憑工具痕跡不夠**：technology.org 引韓國專家「開源工具本身無法辨識攻擊者，因為任何人都能下載、改寫、在任何地方執行」。Genians 也寫「中文痕跡不能斷定國籍」「ARTEX 是否貫穿整個攻擊過程是情況證據」。ASEC 另說 900 個暴露 ARTEX 的 IP 不能全當攻擊基礎設施，也不能當成使用者或被測目標。
2. **AI 的實際貢獻不明**：Recorded Future 寫「現有證據無法確立 AI 加速了這些攻擊多少」；CrowdStrike：未見新技術；金融當局：「並非高端攻擊手法」；Genians 表 3.1 的新韓路徑（本人確認繞過、識別值列舉）是 IDOR/列舉類。Reflectiz 引 FSI：AI「並非在沒有人類介入下獨立行動」。securitypointbreak 的標題收尾：「無論 ARTEX 在首爾扮演什麼角色，缺口本來就在那裡。」
3. **攻擊者 OPSEC 很差，反而說明 AI 沒有補上這一塊**：Recorded Future 的「jagged edge」；CrowdStrike 與 Recorded Future、Zscaler 的發現全靠暴露的目錄。
4. **ARTEX 能力的獨立評測**：我沒有找到獨立第三方的 benchmark／誤報率報告。能讀到的：作者與轉載文章的賽果（自述）、ASEC 的兩個小型重現實驗（單一次、單一環境，成功完成程式執行與內網橫向）、Everspin 重現環境「API 資訊查詢 22 秒」（Genians 轉述，原文未讀）。搜尋「ARTEX 局限／誤報」只回到 ASEC 與工具頁，未見專門的限制分析。[有限搜尋下未發現，不是已窮盡]
5. **來源利害關係**：Reflectiz、Alt Security（securitypointbreak 的受訪者）、Genians 文末解決方案、Logpresso、ThreatBook、AhnLab 都有產品或服務可賣；ThreatBook 是作者的雇主。其事實部分可用，推論與建議要降權。
6. **未解**：(a) Microsoft 怎麼辨識 ARTEX；(b) 韓國案各銀行是否都用 ARTEX（官方調查結果未發布）；(c) ConnectWise 初始入侵向量；(d) 閉源後濫用是否下降（無量測）；(e) 各分叉有無被植入惡意程式；(f) [某帳號，已省略] 的真實身分。

---

## 10. (f) 這個案例能／不能支持什麼

**能支持**
- 開源 AI 滲透框架已有真實攻擊使用（至少 2 條獨立線：韓國案的操作者，與 Microsoft 看到的 Storm-0940）；證據來自廠商取得的工件與遙測。
- 這類工具的主要增益是「速度與覆蓋面」：偵察、噴灑、已知弱點與弱認證的大規模嘗試；對手不需要新技術（CrowdStrike、金融當局、Microsoft 的措辭一致：Microsoft 說底層手法是 password spraying、OAuth 濫用）。
- 軟性的防濫用措施（聲明、勾選、預設遮罩、審批規則）對決意濫用者無效，操作者可改碼，實例有 Zscaler 的證據。
- 事後閉源／下架無法回收已散布的程式碼，已有大量鏡像與續更分叉。
- 防守端重點仍是暴露面、授權檢查、速率限制、異常行為偵測（Genians、ASEC、Recorded Future、Microsoft 一致）。
- 操作者留下的 agent 工作紀錄既是風險，也是追蹤攻擊者的主要線索。

**不能支持**
- 「AI 自主發動攻擊」：已知案例都有人類操作者設目標、換模型、複查（Zscaler 描述操作者監督分工；FSI 官員稱非獨立）。
- 「ARTEX 造成了這些外洩／ARTEX 是主因」：缺口是弱認證與暴露的邊緣系統；反事實未知。
- 「每一家銀行都被 ARTEX 打」：連結強度逐家不同，官方未發布結論。
- 「中國國家行為者打了韓國銀行」：韓國案沒有國家歸因；微軟的國家級歸因針對 Storm-0940 與 ConnectWise，不同事件。
- 「開源是問題根源」：同一批攻擊者靠的是商業與開放權重模型的 API、代理轉售商（xcai.pro）、現成雲端與代理基礎設施；Alt Security 認為連前沿模型的護欄都不夠。
- 「閉源／管制單一工具能有效降低風險」：FSI 官員稱類似開源工具「很多」；ThreatBook 自己整合的其他 agent（CyberStrikeAI、Cyber/Yanji）存在，Straiker 的 Villager、HexStrike 等也在 securitypointbreak 與前次研究中；Microsoft 說各地區都有行為者。
- 「已證明防濫用設計總是無效」：只證明在被改碼的部署中無效；對守規矩使用者的效果沒有被量測。

---

## 11. 給之後寫作的建議措辭（不改站內檔案，僅備忘）

- 「CrowdStrike 從攻擊者暴露的目錄還原了其工具與作業架構，並以中等信心評估為中文使用者、財務動機；報告不點名銀行，也不給受影響組織總數。」
- 「Microsoft 評估 Storm-0940 在 ConnectWise 事件中以 ARTEX 加速掃描、噴灑與 OAuth 應用濫用；文中未說明辨識 ARTEX 的方法，ConnectWise 亦仍在調查最初入侵路徑。」
- 對比 HexStrike：「HexStrike 的實戰濫用僅有 Check Point 引論壇貼文；ARTEX 則有多家廠商以攻擊者工件與遙測佐證。」同時標註：多家共用同一批工件。
- 勿寫：[個人屬性，已省略]、[某帳號，已省略] 為攻擊者；「中國駭客」；「ARTEX 入侵新韓」；「CrowdStrike 認定 16 家」。

---

## 附：工具與備援鏈紀錄

- Groundlane web_fetch / web_search：全部主要來源成功。
- GitHub MCP（list_tags、list_commits）：因 session 僅允許 vincentxuu/quidproquo 被拒；改走 api.github.com（經 Groundlane）。raw README 對上游 404，改用 Internet Archive 快照與 Hinln 鏡像。
- BSRC 原文（gm7/wx.secv.cc 與微信）：Groundlane、cloudflare、linkup（renderJs）、jina 皆只回空殼；Exa、WebFetch 未試。依 CLAUDE.md 規則，此處**不宣稱「讀不到」是結論**，僅標「未讀到，鏈未走完」。
- 沒有走到 firecrawl、Exa 的原因：主要來源都已讀到；僅 BSRC 原文缺口。
