/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `DemographicData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DemographicData_userID_key" ON "DemographicData"("userID");
