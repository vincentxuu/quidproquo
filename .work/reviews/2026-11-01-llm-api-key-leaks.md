# LLM API key 外洩文章中英審稿

## post-verify
獨立研究agent review：10案例、18組宣告，無P0/P1。修正中文「從資料庫移進環境變數避免硬編碼」為「從原始碼移進環境變數」，英文同步。Noma2025披露/2024修補、OpenCode媒體轉述、DeepSeek/SAP研究與實際入侵、cloud credentials與LLM key均未混稱。來源及衝突細節見.research/llm-api-key-leaks/research-note.md。
本次只查核文中提出的主張；覆蓋與可讀性另外執行下列兩節。

## post-review
非作者editorial agent檢查：無架構或供應鏈blocker。已修圖「唯一可取得原始key」為「唯一有秘密讀取權的應用身分」，保留ingestion會短暫接觸原文；英文計費its消歧義。已核對兩語10列案例、限制、3個改善子節、驗收結果一致。本文獨立單篇，不加入既有AI資安教學系列或改寫系列規劃；OpenClaw特定實作只以站內連結轉介。沒有燈塔內部檔名、配置與未發布弱點。
專項references中英2檔通過；TW0 blocking/0 review，process-leak通過；語言parity全站通過；獨立astro check 0 errors/0 warnings/83 hints。19外鏈無404/timeout，2個OpenAI help回403，但Exa已讀官方正文。整頁dev預覽因Workers runtime crash未完成；不以圖預覽代替整頁驗收。全站verify最後結果記於plan。圖預覽兩語各1圖，淺/深/375px皆腳本通過並人工看過6張截圖。

## post-polish
已執行register-scan與phrase-ledger；正文38段，長句3，轉折段5%，無blockquotes、無模板化轉折或一般英文過密命中。逐段閱讀：開頭交代BYOK與模型key/加密key分界；每個建議子節有可執行動作；沒有捏造第一人稱事故經驗。中文TW掃描0 blocking/0 review。研究限制只保留影響讀者解讀的證據類型；工具失敗與選案過程放研究筆記。主agent採納事實與語義修正，英文同步。

## 獨立報告留存

# post-verify report: 2026-11-01-llm-api-key-leaks

日期：2026-11-01。獨立唯讀審查，中英文均已逐段讀取。沒有修改文章。
工具：完整 callable inventory 無 Groundlane；沿用 Exa 公開 search/fetch，一手正文與唯一明確標示的媒體轉述分開。未執行來源PoC，未檢查真實key或部署。

## 結論

沒有發現 P0/P1 事實錯誤或中英結論衝突。10列案例的證據層級與credential種類均有保留；沒有把研究PoC寫成犯罪入侵，也沒有把雲端／HF token改稱OpenAI key。

一處應在發布前修正的精確性問題（P2）：
- 中文 L62：「把 key 從資料庫移進環境變數，可以避免一些硬編碼問題」。原本存在資料庫的key不是硬編碼；「從資料庫移進env」本身不會構成避免硬編碼的因果關係，也與本篇推薦按需取用secrets的方向不符。英文 L62 僅說moving a key into an environment variable，沒有「from database」，比較準確。
- 建議中文縮回：「把 key 從原始碼移進環境變數，可以避免硬編碼；同一個執行環境裡的惡意程式，依然可能讀取它。」英文若同步可用："Moving a key out of source code and into an environment variable avoids hardcoding. It does not stop malicious code in that environment from reading it."
- 這不是建議將現有DB secrets改存env，而是釐清env防護適用範圍。

## 10案例查核

| 位置（中英同行號） | Verdict | 已核對內容與限制 |
|---|---|---|
| L39 OpenCode | Confirmed as attributed secondary report | 已重新抓TechCrunch 2026-10-19正文。Console workspaces存的部分模型key受影響、本機app/CLI不受影響、根因/儲存未知均與報導一致。文章明標媒體轉述，沒有冒稱直接讀官方通報；沒有採用未證實distillation歸因與個別帳單數字。 |
| L40 LiteLLM/Telnyx | Confirmed | 已讀PyPI與LiteLLM一手正文。套件遭credential stealer污染成立；文中未採兩來源不同的暴露時間說法，也未把所有套件部署當受害。 |
| L41 Google/Gemini | Confirmed as historical disclosure | 已讀Truffle原始正文與Google現行key文件。句子描述歷史問題而非宣稱現在所有standard keys皆不安全；沒有把舊退役預期當目前事實。 |
| L42 AWS/Bedrock | Confirmed | 已讀Sysdig正文：事件2025-11-28，發布2026-02-03。文章只寫「2026年2月報告」正確，S3 key→提升權限→Bedrock abuse成立；非OpenAI key。 |
| L43 DeepSeek | Confirmed | 已讀Wiz原始正文。log_stream明列API Keys；文章保留key種類/有效性未明與未證實犯罪下載，不過度主張。 |
| L44 AgentSmith | Confirmed | 本輪重新抓Noma正文，發表2025-06-17、修復2024-11-06明確。只影響主動執行惡意公開prompt/agent者、未發現active abuse。中文「前一年」與英文previous year均正確。 |
| L45 HF Spaces | Confirmed | 已讀HF 2024-05-31官方全文。官方確認secret相關unauthorized access但只suspect subset被讀；部分HF token撤銷。文章語氣與範圍正確。 |
| L46 SAPwned | Confirmed | 已讀Wiz全文。2024-07-17披露；測試帳戶明文secret、跨租戶風險、已修復、no customer data compromised均有來源；未虛構其他客戶被竊。 |
| L47 tj-actions/reviewdog | Confirmed | 本輪讀官方GHSA與StepSecurity原始調查。runner memory→base64→public workflow log成立；StepSecurity timeline另確認reviewdog部分Actions受影響，不是案例名憑空併入。文章沒有引用受影響repo總數。 |
| L48 Shai-Hulud | Confirmed | 本輪讀GitHub registry方全文：2025-09-14獲知、malicious post-install、multiple secrets與self replication成立；文章沒有聲稱專攻LLM keys。 |

## 其餘宣告（8組）

1. L15/L29 BYOK語境及bearer credential：文內明確區分模型access key與客戶管理資料加密key；通常/bearer用語有保留，未主張所有協定完全相同。
2. L60–62 env／供應鏈／日誌：LiteLLM與tj-actions支持；中文L62因果關係需上述修正。
3. L68–76 DB加密、Secret Manager、環境變數、遮蔽與quota防護範圍：與AWS/OWASP公開正文一致；屬跨來源架構歸納，不是來源逐字給出的產品驗證。
4. L82–117 模型呼叫服務隔離：明確以「我會」/I would提出設計；ingestion仍見明文有交代，不是未附證據的既有產品承諾。
5. L119 lockfile/hash與cooldown：PyPI正文直接支持；鎖惡意版本不會安全的限制合理。未給過時CLI旗標。
6. L121 log去敏：OWASP Logging正文支持移除access tokens/encryption keys/primary secrets。合成key是建議測試，未宣稱已實測。
7. L129 IP allowlist：本輪抓OpenAI官方全文，明述有效key仍可因非allowlist IP拒絕；文章保留allowed-host compromise限制，不承諾完全防濫用。
8. L133–135 WIF/撤銷：本輪抓OpenAI官方全文，可信外部身份→短效token與事先service-account mapping成立。未混入Codex beta或假設任意provider均支援；清除本地值不撤銷provider credential正確。

## 中英一致性

已逐段對照 frontmatter、10列案例、兩個對照表、架構圖描述、3組建議與驗收條目。除中文L62多出的「從資料庫」使因果失準，沒有改變證據強度、時間或適用範圍的差異。文章沒有引用需要重算的金額、版本數量或統計。

## 重新取用來源

- https://noma.security/blog/how-an-ai-agent-vulnerability-in-langsmith-could-lead-to-stolen-api-keys-and-hijacked-llm-responses （Noma正文）
- https://techcrunch.com/2026/10/19/hackers-hit-ai-coding-tool-opencode-running-up-charges-on-users-ai-accounts/ （媒體轉述正文）
- https://github.com/tj-actions/changed-files/security/advisories/GHSA-mw4p-6x4p-x5m5 （官方GHSA）
- https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised （原始調查正文）
- https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/ （registry方正文）
- https://help.openai.com/en/articles/20001201-ip-allowlisting-for-openai-api （官方現行文件）
- https://developers.openai.com/api/docs/guides/workload-identity-federation （官方現行文件）

其餘已讀來源詳 /tmp/api-key-cases-ai-exposure.md 與父任務研究筆記。本次沒有獨立驗證站內OpenClaw文章、diagram渲染或外部供應商功能的實際帳戶操作；這些不作為本報告已實測結論。

範圍聲明：本次只檢查了文中已提出的18組宣告（10案例＋8組技術/設計宣告），未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish


# 獨立文章審查：LLM API key 外洩

受審檔案：
- /Users/xiaoxu/Projects/quidproquo/src/content/posts/ai/2026-11-01-llm-api-key-leaks.md
- /Users/xiaoxu/Projects/quidproquo/src/content/posts/ai/2026-11-01-llm-api-key-leaks-en.md

方式：已讀 repo post-review、post-polish SKILL，通讀兩版正文與表格，獨立檢查架構推論、供應鏈證據與可讀性。只讀文章，未修改。依主 agent 分工，未執行全站或局部機械檢查、未看diagram screenshot；相關結果不能由本報告代替。非本 agent 研究的新案例（OpenCode、DeepSeek、AgentSmith、HF、SAP）未重新獨立抓原文，請與另一事實查核結果合併。

## 結論

沒有發現必須阻擋此草稿交付的架構或供應鏈事實錯誤。文章已兌現使用者焦點：原始key被取得、帶出平台，沒有又偏回額度管理。語氣可讀，中文與英文意思一致。以下兩處建議精準化，第三處只是可選的讀者體驗改善。

## 建議修：兩處語意精準化

1. 中英文第99行圖內「唯一可取得原始 key 的身分」／“Only identity allowed to read keys”過度壓縮。
   - 正文111行與caption87行其實已誠實交代初次輸入與保存入口短暫見原文，因此不是全文自相矛盾。
   - 但圖單獨被擷取時，「唯一」會把初次ingestion服務也排除，且secret store／provider當然亦見可用值。
   - 建議圖改成「唯一可從儲存讀取 key 的應用身分」／“Only app identity with secret-read access”。若英文圖寬不足，改成“Only app with secret-read access”。保留111行即可，不需擴寫新機制。

2. 英文第15行 “Your platform ... charges usage to its provider account”有一點付款主體歧義。
   - 中文15行明確是費用由客戶模型帳戶支付；英文its可能指platform，也可能被讀成平台對客戶開帳。
   - 建議 “Your platform stores the credential and makes requests on the organization's behalf; the provider bills the organization's account.” 只釐清同一事實，無需加新內容。

## 可選：表格閱讀量

第37–48行有10個案例列，每列同時含入口與證據限制，資訊密度高，但不是充數：實際入侵、研究示範與通用供應鏈有明確區分；主文又挑代理、日誌／套件兩類深入。這種「入口地圖→挑兩類→防線」結構可成立。若手機實際預覽閱讀費力，才考慮把一般供應鏈兩列移至附錄；目前沒有必要為了壓短硬刪來源或案例。禁止把10列表格稱成10次相互獨立攻擊：tj-actions/reviewdog、LiteLLM/Telnyx已合併，文章也未作此統計。

## 已確認的關鍵防線與誠實性

- ingestion：zh/en111行明說入口仍短暫接觸明文，caption也提示省略，沒有承諾端到端無明文。
- KMS/Secret Manager：76行明說有讀取權限的服務遭入侵仍可能洩漏；每客戶加密不會自動隔離租戶權限。這是正確且必要的邊界。
- 解密服務不是任意代理：109行要求自身驗證org、purpose、credential ownership，拒任意URL／ID，沒有只信前端授權。
- 供應商限制：129–133行有支援條件；131行明說允許主機被入侵／代理時可能繞過，未把IP allowlist說成絕對保護。
- 短效身分：133行保留預先trust setup／mapping，不宣稱貼key就能自動WIF。
- 撤銷：135、152行清楚區分provider revoke與刪本地副本。
- 出站：123行說網路政策，而非只讓被入侵的應用自我檢查；也保留allowed endpoint濫用風險。
- 輪替／秘密接觸測試：125行用合成key而非客戶key；119行說鎖惡意版本不會變安全，避免過度相信pin。

## 供應鏈事實核對（對照本 agent 已讀一手正文）

- zh/en40、60：LiteLLM/Telnyx被植入竊密程式，LiteLLM蒐集env/cloud credentials→非官方網域，符合PyPI與LiteLLM原文。沒有把所有部署當受害、沒有沿用廠商與PyPI不一致的暴露分鐘數。
- zh/en47、62：tj-actions從runner記憶體提取→編碼→logs，符合maintainer advisory與StepSecurity。文中沒有把下載payload的gist host誤說成秘密外傳host；也沒有把23k使用repo當已偷key數。
- zh/en48：第一波Shai-Hulud在安裝階段找秘密並以token擴散，符合GitHub官方與Wiz正文。未把它說成特定LLM key偷竊，未混入2.0波次。

## 人工可讀性與中英一致性

開頭三段已先交代BYOK、誰面臨問題、文章範圍；不用先懂秘密管理才能讀。後續保護比較與架構提案連貫；每組建議都有可執行第一步。沒有大量研究者姓名、引述或統計數字，限制集中在表格第三欄，沒有每句加一串但書。

中文一般英文術語集中在API key／token／SDK等必要詞，未達散文被半翻譯語句主導的程度。「秘密」「憑證識別碼」「服務身分」沿用一致。英文未省略主要限制，也沒有把研究可利用性翻成實際犯罪利用。中文的案例月／報告月、英文reported／disclosed一致。

未加台灣虛構案例；中文開場用中文客服、課程摘要與企業內部助理定位工作情境，足以服務繁中builder，不需硬塞法規或市場斷言。

## 最終gate結果
pnpm verify僅既存4篇CS2680課程影片查核過期失敗；astro check、lint、references、post-quality、TW、glossary、lang parity（3192組）、skills sync、progress等均通過。沒有為使gate通過改動其他文章或檢查器。未commit、未發布；整頁Workers dev預覽未完成。

2026-11-01後續：使用者授權處理course-videos blocker，已即時核對CS2680官方政策並更新4筆checkedAt。最後pnpm verify全部通過，前述過期blocker已解除。證據見.work/cs2680-video-recheck-20261101/。
