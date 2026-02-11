/**
 * HeTu 協議：所有 API 請求強制帶入 X-Idempotency-Key，確保冪等性。
 * Genesis 2.6 規範：同一冪等鍵在有效時間窗內重複請求須回傳相同結果。
 */

function generateIdempotencyKey(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const IDEMPOTENCY_HEADER = 'X-Idempotency-Key';

export interface IdempotentFetchOptions extends RequestInit {
  idempotencyKey?: string | null;
  /** 若為 true，重試時會重用同一 key（由呼叫端在外部儲存並傳入） */
  reuseKey?: boolean;
}

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

/**
 * 與 fetch 簽名相容，但強制注入 X-Idempotency-Key。
 * 若未提供 idempotencyKey，則自動生成新 key。
 */
export async function idempotentFetch(
  input: RequestInfo | URL,
  options: IdempotentFetchOptions = {}
): Promise<Response> {
  const {
    idempotencyKey,
    reuseKey = false,
    headers: userHeaders,
    ...rest
  } = options;

  const key =
    idempotencyKey && reuseKey
      ? idempotencyKey
      : idempotencyKey ?? generateIdempotencyKey();

  const headers = new Headers(userHeaders ?? {});
  if (!headers.has(IDEMPOTENCY_HEADER)) {
    headers.set(IDEMPOTENCY_HEADER, key);
  }
  Object.entries(defaultHeaders).forEach(([k, v]) => {
    if (!headers.has(k)) headers.set(k, v);
  });

  return fetch(input, {
    ...rest,
    headers,
  });
}

export { IDEMPOTENCY_HEADER, generateIdempotencyKey };
