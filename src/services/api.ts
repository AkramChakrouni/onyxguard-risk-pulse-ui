import { Notification, AnalyzeRequest, ApiResponse } from "../types";

// 🔧 Set to your local or deployed backend gateway
const API_BASE_URL = "http://localhost:8003";

// Reusable fetch wrapper
async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: {} as T,
        status: response.status,
        message: data.message || "An error occurred",
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      data: {} as T,
      status: 500,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// ⬇️ Sends wallet address to /analyze endpoint
export async function analyzeWallet(walletAddress: string): Promise<ApiResponse<Notification[]>> {
  const payload: AnalyzeRequest = { address: walletAddress };

  return fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ⬇️ Fetches notifications from backend
export async function getNotifications(): Promise<ApiResponse<Notification[]>> {
  return fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/notifications`);
}