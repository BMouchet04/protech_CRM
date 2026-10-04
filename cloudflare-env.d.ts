declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    SUPABASE_SYNC_URL?: string;
    SYNC_SHARED_SECRET?: string;
  }
}
