import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

/** One document per panel; cancelled renders never replace the selected page. */
export class SlideCanvasRenderer {
  private loading?: PDFDocumentLoadingTask;
  private document?: Promise<PDFDocumentProxy>;
  private render?: RenderTask;
  private revision = 0;
  private destroyed = false;
  constructor(private readonly source: string, private readonly host: HTMLElement) {}
  async show(pageNumber: number): Promise<boolean> {
    if (this.destroyed) return false;
    const revision = ++this.revision;
    this.render?.cancel();
    if (!this.document) {
      this.document = import('pdfjs-dist/legacy/build/pdf.mjs').then(async pdfjs => {
        const worker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
        if (this.destroyed) throw new Error('Reader disposed');
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        this.loading = pdfjs.getDocument({ url: this.source });
        return this.loading.promise;
      }).catch(error => { this.document = undefined; throw error; });
    }
    const document = await this.document;
    if (this.destroyed || revision !== this.revision) return false;
    const page = await document.getPage(pageNumber);
    if (this.destroyed || revision !== this.revision) return false;
    const base = page.getViewport({ scale: 1 });
    const width = Math.max(1, this.host.clientWidth);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale: width / base.width * ratio });
    const canvas = window.document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
    canvas.style.width = '100%'; canvas.style.height = 'auto';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${pageNumber} / ${document.numPages}`);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    const task = page.render({ canvasContext: context, canvas, viewport });
    this.render = task;
    try { await task.promise; }
    catch (error) { if (this.destroyed || revision !== this.revision) return false; throw error; }
    if (this.destroyed || revision !== this.revision) return false;
    this.host.replaceChildren(canvas);
    return true;
  }
  destroy() {
    this.destroyed = true; this.revision++; this.render?.cancel();
    void this.loading?.destroy().catch(() => {}); this.host.replaceChildren();
  }
}
