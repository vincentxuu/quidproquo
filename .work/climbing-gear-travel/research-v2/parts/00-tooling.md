# Tool degradation log (2026-10-19)
- (1) Groundlane MCP: not present in this session (ToolSearch "groundlane" → no matching deferred tools).
- (2) Groundlane direct HTTP POST https://groundlane.vincent-xu-work.workers.dev/mcp → HTTP 401 (auth required).
- (3) Keenable keyless search: works (param is `query=`, not `q=`). Used for search/URL discovery.
- Page reading: direct curl of official pages (+ pdftotext for PDFs); Exa web_fetch_exa for pages that block curl; built-in WebFetch last.
- Jina reader (r.jina.ai) keyless used for caac.gov.cn English page (direct curl HTTP 000).
