// Site-wide settings. Facts and numbers come from src/content (profile.json and the
// work files); this file only decides what goes where.

export type TrackKey = 'ai' | 'quant_dev' | 'quant_research';
export type LensKey = 'general' | 'ai' | 'quant';

export const site = {
  name: 'Denys Shkola',
  url: 'https://alphashk.github.io',
  updated: 'November 2026',
  year: 2026,
  cvPdf: '/cv/denys-shkola-cv.pdf',
  ogImage: '/og.png',
  // Used only when profile.identity.tagline is absent. Both phrases restate
  // bios.general ("I lead an internal AI accelerator team"; "In my own time I build
  // market-data and quant-research systems").
  taglineFallback:
    'Software engineer leading an internal <em>AI accelerator team</em> at Erste Digital, and building <em>market-data and quant-research systems</em> in my own time.',
};

export const tracks: Record<TrackKey, { long: string; short: string }> = {
  ai: { long: 'AI / Forward-Deployed Engineering', short: 'AI engineering' },
  quant_dev: { long: 'Quant development', short: 'Quant dev' },
  quant_research: { long: 'Quant research', short: 'Quant research' },
};
export const trackOrder: TrackKey[] = ['ai', 'quant_dev', 'quant_research'];

// Key figures: each row names a work entry and the metric value to show. Values
// and labels are read from that entry's metrics at build time.
export type KeyFigureDef = {
  id: string;
  source: string;
  work: string;
  value: string;
  stat?: string;
  suffix?: string;
};
export const keyFigures: KeyFigureDef[] = [
  { id: 'erste', source: 'Erste Digital · production', work: 'erste-ai-modernization', value: '>80%' },
  { id: 'pulse', source: 'Pulse · quant research', work: 'pulse', value: '3.45', suffix: ' Sharpe' },
  { id: 'platform', source: 'Market-data platform · Rust', work: 'market-data-platform', value: '19 of 33' },
  { id: 'pm', source: 'Prediction markets · LLM system', work: 'prediction-markets', value: '≈ 255k' },
];

export const lenses: Record<LensKey, {
  path: string;
  label: string;
  headline: 'general' | 'ai' | 'quant';
  bio: 'general' | 'ai' | 'quant';
  startHere: { href: string; label: string };
  tracks: TrackKey[];
  keyFigures: string[];
  skills: string[];
  homeAwards: string[];
  work: string[];
}> = {
  general: {
    path: '/',
    label: 'General',
    headline: 'general',
    bio: 'general',
    startHere: { href: '/work/pulse/', label: 'Pulse case study' },
    tracks: ['ai', 'quant_dev', 'quant_research'],
    keyFigures: ['erste', 'pulse', 'platform', 'pm'],
    skills: [],
    homeAwards: ['imc-prosperity-4', 'jugend-forscht-2023', 'olympiad-prizes'],
    work: ['pulse', 'market-data-platform', 'prediction-markets', 'imc-prosperity-4', 'qnn-financial-forecasting', 'bass-lv-calibration'],
  },
  ai: {
    path: '/ai/',
    label: 'AI engineering',
    headline: 'ai',
    bio: 'ai',
    startHere: { href: '/work/erste-ai-modernization/', label: 'Erste AI modernization' },
    tracks: ['ai'],
    keyFigures: ['erste', 'pm', 'platform', 'pulse'],
    skills: ['AI engineering', 'Programming languages', 'Backend, web and mobile', 'Data, streaming and storage', 'Infrastructure and delivery'],
    homeAwards: ['jugend-forscht-2023', 'imc-prosperity-4', 'olympiad-prizes'],
    work: ['erste-ai-modernization', 'prediction-markets', 'market-data-platform', 'pulse', 'math-notes-agent-skills', 'n8n-pi-local-ai-agents'],
  },
  quant: {
    path: '/quant/',
    label: 'Quant',
    headline: 'quant',
    bio: 'quant',
    startHere: { href: '/work/pulse/', label: 'Pulse case study' },
    tracks: ['quant_dev', 'quant_research'],
    keyFigures: ['pulse', 'platform', 'erste'],
    skills: ['Quant research methods and tools', 'Mathematics', 'Programming languages', 'ML and scientific Python', 'Data, streaming and storage'],
    homeAwards: ['olympiad-prizes', 'imc-prosperity-4', 'jugend-forscht-2023'],
    work: ['pulse', 'market-data-platform', 'imc-prosperity-4', 'bass-lv-calibration', 'qnn-financial-forecasting', 'orderbook-spoofing', 'prediction-markets'],
  },
};

// Projects listed in the compact "Smaller projects" card on home and lens pages.
export const smallerProjects = ['math-notes-agent-skills', 'n8n-pi-local-ai-agents', 'ects-ledger', 'twisty-lab', 'puppet-cube-solver'];

// Evidence links that a decision of 2026-11-08 adds to a work page (public pitch
// decks that name Denys as project lead). They are shown only when the work file
// does not already link the same URL.
export const extraLinks: Record<string, { label: string; href: string; kind?: 'other'; meta?: string }[]> = {
  wutis: [
    {
      label: 'CRNN volatility pitch deck (June 2025, wutis.at)',
      href: 'https://wutis.at/wp-content/uploads/crnn_slides.pdf',
      meta: 'PDF · names me as Analyst / Project Lead',
    },
    {
      label: 'QNN portfolio pitch deck (January 2026, wutis.at)',
      href: 'https://wutis.at/wp-content/uploads/WUTIS_QNN.pdf',
      meta: 'PDF · names me as Associate / Project Lead',
    },
  ],
};

// Source notes shown on a work page (cited, not linked).
export const sourceNotes: Record<string, string> = {
  'imc-prosperity-4':
    'Phase 2: e-mail from IMC Prosperity, 22 Apr 2026, “Congratulations on your Prosperity success so far”: “Great job on successfully completing your first mission … your journey enters a whole new phase”. Round 3 opens Phase 2.',
};
