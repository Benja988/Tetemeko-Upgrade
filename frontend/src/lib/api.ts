// src/lib/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json(); // { accessToken, refreshToken? }
}

export const apiRequest = async <T = any>(
  url: string,
  method = "GET",
  body: any = null,
  token: string | null = null
): Promise<T> => {
  let authToken = token;

  // ✅ Only access localStorage in the browser
  if (!authToken && typeof window !== "undefined") {
    authToken = localStorage.getItem("token");
  }

  const makeRequest = async (tokenToUse: string | null) => {
    const headers: HeadersInit = {};
    if (tokenToUse) headers["Authorization"] = `Bearer ${tokenToUse}`;
    if (body) headers["Content-Type"] = "application/json";

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return response;
  };

  let response = await makeRequest(authToken);

  // 🔐 Handle expired token (401) — only on client side
  if (response.status === 401 && typeof window !== "undefined") {
    try {
      const data = await refreshToken(); // Refresh token from cookies or API

      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      response = await makeRequest(data.accessToken);
    } catch (err) {
      localStorage.clear();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || response.statusText || "Request failed");
  }

  return response.json() as Promise<T>;
};

