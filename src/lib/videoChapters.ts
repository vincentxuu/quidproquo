// Video posts: chapter times in the TOC and beside the pinned player, plus a corner mini player.
// Chapters come from the article itself: a section counts when one of its first blocks links to a
// moment in a video embedded on the page (the course guides put "Recording 07:35–22:01" under each heading).
import { showDockedSlides } from './slideReader';
import { parseYoutubeTimeLink, pauseEmbeddedYoutube, seekEmbeddedYoutube } from './youtubeClipLoop';

export interface Chapter {
  videoId: string;
  headingId: string;
  title: string;
  seconds: number;
  frame: HTMLIFrameElement;
  /** The slide page the section starts on, when the guide pairs the lecture with its deck. */
  slidePage?: number;
}

/** Blocks after a heading that may hold its start-time link; later links are citations, not chapter starts. */
const LEAD_BLOCKS = 3;
const MIN_CHAPTERS = 2;
const MINI_PLAYER_QUERY = '(min-width: 700px)';
const PLAYING = 1;
const BUFFERING = 3;

export function formatTimestamp(total: number): string {
  const seconds = Math.max(0, Math.floor(total));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${String(m).padStart(2, '0')}:${s}`;
}

/** Chapters are only worth showing when they all point into one video and there are several of them. */
export function pickChapters<T extends { videoId: string }>(candidates: T[]): T[] {
  if (candidates.length < MIN_CHAPTERS) return [];
  const counts = new Map<string, number>();
  for (const c of candidates) counts.set(c.videoId, (counts.get(c.videoId) ?? 0) + 1);
  const [main, count] = [...counts].sort((a, b) => b[1] - a[1])[0];
  return count >= MIN_CHAPTERS ? candidates.filter((c) => c.videoId === main) : [];
}

const english = () => document.documentElement.lang.startsWith('en');

function embeddedFrames(): Map<string, HTMLIFrameElement> {
  const frames = new Map<string, HTMLIFrameElement>();
  for (const frame of document.querySelectorAll<HTMLIFrameElement>('.content .video-embed iframe[data-youtube-player]')) {
    // Clip loops replay a fixed segment; they are not the lecture recording.
    if (frame.dataset.youtubeLoopStart !== undefined) continue;
    const id = new URL(frame.src).pathname.split('/').pop();
    if (id && !frames.has(id)) frames.set(id, frame);
  }
  return frames;
}

const CLOCK_LABEL = /^\D*(\d{1,2}):(\d{2})(?::(\d{2}))?/;

/** A section's start link: watch?v=ID&t=455s, or a link labelled "Recording 00:00–07:35" that starts at zero. */
export function chapterLink(link: { href: string; textContent: string | null }): { id: string; seconds: number } | null {
  const timed = parseYoutubeTimeLink(link.href);
  if (timed) return timed;
  const clock = link.textContent?.trim().match(CLOCK_LABEL);
  if (!clock || clock.slice(1).some((part) => part !== undefined && Number(part) !== 0)) return null;
  const id = parseYoutubeTimeLink(`${link.href}${link.href.includes('?') ? '&' : '?'}t=0s`)?.id;
  return id ? { id, seconds: 0 } : null;
}

export function collectChapters(): Chapter[] {
  const frames = embeddedFrames();
  if (!frames.size) return [];
  const candidates: Chapter[] = [];
  for (const heading of document.querySelectorAll<HTMLElement>('.content h2[id], .content h3[id]')) {
    let block = heading.nextElementSibling;
    let time: { id: string; seconds: number } | null | undefined;
    let slidePage: number | undefined;
    for (let i = 0; block && i < LEAD_BLOCKS && !/^H[23]$/.test(block.tagName); i++, block = block.nextElementSibling) {
      time ??= [...block.querySelectorAll<HTMLAnchorElement>('a[href]')]
        .map(chapterLink)
        .find((t) => t && frames.has(t.id));
      const page = Number(block.querySelector<HTMLElement>('[data-slide-page]')?.dataset.slidePage);
      if (slidePage === undefined && Number.isInteger(page) && page > 0) slidePage = page;
    }
    if (time) candidates.push({ headingId: heading.id, title: heading.textContent?.trim() ?? '', seconds: time.seconds, frame: frames.get(time.id)!, videoId: time.id, slidePage });
  }
  return pickChapters(candidates);
}

function playChapter(chapter: Chapter, scrollToHeading: boolean) {
  const heading = document.getElementById(chapter.headingId);
  if (scrollToHeading) heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (chapter.slidePage) showDockedSlides(chapter.slidePage);
  // The embed was replaced by a "watch on YouTube" notice (embedding refused): go there instead.
  if (!chapter.frame.isConnected) {
    window.open(`https://www.youtube.com/watch?v=${chapter.videoId}&t=${chapter.seconds}s`, '_blank', 'noopener');
    return;
  }
  seekEmbeddedYoutube(chapter.frame, chapter.seconds, heading);
}

function timeButton(chapter: Chapter, className: string, label: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.videoChapter = '';
  const time = formatTimestamp(chapter.seconds);
  button.setAttribute('aria-label', english() ? `Play from ${time}: ${chapter.title}` : `從 ${time} 播放：${chapter.title}`);
  button.textContent = label || time;
  return button;
}

/** The sidebar TOC gains a play-from time beside each chaptered heading. */
function decorateToc(chapters: Chapter[]) {
  for (const chapter of chapters) {
    const link = document.querySelector<HTMLAnchorElement>(`.post-sidebar .toc a[href="#${CSS.escape(chapter.headingId)}"]`);
    if (!link || link.parentElement?.querySelector(':scope > .toc-time')) continue;
    const button = timeButton(chapter, 'toc-time', '');
    button.addEventListener('click', () => playChapter(chapter, true));
    link.parentNode?.insertBefore(button, link.nextSibling);
  }
}

/** Split view hides the sidebar, so the pinned player carries its own chapter list. */
function renderPlayerChapters(chapters: Chapter[]) {
  const figure = chapters[0].frame.closest<HTMLElement>('.video-embed');
  if (!figure || figure.querySelector('.video-chapters')) return;
  const nav = document.createElement('nav');
  nav.className = 'video-chapters';
  nav.setAttribute('aria-label', english() ? 'Video chapters' : '影片章節');
  const list = document.createElement('ol');
  for (const chapter of chapters) {
    const item = document.createElement('li');
    const button = timeButton(chapter, 'video-chapters__item', '');
    const time = document.createElement('span');
    time.className = 'video-chapters__time';
    time.textContent = formatTimestamp(chapter.seconds);
    const title = document.createElement('span');
    title.className = 'video-chapters__title';
    title.textContent = chapter.title;
    button.replaceChildren(time, title);
    button.addEventListener('click', () => playChapter(chapter, true));
    item.appendChild(button);
    list.appendChild(item);
  }
  nav.appendChild(list);
  figure.appendChild(nav);
}

// ── Reader preferences ──
// Kept per browser; storage can be unavailable (private mode, blocked site data), so every access is guarded.
const LARGE_KEY = 'qpq:video-sidebar-large';
const VIDEO_FIRST_KEY = 'qpq:video-slides-video-first';
const PIP_CORNER_KEY = 'qpq:video-pip-corner';
const MINI_KEY = 'qpq:video-mini-width';
const CORNER_KEY = 'qpq:video-mini-corner';
const SIDEBAR_DEFAULT = 340;
const MINI_DEFAULT = 320;

function readPref(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function savePref(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* per-viewer convenience only */ }
}

export function clampSize(value: number, min: number, max: number): number {
  return Math.round(Math.min(Math.max(value, min), Math.max(min, max)));
}

export type Corner = 'bl' | 'br' | 'tl' | 'tr';
const CORNERS: Corner[] = ['bl', 'br', 'tl', 'tr'];

/**
 * Where a movable window sits, as fractions of the room it can travel in: 0 is the left/top edge,
 * 1 the right/bottom edge. Fractions instead of pixels keep it inside when the window or the box resizes.
 */
export interface Spot { x: number; y: number }
export interface Area { left: number; top: number; width: number; height: number }

const unit = (value: number) => Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), 1);

export function cornerSpot(corner: Corner): Spot {
  return { x: corner.endsWith('r') ? 1 : 0, y: corner.startsWith('b') ? 1 : 0 };
}

/** The quadrant a spot is in; the controls sit on the side facing the middle. */
export function spotCorner(spot: Spot): Corner {
  return `${spot.y < 0.5 ? 't' : 'b'}${spot.x < 0.5 ? 'l' : 'r'}` as Corner;
}

/** Top-left pixel position of a box of the given size at a spot inside an area. */
export function placeBox(spot: Spot, width: number, height: number, area: Area): { left: number; top: number } {
  return {
    left: Math.round(area.left + unit(spot.x) * Math.max(0, area.width - width)),
    top: Math.round(area.top + unit(spot.y) * Math.max(0, area.height - height)),
  };
}

/** The spot for a box dropped at a pixel position; positions past the edges clamp to them. */
export function spotFromBox(left: number, top: number, width: number, height: number, area: Area): Spot {
  const roomX = area.width - width;
  const roomY = area.height - height;
  return {
    x: roomX > 0 ? unit((left - area.left) / roomX) : 0,
    y: roomY > 0 ? unit((top - area.top) / roomY) : 0,
  };
}

/** A saved spot ("0.25,1"), or a corner saved by the earlier corner-only version. */
export function parseSpot(saved: string | null, fallback: Corner): Spot {
  if (saved && CORNERS.includes(saved as Corner)) return cornerSpot(saved as Corner);
  const [x, y] = (saved ?? '').split(',').map(Number);
  if (saved && Number.isFinite(x) && Number.isFinite(y)) return { x: unit(x), y: unit(y) };
  return cornerSpot(fallback);
}

const spotText = (spot: Spot) => `${spot.x.toFixed(3)},${spot.y.toFixed(3)}`;

/** Arrow keys nudge a spot by a tenth of the room (Shift: to the edge). */
export function spotAfterKey(spot: Spot, key: string, toEdge = false): Spot | null {
  const step = toEdge ? 1 : 0.1;
  const delta = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] }[key];
  if (!delta) return null;
  return { x: unit(spot.x + delta[0]), y: unit(spot.y + delta[1]) };
}

/** Arrow keys move the player to the neighbouring corner in that direction. */
export function cornerAfterKey(corner: Corner, key: string): Corner | null {
  const [v, h] = corner.split('') as ['t' | 'b', 'l' | 'r'];
  const next = { ArrowUp: `t${h}`, ArrowDown: `b${h}`, ArrowLeft: `${v}l`, ArrowRight: `${v}r` }[key];
  return (next as Corner | undefined) ?? null;
}

/** Drag on pointer, with pointer capture so the iframe never swallows the moves. */
function onDrag(handle: HTMLElement, cursorClass: string, handlers: {
  start?: (e: PointerEvent) => void;
  move: (e: PointerEvent, from: { x: number; y: number }) => void;
  end: (e: PointerEvent) => void;
}) {
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const from = { x: event.clientX, y: event.clientY };
    try { handle.setPointerCapture(event.pointerId); } catch { /* still works while the pointer stays on the handle */ }
    document.documentElement.classList.add('video-dragging', cursorClass);
    handlers.start?.(event);
    const move = (e: PointerEvent) => handlers.move(e, from);
    const end = (e: PointerEvent) => {
      document.documentElement.classList.remove('video-dragging', cursorClass);
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      handlers.end(e);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  });
}

// ── Mini player ──
let teardown: (() => void)[] = [];

function initMiniPlayer() {
  const wide = window.matchMedia?.(MINI_PLAYER_QUERY);
  if (!wide || typeof IntersectionObserver === 'undefined') return;
  for (const frame of embeddedFrames().values()) {
    const figure = frame.closest<HTMLElement>('.video-embed');
    const box = frame.parentElement;
    if (!figure || !box) continue;
    let playing = false;
    let dismissed = false;
    let inView = true;

    const dismiss = () => {
      dismissed = true;
      pauseEmbeddedYoutube(frame);
      update();
    };

    // Controls live inside the floating box so they follow it to whichever corner it sits in.
    const bar = document.createElement('div');
    bar.className = 'video-float__bar';
    const mover = document.createElement('button');
    mover.type = 'button';
    mover.className = 'video-float__move';
    mover.textContent = english() ? '⠿ Move' : '⠿ 移動';
    mover.setAttribute('aria-label', english() ? 'Move mini player: drag anywhere, or use arrow keys' : '移動小視窗：拖到任何位置，或用方向鍵');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'video-float__close';
    close.textContent = english() ? 'Close ×' : '關閉 ×';
    close.setAttribute('aria-keyshortcuts', 'Escape');
    close.addEventListener('click', dismiss);
    bar.appendChild(mover);
    bar.appendChild(close);

    const grip = document.createElement('div');
    grip.className = 'video-float__resize';
    grip.tabIndex = 0;
    grip.setAttribute('role', 'separator');
    grip.setAttribute('aria-orientation', 'vertical');
    grip.setAttribute('aria-label', english() ? 'Resize mini player: drag, or ↑ ↓' : '調整小視窗大小：拖曳，或按 ↑ ↓');
    box.appendChild(bar);
    box.appendChild(grip);

    // Size
    let miniWidth = MINI_DEFAULT;
    const setMini = (value: number) => {
      miniWidth = clampSize(value, 240, Math.min(720, window.innerWidth * 0.6));
      figure.style.setProperty('--mini-width', `${miniWidth}px`);
      grip.setAttribute('aria-valuenow', String(miniWidth));
    };
    setMini(Number(readPref(MINI_KEY)) || MINI_DEFAULT);
    let sizeAtStart = miniWidth;
    onDrag(grip, 'video-dragging--resize', {
      start: () => { sizeAtStart = miniWidth; },
      // The grip sits on the corner facing the middle of the screen; pulling it toward the middle grows the player.
      move: (e, from) => {
        const corner = spotCorner(spot);
        const dx = (e.clientX - from.x) * (corner.endsWith('l') ? 1 : -1);
        const dy = (e.clientY - from.y) * (corner.startsWith('b') ? -1 : 1);
        setMini(sizeAtStart + Math.max(dx, dy * 16 / 9));
        position();
      },
      end: () => savePref(MINI_KEY, String(miniWidth)),
    });
    grip.addEventListener('keydown', (event) => {
      const delta = { ArrowUp: 20, ArrowRight: 20, ArrowDown: -20, ArrowLeft: -20 }[event.key];
      if (event.key === 'Home') setMini(MINI_DEFAULT);
      else if (delta !== undefined) setMini(miniWidth + delta);
      else return;
      position();
      event.preventDefault();
      savePref(MINI_KEY, String(miniWidth));
    });

    // Position: anywhere on screen, kept as fractions so a resized window never pushes it off screen.
    // The room leaves the page edges free and the header strip clear.
    const room = (): Area => ({ left: 24, top: 56, width: window.innerWidth - 48, height: window.innerHeight - 56 - 24 });
    let spot = parseSpot(readPref(CORNER_KEY), 'bl');
    const position = () => {
      const at = placeBox(spot, miniWidth, miniWidth * 9 / 16, room());
      figure.style.setProperty('--mini-left', `${at.left}px`);
      figure.style.setProperty('--mini-top', `${at.top}px`);
    };
    const setSpot = (next: Spot, save = true) => {
      spot = next;
      position();
      if (save) {
        figure.dataset.corner = spotCorner(spot);
        savePref(CORNER_KEY, spotText(spot));
      }
    };
    figure.dataset.corner = spotCorner(spot);
    position();
    let startAt = { left: 0, top: 0 };
    onDrag(mover, 'video-dragging--move', {
      start: () => { startAt = placeBox(spot, miniWidth, miniWidth * 9 / 16, room()); },
      // Controls switch sides only on release, so the handle never jumps out from under the pointer.
      move: (e, from) => setSpot(spotFromBox(startAt.left + e.clientX - from.x, startAt.top + e.clientY - from.y, miniWidth, miniWidth * 9 / 16, room()), false),
      end: () => setSpot(spot),
    });
    mover.addEventListener('keydown', (event) => {
      const next = spotAfterKey(spot, event.key, event.shiftKey);
      if (!next) return;
      event.preventDefault();
      setSpot(next);
    });
    window.addEventListener('resize', position);

    const update = () => {
      const split = document.documentElement.classList.contains('video-split');
      const float = playing && !dismissed && !inView && !split && wide.matches;
      if (float === figure.classList.contains('video-embed--floating')) return;
      if (float) figure.style.setProperty('--held-height', `${box.getBoundingClientRect().height}px`);
      figure.classList.toggle('video-embed--floating', float);
    };

    const onKey = (event: KeyboardEvent) => {
      // Escape belongs to whatever popup is open first (glossary, menus); only a free Escape closes the player.
      if (event.key !== 'Escape' || event.defaultPrevented || !figure.classList.contains('video-embed--floating')) return;
      if (document.querySelector('dialog[open], [role="dialog"]:not([hidden])')) return;
      dismiss();
    };

    const onState = (event: Event) => {
      const state = (event as CustomEvent<number>).detail;
      playing = state === PLAYING || state === BUFFERING;
      if (state === PLAYING) dismissed = false;
      update();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: 0.25 });
    observer.observe(figure);
    const htmlWatcher = new MutationObserver(update);
    htmlWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    frame.addEventListener('youtube-state', onState);
    wide.addEventListener?.('change', update);
    document.addEventListener('keydown', onKey);

    teardown.push(() => {
      observer.disconnect();
      htmlWatcher.disconnect();
      frame.removeEventListener('youtube-state', onState);
      wide.removeEventListener?.('change', update);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', position);
      figure.classList.remove('video-embed--floating');
      figure.style.removeProperty('--mini-width');
      figure.style.removeProperty('--mini-left');
      figure.style.removeProperty('--mini-top');
      delete figure.dataset.corner;
      bar.remove();
      grip.remove();
    });
  }
}

// ── Sidebar dock ──
// Most guides embed the lecture in a sources section near the end, so on desktop the main player moves
// into the sticky sidebar above the TOC, where it stays beside the text from the first paragraph.
const DOCK_QUERY = '(min-width: 1000px)';

function canDock(sidebar: HTMLElement): boolean {
  if (document.querySelector('.video-practice')) return false;
  return getComputedStyle(sidebar).display !== 'none';
}

/**
 * Video + slides use picture-in-picture (as Kaltura and Panopto do): one fills the column, the other
 * sits small in a corner. The stage (16:9 plus PDF.js's toolbar) and a control row must leave the TOC
 * some room in one screen height; the article keeps at least ~600px and Ask AI keeps its corner.
 */
export function pipSidebarWidth(viewportWidth: number, viewportHeight: number): number {
  return clampSize(Math.min((viewportHeight - 290) * 16 / 9, viewportWidth * 0.6), SIDEBAR_DEFAULT, viewportWidth - 690);
}

/** The small window's next corner when the reader presses "move" (clockwise). */
export function nextPipCorner(corner: Corner): Corner {
  return ({ br: 'bl', bl: 'tl', tl: 'tr', tr: 'br' } as const)[corner];
}

/** Large is theater-like: half the screen, while the article keeps at least ~600px. */
export function sidebarWidth(large: boolean, viewport: number): number {
  return large ? clampSize(viewport * 0.5 - 24, SIDEBAR_DEFAULT, viewport - 690) : SIDEBAR_DEFAULT;
}

function pipButton(className: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `video-pip__btn ${className}`;
  return button;
}

function initSidebarDock(frame: HTMLIFrameElement) {
  const figure = frame.closest<HTMLElement>('.video-embed');
  const sidebar = document.querySelector<HTMLElement>('.post-sidebar');
  const wide = window.matchMedia?.(DOCK_QUERY);
  // A post with its own related-video card already has a sidebar player.
  if (!figure || !sidebar || !wide || sidebar.querySelector('.video-card')) return;

  const home = document.createElement('p');
  home.className = 'video-embed__docked-note';
  home.hidden = true;
  home.textContent = english() ? 'The video plays in the sidebar on the right.' : '影片在右側欄播放。';
  figure.parentNode?.insertBefore(home, figure);

  const grid = sidebar.closest<HTMLElement>('.post-grid');
  const root = document.documentElement;
  const slides = document.querySelector<HTMLDialogElement>('.slide-reader-panel');
  const toc = sidebar.querySelector<HTMLDetailsElement>('.toc');
  const tocWasOpen = toc?.open ?? false;
  const withSlides = () => !!slides && sidebar.contains(slides);

  // Video only — like YouTube's theater button: two sizes, one toggle.
  let large = readPref(LARGE_KEY) === '1';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'video-embed__size-toggle';
  toggle.addEventListener('click', () => {
    large = !large;
    savePref(LARGE_KEY, large ? '1' : '0');
    applySize();
  });

  // Video + slides — picture-in-picture controls: swap, move the small window, hide it.
  let videoFirst = readPref(VIDEO_FIRST_KEY) === '1';
  let pipSpot = parseSpot(readPref(PIP_CORNER_KEY), 'br');
  let pipHidden = false;
  // A grab strip just above the small window: the window itself is an iframe and cannot take the drag.
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'video-pip__handle';
  handle.textContent = '⠿';
  handle.setAttribute('aria-label', english() ? 'Move the small window: drag anywhere, or use arrow keys' : '移動小窗：拖到任何位置，或用方向鍵');
  const bar = document.createElement('div');
  bar.className = 'video-pip__bar';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', english() ? 'Video and slides layout' : '影片與投影片版面');
  const swap = pipButton('video-pip__swap');
  const move = pipButton('video-pip__move');
  move.textContent = english() ? '↻ Next corner' : '↻ 換角落';
  move.setAttribute('aria-label', english() ? 'Move the small window to the next corner (arrow keys pick a corner)' : '把小窗移到下一個角（方向鍵可直接選角）');
  const hide = pipButton('video-pip__hide');
  bar.appendChild(swap);
  bar.appendChild(move);
  bar.appendChild(hide);

  // The small window travels over the large one, below PDF.js's toolbar when the slides are large,
  // with the grab strip kept inside the stage.
  const HANDLE = 18;
  const GAP = 8;
  const pipBoxes = () => {
    const small = videoFirst ? slides : figure;
    const large = videoFirst ? figure : slides;
    if (!small || !large || !withSlides()) return null;
    const stage = large.getBoundingClientRect();
    const box = small.getBoundingClientRect();
    const top = (videoFirst ? 0 : 34) + GAP + HANDLE;
    const area: Area = { left: GAP, top, width: stage.width - 2 * GAP, height: stage.height - top - GAP };
    return { area, width: box.width, height: box.height };
  };
  const positionPip = () => {
    const boxes = pipBoxes();
    if (!boxes) return;
    const at = placeBox(pipSpot, boxes.width, boxes.height, boxes.area);
    sidebar.style.setProperty('--pip-x', `${at.left}px`);
    sidebar.style.setProperty('--pip-y', `${at.top}px`);
  };
  const setPipSpot = (next: Spot, save = true) => {
    pipSpot = next;
    positionPip();
    if (save) savePref(PIP_CORNER_KEY, spotText(pipSpot));
  };
  let pipStart = { left: 0, top: 0 };
  onDrag(handle, 'video-dragging--move', {
    start: () => {
      const boxes = pipBoxes();
      if (boxes) pipStart = placeBox(pipSpot, boxes.width, boxes.height, boxes.area);
    },
    move: (e, from) => {
      const boxes = pipBoxes();
      if (boxes) setPipSpot(spotFromBox(pipStart.left + e.clientX - from.x, pipStart.top + e.clientY - from.y, boxes.width, boxes.height, boxes.area), false);
    },
    end: () => setPipSpot(pipSpot),
  });
  handle.addEventListener('keydown', (event) => {
    const next = spotAfterKey(pipSpot, event.key, event.shiftKey);
    if (!next) return;
    event.preventDefault();
    setPipSpot(next);
  });

  const applyPip = () => {
    sidebar.classList.toggle('post-sidebar--video-first', videoFirst);
    sidebar.classList.toggle('post-sidebar--pip-hidden', pipHidden);
    swap.textContent = videoFirst ? (english() ? '⇄ Slides large' : '⇄ 投影片放大') : (english() ? '⇄ Video large' : '⇄ 影片放大');
    hide.textContent = pipHidden ? (english() ? 'Show small window' : '顯示小窗') : (english() ? 'Hide small window' : '隱藏小窗');
    hide.setAttribute('aria-pressed', String(pipHidden));
    move.disabled = pipHidden;
    handle.hidden = pipHidden;
    positionPip();
  };
  swap.addEventListener('click', () => {
    videoFirst = !videoFirst;
    savePref(VIDEO_FIRST_KEY, videoFirst ? '1' : '0');
    applyPip();
  });
  move.addEventListener('click', () => setPipSpot(cornerSpot(nextPipCorner(spotCorner(pipSpot)))));
  move.addEventListener('keydown', (event) => {
    const next = cornerAfterKey(spotCorner(pipSpot), event.key);
    if (!next) return;
    event.preventDefault();
    setPipSpot(cornerSpot(next));
  });
  // Hidden keeps playing: the small video's sound continues, as in Kaltura's hide.
  hide.addEventListener('click', () => { pipHidden = !pipHidden; applyPip(); });

  const applySize = () => {
    if (withSlides()) {
      root.style.setProperty('--video-sidebar-width', `${pipSidebarWidth(window.innerWidth, window.innerHeight)}px`);
      positionPip();
      return;
    }
    root.style.setProperty('--video-sidebar-width', `${sidebarWidth(large, window.innerWidth)}px`);
    // Nothing to enlarge into on a narrow desktop.
    toggle.hidden = sidebarWidth(true, window.innerWidth) <= SIDEBAR_DEFAULT + 40;
    toggle.setAttribute('aria-pressed', String(large));
    toggle.textContent = large ? (english() ? '⤡ Smaller video' : '⤡ 還原大小') : (english() ? '⤢ Larger video' : '⤢ 放大影片');
  };
  applySize();
  window.addEventListener('resize', applySize);

  const place = () => {
    const dock = wide.matches && canDock(sidebar);
    if (dock === sidebar.contains(figure)) return;
    // Moving an iframe reloads it; that only happens on a layout change, never during reading.
    if (dock) sidebar.insertBefore(figure, sidebar.firstChild);
    else home.parentNode?.insertBefore(figure, home.nextSibling);
    home.hidden = !dock;
    sidebar.classList.toggle('post-sidebar--video', dock);
    figure.classList.toggle('video-embed--docked', dock);
    root.classList.toggle('has-video-dock', dock);
    grid?.classList.toggle('post-grid--video', dock);
    const caption = figure.querySelector('figcaption');
    if (slides) {
      // Text on the left; on the right one stage holds video and slides, one large and one small.
      if (dock) {
        sidebar.insertBefore(slides, figure.nextSibling);
        sidebar.insertBefore(handle, slides.nextSibling);
        sidebar.insertBefore(bar, handle.nextSibling);
        slides.classList.add('slide-reader-panel--docked');
        if (toc) toc.open = true;
        showDockedSlides();
        applyPip();
      } else {
        bar.remove();
        handle.remove();
        sidebar.classList.remove('post-sidebar--video-first', 'post-sidebar--pip-hidden');
        sidebar.style.removeProperty('--pip-x');
        sidebar.style.removeProperty('--pip-y');
        slides.classList.remove('slide-reader-panel--docked');
        if (slides.open) slides.close();
        document.body.appendChild(slides);
        if (toc) toc.open = tocWasOpen;
      }
      sidebar.classList.toggle('post-sidebar--slides', dock);
      root.classList.toggle('has-docked-slides', dock);
    } else if (dock && caption) caption.insertBefore(toggle, caption.firstChild);
    else toggle.remove();
    applySize();
  };
  place();
  wide.addEventListener?.('change', place);
  // Opening the Ask AI panel can hide the sidebar at some widths.
  const bodyWatcher = new MutationObserver(place);
  bodyWatcher.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  teardown.push(() => {
    wide.removeEventListener?.('change', place);
    window.removeEventListener('resize', applySize);
    bodyWatcher.disconnect();
    if (sidebar.contains(figure)) home.parentNode?.insertBefore(figure, home.nextSibling);
    sidebar.classList.remove('post-sidebar--video');
    figure.classList.remove('video-embed--docked');
    root.classList.remove('has-video-dock');
    root.style.removeProperty('--video-sidebar-width');
    grid?.classList.remove('post-grid--video');
    toggle.remove();
    bar.remove();
    handle.remove();
    home.remove();
    if (slides?.isConnected && sidebar.contains(slides)) {
      slides.classList.remove('slide-reader-panel--docked');
      if (slides.open) slides.close();
      document.body.appendChild(slides);
    }
    sidebar.classList.remove('post-sidebar--slides', 'post-sidebar--video-first', 'post-sidebar--pip-hidden');
    sidebar.style.removeProperty('--pip-x');
    sidebar.style.removeProperty('--pip-y');
    root.classList.remove('has-docked-slides');
    if (toc) toc.open = tocWasOpen;
  });
}

export function initVideoChapters(options: { sidebar: boolean; chapters: boolean; miniPlayer: boolean }) {
  disposeVideoChapters();
  if (!document.body.classList.contains('is-article')) return;
  const chapters = options.chapters ? collectChapters() : [];
  if (chapters.length) {
    decorateToc(chapters);
    renderPlayerChapters(chapters);
    teardown.push(() => {
      document.querySelectorAll('.toc-time').forEach((el) => el.remove());
      document.querySelectorAll('.video-chapters').forEach((el) => el.remove());
    });
  }
  // The main player is the one the chapters point into, or else the first lecture embedded on the page.
  const main = chapters[0]?.frame ?? embeddedFrames().values().next().value;
  // The mini player binds to embeds where the article put them, so it runs before the dock moves one.
  if (options.miniPlayer) initMiniPlayer();
  if (options.sidebar && main) initSidebarDock(main);
}

export function disposeVideoChapters() {
  for (const undo of teardown.reverse()) undo();
  teardown = [];
}
