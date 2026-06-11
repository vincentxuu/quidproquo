---
title: "Claude Certified Architect Foundations Exam Complete Guide"
date: 2026-03-20
type: guide
category: ai
tags: [claude, certification, agentic-ai, mcp, prompt-engineering, claude-code, agent-sdk]
lang: en
tldr: "A complete study guide for Claude's official architect certification: five exam domains, six scenario types, common anti-patterns, and hands-on preparation strategies."
description: "A comprehensive guide to the Claude Certified Architect — Foundations exam, covering all Task Statements across five domains, six scenario question patterns, real exam question analysis, and actionable study strategies."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)

The Claude Certified Architect — Foundations exam tests your practical design ability for agentic systems. All questions are scenario-based multiple choice with a single correct answer, requiring you to make the right architectural decisions in concrete production scenarios. This article covers all key exam domains, common pitfalls, and the most effective preparation approaches.

## Exam Structure

**Five Domains and Their Weights:**

| Domain | Weight |
|--------|--------|
| Domain 1: Agentic Architecture & Orchestration | 27% |
| Domain 2: Tool Design & MCP Integration | 18% |
| Domain 3: Claude Code Configuration & Workflows | 20% |
| Domain 4: Prompt Engineering & Structured Output | 20% |
| Domain 5: Context Management & Reliability | 15% |

Scores range from 100–1000, with a passing threshold of 720. All multiple choice — no penalty for wrong answers.

**Six Scenario Questions (exam randomly selects four):**

1. **Customer Support Resolution Agent** — Using the Claude Agent SDK to handle refunds, account issues, and customer escalations
2. **Code Generation with Claude Code** — Integrating Claude Code into team development workflows
3. **Multi-Agent Research System** — Multiple subagents collaborating on research reports
4. **Developer Productivity with Claude** — Helping engineers explore unfamiliar codebases
5. **Claude Code for CI/CD** — Automating code review and PR feedback
6. **Structured Data Extraction** — Extracting JSON data from unstructured documents

---

## Domain 1 — Agentic Architecture & Orchestration (27%)

This domain tests multi-agent system design. The focus is not just on "calling subagents" but on "how to design reliable orchestration flows."

### Correct Termination Conditions for Agentic Loops

The most commonly tested anti-pattern: do not parse natural language text to determine whether the loop should end — rely on `stop_reason` instead.

```python
while True:
    response = client.messages.create(...)

    if response.stop_reason == "end_turn":
        break  # ✅ Correct: terminate based on stop_reason
    elif response.stop_reason == "tool_use":
        # Execute tools, append results back to conversation history
        tool_results = execute_tools(response.content)
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
```

**Anti-patterns:**
- Parsing assistant response text to determine "whether it's done"
- Using a fixed iteration count as the primary termination condition
- Not appending tool results back to conversation history

### Hub-and-Spoke Architecture for Multi-Agent Systems

The coordinator handles all subagent communication, error handling, and information routing. **Subagents do not automatically inherit the coordinator's conversation history** — you must explicitly pass the required context in the prompt.

You need to add `"Task"` to the coordinator's `allowedTools` to enable calling subagents:

```python
coordinator = Agent(
    allowed_tools=["Task", "search_web"],  # Must include Task
    system_prompt="Analyze the query and delegate to appropriate subagents..."
)
```

To execute subagents in parallel: issue multiple Task tool calls within a single coordinator response, rather than across multiple turns.

### Workflow Enforcement vs. Prompt Instructions

This is the most important concept in this domain: **when a tool call ordering is a business logic requirement, enforce it in code — don't just rely on prompts.**

For example: you must verify customer identity before processing a refund. If you only say "please call get_customer first" in the prompt, there's a chance Claude will skip that step. Instead, use code to check in `lookup_order` and `process_refund` hooks whether `get_customer` has already been executed.

### Session Management

- `--resume <session-name>`: continue a named session
- `fork_session`: branch into two exploration paths from the same analysis base, without affecting each other
- Session resumption is suitable when "most of the context is still valid"; if tool results are stale, use a new session + inject a summary instead

---

## Domain 2 — Tool Design & MCP Integration (18%)

### Tool Descriptions Determine Tool Selection Reliability

The LLM's primary basis for selecting tools is the `description`. Descriptions that are too brief (e.g., "Retrieves customer information") lead to incorrect tool calls.

Good tool descriptions include:
- What the tool does (specific, not vague)
- Expected input format and examples
- Boundary conditions (when to use this vs. another tool)
- Output format description

```python
{
  "name": "lookup_order",
  "description": (
    "Look up order details using an order ID (format: ORD-XXXXXX) or order number. "
    "Use this when the customer provides an order reference. "
    "Do NOT use this for customer account lookup — use get_customer for that. "
    "Returns order status, items, shipping info, and timestamps."
  )
}
```

### Structured Error Responses

Tool error responses should provide enough information for the agent to make correct recovery decisions:

```python
# ❌ Poor error response
{"error": "Operation failed"}

# ✅ Good error response
{
  "isError": True,
  "errorCategory": "transient",  # transient / validation / permission / business
  "isRetryable": True,
  "description": "Payment service timeout after 3 attempts",
  "attemptedAction": "process_refund for order ORD-12345"
}
```

`transient` errors can be retried; `business` errors (e.g., refund exceeds policy limit) should not be retried — they should be escalated to a human.

### Tool Count Affects Selection Quality

Giving an agent 18 tools has much lower selection reliability than giving it 4-5 relevant tools. Principle: each subagent should only receive the tools it needs for its role. A synthesis agent doesn't need web search tools.

### MCP Server Configuration

| Level | Location | Purpose |
|-------|----------|---------|
| Project level | `.mcp.json` | Team-shared tools (version controlled) |
| User level | `~/.claude.json` | Personal experimental tools |

Inject credentials via environment variables — never hardcode them:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**MCP Resources vs. MCP Tools**: Resources are suitable for exposing content catalogs (issue lists, document indexes, schemas); Tools are suitable for executing actions. Leveraging Resources effectively can reduce unnecessary exploratory tool calls.

---

## Domain 3 — Claude Code Configuration & Workflows (20%)

### CLAUDE.md Hierarchy

```
~/.claude/CLAUDE.md            # User level (not version controlled, not shared with team)
CLAUDE.md / .claude/CLAUDE.md  # Project level (version controlled, shared across team)
src/api/CLAUDE.md              # Directory level (only loaded when working in that directory)
```

Common mistake: putting team-wide conventions in `~/.claude/CLAUDE.md`, causing new team members to miss them.

Use `@import` to keep CLAUDE.md modular:

```markdown
@import ./docs/api-conventions.md
@import ./docs/testing-standards.md
```

Or use the `.claude/rules/` directory with YAML frontmatter for path-conditional loading:

```yaml
---
paths: ["src/api/**/*"]
---
# API Layer Conventions
All handlers must use async/await, errors must use the AppError class...
```

The advantage of glob patterns: applying conventions across directories (e.g., all `**/*.test.tsx` files follow the same testing conventions, regardless of subdirectory).

### Slash Commands and Skills

**Commands** (`.claude/commands/`): Pure prompt templates, suitable for fixed task workflows.

**Skills** (`.claude/skills/`): Have frontmatter configuration, more powerful:

```markdown
---
context: fork          # Run in an isolated sub-agent, doesn't pollute main session
allowed-tools: Read,Grep,Glob  # Restrict available tools
argument-hint: "PR number to review"
---

Review PR #$ARGUMENTS...
```

`context: fork` is an important option: for tasks like codebase analysis that produce lots of verbose output, run it in a fork and only return the summary to the main session.

### Plan Mode vs. Direct Execution

| Use Plan Mode | Use Direct Execution |
|---------------|---------------------|
| Large-scale architectural changes (45+ files) | Single-file bug fix |
| Multiple viable approaches need evaluation | Known solution, clear scope |
| Library migration | Adding input validation |
| Microservice refactoring | Fixing a bug from a stack trace |

### CI/CD Integration

Use the `-p` flag for non-interactive mode, plus `--output-format json` for machine-readable output:

```yaml
- name: Code Review
  run: |
    claude -p "Review the changed files for bugs and security issues.
    Previous review findings: $(cat .claude/prior-review.json)
    Only report new or unaddressed issues." \
    --output-format json \
    --json-schema review-schema.json > review-results.json
```

Note: **having the same Claude session review code it wrote itself is less effective** — it retains the reasoning context from generation and is less likely to question its own decisions. Use an independent review instance.

---

## Domain 4 — Prompt Engineering & Structured Output (20%)

### Explicit Criteria Beat Vague Instructions

"Only report high-confidence issues" or "be conservative" won't reduce false positive rates. You need explicit definitions:

```
Review criteria:
- REPORT: Logic errors, null pointer dereferences, SQL injection, missing auth checks
- SKIP: Minor style issues, local variable naming, comment formatting
- REPORT as HIGH: Any issue that could lead to data loss or security breach
- REPORT as MEDIUM: Logic errors that affect correctness but not security
```

### Use Cases for Few-Shot Examples

Few-shot examples are most effective when:
- Tool selection is error-prone in ambiguous scenarios — add examples demonstrating correct choices
- You want a specific output format — 2-3 complete examples are more effective than describing the format
- Document structures vary widely (some use inline citations, some use bibliographies) — provide one example for each structure type

### Structured Output via tool_use

The most reliable method for structured output: use `tool_use` + JSON schema, rather than asking Claude to output a JSON string.

```python
tools = [{
    "name": "extract_invoice",
    "description": "Extract structured data from invoice",
    "input_schema": {
        "type": "object",
        "properties": {
            "invoice_number": {"type": "string"},
            "total_amount": {"type": "number"},
            "line_items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "amount": {"type": ["number", "null"]}  # nullable
                    }
                }
            },
            "payment_status": {
                "type": "string",
                "enum": ["paid", "pending", "overdue", "other"],
            },
            "payment_status_detail": {  # Used with "other"
                "type": ["string", "null"]
            }
        },
        "required": ["invoice_number", "total_amount"]
    }
}]

response = client.messages.create(
    tools=tools,
    tool_choice={"type": "any"}  # Guarantees Claude will call a tool
)
```

**Three `tool_choice` options:**
- `"auto"`: Claude decides whether to use a tool (may return plain text)
- `"any"`: Must call some tool, but chooses which one
- `{"type": "tool", "name": "extract_metadata"}`: Forces a specific tool call

**Important:** `tool_use` eliminates JSON syntax errors but does not eliminate semantic errors (e.g., line items don't add up to the total). Semantic validation must be implemented separately.

### Validation-Retry Loop

```python
for attempt in range(3):
    result = extract_with_claude(document)
    errors = validate(result)

    if not errors:
        break

    # Tell Claude the specific errors so it can correct them
    document = f"""
    Original document: {document}
    Previous extraction: {result}
    Validation errors: {errors}
    Please fix these specific issues.
    """
```

Note: if the information simply isn't in the document, retrying won't help. First determine whether it's a "format error" or "data doesn't exist."

### Message Batches API

50% cost savings, but up to 24-hour processing time with no latency SLA.

| Suitable For | Not Suitable For |
|-------------|-----------------|
| Overnight batch reports | Pre-merge checks (developers waiting for results) |
| Weekly tech debt analysis | Any blocking workflow |
| Large-scale document batch processing | Workflows requiring multi-turn tool calling |

---

## Domain 5 — Context Management & Reliability (15%)

### Avoiding Lost-in-the-Middle

Models pay the most attention to the beginning and end of input — the middle is easily overlooked. When integrating results from multiple subagents:

- Place key summaries at the very beginning
- Use clear section headers to separate detailed content from each source
- Don't directly concatenate the full output from 15 subagents

### Preserve Critical Facts — Don't Summarize Them

In customer support scenarios, factual data like dates, amounts, order numbers, and statuses should not be summarized away:

```python
# Attach a structured facts block in every prompt
case_facts = {
    "customer_id": "C-78901",
    "order_id": "ORD-45623",
    "refund_amount": 89.99,
    "order_date": "2026-02-14",
    "stated_issue": "item never arrived"
}

prompt = f"""
Case Facts (do not summarize these):
{json.dumps(case_facts, indent=2)}

Conversation summary:
{compressed_history}

Customer: {latest_message}
"""
```

### Provenance (Source Traceability)

The most important design principle for multi-source synthesis: **every claim must be accompanied by its source.**

Subagent output format should be:

```json
{
  "findings": [
    {
      "claim": "Market size is projected to reach $2.3B by 2026",
      "source_url": "https://example-report.com/2025",
      "source_name": "Industry Report 2025",
      "publication_date": "2025-11-01",
      "excerpt": "The market is projected to reach $2.3B by 2026..."
    }
  ]
}
```

When numbers from two sources conflict, **don't pick one — preserve both and annotate the sources**, letting report readers judge for themselves.

### Correct Escalation Triggers

| Should Escalate | Should Not Escalate |
|----------------|-------------------|
| Customer explicitly requests a human | Case is complex (but solvable) |
| Scenario not covered by policy | Customer has a bad tone |
| Unable to make progress | Claude self-assesses "low confidence" |

Customer requests a human — escalate immediately, don't try to solve it first. Policy exception (e.g., cross-brand price matching, but the policy only covers your own website) — escalate.

### Context Management for Large Codebase Exploration

Long session contexts "degrade": Claude starts giving vague responses like "based on general patterns" instead of referencing your codebase.

Solutions:
- Use `/compact` to compress context (Claude Code command)
- Save key findings to a scratchpad file, load it before the next query
- Use subagents for exploration, only return summaries to the main session

For crash recovery, use the manifest pattern: each agent exports its state to a fixed path, and the coordinator loads the manifest on restart to continue.

---

## Common Exam Pitfalls

These concepts appear repeatedly in sample questions:

**"Fix the prompt first" is not always the correct answer.** When business logic requires 100% guarantee of a specific ordering, the answer is "enforce it in code," not "add more instructions to the prompt."

**Tool descriptions are the foundation of tool selection.** The root cause of incorrect tool selection is usually an unclear description, not the need for a routing classifier.

**Message Batches API is not suitable for blocking workflows.** This option is almost always wrong whenever the scenario involves someone waiting for results.

**Self-review is inferior to an independent review instance.** Having the same session review its own output performs poorly because it remembers its own reasoning process.

**Not every complex situation should be escalated.** Escalation triggers are: the customer explicitly requests it, policy cannot cover the case, or no progress can be made — not "it feels complex."

---

## Study Strategies

**The most effective preparation is hands-on practice, not reading documentation.** The official exam guide lists four practice exercises, each directly corresponding to a real domain:

1. **Build a Multi-Tool Agent with Escalation Logic**: After completing this, you'll understand agentic loops, hooks, and structured error handling
2. **Configure Claude Code for a Team Development Workflow**: CLAUDE.md hierarchy, path-scoped rules, skills
3. **Build a Structured Data Extraction Pipeline**: tool_use + JSON schema, validation retry, batch processing
4. **Design and Debug a Multi-Agent Research Pipeline**: coordinator design, parallel subagents, provenance tracking

**Quick Checklist:**

- [ ] Can correctly implement an agentic loop using `stop_reason` and identify anti-patterns
- [ ] Knows that subagents need explicit context passing and won't auto-inherit it
- [ ] Can write tool descriptions that clearly differentiate similar tools
- [ ] Can design structured error responses with `errorCategory` and `isRetryable`
- [ ] Can configure `.mcp.json` with environment variables for credential management
- [ ] Can explain the differences and purposes of the three CLAUDE.md hierarchy levels
- [ ] Knows what `context: fork` is and when to use it
- [ ] Can distinguish when to use plan mode vs. direct execution
- [ ] Knows the differences between `tool_choice: "auto"` / `"any"` / forced
- [ ] Can explain the limitations and use cases of the Message Batches API
- [ ] Knows the correct escalation triggers (not "it feels complex")
- [ ] Can design a multi-source synthesis structure that preserves provenance

---

## References

- [Claude Certified Architect — Foundations Exam Portal](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)
- [Claude Official Documentation](https://docs.anthropic.com/)
- [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Model Context Protocol (MCP) Official Documentation](https://modelcontextprotocol.io/)
- [Claude Code Official Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Anthropic Cookbook (Implementation Examples)](https://github.com/anthropics/anthropic-cookbook)
