# 個人功能統一登入與 Cloudflare Access

這份文件說明待啟用的設定；程式碼存在不代表正式環境已建立 Access 或套用資料庫 migration。

## 保護範圍

單一 self-hosted Access application `QuidProQuo Personal` 使用同一個 JWT audience。`quidproquo.cc` 與 `www.quidproquo.cc` 都保護下列路徑及其子路徑：

| 目的地 | 用途 |
| --- | --- |
| `/account`、`/auth` | 私人空間與統一登入 |
| `/vocabulary`、`/en/vocabulary`、`/api/vocabulary` | 完整詞條、筆記與複習進度 |
| `/api/personal` | 英文口說、面試準備進度及私人 AI 對話 |
| `/admin`、`/api/admin` | 現有管理介面與管理 API |
| `/api/deep-research` | 已有私人研究工作與報告 |
| `/api/auth/logout` | 統一登出 |

公開文章、`/english`、`/interview`、`/chat` 及其公開功能仍可使用；私人紀錄透過受保護 API 連接。這次接入既有功能，沒有新增文章書籤或獨立文章筆記產品。

`/api/admin` destination 有下列精確的 public override，保留機器流程自己的驗證，不代表免驗證：

- `/api/admin/webhooks/github`、`/api/admin/webhooks/discord-interactions`：來源簽章。
- `/api/admin/sessions/runner/ws`：runner bearer token。
- `/api/admin/sessions/scheduled`、`/api/admin/site/pipelines/scheduled`：排程 secret。
- `/api/admin/routines/*/fire`：每個 routine 的 bearer token。

Approval API 不豁免。`/api/index/posts/sync`、`/api/crawl/sync`、`/api/embed/sync` 也保留原有機器驗證，不加上互動式 Access 登入。權威的應用端邊界是 `src/lib/auth/access-routes.ts`。

預設只允許 `vincent.xu.work@gmail.com`，使用既有的 One-time PIN（寄信驗證碼）登入。這是部署者從現有帳號確認的初始 allowlist，並非開放註冊或 Allow Everyone。`--email` 只提供明確替換唯一帳號，這次設定不新增其他人。腳本不會建立或修改組織及身分提供者，不會修改其他 Access applications。

Worker 驗證 Access JWT 的簽章、issuer、audience、有效期限及明確 email allowlist，再依已驗證的 subject 隔離 DB 資料；不能只信任 email header。未登入呼叫 API 時，Access 可能回傳登入 redirect/HTML；前端顯示登入入口，不會把它當作成功儲存。

## AI 對話紀錄

聊天預設保留原有本機逐字稿。按「儲存到雲端」才匯入並啟用這一段對話後續自動同步；「新對話」會重設同步選擇。雲端保存最近最多 40 則文字訊息（總長有上限），不保存 UI 串流旗標或執行步驟。列表顯示最近 50 段雲端對話，可載入或刪除。

載入會替換畫面上的對話，切換前留一份本機備份，提供「還原切換前對話」。刪除雲端副本不清除目前本機內容。雲端修改使用 revision；其他裝置先更新時回傳 conflict，停止自動同步並保留本機內容，使用者重新載入後再決定如何儲存。POST 也檢查客戶端預期 owner，登入帳號改變時不能把舊帳號對話悄悄寫入新帳號。

`/api/chat` 的 checkpoint、log 及語意快取 thread scope 由已驗證 Access subject 加 client thread ID 雜湊產生，不接受 client ID 直接查 DB。訪客每次取得新的 scope，不讀取或寫入延續性 checkpoint；訪客對話脈絡仍由原有本機逐字稿的近期訊息提供。舊版未分 owner 的 checkpoint 不會再被公開 ID 讀到。

D1 migrations `0037_vocabulary.sql`、`0038_personal_progress.sql`、`0039_personal_chat.sql` 的遠端套用、Worker vars 設定及部署是另外的啟用步驟。

## 建立前的憑證

目前的 Wrangler OAuth 沒有設定 Access Apps and Policies 的權限；腳本也不會讀取 Wrangler 的憑證檔。請在 Cloudflare 建立限定此帳號 `1ff43f0d4c3ad3bd98ce5ab767546a68` 的 API token，給予：

- **Access: Apps and Policies — Edit/Write**。
- **Access: Organizations, Identity Providers, and Groups — Read**。

只透過執行環境注入 `CLOUDFLARE_API_TOKEN`。不要把 token 當成命令列參數、貼到聊天、寫入 repo 或放進 Worker 公開 vars。以下命令假設環境已安全注入 token，不含任何 token 值。

若帳號尚無 Zero Trust organization 或 One-time PIN 身分提供者，先在 Cloudflare Zero Trust 的設定完成它們。腳本遇到缺少設定會停止，且不會偷偷改用其他 IdP 或建立開放政策。

## 審查與套用

先檢查離線計畫，不需 token、不呼叫 API：

```sh
node scripts/setup-vocabulary-access.mjs --dry-run
```

若執行環境已有 token，相同命令會以 GET 查組織、應用程式與 IdP，列出實際預計設定，仍不會寫入：

```sh
node scripts/setup-vocabulary-access.mjs --dry-run --email vincent.xu.work@gmail.com
```

確認所有目的地、機器豁免與唯一 email 後，才執行明確的套用命令：

```sh
node scripts/setup-vocabulary-access.mjs --apply --email vincent.xu.work@gmail.com
```

腳本只建立上述命名的 app，或更新該 app 的受管理設定；相同設定重跑不會再次寫入。若同名 app 有多個，或既有 app 的 policy 不是腳本預期的唯一 `Personal owner`，會停止供人工審查。套用不是 transaction；若 API 寫入成功但連線中斷，先重跑 dry-run 查核，不要自行刪 app。

輸出中的下列值不是秘密，需要填入 Worker 的對應 vars（腳本不自動改 `wrangler.jsonc`）：

```text
ACCESS_TEAM_DOMAIN=https://<team>.cloudflareaccess.com
ACCESS_AUD=<此 app 的 audience>
ACCESS_ALLOWED_EMAILS=vincent.xu.work@gmail.com
```

audience 必須從實際建立的 app 取得，不能用 app ID 或 account ID 代替。Access 設定完成後，仍需完成 D1 migration、Worker vars 設定與部署，才能宣稱正式環境可用。

## 啟用驗收

1. 未登入存取 `/vocabulary` 導向 Access；公開文章仍可直接閱讀。
2. 唯一 allowlist email 可取得 PIN 並登入；其他 email 無法登入。
3. 登入後收藏可從 DB 重新載入，另一台裝置以同一身分登入可看到同一批單字。
4. 缺少、偽造、過期或 audience 不符的 JWT 無法存取資料；不能以 header 冒用他人。
5. 本機 AI 對話未按儲存前不進個人雲端紀錄；儲存、跨裝置載入、刪除與 revision conflict 都符合上述行為。
6. webhook、runner、排程與 routine fire 仍以原有憑證運作，偽造憑證無法通過。
7. 初次匯入現有 localStorage 的收藏前後核對筆記及複習進度；同步成功前保留本機副本。

## 官方參考

- [建立 Access application：destinations、allowed_idps、inline policies](https://developers.cloudflare.com/api/resources/zero_trust/subresources/access/subresources/applications/methods/create/)
- [讀取 Zero Trust organization：auth_domain 與所需權限](https://developers.cloudflare.com/api/resources/zero_trust/subresources/organizations/methods/list/)
- [Access identity provider 型別及權限](https://developers.cloudflare.com/api/resources/zero_trust/subresources/identity_providers/methods/get/)
