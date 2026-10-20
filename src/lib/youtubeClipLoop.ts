/** Bounded shadowing loops using the official YouTube IFrame API. */
export interface ClipPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  getCurrentTime(): number;
  getPlayerState?(): number;
  pauseVideo?(): void;
  setPlaybackRate?(rate: number): void;
  getAvailablePlaybackRates?(): number[];
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
  events: { onReady?(event: { target: ClipPlayer }): void; onStateChange(event: { data: number; target: ClipPlayer }): void; onError(event: { data: number }): void };
}) => ClipPlayer };
type YoutubeWindow = Window & { YT?: YoutubeAPI; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YoutubeAPI> | undefined;
const attached = new WeakSet<HTMLIFrameElement>();
const players = new WeakMap<HTMLIFrameElement, ClipPlayer>();
const controllers = new Set<ReturnType<typeof createClipLoop>>();
let observer: IntersectionObserver | undefined;
let generation = 0;
const readyPlayers = new WeakMap<HTMLIFrameElement, Promise<ClipPlayer>>();
const readyPlayerGenerations = new WeakMap<HTMLIFrameElement, number>();
const practiceControllers = new WeakMap<HTMLIFrameElement, ReturnType<typeof createPracticePlayback>>();

/** Stop at the clip boundary, or loop only when explicitly selected. */
export function createPracticePlayback(player: ClipPlayer, start: number, end: number, loop: boolean) {
  let correctedStart = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  const dispose = () => { clearInterval(timer); timer = undefined; };
  const restart = () => { player.seekTo(start, true); player.playVideo(); };
  return {
    onStateChange(state: number) {
      dispose();
      if (state === 1) {
        correctedStart = false;
        timer = setInterval(() => {
          const time = player.getCurrentTime();
          // Correct at most once per actual PLAYING transition, not while buffering.
          if (time < start - .25 && !correctedStart) { correctedStart = true; restart(); }
          else if (time >= end) {
            if (loop) restart();
            else { dispose(); player.pauseVideo?.(); }
          }
        }, 100);
      } else if (state === 0 && loop) restart();
    },
    dispose,
  };
}

export function youtubeErrorMessage(code: number, english = false): string {
  if (code === 101 || code === 150) return english ? 'This video cannot be embedded. Open it on YouTube.' : '此影片禁止站內嵌入，請前往 YouTube 觀看。';
  if (code === 100) return english ? 'This video is unavailable or private. Check the original YouTube page.' : '此影片無法取得或已設為私人，請查看 YouTube 原始頁面。';
  if (code === 153) return english ? 'The embedded player could not be configured. Try the YouTube link.' : '站內播放器設定失敗，請使用 YouTube 原始連結。';
  return english ? 'The embedded player could not play this video. Try the YouTube link.' : '站內播放器無法播放此影片，請使用 YouTube 原始連結。';
}

export function showYoutubeFallback(frame: HTMLIFrameElement, code: number) {
  const container = frame.closest('.video-embed__frame');
  if (!container) return;
  // Transient/configuration failures must not destroy the inline player.
  if (![100, 101, 150].includes(code)) {
    const english = document.documentElement.lang.startsWith('en');
    const existing = container.parentElement?.querySelector('[data-youtube-retry]');
    if (existing) return;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.dataset.youtubeRetry = 'true';
    retry.textContent = english ? 'Player interrupted — retry here' : '播放器暫時中斷，按此原地重試';
    retry.addEventListener('click', () => {
      attached.delete(frame);
      players.delete(frame);
      readyPlayers.delete(frame);
      frame.setAttribute('src', frame.src);
      retry.remove();
      void initYoutubeClipLoops(frame);
    });
    container.parentNode?.insertBefore(retry, container.nextSibling);
    return;
  }
  // A player that cannot play has no business holding half the screen.
  if (frame.closest('.video-embed--split')) exitSplitView();
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

export async function initYoutubeClipLoops(eagerFrame?: HTMLIFrameElement) {
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
      let markReady: (player: ClipPlayer) => void;
      readyPlayers.set(frame, new Promise<ClipPlayer>((resolve) => { markReady = resolve; }));
      const player = new api.Player(frame, { events: { onReady(event) {
        if (generation === currentGeneration) readyPlayerGenerations.set(frame, currentGeneration);
        markReady(event.target);
      }, onStateChange(event) {
        const practice = practiceControllers.get(frame);
        if (practice) { practice.onStateChange(event.data); return; }
        if (!segmentLoop) return;
        controller ??= createClipLoop(event.target, start, end);
        controllers.add(controller);
        controller.onStateChange(event.data);
      }, onError(event) {
        clearPracticePlayback(frame);
        controller?.dispose();
        if (controller) controllers.delete(controller);
        showYoutubeFallback(frame, event.data);
      } } });
      players.set(frame, player);
      attached.add(frame);
    };
    if (eagerFrame && frames.includes(eagerFrame)) attach(eagerFrame);
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
  exitSplitView(false);
  if (typeof document !== 'undefined') document.querySelector?.('.video-return')?.remove();
  for (const controller of controllers) controller.dispose();
  controllers.clear();
}

/** A link like watch?v=ID&t=350s names a video and a second to start from. */
export function parseYoutubeTimeLink(href: string): { id: string; seconds: number } | null {
  let url: URL;
  try { url = new URL(href); } catch { return null; }
  const host = url.hostname.replace(/^www\./, '');
  const id = host === 'youtu.be' ? url.pathname.slice(1) : host === 'youtube.com' && url.pathname === '/watch' ? url.searchParams.get('v') : null;
  const time = url.searchParams.get('t')?.match(/^(\d+)s?$/);
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id) || !time) return null;
  return { id, seconds: Number(time[1]) };
}

const SPLIT_VIEW_QUERY = '(min-width: 1200px)';
let splitViewWatcher: MediaQueryList | undefined;

// Run a layout change without moving what the reader is looking at.
function keepInPlace(anchor: Element | null | undefined, change: () => void) {
  const before = anchor?.getBoundingClientRect?.().top;
  change();
  const after = anchor?.getBoundingClientRect?.().top;
  if (before !== undefined && after !== undefined && after !== before) window.scrollBy({ top: after - before, behavior: 'instant' });
}

const english = () => document.documentElement.lang.startsWith('en');

/** Wide screens: the article keeps the left half, the player stays fixed on the right. */
export function enterSplitView(frame: HTMLIFrameElement, anchor?: Element | null): boolean {
  const figure = frame.closest<HTMLElement>('.video-embed');
  const root = document.documentElement;
  if (!figure || !window.matchMedia?.(SPLIT_VIEW_QUERY).matches) return false;
  if (figure.classList.contains('video-embed--split')) return true;
  keepInPlace(anchor, () => {
    // A page can embed several lectures; the one just asked for takes the pinned slot.
    document.querySelector('.video-embed--split')?.classList.remove('video-embed--split');
    root.classList.add('video-split');
    figure.classList.add('video-embed--split');
    if (!figure.querySelector('.video-embed__close')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'video-embed__close';
      button.textContent = english() ? 'Close split view ×' : '結束對照 ×';
      button.addEventListener('click', () => exitSplitView());
      figure.appendChild(button);
    }
  });
  if (!splitViewWatcher) {
    splitViewWatcher = window.matchMedia(SPLIT_VIEW_QUERY);
    splitViewWatcher.addEventListener?.('change', onSplitViewWidthChange);
  }
  return true;
}

function onSplitViewWidthChange(event: MediaQueryListEvent) {
  if (!event.matches) exitSplitView();
}

// The block of text the reader has in front of them; the article fills the left half in split view.
function readingAnchor(): Element | null {
  for (const fraction of [0.4, 0.3, 0.5, 0.2, 0.6]) {
    const block = document.elementFromPoint?.(window.innerWidth * 0.25, window.innerHeight * fraction)
      ?.closest('p, li, h2, h3, h4, pre, tr, blockquote, summary');
    if (block) return block;
  }
  return null;
}

export function exitSplitView(keepPosition = true) {
  const root = typeof document === 'undefined' ? undefined : document.documentElement;
  if (!root?.classList?.contains('video-split')) return;
  // The text sits in the left half; hold on to whatever the reader has in front of them there.
  const anchor = keepPosition ? readingAnchor() : null;
  keepInPlace(anchor, () => {
    root.classList.remove('video-split');
    document.querySelector('.video-embed--split')?.classList.remove('video-embed--split');
  });
  splitViewWatcher?.removeEventListener?.('change', onSplitViewWidthChange);
  splitViewWatcher = undefined;
}

/** Narrow screens: go to the player, and leave a way back to the paragraph the reader came from. */
export function offerReturn(top: number) {
  document.querySelector('.video-return')?.remove();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'video-return';
  button.textContent = english() ? '↩ Back to where I was reading' : '↩ 回到剛才讀的地方';
  button.addEventListener('click', () => {
    window.scrollTo({ top, behavior: 'smooth' });
    button.remove();
  });
  document.body.appendChild(button);
}

export function seekEmbeddedYoutube(frame: HTMLIFrameElement, seconds: number, anchor?: Element | null) {
  if (clearPracticePlayback(frame)) players.get(frame)?.setPlaybackRate?.(1);
  // Only one lecture should be talking at a time.
  for (const other of document.querySelectorAll<HTMLIFrameElement>('iframe[data-youtube-player]')) {
    if (other !== frame) (players.get(other) as (ClipPlayer & { pauseVideo?: () => void }) | undefined)?.pauseVideo?.();
  }
  const player = players.get(frame);
  if (typeof player?.seekTo === 'function') {
    player.seekTo(seconds, true);
    player.playVideo();
  } else {
    // The API has not bound this frame yet (still lazy, or blocked): reload it at the requested second.
    // Ordinary embeds carry no autoplay permission, so the reader presses play once.
    const src = new URL(frame.src);
    src.searchParams.set('start', String(seconds));
    frame.src = src.toString();
  }
  if (enterSplitView(frame, anchor)) return;
  const box = frame.getBoundingClientRect();
  if (box.bottom > 0 && box.top < window.innerHeight) return;
  offerReturn(window.scrollY);
  frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// A time link to a video already embedded on the page plays in that player instead of leaving for YouTube.
export function handleYoutubeTimeLinkClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]');
  if (!link || link.closest('.video-embed') || link.hasAttribute?.('data-practice-source')) return;
  const target = parseYoutubeTimeLink(link.href);
  if (!target) return;
  const frame = [...document.querySelectorAll<HTMLIFrameElement>('iframe[data-youtube-player]')].find((candidate) =>
    candidate.dataset.youtubeLoopStart === undefined && new URL(candidate.src).pathname === `/embed/${target.id}`);
  if (!frame) return;
  event.preventDefault();
  seekEmbeddedYoutube(frame, target.seconds, link);
}


function clearPracticePlayback(frame: HTMLIFrameElement): boolean {
  const practice = practiceControllers.get(frame);
  if (!practice) return false;
  practice.dispose();
  controllers.delete(practice);
  practiceControllers.delete(frame);
  return true;
}

/** Prefer the workbench player and keep practice controls beside the video. */
export async function playYoutubePractice(videoId: string, start: number, end: number, rate: number, loop: boolean, anchor: Element): Promise<boolean> {
  const frames = [...document.querySelectorAll<HTMLIFrameElement>('iframe[data-youtube-player]')]
    .filter((frame) => new URL(frame.src).pathname === `/embed/${videoId}`);
  const frame = frames.find((item) => anchor.contains(item)) ?? frames.find((item) => Number(item.dataset.youtubeLoopStart) === start && Number(item.dataset.youtubeLoopEnd) === end) ?? frames[0];
  if (!frame) return false;
  const currentGeneration = generation;
  await initYoutubeClipLoops(frame);
  const ready = readyPlayers.get(frame);
  if (!ready) return false;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const player = await Promise.race([ready, new Promise<null>((resolve) => { timeout = setTimeout(() => resolve(null), 8000); })]);
  clearTimeout(timeout);
  if (!player || generation !== currentGeneration || !frame.isConnected || !anchor.isConnected) return false;
  for (const other of document.querySelectorAll<HTMLIFrameElement>('iframe[data-youtube-player]')) {
    if (other !== frame) players.get(other)?.pauseVideo?.();
  }
  const previous = practiceControllers.get(frame);
  previous?.dispose();
  if (previous) controllers.delete(previous);
  // Dispose the old fixed loop before changing its bounds or turning looping off.
  for (const controller of controllers) controller.dispose();
  const controller = createPracticePlayback(player, start, end, loop);
  practiceControllers.set(frame, controller);
  controllers.add(controller);
  player.setPlaybackRate?.(rate);
  player.seekTo(start, true);
  player.playVideo();
  if (player.getPlayerState?.() === 1) controller.onStateChange(1);
  if (!anchor.contains(frame) && !enterSplitView(frame, anchor)) {
    const box = frame.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) {
      offerReturn(window.scrollY);
      frame.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
  return true;
}

/** Read only this workbench's ready source player; never substitute another video's clock. */
export function getPracticePlaybackTime(anchor: Element): number | null {
  const frame = anchor.querySelector<HTMLIFrameElement>('iframe[data-youtube-player]');
  if (!frame?.isConnected || readyPlayerGenerations.get(frame) !== generation) return null;
  const player = players.get(frame);
  if (!player) return null;
  try {
    const seconds = player.getCurrentTime();
    return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
  } catch {
    return null;
  }
}
