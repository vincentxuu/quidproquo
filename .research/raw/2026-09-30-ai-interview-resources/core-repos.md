# Agent A notes — 3 AI Engineer interview-prep repos (read 2026-09-30)

Clones (full history, not shallow):
- aeg = `scratchpad/agentA/aeg` (alexeygrigorev/ai-engineering-field-guide)
- om = `scratchpad/om` (ombharatiya/AI-Engineer-Interview-Questions; fetched, up to date with origin/main)
- amit = `scratchpad/agentA/amit` (amitshekhariitbhu/ai-engineering-interview-questions)
- pallavi = `scratchpad/repo` (pallavi-shekhar/ai-engineering-interview-questions-company-wise; pulled to latest)

Star counts are from the caller's brief; NOT re-verified here (GitHub API unavailable).

---

## 1. alexeygrigorev/ai-engineering-field-guide

### Freshness / contributors
- First commit 2026-02-04 "Initial commit: AI Engineering Interview Research"; last 2026-09-23 "Ignore work in progress files".
- 122 commits. `git shortlog -sn`: Alexey Grigorev 121, "yingbin同学" 1 → effectively single-author.
- BUT the interview section is mostly stale relative to the repo: `interview/01-interview-process.md` 2026-02-27..02-28 (11 commits); `interview/05-trends.md` last touched 2026-03-14; `interview/questions/questions.md` last 2026-03-09; `06-home-assignments.md` last 2026-06-25 ("June 2026 Additions"). Recent activity is job-market scrapes (monthly to 2026-09-23), `role/06-fde.md` (Jul–Aug), and an LLM-maintained `wiki/` (Sep).

### Structure & size
- ~23,874 files total, of which job-market = 23,699 (YAML scrape data). Authored markdown is small: `interview/` 82 files, `role/` 9, `wiki/` 23, plus learning-paths/, portfolio/, webinars/.
- Job-market: `job-market/README.md` — "6,964 AI Engineer job descriptions from builtin.com (February - August 2026, 8 monthly scrapes)" covering LA, NY, London, Amsterdam, Berlin, India. Actually 9 scrape folders exist in `job-market/data_structured/` (2026-02-04 … 2026-09-23; 645–1,222 files each) — README says 8 (latest Sep scrape not yet reflected).
- Interview question bank `interview/questions/questions.md` (782 lines): I counted 425 bullet items in technical/system-design/coding/behavioral/deep-dive sections (lines 5–534) + 49 take-home bullets (535–622); 249 lines end with "?" (method: grep of `^- ` bullets; some bullets are imperative "Design X" so "?" undercounts). 158 footnote definitions in that file.
- Topic pages `interview/questions/01-theory.md`…`06-home-assignments.md` are curated subsets (theory 71 bullets / 56 footnotes; system design 78 bullets / 27 footnotes; home assignments 109 bullets / 93 footnotes).
- Company data: `interview/data/job-descriptions/` = 51 YAML files (one per company, `process_summary` field + links to source JD YAMLs). E.g. `1393425.yaml` Speechify: "Several technical interviews, aim to complete within 1 week".
- No LICENSE file in repo; grep for "license" in authored md found nothing → **no license declared** (default all-rights-reserved) [note: verify on GitHub UI].

### Sourcing
- Per-question footnotes `[^id]` pointing to Reddit, HN, Medium, Glassdoor, X, company pages (e.g. `interview/01-interview-process.md` footnotes; `05-trends.md` "## Sources").
- Source inventory: `interview/data/sources/` (all-links.md 328 lines; discussion-threads.md 285 numbered threads; github-repos.md; github-search-methodology.md; verification-methodology.md). Reddit fetched via Arctic-Shift API script `interview/_internal/fetch_reddit.py`; Grok (x.ai) search via `xai_search.py`; `interview/data/research-exports/` = "Raw AI research session exports (ChatGPT, Gemini, Grok)" per `interview/data/README.md`.
- `interview/data/README.md` describes `fetched/` and `link-summaries/` dirs (e.g. "techeon-corroboration-map.md … 20 corroborated") that are NOT present in the repo (only job-descriptions/, research-exports/, sources/) → doc drift; those artifacts unverifiable.
- `verification-methodology.md` explicitly warns: "Many 'interview question' articles (especially on Medium) may be AI-generated or speculative."
- README claim: "every insight comes from analyzing actual data … not AI-generated filler" — yet the pipeline uses LLM extraction (job-market "LLM-enriched YAML") and AI research exports; wiki/ is "LLM-maintained". Not contradictory per se, but worth noting.

Spot-check of cited sources:
1. `https://www.yuan-meng.com/posts/mle_interviews_2.0/` (cited in 01-interview-process & 05-trends for "ML infra design, multi-level OOP, LLM coding, research presentations, references") — REAL, published 2026-02-01, title "MLE Interview 2.0: Research Engineering and Scary Rounds"; firecrawl confirms it lists those round types and that frontier labs ask for references. ✅ relevant.
2. `https://news.ycombinator.com/item?id=46865130` (cited for "'AI delta' assessment: Candidates tackle real GitHub issues in 2-4 hours…" under "Emerging Interview Formats … gaining traction") — REAL, but it's "Ask HN: A proposal for interviewing 'AI-Augmented' Engineers" — a *proposal* by one user, not an observed company practice. ⚠️ Guide overstates it as a trend.
3. GitHub official challenge repos listed in `06-home-assignments.md` "Official Company Challenges": `go-fig-ai/take-home-inbox-triage`, `jaseci-labs/take-home-ai-engineer`, `danielkim-cerebras/ai-model-quality-challenge` resolve via `git ls-remote` ✅; `ml6team/laine-engineer-coding-challenge` does NOT resolve (asks for credentials → private/deleted) ❌. Go Fig README confirmed: "Time cap: 2 hours" and "Use AI heavily. This is the job."
4. Reddit thread for Microsoft AI-assisted round (r/csMajors 1nqfzhq) — could not fetch (proxy 403 / firecrawl doesn't support reddit). UNVERIFIED.
- Internal inconsistency: `06-home-assignments.md` says "Only 1 company explicitly allows AI tools in take-homes" (from the Feb JD analysis) while its own June additions list Go Fig, whose repo mandates heavy AI use — stat not updated.

### Interview-process findings (`interview/01-interview-process.md`, `05-trends.md`)
Methodology: "Out of 1,765 job descriptions analyzed, only ~80 (~4.5%) include a structured interview process across 51 unique companies." (Note: 1,765 = Feb-era dataset, not the current 6,964.) Plus candidate reports from Reddit/X/blogs; "Consolidated from 100+ sources" (`interview/02-questions.md`).
- Step counts: median 4 steps, most 3–5; shortest 2 (Lorikeet, Infinity Constellation, Watershed); longest 7 (FlowFuse, Roboflow, The College Board).
- Common steps: recruiter screen 15–30 min → technical (live coding / system design / code review) → HM 45–60 min → behavioral → take-home (typically 2–3 h) → panel → CEO/founder 15–30 min.
- Candidate-report table: total 3–6 rounds, 2–6 weeks; take-home 1–7 days.
- Company examples with footnotes: Doctolib (feature-building interview + AI system design), PostHog (paid SuperDay), FlowFuse (take-home "AI tools encouraged"), Microsoft Applied AI/ML intern (R1 AI-assisted with ChatGPT, R2 no AI), Amazon GenAI IC L6, Eightfold.ai (AI-agent-conducted coding round + 3-day agent take-home), LangChain, IBM, Mistral (7 steps, Glassdoor), Databricks, Goldman Sachs.
- Trends (`05-trends.md`): from Janvi Kalra (46 companies), Deepthi Sudharsan (50+ rounds), a Reddit principal engineer (~40 interviews) = "130+ interview rounds": "~70% of senior interviews had none [LeetCode] at all"; system design shifted to LLM integration; project presentations; code reading/debugging rising; in-person finals returning (InterviewQuery: in-person 24% 2022 → 38% 2025).
- AI in hiring: explicit bans (Marvell, HRT, Wolters Kluwer, Wells Fargo); AI-proctored early rounds (Eightfold, Coinbase); employers using AI in recruiting (Coinbase, Foxelli/Ribbon AI, Block/TIDAL), "Only 1 company (Viral Nation) explicitly states they do NOT use AI"; AI-fluency expected (Miro "AI-First Proficiency" expects Claude Code/Cursor, TRM Labs, Toku, BetterUp); published candidate-AI guidelines (Datadog, Invisible, Anthropic, Zapier, AssemblyAI, SandboxAQ, CDW, Oscar); AI allowed in live coding (OpenAI per Exponent, PromptLayer, Microsoft, Exponent mock with Claude Code).
- Market stats quoted second-hand from InterviewQuery 2025 (e.g. "AI and LLM-related interview questions tripled since 2023").
- Also: "Exploitative take-homes at AI startups" (French r/developpeurs case est. 6,000–10,000 EUR of work).
- "Paid work trials": 5 companies per `06-home-assignments.md` line 5, but the 5 are not enumerated anywhere I could find (only PostHog SuperDay named in 01).

### Home-assignment collection (`interview/questions/06-home-assignments.md`, 300 lines)
- "17 (33%)" of 51 companies include take-home; "An additional 5 companies use paid work trials". "Analysis of 100+ GitHub repos (Q4 2025 / Q1 2026)": RAG 40%+, agentic 30%+, conversational 20%+, document processing 15%, LLM-as-judge 10%+.
- Categories with concrete briefs + footnoted GitHub submissions: RAG/doc Q&A (e.g. BitHealth refactor-a-messy-RAG with 5 submissions; GovGPT RAGAS-evaluated), agents/tool-calling (Cohere sales-insights agent with PII refusal), multi-agent (Tredence workflow engine, 6 submissions; Hippocratic bedtime-story LLM-judge pipeline, 4), document extraction, full-stack (Zuneko LLM gateway: 100+ req/s, p95 <2s, >40% cache hit).
- "Evaluation Criteria Found in Assignments" (rubric patterns incl. weighted rubric 30/30/25/15) and "How to Prepare" ("Red flag if candidate doesn't start with evals" from YC thread).
- "June 2026 Additions": legal document AI, new RAG companies (Quorium, NTT DATA, GoTyme…), agents (Go Fig, RefundPilot prompt-injection), Cerebras challenge, Adobe FDE pipeline; "Official Company Challenges" = 10 repo links. I counted 83 unique github.com/owner/repo links in the file.

### 2026-era coverage (aeg)
| Type | Y/N | Evidence |
|---|---|---|
| AI-allowed / AI-collab coding rounds | Yes (reporting, not practice Qs) | `interview/05-trends.md` "AI Tools Allowed During Live Coding"; `interview/questions/02-coding.md` Microsoft AI-assisted round |
| Work trials on real codebases | Partial | PostHog paid SuperDay (`01-interview-process.md`); "AI delta" real GitHub issues (`05-trends.md`, source is an HN proposal); "5 paid work trials" not enumerated |
| FDE scenario questions | No (market data only) | `role/06-fde.md` = job-posting analysis (28→118 listings Feb→Jul 2026, 146 unique roles, 94 companies); no FDE interview Qs; 2 Blind threads in `data/sources/discussion-threads.md` |
| Agent/harness design | Yes (agents; not "harness" by name) | `01-theory.md` Agents & Tool Use (loops, sandboxing, termination); `04-ai-system-design.md` agentic workflow |
| Eval design | Yes | `01-theory.md` Testing & Evaluation; `06-home-assignments.md` eval criteria; `wiki/concepts/evaluation-differentiator.md` |
| LLM inference/serving | Light | `questions.md` Cost & Latency (PagedAttention, quantization); `04-ai-system-design.md` "Near-AI / AI Serving Systems" (5 bullets) |
| Take-home | Yes, strongest | `06-home-assignments.md` |

### Answers
- NO per-question answers. Questions are listed with source footnotes only. "How to Prepare"/"Common mistakes" sections give generic guidance (e.g. `02-coding.md`: "Solve 75+ easy/medium problems").
- Sample 1 (`02-coding.md` How to Prepare): sensible but generic (LeetCode 75+, build incremental projects, narrate AI use). Shallow as "answers" — it's prep advice.
- Sample 2 (`04-ai-system-design.md` "AI System Design vs System Design" comparison: evaluation "precision/recall/F1/AUC … vs LLM-as-judge", cost model "per-token inference cost (continuous)") — correct, framework-level, no worked design.

### Commercial funnel
- README top: newsletter "AI Shipping Blog"; bottom "Learn AI Engineering": Maven course "AI Engineering Buildcamp: From RAG to Agents" (9-week) + AI Shipping Labs community. Webinars (Maven / AI Shipping Labs).
- Link counts across md: maven.com/alexey-grigorev/from-rag-to-agents ×7, aishippinglabs.com ×6 (+3 blog, +1 workshop), aishippingblog.com ×2(+1). Appears in 17 md files incl. `interview/03-get-hired.md`, `01-theory.md`, `04-ai-system-design.md`, `role/06-fde.md` ("Subscribe on Substack"). Moderate: present in content pages, not overwhelming.

---

## 2. ombharatiya/AI-Engineer-Interview-Questions

### Freshness
- First commit 2026-07-12 "chore: initialize repository"; last 2026-08-25 "Merge pull request #7 … deep-gap-fill". 36 commits; shortlog "Om" 29 + "OM" 7 = same person → 1 contributor. Built in ~6 weeks via large batch PRs ("expand every topic bank with 187 researched questions", "add 261 explanatory diagrams", "add 8 companies"). [推論] likely heavily AI-assisted authoring given volume/speed; not stated in repo.
- No commits since 2026-08-25 (~5 weeks before today).

### Structure & size (108 files, 31,442 md lines)
- README claim: "1,067 questions with worked answers, 10 system design case studies, 19 runnable coding challenges, company interview questions for 33 companies, and guides for 10 engineering roles."
- My count: topic banks `0X-*/questions.md` numbered `### N.` = 541 (01:50, 02:60, 03:45, 04:55, 05:51, 06:60, 07:50, 08:51, 09:47, 10:35, 13:37); `<details>` answer blocks in company pages 397 + role guides 129 → 541+397+129 = **1,067 ✓** matches.
- `14-company-interview-questions/` 34 files = 33 companies + README. `11-ai-system-design/case-studies` 10. `12-coding-challenges/` 19 .py (numpy/stdlib, reference solution + tests). `15-role-guides/` 10 guides + README.
- License: MIT (`LICENSE`, "Copyright (c) 2026 Om").

### AI Engineer 75 (`AI-ENGINEER-75.md`)
- "A Blind-75-style checklist … the 75 highest-signal items pulled from across the whole repo". 75 `- [ ]` checkboxes: 64 must-know questions + 4 system-design mocks + 7 from-scratch coding challenges, tagged 🟢 Foundational / 🟡 Core / 🔴 Advanced, each linking to the answer anchor.
### Study plans (`STUDY_PLAN.md`)
- 1-week cram, 4-week standard (Week1 foundations; W2 prompting/RAG/fine-tuning; W3 agents/evals/production; W4 design/safety/polish), 8-week deep plan (career transition), retention tips. README maps runway → plan (days: AI-75 + CHEATSHEET).
### Role guides (`15-role-guides/`)
- Backend, Frontend, Product/Full-stack, FDE, Data, DevOps/Platform/MLOps, QA/SDET, Mobile, Security, "ML Engineer vs AI Engineer". Each: "how this role's interviews changed (2024→2026)", what you're expected to know, 12–14 role-specific Qs with answers.
- FDE guide has 13 scenario Qs, e.g. "#3 Interviewer plays a hospital COO … Decompose the problem", "#5 The customer's CISO says no data can leave their network", "#13 Live exercise: … In 60 minutes, build something". 
- Role guides cite NO sources (0 `## Sources`, only 1 http link across all 11 files).

### Sourcing
- Topic question banks: 0 links in 10 of 11 banks (09-safety has 2). No per-question provenance — questions are authored, not "reported".
- Company pages: 33/34 files have `## Sources`; header "Last reviewed: July 2026" (25) / "August 2026" (8); inline "(reported, varies)" hedges; sources labelled "(official)", "(surfaced via search)", Blind thread flagged "single unverified candidate account" (`cursor-anysphere.md` L353).
- Spot-check (`14-company-interview-questions/anthropic.md` sources):
  1. TechCrunch 2026-01-22 "Anthropic has to keep revising its technical interview test" — REAL, supports take-home allowing AI ✅.
  2. Exponent "Anthropic Machine Learning Engineer Interview Guide" — REAL; contains "Interviewers hand you access, then assess how you actually work with the models" ✅ supports the AI-collaboration-round claim.
  3. anthropic.com/candidate-ai-guidance — HTTP 200 ✅ (content not re-read).
- Cursor work-trial claim sourced to Lenny's Podcast / BI-AOL / Blind (not fetched).

### 2026-era coverage (om)
| Type | Y/N | Evidence |
|---|---|---|
| AI-collab / AI-allowed coding | Yes | `13-interview-process-and-behavioral/README.md` L14 "AI-assisted coding rounds"; `questions.md` L502 (Meta AI-enabled round, OpenAI agentic-coding pilot); `anthropic.md` loop table |
| Work trial on real codebase | Yes | `14-company-interview-questions/cursor-anysphere.md` (up to 2-day on-site, "frozen snapshot of the real codebase"; paid status disputed) ; `13-…/README.md` L22 |
| FDE scenarios | Yes, strongest of the 3 | `15-role-guides/forward-deployed-engineer.md` (13 Qs); Palantir/Sierra pages |
| Agent/harness design | Yes | `06-agents-and-tool-use/questions.md` (60 Qs, harness loop-control, compaction, MCP security); `12-coding-challenges/10_agent_loop.py` |
| Eval design | Yes | `07-evaluation-and-observability/questions.md` (50); `12_eval_metrics.py` |
| Inference/serving | Yes | `08-inference-and-production/questions.md` (51: prefill/decode, KV cache, batching, quantization); case study 10 LLM gateway; `19_speculative_decoding.py` |
| Take-home | Yes | `13-…/README.md` "take-home or paid work trial"; mentioned in 25 files |

### Answers
- Every question has a collapsible `<details>` worked answer + "Follow-ups"; many with mermaid diagrams.
- Sample 1 `07-…/questions.md` Q1 "evals are the moat": correct, senior-level, covers eval-driven dev loop and limits (overfitting, staleness). Good depth.
- Sample 2 `08-…/questions.md` Q2 KV cache: formula `2 × n_layers × n_kv_heads × head_dim × bytes`; Llama-3-70B 80×8×128×FP16 ≈ 320 KB/token, 128K ≈ 41 GB — I recomputed: 327,680 B/token; ×131,072 ≈ 40 GiB ✓ correct. Notes GQA 8× saving, PagedAttention, FP8 KV.
- Risk: `06-agents-and-tool-use/questions.md` L257 asserts MCP "2026-07-28 revision" per-request version negotiation, `server/discover` RPC — UNVERIFIED by me; fast-moving spec details could be wrong/speculative.

### Commercial funnel
- Light: companion site aidaddy.tech (2 mentions: README "Essential shortcuts" and footer), GitHub/Twitter/LinkedIn follow badges, "Star/Watch" badges. No paid course links found. [aidaddy.tech monetization not checked.]

---

## 3. amitshekhariitbhu/ai-engineering-interview-questions (Outcome School)

### Freshness
- First commit 2026-03-21, last 2026-09-29 "Update README.md". 148 commits (AMIT SHEKHAR 147 + amitshekhariitbhu 1 = same person). Steady monthly: Mar 36, Apr 20, May 32, Jun 21, Jul 16, Aug 14, Sep 9. Commits are mostly "Update README.md" (single-file repo).

### Structure & size
- Only 4 files: README.md (978 lines), LICENSE, .gitattributes, assets/banner.png. Everything is one README list.
- 14 sections (LLM Fundamentals … Behavioral). Counting `^- ` bullets between "### LLM Fundamentals" and "### License": **561 items**; ~282 "  - Answer:" lines. Per section (Q/answer lines): LLM Fundamentals 78/61, Prompt Eng 30/8, RAG 41/26, Agents 53/38, Fine-tuning 32/22, Vector DB 26/14, AI System Design 49/11, LLMOps 52/29, Evaluation 36/15, Safety 45/6, Multimodal 30/11, Infra 35/20, Coding 32/21, Behavioral 22/0. → roughly half the questions have an answer link. Some bullets are topic titles not questions ("KV Cache Compression", "Harness Engineering in AI").
- License: Apache-2.0.

### Sourcing
- Cites NO sources for questions: no Reddit/Glassdoor/company attribution; grep for source/reddit/glassdoor/"asked at" only hits question text. Questions are generic/authored.

### Answers
- All answers are external links, never inline. 138 unique answer URLs; link domain counts in README: outcomeschool.com 278, youtube.com 25 (Outcome School/Amit videos), linkedin.com 9 (Amit's posts), x.com 2, outcomeschool.substack.com 2. Many questions reuse the same link (e.g. 3 LLM-basics Qs → one YouTube video "AI Engineering Explained").
- Sample 1: "What is KV cache, and how does it speed up inference?" → outcomeschool.com/blog/kv-cache-in-llms (published 2026-03-27). Per firecrawl extraction: explains the idea and speed/memory trade-off, mentions PagedAttention, but "does not provide a specific memory-size formula or worked estimate", and promotes the paid "AI and Machine Learning Program". Correct but beginner-level.
- Sample 2: "Estimate the KV cache memory needed to serve a large model. How does it constrain batch size…" → links to "KV Cache Compression" article — question/answer mismatch (estimation Q answered by a compression article; not fully read). [推論] answers are blog-post links chosen by topic, not written for the question.

### 2026-era coverage (amit)
| Type | Y/N | Evidence (README.md) |
|---|---|---|
| AI-collab coding rounds | No | only "What matters more for an agentic coding tool like Claude Code: the model or the harness?" |
| Work trials | No | 0 hits "trial" |
| FDE scenarios | No (FDE listed as target role only) | customer-support agent design Qs only |
| Agent/harness design | Yes | Agents section 53 Qs; "Harness Engineering in AI"; Coding "Implement a minimal agent loop…" |
| Eval design | Yes (36 Qs, 15 answered) | Evaluation and Testing section |
| Inference/serving | Yes | "Design an LLM Inference Platform (vLLM-as-a-Service)", KV cache, chunked prefill |
| Take-home | No | 0 hits |

### Commercial funnel
- Prominent: "Prepared and maintained by the Founder of Outcome School"; "I teach at Outcome School → AI and Machine Learning" program link near top; ~278 outcomeschool.com links (answers route to the school blog, which itself promotes the paid program).

### Comparison with pallavi-shekhar company-wise (sister repo)
- pallavi: 4 files (README 2,047 lines), 9 commits all by "Pallavi", all 2026-09-19 except last 2026-09-29. Claims "Real interview questions asked … at 35 companies, … with answers linked wherever we have them." Links back to amit repo (L99: "For topic-wise questions and answers, see …").
- Question overlap: 613 unique bullet lines in pallavi vs 590 in amit README; exact-string overlap only 8 lines (of which ~4 actual questions, e.g. "Implement multi-head attention, then convert it to grouped-query attention.", "What is chunked prefill…"). → questions largely different; pallavi is company-organized with "Asked at: [OpenAI], [xAI]…" tags and per-company "Interview loop, as publicly reported" blurbs.
- Answer-link overlap: pallavi has 108 unique non-social URLs; **100 of them also appear in amit** (93%). Pallavi-only: ~7 classical-ML outcomeschool blog posts (feature engineering, precision vs recall, backprop…) + the amit repo link. So same answer pool = Outcome School blog. pallavi has 232 "Answer" lines for 613 bullets.
- Sources: pallavi says "compiled from publicly reported interview experiences" but gives NO per-question or per-company source links (grep for reddit/glassdoor/blind: none). Company attributions ("Asked at") are unverifiable from the repo.
- Side observation: pallavi's Anthropic loop blurb ("Recruiter screen (~30 min, substantive and failable) → … ~70–90 min, one practical problem in ~4 progressive levels … 3 weeks to ~2 months … AI-collaboration round where Claude is provided") closely paraphrases om's `anthropic.md` loop table ("Substantive, failable", "~70-90 min", "~4 progressive levels", "about three weeks to a couple of months"). Company list also strongly overlaps om's (DeepSeek, Moonshot, Zhipu, Qwen, Sarvam, Groq, Together, Character.AI…). Specific coding questions (toy banking app, nested stack traces, SQL overlapping subscriptions) are NOT in om. [推論] could be shared public sources (interviewing.io/Exponent) or paraphrase of om (om published July, pallavi Sept); cannot determine.

---

## Could not verify
- GitHub star counts (API blocked).
- Reddit-sourced claims (Microsoft AI-assisted round, etc.) — reddit not fetchable.
- aeg `interview/data/fetched/` & `link-summaries/` artifacts described in README but absent from repo.
- Which 5 companies are aeg's "paid work trials".
- om MCP "2026-07-28 revision" claims; om Cursor work-trial sources (Lenny's/BI) not fetched.
- pallavi "Asked at" company attributions (no sources).
- ml6team challenge repo link in aeg (dead/private).
- aidaddy.tech's commercial nature.
