/**
 * HeTu 架構 · Genesis 2.6
 * 統一出口：API、配置、元件、遷移視圖。
 */

export { idempotentFetch, generateIdempotencyKey, IDEMPOTENCY_HEADER } from './api/idempotentFetch';
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

export { default as PhysicianConfigView } from './legacy/PhysicianConfigView';
export { db } from './legacy/firebase';
