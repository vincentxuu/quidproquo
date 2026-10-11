# media-to-post 實測報告

日期：2026-10-11。本輪為來源處理與文章交接測試；不是影音回聽／畫面／播放器完整驗收。

| 案例 | 真實來源與取得 | 已驗證 | 限制 |
|---|---|---|---|
| 有字幕 YouTube | W3C Video Captions，iWO5N3n1DXU；官方 VTT＋官網描述稿 | 10 cues 時間順序、逐 cue 與文字稿一致、3 項主張定位、雙語交接草稿 | 短片，未驗證技術示範／長篇分頁；媒體時長、原音、畫面、播放器未核對 |
| 雙人 podcast | W3C 官方 2006 年 6 月 WCAG 2 草案訪談文字 | 13 段歸因、4 主張證據、主持提問與來賓結論分開、人工評估限制、歷史語境、雙語草稿 | 原音未回聽；逐段時間、時長、權利未確認 |
| 取得失敗／截斷 | 3Blue1Brown YouTube watch 與官方 companion page | content provider 不可用、HTTP 200 只有導覽、bounded HTML 回應 truncated=true 均不能冒充完整逐字稿 | 不代表原片沒有字幕；配套文章不等於原音；未續抓全文（負向案例） |

## 檢查證據

- run_checks.py / checks.json：VTT 順序與文字一致性；真實失敗／截斷回應。
- 各案例目錄：原始工具回應、來源與覆蓋報告；正常案例另有主題地圖、主張對照及雙語交接草稿。
- podcast/results.md：來源範圍內的實際核對結果。
- independent-review.md：獨立審查：文字忠實度、歸因、雙語與時間定位通過；三個合成錯誤均應拒絕。已修正文案對官網段落／VTT cue 及未回聽範圍的兩處表述。
- pnpm skills:sync 完成；pnpm verify 全綠，log：/tmp/quidproquo-media-validation-verify.log。
- fault-fixtures.json：合成失敗例，非真實轉錄；其分類審查不能當作轉錄工具實測。

## 實測帶來的修正

skill 加入「HTTP 200／ok／truncated=false 不代表取得字幕正文」與「配套文章不是原音逐字稿、頁面更新日不是影片發布日」。

## 驗收結論與下一步

已證明本輪來源快照可以支持可回查、保留限制的寫作材料。尚不能宣稱完整影音 pipeline 已驗收：還需實際回聽、畫面與播放器驗證、至少一部較長技術影片的全文／分頁測試，以及無字幕音訊的 ASR 路徑測試。

本次只發布 skill 與摘要，不發布文章或第三方全文；原始證據保留於來源工作目錄。

## 獨立審查

# Independent adversarial review

Scope: read-only review of the saved video artifacts, Groundlane response JSON, blocked cases and three synthetic faults against `.agents/skills/media-to-post/SKILL.md`. No network retrieval, audio playback, visual inspection, transcription service or publication was performed. Only this report was written.

## Video findings

- PASS for the stated caption-based practice-draft scope. The saved raw VTT matches `captions-fetch.json` after newline normalization. All 10 corrected-copy cues preserve the fetched text and exact start/end timestamps (04.000–39.760). No invented timing or textual correction was found.
- PASS for the three central claims. C1 maps to V6–V7 (18.300–25.240), C2 to V8 (25.300–30.160), C3 to V9 (30.200–34.030). The drafts' 18–34 second label is rounded context, not a fabricated precise transcript range. The `t=18` URL gives a start location only; it does not enforce an end at 34 seconds. Player behavior remains untested as disclosed.
- PASS for bilingual fidelity. Both drafts retain the same three use cases, the noisy/quiet conditions, uncertainty about independent audio/visual review, the distinction between examples and measured outcomes, and the pending listening-practice delivery. Neither draft adds numbers, named speakers, direct quotations or claims of empirical effectiveness absent from its counterpart. The quiet/cannot-turn-on-sound elaboration is supported by the official page's additional-benefits text as well as V9, rather than a verbatim V9 quotation.
- PASS for evidence boundaries. The fetched official page contains an audio transcript matching the VTT words, aside from punctuation and sentence grouping; its visuals are textual descriptions only. `source.json` correctly leaves media duration and publication date unknown; the fetch response's page `publishedAt` is not repurposed as the video date. Unknown editing status and rights remain explicit. The coverage report does not infer whole-media completeness from `truncated=false`, and discloses unverified beginning/end, audio, visuals, playback and reproduction rights.
- MINOR documentation precision: “逐 cue 比對” in the coverage report should mean each VTT cue checked against corresponding official-page prose; the official page itself has no timed cue segmentation. “旁白前後無矛盾” is supportable only for the obtained textual material, not for unreviewed audio. Neither issue changes the central claims.
- LIMITATION: The topic map intentionally selects the reader question and does not enumerate V10's closing slogan. This is reasonable for a short guide, but does not validate comprehensive topic mapping of a long episode. The files are practice handoff drafts, not ready-to-publish posts: they lack article frontmatter and a dedicated references section, and this review does not constitute the article skill pipeline or `pnpm verify`.

## Podcast findings

- PASS for attribution and source fidelity. `source.raw.md` matches the supplied fetched-page content (ignoring trailing newline). P01–P13 preserve the Giles/Shawn turn order. C1/P02–P04, C2/P06, C3/P07–P08 and C4/P09–P10 correctly separate Giles’s questions from Shawn’s responses.
- PASS for the human-assessment caveat: both article languages retain that more precise software testing does not replace knowledgeable humans and that some success criteria need human assessment. Neither silently drops the negation or promotes the host’s impression of reduced ambiguity to an established guest conclusion.
- PASS for historical scope and conditional language: both drafts identify the June 2006 WCAG 2.0 draft discussion, explicitly avoid current conformance guidance, report supporting-material descriptions as historical, and preserve ongoing examination of cognitive-disability feedback rather than asserting resolution. They do not turn future plans or comment periods into current facts.
- PASS for bilingual parity: the four bounded paraphrases, speaker roles, AJAX qualification, current-document verification gap, human-assessment requirement and pending audio practice are equivalent. No publication quotations are introduced. Both have an official-source reference.
- PASS for timestamp restraint: no paragraph times are fabricated. The introduction’s 24-minute offset is correctly treated as the start within a compilation, not duration or timing of individual turns. Draft locators explicitly identify research-copy paragraph IDs, not original-page anchors.
- LIMITATIONS: This is independent text review of a supplied official snapshot. It establishes neither correspondence to actual audio nor current audio-link availability. No listening/player verification, transcription service, source-currentness or current standards validation occurred. The samples still need the post workflow/frontmatter and project gate before publication; full transcript republication and original-audio practice remain outside the delivered scope.

## Blocked-source findings

- `content-provider.json`: genuine recorded `PROVIDER_UNAVAILABLE` response. It supports failure of that request, not universal tool unavailability or lack of subtitles.
- `youtube-fetch.json`: HTTP 200 and `truncated=false`, but content is navigation/footer, not dialogue. Rejecting full-episode analysis and quotations is correct. Neither response proves the original video has no captions.
- `truncated-fetch.json`: `truncated=true` on companion-page HTML. Full retrieval/read coverage is unresolved. Correct to stop at the negative-case report rather than claim complete article or original-audio coverage. This review did not verify the initiating `maxOutputChars=85000` argument because the saved response alone does not record that request argument.

## Synthetic-fault classification

| Fixture | Classification | Required disposition |
|---|---|---|
| unresolved-pagination | Coverage failure: `truncated=true`, `paginationComplete=false` | Reject complete-source/whole-episode claims; obtain remaining pages or report the exact known coverage and unresolved continuation. |
| missing-negation | Critical semantic inversion: “does not replace humans” becomes “replaces humans” | Reject candidate; restore negation and preserve the need for human evaluation. The saved podcast transcript independently contains the corresponding non-replacement qualification, but this fixture remains synthetic. |
| speaker-swap | Critical attribution error: Shawn becomes Giles | Reject candidate attribution; trace to the original turn and preserve verified speaker. Do not infer identity from voice or chronology without evidence. |

All three faults were independently classified in this review. They were not injected into a live agent transcription/retrieval workflow, and no automated or end-to-end behavioral fault-test pass is claimed. The blocked coverage report's statement that no independent agent had executed the fixtures describes its earlier state; this report adds independent static review only.

## Verdict and limits

Caption text/timing preservation, selected claim grounding and bilingual fidelity pass within the explicitly bounded short-video draft scope. The blocked responses are correctly refused as full-media evidence, and all three synthetic faults require rejection/correction. This is evidence of artifact review, not proof of live transcription accuracy, whole-media coverage, long-episode robustness, raw-audio/visual verification, source-currentness, deployment or reader-facing player acceptance.
