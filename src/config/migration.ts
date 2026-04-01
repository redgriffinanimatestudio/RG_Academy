export const MIGRATION_CONFIG = {
  USE_PRODUCTION_READ: true, // Reading from Primary DB
  USE_PRODUCTION_WRITE: true, // Writing to Primary DB
  DUAL_WRITE: false, 
  FAILOVER_TO_FIRESTORE: false,
  SYNC_TO_PRODUCTION: false,
  LOG_DIFFS: false
};
