# 跟讀交付檢查
文章：2026-10-13-meta-muse-launch-gate-eval-rows（zh/en）
實際提供：原站字幕跟讀，三段連續原音（YouTube 時間）：21:54–22:37（43s）、23:38–24:41（63s，為收在完整句多 3 秒）、34:54–35:29（35s）；各段 start/end/loop、中文重點、短引句、可學表達、原音時間連結
字幕核對：YouTube 只有自動字幕（en-orig, asr），無人工字幕；三段與 Whisper 轉錄一致（見 audio-check.md）
原音回聽：機器轉錄兩次（本機 mlx-whisper small.en、Cloudflare Workers AI @cf/openai/whisper-large-v3-turbo）；未人工耳聽
播放器實測：2026-10-13 Chrome，IFrame API（youtube-nocookie host）三段起點正確、於 end 秒數停止（ENDED）、跳回段首續播；captions track = English (auto-generated)。站內控制器 src/lib/youtubeClipLoop.ts 同樣於 ENDED seekTo(start)
轉載依據：未重新散布逐字稿，頁內只有每段一句短引句，完整字幕在 YouTube
pnpm verify：本機 worktree 全綠
