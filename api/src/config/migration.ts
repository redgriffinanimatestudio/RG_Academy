/**
 * Migration Configuration for API Version Test
 * This mimics the root config to ensure services work correctly.
 */
export const MIGRATION_CONFIG = {
  USE_POSTGRES_READ: false,
  USE_POSTGRES_WRITE: false,
  FAILOVER_TO_FIRESTORE: false,
  DUAL_WRITE: false,
  SYNC_USER_ON_LOGIN: false
};
