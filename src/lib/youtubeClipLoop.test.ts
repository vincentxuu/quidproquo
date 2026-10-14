import { afterEach, describe, expect, it, vi } from 'vitest';
import { createClipLoop, disposeYoutubeClipLoops, handleYoutubeTimeLinkClick, initYoutubeClipLoops, parseYoutubeTimeLink, showYoutubeFallback, youtubeErrorMessage } from './youtubeClipLoop';

afterEach(() => { disposeYoutubeClipLoops(); vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('YouTube error fallback', () => {
  it('distinguishes owner restrictions, missing video, and client configuration', () => {
    expect(youtubeErrorMessage(101)).toBe(youtubeErrorMessage(150));
    expect(youtubeErrorMessage(100)).toContain('私人');
    expect(youtubeErrorMessage(153)).toContain('設定');
    expect(youtubeErrorMessage(5, true)).toContain('could not play');
  });

  it('attaches error handling to ordinary videos and replaces only the frame container', async () => {
    const container = { classList: { remove: vi.fn() }, replaceChildren: vi.fn() };
    const frame = { src: 'https://www.youtube-nocookie.com/embed/qQTDF0CBoxE?enablejsapi=1', dataset: {}, isConnected: true, closest: vi.fn(() => container) };
    const message = { setAttribute: vi.fn(), textContent: '' };
    let events: { onError(event: { data: number }): void } | undefined;
    const Player = vi.fn(function (_frame, options) { events = options.events; });
    vi.stubGlobal('window', { location: { origin: 'https://quidproquo.cc' }, YT: { Player } });
    vi.stubGlobal('document', { querySelectorAll: () => [frame], createElement: () => message, documentElement: { lang: 'en' } });
    vi.stubGlobal('IntersectionObserver', undefined);
    await initYoutubeClipLoops();
    expect(new URL(frame.src).searchParams.get('origin')).toBe('https://quidproquo.cc');
    expect(Player).toHaveBeenCalledTimes(1);
    events?.onError({ data: 150 });
    expect(message.textContent).toContain('cannot be embedded');
    expect(container.replaceChildren).toHaveBeenCalledWith(message);
    expect(frame.closest).toHaveBeenCalledWith('.video-embed__frame');
  });
});
describe('bounded YouTube clip loop', () => {
  it('waits for user playback and restarts on ENDED without replacing the video or rate', () => {
    const player = { seekTo: vi.fn(), playVideo: vi.fn(), getCurrentTime: vi.fn(() => 961) };
    const loop = createClipLoop(player, 954, 961);
    loop.onStateChange(0);
    expect(player.playVideo).not.toHaveBeenCalled();
    loop.onStateChange(1);
    loop.onStateChange(0);
    expect(player.seekTo).toHaveBeenCalledWith(954, true);
    expect(player.playVideo).toHaveBeenCalledTimes(1);
    loop.dispose();
  });

  it('enforces the boundary on subsequent laps and stops polling while paused or disposed', () => {
    vi.useFakeTimers();
    let time = 960;
    const player = { seekTo: vi.fn(() => { time = 954; }), playVideo: vi.fn(), getCurrentTime: vi.fn(() => time) };
    const loop = createClipLoop(player, 954, 961);
    loop.onStateChange(1);
    vi.advanceTimersByTime(100);
    expect(player.seekTo).not.toHaveBeenCalled();
    time = 961;
    vi.advanceTimersByTime(100);
    expect(player.seekTo).toHaveBeenCalledTimes(1);
    time = 961;
    loop.onStateChange(2);
    vi.advanceTimersByTime(1000);
    expect(player.seekTo).toHaveBeenCalledTimes(1);
    loop.onStateChange(1);
    loop.dispose();
    vi.advanceTimersByTime(1000);
    expect(player.seekTo).toHaveBeenCalledTimes(1);
  });
});

describe('YouTube time links', () => {
  it('reads the video and the second from watch and short links', () => {
    expect(parseYoutubeTimeLink('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=194s')).toEqual({ id: 'WbzNRTTrX0g', seconds: 194 });
    expect(parseYoutubeTimeLink('https://youtu.be/WbzNRTTrX0g?t=60')).toEqual({ id: 'WbzNRTTrX0g', seconds: 60 });
    expect(parseYoutubeTimeLink('https://www.youtube.com/watch?v=WbzNRTTrX0g')).toBeNull();
    expect(parseYoutubeTimeLink('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=1m30s')).toBeNull();
    expect(parseYoutubeTimeLink('/posts/tech/some-post')).toBeNull();
  });

  const click = (href: string, extra: Record<string, unknown> = {}) => {
    const link = { href, closest: (selector: string) => (selector === 'a[href]' ? link : null), getBoundingClientRect: () => ({ top: 300 }) };
    return { defaultPrevented: false, button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, target: link, preventDefault: vi.fn(), ...extra };
  };
  const classList = () => { const list = new Set<string>(); return { add: (c: string) => list.add(c), remove: (c: string) => list.delete(c), contains: (c: string) => list.has(c) }; };
  const page = (id: string, { wide, playerTop }: { wide: boolean; playerTop: number }) => {
    const figure = { classList: classList(), querySelector: () => null, appendChild: vi.fn() };
    const frame = { src: `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1`, dataset: {}, scrollIntoView: vi.fn(), closest: () => figure, getBoundingClientRect: () => ({ top: playerTop, bottom: playerTop + 360 }) };
    const root = { lang: 'zh-TW', classList: classList() };
    const added: { textContent: string; className: string; click?: () => void; remove: ReturnType<typeof vi.fn> }[] = [];
    const createElement = () => { const el = { textContent: '', className: '', type: '', remove: vi.fn(), addEventListener: (_: string, fn: () => void) => { el.click = fn; } } as (typeof added)[number] & { type: string; addEventListener: (name: string, fn: () => void) => void }; return el; };
    const body = { appendChild: (el: (typeof added)[number]) => added.push(el) };
    vi.stubGlobal('document', { querySelectorAll: () => [frame], querySelector: () => null, documentElement: root, createElement, body });
    const win = { innerHeight: 900, innerWidth: wide ? 1440 : 390, scrollY: 4200, scrollBy: vi.fn(), scrollTo: vi.fn(), matchMedia: () => ({ matches: wide, addEventListener: vi.fn(), removeEventListener: vi.fn() }) };
    vi.stubGlobal('window', win);
    return { frame, figure, root, added, win };
  };

  it('on a wide screen splits the page and keeps the reader in place', () => {
    const { frame, figure, root, added, win } = page('WbzNRTTrX0g', { wide: true, playerTop: -3000 });
    const event = click('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=194s');
    handleYoutubeTimeLinkClick(event as unknown as MouseEvent);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(new URL(frame.src).searchParams.get('start')).toBe('194');
    expect(root.classList.contains('video-split')).toBe(true);
    expect(figure.classList.contains('video-embed--split')).toBe(true);
    expect(figure.appendChild).toHaveBeenCalledTimes(1);
    expect(frame.scrollIntoView).not.toHaveBeenCalled();
    expect(added).toHaveLength(0);
    expect(win.scrollTo).not.toHaveBeenCalled();
  });

  it('pins whichever embedded lecture the clicked link belongs to', () => {
    const { frame, figure, root } = page('WbzNRTTrX0g', { wide: true, playerTop: -3000 });
    const otherFigure = { classList: classList(), querySelector: () => null, appendChild: vi.fn() };
    const other = { src: 'https://www.youtube-nocookie.com/embed/HWQLez87vqM?enablejsapi=1', dataset: {}, scrollIntoView: vi.fn(), closest: () => otherFigure, getBoundingClientRect: () => ({ top: -900, bottom: -540 }) };
    const doc = document as unknown as { querySelectorAll: () => unknown[]; querySelector: (selector: string) => unknown };
    doc.querySelectorAll = () => [frame, other];
    doc.querySelector = (selector: string) => (selector === '.video-embed--split' ? [figure, otherFigure].find((f) => f.classList.contains('video-embed--split')) ?? null : null);
    handleYoutubeTimeLinkClick(click('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=194s') as unknown as MouseEvent);
    handleYoutubeTimeLinkClick(click('https://www.youtube.com/watch?v=HWQLez87vqM&t=741s') as unknown as MouseEvent);
    expect(root.classList.contains('video-split')).toBe(true);
    expect(figure.classList.contains('video-embed--split')).toBe(false);
    expect(otherFigure.classList.contains('video-embed--split')).toBe(true);
    expect(new URL(other.src).searchParams.get('start')).toBe('741');
  });

  it('gives the screen back when the pinned lecture turns out not to be embeddable', () => {
    const { frame, figure, root } = page('WbzNRTTrX0g', { wide: true, playerTop: -3000 });
    const doc = document as unknown as { querySelector: (selector: string) => unknown; createElement: () => unknown };
    doc.querySelector = (selector: string) => (selector === '.video-embed--split' && figure.classList.contains('video-embed--split') ? figure : null);
    handleYoutubeTimeLinkClick(click('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=194s') as unknown as MouseEvent);
    expect(root.classList.contains('video-split')).toBe(true);
    doc.createElement = () => ({ setAttribute: vi.fn(), textContent: '' });
    Object.assign(figure, { replaceChildren: vi.fn() });
    showYoutubeFallback(frame as unknown as HTMLIFrameElement, 150);
    expect(root.classList.contains('video-split')).toBe(false);
    expect(figure.classList.contains('video-embed--split')).toBe(false);
  });

  it('on a narrow screen scrolls to the player and offers a way back', () => {
    const { frame, root, added, win } = page('WbzNRTTrX0g', { wide: false, playerTop: -3000 });
    handleYoutubeTimeLinkClick(click('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=60s') as unknown as MouseEvent);
    expect(root.classList.contains('video-split')).toBe(false);
    expect(frame.scrollIntoView).toHaveBeenCalled();
    expect(added).toHaveLength(1);
    expect(added[0].className).toBe('video-return');
    added[0].click?.();
    expect(win.scrollTo).toHaveBeenCalledWith({ top: 4200, behavior: 'smooth' });
    expect(added[0].remove).toHaveBeenCalled();
  });

  it('does not scroll when the player is already on screen', () => {
    const { frame, added } = page('WbzNRTTrX0g', { wide: false, playerTop: 120 });
    handleYoutubeTimeLinkClick(click('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=60s') as unknown as MouseEvent);
    expect(new URL(frame.src).searchParams.get('start')).toBe('60');
    expect(frame.scrollIntoView).not.toHaveBeenCalled();
    expect(added).toHaveLength(0);
  });

  it('leaves the link alone when the video is not on the page or a modifier key is held', () => {
    const { frame, root } = page('cmNIMjPYdgM', { wide: true, playerTop: -3000 });
    const other = click('https://www.youtube.com/watch?v=WbzNRTTrX0g&t=194s');
    handleYoutubeTimeLinkClick(other as unknown as MouseEvent);
    const newTab = click('https://www.youtube.com/watch?v=cmNIMjPYdgM&t=350s', { metaKey: true });
    handleYoutubeTimeLinkClick(newTab as unknown as MouseEvent);
    expect(other.preventDefault).not.toHaveBeenCalled();
    expect(newTab.preventDefault).not.toHaveBeenCalled();
    expect(frame.src).not.toContain('start=');
    expect(root.classList.contains('video-split')).toBe(false);
  });
});
