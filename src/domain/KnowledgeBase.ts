export interface KnowledgeBase {
  knowledge_base_id: string;
  name: string;
  description?: string;
  connection_id: string;
  connection_source_ids: string[];
  created_at: string;
  updated_at: string;
  indexing_params?: Record<string, unknown>;
}
