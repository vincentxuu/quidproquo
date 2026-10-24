#!/usr/bin/env node
/** Configure only the dedicated personal Access application; no Worker deployment. */
import { pathToFileURL } from 'node:url';

const ACCOUNT = '1ff43f0d4c3ad3bd98ce5ab767546a68';
const NAME = 'QuidProQuo Personal';
const POLICY = 'Personal owner';
const DEFAULT_EMAIL = 'vincent.xu.work@gmail.com';
const PATHS = ['/vocabulary', '/en/vocabulary', '/api/vocabulary', '/auth', '/admin', '/api/admin', '/api/personal', '/api/deep-research', '/account', '/api/auth/logout'];
const ADMIN_MACHINE_PATHS = ['/api/admin/webhooks/github', '/api/admin/webhooks/discord-interactions', '/api/admin/sessions/runner/ws', '/api/admin/sessions/scheduled', '/api/admin/site/pipelines/scheduled', '/api/admin/routines/*/fire'];
const HOSTS = ['quidproquo.cc', 'www.quidproquo.cc'];
const SCOPES = ['Access: Apps and Policies Write', 'Access: Organizations, Identity Providers, and Groups Read'];

export function parseOptions(args) {
  let apply = false;
  let dryRun = false;
  let email = DEFAULT_EMAIL;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--apply') apply = true;
    else if (args[i] === '--dry-run') dryRun = true;
    else if (args[i] === '--email') email = args[++i] ?? '';
    else throw new Error(`Unknown option: ${args[i]}`);
  }
  if (apply && dryRun) throw new Error('Choose --apply or --dry-run, not both.');
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(email) || email.length > 254) {
    throw new Error('--email must be a valid individual email address.');
  }
  return { apply, email: email.toLowerCase() };
}

export function desiredApplication(email, otpId, policyId) {
  return {
    name: NAME,
    domain: 'quidproquo.cc/vocabulary',
    type: 'self_hosted',
    session_duration: '24h',
    app_launcher_visible: false,
    auto_redirect_to_identity: true,
    allowed_idps: [otpId],
    destinations: HOSTS.flatMap((host) => PATHS.map((path) => ({ type: 'public', uri: `${host}${path}`, ...(path === '/api/admin' ? { overrides: ADMIN_MACHINE_PATHS.map(path_pattern => ({ behavior: 'public', path_pattern })) } : {}) }))),
    policies: [{
      ...(policyId ? { id: policyId } : {}),
      name: POLICY,
      decision: 'allow',
      precedence: 1,
      include: [{ email: { email } }],
      exclude: [],
      require: [],
    }],
  };
}

function sameManagedFields(actual, desired) {
  const fields = ['name', 'domain', 'type', 'session_duration', 'app_launcher_visible', 'auto_redirect_to_identity'];
  if (fields.some((key) => actual[key] !== desired[key])) return false;
  if (JSON.stringify([...(actual.allowed_idps ?? [])].sort()) !== JSON.stringify([...desired.allowed_idps].sort())) return false;
  const destinations = (value) => (value ?? []).map((d) => `${d.type ?? 'public'}:${d.uri}:${JSON.stringify(d.overrides ?? [])}`).sort();
  if (JSON.stringify(destinations(actual.destinations)) !== JSON.stringify(destinations(desired.destinations))) return false;
  const policy = actual.policies?.[0];
  const target = desired.policies[0];
  return actual.policies?.length === 1 && policy?.name === POLICY && policy.decision === 'allow'
    && policy.precedence === 1 && JSON.stringify(policy.include) === JSON.stringify(target.include)
    && !(policy.exclude?.length) && !(policy.require?.length) && !policy.approval_required
    && !policy.isolation_required && !policy.purpose_justification_required;
}

export async function configure({ apply, email }, token, fetcher = fetch, output = console.log) {
  if (!token) {
    if (apply) throw new Error('CLOUDFLARE_API_TOKEN is required for --apply. Wrangler OAuth is not used.');
    output(JSON.stringify({ mode: 'offline dry-run; no API calls or mutations', account: ACCOUNT, requiredScopes: SCOPES,
      application: desiredApplication(email, '<existing onetimepin IdP ID>'),
      pending: ['Read organization team domain, applications and identity providers.', 'Require an existing One-time PIN identity provider.', 'Review authenticated dry-run before --apply.'],
    }, null, 2));
    return;
  }
  const base = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/access`;
  async function request(path, method = 'GET', body) {
    const response = await fetcher(`${base}${path}`, {
      method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30_000),
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || json?.success !== true) {
      // Never log response bodies, provider configuration, token, or request headers.
      const codes = json?.errors?.map((error) => error.code).filter(Number.isFinite).join(',') || 'unknown';
      throw new Error(`Cloudflare ${method} ${path.split('?')[0]} failed: HTTP ${response.status}; codes ${codes}. Check token scopes/account and Zero Trust setup.`);
    }
    return json;
  }
  async function list(path) {
    const all = [];
    for (let page = 1; page <= 100; page += 1) {
      const result = await request(`${path}?page=${page}&per_page=100`);
      if (!Array.isArray(result.result)) throw new Error(`Unexpected list response: ${path}`);
      all.push(...result.result);
      if (page >= (result.result_info?.total_pages ?? 1)) return all;
    }
    throw new Error(`Refusing incomplete inventory: ${path} exceeds pagination limit.`);
  }
  const organization = (await request('/organizations')).result;
  const teamDomain = organization?.auth_domain;
  if (typeof teamDomain !== 'string' || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(teamDomain)) {
    throw new Error('Existing Zero Trust organization with a valid auth_domain is required; no organization will be created.');
  }
  const apps = await list('/apps');
  const idps = await list('/identity_providers');
  const otp = idps.filter((idp) => idp.type === 'onetimepin' && typeof idp.id === 'string');
  if (otp.length !== 1) throw new Error('Exactly one existing One-time PIN identity provider is required. Configure it in Zero Trust > Settings > Authentication; this script does not modify identity providers.');
  const matches = apps.filter((app) => app.name === NAME);
  if (matches.length > 1) throw new Error(`Multiple applications named ${NAME}; resolve manually before continuing.`);
  const existing = matches.length ? (await request(`/apps/${encodeURIComponent(matches[0].id)}`)).result : undefined;
  if (existing && existing.type !== 'self_hosted') throw new Error('Existing named application is not self_hosted; refusing to replace it.');
  if (existing && (existing.policies?.length !== 1 || existing.policies[0]?.name !== POLICY || !existing.policies[0]?.id)) {
    throw new Error('Existing named application has unexpected policies; review manually. No policies were replaced.');
  }
  const desired = desiredApplication(email, otp[0].id, existing?.policies?.[0]?.id);
  const unchanged = existing && sameManagedFields(existing, desired);
  output(JSON.stringify({ mode: apply ? 'apply' : 'authenticated dry-run; GET only', action: unchanged ? 'unchanged' : existing ? 'update dedicated application' : 'create dedicated application', application: desired }, null, 2));
  let result = existing;
  if (apply && !unchanged) result = (await request(existing ? `/apps/${encodeURIComponent(existing.id)}` : '/apps', existing ? 'PUT' : 'POST', desired)).result;
  if (apply && (!result?.aud || typeof result.aud !== 'string')) throw new Error('Application response has no audience; inspect the dedicated app before configuring the Worker.');
  output(JSON.stringify({ status: apply ? 'Access application configured; Worker deployment still separate' : 'No mutations performed',
    workerVariables: { ACCESS_TEAM_DOMAIN: `https://${teamDomain}`, ACCESS_AUD: result?.aud ?? '<available after --apply>', ACCESS_ALLOWED_EMAILS: email },
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  configure(parseOptions(process.argv.slice(2)), process.env.CLOUDFLARE_API_TOKEN).catch((error) => {
    console.error(error instanceof Error ? error.message : 'Access setup failed.');
    process.exitCode = 1;
  });
}
