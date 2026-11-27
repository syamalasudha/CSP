// Shared API base for frontend; prefer env, fall back to localhost in dev
const envBase = (import.meta.env.VITE_API_BASE as string) || "";
const DEFAULT_DEV_BASE = "http://localhost:3000";
export const API_BASE = envBase || (import.meta.env.DEV ? DEFAULT_DEV_BASE : "");

export function apiUrl(path: string) {
  const base = API_BASE || "";
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
