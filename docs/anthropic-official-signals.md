# Anthropic 官方在意的：認證考點地圖＋官方資料管道

> 整理自站上〈Claude 四張認證怎麼選〉（`src/content/posts/ai/2026-08-19-claude-certifications-which-one.md`，查證日 2026-08-19）與官方資料管道盤點。用途：寫 Claude／Anthropic 相關內容時，知道官方把哪些知識當成「該會的」，以及去哪裡查第一手資料。下次複查：每季核對權重與規格。

## 一、四張認證與角色定義

Anthropic 用四份 exam guide 定義了四種角色「各自該會什麼」——這就是官方在意的知識地圖：

| 代碼 | 角色 | 費用 | 題數 | 最重領域（比重） | 寫程式 | 計入 partner tier |
|------|------|------|------|------------------|--------|--------------------|
| CCAO-F | Associate（日常使用者） | $99 | 60 | 輸出評估 **21%** | 否 | **否** |
| CCDV-F | Developer | $125 | 53 | 應用與整合 **33.1%** | 是 | 是 |
| CCAR-F | Architect Foundations | $125 | 60 | agentic 架構 **27%** | 是 | 是 |
| CCAR-P | Architect Professional | $175 | 63 | 整合 **19%** | 是 | 是 |

共用規則：120 分鐘、及格 720/1000、效期 12 個月、續期免費非監考（過期要全額重考）、重考間隔 14/30/90 天、12 個月最多 4 次。

## 二、官方在意的五個訊號

1. **報考門檻＝partner 組織限定**。個人無法報名；認證是 Claude Partner Network tier standing 的一部分（certified practitioners + deployed customers + public references）。
2. **Claude Code 的定位是「組態與流程決策」而非寫程式**：CCAR-F 考 20%（CLAUDE.md 三層層級、`.claude/rules/` 條件載入、Commands vs Skills、`context: fork`、plan mode 取捨、CI 用 `-p` 非互動），CCDV-F 只考 3.1%。「替團隊訂規範」屬於架構師考試。
3. **輸出評估 > Prompting**：CCAO-F 的 Prompting 只有 14%，輸出評估 21%＋治理 15% 合計 36%。官方在意的是「判斷輸出可不可信、何時不該用」，不是 prompt 技巧。
4. **治理與溝通是 professional 級的身分證**：CCAR-P 有 28% 不考技術——Governance/Safety/Risk 14%（guardrail、失效模式、GDPR/HIPAA/FedRAMP、human-in-the-loop）＋利害關係人溝通與交付生命週期 14%。系列裡沒有第二張證照考這個。
5. **四張是職責分岔不是階梯**（exam guide 無先修條件；但公告文寫 foundation → professional，兩處來源不一致，排訓練順序前找 partner 窗口確認）。另一處命名不一致：Pearson VUE 寫 Practitioner，Anthropic 寫 Associate——搜尋時兩個詞都要查。

## 三、官方沒公布的（不要填空）

- 子領域權重只有 CCDV-F 公布到 1% 以下；其他三張只到領域層
- 答錯是否倒扣：CCAR-F guide 未說明
- 通過率未公布
- 「六情境抽四」結構只有 CCAR-F 載明
- 個人報考管道不存在（官方明說，非未公布）

## 四、官方資料管道（關鍵連結皆已驗證）

### 文件與 Release Notes（最即時的三個來源）

| 管道 | 內容 | 位置 |
|------|------|------|
| 平台文件 | API、SDK、Agent Skills、Managed Agents 全套文件 | https://platform.claude.com/docs/en/release-notes/overview |
| Claude Apps 更新日誌 | claude.ai / Cowork 功能更新 | https://support.claude.com/en/articles/12138966-release-notes |
| Claude Code CHANGELOG | 每版 CLI 變更 | https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md ；文件在 https://code.claude.com/docs |

### GitHub（github.com/anthropics）

- `skills` — Agent Skills 官方庫（172k stars）
- `claude-code` — 主 repo ＋ issues（143k stars）
- `claude-cookbooks` — 官方範例 notebooks
- `claude-plugins-official` — 官方審核的 plugin 目錄
- `prompt-eng-interactive-tutorial` — 官方 prompt engineering 教材
- `claude-agent-sdk-python` / `typescript`、`anthropic-sdk-*`（8 語言 SDK）
- `claude-quickstarts` — 可部署範本

### 公告與研究

- 新聞稿：https://www.anthropic.com/news （模型發佈第一手）
- 技術報告：https://www.anthropic.com/research 、工程博客 https://www.anthropic.com/engineering
- X：@AnthropicAI、@claude_code
- 狀態頁：https://status.anthropic.com
- 開發者 Discord：官方文件 footer 有邀請連結（API 問題回應最快）

### 追蹤建議

模型/API 級變化看 platform release notes；Claude Code 版本看 GitHub CHANGELOG；重大發佈看 news ＋ X。

## 五、會過期的東西（複查表）

| 項目 | 現況（2026-08-19） | 重查頻率 |
|------|---------------------|----------|
| 報考門檻 | 限 partner 組織 | 每季 |
| CCAO-F 不計入 partner tier | 官方認證頁仍有註記 | 每半年 |
| 四張規格 | $99/$125/$125/$175；60/53/60/63 題 | 每季 |
| 領域權重 | 見本文第一節 | 每季 |
| 重考規則 | 14/30/90 天、12 個月 4 次 | 每半年 |
| Practitioner vs Associate 命名不一致 | 兩份官方頁仍不同調 | 每次頁面改版 |
