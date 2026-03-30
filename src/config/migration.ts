export const MIGRATION_CONFIG = {
  USE_POSTGRES_READ: true, // Academy and other basic reads now use PG
  USE_POSTGRES_WRITE: true,
  DUAL_WRITE: true,
  FAILOVER_TO_FIRESTORE: true,
  LOG_DIFFS: true
};
