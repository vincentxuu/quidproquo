# 審稿紀錄：裝 skill 與 MCP 前怎麼掃（series order 1）

審稿日：2026-10-24。審稿者是沒有參與撰寫的獨立 agent，報告全文在 session scratchpad（`review-verify.md`、`review-structure.md`），摘要如下。

## post-verify

| 問題 | 處理 |
|---|---|
| ❌ 十萬換行繞過的是 ClawHub，不是 Cisco；繞過 Cisco 的是 `.docx`、`.pyc`、話術說服 LLM | 已改正，並註明 ToB 沒公布受測版本、現況要自己重測 |
| 🔵 Cisco 約 67% 是 MEDIUM 以上「進審查佇列」，真正擋下的 HIGH 以上約 34%（誤報約 6%），與 8% 門檻不同 | 已改寫，兩個門檻並列 |
| 🟡 `--no-llm` 後依賴套件名稱與版本仍送 OSV.dev | 已寫進表格與「怎麼用」第 1 點 |
| 🟡 issue #644：BOM／plist 誤報已修；「最大分數來源」是回報者在他掃的語料上的觀察，維護者未處理 | 已縮回原意並註明已修與未處理 |
| 🟡 agent-scan：同意提示只在互動模式（`--dangerously-run-mcp-servers` 略過）；送出內容含 skill 內容；README 沒明寫 `.mcp.json` | 已改；移除 `.mcp.json` 的具體說法 |
| 🟡 AgentSeal：stdio 模式才啟動；「最後更新」應為 pushed_at 2026-06-11 | 已改 |
| 🟡 空目錄之說來自 Adversa，論文沒有 | 已改成「Adversa 指出它下載的副本裡約一成三…」 |
| 🟡 Adversa 8 個「皆關閉 LLM」不精確、「賣」未證實 | 已改 |
| 🟡 結論「數字都來自作者或有利益關係」與稱 MalSkillBench 獨立矛盾 | 已改寫 |
| 🟡 Claude Code 內建沙箱不包本機 MCP server | 已補進「怎麼用」第 4 點 |
| ✅ SkillSpector 不執行、LLM 只升不降、`--fail-on-incomplete`、README Limitations；Cisco 約 8%／31%／README 原句；MalSkillBench 21.6%／87.9%；連結皆有效 | — |

未驗範圍（審稿者聲明）：Cisco measured-results 約 600 行實驗細節只 grep；ToB、Adversa 測試未重現；SkillSpector LLM analyzer 是否能「新增」發現未讀程式（文章已改成不主張「新增」）。

## post-review

| 項目 | 處理 |
|---|---|
| tldr 的 8% 缺「沒見過的資料」條件 | 已補 |
| 斷崖 0→1：開頭沒在地圖上標位置 | 開頭加「在系列地圖上，這是第一類工具，管『你裝進去的東西』這個入口」 |
| 召回率與誤報率沒有白話定義 | 新增「先講兩個詞」一節 |
| 「今晚就能做」前半不具體 | 併入「怎麼用」第 1 點，指名 SkillSpector `--no-llm` 與 agent-scan，並說明取捨 |
| 表格欄位錯放（授權與更新放進「內容送去哪」） | 新增「授權與維護」欄 |
| 「四個開源」與表內「不是開放原始碼授權」矛盾 | 改成「四個公開原始碼的工具」並在行文註明 |
| 替來源加主張：「多數廠商不會說」「裝了之後才改內容」「它們擋不住…」 | 已刪或縮回來源範圍 |
| 自我檢查沒有成題 | 「沒有發現可以直接安裝嗎？不行。」成題 |
| 增量歸因：掃描器多做的是批次過目錄並給人工複核清單 | 開頭加一句明講；標題「能擋什麼」改「能看出什麼」 |
| 數字節超過 20% | 刪去「兩次違規」等讀者用不到的細節，Cisco 段落拆開 |
| 後續篇章尚未存在 | 結語改為「第 2 篇談…」；整篇維持 `draft: true` |

## post-polish

| 指標 | 結果 |
|---|---|
| 長句、引述區塊、模板化轉折 | 0 |
| 但書密度 | 4%（1/21） |
| 數字密度 | 原有一段 6 個數字，已拆成兩段 |
| 姓名當主詞 | 腳本 4（機構名：Trail of Bits、Adversa 等），首次出現已附定位，可保留 |
| 台灣用語 | 子行程→子程序；野外→真實環境蒐集到的樣本；不預警→不另行通知；同形字→外觀相同的字元；規則單獨→只用規則；BOM 加白話 |
| 英文版 | "Actual connection" → "Connecting to the server"；"first sieve, not a pass" → "first filter, not grounds for letting something through"；標題 "Cisco" → "Cisco skill-scanner" |
| 機械檢查 | check-tw-terms 0 blocking、check-process-leak 通過、scan-ledger 三區皆空、新文章無引用警告 |

## 2026-10-24 重新核對

詳細來源網址見 `.work/2026-10-24-skill-mcp-pre-install-scanners/evidence.md` 同名段落。改動摘要：

| 項目 | 處理 |
|---|---|
| Cisco 31%／8% 缺門檻 | 已補：MEDIUM+ 下開發部分 31%、未見過來源 8%；HIGH+ 為 7.7%／誤報 4.0% |
| 缺獨立重跑 | 新增一段：MaliciousSkillBench（arXiv:2608.19901）同一 839/545 上，Cisco 本機設定 2.5%、SkillSpector --no-llm 0%，並註明環境差異，與第 8 篇對齊；參考資料加入該論文 |
| 第 8 篇「信賴區間」 | 論文沒有，zh／en 兩處改成樣本數粗估 |
| SkillSpector「加權相加」 | README 沒寫，改為 0–100 分數＋嚴重度對應建議 |
| issue #644 | 補「9 月底 PR #645 已修」；AE1「維護者還沒處理」改為「之後多個修正減少誤觸發，高嚴重度與逐行重複是否改了沒查到」 |
| Adversa | 補 SkillSpector 編碼包裝是靠管線轉 shell 規則才被擋、SkillSpector 測的是 __pycache__ 還原版；立場註記保留 |
| 兩個名字相近的資料集 | 正文標明 MalSkillBench（2606.07131）與 MaliciousSkillBench（2608.19901）是不同研究 |
| 結語預告 | 加第 2 篇連結（沙箱），與第 2 篇開頭呼應 |
| hook 用語 | 本篇未使用 |
| 檢查 | check-tw-terms 0 blocking、0 to review；check-process-leak 無輸出（通過）；draft 維持 true |
