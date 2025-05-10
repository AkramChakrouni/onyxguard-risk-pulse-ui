
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Notification {
  asset_name: string;
  risk_level: RiskLevel;
  notification_type: string;
  reason: string;
  source: string[];
  priority: number;
  id?: string; // For frontend use
}

export interface AnalyzeRequest {
  address: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
