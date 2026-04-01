const FALLBACK_API_BASE_URL = "https://healthmate.up.railway.app/api";

function getRuntimeBackendUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window._env_?.BACKEND_URL ?? "";
}

function normalizeApiBaseUrl(rawUrl: string): string {
  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) {
    return FALLBACK_API_BASE_URL;
  }

  const withProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;
  const withoutTrailingSlash = withProtocol.replace(/\/+$/, "");
  return withoutTrailingSlash.endsWith("/api")
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
}

const BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_BACKEND_URL ||
    getRuntimeBackendUrl() ||
    FALLBACK_API_BASE_URL
);

const API_ROUTES = {
  // Auth Routes
  register: `${BASE_URL}/auth/register`,
  verifyOtp: `${BASE_URL}/auth/verify-otp`,
  login: `${BASE_URL}/auth/login`,
  getCurrentUser: `${BASE_URL}/auth/me`,
  deleteAccount: `${BASE_URL}/auth`,

  // Diagnosis Routes
  createDiagnosis: `${BASE_URL}/diagnosis`,
  getDiagnosisHistory: `${BASE_URL}/diagnosis/history`,
  getDiagnosisById: (reportId: string) => `${BASE_URL}/diagnosis/${reportId}`,
  deleteDiagnosisById: (reportId: string) =>
    `${BASE_URL}/diagnosis/${reportId}`,
};

export { BASE_URL, API_ROUTES };
