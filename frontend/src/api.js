// Single place that knows where the API lives. No mock data fallback:
// if VITE_API_BASE_URL is missing or wrong, the UI shows a real network error.
const BASE = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status; // 0 = network failure / server unreachable
  }
}

async function request(path, options = {}) {
  if (!BASE) throw new ApiError("VITE_API_BASE_URL is not set. Copy .env.example to .env and restart Vite.", 0);
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(`Cannot reach the API at ${BASE}. Is the backend running?`, 0);
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  return data;
}

export const api = {
  internships: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/internships${qs ? `?${qs}` : ""}`);
  },
  students: () => request("/students"),
  skills: () => request("/skills"),
  applications: () => request("/applications"),
  apply: (studentId, internshipId) =>
    request("/applications", { method: "POST", body: JSON.stringify({ studentId, internshipId }) }),
  setStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
