
import { Notification, AnalyzeRequest, ApiResponse } from "../types";

// API base URL - adjust as needed when integrating with real backend
const API_BASE_URL = "https://api.onyxguard.example"; // Replace with actual API URL when ready

// Helper for HTTP requests
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

// API Functions
export async function analyzeWallet(walletAddress: string): Promise<ApiResponse<Notification[]>> {
  const payload: AnalyzeRequest = { address: walletAddress };
  
  // For development, return mock data
  if (process.env.NODE_ENV === "development") {
    return mockAnalyzeWallet();
  }
  
  return fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getNotifications(): Promise<ApiResponse<Notification[]>> {
  // For development, return mock data
  if (process.env.NODE_ENV === "development") {
    return mockGetNotifications();
  }
  
  return fetchWithErrorHandling<Notification[]>(`${API_BASE_URL}/notifications`);
}

// Mock data for development
function mockAnalyzeWallet(): Promise<ApiResponse<Notification[]>> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: getMockNotifications(),
        status: 200
      });
    }, 1000); // Simulate network delay
  });
}

function mockGetNotifications(): Promise<ApiResponse<Notification[]>> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: getMockNotifications(),
        status: 200
      });
    }, 800); // Simulate network delay
  });
}

function getMockNotifications(): Notification[] {
  return [
    {
      id: "1",
      asset_name: "ETH",
      risk_level: "MEDIUM",
      notification_type: "Positive Development Reported",
      reason: "ETH shows strong bullish momentum post-Pectra upgrade, with increased on-chain activity and institutional interest driving price action above key resistance levels.",
      source: [
        "https://cryptopanic.com/news/21699937/Ethereum-Breaking-Key-Levels",
        "https://cryptopanic.com/news/21693933/Institutional-Interest-Growing"
      ],
      priority: 7
    },
    {
      id: "2",
      asset_name: "BTC",
      risk_level: "LOW",
      notification_type: "Security Update",
      reason: "Bitcoin network hashrate reaches all-time high, indicating increased security and mining decentralization. No significant vulnerabilities reported in the past 30 days.",
      source: [
        "https://blockchain.info/stats",
        "https://cve.mitre.org/cgi-bin/cvename.cgi?name=recent-btc"
      ],
      priority: 3
    },
    {
      id: "3",
      asset_name: "LINK",
      risk_level: "HIGH",
      notification_type: "Suspicious Activity Detected",
      reason: "Abnormal token movements detected from known exchange wallets to unverified addresses. Potential market manipulation pattern identified with coordinated on-chain activity preceding price volatility.",
      source: [
        "https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca",
        "https://cryptoquant.com/overview/full/247"
      ],
      priority: 9
    },
    {
      id: "4",
      asset_name: "USDT",
      risk_level: "MEDIUM",
      notification_type: "Regulatory Development",
      reason: "New compliance requirements announced by financial authorities may impact stablecoin operations. Tether reserves under renewed scrutiny with audit deadline approaching.",
      source: [
        "https://www.financialregulator.gov/announcements/2023-05",
        "https://tether.to/en/transparency/"
      ],
      priority: 6
    },
    {
      id: "5",
      asset_name: "SOL",
      risk_level: "LOW",
      notification_type: "Network Update",
      reason: "Successful protocol upgrade implemented with 99.8% validator participation. Performance improvements measured at 22% increased throughput with reduced fee structure.",
      source: [
        "https://solana.com/news/upgrade-2023-q2",
        "https://github.com/solana-labs/solana/releases/tag/v1.16.0"
      ],
      priority: 4
    },
    {
      id: "6",
      asset_name: "USDC",
      risk_level: "HIGH",
      notification_type: "Smart Contract Risk",
      reason: "Critical vulnerability discovered in proxy implementation affecting specific USDC implementations. Emergency patch released but adoption currently at only 76% of affected contracts.",
      source: [
        "https://circle.com/blog/security-bulletin-2023-06",
        "https://immunefi.com/vulnerability/usdc-proxy/"
      ],
      priority: 10
    }
  ];
}
