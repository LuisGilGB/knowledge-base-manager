export interface Connection {
  connection_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  connection_provider: string;
  connection_provider_data?: Record<string, unknown>;
}
