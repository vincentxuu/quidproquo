
export function initializeVocabularyCapture() {
  const root = document.querySelector<HTMLElement>('.vocabulary-capture');
  const dialog = document.querySelector<HTMLDialogElement>('#vocabulary-capture-dialog');
  const en = root?.dataset.lang === 'en';
  const feedback = document.getElementById('vocabulary-save-feedback');
  const feedbackMessage = document.getElementById('vocabulary-save-message');
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  let selectionOrigin: HTMLElement | null = null;
  let captureTrigger: HTMLElement | null = null;
  let pendingLookup: { term: string; context: string; sourcePath: string; sourceTitle: string } | null = null;
  const selectionSave = document.getElementById('vocabulary-selection-save');
  let selectionText = '', selectionContext = '';
  let selecting = false;
  let selectionDismissed = false;
  let selectionTimer: ReturnType<typeof setTimeout> | undefined;
  selectionSave?.addEventListener('mousedown', event => event.preventDefault());

  // Place the action beside the final selected line; never cover the word itself.
  function updateSelectionAction() {
    if (!selectionSave) return;
    const selected = window.getSelection();
    const anchor = selected?.anchorNode?.parentElement;
    const end = selected?.focusNode?.parentElement;
    if (selecting || selectionDismissed || dialog?.open || !selected || selected.isCollapsed ||
        !anchor?.closest('.content') || !end?.closest('.content') || !selected.toString().trim()) {
      selectionSave.hidden = true;
      return;
    }
    const rects = Array.from(selected.getRangeAt(0).getClientRects()).filter(rect => rect.width && rect.height);
    const rect = rects.at(-1);
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft ?? 0;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportRight = viewportLeft + (viewport?.width ?? innerWidth);
    const viewportBottom = viewportTop + (viewport?.height ?? innerHeight);
    if (!rect || rect.bottom < viewportTop || rect.top > viewportBottom || rect.right < viewportLeft || rect.left > viewportRight) {
      selectionSave.hidden = true;
      return;
    }
    selectionOrigin = anchor.closest<HTMLElement>('p, li, td, blockquote') ?? anchor;
    selectionText = selected.toString().trim().slice(0, 120);
    selectionContext = anchor.closest('p, li, td, blockquote')?.textContent?.trim().slice(0, 4000) ?? '';
    selectionSave.hidden = false;
    const { width, height } = selectionSave.getBoundingClientRect();
    const left = Math.max(viewportLeft + 12, Math.min((rect.left + rect.right - width) / 2, viewportRight - width - 12));
    const below = rect.bottom + 10;
    const top = below + height <= viewportBottom - 12 ? below : rect.top - height - 10;
    selectionSave.style.left = `${left}px`;
    selectionSave.style.top = `${Math.max(viewportTop + 12, top)}px`;
  }
  document.addEventListener('selectionchange', () => {
    selectionDismissed = false;
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(updateSelectionAction, 120);
  });
  document.addEventListener('pointerdown', event => {
    if ((event.target as Element)?.closest('.content')) {
      selecting = true;
      if (selectionSave) selectionSave.hidden = true;
    }
  });
  document.addEventListener('pointerup', () => { selecting = false; updateSelectionAction(); });
  document.addEventListener('pointercancel', () => { selecting = false; updateSelectionAction(); });
  document.addEventListener('scroll', updateSelectionAction, { passive: true, capture: true });
  window.addEventListener('resize', updateSelectionAction);
  window.visualViewport?.addEventListener('resize', updateSelectionAction);
  window.visualViewport?.addEventListener('scroll', updateSelectionAction);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !dialog?.open) {
      selectionDismissed = true;
      if (selectionSave) selectionSave.hidden = true;
    }
  });
  function dispatchLookup() {
    if (pendingLookup && dialog?.open) window.dispatchEvent(new CustomEvent('qp:vocabulary-lookup', { detail: pendingLookup }));
  }
  function openCapture(event: Event) {
    if (!dialog) return;
    captureTrigger = event.currentTarget as HTMLElement;
    if (feedback) feedback.hidden = true;
    clearTimeout(feedbackTimer);
    pendingLookup = {
      term: captureTrigger === selectionSave ? selectionText : '', context: selectionContext,
      sourcePath: location.pathname, sourceTitle: root?.dataset.title ?? '',
    };
    dialog.showModal();
    if (selectionSave) selectionSave.hidden = true;
    dispatchLookup();
  }
  document.getElementById('vocabulary-add')?.addEventListener('click', openCapture);
  selectionSave?.addEventListener('click', openCapture);
  window.addEventListener('qp:vocabulary-lookup-ready', dispatchLookup);
  document.getElementById('vocabulary-cancel')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('close', () => {
    pendingLookup = null;
    window.dispatchEvent(new Event('qp:vocabulary-dialog-closed'));
    const returnFocus = captureTrigger === selectionSave ? selectionOrigin : captureTrigger;
    if (returnFocus?.isConnected) {
      if (returnFocus === selectionOrigin && !returnFocus.hasAttribute('tabindex')) returnFocus.tabIndex = -1;
      returnFocus.focus({ preventScroll: true });
    }
  });
  window.addEventListener('qp:vocabulary-saved', event => {
    if (!dialog?.open) return;
    const detail = (event as CustomEvent<{ alreadySaved?: boolean }>).detail;
    dialog.close();
    selectionDismissed = true; selectionText = ''; selectionContext = '';
    window.getSelection()?.removeAllRanges();
    if (selectionSave) selectionSave.hidden = true;
    if (feedback && feedbackMessage) {
      feedbackMessage.textContent = detail?.alreadySaved
        ? (en ? 'Already in your vocabulary.' : '這個單字已在單字庫。')
        : (en ? 'Saved to your vocabulary.' : '已加入單字庫。');
      feedback.hidden = false;
      feedbackTimer = setTimeout(() => { if (!feedback.contains(document.activeElement)) feedback.hidden = true; }, 6000);
    }
  });
}
