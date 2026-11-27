# signals JSON 完整範例

> Step 7 寫入 `src/data/daily-signals/${TODAY}.json` 前讀。欄位定義與 `dateConfidence` 規則在 SKILL.md「輸出格式」，這份只放一個寫好的樣本。

## 完整範例

以下是一個寫好的 signals JSON（5 則，實際應有 30-50 則）：

```json
{
  "date": "2026-08-17",
  "generatedAt": "2026-08-17T03:12:00Z",
  "routineId": "J",
  "signalCount": 5,
  "signals": [
    {
      "id": "sig-001",
      "title": "Anthropic launches Claude Agent SDK 2.0 with native MCP orchestration",
      "source": "anthropic-blog",
      "sourceUrl": "https://www.anthropic.com/news/agent-sdk-2",
      "category": "vendor-update",
      "companies": ["anthropic"],
      "section": "A1",
      "ring": 1,
      "summary": "Anthropic 發佈 Agent SDK 2.0，原生支援 MCP 編排，可跨多個 MCP server 做 tool routing，並內建 session 記憶管理。",
      "relevance": 0.98,
      "crossValidated": true,
      "crossValidationSources": ["techcrunch", "hn"]
    },
    {
      "id": "sig-002",
      "title": "Cursor hits $500M ARR, launches Background Agents for enterprise",
      "source": "techcrunch",
      "sourceUrl": "https://techcrunch.com/2026/08/16/cursor-500m-arr/",
      "category": "vendor-update",
      "companies": ["cursor"],
      "section": "B1",
      "ring": 1,
      "summary": "Cursor 年化營收達 $500M，同時發佈企業版 Background Agents：可在雲端持續跑 coding task，無需開發者盯著 IDE。",
      "relevance": 0.92,
      "crossValidated": true,
      "crossValidationSources": ["venturebeat"]
    },
    {
      "id": "sig-003",
      "title": "Baseten raises $150M Series C at $13B valuation",
      "source": "businesswire",
      "sourceUrl": "https://www.businesswire.com/news/baseten-series-c",
      "category": "funding",
      "companies": ["baseten"],
      "section": "A3",
      "ring": 2,
      "summary": "推理基礎設施公司 Baseten 完成 $150M C 輪，估值 $13B。客戶包括 Cursor、Notion、Mercor。Lightspeed 領投。",
      "relevance": 0.78,
      "crossValidated": false,
      "crossValidationSources": []
    },
    {
      "id": "sig-004",
      "title": "台智雲推出企業 Agent 開發平台，整合 NVIDIA NIM",
      "source": "ithome",
      "sourceUrl": "https://www.ithome.com.tw/news/12345",
      "category": "vendor-update",
      "companies": ["twcc"],
      "section": "F2",
      "ring": 3,
      "summary": "台智雲發佈企業級 Agent 開發平台，整合 NVIDIA NIM 微服務。可在台灣 GPU 叢集上跑 Agent workflow，強調資料主權。",
      "relevance": 0.72,
      "crossValidated": false,
      "crossValidationSources": []
    },
    {
      "id": "sig-005",
      "title": "Discussion: Is MCP replacing function calling? Community debate",
      "source": "hn",
      "sourceUrl": "https://news.ycombinator.com/item?id=12345678",
      "category": "community-signal",
      "companies": ["anthropic"],
      "section": "A1",
      "ring": 1,
      "summary": "HN 熱帖：MCP 是否正在取代 function calling？主流意見認為 MCP 是 transport 層，function calling 是語意層，兩者互補而非替代。",
      "relevance": 0.55,
      "crossValidated": false,
      "crossValidationSources": []
    }
  ]
}
```
