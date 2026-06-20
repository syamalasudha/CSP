// Shared API base for frontend; strictly taking from env
export const API_BASE = import.meta.env.VITE_API_BASE as string;

export function apiUrl(path: string) {
  const base = API_BASE || "";
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
