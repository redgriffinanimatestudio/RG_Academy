/*
  Warnings:

  - You are about to drop the column `lastSyncedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `remoteId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `remoteId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncedAt` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `remoteId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `remoteId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncedAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `remoteId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Review` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporterId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "subcategories" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id", "name", "order", "subcategories", "type") SELECT "id", "name", "order", "subcategories", "type" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lecturerId" TEXT NOT NULL,
    "lecturerName" TEXT NOT NULL,
    "lecturerAvatar" TEXT DEFAULT 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
    "price" REAL NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "studentsCount" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL DEFAULT '10h',
    "level" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("categoryId", "createdAt", "description", "duration", "id", "lecturerAvatar", "lecturerId", "lecturerName", "level", "price", "rating", "reviewsCount", "slug", "status", "studentsCount", "tags", "thumbnail", "title") SELECT "categoryId", "createdAt", "description", "duration", "id", "lecturerAvatar", "lecturerId", "lecturerName", "level", "price", "rating", "reviewsCount", "slug", "status", "studentsCount", "tags", "thumbnail", "title" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE TABLE "new_Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "completedLessons" TEXT NOT NULL DEFAULT '[]',
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Enrollment" ("completedAt", "completedLessons", "courseId", "enrolledAt", "id", "progress", "status", "userId") SELECT "completedAt", "completedLessons", "courseId", "enrolledAt", "id", "progress", "status", "userId" FROM "Enrollment";
DROP TABLE "Enrollment";
ALTER TABLE "new_Enrollment" RENAME TO "Enrollment";
CREATE TABLE "new_Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lesson" ("content", "courseId", "createdAt", "duration", "id", "isFree", "order", "title", "type", "videoUrl") SELECT "content", "courseId", "createdAt", "duration", "id", "isFree", "order", "title", "type", "videoUrl" FROM "Lesson";
DROP TABLE "Lesson";
ALTER TABLE "new_Lesson" RENAME TO "Lesson";
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("comment", "courseId", "createdAt", "id", "isApproved", "rating", "userId") SELECT "comment", "courseId", "createdAt", "id", "isApproved", "rating", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
