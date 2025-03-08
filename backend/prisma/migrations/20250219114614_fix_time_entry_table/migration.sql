/*
  Warnings:

  - You are about to drop the column `projectId` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TimeEntry` table. All the data in the column will be lost.
  - Added the required column `projectUserId` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectUserId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimeEntry_projectUserId_fkey" FOREIGN KEY ("projectUserId") REFERENCES "ProjectUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TimeEntry" ("createdAt", "description", "endTime", "id", "startTime") SELECT "createdAt", "description", "endTime", "id", "startTime" FROM "TimeEntry";
DROP TABLE "TimeEntry";
ALTER TABLE "new_TimeEntry" RENAME TO "TimeEntry";
CREATE INDEX "TimeEntry_projectUserId_idx" ON "TimeEntry"("projectUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
