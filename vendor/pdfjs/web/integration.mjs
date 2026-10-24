// Configure the official viewer through its documented startup event.
const configure = () => {
  const options = window.PDFViewerApplicationOptions;
  options.set('enableScripting', false);
  options.set('isEvalSupported', false);
  options.set('defaultUrl', '');
  options.set('localeProperties', { lang: new URLSearchParams(location.search).get('lang') === 'en-US' ? 'en-US' : 'zh-TW' });
};
const startup = event => {
  if (event.detail?.source !== window) return;
  configure();
  window.PDFViewerApplication.preferences.initializedPromise.then(configure);
};
const eventDocument = parent.document;
eventDocument.addEventListener('webviewerloaded', startup);
const { PDFViewerApplication } = await import('./viewer.mjs');
eventDocument.removeEventListener('webviewerloaded', startup);
let requestedPage = null;
const notify = () => parent.postMessage({ type: 'qp-pdf-page', page: PDFViewerApplication.page }, location.origin);
await PDFViewerApplication.initializedPromise;
PDFViewerApplication.eventBus.on('pagechanging', notify);
PDFViewerApplication.eventBus.on('pagesinit', () => {
  PDFViewerApplication.pdfViewer.scrollMode = 0;
  if (requestedPage && requestedPage <= PDFViewerApplication.pagesCount) PDFViewerApplication.page = requestedPage;
  notify();
});
addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'qp-pdf-jump') return;
  const page = event.data.page;
  if (!Number.isInteger(page) || page < 1) return;
  requestedPage = page;
  if (page <= PDFViewerApplication.pagesCount) PDFViewerApplication.page = page;
});
