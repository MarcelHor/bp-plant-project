/*
  Warnings:

  - You are about to drop the column `wateringInterval` on the `plantSettings` table. All the data in the column will be lost.
  - Added the required column `waterPlant` to the `plantSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wateringDuration` to the `plantSettings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_plantSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captureInterval" INTEGER NOT NULL,
    "wateringDuration" INTEGER NOT NULL,
    "waterPlant" BOOLEAN NOT NULL
);
INSERT INTO "new_plantSettings" ("captureInterval", "id") SELECT "captureInterval", "id" FROM "plantSettings";
DROP TABLE "plantSettings";
ALTER TABLE "new_plantSettings" RENAME TO "plantSettings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
