/**
 * Migration Configuration for API Version Test
 * This mimics the root config to ensure services work correctly.
 */
export const MIGRATION_CONFIG = {
  USE_POSTGRES_READ: true,
  USE_POSTGRES_WRITE: true,
  FAILOVER_TO_FIRESTORE: true,
  DUAL_WRITE: true,
  SYNC_USER_ON_LOGIN: true
};
