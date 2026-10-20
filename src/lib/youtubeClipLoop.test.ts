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

describe('practice playback boundaries', () => {
  it('corrects a startup seek that YouTube ignored before playback', async () => {
    const { createPracticePlayback } = await import('./youtubeClipLoop');
    vi.useFakeTimers();
    const player = { seekTo: vi.fn(), playVideo: vi.fn(), getCurrentTime: () => 0 };
    const playback = createPracticePlayback(player, 1367, 1418, true);
    playback.onStateChange(1);
    vi.advanceTimersByTime(100);
    expect(player.seekTo).toHaveBeenCalledWith(1367, true);
    vi.advanceTimersByTime(500);
    expect(player.seekTo).toHaveBeenCalledTimes(1);
    playback.dispose();
  });

  it('pauses once at the end when looping is off, and never restarts on ended', async () => {
    const { createPracticePlayback } = await import('./youtubeClipLoop');
    vi.useFakeTimers();
    const player = { seekTo: vi.fn(), playVideo: vi.fn(), pauseVideo: vi.fn(), getCurrentTime: () => 1034 };
    const playback = createPracticePlayback(player, 1003, 1034, false);
    playback.onStateChange(1);
    vi.advanceTimersByTime(500);
    expect(player.pauseVideo).toHaveBeenCalledTimes(1);
    playback.onStateChange(0);
    expect(player.seekTo).not.toHaveBeenCalled();
    playback.dispose();
  });
  it('loops at the chosen start and leaves no polling after disposal', async () => {
    const { createPracticePlayback } = await import('./youtubeClipLoop');
    vi.useFakeTimers();
    const player = { seekTo: vi.fn(), playVideo: vi.fn(), getCurrentTime: () => 1911 };
    const playback = createPracticePlayback(player, 1858, 1911, true);
    playback.onStateChange(1);
    vi.advanceTimersByTime(100);
    expect(player.seekTo).toHaveBeenCalledWith(1858, true);
    playback.dispose();
    vi.advanceTimersByTime(1000);
    expect(player.seekTo).toHaveBeenCalledTimes(1);
  });
});

describe('practice player integration', () => {
  const setup = async () => {
    const { playYoutubePractice, seekEmbeddedYoutube } = await import('./youtubeClipLoop');
    vi.useFakeTimers();
    const player = { seekTo: vi.fn(), playVideo: vi.fn(), pauseVideo: vi.fn(), setPlaybackRate: vi.fn(), getCurrentTime: vi.fn(() => 110) };
    const container = { classList: { remove: vi.fn() }, replaceChildren: vi.fn() };
    const frame = {
      src: 'https://www.youtube-nocookie.com/embed/MN9dGgmLyso?enablejsapi=1', dataset: {}, isConnected: true,
      closest: (selector: string) => selector === '.video-embed__frame' ? container : null,
      getBoundingClientRect: () => ({ top: 100, bottom: 460 }), scrollIntoView: vi.fn(),
    };
    type Events = {
      onReady(event: { target: typeof player }): void;
      onStateChange(event: { data: number; target: typeof player }): void;
      onError(event: { data: number }): void;
    };
    let events: Events | undefined;
    const Player = vi.fn(function (_frame, options: { events: Events }) { events = options.events; return player; });
    vi.stubGlobal('window', { location: { origin: 'https://quidproquo.cc' }, innerHeight: 900, YT: { Player } });
    vi.stubGlobal('document', {
      querySelectorAll: () => [frame], querySelector: () => null,
      createElement: () => ({ setAttribute: vi.fn(), textContent: '', dataset: {}, addEventListener: vi.fn() }),
      documentElement: { lang: 'en', classList: { contains: () => false } },
    });
    vi.stubGlobal('IntersectionObserver', undefined);
    await initYoutubeClipLoops();
    return { player, frame, container, events: events!, playYoutubePractice, seekEmbeddedYoutube };
  };

  it('waits for ready, applies practice controls, then releases bounds and rate for ordinary time links', async () => {
    const { player, frame, events, playYoutubePractice, seekEmbeddedYoutube } = await setup();
    const pending = playYoutubePractice('MN9dGgmLyso', 91, 110, .75, true, { isConnected: true, contains: () => false } as unknown as Element);
    await Promise.resolve();
    expect(player.seekTo).not.toHaveBeenCalled();
    events.onReady({ target: player });
    expect(await pending).toBe(true);
    expect(player.setPlaybackRate).toHaveBeenCalledWith(.75);
    expect(player.seekTo).toHaveBeenLastCalledWith(91, true);
    expect(player.playVideo).toHaveBeenCalledTimes(1);
    events.onStateChange({ data: 1, target: player });
    vi.advanceTimersByTime(100);
    expect(player.seekTo).toHaveBeenCalledTimes(2);
    seekEmbeddedYoutube(frame as unknown as HTMLIFrameElement, 200);
    expect(player.setPlaybackRate).toHaveBeenLastCalledWith(1);
    expect(player.seekTo).toHaveBeenLastCalledWith(200, true);
    const count = player.seekTo.mock.calls.length;
    events.onStateChange({ data: 1, target: player });
    vi.advanceTimersByTime(500);
    expect(player.seekTo).toHaveBeenCalledTimes(count);
  });

  it('replaces loop bounds when moving through all three clips in one player', async () => {
    const { player, events, playYoutubePractice } = await setup();
    events.onReady({ target: player });
    const anchor = { isConnected: true, contains: () => true } as unknown as Element;
    player.getCurrentTime.mockReturnValue(1034);
    await playYoutubePractice('MN9dGgmLyso', 1003, 1034, 1, true, anchor);
    events.onStateChange({ data: 1, target: player });
    vi.advanceTimersByTime(100);
    expect(player.seekTo).toHaveBeenLastCalledWith(1003, true);
    player.getCurrentTime.mockReturnValue(1400);
    await playYoutubePractice('MN9dGgmLyso', 1367, 1418, .75, true, anchor);
    events.onStateChange({ data: 1, target: player });
    const seeks = player.seekTo.mock.calls.length;
    vi.advanceTimersByTime(100);
    expect(player.seekTo).toHaveBeenCalledTimes(seeks);
    expect(player.setPlaybackRate).toHaveBeenLastCalledWith(.75);
    player.getCurrentTime.mockReturnValue(1418);
    vi.advanceTimersByTime(100);
    expect(player.seekTo).toHaveBeenLastCalledWith(1367, true);
    player.getCurrentTime.mockReturnValue(3021);
    await playYoutubePractice('MN9dGgmLyso', 2974, 3020, 1, false, anchor);
    events.onStateChange({ data: 1, target: player });
    vi.advanceTimersByTime(100);
    expect(player.pauseVideo).toHaveBeenCalledTimes(1);
    expect(player.seekTo).toHaveBeenLastCalledWith(2974, true);
  });

  it('keeps the inline player on transient playback errors', async () => {
    const { container, events } = await setup();
    events.onError({ data: 5 });
    expect(container.replaceChildren).not.toHaveBeenCalled();
  });

  it('stops practice polling before replacing a failed embedded player', async () => {
    const { player, container, events, playYoutubePractice } = await setup();
    events.onReady({ target: player });
    expect(await playYoutubePractice('MN9dGgmLyso', 91, 110, 1, true, { isConnected: true, contains: () => false } as unknown as Element)).toBe(true);
    events.onStateChange({ data: 1, target: player });
    vi.advanceTimersByTime(100);
    expect(player.getCurrentTime).toHaveBeenCalledTimes(1);
    events.onError({ data: 150 });
    expect(container.replaceChildren).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(player.getCurrentTime).toHaveBeenCalledTimes(1);
  });
});


describe('practice playback clock', () => {
  it('reads only the local ready player and rejects stale or unavailable clocks', async () => {
    const { getPracticePlaybackTime } = await import('./youtubeClipLoop');
    const player = { seekTo: vi.fn(), playVideo: vi.fn(), getCurrentTime: vi.fn(() => 91.25) };
    const frame = { src: 'https://www.youtube-nocookie.com/embed/MN9dGgmLyso?enablejsapi=1', dataset: {}, isConnected: true };
    let ready: (event: { target: typeof player }) => void = () => {};
    const Player = vi.fn(function (_frame, options) { ready = options.events.onReady; return player; });
    vi.stubGlobal('window', { location: { origin: 'https://quidproquo.cc' }, YT: { Player } });
    vi.stubGlobal('document', { querySelectorAll: () => [frame], querySelector: () => null, documentElement: { classList: { contains: () => false } } });
    vi.stubGlobal('IntersectionObserver', undefined);
    const anchor = { querySelector: () => frame } as unknown as Element;
    await initYoutubeClipLoops();
    expect(getPracticePlaybackTime(anchor)).toBeNull();
    expect(player.getCurrentTime).not.toHaveBeenCalled();
    ready({ target: player });
    expect(getPracticePlaybackTime(anchor)).toBe(91.25);
    expect(getPracticePlaybackTime({ querySelector: () => null } as unknown as Element)).toBeNull();
    player.getCurrentTime.mockReturnValue(NaN);
    expect(getPracticePlaybackTime(anchor)).toBeNull();
    player.getCurrentTime.mockReturnValue(-1);
    expect(getPracticePlaybackTime(anchor)).toBeNull();
    player.getCurrentTime.mockImplementation(() => { throw new Error('unavailable'); });
    expect(getPracticePlaybackTime(anchor)).toBeNull();
    player.getCurrentTime.mockReturnValue(92);
    frame.isConnected = false;
    expect(getPracticePlaybackTime(anchor)).toBeNull();
    frame.isConnected = true;
    disposeYoutubeClipLoops();
    expect(getPracticePlaybackTime(anchor)).toBeNull();
  });
});
