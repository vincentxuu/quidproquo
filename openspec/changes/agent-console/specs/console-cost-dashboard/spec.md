## ADDED Requirements

### Requirement: Cost dashboard page

The console SHALL serve `/admin/console/dashboard` rendering cost-over-time charts broken down by `flow`, `policy`, and `user`. The page SHALL default to a 7-day window. Source data SHALL be the `provider_calls.cost_usd` column (per `provider-routing`) joined with `flow_runs.flow_id`, `flow_run_policies.policy_id`, and `console_audit_log.actor_user_id`.

#### Scenario: Dashboard renders 7-day cost chart

- **WHEN** an admin opens `/admin/console/dashboard` and `provider_calls` contains rows across the last 7 days totalling $42.00
- **THEN** the page SHALL render a time-series chart whose Y-axis totals across all series sum to `$42.00 ± $0.01` and whose X-axis spans the last 7 calendar days

### Requirement: Aggregation by flow, policy, user

The dashboard SHALL expose a "Group by" selector with options `flow`, `policy`, `user`. Switching the selector SHALL re-query the underlying data and SHALL re-render the chart with one series per distinct group value. The legend SHALL list every series with its summed cost over the active window.

#### Scenario: Group by flow shows per-flow series

- **WHEN** an admin selects "Group by: flow" on a window containing runs from flows `research` ($30) and `monitoring` ($12)
- **THEN** the chart SHALL render two series labelled `research` and `monitoring`, and the legend SHALL list `research $30.00` and `monitoring $12.00`

### Requirement: Daily, weekly, monthly period selector

The dashboard SHALL provide a period selector with options `daily`, `weekly`, `monthly`. The selection SHALL drive both the time bucket granularity of the chart and the active window size (daily → 7 days, weekly → 12 weeks, monthly → 12 months). The chart X-axis SHALL render bucket boundaries matching the selected granularity.

#### Scenario: Monthly period uses month buckets

- **WHEN** an admin selects `monthly`
- **THEN** the chart X-axis SHALL render 12 month buckets, each cost value SHALL be aggregated by calendar month, and the window SHALL span the trailing 12 months ending today

### Requirement: Pre-aggregated rollup with live last-24h overlay

The dashboard SHALL read pre-aggregated cost data from a `cost_rollups_daily` D1 table populated by a daily cron job, and SHALL overlay the most recent 24 hours from live `provider_calls` rows so the displayed total reflects current spend without waiting for the next rollup. The overlay region SHALL be visually distinguished (e.g. lighter shading) so users can tell live vs rolled-up data apart.

#### Scenario: Live overlay updates within minutes

- **WHEN** the last `cost_rollups_daily` row was written at 02:00 UTC and a new `provider_calls` row of `$0.50` lands at 14:00 UTC
- **THEN** the dashboard rendered at 14:05 UTC SHALL include the `$0.50` in the chart's last-24h overlay region and the overlay SHALL be visually distinguished from the pre-aggregated bars

### Requirement: Top N spenders panel

The dashboard SHALL render a "Top spenders" panel that, for the active window, lists the top 10 entities for each of three categories: flow, agent, user. Each row SHALL display the entity id, its total cost over the window, and its share of the window total as a percentage.

#### Scenario: Top spenders ranks by cost descending

- **WHEN** the active window contains agent costs `{ research: $50, summarize: $30, classify: $20 }`
- **THEN** the "Top agents" list SHALL render rows ordered `research $50.00 (50%)`, `summarize $30.00 (30%)`, `classify $20.00 (20%)`

### Requirement: Budget alerts against policy ceilings

For every flow run with a bound policy whose `budget.max_cost_usd` is set (per `policy-definition`), the dashboard SHALL render a "Budget alerts" feed listing runs whose cumulative cost has reached `>=80%` of the bound ceiling. Each alert row SHALL display the `flow_run_id`, current cost, ceiling, percentage consumed, and a link to the timeline page.

#### Scenario: Run at 85% of ceiling appears in alerts

- **WHEN** a flow run `R1` has cumulative cost `$8.50` and is bound to a policy with `budget.max_cost_usd=10`
- **THEN** the "Budget alerts" feed SHALL contain a row for `R1` showing `$8.50 / $10.00 (85%)` and SHALL link to `/admin/console/runs/R1`
