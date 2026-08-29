# Admin GitHub App Runbook

This runbook records how `/admin` connects GitHub repositories for agent sessions.

## Product Model

Claude does not ask each user for a GitHub App ID or private key because Anthropic operates its own GitHub App. Users only authorize that app against selected repositories. The equivalent shape for quidproquo is:

1. quidproquo operates one GitHub App.
2. Production stores the app credentials as Worker secrets.
3. Admin users install the app on their GitHub account or organization.
4. GitHub redirects back to `/admin/settings/github` with `installation_id`.
5. `/admin/settings/github` automatically syncs installed repositories into D1 and clears the install query string.
6. `/admin` lists those repositories in the composer repo picker.
7. Private repository checkout uses short-lived installation tokens generated server-side.

Do not expose the GitHub App private key in the browser. Do not store it in committed files.

## Current Implementation

- Composer UI: `/admin`
- GitHub settings UI: `/admin/settings/github`
- Repo list API: `GET /api/admin/repos`
- GitHub App status API: `GET /api/admin/github-app/status`
- GitHub App sync API: `POST /api/admin/github-app/sync`
- Repository registry migration: `migrations/0033_github_app_repos.sql`
- GitHub App client: `src/lib/github/app.ts`

The sandbox checkout path is wired through `AgentSessionDO`, but it only provisions a real sandbox runner when the Worker environment has a `SANDBOX` binding.

## Required GitHub App Values

Set these as production Worker secrets:

- `GITHUB_APP_ID`: the app ID shown on the GitHub App settings page.
- `GITHUB_APP_SLUG`: the slug from the app URL. For `https://github.com/apps/quidproquo-agent`, the slug is `quidproquo-agent`.
- `GITHUB_APP_PRIVATE_KEY`: the full PEM private key downloaded from the GitHub App settings page.

Only the deploy/operator needs to set these. Regular admin users should only install or sync the app through UI.

## Minimum Permissions

For repository selection and read-only checkout:

- Repository permissions:
  - `Contents: Read-only`
  - `Metadata: Read-only`

For future agent edits, commits, and pull requests:

- Repository permissions:
  - `Contents: Read and write`
  - `Pull requests: Read and write`
  - `Metadata: Read-only`

Start with the minimum permission set. Expanding permissions later requires installed accounts to approve the updated app permissions.

## Setup Flow

1. In GitHub, open `Settings -> Developer settings -> GitHub Apps`.
2. Create or edit the quidproquo GitHub App.
3. Fill the GitHub App registration fields:

   ```text
   Homepage URL:
   https://quidproquo.cc/admin/settings/github

   Redirect URI:
   Leave empty. The current repo sync flow does not use OAuth callbacks.

   Webhook:
   Disable webhooks if GitHub allows it.
   If GitHub requires a URL, use https://quidproquo.cc/api/admin/webhooks/github
   ```

   If GitHub shows a separate Setup URL field, set it to `https://quidproquo.cc/admin/settings/github` as well. The webhook endpoint is for future routine triggers. Repository sync and repo picker access do not depend on it.

4. Set repository permissions to at least `Contents: Read-only` and `Metadata: Read-only`.
5. Generate a private key and download the PEM file.
6. Apply the D1 migration:

   ```sh
   pnpm wrangler d1 migrations apply <database-name> --remote
   ```

7. Set Worker secrets:

   ```sh
   pnpm wrangler secret put GITHUB_APP_ID
   pnpm wrangler secret put GITHUB_APP_SLUG
   pnpm wrangler secret put GITHUB_APP_PRIVATE_KEY
   ```

8. Deploy the Worker.
9. Open `/admin/settings/github`.
10. Install the GitHub App on the target account or organization.
11. GitHub should redirect back to `/admin/settings/github?installation_id=...&setup_action=install`.
12. The settings page automatically syncs repositories and then removes the install query string from the URL.
13. Confirm `/admin` shows the installed repositories in the repo picker.

## Security Notes

- Treat `GITHUB_APP_PRIVATE_KEY` as production secret material.
- Rotate the private key if it is copied into chat, logs, local notes, screenshots, or committed files.
- Prefer installation tokens over personal access tokens for private repo checkout.
- Installation tokens are short-lived and scoped to the installed repositories and granted app permissions.
- If organization repositories do not appear, check whether the organization requires SSO or app approval.

## References

- [Authenticating as a GitHub App](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app)
- [Managing private keys for GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps)
- [Choosing permissions for a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app)
- [Claude GitHub integration](https://support.claude.com/en/articles/10167454-use-the-github-integration)
