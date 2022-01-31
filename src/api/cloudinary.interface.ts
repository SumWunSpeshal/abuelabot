export interface CloudinarySearchResponseInterface {
  total_count: number;
  time: number;
  resources: ResourceResponse[];
  rate_limit_allowed: number;
  rate_limit_reset_at: Date;
  rate_limit_remaining: number;
}

export interface ResourceResponse {
  asset_id: string;
  public_id: string;
  folder: string;
  filename: string;
  display_name?: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  uploaded_at: string;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  access_control?: string[];
  etag: string;
  created_by: {};
  uploaded_by: {};
}
