# 審稿紀錄：2026-11-19-ai-browser-sdk-comparison（AI 瀏覽器自動化 order 13，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-12-13.md）。1 ❌、多項 🟡，全部處理：
- ❌ HyperAgent 的 driver 不是 Patchright：package.json 列了 patchright，但原始碼只 import `playwright-core` → driver 表與七工具表都改 Playwright。
- 🟡 Browser Use 89.1% 的評審補「unknown／failed 人工複查改判」；搜尋 agent 改「點進搜尋結果」並標 100 題抽樣；「LangChain 是 Browserbase 合作方」找不到出處 → 改成「這篇是 LangChain 選定 Stagehand 之後寫的」（main session 讀過 LangChain 原文確認）；EHR 改「少數情況保留 AI 後備」；WebBench 數字改連 webbench.ai。
- main session 自己核對：Midscene「about 80%」出自 changelog、BU Bench／HardBench 網址、三篇 arXiv 標題與第一作者。

## post-review

獨立 subagent 編輯審稿（review-12-13.md）。處理：
- 必修全採納：M13-1 補 inline link（Midscene changelog、Magnitude／HyperAgent README、Notte docs、AgentQL 價格加月份、快取、Notte 1.10、四個評測加連結並進參考資料、best-web-agents 引述、Stagehand v3 遷移引述）；M13-2 授權建議改成「嵌進程式碼才要先處理」、連回 order 12、加「不是法律意見」。
- 建議採納：B13-1／B13-2 driver 表重寫（Playwright 列標明哪些能塞進既有腳本、Skyvern 只開 Chromium）；B13-3 拿掉微型測試結論的粗體；B13-4 Skyvern 細節連回 order 12；B13-5「這一段」改「系列第 8 到 12 篇」；B13-6 補 Skyvern 程式碼重播自架未明；B13-8 收斂趨勢留給第 15 篇；B13-9 改寫「不是…而是…」句；B13-10 英文兩處。
- 未採納：B13-7 加「感知方式 × driver」矩陣圖（七工具表已是同樣資訊，圖會重複）。

## post-polish

- check:tw 0／0；post-quality、process-leak、lang-parity 通過。
- 正式站上線後核對表格渲染。
