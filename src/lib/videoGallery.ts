// src/lib/videoGallery.ts
/**
 * One player, one sideways rail. Clicking a thumbnail swaps the iframe, so a post
 * with nine route videos still loads exactly one player. Without JS the cards are
 * ordinary links to YouTube, and the first clip is already in the player.
 */

const embedSrc = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1`;

let cleanup: (() => void) | undefined;

/** A swipe or native scrolling gesture must never activate the release target. */
export function createGalleryClickGuard() {
  let origin: { x: number; y: number; left: number; top: number } | undefined;
  let moved = false;
  return {
    begin(x: number, y: number, left: number, top: number) {
      origin = { x, y, left, top };
      moved = false;
    },
    move(x: number, y: number) {
      if (origin && Math.hypot(x - origin.x, y - origin.y) > 8) moved = true;
    },
    scroll(left: number, top: number) {
      if (origin && Math.hypot(left - origin.left, top - origin.top) > 8) moved = true;
    },
    cancel() { moved = true; },
    suppress(detail: number) { return detail !== 0 && moved; },
  };
}

function protectGalleryClicks(surface: HTMLElement): () => void {
  const guard = createGalleryClickGuard();
  let pointerId: number | undefined;
  const down = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointerId = event.pointerId;
    guard.begin(event.clientX, event.clientY, surface.scrollLeft, surface.scrollTop);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerId === pointerId) guard.move(event.clientX, event.clientY);
  };
  const up = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    guard.move(event.clientX, event.clientY);
    pointerId = undefined;
  };
  const cancel = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    guard.cancel();
    pointerId = undefined;
  };
  const scroll = () => { if (pointerId !== undefined) guard.cancel(); };
  const click = (event: MouseEvent) => {
    if (!guard.suppress(event.detail)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const drag = (event: DragEvent) => event.preventDefault();
  surface.addEventListener('pointerdown', down, { capture: true, passive: true });
  surface.addEventListener('click', click, true);
  surface.addEventListener('dragstart', drag);
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerup', up, { passive: true });
  window.addEventListener('pointercancel', cancel, { passive: true });
  window.addEventListener('scroll', scroll, { capture: true, passive: true });
  return () => {
    surface.removeEventListener('pointerdown', down, true);
    surface.removeEventListener('click', click, true);
    surface.removeEventListener('dragstart', drag);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
    window.removeEventListener('scroll', scroll, true);
  };
}

function setup(gallery: HTMLElement): () => void {
  const player = gallery.querySelector<HTMLIFrameElement>('[data-video-gallery-player]');
  const now = gallery.querySelector<HTMLElement>('[data-video-gallery-now]');
  const rail = gallery.querySelector<HTMLElement>('[data-video-gallery-rail]');
  const prev = gallery.querySelector<HTMLButtonElement>('[data-video-gallery-prev]');
  const next = gallery.querySelector<HTMLButtonElement>('[data-video-gallery-next]');
  if (!rail) return () => {};

  const cards = [...rail.querySelectorAll<HTMLElement>('[data-video-gallery-pick]')];
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

  const select = (card: HTMLElement) => {
    const id = card.dataset.videoId;
    if (!id) return;
    if (player && player.getAttribute('src') !== embedSrc(id)) player.src = embedSrc(id);
    if (player) player.title = card.dataset.videoTitle ?? player.title;
    if (now) now.textContent = card.dataset.videoLabel ?? '';
    for (const other of cards) {
      if (other === card) other.setAttribute('aria-current', 'true');
      else other.removeAttribute('aria-current');
    }
    if (!gallery.classList.contains('video-gallery--playlist')) card.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior });
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const card = target?.closest<HTMLElement>('[data-video-gallery-pick]');
    if (!card || !rail.contains(card)) return;
    // Keep the watch link for middle-click / open-in-new-tab, but a plain click
    // should not navigate away from the post.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    select(card);
  };

  const unprotect = protectGalleryClicks(rail);
  const onScroll = () => syncNav();
  const step = (direction: 1 | -1) => {
    rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.8, 160), behavior });
  };
  const onPrev = () => step(-1);
  const onNext = () => step(1);

  rail.addEventListener('click', onClick);
  rail.addEventListener('scroll', onScroll, { passive: true });
  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);

  const observer = new ResizeObserver(syncNav);
  observer.observe(rail);
  syncNav();

  return () => {
    unprotect();
    rail.removeEventListener('click', onClick);
    rail.removeEventListener('scroll', onScroll);
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
    observer.disconnect();
  };
}

export function initVideoGallery() {
  disposeVideoGallery();
  const teardown = [
    ...[...document.querySelectorAll<HTMLElement>('[data-video-gallery]')].map(setup),
    ...[...document.querySelectorAll<HTMLElement>('[data-route-videos]')].map(setupRouteVideos),
  ];
  cleanup = () => {
    for (const fn of teardown) fn();
  };
}

export function disposeVideoGallery() {
  cleanup?.();
  cleanup = undefined;
}

function setupRouteVideos(root: HTMLElement): () => void {
  const panel = root.querySelector<HTMLElement>('[data-route-panel]');
  const content = root.querySelector<HTMLElement>('[data-route-content]');
  const heading = root.querySelector<HTMLElement>('[data-route-heading]');
  const close = root.querySelector<HTMLButtonElement>('[data-route-close]');
  if (!panel || !content || !heading || !close) return () => {};
  const unprotect = protectGalleryClicks(root);
  const narrow = window.matchMedia('(max-width: 63.99rem)');
  let active: HTMLButtonElement | undefined;
  let slot: HTMLTableRowElement | undefined;
  let disposeGallery: (() => void) | undefined;
  const place = () => {
    if (!active) return;
    const previousSlot = slot;
    slot = undefined;
    const movePanel = (container: HTMLElement) => {
      const target = container as HTMLElement & { moveBefore?: (node: Node, child: Node | null) => void };
      if (target.moveBefore) target.moveBefore(panel, null);
      else target.appendChild(panel);
    };
    if (narrow.matches) {
      const row = active.closest<HTMLTableRowElement>('[data-route-row]');
      if (!row) return;
      slot = document.createElement('tr');
      slot.className = 'route-videos__expanded-row';
      const cell = document.createElement('td');
      cell.colSpan = row.cells.length;
      slot.appendChild(cell);
      row.parentNode!.insertBefore(slot, row.nextSibling);
      movePanel(cell);
    } else movePanel(root);
    previousSlot?.remove();
  };
  const hide = (restoreFocus: boolean) => {
    disposeGallery?.();
    disposeGallery = undefined;
    content.replaceChildren();
    panel.hidden = true;
    root.classList.remove('route-videos--open');
    active?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) active?.focus();
    active = undefined;
    root.appendChild(panel);
    slot?.remove();
    slot = undefined;
  };
  const onClick = (event: MouseEvent) => {
    const trigger = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-route-open]');
    if (!trigger || !root.contains(trigger)) return;
    if (active === trigger) { hide(true); return; }
    hide(false);
    const row = trigger.closest<HTMLElement>('[data-route-row]');
    const template = row?.querySelector<HTMLTemplateElement>('template[data-route-gallery]');
    if (!template) return;
    active = trigger;
    active.setAttribute('aria-expanded', 'true');
    heading.textContent = row?.dataset.routeName ?? '';
    content.appendChild(template.content.cloneNode(true));
    for (const frame of content.querySelectorAll<HTMLIFrameElement>('iframe[data-src]')) {
      frame.src = frame.dataset.src!;
    }
    const gallery = content.querySelector<HTMLElement>('[data-video-gallery]');
    if (gallery) disposeGallery = setup(gallery);
    panel.hidden = false;
    root.classList.add('route-videos--open');
    place();
    // The close control is the first focusable item in the newly opened region.
    close.focus({ preventScroll: true });
  };
  const onClose = () => hide(true);
  const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && active) { event.preventDefault(); hide(true); } };
  root.addEventListener('click', onClick);
  close.addEventListener('click', onClose);
  root.addEventListener('keydown', onKey);
  narrow.addEventListener('change', place);
  return () => {
    hide(false);
    unprotect();
    root.removeEventListener('click', onClick);
    close.removeEventListener('click', onClose);
    root.removeEventListener('keydown', onKey);
    narrow.removeEventListener('change', place);
  };
}
