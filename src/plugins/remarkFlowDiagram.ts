import type { Root } from 'mdast';

type Point = [number, number];

export interface FlowNode {
  id: string;
  label: string;
  /** Center of the node in viewBox units. */
  x: number;
  y: number;
  w?: number;
  h?: number;
  shape?: 'box' | 'actor' | 'db' | 'chip' | 'group';
  tone?: 'accent' | 'warn';
}

export interface FlowEdge {
  from: string;
  to: string;
  step: number;
  label?: string;
  /** Elbow points between the two nodes. */
  via?: Point[];
  /** Where the step badge sits; defaults to the middle of the longest segment. */
  labelAt?: Point;
  /** Put the label text left of the badge, to keep it off a neighbouring line. */
  labelSide?: 'left';
  /** Shift a straight edge sideways, so a request and its reply can run side by side. */
  offset?: number;
  tone?: 'warn';
}

export interface FlowDiagramSpec {
  title: string;
  lang: 'zh-TW' | 'en';
  width: number;
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
  /** steps[i] narrates step i + 1. */
  steps: string[];
  caption?: string;
}

const SHAPES = ['box', 'actor', 'db', 'chip', 'group'];
const isPoint = (value: unknown): value is Point => Array.isArray(value) && value.length === 2 && value.every((n) => typeof n === 'number' && Number.isFinite(n));
const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

/** Authored diagrams fail the build instead of rendering half a picture. */
export function parseFlowDiagram(body: string): FlowDiagramSpec {
  let raw: unknown;
  try { raw = JSON.parse(body); } catch { throw new Error('flow-diagram: invalid JSON'); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('flow-diagram: expected an object');
  const value = raw as Record<string, unknown>;
  if (!text(value.title)) throw new Error('flow-diagram: title must be non-empty text');
  if (value.lang !== 'zh-TW' && value.lang !== 'en') throw new Error('flow-diagram: invalid lang');
  for (const key of ['width', 'height']) {
    const n = value[key];
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 100 || n > 2000) throw new Error(`flow-diagram: ${key} must be 100–2000`);
  }
  if (value.caption !== undefined && !text(value.caption)) throw new Error('flow-diagram: caption must be non-empty text');
  if (!Array.isArray(value.steps) || !value.steps.length || !value.steps.every(text)) throw new Error('flow-diagram: steps must be non-empty text');
  if (!Array.isArray(value.nodes) || !value.nodes.length) throw new Error('flow-diagram: nodes must be a non-empty array');
  const ids = new Set<string>();
  for (const rawNode of value.nodes) {
    if (!rawNode || typeof rawNode !== 'object' || Array.isArray(rawNode)) throw new Error('flow-diagram: invalid node');
    const node = rawNode as Record<string, unknown>;
    if (typeof node.id !== 'string' || !/^[\w-]+$/.test(node.id)) throw new Error('flow-diagram: node id must be a word');
    if (ids.has(node.id)) throw new Error(`flow-diagram: duplicate node ${node.id}`);
    ids.add(node.id);
    if (!text(node.label)) throw new Error(`flow-diagram: node ${node.id} needs a label`);
    if (!isPoint([node.x, node.y])) throw new Error(`flow-diagram: node ${node.id} needs x and y`);
    for (const key of ['w', 'h']) {
      if (node[key] !== undefined && (typeof node[key] !== 'number' || (node[key] as number) <= 0)) throw new Error(`flow-diagram: node ${node.id} ${key} must be positive`);
    }
    if (node.shape !== undefined && !SHAPES.includes(node.shape as string)) throw new Error(`flow-diagram: node ${node.id} has unknown shape`);
    if (node.tone !== undefined && node.tone !== 'accent' && node.tone !== 'warn') throw new Error(`flow-diagram: node ${node.id} has unknown tone`);
  }
  if (!Array.isArray(value.edges) || !value.edges.length) throw new Error('flow-diagram: edges must be a non-empty array');
  const covered = new Set<number>();
  for (const rawEdge of value.edges) {
    if (!rawEdge || typeof rawEdge !== 'object' || Array.isArray(rawEdge)) throw new Error('flow-diagram: invalid edge');
    const edge = rawEdge as Record<string, unknown>;
    if (!ids.has(edge.from as string) || !ids.has(edge.to as string)) throw new Error(`flow-diagram: edge ${String(edge.from)}→${String(edge.to)} references a missing node`);
    if (!Number.isInteger(edge.step) || (edge.step as number) < 1 || (edge.step as number) > value.steps.length) throw new Error('flow-diagram: edge step must point at a step');
    covered.add(edge.step as number);
    if (edge.label !== undefined && !text(edge.label)) throw new Error('flow-diagram: edge label must be non-empty text');
    if (edge.via !== undefined && (!Array.isArray(edge.via) || !edge.via.every(isPoint))) throw new Error('flow-diagram: via must be [x, y] points');
    if (edge.labelAt !== undefined && !isPoint(edge.labelAt)) throw new Error('flow-diagram: labelAt must be an [x, y] point');
    if (edge.labelSide !== undefined && edge.labelSide !== 'left') throw new Error('flow-diagram: labelSide must be left');
    if (edge.offset !== undefined && (typeof edge.offset !== 'number' || !Number.isFinite(edge.offset) || edge.via !== undefined)) throw new Error('flow-diagram: offset must be a number on an edge without via');
    if (edge.tone !== undefined && edge.tone !== 'warn') throw new Error('flow-diagram: unknown edge tone');
  }
  for (let step = 1; step <= value.steps.length; step++) {
    if (!covered.has(step)) throw new Error(`flow-diagram: step ${step} has no edge`);
  }
  return value as unknown as FlowDiagramSpec;
}

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const r = (n: number) => Math.round(n * 10) / 10;

const DEFAULT_SIZE: Record<NonNullable<FlowNode['shape']>, [number, number]> = {
  box: [140, 56], actor: [72, 76], db: [96, 72], chip: [80, 72], group: [200, 120],
};
const size = (node: FlowNode): [number, number] => {
  const [w, h] = DEFAULT_SIZE[node.shape ?? 'box'];
  return [node.w ?? w, node.h ?? h];
};

/** Point where the ray from the node center toward `toward` leaves the node's box. */
function anchor(node: FlowNode, toward: Point): Point {
  const [w, h] = size(node);
  const dx = toward[0] - node.x;
  const dy = toward[1] - node.y;
  if (!dx && !dy) return [node.x, node.y];
  const scale = Math.min(dx ? (w / 2 + 6) / Math.abs(dx) : Infinity, dy ? (h / 2 + 6) / Math.abs(dy) : Infinity);
  return [node.x + dx * scale, node.y + dy * scale];
}

export function edgePoints(edge: FlowEdge, nodes: Map<string, FlowNode>): Point[] {
  let from = nodes.get(edge.from)!;
  let to = nodes.get(edge.to)!;
  if (edge.offset) {
    const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
    const [px, py] = [(-(to.y - from.y) / length) * edge.offset, ((to.x - from.x) / length) * edge.offset];
    from = { ...from, x: from.x + px, y: from.y + py };
    to = { ...to, x: to.x + px, y: to.y + py };
  }
  const via = edge.via ?? [];
  const start = anchor(from, via[0] ?? [to.x, to.y]);
  const end = anchor(to, via.at(-1) ?? [from.x, from.y]);
  return [start, ...via, end];
}

function labelPoint(points: Point[]): Point {
  let best = 0;
  let longest = -1;
  for (let i = 0; i < points.length - 1; i++) {
    const length = Math.hypot(points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]);
    if (length > longest) { longest = length; best = i; }
  }
  return [(points[best][0] + points[best + 1][0]) / 2, (points[best][1] + points[best + 1][1]) / 2];
}

function lines(label: string, x: number, y: number, size: number, className: string, align: 'middle' | 'start' | 'end' = 'middle') {
  const rows = label.split('\n');
  const top = y - ((rows.length - 1) * size * 1.2) / 2;
  return `<text class="${className}" x="${r(x)}" y="${r(top)}" font-size="${size}" text-anchor="${align}" dominant-baseline="central">${rows.map((row, i) => `<tspan x="${r(x)}" dy="${i ? size * 1.2 : 0}">${escape(row)}</tspan>`).join('')}</text>`;
}

function renderNode(node: FlowNode, steps: number[]) {
  const [w, h] = size(node);
  const left = node.x - w / 2;
  const top = node.y - h / 2;
  const shape = node.shape ?? 'box';
  let body = '';
  let labelY = node.y;
  if (shape === 'actor') {
    body = `<circle cx="${r(node.x)}" cy="${r(top + 16)}" r="12"/><path d="M${r(node.x - 20)} ${r(top + 50)}a20 18 0 0 1 40 0z"/>`;
    labelY = top + h - 8;
  } else if (shape === 'db') {
    const ry = 9;
    body = `<path d="M${r(left + 18)} ${r(top + ry)}v28a${w / 2 - 18} ${ry} 0 0 0 ${w - 36} 0v-28"/><ellipse cx="${r(node.x)}" cy="${r(top + ry)}" rx="${w / 2 - 18}" ry="${ry}"/>`;
    labelY = top + h - 8;
  } else if (shape === 'chip') {
    const pins = [-12, 0, 12].map((d) => `M${r(node.x + d)} ${r(top + 2)}v6M${r(node.x + d)} ${r(top + 38)}v6M${r(node.x - 25)} ${r(top + 23 + d)}h6M${r(node.x + 19)} ${r(top + 23 + d)}h6`).join('');
    body = `<rect x="${r(node.x - 18)}" y="${r(top + 8)}" width="36" height="30" rx="4"/><path class="flow-diagram__pins" d="${pins}"/>`;
    labelY = top + h - 8;
  } else {
    body = `<rect x="${r(left)}" y="${r(top)}" width="${w}" height="${h}" rx="${shape === 'group' ? 12 : 8}"/>`;
    if (shape === 'group') labelY = top + 18;
  }
  return `<g class="flow-diagram__node flow-diagram__node--${shape}${node.tone ? ` flow-diagram__node--${node.tone}` : ''}" data-flow-node="${node.id}"${steps.length ? ` data-step="${steps.join(' ')}"` : ''}>${body}${lines(node.label, node.x, labelY, 14, 'flow-diagram__node-label')}</g>`;
}

function renderEdge(edge: FlowEdge, points: Point[]) {
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${r(x)} ${r(y)}`).join('');
  const [tip, prev] = [points.at(-1)!, points.at(-2)!];
  const angle = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const wing = (offset: number) => `${r(tip[0] - 10 * Math.cos(angle + offset))} ${r(tip[1] - 10 * Math.sin(angle + offset))}`;
  const [bx, by] = edge.labelAt ?? labelPoint(points);
  const left = edge.labelSide === 'left';
  const label = edge.label ? lines(edge.label, left ? bx - 15 : bx + 15, by, 12, 'flow-diagram__edge-label', left ? 'end' : 'start') : '';
  return `<g class="flow-diagram__edge${edge.tone ? ` flow-diagram__edge--${edge.tone}` : ''}" data-step="${edge.step}"><path class="flow-diagram__line" d="${d}"/><path class="flow-diagram__head" d="M${wing(-0.45)}L${r(tip[0])} ${r(tip[1])}L${wing(0.45)}"/><g class="flow-diagram__badge"><circle cx="${r(bx)}" cy="${r(by)}" r="10"/><text x="${r(bx)}" y="${r(by)}" font-size="12" text-anchor="middle" dominant-baseline="central">${edge.step}</text></g>${label}</g>`;
}

export function renderFlowDiagram(spec: FlowDiagramSpec, index = 0): string {
  const en = spec.lang === 'en';
  const id = `flow-diagram-${index}`;
  const nodes = new Map(spec.nodes.map((node) => [node.id, node]));
  const touched = new Map<string, Set<number>>();
  for (const edge of spec.edges) {
    for (const end of [edge.from, edge.to]) touched.set(end, (touched.get(end) ?? new Set()).add(edge.step));
  }
  // Groups sit behind everything, edges under nodes so arrowheads stop at the node outline.
  const ordered = [...spec.nodes].sort((a, b) => Number(b.shape === 'group') - Number(a.shape === 'group'));
  const groups = ordered.filter((node) => node.shape === 'group').map((node) => renderNode(node, [...(touched.get(node.id) ?? [])]));
  const rest = ordered.filter((node) => node.shape !== 'group').map((node) => renderNode(node, [...(touched.get(node.id) ?? [])]));
  const edges = [...spec.edges].sort((a, b) => a.step - b.step).map((edge) => renderEdge(edge, edgePoints(edge, nodes)));
  return [
    `<figure class="flow-diagram" data-flow-diagram data-flow-total="${spec.steps.length}" data-flow-lang="${spec.lang}" aria-labelledby="${id}-title">`,
    `<figcaption class="flow-diagram__title" id="${id}-title">${escape(spec.title)}</figcaption>`,
    `<div class="flow-diagram__scroll" tabindex="0" aria-label="${en ? 'Diagram, scroll sideways if it is cut off' : '圖表，若被截斷可左右捲動'}"><svg class="flow-diagram__svg" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-labelledby="${id}-title" aria-describedby="${id}-steps">`,
    groups.join(''), edges.join(''), rest.join(''),
    '</svg></div>',
    `<div class="flow-diagram__controls" data-flow-controls hidden><button type="button" data-flow-prev aria-label="${en ? 'Previous step' : '上一步'}">←</button><button type="button" data-flow-toggle aria-pressed="false">${en ? 'Play' : '播放'}</button><button type="button" data-flow-next aria-label="${en ? 'Next step' : '下一步'}">→</button><span data-flow-status role="status" aria-live="polite">${en ? `All ${spec.steps.length} steps` : `全部 ${spec.steps.length} 步`}</span></div>`,
    `<ol class="flow-diagram__steps" id="${id}-steps">${spec.steps.map((step, i) => `<li data-flow-step-item="${i + 1}">${escape(step)}</li>`).join('')}</ol>`,
    spec.caption ? `<p class="flow-diagram__caption">${escape(spec.caption)}</p>` : '',
    '</figure>',
  ].join('');
}

type Node = { type: string; lang?: string | null; value?: string; children?: Node[] };
export function remarkFlowDiagram() {
  return (tree: Root) => {
    let index = 0;
    const walk = (node: Node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'flow-diagram') return { type: 'html', value: renderFlowDiagram(parseFlowDiagram(child.value ?? ''), index++) };
        walk(child);
        return child;
      });
    };
    walk(tree as unknown as Node);
  };
}
