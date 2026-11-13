# 寫稿說明：「教學文章怎麼寫」系列第二批起

工作目錄 /Users/vincent/Work/study/quidproquo。你負責系列中的一篇（order 在你的指示裡），只寫中文稿，英文稿等審稿通過後另派。

## 先讀

1. `.agents/skills/post/SKILL.md`、`.agents/skills/post/references/writing-guide.md`（含台灣用語替換表，必讀）。
2. 系列規劃 `.research/2026-10-13-learning-content-series-plan.md`：你那篇的聚焦問題、前後篇、斷崖處理、站內連結。
3. 你那篇的精讀清單（`.research/2026-10-13-reading-list-order-*.md` 或 `.research/2026-10-14-reading-list-order-20-24.md`）：看列了哪些來源、哪些結論寫不了。清單上「要撐的結論」是掃描階段的暫定說法，**不能當依據**。
4. 抽取紀錄：`.research/extractions/articles-that-teach/` 與 `.research/extractions/teaching-text/` 中屬於你那篇的每一份，**整份讀完**，特別是「與清單『要撐的結論』不合的地方」「作者自己列的限制」「與摘要說法不一致」三節。抽查結果在 `.research/extractions/_audit/`（含 `provenance.md`）。
5. 同系列已發佈的篇（`src/content/posts/learning/2026-10-13-*.md`，中文檔），至少完整讀 `2026-10-13-teaching-text-evidence.md`，照它的結構與語氣寫：先看結論、主體各節、來源說法不同的地方、可以做的事、證據的限制、附錄（各研究的設計與數字）、參考資料。

## 證據規則（違反就是必須修）

- 研究的數字、結果、作者說法，**只能**取自抽取紀錄，連同對照條件、樣本、限定範圍一起寫。不得從記憶或摘要補。
- 檔頭標 ⚠ 不得引用的紀錄：文章裡只能寫「這篇研究存在，我沒讀到合法公開的全文」，不引數字、不列入參考資料。
- 紀錄標「本紀錄計算」「推測」的，文章要寫成「我從它的表算出」「我的推論」，不能寫成作者說的。
- 不顯著就寫「沒有測到差異」，不寫成「沒有效果」或「一樣好」；相關不寫成因果。
- 各來源說法衝突的，列在「來源說法不同的地方」，不要選邊。
- 寫不了的結論照實寫「目前沒有研究直接測過」，不要用相鄰研究硬撐。
- 推論與建議要標成作者（本站）的判斷，並說依據是哪幾項結果。
- 參考資料每一筆附 DOI 或合法公開網址（取紀錄檔頭的合法來源），註明讀的是刊出版、作者稿或預印本。

## 文章規格

- 檔名：`src/content/posts/learning/2026-10-14-<英文 slug>.md`；`date: 2026-10-14`；`category: learning`；`type: deep-dive`；`lang: zh-TW`；`series: { name: "教學文章怎麼寫", order: <你的 order> }`；`draft: false`；tags 沿用同系列已有的標籤，必要時加一兩個。
- 開頭一行 `> 🌏 [English version](/posts/learning/2026-10-14-<slug>-en)`（英文稿之後補）。
- 開頭交代這篇在系列的位置與起因（本站寫課程導讀時遇到的實際問題，見規劃檔），連到已發佈的相關篇（已發佈：order 1 `2026-10-13-teaching-text-evidence`、2 `2026-10-13-diagrams-in-teaching-articles`、5 `2026-10-13-instructional-video-in-articles`、6 `2026-10-13-video-beside-text-layout`、9 `2026-10-13-teaching-text-questions-feedback`）。尚未發佈的篇只寫「之後的篇會談」，不放連結。
- 規劃檔或清單提到要對照本站做法的（例如 `.agents/skills/post/references/course-guide-contract.md`），在「可以做的事」或專節逐條對照，標明哪些是依據、哪些是本站自己的選擇。
- 篇幅不設上限，但不灌水；細節放附錄。不要為了好讀把限定條件刪掉。
- 不加 mermaid 圖，除非規劃檔明說要；表格可以用。

## 寫完自己做

- `node scripts/check-tw-terms.mjs <你的檔>` 與 writing-guide 替換表逐項掃過，零命中。
- `node scripts/check-post-quality.mjs <你的檔>`（若接受檔案參數；不接受就跳過）。
- 逐段回抽取紀錄核對一遍數字。
- 不跑 `pnpm dev`、不跑整站建置、不 commit、不改其他文章與 skill。

## 回報（150 字以內）

檔名與字數；用了哪些抽取紀錄；哪些清單上的結論因為精讀結果被拿掉或改寫；哪些地方你不確定、希望審稿特別看。
