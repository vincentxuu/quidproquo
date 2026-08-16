export interface DailySignal {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  category: SignalCategory;
  companies: string[];
  section: string;
  ring: 1 | 2 | 3 | 4;
  summary: string;
  relevance: number;
  crossValidated: boolean;
  crossValidationSources?: string[];
  tags?: string[];
}

export type SignalCategory =
  | 'vendor-update'
  | 'model-release'
  | 'pricing-change'
  | 'benchmark-shift'
  | 'framework-release'
  | 'funding'
  | 'acquisition'
  | 'security-incident'
  | 'regulation'
  | 'tool-launch'
  | 'open-source'
  | 'enterprise-deployment'
  | 'region-news'
  | 'community-signal';

export interface DailySignalsFile {
  date: string;
  generatedAt: string;
  routineId: string;
  signalCount: number;
  signals: DailySignal[];
}

export const SIGNAL_CATEGORIES: Record<SignalCategory, string> = {
  'vendor-update': '廠商動態',
  'model-release': '模型發佈',
  'pricing-change': '定價變動',
  'benchmark-shift': 'Benchmark 異動',
  'framework-release': '框架更新',
  'funding': '融資',
  'acquisition': '併購',
  'security-incident': '資安事件',
  'regulation': '法規與治理',
  'tool-launch': '工具與生態',
  'open-source': '開源動態',
  'enterprise-deployment': '企業落地',
  'region-news': '區域動態',
  'community-signal': '社群風向',
};
