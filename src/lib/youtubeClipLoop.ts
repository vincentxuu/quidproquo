/** Bounded shadowing loops using the official YouTube IFrame API. */
export interface ClipPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  getCurrentTime(): number;
}

// seekTo removes YouTube's native end boundary, so keep checking on later laps.
export function createClipLoop(player: ClipPlayer, start: number, end: number) {
  let started = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  const stop = () => { clearInterval(timer); timer = undefined; };
  const restart = () => { player.seekTo(start, true); player.playVideo(); };
  return {
    onStateChange(state: number) {
      stop();
      if (state === 1) {
        started = true;
        timer = setInterval(() => {
          if (player.getCurrentTime() >= end) restart();
        }, 100);
      } else if (state === 0 && started) {
        restart();
      }
    },
    dispose: stop,
  };
}

type YoutubeAPI = { Player: new (iframe: HTMLIFrameElement, options: {
  events: { onStateChange(event: { data: number; target: ClipPlayer }): void };
}) => ClipPlayer };
type YoutubeWindow = Window & { YT?: YoutubeAPI; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YoutubeAPI> | undefined;
const attached = new WeakSet<HTMLIFrameElement>();
const controllers = new Set<ReturnType<typeof createClipLoop>>();

function loadAPI(): Promise<YoutubeAPI> {
  const win = window as YoutubeWindow;
  if (win.YT?.Player) return Promise.resolve(win.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = win.onYouTubeIframeAPIReady;
    const ready = () => {
      try { previous?.(); } finally {
        clearTimeout(timeout);
        if (win.YT?.Player) resolve(win.YT);
        else reject(new Error('YouTube API unavailable'));
      }
    };
    win.onYouTubeIframeAPIReady = ready;
    const timeout = setTimeout(() => reject(new Error('YouTube API timed out')), 15000);
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('YouTube API failed')); }, { once: true });
      document.head.appendChild(script);
    }
  });
  return apiPromise;
}

export async function initYoutubeClipLoops() {
  const frames = [...document.querySelectorAll<HTMLIFrameElement>('iframe[data-youtube-loop-start][data-youtube-loop-end]')]
    .filter((frame) => !attached.has(frame));
  if (!frames.length) return;
  // Set origin immediately, before an API download could overlap a user's play.
  for (const frame of frames) {
    const src = new URL(frame.src);
    if (src.searchParams.get('origin') !== window.location.origin) {
      src.searchParams.set('origin', window.location.origin);
      frame.src = src.toString();
    }
  }
  try {
    const api = await loadAPI();
    for (const frame of frames) {
      if (!frame.isConnected || attached.has(frame)) continue;
      const start = Number(frame.dataset.youtubeLoopStart);
      const end = Number(frame.dataset.youtubeLoopEnd);
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) continue;
      let controller: ReturnType<typeof createClipLoop> | undefined;
      new api.Player(frame, { events: { onStateChange(event) {
        controller ??= createClipLoop(event.target, start, end);
        controllers.add(controller);
        controller.onStateChange(event.data);
      } } });
      attached.add(frame);
    }
  } catch {
    // The original iframe and its controls still work when the API cannot load.
  }
}

export function disposeYoutubeClipLoops() {
  for (const controller of controllers) controller.dispose();
  controllers.clear();
}
