# AI 服務與模型憑證外洩案例證據

查核日期：2026-11-01。責任：僅公開來源研究與此報告，未修改文章或其他檔案。
工具降級：完整 callable inventory 沒有 Groundlane，採 Exa search/fetch。各納入來源均無 query 全文擷取並讀取；沒有執行頁面內腳本，也沒有接觸外洩資料庫、實際 keys 或受害系統。

## 母群與選案界線

本輪是2024–2026公開一手揭露中，對「LLM / AI平台如何失去原始key或雲端憑證控制」有明確入口的目的性樣本。分別覆蓋主機漏洞、平台secret託管、日誌資料庫公開、跨租戶隔離。不是完整事件數量，也不推估上升趨勢。公開端點若只有prompt或資料外洩但未證明key/secret可讀，不納入key案例。

| 案例 | 類型 | 可證明的範圍 | 文章建議 |
|---|---|---|---|
| Sysdig LLMjacking（2024） | 已觀察到惡意入侵 | Laravel漏洞後取得雲端憑證並測試Bedrock等模型存取 | 主案例 |
| Hugging Face Spaces（2024） | 官方確認未授權存取，secret讀取範圍屬懷疑 | 平台secret相關未授權存取，HF撤銷部分token並建議更換全部keys/tokens | 主案例 |
| DeepSeek公開日誌DB（2025） | 研究者確認暴露 | 未認證ClickHouse可讀含API keys的log；未證明犯罪者已竊取或產生費用 | 主案例 |
| SAPwned（2024） | 負責任揭露研究 | 跨租戶/控制平面研究可取得自有測試帳戶託管的雲端secret明文 | 補充，不能寫成客戶已遭駭 |

## 1. Sysdig 原始 LLMjacking：主機漏洞 → 雲端憑證 → 模型存取

- 公開日期：2024-05-06。報告說近期觀察到攻擊，未給出可用作本案事件日的明確日期；不要把發布日當入侵日。
- 原始來源：https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack
- 一手作者：Sysdig Threat Research Team / Alessandro Brucato。
- 入口：使用有 Laravel CVE-2021-3129 漏洞的系統；攻擊者取得初始存取後外傳 cloud credentials。
- 被取得的秘密：雲端憑證，報告展示AWS IAM身份/CloudTrail；不能寫成十家provider的API key全部已被偷。
- 後續行為：發現腳本可檢查十種AI服務；本次攻擊針對Claude v2/v3存取，透過InvokeModel無效參數探測權限，並查模型日誌設定；觀察到與OAI Reverse Proxy一致的user agent。
- 外傳路徑：報告確認exfiltrated cloud credentials，但沒有交代本次秘密外傳的具體目的域名或傳輸協定；不應自行補成「.env被HTTP公開」或特定外傳URL。
- 證據短句："The credentials were obtained from ... a system running a vulnerable version of Laravel"。
- 影響界線：研究者展示驗證階段的呼叫，明說驗證階段未跑真正LLM查詢；報告中的每天46,000美元是依當時價格及多區quota推算的最壞情境，非受害帳單。本篇文章可完全不引該估算，以免誤導。
- 修復／建議：應用漏洞修補、secret管理與最小雲端權限；沒有供應商平台漏洞修復的說法。
- 可帶出的動作：[推論] 除了secret儲存，還要盤點能讀secret的應用身份、主機漏洞、雲端IAM。雲端角色若被偷，也能間接變成LLM存取。
- 讀取：Exa全文，約17k字元，已讀正文含Impact/Recommendations和CloudTrail示例。

## 2. Hugging Face Spaces：託管秘密服務本身遭未授權存取

- 公開日期：2024-05-31；官方稱當週稍早偵測到，沒有更精確時間。
- 官方來源：https://huggingface.co/blog/space-secrets-disclosure
- 入口：公告沒有公開根因或完整攻擊鏈，不能自稱是特定RCE、惡意模型或Wiz同年研究造成。
- 官方確認：Spaces平台發生與Spaces secrets相關的未授權存取。
- 秘密影響範圍：官方「懷疑」部分Spaces secrets可能被未授權讀取；已撤銷其中若干HF tokens並通知受影響使用者，建議更換任何key/token及使用fine-grained tokens。
- 外傳路徑：未公開；不可寫成已證明全部Secrets或全部LLM provider keys外洩。
- 證據短句："we have suspicions that a subset of Spaces’ secrets could have been accessed without authorization"。
- 修復：公告描述移除org tokens、導入KMS保護Spaces secrets、擴大外洩token辨識與主動撤銷，並與外部鑑識專家合作、通報主管機關。
- 與API key議題的關係：實際平台安全事件，但已知被撤銷的是HF access tokens；不是官方已確認OpenAI/Anthropic key遭盜刷。
- 可帶出的動作：[推論] 機密管理服務要有獨立權限、可追蹤讀取與快速撤銷；「設定成secret」不等於平台本身不會遭入侵。
- 讀取：Exa全文，短公告完整正文。

## 3. DeepSeek：公開的觀測日誌成了secret副本

- 公開日期：2025-01-29。研究者描述發現後立即通報、DeepSeek迅速關閉暴露，未提供完整存取鑑識或犯罪者時間線。
- 原始來源：https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak
- 一手作者：Wiz Research / Gal Nagli。
- 入口：與DeepSeek網域相關的ClickHouse，網際網路可達且無認證；HTTP介面允許查詢。
- 被暴露的秘密：log_stream中的明文Chat History、API Keys、backend details、operational metadata。原文沒有交代每個key種類、有效性、擁有者、是否客戶BYOK；不能寫成所有DeepSeek使用者key被偷。
- 外傳／取得：Wiz經HTTP SQL查詢讀取暴露資料；這是研究者確認「可讀」，不是已證實犯罪者曾下載。研究者亦明說沒有執行列舉以外侵入性查詢。
- 證據短句："Plaintext logs, including Chat History, API Keys, backend details, and operational metadata"。
- 修復：DeepSeek接獲通報後迅速保護暴露端點；不能無來源寫成已輪替所有暴露keys。
- 補充廠商／共同來源：https://www.wiz.io/blog/clickhouse-and-wiz （搜尋摘要有官方ClickHouse成員共同撰寫，尚未本輪抓讀；不用引用其額外修補細節，除非主agent另抓全文）。
- 可帶出的動作：[推論] 不只保護credential table，也要禁止log/APM/trace保留原始key，並把觀測儲存庫列入敏感資料與網路權限盤點。
- 讀取：Exa全文，已讀Exposure Walkthrough與Key Takeaways。

## 4. SAPwned：AI執行環境隔離不足，能取到託管的客戶雲端secret

- 時間：2024-01-25通報；2024-05-15 SAP部署全部修復；2024-07-17公開。
- 原始來源：https://www.wiz.io/blog/sapwned-sap-ai-vulnerabilities-ai-security
- 一手作者：Wiz Research / Hillai Ben-Sasson等。
- 入口：研究者是普通AI Core客戶，可合法執行訓練程式；組合隔離漏洞後繞過網路限制並接觸內部服務，再透過未認證Helm/Tiller取得cluster-admin。
- 暴露秘密：Loki配置中的AWS憑證、平台registry/Artifactory credentials；研究者在自有AI Core帳戶存放的AWS、SAP HANA、Docker Hub secret，可被以明文查得。文內亦證明一個Google Container Registry平台key有讀寫權限。
- 外傳／取得：研究者透過internal config/Kubernetes API查得；沒有已知犯罪外傳路徑。不是API key從加密DB遭密碼分析。
- 證據短句："we queried for those secrets, and managed to access all of them in plaintext"。
- 影響界線：負責任揭露的跨租戶風險研究，原文明說No customer data was compromised；不能寫成SAP客戶資料已遭盜取，也不能把自有測試secret當其他客戶的實際key樣本。
- 修復：SAP修復全部已通報漏洞，首輪也輪替相關secret；兩次修補間曾被研究者繞過，完整修復日期如上。
- 可帶出的動作：[推論] 使用者程式、模型、agent工具不應與可讀客戶secret的控制平面共用足以互通的身份與網路權限；只有網路一層而內部服務無認證會放大風險。
- 讀取：Exa全文，約15k字元，已讀每段Bug及Disclosure timeline。

## 未納入的候選

Replicate 2024 Wiz研究：https://www.wiz.io/blog/wiz-research-discovers-critical-vulnerability-in-replicate 。原始搜尋內容明確支持跨租戶prompts/results/webhook queue問題，但沒有API key/token被取出的證據。這適合AI隔離文章，不宜當「API key外洩案例」湊數；本輪未列入文章引用，未抓全文。

## 自審

- 區分「實際惡意入侵／官方懷疑secret存取／研究性暴露與PoC」：已分。
- API key與雲端access key／HF token：未混稱。
- 未使用實際外洩key、未連受害端點、未執行任何PoC。
- 所有主案例已取得一手正文；無摘要層級證據作正文結論。


---

# API key 外洩案例：供應鏈與 CI 證據

查核日期：2026-11-01。責任僅此檔；未修改文章或其他 repo 檔案，未執行來源內腳本。
工具：完整 callable inventory 無 Groundlane；公開資料改用 Exa search/fetch。候選由搜尋取得，採用結論均讀正文相關章節。無 secrets、私人資料或登入抓取。

## 範圍與去重

選 2025–2026 已披露的三條供應鏈／CI 攻擊鏈，重點為原始秘密被複製出去，不聲稱是完整事件母群。三條主案是 tj-actions/reviewdog、第一波 Shai-Hulud、LiteLLM/Telnyx；同鏈內套件不拆成多個獨立案例。另附 Nx/s1ngularity 作入口細節補充；Wiz 認為與第一波 Shai-Hulud 有承接關係，不能再把它當完全獨立的第四次攻擊來統計。

## 1. tj-actions / reviewdog：CI 記憶體裡的秘密，被寫進公開日誌

類型：一般 CI 憑證竊取，與託管 LLM keys 具同樣秘密處理風險；沒有一手證據顯示此案專門針對 LLM API key。

日期：tj-actions 惡意版本執行期間為 2025-03-14 至 03-15；reviewdog/action-setup@v1 的維護者另確認 03-11 18:42–20:31 UTC 被植入惡意碼。不要把 advisory 發布日 03-22 / 03-19 當事件發生日。

入口：tj-actions 的多個既有版本 tag 被重新指向惡意 commit，使用 tag 的下游 workflow 因此執行惡意程式。StepSecurity 調查指出 bot PAT 已遭取得，但精確最初取得方式未明。reviewdog 維護者確認其 action-setup 也遭污染；根因連結不宜超過來源證據。

取得什麼：惡意 Python 程式讀 GitHub Runner.Worker 記憶體，擷取標記為 secret 的內容；可能包含 API keys、雲端憑證、SSH key 等，實際以該 job 可存取者為準。

外洩方式：雙重 Base64 編碼後印到 workflow logs；公開 repo 的公開 logs 可被其他人取得。StepSecurity 明確表示沒有證據顯示秘密被傳至遠端網路目的地。下載 payload 用的 gist.githubusercontent.com 是載入路徑，不能寫成已證實的秘密上傳端。

確認與限制：維護者 advisory 確認記憶體到日誌的洩漏。23,000 是 action 使用範圍／潛在影響規模，不應寫成 23,000 家或每個 repo 都確認被偷 key。外層 action 固定 SHA 仍需檢查它的 transitive action 是否用 mutable tag；reviewdog advisory 指引用其 setup@v1 的其他 actions 也可能受影響。

可寫的教訓：[推論] CI 的秘密遮蔽不能當作對惡意 workflow 的防線；Base64 轉換就可能留下可解碼副本。限制 job 中可取得的 secrets，審查直接與間接 action，固定可信 commit SHA，並控制 runner 權限與網路。

一手來源（正文已讀）：
- 維護者 advisory：https://github.com/tj-actions/changed-files/security/advisories/GHSA-mw4p-6x4p-x5m5
- 調查者原文：https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised
- reviewdog 維護者 advisory：https://github.com/reviewdog/reviewdog/security/advisories/GHSA-qmg3-hpqr-gqvc
短證據：tj-actions advisory: “extracted secrets from the Runner Worker process memory”。StepSecurity: “There is no evidence that the leaked secrets were exfiltrated to any remote network destination.”

## 2. 第一波 Shai-Hulud：安裝依賴就開始搜 key，還用偷來的 token 繼續污染其他套件

類型：一般 npm／雲端憑證竊取，並非已證實的特定 LLM API key 外洩案。

日期：GitHub 表示 2025-09-14 收到通報；Wiz 09-16 報告描述 09-15 出現惡意套件。文章可用「2025 年 9 月」避免把通報、發現與發布混成精確起始時點。本案指第一波，不混入 11 月 Shai-Hulud 2.0。

入口：受入侵的維護者帳號發布含惡意 postinstall script 的正常知名 npm 套件；下游安裝時執行。取得 npm token 後，蠕蟲會發布該 token 有權修改的其他套件惡意版本。

取得什麼：環境變數、秘密掃描發現的 credentials，環境可達時的雲端 metadata 憑證；GitHub、npm 等 token。Wiz 實際觀察到 workflow logs 中有 GitHub/npm/Atlassian/Datadog 等 secrets，不可因此說每個受影響者所有雲端 key 都被偷。

外洩方式：建立公開 Shai-Hulud GitHub repositories 上傳 secrets；另新增 workflow，將 repo secrets 送至 webhook.site，並可能把私人 repo 複製為公開 repo。Wiz 說該 webhook 後來被平台停用，但 GitHub logs／公開 repo 的外洩路徑仍需處理，不能寫成 endpoint 關掉就完成止血。

確認與限制：GitHub 平台確認秘密竊取、蠕蟲行為及移除 500+ 套件；該數為移除套件數，不是確認受害組織或被盜 API key 數。Wiz 對與 Nx/s1ngularity 的關係是 research assessment，保留歸因語氣。

可寫的教訓：[推論] build/install 環境不應拿到正式客戶 key；開發機的長效 token 和其他專案秘密會擴大影響。除了 lockfile，需管控套件生命週期 script、建置環境的身份和網路，以及新版本更新來源。

一手來源（正文已讀）：
- GitHub 平台：https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/
- Wiz 原始調查：https://www.wiz.io/blog/shai-hulud-npm-supply-chain-attack
短證據：GitHub: “the capability to steal multiple types of secrets”。Wiz: “It creates a public repository named Shai-Hulud containing a dump of harvested secrets”。

## 3. LiteLLM / Telnyx：模型 SDK 的惡意版本，直接搜環境變數與雲端秘密

類型：直接涉及 AI SDK／gateway 的供應鏈事件；惡意碼竊取多種秘密，不限 LLM API key。與前文既有 LiteLLM 案是同一案補強，Telnyx 是同一波供應鏈事件下另一受污染專案，不另加一次獨立攻擊計數。

日期：LiteLLM 受污染套件於 2026-03-24 發布；PyPI 2026-04-02 發布跨 LiteLLM/Telnyx 事件處理報告。

入口：PyPI 證實 Trivy 依賴遭利用後的 API token 外洩，導致 LiteLLM 與 Telnyx 發布被植入竊密碼的套件。LiteLLM 廠商點名 1.82.7／1.82.8 受影響，包含 proxy_server.py payload 與 1.82.8 的 litellm_init.pth。

取得什麼：LiteLLM 通報列環境變數、SSH keys、AWS/GCP/Azure credentials、Kubernetes tokens、DB passwords 等。這說明把 key 存在 env 並不能防止同機／同程序惡意程式讀取。

外洩方式：竊取內容加密後，HTTP POST 至 models.litellm[.]cloud；廠商明確說此域名不是官方域名。另在 IoCs 列 checkmarx[.]zone。

確認與限制：不是所有 LiteLLM 使用者都受影響。廠商明列官方 Proxy Docker image、LiteLLM Cloud 與未安裝惡意版本的部署不受這次事件影響；PyPI 下載量不代表每次都執行payload或每個使用者都外洩。廠商說約40分鐘、PyPI 跨平台報告說 upload→quarantine 2h32，時間定義/資料不一致，文章不引用精確暴露分鐘數。

可寫的教訓：[推論] DB 加密和 Secret Manager 保護靜態儲存，不能阻止有讀取權限的程序載入惡意依賴後複製 key。持有 key 的 adapter 應採極小依賴面、隔離身份與網路限制；建置不注入正式客戶秘密。發現受污染程序後，應撤銷程序可取得的秘密，不能只升級套件。

一手來源（正文已讀）：
- PyPI 平台事件報告：https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/
- LiteLLM 廠商：https://docs.litellm.ai/blog/security-update-march-2026
短證據：PyPI: “releases of the packages `litellm` and `telnyx` were published to PyPI containing credential harvesting malware”。LiteLLM: “Any secrets stored in environment variables or configuration files”。

## 補充入口：Nx / s1ngularity，2025-08-26（與 Shai-Hulud 可能承接，勿獨立統計 campaign）

Nx 的 2025-09-05 postmortem 完整解釋：pull_request_target 下未清理的 PR title 可注入 shell；workflow token 過寬；攻擊者修改 branch 並觸發 publish workflow，取得 NPM_TOKEN，再發布帶 postinstall hook 的 Nx 套件。惡意套件搜使用者系統資料，嘗試使用本機 Claude/Gemini 工具，透過 GitHub CLI 把結果推到公開 repo。Nx Cloud 不受此事件影響。

可用原句：“attempted to use local AI tools (like Claude and Gemini)”。這不等於 Claude/Gemini 服務本身被入侵，也不代表已證明成功取得所有模型 key。

一手完整正文：https://nx.dev/blog/s1ngularity-postmortem
若文章希望多一個具體技術入口，可獨立介紹此時間點，但寫明與後續 Shai-Hulud 可能相關，不用它增加「獨立攻擊」數字。

## 排除：Qix / chalk / debug，2025-09-08

已讀 Socket 原始分析的攻擊與技術段落：https://socket.dev/blog/npm-author-qix-compromised-in-major-supply-chain-attack

維護者被假 2FA 重設郵件釣魚，套件遭污染；但下游 payload 主要在瀏覽器攔截加密貨幣交易、改收款地址。沒有證據把這波描述為下游 LLM API key竊取。因此可作供應鏈旁證，不能拿它充API key外洩案數。

## 敘事建議

可把三條主案對應三個漏口：CI記憶體→公開日誌；套件安裝→開發機與雲端身份；模型SDK→正式執行環境秘密。文章應說「選取不同外洩路徑的案例」，不要拿這些非隨機樣本宣稱事件發生率上升多少。
