import { afterEach, describe, expect, it, vi } from 'vitest';
import { createClipLoop, disposeYoutubeClipLoops, initYoutubeClipLoops, youtubeErrorMessage } from './youtubeClipLoop';

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
