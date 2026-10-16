# coverage-report — pmQhqVLVApw

- 需求與實際交付形式：使用者貼連結並要求「用新的 skill 來寫文章」。交付：有來源定位的雙語導讀（zh-TW＋en）。未要求逐字稿／逐句翻譯，也未要求頁內逐字稿。
- 材料：(1) Exa 取得的無時間戳純文字，疑為自動字幕；(2) 2026-10-16 本機 `scripts/transcribe.mjs` 產出的 Whisper（@cf/openai/whisper-large-v3-turbo）帶時間戳轉錄，8 段×300 秒，最後 cue 35:57.7，對照時長 35:59 無缺段。YouTube 無英文人工字幕（腳本查無）。
- 媒體時長與依據：35:59（YouTube 頁面 schema.org duration PT35M59S，2026-10-12 抓取）。
- 已取得與已讀範圍：整段文字，從開場「three types of people」到結尾「Bye」，已全讀。
- 分頁完成／來源截斷：單次回應，未見截斷標記；無時間戳，無法用最後字幕時間對照時長。約 9,000 字／36 分鐘，語速合理。
- 疑似缺段與解釋：無明顯缺段；影片中插入的推廣段（訓練營、Eden）有保留在文字內。無法排除片尾資訊卡。
- 字幕文字核對：兩份機器稿交叉核對。C6 字幕「10 to 50% team」，Whisper 為「10 to 50 person team」（08:42–08:54），採後者並標為講者估計。Whisper 段落交界 20:00 漏字（「the what you care about and [what] you uniquely can do」），未引用該句。
- 原音回聽：未人工回聽。2026-10-16 本機取得音訊並轉錄（Whisper），但機器轉錄不等於回聽；引語標「機器轉錄」。
- 畫面核對與畫面依賴：未核對。講者提到螢幕上的「達爾文日常圖表」與四象限圖；文章不依賴畫面內容下結論。
- 未解決辨識／說話者／事實疑點：C4（250 年）、C6（團隊比例）、C8（達爾文時數）、C12（GTA 6）均不當事實使用。
- 完整轉載／翻譯的權利依據：無。原始文字與 Whisper VTT 保存在 scratchpad，不進 repo；文章只含短引文與改寫。
- 可下結論範圍、應省略主張與下一步：只能代表講者在此支影片的論點。英文跟讀區已補三段（起訖依 Whisper 時間戳），見 shadowing-delivery-checklist.md。下一步：人工回聽三段起訖與引句。
- 取得路徑揭露：Groundlane web_fetch 只拿到頁面 metadata；字幕文字改走 Exa web_fetch_exa（fallback，不算 Groundlane 驗證）；jina 401。
