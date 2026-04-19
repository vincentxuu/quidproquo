## ADDED Requirements

### Requirement: Skill invocation
The skill SHALL be invocable as `/agent-diff` in any Claude Code session and SHALL analyze the project in the current working directory.

#### Scenario: Basic invocation
- **WHEN** a user runs `/agent-diff` in a project directory
- **THEN** the skill SHALL read the reference files, scan the project, and produce a gap report

#### Scenario: Reference files not found
- **WHEN** a user runs `/agent-diff` and the reference files do not exist at the expected path
- **THEN** the skill SHALL display an error message with the expected file locations

### Requirement: Parallel subagent scanning
The skill SHALL dispatch 6 parallel subagents to scan the target project, grouped by dimension subset.

#### Scenario: Subagent grouping
- **WHEN** the skill dispatches subagents
- **THEN** it SHALL create exactly 6 subagents: Harness A1-A8, Harness A9-A16, Harness A17-A23, Context B1-B5, Context B6-B10, Prompt C1-C6

#### Scenario: Parallel execution
- **WHEN** the skill dispatches subagents
- **THEN** all 6 subagents SHALL be dispatched in a single message (parallel, not sequential)

### Requirement: Structural scanning (A and B categories)
Subagents scanning Harness and Context dimensions SHALL use file_signals and code_signals from signals.yaml to find evidence.

#### Scenario: File signal scanning
- **WHEN** a subagent scans for a dimension
- **THEN** it SHALL use Glob to search for files matching the file_signals patterns

#### Scenario: Code signal scanning
- **WHEN** a subagent finds relevant files via file_signals
- **THEN** it SHALL use Grep with code_signals patterns to find specific evidence within those files

#### Scenario: Absence signal detection
- **WHEN** a subagent finds no positive signals for a dimension but finds absence_signals matches
- **THEN** it SHALL report the absence evidence as indication of missing abstraction

### Requirement: Semantic evaluation (C category)
The Prompt Engineering subagent SHALL read actual prompt/instruction files and evaluate quality using evaluation_criteria questions.

#### Scenario: Prompt file discovery
- **WHEN** the prompt subagent starts scanning
- **THEN** it SHALL use Glob with files_to_read patterns to find all prompt and instruction files

#### Scenario: Quality evaluation
- **WHEN** the prompt subagent reads prompt files
- **THEN** it SHALL evaluate each file against the evaluation_criteria questions and cite specific evidence (quotes, line numbers)

### Requirement: Scoring
Each dimension SHALL receive a score from 0 to 5 based on evidence found.

#### Scenario: Score assignment with evidence
- **WHEN** a subagent scores a dimension
- **THEN** the score SHALL be accompanied by: specific file paths where evidence was found, code snippets or quotes demonstrating the capability, and identification of what is missing for a higher score

#### Scenario: Zero score
- **WHEN** no evidence is found for a dimension
- **THEN** the score SHALL be 0 and the report SHALL note "Not implemented" with suggested first steps

### Requirement: Report generation
The skill SHALL produce a Markdown report saved to `agent-diff-report.md` in the target project directory.

#### Scenario: Report structure
- **WHEN** the report is generated
- **THEN** it SHALL contain: a summary table (category scores and percentages), top gaps ranked by impact, detailed analysis per dimension (score, status, evidence, action plan, effort estimate), and a prioritized action plan table

#### Scenario: Summary table
- **WHEN** the report summary is rendered
- **THEN** it SHALL show per-category scores (Harness /115, Context /50, Prompt /30) and overall score /195 with percentages

#### Scenario: Action plan priority
- **WHEN** the action plan is generated
- **THEN** dimensions SHALL be sorted by impact (high-impact gaps first), with effort estimates (Low/Medium/High) and concrete next steps

### Requirement: Report persistence
The skill SHALL save the report for historical tracking.

#### Scenario: Report saved to project
- **WHEN** the analysis completes
- **THEN** the report SHALL be written to `agent-diff-report.md` in the current working directory

#### Scenario: Date stamping
- **WHEN** the report is generated
- **THEN** it SHALL include the analysis date and target project path in the header
