/**
 * 脈動 API：所有對外 HTTP 請求均經 idempotentFetch，強制 X-Idempotency-Key。
 */
import { idempotentFetch } from './idempotentFetch';
import { getApiUrl, resolveOrgId } from '../config/loadMasterConfig';

export interface PulseMatchPayload {
  state: string;
  org_id?: string;
}

export async function callPulseMatch(
  state: string,
  orgId?: string | null,
  idempotencyKey?: string | null
) {
  const url = getApiUrl('pulse_match');
  const body = { data: { state, org_id: resolveOrgId(orgId) } };
  const res = await idempotentFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    idempotencyKey: idempotencyKey ?? undefined,
    reuseKey: Boolean(idempotencyKey),
  });
  return res.json();
}

export interface ExportPdfPayload {
  idempotency_key: string;
  org_id: string;
  prescription: { state: string; oils: unknown[]; date: string };
}

export async function callExportPrescriptionPdf(
  payload: ExportPdfPayload,
  idempotencyKey?: string | null
) {
  const url = getApiUrl('export_pdf');
  const body = { data: payload };
  const res = await idempotentFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    idempotencyKey: idempotencyKey ?? payload.idempotency_key,
    reuseKey: true,
  });
  return res.json();
}
