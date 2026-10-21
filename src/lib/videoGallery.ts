// src/lib/videoGallery.ts
/**
 * One player, one sideways rail. Clicking a thumbnail swaps the iframe, so a post
 * with nine route videos still loads exactly one player. Without JS the cards are
 * ordinary links to YouTube, and the first clip is already in the player.
 */

const embedSrc = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1`;

let cleanup: (() => void) | undefined;

function setup(gallery: HTMLElement): () => void {
  const player = gallery.querySelector<HTMLIFrameElement>('[data-video-gallery-player]');
  const now = gallery.querySelector<HTMLElement>('[data-video-gallery-now]');
  const rail = gallery.querySelector<HTMLElement>('[data-video-gallery-rail]');
  const prev = gallery.querySelector<HTMLButtonElement>('[data-video-gallery-prev]');
  const next = gallery.querySelector<HTMLButtonElement>('[data-video-gallery-next]');
  if (!rail) return () => {};

  const cards = [...rail.querySelectorAll<HTMLAnchorElement>('[data-video-gallery-pick]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior: ScrollBehavior = reduced.matches ? 'auto' : 'smooth';

  const syncNav = () => {
    if (!prev || !next) return;
    const overflows = rail.scrollWidth > rail.clientWidth + 4;
    const atStart = rail.scrollLeft <= 2;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    prev.hidden = !overflows;
    next.hidden = !overflows;
    prev.disabled = atStart;
    next.disabled = atEnd;
  };

  const select = (card: HTMLAnchorElement) => {
    const id = card.dataset.videoId;
    if (!id) return;
    if (player && player.getAttribute('src') !== embedSrc(id)) player.src = embedSrc(id);
    if (player) player.title = card.dataset.videoTitle ?? player.title;
    if (now) now.textContent = card.dataset.videoLabel ?? '';
    for (const other of cards) {
      if (other === card) other.setAttribute('aria-current', 'true');
      else other.removeAttribute('aria-current');
    }
    card.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior });
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const card = target?.closest<HTMLAnchorElement>('[data-video-gallery-pick]');
    if (!card || !rail.contains(card)) return;
    // Keep the watch link for middle-click / open-in-new-tab, but a plain click
    // should not navigate away from the post.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    select(card);
  };

  const step = (direction: 1 | -1) => {
    rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.8, 160), behavior });
  };
  const onPrev = () => step(-1);
  const onNext = () => step(1);

  rail.addEventListener('click', onClick);
  rail.addEventListener('scroll', syncNav, { passive: true });
  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);

  const observer = new ResizeObserver(syncNav);
  observer.observe(rail);
  syncNav();

  return () => {
    rail.removeEventListener('click', onClick);
    rail.removeEventListener('scroll', syncNav);
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
    observer.disconnect();
  };
}

export function initVideoGallery() {
  disposeVideoGallery();
  const teardown = [...document.querySelectorAll<HTMLElement>('[data-video-gallery]')].map(setup);
  cleanup = () => {
    for (const fn of teardown) fn();
  };
}

export function disposeVideoGallery() {
  cleanup?.();
  cleanup = undefined;
}
