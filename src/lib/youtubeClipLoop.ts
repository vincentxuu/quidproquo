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
  events: { onStateChange(event: { data: number; target: ClipPlayer }): void; onError(event: { data: number }): void };
}) => ClipPlayer };
type YoutubeWindow = Window & { YT?: YoutubeAPI; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YoutubeAPI> | undefined;
const attached = new WeakSet<HTMLIFrameElement>();
const controllers = new Set<ReturnType<typeof createClipLoop>>();
let observer: IntersectionObserver | undefined;
let generation = 0;

export function youtubeErrorMessage(code: number, english = false): string {
  if (code === 101 || code === 150) return english ? 'This video cannot be embedded. Open it on YouTube.' : '此影片禁止站內嵌入，請前往 YouTube 觀看。';
  if (code === 100) return english ? 'This video is unavailable or private. Check the original YouTube page.' : '此影片無法取得或已設為私人，請查看 YouTube 原始頁面。';
  if (code === 153) return english ? 'The embedded player could not be configured. Try the YouTube link.' : '站內播放器設定失敗，請使用 YouTube 原始連結。';
  return english ? 'The embedded player could not play this video. Try the YouTube link.' : '站內播放器無法播放此影片，請使用 YouTube 原始連結。';
}

export function showYoutubeFallback(frame: HTMLIFrameElement, code: number) {
  const container = frame.closest('.video-embed__frame');
  if (!container) return;
  const message = document.createElement('p');
  message.setAttribute('role', 'status');
  message.textContent = youtubeErrorMessage(code, document.documentElement.lang.startsWith('en'));
  container.classList.remove('video-embed__frame');
  container.replaceChildren(message);
  // The original watch link remains outside the replaced frame container.
}

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
  return apiPromise.catch((error: unknown) => { apiPromise = undefined; throw error; });
}

export async function initYoutubeClipLoops() {
  const frames = [...document.querySelectorAll<HTMLIFrameElement>('iframe[data-youtube-player]')]
    .filter((frame) => !attached.has(frame));
  if (!frames.length) return;
  const currentGeneration = generation;
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
    if (generation !== currentGeneration) return;
    const attach = (frame: HTMLIFrameElement) => {
      if (!frame.isConnected || attached.has(frame)) return;
      const start = Number(frame.dataset.youtubeLoopStart);
      const end = Number(frame.dataset.youtubeLoopEnd);
      const segmentLoop = frame.dataset.youtubeLoopStart !== undefined && Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end > start;
      let controller: ReturnType<typeof createClipLoop> | undefined;
      new api.Player(frame, { events: { onStateChange(event) {
        if (!segmentLoop) return;
        controller ??= createClipLoop(event.target, start, end);
        controllers.add(controller);
        controller.onStateChange(event.data);
      }, onError(event) {
        controller?.dispose();
        if (controller) controllers.delete(controller);
        showYoutubeFallback(frame, event.data);
      } } });
      attached.add(frame);
    };
    if (typeof IntersectionObserver === 'undefined') {
      frames.forEach(attach);
    } else {
      observer ??= new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) {
          observer?.unobserve(entry.target);
          attach(entry.target as HTMLIFrameElement);
        }
      }, { rootMargin: '200px' });
      frames.forEach((frame) => observer?.observe(frame));
    }
  } catch {
    // The original iframe and its controls still work when the API cannot load.
  }
}

export function disposeYoutubeClipLoops() {
  generation++;
  observer?.disconnect();
  observer = undefined;
  for (const controller of controllers) controller.dispose();
  controllers.clear();
}
