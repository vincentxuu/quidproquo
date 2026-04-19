## ADDED Requirements

### Requirement: Capability dimensions coverage
The reference architecture SHALL define exactly 39 capability dimensions organized into 3 categories:
- Harness Engineering: 23 dimensions (A1-A23)
- Context Engineering: 10 dimensions (B1-B10)
- Prompt Engineering: 6 dimensions (C1-C6)

#### Scenario: All Harness Engineering dimensions present
- **WHEN** a user reads architecture.md
- **THEN** the document SHALL contain dimensions A1 through A23: Hooks/Lifecycle, Permission Model, Tool System, Configuration Layering, Error Handling & Resilience, Multi-Model Support, Operational Modes, Background Execution, Skill/Plugin System, Agent Dispatch, Output Control, Planning & Task Management, MCP Integration, Security & Privacy, Observability & Cost Tracking, IDE & External Integration, Command System, SDK/Programmatic API, Concurrency Management, Version Migration, File Operation Safety, Sandbox Execution Environment, Computer Use

#### Scenario: All Context Engineering dimensions present
- **WHEN** a user reads architecture.md
- **THEN** the document SHALL contain dimensions B1 through B10: Context Assembly Pipeline, Instruction Layering & Merging, Memory System, Conversation History Management, Token Budget & Allocation, Dynamic Injection, Information Retrieval Strategy, Multimodal Input, Context Eviction & Compression, Cache Strategy

#### Scenario: All Prompt Engineering dimensions present
- **WHEN** a user reads architecture.md
- **THEN** the document SHALL contain dimensions C1 through C6: Instruction Writing Patterns, Tool Description Quality, Few-Shot & Example Design, Reasoning & Thinking Guidance, Guardrails & Boundary Control, Tone Style & User Adaptation

### Requirement: Dimension structure for Harness and Context categories
Each dimension in categories A and B SHALL contain: a Why section, a Claude Code Reference section with specific implementation details, and Maturity Levels from 0 (absent) to 5 (production-grade).

#### Scenario: Dimension with complete structure
- **WHEN** a user reads any dimension in category A or B
- **THEN** it SHALL have a "Why" paragraph explaining the importance, a "Claude Code Reference" section citing specific mechanisms/files, and 6 maturity levels (0-5) each with a concrete observable description

#### Scenario: Maturity levels are objectively measurable
- **WHEN** a user reads a maturity level description
- **THEN** the description SHALL describe an observable condition (e.g., "Has 3+ hook event types") not a subjective quality (e.g., "Has good hook support")

### Requirement: Dimension structure for Prompt Engineering category
Each dimension in category C SHALL contain: a Why section, a Claude Code Reference section with specific examples quoted from actual prompts, and qualitative evaluation guidance (What Good Looks Like, What Bad Looks Like).

#### Scenario: Prompt dimension with examples
- **WHEN** a user reads any dimension in category C
- **THEN** it SHALL include concrete examples from Claude Code's actual prompt text demonstrating the pattern

### Requirement: Detection signals file
A signals.yaml file SHALL exist alongside architecture.md, providing machine-readable detection signals per dimension.

#### Scenario: Structural dimension signals (A and B categories)
- **WHEN** the skill reads signals for a Harness or Context dimension
- **THEN** signals.yaml SHALL provide file_signals (glob patterns), code_signals (regex patterns with weight and description), and optionally absence_signals (patterns indicating missing abstraction)

#### Scenario: Prompt dimension signals (C category)
- **WHEN** the skill reads signals for a Prompt Engineering dimension
- **THEN** signals.yaml SHALL provide files_to_read (glob patterns for prompt files) and evaluation_criteria (list of questions for semantic evaluation)

#### Scenario: Multi-language signal coverage
- **WHEN** signals are defined for any dimension
- **THEN** code_signals SHALL include patterns for both TypeScript and Python conventions where applicable

### Requirement: Reference derived from Claude Code source
All dimension content (reference implementations, maturity levels, signals) SHALL be derived from analysis of the actual Claude Code source at `/Users/xiaoxu/Projects/claude-code-source`, not from generic knowledge.

#### Scenario: Verifiable reference details
- **WHEN** a dimension cites a Claude Code mechanism
- **THEN** the cited mechanism SHALL exist in the claude-code-source codebase with matching file paths or function names
