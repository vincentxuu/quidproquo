# 抽取紀錄：Omnivore 停止服務（2024）

read_status=full（兩篇官方部落格公告各自整頁讀完，經 Wayback 快照；另讀 GitHub README 現況與 ElevenLabs 公告）

## 書目與實際讀的版本

1. Omnivore 官方部落格（Substack）："Omnivore is joining ElevenLabs — a note from our founders", 2024-10-29，署名 Jackson & Hongbo
   - 原址 https://blog.omnivore.app/p/omnivore-is-joining-elevenlabs （現況 exa 回 CRAWL_HTTP_502）
   - 實際讀：Wayback 快照 20250503155629（id_ 原始 HTML，gzip 解壓後轉文字）
2. Omnivore 官方部落格："Details on Omnivore shutting down", 2024-10-31
   - 原址 https://blog.omnivore.app/p/details-on-omnivore-shutting-down （現況 502）
   - 實際讀：Wayback 快照 20250503155629
3. ElevenLabs 官方部落格："Omnivore joins ElevenLabs", 2024-10-29，https://elevenlabs.io/blog/omnivore-joins-elevenlabs （exa 搜尋摘錄，內容完整呈現但非全頁 fetch）
4. GitHub README（現況）：https://github.com/omnivore-app/omnivore ，raw README 2026-10-22 下載；repo 未封存（archived: False），最後 push 2026-10-21。
5. omnivore.app 現況（tavily_extract）：網域已被 SerpNames 網域市集標為出售，頁面是「保留原站內容供參考」的副本，頁尾寫 "Domain for sale ... Not affiliated with prior owners."

## 性質

官方服務終止公告（acqui-hire：團隊加入 ElevenLabs）。不是研究。

## 可引用事實

### 2024-10-29 創辦人公告
- 加入 ElevenLabs："Our team is joining ElevenLabs to help drive the future of accessible reading and listening with their new ElevenReader app."
- 匯出期限（原定）："Next, all Omnivore users will be able to export their information from the service through November 15 2024, after which all information will be deleted."
- 開源承諾："ElevenLabs is committed to the developer community and the Omnivore codebase will remain 100% open-source for all users."

### 2024-10-31 細節公告（延期）
- 延期與原因："Omnivore will support exports through November 30, 2024. We had to make the difficult decision to wind down the service quickly due to increasingly high costs of running Omnivore in recent months. We understand the timeline is a concern and will cover these costs through the end of the month—you can export your Omnivore data through November 30, 2024."
- 刪除範圍："We plan to erase user data from the service after this period, including links, highlights, folders, and personal user data."
- 替代方案（官方推薦）："We recommend checking out Reader by Readwise (paid service) or Wallabag (open-source), which are great options for read-it-later apps and both have plugins to work with Obsidian. Readwise has released an Omnivore importer you can check out, as well."
- 自架："Our open-source user community has developed self-hosting support for Omnivore here."
- ElevenReader 定位："It's not a dedicated read-it-later app"

### ElevenLabs 公告
- "the team behind Omnivore, a popular iOS reader app used by 500,000 globally, has joined the company."（使用者數是 ElevenLabs 的說法）

### GitHub README 現況
- "Omnivore is now a completely Self-Hosted application. The Cloud application was deprecated in November of 2024. The community still exists on Discord, and we endeavour to keep things updated and bug-fixes ongoing."

### 原站（現為網域市集保留副本）上的承諾文案
- "Open source means you're in control. Reading is a lifetime activity, and you shouldn't have to worry you'll lose your library after you've spent years building it. Our open-source platform ensures your reading won't be held prisoner in a proprietary system."
- "Omnivore syncs with popular Personal Knowledge Management systems including Logseq and Obsidian"
- 注意：這段文字現在掛在網域出售頁上，引用時要註明是原站文案、讀自網域轉售頁的保留副本，不是現任官方頁。

## 限制

- 官方部落格現址已 502，只能靠 Wayback 2025-05-03 快照；快照時間在公告後半年，內容可能被事後編輯過（Substack 允許改文），但與當時媒體轉述（heise、TechCrunch、使用者轉貼的 email）一致。
- 沒有官方資料說明有多少使用者在期限內完成匯出。
- 「500,000 使用者」只有 ElevenLabs 一方說法。

## 與摘要或常見轉述不一致處

1. 匯出期限有三種日期在流傳：
   - 官方 10/29 公告：November 15, 2024
   - 官方 10/31 細節公告：延到 November 30, 2024
   - TechCrunch 2024-10-29 報導："Omnivore users can export their data until November 16"（與官方都不一致）
   - 很多文章（heise、The Verge「只剩約兩週」）只記 11/15，沒跟上延期。引用要寫「原定 11/15，兩天後延到 11/30」。
2. 「開源所以資料安全」與實際：程式碼保留開源、社群做出自架版，但雲端服務的使用者資料仍在期限後刪除；開源保住的是軟體，不是個人雲端資料。
3. 「Omnivore 被 ElevenLabs 收購」：官方用詞是團隊 "joining" ElevenLabs，ElevenLabs 也寫 "has joined the company"；TechCrunch 標題用 "hired the team"。不要寫成產品被收購後繼續營運。
4. 停止原因：10/29 公告只講加入 ElevenLabs；10/31 才說明 "increasingly high costs of running Omnivore in recent months" 是必須快速收掉的原因。

## 讀取紀錄

- 全文：
  - /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/omni-join.txt（59 行，2,348 bytes）
  - /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/omni-details.txt（60 行，2,948 bytes）
  - /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/omnivore-github-readme.md（180 行，8,351 bytes）
- 依序讀過：omni-join.txt 1–59、omni-details.txt 1–60、README 1–30 全讀並 grep 其餘段落（其餘是功能清單、貢獻者、自架指令）、omnivore.app 現況頁全頁、ElevenLabs 公告搜尋摘錄
- 失敗管道：blog.omnivore.app 以 exa web_fetch 回 CRAWL_HTTP_502；jina read_url（Wayback URL）回 HTTP 402 餘額不足；Wayback 第一次下載未解壓，gunzip 後成功。
- 讀取日期：2026-10-22
