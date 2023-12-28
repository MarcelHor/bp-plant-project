/*
  Warnings:

  - Added the required column `cronTime` to the `emailSettings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_emailSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cronTime" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "recipient" TEXT NOT NULL
);
INSERT INTO "new_emailSettings" ("id", "recipient", "subject") SELECT "id", "recipient", "subject" FROM "emailSettings";
DROP TABLE "emailSettings";
ALTER TABLE "new_emailSettings" RENAME TO "emailSettings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
