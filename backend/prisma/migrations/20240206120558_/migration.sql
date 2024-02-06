/*
  Warnings:

  - You are about to drop the `rpiSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "rpiSettings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "plantSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captureInterval" INTEGER NOT NULL,
    "wateringInterval" INTEGER NOT NULL
);
