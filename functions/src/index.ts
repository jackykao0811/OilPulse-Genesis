import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (!admin.apps.length) { admin.initializeApp(); }
const db = admin.firestore();

// 功能 A：創世種入 120 筆精油
export const seedGenesisOils = onCall(async (request) => {
  const { org_id = "default_org" } = request.data;
  const batch = db.batch();
  const states = ["焦慮不安","睡不好","疲倦無力","頭部緊繃","肌肉痠痛","消化不適","注意力渙散","情緒低落","壓力大","呼吸不順","肌膚困擾","想放鬆"];

  for (let i = 0; i < 120; i++) {
    const ref = db.collection("oils").doc();
    batch.set(ref, {
      org_id,
      zh_name: "脈動精油 No." + (i + 1),
      states: [states[i % 12], "想放鬆"],
      is_universal: i < 12,
      nature: i % 3 === 0 ? "溫" : (i % 3 === 1 ? "涼" : "平"),
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
  return { ok: true, seeded_count: 120 };
});

// 功能 B：核心匹配引擎 (從 120 筆中精選 3 支)
export const getPulseMatch = onCall(async (request) => {
  const { state, org_id = "default_org" } = request.data;
  const oilRef = db.collection("oils");
  
  // 1. 執行精準匹配
  const snapshot = await oilRef
    .where("org_id", "==", org_id)
    .where("states", "array-contains", state)
    .limit(3)
    .get();

  let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // 2. 圓滿回補：如果該狀態精油不足，拿萬用型補齊
  if (results.length < 3) {
    const universal = await oilRef
      .where("org_id", "==", org_id)
      .where("is_universal", "==", true)
      .limit(3 - results.length)
      .get();
    results = [...results, ...universal.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
  }

  return { ok: true, data: results };
});

/** 預留算力接口：處方箋 PDF 導出（Firebase Callable，冪等、多租戶隔離） */
const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;
const idempotencyCache: Record<string, { result: unknown; ts: number }> = {};

export const exportPrescriptionToPdf = onCall(async (request) => {
  const { idempotency_key, org_id, prescription } = request.data || {};
  const tenantId = typeof org_id === "string" && org_id.length > 0 ? org_id : "default_org";

  if (!idempotency_key || typeof idempotency_key !== "string") {
    throw new Error("INVALID_REQUEST: idempotency_key is required");
  }

  const cacheKey = `pdf_${tenantId}_${idempotency_key}`;
  const now = Date.now();
  const cached = idempotencyCache[cacheKey];
  if (cached && now - cached.ts < IDEMPOTENCY_TTL_MS) {
    return { result: cached.result };
  }

  const payload = {
    ack: true,
    pdf_url: null as string | null,
    message: "PDF 導出接口已接收，算力端可於此處接續產生 PDF 並回傳 pdf_url",
  };

  const docRef = db.collection("orgs").doc(tenantId).collection("prescription_logs").doc();
  await docRef.set({
    org_id: tenantId,
    idempotency_key,
    state: prescription?.state ?? null,
    oils: prescription?.oils ?? [],
    date: prescription?.date ?? null,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  const result = { result: payload };
  idempotencyCache[cacheKey] = { result: payload, ts: now };
  return result;
});
