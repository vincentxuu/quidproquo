import { afterEach, describe, expect, it, vi } from 'vitest';
import { createClipLoop } from './youtubeClipLoop';

afterEach(() => vi.useRealTimers());
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
