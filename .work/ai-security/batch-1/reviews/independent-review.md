# 最終複核狀態：獨立內容審閱結案

原兩項必修已修正，以下保留初審問題與當時行號供追溯。2026-10-22 末輪重新讀取總覽兩語全文、第一篇新增引用與 IANA 原始抽取後，未發現新必修。這是內容審閱結案；全站 verify、圖最終預覽及發布狀態由主 agent 另行報告。

- **原必修 1 已解決**：目前總覽中文 :132／英文 :131 明確區分「答案外洩、評分漏洞造成假成功」與「只改本機副本的無效嘗試」，符合 NIST §2.1–2.3。
- **原必修 2 已解決**：目前中文 :107／英文 :106 都只表示本篇與第 1 篇可一起讀，其他篇是計畫；不再一語稱已完成另一語稱草稿。四檔 frontmatter 仍 draft: true；交稿訊息應明講本機草稿、尚未發布。
- **新圖已複核內容**：中文 :46–66／英文 :45–65 改為 viewBox 400×500 的靜態 SVG，5 節點、4 箭頭，保持可信身分→API授權→允許資料→模型工具請求→工具授權執行。title／desc 與正文吻合；兩語已刪播放、按鈕操作描述。沒有新增安全主張；視覺溢出及深淺／手機檢查由主 agent 最終 preview 確認。
- **IANA 補引已確認**：兩語第一篇 :122 內文與 :151 參考有官方 registry 連結；已讀本批 `iana-http-status.json`，200=OK、400=Bad Request、401=Unauthorized、403=Forbidden、404=Not Found。文章用的是這個範例的狀態語意，仍清楚說是函式回傳值、沒有發送 HTTP 請求。
- **建議仍屬非阻擋**：總覽中文 :78 的 Alice原本 空格、Python 支援版本精確度、總覽 ai-security tag。未把這些風格／舊版本相容性建議升級為必修。
- Python 原檔本輪未改，沿用已執行的 9 案例證據；沒有無理由重跑全站驗證。

---

# 第一批獨立審閱

日期：2026-10-22。只讀四篇全文與 Python 原檔；唯一寫入為本報告。主 agent 仍在修改，行號以本次末次讀取為準（總覽已刪 default tone、統一 Alice/north/N-1/S-1）。未 commit/push。

## 結論與必修

1. **事實／必修：NIST 無效嘗試被併入假成功。** `overview-en.md:209` 明說 exposed answers、grading loopholes、changes to wrong copy 都能 produce apparent success；`overview.md:210` 的併列接「最後拿到高分」也易造成同樣誤解。原文 §2.3 說修改本機副本未影響 remote target，這類策略 **never effective**；§2.1–2.2 才是取得成功評分的案例。建議改成：「NIST 展示了透過外洩答案與評分漏洞取得成功評分的案例，也記錄了只改本機副本、未影響遠端目標的無效嘗試。驗收要對準原本的任務與實際目標。」中英同步；無須塞入查詢歷史或多層歸因。
2. **交付狀態／必修：總覽兩語對稿件狀態說法不同。** `overview.md:185` 說已完成的入門篇可直接點開；`overview-en.md:184` 明講 draft alongside this overview。四檔均 `draft: true`，本輪是本機交稿，不能由內文暗示已公開可讀。中文建議：「本批已附總覽與第 1 篇草稿，其餘為預定主題。」最後交付訊息也要說明本機草稿、尚未發布。站內連結可留作發布時的連接。

## 建議修

- **語氣／低優先** `overview.md:156` 主 agent 統一名稱後出現「Alice原本」，補空格。
- **機械／相容性／低優先** 第 1 篇兩語 `:70` 寫 Python 3；原檔使用標準庫 `dataclasses`，實際最低 Python 3.7。可直接要求仍在支援期的現代 Python 3，或寫「Python 3.11 以上（本次以 3.11.15 執行）」，避免讓 Python 3.6 使用者誤以為不需安裝套件即可跑。不是現代 Python 環境的執行缺陷。
- **tag 一致性／低優先** 總覽 tags 缺 `ai-security`，第 1 篇已有。若希望系列主題可由 tag 聚合，總覽可把泛稱 `security` 換成 `ai-security`；不必增加到五個。

## post-verify

### 工具與來源範圍

已讀完 post-verify、post-review、post-polish 三份 SKILL.md。讀取本批 research-note、authorization 正文相關章、舊研究 source-07（NIST）及 source-09（HackerOne security page）全文、source-08 safe-harbor scope 相關正文。完整 callable inventory 無 Groundlane 工具，依規則改用 **Exa MCP web_fetch_exa** 補讀 Microsoft multitenant RAG、MCP 固定 2025-11-25 版與 OWASP MCP 官方公開正文；不使用搜尋摘要作 Confirmed。沒有存取私有資料、秘密或退役抓取工具。

Microsoft 全文約一萬多字元，包含 Identity、Define requirements、Data filtering、Encapsulate data logic；MCP 大批輸出被截斷後，另抓 Session Hijacking 整段補讀，不把截斷區當完成閱讀。未重新驗證所有外鏈狀態，平台規則亦未當法律保證。

### 重要主張逐條判讀

| 位置（zh；en 對應同節） | 主張 | 判定及依據 |
|---|---|---|
| overview:35 | NIST 區分保護 AI、AI 強化威脅、AI 輔助防禦 | 既有完整 NIST 抽取與 foundation reading-note 一致；系列自行展開攻擊流程，未冒充 NIST 原教學分類 |
| overview:37 | 一般授權問題不都等同 prompt injection | 概念分界正確；本文具體例子是物件授權，無需宣稱測了注入 |
| overview:41–43 | 租戶與先取授權資料再送模型 | Confirmed single-source，Microsoft 定義與 workflow |
| overview:149–150 | 交給模型前套 tenant/user 授權；工具執行由可信程式碼檢查 | Confirmed single-source，Microsoft Data filtering；OWASP MCP §12 明確 enforce authorization in trusted code independently of model interpretation |
| overview:156–171 | 私人工單 same-tenant AND owner；跨公司回資料才形成該影響證據 | 自製教材政策與驗證設計，已標明假設，不冒充通用工單政策或實測漏洞 |
| overview:187–196 | 0–23 的篇序 | 24 篇數量與三線計畫吻合；非已完成數量 |
| overview:202–206 | 本機、CTF、平台、雲端與授權真實系統 | 明確無本機限制；是真正的系列計畫而非已完成環境測試 |
| overview:204 | 個別 scope／允許動作及 safe harbor 不擴大範圍 | Confirmed，HackerOne source-09 scope 與 source-08:43 明文；未聲稱全面法律免責 |
| overview:210 | 評測假成功與錯副本 | Misframed；見必修 1。不能把 ineffective 嘗試變成功案例 |
| identity:31–38 | 認證、授權、tenant、細粒度 owner 政策區分 | Confirmed single-source，Microsoft Identity／Define requirements／Data filtering；owner-only 明確自製政策 |
| identity:45–54 | principal 必須由已驗證認證與有效 tenant membership 取得 | Confirmed，Microsoft authoritative identities／user-to-tenant mapping；OWASP Authorization 每次物件檢查。單純 token decode 不等於驗證的說法正確 |
| identity:56 | 固定 MCP 2025-11-25 指引的 user ID 來自 token 而非 client | Confirmed single-source，官方 Session Hijacking mitigation 原文吻合；未把固定版冒充最新協定 |
| identity:58–66 | 參數驗證、可信資源記錄、伺服器政策、允許才回內容 | 與完整程式順序吻合，沒有把 model 判斷當授權 |
| identity:70–93 | 不連網、不跑 HTTP；DEMO_SESSIONS 不具正式認證能力 | 原檔與執行確認；公開固定字串風險已直接說明 |
| identity:99–124 | 九案例、JSON、status 語意與存在性限制 | 原檔執行確認；未把函式狀態誤叫 HTTP 實測；403／404 說明保留了側通道限制 |
| identity:128–132 | 工具只收 ID；資料入模型前過濾；旁路可繞過保護 | Confirmed single-source，Microsoft Data filtering 每次檢索、Encapsulate data logic 禁止直接查後端 store |
| identity:138–144 | 改為同租戶共享的政策與測試變更 | 重算符合程式：保留 tenant、移除 owner 時，Alice→N-2 變 200；Alice→S-1 仍 403 |

本次查核 17 組重要宣告；沒有價格、模型 benchmark、授權 license 或成效數字。規範性指引不能當防禦成功率的實證，文章沒有這樣做。未聲稱全領域覆蓋或已驗過整個產品。

### 可執行例子與安全反例

執行 `python3 public/examples/ai-security/authorization-demo.py`，Python 3.11.15，exit 0：

- own_ticket 200、other_tenant 403、same_tenant_other_owner 403、forged_identity 400。
- other_owner_allowed 200、second_tenant_allowed 200、missing_auth 401、unknown_ticket 404、invalid_id_type 400。
- 跨租戶 JSON 與正文逐字一致。最後輸出 `PASS: 9 cases; denied responses contain no ticket content`。
- 程式以 allow case 檢查可信 TICKETS text，以 deny case 檢查 body 僅有 error。400 forged_identity 是拒絕額外欄位，沒有假裝直接測過真實 token 的偽造。
- `session` 位置參數是教學認證結果替身，並非聲稱由任意不可信 HTTP request 提供便安全。正文 :76、:93 已明示任何人可使用 demo 值；沒有正式認證能力。應保留這兩處。
- principal、ticket owner/tenant 來源清楚；same-tenant owner-only 被標為本例政策，沒有錯把共享當漏洞。
- 未測網路／模型／token 驗簽／認證路由／全產品，正文範圍聲明準確。無需為入門強加 HTTP server。

## post-review

### 機械檢查

執行 `pnpm check:tw <兩篇中文>`：0 blocking、0 to review。四檔必填 frontmatter、合法 category／difficulty、tags 格式、雙語互連及兩組 order 0/1 已人工核對。全站 verify、astro check、連結整站檢查及圖 preview 由主 agent 承擔，本審閱沒有重跑，也不推定已綠。

### 教學品質

- 總覽 :19–23 清楚定位會寫 API 的開發者；:29–37 三線分工；:156–173 同一工單演示三種工作；:187–206 提供路徑與非本機環境。三線篇序為攻擊 6、防護 7、調查修補 6，加共用與整合，平衡合理。
- 第 1 篇 :19–23 以具體錯誤資料流開場，先補 principal/tenant/owner，再 :45–64 規則與來源；:70–93 可照做；:99–124 預期輸出與失敗解讀；:138–144 自測有答案。目標、示例與自測對齊，沒有只有名詞清單的斷崖。
- 同公司他人資料被拒與另一公司正常讀取都保留，避免「全部拒絕就是安全」的安全反例。
- 沒有在正文堆研究日誌或宣稱 AI 已攻陷；來源只是支持對應概念。

### 圖與 caption／雙語

目前圖為 5 節點、4 邊，兩語同一順序：使用者／登入→API授權→允許資料→模型工具請求→工具授權執行。逐步文字與正文 :43、:149–150 相符，屬教學提案，沒有把箭頭當來源實證。沒有畫「模型同意＝有權限」。沒有把工具回應誤接為未檢查就讀資料。圖上不呈現外部附件的獨立入口，正文是用問題引導讀者找位置，不是宣稱圖已完整涵蓋所有攻擊面。

中英數量 24、9、狀態碼、程式片段、政策與修正自測一致。主 agent 已統一總覽與第 1 篇的 Alice/north/N-1/S-1。仍有草稿狀態差異，見必修 2。視覺對齊、暗色／手機截圖與播放行為未由本 agent 觀察，由主 agent 驗證。

## post-polish

兩篇中文實跑 register-scan 與 phrase-ledger：

| 稿 | 長句 | 但書 | 引述 | 模板化轉折 | 一般英文命中 | ledger |
|---|---:|---:|---:|---:|---:|---|
| overview | 2 | 2/32（6%） | 0 | 0 | 0 | 無命中 |
| identity | 2 | 1/30（3%） | 0 | 0 | 0 | 無命中 |

人工回讀全文：沒有每段一層來源歸因的堆疊；模型／工具／後端主詞清楚。程式欄位英文有回查必要；alignment、Patch 等少量詞在路線表不影響氣口。中文開頭就是公司客服助理與 API 工作情境，繁中開發者可以直接代入，不需虛構台灣案例。掃描把可執行動作算成 0，但人工核對總覽 :214 的畫圖／圈位置、第 1 篇 :70–74 執行與 :136–142 改規則都具體可做，因此不列缺陷。

英文從頭讀完，語義自然，與中文政策、程式、限制一致；英文 NIST 句存在實質事實問題而非單純語氣問題，已列必修。沒有為了潤稿刪掉認證替身、有限範圍與存在性資訊等必要限制。

無其他阻擋教學交稿的缺陷。必修修正後須由主 agent 回讀中英對應句，並完成既定 verify／圖驗收；本報告不能代替它們。
