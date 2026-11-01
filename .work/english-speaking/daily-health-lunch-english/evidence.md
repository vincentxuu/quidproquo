# Daily health/lunch English evidence

- Checked: 2026-10-25 (Asia/Taipei).
- Tool path: the parent checked the full callable inventory; Groundlane is not mounted. Used Exa `web_fetch_exa` for publicly accessible pages. This is Exa evidence, not Groundlane verification. No retired fetch tools, browser scraping, private content or credentials were used.
- Scope: read the extracted substantive entry/lesson bodies, not merely search snippets. `source-readback.md` retains the returned text. Did not listen to audio or independently observe workplace use.
- Article: `learning/2026-10-25-daily-health-lunch-english` and English counterpart. Same English Speaking Practice series, order 15.
- Existing integration: reused the existing daily cards and examples in `src/lib/english-speaking.ts`. No card, dialogue, familiarity ID, spoken-text or audio-manifest mutation. Article examples are teaching text; no new practice-tool dialogue was added.

## Sources read and their limits

| Source | Read scope | Supports | Does not establish |
|---|---|---|---|
| [Cambridge cold](https://dictionary.cambridge.org/dictionary/english/cold) | Extracted entry body: adjective low temperature + noun illness, examples and other senses | `I have a cold.`; distinction between illness and feeling cold | Diagnosis, treatment, workplace frequency |
| [Cambridge throat](https://dictionary.cambridge.org/dictionary/english/throat) | Extracted entry body, Advanced and Academic Content senses/examples | `I have a sore throat.` appears in Academic Content body | A particular colleague exchange or severity diagnosis |
| [Cambridge hurt](https://dictionary.cambridge.org/dictionary/english/hurt) | Extracted entry body: physical pain sense and examples, other senses | `My head hurts.` is the same skeleton as `My throat hurts.` | Treating body-part substitutions as source quotations |
| [Cambridge voice](https://dictionary.cambridge.org/dictionary/english/voice) | Extracted entry body: SOUNDS sense, `lose your voice` example; other senses also returned | `I have a cold and I think I'm losing my voice.`; definition becoming unable to speak | Medical cause or advice for an individual |
| [BBC Talking about lunch](https://www.bbc.co.uk/learningenglish/features/real-easy-english/250801) | Whole extracted lesson body: introduction, grammar, vocabulary and full Beth/Neil transcript through closing | Today's meal, usual lunch habits, leftovers; actual conversational sequencing | Population frequency or a universal lunch script; no audio assessment |
| [ELLLO #625 What's for Lunch?](https://www.elllo.org/english/0601/T625-Tom-Lunch.htm) | Whole extracted Tom/Martin transcript plus vocabulary/quiz | `You brought it from home?` follows mention of chicken bento; source answer is no (campus purchase) | Source dialogue being a colleague exchange; the source does not say a home-brought meal was self-cooked |
| [b-cafe sore-throat/voice lesson](https://www.b-cafe.net/newsletter/2026/08/sore-throat-english.php) | Extracted article body from introduction through all expression sections, summary and author bio | `I've lost my voice.`, `I can barely speak.`, `My throat really hurts.` | Independent frequency evidence or clinical guidance. Commercial language-school source; do not import its medical advice into the article |

## Core sentence-to-card mapping

All article coworker situations are **contextEvidenceType=adapted**: they are original teaching situations, not transcripts of a real exchange involving the user.

| Existing card ID | Article answer | expression evidenceType | Support sentence / section | Limits |
|---|---|---|---|---|
| daily-health-cold | I have a cold. | direct | Cambridge cold, noun ILLNESS: `I have a cold.` | Illness meaning, no diagnosis |
| daily-health-throat | I have a sore throat. | direct | Cambridge throat, Academic Content example | Pain symptom, does not say voice lost |
| daily-health-hurts | My throat hurts. | adapted | Cambridge hurt physical-pain sense: `My head hurts.`; head → throat | Not represented as Cambridge's exact sentence |
| daily-health-losing-voice | I have a cold and I think I’m losing my voice. | direct | Cambridge voice SOUNDS: `I have a cold and I think I'm losing my voice (= becoming unable to speak).` | Curly apostrophe is typographic; progressive describes ongoing loss |
| daily-health-lost-voice | I’ve lost my voice. | direct | b-cafe section 声が出ない | Existing loss of voice, not merely throat pain |
| daily-health-barely-speak | I can barely speak. | direct | b-cafe section 声が出ない, example beneath lost voice | Great difficulty speaking, does not require absolute inability |
| daily-lunch-today | What have you got for lunch today? | direct | BBC transcript, Beth's opening meal question | Today's meal, not usual habits |
| daily-lunch-home | You brought it from home? | direct | ELLLO Tom, after Martin describes chicken bento | `it` needs a previously identified meal; source does not identify cook |
| daily-lunch-usually | What do you usually have for lunch? | direct | BBC transcript, Neil's full question and Beth's turn-final repeated question | Habit, not today's meal |
| daily-lunch-leftovers | Sometimes I have leftovers that I bring in. | direct | BBC transcript, Neil after Beth discusses usual lunches | Earlier unfinished food; does not assert self-cooked or necessarily yesterday |

## Meaning contrasts and exercises

- Cold: Cambridge explicitly separates adjective temperature from noun illness. `I'm cold` is a basic subject/be/adjective adaptation of the entry's `Your hands are cold!` / `My feet are so cold.`; it is not labelled an exact source sentence. The article does not claim one form is more frequent.
- Throat pain vs voice loss: Cambridge throat/hurt confirm pain expressions; voice and b-cafe confirm losing/lost voice meanings. These are semantic distinctions, not a medical assessment.
- From home vs who cooked: `from home` answers origin/location; ELLLO's actual follow-up can be answered no, and the scene never establishes who prepared the food. Family-prepared/bought-food examples in the article are original illustrations of the distinction, not quotations.
- Today vs usually: source BBC explicitly moves between today's lunch and regular choices.
- `My head hurts.` substitution answer is direct Cambridge. `Do you have a sore throat?` is an original question transformation of the sourced statement. `What have you got for breakfast today?` is adapted from the BBC lunch question by replacing lunch with breakfast.
- `My throat really hurts.` is directly present in b-cafe. Article explains added emphasis without claiming comparative frequency or a new medical meaning.

## Dialogues and review

- Health dialogue: follows the already existing `daily-colleague-health` practice script. Common expressions are reused, but the workplace exchange is an original practice example. All questions are answered in sequence.
- Lunch dialogue: original practice script. Uses core source-backed questions and fictional `Rice and vegetables / Yes / Usually rice or noodles` answers. Yes answers origin only; the prose explicitly avoids assuming self-cooking.
- The website's existing `daily-colleague-lunch` dialogue remains unchanged (it uses the cooking question and different answers). The article says to choose a role-play, without claiming its new illustrative lunch exchange was installed in the tool.
- Chinese/English heading structure, core tables, three substitution tasks, two dialogue sequences and four recall questions match.
- No new facts about illness care, no medication/disease claims, no regional-superiority or native-speaker-frequency claims.
- No pending unsupported core sentence. No new external sources were added to skill files because this delegated task only owns two content files and task evidence.
