/*
  Warnings:

  - Added the required column `automaticWatering` to the `plantSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stopLight` to the `plantSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wateringStartMoisture` to the `plantSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `plantSettings` ADD COLUMN `automaticWatering` BOOLEAN NOT NULL,
    ADD COLUMN `stopLight` INTEGER NOT NULL,
    ADD COLUMN `wateringStartMoisture` INTEGER NOT NULL;
