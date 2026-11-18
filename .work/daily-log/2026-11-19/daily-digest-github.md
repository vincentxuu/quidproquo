產出 GitHub Digest 中英雙語版：Pydantic AI v2.70.0／CrewAI 1.15.42 兩個安全修補、Claude-BugHunter／stitch-skills／Nexus／Mastra Factory 四個 trending repo。

- 圖解：無適合段落（本篇是新聞條列與版本更新，沒有結構可畫；CrewAI 的 Knowledge 後端換預設只是屬性變更，依 diagram skill 規則改用表格呈現）。
- gh api 對 langgraph/crewAI 等框架 repo 直接查 release 被 session 的 repo 範圍擋下（僅 vincentxuu/quidproquo、lanefoundry/gatelane 有權限），改用 Groundlane `web_fetch` 抓各框架的 `releases.atom` 取得版本與時間，`gh api search/repositories` 不受此限制可正常查詢。
- 排除一批明顯刷星的 spam repo（多個「blender-ai-copilot-*」帳號同分鐘建立、描述幾乎相同、stars 集中在 500 上下）與兩個建立即不再更新的 OSINT repo，未列入候選。
- diagram-preview 未跑：本篇無 diagram 區塊，不適用。
