---
title: "LLM API key 怎麼防外洩：託管金鑰、供應鏈與出站限制"
date: 2026-11-01
category: ai
type: deep-dive
tags: [ai-security, security, llm, supply-chain]
lang: zh-TW
tldr: "客戶的 LLM API key 存進資料庫後，仍可能從日誌、惡意套件、代理設定或託管平台流出。縮小能取得原始 key 的服務，再加上供應商端來源限制，才能同時處理外洩入口與複製後的使用。"
description: "比較 OpenCode Console、LiteLLM、DeepSeek、Hugging Face 等憑證事件與漏洞研究，說明資料庫加密、Secret Manager、獨立模型呼叫服務、固定出口 IP 與短效身分各自能守住什麼。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-11-01-llm-api-key-leaks-en)

替組織做 AI 產品，常會遇到這個需求：客戶提供自己的模型 API key，平台代為保存、呼叫，費用由客戶的模型帳戶支付。這種方式通常叫作自帶金鑰（BYOK）。在這篇文章裡，它指的是模型服務的存取憑證，不是客戶自管資料加密金鑰。

對替公司做中文客服、課程摘要或內部助理的團隊，真正難回答的問題是：「平台被入侵時，客戶的完整 key 會不會被複製走？」拿到 key 的人可能直接找模型供應商發送請求，繞過平台的使用者權限與次數限制。

以下以公開案例檢查這條外洩路徑，再提出適合託管客戶 key 的架構。案例偏向有技術通報的英文來源，涵蓋 AI 服務與相關供應鏈；其中有實際入侵，也有研究者證明可讀取的漏洞。它們用來比較防線，不代表完整事件統計。

## TL;DR

保留資料庫加密，接著問三件事：**誰能解密、明文會流到哪裡、複製出去後能不能使用。**

一般業務服務只持有憑證識別碼，只有受隔離的模型呼叫服務能取出原始 key。建置與測試環境不提供客戶 key，日誌也不保留副本。供應商支援時，再限制固定出口 IP，或改用短效工作負載身分。

## 情境：客戶把 key 交給平台，平台就多了一項保管責任

API key 通常是一種「持有即可使用」的憑證。平台可以讓組織成員只看見末四碼，卻仍得在某個位置取得完整值，才能替客戶呼叫供應商。[OpenAI 的安全指引](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)也要求模型請求經過後端，避免把 key 部署到瀏覽器或行動應用程式。

前端不顯示完整值，解決的是使用者讀回與意外分享。平台背後的服務、部署身分、除錯工具和相依套件，仍可能接觸秘密。安全設計要沿著這條路繼續追。

## 問題：外洩入口遠超過那張憑證資料表

先把案例的證據程度分開。表中的「研究」表示研究者示範了風險，不等於犯罪者已利用；「通用供應鏈」則不是專門針對 LLM key 的事件。

| 案例與時間 | 秘密如何暴露 | 已知範圍與該守的地方 |
|---|---|---|
| [OpenCode Console，2026 年 10 月報導](https://techcrunch.com/2026/10/19/hackers-hit-ai-coding-tool-opencode-running-up-charges-on-users-ai-accounts/) | 媒體轉述平台公告：託管 Console 發生入侵，部分工作區保存的第三方模型 key 受影響 | 涉及 Console，不等於本機 CLI 的 key 全部外洩；報導未交代完整入侵根因與儲存方式 |
| [LiteLLM／Telnyx，2026 年 3 月](https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/) | 正常套件被植入蒐集憑證的惡意程式 | 是供應鏈入侵；不能把所有使用該套件的部署都當成受害者 |
| [Google／Gemini，2026 年 2 月披露](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules) | 原本公開使用的 Google key，因同專案啟用 Gemini 而取得敏感 API 的存取能力 | 歷史權限與預設值問題；公開識別用途與 AI 憑證要分離 |
| [AWS／Bedrock，2026 年 2 月報告](https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes) | 攻擊者從公開儲存桶取得雲端憑證，提升權限後濫用模型服務 | 是實際雲端入侵；被偷的是雲端身分，不能改稱 OpenAI key |
| [DeepSeek，2025 年 1 月](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak) | 研究者從無認證的日誌資料庫讀到含 API keys 的明文紀錄 | 證實資料可讀；未交代每把 key 的種類、有效性，也未證實犯罪者曾下載 |
| [AgentSmith／LangSmith Prompt Hub，2025 年 6 月披露](https://noma.security/blog/how-an-ai-agent-vulnerability-in-langsmith-could-lead-to-stolen-api-keys-and-hijacked-llm-responses) | 採用含惡意代理設定的公開範本後，模型流量與 key 被送往代理 | 研究示範；修補已於前一年完成，研究者未發現實際濫用證據 |
| [Hugging Face Spaces，2024 年 5 月](https://huggingface.co/blog/space-secrets-disclosure) | 官方偵測與 Spaces secrets 有關的未授權存取，懷疑部分秘密可能被讀取 | 已撤銷部分 token；不能擴寫成所有模型供應商 key 均遭竊 |
| [SAP AI Core／SAPwned，2024 年 7 月披露](https://www.wiz.io/blog/sapwned-sap-ai-vulnerabilities-ai-security) | 研究者突破執行環境隔離，取得自己測試帳戶託管的雲端秘密明文 | 跨租戶風險研究，已修復；來源明示沒有客戶資料遭入侵 |
| [tj-actions／reviewdog，2025 年 3 月](https://github.com/tj-actions/changed-files/security/advisories/GHSA-mw4p-6x4p-x5m5) | 惡意 CI action 從 runner 記憶體擷取秘密，編碼後印進工作日誌 | 通用供應鏈；公開日誌可能成為可解碼副本，不需要另外上傳到陌生網站 |
| [第一波 Shai-Hulud，2025 年 9 月](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/) | 惡意套件在安裝階段搜尋秘密，並利用偷來的 token 繼續污染套件 | 通用憑證竊取與蠕蟲事件；不代表每個環境都曾放置 LLM key |

這些入口會導向不同的修補工作。公開資料庫要修網路與認證；代理設定要限制帶認證的目的地；惡意套件則逼你檢查執行環境究竟能讀到哪些秘密。

### 原始 key 沒出現在 UI，仍可能被平台自己送出去

[AgentSmith 的研究](https://noma.security/blog/how-an-ai-agent-vulnerability-in-langsmith-could-lead-to-stolen-api-keys-and-hijacked-llm-responses)很適合提醒做工作流程產品的團隊：外部範本如果能決定模型請求走哪個代理，使用者填入的 key 就可能跟著正常請求離開。

因此，核准使用一把 key 的權限，必須與變更請求目的地的權限分開。只檢查「這個人能不能執行摘要」仍少了一步：這次帶著 key 的請求，最後會到哪裡？

### 日誌和安裝環境，會長出另一份秘密

[DeepSeek 的公開日誌資料庫](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak)說明，憑證資料表之外還可能有可讀副本。[LiteLLM 的廠商通報](https://docs.litellm.ai/blog/security-update-march-2026)則列出惡意套件會蒐集環境變數、雲端憑證等資料，再外傳到非官方網域。

把 key 從原始碼移進環境變數，可以避免一些硬編碼問題；同一個執行環境裡的惡意程式，依然可能讀取它。至於 [tj-actions 的調查](https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised)，更顯示編碼後印進日誌，就足以形成外洩路徑。

## 嘗試過程：把常見保護逐一對上威脅

檢查架構時，可以用下表找出缺少的防線。這是依前述事件與 [OWASP 秘密管理指引](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)整理的設計判準。

| 已做的保護 | 主要保護什麼 | 還需要補什麼 |
|---|---|---|
| 資料庫加密 | 資料庫或備份單獨被取得時，原文不直接可讀 | 解密金鑰分離、最小解密權限 |
| 環境變數 | 避免把 key 寫死在原始碼 | 防止同環境惡意程式讀取、限制依賴與執行身分 |
| Secret Manager | 集中儲存、授權與稽核 | 約束有權取用秘密的服務，以及取用後的明文流向 |
| 畫面遮蔽與末四碼 | 避免一般成員直接讀回、截圖分享 | 保護 API、日誌、追蹤系統與執行記憶體 |
| 平台每日呼叫額度 | 控制經過平台的請求 | 供應商端來源限制與撤銷；複製走的 key 可繞過平台 |

[金鑰管理服務（KMS）與 Secret Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)都值得使用，但它們沒有讓持有解密權限的服務免於入侵。若同一個身分能讀取所有客戶的秘密，逐客戶加密也不會自動形成存取權限隔離。

## 解法：縮小原始 key 的持有範圍

### 先建立一個只負責模型呼叫的服務

對一般 BYOK 產品，我會把取得 key 與呼叫供應商收在獨立服務中。業務後端完成身分與組織授權後，只交出憑證識別碼和受限的呼叫請求。只有模型呼叫服務可以讀取對應秘密，並送往核准的供應商端點。

```diagram
title: 原始 key 留在模型呼叫邊界
desc: 業務後端傳遞憑證識別碼，獨立服務取得秘密並呼叫供應商；一般後端沒有讀取原始 key 的權限。
caption: 建議架構，省略初次輸入與保存 key 的路徑；該入口同樣必須避免記錄明文。
---
<svg viewBox="0 0 400 592">
  <line class="dg-line" x1="200" y1="104" x2="200" y2="188" marker-end="url(#arrow)"/>
  <line class="dg-line" x1="200" y1="268" x2="200" y2="340" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M328 228 H368 V524 H328" fill="none" marker-end="url(#arrow-link)"/>
  <rect class="dg-box" x="72" y="32" width="256" height="72" rx="6"/>
  <text class="dg-label" x="200" y="58" text-anchor="middle" dominant-baseline="central">業務後端</text>
  <text class="dg-sub" x="200" y="80" text-anchor="middle" dominant-baseline="central">完成組織授權，不讀取 key</text>
  <text class="dg-edge" x="268" y="144" text-anchor="middle" dominant-baseline="central">憑證識別碼</text>
  <rect class="dg-box dg-box--accent" x="72" y="188" width="256" height="80" rx="6"/>
  <text class="dg-label" x="200" y="216" text-anchor="middle" dominant-baseline="central">獨立模型呼叫服務</text>
  <text class="dg-sub" x="200" y="240" text-anchor="middle" dominant-baseline="central">唯一有秘密讀取權的應用身分</text>
  <rect class="dg-box dg-box--store" x="72" y="340" width="256" height="72" rx="6"/>
  <text class="dg-label" x="200" y="366" text-anchor="middle" dominant-baseline="central">秘密儲存服務</text>
  <text class="dg-sub" x="200" y="390" text-anchor="middle" dominant-baseline="central">按憑證授權、保留讀取稽核</text>
  <rect class="dg-box dg-box--link" x="72" y="488" width="256" height="72" rx="6"/>
  <text class="dg-label" x="200" y="514" text-anchor="middle" dominant-baseline="central">模型供應商</text>
  <text class="dg-sub" x="200" y="538" text-anchor="middle" dominant-baseline="central">只允許核准端點與固定出口</text>
</svg>
```

這個服務要有自己的工作負載身分與窄範圍權限。它不能接受任意網址、任意憑證識別碼就轉送；仍須驗證請求屬於哪個組織、允許哪個用途，以及指定憑證是否屬於該組織。一般管理者也不提供「顯示完整 key」或批次匯出功能。

第一次保存 key 的入口仍會短暫看見原文。應使用 TLS，關閉該請求的內容記錄，寫入後只回傳狀態。這套架構縮小持有者，沒有消除所有明文接觸點。

**可以先做的事：**列出所有能讀取秘密或執行解密的服務身分，把一般後端不需要的權限移除。[AWS 的建議](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)也把秘密存取限制、稽核與私有網路列為重要防線。

### 再把依賴、日誌與出站網路一起收緊

持有原始 key 的服務，應盡量少載入非必要套件，也不執行使用者上傳的程式、外部 agent 工具或 shell 工作。建置與安裝套件時不要注入客戶 key；正式執行時才以服務身分取用。

依賴固定版本與校驗值，更新經過審查。對一般更新保留等待時間，為緊急安全修補另留快速路徑。[PyPI 在 LiteLLM 事件後的指引](https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/)也建議 lockfile、依賴更新等待期與更安全的發布流程。鎖定一個惡意版本，並不會讓它變安全。

日誌採允許清單，只記組織識別碼、憑證版本、請求識別碼與結果。完整 key、認證標頭、請求內容與上游原始錯誤不要直接收進日誌或追蹤平台。[OWASP Logging 指引](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)明列 access tokens、加密金鑰與主要秘密應移除或去敏。

出站限制要由網路政策執行，只允許必要的供應商與秘密儲存服務。應用程式還要檢查帶認證的最終目的地及重新導向。這能阻擋常見的任意網站外傳，仍須處理允許端點被濫用等風險。

**可以先做的事：**放一把合成測試 key，跑正常請求、輸入驗證失敗、逾時與供應商錯誤，再搜尋 API 回應、日誌、追蹤紀錄與畫面重播是否出現它。不要拿客戶真 key 做這個測試。

### 最後限制「拿到副本後」能做什麼

供應商支援時，把客戶的專用 key 限制在平台固定出口 IP。[OpenAI 的現行文件](https://help.openai.com/en/articles/20001201-ip-allowlisting-for-openai-api)說明，未列入允許清單的來源，即使持有有效 key 也會被拒絕。

這層特別針對「帶離平台直接使用」。若攻擊者控制了允許的主機，或能透過它代理流量，來源限制仍可能被繞過。瀏覽器的 CORS 與網站來源檢查，也不能代替供應商端的 IP 驗證。

能不用長效 key 的整合，可評估短效工作負載身分。[OpenAI workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation)能以受信任的外部身分交換短效存取 token。這需要組織管理員事先設定信任與服務帳戶對應，不是貼上任意供應商 key 就自動支援。

**可以先做的事：**請客戶替這個產品建立獨立專案與最低權限憑證，再從允許與不允許的出口各測一次。確認外洩時，要在供應商端撤銷；只刪除平台保存值，不會讓攻擊者手上的副本失效。

## 為什麼會這樣：加密保護的是一個狀態，呼叫需要跨過好幾個邊界

秘密從保存、解密、交給 SDK，到送出網路請求，每一步都可能多一份副本。加密主要保護靜態儲存；執行期仍得由某個身分取得可用憑證。這也是為什麼 [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)把存取控制、記憶體中的秘密、稽核、輪替與撤銷分開處理。

應用程式裡的遮蔽與秘密參照，可以減少意外記錄；程序隔離與服務身分則決定誰真的能讀取原文。特定工具如何處理參照與執行期明文，可另看站上的 [OpenClaw 存取控制](/posts/ai/2026-03-28-openclaw-auth-secrets)。

## 學到的事：驗收要證明其他服務拿不到 key

對託管客戶憑證的產品，我會用以下結果驗收：

- 單獨取得資料庫備份，無法還原原始 key。
- 一般業務後端的身分，無法讀取秘密或執行解密。
- 模型呼叫服務無法把帶 key 的請求送往任意網址。
- 成功與失敗路徑，都不在日誌、錯誤回應與追蹤平台留下完整 key。
- 啟用來源限制後，其他出口使用同一把 key 會被供應商拒絕。
- 供應商撤銷舊 key 後，舊副本確實無法再用。

預算上限與異常費用告警仍值得設，但它們負責減少損失。要降低完整 key 被取得的機會，先把秘密的持有者、複製點與出站目的地管住。

## 參考資料

- [PyPI：LiteLLM／Telnyx 供應鏈事件與防護指引](https://blog.pypi.org/posts/2026-04-02-incident-report-litellm-telnyx-supply-chain-attack/)
- [LiteLLM：2026 年 3 月安全事件通報](https://docs.litellm.ai/blog/security-update-march-2026)
- [Truffle Security：Google API keys 與 Gemini 權限問題](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules)
- [Google：Gemini API key 現行類型與安全設定](https://ai.google.dev/gemini-api/docs/api-key)
- [Sysdig：公開儲存桶憑證導致雲端入侵與 Bedrock 濫用](https://www.sysdig.com/blog/ai-assisted-cloud-intrusion-achieves-admin-access-in-8-minutes)
- [Wiz：DeepSeek 公開日誌資料庫](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak)
- [Noma：AgentSmith 惡意代理設定研究](https://noma.security/blog/how-an-ai-agent-vulnerability-in-langsmith-could-lead-to-stolen-api-keys-and-hijacked-llm-responses)
- [Hugging Face：Spaces secrets 未授權存取公告](https://huggingface.co/blog/space-secrets-disclosure)
- [Wiz：SAPwned 隔離漏洞研究](https://www.wiz.io/blog/sapwned-sap-ai-vulnerabilities-ai-security)
- [tj-actions：changed-files 安全通報](https://github.com/tj-actions/changed-files/security/advisories/GHSA-mw4p-6x4p-x5m5)
- [StepSecurity：tj-actions 記憶體與工作日誌外洩調查](https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised)
- [GitHub：Shai-Hulud 與 npm 供應鏈安全](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/)
- [TechCrunch：OpenCode Console 事件報導（媒體轉述）](https://techcrunch.com/2026/10/19/hackers-hit-ai-coding-tool-opencode-running-up-charges-on-users-ai-accounts/)
- [AWS Secrets Manager 最佳實踐](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OpenAI API key 安全指引](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [OpenAI IP allowlisting](https://help.openai.com/en/articles/20001201-ip-allowlisting-for-openai-api)
- [OpenAI workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation)
