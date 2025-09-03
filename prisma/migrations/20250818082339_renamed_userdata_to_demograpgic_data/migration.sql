/*
  Warnings:

  - You are about to drop the `UserData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserData";

-- CreateTable
CREATE TABLE "DemographicData" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "yearOfBirth" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "DemographicData_pkey" PRIMARY KEY ("id")
);
