-- CreateTable
CREATE TABLE "TimelapseData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "thumbnail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
