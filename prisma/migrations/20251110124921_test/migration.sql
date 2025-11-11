/*
  Warnings:

  - The primary key for the `DemographicData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DemographicData` table. All the data in the column will be lost.
  - The primary key for the `Pairs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Pairs` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Pairs` table. All the data in the column will be lost.
  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pairs" DROP CONSTRAINT "Pairs_userID_fkey";

-- AlterTable
ALTER TABLE "DemographicData" DROP CONSTRAINT "DemographicData_pkey",
DROP COLUMN "id",
ADD COLUMN     "demgraphicDataId" SERIAL NOT NULL,
ADD CONSTRAINT "DemographicData_pkey" PRIMARY KEY ("demgraphicDataId");

-- AlterTable
ALTER TABLE "Pairs" DROP CONSTRAINT "Pairs_pkey",
DROP COLUMN "id",
DROP COLUMN "userID",
ADD COLUMN     "pairId" SERIAL NOT NULL,
ADD COLUMN     "patientID" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "Pairs_pkey" PRIMARY KEY ("pairId");

-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
DROP COLUMN "id",
ADD COLUMN     "reportId" SERIAL NOT NULL,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("reportId");

-- AddForeignKey
ALTER TABLE "Pairs" ADD CONSTRAINT "Pairs_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
