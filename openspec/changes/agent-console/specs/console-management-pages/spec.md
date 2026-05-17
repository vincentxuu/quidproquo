## ADDED Requirements

### Requirement: Flows CRUD page

The console SHALL serve `/admin/console/flows` listing every row in `flow_definitions` with its `id`, `name`, `latest_version`, `category`, and `updated_at`. The page SHALL provide actions to view (linking to `/admin/console/flows/{id}`), edit (linking to `/admin/console/flows/{id}/edit`), and create a new flow (opening a blank editor). Delete SHALL be a soft delete that sets `archived_at` and excludes the row from the default list.

#### Scenario: Flow list paginates 25 per page

- **WHEN** `flow_definitions` contains 60 non-archived rows and an admin opens `/admin/console/flows`
- **THEN** the page SHALL render 25 rows on page 1, the pagination control SHALL show 3 pages total, and navigating to page 2 SHALL render rows 26–50

### Requirement: Providers list with health

The console SHALL serve `/admin/console/providers` listing every registered provider with its `providerId`, `category`, current health state (`healthy` | `degraded` | `down`, per `provider-routing`), 1-minute success rate, and EWMA p50 latency. Health state SHALL be rendered as a colour badge — green for `healthy`, yellow for `degraded`, red for `down`.

#### Scenario: Health badge colour matches state

- **WHEN** provider `tavily` is in state `degraded` and `exa` is in state `down`
- **THEN** the provider list SHALL render a yellow badge for `tavily` and a red badge for `exa`, both with text matching the current state

### Requirement: Policies library page

The console SHALL serve `/admin/console/policies` listing every row in `policy_definitions` grouped by `id` with each row's `version`, `name`, and `created_at`. The three reference policies (`research-quick`, `research-standard`, `research-enterprise`, per `policy-definition`) SHALL render with a "Reference" tag so admins can distinguish them from custom policies.

#### Scenario: Library surfaces reference policies

- **WHEN** an admin opens `/admin/console/policies` after first boot
- **THEN** the page SHALL render at least three entries `research-quick`, `research-standard`, `research-enterprise` each tagged "Reference" and ordered alongside any custom policies by `id` ascending

### Requirement: Search and pagination across all management pages

Every management page (`/admin/console/flows`, `/admin/console/providers`, `/admin/console/policies`) SHALL expose a search input that filters the list by name or id substring (case-insensitive), and a pagination control rendering 25 rows per page. Search state and page number SHALL be reflected in the URL query string (`?q=...&page=N`) so views are deep-linkable.

#### Scenario: Search filters providers by id substring

- **WHEN** an admin types `tav` in the providers search box
- **THEN** the URL SHALL update to `?q=tav`, the list SHALL render only providers whose `providerId` contains `tav` (case-insensitive), and the pagination control SHALL recompute the page count against the filtered set
