# 城ヶ崎 研究資料（2026-10-24）

給之後更新〈城ヶ崎〉或寫伊豆其他岩場的人重用。文章：`src/content/posts/climbing/2026-10-12-japan-crag-jogasaki.md`；研究筆記 `.research/2026-10-12-japan-crag-jogasaki.md`；影片資料 `src/data/climbing-videos.ts` 的 `jogasaki`。

- `youtube-candidates.tsv`：yt-dlp 搜「城ヶ崎 クライミング／ボルダー／クラック」等 8 組關鍵字得到的 166 支影片 metadata（上傳日、id、片名、頻道、秒數、說明欄前 300 字）。`used_in_post=yes` 的 40 支已放進文章；其餘多是抱石單題短片，**沒有逐支核對內容**，要用前照 `.agents/skills/post/references/climbing-gear-videos.md` 的查證方式確認並重抓 `playable_in_embed`。
- `boulder-problems.tsv`：城ヶ崎ボルダーガイド全站 170 題（區、岩、題名、級段、限定、說明、備考、網址），2026-10-24 從網站 WordPress REST 與各題頁抓。原始抓取的區域欄有錯，這份已依網址路徑重算。網站會增刪題目、手點會斷，引用前回網站確認。

不收：原始 HTML／JSON 快取（未經清理的外部頁面）、合併三個資料庫的一次性腳本（寫死城ヶ崎別名與路徑）。
