# Climbing gym beta English — bilingual review

Reviewed 2026-10-25. Files: `src/content/posts/learning/2026-10-25-climbing-gym-beta-english{,-en}.md`.
This is an independent read of the draft and the current task's saved Exa extraction bodies, not independent collection from different sources. No product file was modified by this review.

## post-verify

Scope: nine declarations checked: five core expressions, beta meaning, hold context, did + base-form put, and the direction of offering versus requesting advice.

| Claim | Evidence actually read | Verdict and limits |
|---|---|---|
| How did you do this move? adapts How did you do it? | Collins English-Chinese how full body in `climbing-gym-beta-english/raw/collins-how.json`: `how did you do it?` | Confirmed adapted, replacing object it → this move. Capitalisation is typographic. Does not claim recorded climbing speech |
| Can you show me how to do it? | Cambridge English-French how full body in `final-fetch.json` | Confirmed direct full sentence; climbing conversation context is authored |
| Where did you put your left foot? | Geniebook grammar full body, WHERE examples in `footwork-fetch.json`: `Where did you put it?` | Confirmed adapted, replacing object it → your left foot. Explicitly labelled a children's language lesson, not climbing dialogue |
| I can’t reach that hold. | Cambridge reach physical-reach body in `surf-conditions-entry-english/raw/second-full-fetch.json`: `I can't reach my zip - could you unfasten it, please?`; REI climbing-techniques body | Confirmed adapted, retaining I can't reach + object. REI supports climbing terminology only, not the entire sentence's frequency |
| Do you want beta? | Climb On Equipment full article, ask-before-offering paragraph in `surf-conditions-entry-english/raw/second-full-fetch.json` | Confirmed direct; source specifically says to ask and only help after yes |
| Beta is information about a climb | REI glossary body in `footwork-fetch.json`, Beta entry | Confirmed single-source; article narrows to moves/sequences without claiming this exhausts beta |
| Hold/foothold/foot placement are climbing context | REI techniques full body in `surf-conditions-entry-english/raw/initial-full-fetch.json`, feet/edging and handhold sections | Confirmed single-source terminology/context; no claim that this is a full-sentence conversational source |
| did is followed by base-form put | Geniebook where example and saved Cambridge wh-question grammar body | Confirmed elementary grammar; put's identical forms do not create a new irregular form in the example |
| Do you want beta offers advice rather than asks to receive it | Climb On Equipment paragraph and question direction | Confirmed. Draft explicitly explains the speaker-role difference |

Tool provenance: Groundlane was absent from the callable inventory in this task. The writing agent fetched public bodies through Exa fallback; reviewer read the substantive relevant sections from those current-task artifacts rather than search snippets. No fresh independent live fetch, native-speaker trial or audio listening by this reviewer. No retired fetch tools or browser research scraping.

The three adapted questions have identifiable same-skeleton examples. The article does not assemble unrelated word definitions and label them source quotations. It explicitly distinguishes grammar/word evidence from the invented climbing situation. The known old `climb-beta` expression was not changed based on reviewer intuition. Direct/adapted labels agree in both languages.

The original dialogue takes place on the ground, asks for permission before beta is supplied, and is explicitly not a set of climbing calls or movement instructions. No empirical training, safety or proficiency outcome is asserted.

本次只檢查了文中已提出的9條宣告，未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。

## post-review

- **Metadata:** learning / guide, date 2026-10-25, order 18, `draft:false`, four established lowercase tags and matching zh/en series names. Title, description and TLDR match the body without exaggerated performance claims.
- **Teaching structure:** concrete ground-level scene; asking about a completed move, requesting a demonstration and offering advice are separated. Five core expressions, two substitutions, six-turn original dialogue, five recall prompts and five answers are present. This is a focused language lesson, not a technique guide or an incomplete equipment survey.
- **Bilingual read:** both full drafts read. Same source labels, request/offer direction, left/right and this/that exercises, dialogue sequence and answers. Mechanical cross-check: 7 H2s each, 7 table lines each, 6 dialogue turns each.
- **Consent/spoilers:** the article correctly makes the potential advice-giver ask `Do you want beta?`; it does not teach that question as a way to request advice. In the fictional exchange the learner has already asked how, then explicitly accepts beta before a specific foot placement is supplied. This redundant consent question is acceptable teaching, not unsolicited beta.
- **Dialogue coherence:** “that small hold” is introduced before “that hold”; no unexplained object appears. The learner can ask about foot placement and say a hold is out of reach without the story diagnosing limb length or strength. The demonstration request follows the verbal explanation.
- **Minor attribution suggestion:** the first reference annotation mentions both beta and hold, but the saved REI glossary body explicitly defines beta while the clear hold/foot-placement use is in the second REI techniques page. For precise attribution, annotate glossary as beta and techniques as hold/foot placement. This is a reference-description refinement; the article's collective REI support exists and the adapted sentence is not invalid.
- **Article/practice integration:** pending main-thread final readback. At review time the app had the existing main beta card and its foot-placement swap, not all five main article expressions. Parent confirmed adding the remaining four exact phrases and mapping the article in this task. Verify final app behavior separately.
- **Automated:** targeted reference validation of all four surf/climb files passed, no reference issues. Metadata/heading/table/turn parity passed. Full verify, Astro check, external-link network sweep and browser run were not performed by this reviewer; final checks belong to main thread.
- **Outcome:** no blocking language/content defect found within bounded evidence. Minor attribution suggestion above. Final tool integration, source/build gates, interaction and release remain separately pending; no deployment or UI-acceptance claim.

## post-polish

Read the Chinese draft from opening to close and the complete English counterpart. The scene of pointing at a move and being unable to ask is concrete and useful to Chinese-speaking climbers. It does not invent first-person author experience or insert source-acquisition logs. English phrases, hold/beta terminology, quoted examples and URLs were protected; no product text was changed.

Executed register-scan and phrase-ledger scan: 0 long sentences, 1/28 caveat paragraphs (3%), 0 template-transition findings, 0 general-English-term density findings, no ledger matches. Six quote markers are six turns of one original dialogue, not six separate source quotation blocks. The literal action-keyword scanner reported zero, but the exercise explicitly asks readers to change left to right, that to this and link three conversational actions before checking recall answers.

Source labels are repeated in the table and the paragraph after it, but this directly explains the lesson's adapted examples and does not dominate the article. It could be shortened later if the lesson expands; no mandatory prose fix identified. The source-backed old main question is not changed on stylistic grounds. No native-speaker frequency, pronunciation or listening review was performed.
