-- update_v2.35.sql
-- Manual Schema Sync for Red Griffin Academy (v2.35)
-- Goal: Add missing columns and tables to the production MySQL DB to resolve Prisma (P2022) conflicts.

USE u315573487_db;

-- 1. Update User Table with new role flags and onboarding status
ALTER TABLE `User` 
ADD COLUMN IF NOT EXISTS `isStudent` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isLecturer` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isClient` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isExecutor` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isHr` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isFinance` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isSupport` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isAgency` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isAdmin` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `isOnboarded` BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS `remoteId` VARCHAR(191) UNIQUE,
ADD COLUMN IF NOT EXISTS `source` VARCHAR(191) DEFAULT 'local',
ADD COLUMN IF NOT EXISTS `lastSyncedAt` DATETIME(3),
ADD COLUMN IF NOT EXISTS `balance` DOUBLE DEFAULT 0,
ADD COLUMN IF NOT EXISTS `agencyId` VARCHAR(191);

-- 2. Create UserDocument Table (Consent/Legal)
CREATE TABLE IF NOT EXISTS `UserDocument` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT,
    `fileUrl` VARCHAR(191),
    `signature` VARCHAR(191),
    `status` VARCHAR(191) NOT NULL DEFAULT 'SIGNED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `UserDocument_userId_idx`(`userId`),
    INDEX `UserDocument_type_idx`(`type`),
    CONSTRAINT `UserDocument_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Create SocialConnection Table
CREATE TABLE IF NOT EXISTS `SocialConnection` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `remoteId` VARCHAR(191) NOT NULL,
    `profileData` VARCHAR(191) DEFAULT '{}',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `SocialConnection_userId_provider_key`(`userId`, `provider`),
    INDEX `SocialConnection_userId_idx`(`userId`),
    INDEX `SocialConnection_remoteId_idx`(`remoteId`),
    CONSTRAINT `SocialConnection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
