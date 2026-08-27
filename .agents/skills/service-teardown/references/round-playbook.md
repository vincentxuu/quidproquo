# 輪次劇本：先挖哪層、每輪做什麼、怎麼安全地弄壞它

原則：**一輪一到兩層，做完就寫**。每輪開頭一句「本輪要回答什麼」，結尾更新四張表（已完成／待深入／沒拿到／殘留）。

## 建議輪次

| 輪 | 層 | 動作 | 產物 |
|---|---|---|---|
| R1 | L1＋L2 | 用唯讀指令走完 happy path，逐步 snapshot／截圖，記時間 | 控制項表、路由表、時間線、自動化備註第一版 |
| R2 | L3 | 同樣流程再走一次，全程 `browser_network_requests` 錄下；另存 HAR | 端點時序表、傳輸方式、headers、ID 對應 |
| R3 | L4 | 把事件流／核心物件 JSON 落檔，逐筆分類 | 事件型別表、資料物件節錄、與已知協定的同構判斷 |
| R4 | L5 | 進階路徑：中斷、寫入＋提交、續聊、權限模式切換 | 中斷序列、憑證能做／不能做、模式對照表 |
| R5 | L5 | 失敗注入：讓可控步驟失敗，看錯誤如何呈現、燒不燒額度 | 可注入／不可注入表、失敗序列 |
| R6 | L6（＋L7） | 對照同服務其他入口／自家產品；若允許，內部盤點 | 對照表、改善路線、不要照抄清單 |

Genspark 那批走的是另一種切法：**每個機制各開一輪**（AI Edit、渲染、匯出、Save Point、路由差異），最後兩輪對照 MaiAgent。機制彼此獨立、要分頭餵給不同開發任務時用這種。

## 安全的測試動作

唯讀優先：
- 列目錄、數檔案、`git status`、看設定頁、開對話框後 Cancel、hover 子選單。
- 讀對方公開的 content／files API（自己的專案）。

需要寫入時：
- 專用低風險 repo／專案（例 `maiagent-api-examples`），檔名帶 `WALKTHROUGH_TEST`／`safe to delete`。
- 分支用對方預設前綴（`claude/…`），事後刪；PR 開了就關。
- Routine／排程建立時 **Enabled=Off**、名稱標 `(safe to delete)`，測完刪。

## 安全的失敗注入

| 想看什麼 | 怎麼做 | 不要做 |
|---|---|---|
| 中斷序列 | 跑 `for i in $(seq 1 120); do echo $i; sleep 1; done`，數秒後按 Stop | 中斷真正的寫入 |
| 工具失敗 vs 回合失敗 | `definitely_not_a_command`、`cat /nonexistent` | 觸發 API 錯誤（打爆額度） |
| setup／init 失敗 | setup script `echo …; exit 1` | 在正式環境上改 |
| 網路邊界 | setup 或 session 內 `curl -s -o /dev/null -w '%{http_code}' https://example.com` | 掃描內網、試連非套件源大量網域 |
| 權限請求 | 切到會問的模式（Plan／Accept edits）再要求改檔或跑含 `$var` 的 Bash，按 Reject | 為了看協定而 Allow 有副作用的動作 |
| 憑證邊界 | 要求刪遠端分支、刪 ref；被 403 就記錄 | 嘗試取得或列印憑證內容 |
| context 壓縮 | 送 `/compact` 或等效指令 | — |

## 清理清單（每輪結尾）

- [ ] 測試 session／run 已 Archive 或刪除（注意有些 Archive **沒有確認對話框**）。
- [ ] 測試 PR 已關、測試檔已刪、測試 routine 已刪。
- [ ] 遠端殘留（刪不掉的分支等）寫進「殘留清單」。
- [ ] 原始擷取檔已落在 `.playwright-mcp/`，筆記指名路徑，且未追蹤進 git。
- [ ] 筆記內所有 id／token／email／uuid 已遮罩。

## 什麼時候換方法

- 某層連兩輪沒有新發現 → 停，把剩下的寫進「待深入項目（需要條件）」。
- 需要付費方案、多帳號、對方授權才能看的 → 直接列進待深入表，不硬試。
- 對方拒絕（模型或 UI）→ 記錄原文，列「沒拿到的」，不繞路。
