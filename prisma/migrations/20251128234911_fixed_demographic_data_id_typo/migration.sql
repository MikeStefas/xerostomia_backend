/*
  Warnings:

  - The primary key for the `DemographicData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `demgraphicDataId` on the `DemographicData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DemographicData" DROP CONSTRAINT "DemographicData_pkey",
DROP COLUMN "demgraphicDataId",
ADD COLUMN     "demographicDataId" SERIAL NOT NULL,
ADD CONSTRAINT "DemographicData_pkey" PRIMARY KEY ("demographicDataId");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PATIENT';
