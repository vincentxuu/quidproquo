# 寫手共同說明：出國攀岩裝備 v2

工作目錄：`/Users/xiaoxu/Projects/qpq-gear-travel`（獨立 worktree，branch `post/climbing-gear-travel-replan`）。所有路徑都相對於這裡。**不要 commit、不要 push**，只寫檔案。

## 必讀

1. `.work/series-plans/climbing-gear-travel.md`：系列規劃，找你那篇的範圍卡，照「講／不講」寫。
2. `.agents/skills/post/SKILL.md` 與 `.agents/skills/post/references/writing-guide.md`、`taiwan-voice-structure.md`、`frontmatter-schema.md`、`anti-shortcuts.md`：寫作規範。
3. 研究檔 `.work/climbing-gear-travel/research-v2/`：`community-examples.md`、`airline-rules.md`、`bag-catalog.md`（若存在）。
4. 舊稿（已下架，可沿用其中已查證的事實，但要重新確認現行款）：`git show origin/main:src/content/posts/climbing/2026-10-19-<舊 slug>.md`，舊 slug 有 climbing-gear-travel-overview、dynamic-rope-triple-rating、multipitch-rope-systems、multipitch-climbing-backpacks、climbing-travel-packing。舊審稿紀錄在 `.work/reviews/`。

## 使用者明確要求（違反就是重寫）

- 跟「攀岩裝備」系列（series slug `climbing-gear`）不重疊：鞋、吊帶、頭盔、確保器、鉤環、繩標籤、保養汰換都由它負責，需要時連結：
  - `/posts/climbing/2026-10-19-climbing-gear-buying-order`（購買順序、標籤）
  - `/posts/climbing/2026-10-19-climbing-shoes`
  - `/posts/climbing/2026-10-19-climbing-harness-helmet`
  - `/posts/climbing/2026-10-19-climbing-rope-belay-device`（繩端 1、½、∞，確保器與鉤環）
  - `/posts/climbing/2026-10-19-climbing-gear-inspection-retirement`
- 系列內不重疊：每篇只回答自己的聚焦問題，別篇的主題一句話帶過加連結。
- 出國攀岩多數只帶一條單繩；雙繩／半繩只是例外段落。
- 品牌只收攀岩、登山、戶外品牌，不收都市旅行包品牌（Aer、Cotopaxi、Peak Design、Tortuga、Nomatic 等）。品牌要多、型號要是現行款。
- 社群分享只收 2020 年以後，寫出日期。
- 導讀（order 0）要像導讀：不放型號和價格。

## 系列篇目（站內連結用這些 slug）

| order | 檔名 |
|---|---|
| 0 | `2026-10-19-climbing-gear-travel-overview` |
| 1 | `2026-10-19-climbing-trip-gear-list-by-destination` |
| 2 | `2026-10-19-flying-with-climbing-gear` |
| 3 | `2026-10-19-climbing-travel-packing-examples` |
| 4 | `2026-10-19-climbing-travel-luggage` |
| 5 | `2026-10-19-climbing-crag-packs` |
| 6 | `2026-10-19-multipitch-climbing-backpacks` |

連結格式：`/posts/climbing/<檔名>`，英文版加 `-en`。

frontmatter：`category: climbing`、`date: 2026-10-19`、`series: { name: "出國攀岩裝備", order: N }`（英文版 name 用 "Climbing Travel Gear"——先看 `src/utils/series.ts` 與 origin/main 的舊英文稿確認英文版 series name 的實際寫法）、`draft: false`。tags 先查既有 climbing 文章的 tag，不要造新拼法。

## 事實規則

- 沒來源不寫。航空與安檢規則只引用 `airline-rules.md` 裡的官方來源；研究檔標「推論」的地方，文中也要寫成推論或不寫。各國安檢由現場人員裁量，不能寫成「官方允許」。
- 社群實例不要寫成通則：寫「N 個實例中有 M 個這樣做」，並說明是誰、哪年、哪裡。
- 價格寫查詢日期（2026-10-19）與幣別；不稱「銷量排行」「實測」。
- 每篇文末 `## 參考資料`，列出文中用到的連結。

## 交付

1. 寫中文版 `src/content/posts/climbing/<檔名>.md`。
2. 依 post-review、post-polish 兩個 skill（`.agents/skills/post-review/SKILL.md`、`.agents/skills/post-polish/SKILL.md`）自審並修正；依 post-verify 抽查關鍵事實。
3. 依 `.agents/skills/post-translate/SKILL.md` 寫英文版 `<檔名>-en.md`，兩篇互相連結的方式照該 skill。
4. 審稿紀錄寫到 `.work/reviews/<檔名>.md`（若已存在舊版，整份覆蓋），要有 `## post-verify`、`## post-review`、`## post-polish` 三節，記結論與修了什麼。
5. 跑 `pnpm check:references` 確認你的檔案沒有壞連結（別篇尚未寫好造成的系列內連結錯誤可以忽略，但要在回報中列出）。
6. 回報給主 session：檔案路徑、字數、引用來源數、沒查證到而略過的內容（3–6 行即可）。
