import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

function generateOrgId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "org_";
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Layer 0: 新醫師登入後自動生成唯一 org_id 並開闢獨立數據空間 [cite: 2026-02-08, 2026-02-12]
export const ensureOrgForUser = functions.https.onCall(async (_, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "必須登入"
    );
  }
  const uid = context.auth.uid;
  const usersRef = db.collection("users").doc(uid);
  const userSnap = await usersRef.get();
  const existingOrgId = userSnap.data()?.org_id;
  if (userSnap.exists && typeof existingOrgId === "string" && existingOrgId) {
    return { org_id: existingOrgId };
  }
  const orgId = generateOrgId();
  const membersRef = db.collection("orgs").doc(orgId).collection("_meta").doc("members");
  await db.runTransaction(async (tx) => {
    tx.set(membersRef, { [uid]: true }, { merge: true });
    tx.set(usersRef, { org_id: orgId, updated_at: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
  return { org_id: orgId };
});

const IDEMPOTENCY_WINDOW_MS = 60 * 1000;

// 1. 智慧轉向器：捕捉點擊意圖並歸因 [cite: 2026-02-12]
export const trackAndRedirect = functions.https.onRequest(async (req, res) => {
  const { orgId, cid, uid, target } = req.query;
  if (!orgId || !target) return res.redirect("https://google.com");

  await db.collection(`orgs/${orgId}/conversions`).add({
    campaignId: cid,
    userId: uid,
    clickedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return res.redirect(target as string);
});

// 2. 數據主權：一鍵打包全量代碼包 [cite: 2026-02-11]
export const exportAllData = functions.https.onCall(async (data) => {
  const { orgId } = data;
  const subscribers = await db.collection(`orgs/${orgId}/subscribers`).get();
  const content = await db.collection(`orgs/${orgId}/newsletters`).get();

  return {
    version: "Genesis_2.6_Export",
    data: {
      subscribers: subscribers.docs.map((d) => d.data()),
      content: content.docs.map((d) => d.data()),
    },
  };
});

// 3. 追蹤路由後端：依 tracking_id 記錄 Conversion_Logs 並回傳目標網址，冪等過濾 [cite: 2026-02-08]
export const recordConversionAndGetTarget = functions.https.onCall(
  async (data) => {
    const trackingId = data?.tracking_id;
    const eventType = data?.type === "open" ? "open" : "click";
    if (!trackingId || typeof trackingId !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "tracking_id is required"
      );
    }

    const linkRef = db.collection("tracking_links").doc(trackingId);
    const linkSnap = await linkRef.get();
    if (!linkSnap.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "tracking_id not found"
      );
    }
    const link = linkSnap.data() as {
      org_id: string;
      campaign_id: string;
      target_url: string;
    };
    const { org_id, campaign_id, target_url } = link;

    const logsRef = db.collection(`orgs/${org_id}/conversion_logs`);
    const windowStart = new Date(Date.now() - IDEMPOTENCY_WINDOW_MS);
    const recent = await logsRef
      .where("tracking_id", "==", trackingId)
      .where("type", "==", eventType)
      .where("created_at", ">", windowStart)
      .limit(1)
      .get();

    if (!recent.empty) {
      return { target_url: appendOrgId(target_url, org_id), already_logged: true };
    }

    await logsRef.add({
      tracking_id: trackingId,
      campaign_id: campaign_id,
      org_id,
      type: eventType,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      target_url: appendOrgId(target_url, org_id),
      already_logged: false,
    };
  }
);

function appendOrgId(url: string, orgId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("org_id", orgId);
    return u.toString();
  } catch {
    return url.includes("?")
      ? `${url}&org_id=${encodeURIComponent(orgId)}`
      : `${url}?org_id=${encodeURIComponent(orgId)}`;
  }
}

// 4. 轉換率統計：依 Conversion_Logs 計算 O/C/K [cite: 2026-02-08]
export const getConversionStats = functions.https.onCall(async (data) => {
  const { org_id, campaign_id } = data || {};
  if (!org_id) {
    throw new functions.https.HttpsError("invalid-argument", "org_id required");
  }
  const logsRef = db.collection(`orgs/${org_id}/conversion_logs`);
  let query = logsRef as admin.firestore.Query;
  if (campaign_id) {
    query = query.where("campaign_id", "==", campaign_id);
  }
  const snapshot = await query.get();
  let O = 0;
  let C = 0;
  snapshot.docs.forEach((doc) => {
    const d = doc.data();
    if (d.type === "open") O += 1;
    if (d.type === "click") C += 1;
  });
  const K = snapshot.size;
  const openRate = K > 0 ? (O / K) * 100 : 0;
  const clickRate = O > 0 ? (C / O) * 100 : 0;
  const conversionRate = K > 0 ? (C / K) * 100 : 0;
  return {
    O,
    C,
    K,
    open_rate: Math.round(openRate * 100) / 100,
    click_rate: Math.round(clickRate * 100) / 100,
    conversion_rate: Math.round(conversionRate * 100) / 100,
  };
});

// 5. 建立電子報活動並產生追蹤連結
export const createNewsletterCampaign = functions.https.onCall(async (data) => {
  const { org_id, title, body, cta_url, cta_label } = data || {};
  if (!org_id || !title) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "org_id and title required"
    );
  }
  const campaignRef = db
    .collection(`orgs/${org_id}/newsletter_campaigns`)
    .doc();
  const trackingId = campaignRef.id;
  await campaignRef.set({
    title: title || "",
    body: body || "",
    cta_url: cta_url || "",
    cta_label: cta_label || "立即預約",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  await db.collection("tracking_links").doc(trackingId).set({
    org_id,
    campaign_id: trackingId,
    target_url: cta_url || "",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  return {
    campaign_id: trackingId,
    tracking_id: trackingId,
    tracking_url: `/t/${trackingId}`,
  };
});

// 6. 更新電子報活動（含 CTA 時更新 tracking_links）
export const updateNewsletterCampaign = functions.https.onCall(async (data) => {
  const { org_id, campaign_id, title, body, cta_url, cta_label } = data || {};
  if (!org_id || !campaign_id) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "org_id and campaign_id required"
    );
  }
  const campaignRef = db
    .collection(`orgs/${org_id}/newsletter_campaigns`)
    .doc(campaign_id);
  await campaignRef.update({
    ...(title !== undefined && { title }),
    ...(body !== undefined && { body }),
    ...(cta_url !== undefined && { cta_url }),
    ...(cta_label !== undefined && { cta_label }),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  const linkRef = db.collection("tracking_links").doc(campaign_id);
  const linkSnap = await linkRef.get();
  if (linkSnap.exists && cta_url !== undefined) {
    await linkRef.update({
      target_url: cta_url,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  return { ok: true };
});

// 7. 列出某 org 的電子報活動
export const listNewsletterCampaigns = functions.https.onCall(async (data) => {
  const { org_id } = data || {};
  if (!org_id) {
    throw new functions.https.HttpsError("invalid-argument", "org_id required");
  }
  const snap = await db
    .collection(`orgs/${org_id}/newsletter_campaigns`)
    .orderBy("created_at", "desc")
    .get();
  return {
    campaigns: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
  };
});

// ---------- Layer 1: 名單導入（冪等：檔案 Hash 作為 idempotency_key）[cite: 2026-02-08, 2026-02-12] ----------
async function parseCsvEmails(csvText: string): Promise<string[]> {
  const lines = csvText.trim().split(/\r?\n/);
  const emails: string[] = [];
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const line of lines) {
    const cell = line.split(/[,;\t]/)[0]?.trim() ?? "";
    if (emailRe.test(cell)) emails.push(cell.toLowerCase());
  }
  return [...new Set(emails)];
}

export const importSubscribers = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new functions.https.HttpsError("unauthenticated", "必須登入");
  const { org_id, csv_text, file_hash } = data || {};
  if (!org_id || !file_hash) {
    throw new functions.https.HttpsError("invalid-argument", "org_id and file_hash required");
  }
  const uid = context.auth.uid;
  const userSnap = await db.collection("users").doc(uid).get();
  const userOrg = userSnap.data()?.org_id;
  if (userOrg !== org_id) {
    throw new functions.https.HttpsError("permission-denied", "僅能操作所屬診所數據");
  }
  const subscribersRef = db.collection(`orgs/${org_id}/subscribers`);
  const importLogRef = db.collection(`orgs/${org_id}/import_logs`).doc(file_hash);
  const existing = await importLogRef.get();
  const csvContent = typeof csv_text === "string" ? csv_text : "";
  const emails = await parseCsvEmails(csvContent);
  if (emails.length === 0) {
    return { imported: 0, skipped: 0, message: "無有效 Email，或檔案為空" };
  }
  let toAdd: string[];
  if (existing.exists) {
    const existingEmails = await subscribersRef.get();
    const set = new Set(existingEmails.docs.map((d) => d.id));
    toAdd = emails.filter((e) => !set.has(e));
  } else {
    toAdd = emails;
    await importLogRef.set({
      file_hash,
      first_imported_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  const batch = db.batch();
  for (const email of toAdd) {
    batch.set(subscribersRef.doc(email), {
      email,
      source: "csv_import",
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  await batch.commit();
  return { imported: toAdd.length, skipped: emails.length - toAdd.length };
});

// ---------- LinkWrapper：為連結建立追蹤 ID，回傳 url -> tracking_id [cite: 2026-02-12] ----------
export const ensureTrackingLinks = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new functions.https.HttpsError("unauthenticated", "必須登入");
  const { org_id, campaign_id, urls } = data || {};
  if (!org_id || !campaign_id || !Array.isArray(urls) || urls.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "org_id, campaign_id, urls required");
  }
  const uid = context.auth.uid;
  const userSnap = await db.collection("users").doc(uid).get();
  if (userSnap.data()?.org_id !== org_id) {
    throw new functions.https.HttpsError("permission-denied", "僅能操作所屬診所數據");
  }
  const result: Record<string, string> = {};
  for (const url of urls) {
    if (!url || typeof url !== "string") continue;
    const normalized = url.trim();
    if (!normalized) continue;
    const snapshot = await db.collection("tracking_links")
      .where("org_id", "==", org_id)
      .where("campaign_id", "==", campaign_id)
      .where("target_url", "==", normalized)
      .limit(1)
      .get();
    if (!snapshot.empty) {
      result[normalized] = snapshot.docs[0].id;
      continue;
    }
    const newRef = db.collection("tracking_links").doc();
    await newRef.set({
      org_id,
      campaign_id,
      target_url: normalized,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    result[normalized] = newRef.id;
  }
  return { mapping: result };
});

// ---------- 轉換報表（Callable，供儀表板）----------
export const getConversionReport = functions.https.onCall(async (data) => {
  const { org_id } = data || {};
  if (!org_id) throw new functions.https.HttpsError("invalid-argument", "org_id required");
  const logsRef = db.collection(`orgs/${org_id}/conversion_logs`);
  const snapshot = await logsRef.get();
  let O = 0, C = 0;
  snapshot.docs.forEach((doc) => {
    const d = doc.data();
    if (d.type === "open") O += 1;
    if (d.type === "click") C += 1;
  });
  const sentSnap = await db.collection(`orgs/${org_id}/newsletter_campaigns`).get();
  const sent_total = sentSnap.size;
  return {
    sent_total,
    open_count: O,
    click_count: C,
    estimated_conversions: C,
  };
});

// ---------- Layer 2: 轉換報表 API [cite: 2026-02-08] ----------
export const conversionReport = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  const orgId = req.query?.org_id as string;
  if (!orgId) {
    res.status(400).json({ error: "org_id required" });
    return;
  }
  const logsRef = db.collection(`orgs/${orgId}/conversion_logs`);
  const snapshot = await logsRef.get();
  let O = 0, C = 0;
  snapshot.docs.forEach((doc) => {
    const d = doc.data();
    if (d.type === "open") O += 1;
    if (d.type === "click") C += 1;
  });
  const K = snapshot.size;
  const sentSnap = await db.collection(`orgs/${orgId}/newsletter_campaigns`).get();
  const sentTotal = sentSnap.size;
  res.json({
    sent_total: sentTotal,
    open_count: O,
    click_count: C,
    estimated_conversions: C,
    open_rate: sentTotal > 0 ? Math.round((O / sentTotal) * 10000) / 100 : 0,
    click_rate: O > 0 ? Math.round((C / O) * 10000) / 100 : 0,
  });
});

// ---------- 診所設定（名稱、退訂基底）用於頁尾嵌入 [cite: 2026-02-08, 2026-02-12] ----------
export const getOrgConfig = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new functions.https.HttpsError("unauthenticated", "必須登入");
  const { org_id } = data || {};
  if (!org_id) throw new functions.https.HttpsError("invalid-argument", "org_id required");
  const uid = context.auth.uid;
  const userSnap = await db.collection("users").doc(uid).get();
  if (userSnap.data()?.org_id !== org_id) {
    throw new functions.https.HttpsError("permission-denied", "僅能讀取所屬診所");
  }
  const configSnap = await db.collection("orgs").doc(org_id).collection("config").doc("newsletter").get();
  const d = configSnap.exists ? configSnap.data() : {};
  return {
    clinic_name: d?.clinic_name ?? "",
    unsubscribe_base_url: d?.unsubscribe_base_url ?? "",
  };
});

export const setOrgConfig = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new functions.https.HttpsError("unauthenticated", "必須登入");
  const { org_id, clinic_name, unsubscribe_base_url } = data || {};
  if (!org_id) throw new functions.https.HttpsError("invalid-argument", "org_id required");
  const uid = context.auth.uid;
  const userSnap = await db.collection("users").doc(uid).get();
  if (userSnap.data()?.org_id !== org_id) {
    throw new functions.https.HttpsError("permission-denied", "僅能寫入所屬診所");
  }
  await db.collection("orgs").doc(org_id).collection("config").doc("newsletter").set({
    clinic_name: clinic_name ?? "",
    unsubscribe_base_url: unsubscribe_base_url ?? "",
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  return { ok: true };
});
