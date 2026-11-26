# Simular box 查證報告（訪問日期 2026-11-09）

## 一、結論摘要
1. 官方沒寫 CPU/RAM/磁碟。官網、docs、llms-full.txt、定價頁、Simular 自家文章都沒有規格表。4 核 8G 40G 來自社群實測（linux.do、NodeLoc、bilibili 搜尋摘要），不是官方數字。
2. 有人反證：NodeLoc 11/9 01:36 回覆「最新注册结果，只有2C4G了」，linux.do 11/9 回覆「只有一半」。規格可能不固定或已被砍。[推論] 別把 4C8G 當保證。
3. 官方寫的：每帳號一台 box；閒置休眠，AI 連線時「約一秒」喚醒；檔案與狀態保留。官方沒寫逾時秒數、休眠後保存期限、同時連線數。
4. 休眠不穩的反證：NodeLoc 使用者說「睡了就叫不醒，我装了Hermes，经常叫不醒」（單一回報）。GitHub #35 也提到要 hibernate/wake 一輪後檔案才同步。
5. 計費：「box 免費，模型呼叫用帳號每日 credits」是官方原話。官方沒公布每個操作扣多少 credits，所以「1000 credits 能撐多少操作」查不到（⚪）。重置時間官方沒寫；第三方說 UTC 00:00（aipromonow），港媒說每天早上 8 點（HK 時間，與 UTC 00:00 相符）。台灣時間 08:00。
6. 自帶模型的 agent 扣不扣 credits：官方沒有明講。唯一一手測試是 kocpc（作者自己用 Codex 操控，沒扣）；aipromonow 說「自己的 agent 模型花費留在自己帳號」。兩者都是第三方，屬單點證據。
7. Tools：官方 skill 與 Simular 文章列出約 25 個 tool 名（shell、檔案、browser_*、screenshot、computer_*、gui_plan、desk、script_run、box_*）；GitHub #18 說實測 31 個。server-card.json 與 auth.md 都沒列 tools（auth.md 說「tools 因 box 而異」）。
8. /box:offload 與 /box:back 是官方 CLI README 有寫的功能：把 git repo 複製進 box，在裡面跑 Claude Code/Codex/Cursor，結束後把 commits 帶回來合併。限制：只支援 git repo、每個 repo 一個 session、每個 box 三個、box 內 agent 跳過權限提示。
9. 隱私：Simular 隱私政策（2026-10 更新）說會讀 accessibility tree、DOM、螢幕畫面，並收瀏覽/搜尋 URL；預設不拿客戶資料訓練模型，但會把任務內容送給 AI 模型供應商。服務條款（2026-09）說 beta 功能可能隨時改或停，免費 credits 可隨時調降。
10. 穩定度：產品剛上線（MCP 端點 2026-11-04 才搬家，舊網址登入會失敗）。GitHub issues 多為上線測試與整合小問題，沒有大規模事故回報；網路上也幾乎沒有獨立深度評測。

## 二、逐題發現

### Q1 免費檔規格
- 官方：「The computer: one cloud Linux desktop per account. It sleeps when no one uses it and wakes when your AI connects.」（https://box.simular.ai/ ）✅
- 官方：「It wakes in about a second when your AI connects; files and state persist.」（docs/mcp.md）。
- 官方：「box gives your AI a computer of its own: a cloud Ubuntu desktop with Chrome and a shell」（llms-full.txt）。
- 官方 SKILL.md：「A sleeping box wakes on the first call, which can take a few seconds.」跟「約一秒」略有出入。
- Simular 自家文章（行銷）：「Every box is a Linux micro-VM with strict CPU and memory isolation」「stress-tested at 1,000 concurrent VMs」「sub-1.2-second p95 spin-up」。無 vCPU/RAM 數字。cloud-computers 比較文對 box 的欄位只寫「Isolated cloud computer per box」，其他平台寫了規格，box 沒寫。
- 社群實測（非官方）：
  - linux.do #3145208（Exa 讀全文，11/9）：「4 核 CPU + 7.7GB 內存、40GB 硬盘，Ubuntu 24.04」；「闲置会休眠，没有公网入口，不能当常规 VPS 搭节点」；出口是芝加哥機房 IP。回覆：「姿勢不對？還是來晚了，只有一半呢」。
  - NodeLoc #117019（11/8–11/9）：「最新注册结果，只有2C4Ｇ了」。
  - linux.do #3139080 搜尋摘要（頁面無法直接讀）：「nproc=4、free -h≈7.7–8GiB、df -h /=40G」「官网未公开规格表」「sudo -i 可进 root」。
  - bilibili BV1ze4p6aEn4 搜尋摘要：「4核Xeon·7.8G内存·40G硬盘」「免密sudo」「无公网入站+闲置休眠」「出口 IP 为共享 NAT，休眠唤醒后可能变化」。
  - aipromonow：「Typical free specs are about 4 CPUs, 8 GB RAM and 40 GB disk on Ubuntu 24.04」，並說免費檔含 scheduled wake-ups、file restore、Flows；付費約 $50/月（無官方出處，未對上 box 官方頁）。
- 單帳號一台：官方「One box per account」✅。付費方案可多台：Simular 主站定價頁「Run up to 5 cloud computers」是 Sai 產品方案，不能直接當 box 的方案。
- 同時連線數：docs 沒寫。GitHub README：offload「one session per repo and three per box」（這是 offload 的限制，不是一般連線數）。⚪
- 逾時/休眠門檻：官方只寫「sleeps when no one uses it」，沒寫閒置多久休眠、休眠多久後被回收。⚪
- 資料持久：官方「files and state persist」，Simular 文章說「keeps your logins between tasks」。隱私政策第 9 節另說「Some execution environments or temporary workspaces are designed to be short-lived」。box 是否屬於短命環境沒寫。

### Q2 計費
- 官方原話（首頁 Key facts）：「Cost: the box itself is free. Its model calls use your account's daily credits.」
- troubleshooting.md：「The model says credits are used up → Your credits are spent. Add credits or choose a plan on Billing.」
- Simular 文章：「the free daily credit refreshes daily, or add credit on the billing page」。
- 「Its model calls」指的是什麼？官方沒定義。從 Simular 文章推：免費方案「includes a Simular API key for your agent」。[推論] box 內由 Simular 自己跑的模型呼叫（例如 gui_plan 規劃、desk）才扣 credits；由你自己的 agent 在外面思考的部分不扣。這是推論，沒有官方確認。
- 每日 1000 credits：kocpc「Free accounts currently receive 1,000 Credits per day, but the company has not yet disclosed the full credit costs for each operation, nor guaranteed that this allowance will remain unchanged.」所以「能撐多少操作」目前沒有官方換算 ⚪。
- 參考換算（不同產品，勿直接套用）：Simular 主站 Pay as you go「50,000 credits a month ($50 of usage)」，即 1 credit ≈ US$0.001；1000 credits ≈ US$1。[推論] 若 box 同單位，每日免費額度約 1 美元的模型用量。來源是 www.simular.ai/pricing（Sai 方案），不是 box 專頁。
- 重置時間：官方沒寫。aipromonow：「resets at UTC midnight」；businessfocus.io：「每天早上 8 點準時重置」。兩者吻合（HK/台灣 08:00）。均為第三方。
- 自帶模型 agent 扣不扣：
  - kocpc 作者：「When I used Codex to control a cloud virtual machine, no quota was deducted at all.」同文也說「running AI agents such as Claude Code and Codex will also consume the usage quotas of those services themselves」。
  - aipromonow：「If you drive it with your own agent, model spend stays on your own account.」
  - 官方（docs/定價/條款）沒有對此直接表態。條款第 9 節只寫 credits「have no cash value」，Simular 可「modify, reduce, suspend, or eliminate free or promotional credits」。
  - 結論：實測上沒扣的證據只有一筆，官方未確認，標 ✉️。
- 方案：Simular 主站 pricing 為 Free（每日額度）/ $50 月 Pay as you go / $500 月 Unlimited / Enterprise，描述的是 Sai，不是 box。box 官方頁只寫 free 與 Billing 頁（Billing 頁為登入後頁面，抓到的是首頁內容）。

### Q3 能力與工具
- server-card.json（讀完）：name ai.simular/box、streamable-http、https://mcp.box.simular.ai/mcp、protocol 2025-11-25 與 2025-06-18、可選 Bearer cb_... 金鑰。無 tools 清單。
- 官方 SKILL.md（GitHub raw，讀完）列出：
  - 殼與檔案：shell、read_file、write_file、edit_file、list_dir
  - 瀏覽器：browser_navigate、browser_snapshot、browser_read、browser_click、browser_type、browser_fill、browser_tabs、browser_fetch
  - 桌面：gui_plan、desk、computer_act、computer_state、script_run
  - 螢幕：screenshot
  - box 本身：box_status、box_list、box_wake、box_hibernate、box_save、box_upgrade
  - 另 headless 文件提到 box_delete（刪除/重置）。
- GitHub #18 回報者實測：「31 tools, shell verified working on the box」。
- 有 shell ✅、瀏覽器（Chrome）✅、螢幕截圖 ✅、檔案讀寫編輯 ✅。檔案上傳/下載：沒有專門的 upload/download tool；[推論] 只能用 shell（curl/scp）或 write_file，或網頁面板。官方沒說 ⚪。
- Flows：GitHub #35 說 Flows 在官方 docs 完全沒寫，匯入格式只能讀前端碼；gui_plan 執行 `{url}` 步驟會被拒；匯入後要經過 hibernate/wake 才同步。
- Live view/Take control：官方 https://box.simular.ai/box ，可接管。
- offload/back：官方 cli/README.md（讀完）。`/box:offload` 把任務交給 box 內全新的 Claude Code（或 Codex、Cursor）session，`/box:back` 把 commits 與書面交接帶回並合併。前置：`npx @simular-ai/box login`、`offload install-cli --kind claude`、`offload sign-in --kind claude`（要在 box 裡再登入一次該 CLI 的帳號）。傳輸用 rsync + git bundle；box 需有 git/rsync/tmux/mise；copy 超過 500 MB 會警告；back 最多等 10 分鐘；merge 失敗時建 `cocoonbox/back-<time>` 分支；僅 macOS/Linux、僅 git repo、box agent 只 commit 不 push、一 repo 一 session、一 box 三 session、box agent 權限提示被關閉。GitHub #36 說 JS CLI 將被 Rust 版 @simular-ai/box 1.0 取代，指令可能改變。

### Q4 安全與隔離
- 官方：「Each box is a Linux micro-VM with strict CPU and memory isolation」（Simular 行銷文，非技術文件）。
- 隔離範圍：box 與你的電腦分離；box 內 agent 被 prompt injection 時，影響限於 box（Simular 文章說法）。但 docs/headless 警告：用 `default_tools_approval_mode="approve"` 時「anything your AI reads on a web page can steer the box's browser and shell」。
- 網路：官方沒寫出站限制；沒寫入站。社群實測「无公网入站」、出口為共享 NAT／芝加哥機房 IP，休眠後 IP 可能變（非官方）。
- 授權：OAuth 2.0 + PKCE，scope `boxes`；核准頁可選哪些 box 與多少天；可用 `cb_` 個人金鑰；keys 頁可撤銷（auth.md、mcp.md）。
- 隱私政策（2026-10，讀完）：
  - 「the Services may read accessibility trees, document object model (DOM) structures, and capture screen or interface observations」
  - 收集「search terms and pages or URLs viewed」；Sentry 診斷可能含 Session Replay（敏感欄位遮罩）。
  - 「the Services may send relevant task context to AI model providers」。
  - 不訓練：「does not use Customer Data, user inputs, or generated outputs ... to train public, generalized, or foundational AI models by default without your affirmative, express consent」。
  - 人員存取受限；刪除請求寄 support@simular.ai；備份與日誌中的資料可能在一段時間內仍保留。
  - 「References to a framework or compliance program do not mean that Simular has obtained a certification」：沒有宣稱 SOC2 等認證。
  - 一般服務不處理 PHI。
- 服務條款（2026-09，讀完）：第 10 節 beta 功能「may be changed or discontinued at any time ... should not use for regulated or sensitive data」；第 13 節 as-is；第 15 節責任上限為已付費用或 US$100；第 17 節 Delaware 法、AAA 仲裁、放棄集體訴訟。
- 注意：issue #21 引用的隱私網址是 www.simular.ai/product-sai/privacy，是 Sai 的版本；我讀的是 www.simular.ai/privacy-policy。兩者是否相同沒對過。
- kocpc 的建議：只用於公開網頁、一般資料整理與測試。

### Q5 反證與穩定度：見第四節。

## 三、讀取完整度盤點表
| 來源 | 讀取程度 | 阻礙 |
|---|---|---|
| https://box.simular.ai/ | read | 無 |
| https://box.simular.ai/llms-full.txt | read（29,739 bytes，未截斷） | 無 |
| https://box.simular.ai/docs/llms.txt | read | 僅列 5 頁：index、install、mcp、headless、troubleshooting（全含於 llms-full） |
| docs/mcp.md、docs/troubleshooting.md、install.md、auth.md | read | 無 |
| docs/index.md、docs/headless.md | read（內容在 llms-full.txt 內） | 未單獨抓 .md |
| .well-known/mcp/server-card.json、agent-skills/index.json | read | 無 tools 清單 |
| https://box.simular.ai/billing | partial | 未登入，回傳首頁內容，沒有帳單資訊 |
| GitHub box-plugin README | read | Groundlane 成功 |
| GitHub cli/README.md | read | 無 |
| GitHub claude/skills/box/SKILL.md（raw） | read | 無 |
| GitHub issues | partial | github MCP 被限制只能讀 quidproquo；改用 Groundlane 讀列表（18 筆 issue/PR）與 #18、#20、#21、#30、#32、#33、#35、#36、#40 內文；#34、#11 只讀到標題與搜尋摘要；其餘（#3–#16 已關閉）只看到編號 |
| https://www.simular.ai/pricing | read | 是 Sai 方案，非 box |
| https://www.simular.ai/privacy-policy | read | /privacy 是 404；正確網址是 /privacy-policy |
| https://www.simular.ai/terms-of-use | read | 第一次抓只拿到表單，改 extract=full 讀完 |
| simular.ai/articles/linux-desktop-in-the-cloud、mcp-server-for-computer-use；alternatives/best-computer-use-mcp-servers、cloud-computers-for-ai-agents | read | 第一次並行抓取 proxy 斷線，重試成功；廠商自家行銷文 |
| https://en.kocpc.com.tw/archives/26959 | read | 無 |
| aipromonow 優惠頁 | read | 第三方 |
| businessfocus.io 文章 | read | 第三方 |
| NodeLoc #117019 | read（頁面只有第 2–5 樓，樓主主文未見） | 無 |
| linux.do #3145208 | read（Exa） | Groundlane 被 browser-challenge 擋 |
| linux.do #3139080 | snippet | Groundlane 被 browser-challenge 擋；Jina 回「頁面不存在或私人」 |
| bilibili BV1ze4p6aEn4 | snippet | Exa 回 HTTP 412 |
| X: CMGS 推文 | snippet | 未抓 |
| Reddit / Hacker News | blocked（無結果） | 搜尋兩輪沒找到關於 Simular Box 的串；Groundlane 搜尋（brave+you） |

## 四、反證與風險
- 規格不保證：4C8G 只有社群實測；兩則同日回報變成 2C4G/「一半」。官方沒承諾。
- 休眠：NodeLoc 使用者「睡了就叫不醒」（Hermes 常駐場景）；官方 mcp.md 說 Hermes/OpenClaw 在伺服器上常用個人金鑰，OAuth 過期要人處理。不適合當常駐伺服器。社群也確認沒有公網入站，不能當節點。
- 上線初期：2026-11-04 才搬 MCP 網址，舊網址登入會失敗（#18，且官方 install 頁當時仍給舊網址，已修）；Codex sandbox 內安裝 exit 130（#30）；Gemini CLI 在有 proxy 的環境解析不到 DNS（#33，標為測試環境問題）；gui_plan 提示不清、Flows 無文件、前後端步驟格式不一致（#35）。這些都是整合摩擦，沒有資料遺失或安全事件的回報。
- 官方自己的行銷文宣稱「free during its beta」（linux-desktop-in-the-cloud 的 FAQ），條款說 beta 可隨時改。免費額度與規格可能調降（條款 §9 明說免費 credits 可調降）。
- 隱私：螢幕畫面、DOM、瀏覽 URL 會被收集並送給模型供應商；kocpc 明確建議只處理公開資料。不要在 box 裡登入主要帳號或放私鑰。
- 信任度：我找到的幾乎都是聯盟/優惠類部落格與官方行銷文，沒有獨立工程師的長期使用評測；Reddit/HN 沒有相關討論。評價偏正面是因為資料來源偏。
- 與 Box.com 撞名：Codex 可能選到 Box.com 的 app（troubleshooting 要用 `@box`）；Claude plugin 目錄已有 Box Inc. 的 plugin（#21）。

## 五、⚪／✉️ 清單
- ⚪ 官方 CPU/RAM/磁碟：試過 box.simular.ai 首頁、llms-full.txt、docs/mcp.md、troubleshooting.md、install.md、server-card.json、simular.ai/pricing、cloud-computers-for-ai-agents 比較文、GitHub README；皆無數字。只有第三方實測（見 Q1）。
- ⚪ 休眠逾時秒數、休眠後資料保留期限：同上，所有官方頁都只說「sleeps when idle」。
- ⚪ 同時連線數（多個 agent 連同一台）：同上；只有 offload 的「每 box 三個 session」。
- ⚪ 每個操作扣多少 credits：kocpc 也說官方沒公開。
- ⚪ box 專用的出站網路限制：官方文件、隱私政策、條款都沒寫。
- ⚪ 檔案上傳下載專用 tool：SKILL.md、Simular 工具表沒有。
- ⚪ Reddit/HN 討論：Groundlane 兩輪搜尋（brave+you）沒有 Simular Box 相關串。X 只找到一則 CMGS 推文摘要（內容是請大家到某處回饋，無實質評論）。
- ✉️ 自帶模型 agent 是否扣 credits、credits 的「model calls」範圍、重置時間：可寫信 support@simular.ai，或自己開一個新帳號做實驗（用 Codex 做一輪任務前後對照 1000 的餘額）。
- ✉️ 隱私政策網址：issue #21 引用 /product-sai/privacy，我讀的是 /privacy-policy，是否同一份要問 Simular。
