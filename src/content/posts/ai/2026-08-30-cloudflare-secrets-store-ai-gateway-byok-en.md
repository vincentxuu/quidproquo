---
title: "How to Use Cloudflare Secrets Store: Worker Secret Reuse and AI Gateway BYOK"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, secrets-store, ai-gateway, workers, byok, security]
lang: en
tldr: "Secrets Store is Cloudflare's open beta account-level secret store, currently integrated with Workers and AI Gateway. It fits provider API keys, BYOK keys, and secrets reused across Workers; per-Worker secrets still work, but the governance scope is different."
description: "A practical guide to Cloudflare Secrets Store: account-level secrets, Workers bindings, local versus production behavior, permissions, AI Gateway BYOK, key aliases, and rotation."
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 11
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 24
---

> 🌏 [中文版](/posts/ai/2026-08-30-cloudflare-secrets-store-ai-gateway-byok)

AI apps quickly accumulate secrets: OpenAI keys, Anthropic keys, Gemini keys, webhook secrets, GitHub tokens, internal API tokens, and tenant-owned provider keys. If every Worker stores its own copy, rotation, permissions, environment separation, and audit become messy.

[Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/) is an account-level secret store. The official docs mark it as open beta. Secrets are encrypted and stored across Cloudflare data centers, and current integrations include [Workers](https://developers.cloudflare.com/secrets-store/integrations/workers/) and [AI Gateway BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/). This belongs in the AI Stack because provider keys and BYOK management become production concerns early.

From a security perspective, this is not only moving keys somewhere else. It moves creation, binding, access, rotation, revocation, and audit into one governance layer.

## Difference from Per-Worker Secrets

Cloudflare Workers already has Variables and Secrets for binding secrets to one Worker. Secrets Store differs because it is account-level and can be reused by multiple Workers or AI Gateway configuration.

| Type | Scope | Fit |
|---|---|---|
| Workers Variables and Secrets | per Worker | Secrets owned by one service |
| Secrets Store | account-level | Shared secrets, AI Gateway BYOK, centralized rotation |

If there is only one Worker and one webhook secret, per-Worker secrets are enough. When there are multiple Workers, staging and production environments, multiple AI providers, or AI Gateway-managed provider keys, Secrets Store becomes valuable.

## Workers Integration: Read Secrets through a Binding

Creating an account secret requires Super Administrator or Secrets Store Admin role. A Wrangler command looks like this:

```bash
npx wrangler secrets-store secret create <STORE_ID> \
  --name OPENAI_API_KEY \
  --scopes workers \
  --remote
```

Then bind it in Wrangler config:

```jsonc
{
  "secrets_store_secrets": [
    {
      "binding": "OPENAI_KEY",
      "store_id": "<STORE_ID>",
      "secret_name": "OPENAI_API_KEY"
    }
  ]
}
```

In Worker code, read the value with async `get()`:

```ts
export default {
  async fetch(request, env): Promise<Response> {
    const apiKey = await env.OPENAI_KEY.get();

    const response = await fetch("https://api.example.com/data", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response;
  },
} satisfies ExportedHandler;
```

Two boundaries matter. First, production secrets cannot be read from local development; local Secrets Store usage requires `secrets-store secret` commands without `--remote`. Second, permissions for creating secrets, deploying bindings, and reading secrets should be considered separately. The Workers integration docs say binding an account secret to a Worker requires Super Administrator or Secrets Store Deployer.

## AI Gateway BYOK: Stop Sending Provider Keys with Every Request

Secrets Store connects directly to AI Gateway. AI Gateway BYOK stores AI provider API keys in Secrets Store, so requests no longer need to include provider authorization headers.

Traditional request:

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai/chat/completions \
  -H "cf-aig-authorization: Bearer {CF_AIG_TOKEN}" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[]}'
```

With BYOK:

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai/chat/completions \
  -H "cf-aig-authorization: Bearer {CF_AIG_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[]}'
```

The provider key becomes part of gateway configuration. The application still sends `cf-aig-authorization`, but it no longer touches the OpenAI, Anthropic, or Gemini key directly. That reduces key exposure and makes rotation possible without changing code or redeploying the app.

AI Gateway also supports multiple keys for the same provider through aliases. The default alias is `default`; direct provider-passthrough requests can use `cf-aig-byok-alias` to choose another key. The docs note that Unified Billing endpoints only consult the `default` alias; if the `default` key is missing, the request falls through to Unified Billing.

## Naming and Rotation Need a Design

If a provider key is added through the dashboard, AI Gateway creates and names the Secrets Store secret automatically. If the API is used, the secret name must follow this format:

```txt
{gateway_id}_{provider_slug}_{alias}
```

For example:

```txt
my-gateway_anthropic_default
```

The docs also say AI Gateway runtime lookup does not use `secret_id`, so API-created secrets must follow the naming convention.

I would make rotation a fixed process:

1. Create the new provider key.
2. Update the key in Secrets Store or AI Gateway.
3. Run a gateway test request.
4. Check AI Gateway logs and metrics for error spikes.
5. Delete the old key.

Rotation should not mean one person manually editing a dashboard and hoping nothing breaks. Once an AI provider key is used by agent tools, browser automation, sandbox code, or webhooks, mistakes spread widely.

## Secret Layers in an AI App

I would split secrets like this:

- AI provider API keys: Secrets Store plus AI Gateway BYOK.
- Cloudflare AI Gateway auth token: Workers secret or Secrets Store, depending on whether it is reused.
- Tenant BYOK: needs tenant isolation, aliases, audit, and deletion flow; do not mix it into one default key.
- Webhook secrets: usually bound to a specific Worker or integration.
- Sandbox / Browser tool credentials: avoid putting them inside the sandbox when a Worker outbound handler can inject them.
- Non-sensitive config: Wrangler `vars`, not Secrets Store.

Secrets Store is about governance, not turning every variable into a secret. Putting non-sensitive config into a secret store makes deploys and debugging harder.

## Risk: Central Management Also Centralizes Blast Radius

Account-level secret reuse is convenient, and it also increases the impact of permission mistakes. Start with these rules:

- Secret names should not contain sensitive values.
- Scope secrets only to needed products, such as `workers`.
- Separate deployer permissions from secret admin permissions.
- Use different secrets for local, staging, and production.
- Never write secrets to logs, Analytics Engine, or R2 artifacts.
- When agent tools or sandboxes need an external API, first ask whether a Worker proxy can inject the credential.
- Keep a rotation and deletion runbook.

The docs also state that Secrets Store is unavailable in the Cloudflare China Network. If the product needs China Network deployment, this is an architecture constraint, not a last-minute deployment detail.

## How It Connects to AI Gateway and Agents

In the Cloudflare AI Stack, Secrets Store is rarely the first service added, but it becomes important early:

1. Workers AI can start without external provider keys.
2. AI Gateway with OpenAI, Anthropic, or Gemini introduces BYOK.
3. Agents with Browser, Sandbox, and MCP produce more tool credentials.
4. Multi-tenant or customer-owned keys turn secret isolation and audit into product features.

Secrets Store is not about letting the agent read more keys. It reduces key exposure and gives the app, gateway, and tooling a controlled way to access required capabilities.

## When I Would Wait

I would wait on Secrets Store when:

- There is only one Worker and one or two service secrets.
- AI Gateway BYOK is not in use.
- The team does not need role-separated secret administration.
- Local development is not organized, causing production and local secrets to blur.
- The product is not ready for rotation, revocation, audit, and tenant deletion.

Once an AI app uses multiple providers, multiple Workers, and multiple agent tools, Secrets Store moves from convenience to necessity. It moves secrets out of scattered environment variables and into the Cloudflare account governance layer.

## References

- [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/)
- [Secrets Store Workers integration](https://developers.cloudflare.com/secrets-store/integrations/workers/)
- [AI Gateway BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Workers Variables and Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Secrets Store access control](https://developers.cloudflare.com/secrets-store/access-control/)
