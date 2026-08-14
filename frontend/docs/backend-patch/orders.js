/**
 * REFERENCE ONLY — NOT deployed on api.larabeauty.store
 *
 * TikTok / Snap CAPI live on the frontend store service:
 *   frontend/src/lib/tiktok-capi.ts
 *   frontend/src/lib/snap-capi.ts
 *   frontend/src/app/api/orders/route.ts
 *
 * Backend orders route (backend/src/routes/orders.js) handles:
 *   - DB insert
 *   - Google Sheets forward
 *   - NO marketing CAPI
 */

// Legacy sketch — do not copy to backend/src/routes/orders.js

async function sendTiktokEvent(/* ... */) {
  return { ok: true, skipped: true, reason: 'moved_to_frontend' };
}

async function sendSnapEvent(/* ... */) {
  return { ok: true, skipped: true, reason: 'moved_to_frontend' };
}

export { sendTiktokEvent, sendSnapEvent };
