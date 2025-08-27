/*
  Warnings:

  - You are about to drop the column `definition` on the `Workflow` table. All the data in the column will be lost.
  - Added the required column `definition` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "definition" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Workflow" ("createdAt", "description", "definition", "id", "name", "status", "updatedAt", "userId")
SELECT
  "createdAt",
  "description",
  COALESCE("definition", 'TODO'),
  "id",
  "name",
  "status",
  "updateAt",
  "userId"
FROM "Workflow";
DROP TABLE "Workflow";
ALTER TABLE "new_Workflow" RENAME TO "Workflow";
CREATE UNIQUE INDEX "Workflow_name_userId_key" ON "Workflow"("name", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
