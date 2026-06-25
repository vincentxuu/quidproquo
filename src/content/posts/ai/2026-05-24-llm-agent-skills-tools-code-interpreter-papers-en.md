---
title: "Assembling LLM Agent Skills / Tools / Code Interpreter for Real: A Paper Reading Map"
date: 2026-05-24
category: ai
type: deep-dive
tags: [llm, agents, tool-use, skills, code-interpreter, function-calling, paper-review]
lang: en
tldr: "The hard part of LLM agents is not building function calling, skills, code interpreter, and document tools individually -- it is assembling them into a system that selects the right tool, writes code when needed, decomposes tasks, verifies results, and resists prompt injection. This post organizes the key papers into six engineering decisions: function calling reliability, tool/skill selection, code-as-action, multi-step planning, skill systems, and safety plus document generation."
description: "A deep-dive reading guide to LLM agent skills / tools / code interpreter: from ReAct, Toolformer, CodeAct, and ToolRet to SoK Agentic Skills, organized into a paper map and engineering decision table for designing agent systems."
draft: false
---

> 🌏 [中文版](/posts/ai/llm-agent-skills-tools-code-interpreter-papers)

Many teams hit a wall after building their LLM agent to a certain point: function calling works, the skills system is in place, the code interpreter is running, and file parsers are connected -- but when a real task comes in like "make me a product intro deck" or "take this PDF with tables and give me a summary plus an Excel file," the smoothness just cannot match Claude or ChatGPT.

This usually is not a case of "the underlying capabilities don't exist," but rather "the assembly layer was never designed." The four underlying tool types, code sandbox, and skill loader are all there, but how the system prompt is written, how skill descriptions are worded, which tools are loaded by default, who handles planning when chaining multiple tools, and who decides on retries after failure -- if this configuration layer is not designed, the agent ends up like a box of parts rather than a working machine.

This post is not about listing paper titles. It organizes the papers around six engineering questions. Each question maps to a practical decision: Should you fine-tune function calling? Should tool selection use retrieval? Should the code interpreter be just another function tool? Should skills be markdown instructions or programmatic capability packages? Should document generation be a black-box one-click output, or should users be able to intervene at intermediate steps?

## Defining the Problem First: More Tools Is Not Better

A typical LLM agent design looks like this:

```
User task
  ↓
System prompt + tool descriptions
  ↓
LLM decides next action
  ↓
function call / code execution / skill script / file parser
  ↓
observation
  ↓
repeat until done
```

This loop looks simple on the surface, but every layer has pitfalls.

The pitfall of function calling is "the model knows it should use a tool but fills in the wrong schema, hallucinates non-existent parameters, or acts on ambiguous instructions without asking." The pitfall of tool selection is "the more tools there are, the more likely the LLM picks the wrong one; if you add retrieval first, that is another layer that can fail." The pitfall of the code interpreter is "letting the model write code is powerful, but sandbox, permissions, execution time, and file I/O all become production issues." The pitfall of the skill system is "markdown instructions are easy to extend but also easy to turn into a prompt injection attack surface."

So the real question is not "should I add tools," but rather:

| Engineering Decision | Question |
|---|---|
| Function calling | How do you make the model reliably call the right tool with correct parameters? |
| Tool / Skill selection | When there are many tools, should you rely on descriptions, retrieval, or two-stage selection? |
| Code interpreter | Which tasks should let the model write code instead of making JSON function calls one at a time? |
| Planning | For long tasks of 7-10+ steps, should the agent think step-by-step (ReAct) or plan first then execute? |
| Skill system | Is a skill a single tool, a documentation file, or a reusable programmatic capability package? |
| Safety | After opening up skills and code execution, how do you handle permissions and prompt injection? |

The six sub-questions below trace the paper lineage behind this decision table.

## Sub-question 1: Function Calling Reliability

Function calling is the most easily underestimated layer. Many teams plug into OpenAI / Anthropic / Gemini tool use and assume the problem is solved. In practice, tool call success rate, parameter correctness, ambiguous instruction handling, and multi-step chaining stability all need separate design work.

The most worthwhile first read is **ToolACE**. It does not just say "collect more function calling data" -- it treats training data quality as a first-class variable: tool coverage, parameter difficulty, negative examples, conversational context, and error recovery. If you want to build an internal dogfooding eval, this paper's methodology can be adopted directly: classify errors into schema errors, parameter errors, missed calls, false calls, and call ordering errors -- not just whether the final answer is correct.

**Reducing Tool Hallucination via Reliability Alignment** targets a more specific problem: the model calls a tool that does not exist or fills in non-existent parameters. This is painful in products because the error looks like "the model is dumb," but the root cause is misaligned tool boundaries. The value of such papers is not necessarily telling you to fine-tune, but reminding you that your eval set cannot contain only happy paths -- you must include cases for "should not call a tool" and "tool does not exist."

**CriticTool** is useful for building an error classification vocabulary. When you start looking at production logs, you will find "tool call fail" is too coarse: missing parameter, wrong type, wrong tool, insufficient data but forced call, should have asked a follow-up but did not -- the fixes are completely different. Without a taxonomy, targeted improvement becomes very difficult downstream.

Recommended reading order:

1. **ToolACE**: First establish data quality thinking for function calling eval.
2. **CriticTool**: Build an error classification framework.
3. **Reliability Alignment**: See how hallucinated tools/arguments are handled.
4. **Learning to Ask**: Handle ambiguous instructions so the agent does not randomly oscillate between "ask a follow-up" and "just do it."
5. **Exploring Multi-Step and Constrained Function Calling under Long Context**: Move into multi-step tool chaining problems.

The engineering takeaway for this layer is straightforward: if your agent product has not yet classified tool call failures into logs, do not rush to add more tools. More tools only expand the error space.

## Sub-question 2: Tool / Skill Selection

When the number of tools is small, stuffing all tool names and descriptions into the system prompt and letting the LLM choose usually works. When tools number in the dozens, hundreds, or thousands, the question becomes: should you first filter candidate tools with embedding retrieval?

The most interesting paper here is **ToolRet**. Intuitively, retrieval should win over a description list: find relevant tools first, then let the LLM choose -- would that not save tokens? But ToolRet's benchmark gives a more measured conclusion: retrieval models are not as sensitive to tool descriptions as you might expect, and in many cases the retrieval pipeline does not significantly outperform just giving descriptions directly to the model.

This is important for Anthropic Skills-type systems. The Anthropic Skills approach leans description-based: each skill's frontmatter `description` is the first-layer trigger, and the `SKILL.md` body and folder scripts/templates are only read when actually needed. The design philosophy is "write good descriptions first" rather than jumping to complex retrieval from the start.

But this does not mean retrieval is useless. **Online-Optimized RAG for Tool Use**, **Improving Tool Retrieval by LLM Query Generation**, and **MassTool** represent another path: when the number of tools is truly too large for the model to see all of them, retrieval is still necessary -- it is just not a free lunch. You need to handle query rewriting, tool description quality, candidate recall, and fallback after mis-selection.

I would split the decision into three tiers:

| Scale | Recommendation |
|---|---|
| Under 10 | Direct description list; focus on clearly stating when to use and when not to use each tool |
| 10-100 | Organize by namespace/category; use two-stage selection when necessary |
| 100+ | Only then seriously consider retrieval, but with eval -- do not add embeddings just because you have many tools |

The first investment that truly pays off is usually not a vector store, but a tool description writing standard: one sentence for purpose, one sentence for when not to use, list required inputs, list common misuses. This is cheaper than retrieval and its effects are easier to observe.

## Sub-question 3: Code Interpreter / Code-as-Action

The core paper for this sub-question is **Executable Code Actions Elicit Better LLM Agents (CodeAct)**.

CodeAct's argument is direct: do not limit the agent to expressing actions through JSON function calls -- let it write a chunk of executable Python code. Python is Turing-complete and can natively express loops, conditionals, variables, compound operations, and error handling; a JSON tool call can only express "call one function once."

The difference is small for simple tasks. Checking the weather, querying a database, sending a Slack message -- a single function call suffices. But as soon as a task requires intermediate state, the difference grows:

```python
rows = read_csv("sales.csv")
cleaned = normalize_columns(rows)
by_region = groupby(cleaned, "region")
chart = plot(by_region)
write_file("summary.png", chart)
```

With JSON function calls, the model might need five or six tool calls, stuffing intermediate state back into the context as text each time. With code-as-action, state lives in the runtime, and the LLM can complete the task by writing a single program. This is where code interpreter capabilities are truly powerful: it is not "one more Python tool" but a new language for the model to express actions.

This also explains why Anthropic Skills are structured as folders with Markdown + scripts/templates. A skill is not a fixed-schema function but a programmatic capability package. After reading `SKILL.md`, the LLM can combine bash, file tools, Python libraries, and example scripts to compose a solution, rather than being locked to a single function signature.

But the cost of code-as-action is also clear: as soon as you let an LLM write arbitrary code, sandbox and runtime enforcement are not optional. **Customizable Runtime Enforcement for Safe LLM Agents** and similar work remind us that a production code interpreter must handle at minimum:

- File read/write scope
- Network access
- CPU / memory / wall-clock timeout
- Secret isolation
- Package install policy
- Execution result size limits
- Reproducibility and audit logs

So the decision at this layer is not "should we have a code interpreter," but "which tasks are worth routing to the code interpreter." My criteria: data transformation, file generation, table processing, batch computation, and chart generation are good fits for code-as-action; single queries, external API calls, and permission-sensitive operations still fit function calls better.

## Sub-question 4: Multi-step Tool Chaining / Planning

Starting from tasks like "look up the product -> check the price -> generate a quote -> write an email -> wait for confirmation -> send" -- the agent can no longer rely on single-step tool selection. It needs some form of planning.

**ReAct** is the baseline for this line of work: reasoning traces and actions are generated in alternation. Its advantage is flexibility; its disadvantage is that each step can accumulate error. It works well for short tasks; for tasks longer than 7-10 steps, "one small mistake early on causes the entire chain to drift" becomes common.

**Toolformer** laid the groundwork from a different angle: teaching the model when to insert a tool call. This paper looks old today, but it defined an important direction: tool use is not a bolt-on if/else but part of the model's behavior.

**Reflexion** handles self-correction after failure. For engineering systems, it maps to retry / fallback / verbal memory: after the agent fails once, it does not just re-run but converts the failure reason into a strategy for the next round.

Among more recent work, planner-centric and hierarchical planning papers are worth attention. **A Planner-Centric Framework for Complex Tool-Augmented LLM** directly questions the reliability of pure ReAct step-by-step and argues for building a plan first, then having an executor carry it out. **GoalAct** combines global planning with hierarchical execution.

There is no silver bullet here, only trade-offs:

| Approach | Pros | Cons |
|---|---|---|
| ReAct step-by-step | Fast, simple, highly flexible | Accumulates errors on long tasks |
| Planner-first | More stable for full-task scope | Higher latency; plan may lock in too early |
| Hierarchical planning | Suits long tasks and sub-task delegation | Highest system complexity |

For a general chat tool, ReAct is sufficient. For enterprise workflows, document production, batch tasks, and scenarios requiring retries and approvals, planner-first will almost inevitably need to be introduced. The only question is whether you build the planner as a first-class component from the start or wait until the ReAct loop's error logs accumulate to an unbearable level before patching it in.

## Sub-question 5: A Skill System Is Not a Tool Registry

The Anthropic Skills paradigm accumulated a body of systematization work in a short time for a simple reason: it lifted "tools" up one level of abstraction.

A single tool is a callable capability -- for example, `send_email`, `read_pdf`, `query_database`. A skill is more like a programmatic knowledge package for "how to accomplish a class of tasks": it has description, instructions, scripts, templates, examples, and resources. It does not just tell the model what it can call; it also tells the model how a workflow should proceed.

**SoK: Agentic Skills -- Beyond Tool Use in LLM Agents** is the most worthwhile first read for this topic. It defines skills as reusable, programmatic, cross-tool-coordinating capability packages that differ from single tools at a fundamental abstraction level. This matters because many systems implement skills as "just another function," which loses the value of the skill concept entirely.

**A Comprehensive Survey on Agent Skills** works well as a checklist: what metadata a skill should include, how to describe capabilities, how to manage scripts/resources, and how to handle versioning. **Agent Skills for LLMs** further addresses verification: how do you confirm that a skill actually does what its description claims?

From an engineering perspective, I would decompose a skill system into four layers:

1. **Discovery layer**: name + description, determining when to trigger.
2. **Instruction layer**: `SKILL.md` body, describing the workflow.
3. **Execution layer**: scripts/templates/resources, so the model does not have to invent the approach from scratch.
4. **Verification layer**: tests, example input/output pairs, runnable smoke checks.

If you only build the first two layers, it is more like a prompt library; at the third layer, it starts to feel like an agent skill; only at the fourth layer does it have a chance in production.

## Security Reminder: The More a Skill Resembles a Capability Package, the Larger the Attack Surface

The openness of the skill system simultaneously opens up attack surfaces.

**Agent Skills Enable a New Class of Realistic and Trivially Simple Prompt Injection** and **SkillJect** both address the same issue: text inside a skill is treated as instructions by the model. As long as skills can be submitted, downloaded, or synced by third parties, attackers can hide malicious instructions in skill instructions, examples, or even templates.

This is different from traditional prompt injection. Traditional injection is often hidden in web page or document content, and the model may only encounter it during a particular task; skill injection is closer to a supply-chain attack. Once a skill is installed, it will be triggered across multiple future tasks.

So if you want to build an end-user skill marketplace, you need to think about these on day 0:

- Skill source verification
- Permission declarations and least privilege
- Sandbox boundaries for files / network / secrets
- Static analysis before installation
- Runtime audit logs
- Human approval for high-risk tool calls

Do not wait until the marketplace is up and running to add a security model. At that point, you are not fixing a bug -- you are patching an execution environment that has already been distributed.

## Sub-question 6: Document and Presentation Generation

"Take this PDF and turn it into a deck plus an Excel file" is one of the most common LLM agent demands in enterprise applications, but it is much harder than it looks. The difficulty is not whether a single model can write copy, but that it needs to simultaneously handle document comprehension, table extraction, layout planning, chart generation, file formats, and user editability.

The key point of **AutoPresent** is not that an 8B model approaches GPT-4o, but the "programmatic tool library" design. It has the model generate structured visuals through a set of composable functions rather than directly outputting slides. This aligns closely with the spirit of `pptx` skills: give the model a set of Python libraries / templates / helper scripts and let it assemble the file using code.

**Generating and Evaluating Presentations Beyond Text-to-Slides** adds the evaluation angle. Presentations cannot be judged solely on whether the text is correct -- you also need to assess layout, visual hierarchy, information architecture, and whether charts make sense. This matters for dogfooding because an LLM producing a presentation that "looks like it has content" but has terrible layout should not count as a success.

**Talk-to-Your-Slides** takes another approach: instead of generating a new file, it directly manipulates a live PowerPoint session. This makes sense for "the user brings an 80%-done deck and asks the agent to modify it." **SlideTailor** emphasizes a step-by-step, editable, human-behavior-inspired process, reminding us not to turn the document agent into a one-click black box.

For tables and Excel, start with **SpreadsheetLLM** and **LLM for Table Processing: A Survey**. PDF table to Excel is not simple OCR; it involves understanding table structure, merged cells, header hierarchy, units, footnotes, and cross-page tables. This is also why code interpreter + parser + skill library feels more natural than a single function call.

The product trade-offs for this topic can be framed as follows:

| Task | More Reasonable Approach |
|---|---|
| Generate a presentation from scratch | Template + programmatic slide library + code-as-action |
| Modify an existing presentation | Manipulate a live session or read/write the original file, preserving existing styles |
| Convert PDF tables to Excel | Parser tool + code interpreter + human-inspectable intermediate results |
| Enterprise document production | Skill template + brand rules + render-and-verify loop |

## Overall Decision Table

Compressing the six questions above into one engineering decision table:

| Problem | Recommended Starting Point | When to Upgrade |
|---|---|---|
| Unstable function calling | Build a tool-call error taxonomy + focused eval | Consider alignment / fine-tuning when errors are concentrated in model behavior |
| Too many tools | Write good descriptions and namespaces first | Add retrieval only when 100+ tools and eval shows selection errors |
| Multi-step data processing | Use code interpreter / code-as-action | Add runtime enforcement when security, timeout, or file isolation needs arise |
| Long tasks losing the thread | ReAct + retry log | Introduce planner-first / hierarchical planning starting at 7-10+ steps |
| Skill system | description + SKILL.md + scripts/templates | Add verification + permission model when enabling third-party installation |
| Document generation | Programmatic library + render verify | Consider live session control when editing existing files is needed |

My own conclusion: CodeAct is the theoretical foundation of modern agent design, and Anthropic Skills is the productized form of this thinking. A truly useful agent does not wrap every capability into a JSON function -- it knows when to use a function call, when to write code, when to read a skill, and when to stop and ask a human.

If you are in the middle of an agent system refactor, these six sub-questions can serve as a roadmap: first build the function calling eval, then clean up tool/skill descriptions, then decide which tasks should go through the code interpreter, and only then discuss a skill marketplace or document generation automation. Reverse the order, and you easily end up with a beautiful demo that is painful in production.

## Changelog

- 2026-05-24: Restructured as a deep dive, added problem definitions, engineering decision table, reading order, and trade-off analysis for each approach.

## References

### Function Calling Reliability

- [ToolACE: Winning the Points of LLM Function Calling](https://arxiv.org/abs/2409.00920)
- [Reducing Tool Hallucination via Reliability Alignment](https://arxiv.org/abs/2412.04141)
- [CriticTool: Self-Critique Capabilities of Large Language Models](https://arxiv.org/abs/2506.13977)
- [Learning to Ask: When LLM Agents Meet Unclear Instruction](https://arxiv.org/abs/2409.00557)
- [Exploring Multi-Step and Constrained Function Calling under Long Context](https://arxiv.org/abs/2501.10132)

### Tool / Skill Selection

- [Tool Learning with Large Language Models: A Survey](https://arxiv.org/abs/2405.17935)
- [ToolRet: Benchmarking Tool Retrieval for Large Language Models](https://arxiv.org/abs/2503.01763)
- [Online-Optimized RAG for Tool Use and Function Calling](https://arxiv.org/abs/2509.20415)
- [Improving Tool Retrieval by Leveraging LLMs for Query Generation](https://arxiv.org/abs/2412.03573)
- [MassTool: Multi-Task Search-Based Tool Retrieval Framework](https://arxiv.org/abs/2507.00487)

### Code Interpreter / Code-as-Action

- [Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030)
- [A Survey on Code-Enhanced Reasoning and Reasoning-Driven Code Intelligence](https://arxiv.org/abs/2502.19411)
- [Customizable Runtime Enforcement for Safe and Reliable LLM Agents](https://arxiv.org/abs/2503.18666)

### Multi-step Tool Chaining / Planning

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- [ToolLLM: Facilitating Large Language Models to Master 16000+ Real-World APIs](https://arxiv.org/abs/2307.16789)
- [The Evolution of Tool Use in LLM Agents: From Single-Tool Call to Trajectories](https://arxiv.org/abs/2603.22862)
- [A Planner-Centric Framework for Complex Tool-Augmented LLM](https://arxiv.org/abs/2511.10037)
- [GoalAct: Global Planning and Hierarchical Execution](https://arxiv.org/abs/2504.16563)

### System Prompt / Skill Engineering

- [SoK: Agentic Skills — Beyond Tool Use in LLM Agents](https://arxiv.org/abs/2602.20867)
- [A Comprehensive Survey on Agent Skills: Taxonomy, Techniques](https://arxiv.org/abs/2605.07358)
- [Agent Skills for Large Language Models: Architecture, Acquisition](https://arxiv.org/abs/2602.12430)
- [Organizing, Orchestrating, and Benchmarking Agent Skills (AgentSkillOS)](https://arxiv.org/abs/2603.02176)
- [Many-Tier Instruction Hierarchy in LLM Agents](https://arxiv.org/abs/2604.09443)
- [Agent Skills Enable a New Class of Realistic and Trivially Simple Prompt Injection](https://arxiv.org/abs/2510.26328)
- [SkillJect: Skill-Based Prompt Injection](https://arxiv.org/abs/2602.14211)

### Presentation / Document Auto-generation

- [AutoPresent: Designing Structured Visuals from Scratch](https://arxiv.org/abs/2501.00912)
- [Generating and Evaluating Presentations Beyond Text-to-Slides](https://arxiv.org/abs/2501.03936)
- [Talk-to-Your-Slides: Efficient Slide Editing Agent](https://arxiv.org/abs/2505.11604)
- [SlideTailor: Personalized Presentation Slide Generation](https://arxiv.org/abs/2512.20292)
- [SpreadsheetLLM: Encoding Spreadsheets for Large Language Models](https://arxiv.org/abs/2407.09025)
- [Large Language Model for Table Processing: A Survey](https://arxiv.org/abs/2402.05121)

### Related Posts on This Site

- [Claude File Handling: The Three-Layer Architecture](/posts/ai/claude-file-handling-three-layers/)
- [System Prompts Leaks Archive](/posts/ai/system-prompts-leaks-archive/)
