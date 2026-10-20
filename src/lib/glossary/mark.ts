import type { GlossaryEntry } from './terms'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAsciiWord(value: string) {
  return /[A-Za-z0-9_-]/.test(value);
}

function isValidBoundary(text: string, index: number, length: number) {
  const before = text[index - 1] ?? '';
  const after = text[index + length] ?? '';
  return !isAsciiWord(before) && !isAsciiWord(after);
}

export function markGlossaryTerms(content: HTMLElement, glossaryEntries: GlossaryEntry[]) {
  if (!glossaryEntries.length) return;
  const terms = glossaryEntries
    .flatMap(entry => [entry.term, ...(entry.aliases ?? [])])
    .filter(term => term.length >= 2)
    .sort((a, b) => b.length - a.length);
  if (!terms.length) return;

  const pattern = new RegExp(terms.map(escapeRegExp).join('|'), 'gi');

  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      if (parent.closest('a, button, pre, code, h1, h2, h3, h4, h5, h6, script, style, svg, .flow-diagram__steps, .glossary-term')) {
        return NodeFilter.FILTER_REJECT;
      }
      pattern.lastIndex = 0;
      return pattern.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes: Text[] = [];
  const markedTerms = new Set(Array.from(document.querySelectorAll<HTMLElement>('.glossary-term[data-term]'), button => (button.dataset.term ?? '').toLowerCase()));
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  nodes.forEach(node => {
    const text = node.textContent ?? '';
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const index = match.index ?? 0;
      if (!isValidBoundary(text, index, value.length)) continue;
      const key = value.toLowerCase();
      const entry = glossaryEntries.find(candidate => candidate.term.toLowerCase() === key || candidate.aliases?.some(alias => alias.toLowerCase() === key));
      if (!entry) continue;
      const termKey = entry.term.toLowerCase();
      if (markedTerms.has(termKey)) continue;
      fragment.append(document.createTextNode(text.slice(lastIndex, index)));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'glossary-term';
      button.dataset.term = entry.term;
      button.textContent = value;
      fragment.append(button);
      markedTerms.add(termKey);
      lastIndex = index + value.length;
    }
    if (lastIndex === 0) return;
    fragment.append(document.createTextNode(text.slice(lastIndex)));
    node.parentNode?.replaceChild(fragment, node);
  });
}

/** Rebuild after a shared-data retry so a custom short term cannot mask a longer shared term. */
export function resetGlossaryTerms(content: HTMLElement) {
  const active = document.activeElement
  const focused = active instanceof HTMLElement && content.contains(active) && active.matches('.glossary-term')
    ? { term: (active.dataset.term ?? '').toLowerCase(), text: (active.textContent ?? '').toLowerCase() }
    : undefined
  content.querySelectorAll<HTMLElement>('.glossary-term').forEach(button => {
    button.replaceWith(document.createTextNode(button.textContent ?? ''))
  })
  content.normalize()
  return () => {
    if (!focused) return
    const buttons = Array.from(content.querySelectorAll<HTMLElement>('.glossary-term'))
    const replacement = buttons.find(button => (button.dataset.term ?? '').toLowerCase() === focused.term)
      ?? buttons.find(button => {
        const text = (button.textContent ?? '').toLowerCase()
        const term = (button.dataset.term ?? '').toLowerCase()
        return (focused.text && text.includes(focused.text)) || (focused.term && term.includes(focused.term))
      })
    replacement?.focus({ preventScroll: true })
  }
}
