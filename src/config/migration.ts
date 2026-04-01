export const MIGRATION_CONFIG = {
  USE_PRODUCTION_READ: false, // Reading from Primary DB
  USE_PRODUCTION_WRITE: false, // Writing to Primary DB
  DUAL_WRITE: false, // Writing to both Legacy and Primary
  FAILOVER_TO_FIRESTORE: true,
  SYNC_TO_PRODUCTION: false,
  LOG_DIFFS: false
};
