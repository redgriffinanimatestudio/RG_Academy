-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: rg_academy
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AIBase`
--

DROP TABLE IF EXISTS `AIBase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AIBase` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prompt` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AIBase_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AIBase`
--

LOCK TABLES `AIBase` WRITE;
/*!40000 ALTER TABLE `AIBase` DISABLE KEYS */;
/*!40000 ALTER TABLE `AIBase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AISimulation`
--

DROP TABLE IF EXISTS `AISimulation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AISimulation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `persona` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `history` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `AISimulation_userId_fkey` (`userId`),
  CONSTRAINT `AISimulation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AISimulation`
--

LOCK TABLES `AISimulation` WRITE;
/*!40000 ALTER TABLE `AISimulation` DISABLE KEYS */;
/*!40000 ALTER TABLE `AISimulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Achievement`
--

DROP TABLE IF EXISTS `Achievement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Achievement` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `earnedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Achievement_userId_fkey` (`userId`),
  CONSTRAINT `Achievement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Achievement`
--

LOCK TABLES `Achievement` WRITE;
/*!40000 ALTER TABLE `Achievement` DISABLE KEYS */;
/*!40000 ALTER TABLE `Achievement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Annotation`
--

DROP TABLE IF EXISTS `Annotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Annotation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Annotation_sessionId_fkey` (`sessionId`),
  KEY `Annotation_authorId_fkey` (`authorId`),
  CONSTRAINT `Annotation_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Annotation_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `ReviewSession` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Annotation`
--

LOCK TABLES `Annotation` WRITE;
/*!40000 ALTER TABLE `Annotation` DISABLE KEYS */;
/*!40000 ALTER TABLE `Annotation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Application`
--

DROP TABLE IF EXISTS `Application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Application` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `executorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverLetter` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bid` double NOT NULL,
  `days` int NOT NULL DEFAULT '7',
  `milestones` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `matchScore` int NOT NULL DEFAULT '0',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Application_projectId_fkey` (`projectId`),
  KEY `Application_executorId_fkey` (`executorId`),
  CONSTRAINT `Application_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Application_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Application`
--

LOCK TABLES `Application` WRITE;
/*!40000 ALTER TABLE `Application` DISABLE KEYS */;
/*!40000 ALTER TABLE `Application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Assignment`
--

DROP TABLE IF EXISTS `Assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Assignment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deadline` datetime(3) DEFAULT NULL,
  `maxScore` double NOT NULL DEFAULT '100',
  `rubricId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Assignment_courseId_fkey` (`courseId`),
  KEY `Assignment_rubricId_fkey` (`rubricId`),
  CONSTRAINT `Assignment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Assignment_rubricId_fkey` FOREIGN KEY (`rubricId`) REFERENCES `Rubric` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assignment`
--

LOCK TABLES `Assignment` WRITE;
/*!40000 ALTER TABLE `Assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Attendance`
--

DROP TABLE IF EXISTS `Attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Attendance` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Attendance_userId_fkey` (`userId`),
  CONSTRAINT `Attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attendance`
--

LOCK TABLES `Attendance` WRITE;
/*!40000 ALTER TABLE `Attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `Attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CareerPath`
--

DROP TABLE IF EXISTS `CareerPath`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CareerPath` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skills` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `steps` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CareerPath`
--

LOCK TABLES `CareerPath` WRITE;
/*!40000 ALTER TABLE `CareerPath` DISABLE KEYS */;
/*!40000 ALTER TABLE `CareerPath` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accentColor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `subcategories` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES ('cmnfjspl2000vf09cel3hbe50','3D Modeling','cmnfjspl2000wf09cx7aenvbz',NULL,NULL,NULL,'academy',1,'[\"Character Design\",\"Environment Art\",\"Hard Surface\"]','2026-04-01 04:30:48.711','2026-04-01 04:30:48.711'),('cmnfjsplv000xf09c2184tzvx','VFX & Dynamics','cmnfjsplv000yf09cwyu2wu5f',NULL,NULL,NULL,'academy',2,'[\"Destruction\",\"Water Sims\",\"Fire & Smoke\"]','2026-04-01 04:30:48.739','2026-04-01 04:30:48.739');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Certificate`
--

DROP TABLE IF EXISTS `Certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Certificate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Red Griffin Academy',
  `grade` double DEFAULT NULL,
  `credentialId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qrCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Certificate_credentialId_key` (`credentialId`),
  KEY `Certificate_userId_idx` (`userId`),
  KEY `Certificate_courseId_idx` (`courseId`),
  CONSTRAINT `Certificate_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Certificate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Certificate`
--

LOCK TABLES `Certificate` WRITE;
/*!40000 ALTER TABLE `Certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `Certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChatRoom`
--

DROP TABLE IF EXISTS `ChatRoom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChatRoom` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'direct',
  `refId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `participants` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `lastMessage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChatRoom`
--

LOCK TABLES `ChatRoom` WRITE;
/*!40000 ALTER TABLE `ChatRoom` DISABLE KEYS */;
INSERT INTO `ChatRoom` VALUES ('cmnfjsphr000mf09cqpe8bt91','direct',NULL,'[\"cmnfjsob90000f09cnxet3xw7\",\"cmnfjsokh0004f09cla3k1s04\"]','Welcome to the platform!','2026-04-01 04:30:48.591','2026-04-01 04:30:48.591');
/*!40000 ALTER TABLE `ChatRoom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cohort`
--

DROP TABLE IF EXISTS `Cohort`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cohort` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Cohort_programId_fkey` (`programId`),
  CONSTRAINT `Cohort_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cohort`
--

LOCK TABLES `Cohort` WRITE;
/*!40000 ALTER TABLE `Cohort` DISABLE KEYS */;
/*!40000 ALTER TABLE `Cohort` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Connection`
--

DROP TABLE IF EXISTS `Connection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Connection` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `followerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `followingId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Connection_followerId_followingId_key` (`followerId`,`followingId`),
  KEY `Connection_followingId_fkey` (`followingId`),
  CONSTRAINT `Connection_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Connection_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Connection`
--

LOCK TABLES `Connection` WRITE;
/*!40000 ALTER TABLE `Connection` DISABLE KEYS */;
/*!40000 ALTER TABLE `Connection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contract`
--

DROP TABLE IF EXISTS `Contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contract` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `executorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `milestones` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Contract_projectId_fkey` (`projectId`),
  KEY `Contract_clientId_fkey` (`clientId`),
  KEY `Contract_executorId_fkey` (`executorId`),
  CONSTRAINT `Contract_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Contract_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Contract_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contract`
--

LOCK TABLES `Contract` WRITE;
/*!40000 ALTER TABLE `Contract` DISABLE KEYS */;
/*!40000 ALTER TABLE `Contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lecturerAvatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
  `price` double NOT NULL,
  `thumbnail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` double NOT NULL DEFAULT '4.5',
  `reviewsCount` int NOT NULL DEFAULT '0',
  `studentsCount` int NOT NULL DEFAULT '0',
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '10h',
  `level` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lod` int NOT NULL DEFAULT '100',
  `softwareStack` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Course_slug_key` (`slug`),
  KEY `Course_categoryId_fkey` (`categoryId`),
  KEY `Course_programId_fkey` (`programId`),
  CONSTRAINT `Course_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Course_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
INSERT INTO `Course` VALUES ('cmnfjspmi0010f09c51xc26je','unreal-engine-masterclass','Unreal Engine 5: The Ultimate Masterclass','Master UE5 from scratch to advanced cinematic rendering.','cmnfjsob90000f09cnxet3xw7','System Architect','https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',199.99,'https://images.unsplash.com/photo-1620121692029-d088224efc74?auto=format&fit=crop&q=80',4.5,0,0,'10h','intermediate','[\"UE5\",\"Rendering\",\"Gamedev\"]','published','2026-04-01 04:30:48.762','cmnfjspl2000vf09cel3hbe50',NULL,100,'[]');
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Criteria`
--

DROP TABLE IF EXISTS `Criteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Criteria` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rubricId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maxScore` double NOT NULL,
  `weight` double NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `Criteria_rubricId_fkey` (`rubricId`),
  CONSTRAINT `Criteria_rubricId_fkey` FOREIGN KEY (`rubricId`) REFERENCES `Rubric` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Criteria`
--

LOCK TABLES `Criteria` WRITE;
/*!40000 ALTER TABLE `Criteria` DISABLE KEYS */;
/*!40000 ALTER TABLE `Criteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Department`
--

DROP TABLE IF EXISTS `Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Department` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Department_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Department`
--

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;
/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Enrollment`
--

DROP TABLE IF EXISTS `Enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Enrollment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cohortId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progress` int NOT NULL DEFAULT '0',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `grade` double DEFAULT NULL,
  `completedLessons` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `enrolledAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Enrollment_cohortId_fkey` (`cohortId`),
  KEY `Enrollment_courseId_fkey` (`courseId`),
  KEY `Enrollment_userId_fkey` (`userId`),
  CONSTRAINT `Enrollment_cohortId_fkey` FOREIGN KEY (`cohortId`) REFERENCES `Cohort` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Enrollment`
--

LOCK TABLES `Enrollment` WRITE;
/*!40000 ALTER TABLE `Enrollment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EnrollmentAnalytics`
--

DROP TABLE IF EXISTS `EnrollmentAnalytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EnrollmentAnalytics` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lessonId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `watchTime` int NOT NULL DEFAULT '0',
  `completedAt` datetime(3) DEFAULT NULL,
  `lastSyncAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `EnrollmentAnalytics_enrollmentId_fkey` (`enrollmentId`),
  CONSTRAINT `EnrollmentAnalytics_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `Enrollment` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EnrollmentAnalytics`
--

LOCK TABLES `EnrollmentAnalytics` WRITE;
/*!40000 ALTER TABLE `EnrollmentAnalytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `EnrollmentAnalytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Escrow`
--

DROP TABLE IF EXISTS `Escrow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Escrow` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'locked',
  `isTaxVerified` tinyint(1) NOT NULL DEFAULT '0',
  `updatedAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Escrow_contractId_key` (`contractId`),
  CONSTRAINT `Escrow_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `Contract` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Escrow`
--

LOCK TABLES `Escrow` WRITE;
/*!40000 ALTER TABLE `Escrow` DISABLE KEYS */;
/*!40000 ALTER TABLE `Escrow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FeedEvent`
--

DROP TABLE IF EXISTS `FeedEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FeedEvent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `FeedEvent_actorId_fkey` (`actorId`),
  CONSTRAINT `FeedEvent_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FeedEvent`
--

LOCK TABLES `FeedEvent` WRITE;
/*!40000 ALTER TABLE `FeedEvent` DISABLE KEYS */;
/*!40000 ALTER TABLE `FeedEvent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Grade`
--

DROP TABLE IF EXISTS `Grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Grade` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reviewerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` double NOT NULL,
  `feedback` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criteriaScores` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Grade_submissionId_fkey` (`submissionId`),
  KEY `Grade_reviewerId_fkey` (`reviewerId`),
  CONSTRAINT `Grade_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Grade_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Grade`
--

LOCK TABLES `Grade` WRITE;
/*!40000 ALTER TABLE `Grade` DISABLE KEYS */;
/*!40000 ALTER TABLE `Grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `JobApplication`
--

DROP TABLE IF EXISTS `JobApplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JobApplication` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `openingId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverLetter` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resumeUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `JobApplication_userId_fkey` (`userId`),
  KEY `JobApplication_openingId_fkey` (`openingId`),
  CONSTRAINT `JobApplication_openingId_fkey` FOREIGN KEY (`openingId`) REFERENCES `JobOpening` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `JobApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JobApplication`
--

LOCK TABLES `JobApplication` WRITE;
/*!40000 ALTER TABLE `JobApplication` DISABLE KEYS */;
/*!40000 ALTER TABLE `JobApplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `JobOpening`
--

DROP TABLE IF EXISTS `JobOpening`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JobOpening` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requirements` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `salaryRange` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JobOpening`
--

LOCK TABLES `JobOpening` WRITE;
/*!40000 ALTER TABLE `JobOpening` DISABLE KEYS */;
/*!40000 ALTER TABLE `JobOpening` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Lesson`
--

DROP TABLE IF EXISTS `Lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Lesson` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `videoUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `moduleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Lesson_courseId_fkey` (`courseId`),
  KEY `Lesson_moduleId_fkey` (`moduleId`),
  CONSTRAINT `Lesson_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Lesson_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Lesson`
--

LOCK TABLES `Lesson` WRITE;
/*!40000 ALTER TABLE `Lesson` DISABLE KEYS */;
INSERT INTO `Lesson` VALUES ('cmnfjspoo0017f09cuooo2rtd','cmnfjspmi0010f09c51xc26je','Session 01: Ecosystem Initialization','<p>Standardizing the Unreal Engine workspace for industrial VFX production.</p>','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8','video','12m',1,1,'2026-04-01 04:30:48.840','cmnfjspn60012f09cvi579hq5'),('cmnfjspoo0018f09c2iqdui8r','cmnfjspmi0010f09c51xc26je','Session 02: Folder Hierarchy & Naming Protocols','<p>Ensuring cross-departmental compatibility.</p>','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8','video','18m',2,0,'2026-04-01 04:30:48.840','cmnfjspn60012f09cvi579hq5'),('cmnfjspoo0019f09cqke79xys','cmnfjspmi0010f09c51xc26je','Session 03: Virtualized Geometry Logic','<p>Mastering Nanite for high-poly cinematic assets.</p>','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8','video','45m',3,0,'2026-04-01 04:30:48.840','cmnfjspnp0014f09cas2aab1u'),('cmnfjspoo001af09cxomrfdk6','cmnfjspmi0010f09c51xc26je','Session 04: Real-time Global Illumination (Lumen)','<p>Calibrating infinite bounce lighting.</p>','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8','video','35m',4,0,'2026-04-01 04:30:48.840','cmnfjspnp0014f09cas2aab1u'),('cmnfjspoo001bf09cio8ih7vg','cmnfjspmi0010f09c51xc26je','Session 05: Movie Render Queue Configuration','<p>Exporting industrial-grade EXR sequences.</p>','https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8','video','50m',5,0,'2026-04-01 04:30:48.840','cmnfjspo60016f09c13tus4t0');
/*!40000 ALTER TABLE `Lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Message_roomId_fkey` (`roomId`),
  CONSTRAINT `Message_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `ChatRoom` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
INSERT INTO `Message` VALUES ('cmnfjspie000of09co5tfzc2k','cmnfjsphr000mf09cqpe8bt91','cmnfjsob90000f09cnxet3xw7','Hello! I am the system architect. If you have any questions, feel free to ask.','2026-04-01 04:30:48.608');
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Module`
--

DROP TABLE IF EXISTS `Module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Module` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Module_courseId_fkey` (`courseId`),
  CONSTRAINT `Module_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Module`
--

LOCK TABLES `Module` WRITE;
/*!40000 ALTER TABLE `Module` DISABLE KEYS */;
INSERT INTO `Module` VALUES ('cmnfjspn60012f09cvi579hq5','cmnfjspmi0010f09c51xc26je','I: Neural Foundations & UI',1,'2026-04-01 04:30:48.786'),('cmnfjspnp0014f09cas2aab1u','cmnfjspmi0010f09c51xc26je','II: Nanite & Lumen Architecture',2,'2026-04-01 04:30:48.806'),('cmnfjspo60016f09c13tus4t0','cmnfjspmi0010f09c51xc26je','III: Cinematic Rendering & Path Tracing',3,'2026-04-01 04:30:48.823');
/*!40000 ALTER TABLE `Module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_fkey` (`userId`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
INSERT INTO `Notification` VALUES ('cmnfjspj3000pf09cc5taq0m3','cmnfjsokh0004f09cla3k1s04','info','Welcome','Your creative journey starts here.','/aca/eng',0,'2026-04-01 04:30:48.638'),('cmnfjspj3000qf09cmnf5pw06','cmnfjsob90000f09cnxet3xw7','success','System Status','All systems operational.','/admin/eng',0,'2026-04-01 04:30:48.638');
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Partner`
--

DROP TABLE IF EXISTS `Partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Partner` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Partner`
--

LOCK TABLES `Partner` WRITE;
/*!40000 ALTER TABLE `Partner` DISABLE KEYS */;
/*!40000 ALTER TABLE `Partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PortfolioItem`
--

DROP TABLE IF EXISTS `PortfolioItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PortfolioItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profileId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mediaUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `PortfolioItem_profileId_fkey` (`profileId`),
  CONSTRAINT `PortfolioItem_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PortfolioItem`
--

LOCK TABLES `PortfolioItem` WRITE;
/*!40000 ALTER TABLE `PortfolioItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `PortfolioItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Profile`
--

DROP TABLE IF EXISTS `Profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Profile` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experienceLevel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primarySoftware` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `learningGoal` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portfolioUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `artStationUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hourlyRate` double DEFAULT NULL,
  `aiReadiness` double NOT NULL DEFAULT '0',
  `clientType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyWebsite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `citizenship` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedInUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telegramHandle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfBirth` datetime(3) DEFAULT NULL,
  `ageCategory` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Profile_userId_key` (`userId`),
  CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Profile`
--

LOCK TABLES `Profile` WRITE;
/*!40000 ALTER TABLE `Profile` DISABLE KEYS */;
INSERT INTO `Profile` VALUES ('cmnfjsobc0001f09c1f2ala4p','cmnfjsob90000f09cnxet3xw7','Lead architect of Red Griffin Ecosystem','https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png','Digital Space',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:47.058'),('cmnfjsogn0003f09ckrmbng6q','cmnfjsogn0002f09cpvg5e4xs','VFX Artist with 10+ years experience','https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:47.255'),('cmnfjsoki0005f09cd8f9e33m','cmnfjsokh0004f09cla3k1s04','Learning the magic of CG','https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:47.394'),('cmnfjsoox0007f09cpe2d9bq2','cmnfjsoox0006f09cb1bp6wxt','Strategic director of RG Academy','https://cdn.flyonui.com/fy-assets/avatar/avatar-4.png','HQ Central',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:47.553'),('cmnfjsot20009f09c9a7dudnb','cmnfjsot10008f09cc37szz6r','Operational manager and part-time lecturer','https://cdn.flyonui.com/fy-assets/avatar/avatar-5.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:47.702'),('cmnfjsowz000bf09c28b0q0lr','cmnfjsowy000af09ctotq4brp','Platform moderation and community safety','https://cdn.flyonui.com/fy-assets/avatar/avatar-6.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:47.843'),('cmnfjsp1f000df09cxn2013hu','cmnfjsp1f000cf09cg6y6k5kq','Head of Talent Acquisition','https://cdn.flyonui.com/fy-assets/avatar/avatar-7.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:48.004'),('cmnfjsp5l000ff09c9ttisaio','cmnfjsp5l000ef09ctmmj8n9u','Financial operations and contracts','https://cdn.flyonui.com/fy-assets/avatar/avatar-8.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:48.154'),('cmnfjsp9r000hf09canzx0ek3','cmnfjsp9r000gf09c67afyxju','Technical support and user assistance','https://cdn.flyonui.com/fy-assets/avatar/avatar-9.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:48.303'),('cmnfjspdn000jf09c4anfbc7s','cmnfjspdn000if09cj7u8qau8','Innovative tech company looking for CG talent','https://cdn.flyonui.com/fy-assets/avatar/avatar-10.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:48.444'),('cmnfjsph9000lf09cnfdp5czs','cmnfjsph9000kf09ce55ovyai','Freelance CG Generalist and Unreal specialist','https://cdn.flyonui.com/fy-assets/avatar/avatar-11.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-01 04:30:48.574');
/*!40000 ALTER TABLE `Profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProfileSkill`
--

DROP TABLE IF EXISTS `ProfileSkill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfileSkill` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profileId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skillId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proficiency` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProfileSkill_profileId_skillId_key` (`profileId`,`skillId`),
  KEY `ProfileSkill_skillId_fkey` (`skillId`),
  CONSTRAINT `ProfileSkill_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ProfileSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfileSkill`
--

LOCK TABLES `ProfileSkill` WRITE;
/*!40000 ALTER TABLE `ProfileSkill` DISABLE KEYS */;
/*!40000 ALTER TABLE `ProfileSkill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Program`
--

DROP TABLE IF EXISTS `Program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Program` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `levels` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Program_slug_key` (`slug`),
  KEY `Program_departmentId_fkey` (`departmentId`),
  CONSTRAINT `Program_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Program`
--

LOCK TABLES `Program` WRITE;
/*!40000 ALTER TABLE `Program` DISABLE KEYS */;
/*!40000 ALTER TABLE `Program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `executorId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `urgency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `budget` double NOT NULL DEFAULT '0',
  `tags` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `requiredSkills` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `maturityLevel` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'junior',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Project_slug_key` (`slug`),
  KEY `Project_slug_idx` (`slug`),
  KEY `Project_clientId_idx` (`clientId`),
  KEY `Project_status_idx` (`status`),
  KEY `Project_executorId_fkey` (`executorId`),
  CONSTRAINT `Project_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Project_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
INSERT INTO `Project` VALUES ('cmnfjspp8001df09cs465ejjo','Cinematic Trailer for Indie RPG','cinematic-indie-rpg','We need a high-quality 30s trailer for our upcoming RPG.','cmnfjsob90000f09cnxet3xw7',NULL,'open','urgent',5000,'[\"Animation\",\"Rendering\",\"indie\"]','[]','junior','2026-04-01 04:30:48.860','2026-04-01 04:30:48.860');
/*!40000 ALTER TABLE `Project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Report`
--

DROP TABLE IF EXISTS `Report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Report` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reporterId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Report_reporterId_fkey` (`reporterId`),
  CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Report`
--

LOCK TABLES `Report` WRITE;
/*!40000 ALTER TABLE `Report` DISABLE KEYS */;
/*!40000 ALTER TABLE `Report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Review`
--

DROP TABLE IF EXISTS `Review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Review` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `comment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Review_userId_fkey` (`userId`),
  KEY `Review_courseId_fkey` (`courseId`),
  CONSTRAINT `Review_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Review`
--

LOCK TABLES `Review` WRITE;
/*!40000 ALTER TABLE `Review` DISABLE KEYS */;
/*!40000 ALTER TABLE `Review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReviewSession`
--

DROP TABLE IF EXISTS `ReviewSession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReviewSession` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taskId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mediaUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mediaType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ReviewSession_taskId_key` (`taskId`),
  KEY `ReviewSession_projectId_fkey` (`projectId`),
  CONSTRAINT `ReviewSession_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ReviewSession_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReviewSession`
--

LOCK TABLES `ReviewSession` WRITE;
/*!40000 ALTER TABLE `ReviewSession` DISABLE KEYS */;
/*!40000 ALTER TABLE `ReviewSession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rubric`
--

DROP TABLE IF EXISTS `Rubric`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rubric` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rubric`
--

LOCK TABLES `Rubric` WRITE;
/*!40000 ALTER TABLE `Rubric` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rubric` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schedule`
--

DROP TABLE IF EXISTS `Schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Schedule` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cohortId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Schedule_courseId_fkey` (`courseId`),
  KEY `Schedule_cohortId_fkey` (`cohortId`),
  CONSTRAINT `Schedule_cohortId_fkey` FOREIGN KEY (`cohortId`) REFERENCES `Cohort` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Schedule_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedule`
--

LOCK TABLES `Schedule` WRITE;
/*!40000 ALTER TABLE `Schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `Schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Service`
--

DROP TABLE IF EXISTS `Service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Service` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `executorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `rating` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Service_executorId_fkey` (`executorId`),
  CONSTRAINT `Service_executorId_fkey` FOREIGN KEY (`executorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Service`
--

LOCK TABLES `Service` WRITE;
/*!40000 ALTER TABLE `Service` DISABLE KEYS */;
INSERT INTO `Service` VALUES ('cmnfjspq3001ff09c304swin4','High-poly Character Sculpting','I will sculpt a professional 3D character for your game.','cmnfjsogn0002f09cpvg5e4xs',450,'Character Design','[\"ZBrush\",\"Sculpting\"]',4.9,'2026-04-01 04:30:48.891');
/*!40000 ALTER TABLE `Service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Skill`
--

DROP TABLE IF EXISTS `Skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Skill` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Skill_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Skill`
--

LOCK TABLES `Skill` WRITE;
/*!40000 ALTER TABLE `Skill` DISABLE KEYS */;
INSERT INTO `Skill` VALUES ('cmnfjspk5000sf09ccq4qh90v','Houdini'),('cmnfjspkc000uf09cqxxixn77','Maya'),('cmnfjspjt000rf09cnxfffla3','Unreal Engine'),('cmnfjspk6000tf09cn4x9fjn6','ZBrush');
/*!40000 ALTER TABLE `Skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Submission`
--

DROP TABLE IF EXISTS `Submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Submission` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assignmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contentUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Submission_assignmentId_fkey` (`assignmentId`),
  KEY `Submission_userId_fkey` (`userId`),
  CONSTRAINT `Submission_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Submission`
--

LOCK TABLES `Submission` WRITE;
/*!40000 ALTER TABLE `Submission` DISABLE KEYS */;
/*!40000 ALTER TABLE `Submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemMetric`
--

DROP TABLE IF EXISTS `SystemMetric`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemMetric` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` double NOT NULL,
  `nodeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'master-01',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nominal',
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemMetric`
--

LOCK TABLES `SystemMetric` WRITE;
/*!40000 ALTER TABLE `SystemMetric` DISABLE KEYS */;
/*!40000 ALTER TABLE `SystemMetric` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Task`
--

DROP TABLE IF EXISTS `Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Task` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigneeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
  `priority` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `deadline` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Task_projectId_fkey` (`projectId`),
  KEY `Task_assigneeId_fkey` (`assigneeId`),
  CONSTRAINT `Task_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Task`
--

LOCK TABLES `Task` WRITE;
/*!40000 ALTER TABLE `Task` DISABLE KEYS */;
/*!40000 ALTER TABLE `Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transaction`
--

DROP TABLE IF EXISTS `Transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transaction` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `refId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Transaction_userId_idx` (`userId`),
  KEY `Transaction_type_idx` (`type`),
  KEY `Transaction_status_idx` (`status`),
  KEY `Transaction_refId_idx` (`refId`),
  CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transaction`
--

LOCK TABLES `Transaction` WRITE;
/*!40000 ALTER TABLE `Transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `Transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photoURL` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `primaryRole` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `roles` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '["user"]',
  `isStudent` tinyint(1) NOT NULL DEFAULT '0',
  `isLecturer` tinyint(1) NOT NULL DEFAULT '0',
  `isClient` tinyint(1) NOT NULL DEFAULT '0',
  `isExecutor` tinyint(1) NOT NULL DEFAULT '0',
  `isHr` tinyint(1) NOT NULL DEFAULT '0',
  `isFinance` tinyint(1) NOT NULL DEFAULT '0',
  `isSupport` tinyint(1) NOT NULL DEFAULT '0',
  `isAgency` tinyint(1) NOT NULL DEFAULT '0',
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remoteId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `lastSyncedAt` datetime(3) DEFAULT NULL,
  `balance` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `partnerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_phone_key` (`phone`),
  UNIQUE KEY `User_remoteId_key` (`remoteId`),
  KEY `User_role_idx` (`role`),
  KEY `User_isAdmin_idx` (`isAdmin`),
  KEY `User_isStudent_idx` (`isStudent`),
  KEY `User_isLecturer_idx` (`isLecturer`),
  KEY `User_isClient_idx` (`isClient`),
  KEY `User_isExecutor_idx` (`isExecutor`),
  KEY `User_partnerId_fkey` (`partnerId`),
  CONSTRAINT `User_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cmnfjsob90000f09cnxet3xw7','admin@redgriffin.academy',NULL,'System Architect',NULL,'$2b$10$a7YcqdHLwbLeTLiiHqjb0ef5EfZpShXxbBfp9WzeDiQIUnCGnNP6e','student','admin','[\"admin\",\"student\",\"lecturer\",\"agency\",\"hr\",\"finance\",\"support\"]',1,1,0,0,1,1,1,1,1,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:47.058','2026-04-01 05:08:13.239',NULL),('cmnfjsogn0002f09cpvg5e4xs','lecturer@example.com',NULL,'Alex Rivers',NULL,'$2b$10$wdt9IRhB/1KRSKNMHMXeFenRIr48gyC3cggwTJ4f2zoPH6bSy/MFO','lecturer','lecturer','[\"lecturer\"]',0,1,0,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:47.255','2026-04-01 04:30:47.255',NULL),('cmnfjsokh0004f09cla3k1s04','student@example.com',NULL,'New Artist',NULL,'$2b$10$tEXJQmhPzBEhJ.y277jwPueUUx2OVODHAL5tUmKx.HgxMACi1VuTW','student','student','[\"student\"]',1,0,0,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:47.394','2026-04-01 04:30:47.394',NULL),('cmnfjsoox0006f09cb1bp6wxt','chief@redgriffin.academy',NULL,'Elena Vance',NULL,'$2b$10$5eM4dyXgIEKmhuvDf2fgYuuWp9U5NeHR4n/IXSBsnk4nHIGIKw5qm','chief_manager','chief_manager','[\"chief_manager\",\"admin\"]',0,0,0,0,0,0,0,0,1,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:47.553','2026-04-01 04:30:47.553',NULL),('cmnfjsot10008f09cc37szz6r','manager@redgriffin.academy',NULL,'Marcus Aurelius',NULL,'$2b$10$g4slGcYxK5P5APX6qz.9t.r7yMeOWPG4V1L4UclAndEhBF/wZbJsK','manager','manager','[\"manager\",\"lecturer\"]',0,1,0,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:47.702','2026-04-01 04:30:47.702',NULL),('cmnfjsowy000af09ctotq4brp','moderator@redgriffin.academy',NULL,'Sarah Connor',NULL,'$2b$10$G45Fr8wB1t6swFsd69y5VOxPcHTBlEKT6clzKdOaY8i9n36j7DB4q','moderator','moderator','[\"moderator\"]',0,0,0,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:47.843','2026-04-01 04:30:47.843',NULL),('cmnfjsp1f000cf09cg6y6k5kq','hr@redgriffin.academy',NULL,'Miranda Lawson',NULL,'$2b$10$4WGU6hjLFcgbF2IKe1WbSuhJ/iqqXjKvWeJGltBH2GSKrIgOaM4RS','hr','hr','[\"hr\"]',0,0,0,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:48.004','2026-04-01 04:30:48.004',NULL),('cmnfjsp5l000ef09ctmmj8n9u','finance@redgriffin.academy',NULL,'Garrus Vakarian',NULL,'$2b$10$3vIlS5skx1hNfJAaCng53.CXFDv478o2ubsuXt8iLKUiH7M0jbFoK','finance','finance','[\"finance\"]',0,0,0,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:48.154','2026-04-01 04:30:48.154',NULL),('cmnfjsp9r000gf09c67afyxju','support@redgriffin.academy',NULL,'Tali Zorah',NULL,'$2b$10$cBVLgTcSxz1cCyF8PYX8AOVO4htwnrZvKUIL2T.3VnhzAZiYxj1i2','support','support','[\"support\"]',0,0,0,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:48.303','2026-04-01 04:30:48.303',NULL),('cmnfjspdn000if09cj7u8qau8','client@example.com',NULL,'Cyberdyne Systems',NULL,'$2b$10$0YU0sRxXYAbqhfRomRAJk.Vaehv4R9bZfcQVdzGD/SuMIGe3SOSSi','client','client','[\"client\"]',0,0,1,0,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:48.444','2026-04-01 04:30:48.444',NULL),('cmnfjsph9000kf09ce55ovyai','executor@example.com',NULL,'Solid Snake',NULL,'$2b$10$efPF0SqzlW7OoqhQ9ypJie/loyvbmUU7iEz5i/j/qVKx3E1qMhFVG','executor','executor','[\"executor\",\"student\"]',1,0,0,1,0,0,0,0,0,NULL,NULL,'local',NULL,0,'2026-04-01 04:30:48.574','2026-04-01 04:30:48.574',NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserTrajectory`
--

DROP TABLE IF EXISTS `UserTrajectory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserTrajectory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pathId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currentStep` int NOT NULL DEFAULT '0',
  `stepsCompleted` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `aiFeedback` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserTrajectory_userId_fkey` (`userId`),
  KEY `UserTrajectory_pathId_fkey` (`pathId`),
  CONSTRAINT `UserTrajectory_pathId_fkey` FOREIGN KEY (`pathId`) REFERENCES `CareerPath` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UserTrajectory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTrajectory`
--

LOCK TABLES `UserTrajectory` WRITE;
/*!40000 ALTER TABLE `UserTrajectory` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserTrajectory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vacancy`
--

DROP TABLE IF EXISTS `Vacancy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Vacancy` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `partnerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Vacancy_partnerId_fkey` (`partnerId`),
  CONSTRAINT `Vacancy_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vacancy`
--

LOCK TABLES `Vacancy` WRITE;
/*!40000 ALTER TABLE `Vacancy` DISABLE KEYS */;
/*!40000 ALTER TABLE `Vacancy` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01  9:06:36
