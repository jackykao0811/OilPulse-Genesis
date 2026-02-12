import masterConfigJson from './master_config.json';

export interface DomainPack {
  id: string;
  name: string;
  description: string;
  org_ids: string[];
  features: Record<string, boolean>;
  firestore_paths: Record<string, string>;
}

export interface MasterConfig {
  $schema: string;
  version: string;
  default_org_id: string;
  domain_packs: Record<string, DomainPack>;
  api: Record<string, string>;
}

const masterConfig = masterConfigJson as MasterConfig;

export function getMasterConfig(): MasterConfig {
  return masterConfig;
}

export function getDomainPack(packId: 'clinic' | 'sentinel'): DomainPack | null {
  return masterConfig.domain_packs[packId] ?? null;
}

export function resolveOrgId(orgId: string | null | undefined): string {
  return orgId && orgId.trim() !== '' ? orgId : masterConfig.default_org_id;
}

export function getApiUrl(key: keyof MasterConfig['api']): string {
  return masterConfig.api[key] ?? '';
}
