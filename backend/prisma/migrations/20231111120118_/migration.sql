/*
  Warnings:

  - The primary key for the `SensorData` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SensorData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "soilMoisture" REAL NOT NULL,
    "temperature" REAL NOT NULL,
    "humidity" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SensorData" ("createdAt", "humidity", "id", "soilMoisture", "temperature") SELECT "createdAt", "humidity", "id", "soilMoisture", "temperature" FROM "SensorData";
DROP TABLE "SensorData";
ALTER TABLE "new_SensorData" RENAME TO "SensorData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
