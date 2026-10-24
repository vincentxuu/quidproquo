import { describe, expect, it } from 'vitest';
import { accessRoutePolicy } from './access-routes';
describe('unified Access protection boundary', () => {
  it.each(['/account', '/admin', '/admin/sessions/private', '/auth/login', '/vocabulary', '/en/vocabulary/'])('protects personal pages %s', path => expect(accessRoutePolicy(path)).toBe('page'));
  it.each(['/api/auth/logout', '/api/deep-research/private', '/api/admin/sessions/x/approve', '/api/admin/site/rag', '/api/vocabulary', '/api/personal/progress', '/%61pi/admin/settings'])('protects private APIs including approval %s', path => expect(accessRoutePolicy(path)).toBe('api'));
  it.each(['/api/admin/webhooks/github', '/api/admin/webhooks/discord-interactions', '/api/admin/sessions/runner/ws', '/api/admin/sessions/scheduled', '/api/admin/site/pipelines/scheduled', '/api/admin/routines/123/fire'])('preserves machine authentication %s', path => expect(accessRoutePolicy(path)).toBe('machine'));
  it.each(['/', '/posts/ai/example/', '/english', '/interview', '/api/chat', '/api/tts', '/api/administer', '/api/admin/routines/x/fire/anything'])('does not accidentally exempt unrelated routes %s', path => expect(accessRoutePolicy(path)).toBe(path.startsWith('/api/admin/') ? 'api' : 'public'));
});
