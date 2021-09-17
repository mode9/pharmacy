-- CreateTable
CREATE TABLE "Pharmacy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address_road" TEXT,
    "address" TEXT,
    "x" INTEGER,
    "y" INTEGER
);

-- CreateTable
CREATE TABLE "OpeningHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "opening" INTEGER NOT NULL,
    "closing" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "pharmacyId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OpeningHour_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
