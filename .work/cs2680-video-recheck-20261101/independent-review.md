# CS2680 錄影狀態獨立複查

查核日：2026-11-01。唯讀研究，未修改 repo 的文章、設定或程式，未接觸 secrets。

## 結論

官方政策仍明確表示課程不錄影；第 1、2 講課表仍只連投影片，沒有原課錄影。官網可見的兩個 YouTube 連結是補充閱讀影片，不應填入原課錄影登錄。

## 一手證據

- 官方政策：https://cs2680.com/policy
- FAQ 原句：**“Will lectures be recorded? No, the lectures will not be recorded.”**
- 本次以 no-cache HTTP 請求直接讀取政策與首頁，兩者 HTTP 200；response Date 都是 `Sun, 01 Nov 2026 04:58:40 GMT`。政策頁 HTML 保存 `/tmp/cs2680-policy-independent.html`，首頁保存 `/tmp/cs2680-home-independent.html`。
- 官方首頁／課表：https://cs2680.com/
  - 2026-09-02 Course overview and logistics：只有 slide 入口。
  - 2026-09-09 Agents use I: How Claude Code Works：只有 slide 入口。
  - 官方 schedule 內嵌於首頁；`https://cs2680.com/schedule` 在 Exa 回 CRAWL_NOT_FOUND，不能把不存在的獨立路徑當證據。
- 首頁實際 HTML 的兩個 YouTube anchors：
  - `https://www.youtube.com/watch?v=EWvNQjAaOHw`，anchor = `How I use LLMs`。
  - `https://www.youtube.com/watch?v=LCEmiRjPEtQ`，anchor = `Software is changing (again)`。
  - 兩者位於 readings 欄，不是 Juncheng Yang 的 CS2680 課程錄影。
- 官網講師連結：https://juncheng.seas.harvard.edu
  - Exa 已讀正文，該頁有研究介紹的 Video 區，沒有可識別為 CS2680 第 1、2 講的錄影清單。

## 工具與範圍

- 完整 callable inventory 無 Groundlane，先用 Exa search/fetch 取得官方首頁、政策、講師頁正文；為確認即時性再以一般公開 HTTPS no-cache 請求讀取官方 HTML（沒有使用退役工具或瀏覽器抓取）。
- 另以 Exa 搜尋 `CS2680 course lectures recordings video YouTube 2026` 與 `"CS2680" "YouTube" "lecture"`，結果主要回官網、官方 slides、reading 影片及非官方導覽，沒有找到由官方連出的原課播放清單。
- 沒有影片內容判斷或時間碼更新，因此未看字幕，也不聲稱已觀看原課錄影。
- 證據足以支持「政策仍不錄影、未新增官方原課錄影入口」，不擴張成不存在私人、未列或未授權錄製檔案的全網斷言。
