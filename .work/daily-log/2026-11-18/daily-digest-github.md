產出 AI Agent GitHub Digest 2026-11-18（中英雙版），4 個 trending repos（ag-ui-protocol/ag-ui、ChromeDevTools/chrome-devtools-mcp、Tencent/LoopForge、google-research/paper-orchestra）+ 2 個 notable release（Pydantic AI v2.69.0、Agno v3.2.1）。

- toolDegradation：`gh api` 對外部 repo 回 403（session 的 GitHub 存取範圍只含 vincentxuu/quidproquo 與 lanefoundry/gatelane，未對 13 個 watchlist 框架 repo 逐一 add_repo），原生 `curl`/`WebFetch` 對 github.com 也回 403。改用 Groundlane `web_fetch`（含 `.atom` releases feed 取精確時間、`api.github.com` JSON 取 license）與 `web_search` 完成 Step 4a-4d，未降級到 Keenable/You.com。
- browser-use 1.0.6、CopilotKit/OpenBot、modelcontextprotocol/registry、iflytek/astron-rpa、dream-num/univer、ChromeDevTools/chrome-devtools-mcp（前次已出現過）均已出現在 2026-11-14～17 的digest，本次刻意避開重複（browser-use 1.0.6 release 本身已在 2026-11-17 完整報導過，不再重複）；chrome-devtools-mcp 以「持續成長」角度帶入，非重複介紹。
- 圖解：無適合段落——本篇以新聞條列與 release 列表為主，未強畫圖。
- E1（英文版）：直接寫成英文版，未另跑 post-translate 子流程。
- diagram-preview：未跑，本篇無 diagram/flow-diagram 區塊。
