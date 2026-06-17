// Shared API base for frontend; falls back to Render backend if env not provided
export const API_BASE = (import.meta as any)?.env?.VITE_API_BASE ?? "https://csp-3-7uef.onrender.com";

export function apiUrl(path: string) {
  return `${API_BASE.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
