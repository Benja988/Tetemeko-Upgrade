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

  return response.json(); // Should return { accessToken, refreshToken? }
}

export const apiRequest = async (
  url: string,
  method = "GET",
  body: any = null,
  token: string | null = null
) => {
  let authToken = token || localStorage.getItem("token");

  const makeRequest = async (tokenToUse: string | null) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (tokenToUse) {
      headers["Authorization"] = `Bearer ${tokenToUse}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    return response;
  };

  let response = await makeRequest(authToken);

  if (response.status === 401) {
    // Try refreshing token
    try {
      const data = await refreshToken();

      // Update tokens in localStorage
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Retry original request with new token
      response = await makeRequest(data.accessToken);
    } catch (err) {
      // Refresh token failed -> logout user
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || response.statusText || "Request failed");
  }

  return response.json();
};

