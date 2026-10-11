# YouTube 嵌入查核

文章中的 `youtube` fence 可先建立清單，再透過 YouTube Data API 的 `videos.list` 查 `status.embeddable` 與 `contentDetails.regionRestriction`。這是上線前的 API 狀態查核，不能證明讀者實際播放成功；地區、登入、瀏覽器環境與後續影片設定變更仍可能影響播放。

建立全站清單（不需金鑰，不會呼叫 API）：

```sh
node scripts/check-youtube-embeds.mjs --output /tmp/youtube-embeds.json
```

只查特定文章或目錄：

```sh
node scripts/check-youtube-embeds.mjs --output /tmp/cs149-youtube.json src/content/posts/ai/2026-09-30-cs149-gpu-architecture-cuda.md
```

若 shell 已安全設定 `YOUTUBE_API_KEY`，相同命令會查 API。金鑰只在本機腳本使用，不放進文章、前端、報告或 Git；建議限制金鑰只能呼叫 YouTube Data API。腳本每批最多 50 個 ID、每次請求最多 15 秒，不重試；每個結果記錄 `checkedAt`、`embeddable`、地區限制與引用位置。重複 ID 只查一次。

- `mode: inventory_only`：沒有金鑰；所有狀態為 `unknown`、`checkedAt: null`，完全沒有驗證嵌入或播放。
- `status: checked, embeddable: false`：API 明確禁止嵌入，應改用前往 YouTube 的連結卡片。
- `status: checked, embeddable: true`：查核時允許嵌入；另看 `regionRestriction`，並保留播放器的錯誤處理與原站連結。
- `status: unknown`：API 失敗、逾時、欄位缺少或 ID 未回傳。`not_returned` 無法區分刪除、私人或其他原因，不能寫成「私人影片」。`checkedAt` 只表示查核嘗試時間。

報告不會自動修改文章，也不會直接控制播放器。API 查核含未知結果或無效 fence 時，退出碼為 1，仍寫出完整報告；無金鑰的正常清單退出碼為 0。API 明確禁止嵌入仍是成功取得狀態，需閱讀報告處理內容。

確認禁止嵌入後，改用普通觀看連結卡片，並同步更新中英文章的影片狀態、查核日期與更新紀錄：

```markdown
<figure class="video-embed">

[前往 YouTube 觀看 ↗](https://www.youtube.com/watch?v=qQTDF0CBoxE)

</figure>
```

目前課程狀態閘門把所有 `youtube` fence 視為嵌入，因此已知受限的課程影片使用上述普通連結。Renderer 也支援 `embed: false` 連結模式，但不適合用在此閘門下的受限課程文章。

未禁止嵌入的播放器使用 IFrame API 偵測 `onError`：101／150 顯示擁有者限制，100 顯示影片無法取得或私人，153 顯示播放器設定問題；其他錯誤用一般失敗訊息。失敗時移除 iframe，保留原始觀看連結。API 腳本被阻擋或逾時時仍保留原播放器與連結，不把網路問題記成影片禁止嵌入。播放器只在接近可視區時初始化，不自動播放。

執行腳本測試（使用假的 API 回應，不連網）：

```sh
node --test scripts/check-youtube-embeds.test.mjs
```

參考：[videos.list](https://developers.google.com/youtube/v3/docs/videos/list)、[Video resource](https://developers.google.com/youtube/v3/docs/videos)、[IFrame API 播放錯誤](https://developers.google.com/youtube/iframe_api_reference#onError)。
