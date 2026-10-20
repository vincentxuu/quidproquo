import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { edgePoints, parseFlowDiagram, remarkFlowDiagram, renderFlowDiagram, type FlowDiagramSpec } from './remarkFlowDiagram';

const spec: FlowDiagramSpec = {
  title: 'RAG', lang: 'zh-TW', width: 400, height: 300,
  nodes: [
    { id: 'user', label: 'User', x: 100, y: 50, shape: 'actor' },
    { id: 'app', label: 'LLM App', x: 100, y: 200 },
  ],
  edges: [
    { from: 'user', to: 'app', step: 1, label: 'query', offset: -10 },
    { from: 'app', to: 'user', step: 2, label: 'response', offset: -10 },
  ],
  steps: ['送出查詢', '回應'],
};
const json = (patch: object) => JSON.stringify({ ...spec, ...patch });

describe('flow diagram spec', () => {
  it('fails the build on broken specs', () => {
    expect(() => parseFlowDiagram('nope')).toThrow(/JSON/);
    for (const patch of [
      { lang: 'xx' }, { width: 50 }, { steps: [] },
      { nodes: [...spec.nodes, { ...spec.nodes[0] }] },
      { nodes: [{ ...spec.nodes[0], shape: 'star' }, spec.nodes[1]] },
      { edges: [{ ...spec.edges[0], to: 'ghost' }, spec.edges[1]] },
      { edges: [{ ...spec.edges[0], step: 3 }, spec.edges[1]] },
      { edges: [spec.edges[0]] },
      { edges: [{ ...spec.edges[0], via: [[1, 2]] }, spec.edges[1]] },
    ]) {
      expect(() => parseFlowDiagram(json(patch))).toThrow(/flow-diagram/);
    }
    expect(parseFlowDiagram(json({})).steps).toHaveLength(2);
  });

  it('runs paired offset edges side by side and stops arrows at node outlines', () => {
    const nodes = new Map(spec.nodes.map((node) => [node.id, node]));
    const down = edgePoints(spec.edges[0], nodes);
    const up = edgePoints(spec.edges[1], nodes);
    expect(down[0][0]).toBe(down[1][0]);
    expect(down[0][0]).not.toBe(up[0][0]);
    expect(down[0][1]).toBeGreaterThan(50 + 76 / 2);
    expect(down[1][1]).toBeLessThan(200 - 56 / 2);
  });
});

describe('flow diagram render', () => {
  it('escapes text, tags steps on edges and nodes, and keeps controls hidden until JS', () => {
    const html = renderFlowDiagram({ ...spec, title: '<img onerror=x>', steps: ['<script>', 'ok'] });
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<script>');
    expect(html).toContain('flow-diagram__edge" data-step="1"');
    expect(html).toContain('data-flow-node="app" data-step="1 2"');
    expect(html).toContain('data-flow-controls hidden');
    expect(html.match(/<li /g)).toHaveLength(2);
  });

  it('replaces only flow-diagram fences', () => {
    const tree = { type: 'root', children: [
      { type: 'code', lang: 'flow-diagram', value: json({}) },
      { type: 'code', lang: 'js', value: '1' },
    ] } as unknown as Root;
    remarkFlowDiagram()(tree);
    expect(tree.children.map((node) => node.type)).toEqual(['html', 'code']);
  });
});
