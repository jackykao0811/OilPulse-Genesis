export {
  idempotentFetch,
  generateIdempotencyKey,
  IDEMPOTENCY_HEADER,
} from './api/idempotentFetch';
export type { IdempotentFetchOptions } from './api/idempotentFetch';
export { callPulseMatch, callExportPrescriptionPdf } from './api/pulseApi';
export type { PulseMatchPayload, ExportPdfPayload } from './api/pulseApi';

export {
  getMasterConfig,
  getDomainPack,
  resolveOrgId,
  getApiUrl,
} from './config/loadMasterConfig';
export type { MasterConfig, DomainPack } from './config/loadMasterConfig';

export { default as ErrorShield } from './components/ErrorShield';
export type { ErrorShieldProps } from './components/ErrorShield';
export { default as HeTuRoot } from './components/HeTuRoot';
export type { HeTuRootProps } from './components/HeTuRoot';
export { default as OperatorGuard } from './components/OperatorGuard';
export { default as ConversionStatsCards } from './components/ConversionStatsCards';
export { default as CsvImport } from './components/CsvImport';
export { default as BlockEditor } from './components/BlockEditor';
export { HeTuErrorBoundary } from './components/HeTuErrorBoundary';
export type { ConversionStats } from './components/ConversionStatsCards';

export { default as PhysicianConfigView } from './legacy/PhysicianConfigView';
export { default as TrackingRedirectPage } from './pages/TrackingRedirectPage';
export { default as OperatorNewsletterLayout } from './pages/OperatorNewsletterLayout';
export { default as NewsletterEditorPage } from './pages/NewsletterEditorPage';
export { default as LoginPage } from './pages/LoginPage';
export { useAuth } from './auth/AuthContext';
export { db, app } from './legacy/firebase';
