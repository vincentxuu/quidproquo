# Podcast／YouTube 逐字稿取得方法與實測

查證日期：2026-10-10。目的：替 Podcast 導讀與英文 shadowing 找到完整、可對應原音的文字來源。

## 結論

先找官方全文，再找原語言字幕，沒有現成文字才做音訊轉錄。摘要工具的回答、字幕翻譯、重新整理過的文章都不是逐字稿。

這次 Max Schoening 訪談的字幕取得已修復：舊環境 `youtube-transcript-api 1.0.3` 回空內容，在隔離環境升級為 PyPI 1.2.4 後，實際 fetch 成功取得 2419 段英文自動字幕，時間從 0 到 5242.84 秒（約 1:27:22.84），與影片結尾相符。只保存驗證 metadata，未輸出整集字幕全文。Groundlane web_content/Tavily 的 20000／45000 字元擷取仍是截斷稿；不能用它宣稱全文完整。

## 先找官方全文：這集可以去哪裡讀

- [原始 YouTube 影片](https://www.youtube.com/watch?v=mCO-D3pkviM)：說明區的 Show transcript；英文字幕軌為自動生成。
- [官方節目頁](https://www.lennysnewsletter.com/p/why-cultivating-agency-matters-more)：有 Transcript 入口，但匿名正文擷取只得到節目介紹，未讀到 transcript。
- [官方 Apple 單集頁](https://podcasts.apple.com/us/podcast/why-cultivating-agency-matters-more-than-cultivating/id1627920305?i=1000765889270)：節目方在說明提供逐字稿與完整 archive 連結。
- [節目方提供的 Dropbox archive](https://www.dropbox.com/scl/fo/yxi4s2w998p1gvtpu4193/AMdNPR8AOw0lMklwtnC0TrQ?rlkey=j06x0nipoti519e0xgm23zsn9&st=ahz0fj11&dl=0)：來源可追溯到官方單集說明；本輪擷取資料夾正文為空，尚未確認 Max 的檔案在資料夾中。
- [Lenny’s Data](https://www.lennysdata.com)：官方 repo 指向這個登入入口，區分免費 starter 與付費完整 archive。不能把公開 starter 視為全資料庫。

[官方 dataset 授權](https://github.com/LennysNewsletter/lennys-newsletterpodcastdata/blob/main/LICENSE.md)禁止原始檔再散布；付費 archive 也禁止大段原文重貼。這個條款是 dataset 的使用條款，不據此推論所有外部媒介都有完全相同條款。此輪未找到本集完整逐字稿的公開轉載授權。

## YouTube：三種路徑

### 1. 官方介面：直接聽讀

依 [YouTube Help](https://support.google.com/youtube/answer/15930243?hl=en)，有字幕的影片可從說明區開啟 Show transcript。逐字稿會隨影片捲動，點文字可跳到該段原音。

適合使用者直接 shadowing。這是官方播放頁上的全文閱讀，不需要另做摘要或重新辨識音訊。

### 2. youtube-transcript-api：程式取得現成字幕

依[專案 README](https://github.com/jdepoix/youtube-transcript-api)，目前介面是實例的 `list(video_id)` 和 `fetch(video_id, languages=['en'])`。先列出人工／自動字幕、語言與翻譯能力，再取適合的軌。`FetchedTranscript` 含 text／start／duration 與 `is_generated`。

```python
from youtube_transcript_api import YouTubeTranscriptApi

api = YouTubeTranscriptApi()
tracks = api.list("VIDEO_ID")
for track in tracks:
    print(track.language_code, track.is_generated)

# 有權取得／處理的內容，再呼叫：
# transcript = api.fetch("VIDEO_ID", languages=["en"])
```

本輪初始環境為 1.0.3，後續在隔離環境測試 PyPI 1.2.4，成功取得完整時間範圍。這是非官方、未文件化的 YouTube 介面。README 明示可能因網站變更失效，也記錄 RequestBlocked／IpBlocked 問題。列表成功不等於 fetch 成功。未新增專案 dependency；後續另建隔離 Python 環境安裝 1.2.4 做修復驗證。

### 3. yt-dlp：字幕檔與時間資訊

依 [yt-dlp 官方 README](https://github.com/yt-dlp/yt-dlp#subtitle-options)，可先列出字幕，再處理自己有權下載的字幕。

```bash
# 先看現成字幕與自動字幕的語言／格式
yt-dlp --skip-download --list-subs 'VIDEO_URL'

# 對有權下載的素材，保存字幕而不下載影片
yt-dlp --skip-download --write-subs --write-auto-subs \
  --sub-langs 'en.*' --sub-format 'vtt' 'VIDEO_URL'
```

`--write-auto-subs` 是取得網站已生成的字幕，不是工具自行替無字幕影片做語音辨識。原語言與機器翻譯軌要分清楚。

本輪只實測 `--list-subs`，退出碼 0，列出 en-orig／en 自動字幕；末尾「has no subtitles」指人工字幕清單為空，不能忽略前面的 automatic captions。

### 官方 YouTube Data API 的限制

[captions.download 官方文件](https://developers.google.com/youtube/v3/docs/captions/download)要求 OAuth 授權與影片編輯權限。它適合自己管理的影片，不是只拿 API key 就能下載所有第三方公開影片字幕的通用方案。

## Podcast：官方頁 → RSS → 音訊轉錄

1. 看節目官網／單集 show notes：Transcript、文字稿下載、GitHub、Dropbox 等入口，先確認為節目方提供。
2. 看實際 RSS 的該單集 `<item>`：若有 [`podcast:transcript`](https://podcasting2.org/docs/podcast-namespace/tags/transcript)，依 `url` 讀取節目方發布的檔案；`type` 表示 text／HTML／VTT／SRT／JSON。標籤可有多個，也可能沒有。本輪未檢查 Lenny RSS。
3. 用 Apple Podcasts 聽讀：[官方文件](https://podcasters.apple.com/support/5316-transcripts-on-apple-podcasts)說明可以搜尋文字並跳到原音。聽眾複製／分享有上限；完整稿下載是 Podcasts Connect 的創作者管理功能，不能當作公眾批次下載 API。
4. 完全沒有文字稿，且音訊取得與處理有授權時，使用 ASR。要保留說話者與時間資訊，並人工核對專名及辨識不確定處。

## 沒有字幕時：ASR 轉錄

[OpenAI Whisper 官方 repo](https://github.com/openai/whisper)可對音訊做辨識，需要 ffmpeg；CLI 預設轉錄原語言，與翻譯任務要區分。範例針對自己擁有或獲授權處理的音訊：

```bash
whisper my-authorized-audio.mp3 --model turbo --language English --task transcribe
```

本機沒有 Whisper，未安裝、未下載模型、未做 ASR 實測。Groundlane callable inventory 另有 `document_transcribe`：接受 base64 音訊，上限 25 MB，輸出含 segments，需要 Cloudflare credentials。工具已掛載不代表 credentials 已驗證或長音訊可直接處理；本輪沒有呼叫。

## 完整性與來源資料應該留什麼

- 來源 URL、影片／單集 ID、取得日期、取得方法。
- 人工／自動字幕／ASR，原語言／翻譯，以及未核對的專名。
- 每段 start、end 或 duration；不要只留失去時間的純文字。
- 工具回傳 truncated、末段時間與音訊長度的比較；廣告／片頭／不同平台剪輯版本可能造成偏移。
- 空稿、片段稿、章節與摘要各自標示，不能說成完整逐字稿。
- 可閱讀與可轉載分別確認；網站、repo 或 API 的授權條款不因可下載而消失。

## 本輪讀取／實測盤點

| 來源／工具 | 讀到或做到什麼 | 限制 |
|---|---|---|
| YouTube Help | 全文 | 官方播放頁步驟；未做瀏覽器互動驗收 |
| youtube-transcript-api README | 全文 | 舊環境 fetch ParseError；隔離 1.2.4 fetch 與時間覆蓋驗證成功 |
| yt-dlp README | bounded 閱讀，確認 Subtitle Options | 只跑 list-subs，未下載字幕 |
| captions.download 文件 | 全文 | OAuth 與編輯權限制 |
| Apple transcript 文件 | 全文，由子 agent Groundlane 查證 | 未操作 Apple app |
| podcast:transcript 規格 | 全文，由子 agent Groundlane 查證 | 未核查本集 RSS |
| Whisper README | 全文 | 未安裝／實測 |
| Lenny README／LICENSE | 全文 | archive 內個別檔案未驗證 |
| Groundlane provider content | 20000／45000 字元字幕擷取成功 | 都有 truncated，非完整 |

本輪主要網頁查證走 Groundlane。子 agent 有一次 Exa discovery（inventory 篩選誤漏 Groundlane），之後所有依賴的官方事實皆重新以 Groundlane 查證；詳見 `.work/podcast-transcript-official-research.md`。先前主線的 connector 重新認證錯誤與平台 web fallback 記在 `.work/podcast-shadowing-format.md`。

## 證據檔案

- `.work/transcript-research/youtube-api-result.json`：字幕軌列表。
- `.work/transcript-research/youtube-completeness.json`：fetch 失敗結果；沒有保存全文。
- `.work/transcript-research/yt-list-subs.log`：yt-dlp 列表結果。
- `.work/podcast-transcript-official-research.md`：官方 Podcast 路徑與閱讀範圍。

## 下載失敗原因的進一步診斷

重跑 `youtube-transcript-api`（本機版本 1.0.3）並只記錄字幕 HTTP 回應 metadata：`www.youtube.com/api/timedtext` 回 HTTP 200、0 bytes、Content-Type `text/html; charset=UTF-8`、沒有 redirect。工具把空內容交給 XML parser，因此產生 `ParseError: no element found: line 1, column 0`。這證明直接故障點是字幕端點回空內容，並非此片沒有英文字幕，也不是授權條款導致技術下載失敗。尚未驗證是 YouTube 請求限制、介面／參數變動或本機套件相容性；不能說已確認 IP 封鎖。`yt-dlp` 僅列表測試成功，未測完整字幕下載。Groundlane 部分字幕擷取則是輸出上限截斷，屬另一種狀況。
證據：`.work/transcript-research/youtube-http-diagnosis.json`。


## 已驗證的修復方法

PyPI 官方 metadata 當次版本為 [1.2.4](https://pypi.org/project/youtube-transcript-api/1.2.4/)。在隔離環境更新工具後，字幕端點從 0 bytes 變為 192068 bytes 的 XML。已連續成功取得並量測字幕，驗證 2419 段、87534 字元、首段 0 秒、末段 5242.84 秒。

```bash
python3 -m venv /tmp/quidproquo-transcript-check-20261010
/tmp/quidproquo-transcript-check-20261010/bin/python -m pip install 'youtube-transcript-api==1.2.4'
/tmp/quidproquo-transcript-check-20261010/bin/python \
  .work/transcript-research/verify-transcript.py mCO-D3pkviM \
  --expected-duration 5242 \
  --output .work/transcript-research/youtube-retrieval-verified.json
```

這支驗證腳本只保存 HTTP metadata、語言、自動字幕標示、段數與時間邊界，不輸出字幕原文。`timeline_coverage_verified` 表示首尾時間接近影片範圍，不代表逐字正確、沒有中間漏句、人工字幕，或取得轉載授權。影片長度要從相同平台版本確認。

未修改專案 package.json、lockfile 或全域 Python 工具。新版成功可以證明這次更換工具環境有效；尚未拆解套件與 requests 等依賴的全部差異，不把某個特定上游 commit 寫成已確認根因。

證據：`youtube-http-diagnosis-v103.json`、`youtube-http-diagnosis-v124.json`、`youtube-completeness-v103.json`、`youtube-completeness-v124.json`、`youtube-retrieval-verified.json`，均在 `.work/transcript-research/`。
