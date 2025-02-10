-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectUser" ("id", "joinedAt", "projectId", "userId") SELECT "id", "joinedAt", "projectId", "userId" FROM "ProjectUser";
DROP TABLE "ProjectUser";
ALTER TABLE "new_ProjectUser" RENAME TO "ProjectUser";
CREATE TABLE "new_ProjectUserGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectUserId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectUserGroup_projectUserId_fkey" FOREIGN KEY ("projectUserId") REFERENCES "ProjectUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectUserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectUserGroup" ("groupId", "id", "joinedAt", "projectUserId") SELECT "groupId", "id", "joinedAt", "projectUserId" FROM "ProjectUserGroup";
DROP TABLE "ProjectUserGroup";
ALTER TABLE "new_ProjectUserGroup" RENAME TO "ProjectUserGroup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
