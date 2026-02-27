/*
  Warnings:

  - A unique constraint covering the columns `[demographicDataId]` on the table `DemographicData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pairId]` on the table `Pairs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reportId]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DemographicData_demographicDataId_key" ON "DemographicData"("demographicDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Pairs_pairId_key" ON "Pairs"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reportId_key" ON "Report"("reportId");
