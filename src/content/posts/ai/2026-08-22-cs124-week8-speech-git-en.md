---
title: "CS124 Week 8 Speech and the PA7/Git Lab: Auditing Information Loss in a TTS-to-STT Pipeline"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, speech-recognition, text-to-speech, nlp]
lang: en
series: { name: "Stanford CS124 導讀", order: 9 }
tldr: "Week 8 sends text through TTS and back through STT, requiring error classification, formatting-loss analysis, and accent stress tests, while Lab 4 prepares Git collaboration for the team agent project."
description: "Stanford CS124 Winter 2026 Week 8: speech readings, TTS/STT, error analysis, accessibility, dialect testing, Git, and the PA7 lab."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week8-speech-git)

Week 8 turns speech into an executable pipeline: text becomes audio through TTS, audio returns to text through STT, and the student identifies where information disappeared. Lab 4 shifts to PA7 and Git, establishing collaboration for the final team agent.

**Version:** Winter 2026. **Unit:** Week 8, February 24 and 26. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [PA6b](https://github.com/cs124/pa6b-speech), and [Lab 4 artifact](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md). **Gap:** assigned speech chapter numbers belong to the August 2025 release; the Week 7 speech lecture and in-person Lab 4 were not recorded. PA6b depends on a Cartesia account and API.

## TTS to STT makes errors observable

[PA6b](https://github.com/cs124/pa6b-speech) reads sampled sentences, creates `sampled_sentences_speech.wav`, and transcribes the audio. Original text, audio, and transcript provide artifacts at each boundary.

Differences do not share one cause. TTS may choose pronunciation, rhythm, or stress poorly. STT may substitute words, delete hesitation, or insert common terms. Capitalization, line breaks, and some punctuation may not be encoded in speech at all. The assignment therefore asks for three distinct error or information-loss types and a likely pipeline stage.

## Word error rate is not complete access

Word error rate counts substitutions, deletions, and insertions, but omits caption timing, speaker identification, tone, and meaningful non-speech sounds. Equal WER can produce unequal comprehension.

The [PA6b repository](https://github.com/cs124/pa6b-speech) asks students to distinguish legal compliance from equal access and to consider caption users beyond D/deaf and hard-of-hearing communities. The supported course claim is this multidimensional comparison; the repository does not authorize adding unexamined case-law details.

## Stress-testing dialect and dysfluency

The public [PA6b stress-test instructions](https://github.com/cs124/pa6b-speech) require students to source or record a ten-to-fifteen-second clip with regional dialect, non-native accent, or natural dysfluency and send it through the same STT pipeline. Preserve the audio and human transcript, then label error types. “It performs badly on accents” is too broad: proper names, phonology, code-switching, noise, and normalization are different hypotheses. One clip reveals a failure mode, not population-wide performance.

## APIs create reproducibility gaps

[PA6b](https://github.com/cs124/pa6b-speech) uses a Cartesia key through an environment variable. Pricing, quota, and model versions can change after the course. An independent run should save date, available model identity, and raw output. Keys must stay outside the repository.

## Lab 4 prepares the team workflow

The [schedule](https://web.stanford.edu/class/cs124/lec/) identifies Lab 4 as “PA7 and Git” and requires in-person attendance. The public [Lab 4 artifact](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md) retains older LargeLanguageModels naming, so it cannot reconstruct the 2026 exercises. The defensible preparation is operational: each team member clones, branches, commits a small change, and merges without committing secrets. [PA7](https://github.com/cs124/pa7-agent) requires three or four people; waiting until `agent.py` diverges makes version control the project.

## A concrete Week 8 finish line

The Week 8 finish line is an original-text/audio/transcript bundle with an error table, one clearly bounded dialect or dysfluency probe, and one branch-review-merge rehearsal that contains no credential.

## Separating reproducible stages

Run `tts.py` and `speech_to_text.py` separately. Fix input sentences and voice, save audio, then repeatedly test STT against the same file. Otherwise variation can come from both services. Record time, input hash, model or voice identity, parameters, raw response, sample rate, channels, encoding, and duration.

## Alignment and WER by hand

Use minimum-edit alignment to count substitutions, deletions, and insertions. WER is `(S+D+I)/N`. The same score can hide different semantic harm, so add span type and severity. Fix normalization for casing, punctuation, contractions, and digit/word forms before comparing systems.

## Separating TTS and STT errors

Send a human reading of the same sentence through STT, or ask a human to transcribe TTS audio. Human-audio success with TTS-audio failure supports a TTS hypothesis; intelligible TTS with machine failure supports an STT hypothesis. Controls remain imperfect, so PA6b correctly asks for likely causes.

Label lexical substitutions, deletions, insertions, names, punctuation, capitalization, segmentation, and dysfluency normalization with audio timestamps.

## Formatting is not always acoustic

Paragraph breaks, quotation marks, emoji, and capitalization may have no unique acoustic signal. Restored punctuation is often inferred. Preserving format may require markup at TTS time or timestamps, speakers, confidence, and post-processing at ASR time, changing the evaluation target beyond plain WER.

## Accessibility beyond one average

Audit timing, speaker labels, non-speech information, names, and technical terms separately. Connect each caption error to a concrete task for D/deaf, hard-of-hearing, second-language, silent-viewing, search, or processing-needs users. The repository prompts support this output audit, not unexamined legal conclusions.

## A bounded dialect/dysfluency probe

Create a verbatim human transcript retaining fillers, restarts, and pauses, plus a normalized copy for WER. Record source, consent, and conditions, and avoid uploading sensitive identifiable speech without consideration. One clip forms a hypothesis; later fix content across speakers or noise conditions to separate variables.

## The Git collaboration contract

Agree on protected main, feature branches, short commits, review, and conflict ownership. Separate tools, data, orchestration, and tests behind interfaces. Ignore credentials and large local artifacts while versioning small reproducibility fixtures.

Practice one real merge conflict, resolve it together, run tests, and review the diff before PA7's deadline. This proves collaboration rather than only documenting commands.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [CS124 PA6b Speech](https://github.com/cs124/pa6b-speech)
- [CS124 Lab 4 public artifact](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md)
- [CS124 PA6a Transformers](https://github.com/cs124/pa6a-transformers)
- [Complete Stanford CS124 course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)
