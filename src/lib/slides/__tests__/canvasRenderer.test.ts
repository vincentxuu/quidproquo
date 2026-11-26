import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ getDocument: vi.fn(), destroy: vi.fn(), getPage: vi.fn() }));
vi.mock('pdfjs-dist/legacy/build/pdf.mjs', () => ({ GlobalWorkerOptions: {}, getDocument: mocks.getDocument }));
vi.mock('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url', () => ({ default: '/worker.mjs' }));
import { SlideCanvasRenderer } from '../canvasRenderer';
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function fixture() {
  const host = { clientWidth: 800, replaceChildren: vi.fn() };
  const canvas = { style: {}, setAttribute: vi.fn(), getContext: () => ({}) };
  vi.stubGlobal('window', { devicePixelRatio: 1, document: { createElement: () => ({ ...canvas }) } });
  return { host, reader: new SlideCanvasRenderer('/slides.pdf', host as unknown as HTMLElement) };
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.getDocument.mockReturnValue({ promise: Promise.resolve({ numPages: 71, getPage: mocks.getPage }), destroy: mocks.destroy.mockResolvedValue(undefined) });
  mocks.getPage.mockImplementation(async () => ({ getViewport: () => ({ width: 800, height: 450 }), render: () => ({ promise: Promise.resolve(), cancel: vi.fn() }) }));
});
describe('PDF canvas lifecycle', () => {
  it('does not start loading after disposal before first open', async () => {
    const { reader } = fixture(); reader.destroy();
    expect(await reader.show(1)).toBe(false);
    expect(mocks.getDocument).not.toHaveBeenCalled();
  });
  it('loads a document once across page changes, without creating iframes', async () => {
    const { reader, host } = fixture();
    expect(await reader.show(1)).toBe(true); expect(await reader.show(18)).toBe(true);
    expect(mocks.getDocument).toHaveBeenCalledTimes(1);
    expect(mocks.getPage.mock.calls).toEqual([[1], [18]]);
    expect(host.replaceChildren).toHaveBeenCalledTimes(2);
    reader.destroy(); expect(mocks.destroy).toHaveBeenCalledOnce();
  });
  it('does not display stale pages when navigation overtakes a pending render', async () => {
    let finish!: () => void;
    mocks.getPage.mockImplementation(async () => ({ getViewport: () => ({ width: 800, height: 450 }), render: () => ({ promise: new Promise<void>(resolve => { finish = resolve; }), cancel: vi.fn() }) }));
    const { reader, host } = fixture();
    const first = reader.show(1); await tick(); const completeFirst = finish;
    const second = reader.show(18); await tick(); finish();
    expect(await second).toBe(true); completeFirst(); expect(await first).toBe(false);
    expect(host.replaceChildren).toHaveBeenCalledTimes(1);
  });
  it('retries a failed document load and prevents rendering after disposal', async () => {
    const { reader, host } = fixture();
    mocks.getDocument.mockReturnValueOnce({ promise: Promise.reject(new Error('network')), destroy: mocks.destroy.mockResolvedValue(undefined) });
    await expect(reader.show(1)).rejects.toThrow('network');
    expect(await reader.show(1)).toBe(true);
    reader.destroy(); host.replaceChildren.mockClear();
    expect(await reader.show(2)).toBe(false); expect(host.replaceChildren).not.toHaveBeenCalled();
  });
});
