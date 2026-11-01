# Research: LLM API key 外洩與客戶憑證託管

日期：2026-11-01。交付中英未發布草稿，不作燈塔漏洞公告，不宣稱已有事故。

## 讀者問題與母群
研究問題：原始模型key或能間接存取模型的憑證，如何被第三方取得？託管產品如何縮小讀取權與複製面？外洩後如何限制帶離環境使用？
母群邊界：2024–2026公開的AI憑證事件/漏洞研究，以及直接有助解釋託管秘密風險的通用CI/套件竊密事件。採公開報告搜尋聚合＋平台/研究者推薦鏈；不是全球完整事件清單，不能據此推算上升率。
候選池：既有Google/Gemini、LiteLLM/Telnyx、Sysdig 2026；新增OpenCode Console、HF Spaces、DeepSeek、SAPwned、AgentSmith、tj-actions/reviewdog、第一波Shai-Hulud、Sysdig原始2024 LLMjacking、Nx/s1ngularity、Replicate、chalk/debug、Flowise baseURL advisory。

## 選案覆蓋
| 外洩路徑 | 主文案例 | 證據類型 |
|---|---|---|
| 託管平台/舊系統 | OpenCode Console、HF Spaces | 媒體轉述平台通報；官方確認未授權存取及懷疑secret讀取 |
| 公開前端與權限擴張 | Google/Gemini | 原始研究披露；官方當前限制另外確認 |
| 日誌儲存副本 | DeepSeek | 研究者確認可讀，不證明犯罪者利用 |
| 代理與外部範本 | AgentSmith | 負責任揭露研究，已修補 |
| 執行隔離 | SAPwned | 研究者自有測試帳戶secret PoC，非客戶已遭竊 |
| SDK/套件執行 | LiteLLM/Telnyx、第一波Shai-Hulud | 實際供應鏈竊密事件；同鏈不拆成多起 |
| CI記憶體→日誌 | tj-actions/reviewdog | 維護者/調查者確認；非專門LLM案 |
| 雲端身份與公開資產 | Sysdig 2026 | 實際入侵，事件2025-11而報告2026-02 |

主文10列是選取的案例組，非10次統計獨立attack campaigns。偏誤：英文公開技術通報較多，無法涵蓋未披露事件；普通雲端/npm/GitHub tokens與LLM key分開標示。
未入主文：Sysdig2024與2026同路徑以較新報告代表；Nx作Shai-Hulud相關補充不加獨立計數；Replicate有資料/跨租戶研究但不靠它證明客戶LLM key竊取；chalk/debug主要竄改交易而非下游key竊取；Flowise advisory雖有可用技術細節，與已選AgentSmith目的地控制高度重複且不用其擴張推論湊數。

## 來源取用
- case-evidence.md：兩個研究agent的一手來源、入口、日期、秘密種類、修補、短證據與範圍。AI exposure及supply chain agent已讀所採用的原始正文。
- case-source-snapshots.md：主agent重取Google原始研究、Sysdig2026、HF官方、GitHub/npm官方、DeepSeek原始研究正文。
- official-1.md：OpenAI key safety；official-2.md：OpenAI IP allowlist；official-3.md：OpenAI workload identity；official-4.md：AWS Secrets Manager；official-5.md：OWASP Logging；official-6.md：Google Gemini key。
- 主agent另讀OWASP Secrets Management（前輪正文可沿用）、Noma AgentSmith正文、TechCrunch及BleepingComputer OpenCode報導、Flowise GitHub advisory正文。新增KMS glossary依AWS官方概念頁https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html。
- 工具降級：完整callable inventory無Groundlane，使用Exa search/fetch。OpenCode原始X https://x.com/opencode/status/2111519637049319818 與twitter同ID Exa均SOURCE_NOT_AVAILABLE；平台web open回403。主文只引用已取得全文的TechCrunch報導，明示媒體轉述，不稱原始公告已直接驗證。原始email屬非公開未取得，未要求或使用登入。

## 事實交叉表與衝突處理
| 主張 | 證據 | 結論 |
|---|---|---|
| LiteLLM受污染套件蒐集多種秘密 | PyPI處理報告＋LiteLLM廠商 | 一致；不引用雙方不同的精確暴露分鐘數 |
| Gemini舊公開key可能取得AI權限 | Truffle原始披露＋Google key安全設計變更 | 歷史問題成立；不寫成當前所有舊key仍可用 |
| tj-actions從記憶體擷取到日誌 | 維護者advisory＋StepSecurity原始調查 | 一致；不誤稱已證實網路外傳 |
| Shai-Hulud竊secret並傳播 | GitHub官方＋Wiz原始調查 | 一致；不混入2025-11第二波 |
| HF secrets部分可能被讀 | HF官方 | 懷疑範圍保留，不寫全部外洩或模型key盜刷 |
| DeepSeek日誌含API keys | Wiz原始研究 | 可讀性成立；key種類/有效性/惡意下載均未確定 |
| SAPwned可讀測試秘密 | Wiz原始研究 | PoC，不稱真客戶已遭竊 |
| AgentSmith代理能截取key | Noma原始研究含LangChain聲明 | 修補2024、披露2025，不混用日期 |
| KMS/secret store需最小權限與稽核 | AWS＋OWASP | 一致；不得宣稱RCE後仍必然安全 |
| OpenAI來源IP限制有效key也拒絕 | OpenAI官方功能文件 | 單一權威功能依據，不外推其他provider |
| WIF避免保存長效OpenAI key | OpenAI官方 | 需要管理員設定信任，非任意BYOK自動可用 |

## 設計推論
獨立model caller、一般server只傳ref、網路層egress allowlist、最少依賴與CI無客戶key，是基於上述威脅模型提出的組合方案，不是文中任一供應商的既有架構宣稱。圖中省略ingestion，正文承認該入口仍短暫看見明文。未把費用額度當作防key讀取措施。

## 審稿修正
獨立事實review確認10列證據界線；修正「從資料庫移到env避免hardcode」為「從原始碼移到env」。獨立editorial review建議把圖的唯一取得者限縮成唯一有secret read權的應用身分，英文its改為組織帳戶計費，均已採納。
