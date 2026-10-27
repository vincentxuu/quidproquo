# 研究 brief：裂隙攀登技術系列（crack-climbing）

讀者：會在岩館爬、看過站上〈裂隙怎麼爬〉總論（src/content/posts/climbing/2026-10-18-crack-climbing-technique.md，先讀它的參考資料避免重做），想按裂隙尺寸逐項練好的台灣攀岩者（主要岩場：龍洞，粗糙石英砂岩/變質礫岩）。

## 母群定義
- 影片：2020-01-01 以後上傳、內容是裂隙技巧「教學」或「攀爬實錄（能看清技巧）」的 YouTube 影片（Vimeo 可列但標註）。排除：90 秒以下短片、Shorts、純剪輯 MV 看不到手腳、AI/行銷彙整、2020 以前。
- 心得/文字：教練、嚮導、協會、知名攀岩者、一般攀岩者的教學文或心得（blog、UKC、Climbing.com、Mountain Project 論壇、Reddit r/tradclimbing、日文/韓文/中文部落格）。教學原理可收經典（如 Pete Whittaker《Crack Climbing》書摘），但「心得與影片」以 2020+ 為主。

## 覆蓋矩陣（每個子技巧都要盡量填滿）
| 維度 | 要求 |
|---|---|
| 岩場/岩質 | 至少 3 個不同岩場：Indian Creek（砂岩平行裂隙）、Yosemite/Squamish（花崗岩）、英國 gritstone/Peak、日本（小川山、瑞牆、城ヶ崎）、韓國（仁壽峰）、台灣龍洞、歐洲（Cadarese、Valle dell'Orco、Chamonix）、澳洲、南非等 |
| 人 | 至少 3 個不同人：職業攀岩者（Wide Boyz Pete Whittaker/Tom Randall、Hazel Findlay、Babsi Zangerl…）、教練/嚮導、一般攀岩者/新手學習紀錄；性別多樣；**手大小差異**（小手/大手對尺寸的影響）要特別找 |
| 類型 | 教學片 + 實際攀爬片都要有 |
| 語言 | 至少 1 支非英語（日/韓/中/其他） |
| 反證/失敗 | 常見錯誤、受傷、「這招對小手沒用」之類的不同意見 |

## 每支影片必須用 yt-dlp 查證
- 搜尋：`yt-dlp "ytsearch25:<query>" --flat-playlist --print "%(id)s|%(title)s|%(channel)s|%(duration)s"`，再對候選逐支 `yt-dlp --skip-download --print "%(id)s|%(title)s|%(channel)s|%(upload_date)s|%(duration)s" <url>` 拿確切 upload_date（每次間隔 ≥3 秒；被擋就加 `--cookies-from-browser chrome`）。
- 讀字幕或說明欄才能列入：`yt-dlp --skip-download --write-auto-subs --write-subs --sub-langs "en.*,ja,ko,zh.*" --sub-format vtt -o "<scratch>/%(id)s" <url>`，或 `--print description`。記下「從第幾秒開始示範什麼」（start 秒數要有字幕/章節依據）。
- 輸出每支：`video_id | 標題 | 頻道 | upload_date | 長度 | 岩場/地點 | 人物 | 類型(教學/實錄) | 語言 | 示範重點＋start 秒數 | 查證方式(字幕/說明欄/章節)`。

## 網頁抓取 fallback 鏈（一個壞了就換下一個，不准停）
1 Groundlane MCP（mcp__groundlane__web_search/web_fetch，可能是 deferred，先用 ToolSearch 載入）→ 2 Groundlane 直接 HTTP（WebFetch POST https://groundlane.vincent-xu-work.workers.dev/mcp）→ 3 Keenable keyless（GET https://api.keenable.ai/v1/search/public?query=...，Header X-Keenable-Title: quidproquo）→ 4 You.com keyless（GET https://api.you.com/mcp?profile=free）→ 5 Exa / Tavily（mcp__claude_ai_Exa__web_search_exa、mcp__claude_ai_Tavily__tavily_search 等，先 ToolSearch 載入）→ 6 WebFetch / curl。記錄 toolDegradation。

## 結案標準
- 文字來源標 ✅（讀過全文）/🟡（只讀摘要）/🔴；每個 🟡🔴 要關閉成 ✅、⚪（整條鏈試過確認無公開資料，列工具+失敗原因）或 ✉️。
- 每個教學主張至少一個 ✅ 來源，附原文短句。
- 寫出各子技巧的「教學重點」（步驟、常見錯誤、何時用、對小手/大手的差異、在粗糙岩 vs 光滑岩的差異）。
- 最後列覆蓋矩陣與仍缺的格子（缺口要先補搜一輪）。
- 不要修改 repo 中除了你的輸出檔以外的任何檔案（repo 有多個 agent 同時編輯）。暫存檔放 /private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/15b045f4-4588-4bdc-aa33-b878e65bd926/scratchpad/crack/<你的主題>/。
- 回覆主執行緒只給 10 行內摘要＋輸出檔路徑。
