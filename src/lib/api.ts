/**
 * Browser: same-origin `/api/v1/*` proxy (no build-time env required).
 * Server: `API_URL` or production default.
 */
const PRODUCTION_API = 'https://api.larabeauty.store';

export function getServerApiUrl(): string {
  return (
    process.env.API_URL?.trim() ||
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    PRODUCTION_API
  );
}

/** Base URL for client-side fetches — empty string = same origin. */
export function getClientApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/$/, '');
  }
  return '';
}

export function ordersEndpoint(): string {
  const base = getClientApiBase();
  return base ? `${base}/api/v1/orders` : '/api/v1/orders';
}
