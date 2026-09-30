# Agent C notes — Non-GitHub AI Engineer interview prep landscape (read 2026-09-30)

Legend: ✅ = full page read via Groundlane web_fetch; 🟡 = search snippet only (not verified on primary page); ❌ = fetch failed.
Tooling: Groundlane web_search + web_fetch throughout. No fallback to other providers. Degradations: several pricing pages are JS-rendered / behind bot checks (Vercel checkpoint 429 on interviewquery.com & datainterview.com; algoexpert.io JS-empty; igotanoffer prices in client JS; Google careers pages JS-only; openai.com reader returned only intro -> recovered by fetching raw HTML and stripping tags; DeepMind PDF returned raw binary). toolDegradation: none (stayed on Groundlane), but read-level downgraded to 🟡 for those items.

---

## D. Official company-published interview guidance (PRIMARY)

### Anthropic — "Guidance on Candidates' AI Usage" ✅
- URL: https://www.anthropic.com/candidate-ai-guidance  (page says "Last updated Jul 10, 2025")
- Stages: applying = "Please create your first draft yourself, then use Claude to refine it."
- Take-homes: "Complete these without Claude unless we indicate otherwise." / "We'll be clear when AI is allowed (example: "You may use Claude for this coding challenge")."
- Interview prep: "Use Claude to research Anthropic, practice your answers, and prepare questions for us."
- Live interviews: "This is all you–no AI assistance unless we indicate otherwise."
- Transparency: "We use Claude to create job descriptions, develop interview questions, ... transcribe interviews, and identify candidates to source. We don't use your data to train Claude or let Claude make hiring decisions."

### Anthropic Engineering — "Designing AI-resistant technical evaluations" (Tristan Hume, 2026-01-21) ✅ (read first ~60%, output truncated)
- URL: https://www.anthropic.com/engineering/AI-resistant-technical-evaluations
- Performance-engineering take-home (simulated accelerator, since early 2024; >1,000 candidates). Explicitly AI-allowed: "For this take-home, we explicitly indicate otherwise."
- "When given the same time limit, Claude Opus 4 outperformed most human applicants... then Claude Opus 4.5 matched even those." Time limit cut 4h -> 2h. Original take-home released as open challenge.
- Useful for article: shows a real frontier-lab take-home format + why "memorize question bank" prep is weak.

### OpenAI — Interview Guide ✅ (Groundlane reader returned only intro; full text recovered from raw HTML)
- URL: https://openai.com/interview-guide/
- Process: résumé review (~1 week) -> intro calls -> skills-based assessment ("pair coding interviews, take-home projects, technical tests, etc.") -> final interviews "4–6 hours of final interviews with 4–6 people over 1–2 days" -> decision within ~1 week.
- AI policy quote: "Expectations for AI and other tools vary by interview: some formats intentionally allow them, while others are designed to assess your independent problem-solving without AI tools. We'll explain what is allowed in your interview preparation materials."
- Engineering bar: "we generally look for well-designed solutions to the challenge, high-quality code, optimal performance, and good test coverage."
- Recommended reading: OpenAI Charter, research publications, blog; technical: Deep Learning Book, Spinning Up in Deep RL.

### Meta — Careers "Hiring Process" page FAQ ✅
- URL: https://www.metacareers.com/hiring-process/
- "Yes, many of Meta's interviews now include an AI assistant built into the interview environment. Candidates are expected to use this AI assistant as part of the interview."
- Tools: "Candidates use the built-in AI assistant in CoderPad, which includes Claude, ChatGPT, Gemini, and Meta's models... Design interviews will be conducted in CoderPad with Mermaid Markdown with the same AI assistant... No outside AI tools or assistance are authorized."
- Prep advice: "Practicing with AI coding tools and being comfortable reading, debugging, and building on existing code will help you feel prepared." Languages for "AI-Native Coding Interview": Python, Java, TypeScript, C++, C#, Kotlin, Swift, Rust, Go.
- Context (secondary, 🟡): Hello Interview blog says rollout started Oct 2025 (https://www.hellointerview.com/blog/meta-ai-enabled-coding); interviewing.io blog claims official prep says AI use "optional" but in practice not (https://interviewing.io/blog/how-to-use-ai-in-meta-s-ai-assisted-coding-interview-with-real-prompts-and-examples). NOTE: Meta's page now says candidates are "expected" to use it — newer than those third-party claims.

### Google — no readable official page on AI-assisted interviews ❌/🟡
- Official pages https://www.google.com/about/careers/applications/how-we-hire/ and /interview-tips/ are JS-rendered; Groundlane (http + browser) returned only footer. Could not quote.
- Secondary 🟡: Business Insider (2026-05-07, from internal document) — Google to permit an "approved" AI assistant (Gemini, per spokesperson) in a new "code comprehension" round from H2 2026, pilot for junior/mid-level US roles. https://www.businessinsider.com/google-job-interview-software-engineers-ai-assistant-coding-2026-5 — not an official Google publication.

### Google DeepMind — Careers "Interview process" ✅
- URL: https://deepmind.google/careers/#interview-process
- Stages: 30-min recruiter call (+ possibly hiring manager) -> "Over two or three further calls, we'll evaluate you against the competencies and skills required" -> final round with Team Leads and leadership "through the lens of team goals, future plans, and our culture, mission, and values" -> decision. No AI-usage policy stated.
- Also a PDF "Interviewing at Google DeepMind" https://storage.googleapis.com/deepmind-media/DeepMind.com/Assets/Docs/interviewing-at-google-deepmind.pdf — ❌ Groundlane returned raw PDF bytes; snippet only 🟡 ("Show us your interest...").

### Cursor / Anysphere — work trials
- Official careers page ✅ https://cursor.com/careers : only "We obsess over talent to an unusual degree..." — no process / work-trial statement on page.
- Lenny's Podcast episode page (Michael Truell, 2025-05-01) ✅ https://www.lennysnewsletter.com/p/the-rise-of-cursor-michael-truell — show notes only (no transcript); chapter "(51:30) Hiring and building a strong team"; takeaway "Hiring for intellectual curiosity... experimentation, and honesty". Did NOT find the verbatim work-trial quote from this episode.
- Business Insider (2026-08-11) ✅ https://www.businessinsider.com/cursor-work-trials-tips-candidate-hiring-head-talent-2026-8 : Adam Ward (Cursor head of talent) on Lenny's Podcast: "This is where most companies get it wrong on the on-site... They're almost always buying." BI: "Cursor has also used a two-day on-site work trial for engineering and design candidates, during which applicants work from a frozen version of its codebase."
- BI (2025-11-11) 🟡 https://www.businessinsider.com/cursor-hiring-recruitment-strategy-engineers-michael-truell-anysphere-ai-vibecoding-2025-11 : Truell on a16z podcast — every eng/design hire completes a two-day on-site work trial. Truell also on YC podcast (June 2025).
- Criticism 🟡: r/startups post calling 2-day unpaid trial "exploitative" https://www.reddit.com/r/startups/comments/1nuu67a/ ; conflicting third-party claims that onsite is paid (extern.com) — UNRESOLVED; don't state paid/unpaid as fact.
- 🟡 learncursor.dev notes 3 SWE postings mention "two to three short technicals plus an onsite build" — not verified on postings.
- RECOMMENDATION for article: attribute the work trial to Truell's podcast remarks as reported by BI, and Adam Ward on Lenny's Podcast (Aug 2026), not to the May 2025 Lenny episode unless transcript checked.

### Canva (bonus, primary) ✅
- https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/ (Simon Newton, 2025-06-11): "we now expect Backend, Machine Learning and Frontend engineering candidates to use AI tools like Copilot, Cursor, and Claude during our technical interviews." New "AI-Assisted Coding" competency replaces CS Fundamentals screen.

---

## A. Paid / freemium prep platforms

| Platform | AI/ML/LLM-specific content | Price (source, read level) | Credibility signals |
|---|---|---|---|
| Aced (formerly Exponent) | Rebrand announced 2026-08-17 ✅ https://www.tryexponent.com/blog/exponent-is-becoming-aced : new FDE course, "Revamped System Design course with AI and agentic architectures", "Updated expert guides on interviews at Anthropic, OpenAI, Meta", community interview-report DB, 1-1 coaches, AI coach "Ace". Site nav lists "AI Engineering", "Machine Learning", "Generative AI" categories and an ML Engineer course (https://www.tryexponent.com/courses/ml-engineer — page body didn't render ❌). Owns Pramp, InterviewCake. | ✅ https://www.tryexponent.com/upgrade (rendered): Basic $0 (5 peer mocks/mo); Pro "$79 / month" struck -> "$12/ month" ("Save 70%"); Expert "$99 / month" -> "$20/ month" (adds AI mock interviews, AI feedback, AI coach). Billing period behind the discounted figure not shown in text — likely annual; verify before quoting. | Claims "600,000+ happy users" on pricing page / "over 1 million candidates" in blog; courses "built from insights from 2,000+ interviews". Company-authored; experience reports are user-submitted. |
| interviewing.io | ✅ https://interviewing.io/ : anonymous mocks with "Senior, Staff, or Principal-level engineers or eng managers"; topics include "Machine learning (algorithms & system design)"; AI Interviewer (free, 200+ problems from Beyond Cracking the Coding Interview). Blog on Meta AI-assisted round. Public replay transcripts incl. ML behavioral mock. | /pricing 404 ❌. 🟡 third-party: sessions from ~$179; FAANG-branded up to ~$339; dedicated coaching ~$2,000 for 3 sessions (lodely.com, finalroundai.com). Founder on Reddit (2024) re interviewer pay: "ML and other niche stuff is $300 per" (payout to interviewer, not price). | Interviewers are working hiring-bar engineers; claims "$50B in job offers". No AI-engineer-specific track per se — ML algorithms/system design. |
| Hello Interview | System design focus; premium includes "ChatGPT" problem breakdown and "Vector Databases" advanced topic; blog guide on Meta AI-enabled coding. **Live mock interviews & mentorship ENDED May 31, 2026** ✅ https://www.hellointerview.com/mock-sunset | ✅ https://www.hellointerview.com/premium : 1 month $47 (reg $59), 1 year $79 (reg $99), Lifetime $279 (reg $349); "Does not auto-renew". | Founded by Stefan & Evan (ex-FAANG per third parties 🟡). Community "thousands of recent interview questions" (user-reported). Not AI-engineer-specific. |
| IGotAnOffer | ML engineer coaching + mock interviews; subcategories incl. "Artificial intelligence (AI) mock interviews", "ML system design", NLP. ✅ page https://igotanoffer.com/en/mock-interviews/machine-learning (content mostly JS). Also free company-process articles (e.g. OpenAI process). | Credit-based; 🟡 "Coaches charge between 2 and 5 credits per session" (search snippet from https://igotanoffer.com/en/interview-coaching/role/machine-learning-engineer). $ per credit not readable (client-side JS) ❌. | Marketplace of ex-big-tech coaches; testimonials. |
| Interview Query | DS/ML oriented question bank + paths. | ❌ pricing page blocked (Vercel 429). Not verified. | — |
| Educative | ✅ "Grokking the Generative AI System Design" https://www.educative.io/courses/generative-ai-system-design : SCALED 6-step framework; case studies text/image/speech/video/captioning/ASR/RAG; back-of-envelope LLM calcs; AI mock interviews. Author Khayyam Hashmi (VP Technical Content @ Educative). Also mock-interview catalog incl. "production AI agent" architecture interview (🟡 https://www.educative.io/mock-interview). | ❌ https://www.educative.io/unlimited rendered no prices. 🟡 designgurus.io (competitor!) says $14.99–$39/mo. Don't quote without checking. | In-house authored; "Developed by MAANG Engineers" (marketing). Note metrics taught skew to BLEU/ROUGE/FID — classic GenAI, lighter on LLM-as-judge/evals. |
| AlgoExpert / MLExpert | 🟡 https://www.algoexpert.io/machine-learning/product : ML crash course (18 modules), ML coding, large-scale ML. (Separate mlexpert.io "AI Engineering Academy" — RAG/agents/evals curriculum — appears to be a different product, Venelin Valkov 🟡; don't conflate.) | ❌ page JS-empty ("FLASH SALE 7 PRODUCTS FOR OVER 80% OFF"). 🟡 2025 affiliate site: MLExpert $49/yr; ML Interview Bundle $109/yr — stale/unverified. | Content is pre-LLM-era classical ML oriented. |
| DataInterview (Dan Lee, ex-Google) | 🟡 https://www.datainterview.com/pricing snippet: courses for DS/DE/ML/AI Engineer/Quant; "4,000+ interview questions"; "AI-assisted coding interviews — solve a real task with an AI copilot, scored on your workflow (Meta-style)"; AI tutor tier. | ❌ blocked (Vercel 429). | Founder ex-Google (LinkedIn 🟡). |

Other notes: many "review" sites (finalroundai, lodely, officebook, algoengineer, interviewman) are competitors/affiliates — treat as biased.

---

## B. Books

- **Chip Huyen, _AI Engineering_ (O'Reilly, 2025)** ✅ https://huyenchip.com/books/ — "building applications with readily available foundation models"; framework for developing/deploying AI apps; models, datasets, eval benchmarks, application patterns. Author claims "the most read book on O'Reilly since its release". Interview use: best single source for AI-engineer (app-layer) system design vocabulary: evals, RAG, agents, finetuning tradeoffs, inference optimization. Not a Q&A drill book.
- **Chip Huyen, _Designing Machine Learning Systems_ (O'Reilly, 2022)** ✅ same page — holistic ML systems: training data, features, retraining, monitoring; case studies + references. Interview use: classic ML system design (data/feature/monitoring); pre-LLM.
- **Chip Huyen, _Machine Learning Interviews Book_ (2021, free/open-source)** ✅ https://huyenchip.com/ml-interviews-book/ — Part 1 process/roles/interviewer mindset; Part 2 "over 200 knowledge questions" with difficulty; plus 30 open-ended ML systems design questions. Author notes it's "being updated and will be incorporated into MVAIE". Weakness: 2021, pre-LLM; many answers crowd-sourced on Discord.
- **Ali Aminian & Alex Xu, _Machine Learning System Design Interview_ (ByteByteGo, 2023)** 🟡 (Open Library: Jan 28 2023; Google Books: "step-by-step framework") — 294 pp (Indian ed., 🟡). Popular for Meta ML design (r/MachineLearning thread 🟡 https://www.reddit.com/r/MachineLearning/comments/16z0zlz/). Classic recsys/search/ads-style; pre-LLM.
- **Ali Aminian & Hao Sheng, _Generative AI System Design Interview_ (ByteByteGo, released Nov 2024)** ✅ https://blog.bytebytego.com/p/our-new-book-generative-ai-system (Alex Xu post 2024-11-18). NOTE: authors are Aminian & **Hao Sheng**, not Alex Xu (Xu is publisher). 7-step framework, 10 questions, 280+ diagrams. Chapters: Gmail Smart Compose, Google Translate, ChatGPT chatbot, Image Captioning, RAG, Face Generation, High-Res Image Synthesis, Text-to-Image, Personalized Headshot, Text-to-Video. Weakness for AI-engineer roles: model-training-heavy, 1 chapter on RAG, no agents/evals chapters (per TOC).
- Other commonly recommended (🟡 from listicles, affiliate-heavy javarevisited/medium): _LLM Engineer's Handbook_ (Iusztin & Labonne, Packt), _Hands-On Large Language Models_ (Alammar & Grootendorst, O'Reilly), _Build a Large Language Model (From Scratch)_ (Raschka). computingforgeeks (2026-08-27 🟡) notes LLM Engineer's Handbook has no agent chapter.

---

## C. Raw interview-experience communities

- **Reddit** (r/leetcode, r/cscareerquestions, r/MachineLearning): 🟡 e.g. r/leetcode "[Meta] ML Research Scientist Interview Experience (New 'Coding with AI' Round)" (2026-02) https://www.reddit.com/r/leetcode/comments/1r37w7q/ — describes multi-file project + AI agent, fix bugs to pass tests. Fast, candid; unverified identities, survivorship/negativity bias.
- **LeetCode Discuss**: 🟡 interview-experience posts e.g. "Google L4 AI/ML interview experience" https://leetcode.com/discuss/post/7370210/ ; mixed with SEO spam question lists.
- **Glassdoor**: Chip Huyen's 2019 analysis ✅ https://huyenchip.com/2019/08/21/glassdoor-interview-reviews-tech-hiring-cultures.html lists biases: few people review; extreme experiences overrepresented; offer receivers/acceptors more likely to review; juniors more likely than seniors. Good citable reliability caveat.
- **Blind (teamblind)**: 🟡 work-email verification of employer, emails not linked to activity (https://www.teamblind.com/blog/how-to-use-blind-anonymous-professional-community/). Verified-employer but anonymous -> good for comp/culture, toxic/noisy.
- **1point3acres 一亩三分地**: 🟡 面经 collections e.g. "MLE找工作" https://www.1point3acres.com/bbs/collection/238449 , "面经" https://www.1point3acres.com/bbs/collection/247411 ; ❌ fetch blocked by access challenge. Known point (积分) gating for viewing content (common knowledge; not verified on page this session).
- **levels.fyi**: comp data self-reported; 🟡 Reddit consensus "Glassdoor usually seems too low and levels.fyi too high" https://www.reddit.com/r/cscareerquestionsEU/comments/1b0tge1/ — anecdotal.
- **Aced/Exponent, Hello Interview** also run user-submitted interview-report databases (vendor-curated).

---

## E. Newsletters / blogs

- AI Interview Prep (Hao Hoang, Substack) ✅ https://aiinterviewprep.substack.com/about — NLP/CV/RL/LLM/ML system design "traps"; recent series "AI Agent Engineering Interview #3 - The Tool-Call Trap" (🟡). Individual practitioner; paywalled parts.
- Sundeep Teki ✅ https://www.sundeepteki.org/advice/the-ultimate-ai-research-engineer-interview-guide-cracking-openai-anthropic-google-deepmind-top-ai-labs (2025-11-29 by page metadata) — lab-by-lab RE guide; claims "acceptance rates below 1%" at DeepMind (unsourced); upsells paid career guides/coaching. Treat as opinion.
- Eugene Yan, "How to Interview and Hire ML/AI Engineers" (2024-07) 🟡 https://eugeneyan.com/writing/how-to-interview/ — interviewer-side view; emphasizes how candidate solves, data literacy.
- Chip Huyen blog ✅ (books page) + ML interviews book.
- Company blogs: Hello Interview blog (Meta AI-enabled coding), interviewing.io blog (Meta AI round prompts), Aced blog (OpenAI/Anthropic process articles) — useful but vendor.

---

## F. Taiwan / Chinese-language

- PTT Soft_Job ✅ https://www.ptt.cc/bbs/Soft_Job/M.1740282491.A.619.html — "[心得] 2024 AI/ML新鮮人求職心得" (2025-02-23): Appier LLM Research Scientist loop (training trade-offs, LC medium, LLM/NLP basics, chatbot system design), Cyberlink AI Engineer (curve-reading, presentation), advice: live ML system design with evolving spec; "刷題/ML基礎/各種SOTA/數學 ... 佔60-80%以上". Strong-background survivorship caveat (commenters note).
- Dcard 🟡 https://www.dcard.tw/f/job/p/259856570 ("AI工程師 面試分享(12家)", 2025-09) ; https://www.dcard.tw/f/tech_job/p/255757554 ("AI Software Engineer 面試分享", 2025-09; RAG/embedding/vector DB questions).
- 一亩三分地 🟡 (see C).
- 知乎 🟡 https://zhuanlan.zhihu.com/p/678968016 (大模型算法工程师面试题); https://zhuanlan.zhihu.com/p/1981387722473116577 (2026 LLM 题库, aggregated from 牛客/CSDN/GitHub — second-hand).
- Other zh-CN 🟡: 卡码笔记 https://notes.kamacoder.com/interview/llm/ (2026 大模型面经: Agent/RAG/Transformer/微调/Vibe Coding); 小林面试笔记 https://www.xiaolinnote.com/ai/ (claims questions from 字节/阿里/快手/腾讯 真实面经). Mainland 八股文 style; skew to China big-tech.
