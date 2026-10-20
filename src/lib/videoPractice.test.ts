import { afterEach, expect, it, vi } from 'vitest';
import { disposeVideoPractice, initVideoPractice, syncPracticePanel } from './videoPractice';
import { getPracticePlaybackTime, playYoutubePractice } from './youtubeClipLoop';
vi.mock('./youtubeClipLoop', () => ({ playYoutubePractice: vi.fn(async () => true), getPracticePlaybackTime: vi.fn(() => null) }));
afterEach(() => { disposeVideoPractice(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

it('keeps a full transcript selection for speed changes and navigates within its own rows', async () => {
  const listeners = new Map<string, (event: unknown) => void>();
  const button = { disabled: false };
  const status = { textContent: '' };
  class Select { value = '0.75'; }
  const rate = new Select();
  const transcriptRows = [0, 10].map((start) => ({ dataset: { start: String(start), end: String(start + 2) }, disabled: false, pressed: 'false',
    getAttribute() { return this.pressed; }, setAttribute(_name: string, value: string) { this.pressed = value; },
  }));
  const transcript = { querySelectorAll: () => transcriptRows, querySelector: () => null };
  const excerpt = { querySelectorAll: () => [], querySelector: () => null };
  const section = {
    dataset: { videoId: 'MN9dGgmLyso', start: '91', end: '110' } as Record<string, string>,
    closest: () => null,
    querySelector(selector: string) {
      if (selector === '[data-practice-play]') return button;
      if (selector === '[data-practice-status]') return status;
      if (selector === '[data-practice-rate]') return rate;
      if (selector === '[data-practice-loop]') return { checked: true };
      if (selector === '[data-practice-transcript]') return transcript;
      if (selector === '[data-practice-clip-panel]:not([hidden])') return excerpt;
      return null;
    },
    querySelectorAll(selector: string) { return selector === '[data-practice-sentence]' ? transcriptRows : []; },
  };
  transcript.querySelector = ((selector: string) => selector.includes('aria-pressed') ? transcriptRows.find((row) => row.pressed === 'true') : null) as typeof transcript.querySelector;
  vi.stubGlobal('HTMLSelectElement', Select);
  vi.stubGlobal('window', { matchMedia: () => ({ matches: false }), location: { href: 'https://example.com/' }, setInterval: () => 1, clearInterval: vi.fn() });
  vi.stubGlobal('document', { querySelectorAll: () => [section], documentElement: { lang: 'zh-TW' }, addEventListener: (name: string, listener: (event: unknown) => void) => listeners.set(name, listener) });
  initVideoPractice();
  const sentence = { ...transcriptRows[0], closest: (selector: string) => selector === '[data-video-practice]' ? section : transcript };
  // Use the actual row object so selection state is shared with subsequent changes.
  Object.assign(transcriptRows[0], { closest: sentence.closest });
  const clickTarget = { closest: (selector: string) => selector === '[data-practice-sentence]' ? transcriptRows[0] : null };
  listeners.get('click')!({ target: clickTarget });
  await Promise.resolve();
  expect(playYoutubePractice).toHaveBeenLastCalledWith('MN9dGgmLyso', 0, 2, 0.75, true, section);
  const changeTarget = { matches: (selector: string) => selector.includes('data-practice-rate'), closest: () => section };
  listeners.get('change')!({ target: changeTarget });
  await Promise.resolve();
  expect(playYoutubePractice).toHaveBeenLastCalledWith('MN9dGgmLyso', 0, 2, 0.75, true, section);
  const next = { closest: (selector: string) => selector === '[data-video-practice]' ? section : transcript, hasAttribute: () => false };
  listeners.get('click')!({ target: { closest: (selector: string) => selector === '[data-practice-prev], [data-practice-next]' ? next : null } });
  await Promise.resolve();
  expect(playYoutubePractice).toHaveBeenLastCalledWith('MN9dGgmLyso', 10, 12, 0.75, true, section);
});


it('follows both transcript and clip without changing selected navigation or scrolling the same sentence again', () => {
  const makePanel = (starts: number[]) => {
    const list = { scrollTop: 0, getBoundingClientRect: () => ({ top: 0, bottom: 80 }) };
    const counter = { textContent: '' };
    const rows = starts.map((start) => ({
      dataset: { start: String(start), end: String(start + 2) },
      attributes: { 'aria-pressed': 'false' } as Record<string, string>,
      getAttribute(name: string) { return this.attributes[name]; },
      setAttribute(name: string, value: string) { this.attributes[name] = value; },
      removeAttribute(name: string) { delete this.attributes[name]; },
      closest: () => list, getBoundingClientRect: () => ({ top: 120, bottom: 150 }),
    }));
    const panel = { dataset: {} as Record<string, string>, querySelectorAll: () => rows, querySelector: () => counter };
    return { panel, rows, list, counter };
  };
  const transcript = makePanel([0, 10, 20]);
  const clip = makePanel([10, 20]);
  clip.rows[0].attributes['aria-pressed'] = 'true';
  let tick: (() => void) | undefined;
  const section = {
    dataset: {} as Record<string, string>, closest: () => null,
    querySelectorAll: () => [],
    querySelector(selector: string) {
      if (selector === '[data-practice-transcript]') return transcript.panel;
      if (selector === '[data-practice-clip-panel]:not([hidden])') return clip.panel;
      return null;
    },
  };
  vi.mocked(getPracticePlaybackTime).mockReturnValue(20.5);
  vi.stubGlobal('window', { matchMedia: () => ({ matches: false }), location: { href: 'https://example.com/' },
    setInterval: (callback: () => void) => { tick = callback; return 1; }, clearInterval: vi.fn() });
  vi.stubGlobal('document', { querySelectorAll: () => [section], documentElement: { lang: 'zh-TW' }, addEventListener: vi.fn() });
  initVideoPractice();
  tick!();
  expect(section.dataset.practiceTranscriptActive).toBeUndefined();
  expect(transcript.rows[2].attributes['aria-current']).toBe('true');
  expect(clip.rows[1].attributes['aria-current']).toBe('true');
  expect(transcript.counter.textContent).toBe('目前第 3 / 3 段');
  expect(clip.counter.textContent).toBe('目前第 2 / 2 段');
  expect(clip.rows[0].attributes['aria-pressed']).toBe('true');
  transcript.list.scrollTop = 0; // User scrolls while the same sentence is playing.
  syncPracticePanel(transcript.panel as unknown as HTMLElement, 21, false);
  expect(transcript.list.scrollTop).toBe(0);
  syncPracticePanel(transcript.panel as unknown as HTMLElement, 22, false);
  expect(transcript.rows.every((row) => !row.attributes['aria-current'])).toBe(true);
  expect(transcript.counter.textContent).toBe('句間停頓 / 3 段');
});
