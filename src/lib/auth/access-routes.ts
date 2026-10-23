/** Machine ingress retains its own signature/bearer/cron-secret verification. */
export function accessMachineRoute(path: string): boolean {
  return ['/api/admin/webhooks/github', '/api/admin/webhooks/discord-interactions', '/api/admin/sessions/runner/ws', '/api/admin/sessions/scheduled', '/api/admin/site/pipelines/scheduled'].includes(path.replace(/\/$/, ''))
    || /^\/api\/admin\/routines\/[^/]+\/fire\/?$/.test(path);
}
export function accessRoutePolicy(path: string): 'public' | 'machine' | 'page' | 'api' {
  let normalized: string;
  try { normalized = decodeURIComponent(path); } catch { return 'api'; }
  if (normalized === '/api/auth/logout') return 'api';
  if (accessMachineRoute(normalized)) return 'machine';
  if (/^\/api\/(?:admin|personal|vocabulary|deep-research)(?:\/|$)/.test(normalized)) return 'api';
  if (/^\/(?:account|admin|auth|vocabulary|en\/vocabulary)(?:\/|$)/.test(normalized)) return 'page';
  return 'public';
}
