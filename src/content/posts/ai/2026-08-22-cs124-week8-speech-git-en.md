---
title: "Speech and the PA7/Git Lab: How Sound Becomes Input Whisper Can Read | Stanford CS124 Week 8"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, speech-recognition, text-to-speech, nlp]
lang: en
series: { name: "Reading Stanford CS124", order: 9 }
tldr: "Week 8 continues with speech: how sound is produced, how a waveform becomes the log mel spectrum a model consumes, and how Whisper turns audio into text with an encoder-decoder and cross-attention. PA6b converts text to speech and back and analyzes what was lost. Lab 4 introduces the PA7 agent loop and teaches teams to collaborate with GitHub."
description: "A guide to Stanford CS124 Winter 2026 Week 8: basic phonetics (ARPAbet, voiced and unvoiced sounds), waveforms, spectra and spectrograms, framing and the mel scale, convolutional layers, Whisper's encoder-decoder architecture and cross-attention, its training data and limits; the five parts of PA6b; and Lab 4's PA7 overview and GitHub workflow. Based on the public slides, the PA6b repo and the labs repo."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week8-speech-git)

This is Week 8 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). [Last week](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en) covered the speech recognition task and word error rate. This week covers how it is done: sound is a continuous series of air-pressure changes, and it takes several steps before it can be handed to a Transformer.

The week has three pieces:

- **The technical content on speech**: the second half of the [slides](https://web.stanford.edu/class/cs124/lec/speech_cs124_26.pdf) from last week's live speech lecture, plus this week's assigned reading, [Chapter 14](https://web.stanford.edu/~jurafsky/slp3/old_aug25/14.pdf) (phonetics) and [Chapter 15](https://web.stanford.edu/~jurafsky/slp3/old_aug25/15.pdf) (speech recognition) of the August 2025 release of the textbook.
- **[PA6b](https://github.com/cs124/pa6b-speech)**: text to speech, speech to text, then error analysis.
- **Lab 4**: a PA7 overview and GitHub. Attendance at this lab is required and it was not recorded. The [handout](https://github.com/cs124/labs/blob/main/Lab4_Agent.md) is public.

## Where sound comes from

The slides explain why speech recognition calls for some phonetics: when a model makes an error, you need a language for describing what went wrong. An error you cannot describe cannot be measured or fixed.

### Writing sounds down

English spelling does not match pronunciation, so another set of symbols is needed, one symbol per sound. The slides use the **ARPAbet**, designed for early English speech recognition research and written with ordinary letters:

| Word | ARPAbet |
|---|---|
| bead | b iy d |
| clack | k l ae k |
| clock | k l aa k |
| super | s uw p axr |
| supper | s ah p axr |

"Super" and "supper" differ by one letter in spelling and have entirely different vowels. The ARPAbet covers only American English. Cross-language analysis uses the International Phonetic Alphabet (IPA).

### How speech is produced

1. Air comes up from the lungs.
2. It passes through the vocal cords in the larynx, which are pushed open by the airflow and snap back together, vibrating quickly. One cycle takes about a hundredth of a second.
3. The resulting sound waves pass through the mouth and are shaped into different sounds by the tongue, mouth and lips.

The vocal cords do not vibrate for every sound. They vibrate for all vowels and for **voiced** consonants such as d, b, g, z, m and n. They do not for **unvoiced** consonants such as t, p, k, s and f. The slides suggest a small experiment: hold your hand on your larynx and say sssss, then zzzzz. You can feel the vibration in the second.

A consonant is a sound made by constricting the airflow somewhere. Take p: the lips close, air pressure builds up behind them, and it bursts out on release. In a vowel the airflow is not constricted, and vowels are distinguished by how the position of the tongue changes the shape of the mouth.

## From waveform to model input

### The waveform and the spectrum

A microphone records how air pressure changes over time. Plotted, that is the **waveform**: time on the horizontal axis and air pressure on the vertical. The waveform of a vowel has regular repetition (the vibration of the vocal cords), and a consonant like b shows a stretch of silence (the closure) followed by a burst (the release).

The waveform itself is hard to work with. The key idea is that **every complex wave can be represented as a sum of sine waves of different frequencies.** Taking a short piece of sound apart and looking at how much energy each frequency has gives the **spectrum**. The shape of the mouth enhances some frequencies and dampens others, so different vowels have peaks in different places.

A spectrum describes one instant. Laying the spectra of successive short pieces side by side along time gives a **spectrogram**: time on the horizontal axis, frequency on the vertical, and energy shown by darkness.

### Framing

How long is a "short piece"? A window slides along the waveform:

- The window is **25 milliseconds** wide.
- It moves right by **10 milliseconds** each time.

The signal inside each window is a **frame**. One second of sound has 100 frames, and neighboring frames overlap.

### The mel scale

Human hearing is not equally sensitive across frequencies: it resolves low frequencies finely and high ones coarsely. For the same 100 Hz gap, 100 Hz and 200 Hz sound very different, while 7,000 Hz and 7,100 Hz sound much closer together. The **mel scale** is a frequency scale that imitates this, with the conversion:

mel(f) = 1127 × ln(1 + f ÷ 700)

Plugging in a few numbers (my own calculation):

| Frequency | Mel value |
|---|---|
| 1,000 Hz | 1,000 |
| 4,000 Hz | 2,146 |
| 8,000 Hz | 2,840 |

The range from 0 to 1,000 Hz takes up 1,000 mels. The range from 4,000 to 8,000 Hz is four times as wide and takes up only 694.

In practice a bank of filters (Whisper uses 128) is spaced evenly on the mel scale, so the low-frequency filters are dense and narrow and the high-frequency ones sparse and wide. Each filter collects the energy in its band, and finally the log is taken, because the human response to loudness is logarithmic too.

The result is that each frame becomes a 128-dimensional vector called the **log mel spectrum**. At this point sound has become a sequence of vectors, the same format as text turned into a sequence of token vectors.

### The convolutional layer

Before the Transformer there is one more step, a **convolutional layer**. It works like this: take a short vector of weights (the kernel), slide it along the input one step at a time, and at each position take its dot product with the few values there. A high dot product means the signal at that position looks like the kernel. So convolution finds particular local patterns in a signal.

Here is an example written for this post. The input is [0, 0, 5, 5, 0] and the kernel is [−1, 0, 1], of width 3, with one 0 padded on each end of the input:

| Position | The three values in the window | Dot product |
|---|---|---|
| 1 | 0, 0, 0 | 0 |
| 2 | 0, 0, 5 | 5 |
| 3 | 0, 5, 5 | 5 |
| 4 | 5, 5, 0 | −5 |
| 5 | 5, 0, 0 | −5 |

This kernel outputs a positive value where the signal rises, a negative one where it falls, and 0 where it is flat. It is a kernel that detects change. Real kernels are not designed by hand. They are learned in training.

The kernel in Whisper's convolutional layer has width 3, so it looks at 3 frames at a time. The layer also halves the sequence length, leaving one vector every 20 milliseconds.

## Whisper: an encoder-decoder

### Why an encoder-decoder

Week 6 introduced three architectures. Speech recognition uses the third, the encoder-decoder. The slides explain that this architecture suits cases where the input and output are **very different**:

- An English word in writing is 1.3 BPE tokens on average.
- The same word spoken takes about 250 milliseconds, which is 25 frames.

The sequence on the audio side is about 19 times as long as the text, and the two sides have entirely different "vocabularies": acoustic vectors on one and text tokens on the other.

### The two halves

The **encoder** handles the audio:

1. Compute a 128-dimensional log mel spectrum every 10 milliseconds.
2. Pass it through convolutional layers to extract features, downsampling to one vector every 20 milliseconds.
3. Add position embeddings.
4. Pass it through many Transformer blocks.

The output is a sequence of vectors, each standing for a small stretch of sound.

The **decoder** generates text and is almost the same as the language model from Week 7: left to right, one BPE token at a time, ending in the same unembedding and softmax.

### Cross-attention

The difference is one extra part in every decoder block: **cross-attention**. In Week 7's attention the query, key and value all come from the same sequence. Cross-attention splits the sources:

- The **query** comes from the decoder, that is, the text generated so far.
- The **key and value** come from the encoder's output, that is, the audio.

The slides put it as: attend to the speech input, informed by the text representation from my previous layer. When the decoder is about to produce the next word, it uses the words already written as a cue for finding the next stretch of the audio.

### Training

The loss is still the one from Week 6: the negative log of the probability of the correct next token. The only difference is one more condition, the whole audio input in addition to the preceding text.

The training data is **680,000 hours** of audio paired with transcripts, scraped from the web and heavily filtered, of which 118,000 hours are in 96 languages other than English. The data is broken into 30-second chunks. Training is multitask: one model learns transcription, translation and other tasks together, with special tags telling it which one to do for each example.

### What is still unsolved

The slides' conclusion is that speech recognition is good enough to be useful in many practical situations and has improved enormously over ten years, and that it is not solved.

- **Noise.** Whisper is much worse than humans on slightly noisy speech and worse still on very noisy speech. The slides show a clip of football commentary: the commentator is shouting excitedly, and Whisper's output becomes the same phrase repeated over and over.
- **Low-resource languages.** On the FLEURS dataset, languages with at least 1,000 hours of training data (English, Spanish, French, German and others) have a WER below 10%. Languages with little data (Burmese, Lao and others) have a WER above 100%.

## PA6b

**[PA6b](https://github.com/cs124/pa6b-speech)** runs a text → speech → text pipeline with an existing speech service and then analyzes the result. It needs a Cartesia account and an API key. The README says the free account has a rate limit that is more than enough to complete the assignment. The key is supplied through an environment variable and is not written into the code.

**Part 1: text to speech.** The repo ships a `sampled_sentences.json`, which you can replace with the sentences you sampled in PA6a. `python tts.py` converts them into `sampled_sentences_speech.wav`.

**Part 2: speech to text.** `python speech_to_text.py` transcribes the audio into `sampled_sentences_speech.txt`. The README also suggests recording yourself reading the sentences in a noisy environment, transcribing that, and comparing the quality.

**Part 3: error analysis.** Compare the original text with the final transcription and answer three questions:

1. Identify three distinct types of error or information loss, give a specific example of each, and explain whether the synthesis side or the recognition side more likely caused it.
2. From those errors, infer the training data and design trade-offs of the recognition model: what content it handles well and what it handles poorly.
3. Formatting in the original (capitalization, line breaks, punctuation) disappears in the transcription. Pick one element and explain why current systems cannot preserve it and what it would take to preserve it.

The third question points at something easy to miss: some information was never in the sound. A line break makes no sound, and neither does capitalization. Punctuation survives only as indirect cues such as pauses and intonation. Recognition did not get these "wrong." That stretch of the pipeline barely carries them in the first place.

**Part 4: automatic captions and accessibility.** Automatic captions make content immediately captioned, but the National Association of the Deaf in the US has successfully sued major institutions on the grounds that automated captions fail the equitable-access standard the law requires. The assignment asks: what does it mean to collapse something as multidimensional as communication into the single number of word error rate? How does meeting legal requirements differ from providing equal access? And high-quality captioning is a case of something built for disability that ends up benefiting many people, so who else relies on captions?

Last week noted that WER is not semantically aware. This question places the same limit among real consequences: WER also ignores whether a caption appears at the right time, whether the speaker is identified, and what the tone is.

**Part 5: a stress test.** Find or record a 10-to-15-second clip with a strong regional dialect, a non-native accent, or natural dysfluencies (stutters, long pauses, "um" and "uh"), give it to the same recognition system, and see where it fails.

## Lab 4: PA7 and GitHub

Attendance at this lab is required, and the agenda has three items.

**PA7 overview.** PA7 builds a movie recommendation agent with the DSPy library. The lab handout explains how the agent works: for each user request, the agent first reasons about which tool the task needs, decides what arguments to pass, and after getting the tool's result reasons about the next step. The loop is visible in the output:

```
thought_i     "User wants recommendations → call recommend_movies"
    ↓
tool_name_i   recommend_movies
tool_args_i   { user_name: "Peter", k: 3 }
    ↓
observation_i ["Back to the Future (1985)", ...]
    ↓
thought_(i+1)
```

The tools are Python functions you implement yourself. The assignment has two parts: part 1 (68 points) builds a base agent that recommends movies with collaborative filtering and helps book tickets, and part 2 (32 points) adds web search and memory. Collaborative filtering is next week's material.

The handout stresses that every run of the interactive interface uses up API credit, so you should test your own functions in isolation before running the whole agent. Enrolled students get a Together AI credit per team. Self-learners have to arrange their own.

**GitHub.** PA7 requires teams of three or four, so version control is needed. The handout walks through a complete setup: one person creates a **private** repository and invites the teammates, and everyone installs GitHub Desktop and clones the repository to their own computer, then practices changing files, syncing, and resolving the conflict when two people edit the same place.

**Group norms.** The last ten minutes are for each team to agree on how to split the work and how to communicate.

## Self-check

1. For 3 seconds of audio with a 25-millisecond window and a 10-millisecond stride, roughly how many frames are there? How many vectors remain after Whisper's convolutional layers? Answer: 100 frames per second gives about 300 for 3 seconds, and downsampling to one every 20 milliseconds leaves about 150.
2. Use the mel formula to compute the mel value of 700 Hz. Answer: 1127 × ln(1 + 1) = 1127 × 0.693 = 781.
3. Apply the kernel [1, 1, 1] to the input [0, 0, 5, 5, 0] (padded with 0 at each end). What is the output, and what is this kernel doing? Answer: [0, 5, 10, 10, 5]. It adds up three neighboring values, which smooths (blurs) the signal.
4. Where do the query, key and value in cross-attention each come from? Answer: the query comes from the decoder (the text generated so far), and the key and value come from the encoder's output (the audio).
5. "Hello, World!" is synthesized into speech and recognized back as "hello world." Which of the differences are recognition errors? Answer: strictly, none of them. Capitalization has no corresponding signal in the sound, and punctuation has only indirect cues such as pauses and intonation. If a recognition system does output punctuation, it has mostly filled it in from the conventions of the language.

## How this week connects to later ones

- Next week teaches collaborative filtering, the recommendation algorithm that part 1 of PA7 implements, and finishes the whole agent.
- The components listed on the Week 1 introduction slides include Conv Nets, which are this week's convolutional layers.

**Series navigation**: previous, [Week 7: Transformers and Speech Processing](/posts/ai/2026-08-22-cs124-week7-transformers-speech-en) | next, [Week 9: Collaborative Filtering and LLM Agents](/posts/ai/2026-08-22-cs124-week9-recommenders-agent-en)

## Update Log

- 2026-10-13: Rewritten from the public slides. Added basic phonetics, the steps from waveform to log mel spectrum, a convolution example, Whisper's architecture and cross-attention, and its training data and limits; PA6b is now described part by part; the Lab 4 link changed from a dead old filename to `Lab4_Agent.md`, and the PA7 agent loop and GitHub workflow are described from its content; added a self-check.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Speech Recognition slides](https://web.stanford.edu/class/cs124/lec/speech_cs124_26.pdf) — phonetics, acoustics, the log mel spectrum, convolution, Whisper
- [CS124 PA6b](https://github.com/cs124/pa6b-speech) — the five parts and the Cartesia account setup
- [CS124 Lab 4](https://github.com/cs124/labs/blob/main/Lab4_Agent.md) — the PA7 overview, GitHub setup, group norms
- [Speech and Language Processing, August 2025 release](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — Chapters 14 and 15
