import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('../../../lib/auth/access', () => ({ accessConfigured: vi.fn(() => true), requireAccessIdentity: vi.fn() }));
vi.mock('../../../lib/auth/session', () => ({ verifySession: vi.fn() }));
vi.mock('../../../lib/gatelane', () => ({ initGatelane: vi.fn() }));
vi.mock('../../../lib/research/orchestrator', () => ({ runDeepResearch: vi.fn(async () => ({ reportId:'test' })) }));
import { accessConfigured, requireAccessIdentity } from '../../../lib/auth/access';
import { verifySession } from '../../../lib/auth/session';
import { runDeepResearch } from '../../../lib/research/orchestrator';
import { POST } from '../deep-research';
import { GET } from '../deep-research/[reportId]';
const cookies = { get: () => ({ value:'legacy-session' }) };
beforeEach(() => { vi.mocked(accessConfigured).mockReturnValue(true); vi.mocked(requireAccessIdentity).mockReset(); vi.mocked(verifySession).mockReset().mockResolvedValue(true); vi.mocked(runDeepResearch).mockClear(); });
describe('private deep research Access authorization', () => {
  it('rejects old session for report creation before invoking research', async () => {
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('Forbidden', {status:403}));
    const response = await POST({request:new Request('https://quidproquo.cc/api/deep-research',{method:'POST',body:JSON.stringify({brief:'private'})}),cookies} as never);
    expect(response.status).toBe(403); expect(verifySession).not.toHaveBeenCalled(); expect(runDeepResearch).not.toHaveBeenCalled();
  });
  it('rejects old session for private report reads before touching storage', async () => {
    vi.mocked(requireAccessIdentity).mockRejectedValue(new Response('Login required',{status:401}));
    const get=vi.fn();
    const response=await GET({request:new Request('https://quidproquo.cc/api/deep-research/private'),params:{reportId:'private'},cookies,env:{DEEP_RESEARCH_KV:{get}}} as never);
    expect(response.status).toBe(401); expect(get).not.toHaveBeenCalled(); expect(verifySession).not.toHaveBeenCalled();
  });
  it('lets the verified owner read a private report', async () => {
    vi.mocked(requireAccessIdentity).mockResolvedValue({sub:'owner',email:'owner@example.test'});
    const response=await GET({request:new Request('https://quidproquo.cc/api/deep-research/private'),params:{reportId:'private'},cookies,env:{DEEP_RESEARCH_KV:{get:vi.fn().mockResolvedValue('Private report')}}} as never);
    expect(response.status).toBe(200); expect(await response.text()).toBe('Private report');
  });
});
