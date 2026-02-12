import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import {
  HeTuRoot,
  PhysicianConfigView,
  TrackingRedirectPage,
  OperatorNewsletterLayout,
  NewsletterEditorPage,
  LoginPage,
} from './core/hetu';
import masterConfig from './MasterConfig.json';

/** 真相來源型別（河圖品牌 + SENTINEL 引擎） */
type MasterConfigType = typeof masterConfig;

/** 算力引擎：提供 MasterConfig 給全站，Production-Ready */
const HeTuEngineContext = React.createContext<MasterConfigType | null>(null);

export function useHeTuEngine(): MasterConfigType {
  const ctx = React.useContext(HeTuEngineContext);
  if (!ctx) throw new Error('useHeTuEngine must be used within HeTuEngineProvider');
  return ctx;
}

const HeTuEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HeTuEngineContext.Provider value={masterConfig as MasterConfigType}>
    {children}
  </HeTuEngineContext.Provider>
);

/** 字型嵌入：Noto Serif TC 美學變數，與 public/index.html 的 Google Fonts 對齊 */
const HETU_TYPO = {
  fontFamily: "'Noto Serif TC', serif",
  color: '#1A434E',
  background: '#f8f7f3',
} as const;

/** 河圖公司首頁全量部署 (Genesis 2.6) — Production-Ready */
const App: React.FC = () => {
  const cfg = masterConfig as MasterConfigType;
  const brand = cfg.truth_source?.hetu_hq ?? { name: '河圖科技 | HeTu Core', vision: '', founder: '' };

  return (
    <HeTuEngineProvider>
      <div style={{ fontFamily: HETU_TYPO.fontFamily, color: HETU_TYPO.color, minHeight: '100vh', background: HETU_TYPO.background }}>
        <header
          data-hetu="brand"
          style={{
            padding: '10px 16px',
            background: HETU_TYPO.background,
            textAlign: 'center',
            fontSize: 14,
            fontFamily: HETU_TYPO.fontFamily,
            color: HETU_TYPO.color,
            borderBottom: '1px solid rgba(26,67,78,0.12)',
          }}
        >
          {brand.name}
          {brand.vision && (
            <span style={{ display: 'block', fontSize: 12, color: '#5a7a82', marginTop: 2 }}>
              {brand.vision}
            </span>
          )}
        </header>
        <HeTuRoot>
          <Route path="/" element={<PhysicianConfigView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/t/:tracking_id" element={<TrackingRedirectPage />} />
          <Route path="operator" element={<OperatorNewsletterLayout />}>
            <Route index element={<Navigate to="newsletter" replace />} />
            <Route path="newsletter" element={<NewsletterEditorPage />} />
          </Route>
        </HeTuRoot>
      </div>
    </HeTuEngineProvider>
  );
};

export default App;
